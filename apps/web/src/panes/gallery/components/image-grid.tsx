import type { GalleryImage } from "@/server/gallery";
import { formatDate } from "../utils";
import { Thumbnail } from "./thumbnail";

export function ImageGrid({
  images,
  narrow,
  compact,
  onSelect,
}: {
  images: GalleryImage[];
  narrow: boolean;
  compact: boolean;
  onSelect: (image: GalleryImage) => void;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div
        className={`grid gap-3 ${
          narrow
            ? "grid-cols-2"
            : compact
              ? "@md:grid-cols-8 @sm:grid-cols-6 @xs:grid-cols-5 grid-cols-4"
              : "@lg:grid-cols-7 @md:grid-cols-6 @sm:grid-cols-5 @xs:grid-cols-4 grid-cols-3"
        }`}
      >
        {images.map((img) => (
          <button
            key={img.src}
            onClick={() => onSelect(img)}
            className="group relative overflow-hidden rounded border border-control-border bg-black/10 transition-all hover:border-control-border-hover"
          >
            <div className="aspect-[4/3]">
              <Thumbnail
                image={img}
                className="transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            {img.date && (
              <div
                className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-1 py-0.5 text-left text-3xs text-white/70 ${
                  narrow ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                } transition-opacity`}
              >
                {formatDate(img.date)}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
