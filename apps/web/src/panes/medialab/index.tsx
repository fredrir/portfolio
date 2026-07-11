"use client";

import type { components } from "@portfolio/api-client";

import type { UiStrings } from "@/i18n/types";
import { Badge, HashChip, Instrument, PaneShell, Readout, useMounted } from "@/panes/platform-ui";
import { useApiData } from "@/shared/hooks/use-api-data";
import { cn } from "@/shared/utils/cn";

type MediaItem = components["schemas"]["MediaItem"];
type MediaVariant = components["schemas"]["MediaVariant"];
type MediaLabStrings = UiStrings["platform"]["medialab"];

function kib(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

const FORMAT_ORDER = ["avif", "webp"];

function VariantTile({
  variant,
  worst,
  best,
  t,
}: {
  variant: MediaVariant;
  worst: number;
  best: boolean;
  t: MediaLabStrings;
}) {
  const mounted = useMounted();
  const pct = worst > 0 ? Math.max(6, (variant.size_bytes / worst) * 100) : 100;
  return (
    <figure className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="relative overflow-hidden rounded border border-border-faint bg-surface-dim">
        {variant.url ? (
          <img
            src={variant.url}
            alt={t.variantAlt.replace("{format}", variant.format)}
            className="h-28 w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-28" />
        )}
        <figcaption className="absolute top-1 left-1 flex items-center gap-1">
          <Badge tone={best ? "ok" : "idle"}>{variant.format.toUpperCase()}</Badge>
          {best && <Badge tone="ok">{t.smallest}</Badge>}
        </figcaption>
      </div>
      <div className="flex items-center justify-between text-2xs">
        <span className="font-mono text-readable tabular-nums">{kib(variant.size_bytes)}</span>
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

function MediaCard({ item, t }: { item: MediaItem; t: MediaLabStrings }) {
  const variants = [...item.variants].sort(
    (a, b) => FORMAT_ORDER.indexOf(a.format) - FORMAT_ORDER.indexOf(b.format),
  );
  const worst = Math.max(1, ...variants.map((v) => v.size_bytes));
  const smallest = variants.reduce((min, v) => (v.size_bytes < min ? v.size_bytes : min), Infinity);

  return (
    <Instrument label={item.filename}>
      <div className="flex gap-2">
        {variants.map((v) => (
          <VariantTile
            key={v.key}
            variant={v}
            worst={worst}
            best={v.size_bytes === smallest}
            t={t}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 border-border-faint border-t pt-1.5">
        {item.content_hash ? <HashChip hash={item.content_hash} /> : <span />}
      </div>
    </Instrument>
  );
}

export function MediaLabPane({ ui }: { ui: UiStrings }) {
  const t = ui.platform.medialab;
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
        <Instrument label={t.processed}>
          <Readout value={items.length || "··"} label={t.images} tone="primary" />
        </Instrument>
        <Instrument label={t.variants}>
          <Readout value={variantCount || "··"} label={t.avifWebp} />
        </Instrument>
        <Instrument label={t.avgSaving}>
          <Readout value={avgSavings != null ? `${avgSavings}%` : "··"} label={t.bestVsLargest} />
        </Instrument>
      </div>

      {loading && <p className="text-muted-foreground text-xs">{t.loading}</p>}
      {error && <p className="text-muted-foreground text-xs">{t.unavailable}</p>}
      {data && items.length === 0 && <p className="text-muted-foreground text-xs">{t.empty}</p>}

      <div className="grid @md:grid-cols-2 gap-2.5">
        {items.slice(0, 12).map((item) => (
          <MediaCard key={item.id} item={item} t={t} />
        ))}
      </div>
    </PaneShell>
  );
}
