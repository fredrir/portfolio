"use client";

/**
 * The audit log rendered as what it is: a hash chain. Each entry is a node on
 * a vertical rail; verifying sweeps the chain and settles every node green,
 * or points at the first broken link.
 */
import type { components } from "@portfolio/api-client";
import { ShieldCheck, ShieldWarning } from "@phosphor-icons/react";
import { useState } from "react";

import { HashChip, Instrument, relativeTime, StatusDot } from "@/panes/platform-ui";
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

export function Ledger({ audit }: { audit: AdminAuditEntry[] }) {
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
      label="ledger"
      right={
        <button
          type="button"
          onClick={runVerify}
          disabled={verifying}
          className="flex items-center gap-1 rounded border border-border-faint px-1.5 py-0.5 text-2xs text-muted-foreground transition-colors hover:bg-control-hover hover:text-foreground disabled:opacity-50"
        >
          <ShieldCheck size={12} />
          {verifying ? "verifying…" : "verify chain"}
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
            ? `chain intact — ${verify.entries} entries verified`
            : `chain broken at entry #${verify.first_invalid_id}`}
        </p>
      )}
      {failedVerify && (
        <p className="mb-2 rounded border border-accent-yellow/30 bg-surface-soft px-2 py-1 text-2xs text-accent-yellow">
          verification did not run — try again
        </p>
      )}

      {audit.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">
          no entries yet — the first authorization starts the chain
        </p>
      ) : (
        <ol>
          {visible.map((entry, i) => {
            const broken =
              verify != null &&
              !verify.valid &&
              entry.id === verify.first_invalid_id;
            const tone = broken
              ? "fail"
              : verify?.valid
                ? "ok"
                : ("idle" as const);
            const expanded = expandedId === entry.id;
            return (
              <li key={entry.id} className="relative pl-4">
                {i < visible.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[3.5px] top-4 h-full w-px bg-border-faint"
                  />
                )}
                <span className="absolute left-0 top-1.5">
                  <StatusDot tone={tone} />
                </span>
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : entry.id)}
                  aria-expanded={expanded}
                  className="w-full rounded px-1 py-0.5 text-left transition-colors hover:bg-control-hover focus-visible:ring-2 focus-visible:ring-ring outline-none"
                >
                  <span className="flex items-baseline justify-between gap-2 text-xs">
                    <span
                      className={cn(
                        "truncate font-mono",
                        broken && "text-destructive",
                      )}
                    >
                      {entry.action}
                    </span>
                    <span
                      className="shrink-0 text-2xs text-faded"
                      title={entry.at}
                    >
                      {relativeTime(entry.at) || entry.at.slice(0, 19)}
                    </span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5">
                    <span className="font-mono text-3xs text-faded">
                      #{entry.id}
                    </span>
                    <HashChip hash={entry.entry_hash} />
                  </span>
                </button>
                {expanded && (
                  <pre className="mb-1 ml-1 overflow-x-auto rounded bg-surface-dim p-1.5 font-mono text-2xs leading-relaxed text-muted-foreground">
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
          {showAll ? "collapse" : `show all ${audit.length} entries`}
        </button>
      )}
    </Instrument>
  );
}
