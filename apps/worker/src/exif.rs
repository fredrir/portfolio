use std::io::Cursor;

// `::exif` paths: the kamadak-exif crate's lib name collides with this module.
use ::exif::{Exif, In, Reader, Tag, Value};
use time::PrimitiveDateTime;

/// DB constraint bound for the free-text fields (camera, lens).
const MAX_TEXT_CHARS: usize = 256;

/// Camera metadata pulled from an original image. Variants are re-encoded from
/// decoded pixels and carry no EXIF, so this is captured before it is lost.
/// Every field is optional: many originals (screenshots, exports) have none.
#[derive(Debug, Default, PartialEq)]
pub struct ExifSummary {
    /// EXIF wall-clock capture time; the format carries no timezone.
    pub taken_at: Option<PrimitiveDateTime>,
    pub camera: Option<String>,
    pub lens: Option<String>,
    pub focal_length_mm: Option<f32>,
    pub aperture: Option<f32>,
    pub shutter_seconds: Option<f64>,
    pub iso: Option<i32>,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
}

/// Best-effort EXIF extraction; anything unreadable becomes None rather than
/// an error so metadata problems can never fail media processing.
pub fn extract_exif(original: &[u8]) -> ExifSummary {
    let Ok(parsed) = Reader::new().read_from_container(&mut Cursor::new(original)) else {
        return ExifSummary::default();
    };

    let camera = match (ascii(&parsed, Tag::Make), ascii(&parsed, Tag::Model)) {
        // Models like "NIKON Z 6" already repeat the make.
        (Some(make), Some(model)) if model.to_lowercase().contains(&make.to_lowercase()) => {
            Some(model)
        }
        (make, model) => {
            let joined = [make, model]
                .into_iter()
                .flatten()
                .collect::<Vec<_>>()
                .join(" ");
            (!joined.is_empty()).then_some(joined)
        }
    };

    ExifSummary {
        taken_at: [Tag::DateTimeOriginal, Tag::DateTimeDigitized, Tag::DateTime]
            .iter()
            .find_map(|&tag| datetime(&parsed, tag)),
        camera: camera.map(clamp_text),
        lens: ascii(&parsed, Tag::LensModel).map(clamp_text),
        focal_length_mm: rational(&parsed, Tag::FocalLength).map(|v| v as f32),
        aperture: rational(&parsed, Tag::FNumber).map(|v| v as f32),
        shutter_seconds: rational(&parsed, Tag::ExposureTime),
        iso: parsed
            .get_field(Tag::PhotographicSensitivity, In::PRIMARY)
            .and_then(|f| f.value.get_uint(0))
            .and_then(|v| i32::try_from(v).ok())
            .filter(|&v| v > 0),
        latitude: gps_coord(&parsed, Tag::GPSLatitude, Tag::GPSLatitudeRef, 90.0),
        longitude: gps_coord(&parsed, Tag::GPSLongitude, Tag::GPSLongitudeRef, 180.0),
    }
}

fn clamp_text(value: String) -> String {
    if value.chars().count() <= MAX_TEXT_CHARS {
        value
    } else {
        value.chars().take(MAX_TEXT_CHARS).collect()
    }
}

fn ascii(exif: &Exif, tag: Tag) -> Option<String> {
    let field = exif.get_field(tag, In::PRIMARY)?;
    let Value::Ascii(ref lines) = field.value else {
        return None;
    };
    let joined = lines
        .iter()
        .map(|line| String::from_utf8_lossy(line))
        .collect::<Vec<_>>()
        .join(" ");
    let normalized = joined
        .replace('\0', " ")
        .split_whitespace()
        .collect::<Vec<_>>()
        .join(" ");
    (!normalized.is_empty()).then_some(normalized)
}

