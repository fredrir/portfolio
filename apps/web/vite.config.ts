import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
    // Same-origin API calls in dev (prod routes these through Caddy).
    proxy: {
      "/api": "http://localhost:8080",
      "/healthz": "http://localhost:8080",
    },
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    // Pin the preset so the build artifact is runtime-independent; without
    // this, building under Bun bakes in a Bun.serve entry that Node can't run.
    nitro({ preset: "node-server" }),
    viteReact(),
  ],
});
