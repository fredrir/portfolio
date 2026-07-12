"use client";

import { ArrowCounterClockwise, Images, Trash, WarningCircle, X } from "@phosphor-icons/react";
import { memo, useEffect, useState } from "react";

import { formatBytes } from "@/admin/format";
import type { UploadJob } from "@/admin/hooks/use-uploads";
import { bucketOf, type MediaItem, stateLabel, thumbOf } from "@/admin/model";
import { cn } from "@/shared/utils/cn";

/** Two-step trash: first press arms the red confirm, second one deletes. */
export function DeleteButton({
  label,
  confirmLabel,
  onDelete,
  className,
}: {
  label: string;
  confirmLabel: string;
  onDelete: () => Promise<boolean>;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);

  // Disarm when attention moves on.
  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(timer);
  }, [armed]);

  return (
    <button
      type="button"
      aria-label={armed ? confirmLabel : label}
      disabled={busy}
      onClick={() => {
        if (!armed) {
          setArmed(true);
          return;
        }
        setBusy(true);
        void onDelete().then((ok) => {
          setBusy(false);
          if (!ok) setArmed(false);
        });
      }}
      className={cn(
        "inline-flex items-center gap-1 rounded font-mono text-2xs transition-colors disabled:opacity-60",
        armed
          ? "bg-destructive px-2 py-1 text-destructive-foreground"
          : "p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive",
        className,
      )}
    >
      <Trash size={12} className={busy ? "motion-safe:animate-pulse" : undefined} />
      {armed && confirmLabel}
    </button>
  );
}

function developOf(job: UploadJob): number {
  if (job.stage === "authorizing") return 0.08;
  if (job.stage === "uploading") return 0.08 + 0.72 * job.sent;
  if (job.stage === "processing") return 0.85;
  return 1;
}

function GhostTile({
  job,
  onRetryJob,
  onDismissJob,
}: {
  job: UploadJob;
  onRetryJob: (id: string) => void;
  onDismissJob: (id: string) => void;
}) {
  const develop = developOf(job);
  const failed = job.stage === "failed";
  const stageLabel =
    job.stage === "authorizing"
      ? "authorizing"
      : job.stage === "uploading"
        ? `uploading ${Math.round(job.sent * 100)}%`
        : "developing";

  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-md bg-card",
        job.stage === "processing" && "safelight-pulse",
        failed && "ring-1 ring-destructive/50 ring-inset",
      )}
    >
      <img
        src={job.previewUrl}
        alt={job.name}
        className={cn("h-full w-full object-cover", !failed && "developing-print")}
        style={
          failed
            ? { filter: "grayscale(1) brightness(0.4)" }
            : ({ "--develop": develop } as React.CSSProperties)
        }
      />

      {failed ? (
        <>
          <div className="absolute top-1 right-1 flex gap-0.5">
            <button
              type="button"
              aria-label={`Retry upload of ${job.name}`}
              onClick={() => onRetryJob(job.id)}
              className="rounded bg-glass-medium p-1.5 text-foreground backdrop-blur-sm transition-colors hover:text-primary"
            >
              <ArrowCounterClockwise size={12} />
            </button>
            <button
              type="button"
              aria-label={`Dismiss failed upload of ${job.name}`}
              onClick={() => onDismissJob(job.id)}
              className="rounded bg-glass-medium p-1.5 text-foreground backdrop-blur-sm transition-colors hover:text-destructive"
            >
              <X size={12} />
            </button>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-glass-medium px-1.5 py-1 backdrop-blur-sm">
            <p className="truncate font-mono text-2xs text-destructive">
              <WarningCircle size={10} className="mr-1 inline" />
              {job.detail}
            </p>
            <p className="truncate text-3xs text-muted-foreground">{job.name}</p>
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-x-0 bottom-0 px-1.5 py-1">
            <p className="truncate font-mono text-2xs text-primary">{stageLabel}</p>
          </div>
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-progress-track">
            <div
              className="h-full bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${Math.round(develop * 100)}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}

const PhotoTile = memo(function PhotoTile({
  item,
  onOpen,
  onDelete,
}: {
  item: MediaItem;
  onOpen: (id: string) => void;
  onDelete: (id: string) => Promise<boolean>;
}) {
  const thumb = thumbOf(item);
  const bucket = bucketOf(item);

  return (
    <div
      className={cn(
        "group relative aspect-square overflow-hidden rounded-md bg-card [content-visibility:auto]",
        bucket === "processing" && !thumb && "safelight-pulse",
        bucket === "failed" && "ring-1 ring-destructive/50 ring-inset",
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(item.id)}
        aria-label={`Open ${item.filename}`}
        className="block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        {thumb ? (
          <img
            src={thumb}
            alt={item.filename}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          <span
            className={cn(
              "flex h-full w-full items-center justify-center font-mono text-2xs",
              bucket === "failed" ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {bucket === "failed" && <WarningCircle size={12} className="mr-1" />}
            {stateLabel(bucket)}
          </span>
        )}
      </button>

      <div className="absolute top-1 right-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        <DeleteButton
          label={`Delete ${item.filename}`}
          confirmLabel="delete?"
          onDelete={() => onDelete(item.id)}
          className="bg-glass-medium backdrop-blur-sm"
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-glass-medium px-1.5 py-1 backdrop-blur-sm transition-transform duration-200 group-focus-within:translate-y-0 group-hover:translate-y-0">
        <p className="truncate font-mono text-2xs">{item.filename}</p>
        <p className="truncate text-3xs text-muted-foreground">
          {item.width && item.height ? `${item.width}×${item.height}` : stateLabel(bucket)}
          {item.size_bytes ? ` · ${formatBytes(item.size_bytes)}` : ""}
        </p>
      </div>
    </div>
  );
});

export function PhotoGrid({
  media,
  jobs,
  filtered,
  onOpen,
  onDelete,
  onRetryJob,
  onDismissJob,
  onClearFilters,
}: {
  media: MediaItem[];
  jobs: UploadJob[];
  filtered: boolean;
  onOpen: (id: string) => void;
  onDelete: (id: string) => Promise<boolean>;
  onRetryJob: (id: string) => void;
  onDismissJob: (id: string) => void;
  onClearFilters: () => void;
}) {
  if (media.length === 0 && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-20 text-muted-foreground">
        <Images size={26} />
        {filtered ? (
          <>
            <p className="text-xs">nothing matches</p>
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-full border border-border-medium px-3 py-1 font-mono text-2xs transition-colors hover:border-primary-subtle hover:text-foreground"
            >
              clear filters
            </button>
          </>
        ) : (
          <p className="text-xs">no photos yet</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-1">
      {jobs.map((job) => (
        <GhostTile key={job.id} job={job} onRetryJob={onRetryJob} onDismissJob={onDismissJob} />
      ))}
      {media.map((item) => (
        <PhotoTile key={item.id} item={item} onOpen={onOpen} onDelete={onDelete} />
      ))}
    </div>
  );
}
