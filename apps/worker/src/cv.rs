//! CV release synchronization (plan §16): the CV repository is the source of
//! truth; this task mirrors its latest release assets into S3 and atomically
//! selects the active version per language.

use std::time::Duration;

use sha2::{Digest, Sha256};
use sqlx::PgPool;

const MAX_CV_BYTES: usize = 10 * 1024 * 1024;

pub struct CvSync {
    pub pool: PgPool,
    pub s3: aws_sdk_s3::Client,
    pub bucket: String,
    pub repo: String,
    pub poll: Duration,
}

#[derive(serde::Deserialize)]
struct Release {
    tag_name: String,
    assets: Vec<Asset>,
}

#[derive(serde::Deserialize)]
struct Asset {
    id: i64,
    name: String,
    updated_at: String,
    browser_download_url: String,
}

pub fn lang_for_asset(name: &str) -> Option<&'static str> {
    let lower = name.to_lowercase();
    if !lower.ends_with(".pdf") {
        return None;
    }
    if lower.ends_with("_en.pdf") {
        Some("en")
    } else if lower.ends_with("_nb.pdf") {
        Some("nb")
    } else {
        None
    }
}

pub async fn run(sync: CvSync) {
    let client = match reqwest::Client::builder()
        .user_agent("portfolio-worker (+https://hansteen.dev)")
        .timeout(Duration::from_secs(30))
        .build()
    {
        Ok(client) => client,
        Err(err) => {
            tracing::error!(error = %err, "cv sync disabled: http client failed");
            return;
        }
    };
    loop {
        match sync_once(&sync, &client).await {
            Ok(published) if published > 0 => {
                tracing::info!(published, "cv sync completed");
            }
            Ok(_) => {}
            Err(err) => tracing::error!(error = %err, "cv sync failed"),
        }
        tokio::time::sleep(sync.poll).await;
    }
}

async fn sync_once(sync: &CvSync, client: &reqwest::Client) -> Result<u32, String> {
    let release: Release = client
        .get(format!(
            "https://api.github.com/repos/{}/releases/latest",
            sync.repo
        ))
        .send()
        .await
        .map_err(|e| format!("release fetch: {e}"))?
        .error_for_status()
        .map_err(|e| format!("release fetch: {e}"))?
        .json()
        .await
        .map_err(|e| format!("release parse: {e}"))?;

    let mut published = 0;
    for asset in &release.assets {
        let Some(lang) = lang_for_asset(&asset.name) else {
            continue;
        };
        let known: Option<(bool,)> =
            sqlx::query_as("select active from cv_versions where lang = $1 and asset_id = $2")
                .bind(lang)
                .bind(asset.id)
                .fetch_optional(&sync.pool)
                .await
                .map_err(|e| format!("lookup: {e}"))?;
        if known.map(|(active,)| active).unwrap_or(false) {
            continue;
        }

        let bytes = client
            .get(&asset.browser_download_url)
            .send()
            .await
            .map_err(|e| format!("download {}: {e}", asset.name))?
            .error_for_status()
            .map_err(|e| format!("download {}: {e}", asset.name))?
            .bytes()
            .await
            .map_err(|e| format!("download {}: {e}", asset.name))?;

        if bytes.len() > MAX_CV_BYTES {
            return Err(format!("{} exceeds size limit", asset.name));
        }
        if !bytes.starts_with(b"%PDF-") {
            return Err(format!("{} is not a PDF", asset.name));
        }

        let sha256 = hex::encode(Sha256::digest(&bytes));
        let key = format!("cv/{}/{}/{}", release.tag_name, asset.id, asset.name);
        let size = bytes.len() as i64;

        sync.s3
            .put_object()
            .bucket(&sync.bucket)
            .key(&key)
            .content_type("application/pdf")
            .cache_control("public, max-age=3600")
            .body(bytes.to_vec().into())
            .send()
            .await
            .map_err(|e| format!("upload {key}: {e}"))?;

        let mut tx = sync.pool.begin().await.map_err(|e| format!("tx: {e}"))?;
        sqlx::query("update cv_versions set active = false where lang = $1 and active")
            .bind(lang)
            .execute(&mut *tx)
            .await
            .map_err(|e| format!("deactivate: {e}"))?;
        sqlx::query(
            "insert into cv_versions \
             (lang, release_tag, asset_id, asset_updated_at, s3_key, size_bytes, sha256, active) \
             values ($1, $2, $3, $4::timestamptz, $5, $6, $7, true) \
             on conflict (lang, asset_id) do update set \
                 active = true, \
                 s3_key = excluded.s3_key, \
                 sha256 = excluded.sha256, \
                 release_tag = excluded.release_tag, \
                 asset_updated_at = excluded.asset_updated_at, \
                 size_bytes = excluded.size_bytes",
        )
        .bind(lang)
        .bind(&release.tag_name)
        .bind(asset.id)
        .bind(&asset.updated_at)
        .bind(&key)
        .bind(size)
        .bind(&sha256)
        .execute(&mut *tx)
        .await
        .map_err(|e| format!("insert: {e}"))?;
        tx.commit().await.map_err(|e| format!("commit: {e}"))?;

        tracing::info!(lang, key = %key, sha256 = %sha256, "cv version published");
        published += 1;
    }
    Ok(published)
}

#[cfg(test)]
mod tests {
    use super::lang_for_asset;

    #[test]
    fn maps_language_suffixes() {
        assert_eq!(
            lang_for_asset("CV_Fredrik_Carsten_Hansteen_En.pdf"),
            Some("en")
        );
        assert_eq!(
            lang_for_asset("CV_Fredrik_Carsten_Hansteen_Nb.pdf"),
            Some("nb")
        );
        assert_eq!(lang_for_asset("notes_en.txt"), None);
        assert_eq!(lang_for_asset("CV_fr.pdf"), None);
    }
}

#[cfg(test)]
mod props {
    use proptest::prelude::*;

    use super::lang_for_asset;

    proptest! {
        #[test]
        fn language_only_for_pdf_suffixes(name in ".{0,60}") {
            let lang = lang_for_asset(&name);
            let lower = name.to_lowercase();
            match lang {
                Some("en") => prop_assert!(lower.ends_with("_en.pdf")),
                Some("nb") => prop_assert!(lower.ends_with("_nb.pdf")),
                Some(_) => prop_assert!(false, "unexpected language"),
                None => prop_assert!(
                    !lower.ends_with("_en.pdf") && !lower.ends_with("_nb.pdf")
                ),
            }
        }
    }
}
