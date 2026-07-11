import { o as __toESM } from "./_runtime.mjs";
import { T as require_react, d as s, f as s$1, g as i, h as s$2, i as p, l as I, p as p$1, r as c, s as n, t as m } from "./_libs/phosphor-icons__react+react.mjs";
import { c as lazyRouteComponent, l as createFileRoute, p as notFound } from "./_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime, t as Canvas } from "./_libs/@react-three/fiber+[...].mjs";
import { i as getServerFnById, n as createServerFn, t as TSS_SERVER_FUNCTION } from "./_ssr/ssr.mjs";
import { t as AvatarModel } from "./_ssr/avatar-model-DdESeywj.mjs";
import { c as TAILWIND_VERSION, i as MY_NAME, l as USER_HOST, o as PORTFOLIO_VERSION, s as START_VERSION, t as BIRTHDAY, u as locales } from "./_ssr/types-C3uRy3ln.mjs";
import { n as z } from "./_libs/next-themes.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_locale-t--VXYkr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEYS = {
	openPanes: "wm-open-panes",
	rowHeights: "wm-row-heights",
	colWidths: "wm-col-widths",
	background: "wm-background",
	backgroundImage: "wm-background-image",
	tutorialCompleted: "tutorial-completed",
	tutorialState: "tutorial-state",
	analyticsConsent: "vercel-analytics-consent",
	tipDismissed: "wm-tip-dismissed",
	visited: "wm-visited",
	weather: "wm-weather",
	mobileActiveApp: "wm-mobile-active-app"
};
function resolve(session) {
	if (typeof window === "undefined") return null;
	return session ? sessionStorage : localStorage;
}
function read(key, session = false) {
	try {
		return resolve(session)?.getItem(key) ?? null;
	} catch {
		return null;
	}
}
function readJson(key, session = false) {
	const raw = read(key, session);
	if (raw === null) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function write(key, value, session = false) {
	try {
		resolve(session)?.setItem(key, value);
	} catch {}
}
function writeJson(key, value, session = false) {
	try {
		resolve(session)?.setItem(key, JSON.stringify(value));
	} catch {}
}
function remove(key, session = false) {
	try {
		resolve(session)?.removeItem(key);
	} catch {}
}
var THEMES = [
	{
		id: "fredrir",
		name: "fredrir",
		dark: true,
		colors: [
			"#0a1628",
			"#4ade80",
			"#3b82f6"
		]
	},
	{
		id: "nord",
		name: "Nord",
		dark: true,
		colors: [
			"#272d38",
			"#8fbcbb",
			"#5e81ac"
		]
	},
	{
		id: "catppuccin-mocha",
		name: "Catppuccin Mocha",
		dark: true,
		colors: [
			"#1e1e2e",
			"#cba6f7",
			"#89b4fa"
		]
	},
	{
		id: "rosepine",
		name: "Rosé Pine",
		dark: true,
		colors: [
			"#191724",
			"#eb6f92",
			"#ebbcba"
		]
	},
	{
		id: "tokyo-night",
		name: "Tokyo Night",
		dark: true,
		colors: [
			"#1a1b26",
			"#7aa2f7",
			"#7dcfff"
		]
	},
	{
		id: "gruvbox",
		name: "Gruvbox",
		dark: true,
		colors: [
			"#282828",
			"#fe8019",
			"#fabd2f"
		]
	},
	{
		id: "solarized-light",
		name: "Solarized Light",
		dark: false,
		colors: [
			"#fdf6e3",
			"#2aa198",
			"#268bd2"
		]
	},
	{
		id: "catppuccin-latte",
		name: "Catppuccin Latte",
		dark: false,
		colors: [
			"#eff1f5",
			"#8839ef",
			"#1e66f5"
		]
	},
	{
		id: "rose-pine-dawn",
		name: "Rosé Pine Dawn",
		dark: false,
		colors: [
			"#faf4ed",
			"#907aa9",
			"#286983"
		]
	}
];
var DARK_IDS = new Set(THEMES.filter((t) => t.dark).map((t) => t.id));
function isDarkTheme(theme) {
	return theme === "dark" || DARK_IDS.has(theme ?? "");
}
THEMES.filter((t) => t.dark).map((t) => `.${t.id}`).concat(".dark").join(", ");
function openExternalWindow(config, locale) {
	if (!config.href) return;
	const url = typeof config.href === "string" ? config.href : config.href[locale] ?? config.href.en;
	window.open(url, "_blank", "noopener,noreferrer");
}
var S = 14;
var W = "bold";
var WINDOW_CONFIGS = [
	{
		id: "about",
		title: "whoami",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m, {
			size: S,
			weight: W
		}),
		defaultOpen: true,
		order: 0
	},
	{
		id: "github",
		title: "cat /proc/github",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, {
			size: S,
			weight: W
		}),
		defaultOpen: true,
		order: 1
	},
	{
		id: "spotify",
		title: "./spotify.sh",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p, {
			size: S,
			weight: W
		}),
		defaultOpen: true,
		order: 2
	},
	{
		id: "journey",
		title: "cat ~/.career/log",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, {
			size: S,
			weight: W
		}),
		defaultOpen: true,
		order: 3
	},
	{
		id: "projects",
		title: "ls ~/projects",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p$1, {
			size: S,
			weight: W
		}),
		defaultOpen: true,
		order: 4
	},
	{
		id: "contact",
		title: "vim mail.tmp",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(i, {
			size: S,
			weight: W
		}),
		defaultOpen: true,
		order: 5
	},
	{
		id: "settings",
		title: "./settings.sh",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$1, {
			size: S,
			weight: W
		}),
		defaultOpen: true,
		order: 7
	},
	{
		id: "terminal",
		title: "~/ terminal",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, {
			size: S,
			weight: W
		}),
		defaultOpen: true,
		order: 8
	},
	{
		id: "gallery",
		title: "ls ~/gallery",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, {
			size: S,
			weight: W
		}),
		defaultOpen: false,
		order: 9
	},
	{
		id: "resume",
		title: "cat ~/resume.pdf",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$2, {
			size: S,
			weight: W
		}),
		defaultOpen: false,
		order: 10,
		isExternal: true,
		href: {
			en: "/cv-en.pdf",
			fr: "/cv-en.pdf",
			nb: "/cv-nb.pdf",
			nn: "/cv-nb.pdf"
		}
	}
];
var configMap = Object.fromEntries(WINDOW_CONFIGS.map((c) => [c.id, c]));
var BACKGROUND_PRESETS = [
	{
		id: "starfield",
		name: "Starfield",
		type: "animated-dots"
	},
	{
		id: "matrix",
		name: "Matrix",
		type: "matrix"
	},
	{
		id: "grid",
		name: "Grid",
		type: "grid"
	},
	{
		id: "gradient",
		name: "Gradient",
		type: "gradient"
	},
	{
		id: "plain",
		name: "Minimal",
		type: "plain"
	}
];
var LOGO_LINES = [
	"  ╭────────────╮",
	"  │  ████████  │",
	"  │  ██        │",
	"  │  ██████    │",
	"  │  ██        │",
	"  │  ██        │",
	"  ╰──┬─┬──┬─┬──╯",
	"    │ │  │ │    ",
	"    ╵ ╵  ╵ ╵    "
];
function computeUptime() {
	const now = /* @__PURE__ */ new Date();
	let years = now.getFullYear() - BIRTHDAY.getFullYear();
	let months = now.getMonth() - BIRTHDAY.getMonth();
	let days = now.getDate() - BIRTHDAY.getDate();
	if (days < 0) {
		months--;
		const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
		days += prevMonth.getDate();
	}
	if (months < 0) {
		years--;
		months += 12;
	}
	const parts = [];
	if (years > 0) parts.push(`${years}y`);
	if (months > 0) parts.push(`${months}m`);
	parts.push(`${days}d`);
	return parts.join(" ");
}
var LOCALE_NAMES = {
	en: "en_US.UTF-8",
	nb: "nb_NO.UTF-8",
	nn: "nn_NO.UTF-8",
	fr: "fr_FR.UTF-8"
};
function getDefaultInfo(locale, themeName) {
	return [
		{
			label: null,
			value: USER_HOST
		},
		{
			label: null,
			value: "───────────────"
		},
		{
			label: "OS",
			value: `fredrir ${PORTFOLIO_VERSION}`
		},
		{
			label: "Kernel",
			value: `TanStack Start ${START_VERSION}`
		},
		{
			label: "Uptime",
			value: computeUptime()
		},
		{
			label: "Shell",
			value: "zsh 5.9"
		},
		{
			label: "WM",
			value: `Tailwind CSS v${TAILWIND_VERSION}`
		},
		{
			label: "Theme",
			value: themeName ?? "fredrir"
		},
		{
			label: "Packages",
			value: `${WINDOW_CONFIGS.length}`
		},
		{
			label: "Locale",
			value: LOCALE_NAMES[locale ?? "en"] ?? "en_US.UTF-8"
		}
	];
}
var THEME_COLOR_MAP = {
	fredrir: [
		"#ef4444",
		"#f97316",
		"#eab308",
		"#22c55e",
		"#06b6d4",
		"#3b82f6",
		"#a855f7",
		"#ec4899"
	],
	nord: [
		"#bf616a",
		"#d08770",
		"#ebcb8b",
		"#a3be8c",
		"#88c0d0",
		"#5e81ac",
		"#b48ead",
		"#d8dee9"
	],
	"catppuccin-mocha": [
		"#f38ba8",
		"#fab387",
		"#f9e2af",
		"#a6e3a1",
		"#94e2d5",
		"#89b4fa",
		"#cba6f7",
		"#f5c2e7"
	],
	rosepine: [
		"#eb6f92",
		"#ebbcba",
		"#f6c177",
		"#31748f",
		"#9ccfd8",
		"#c4a7e7",
		"#e0def4",
		"#908caa"
	],
	"tokyo-night": [
		"#f7768e",
		"#ff9e64",
		"#e0af68",
		"#9ece6a",
		"#7dcfff",
		"#7aa2f7",
		"#bb9af7",
		"#c0caf5"
	],
	gruvbox: [
		"#fb4934",
		"#fe8019",
		"#fabd2f",
		"#b8bb26",
		"#8ec07c",
		"#83a598",
		"#d3869b",
		"#ebdbb2"
	],
	"solarized-light": [
		"#dc322f",
		"#cb4b16",
		"#b58900",
		"#859900",
		"#2aa198",
		"#268bd2",
		"#6c71c4",
		"#d33682"
	],
	"catppuccin-latte": [
		"#d20f39",
		"#fe640b",
		"#df8e1d",
		"#40a02b",
		"#179299",
		"#1e66f5",
		"#8839ef",
		"#ea76cb"
	],
	"rose-pine-dawn": [
		"#b4637a",
		"#ea9d34",
		"#d7827e",
		"#286983",
		"#56949f",
		"#907aa9",
		"#c4a7e7",
		"#9893a5"
	]
};
var DEFAULT_COLORS = [
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#06b6d4",
	"#3b82f6",
	"#a855f7",
	"#ec4899"
];
function Neofetch({ info, locale, animate = true, hideLogo = false }) {
	const { resolvedTheme } = z();
	const themeName = THEMES.find((t) => t.id === resolvedTheme)?.name ?? resolvedTheme ?? "fredrir";
	const themeColors = THEME_COLOR_MAP[resolvedTheme ?? ""] ?? DEFAULT_COLORS;
	const resolvedInfo = (0, import_react.useMemo)(() => info ?? getDefaultInfo(locale, themeName), [
		info,
		locale,
		themeName
	]);
	const [phase, setPhase] = (0, import_react.useState)(animate ? "logo" : "done");
	const [logoLine, setLogoLine] = (0, import_react.useState)(animate ? 0 : LOGO_LINES.length);
	const [infoChars, setInfoChars] = (0, import_react.useState)(animate ? 0 : Infinity);
	const [colorVisible, setColorVisible] = (0, import_react.useState)(!animate);
	const resolvedInfoRef = import_react.useRef(resolvedInfo);
	resolvedInfoRef.current = resolvedInfo;
	(0, import_react.useEffect)(() => {
		if (!animate) return;
		if (phase === "logo") {
			let line = 0;
			const interval = setInterval(() => {
				line++;
				setLogoLine(line);
				if (line >= LOGO_LINES.length) {
					clearInterval(interval);
					setPhase("info");
				}
			}, 60);
			return () => clearInterval(interval);
		}
		if (phase === "info") {
			const totalChars = resolvedInfoRef.current.reduce((sum, item) => sum + (item.label ? item.label.length + 1 + item.value.length : item.value.length), 0);
			let chars = 0;
			const interval = setInterval(() => {
				chars += 2;
				setInfoChars(chars);
				if (chars >= totalChars) {
					clearInterval(interval);
					setPhase("colors");
				}
			}, 15);
			return () => clearInterval(interval);
		}
		if (phase === "colors") {
			const timeout = setTimeout(() => {
				setColorVisible(true);
				setPhase("done");
			}, 50);
			return () => clearTimeout(timeout);
		}
	}, [animate, phase]);
	const getInfoLineVisibility = (index) => {
		if (phase === "done" || !animate) {
			const item = resolvedInfo[index];
			return {
				visible: true,
				text: item.label ? `${item.label} ${item.value}` : item.value
			};
		}
		if (phase === "logo") return {
			visible: false,
			text: ""
		};
		let charsBefore = 0;
		for (let i = 0; i < index; i++) {
			const item = resolvedInfo[i];
			charsBefore += item.label ? item.label.length + 1 + item.value.length : item.value.length;
		}
		const item = resolvedInfo[index];
		const fullText = item.label ? `${item.label} ${item.value}` : item.value;
		const charsAvailable = Math.max(0, infoChars - charsBefore);
		if (charsAvailable <= 0) return {
			visible: false,
			text: ""
		};
		return {
			visible: true,
			text: fullText.slice(0, charsAvailable)
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3 @[300px]:gap-6 @[500px]:gap-10 items-start @container",
		children: [!hideLogo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children: LOGO_LINES.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-primary leading-[1.2] text-[12px] @[300px]:text-[14px] @[500px]:text-[15px] whitespace-pre transition-opacity duration-150",
				style: {
					opacity: i < logoLine ? i >= 7 ? .4 : 1 : 0,
					textShadow: i < 7 && i < logoLine && i === logoLine - 1 && phase === "logo" ? "0 0 12px hsl(var(--primary) / 0.5)" : i < 7 && i < logoLine ? "0 0 8px hsl(var(--primary) / 0.3)" : "none"
				},
				children: line
			}, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1 space-y-0.5 text-xs",
			children: [
				resolvedInfo.map((item, i) => {
					const { visible, text } = getInfoLineVisibility(i);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "leading-[1.4] transition-opacity duration-150",
						style: { opacity: visible ? 1 : 0 },
						children: item.label ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary font-semibold",
							children: text.slice(0, item.label.length)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: text.slice(item.label.length)
						})] }) : i === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary font-bold",
							children: text
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary-subtle text-[10px]",
							children: text
						})
					}, i);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-[3px] pt-2 transition-opacity duration-300",
					style: { opacity: colorVisible ? 1 : 0 },
					children: themeColors.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-2.5 h-2.5 rounded-sm",
						style: { backgroundColor: c }
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-[3px] pt-[3px] transition-opacity duration-300",
					style: { opacity: colorVisible ? 1 : 0 },
					children: themeColors.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-2.5 h-2.5 rounded-sm brightness-50",
						style: { backgroundColor: c }
					}, i))
				})
			]
		})]
	});
}
function getNeofetchPlainText(extraLines, locale) {
	const infoStrings = (extraLines ?? getDefaultInfo(locale)).map((item) => item.label ? `${item.label.padEnd(10)}${item.value}` : item.value);
	infoStrings.push("");
	infoStrings.push("██ ██ ██ ██ ██ ██ ██ ██");
	const lines = [];
	const maxLines = Math.max(LOGO_LINES.length, infoStrings.length);
	for (let i = 0; i < maxLines; i++) {
		const logoLine = (LOGO_LINES[i] || "").padEnd(22);
		const infoLine = infoStrings[i] || "";
		lines.push(`${logoLine}  ${infoLine}`);
	}
	return lines.join("\n");
}
var RecaptchaContext = (0, import_react.createContext)({ executeRecaptcha: null });
function useRecaptcha() {
	return (0, import_react.useContext)(RecaptchaContext);
}
var SITE_KEY = "";
function RecaptchaProvider({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {}, []);
	const executeRecaptcha = (0, import_react.useCallback)(async (action) => {
		if (!ready || !window.grecaptcha) throw new Error("reCAPTCHA not ready");
		return window.grecaptcha.execute(SITE_KEY, { action });
	}, [ready]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecaptchaContext.Provider, {
		value: { executeRecaptcha: ready ? executeRecaptcha : null },
		children
	});
}
var ACCENT = {
	success: "border-l-green-500",
	error: "border-l-red-500",
	info: "border-l-primary"
};
var PROGRESS_COLOR = {
	success: "bg-green-500/60",
	error: "bg-red-500/60",
	info: "bg-primary-soft"
};
var REACTION = {
	success: "bounce",
	error: "wiggle",
	info: "idle"
};
function NotificationItem({ notification, onDismiss }) {
	const { id, type, message, duration, dismissing } = notification;
	const [entered, setEntered] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		requestAnimationFrame(() => setEntered(true));
	}, []);
	const show = entered && !dismissing;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `pointer-events-auto font-mono text-xs
        flex items-center gap-3
        bg-glass-medium border border-border-medium backdrop-blur-md
        rounded-lg overflow-hidden shadow-lg shadow-wm-shadow-soft
        border-l-[3px] ${ACCENT[type]}
        transition-all duration-300 ease-out
        ${show ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"}
        max-w-80 min-w-64`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-10 h-10 shrink-0 ml-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
					camera: {
						position: [
							0,
							0,
							4.8
						],
						fov: 38
					},
					gl: {
						antialias: true,
						alpha: true
					},
					style: { background: "transparent" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
							position: [
								3,
								4,
								5
							],
							intensity: .7
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarModel, {
							reaction: REACTION[type],
							hovered: false,
							exprIdx: -1
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 py-2 pr-2 min-w-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-readable leading-relaxed break-words",
					children: message
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onDismiss(id),
				className: "text-ghost hover:text-foreground transition-colors pr-3 py-2 self-start",
				children: "x"
			}),
			duration > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-0 left-0 right-0 h-0.5 bg-progress-track",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `h-full ${PROGRESS_COLOR[type]} rounded-full`,
					style: { animation: `notif-progress ${duration}ms linear forwards` }
				})
			})
		]
	});
}
function NotificationContainer({ notifications, onDismiss }) {
	if (notifications.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed top-3 right-3 z-[9999] flex flex-col gap-2 pointer-events-none",
		children: notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationItem, {
			notification: n,
			onDismiss
		}, n.id))
	});
}
var DISMISS_MS = 300;
var DEFAULT_DURATION = {
	success: 4e3,
	error: 6e3,
	info: 8e3
};
var NotificationContext = (0, import_react.createContext)(null);
function useNotification() {
	const ctx = (0, import_react.useContext)(NotificationContext);
	if (!ctx) throw new Error("useNotification must be inside NotificationProvider");
	return ctx;
}
function NotificationProvider({ children }) {
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const counterRef = (0, import_react.useRef)(0);
	const dismiss = (0, import_react.useCallback)((id) => {
		setNotifications((prev) => prev.map((n) => n.id === id ? {
			...n,
			dismissing: true
		} : n));
		setTimeout(() => {
			setNotifications((prev) => prev.filter((n) => n.id !== id));
		}, DISMISS_MS);
	}, []);
	const push = (0, import_react.useCallback)((type, message, options) => {
		const id = `notif-${++counterRef.current}`;
		const duration = options?.duration ?? DEFAULT_DURATION[type];
		const notification = {
			id,
			type,
			message,
			duration,
			createdAt: Date.now(),
			dismissing: false
		};
		setNotifications((prev) => [...prev, notification]);
		if (duration > 0) setTimeout(() => dismiss(id), duration);
		return id;
	}, [dismiss]);
	const api = {
		success: (msg, opts) => push("success", msg, opts),
		error: (msg, opts) => push("error", msg, opts),
		info: (msg, opts) => push("info", msg, opts),
		dismiss
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NotificationContext.Provider, {
		value: api,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationContainer, {
			notifications,
			onDismiss: dismiss
		})]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getPageData = createServerFn().validator((data) => {
	if (!locales.includes(data.locale)) throw new Error(`Unsupported locale: ${data.locale}`);
	return data;
}).handler(createSsrRpc("3e44fc580f25301b5fc81d9c1d8c42d79e34f5a1d9e35f8dc102a5678c4016d2"));
var $$splitComponentImporter = () => import("./_locale-DNfsEKXC.mjs");
var BASE_URL = "https://hansteen.dev";
var localeContent = {
	en: { description: `${MY_NAME}'s personal website` },
	nb: { description: `${MY_NAME}s personlige nettside` },
	nn: { description: `${MY_NAME} si personlege nettside` },
	fr: { description: `Site personnel de ${MY_NAME}` }
};
var Route = createFileRoute("/$locale")({
	loader: async ({ params }) => {
		if (!locales.includes(params.locale)) throw notFound();
		return getPageData({ data: { locale: params.locale } });
	},
	head: ({ loaderData }) => {
		const locale = loaderData?.locale ?? "en";
		const description = localeContent[locale].description;
		return {
			meta: [
				{ title: MY_NAME },
				{
					name: "description",
					content: description
				},
				{
					name: "keywords",
					content: `${MY_NAME}, Hansteen`
				},
				{
					name: "author",
					content: MY_NAME
				},
				{
					name: "creator",
					content: MY_NAME
				},
				{
					name: "publisher",
					content: MY_NAME
				},
				{
					name: "robots",
					content: "index, follow"
				},
				{
					name: "googlebot",
					content: "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
				},
				{
					name: "category",
					content: "portfolio"
				},
				{
					property: "og:title",
					content: MY_NAME
				},
				{
					property: "og:description",
					content: description
				},
				{
					property: "og:url",
					content: BASE_URL
				},
				{
					property: "og:site_name",
					content: MY_NAME
				},
				{
					property: "og:locale",
					content: locale
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					property: "og:image",
					content: `${BASE_URL}/screenshot.png`
				},
				{
					property: "og:image:secure_url",
					content: `${BASE_URL}/screenshot.png`
				},
				{
					property: "og:image:width",
					content: "1099"
				},
				{
					property: "og:image:height",
					content: "599"
				},
				{
					property: "og:image:alt",
					content: MY_NAME
				},
				{
					property: "og:image:type",
					content: "image/png"
				}
			],
			links: [{
				rel: "canonical",
				href: BASE_URL
			}, ...locales.map((l) => ({
				rel: "alternate",
				hrefLang: l,
				href: `${BASE_URL}/${l}`
			}))]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { writeJson as S, readJson as _, RecaptchaProvider as a, useRecaptcha as b, WINDOW_CONFIGS as c, createSsrRpc as d, getDefaultInfo as f, read as g, openExternalWindow as h, NotificationProvider as i, computeUptime as l, isDarkTheme as m, KEYS as n, Route as o, getNeofetchPlainText as p, Neofetch as r, THEMES as s, BACKGROUND_PRESETS as t, configMap as u, remove as v, write as x, useNotification as y };
