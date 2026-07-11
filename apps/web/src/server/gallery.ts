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

/** Gallery content from the media pipeline, grouped by category. */
export const getGalleryData = createServerFn()
  .validator((data: { uncategorized: string; projects: string }) => data)
  .handler(async ({ data: labels }): Promise<GalleryCategory[]> => {
    const { data } = await api
      .GET("/api/v1/gallery", { headers: traceHeaders() })
      .catch(() => ({ data: null }));

    const hasDynamicProjects = (data ?? []).some(
      (category) => category.name === STATIC_PROJECTS.name,
    );
    const dynamicCategories: GalleryCategory[] = (data ?? []).map((category) => ({
      name:
        category.name === "uncategorized"
          ? labels.uncategorized
          : category.name === STATIC_PROJECTS.name
            ? labels.projects
            : category.name,
      images: category.images.map((image) => ({
        src: image.src,
        originalSrc: image.originalSrc,
        filename: image.filename,
        date: image.date ?? undefined,
      })),
    }));

    const categories = [...dynamicCategories];
    if (!hasDynamicProjects) {
      categories.push({ ...STATIC_PROJECTS, name: labels.projects });
    }
    return categories.sort((a, b) => a.name.localeCompare(b.name));
  });
