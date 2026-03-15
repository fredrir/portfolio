"use server";

import { getSupabase } from "@/lib/supabase";

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

const SUPABASE_FOLDERS = [
  "Arkiv",
  "Interrail",
  "Krageroe",
  "Oslo",
  "Trondheim",
];

const STATIC_CATEGORIES: GalleryCategory[] = [
  {
    name: "career",
    images: [
      "/gallery/career/appkom.svg",
      "/gallery/career/appkom-dark.svg",
      "/gallery/career/maritime-optima.svg",
      "/gallery/career/maritime-optima-dark.svg",
      "/gallery/career/nat-logo.png",
      "/gallery/career/ntnu-logo.svg",
      "/gallery/career/ntnu-logo-dark.svg",
      "/gallery/career/rif-logo.svg",
      "/gallery/career/rif-logo-dark.svg",
    ].map((src) => ({
      src,
      originalSrc: src,
      filename: src.split("/").pop() ?? "",
    })),
  },
  {
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
  },
];

function parseDateFromFilename(filename: string): string | undefined {
  const match = filename.match(/^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/);
  if (!match) return undefined;
  const [, y, m, d, h, min, s] = match;
  return `${y}-${m}-${d}T${h}:${min}:${s}`;
}

function toRenderUrl(publicUrl: string): string {
  return publicUrl.replace(
    "/storage/v1/object/public/",
    "/storage/v1/render/image/public/",
  );
}

async function getSupabaseCategories(): Promise<GalleryCategory[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const results = await Promise.all(
    SUPABASE_FOLDERS.map(async (folder) => {
      const { data } = await supabase.storage
        .from("Portfolio")
        .list(folder, { limit: 1000 });
      if (!data || data.length === 0) return null;

      const images: GalleryImage[] = data
        .filter((file) => file.name && !file.name.startsWith("."))
        .map((file) => {
          const { data: urlData } = supabase.storage
            .from("Portfolio")
            .getPublicUrl(`${folder}/${file.name}`);
          const publicUrl = urlData.publicUrl;
          const isHeic = file.name.toLowerCase().endsWith(".heic");

          return {
            src: isHeic ? toRenderUrl(publicUrl) : publicUrl,
            originalSrc: publicUrl,
            filename: file.name,
            date: parseDateFromFilename(file.name),
          };
        });

      if (images.length === 0) return null;

      images.sort((a, b) => {
        if (a.date && b.date) return b.date.localeCompare(a.date);
        return a.filename.localeCompare(b.filename);
      });

      return { name: folder, images };
    }),
  );

  return results.filter((r): r is GalleryCategory => r !== null);
}

export async function getGalleryData(): Promise<GalleryCategory[]> {
  const supabaseCategories = await getSupabaseCategories();
  return [...supabaseCategories, ...STATIC_CATEGORIES].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}
