"use client";

import {
  ArrowsClockwise,
  HourglassMedium,
  ImageSquare,
  MagnifyingGlass,
  WarningCircle,
} from "@phosphor-icons/react";
import type { components } from "@portfolio/api-client";
import { useMemo, useState } from "react";

import { formatBytes } from "@/admin/format";
import { Lightbox } from "@/admin/lightbox";
import type { AdminStrings } from "@/i18n/types";
import { Instrument, useMounted } from "@/panes/platform-ui";
import { cn } from "@/shared/utils/cn";

type MediaItem = components["schemas"]["MediaItem"];

type StateFilter = "all" | "ready" | "processing" | "failed";

function bucketOf(item: MediaItem): Exclude<StateFilter, "all"> {
  if (item.state === "ready") return "ready";
  if (item.state === "failed") return "failed";
  return "processing";
}

function thumbOf(item: MediaItem): string | undefined {
  return (
    item.variants.find((v) => v.format === "webp")?.url ??
    item.variants.find((v) => v.url)?.url ??
    undefined
  );
}

function Tile({
  item,
  index,
  onOpen,
  t,
}: {
  item: MediaItem;
  index: number;
  onOpen: () => void;
  t: AdminStrings["library"];
}) {
  const mounted = useMounted();
  const thumb = thumbOf(item);
  const bucket = bucketOf(item);
  const webpBytes = item.variants.find((v) => v.format === "webp")?.size_bytes;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={t.openAria.replace("{filename}", item.filename)}
      style={{ transitionDelay: `${Math.min(index * 25, 400)}ms` }}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-md border text-left outline-none",
        "transition-opacity duration-500 focus-visible:ring-2 focus-visible:ring-ring",
        mounted ? "opacity-100" : "opacity-0",
        bucket === "failed"
          ? "border-destructive/40 bg-surface-dim"
          : "border-border-faint bg-surface-dim",
      )}
    >
      {thumb ? (
        <img
          src={thumb}
          alt={item.filename}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.04]"
        />
      ) : (
        <span
          className={cn(
            "flex h-full w-full flex-col items-center justify-center gap-1.5 text-3xs uppercase tracking-[0.2em]",
            bucket === "failed"
              ? "text-destructive"
              : "text-muted-foreground motion-safe:animate-pulse",
          )}
        >
          {bucket === "failed" ? <WarningCircle size={18} /> : <HourglassMedium size={18} />}
          {t.filters[bucket]}
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 translate-y-full bg-glass-medium px-1.5 py-1 backdrop-blur-sm transition-transform duration-200 group-hover:translate-y-0 group-focus-visible:translate-y-0">
        <span className="block truncate font-mono text-2xs">{item.filename}</span>
        <span className="block text-3xs text-muted-foreground">
          {item.width && item.height ? `${item.width}×${item.height}` : t.filters[bucket]}
          {webpBytes ? ` · ${formatBytes(webpBytes)}` : ""}
          {item.category ? ` · ${item.category}` : ""}
        </span>
      </span>
    </button>
  );
}

export function Library({
  media,
  loading,
  onRefresh,
  t,
}: {
  media: MediaItem[];
  loading: boolean;
  onRefresh: () => void;
  t: AdminStrings;
}) {
  const library = t.library;
  const [stateFilter, setStateFilter] = useState<StateFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = { all: media.length, ready: 0, processing: 0, failed: 0 };
    for (const m of media) c[bucketOf(m)] += 1;
    return c;
  }, [media]);

  const categories = useMemo(() => {
    const set = new Map<string, number>();
    for (const m of media) {
      const key = m.category ?? library.uncategorized;
      set.set(key, (set.get(key) ?? 0) + 1);
    }
    return Array.from(set.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [media, library.uncategorized]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return media.filter((m) => {
      if (stateFilter !== "all" && bucketOf(m) !== stateFilter) return false;
      if (categoryFilter && (m.category ?? library.uncategorized) !== categoryFilter) return false;
      if (q && !m.filename.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [media, stateFilter, categoryFilter, query, library.uncategorized]);

  const openIndex = visible.findIndex((m) => m.id === openId);
  const openItem = openIndex >= 0 ? visible[openIndex] : null;

  return (
    <Instrument
      label={`${library.label} · ${visible.length}${visible.length !== media.length ? ` ${library.of} ${media.length}` : ""}`}
      right={
        <button
          type="button"
          onClick={onRefresh}
          aria-label={library.refreshAria}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-control-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowsClockwise size={13} className={loading ? "motion-safe:animate-spin" : undefined} />
        </button>
      }
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <div className="inline-flex overflow-hidden rounded border border-border-faint">
          {(["all", "ready", "processing", "failed"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStateFilter(f)}
              className={cn(
                "px-2 py-0.5 font-mono text-2xs transition-colors",
                stateFilter === f
                  ? "bg-surface-soft text-primary"
                  : "text-muted-foreground hover:bg-control-hover hover:text-foreground",
              )}
            >
              {library.filters[f]} <span className="text-faded">{counts[f]}</span>
            </button>
          ))}
        </div>
        <label className="relative ml-auto">
          <MagnifyingGlass
            size={12}
            className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-faded"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={library.filterPlaceholder}
            aria-label={library.filterAria}
            className="w-40 rounded border border-border-faint bg-transparent py-0.5 pr-2 pl-7 font-mono text-xs outline-none placeholder:text-placeholder focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
      </div>

      {categories.length > 1 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {categories.map(([name, count]) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategoryFilter(categoryFilter === name ? null : name)}
              className={cn(
                "rounded border px-1.5 py-px font-mono text-2xs transition-colors",
                categoryFilter === name
                  ? "border-primary-hint bg-surface-selected text-primary"
                  : "border-border-faint text-muted-foreground hover:bg-control-hover hover:text-foreground",
              )}
            >
              {name} <span className="text-faded">{count}</span>
            </button>
          ))}
        </div>
      )}

      {loading && media.length === 0 ? (
        <p className="py-6 text-center text-muted-foreground text-xs motion-safe:animate-pulse">
          {library.reading}
        </p>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-1.5 py-8 text-muted-foreground">
          <ImageSquare size={22} />
          <p className="text-xs">
            {media.length === 0 ? library.empty : library.noMatches}
          </p>
        </div>
      ) : (
        <div className="grid gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(8rem,1fr))]">
          {visible.map((item, i) => (
            <Tile
              key={item.id}
              item={item}
              index={i}
              onOpen={() => setOpenId(item.id)}
              t={library}
            />
          ))}
        </div>
      )}

      {openItem && (
        <Lightbox
          item={openItem}
          index={openIndex}
          total={visible.length}
          t={t}
          onClose={() => setOpenId(null)}
          onNav={(delta) => {
            const next = visible[openIndex + delta];
            if (next) setOpenId(next.id);
          }}
        />
      )}
    </Instrument>
  );
}
