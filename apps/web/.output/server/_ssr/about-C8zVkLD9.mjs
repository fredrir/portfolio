import { o as __toESM } from "../_runtime.mjs";
import { T as require_react, _ as o, x as e } from "../_libs/phosphor-icons__react+react.mjs";
import { s as require_jsx_runtime, t as Canvas } from "../_libs/@react-three/fiber+[...].mjs";
import { n as REACTIONS, t as AvatarModel } from "./avatar-model-DdESeywj.mjs";
import { a as MY_PHONE, r as MY_EMAIL } from "./types-C3uRy3ln.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-C8zVkLD9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FredVatar() {
	const [reaction, setReaction] = (0, import_react.useState)("idle");
	const [exprIdx, setExprIdx] = (0, import_react.useState)(-1);
	const [hovered, setHovered] = (0, import_react.useState)(false);
	const clickCount = (0, import_react.useRef)(0);
	const timerRef = (0, import_react.useRef)(void 0);
	const triggerReaction = (0, import_react.useCallback)(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
		const i = clickCount.current % REACTIONS.length;
		clickCount.current++;
		setReaction(REACTIONS[i]);
		setExprIdx(i);
		timerRef.current = setTimeout(() => {
			setReaction("idle");
			setExprIdx(-1);
		}, 1200);
	}, []);
	(0, import_react.useEffect)(() => {
		const scheduleNext = () => {
			return setTimeout(() => {
				triggerReaction();
				intervalRef.current = scheduleNext();
			}, 1e4);
		};
		const intervalRef = { current: scheduleNext() };
		return () => clearTimeout(intervalRef.current);
	}, [triggerReaction]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "cursor-pointer w-38 h-65 @sm:w-35 @sm:h-62.5 @xl:w-45 @xl:h-56.5",
		onClick: triggerReaction,
		onMouseEnter: () => setHovered(true),
		onMouseLeave: () => setHovered(false),
		role: "img",
		"aria-label": "Interactive 3D avatar of Fredrik",
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
					position: [
						-2,
						2,
						3
					],
					intensity: .3,
					color: "#b0c4de"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
					position: [
						0,
						1,
						-2
					],
					intensity: .4,
					color: "#8EC8E8"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarModel, {
					reaction,
					hovered,
					exprIdx
				})
			]
		})
	});
}
function AboutPane({ landing }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 gap-3 h-full flex flex-row items-center overflow-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FredVatar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "inline-flex items-end gap-1.5 mb-2 @xl:mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1.5 h-1.5 bg-overlay-medium border border-border rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-2 bg-overlay-medium border border-border rounded-full" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-glass-heavy border border-border rounded-2xl px-3 py-1.5 @xl:px-4 @xl:py-2 text-sm font-bold text-foreground",
					children: [landing.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: " <Fredrik/>"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-start flex flex-col h-full space-y-1.5 @xl:space-y-2.5 max-w-xs @lg:max-w-sm @xl:max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground text-xs leading-relaxed",
					children: landing.mainText
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pt-1.5 space-y-2 @xl:space-y-2.5 mt-auto text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `mailto:${MY_EMAIL}`,
						className: "flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group/link",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, {
								weight: "bold",
								className: "w-3 h-3 text-primary opacity-60 group-hover/link:opacity-100 transition-opacity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary/70",
								children: "~"
							}),
							MY_EMAIL
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `tel:${MY_PHONE.replace(/\s/g, "")}`,
						className: "flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group/link",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, {
								weight: "bold",
								className: "w-3 h-3 text-primary opacity-60 group-hover/link:opacity-100 transition-opacity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary/70",
								children: "~"
							}),
							MY_PHONE
						]
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { AboutPane };
