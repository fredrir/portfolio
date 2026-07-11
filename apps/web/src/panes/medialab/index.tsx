"use client";

import type { components } from "@portfolio/api-client";

import {
  Badge,
  HashChip,
  Hint,
  Instrument,
  PaneShell,
  Readout,
  useMounted,
} from "@/panes/platform-ui";
import { useApiData } from "@/shared/hooks/use-api-data";
import { cn } from "@/shared/utils/cn";

type MediaItem = components["schemas"]["MediaItem"];
type MediaVariant = components["schemas"]["MediaVariant"];

function kib(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

const FORMAT_ORDER = ["avif", "webp"];

function VariantTile({
  variant,
  worst,
  best,
}: {
  variant: MediaVariant;
  worst: number;
  best: boolean;
}) {
  const mounted = useMounted();
  const pct = worst > 0 ? Math.max(6, (variant.size_bytes / worst) * 100) : 100;
  return (
    <figure className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="relative overflow-hidden rounded border border-border-faint bg-surface-dim">
        {variant.url ? (
          <img
            src={variant.url}
            alt={`${variant.format} variant`}
            className="h-28 w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-28" />
        )}
        <figcaption className="absolute left-1 top-1 flex items-center gap-1">
          <Badge tone={best ? "ok" : "idle"}>{variant.format.toUpperCase()}</Badge>
          {best && <Badge tone="ok">smallest</Badge>}
        </figcaption>
      </div>
      <div className="flex items-center justify-between text-2xs">
        <span className="font-mono tabular-nums text-readable">{kib(variant.size_bytes)}</span>
        <span className="text-muted-foreground">
          {variant.width}×{variant.height}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-sm bg-chart-track">
        <div
          className={cn("h-full rounded-sm", best ? "bg-primary" : "bg-chart-fill")}
          style={{ width: mounted ? `${pct}%` : "0%", transition: "width 600ms ease-out" }}
        />
      </div>
    </figure>
  );
}

function MediaCard({ item }: { item: MediaItem }) {
  const variants = [...item.variants].sort(
    (a, b) => FORMAT_ORDER.indexOf(a.format) - FORMAT_ORDER.indexOf(b.format),
  );
  const worst = Math.max(1, ...variants.map((v) => v.size_bytes));
  const smallest = variants.reduce(
    (min, v) => (v.size_bytes < min ? v.size_bytes : min),
    Infinity,
  );
  const largest = Math.max(...variants.map((v) => v.size_bytes));
  const savings =
    largest > 0 && smallest < Infinity
      ? Math.round((1 - smallest / largest) * 100)
      : 0;

  return (
    <Instrument
      label={item.filename}
      right={savings > 0 ? <Badge tone="ok">−{savings}% best</Badge> : undefined}
    >
      <div className="flex gap-2">
        {variants.map((v) => (
          <VariantTile
            key={v.key}
            variant={v}
            worst={worst}
            best={v.size_bytes === smallest}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 border-t border-border-faint pt-1.5">
        {item.content_hash ? <HashChip hash={item.content_hash} /> : <span />}
        <span className="text-3xs uppercase tracking-[0.15em] text-muted-foreground">
          content-addressed · immutable
        </span>
      </div>
    </Instrument>
  );
}

export function MediaLabPane() {
  const { data, loading, error } = useApiData<MediaItem[]>("/api/v1/media");
  const items = (data ?? []).filter((m) => m.variants.length > 0);
  const variantCount = items.reduce((n, m) => n + m.variants.length, 0);
  const avgSavings = (() => {
    const perItem = items
      .map((m) => {
        const sizes = m.variants.map((v) => v.size_bytes);
        const lo = Math.min(...sizes);
        const hi = Math.max(...sizes);
        return hi > 0 ? 1 - lo / hi : 0;
      })
      .filter((s) => s > 0);
    if (!perItem.length) return null;
    return Math.round((perItem.reduce((a, b) => a + b, 0) / perItem.length) * 100);
  })();

  return (
    <PaneShell>
      <div className="grid grid-cols-3 gap-2">
        <Instrument label="processed">
          <Readout value={items.length || "··"} label="images" tone="primary" />
        </Instrument>
        <Instrument label="variants">
          <Readout value={variantCount || "··"} label="avif + webp" />
        </Instrument>
        <Instrument label="avg saving">
          <Readout value={avgSavings != null ? `${avgSavings}%` : "··"} label="best vs largest" />
        </Instrument>
      </div>

      {loading && (
        <p className="text-xs text-muted-foreground">Loading the codec bench…</p>
      )}
      {error && (
        <p className="text-xs text-muted-foreground">
          The media pipeline is momentarily unavailable.
        </p>
      )}
      {data && items.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No processed media yet. Uploads become variants within seconds.
        </p>
      )}

      <div className="grid gap-2.5 @md:grid-cols-2">
        {items.slice(0, 12).map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>

      <Hint>
        An upload flows through a presigned S3 PUT, an SQS event and a Rust
        worker that strips metadata and encodes AVIF and WebP under
        content-hashed keys. The edge signs and caches the reads.
      </Hint>
    </PaneShell>
  );
}
