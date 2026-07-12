import http from "node:http";
import process from "node:process";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, type Plugin } from "vite";

function devApiProxy(bases: string[]): Plugin {
  const target = new URL(process.env.API_URL ?? "http://localhost:8080");
  return {
    name: "dev-api-proxy",
    apply: "serve",
    configureServer(server) {
      for (const base of bases) {
        server.middlewares.use(base, (req, res) => {
          const upstream = http.request(
            {
              host: target.hostname,
              port: target.port,
              method: req.method,
              path: req.originalUrl ?? base + (req.url ?? ""),
              headers: { ...req.headers, host: target.host },
            },
            (apiRes) => {
              res.writeHead(apiRes.statusCode ?? 502, apiRes.headers);
              apiRes.pipe(res);
            },
          );
          upstream.on("error", () => {
            res.statusCode = 502;
            res.end(`dev proxy: API at ${target.origin} unreachable`);
          });
          req.pipe(upstream);
        });
      }
    },
  };
}

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  plugins: [
    devApiProxy(["/api", "/healthz"]),
    tailwindcss(),
    tanstackStart(),
    nitro({ preset: "node-server" }),
    viteReact(),
  ],
});
