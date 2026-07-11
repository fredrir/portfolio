"use client";

import { useEffect, useState } from "react";

import {
  Badge,
  Hint,
  Instrument,
  PaneShell,
  Readout,
  StatusDot,
  useMounted,
} from "@/panes/platform-ui";
import { cn } from "@/shared/utils/cn";

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

/** One live request to a slot-tagged endpoint reveals the whole path at once. */
function useProbe(): Probe | null {
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

function Hop({
  name,
  detail,
  index,
  live,
  glow,
}: {
  name: string;
  detail: string;
  index: number;
  live: boolean;
  glow?: boolean;
}) {
  const mounted = useMounted();
  const on = mounted && live;
  return (
    <div
      className={cn(
        "flex-1 rounded border px-2 py-1.5 transition-all duration-300 min-w-[4.5rem]",
        on
          ? glow
            ? "border-primary bg-surface-soft shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]"
            : "border-primary-hint bg-surface-dim"
          : "border-border-faint bg-transparent opacity-40",
      )}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="flex items-center gap-1.5">
        <StatusDot tone={on ? "ok" : "idle"} pulse={glow} />
        <span className="truncate text-2xs font-semibold text-foreground">{name}</span>
      </div>
      <span className="mt-0.5 block truncate font-mono text-3xs text-muted-foreground">
        {detail}
      </span>
    </div>
  );
}

export function EngineeringPane() {
  const probe = useProbe();
  const live = probe != null;
  const slot = probe?.slot ?? "—";

  const hops = [
    { name: "Browser", detail: "your device", glow: false },
    { name: "CF Worker", detail: probe ? `colo ${probe.colo}` : "routing", glow: false },
    { name: "Access", detail: "service token", glow: false },
    { name: "Tunnel", detail: "cloudflared", glow: false },
    { name: "Caddy", detail: "reverse proxy", glow: false },
    {
      name: slot !== "—" ? `${slot} slot` : "origin slot",
      detail: "private origin",
      glow: true,
    },
  ];

  return (
    <PaneShell>
      <Instrument
        label="live request path"
        right={
          <span className="flex items-center gap-1 text-muted-foreground">
            <StatusDot tone={live ? "ok" : "idle"} pulse={live} />
            {live ? "traced" : "tracing…"}
          </span>
        }
      >
        <div className="flex flex-col gap-1.5 @sm:flex-row @sm:items-stretch">
          {hops.map((hop, i) => (
            <div key={hop.name} className="flex items-center gap-1.5 @sm:flex-1 @sm:flex-col @sm:gap-1">
              <Hop {...hop} index={i} live={live} />
              {i < hops.length - 1 && (
                <span className="shrink-0 text-primary-dim @sm:hidden">↓</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-2 text-3xs text-muted-foreground">
          No public ports on the origin — the edge Worker presents an Access
          service token and everything after it is private.
        </p>
      </Instrument>

      <div className="grid grid-cols-3 gap-2">
        <Instrument label="round trip">
          <Readout
            value={probe ? `${probe.roundTripMs}` : "··"}
            label="ms, browser→origin"
            tone="primary"
          />
        </Instrument>
        <Instrument label="edge time">
          <Readout value={probe?.edgeMs != null ? `${probe.edgeMs}` : "··"} label="ms at worker" />
        </Instrument>
        <Instrument label="cache">
          <div className="pt-0.5">
            <Badge tone={probe?.cache === "HIT" ? "ok" : "idle"}>
              {probe?.cache ?? "··"}
            </Badge>
          </div>
        </Instrument>
      </div>

      <Instrument
        label="release"
        right={<Badge tone="ok">✓ signed · verified</Badge>}
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-3xs uppercase tracking-[0.2em] text-muted-foreground">
              commit
            </span>
            {probe?.commit ? (
              <a
                href={`https://github.com/fredrir/portfolio/commit/${probe.commit}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-primary hover:underline"
              >
                {probe.commit.slice(0, 12)}
              </a>
            ) : (
              <span className="font-mono text-xs text-muted-foreground">··</span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-3xs uppercase tracking-[0.2em] text-muted-foreground">
              live slot
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs">
              <StatusDot tone="ok" pulse />
              {slot}
            </span>
          </div>
        </div>
        <div className="mt-2 border-t border-border-faint pt-2">
          <span className="text-3xs uppercase tracking-[0.2em] text-muted-foreground">
            request id
          </span>
          <p className="break-all font-mono text-2xs text-readable">{probe?.requestId ?? "··"}</p>
        </div>
      </Instrument>

      <Hint>
        Images are built once, attested with an SBOM and provenance, signed with
        keyless Cosign, and signature-verified on the host before a slot starts.
        A failed health gate rolls back automatically.
      </Hint>
    </PaneShell>
  );
}
