//#region node_modules/.nitro/vite/services/ssr/assets/types-C3uRy3ln.js
var package_default$1 = {
	name: "@portfolio/web",
	version: "3.0.0",
	"private": true,
	type: "module",
	scripts: {
		"dev": "vite dev",
		"build": "vite build",
		"start": "node .output/server/index.mjs",
		"lint": "eslint .",
		"typecheck": "tsc --noEmit"
	},
	dependencies: {
		"@fontsource/roboto": "^5.2.10",
		"@formatjs/intl-localematcher": "^0.8.1",
		"@phosphor-icons/react": "^2.1.10",
		"@portfolio/api-client": "workspace:*",
		"@radix-ui/react-dropdown-menu": "^2.1.16",
		"@radix-ui/react-navigation-menu": "^1.2.14",
		"@radix-ui/react-slot": "^1.2.4",
		"@react-three/fiber": "^9.5.0",
		"@supabase/supabase-js": "^2.99.1",
		"@tanstack/react-router": "^1.170.17",
		"@tanstack/react-start": "^1.168.27",
		"@types/three": "^0.183.1",
		"clsx": "^2.1.1",
		"exifr": "^7.1.3",
		"focus-trap-react": "^12.0.0",
		"framer-motion": "^12.36.0",
		"negotiator": "^1.0.0",
		"next-themes": "^0.4.6",
		"react": "^19.2.4",
		"react-dom": "^19.2.4",
		"tailwind-merge": "^3.5.0",
		"three": "^0.183.2",
		"zod": "^4.3.6"
	},
	devDependencies: {
		"@tailwindcss/vite": "^4.3.2",
		"@types/negotiator": "^0.6.4",
		"@types/node": "^25.5.0",
		"@types/react": "^19.2.14",
		"@types/react-dom": "^19.2.3",
		"@vitejs/plugin-react": "^6.0.3",
		"eslint": "^10.0.3",
		"nitro": "^3.0.260610-beta",
		"tailwindcss": "^4.2.1",
		"typescript": "^5.9.3",
		"typescript-eslint": "^8.57.1",
		"vite": "^8.1.4"
	}
};
var package_default = {
	name: "tailwindcss",
	version: "4.3.2",
	description: "A utility-first CSS framework for rapidly building custom user interfaces.",
	license: "MIT",
	repository: {
		"type": "git",
		"url": "https://github.com/tailwindlabs/tailwindcss.git",
		"directory": "packages/tailwindcss"
	},
	bugs: "https://github.com/tailwindlabs/tailwindcss/issues",
	homepage: "https://tailwindcss.com",
	exports: {
		".": {
			"types": "./dist/lib.d.mts",
			"style": "./index.css",
			"require": "./dist/lib.js",
			"import": "./dist/lib.mjs"
		},
		"./plugin": {
			"require": "./dist/plugin.js",
			"import": "./dist/plugin.mjs"
		},
		"./plugin.js": {
			"require": "./dist/plugin.js",
			"import": "./dist/plugin.mjs"
		},
		"./defaultTheme": {
			"require": "./dist/default-theme.js",
			"import": "./dist/default-theme.mjs"
		},
		"./defaultTheme.js": {
			"require": "./dist/default-theme.js",
			"import": "./dist/default-theme.mjs"
		},
		"./colors": {
			"require": "./dist/colors.js",
			"import": "./dist/colors.mjs"
		},
		"./colors.js": {
			"require": "./dist/colors.js",
			"import": "./dist/colors.mjs"
		},
		"./lib/util/flattenColorPalette": {
			"require": "./dist/flatten-color-palette.js",
			"import": "./dist/flatten-color-palette.mjs"
		},
		"./lib/util/flattenColorPalette.js": {
			"require": "./dist/flatten-color-palette.js",
			"import": "./dist/flatten-color-palette.mjs"
		},
		"./package.json": "./package.json",
		"./index.css": "./index.css",
		"./index": "./index.css",
		"./preflight.css": "./preflight.css",
		"./preflight": "./preflight.css",
		"./theme.css": "./theme.css",
		"./theme": "./theme.css",
		"./utilities.css": "./utilities.css",
		"./utilities": "./utilities.css"
	},
	publishConfig: {
		"provenance": true,
		"access": "public"
	},
	style: "index.css",
	files: [
		"dist",
		"index.css",
		"preflight.css",
		"theme.css",
		"utilities.css"
	],
	devDependencies: {
		"@jridgewell/remapping": "^2.3.5",
		"@types/node": "22.19.19",
		"dedent": "1.7.2",
		"lightningcss": "1.32.0",
		"magic-string": "^0.30.21",
		"source-map-js": "^1.2.1",
		"@tailwindcss/oxide": "^4.3.2"
	},
	scripts: {
		"lint": "tsc --noEmit",
		"build": "tsup-node --env.NODE_ENV production",
		"dev": "tsup-node --env.NODE_ENV development --watch",
		"test:ui": "playwright test"
	}
};
var MY_NAME = "Fredrik Carsten Hansteen";
var BIRTHDAY = new Date(2003, 9, 2);
var MY_EMAIL = "fhansteen@gmail.com";
var MY_PHONE = "+47 476 30 231";
var USER_HOST = "fredrik@hansteen";
var GITHUB_USERNAME = "fredrir";
var PORTFOLIO_VERSION = package_default$1.version;
var START_VERSION = package_default$1.dependencies["@tanstack/react-start"].replace(/^[\^~]/, "");
var TAILWIND_VERSION = package_default.version;
var locales = [
	"en",
	"nb",
	"nn",
	"fr"
];
//#endregion
export { MY_PHONE as a, TAILWIND_VERSION as c, MY_NAME as i, USER_HOST as l, GITHUB_USERNAME as n, PORTFOLIO_VERSION as o, MY_EMAIL as r, START_VERSION as s, BIRTHDAY as t, locales as u };
