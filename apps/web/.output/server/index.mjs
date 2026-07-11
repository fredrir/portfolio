globalThis.__nitro_main__ = import.meta.url;
import { a as toEventHandler, c as serve, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, s as NodeResponse, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region ../../node_modules/.bun/nitro@3.0.260610-beta+893a4b3cb76b5019/node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/Online_hvit_o.svg": {
		"type": "image/svg+xml",
		"etag": "\"a17-Ka/cyjp3Xqiyvle9xMRc5cgAkpE\"",
		"mtime": "2026-07-11T14:26:06.679Z",
		"size": 2583,
		"path": "../public/Online_hvit_o.svg"
	},
	"/android-chrome-192x192.png": {
		"type": "image/png",
		"etag": "\"d1b5-j8tZsYCtAHEUSEiCTePHk6COBiM\"",
		"mtime": "2026-07-11T14:26:06.680Z",
		"size": 53685,
		"path": "../public/android-chrome-192x192.png"
	},
	"/app-picture-2.jpg": {
		"type": "image/jpeg",
		"etag": "\"1adec-Hei4kVlU6u0Za9OiMGDuLpVWqSc\"",
		"mtime": "2026-07-11T14:26:06.684Z",
		"size": 110060,
		"path": "../public/app-picture-2.jpg"
	},
	"/app-picture-3.jpg": {
		"type": "image/jpeg",
		"etag": "\"22cb4-ZrPCur2wnZ7C0IMznjiJfSM9UN4\"",
		"mtime": "2026-07-11T14:26:06.685Z",
		"size": 142516,
		"path": "../public/app-picture-3.jpg"
	},
	"/appkom-dark.svg": {
		"type": "image/svg+xml",
		"etag": "\"e02-dpGOAACe3Dmzu5nXO3Xra6vSTb4\"",
		"mtime": "2026-07-11T14:26:06.686Z",
		"size": 3586,
		"path": "../public/appkom-dark.svg"
	},
	"/appkom.png": {
		"type": "image/png",
		"etag": "\"b322-Y1/QISdaqWsB2AtY0dnwX+OK4Nc\"",
		"mtime": "2026-07-11T14:26:06.687Z",
		"size": 45858,
		"path": "../public/appkom.png"
	},
	"/appkom.svg": {
		"type": "image/svg+xml",
		"etag": "\"db3-bEUrSxrrgBykYuPnUZEwj1Qfwbk\"",
		"mtime": "2026-07-11T14:26:06.687Z",
		"size": 3507,
		"path": "../public/appkom.svg"
	},
	"/apple-icon.png": {
		"type": "image/png",
		"etag": "\"a8b0-5EufUVPdTqxTY/wJMuLt6Jp4n74\"",
		"mtime": "2026-07-11T14:26:06.687Z",
		"size": 43184,
		"path": "../public/apple-icon.png"
	},
	"/apple-touch-icon.png": {
		"type": "image/png",
		"etag": "\"bbc6-CORHNKNOhJrUgOl0JCN3fDvhl1k\"",
		"mtime": "2026-07-11T14:26:06.688Z",
		"size": 48070,
		"path": "../public/apple-touch-icon.png"
	},
	"/brick-wall.svg": {
		"type": "image/svg+xml",
		"etag": "\"fc-aGSSj7Y57ipl3l6UEANGIQoeZlU\"",
		"mtime": "2026-07-11T14:26:06.688Z",
		"size": 252,
		"path": "../public/brick-wall.svg"
	},
	"/circuit-board-dark.svg": {
		"type": "image/svg+xml",
		"etag": "\"bc55-7cxJYuL+J9LvRsbEaS7qMd4MpVY\"",
		"mtime": "2026-07-11T14:26:06.688Z",
		"size": 48213,
		"path": "../public/circuit-board-dark.svg"
	},
	"/android-chrome-512x512.png": {
		"type": "image/png",
		"etag": "\"5cd6e-NK9hrMfrvkVKouVI0v1uFfd85R4\"",
		"mtime": "2026-07-11T14:26:06.681Z",
		"size": 380270,
		"path": "../public/android-chrome-512x512.png"
	},
	"/close-icon.svg": {
		"type": "image/svg+xml",
		"etag": "\"168-ktcWVZSvj9jXqchxq6ZeH/RUUM0\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 360,
		"path": "../public/close-icon.svg"
	},
	"/circuit-board-light.svg": {
		"type": "image/svg+xml",
		"etag": "\"bc08-tUvfN+X5OptMOeUg3Nfl2SGWmMk\"",
		"mtime": "2026-07-11T14:26:06.688Z",
		"size": 48136,
		"path": "../public/circuit-board-light.svg"
	},
	"/favicon-16x16.png": {
		"type": "image/png",
		"etag": "\"344-piw2w94RC4eAU8T9VnX2fNtno/Y\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 836,
		"path": "../public/favicon-16x16.png"
	},
	"/favicon-32x32.png": {
		"type": "image/png",
		"etag": "\"943-Ps0G6K6xssLGlafNlUPn+mrHvbA\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 2371,
		"path": "../public/favicon-32x32.png"
	},
	"/github-dark.svg": {
		"type": "image/svg+xml",
		"etag": "\"3c0-8gK2+sz9XMRimbl2wmNf7mC1WqA\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 960,
		"path": "../public/github-dark.svg"
	},
	"/github.svg": {
		"type": "image/svg+xml",
		"etag": "\"3c3-ayMkKABhYN+XavjwWFor7lsQWd4\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 963,
		"path": "../public/github.svg"
	},
	"/hideout-dark.svg": {
		"type": "image/svg+xml",
		"etag": "\"284-Cpz6O4Yvg3Z6/fBau8WPQfGPN74\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 644,
		"path": "../public/hideout-dark.svg"
	},
	"/hideout-light.svg": {
		"type": "image/svg+xml",
		"etag": "\"284-ESMD08loXK6sbF6pvc3gJ0lgl+A\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 644,
		"path": "../public/hideout-light.svg"
	},
	"/app-picture.png": {
		"type": "image/png",
		"etag": "\"689d8-5zhuAApj/1iC2tdrEfgeAwmfHvI\"",
		"mtime": "2026-07-11T14:26:06.688Z",
		"size": 428504,
		"path": "../public/app-picture.png"
	},
	"/linkedin-dark.svg": {
		"type": "image/svg+xml",
		"etag": "\"54b-9GbDFBo8TcX53z2Pi5TCKnlA1zI\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 1355,
		"path": "../public/linkedin-dark.svg"
	},
	"/linkedin.svg": {
		"type": "image/svg+xml",
		"etag": "\"54d-C1b/HeJpbICg+svZhUcDRqhaAc0\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 1357,
		"path": "../public/linkedin.svg"
	},
	"/maritime-optima-dark.svg": {
		"type": "image/svg+xml",
		"etag": "\"c55-eUKooTOzLBugwKCjN3jTVOu+IDM\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 3157,
		"path": "../public/maritime-optima-dark.svg"
	},
	"/maritime-optima.svg": {
		"type": "image/svg+xml",
		"etag": "\"c6b-9E5es3+ORstu+PqS8cdET6jOVhA\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 3179,
		"path": "../public/maritime-optima.svg"
	},
	"/menu-burger.svg": {
		"type": "image/svg+xml",
		"etag": "\"2fa-HGkRj9D3ZBbbn7VbxgnhahIQLEM\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 762,
		"path": "../public/menu-burger.svg"
	},
	"/minus-icon.svg": {
		"type": "image/svg+xml",
		"etag": "\"b6-hBTckeOtR82jahhE3frZNV5x+ig\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 182,
		"path": "../public/minus-icon.svg"
	},
	"/nat-logo.png": {
		"type": "image/png",
		"etag": "\"c34-GKZ6YDCUqb6MFBQHZL/bN4uKbjY\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 3124,
		"path": "../public/nat-logo.png"
	},
	"/norges-tilstand.png": {
		"type": "image/png",
		"etag": "\"142fc-xRyP4EDSM30my91TQWE69Me7gX4\"",
		"mtime": "2026-07-11T14:26:06.692Z",
		"size": 82684,
		"path": "../public/norges-tilstand.png"
	},
	"/ntnu-logo-dark.svg": {
		"type": "image/svg+xml",
		"etag": "\"82c-U56G2nPfZ2TVvkRYhtYghFDY+Xo\"",
		"mtime": "2026-07-11T14:26:06.693Z",
		"size": 2092,
		"path": "../public/ntnu-logo-dark.svg"
	},
	"/ntnu-logo.svg": {
		"type": "image/svg+xml",
		"etag": "\"830-TmjV3gh1vMpJQxI6ax/VpR0gt3Q\"",
		"mtime": "2026-07-11T14:26:06.693Z",
		"size": 2096,
		"path": "../public/ntnu-logo.svg"
	},
	"/online-opptak.png": {
		"type": "image/png",
		"etag": "\"14c40-f8uSyw9tyRSIrRcO7F1yDLRxjyw\"",
		"mtime": "2026-07-11T14:26:06.694Z",
		"size": 85056,
		"path": "../public/online-opptak.png"
	},
	"/onlinefondet.png": {
		"type": "image/png",
		"etag": "\"192c3-BmbHRlf/8tOPbiUOrtrNOnm6XF4\"",
		"mtime": "2026-07-11T14:26:06.696Z",
		"size": 103107,
		"path": "../public/onlinefondet.png"
	},
	"/rif-logo-dark.svg": {
		"type": "image/svg+xml",
		"etag": "\"434-6xLpWjvfCDajYRtSpNS4hYxQ0LM\"",
		"mtime": "2026-07-11T14:26:06.700Z",
		"size": 1076,
		"path": "../public/rif-logo-dark.svg"
	},
	"/rif-logo.svg": {
		"type": "image/svg+xml",
		"etag": "\"437-f/k657yGt2pD9GzgSjgLsY5poAE\"",
		"mtime": "2026-07-11T14:26:06.700Z",
		"size": 1079,
		"path": "../public/rif-logo.svg"
	},
	"/portfolio.png": {
		"type": "image/png",
		"etag": "\"2f31c-cWpS+i4Bl+S8z5d0jvkZAcPgus8\"",
		"mtime": "2026-07-11T14:26:06.698Z",
		"size": 193308,
		"path": "../public/portfolio.png"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"41-C1RKF6/0MZeJtzRxX3UTs2NxOAQ\"",
		"mtime": "2026-07-11T14:26:06.703Z",
		"size": 65,
		"path": "../public/robots.txt"
	},
	"/onlove.webp": {
		"type": "image/webp",
		"etag": "\"b46a-LOQ+CIZblQiUKG9pbG+Yqb5qP2A\"",
		"mtime": "2026-07-11T14:26:06.697Z",
		"size": 46186,
		"path": "../public/onlove.webp"
	},
	"/Contact_Fredrik_Carsten_Hansteen.png": {
		"type": "image/png",
		"etag": "\"215d49-wKaldbmpNAXuR1ruP18Bip0lqPE\"",
		"mtime": "2026-07-11T14:26:06.686Z",
		"size": 2186569,
		"path": "../public/Contact_Fredrik_Carsten_Hansteen.png"
	},
	"/screenshot.png": {
		"type": "image/png",
		"etag": "\"483ee-uBQtgbWSF3V8YKJwm+KTUvhQIug\"",
		"mtime": "2026-07-11T14:26:06.705Z",
		"size": 295918,
		"path": "../public/screenshot.png"
	},
	"/rif.png": {
		"type": "image/png",
		"etag": "\"5a969-Y12SmU1LJWriHPFyfFbIFzF0fGg\"",
		"mtime": "2026-07-11T14:26:06.702Z",
		"size": 371049,
		"path": "../public/rif.png"
	},
	"/rif-mobile.jpg": {
		"type": "image/jpeg",
		"etag": "\"186bd-Lvga+lPFn5ZXNp1TzH9nloZOcrQ\"",
		"mtime": "2026-07-11T14:26:06.700Z",
		"size": 100029,
		"path": "../public/rif-mobile.jpg"
	},
	"/Fredrik_Carsten_Hansteen.png": {
		"type": "image/png",
		"etag": "\"290a2c-9te2x1T55jJFg52t8MYbAYDApg8\"",
		"mtime": "2026-07-11T14:26:06.688Z",
		"size": 2689580,
		"path": "../public/Fredrik_Carsten_Hansteen.png"
	},
	"/site.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"18d-nAl34zP4I6SaLFNb5/MswFs5emU\"",
		"mtime": "2026-07-11T14:26:06.707Z",
		"size": 397,
		"path": "../public/site.webmanifest"
	},
	"/square-icon-expanded.svg": {
		"type": "image/svg+xml",
		"etag": "\"7d5-NIpCQhXH6VO2jQcDZlxaX3u44Q4\"",
		"mtime": "2026-07-11T14:26:06.707Z",
		"size": 2005,
		"path": "../public/square-icon-expanded.svg"
	},
	"/square-icon.svg": {
		"type": "image/svg+xml",
		"etag": "\"1d3-n2bZdx/l3aC+wvsanMXu9hThEEw\"",
		"mtime": "2026-07-11T14:26:06.707Z",
		"size": 467,
		"path": "../public/square-icon.svg"
	},
	"/seniorbank.png": {
		"type": "image/png",
		"etag": "\"18393-6FCrzerIez7KRZ82BjQPXklqrnQ\"",
		"mtime": "2026-07-11T14:26:06.707Z",
		"size": 99219,
		"path": "../public/seniorbank.png"
	},
	"/assets/SSRBase.es-Ds1Hkmei.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b8-hXF4wwzMj2+5eM1S6QdGgdYOSmc\"",
		"mtime": "2026-07-11T14:26:06.465Z",
		"size": 440,
		"path": "../public/assets/SSRBase.es-Ds1Hkmei.js"
	},
	"/assets/about-DVFh9iZQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"254a-S5qtPQNF4IQ/7N/bFdKRe3KdCZg\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 9546,
		"path": "../public/assets/about-DVFh9iZQ.js"
	},
	"/assets/globals-BJtFCayd.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"efe1-hUcVKWQeE+gJq8Hn46vaRlaPcIs\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 61409,
		"path": "../public/assets/globals-BJtFCayd.css"
	},
	"/assets/index-rchZJzT1.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"2dfc-5jHNHoBGZwPhIUUzts6bsVHfPEU\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 11772,
		"path": "../public/assets/index-rchZJzT1.css"
	},
	"/assets/roboto-cyrillic-400-normal-Bjg-1-sg.woff": {
		"type": "font/woff",
		"etag": "\"291c-n1rPQADTSsUObsuQ1pM1oMw6hJE\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 10524,
		"path": "../public/assets/roboto-cyrillic-400-normal-Bjg-1-sg.woff"
	},
	"/assets/roboto-cyrillic-400-normal-CBPI_iaY.woff2": {
		"type": "font/woff2",
		"etag": "\"2f4c-Q0sJ3fsBi6YtQ9JgzVNfBfhiI3k\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 12108,
		"path": "../public/assets/roboto-cyrillic-400-normal-CBPI_iaY.woff2"
	},
	"/assets/roboto-cyrillic-ext-400-normal-CaK1767H.woff": {
		"type": "font/woff",
		"etag": "\"3fd0-xYUJTjLeSd18WioLRJ9S9KPEAhA\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 16336,
		"path": "../public/assets/roboto-cyrillic-ext-400-normal-CaK1767H.woff"
	},
	"/assets/_locale-CQnMx1Qr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5d94e-dCtMq1AvBF/XYzqMHuBlUArmkcU\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 383310,
		"path": "../public/assets/_locale-CQnMx1Qr.js"
	},
	"/y.png": {
		"type": "image/png",
		"etag": "\"59d92-H46SnQyOY1ug2mmbUeQs54Ap4hg\"",
		"mtime": "2026-07-11T14:26:06.708Z",
		"size": 368018,
		"path": "../public/y.png"
	},
	"/assets/roboto-cyrillic-ext-400-normal-qHufge6k.woff2": {
		"type": "font/woff2",
		"etag": "\"43dc-2/Gx6JBN/dz186jy3l4Yb9gQo1g\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 17372,
		"path": "../public/assets/roboto-cyrillic-ext-400-normal-qHufge6k.woff2"
	},
	"/assets/roboto-greek-400-normal-Bb5mj_fZ.woff": {
		"type": "font/woff",
		"etag": "\"1df4-+r+mtKCJmvDgtJ+XHPcd8xJH6PA\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 7668,
		"path": "../public/assets/roboto-greek-400-normal-Bb5mj_fZ.woff"
	},
	"/assets/roboto-greek-400-normal-ai2Z1K3C.woff2": {
		"type": "font/woff2",
		"etag": "\"2554-aHBVF7SLiiy/8rQDVenHEpujsKo\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 9556,
		"path": "../public/assets/roboto-greek-400-normal-ai2Z1K3C.woff2"
	},
	"/assets/roboto-latin-400-normal-BqEyEoaF.woff2": {
		"type": "font/woff2",
		"etag": "\"557c-oL7FY2Q3J9gb8h0KzsCCJ9kmnaQ\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 21884,
		"path": "../public/assets/roboto-latin-400-normal-BqEyEoaF.woff2"
	},
	"/assets/roboto-latin-ext-400-normal-C3tdtHj3.woff2": {
		"type": "font/woff2",
		"etag": "\"3ac0-67nV5oz1eg/PhUS2+fPJS9yAZzk\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 15040,
		"path": "../public/assets/roboto-latin-ext-400-normal-C3tdtHj3.woff2"
	},
	"/assets/roboto-latin-400-normal-DyYNIH4P.woff": {
		"type": "font/woff",
		"etag": "\"5510-Etolj9MVDOt1rt4HE73x4syAxYg\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 21776,
		"path": "../public/assets/roboto-latin-400-normal-DyYNIH4P.woff"
	},
	"/assets/roboto-latin-ext-400-normal-scX0fKtV.woff": {
		"type": "font/woff",
		"etag": "\"37e8-5TesS75wO43UGIUgvR76JSTnseY\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 14312,
		"path": "../public/assets/roboto-latin-ext-400-normal-scX0fKtV.woff"
	},
	"/assets/roboto-math-400-normal-BEFej5gc.woff2": {
		"type": "font/woff2",
		"etag": "\"4e78-/RCudDbBPNRpSs7vU78Dvv8WqsA\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 20088,
		"path": "../public/assets/roboto-math-400-normal-BEFej5gc.woff2"
	},
	"/assets/index-DZZnyDxm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135741-+gKKL9HGl0KGFD/k0Ra0xoTAC6s\"",
		"mtime": "2026-07-11T14:26:06.464Z",
		"size": 1267521,
		"path": "../public/assets/index-DZZnyDxm.js"
	},
	"/assets/roboto-math-400-normal-C9RxBKAh.woff": {
		"type": "font/woff",
		"etag": "\"4b1c-BrR6vjFeQi7xsMJNXiT0qxMOvsU\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 19228,
		"path": "../public/assets/roboto-math-400-normal-C9RxBKAh.woff"
	},
	"/assets/roboto-symbols-400-normal-CB1Ce4Gk.woff2": {
		"type": "font/woff2",
		"etag": "\"29f0-CokTEDuhT/85OsuWuIKbZGCbbrw\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 10736,
		"path": "../public/assets/roboto-symbols-400-normal-CB1Ce4Gk.woff2"
	},
	"/assets/roboto-symbols-400-normal-DLYbZahX.woff": {
		"type": "font/woff",
		"etag": "\"2308-3O0rtU+RZoAVbvDR9zyfAWGlzac\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 8968,
		"path": "../public/assets/roboto-symbols-400-normal-DLYbZahX.woff"
	},
	"/assets/roboto-vietnamese-400-normal-D2PTxGxD.woff2": {
		"type": "font/woff2",
		"etag": "\"20b0-4a3t8bBxKGleOVvLs5IS+Etsszo\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 8368,
		"path": "../public/assets/roboto-vietnamese-400-normal-D2PTxGxD.woff2"
	},
	"/assets/roboto-vietnamese-400-normal-DnpnVwnf.woff": {
		"type": "font/woff",
		"etag": "\"18c8-d8nM/KeR5AMfp1IbAUU36Mvi7F4\"",
		"mtime": "2026-07-11T14:26:06.466Z",
		"size": 6344,
		"path": "../public/assets/roboto-vietnamese-400-normal-DnpnVwnf.woff"
	},
	"/flags/fr.svg": {
		"type": "image/svg+xml",
		"etag": "\"168-z4eodlVrzhg3s9FbLYW3SL8CpFU\"",
		"mtime": "2026-07-11T14:26:06.674Z",
		"size": 360,
		"path": "../public/flags/fr.svg"
	},
	"/flags/gb.svg": {
		"type": "image/svg+xml",
		"etag": "\"246-yhduSNsInS9tbifFVo8nPNxow04\"",
		"mtime": "2026-07-11T14:26:06.674Z",
		"size": 582,
		"path": "../public/flags/gb.svg"
	},
	"/movie-tracker.png": {
		"type": "image/png",
		"etag": "\"2b11e5-iQMAVZ8h50Bs1P+OA+QAm1g21A4\"",
		"mtime": "2026-07-11T14:26:06.707Z",
		"size": 2822629,
		"path": "../public/movie-tracker.png"
	},
	"/flags/no.svg": {
		"type": "image/svg+xml",
		"etag": "\"131-Xa/6n+l9KOx95JDt0pZ61os8iSY\"",
		"mtime": "2026-07-11T14:26:06.674Z",
		"size": 305,
		"path": "../public/flags/no.svg"
	},
	"/gallery/career/appkom-dark.svg": {
		"type": "image/svg+xml",
		"etag": "\"e02-dpGOAACe3Dmzu5nXO3Xra6vSTb4\"",
		"mtime": "2026-07-11T14:26:06.678Z",
		"size": 3586,
		"path": "../public/gallery/career/appkom-dark.svg"
	},
	"/gallery/career/appkom.svg": {
		"type": "image/svg+xml",
		"etag": "\"db3-bEUrSxrrgBykYuPnUZEwj1Qfwbk\"",
		"mtime": "2026-07-11T14:26:06.675Z",
		"size": 3507,
		"path": "../public/gallery/career/appkom.svg"
	},
	"/gallery/career/maritime-optima-dark.svg": {
		"type": "image/svg+xml",
		"etag": "\"c55-eUKooTOzLBugwKCjN3jTVOu+IDM\"",
		"mtime": "2026-07-11T14:26:06.678Z",
		"size": 3157,
		"path": "../public/gallery/career/maritime-optima-dark.svg"
	},
	"/gallery/career/nat-logo.png": {
		"type": "image/png",
		"etag": "\"c34-GKZ6YDCUqb6MFBQHZL/bN4uKbjY\"",
		"mtime": "2026-07-11T14:26:06.678Z",
		"size": 3124,
		"path": "../public/gallery/career/nat-logo.png"
	},
	"/gallery/career/maritime-optima.svg": {
		"type": "image/svg+xml",
		"etag": "\"c6b-9E5es3+ORstu+PqS8cdET6jOVhA\"",
		"mtime": "2026-07-11T14:26:06.678Z",
		"size": 3179,
		"path": "../public/gallery/career/maritime-optima.svg"
	},
	"/gallery/career/ntnu-logo-dark.svg": {
		"type": "image/svg+xml",
		"etag": "\"82c-U56G2nPfZ2TVvkRYhtYghFDY+Xo\"",
		"mtime": "2026-07-11T14:26:06.678Z",
		"size": 2092,
		"path": "../public/gallery/career/ntnu-logo-dark.svg"
	},
	"/gallery/career/ntnu-logo.svg": {
		"type": "image/svg+xml",
		"etag": "\"830-TmjV3gh1vMpJQxI6ax/VpR0gt3Q\"",
		"mtime": "2026-07-11T14:26:06.678Z",
		"size": 2096,
		"path": "../public/gallery/career/ntnu-logo.svg"
	},
	"/gallery/career/rif-logo-dark.svg": {
		"type": "image/svg+xml",
		"etag": "\"434-6xLpWjvfCDajYRtSpNS4hYxQ0LM\"",
		"mtime": "2026-07-11T14:26:06.678Z",
		"size": 1076,
		"path": "../public/gallery/career/rif-logo-dark.svg"
	},
	"/gallery/career/rif-logo.svg": {
		"type": "image/svg+xml",
		"etag": "\"437-f/k657yGt2pD9GzgSjgLsY5poAE\"",
		"mtime": "2026-07-11T14:26:06.678Z",
		"size": 1079,
		"path": "../public/gallery/career/rif-logo.svg"
	},
	"/gallery/projects/app-picture-2.jpg": {
		"type": "image/jpeg",
		"etag": "\"1adec-Hei4kVlU6u0Za9OiMGDuLpVWqSc\"",
		"mtime": "2026-07-11T14:26:06.675Z",
		"size": 110060,
		"path": "../public/gallery/projects/app-picture-2.jpg"
	},
	"/gallery/projects/app-picture-3.jpg": {
		"type": "image/jpeg",
		"etag": "\"22cb4-ZrPCur2wnZ7C0IMznjiJfSM9UN4\"",
		"mtime": "2026-07-11T14:26:06.676Z",
		"size": 142516,
		"path": "../public/gallery/projects/app-picture-3.jpg"
	},
	"/gallery/projects/app-picture.png": {
		"type": "image/png",
		"etag": "\"689d8-5zhuAApj/1iC2tdrEfgeAwmfHvI\"",
		"mtime": "2026-07-11T14:26:06.677Z",
		"size": 428504,
		"path": "../public/gallery/projects/app-picture.png"
	},
	"/cv-en.pdf": {
		"type": "application/pdf",
		"etag": "\"48a9db-Oq6GfHFluPX1qZIZ6n0snigY62o\"",
		"mtime": "2026-07-11T14:26:06.711Z",
		"size": 4762075,
		"path": "../public/cv-en.pdf"
	},
	"/cv-nb.pdf": {
		"type": "application/pdf",
		"etag": "\"48b299-Z0/+MeL5Xi+QBpyvkmwFfmTySq8\"",
		"mtime": "2026-07-11T14:26:06.715Z",
		"size": 4764313,
		"path": "../public/cv-nb.pdf"
	},
	"/gallery/projects/appkom.png": {
		"type": "image/png",
		"etag": "\"b322-Y1/QISdaqWsB2AtY0dnwX+OK4Nc\"",
		"mtime": "2026-07-11T14:26:06.675Z",
		"size": 45858,
		"path": "../public/gallery/projects/appkom.png"
	},
	"/gallery/projects/norges-tilstand.png": {
		"type": "image/png",
		"etag": "\"142fc-xRyP4EDSM30my91TQWE69Me7gX4\"",
		"mtime": "2026-07-11T14:26:06.677Z",
		"size": 82684,
		"path": "../public/gallery/projects/norges-tilstand.png"
	},
	"/gallery/projects/online-opptak.png": {
		"type": "image/png",
		"etag": "\"14c40-f8uSyw9tyRSIrRcO7F1yDLRxjyw\"",
		"mtime": "2026-07-11T14:26:06.676Z",
		"size": 85056,
		"path": "../public/gallery/projects/online-opptak.png"
	},
	"/gallery/projects/onlove.webp": {
		"type": "image/webp",
		"etag": "\"b46a-LOQ+CIZblQiUKG9pbG+Yqb5qP2A\"",
		"mtime": "2026-07-11T14:26:06.677Z",
		"size": 46186,
		"path": "../public/gallery/projects/onlove.webp"
	},
	"/gallery/projects/onlinefondet.png": {
		"type": "image/png",
		"etag": "\"192c3-BmbHRlf/8tOPbiUOrtrNOnm6XF4\"",
		"mtime": "2026-07-11T14:26:06.677Z",
		"size": 103107,
		"path": "../public/gallery/projects/onlinefondet.png"
	},
	"/gallery/projects/rif.png": {
		"type": "image/png",
		"etag": "\"5a969-Y12SmU1LJWriHPFyfFbIFzF0fGg\"",
		"mtime": "2026-07-11T14:26:06.678Z",
		"size": 371049,
		"path": "../public/gallery/projects/rif.png"
	},
	"/gallery/projects/seniorbank.png": {
		"type": "image/png",
		"etag": "\"18393-6FCrzerIez7KRZ82BjQPXklqrnQ\"",
		"mtime": "2026-07-11T14:26:06.678Z",
		"size": 99219,
		"path": "../public/gallery/projects/seniorbank.png"
	},
	"/gallery/projects/y.png": {
		"type": "image/png",
		"etag": "\"59d92-H46SnQyOY1ug2mmbUeQs54Ap4hg\"",
		"mtime": "2026-07-11T14:26:06.679Z",
		"size": 368018,
		"path": "../public/gallery/projects/y.png"
	},
	"/gallery/projects/movie-tracker.png": {
		"type": "image/png",
		"etag": "\"2b11e5-iQMAVZ8h50Bs1P+OA+QAm1g21A4\"",
		"mtime": "2026-07-11T14:26:06.686Z",
		"size": 2822629,
		"path": "../public/gallery/projects/movie-tracker.png"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region ../../node_modules/.bun/nitro@3.0.260610-beta+893a4b3cb76b5019/node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_92DcJT = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_92DcJT
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region ../../node_modules/.bun/nitro@3.0.260610-beta+893a4b3cb76b5019/node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region ../../node_modules/.bun/nitro@3.0.260610-beta+893a4b3cb76b5019/node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region ../../node_modules/.bun/nitro@3.0.260610-beta+893a4b3cb76b5019/node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region ../../node_modules/.bun/nitro@3.0.260610-beta+893a4b3cb76b5019/node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
