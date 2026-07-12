import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { AdminConsole } from "@/admin";
import { adminListMedia } from "@/server/admin";
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
    try {
      return { media: await adminListMedia(), apiDown: false };
    } catch {
      return { media: [], apiDown: true };
    }
  },
  head: () => ({
    meta: [
      { title: "admin.hansteen.dev" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { media, apiDown } = Route.useLoaderData();
  return <AdminConsole initialMedia={media} initialApiDown={apiDown} />;
}
