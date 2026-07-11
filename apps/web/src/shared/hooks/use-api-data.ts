"use client";

import { useEffect, useState } from "react";

/**
 * Same-origin fetch of a public API endpoint. The API is served under /api
 * on the same hostname (Caddy routes it to the active api slot; the vite dev
 * server proxies it to localhost:8080).
 */
export function useApiData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(path, { headers: { accept: "application/json" } })
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 204) {
          setData(null);
        } else if (res.ok) {
          setData((await res.json()) as T);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return { data, loading, error };
}
