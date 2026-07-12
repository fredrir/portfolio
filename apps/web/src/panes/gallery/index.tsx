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

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return Math.max(0, Math.min(index, length - 1));
}

function getGridColumns(container: HTMLElement | null, selector: string) {
  const grid = container?.querySelector<HTMLElement>(selector);
  if (!grid) return 1;
  const columns = window.getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean);
  return Math.max(1, columns.length);
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

export function ImagePane({ ui }: { ui: UiStrings }) {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
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
  const selectedImageIndex = useMemo(() => {
    if (!selectedImage || !currentCategory) return -1;
    return currentCategory.images.findIndex((img) => img.src === selectedImage.src);
  }, [selectedImage, currentCategory]);

  const focusPane = useCallback(() => {
    requestAnimationFrame(() => containerRef.current?.focus({ preventScroll: true }));
  }, [containerRef]);

  useEffect(() => {
    const idx = categories.findIndex((category) => category.name === activeCategory);
    if (idx >= 0) setActiveCategoryIndex(idx);
  }, [categories, activeCategory]);

  useEffect(() => {
    const imageCount = currentCategory?.images.length ?? 0;
    setActiveImageIndex((idx) =>
      clampIndex(selectedImageIndex >= 0 ? selectedImageIndex : idx, imageCount),
    );
  }, [currentCategory, selectedImageIndex]);

  const adjacentSrcs = useMemo(() => {
    if (!selectedImage || !currentCategory || selectedImageIndex === -1) return [];
    const images = currentCategory.images;
    const srcs: string[] = [];
    if (selectedImageIndex > 0) srcs.push(images[selectedImageIndex - 1].src);
    if (selectedImageIndex < images.length - 1) srcs.push(images[selectedImageIndex + 1].src);
    return srcs;
  }, [selectedImage, currentCategory, selectedImageIndex]);

  const selectCategoryAt = useCallback(
    (index: number) => {
      const idx = clampIndex(index, categories.length);
      const category = categories[idx];
      if (!category) return;
      setActiveCategoryIndex(idx);
      setActiveCategory(category.name);
      setSelectedImage(null);
      setActiveImageIndex(0);
      focusPane();
    },
    [categories, focusPane],
  );

  const selectImageAt = useCallback(
    (index: number) => {
      const images = currentCategory?.images ?? [];
      const idx = clampIndex(index, images.length);
      const image = images[idx];
      if (!image) return;
      setActiveImageIndex(idx);
      setSelectedImage(image);
      focusPane();
    },
    [currentCategory, focusPane],
  );

  const handleSelectImage = useCallback(
    (image: GalleryImage) => {
      const idx = currentCategory?.images.findIndex((img) => img.src === image.src) ?? -1;
      if (idx >= 0) setActiveImageIndex(idx);
      setSelectedImage(image);
      focusPane();
    },
    [currentCategory, focusPane],
  );

  const handleSwipe = useCallback(
    (dir: "left" | "right") => {
      if (!selectedImage || !currentCategory || selectedImageIndex === -1) return;
      const images = currentCategory.images;
      const next = dir === "left" ? selectedImageIndex + 1 : selectedImageIndex - 1;
      if (next >= 0 && next < images.length) {
        selectImageAt(next);
      }
    },
    [selectedImage, currentCategory, selectedImageIndex, selectImageAt],
  );

  const handleSelectCategory = useCallback(
    (name: string) => {
      const idx = categories.findIndex((category) => category.name === name);
      if (idx >= 0) setActiveCategoryIndex(idx);
      setActiveCategory(name);
      setSelectedImage(null);
      setActiveImageIndex(0);
      focusPane();
    },
    [categories, focusPane],
  );

  const clearSelectedImage = useCallback(() => {
    setSelectedImage(null);
    focusPane();
  }, [focusPane]);

  const handleBack = useCallback(() => {
    setActiveCategory(null);
    setSelectedImage(null);
    setActiveImageIndex(0);
    focusPane();
  }, [focusPane]);

  const mobileBack = useMobileBack();
  const inMobileLayout = mobileBack !== null;

  useEffect(() => {
    if (!mobileBack) return;
    if (selectedImage) {
      mobileBack.setBackAction(clearSelectedImage);
    } else if (narrow && activeCategory) {
      mobileBack.setBackAction(() => {
        setActiveCategory(null);
        setSelectedImage(null);
        setActiveImageIndex(0);
      });
    } else {
      mobileBack.setBackAction(null);
    }
    mobileBack.setSubtitle(activeCategory);
  }, [mobileBack, selectedImage, narrow, activeCategory, clearSelectedImage]);

  const showBrowser = narrow && !activeCategory;

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.defaultPrevented || isEditableTarget(event.target)) return;
      if (event.altKey || event.ctrlKey || event.metaKey || loading || categories.length === 0) {
        return;
      }

      const prevent = () => {
        event.preventDefault();
      };

      if (selectedImage && currentCategory) {
        switch (event.key) {
          case "ArrowRight":
            prevent();
            if (selectedImageIndex < currentCategory.images.length - 1) {
              selectImageAt(selectedImageIndex + 1);
            }
            return;
          case "ArrowLeft":
            prevent();
            if (selectedImageIndex > 0) selectImageAt(selectedImageIndex - 1);
            return;
          case "Home":
            prevent();
            selectImageAt(0);
            return;
          case "End":
            prevent();
            selectImageAt(currentCategory.images.length - 1);
            return;
          case "Escape":
          case "Backspace":
            prevent();
            clearSelectedImage();
            return;
        }
        return;
      }

      if (showBrowser) {
        const columns = getGridColumns(containerRef.current, "[data-gallery-category-grid]");
        switch (event.key) {
          case "ArrowRight":
            prevent();
            setActiveCategoryIndex((idx) => clampIndex(idx + 1, categories.length));
            return;
          case "ArrowLeft":
            prevent();
            setActiveCategoryIndex((idx) => clampIndex(idx - 1, categories.length));
            return;
          case "ArrowDown":
            prevent();
            setActiveCategoryIndex((idx) => clampIndex(idx + columns, categories.length));
            return;
          case "ArrowUp":
            prevent();
            setActiveCategoryIndex((idx) => clampIndex(idx - columns, categories.length));
            return;
          case "Home":
            prevent();
            setActiveCategoryIndex(0);
            return;
          case "End":
            prevent();
            setActiveCategoryIndex(categories.length - 1);
            return;
          case "Enter":
          case " ":
            prevent();
            selectCategoryAt(activeCategoryIndex);
            return;
        }
      }

      const images = currentCategory?.images ?? [];
      if (images.length === 0) return;
      const columns = getGridColumns(containerRef.current, "[data-gallery-grid]");
      switch (event.key) {
        case "ArrowRight":
          prevent();
          setActiveImageIndex((idx) => clampIndex(idx + 1, images.length));
          return;
        case "ArrowLeft":
          prevent();
          setActiveImageIndex((idx) => clampIndex(idx - 1, images.length));
          return;
        case "ArrowDown":
          prevent();
          setActiveImageIndex((idx) => clampIndex(idx + columns, images.length));
          return;
        case "ArrowUp":
          prevent();
          setActiveImageIndex((idx) => clampIndex(idx - columns, images.length));
          return;
        case "Home":
          prevent();
          setActiveImageIndex(0);
          return;
        case "End":
          prevent();
          setActiveImageIndex(images.length - 1);
          return;
        case "Enter":
        case " ":
          prevent();
          selectImageAt(activeImageIndex);
          return;
        case "Escape":
        case "Backspace":
          if (narrow) {
            prevent();
            handleBack();
          }
          return;
      }
    },
    [
      activeCategoryIndex,
      activeImageIndex,
      categories,
      clearSelectedImage,
      currentCategory,
      handleBack,
      loading,
      narrow,
      selectCategoryAt,
      selectImageAt,
      selectedImage,
      selectedImageIndex,
      showBrowser,
      containerRef,
    ],
  );

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex h-full flex-col @sm:p-3 @xs:p-2.5 p-3 outline-hidden focus-visible:ring-1 focus-visible:ring-primary-hint"
    >
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
            <CategoryBrowser
              categories={categories}
              activeIndex={activeCategoryIndex}
              onActiveIndexChange={setActiveCategoryIndex}
              onSelect={handleSelectCategory}
            />
          ) : (
            <>
              {narrow && !selectedImage ? (
                !inMobileLayout && (
                  <div className="mb-1.5 flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
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
                        type="button"
                        onClick={clearSelectedImage}
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
                    currentIndex={selectedImageIndex >= 0 ? selectedImageIndex : 0}
                    totalCount={currentCategory?.images.length ?? 0}
                    adjacentSrcs={adjacentSrcs}
                  />
                </div>
              ) : (
                <ImageGrid
                  images={currentCategory?.images ?? []}
                  narrow={narrow}
                  compact={compact}
                  activeIndex={activeImageIndex}
                  onActiveIndexChange={setActiveImageIndex}
                  onSelect={handleSelectImage}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
