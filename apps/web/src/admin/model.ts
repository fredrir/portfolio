import type { components } from "@portfolio/api-client";

export type MediaItem = components["schemas"]["MediaItem"];

export type StateFilter = "all" | "ready" | "processing" | "failed";
export type MediaState = Exclude<StateFilter, "all">;

export const UNCATEGORIZED = "uncategorized";

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

export function summarizeMedia(media: MediaItem[]) {
  const categoryCounts = new Map<string, number>();
  const stateCounts: Record<MediaState, number> = { ready: 0, processing: 0, failed: 0 };
  let storedBytes = 0;

  for (const item of media) {
    const category = item.category ?? UNCATEGORIZED;
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    stateCounts[bucketOf(item)] += 1;
    storedBytes += item.size_bytes ?? 0;
  }

  return {
    categories: Array.from(categoryCounts.entries()).sort(([a], [b]) => a.localeCompare(b)),
    stateCounts,
    storedBytes,
  };
}
