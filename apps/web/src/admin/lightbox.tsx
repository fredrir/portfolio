"use client";

import { ArrowSquareOut, CaretLeft, CaretRight, Check, Copy, X } from "@phosphor-icons/react";
import type { components } from "@portfolio/api-client";
import { useEffect, useRef, useState } from "react";

import { formatBytes, timeAgo } from "@/admin/format";
import { DeleteButton } from "@/admin/library";
import { bucketOf } from "@/admin/model";
import type { AdminStrings } from "@/i18n/types";
import { cn } from "@/shared/utils/cn";

type MediaItem = components["schemas"]["MediaItem"];

function CopyButton({
  text,
  label,
  copiedLabel,
}: {
  text: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      title={copied ? copiedLabel : label}
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="rounded p-1 text-muted-foreground transition-colors hover:bg-surface-dim hover:text-foreground"
    >
      {copied ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
    </button>
  );
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="shrink-0 text-2xs text-faded">{label}</dt>
      <dd className="min-w-0 text-right font-mono text-xs">{children}</dd>
    </div>
  );
}

const STATE_STYLE: Record<"ready" | "processing" | "failed", string> = {
  ready: "bg-[hsl(var(--desk-ok)/0.15)] text-[hsl(var(--desk-ok))]",
  processing: "bg-surface-soft text-primary",
  failed: "bg-destructive/15 text-destructive",
};

export function Lightbox({
  item,
  index,
  total,
  categoryNames,
  t,
  onClose,
  onNav,
  onDelete,
  onSetCategory,
}: {
  item: MediaItem;
  index: number;
  total: number;
  categoryNames: string[];
  t: AdminStrings;
  onClose: () => void;
  onNav: (delta: 1 | -1) => void;
  onDelete: (id: string) => Promise<boolean>;
  onSetCategory: (id: string, category: string | null) => Promise<boolean>;
}) {
  const copy = t.lightbox;
  const closeRef = useRef<HTMLButtonElement>(null);
  const bucket = bucketOf(item);

  const [category, setCategory] = useState(item.category ?? "");
  const [saving, setSaving] = useState(false);
  // Refresh the editor when navigating between photos.
  useEffect(() => setCategory(item.category ?? ""), [item.id, item.category]);
  const dirty = category.trim() !== (item.category ?? "");

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (e.key === "Escape" && !typing) onClose();
      if (e.key === "ArrowRight" && !typing) onNav(1);
      if (e.key === "ArrowLeft" && !typing) onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNav]);

  const saveCategory = async () => {
    if (!dirty || saving) return;
    setSaving(true);
    await onSetCategory(item.id, category.trim() || null);
    setSaving(false);
  };

  const webp = item.variants.find((v) => v.format === "webp");
  const preview = webp?.url ?? item.variants.find((v) => v.url)?.url;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.filename}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      <button
        type="button"
        aria-label={copy.close}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-overlay-heavy backdrop-blur-sm"
        tabIndex={-1}
      />
      <div className="relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-border-faint bg-background shadow-lg md:flex-row">
        <figure className="relative flex min-h-0 flex-1 items-center justify-center bg-card">
          {preview ? (
            <img
              src={preview}
              alt={item.filename}
              className="max-h-[50dvh] w-full object-contain md:max-h-[80dvh]"
            />
          ) : (
            <p className="p-10 font-mono text-muted-foreground text-xs">{copy.noVariant}</p>
          )}
          {total > 1 && (
            <>
              <button
                type="button"
                aria-label={copy.prev}
                onClick={() => onNav(-1)}
                className="absolute left-1.5 rounded-full bg-glass-light p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CaretLeft size={16} />
              </button>
              <button
                type="button"
                aria-label={copy.next}
                onClick={() => onNav(1)}
                className="absolute right-1.5 rounded-full bg-glass-light p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CaretRight size={16} />
              </button>
            </>
          )}
        </figure>

        <aside className="flex w-full shrink-0 flex-col gap-3 overflow-y-auto border-border-faint border-t p-3.5 md:w-72 md:border-t-0 md:border-l">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="break-all font-medium font-mono text-xs">{item.filename}</p>
              <span
                className={cn(
                  "mt-1.5 inline-block rounded-full px-2 py-0.5 font-mono text-2xs",
                  STATE_STYLE[bucket],
                )}
              >
                {t.library.states[bucket]}
              </span>
            </div>
            <button
              ref={closeRef}
              type="button"
              aria-label={copy.close}
              onClick={onClose}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-surface-dim hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X size={14} />
            </button>
          </div>

          <label className="block">
            <span className="mb-1 block text-2xs text-faded">{copy.category}</span>
            <span className="flex items-center gap-1.5">
              <input
                value={category}
                disabled={saving}
                list="desk-categories"
                placeholder={t.ingest.uncategorized}
                onChange={(e) => setCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void saveCategory();
                  if (e.key === "Escape") setCategory(item.category ?? "");
                }}
                className="min-w-0 flex-1 rounded border border-border-faint bg-card px-2 py-1 font-mono text-xs outline-none placeholder:text-placeholder focus-visible:border-primary-subtle disabled:opacity-60"
              />
              {dirty && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void saveCategory()}
                  className="shrink-0 rounded bg-primary px-2 py-1 font-medium text-2xs text-primary-foreground transition-colors hover:bg-primary-bold disabled:opacity-60"
                >
                  {copy.save}
                </button>
              )}
            </span>
          </label>

          <dl className="divide-y divide-border-faint border-border-faint border-y">
            <MetaRow label={copy.dimensions}>
              {item.width && item.height ? `${item.width} × ${item.height}` : "—"}
            </MetaRow>
            <MetaRow label={copy.source}>
              {item.content_type.replace("image/", "")}
              {item.size_bytes ? ` · ${formatBytes(item.size_bytes)}` : ""}
            </MetaRow>
            <MetaRow label={copy.uploaded}>{timeAgo(item.created_at, t.time)}</MetaRow>
            {item.content_hash && (
              <MetaRow label={copy.sha256}>
                <span className="inline-flex items-center gap-0.5">
                  <span title={item.content_hash}>{item.content_hash.slice(0, 12)}…</span>
                  <CopyButton
                    text={item.content_hash}
                    label={copy.copy.replace("{what}", copy.sha256)}
                    copiedLabel={copy.copied}
                  />
                </span>
              </MetaRow>
            )}
          </dl>

          {item.variants.length > 0 && (
            <div>
              <p className="mb-1 text-2xs text-faded">{copy.variants}</p>
              <ul className="space-y-0.5">
                {item.variants.map((v) => (
                  <li key={v.key} className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-foreground">{v.format}</span>
                    <span className="text-3xs text-muted-foreground">
                      {formatBytes(v.size_bytes)}
                    </span>
                    {v.url && (
                      <span className="ml-auto inline-flex items-center">
                        <CopyButton
                          text={v.url}
                          label={copy.copy.replace("{what}", v.format)}
                          copiedLabel={copy.copied}
                        />
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={copy.openTab.replace("{what}", v.format)}
                          className="rounded p-1 text-muted-foreground transition-colors hover:bg-surface-dim hover:text-foreground"
                        >
                          <ArrowSquareOut size={12} />
                        </a>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <DeleteButton
              label={copy.delete}
              confirmLabel={copy.confirmDelete}
              onDelete={() => onDelete(item.id)}
              className="border border-border-faint"
            />
            {total > 1 && (
              <p className="font-mono text-2xs text-faded">
                {index + 1} {copy.of} {total} · ← → {copy.moveHint}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
