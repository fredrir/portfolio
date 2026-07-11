import type { GalleryCategory } from "@/server/gallery";

export function CategoryTabs({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: GalleryCategory[];
  activeCategory: string | null;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="flex gap-1 mb-1.5 @sm:mb-2 overflow-x-auto shrink-0">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className={`px-2 py-0.5 @sm:py-1 rounded text-2xs whitespace-nowrap transition-all ${
            activeCategory === cat.name
              ? "bg-surface-elevated text-primary border border-control-border-hover"
              : "text-faded border border-transparent hover:text-primary-medium hover:bg-control-hover"
          }`}
        >
          {cat.name}/
          <span className="text-ghost ml-1">{cat.images.length}</span>
        </button>
      ))}
    </div>
  );
}
