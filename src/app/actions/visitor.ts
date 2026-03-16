"use server";

import { headers } from "next/headers";
import { getSupabase } from "@/lib/supabase";

interface VisitorResult {
  success: boolean;
  count?: number;
  error?: string;
}

async function verifyCaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey || !token) return false;

  try {
    const body = new URLSearchParams();
    body.set("secret", secretKey);
    body.set("response", token);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    let response: Response;
    try {
      response = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
          signal: controller.signal,
        },
      );
    } finally {
      clearTimeout(timeout);
    }

    const data = await response.json();
    return (
      data?.success === true &&
      (typeof data?.score !== "number" || data.score >= 0.3)
    );
  } catch {
    return false;
  }
}

export async function recordVisit(
  recaptchaToken: string,
): Promise<VisitorResult> {
  const captchaOk = await verifyCaptcha(recaptchaToken);
  if (!captchaOk) {
    return { success: false, error: "captcha_failed" };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return { success: false, error: "db_unavailable" };
  }

  const h = await headers();
  const userAgent = h.get("user-agent") ?? undefined;
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim();
  const referrer = h.get("referer") ?? undefined;

  const { error } = await supabase.from("visitors").insert({
    page: "/",
    referrer,
    user_agent: userAgent,
    country: ip,
  });

  if (error) {
    console.error("Failed to record visit:", error.message);
    return { success: false, error: "insert_failed" };
  }

  const { count, error: countError } = await supabase
    .from("visitors")
    .select("*", { count: "exact", head: true });

  if (countError) {
    return { success: true, count: 0 };
  }

  return { success: true, count: count ?? 0 };
}

export async function getVisitorCount(): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("visitors")
    .select("*", { count: "exact", head: true });

  if (error) return 0;
  return count ?? 0;
}
