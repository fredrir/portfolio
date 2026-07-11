"use client";

import type { components } from "@portfolio/api-client";

import { PaneSection, PaneStatus } from "@/panes/shared";
import { useApiData } from "@/shared/hooks/use-api-data";
import { useContainerSize } from "@/shared/hooks/use-container-size";

type Deployment = components["schemas"]["Deployment"];

export function DeploymentsPane() {
  const { data, loading, error } = useApiData<Deployment[]>(
    "/api/v1/deployments",
  );
  const { ref: containerRef, width } = useContainerSize();
  const narrow = width > 0 && width < 380;

  return (
    <div className="p-2 @sm:p-3 h-full overflow-y-auto">
      <div ref={containerRef}>
        <PaneSection title="production deployments (main)">
          {loading && <PaneStatus text="loading…" />}
          {error && <PaneStatus text="deployment history unavailable" />}
          {data && (
            <div className="space-y-0.5">
              {data.map((run) => (
                <div
                  key={run.sha + run.started_at}
                  className="flex items-center gap-2 py-1 border-b border-border-faint text-xs"
                >
                  <a
                    href={run.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline font-mono shrink-0"
                  >
                    {run.sha.slice(0, 8)}
                  </a>
                  {!narrow && (
                    <span className="truncate flex-1 text-muted-foreground">
                      {run.title}
                    </span>
                  )}
                  <span className="font-mono shrink-0">
                    {run.duration_seconds}s
                  </span>
                  <span
                    className={
                      run.conclusion === "success"
                        ? "text-primary shrink-0"
                        : "text-destructive shrink-0"
                    }
                  >
                    {run.conclusion ?? "running"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </PaneSection>
        <p className="text-2xs text-muted-foreground">
          Each release deploys to the inactive blue/green slot behind a health
          gate; traffic switches only after public smoke tests pass. A failed
          release never reaches visitors — the drill postmortem is in the
          repository.
        </p>
      </div>
    </div>
  );
}
