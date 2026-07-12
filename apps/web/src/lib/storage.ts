export const KEYS = {
  openPanes: "wm-open-panes",
  // Versioned blob (layout + rowHeights + colWidths kept shape-consistent).
  tiling: "wm-tiling-v1",
  rowHeights: "wm-row-heights",
  colWidths: "wm-col-widths",
  background: "wm-background",
  backgroundImage: "wm-background-image",
  tutorialCompleted: "tutorial-completed",
  tutorialState: "tutorial-state",
  analyticsConsent: "analytics-consent",
  tipDismissed: "wm-tip-dismissed",
  visited: "wm-visited",
  weather: "wm-weather",
  mobileActiveApp: "wm-mobile-active-app",
} as const;

function resolve(session: boolean): Storage | null {
  if (typeof window === "undefined") return null;
  return session ? sessionStorage : localStorage;
}

export function read(key: string, session = false): string | null {
  try {
    return resolve(session)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function readJson<T>(key: string, session = false): T | null {
  const raw = read(key, session);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Returns false if the write was rejected (e.g. quota exceeded). */
export function write(key: string, value: string, session = false): boolean {
  try {
    const store = resolve(session);
    if (!store) return false;
    store.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function writeJson(key: string, value: unknown, session = false): boolean {
  return write(key, JSON.stringify(value), session);
}

export function remove(key: string, session = false): void {
  try {
    resolve(session)?.removeItem(key);
  } catch {}
}
