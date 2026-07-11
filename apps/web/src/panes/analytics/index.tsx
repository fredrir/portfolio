"use client";

import type { components } from "@portfolio/api-client";

import { KVRow, PaneSection, PaneStatus } from "@/panes/shared";
import { useApiData } from "@/shared/hooks/use-api-data";

type AnalyticsResponse = components["schemas"]["AnalyticsResponse"];
type PosthogStats = components["schemas"]["PosthogStats"];
type DailyCount = components["schemas"]["DailyCount"];
type KeyCount = components["schemas"]["KeyCount"];

function DailyBars({ daily }: { daily: DailyCount[] }) {
  const max = Math.max(1, ...daily.map((d) => d.count));
  return (
    <div className="flex items-end gap-px h-16 mt-1" aria-hidden>
      {daily.map((d) => (
        <div
          key={d.day}
          title={`${d.day}: ${d.count}`}
          className="flex-1 bg-primary/60 hover:bg-primary rounded-t-sm min-h-px"
          style={{ height: `${Math.max(3, (d.count / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

function TopList({ items }: { items: KeyCount[] }) {
  if (items.length === 0) {
    return <PaneStatus text="no data yet" />;
  }
  return (
    <div>
      {items.map((item) => (
        <KVRow key={item.key} label={item.key} value={item.count} />
      ))}
    </div>
  );
}

export function AnalyticsPane() {
  const { data, loading } = useApiData<AnalyticsResponse>("/api/v1/analytics");
  const { data: posthog } = useApiData<PosthogStats>(
    "/api/v1/analytics/posthog",
  );

  return (
    <div className="p-2 @sm:p-3 h-full overflow-y-auto">
      {loading && <PaneStatus text="loading…" />}
      {data && (
        <>
          <PaneSection title={`visits — ${data.total} total, last 30 days`}>
            <DailyBars daily={data.daily} />
          </PaneSection>
          <div className="grid @md:grid-cols-2 gap-x-4">
            <PaneSection title="countries">
              <TopList items={data.countries} />
            </PaneSection>
            <PaneSection title="browsers">
              <TopList items={data.browsers} />
            </PaneSection>
          </div>
          <PaneSection title="referrers">
            <TopList items={data.referrers} />
          </PaneSection>
        </>
      )}
      {posthog && (
        <>
          <PaneSection title="posthog — pageviews, last 30 days">
            <DailyBars daily={posthog.daily_pageviews} />
          </PaneSection>
          <PaneSection title="posthog — top pages">
            <TopList items={posthog.top_pages} />
          </PaneSection>
        </>
      )}
      <p className="text-2xs text-muted-foreground">
        First-party stats are aggregated in the Rust API from consent-gated
        visits (country from the edge, no IP addresses stored). PostHog
        collects product analytics only after explicit consent.
      </p>
    </div>
  );
}
