"use client";

/**
 * The ingest strip: the drop zone *is* the pipeline diagram. Four stations
 * (authorize → s3 put → worker → live) sit on a rail; active jobs light up
 * their current station and ride a per-job progress track underneath.
 */
import { useRef } from "react";

import { formatBytes } from "@/admin/format";
import { STATION_OF, type UploadJob } from "@/admin/use-uploads";
import { Badge, StatusDot, type Tone } from "@/panes/platform-ui";
import { cn } from "@/shared/utils/cn";

const STATIONS = [
  { label: "authorize", sub: "grant + audit" },
  { label: "s3 put", sub: "presigned" },
  { label: "worker", sub: "avif · webp" },
  { label: "live", sub: "gallery" },
];

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

function StationRail({ jobs, dragging }: { jobs: UploadJob[]; dragging: boolean }) {
  const active = jobs.filter((j) => j.stage !== "ready" && j.stage !== "failed");
  const reach = active.length
    ? Math.max(...active.map(stationOf))
    : jobs.some((j) => j.stage === "ready")
      ? 3
      : -1;
  return (
    <div className="flex items-center gap-1.5 @sm:gap-2" aria-hidden>
      {STATIONS.map((station, i) => {
        const lit = dragging || i <= reach;
        const busyHere = active.some((j) => stationOf(j) === i);
        const failedHere = jobs.some(
          (j) => j.stage === "failed" && stationOf(j) === i,
        );
        return (
          <div key={station.label} className="contents">
            {i > 0 && (
              <span
                className={cn(
                  "h-px flex-1 transition-colors duration-500",
                  lit ? "bg-primary-subtle" : "bg-border-faint",
                )}
              />
            )}
            <div className="flex flex-col items-center gap-0.5">
              <span
                className={cn(
                  "text-xs leading-none transition-colors duration-500",
                  failedHere
                    ? "text-destructive"
                    : lit
                      ? "text-primary"
                      : "text-primary-hint",
                  busyHere && "motion-safe:animate-pulse",
                )}
              >
                ◈
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-3xs uppercase tracking-[0.18em] transition-colors duration-500",
                  lit ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {station.label}
              </span>
              <span className="hidden text-3xs text-faded @md:block">
                {station.sub}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function JobRow({ job }: { job: UploadJob }) {
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
          <span className="shrink-0 text-3xs text-faded">
            {formatBytes(job.size)}
          </span>
        </div>
        {job.stage === "failed" ? (
          <p className="truncate text-2xs text-destructive">
            {job.detail ?? "failed"} · at {STATIONS[station].label}
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
          ? `put ${Math.round(job.sent * 100)}%`
          : job.stage === "ready"
            ? "live"
            : job.stage}
      </Badge>
    </li>
  );
}

export function IngestStrip({
  jobs,
  dragging,
  category,
  categories,
  onCategory,
  onFiles,
  onClearSettled,
}: {
  jobs: UploadJob[];
  dragging: boolean;
  category: string;
  categories: string[];
  onCategory: (value: string) => void;
  onFiles: (files: File[]) => void;
  onClearSettled: () => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const hasSettled = jobs.some(
    (j) => j.stage === "ready" || j.stage === "failed",
  );
  const busy = jobs.some(
    (j) => j.stage !== "ready" && j.stage !== "failed",
  );

  return (
    <section
      className={cn(
        "@container rounded-lg border transition-colors duration-300",
        dragging
          ? "border-dashed border-primary bg-control-active"
          : "border-border-medium bg-surface-faint",
      )}
    >
      <header className="flex items-center justify-between gap-2 border-b border-border-faint px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <StatusDot tone={busy ? "warn" : "ok"} pulse={busy} />
          <h2 className="text-2xs font-bold uppercase tracking-[0.18em] text-primary">
            ingest
          </h2>
        </div>
        {hasSettled && (
          <button
            type="button"
            onClick={onClearSettled}
            className="rounded border border-border-faint px-1.5 py-px text-2xs text-muted-foreground transition-colors hover:bg-control-hover hover:text-foreground"
          >
            clear finished
          </button>
        )}
      </header>

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload images: drop files anywhere or press Enter to browse"
        onClick={() => fileInput.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInput.current?.click();
          }
        }}
        className="cursor-pointer rounded-b-lg px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring @sm:px-5 @sm:py-4"
      >
        <StationRail jobs={jobs} dragging={dragging} />
        <p className="mt-3 text-center text-2xs text-muted-foreground">
          {dragging ? (
            <span className="text-primary">release to feed the pipeline</span>
          ) : (
            <>
              drop images anywhere, or click to browse
              <span className="text-faded"> · jpeg / png / webp · ≤ 25 MiB</span>
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

      <div className="flex flex-wrap items-center gap-1.5 border-t border-border-faint px-3 py-2">
        <label
          htmlFor="upload-category"
          className="text-3xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          category
        </label>
        <input
          id="upload-category"
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          placeholder="uncategorized"
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
        <ul className="border-t border-border-faint px-3 py-1">
          {jobs.map((job) => (
            <JobRow key={job.id} job={job} />
          ))}
        </ul>
      )}
    </section>
  );
}
