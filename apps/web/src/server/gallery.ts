import { createServerFn } from "@tanstack/react-start";

import { api, traceHeaders } from "@/server/api";

export interface GalleryImage {
  src: string;
  originalSrc: string;
  filename: string;
  date?: string;
}

export interface GalleryCategory {
  name: string;
  images: GalleryImage[];
}

// Bundled project screenshots; superseded automatically once a "projects"
// category exists in the media pipeline (post gallery migration).
const STATIC_PROJECTS: GalleryCategory = {
  name: "projects",
  images: [
    "/gallery/projects/appkom.png",
    "/gallery/projects/app-picture.png",
    "/gallery/projects/app-picture-2.jpg",
    "/gallery/projects/app-picture-3.jpg",
    "/gallery/projects/movie-tracker.png",
    "/gallery/projects/norges-tilstand.png",
    "/gallery/projects/onlinefondet.png",
    "/gallery/projects/online-opptak.png",
    "/gallery/projects/onlove.webp",
    "/gallery/projects/rif.png",
    "/gallery/projects/seniorbank.png",
    "/gallery/projects/y.png",
  ].map((src) => ({
    src,
    originalSrc: src,
    filename: src.split("/").pop() ?? "",
  })),
};

function parseDateFromFilename(filename: string): string | undefined {
  const match = filename.match(/^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/);
  if (!match) return undefined;
  const [, y, m, d, h, min, s] = match;
  return `${y}-${m}-${d}T${h}:${min}:${s}`;
}

/** Gallery content from the media pipeline, grouped by category. */
export const getGalleryData = createServerFn()
  .validator((data: { uncategorized: string; projects: string }) => data)
  .handler(async ({ data: labels }): Promise<GalleryCategory[]> => {
  const { data } = await api
    .GET("/api/v1/media", { headers: traceHeaders() })
    .catch(() => ({ data: null }));

  const byCategory = new Map<string, GalleryImage[]>();
  for (const item of data ?? []) {
    const variant = item.variants.find((v) => v.format === "webp") ?? item.variants[0];
    if (!variant?.url) continue;
    const category = item.category ?? labels.uncategorized;
    const images = byCategory.get(category) ?? [];
    images.push({
      src: variant.url,
      originalSrc: variant.url,
      filename: item.filename,
      date: parseDateFromFilename(item.filename),
    });
    byCategory.set(category, images);
  }

  const categories: GalleryCategory[] = Array.from(byCategory.entries()).map(([name, images]) => {
    images.sort((a, b) => {
      if (a.date && b.date) return b.date.localeCompare(a.date);
      return a.filename.localeCompare(b.filename);
    });
    return { name, images };
  });

  if (!byCategory.has(STATIC_PROJECTS.name)) {
    categories.push({ ...STATIC_PROJECTS, name: labels.projects });
  }
  return categories.sort((a, b) => a.name.localeCompare(b.name));
});
