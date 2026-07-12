import { createServerFn } from "@tanstack/react-start";

import { isAdminOrigin } from "@/server/admin-origin";
import { api, traceHeaders } from "@/server/api";

/**
 * Admin server functions are reachable only through admin.hansteen.dev:
 * Cloudflare Access gates that hostname interactively, and Caddy marks its
 * requests with x-admin-origin. The ADMIN_TOKEN never reaches the browser.
 */
function assertAdminOrigin(): void {
  if (!isAdminOrigin()) {
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

export interface AdminMediaQuery {
  query?: string;
  state?: "ready" | "processing" | "failed";
  category?: string;
}

export const adminListMedia = createServerFn()
  .validator((input: AdminMediaQuery) => input)
  .handler(async ({ data: input }) => {
    assertAdminOrigin();
    const { data, error } = await api.GET("/api/v1/media/admin", {
      params: { query: input },
      headers: adminHeaders(),
    });
    if (error || !data) throw new Error("media list failed");
    return data;
  });

export const adminCreateUpload = createServerFn({ method: "POST" })
  .validator(
    (input: { filename: string; content_type: string; size_bytes: number; category?: string }) =>
      input,
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

export const adminSetCategory = createServerFn({ method: "POST" })
  .validator((input: { id: string; category: string | null }) => input)
  .handler(async ({ data: input }) => {
    assertAdminOrigin();
    const { data, error, response } = await api.PATCH("/api/v1/media/{id}", {
      params: { path: { id: input.id } },
      body: { category: input.category },
      headers: adminHeaders(),
    });
    if (error || !data) {
      throw new Error(`category update failed (${response.status})`);
    }
    return data;
  });

export const adminDeleteMedia = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data: input }) => {
    assertAdminOrigin();
    const { error, response } = await api.DELETE("/api/v1/media/{id}", {
      params: { path: { id: input.id } },
      headers: adminHeaders(),
    });
    if (error) {
      throw new Error(`delete failed (${response.status})`);
    }
    return { id: input.id };
  });

export const adminRenameCategory = createServerFn({ method: "POST" })
  .validator((input: { from: string; to: string }) => input)
  .handler(async ({ data: input }) => {
    assertAdminOrigin();
    const { data, error, response } = await api.POST("/api/v1/media/categories/rename", {
      body: { from: input.from, to: input.to },
      headers: adminHeaders(),
    });
    if (error || !data) {
      throw new Error(`category rename failed (${response.status})`);
    }
    return data;
  });
