import { useEffect, useRef } from "react";
import type { GalleryCategory } from "@/server/gallery";
import { Thumbnail } from "./thumbnail";

export function CategoryBrowser({
  categories,
  activeIndex,
  onActiveIndexChange,
  onSelect,
}: {
  categories: GalleryCategory[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelect: (name: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current
      ?.querySelector<HTMLElement>(`[data-gallery-category-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto">
      <div data-gallery-category-grid className="grid grid-cols-2 gap-3">
        {categories.map((cat, index) => {
          const preview = cat.images[0];
          return (
            <button
              key={cat.name}
              type="button"
              data-gallery-category-index={index}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => onSelect(cat.name)}
              onFocus={() => onActiveIndexChange(index)}
              className={`group overflow-hidden rounded-lg border bg-black/10 text-left transition-all hover:border-control-border-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-muted ${
                activeIndex === index
                  ? "border-primary-muted ring-1 ring-primary-hint"
                  : "border-control-border"
              }`}
            >
              <div className="aspect-[3/2] overflow-hidden bg-black/20">
                {preview && (
                  <Thumbnail
                    image={preview}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex items-baseline justify-between gap-1 px-2 py-1.5">
                <span className="truncate text-primary text-xs">{cat.name}/</span>
                <span className="shrink-0 text-2xs text-ghost">{cat.images.length}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
