"use client";

import { useRef } from "react";

import { formatBytes } from "@/admin/format";
import { STATION_OF, type UploadJob } from "@/admin/use-uploads";
import type { AdminStrings } from "@/i18n/types";
import { Badge, type Tone } from "@/panes/platform-ui";
import { cn } from "@/shared/utils/cn";

const STAGE_TONE: Record<UploadJob["stage"], Tone> = {
  authorizing: "idle",
  uploading: "info",
  processing: "warn",
  ready: "ok",
  failed: "fail",
};

function stationOf(job: UploadJob): number {
  return job.stage === "failed" ? (job.failedAt ?? 0) : STATION_OF[job.stage];
}

function JobRow({ job, t }: { job: UploadJob; t: AdminStrings["pipeline"] }) {
  const station = stationOf(job);
  return (
    <li className="flex items-center gap-2 py-1 text-xs">
      {job.previewUrl ? (
        <img
          src={job.previewUrl}
          alt=""
          className={cn(
            "h-7 w-7 shrink-0 rounded-sm border border-border-faint object-cover",
            job.stage === "failed" && "opacity-40 grayscale",
          )}
        />
      ) : (
        <span className="h-7 w-7 shrink-0 rounded-sm bg-surface-dim" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate">{job.name}</span>
          <span className="shrink-0 text-3xs text-faded">{formatBytes(job.size)}</span>
        </div>
        {job.stage === "failed" ? (
          <p className="truncate text-2xs text-destructive">
            {t.failedAt
              .replace("{detail}", job.detail ?? t.failed)
              .replace("{station}", t.stations[station].label)}
          </p>
        ) : (
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-progress-track">
            <div
              className="h-full rounded-full bg-progress-fill transition-[width] duration-300 ease-out"
              style={{
                width: `${
                  job.stage === "ready"
                    ? 100
                    : job.stage === "processing"
                      ? 75
                      : job.stage === "uploading"
                        ? 15 + job.sent * 45
                        : 6
                }%`,
              }}
            />
          </div>
        )}
      </div>
      <Badge tone={STAGE_TONE[job.stage]}>
        {job.stage === "uploading"
          ? t.putProgress.replace("{percent}", String(Math.round(job.sent * 100)))
          : job.stage === "ready"
            ? t.stageLabels.ready
            : t.stageLabels[job.stage]}
      </Badge>
    </li>
  );
}

export function IngestStrip({
  jobs,
  dragging,
  category,
  categories,
  t,
  onCategory,
  onFiles,
  onClearSettled,
}: {
  jobs: UploadJob[];
  dragging: boolean;
  category: string;
  categories: string[];
  t: AdminStrings["pipeline"];
  onCategory: (value: string) => void;
  onFiles: (files: File[]) => void;
  onClearSettled: () => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <section
      className={cn(
        "@container rounded-lg border transition-colors duration-300",
        dragging
          ? "border-primary border-dashed bg-control-active"
          : "border-border-medium bg-surface-faint",
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={t.uploadAria}
        onClick={() => fileInput.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInput.current?.click();
          }
        }}
        className="cursor-pointer rounded-b-lg @sm:px-5 px-3 @sm:py-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <p className="mt-3 text-center text-2xs text-muted-foreground">
          {dragging ? (
            <span className="text-primary">{t.release}</span>
          ) : (
            <>
              {t.drop}
              <span className="text-faded"> · {t.constraints}</span>
            </>
          )}
        </p>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => {
            onFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-border-faint border-t px-3 py-2">
        <label
          htmlFor="upload-category"
          className="text-3xs text-muted-foreground uppercase tracking-[0.2em]"
        >
          {t.category}
        </label>
        <input
          id="upload-category"
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          placeholder={t.uncategorized}
          className="w-32 rounded border border-border-faint bg-transparent px-2 py-0.5 font-mono text-xs outline-none placeholder:text-placeholder focus-visible:ring-2 focus-visible:ring-ring"
        />
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onCategory(category === c ? "" : c)}
            className={cn(
              "rounded border px-1.5 py-px font-mono text-2xs transition-colors",
              category === c
                ? "border-primary-hint bg-surface-selected text-primary"
                : "border-border-faint text-muted-foreground hover:bg-control-hover hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {jobs.length > 0 && (
        <ul className="border-border-faint border-t px-3 py-1">
          {jobs.map((job) => (
            <JobRow key={job.id} job={job} t={t} />
          ))}
        </ul>
      )}
    </section>
  );
}
