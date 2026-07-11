import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

import { api, traceHeaders } from "@/server/api";

interface VisitorResult {
  success: boolean;
  count?: number;
  error?: string;
}

// Captcha verification happens in the API (action `record_visit`); this
// function only forwards the token and request metadata.
export const recordVisit = createServerFn({ method: "POST" })
  .validator((captchaToken: string) => captchaToken)
  .handler(async ({ data: captchaToken }): Promise<VisitorResult> => {
    const userAgent = getRequestHeader("user-agent");
    const forwarded = getRequestHeader("x-forwarded-for");
    const referrer = getRequestHeader("referer");
    const country = getRequestHeader("x-visitor-country");

    const { data, error } = await api.POST("/api/v1/visits", {
      body: { page: "/", referrer, recaptcha_token: captchaToken },
      headers: {
        ...traceHeaders(),
        ...(userAgent ? { "user-agent": userAgent } : {}),
        ...(forwarded ? { "x-forwarded-for": forwarded } : {}),
        ...(country ? { "x-visitor-country": country } : {}),
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
    const { data } = await api.GET("/api/v1/visits/count", {
      headers: traceHeaders(),
    });
    return data?.count ?? 0;
  },
);
