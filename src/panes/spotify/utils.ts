const UNITS: Record<string, Record<string, string>> = {
  en: { s: "s ago", m: "m ago", h: "h ago", d: "d ago", mo: "mo ago" },
  nb: { s: "s siden", m: "m siden", h: "t siden", d: "d siden", mo: "mnd siden" },
  nn: { s: "s sidan", m: "m sidan", h: "t sidan", d: "d sidan", mo: "mnd sidan" },
  fr: { s: "s", m: "min", h: "h", d: "j", mo: "mois" },
};

export function relativeTime(isoDate: string, locale = "en"): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const u = UNITS[locale] ?? UNITS.en;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}${u.s}`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}${u.m}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}${u.h}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}${u.d}`;
  const months = Math.floor(days / 30);
  return `${months}${u.mo}`;
}

export function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
