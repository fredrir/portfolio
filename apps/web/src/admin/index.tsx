"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useMediaLibrary } from "@/admin/hooks/use-media-library";
import { type UploadJob, useUploads } from "@/admin/hooks/use-uploads";
import { PhotoGrid } from "@/admin/library";
import { Lightbox } from "@/admin/lightbox";
import {
  type AdminMediaLibrary,
  emptyMediaLibrary,
  type MediaState,
  type StateFilter,
  UNCATEGORIZED,
} from "@/admin/model";
import { DeskHeader } from "@/admin/toolbar";
import { DropPhotos } from "./drop-photos";

interface AdminConsoleProps {
  initialLibrary?: AdminMediaLibrary;
  initialApiDown?: boolean;
}

function matchesUploadFilters(
  name: string,
  category: string,
  state: MediaState,
  query: string,
  stateFilter: StateFilter,
  categoryFilter: string | null,
): boolean {
  if (stateFilter !== "all" && state !== stateFilter) return false;
  if (categoryFilter && category !== categoryFilter) return false;
  return !query || name.toLowerCase().includes(query) || category.toLowerCase().includes(query);
}

function uploadState(job: UploadJob): MediaState {
  return job.stage === "failed" ? "failed" : "processing";
}

export function AdminConsole({ initialLibrary, initialApiDown = false }: AdminConsoleProps) {
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<StateFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const mediaFilters = useMemo(
    () => ({
      ...(deferredQuery.trim() ? { query: deferredQuery.trim() } : {}),
      ...(stateFilter !== "all" ? { state: stateFilter } : {}),
      ...(categoryFilter ? { category: categoryFilter } : {}),
    }),
    [deferredQuery, stateFilter, categoryFilter],
  );

  const {
    media,
    summary,
    apiDown,
    refreshing,
    notice,
    refresh,
    deleteMedia,
    setCategory,
    renameCategory,
  } = useMediaLibrary(initialLibrary ?? emptyMediaLibrary(), initialApiDown, mediaFilters);
  const refreshAfterUpload = useCallback(() => void refresh(), [refresh]);
  const { jobs, upload, retry, remove } = useUploads(refreshAfterUpload);

  const categories = useMemo<Array<[string, number]>>(
    () => summary.categories.map(({ name, count }) => [name, count]),
    [summary.categories],
  );
  const categoryNames = useMemo(
    () => categories.map(([name]) => name).filter((name) => name !== UNCATEGORIZED),
    [categories],
  );

  const counts = useMemo(() => {
    const next = { ...summary.state_counts };
    for (const job of jobs) next[uploadState(job)] += 1;
    return next;
  }, [jobs, summary.state_counts]);

  useEffect(() => {
    if (!categoryFilter || categories.some(([name]) => name === categoryFilter)) return;
    setCategoryFilter(null);
    setUploadCategory("");
  }, [categories, categoryFilter]);

  const handleFiles = useCallback(
    (files: File[]) => {
      upload(files, uploadCategory.trim());
    },
    [upload, uploadCategory],
  );

  const selectCategory = useCallback((category: string | null) => {
    setCategoryFilter(category);
    setUploadCategory(category && category !== UNCATEGORIZED ? category : "");
  }, []);

  const handleRenameCategory = useCallback(
    async (from: string, to: string) => {
      const renamedTo = await renameCategory(from, to);
      if (renamedTo) {
        setCategoryFilter((current) => (current === from ? renamedTo : current));
        setUploadCategory((current) => (current === from ? renamedTo : current));
      }
      return Boolean(renamedTo);
    },
    [renameCategory],
  );

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const visibleJobs = useMemo(
    () =>
      jobs.filter((job) =>
        matchesUploadFilters(
          job.name,
          job.category || UNCATEGORIZED,
          uploadState(job),
          normalizedQuery,
          stateFilter,
          categoryFilter,
        ),
      ),
    [jobs, normalizedQuery, stateFilter, categoryFilter],
  );

  const openIndex = media.findIndex((item) => item.id === openId);
  const openItem = openIndex >= 0 ? media[openIndex] : null;

  const deleteFromLightbox = useCallback(
    async (id: string) => {
      const index = media.findIndex((item) => item.id === id);
      const deleted = await deleteMedia(id);
      if (deleted) {
        const next = media[index + 1] ?? media[index - 1];
        setOpenId(next?.id ?? null);
      }
      return deleted;
    },
    [deleteMedia, media],
  );

  const navigateLightbox = useCallback(
    (delta: 1 | -1) => {
      const next = media[openIndex + delta];
      if (next) setOpenId(next.id);
    },
    [openIndex, media],
  );

  const clearFilters = useCallback(() => {
    setQuery("");
    setStateFilter("all");
    selectCategory(null);
  }, [selectCategory]);
  const closeLightbox = useCallback(() => setOpenId(null), []);

  return (
    <div className="admin-desk h-dvh overflow-y-auto text-sm antialiased">
      <DeskHeader
        apiDown={apiDown}
        refreshing={refreshing}
        counts={counts}
        total={summary.total}
        storedBytes={summary.stored_bytes}
        query={query}
        stateFilter={stateFilter}
        categories={categories}
        categoryFilter={categoryFilter}
        onQuery={setQuery}
        onStateFilter={setStateFilter}
        onCategoryFilter={selectCategory}
        onRefresh={refresh}
        onRenameCategory={handleRenameCategory}
      />

      <main className="mx-auto max-w-7xl px-3 pb-16 sm:px-5">
        <DropPhotos
          jobs={jobs}
          category={uploadCategory}
          categoryNames={categoryNames}
          onCategory={setUploadCategory}
          onFiles={handleFiles}
        />
        <PhotoGrid
          media={media}
          jobs={visibleJobs}
          filtered={Boolean(normalizedQuery || stateFilter !== "all" || categoryFilter)}
          onOpen={setOpenId}
          onDelete={deleteMedia}
          onRetryJob={retry}
          onDismissJob={remove}
          onClearFilters={clearFilters}
        />
      </main>

      {openItem && (
        <Lightbox
          item={openItem}
          index={openIndex}
          total={media.length}
          onClose={closeLightbox}
          onNav={navigateLightbox}
          onDelete={deleteFromLightbox}
          onSetCategory={setCategory}
        />
      )}

      {notice && (
        <output className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded border border-destructive/40 bg-card px-3 py-1.5 font-mono text-destructive text-xs shadow-lg">
          {notice}
        </output>
      )}
    </div>
  );
}
