"use client";

import type { components } from "@portfolio/api-client";

import type { UiStrings } from "@/i18n/types";
import {
  Badge,
  Instrument,
  PaneShell,
  Readout,
  relativeTimeWithLabels,
  StatusDot,
  type Tone,
} from "@/panes/platform-ui";
import { useApiData } from "@/shared/hooks/use-api-data";
import { useContainerSize } from "@/shared/hooks/use-container-size";
import { cn } from "@/shared/utils/cn";

type Deployment = components["schemas"]["Deployment"];

function toneFor(conclusion: string | null | undefined): Tone {
  if (conclusion === "success") return "ok";
  if (conclusion == null) return "warn";
  return "fail";
}

export function DeploymentsPane({ ui }: { ui: UiStrings }) {
  const t = ui.platform.deployments;
  const { data, loading, error } = useApiData<Deployment[]>("/api/v1/deployments");
  const { ref, width } = useContainerSize();
  const narrow = width > 0 && width < 380;

  const runs = data ?? [];
  const finished = runs.filter((r) => r.conclusion != null);
  const successes = finished.filter((r) => r.conclusion === "success").length;
  const successRate = finished.length ? Math.round((successes / finished.length) * 100) : null;
  const durations = finished
    .map((r) => r.duration_seconds)
    .filter((d): d is number => typeof d === "number")
    .sort((a, b) => a - b);
  const median = durations.length ? durations[Math.floor(durations.length / 2)] : null;
  const liveSha = runs.find((r) => r.conclusion === "success")?.sha;
  const maxDuration = Math.max(1, ...durations);

  return (
    <PaneShell>
      <div ref={ref}>
        <div className="mb-2.5 grid grid-cols-3 gap-2">
          <Instrument label={t.health}>
            <Readout
              value={successRate != null ? `${successRate}%` : "··"}
              label={t.lastRuns}
              tone="primary"
            />
          </Instrument>
          <Instrument label={t.median}>
            <Readout value={median != null ? `${median}s` : "··"} label={t.buildToLive} />
          </Instrument>
          <Instrument label={t.live}>
            <Readout value={liveSha ? liveSha.slice(0, 7) : "··"} label={t.servingNow} />
          </Instrument>
        </div>

        <Instrument
          label={t.releaseLedger}
          right={
            <span className="flex items-center gap-1 text-muted-foreground">
              <StatusDot tone={error ? "fail" : "ok"} pulse={!error} />
              {runs.length} {t.runs}
            </span>
          }
        >
          {loading && <p className="py-2 text-muted-foreground text-xs">{t.readingHistory}</p>}
          {error && <p className="py-2 text-muted-foreground text-xs">{t.historyUnavailable}</p>}
          <div className="space-y-px">
            {runs.map((run, i) => {
              const tone = toneFor(run.conclusion);
              const isLive = run.sha === liveSha && i === runs.findIndex((r) => r.sha === liveSha);
              const durPct = run.duration_seconds
                ? Math.max(4, (run.duration_seconds / maxDuration) * 100)
                : 0;
              return (
                <div
                  key={run.sha + run.started_at}
                  className={cn(
                    "flex items-center gap-2 rounded px-1.5 py-1 text-xs",
                    isLive ? "bg-surface-soft" : "hover:bg-surface-dim",
                  )}
                >
                  <StatusDot tone={tone} pulse={run.conclusion == null} />
                  <a
                    href={run.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 font-mono text-primary hover:underline"
                  >
                    {run.sha.slice(0, 7)}
                  </a>
                  {!narrow && (
                    <span className="min-w-0 flex-1 truncate text-muted-foreground">
                      {run.title}
                    </span>
                  )}
                  {!narrow && run.duration_seconds != null && (
                    <div className="@sm:block hidden h-1.5 w-12 shrink-0 overflow-hidden rounded-sm bg-chart-track">
                      <div className="h-full bg-chart-fill" style={{ width: `${durPct}%` }} />
                    </div>
                  )}
                  <span className="shrink-0 font-mono text-readable tabular-nums">
                    {run.duration_seconds != null ? `${run.duration_seconds}s` : "—"}
                  </span>
                  {narrow ? (
                    <StatusDot tone={tone} />
                  ) : (
                    <span className="w-14 shrink-0 text-right text-3xs text-muted-foreground">
                      {relativeTimeWithLabels(run.started_at, ui.platform.common.relativeTime)}
                    </span>
                  )}
                  {isLive && <Badge tone="ok">{t.live}</Badge>}
                </div>
              );
            })}
          </div>
        </Instrument>
      </div>
    </PaneShell>
  );
}
