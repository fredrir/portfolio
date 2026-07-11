import { createFileRoute } from "@tanstack/react-router";

import { api } from "@/server/api";

export const Route = createFileRoute("/cv/$lang")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { lang } = params as { lang: string };
        if (lang !== "en" && lang !== "nb") {
          return new Response("Not found", { status: 404 });
        }
        // Synced from the CV repository's releases; falls back to the
        // static PDFs bundled with the site if no version is active yet.
        try {
          const { data } = await api.GET("/api/v1/cv");
          const active = data?.find((v) => v.lang === lang);
          if (active?.url) {
            return Response.redirect(active.url, 302);
          }
        } catch {
        }
        return Response.redirect(new URL(`/cv-${lang}.pdf`, request.url), 302);
      },
    },
  },
});
