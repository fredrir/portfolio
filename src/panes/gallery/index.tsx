"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  getGalleryData,
  type GalleryCategory,
  type GalleryImage,
} from "@/app/actions/gallery";
import { ArrowLeft, FolderOpen } from "@phosphor-icons/react";
import type { UiStrings } from "@/shared/types";
import { useMobileBack } from "@/shared/hooks/use-mobile-back";
import { ImageDetail } from "./components/image-detail";
import { CategoryBrowser } from "./components/category-browser";
import { ImageGrid } from "./components/image-grid";
import { CategoryTabs } from "./components/category-tabs";

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
    if (
      !narrow &&
      !loading &&
      categories.length > 0 &&
      activeCategory === null
    ) {
      setActiveCategory(categories[0].name);
    }
  }, [narrow, loading, categories, activeCategory]);

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

  const adjacentSrcs = useMemo(() => {
    if (!selectedImage || !currentCategory) return [];
    const images = currentCategory.images;
    const idx = images.findIndex((img) => img.src === selectedImage.src);
    if (idx === -1) return [];
    const srcs: string[] = [];
    if (idx > 0) srcs.push(images[idx - 1].src);
    if (idx < images.length - 1) srcs.push(images[idx + 1].src);
    return srcs;
  }, [selectedImage, currentCategory]);

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

  const handleSelectCategory = useCallback((name: string) => {
    setActiveCategory(name);
    setSelectedImage(null);
  }, []);

  const handleBack = useCallback(() => {
    setActiveCategory(null);
    setSelectedImage(null);
  }, []);

  const mobileBack = useMobileBack();
  const inMobileLayout = mobileBack !== null;

  useEffect(() => {
    if (!mobileBack) return;
    if (selectedImage) {
      mobileBack.setBackAction(() => setSelectedImage(null));
    } else if (narrow && activeCategory) {
      mobileBack.setBackAction(() => {
        setActiveCategory(null);
        setSelectedImage(null);
      });
    } else {
      mobileBack.setBackAction(null);
    }
    mobileBack.setSubtitle(activeCategory);
  }, [mobileBack, selectedImage, narrow, activeCategory]);

  const showBrowser = narrow && !activeCategory;

  return (
    <div
      ref={containerRef}
      className="p-3 @xs:p-2.5 @sm:p-3 font-mono text-xs h-full flex flex-col @container"
    >
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-subtle animate-pulse">
            {ui.searchingGallery}
          </span>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-subtle">
          <FolderOpen size={28} />
          <span>{ui.emptyGallery}</span>
        </div>
      ) : (
        <>
          {showBrowser ? (
            <CategoryBrowser
              categories={categories}
              onSelect={handleSelectCategory}
            />
          ) : (
            <>
              {narrow && !selectedImage ? (
                !inMobileLayout && (
                  <div className="flex items-center gap-1.5 mb-1.5 shrink-0">
                    <button
                      onClick={handleBack}
                      className="text-primary-muted hover:text-primary active:text-primary transition-colors text-sm py-0.5 inline-flex items-center gap-1"
                    >
                      <ArrowLeft size={14} />
                      ~/gallery
                    </button>
                    <span className="text-ghost text-2xs">
                      {activeCategory}
                    </span>
                  </div>
                )
              ) : narrow ? null : (
                <CategoryTabs
                  categories={categories}
                  activeCategory={activeCategory}
                  onSelect={handleSelectCategory}
                />
              )}

              {selectedImage ? (
                <div className="flex-1 flex flex-col min-h-0">
                  {!inMobileLayout && (
                    <div className="flex items-center gap-2 mb-1 shrink-0">
                      <button
                        onClick={() => setSelectedImage(null)}
                        className={`text-primary-muted hover:text-primary active:text-primary transition-colors inline-flex items-center gap-1 ${narrow ? "text-sm py-1" : "text-2xs"}`}
                      >
                        <ArrowLeft size={narrow ? 14 : 12} />
                        {activeCategory}
                      </button>
                    </div>
                  )}
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
                    adjacentSrcs={adjacentSrcs}
                  />
                </div>
              ) : (
                <ImageGrid
                  images={currentCategory?.images ?? []}
                  narrow={narrow}
                  compact={compact}
                  onSelect={setSelectedImage}
                />
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
        </>
      )}
    </div>
  );
}
