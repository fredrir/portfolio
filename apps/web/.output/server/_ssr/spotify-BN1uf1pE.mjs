import { n as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CtTvFnxR.mjs";
import { t as verifyCaptcha } from "./captcha-DqBLDgsP.mjs";
import { t as fetchSpotifyData } from "./spotify-tH4SB1Od.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spotify-BN1uf1pE.js
var getSpotifyData_createServerFn_handler = createServerRpc({
	id: "78c5e5b135f5a975719c39a24fa44a123bc6c1bb09c3d5c3041b661294590208",
	name: "getSpotifyData",
	filename: "src/server/spotify.ts"
}, (opts) => getSpotifyData.__executeServer(opts));
var getSpotifyData = createServerFn({ method: "POST" }).validator((captchaToken) => captchaToken).handler(getSpotifyData_createServerFn_handler, async ({ data: captchaToken }) => {
	if (!(await verifyCaptcha({
		minScore: .3,
		token: captchaToken,
		expectedAction: "spotify_data"
	})).ok) return {
		ok: false,
		error: "captcha_failed"
	};
	return fetchSpotifyData();
});
//#endregion
export { getSpotifyData_createServerFn_handler };
