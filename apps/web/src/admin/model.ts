import type { components } from "@portfolio/api-client";

type MediaItem = components["schemas"]["MediaItem"];

export type StateFilter = "all" | "ready" | "processing" | "failed";

export function bucketOf(item: MediaItem): Exclude<StateFilter, "all"> {
  if (item.state === "ready") return "ready";
  if (item.state === "failed") return "failed";
  return "processing";
}

export function thumbOf(item: MediaItem): string | undefined {
  return (
    item.variants.find((v) => v.format === "webp")?.url ??
    item.variants.find((v) => v.url)?.url ??
    undefined
  );
}
