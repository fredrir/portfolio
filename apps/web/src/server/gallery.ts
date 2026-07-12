import { createServerFn } from "@tanstack/react-start";

import { api, traceHeaders } from "@/server/api";

export interface GalleryImage {
  src: string;
  originalSrc: string;
  filename: string;
  date?: string;
  contentType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  camera?: string;
  lens?: string;
  focalLengthMm?: number;
  aperture?: number;
  shutterSeconds?: number;
  iso?: number;
  latitude?: number;
  longitude?: number;
}

export interface GalleryCategory {
  name: string;
  images: GalleryImage[];
}

/** Gallery content from the media pipeline, grouped and localized by category. */
export const getGalleryData = createServerFn()
  .validator((data: { uncategorized: string; projects: string }) => data)
  .handler(async ({ data: labels }): Promise<GalleryCategory[]> => {
    const { data } = await api
      .GET("/api/v1/gallery", { headers: traceHeaders() })
      .catch(() => ({ data: null }));

    return (data ?? [])
      .map((category) => ({
        name:
          category.name === "uncategorized"
            ? labels.uncategorized
            : category.name === "projects"
              ? labels.projects
              : category.name,
        images: category.images.map((image) => ({
          src: image.src,
          originalSrc: image.originalSrc,
          filename: image.filename,
          date: image.date ?? undefined,
          contentType: image.contentType,
          sizeBytes: image.sizeBytes,
          width: image.width ?? undefined,
          height: image.height ?? undefined,
          camera: image.camera ?? undefined,
          lens: image.lens ?? undefined,
          focalLengthMm: image.focalLengthMm ?? undefined,
          aperture: image.aperture ?? undefined,
          shutterSeconds: image.shutterSeconds ?? undefined,
          iso: image.iso ?? undefined,
          latitude: image.latitude ?? undefined,
          longitude: image.longitude ?? undefined,
        })),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });
