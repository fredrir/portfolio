"use client";

import { useEffect, useState } from "react";

import type { UiStrings } from "@/i18n/types";
import { Badge, Instrument, PaneShell, Readout, StatusDot, useMounted } from "@/panes/platform-ui";
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
        "min-w-[4.5rem] flex-1 rounded border px-2 py-1.5 transition-all duration-300",
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
        <span className="truncate font-semibold text-2xs text-foreground">{name}</span>
      </div>
      <span className="mt-0.5 block truncate font-mono text-3xs text-muted-foreground">
        {detail}
      </span>
    </div>
  );
}

export function EngineeringPane({ ui }: { ui: UiStrings }) {
  const t = ui.platform.engineering;
  const probe = useProbe();
  const live = probe != null;
  const slot = probe?.slot ?? "—";

  const hops = [
    { name: t.browser, detail: t.yourDevice, glow: false },
    { name: t.cfWorker, detail: probe ? `${t.colo} ${probe.colo}` : t.routing, glow: false },
    { name: t.access, detail: t.serviceToken, glow: false },
    { name: t.tunnel, detail: t.cloudflared, glow: false },
    { name: t.caddy, detail: t.reverseProxy, glow: false },
    {
      name: slot !== "—" ? `${slot} ${t.slotSuffix}` : t.originSlot,
      detail: t.privateOrigin,
      glow: true,
    },
  ];

  return (
    <PaneShell>
      <Instrument
        label={t.liveRequestPath}
        right={
          <span className="flex items-center gap-1 text-muted-foreground">
            <StatusDot tone={live ? "ok" : "idle"} pulse={live} />
            {live ? t.traced : t.tracing}
          </span>
        }
      >
        <div className="flex @sm:flex-row flex-col @sm:items-stretch gap-1.5">
          {hops.map((hop, i) => (
            <div
              key={hop.name}
              className="flex @sm:flex-1 @sm:flex-col items-center @sm:gap-1 gap-1.5"
            >
              <Hop {...hop} index={i} live={live} />
              {i < hops.length - 1 && (
                <span className="@sm:hidden shrink-0 text-primary-dim">↓</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-2 text-3xs text-muted-foreground">
          {t.privatePathNote}
        </p>
      </Instrument>

      <div className="grid grid-cols-3 gap-2">
        <Instrument label={t.roundTrip}>
          <Readout
            value={probe ? `${probe.roundTripMs}` : "··"}
            label={t.roundTripLabel}
            tone="primary"
          />
        </Instrument>
        <Instrument label={t.edgeTime}>
          <Readout
            value={probe?.edgeMs != null ? `${probe.edgeMs}` : "··"}
            label={t.edgeTimeLabel}
          />
        </Instrument>
        <Instrument label={t.cache}>
          <div className="pt-0.5">
            <Badge tone={probe?.cache === "HIT" ? "ok" : "idle"}>{probe?.cache ?? "··"}</Badge>
          </div>
        </Instrument>
      </div>

      <Instrument label={t.release} right={<Badge tone="ok">✓ {t.signedVerified}</Badge>}>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-3xs text-muted-foreground uppercase tracking-[0.2em]">
              {t.commit}
            </span>
            {probe?.commit ? (
              <a
                href={`https://github.com/fredrir/portfolio/commit/${probe.commit}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-primary text-xs hover:underline"
              >
                {probe.commit.slice(0, 12)}
              </a>
            ) : (
              <span className="font-mono text-muted-foreground text-xs">··</span>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-3xs text-muted-foreground uppercase tracking-[0.2em]">
              {t.liveSlot}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs">
              <StatusDot tone="ok" pulse />
              {slot}
            </span>
          </div>
        </div>
        <div className="mt-2 border-border-faint border-t pt-2">
          <span className="text-3xs text-muted-foreground uppercase tracking-[0.2em]">
            {t.requestId}
          </span>
          <p className="break-all font-mono text-2xs text-readable">{probe?.requestId ?? "··"}</p>
        </div>
      </Instrument>
    </PaneShell>
  );
}
