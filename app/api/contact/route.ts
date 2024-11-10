import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message, recaptchaToken } = await req.json();

    if (!name || !email || !phone || !message || !recaptchaToken) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      { method: "POST" }
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return NextResponse.json({ error: "reCAPTCHA failed" }, { status: 400 });
    }

    try {
      await fetch("https://formspree.io/f/xeqyqwqv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, message }),
      });
    } catch (error) {
      console.error("Error sending email: ", error);
      throw error;
    }

    return NextResponse.json({ success: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
