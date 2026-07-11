import { createServerFn } from "@tanstack/react-start";

import { api, traceHeaders } from "@/server/api";

export const getEngineeringData = createServerFn().handler(async () => {
  const [version, media] = await Promise.all([
    api.GET("/api/v1/version", { headers: traceHeaders() }),
    api.GET("/api/v1/media", { headers: traceHeaders() }),
  ]);
  return {
    version: version.data ?? null,
    media: media.data ?? [],
  };
});
