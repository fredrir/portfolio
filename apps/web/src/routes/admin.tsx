import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

import { AdminConsole } from "@/admin";
import { getStaticDictionary } from "@/i18n/dictionaries";

// Reachable only via admin.hansteen.dev: Access gates the hostname, Caddy
// stamps x-admin-origin, and everything else 404s (defense in depth — the
// edge Worker additionally refuses /admin on the public hostnames).
const assertAdminHost = createServerFn().handler(async () => {
  if (getRequestHeader("x-admin-origin") !== "1") {
    throw notFound();
  }
  return true;
});

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    await assertAdminHost();
  },
  head: () => ({
    meta: [
      { title: getStaticDictionary("en").admin.pageTitle },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminConsole,
});
