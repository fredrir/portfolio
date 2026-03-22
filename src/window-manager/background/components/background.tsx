"use client";

import type { BackgroundConfig } from "../types";
import { StarfieldBackground } from "./starfield";
import { MatrixBackground } from "./matrix";
import { GridBackground } from "./grid";
import { GradientBackground } from "./gradient";
import { PlainBackground } from "./plain";

export function Background({ config }: { config: BackgroundConfig }) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-background transition-colors duration-500">
      {config.type === "animated-dots" && <StarfieldBackground />}
      {config.type === "matrix" && <MatrixBackground />}
      {config.type === "grid" && <GridBackground />}
      {config.type === "gradient" && <GradientBackground />}
      {config.type === "custom-image" && config.value && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${config.value})` }}
        />
      )}
      {config.type === "plain" && <PlainBackground />}
    </div>
  );
}
