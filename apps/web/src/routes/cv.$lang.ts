import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cv/$lang")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { lang } = params as { lang: string };
        if (lang !== "en" && lang !== "nb") {
          return new Response("Not found", { status: 404 });
        }
        return Response.redirect(new URL(`/cv-${lang}.pdf`, request.url), 302);
      },
    },
  },
});
