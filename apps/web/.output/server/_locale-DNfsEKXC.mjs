import { o as __toESM } from "./_runtime.mjs";
import { C as t, S as e, T as require_react, a, b as s$2, c as p, d as s$3, f as s$4, g as i, h as s$5, i as p$1, l as I, m, n as o$2, o, p as p$2, r as c, s as n, t as m$1, u as n$1, v as s$1, w as o$1, y as s } from "./_libs/phosphor-icons__react+react.mjs";
import { f as useRouter } from "./_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime, t as Canvas } from "./_libs/@react-three/fiber+[...].mjs";
import { n as createServerFn } from "./_ssr/ssr.mjs";
import { t as AvatarModel } from "./_ssr/avatar-model-DdESeywj.mjs";
import { i as MY_NAME, l as USER_HOST, o as PORTFOLIO_VERSION, r as MY_EMAIL } from "./_ssr/types-C3uRy3ln.mjs";
import { n as z } from "./_libs/next-themes.mjs";
import { S as writeJson, _ as readJson, b as useRecaptcha, c as WINDOW_CONFIGS, d as createSsrRpc, g as read, h as openExternalWindow, l as computeUptime, m as isDarkTheme, n as KEYS, o as Route, p as getNeofetchPlainText, r as Neofetch, s as THEMES, t as BACKGROUND_PRESETS, u as configMap, v as remove, x as write, y as useNotification } from "./_locale-t--VXYkr.mjs";
import { t as clsx } from "./_libs/clsx.mjs";
import { t as twMerge } from "./_libs/tailwind-merge.mjs";
import { n as AnimatePresence, t as motion } from "./_libs/framer-motion.mjs";
import { t as tt } from "./_libs/exifr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_locale-DNfsEKXC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STACK_HEIGHTS = {
	"about,spotify": [50, 50],
	"projects,settings": [45, 55]
};
var DEFAULT_LAYOUT = [
	[
		["about", "spotify"],
		"projects",
		"github"
	],
	["journey", "settings"],
	["contact", "terminal"]
];
var MEDIUM_LAYOUT = [[
	["about", "spotify"],
	"projects",
	"github"
], [["journey", "settings"], "contact"]];
var SMALL_LAYOUT = [[["about", "spotify"], ["projects", "settings"]], ["journey", "contact"]];
var DEFAULT_ROW_HEIGHTS = [
	45,
	24,
	31
];
var LAYOUT_TIERS = {
	large: {
		layout: DEFAULT_LAYOUT,
		rowHeights: DEFAULT_ROW_HEIGHTS,
		colWidths: [
			[
				28,
				30,
				42
			],
			[55, 45],
			[45, 55]
		]
	},
	medium: {
		layout: MEDIUM_LAYOUT,
		rowHeights: [55, 45],
		colWidths: [[
			30,
			30,
			40
		], [55, 45]]
	},
	small: {
		layout: SMALL_LAYOUT,
		rowHeights: [50, 50],
		colWidths: [[40, 60], [50, 50]]
	}
};
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Dot({ color, hoverColor, onClick, interactive }) {
	if (!interactive) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("w-3 h-3 rounded-full", color) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: (e) => {
			e.stopPropagation();
			onClick?.();
		},
		onMouseDown: (e) => e.stopPropagation(),
		className: "group p-1.5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("w-3 h-3 rounded-full transition-colors", color, hoverColor && `group-hover:${hoverColor}`) })
	});
}
function TitleDots({ variant, onClose, onMaximize }) {
	if (variant === "static") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3.5 h-3.5 rounded-full bg-wm-close" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3.5 h-3.5 rounded-full bg-wm-minimize" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-3.5 h-3.5 rounded-full bg-wm-maximize" })
		]
	});
	if (variant === "close-only") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-2.5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onClose,
			className: "group",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-4 h-4 rounded-full bg-wm-close group-hover:bg-destructive transition-colors" })
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center -ml-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, {
				color: "bg-wm-close",
				hoverColor: "bg-destructive",
				onClick: onClose,
				interactive: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, {
				color: "bg-wm-minimize",
				hoverColor: "bg-accent-yellow",
				onClick: onClose,
				interactive: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, {
				color: "bg-wm-maximize",
				hoverColor: "bg-primary",
				onClick: onMaximize,
				interactive: true
			})
		]
	});
}
function WindowFrame({ title, trailing, dots = "interactive", className, titleBarClassName, contentClassName, onClose, onMaximize, onTitleBarMouseDown, onTitleBarDoubleClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-xl border backdrop-blur-md overflow-hidden flex flex-col", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex items-center justify-between px-3 py-0.5 border-b border-wm-border bg-surface-faint shrink-0", titleBarClassName),
			onMouseDown: onTitleBarMouseDown,
			onDoubleClick: onTitleBarDoubleClick,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleDots, {
					variant: dots,
					onClose,
					onMaximize
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs truncate mx-2",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-3xs text-primary-subtle",
					children: trailing
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("flex-1 overflow-auto min-h-0", contentClassName),
			children
		})]
	});
}
function Window({ config, isFocused, isSwapTarget, isDragging, showResizeGrip, onClose, onMaximize, onFocus, onTitleMouseDown, onCornerResize, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-pane-id": config.id,
		className: `flex-1 min-w-0 flex flex-col transition-all duration-200 ${isDragging ? "opacity-50 scale-[0.98]" : isSwapTarget ? "scale-[1.01]" : ""}`,
		onMouseDown: onFocus ?? void 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WindowFrame, {
			title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn(isFocused ? "text-primary-bold" : "text-primary-muted"),
				children: config.title
			}),
			onClose,
			onMaximize,
			onTitleBarMouseDown: (e) => {
				if (e.button !== 0 || !onTitleMouseDown) return;
				onTitleMouseDown(config.id, e);
			},
			onTitleBarDoubleClick: onMaximize,
			className: cn("flex-1 min-w-0 bg-glass-light", isDragging ? "border-wm-border-drag" : isSwapTarget ? "border-wm-border-swap ring-2 ring-wm-ring shadow-lg shadow-wm-shadow" : isFocused ? "border-wm-border-focus shadow-lg shadow-wm-shadow" : "border-wm-border shadow-md shadow-wm-shadow-soft"),
			titleBarClassName: "cursor-grab active:cursor-grabbing select-none",
			contentClassName: "@container relative font-mono text-xs",
			children: [children, showResizeGrip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-20 group/grip",
				onMouseDown: (e) => {
					e.stopPropagation();
					onCornerResize?.(e);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 16 16",
					className: "w-full h-full text-primary-subtle group-hover/grip:text-primary-soft transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "14",
							y1: "6",
							x2: "6",
							y2: "14",
							stroke: "currentColor",
							strokeWidth: "1.5",
							strokeLinecap: "round"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "14",
							y1: "10",
							x2: "10",
							y2: "14",
							stroke: "currentColor",
							strokeWidth: "1.5",
							strokeLinecap: "round"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "14",
							y1: "14",
							x2: "14",
							y2: "14",
							stroke: "currentColor",
							strokeWidth: "1.5",
							strokeLinecap: "round"
						})
					]
				})
			})]
		})
	});
}
function TilingPane({ paneId, rowIndex, colIndex }) {
	const { states, focusedId, paneContent, drag, resize, onClose, onMaximize, onFocus } = useTilingContext();
	const config = configMap[paneId];
	if (!config || !states[paneId]?.isOpen) return null;
	const isFocused = focusedId === paneId;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Window, {
		config,
		isFocused,
		isSwapTarget: drag.swapTarget === paneId,
		isDragging: drag.dragTarget === paneId,
		showResizeGrip: isFocused && rowIndex !== void 0 && colIndex !== void 0,
		onClose: () => onClose(paneId),
		onMaximize: () => onMaximize(paneId),
		onFocus: () => onFocus(paneId),
		onTitleMouseDown: drag.startTitleDrag,
		onCornerResize: rowIndex !== void 0 && colIndex !== void 0 ? (e) => resize.startCornerResize(rowIndex, colIndex, e) : void 0,
		children: paneContent[paneId]
	}, paneId);
}
function TilingCell({ cell, rowIndex, colIndex }) {
	const { states } = useTilingContext();
	if (!Array.isArray(cell)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TilingPane, {
		paneId: cell,
		rowIndex,
		colIndex
	});
	const visible = cell.filter((id) => states[id]?.isOpen);
	if (visible.length === 0) return null;
	if (visible.length === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TilingPane, {
		paneId: visible[0],
		rowIndex,
		colIndex
	});
	const heights = STACK_HEIGHTS[cell.join(",")];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex-1 min-w-0 flex flex-col",
		style: { gap: 10 },
		children: visible.map((id) => {
			const h = heights?.[cell.indexOf(id)];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0",
				style: { flex: `${h ?? 1} 0 0%` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TilingPane, {
					paneId: id,
					rowIndex,
					colIndex
				})
			}, id);
		})
	});
}
function TilingGrid({ visibleLayout, rowHeights, colWidths }) {
	const { resize } = useTilingContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: visibleLayout.map((row, ri) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "contents",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex shrink-0",
				style: {
					flex: `${rowHeights[ri] ?? 100 / visibleLayout.length} 0 0%`,
					gap: 0,
					minHeight: 0
				},
				children: row.map((cell, ci) => {
					const w = colWidths[ri]?.[ci] ?? 1;
					const key = Array.isArray(cell) ? cell.join(",") : cell;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "contents",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0 flex min-h-0",
							style: { flex: `${w} 0 0%` },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TilingCell, {
								cell,
								rowIndex: ri,
								colIndex: ci
							})
						}), ci < row.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-2.5 shrink-0 cursor-col-resize relative z-10 group",
							onMouseDown: (e) => resize.startColResize(ri, ci, e),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 rounded-full opacity-0 group-hover:opacity-100 bg-control-border-hover transition-opacity" })
						})]
					}, key);
				})
			}), ri < visibleLayout.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2.5 shrink-0 cursor-row-resize relative z-10 group",
				onMouseDown: (e) => resize.startRowResize(ri, e),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 rounded-full opacity-0 group-hover:opacity-100 bg-control-border-hover transition-opacity" })
			})]
		}, ri);
	}) });
}
var LayoutEngine = class {
	static getTier(width) {
		if (width >= 1280) return "large";
		if (width >= 1024) return "medium";
		return "small";
	}
	static getTierConfig(tier) {
		return LAYOUT_TIERS[tier];
	}
	static getCellPanes(cell) {
		return Array.isArray(cell) ? cell : [cell];
	}
	static findPane(layout, paneId) {
		for (let r = 0; r < layout.length; r++) for (let c = 0; c < layout[r].length; c++) {
			const cell = layout[r][c];
			if (Array.isArray(cell)) {
				const idx = cell.indexOf(paneId);
				if (idx !== -1) return {
					row: r,
					col: c,
					sub: idx
				};
			} else if (cell === paneId) return {
				row: r,
				col: c,
				sub: null
			};
		}
		return null;
	}
	static swapPanes(layout, a, b) {
		const posA = this.findPane(layout, a);
		const posB = this.findPane(layout, b);
		if (!posA || !posB) return layout;
		if (posA.row === posB.row && posA.col === posB.col && posA.sub === posB.sub) return layout;
		const next = this.cloneLayout(layout);
		if (posA.sub !== null) next[posA.row][posA.col][posA.sub] = b;
		else next[posA.row][posA.col] = b;
		if (posB.sub !== null) next[posB.row][posB.col][posB.sub] = a;
		else next[posB.row][posB.col] = a;
		return next;
	}
	static cloneLayout(layout) {
		return layout.map((row) => row.map((cell) => Array.isArray(cell) ? [...cell] : cell));
	}
	static addPaneRow(layout, id, rowHeights, colWidths) {
		const next = this.cloneLayout(layout);
		const share = 25;
		const scaled = rowHeights.map((h) => h * (100 - share) / 100);
		return {
			layout: [...next, [id]],
			rowHeights: [...scaled, share],
			colWidths: [...colWidths, [100]]
		};
	}
	static getVisibleLayout(layout, states) {
		return layout.map((row) => row.filter((cell) => this.getCellPanes(cell).some((id) => states[id]?.isOpen))).filter((row) => row.length > 0);
	}
	static closePanesNotInLayout(states, layout) {
		const layoutPanes = new Set(layout.flat().flatMap((c) => this.getCellPanes(c)));
		const next = { ...states };
		for (const id of Object.keys(next)) if (!layoutPanes.has(id) && next[id].isOpen) next[id] = {
			...next[id],
			isOpen: false
		};
		return next;
	}
};
function useLayoutTier(tiling, setStates) {
	const [layoutTier, setLayoutTier] = (0, import_react.useState)("large");
	(0, import_react.useEffect)(() => {
		const check = () => {
			const tier = LayoutEngine.getTier(window.innerWidth);
			setLayoutTier((prev) => {
				if (prev === tier) return prev;
				const tierConfig = LayoutEngine.getTierConfig(tier);
				tiling.setLayout(LayoutEngine.cloneLayout(tierConfig.layout));
				tiling.setRowHeights([...tierConfig.rowHeights]);
				tiling.setColWidths(tierConfig.colWidths.map((r) => [...r]));
				setStates((prevStates) => LayoutEngine.closePanesNotInLayout(prevStates, tierConfig.layout));
				return tier;
			});
		};
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);
	return layoutTier;
}
function useDrag(tiling) {
	const [dragTarget, setDragTarget] = (0, import_react.useState)(null);
	const [dragPos, setDragPos] = (0, import_react.useState)(null);
	const [dragSize, setDragSize] = (0, import_react.useState)(null);
	const [swapTarget, setSwapTarget] = (0, import_react.useState)(null);
	const swapTargetRef = (0, import_react.useRef)(null);
	return {
		dragTarget,
		dragPos,
		dragSize,
		swapTarget,
		startTitleDrag: (0, import_react.useCallback)((paneId, e) => {
			e.preventDefault();
			const rect = e.target.closest("[data-pane-id]")?.getBoundingClientRect();
			const offsetX = rect ? e.clientX - rect.left : 0;
			const offsetY = rect ? e.clientY - rect.top : 0;
			setDragTarget(paneId);
			setDragPos({
				x: e.clientX - offsetX,
				y: e.clientY - offsetY
			});
			setDragSize(rect ? {
				w: rect.width,
				h: rect.height
			} : {
				w: 300,
				h: 200
			});
			let rafId = null;
			const lastMouse = {
				x: 0,
				y: 0
			};
			const onMouseMove = (ev) => {
				setDragPos({
					x: ev.clientX - offsetX,
					y: ev.clientY - offsetY
				});
				lastMouse.x = ev.clientX;
				lastMouse.y = ev.clientY;
				if (rafId !== null) return;
				rafId = requestAnimationFrame(() => {
					rafId = null;
					const els = document.elementsFromPoint(lastMouse.x, lastMouse.y);
					let targetId = null;
					for (const el of els) {
						const id = el.closest("[data-pane-id]")?.getAttribute("data-pane-id");
						if (id && id !== paneId) {
							targetId = id;
							break;
						}
					}
					swapTargetRef.current = targetId;
					setSwapTarget(targetId);
				});
			};
			const onMouseUp = () => {
				window.removeEventListener("mousemove", onMouseMove);
				window.removeEventListener("mouseup", onMouseUp);
				if (rafId !== null) cancelAnimationFrame(rafId);
				const dropTarget = swapTargetRef.current;
				if (dropTarget && dropTarget !== paneId) {
					tiling.setLayout((prev) => LayoutEngine.swapPanes(prev, paneId, dropTarget));
					tiling.onSwapRef.current?.();
				}
				swapTargetRef.current = null;
				setSwapTarget(null);
				setDragTarget(null);
				setDragPos(null);
				setDragSize(null);
			};
			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
		}, [tiling])
	};
}
function useResize(tiling) {
	return {
		startRowResize: (0, import_react.useCallback)((dividerIndex, e) => {
			e.preventDefault();
			const startY = e.clientY;
			const startHeights = [...tiling.rowHeights];
			const totalHeight = window.innerHeight - 28;
			const onMouseMove = (ev) => {
				const dyPercent = (ev.clientY - startY) / totalHeight * 100;
				const newH = [...startHeights];
				newH[dividerIndex] = Math.max(10, startHeights[dividerIndex] + dyPercent);
				newH[dividerIndex + 1] = Math.max(10, startHeights[dividerIndex + 1] - dyPercent);
				tiling.setRowHeights(newH);
			};
			const onMouseUp = () => {
				window.removeEventListener("mousemove", onMouseMove);
				window.removeEventListener("mouseup", onMouseUp);
				tiling.onResizeRef.current?.();
			};
			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
		}, [tiling]),
		startColResize: (0, import_react.useCallback)((rowIndex, dividerIndex, e) => {
			e.preventDefault();
			const startX = e.clientX;
			const startWidths = tiling.colWidths.map((r) => [...r]);
			const totalWidth = window.innerWidth;
			const onMouseMove = (ev) => {
				const dxPercent = (ev.clientX - startX) / totalWidth * 100;
				const newW = startWidths.map((r) => [...r]);
				if (!newW[rowIndex]) return;
				newW[rowIndex][dividerIndex] = Math.max(10, startWidths[rowIndex][dividerIndex] + dxPercent);
				newW[rowIndex][dividerIndex + 1] = Math.max(10, startWidths[rowIndex][dividerIndex + 1] - dxPercent);
				tiling.setColWidths(newW);
			};
			const onMouseUp = () => {
				window.removeEventListener("mousemove", onMouseMove);
				window.removeEventListener("mouseup", onMouseUp);
				tiling.onResizeRef.current?.();
			};
			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
		}, [tiling]),
		startCornerResize: (0, import_react.useCallback)((rowIndex, colIndex, e) => {
			e.preventDefault();
			const startX = e.clientX;
			const startY = e.clientY;
			const startHeights = [...tiling.rowHeights];
			const startWidths = tiling.colWidths.map((r) => [...r]);
			const totalHeight = window.innerHeight - 28;
			const totalWidth = window.innerWidth;
			const onMouseMove = (ev) => {
				const dyPercent = (ev.clientY - startY) / totalHeight * 100;
				const newH = [...startHeights];
				if (rowIndex < startHeights.length - 1) {
					newH[rowIndex] = Math.max(10, startHeights[rowIndex] + dyPercent);
					newH[rowIndex + 1] = Math.max(10, startHeights[rowIndex + 1] - dyPercent);
					tiling.setRowHeights(newH);
				}
				const dxPercent = (ev.clientX - startX) / totalWidth * 100;
				const newW = startWidths.map((r) => [...r]);
				if (newW[rowIndex] && colIndex < newW[rowIndex].length - 1) {
					newW[rowIndex][colIndex] = Math.max(10, startWidths[rowIndex][colIndex] + dxPercent);
					newW[rowIndex][colIndex + 1] = Math.max(10, startWidths[rowIndex][colIndex + 1] - dxPercent);
					tiling.setColWidths(newW);
				}
			};
			const onMouseUp = () => {
				window.removeEventListener("mousemove", onMouseMove);
				window.removeEventListener("mouseup", onMouseUp);
				tiling.onResizeRef.current?.();
			};
			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
		}, [tiling])
	};
}
function getInitialStates(allClosed) {
	const states = {};
	const savedPanes = allClosed ? null : readJson(KEYS.openPanes);
	WINDOW_CONFIGS.forEach((config) => {
		const isOpen = allClosed ? false : savedPanes ? savedPanes.includes(config.id) : config.defaultOpen;
		states[config.id] = {
			isOpen,
			isMaximized: false,
			zIndex: config.order
		};
	});
	return states;
}
function useTiling(initialAllClosed = false) {
	const [states, setStates] = (0, import_react.useState)(() => getInitialStates(initialAllClosed));
	const [layout, setLayout] = (0, import_react.useState)(() => LayoutEngine.cloneLayout(LAYOUT_TIERS[LayoutEngine.getTier(typeof window !== "undefined" ? window.innerWidth : 1280)].layout));
	const [rowHeights, setRowHeights] = (0, import_react.useState)(() => {
		return readJson(KEYS.rowHeights) ?? [...DEFAULT_ROW_HEIGHTS];
	});
	const [colWidths, setColWidths] = (0, import_react.useState)(() => {
		return readJson(KEYS.colWidths) ?? LAYOUT_TIERS[LayoutEngine.getTier(typeof window !== "undefined" ? window.innerWidth : 1280)].colWidths.map((r) => [...r]);
	});
	const [launcherOpen, setLauncherOpen] = (0, import_react.useState)(false);
	const [maximizedId, setMaximizedId] = (0, import_react.useState)(null);
	const maxZRef = (0, import_react.useRef)(100);
	const onSwapRef = (0, import_react.useRef)(null);
	const onResizeRef = (0, import_react.useRef)(null);
	const tilingState = (0, import_react.useMemo)(() => ({
		layout,
		rowHeights,
		colWidths,
		setLayout,
		setRowHeights,
		setColWidths,
		onSwapRef,
		onResizeRef
	}), [
		layout,
		rowHeights,
		colWidths
	]);
	const layoutTier = useLayoutTier(tilingState, setStates);
	const drag = useDrag(tilingState);
	const resize = useResize(tilingState);
	const openWindow = (0, import_react.useCallback)((id) => {
		setStates((prev) => ({
			...prev,
			[id]: {
				...prev[id] || {
					isOpen: false,
					isMaximized: false,
					zIndex: 0
				},
				isOpen: true
			}
		}));
		setLayout((prev) => {
			if (prev.flat().flatMap((c) => LayoutEngine.getCellPanes(c)).includes(id)) return prev;
			const result = LayoutEngine.addPaneRow(prev, id, rowHeights, colWidths);
			setRowHeights(result.rowHeights);
			setColWidths(result.colWidths);
			return result.layout;
		});
	}, [rowHeights, colWidths]);
	const closeWindow = (0, import_react.useCallback)((id) => {
		setStates((prev) => ({
			...prev,
			[id]: {
				...prev[id],
				isOpen: false
			}
		}));
		if (maximizedId === id) setMaximizedId(null);
	}, [maximizedId]);
	const setOpenPanes = (0, import_react.useCallback)((ids) => {
		const openSet = new Set(ids);
		setStates((prev) => {
			const next = { ...prev };
			for (const id of Object.keys(next)) {
				const shouldBeOpen = openSet.has(id);
				if (next[id].isOpen !== shouldBeOpen) next[id] = {
					...next[id],
					isOpen: shouldBeOpen
				};
			}
			return next;
		});
	}, []);
	const toggleMaximize = (0, import_react.useCallback)((id) => {
		setMaximizedId((prev) => prev === id ? null : id);
	}, []);
	const focusWindow = (0, import_react.useCallback)((id) => {
		maxZRef.current++;
		setStates((prev) => ({
			...prev,
			[id]: {
				...prev[id],
				zIndex: maxZRef.current
			}
		}));
	}, []);
	(0, import_react.useEffect)(() => {
		const onKeyDown = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "k") {
				e.preventDefault();
				setLauncherOpen((prev) => !prev);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);
	(0, import_react.useEffect)(() => {
		const openIds = Object.entries(states).filter(([, s]) => s.isOpen).map(([id]) => id);
		writeJson(KEYS.openPanes, openIds);
		writeJson(KEYS.rowHeights, rowHeights);
		writeJson(KEYS.colWidths, colWidths);
	}, [
		states,
		rowHeights,
		colWidths
	]);
	return {
		states,
		visibleLayout: LayoutEngine.getVisibleLayout(layout, states),
		rowHeights,
		colWidths,
		layoutTier,
		maximizedId,
		launcherOpen,
		setLauncherOpen,
		openWindow,
		closeWindow,
		setOpenPanes,
		toggleMaximize,
		focusWindow,
		onSwapRef,
		onResizeRef,
		drag,
		resize
	};
}
var TilingContext = (0, import_react.createContext)(null);
function useTilingContext() {
	const ctx = (0, import_react.useContext)(TilingContext);
	if (!ctx) throw new Error("useTilingContext must be used within TilingProvider");
	return ctx;
}
function TilingProvider({ value, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TilingContext.Provider, {
		value,
		children
	});
}
function useBackground() {
	const [current, setCurrent] = (0, import_react.useState)(BACKGROUND_PRESETS[0]);
	const [pickerOpen, setPickerOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const parsed = readJson(KEYS.background);
		if (parsed) {
			if (parsed.type === "custom-image") {
				const img = read(KEYS.backgroundImage);
				if (img) parsed.value = img;
			}
			setCurrent(parsed);
		}
	}, []);
	return {
		current,
		setBackground: (0, import_react.useCallback)((config) => {
			setCurrent(config);
			if (config.type === "custom-image" && config.value) {
				write(KEYS.backgroundImage, config.value);
				writeJson(KEYS.background, {
					...config,
					value: void 0
				});
			} else {
				remove(KEYS.backgroundImage);
				writeJson(KEYS.background, config);
			}
		}, []),
		pickerOpen,
		setPickerOpen
	};
}
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);
	return isMobile;
}
var TUTORIAL_STEPS = [
	{ id: "welcome" },
	{ id: "theme" },
	{ id: "wallpaper" },
	{
		id: "pane-selection",
		desktopOnly: true
	},
	{
		id: "launcher",
		desktopOnly: true
	},
	{
		id: "drag",
		desktopOnly: true
	},
	{
		id: "resize",
		desktopOnly: true
	},
	{ id: "done" }
];
function peekSavedState() {
	return readJson(KEYS.tutorialState, true);
}
function shouldShowTutorial() {
	return !read(KEYS.tutorialCompleted);
}
function getDefaultChoices(locale) {
	return {
		locale,
		theme: "fredrir",
		wallpaper: "starfield",
		openPanes: []
	};
}
function useTutorial(locale) {
	const isMobile = useIsMobile() === true;
	const [isActive, setIsActive] = (0, import_react.useState)(() => {
		if (peekSavedState()) return true;
		return shouldShowTutorial();
	});
	const [stepIndex, setStepIndex] = (0, import_react.useState)(() => {
		return peekSavedState()?.stepIndex ?? 0;
	});
	const [choices, setChoices] = (0, import_react.useState)(() => {
		return peekSavedState()?.choices ?? getDefaultChoices(locale);
	});
	(0, import_react.useEffect)(() => {
		remove(KEYS.tutorialState, true);
	}, []);
	(0, import_react.useEffect)(() => {}, [locale]);
	const steps = (0, import_react.useMemo)(() => isMobile ? TUTORIAL_STEPS.filter((s) => !s.desktopOnly) : TUTORIAL_STEPS, [isMobile]);
	const step = steps[stepIndex];
	const setChoice = (0, import_react.useCallback)((key, value) => {
		setChoices((prev) => ({
			...prev,
			[key]: value
		}));
	}, []);
	const next = (0, import_react.useCallback)(() => {
		setStepIndex((i) => Math.min(i + 1, steps.length - 1));
	}, [steps.length]);
	const back = (0, import_react.useCallback)(() => {
		setStepIndex((i) => Math.max(i - 1, 0));
	}, []);
	const complete = (0, import_react.useCallback)(() => {
		setIsActive(false);
		write(KEYS.tutorialCompleted, "1");
		writeJson(KEYS.openPanes, choices.openPanes);
	}, [choices.openPanes]);
	const skip = (0, import_react.useCallback)(() => {
		setIsActive(false);
		write(KEYS.tutorialCompleted, "1");
	}, []);
	const restart = (0, import_react.useCallback)(() => {
		remove(KEYS.tutorialCompleted);
		remove(KEYS.openPanes);
		window.location.reload();
	}, []);
	const saveStateForNavigation = (0, import_react.useCallback)((nextStepIndex) => {
		writeJson(KEYS.tutorialState, {
			stepIndex: nextStepIndex,
			choices
		}, true);
	}, [choices]);
	return {
		isActive,
		step,
		stepIndex,
		totalSteps: steps.length,
		choices,
		next,
		back,
		skip,
		complete,
		restart,
		setChoice,
		saveStateForNavigation
	};
}
function useTutorialSync(tutorial, wm) {
	const openPanesKey = tutorial.choices.openPanes.join(",");
	(0, import_react.useEffect)(() => {
		if (!tutorial.isActive || !tutorial.step) return;
		if (tutorial.step.id === "pane-selection") wm.setOpenPanes(tutorial.choices.openPanes);
	}, [
		tutorial.isActive,
		tutorial.step?.id,
		openPanesKey
	]);
	(0, import_react.useEffect)(() => {
		if (!tutorial.isActive || !tutorial.step) return;
		if (tutorial.step.id === "drag") {
			wm.onSwapRef.current = tutorial.next;
			return () => {
				wm.onSwapRef.current = null;
			};
		}
		if (tutorial.step.id === "resize") {
			wm.onResizeRef.current = tutorial.next;
			return () => {
				wm.onResizeRef.current = null;
			};
		}
	}, [
		tutorial.isActive,
		tutorial.step,
		tutorial.next,
		wm
	]);
}
function Image({ src, alt, fill, priority, unoptimized: _unoptimized, className, loading, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		loading: loading ?? (priority ? "eager" : "lazy"),
		decoding: "async",
		className: fill ? cn("absolute inset-0 h-full w-full", className) : className,
		...rest
	});
}
function JourneyDetailPane({ journey }) {
	const { resolvedTheme } = z();
	const [src, setSrc] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setSrc(isDarkTheme(resolvedTheme) ? journey.darkModeImageUri : journey.lightModeImageUri);
	}, [
		resolvedTheme,
		journey.darkModeImageUri,
		journey.lightModeImageUri
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "h-full flex flex-col overflow-auto text-sm p-5 space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4 items-start",
				children: [src && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative shrink-0 w-16 h-16 rounded-md overflow-hidden bg-background border border-border-faint flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
						src,
						alt: journey.company,
						width: 400,
						height: 400,
						className: "object-contain p-1 w-14 h-14"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col min-w-0 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold text-primary leading-tight",
							children: journey.jobTitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-base text-foreground",
							children: journey.company
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-date-accent tracking-wide",
							children: journey.date
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-border-faint" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted-foreground",
					children: journey.description
				})
			})
		]
	});
}
function MobileScreensShowcase({ images }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center items-end gap-3 py-3 px-2",
		children: images.map((src, i) => {
			const isCenter = i === Math.floor(images.length / 2);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `relative transition-transform ${isCenter ? "z-10 scale-105" : "z-0 opacity-80"}`,
				style: { transform: isCenter ? "scale(1.05)" : i < Math.floor(images.length / 2) ? "rotate(-3deg) translateY(4px)" : "rotate(3deg) translateY(4px)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-[100px] rounded-xl border-2 border-border-medium bg-black overflow-hidden shadow-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full h-1.5 bg-black flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-6 h-0.5 rounded-full bg-border-medium" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
							src,
							alt: "",
							width: 200,
							height: 400,
							className: "w-full h-auto"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full h-1 bg-black" })
					]
				})
			}, src);
		})
	});
}
function LaptopShowcase({ src, alt }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center py-3 px-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-[340px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-t-lg border border-b-0 border-border-medium bg-black overflow-hidden shadow-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 px-2.5 py-1 bg-surface-dim border-b border-border-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1.5 h-1.5 rounded-full bg-terminal-close" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1.5 h-1.5 rounded-full bg-terminal-minimize" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1.5 h-1.5 rounded-full bg-terminal-maximize" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
						src,
						alt,
						width: 600,
						height: 340,
						className: "w-full h-auto"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2.5 bg-border-medium rounded-b-sm mx-auto",
					style: {
						width: "108%",
						marginLeft: "-4%"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1 bg-border-medium/60 rounded-b-md mx-auto",
					style: { width: "40%" }
				})
			]
		})
	});
}
function ProjectDetailPane({ project, viewCode, ui }) {
	const isMobileApp = project.mobileImages && project.mobileImages.length > 0;
	const thumb = !isMobileApp ? project.desktopImage : null;
	const langs = project.languages.split(",").map((l) => l.trim());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-full flex flex-col overflow-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 p-4 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold text-foreground tracking-tight",
					children: project.title
				}) }),
				isMobileApp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileScreensShowcase, { images: project.mobileImages }),
				thumb && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LaptopShowcase, {
					src: thumb,
					alt: project.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary font-bold text-base lg:text-lg uppercase tracking-wider",
						children: ui.about
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-border-faint" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground leading-relaxed text-sm",
					children: project.description
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary font-bold text-base lg:text-lg uppercase tracking-wider",
						children: ui.techStack
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-border-faint" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: langs.map((lang, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2.5 py-1 rounded-md text-xs border border-border-medium bg-surface-dim text-primary font-medium",
						children: lang
					}, i))
				})] }),
				(project.websiteLink || project.githubLink) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary font-bold text-xs uppercase tracking-wider",
						children: ui.links
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-border-faint" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [project.websiteLink && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: project.websiteLink,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "flex items-center gap-2 px-3 py-2 rounded-md border border-wm-border hover:border-control-border-hover hover:bg-control-hover transition-all group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary-muted group-hover:text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(e, { className: "group-hover:fill-primary h-4 w-4 fill-primary" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground group-hover:text-primary transition-colors text-xs",
							children: project.websiteAlias || project.websiteLink.replace(/https?:\/\//, "").replace(/\/$/, "")
						})]
					}), project.githubLink && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: project.githubLink,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "flex items-center gap-2 px-3 py-2 rounded-md border border-wm-border hover:border-control-border-hover hover:bg-control-hover transition-all group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(t, { className: "group-hover:fill-primary w-4 h-4 fill-primary" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-hover group-hover:text-primary transition-colors text-xs",
							children: viewCode
						})]
					})]
				})] })
			]
		})
	});
}
function useFloatingDetail(dict) {
	const [detail, setDetail] = (0, import_react.useState)(null);
	return {
		detail,
		openJourneyDetail: (0, import_react.useCallback)((j) => {
			setDetail({
				title: `${j.company} — ${j.jobTitle}`,
				content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JourneyDetailPane, { journey: j })
			});
		}, []),
		openProjectDetail: (0, import_react.useCallback)((p) => {
			setDetail({
				title: `~/projects/${p.title}`,
				content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectDetailPane, {
					project: p,
					viewCode: dict.project.viewCode,
					ui: dict.ui
				})
			});
		}, [dict.project.viewCode, dict.ui]),
		close: (0, import_react.useCallback)(() => setDetail(null), [])
	};
}
function useMobileApp() {
	const [activeApp, _setActiveApp] = (0, import_react.useState)(() => read(KEYS.mobileActiveApp, true));
	const setActiveApp = (0, import_react.useCallback)((app) => {
		_setActiveApp(app);
		if (app) write(KEYS.mobileActiveApp, app, true);
		else remove(KEYS.mobileActiveApp, true);
	}, []);
	return {
		activeApp,
		setActiveApp,
		goHome: (0, import_react.useCallback)(() => setActiveApp(null), [setActiveApp])
	};
}
function useFocus(wm) {
	const [focusedId, setFocusedId] = (0, import_react.useState)("about");
	const focus = (0, import_react.useCallback)((id) => {
		if (!wm.states[id]?.isOpen) wm.openWindow(id);
		setFocusedId(id);
		wm.focusWindow(id);
	}, [wm]);
	const openPane = (0, import_react.useCallback)((id) => {
		wm.openWindow(id);
		setFocusedId(id);
	}, [wm]);
	return {
		focusedId,
		focus,
		openPane,
		openSettings: (0, import_react.useCallback)(() => {
			openPane("settings");
		}, [openPane])
	};
}
function TutorialFredVatar({ reaction, className }) {
	const [hovered, setHovered] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("w-20 h-50 md:w-40 md:h-60 shrink-0", className),
		onMouseEnter: () => setHovered(true),
		onMouseLeave: () => setHovered(false),
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
					exprIdx: -1
				})
			]
		})
	});
}
function SpeechBubble({ children, isFloating = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative bg-glass-heavy backdrop-blur-xl border border-border-medium rounded-xl shadow-lg shadow-wm-shadow-soft", isFloating ? "" : "sm:min-w-lg lg:min-w-xl"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-2 right-8 w-4 h-4 bg-glass-heavy border-b border-r border-border-medium rotate-45 -z-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10",
			children
		})]
	});
}
function ProgressDots({ current, total }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-1.5",
		children: Array.from({ length: total }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `transition-all duration-300 rounded-full ${i === current ? "w-5 h-2 bg-primary" : i < current ? "w-2 h-2 bg-primary-muted" : "w-2 h-2 bg-primary-hint"}` }, i))
	});
}
var languages = [
	{
		code: "en",
		name: "English",
		flag: "🇬🇧"
	},
	{
		code: "fr",
		name: "Français",
		flag: "🇫🇷"
	},
	{
		code: "nb",
		name: "Norsk (Bokmål)",
		flag: "🇳🇴"
	},
	{
		code: "nn",
		name: "Norsk (Nynorsk)",
		flag: "🇳🇴"
	}
];
function StepLayout({ command, title, body, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-primary-hint flex items-center px-4 md:px-6 border-b w-full justify-start py-1 gap-1.5 mb-3 font-mono text-xs text-faded",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-primary",
			children: "$"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: command })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "px-4 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-bold text-primary mb-1",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-readable mb-4",
				children: body
			}),
			children
		]
	})] });
}
function StepWelcome({ t, currentLocale, onSelectLocale, onSaveState }) {
	const router = useRouter();
	const [, startTransition] = (0, import_react.useTransition)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLayout, {
		command: "locale-gen",
		title: t.welcomeTitle,
		body: t.welcomeBody,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2",
			children: languages.map((lang) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						if (lang.code !== currentLocale) {
							onSelectLocale(lang.code);
							onSaveState(0);
							startTransition(() => {
								router.navigate({
									to: "/$locale",
									params: { locale: lang.code },
									replace: true
								});
							});
						}
					},
					className: `flex flex-col xs:flex-row items-center gap-2 px-3 py-2 rounded-lg border text-xs sm:text-sm transition-all ${lang.code === currentLocale ? "border-primary bg-control-active text-primary" : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-base sm:text-lg",
						children: lang.flag
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang.name })]
				}, lang.code);
			})
		})
	});
}
function ThemeSwatch({ colors }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-0.5 shrink-0",
		children: colors.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-2 h-2 rounded-full border border-white/10",
			style: { background: c }
		}, i))
	});
}
function StepTheme({ t, onSelectTheme }) {
	const { theme, setTheme } = z();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLayout, {
		command: "hyprctl colorscheme",
		title: t.themeTitle,
		body: t.themeBody,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-3 gap-1.5",
			children: THEMES.map((th) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					setTheme(th.id);
					onSelectTheme(th.id);
				},
				className: `flex items-center gap-1.5 px-2 py-2 md:py-4 rounded-md border text-xs transition-all ${theme === th.id ? "border-primary bg-control-active text-primary" : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSwatch, { colors: th.colors }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: th.name
				})]
			}, th.id))
		})
	});
}
function StarfieldPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 16",
		className: "w-full h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "24",
				height: "16",
				className: "fill-background"
			}),
			[
				{
					cx: 4,
					cy: 3,
					r: .8
				},
				{
					cx: 12,
					cy: 6,
					r: 1
				},
				{
					cx: 8,
					cy: 10,
					r: .6
				},
				{
					cx: 18,
					cy: 4,
					r: .7
				},
				{
					cx: 15,
					cy: 12,
					r: .9
				},
				{
					cx: 6,
					cy: 14,
					r: .5
				},
				{
					cx: 20,
					cy: 9,
					r: .6
				},
				{
					cx: 10,
					cy: 2,
					r: .7
				}
			].map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: d.cx,
				cy: d.cy,
				r: d.r,
				className: "fill-chart-fill"
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "4",
				y1: "3",
				x2: "12",
				y2: "6",
				className: "stroke-wm-border",
				strokeWidth: "0.3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "12",
				y1: "6",
				x2: "18",
				y2: "4",
				className: "stroke-wm-border",
				strokeWidth: "0.3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "8",
				y1: "10",
				x2: "15",
				y2: "12",
				className: "stroke-wm-border",
				strokeWidth: "0.3"
			})
		]
	});
}
function MatrixPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 16",
		className: "w-full h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "24",
			height: "16",
			className: "fill-background"
		}), [
			{
				x: 3,
				chars: "ア1ウ",
				y: 2
			},
			{
				x: 8,
				chars: "0キ3",
				y: 5
			},
			{
				x: 13,
				chars: "セ7ノ",
				y: 1
			},
			{
				x: 18,
				chars: "2ヲ4",
				y: 4
			}
		].map((col, i) => col.chars.split("").map((ch, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: col.x,
			y: col.y + j * 4,
			fontSize: "3",
			className: "fill-primary-subtle",
			fontFamily: "monospace",
			textAnchor: "middle",
			children: ch
		}, `${i}-${j}`)))]
	});
}
function GridPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 16",
		className: "w-full h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "24",
				height: "16",
				className: "fill-background"
			}),
			[
				4,
				8,
				12,
				16,
				20
			].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: x,
				y1: "0",
				x2: x,
				y2: "16",
				className: "stroke-surface-soft",
				strokeWidth: "0.3"
			}, `v${x}`)),
			[
				4,
				8,
				12
			].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "0",
				y1: y,
				x2: "24",
				y2: y,
				className: "stroke-surface-soft",
				strokeWidth: "0.3"
			}, `h${y}`))
		]
	});
}
function GradientPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 16",
		className: "w-full h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
				id: "gp",
				cx: "50%",
				cy: "0%",
				r: "80%",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					className: "[stop-color:var(--color-primary)]",
					stopOpacity: "0.2"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: "transparent",
					stopOpacity: "0"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "24",
				height: "16",
				className: "fill-background"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "24",
				height: "16",
				fill: "url(#gp)"
			})
		]
	});
}
function PlainPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 16",
		className: "w-full h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
				id: "pp",
				cx: "50%",
				cy: "50%",
				r: "50%",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					className: "[stop-color:var(--color-primary)]",
					stopOpacity: "0.05"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: "transparent",
					stopOpacity: "0"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "24",
				height: "16",
				className: "fill-background"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "24",
				height: "16",
				fill: "url(#pp)"
			})
		]
	});
}
function BackgroundPreview({ config }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full aspect-[3/2] rounded-sm overflow-hidden border border-control-border",
		children: [
			config.type === "animated-dots" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarfieldPreview, {}),
			config.type === "matrix" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatrixPreview, {}),
			config.type === "grid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridPreview, {}),
			config.type === "gradient" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradientPreview, {}),
			config.type === "plain" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlainPreview, {})
		]
	});
}
function StepWallpaper({ t, ui, currentBackground, onSelectBackground, onSelectWallpaper }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLayout, {
		command: "hyprpaper set",
		title: t.wallpaperTitle,
		body: t.wallpaperBody,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-3 gap-2",
			children: BACKGROUND_PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					onSelectBackground(preset);
					onSelectWallpaper(preset.id);
				},
				className: `flex flex-col items-center gap-1 p-1.5 rounded-md border text-xs transition-all ${currentBackground.id === preset.id ? "border-primary bg-control-active text-primary" : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackgroundPreview, { config: preset }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ui.backgrounds[preset.id] ?? preset.name })]
			}, preset.id))
		})
	});
}
var selectableConfigs = WINDOW_CONFIGS.filter((c) => !c.isExternal);
function StepPaneSelection({ t, ui, selectedPanes, onTogglePane }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLayout, {
		command: "hyprctl dispatch",
		title: t.paneSelectionTitle,
		body: t.paneSelectionBody,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-3 gap-3",
			children: selectableConfigs.map((config) => {
				const isSelected = selectedPanes.includes(config.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onTogglePane(config.id),
					className: `flex flex-col items-start gap-0.5 p-2 rounded-lg border text-left transition-all ${isSelected ? "border-primary bg-control-active" : "border-control-border hover:border-control-border-hover hover:bg-control-hover"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center md:mb-2 gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: isSelected ? "text-primary" : "text-primary-soft",
							children: config.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-xs md:text-sm font-medium truncate ${isSelected ? "text-primary" : "text-primary-soft"}`,
							children: ui.localeTitles[config.id]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-faded line-clamp-2",
						children: t.paneDescriptions[config.id] ?? ""
					})]
				}, config.id);
			})
		})
	});
}
function StepLauncher({ t }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLayout, {
		command: "bind = SUPER, K, exec, walker",
		title: t.launcherTitle,
		body: t.launcherBody,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-xs text-faded",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-2 h-2 rounded-full bg-primary animate-pulse" }), t.launcherWaiting]
		})
	});
}
function StepDrag({ t }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLayout, {
		command: "hyprctl movewindow",
		title: t.dragTitle,
		body: t.dragBody,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-xs text-faded",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-2 h-2 rounded-full bg-primary animate-pulse" }), t.dragWaiting]
		})
	});
}
function StepResize({ t }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLayout, {
		command: "hyprctl resizewindow",
		title: t.resizeTitle,
		body: t.resizeBody,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-xs text-faded",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-2 h-2 rounded-full bg-primary animate-pulse" }), t.resizeWaiting]
		})
	});
}
function StepDone({ t, onComplete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold text-primary mb-1",
			children: t.doneTitle
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-readable mb-4",
			children: t.doneBody
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onComplete,
			className: "w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity",
			children: t.startExploring
		})
	] });
}
var interactiveSteps = /* @__PURE__ */ new Set([
	"launcher",
	"drag",
	"resize",
	"done"
]);
function getReaction(stepId) {
	switch (stepId) {
		case "welcome": return "wave";
		case "done": return "thumbsup";
		default: return "idle";
	}
}
function TutorialOverlay({ t, ui, currentLocale, tutorial, floating, isMobile, launcherOpen, background }) {
	const stepId = tutorial.step.id;
	const { stepIndex, totalSteps, choices } = tutorial;
	const prevLauncherRef = (0, import_react.useRef)(launcherOpen);
	(0, import_react.useEffect)(() => {
		if (stepId === "launcher" && !prevLauncherRef.current && launcherOpen) {
			const timer = setTimeout(tutorial.next, 600);
			return () => clearTimeout(timer);
		}
		prevLauncherRef.current = launcherOpen;
	}, [
		stepId,
		launcherOpen,
		tutorial.next
	]);
	(0, import_react.useEffect)(() => {
		if ((stepId === "drag" || stepId === "resize") && choices.openPanes.length < 2) tutorial.next();
	}, [
		stepId,
		choices.openPanes.length,
		tutorial.next
	]);
	const showNav = !interactiveSteps.has(stepId);
	const canAdvance = stepId !== "pane-selection" || choices.openPanes.length > 0;
	const handleTogglePane = (id) => {
		const current = choices.openPanes;
		const next = current.includes(id) ? current.filter((p) => p !== id) : [...current, id];
		tutorial.setChoice("openPanes", next);
	};
	const renderStep = () => {
		switch (stepId) {
			case "welcome": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepWelcome, {
				t,
				currentLocale,
				onSelectLocale: (loc) => tutorial.setChoice("locale", loc),
				onSaveState: tutorial.saveStateForNavigation
			});
			case "theme": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepTheme, {
				t,
				onSelectTheme: (id) => tutorial.setChoice("theme", id)
			});
			case "wallpaper": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepWallpaper, {
				t,
				ui,
				currentBackground: background.current,
				onSelectBackground: background.setBackground,
				onSelectWallpaper: (id) => tutorial.setChoice("wallpaper", id)
			});
			case "pane-selection": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepPaneSelection, {
				t,
				ui,
				selectedPanes: choices.openPanes,
				onTogglePane: handleTogglePane
			});
			case "launcher": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepLauncher, { t });
			case "drag": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepDrag, { t });
			case "resize": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepResize, { t });
			case "done": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepDone, {
				t,
				onComplete: tutorial.complete
			});
			default: return null;
		}
	};
	const floatingPositions = [
		"top-8 right-4",
		"bottom-12 left-4",
		"top-8 left-4",
		"bottom-12 right-4"
	];
	const posClass = floatingPositions[stepIndex % floatingPositions.length];
	if (floating) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		className: `fixed ${posClass} z-9995 flex items-end gap-3 max-w-md`,
		initial: {
			opacity: 0,
			scale: .95
		},
		animate: {
			opacity: 1,
			scale: 1
		},
		transition: {
			duration: .35,
			ease: "easeOut"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpeechBubble, {
					isFloating: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
							mode: "wait",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: {
									opacity: 0,
									x: 20
								},
								animate: {
									opacity: 1,
									x: 0
								},
								exit: {
									opacity: 0,
									x: -20
								},
								transition: { duration: .2 },
								children: renderStep()
							}, stepId)
						}),
						showNav && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mt-3 pt-3 border-t border-border-faint",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressDots, {
								current: stepIndex,
								total: totalSteps
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [stepIndex > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: tutorial.back,
									className: "px-3 py-1 text-xs rounded-md border border-control-border text-muted-foreground hover:bg-control-hover transition-colors",
									children: t.back
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: tutorial.next,
									disabled: !canAdvance,
									className: "px-3 py-1 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed",
									children: t.next
								})]
							})]
						}),
						!showNav && stepId !== "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex p-4 md:p-6 items-center justify-between mt-3 pt-3 border-t border-border-faint",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressDots, {
								current: stepIndex,
								total: totalSteps
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialFredVatar, { reaction: getReaction(stepId) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: tutorial.skip,
				className: "absolute -top-8 right-0 text-xs text-faded hover:text-foreground transition-colors",
				children: t.skip
			})
		]
	}, stepIndex);
	if (stepId === "done") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-9995 flex items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-overlay-medium" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			className: "relative z-10 flex flex-col items-center gap-4",
			initial: {
				opacity: 0,
				scale: .9
			},
			animate: {
				opacity: 1,
				scale: 1
			},
			transition: { duration: .3 },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialFredVatar, {
					reaction: "thumbsup",
					className: "w-48 h-64 md:w-64 md:h-80"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl md:text-3xl font-bold text-primary",
					children: t.doneTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: tutorial.complete,
					className: "px-8 py-3 rounded-xl border border-primary-soft text-primary font-semibold text-base hover:text-primary hover:border-primary",
					children: t.startExploring
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-9995 flex items-center justify-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-overlay-medium" }),
			isMobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-0 right-4 z-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialFredVatar, { reaction: getReaction(stepId) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex items-end gap-4 max-w-lg w-full mx-4 mb-28 md:mb-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SpeechBubble, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						mode: "wait",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								x: 20
							},
							animate: {
								opacity: 1,
								x: 0
							},
							exit: {
								opacity: 0,
								x: -20
							},
							transition: { duration: .2 },
							children: renderStep()
						}, stepId)
					}), showNav && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex p-4 md:p-6 items-center justify-between mt-4 pt-3 border-t border-border-faint",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressDots, {
							current: stepIndex,
							total: totalSteps
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [stepIndex > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: tutorial.back,
								className: "px-3 py-1.5 text-xs rounded-md border border-control-border text-muted-foreground hover:bg-control-hover transition-colors",
								children: t.back
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: tutorial.next,
								disabled: !canAdvance,
								className: "px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed",
								children: t.next
							})]
						})]
					})] })
				}), !isMobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialFredVatar, { reaction: getReaction(stepId) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: tutorial.skip,
				className: "absolute top-4 right-4 text-sm text-faded hover:text-foreground transition-colors z-20",
				children: t.skip
			})
		]
	});
}
function AppLauncher({ states, ui, locale, onOpen, onStop, onClose }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [selectedIdx, setSelectedIdx] = (0, import_react.useState)(0);
	const inputRef = (0, import_react.useRef)(null);
	const listRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		inputRef.current?.focus();
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.toLowerCase();
		return WINDOW_CONFIGS.filter((c) => c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || (ui.shortTitles[c.id] ?? c.id).toLowerCase().includes(q));
	}, [query, ui.shortTitles]);
	(0, import_react.useEffect)(() => {
		setSelectedIdx(0);
	}, [query]);
	const handleSelect = (0, import_react.useCallback)((id) => {
		const config = WINDOW_CONFIGS.find((c) => c.id === id);
		if (config?.isExternal && config.href) {
			openExternalWindow(config, locale);
			onClose();
			return;
		}
		onOpen(id);
		onClose();
	}, [
		onOpen,
		onClose,
		locale
	]);
	const handleKeyDown = (0, import_react.useCallback)((e) => {
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
				break;
			case "ArrowUp":
				e.preventDefault();
				setSelectedIdx((i) => Math.max(i - 1, 0));
				break;
			case "Enter":
				e.preventDefault();
				if (filtered[selectedIdx]) handleSelect(filtered[selectedIdx].id);
				break;
			case "Escape":
				e.preventDefault();
				onClose();
				break;
		}
	}, [
		filtered,
		selectedIdx,
		handleSelect,
		onClose
	]);
	(0, import_react.useEffect)(() => {
		(listRef.current?.children[selectedIdx])?.scrollIntoView({ block: "nearest" });
	}, [selectedIdx]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[10000] flex items-start justify-center pt-[18vh] bg-overlay-heavy backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg rounded-xl border border-border-medium bg-glass-heavy backdrop-blur-md shadow-2xl shadow-wm-shadow overflow-hidden font-mono",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 px-4 py-3 border-b border-wm-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary text-sm",
							children: "walker"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: inputRef,
							type: "text",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							onKeyDown: handleKeyDown,
							className: "flex-1 bg-transparent text-foreground text-sm outline-hidden placeholder:text-placeholder",
							placeholder: ui.searchApps,
							autoComplete: "off"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-ghost text-2xs",
							children: "ctrl+k"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: listRef,
					className: "max-h-80 overflow-y-auto",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-6 text-center text-subtle text-sm",
						children: ui.noMatching
					}) : filtered.map((config, i) => {
						const isOpen = states[config.id]?.isOpen;
						const isSelected = i === selectedIdx;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onMouseEnter: () => setSelectedIdx(i),
							className: `w-full flex items-center justify-between px-4 py-2.5 transition-colors group ${isSelected ? "bg-control-active" : "hover:bg-control-hover"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleSelect(config.id),
								className: "flex items-center gap-3 flex-1 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary-soft w-5 text-center text-sm",
									children: config.icon || "·"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-sm transition-colors ${isSelected ? "text-primary" : "text-foreground"}`,
									children: config.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xs text-ghost ml-2",
									children: ui.shortTitles[config.id] ?? config.id
								})] })]
							}), config.isExternal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xs px-1.5 py-0.5 rounded bg-launcher-bg text-primary",
								children: "↗"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: (e) => {
									e.stopPropagation();
									if (isOpen) onStop(config.id);
									else handleSelect(config.id);
								},
								className: `text-2xs px-1.5 py-0.5 rounded transition-colors ${isOpen ? "bg-badge-stop text-red-400 hover:bg-badge-stop-hover" : "bg-launcher-bg text-primary hover:bg-launcher-hover"}`,
								children: isOpen ? ui.stop : ui.start
							})]
						}, config.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-2 border-t border-border-faint text-2xs text-ghost flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary-dim",
							children: "↑↓"
						}),
						" ",
						ui.navigate,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary-dim ml-3",
							children: "Enter"
						}),
						" ",
						ui.open,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary-dim ml-3",
							children: "Esc"
						}),
						" ",
						ui.close
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						filtered.length,
						" ",
						ui.apps
					] })]
				})
			]
		})
	});
}
function FloatingDetail({ title, onClose, children }) {
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[10000] flex items-center justify-center bg-overlay-medium backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-2",
			onClick: (e) => e.stopPropagation(),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WindowFrame, {
				title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden md:flex text-primary-subtle",
					children: title
				}),
				trailing: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-primary-subtle",
					children: USER_HOST
				}),
				dots: "close-only",
				onClose,
				className: "w-full max-w-lg max-h-[80vh] border-wm-border-drag bg-glass-heavy shadow-2xl shadow-wm-shadow font-mono",
				titleBarClassName: "px-4 py-2",
				children
			})
		})
	});
}
function DragGhost({ config, pos, size, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed z-9990 pointer-events-none",
		style: {
			left: pos.x,
			top: pos.y,
			width: size.w,
			height: size.h,
			opacity: .85
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WindowFrame, {
			title: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-faded",
				children: config.title
			}),
			dots: "static",
			className: "h-full border-chart-fill bg-glass-faint shadow-2xl shadow-surface-selected",
			titleBarClassName: "py-1.5 bg-surface-dim",
			contentClassName: "opacity-40 overflow-hidden",
			children
		})
	});
}
var GITHUB_ASCII = [
	"        ▄██████▄        ",
	"      ▄████████████▄    ",
	"    ██████████████████   ",
	"   ████████████████████  ",
	"  █████ ▀██████▀ ██████ ",
	"  ██████          ██████ ",
	"  █████            █████ ",
	"  █████            █████ ",
	"  █████            █████ ",
	"  ██████          ██████ ",
	"   ████████    █████████ ",
	"   ███ ██████  █████████  ",
	"    ███  ████  █████████ ",
	"     ████      ████████  ",
	"       █████  ███████    ",
	"         ███  █████      "
];
var LANG_ICONS = {
	TypeScript: {
		icon: "TS",
		color: "text-blue-400"
	},
	JavaScript: {
		icon: "JS",
		color: "text-yellow-400"
	},
	Python: {
		icon: "PY",
		color: "text-blue-300"
	},
	Java: {
		icon: "JV",
		color: "text-orange-400"
	},
	Kotlin: {
		icon: "KT",
		color: "text-purple-400"
	},
	Go: {
		icon: "GO",
		color: "text-cyan-400"
	},
	Rust: {
		icon: "RS",
		color: "text-orange-300"
	},
	C: {
		icon: "C ",
		color: "text-blue-500"
	},
	"C++": {
		icon: "++",
		color: "text-blue-400"
	},
	"C#": {
		icon: "C#",
		color: "text-green-400"
	},
	Ruby: {
		icon: "RB",
		color: "text-red-400"
	},
	PHP: {
		icon: "HP",
		color: "text-indigo-300"
	},
	Swift: {
		icon: "SW",
		color: "text-orange-400"
	},
	Shell: {
		icon: "SH",
		color: "text-green-300"
	},
	Lua: {
		icon: "LU",
		color: "text-blue-600"
	},
	Dart: {
		icon: "DT",
		color: "text-cyan-300"
	},
	HTML: {
		icon: "<>",
		color: "text-orange-500"
	},
	CSS: {
		icon: "# ",
		color: "text-blue-500"
	},
	Vue: {
		icon: "VU",
		color: "text-green-500"
	},
	Svelte: {
		icon: "SV",
		color: "text-orange-600"
	}
};
var CONTRIBUTION_LEVEL_CHARS = [
	"·",
	"░",
	"▒",
	"▓",
	"█"
];
var CONTRIBUTION_LEVEL_COLORS = [
	"text-contrib-0",
	"text-contrib-1",
	"text-contrib-2",
	"text-contrib-3",
	"text-contrib-4"
];
var MS_PER_DAY = 1440 * 60 * 1e3;
var GLITCH_CHARS = "░▒▓█▀▄▌▐─│┤├┴┬┼╭╮╰╯";
var WAVE_COLORS = [
	"rgba(var(--color-primary), 0.15)",
	"rgba(var(--color-primary), 0.3)",
	"rgba(var(--color-primary), 0.5)",
	"rgba(var(--color-primary), 0.7)",
	"rgba(var(--color-primary), 0.9)",
	"rgba(var(--color-primary), 1)",
	"rgba(var(--color-primary), 0.9)",
	"rgba(var(--color-primary), 0.7)",
	"rgba(var(--color-primary), 0.5)",
	"rgba(var(--color-primary), 0.3)"
];
function AnimatedAscii() {
	const canvasRef = (0, import_react.useRef)(null);
	const wrapperRef = (0, import_react.useRef)(null);
	const frameRef = (0, import_react.useRef)(0);
	const scaleRef = (0, import_react.useRef)(1);
	const glitchRef = (0, import_react.useRef)([]);
	const draw = (0, import_react.useCallback)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const dpr = window.devicePixelRatio || 1;
		const charW = 7.2 * dpr;
		const charH = 11 * dpr;
		const maxCols = Math.max(...GITHUB_ASCII.map((l) => l.length));
		const rows = GITHUB_ASCII.length;
		const w = Math.ceil(maxCols * charW);
		const h = Math.ceil(rows * charH);
		if (canvas.width !== w || canvas.height !== h) {
			canvas.width = w;
			canvas.height = h;
			canvas.style.width = `${w / dpr}px`;
			canvas.style.height = `${h / dpr}px`;
		}
		ctx.clearRect(0, 0, w, h);
		ctx.font = `${11 * dpr}px ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace`;
		ctx.textBaseline = "top";
		const frame = frameRef.current;
		const wavePos = frame * .6 % (maxCols + WAVE_COLORS.length);
		if (Math.random() < .08) {
			const row = Math.floor(Math.random() * rows);
			const line = GITHUB_ASCII[row];
			const solidCols = [];
			for (let c = 0; c < line.length; c++) if (line[c] !== " ") solidCols.push(c);
			if (solidCols.length > 0) {
				const col = solidCols[Math.floor(Math.random() * solidCols.length)];
				glitchRef.current.push({
					row,
					col,
					char: GLITCH_CHARS[Math.floor(Math.random() * 19)],
					ttl: 3 + Math.floor(Math.random() * 6)
				});
			}
		}
		const glitchMap = /* @__PURE__ */ new Map();
		glitchRef.current = glitchRef.current.filter((g) => {
			g.ttl--;
			if (g.ttl <= 0) return false;
			glitchMap.set(`${g.row},${g.col}`, g.char);
			return true;
		});
		const primaryColor = getComputedStyle(canvas).color;
		for (let row = 0; row < rows; row++) {
			const line = GITHUB_ASCII[row];
			for (let col = 0; col < line.length; col++) {
				const ch = line[col];
				if (ch === " ") continue;
				const glitchChar = glitchMap.get(`${row},${col}`);
				const displayChar = glitchChar || ch;
				const dist = col - (wavePos - WAVE_COLORS.length);
				let alpha;
				if (dist >= 0 && dist < WAVE_COLORS.length) alpha = [
					.15,
					.3,
					.5,
					.7,
					.9,
					1,
					.9,
					.7,
					.5,
					.3
				][Math.floor(dist)];
				else alpha = .35 + .1 * Math.sin(frame * .03 + row * .5 + col * .2);
				if (glitchChar) alpha = .9 + Math.random() * .1;
				ctx.globalAlpha = alpha;
				ctx.fillStyle = primaryColor;
				ctx.fillText(displayChar, col * charW, row * charH);
			}
		}
		ctx.globalAlpha = 1;
		frameRef.current++;
	}, []);
	(0, import_react.useEffect)(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) return;
		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				const baseW = Math.ceil(Math.max(...GITHUB_ASCII.map((l) => l.length)) * 7.2);
				const baseH = Math.ceil(GITHUB_ASCII.length * 11);
				const scaleW = width / baseW;
				const scaleH = height / baseH;
				scaleRef.current = Math.min(scaleW, scaleH, 1.5);
				if (canvasRef.current) canvasRef.current.style.transform = `scale(${scaleRef.current})`;
			}
		});
		ro.observe(wrapper);
		return () => ro.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		let raf;
		let lastTime = 0;
		const interval = 1500 / 24;
		const loop = (time) => {
			raf = requestAnimationFrame(loop);
			if (time - lastTime < interval) return;
			lastTime = time;
			draw();
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [draw]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: wrapperRef,
		className: "flex items-center justify-center overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "text-primary origin-center",
			style: { imageRendering: "pixelated" }
		})
	});
}
function useContainerSize() {
	const ref = (0, import_react.useRef)(null);
	const [width, setWidth] = (0, import_react.useState)(0);
	const [height, setHeight] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setWidth(entry.contentRect.width);
				setHeight(entry.contentRect.height);
			}
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);
	return {
		ref,
		width,
		height
	};
}
function TypedLine({ children, delay = 0, className }) {
	const [visible, setVisible] = (0, import_react.useState)(delay === 0);
	(0, import_react.useEffect)(() => {
		if (delay === 0) return;
		const timer = setTimeout(() => setVisible(true), delay);
		return () => clearTimeout(timer);
	}, [delay]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `transition-all duration-300 ${className}`,
		style: {
			opacity: visible ? 1 : 0,
			transform: visible ? "translateY(0)" : "translateY(0.25rem)"
		},
		children
	});
}
function LangIcon({ lang }) {
	const info = LANG_ICONS[lang];
	if (!info) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-muted-foreground font-bold text-2xs w-4 inline-block",
		children: lang.slice(0, 2).toUpperCase()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `${info.color} font-bold text-2xs w-4 inline-block`,
		children: info.icon
	});
}
function BarChart({ items, maxCount }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-0.5 mt-1 w-full",
		children: items.map(({ lang, count }) => {
			const pct = Math.max(5, Math.round(count / maxCount * 100));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangIcon, { lang }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground w-14 @xs:w-20 shrink-0 truncate",
						children: lang
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 h-3 bg-chart-track rounded-sm overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-chart-fill rounded-sm transition-all duration-500",
							style: { width: `${pct}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-readable shrink-0 w-6 text-right",
						children: count
					})
				]
			}, lang);
		})
	});
}
function ContributionGraph({ contributions, total, selectedYear, years, onYearChange, lastYearLabel = "Last year", contributionsLabel = "contributions" }) {
	const weeks = Array.from({ length: 53 }, () => Array(7).fill(null));
	contributions.forEach((day) => {
		const dow = (/* @__PURE__ */ new Date(day.date + "T00:00:00")).getDay();
		const daysSinceStart = Math.floor(((/* @__PURE__ */ new Date(day.date + "T00:00:00")).getTime() - (/* @__PURE__ */ new Date(contributions[0].date + "T00:00:00")).getTime()) / MS_PER_DAY);
		const weekIdx = Math.floor(daysSinceStart / 7);
		if (weekIdx >= 0 && weekIdx < 53) weeks[weekIdx][dow] = day;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-primary font-semibold text-2xs",
				children: [
					total.toLocaleString(),
					" ",
					contributionsLabel
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 flex-wrap justify-end",
				children: years.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onYearChange(y),
					className: `text-2xs px-1.5 py-0.5 rounded transition-colors ${selectedYear === y ? "bg-surface-selected text-primary" : "text-subtle hover:text-muted-hover"}`,
					children: y === "last" ? lastYearLabel : y
				}, y))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full overflow-y-hidden overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid w-full font-mono leading-none",
				style: { gridTemplateColumns: "repeat(53, 1fr)" },
				children: weeks.map((week, wi) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col",
					children: week.map((day, di) => {
						const level = day?.level ?? 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `${CONTRIBUTION_LEVEL_COLORS[level]} text-3xs @lg:text-xs select-none text-center`,
							title: day ? `${day.count} ${contributionsLabel} on ${day.date}` : void 0,
							children: CONTRIBUTION_LEVEL_CHARS[level]
						}, di);
					})
				}, wi))
			})
		})]
	});
}
function GitHubPane({ initialData, ui }) {
	const [selectedYear, setSelectedYear] = (0, import_react.useState)("last");
	const { ref: containerRef, width, height } = useContainerSize();
	const compact = height > 0 && (height < 250 || width < 300);
	const data = initialData;
	const currentContributions = data?.contributionsByYear.find((c) => c.year === selectedYear);
	const years = data?.contributionsByYear.map((c) => c.year) ?? [];
	const maxLangCount = data ? Math.max(...data.topLanguages.map((l) => l.count)) : 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-2 @sm:p-3 leading-relaxed h-full overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: containerRef,
			className: "h-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `flex flex-col ${compact ? "gap-2" : "gap-4"}`,
				children: !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-red-400",
					children: ui.githubApiError
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex ${compact ? "gap-3" : "gap-4 @sm:gap-6"} flex-col @sm:flex-row`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedAscii, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 space-y-0.5 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypedLine, {
									delay: 80,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: data.profileUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "text-primary font-bold hover:underline",
										children: [data.username, "@github"]
									})
								}),
								!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypedLine, {
									delay: 140,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary-subtle text-xs",
										children: "─────────────────────"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `grid gap-x-4 gap-y-0.5 ${compact ? "grid-cols-3 @xs:grid-cols-5" : "grid-cols-2 @sm:grid-cols-1"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TypedLine, {
											delay: 200,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary font-semibold",
												children: ui.githubRepos
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [" ", data.publicRepos]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TypedLine, {
											delay: 260,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary font-semibold",
												children: ui.githubStars
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [" ", data.totalStars]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TypedLine, {
											delay: 320,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary font-semibold",
												children: ui.githubFollowers
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [" ", data.followers]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TypedLine, {
											delay: 380,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary font-semibold",
												children: ui.githubFollowing
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [" ", data.following]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TypedLine, {
											delay: 440,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary font-semibold",
												children: ui.githubSince
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [" ", new Date(data.createdAt).getFullYear()]
											})]
										})
									]
								})
							]
						})]
					}),
					data.topLanguages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypedLine, {
						delay: 500,
						className: "w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `w-full ${compact ? "" : "mt-2 pt-1 border-t border-border-faint"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarChart, {
								items: data.topLanguages,
								maxCount: maxLangCount
							})
						})
					}),
					!compact && currentContributions && currentContributions.days.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypedLine, {
						delay: 600,
						className: "w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 pt-2 w-full border-t border-border-faint",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContributionGraph, {
								contributions: currentContributions.days,
								total: currentContributions.total,
								selectedYear,
								years,
								onYearChange: setSelectedYear,
								lastYearLabel: ui.lastYear,
								contributionsLabel: ui.githubContributions
							})
						})
					})
				] })
			})
		})
	});
}
var CAVA_CHARS = [
	"▁",
	"▂",
	"▃",
	"▅",
	"▆",
	"█"
];
var SPOTIFY_POLL_INTERVAL = 30 * 1e3;
var SPOTIFY_ASCII = [
	" ╭──────────────╮",
	" │  ╭────────╮  │",
	" │  │ ♫ ♪ ♫  │  │",
	" │  ╰────────╯  │",
	" │ ▶ ━━━━━━━━━  │",
	" ╰──────────────╯"
];
function CavaVisualizer() {
	const [bars, setBars] = (0, import_react.useState)(Array(32).fill(2));
	(0, import_react.useEffect)(() => {
		const interval = setInterval(() => {
			setBars(Array(32).fill(0).map(() => Math.floor(Math.random() * 6) + 1));
		}, 180);
		return () => clearInterval(interval);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-end h-5 font-mono w-full",
		children: bars.map((level, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-primary-soft flex-1 text-center",
			style: { transition: "all 150ms ease" },
			children: CAVA_CHARS[Math.min(level - 1, CAVA_CHARS.length - 1)]
		}, i))
	});
}
function TopArtists({ artists }) {
	if (artists.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: artists.map((artist, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 py-0.5",
		children: [
			artist.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
				src: artist.imageUrl,
				alt: artist.name,
				width: 20,
				height: 20,
				className: "w-5 h-5 rounded-full border border-border-faint object-cover",
				unoptimized: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-0 flex-1",
				children: artist.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: artist.url,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "text-foreground hover:text-primary hover:underline transition-colors text-xs truncate block",
					children: artist.name
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-foreground text-xs truncate block",
					children: artist.name
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-primary-dim w-3 text-right text-xs",
				children: i + 1
			})
		]
	}, `${artist.name}-${i}`)) });
}
function RecentTracks({ tracks }) {
	if (tracks.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: tracks.map((track, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 py-0.5",
		children: [
			track.albumArt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
				src: track.albumArt,
				alt: track.album,
				width: 20,
				height: 20,
				className: "w-5 h-5 rounded border border-border-faint object-cover",
				unoptimized: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-0 flex-1",
				children: track.songUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: track.songUrl,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "text-foreground hover:text-primary hover:underline transition-colors text-xs truncate block",
					children: track.title
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-foreground text-xs truncate block",
					children: track.title
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-ghost text-3xs truncate max-w-20 hidden @xs:inline",
				children: track.artist
			})
		]
	}, `${track.title}-${i}`)) });
}
var getSpotifyData = createServerFn({ method: "POST" }).validator((captchaToken) => captchaToken).handler(createSsrRpc("78c5e5b135f5a975719c39a24fa44a123bc6c1bb09c3d5c3041b661294590208"));
var UNITS = {
	en: {
		s: "s ago",
		m: "m ago",
		h: "h ago",
		d: "d ago",
		mo: "mo ago"
	},
	nb: {
		s: "s siden",
		m: "m siden",
		h: "t siden",
		d: "d siden",
		mo: "mnd siden"
	},
	nn: {
		s: "s sidan",
		m: "m sidan",
		h: "t sidan",
		d: "d sidan",
		mo: "mnd sidan"
	},
	fr: {
		s: "s",
		m: "min",
		h: "h",
		d: "j",
		mo: "mois"
	}
};
function relativeTime(isoDate, locale = "en") {
	const diff = Date.now() - new Date(isoDate).getTime();
	const u = UNITS[locale] ?? UNITS.en;
	const seconds = Math.floor(diff / 1e3);
	if (seconds < 60) return `${seconds}${u.s}`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}${u.m}`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}${u.h}`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `${days}${u.d}`;
	return `${Math.floor(days / 30)}${u.mo}`;
}
function formatTime(ms) {
	const s = Math.floor(ms / 1e3);
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
function SpotifyEmbed({ trackId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
		src: `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`,
		width: "100%",
		height: "80",
		allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
		loading: "lazy",
		className: "rounded-md border border-border-faint",
		title: "Spotify player"
	});
}
var NowPlaying = ({ displayData, ui, compact, locale }) => {
	const [showEmbed, setShowEmbed] = (0, import_react.useState)(false);
	const lpLabel = ui?.lastPlayed ?? "LAST PLAYED";
	const lastPlayedLabel = !displayData?.isPlaying && displayData?.lastPlayedAt ? `${lpLabel} ${relativeTime(displayData.lastPlayedAt, locale)}` : lpLabel;
	const progressPct = displayData?.progressMs && displayData?.durationMs ? Math.round(displayData.progressMs / displayData.durationMs * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3 @sm:gap-4 items-start",
		children: [!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0 block",
			children: displayData.albumArt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
				src: displayData.albumArt,
				alt: displayData.album ?? "Album art",
				width: 64,
				height: 64,
				className: "w-16 h-16 rounded border border-border-medium opacity-80",
				unoptimized: true
			}) : SPOTIFY_ASCII.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-green-400/60 whitespace-pre text-xs leading-tight block",
				children: line
			}, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 text-xs  space-y-0.5 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary font-semibold",
						children: displayData.isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(a, { className: "h-3 w-3 fill-primary-muted" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o, { className: "h-3 w-3 fill-primary-muted" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-faded",
						children: displayData.isPlaying ? ui?.nowPlaying ?? "NOW PLAYING" : lastPlayedLabel
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary font-semibold",
						children: ui?.track ?? "Track"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: " "
					}),
					displayData.songUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: displayData.songUrl,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "text-foreground hover:text-primary hover:underline transition-colors",
						children: displayData.title
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: displayData.title
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary font-semibold",
					children: ui?.artist ?? "Artist"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground",
					children: [" ", displayData.artist]
				})] }),
				!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary font-semibold",
					children: ui?.album ?? "Album"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground",
					children: [" ", displayData.album]
				})] }),
				displayData.isPlaying && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex pt-1 items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-faded text-xs w-8",
							children: formatTime(displayData.progressMs ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 flex items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full bg-progress-track h-1 rounded-full ",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-progress-fill rounded-full transition-all duration-1000",
									style: { width: `${progressPct}%` }
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-faded text-xs w-8 text-right",
							children: formatTime(displayData.durationMs ?? 0)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShowEmbed((prev) => !prev),
					className: "text-xs mt-1  text-primary-soft hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-1 rounded border border-wm-border hover:border-control-border-hover hover:bg-control-hover",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(a, { className: "h-2 w-2 fill-primary-soft" }), ui?.playInBrowser ?? "play in browser"]
				})
			]
		})]
	}), showEmbed && displayData.trackId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotifyEmbed, { trackId: displayData.trackId })] });
};
var SpotifyCard = ({ title, command, className, compact, children }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("py-2 @sm:py-3", compact ? "space-y-1.5" : "space-y-3"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex-1 overflow-y-auto min-h-0", className),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-faded mb-2 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: "$"
					}),
					" ",
					command,
					title
				]
			}), children]
		})
	});
};
function SpotifyPane({ initialData, ui, locale = "en" }) {
	const [data, setData] = (0, import_react.useState)(initialData);
	const audioRef = (0, import_react.useRef)(null);
	const lastKnownRef = (0, import_react.useRef)(initialData);
	const { ref: containerRef, height } = useContainerSize();
	const compact = height > 0 && height < 200;
	const { executeRecaptcha } = useRecaptcha();
	(0, import_react.useEffect)(() => {
		if (data?.title) lastKnownRef.current = data;
		if (audioRef.current && data?.previewUrl !== audioRef.current.src) {
			audioRef.current.pause();
			audioRef.current = null;
		}
	}, [data]);
	const fetchSpotify = (0, import_react.useCallback)(async () => {
		try {
			if (!executeRecaptcha) {
				console.error("reCAPTCHA not available");
				return;
			}
			const d = await getSpotifyData({ data: await executeRecaptcha("spotify_data") });
			if (d?.title) setData(d);
			else if (lastKnownRef.current?.title) setData({
				...lastKnownRef.current,
				isPlaying: false,
				progressMs: void 0,
				durationMs: void 0,
				topArtists: d?.topArtists ?? lastKnownRef.current.topArtists,
				recentTracks: d?.recentTracks ?? lastKnownRef.current.recentTracks
			});
			else setData(d);
		} catch {
			if (lastKnownRef.current?.title) setData({
				...lastKnownRef.current,
				isPlaying: false,
				progressMs: void 0,
				durationMs: void 0
			});
		}
	}, [executeRecaptcha]);
	(0, import_react.useEffect)(() => {
		const interval = setInterval(fetchSpotify, SPOTIFY_POLL_INTERVAL);
		return () => clearInterval(interval);
	}, [fetchSpotify]);
	const displayData = data?.ok === false && lastKnownRef.current?.title ? {
		...lastKnownRef.current,
		isPlaying: false,
		progressMs: void 0,
		durationMs: void 0
	} : data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-2 @sm:px-3 leading-relaxed h-full overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: containerRef,
			className: "h-full flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto min-h-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotifyCard, {
						title: "/proc/spotify/recently-played",
						command: "cat ",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NowPlaying, {
							displayData,
							ui,
							locale,
							compact
						})
					}),
					displayData.topArtists && displayData.topArtists.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotifyCard, {
						title: "/proc/spotify/top-artists",
						command: "cat",
						className: "border-t border-border-faint pt-2 @sm:pt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopArtists, { artists: displayData.topArtists })
					}),
					displayData.recentTracks && displayData.recentTracks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotifyCard, {
						title: "/var/log/spotify/history",
						command: "tail",
						className: "border-t border-border-faint pt-2 @sm:pt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentTracks, { tracks: displayData.recentTracks })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 mt-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CavaVisualizer, {})
			})]
		})
	});
}
function CompanyLogo({ journey }) {
	const { resolvedTheme } = z();
	const [src, setSrc] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setSrc(isDarkTheme(resolvedTheme) ? journey.darkModeImageUri : journey.lightModeImageUri);
	}, [
		resolvedTheme,
		journey.darkModeImageUri,
		journey.lightModeImageUri
	]);
	if (!src) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "shrink-0 w-10 h-10 rounded-md overflow-hidden bg-background border border-border-faint flex items-center justify-center p-1",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
			src,
			alt: journey.company,
			width: 75,
			height: 75,
			className: "object-contain w-8 h-8"
		})
	});
}
var ListView = ({ numberOfItems, uiEntries, uiClickToOpen, children }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-2 @sm:p-3 h-full flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-y-auto space-y-0.5 min-h-0",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pt-2 mt-1 border-t border-border-faint text-ghost text-2xs flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				numberOfItems,
				" ",
				uiEntries
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-primary-subtle",
				children: uiClickToOpen
			})]
		})]
	});
};
function isCustomVisual(v) {
	return "custom" in v;
}
var ListItem = ({ visual, title, subtitle, onClick, badge }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: "w-full text-left flex items-center gap-2 @sm:gap-3 py-1 @sm:py-1.5 px-1.5 @sm:px-2 rounded-md hover:bg-control-hover transition-colors group",
		children: [
			visual && (isCustomVisual(visual) ? visual.custom : visual.imageSrc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 w-10 h-7 @sm:w-12 @sm:h-8 @lg:w-16 @lg:h-11 rounded-md overflow-hidden border border-control-border bg-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
					src: visual.imageSrc,
					alt: title,
					width: 96,
					height: 64,
					className: "object-cover w-full h-full"
				})
			})),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary font-semibold truncate block group-hover:underline text-2xs @sm:text-xs",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-0.5",
					children: subtitle
				})]
			}),
			badge,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$1, { className: "text-primary-hint group-hover:text-primary-muted transition-colors shrink-0 transtion-transform duration-300 group-hover:translate-x-0.5 -group-hover:translate-y-0.5 -rotate-45" })
		]
	});
};
function JourneySubtitle({ j }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-foreground/80 text-3xs @sm:text-2xs",
			children: j.company
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-ghost text-3xs @sm:text-2xs",
			children: " • "
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-date-accent text-3xs @sm:text-2xs",
			children: j.date
		})
	] });
}
function JourneyPane({ journey, onOpenDetail, ui }) {
	const sorted = [...journey.journeys].sort((a, b) => {
		if (a.isCurrent && !b.isCurrent) return -1;
		if (!a.isCurrent && b.isCurrent) return 1;
		return 0;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListView, {
		numberOfItems: journey.journeys.length,
		uiEntries: ui.entries,
		uiClickToOpen: ui.clickToOpen,
		children: sorted.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListItem, {
			visual: { custom: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyLogo, { journey: j }) },
			title: j.jobTitle,
			subtitle: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JourneySubtitle, { j }),
			onClick: () => onOpenDetail(j),
			badge: j.isCurrent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-primary-muted text-3xs @sm:text-2xs px-1 @sm:px-1.5 py-0.5 rounded bg-surface-soft shrink-0",
				children: ui.active
			}) : void 0
		}, j.id))
	});
}
function formatLanguages(languages) {
	const langs = languages.split(",").slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1",
		children: langs.map((lang, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-3xs @sm:text-2xs text-faded",
			children: [lang.trim(), i < langs.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-primary-hint ml-1",
				children: "·"
			})]
		}, i))
	});
}
function ProjectsPane({ projects, onOpenDetail, ui }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListView, {
		numberOfItems: projects.length,
		uiEntries: ui.projects,
		uiClickToOpen: ui.clickToOpen,
		children: projects.map((project) => {
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListItem, {
				visual: { imageSrc: project.desktopImage || project.mobileImages && project.mobileImages[0] || void 0 },
				title: project.title,
				subtitle: formatLanguages(project.languages),
				onClick: () => onOpenDetail(project)
			}, project.id);
		})
	});
}
var sendContactForm = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("e5413d5cb26ba03b30c3f6fcc21d266268fd90af35bf0750ed51c1646b09aec6"));
function delay(ms) {
	return new Promise((r) => setTimeout(r, ms));
}
function genQueueId() {
	const chars = "0123456789ABCDEF";
	let id = "";
	for (let i = 0; i < 10; i++) id += chars[Math.floor(Math.random() * 16)];
	return id;
}
function useVimMode(containerRef, isSending, callbacks) {
	const [vimMode, setVimMode] = (0, import_react.useState)("normal");
	const [cmdBuffer, setCmdBuffer] = (0, import_react.useState)("");
	const [showCmd, setShowCmd] = (0, import_react.useState)(false);
	const vimModeRef = (0, import_react.useRef)(vimMode);
	const showCmdRef = (0, import_react.useRef)(showCmd);
	const cmdBufferRef = (0, import_react.useRef)(cmdBuffer);
	const isSendingRef = (0, import_react.useRef)(isSending);
	vimModeRef.current = vimMode;
	showCmdRef.current = showCmd;
	cmdBufferRef.current = cmdBuffer;
	isSendingRef.current = isSending;
	const callbacksRef = (0, import_react.useRef)(callbacks);
	callbacksRef.current = callbacks;
	(0, import_react.useEffect)(() => {
		const container = containerRef.current;
		if (!container) return;
		const handleKeyDown = (e) => {
			if (isSendingRef.current) return;
			if (showCmdRef.current) {
				if (e.key === "Escape") {
					e.preventDefault();
					setCmdBuffer("");
					setShowCmd(false);
					return;
				}
				if (e.key === "Enter") {
					e.preventDefault();
					const cmd = cmdBufferRef.current.trim();
					if (cmd === "wq" || cmd === "wq!" || cmd === "x") callbacksRef.current.onSubmit();
					else if (cmd === "q" || cmd === "q!") {
						callbacksRef.current.onReset();
						setVimMode("normal");
					}
					setCmdBuffer("");
					setShowCmd(false);
					return;
				}
				if (e.key === "Backspace") {
					e.preventDefault();
					setCmdBuffer((prev) => {
						if (prev.length <= 1) {
							setShowCmd(false);
							return "";
						}
						return prev.slice(0, -1);
					});
					return;
				}
				if (e.key.length === 1) {
					e.preventDefault();
					setCmdBuffer((prev) => prev + e.key);
					return;
				}
				return;
			}
			if (vimModeRef.current === "normal") {
				if (e.key === ":") {
					e.preventDefault();
					setShowCmd(true);
					setCmdBuffer("");
					return;
				}
				if (e.key === "i" || e.key === "a") {
					e.preventDefault();
					setVimMode("insert");
					container.querySelector("input:not([disabled]), textarea:not([disabled])")?.focus();
					return;
				}
			}
			if (vimModeRef.current === "insert" && e.key === "Escape") {
				e.preventDefault();
				setVimMode("normal");
				document.activeElement?.blur();
				container.focus();
				return;
			}
		};
		container.addEventListener("keydown", handleKeyDown);
		return () => container.removeEventListener("keydown", handleKeyDown);
	}, [containerRef]);
	return {
		vimMode,
		setVimMode,
		showCmd,
		cmdBuffer
	};
}
function formatLine(line) {
	if (line.includes("[  OK  ]")) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [line.replace("[  OK  ]", ""), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-terminal-ok",
		children: "[ OK ]"
	})] });
	if (line.includes("[FAILED]")) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [line.replace("[FAILED]", ""), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-terminal-error",
		children: "[FAILED]"
	})] });
	if (line.startsWith("$")) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-primary",
		children: "$"
	}), line.slice(1)] });
	if (line.startsWith("Mail sent")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-terminal-ok",
		children: line
	});
	if (line.startsWith("Error:") || line.startsWith("Connection error:")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-terminal-error",
		children: line
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-muted-hover",
		children: line
	});
}
function SendLog({ lines, logEndRef }) {
	if (lines.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t border-border-faint bg-muted/50 dark:bg-black/20 px-3 py-2 max-h-32 overflow-y-auto",
		children: [lines.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "leading-relaxed",
			children: formatLine(line)
		}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: logEndRef })]
	});
}
var EMPTY_FORM = {
	name: "",
	email: "",
	phone: "",
	message: ""
};
function ContactPane({ contact }) {
	const { executeRecaptcha } = useRecaptcha();
	const notification = useNotification();
	const [formData, setFormData] = (0, import_react.useState)(EMPTY_FORM);
	const [focusedField, setFocusedField] = (0, import_react.useState)(null);
	const [sendState, setSendState] = (0, import_react.useState)("idle");
	const [sendLog, setSendLog] = (0, import_react.useState)([]);
	const logEndRef = (0, import_react.useRef)(null);
	const formRef = (0, import_react.useRef)(null);
	const containerRef = (0, import_react.useRef)(null);
	const isSending = sendState === "sending";
	const vim = useVimMode(containerRef, isSending, {
		onSubmit: () => formRef.current?.requestSubmit(),
		onReset: () => {
			setFormData(EMPTY_FORM);
		}
	});
	const messageLines = formData.message.split("\n");
	(0, import_react.useEffect)(() => {
		if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: "smooth" });
	}, [sendLog]);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};
	const handleFocus = (field) => {
		setFocusedField(field);
		if (vim.vimMode === "normal") vim.setVimMode("insert");
	};
	const appendLog = (line) => {
		setSendLog((prev) => [...prev, line]);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!executeRecaptcha) {
			notification.error(contact.recaptchaError);
			return;
		}
		vim.setVimMode("normal");
		setFocusedField(null);
		document.activeElement?.blur();
		setSendState("sending");
		setSendLog([]);
		appendLog(`$ sendmail -t ${MY_EMAIL}`);
		await delay(400);
		appendLog("Resolving MX record for hansteen.dev...");
		await delay(300);
		let token;
		try {
			token = await executeRecaptcha("contact_form");
			appendLog("CAPTCHA verification .............. [  OK  ]");
		} catch (error) {
			appendLog("CAPTCHA verification .............. [FAILED]");
			setSendState("error");
			console.error(error);
			notification.error(contact.recaptchaError);
			return;
		}
		await delay(250);
		appendLog("Establishing TLS connection ........ [  OK  ]");
		await delay(200);
		appendLog("Authenticating sender .............. [  OK  ]");
		await delay(150);
		appendLog(`Sending ${formData.message.length} bytes ...`);
		try {
			const result = await sendContactForm({ data: {
				...formData,
				recaptchaToken: token
			} });
			if (result.success) {
				appendLog("Message delivery ................... [  OK  ]");
				appendLog("");
				appendLog("Mail sent successfully. Queue ID: " + genQueueId());
				setSendState("success");
				notification.success(contact.submitSuccess);
				setTimeout(() => {
					setFormData(EMPTY_FORM);
					setSendState("idle");
					setSendLog([]);
				}, 4e3);
			} else {
				appendLog("Message delivery ................... [FAILED]");
				appendLog("Error: " + (result.error ?? "unknown"));
				setSendState("error");
				notification.error(contact.submitError);
			}
		} catch (error) {
			console.error(contact.submitError + ": ", error);
			appendLog("Connection error: ETIMEDOUT");
			setSendState("error");
			notification.error(contact.submitError);
			setTimeout(() => {
				setSendState("idle");
				setSendLog([]);
			}, 4e3);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		tabIndex: 0,
		className: "flex-1 overflow-hidden flex flex-col outline-hidden h-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			ref: formRef,
			onSubmit: handleSubmit,
			className: "flex flex-col flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border-faint px-3 py-2 space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center border-b border-border-faint pb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-vim-label w-10 shrink-0",
								children: "To:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: MY_EMAIL
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center border-b border-border-faint pb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "contact-name",
								className: "text-vim-label w-10 shrink-0",
								children: "From:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 flex items-center gap-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "contact-name",
									type: "text",
									name: "name",
									value: formData.name,
									onChange: handleChange,
									onFocus: () => handleFocus("name"),
									onBlur: () => setFocusedField(null),
									required: true,
									disabled: isSending,
									className: "flex-1 min-w-0 bg-transparent text-foreground outline-hidden font-mono text-xs\n                  placeholder:text-placeholder disabled:opacity-50",
									placeholder: contact.name,
									autoComplete: "off"
								}), focusedField === "name" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary animate-pulse",
									children: "█"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center border-b border-border-faint pb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "contact-email",
								className: "text-vim-label w-10 shrink-0",
								children: "Mail:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 flex items-center gap-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "contact-email",
									type: "email",
									name: "email",
									value: formData.email,
									onChange: handleChange,
									onFocus: () => handleFocus("email"),
									onBlur: () => setFocusedField(null),
									required: true,
									disabled: isSending,
									className: "flex-1 min-w-0 bg-transparent text-foreground outline-hidden font-mono text-xs\n                  placeholder:text-placeholder disabled:opacity-50",
									placeholder: contact.email,
									autoComplete: "off"
								}), focusedField === "email" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary animate-pulse",
									children: "█"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center pb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "contact-phone",
								className: "text-vim-label w-10 shrink-0",
								children: "Tel:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 flex items-center gap-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "contact-phone",
									type: "tel",
									name: "phone",
									value: formData.phone,
									onChange: handleChange,
									onFocus: () => handleFocus("phone"),
									onBlur: () => setFocusedField(null),
									disabled: isSending,
									className: "flex-1 min-w-0 bg-transparent text-foreground outline-hidden font-mono text-xs\n                  placeholder:text-placeholder disabled:opacity-50",
									placeholder: `${contact.phone} (${contact.optional})`,
									autoComplete: "off"
								}), focusedField === "phone" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary animate-pulse",
									children: "█"
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 flex flex-col min-h-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 flex min-h-36",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-8 shrink-0 border-r border-border-faint bg-surface-faint flex flex-col items-end pt-2 pr-1 select-none",
							children: [
								(formData.message.length > 0 ? messageLines : [""]).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xs leading-editor text-vim-line-number",
									children: i + 1
								}, i)),
								formData.message.length > 0 && Array.from({ length: Math.max(0, 8 - messageLines.length) }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xs leading-editor text-vim-tilde",
									children: "~"
								}, `tilde-${i}`)),
								formData.message.length === 0 && Array.from({ length: 7 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xs leading-editor text-vim-tilde",
									children: "~"
								}, `tilde-${i}`))
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 relative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "contact-message",
								name: "message",
								value: formData.message,
								onChange: handleChange,
								onFocus: () => handleFocus("message"),
								onBlur: () => setFocusedField(null),
								required: true,
								disabled: isSending,
								className: "w-full h-full min-h-36 bg-transparent text-foreground outline-hidden font-mono text-xs\n                  resize-none p-2 leading-editor placeholder:text-placeholder disabled:opacity-50",
								placeholder: vim.vimMode === "normal" ? contact.vimHintNormal : contact.message + "...",
								autoComplete: "off"
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SendLog, {
					lines: sendLog,
					logEndRef
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-3 py-1 border-t border-wm-border bg-surface-faint",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 min-w-0",
						children: vim.showCmd ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: ":"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: vim.cmdBuffer
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary-soft animate-pulse",
									children: "█"
								})
							]
						}) : vim.vimMode === "insert" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-foreground",
							children: "-- INSERT --"
						}) : sendState === "idle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-subtle",
							children: contact.vimHintStatus.split(/\{|\}/).map((part, i) => part === "i" || part === "wq" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary-muted",
								children: part === "wq" ? `:${part}` : part
							}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, i))
						}) : null
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-ghost text-2xs",
							children: [
								messageLines.length,
								",",
								formData.message.length > 0 ? (messageLines[messageLines.length - 1]?.length ?? 0) + 1 : 0
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: isSending,
							className: "font-mono text-xs px-3 py-0.5 rounded border border-control-border-hover\n                text-primary hover:bg-control-active hover:border-wm-border-swap\n                active:bg-surface-selected transition-all disabled:opacity-30 disabled:cursor-not-allowed",
							children: isSending ? contact.submitLoading : ":wq"
						})]
					})]
				})
			]
		})
	});
}
function SettingsPane({ currentLocale, currentBackground, onSelectBackground, ui, tutorial }) {
	const { theme, setTheme } = z();
	const router = useRouter();
	const [, startTransition] = (0, import_react.useTransition)();
	const fileInputRef = (0, import_react.useRef)(null);
	const { ref: containerRef, height } = useContainerSize();
	const compact = height > 0 && height < 220;
	const handleFileSelect = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const dataUrl = reader.result;
			onSelectBackground({
				id: "custom",
				name: "Custom",
				type: "custom-image",
				value: dataUrl
			});
		};
		reader.readAsDataURL(file);
	};
	const isCustomActive = currentBackground.type === "custom-image";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		className: "p-2 @xs:p-3 @md:p-4 h-full flex flex-col overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `flex-1 ${compact ? "flex flex-col gap-2" : "space-y-4 @md:space-y-5"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: compact ? "flex gap-3 flex-wrap" : "@md:grid @md:grid-cols-2 @md:gap-4 space-y-4 @md:space-y-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: compact ? "flex-1 min-w-0" : "",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: `text-primary font-semibold mb-1.5 ${compact ? "text-xs" : "text-xs mb-2"}`,
							children: ui.theme
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 @md:grid-cols-3 gap-1 @xs:gap-1.5",
							children: THEMES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setTheme(t.id),
								className: `flex items-center gap-1 px-1.5 py-1 @xs:px-2 @xs:py-1.5 rounded-md border text-xs transition-all min-w-0 ${theme === t.id ? "border-primary bg-control-active text-primary" : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSwatch, { colors: t.colors }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: t.name
								})]
							}, t.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: compact ? "flex-1 min-w-0" : "",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: `text-primary font-semibold mb-1.5 ${compact ? "text-xs" : "text-xs mb-2"}`,
							children: ui.language
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid gap-1 @xs:gap-1.5 ${compact ? "grid-cols-4" : "grid-cols-2"}`,
							children: languages.map((lang) => {
								const isActive = lang.code === currentLocale;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										if (!isActive) startTransition(() => {
											router.navigate({
												to: "/$locale",
												params: { locale: lang.code },
												replace: true
											});
										});
									},
									className: `flex items-center gap-1.5 px-2 py-1 @xs:px-2.5 @xs:py-1.5 rounded-md border text-xs @xs:text-xs transition-all ${isActive ? "border-primary bg-control-active text-primary" : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang.flag }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `truncate ${compact ? "hidden @sm:inline" : ""}`,
										children: lang.name
									})]
								}, lang.code);
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: `text-primary font-semibold mb-1.5 ${compact ? "text-xs" : "text-xs mb-2"}`,
						children: ui.wallpaper
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileInputRef,
						type: "file",
						accept: "image/*",
						onChange: handleFileSelect,
						className: "hidden"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `grid gap-1 @xs:gap-1.5 ${compact ? "grid-cols-3 @xs:grid-cols-4" : "grid-cols-2 @xs:grid-cols-3 @md:grid-cols-4 @lg:grid-cols-6"}`,
						children: [BACKGROUND_PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => onSelectBackground(preset),
							className: `flex flex-col items-center gap-1 p-1.5 rounded-md border text-xs transition-all ${currentBackground.id === preset.id && !isCustomActive ? "border-primary bg-control-active text-primary" : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackgroundPreview, { config: preset }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ui.backgrounds[preset.id] ?? preset.name })]
						}, preset.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => fileInputRef.current?.click(),
							className: `flex flex-col items-center gap-1 p-1.5 rounded-md border text-xs transition-all ${isCustomActive ? "border-primary bg-control-active text-primary" : "border-control-border text-muted-foreground hover:border-control-border-hover hover:bg-control-hover"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full aspect-[3/2] rounded-sm overflow-hidden border border-control-border flex items-center justify-center",
								children: isCustomActive && currentBackground.value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: currentBackground.value,
									alt: "",
									className: "w-full h-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									viewBox: "0 0 24 16",
									className: "w-full h-full",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											width: "24",
											height: "16",
											className: "fill-background"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M8 11l3-4 2.5 3 1.5-2 3 3H6z",
											className: "fill-surface-elevated"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											cx: "8",
											cy: "6",
											r: "1.5",
											className: "fill-surface-selected"
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ui.backgrounds.custom ?? ui.customImage })]
						})]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: compact ? "mt-1" : "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							remove(KEYS.tutorialCompleted);
							remove(KEYS.openPanes);
							remove(KEYS.rowHeights);
							remove(KEYS.colWidths);
							window.location.reload();
						},
						className: "px-3 py-1.5 rounded-md border border-control-border text-xs text-muted-foreground hover:border-control-border-hover hover:bg-control-hover transition-all",
						children: tutorial.restartTutorial
					})
				})
			]
		})
	});
}
function toFileName(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function createFileSystem(config) {
	const appsChildren = {};
	if (config?.paneIds) for (const id of config.paneIds) appsChildren[id] = {
		name: id,
		type: "file",
		content: `Application: ${id}`
	};
	const projectsChildren = {};
	if (config?.projects) for (const p of config.projects) {
		const name = toFileName(p.title);
		projectsChildren[name] = {
			name,
			type: "file",
			content: p.title
		};
	}
	const careerChildren = {};
	if (config?.careers) for (const c of config.careers) {
		const name = toFileName(`${c.company}`);
		careerChildren[name] = {
			name,
			type: "file",
			content: `${c.company}`
		};
	}
	return {
		name: "/",
		type: "directory",
		children: {
			home: {
				name: "home",
				type: "directory",
				children: { fredrik: {
					name: "fredrik",
					type: "directory",
					children: {
						apps: {
							name: "apps",
							type: "directory",
							children: appsChildren
						},
						documents: {
							name: "documents",
							type: "directory",
							children: {
								projects: {
									name: "projects",
									type: "directory",
									children: projectsChildren
								},
								career: {
									name: "career",
									type: "directory",
									children: careerChildren
								},
								secret: {
									name: "secret",
									type: "directory",
									children: { "super-secret": {
										name: "super-secret",
										type: "directory",
										children: { "flag.txt": {
											name: "flag.txt",
											type: "file",
											content: "FLAG{congrats_you_found_me}"
										} }
									} }
								}
							}
						},
						"profile.txt": {
							name: "profile.txt",
							type: "file",
							content: `${MY_NAME} - Developer of FredrikOS\nContact: ${MY_EMAIL}`
						},
						".bashrc": {
							name: ".bashrc",
							type: "file",
							content: "# ~/.bashrc\nexport PATH=$PATH:/usr/local/bin\nalias ll='ls -la'\nalias la='ls -A'"
						}
					}
				} }
			},
			usr: {
				name: "usr",
				type: "directory",
				children: {
					bin: {
						name: "bin",
						type: "directory",
						children: { node: {
							name: "node",
							type: "file",
							content: "Node.js executable"
						} }
					},
					local: {
						name: "local",
						type: "directory",
						children: { bin: {
							name: "bin",
							type: "directory",
							children: {}
						} }
					}
				}
			},
			var: {
				name: "var",
				type: "directory",
				children: { log: {
					name: "log",
					type: "directory",
					children: { "system.log": {
						name: "system.log",
						type: "file",
						content: "[2024-01-15 10:30:15] System started\n[2024-01-15 10:30:16] Terminal initialized\n[2024-01-15 10:30:17] Ready for commands"
					} }
				} }
			}
		}
	};
}
var FileSystemManager = class {
	fileSystem;
	constructor(config) {
		this.fileSystem = createFileSystem(config);
	}
	getNodeAtPath(path) {
		const parts = path.split("/").filter(Boolean);
		let current = this.fileSystem;
		for (const part of parts) if (current.children && current.children[part]) current = current.children[part];
		else return null;
		return current;
	}
	resolvePath(inputPath, currentPath) {
		if (inputPath.startsWith("~")) inputPath = "/home/fredrik" + inputPath.slice(1);
		if (inputPath.startsWith("/")) return this.normalizePath(inputPath);
		if (inputPath === "..") {
			const parts = currentPath.split("/").filter(Boolean);
			parts.pop();
			return "/" + parts.join("/");
		}
		if (inputPath === ".") return currentPath;
		const combined = currentPath === "/" ? `/${inputPath}` : `${currentPath}/${inputPath}`;
		return this.normalizePath(combined);
	}
	normalizePath(path) {
		const parts = path.split("/").filter(Boolean);
		const resolved = [];
		for (const part of parts) if (part === "..") resolved.pop();
		else if (part !== ".") resolved.push(part);
		return "/" + resolved.join("/");
	}
	buildDirectoryTree(node, prefix = "", isLast = true) {
		let result = `${prefix}${isLast ? "└── " : "├── "}${node.type === "directory" ? "📁" : "📄"} ${node.name}\n`;
		if (node.children) {
			const children = Object.values(node.children);
			children.forEach((child, index) => {
				const isLastChild = index === children.length - 1;
				const newPrefix = prefix + (isLast ? "    " : "│   ");
				result += this.buildDirectoryTree(child, newPrefix, isLastChild);
			});
		}
		return result;
	}
	listDirectory(path) {
		const node = this.getNodeAtPath(path);
		if (!node) throw new Error(`cannot access '${path}': No such file or directory`);
		if (node.type === "file") return node.name;
		return (node.children ? Object.values(node.children) : []).map((item) => item.type === "directory" ? `📁 ${item.name}` : `📄 ${item.name}`).join("\n") || "(empty directory)";
	}
	readFile(path) {
		const node = this.getNodeAtPath(path);
		if (!node) throw new Error(`${path}: No such file or directory`);
		if (node.type === "directory") throw new Error(`${path}: Is a directory`);
		return node.content || "(empty file)";
	}
	isDirectory(path) {
		return this.getNodeAtPath(path)?.type === "directory" || false;
	}
	exists(path) {
		return this.getNodeAtPath(path) !== null;
	}
	getCompletions(partialPath, currentPath) {
		const resolved = partialPath.startsWith("~") ? "/home/fredrik" + partialPath.slice(1) : partialPath.startsWith("/") ? partialPath : currentPath === "/" ? `/${partialPath}` : `${currentPath}/${partialPath}`;
		const lastSlash = resolved.lastIndexOf("/");
		const dirPath = lastSlash === 0 ? "/" : resolved.slice(0, lastSlash);
		const prefix = resolved.slice(lastSlash + 1);
		const dirNode = this.getNodeAtPath(dirPath);
		if (!dirNode || !dirNode.children) return [];
		return Object.keys(dirNode.children).filter((name) => name.startsWith(prefix)).map((name) => {
			const child = dirNode.children[name];
			const inputLastSlash = partialPath.lastIndexOf("/");
			return (inputLastSlash >= 0 ? partialPath.slice(0, inputLastSlash + 1) : "") + name + (child.type === "directory" ? "/" : "");
		});
	}
};
var en = {
	availableCommands: "Available commands:",
	helpDesc: "Show this help message",
	neofetchDesc: "System information display",
	lsDesc: "List directory contents",
	cdDesc: "Change directory",
	pwdDesc: "Print working directory",
	catDesc: "Display file contents",
	clearDesc: "Clear terminal",
	whoamiDesc: "Display current user",
	dateDesc: "Show current date and time",
	echoDesc: "Display text",
	treeDesc: "Show directory tree",
	aboutDesc: "About this terminal",
	unameDesc: "System information",
	uptimeDesc: "System uptime",
	openDesc: "Open a pane",
	closeDesc: "Close a pane",
	snakeDesc: "Play Snake",
	game2048Desc: "Play 2048",
	commandNotFound: "command not found",
	noSuchFileOrDir: "No such file or directory",
	notADirectory: "not a directory",
	isADirectory: "Is a directory",
	missingFileOperand: "missing file operand",
	cannotAccessDir: "Cannot access current directory",
	opening: "Opening",
	closing: "Closing",
	usageOpen: "Usage: open <pane>",
	usageClose: "Usage: close <pane>",
	unknownPane: "Unknown pane",
	available: "Available",
	cannotCloseTerminal: "Cannot close the terminal from itself.",
	wmOnly: "Games are only available in the window manager terminal.",
	wmOnlyOpenClose: "open/close commands are only available in the window manager terminal.",
	startingSnake: "Starting Snake...",
	starting2048: "Starting 2048...",
	gameOver: "Game over! Score",
	pressQToQuit: "Press q or Escape to quit",
	inputPlaceholder: "Type 'help' for commands..."
};
var translations = {
	en,
	nb: {
		availableCommands: "Tilgjengelige kommandoer:",
		helpDesc: "Vis denne hjelpemeldingen",
		neofetchDesc: "Vis systeminformasjon",
		lsDesc: "List innholdet i mappen",
		cdDesc: "Bytt mappe",
		pwdDesc: "Vis nåværende mappe",
		catDesc: "Vis filinnhold",
		clearDesc: "Tøm terminalen",
		whoamiDesc: "Vis gjeldende bruker",
		dateDesc: "Vis dato og klokkeslett",
		echoDesc: "Vis tekst",
		treeDesc: "Vis mappetreet",
		aboutDesc: "Om denne terminalen",
		unameDesc: "Systeminformasjon",
		uptimeDesc: "Oppetid",
		openDesc: "Åpne et panel",
		closeDesc: "Lukk et panel",
		snakeDesc: "Spill Snake",
		game2048Desc: "Spill 2048",
		commandNotFound: "kommando ikke funnet",
		noSuchFileOrDir: "Ingen slik fil eller mappe",
		notADirectory: "ikke en mappe",
		isADirectory: "Er en mappe",
		missingFileOperand: "mangler filoperand",
		cannotAccessDir: "Kan ikke åpne gjeldende mappe",
		opening: "Åpner",
		closing: "Lukker",
		usageOpen: "Bruk: open <panel>",
		usageClose: "Bruk: close <panel>",
		unknownPane: "Ukjent panel",
		available: "Tilgjengelige",
		cannotCloseTerminal: "Kan ikke lukke terminalen fra seg selv.",
		wmOnly: "Spill er kun tilgjengelige i vindusbehandlerens terminal.",
		wmOnlyOpenClose: "open/close-kommandoer er kun tilgjengelige i vindusbehandlerens terminal.",
		startingSnake: "Starter Snake...",
		starting2048: "Starter 2048...",
		gameOver: "Spillet er over! Poeng",
		pressQToQuit: "Trykk q eller Escape for å avslutte",
		inputPlaceholder: "Skriv 'help' for kommandoer..."
	},
	nn: {
		availableCommands: "Tilgjengelege kommandoar:",
		helpDesc: "Vis denne hjelpemeldinga",
		neofetchDesc: "Vis systeminformasjon",
		lsDesc: "List innhaldet i mappa",
		cdDesc: "Byt mappe",
		pwdDesc: "Vis noverande mappe",
		catDesc: "Vis filinnhald",
		clearDesc: "Tøm terminalen",
		whoamiDesc: "Vis gjeldande brukar",
		dateDesc: "Vis dato og klokkeslett",
		echoDesc: "Vis tekst",
		treeDesc: "Vis mappetreet",
		aboutDesc: "Om denne terminalen",
		unameDesc: "Systeminformasjon",
		uptimeDesc: "Oppetid",
		openDesc: "Opne eit panel",
		closeDesc: "Lukk eit panel",
		snakeDesc: "Spel Snake",
		game2048Desc: "Spel 2048",
		commandNotFound: "kommando ikkje funnen",
		noSuchFileOrDir: "Inga slik fil eller mappe",
		notADirectory: "ikkje ei mappe",
		isADirectory: "Er ei mappe",
		missingFileOperand: "manglar filoperand",
		cannotAccessDir: "Kan ikkje opne gjeldande mappe",
		opening: "Opnar",
		closing: "Lukkar",
		usageOpen: "Bruk: open <panel>",
		usageClose: "Bruk: close <panel>",
		unknownPane: "Ukjent panel",
		available: "Tilgjengelege",
		cannotCloseTerminal: "Kan ikkje lukke terminalen frå seg sjølv.",
		wmOnly: "Spel er berre tilgjengelege i vindaugshandsamaren sin terminal.",
		wmOnlyOpenClose: "open/close-kommandoar er berre tilgjengelege i vindaugshandsamaren sin terminal.",
		startingSnake: "Startar Snake...",
		starting2048: "Startar 2048...",
		gameOver: "Spelet er over! Poeng",
		pressQToQuit: "Trykk q eller Escape for å avslutte",
		inputPlaceholder: "Skriv 'help' for kommandoar..."
	},
	fr: {
		availableCommands: "Commandes disponibles :",
		helpDesc: "Afficher ce message d'aide",
		neofetchDesc: "Afficher les informations système",
		lsDesc: "Lister le contenu du répertoire",
		cdDesc: "Changer de répertoire",
		pwdDesc: "Afficher le répertoire courant",
		catDesc: "Afficher le contenu d'un fichier",
		clearDesc: "Effacer le terminal",
		whoamiDesc: "Afficher l'utilisateur actuel",
		dateDesc: "Afficher la date et l'heure",
		echoDesc: "Afficher du texte",
		treeDesc: "Afficher l'arborescence",
		aboutDesc: "À propos de ce terminal",
		unameDesc: "Informations système",
		uptimeDesc: "Temps de fonctionnement",
		openDesc: "Ouvrir un panneau",
		closeDesc: "Fermer un panneau",
		snakeDesc: "Jouer à Snake",
		game2048Desc: "Jouer à 2048",
		commandNotFound: "commande introuvable",
		noSuchFileOrDir: "Aucun fichier ou répertoire de ce type",
		notADirectory: "n'est pas un répertoire",
		isADirectory: "Est un répertoire",
		missingFileOperand: "opérande de fichier manquant",
		cannotAccessDir: "Impossible d'accéder au répertoire courant",
		opening: "Ouverture de",
		closing: "Fermeture de",
		usageOpen: "Usage : open <panneau>",
		usageClose: "Usage : close <panneau>",
		unknownPane: "Panneau inconnu",
		available: "Disponibles",
		cannotCloseTerminal: "Impossible de fermer le terminal depuis lui-même.",
		wmOnly: "Les jeux ne sont disponibles que dans le terminal du gestionnaire de fenêtres.",
		wmOnlyOpenClose: "Les commandes open/close ne sont disponibles que dans le terminal du gestionnaire de fenêtres.",
		startingSnake: "Lancement de Snake...",
		starting2048: "Lancement de 2048...",
		gameOver: "Fin de partie ! Score",
		pressQToQuit: "Appuyez sur q ou Échap pour quitter",
		inputPlaceholder: "Tapez 'help' pour les commandes..."
	}
};
function getTerminalStrings(locale) {
	return translations[locale ?? "en"] ?? en;
}
var COMMANDS = [
	{
		name: "help",
		descKey: "helpDesc"
	},
	{
		name: "neofetch",
		descKey: "neofetchDesc"
	},
	{
		name: "ls [path]",
		descKey: "lsDesc"
	},
	{
		name: "cd <path>",
		descKey: "cdDesc"
	},
	{
		name: "pwd",
		descKey: "pwdDesc"
	},
	{
		name: "cat <file>",
		descKey: "catDesc"
	},
	{
		name: "clear",
		descKey: "clearDesc"
	},
	{
		name: "whoami",
		descKey: "whoamiDesc"
	},
	{
		name: "date",
		descKey: "dateDesc"
	},
	{
		name: "echo <text>",
		descKey: "echoDesc"
	},
	{
		name: "tree",
		descKey: "treeDesc"
	},
	{
		name: "about",
		descKey: "aboutDesc"
	},
	{
		name: "uname",
		descKey: "unameDesc"
	},
	{
		name: "uptime",
		descKey: "uptimeDesc"
	},
	{
		name: "open <pane>",
		descKey: "openDesc"
	},
	{
		name: "close <pane>",
		descKey: "closeDesc"
	},
	{
		name: "snake",
		descKey: "snakeDesc"
	},
	{
		name: "2048",
		descKey: "game2048Desc"
	}
];
var COMMAND_NAMES = COMMANDS.map((c) => c.name.split(" ")[0]);
var CommandProcessor = class {
	fileSystemManager;
	paneIds;
	isStandalone;
	t;
	constructor(config, isStandalone = false, locale) {
		this.fileSystemManager = new FileSystemManager(config);
		this.paneIds = config?.paneIds ?? [];
		this.isStandalone = isStandalone;
		this.t = getTerminalStrings(locale);
	}
	get fs() {
		return this.fileSystemManager;
	}
	processCommand(command, currentPath) {
		const [cmd, ...args] = command.trim().split(" ");
		switch (cmd.toLowerCase()) {
			case "help": {
				const maxLen = Math.max(...COMMANDS.map((c) => c.name.length));
				const lines = COMMANDS.map((c) => `  ${c.name.padEnd(maxLen + 2)} ${this.t[c.descKey]}`);
				return { output: {
					command,
					output: this.t.availableCommands + "\n" + lines.join("\n")
				} };
			}
			case "neofetch": return { output: {
				command,
				output: getNeofetchPlainText()
			} };
			case "ls": return this.handleLsCommand(command, args, currentPath);
			case "cd": return this.handleCdCommand(command, args, currentPath);
			case "pwd": return { output: {
				command,
				output: currentPath
			} };
			case "cat": return this.handleCatCommand(command, args, currentPath);
			case "clear": return { output: {
				command,
				output: ""
			} };
			case "whoami": return { output: {
				command,
				output: "fredrir"
			} };
			case "date": return { output: {
				command,
				output: (/* @__PURE__ */ new Date()).toString()
			} };
			case "echo": return { output: {
				command,
				output: args.join(" ")
			} };
			case "tree": return this.handleTreeCommand(command, currentPath);
			case "about": return { output: {
				command,
				output: `fredrir v${PORTFOLIO_VERSION}
