"use client";

import type { components } from "@portfolio/api-client";
import {
  ArrowSquareOut,
  CaretLeft,
  CaretRight,
  Check,
  Copy,
  X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { formatBytes } from "@/admin/format";
import { Badge, HashChip, Meter, type Tone } from "@/panes/platform-ui";

type MediaItem = components["schemas"]["MediaItem"];

const STATE_TONE: Record<string, Tone> = {
  ready: "ok",
  failed: "fail",
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      title={copied ? "copied" : label}
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-control-hover hover:text-foreground"
    >
      {copied ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
    </button>
  );
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1 text-xs">
      <span className="shrink-0 text-3xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <span className="min-w-0 text-right font-mono">{children}</span>
    </div>
  );
}

export function Lightbox({
  item,
  index,
  total,
  onClose,
  onNav,
}: {
  item: MediaItem;
  index: number;
  total: number;
  onClose: () => void;
  onNav: (delta: 1 | -1) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNav]);

  const webp = item.variants.find((v) => v.format === "webp");
  const preview = webp?.url ?? item.variants.find((v) => v.url)?.url;
  const maxVariant = Math.max(1, ...item.variants.map((v) => v.size_bytes));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.filename}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-overlay-heavy backdrop-blur-sm"
        tabIndex={-1}
      />
      <div className="relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-border-medium bg-background shadow-lg md:flex-row">
        <figure className="relative flex min-h-0 flex-1 items-center justify-center bg-surface-dim">
          {preview ? (
            <img
              src={preview}
              alt={item.filename}
              className="max-h-[50dvh] w-full object-contain md:max-h-[80dvh]"
            />
          ) : (
            <p className="p-10 text-xs text-muted-foreground">
              no variant to preview yet
            </p>
          )}
          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => onNav(-1)}
                className="absolute left-1 rounded-full bg-glass-light p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CaretLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => onNav(1)}
                className="absolute right-1 rounded-full bg-glass-light p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CaretRight size={16} />
              </button>
            </>
          )}
        </figure>

        <aside className="w-full shrink-0 space-y-2 overflow-y-auto border-t border-border-faint p-3 md:w-72 md:border-l md:border-t-0">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 break-all font-mono text-xs font-bold">
              {item.filename}
            </p>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close preview"
              onClick={onClose}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-control-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge tone={STATE_TONE[item.state] ?? "warn"}>{item.state}</Badge>
            <Badge tone="idle">{item.category ?? "uncategorized"}</Badge>
          </div>

          <div className="divide-y divide-border-faint border-y border-border-faint">
            <MetaRow label="size">
              {item.width && item.height
                ? `${item.width} × ${item.height}`
                : "—"}
            </MetaRow>
            <MetaRow label="source">{item.content_type}</MetaRow>
            {item.content_hash && (
              <MetaRow label="sha-256">
                <span className="inline-flex items-center gap-1">
                  <HashChip hash={item.content_hash} />
                  <CopyButton text={item.content_hash} label="Copy content hash" />
                </span>
              </MetaRow>
            )}
          </div>

          {item.variants.length > 0 && (
            <div>
              <p className="mb-1 text-3xs uppercase tracking-[0.2em] text-muted-foreground">
                encoded variants
              </p>
              {item.variants.map((v) => (
                <Meter
                  key={v.key}
                  label={v.format}
                  value={v.size_bytes}
                  max={maxVariant}
                  display={formatBytes(v.size_bytes)}
                  leading={
                    v.url ? (
                      <span className="inline-flex items-center gap-0.5">
                        <CopyButton text={v.url} label={`Copy ${v.format} URL`} />
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${v.format} in a new tab`}
                          className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-control-hover hover:text-foreground"
                        >
                          <ArrowSquareOut size={12} />
                        </a>
                      </span>
                    ) : undefined
                  }
                />
              ))}
            </div>
          )}

          {total > 1 && (
            <p className="pt-1 text-center text-2xs text-faded">
              {index + 1} of {total} · ← → to move
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
