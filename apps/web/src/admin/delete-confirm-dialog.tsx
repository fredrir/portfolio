"use client";

import { Trash, Warning } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";

import type { MediaItem } from "@/admin/model";
import { thumbOf } from "@/admin/model";

export function DeleteConfirmDialog({
  item,
  busy,
  onCancel,
  onConfirm,
}: {
  item: MediaItem;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();

    return () => {
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, []);

  const preview = thumbOf(item);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-6"
      onKeyDown={(event) => {
        // Keep dialog keystrokes from reaching the lightbox underneath it.
        event.stopPropagation();

        if (event.key === "Escape" && !busy) {
          event.preventDefault();
          onCancel();
          return;
        }

        if (event.key !== "Tab") return;
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!controls?.length) return;

        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Cancel deletion"
        disabled={busy}
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-overlay-heavy backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-busy={busy}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        className="relative w-full max-w-sm overflow-hidden rounded-lg border border-destructive/35 bg-card shadow-2xl"
      >
        <div className="flex gap-3 p-4 sm:p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <Warning size={20} weight="fill" aria-hidden="true" />
          </span>
          <div className="min-w-0 pt-0.5">
            <h2 id="delete-dialog-title" className="font-medium text-sm">
              Delete this image?
            </h2>
            <p id="delete-dialog-description" className="mt-1 text-muted-foreground text-xs">
              This permanently removes the original and all generated variants. This action cannot
              be undone.
            </p>
          </div>
        </div>

        <div className="mx-4 flex items-center gap-3 rounded-md border border-border-faint bg-background/60 p-2 sm:mx-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-card text-muted-foreground">
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <Trash size={16} aria-hidden="true" />
            )}
          </div>
          <span className="min-w-0 truncate font-mono text-xs" title={item.filename}>
            {item.filename}
          </span>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 border-border-faint border-t bg-background/30 p-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="min-h-10 rounded border border-border-medium px-4 font-medium text-xs transition-colors hover:bg-surface-dim focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded bg-destructive px-4 font-medium text-destructive-foreground text-xs transition-colors hover:brightness-110 focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:opacity-60"
          >
            <Trash size={14} className={busy ? "motion-safe:animate-pulse" : undefined} />
            {busy ? "Deleting…" : "Delete image"}
          </button>
        </div>
      </div>
    </div>
  );
}
