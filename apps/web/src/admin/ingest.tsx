"use client";

import { CircleNotch, Plus } from "@phosphor-icons/react";

import type { UploadJob } from "@/admin/use-uploads";
import { cn } from "@/shared/utils/cn";

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
export function IngestStrip({
  jobs,
  category,
  categoryNames,
  onCategory,
  onBrowse,
}: {
  jobs: UploadJob[];
  category: string;
  categoryNames: string[];
  onCategory: (value: string) => void;
  onBrowse: () => void;
}) {
  const active = jobs.filter((j) => j.stage !== "failed" && j.stage !== "ready");
  const progress = aggregateProgress(active);

  return (
    <div
      className={cn(
        "relative my-3 overflow-hidden rounded-md border border-dashed transition-colors",
        active.length > 0 ? "border-primary-subtle" : "border-border-medium",
      )}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-2 sm:px-4">
        <button
          type="button"
          aria-label="Upload photos: drop files anywhere, paste, or press Enter to browse"
          onClick={onBrowse}
          className="inline-flex min-w-0 items-center gap-2 rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {active.length > 0 ? (
            <>
              <CircleNotch size={13} className="shrink-0 text-primary motion-safe:animate-spin" />
              <span className="truncate font-mono text-primary text-xs">
                developing {active.length}
                <span className="text-muted-foreground"> · {Math.round(progress * 100)}%</span>
              </span>
            </>
          ) : (
            <>
              <Plus size={13} className="shrink-0 text-muted-foreground" />
              <span className="truncate text-muted-foreground text-xs">
                drop photos anywhere, paste, or click to browse
                <span className="text-faded"> · jpeg / png / webp — up to 100 MiB</span>
              </span>
            </>
          )}
        </button>

        <label className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-2xs text-faded">
          into
          <input
            value={category}
            onChange={(e) => onCategory(e.target.value)}
            placeholder="uncategorized"
            aria-label="Category for new uploads"
            list="desk-categories"
            className="w-32 rounded border border-border-faint bg-card px-2 py-1 font-mono text-foreground text-xs outline-none placeholder:text-placeholder focus-visible:border-primary-subtle"
          />
        </label>
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
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
