"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  getGalleryData,
  type GalleryCategory,
  type GalleryImage,
} from "@/app/actions/gallery";
import { isSvg } from "./utils";
import { useExifData } from "./use-exif";
import type { UiStrings } from "@/shared/types";
import { TriangleIcon } from "@phosphor-icons/react";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Thumbnail({
  image,
  className,
}: {
  image: GalleryImage;
  className?: string;
}) {
  if (isSvg(image.src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={image.src}
        alt={image.filename}
        className={`w-full h-full object-contain p-1.5 ${className ?? ""}`}
      />
    );
  }
  return (
    <Image
      src={image.src}
      alt={image.filename}
      width={200}
      height={150}
      className={`w-full h-full object-cover ${className ?? ""}`}
    />
  );
}

function ImageDetail({
  image,
  onSwipe,
  narrow,
  currentIndex,
  totalCount,
}: {
  image: GalleryImage;
  onSwipe?: (dir: "left" | "right") => void;
  narrow: boolean;
  currentIndex: number;
  totalCount: number;
}) {
  const { data: exif, loading: exifLoading } = useExifData(image.originalSrc);
  const displayDate = exif?.dateTaken ?? image.date ?? null;
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < totalCount - 1;

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!narrow || !onSwipe) return;
      touchRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    },
    [narrow, onSwipe],
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!narrow || !onSwipe || !touchRef.current) return;
      const dx = e.changedTouches[0].clientX - touchRef.current.x;
      const dy = e.changedTouches[0].clientY - touchRef.current.y;
      touchRef.current = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        onSwipe(dx > 0 ? "right" : "left");
      }
    },
    [narrow, onSwipe],
  );

  return (
    <div
      className="flex-1 flex flex-col min-h-0 gap-1"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex-1 flex items-center justify-center min-h-0 rounded-md overflow-hidden border border-control-border bg-black/20 relative">
        {isSvg(image.src) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <Image
            src={image.src}
            alt=""
            width={1200}
            height={900}
            className="max-w-full max-h-full object-contain"
          />
        )}
        {onSwipe && (
          <>
            <button
              onClick={() => hasPrev && onSwipe("right")}
              className={`absolute left-1.5 top-1/2 -translate-y-1/2 z-10 font-mono text-sm px-2 py-3 rounded bg-black/60 backdrop-blur-sm border border-white/10 transition-all ${hasPrev ? "text-primary hover:text-primary-bold hover:bg-black/80 active:scale-95" : "text-white/20 pointer-events-none"}`}
            >
              <TriangleIcon className="-rotate-90" />
            </button>
            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-10 font-mono text-2xs tabular-nums px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-white/50">
              [{currentIndex + 1}/{totalCount}]
            </span>
            <button
              onClick={() => hasNext && onSwipe("left")}
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 z-10 font-mono text-sm px-2 py-3 rounded bg-black/60 backdrop-blur-sm border border-white/10 transition-all ${hasNext ? "text-primary hover:text-primary-bold hover:bg-black/80 active:scale-95" : "text-white/20 pointer-events-none"}`}
            >
              <TriangleIcon className="rotate-90" />
            </button>
          </>
        )}
      </div>

      <div className="shrink-0 flex pt-2 flex-wrap gap-x-3 gap-y-0.5 text-2xs text-faded px-0.5">
        {exifLoading && <span className="animate-pulse">reading exif...</span>}
        {displayDate && <span>{formatDate(displayDate)}</span>}
        {image.filename && <span> {image.filename} </span>}
        {exif?.camera && <span>{exif.camera}</span>}
        {exif?.focalLength && (
          <span>
            {[
              exif.focalLength,
              exif.aperture,
              exif.shutter,
              exif.iso ? `ISO${exif.iso}` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        )}
        {exif?.width && exif?.height && (
          <span>
            {exif.width}×{exif.height}
          </span>
        )}
        {exif?.latitude != null && exif?.longitude != null && (
          <a
            href={`https://www.google.com/maps?q=${exif.latitude},${exif.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-dim hover:text-primary-medium transition-colors"
          >
            {exif.latitude.toFixed(4)}, {exif.longitude.toFixed(4)}
          </a>
        )}
      </div>
    </div>
  );
}