/// First rational of the field as f64, rejecting zero-denominator garbage.
fn rational(exif: &Exif, tag: Tag) -> Option<f64> {
    let field = exif.get_field(tag, In::PRIMARY)?;
    let value = match field.value {
        Value::Rational(ref v) => v.first()?.to_f64(),
        Value::SRational(ref v) => v.first()?.to_f64(),
        _ => return None,
    };
    (value.is_finite() && value > 0.0).then_some(value)
}

fn datetime(exif: &Exif, tag: Tag) -> Option<PrimitiveDateTime> {
    let field = exif.get_field(tag, In::PRIMARY)?;
    let Value::Ascii(ref lines) = field.value else {
        return None;
    };
    let parsed = ::exif::DateTime::from_ascii(lines.first()?).ok()?;
    // from_calendar_date/from_hms validate what EXIF does not (broken cameras
    // write "0000:00:00 00:00:00" or out-of-range days).
    let date = time::Date::from_calendar_date(
        i32::from(parsed.year),
        time::Month::try_from(parsed.month).ok()?,
        parsed.day,
    )
    .ok()?;
    let time = time::Time::from_hms(parsed.hour, parsed.minute, parsed.second).ok()?;
    Some(PrimitiveDateTime::new(date, time))
}

/// Degrees/minutes/seconds plus hemisphere ref folded into a signed decimal,
/// bounded to the coordinate range the DB accepts.
fn gps_coord(exif: &Exif, tag: Tag, ref_tag: Tag, bound: f64) -> Option<f64> {
    let field = exif.get_field(tag, In::PRIMARY)?;
    let Value::Rational(ref dms) = field.value else {
        return None;
    };
    let degrees = dms.first()?.to_f64();
    let minutes = dms.get(1).map_or(0.0, |r| r.to_f64());
    let seconds = dms.get(2).map_or(0.0, |r| r.to_f64());
    let magnitude = degrees + minutes / 60.0 + seconds / 3600.0;

    let reference = ascii(exif, ref_tag)?;
    let sign = match reference.chars().next()?.to_ascii_uppercase() {
        'N' | 'E' => 1.0,
        'S' | 'W' => -1.0,
        _ => return None,
    };

    let coordinate = sign * magnitude;
    (coordinate.is_finite() && coordinate.abs() <= bound).then_some(coordinate)
}

#[cfg(test)]
mod tests {
    use ::exif::experimental::Writer;
    use ::exif::{Field, Rational};

    use super::*;

    fn tiff_with(fields: &[Field]) -> Vec<u8> {
        let mut writer = Writer::new();
        for field in fields {
            writer.push_field(field);
        }
        let mut buf = Cursor::new(Vec::new());
        writer.write(&mut buf, false).unwrap();
        buf.into_inner()
    }

    fn ascii_field(tag: Tag, text: &str) -> Field {
        Field {
            tag,
            ifd_num: In::PRIMARY,
            value: Value::Ascii(vec![text.as_bytes().to_vec()]),
        }
    }

    fn rational_field(tag: Tag, num: u32, denom: u32) -> Field {
        Field {
            tag,
            ifd_num: In::PRIMARY,
            value: Value::Rational(vec![Rational { num, denom }]),
        }
    }

    #[test]
    fn non_image_bytes_yield_empty_summary() {
        assert_eq!(extract_exif(b"not an image"), ExifSummary::default());
    }

    #[test]
    fn image_without_exif_yields_empty_summary() {
        let img = image::RgbImage::from_pixel(4, 4, image::Rgb([1, 2, 3]));
        let mut bytes = Vec::new();
        image::DynamicImage::ImageRgb8(img)
            .write_to(&mut Cursor::new(&mut bytes), image::ImageFormat::Png)
            .unwrap();
        assert_eq!(extract_exif(&bytes), ExifSummary::default());
    }

