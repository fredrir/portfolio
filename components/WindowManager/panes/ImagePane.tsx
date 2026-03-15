"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getGalleryData, type GalleryCategory } from "@/app/actions/gallery";

function isSvg(src: string) {
  return src.toLowerCase().endsWith(".svg");
}

export function ImagePane() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [compact, setCompact] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getGalleryData().then((data) => {
      setCategories(data);
      if (data.length > 0) setActiveCategory(data[0].name);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCompact(entry.contentRect.height < 250);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const currentCategory = categories.find((c) => c.name === activeCategory);

  return (
    <div ref={containerRef} className="p-2 @xs:p-2.5 @sm:p-3 font-mono text-xs h-full flex flex-col @container">
      {!compact && (
        <div className="text-muted-foreground/50 mb-1.5 @sm:mb-2 shrink-0">
          <span className="text-primary">$</span> ls ~/gallery/
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-muted-foreground/40 animate-pulse">
            scanning directories...
          </span>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
          <span className="text-2xl">📂</span>
          <span>~/gallery/ is empty</span>
          <span className="text-2xs text-muted-foreground/25">
            add images to /public/gallery/&lt;category&gt;/
          </span>
        </div>
      ) : (
        <>
          <div className="flex gap-1 mb-1.5 @sm:mb-2 overflow-x-auto shrink-0">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setSelectedImage(null);
                }}
                className={`px-2 py-0.5 @sm:py-1 rounded text-2xs whitespace-nowrap transition-all ${
                  activeCategory === cat.name
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground/50 border border-transparent hover:text-primary/70 hover:bg-primary/5"
                }`}
              >
                {cat.name}/
                <span className="text-muted-foreground/30 ml-1">
                  {cat.images.length}
                </span>
              </button>
            ))}
          </div>

          {selectedImage ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-1 shrink-0">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-primary/50 hover:text-primary text-2xs transition-colors"
                >
                  ← back
                </button>
                <span className="text-muted-foreground/40 text-2xs truncate">
                  {selectedImage.split("/").pop()}
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center min-h-0 rounded-md overflow-hidden border border-primary/10 bg-black/20 p-2">
                {isSvg(selectedImage) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedImage}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <Image
                    src={selectedImage}
                    alt=""
                    width={800}
                    height={600}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className={`grid gap-1.5 @xs:gap-2 ${
                compact
                  ? "grid-cols-3 @xs:grid-cols-4 @sm:grid-cols-5 @md:grid-cols-6"
                  : "grid-cols-2 @xs:grid-cols-3 @sm:grid-cols-4 @md:grid-cols-5 @lg:grid-cols-6"
              }`}>
                {currentCategory?.images.map((src) => {
                  const filename = src.split("/").pop() ?? "";
                  return (
                    <button
                      key={src}
                      onClick={() => setSelectedImage(src)}
                      className="rounded-md overflow-hidden border border-primary/10 hover:border-primary/30 transition-all group bg-black/10 flex flex-col"
                    >
                      <div className={`flex-1 min-h-0 ${compact ? "aspect-[4/3]" : "aspect-square"}`}>
                        {isSvg(src) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={src}
                            alt={filename}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <Image
                            src={src}
                            alt={filename}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        )}
                      </div>
                      <div className="px-1 py-0.5 text-3xs text-muted-foreground/40 truncate text-left group-hover:text-muted-foreground/60 transition-colors">
                        {filename}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!compact && (
            <div className="pt-1 border-t border-primary/10 text-muted-foreground/30 text-2xs mt-1 flex justify-between shrink-0">
              <span>
                {currentCategory?.images.length ?? 0} images
              </span>
              <span className="text-primary/30">~/gallery/{activeCategory}/</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
