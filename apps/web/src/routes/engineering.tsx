import type { components } from "@portfolio/api-client";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getEngineeringData } from "@/server/engineering";

type MediaItem = components["schemas"]["MediaItem"];
type MediaVariant = components["schemas"]["MediaVariant"];

export const Route = createFileRoute("/engineering")({
  loader: () => getEngineeringData(),
  head: () => ({
    meta: [
      { title: "Engineering Mode — hansteen.dev" },
      {
        name: "description",
        content:
          "Live view of the platform serving this site: edge, origin, deployments and the media pipeline.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: EngineeringPage,
});

interface EdgeProbe {
  requestId: string;
  colo: string;
  cache: string;
  slot: string;
  serverTiming: string;
  durationMs: number;
}

interface WorkflowRun {
  id: number;
  display_title: string;
  conclusion: string | null;
  status: string;
  run_started_at: string;
  updated_at: string;
  html_url: string;
  head_sha: string;
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

function useDeployments() {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  useEffect(() => {
    fetch(
      "https://api.github.com/repos/fredrir/portfolio/actions/workflows/deploy.yml/runs?branch=main&per_page=8",
    )
      .then((r) => r.json())
      .then((d) => setRuns(d.workflow_runs ?? []))
      .catch(() => {});
  }, []);
  return runs;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1 border-b border-border/40 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-right break-all">{value}</span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border rounded-lg p-4 bg-card/50">
      <h2 className="text-primary font-bold text-xs uppercase tracking-wider mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function durationOf(run: WorkflowRun): string {
  const ms =
    new Date(run.updated_at).getTime() - new Date(run.run_started_at).getTime();
  return `${Math.round(ms / 1000)}s`;
}

function EngineeringPage() {
  const { version, media } = Route.useLoaderData();
  const probe = useEdgeProbe();
  const runs = useDeployments();

  return (
    <div className="min-h-screen overflow-y-auto bg-background text-foreground p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Engineering Mode</h1>
          <p className="text-muted-foreground text-sm mt-1">
            The production platform serving this page, inspected live. Requests
            flow browser → Cloudflare Worker → Access → Tunnel → Caddy →
            blue/green app slots on a private origin with no public ports.{" "}
            <a href="/" className="text-primary underline">
              back to the site
            </a>
          </p>
        </header>

        <Section title="This request, at the edge and origin">
          {probe ? (
            <>
              <Row label="request id" value={probe.requestId} />
              <Row label="cloudflare colo" value={probe.colo} />
              <Row label="edge cache" value={probe.cache} />
              <Row label="active slot" value={probe.slot} />
              <Row label="server-timing" value={probe.serverTiming} />
              <Row label="round trip (browser)" value={`${probe.durationMs} ms`} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">probing…</p>
          )}
          <Row
            label="release"
            value={
              version ? (
                <a
                  className="text-primary underline"
                  href={`https://github.com/fredrir/portfolio/commit/${version.commit}`}
                >
                  {version.commit.slice(0, 12)} (v{version.version})
                </a>
              ) : (
                "n/a"
              )
            }
          />
        </Section>

        <Section title="Deployments (blue-green, signed images)">
          {runs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              loading from the GitHub API…
            </p>
          ) : (
            <div className="space-y-1">
              {runs.map((run) => (
                <div
                  key={run.id}
                  className="flex justify-between gap-3 py-1 border-b border-border/40 text-sm"
                >
                  <a
                    href={run.html_url}
                    className="text-primary underline font-mono"
                  >
                    {run.head_sha.slice(0, 8)}
                  </a>
                  <span className="truncate flex-1 text-muted-foreground">
                    {run.display_title}
                  </span>
                  <span className="font-mono">{durationOf(run)}</span>
                  <span
                    className={
                      run.conclusion === "success"
                        ? "text-primary"
                        : "text-destructive"
                    }
                  >
                    {run.conclusion ?? run.status}
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Every release is built once, attested (SBOM + provenance), signed
            with keyless Cosign, verified on the host, health-gated and
            auto-rolled-back on failure.
          </p>
        </Section>

        <Section title="Media lab (S3 → SQS → Rust worker)">
          {media.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              no processed media yet — uploads flow through presigned S3 PUTs,
              an SQS queue and a Rust worker producing AVIF/WebP variants under
              content-hashed keys.
            </p>
          ) : (
            <div className="space-y-4">
              {media.map((item: MediaItem) => (
                <div key={item.id} className="text-sm">
                  <div className="font-mono mb-1">
                    {item.filename} · {item.width}×{item.height} · hash{" "}
                    {item.content_hash?.slice(0, 12)}
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    {item.variants.map((v: MediaVariant) => (
                      <figure key={v.key} className="max-w-[45%]">
                        {v.url ? (
                          <img
                            src={v.url}
                            alt={`${item.filename} (${v.format})`}
                            className="rounded border border-border max-h-48 w-auto"
                            loading="lazy"
                          />
                        ) : null}
                        <figcaption className="text-xs text-muted-foreground mt-1">
                          {v.format} · {(v.size_bytes / 1024).toFixed(1)} KiB ·
                          immutable, edge-cached
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