    #[test]
    fn extracts_capture_fields() {
        let bytes = tiff_with(&[
            ascii_field(Tag::DateTimeOriginal, "2026:07:11 12:34:56"),
            ascii_field(Tag::Make, "FUJIFILM"),
            ascii_field(Tag::Model, "X-T5"),
            ascii_field(Tag::LensModel, "XF23mmF1.4 R LM WR"),
            rational_field(Tag::FocalLength, 23, 1),
            rational_field(Tag::FNumber, 14, 10),
            rational_field(Tag::ExposureTime, 1, 250),
            Field {
                tag: Tag::PhotographicSensitivity,
                ifd_num: In::PRIMARY,
                value: Value::Short(vec![320]),
            },
        ]);

        let summary = extract_exif(&bytes);
        assert_eq!(
            summary.taken_at.map(|t| t.to_string()),
            Some("2026-07-11 12:34:56.0".to_owned())
        );
        assert_eq!(summary.camera.as_deref(), Some("FUJIFILM X-T5"));
        assert_eq!(summary.lens.as_deref(), Some("XF23mmF1.4 R LM WR"));
        assert_eq!(summary.focal_length_mm, Some(23.0));
        assert_eq!(summary.aperture, Some(1.4));
        assert_eq!(summary.shutter_seconds, Some(0.004));
        assert_eq!(summary.iso, Some(320));
    }

    #[test]
    fn model_containing_make_is_not_repeated() {
        let bytes = tiff_with(&[
            ascii_field(Tag::Make, "NIKON CORPORATION"),
            ascii_field(Tag::Model, "NIKON Z 6"),
        ]);
        // "NIKON CORPORATION" is not a substring of "NIKON Z 6", so both are
        // kept; a model that repeats the make verbatim collapses to the model.
        assert_eq!(
            extract_exif(&bytes).camera.as_deref(),
            Some("NIKON CORPORATION NIKON Z 6")
        );

        let bytes = tiff_with(&[
            ascii_field(Tag::Make, "Canon"),
            ascii_field(Tag::Model, "Canon EOS R5"),
        ]);
        assert_eq!(extract_exif(&bytes).camera.as_deref(), Some("Canon EOS R5"));
    }

    #[test]
    fn converts_gps_dms_with_hemisphere_signs() {
        let bytes = tiff_with(&[
            Field {
                tag: Tag::GPSLatitude,
                ifd_num: In::PRIMARY,
                value: Value::Rational(vec![
                    Rational { num: 59, denom: 1 },
                    Rational { num: 54, denom: 1 },
                    Rational { num: 45, denom: 1 },
                ]),
            },
            ascii_field(Tag::GPSLatitudeRef, "N"),
            Field {
                tag: Tag::GPSLongitude,
                ifd_num: In::PRIMARY,
                value: Value::Rational(vec![
                    Rational { num: 10, denom: 1 },
                    Rational { num: 44, denom: 1 },
                    Rational { num: 45, denom: 1 },
                ]),
            },
            ascii_field(Tag::GPSLongitudeRef, "W"),
        ]);

        let summary = extract_exif(&bytes);
        let latitude = summary.latitude.unwrap();
        let longitude = summary.longitude.unwrap();
        assert!((latitude - 59.9125).abs() < 1e-6);
        assert!((longitude + 10.745833).abs() < 1e-5);
    }

    #[test]
    fn rejects_invalid_dates_and_zero_denominators() {
        let bytes = tiff_with(&[
            ascii_field(Tag::DateTimeOriginal, "0000:00:00 00:00:00"),
            rational_field(Tag::FocalLength, 23, 0),
            rational_field(Tag::ExposureTime, 0, 250),
        ]);

        let summary = extract_exif(&bytes);
        assert_eq!(summary.taken_at, None);
        assert_eq!(summary.focal_length_mm, None);
        assert_eq!(summary.shutter_seconds, None);
    }

    #[test]
    fn clamps_oversized_text_fields() {
        let long_model = "X".repeat(400);
        let bytes = tiff_with(&[ascii_field(Tag::Model, &long_model)]);
        assert_eq!(
            extract_exif(&bytes).camera.map(|c| c.chars().count()),
            Some(MAX_TEXT_CHARS)
        );
    }
}
