"use server";

import { readdir } from "fs/promises";
import { join } from "path";

export interface GalleryCategory {
  name: string;
  images: string[];
}

const GALLERY_DIR = join(process.cwd(), "public", "gallery");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);

export async function getGalleryData(): Promise<GalleryCategory[]> {
  try {
    const entries = await readdir(GALLERY_DIR, { withFileTypes: true });
    const categories: GalleryCategory[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const categoryDir = join(GALLERY_DIR, entry.name);
      const files = await readdir(categoryDir);
      const images = files
        .filter((f) => {
          const ext = f.slice(f.lastIndexOf(".")).toLowerCase();
          return IMAGE_EXTENSIONS.has(ext);
        })
        .map((f) => `/gallery/${entry.name}/${f}`);

      if (images.length > 0) {
        categories.push({ name: entry.name, images });
      }
    }

    return categories.sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}
