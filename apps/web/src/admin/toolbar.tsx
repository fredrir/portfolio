"use client";

import {
  ArrowsClockwise,
  Check,
  MagnifyingGlass,
  PencilSimple,
  Plus,
  X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { formatBytes } from "@/admin/format";
import { type MediaState, type StateFilter, stateLabel, UNCATEGORIZED } from "@/admin/model";
import { cn } from "@/shared/utils/cn";

const STATE_DOT: Record<MediaState, string> = {
  ready: "bg-[hsl(var(--desk-ok))]",
  processing: "bg-primary",
  failed: "bg-destructive",
};

function StatePill({
  bucket,
  count,
  active,
  onToggle,
}: {
  bucket: MediaState;
  count: number;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-2xs transition-colors",
        active
          ? "border-primary-hint bg-surface-soft text-foreground"
          : "border-transparent text-muted-foreground hover:bg-surface-dim hover:text-foreground",
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", STATE_DOT[bucket])} />
      {stateLabel(bucket)} {count}
    </button>
  );
}

function CategoryChip({
  name,
  count,
  active,
  renamable,
  onToggle,
  onRename,
}: {
  name: string;
  count: number;
  active: boolean;
  renamable: boolean;
  onToggle: () => void;
  onRename: (to: string) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = async () => {
    const to = value.trim();
    if (busy) return;
    if (!to || to === name) {
      setEditing(false);
      setValue(name);
      return;
    }
    setBusy(true);
    const ok = await onRename(to);
    setBusy(false);
    if (ok) setEditing(false);
  };

  if (editing) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary-hint bg-surface-soft py-0.5 pr-1 pl-2.5">
        <input
          ref={inputRef}
          value={value}
          disabled={busy}
          aria-label={`Rename category ${name}`}
          placeholder="new name"
          size={Math.max(value.length, 6)}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void commit();
            if (e.key === "Escape") {
              setEditing(false);
              setValue(name);
            }
          }}
          className="bg-transparent font-mono text-2xs text-foreground outline-none placeholder:text-placeholder"
        />
        <button
          type="button"
          aria-label="Save category name"
          disabled={busy}
          onClick={() => void commit()}
          className="rounded-full p-0.5 text-primary hover:bg-surface-selected disabled:opacity-50"
        >
          {busy ? (
            <ArrowsClockwise size={11} className="motion-safe:animate-spin" />
          ) : (
            <Check size={11} />
          )}
        </button>
        <button
          type="button"
          aria-label="Cancel rename"
          disabled={busy}
          onClick={() => {
            setEditing(false);
            setValue(name);
          }}
          className="rounded-full p-0.5 text-muted-foreground hover:bg-surface-selected hover:text-foreground disabled:opacity-50"
        >
          <X size={11} />
        </button>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full transition-colors",
        active ? "bg-surface-soft text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <button
        type="button"
        aria-pressed={active}
        onClick={onToggle}
        className={cn(
          "rounded-full py-1 pl-2.5 font-mono text-2xs",
          active ? "pr-1" : "pr-2.5 hover:bg-surface-dim",
        )}
      >
        {name} <span className={active ? "text-primary-dim" : "text-faded"}>{count}</span>
      </button>
      {active && renamable && (
        <button
          type="button"
          aria-label={`Rename category ${name}`}
          onClick={() => {
            setValue(name);
            setEditing(true);
          }}
          className="rounded-full p-1 pr-1.5 text-primary-dim hover:text-primary"
        >
          <PencilSimple size={11} />
        </button>
      )}
    </span>
  );
}

