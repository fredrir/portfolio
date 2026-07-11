import type { components } from "@portfolio/api-client";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { useCallback, useEffect, useRef, useState } from "react";

import { KVRow, PaneSection, PaneStatus } from "@/panes/shared";
import {
  type AdminAuditEntry,
  adminAuditLog,
  adminAuditVerify,
  adminCreateUpload,
  adminListMedia,
} from "@/server/admin";

type MediaItem = components["schemas"]["MediaItem"];
type AuditVerification = components["schemas"]["AuditVerification"];

// Reachable only via admin.hansteen.dev: Access gates the hostname, Caddy
// stamps x-admin-origin, and everything else 404s (defense in depth — the
// edge Worker additionally refuses /admin on the public hostnames).
const assertAdminHost = createServerFn().handler(async () => {
  if (getRequestHeader("x-admin-origin") !== "1") {
    throw notFound();
  }
  return true;
});

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    await assertAdminHost();
  },
  head: () => ({
    meta: [
      { title: "Administration — hansteen.dev" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

interface UploadJob {
  name: string;
  state: "authorizing" | "uploading" | "processing" | "ready" | "failed";
  detail?: string;
  mediaId?: string;
}

function useUploads(categories: string[]) {
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const patch = useCallback((name: string, delta: Partial<UploadJob>) => {
    setJobs((all) =>
      all.map((j) => (j.name === name ? { ...j, ...delta } : j)),
    );
  }, []);

  const upload = useCallback(
    async (file: File, category: string) => {
      setJobs((all) => [
        ...all.filter((j) => j.name !== file.name),
        { name: file.name, state: "authorizing" },
      ]);
      try {
        const grant = await adminCreateUpload({
          data: {
            filename: file.name,
            content_type: file.type,
            size_bytes: file.size,
            category: category || undefined,
          },
        });
        patch(file.name, { state: "uploading", mediaId: grant.media_id });
        const headers: Record<string, string> = {};
        for (const [k, v] of Object.entries(grant.headers)) {
          if (k.toLowerCase() !== "host") headers[k] = v;
        }
        const put = await fetch(grant.upload_url, {
          method: "PUT",
          headers,
          body: file,
        });
        if (!put.ok) throw new Error(`S3 PUT ${put.status}`);
        patch(file.name, { state: "processing" });
      } catch (err) {
        patch(file.name, {
          state: "failed",
          detail: err instanceof Error ? err.message : "upload failed",
        });
      }
    },
    [patch],
  );

  // Poll processing jobs until the worker settles them.
  useEffect(() => {
    if (!jobs.some((j) => j.state === "processing")) return;
    pollTimer.current = setInterval(async () => {
      try {
        const media = await adminListMedia();
        setJobs((all) =>
          all.map((job) => {
            if (job.state !== "processing" || !job.mediaId) return job;
            const item = media.find((m: MediaItem) => m.id === job.mediaId);
            if (!item) return job;
            if (item.state === "ready") return { ...job, state: "ready" };
            if (item.state === "failed")
              return { ...job, state: "failed", detail: "processing failed" };
            return job;
          }),
        );
      } catch {
        // transient; keep polling
      }
    }, 3000);
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [jobs]);

  void categories;
  return { jobs, upload };
}

function AdminPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [audit, setAudit] = useState<AdminAuditEntry[]>([]);
  const [verify, setVerify] = useState<AuditVerification | null>(null);
  const [category, setCategory] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const categories = Array.from(
    new Set(media.map((m) => m.category).filter((c): c is string => !!c)),
  );
  const { jobs, upload } = useUploads(categories);

  const refresh = useCallback(() => {
    adminListMedia().then(setMedia).catch(() => {});
    adminAuditLog().then(setAudit).catch(() => {});
  }, []);
  useEffect(refresh, [refresh]);
  useEffect(() => {
    if (jobs.some((j) => j.state === "ready")) refresh();
  }, [jobs, refresh]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      void upload(file, category);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-background text-foreground font-mono p-4 @container">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-lg font-bold mb-1">Administration</h1>
        <p className="text-xs text-muted-foreground mb-4">
          Access-gated origin. Uploads go browser → presigned S3 PUT → SQS →
          worker; every authorization lands in the hash-chained audit log.
        </p>

        <PaneSection title="upload images">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInput.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInput.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-lg p-6 text-center text-xs cursor-pointer transition-colors ${
              dragOver
                ? "border-primary bg-control-active"
                : "border-border text-muted-foreground hover:border-control-border-hover"
            }`}
          >
            drop images here or click to pick (jpeg/png/webp, ≤ 25 MiB)
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <label htmlFor="category" className="text-xs text-muted-foreground">
              category
            </label>
            <input
              id="category"
              list="known-categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. oslo"
              className="flex-1 bg-transparent border border-border rounded px-2 py-1 text-xs"
            />
            <datalist id="known-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          {jobs.length > 0 && (
            <div className="mt-2">
              {jobs.map((job) => (
                <KVRow
                  key={job.name}
                  label={job.name}
                  value={
                    job.state === "failed"
                      ? `failed — ${job.detail ?? ""}`
                      : job.state
                  }
                />
              ))}
            </div>
          )}
        </PaneSection>

        <PaneSection title={`media (${media.length})`}>
          {media.length === 0 ? (
            <PaneStatus text="nothing uploaded yet" />
          ) : (
            media
              .slice(0, 30)
              .map((m) => (
                <KVRow
                  key={m.id}
                  label={`${m.filename}${m.category ? ` · ${m.category}` : ""}`}
                  value={m.state}
                />
              ))
          )}
        </PaneSection>

        <PaneSection title="audit log (hash-chained)">
          <button
            type="button"
            onClick={() => adminAuditVerify().then(setVerify).catch(() => {})}
            className="text-xs border border-border rounded px-2 py-1 mb-2 hover:bg-control-hover"
          >
            verify chain
          </button>
          {verify && (
            <p
              className={`text-xs mb-2 ${verify.valid ? "text-primary" : "text-destructive"}`}
            >
              {verify.valid
                ? `chain valid — ${verify.entries} entries`
                : `CHAIN BROKEN at entry ${verify.first_invalid_id}`}
            </p>
          )}
          {audit.slice(0, 20).map((entry) => (
            <KVRow
              key={entry.id}
              label={`#${entry.id} ${entry.action}`}
              value={`${entry.at.slice(0, 19)} · ${entry.entry_hash.slice(0, 10)}…`}
            />
          ))}
        </PaneSection>
      </div>
    </div>
  );
}
