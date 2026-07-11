"use client";

import type { components } from "@portfolio/api-client";

import {
  Hint,
  Instrument,
  Meter,
  PaneShell,
  Readout,
  Sparkbars,
  StatusDot,
} from "@/panes/platform-ui";
import { useApiData } from "@/shared/hooks/use-api-data";

type AnalyticsResponse = components["schemas"]["AnalyticsResponse"];
type PosthogStats = components["schemas"]["PosthogStats"];
type KeyCount = components["schemas"]["KeyCount"];

/** ISO 3166-1 alpha-2 → regional-indicator flag; falls back to a neutral glyph. */
function flag(code: string): string {
  const cc = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return "🌐";
  return String.fromCodePoint(
    ...[...cc].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );
}

function Meters({
  items,
  withFlags,
}: {
  items: KeyCount[];
  withFlags?: boolean;
}) {
  if (items.length === 0) {
    return <p className="py-1 text-2xs text-muted-foreground">No data yet.</p>;
  }
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div>
      {items.slice(0, 6).map((item) => (
        <Meter
          key={item.key}
          label={item.key || "direct"}
          value={item.count}
          max={max}
          leading={withFlags ? <span>{flag(item.key)}</span> : undefined}
        />
      ))}
    </div>
  );
}

export function AnalyticsPane() {
  const { data, loading } = useApiData<AnalyticsResponse>("/api/v1/analytics");
  const { data: posthog } = useApiData<PosthogStats>("/api/v1/analytics/posthog");

  const recent = data
    ? data.daily.slice(-7).reduce((n, d) => n + d.count, 0)
    : 0;

  return (
    <PaneShell>
      {loading && <p className="text-xs text-muted-foreground">Aggregating visits…</p>}

      {data && (
        <>
          <Instrument
            label="visitors · 30 days"
            right={
              <span className="text-muted-foreground">
                {recent} in last 7d
              </span>
            }
          >
            <div className="mb-2 flex items-end justify-between">
              <Readout value={data.total} label="total visits" tone="primary" />
              <Readout value={data.countries.length} label="countries" />
            </div>
            <Sparkbars data={data.daily} />
            {data.total === 0 && (
              <p className="mt-1 text-2xs text-muted-foreground">
                No visits recorded yet — the counter starts once consent is given.
              </p>
            )}
          </Instrument>

          <div className="grid gap-2.5 @md:grid-cols-2">
            <Instrument label="countries">
              <Meters items={data.countries} withFlags />
            </Instrument>
            <Instrument label="browsers">
              <Meters items={data.browsers} />
            </Instrument>
          </div>

          <Instrument label="referrers">
            <Meters items={data.referrers} />
          </Instrument>
        </>
      )}

      {posthog && (
        <Instrument
          label="product analytics · posthog"
          right={
            <span className="flex items-center gap-1 text-muted-foreground">
              <StatusDot tone="info" />
              consented
            </span>
          }
        >
          <div className="mb-2">
            <Readout
              value={posthog.daily_pageviews.reduce((n, d) => n + d.count, 0)}
              label="pageviews, 30 days"
            />
          </div>
          <Sparkbars data={posthog.daily_pageviews} height={40} />
          {posthog.top_pages.length > 0 && (
            <div className="mt-2 border-t border-border-faint pt-1.5">
              <Meters items={posthog.top_pages} />
            </div>
          )}
        </Instrument>
      )}

      <Hint>
        First-party stats are aggregated in the Rust API from consent-gated
        visits — country comes from the edge and no IP addresses are stored.
        PostHog captures product analytics only after explicit consent.
      </Hint>
    </PaneShell>
  );
}