Built with Next.js + Tailwind
Type 'help' for available commands
Repository: https://github.com/fredrir/portfolio
Author: ${MY_NAME}`
			} };
			case "uname": {
				const unameFlag = args[0];
				let unameOutput = `fredrir ${PORTFOLIO_VERSION}`;
				if (unameFlag === "-a") unameOutput = `fredrir fredrir-terminal ${PORTFOLIO_VERSION} #1 SMP Web Browser x86_64 GNU/Linux`;
				else if (unameFlag === "-r") unameOutput = "1.0.0";
				else if (unameFlag === "-m") unameOutput = "x86_64";
				return { output: {
					command,
					output: unameOutput
				} };
			}
			case "uptime": return { output: {
				command,
				output: `up ${computeUptime()}`
			} };
			case "open": return this.handleOpenCommand(command, args);
			case "close": return this.handleCloseCommand(command, args);
			case "snake":
				if (this.isStandalone) return { output: {
					command,
					output: this.t.wmOnly,
					isError: true
				} };
				return {
					output: {
						command,
						output: this.t.startingSnake
					},
					action: {
						type: "startGame",
						payload: "snake"
					}
				};
			case "2048":
				if (this.isStandalone) return { output: {
					command,
					output: this.t.wmOnly,
					isError: true
				} };
				return {
					output: {
						command,
						output: this.t.starting2048
					},
					action: {
						type: "startGame",
						payload: "2048"
					}
				};
			default: return { output: {
				command,
				output: `zsh: ${this.t.commandNotFound}: ${cmd}`,
				isError: true
			} };
		}
	}
	handleOpenCommand(command, args) {
		if (this.isStandalone) return { output: {
			command,
			output: this.t.wmOnlyOpenClose,
			isError: true
		} };
		if (!args[0]) return { output: {
			command,
			output: `${this.t.usageOpen}\n${this.t.available}: ${this.paneIds.join(", ")}`,
			isError: true
		} };
		const paneId = args[0].toLowerCase();
		if (!this.paneIds.includes(paneId)) return { output: {
			command,
			output: `${this.t.unknownPane}: ${paneId}\n${this.t.available}: ${this.paneIds.join(", ")}`,
			isError: true
		} };
		return {
			output: {
				command,
				output: `${this.t.opening} ${paneId}...`
			},
			action: {
				type: "openPane",
				payload: paneId
			}
		};
	}
	handleCloseCommand(command, args) {
		if (this.isStandalone) return { output: {
			command,
			output: this.t.wmOnlyOpenClose,
			isError: true
		} };
		if (!args[0]) return { output: {
			command,
			output: `${this.t.usageClose}\n${this.t.available}: ${this.paneIds.join(", ")}`,
			isError: true
		} };
		const paneId = args[0].toLowerCase();
		if (!this.paneIds.includes(paneId)) return { output: {
			command,
			output: `${this.t.unknownPane}: ${paneId}\n${this.t.available}: ${this.paneIds.join(", ")}`,
			isError: true
		} };
		if (paneId === "terminal") return { output: {
			command,
			output: this.t.cannotCloseTerminal,
			isError: true
		} };
		return {
			output: {
				command,
				output: `${this.t.closing} ${paneId}...`
			},
			action: {
				type: "closePane",
				payload: paneId
			}
		};
	}
	handleLsCommand(command, args, currentPath) {
		try {
			const lsPath = args[0] ? this.fileSystemManager.resolvePath(args[0], currentPath) : currentPath;
			return { output: {
				command,
				output: this.fileSystemManager.listDirectory(lsPath)
			} };
		} catch (error) {
			return { output: {
				command,
				output: `ls: ${error instanceof Error ? error.message : "Unknown error"}`,
				isError: true
			} };
		}
	}
	handleCdCommand(command, args, currentPath) {
		if (!args[0] || args[0] === "~") return {
			output: {
				command,
				output: ""
			},
			newPath: "/home/fredrik"
		};
		try {
			const newPath = this.fileSystemManager.resolvePath(args[0], currentPath);
			if (!this.fileSystemManager.exists(newPath)) return { output: {
				command,
				output: `cd: ${this.t.noSuchFileOrDir}: ${args[0]}`,
				isError: true
			} };
			if (!this.fileSystemManager.isDirectory(newPath)) return { output: {
				command,
				output: `cd: ${this.t.notADirectory}: ${args[0]}`,
				isError: true
			} };
			return {
				output: {
					command,
					output: ""
				},
				newPath
			};
		} catch (error) {
			return { output: {
				command,
				output: `cd: ${error instanceof Error ? error.message : "Unknown error"}`,
				isError: true
			} };
		}
	}
	handleCatCommand(command, args, currentPath) {
		if (!args[0]) return { output: {
			command,
			output: `cat: ${this.t.missingFileOperand}`,
			isError: true
		} };
		try {
			const catPath = this.fileSystemManager.resolvePath(args[0], currentPath);
			return { output: {
				command,
				output: this.fileSystemManager.readFile(catPath)
			} };
		} catch (error) {
			return { output: {
				command,
				output: `cat: ${error instanceof Error ? error.message : "Unknown error"}`,
				isError: true
			} };
		}
	}
	handleTreeCommand(command, currentPath) {
		try {
			const currentNode = this.fileSystemManager.getNodeAtPath(currentPath);
			if (currentNode) return { output: {
				command,
				output: this.fileSystemManager.buildDirectoryTree(currentNode).trim()
			} };
			return { output: {
				command,
				output: `Error: ${this.t.cannotAccessDir}`,
				isError: true
			} };
		} catch (error) {
			return { output: {
				command,
				output: `tree: ${error instanceof Error ? error.message : "Unknown error"}`,
				isError: true
			} };
		}
	}
};
function useAutocomplete({ fileSystemManager, currentPath, paneIds }) {
	const tabCountRef = (0, import_react.useRef)(0);
	const resetTabCount = (0, import_react.useCallback)(() => {
		tabCountRef.current = 0;
	}, []);
	return {
		getCompletions: (0, import_react.useCallback)((input) => {
			tabCountRef.current++;
			const parts = input.split(" ");
			if (parts.length <= 1) {
				const prefix = parts[0] || "";
				const matches = COMMAND_NAMES.filter((c) => c.startsWith(prefix));
				if (matches.length === 0) return {
					completed: input,
					suggestions: []
				};
				if (matches.length === 1) return {
					completed: matches[0] + " ",
					suggestions: []
				};
				return {
					completed: longestCommonPrefix(matches),
					suggestions: tabCountRef.current >= 2 ? matches : []
				};
			}
			const cmd = parts[0].toLowerCase();
			const arg = parts.slice(1).join(" ");
			if (cmd === "open" || cmd === "close") {
				const matches = paneIds.filter((id) => id.startsWith(arg));
				if (matches.length === 0) return {
					completed: input,
					suggestions: []
				};
				if (matches.length === 1) return {
					completed: `${cmd} ${matches[0]} `,
					suggestions: []
				};
				return {
					completed: `${cmd} ${longestCommonPrefix(matches)}`,
					suggestions: tabCountRef.current >= 2 ? matches : []
				};
			}
			if ([
				"cd",
				"ls",
				"cat"
			].includes(cmd)) {
				const matches = fileSystemManager.getCompletions(arg, currentPath);
				if (matches.length === 0) return {
					completed: input,
					suggestions: []
				};
				if (matches.length === 1) return {
					completed: `${cmd} ${matches[0]}`,
					suggestions: []
				};
				return {
					completed: `${cmd} ${longestCommonPrefix(matches)}`,
					suggestions: tabCountRef.current >= 2 ? matches : []
				};
			}
			return {
				completed: input,
				suggestions: []
			};
		}, [
			fileSystemManager,
			currentPath,
			paneIds
		]),
		resetTabCount
	};
}
function longestCommonPrefix(strings) {
	if (strings.length === 0) return "";
	let prefix = strings[0];
	for (let i = 1; i < strings.length; i++) while (!strings[i].startsWith(prefix)) {
		prefix = prefix.slice(0, -1);
		if (prefix === "") return "";
	}
	return prefix;
}
var WIDTH = 20;
var HEIGHT = 20;
var SnakeGame = class {
	id = "snake";
	snake;
	food;
	direction = "right";
	nextDirection = "right";
	score = 0;
	gameOver = false;
	constructor() {
		this.snake = [
			{
				x: 5,
				y: 10
			},
			{
				x: 4,
				y: 10
			},
			{
				x: 3,
				y: 10
			}
		];
		this.food = this.spawnFood();
	}
	spawnFood() {
		let pos;
		do
			pos = {
				x: Math.floor(Math.random() * WIDTH),
				y: Math.floor(Math.random() * HEIGHT)
			};
		while (this.snake.some((s) => s.x === pos.x && s.y === pos.y));
		return pos;
	}
	handleKey(key) {
		if (this.gameOver) return;
		switch (key) {
			case "ArrowUp":
				if (this.direction !== "down") this.nextDirection = "up";
				break;
			case "ArrowDown":
				if (this.direction !== "up") this.nextDirection = "down";
				break;
			case "ArrowLeft":
				if (this.direction !== "right") this.nextDirection = "left";
				break;
			case "ArrowRight":
				if (this.direction !== "left") this.nextDirection = "right";
				break;
			case "tick":
				this.tick();
				break;
		}
	}
	tick() {
		this.direction = this.nextDirection;
		const newHead = { ...this.snake[0] };
		switch (this.direction) {
			case "up":
				newHead.y--;
				break;
			case "down":
				newHead.y++;
				break;
			case "left":
				newHead.x--;
				break;
			case "right":
				newHead.x++;
				break;
		}
		if (newHead.x < 0 || newHead.x >= WIDTH || newHead.y < 0 || newHead.y >= HEIGHT || this.snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
			this.gameOver = true;
			return;
		}
		this.snake.unshift(newHead);
		if (newHead.x === this.food.x && newHead.y === this.food.y) {
			this.score++;
			this.food = this.spawnFood();
		} else this.snake.pop();
	}
	render() {
		const lines = [];
		lines.push(`  Score: ${this.score}  |  Arrow keys to move, q to quit`);
		lines.push("┌" + "──".repeat(WIDTH) + "┐");
		for (let y = 0; y < HEIGHT; y++) {
			let row = "│";
			for (let x = 0; x < WIDTH; x++) {
				const isHead = this.snake[0].x === x && this.snake[0].y === y;
				const isBody = !isHead && this.snake.some((s) => s.x === x && s.y === y);
				const isFood = this.food.x === x && this.food.y === y;
				if (isHead) row += "O ";
				else if (isBody) row += "o ";
				else if (isFood) row += "* ";
				else row += "  ";
			}
			row += "│";
			lines.push(row);
		}
		lines.push("└" + "──".repeat(WIDTH) + "┘");
		if (this.gameOver) {
			lines.push(`  Game Over! Final score: ${this.score}`);
			lines.push("  Press q or Escape to exit.");
		}
		return lines.join("\n");
	}
	isFinished() {
		return this.gameOver;
	}
	getScore() {
		return this.score;
	}
};
var SIZE = 4;
var Game2048 = class {
	id = "2048";
	grid;
	score = 0;
	won = false;
	lost = false;
	constructor() {
		this.grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
		this.addTile();
		this.addTile();
	}
	addTile() {
		const empty = [];
		for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (this.grid[r][c] === 0) empty.push({
			r,
			c
		});
		if (empty.length === 0) return;
		const { r, c } = empty[Math.floor(Math.random() * empty.length)];
		this.grid[r][c] = Math.random() < .9 ? 2 : 4;
	}
	slide(row) {
		const filtered = row.filter((v) => v !== 0);
		let merged = 0;
		const result = [];
		for (let i = 0; i < filtered.length; i++) if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
			const val = filtered[i] * 2;
			result.push(val);
			merged += val;
			if (val === 2048) this.won = true;
			i++;
		} else result.push(filtered[i]);
		while (result.length < SIZE) result.push(0);
		return {
			result,
			merged
		};
	}
	move(direction) {
		let moved = false;
		let totalMerged = 0;
		const getRow = (i) => {
			switch (direction) {
				case "left": return [...this.grid[i]];
				case "right": return [...this.grid[i]].reverse();
				case "up": return this.grid.map((r) => r[i]);
				case "down": return this.grid.map((r) => r[i]).reverse();
				default: return [];
			}
		};
		const setRow = (i, row) => {
			switch (direction) {
				case "left":
					this.grid[i] = row;
					break;
				case "right":
					this.grid[i] = row.reverse();
					break;
				case "up":
					for (let r = 0; r < SIZE; r++) this.grid[r][i] = row[r];
					break;
				case "down":
					row.reverse();
					for (let r = 0; r < SIZE; r++) this.grid[r][i] = row[r];
					break;
			}
		};
		for (let i = 0; i < SIZE; i++) {
			const original = getRow(i);
			const { result, merged } = this.slide(original);
			totalMerged += merged;
			if (original.some((v, j) => v !== result[j])) moved = true;
			setRow(i, result);
		}
		this.score += totalMerged;
		return moved;
	}
	hasMovesLeft() {
		for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
			if (this.grid[r][c] === 0) return true;
			if (c < SIZE - 1 && this.grid[r][c] === this.grid[r][c + 1]) return true;
			if (r < SIZE - 1 && this.grid[r][c] === this.grid[r + 1][c]) return true;
		}
		return false;
	}
	handleKey(key) {
		if (this.won || this.lost) return;
		let dir = null;
		switch (key) {
			case "ArrowUp":
				dir = "up";
				break;
			case "ArrowDown":
				dir = "down";
				break;
			case "ArrowLeft":
				dir = "left";
				break;
			case "ArrowRight":
				dir = "right";
				break;
		}
		if (!dir) return;
		if (this.move(dir)) {
			this.addTile();
			if (!this.hasMovesLeft()) this.lost = true;
		}
	}
	render() {
		const lines = [];
		lines.push(`  Score: ${this.score}  |  Arrow keys to move, q to quit`);
		lines.push("");
		const cellWidth = 6;
		const hLine = "─".repeat(cellWidth);
		lines.push("┌" + Array(SIZE).fill(hLine).join("┬") + "┐");
		for (let r = 0; r < SIZE; r++) {
			let row = "│";
			for (let c = 0; c < SIZE; c++) {
				const val = this.grid[r][c];
				const str = val === 0 ? "" : String(val);
				row += str.padStart(Math.ceil((cellWidth + str.length) / 2)).padEnd(cellWidth) + "│";
			}
			lines.push(row);
			if (r < SIZE - 1) lines.push("├" + Array(SIZE).fill(hLine).join("┼") + "┤");
		}
		lines.push("└" + Array(SIZE).fill(hLine).join("┴") + "┘");
		if (this.won) {
			lines.push(`  You win! Score: ${this.score}`);
			lines.push("  Press q or Escape to exit.");
		} else if (this.lost) {
			lines.push(`  No moves left! Score: ${this.score}`);
			lines.push("  Press q or Escape to exit.");
		}
		return lines.join("\n");
	}
	isFinished() {
		return this.won || this.lost;
	}
	getScore() {
		return this.score;
	}
};
function createGame(id) {
	switch (id) {
		case "snake": return new SnakeGame();
		case "2048": return new Game2048();
		default: throw new Error(`Unknown game: ${id}`);
	}
}
var terminalStore = {
	commandHistory: [],
	currentPath: "/home/fredrik",
	showNeofetch: true
};
function TerminalPane({ locale, paneIds = [], projects = [], careers = [], onOpenPane, onClosePane }) {
	const t = getTerminalStrings(locale);
	const [inputValue, setInputValue] = (0, import_react.useState)("");
	const [commandHistory, setCommandHistory] = (0, import_react.useState)(() => terminalStore.commandHistory);
	const [currentPath, setCurrentPath] = (0, import_react.useState)(() => terminalStore.currentPath);
	const [showNeofetch, setShowNeofetch] = (0, import_react.useState)(() => terminalStore.showNeofetch);
	const inputRef = (0, import_react.useRef)(null);
	const contentRef = (0, import_react.useRef)(null);
	const gameContainerRef = (0, import_react.useRef)(null);
	const [historyIdx, setHistoryIdx] = (0, import_react.useState)(-1);
	const config = {
		paneIds,
		projects,
		careers
	};
	const processorRef = (0, import_react.useRef)(new CommandProcessor(config, false, locale));
	const [activeGame, setActiveGame] = (0, import_react.useState)(null);
	const [gameFrame, setGameFrame] = (0, import_react.useState)("");
	const { getCompletions, resetTabCount } = useAutocomplete({
		fileSystemManager: processorRef.current.fs,
		currentPath,
		paneIds
	});
	(0, import_react.useEffect)(() => {
		processorRef.current = new CommandProcessor(config, false, locale);
	}, [
		paneIds.join(","),
		projects.length,
		careers.length,
		locale
	]);
	(0, import_react.useEffect)(() => {
		terminalStore.commandHistory = commandHistory;
	}, [commandHistory]);
	(0, import_react.useEffect)(() => {
		terminalStore.currentPath = currentPath;
	}, [currentPath]);
	(0, import_react.useEffect)(() => {
		terminalStore.showNeofetch = showNeofetch;
	}, [showNeofetch]);
	const scrollToBottom = (0, import_react.useCallback)(() => {
		if (contentRef.current) contentRef.current.scrollTop = contentRef.current.scrollHeight;
	}, []);
	(0, import_react.useEffect)(() => {
		scrollToBottom();
	}, [
		commandHistory,
		gameFrame,
		scrollToBottom
	]);
	(0, import_react.useEffect)(() => {
		if (!activeGame || activeGame.id !== "snake") return;
		const interval = setInterval(() => {
			activeGame.handleKey("tick");
			setGameFrame(activeGame.render());
			if (activeGame.isFinished()) clearInterval(interval);
		}, 150);
		return () => clearInterval(interval);
	}, [activeGame]);
	(0, import_react.useEffect)(() => {
		if (activeGame && gameContainerRef.current) gameContainerRef.current.focus();
	}, [activeGame]);
	const handleGameKey = (0, import_react.useCallback)((e) => {
		if (!activeGame) return;
		e.preventDefault();
		e.stopPropagation();
		if (e.key === "q" || e.key === "Escape") {
			const score = activeGame.getScore();
			setCommandHistory((prev) => [...prev, {
				command: activeGame.id,
				output: `${t.gameOver}: ${score}`
			}]);
			setActiveGame(null);
			setGameFrame("");
			return;
		}
		activeGame.handleKey(e.key);
		setGameFrame(activeGame.render());
		if (activeGame.isFinished()) setTimeout(() => {
			const score = activeGame.getScore();
			setCommandHistory((prev) => [...prev, {
				command: activeGame.id,
				output: `${t.gameOver}: ${score}`
			}]);
			setActiveGame(null);
			setGameFrame("");
		}, 1500);
	}, [activeGame, t]);
	const handleKeyDown = (e) => {
		if (e.key === "Tab") {
			e.preventDefault();
			const result = getCompletions(inputValue);
			setInputValue(result.completed);
			if (result.suggestions.length > 0) setCommandHistory((prev) => [...prev, {
				command: inputValue,
				output: result.suggestions.join("  ")
			}]);
			return;
		}
		resetTabCount();
		if (e.key === "Enter") {
			const cmd = inputValue.trim();
			if (!cmd) return;
			if (cmd === "clear") {
				setCommandHistory([]);
				setShowNeofetch(false);
				setInputValue("");
				return;
			}
			const result = processorRef.current.processCommand(cmd, currentPath);
			if (result.newPath) setCurrentPath(result.newPath);
			if (result.action) switch (result.action.type) {
				case "openPane":
					onOpenPane?.(result.action.payload);
					break;
				case "closePane":
					onClosePane?.(result.action.payload);
					break;
				case "startGame": {
					const game = createGame(result.action.payload);
					setActiveGame(game);
					setGameFrame(game.render());
					break;
				}
			}
			setCommandHistory((prev) => [...prev, result.output]);
			setInputValue("");
			setHistoryIdx(-1);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			const cmds = commandHistory.map((h) => h.command);
			if (cmds.length === 0) return;
			const newIdx = historyIdx < cmds.length - 1 ? historyIdx + 1 : historyIdx;
			setHistoryIdx(newIdx);
			setInputValue(cmds[cmds.length - 1 - newIdx] || "");
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			if (historyIdx <= 0) {
				setHistoryIdx(-1);
				setInputValue("");
			} else {
				const newIdx = historyIdx - 1;
				setHistoryIdx(newIdx);
				const cmds = commandHistory.map((h) => h.command);
				setInputValue(cmds[cmds.length - 1 - newIdx] || "");
			}
		}
	};
	if (activeGame) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: gameContainerRef,
		className: "font-mono text-xs h-full flex flex-col cursor-text outline-none",
		onKeyDown: handleGameKey,
		tabIndex: 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: contentRef,
			className: "flex-1 overflow-y-auto scroll-smooth px-3 pt-3 pb-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "text-foreground leading-tight",
				children: gameFrame
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-3 py-2 shrink-0 text-muted-foreground text-xs",
			children: t.pressQToQuit
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "font-mono text-xs h-full flex flex-col cursor-text",
		onClick: () => inputRef.current?.focus(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: contentRef,
			className: "flex-1 overflow-y-auto scroll-smooth px-3 pt-3 pb-1",
			children: [showNeofetch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-subtle mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "$"
						}), " neofetch"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Neofetch, {
						animate: false,
						locale
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2" })
				]
			}), commandHistory.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-primary flex-shrink-0",
						children: [
							"[",
							currentPath,
							"]$",
							" "
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground ml-1 break-all",
						children: entry.command
					})]
				}), entry.output && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `mt-1 whitespace-pre-wrap break-words ${entry.isError ? "text-destructive" : "text-muted-foreground"}`,
					children: entry.output
				})]
			}, index))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center px-3 py-2 shrink-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-primary mr-1 flex-shrink-0 text-xs",
					children: [
						"[",
						currentPath,
						"]$",
						" "
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					type: "text",
					value: inputValue,
					onChange: (e) => {
						setInputValue(e.target.value);
						resetTabCount();
					},
					onKeyDown: handleKeyDown,
					className: "flex-1 bg-transparent text-foreground outline-hidden font-mono caret-primary min-w-0 text-xs",
					placeholder: t.inputPlaceholder,
					autoComplete: "off"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block w-1.5 h-4 bg-primary-bold animate-pulse flex-shrink-0" })
			]
		})]
	});
}
var getGalleryData = createServerFn().handler(createSsrRpc("82c2b128e2c0488f11571d1a0cc4aed1cceba763408ece7966a556724be5f692"));
var MobileBackContext = (0, import_react.createContext)(null);
function useMobileBack() {
	return (0, import_react.useContext)(MobileBackContext);
}
function useMobileBackState() {
	const backRef = (0, import_react.useRef)(null);
	const [backLabel, setBackLabel] = (0, import_react.useState)(null);
	const [subtitle, setSubtitle] = (0, import_react.useState)(null);
	const [hasBack, setHasBack] = (0, import_react.useState)(false);
	const setBackAction = (0, import_react.useCallback)((action, label) => {
		backRef.current = action;
		setHasBack(action !== null);
		setBackLabel(label ?? null);
	}, []);
	return {
		hasBack,
		backLabel,
		subtitle,
		triggerBack: (0, import_react.useCallback)(() => {
			backRef.current?.();
		}, []),
		setBackAction,
		setSubtitle
	};
}
function formatShutter(val) {
	if (val >= 1) return `${val}s`;
	return `1/${Math.round(1 / val)}s`;
}
function useExifData(url) {
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!url || url.startsWith("/")) {
			setData(null);
			return;
		}
		setLoading(true);
		setData(null);
		tt.parse(url, {
			tiff: true,
			exif: true,
			gps: true,
			pick: [
				"DateTimeOriginal",
				"CreateDate",
				"Make",
				"Model",
				"LensModel",
				"FocalLength",
				"FNumber",
				"ExposureTime",
				"ISO",
				"ImageWidth",
				"ImageHeight",
				"ExifImageWidth",
				"ExifImageHeight",
				"latitude",
				"longitude"
			]
		}).then((exif) => {
			if (!exif) {
				setLoading(false);
				return;
			}
			const camera = [exif.Make, exif.Model].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
			const result = {
				dateTaken: exif.DateTimeOriginal?.toISOString?.() ?? exif.CreateDate?.toISOString?.(),
				camera: camera || void 0,
				lens: exif.LensModel || void 0,
				focalLength: exif.FocalLength ? `${exif.FocalLength}mm` : void 0,
				aperture: exif.FNumber ? `f/${exif.FNumber}` : void 0,
				shutter: exif.ExposureTime ? formatShutter(exif.ExposureTime) : void 0,
				iso: exif.ISO,
				latitude: exif.latitude,
				longitude: exif.longitude,
				width: exif.ExifImageWidth || exif.ImageWidth,
				height: exif.ExifImageHeight || exif.ImageHeight
			};
			setData(result);
			setLoading(false);
		}).catch(() => {
			setLoading(false);
		});
	}, [url]);
	return {
		data,
		loading
	};
}
function isSvg(src) {
	return src.toLowerCase().endsWith(".svg");
}
function formatDate(iso) {
	return new Date(iso).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
var SWIPE_THRESHOLD = 50;
var SWIPE_VELOCITY = 300;
var variants = {
	enter: (dir) => ({
		x: dir > 0 ? "100%" : "-100%",
		opacity: 0
	}),
	center: {
		x: 0,
		opacity: 1
	},
	exit: (dir) => ({
		x: dir > 0 ? "-100%" : "100%",
		opacity: 0
	})
};
function ImageDetail({ image, onSwipe, currentIndex, totalCount, adjacentSrcs }) {
	const { data: exif, loading: exifLoading } = useExifData(image.originalSrc);
	const displayDate = exif?.dateTaken ?? image.date ?? null;
	const hasPrev = currentIndex > 0;
	const hasNext = currentIndex < totalCount - 1;
	const directionRef = (0, import_react.useRef)(0);
	const prevIndexRef = (0, import_react.useRef)(currentIndex);
	if (currentIndex !== prevIndexRef.current) {
		directionRef.current = currentIndex > prevIndexRef.current ? 1 : -1;
		prevIndexRef.current = currentIndex;
	}
	const direction = directionRef.current;
	(0, import_react.useEffect)(() => {
		if (!adjacentSrcs?.length) return;
		adjacentSrcs.forEach((src) => {
			const img = new window.Image();
			img.src = src;
		});
	}, [adjacentSrcs]);
	const handleDragEnd = (0, import_react.useCallback)((_, info) => {
		if (!onSwipe) return;
		const { offset, velocity } = info;
		if (offset.x < -50 || velocity.x < -300) {
			if (hasNext) onSwipe("left");
		} else if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY) {
			if (hasPrev) onSwipe("right");
		}
	}, [
		onSwipe,
		hasNext,
		hasPrev
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 flex flex-col min-h-0 gap-1 relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 min-h-0 rounded-md overflow-hidden relative border border-control-border bg-black/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					initial: false,
					custom: direction,
					mode: "popLayout",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						custom: direction,
						variants,
						initial: "enter",
						animate: "center",
						exit: "exit",
						transition: {
							x: {
								type: "spring",
								stiffness: 300,
								damping: 30
							},
							opacity: { duration: .15 }
						},
						drag: "x",
						dragConstraints: {
							left: 0,
							right: 0
						},
						dragElastic: .7,
						onDragEnd: handleDragEnd,
						className: "absolute inset-0 select-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
							src: image.src,
							alt: "",
							fill: true,
							sizes: "(max-width: 768px) 100vw, 60vw",
							className: "object-contain pointer-events-none"
						})
					}, image.src)
				})
			}),
			onSwipe && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => hasPrev && onSwipe("right"),
					className: `absolute left-1.5 top-1/2 -translate-y-1/2 z-10 font-mono text-sm px-2 py-3 rounded bg-black/60 backdrop-blur-sm border border-white/10 transition-all ${hasPrev ? "text-primary hover:text-primary-bold hover:bg-black/80 active:scale-95" : "text-white/20 pointer-events-none"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, { weight: "bold" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute bottom-1.5 left-1/2 -translate-x-1/2 z-10 font-mono text-2xs tabular-nums px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-white/50",
					children: [
						"[",
						currentIndex + 1,
						"/",
						totalCount,
						"]"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => hasNext && onSwipe("left"),
					className: `absolute right-1.5 top-1/2 -translate-y-1/2 z-10 font-mono text-sm px-2 py-3 rounded bg-black/60 backdrop-blur-sm border border-white/10 transition-all ${hasNext ? "text-primary hover:text-primary-bold hover:bg-black/80 active:scale-95" : "text-white/20 pointer-events-none"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$1, { weight: "bold" })
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 min-h-[1.25rem] flex pt-2 flex-wrap gap-x-3 gap-y-0.5 text-2xs text-faded px-0.5",
				children: [
					exifLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "animate-pulse",
						children: "..."
					}),
					displayDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(displayDate) }),
					image.filename && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						" ",
						image.filename,
						" "
					] }),
					exif?.camera && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: exif.camera }),
					exif?.focalLength && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: [
						exif.focalLength,
						exif.aperture,
						exif.shutter,
						exif.iso ? `ISO${exif.iso}` : null
					].filter(Boolean).join(" · ") }),
					exif?.width && exif?.height && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						exif.width,
						"×",
						exif.height
					] }),
					exif?.latitude != null && exif?.longitude != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `https://www.google.com/maps?q=${exif.latitude},${exif.longitude}`,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "text-primary-dim hover:text-primary-medium transition-colors inline-flex items-center gap-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(p, { size: 12 }),
							exif.latitude.toFixed(4),
							", ",
							exif.longitude.toFixed(4)
						]
					})
				]
			})
		]
	});
}
function Thumbnail({ image, className }) {
	if (isSvg(image.src)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: image.src,
		alt: image.filename,
		className: `w-full h-full object-contain p-1.5 ${className ?? ""}`
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
		src: image.src,
		alt: image.filename,
		width: 200,
		height: 150,
		className: `w-full h-full object-cover ${className ?? ""}`
	});
}
function CategoryBrowser({ categories, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex-1 overflow-y-auto min-h-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3",
			children: categories.map((cat) => {
				const preview = cat.images[0];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onSelect(cat.name),
					className: "rounded-lg overflow-hidden border border-control-border hover:border-control-border-hover transition-all group bg-black/10 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-[3/2] overflow-hidden bg-black/20",
						children: preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumbnail, {
							image: preview,
							className: "group-hover:scale-105 transition-transform duration-300"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-2 py-1.5 flex items-baseline justify-between gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-primary truncate",
							children: [cat.name, "/"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xs text-ghost shrink-0",
							children: cat.images.length
						})]
					})]
				}, cat.name);
			})
		})
	});
}
function ImageGrid({ images, narrow, compact, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex-1 overflow-y-auto min-h-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `grid gap-3 ${narrow ? "grid-cols-2" : compact ? "grid-cols-4 @xs:grid-cols-5 @sm:grid-cols-6 @md:grid-cols-8" : "grid-cols-3 @xs:grid-cols-4 @sm:grid-cols-5 @md:grid-cols-6 @lg:grid-cols-7"}`,
			children: images.map((img) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onSelect(img),
				className: "rounded overflow-hidden border border-control-border hover:border-control-border-hover transition-all group bg-black/10 relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[4/3]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumbnail, {
						image: img,
						className: "group-hover:scale-105 transition-transform duration-200"
					})
				}), img.date && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-1 py-0.5 text-3xs text-white/70 text-left ${narrow ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`,
					children: formatDate(img.date)
				})]
			}, img.src))
		})
	});
}
function CategoryTabs({ categories, activeCategory, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-1 mb-1.5 @sm:mb-2 overflow-x-auto shrink-0",
		children: categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => onSelect(cat.name),
			className: `px-2 py-0.5 @sm:py-1 rounded text-2xs whitespace-nowrap transition-all ${activeCategory === cat.name ? "bg-surface-elevated text-primary border border-control-border-hover" : "text-faded border border-transparent hover:text-primary-medium hover:bg-control-hover"}`,
			children: [
				cat.name,
				"/",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-ghost ml-1",
					children: cat.images.length
				})
			]
		}, cat.name))
	});
}
function ImagePane({ ui }) {
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [activeCategory, setActiveCategory] = (0, import_react.useState)(null);
	const [selectedImage, setSelectedImage] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const { ref: containerRef, width, height } = useContainerSize();
	const compact = height > 0 && height < 250;
	const narrow = width > 0 && width < 400;
	(0, import_react.useEffect)(() => {
		getGalleryData().then((data) => {
			setCategories(data);
			setLoading(false);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (!narrow && !loading && categories.length > 0 && activeCategory === null) setActiveCategory(categories[0].name);
	}, [
		narrow,
		loading,
		categories,
		activeCategory
	]);
	const currentCategory = categories.find((c) => c.name === activeCategory);
	const adjacentSrcs = (0, import_react.useMemo)(() => {
		if (!selectedImage || !currentCategory) return [];
		const images = currentCategory.images;
		const idx = images.findIndex((img) => img.src === selectedImage.src);
		if (idx === -1) return [];
		const srcs = [];
		if (idx > 0) srcs.push(images[idx - 1].src);
		if (idx < images.length - 1) srcs.push(images[idx + 1].src);
		return srcs;
	}, [selectedImage, currentCategory]);
	const handleSwipe = (0, import_react.useCallback)((dir) => {
		if (!selectedImage || !currentCategory) return;
		const images = currentCategory.images;
		const idx = images.findIndex((img) => img.src === selectedImage.src);
		if (idx === -1) return;
		const next = dir === "left" ? idx + 1 : idx - 1;
		if (next >= 0 && next < images.length) setSelectedImage(images[next]);
	}, [selectedImage, currentCategory]);
	const handleSelectCategory = (0, import_react.useCallback)((name) => {
		setActiveCategory(name);
		setSelectedImage(null);
	}, []);
	const handleBack = (0, import_react.useCallback)(() => {
		setActiveCategory(null);
		setSelectedImage(null);
	}, []);
	const mobileBack = useMobileBack();
	const inMobileLayout = mobileBack !== null;
	(0, import_react.useEffect)(() => {
		if (!mobileBack) return;
		if (selectedImage) mobileBack.setBackAction(() => setSelectedImage(null));
		else if (narrow && activeCategory) mobileBack.setBackAction(() => {
			setActiveCategory(null);
			setSelectedImage(null);
		});
		else mobileBack.setBackAction(null);
		mobileBack.setSubtitle(activeCategory);
	}, [
		mobileBack,
		selectedImage,
		narrow,
		activeCategory
	]);
	const showBrowser = narrow && !activeCategory;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		className: "p-3 @xs:p-2.5 @sm:p-3 h-full flex flex-col",
		children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-subtle animate-pulse",
				children: ui.searchingGallery
			})
		}) : categories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col items-center justify-center gap-2 text-subtle",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m, { size: 28 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ui.emptyGallery })]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: showBrowser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryBrowser, {
			categories,
			onSelect: handleSelectCategory
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			narrow && !selectedImage ? !inMobileLayout && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 mb-1.5 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleBack,
					className: "text-primary-muted hover:text-primary active:text-primary transition-colors text-sm py-0.5 inline-flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$2, { size: 14 }), "~/gallery"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-ghost text-2xs",
					children: activeCategory
				})]
			}) : narrow ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryTabs, {
				categories,
				activeCategory,
				onSelect: handleSelectCategory
			}),
			selectedImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col min-h-0",
				children: [!inMobileLayout && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 mb-1 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSelectedImage(null),
						className: `text-primary-muted hover:text-primary active:text-primary transition-colors inline-flex items-center gap-1 ${narrow ? "text-sm py-1" : "text-2xs"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$2, { size: narrow ? 14 : 12 }), activeCategory]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageDetail, {
					image: selectedImage,
					onSwipe: handleSwipe,
					currentIndex: currentCategory ? currentCategory.images.findIndex((img) => img.src === selectedImage.src) : 0,
					totalCount: currentCategory?.images.length ?? 0,
					adjacentSrcs
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageGrid, {
				images: currentCategory?.images ?? [],
				narrow,
				compact,
				onSelect: setSelectedImage
			}),
			!compact && !narrow && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-1 border-t border-border-faint text-ghost text-2xs mt-1 flex justify-between shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [currentCategory?.images.length ?? 0, " images"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-primary-subtle",
					children: [
						"~/gallery/",
						activeCategory,
						"/"
					]
				})]
			})
		] }) })
	});
}
function Weather() {
	const [weather, setWeather] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const stored = read(KEYS.weather, true);
		if (stored) {
			setWeather(stored);
			return;
		}
		fetch("https://wttr.in/?format=%t+%C&m").then((r) => r.text()).then((text) => {
			const clean = text.trim().slice(0, 30);
			setWeather(clean);
			write(KEYS.weather, clean, true);
		}).catch(() => setWeather(null));
	}, []);
	if (!weather) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Trondheim • ", weather] });
}
var recordVisit = createServerFn({ method: "POST" }).validator((captchaToken) => captchaToken).handler(createSsrRpc("32acd23f426f29c3172a707333b8e9d6c331bdd3ae242f07b4cd945cec6318f0"));
var getVisitorCount = createServerFn().handler(createSsrRpc("aee85d5a0d58071f3fc30e793d1f8b5b1e59bd2b30d23931a84c0c92665dc12b"));
function VisitorCount({ label }) {
	const [count, setCount] = (0, import_react.useState)(null);
	const { executeRecaptcha } = useRecaptcha();
	(0, import_react.useEffect)(() => {
		getVisitorCount().then(setCount).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		if (read(KEYS.visited, true) || !executeRecaptcha) return;
		executeRecaptcha("record_visit").then((token) => recordVisit({ data: token })).then((result) => {
			if (result.success) {
				write(KEYS.visited, "1", true);
				if (result.count) setCount(result.count);
			}
		}).catch(() => {});
	}, [executeRecaptcha]);
	if (count === null) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
		label,
		": ",
		count
	] });
}
function Clock({ locale }) {
	const [time, setTime] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const update = () => {
			setTime((/* @__PURE__ */ new Date()).toLocaleTimeString(locale, {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
				hour12: false
			}));
		};
		update();
		const interval = setInterval(update, 1e3);
		return () => clearInterval(interval);
	}, [locale]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: time });
}
function StatusBar({ locale, ui, onOpenLauncher, onOpenSettings }) {
	const { resolvedTheme } = z();
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	const dark = mounted && isDarkTheme(resolvedTheme);
	const githubSrc = dark ? "/github-dark.svg" : "/github.svg";
	const linkedInSrc = dark ? "/linkedin-dark.svg" : "/linkedin.svg";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-0 left-0 right-0 flex items-center justify-between px-2 font-mono text-xs border-t border-wm-border bg-glass-heavy backdrop-blur-md select-none z-[9999]",
		style: { height: 28 },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2 min-w-0 flex-1 overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onOpenLauncher,
				className: "flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-launcher-bg text-primary hover:bg-launcher-hover active:bg-launcher-active transition-all font-bold border border-border-medium hover:border-chart-fill hover:shadow-xs hover:shadow-wm-shadow shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-2xs font-extrabold tracking-tight",
					children: "F"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-primary-medium hidden sm:inline",
					children: "FredOS"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 text-faded",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-primary-dim hidden sm:inline",
					children: [
						ui.uptime,
						": ",
						computeUptime()
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Weather, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisitorCount, { label: ui.visitors }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://www.linkedin.com/in/fredrir",
						target: "_blank",
						rel: "noopener noreferrer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
							src: linkedInSrc,
							alt: "LinkedIn",
							width: 12,
							height: 12,
							className: "opacity-50 hover:opacity-100 transition-opacity"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://www.github.com/fredrir",
						target: "_blank",
						rel: "noopener noreferrer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
							src: githubSrc,
							alt: "GitHub",
							width: 12,
							height: 12,
							className: "opacity-50 hover:opacity-100 transition-opacity"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onOpenSettings,
					className: "text-subtle hover:text-primary transition-colors text-xs",
					title: "Settings",
					children: "⚙"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { locale })
				})
			]
		})]
	});
}
var AboutPaneLazy = (0, import_react.lazy)(() => import("./_ssr/about-C8zVkLD9.mjs").then((m) => ({ default: m.AboutPane })));
function AboutPane(props) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: null,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutPaneLazy, { ...props })
	});
}
var POST_PANE_STEPS = /* @__PURE__ */ new Set([
	"launcher",
	"drag",
	"resize"
]);
function useWindowManagerView(ctx) {
	const { dict, locale, isMobile, tutorial, wm, bg, focus, floating, githubData, spotifyData } = ctx;
	const { ui, tutorial: tutorialStrings, landing, journey, project, contact, navbar } = dict;
	const tutorialIsFloating = tutorial.isActive && tutorial.step != null && POST_PANE_STEPS.has(tutorial.step.id);
	const tutorialIsFullscreen = tutorial.isActive && !tutorialIsFloating;
	const layoutMode = (() => {
		if (isMobile === null) return "loading";
		if (isMobile) return "mobile";
		const { maximizedId, states } = wm;
		if (maximizedId != null && states[maximizedId]?.isOpen) return "maximized";
		return "desktop";
	})();
	const maximizedConfig = configMap[wm.maximizedId];
	const paneContent = (0, import_react.useMemo)(() => ({
		about: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutPane, { landing }),
		github: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitHubPane, {
			initialData: githubData,
			ui
		}),
		spotify: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotifyPane, {
			initialData: spotifyData,
			ui,
			locale
		}),
		journey: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JourneyPane, {
			journey,
			onOpenDetail: floating.openJourneyDetail,
			ui
		}),
		projects: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectsPane, {
			title: project.title,
			projects: project.projects,
			onOpenDetail: floating.openProjectDetail,
			ui
		}),
		contact: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactPane, { contact }),
		settings: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPane, {
			navbar,
			currentLocale: locale,
			currentBackground: bg.current,
			onSelectBackground: bg.setBackground,
			ui,
			tutorial: tutorialStrings
		}),
		terminal: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TerminalPane, {
			locale,
			paneIds: WINDOW_CONFIGS.map((c) => c.id),
			projects: project.projects.map((p) => ({ title: p.title })),
			careers: journey.journeys.map((j) => ({
				jobTitle: j.jobTitle,
				company: j.company
			})),
			onOpenPane: focus.openPane,
			onClosePane: wm.closeWindow
		}),
		gallery: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePane, { ui })
	}), [
		dict,
		locale,
		githubData,
		spotifyData,
		bg.current,
		bg.setBackground,
		floating.openJourneyDetail,
		floating.openProjectDetail,
		focus.openPane,
		wm.closeWindow
	]);
	const statusBar = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBar, {
		locale,
		ui,
		onOpenLauncher: () => wm.setLauncherOpen(true),
		onOpenSettings: focus.openSettings
	});
	const tutorialOverlay = tutorial.isActive && tutorial.step ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TutorialOverlay, {
		t: tutorialStrings,
		ui,
		currentLocale: locale,
		tutorial,
		floating: tutorialIsFloating,
		isMobile: isMobile === true,
		launcherOpen: wm.launcherOpen,
		background: bg
	}) : null;
	const floatingDetail = floating.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingDetail, {
		title: floating.detail.title,
		onClose: floating.close,
		children: floating.detail.content
	}) : null;
	const appLauncher = wm.launcherOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppLauncher, {
		states: wm.states,
		ui,
		locale,
		onOpen: focus.openPane,
		onStop: wm.closeWindow,
		onClose: () => wm.setLauncherOpen(false)
	}) : null;
	const { dragTarget, dragPos, dragSize } = wm.drag;
	return {
		paneContent,
		layoutMode,
		maximizedConfig,
		tutorialIsFloating,
		tutorialIsFullscreen,
		statusBar,
		tutorialOverlay,
		floatingDetail,
		appLauncher,
		dragGhost: dragTarget && dragPos && dragSize && configMap[dragTarget] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DragGhost, {
			config: configMap[dragTarget],
			pos: dragPos,
			size: dragSize,
			children: paneContent[dragTarget]
		}) : null
	};
}
function hslToRgb(h, s, l) {
	s /= 100;
	l /= 100;
	const a = s * Math.min(l, 1 - l);
	const f = (n) => {
		const k = (n + h / 30) % 12;
		return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	};
	return `${Math.round(f(0) * 255)}, ${Math.round(f(8) * 255)}, ${Math.round(f(4) * 255)}`;
}
function readHslVar(name, fallback) {
	const hsl = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	if (!hsl) return fallback;
	const [h, s, l] = hsl.split(/\s+/).map((v) => parseFloat(v));
	return hslToRgb(h, s, l);
}
function useThemeRgb() {
	const primary = (0, import_react.useRef)("74, 222, 128");
	const bg = (0, import_react.useRef)("10, 14, 26");
	const update = (0, import_react.useCallback)(() => {
		primary.current = readHslVar("--primary", "74, 222, 128");
		bg.current = readHslVar("--background", "10, 14, 26");
	}, []);
	(0, import_react.useEffect)(() => {
		update();
		const obs = new MutationObserver(update);
		obs.observe(document.documentElement, {
			attributes: true,
			attributeFilter: [
				"class",
				"style",
				"data-theme"
			]
		});
		return () => obs.disconnect();
	}, [update]);
	return {
		primary,
		bg
	};
}
function StarfieldBackground() {
	const canvasRef = (0, import_react.useRef)(null);
	const { primary } = useThemeRgb();
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resize();
		window.addEventListener("resize", resize);
		const stars = Array.from({ length: 200 }, () => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			size: Math.random() * 1.5 + .5,
			speed: Math.random() * .3 + .05,
			brightness: Math.random(),
			phase: Math.random() * Math.PI * 2
		}));
		const connections = [];
		for (let i = 0; i < stars.length; i++) for (let j = i + 1; j < stars.length; j++) {
			const dx = stars[i].x - stars[j].x;
			const dy = stars[i].y - stars[j].y;
			if (Math.sqrt(dx * dx + dy * dy) < 120) connections.push({
				a: i,
				b: j
			});
		}
		let frame = 0;
		let raf;
		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			frame++;
			const t = frame * .01;
			const c = primary.current;
			connections.forEach(({ a, b }) => {
				const sa = stars[a];
				const sb = stars[b];
				const alpha = .03 + .02 * Math.sin(t + sa.phase);
				ctx.beginPath();
				ctx.moveTo(sa.x, sa.y);
				ctx.lineTo(sb.x, sb.y);
				ctx.strokeStyle = `rgba(${c}, ${alpha})`;
				ctx.lineWidth = .5;
				ctx.stroke();
			});
			stars.forEach((star) => {
				const twinkle = .3 + .7 * ((Math.sin(t * star.speed * 10 + star.phase) + 1) / 2);
				const alpha = star.brightness * twinkle * .6;
				ctx.beginPath();
				ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${c}, ${alpha})`;
				ctx.fill();
				if (star.size > 1.2 && twinkle > .8) {
					ctx.beginPath();
					ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(${c}, ${alpha * .15})`;
					ctx.fill();
				}
			});
			raf = requestAnimationFrame(draw);
		};
		raf = requestAnimationFrame(draw);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
		};
	}, [primary]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className: "absolute inset-0 w-full h-full"
	});
}
function MatrixBackground() {
	const canvasRef = (0, import_react.useRef)(null);
	const { primary, bg } = useThemeRgb();
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resize();
		window.addEventListener("resize", resize);
		const fontSize = 14;
		const cols = Math.floor(canvas.width / fontSize);
		const drops = new Array(cols).fill(1);
		const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
		const draw = () => {
			ctx.fillStyle = `rgba(${bg.current}, 0.05)`;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = `rgba(${primary.current}, 0.3)`;
			ctx.font = `${fontSize}px monospace`;
			for (let i = 0; i < drops.length; i++) {
				const text = chars[Math.floor(Math.random() * 56)];
				ctx.fillText(text, i * fontSize, drops[i] * fontSize);
				if (drops[i] * fontSize > canvas.height && Math.random() > .975) drops[i] = 0;
				drops[i]++;
			}
		};
		const interval = setInterval(draw, 50);
		return () => {
			clearInterval(interval);
			window.removeEventListener("resize", resize);
		};
	}, [primary, bg]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className: "absolute inset-0 w-full h-full"
	});
}
function GridBackground() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 [background-size:40px_40px]",
		style: { backgroundImage: `linear-gradient(color-mix(in srgb, var(--color-primary) 5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-primary) 5%, transparent) 1px, transparent 1px)` }
	});
}
function GradientBackground() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0",
			style: { background: `radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, var(--color-primary) 15%, transparent) 0%, transparent 70%)` }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0",
			style: { background: `radial-gradient(ellipse 60% 40% at 80% 100%, color-mix(in srgb, var(--color-primary) 8%, transparent) 0%, transparent 60%)` }
		})]
	});
}
function PlainBackground() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0",
		style: { background: `radial-gradient(ellipse at center, color-mix(in srgb, var(--color-primary) 3%, transparent) 0%, transparent 70%)` }
	});
}
function Background({ config }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 overflow-hidden bg-background transition-colors duration-500",
		children: [
			config.type === "animated-dots" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarfieldBackground, {}),
			config.type === "matrix" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatrixBackground, {}),
			config.type === "grid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridBackground, {}),
			config.type === "gradient" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradientBackground, {}),
			config.type === "custom-image" && config.value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-cover bg-center bg-no-repeat",
				style: { backgroundImage: `url(${config.value})` }
			}),
			config.type === "plain" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlainBackground, {})
		]
	});
}
function Shell({ background, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Background, { config: background }), children]
	});
}
function ContentArea({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative flex flex-col w-full",
		style: {
			height: `calc(100vh - 28px)`,
			padding: 10,
			gap: 0
		},
		children
	});
}
function useTipNotification(tutorialActive, ui) {
	const notification = useNotification();
	const notifRef = (0, import_react.useRef)(notification);
	notifRef.current = notification;
	const firedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (tutorialActive || firedRef.current) return;
		if (read(KEYS.tipDismissed, true)) return;
		firedRef.current = true;
		const timer = setTimeout(() => {
			notifRef.current.info(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary-medium font-bold",
					children: "Ctrl+K"
				}),
				" ",
				ui.tipLauncher,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary-hint mx-2",
					children: "|"
				}),
				ui.tipDrag,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-primary-hint mx-2",
					children: "|"
				}),
				ui.tipResize
			] }), { duration: 8e3 });
			write(KEYS.tipDismissed, "1", true);
		}, 2e3);
		return () => clearTimeout(timer);
	}, [tutorialActive, ui]);
}
var GRID_ICONS = {
	about: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(m$1, {
		size: 28,
		weight: "duotone"
	}),
	github: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$3, {
		size: 28,
		weight: "duotone"
	}),
	spotify: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p$1, {
		size: 28,
		weight: "duotone"
	}),
	journey: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, {
		size: 28,
		weight: "duotone"
	}),
	projects: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p$2, {
		size: 28,
		weight: "duotone"
	}),
	contact: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(i, {
		size: 28,
		weight: "duotone"
	}),
	settings: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$4, {
		size: 28,
		weight: "duotone"
	}),
	terminal: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, {
		size: 28,
		weight: "duotone"
	}),
	gallery: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, {
		size: 28,
		weight: "duotone"
	}),
	resume: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$5, {
		size: 28,
		weight: "duotone"
	})
};
function MobileHomeScreen({ onOpenApp, ui, locale }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 flex flex-col items-center justify-center px-6 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-mono text-sm text-readable mb-8 tracking-widest uppercase",
			children: "fredrik@hansteen"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-4 gap-x-4 gap-y-6 w-full max-w-sm",
			children: WINDOW_CONFIGS.map((config, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
				onClick: () => {
					if (config.isExternal && config.href) openExternalWindow(config, locale);
					else onOpenApp(config.id);
				},
				whileTap: { scale: .85 },
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					delay: i * .04,
					duration: .3
				},
				className: "flex flex-col items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-14 h-14 rounded-2xl bg-surface-soft border border-border-medium backdrop-blur-md flex items-center justify-center text-primary-bold shadow-md shadow-wm-shadow-soft active:bg-surface-elevated transition-colors",
					children: GRID_ICONS[config.id]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs text-readable truncate max-w-[4rem] capitalize",
					children: ui.localeTitles[config.id] ?? config.id
				})]
			}, config.id))
		})]
	});
}
function MobileLayout({ paneContent, mobile, ui, locale }) {
	const { activeApp } = mobile;
	const activeConfig = activeApp ? WINDOW_CONFIGS.find((c) => c.id === activeApp) : null;
	const { hasBack, backLabel, subtitle, triggerBack, setBackAction, setSubtitle } = useMobileBackState();
	(0, import_react.useEffect)(() => {
		setBackAction(null);
		setSubtitle(null);
	}, [
		activeApp,
		setBackAction,
		setSubtitle
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 flex flex-col",
		style: { paddingBottom: 80 },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			mode: "wait",
			children: activeApp === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					opacity: 0,
					scale: .95
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				exit: {
					opacity: 0,
					scale: .95
				},
				transition: {
					duration: .25,
					ease: "easeOut"
				},
				className: "flex-1 flex flex-col",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileHomeScreen, {
					onOpenApp: mobile.setActiveApp,
					ui,
					locale
				})
			}, "home") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: {
					opacity: 0,
					y: 20
				},
				transition: {
					duration: .3,
					ease: "easeOut"
				},
				className: "flex-1 flex flex-col min-h-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 flex flex-col m-3 rounded-xl border border-border-medium bg-glass-light backdrop-blur-md shadow-lg shadow-wm-shadow-soft overflow-hidden min-h-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center px-3 py-2 border-b border-wm-border bg-surface-faint shrink-0",
						children: [
							hasBack ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: triggerBack,
								className: "text-primary-soft hover:text-primary active:text-primary transition-colors mr-1 font-mono text-xs inline-flex items-center gap-1 shrink-0 ",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$2, {
									size: 18,
									weight: "bold"
								}), backLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xs",
									children: backLabel
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-5 shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-faded flex-1 text-center truncate",
								children: subtitle ?? (activeConfig && (ui.localeTitles[activeConfig.id] ?? activeConfig.title))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-primary-subtle",
								children: USER_HOST
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-auto @container font-mono text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileBackContext.Provider, {
							value: {
								setBackAction,
								setSubtitle
							},
							children: paneContent[activeApp]
						})
					})]
				})
			}, activeApp)
		})
	});
}
var BLOB_KEYFRAMES = [
	"60% 40% 55% 45% / 45% 60% 40% 55%",
	"40% 60% 45% 55% / 55% 40% 60% 40%",
	"55% 45% 60% 40% / 40% 55% 45% 60%",
	"60% 40% 55% 45% / 45% 60% 40% 55%"
];
function DockIcon({ icon, label, isActive, onTap }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
		whileTap: { scale: .85 },
		onClick: onTap,
		className: "flex flex-col items-center gap-0.5 w-14 overflow-hidden",
		animate: { marginBottom: isActive ? 16 : 0 },
		transition: {
			duration: .4,
			ease: "easeInOut"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			animate: {
				borderRadius: isActive ? BLOB_KEYFRAMES : "50%",
				scale: isActive ? 1.15 : .85
			},
			transition: {
				borderRadius: isActive ? {
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut"
				} : {
					duration: .4,
					ease: "easeOut"
				},
				scale: {
					duration: .4,
					ease: "easeInOut"
				}
			},
			className: `flex items-center justify-center transition-colors duration-300 ${isActive ? "text-primary" : "text-faded"}`,
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `text-xs truncate w-full text-center transition-colors ${isActive ? "text-primary-bold" : "text-ghost"}`,
			children: label
		})]
	});
}
var DOCK_IDS = [
	"about",
	"contact",
	"home",
	"terminal",
	"settings"
];
var DOCK_ICONS = {
	about: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o$2, {
		size: 20,
		weight: "bold"
	}),
	contact: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(i, {
		size: 20,
		weight: "bold"
	}),
	home: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n$1, {
		size: 22,
		weight: "bold"
	}),
	terminal: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c, {
		size: 20,
		weight: "bold"
	}),
	settings: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$4, {
		size: 20,
		weight: "bold"
	})
};
var DOCK_CENTERS = {
	about: 10,
	contact: 30,
	home: 50,
	terminal: 70,
	settings: 90
};
function bulgePoints(center) {
	const cl = (v) => Math.max(4.4, Math.min(95.6, v));
	return {
		left: cl(center - 15),
		lcp1: cl(center - 8),
		lcp2: cl(center - 4),
		rcp1: cl(center + 4),
		rcp2: cl(center + 8),
		right: cl(center + 15)
	};
}
function makePath(center, flat) {
	const b = bulgePoints(center);
	const y = flat ? 22 : 0;
	return `M 4.4,100 Q 0,100 0,78 L 0,44 Q 0,22 4.4,22 L ${b.left},22 C ${b.lcp1},22 ${b.lcp2},${y} ${center},${y} C ${b.rcp1},${y} ${b.rcp2},22 ${b.right},22 L 95.6,22 Q 100,22 100,44 L 100,78 Q 100,100 95.6,100 Z`;
}
function makeClipPath(center, flat) {
	const b = bulgePoints(center);
	const n = (v) => (v / 100).toFixed(3);
	const y = flat ? "0.22" : "0";
	return `M 0.044,1 Q 0,1 0,0.78 L 0,0.44 Q 0,0.22 0.044,0.22 L ${n(b.left)},0.22 C ${n(b.lcp1)},0.22 ${n(b.lcp2)},${y} ${n(center)},${y} C ${n(b.rcp1)},${y} ${n(b.rcp2)},0.22 ${n(b.right)},0.22 L 0.956,0.22 Q 1,0.22 1,0.44 L 1,0.78 Q 1,1 0.956,1 Z`;
}
function MobileDock({ mobile, ui }) {
	const { activeApp } = mobile;
	const activeId = activeApp ?? "home";
	const hasDockActive = activeApp === null || DOCK_IDS.includes(activeApp);
	const bulgeCenter = DOCK_CENTERS[activeId] ?? 50;
	const svgPath = makePath(bulgeCenter, !hasDockActive);
	const clipPath = makeClipPath(bulgeCenter, !hasDockActive);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-0 left-0 right-0 z-[9999] font-mono",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-3 mb-3 h-[4.5rem]",
			style: { filter: "drop-shadow(0 4px 12px var(--color-wm-shadow-soft, rgba(0,0,0,0.1)))" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					className: "absolute w-0 h-0",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("clipPath", {
						id: "dock-clip",
						clipPathUnits: "objectBoundingBox",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.path, {
							animate: { d: clipPath },
							transition: {
								duration: .4,
								ease: "easeInOut"
							}
						})
					}) })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-glass-faint backdrop-blur-xl",
					style: { clipPath: "url(#dock-clip)" }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					className: "absolute inset-0 w-full h-full pointer-events-none z-10",
					viewBox: "0 0 100 100",
					preserveAspectRatio: "none",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.path, {
						animate: { d: svgPath },
						transition: {
							duration: .4,
							ease: "easeInOut"
						},
						fill: "none",
						className: "stroke-wm-border",
						strokeWidth: "1",
						vectorEffect: "non-scaling-stroke"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative z-20 flex items-end justify-around h-full pb-2",
					children: DOCK_IDS.map((id) => {
						const isActive = id === "home" ? activeApp === null : activeApp === id;
						const label = ui.localeTitles[id] ?? (id === "home" ? "Home" : configMap[id].title);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DockIcon, {
							icon: DOCK_ICONS[id],
							label,
							isActive,
							onTap: id === "home" ? mobile.goHome : () => mobile.setActiveApp(id)
						}, id);
					})
				})
			]
		})
	});
}
function WindowManager({ currentLocale, dict, githubData, spotifyData }) {
	const { ui } = dict;
	const isMobile = useIsMobile();
	const tutorial = useTutorial(currentLocale);
	const wm = useTiling(tutorial.isActive);
	const bg = useBackground();
	const mobile = useMobileApp();
	const floating = useFloatingDetail(dict);
	const focus = useFocus(wm);
	useTutorialSync(tutorial, wm);
	useTipNotification(tutorial.isActive, ui);
	const view = useWindowManagerView({
		dict,
		locale: currentLocale,
		isMobile,
		tutorial,
		wm,
		bg,
		focus,
		floating,
		githubData,
		spotifyData
	});
	switch (view.layoutMode) {
		case "loading": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { background: bg.current });
		case "mobile": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
			background: bg.current,
			children: [
				!view.tutorialIsFullscreen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative z-10 h-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileLayout, {
						paneContent: view.paneContent,
						mobile,
						ui,
						locale: currentLocale
					})
				}),
				!tutorial.isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileDock, {
					mobile,
					ui
				}),
				view.tutorialOverlay,
				view.floatingDetail
			]
		});
		case "maximized": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
			background: bg.current,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentArea, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Window, {
					config: view.maximizedConfig,
					isFocused: true,
					onClose: () => wm.closeWindow(wm.maximizedId),
					onMaximize: () => wm.toggleMaximize(wm.maximizedId),
					children: view.paneContent[wm.maximizedId]
				}) }),
				view.statusBar,
				view.appLauncher,
				view.floatingDetail
			]
		});
		case "desktop": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
			background: bg.current,
			children: [
				!view.tutorialIsFullscreen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentArea, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TilingProvider, {
					value: {
						states: wm.states,
						focusedId: focus.focusedId,
						paneContent: view.paneContent,
						drag: wm.drag,
						resize: wm.resize,
						onClose: wm.closeWindow,
						onMaximize: wm.toggleMaximize,
						onFocus: focus.focus
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TilingGrid, {
						visibleLayout: wm.visibleLayout,
						rowHeights: wm.rowHeights,
						colWidths: wm.colWidths
					})
				}) }),
				!view.tutorialIsFullscreen && view.statusBar,
				view.appLauncher,
				view.tutorialOverlay,
				view.floatingDetail,
				view.dragGhost
			]
		});
	}
}
function Page() {
	const { locale, dict, githubData, spotifyData } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WindowManager, {
		currentLocale: locale,
		dict,
		githubData,
		spotifyData
	});
}
//#endregion
export { Page as component };
