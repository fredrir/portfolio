import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

import { api, traceHeaders } from "@/server/api";

/**
 * Admin server functions are reachable only through admin.hansteen.dev:
 * Cloudflare Access gates that hostname interactively, and Caddy marks its
 * requests with x-admin-origin. The ADMIN_TOKEN never reaches the browser.
 */
function assertAdminOrigin(): void {
  if (getRequestHeader("x-admin-origin") !== "1") {
    throw new Error("not found");
  }
}

function adminHeaders(): Record<string, string> {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    throw new Error("administration disabled");
  }
  return { ...traceHeaders(), authorization: `Bearer ${token}` };
}

export const adminListMedia = createServerFn().handler(async () => {
  assertAdminOrigin();
  const { data, error } = await api.GET("/api/v1/media", {
    params: { query: { include_pending: true } },
    headers: adminHeaders(),
  });
  if (error || !data) throw new Error("media list failed");
  return data;
});

export const adminCreateUpload = createServerFn({ method: "POST" })
  .validator(
    (input: {
      filename: string;
      content_type: string;
      size_bytes: number;
      category?: string;
    }) => input,
  )
  .handler(async ({ data: input }) => {
    assertAdminOrigin();
    const { data, error, response } = await api.POST("/api/v1/media/uploads", {
      body: {
        filename: input.filename,
        content_type: input.content_type,
        size_bytes: input.size_bytes,
        category: input.category || null,
      },
      headers: adminHeaders(),
    });
    if (error || !data) {
      throw new Error(`upload authorization failed (${response.status})`);
    }
    return data;
  });

export interface AdminAuditEntry {
  id: number;
  at: string;
  action: string;
  entry_hash: string;
  detail: string;
}

export const adminAuditLog = createServerFn().handler(
  async (): Promise<AdminAuditEntry[]> => {
    assertAdminOrigin();
    const { data, error } = await api.GET("/api/v1/audit", {
      headers: adminHeaders(),
    });
    if (error || !data) throw new Error("audit list failed");
    // `detail` is arbitrary JSON; stringify so the payload is serializable.
    return data.map((e) => ({
      id: e.id,
      at: e.at,
      action: e.action,
      entry_hash: e.entry_hash,
      detail: JSON.stringify(e.detail),
    }));
  },
);

export const adminAuditVerify = createServerFn().handler(async () => {
  assertAdminOrigin();
  const { data, error } = await api.GET("/api/v1/audit/verify", {
    headers: adminHeaders(),
  });
  if (error || !data) throw new Error("audit verify failed");
  return data;
});
