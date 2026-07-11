import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-DH_U1O8d.js
var url = process.env.SUPABASE_URL;
var key = process.env.SUPABASE_ANON_KEY;
function getSupabase() {
	if (!url || !key) return null;
	return createClient(url, key);
}
//#endregion
export { getSupabase as t };
