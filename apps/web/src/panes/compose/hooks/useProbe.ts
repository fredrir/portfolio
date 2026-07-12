import { useEffect, useState } from "react";

interface Probe {
  requestId: string;
  colo: string;
  cache: string;
  slot: string;
  edgeMs: number | null;
  roundTripMs: number;
  version: string | null;
  commit: string | null;
}

export function useProbe(): Probe | null {
  const [probe, setProbe] = useState<Probe | null>(null);
  useEffect(() => {
    const started = performance.now();
    fetch("/api/v1/version", { cache: "no-store", headers: { accept: "application/json" } })
      .then(async (res) => {
        const body = res.ok ? await res.json() : null;
        const timing = res.headers.get("server-timing") ?? "";
        const edge = /edge;dur=(\d+)/.exec(timing);
        setProbe({
          requestId: res.headers.get("x-request-id") ?? "—",
          colo: res.headers.get("x-edge-colo") ?? "—",
          cache: res.headers.get("x-edge-cache") ?? "—",
          slot: res.headers.get("x-origin-slot") ?? "—",
          edgeMs: edge ? Number(edge[1]) : null,
          roundTripMs: Math.round(performance.now() - started),
          version: body?.version ?? null,
          commit: body?.commit ?? null,
        });
      })
      .catch(() => {});
  }, []);
  return probe;
}
