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

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setMedia(await adminListMedia());
      setApiDown(false);
    } catch {
      setApiDown(true);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const deleteMedia = useCallback(async (id: string): Promise<boolean> => {
    try {
      await adminDeleteMedia({ data: { id } });
      setMedia((items) => items.filter((item) => item.id !== id));
      return true;
    } catch {
      setNotice("That didn't go through. Try again.");
      return false;
    }
  }, []);

  const setCategory = useCallback(async (id: string, category: string | null): Promise<boolean> => {
    try {
      const updated = await adminSetCategory({ data: { id, category } });
      setMedia((items) =>
        items.map((item) =>
          item.id === id ? { ...item, category: updated.category ?? null } : item,
        ),
      );
      return true;
    } catch {
      setNotice("That didn't go through. Try again.");
      return false;
    }
  }, []);

  const renameCategory = useCallback(async (from: string, to: string): Promise<boolean> => {
    try {
      const updated = await adminRenameCategory({ data: { from, to } });
      setMedia((items) =>
        items.map((item) => (item.category === from ? { ...item, category: updated.to } : item)),
      );
      return true;
    } catch {
      setNotice("That didn't go through. Try again.");
      return false;
    }
  }, []);

  return {
    media,
    setMedia,
    apiDown,
    refreshing,
    notice,
    refresh,
    deleteMedia,
    setCategory,
    renameCategory,
  };
}
