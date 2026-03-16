import type { GalleryCategory } from "@/app/actions/gallery";
import { Thumbnail } from "./thumbnail";

export function CategoryBrowser({
  categories,
  onSelect,
}: {
  categories: GalleryCategory[];
  onSelect: (name: string) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat) => {
          const preview = cat.images[0];
          return (
            <button
              key={cat.name}
              onClick={() => onSelect(cat.name)}
              className="rounded-lg overflow-hidden border border-control-border hover:border-control-border-hover transition-all group bg-black/10 text-left"
            >
              <div className="aspect-[3/2] overflow-hidden bg-black/20">
                {preview && (
                  <Thumbnail
                    image={preview}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="px-2 py-1.5 flex items-baseline justify-between gap-1">
                <span className="text-xs text-primary truncate">
                  {cat.name}/
                </span>
                <span className="text-2xs text-ghost shrink-0">
                  {cat.images.length}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
