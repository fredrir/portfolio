"use client";

import type { components } from "@portfolio/api-client";
import { useEffect, useState } from "react";

import { KVRow, PaneSection, PaneStatus } from "@/panes/shared";
import { useApiData } from "@/shared/hooks/use-api-data";

type VersionInfo = components["schemas"]["VersionInfo"];

interface EdgeProbe {
  requestId: string;
  colo: string;
  cache: string;
  slot: string;
  serverTiming: string;
  durationMs: number;
}

function useEdgeProbe() {
  const [probe, setProbe] = useState<EdgeProbe | null>(null);
  useEffect(() => {
    const started = performance.now();
    fetch("/healthz", { cache: "no-store" })
      .then((res) => {
        setProbe({
          requestId: res.headers.get("x-request-id") ?? "n/a",
          colo: res.headers.get("x-edge-colo") ?? "n/a",
          cache: res.headers.get("x-edge-cache") ?? "n/a",
          slot: res.headers.get("x-origin-slot") ?? "n/a",
          serverTiming: res.headers.get("server-timing") ?? "n/a",
          durationMs: Math.round(performance.now() - started),
        });
      })
      .catch(() => {});
  }, []);
  return probe;
}

export function EngineeringPane() {
  const probe = useEdgeProbe();
  const { data: version } = useApiData<VersionInfo>("/api/v1/version");

  return (
    <div className="p-2 @sm:p-3 h-full overflow-y-auto">
      <p className="text-xs text-muted-foreground mb-3">
        This request, inspected live: browser → Cloudflare Worker → Access →
        Tunnel → Caddy → blue/green slots on a private origin with no public
        ports.
      </p>
      <PaneSection title="edge & origin">
        {probe ? (
          <>
            <KVRow label="request id" value={probe.requestId} />
            <KVRow label="cloudflare colo" value={probe.colo} />
            <KVRow label="edge cache" value={probe.cache} />
            <KVRow label="active slot" value={probe.slot} />
            <KVRow label="server-timing" value={probe.serverTiming} />
            <KVRow label="round trip" value={`${probe.durationMs} ms`} />
          </>
        ) : (
          <PaneStatus text="probing…" />
        )}
      </PaneSection>
      <PaneSection title="release">
        {version ? (
          <>
            <KVRow
              label="commit"
              value={
                <a
                  className="text-primary underline"
                  href={`https://github.com/fredrir/portfolio/commit/${version.commit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {version.commit.slice(0, 12)}
                </a>
              }
            />
            <KVRow label="version" value={version.version} />
          </>
        ) : (
          <PaneStatus text="loading…" />
        )}
      </PaneSection>
      <PaneSection title="supply chain">
        <p className="text-xs text-muted-foreground">
          Images are built once, attested (SBOM + provenance), signed with
          keyless Cosign and verified on the host before a slot starts.
          Failed health gates roll back automatically.
        </p>
      </PaneSection>
    </div>
  );
}
