export const REACTIONS = [
  "spin",
  "bounce",
  "wiggle",
  "flip",
  "wave",
  "nod",
  "jello",
  "disco",
] as const;

export const SHIRT = "#B8A089";
export const SHIRT_DARK = "#A08870";
export const SKIN = "#F0C8AD";
export const SKIN_SHADOW = "#E8BFA3";
export const HAIR = "#8B6B4A";
export const HAIR_DARK = "#5C3A1E";
export const PANTS = "#1E3A5F";
export const PANTS_DARK = "#162D4A";

export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function sr(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
