import exifr from "exifr";
import { useEffect, useState } from "react";

export interface ExifData {
  dateTaken?: string;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutter?: string;
  iso?: number;
  latitude?: number;
  longitude?: number;
  width?: number;
  height?: number;
}

function formatShutter(val: number): string {
  if (val >= 1) return `${val}s`;
  return `1/${Math.round(1 / val)}s`;
}

export function useExifData(url: string | null): {
  data: ExifData | null;
  loading: boolean;
} {
  const [data, setData] = useState<ExifData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url || url.startsWith("/")) {
      setData(null);
      return;
    }

    setLoading(true);
    setData(null);

    exifr
      .parse(url, {
        tiff: true,
        exif: true,
        gps: true,
        pick: [
          "DateTimeOriginal",
          "CreateDate",
          "Make",
          "Model",
          "LensModel",
          "FocalLength",
          "FNumber",
          "ExposureTime",
          "ISO",
          "ImageWidth",
          "ImageHeight",
          "ExifImageWidth",
          "ExifImageHeight",
          "latitude",
          "longitude",
        ],
      })
      .then((exif) => {
        if (!exif) {
          setLoading(false);
          return;
        }

        const camera = [exif.Make, exif.Model]
          .filter(Boolean)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        const result: ExifData = {
          dateTaken: exif.DateTimeOriginal?.toISOString?.() ?? exif.CreateDate?.toISOString?.(),
          camera: camera || undefined,
          lens: exif.LensModel || undefined,
          focalLength: exif.FocalLength ? `${exif.FocalLength}mm` : undefined,
          aperture: exif.FNumber ? `f/${exif.FNumber}` : undefined,
          shutter: exif.ExposureTime ? formatShutter(exif.ExposureTime) : undefined,
          iso: exif.ISO,
          latitude: exif.latitude,
          longitude: exif.longitude,
          width: exif.ExifImageWidth || exif.ImageWidth,
          height: exif.ExifImageHeight || exif.ImageHeight,
        };

        setData(result);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}
