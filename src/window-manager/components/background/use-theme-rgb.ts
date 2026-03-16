import { useEffect, useRef, useCallback } from "react";

function hslToRgb(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return `${Math.round(f(0) * 255)}, ${Math.round(f(8) * 255)}, ${Math.round(f(4) * 255)}`;
}

function readHslVar(name: string, fallback: string): string {
  const style = getComputedStyle(document.documentElement);
  const hsl = style.getPropertyValue(name).trim();
  if (!hsl) return fallback;
  const [h, s, l] = hsl.split(/\s+/).map((v) => parseFloat(v));
  return hslToRgb(h, s, l);
}

export function useThemeRgb() {
  const primary = useRef("74, 222, 128");
  const bg = useRef("10, 14, 26");

  const update = useCallback(() => {
    primary.current = readHslVar("--primary", "74, 222, 128");
    bg.current = readHslVar("--background", "10, 14, 26");
  }, []);

  useEffect(() => {
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });
    return () => obs.disconnect();
  }, [update]);

  return { primary, bg };
}
