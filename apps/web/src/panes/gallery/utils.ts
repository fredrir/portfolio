export function isSvg(src: string) {
  return src.toLowerCase().endsWith(".svg");
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatShutter(seconds: number): string {
  if (seconds >= 1) return `${trimDecimals(seconds)}s`;
  return `1/${Math.round(1 / seconds)}s`;
}

export function formatFocalLength(mm: number): string {
  return `${trimDecimals(mm)}mm`;
}

export function formatAperture(fNumber: number): string {
  return `f/${trimDecimals(fNumber)}`;
}

/** 23.0 → 23, 1.42 → 1.4 — floats come back from the API un-rounded. */
function trimDecimals(value: number): number {
  return Number(value.toFixed(1));
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log2(bytes) / 10));
  const value = bytes / 2 ** (10 * i);
  return `${value >= 10 || i === 0 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
}
