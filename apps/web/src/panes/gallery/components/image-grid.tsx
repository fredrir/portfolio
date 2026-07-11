import { useEffect, useRef } from "react";
import type { GalleryImage } from "@/server/gallery";
import { formatDate } from "../utils";
import { Thumbnail } from "./thumbnail";

export function ImageGrid({
  images,
  narrow,
  compact,
  activeIndex,
  onActiveIndexChange,
  onSelect,
}: {
  images: GalleryImage[];
  narrow: boolean;
  compact: boolean;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelect: (image: GalleryImage) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current
      ?.querySelector<HTMLElement>(`[data-gallery-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto">
      <div
        data-gallery-grid
        className={`grid gap-3 ${
          narrow
            ? "grid-cols-2"
            : compact
              ? "@md:grid-cols-8 @sm:grid-cols-6 @xs:grid-cols-5 grid-cols-4"
              : "@lg:grid-cols-7 @md:grid-cols-6 @sm:grid-cols-5 @xs:grid-cols-4 grid-cols-3"
        }`}
      >
        {images.map((img, index) => (
          <button
            key={img.src}
            type="button"
            data-gallery-index={index}
            aria-current={activeIndex === index ? "true" : undefined}
            onClick={() => onSelect(img)}
            onFocus={() => onActiveIndexChange(index)}
            className={`group relative overflow-hidden rounded border bg-black/10 transition-all hover:border-control-border-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-muted ${
              activeIndex === index
                ? "border-primary-muted ring-1 ring-primary-hint"
                : "border-control-border"
            }`}
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
