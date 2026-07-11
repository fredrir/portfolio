import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

import { verifyCaptcha } from "@/lib/captcha";
import { api, traceHeaders } from "@/server/api";

interface VisitorResult {
  success: boolean;
  count?: number;
  error?: string;
}

export const recordVisit = createServerFn({ method: "POST" })
  .validator((captchaToken: string) => captchaToken)
  .handler(async ({ data: captchaToken }): Promise<VisitorResult> => {
    const captcha = await verifyCaptcha({
      token: captchaToken,
      expectedAction: "record_visit",
    });
    if (!captcha.ok) {
      return { success: false, error: "captcha_failed" };
    }

    const userAgent = getRequestHeader("user-agent");
    const forwarded = getRequestHeader("x-forwarded-for");
    const referrer = getRequestHeader("referer");

    const { data, error } = await api.POST("/api/v1/visits", {
      body: { page: "/", referrer },
      headers: {
        ...traceHeaders(),
        ...(userAgent ? { "user-agent": userAgent } : {}),
        ...(forwarded ? { "x-forwarded-for": forwarded } : {}),
      },
    });

    if (error || !data) {
      console.error("Failed to record visit:", error);
      return { success: false, error: "insert_failed" };
    }
    return { success: true, count: data.count };
  });

export const getVisitorCount = createServerFn().handler(
  async (): Promise<number> => {
    const { data } = await api.GET("/api/v1/visits/count", { headers: traceHeaders() });
    return data?.count ?? 0;
  },
);
