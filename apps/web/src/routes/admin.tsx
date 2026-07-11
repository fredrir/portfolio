import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { AdminConsole } from "@/admin";
import { getStaticDictionary } from "@/i18n/dictionaries";
import { isAdminOrigin } from "@/server/admin-origin";

const assertAdminHost = createServerFn().handler(async () => {
  if (!isAdminOrigin()) {
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
