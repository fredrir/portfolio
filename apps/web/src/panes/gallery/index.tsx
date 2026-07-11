"use client";

import { ArrowLeft, FolderOpen } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { UiStrings } from "@/i18n/types";
import { type GalleryCategory, type GalleryImage, getGalleryData } from "@/server/gallery";
import { useContainerSize } from "@/shared/hooks/use-container-size";
import { useMobileBack } from "@/shared/hooks/use-mobile-back";
import { CategoryBrowser } from "./components/category-browser";
import { CategoryTabs } from "./components/category-tabs";
import { ImageDetail } from "./components/image-detail";
import { ImageGrid } from "./components/image-grid";

export function ImagePane({ ui }: { ui: UiStrings }) {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);
  const { ref: containerRef, width, height } = useContainerSize();
  const compact = height > 0 && height < 250;
  const narrow = width > 0 && width < 400;

  useEffect(() => {
    getGalleryData({
      data: { uncategorized: ui.uncategorized, projects: ui.projects },
    }).then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, [ui.projects, ui.uncategorized]);

  useEffect(() => {
    if (!narrow && !loading && categories.length > 0 && activeCategory === null) {
      setActiveCategory(categories[0].name);
    }
  }, [narrow, loading, categories, activeCategory]);

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
    <div ref={containerRef} className="flex h-full flex-col @sm:p-3 @xs:p-2.5 p-3">
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <span className="animate-pulse text-subtle">{ui.searchingGallery}</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-subtle">
          <FolderOpen size={28} />
          <span>{ui.emptyGallery}</span>
        </div>
      ) : (
        <>
          {showBrowser ? (
            <CategoryBrowser categories={categories} onSelect={handleSelectCategory} />
          ) : (
            <>
              {narrow && !selectedImage ? (
                !inMobileLayout && (
                  <div className="mb-1.5 flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-1 py-0.5 text-primary-muted text-sm transition-colors hover:text-primary active:text-primary"
                    >
                      <ArrowLeft size={14} />
                      ~/gallery
                    </button>
                    <span className="text-2xs text-ghost">{activeCategory}</span>
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
                <div className="flex min-h-0 flex-1 flex-col">
                  {!inMobileLayout && (
                    <div className="mb-1 flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => setSelectedImage(null)}
                        className={`inline-flex items-center gap-1 text-primary-muted transition-colors hover:text-primary active:text-primary ${narrow ? "py-1 text-sm" : "text-2xs"}`}
                      >
                        <ArrowLeft size={narrow ? 14 : 12} />
                        {activeCategory}
                      </button>
                    </div>
                  )}
                  <ImageDetail
                    image={selectedImage}
                    onSwipe={handleSwipe}
                    currentIndex={
                      currentCategory
                        ? currentCategory.images.findIndex((img) => img.src === selectedImage.src)
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
                <div className="mt-1 flex shrink-0 justify-between border-border-faint border-t pt-1 text-2xs text-ghost">
                  <span>
                    {currentCategory?.images.length ?? 0} {ui.images}
                  </span>
                  <span className="text-primary-subtle">~/gallery/{activeCategory}/</span>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
