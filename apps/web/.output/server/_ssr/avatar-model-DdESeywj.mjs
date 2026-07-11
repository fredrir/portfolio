import { o as __toESM } from "../_runtime.mjs";
import { T as require_react } from "../_libs/phosphor-icons__react+react.mjs";
import { a as Vector3, i as Quaternion, n as useFrame, r as Matrix4, s as require_jsx_runtime } from "../_libs/@react-three/fiber+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/avatar-model-DdESeywj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REACTIONS = [
	"spin",
	"bounce",
	"wiggle",
	"flip",
	"wave",
	"nod",
	"jello",
	"disco"
];
var SHIRT = "#B8A089";
var SKIN = "#F0C8AD";
var SKIN_SHADOW = "#E8BFA3";
var HAIR = "#8B6B4A";
var HAIR_DARK = "#5C3A1E";
var PANTS = "#1E3A5F";
var PANTS_DARK = "#162D4A";
var easeInOut = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
function sr(seed) {
	const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
}
function Hair() {
	const meshRef = (0, import_react.useRef)(null);
	const curls = (0, import_react.useMemo)(() => {
		const result = [];
		for (let i = 0; i < 150; i++) {
			const theta = sr(i * 7 + 1) * Math.PI * 2;
			const phi = sr(i * 13 + 3) * Math.PI * .6;
			const r = .44 + sr(i * 17 + 5) * .14;
			const x = r * Math.sin(phi) * Math.cos(theta);
			const y = r * Math.cos(phi);
			const z = r * Math.sin(phi) * Math.sin(theta);
			if (z > .2 && y < .1 && Math.abs(x) < .3) continue;
			if (z > .35 && sr(i * 41 + 9) > .3) continue;
			result.push({
				pos: new Vector3(x, y, z),
				s: .045 + sr(i * 23 + 7) * .05
			});
		}
		for (let i = 0; i < 30; i++) {
			const angle = sr(i * 11 + 100) * Math.PI * 2;
			if (!(Math.abs(Math.cos(angle)) > .5) && Math.sin(angle) > 0) continue;
			const y = -.08 + sr(i * 19 + 200) * .35;
			const rad = .46 + sr(i * 29 + 300) * .1;
			result.push({
				pos: new Vector3(Math.cos(angle) * rad, y, Math.sin(angle) * rad),
				s: .04 + sr(i * 31 + 400) * .04
			});
		}
		for (let i = 0; i < 18; i++) result.push({
			pos: new Vector3(-.2 + sr(i * 37 + 500) * .4, .28 + sr(i * 41 + 600) * .16, .3 + sr(i * 43 + 700) * .12),
			s: .03 + sr(i * 47 + 800) * .035
		});
		return result;
	}, []);
	(0, import_react.useEffect)(() => {
		if (!meshRef.current) return;
		const m = new Matrix4();
		const q = new Quaternion();
		const v = new Vector3();
		curls.forEach((curl, i) => {
			v.set(curl.s, curl.s, curl.s);
			m.compose(curl.pos, q, v);
			meshRef.current.setMatrixAt(i, m);
		});
		meshRef.current.instanceMatrix.needsUpdate = true;
	}, [curls]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
		ref: meshRef,
		args: [
			void 0,
			void 0,
			curls.length
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			1,
			8,
			8
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: HAIR,
			roughness: .85
		})]
	});
}
function Eye({ position, hovered }) {
	const groupRef = (0, import_react.useRef)(null);
	const irisRef = (0, import_react.useRef)(null);
	const pupilRef = (0, import_react.useRef)(null);
	const blinkRef = (0, import_react.useRef)({
		next: 2 + Math.random() * 3,
		progress: 1
	});
	useFrame((_, delta) => {
		if (!groupRef.current || !irisRef.current || !pupilRef.current) return;
		const target = hovered ? 1.3 : 1;
		const curr = irisRef.current.scale.x;
		const lerped = curr + (target - curr) * .12;
		irisRef.current.scale.setScalar(lerped);
		pupilRef.current.scale.setScalar(lerped);
		const b = blinkRef.current;
		b.next -= delta;
		if (b.next <= 0) {
			b.progress = 0;
			b.next = 4 + Math.random() * 6;
		}
		b.progress = Math.min(b.progress + delta * 4, 1);
		const openAmount = b.progress < .5 ? 1 - b.progress * 2 : (b.progress - .5) * 2;
		groupRef.current.scale.set(1, Math.max(openAmount, .05), 1);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		position,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: groupRef,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.055,
					16,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#F8F8F8" })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					ref: irisRef,
					position: [
						0,
						0,
						.035
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.03,
						16,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#0350F7" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					ref: pupilRef,
					position: [
						0,
						0,
						.048
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.015,
						16,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#111" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						.012,
						.012,
						.055
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.006,
						8,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#FFFFFF" })]
				})
			]
		})
	});
}
function Mouth({ expression }) {
	const groupRef = (0, import_react.useRef)(null);
	const talkRef = (0, import_react.useRef)({
		talking: false,
		next: 2 + Math.random() * 6,
		duration: 0
	});
	useFrame(({ clock }, delta) => {
		if (!groupRef.current) return;
		if (expression >= 0) {
			groupRef.current.scale.set(1, [
				.8,
				1.4,
				.3,
				.8,
				1.2,
				.5,
				1,
				1.6
			][expression], 1);
			return;
		}
		const s = talkRef.current;
		s.next -= delta;
		if (s.next <= 0) if (s.talking) {
			s.talking = false;
			s.next = 5 + Math.random() * 10;
		} else {
			s.talking = true;
			s.duration = 1.5 + Math.random() * 3;
			s.next = s.duration;
		}
		if (s.talking) {
			const t = clock.getElapsedTime();
			const wave = Math.sin(t * 8) * .4 + Math.sin(t * 13) * .3 + Math.sin(t * 5) * .2;
			const open = .3 + Math.max(0, wave) * 1.4;
			const wide = 1 + Math.max(0, wave) * .3;
			groupRef.current.scale.set(wide, open, 1);
		} else {
			const curr = groupRef.current.scale.y;
			const currX = groupRef.current.scale.x;
			groupRef.current.scale.set(currX + (1.15 - currX) * .1, curr + (.6 - curr) * .1, 1);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: groupRef,
		position: [
			0,
			-.14,
			.41
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				scale: [
					1.4,
					1,
					1
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.045,
					16,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#C4756E" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.05,
					.025,
					.005
				],
				scale: [
					.7,
					.7,
					.7
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.025,
					12,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#C4756E" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.05,
					.025,
					.005
				],
				scale: [
					.7,
					.7,
					.7
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.025,
					12,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#C4756E" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.02,
					.045
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.065,
					.018,
					.008
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#F5F5F0" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.018,
					.02,
					.05
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.02,
					.016,
					.006
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#FFFFFF" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.02,
					.05
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.02,
					.016,
					.006
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#FFFFFF" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.018,
					.02,
					.05
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.02,
					.016,
					.006
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#FFFFFF" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.02,
					.048
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.065,
					.016,
					.008
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#FFFFFF" })]
			})
		]
	});
}
function Collar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			0,
			-.56,
			.22
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-.07,
				0,
				0
			],
			rotation: [
				0,
				0,
				.35
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.13,
				.08,
				.015
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#C8B89E",
				roughness: .55
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.07,
				0,
				0
			],
			rotation: [
				0,
				0,
				-.35
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.13,
				.08,
				.015
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#C8B89E",
				roughness: .55
			})]
		})]
	});
}
function Buttons() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: [
		-.6,
		-.7,
		-.8,
		-.9,
		-1
	].map((y, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			0,
			y,
			.23
		],
		rotation: [
			Math.PI / 2,
			0,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
			.018,
			.018,
			.01,
			12
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#F0EDE8",
			roughness: .3
		})]
	}, i)) });
}
function Leg({ side }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			side * .1,
			-1.35,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
			.08,
			.35,
			16,
			32
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: PANTS,
			roughness: .95,
			metalness: .02
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			side * .1,
			-1.72,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
			.075,
			.3,
			16,
			32
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: PANTS_DARK,
			roughness: .95,
			metalness: .02
		})]
	})] });
}
function Shoe({ side }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			side * .1,
			-2,
			.04
		],
		rotation: [
			.3,
			0,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.12,
				.09,
				.2
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#F0F0F0",
				roughness: .4
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.045,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.12,
					.02,
					.2
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#E8E8E8",
					roughness: .5
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.045,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.13,
					.02,
					.21
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#DDDDDD",
					roughness: .6
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					side * -.03,
					.02,
					.06
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.03,
					.02,
					.015
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#E85D3A",
					roughness: .5
				})]
			})
		]
	});
}
function Hand({ side }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			0,
			-.36,
			.02
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				scale: [
					1,
					.8,
					.55
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.05,
					16,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: SKIN,
					roughness: .55
				})]
			}),
			[
				{
					x: -.03,
					length: .045,
					angle: -.15
				},
				{
					x: -.01,
					length: .055,
					angle: -.05
				},
				{
					x: .01,
					length: .05,
					angle: .05
				},
				{
					x: .03,
					length: .04,
					angle: .15
				}
			].map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				position: [
					f.x,
					-.05,
					0
				],
				rotation: [
					0,
					0,
					f.angle
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						-f.length / 2,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
						.012,
						f.length,
						8,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: SKIN,
						roughness: .55
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						-f.length - .005,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.011,
						8,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: SKIN_SHADOW,
						roughness: .6
					})]
				})]
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				position: [
					side * -.04,
					-.01,
					.01
				],
				rotation: [
					0,
					0,
					side * .7
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						-.018,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
						.013,
						.035,
						8,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: SKIN,
						roughness: .55
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						-.04,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.012,
						8,
						8
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: SKIN_SHADOW,
						roughness: .6
					})]
				})]
			})
		]
	});
}
function Arm({ side, reaction }) {
	const s = side;
	const shoulderRef = (0, import_react.useRef)(null);
	const elbowRef = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		if (!shoulderRef.current || !elbowRef.current) return;
		const t = clock.getElapsedTime();
		const o = s * 1.7;
		if (reaction === "idle") {
			shoulderRef.current.rotation.z = s * -.12 + Math.sin(t * .55 + o) * .07 + Math.sin(t * .21 + o) * .035;
			shoulderRef.current.rotation.x = Math.sin(t * .38 + o) * .05 + Math.sin(t * .15 + o) * .025;
			elbowRef.current.rotation.z = s * -.1 + Math.sin(t * .7 + o + .8) * .05 + Math.sin(t * .3 + o + 1.2) * .025;
			elbowRef.current.rotation.x = Math.sin(t * .45 + o + .5) * .03;
		} else if (reaction === "thumbsup" && s === 1) {
			shoulderRef.current.rotation.z = -2.6;
			shoulderRef.current.rotation.x = .2 + Math.sin(t * 1.5) * .03;
			elbowRef.current.rotation.z = .4;
			elbowRef.current.rotation.x = 0;
		} else if (reaction === "thumbsup" && s === -1) {
			shoulderRef.current.rotation.z = -.12 + Math.sin(t * .55 + o) * .04;
			shoulderRef.current.rotation.x = Math.sin(t * .38 + o) * .03;
			elbowRef.current.rotation.z = -.1 + Math.sin(t * .7 + o + .8) * .03;
			elbowRef.current.rotation.x = 0;
		} else {
			shoulderRef.current.rotation.set(0, 0, 0);
			elbowRef.current.rotation.set(0, 0, 0);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			s * .3,
			-.58,
			0
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			.07,
			24,
			24
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: SHIRT,
			roughness: .7
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			ref: shoulderRef,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.2,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
					.058,
					.26,
					16,
					32
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: SHIRT,
					roughness: .7
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				ref: elbowRef,
				position: [
					s * .04,
					-.36,
					0
				],
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
						.058,
						16,
						16
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
						color: SHIRT,
						roughness: .7
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
						position: [
							0,
							-.17,
							0
						],
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
							.052,
							.2,
							16,
							32
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
							color: SHIRT,
							roughness: .7
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hand, { side })
				]
			})]
		})]
	});
}
function AvatarModel({ reaction, hovered, exprIdx }) {
	const ref = (0, import_react.useRef)(null);
	const startRef = (0, import_react.useRef)(0);
	const prevRef = (0, import_react.useRef)("idle");
	(0, import_react.useEffect)(() => {
		if (reaction !== prevRef.current) {
			startRef.current = performance.now();
			prevRef.current = reaction;
		}
	}, [reaction]);
	useFrame(({ clock }) => {
		if (!ref.current) return;
		const g = ref.current;
		const e = (performance.now() - startRef.current) / 1e3;
		const BY = .75;
		g.rotation.set(0, 0, 0);
		g.position.set(0, BY, 0);
		g.scale.set(1, 1, 1);
		switch (reaction) {
			case "idle": {
				const t = clock.getElapsedTime();
				g.rotation.y = Math.sin(t * .5) * .06 + Math.sin(t * .17) * .03;
				g.rotation.x = Math.sin(t * .23) * .015 + Math.sin(t * .41) * .01;
				g.rotation.z = Math.sin(t * .35) * .02 + Math.sin(t * .13) * .008;
				const breath = Math.sin(t * 1.1) * .005;
				g.position.y = BY + Math.sin(t * .7) * .02 + breath;
				g.position.x = Math.sin(t * .19) * .008;
				g.scale.set(1, 1 + breath * 1.5, 1);
				break;
			}
			case "spin": {
				const p = Math.min(e / .8, 1);
				g.rotation.y = easeInOut(p) * Math.PI * 2;
				const s = 1 + Math.sin(p * Math.PI) * .12;
				g.scale.set(s, s, s);
				break;
			}
			case "bounce": {
				const p = Math.min(e / .9, 1);
				let yOff = 0;
				let sy = 1;
				if (p < .15) sy = 1 - p / .15 * .15;
				else if (p < .35) {
					const t = (p - .15) / .2;
					yOff = t * .5;
					sy = 1 + t * .05;
				} else if (p < .55) {
					const t = (p - .35) / .2;
					yOff = (1 - t) * .5;
					sy = 1 + (1 - t) * .05;
				} else if (p < .72) {
					const t = (p - .55) / .17;
					yOff = t * .2;
					sy = 1 + t * .02;
				} else {
					const t = (p - .72) / .28;
					yOff = (1 - t) * .2;
					sy = 1 + (1 - t) * .02;
				}
				g.position.y = BY + yOff;
				g.scale.set(1, sy, 1);
				break;
			}
			case "wiggle": {
				const p = Math.min(e / .7, 1);
				g.rotation.z = Math.sin(p * 22) * .25 * (1 - p);
				break;
			}
			case "flip": {
				const p = Math.min(e / .8, 1);
				g.rotation.x = easeInOut(p) * Math.PI * 2;
				const s = 1 + Math.sin(p * Math.PI) * .12;
				g.scale.set(s, s, s);
				break;
			}
			case "wave": {
				const p = Math.min(e / 1, 1);
				const decay = 1 - p * p;
				g.rotation.z = Math.sin(p * 16) * .2 * decay;
				g.position.x = Math.sin(p * 16) * .15 * decay;
				g.position.y = BY + Math.abs(Math.sin(p * 8)) * .1 * decay;
				break;
			}
			case "nod": {
				const p = Math.min(e / .9, 1);
				const decay = 1 - p;
				g.rotation.x = Math.sin(p * 14) * .2 * decay;
				g.position.y = BY + Math.sin(p * 14) * .05 * decay;
				break;
			}
			case "jello": {
				const p = Math.min(e / 1.2, 1);
				const decay = 1 - p;
				const freq = p * 20;
				g.scale.set(1 + Math.sin(freq) * .15 * decay, 1 + Math.sin(freq + Math.PI) * .15 * decay, 1 + Math.sin(freq + Math.PI * .5) * .1 * decay);
				g.rotation.z = Math.sin(freq * .7) * .08 * decay;
				break;
			}
			case "disco": {
				const p = Math.min(e / 1.4, 1);
				const decay = 1 - p * p;
				const t = p * 18;
				g.rotation.y = Math.sin(t) * .4 * decay;
				g.rotation.z = Math.sin(t * .7) * .15 * decay;
				g.position.y = BY + Math.abs(Math.sin(t * 1.5)) * .2 * decay;
				g.position.x = Math.sin(t * .5) * .12 * decay;
				const s = 1 + Math.sin(t * 2) * .06 * decay;
				g.scale.set(s, s, s);
				break;
			}
			case "thumbsup": {
				const t = clock.getElapsedTime();
				g.rotation.y = Math.sin(t * .4) * .05;
				g.rotation.z = -.05;
				g.position.y = BY + Math.sin(t * .8) * .02;
				break;
			}
		}
		if (hovered && reaction === "idle") g.scale.multiplyScalar(1.05);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		position: [
			0,
			.75,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				scale: [
					1,
					1.05,
					.95
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.42,
					32,
					32
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: SKIN,
					roughness: .55
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hair, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
				position: [
					-.11,
					.05,
					.36
				],
				hovered
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {
				position: [
					.11,
					.05,
					.36
				],
				hovered
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.11,
					.13,
					.37
				],
				rotation: [
					0,
					0,
					.12
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.08,
					.012,
					.015
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: HAIR_DARK })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.11,
					.13,
					.37
				],
				rotation: [
					0,
					0,
					-.12
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.08,
					.012,
					.015
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: HAIR_DARK })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.02,
					.41
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.022,
					16,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: SKIN_SHADOW,
					roughness: .6
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mouth, { expression: exprIdx }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					-.41,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.045,
					12,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: SKIN_SHADOW,
					roughness: .6
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					.41,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.045,
					12,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: SKIN_SHADOW,
					roughness: .6
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.5,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.1,
					.13,
					.18,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: SKIN,
					roughness: .55
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-.72,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.25,
					.22,
					.35,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: SHIRT,
					roughness: .7
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					-1,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.22,
					.2,
					.25,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: SHIRT,
					roughness: .7
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Buttons, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arm, {
				side: -1,
				reaction
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arm, {
				side: 1,
				reaction
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leg, { side: -1 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leg, { side: 1 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shoe, { side: -1 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shoe, { side: 1 })
		]
	});
}
//#endregion
export { REACTIONS as n, AvatarModel as t };
