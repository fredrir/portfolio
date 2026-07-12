import type { components } from "@portfolio/api-client";
import { useCallback, useEffect, useRef, useState } from "react";

import type { AdminStrings } from "@/i18n/types";
import { adminCreateUpload, adminListMedia } from "@/server/admin";

type MediaItem = components["schemas"]["MediaItem"];

export type JobStage = "authorizing" | "uploading" | "processing" | "ready" | "failed";

export interface UploadJob {
  id: string;
  file: File;
  name: string;
  size: number;
  category: string;
  stage: JobStage;
  /** 0..1 while the S3 PUT is in flight. */
  sent: number;
  detail?: string;
  mediaId?: string;
  previewUrl: string;
}

// Mirrors ALLOWED_CONTENT_TYPES / MAX_UPLOAD_BYTES in the API.
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 100 * 1024 * 1024;

function putWithProgress(
  url: string,
  headers: Record<string, string>,
  file: File,
  onProgress: (fraction: number) => void,
  errors: AdminStrings["uploadErrors"],
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    for (const [k, v] of Object.entries(headers)) {
      if (k.toLowerCase() !== "host") xhr.setRequestHeader(k, v);
    }
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`S3 PUT ${xhr.status}`));
    xhr.onerror = () => reject(new Error(errors.networkDuringS3));
    xhr.send(file);
  });
}

/**
 * Drives uploads through the real pipeline: authorize (audited) → presigned
 * S3 PUT with byte progress → poll until the worker settles the item.
 * `onLanded` fires once per job that reaches "ready"; the caller refreshes
 * the library and then removes the job so the real tile takes over.
 */
export function useUploads(
  onLanded: (jobId: string) => void,
  errors: AdminStrings["uploadErrors"],
) {
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const landedRef = useRef(new Set<string>());
  const onLandedRef = useRef(onLanded);
  onLandedRef.current = onLanded;

  const patch = useCallback((id: string, delta: Partial<UploadJob>) => {
    setJobs((all) => all.map((j) => (j.id === id ? { ...j, ...delta } : j)));
  }, []);

  const run = useCallback(
    async (id: string, file: File, category: string) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        patch(id, { stage: "failed", detail: errors.invalidType });
        return;
      }
      if (file.size > MAX_BYTES) {
        patch(id, { stage: "failed", detail: errors.tooLarge });
        return;
      }
      try {
        const grant = await adminCreateUpload({
          data: {
            filename: file.name,
            content_type: file.type,
            size_bytes: file.size,
            category: category || undefined,
          },
        });
        patch(id, { stage: "uploading", mediaId: grant.media_id });
        try {
          await putWithProgress(
            grant.upload_url,
            grant.headers,
            file,
            (sent) => patch(id, { sent }),
            errors,
          );
        } catch (err) {
          patch(id, {
            stage: "failed",
            detail: err instanceof Error ? err.message : errors.uploadFailed,
          });
          return;
        }
        patch(id, { stage: "processing", sent: 1 });
      } catch (err) {
        patch(id, {
          stage: "failed",
          detail: err instanceof Error ? err.message : errors.authorizationFailed,
        });
      }
    },
    [patch, errors],
  );

  const upload = useCallback(
    (file: File, category: string) => {
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setJobs((all) => [
        {
          id,
          file,
          name: file.name,
          size: file.size,
          category,
          stage: "authorizing",
          sent: 0,
          previewUrl: URL.createObjectURL(file),
        },
        ...all,
      ]);
      void run(id, file, category);
    },
    [run],
  );

  const retry = useCallback(
    (id: string) => {
      const job = jobs.find((j) => j.id === id);
      if (!job || job.stage !== "failed") return;
      patch(id, { stage: "authorizing", sent: 0, detail: undefined, mediaId: undefined });
      void run(id, job.file, job.category);
    },
    [jobs, patch, run],
  );

  const remove = useCallback((id: string) => {
    setJobs((all) => {
      const job = all.find((j) => j.id === id);
      if (job) URL.revokeObjectURL(job.previewUrl);
      return all.filter((j) => j.id !== id);
    });
  }, []);

  // Poll processing jobs until the worker settles them.
  useEffect(() => {
    if (!jobs.some((j) => j.stage === "processing")) return;
    const timer = setInterval(async () => {
      try {
        const media = await adminListMedia();
        setJobs((all) =>
          all.map((job) => {
            if (job.stage !== "processing" || !job.mediaId) return job;
            const item = media.find((m: MediaItem) => m.id === job.mediaId);
            if (!item) return job;
            if (item.state === "ready") return { ...job, stage: "ready" as const };
            if (item.state === "failed")
              return { ...job, stage: "failed" as const, detail: errors.processingFailed };
            return job;
          }),
        );
      } catch {
        // transient; keep polling
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [jobs, errors.processingFailed]);

  // Notify (once per job) when an upload lands, so the library can refresh
  // and retire the ghost tile.
  useEffect(() => {
    for (const job of jobs) {
      if (job.stage === "ready" && !landedRef.current.has(job.id)) {
        landedRef.current.add(job.id);
        onLandedRef.current(job.id);
      }
    }
  }, [jobs]);

  return { jobs, upload, retry, remove };
}
