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
    <div className="@sm:mb-2 mb-1.5 flex shrink-0 gap-1 overflow-x-auto">
      {categories.map((cat) => (
        <button
          key={cat.name}
          type="button"
          onClick={() => onSelect(cat.name)}
          className={`whitespace-nowrap rounded px-2 @sm:py-1 py-0.5 text-2xs transition-all ${
            activeCategory === cat.name
              ? "border border-control-border-hover bg-surface-elevated text-primary"
              : "border border-transparent text-faded hover:bg-control-hover hover:text-primary-medium"
          }`}
        >
          {cat.name}/<span className="ml-1 text-ghost">{cat.images.length}</span>
        </button>
      ))}
    </div>
  );
}
