import type { GalleryImage } from "@/server/gallery";
import { Thumbnail } from "./thumbnail";
import { formatDate } from "../utils";

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
    <div className="flex-1 overflow-y-auto min-h-0">
      <div
        className={`grid gap-3 ${
          narrow
            ? "grid-cols-2"
            : compact
              ? "grid-cols-4 @xs:grid-cols-5 @sm:grid-cols-6 @md:grid-cols-8"
              : "grid-cols-3 @xs:grid-cols-4 @sm:grid-cols-5 @md:grid-cols-6 @lg:grid-cols-7"
        }`}
      >
        {images.map((img) => (
          <button
            key={img.src}
            onClick={() => onSelect(img)}
            className="rounded overflow-hidden border border-control-border hover:border-control-border-hover transition-all group bg-black/10 relative"
          >
            <div className="aspect-[4/3]">
              <Thumbnail
                image={img}
                className="group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            {img.date && (
              <div
                className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-1 py-0.5 text-3xs text-white/70 text-left ${
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
