import { createFileRoute } from "@tanstack/react-router";

import { locales } from "@/i18n/types";

const BASE_URL = "https://hansteen.dev";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const lastmod = new Date().toISOString();
        const entries = [
          { path: "", priority: "1.0" },
          ...locales.map((l) => ({ path: `/${l}`, priority: "1.0" })),
          { path: "/cv/en", priority: "0.8" },
          { path: "/cv/nb", priority: "0.8" },
        ];
        const body = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map(
            (e) =>
              `<url><loc>${BASE_URL}${e.path}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>${e.priority}</priority></url>`,
          ),
          `</urlset>`,
        ].join("\n");
        return new Response(body, {
          headers: { "content-type": "application/xml" },
        });
      },
    },
  },
});
