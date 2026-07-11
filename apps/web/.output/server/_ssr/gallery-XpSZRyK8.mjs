import { n as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CtTvFnxR.mjs";
import { t as getSupabase } from "./supabase-DH_U1O8d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gallery-XpSZRyK8.js
var SUPABASE_FOLDERS = [
	"Arkiv",
	"Interrail",
	"Krageroe",
	"Oslo",
	"Trondheim"
];
var STATIC_CATEGORIES = [{
	name: "Projects",
	images: [
		"/gallery/projects/appkom.png",
		"/gallery/projects/app-picture.png",
		"/gallery/projects/app-picture-2.jpg",
		"/gallery/projects/app-picture-3.jpg",
		"/gallery/projects/movie-tracker.png",
		"/gallery/projects/norges-tilstand.png",
		"/gallery/projects/onlinefondet.png",
		"/gallery/projects/online-opptak.png",
		"/gallery/projects/onlove.webp",
		"/gallery/projects/rif.png",
		"/gallery/projects/seniorbank.png",
		"/gallery/projects/y.png"
	].map((src) => ({
		src,
		originalSrc: src,
		filename: src.split("/").pop() ?? ""
	}))
}];
function parseDateFromFilename(filename) {
	const match = filename.match(/^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/);
	if (!match) return void 0;
	const [, y, m, d, h, min, s] = match;
	return `${y}-${m}-${d}T${h}:${min}:${s}`;
}
function toRenderUrl(publicUrl) {
	return publicUrl.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
}
async function getSupabaseCategories() {
	const supabase = getSupabase();
	if (!supabase) return [];
	return (await Promise.all(SUPABASE_FOLDERS.map(async (folder) => {
		const { data } = await supabase.storage.from("Portfolio").list(folder, { limit: 1e3 });
		if (!data || data.length === 0) return null;
		const images = data.filter((file) => file.name && !file.name.startsWith(".")).map((file) => {
			const { data: urlData } = supabase.storage.from("Portfolio").getPublicUrl(`${folder}/${file.name}`);
			const publicUrl = urlData.publicUrl;
			return {
				src: file.name.toLowerCase().endsWith(".heic") ? toRenderUrl(publicUrl) : publicUrl,
				originalSrc: publicUrl,
				filename: file.name,
				date: parseDateFromFilename(file.name)
			};
		});
		if (images.length === 0) return null;
		images.sort((a, b) => {
			if (a.date && b.date) return b.date.localeCompare(a.date);
			return a.filename.localeCompare(b.filename);
		});
		return {
			name: folder,
			images
		};
	}))).filter((r) => r !== null);
}
var getGalleryData_createServerFn_handler = createServerRpc({
	id: "82c2b128e2c0488f11571d1a0cc4aed1cceba763408ece7966a556724be5f692",
	name: "getGalleryData",
	filename: "src/server/gallery.ts"
}, (opts) => getGalleryData.__executeServer(opts));
var getGalleryData = createServerFn().handler(getGalleryData_createServerFn_handler, async () => {
	return [...await getSupabaseCategories(), ...STATIC_CATEGORIES].sort((a, b) => a.name.localeCompare(b.name));
});
//#endregion
export { getGalleryData_createServerFn_handler };
