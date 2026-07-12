import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { AdminConsole } from "@/admin";
import { emptyMediaLibrary } from "@/admin/model";
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
      return { library: await adminListMedia({ data: {} }), apiDown: false };
    } catch {
      return { library: emptyMediaLibrary(), apiDown: true };
    }
  },
  head: () => ({
    meta: [{ title: "admin.hansteen.dev" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { library, apiDown } = Route.useLoaderData();
  return <AdminConsole initialLibrary={library} initialApiDown={apiDown} />;
}
