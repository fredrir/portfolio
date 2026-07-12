import { useCallback, useEffect, useRef, useState } from "react";

import { adminCreateUpload, adminGetMediaStatus } from "@/server/admin";

export type JobStage = "authorizing" | "uploading" | "processing" | "failed";

export interface UploadJob {
  id: string;
  file: File;
  name: string;
  size: number;
  category: string;
  stage: JobStage;
  /** Upload progress from 0 to 1. */
  sent: number;
  detail?: string;
  mediaId?: string;
  previewUrl: string;
}

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
const POLL_INTERVAL_MS = 3000;

function putWithProgress(
  url: string,
  headers: Record<string, string>,
  file: File,
  signal: AbortSignal,
  onProgress: (fraction: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Upload cancelled", "AbortError"));
      return;
    }

    const request = new XMLHttpRequest();
    let animationFrame = 0;
    let latestProgress = 0;

    const flushProgress = () => {
      animationFrame = 0;
      onProgress(latestProgress);
    };
    const cleanup = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      signal.removeEventListener("abort", abort);
    };
    const abort = () => request.abort();

    request.open("PUT", url);
    for (const [key, value] of Object.entries(headers)) {
      if (key.toLowerCase() !== "host") request.setRequestHeader(key, value);
    }

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      latestProgress = event.loaded / event.total;
      if (!animationFrame) animationFrame = requestAnimationFrame(flushProgress);
    };
    request.onload = () => {
      cleanup();
      if (request.status >= 200 && request.status < 300) resolve();
      else reject(new Error(`Upload failed (${request.status})`));
    };
    request.onerror = () => {
      cleanup();
      reject(new Error("Network error during upload"));
    };
    request.onabort = () => {
      cleanup();
      reject(new DOMException("Upload cancelled", "AbortError"));
    };

    signal.addEventListener("abort", abort, { once: true });
    request.send(file);
  });
}

/** Runs browser uploads and asks the library to refresh when processing completes. */
export function useUploads(onMediaChange: () => void) {
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const jobsRef = useRef(jobs);
  const controllersRef = useRef(new Map<string, AbortController>());
  const onMediaChangeRef = useRef(onMediaChange);
  jobsRef.current = jobs;
  onMediaChangeRef.current = onMediaChange;

  const updateJobs = useCallback((update: (current: UploadJob[]) => UploadJob[]) => {
    const next = update(jobsRef.current);
    jobsRef.current = next;
    setJobs(next);
  }, []);

  const patchJob = useCallback(
    (id: string, patch: Partial<UploadJob>) => {
      updateJobs((current) => current.map((job) => (job.id === id ? { ...job, ...patch } : job)));
    },
    [updateJobs],
  );

  const runUpload = useCallback(
    async (id: string, file: File, category: string) => {
      if (!ACCEPTED_TYPES.has(file.type)) {
        patchJob(id, { stage: "failed", detail: "Only JPEG, PNG and WebP files are supported" });
        return;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        patchJob(id, { stage: "failed", detail: "File is larger than 100 MiB" });
        return;
      }

      const controller = new AbortController();
      controllersRef.current.set(id, controller);

      try {
        const grant = await adminCreateUpload({
          data: {
            filename: file.name,
            content_type: file.type,
            size_bytes: file.size,
            category: category || undefined,
          },
        });
        if (controller.signal.aborted) return;

        patchJob(id, { stage: "uploading", mediaId: grant.media_id });
        await putWithProgress(grant.upload_url, grant.headers, file, controller.signal, (sent) =>
          patchJob(id, { sent }),
        );
        patchJob(id, { stage: "processing", sent: 1 });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        patchJob(id, {
          stage: "failed",
          detail: error instanceof Error ? error.message : "Upload failed",
        });
      } finally {
        controllersRef.current.delete(id);
      }
    },
    [patchJob],
  );

  const upload = useCallback(
    (file: File, category: string) => {
      const job: UploadJob = {
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        category,
        stage: "authorizing",
        sent: 0,
        previewUrl: URL.createObjectURL(file),
      };
      updateJobs((current) => [job, ...current]);
      void runUpload(job.id, file, category);
    },
    [runUpload, updateJobs],
  );

  const retry = useCallback(
    (id: string) => {
      const job = jobsRef.current.find((candidate) => candidate.id === id);
      if (!job || job.stage !== "failed") return;
      patchJob(id, { stage: "authorizing", sent: 0, detail: undefined, mediaId: undefined });
      void runUpload(id, job.file, job.category);
    },
    [patchJob, runUpload],
  );

  const remove = useCallback(
    (id: string) => {
      controllersRef.current.get(id)?.abort();
      controllersRef.current.delete(id);
      updateJobs((current) => {
        const removed = current.find((job) => job.id === id);
        if (removed) URL.revokeObjectURL(removed.previewUrl);
        return current.filter((job) => job.id !== id);
      });
    },
    [updateJobs],
  );

  const hasProcessingJobs = jobs.some((job) => job.stage === "processing");

  useEffect(() => {
    if (!hasProcessingJobs) return;
    let polling = false;

    const poll = async () => {
      if (polling) return;
      polling = true;
      try {
        const ids = jobsRef.current.flatMap((job) =>
          job.stage === "processing" && job.mediaId ? [job.mediaId] : [],
        );
        const statuses = await adminGetMediaStatus({ data: { ids } });
        const stateById = new Map(statuses.map((item) => [item.id, item.state]));
        const completedIds = new Set<string>();

        updateJobs((current) =>
          current.flatMap((job) => {
            if (job.stage !== "processing" || !job.mediaId) return [job];
            const state = stateById.get(job.mediaId);
            if (state === "ready") {
              completedIds.add(job.id);
              URL.revokeObjectURL(job.previewUrl);
              return [];
            }
            if (state === "failed") {
              return [{ ...job, stage: "failed", detail: "Processing failed" }];
            }
            return [job];
          }),
        );

        if (completedIds.size > 0) onMediaChangeRef.current();
      } catch {
        // The API can be transiently unavailable; the next interval retries.
      } finally {
        polling = false;
      }
    };

    const interval = window.setInterval(() => void poll(), POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [hasProcessingJobs, updateJobs]);

  useEffect(
    () => () => {
      for (const controller of controllersRef.current.values()) controller.abort();
      for (const job of jobsRef.current) URL.revokeObjectURL(job.previewUrl);
    },
    [],
  );

  return { jobs, upload, retry, remove };
}
