import { o as __toESM } from "../_runtime.mjs";
import { T as require_react } from "../_libs/phosphor-icons__react+react.mjs";
import { d as useParams, i as HeadContent, l as createFileRoute, o as createRouter, r as Scripts, s as Outlet, u as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@react-three/fiber+[...].mjs";
import { i as MY_NAME, r as MY_EMAIL, u as locales } from "./types-C3uRy3ln.mjs";
import { t as J } from "../_libs/next-themes.mjs";
import { a as RecaptchaProvider, f as getDefaultInfo, g as read, i as NotificationProvider, n as KEYS, o as Route$4, r as Neofetch, s as THEMES, x as write } from "../_locale-t--VXYkr.mjs";
import { t as match } from "../_libs/formatjs__intl-localematcher.mjs";
import { t as require_negotiator } from "../_libs/negotiator.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CWJQsHNl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_negotiator = /* @__PURE__ */ __toESM(require_negotiator());
var AnalyticsConsentContext = (0, import_react.createContext)(void 0);
function AnalyticsConsentProvider({ children }) {
	const [hasConsent, setHasConsent] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const consent = read(KEYS.analyticsConsent);
		if (consent === "accepted") setHasConsent(true);
		else if (consent === "declined") setHasConsent(false);
	}, []);
	const setConsent = (consent) => {
		setHasConsent(consent);
		write(KEYS.analyticsConsent, consent ? "accepted" : "declined");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsConsentContext.Provider, {
		value: {
			hasConsent,
			setConsent
		},
		children
	});
}
function useAnalyticsConsent() {
	const context = (0, import_react.useContext)(AnalyticsConsentContext);
	if (context === void 0) throw new Error("useAnalyticsConsent must be used within an AnalyticsConsentProvider");
	return context;
}
var content = {
	en: {
		prompt: `${MY_NAME} wants your cookies`,
		accept: "[Y] accept",
		decline: "[n] decline",
		info: "[i] info",
		gdprTitle: "GDPR / Privacy Information",
		gdprLines: [
			`Data controller: ${MY_NAME} (${MY_EMAIL})`,
			"Data collected: anonymous page views, web vitals, and referrer data",
			"Provider: Vercel Inc. (San Francisco, CA)",
			"No personal identifiers, IP addresses, or tracking cookies are stored",
			"All data is aggregated and anonymized before storage",
			"Legal basis: Art. 6(1)(a) GDPR / Norwegian Personal Data Act (Personopplysningsloven)",
			"You may withdraw consent at any time by clearing your browser cookies",
			"Right to complain: Datatilsynet (Norwegian Data Protection Authority) — datatilsynet.no",
			"Data retention: Aggregated analytics only; no personal data is stored"
		],
		gdprBack: "[q] back",
		cookieLine: "pending..."
	},
	nb: {
		prompt: `${MY_NAME} har lyst på dine informasjonskapsler`,
		accept: "[Y] godta",
		decline: "[n] avslå",
		info: "[i] info",
		gdprTitle: "GDPR / Personverninformasjon",
		gdprLines: [
			`Behandlingsansvarlig: ${MY_NAME} (${MY_EMAIL})`,
			"Data som samles inn: anonyme sidevisninger, web vitals og referansedata",
			"Leverandør: Vercel Inc. (San Francisco, CA)",
			"Ingen personlige identifikatorer, IP-adresser eller sporingskapsler lagres",
			"All data er aggregert og anonymisert før lagring",
			"Rettslig grunnlag: Art. 6(1)(a) GDPR / Personopplysningsloven § 1",
			"Du kan trekke samtykket tilbake når som helst ved å slette nettleserens informasjonskapsler",
			"Klagerett: Datatilsynet — datatilsynet.no",
			"Lagringstid: Kun aggregerte analysedata; ingen personopplysninger lagres"
		],
		gdprBack: "[q] tilbake",
		cookieLine: "venter..."
	},
	nn: {
		prompt: `${MY_NAME} treng dine informasjonskapslar`,
		accept: "[Y] godta",
		decline: "[n] avslå",
		info: "[i] info",
		gdprTitle: "GDPR / Personverninformasjon",
		gdprLines: [
			`Behandlingsansvarleg: ${MY_NAME} (${MY_EMAIL})`,
			"Data som vert samla inn: anonyme sidevisingar, web vitals og referansedata",
			"Leverandør: Vercel Inc. (San Francisco, CA)",
			"Ingen personlege identifikatorar, IP-adresser eller sporingskapslar vert lagra",
			"All data er aggregert og anonymisert før lagring",
			"Rettsleg grunnlag: Art. 6(1)(a) GDPR / Personopplysningslova § 1",
			"Du kan trekkje samtykket tilbake når som helst ved å slette nettlesaren sine informasjonskapslar",
			"Klagerett: Datatilsynet — datatilsynet.no",
			"Lagringstid: Berre aggregerte analysedata; ingen personopplysningar vert lagra"
		],
		gdprBack: "[q] tilbake",
		cookieLine: "ventar..."
	},
	fr: {
		prompt: `${MY_NAME} a besoin de vos cookies`,
		accept: "[Y] accepter",
		decline: "[n] refuser",
		info: "[i] info",
		gdprTitle: "RGPD / Confidentialité",
		gdprLines: [
			`Responsable du traitement : ${MY_NAME} (${MY_EMAIL})`,
			"Données collectées : pages vues anonymes, web vitals et données de référence",
			"Fournisseur : Vercel Inc. (San Francisco, CA)",
			"Aucun identifiant personnel, adresse IP ou cookie de suivi n'est stocké",
			"Toutes les données sont agrégées et anonymisées avant stockage",
			"Base juridique : Art. 6(1)(a) RGPD / Loi norvégienne sur les données personnelles (Personopplysningsloven)",
			"Vous pouvez retirer votre consentement à tout moment en supprimant les cookies de votre navigateur",
			"Droit de réclamation : Datatilsynet (Autorité norvégienne de protection des données) — datatilsynet.no",
			"Conservation des données : Données analytiques agrégées uniquement ; aucune donnée personnelle n'est stockée"
		],
		gdprBack: "[q] retour",
		cookieLine: "en attente..."
	}
};
function getCookieInfo(locale, cookieValue) {
	return [...getDefaultInfo(locale), {
		label: "Cookies",
		value: cookieValue
	}];
}
function CookieConsentBanner({ locale = "en" }) {
	const [isVisible, setIsVisible] = (0, import_react.useState)(false);
	const [isAnimating, setIsAnimating] = (0, import_react.useState)(false);
	const [showNeofetch, setShowNeofetch] = (0, import_react.useState)(false);
	const [typed, setTyped] = (0, import_react.useState)("");
	const [showGdpr, setShowGdpr] = (0, import_react.useState)(false);
	const { setConsent } = useAnalyticsConsent();
	const text = content[locale] || content.en;
	const fullPrompt = text.prompt;
	(0, import_react.useEffect)(() => {
		if (!read(KEYS.analyticsConsent)) setTimeout(() => setIsVisible(true), 800);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isVisible) return;
		const t = setTimeout(() => setShowNeofetch(true), 200);
		return () => clearTimeout(t);
	}, [isVisible]);
	(0, import_react.useEffect)(() => {
		if (!showNeofetch) return;
		const delay = setTimeout(() => {
			let i = 0;
			const interval = setInterval(() => {
				setTyped(fullPrompt.slice(0, i + 1));
				i++;
				if (i >= fullPrompt.length) clearInterval(interval);
			}, 18);
			return () => clearInterval(interval);
		}, 600);
		return () => clearTimeout(delay);
	}, [showNeofetch, fullPrompt]);
	const doneTyping = typed.length >= fullPrompt.length;
	(0, import_react.useEffect)(() => {
		if (!isVisible || !doneTyping) return;
		const handler = (e) => {
			if (showGdpr) {
				if (e.key === "q" || e.key === "Q" || e.key === "Escape") setShowGdpr(false);
				return;
			}
			if (e.key === "y" || e.key === "Y" || e.key === "Enter") handleAccept();
			else if (e.key === "n" || e.key === "N" || e.key === "Escape") handleDecline();
			else if (e.key === "i" || e.key === "I") setShowGdpr(true);
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [
		isVisible,
		doneTyping,
		showGdpr
	]);
	const handleAccept = () => {
		setConsent(true);
		setIsAnimating(true);
		setTimeout(() => setIsVisible(false), 250);
	};
	const handleDecline = () => {
		setConsent(false);
		setIsAnimating(true);
		setTimeout(() => setIsVisible(false), 250);
	};
	if (!isVisible) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-4 mx-2 md:mx-0 md:right-4 sm:max-w-2xl z-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `
          font-mono text-sm transition-all duration-250 ease-out
          ${isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"}
        `,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-control-border-hover bg-glass-heavy backdrop-blur-sm shadow-lg shadow-wm-shadow-soft overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 px-3 py-1.5 border-b border-border-medium bg-surface-dim",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2.5 h-2.5 rounded-full bg-terminal-close" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2.5 h-2.5 rounded-full bg-terminal-minimize" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2.5 h-2.5 rounded-full bg-terminal-maximize" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-xs text-muted-foreground",
							children: "fredrir@:hansteen:~ (zsh)"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 space-y-3",
					children: [
						showNeofetch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pb-1 border-b border-border-faint",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Neofetch, {
								info: getCookieInfo(locale, text.cookieLine),
								animate: true
							})
						}),
						showNeofetch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary shrink-0",
								children: "$"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-foreground",
								children: [typed, !doneTyping && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-1.5 h-4 bg-primary-bold align-middle animate-pulse ml-px" })]
							})]
						}),
						showGdpr && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border-medium rounded px-3 py-2 space-y-1.5 bg-surface-dim max-h-64 overflow-y-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-primary text-xs font-bold",
									children: text.gdprTitle
								}),
								text.gdprLines.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary-soft shrink-0",
										children: "·"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: line })]
								}, i)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setShowGdpr(false),
										className: "text-xs text-readable hover:text-muted-foreground hover:underline underline-offset-2 transition-colors",
										children: text.gdprBack
									})
								})
							]
						}),
						doneTyping && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 pt-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary shrink-0",
									children: "$"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleAccept,
									className: "text-primary hover:text-primary-bold hover:underline underline-offset-2 transition-colors",
									children: text.accept
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleDecline,
									className: "text-muted-foreground hover:text-foreground hover:underline underline-offset-2 transition-colors",
									children: text.decline
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowGdpr((v) => !v),
									className: "text-readable hover:text-muted-foreground hover:underline underline-offset-2 transition-colors ml-auto",
									children: text.info
								})
							]
						})
					]
				})]
			})
		})
	});
}
var globals_default = "/assets/globals-B-zbqTwT.css";
var Route$3 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				name: "google-site-verification",
				content: "UU8-qICRv5a4sAtHbMB5rFbj9CuO-wzdPKfDur29ai8"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: globals_default
			},
			{
				rel: "icon",
				href: "/favicon.ico"
			},
			{
				rel: "icon",
				href: "/favicon-32x32.png",
				type: "image/png",
				sizes: "32x32"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-icon.png",
				sizes: "180x180"
			},
			{
				rel: "manifest",
				href: "/site.webmanifest"
			}
		]
	}),
	component: RootComponent
});
function RootComponent() {
	const locale = useParams({ strict: false }).locale ?? "en";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: locale,
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "h-screen overflow-hidden dark:text-white font-mono",
			suppressHydrationWarning: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(J, {
				attribute: "class",
				defaultTheme: "fredrir",
				enableSystem: true,
				themes: [...THEMES.map((t) => t.id), "system"],
				disableTransitionOnChange: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsConsentProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecaptchaProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NotificationProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookieConsentBanner, { locale })] }) }) })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