export function DeskHeader({
  apiDown,
  refreshing,
  counts,
  total,
  storedBytes,
  query,
  stateFilter,
  categories,
  categoryFilter,
  onQuery,
  onStateFilter,
  onCategoryFilter,
  onRefresh,
  onAdd,
  onRenameCategory,
}: {
  apiDown: boolean;
  refreshing: boolean;
  counts: Record<MediaState, number>;
  total: number;
  storedBytes: number;
  query: string;
  stateFilter: StateFilter;
  categories: Array<[string, number]>;
  categoryFilter: string | null;
  onQuery: (value: string) => void;
  onStateFilter: (value: StateFilter) => void;
  onCategoryFilter: (value: string | null) => void;
  onRefresh: () => void;
  onAdd: () => void;
  onRenameCategory: (from: string, to: string) => Promise<boolean>;
}) {
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" focuses search from anywhere outside a text field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleState = (bucket: Exclude<StateFilter, "all">) =>
    onStateFilter(stateFilter === bucket ? "all" : bucket);

  return (
    <header className="sticky top-0 z-20 border-border-faint border-b bg-background">
      <div className="mx-auto max-w-7xl px-3 sm:px-5">
        <div className="flex h-12 items-center gap-2.5">
          <span
            aria-hidden
            className={cn(
              "size-2 shrink-0 rounded-full",
              apiDown ? "bg-destructive" : "bg-[hsl(var(--desk-ok))]",
            )}
          />
          <h1 className="min-w-0 truncate font-mono font-semibold text-sm tracking-tight">
            darkroom
            <span className="font-normal text-muted-foreground"> · hansteen.dev</span>
          </h1>
          <p className="ml-auto hidden shrink-0 font-mono text-2xs text-muted-foreground sm:block">
            {total} photos · {formatBytes(storedBytes)}
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="ml-auto inline-flex shrink-0 items-center gap-1 rounded bg-primary px-2.5 py-1.5 font-medium text-primary-foreground text-xs transition-colors hover:bg-primary-bold sm:ml-0"
          >
            <Plus size={12} weight="bold" />
            add photos
          </button>
        </div>

        {apiDown && (
          <div className="flex items-center gap-3 border-border-faint border-t py-2">
            <p className="min-w-0 font-mono text-destructive text-xs">
              API unreachable — the library cannot load or change right now.
            </p>
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="shrink-0 rounded border border-destructive/40 px-2 py-0.5 font-mono text-2xs text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
            >
              retry
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 border-border-faint border-t py-2">
          <label className="relative min-w-0 flex-1 sm:max-w-56">
            <MagnifyingGlass
              size={12}
              className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-faded"
            />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onQuery("");
                  e.currentTarget.blur();
                }
              }}
              placeholder="search"
              aria-label="Search by filename or category (press / to focus)"
              className="w-full rounded-full border border-border-faint bg-card py-1 pr-7 pl-7 font-mono text-xs outline-none placeholder:text-placeholder focus-visible:border-primary-subtle"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => onQuery("")}
                className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
              >
                <X size={11} />
              </button>
            )}
          </label>

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <StatePill
              bucket="ready"
              count={counts.ready}
              active={stateFilter === "ready"}
              onToggle={() => toggleState("ready")}
            />
            {counts.processing > 0 && (
              <StatePill
                bucket="processing"
                count={counts.processing}
                active={stateFilter === "processing"}
                onToggle={() => toggleState("processing")}
              />
            )}
            {counts.failed > 0 && (
              <StatePill
                bucket="failed"
                count={counts.failed}
                active={stateFilter === "failed"}
                onToggle={() => toggleState("failed")}
              />
            )}
            <button
              type="button"
              aria-label="Refresh library"
              onClick={onRefresh}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-surface-dim hover:text-foreground"
            >
              <ArrowsClockwise
                size={13}
                className={refreshing ? "motion-safe:animate-spin" : undefined}
              />
            </button>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="scrollbar-none flex items-center gap-0.5 overflow-x-auto pb-2">
            <button
              type="button"
              aria-pressed={categoryFilter === null}
              onClick={() => onCategoryFilter(null)}
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 font-mono text-2xs transition-colors",
                categoryFilter === null
                  ? "bg-surface-soft text-primary"
                  : "text-muted-foreground hover:bg-surface-dim hover:text-foreground",
              )}
            >
              all
            </button>
            {categories.map(([name, count]) => (
              <CategoryChip
                key={name}
                name={name}
                count={count}
                active={categoryFilter === name}
                renamable={name !== UNCATEGORIZED}
                onToggle={() => onCategoryFilter(categoryFilter === name ? null : name)}
                onRename={(to) => onRenameCategory(name, to)}
              />
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
