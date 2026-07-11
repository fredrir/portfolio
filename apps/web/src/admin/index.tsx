"use client";

import type { components } from "@portfolio/api-client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { formatBytes } from "@/admin/format";
import { Ledger } from "@/admin/ledger";
import { Library } from "@/admin/library";
import { IngestStrip } from "@/admin/pipeline";
import { useUploads } from "@/admin/use-uploads";
import { StatusDot } from "@/panes/platform-ui";
import {
  type AdminAuditEntry,
  adminAuditLog,
  adminListMedia,
} from "@/server/admin";

type MediaItem = components["schemas"]["MediaItem"];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="font-mono text-sm leading-tight tabular-nums text-foreground">
        {value}
      </span>
      <span className="text-3xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/** Registers a whole-window file drop target; returns whether files hover. */
function useWindowDrop(onDrop: (files: File[]) => void) {
  const [dragging, setDragging] = useState(false);
  const onDropRef = useRef(onDrop);
  onDropRef.current = onDrop;

  useEffect(() => {
    let depth = 0;
    const hasFiles = (e: DragEvent) =>
      Array.from(e.dataTransfer?.types ?? []).includes("Files");
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

export function AdminConsole() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [audit, setAudit] = useState<AdminAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiDown, setApiDown] = useState(false);
  const [category, setCategory] = useState("");

  const refresh = useCallback(() => {
    setLoading(true);
    Promise.allSettled([adminListMedia(), adminAuditLog()]).then(
      ([mediaResult, auditResult]) => {
        if (mediaResult.status === "fulfilled") setMedia(mediaResult.value);
        if (auditResult.status === "fulfilled") setAudit(auditResult.value);
        setApiDown(mediaResult.status === "rejected");
        setLoading(false);
      },
    );
  }, []);
  useEffect(refresh, [refresh]);

  const { jobs, upload, clearSettled } = useUploads(refresh);

  const handleFiles = useCallback(
    (files: File[]) => {
      for (const file of files) void upload(file, category.trim());
    },
    [upload, category],
  );
  const dragging = useWindowDrop(handleFiles);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(media.map((m) => m.category).filter((c): c is string => !!c)),
      ).sort(),
    [media],
  );

  const ready = media.filter((m) => m.state === "ready").length;
  const storedBytes = media.reduce(
    (sum, m) => sum + m.variants.reduce((s, v) => s + v.size_bytes, 0),
    0,
  );

  return (
    <div className="h-dvh overflow-y-auto bg-background font-mono text-foreground">
      {dragging && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-2 z-40 rounded-lg border-2 border-dashed border-primary"
        />
      )}

      <header className="sticky top-0 z-20 border-b border-border-faint bg-glass-heavy backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <StatusDot tone={apiDown ? "fail" : "ok"} pulse={!apiDown} />
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold tracking-wide">
                admin<span className="text-primary-dim">@</span>hansteen.dev
              </h1>
              <p className="text-3xs uppercase tracking-[0.2em] text-muted-foreground">
                {apiDown ? "api unreachable" : "media pipeline · access-gated"}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-4 sm:gap-5">
            <Stat value={String(media.length)} label="items" />
            <Stat value={String(ready)} label="live" />
            <div className="hidden sm:block">
              <Stat value={formatBytes(storedBytes)} label="stored" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-3 px-3 py-3 sm:px-4 sm:py-4">
        <IngestStrip
          jobs={jobs}
          dragging={dragging}
          category={category}
          categories={categories}
          onCategory={setCategory}
          onFiles={handleFiles}
          onClearSettled={clearSettled}
        />
        <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Library media={media} loading={loading} onRefresh={refresh} />
          <Ledger audit={audit} />
        </div>
      </main>
    </div>
  );
}
