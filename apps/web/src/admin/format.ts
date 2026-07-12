import type { AdminStrings } from "@/i18n/types";

/** Compact byte formatting for readouts ("3.2 MB", "412 KB"). */
export function formatBytes(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log2(n) / 10));
  const v = n / 2 ** (10 * i);
  return `${v >= 10 || i === 0 ? Math.round(v) : v.toFixed(1)} ${units[i]}`;
}

/** Compact "3m ago"-style timestamp for desk readouts. */
export function timeAgo(iso: string, t: AdminStrings["time"]): string {
  const seconds = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (!Number.isFinite(seconds)) return iso;
  if (seconds < 60) return `${Math.floor(seconds)}${t.secondsAgo}`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}${t.minutesAgo}`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}${t.hoursAgo}`;
  return `${Math.floor(seconds / 86400)}${t.daysAgo}`;
}
