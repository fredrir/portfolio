import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { verifyCaptcha } from "@/lib/captcha";
import { api } from "@/server/api";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name is too long"),
  email: z.email("Invalid email address"),
  phone: z.string().max(30, "Phone number is too long").optional().default(""),
  message: z
    .string()
    .min(1, "Message is required")
    .max(5000, "Message is too long"),
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

    const captcha = await verifyCaptcha({
      token: recaptchaToken,
      expectedAction: "contact_form",
    });

    if (!captcha.ok) {
      return { success: false, error: "reCAPTCHA verification failed" };
    }

    // Persist in our own database; delivery moves to the queue worker in
    // Phase 2. Until then Formspree remains the delivery path of record,
    // so an API failure must not fail the submission.
    try {
      await api.POST("/api/v1/contact", {
        body: { name, email, phone: phone || null, message },
      });
    } catch (error) {
      console.error("Failed to store contact message:", error);
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
