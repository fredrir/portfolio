import { n as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CtTvFnxR.mjs";
import { t as verifyCaptcha } from "./captcha-DqBLDgsP.mjs";
import { t as api } from "./api-CqEB3Eqc.mjs";
import { n as object, r as string, t as email } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-Bn6lFx8L.js
var contactSchema = object({
	name: string().min(1, "Name is required").max(200, "Name is too long"),
	email: email("Invalid email address"),
	phone: string().max(30, "Phone number is too long").optional().default(""),
	message: string().min(1, "Message is required").max(5e3, "Message is too long"),
	recaptchaToken: string().min(1, "reCAPTCHA token missing")
});
var sendContactForm_createServerFn_handler = createServerRpc({
	id: "e5413d5cb26ba03b30c3f6fcc21d266268fd90af35bf0750ed51c1646b09aec6",
	name: "sendContactForm",
	filename: "src/server/contact.ts"
}, (opts) => sendContactForm.__executeServer(opts));
var sendContactForm = createServerFn({ method: "POST" }).validator((data) => data).handler(sendContactForm_createServerFn_handler, async ({ data }) => {
	const parsed = contactSchema.safeParse(data);
	if (!parsed.success) {
		const fieldErrors = {};
		for (const issue of parsed.error.issues) {
			const field = issue.path[0];
			if (typeof field === "string") fieldErrors[field] = issue.message;
		}
		return {
			success: false,
			error: "Validation failed",
			fieldErrors
		};
	}
	const { name, email, phone, message, recaptchaToken } = parsed.data;
	if (!(await verifyCaptcha({
		token: recaptchaToken,
		expectedAction: "contact_form"
	})).ok) return {
		success: false,
		error: "reCAPTCHA verification failed"
	};
	try {
		await api.POST("/api/v1/contact", { body: {
			name,
			email,
			phone: phone || null,
			message
		} });
	} catch (error) {
		console.error("Failed to store contact message:", error);
	}
	try {
		if (!(await fetch("https://formspree.io/f/xeqyqwqv", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				email,
				phone,
				message
			})
		})).ok) return {
			success: false,
			error: "Email delivery failed"
		};
	} catch (error) {
		console.error("Formspree fetch failed:", error);
		return {
			success: false,
			error: "Could not reach email service"
		};
	}
	return { success: true };
});
//#endregion
export { sendContactForm_createServerFn_handler };
