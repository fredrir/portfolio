"use client";

import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";

import type { components } from "@portfolio/api-client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { IngestStrip } from "@/admin/ingest";
import { PhotoGrid } from "@/admin/library";
import { Lightbox } from "@/admin/lightbox";
import { bucketOf, type StateFilter } from "@/admin/model";
import { DeskHeader } from "@/admin/toolbar";
import { useUploads } from "@/admin/use-uploads";
import { getStaticDictionary } from "@/i18n/dictionaries";
import {
  adminDeleteMedia,
  adminListMedia,
  adminRenameCategory,
  adminSetCategory,
} from "@/server/admin";

type MediaItem = components["schemas"]["MediaItem"];
const ADMIN_STRINGS = getStaticDictionary("en").admin;

function useWindowDrop(onDrop: (files: File[]) => void) {
  const [dragging, setDragging] = useState(false);
  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;

  useEffect(() => {
    let depth = 0;
    const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes("Files");
    const enter = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth += 1;
      setDragging(true);
    };
    const over = (e: DragEvent) => {
      if (hasFiles(e)) e.preventDefault();
    };
    const leave = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      depth = Math.max(0, depth - 1);
      if (depth === 0) setDragging(false);
    };
    const drop = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth = 0;
      setDragging(false);
      onDropRef.current(Array.from(e.dataTransfer?.files ?? []));
    };
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragover", over);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragover", over);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", drop);
    };
  }, []);

  return dragging;
}

