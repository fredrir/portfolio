"use client";

import type { components } from "@portfolio/api-client";

import type { UiStrings } from "@/i18n/types";
import { Instrument, Meter, PaneShell, Readout, Sparkbars, StatusDot } from "@/panes/platform-ui";
import { useApiData } from "@/shared/hooks/use-api-data";

type AnalyticsResponse = components["schemas"]["AnalyticsResponse"];
type PosthogStats = components["schemas"]["PosthogStats"];
type KeyCount = components["schemas"]["KeyCount"];

/** ISO 3166-1 alpha-2 → regional-indicator flag; falls back to a neutral glyph. */
function flag(code: string): string {
  const cc = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return "🌐";
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

function Meters({
  items,
  noDataText,
  directLabel,
  withFlags,
}: {
  items: KeyCount[];
  noDataText: string;
  directLabel: string;
  withFlags?: boolean;
}) {
  if (items.length === 0) {
    return <p className="py-1 text-2xs text-muted-foreground">{noDataText}</p>;
  }
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div>
      {items.slice(0, 6).map((item) => (
        <Meter
          key={item.key}
          label={item.key || directLabel}
          value={item.count}
          max={max}
          leading={withFlags ? <span>{flag(item.key)}</span> : undefined}
        />
      ))}
    </div>
  );
}

export function AnalyticsPane({ ui }: { ui: UiStrings }) {
  const t = ui.platform.analytics;
  const common = ui.platform.common;
  const { data, loading } = useApiData<AnalyticsResponse>("/api/v1/analytics");
  const { data: posthog } = useApiData<PosthogStats>("/api/v1/analytics/posthog");

  const recent = data ? data.daily.slice(-7).reduce((n, d) => n + d.count, 0) : 0;

  return (
    <PaneShell>
      {loading && <p className="text-muted-foreground text-xs">{t.aggregating}</p>}

      {data && (
        <>
          <Instrument
            label={t.visitors30}
            right={
              <span className="text-muted-foreground">
                {t.inLast7d.replace("{count}", String(recent))}
              </span>
            }
          >
            <div className="mb-2 flex items-end justify-between">
              <Readout value={data.total} label={t.totalVisits} tone="primary" />
              <Readout value={data.countries.length} label={t.countries} />
            </div>
            <Sparkbars
              data={data.daily}
              ariaLabel={(peak) => `${common.dailySeriesPeak} ${peak}`}
            />
            {data.total === 0 && (
              <p className="mt-1 text-2xs text-muted-foreground">{t.noVisits}</p>
            )}
          </Instrument>

          <div className="grid @md:grid-cols-2 gap-2.5">
            <Instrument label={t.countries}>
              <Meters
                items={data.countries}
                noDataText={common.noDataYet}
                directLabel={common.direct}
                withFlags
              />
            </Instrument>
            <Instrument label={t.browsers}>
              <Meters
                items={data.browsers}
                noDataText={common.noDataYet}
                directLabel={common.direct}
              />
            </Instrument>
          </div>

          <Instrument label={t.referrers}>
            <Meters
              items={data.referrers}
              noDataText={common.noDataYet}
              directLabel={common.direct}
            />
          </Instrument>
        </>
      )}

      {posthog && (
        <Instrument
          label={t.productAnalytics}
          right={
            <span className="flex items-center gap-1 text-muted-foreground">
              <StatusDot tone="info" />
              {t.consented}
            </span>
          }
        >
          <div className="mb-2">
            <Readout
              value={posthog.daily_pageviews.reduce((n, d) => n + d.count, 0)}
              label={t.pageviews30}
            />
          </div>
          <Sparkbars
            data={posthog.daily_pageviews}
            height={40}
            ariaLabel={(peak) => `${common.dailySeriesPeak} ${peak}`}
          />
          {posthog.top_pages.length > 0 && (
            <div className="mt-2 border-border-faint border-t pt-1.5">
              <Meters
                items={posthog.top_pages}
                noDataText={common.noDataYet}
                directLabel={common.direct}
              />
            </div>
          )}
        </Instrument>
      )}
    </PaneShell>
  );
}
