export interface BackgroundConfig {
  id: string;
  name: string;
  type: "animated-dots" | "matrix" | "grid" | "plain" | "gradient" | "custom-image";
  value?: string;
}