export function AdminConsole({
  initialMedia = [],
  initialApiDown = false,
}: {
  initialMedia?: MediaItem[];
  initialApiDown?: boolean;
}) {
  const t = ADMIN_STRINGS;
  const uncat = t.library.uncategorized;

  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [loading, setLoading] = useState(initialMedia.length === 0 && !initialApiDown);
  const [refreshing, setRefreshing] = useState(false);
  const [apiDown, setApiDown] = useState(initialApiDown);
  const [notice, setNotice] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<StateFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setMedia(await adminListMedia());
      setApiDown(false);
    } catch {
      setApiDown(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  // Uploads land in the grid as developing tiles; once the worker settles one
  // the library refreshes and the ghost retires in favor of the real tile.
  const landedRef = useRef<(jobId: string) => void>(() => {});
  const { jobs, upload, retry, remove } = useUploads(
    useCallback((jobId: string) => landedRef.current(jobId), []),
    t.uploadErrors,
  );
  landedRef.current = (jobId: string) => {
    void Promise.allSettled([refresh(), new Promise((r) => setTimeout(r, 700))]).then(() =>
      remove(jobId),
    );
  };

  const handleFiles = useCallback(
    (files: File[]) => {
      for (const file of files) upload(file, uploadCategory.trim());
    },
    [upload, uploadCategory],
  );
  const dragging = useWindowDrop(handleFiles);

  // Cmd/Ctrl+V with an image on the clipboard uploads it.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? []).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (files.length > 0) {
        e.preventDefault();
        handleFiles(files);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFiles]);

  const fileInput = useRef<HTMLInputElement>(null);
  const browse = useCallback(() => fileInput.current?.click(), []);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of media) {
      const key = m.category ?? uncat;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [media, uncat]);

  // A filter can outlive its category (rename, last delete); drop it then.
  useEffect(() => {
    if (categoryFilter && !categories.some(([name]) => name === categoryFilter)) {
      setCategoryFilter(null);
    }
  }, [categories, categoryFilter]);

  // New uploads follow the album being viewed unless overridden in the strip.
  useEffect(() => {
    setUploadCategory(categoryFilter && categoryFilter !== uncat ? categoryFilter : "");
  }, [categoryFilter, uncat]);

  const counts = useMemo(() => {
    const c = { ready: 0, processing: 0, failed: 0 };
    for (const m of media) c[bucketOf(m)] += 1;
    for (const j of jobs) c[j.stage === "failed" ? "failed" : "processing"] += 1;
    return c;
  }, [media, jobs]);

  const storedBytes = useMemo(
    () => media.reduce((sum, m) => sum + (m.size_bytes ?? 0), 0),
    [media],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return media.filter((m) => {
      if (stateFilter !== "all" && bucketOf(m) !== stateFilter) return false;
      const category = m.category ?? uncat;
      if (categoryFilter && category !== categoryFilter) return false;
      if (q && !m.filename.toLowerCase().includes(q) && !category.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [media, stateFilter, categoryFilter, query, uncat]);

  const visibleJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      const bucket = j.stage === "failed" ? "failed" : "processing";
      if (stateFilter !== "all" && stateFilter !== bucket) return false;
      const category = j.category || uncat;
      if (categoryFilter && category !== categoryFilter) return false;
      if (q && !j.name.toLowerCase().includes(q) && !category.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [jobs, stateFilter, categoryFilter, query, uncat]);

  const handleDelete = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await adminDeleteMedia({ data: { id } });
      } catch {
        setNotice(t.actionFailed);
        return false;
      }
      setMedia((all) => all.filter((m) => m.id !== id));
      return true;
    },
    [t.actionFailed],
  );

  const deleteFromLightbox = useCallback(
    async (id: string): Promise<boolean> => {
      const index = visible.findIndex((m) => m.id === id);
      const ok = await handleDelete(id);
      if (ok) {
        const next = visible[index + 1] ?? visible[index - 1];
        setOpenId(next && next.id !== id ? next.id : null);
      }
      return ok;
    },
    [visible, handleDelete],
  );

  const handleSetCategory = useCallback(
    async (id: string, category: string | null): Promise<boolean> => {
      try {
        const result = await adminSetCategory({ data: { id, category } });
        setMedia((all) =>
          all.map((m) => (m.id === id ? { ...m, category: result.category ?? null } : m)),
        );
        return true;
      } catch {
        setNotice(t.actionFailed);
        return false;
      }
    },
    [t.actionFailed],
  );

  const handleRenameCategory = useCallback(
    async (from: string, to: string): Promise<boolean> => {
      try {
        const result = await adminRenameCategory({ data: { from, to } });
        setMedia((all) =>
          all.map((m) => (m.category === from ? { ...m, category: result.to } : m)),
        );
        setCategoryFilter((current) => (current === from ? result.to : current));
        return true;
      } catch {
        setNotice(t.actionFailed);
        return false;
      }
    },
    [t.actionFailed],
  );

  const openIndex = visible.findIndex((m) => m.id === openId);
  const openItem = openIndex >= 0 ? visible[openIndex] : null;
  const categoryNames = categories.map(([name]) => name).filter((name) => name !== uncat);

  return (
    <div className="admin-desk h-dvh overflow-y-auto text-sm antialiased">
      {dragging && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-40 bg-background/80 backdrop-blur-[2px]"
        >
          <div className="absolute inset-3 flex items-center justify-center rounded-lg border-2 border-primary border-dashed">
            <p className="font-mono text-primary text-sm">
              {t.ingest.release}
              <span className="text-muted-foreground">
                {" "}
                → {uploadCategory.trim() || t.ingest.uncategorized}
              </span>
            </p>
          </div>
        </div>
      )}

      <DeskHeader
        t={t}
        apiDown={apiDown}
        refreshing={refreshing}
        counts={counts}
        total={media.length}
        storedBytes={storedBytes}
        query={query}
        stateFilter={stateFilter}
        categories={categories}
        categoryFilter={categoryFilter}
        uncat={uncat}
        onQuery={setQuery}
        onStateFilter={setStateFilter}
        onCategoryFilter={setCategoryFilter}
        onRefresh={() => void refresh()}
        onAdd={browse}
        onRenameCategory={handleRenameCategory}
      />

      <main className="mx-auto max-w-7xl px-3 pb-16 sm:px-5">
        <IngestStrip
          t={t.ingest}
          jobs={jobs}
          category={uploadCategory}
          categoryNames={categoryNames}
          onCategory={setUploadCategory}
          onBrowse={browse}
        />
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => {
            handleFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />

        <PhotoGrid
          t={t}
          media={visible}
          jobs={visibleJobs}
          loading={loading}
          filtered={visible.length !== media.length || visibleJobs.length !== jobs.length}
          onOpen={setOpenId}
          onDelete={handleDelete}
          onRetryJob={retry}
          onDismissJob={remove}
          onClearFilters={() => {
            setQuery("");
            setStateFilter("all");
            setCategoryFilter(null);
          }}
        />
      </main>

      {openItem && (
        <Lightbox
          item={openItem}
          index={openIndex}
          total={visible.length}
          categoryNames={categoryNames}
          t={t}
          onClose={() => setOpenId(null)}
          onNav={(delta) => {
            const next = visible[openIndex + delta];
            if (next) setOpenId(next.id);
          }}
          onDelete={deleteFromLightbox}
          onSetCategory={handleSetCategory}
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
