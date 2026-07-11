import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { AdminConsole } from "@/admin";
import { getStaticDictionary } from "@/i18n/dictionaries";
import { adminAuditLog, adminListMedia } from "@/server/admin";
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
  loader: async () => {
    const [mediaResult, auditResult] = await Promise.allSettled([
      adminListMedia(),
      adminAuditLog(),
    ]);
    return {
      media: mediaResult.status === "fulfilled" ? mediaResult.value : [],
      audit: auditResult.status === "fulfilled" ? auditResult.value : [],
      apiDown: mediaResult.status === "rejected",
    };
  },
  head: () => ({
    meta: [
      { title: getStaticDictionary("en").admin.pageTitle },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { media, audit, apiDown } = Route.useLoaderData();
  return <AdminConsole initialMedia={media} initialAudit={audit} initialApiDown={apiDown} />;
}
