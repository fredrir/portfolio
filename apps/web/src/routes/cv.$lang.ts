import { createFileRoute } from "@tanstack/react-router";

import { api } from "@/server/api";

const githubReleaseUrls = {
  en: "https://github.com/fredrir/CV/releases/download/latest/CV_Fredrik_Carsten_Hansteen_En.pdf",
  nb: "https://github.com/fredrir/CV/releases/download/latest/CV_Fredrik_Carsten_Hansteen_Nb.pdf",
} as const;

export const Route = createFileRoute("/cv/$lang")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { lang } = params as { lang: string };
        if (lang !== "en" && lang !== "nb") {
          return new Response("Not found", { status: 404 });
        }
        // Prefer the mirrored release asset; fall back to GitHub's latest
        // release URL if the API is temporarily unavailable.
        try {
          const { data } = await api.GET("/api/v1/cv");
          const active = data?.find((v) => v.lang === lang);
          if (active?.url) {
            return Response.redirect(active.url, 302);
          }
        } catch {}
        return Response.redirect(githubReleaseUrls[lang], 302);
      },
    },
  },
});
