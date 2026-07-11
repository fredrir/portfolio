"use client";

import type { components } from "@portfolio/api-client";

import { PaneSection, PaneStatus } from "@/panes/shared";
import { useApiData } from "@/shared/hooks/use-api-data";

type MediaItem = components["schemas"]["MediaItem"];

function kib(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

export function MediaLabPane() {
  const { data, loading, error } = useApiData<MediaItem[]>("/api/v1/media");

  return (
    <div className="p-2 @sm:p-3 h-full overflow-y-auto">
      <p className="text-xs text-muted-foreground mb-3">
        Uploads flow through presigned S3 PUTs, an SQS queue and a Rust worker
        producing AVIF/WebP variants under content-hashed immutable keys,
        served through the edge.
      </p>
      {loading && <PaneStatus text="loading…" />}
      {error && <PaneStatus text="media pipeline data unavailable" />}
      {data && data.length === 0 && <PaneStatus text="no processed media yet" />}
      {data?.map((item) => (
        <PaneSection
          key={item.id}
          title={`${item.filename} · ${item.width}×${item.height}`}
        >
          <div className="flex gap-3 flex-wrap">
            {item.variants.map((v) =>
              v.url ? (
                <figure key={v.key} className="max-w-[46%]">
                  <img
                    src={v.url}
                    alt={`${item.filename} (${v.format})`}
                    className="rounded border border-border-faint max-h-40 w-auto"
                    loading="lazy"
                  />
                  <figcaption className="text-2xs text-muted-foreground mt-0.5">
                    {v.format} · {kib(v.size_bytes)} · immutable
                  </figcaption>
                </figure>
              ) : null,
            )}
          </div>
          <p className="text-2xs text-muted-foreground mt-1 font-mono break-all">
            sha256 {item.content_hash?.slice(0, 16)}…
          </p>
        </PaneSection>
      ))}
    </div>
  );
}
