import type { GalleryCategory } from "@/server/gallery";
import { Thumbnail } from "./thumbnail";

export function CategoryBrowser({
  categories,
  onSelect,
}: {
  categories: GalleryCategory[];
  onSelect: (name: string) => void;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => {
          const preview = cat.images[0];
          return (
            <button
              key={cat.name}
              onClick={() => onSelect(cat.name)}
              className="group overflow-hidden rounded-lg border border-control-border bg-black/10 text-left transition-all hover:border-control-border-hover"
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
