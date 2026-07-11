
export async function verifyCaptcha({
  token,
  expectedAction,
  minScore = 0.5,
}: {
  token: string;
  expectedAction?: string;
  minScore?: number;
}): Promise<{ ok: boolean; data?: Record<string, unknown> }> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      return { ok: false, data: { error: "Server configuration error" } };
    }
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
