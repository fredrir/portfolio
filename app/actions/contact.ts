"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(30, "Phone number is too long").optional().default(""),
  message: z
    .string()
    .min(1, "Message is required")
    .max(5000, "Message is too long"),
  recaptchaToken: z.string().min(1, "reCAPTCHA token missing"),
});

interface ContactResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

async function verifyCaptcha({
  token,
  secretKey,
  expectedAction,
  minScore = 0.5,
}: {
  token: string;
  secretKey: string;
  expectedAction?: string;
  minScore?: number;
}): Promise<{ ok: boolean; data?: Record<string, unknown> }> {
  try {
    if (!secretKey) return { ok: false, data: { error: "missing-secret" } };
    if (!token) return { ok: false, data: { error: "missing-token" } };

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

    const ok =
      data?.success === true &&
      (typeof data?.score !== "number" || data.score >= minScore) &&
      (!expectedAction || data.action === expectedAction);

    return { ok, data };
  } catch (error) {
    console.error("Error verifying captcha:", error);
    return { ok: false, data: { error: "exception" } };
  }
}

export async function sendContactForm(
  data: z.input<typeof contactSchema>,
): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string") {
        fieldErrors[field] = issue.message;
      }
    }
    return { success: false, error: "Validation failed", fieldErrors };
  }

  const { name, email, phone, message, recaptchaToken } = parsed.data;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    return { success: false, error: "Server configuration error" };
  }

  const captcha = await verifyCaptcha({
    token: recaptchaToken,
    secretKey,
    expectedAction: "contact_form",
  });

  if (!captcha.ok) {
    return { success: false, error: "reCAPTCHA verification failed" };
  }

  try {
    const formspreeResponse = await fetch("https://formspree.io/f/xeqyqwqv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, message }),
    });

    if (!formspreeResponse.ok) {
      return { success: false, error: "Email delivery failed" };
    }
  } catch (error) {
    console.error("Formspree fetch failed:", error);
    return { success: false, error: "Could not reach email service" };
  }

  return { success: true };
}
