use std::io::Cursor;

use image::codecs::avif::AvifEncoder;
use image::{DynamicImage, ImageFormat, ImageReader, Limits};
use sha2::{Digest, Sha256};

const MAX_DIMENSION: u32 = 12_000;
const AVIF_SPEED: u8 = 8;
const AVIF_QUALITY: u8 = 62;
const WEBP_QUALITY: f32 = 82.0;

#[derive(Debug, thiserror::Error)]
pub enum ProcessError {
    #[error("unsupported image format")]
    UnsupportedFormat,
    #[error("failed to decode image: {0}")]
    Decode(String),
    #[error("failed to encode {format}: {message}")]
    Encode {
        format: &'static str,
        message: String,
    },
}

pub struct Variant {
    pub format: &'static str,
    pub content_type: &'static str,
    pub key: String,
    pub bytes: Vec<u8>,
    pub width: u32,
    pub height: u32,
}

pub struct Processed {
    pub width: u32,
    pub height: u32,
    /// Hex-encoded SHA-256 of the original bytes.
    pub content_hash: String,
    pub variants: Vec<Variant>,
}

fn sha256_hex(bytes: &[u8]) -> String {
    hex::encode(Sha256::digest(bytes))
}

/// Validate, decode, and re-encode an original image into AVIF and WebP
/// variants under content-hashed keys. Re-encoding from decoded pixels
/// drops all original metadata (EXIF, GPS, ...).
pub fn process_image(original: &[u8]) -> Result<Processed, ProcessError> {
    let format = image::guess_format(original).map_err(|_| ProcessError::UnsupportedFormat)?;
    if !matches!(
        format,
        ImageFormat::Jpeg | ImageFormat::Png | ImageFormat::WebP
    ) {
        return Err(ProcessError::UnsupportedFormat);
    }

    let mut reader = ImageReader::new(Cursor::new(original))
        .with_guessed_format()
        .map_err(|e| ProcessError::Decode(e.to_string()))?;
    let mut limits = Limits::default();
    limits.max_image_width = Some(MAX_DIMENSION);
    limits.max_image_height = Some(MAX_DIMENSION);
    reader.limits(limits);

    let decoded = reader
        .decode()
        .map_err(|e| ProcessError::Decode(e.to_string()))?;
    let (width, height) = (decoded.width(), decoded.height());

    // Normalize the color model so both encoders accept the buffer.
    let normalized = if decoded.color().has_alpha() {
        DynamicImage::ImageRgba8(decoded.to_rgba8())
    } else {
        DynamicImage::ImageRgb8(decoded.to_rgb8())
    };

    let webp_bytes = webp::Encoder::from_image(&normalized)
        .map_err(|message| ProcessError::Encode {
            format: "webp",
            message: message.to_owned(),
        })?
        .encode(WEBP_QUALITY)
        .to_vec();

    let mut avif_bytes = Vec::new();
    normalized
        .write_with_encoder(AvifEncoder::new_with_speed_quality(
            &mut avif_bytes,
            AVIF_SPEED,
            AVIF_QUALITY,
        ))
        .map_err(|e| ProcessError::Encode {
            format: "avif",
            message: e.to_string(),
        })?;

    let variants = vec![
        Variant {
            format: "avif",
            content_type: "image/avif",
            key: format!("variants/{}.avif", sha256_hex(&avif_bytes)),
            bytes: avif_bytes,
            width,
            height,
        },
        Variant {
            format: "webp",
            content_type: "image/webp",
            key: format!("variants/{}.webp", sha256_hex(&webp_bytes)),
            bytes: webp_bytes,
            width,
            height,
        },
    ];

    Ok(Processed {
        width,
        height,
        content_hash: sha256_hex(original),
        variants,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_png(width: u32, height: u32) -> Vec<u8> {
        let img = image::RgbImage::from_fn(width, height, |x, y| {
            image::Rgb([(x % 256) as u8, (y % 256) as u8, 128])
        });
        let mut bytes = Vec::new();
        DynamicImage::ImageRgb8(img)
            .write_to(&mut Cursor::new(&mut bytes), ImageFormat::Png)
            .unwrap();
        bytes
    }

    #[test]
    fn processes_png_into_avif_and_webp() {
        let original = sample_png(64, 48);
        let processed = process_image(&original).unwrap();

        assert_eq!(processed.width, 64);
        assert_eq!(processed.height, 48);
        assert_eq!(processed.content_hash.len(), 64);
        assert_eq!(processed.variants.len(), 2);

        let formats: Vec<_> = processed.variants.iter().map(|v| v.format).collect();
        assert_eq!(formats, vec!["avif", "webp"]);
        for variant in &processed.variants {
            assert!(!variant.bytes.is_empty());
            assert_eq!(variant.width, 64);
            assert_eq!(variant.height, 48);
            assert!(variant.key.starts_with("variants/"));
            assert!(variant.key.contains(&sha256_hex(&variant.bytes)));
        }
    }

    #[test]
    fn variants_are_deterministic_and_content_hashed() {
        let original = sample_png(16, 16);
        let a = process_image(&original).unwrap();
        let b = process_image(&original).unwrap();
        assert_eq!(a.variants[0].key, b.variants[0].key);
        assert_eq!(a.variants[1].key, b.variants[1].key);
    }

    #[test]
    fn rejects_non_image_bytes() {
        assert!(matches!(
            process_image(b"definitely not an image"),
            Err(ProcessError::UnsupportedFormat)
        ));
    }

    #[test]
    fn rejects_unsupported_image_format() {
        // Smallest valid GIF header; GIF decodes but is not in the allowlist.
        let gif = b"GIF89a\x01\x00\x01\x00\x00\x00\x00;";
        assert!(matches!(
            process_image(gif),
            Err(ProcessError::UnsupportedFormat)
        ));
    }
}
