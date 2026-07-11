import { n as createServerFn, r as getRequestHeader } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CtTvFnxR.mjs";
import { t as verifyCaptcha } from "./captcha-DqBLDgsP.mjs";
import { t as api } from "./api-CqEB3Eqc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/visitor-CX3F3OKg.js
var recordVisit_createServerFn_handler = createServerRpc({
	id: "32acd23f426f29c3172a707333b8e9d6c331bdd3ae242f07b4cd945cec6318f0",
	name: "recordVisit",
	filename: "src/server/visitor.ts"
}, (opts) => recordVisit.__executeServer(opts));
var recordVisit = createServerFn({ method: "POST" }).validator((captchaToken) => captchaToken).handler(recordVisit_createServerFn_handler, async ({ data: captchaToken }) => {
	if (!(await verifyCaptcha({
		token: captchaToken,
		expectedAction: "record_visit"
	})).ok) return {
		success: false,
		error: "captcha_failed"
	};
	const userAgent = getRequestHeader("user-agent");
	const forwarded = getRequestHeader("x-forwarded-for");
	const referrer = getRequestHeader("referer");
	const { data, error } = await api.POST("/api/v1/visits", {
		body: {
			page: "/",
			referrer
		},
		headers: {
			...userAgent ? { "user-agent": userAgent } : {},
			...forwarded ? { "x-forwarded-for": forwarded } : {}
		}
	});
	if (error || !data) {
		console.error("Failed to record visit:", error);
		return {
			success: false,
			error: "insert_failed"
		};
	}
	return {
		success: true,
		count: data.count
	};
});
var getVisitorCount_createServerFn_handler = createServerRpc({
	id: "aee85d5a0d58071f3fc30e793d1f8b5b1e59bd2b30d23931a84c0c92665dc12b",
	name: "getVisitorCount",
	filename: "src/server/visitor.ts"
}, (opts) => getVisitorCount.__executeServer(opts));
var getVisitorCount = createServerFn().handler(getVisitorCount_createServerFn_handler, async () => {
	const { data } = await api.GET("/api/v1/visits/count");
	return data?.count ?? 0;
});
//#endregion
export { getVisitorCount_createServerFn_handler, recordVisit_createServerFn_handler };
