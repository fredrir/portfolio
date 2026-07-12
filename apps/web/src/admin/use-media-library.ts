import { useCallback, useEffect, useRef, useState } from "react";

import type { AdminMediaLibrary } from "@/admin/model";
import {
  adminDeleteMedia,
  adminListMedia,
  type AdminMediaQuery,
  adminRenameCategory,
  adminSetCategory,
} from "@/server/admin";

const FILTER_DELAY_MS = 200;

export function useMediaLibrary(
  initialLibrary: AdminMediaLibrary,
  initialApiDown: boolean,
  filters: AdminMediaQuery,
) {
  const [library, setLibrary] = useState(initialLibrary);
  const [apiDown, setApiDown] = useState(initialApiDown);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const filtersRef = useRef(filters);
  const requestIdRef = useRef(0);
  const mountedRef = useRef(false);
  filtersRef.current = filters;

  const load = useCallback(async (nextFilters: AdminMediaQuery, showRefreshing: boolean) => {
    const requestId = ++requestIdRef.current;
    if (showRefreshing) setRefreshing(true);
    try {
      const next = await adminListMedia({ data: nextFilters });
      if (requestId !== requestIdRef.current) return;
      setLibrary(next);
      setApiDown(false);
    } catch {
      if (requestId === requestIdRef.current) setApiDown(true);
    } finally {
      if (showRefreshing && requestId === requestIdRef.current) setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(
    () => load(filtersRef.current, true),
    [load],
  );

  const runAction = useCallback(async <Result>(action: () => Promise<Result>) => {
    try {
      const result = await action();
      setApiDown(false);
      return result;
    } catch {
      setNotice("That didn't go through. Try again.");
      return null;
    }
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const timeout = window.setTimeout(() => void load(filters, false), FILTER_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [filters, load]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const deleteMedia = useCallback(
    async (id: string): Promise<boolean> => {
      const deleted = await runAction(() => adminDeleteMedia({ data: { id } }));
      if (!deleted) return false;
      await load(filtersRef.current, false);
      return true;
    },
    [load, runAction],
  );

  const setCategory = useCallback(
    async (id: string, category: string | null): Promise<boolean> => {
      const updated = await runAction(() => adminSetCategory({ data: { id, category } }));
      if (!updated) return false;
      await load(filtersRef.current, false);
      return true;
    },
    [load, runAction],
  );

  const renameCategory = useCallback(
    async (from: string, to: string): Promise<boolean> => {
      const updated = await runAction(() => adminRenameCategory({ data: { from, to } }));
      if (!updated) return false;
      const currentFilters = filtersRef.current;
      const nextFilters =
        currentFilters.category === from
          ? { ...currentFilters, category: updated.to }
          : currentFilters;
      await load(nextFilters, false);
      return true;
    },
    [load, runAction],
  );

  return {
    media: library.items,
    summary: library.summary,
    apiDown,
    refreshing,
    notice,
    refresh,
    deleteMedia,
    setCategory,
    renameCategory,
  };
}