function CategoryBrowser({
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

export function ImagePane({ ui }: { ui: UiStrings }) {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [compact, setCompact] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getGalleryData().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCompact(entry.contentRect.height < 250);
        setNarrow(entry.contentRect.width < 400);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const currentCategory = categories.find((c) => c.name === activeCategory);
  const showBrowser = narrow && !activeCategory;

  const handleSwipe = useCallback(
    (dir: "left" | "right") => {
      if (!selectedImage || !currentCategory) return;
      const images = currentCategory.images;
      const idx = images.findIndex((img) => img.src === selectedImage.src);
      if (idx === -1) return;
      const next = dir === "left" ? idx + 1 : idx - 1;
      if (next >= 0 && next < images.length) {
        setSelectedImage(images[next]);
      }
    },
    [selectedImage, currentCategory],
  );

  return (
    <div
      ref={containerRef}
      className="p-2 @xs:p-2.5 @sm:p-3 font-mono text-xs h-full flex flex-col @container"
    >
      {!compact && (
        <div className="text-faded mb-1.5 @sm:mb-2 shrink-0">
          <span className="text-primary">$</span>{" "}
          {activeCategory ? `ls ~/gallery/${activeCategory}/` : "ls ~/gallery/"}
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-subtle animate-pulse">
            {ui.searchingGallery}
          </span>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-subtle">
          <span className="text-2xl">📂</span>
          <span>{ui.emptyGallery}</span>
        </div>
      ) : showBrowser ? (
        <CategoryBrowser
          categories={categories}
          onSelect={(name) => setActiveCategory(name)}
        />
      ) : (
        <>
          {narrow && !selectedImage ? (
            <div className="flex items-center gap-2 mb-1.5 shrink-0">
              <button
                onClick={() => {
                  setActiveCategory(null);
                  setSelectedImage(null);
                }}
                className="text-primary-muted hover:text-primary active:text-primary transition-colors text-sm py-0.5"
              >
                ← ~/gallery
              </button>
              <span className="text-ghost text-2xs">{activeCategory}/</span>
            </div>
          ) : narrow ? null : (
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
                      ? "bg-surface-elevated text-primary border border-control-border-hover"
                      : "text-faded border border-transparent hover:text-primary-medium hover:bg-control-hover"
                  }`}
                >
                  {cat.name}/
                  <span className="text-ghost ml-1">{cat.images.length}</span>
                </button>
              ))}
            </div>
          )}

          {selectedImage ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-1 shrink-0">
                <button
                  onClick={() => setSelectedImage(null)}
                  className={`text-primary-muted hover:text-primary active:text-primary transition-colors ${narrow ? "text-sm py-1" : "text-2xs"}`}
                >
                  ← {activeCategory}
                </button>
              </div>
              <ImageDetail
                image={selectedImage}
                onSwipe={handleSwipe}
                narrow={narrow}
                currentIndex={
                  currentCategory
                    ? currentCategory.images.findIndex(
                        (img) => img.src === selectedImage.src,
                      )
                    : 0
                }
                totalCount={currentCategory?.images.length ?? 0}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto min-h-0">
              <div
                className={`grid gap-1 ${
                  narrow
                    ? "grid-cols-2"
                    : compact
                      ? "grid-cols-4 @xs:grid-cols-5 @sm:grid-cols-6 @md:grid-cols-8"
                      : "grid-cols-3 @xs:grid-cols-4 @sm:grid-cols-5 @md:grid-cols-6 @lg:grid-cols-7"
                }`}
              >
                {currentCategory?.images.map((img) => (
                  <button
                    key={img.src}
                    onClick={() => setSelectedImage(img)}
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
                          narrow
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        } transition-opacity`}
                      >
                        {formatDate(img.date)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!compact && !narrow && (
            <div className="pt-1 border-t border-border-faint text-ghost text-2xs mt-1 flex justify-between shrink-0">
              <span>{currentCategory?.images.length ?? 0} images</span>
              <span className="text-primary-subtle">
                ~/gallery/{activeCategory}/
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
