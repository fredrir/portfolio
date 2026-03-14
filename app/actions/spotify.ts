"use server";

import { headers } from "next/headers";
import { fetchSpotifyData } from "@/lib/spotify";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) return true;

  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}

export async function getSpotifyData() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return { isPlaying: false };
  }

  return fetchSpotifyData();
}
