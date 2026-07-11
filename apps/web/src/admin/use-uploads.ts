import type { components } from "@portfolio/api-client";
import { useCallback, useEffect, useRef, useState } from "react";

import type { AdminStrings } from "@/i18n/types";
import { adminCreateUpload, adminListMedia } from "@/server/admin";

type MediaItem = components["schemas"]["MediaItem"];

export type JobStage = "authorizing" | "uploading" | "processing" | "ready" | "failed";

/** Pipeline station the stage maps to: authorize → s3 put → worker → live. */
export const STATION_OF: Record<JobStage, number> = {
  authorizing: 0,
  uploading: 1,
  processing: 2,
  ready: 3,
  failed: 0,
};

export interface UploadJob {
  id: string;
  name: string;
  size: number;
  stage: JobStage;
  /** 0..1 while the S3 PUT is in flight. */
  sent: number;
  /** Station index the job died at, when stage is "failed". */
  failedAt?: number;
  detail?: string;
  mediaId?: string;
  previewUrl?: string;
}

// Mirrors ALLOWED_CONTENT_TYPES / MAX_UPLOAD_BYTES in the API.
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 25 * 1024 * 1024;

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
 * `onLanded` fires once per job that reaches "ready".
 */
export function useUploads(
  onLanded: () => void,
  errors: AdminStrings["uploadErrors"],
) {
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const landedRef = useRef(new Set<string>());
  const onLandedRef = useRef(onLanded);
  onLandedRef.current = onLanded;

  const patch = useCallback((id: string, delta: Partial<UploadJob>) => {
    setJobs((all) => all.map((j) => (j.id === id ? { ...j, ...delta } : j)));
  }, []);

  const upload = useCallback(
    async (file: File, category: string) => {
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setJobs((all) => [
        ...all,
        {
          id,
          name: file.name,
          size: file.size,
          stage: "authorizing",
          sent: 0,
          previewUrl: URL.createObjectURL(file),
        },
      ]);
      if (!ACCEPTED_TYPES.includes(file.type)) {
        patch(id, {
          stage: "failed",
          failedAt: 0,
          detail: errors.invalidType,
        });
        return;
      }
      if (file.size > MAX_BYTES) {
        patch(id, { stage: "failed", failedAt: 0, detail: errors.tooLarge });
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
            failedAt: 1,
            detail: err instanceof Error ? err.message : errors.uploadFailed,
          });
          return;
        }
        patch(id, { stage: "processing", sent: 1 });
      } catch (err) {
        patch(id, {
          stage: "failed",
          failedAt: 0,
          detail: err instanceof Error ? err.message : errors.authorizationFailed,
        });
      }
    },
    [patch, errors],
  );

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
            if (item.state === "ready") return { ...job, stage: "ready" };
            if (item.state === "failed")
              return {
                ...job,
                stage: "failed",
                failedAt: 2,
                detail: errors.processingFailed,
              };
            return job;
          }),
        );
      } catch {
        // transient; keep polling
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [jobs, errors.processingFailed]);

  // Notify (once per job) when an upload lands, so the library can refresh.
  useEffect(() => {
    for (const job of jobs) {
      if (job.stage === "ready" && !landedRef.current.has(job.id)) {
        landedRef.current.add(job.id);
        onLandedRef.current();
      }
    }
  }, [jobs]);

  const clearSettled = useCallback(() => {
    setJobs((all) => {
      for (const job of all) {
        if ((job.stage === "ready" || job.stage === "failed") && job.previewUrl) {
          URL.revokeObjectURL(job.previewUrl);
        }
      }
      return all.filter((j) => j.stage !== "ready" && j.stage !== "failed");
    });
  }, []);

  return { jobs, upload, clearSettled };
}
