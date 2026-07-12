import { useCallback, useEffect, useState } from "react";

import type { MediaItem } from "@/admin/model";
import {
  adminDeleteMedia,
  adminListMedia,
  adminRenameCategory,
  adminSetCategory,
} from "@/server/admin";

export function useMediaLibrary(initialMedia: MediaItem[], initialApiDown: boolean) {
  const [media, setMedia] = useState(initialMedia);
  const [apiDown, setApiDown] = useState(initialApiDown);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const applySnapshot = useCallback((items: MediaItem[]) => {
    setMedia(items);
    setApiDown(false);
  }, []);

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
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      applySnapshot(await adminListMedia());
    } catch {
      setApiDown(true);
    } finally {
      setRefreshing(false);
    }
  }, [applySnapshot]);

  const deleteMedia = useCallback(
    async (id: string): Promise<boolean> => {
      const deleted = await runAction(() => adminDeleteMedia({ data: { id } }));
      if (!deleted) return false;
      setMedia((items) => items.filter((item) => item.id !== id));
      return true;
    },
    [runAction],
  );

  const setCategory = useCallback(
    async (id: string, category: string | null): Promise<boolean> => {
      const updated = await runAction(() => adminSetCategory({ data: { id, category } }));
      if (!updated) return false;
      setMedia((items) =>
        items.map((item) =>
          item.id === id ? { ...item, category: updated.category ?? null } : item,
        ),
      );
      return true;
    },
    [runAction],
  );

  const renameCategory = useCallback(
    async (from: string, to: string): Promise<boolean> => {
      const updated = await runAction(() => adminRenameCategory({ data: { from, to } }));
      if (!updated) return false;
      setMedia((items) =>
        items.map((item) => (item.category === from ? { ...item, category: updated.to } : item)),
      );
      return true;
    },
    [runAction],
  );

  return {
    media,
    applySnapshot,
    apiDown,
    refreshing,
    notice,
    refresh,
    deleteMedia,
    setCategory,
    renameCategory,
  };
}
