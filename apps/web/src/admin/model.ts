import type { components } from "@portfolio/api-client";

export type MediaItem = components["schemas"]["MediaItem"];
export type AdminMediaLibrary = components["schemas"]["AdminMediaLibrary"];

export type StateFilter = "all" | "ready" | "processing" | "failed";
export type MediaState = Exclude<StateFilter, "all">;

export const UNCATEGORIZED = "uncategorized";

export function emptyMediaLibrary(): AdminMediaLibrary {
  return {
    items: [],
    summary: {
      total: 0,
      stored_bytes: 0,
      state_counts: { ready: 0, processing: 0, failed: 0 },
      categories: [],
    },
  };
}

export function bucketOf(item: MediaItem): MediaState {
  if (item.state === "ready") return "ready";
  if (item.state === "failed") return "failed";
  return "processing";
}

export function stateLabel(state: MediaState): string {
  return state === "ready" ? "live" : state === "processing" ? "developing" : "failed";
}

export function thumbOf(item: MediaItem): string | undefined {
  return (
    item.variants.find((v) => v.format === "webp")?.url ??
    item.variants.find((v) => v.url)?.url ??
    undefined
  );
}
