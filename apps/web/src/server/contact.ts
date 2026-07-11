import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { api, traceHeaders } from "@/server/api";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
  email: z.email("Invalid email address"),
  phone: z.string().max(30, "Phone number is too long").optional().default(""),
  message: z.string().min(1, "Message is required").max(5000, "Message is too long"),
  recaptchaToken: z.string().min(1, "reCAPTCHA token missing"),
});

export type ContactInput = z.input<typeof contactSchema>;

interface ContactResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export const sendContactForm = createServerFn({ method: "POST" })
  .validator((data: ContactInput) => data)
  .handler(async ({ data }): Promise<ContactResult> => {
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

    // Captcha is verified server-side by the API (action `contact_form`): 403
    // means it failed. The API also persists the message. Delivery still goes
    // through Formspree, but ONLY once the API has evaluated the token — if we
    // can't reach the API we cannot confirm the captcha, so we must not deliver
    // (otherwise the spam gate is bypassed exactly when the origin is down).
    let apiEvaluated = false;
    try {
      const { response } = await api.POST("/api/v1/contact", {
        headers: traceHeaders(),
        body: { name, email, phone: phone || null, message, recaptcha_token: recaptchaToken },
      });
      apiEvaluated = true;
      if (response.status === 403) {
        return { success: false, error: "reCAPTCHA verification failed" };
      }
    } catch (error) {
      console.error("Failed to reach the contact API:", error);
    }
    if (!apiEvaluated) {
      return {
        success: false,
        error: "Couldn't verify your submission — please try again in a moment",
      };
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
  });