var BASE_URL = "https://hansteen.dev";
var Route$2 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const lastmod = (/* @__PURE__ */ new Date()).toISOString();
	const body = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[
			{
				path: "",
				priority: "1.0"
			},
			...locales.map((l) => ({
				path: `/${l}`,
				priority: "1.0"
			})),
			{
				path: "/cv/en",
				priority: "0.8"
			},
			{
				path: "/cv/nb",
				priority: "0.8"
			}
		].map((e) => `<url><loc>${BASE_URL}${e.path}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>${e.priority}</priority></url>`),
		`</urlset>`
	].join("\n");
	return new Response(body, { headers: { "content-type": "application/xml" } });
} } } });
function negotiateLocale(request) {
	const languages = new import_negotiator.default({ headers: { "accept-language": request.headers.get("accept-language") ?? "" } }).languages();
	try {
		return match(languages, locales, "en");
	} catch {
		return "en";
	}
}
var Route$1 = createFileRoute("/")({ server: { handlers: { GET: async ({ request }) => {
	const locale = negotiateLocale(request);
	return Response.redirect(new URL(`/${locale}`, request.url), 307);
} } } });
var Route = createFileRoute("/cv/$lang")({ server: { handlers: { GET: async ({ request, params }) => {
	const { lang } = params;
	if (lang !== "en" && lang !== "nb") return new Response("Not found", { status: 404 });
	return Response.redirect(new URL(`/cv-${lang}.pdf`, request.url), 302);
} } } });
var SitemapDotxmlRoute = Route$2.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$3
});
var LocaleRoute = Route$4.update({
	id: "/$locale",
	path: "/$locale",
	getParentRoute: () => Route$3
});
var rootRouteChildren = {
	IndexRoute: Route$1.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	LocaleRoute,
	SitemapDotxmlRoute,
	CvLangRoute: Route.update({
		id: "/cv/$lang",
		path: "/cv/$lang",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true
	});
}
//#endregion
export { getRouter };
