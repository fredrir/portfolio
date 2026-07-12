"use client";

import type { UiStrings } from "@/i18n/types";
import { Badge, Instrument, PaneShell, Readout } from "@/panes/platform-ui";
import { Hop } from "./components/Hop";
import { useProbe } from "./hooks/useProbe";

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
      <Instrument label={t.liveRequestPath}>
        <div className="flex @sm:flex-row flex-col @sm:items-stretch gap-1.5">
          {hops.map((hop, i) => (
            <div
              key={hop.name}
              className="flex @sm:flex-1 @sm:flex-col items-center @sm:gap-1 gap-1.5"
            >
              <Hop {...hop} index={i} live={live} />
            </div>
          ))}
        </div>
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

      <Instrument label={t.release}>
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
            <span className="flex items-center gap-1.5 font-mono text-xs">{slot}</span>
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
