"use client";

import { CircleNotch, Plus } from "@phosphor-icons/react";
import { type ChangeEvent, useRef } from "react";

import type { UploadJob } from "@/admin/hooks/use-uploads";
import { cn } from "@/shared/utils/cn";

const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp";

interface IngestStripProps {
  jobs: UploadJob[];
  category: string;
  categoryNames: string[];
  onCategory: (value: string) => void;
  onFiles: (files: File[]) => void;
}

function aggregateProgress(jobs: UploadJob[]): number {
  if (jobs.length === 0) return 0;
  const sum = jobs.reduce((acc, j) => {
    if (j.stage === "authorizing") return acc + 0.05;
    if (j.stage === "uploading") return acc + 0.05 + 0.85 * j.sent;
    return acc + 0.95;
  }, 0);
  return sum / jobs.length;
}

/**
 * Deliberately slim: the whole window accepts drops and uploads develop as
 * tiles in the grid below, so this strip only invites, shows the aggregate
 * loader, and holds the destination category.
 */
export function DropPhotos({
  jobs,
  category,
  categoryNames,
  onCategory,
  onFiles,
}: IngestStripProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const active = jobs.filter((job) => job.stage !== "failed");
  const progress = aggregateProgress(active);
  const progressPercent = Math.round(progress * 100);

  const handleSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    if (files.length > 0) onFiles(files);
  };

  return (
    <section
      aria-label="Upload photos"
      className={cn(
        "relative my-3 overflow-hidden rounded-lg border bg-card/50 transition-colors",
        active.length > 0
          ? "border-primary-subtle shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.08)]"
          : "border-border-faint hover:border-border-medium",
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <button
          type="button"
          aria-label="Upload multiple photos: drop files anywhere, paste, or press Enter to browse"
          onClick={() => fileInputRef.current?.click()}
          className="group flex min-h-18 min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left outline-none transition-colors hover:bg-surface-dim focus-visible:bg-surface-dim focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-4"
        >
          <span
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-md border transition-colors",
              active.length > 0
                ? "border-primary-subtle bg-primary-hint text-primary"
                : "border-border-faint bg-surface-dim text-muted-foreground group-hover:border-primary-subtle group-hover:text-primary",
            )}
          >
            {active.length > 0 ? (
              <CircleNotch size={15} className="motion-safe:animate-spin" />
            ) : (
              <Plus size={15} />
            )}
          </span>

          {active.length > 0 ? (
            <span className="min-w-0">
              <span className="block truncate font-mono text-primary text-xs">
                developing {active.length} {active.length === 1 ? "photo" : "photos"}
              </span>
              <span className="block truncate text-2xs text-muted-foreground">
                {progressPercent}% complete
              </span>
            </span>
          ) : (
            <span className="min-w-0">
              <span className="block truncate text-foreground text-xs">Drop photos</span>
            </span>
          )}
        </button>

        <label className="flex shrink-0 items-center gap-2 border-border-faint border-t px-3 py-2 sm:w-52 sm:border-t-0 sm:border-l sm:px-4">
          <span className="text-2xs text-faded">into</span>
          <input
            value={category}
            onChange={(event) => onCategory(event.target.value)}
            placeholder="uncategorized"
            aria-label="Category for new uploads"
            list="desk-categories"
            className="min-w-0 flex-1 rounded border border-border-faint bg-background/60 px-2 py-1.5 font-mono text-foreground text-xs outline-none transition-colors placeholder:text-placeholder hover:border-border-medium focus-visible:border-primary-subtle"
          />
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          multiple
          hidden
          onChange={handleSelection}
        />
        <datalist id="desk-categories">
          {categoryNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>

      {active.length > 0 && (
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-progress-track">
          <div
            className="h-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </section>
  );
}
