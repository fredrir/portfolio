import { createServerFn } from "@tanstack/react-start";

import { api, traceHeaders } from "@/server/api";
import type { SpotifyData } from "@/shared/types";

// Thin pass-through: OAuth and caching live in the API.
export const getSpotifyData = createServerFn({ method: "POST" }).handler(
  async (): Promise<SpotifyData> => {
    try {
      const { data, error } = await api.GET("/api/v1/spotify", {
        headers: traceHeaders(),
      });
      if (error || !data) {
        return { ok: false, error: "spotify_unavailable" };
      }
      return data as SpotifyData;
    } catch (error) {
      console.error("Failed to reach the Spotify API:", error);
      return { ok: false, error: "spotify_unavailable" };
    }
  },
);
