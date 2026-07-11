use serde::Deserialize;

/// Classic S3 notification message. Messages without `Records` (for example
/// `s3:TestEvent`) deserialize to an empty list and are skipped.
#[derive(Debug, Deserialize)]
pub struct S3EventMessage {
    #[serde(rename = "Records", default)]
    pub records: Vec<S3Record>,
}

#[derive(Debug, Deserialize)]
pub struct S3Record {
    #[serde(rename = "eventName")]
    pub event_name: String,
    pub s3: S3Entity,
}

#[derive(Debug, Deserialize)]
pub struct S3Entity {
    pub bucket: S3Bucket,
    pub object: S3Object,
}

#[derive(Debug, Deserialize)]
pub struct S3Bucket {
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct S3Object {
    /// URL-encoded object key (spaces arrive as `+`).
    pub key: String,
    #[serde(rename = "eTag", default)]
    pub e_tag: Option<String>,
    #[serde(default)]
    pub sequencer: Option<String>,
}

impl S3Record {
    pub fn decoded_key(&self) -> String {
        url_decode_key(&self.s3.object.key)
    }

    /// Stable identifier for exactly-once processing.
    pub fn idempotency_id(&self) -> String {
        let marker = self
            .s3
            .object
            .sequencer
            .as_deref()
            .or(self.s3.object.e_tag.as_deref())
            .unwrap_or("");
        format!("{}/{}#{}", self.s3.bucket.name, self.decoded_key(), marker)
    }
}

fn url_decode_key(key: &str) -> String {
    let with_spaces = key.replace('+', " ");
    let bytes = with_spaces.as_bytes();
    let mut out = Vec::with_capacity(bytes.len());
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'%'
            && i + 2 < bytes.len()
            && let Ok(byte) = u8::from_str_radix(&with_spaces[i + 1..i + 3], 16)
        {
            out.push(byte);
            i += 3;
            continue;
        }
        out.push(bytes[i]);
        i += 1;
    }
    String::from_utf8_lossy(&out).into_owned()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn decodes_url_encoded_keys() {
        assert_eq!(
            url_decode_key("originals/abc/My+Photo%21.jpg"),
            "originals/abc/My Photo!.jpg"
        );
        assert_eq!(url_decode_key("plain/key.png"), "plain/key.png");
    }

    #[test]
    fn test_event_has_no_records() {
        let msg: S3EventMessage =
            serde_json::from_str(r#"{"Service":"Amazon S3","Event":"s3:TestEvent"}"#).unwrap();
        assert!(msg.records.is_empty());
    }

    #[test]
    fn parses_object_created_record() {
        let json = r#"{"Records":[{"eventName":"ObjectCreated:Put",
            "s3":{"bucket":{"name":"b"},
                  "object":{"key":"originals/x/a.jpg","eTag":"e1","sequencer":"s1"}}}]}"#;
        let msg: S3EventMessage = serde_json::from_str(json).unwrap();
        let record = &msg.records[0];
        assert_eq!(record.decoded_key(), "originals/x/a.jpg");
        assert_eq!(record.idempotency_id(), "b/originals/x/a.jpg#s1");
    }
}

#[cfg(test)]
mod props {
    use proptest::prelude::*;

    use super::url_decode_key;

    fn s3_url_encode(input: &str) -> String {
        let mut out = String::new();
        for byte in input.as_bytes() {
            match byte {
                b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'.' | b'_' | b'~' | b'/' => {
                    out.push(*byte as char)
                }
                b' ' => out.push('+'),
                other => out.push_str(&format!("%{other:02X}")),
            }
        }
        out
    }

    proptest! {
        #[test]
        fn decoding_inverts_s3_key_encoding(key in "[a-zA-Z0-9 /._%+()\\-]{0,64}") {
            prop_assert_eq!(url_decode_key(&s3_url_encode(&key)), key);
        }
    }
}
