"use client";

import { ShieldCheck, ShieldWarning } from "@phosphor-icons/react";
/**
 * The audit log rendered as what it is: a hash chain. Each entry is a node on
 * a vertical rail; verifying sweeps the chain and settles every node green,
 * or points at the first broken link.
 */
import type { components } from "@portfolio/api-client";
import { useState } from "react";

import type { AdminStrings } from "@/i18n/types";
import { HashChip, Instrument, relativeTimeWithLabels, StatusDot } from "@/panes/platform-ui";
import type { AdminAuditEntry } from "@/server/admin";
import { adminAuditVerify } from "@/server/admin";
import { cn } from "@/shared/utils/cn";

type AuditVerification = components["schemas"]["AuditVerification"];

const PREVIEW_COUNT = 12;

function prettyDetail(detail: string): string {
  try {
    return JSON.stringify(JSON.parse(detail), null, 1);
  } catch {
    return detail;
  }
}

export function Ledger({ audit, t }: { audit: AdminAuditEntry[]; t: AdminStrings }) {
  const [verify, setVerify] = useState<AuditVerification | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [failedVerify, setFailedVerify] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const runVerify = () => {
    setVerifying(true);
    setFailedVerify(false);
    adminAuditVerify()
      .then(setVerify)
      .catch(() => setFailedVerify(true))
      .finally(() => setVerifying(false));
  };

  const visible = showAll ? audit : audit.slice(0, PREVIEW_COUNT);

  return (
    <Instrument
      label={t.ledger.label}
      right={
        <button
          type="button"
          onClick={runVerify}
          disabled={verifying}
          className="flex items-center gap-1 rounded border border-border-faint px-1.5 py-0.5 text-2xs text-muted-foreground transition-colors hover:bg-control-hover hover:text-foreground disabled:opacity-50"
        >
          <ShieldCheck size={12} />
          {verifying ? t.ledger.verifying : t.ledger.verifyChain}
        </button>
      }
    >
      {verify && (
        <p
          className={cn(
            "mb-2 flex items-center gap-1.5 rounded border px-2 py-1 text-2xs",
            verify.valid
              ? "border-primary-hint bg-surface-soft text-primary"
              : "border-destructive/40 bg-surface-soft text-destructive",
          )}
        >
          {verify.valid ? <ShieldCheck size={13} /> : <ShieldWarning size={13} />}
          {verify.valid
            ? t.ledger.chainIntact.replace("{entries}", String(verify.entries))
            : t.ledger.chainBroken.replace("{id}", String(verify.first_invalid_id))}
        </p>
      )}
      {failedVerify && (
        <p className="mb-2 rounded border border-accent-yellow/30 bg-surface-soft px-2 py-1 text-2xs text-accent-yellow">
          {t.ledger.verificationFailed}
        </p>
      )}

      {audit.length === 0 ? (
        <p className="py-4 text-center text-muted-foreground text-xs">{t.ledger.empty}</p>
      ) : (
        <ol>
          {visible.map((entry, i) => {
            const broken = verify != null && !verify.valid && entry.id === verify.first_invalid_id;
            const tone = broken ? "fail" : verify?.valid ? "ok" : ("idle" as const);
            const expanded = expandedId === entry.id;
            return (
              <li key={entry.id} className="relative pl-4">
                {i < visible.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-4 left-[3.5px] h-full w-px bg-border-faint"
                  />
                )}
                <span className="absolute top-1.5 left-0">
                  <StatusDot tone={tone} />
                </span>
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : entry.id)}
                  aria-expanded={expanded}
                  className="w-full rounded px-1 py-0.5 text-left outline-none transition-colors hover:bg-control-hover focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex items-baseline justify-between gap-2 text-xs">
                    <span className={cn("truncate font-mono", broken && "text-destructive")}>
                      {entry.action}
                    </span>
                    <span className="shrink-0 text-2xs text-faded" title={entry.at}>
                      {relativeTimeWithLabels(entry.at, t.time) || entry.at.slice(0, 19)}
                    </span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5">
                    <span className="font-mono text-3xs text-faded">#{entry.id}</span>
                    <HashChip hash={entry.entry_hash} />
                  </span>
                </button>
                {expanded && (
                  <pre className="mb-1 ml-1 overflow-x-auto rounded bg-surface-dim p-1.5 font-mono text-2xs text-muted-foreground leading-relaxed">
                    {prettyDetail(entry.detail)}
                  </pre>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {audit.length > PREVIEW_COUNT && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-1.5 w-full rounded border border-border-faint py-1 text-2xs text-muted-foreground transition-colors hover:bg-control-hover hover:text-foreground"
        >
          {showAll ? t.ledger.collapse : t.ledger.showAll.replace("{count}", String(audit.length))}
        </button>
      )}
    </Instrument>
  );
}
