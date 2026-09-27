import { t as e } from "./trafficSignDataDE-DWppUD4J.js";
//#region \0rolldown/runtime.js
var t = Object.create, n = Object.defineProperty, r = Object.getOwnPropertyDescriptor, i = Object.getOwnPropertyNames, a = Object.getPrototypeOf, o = Object.prototype.hasOwnProperty, s = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), c = (e, t, a, s) => {
	if (t && typeof t == "object" || typeof t == "function") for (var c = i(t), l = 0, u = c.length, d; l < u; l++) d = c[l], !o.call(e, d) && d !== a && n(e, d, {
		get: ((e) => t[e]).bind(null, d),
		enumerable: !(s = r(t, d)) || s.enumerable
	});
	return e;
}, l = (e, r, i) => (i = e == null ? {} : t(a(e)), c(r || !e || !e.__esModule ? n(i, "default", {
	value: e,
	enumerable: !0
}) : i, e)), u = { DE: e }, d = Object.keys(u);
new Map(Object.entries(u));
//#endregion
//#region src/data-definitions/valuePromptFormats.ts
var f = {
	integer: { type: "number" },
	float: {
		type: "number",
		step: "0.1"
	},
	opening_hours: { type: "text" },
	time_restriction: { type: "text" }
}, p = (e) => f[e], m = (e) => e === "opening_hours" || e === "time_restriction", h = [
	"city_limit",
	"maxspeed",
	"none",
	"destination",
	"yes",
	"variable",
	"hazard",
	"signals",
	"give_way",
	"stop",
	"variable_message"
], g = [{
	from: "no",
	to: "none"
}], _ = (e) => {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) if (n.redirects) for (let e of n.redirects) t.set(e.from, e.to);
	for (let e of g) t.set(e.from, e.to);
	return t;
}, v = (e, t) => e.startsWith("\"") && e.endsWith("\"") ? e : t ? `${e}[${t}]` : e, y = (e, t) => `${e}_${(typeof t == "string" ? t : t.osmValuePart).replace(/\[/g, "__").replace(/\]/g, "__").replace(/[^a-zA-Z0-9_]/g, "_")}`, b = (e, t, n) => {
	let r = [];
	for (let [n, i] of e.entries()) i.signId === t && r.push(i);
	if (r.length === 1) return r[0];
	if (r.length > 1) return n ? r.find((e) => e.signValue) || void 0 : r.find((e) => !e.signValue) || void 0;
}, x = (e, t) => ({
	...t,
	recodgnizedSign: !0,
	svgName: y(e, t.osmValuePart)
}), S = (e) => {
	let t = /* @__PURE__ */ new Map();
	for (let n of u[e]) t.set(n.osmValuePart, x(e, n));
	return t;
}, C = (e, t) => e.replaceAll(`${t}:`, "").replaceAll(`${t.toLocaleLowerCase()}:`, ""), w = (e) => {
	let t = e.split("=");
	return t[0]?.includes("traffic_sign") ? (t.splice(0, 1), t.join("=")) : e;
}, T = (e) => e.split(/[,;](?![^\[\]]*\])(?![^"]*"(?:[^"]*"[^"]*")*[^"]*$)/).map((e) => e.trim()), E = (e) => e.startsWith("\"") && e.endsWith("\"") ? {
	signId: e,
	signValue: void 0
} : {
	signId: e.split("[").at(0),
	signValue: e.split("[").at(1)?.replace("]", "")
}, D = /* @__PURE__ */ new Map(), O = (e) => {
	let t = D.get(e);
	if (!t) {
		let n = u[e];
		t = _(n), D.set(e, t);
	}
	return t;
}, k = (e, t) => {
	if (!t) return [];
	let n = S(t), r = e;
	r = w(r), r = C(r, t);
	let i = T(r), a = /* @__PURE__ */ new Map();
	for (let [e, n] of O(t).entries()) a.set(e.toLowerCase(), n);
	return i = i.map((e) => {
		let t = a.get(e.toLowerCase());
		if (t) {
			let r = n.get(t);
			if (!r) {
				let { signId: e, signValue: i } = E(t);
				r = b(n, e, i);
			}
			if (r) return r.matchdByAlternativeKey = e, n.set(t, r), t;
			if (h.includes(t)) return t;
		}
		return e;
	}).filter(Boolean), i.forEach((e) => {
		let { signId: r, signValue: i } = E(e);
		if (!i) return;
		let a = b(n, r, i);
		a && (a.svgName = y(t, a.osmValuePart), a.osmValuePart = v(r, i), a.signValue = i);
	}), i.map((e) => {
		let { signId: i, signValue: a } = E(e), o = b(n, i, a);
		return o ? {
			svgName: y(t, e),
			...o,
			recodgnizedSign: !0
		} : {
			recodgnizedSign: !1,
			osmValuePart: e,
			signValue: e,
			signId: null,
			descriptiveName: e,
			kind: r.split(";").includes(e) ? "traffic_sign" : "exception_modifier",
			svgName: null
		};
	});
}, A = /* @__PURE__ */ l((/* @__PURE__ */ s(((e, t) => {
	(function() {
		var n = Math.PI, r = Math.sin, i = Math.cos, a = Math.tan, o = Math.asin, s = Math.atan2, c = Math.acos, l = n / 180, u = 1e3 * 60 * 60 * 24, d = 2440588, f = 2451545;
		function p(e) {
			return e.valueOf() / u - .5 + d;
		}
		function m(e) {
			return new Date((e + .5 - d) * u);
		}
		function h(e) {
			return p(e) - f;
		}
		var g = l * 23.4397;
		function _(e, t) {
			return s(r(e) * i(g) - a(t) * r(g), i(e));
		}
		function v(e, t) {
			return o(r(t) * i(g) + i(t) * r(g) * r(e));
		}
		function y(e, t, n) {
			return s(r(e), i(e) * r(t) - a(n) * i(t));
		}
		function b(e, t, n) {
			return o(r(t) * r(n) + i(t) * i(n) * i(e));
		}
		function x(e, t) {
			return l * (280.16 + 360.9856235 * e) - t;
		}
		function S(e) {
			return e < 0 && (e = 0), 2967e-7 / Math.tan(e + .00312536 / (e + .08901179));
		}
		function C(e) {
			return l * (357.5291 + .98560028 * e);
		}
		function w(e) {
			var t = l * (1.9148 * r(e) + .02 * r(2 * e) + 3e-4 * r(3 * e)), i = l * 102.9372;
			return e + t + i + n;
		}
		function T(e) {
			var t = w(C(e));
			return {
				dec: v(t, 0),
				ra: _(t, 0)
			};
		}
		var E = {};
		E.getPosition = function(e, t, n) {
			var r = l * -n, i = l * t, a = h(e), o = T(a), s = x(a, r) - o.ra;
			return {
				azimuth: y(s, i, o.dec),
				altitude: b(s, i, o.dec)
			};
		};
		var D = E.times = [
			[
				-.833,
				"sunrise",
				"sunset"
			],
			[
				-.3,
				"sunriseEnd",
				"sunsetStart"
			],
			[
				-6,
				"dawn",
				"dusk"
			],
			[
				-12,
				"nauticalDawn",
				"nauticalDusk"
			],
			[
				-18,
				"nightEnd",
				"night"
			],
			[
				6,
				"goldenHourEnd",
				"goldenHour"
			]
		];
		E.addTime = function(e, t, n) {
			D.push([
				e,
				t,
				n
			]);
		};
		var O = 9e-4;
		function k(e, t) {
			return Math.round(e - O - t / (2 * n));
		}
		function A(e, t, r) {
			return O + (e + t) / (2 * n) + r;
		}
		function j(e, t, n) {
			return f + e + .0053 * r(t) - .0069 * r(2 * n);
		}
		function M(e, t, n) {
			return c((r(e) - r(t) * r(n)) / (i(t) * i(n)));
		}
		function ee(e) {
			return -2.076 * Math.sqrt(e) / 60;
		}
		function N(e, t, n, r, i, a, o) {
			return j(A(M(e, n, r), t, i), a, o);
		}
		E.getTimes = function(e, t, n, r) {
			r ||= 0;
			var i = l * -n, a = l * t, o = ee(r), s = k(h(e), i), c = A(0, i, s), u = C(c), d = w(u), f = v(d, 0), p = j(c, u, d), g, _, y, b, x, S, T = {
				solarNoon: m(p),
				nadir: m(p - .5)
			};
			for (g = 0, _ = D.length; g < _; g += 1) y = D[g], b = (y[0] + o) * l, x = N(b, i, a, f, s, u, d), S = p - (x - p), T[y[1]] = m(S), T[y[2]] = m(x);
			return T;
		};
		function P(e) {
			var t = l * (218.316 + 13.176396 * e), n = l * (134.963 + 13.064993 * e), a = l * (93.272 + 13.22935 * e), o = t + l * 6.289 * r(n), s = l * 5.128 * r(a), c = 385001 - 20905 * i(n);
			return {
				ra: _(o, s),
				dec: v(o, s),
				dist: c
			};
		}
		E.getMoonPosition = function(e, t, n) {
			var o = l * -n, c = l * t, u = h(e), d = P(u), f = x(u, o) - d.ra, p = b(f, c, d.dec), m = s(r(f), a(c) * i(d.dec) - r(d.dec) * i(f));
			return p += S(p), {
				azimuth: y(f, c, d.dec),
				altitude: p,
				distance: d.dist,
				parallacticAngle: m
			};
		}, E.getMoonIllumination = function(e) {
			var t = h(e || /* @__PURE__ */ new Date()), n = T(t), a = P(t), o = 149598e3, l = c(r(n.dec) * r(a.dec) + i(n.dec) * i(a.dec) * i(n.ra - a.ra)), u = s(o * r(l), a.dist - o * i(l)), d = s(i(n.dec) * r(n.ra - a.ra), r(n.dec) * i(a.dec) - i(n.dec) * r(a.dec) * i(n.ra - a.ra));
			return {
				fraction: (1 + i(u)) / 2,
				phase: .5 + .5 * u * (d < 0 ? -1 : 1) / Math.PI,
				angle: d
			};
		};
		function F(e, t) {
			return new Date(e.valueOf() + t * u / 24);
		}
		E.getMoonTimes = function(e, t, n, r) {
			var i = new Date(e);
			r ? i.setUTCHours(0, 0, 0, 0) : i.setHours(0, 0, 0, 0);
			for (var a = .133 * l, o = E.getMoonPosition(i, t, n).altitude - a, s, c, u, d, f, p, m, h, g, _, v, y, b, x = 1; x <= 24 && (s = E.getMoonPosition(F(i, x), t, n).altitude - a, c = E.getMoonPosition(F(i, x + 1), t, n).altitude - a, f = (o + c) / 2 - s, p = (c - o) / 2, m = -p / (2 * f), h = (f * m + p) * m + s, g = p * p - 4 * f * s, _ = 0, g >= 0 && (b = Math.sqrt(g) / (Math.abs(f) * 2), v = m - b, y = m + b, Math.abs(v) <= 1 && _++, Math.abs(y) <= 1 && _++, v < -1 && (v = y)), _ === 1 ? o < 0 ? u = x + v : d = x + v : _ === 2 && (u = x + (h < 0 ? y : v), d = x + (h < 0 ? v : y)), !(u && d)); x += 2) o = c;
			var S = {};
			return u && (S.rise = F(i, u)), d && (S.set = F(i, d)), !u && !d && (S[h > 0 ? "alwaysUp" : "alwaysDown"] = !0), S;
		}, typeof e == "object" && t !== void 0 ? t.exports = E : typeof define == "function" && define.amd ? define(E) : window.SunCalc = E;
	})();
})))(), 1), j = /* @__PURE__ */ Object.freeze({
	__proto__: null,
	ad: { SH: [
		{
			name: "Vacances de Nadal",
			2019: [
				12,
				23,
				1,
				6
			],
			2020: [
				12,
				23,
				1,
				6
			],
			2021: [
				12,
				23,
				1,
				7
			],
			2022: [
				12,
				23,
				1,
				6
			],
			2023: [
				12,
				25,
				1,
				5
			],
			2024: [
				12,
				23,
				1,
				6
			],
			2025: [
				12,
				22,
				1,
				6
			],
			2026: [
				12,
				23,
				1,
				6
			]
		},
		{
			name: "Vacances de Carnaval",
			2020: [
				2,
				24,
				2,
				28
			],
			2021: [
				2,
				15,
				2,
				18
			],
			2022: [
				2,
				28,
				3,
				4
			],
			2023: [
				2,
				20,
				2,
				24
			],
			2024: [
				2,
				12,
				2,
				16
			],
			2025: [
				2,
				24,
				3,
				3
			],
			2026: [
				2,
				16,
				2,
				20
			],
			2027: [
				2,
				8,
				2,
				12
			]
		},
		{
			name: "Vacances de Pasqua",
			2020: [
				4,
				6,
				4,
				17
			],
			2021: [
				3,
				29,
				4,
				6
			],
			2022: [
				4,
				11,
				4,
				22
			],
			2023: [
				4,
				3,
				4,
				14
			],
			2024: [
				3,
				28,
				4,
				5
			],
			2025: [
				4,
				17,
				5,
				2
			],
			2026: [
				3,
				30,
				4,
				10
			],
			2027: [
				3,
				22,
				4,
				2
			]
		},
		{
			name: "Vacances de Pentecosta",
			2020: [
				5,
				25,
				6,
				1
			],
			2021: [
				5,
				24,
				5,
				28
			],
			2022: [
				6,
				2,
				6,
				6
			],
			2023: [
				5,
				29,
				5,
				30
			],
			2024: [
				5,
				20,
				5,
				24
			],
			2025: [
				6,
				9,
				6,
				9
			],
			2026: [
				5,
				25,
				5,
				29
			],
			2027: [
				5,
				17,
				5,
				21
			]
		},
		{
			name: "Vacances d'estiu",
			2020: [
				7,
				2,
				9,
				8
			],
			2021: [
				7,
				3,
				9,
				8
			],
			2022: [
				7,
				2,
				9,
				8
			],
			2023: [
				7,
				1,
				9,
				10
			],
			2024: [
				6,
				29,
				9,
				8
			],
			2025: [
				7,
				1,
				9,
				8
			],
			2026: [
				7,
				4,
				9,
				8
			]
		},
		{
			name: "Vacances de Tots Sants",
			2020: [
				10,
				26,
				10,
				30
			],
			2021: [
				11,
				1,
				11,
				1
			],
			2022: [
				10,
				31,
				11,
				4
			],
			2023: [
				10,
				30,
				11,
				3
			],
			2024: [
				10,
				28,
				11,
				1
			],
			2025: [
				10,
				27,
				10,
				31
			],
			2026: [
				10,
				26,
				10,
				30
			]
		},
		{
			name: "Final de classe",
			2027: [
				7,
				2,
				7,
				2
			]
		}
	] },
	al: { SH: [
		{
			name: "Pushimet dimërore",
			2019: [
				12,
				21,
				1,
				5
			],
			2020: [
				12,
				24,
				1,
				4
			],
			2021: [
				12,
				24,
				1,
				4
			],
			2022: [
				12,
				26,
				1,
				4
			],
			2023: [
				12,
				26,
				1,
				5
			],
			2024: [
				12,
				23,
				1,
				3
			],
			2025: [
				12,
				22,
				1,
				2
			]
		},
		{
			name: "Pushimet verore",
			2020: [
				6,
				13,
				9,
				13
			],
			2021: [
				6,
				9,
				9,
				26
			],
			2022: [
				6,
				18,
				9,
				11
			],
			2023: [
				6,
				15,
				9,
				10
			],
			2024: [
				6,
				14,
				9,
				8
			],
			2025: [
				6,
				13,
				9,
				8
			]
		},
		{
			name: "Pushimet e pranveres",
			2023: [
				4,
				3,
				4,
				9
			],
			2024: [
				4,
				1,
				4,
				5
			],
			2025: [
				3,
				31,
				4,
				4
			],
			2026: [
				3,
				30,
				4,
				3
			]
		},
		{
			name: "Fundi i klasës",
			2026: [
				6,
				13,
				6,
				13
			]
		}
	] },
	ar: {
		PH: [
			{
				name: "Año Nuevo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval I",
				variable_date: "easter",
				offset: -48
			},
			{
				name: "Carnaval II",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Feriado con fines turísticos",
				fixed_date: [3, 23]
			},
			{
				name: "Día Nacional de la Memoria por la Verdad y la Justicia",
				fixed_date: [3, 24]
			},
			{
				name: "Viernes Santo",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Día del Veterano y de los Caídos en la Guerra de Malvinas",
				fixed_date: [4, 2]
			},
			{
				name: "Día del Trabajador",
				fixed_date: [5, 1]
			},
			{
				name: "Día de la Revolución de Mayo",
				fixed_date: [5, 25]
			},
			{
				name: "Paso a la Inmortalidad del Gral. Don Martín Miguel de Güemes",
				fixed_date: [6, 15]
			},
			{
				name: "Paso a la Inmortalidad del General Manuel Belgrano",
				fixed_date: [6, 20]
			},
			{
				name: "Día de la Independencia",
				fixed_date: [7, 9]
			},
			{
				name: "Feriado con fines turísticos",
				fixed_date: [7, 10]
			},
			{
				name: "Paso a la Inmortalidad del Gral. José de San Martín",
				fixed_date: [8, 17]
			},
			{
				name: "Día del Respeto a la Diversidad Cultural",
				fixed_date: [10, 12]
			},
			{
				name: "Día de la Soberanía Nacional",
				fixed_date: [11, 23]
			},
			{
				name: "Feriado con fines turísticos",
				fixed_date: [12, 7]
			},
			{
				name: "Inmaculada Concepción de María",
				fixed_date: [12, 8]
			},
			{
				name: "Navidad",
				fixed_date: [12, 25]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=-34.60377&lon=-58.38159&zoom=16&addressdetails=1&accept-language=es"
	},
	at: {
		PH: [
			{
				name: "Neujahrstag",
				fixed_date: [1, 1]
			},
			{
				name: "Heilige Drei Könige",
				fixed_date: [1, 6]
			},
			{
				name: "Ostermontag",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Staatsfeiertag",
				fixed_date: [5, 1]
			},
			{
				name: "Christi Himmelfahrt",
				variable_date: "easter",
				offset: 39
			},
			{
				name: "Pfingstmontag",
				variable_date: "easter",
				offset: 50
			},
			{
				name: "Fronleichnam",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Mariä Himmelfahrt",
				fixed_date: [8, 15]
			},
			{
				name: "Nationalfeiertag",
				fixed_date: [10, 26]
			},
			{
				name: "Allerheiligen",
				fixed_date: [11, 1]
			},
			{
				name: "Mariä Empfängnis",
				fixed_date: [12, 8]
			},
			{
				name: "Christtag",
				fixed_date: [12, 25]
			},
			{
				name: "Stefanitag",
				fixed_date: [12, 26]
			}
		],
		SH: [
			{
				name: "Osterferien",
				2017: [
					4,
					8,
					4,
					18
				],
				2018: [
					3,
					24,
					4,
					3
				],
				2019: [
					4,
					13,
					4,
					23
				],
				2020: [
					4,
					4,
					4,
					14
				],
				2021: [
					3,
					27,
					4,
					5
				],
				2022: [
					4,
					9,
					4,
					18
				],
				2023: [
					4,
					1,
					4,
					10
				],
				2024: [
					3,
					23,
					4,
					1
				],
				2025: [
					4,
					12,
					4,
					21
				],
				2026: [
					3,
					28,
					4,
					6
				],
				2027: [
					3,
					20,
					3,
					29
				],
				2028: [
					4,
					8,
					4,
					17
				]
			},
			{
				name: "Pfingstferien",
				2017: [
					6,
					3,
					6,
					6
				],
				2018: [
					5,
					19,
					5,
					22
				],
				2019: [
					6,
					8,
					6,
					11
				],
				2020: [
					5,
					30,
					6,
					2
				],
				2021: [
					5,
					22,
					5,
					24
				],
				2022: [
					6,
					4,
					6,
					6
				],
				2023: [
					5,
					27,
					5,
					29
				],
				2024: [
					5,
					18,
					5,
					20
				],
				2025: [
					6,
					7,
					6,
					9
				],
				2026: [
					5,
					23,
					5,
					25
				],
				2027: [
					5,
					15,
					5,
					17
				],
				2028: [
					6,
					3,
					6,
					5
				]
			},
			{
				name: "Herbstferien",
				2020: [
					10,
					27,
					10,
					31
				],
				2021: [
					10,
					27,
					10,
					31
				],
				2022: [
					10,
					27,
					10,
					31
				],
				2023: [
					10,
					27,
					10,
					31
				],
				2024: [
					10,
					27,
					10,
					31
				],
				2025: [
					10,
					27,
					10,
					31
				],
				2026: [
					10,
					27,
					10,
					31
				],
				2027: [
					10,
					27,
					10,
					31
				],
				2028: [
					10,
					27,
					10,
					31
				]
			},
			{
				name: "Weihnachtsferien",
				2016: [
					12,
					24,
					1,
					7
				],
				2017: [
					12,
					24,
					1,
					6
				],
				2018: [
					12,
					24,
					1,
					6
				],
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					6
				],
				2021: [
					12,
					24,
					1,
					6
				],
				2022: [
					12,
					24,
					1,
					6
				],
				2023: [
					12,
					23,
					1,
					6
				],
				2024: [
					12,
					24,
					1,
					6
				],
				2025: [
					12,
					24,
					1,
					6
				],
				2026: [
					12,
					24,
					1,
					6
				],
				2027: [
					12,
					24,
					1,
					6
				],
				2028: [
					12,
					24,
					1,
					6
				]
			},
			{
				name: "Allerseelen",
				2020: [
					11,
					2,
					11,
					2
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					11,
					2,
					11,
					2
				],
				2023: [
					11,
					2,
					11,
					2
				],
				2024: [
					11,
					2,
					11,
					2
				],
				2025: [
					11,
					2,
					11,
					2
				],
				2026: [
					11,
					2,
					11,
					2
				],
				2027: [
					11,
					2,
					11,
					2
				],
				2028: [
					11,
					2,
					11,
					2
				]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lon=16.3725042&lat=48.2083537&zoom=18&addressdetails=1&accept-language=de,en",
		Burgenland: { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					4,
					9,
					6
				],
				2021: [
					7,
					3,
					9,
					5
				],
				2022: [
					7,
					2,
					9,
					4
				],
				2023: [
					7,
					1,
					9,
					3
				],
				2024: [
					6,
					29,
					9,
					1
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					7,
					4,
					9,
					6
				],
				2027: [
					7,
					3,
					9,
					5
				],
				2028: [
					7,
					1,
					9,
					3
				]
			},
			{
				name: "Semesterferien",
				2020: [
					2,
					10,
					2,
					15
				],
				2021: [
					2,
					8,
					2,
					13
				],
				2022: [
					2,
					14,
					2,
					19
				],
				2023: [
					2,
					13,
					2,
					18
				],
				2024: [
					2,
					12,
					2,
					17
				],
				2025: [
					2,
					10,
					2,
					15
				],
				2026: [
					2,
					9,
					2,
					14
				],
				2027: [
					2,
					8,
					2,
					13
				],
				2028: [
					2,
					14,
					2,
					19
				]
			},
			{
				name: "St. Martin",
				2020: [
					11,
					11,
					11,
					11
				],
				2021: [
					11,
					11,
					11,
					11
				],
				2022: [
					11,
					11,
					11,
					11
				],
				2023: [
					11,
					11,
					11,
					11
				],
				2024: [
					11,
					11,
					11,
					11
				],
				2025: [
					11,
					11,
					11,
					11
				],
				2027: [
					11,
					11,
					11,
					11
				],
				2028: [
					11,
					11,
					11,
					11
				]
			}
		] },
		Kärnten: { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					11,
					9,
					13
				],
				2021: [
					7,
					10,
					9,
					12
				],
				2022: [
					7,
					9,
					9,
					11
				],
				2023: [
					7,
					8,
					9,
					10
				],
				2024: [
					7,
					6,
					9,
					8
				],
				2025: [
					7,
					5,
					9,
					7
				],
				2026: [
					7,
					11,
					9,
					13
				],
				2027: [
					7,
					10,
					9,
					12
				],
				2028: [
					7,
					8,
					9,
					10
				]
			},
			{
				name: "Semesterferien",
				2020: [
					2,
					10,
					2,
					15
				],
				2021: [
					2,
					8,
					2,
					13
				],
				2022: [
					2,
					14,
					2,
					19
				],
				2023: [
					2,
					13,
					2,
					18
				],
				2024: [
					2,
					12,
					2,
					17
				],
				2025: [
					2,
					10,
					2,
					15
				],
				2026: [
					2,
					9,
					2,
					14
				],
				2027: [
					2,
					8,
					2,
					13
				],
				2028: [
					2,
					14,
					2,
					19
				]
			},
			{
				name: "St. Josef",
				2020: [
					3,
					19,
					3,
					19
				],
				2021: [
					3,
					19,
					3,
					19
				],
				2022: [
					3,
					19,
					3,
					19
				],
				2023: [
					3,
					19,
					3,
					19
				],
				2024: [
					3,
					19,
					3,
					19
				],
				2025: [
					3,
					19,
					3,
					19
				],
				2026: [
					3,
					19,
					3,
					19
				],
				2027: [
					3,
					19,
					3,
					19
				]
			}
		] },
		Niederösterreich: { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					4,
					9,
					6
				],
				2021: [
					7,
					3,
					9,
					5
				],
				2022: [
					7,
					2,
					9,
					4
				],
				2023: [
					7,
					1,
					9,
					3
				],
				2024: [
					6,
					29,
					9,
					1
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					7,
					4,
					9,
					6
				],
				2027: [
					7,
					3,
					9,
					5
				],
				2028: [
					7,
					1,
					9,
					3
				]
			},
			{
				name: "Semesterferien",
				2020: [
					2,
					3,
					2,
					8
				],
				2021: [
					2,
					1,
					2,
					6
				],
				2022: [
					2,
					7,
					2,
					12
				],
				2023: [
					2,
					6,
					2,
					11
				],
				2024: [
					2,
					5,
					2,
					10
				],
				2025: [
					2,
					3,
					2,
					8
				],
				2026: [
					2,
					2,
					2,
					7
				],
				2027: [
					1,
					30,
					2,
					6
				],
				2028: [
					2,
					5,
					2,
					12
				]
			},
			{
				name: "St. Leopold",
				2020: [
					11,
					15,
					11,
					15
				],
				2021: [
					11,
					15,
					11,
					15
				],
				2022: [
					11,
					15,
					11,
					15
				],
				2023: [
					11,
					15,
					11,
					15
				],
				2024: [
					11,
					15,
					11,
					15
				],
				2025: [
					11,
					15,
					11,
					15
				],
				2027: [
					11,
					15,
					11,
					15
				],
				2028: [
					11,
					15,
					11,
					15
				]
			}
		] },
		Oberösterreich: { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					11,
					9,
					13
				],
				2021: [
					7,
					10,
					9,
					12
				],
				2022: [
					7,
					9,
					9,
					11
				],
				2023: [
					7,
					8,
					9,
					10
				],
				2024: [
					7,
					6,
					9,
					8
				],
				2025: [
					7,
					5,
					9,
					7
				],
				2026: [
					7,
					11,
					9,
					13
				],
				2027: [
					7,
					10,
					9,
					12
				],
				2028: [
					7,
					8,
					9,
					10
				]
			},
			{
				name: "Semesterferien",
				2020: [
					2,
					17,
					2,
					22
				],
				2021: [
					2,
					8,
					2,
					13
				],
				2022: [
					2,
					21,
					2,
					26
				],
				2023: [
					2,
					20,
					2,
					25
				],
				2024: [
					2,
					19,
					2,
					24
				],
				2025: [
					2,
					17,
					2,
					22
				],
				2026: [
					2,
					16,
					2,
					21
				],
				2027: [
					2,
					15,
					2,
					20
				],
				2028: [
					2,
					21,
					2,
					26
				]
			},
			{
				name: "St. Florian",
				2020: [
					5,
					4,
					5,
					4
				],
				2021: [
					5,
					4,
					5,
					4
				],
				2022: [
					5,
					4,
					5,
					4
				],
				2023: [
					5,
					4,
					5,
					4
				],
				2024: [
					5,
					4,
					5,
					4
				],
				2025: [
					5,
					4,
					5,
					4
				],
				2026: [
					5,
					4,
					5,
					4
				],
				2027: [
					5,
					4,
					5,
					4
				],
				2028: [
					5,
					4,
					5,
					4
				]
			}
		] },
		Salzburg: { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					11,
					9,
					13
				],
				2021: [
					7,
					10,
					9,
					12
				],
				2022: [
					7,
					9,
					9,
					11
				],
				2023: [
					7,
					8,
					9,
					10
				],
				2024: [
					7,
					6,
					9,
					8
				],
				2025: [
					7,
					5,
					9,
					7
				],
				2026: [
					7,
					11,
					9,
					13
				],
				2027: [
					7,
					10,
					9,
					12
				],
				2028: [
					7,
					8,
					9,
					10
				]
			},
			{
				name: "Semesterferien",
				2020: [
					2,
					10,
					2,
					15
				],
				2021: [
					2,
					8,
					2,
					13
				],
				2022: [
					2,
					14,
					2,
					19
				],
				2023: [
					2,
					13,
					2,
					18
				],
				2024: [
					2,
					12,
					2,
					17
				],
				2025: [
					2,
					10,
					2,
					15
				],
				2026: [
					2,
					9,
					2,
					14
				],
				2027: [
					2,
					8,
					2,
					13
				],
				2028: [
					2,
					14,
					2,
					19
				]
			},
			{
				name: "St. Rupert",
				2020: [
					9,
					24,
					9,
					24
				],
				2021: [
					9,
					24,
					9,
					24
				],
				2022: [
					9,
					24,
					9,
					24
				],
				2023: [
					9,
					24,
					9,
					24
				],
				2024: [
					9,
					24,
					9,
					24
				],
				2025: [
					9,
					24,
					9,
					24
				],
				2027: [
					9,
					24,
					9,
					24
				],
				2028: [
					9,
					24,
					9,
					24
				]
			}
		] },
		Steiermark: { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					11,
					9,
					13
				],
				2021: [
					7,
					10,
					9,
					12
				],
				2022: [
					7,
					9,
					9,
					11
				],
				2023: [
					7,
					8,
					9,
					10
				],
				2024: [
					7,
					6,
					9,
					8
				],
				2025: [
					7,
					5,
					9,
					7
				],
				2026: [
					7,
					11,
					9,
					13
				],
				2027: [
					7,
					10,
					9,
					12
				],
				2028: [
					7,
					8,
					9,
					10
				]
			},
			{
				name: "Semesterferien",
				2020: [
					2,
					17,
					2,
					22
				],
				2021: [
					2,
					8,
					2,
					13
				],
				2022: [
					2,
					21,
					2,
					26
				],
				2023: [
					2,
					20,
					2,
					25
				],
				2024: [
					2,
					19,
					2,
					24
				],
				2025: [
					2,
					17,
					2,
					22
				],
				2026: [
					2,
					16,
					2,
					21
				],
				2027: [
					2,
					15,
					2,
					20
				],
				2028: [
					2,
					21,
					2,
					26
				]
			},
			{
				name: "St. Josef",
				2020: [
					3,
					19,
					3,
					19
				],
				2021: [
					3,
					19,
					3,
					19
				],
				2022: [
					3,
					19,
					3,
					19
				],
				2023: [
					3,
					19,
					3,
					19
				],
				2024: [
					3,
					19,
					3,
					19
				],
				2025: [
					3,
					19,
					3,
					19
				],
				2026: [
					3,
					19,
					3,
					19
				],
				2027: [
					3,
					19,
					3,
					19
				]
			}
		] },
		Tirol: { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					11,
					9,
					13
				],
				2021: [
					7,
					10,
					9,
					12
				],
				2022: [
					7,
					9,
					9,
					11
				],
				2023: [
					7,
					8,
					9,
					10
				],
				2024: [
					7,
					6,
					9,
					8
				],
				2025: [
					7,
					5,
					9,
					7
				],
				2026: [
					7,
					11,
					9,
					13
				],
				2027: [
					7,
					10,
					9,
					12
				],
				2028: [
					7,
					8,
					9,
					10
				]
			},
			{
				name: "Semesterferien",
				2020: [
					2,
					10,
					2,
					15
				],
				2021: [
					2,
					8,
					2,
					13
				],
				2022: [
					2,
					14,
					2,
					19
				],
				2023: [
					2,
					13,
					2,
					18
				],
				2024: [
					2,
					12,
					2,
					17
				],
				2025: [
					2,
					10,
					2,
					15
				],
				2026: [
					2,
					9,
					2,
					14
				],
				2027: [
					2,
					8,
					2,
					13
				],
				2028: [
					2,
					14,
					2,
					19
				]
			},
			{
				name: "St. Josef",
				2020: [
					3,
					19,
					3,
					19
				],
				2021: [
					3,
					19,
					3,
					19
				],
				2022: [
					3,
					19,
					3,
					19
				],
				2023: [
					3,
					19,
					3,
					19
				],
				2024: [
					3,
					19,
					3,
					19
				],
				2025: [
					3,
					19,
					3,
					19
				],
				2026: [
					3,
					19,
					3,
					19
				],
				2027: [
					3,
					19,
					3,
					19
				]
			},
			{
				name: "schulfrei",
				2025: [
					6,
					20,
					6,
					20
				]
			}
		] },
		Vorarlberg: { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					11,
					9,
					13
				],
				2021: [
					7,
					10,
					9,
					12
				],
				2022: [
					7,
					9,
					9,
					11
				],
				2023: [
					7,
					8,
					9,
					10
				],
				2024: [
					7,
					6,
					9,
					8
				],
				2025: [
					7,
					5,
					9,
					7
				],
				2026: [
					7,
					11,
					9,
					13
				],
				2027: [
					7,
					10,
					9,
					12
				],
				2028: [
					7,
					8,
					9,
					10
				]
			},
			{
				name: "Semesterferien",
				2020: [
					2,
					10,
					2,
					15
				],
				2021: [
					2,
					8,
					2,
					13
				],
				2022: [
					2,
					14,
					2,
					19
				],
				2023: [
					2,
					13,
					2,
					18
				],
				2024: [
					2,
					5,
					2,
					10
				],
				2025: [
					2,
					10,
					2,
					15
				],
				2026: [
					2,
					9,
					2,
					14
				],
				2027: [
					2,
					8,
					2,
					13
				],
				2028: [
					2,
					14,
					2,
					19
				]
			},
			{
				name: "St. Josef",
				2020: [
					3,
					19,
					3,
					19
				],
				2021: [
					3,
					19,
					3,
					19
				],
				2022: [
					3,
					19,
					3,
					19
				],
				2023: [
					3,
					19,
					3,
					19
				],
				2024: [
					3,
					19,
					3,
					19
				],
				2025: [
					3,
					19,
					3,
					19
				],
				2026: [
					3,
					19,
					3,
					19
				],
				2027: [
					3,
					19,
					3,
					19
				]
			}
		] },
		Wien: { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					4,
					9,
					6
				],
				2021: [
					7,
					3,
					9,
					5
				],
				2022: [
					7,
					2,
					9,
					4
				],
				2023: [
					7,
					1,
					9,
					3
				],
				2024: [
					6,
					29,
					9,
					1
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					7,
					4,
					9,
					6
				],
				2027: [
					7,
					3,
					9,
					5
				],
				2028: [
					7,
					1,
					9,
					3
				]
			},
			{
				name: "Semesterferien",
				2020: [
					2,
					3,
					2,
					8
				],
				2021: [
					2,
					1,
					2,
					6
				],
				2022: [
					2,
					7,
					2,
					12
				],
				2023: [
					2,
					6,
					2,
					11
				],
				2024: [
					2,
					5,
					2,
					10
				],
				2025: [
					2,
					3,
					2,
					8
				],
				2026: [
					2,
					2,
					2,
					7
				],
				2027: [
					1,
					30,
					2,
					6
				],
				2028: [
					2,
					5,
					2,
					12
				]
			},
			{
				name: "St. Leopold",
				2020: [
					11,
					15,
					11,
					15
				],
				2021: [
					11,
					15,
					11,
					15
				],
				2022: [
					11,
					15,
					11,
					15
				],
				2023: [
					11,
					15,
					11,
					15
				],
				2024: [
					11,
					15,
					11,
					15
				],
				2025: [
					11,
					15,
					11,
					15
				],
				2027: [
					11,
					15,
					11,
					15
				],
				2028: [
					11,
					15,
					11,
					15
				]
			}
		] }
	},
	au: {
		PH: [
			{
				name: "New Years Day",
				fixed_date: [1, 1]
			},
			{
				name: "Australia Day",
				fixed_date: [1, 26]
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Easter Monday",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "ANZAC Day",
				fixed_date: [4, 25]
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			},
			{
				name: "Boxing Day",
				fixed_date: [12, 26]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=-35.2809&lon=149.1300&zoom=16&addressdetails=1&accept-language=en",
		"Australian Capital Territory": {
			_state_code: "act",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=-35.2809&lon=149.1300&zoom=16&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Years Day",
					fixed_date: [1, 1]
				},
				{
					name: "Australia Day",
					fixed_date: [1, 26]
				},
				{
					name: "Canberra Day",
					variable_date: "firstMarchMonday",
					offset: 7
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Easter Saturday",
					variable_date: "easter",
					offset: -1
				},
				{
					name: "Easter Sunday",
					variable_date: "easter"
				},
				{
					name: "Easter Monday",
					variable_date: "easter",
					offset: 1
				},
				{
					name: "ANZAC Day",
					fixed_date: [4, 25]
				},
				{
					name: "Reconciliation Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Queens Birthday",
					variable_date: "firstJuneMonday",
					offset: 7
				},
				{
					name: "Family and Community Day",
					variable_date: "lastSeptemberMonday"
				},
				{
					name: "Labour Day",
					variable_date: "firstOctoberMonday"
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Boxing Day",
					fixed_date: [12, 26]
				}
			]
		},
		"New South Wales": {
			_state_code: "nsw",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=-33.8688&lon=151.2093&zoom=16&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Years Day",
					fixed_date: [1, 1]
				},
				{
					name: "Australia Day",
					fixed_date: [1, 26]
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Easter Saturday",
					variable_date: "easter",
					offset: -1
				},
				{
					name: "Easter Sunday",
					variable_date: "easter"
				},
				{
					name: "Easter Monday",
					variable_date: "easter",
					offset: 1
				},
				{
					name: "ANZAC Day",
					fixed_date: [4, 25]
				},
				{
					name: "Queens Birthday",
					variable_date: "firstJuneMonday",
					offset: 7
				},
				{
					name: "Labour Day",
					variable_date: "firstOctoberMonday"
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Boxing Day",
					fixed_date: [12, 26]
				}
			]
		},
		"Northern Territory": {
			_state_code: "nt",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=-12.4634&lon=130.8456&zoom=16&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Years Day",
					fixed_date: [1, 1]
				},
				{
					name: "Australia Day",
					fixed_date: [1, 26]
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Easter Saturday",
					variable_date: "easter",
					offset: -1
				},
				{
					name: "Easter Monday",
					variable_date: "easter",
					offset: 1
				},
				{
					name: "ANZAC Day",
					fixed_date: [4, 25]
				},
				{
					name: "May Day",
					variable_date: "firstMayMonday"
				},
				{
					name: "Queens Birthday",
					variable_date: "firstJuneMonday",
					offset: 7
				},
				{
					name: "Picnic Day",
					variable_date: "firstAugustMonday"
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Boxing Day",
					fixed_date: [12, 26]
				}
			]
		},
		Queensland: {
			_state_code: "qld",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=-27.4698&lon=153.0251&zoom=16&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Years Day",
					fixed_date: [1, 1]
				},
				{
					name: "Australia Day",
					fixed_date: [1, 26]
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Easter Saturday",
					variable_date: "easter",
					offset: -1
				},
				{
					name: "Easter Monday",
					variable_date: "easter",
					offset: 1
				},
				{
					name: "ANZAC Day",
					fixed_date: [4, 25]
				},
				{
					name: "Labour Day",
					variable_date: "firstMayMonday"
				},
				{
					name: "Queens Birthday",
					variable_date: "firstOctoberMonday"
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Boxing Day",
					fixed_date: [12, 26]
				}
			]
		},
		"South Australia": {
			_state_code: "sa",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=-34.9285&lon=138.6007&zoom=16&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Years Day",
					fixed_date: [1, 1]
				},
				{
					name: "Australia Day",
					fixed_date: [1, 26]
				},
				{
					name: "Adelaide Cup",
					variable_date: "firstMarchMonday",
					offset: 7
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Easter Saturday",
					variable_date: "easter",
					offset: -1
				},
				{
					name: "Easter Monday",
					variable_date: "easter",
					offset: 1
				},
				{
					name: "ANZAC Day",
					fixed_date: [4, 25]
				},
				{
					name: "Queens Birthday",
					variable_date: "firstJuneMonday",
					offset: 7
				},
				{
					name: "Labour Day",
					variable_date: "firstOctoberMonday"
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Boxing Day",
					fixed_date: [12, 26]
				}
			]
		},
		Tasmania: {
			_state_code: "tas",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=-42.8821&lon=147.3272&zoom=16&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Years Day",
					fixed_date: [1, 1]
				},
				{
					name: "Australia Day",
					fixed_date: [1, 26]
				},
				{
					name: "Eight Hours Day",
					variable_date: "firstMarchMonday",
					offset: 7
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Easter Monday",
					variable_date: "easter",
					offset: 1
				},
				{
					name: "ANZAC Day",
					fixed_date: [4, 25]
				},
				{
					name: "Queens Birthday",
					variable_date: "firstJuneMonday",
					offset: 7
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Boxing Day",
					fixed_date: [12, 26]
				}
			]
		},
		Victoria: {
			_state_code: "vic",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=-37.8136&lon=144.9631&zoom=16&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Years Day",
					fixed_date: [1, 1]
				},
				{
					name: "Australia Day",
					fixed_date: [1, 26]
				},
				{
					name: "Labour Day",
					variable_date: "firstMarchMonday",
					offset: 7
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Easter Saturday",
					variable_date: "easter",
					offset: -1
				},
				{
					name: "Easter Sunday",
					variable_date: "easter"
				},
				{
					name: "Easter Monday",
					variable_date: "easter",
					offset: 1
				},
				{
					name: "ANZAC Day",
					fixed_date: [4, 25]
				},
				{
					name: "Queens Birthday",
					variable_date: "firstJuneMonday",
					offset: 7
				},
				{
					name: "AFL Grand Final",
					variable_date: "lastSeptemberFriday"
				},
				{
					name: "Melbourne Cup",
					variable_date: "firstNovemberTuesday"
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Boxing Day",
					fixed_date: [12, 26]
				}
			]
		},
		"Western Australia": {
			_state_code: "wa",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=-31.9505&lon=115.8605&zoom=16&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Years Day",
					fixed_date: [1, 1]
				},
				{
					name: "Australia Day",
					fixed_date: [1, 26]
				},
				{
					name: "Labour Day",
					variable_date: "firstMarchMonday"
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Easter Monday",
					variable_date: "easter",
					offset: 1
				},
				{
					name: "ANZAC Day",
					fixed_date: [4, 25]
				},
				{
					name: "Western Australia Day",
					variable_date: "firstJuneMonday"
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Boxing Day",
					fixed_date: [12, 26]
				}
			]
		}
	},
	be: {
		PH: [
			{
				name: "Nieuwjaar - Jour de l'an",
				fixed_date: [1, 1]
			},
			{
				name: "Paasmaandag - Lundi de Pâques",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Dag van de Arbeid - Fête du Travail",
				fixed_date: [5, 1]
			},
			{
				name: "Onze-Lieve-Heer-Hemelvaart - Jeudi de l'Ascensionn",
				variable_date: "easter",
				offset: 39
			},
			{
				name: "Pinkstermaandag - Lundi de Pentecôte",
				variable_date: "easter",
				offset: 50
			},
			{
				name: "Nationale feestdag van België - Fête nationale",
				fixed_date: [7, 21]
			},
			{
				name: "Onze-Lieve-Vrouw-Hemelvaart - Assomption",
				fixed_date: [8, 15]
			},
			{
				name: "Allerheiligen - Toussaint",
				fixed_date: [11, 1]
			},
			{
				name: "Wapenstilstand - Armistice",
				fixed_date: [11, 11]
			},
			{
				name: "Kerstmis - Noël",
				fixed_date: [12, 25]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Belgium&zoom=18&addressdetails=1&limit=1&accept-language=nl,fr,de,en",
		DE: { SH: [
			{
				name: "Osterferien",
				2020: [
					4,
					6,
					4,
					17
				],
				2021: [
					4,
					6,
					4,
					16
				],
				2022: [
					4,
					4,
					4,
					15
				],
				2023: [
					4,
					3,
					4,
					16
				],
				2024: [
					4,
					1,
					4,
					13
				],
				2025: [
					4,
					21,
					5,
					3
				],
				2026: [
					4,
					6,
					4,
					18
				]
			},
			{
				name: "Sommerferien",
				2020: [
					7,
					1,
					8,
					30
				],
				2021: [
					7,
					1,
					8,
					31
				],
				2022: [
					7,
					1,
					8,
					31
				],
				2023: [
					7,
					1,
					8,
					31
				],
				2024: [
					6,
					29,
					8,
					31
				],
				2025: [
					7,
					1,
					8,
					31
				],
				2026: [
					7,
					1,
					8,
					31
				]
			},
			{
				name: "Weihnachtsferien",
				2019: [
					12,
					23,
					1,
					3
				],
				2020: [
					12,
					21,
					1,
					1
				],
				2021: [
					12,
					27,
					1,
					7
				],
				2022: [
					12,
					26,
					1,
					8
				],
				2023: [
					12,
					25,
					1,
					6
				],
				2024: [
					12,
					23,
					1,
					4
				],
				2025: [
					12,
					22,
					1,
					3
				]
			},
			{
				name: "Karnevalsferien",
				2020: [
					2,
					24,
					2,
					28
				],
				2021: [
					2,
					15,
					2,
					19
				],
				2022: [
					2,
					28,
					3,
					4
				],
				2023: [
					2,
					20,
					2,
					26
				],
				2024: [
					2,
					12,
					2,
					17
				],
				2025: [
					3,
					3,
					3,
					8
				],
				2026: [
					2,
					16,
					2,
					21
				]
			},
			{
				name: "Allerheiligenferien",
				2020: [
					11,
					2,
					11,
					6
				],
				2021: [
					11,
					1,
					11,
					5
				],
				2022: [
					10,
					31,
					11,
					6
				],
				2023: [
					10,
					30,
					11,
					4
				],
				2024: [
					10,
					28,
					11,
					2
				],
				2025: [
					10,
					27,
					11,
					1
				]
			},
			{
				name: "Tag der Deutschsprachigen Gemeinschaft",
				2020: [
					11,
					15,
					11,
					15
				],
				2021: [
					11,
					15,
					11,
					15
				],
				2022: [
					11,
					15,
					11,
					15
				],
				2023: [
					11,
					15,
					11,
					15
				],
				2024: [
					11,
					15,
					11,
					15
				],
				2025: [
					11,
					15,
					11,
					15
				]
			}
		] },
		FR: { SH: [
			{
				name: "Vacances d'hiver (Noël)",
				2019: [
					12,
					23,
					1,
					3
				],
				2020: [
					12,
					21,
					1,
					1
				],
				2021: [
					12,
					27,
					1,
					9
				],
				2022: [
					12,
					26,
					1,
					6
				],
				2023: [
					12,
					25,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					5
				],
				2025: [
					12,
					22,
					1,
					4
				],
				2026: [
					12,
					21,
					1,
					3
				]
			},
			{
				name: "Congé de détente (Carnaval)",
				2020: [
					2,
					24,
					2,
					28
				],
				2021: [
					2,
					15,
					2,
					19
				],
				2022: [
					2,
					28,
					3,
					4
				],
				2023: [
					2,
					20,
					3,
					3
				],
				2024: [
					2,
					26,
					3,
					8
				],
				2025: [
					2,
					24,
					3,
					9
				],
				2026: [
					2,
					16,
					3,
					1
				],
				2027: [
					2,
					22,
					3,
					7
				]
			},
			{
				name: "Vacances de printemps (Pâques)",
				2020: [
					4,
					6,
					4,
					17
				],
				2021: [
					4,
					5,
					4,
					16
				],
				2022: [
					4,
					4,
					4,
					15
				],
				2023: [
					5,
					1,
					5,
					12
				],
				2024: [
					4,
					29,
					5,
					10
				],
				2025: [
					4,
					28,
					5,
					11
				],
				2026: [
					4,
					27,
					5,
					10
				],
				2027: [
					4,
					26,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2020: [
					7,
					1,
					8,
					31
				],
				2021: [
					7,
					1,
					8,
					31
				],
				2022: [
					7,
					1,
					8,
					28
				],
				2023: [
					7,
					8,
					8,
					27
				],
				2024: [
					7,
					6,
					8,
					25
				],
				2025: [
					7,
					5,
					8,
					24
				],
				2026: [
					7,
					4,
					8,
					23
				]
			},
			{
				name: "Fête de la Communauté française",
				2020: [
					9,
					27,
					9,
					27
				],
				2021: [
					9,
					27,
					9,
					27
				],
				2022: [
					9,
					27,
					9,
					27
				],
				2023: [
					9,
					27,
					9,
					27
				],
				2024: [
					9,
					27,
					9,
					27
				],
				2025: [
					9,
					27,
					9,
					27
				]
			},
			{
				name: "Congé d'automne (Toussaint)",
				2020: [
					11,
					2,
					11,
					6
				],
				2021: [
					11,
					1,
					11,
					5
				],
				2022: [
					10,
					24,
					11,
					4
				],
				2023: [
					10,
					23,
					11,
					3
				],
				2024: [
					10,
					21,
					11,
					3
				],
				2025: [
					10,
					20,
					11,
					2
				],
				2026: [
					10,
					19,
					11,
					1
				]
			},
			{
				name: "Début des vacances d'été",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		NL: { SH: [
			{
				name: "Kerstvakantie",
				2019: [
					12,
					23,
					1,
					5
				],
				2020: [
					12,
					21,
					1,
					3
				],
				2021: [
					12,
					24,
					1,
					9
				],
				2022: [
					12,
					26,
					1,
					8
				],
				2023: [
					12,
					25,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					5
				],
				2025: [
					12,
					22,
					1,
					4
				],
				2026: [
					12,
					21,
					1,
					3
				],
				2027: [
					12,
					27,
					1,
					9
				],
				2028: [
					12,
					25,
					1,
					7
				]
			},
			{
				name: "Krokusvakantie",
				2020: [
					2,
					24,
					3,
					1
				],
				2021: [
					2,
					15,
					2,
					21
				],
				2022: [
					2,
					28,
					3,
					6
				],
				2023: [
					2,
					20,
					2,
					26
				],
				2024: [
					2,
					12,
					2,
					18
				],
				2025: [
					3,
					3,
					3,
					9
				],
				2026: [
					2,
					16,
					2,
					22
				],
				2027: [
					2,
					8,
					2,
					14
				],
				2028: [
					2,
					28,
					3,
					5
				],
				2029: [
					2,
					12,
					2,
					18
				]
			},
			{
				name: "Paasvakantie",
				2020: [
					4,
					6,
					4,
					19
				],
				2021: [
					4,
					5,
					4,
					18
				],
				2022: [
					4,
					4,
					4,
					18
				],
				2023: [
					4,
					3,
					4,
					16
				],
				2024: [
					4,
					1,
					4,
					14
				],
				2025: [
					4,
					7,
					4,
					21
				],
				2026: [
					4,
					6,
					4,
					19
				],
				2027: [
					3,
					29,
					4,
					11
				],
				2028: [
					4,
					3,
					4,
					17
				],
				2029: [
					4,
					2,
					4,
					15
				]
			},
			{
				name: "Zomervakantie",
				2020: [
					7,
					1,
					8,
					31
				],
				2021: [
					7,
					1,
					8,
					31
				],
				2022: [
					7,
					1,
					8,
					31
				],
				2023: [
					7,
					1,
					8,
					31
				],
				2024: [
					7,
					1,
					8,
					31
				],
				2025: [
					7,
					1,
					8,
					31
				],
				2026: [
					7,
					1,
					8,
					31
				],
				2027: [
					7,
					1,
					8,
					31
				],
				2028: [
					7,
					1,
					8,
					31
				],
				2029: [
					7,
					1,
					8,
					31
				]
			},
			{
				name: "Herfstvakantie",
				2020: [
					11,
					2,
					11,
					15
				],
				2021: [
					11,
					1,
					11,
					7
				],
				2022: [
					10,
					31,
					11,
					6
				],
				2023: [
					10,
					30,
					11,
					5
				],
				2024: [
					10,
					28,
					11,
					3
				],
				2025: [
					10,
					27,
					11,
					2
				],
				2026: [
					11,
					2,
					11,
					8
				],
				2027: [
					11,
					1,
					11,
					7
				],
				2028: [
					10,
					30,
					11,
					5
				]
			}
		] }
	},
	bg: { SH: [
		{
			name: "Коледна ваканция",
			2019: [
				12,
				21,
				1,
				5
			],
			2020: [
				12,
				22,
				1,
				3
			],
			2021: [
				12,
				24,
				1,
				3
			],
			2022: [
				12,
				24,
				1,
				2
			],
			2023: [
				12,
				23,
				1,
				2
			],
			2024: [
				12,
				21,
				1,
				2
			],
			2025: [
				12,
				24,
				1,
				4
			]
		},
		{
			name: "Междусрочна ваканция",
			2020: [
				2,
				5,
				2,
				5
			],
			2021: [
				1,
				30,
				2,
				3
			],
			2022: [
				2,
				1,
				2,
				1
			],
			2023: [
				2,
				1,
				2,
				5
			],
			2024: [
				2,
				3,
				2,
				5
			],
			2025: [
				2,
				5,
				2,
				5
			],
			2026: [
				1,
				31,
				2,
				2
			]
		},
		{
			name: "Пролетна ваканция",
			2020: [
				4,
				16,
				4,
				20
			],
			2021: [
				4,
				8,
				4,
				11
			],
			2022: [
				4,
				7,
				4,
				10
			],
			2023: [
				4,
				12,
				4,
				17
			],
			2024: [
				4,
				5,
				4,
				7
			],
			2025: [
				4,
				4,
				4,
				6
			],
			2026: [
				4,
				8,
				4,
				13
			]
		},
		{
			name: "Лятна ваканция",
			2020: [
				7,
				1,
				9,
				14
			],
			2021: [
				7,
				1,
				9,
				14
			],
			2022: [
				7,
				1,
				9,
				14
			],
			2023: [
				7,
				1,
				9,
				14
			],
			2024: [
				6,
				29,
				9,
				14
			],
			2025: [
				7,
				1,
				9,
				14
			],
			2026: [
				7,
				1,
				9,
				14
			]
		},
		{
			name: "Есенна ваканция",
			2020: [
				10,
				30,
				11,
				1
			],
			2021: [
				10,
				30,
				11,
				1
			],
			2022: [
				10,
				29,
				11,
				1
			],
			2023: [
				11,
				1,
				11,
				5
			],
			2024: [
				10,
				31,
				11,
				3
			],
			2025: [
				10,
				31,
				11,
				3
			]
		},
		{
			name: "Свободен от училище",
			2022: [
				2,
				2,
				2,
				4
			],
			2026: [
				3,
				2,
				3,
				2
			]
		}
	] },
	br: {
		PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=-10&lon=-52&zoom=18&addressdetails=1&accept-language=pt,en",
		Acre: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Dia do evangélico",
				fixed_date: [1, 23]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Alusivo ao Dia Internacional da Mulher",
				fixed_date: [3, 8]
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Aniversário do estado",
				fixed_date: [6, 15]
			},
			{
				name: "Dia da Amazônia",
				fixed_date: [9, 5]
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Assinatura do Tratado de Petrópolis",
				fixed_date: [11, 17]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Alagoas: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "São João",
				fixed_date: [6, 24]
			},
			{
				name: "São Pedro",
				fixed_date: [6, 29]
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Emancipação política",
				fixed_date: [9, 16]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Morte de Zumbi dos Palmares",
				fixed_date: [11, 20]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Amapá: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Dia de São José",
				fixed_date: [3, 19]
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Data Magna do estado",
				fixed_date: [9, 13]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Amazonas: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Data Magna do estado",
				fixed_date: [9, 5]
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Dia da Consciência Negra",
				fixed_date: [11, 20]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Bahia: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Data magna do estado",
				fixed_date: [2, 7]
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Ceará: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Data magna do estado",
				fixed_date: [3, 25]
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		"Distrito Federal": { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Dia do evangélico",
				fixed_date: [11, 30]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		"Espírito Santo": { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Data magna do estado",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Goiás: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Maranhão: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Data magna do estado",
				fixed_date: [7, 28]
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		"Mato Grosso": {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=-10.4276788&lon=-52.0892082&zoom=18&addressdetails=1&accept-language=pt,en",
			PH: [
				{
					name: "Ano Novo",
					fixed_date: [1, 1]
				},
				{
					name: "Carnaval",
					variable_date: "easter",
					offset: -47
				},
				{
					name: "Sexta-feira santa",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Tiradentes",
					fixed_date: [4, 21]
				},
				{
					name: "Dia do Trabalhador",
					fixed_date: [5, 1]
				},
				{
					name: "Corpus Christi",
					variable_date: "easter",
					offset: 60
				},
				{
					name: "Independência",
					fixed_date: [9, 7]
				},
				{
					name: "Nossa Senhora Aparecida",
					fixed_date: [10, 12]
				},
				{
					name: "Finados",
					fixed_date: [11, 2]
				},
				{
					name: "Proclamação da República",
					fixed_date: [11, 15]
				},
				{
					name: "Dia da Consciência Negra",
					fixed_date: [11, 20]
				},
				{
					name: "Natal",
					fixed_date: [12, 25]
				}
			]
		},
		"Mato Grosso do Sul": { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Criação do estado",
				fixed_date: [10, 11]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		"Minas Gerais": { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Data magna do estado",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Pará: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Data magna do estado",
				fixed_date: [8, 15]
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Paraíba: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Homenagem a João Pessoa",
				fixed_date: [7, 26]
			},
			{
				name: "Data magna do estado",
				fixed_date: [8, 5]
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Paraná: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Data magna do estado",
				fixed_date: [12, 19]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Pernambuco: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Data magna do estado",
				variable_date: "firstMarchSunday"
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Piauí: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Data magna do estado",
				fixed_date: [10, 19]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		"Rio de Janeiro": { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Dia da Consciência Negra",
				fixed_date: [11, 20]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		"Rio Grande do Norte": { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "São Jorge",
				fixed_date: [4, 23]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Mártires de Cunhaú e Uruaçu",
				fixed_date: [10, 3]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		"Rio Grande do Sul": { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Proclamação da República Rio-Grandense",
				fixed_date: [9, 20]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Rondônia: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Data magna do estado",
				fixed_date: [1, 4]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Dia do evangélico",
				fixed_date: [6, 18]
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Roraima: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Data magna do estado",
				fixed_date: [10, 5]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		"Santa Catarina": { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Data magna do estado",
				fixed_date: [8, 11]
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Santa Catarina de Alexandria",
				fixed_date: [11, 25]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		"São Paulo": { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Data magna do estado",
				fixed_date: [7, 9]
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Sergipe: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Aniversário de Aracaju",
				fixed_date: [3, 17]
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "São João",
				fixed_date: [6, 24]
			},
			{
				name: "Data magna do estado",
				fixed_date: [7, 8]
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Nossa Senhora da Conceição",
				fixed_date: [12, 8]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] },
		Tocantins: { PH: [
			{
				name: "Ano Novo",
				fixed_date: [1, 1]
			},
			{
				name: "Carnaval",
				variable_date: "easter",
				offset: -47
			},
			{
				name: "Autonomia do estado",
				fixed_date: [3, 18]
			},
			{
				name: "Sexta-feira santa",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tiradentes",
				fixed_date: [4, 21]
			},
			{
				name: "Dia do Trabalhador",
				fixed_date: [5, 1]
			},
			{
				name: "Corpus Christi",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Independência",
				fixed_date: [9, 7]
			},
			{
				name: "Nossa Senhora da Natividade",
				fixed_date: [9, 8]
			},
			{
				name: "Criação do estado",
				fixed_date: [10, 5]
			},
			{
				name: "Nossa Senhora Aparecida",
				fixed_date: [10, 12]
			},
			{
				name: "Finados",
				fixed_date: [11, 2]
			},
			{
				name: "Proclamação da República",
				fixed_date: [11, 15]
			},
			{
				name: "Natal",
				fixed_date: [12, 25]
			}
		] }
	},
	by: { SH: [
		{
			name: "Зімовыя вакацыі",
			2019: [
				12,
				26,
				1,
				11
			],
			2020: [
				12,
				25,
				1,
				10
			],
			2021: [
				12,
				25,
				1,
				9
			],
			2022: [
				12,
				25,
				1,
				8
			],
			2023: [
				12,
				24,
				1,
				7
			],
			2024: [
				12,
				25,
				1,
				7
			],
			2025: [
				12,
				25,
				1,
				7
			]
		},
		{
			name: "Вясновыя вакацыі",
			2020: [
				3,
				30,
				4,
				18
			],
			2021: [
				3,
				28,
				4,
				4
			],
			2022: [
				3,
				27,
				4,
				3
			],
			2023: [
				3,
				26,
				4,
				2
			],
			2024: [
				3,
				24,
				3,
				31
			],
			2025: [
				3,
				23,
				3,
				30
			],
			2026: [
				3,
				22,
				3,
				29
			]
		},
		{
			name: "Летнія вакацыі",
			2020: [
				6,
				1,
				8,
				31
			],
			2021: [
				6,
				1,
				8,
				31
			],
			2022: [
				6,
				1,
				8,
				31
			],
			2023: [
				6,
				1,
				8,
				31
			],
			2024: [
				6,
				1,
				8,
				31
			],
			2025: [
				6,
				1,
				8,
				31
			],
			2026: [
				6,
				1,
				8,
				31
			]
		},
		{
			name: "Восеньскія вакацыі",
			2020: [
				11,
				1,
				11,
				8
			],
			2021: [
				10,
				31,
				11,
				7
			],
			2022: [
				10,
				30,
				11,
				7
			],
			2023: [
				10,
				29,
				11,
				7
			],
			2024: [
				10,
				27,
				11,
				5
			],
			2025: [
				11,
				2,
				11,
				9
			]
		}
	] },
	ca: {
		PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Canada Day",
				variable_date: "canadaDay"
			},
			{
				name: "Labour Day",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			}
		],
		Alberta: { PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Alberta Family Day",
				variable_date: "firstFebruaryMonday",
				offset: 14
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Easter Monday",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Victoria Day",
				variable_date: "victoriaDay"
			},
			{
				name: "Canada Day",
				variable_date: "canadaDay"
			},
			{
				name: "Heritage Day",
				variable_date: "firstAugustMonday"
			},
			{
				name: "Labour Day",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Thanksgiving",
				variable_date: "firstOctoberMonday",
				offset: 7
			},
			{
				name: "Remembrance Day",
				fixed_date: [11, 11]
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			},
			{
				name: "Boxing Day",
				fixed_date: [12, 26]
			}
		] },
		"British Columbia": { PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Family Day",
				variable_date: "firstFebruaryMonday",
				offset: 7
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Victoria Day",
				variable_date: "victoriaDay"
			},
			{
				name: "Canada Day",
				variable_date: "canadaDay"
			},
			{
				name: "British Columbia Day",
				variable_date: "firstAugustMonday"
			},
			{
				name: "Labour Day",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Thanksgiving",
				variable_date: "firstOctoberMonday",
				offset: 7
			},
			{
				name: "Remembrance Day",
				fixed_date: [11, 11]
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			}
		] },
		Manitoba: { PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Louis Riel Day",
				variable_date: "firstFebruaryMonday",
				offset: 14
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Victoria Day",
				variable_date: "victoriaDay"
			},
			{
				name: "Canada Day",
				variable_date: "canadaDay"
			},
			{
				name: "Civic Holiday",
				variable_date: "firstAugustMonday"
			},
			{
				name: "Labour Day",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Thanksgiving",
				variable_date: "firstOctoberMonday",
				offset: 7
			},
			{
				name: "Remembrance Day",
				fixed_date: [11, 11]
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			}
		] },
		"New Brunswick": { PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Victoria Day",
				variable_date: "victoriaDay"
			},
			{
				name: "Canada Day",
				variable_date: "canadaDay"
			},
			{
				name: "New Brunswick Day",
				variable_date: "firstAugustMonday"
			},
			{
				name: "Labour Day",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Thanksgiving",
				variable_date: "firstOctoberMonday",
				offset: 7
			},
			{
				name: "Remembrance Day",
				fixed_date: [11, 11]
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			},
			{
				name: "Boxing Day",
				fixed_date: [12, 26]
			}
		] },
		"Newfoundland and Labrador": { PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Saint Patrick's Day",
				fixed_date: [3, 17]
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Saint George's Day",
				fixed_date: [4, 23]
			},
			{
				name: "Discovery Day",
				fixed_date: [6, 24]
			},
			{
				name: "Memorial Day",
				fixed_date: [7, 1]
			},
			{
				name: "Orangemen's Day",
				fixed_date: [7, 12]
			},
			{
				name: "Labour Day",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Armistice Day",
				fixed_date: [11, 11]
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			}
		] },
		"Northwest Territories": { PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Victoria Day",
				variable_date: "victoriaDay"
			},
			{
				name: "National Aboriginal Day",
				fixed_date: [6, 21]
			},
			{
				name: "Canada Day",
				variable_date: "canadaDay"
			},
			{
				name: "Civic Holiday",
				variable_date: "firstAugustMonday"
			},
			{
				name: "Labour Day",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Thanksgiving",
				variable_date: "firstOctoberMonday",
				offset: 7
			},
			{
				name: "Remembrance Day",
				fixed_date: [11, 11]
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			}
		] },
		"Nova Scotia": { PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Victoria Day",
				variable_date: "victoriaDay"
			},
			{
				name: "Canada Day",
				variable_date: "canadaDay"
			},
			{
				name: "Natal Day",
				variable_date: "firstAugustMonday"
			},
			{
				name: "Labour Day",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Thanksgiving",
				variable_date: "firstOctoberMonday",
				offset: 7
			},
			{
				name: "Remembrance Day",
				fixed_date: [11, 11]
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			},
			{
				name: "Boxing Day",
				fixed_date: [12, 26]
			}
		] },
		Nunavut: { PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Victoria Day",
				variable_date: "victoriaDay"
			},
			{
				name: "Canada Day",
				variable_date: "canadaDay"
			},
			{
				name: "Nunavut Day",
				fixed_date: [7, 9]
			},
			{
				name: "Civic Holiday",
				variable_date: "firstAugustMonday"
			},
			{
				name: "Labour Day",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Thanksgiving",
				variable_date: "firstOctoberMonday",
				offset: 7
			},
			{
				name: "Remembrance Day",
				fixed_date: [11, 11]
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			}
		] },
		Ontario: { PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Family Day",
				variable_date: "firstFebruaryMonday",
				offset: 14
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Victoria Day",
				variable_date: "victoriaDay"
			},
			{
				name: "Canada Day",
				variable_date: "canadaDay"
			},
			{
				name: "August Civic Public Holiday",
				variable_date: "firstAugustMonday"
			},
			{
				name: "Labour Day",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Thanksgiving",
				variable_date: "firstOctoberMonday",
				offset: 7
			},
			{
				name: "Remembrance Day",
				fixed_date: [11, 11]
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			},
			{
				name: "Boxing Day",
				fixed_date: [12, 26]
			}
		] },
		"Prince Edward Island": { PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Islander Day",
				variable_date: "firstFebruaryMonday",
				offset: 14
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Easter Monday",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Victoria Day",
				variable_date: "victoriaDay"
			},
			{
				name: "Canada Day",
				variable_date: "canadaDay"
			},
			{
				name: "Civic Holiday",
				variable_date: "firstAugustMonday"
			},
			{
				name: "Gold Cup Parade Day",
				variable_date: "firstAugustMonday",
				offset: 18
			},
			{
				name: "Labour Day",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Thanksgiving",
				variable_date: "firstOctoberMonday",
				offset: 7
			},
			{
				name: "Remembrance Day",
				fixed_date: [11, 11]
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			},
			{
				name: "Boxing Day",
				fixed_date: [12, 26]
			}
		] },
		Quebec: { PH: [
			{
				name: "Jour de l'an",
				fixed_date: [1, 1]
			},
			{
				name: "Vendredi saint",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Lundi de Pâques",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Journée nationale des patriotes",
				variable_date: "victoriaDay"
			},
			{
				name: "Fête nationale du Québec",
				fixed_date: [6, 24]
			},
			{
				name: "Fête du Canada",
				variable_date: "canadaDay"
			},
			{
				name: "Fête du Travail",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Jour de l'Action de grâce",
				variable_date: "firstOctoberMonday",
				offset: 7
			},
			{
				name: "Noël",
				fixed_date: [12, 25]
			}
		] },
		Saskatchewan: { PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Family Day",
				variable_date: "firstFebruaryMonday",
				offset: 14
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Victoria Day",
				variable_date: "victoriaDay"
			},
			{
				name: "Canada Day",
				variable_date: "canadaDay"
			},
			{
				name: "Saskatchewan Day",
				variable_date: "firstAugustMonday"
			},
			{
				name: "Labour Day",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Thanksgiving",
				variable_date: "firstOctoberMonday",
				offset: 7
			},
			{
				name: "Remembrance Day",
				fixed_date: [11, 11]
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			}
		] },
		Yukon: { PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Heritage Day",
				variable_date: "lastFebruarySunday",
				offset: -2
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Easter Monday",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Victoria Day",
				variable_date: "victoriaDay"
			},
			{
				name: "Canada Day",
				variable_date: "canadaDay"
			},
			{
				name: "Discovery Day",
				variable_date: "firstAugustMonday",
				offset: 14
			},
			{
				name: "Labour Day",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Thanksgiving",
				variable_date: "firstOctoberMonday",
				offset: 7
			},
			{
				name: "Remembrance Day",
				fixed_date: [11, 11]
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			},
			{
				name: "Boxing Day",
				fixed_date: [12, 26]
			}
		] }
	},
	ch: {
		PH: [
			{
				name: "Neujahrstag/Nouvel an/Capo d'anno",
				fixed_date: [1, 1]
			},
			{
				name: "Berchtoldstag/2 janvier",
				fixed_date: [1, 2],
				only_states: [
					"Zürich",
					"Bern",
					"Luzern",
					"Obwalden",
					"Nidwalden",
					"Glarus",
					"Zug",
					"Freiburg",
					"Solothurn",
					"Schaffhausen",
					"Graubünden",
					"Aargau",
					"Thurgau",
					"Waadt",
					"Neuenburg",
					"Genf",
					"Jura",
					"Sankt Gallen",
					"Wallis"
				]
			},
			{
				name: "Heilige Drei Könige/Epifania",
				fixed_date: [1, 6],
				only_states: [
					"Uri",
					"Schwyz",
					"Graubünden",
					"Tessin"
				]
			},
			{
				name: "Instauration de la République",
				fixed_date: [3, 1],
				only_states: ["Neuenburg"]
			},
			{
				name: "Josefstag/Saint-Joseph/San Giuseppe",
				fixed_date: [3, 19],
				only_states: [
					"Luzern",
					"Uri",
					"Schwyz",
					"Nidwalden",
					"Zug",
					"Graubünden",
					"Tessin",
					"Wallis"
				]
			},
			{
				name: "Karfreitag/Vendredi saint",
				variable_date: "easter",
				offset: -2,
				only_states: [
					"Zürich",
					"Bern",
					"Luzern",
					"Uri",
					"Schwyz",
					"Obwalden",
					"Nidwalden",
					"Glarus",
					"Zug",
					"Freiburg",
					"Solothurn",
					"Basel-Stadt",
					"Basel-Landschaft",
					"Schaffhausen",
					"Appenzell Ausserrhoden",
					"Appenzell Innerrhoden",
					"Sankt Gallen",
					"Graubünden",
					"Aargau",
					"Thurgau",
					"Waadt",
					"Neuenburg",
					"Genf",
					"Jura"
				]
			},
			{
				name: "Ostermontag/Lundi de Pâques/Lunedi di Pasqua",
				variable_date: "easter",
				offset: 1,
				only_states: /* @__PURE__ */ "Zürich.Bern.Luzern.Uri.Schwyz.Obwalden.Nidwalden.Glarus.Zug.Freiburg.Solothurn.Basel-Stadt.Basel-Landschaft.Schaffhausen.Appenzell Ausserrhoden.Appenzell Innerrhoden.Sankt Gallen.Graubünden.Aargau.Thurgau.Tessin.Waadt.Neuenburg.Genf.Jura.Wallis".split(".")
			},
			{
				name: "Tag der Arbeit/Festa dei lavoratori",
				fixed_date: [5, 1],
				only_states: [
					"Zürich",
					"Freiburg",
					"Solothurn",
					"Basel-Stadt",
					"Basel-Landschaft",
					"Schaffhausen",
					"Aargau",
					"Thurgau",
					"Tessin",
					"Neuenburg",
					"Jura"
				]
			},
			{
				name: "Auffahrt/Ascension/Ascensione",
				variable_date: "easter",
				offset: 39
			},
			{
				name: "Pfingstmontag/Lundi de Pentecôte/Lunedi di Pentecoste",
				variable_date: "easter",
				offset: 50,
				only_states: /* @__PURE__ */ "Zürich.Bern.Luzern.Uri.Schwyz.Obwalden.Nidwalden.Glarus.Zug.Freiburg.Solothurn.Basel-Stadt.Basel-Landschaft.Schaffhausen.Appenzell Ausserrhoden.Appenzell Innerrhoden.Sankt Gallen.Graubünden.Aargau.Thurgau.Tessin.Waadt.Neuenburg.Genf.Jura.Wallis".split(".")
			},
			{
				name: "Fronleichnam/Fête-Dieu/Corpus domini",
				variable_date: "easter",
				offset: 60,
				only_states: [
					"Luzern",
					"Uri",
					"Schwyz",
					"Obwalden",
					"Nidwalden",
					"Zug",
					"Freiburg",
					"Solothurn",
					"Basel-Landschaft",
					"Appenzell Innerrhoden",
					"Graubünden",
					"Aargau",
					"Tessin",
					"Wallis",
					"Neuenburg",
					"Jura"
				]
			},
			{
				name: "Commémoration du plébiscite jurassien",
				fixed_date: [6, 23],
				only_states: ["Jura"]
			},
			{
				name: "San Pietro e Paolo",
				fixed_date: [6, 29],
				only_states: ["Tessin"]
			},
			{
				name: "Bundesfeiertag/Jour de la fête nationale/Giorno festivo federale",
				fixed_date: [8, 1]
			},
			{
				name: "Mariä Himmelfahrt/Assomption/Assunzione",
				fixed_date: [8, 15],
				only_states: [
					"Luzern",
					"Uri",
					"Schwyz",
					"Obwalden",
					"Nidwalden",
					"Zug",
					"Freiburg",
					"Solothurn",
					"Basel-Landschaft",
					"Appenzell Innerrhoden",
					"Graubünden",
					"Aargau",
					"Tessin",
					"Wallis",
					"Jura"
				]
			},
			{
				name: "Mauritiustag",
				fixed_date: [9, 22],
				only_states: ["Appenzell Innerrhoden"]
			},
			{
				name: "Bruderklausenfest",
				fixed_date: [9, 25],
				only_states: ["Obwalden"]
			},
			{
				name: "Allerheiligen/Toussaint/Ognissanti",
				fixed_date: [11, 1],
				only_states: [
					"Luzern",
					"Uri",
					"Schwyz",
					"Obwalden",
					"Nidwalden",
					"Glarus",
					"Zug",
					"Freiburg",
					"Solothurn",
					"Appenzell Innerrhoden",
					"Sankt Gallen",
					"Graubünden",
					"Aargau",
					"Tessin",
					"Wallis",
					"Jura"
				]
			},
			{
				name: "Mariä Empfängnis/Immaculée Conception/Ognissanti",
				fixed_date: [12, 8],
				only_states: [
					"Luzern",
					"Uri",
					"Schwyz",
					"Obwalden",
					"Nidwalden",
					"Zug",
					"Freiburg",
					"Solothurn",
					"Appenzell Innerrhoden",
					"Graubünden",
					"Aargau",
					"Tessin",
					"Wallis"
				]
			},
			{
				name: "Weihnachtstag/Noël/Natale",
				fixed_date: [12, 25]
			},
			{
				name: "Stephanstag/Saint-Etienne/Santo Stefano",
				fixed_date: [12, 26],
				only_states: [
					"Zürich",
					"Bern",
					"Luzern",
					"Uri",
					"Schwyz",
					"Obwalden",
					"Nidwalden",
					"Glarus",
					"Zug",
					"Freiburg",
					"Solothurn",
					"Basel-Stadt",
					"Basel-Landschaft",
					"Schaffhausen",
					"Appenzell Ausserrhoden",
					"Appenzell Innerrhoden",
					"Sankt Gallen",
					"Graubünden",
					"Aargau",
					"Thurgau",
					"Tessin",
					"Wallis"
				]
			},
			{
				name: "Restauration de la République",
				fixed_date: [12, 31],
				only_states: ["Genf"]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
		Aargau: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Aargau&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "ag",
			SH: [
				{
					name: "Winterferien",
					2019: [
						12,
						23,
						1,
						3
					],
					2020: [
						12,
						21,
						12,
						31
					],
					2021: [
						12,
						24,
						1,
						7
					],
					2022: [
						12,
						27,
						1,
						6
					],
					2023: [
						12,
						27,
						1,
						5
					],
					2024: [
						12,
						23,
						1,
						3
					],
					2025: [
						12,
						22,
						1,
						2
					],
					2026: [
						12,
						21,
						12,
						31
					],
					2027: [
						12,
						24,
						1,
						7
					],
					2028: [
						12,
						27,
						1,
						5
					],
					2029: [
						12,
						24,
						1,
						4
					],
					2030: [
						12,
						23,
						1,
						3
					],
					2031: [
						12,
						22,
						12,
						31
					],
					2032: [
						12,
						24,
						1,
						7
					],
					2033: [
						12,
						27,
						1,
						6
					],
					2034: [
						12,
						27,
						1,
						5
					]
				},
				{
					name: "Sommerferien",
					2020: [
						7,
						20,
						8,
						7
					],
					2021: [
						7,
						19,
						8,
						6
					],
					2022: [
						7,
						18,
						8,
						5
					],
					2023: [
						7,
						24,
						8,
						11
					],
					2024: [
						7,
						22,
						8,
						9
					],
					2025: [
						7,
						21,
						8,
						8
					],
					2026: [
						7,
						20,
						8,
						7
					],
					2027: [
						7,
						19,
						8,
						6
					],
					2028: [
						7,
						24,
						8,
						11
					],
					2029: [
						7,
						23,
						8,
						10
					],
					2030: [
						7,
						22,
						8,
						9
					],
					2031: [
						7,
						21,
						8,
						8
					],
					2032: [
						7,
						19,
						8,
						6
					],
					2033: [
						7,
						18,
						8,
						5
					],
					2034: [
						7,
						24,
						8,
						11
					],
					2035: [
						7,
						23,
						8,
						10
					]
				},
				{
					name: "Herbstferien",
					2020: [
						9,
						28,
						10,
						9
					],
					2021: [
						10,
						4,
						10,
						15
					],
					2022: [
						10,
						3,
						10,
						14
					],
					2023: [
						10,
						2,
						10,
						13
					],
					2024: [
						9,
						30,
						10,
						11
					],
					2025: [
						9,
						29,
						10,
						10
					],
					2026: [
						9,
						28,
						10,
						9
					],
					2027: [
						10,
						4,
						10,
						15
					],
					2028: [
						10,
						2,
						10,
						13
					],
					2029: [
						10,
						1,
						10,
						12
					],
					2030: [
						9,
						30,
						10,
						11
					],
					2031: [
						9,
						29,
						10,
						10
					],
					2032: [
						9,
						27,
						10,
						8
					],
					2033: [
						10,
						3,
						10,
						14
					],
					2034: [
						10,
						2,
						10,
						13
					]
				},
				{
					name: "Frühlingsferien",
					2020: [
						4,
						6,
						4,
						17
					],
					2021: [
						4,
						12,
						4,
						23
					],
					2022: [
						4,
						11,
						4,
						21
					],
					2023: [
						4,
						11,
						4,
						21
					],
					2024: [
						4,
						8,
						4,
						19
					],
					2025: [
						4,
						7,
						4,
						18
					],
					2026: [
						4,
						7,
						4,
						17
					],
					2027: [
						4,
						12,
						4,
						23
					],
					2028: [
						4,
						10,
						4,
						21
					],
					2029: [
						4,
						9,
						4,
						20
					],
					2030: [
						4,
						6,
						4,
						18
					],
					2031: [
						4,
						7,
						4,
						18
					],
					2032: [
						4,
						5,
						4,
						16
					],
					2033: [
						4,
						11,
						4,
						22
					],
					2034: [
						4,
						11,
						4,
						21
					],
					2035: [
						4,
						9,
						4,
						20
					]
				}
			]
		},
		Albula: { SH: [
			{
				name: "Herbstferien",
				2020: [
					10,
					10,
					10,
					25
				],
				2021: [
					10,
					9,
					10,
					24
				],
				2022: [
					10,
					8,
					10,
					23
				],
				2023: [
					10,
					7,
					10,
					22
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					6,
					10,
					17
				],
				2026: [
					10,
					10,
					10,
					25
				],
				2027: [
					10,
					9,
					10,
					24
				],
				2028: [
					10,
					7,
					10,
					22
				],
				2029: [
					10,
					6,
					10,
					21
				]
			},
			{
				name: "Weihnachtsferien",
				2019: [
					12,
					21,
					1,
					5
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					23,
					1,
					5
				],
				2027: [
					12,
					23,
					1,
					5
				],
				2028: [
					12,
					23,
					1,
					7
				],
				2029: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Schulbeginn",
				2020: [
					8,
					17,
					8,
					17
				],
				2021: [
					8,
					16,
					8,
					16
				],
				2022: [
					8,
					15,
					8,
					15
				],
				2023: [
					8,
					14,
					8,
					14
				],
				2024: [
					8,
					12,
					8,
					12
				],
				2025: [
					8,
					11,
					8,
					11
				],
				2026: [
					8,
					17,
					8,
					17
				],
				2027: [
					8,
					16,
					8,
					16
				],
				2028: [
					8,
					14,
					8,
					14
				],
				2029: [
					8,
					13,
					8,
					13
				]
			}
		] },
		Appenzell: { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					4,
					8,
					16
				],
				2021: [
					7,
					3,
					8,
					15
				],
				2022: [
					7,
					2,
					8,
					15
				],
				2023: [
					7,
					1,
					8,
					13
				],
				2024: [
					6,
					29,
					8,
					11
				],
				2025: [
					7,
					5,
					8,
					17
				],
				2026: [
					7,
					4,
					8,
					16
				],
				2027: [
					7,
					3,
					8,
					15
				],
				2028: [
					7,
					1,
					8,
					13
				]
			},
			{
				name: "Herbstferien",
				2020: [
					10,
					3,
					10,
					18
				],
				2021: [
					10,
					9,
					10,
					24
				],
				2022: [
					10,
					8,
					10,
					23
				],
				2023: [
					10,
					7,
					10,
					22
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					4,
					10,
					19
				],
				2026: [
					10,
					3,
					10,
					18
				],
				2027: [
					10,
					2,
					10,
					17
				]
			},
			{
				name: "Sportferien",
				2020: [
					2,
					21,
					3,
					1
				],
				2021: [
					2,
					12,
					2,
					21
				],
				2022: [
					2,
					25,
					3,
					6
				],
				2023: [
					2,
					17,
					2,
					26
				],
				2024: [
					2,
					9,
					2,
					18
				],
				2025: [
					2,
					22,
					2,
					28
				],
				2026: [
					2,
					13,
					2,
					22
				],
				2027: [
					2,
					5,
					2,
					14
				]
			}
		] },
		"Appenzell Ausserrhoden": {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Appenzell%20Ausserrhoden&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "ar",
			SH: [
				{
					name: "Sommerferien",
					2020: [
						7,
						6,
						8,
						7
					],
					2021: [
						7,
						12,
						8,
						15
					],
					2022: [
						7,
						11,
						8,
						12
					],
					2023: [
						7,
						10,
						8,
						11
					],
					2024: [
						7,
						8,
						8,
						9
					],
					2025: [
						7,
						7,
						8,
						8
					],
					2026: [
						7,
						6,
						8,
						7
					],
					2027: [
						7,
						12,
						8,
						13
					],
					2028: [
						7,
						10,
						8,
						11
					]
				},
				{
					name: "Herbstferien",
					2020: [
						10,
						5,
						10,
						16
					],
					2021: [
						10,
						11,
						10,
						24
					],
					2022: [
						10,
						20,
						10,
						21
					],
					2023: [
						10,
						9,
						10,
						20
					],
					2024: [
						10,
						7,
						10,
						18
					],
					2025: [
						10,
						6,
						10,
						17
					],
					2026: [
						10,
						5,
						10,
						16
					],
					2027: [
						10,
						11,
						10,
						22
					]
				},
				{
					name: "Weihnachtsferien",
					2020: [
						12,
						21,
						1,
						1
					],
					2021: [
						12,
						26,
						12,
						31
					],
					2022: [
						12,
						26,
						1,
						6
					],
					2023: [
						12,
						25,
						1,
						5
					],
					2024: [
						12,
						23,
						1,
						3
					],
					2025: [
						12,
						22,
						1,
						2
					],
					2026: [
						12,
						21,
						1,
						1
					],
					2027: [
						12,
						20,
						12,
						31
					]
				},
				{
					name: "Frühlingsferien",
					2020: [
						4,
						6,
						4,
						17
					],
					2021: [
						4,
						12,
						4,
						23
					],
					2022: [
						4,
						11,
						4,
						22
					],
					2023: [
						4,
						10,
						4,
						21
					],
					2024: [
						4,
						8,
						4,
						19
					],
					2025: [
						4,
						7,
						4,
						18
					],
					2026: [
						4,
						3,
						4,
						17
					],
					2027: [
						4,
						12,
						4,
						23
					],
					2028: [
						4,
						10,
						4,
						21
					]
				}
			]
		},
		"Appenzell Innerrhoden": {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Appenzell%20Innerrhoden&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "ai",
			SH: [{
				name: "Weihnachtsferien",
				2020: [
					12,
					19,
					1,
					3
				],
				2021: [
					12,
					18,
					1,
					2
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					20,
					1,
					4
				],
				2026: [
					12,
					19,
					1,
					3
				],
				2027: [
					12,
					18,
					1,
					2
				]
			}, {
				name: "Frühlingsferien",
				2020: [
					4,
					4,
					4,
					19
				],
				2021: [
					4,
					10,
					4,
					25
				],
				2022: [
					4,
					9,
					4,
					24
				],
				2023: [
					4,
					7,
					4,
					23
				],
				2024: [
					4,
					6,
					4,
					21
				],
				2025: [
					4,
					5,
					4,
					20
				],
				2026: [
					4,
					3,
					4,
					19
				],
				2027: [
					4,
					10,
					4,
					25
				],
				2028: [
					4,
					8,
					4,
					23
				]
			}]
		},
		"Basel-Landschaft": {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Basel-Landschaft&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "bl",
			SH: [
				{
					name: "Sommerferien",
					2020: [
						6,
						27,
						8,
						9
					],
					2021: [
						7,
						3,
						8,
						15
					],
					2022: [
						7,
						2,
						8,
						14
					],
					2023: [
						7,
						2,
						8,
						13
					],
					2024: [
						6,
						29,
						8,
						11
					],
					2025: [
						6,
						28,
						8,
						10
					],
					2026: [
						6,
						27,
						8,
						9
					],
					2027: [
						7,
						3,
						8,
						15
					],
					2028: [
						7,
						1,
						8,
						13
					],
					2029: [
						6,
						30,
						8,
						12
					],
					2030: [
						6,
						29,
						8,
						11
					],
					2031: [
						6,
						28,
						8,
						10
					],
					2032: [
						6,
						26,
						8,
						8
					]
				},
				{
					name: "Herbstferien",
					2020: [
						9,
						26,
						10,
						9
					],
					2021: [
						10,
						2,
						10,
						17
					],
					2022: [
						10,
						2,
						10,
						16
					],
					2023: [
						9,
						30,
						10,
						15
					],
					2024: [
						9,
						28,
						10,
						13
					],
					2025: [
						9,
						27,
						10,
						12
					],
					2026: [
						9,
						26,
						10,
						11
					],
					2027: [
						10,
						2,
						10,
						17
					],
					2028: [
						9,
						30,
						10,
						15
					],
					2029: [
						9,
						29,
						10,
						14
					],
					2030: [
						9,
						28,
						10,
						13
					],
					2031: [
						9,
						27,
						10,
						12
					]
				},
				{
					name: "Weihnachtsferien",
					2019: [
						12,
						21,
						1,
						5
					],
					2020: [
						12,
						19,
						1,
						3
					],
					2021: [
						12,
						18,
						1,
						2
					],
					2022: [
						12,
						24,
						1,
						8
					],
					2023: [
						12,
						23,
						1,
						7
					],
					2024: [
						12,
						21,
						1,
						5
					],
					2025: [
						12,
						20,
						1,
						4
					],
					2026: [
						12,
						19,
						1,
						3
					],
					2027: [
						12,
						18,
						1,
						2
					],
					2028: [
						12,
						23,
						1,
						7
					],
					2029: [
						12,
						22,
						1,
						6
					],
					2030: [
						12,
						21,
						1,
						5
					],
					2031: [
						12,
						20,
						1,
						4
					]
				},
				{
					name: "Fasnachtsferien",
					2020: [
						2,
						22,
						3,
						8
					],
					2021: [
						2,
						13,
						2,
						28
					],
					2022: [
						2,
						26,
						3,
						13
					],
					2023: [
						2,
						18,
						3,
						5
					],
					2024: [
						2,
						10,
						2,
						25
					],
					2025: [
						3,
						1,
						3,
						16
					],
					2026: [
						2,
						14,
						3,
						1
					],
					2027: [
						2,
						6,
						2,
						21
					],
					2028: [
						2,
						26,
						3,
						12
					],
					2029: [
						2,
						10,
						2,
						25
					],
					2030: [
						3,
						2,
						3,
						17
					],
					2031: [
						2,
						22,
						3,
						9
					],
					2032: [
						2,
						7,
						2,
						22
					]
				},
				{
					name: "Frühlingsferien",
					2020: [
						4,
						4,
						4,
						19
					],
					2021: [
						3,
						27,
						4,
						11
					],
					2022: [
						4,
						9,
						4,
						24
					],
					2023: [
						4,
						1,
						4,
						16
					],
					2024: [
						3,
						23,
						4,
						7
					],
					2025: [
						4,
						12,
						4,
						27
					],
					2026: [
						3,
						28,
						4,
						12
					],
					2027: [
						3,
						20,
						4,
						4
					],
					2028: [
						4,
						8,
						4,
						23
					],
					2029: [
						3,
						24,
						4,
						8
					],
					2030: [
						4,
						13,
						4,
						28
					],
					2031: [
						4,
						5,
						4,
						20
					],
					2032: [
						3,
						20,
						4,
						4
					]
				},
				{
					name: "Auffahrtsbrücke",
					2020: [
						5,
						22,
						5,
						22
					],
					2021: [
						5,
						14,
						5,
						14
					],
					2022: [
						5,
						27,
						5,
						27
					],
					2023: [
						5,
						19,
						5,
						19
					],
					2024: [
						5,
						10,
						5,
						10
					],
					2025: [
						5,
						30,
						5,
						30
					],
					2026: [
						5,
						25,
						5,
						25
					],
					2027: [
						5,
						7,
						5,
						7
					],
					2028: [
						6,
						26,
						6,
						26
					],
					2029: [
						5,
						11,
						5,
						11
					],
					2030: [
						5,
						31,
						5,
						31
					],
					2031: [
						5,
						23,
						5,
						23
					],
					2032: [
						5,
						7,
						5,
						7
					]
				}
			]
		},
		"Basel-Stadt": {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Basel-Stadt&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "bs",
			SH: [
				{
					name: "Sommerferien",
					2020: [
						6,
						27,
						8,
						9
					],
					2021: [
						7,
						3,
						8,
						15
					],
					2022: [
						7,
						2,
						8,
						14
					],
					2023: [
						7,
						1,
						8,
						13
					],
					2024: [
						6,
						29,
						8,
						11
					],
					2025: [
						6,
						28,
						8,
						10
					],
					2026: [
						6,
						27,
						8,
						9
					],
					2027: [
						7,
						3,
						8,
						15
					],
					2028: [
						7,
						1,
						8,
						13
					],
					2029: [
						6,
						30,
						8,
						12
					],
					2030: [
						6,
						29,
						8,
						11
					],
					2031: [
						6,
						28,
						8,
						10
					],
					2032: [
						6,
						26,
						8,
						8
					]
				},
				{
					name: "Herbstferien",
					2020: [
						9,
						26,
						10,
						11
					],
					2021: [
						10,
						2,
						10,
						17
					],
					2022: [
						10,
						1,
						10,
						16
					],
					2023: [
						9,
						30,
						10,
						15
					],
					2024: [
						9,
						28,
						10,
						13
					],
					2025: [
						9,
						27,
						10,
						12
					],
					2026: [
						9,
						26,
						10,
						11
					],
					2027: [
						10,
						2,
						10,
						17
					],
					2028: [
						9,
						30,
						10,
						15
					],
					2029: [
						9,
						29,
						10,
						14
					],
					2030: [
						9,
						28,
						10,
						13
					],
					2031: [
						9,
						27,
						10,
						12
					]
				},
				{
					name: "Weihnachtsferien",
					2019: [
						12,
						21,
						1,
						5
					],
					2020: [
						12,
						19,
						1,
						3
					],
					2021: [
						12,
						18,
						1,
						2
					],
					2022: [
						12,
						24,
						1,
						8
					],
					2023: [
						12,
						23,
						1,
						7
					],
					2024: [
						12,
						21,
						1,
						5
					],
					2025: [
						12,
						20,
						1,
						4
					],
					2026: [
						12,
						19,
						1,
						3
					],
					2027: [
						12,
						18,
						1,
						2
					],
					2028: [
						12,
						23,
						1,
						7
					],
					2029: [
						12,
						22,
						1,
						6
					],
					2030: [
						12,
						21,
						1,
						5
					],
					2031: [
						12,
						20,
						1,
						4
					]
				},
				{
					name: "Fasnachtsferien",
					2020: [
						2,
						22,
						3,
						8
					],
					2021: [
						2,
						13,
						2,
						28
					],
					2022: [
						2,
						26,
						3,
						13
					],
					2023: [
						2,
						18,
						3,
						5
					],
					2024: [
						2,
						10,
						2,
						25
					],
					2025: [
						3,
						1,
						3,
						16
					],
					2026: [
						2,
						14,
						3,
						1
					],
					2027: [
						2,
						6,
						2,
						21
					],
					2028: [
						2,
						16,
						3,
						12
					],
					2029: [
						2,
						10,
						2,
						25
					],
					2030: [
						3,
						2,
						3,
						17
					],
					2031: [
						2,
						22,
						3,
						9
					],
					2032: [
						2,
						7,
						2,
						22
					]
				},
				{
					name: "Frühlingsferien",
					2020: [
						4,
						4,
						4,
						19
					],
					2021: [
						3,
						27,
						4,
						11
					],
					2022: [
						4,
						9,
						4,
						24
					],
					2023: [
						4,
						1,
						4,
						16
					],
					2024: [
						3,
						23,
						4,
						7
					],
					2025: [
						4,
						12,
						4,
						27
					],
					2026: [
						3,
						28,
						4,
						12
					],
					2027: [
						3,
						20,
						4,
						4
					],
					2028: [
						4,
						8,
						4,
						23
					],
					2029: [
						3,
						24,
						4,
						8
					],
					2030: [
						4,
						13,
						4,
						28
					],
					2031: [
						4,
						5,
						4,
						20
					],
					2032: [
						3,
						20,
						4,
						4
					]
				},
				{
					name: "Auffahrtsbrücke",
					2020: [
						5,
						22,
						5,
						22
					],
					2021: [
						5,
						14,
						5,
						14
					],
					2022: [
						5,
						27,
						5,
						27
					],
					2023: [
						5,
						19,
						5,
						19
					],
					2024: [
						5,
						10,
						5,
						10
					],
					2025: [
						5,
						30,
						5,
						30
					],
					2026: [
						5,
						25,
						5,
						25
					],
					2027: [
						5,
						7,
						5,
						7
					],
					2028: [
						6,
						26,
						6,
						26
					],
					2029: [
						5,
						11,
						5,
						11
					],
					2030: [
						5,
						31,
						5,
						31
					],
					2031: [
						5,
						23,
						5,
						23
					],
					2032: [
						5,
						7,
						5,
						7
					]
				}
			]
		},
		Bern: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Bern&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "be",
			SH: [
				{
					name: "Winterferien",
					2020: [
						12,
						24,
						1,
						10
					],
					2021: [
						12,
						24,
						1,
						9
					],
					2022: [
						12,
						24,
						1,
						8
					],
					2023: [
						12,
						23,
						1,
						7
					],
					2024: [
						12,
						21,
						1,
						5
					],
					2025: [
						12,
						20,
						1,
						4
					],
					2026: [
						12,
						25,
						1,
						10
					],
					2027: [
						12,
						25,
						1,
						9
					]
				},
				{
					name: "Sommerferien",
					2020: [
						7,
						4,
						8,
						9
					],
					2021: [
						7,
						3,
						8,
						15
					],
					2022: [
						7,
						9,
						8,
						14
					],
					2023: [
						7,
						8,
						8,
						13
					],
					2024: [
						7,
						6,
						8,
						11
					],
					2025: [
						7,
						5,
						8,
						10
					],
					2026: [
						7,
						4,
						8,
						9
					],
					2027: [
						7,
						3,
						8,
						15
					]
				},
				{
					name: "Herbstferien",
					2020: [
						9,
						19,
						10,
						11
					],
					2021: [
						9,
						25,
						10,
						17
					],
					2022: [
						9,
						24,
						10,
						16
					],
					2023: [
						9,
						23,
						10,
						15
					],
					2024: [
						9,
						21,
						10,
						13
					],
					2025: [
						9,
						20,
						10,
						12
					],
					2026: [
						9,
						19,
						10,
						11
					],
					2027: [
						9,
						25,
						10,
						17
					]
				},
				{
					name: "Februarwoche",
					2020: [
						2,
						1,
						2,
						9
					],
					2021: [
						2,
						6,
						2,
						14
					],
					2022: [
						2,
						5,
						2,
						13
					],
					2023: [
						2,
						4,
						2,
						12
					],
					2024: [
						2,
						3,
						2,
						11
					],
					2025: [
						2,
						1,
						2,
						9
					],
					2026: [
						1,
						31,
						2,
						8
					],
					2027: [
						2,
						6,
						2,
						14
					]
				},
				{
					name: "Frühlingsferien",
					2020: [
						4,
						4,
						4,
						19
					],
					2021: [
						4,
						10,
						4,
						25
					],
					2022: [
						4,
						9,
						4,
						24
					],
					2023: [
						4,
						7,
						4,
						23
					],
					2024: [
						4,
						6,
						4,
						21
					],
					2025: [
						4,
						5,
						4,
						21
					],
					2026: [
						4,
						3,
						4,
						19
					],
					2027: [
						4,
						10,
						4,
						25
					]
				},
				{
					name: "Vacances de printemps",
					2020: [
						4,
						10,
						4,
						26
					],
					2021: [
						4,
						2,
						4,
						18
					],
					2022: [
						4,
						11,
						4,
						22
					],
					2023: [
						4,
						7,
						4,
						21
					],
					2024: [
						3,
						29,
						4,
						12
					],
					2025: [
						4,
						14,
						4,
						25
					],
					2026: [
						4,
						3,
						4,
						17
					],
					2027: [
						3,
						26,
						4,
						9
					]
				},
				{
					name: "Vacances d'été",
					2020: [
						7,
						4,
						8,
						16
					],
					2021: [
						7,
						3,
						8,
						15
					],
					2022: [
						7,
						11,
						8,
						19
					],
					2023: [
						7,
						10,
						8,
						18
					],
					2024: [
						7,
						8,
						8,
						16
					],
					2025: [
						7,
						7,
						8,
						15
					],
					2026: [
						7,
						6,
						8,
						14
					],
					2027: [
						7,
						5,
						8,
						13
					]
				},
				{
					name: "Vacances d'automne",
					2020: [
						10,
						3,
						10,
						18
					],
					2021: [
						10,
						11,
						10,
						22
					],
					2022: [
						10,
						10,
						10,
						21
					],
					2023: [
						10,
						9,
						10,
						20
					],
					2024: [
						10,
						7,
						10,
						18
					],
					2025: [
						10,
						6,
						10,
						27
					],
					2026: [
						10,
						5,
						10,
						16
					],
					2027: [
						10,
						4,
						10,
						15
					]
				},
				{
					name: "Vacances d'hiver",
					2020: [
						12,
						25,
						1,
						10
					],
					2021: [
						12,
						27,
						1,
						7
					],
					2022: [
						12,
						26,
						1,
						6
					],
					2023: [
						12,
						25,
						1,
						5
					],
					2024: [
						12,
						23,
						1,
						3
					],
					2025: [
						12,
						22,
						1,
						2
					],
					2026: [
						12,
						25,
						1,
						8
					],
					2027: [
						12,
						27,
						1,
						7
					]
				}
			]
		},
		Bernina: { SH: [
			{
				name: "Herbstferien",
				2020: [
					10,
					10,
					10,
					25
				],
				2021: [
					10,
					9,
					10,
					24
				],
				2022: [
					10,
					8,
					10,
					23
				],
				2023: [
					10,
					7,
					10,
					22
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					6,
					10,
					17
				],
				2026: [
					10,
					10,
					10,
					25
				],
				2027: [
					10,
					9,
					10,
					24
				],
				2028: [
					10,
					7,
					10,
					22
				],
				2029: [
					10,
					6,
					10,
					21
				]
			},
			{
				name: "Weihnachtsferien",
				2019: [
					12,
					21,
					1,
					5
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					23,
					1,
					5
				],
				2027: [
					12,
					23,
					1,
					5
				],
				2028: [
					12,
					23,
					1,
					7
				],
				2029: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Schulbeginn",
				2020: [
					8,
					17,
					8,
					17
				],
				2021: [
					8,
					16,
					8,
					16
				],
				2022: [
					8,
					15,
					8,
					15
				],
				2023: [
					8,
					14,
					8,
					14
				],
				2024: [
					8,
					12,
					8,
					12
				],
				2025: [
					8,
					11,
					8,
					11
				],
				2026: [
					8,
					17,
					8,
					17
				],
				2027: [
					8,
					16,
					8,
					16
				],
				2028: [
					8,
					14,
					8,
					14
				],
				2029: [
					8,
					13,
					8,
					13
				]
			}
		] },
		"Engiadina Bassa/Val Müstair": { SH: [
			{
				name: "Herbstferien",
				2020: [
					10,
					10,
					10,
					25
				],
				2021: [
					10,
					9,
					10,
					24
				],
				2022: [
					10,
					8,
					10,
					23
				],
				2023: [
					10,
					7,
					10,
					22
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					6,
					10,
					17
				],
				2026: [
					10,
					10,
					10,
					25
				],
				2027: [
					10,
					9,
					10,
					24
				],
				2028: [
					10,
					7,
					10,
					22
				],
				2029: [
					10,
					6,
					10,
					21
				]
			},
			{
				name: "Weihnachtsferien",
				2019: [
					12,
					21,
					1,
					5
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					23,
					1,
					5
				],
				2027: [
					12,
					23,
					1,
					5
				],
				2028: [
					12,
					23,
					1,
					7
				],
				2029: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Schulbeginn",
				2020: [
					8,
					17,
					8,
					17
				],
				2021: [
					8,
					16,
					8,
					16
				],
				2022: [
					8,
					15,
					8,
					15
				],
				2023: [
					8,
					14,
					8,
					14
				],
				2024: [
					8,
					12,
					8,
					12
				],
				2025: [
					8,
					11,
					8,
					11
				],
				2026: [
					8,
					17,
					8,
					17
				],
				2027: [
					8,
					16,
					8,
					16
				],
				2028: [
					8,
					14,
					8,
					14
				],
				2029: [
					8,
					13,
					8,
					13
				]
			}
		] },
		Freiburg: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Freiburg&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "fr"
		},
		Fribourg: { SH: [
			{
				name: "Sport",
				2020: [
					2,
					22,
					3,
					1
				],
				2021: [
					2,
					13,
					2,
					21
				],
				2022: [
					2,
					26,
					3,
					6
				],
				2023: [
					2,
					18,
					2,
					26
				],
				2024: [
					2,
					10,
					2,
					18
				],
				2025: [
					3,
					1,
					3,
					9
				],
				2026: [
					2,
					14,
					2,
					22
				]
			},
			{
				name: "Frühling",
				2020: [
					4,
					4,
					4,
					19
				],
				2021: [
					4,
					2,
					4,
					18
				],
				2022: [
					4,
					15,
					5,
					1
				],
				2023: [
					4,
					7,
					4,
					23
				],
				2024: [
					3,
					29,
					4,
					14
				],
				2025: [
					4,
					18,
					5,
					4
				],
				2026: [
					4,
					3,
					4,
					19
				]
			},
			{
				name: "Sommer",
				2020: [
					7,
					4,
					8,
					26
				],
				2021: [
					7,
					10,
					8,
					25
				],
				2022: [
					7,
					9,
					8,
					24
				],
				2023: [
					7,
					8,
					8,
					23
				],
				2024: [
					7,
					6,
					8,
					21
				],
				2025: [
					7,
					4,
					8,
					27
				],
				2026: [
					7,
					11,
					8,
					26
				]
			},
			{
				name: "Herbst",
				2020: [
					10,
					17,
					11,
					1
				],
				2021: [
					10,
					16,
					11,
					1
				],
				2022: [
					10,
					15,
					10,
					30
				],
				2023: [
					10,
					14,
					10,
					29
				],
				2024: [
					10,
					12,
					10,
					27
				],
				2025: [
					10,
					11,
					10,
					26
				],
				2026: [
					10,
					10,
					10,
					25
				]
			},
			{
				name: "Winter",
				2020: [
					12,
					19,
					1,
					3
				],
				2021: [
					12,
					24,
					1,
					9
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					20,
					1,
					2
				],
				2026: [
					12,
					19,
					1,
					3
				]
			}
		] },
		Genève: { SH: [
			{
				name: "Vacances de février",
				2020: [
					2,
					8,
					2,
					16
				],
				2021: [
					2,
					13,
					2,
					21
				],
				2022: [
					2,
					12,
					2,
					20
				],
				2023: [
					2,
					18,
					2,
					26
				],
				2024: [
					2,
					17,
					2,
					25
				],
				2025: [
					2,
					24,
					2,
					28
				],
				2026: [
					2,
					23,
					2,
					27
				],
				2027: [
					2,
					15,
					2,
					19
				],
				2028: [
					2,
					21,
					2,
					25
				],
				2029: [
					2,
					19,
					2,
					23
				],
				2030: [
					2,
					25,
					3,
					1
				]
			},
			{
				name: "Vacances de Pâques",
				2020: [
					4,
					9,
					4,
					19
				],
				2021: [
					4,
					1,
					4,
					11
				],
				2022: [
					4,
					14,
					4,
					24
				],
				2023: [
					4,
					7,
					4,
					23
				],
				2024: [
					3,
					29,
					4,
					14
				],
				2025: [
					4,
					18,
					5,
					2
				],
				2026: [
					4,
					3,
					4,
					17
				],
				2027: [
					3,
					26,
					4,
					9
				],
				2028: [
					4,
					13,
					4,
					21
				],
				2029: [
					3,
					29,
					4,
					6
				],
				2030: [
					4,
					18,
					4,
					26
				]
			},
			{
				name: "Vacances d'été",
				2020: [
					6,
					27,
					8,
					23
				],
				2021: [
					7,
					3,
					8,
					29
				],
				2022: [
					7,
					2,
					8,
					21
				],
				2023: [
					7,
					1,
					8,
					20
				],
				2024: [
					6,
					29,
					8,
					18
				],
				2025: [
					6,
					30,
					8,
					15
				],
				2026: [
					6,
					29,
					8,
					16
				],
				2027: [
					7,
					5,
					8,
					25
				],
				2028: [
					7,
					3,
					8,
					23
				],
				2029: [
					7,
					2,
					8,
					22
				],
				2030: [
					7,
					1,
					8,
					21
				]
			},
			{
				name: "Vacances d'automne",
				2020: [
					10,
					17,
					10,
					25
				],
				2021: [
					10,
					23,
					10,
					31
				],
				2022: [
					10,
					22,
					10,
					30
				],
				2023: [
					10,
					21,
					10,
					29
				],
				2024: [
					10,
					19,
					10,
					27
				],
				2025: [
					10,
					20,
					10,
					24
				],
				2026: [
					10,
					19,
					10,
					23
				],
				2027: [
					10,
					25,
					10,
					29
				],
				2028: [
					10,
					23,
					10,
					27
				],
				2029: [
					10,
					22,
					10,
					26
				]
			},
			{
				name: "Vacances de Noël et Nouvel An",
				2020: [
					12,
					24,
					1,
					10
				],
				2021: [
					12,
					24,
					1,
					9
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					24,
					1,
					8
				],
				2027: [
					12,
					24,
					1,
					7
				],
				2028: [
					12,
					25,
					1,
					5
				],
				2029: [
					12,
					24,
					1,
					4
				]
			},
			{
				name: "Pont de l'Ascension",
				2023: [
					5,
					18,
					5,
					19
				],
				2024: [
					5,
					9,
					5,
					10
				],
				2025: [
					5,
					29,
					5,
					30
				],
				2026: [
					5,
					14,
					5,
					15
				],
				2027: [
					5,
					6,
					5,
					7
				],
				2028: [
					5,
					25,
					5,
					26
				],
				2029: [
					5,
					10,
					5,
					11
				],
				2030: [
					5,
					30,
					5,
					31
				]
			}
		] },
		Genf: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Genf&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "ge"
		},
		Glarus: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Glarus&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "gl",
			SH: [
				{
					name: "Sport",
					2020: [
						1,
						25,
						2,
						2
					],
					2021: [
						1,
						30,
						2,
						7
					],
					2022: [
						1,
						29,
						2,
						6
					],
					2023: [
						1,
						28,
						2,
						5
					],
					2024: [
						1,
						27,
						2,
						4
					],
					2025: [
						1,
						25,
						2,
						2
					],
					2026: [
						1,
						24,
						2,
						1
					]
				},
				{
					name: "Frühling",
					2020: [
						4,
						2,
						4,
						19
					],
					2021: [
						4,
						2,
						4,
						18
					],
					2022: [
						4,
						7,
						4,
						24
					],
					2023: [
						4,
						7,
						4,
						23
					],
					2024: [
						3,
						29,
						4,
						14
					],
					2025: [
						4,
						3,
						4,
						20
					],
					2026: [
						4,
						3,
						4,
						19
					]
				},
				{
					name: "Sommer",
					2020: [
						6,
						27,
						8,
						9
					],
					2021: [
						7,
						3,
						8,
						15
					],
					2022: [
						7,
						2,
						8,
						14
					],
					2023: [
						7,
						1,
						8,
						13
					],
					2024: [
						6,
						29,
						8,
						11
					],
					2025: [
						6,
						28,
						8,
						10
					],
					2026: [
						6,
						27,
						8,
						9
					]
				},
				{
					name: "Herbst",
					2020: [
						10,
						3,
						10,
						18
					],
					2021: [
						10,
						9,
						10,
						24
					],
					2022: [
						10,
						8,
						10,
						23
					],
					2023: [
						10,
						7,
						10,
						22
					],
					2024: [
						10,
						5,
						10,
						20
					],
					2025: [
						10,
						4,
						10,
						19
					],
					2026: [
						10,
						3,
						10,
						18
					]
				},
				{
					name: "Winter",
					2020: [
						12,
						24,
						1,
						10
					],
					2021: [
						12,
						24,
						1,
						9
					],
					2022: [
						12,
						24,
						1,
						8
					],
					2023: [
						12,
						23,
						1,
						7
					],
					2024: [
						12,
						21,
						1,
						5
					],
					2025: [
						12,
						20,
						1,
						4
					],
					2026: [
						12,
						24,
						1,
						10
					]
				}
			]
		},
		Gonten: { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					4,
					8,
					16
				],
				2021: [
					7,
					3,
					8,
					15
				],
				2022: [
					7,
					2,
					8,
					15
				],
				2023: [
					7,
					1,
					8,
					13
				],
				2024: [
					6,
					29,
					8,
					11
				],
				2025: [
					7,
					5,
					8,
					17
				],
				2026: [
					7,
					4,
					8,
					16
				],
				2027: [
					7,
					3,
					8,
					15
				],
				2028: [
					7,
					1,
					8,
					13
				]
			},
			{
				name: "Herbstferien",
				2020: [
					10,
					3,
					10,
					18
				],
				2021: [
					10,
					9,
					10,
					24
				],
				2022: [
					10,
					8,
					10,
					23
				],
				2023: [
					10,
					7,
					10,
					22
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					4,
					10,
					19
				],
				2026: [
					10,
					3,
					10,
					18
				],
				2027: [
					10,
					2,
					10,
					17
				]
			},
			{
				name: "Sportferien",
				2020: [
					2,
					21,
					3,
					1
				],
				2021: [
					2,
					12,
					2,
					21
				],
				2022: [
					2,
					25,
					3,
					6
				],
				2023: [
					2,
					17,
					2,
					26
				],
				2024: [
					2,
					9,
					2,
					18
				],
				2025: [
					2,
					22,
					2,
					28
				],
				2026: [
					2,
					13,
					2,
					22
				],
				2027: [
					2,
					5,
					2,
					14
				]
			}
		] },
		Graubünden: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Graub%C3%BCnden&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "gr"
		},
		Imboden: { SH: [
			{
				name: "Herbstferien",
				2020: [
					10,
					10,
					10,
					25
				],
				2021: [
					10,
					9,
					10,
					24
				],
				2022: [
					10,
					8,
					10,
					23
				],
				2023: [
					10,
					7,
					10,
					22
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					6,
					10,
					17
				],
				2026: [
					10,
					10,
					10,
					25
				],
				2027: [
					10,
					9,
					10,
					24
				],
				2028: [
					10,
					7,
					10,
					22
				],
				2029: [
					10,
					6,
					10,
					21
				]
			},
			{
				name: "Weihnachtsferien",
				2019: [
					12,
					21,
					1,
					5
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					23,
					1,
					5
				],
				2027: [
					12,
					23,
					1,
					5
				],
				2028: [
					12,
					23,
					1,
					7
				],
				2029: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Schulbeginn",
				2020: [
					8,
					17,
					8,
					17
				],
				2021: [
					8,
					16,
					8,
					16
				],
				2022: [
					8,
					15,
					8,
					15
				],
				2023: [
					8,
					14,
					8,
					14
				],
				2024: [
					8,
					12,
					8,
					12
				],
				2025: [
					8,
					11,
					8,
					11
				],
				2026: [
					8,
					17,
					8,
					17
				],
				2027: [
					8,
					16,
					8,
					16
				],
				2028: [
					8,
					14,
					8,
					14
				],
				2029: [
					8,
					13,
					8,
					13
				]
			}
		] },
		Jura: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Jura&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "ju",
			SH: [
				{
					name: "Vacances de Noël",
					2019: [
						12,
						23,
						1,
						3
					],
					2020: [
						12,
						24,
						1,
						8
					],
					2021: [
						12,
						24,
						1,
						7
					],
					2022: [
						12,
						26,
						1,
						6
					],
					2023: [
						12,
						25,
						1,
						5
					],
					2024: [
						12,
						23,
						1,
						3
					],
					2025: [
						12,
						22,
						1,
						2
					],
					2026: [
						12,
						24,
						1,
						8
					],
					2027: [
						12,
						24,
						1,
						7
					]
				},
				{
					name: "Semaine de relâche hivernale",
					2020: [
						2,
						17,
						2,
						21
					],
					2021: [
						2,
						22,
						2,
						26
					],
					2022: [
						2,
						21,
						2,
						25
					],
					2023: [
						2,
						20,
						2,
						24
					],
					2024: [
						2,
						19,
						2,
						23
					],
					2025: [
						2,
						24,
						2,
						28
					],
					2026: [
						2,
						16,
						2,
						20
					],
					2027: [
						2,
						15,
						2,
						19
					],
					2028: [
						2,
						21,
						2,
						25
					]
				},
				{
					name: "Vacances de Pâques",
					2020: [
						4,
						10,
						4,
						24
					],
					2021: [
						4,
						2,
						4,
						16
					],
					2022: [
						4,
						11,
						4,
						22
					],
					2023: [
						4,
						7,
						4,
						21
					],
					2024: [
						3,
						29,
						4,
						12
					],
					2025: [
						3,
						18,
						5,
						2
					],
					2026: [
						4,
						3,
						4,
						17
					],
					2027: [
						3,
						26,
						4,
						9
					],
					2028: [
						4,
						14,
						4,
						28
					]
				},
				{
					name: "Ascension",
					2020: [
						4,
						21,
						4,
						22
					],
					2021: [
						5,
						13,
						5,
						14
					],
					2022: [
						5,
						26,
						5,
						27
					],
					2023: [
						5,
						18,
						5,
						19
					],
					2024: [
						5,
						9,
						5,
						10
					],
					2025: [
						5,
						29,
						5,
						30
					],
					2026: [
						5,
						14,
						5,
						15
					],
					2027: [
						5,
						6,
						5,
						7
					],
					2028: [
						5,
						25,
						5,
						26
					]
				},
				{
					name: "Vacances d'été",
					2020: [
						7,
						6,
						8,
						14
					],
					2021: [
						7,
						5,
						8,
						13
					],
					2022: [
						7,
						4,
						8,
						12
					],
					2023: [
						7,
						3,
						8,
						18
					],
					2024: [
						7,
						8,
						8,
						16
					],
					2025: [
						7,
						7,
						8,
						15
					],
					2026: [
						7,
						6,
						8,
						14
					],
					2027: [
						7,
						5,
						8,
						13
					],
					2028: [
						7,
						3,
						8,
						18
					]
				},
				{
					name: "Vacances d'automne",
					2020: [
						10,
						12,
						10,
						23
					],
					2021: [
						10,
						11,
						10,
						22
					],
					2022: [
						10,
						10,
						10,
						21
					],
					2023: [
						10,
						16,
						10,
						27
					],
					2024: [
						10,
						14,
						10,
						25
					],
					2025: [
						10,
						6,
						10,
						17
					],
					2026: [
						10,
						5,
						10,
						16
					],
					2027: [
						10,
						11,
						10,
						22
					]
				}
			]
		},
		Landquart: { SH: [
			{
				name: "Herbstferien",
				2020: [
					10,
					10,
					10,
					25
				],
				2021: [
					10,
					9,
					10,
					24
				],
				2022: [
					10,
					8,
					10,
					23
				],
				2023: [
					10,
					7,
					10,
					22
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					6,
					10,
					17
				],
				2026: [
					10,
					10,
					10,
					25
				],
				2027: [
					10,
					9,
					10,
					24
				],
				2028: [
					10,
					7,
					10,
					22
				],
				2029: [
					10,
					6,
					10,
					21
				]
			},
			{
				name: "Weihnachtsferien",
				2019: [
					12,
					21,
					1,
					5
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					23,
					1,
					5
				],
				2027: [
					12,
					23,
					1,
					5
				],
				2028: [
					12,
					23,
					1,
					7
				],
				2029: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Schulbeginn",
				2020: [
					8,
					17,
					8,
					17
				],
				2021: [
					8,
					16,
					8,
					16
				],
				2022: [
					8,
					15,
					8,
					15
				],
				2023: [
					8,
					14,
					8,
					14
				],
				2024: [
					8,
					12,
					8,
					12
				],
				2025: [
					8,
					11,
					8,
					11
				],
				2026: [
					8,
					17,
					8,
					17
				],
				2027: [
					8,
					16,
					8,
					16
				],
				2028: [
					8,
					14,
					8,
					14
				],
				2029: [
					8,
					13,
					8,
					13
				]
			}
		] },
		Luzern: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Luzern&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "lu",
			SH: [
				{
					name: "Sommerferien",
					2020: [
						7,
						4,
						8,
						16
					],
					2021: [
						7,
						10,
						8,
						22
					],
					2022: [
						7,
						9,
						8,
						21
					],
					2023: [
						7,
						8,
						8,
						20
					],
					2024: [
						7,
						6,
						8,
						18
					],
					2025: [
						7,
						5,
						8,
						17
					],
					2026: [
						7,
						4,
						8,
						16
					],
					2027: [
						7,
						3,
						8,
						15
					],
					2028: [
						7,
						8,
						8,
						20
					]
				},
				{
					name: "Herbstferien",
					2020: [
						9,
						26,
						10,
						11
					],
					2021: [
						10,
						2,
						10,
						17
					],
					2022: [
						10,
						1,
						10,
						16
					],
					2023: [
						9,
						30,
						10,
						15
					],
					2024: [
						9,
						28,
						10,
						13
					],
					2025: [
						9,
						27,
						10,
						12
					],
					2026: [
						9,
						26,
						10,
						11
					],
					2027: [
						9,
						25,
						10,
						10
					]
				},
				{
					name: "Weihnachtsferien",
					2020: [
						12,
						19,
						1,
						3
					],
					2021: [
						12,
						18,
						1,
						2
					],
					2022: [
						12,
						24,
						1,
						8
					],
					2023: [
						12,
						23,
						1,
						7
					],
					2024: [
						12,
						21,
						1,
						5
					],
					2025: [
						12,
						20,
						1,
						4
					],
					2026: [
						12,
						19,
						1,
						3
					],
					2027: [
						12,
						18,
						1,
						2
					]
				},
				{
					name: "Fasnachtsferien",
					2020: [
						2,
						15,
						3,
						1
					],
					2021: [
						2,
						6,
						2,
						21
					],
					2022: [
						2,
						19,
						3,
						6
					],
					2023: [
						2,
						11,
						2,
						26
					],
					2024: [
						2,
						3,
						2,
						18
					],
					2025: [
						2,
						22,
						3,
						9
					],
					2026: [
						2,
						7,
						2,
						22
					],
					2027: [
						1,
						30,
						2,
						14
					],
					2028: [
						2,
						19,
						3,
						5
					]
				},
				{
					name: "Frühlingsferien",
					2020: [
						4,
						10,
						4,
						26
					],
					2021: [
						4,
						2,
						4,
						18
					],
					2022: [
						4,
						15,
						5,
						1
					],
					2023: [
						4,
						7,
						4,
						23
					],
					2024: [
						3,
						29,
						4,
						14
					],
					2025: [
						4,
						18,
						5,
						4
					],
					2026: [
						4,
						3,
						4,
						19
					],
					2027: [
						3,
						26,
						4,
						11
					],
					2028: [
						4,
						14,
						4,
						30
					]
				}
			]
		},
		Maloja: { SH: [
			{
				name: "Herbstferien",
				2020: [
					10,
					10,
					10,
					25
				],
				2021: [
					10,
					9,
					10,
					24
				],
				2022: [
					10,
					8,
					10,
					23
				],
				2023: [
					10,
					7,
					10,
					22
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					6,
					10,
					17
				],
				2026: [
					10,
					10,
					10,
					25
				],
				2027: [
					10,
					9,
					10,
					24
				],
				2028: [
					10,
					7,
					10,
					22
				],
				2029: [
					10,
					6,
					10,
					21
				]
			},
			{
				name: "Weihnachtsferien",
				2019: [
					12,
					21,
					1,
					5
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					23,
					1,
					5
				],
				2027: [
					12,
					23,
					1,
					5
				],
				2028: [
					12,
					23,
					1,
					7
				],
				2029: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Schulbeginn",
				2020: [
					8,
					17,
					8,
					17
				],
				2021: [
					8,
					16,
					8,
					16
				],
				2022: [
					8,
					15,
					8,
					15
				],
				2023: [
					8,
					14,
					8,
					14
				],
				2024: [
					8,
					12,
					8,
					12
				],
				2025: [
					8,
					11,
					8,
					11
				],
				2026: [
					8,
					17,
					8,
					17
				],
				2027: [
					8,
					16,
					8,
					16
				],
				2028: [
					8,
					14,
					8,
					14
				],
				2029: [
					8,
					13,
					8,
					13
				]
			}
		] },
		Moesa: { SH: [
			{
				name: "Herbstferien",
				2023: [
					10,
					28,
					11,
					5
				],
				2024: [
					10,
					26,
					11,
					3
				],
				2025: [
					11,
					1,
					11,
					9
				],
				2026: [
					10,
					31,
					11,
					8
				]
			},
			{
				name: "Weihnachtsferien",
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					6
				],
				2025: [
					12,
					24,
					1,
					6
				],
				2026: [
					12,
					24,
					1,
					6
				]
			},
			{
				name: "Schulbeginn",
				2023: [
					8,
					21,
					8,
					21
				],
				2024: [
					8,
					26,
					8,
					26
				],
				2025: [
					8,
					25,
					8,
					25
				],
				2026: [
					8,
					24,
					8,
					24
				]
			}
		] },
		Neuchâtel: { SH: [
			{
				name: "Sport",
				2020: [
					2,
					22,
					3,
					1
				],
				2021: [
					2,
					27,
					3,
					7
				],
				2022: [
					2,
					26,
					3,
					6
				],
				2023: [
					2,
					25,
					3,
					5
				],
				2024: [
					2,
					24,
					3,
					3
				],
				2025: [
					2,
					22,
					3,
					2
				],
				2026: [
					2,
					21,
					3,
					1
				]
			},
			{
				name: "Frühling",
				2020: [
					4,
					10,
					4,
					26
				],
				2021: [
					4,
					2,
					4,
					18
				],
				2022: [
					4,
					9,
					4,
					24
				],
				2023: [
					4,
					7,
					4,
					23
				],
				2024: [
					3,
					29,
					4,
					14
				],
				2025: [
					4,
					12,
					4,
					27
				],
				2026: [
					4,
					3,
					4,
					19
				]
			},
			{
				name: "Sommer",
				2020: [
					7,
					4,
					8,
					16
				],
				2021: [
					7,
					3,
					8,
					15
				],
				2022: [
					7,
					2,
					8,
					14
				],
				2023: [
					7,
					1,
					8,
					13
				],
				2024: [
					7,
					6,
					8,
					18
				],
				2025: [
					7,
					5,
					8,
					17
				],
				2026: [
					7,
					4,
					8,
					16
				]
			},
			{
				name: "Herbst",
				2020: [
					10,
					3,
					10,
					18
				],
				2021: [
					10,
					2,
					10,
					17
				],
				2022: [
					10,
					1,
					10,
					16
				],
				2023: [
					9,
					30,
					10,
					15
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					4,
					10,
					19
				],
				2026: [
					10,
					3,
					10,
					18
				]
			},
			{
				name: "Winter",
				2020: [
					12,
					24,
					1,
					10
				],
				2021: [
					12,
					24,
					1,
					9
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					21,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					20,
					1,
					4
				],
				2026: [
					12,
					19,
					1,
					3
				]
			}
		] },
		Neuenburg: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Neuenburg&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "ne"
		},
		Nidwalden: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Nidwalden&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "nw",
			SH: [
				{
					name: "Sport",
					2020: [
						2,
						15,
						3,
						1
					],
					2021: [
						2,
						6,
						2,
						21
					],
					2022: [
						2,
						19,
						3,
						6
					],
					2023: [
						2,
						11,
						2,
						26
					],
					2024: [
						2,
						3,
						2,
						18
					],
					2025: [
						2,
						22,
						3,
						9
					],
					2026: [
						2,
						7,
						2,
						22
					]
				},
				{
					name: "Frühling",
					2020: [
						4,
						10,
						4,
						26
					],
					2021: [
						4,
						2,
						4,
						18
					],
					2022: [
						4,
						15,
						5,
						1
					],
					2023: [
						4,
						7,
						4,
						23
					],
					2024: [
						3,
						29,
						4,
						14
					],
					2025: [
						4,
						18,
						5,
						4
					],
					2026: [
						4,
						3,
						4,
						19
					]
				},
				{
					name: "Sommer",
					2020: [
						7,
						4,
						8,
						23
					],
					2021: [
						7,
						3,
						8,
						22
					],
					2022: [
						7,
						9,
						8,
						28
					],
					2023: [
						7,
						8,
						8,
						27
					],
					2024: [
						7,
						6,
						8,
						25
					],
					2025: [
						7,
						5,
						8,
						17
					],
					2026: [
						7,
						4,
						8,
						16
					]
				},
				{
					name: "Herbst",
					2020: [
						9,
						26,
						10,
						11
					],
					2021: [
						9,
						25,
						10,
						10
					],
					2022: [
						10,
						1,
						10,
						16
					],
					2023: [
						9,
						30,
						10,
						15
					],
					2024: [
						9,
						28,
						10,
						13
					],
					2025: [
						9,
						27,
						10,
						12
					],
					2026: [
						9,
						26,
						10,
						11
					]
				},
				{
					name: "Winter",
					2020: [
						12,
						19,
						1,
						3
					],
					2021: [
						12,
						18,
						1,
						2
					],
					2022: [
						12,
						24,
						1,
						8
					],
					2023: [
						12,
						23,
						1,
						7
					],
					2024: [
						12,
						21,
						1,
						5
					],
					2025: [
						12,
						20,
						1,
						4
					],
					2026: [
						12,
						19,
						1,
						3
					]
				}
			]
		},
		Oberegg: { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					4,
					8,
					9
				],
				2021: [
					7,
					10,
					8,
					15
				],
				2022: [
					7,
					9,
					8,
					15
				],
				2023: [
					7,
					8,
					8,
					13
				],
				2024: [
					7,
					6,
					8,
					11
				],
				2026: [
					7,
					4,
					8,
					9
				],
				2027: [
					7,
					10,
					8,
					15
				],
				2028: [
					7,
					8,
					8,
					13
				]
			},
			{
				name: "Herbstferien",
				2020: [
					9,
					26,
					10,
					18
				],
				2021: [
					10,
					2,
					10,
					24
				],
				2022: [
					10,
					1,
					10,
					23
				],
				2023: [
					9,
					30,
					10,
					22
				],
				2024: [
					9,
					28,
					10,
					20
				],
				2025: [
					10,
					4,
					10,
					19
				],
				2026: [
					9,
					26,
					10,
					18
				],
				2027: [
					10,
					2,
					10,
					24
				]
			},
			{
				name: "Sportferien",
				2020: [
					1,
					25,
					2,
					2
				],
				2021: [
					1,
					30,
					2,
					7
				],
				2022: [
					1,
					29,
					2,
					6
				],
				2023: [
					1,
					28,
					2,
					5
				],
				2024: [
					1,
					27,
					2,
					4
				],
				2026: [
					1,
					24,
					2,
					1
				],
				2027: [
					1,
					30,
					2,
					7
				]
			}
		] },
		Obwalden: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Obwalden&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "ow",
			SH: [
				{
					name: "Sport",
					2020: [
						2,
						15,
						3,
						1
					],
					2021: [
						2,
						6,
						2,
						21
					],
					2022: [
						2,
						19,
						3,
						6
					],
					2023: [
						2,
						11,
						2,
						26
					],
					2024: [
						2,
						3,
						2,
						18
					],
					2025: [
						2,
						27,
						3,
						9
					],
					2026: [
						2,
						12,
						2,
						22
					]
				},
				{
					name: "Frühling",
					2020: [
						4,
						10,
						4,
						26
					],
					2021: [
						4,
						2,
						4,
						18
					],
					2022: [
						4,
						15,
						5,
						1
					],
					2023: [
						4,
						7,
						4,
						23
					],
					2024: [
						3,
						29,
						4,
						14
					],
					2025: [
						4,
						18,
						5,
						4
					],
					2026: [
						4,
						3,
						4,
						19
					]
				},
				{
					name: "Sommer",
					2020: [
						7,
						4,
						8,
						16
					],
					2021: [
						7,
						10,
						8,
						22
					],
					2022: [
						7,
						2,
						8,
						15
					],
					2023: [
						7,
						8,
						8,
						20
					],
					2024: [
						7,
						6,
						8,
						18
					],
					2025: [
						7,
						5,
						8,
						17
					],
					2026: [
						7,
						4,
						8,
						16
					]
				},
				{
					name: "Herbst",
					2020: [
						9,
						26,
						10,
						11
					],
					2021: [
						10,
						2,
						10,
						24
					],
					2022: [
						10,
						1,
						10,
						16
					],
					2023: [
						9,
						30,
						10,
						15
					],
					2024: [
						9,
						28,
						10,
						13
					],
					2025: [
						10,
						4,
						10,
						26
					],
					2026: [
						10,
						3,
						10,
						25
					]
				},
				{
					name: "Winter",
					2020: [
						12,
						24,
						1,
						6
					],
					2021: [
						12,
						24,
						1,
						6
					],
					2022: [
						12,
						24,
						1,
						8
					],
					2023: [
						12,
						23,
						1,
						7
					],
					2024: [
						12,
						21,
						1,
						5
					],
					2025: [
						12,
						24,
						1,
						6
					],
					2026: [
						12,
						24,
						1,
						6
					]
				}
			]
		},
		Plessur: { SH: [
			{
				name: "Herbstferien",
				2020: [
					10,
					10,
					10,
					25
				],
				2021: [
					10,
					9,
					10,
					24
				],
				2022: [
					10,
					8,
					10,
					23
				],
				2023: [
					10,
					7,
					10,
					22
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					6,
					10,
					17
				],
				2026: [
					10,
					10,
					10,
					25
				],
				2027: [
					10,
					9,
					10,
					24
				],
				2028: [
					10,
					7,
					10,
					22
				],
				2029: [
					10,
					6,
					10,
					21
				]
			},
			{
				name: "Weihnachtsferien",
				2019: [
					12,
					21,
					1,
					5
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					23,
					1,
					5
				],
				2027: [
					12,
					23,
					1,
					5
				],
				2028: [
					12,
					23,
					1,
					7
				],
				2029: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Schulbeginn",
				2020: [
					8,
					17,
					8,
					17
				],
				2021: [
					8,
					16,
					8,
					16
				],
				2022: [
					8,
					15,
					8,
					15
				],
				2023: [
					8,
					14,
					8,
					14
				],
				2024: [
					8,
					12,
					8,
					12
				],
				2025: [
					8,
					11,
					8,
					11
				],
				2026: [
					8,
					17,
					8,
					17
				],
				2027: [
					8,
					16,
					8,
					16
				],
				2028: [
					8,
					14,
					8,
					14
				],
				2029: [
					8,
					13,
					8,
					13
				]
			}
		] },
		"Prättigau / Davos": { SH: [
			{
				name: "Herbstferien",
				2020: [
					10,
					10,
					10,
					25
				],
				2021: [
					10,
					9,
					10,
					24
				],
				2022: [
					10,
					8,
					10,
					23
				],
				2023: [
					10,
					7,
					10,
					22
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					6,
					10,
					17
				],
				2026: [
					10,
					10,
					10,
					25
				],
				2027: [
					10,
					9,
					10,
					24
				],
				2028: [
					10,
					7,
					10,
					22
				],
				2029: [
					10,
					6,
					10,
					21
				]
			},
			{
				name: "Weihnachtsferien",
				2019: [
					12,
					21,
					1,
					5
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					23,
					1,
					5
				],
				2027: [
					12,
					23,
					1,
					5
				],
				2028: [
					12,
					23,
					1,
					7
				],
				2029: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Schulbeginn",
				2020: [
					8,
					17,
					8,
					17
				],
				2021: [
					8,
					16,
					8,
					16
				],
				2022: [
					8,
					15,
					8,
					15
				],
				2023: [
					8,
					14,
					8,
					14
				],
				2024: [
					8,
					12,
					8,
					12
				],
				2025: [
					8,
					11,
					8,
					11
				],
				2026: [
					8,
					17,
					8,
					17
				],
				2027: [
					8,
					16,
					8,
					16
				],
				2028: [
					8,
					14,
					8,
					14
				],
				2029: [
					8,
					13,
					8,
					13
				]
			}
		] },
		"Sankt Gallen": {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Sankt%20Gallen&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "sg"
		},
		Schaffhausen: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Schaffhausen&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "sh",
			SH: [
				{
					name: "Sport",
					2020: [
						1,
						25,
						2,
						9
					],
					2021: [
						1,
						30,
						2,
						14
					],
					2022: [
						1,
						29,
						2,
						13
					],
					2023: [
						1,
						28,
						2,
						12
					],
					2024: [
						1,
						27,
						2,
						11
					],
					2025: [
						1,
						25,
						2,
						9
					],
					2026: [
						1,
						24,
						2,
						8
					]
				},
				{
					name: "Frühling",
					2020: [
						4,
						11,
						4,
						26
					],
					2021: [
						4,
						17,
						5,
						2
					],
					2022: [
						4,
						15,
						5,
						1
					],
					2023: [
						4,
						15,
						5,
						1
					],
					2024: [
						4,
						13,
						4,
						28
					],
					2025: [
						4,
						12,
						4,
						27
					],
					2026: [
						4,
						11,
						4,
						26
					]
				},
				{
					name: "Sommer",
					2020: [
						7,
						4,
						8,
						9
					],
					2021: [
						7,
						10,
						8,
						15
					],
					2022: [
						7,
						9,
						8,
						14
					],
					2023: [
						7,
						8,
						8,
						13
					],
					2024: [
						7,
						6,
						8,
						11
					],
					2025: [
						7,
						5,
						8,
						10
					],
					2026: [
						7,
						4,
						8,
						9
					]
				},
				{
					name: "Herbst",
					2020: [
						9,
						26,
						10,
						18
					],
					2021: [
						10,
						2,
						10,
						24
					],
					2022: [
						10,
						1,
						10,
						23
					],
					2023: [
						9,
						30,
						10,
						22
					],
					2024: [
						9,
						28,
						10,
						20
					],
					2025: [
						9,
						27,
						10,
						19
					],
					2026: [
						9,
						26,
						10,
						18
					]
				},
				{
					name: "Winter",
					2020: [
						12,
						24,
						1,
						3
					],
					2021: [
						12,
						24,
						1,
						2
					],
					2022: [
						12,
						24,
						1,
						2
					],
					2023: [
						12,
						23,
						1,
						2
					],
					2024: [
						12,
						24,
						1,
						5
					],
					2025: [
						12,
						24,
						1,
						4
					],
					2026: [
						12,
						24,
						1,
						3
					]
				}
			]
		},
		"Schlatt-Haslen": { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					4,
					8,
					16
				],
				2021: [
					7,
					3,
					8,
					15
				],
				2022: [
					7,
					2,
					8,
					15
				],
				2023: [
					7,
					1,
					8,
					13
				],
				2024: [
					6,
					29,
					8,
					11
				],
				2025: [
					7,
					5,
					8,
					17
				],
				2026: [
					7,
					4,
					8,
					16
				],
				2027: [
					7,
					3,
					8,
					15
				],
				2028: [
					7,
					1,
					8,
					13
				]
			},
			{
				name: "Herbstferien",
				2020: [
					10,
					3,
					10,
					18
				],
				2021: [
					10,
					9,
					10,
					24
				],
				2022: [
					10,
					8,
					10,
					23
				],
				2023: [
					10,
					7,
					10,
					22
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					4,
					10,
					19
				],
				2026: [
					10,
					3,
					10,
					18
				],
				2027: [
					10,
					2,
					10,
					17
				]
			},
			{
				name: "Sportferien",
				2020: [
					2,
					21,
					3,
					1
				],
				2021: [
					2,
					12,
					2,
					21
				],
				2022: [
					2,
					25,
					3,
					6
				],
				2023: [
					2,
					17,
					2,
					26
				],
				2024: [
					2,
					9,
					2,
					18
				],
				2025: [
					2,
					22,
					2,
					28
				],
				2026: [
					2,
					13,
					2,
					22
				],
				2027: [
					2,
					5,
					2,
					14
				]
			}
		] },
		"Schwende-Rüte": { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					4,
					8,
					16
				],
				2021: [
					7,
					3,
					8,
					15
				],
				2022: [
					7,
					2,
					8,
					15
				],
				2023: [
					7,
					1,
					8,
					13
				],
				2024: [
					6,
					29,
					8,
					11
				],
				2025: [
					7,
					5,
					8,
					17
				],
				2026: [
					7,
					4,
					8,
					16
				],
				2027: [
					7,
					3,
					8,
					15
				],
				2028: [
					7,
					1,
					8,
					13
				]
			},
			{
				name: "Herbstferien",
				2020: [
					10,
					3,
					10,
					18
				],
				2021: [
					10,
					9,
					10,
					24
				],
				2022: [
					10,
					8,
					10,
					23
				],
				2023: [
					10,
					7,
					10,
					22
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					4,
					10,
					19
				],
				2026: [
					10,
					3,
					10,
					18
				],
				2027: [
					10,
					2,
					10,
					17
				]
			},
			{
				name: "Sportferien",
				2020: [
					2,
					21,
					3,
					1
				],
				2021: [
					2,
					12,
					2,
					21
				],
				2022: [
					2,
					25,
					3,
					6
				],
				2023: [
					2,
					17,
					2,
					26
				],
				2024: [
					2,
					9,
					2,
					18
				],
				2025: [
					2,
					22,
					2,
					28
				],
				2026: [
					2,
					13,
					2,
					22
				],
				2027: [
					2,
					5,
					2,
					14
				]
			}
		] },
		Schwyz: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Schwyz&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "sz",
			SH: [
				{
					name: "Sport",
					2020: [
						2,
						22,
						3,
						1
					],
					2021: [
						2,
						27,
						3,
						7
					],
					2022: [
						2,
						26,
						3,
						6
					],
					2023: [
						2,
						25,
						3,
						5
					],
					2024: [
						2,
						24,
						3,
						3
					],
					2025: [
						2,
						22,
						3,
						2
					],
					2026: [
						2,
						21,
						3,
						1
					]
				},
				{
					name: "Frühling",
					2020: [
						4,
						25,
						5,
						10
					],
					2021: [
						5,
						1,
						5,
						16
					],
					2022: [
						4,
						30,
						5,
						15
					],
					2023: [
						4,
						29,
						5,
						14
					],
					2024: [
						4,
						27,
						5,
						12
					],
					2025: [
						4,
						26,
						5,
						11
					],
					2026: [
						4,
						25,
						5,
						10
					]
				},
				{
					name: "Sommer",
					2020: [
						7,
						4,
						8,
						9
					],
					2021: [
						7,
						10,
						8,
						15
					],
					2022: [
						7,
						9,
						8,
						14
					],
					2023: [
						7,
						8,
						8,
						13
					],
					2024: [
						7,
						6,
						8,
						11
					],
					2025: [
						7,
						5,
						8,
						17
					],
					2026: [
						7,
						4,
						8,
						9
					]
				},
				{
					name: "Herbst",
					2020: [
						9,
						26,
						10,
						11
					],
					2021: [
						10,
						2,
						10,
						17
					],
					2022: [
						10,
						1,
						10,
						16
					],
					2023: [
						9,
						30,
						10,
						15
					],
					2024: [
						9,
						28,
						10,
						13
					],
					2025: [
						9,
						27,
						10,
						12
					],
					2026: [
						9,
						26,
						10,
						11
					]
				},
				{
					name: "Winter",
					2020: [
						12,
						24,
						1,
						6
					],
					2021: [
						12,
						24,
						1,
						6
					],
					2022: [
						12,
						24,
						1,
						8
					],
					2023: [
						12,
						23,
						1,
						7
					],
					2024: [
						12,
						25,
						1,
						6
					],
					2025: [
						12,
						20,
						1,
						4
					],
					2026: [
						12,
						25,
						1,
						6
					]
				}
			]
		},
		Solothurn: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Solothurn&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "so",
			SH: [
				{
					name: "Winterferien",
					2020: [
						2,
						3,
						2,
						14
					],
					2021: [
						2,
						8,
						2,
						19
					],
					2022: [
						2,
						7,
						2,
						18
					],
					2023: [
						2,
						6,
						2,
						17
					],
					2024: [
						2,
						5,
						2,
						16
					],
					2025: [
						2,
						3,
						2,
						14
					],
					2026: [
						2,
						2,
						2,
						13
					],
					2027: [
						2,
						8,
						2,
						19
					],
					2028: [
						2,
						7,
						2,
						18
					],
					2029: [
						2,
						5,
						2,
						16
					],
					2030: [
						2,
						4,
						2,
						15
					],
					2031: [
						2,
						3,
						2,
						14
					]
				},
				{
					name: "Sommerferien",
					2020: [
						7,
						6,
						8,
						7
					],
					2021: [
						7,
						10,
						8,
						15
					],
					2022: [
						7,
						11,
						8,
						12
					],
					2023: [
						7,
						10,
						8,
						15
					],
					2024: [
						7,
						8,
						8,
						9
					],
					2025: [
						7,
						7,
						8,
						8
					],
					2026: [
						7,
						6,
						8,
						7
					],
					2027: [
						7,
						12,
						8,
						13
					],
					2028: [
						7,
						10,
						8,
						11
					],
					2029: [
						7,
						9,
						8,
						10
					],
					2030: [
						7,
						8,
						8,
						9
					],
					2031: [
						7,
						7,
						8,
						8
					]
				},
				{
					name: "Herbstferien",
					2020: [
						9,
						28,
						10,
						16
					],
					2021: [
						10,
						4,
						10,
						22
					],
					2022: [
						10,
						3,
						10,
						21
					],
					2023: [
						10,
						2,
						10,
						20
					],
					2024: [
						9,
						30,
						10,
						18
					],
					2025: [
						9,
						29,
						10,
						17
					],
					2026: [
						9,
						28,
						10,
						16
					],
					2027: [
						10,
						4,
						10,
						22
					],
					2028: [
						10,
						2,
						10,
						20
					],
					2029: [
						10,
						1,
						10,
						19
					],
					2030: [
						9,
						30,
						10,
						18
					]
				},
				{
					name: "Weihnachtsferien",
					2019: [
						12,
						23,
						1,
						3
					],
					2020: [
						12,
						21,
						1,
						1
					],
					2021: [
						12,
						27,
						1,
						7
					],
					2022: [
						12,
						26,
						1,
						6
					],
					2023: [
						12,
						25,
						1,
						5
					],
					2024: [
						12,
						23,
						1,
						3
					],
					2025: [
						12,
						22,
						1,
						2
					],
					2026: [
						12,
						21,
						1,
						1
					],
					2027: [
						12,
						27,
						1,
						7
					],
					2028: [
						12,
						25,
						1,
						5
					],
					2029: [
						12,
						24,
						1,
						4
					],
					2030: [
						12,
						23,
						1,
						3
					]
				},
				{
					name: "Frühlingsferien",
					2020: [
						4,
						6,
						4,
						17
					],
					2021: [
						4,
						12,
						4,
						23
					],
					2022: [
						4,
						11,
						4,
						22
					],
					2023: [
						4,
						10,
						4,
						21
					],
					2024: [
						4,
						8,
						4,
						19
					],
					2025: [
						4,
						7,
						4,
						21
					],
					2026: [
						4,
						6,
						4,
						17
					],
					2027: [
						4,
						2,
						4,
						23
					],
					2028: [
						4,
						10,
						4,
						21
					],
					2029: [
						4,
						9,
						4,
						20
					],
					2030: [
						4,
						8,
						4,
						22
					],
					2031: [
						4,
						7,
						4,
						18
					]
				}
			]
		},
		"St. Gallen": { SH: [
			{
				name: "Sommerferien",
				2020: [
					7,
					5,
					8,
					9
				],
				2021: [
					7,
					11,
					8,
					15
				],
				2022: [
					7,
					10,
					8,
					14
				],
				2023: [
					7,
					9,
					8,
					13
				],
				2024: [
					7,
					7,
					8,
					11
				],
				2025: [
					7,
					6,
					8,
					10
				],
				2026: [
					7,
					5,
					8,
					9
				],
				2027: [
					7,
					11,
					8,
					15
				],
				2028: [
					7,
					9,
					8,
					13
				],
				2029: [
					7,
					8,
					8,
					12
				]
			},
			{
				name: "Herbstferien",
				2020: [
					9,
					27,
					10,
					18
				],
				2021: [
					10,
					3,
					10,
					24
				],
				2022: [
					10,
					2,
					10,
					23
				],
				2023: [
					10,
					1,
					10,
					22
				],
				2024: [
					9,
					29,
					10,
					20
				],
				2025: [
					9,
					28,
					10,
					19
				],
				2026: [
					9,
					27,
					10,
					18
				],
				2027: [
					10,
					3,
					10,
					24
				],
				2028: [
					10,
					1,
					10,
					22
				]
			},
			{
				name: "Weihnachtsferien",
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					25,
					1,
					8
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				],
				2027: [
					12,
					19,
					1,
					2
				],
				2028: [
					12,
					24,
					1,
					7
				]
			},
			{
				name: "Frühlingsferien",
				2020: [
					4,
					5,
					4,
					19
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					10,
					4,
					24
				],
				2023: [
					4,
					9,
					4,
					23
				],
				2024: [
					4,
					7,
					4,
					21
				],
				2025: [
					4,
					6,
					4,
					20
				],
				2026: [
					4,
					5,
					4,
					19
				],
				2027: [
					4,
					11,
					4,
					25
				],
				2028: [
					4,
					9,
					4,
					23
				],
				2029: [
					4,
					8,
					4,
					22
				]
			}
		] },
		Surselva: { SH: [
			{
				name: "Herbstferien",
				2020: [
					10,
					10,
					10,
					25
				],
				2021: [
					10,
					9,
					10,
					24
				],
				2022: [
					10,
					8,
					10,
					23
				],
				2023: [
					10,
					7,
					10,
					22
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					6,
					10,
					17
				],
				2026: [
					10,
					10,
					10,
					25
				],
				2027: [
					10,
					9,
					10,
					24
				],
				2028: [
					10,
					7,
					10,
					22
				],
				2029: [
					10,
					6,
					10,
					21
				]
			},
			{
				name: "Weihnachtsferien",
				2019: [
					12,
					21,
					1,
					5
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					23,
					1,
					5
				],
				2027: [
					12,
					23,
					1,
					5
				],
				2028: [
					12,
					23,
					1,
					7
				],
				2029: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Schulbeginn",
				2020: [
					8,
					17,
					8,
					17
				],
				2021: [
					8,
					16,
					8,
					16
				],
				2022: [
					8,
					15,
					8,
					15
				],
				2023: [
					8,
					14,
					8,
					14
				],
				2024: [
					8,
					12,
					8,
					12
				],
				2025: [
					8,
					11,
					8,
					11
				],
				2026: [
					8,
					17,
					8,
					17
				],
				2027: [
					8,
					16,
					8,
					16
				],
				2028: [
					8,
					14,
					8,
					14
				],
				2029: [
					8,
					13,
					8,
					13
				]
			}
		] },
		Tessin: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Tessin&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "ti"
		},
		Thurgau: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Thurgau&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "tg",
			SH: [
				{
					name: "Sport",
					2020: [
						1,
						25,
						2,
						2
					],
					2021: [
						1,
						30,
						2,
						7
					],
					2022: [
						1,
						29,
						2,
						6
					],
					2023: [
						1,
						28,
						2,
						5
					],
					2024: [
						1,
						27,
						2,
						4
					],
					2025: [
						1,
						25,
						2,
						2
					],
					2026: [
						1,
						24,
						2,
						1
					]
				},
				{
					name: "Frühling",
					2020: [
						3,
						28,
						4,
						13
					],
					2021: [
						4,
						2,
						4,
						18
					],
					2022: [
						4,
						2,
						4,
						18
					],
					2023: [
						3,
						25,
						4,
						10
					],
					2024: [
						3,
						29,
						4,
						14
					],
					2025: [
						4,
						12,
						4,
						27
					],
					2026: [
						4,
						3,
						4,
						19
					]
				},
				{
					name: "Sommer",
					2020: [
						7,
						4,
						8,
						9
					],
					2021: [
						7,
						10,
						8,
						15
					],
					2022: [
						7,
						9,
						8,
						14
					],
					2023: [
						7,
						8,
						8,
						13
					],
					2024: [
						7,
						6,
						8,
						11
					],
					2025: [
						7,
						5,
						8,
						10
					],
					2026: [
						7,
						4,
						8,
						9
					]
				},
				{
					name: "Herbst",
					2020: [
						10,
						3,
						10,
						18
					],
					2021: [
						10,
						9,
						10,
						24
					],
					2022: [
						10,
						8,
						10,
						23
					],
					2023: [
						10,
						7,
						10,
						22
					],
					2024: [
						10,
						5,
						10,
						20
					],
					2025: [
						10,
						4,
						10,
						19
					],
					2026: [
						10,
						3,
						10,
						18
					]
				},
				{
					name: "Winter",
					2020: [
						12,
						19,
						1,
						3
					],
					2021: [
						12,
						18,
						1,
						2
					],
					2022: [
						12,
						24,
						1,
						8
					],
					2023: [
						12,
						23,
						1,
						7
					],
					2024: [
						12,
						21,
						1,
						5
					],
					2025: [
						12,
						20,
						1,
						4
					],
					2026: [
						12,
						19,
						1,
						3
					]
				},
				{
					name: "Pfingsten",
					2026: [
						5,
						14,
						5,
						25
					]
				}
			]
		},
		Ticino: { SH: [
			{
				name: "Sport",
				2020: [
					2,
					22,
					3,
					1
				],
				2021: [
					2,
					13,
					2,
					21
				],
				2022: [
					2,
					26,
					3,
					6
				],
				2023: [
					2,
					18,
					2,
					26
				],
				2024: [
					2,
					10,
					2,
					18
				],
				2025: [
					3,
					1,
					3,
					9
				],
				2026: [
					2,
					14,
					2,
					22
				]
			},
			{
				name: "Frühling",
				2020: [
					4,
					10,
					4,
					19
				],
				2021: [
					4,
					2,
					4,
					11
				],
				2022: [
					4,
					15,
					4,
					24
				],
				2023: [
					4,
					7,
					4,
					16
				],
				2024: [
					3,
					29,
					4,
					7
				],
				2025: [
					4,
					18,
					4,
					27
				],
				2026: [
					4,
					3,
					4,
					12
				]
			},
			{
				name: "Sommer",
				2020: [
					6,
					20,
					8,
					30
				],
				2021: [
					6,
					19,
					8,
					29
				],
				2022: [
					6,
					16,
					8,
					28
				],
				2023: [
					6,
					17,
					8,
					27
				],
				2024: [
					6,
					15,
					9,
					1
				],
				2025: [
					6,
					19,
					8,
					31
				],
				2026: [
					6,
					18,
					8,
					30
				]
			},
			{
				name: "Herbst",
				2020: [
					10,
					31,
					11,
					8
				],
				2021: [
					10,
					30,
					11,
					7
				],
				2022: [
					10,
					29,
					11,
					6
				],
				2023: [
					10,
					28,
					11,
					5
				],
				2024: [
					10,
					26,
					11,
					3
				],
				2025: [
					11,
					1,
					11,
					9
				],
				2026: [
					10,
					31,
					11,
					8
				]
			},
			{
				name: "Winter",
				2020: [
					12,
					24,
					1,
					6
				],
				2021: [
					12,
					24,
					1,
					9
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					6
				],
				2025: [
					12,
					24,
					1,
					6
				],
				2026: [
					12,
					24,
					1,
					6
				]
			}
		] },
		Uri: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Uri&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "ur",
			SH: [
				{
					name: "Sport",
					2020: [
						2,
						15,
						3,
						1
					],
					2021: [
						2,
						27,
						3,
						7
					],
					2022: [
						2,
						19,
						3,
						6
					],
					2023: [
						3,
						4,
						3,
						12
					],
					2024: [
						3,
						2,
						3,
						10
					],
					2025: [
						2,
						22,
						3,
						9
					],
					2026: [
						2,
						28,
						3,
						8
					]
				},
				{
					name: "Frühling",
					2020: [
						4,
						25,
						5,
						10
					],
					2021: [
						5,
						1,
						5,
						16
					],
					2022: [
						4,
						30,
						5,
						15
					],
					2023: [
						4,
						22,
						5,
						7
					],
					2024: [
						4,
						27,
						5,
						12
					],
					2025: [
						4,
						26,
						5,
						11
					],
					2026: [
						5,
						2,
						5,
						17
					]
				},
				{
					name: "Sommer",
					2020: [
						7,
						4,
						8,
						16
					],
					2021: [
						7,
						3,
						8,
						15
					],
					2022: [
						7,
						2,
						8,
						15
					],
					2023: [
						7,
						1,
						8,
						20
					],
					2024: [
						7,
						6,
						8,
						18
					],
					2025: [
						7,
						5,
						8,
						17
					],
					2026: [
						7,
						4,
						8,
						16
					]
				},
				{
					name: "Herbst",
					2020: [
						10,
						3,
						10,
						18
					],
					2021: [
						10,
						2,
						10,
						17
					],
					2022: [
						10,
						1,
						10,
						16
					],
					2023: [
						10,
						7,
						10,
						22
					],
					2024: [
						10,
						5,
						10,
						20
					],
					2025: [
						10,
						4,
						10,
						19
					],
					2026: [
						10,
						3,
						10,
						18
					]
				},
				{
					name: "Winter",
					2020: [
						12,
						24,
						1,
						10
					],
					2021: [
						12,
						24,
						1,
						9
					],
					2022: [
						12,
						24,
						1,
						8
					],
					2023: [
						12,
						23,
						1,
						7
					],
					2024: [
						12,
						21,
						1,
						6
					],
					2025: [
						12,
						20,
						1,
						6
					],
					2026: [
						12,
						24,
						1,
						10
					]
				}
			]
		},
		Valais: { SH: [
			{
				name: "Sport",
				2020: [
					2,
					29,
					3,
					8
				],
				2021: [
					2,
					27,
					3,
					7
				],
				2022: [
					3,
					5,
					3,
					13
				],
				2023: [
					3,
					4,
					3,
					12
				],
				2024: [
					3,
					2,
					3,
					10
				],
				2025: [
					3,
					1,
					3,
					9
				],
				2026: [
					2,
					28,
					3,
					8
				]
			},
			{
				name: "Frühling",
				2020: [
					5,
					16,
					5,
					24
				],
				2021: [
					5,
					8,
					5,
					16
				],
				2022: [
					5,
					7,
					5,
					15
				],
				2023: [
					5,
					13,
					5,
					29
				],
				2024: [
					5,
					4,
					5,
					12
				],
				2025: [
					4,
					18,
					4,
					27
				],
				2026: [
					5,
					9,
					5,
					17
				]
			},
			{
				name: "Sommer",
				2020: [
					6,
					27,
					8,
					16
				],
				2021: [
					6,
					26,
					8,
					15
				],
				2022: [
					6,
					30,
					8,
					15
				],
				2023: [
					7,
					1,
					8,
					15
				],
				2024: [
					6,
					29,
					8,
					18
				],
				2025: [
					6,
					28,
					8,
					17
				],
				2026: [
					7,
					1,
					8,
					16
				]
			},
			{
				name: "Herbst",
				2020: [
					10,
					22,
					11,
					1
				],
				2021: [
					10,
					13,
					10,
					24
				],
				2022: [
					10,
					13,
					10,
					23
				],
				2023: [
					10,
					19,
					10,
					29
				],
				2024: [
					10,
					17,
					10,
					27
				],
				2025: [
					10,
					16,
					10,
					26
				],
				2026: [
					10,
					15,
					10,
					25
				]
			},
			{
				name: "Winter",
				2020: [
					12,
					24,
					1,
					6
				],
				2021: [
					12,
					24,
					1,
					9
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					20,
					1,
					4
				],
				2026: [
					12,
					24,
					1,
					10
				]
			}
		] },
		Vaud: { SH: [
			{
				name: "Sport",
				2020: [
					2,
					15,
					2,
					23
				],
				2021: [
					2,
					20,
					2,
					28
				],
				2022: [
					2,
					19,
					2,
					27
				],
				2023: [
					2,
					11,
					2,
					19
				],
				2024: [
					2,
					10,
					2,
					18
				],
				2025: [
					2,
					15,
					2,
					23
				],
				2026: [
					2,
					14,
					2,
					22
				]
			},
			{
				name: "Frühling",
				2020: [
					4,
					10,
					4,
					26
				],
				2021: [
					4,
					2,
					4,
					18
				],
				2022: [
					4,
					15,
					5,
					1
				],
				2023: [
					4,
					7,
					4,
					23
				],
				2024: [
					3,
					29,
					4,
					14
				],
				2025: [
					4,
					12,
					4,
					27
				],
				2026: [
					4,
					3,
					4,
					19
				]
			},
			{
				name: "Sommer",
				2020: [
					7,
					4,
					8,
					23
				],
				2021: [
					7,
					3,
					8,
					22
				],
				2022: [
					7,
					2,
					8,
					21
				],
				2023: [
					7,
					1,
					8,
					20
				],
				2024: [
					6,
					29,
					8,
					18
				],
				2025: [
					6,
					28,
					8,
					17
				],
				2026: [
					6,
					27,
					8,
					16
				]
			},
			{
				name: "Herbst",
				2020: [
					10,
					10,
					10,
					25
				],
				2021: [
					10,
					16,
					10,
					31
				],
				2022: [
					10,
					15,
					10,
					30
				],
				2023: [
					10,
					14,
					10,
					29
				],
				2024: [
					10,
					12,
					10,
					27
				],
				2025: [
					10,
					11,
					10,
					26
				],
				2026: [
					10,
					10,
					10,
					25
				]
			},
			{
				name: "Winter",
				2020: [
					12,
					19,
					1,
					3
				],
				2021: [
					12,
					24,
					1,
					9
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					20,
					1,
					4
				],
				2026: [
					12,
					24,
					1,
					10
				]
			}
		] },
		Viamala: { SH: [
			{
				name: "Herbstferien",
				2020: [
					10,
					10,
					10,
					25
				],
				2021: [
					10,
					9,
					10,
					24
				],
				2022: [
					10,
					8,
					10,
					23
				],
				2023: [
					10,
					7,
					10,
					22
				],
				2024: [
					10,
					5,
					10,
					20
				],
				2025: [
					10,
					6,
					10,
					17
				],
				2026: [
					10,
					10,
					10,
					25
				],
				2027: [
					10,
					9,
					10,
					24
				],
				2028: [
					10,
					7,
					10,
					22
				],
				2029: [
					10,
					6,
					10,
					21
				]
			},
			{
				name: "Weihnachtsferien",
				2019: [
					12,
					21,
					1,
					5
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					23,
					1,
					5
				],
				2027: [
					12,
					23,
					1,
					5
				],
				2028: [
					12,
					23,
					1,
					7
				],
				2029: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Schulbeginn",
				2020: [
					8,
					17,
					8,
					17
				],
				2021: [
					8,
					16,
					8,
					16
				],
				2022: [
					8,
					15,
					8,
					15
				],
				2023: [
					8,
					14,
					8,
					14
				],
				2024: [
					8,
					12,
					8,
					12
				],
				2025: [
					8,
					11,
					8,
					11
				],
				2026: [
					8,
					17,
					8,
					17
				],
				2027: [
					8,
					16,
					8,
					16
				],
				2028: [
					8,
					14,
					8,
					14
				],
				2029: [
					8,
					13,
					8,
					13
				]
			}
		] },
		Waadt: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Waadt&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "vd"
		},
		Wallis: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Wallis&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "vs"
		},
		Zug: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Zug&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "zg",
			SH: [
				{
					name: "Winterferien",
					2020: [
						12,
						19,
						1,
						3
					],
					2021: [
						12,
						23,
						1,
						5
					],
					2022: [
						12,
						22,
						1,
						4
					],
					2023: [
						12,
						23,
						1,
						7
					],
					2024: [
						12,
						21,
						1,
						5
					],
					2025: [
						12,
						20,
						1,
						4
					],
					2026: [
						12,
						19,
						1,
						3
					],
					2027: [
						12,
						19,
						1,
						3
					],
					2028: [
						12,
						23,
						1,
						7
					],
					2029: [
						12,
						22,
						1,
						6
					]
				},
				{
					name: "Sommerferien",
					2020: [
						7,
						4,
						8,
						16
					],
					2021: [
						7,
						3,
						8,
						15
					],
					2022: [
						7,
						9,
						8,
						21
					],
					2023: [
						7,
						8,
						8,
						20
					],
					2024: [
						7,
						6,
						8,
						18
					],
					2025: [
						6,
						21,
						8,
						17
					],
					2026: [
						7,
						4,
						8,
						16
					],
					2027: [
						7,
						3,
						8,
						15
					],
					2028: [
						7,
						8,
						8,
						20
					],
					2029: [
						7,
						7,
						8,
						19
					],
					2030: [
						7,
						6,
						8,
						18
					]
				},
				{
					name: "Herbstferien",
					2020: [
						10,
						3,
						10,
						18
					],
					2021: [
						10,
						2,
						10,
						17
					],
					2022: [
						10,
						8,
						10,
						23
					],
					2023: [
						10,
						7,
						10,
						22
					],
					2024: [
						10,
						5,
						10,
						20
					],
					2025: [
						10,
						4,
						10,
						19
					],
					2026: [
						10,
						3,
						10,
						18
					],
					2027: [
						10,
						3,
						10,
						18
					],
					2028: [
						10,
						7,
						10,
						22
					],
					2029: [
						10,
						6,
						10,
						21
					]
				},
				{
					name: "Sportferien",
					2020: [
						2,
						1,
						2,
						16
					],
					2021: [
						2,
						6,
						2,
						21
					],
					2022: [
						2,
						5,
						2,
						20
					],
					2023: [
						2,
						4,
						2,
						19
					],
					2024: [
						2,
						3,
						2,
						18
					],
					2025: [
						2,
						1,
						2,
						16
					],
					2026: [
						1,
						31,
						2,
						15
					],
					2027: [
						2,
						6,
						2,
						21
					],
					2028: [
						2,
						5,
						2,
						20
					],
					2029: [
						2,
						3,
						2,
						18
					],
					2030: [
						2,
						2,
						2,
						17
					]
				},
				{
					name: "Frühlingsferien",
					2020: [
						4,
						11,
						4,
						26
					],
					2021: [
						4,
						17,
						5,
						2
					],
					2022: [
						4,
						15,
						5,
						1
					],
					2023: [
						4,
						15,
						4,
						30
					],
					2024: [
						4,
						13,
						4,
						28
					],
					2025: [
						4,
						12,
						4,
						27
					],
					2026: [
						4,
						11,
						4,
						26
					],
					2027: [
						4,
						17,
						5,
						2
					],
					2028: [
						4,
						15,
						4,
						30
					],
					2029: [
						4,
						4,
						4,
						29
					],
					2030: [
						4,
						13,
						4,
						28
					]
				},
				{
					name: "Auffahrtsferien",
					2020: [
						5,
						21,
						5,
						24
					],
					2021: [
						5,
						13,
						5,
						16
					],
					2022: [
						5,
						26,
						5,
						29
					],
					2023: [
						5,
						18,
						5,
						21
					],
					2024: [
						5,
						9,
						5,
						12
					],
					2025: [
						5,
						29,
						6,
						1
					],
					2026: [
						5,
						14,
						5,
						17
					],
					2027: [
						5,
						6,
						5,
						9
					],
					2028: [
						5,
						25,
						5,
						28
					],
					2029: [
						5,
						10,
						5,
						13
					],
					2030: [
						5,
						30,
						6,
						2
					]
				}
			]
		},
		Zürich: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Switzerland&state=Z%C3%BCrich&zoom=18&addressdetails=1&limit=1&accept-language=de,fr,it,rm",
			_state_code: "zh",
			SH: [
				{
					name: "Sommerferien",
					2020: [
						7,
						13,
						8,
						15
					],
					2021: [
						7,
						19,
						8,
						21
					],
					2022: [
						7,
						18,
						8,
						20
					],
					2023: [
						7,
						17,
						8,
						19
					],
					2024: [
						7,
						15,
						8,
						17
					],
					2025: [
						7,
						14,
						8,
						16
					],
					2026: [
						7,
						13,
						8,
						15
					],
					2027: [
						7,
						19,
						8,
						21
					],
					2028: [
						7,
						17,
						8,
						19
					],
					2029: [
						7,
						16,
						8,
						18
					],
					2030: [
						7,
						15,
						8,
						17
					],
					2031: [
						7,
						14,
						8,
						16
					],
					2032: [
						7,
						12,
						8,
						14
					],
					2033: [
						7,
						18,
						8,
						20
					]
				},
				{
					name: "Herbstferien",
					2020: [
						10,
						5,
						10,
						17
					],
					2021: [
						10,
						11,
						10,
						23
					],
					2022: [
						10,
						10,
						10,
						22
					],
					2023: [
						10,
						9,
						10,
						21
					],
					2024: [
						10,
						7,
						10,
						19
					],
					2025: [
						10,
						6,
						10,
						18
					],
					2026: [
						10,
						5,
						10,
						17
					],
					2027: [
						10,
						11,
						10,
						23
					],
					2028: [
						10,
						9,
						10,
						21
					],
					2029: [
						10,
						8,
						10,
						20
					],
					2030: [
						10,
						7,
						10,
						19
					],
					2031: [
						10,
						6,
						10,
						18
					],
					2032: [
						10,
						4,
						10,
						16
					]
				},
				{
					name: "Weihnachtsferien",
					2020: [
						12,
						21,
						1,
						2
					],
					2021: [
						12,
						20,
						1,
						1
					],
					2022: [
						12,
						26,
						1,
						7
					],
					2023: [
						12,
						25,
						1,
						6
					],
					2024: [
						12,
						23,
						1,
						4
					],
					2025: [
						12,
						22,
						1,
						3
					],
					2026: [
						12,
						21,
						1,
						2
					],
					2027: [
						12,
						20,
						1,
						1
					],
					2028: [
						12,
						25,
						1,
						6
					],
					2029: [
						12,
						24,
						1,
						5
					],
					2030: [
						12,
						23,
						1,
						5
					],
					2031: [
						12,
						22,
						1,
						3
					],
					2032: [
						12,
						20,
						1,
						1
					]
				},
				{
					name: "Ostern",
					2020: [
						4,
						10,
						4,
						13
					],
					2021: [
						4,
						2,
						4,
						5
					],
					2022: [
						4,
						15,
						4,
						18
					],
					2023: [
						4,
						7,
						4,
						10
					],
					2024: [
						3,
						29,
						4,
						1
					],
					2025: [
						4,
						18,
						4,
						21
					],
					2026: [
						4,
						3,
						4,
						6
					],
					2027: [
						3,
						26,
						3,
						29
					],
					2028: [
						4,
						14,
						4,
						17
					],
					2029: [
						3,
						30,
						4,
						2
					],
					2030: [
						4,
						19,
						4,
						22
					],
					2031: [
						4,
						11,
						4,
						14
					],
					2032: [
						3,
						26,
						3,
						29
					],
					2033: [
						4,
						15,
						4,
						18
					]
				},
				{
					name: "Frühlingsferien",
					2020: [
						4,
						13,
						4,
						25
					],
					2021: [
						4,
						26,
						5,
						8
					],
					2022: [
						4,
						18,
						4,
						30
					],
					2023: [
						4,
						24,
						5,
						6
					],
					2024: [
						4,
						22,
						5,
						4
					],
					2025: [
						4,
						21,
						5,
						3
					],
					2026: [
						4,
						20,
						5,
						2
					],
					2027: [
						4,
						26,
						5,
						8
					],
					2028: [
						4,
						17,
						4,
						29
					],
					2029: [
						4,
						23,
						5,
						5
					],
					2030: [
						4,
						22,
						5,
						4
					],
					2031: [
						4,
						14,
						4,
						26
					],
					2032: [
						4,
						19,
						5,
						1
					],
					2033: [
						4,
						18,
						4,
						30
					]
				},
				{
					name: "Auffahrtsbrücke",
					2020: [
						5,
						21,
						5,
						23
					],
					2021: [
						5,
						13,
						5,
						15
					],
					2022: [
						5,
						26,
						5,
						28
					],
					2024: [
						5,
						9,
						5,
						11
					],
					2025: [
						5,
						29,
						5,
						31
					],
					2026: [
						5,
						14,
						5,
						16
					],
					2027: [
						5,
						6,
						5,
						8
					],
					2028: [
						5,
						25,
						5,
						27
					],
					2029: [
						5,
						10,
						5,
						12
					],
					2030: [
						5,
						30,
						6,
						1
					],
					2031: [
						5,
						22,
						5,
						24
					],
					2032: [
						5,
						6,
						5,
						8
					],
					2033: [
						5,
						26,
						5,
						28
					]
				}
			]
		}
	},
	ci: {
		PH: [
			{
				name: "Fête du 1ᵉʳ janvier",
				fixed_date: [1, 1]
			},
			{
				name: "Lundi de Pâques",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Fête du travail",
				fixed_date: [5, 1]
			},
			{
				name: "Lendemain de la Fête du travail",
				variable_date: "nextMo-Sa01May"
			},
			{
				name: "Jour de l’Ascension",
				variable_date: "easter",
				offset: 39
			},
			{
				name: "Lundi de la Pentecôte",
				variable_date: "easter",
				offset: 50
			},
			{
				name: "Fête nationale",
				fixed_date: [8, 7]
			},
			{
				name: "Lendemain de la Fête nationale",
				variable_date: "nextMo-Sa07August"
			},
			{
				name: "Fête de l’Assomption",
				fixed_date: [8, 15]
			},
			{
				name: "Fête de la Toussaint",
				fixed_date: [11, 1]
			},
			{
				name: "Journée Nationale de la Paix",
				fixed_date: [11, 15]
			},
			{
				name: "Fête de Noël",
				fixed_date: [12, 25]
			},
			{
				name: "Lendemain de la Fête de Noël",
				variable_date: "nextMo-Sa25December"
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=5.3203570&lon=-4.0161070&zoom=18&addressdetails=1&accept-language=fr"
	},
	cn: {
		PH: [
			{
				name: "元旦",
				fixed_date: [1, 1]
			},
			{
				name: "妇女节",
				fixed_date: [3, 8]
			},
			{
				name: "劳动节",
				fixed_date: [5, 1]
			},
			{
				name: "青年节",
				fixed_date: [5, 4]
			},
			{
				name: "儿童节",
				fixed_date: [6, 1]
			},
			{
				name: "国庆节",
				fixed_date: [10, 1]
			},
			{
				name: "国庆节休息日",
				fixed_date: [10, 2]
			},
			{
				name: "国庆节休息日",
				fixed_date: [10, 3]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=%E4%B8%AD%E5%9B%BD&&zoom=18&addressdetails=1&limit=1&accept-language=zh,en",
		西藏自治区: {
			_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&state=%E8%A5%BF%E8%97%8F%E8%87%AA%E6%B2%BB%E5%8C%BA&zoom=1&addressdetails=1&limit=1&accept-language=zh,en",
			PH: [
				{
					name: "元旦",
					fixed_date: [1, 1]
				},
				{
					name: "西藏百万农奴解放纪念日",
					fixed_date: [3, 28]
				},
				{
					name: "妇女节",
					fixed_date: [3, 8]
				},
				{
					name: "劳动节",
					fixed_date: [5, 1]
				},
				{
					name: "青年节",
					fixed_date: [5, 4]
				},
				{
					name: "儿童节",
					fixed_date: [6, 1]
				},
				{
					name: "国庆节",
					fixed_date: [10, 1]
				},
				{
					name: "国庆节休息日",
					fixed_date: [10, 2]
				},
				{
					name: "国庆节休息日",
					fixed_date: [10, 3]
				}
			]
		}
	},
	cz: {
		PH: [
			{
				name: "Den obnovy samostatného českého státu",
				fixed_date: [1, 1]
			},
			{
				name: "Velký pátek",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Velikonoční pondělí",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Svátek práce",
				fixed_date: [5, 1]
			},
			{
				name: "Den vítězství",
				fixed_date: [5, 8]
			},
			{
				name: "Den slovanských věrozvěstů Cyrila a Metoděje",
				fixed_date: [7, 5]
			},
			{
				name: "Den upálení mistra Jana Husa",
				fixed_date: [7, 6]
			},
			{
				name: "Den české státnosti",
				fixed_date: [9, 28]
			},
			{
				name: "Den vzniku samostatného československého státu",
				fixed_date: [10, 28]
			},
			{
				name: "Den boje za svobodu a demokracii",
				fixed_date: [11, 17]
			},
			{
				name: "Štědrý den",
				fixed_date: [12, 24]
			},
			{
				name: "1. svátek vánoční",
				fixed_date: [12, 25]
			},
			{
				name: "2. svátek vánoční",
				fixed_date: [12, 26]
			}
		],
		SH: [
			{
				name: "Vánoční prázdniny",
				2019: [
					12,
					23,
					1,
					3
				],
				2020: [
					12,
					23,
					1,
					3
				],
				2021: [
					12,
					23,
					1,
					2
				],
				2022: [
					12,
					23,
					1,
					2
				],
				2023: [
					12,
					23,
					1,
					2
				],
				2024: [
					12,
					23,
					1,
					3
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					23,
					1,
					3
				],
				2027: [
					12,
					23,
					1,
					2
				]
			},
			{
				name: "Pololetní prázdniny",
				2020: [
					1,
					31,
					1,
					31
				],
				2021: [
					1,
					29,
					1,
					29
				],
				2022: [
					2,
					4,
					2,
					4
				],
				2023: [
					2,
					3,
					2,
					3
				],
				2024: [
					2,
					2,
					2,
					2
				],
				2025: [
					1,
					31,
					1,
					31
				],
				2026: [
					1,
					30,
					1,
					30
				],
				2027: [
					1,
					29,
					1,
					29
				],
				2028: [
					2,
					4,
					2,
					4
				]
			},
			{
				name: "Velikonoční prázdniny",
				2020: [
					4,
					9,
					4,
					9
				],
				2021: [
					4,
					1,
					4,
					1
				],
				2022: [
					4,
					14,
					4,
					14
				],
				2023: [
					4,
					6,
					4,
					6
				],
				2024: [
					3,
					28,
					3,
					28
				],
				2025: [
					4,
					17,
					4,
					17
				],
				2026: [
					4,
					2,
					4,
					2
				],
				2027: [
					3,
					25,
					3,
					25
				],
				2028: [
					4,
					13,
					4,
					13
				]
			},
			{
				name: "Hlavní prázdniny",
				2020: [
					7,
					1,
					8,
					31
				],
				2021: [
					7,
					1,
					8,
					31
				],
				2022: [
					7,
					1,
					8,
					31
				],
				2023: [
					7,
					1,
					9,
					3
				],
				2024: [
					6,
					29,
					9,
					1
				],
				2025: [
					7,
					1,
					8,
					31
				],
				2026: [
					7,
					1,
					8,
					31
				],
				2027: [
					7,
					1,
					8,
					31
				],
				2028: [
					7,
					1,
					9,
					3
				]
			},
			{
				name: "Podzimní prázdniny",
				2020: [
					10,
					29,
					10,
					30
				],
				2021: [
					10,
					27,
					10,
					29
				],
				2022: [
					10,
					26,
					10,
					27
				],
				2023: [
					10,
					26,
					10,
					27
				],
				2024: [
					10,
					29,
					10,
					30
				],
				2025: [
					10,
					27,
					10,
					29
				],
				2026: [
					10,
					29,
					10,
					30
				],
				2027: [
					10,
					27,
					10,
					29
				]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=50.0874401&lon=14.4212556&zoom=18&addressdetails=1&accept-language=cs,en",
		Benešov: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				10,
				2,
				16
			],
			2021: [
				2,
				15,
				2,
				21
			],
			2022: [
				2,
				28,
				3,
				6
			],
			2023: [
				3,
				6,
				3,
				12
			],
			2024: [
				3,
				11,
				3,
				17
			],
			2025: [
				2,
				3,
				2,
				9
			],
			2026: [
				2,
				9,
				2,
				15
			],
			2027: [
				2,
				15,
				2,
				21
			],
			2028: [
				2,
				28,
				3,
				5
			]
		}] },
		Beroun: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				10,
				2,
				16
			],
			2021: [
				2,
				15,
				2,
				21
			],
			2022: [
				2,
				28,
				3,
				6
			],
			2023: [
				3,
				6,
				3,
				12
			],
			2024: [
				3,
				11,
				3,
				17
			],
			2025: [
				2,
				3,
				2,
				9
			],
			2026: [
				2,
				9,
				2,
				15
			],
			2027: [
				2,
				15,
				2,
				21
			],
			2028: [
				2,
				28,
				3,
				5
			]
		}] },
		Blansko: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				17,
				2,
				23
			],
			2021: [
				2,
				22,
				2,
				28
			],
			2022: [
				3,
				7,
				3,
				13
			],
			2023: [
				3,
				13,
				3,
				19
			],
			2024: [
				2,
				5,
				2,
				11
			],
			2025: [
				2,
				10,
				2,
				16
			],
			2026: [
				2,
				16,
				2,
				22
			],
			2027: [
				2,
				22,
				2,
				28
			],
			2028: [
				3,
				6,
				3,
				12
			]
		}] },
		Břeclav: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				17,
				2,
				23
			],
			2021: [
				2,
				22,
				2,
				28
			],
			2022: [
				3,
				7,
				3,
				13
			],
			2023: [
				3,
				13,
				3,
				19
			],
			2024: [
				2,
				5,
				2,
				11
			],
			2025: [
				2,
				10,
				2,
				16
			],
			2026: [
				2,
				16,
				2,
				22
			],
			2027: [
				2,
				22,
				2,
				28
			],
			2028: [
				3,
				6,
				3,
				12
			]
		}] },
		"Brno-město": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				17,
				2,
				23
			],
			2021: [
				2,
				22,
				2,
				28
			],
			2022: [
				3,
				7,
				3,
				13
			],
			2023: [
				3,
				13,
				3,
				19
			],
			2024: [
				2,
				5,
				2,
				11
			],
			2025: [
				2,
				10,
				2,
				16
			],
			2026: [
				2,
				16,
				2,
				22
			],
			2027: [
				2,
				22,
				2,
				28
			],
			2028: [
				3,
				6,
				3,
				12
			]
		}] },
		"Brno-venkov": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				17,
				2,
				23
			],
			2021: [
				2,
				22,
				2,
				28
			],
			2022: [
				3,
				7,
				3,
				13
			],
			2023: [
				3,
				13,
				3,
				19
			],
			2024: [
				2,
				5,
				2,
				11
			],
			2025: [
				2,
				10,
				2,
				16
			],
			2026: [
				2,
				16,
				2,
				22
			],
			2027: [
				2,
				22,
				2,
				28
			],
			2028: [
				3,
				6,
				3,
				12
			]
		}] },
		Bruntál: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		"Česká Lípa": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		"České Budějovice": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				10,
				2,
				16
			],
			2021: [
				2,
				15,
				2,
				21
			],
			2022: [
				2,
				28,
				3,
				6
			],
			2023: [
				3,
				6,
				3,
				12
			],
			2024: [
				3,
				11,
				3,
				17
			],
			2025: [
				2,
				3,
				2,
				9
			],
			2026: [
				2,
				9,
				2,
				15
			],
			2027: [
				2,
				15,
				2,
				21
			],
			2028: [
				2,
				28,
				3,
				5
			]
		}] },
		"Český Krumlov": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				10,
				2,
				16
			],
			2021: [
				2,
				15,
				2,
				21
			],
			2022: [
				2,
				28,
				3,
				6
			],
			2023: [
				3,
				6,
				3,
				12
			],
			2024: [
				3,
				11,
				3,
				17
			],
			2025: [
				2,
				3,
				2,
				9
			],
			2026: [
				2,
				9,
				2,
				15
			],
			2027: [
				2,
				15,
				2,
				21
			],
			2028: [
				2,
				28,
				3,
				5
			]
		}] },
		Cheb: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				24,
				3,
				1
			],
			2021: [
				3,
				1,
				3,
				7
			],
			2022: [
				3,
				14,
				3,
				20
			],
			2023: [
				2,
				6,
				2,
				12
			],
			2024: [
				2,
				12,
				2,
				18
			],
			2025: [
				2,
				17,
				2,
				23
			],
			2026: [
				2,
				23,
				3,
				1
			],
			2027: [
				3,
				1,
				3,
				7
			],
			2028: [
				3,
				13,
				3,
				19
			]
		}] },
		Chomutov: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				3,
				2,
				9
			],
			2021: [
				2,
				8,
				2,
				14
			],
			2022: [
				2,
				21,
				2,
				27
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				3,
				4,
				3,
				10
			],
			2025: [
				3,
				10,
				3,
				16
			],
			2026: [
				2,
				2,
				2,
				8
			],
			2027: [
				2,
				8,
				2,
				14
			],
			2028: [
				2,
				21,
				2,
				27
			]
		}] },
		Chrudim: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				10,
				2,
				16
			],
			2021: [
				2,
				15,
				2,
				21
			],
			2022: [
				2,
				28,
				3,
				6
			],
			2023: [
				3,
				6,
				3,
				12
			],
			2024: [
				3,
				11,
				3,
				17
			],
			2025: [
				2,
				3,
				2,
				9
			],
			2026: [
				2,
				9,
				2,
				15
			],
			2027: [
				2,
				15,
				2,
				21
			],
			2028: [
				2,
				28,
				3,
				5
			]
		}] },
		Děčín: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				24,
				3,
				1
			],
			2021: [
				3,
				1,
				3,
				7
			],
			2022: [
				3,
				14,
				3,
				20
			],
			2023: [
				2,
				6,
				2,
				12
			],
			2024: [
				2,
				12,
				2,
				18
			],
			2025: [
				2,
				17,
				2,
				23
			],
			2026: [
				2,
				23,
				3,
				1
			],
			2027: [
				3,
				1,
				3,
				7
			],
			2028: [
				3,
				13,
				3,
				19
			]
		}] },
		Domažlice: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				17,
				2,
				23
			],
			2021: [
				2,
				22,
				2,
				28
			],
			2022: [
				3,
				7,
				3,
				13
			],
			2023: [
				3,
				13,
				3,
				19
			],
			2024: [
				2,
				5,
				2,
				11
			],
			2025: [
				2,
				10,
				2,
				16
			],
			2026: [
				2,
				16,
				2,
				22
			],
			2027: [
				2,
				22,
				2,
				28
			],
			2028: [
				3,
				6,
				3,
				12
			]
		}] },
		"Frýdek-Místek": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				24,
				3,
				1
			],
			2021: [
				3,
				1,
				3,
				7
			],
			2022: [
				3,
				14,
				3,
				20
			],
			2023: [
				2,
				6,
				2,
				12
			],
			2024: [
				2,
				12,
				2,
				18
			],
			2025: [
				2,
				17,
				2,
				23
			],
			2026: [
				2,
				23,
				3,
				1
			],
			2027: [
				3,
				1,
				3,
				7
			],
			2028: [
				3,
				13,
				3,
				19
			]
		}] },
		"Havlíčkův Brod": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		Hodonín: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				17,
				2,
				23
			],
			2021: [
				2,
				22,
				2,
				28
			],
			2022: [
				3,
				7,
				3,
				13
			],
			2023: [
				3,
				13,
				3,
				19
			],
			2024: [
				2,
				5,
				2,
				11
			],
			2025: [
				2,
				10,
				2,
				16
			],
			2026: [
				2,
				16,
				2,
				22
			],
			2027: [
				2,
				22,
				2,
				28
			],
			2028: [
				3,
				6,
				3,
				12
			]
		}] },
		"Hradec Králov": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				2,
				3,
				8
			],
			2021: [
				3,
				8,
				3,
				14
			],
			2022: [
				2,
				7,
				2,
				13
			],
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				3,
				2,
				3,
				8
			],
			2027: [
				3,
				8,
				3,
				14
			],
			2028: [
				2,
				7,
				2,
				13
			]
		}] },
		"Jablonec nad Nisou": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		Jeseník: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				3,
				2,
				9
			],
			2021: [
				2,
				8,
				2,
				14
			],
			2022: [
				2,
				21,
				2,
				27
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				3,
				4,
				3,
				10
			],
			2025: [
				3,
				10,
				3,
				16
			],
			2026: [
				2,
				2,
				2,
				8
			],
			2027: [
				2,
				8,
				2,
				14
			],
			2028: [
				2,
				21,
				2,
				27
			]
		}] },
		Jičín: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				3,
				2,
				9
			],
			2021: [
				2,
				8,
				2,
				14
			],
			2022: [
				2,
				21,
				2,
				27
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				3,
				4,
				3,
				10
			],
			2025: [
				3,
				10,
				3,
				16
			],
			2026: [
				2,
				2,
				2,
				8
			],
			2027: [
				2,
				8,
				2,
				14
			],
			2028: [
				2,
				21,
				2,
				27
			]
		}] },
		Jihlava: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		"Jindřichův Hradec": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				24,
				3,
				1
			],
			2021: [
				3,
				1,
				3,
				7
			],
			2022: [
				3,
				14,
				3,
				20
			],
			2023: [
				2,
				6,
				2,
				12
			],
			2024: [
				2,
				12,
				2,
				18
			],
			2025: [
				2,
				17,
				2,
				23
			],
			2026: [
				2,
				23,
				3,
				1
			],
			2027: [
				3,
				1,
				3,
				7
			],
			2028: [
				3,
				13,
				3,
				19
			]
		}] },
		"Karlovy Vary": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				24,
				3,
				1
			],
			2021: [
				3,
				1,
				3,
				7
			],
			2022: [
				3,
				14,
				3,
				20
			],
			2023: [
				2,
				6,
				2,
				12
			],
			2024: [
				2,
				12,
				2,
				18
			],
			2025: [
				2,
				17,
				2,
				23
			],
			2026: [
				2,
				23,
				3,
				1
			],
			2027: [
				3,
				1,
				3,
				7
			],
			2028: [
				3,
				13,
				3,
				19
			]
		}] },
		Karviná: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				17,
				2,
				23
			],
			2021: [
				2,
				22,
				2,
				28
			],
			2022: [
				3,
				7,
				3,
				13
			],
			2023: [
				3,
				13,
				3,
				19
			],
			2024: [
				2,
				5,
				2,
				11
			],
			2025: [
				2,
				10,
				2,
				16
			],
			2026: [
				2,
				16,
				2,
				22
			],
			2027: [
				2,
				22,
				2,
				28
			],
			2028: [
				3,
				6,
				3,
				12
			]
		}] },
		Kladno: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		Klatovy: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				10,
				2,
				16
			],
			2021: [
				2,
				15,
				2,
				21
			],
			2022: [
				2,
				28,
				3,
				6
			],
			2023: [
				3,
				6,
				3,
				12
			],
			2024: [
				3,
				11,
				3,
				17
			],
			2025: [
				2,
				3,
				2,
				9
			],
			2026: [
				2,
				9,
				2,
				15
			],
			2027: [
				2,
				15,
				2,
				21
			],
			2028: [
				2,
				28,
				3,
				5
			]
		}] },
		Kolín: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		Kroměříž: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				2,
				3,
				8
			],
			2021: [
				3,
				8,
				3,
				14
			],
			2022: [
				2,
				7,
				2,
				13
			],
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				3,
				2,
				3,
				8
			],
			2027: [
				3,
				8,
				3,
				14
			],
			2028: [
				2,
				7,
				2,
				13
			]
		}] },
		"Kutná Hora": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		Liberec: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		Litoměřice: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				24,
				3,
				1
			],
			2021: [
				3,
				1,
				3,
				7
			],
			2022: [
				3,
				14,
				3,
				20
			],
			2023: [
				2,
				6,
				2,
				12
			],
			2024: [
				2,
				12,
				2,
				18
			],
			2025: [
				2,
				17,
				2,
				23
			],
			2026: [
				2,
				23,
				3,
				1
			],
			2027: [
				3,
				1,
				3,
				7
			],
			2028: [
				3,
				13,
				3,
				19
			]
		}] },
		Louny: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				17,
				2,
				23
			],
			2021: [
				2,
				22,
				2,
				28
			],
			2022: [
				3,
				7,
				3,
				13
			],
			2023: [
				3,
				13,
				3,
				19
			],
			2024: [
				2,
				5,
				2,
				11
			],
			2025: [
				2,
				10,
				2,
				16
			],
			2026: [
				2,
				16,
				2,
				22
			],
			2027: [
				2,
				22,
				2,
				28
			],
			2028: [
				3,
				6,
				3,
				12
			]
		}] },
		Mělník: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				2,
				3,
				8
			],
			2021: [
				3,
				8,
				3,
				14
			],
			2022: [
				2,
				7,
				2,
				13
			],
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				3,
				2,
				3,
				8
			],
			2027: [
				3,
				8,
				3,
				14
			],
			2028: [
				2,
				7,
				2,
				13
			]
		}] },
		"Mladá Boleslav": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				3,
				2,
				9
			],
			2021: [
				2,
				8,
				2,
				14
			],
			2022: [
				2,
				21,
				2,
				27
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				3,
				4,
				3,
				10
			],
			2025: [
				3,
				10,
				3,
				16
			],
			2026: [
				2,
				2,
				2,
				8
			],
			2027: [
				2,
				8,
				2,
				14
			],
			2028: [
				2,
				21,
				2,
				27
			]
		}] },
		Most: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				3,
				2,
				9
			],
			2021: [
				2,
				8,
				2,
				14
			],
			2022: [
				2,
				21,
				2,
				27
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				3,
				4,
				3,
				10
			],
			2025: [
				3,
				10,
				3,
				16
			],
			2026: [
				2,
				2,
				2,
				8
			],
			2027: [
				2,
				8,
				2,
				14
			],
			2028: [
				2,
				21,
				2,
				27
			]
		}] },
		Náchod: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		"Nový Jičín": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				2,
				3,
				8
			],
			2021: [
				3,
				8,
				3,
				14
			],
			2022: [
				2,
				7,
				2,
				13
			],
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				3,
				2,
				3,
				8
			],
			2027: [
				3,
				8,
				3,
				14
			],
			2028: [
				2,
				7,
				2,
				13
			]
		}] },
		Nymburk: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				24,
				3,
				1
			],
			2021: [
				3,
				1,
				3,
				7
			],
			2022: [
				3,
				14,
				3,
				20
			],
			2023: [
				2,
				6,
				2,
				12
			],
			2024: [
				2,
				12,
				2,
				18
			],
			2025: [
				2,
				17,
				2,
				23
			],
			2026: [
				2,
				23,
				3,
				1
			],
			2027: [
				3,
				1,
				3,
				7
			],
			2028: [
				3,
				13,
				3,
				19
			]
		}] },
		Olomouc: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				3,
				2,
				9
			],
			2021: [
				2,
				8,
				2,
				14
			],
			2022: [
				2,
				21,
				2,
				27
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				3,
				4,
				3,
				10
			],
			2025: [
				3,
				10,
				3,
				16
			],
			2026: [
				2,
				2,
				2,
				8
			],
			2027: [
				2,
				8,
				2,
				14
			],
			2028: [
				2,
				21,
				2,
				27
			]
		}] },
		Opava: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				3,
				2,
				9
			],
			2021: [
				2,
				8,
				2,
				14
			],
			2022: [
				2,
				21,
				2,
				27
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				3,
				4,
				3,
				10
			],
			2025: [
				3,
				10,
				3,
				16
			],
			2026: [
				2,
				2,
				2,
				8
			],
			2027: [
				2,
				8,
				2,
				14
			],
			2028: [
				2,
				21,
				2,
				27
			]
		}] },
		"Ostrava-město": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				10,
				2,
				16
			],
			2021: [
				2,
				15,
				2,
				21
			],
			2022: [
				2,
				28,
				3,
				6
			],
			2023: [
				3,
				6,
				3,
				12
			],
			2024: [
				3,
				11,
				3,
				17
			],
			2025: [
				2,
				3,
				2,
				9
			],
			2026: [
				2,
				9,
				2,
				15
			],
			2027: [
				2,
				15,
				2,
				21
			],
			2028: [
				2,
				28,
				3,
				5
			]
		}] },
		Pardubice: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				10,
				2,
				16
			],
			2021: [
				2,
				15,
				2,
				21
			],
			2022: [
				2,
				28,
				3,
				6
			],
			2023: [
				3,
				6,
				3,
				12
			],
			2024: [
				3,
				11,
				3,
				17
			],
			2025: [
				2,
				3,
				2,
				9
			],
			2026: [
				2,
				9,
				2,
				15
			],
			2027: [
				2,
				15,
				2,
				21
			],
			2028: [
				2,
				28,
				3,
				5
			]
		}] },
		Pelhřimov: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		Písek: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		"Plzeň-jih": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				2,
				3,
				8
			],
			2021: [
				3,
				8,
				3,
				14
			],
			2022: [
				2,
				7,
				2,
				13
			],
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				3,
				2,
				3,
				8
			],
			2027: [
				3,
				8,
				3,
				14
			],
			2028: [
				2,
				7,
				2,
				13
			]
		}] },
		"Plzeň-město": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				2,
				3,
				8
			],
			2021: [
				3,
				8,
				3,
				14
			],
			2022: [
				2,
				7,
				2,
				13
			],
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				3,
				2,
				3,
				8
			],
			2027: [
				3,
				8,
				3,
				14
			],
			2028: [
				2,
				7,
				2,
				13
			]
		}] },
		"Plzeň-sever": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				2,
				3,
				8
			],
			2021: [
				3,
				8,
				3,
				14
			],
			2022: [
				2,
				7,
				2,
				13
			],
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				3,
				2,
				3,
				8
			],
			2027: [
				3,
				8,
				3,
				14
			],
			2028: [
				2,
				7,
				2,
				13
			]
		}] },
		Prachatice: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				3,
				2,
				9
			],
			2021: [
				2,
				8,
				2,
				14
			],
			2022: [
				2,
				21,
				2,
				27
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				3,
				4,
				3,
				10
			],
			2025: [
				3,
				10,
				3,
				16
			],
			2026: [
				2,
				2,
				2,
				8
			],
			2027: [
				2,
				8,
				2,
				14
			],
			2028: [
				2,
				21,
				2,
				27
			]
		}] },
		Praha: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				24,
				3,
				1
			],
			2021: [
				3,
				1,
				3,
				7
			],
			2022: [
				3,
				14,
				3,
				20
			],
			2023: [
				3,
				13,
				3,
				19
			],
			2024: [
				2,
				12,
				2,
				18
			],
			2025: [
				2,
				17,
				2,
				23
			],
			2026: [
				2,
				23,
				3,
				1
			],
			2027: [
				3,
				1,
				3,
				7
			],
			2028: [
				3,
				13,
				3,
				19
			]
		}] },
		"Praha-východ": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				2,
				3,
				8
			],
			2021: [
				3,
				8,
				3,
				14
			],
			2022: [
				2,
				7,
				2,
				13
			],
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				3,
				2,
				3,
				8
			],
			2027: [
				3,
				8,
				3,
				14
			],
			2028: [
				2,
				7,
				2,
				13
			]
		}] },
		"Praha-západ": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				2,
				3,
				8
			],
			2021: [
				3,
				8,
				3,
				14
			],
			2022: [
				2,
				7,
				2,
				13
			],
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				3,
				2,
				3,
				8
			],
			2027: [
				3,
				8,
				3,
				14
			],
			2028: [
				2,
				7,
				2,
				13
			]
		}] },
		Přerov: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				24,
				3,
				1
			],
			2021: [
				3,
				1,
				3,
				7
			],
			2022: [
				3,
				14,
				3,
				20
			],
			2023: [
				2,
				6,
				2,
				12
			],
			2024: [
				2,
				12,
				2,
				18
			],
			2025: [
				2,
				17,
				2,
				23
			],
			2026: [
				2,
				23,
				3,
				1
			],
			2027: [
				3,
				1,
				3,
				7
			],
			2028: [
				3,
				13,
				3,
				19
			]
		}] },
		Příbram: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				3,
				2,
				9
			],
			2021: [
				2,
				8,
				2,
				14
			],
			2022: [
				2,
				21,
				2,
				27
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				3,
				4,
				3,
				10
			],
			2025: [
				3,
				10,
				3,
				16
			],
			2026: [
				2,
				2,
				2,
				8
			],
			2027: [
				2,
				8,
				2,
				14
			],
			2028: [
				2,
				21,
				2,
				27
			]
		}] },
		Prostějov: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				10,
				2,
				16
			],
			2021: [
				2,
				15,
				2,
				21
			],
			2022: [
				2,
				28,
				3,
				6
			],
			2023: [
				3,
				6,
				3,
				12
			],
			2024: [
				3,
				11,
				3,
				17
			],
			2025: [
				2,
				3,
				2,
				9
			],
			2026: [
				2,
				9,
				2,
				15
			],
			2027: [
				2,
				15,
				2,
				21
			],
			2028: [
				2,
				28,
				3,
				5
			]
		}] },
		Rakovník: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				2,
				3,
				8
			],
			2021: [
				3,
				8,
				3,
				14
			],
			2022: [
				2,
				7,
				2,
				13
			],
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				3,
				2,
				3,
				8
			],
			2027: [
				3,
				8,
				3,
				14
			],
			2028: [
				2,
				7,
				2,
				13
			]
		}] },
		Rokycany: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				10,
				2,
				16
			],
			2021: [
				2,
				15,
				2,
				21
			],
			2022: [
				2,
				28,
				3,
				6
			],
			2023: [
				3,
				6,
				3,
				12
			],
			2024: [
				3,
				11,
				3,
				17
			],
			2025: [
				2,
				3,
				2,
				9
			],
			2026: [
				2,
				9,
				2,
				15
			],
			2027: [
				2,
				15,
				2,
				21
			],
			2028: [
				2,
				28,
				3,
				5
			]
		}] },
		"Rychnov nad Kněžnou": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				3,
				2,
				9
			],
			2021: [
				2,
				8,
				2,
				14
			],
			2022: [
				2,
				21,
				2,
				27
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				3,
				4,
				3,
				10
			],
			2025: [
				3,
				10,
				3,
				16
			],
			2026: [
				2,
				2,
				2,
				8
			],
			2027: [
				2,
				8,
				2,
				14
			],
			2028: [
				2,
				21,
				2,
				27
			]
		}] },
		Semily: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		Sokolov: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				24,
				3,
				1
			],
			2021: [
				3,
				1,
				3,
				7
			],
			2022: [
				3,
				14,
				3,
				20
			],
			2023: [
				2,
				6,
				2,
				12
			],
			2024: [
				2,
				12,
				2,
				18
			],
			2025: [
				2,
				17,
				2,
				23
			],
			2026: [
				2,
				23,
				3,
				1
			],
			2027: [
				3,
				1,
				3,
				7
			],
			2028: [
				3,
				13,
				3,
				19
			]
		}] },
		Strakonice: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				3,
				2,
				9
			],
			2021: [
				2,
				8,
				2,
				14
			],
			2022: [
				2,
				21,
				2,
				27
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				3,
				4,
				3,
				10
			],
			2025: [
				3,
				10,
				3,
				16
			],
			2026: [
				2,
				2,
				2,
				8
			],
			2027: [
				2,
				8,
				2,
				14
			],
			2028: [
				2,
				21,
				2,
				27
			]
		}] },
		Šumperk: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				3,
				2,
				9
			],
			2021: [
				2,
				8,
				2,
				14
			],
			2022: [
				2,
				21,
				2,
				27
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				3,
				4,
				3,
				10
			],
			2025: [
				3,
				10,
				3,
				16
			],
			2026: [
				2,
				2,
				2,
				8
			],
			2027: [
				2,
				8,
				2,
				14
			],
			2028: [
				2,
				21,
				2,
				27
			]
		}] },
		Svitavy: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				10,
				2,
				16
			],
			2021: [
				2,
				15,
				2,
				21
			],
			2022: [
				2,
				28,
				3,
				6
			],
			2023: [
				3,
				6,
				3,
				12
			],
			2024: [
				3,
				11,
				3,
				17
			],
			2025: [
				2,
				3,
				2,
				9
			],
			2026: [
				2,
				9,
				2,
				15
			],
			2027: [
				2,
				15,
				2,
				21
			],
			2028: [
				2,
				28,
				3,
				5
			]
		}] },
		Tábor: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				3,
				2,
				9
			],
			2021: [
				2,
				8,
				2,
				14
			],
			2022: [
				2,
				21,
				2,
				27
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				3,
				4,
				3,
				10
			],
			2025: [
				3,
				10,
				3,
				16
			],
			2026: [
				2,
				2,
				2,
				8
			],
			2027: [
				2,
				8,
				2,
				14
			],
			2028: [
				2,
				21,
				2,
				27
			]
		}] },
		Tachov: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				17,
				2,
				23
			],
			2021: [
				2,
				22,
				2,
				28
			],
			2022: [
				3,
				7,
				3,
				13
			],
			2023: [
				3,
				13,
				3,
				19
			],
			2024: [
				2,
				5,
				2,
				11
			],
			2025: [
				2,
				10,
				2,
				16
			],
			2026: [
				2,
				16,
				2,
				22
			],
			2027: [
				2,
				22,
				2,
				28
			],
			2028: [
				3,
				6,
				3,
				12
			]
		}] },
		Teplice: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				2,
				3,
				8
			],
			2021: [
				3,
				8,
				3,
				14
			],
			2022: [
				2,
				7,
				2,
				13
			],
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				3,
				2,
				3,
				8
			],
			2027: [
				3,
				8,
				3,
				14
			],
			2028: [
				2,
				7,
				2,
				13
			]
		}] },
		Třebíč: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		Trutnov: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				10,
				2,
				16
			],
			2021: [
				2,
				15,
				2,
				21
			],
			2022: [
				2,
				28,
				3,
				6
			],
			2023: [
				3,
				6,
				3,
				12
			],
			2024: [
				3,
				11,
				3,
				17
			],
			2025: [
				2,
				3,
				2,
				9
			],
			2026: [
				2,
				9,
				2,
				15
			],
			2027: [
				2,
				15,
				2,
				21
			],
			2028: [
				2,
				28,
				3,
				5
			]
		}] },
		"Uherské Hradiště": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				2,
				3,
				8
			],
			2021: [
				3,
				8,
				3,
				14
			],
			2022: [
				2,
				7,
				2,
				13
			],
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				3,
				2,
				3,
				8
			],
			2027: [
				3,
				8,
				3,
				14
			],
			2028: [
				2,
				7,
				2,
				13
			]
		}] },
		"Ústí nad Labem": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				3,
				2,
				9
			],
			2021: [
				2,
				8,
				2,
				14
			],
			2022: [
				2,
				21,
				2,
				27
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				3,
				4,
				3,
				10
			],
			2025: [
				3,
				10,
				3,
				16
			],
			2026: [
				2,
				2,
				2,
				8
			],
			2027: [
				2,
				8,
				2,
				14
			],
			2028: [
				2,
				21,
				2,
				27
			]
		}] },
		"Ústí nad Orlicí": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				10,
				2,
				16
			],
			2021: [
				2,
				15,
				2,
				21
			],
			2022: [
				2,
				28,
				3,
				6
			],
			2023: [
				3,
				6,
				3,
				12
			],
			2024: [
				3,
				11,
				3,
				17
			],
			2025: [
				2,
				3,
				2,
				9
			],
			2026: [
				2,
				9,
				2,
				15
			],
			2027: [
				2,
				15,
				2,
				21
			],
			2028: [
				2,
				28,
				3,
				5
			]
		}] },
		Vsetín: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				2,
				3,
				8
			],
			2021: [
				3,
				8,
				3,
				14
			],
			2022: [
				2,
				7,
				2,
				13
			],
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				3,
				2,
				3,
				8
			],
			2027: [
				3,
				8,
				3,
				14
			],
			2028: [
				2,
				7,
				2,
				13
			]
		}] },
		Vyškov: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				17,
				2,
				23
			],
			2021: [
				2,
				22,
				2,
				28
			],
			2022: [
				3,
				7,
				3,
				13
			],
			2023: [
				3,
				13,
				3,
				19
			],
			2024: [
				2,
				5,
				2,
				11
			],
			2025: [
				2,
				10,
				2,
				16
			],
			2026: [
				2,
				16,
				2,
				22
			],
			2027: [
				2,
				22,
				2,
				28
			],
			2028: [
				3,
				6,
				3,
				12
			]
		}] },
		"Žďár nad Sázavou": { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				9,
				3,
				15
			],
			2021: [
				2,
				1,
				2,
				7
			],
			2022: [
				2,
				14,
				2,
				20
			],
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				9,
				3,
				15
			],
			2027: [
				2,
				1,
				2,
				7
			],
			2028: [
				2,
				14,
				2,
				20
			]
		}] },
		Zlín: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				3,
				2,
				3,
				8
			],
			2021: [
				3,
				8,
				3,
				14
			],
			2022: [
				2,
				7,
				2,
				13
			],
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				3,
				2,
				3,
				8
			],
			2027: [
				3,
				8,
				3,
				14
			],
			2028: [
				2,
				7,
				2,
				13
			]
		}] },
		Znojmom: { SH: [{
			name: "Jarní prázdniny",
			2020: [
				2,
				17,
				2,
				23
			],
			2021: [
				2,
				22,
				2,
				28
			],
			2022: [
				3,
				7,
				3,
				13
			],
			2023: [
				3,
				13,
				3,
				19
			],
			2024: [
				2,
				5,
				2,
				11
			],
			2025: [
				2,
				10,
				2,
				16
			],
			2026: [
				2,
				16,
				2,
				22
			],
			2027: [
				2,
				22,
				2,
				28
			],
			2028: [
				3,
				6,
				3,
				12
			]
		}] }
	},
	de: {
		PH: [
			{
				name: "Neujahrstag",
				fixed_date: [1, 1]
			},
			{
				name: "Heilige Drei Könige",
				fixed_date: [1, 6],
				only_states: [
					"Baden-Württemberg",
					"Bayern",
					"Sachsen-Anhalt"
				]
			},
			{
				name: "Frauentag",
				fixed_date: [3, 8],
				only_states: ["Berlin", "Mecklenburg-Vorpommern"]
			},
			{
				name: "Tag der Arbeit",
				fixed_date: [5, 1]
			},
			{
				name: "Karfreitag",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Ostersonntag",
				variable_date: "easter",
				only_states: ["Brandenburg"]
			},
			{
				name: "Ostermontag",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Christi Himmelfahrt",
				variable_date: "easter",
				offset: 39
			},
			{
				name: "Pfingstsonntag",
				variable_date: "easter",
				offset: 49,
				only_states: ["Brandenburg"]
			},
			{
				name: "Pfingstmontag",
				variable_date: "easter",
				offset: 50
			},
			{
				name: "Fronleichnam",
				variable_date: "easter",
				offset: 60,
				only_states: [
					"Baden-Württemberg",
					"Bayern",
					"Hessen",
					"Nordrhein-Westfalen",
					"Rheinland-Pfalz",
					"Saarland"
				]
			},
			{
				name: "Mariä Himmelfahrt",
				fixed_date: [8, 15],
				only_states: ["Saarland"]
			},
			{
				name: "Weltkindertag",
				fixed_date: [9, 20],
				only_states: ["Thüringen"]
			},
			{
				name: "Tag der Deutschen Einheit",
				fixed_date: [10, 3]
			},
			{
				name: "Reformationstag",
				fixed_date: [10, 31],
				only_states: [
					"Brandenburg",
					"Bremen",
					"Hamburg",
					"Mecklenburg-Vorpommern",
					"Niedersachsen",
					"Sachsen",
					"Sachsen-Anhalt",
					"Schleswig-Holstein",
					"Thüringen"
				]
			},
			{
				name: "Allerheiligen",
				fixed_date: [11, 1],
				only_states: [
					"Baden-Württemberg",
					"Bayern",
					"Nordrhein-Westfalen",
					"Rheinland-Pfalz",
					"Saarland"
				]
			},
			{
				name: "Buß- und Bettag",
				variable_date: "nextWednesday16Nov",
				only_states: ["Sachsen"]
			},
			{
				name: "1. Weihnachtstag",
				fixed_date: [12, 25]
			},
			{
				name: "2. Weihnachtstag",
				fixed_date: [12, 26]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=49.5487&lon=9.8160&zoom=18&addressdetails=1&accept-language=de,en",
		"Baden-Württemberg": { SH: [
			{
				name: "Osterferien",
				2012: [
					4,
					2,
					4,
					13
				],
				2013: [
					3,
					25,
					4,
					5
				],
				2014: [
					4,
					14,
					4,
					25
				],
				2015: [
					3,
					30,
					4,
					10
				],
				2016: [
					3,
					29,
					4,
					2
				],
				2017: [
					4,
					10,
					4,
					21
				],
				2018: [
					3,
					26,
					4,
					6
				],
				2019: [
					4,
					15,
					4,
					27
				],
				2020: [
					4,
					6,
					4,
					18
				],
				2021: [
					4,
					6,
					4,
					10
				],
				2022: [
					4,
					19,
					4,
					23
				],
				2023: [
					4,
					11,
					4,
					15
				],
				2024: [
					3,
					23,
					4,
					5
				],
				2025: [
					4,
					14,
					4,
					26
				],
				2026: [
					3,
					30,
					4,
					11
				],
				2027: [
					3,
					30,
					4,
					3
				],
				2028: [
					4,
					18,
					4,
					22
				],
				2029: [
					3,
					26,
					4,
					7
				],
				2030: [
					4,
					15,
					4,
					26
				]
			},
			{
				name: "Pfingstferien",
				2012: [
					5,
					29,
					6,
					9
				],
				2013: [
					5,
					21,
					6,
					1
				],
				2014: [
					6,
					10,
					6,
					21
				],
				2015: [
					5,
					26,
					6,
					6
				],
				2016: [
					5,
					17,
					5,
					28
				],
				2017: [
					6,
					6,
					6,
					16
				],
				2018: [
					5,
					22,
					6,
					2
				],
				2019: [
					6,
					11,
					6,
					21
				],
				2020: [
					6,
					2,
					6,
					13
				],
				2021: [
					5,
					25,
					6,
					5
				],
				2022: [
					6,
					7,
					6,
					18
				],
				2023: [
					5,
					30,
					6,
					9
				],
				2024: [
					5,
					21,
					5,
					31
				],
				2025: [
					6,
					10,
					6,
					20
				],
				2026: [
					5,
					26,
					6,
					5
				],
				2027: [
					5,
					18,
					5,
					29
				],
				2028: [
					6,
					6,
					6,
					17
				],
				2029: [
					5,
					22,
					6,
					1
				],
				2030: [
					6,
					11,
					6,
					21
				]
			},
			{
				name: "Sommerferien",
				2012: [
					7,
					26,
					9,
					8
				],
				2013: [
					7,
					25,
					9,
					7
				],
				2014: [
					7,
					31,
					9,
					13
				],
				2015: [
					7,
					30,
					9,
					12
				],
				2016: [
					7,
					28,
					9,
					10
				],
				2017: [
					7,
					27,
					9,
					9
				],
				2018: [
					7,
					26,
					9,
					8
				],
				2019: [
					7,
					29,
					9,
					10
				],
				2020: [
					7,
					30,
					9,
					12
				],
				2021: [
					7,
					29,
					9,
					11
				],
				2022: [
					7,
					28,
					9,
					10
				],
				2023: [
					7,
					27,
					9,
					9
				],
				2024: [
					7,
					25,
					9,
					7
				],
				2025: [
					7,
					31,
					9,
					13
				],
				2026: [
					7,
					30,
					9,
					12
				],
				2027: [
					7,
					29,
					9,
					11
				],
				2028: [
					7,
					27,
					9,
					9
				],
				2029: [
					7,
					26,
					9,
					8
				],
				2030: [
					7,
					25,
					9,
					7
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					29,
					11,
					2
				],
				2013: [
					10,
					28,
					10,
					30
				],
				2014: [
					10,
					27,
					10,
					30
				],
				2015: [
					11,
					2,
					11,
					6
				],
				2016: [
					11,
					2,
					11,
					4
				],
				2017: [
					10,
					30,
					11,
					3
				],
				2018: [
					10,
					29,
					11,
					2
				],
				2019: [
					10,
					28,
					10,
					30
				],
				2020: [
					10,
					26,
					10,
					30
				],
				2021: [
					11,
					2,
					11,
					6
				],
				2022: [
					11,
					2,
					11,
					4
				],
				2023: [
					10,
					30,
					11,
					3
				],
				2024: [
					10,
					28,
					10,
					30
				],
				2025: [
					10,
					27,
					10,
					30
				],
				2026: [
					10,
					26,
					10,
					30
				],
				2027: [
					11,
					2,
					11,
					6
				],
				2028: [
					10,
					30,
					11,
					3
				],
				2029: [
					10,
					29,
					11,
					2
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					23,
					1,
					5
				],
				2012: [
					12,
					24,
					1,
					5
				],
				2013: [
					12,
					23,
					1,
					4
				],
				2014: [
					12,
					22,
					1,
					5
				],
				2015: [
					12,
					23,
					1,
					9
				],
				2016: [
					12,
					23,
					1,
					7
				],
				2017: [
					12,
					22,
					1,
					5
				],
				2018: [
					12,
					24,
					1,
					5
				],
				2019: [
					12,
					23,
					1,
					4
				],
				2020: [
					12,
					23,
					1,
					9
				],
				2021: [
					12,
					23,
					1,
					8
				],
				2022: [
					12,
					21,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					4
				],
				2025: [
					12,
					22,
					1,
					5
				],
				2026: [
					12,
					23,
					1,
					9
				],
				2027: [
					12,
					23,
					1,
					8
				],
				2028: [
					12,
					23,
					1,
					5
				],
				2029: [
					12,
					22,
					1,
					5
				]
			},
			{
				name: "Reformationsfest",
				2022: [
					10,
					31,
					10,
					31
				],
				2024: [
					10,
					31,
					10,
					31
				],
				2025: [
					10,
					31,
					10,
					31
				],
				2026: [
					10,
					31,
					10,
					31
				]
			},
			{
				name: "Gründonnerstag",
				2023: [
					4,
					6,
					4,
					6
				],
				2027: [
					3,
					25,
					3,
					25
				],
				2028: [
					4,
					13,
					4,
					13
				]
			}
		] },
		Bayern: { SH: [
			{
				name: "Winterferien",
				2012: [
					2,
					20,
					2,
					24
				],
				2013: [
					2,
					11,
					2,
					15
				],
				2014: [
					3,
					3,
					3,
					7
				],
				2015: [
					2,
					16,
					2,
					20
				],
				2016: [
					2,
					8,
					2,
					12
				],
				2017: [
					2,
					27,
					3,
					3
				],
				2018: [
					2,
					12,
					2,
					16
				],
				2019: [
					3,
					4,
					3,
					8
				]
			},
			{
				name: "Osterferien",
				2012: [
					4,
					2,
					4,
					14
				],
				2013: [
					3,
					25,
					4,
					6
				],
				2014: [
					4,
					14,
					4,
					26
				],
				2015: [
					3,
					30,
					4,
					11
				],
				2016: [
					3,
					21,
					4,
					1
				],
				2017: [
					4,
					10,
					4,
					22
				],
				2018: [
					3,
					26,
					4,
					7
				],
				2019: [
					4,
					15,
					4,
					27
				],
				2020: [
					4,
					6,
					4,
					18
				],
				2021: [
					3,
					29,
					4,
					10
				],
				2022: [
					4,
					11,
					4,
					23
				],
				2023: [
					4,
					3,
					4,
					15
				],
				2024: [
					3,
					25,
					4,
					6
				],
				2025: [
					4,
					14,
					4,
					25
				],
				2026: [
					3,
					30,
					4,
					10
				],
				2027: [
					3,
					22,
					4,
					2
				],
				2028: [
					4,
					10,
					4,
					21
				],
				2029: [
					3,
					26,
					4,
					6
				],
				2030: [
					4,
					15,
					4,
					26
				]
			},
			{
				name: "Pfingstferien",
				2012: [
					5,
					29,
					6,
					9
				],
				2013: [
					5,
					21,
					5,
					31
				],
				2014: [
					6,
					10,
					6,
					21
				],
				2015: [
					5,
					26,
					6,
					5
				],
				2016: [
					5,
					17,
					5,
					28
				],
				2017: [
					6,
					6,
					6,
					16
				],
				2018: [
					5,
					22,
					6,
					2
				],
				2019: [
					6,
					11,
					6,
					21
				],
				2020: [
					6,
					2,
					6,
					13
				],
				2021: [
					5,
					25,
					6,
					4
				],
				2022: [
					6,
					7,
					6,
					18
				],
				2023: [
					5,
					30,
					6,
					9
				],
				2024: [
					5,
					21,
					6,
					1
				],
				2025: [
					6,
					10,
					6,
					20
				],
				2026: [
					5,
					26,
					6,
					5
				],
				2027: [
					5,
					18,
					5,
					28
				],
				2028: [
					6,
					6,
					6,
					16
				],
				2029: [
					5,
					22,
					6,
					1
				],
				2030: [
					6,
					11,
					6,
					21
				]
			},
			{
				name: "Sommerferien",
				2012: [
					8,
					1,
					9,
					12
				],
				2013: [
					7,
					31,
					9,
					11
				],
				2014: [
					7,
					30,
					9,
					15
				],
				2015: [
					8,
					1,
					9,
					14
				],
				2016: [
					7,
					30,
					9,
					12
				],
				2017: [
					7,
					29,
					9,
					11
				],
				2018: [
					7,
					30,
					9,
					10
				],
				2019: [
					7,
					29,
					9,
					9
				],
				2020: [
					7,
					27,
					9,
					7
				],
				2021: [
					7,
					30,
					9,
					13
				],
				2022: [
					8,
					1,
					9,
					12
				],
				2023: [
					7,
					31,
					9,
					11
				],
				2024: [
					7,
					29,
					9,
					9
				],
				2025: [
					8,
					1,
					9,
					15
				],
				2026: [
					8,
					3,
					9,
					14
				],
				2027: [
					8,
					2,
					9,
					13
				],
				2028: [
					7,
					31,
					9,
					11
				],
				2029: [
					7,
					30,
					9,
					10
				],
				2030: [
					7,
					29,
					9,
					9
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					29,
					11,
					3
				],
				2013: [
					10,
					28,
					10,
					31
				],
				2014: [
					11,
					19,
					11,
					19
				],
				2015: [
					11,
					18,
					11,
					18
				],
				2016: [
					11,
					16,
					11,
					16
				],
				2017: [
					11,
					22,
					11,
					22
				],
				2018: [
					11,
					21,
					11,
					21
				],
				2019: [
					11,
					20,
					11,
					20
				],
				2020: [
					10,
					31,
					11,
					6
				],
				2021: [
					11,
					2,
					11,
					5
				],
				2022: [
					10,
					31,
					11,
					4
				],
				2023: [
					10,
					30,
					11,
					4
				],
				2024: [
					10,
					28,
					10,
					31
				],
				2025: [
					11,
					3,
					11,
					7
				],
				2026: [
					11,
					2,
					11,
					6
				],
				2027: [
					11,
					2,
					11,
					5
				],
				2028: [
					10,
					30,
					11,
					3
				],
				2029: [
					10,
					29,
					11,
					2
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					27,
					1,
					5
				],
				2012: [
					12,
					24,
					1,
					5
				],
				2013: [
					12,
					23,
					1,
					4
				],
				2014: [
					12,
					24,
					1,
					5
				],
				2015: [
					12,
					24,
					1,
					5
				],
				2016: [
					12,
					24,
					1,
					5
				],
				2017: [
					12,
					23,
					1,
					5
				],
				2018: [
					12,
					22,
					1,
					5
				],
				2019: [
					12,
					23,
					1,
					4
				],
				2020: [
					12,
					23,
					1,
					9
				],
				2021: [
					12,
					24,
					1,
					8
				],
				2022: [
					12,
					24,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					3
				],
				2025: [
					12,
					22,
					1,
					5
				],
				2026: [
					12,
					24,
					1,
					8
				],
				2027: [
					12,
					24,
					1,
					7
				],
				2028: [
					12,
					23,
					1,
					5
				],
				2029: [
					12,
					24,
					1,
					4
				]
			},
			{
				name: "Frühjahrsferien",
				2020: [
					2,
					24,
					2,
					28
				],
				2022: [
					2,
					28,
					3,
					4
				],
				2023: [
					2,
					20,
					2,
					24
				],
				2024: [
					2,
					12,
					2,
					16
				],
				2025: [
					3,
					3,
					3,
					7
				],
				2026: [
					2,
					16,
					2,
					20
				],
				2027: [
					2,
					8,
					2,
					12
				],
				2028: [
					2,
					28,
					3,
					3
				],
				2029: [
					2,
					12,
					2,
					16
				],
				2030: [
					3,
					4,
					3,
					8
				]
			},
			{
				name: "Buß- und Bettag",
				2020: [
					11,
					18,
					11,
					18
				],
				2021: [
					11,
					17,
					11,
					17
				],
				2022: [
					11,
					16,
					11,
					16
				],
				2023: [
					11,
					22,
					11,
					22
				],
				2024: [
					11,
					20,
					11,
					20
				],
				2025: [
					11,
					19,
					11,
					19
				],
				2026: [
					11,
					18,
					11,
					18
				],
				2027: [
					11,
					17,
					11,
					17
				],
				2028: [
					11,
					22,
					11,
					22
				],
				2029: [
					11,
					21,
					11,
					21
				],
				2030: [
					11,
					20,
					11,
					20
				]
			}
		] },
		Berlin: { SH: [
			{
				name: "Winterferien",
				2012: [
					1,
					30,
					2,
					4
				],
				2013: [
					2,
					4,
					2,
					9
				],
				2014: [
					2,
					3,
					2,
					8
				],
				2015: [
					2,
					2,
					2,
					7
				],
				2016: [
					2,
					1,
					2,
					6
				],
				2017: [
					1,
					30,
					2,
					3
				],
				2018: [
					2,
					5,
					2,
					10
				],
				2019: [
					2,
					4,
					2,
					9
				],
				2020: [
					2,
					3,
					2,
					8
				],
				2021: [
					2,
					1,
					2,
					6
				],
				2022: [
					1,
					30,
					2,
					4
				],
				2023: [
					1,
					30,
					2,
					4
				],
				2024: [
					2,
					5,
					2,
					10
				],
				2025: [
					2,
					3,
					2,
					8
				],
				2026: [
					2,
					2,
					2,
					7
				],
				2027: [
					2,
					1,
					2,
					6
				],
				2028: [
					1,
					31,
					2,
					5
				],
				2029: [
					1,
					29,
					2,
					3
				],
				2030: [
					2,
					4,
					2,
					9
				]
			},
			{
				name: "Osterferien",
				2012: [
					4,
					30,
					4,
					30
				],
				2013: [
					3,
					25,
					4,
					6
				],
				2014: [
					5,
					2,
					5,
					2
				],
				2015: [
					3,
					30,
					4,
					11
				],
				2016: [
					3,
					21,
					4,
					2
				],
				2017: [
					4,
					10,
					4,
					18
				],
				2018: [
					3,
					26,
					4,
					6
				],
				2019: [
					4,
					15,
					4,
					26
				],
				2020: [
					4,
					6,
					4,
					17
				],
				2021: [
					3,
					29,
					4,
					10
				],
				2022: [
					4,
					11,
					4,
					23
				],
				2023: [
					4,
					3,
					4,
					14
				],
				2024: [
					3,
					25,
					4,
					5
				],
				2025: [
					4,
					14,
					4,
					25
				],
				2026: [
					3,
					30,
					4,
					10
				],
				2027: [
					3,
					22,
					4,
					2
				],
				2028: [
					4,
					10,
					4,
					22
				],
				2029: [
					3,
					26,
					4,
					6
				],
				2030: [
					4,
					15,
					4,
					26
				]
			},
			{
				name: "Pfingstferien",
				2012: [
					5,
					18,
					5,
					18
				],
				2013: [
					5,
					21,
					5,
					21
				],
				2014: [
					5,
					30,
					5,
					30
				],
				2015: [
					5,
					26,
					5,
					26
				],
				2016: [
					5,
					17,
					5,
					18
				],
				2017: [
					6,
					6,
					6,
					9
				],
				2018: [
					5,
					22,
					5,
					22
				],
				2019: [
					6,
					11,
					6,
					11
				],
				2022: [
					6,
					7,
					6,
					7
				],
				2023: [
					5,
					30,
					5,
					30
				],
				2025: [
					6,
					10,
					6,
					10
				],
				2026: [
					5,
					26,
					5,
					26
				],
				2027: [
					5,
					18,
					5,
					19
				],
				2028: [
					6,
					1,
					6,
					2
				],
				2029: [
					5,
					22,
					5,
					25
				],
				2030: [
					6,
					7,
					6,
					7
				]
			},
			{
				name: "Sommerferien",
				2012: [
					6,
					20,
					8,
					3
				],
				2013: [
					6,
					19,
					8,
					2
				],
				2014: [
					7,
					9,
					8,
					22
				],
				2015: [
					7,
					16,
					8,
					28
				],
				2016: [
					7,
					21,
					9,
					2
				],
				2017: [
					7,
					20,
					9,
					1
				],
				2018: [
					7,
					5,
					8,
					17
				],
				2019: [
					6,
					20,
					8,
					2
				],
				2020: [
					6,
					25,
					8,
					7
				],
				2021: [
					6,
					24,
					8,
					6
				],
				2022: [
					7,
					7,
					8,
					18
				],
				2023: [
					7,
					13,
					8,
					25
				],
				2024: [
					7,
					18,
					8,
					30
				],
				2025: [
					7,
					24,
					9,
					6
				],
				2026: [
					7,
					9,
					8,
					22
				],
				2027: [
					7,
					1,
					8,
					14
				],
				2028: [
					7,
					1,
					8,
					12
				],
				2029: [
					7,
					1,
					8,
					11
				],
				2030: [
					7,
					4,
					8,
					17
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					1,
					10,
					13
				],
				2013: [
					9,
					30,
					10,
					12
				],
				2014: [
					10,
					20,
					11,
					1
				],
				2015: [
					10,
					19,
					10,
					31
				],
				2016: [
					10,
					17,
					10,
					28
				],
				2017: [
					10,
					23,
					11,
					4
				],
				2018: [
					10,
					22,
					11,
					2
				],
				2019: [
					10,
					7,
					10,
					19
				],
				2020: [
					10,
					12,
					10,
					24
				],
				2021: [
					10,
					11,
					10,
					23
				],
				2022: [
					10,
					24,
					11,
					5
				],
				2023: [
					10,
					23,
					11,
					4
				],
				2024: [
					10,
					21,
					11,
					2
				],
				2025: [
					10,
					20,
					11,
					1
				],
				2026: [
					10,
					19,
					10,
					31
				],
				2027: [
					10,
					11,
					10,
					23
				],
				2028: [
					10,
					2,
					10,
					14
				],
				2029: [
					10,
					1,
					10,
					12
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					23,
					1,
					3
				],
				2012: [
					12,
					24,
					1,
					4
				],
				2013: [
					12,
					23,
					1,
					3
				],
				2014: [
					12,
					22,
					1,
					2
				],
				2015: [
					12,
					23,
					1,
					2
				],
				2016: [
					12,
					23,
					1,
					3
				],
				2017: [
					12,
					21,
					1,
					2
				],
				2018: [
					12,
					22,
					1,
					5
				],
				2019: [
					12,
					23,
					1,
					4
				],
				2020: [
					12,
					21,
					1,
					2
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					22,
					1,
					2
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					23,
					1,
					2
				],
				2027: [
					12,
					22,
					12,
					31
				],
				2028: [
					12,
					22,
					1,
					2
				],
				2029: [
					12,
					21,
					1,
					4
				]
			},
			{
				name: "Unterrichtsfreier Tag",
				2020: [
					5,
					22,
					5,
					22
				],
				2021: [
					5,
					14,
					5,
					14
				],
				2022: [
					5,
					27,
					5,
					27
				],
				2023: [
					10,
					2,
					10,
					2
				],
				2024: [
					10,
					4,
					10,
					4
				],
				2025: [
					5,
					30,
					5,
					30
				],
				2026: [
					5,
					15,
					5,
					15
				],
				2027: [
					5,
					7,
					5,
					7
				],
				2028: [
					5,
					26,
					5,
					26
				],
				2029: [
					5,
					11,
					5,
					11
				],
				2030: [
					5,
					31,
					5,
					31
				]
			}
		] },
		Brandenburg: { SH: [
			{
				name: "Winterferien",
				2012: [
					1,
					30,
					2,
					4
				],
				2013: [
					2,
					4,
					2,
					9
				],
				2014: [
					2,
					3,
					2,
					8
				],
				2015: [
					2,
					2,
					2,
					7
				],
				2016: [
					2,
					1,
					2,
					6
				],
				2017: [
					1,
					30,
					2,
					4
				],
				2018: [
					2,
					5,
					2,
					10
				],
				2019: [
					2,
					4,
					2,
					9
				],
				2020: [
					2,
					3,
					2,
					8
				],
				2021: [
					2,
					1,
					2,
					6
				],
				2022: [
					1,
					31,
					2,
					5
				],
				2023: [
					1,
					30,
					2,
					3
				],
				2024: [
					2,
					5,
					2,
					9
				],
				2025: [
					2,
					3,
					2,
					8
				],
				2026: [
					2,
					2,
					2,
					7
				],
				2027: [
					2,
					1,
					2,
					6
				],
				2028: [
					1,
					31,
					2,
					5
				],
				2029: [
					1,
					29,
					2,
					3
				],
				2030: [
					2,
					4,
					2,
					9
				]
			},
			{
				name: "Osterferien",
				2012: [
					4,
					30,
					4,
					30
				],
				2013: [
					3,
					27,
					4,
					6
				],
				2014: [
					5,
					2,
					5,
					2
				],
				2015: [
					4,
					1,
					4,
					11
				],
				2016: [
					3,
					23,
					4,
					2
				],
				2017: [
					4,
					10,
					4,
					22
				],
				2018: [
					3,
					26,
					4,
					6
				],
				2019: [
					4,
					15,
					4,
					26
				],
				2020: [
					4,
					6,
					4,
					17
				],
				2021: [
					3,
					29,
					4,
					9
				],
				2022: [
					4,
					11,
					4,
					24
				],
				2023: [
					4,
					3,
					4,
					14
				],
				2024: [
					3,
					25,
					4,
					5
				],
				2025: [
					4,
					14,
					4,
					25
				],
				2026: [
					3,
					30,
					4,
					10
				],
				2027: [
					3,
					22,
					4,
					3
				],
				2028: [
					4,
					10,
					4,
					22
				],
				2029: [
					3,
					26,
					4,
					6
				],
				2030: [
					4,
					15,
					4,
					26
				]
			},
			{
				name: "Pfingstferien",
				2012: [
					5,
					18,
					5,
					18
				],
				2013: [
					5,
					10,
					5,
					10
				],
				2014: [
					5,
					30,
					5,
					30
				],
				2015: [
					5,
					15,
					5,
					15
				],
				2016: [
					5,
					17,
					5,
					17
				],
				2017: [
					5,
					26,
					5,
					26
				],
				2018: [
					5,
					11,
					5,
					11
				],
				2019: [
					5,
					31,
					5,
					31
				],
				2025: [
					6,
					10,
					6,
					10
				],
				2026: [
					5,
					26,
					5,
					26
				],
				2027: [
					5,
					18,
					5,
					18
				],
				2029: [
					5,
					22,
					5,
					22
				]
			},
			{
				name: "Sommerferien",
				2012: [
					6,
					21,
					8,
					3
				],
				2013: [
					6,
					20,
					8,
					2
				],
				2014: [
					7,
					10,
					8,
					22
				],
				2015: [
					7,
					16,
					8,
					28
				],
				2016: [
					7,
					21,
					9,
					3
				],
				2017: [
					7,
					20,
					9,
					1
				],
				2018: [
					7,
					5,
					8,
					18
				],
				2019: [
					6,
					20,
					8,
					3
				],
				2020: [
					6,
					25,
					8,
					8
				],
				2021: [
					6,
					24,
					8,
					7
				],
				2022: [
					7,
					7,
					8,
					20
				],
				2023: [
					7,
					13,
					8,
					26
				],
				2024: [
					7,
					18,
					8,
					31
				],
				2025: [
					7,
					24,
					9,
					6
				],
				2026: [
					7,
					9,
					8,
					22
				],
				2027: [
					7,
					1,
					8,
					14
				],
				2028: [
					6,
					29,
					8,
					12
				],
				2029: [
					6,
					28,
					8,
					11
				],
				2030: [
					7,
					4,
					8,
					17
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					1,
					10,
					13
				],
				2013: [
					11,
					1,
					11,
					1
				],
				2014: [
					10,
					20,
					11,
					1
				],
				2015: [
					10,
					19,
					10,
					30
				],
				2016: [
					10,
					17,
					10,
					28
				],
				2017: [
					10,
					23,
					11,
					4
				],
				2018: [
					10,
					22,
					11,
					2
				],
				2019: [
					11,
					1,
					11,
					1
				],
				2020: [
					10,
					12,
					10,
					24
				],
				2021: [
					10,
					11,
					10,
					23
				],
				2022: [
					10,
					24,
					11,
					5
				],
				2023: [
					10,
					23,
					11,
					4
				],
				2024: [
					10,
					21,
					11,
					2
				],
				2025: [
					10,
					20,
					11,
					1
				],
				2026: [
					10,
					19,
					10,
					30
				],
				2027: [
					10,
					11,
					10,
					23
				],
				2028: [
					10,
					2,
					10,
					14
				],
				2029: [
					10,
					1,
					10,
					12
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					23,
					1,
					3
				],
				2012: [
					12,
					24,
					1,
					4
				],
				2013: [
					12,
					23,
					1,
					3
				],
				2014: [
					12,
					22,
					1,
					2
				],
				2015: [
					12,
					23,
					1,
					2
				],
				2016: [
					12,
					23,
					1,
					3
				],
				2017: [
					12,
					21,
					1,
					2
				],
				2018: [
					12,
					21,
					1,
					5
				],
				2019: [
					12,
					23,
					1,
					3
				],
				2020: [
					12,
					21,
					1,
					2
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					22,
					1,
					3
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					23,
					1,
					2
				],
				2027: [
					12,
					23,
					12,
					31
				],
				2028: [
					12,
					22,
					1,
					2
				],
				2029: [
					12,
					21,
					1,
					4
				]
			},
			{
				name: "Variabler Ferientag",
				2020: [
					5,
					22,
					5,
					22
				],
				2021: [
					5,
					14,
					5,
					14
				],
				2022: [
					5,
					27,
					5,
					27
				],
				2023: [
					10,
					2,
					10,
					2
				],
				2024: [
					10,
					4,
					10,
					4
				],
				2025: [
					5,
					30,
					5,
					30
				],
				2026: [
					5,
					15,
					5,
					15
				],
				2027: [
					5,
					7,
					5,
					7
				],
				2028: [
					10,
					30,
					10,
					30
				],
				2029: [
					5,
					11,
					5,
					11
				],
				2030: [
					5,
					31,
					5,
					31
				]
			}
		] },
		Bremen: { SH: [
			{
				name: "Winterferien",
				2012: [
					1,
					30,
					1,
					31
				],
				2013: [
					1,
					31,
					2,
					1
				],
				2014: [
					1,
					30,
					1,
					31
				],
				2015: [
					2,
					2,
					2,
					3
				],
				2016: [
					1,
					28,
					1,
					29
				],
				2017: [
					1,
					30,
					1,
					31
				],
				2018: [
					2,
					1,
					2,
					2
				],
				2019: [
					1,
					31,
					2,
					1
				]
			},
			{
				name: "Halbjahresferien",
				2021: [
					2,
					1,
					2,
					2
				],
				2022: [
					1,
					31,
					2,
					1
				],
				2023: [
					1,
					30,
					1,
					31
				],
				2024: [
					2,
					1,
					2,
					2
				],
				2025: [
					2,
					3,
					2,
					4
				],
				2026: [
					2,
					2,
					2,
					3
				],
				2027: [
					2,
					1,
					2,
					2
				],
				2028: [
					1,
					31,
					2,
					1
				],
				2029: [
					2,
					1,
					2,
					2
				],
				2030: [
					1,
					31,
					2,
					1
				]
			},
			{
				name: "Osterferien",
				2012: [
					4,
					30,
					4,
					30
				],
				2013: [
					3,
					16,
					4,
					2
				],
				2014: [
					5,
					2,
					5,
					2
				],
				2015: [
					3,
					25,
					4,
					10
				],
				2016: [
					3,
					18,
					4,
					2
				],
				2017: [
					4,
					10,
					4,
					22
				],
				2018: [
					3,
					19,
					4,
					3
				],
				2019: [
					4,
					6,
					4,
					23
				],
				2021: [
					3,
					27,
					4,
					10
				],
				2022: [
					4,
					4,
					4,
					19
				],
				2023: [
					3,
					27,
					4,
					11
				],
				2024: [
					3,
					18,
					3,
					28
				],
				2025: [
					4,
					7,
					4,
					19
				],
				2026: [
					3,
					23,
					4,
					7
				],
				2027: [
					3,
					22,
					4,
					3
				],
				2028: [
					4,
					10,
					4,
					22
				],
				2029: [
					3,
					19,
					4,
					3
				],
				2030: [
					4,
					8,
					4,
					23
				]
			},
			{
				name: "Kirchentag und Tag nach dem 1. Mai",
				2025: [
					4,
					30,
					5,
					2
				]
			},
			{
				name: "Pfingstferien",
				2012: [
					5,
					29,
					5,
					29
				],
				2013: [
					5,
					21,
					5,
					21
				],
				2014: [
					6,
					10,
					6,
					10
				],
				2015: [
					5,
					26,
					5,
					26
				],
				2016: [
					5,
					17,
					5,
					17
				],
				2017: [
					6,
					6,
					6,
					6
				],
				2018: [
					5,
					22,
					5,
					22
				],
				2019: [
					6,
					11,
					6,
					11
				],
				2021: [
					5,
					25,
					5,
					25
				],
				2022: [
					6,
					7,
					6,
					7
				],
				2023: [
					5,
					30,
					5,
					30
				],
				2024: [
					5,
					21,
					5,
					21
				],
				2025: [
					6,
					10,
					6,
					10
				],
				2026: [
					5,
					26,
					5,
					26
				],
				2027: [
					5,
					18,
					5,
					18
				],
				2028: [
					6,
					6,
					6,
					6
				],
				2029: [
					5,
					22,
					5,
					22
				],
				2030: [
					6,
					11,
					6,
					11
				]
			},
			{
				name: "Tag nach Himmelfahrt",
				2021: [
					5,
					14,
					5,
					14
				],
				2022: [
					5,
					27,
					5,
					27
				],
				2023: [
					5,
					19,
					5,
					19
				],
				2024: [
					5,
					10,
					5,
					10
				],
				2025: [
					5,
					30,
					5,
					30
				],
				2026: [
					5,
					15,
					5,
					15
				],
				2027: [
					5,
					7,
					5,
					7
				],
				2028: [
					5,
					26,
					5,
					26
				],
				2029: [
					5,
					11,
					5,
					11
				],
				2030: [
					5,
					31,
					5,
					31
				]
			},
			{
				name: "Sommerferien",
				2012: [
					7,
					23,
					8,
					31
				],
				2013: [
					6,
					27,
					8,
					7
				],
				2014: [
					7,
					31,
					9,
					10
				],
				2015: [
					7,
					23,
					9,
					2
				],
				2016: [
					6,
					23,
					8,
					3
				],
				2017: [
					6,
					22,
					8,
					2
				],
				2018: [
					6,
					28,
					8,
					8
				],
				2019: [
					7,
					4,
					8,
					14
				],
				2020: [
					7,
					16,
					8,
					26
				],
				2021: [
					7,
					22,
					9,
					1
				],
				2022: [
					7,
					14,
					8,
					24
				],
				2023: [
					7,
					6,
					8,
					16
				],
				2024: [
					6,
					24,
					8,
					2
				],
				2025: [
					7,
					3,
					8,
					13
				],
				2026: [
					7,
					2,
					8,
					12
				],
				2027: [
					7,
					8,
					8,
					18
				],
				2028: [
					7,
					20,
					8,
					30
				],
				2029: [
					7,
					19,
					8,
					29
				],
				2030: [
					7,
					11,
					8,
					21
				]
			},
			{
				name: "Tag vor dem 3. Oktober",
				2023: [
					10,
					2,
					10,
					2
				],
				2028: [
					10,
					2,
					10,
					2
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					22,
					11,
					3
				],
				2013: [
					10,
					4,
					10,
					18
				],
				2014: [
					10,
					27,
					11,
					8
				],
				2015: [
					10,
					19,
					10,
					31
				],
				2016: [
					10,
					4,
					10,
					15
				],
				2017: [
					10,
					30,
					10,
					30
				],
				2018: [
					10,
					1,
					10,
					13
				],
				2019: [
					10,
					4,
					10,
					18
				],
				2020: [
					10,
					12,
					10,
					24
				],
				2021: [
					10,
					18,
					10,
					30
				],
				2022: [
					10,
					17,
					10,
					29
				],
				2023: [
					10,
					16,
					10,
					30
				],
				2024: [
					10,
					4,
					10,
					19
				],
				2025: [
					10,
					13,
					10,
					25
				],
				2026: [
					10,
					12,
					10,
					24
				],
				2027: [
					10,
					18,
					10,
					30
				],
				2028: [
					10,
					23,
					11,
					4
				],
				2029: [
					10,
					22,
					11,
					2
				]
			},
			{
				name: "Tag nach dem Reformationstag",
				2024: [
					11,
					1,
					11,
					1
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					23,
					1,
					4
				],
				2012: [
					12,
					24,
					1,
					5
				],
				2013: [
					12,
					23,
					1,
					3
				],
				2014: [
					12,
					22,
					1,
					5
				],
				2015: [
					12,
					23,
					1,
					6
				],
				2016: [
					12,
					21,
					1,
					6
				],
				2017: [
					12,
					22,
					1,
					6
				],
				2018: [
					12,
					24,
					1,
					4
				],
				2019: [
					12,
					21,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					8
				],
				2021: [
					12,
					23,
					1,
					8
				],
				2022: [
					12,
					23,
					1,
					6
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					4
				],
				2025: [
					12,
					22,
					1,
					5
				],
				2026: [
					12,
					23,
					1,
					9
				],
				2027: [
					12,
					23,
					1,
					8
				],
				2028: [
					12,
					27,
					1,
					6
				],
				2029: [
					12,
					21,
					1,
					5
				]
			},
			{
				name: "Tag vor dem 1. Mai",
				2029: [
					4,
					30,
					4,
					30
				]
			},
			{
				name: "Tage nach dem 3. Oktober",
				2029: [
					10,
					4,
					10,
					5
				]
			}
		] },
		Hamburg: { SH: [
			{
				name: "Winterferien",
				2012: [
					1,
					30,
					1,
					30
				],
				2013: [
					2,
					1,
					2,
					1
				],
				2014: [
					1,
					31,
					1,
					31
				],
				2015: [
					1,
					30,
					1,
					30
				],
				2016: [
					1,
					29,
					1,
					29
				],
				2017: [
					1,
					30,
					1,
					30
				],
				2018: [
					2,
					2,
					2,
					2
				],
				2019: [
					2,
					1,
					2,
					1
				]
			},
			{
				name: "Osterferien",
				2012: [
					3,
					5,
					3,
					16
				],
				2013: [
					3,
					4,
					3,
					15
				],
				2014: [
					3,
					3,
					3,
					14
				],
				2015: [
					3,
					2,
					3,
					13
				],
				2016: [
					3,
					7,
					3,
					18
				],
				2017: [
					3,
					6,
					3,
					17
				],
				2018: [
					4,
					30,
					4,
					30
				],
				2019: [
					3,
					4,
					3,
					15
				]
			},
			{
				name: "Pfingstferien",
				2012: [
					5,
					18,
					5,
					18
				],
				2013: [
					5,
					2,
					5,
					10
				],
				2014: [
					5,
					30,
					5,
					30
				],
				2015: [
					5,
					11,
					5,
					15
				],
				2016: [
					5,
					17,
					5,
					20
				],
				2017: [
					5,
					22,
					5,
					26
				],
				2018: [
					5,
					7,
					5,
					11
				],
				2019: [
					5,
					31,
					5,
					31
				],
				2020: [
					5,
					18,
					5,
					22
				],
				2021: [
					5,
					10,
					5,
					14
				],
				2022: [
					5,
					23,
					5,
					27
				],
				2023: [
					5,
					15,
					5,
					19
				],
				2024: [
					5,
					21,
					5,
					24
				],
				2025: [
					5,
					26,
					5,
					30
				],
				2026: [
					5,
					11,
					5,
					15
				],
				2027: [
					5,
					7,
					5,
					14
				],
				2028: [
					5,
					22,
					5,
					26
				],
				2029: [
					5,
					11,
					5,
					18
				],
				2030: [
					5,
					20,
					5,
					24
				]
			},
			{
				name: "Sommerferien",
				2012: [
					6,
					21,
					8,
					1
				],
				2013: [
					6,
					20,
					7,
					31
				],
				2014: [
					7,
					10,
					8,
					20
				],
				2015: [
					7,
					16,
					8,
					26
				],
				2016: [
					7,
					21,
					8,
					31
				],
				2017: [
					7,
					20,
					8,
					30
				],
				2018: [
					7,
					5,
					8,
					15
				],
				2019: [
					6,
					27,
					8,
					7
				],
				2020: [
					6,
					25,
					8,
					5
				],
				2021: [
					6,
					24,
					8,
					4
				],
				2022: [
					7,
					7,
					8,
					17
				],
				2023: [
					7,
					13,
					8,
					23
				],
				2024: [
					7,
					18,
					8,
					28
				],
				2025: [
					7,
					24,
					9,
					3
				],
				2026: [
					7,
					9,
					8,
					19
				],
				2027: [
					7,
					1,
					8,
					11
				],
				2028: [
					7,
					3,
					8,
					11
				],
				2029: [
					7,
					2,
					8,
					10
				],
				2030: [
					7,
					4,
					8,
					14
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					1,
					10,
					12
				],
				2013: [
					9,
					30,
					10,
					11
				],
				2014: [
					10,
					13,
					10,
					24
				],
				2015: [
					10,
					19,
					10,
					30
				],
				2016: [
					10,
					17,
					10,
					28
				],
				2017: [
					10,
					16,
					10,
					27
				],
				2018: [
					10,
					1,
					10,
					12
				],
				2019: [
					10,
					4,
					10,
					18
				],
				2020: [
					10,
					5,
					10,
					16
				],
				2021: [
					10,
					4,
					10,
					15
				],
				2022: [
					10,
					10,
					10,
					21
				],
				2023: [
					10,
					16,
					10,
					27
				],
				2024: [
					10,
					21,
					11,
					1
				],
				2025: [
					10,
					20,
					10,
					31
				],
				2026: [
					10,
					19,
					10,
					30
				],
				2027: [
					10,
					11,
					10,
					22
				],
				2028: [
					10,
					2,
					10,
					13
				],
				2029: [
					10,
					1,
					10,
					12
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					27,
					1,
					6
				],
				2012: [
					12,
					21,
					1,
					4
				],
				2013: [
					12,
					19,
					1,
					3
				],
				2014: [
					12,
					22,
					1,
					6
				],
				2015: [
					12,
					21,
					1,
					1
				],
				2016: [
					12,
					27,
					1,
					6
				],
				2017: [
					12,
					22,
					1,
					5
				],
				2018: [
					12,
					20,
					1,
					4
				],
				2019: [
					12,
					20,
					1,
					3
				],
				2020: [
					12,
					21,
					1,
					4
				],
				2021: [
					12,
					23,
					1,
					4
				],
				2022: [
					12,
					23,
					1,
					6
				],
				2023: [
					12,
					22,
					1,
					5
				],
				2024: [
					12,
					20,
					1,
					3
				],
				2025: [
					12,
					17,
					1,
					2
				],
				2026: [
					12,
					21,
					1,
					1
				],
				2027: [
					12,
					20,
					12,
					31
				],
				2028: [
					12,
					18,
					12,
					29
				],
				2029: [
					12,
					21,
					1,
					4
				]
			},
			{
				name: "Halbjahrespause",
				2020: [
					1,
					31,
					1,
					31
				],
				2021: [
					1,
					29,
					1,
					29
				],
				2022: [
					1,
					28,
					1,
					28
				],
				2023: [
					1,
					27,
					1,
					27
				],
				2024: [
					2,
					2,
					2,
					2
				],
				2025: [
					1,
					31,
					1,
					31
				],
				2026: [
					1,
					30,
					1,
					30
				],
				2027: [
					1,
					29,
					1,
					29
				],
				2028: [
					1,
					28,
					1,
					28
				],
				2029: [
					2,
					2,
					2,
					2
				],
				2030: [
					2,
					1,
					2,
					1
				]
			},
			{
				name: "Frühjahrsferien",
				2020: [
					3,
					2,
					3,
					13
				],
				2021: [
					3,
					1,
					3,
					12
				],
				2022: [
					3,
					7,
					3,
					18
				],
				2023: [
					3,
					6,
					3,
					17
				],
				2024: [
					3,
					18,
					3,
					28
				],
				2025: [
					3,
					10,
					3,
					21
				],
				2026: [
					3,
					2,
					3,
					13
				],
				2027: [
					3,
					1,
					3,
					12
				],
				2028: [
					3,
					6,
					3,
					17
				],
				2029: [
					3,
					5,
					3,
					16
				],
				2030: [
					3,
					4,
					3,
					15
				]
			},
			{
				name: "Brückentag",
				2023: [
					10,
					2,
					10,
					2
				],
				2024: [
					10,
					4,
					10,
					4
				],
				2025: [
					5,
					2,
					5,
					2
				],
				2028: [
					10,
					30,
					10,
					30
				],
				2030: [
					5,
					31,
					5,
					31
				]
			}
		] },
		Hessen: { SH: [
			{
				name: "Osterferien",
				2012: [
					4,
					2,
					4,
					14
				],
				2013: [
					3,
					25,
					4,
					6
				],
				2014: [
					4,
					14,
					4,
					26
				],
				2015: [
					3,
					30,
					4,
					11
				],
				2016: [
					3,
					29,
					4,
					9
				],
				2017: [
					4,
					3,
					4,
					15
				],
				2018: [
					3,
					26,
					4,
					7
				],
				2019: [
					4,
					14,
					4,
					27
				],
				2020: [
					4,
					6,
					4,
					18
				],
				2021: [
					4,
					6,
					4,
					16
				],
				2022: [
					4,
					11,
					4,
					23
				],
				2023: [
					4,
					3,
					4,
					22
				],
				2024: [
					3,
					25,
					4,
					13
				],
				2025: [
					4,
					7,
					4,
					21
				],
				2026: [
					3,
					30,
					4,
					10
				],
				2027: [
					3,
					22,
					4,
					2
				],
				2028: [
					4,
					3,
					4,
					14
				],
				2029: [
					3,
					29,
					4,
					13
				],
				2030: [
					4,
					8,
					4,
					22
				]
			},
			{
				name: "Sommerferien",
				2012: [
					7,
					2,
					8,
					10
				],
				2013: [
					7,
					8,
					8,
					16
				],
				2014: [
					7,
					28,
					9,
					5
				],
				2015: [
					7,
					27,
					9,
					4
				],
				2016: [
					7,
					18,
					8,
					26
				],
				2017: [
					7,
					3,
					8,
					11
				],
				2018: [
					6,
					25,
					8,
					3
				],
				2019: [
					7,
					1,
					8,
					9
				],
				2020: [
					7,
					6,
					8,
					14
				],
				2021: [
					7,
					19,
					8,
					27
				],
				2022: [
					7,
					25,
					9,
					2
				],
				2023: [
					7,
					24,
					9,
					1
				],
				2024: [
					7,
					15,
					8,
					23
				],
				2025: [
					7,
					7,
					8,
					15
				],
				2026: [
					6,
					29,
					8,
					7
				],
				2027: [
					6,
					28,
					8,
					6
				],
				2028: [
					7,
					3,
					8,
					11
				],
				2029: [
					7,
					16,
					8,
					24
				],
				2030: [
					7,
					22,
					8,
					30
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					15,
					10,
					27
				],
				2013: [
					10,
					14,
					10,
					26
				],
				2014: [
					10,
					20,
					11,
					1
				],
				2015: [
					10,
					19,
					10,
					31
				],
				2016: [
					10,
					17,
					10,
					29
				],
				2017: [
					10,
					9,
					10,
					21
				],
				2018: [
					10,
					1,
					10,
					13
				],
				2019: [
					9,
					30,
					10,
					12
				],
				2020: [
					10,
					5,
					10,
					17
				],
				2021: [
					10,
					11,
					10,
					23
				],
				2022: [
					10,
					24,
					10,
					29
				],
				2023: [
					10,
					23,
					10,
					28
				],
				2024: [
					10,
					14,
					10,
					25
				],
				2025: [
					10,
					6,
					10,
					18
				],
				2026: [
					10,
					5,
					10,
					17
				],
				2027: [
					10,
					4,
					10,
					16
				],
				2028: [
					10,
					9,
					10,
					20
				],
				2029: [
					10,
					15,
					10,
					26
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					21,
					1,
					6
				],
				2012: [
					12,
					24,
					1,
					12
				],
				2013: [
					12,
					23,
					1,
					11
				],
				2014: [
					12,
					22,
					1,
					10
				],
				2015: [
					12,
					23,
					1,
					9
				],
				2016: [
					12,
					22,
					1,
					7
				],
				2017: [
					12,
					24,
					1,
					13
				],
				2018: [
					12,
					24,
					1,
					12
				],
				2019: [
					12,
					23,
					1,
					11
				],
				2020: [
					12,
					21,
					1,
					9
				],
				2021: [
					12,
					23,
					1,
					8
				],
				2022: [
					12,
					22,
					1,
					7
				],
				2023: [
					12,
					27,
					1,
					13
				],
				2024: [
					12,
					23,
					1,
					10
				],
				2025: [
					12,
					22,
					1,
					10
				],
				2026: [
					12,
					23,
					1,
					12
				],
				2027: [
					12,
					23,
					1,
					11
				],
				2028: [
					12,
					27,
					1,
					12
				],
				2029: [
					12,
					24,
					1,
					11
				]
			}
		] },
		"MV-ABS": { SH: [
			{
				name: "Winterferien",
				2012: [
					2,
					6,
					2,
					17
				],
				2013: [
					2,
					4,
					2,
					15
				],
				2014: [
					2,
					3,
					2,
					15
				],
				2015: [
					2,
					2,
					2,
					14
				],
				2016: [
					2,
					1,
					2,
					13
				],
				2017: [
					2,
					6,
					2,
					18
				],
				2018: [
					2,
					5,
					2,
					16
				],
				2019: [
					2,
					4,
					2,
					15
				],
				2020: [
					2,
					10,
					2,
					21
				],
				2021: [
					2,
					6,
					2,
					18
				],
				2022: [
					2,
					5,
					2,
					17
				],
				2023: [
					2,
					6,
					2,
					18
				],
				2024: [
					2,
					5,
					2,
					16
				],
				2025: [
					2,
					3,
					2,
					14
				],
				2026: [
					2,
					9,
					2,
					20
				],
				2027: [
					2,
					8,
					2,
					19
				],
				2028: [
					2,
					5,
					2,
					17
				],
				2029: [
					2,
					5,
					2,
					16
				],
				2030: [
					2,
					4,
					2,
					15
				]
			},
			{
				name: "Osterferien",
				2012: [
					4,
					2,
					4,
					11
				],
				2013: [
					3,
					25,
					4,
					3
				],
				2014: [
					4,
					14,
					4,
					23
				],
				2015: [
					3,
					30,
					4,
					8
				],
				2016: [
					3,
					21,
					3,
					30
				],
				2017: [
					4,
					10,
					4,
					19
				],
				2018: [
					3,
					26,
					4,
					4
				],
				2019: [
					4,
					15,
					4,
					24
				],
				2020: [
					4,
					6,
					4,
					15
				],
				2021: [
					3,
					29,
					4,
					7
				],
				2022: [
					4,
					11,
					4,
					20
				],
				2023: [
					4,
					3,
					4,
					12
				],
				2024: [
					3,
					25,
					4,
					3
				],
				2025: [
					4,
					14,
					4,
					23
				],
				2026: [
					3,
					30,
					4,
					8
				],
				2027: [
					3,
					24,
					4,
					2
				],
				2028: [
					4,
					12,
					4,
					21
				],
				2029: [
					3,
					28,
					4,
					6
				],
				2030: [
					4,
					17,
					4,
					26
				]
			},
			{
				name: "Pfingstferien",
				2012: [
					5,
					25,
					5,
					29
				],
				2013: [
					5,
					17,
					5,
					21
				],
				2014: [
					6,
					6,
					6,
					10
				],
				2015: [
					5,
					22,
					5,
					26
				],
				2016: [
					5,
					14,
					5,
					17
				],
				2017: [
					6,
					2,
					6,
					6
				],
				2018: [
					5,
					18,
					5,
					22
				],
				2019: [
					6,
					7,
					6,
					11
				],
				2020: [
					5,
					29,
					6,
					2
				],
				2021: [
					5,
					21,
					5,
					25
				],
				2022: [
					6,
					3,
					6,
					7
				],
				2023: [
					5,
					26,
					5,
					30
				],
				2024: [
					5,
					17,
					5,
					21
				],
				2025: [
					6,
					6,
					6,
					10
				],
				2026: [
					5,
					22,
					5,
					26
				],
				2027: [
					5,
					14,
					5,
					18
				],
				2028: [
					6,
					2,
					6,
					6
				],
				2029: [
					5,
					18,
					5,
					22
				],
				2030: [
					6,
					7,
					6,
					11
				]
			},
			{
				name: "Sommerferien",
				2012: [
					6,
					23,
					8,
					4
				],
				2013: [
					6,
					22,
					8,
					3
				],
				2014: [
					7,
					14,
					8,
					23
				],
				2015: [
					7,
					20,
					8,
					29
				],
				2016: [
					7,
					25,
					9,
					3
				],
				2017: [
					7,
					24,
					9,
					2
				],
				2018: [
					7,
					9,
					8,
					18
				],
				2019: [
					7,
					1,
					8,
					10
				],
				2020: [
					6,
					22,
					8,
					1
				],
				2021: [
					6,
					21,
					7,
					31
				],
				2022: [
					7,
					4,
					8,
					13
				],
				2023: [
					7,
					17,
					8,
					26
				],
				2024: [
					7,
					22,
					8,
					31
				],
				2025: [
					7,
					28,
					9,
					6
				],
				2026: [
					7,
					13,
					8,
					22
				],
				2027: [
					7,
					5,
					8,
					14
				],
				2028: [
					6,
					26,
					8,
					5
				],
				2029: [
					6,
					18,
					7,
					28
				],
				2030: [
					7,
					1,
					8,
					10
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					1,
					10,
					5
				],
				2013: [
					10,
					14,
					10,
					19
				],
				2014: [
					10,
					20,
					10,
					25
				],
				2015: [
					10,
					24,
					10,
					30
				],
				2016: [
					10,
					24,
					10,
					28
				],
				2017: [
					10,
					23,
					10,
					30
				],
				2018: [
					11,
					1,
					11,
					2
				],
				2019: [
					11,
					1,
					11,
					1
				],
				2020: [
					10,
					5,
					10,
					10
				],
				2021: [
					10,
					2,
					10,
					9
				],
				2022: [
					10,
					10,
					10,
					14
				],
				2023: [
					10,
					9,
					10,
					14
				],
				2024: [
					10,
					21,
					10,
					26
				],
				2025: [
					10,
					20,
					10,
					24
				],
				2026: [
					10,
					15,
					10,
					24
				],
				2027: [
					10,
					14,
					10,
					23
				],
				2028: [
					10,
					23,
					10,
					28
				],
				2029: [
					10,
					22,
					10,
					27
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					23,
					1,
					3
				],
				2012: [
					12,
					21,
					1,
					4
				],
				2013: [
					12,
					23,
					1,
					3
				],
				2014: [
					12,
					22,
					1,
					2
				],
				2015: [
					12,
					21,
					1,
					2
				],
				2016: [
					12,
					22,
					1,
					2
				],
				2017: [
					12,
					21,
					1,
					3
				],
				2018: [
					12,
					24,
					1,
					5
				],
				2019: [
					12,
					23,
					1,
					4
				],
				2020: [
					12,
					21,
					1,
					2
				],
				2021: [
					12,
					22,
					12,
					31
				],
				2022: [
					12,
					22,
					1,
					2
				],
				2023: [
					12,
					21,
					1,
					3
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					20,
					1,
					3
				],
				2026: [
					12,
					21,
					1,
					2
				],
				2027: [
					12,
					22,
					1,
					4
				],
				2028: [
					12,
					22,
					1,
					2
				],
				2029: [
					12,
					21,
					1,
					4
				]
			},
			{
				name: "Zusätzlicher Ferientag",
				2020: [
					11,
					3,
					11,
					3
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					11,
					2,
					11,
					2
				],
				2023: [
					11,
					1,
					11,
					1
				],
				2024: [
					11,
					1,
					11,
					1
				],
				2025: [
					11,
					3,
					11,
					3
				],
				2026: [
					11,
					27,
					11,
					27
				],
				2027: [
					11,
					26,
					11,
					26
				],
				2028: [
					10,
					30,
					10,
					30
				],
				2029: [
					10,
					30,
					10,
					30
				],
				2030: [
					5,
					31,
					5,
					31
				]
			},
			{
				name: "Schulfrei",
				2021: [
					2,
					19,
					2,
					19
				],
				2022: [
					2,
					18,
					2,
					18
				],
				2028: [
					2,
					18,
					2,
					18
				]
			}
		] },
		"MV-BBS": { SH: [
			{
				name: "Winterferien",
				2020: [
					2,
					10,
					2,
					15
				],
				2021: [
					2,
					5,
					2,
					13
				],
				2022: [
					2,
					5,
					2,
					12
				],
				2023: [
					2,
					6,
					2,
					11
				],
				2024: [
					2,
					5,
					2,
					10
				],
				2025: [
					2,
					3,
					2,
					8
				],
				2026: [
					2,
					9,
					2,
					14
				],
				2027: [
					2,
					8,
					2,
					13
				],
				2028: [
					2,
					5,
					2,
					12
				],
				2029: [
					2,
					5,
					2,
					10
				],
				2030: [
					2,
					4,
					2,
					9
				]
			},
			{
				name: "Osterferien",
				2020: [
					4,
					6,
					4,
					17
				],
				2021: [
					3,
					29,
					4,
					9
				],
				2022: [
					4,
					11,
					4,
					22
				],
				2023: [
					4,
					3,
					4,
					15
				],
				2024: [
					3,
					25,
					4,
					5
				],
				2025: [
					4,
					14,
					4,
					25
				],
				2026: [
					3,
					30,
					4,
					10
				],
				2027: [
					3,
					22,
					4,
					2
				],
				2028: [
					4,
					12,
					4,
					21
				],
				2029: [
					3,
					28,
					4,
					6
				],
				2030: [
					4,
					17,
					4,
					26
				]
			},
			{
				name: "Sommerferien",
				2020: [
					7,
					13,
					8,
					29
				],
				2021: [
					7,
					12,
					8,
					28
				],
				2022: [
					7,
					11,
					8,
					27
				],
				2023: [
					7,
					17,
					9,
					1
				],
				2024: [
					7,
					15,
					8,
					31
				],
				2025: [
					7,
					14,
					8,
					30
				],
				2026: [
					7,
					13,
					8,
					29
				],
				2027: [
					7,
					12,
					8,
					28
				],
				2028: [
					7,
					17,
					9,
					2
				],
				2029: [
					7,
					16,
					9,
					1
				],
				2030: [
					7,
					15,
					8,
					31
				]
			},
			{
				name: "Herbstferien",
				2020: [
					10,
					5,
					10,
					10
				],
				2021: [
					10,
					2,
					10,
					9
				],
				2022: [
					10,
					10,
					10,
					15
				],
				2023: [
					10,
					9,
					10,
					14
				],
				2024: [
					10,
					21,
					10,
					26
				],
				2025: [
					10,
					20,
					10,
					25
				],
				2026: [
					10,
					19,
					10,
					24
				],
				2027: [
					10,
					16,
					10,
					23
				],
				2028: [
					10,
					23,
					10,
					28
				],
				2029: [
					10,
					22,
					10,
					27
				]
			},
			{
				name: "Weihnachtsferien",
				2019: [
					12,
					23,
					1,
					4
				],
				2020: [
					12,
					21,
					1,
					2
				],
				2021: [
					12,
					22,
					1,
					3
				],
				2022: [
					12,
					22,
					1,
					2
				],
				2023: [
					12,
					21,
					1,
					3
				],
				2024: [
					12,
					23,
					1,
					4
				],
				2025: [
					12,
					22,
					1,
					3
				],
				2026: [
					12,
					19,
					1,
					2
				],
				2027: [
					12,
					22,
					12,
					31
				],
				2028: [
					12,
					21,
					1,
					2
				],
				2029: [
					12,
					21,
					1,
					4
				]
			},
			{
				name: "Zusätzlicher Ferientag",
				2020: [
					5,
					22,
					5,
					22
				],
				2021: [
					5,
					14,
					5,
					14
				],
				2022: [
					10,
					28,
					10,
					28
				],
				2023: [
					10,
					30,
					10,
					30
				],
				2024: [
					11,
					1,
					11,
					1
				],
				2025: [
					11,
					3,
					11,
					3
				],
				2026: [
					11,
					27,
					11,
					27
				],
				2027: [
					11,
					26,
					11,
					26
				],
				2028: [
					10,
					30,
					10,
					30
				],
				2029: [
					10,
					30,
					10,
					30
				],
				2030: [
					5,
					31,
					5,
					31
				]
			}
		] },
		Niedersachsen: { SH: [
			{
				name: "Winterferien",
				2012: [
					1,
					30,
					1,
					31
				],
				2013: [
					1,
					31,
					2,
					1
				],
				2014: [
					1,
					30,
					1,
					31
				],
				2015: [
					2,
					2,
					2,
					3
				],
				2016: [
					1,
					28,
					1,
					29
				],
				2017: [
					1,
					30,
					1,
					31
				],
				2018: [
					2,
					1,
					2,
					2
				],
				2019: [
					1,
					31,
					2,
					1
				]
			},
			{
				name: "Halbjahresferien",
				2020: [
					2,
					3,
					2,
					4
				],
				2021: [
					2,
					1,
					2,
					2
				],
				2022: [
					1,
					31,
					2,
					1
				],
				2023: [
					1,
					30,
					1,
					31
				],
				2024: [
					2,
					1,
					2,
					2
				],
				2025: [
					2,
					3,
					2,
					4
				],
				2026: [
					2,
					2,
					2,
					3
				],
				2027: [
					2,
					1,
					2,
					2
				],
				2028: [
					1,
					31,
					2,
					1
				],
				2029: [
					2,
					1,
					2,
					2
				],
				2030: [
					1,
					31,
					2,
					1
				]
			},
			{
				name: "Osterferien",
				2012: [
					4,
					30,
					4,
					30
				],
				2013: [
					3,
					16,
					4,
					2
				],
				2014: [
					5,
					2,
					5,
					2
				],
				2015: [
					3,
					25,
					4,
					10
				],
				2016: [
					3,
					18,
					4,
					2
				],
				2017: [
					4,
					10,
					4,
					22
				],
				2018: [
					3,
					19,
					4,
					3
				],
				2019: [
					4,
					8,
					4,
					23
				],
				2020: [
					3,
					30,
					4,
					14
				],
				2021: [
					3,
					29,
					4,
					9
				],
				2022: [
					4,
					4,
					4,
					19
				],
				2023: [
					3,
					27,
					4,
					11
				],
				2024: [
					3,
					18,
					3,
					28
				],
				2025: [
					4,
					7,
					4,
					19
				],
				2026: [
					3,
					23,
					4,
					7
				],
				2027: [
					3,
					22,
					4,
					3
				],
				2028: [
					4,
					10,
					4,
					22
				],
				2029: [
					3,
					19,
					4,
					3
				],
				2030: [
					4,
					8,
					4,
					23
				]
			},
			{
				name: "Pfingstferien",
				2012: [
					5,
					29,
					5,
					29
				],
				2013: [
					5,
					21,
					5,
					21
				],
				2014: [
					6,
					10,
					6,
					10
				],
				2015: [
					5,
					26,
					5,
					26
				],
				2016: [
					5,
					17,
					5,
					17
				],
				2017: [
					6,
					6,
					6,
					6
				],
				2018: [
					5,
					22,
					5,
					22
				],
				2019: [
					6,
					11,
					6,
					11
				],
				2020: [
					6,
					2,
					6,
					2
				],
				2021: [
					5,
					25,
					5,
					25
				],
				2022: [
					6,
					7,
					6,
					7
				],
				2023: [
					5,
					30,
					5,
					30
				],
				2024: [
					5,
					21,
					5,
					21
				],
				2025: [
					6,
					10,
					6,
					10
				],
				2026: [
					5,
					26,
					5,
					26
				],
				2027: [
					5,
					18,
					5,
					18
				],
				2028: [
					6,
					6,
					6,
					6
				],
				2029: [
					5,
					22,
					5,
					22
				],
				2030: [
					6,
					11,
					6,
					11
				]
			},
			{
				name: "Tag nach Himmelfahrt",
				2020: [
					5,
					22,
					5,
					22
				],
				2021: [
					5,
					14,
					5,
					14
				],
				2022: [
					5,
					27,
					5,
					27
				],
				2023: [
					5,
					19,
					5,
					19
				],
				2024: [
					5,
					10,
					5,
					10
				],
				2025: [
					5,
					30,
					5,
					30
				],
				2026: [
					5,
					15,
					5,
					15
				],
				2027: [
					5,
					7,
					5,
					7
				],
				2028: [
					5,
					26,
					5,
					26
				],
				2029: [
					5,
					11,
					5,
					11
				],
				2030: [
					5,
					31,
					5,
					31
				]
			},
			{
				name: "Sommerferien",
				2012: [
					7,
					23,
					8,
					31
				],
				2013: [
					6,
					27,
					8,
					7
				],
				2014: [
					7,
					31,
					9,
					10
				],
				2015: [
					7,
					23,
					9,
					2
				],
				2016: [
					6,
					23,
					8,
					3
				],
				2017: [
					6,
					22,
					8,
					2
				],
				2018: [
					6,
					28,
					8,
					8
				],
				2019: [
					7,
					4,
					8,
					14
				],
				2020: [
					7,
					16,
					8,
					26
				],
				2021: [
					7,
					22,
					9,
					1
				],
				2022: [
					7,
					14,
					8,
					24
				],
				2023: [
					7,
					6,
					8,
					16
				],
				2024: [
					6,
					24,
					8,
					3
				],
				2025: [
					7,
					3,
					8,
					13
				],
				2026: [
					7,
					2,
					8,
					12
				],
				2027: [
					7,
					8,
					8,
					18
				],
				2028: [
					7,
					20,
					8,
					30
				],
				2029: [
					7,
					19,
					8,
					29
				],
				2030: [
					7,
					11,
					8,
					21
				]
			},
			{
				name: "Tag vor dem 3. Oktober",
				2023: [
					10,
					2,
					10,
					2
				],
				2028: [
					10,
					2,
					10,
					2
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					22,
					11,
					3
				],
				2013: [
					10,
					4,
					10,
					18
				],
				2014: [
					10,
					27,
					11,
					8
				],
				2015: [
					10,
					19,
					10,
					31
				],
				2016: [
					10,
					4,
					10,
					15
				],
				2017: [
					10,
					30,
					10,
					30
				],
				2018: [
					10,
					1,
					10,
					12
				],
				2019: [
					10,
					4,
					10,
					18
				],
				2020: [
					10,
					12,
					10,
					23
				],
				2021: [
					10,
					18,
					10,
					29
				],
				2022: [
					10,
					17,
					10,
					28
				],
				2023: [
					10,
					16,
					10,
					30
				],
				2024: [
					10,
					4,
					10,
					19
				],
				2025: [
					10,
					13,
					10,
					25
				],
				2026: [
					10,
					12,
					10,
					24
				],
				2027: [
					10,
					16,
					10,
					30
				],
				2028: [
					10,
					23,
					11,
					4
				],
				2029: [
					10,
					22,
					11,
					2
				]
			},
			{
				name: "Tag nach dem Reformationstag",
				2024: [
					11,
					1,
					11,
					1
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					23,
					1,
					4
				],
				2012: [
					12,
					24,
					1,
					5
				],
				2013: [
					12,
					23,
					1,
					3
				],
				2014: [
					12,
					22,
					1,
					5
				],
				2015: [
					12,
					23,
					1,
					6
				],
				2016: [
					12,
					21,
					1,
					6
				],
				2017: [
					12,
					22,
					1,
					5
				],
				2018: [
					12,
					24,
					1,
					4
				],
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					8
				],
				2021: [
					12,
					23,
					1,
					7
				],
				2022: [
					12,
					23,
					1,
					6
				],
				2023: [
					12,
					27,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					4
				],
				2025: [
					12,
					22,
					1,
					5
				],
				2026: [
					12,
					23,
					1,
					9
				],
				2027: [
					12,
					23,
					1,
					8
				],
				2028: [
					12,
					27,
					1,
					6
				],
				2029: [
					12,
					21,
					1,
					5
				]
			},
			{
				name: "Kirchentag",
				2025: [
					4,
					30,
					4,
					30
				]
			},
			{
				name: "Tag nach dem 1. Mai",
				2025: [
					5,
					2,
					5,
					2
				]
			},
			{
				name: "Tag vor dem 1. Mai",
				2029: [
					4,
					30,
					4,
					30
				]
			},
			{
				name: "Tage nach dem 3. Oktober",
				2029: [
					10,
					4,
					10,
					5
				]
			}
		] },
		"Nordrhein-Westfalen": { SH: [
			{
				name: "Osterferien",
				2012: [
					4,
					2,
					4,
					14
				],
				2013: [
					3,
					25,
					4,
					6
				],
				2014: [
					4,
					14,
					4,
					26
				],
				2015: [
					3,
					30,
					4,
					11
				],
				2016: [
					3,
					21,
					4,
					2
				],
				2017: [
					4,
					10,
					4,
					22
				],
				2018: [
					3,
					26,
					4,
					7
				],
				2019: [
					4,
					15,
					4,
					27
				],
				2020: [
					4,
					6,
					4,
					18
				],
				2021: [
					3,
					29,
					4,
					10
				],
				2022: [
					4,
					11,
					4,
					23
				],
				2023: [
					4,
					3,
					4,
					15
				],
				2024: [
					3,
					25,
					4,
					6
				],
				2025: [
					4,
					14,
					4,
					26
				],
				2026: [
					3,
					30,
					4,
					11
				],
				2027: [
					3,
					22,
					4,
					3
				],
				2028: [
					4,
					10,
					4,
					22
				],
				2029: [
					3,
					26,
					4,
					7
				],
				2030: [
					4,
					15,
					4,
					27
				]
			},
			{
				name: "Pfingstferien",
				2012: [
					5,
					29,
					5,
					29
				],
				2013: [
					5,
					21,
					5,
					21
				],
				2014: [
					6,
					10,
					6,
					10
				],
				2015: [
					5,
					26,
					5,
					26
				],
				2016: [
					5,
					17,
					5,
					17
				],
				2017: [
					6,
					6,
					6,
					6
				],
				2018: [
					5,
					22,
					5,
					25
				],
				2019: [
					6,
					11,
					6,
					11
				],
				2020: [
					6,
					2,
					6,
					2
				],
				2021: [
					5,
					25,
					5,
					25
				],
				2023: [
					5,
					30,
					5,
					30
				],
				2024: [
					5,
					21,
					5,
					21
				],
				2025: [
					6,
					10,
					6,
					10
				],
				2026: [
					5,
					26,
					5,
					26
				],
				2027: [
					5,
					18,
					5,
					18
				],
				2029: [
					5,
					22,
					5,
					22
				]
			},
			{
				name: "Sommerferien",
				2012: [
					7,
					9,
					8,
					21
				],
				2013: [
					7,
					22,
					9,
					3
				],
				2014: [
					7,
					7,
					8,
					19
				],
				2015: [
					6,
					29,
					8,
					11
				],
				2016: [
					7,
					11,
					8,
					23
				],
				2017: [
					7,
					17,
					8,
					29
				],
				2018: [
					7,
					16,
					8,
					28
				],
				2019: [
					7,
					15,
					8,
					27
				],
				2020: [
					6,
					29,
					8,
					11
				],
				2021: [
					7,
					5,
					8,
					17
				],
				2022: [
					6,
					27,
					8,
					9
				],
				2023: [
					6,
					22,
					8,
					4
				],
				2024: [
					7,
					8,
					8,
					20
				],
				2025: [
					7,
					14,
					8,
					26
				],
				2026: [
					7,
					20,
					9,
					1
				],
				2027: [
					7,
					19,
					8,
					31
				],
				2028: [
					7,
					10,
					8,
					22
				],
				2029: [
					7,
					2,
					8,
					14
				],
				2030: [
					6,
					24,
					8,
					6
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					8,
					10,
					20
				],
				2013: [
					10,
					21,
					11,
					2
				],
				2014: [
					10,
					6,
					10,
					18
				],
				2015: [
					10,
					5,
					10,
					17
				],
				2016: [
					10,
					10,
					10,
					21
				],
				2017: [
					10,
					23,
					11,
					4
				],
				2018: [
					10,
					15,
					10,
					27
				],
				2019: [
					10,
					14,
					10,
					26
				],
				2020: [
					10,
					12,
					10,
					24
				],
				2021: [
					10,
					11,
					10,
					23
				],
				2022: [
					10,
					4,
					10,
					15
				],
				2023: [
					10,
					2,
					10,
					14
				],
				2024: [
					10,
					14,
					10,
					26
				],
				2025: [
					10,
					13,
					10,
					25
				],
				2026: [
					10,
					17,
					10,
					31
				],
				2027: [
					10,
					23,
					11,
					6
				],
				2028: [
					10,
					23,
					11,
					4
				],
				2029: [
					10,
					15,
					10,
					27
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					23,
					1,
					6
				],
				2012: [
					12,
					21,
					1,
					4
				],
				2013: [
					12,
					23,
					1,
					7
				],
				2014: [
					12,
					22,
					1,
					6
				],
				2015: [
					12,
					23,
					1,
					6
				],
				2016: [
					12,
					23,
					1,
					6
				],
				2017: [
					12,
					27,
					1,
					6
				],
				2018: [
					12,
					21,
					1,
					4
				],
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					21,
					1,
					6
				],
				2021: [
					12,
					24,
					1,
					8
				],
				2022: [
					12,
					23,
					1,
					6
				],
				2023: [
					12,
					21,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					22,
					1,
					6
				],
				2026: [
					12,
					23,
					1,
					6
				],
				2027: [
					12,
					24,
					1,
					8
				],
				2028: [
					12,
					21,
					1,
					5
				],
				2029: [
					12,
					20,
					1,
					4
				]
			}
		] },
		"Rheinland-Pfalz": { SH: [
			{
				name: "Winterferien",
				2019: [
					2,
					25,
					3,
					1
				],
				2020: [
					2,
					17,
					2,
					21
				],
				2022: [
					2,
					21,
					2,
					25
				]
			},
			{
				name: "Osterferien",
				2012: [
					3,
					29,
					4,
					13
				],
				2013: [
					3,
					20,
					4,
					5
				],
				2014: [
					4,
					11,
					4,
					25
				],
				2015: [
					3,
					26,
					4,
					10
				],
				2016: [
					3,
					18,
					4,
					1
				],
				2017: [
					4,
					10,
					4,
					21
				],
				2018: [
					3,
					26,
					4,
					6
				],
				2019: [
					4,
					23,
					4,
					30
				],
				2020: [
					4,
					9,
					4,
					17
				],
				2021: [
					3,
					29,
					4,
					6
				],
				2022: [
					4,
					13,
					4,
					22
				],
				2023: [
					4,
					3,
					4,
					6
				],
				2024: [
					3,
					25,
					4,
					2
				],
				2025: [
					4,
					14,
					4,
					25
				],
				2026: [
					3,
					30,
					4,
					10
				],
				2027: [
					3,
					22,
					4,
					2
				],
				2028: [
					4,
					10,
					4,
					21
				],
				2029: [
					3,
					26,
					4,
					6
				],
				2030: [
					4,
					15,
					4,
					30
				]
			},
			{
				name: "Pfingstferien",
				2021: [
					5,
					25,
					6,
					2
				],
				2023: [
					5,
					30,
					6,
					7
				],
				2024: [
					5,
					21,
					5,
					29
				]
			},
			{
				name: "Sommerferien",
				2012: [
					7,
					2,
					8,
					10
				],
				2013: [
					7,
					8,
					8,
					16
				],
				2014: [
					7,
					28,
					9,
					5
				],
				2015: [
					7,
					27,
					9,
					4
				],
				2016: [
					7,
					18,
					8,
					26
				],
				2017: [
					7,
					3,
					8,
					11
				],
				2018: [
					6,
					25,
					8,
					3
				],
				2019: [
					7,
					1,
					8,
					9
				],
				2020: [
					7,
					6,
					8,
					14
				],
				2021: [
					7,
					19,
					8,
					27
				],
				2022: [
					7,
					25,
					9,
					2
				],
				2023: [
					7,
					24,
					9,
					1
				],
				2024: [
					7,
					15,
					8,
					23
				],
				2025: [
					7,
					7,
					8,
					15
				],
				2026: [
					6,
					29,
					8,
					7
				],
				2027: [
					6,
					28,
					8,
					6
				],
				2028: [
					7,
					3,
					8,
					11
				],
				2029: [
					7,
					16,
					8,
					24
				],
				2030: [
					7,
					22,
					8,
					30
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					1,
					10,
					12
				],
				2013: [
					10,
					4,
					10,
					18
				],
				2014: [
					10,
					20,
					10,
					31
				],
				2015: [
					10,
					19,
					10,
					30
				],
				2016: [
					10,
					10,
					10,
					21
				],
				2017: [
					10,
					2,
					10,
					13
				],
				2018: [
					10,
					1,
					10,
					12
				],
				2019: [
					9,
					30,
					10,
					11
				],
				2020: [
					10,
					12,
					10,
					23
				],
				2021: [
					10,
					11,
					10,
					22
				],
				2022: [
					10,
					17,
					10,
					31
				],
				2023: [
					10,
					16,
					10,
					27
				],
				2024: [
					10,
					14,
					10,
					25
				],
				2025: [
					10,
					13,
					10,
					24
				],
				2026: [
					10,
					5,
					10,
					16
				],
				2027: [
					10,
					4,
					10,
					15
				],
				2028: [
					10,
					9,
					10,
					20
				],
				2029: [
					10,
					22,
					11,
					2
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					22,
					1,
					6
				],
				2012: [
					12,
					20,
					1,
					4
				],
				2013: [
					12,
					23,
					1,
					7
				],
				2014: [
					12,
					22,
					1,
					7
				],
				2015: [
					12,
					23,
					1,
					8
				],
				2016: [
					12,
					22,
					1,
					6
				],
				2017: [
					12,
					22,
					1,
					9
				],
				2018: [
					12,
					20,
					1,
					4
				],
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					21,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					1,
					2
				],
				2023: [
					12,
					27,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					8
				],
				2025: [
					12,
					22,
					1,
					7
				],
				2026: [
					12,
					23,
					1,
					8
				],
				2027: [
					12,
					23,
					1,
					7
				],
				2028: [
					12,
					21,
					1,
					8
				],
				2029: [
					12,
					24,
					1,
					9
				]
			}
		] },
		Saarland: { SH: [
			{
				name: "Winterferien",
				2012: [
					2,
					20,
					2,
					25
				],
				2013: [
					2,
					11,
					2,
					16
				],
				2014: [
					3,
					3,
					3,
					8
				],
				2015: [
					2,
					16,
					2,
					21
				],
				2016: [
					2,
					8,
					2,
					13
				],
				2017: [
					2,
					27,
					3,
					4
				],
				2018: [
					2,
					12,
					2,
					17
				],
				2019: [
					2,
					25,
					3,
					5
				]
			},
			{
				name: "Osterferien",
				2012: [
					4,
					2,
					4,
					14
				],
				2013: [
					3,
					25,
					4,
					6
				],
				2014: [
					4,
					14,
					4,
					26
				],
				2015: [
					3,
					30,
					4,
					11
				],
				2016: [
					3,
					29,
					4,
					9
				],
				2017: [
					4,
					10,
					4,
					22
				],
				2018: [
					3,
					26,
					4,
					6
				],
				2019: [
					4,
					17,
					4,
					26
				],
				2020: [
					4,
					14,
					4,
					24
				],
				2021: [
					3,
					29,
					4,
					7
				],
				2022: [
					4,
					14,
					4,
					22
				],
				2023: [
					4,
					3,
					4,
					12
				],
				2024: [
					3,
					25,
					4,
					5
				],
				2025: [
					4,
					14,
					4,
					25
				],
				2026: [
					4,
					7,
					4,
					17
				],
				2027: [
					3,
					30,
					4,
					9
				],
				2028: [
					4,
					12,
					4,
					21
				],
				2029: [
					3,
					26,
					4,
					6
				],
				2030: [
					4,
					15,
					4,
					26
				]
			},
			{
				name: "Pfingstferien",
				2021: [
					5,
					25,
					5,
					28
				],
				2022: [
					6,
					7,
					6,
					10
				],
				2023: [
					5,
					30,
					6,
					2
				],
				2024: [
					5,
					21,
					5,
					24
				],
				2029: [
					5,
					22,
					5,
					25
				]
			},
			{
				name: "Sommerferien",
				2012: [
					7,
					2,
					8,
					14
				],
				2013: [
					7,
					8,
					8,
					17
				],
				2014: [
					7,
					28,
					9,
					6
				],
				2015: [
					7,
					27,
					9,
					5
				],
				2016: [
					7,
					18,
					8,
					27
				],
				2017: [
					7,
					3,
					8,
					14
				],
				2018: [
					6,
					25,
					8,
					3
				],
				2019: [
					7,
					1,
					8,
					9
				],
				2020: [
					7,
					6,
					8,
					14
				],
				2021: [
					7,
					19,
					8,
					27
				],
				2022: [
					7,
					25,
					9,
					2
				],
				2023: [
					7,
					24,
					9,
					1
				],
				2024: [
					7,
					15,
					8,
					23
				],
				2025: [
					7,
					7,
					8,
					14
				],
				2026: [
					6,
					29,
					8,
					7
				],
				2027: [
					6,
					28,
					8,
					6
				],
				2028: [
					7,
					3,
					8,
					11
				],
				2029: [
					7,
					16,
					8,
					24
				],
				2030: [
					7,
					22,
					8,
					30
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					22,
					11,
					3
				],
				2013: [
					10,
					21,
					11,
					2
				],
				2014: [
					10,
					20,
					10,
					31
				],
				2015: [
					10,
					19,
					10,
					31
				],
				2016: [
					10,
					10,
					10,
					22
				],
				2017: [
					10,
					2,
					10,
					14
				],
				2018: [
					10,
					1,
					10,
					12
				],
				2019: [
					10,
					7,
					10,
					18
				],
				2020: [
					10,
					12,
					10,
					23
				],
				2021: [
					10,
					18,
					10,
					29
				],
				2022: [
					10,
					24,
					11,
					4
				],
				2023: [
					10,
					23,
					11,
					3
				],
				2024: [
					10,
					14,
					10,
					25
				],
				2025: [
					10,
					13,
					10,
					24
				],
				2026: [
					10,
					5,
					10,
					16
				],
				2027: [
					10,
					4,
					10,
					15
				],
				2028: [
					10,
					9,
					10,
					20
				],
				2029: [
					10,
					22,
					11,
					2
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					23,
					1,
					4
				],
				2012: [
					12,
					24,
					1,
					5
				],
				2013: [
					12,
					20,
					1,
					4
				],
				2014: [
					12,
					22,
					1,
					7
				],
				2015: [
					12,
					21,
					1,
					2
				],
				2016: [
					12,
					19,
					12,
					31
				],
				2017: [
					12,
					21,
					1,
					5
				],
				2018: [
					12,
					20,
					1,
					4
				],
				2019: [
					12,
					23,
					1,
					3
				],
				2020: [
					12,
					21,
					12,
					31
				],
				2021: [
					12,
					23,
					1,
					3
				],
				2022: [
					12,
					22,
					1,
					4
				],
				2023: [
					12,
					21,
					1,
					2
				],
				2024: [
					12,
					23,
					1,
					3
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					21,
					12,
					31
				],
				2027: [
					12,
					20,
					12,
					31
				],
				2028: [
					12,
					20,
					1,
					2
				],
				2029: [
					12,
					21,
					1,
					4
				]
			},
			{
				name: "Fastnachtsferien",
				2020: [
					2,
					17,
					2,
					25
				],
				2021: [
					2,
					15,
					2,
					19
				],
				2022: [
					2,
					21,
					3,
					1
				],
				2023: [
					2,
					20,
					2,
					24
				],
				2024: [
					2,
					12,
					2,
					16
				],
				2025: [
					2,
					24,
					3,
					4
				],
				2026: [
					2,
					16,
					2,
					20
				],
				2027: [
					2,
					8,
					2,
					12
				],
				2028: [
					2,
					21,
					2,
					29
				],
				2029: [
					2,
					12,
					2,
					16
				],
				2030: [
					2,
					25,
					3,
					5
				]
			}
		] },
		Sachsen: { SH: [
			{
				name: "Winterferien",
				2012: [
					2,
					13,
					2,
					25
				],
				2013: [
					2,
					4,
					2,
					15
				],
				2014: [
					2,
					17,
					3,
					1
				],
				2015: [
					2,
					9,
					2,
					21
				],
				2016: [
					2,
					8,
					2,
					20
				],
				2017: [
					2,
					13,
					2,
					24
				],
				2018: [
					2,
					12,
					2,
					23
				],
				2019: [
					2,
					18,
					3,
					2
				],
				2020: [
					2,
					10,
					2,
					22
				],
				2021: [
					1,
					31,
					2,
					6
				],
				2022: [
					2,
					12,
					2,
					26
				],
				2023: [
					2,
					13,
					2,
					24
				],
				2024: [
					2,
					12,
					2,
					23
				],
				2025: [
					2,
					17,
					3,
					1
				],
				2026: [
					2,
					9,
					2,
					21
				],
				2027: [
					2,
					8,
					2,
					19
				],
				2028: [
					2,
					14,
					2,
					26
				],
				2029: [
					2,
					5,
					2,
					16
				],
				2030: [
					2,
					18,
					3,
					1
				]
			},
			{
				name: "Osterferien",
				2012: [
					4,
					6,
					4,
					14
				],
				2013: [
					3,
					29,
					4,
					6
				],
				2014: [
					4,
					18,
					4,
					26
				],
				2015: [
					4,
					2,
					4,
					11
				],
				2016: [
					3,
					25,
					4,
					2
				],
				2017: [
					4,
					13,
					4,
					22
				],
				2018: [
					3,
					29,
					4,
					6
				],
				2019: [
					4,
					19,
					4,
					26
				],
				2020: [
					4,
					10,
					4,
					18
				],
				2021: [
					3,
					27,
					4,
					10
				],
				2022: [
					4,
					15,
					4,
					23
				],
				2023: [
					4,
					7,
					4,
					15
				],
				2024: [
					3,
					28,
					4,
					5
				],
				2025: [
					4,
					18,
					4,
					25
				],
				2026: [
					4,
					3,
					4,
					10
				],
				2027: [
					3,
					26,
					4,
					2
				],
				2028: [
					4,
					14,
					4,
					22
				],
				2029: [
					3,
					29,
					4,
					6
				],
				2030: [
					4,
					19,
					4,
					26
				]
			},
			{
				name: "Pfingstferien",
				2012: [
					5,
					18,
					5,
					18
				],
				2013: [
					5,
					18,
					5,
					22
				],
				2014: [
					5,
					30,
					5,
					30
				],
				2015: [
					5,
					15,
					5,
					15
				],
				2016: [
					5,
					6,
					5,
					6
				],
				2017: [
					5,
					26,
					5,
					26
				],
				2018: [
					5,
					19,
					5,
					22
				],
				2019: [
					5,
					31,
					5,
					31
				],
				2024: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					15,
					5,
					18
				],
				2029: [
					5,
					19,
					5,
					22
				],
				2030: [
					6,
					8,
					6,
					11
				]
			},
			{
				name: "Sommerferien",
				2012: [
					7,
					23,
					8,
					31
				],
				2013: [
					7,
					15,
					8,
					23
				],
				2014: [
					7,
					21,
					8,
					29
				],
				2015: [
					7,
					13,
					8,
					21
				],
				2016: [
					6,
					27,
					8,
					5
				],
				2017: [
					6,
					26,
					8,
					4
				],
				2018: [
					7,
					2,
					8,
					10
				],
				2019: [
					7,
					8,
					8,
					16
				],
				2020: [
					7,
					20,
					8,
					28
				],
				2021: [
					7,
					26,
					9,
					3
				],
				2022: [
					7,
					18,
					8,
					26
				],
				2023: [
					7,
					10,
					8,
					18
				],
				2024: [
					6,
					20,
					8,
					2
				],
				2025: [
					6,
					28,
					8,
					8
				],
				2026: [
					7,
					4,
					8,
					14
				],
				2027: [
					7,
					10,
					8,
					20
				],
				2028: [
					7,
					22,
					9,
					1
				],
				2029: [
					7,
					21,
					8,
					31
				],
				2030: [
					7,
					13,
					8,
					23
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					22,
					11,
					2
				],
				2013: [
					10,
					21,
					11,
					1
				],
				2014: [
					10,
					20,
					10,
					31
				],
				2015: [
					10,
					12,
					10,
					24
				],
				2016: [
					10,
					3,
					10,
					15
				],
				2017: [
					10,
					30,
					10,
					30
				],
				2018: [
					10,
					8,
					10,
					20
				],
				2019: [
					10,
					14,
					10,
					25
				],
				2020: [
					10,
					19,
					10,
					31
				],
				2021: [
					10,
					18,
					10,
					30
				],
				2022: [
					10,
					17,
					10,
					29
				],
				2023: [
					10,
					2,
					10,
					14
				],
				2024: [
					10,
					7,
					10,
					19
				],
				2025: [
					10,
					6,
					10,
					18
				],
				2026: [
					10,
					12,
					10,
					24
				],
				2027: [
					10,
					11,
					10,
					23
				],
				2028: [
					10,
					23,
					11,
					3
				],
				2029: [
					10,
					22,
					11,
					2
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					23,
					1,
					2
				],
				2012: [
					12,
					22,
					1,
					2
				],
				2013: [
					12,
					21,
					1,
					3
				],
				2014: [
					12,
					22,
					1,
					3
				],
				2015: [
					12,
					21,
					1,
					2
				],
				2016: [
					12,
					23,
					1,
					2
				],
				2017: [
					12,
					23,
					1,
					2
				],
				2018: [
					12,
					22,
					1,
					4
				],
				2019: [
					12,
					21,
					1,
					3
				],
				2020: [
					12,
					19,
					1,
					2
				],
				2021: [
					12,
					23,
					1,
					1
				],
				2022: [
					12,
					22,
					1,
					2
				],
				2023: [
					12,
					23,
					1,
					2
				],
				2024: [
					12,
					23,
					1,
					3
				],
				2025: [
					12,
					22,
					1,
					2
				],
				2026: [
					12,
					23,
					1,
					2
				],
				2027: [
					12,
					23,
					1,
					1
				],
				2028: [
					12,
					23,
					1,
					3
				],
				2029: [
					12,
					22,
					1,
					4
				]
			},
			{
				name: "Unterrichtsfreier Tag",
				2022: [
					5,
					27,
					5,
					27
				],
				2023: [
					10,
					30,
					10,
					30
				],
				2024: [
					5,
					10,
					5,
					10
				],
				2025: [
					5,
					30,
					5,
					30
				],
				2026: [
					5,
					15,
					5,
					15
				],
				2027: [
					5,
					7,
					5,
					7
				],
				2028: [
					5,
					26,
					5,
					26
				],
				2029: [
					5,
					11,
					5,
					11
				],
				2030: [
					5,
					31,
					5,
					31
				]
			}
		] },
		"Sachsen-Anhalt": { SH: [
			{
				name: "Winterferien",
				2012: [
					2,
					4,
					2,
					11
				],
				2013: [
					2,
					1,
					2,
					8
				],
				2014: [
					2,
					1,
					2,
					12
				],
				2015: [
					2,
					2,
					2,
					14
				],
				2016: [
					2,
					1,
					2,
					10
				],
				2017: [
					2,
					4,
					2,
					11
				],
				2018: [
					2,
					5,
					2,
					9
				],
				2019: [
					2,
					11,
					2,
					15
				],
				2020: [
					2,
					10,
					2,
					14
				],
				2021: [
					2,
					8,
					2,
					13
				],
				2022: [
					2,
					12,
					2,
					19
				],
				2023: [
					2,
					6,
					2,
					11
				],
				2024: [
					2,
					5,
					2,
					10
				],
				2025: [
					1,
					27,
					1,
					31
				],
				2026: [
					1,
					31,
					2,
					6
				],
				2027: [
					2,
					1,
					2,
					6
				],
				2028: [
					2,
					7,
					2,
					12
				],
				2029: [
					2,
					5,
					2,
					10
				],
				2030: [
					2,
					4,
					2,
					8
				]
			},
			{
				name: "Osterferien",
				2012: [
					4,
					2,
					4,
					7
				],
				2013: [
					3,
					25,
					3,
					30
				],
				2014: [
					4,
					14,
					4,
					17
				],
				2015: [
					4,
					2,
					4,
					2
				],
				2016: [
					3,
					24,
					3,
					24
				],
				2017: [
					4,
					10,
					4,
					13
				],
				2018: [
					4,
					30,
					4,
					30
				],
				2019: [
					4,
					18,
					4,
					30
				],
				2020: [
					4,
					6,
					4,
					11
				],
				2021: [
					3,
					29,
					4,
					3
				],
				2022: [
					4,
					11,
					4,
					16
				],
				2023: [
					4,
					3,
					4,
					8
				],
				2024: [
					3,
					25,
					3,
					30
				],
				2025: [
					4,
					7,
					4,
					19
				],
				2026: [
					3,
					30,
					4,
					4
				],
				2027: [
					3,
					22,
					3,
					27
				],
				2028: [
					4,
					10,
					4,
					22
				],
				2029: [
					3,
					26,
					3,
					31
				],
				2030: [
					4,
					8,
					4,
					20
				]
			},
			{
				name: "Pfingstferien",
				2012: [
					5,
					18,
					5,
					25
				],
				2013: [
					5,
					10,
					5,
					18
				],
				2014: [
					5,
					30,
					6,
					7
				],
				2015: [
					5,
					15,
					5,
					23
				],
				2016: [
					5,
					6,
					5,
					14
				],
				2017: [
					5,
					26,
					5,
					26
				],
				2018: [
					5,
					11,
					5,
					19
				],
				2019: [
					5,
					31,
					6,
					1
				],
				2020: [
					5,
					18,
					5,
					30
				],
				2021: [
					5,
					10,
					5,
					22
				],
				2022: [
					5,
					23,
					5,
					28
				],
				2023: [
					5,
					15,
					5,
					19
				],
				2024: [
					5,
					21,
					5,
					24
				],
				2026: [
					5,
					26,
					5,
					29
				],
				2027: [
					5,
					15,
					5,
					22
				],
				2028: [
					6,
					3,
					6,
					10
				],
				2029: [
					5,
					11,
					5,
					25
				],
				2030: [
					6,
					3,
					6,
					8
				]
			},
			{
				name: "Sommerferien",
				2012: [
					7,
					23,
					9,
					5
				],
				2013: [
					7,
					15,
					8,
					28
				],
				2014: [
					7,
					21,
					9,
					3
				],
				2015: [
					7,
					13,
					8,
					26
				],
				2016: [
					6,
					27,
					8,
					10
				],
				2017: [
					6,
					26,
					8,
					9
				],
				2018: [
					6,
					28,
					8,
					8
				],
				2019: [
					7,
					4,
					8,
					14
				],
				2020: [
					7,
					16,
					8,
					26
				],
				2021: [
					7,
					22,
					9,
					1
				],
				2022: [
					7,
					14,
					8,
					24
				],
				2023: [
					7,
					6,
					8,
					16
				],
				2024: [
					6,
					24,
					8,
					3
				],
				2025: [
					6,
					28,
					8,
					8
				],
				2026: [
					7,
					4,
					8,
					14
				],
				2027: [
					7,
					10,
					8,
					20
				],
				2028: [
					7,
					22,
					9,
					1
				],
				2029: [
					7,
					21,
					8,
					31
				],
				2030: [
					7,
					13,
					8,
					23
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					29,
					11,
					2
				],
				2013: [
					10,
					21,
					10,
					25
				],
				2014: [
					10,
					27,
					10,
					30
				],
				2015: [
					10,
					17,
					10,
					24
				],
				2016: [
					10,
					4,
					10,
					15
				],
				2017: [
					10,
					30,
					10,
					30
				],
				2018: [
					10,
					1,
					10,
					12
				],
				2019: [
					11,
					1,
					11,
					1
				],
				2020: [
					10,
					19,
					10,
					24
				],
				2021: [
					10,
					25,
					10,
					30
				],
				2022: [
					10,
					24,
					11,
					4
				],
				2023: [
					10,
					16,
					10,
					30
				],
				2024: [
					9,
					30,
					10,
					12
				],
				2025: [
					10,
					13,
					10,
					25
				],
				2026: [
					10,
					19,
					10,
					30
				],
				2027: [
					10,
					18,
					10,
					23
				],
				2028: [
					10,
					30,
					11,
					3
				],
				2029: [
					10,
					29,
					11,
					2
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					22,
					1,
					7
				],
				2012: [
					12,
					19,
					1,
					4
				],
				2013: [
					12,
					21,
					1,
					3
				],
				2014: [
					12,
					22,
					1,
					5
				],
				2015: [
					12,
					21,
					1,
					5
				],
				2016: [
					12,
					19,
					1,
					2
				],
				2017: [
					12,
					21,
					1,
					3
				],
				2018: [
					12,
					19,
					1,
					4
				],
				2019: [
					12,
					23,
					1,
					4
				],
				2020: [
					12,
					21,
					1,
					10
				],
				2021: [
					12,
					22,
					1,
					8
				],
				2022: [
					12,
					21,
					1,
					5
				],
				2023: [
					12,
					21,
					1,
					3
				],
				2024: [
					12,
					23,
					1,
					4
				],
				2025: [
					12,
					22,
					1,
					5
				],
				2026: [
					12,
					21,
					1,
					2
				],
				2027: [
					12,
					20,
					12,
					31
				],
				2028: [
					12,
					21,
					1,
					2
				],
				2029: [
					12,
					21,
					1,
					5
				]
			},
			{
				name: "Ferientag",
				2023: [
					10,
					2,
					10,
					2
				],
				2024: [
					11,
					1,
					11,
					1
				],
				2025: [
					5,
					30,
					5,
					30
				],
				2028: [
					10,
					2,
					10,
					2
				],
				2029: [
					4,
					30,
					4,
					30
				],
				2030: [
					5,
					31,
					5,
					31
				]
			}
		] },
		"Schleswig-Holstein": { SH: [
			{
				name: "Osterferien",
				2011: [
					4,
					15,
					4,
					30
				],
				2012: [
					3,
					30,
					4,
					13
				],
				2013: [
					3,
					25,
					4,
					9
				],
				2014: [
					4,
					16,
					5,
					2
				],
				2015: [
					4,
					1,
					4,
					17
				],
				2016: [
					3,
					24,
					4,
					9
				],
				2017: [
					4,
					7,
					4,
					21
				],
				2018: [
					3,
					29,
					4,
					13
				],
				2019: [
					4,
					4,
					4,
					18
				],
				2020: [
					3,
					30,
					4,
					17
				],
				2021: [
					4,
					1,
					4,
					16
				],
				2022: [
					4,
					4,
					4,
					16
				],
				2023: [
					4,
					6,
					4,
					22
				],
				2024: [
					4,
					2,
					4,
					19
				],
				2025: [
					4,
					11,
					4,
					25
				],
				2026: [
					3,
					26,
					4,
					10
				],
				2027: [
					3,
					30,
					4,
					10
				],
				2028: [
					4,
					3,
					4,
					15
				],
				2029: [
					3,
					23,
					4,
					6
				],
				2030: [
					4,
					8,
					4,
					20
				],
				2031: [
					3,
					28,
					4,
					10
				]
			},
			{
				name: "Sommerferien",
				2011: [
					7,
					4,
					8,
					13
				],
				2012: [
					6,
					25,
					8,
					4
				],
				2013: [
					6,
					24,
					8,
					3
				],
				2014: [
					7,
					14,
					8,
					23
				],
				2015: [
					7,
					20,
					8,
					29
				],
				2016: [
					7,
					25,
					9,
					3
				],
				2017: [
					7,
					24,
					9,
					2
				],
				2018: [
					7,
					9,
					8,
					18
				],
				2019: [
					7,
					1,
					8,
					10
				],
				2020: [
					6,
					29,
					8,
					8
				],
				2021: [
					6,
					21,
					7,
					31
				],
				2022: [
					7,
					4,
					8,
					13
				],
				2023: [
					7,
					17,
					8,
					26
				],
				2024: [
					7,
					22,
					8,
					31
				],
				2025: [
					7,
					28,
					9,
					6
				],
				2026: [
					7,
					4,
					8,
					15
				],
				2027: [
					7,
					3,
					8,
					14
				],
				2028: [
					6,
					24,
					8,
					4
				],
				2029: [
					6,
					23,
					8,
					3
				],
				2030: [
					7,
					8,
					8,
					17
				]
			},
			{
				name: "Herbstferien",
				2011: [
					10,
					10,
					10,
					22
				],
				2012: [
					10,
					4,
					10,
					19
				],
				2013: [
					10,
					4,
					10,
					18
				],
				2014: [
					10,
					13,
					10,
					25
				],
				2015: [
					10,
					19,
					10,
					31
				],
				2016: [
					10,
					17,
					10,
					29
				],
				2017: [
					10,
					16,
					10,
					27
				],
				2018: [
					10,
					1,
					10,
					19
				],
				2019: [
					10,
					4,
					10,
					18
				],
				2020: [
					10,
					5,
					10,
					17
				],
				2021: [
					10,
					4,
					10,
					16
				],
				2022: [
					10,
					10,
					10,
					21
				],
				2023: [
					10,
					16,
					10,
					27
				],
				2024: [
					10,
					21,
					11,
					1
				],
				2025: [
					10,
					20,
					10,
					30
				],
				2026: [
					10,
					12,
					10,
					24
				],
				2027: [
					10,
					11,
					10,
					23
				],
				2028: [
					10,
					16,
					10,
					30
				],
				2029: [
					10,
					8,
					10,
					19
				],
				2030: [
					10,
					14,
					10,
					25
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					23,
					1,
					6
				],
				2012: [
					12,
					24,
					1,
					5
				],
				2013: [
					12,
					23,
					1,
					6
				],
				2014: [
					12,
					22,
					1,
					6
				],
				2015: [
					12,
					21,
					1,
					6
				],
				2016: [
					12,
					23,
					1,
					6
				],
				2017: [
					12,
					21,
					1,
					6
				],
				2018: [
					12,
					21,
					1,
					4
				],
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					21,
					1,
					6
				],
				2021: [
					12,
					23,
					1,
					8
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					27,
					1,
					6
				],
				2024: [
					12,
					19,
					1,
					7
				],
				2025: [
					12,
					19,
					1,
					6
				],
				2026: [
					12,
					21,
					1,
					6
				],
				2027: [
					12,
					23,
					1,
					8
				],
				2028: [
					12,
					21,
					1,
					5
				],
				2029: [
					12,
					21,
					1,
					8
				],
				2030: [
					12,
					20,
					1,
					6
				]
			},
			{
				name: "Himmelfahrt",
				2011: [
					6,
					3,
					6,
					4
				],
				2012: [
					5,
					18,
					5,
					18
				],
				2013: [
					5,
					10,
					5,
					10
				],
				2014: [
					5,
					30,
					5,
					30
				],
				2015: [
					5,
					15,
					5,
					15
				],
				2016: [
					5,
					6,
					5,
					6
				],
				2017: [
					5,
					26,
					5,
					26
				],
				2018: [
					5,
					11,
					5,
					11
				],
				2019: [
					5,
					31,
					5,
					31
				],
				2020: [
					5,
					22,
					5,
					22
				],
				2021: [
					5,
					14,
					5,
					15
				],
				2022: [
					5,
					27,
					5,
					28
				],
				2023: [
					5,
					19,
					5,
					20
				],
				2024: [
					5,
					10,
					5,
					11
				],
				2025: [
					5,
					30,
					5,
					30
				],
				2026: [
					5,
					15,
					5,
					15
				],
				2027: [
					5,
					7,
					5,
					7
				],
				2028: [
					5,
					26,
					5,
					26
				],
				2029: [
					5,
					11,
					5,
					11
				],
				2030: [
					5,
					31,
					5,
					31
				],
				2031: [
					5,
					23,
					5,
					23
				]
			}
		] },
		Thüringen: { SH: [
			{
				name: "Winterferien",
				2012: [
					2,
					6,
					2,
					11
				],
				2013: [
					2,
					18,
					2,
					23
				],
				2014: [
					2,
					17,
					2,
					22
				],
				2015: [
					2,
					2,
					2,
					7
				],
				2016: [
					2,
					1,
					2,
					6
				],
				2017: [
					2,
					6,
					2,
					11
				],
				2018: [
					2,
					5,
					2,
					9
				],
				2019: [
					2,
					11,
					2,
					15
				],
				2020: [
					2,
					10,
					2,
					14
				],
				2021: [
					1,
					25,
					1,
					30
				],
				2022: [
					2,
					12,
					2,
					19
				],
				2023: [
					2,
					13,
					2,
					17
				],
				2024: [
					2,
					12,
					2,
					16
				],
				2025: [
					2,
					3,
					2,
					8
				],
				2026: [
					2,
					16,
					2,
					21
				],
				2027: [
					2,
					1,
					2,
					6
				],
				2028: [
					2,
					7,
					2,
					12
				],
				2029: [
					2,
					12,
					2,
					17
				],
				2030: [
					2,
					11,
					2,
					16
				]
			},
			{
				name: "Osterferien",
				2012: [
					4,
					2,
					4,
					13
				],
				2013: [
					3,
					25,
					4,
					6
				],
				2014: [
					4,
					19,
					5,
					2
				],
				2015: [
					3,
					30,
					4,
					11
				],
				2016: [
					3,
					24,
					4,
					2
				],
				2017: [
					4,
					10,
					4,
					21
				],
				2018: [
					3,
					26,
					4,
					7
				],
				2019: [
					4,
					15,
					4,
					27
				],
				2020: [
					4,
					6,
					4,
					18
				],
				2021: [
					3,
					29,
					4,
					10
				],
				2022: [
					4,
					11,
					4,
					23
				],
				2023: [
					4,
					3,
					4,
					15
				],
				2024: [
					3,
					25,
					4,
					6
				],
				2025: [
					4,
					7,
					4,
					19
				],
				2026: [
					4,
					7,
					4,
					17
				],
				2027: [
					3,
					22,
					4,
					3
				],
				2028: [
					4,
					3,
					4,
					15
				],
				2029: [
					3,
					26,
					4,
					7
				],
				2030: [
					4,
					8,
					4,
					20
				]
			},
			{
				name: "Pfingstferien",
				2012: [
					5,
					25,
					5,
					29
				],
				2013: [
					5,
					10,
					5,
					10
				],
				2014: [
					5,
					30,
					5,
					30
				],
				2015: [
					5,
					15,
					5,
					15
				],
				2016: [
					5,
					6,
					5,
					6
				],
				2017: [
					5,
					26,
					5,
					26
				],
				2018: [
					5,
					11,
					5,
					11
				],
				2019: [
					5,
					31,
					5,
					31
				]
			},
			{
				name: "Sommerferien",
				2012: [
					7,
					23,
					8,
					31
				],
				2013: [
					7,
					15,
					8,
					23
				],
				2014: [
					7,
					21,
					8,
					29
				],
				2015: [
					7,
					13,
					8,
					21
				],
				2016: [
					6,
					27,
					8,
					10
				],
				2017: [
					6,
					26,
					8,
					9
				],
				2018: [
					7,
					2,
					8,
					11
				],
				2019: [
					7,
					8,
					8,
					17
				],
				2020: [
					7,
					20,
					8,
					29
				],
				2021: [
					7,
					26,
					9,
					4
				],
				2022: [
					7,
					18,
					8,
					27
				],
				2023: [
					7,
					10,
					8,
					19
				],
				2024: [
					6,
					20,
					7,
					31
				],
				2025: [
					6,
					28,
					8,
					8
				],
				2026: [
					7,
					4,
					8,
					14
				],
				2027: [
					7,
					10,
					8,
					20
				],
				2028: [
					7,
					22,
					9,
					1
				],
				2029: [
					7,
					21,
					8,
					31
				],
				2030: [
					7,
					13,
					8,
					23
				]
			},
			{
				name: "Herbstferien",
				2012: [
					10,
					22,
					11,
					3
				],
				2013: [
					10,
					21,
					11,
					2
				],
				2014: [
					10,
					6,
					10,
					18
				],
				2015: [
					10,
					5,
					10,
					17
				],
				2016: [
					10,
					10,
					10,
					22
				],
				2017: [
					10,
					2,
					10,
					14
				],
				2018: [
					10,
					1,
					10,
					13
				],
				2019: [
					10,
					7,
					10,
					19
				],
				2020: [
					10,
					17,
					10,
					30
				],
				2021: [
					10,
					25,
					11,
					6
				],
				2022: [
					10,
					17,
					10,
					29
				],
				2023: [
					10,
					2,
					10,
					14
				],
				2024: [
					9,
					30,
					10,
					12
				],
				2025: [
					10,
					6,
					10,
					18
				],
				2026: [
					10,
					12,
					10,
					24
				],
				2027: [
					10,
					9,
					10,
					23
				],
				2028: [
					10,
					23,
					11,
					3
				],
				2029: [
					10,
					22,
					11,
					3
				]
			},
			{
				name: "Weihnachtsferien",
				2011: [
					12,
					23,
					1,
					1
				],
				2012: [
					12,
					24,
					1,
					5
				],
				2013: [
					12,
					23,
					1,
					4
				],
				2014: [
					12,
					22,
					1,
					3
				],
				2015: [
					12,
					23,
					1,
					2
				],
				2016: [
					12,
					23,
					12,
					31
				],
				2017: [
					12,
					22,
					1,
					5
				],
				2018: [
					12,
					21,
					1,
					4
				],
				2019: [
					12,
					21,
					1,
					3
				],
				2020: [
					12,
					23,
					1,
					2
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					22,
					1,
					3
				],
				2023: [
					12,
					22,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					3
				],
				2025: [
					12,
					22,
					1,
					3
				],
				2026: [
					12,
					23,
					1,
					2
				],
				2027: [
					12,
					23,
					12,
					31
				],
				2028: [
					12,
					23,
					1,
					5
				],
				2029: [
					12,
					22,
					1,
					4
				]
			},
			{
				name: "Schulfreier Tag",
				2020: [
					5,
					22,
					5,
					22
				],
				2021: [
					5,
					14,
					5,
					14
				],
				2022: [
					5,
					27,
					5,
					27
				],
				2023: [
					5,
					19,
					5,
					19
				],
				2024: [
					5,
					10,
					5,
					10
				],
				2025: [
					5,
					30,
					5,
					30
				],
				2026: [
					5,
					15,
					5,
					15
				],
				2027: [
					5,
					7,
					5,
					7
				],
				2028: [
					5,
					26,
					5,
					26
				],
				2029: [
					5,
					11,
					5,
					11
				],
				2030: [
					5,
					31,
					5,
					31
				]
			}
		] }
	},
	dk: {
		PH: [
			{
				name: "Nytårsdag",
				fixed_date: [1, 1]
			},
			{
				name: "Skærtorsdag",
				variable_date: "easter",
				offset: -3
			},
			{
				name: "Langfredag",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Påskedag",
				variable_date: "easter"
			},
			{
				name: "2. Påskedag",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Store Bededag",
				variable_date: "easter",
				offset: 26
			},
			{
				name: "Kristi Himmelfartsdag",
				variable_date: "easter",
				offset: 39
			},
			{
				name: "Pinsedag",
				variable_date: "easter",
				offset: 49
			},
			{
				name: "2. Pinsedag",
				variable_date: "easter",
				offset: 50
			},
			{
				name: "Grundlovsdag",
				fixed_date: [6, 5]
			},
			{
				name: "Juleaftensdag",
				fixed_date: [12, 24]
			},
			{
				name: "Juledag",
				fixed_date: [12, 25]
			},
			{
				name: "2. Juledag",
				fixed_date: [12, 26]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=55.670249&lon=10.3333283&zoom=18&addressdetails=1&accept-language=da,en"
	},
	ee: { SH: [
		{
			name: "jõulupühad",
			2019: [
				12,
				23,
				1,
				5
			],
			2020: [
				12,
				23,
				1,
				10
			],
			2021: [
				12,
				23,
				1,
				9
			],
			2022: [
				12,
				22,
				1,
				8
			],
			2023: [
				12,
				21,
				1,
				7
			],
			2024: [
				12,
				23,
				1,
				5
			],
			2025: [
				12,
				22,
				1,
				11
			],
			2026: [
				12,
				23,
				1,
				10
			]
		},
		{
			name: "talvepuhkus",
			2020: [
				2,
				24,
				3,
				1
			],
			2021: [
				2,
				22,
				2,
				28
			],
			2022: [
				2,
				28,
				3,
				6
			],
			2023: [
				2,
				27,
				3,
				5
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				24,
				3,
				2
			],
			2026: [
				2,
				23,
				3,
				1
			],
			2027: [
				2,
				22,
				2,
				28
			]
		},
		{
			name: "kevadpühad",
			2020: [
				4,
				20,
				4,
				26
			],
			2021: [
				4,
				19,
				4,
				25
			],
			2022: [
				4,
				25,
				5,
				1
			],
			2023: [
				4,
				24,
				4,
				30
			],
			2024: [
				4,
				22,
				4,
				28
			],
			2025: [
				4,
				14,
				4,
				20
			],
			2026: [
				4,
				13,
				4,
				19
			],
			2027: [
				4,
				12,
				4,
				18
			]
		},
		{
			name: "suvepuhkus",
			2020: [
				6,
				10,
				8,
				31
			],
			2021: [
				6,
				14,
				8,
				31
			],
			2022: [
				6,
				14,
				8,
				31
			],
			2023: [
				6,
				14,
				8,
				31
			],
			2024: [
				6,
				13,
				8,
				31
			],
			2025: [
				6,
				10,
				8,
				31
			],
			2026: [
				6,
				17,
				8,
				31
			],
			2027: [
				6,
				14,
				8,
				31
			]
		},
		{
			name: "sügispuhkus",
			2020: [
				10,
				19,
				10,
				25
			],
			2021: [
				10,
				25,
				10,
				31
			],
			2022: [
				10,
				24,
				10,
				30
			],
			2023: [
				10,
				23,
				10,
				29
			],
			2024: [
				10,
				21,
				10,
				27
			],
			2025: [
				10,
				20,
				10,
				26
			],
			2026: [
				10,
				26,
				11,
				1
			]
		}
	] },
	es: {
		PH: [
			{
				name: "Cap d'Any",
				fixed_date: [1, 1],
				only_states: ["Cataluña"]
			},
			{
				name: "Año Nuevo",
				fixed_date: [1, 1]
			},
			{
				name: "Reis",
				fixed_date: [1, 6],
				only_states: ["Cataluña"]
			},
			{
				name: "Epifanía del Señor",
				fixed_date: [1, 6]
			},
			{
				name: "Día de Andalucía",
				fixed_date: [2, 28],
				only_states: ["Andalucía"]
			},
			{
				name: "Dia de les Illes Balears",
				fixed_date: [3, 1],
				only_states: ["Islas Baleares"]
			},
			{
				name: "Sant Josep",
				fixed_date: [3, 19],
				only_states: ["Comunidad Valenciana"]
			},
			{
				name: "San José",
				fixed_date: [3, 19],
				only_states: ["Murcia"]
			},
			{
				name: "Jueve Santo",
				variable_date: "easter",
				offset: -3,
				only_states: [
					"Andalucía",
					"Aragón",
					"Castilla y León",
					"Castilla-La Mancha",
					"Canarias",
					"Extremadura",
					"Galicia",
					"Islas Baleares",
					"La Rioja",
					"Comunidad de Madrid",
					"Región de Murcia",
					"Navarra",
					"Asturias",
					"País Vasco",
					"Cantabria",
					"Ceuta",
					"Melilla"
				]
			},
			{
				name: "Divendres Sant",
				variable_date: "easter",
				offset: -2,
				only_states: [
					"Cataluña",
					"Comunidad Valenciana",
					"Islas Baleares"
				]
			},
			{
				name: "Viernes Santo",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Dilluns de Pasqua Florida",
				variable_date: "easter",
				offset: 1,
				only_states: [
					"Cataluña",
					"Comunidad Valenciana",
					"Islas Baleares"
				]
			},
			{
				name: "Lunes de Pascua de Resurrección",
				variable_date: "easter",
				offset: 1,
				only_states: ["País Vasco", "Navarra"]
			},
			{
				name: "Día de Aragón",
				fixed_date: [4, 23],
				only_states: ["Aragón"]
			},
			{
				name: "Día de Castilla y León",
				fixed_date: [4, 23],
				only_states: ["Castilla y León"]
			},
			{
				name: "Festa del Treball",
				fixed_date: [5, 1],
				only_states: [
					"Cataluña",
					"Comunidad Valenciana",
					"Islas Baleares"
				]
			},
			{
				name: "Fiesta del Trabajo",
				fixed_date: [5, 1]
			},
			{
				name: "Fiesta de la Comunidad de Madrid",
				fixed_date: [5, 2],
				only_states: ["Comunidad de Madrid"]
			},
			{
				name: "Día das Letras Galegas",
				fixed_date: [5, 2],
				only_states: ["Galicia"]
			},
			{
				name: "Día de Canarias",
				fixed_date: [5, 30],
				only_states: ["Canarias"]
			},
			{
				name: "Día de la Región Castilla-La Mancha",
				fixed_date: [5, 31],
				only_states: ["Castilla-La Mancha"]
			},
			{
				name: "Día de la Región de Murcia",
				fixed_date: [6, 9],
				only_states: ["Región de Murcia"]
			},
			{
				name: "Día de la Rioja",
				fixed_date: [6, 9],
				only_states: ["La Rioja"]
			},
			{
				name: "San Antonio",
				fixed_date: [6, 13],
				only_states: ["Ceuta"]
			},
			{
				name: "Sant Joan",
				fixed_date: [6, 24],
				only_states: ["Cataluña"]
			},
			{
				name: "San Juan",
				fixed_date: [6, 24],
				only_states: ["Ceuta"]
			},
			{
				name: "Santiago Apóstol",
				fixed_date: [7, 25],
				only_states: ["Galicia"]
			},
			{
				name: "Santa María de África",
				fixed_date: [8, 6],
				only_states: ["Ceuta"]
			},
			{
				name: "l'Assumpció",
				fixed_date: [8, 15],
				only_states: ["Cataluña"]
			},
			{
				name: "Asunción de la Virgen",
				fixed_date: [8, 15]
			},
			{
				name: "Día de Ceuta",
				fixed_date: [9, 2],
				only_states: ["Ceuta"]
			},
			{
				name: "Día de Asturias",
				fixed_date: [9, 8],
				only_states: ["Asturias"]
			},
			{
				name: "Día de Extremadura",
				fixed_date: [9, 8],
				only_states: ["Extremadura"]
			},
			{
				name: "Diada Nacional de Catalunya",
				fixed_date: [9, 11],
				only_states: ["Cataluña"]
			},
			{
				name: "Día de Cantabria",
				fixed_date: [9, 17],
				only_states: ["Cantabria"]
			},
			{
				name: "Día de Melilla",
				fixed_date: [9, 15],
				only_states: ["Melilla"]
			},
			{
				name: "Dia de la Comunitat Valenciana",
				fixed_date: [10, 9],
				only_states: ["Comunidad Valenciana"]
			},
			{
				name: "Festa Nacional d'Espanya",
				fixed_date: [10, 12],
				only_states: ["Cataluña"]
			},
			{
				name: "Fiesta Nacional de España",
				fixed_date: [10, 12]
			},
			{
				name: "Euskadi Eguna",
				fixed_date: [10, 25],
				only_states: ["País Vasco"]
			},
			{
				name: "Tots Sants",
				fixed_date: [11, 1],
				only_states: [
					"Cataluña",
					"Comunidad Valenciana",
					"Islas Baleares"
				]
			},
			{
				name: "Todos los Santos",
				fixed_date: [11, 1]
			},
			{
				name: "Día de la Constitución Española",
				fixed_date: [12, 6]
			},
			{
				name: "La Puríssima",
				fixed_date: [12, 8],
				only_states: [
					"Cataluña",
					"Comunidad Valenciana",
					"Islas Baleares"
				]
			},
			{
				name: "La Immaculada Concepción",
				fixed_date: [12, 8]
			},
			{
				name: "Nadal",
				fixed_date: [12, 25],
				only_states: [
					"Cataluña",
					"Comunidad Valenciana",
					"Islas Baleares"
				]
			},
			{
				name: "Natividad del Señor",
				fixed_date: [12, 25]
			},
			{
				name: "Sant Esteve",
				fixed_date: [12, 26],
				only_states: ["Cataluña"]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=41.60333&lon=2.18920&zoom=18&addressdetails=1&limit=1&accept-language=es,ca,eu,gl,oc,ast",
		Almería: { SH: [
			{
				name: "Vacaciones de Navidad",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					6
				],
				2021: [
					12,
					24,
					1,
					6
				],
				2022: [
					12,
					24,
					1,
					6
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					24,
					1,
					6
				],
				2025: [
					12,
					24,
					1,
					6
				]
			},
			{
				name: "Día no lectivo",
				2020: [
					12,
					23,
					12,
					23
				],
				2021: [
					12,
					23,
					12,
					23
				],
				2022: [
					12,
					7,
					12,
					7
				],
				2023: [
					12,
					22,
					12,
					22
				],
				2024: [
					12,
					23,
					12,
					23
				],
				2025: [
					12,
					23,
					12,
					23
				],
				2026: [
					5,
					4,
					5,
					4
				]
			},
			{
				name: "Día de la Comunidad Educativa",
				2020: [
					2,
					27,
					2,
					27
				],
				2021: [
					3,
					2,
					3,
					2
				],
				2022: [
					3,
					1,
					3,
					1
				],
				2023: [
					2,
					27,
					2,
					27
				],
				2024: [
					2,
					29,
					2,
					29
				],
				2025: [
					2,
					27,
					2,
					27
				],
				2026: [
					2,
					27,
					2,
					27
				]
			},
			{
				name: "Vacaciones de Semana Santa",
				2020: [
					4,
					5,
					4,
					12
				],
				2021: [
					3,
					28,
					4,
					4
				],
				2022: [
					4,
					10,
					4,
					17
				],
				2023: [
					4,
					2,
					4,
					9
				],
				2024: [
					3,
					23,
					3,
					31
				],
				2025: [
					4,
					14,
					4,
					20
				],
				2026: [
					3,
					30,
					4,
					5
				]
			},
			{
				name: "Vacaciones de verano",
				2020: [
					6,
					24,
					9,
					9
				],
				2021: [
					6,
					23,
					9,
					9
				],
				2022: [
					6,
					23,
					9,
					11
				],
				2023: [
					6,
					23,
					9,
					10
				],
				2024: [
					6,
					22,
					9,
					9
				],
				2025: [
					6,
					24,
					9,
					9
				]
			},
			{
				name: "Fin de lecciones",
				2026: [
					6,
					23,
					6,
					23
				]
			}
		] },
		Andalucía: {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=37.33999&lon=-4.58116&zoom=18&addressdetails=1&limit=1&accept-language=es,ca",
			_state_code: "an"
		},
		Aragón: {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=41.37872&lon=-0.76393&zoom=18&addressdetails=1&limit=1&accept-language=es,ca",
			_state_code: "ar",
			SH: [
				{
					name: "Vacaciones de Navidad",
					2019: [
						12,
						20,
						1,
						6
					],
					2020: [
						12,
						22,
						1,
						6
					],
					2021: [
						12,
						23,
						1,
						7
					],
					2022: [
						12,
						22,
						1,
						6
					],
					2023: [
						12,
						22,
						1,
						5
					],
					2024: [
						12,
						20,
						1,
						6
					],
					2025: [
						12,
						20,
						1,
						6
					]
				},
				{
					name: "Vacaciones de Semana Santa",
					2020: [
						4,
						6,
						4,
						13
					],
					2021: [
						3,
						29,
						4,
						2
					],
					2022: [
						4,
						11,
						4,
						18
					],
					2023: [
						4,
						3,
						4,
						10
					],
					2024: [
						3,
						28,
						4,
						5
					],
					2025: [
						4,
						14,
						4,
						21
					],
					2026: [
						3,
						30,
						4,
						6
					]
				},
				{
					name: "Vacaciones de verano",
					2020: [
						6,
						24,
						9,
						6
					],
					2021: [
						6,
						23,
						9,
						10
					],
					2022: [
						6,
						23,
						9,
						10
					],
					2023: [
						6,
						24,
						9,
						6
					],
					2024: [
						6,
						25,
						9,
						8
					],
					2025: [
						6,
						25,
						9,
						11
					]
				},
				{
					name: "Día no lectivo",
					2021: [
						12,
						7,
						12,
						7
					],
					2022: [
						12,
						5,
						12,
						5
					],
					2023: [
						12,
						7,
						12,
						7
					],
					2025: [
						11,
						3,
						11,
						3
					]
				},
				{
					name: "Fin de lecciones",
					2026: [
						6,
						19,
						6,
						19
					]
				}
			]
		},
		Asturias: {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=43.27108&lon=-5.85414&zoom=18&addressdetails=1&limit=1&accept-language=es,ast",
			_state_code: "as",
			SH: [
				{
					name: "Vacaciones de Navidad",
					2019: [
						12,
						23,
						1,
						7
					],
					2020: [
						12,
						23,
						1,
						8
					],
					2021: [
						12,
						24,
						1,
						7
					],
					2022: [
						12,
						27,
						1,
						5
					],
					2023: [
						12,
						26,
						1,
						5
					],
					2024: [
						12,
						23,
						1,
						7
					],
					2025: [
						12,
						22,
						1,
						7
					]
				},
				{
					name: "Día no lectivo",
					2020: [
						10,
						30,
						10,
						30
					],
					2021: [
						12,
						7,
						12,
						7
					],
					2022: [
						12,
						5,
						12,
						5
					],
					2023: [
						12,
						7,
						12,
						7
					],
					2024: [
						10,
						31,
						10,
						31
					],
					2025: [
						11,
						4,
						11,
						4
					],
					2026: [
						5,
						4,
						5,
						4
					]
				},
				{
					name: "Vacaciones de Semana Santa",
					2020: [
						4,
						6,
						4,
						12
					],
					2021: [
						3,
						29,
						4,
						5
					],
					2022: [
						4,
						11,
						4,
						15
					],
					2023: [
						4,
						3,
						4,
						11
					],
					2024: [
						3,
						25,
						4,
						1
					],
					2025: [
						4,
						14,
						4,
						20
					],
					2026: [
						3,
						30,
						4,
						5
					]
				},
				{
					name: "Vacaciones de verano",
					2020: [
						6,
						24,
						9,
						21
					],
					2021: [
						7,
						1,
						9,
						7
					],
					2022: [
						6,
						25,
						9,
						11
					],
					2023: [
						6,
						24,
						9,
						10
					],
					2024: [
						6,
						22,
						9,
						8
					],
					2025: [
						6,
						21,
						9,
						7
					]
				},
				{
					name: "Fin de lecciones",
					2026: [
						6,
						19,
						6,
						19
					]
				}
			]
		},
		Cádiz: { SH: [
			{
				name: "Vacaciones de Navidad",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					10
				],
				2021: [
					12,
					24,
					1,
					9
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					7
				],
				2025: [
					12,
					22,
					1,
					7
				]
			},
			{
				name: "Día no lectivo",
				2020: [
					5,
					4,
					5,
					4
				],
				2023: [
					3,
					1,
					3,
					1
				],
				2024: [
					2,
					27,
					2,
					27
				],
				2025: [
					10,
					13,
					10,
					13
				]
			},
			{
				name: "Día de la Comunidad Educativa",
				2020: [
					3,
					2,
					3,
					2
				],
				2021: [
					5,
					3,
					5,
					3
				],
				2022: [
					3,
					1,
					3,
					1
				],
				2023: [
					12,
					7,
					12,
					7
				],
				2025: [
					5,
					2,
					5,
					2
				],
				2026: [
					2,
					27,
					2,
					27
				]
			},
			{
				name: "Vacaciones de Semana Santa",
				2020: [
					4,
					6,
					4,
					12
				],
				2021: [
					3,
					29,
					4,
					4
				],
				2022: [
					4,
					11,
					4,
					17
				],
				2023: [
					4,
					3,
					4,
					9
				],
				2024: [
					3,
					25,
					3,
					31
				],
				2025: [
					4,
					14,
					4,
					20
				],
				2026: [
					3,
					30,
					4,
					5
				]
			},
			{
				name: "Vacaciones de verano",
				2020: [
					6,
					24,
					9,
					9
				],
				2021: [
					6,
					23,
					9,
					9
				],
				2022: [
					6,
					23,
					9,
					11
				],
				2023: [
					6,
					23,
					9,
					10
				],
				2024: [
					6,
					25,
					9,
					9
				],
				2025: [
					6,
					24,
					9,
					9
				]
			},
			{
				name: "Fin de lecciones",
				2026: [
					6,
					23,
					6,
					23
				]
			}
		] },
		Canarias: {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=28.29357&lon=-16.62144&zoom=18&addressdetails=1&limit=1&accept-language=es",
			_state_code: "cn",
			SH: [
				{
					name: "Vacaciones de Navidad",
					2019: [
						12,
						23,
						1,
						7
					],
					2020: [
						12,
						23,
						1,
						7
					],
					2021: [
						12,
						23,
						1,
						7
					],
					2022: [
						12,
						23,
						1,
						6
					],
					2023: [
						12,
						25,
						1,
						5
					],
					2024: [
						12,
						23,
						1,
						7
					],
					2025: [
						12,
						22,
						1,
						7
					]
				},
				{
					name: "Vacaciones de Semana Santa",
					2020: [
						4,
						6,
						4,
						10
					],
					2021: [
						3,
						29,
						4,
						2
					],
					2022: [
						4,
						11,
						4,
						15
					],
					2023: [
						4,
						3,
						4,
						7
					],
					2024: [
						3,
						25,
						3,
						29
					],
					2025: [
						4,
						14,
						4,
						18
					],
					2026: [
						3,
						30,
						4,
						5
					]
				},
				{
					name: "Vacaciones de verano",
					2020: [
						6,
						20,
						9,
						14
					],
					2021: [
						6,
						24,
						9,
						8
					],
					2022: [
						6,
						24,
						9,
						8
					],
					2023: [
						6,
						24,
						9,
						10
					],
					2024: [
						6,
						22,
						9,
						9
					],
					2025: [
						6,
						21,
						9,
						8
					]
				},
				{
					name: "Fin de lecciones",
					2026: [
						6,
						19,
						6,
						19
					]
				}
			]
		},
		Cantabria: {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=43.13583&lon=-4.26363&zoom=18&addressdetails=1&limit=1&accept-language=es",
			_state_code: "cb",
			SH: [{
				name: "No lectivos",
				2019: [
					12,
					23,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					7
				],
				2021: [
					12,
					23,
					1,
					7
				],
				2022: [
					12,
					23,
					1,
					5
				],
				2023: [
					12,
					26,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					7
				],
				2025: [
					12,
					24,
					1,
					5
				],
				2026: [
					3,
					30,
					4,
					1
				]
			}, {
				name: "Fin de lecciones",
				2026: [
					6,
					22,
					6,
					22
				]
			}]
		},
		"Castilla y León": {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=41.80371&lon=-4.74717&zoom=18&addressdetails=1&limit=1&accept-language=es",
			_state_code: "cl",
			SH: [
				{
					name: "Vacaciones de Navidad",
					2019: [
						12,
						21,
						1,
						7
					],
					2020: [
						12,
						22,
						1,
						11
					],
					2021: [
						12,
						22,
						1,
						10
					],
					2022: [
						12,
						22,
						1,
						9
					],
					2023: [
						12,
						22,
						1,
						8
					],
					2024: [
						12,
						21,
						1,
						7
					],
					2025: [
						12,
						19,
						1,
						8
					]
				},
				{
					name: "Carnavales",
					2020: [
						2,
						24,
						2,
						25
					],
					2021: [
						2,
						15,
						2,
						16
					],
					2022: [
						2,
						28,
						3,
						1
					],
					2023: [
						2,
						20,
						2,
						21
					],
					2024: [
						2,
						12,
						2,
						13
					],
					2025: [
						3,
						3,
						3,
						4
					],
					2026: [
						2,
						16,
						2,
						17
					]
				},
				{
					name: "Día no lectivo",
					2020: [
						10,
						9,
						10,
						9
					],
					2021: [
						12,
						7,
						12,
						7
					],
					2022: [
						12,
						9,
						12,
						9
					],
					2023: [
						12,
						7,
						12,
						7
					],
					2024: [
						10,
						31,
						10,
						31
					],
					2025: [
						10,
						31,
						10,
						31
					],
					2026: [
						4,
						24,
						4,
						24
					]
				},
				{
					name: "Vacaciones de Semana Santa",
					2020: [
						4,
						3,
						4,
						14
					],
					2021: [
						3,
						25,
						4,
						6
					],
					2022: [
						4,
						6,
						4,
						18
					],
					2023: [
						3,
						29,
						4,
						10
					],
					2024: [
						3,
						22,
						4,
						3
					],
					2025: [
						4,
						12,
						4,
						22
					],
					2026: [
						3,
						26,
						4,
						7
					]
				},
				{
					name: "Vacaciones de verano",
					2020: [
						6,
						24,
						9,
						8
					],
					2021: [
						6,
						24,
						9,
						9
					],
					2022: [
						6,
						24,
						9,
						8
					],
					2023: [
						6,
						24,
						9,
						6
					],
					2024: [
						6,
						22,
						9,
						5
					],
					2025: [
						6,
						24,
						9,
						7
					]
				},
				{
					name: "Fin de lecciones",
					2026: [
						6,
						24,
						6,
						24
					]
				}
			]
		},
		"Castilla-La Mancha": {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=39.41779&lon=-2.62323&zoom=18&addressdetails=1&limit=1&accept-language=es",
			_state_code: "cm",
			SH: [
				{
					name: "Descanso de Navidad",
					2019: [
						12,
						23,
						1,
						7
					],
					2020: [
						12,
						23,
						1,
						7
					],
					2021: [
						12,
						23,
						1,
						7
					],
					2022: [
						12,
						23,
						1,
						8
					],
					2023: [
						12,
						23,
						1,
						7
					],
					2024: [
						12,
						23,
						1,
						6
					],
					2025: [
						12,
						22,
						1,
						6
					]
				},
				{
					name: "Días de libre disposición",
					2020: [
						2,
						24,
						2,
						25
					],
					2021: [
						2,
						15,
						2,
						15
					],
					2022: [
						2,
						28,
						3,
						1
					],
					2023: [
						2,
						20,
						2,
						21
					],
					2024: [
						2,
						12,
						2,
						13
					],
					2025: [
						3,
						3,
						3,
						4
					],
					2026: [
						2,
						16,
						2,
						17
					]
				},
				{
					name: "Día no lectivo",
					2020: [
						11,
						13,
						11,
						13
					],
					2021: [
						11,
						19,
						11,
						19
					],
					2022: [
						11,
						18,
						11,
						18
					],
					2023: [
						12,
						7,
						12,
						7
					],
					2024: [
						11,
						15,
						11,
						15
					],
					2025: [
						11,
						14,
						11,
						14
					],
					2026: [
						5,
						2,
						5,
						2
					]
				},
				{
					name: "Descanso de Semana Santa",
					2020: [
						4,
						6,
						4,
						13
					],
					2021: [
						3,
						29,
						4,
						5
					],
					2022: [
						4,
						11,
						4,
						18
					],
					2023: [
						4,
						3,
						4,
						10
					],
					2024: [
						3,
						25,
						4,
						1
					],
					2025: [
						4,
						14,
						4,
						21
					],
					2026: [
						3,
						30,
						4,
						6
					]
				},
				{
					name: "Vacaciones de verano",
					2020: [
						6,
						26,
						9,
						8
					],
					2021: [
						6,
						29,
						9,
						8
					],
					2022: [
						6,
						25,
						9,
						7
					],
					2023: [
						6,
						24,
						9,
						10
					],
					2024: [
						6,
						22,
						9,
						8
					],
					2025: [
						6,
						19,
						9,
						7
					]
				},
				{
					name: "Fin de lecciones",
					2026: [
						6,
						17,
						6,
						17
					]
				}
			]
		},
		Cataluña: {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=41.85230&lon=1.57450&zoom=18&addressdetails=1&limit=1&accept-language=es,ca,oc",
			_state_code: "ct"
		},
		Catalunya: { SH: [
			{
				name: "Vacaciones de Navidad",
				2019: [
					12,
					21,
					1,
					7
				],
				2020: [
					12,
					22,
					1,
					7
				],
				2021: [
					12,
					23,
					1,
					7
				],
				2022: [
					12,
					22,
					1,
					8
				],
				2023: [
					12,
					21,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					7
				],
				2025: [
					12,
					20,
					1,
					7
				]
			},
			{
				name: "Vacaciones de Semana Santa",
				2020: [
					4,
					4,
					4,
					13
				],
				2021: [
					3,
					27,
					4,
					5
				],
				2022: [
					4,
					11,
					4,
					18
				],
				2023: [
					4,
					3,
					4,
					10
				],
				2024: [
					3,
					23,
					4,
					1
				],
				2025: [
					4,
					12,
					4,
					21
				],
				2026: [
					3,
					28,
					4,
					6
				]
			},
			{
				name: "Vacaciones de verano",
				2020: [
					6,
					20,
					9,
					13
				],
				2021: [
					6,
					23,
					9,
					12
				],
				2022: [
					6,
					23,
					9,
					4
				],
				2023: [
					6,
					23,
					9,
					5
				],
				2024: [
					6,
					22,
					9,
					9
				],
				2025: [
					6,
					19,
					9,
					7
				]
			},
			{
				name: "Fin de lecciones",
				2026: [
					6,
					19,
					6,
					19
				]
			}
		] },
		Ceuta: {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=35.89429&lon=-5.35568&zoom=18&addressdetails=1&limit=1&accept-language=es",
			_state_code: "ce",
			SH: [
				{
					name: "Vacaciones de Navidad",
					2019: [
						12,
						23,
						1,
						7
					],
					2020: [
						12,
						23,
						1,
						7
					],
					2021: [
						12,
						23,
						1,
						7
					],
					2022: [
						12,
						23,
						1,
						5
					],
					2023: [
						12,
						25,
						1,
						5
					],
					2024: [
						12,
						23,
						1,
						7
					],
					2025: [
						12,
						22,
						1,
						7
					]
				},
				{
					name: "Día de libre disposición",
					2020: [
						5,
						25,
						5,
						25
					],
					2021: [
						12,
						7,
						12,
						7
					],
					2022: [
						12,
						5,
						12,
						5
					],
					2023: [
						12,
						7,
						12,
						7
					],
					2024: [
						4,
						10,
						4,
						10
					],
					2025: [
						5,
						2,
						5,
						2
					]
				},
				{
					name: "Días de libre disposición",
					2020: [
						4,
						1,
						4,
						3
					],
					2022: [
						4,
						4,
						4,
						8
					],
					2023: [
						4,
						20,
						4,
						21
					],
					2024: [
						3,
						18,
						3,
						22
					],
					2025: [
						4,
						7,
						4,
						11
					],
					2026: [
						5,
						25,
						5,
						26
					]
				},
				{
					name: "Vacaciones de Semana Santa",
					2020: [
						4,
						6,
						4,
						8
					],
					2021: [
						3,
						29,
						4,
						11
					],
					2022: [
						4,
						11,
						4,
						15
					],
					2023: [
						4,
						3,
						4,
						5
					],
					2024: [
						3,
						25,
						3,
						29
					],
					2025: [
						4,
						14,
						4,
						18
					],
					2026: [
						3,
						30,
						4,
						3
					]
				},
				{
					name: "Vacaciones de verano",
					2020: [
						6,
						23,
						9,
						9
					],
					2021: [
						6,
						23,
						9,
						9
					],
					2022: [
						6,
						24,
						9,
						7
					],
					2023: [
						6,
						24,
						9,
						6
					],
					2024: [
						6,
						22,
						9,
						8
					],
					2025: [
						6,
						24,
						9,
						7
					]
				},
				{
					name: "Fin del Ramadán",
					2021: [
						5,
						13,
						5,
						14
					],
					2022: [
						5,
						3,
						5,
						3
					]
				},
				{
					name: "Fin de lecciones",
					2026: [
						6,
						23,
						6,
						23
					]
				}
			]
		},
		"Comunidad de Madrid": {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=40.52483&lon=-3.77156&zoom=18&addressdetails=1&limit=1&accept-language=es",
			_state_code: "md",
			SH: [
				{
					name: "Vacaciones de Navidad",
					2019: [
						12,
						21,
						1,
						6
					],
					2020: [
						12,
						23,
						1,
						6
					],
					2021: [
						12,
						23,
						1,
						6
					],
					2022: [
						12,
						23,
						1,
						8
					],
					2023: [
						12,
						23,
						1,
						7
					],
					2024: [
						12,
						21,
						1,
						6
					],
					2025: [
						12,
						20,
						1,
						6
					]
				},
				{
					name: "Día no lectivo",
					2020: [
						11,
						2,
						11,
						2
					],
					2021: [
						12,
						7,
						12,
						7
					],
					2022: [
						12,
						7,
						12,
						7
					],
					2023: [
						12,
						7,
						12,
						7
					],
					2024: [
						5,
						3,
						5,
						3
					],
					2025: [
						11,
						3,
						11,
						3
					],
					2026: [
						4,
						6,
						4,
						6
					]
				},
				{
					name: "Vacaciones de Pascua",
					2020: [
						4,
						4,
						4,
						12
					],
					2021: [
						3,
						27,
						4,
						4
					],
					2022: [
						4,
						9,
						4,
						17
					],
					2023: [
						4,
						1,
						4,
						9
					],
					2024: [
						3,
						23,
						3,
						31
					],
					2025: [
						4,
						12,
						4,
						20
					],
					2026: [
						3,
						28,
						4,
						5
					]
				},
				{
					name: "Vacaciones de verano",
					2020: [
						6,
						20,
						9,
						20
					],
					2021: [
						6,
						26,
						9,
						5
					],
					2022: [
						6,
						25,
						9,
						11
					],
					2023: [
						6,
						22,
						9,
						5
					],
					2024: [
						6,
						22,
						9,
						5
					],
					2025: [
						6,
						21,
						9,
						7
					]
				},
				{
					name: "Días de libre disposición",
					2020: [
						12,
						7,
						12,
						8
					],
					2021: [
						1,
						7,
						1,
						8
					],
					2024: [
						2,
						22,
						2,
						23
					]
				},
				{
					name: "Fin de lecciones",
					2026: [
						6,
						19,
						6,
						19
					]
				}
			]
		},
		"Comunidad Valenciana": {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=39.68195&lon=-0.76544&zoom=18&addressdetails=1&limit=1&accept-language=es,ca",
			_state_code: "vc"
		},
		"Comunitat Valenciana": { SH: [
			{
				name: "Vacaciones de Navidad",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					6
				],
				2021: [
					12,
					23,
					1,
					7
				],
				2022: [
					12,
					23,
					1,
					6
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					23,
					1,
					6
				]
			},
			{
				name: "Vacaciones de Pascua",
				2020: [
					4,
					9,
					4,
					20
				],
				2021: [
					4,
					1,
					4,
					12
				],
				2022: [
					4,
					14,
					4,
					25
				],
				2023: [
					4,
					6,
					4,
					17
				],
				2024: [
					3,
					28,
					4,
					8
				],
				2025: [
					4,
					17,
					4,
					28
				],
				2026: [
					4,
					2,
					4,
					13
				]
			},
			{
				name: "Vacaciones de verano",
				2020: [
					6,
					19,
					9,
					6
				],
				2021: [
					6,
					24,
					9,
					7
				],
				2022: [
					6,
					22,
					9,
					11
				],
				2023: [
					6,
					22,
					9,
					10
				],
				2024: [
					6,
					22,
					9,
					8
				],
				2025: [
					6,
					19,
					9,
					7
				]
			},
			{
				name: "Fin de lecciones",
				2026: [
					6,
					19,
					6,
					19
				]
			}
		] },
		Córdoba: { SH: [
			{
				name: "Vacaciones de Navidad",
				2019: [
					12,
					23,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					7
				],
				2021: [
					12,
					23,
					1,
					9
				],
				2022: [
					12,
					23,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Día de la Comunidad Educativa",
				2020: [
					3,
					2,
					3,
					2
				],
				2021: [
					2,
					26,
					2,
					26
				],
				2022: [
					2,
					25,
					2,
					25
				],
				2023: [
					2,
					27,
					2,
					27
				],
				2024: [
					2,
					27,
					2,
					27
				],
				2025: [
					2,
					27,
					2,
					27
				],
				2026: [
					3,
					2,
					3,
					2
				]
			},
			{
				name: "Vacaciones de Semana Santa",
				2020: [
					4,
					5,
					4,
					12
				],
				2021: [
					3,
					29,
					4,
					4
				],
				2022: [
					4,
					11,
					4,
					17
				],
				2023: [
					4,
					3,
					4,
					9
				],
				2024: [
					3,
					23,
					3,
					31
				],
				2025: [
					4,
					14,
					4,
					20
				],
				2026: [
					3,
					30,
					4,
					5
				]
			},
			{
				name: "Vacaciones de verano",
				2020: [
					6,
					24,
					9,
					9
				],
				2021: [
					6,
					23,
					9,
					9
				],
				2022: [
					6,
					25,
					9,
					11
				],
				2023: [
					6,
					24,
					9,
					10
				],
				2024: [
					6,
					23,
					9,
					1
				],
				2025: [
					6,
					25,
					8,
					31
				]
			},
			{
				name: "Día no lectivo",
				2021: [
					12,
					7,
					12,
					7
				],
				2022: [
					12,
					5,
					12,
					5
				],
				2023: [
					12,
					7,
					12,
					7
				],
				2024: [
					3,
					1,
					3,
					1
				],
				2025: [
					5,
					2,
					5,
					2
				],
				2026: [
					1,
					7,
					1,
					7
				]
			},
			{
				name: "Fin de lecciones",
				2026: [
					6,
					22,
					6,
					22
				]
			}
		] },
		"Euskal Herria": { SH: [
			{
				name: "Vacaciones de Navidad",
				2019: [
					12,
					21,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					6
				],
				2021: [
					12,
					24,
					1,
					6
				],
				2022: [
					12,
					24,
					1,
					6
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					24,
					1,
					6
				],
				2025: [
					12,
					24,
					1,
					6
				]
			},
			{
				name: "Vacaciones de Pascua",
				2020: [
					4,
					9,
					4,
					13
				],
				2021: [
					4,
					1,
					4,
					5
				],
				2022: [
					4,
					14,
					4,
					18
				],
				2023: [
					4,
					6,
					4,
					10
				],
				2024: [
					3,
					28,
					4,
					1
				],
				2025: [
					4,
					17,
					4,
					21
				],
				2026: [
					4,
					2,
					4,
					6
				]
			},
			{
				name: "Vacaciones de verano",
				2020: [
					6,
					20,
					9,
					7
				],
				2021: [
					6,
					19,
					9,
					7
				],
				2022: [
					6,
					22,
					9,
					7
				],
				2023: [
					6,
					22,
					9,
					6
				],
				2024: [
					6,
					22,
					9,
					29
				],
				2025: [
					5,
					16,
					9,
					4
				]
			},
			{
				name: "Fin de lecciones",
				2026: [
					6,
					19,
					6,
					19
				]
			}
		] },
		Extremadura: {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=39.17484&lon=-6.15298&zoom=18&addressdetails=1&limit=1&accept-language=es,ast",
			_state_code: "ex",
			SH: [
				{
					name: "Vacaciones de Navidad",
					2019: [
						12,
						23,
						1,
						7
					],
					2020: [
						12,
						23,
						1,
						8
					],
					2021: [
						12,
						23,
						1,
						7
					],
					2022: [
						12,
						23,
						1,
						5
					],
					2023: [
						12,
						22,
						1,
						5
					],
					2024: [
						12,
						23,
						1,
						7
					],
					2025: [
						12,
						23,
						1,
						7
					]
				},
				{
					name: "Día no lectivo",
					2020: [
						12,
						7,
						12,
						7
					],
					2021: [
						11,
						22,
						11,
						22
					],
					2022: [
						12,
						9,
						12,
						9
					],
					2023: [
						12,
						7,
						12,
						7
					],
					2024: [
						11,
						25,
						11,
						25
					],
					2025: [
						11,
						28,
						11,
						28
					]
				},
				{
					name: "Carnavales",
					2020: [
						2,
						24,
						2,
						25
					],
					2021: [
						2,
						15,
						2,
						16
					],
					2022: [
						2,
						28,
						3,
						1
					],
					2023: [
						2,
						20,
						2,
						21
					],
					2024: [
						2,
						12,
						2,
						13
					],
					2025: [
						3,
						3,
						3,
						4
					],
					2026: [
						2,
						16,
						2,
						17
					]
				},
				{
					name: "Vacaciones de Pascua",
					2020: [
						4,
						6,
						4,
						13
					],
					2021: [
						3,
						29,
						4,
						5
					],
					2022: [
						4,
						11,
						4,
						18
					],
					2023: [
						4,
						3,
						4,
						10
					],
					2024: [
						3,
						25,
						4,
						1
					],
					2025: [
						4,
						14,
						4,
						21
					],
					2026: [
						3,
						30,
						4,
						6
					]
				},
				{
					name: "Vacaciones de verano",
					2020: [
						6,
						18,
						9,
						9
					],
					2021: [
						6,
						19,
						9,
						9
					],
					2022: [
						6,
						22,
						9,
						11
					],
					2023: [
						6,
						23,
						9,
						10
					],
					2024: [
						6,
						21,
						9,
						10
					],
					2025: [
						6,
						24,
						9,
						10
					]
				},
				{
					name: "Día de la Comunitat Valenciana",
					2020: [
						10,
						9,
						10,
						9
					],
					2023: [
						10,
						9,
						10,
						9
					]
				},
				{
					name: "Fin de lecciones",
					2026: [
						7,
						23,
						7,
						23
					]
				}
			]
		},
		Galicia: {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=42.61946&lon=-7.86311&zoom=18&addressdetails=1&limit=1&accept-language=es,gl",
			_state_code: "ga",
			SH: [
				{
					name: "Vacaciones de Navidad",
					2019: [
						12,
						21,
						1,
						7
					],
					2020: [
						12,
						23,
						1,
						7
					],
					2021: [
						12,
						22,
						1,
						7
					],
					2022: [
						12,
						23,
						1,
						6
					],
					2023: [
						12,
						22,
						1,
						7
					],
					2024: [
						12,
						23,
						1,
						7
					],
					2025: [
						12,
						22,
						1,
						7
					]
				},
				{
					name: "Vacaciones de Pascua",
					2020: [
						4,
						4,
						4,
						13
					],
					2021: [
						3,
						27,
						4,
						5
					],
					2022: [
						4,
						11,
						4,
						18
					],
					2023: [
						4,
						3,
						4,
						10
					],
					2024: [
						3,
						25,
						4,
						1
					],
					2025: [
						4,
						14,
						4,
						21
					],
					2026: [
						3,
						30,
						4,
						6
					]
				},
				{
					name: "Vacaciones de verano",
					2020: [
						6,
						20,
						9,
						9
					],
					2021: [
						6,
						23,
						9,
						8
					],
					2022: [
						6,
						23,
						9,
						7
					],
					2023: [
						6,
						22,
						9,
						10
					],
					2024: [
						6,
						22,
						9,
						10
					],
					2025: [
						6,
						21,
						9,
						7
					]
				},
				{
					name: "Día de la Educación",
					2020: [
						12,
						7,
						12,
						7
					],
					2021: [
						10,
						11,
						10,
						11
					],
					2022: [
						10,
						31,
						10,
						31
					],
					2023: [
						12,
						7,
						12,
						7
					],
					2024: [
						10,
						31,
						10,
						31
					],
					2025: [
						10,
						31,
						10,
						31
					]
				},
				{
					name: "Carnavales",
					2021: [
						2,
						24,
						2,
						26
					],
					2022: [
						2,
						28,
						3,
						2
					],
					2023: [
						2,
						20,
						2,
						22
					],
					2024: [
						2,
						12,
						2,
						14
					],
					2025: [
						3,
						3,
						4,
						5
					],
					2026: [
						2,
						16,
						2,
						18
					]
				},
				{
					name: "Día no lectivo",
					2025: [
						11,
						3,
						11,
						3
					]
				},
				{
					name: "Fin de lecciones",
					2026: [
						6,
						19,
						6,
						19
					]
				}
			]
		},
		Granada: { SH: [
			{
				name: "Vacaciones de Navidad",
				2019: [
					12,
					23,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					7
				],
				2021: [
					12,
					24,
					1,
					6
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					24,
					1,
					6
				],
				2025: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Día de la Comunidad Educativa",
				2020: [
					3,
					2,
					3,
					2
				],
				2021: [
					2,
					26,
					2,
					26
				],
				2022: [
					3,
					1,
					3,
					1
				],
				2023: [
					2,
					27,
					2,
					27
				],
				2024: [
					2,
					29,
					2,
					29
				],
				2025: [
					2,
					27,
					2,
					27
				],
				2026: [
					3,
					2,
					3,
					2
				]
			},
			{
				name: "Vacaciones de Semana Santa",
				2020: [
					4,
					6,
					4,
					10
				],
				2021: [
					3,
					28,
					4,
					4
				],
				2022: [
					4,
					10,
					4,
					17
				],
				2023: [
					4,
					2,
					4,
					9
				],
				2024: [
					3,
					25,
					3,
					31
				],
				2025: [
					4,
					14,
					4,
					20
				],
				2026: [
					3,
					30,
					4,
					5
				]
			},
			{
				name: "Día no lectivo",
				2020: [
					5,
					4,
					5,
					4
				],
				2021: [
					12,
					7,
					12,
					7
				],
				2022: [
					10,
					31,
					10,
					31
				],
				2023: [
					12,
					7,
					12,
					7
				],
				2024: [
					3,
					1,
					3,
					1
				],
				2025: [
					11,
					3,
					11,
					3
				],
				2026: [
					6,
					5,
					6,
					5
				]
			},
			{
				name: "Vacaciones de verano",
				2020: [
					6,
					24,
					9,
					9
				],
				2021: [
					6,
					23,
					9,
					9
				],
				2022: [
					6,
					25,
					9,
					11
				],
				2023: [
					6,
					24,
					9,
					10
				],
				2024: [
					6,
					24,
					9,
					1
				],
				2025: [
					6,
					25,
					8,
					31
				]
			},
			{
				name: "Fin de lecciones",
				2026: [
					6,
					22,
					6,
					22
				]
			}
		] },
		Huelva: { SH: [
			{
				name: "Vacaciones de Navidad",
				2019: [
					12,
					21,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					6
				],
				2021: [
					12,
					23,
					1,
					9
				],
				2022: [
					12,
					23,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					23,
					1,
					6
				]
			},
			{
				name: "Día de la Comunidad Educativa",
				2020: [
					3,
					2,
					3,
					2
				],
				2021: [
					2,
					26,
					2,
					26
				],
				2022: [
					2,
					25,
					2,
					25
				],
				2023: [
					11,
					2,
					11,
					2
				],
				2025: [
					3,
					3,
					3,
					3
				],
				2026: [
					3,
					2,
					3,
					2
				]
			},
			{
				name: "Vacaciones de Semana Santa",
				2020: [
					4,
					4,
					4,
					12
				],
				2021: [
					3,
					29,
					4,
					4
				],
				2022: [
					4,
					11,
					4,
					17
				],
				2023: [
					4,
					3,
					4,
					9
				],
				2024: [
					3,
					25,
					3,
					31
				],
				2025: [
					4,
					14,
					4,
					20
				],
				2026: [
					3,
					30,
					4,
					1
				]
			},
			{
				name: "Vacaciones de verano",
				2020: [
					6,
					24,
					9,
					9
				],
				2021: [
					6,
					23,
					9,
					9
				],
				2022: [
					6,
					24,
					9,
					11
				],
				2023: [
					6,
					24,
					9,
					10
				],
				2024: [
					6,
					26,
					9,
					9
				],
				2025: [
					6,
					25,
					9,
					9
				]
			},
			{
				name: "Día no lectivo",
				2025: [
					1,
					7,
					1,
					7
				],
				2026: [
					1,
					7,
					1,
					7
				]
			},
			{
				name: "Fin de lecciones",
				2026: [
					6,
					22,
					6,
					22
				]
			}
		] },
		Huesca: { SH: [{
			name: "Día no lectivo",
			2020: [
				2,
				14,
				2,
				14
			],
			2021: [
				2,
				19,
				2,
				19
			],
			2022: [
				2,
				18,
				2,
				18
			],
			2023: [
				2,
				17,
				2,
				17
			],
			2024: [
				2,
				16,
				2,
				16
			],
			2025: [
				2,
				14,
				2,
				14
			],
			2026: [
				2,
				20,
				2,
				20
			]
		}] },
		"Illes Balears": { SH: [
			{
				name: "Vacaciones de Navidad",
				2019: [
					12,
					23,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					7
				],
				2021: [
					12,
					23,
					1,
					7
				],
				2022: [
					12,
					23,
					1,
					5
				],
				2023: [
					12,
					22,
					1,
					5
				],
				2024: [
					12,
					21,
					1,
					7
				],
				2025: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Fiesta Escolar Unificada",
				2020: [
					2,
					28,
					2,
					28
				],
				2021: [
					2,
					26,
					2,
					26
				],
				2022: [
					2,
					28,
					2,
					28
				],
				2023: [
					2,
					28,
					2,
					28
				],
				2024: [
					2,
					29,
					2,
					29
				],
				2025: [
					2,
					28,
					2,
					28
				],
				2026: [
					2,
					27,
					2,
					27
				]
			},
			{
				name: "Vacaciones de Semana Santa",
				2020: [
					4,
					8,
					4,
					19
				],
				2021: [
					4,
					1,
					4,
					11
				],
				2022: [
					4,
					14,
					4,
					22
				],
				2023: [
					4,
					6,
					4,
					14
				],
				2024: [
					3,
					28,
					4,
					5
				],
				2025: [
					4,
					17,
					4,
					27
				],
				2026: [
					4,
					2,
					4,
					12
				]
			},
			{
				name: "Vacaciones de verano",
				2020: [
					6,
					20,
					9,
					9
				],
				2021: [
					6,
					23,
					9,
					9
				],
				2022: [
					6,
					24,
					9,
					11
				],
				2023: [
					6,
					24,
					9,
					10
				],
				2024: [
					6,
					22,
					9,
					10
				],
				2025: [
					6,
					28,
					9,
					9
				]
			},
			{
				name: "Fin de lecciones",
				2026: [
					6,
					19,
					6,
					19
				]
			}
		] },
		"Islas Baleares": {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=39.61340&lon=2.88043&zoom=18&addressdetails=1&limit=1&accept-language=es,ca",
			_state_code: "ib"
		},
		Jaén: { SH: [
			{
				name: "Vacaciones de Navidad",
				2019: [
					12,
					21,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					10
				],
				2021: [
					12,
					23,
					1,
					9
				],
				2022: [
					12,
					23,
					1,
					8
				],
				2023: [
					12,
					25,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					7
				],
				2025: [
					12,
					23,
					1,
					7
				]
			},
			{
				name: "Día de la Comunidad Educativa",
				2020: [
					3,
					2,
					3,
					2
				],
				2021: [
					5,
					3,
					5,
					3
				],
				2022: [
					3,
					1,
					3,
					1
				],
				2023: [
					2,
					27,
					2,
					27
				],
				2024: [
					2,
					29,
					2,
					29
				],
				2025: [
					3,
					3,
					3,
					3
				],
				2026: [
					3,
					2,
					3,
					2
				]
			},
			{
				name: "Vacaciones de Semana Santa",
				2020: [
					4,
					4,
					4,
					12
				],
				2021: [
					3,
					27,
					4,
					4
				],
				2022: [
					4,
					11,
					4,
					17
				],
				2023: [
					4,
					3,
					4,
					9
				],
				2024: [
					3,
					25,
					3,
					31
				],
				2025: [
					4,
					14,
					4,
					20
				],
				2026: [
					3,
					30,
					4,
					5
				]
			},
			{
				name: "Vacaciones de verano",
				2020: [
					6,
					24,
					9,
					9
				],
				2021: [
					6,
					24,
					9,
					9
				],
				2022: [
					6,
					24,
					9,
					11
				],
				2023: [
					6,
					23,
					9,
					10
				],
				2024: [
					6,
					24,
					9,
					1
				],
				2025: [
					6,
					25,
					9,
					1
				]
			},
			{
				name: "Día no lectivo",
				2023: [
					12,
					7,
					12,
					7
				],
				2025: [
					5,
					2,
					5,
					2
				]
			},
			{
				name: "Fin de lecciones",
				2026: [
					6,
					22,
					6,
					22
				]
			}
		] },
		"La Rioja": {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=42.32855&lon=-2.46749&zoom=18&addressdetails=1&limit=1&accept-language=es",
			_state_code: "ri",
			SH: [
				{
					name: "Vacaciones de Navidad",
					2019: [
						12,
						23,
						1,
						7
					],
					2020: [
						12,
						23,
						1,
						8
					],
					2021: [
						12,
						23,
						1,
						7
					],
					2022: [
						12,
						24,
						1,
						8
					],
					2023: [
						12,
						23,
						1,
						7
					],
					2024: [
						12,
						23,
						1,
						6
					],
					2025: [
						12,
						23,
						1,
						7
					]
				},
				{
					name: "Día de la Comunidad Educativa",
					2020: [
						2,
						24,
						2,
						24
					],
					2021: [
						2,
						15,
						2,
						15
					],
					2022: [
						3,
						11,
						3,
						11
					],
					2023: [
						3,
						10,
						3,
						10
					],
					2024: [
						2,
						17,
						2,
						17
					],
					2025: [
						2,
						28,
						2,
						28
					],
					2026: [
						2,
						27,
						2,
						27
					]
				},
				{
					name: "Vacaciones de Pascua",
					2020: [
						4,
						9,
						4,
						17
					],
					2021: [
						4,
						1,
						4,
						9
					],
					2022: [
						4,
						11,
						4,
						15
					],
					2023: [
						4,
						1,
						4,
						10
					],
					2024: [
						3,
						28,
						4,
						7
					],
					2025: [
						4,
						17,
						4,
						25
					],
					2026: [
						3,
						30,
						4,
						6
					]
				},
				{
					name: "Vacaciones de verano",
					2020: [
						6,
						23,
						9,
						6
					],
					2021: [
						6,
						23,
						9,
						5
					],
					2022: [
						6,
						25,
						9,
						7
					],
					2023: [
						6,
						24,
						9,
						6
					],
					2024: [
						6,
						22,
						9,
						5
					],
					2025: [
						6,
						20,
						9,
						8
					]
				},
				{
					name: "Día no lectivo",
					2021: [
						12,
						7,
						12,
						7
					],
					2022: [
						10,
						31,
						10,
						31
					],
					2023: [
						12,
						7,
						12,
						7
					],
					2025: [
						5,
						2,
						5,
						2
					],
					2026: [
						6,
						8,
						6,
						8
					]
				},
				{
					name: "Fin de lecciones",
					2026: [
						6,
						22,
						6,
						22
					]
				}
			]
		},
		Málaga: { SH: [
			{
				name: "Vacaciones de Navidad",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					6
				],
				2021: [
					12,
					24,
					1,
					6
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					25,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					5
				],
				2025: [
					12,
					22,
					1,
					5
				]
			},
			{
				name: "Semana Blanca",
				2020: [
					2,
					24,
					2,
					28
				],
				2021: [
					2,
					22,
					2,
					26
				],
				2022: [
					2,
					28,
					3,
					4
				],
				2023: [
					2,
					27,
					3,
					3
				],
				2024: [
					2,
					26,
					3,
					1
				],
				2025: [
					2,
					24,
					2,
					26
				],
				2026: [
					2,
					23,
					2,
					26
				]
			},
			{
				name: "Vacaciones de Semana Santa",
				2020: [
					4,
					6,
					4,
					12
				],
				2021: [
					3,
					29,
					4,
					4
				],
				2022: [
					4,
					11,
					4,
					15
				],
				2023: [
					4,
					3,
					4,
					7
				],
				2024: [
					3,
					25,
					3,
					29
				],
				2025: [
					4,
					14,
					4,
					20
				],
				2026: [
					3,
					30,
					4,
					1
				]
			},
			{
				name: "Vacaciones de verano",
				2020: [
					6,
					25,
					9,
					9
				],
				2021: [
					6,
					25,
					9,
					9
				],
				2022: [
					6,
					25,
					9,
					11
				],
				2023: [
					6,
					24,
					9,
					10
				],
				2024: [
					6,
					25,
					9,
					9
				],
				2025: [
					6,
					25,
					9,
					4
				]
			},
			{
				name: "Día de la Comunidad Educativa",
				2022: [
					1,
					7,
					1,
					7
				],
				2025: [
					2,
					27,
					2,
					27
				],
				2026: [
					2,
					27,
					2,
					27
				]
			},
			{
				name: "Fin de lecciones",
				2026: [
					6,
					23,
					6,
					23
				]
			}
		] },
		Melilla: {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=35.29186&lon=-2.94090&zoom=18&addressdetails=1&limit=1&accept-language=es",
			_state_code: "ml",
			SH: [
				{
					name: "Vacaciones de Navidad",
					2019: [
						12,
						23,
						1,
						7
					],
					2020: [
						12,
						23,
						1,
						5
					],
					2021: [
						12,
						23,
						1,
						7
					],
					2022: [
						12,
						23,
						1,
						5
					],
					2023: [
						12,
						23,
						1,
						6
					],
					2024: [
						12,
						23,
						1,
						7
					],
					2025: [
						12,
						20,
						1,
						7
					]
				},
				{
					name: "Días de libre disposición",
					2020: [
						4,
						1,
						4,
						3
					],
					2021: [
						3,
						22,
						3,
						26
					],
					2022: [
						4,
						4,
						4,
						8
					],
					2023: [
						3,
						27,
						3,
						31
					],
					2024: [
						3,
						18,
						3,
						22
					],
					2025: [
						4,
						7,
						4,
						11
					],
					2026: [
						3,
						23,
						3,
						27
					]
				},
				{
					name: "Vacaciones de Semana Santa",
					2020: [
						4,
						6,
						4,
						10
					],
					2021: [
						3,
						29,
						4,
						2
					],
					2022: [
						4,
						11,
						4,
						15
					],
					2023: [
						4,
						3,
						4,
						7
					],
					2024: [
						3,
						25,
						3,
						29
					],
					2025: [
						4,
						14,
						4,
						18
					],
					2026: [
						3,
						30,
						4,
						1
					]
				},
				{
					name: "Día de libre disposición",
					2020: [
						12,
						7,
						12,
						7
					],
					2021: [
						12,
						7,
						12,
						7
					],
					2022: [
						12,
						5,
						12,
						5
					],
					2023: [
						12,
						7,
						12,
						7
					],
					2025: [
						5,
						2,
						5,
						2
					],
					2026: [
						5,
						2,
						5,
						2
					]
				},
				{
					name: "Vacaciones de verano",
					2020: [
						6,
						23,
						9,
						7
					],
					2021: [
						6,
						19,
						9,
						6
					],
					2022: [
						6,
						23,
						9,
						5
					],
					2023: [
						6,
						22,
						9,
						6
					],
					2024: [
						6,
						22,
						9,
						8
					],
					2025: [
						6,
						24,
						9,
						9
					]
				},
				{
					name: "Fin de lecciones",
					2026: [
						6,
						19,
						6,
						19
					]
				}
			]
		},
		"Nafarroako Foru Komunitatea": { SH: [
			{
				name: "Vacaciones de Navidad",
				2019: [
					12,
					21,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					8
				],
				2021: [
					12,
					23,
					1,
					9
				],
				2022: [
					12,
					23,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					7
				],
				2025: [
					12,
					20,
					1,
					7
				]
			},
			{
				name: "Vacaciones de Pascua",
				2020: [
					4,
					9,
					4,
					19
				],
				2021: [
					4,
					1,
					4,
					11
				],
				2022: [
					4,
					14,
					4,
					24
				],
				2023: [
					4,
					6,
					4,
					16
				],
				2024: [
					3,
					28,
					4,
					7
				],
				2025: [
					4,
					17,
					4,
					27
				],
				2026: [
					4,
					2,
					4,
					12
				]
			},
			{
				name: "Vacaciones de verano",
				2020: [
					6,
					20,
					9,
					8
				],
				2021: [
					6,
					23,
					9,
					7
				],
				2022: [
					6,
					23,
					9,
					6
				],
				2023: [
					6,
					21,
					9,
					6
				],
				2024: [
					6,
					19,
					9,
					4
				],
				2025: [
					6,
					21,
					9,
					3
				]
			},
			{
				name: "Festividad patronal del nivel educativo",
				2020: [
					11,
					27,
					11,
					27
				],
				2022: [
					11,
					28,
					11,
					28
				],
				2023: [
					11,
					27,
					11,
					27
				],
				2024: [
					11,
					27,
					11,
					27
				],
				2025: [
					11,
					27,
					11,
					27
				]
			},
			{
				name: "Fin de lecciones",
				2026: [
					6,
					19,
					6,
					19
				]
			}
		] },
		Navarra: {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=42.61254&lon=-1.83078&zoom=18&addressdetails=1&limit=1&accept-language=es,eu",
			_state_code: "nc"
		},
		"País Vasco": {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=42.99118&lon=-2.55430&zoom=18&addressdetails=1&limit=1&accept-language=es,eu",
			_state_code: "pv"
		},
		"Región de Murcia": {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=38.06343&lon=-1.67180&zoom=18&addressdetails=1&limit=1&accept-language=es",
			_state_code: "mc",
			SH: [
				{
					name: "Vacaciones de Navidad",
					2019: [
						12,
						24,
						1,
						6
					],
					2020: [
						12,
						24,
						1,
						6
					],
					2021: [
						12,
						24,
						1,
						6
					],
					2022: [
						12,
						24,
						1,
						6
					],
					2023: [
						12,
						24,
						1,
						6
					],
					2024: [
						12,
						24,
						1,
						6
					],
					2025: [
						12,
						24,
						1,
						6
					]
				},
				{
					name: "Vacaciones de Pascua",
					2020: [
						4,
						6,
						4,
						10
					],
					2021: [
						3,
						29,
						4,
						2
					],
					2022: [
						4,
						11,
						4,
						15
					],
					2023: [
						4,
						3,
						4,
						7
					],
					2024: [
						3,
						25,
						4,
						1
					],
					2025: [
						4,
						14,
						4,
						21
					],
					2026: [
						3,
						30,
						4,
						6
					]
				},
				{
					name: "Vacaciones de verano",
					2020: [
						6,
						24,
						9,
						6
					],
					2021: [
						6,
						24,
						9,
						6
					],
					2022: [
						6,
						24,
						9,
						7
					],
					2023: [
						6,
						24,
						9,
						6
					],
					2024: [
						6,
						20,
						9,
						8
					],
					2025: [
						6,
						25,
						9,
						7
					]
				},
				{
					name: "Fin de lecciones",
					2026: [
						6,
						22,
						6,
						22
					]
				}
			]
		},
		Sevilla: { SH: [
			{
				name: "Vacaciones de Navidad",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					6
				],
				2021: [
					12,
					23,
					1,
					7
				],
				2022: [
					12,
					23,
					1,
					6
				],
				2023: [
					12,
					25,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Día de la Comunidad Educativa",
				2020: [
					3,
					2,
					3,
					2
				],
				2021: [
					2,
					26,
					2,
					26
				],
				2022: [
					2,
					25,
					2,
					25
				],
				2023: [
					2,
					27,
					2,
					27
				],
				2024: [
					2,
					27,
					2,
					27
				],
				2025: [
					2,
					27,
					2,
					27
				],
				2026: [
					2,
					27,
					2,
					27
				]
			},
			{
				name: "Vacaciones de Semana Santa",
				2020: [
					4,
					6,
					4,
					12
				],
				2021: [
					3,
					29,
					4,
					4
				],
				2022: [
					4,
					11,
					4,
					17
				],
				2023: [
					4,
					3,
					4,
					9
				],
				2024: [
					3,
					25,
					3,
					31
				],
				2025: [
					4,
					14,
					4,
					20
				],
				2026: [
					3,
					30,
					4,
					5
				]
			},
			{
				name: "Vacaciones de verano",
				2020: [
					6,
					25,
					9,
					9
				],
				2021: [
					6,
					22,
					9,
					9
				],
				2022: [
					6,
					25,
					9,
					11
				],
				2023: [
					6,
					24,
					9,
					10
				],
				2024: [
					6,
					25,
					9,
					1
				],
				2025: [
					6,
					25,
					9,
					2
				]
			},
			{
				name: "Día no lectivo",
				2025: [
					1,
					7,
					1,
					7
				],
				2026: [
					1,
					7,
					1,
					7
				]
			},
			{
				name: "Fin de lecciones",
				2026: [
					6,
					22,
					6,
					22
				]
			}
		] },
		Teruel: { SH: [{
			name: "Día no lectivo",
			2020: [
				2,
				21,
				2,
				21
			],
			2021: [
				2,
				19,
				2,
				19
			],
			2022: [
				2,
				18,
				2,
				18
			],
			2023: [
				2,
				17,
				2,
				17
			],
			2024: [
				2,
				16,
				2,
				16
			],
			2025: [
				2,
				14,
				2,
				14
			],
			2026: [
				2,
				20,
				2,
				20
			]
		}] },
		Zaragoza: { SH: [{
			name: "Día no lectivo",
			2020: [
				10,
				14,
				10,
				14
			],
			2021: [
				10,
				13,
				10,
				13
			],
			2022: [
				10,
				10,
				10,
				10
			],
			2023: [
				3,
				2,
				3,
				2
			],
			2024: [
				10,
				11,
				10,
				11
			],
			2025: [
				10,
				10,
				10,
				10
			],
			2026: [
				4,
				24,
				4,
				24
			]
		}] }
	},
	fi: {
		PH: [
			{
				name: "uudenvuodenpäivä - nyårsdagen",
				fixed_date: [1, 1]
			},
			{
				name: "loppiainen - trettondedagen",
				fixed_date: [1, 6]
			},
			{
				name: "pitkäperjantai - långfredagen",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "pääsiäispäivä - påskdagen",
				variable_date: "easter"
			},
			{
				name: "toinen pääsiäispäivä - annandag påsk",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "vappu - första maj",
				fixed_date: [5, 1]
			},
			{
				name: "helatorstai - Kristi himmelsfärdsdag",
				variable_date: "easter",
				offset: 39
			},
			{
				name: "helluntai - pingst",
				variable_date: "easter",
				offset: 49
			},
			{
				name: "juhannuspäivä - midsommardagen",
				variable_date: "nextSaturday20Jun"
			},
			{
				name: "pyhäinpäivä - alla helgons dag",
				variable_date: "nextSaturday31Oct"
			},
			{
				name: "itsenäisyyspäivä - självständighetsdagen",
				fixed_date: [12, 6]
			},
			{
				name: "joulupäivä - juldagen",
				fixed_date: [12, 25]
			},
			{
				name: "toinen joulupäivä - annandag jul",
				fixed_date: [12, 26]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=63.4965&lon=26.8429&zoom=18&addressdetails=1&accept-language=fi,sv,en"
	},
	fr: {
		PH: [
			{
				name: "Jour de l'an",
				fixed_date: [1, 1]
			},
			{
				name: "Vendredi saint",
				variable_date: "easter",
				offset: -2,
				only_states: [
					"Moselle",
					"Bas-Rhin",
					"Haut-Rhin",
					"Guadeloupe",
					"Martinique",
					"Polynésie française"
				]
			},
			{
				name: "Lundi de Pâques",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Abolition de l'esclavage (Mayotte)",
				fixed_date: [4, 27],
				only_states: ["Mayotte"]
			},
			{
				name: "Saint-Pierre-Chanel",
				fixed_date: [4, 28],
				only_states: ["Wallis-et-Futuna"]
			},
			{
				name: "Fête du Travail",
				fixed_date: [5, 1]
			},
			{
				name: "Fête de la Victoire",
				fixed_date: [5, 8]
			},
			{
				name: "Abolition de l'esclavage (Martinique)",
				fixed_date: [5, 22],
				only_states: ["Martinique"]
			},
			{
				name: "Abolition de l'esclavage (Guadeloupe)",
				fixed_date: [5, 27],
				only_states: ["Guadeloupe"]
			},
			{
				name: "Abolition de l'esclavage (Saint-Martin)",
				fixed_date: [5, 28],
				only_states: ["Saint-Martin (France)"]
			},
			{
				name: "Jeudi de l'Ascension",
				variable_date: "easter",
				offset: 39
			},
			{
				name: "Lundi de Pentecôte",
				variable_date: "easter",
				offset: 50
			},
			{
				name: "Abolition de l'esclavage (Guyane)",
				fixed_date: [6, 10],
				only_states: ["Guyane"]
			},
			{
				name: "Fête de l'autonomie",
				fixed_date: [6, 29],
				only_states: ["Polynésie française"]
			},
			{
				name: "Fête nationale",
				fixed_date: [7, 14]
			},
			{
				name: "Fête Victor Schoelcher",
				fixed_date: [7, 21],
				only_states: ["Guadeloupe", "Martinique"]
			},
			{
				name: "Fête du Territoire",
				fixed_date: [7, 29],
				only_states: ["Wallis-et-Futuna"]
			},
			{
				name: "Assomption",
				fixed_date: [8, 15]
			},
			{
				name: "Fête de la citoyenneté",
				fixed_date: [9, 24],
				only_states: ["Nouvelle-Calédonie"]
			},
			{
				name: "Abolition de l'esclavage (Saint-Barthélemy)",
				fixed_date: [10, 9],
				only_states: ["Saint-Barthélemy"]
			},
			{
				name: "Toussaint",
				fixed_date: [11, 1]
			},
			{
				name: "Armistice",
				fixed_date: [11, 11]
			},
			{
				name: "Abolition de l'esclavage (Réunion)",
				fixed_date: [12, 20],
				only_states: ["Réunion"]
			},
			{
				name: "Noël",
				fixed_date: [12, 25]
			},
			{
				name: "Saint-Étienne ",
				fixed_date: [12, 26],
				only_states: [
					"Moselle",
					"Bas-Rhin",
					"Haut-Rhin"
				]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=46.60333&lon=1.88920&zoom=18&addressdetails=1&accept-language=fr,en",
		"Auvergne-Rhône-Alpes": { SH: [
			{
				name: "Vacances d'hiver",
				2018: [
					2,
					11,
					2,
					25
				],
				2019: [
					2,
					17,
					3,
					3
				],
				2021: [
					2,
					7,
					2,
					21
				],
				2022: [
					2,
					13,
					2,
					27
				],
				2023: [
					2,
					5,
					2,
					19
				],
				2024: [
					2,
					18,
					3,
					3
				],
				2025: [
					2,
					23,
					3,
					9
				],
				2026: [
					2,
					8,
					2,
					22
				],
				2027: [
					2,
					14,
					2,
					28
				]
			},
			{
				name: "Vacances de printemps",
				2018: [
					4,
					8,
					4,
					22
				],
				2019: [
					4,
					14,
					4,
					28
				],
				2020: [
					4,
					19,
					5,
					3
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					17,
					5,
					1
				],
				2023: [
					4,
					9,
					4,
					23
				],
				2024: [
					4,
					14,
					4,
					28
				],
				2025: [
					4,
					20,
					5,
					4
				],
				2026: [
					4,
					5,
					4,
					19
				],
				2027: [
					4,
					11,
					4,
					25
				]
			},
			{
				name: "Pont de l'Ascension",
				2018: [
					5,
					10,
					5,
					10
				],
				2019: [
					5,
					30,
					6,
					2
				],
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2018: [
					7,
					8,
					9,
					2
				],
				2019: [
					7,
					7,
					9,
					1
				],
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2018: [
					10,
					21,
					11,
					4
				],
				2019: [
					10,
					20,
					11,
					3
				],
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Vacances de Noël",
				2018: [
					12,
					23,
					1,
					6
				],
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		"Bourgogne-Franche-Comté": { SH: [
			{
				name: "Vacances d'hiver",
				2018: [
					2,
					11,
					2,
					25
				],
				2019: [
					2,
					17,
					3,
					3
				],
				2021: [
					2,
					7,
					2,
					21
				],
				2022: [
					2,
					13,
					2,
					27
				],
				2023: [
					2,
					5,
					2,
					19
				],
				2024: [
					2,
					18,
					3,
					3
				],
				2025: [
					2,
					23,
					3,
					9
				],
				2026: [
					2,
					8,
					2,
					22
				],
				2027: [
					2,
					14,
					2,
					28
				]
			},
			{
				name: "Vacances de printemps",
				2018: [
					4,
					8,
					4,
					22
				],
				2019: [
					4,
					14,
					4,
					28
				],
				2020: [
					4,
					19,
					5,
					3
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					17,
					5,
					1
				],
				2023: [
					4,
					9,
					4,
					23
				],
				2024: [
					4,
					14,
					4,
					28
				],
				2025: [
					4,
					20,
					5,
					4
				],
				2026: [
					4,
					5,
					4,
					19
				],
				2027: [
					4,
					11,
					4,
					25
				]
			},
			{
				name: "Pont de l'Ascension",
				2018: [
					5,
					10,
					5,
					10
				],
				2019: [
					5,
					30,
					6,
					2
				],
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2018: [
					7,
					8,
					9,
					2
				],
				2019: [
					7,
					7,
					9,
					1
				],
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2018: [
					10,
					21,
					11,
					4
				],
				2019: [
					10,
					20,
					11,
					3
				],
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Vacances de Noël",
				2018: [
					12,
					23,
					1,
					6
				],
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		Bretagne: { SH: [
			{
				name: "Vacances d'hiver",
				2018: [
					2,
					25,
					3,
					11
				],
				2019: [
					2,
					10,
					2,
					24
				],
				2020: [
					2,
					16,
					3,
					1
				],
				2021: [
					2,
					21,
					3,
					7
				],
				2022: [
					2,
					6,
					2,
					20
				],
				2023: [
					2,
					12,
					2,
					26
				],
				2024: [
					2,
					25,
					3,
					10
				],
				2025: [
					2,
					9,
					2,
					23
				],
				2026: [
					2,
					15,
					3,
					1
				],
				2027: [
					2,
					21,
					3,
					7
				]
			},
			{
				name: "Vacances de printemps",
				2018: [
					4,
					22,
					5,
					6
				],
				2019: [
					4,
					7,
					4,
					22
				],
				2020: [
					4,
					12,
					5,
					26
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					10,
					4,
					24
				],
				2023: [
					4,
					16,
					5,
					1
				],
				2024: [
					4,
					21,
					5,
					5
				],
				2025: [
					4,
					6,
					4,
					21
				],
				2026: [
					4,
					12,
					4,
					26
				],
				2027: [
					4,
					18,
					5,
					2
				]
			},
			{
				name: "Pont de l'Ascension",
				2018: [
					5,
					10,
					5,
					10
				],
				2019: [
					5,
					30,
					6,
					2
				],
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2018: [
					7,
					8,
					9,
					2
				],
				2019: [
					7,
					7,
					9,
					1
				],
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2018: [
					10,
					21,
					11,
					4
				],
				2019: [
					10,
					20,
					11,
					3
				],
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Vacances de Noël",
				2018: [
					12,
					23,
					1,
					6
				],
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		"Centre-Val de Loire": { SH: [
			{
				name: "Vacances d'hiver",
				2018: [
					2,
					25,
					3,
					11
				],
				2019: [
					2,
					10,
					2,
					24
				],
				2020: [
					2,
					16,
					3,
					1
				],
				2021: [
					2,
					21,
					3,
					7
				],
				2022: [
					2,
					6,
					2,
					20
				],
				2023: [
					2,
					12,
					2,
					26
				],
				2024: [
					2,
					25,
					3,
					10
				],
				2025: [
					2,
					9,
					2,
					23
				],
				2026: [
					2,
					15,
					3,
					1
				],
				2027: [
					2,
					21,
					3,
					7
				]
			},
			{
				name: "Vacances de printemps",
				2018: [
					4,
					22,
					5,
					6
				],
				2019: [
					4,
					7,
					4,
					22
				],
				2020: [
					4,
					12,
					5,
					26
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					10,
					4,
					24
				],
				2023: [
					4,
					16,
					5,
					1
				],
				2024: [
					4,
					21,
					5,
					5
				],
				2025: [
					4,
					6,
					4,
					21
				],
				2026: [
					4,
					12,
					4,
					26
				],
				2027: [
					4,
					18,
					5,
					2
				]
			},
			{
				name: "Pont de l'Ascension",
				2018: [
					5,
					10,
					5,
					10
				],
				2019: [
					5,
					30,
					6,
					2
				],
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2018: [
					7,
					8,
					9,
					2
				],
				2019: [
					7,
					7,
					9,
					1
				],
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2018: [
					10,
					21,
					11,
					4
				],
				2019: [
					10,
					20,
					11,
					3
				],
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Vacances de Noël",
				2018: [
					12,
					23,
					1,
					6
				],
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		Corse: { SH: [
			{
				name: "Vacances de Noël",
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				]
			},
			{
				name: "Vacances d'hiver",
				2020: [
					2,
					16,
					3,
					1
				],
				2021: [
					2,
					14,
					2,
					28
				],
				2022: [
					2,
					20,
					3,
					6
				],
				2023: [
					2,
					19,
					3,
					5
				],
				2024: [
					2,
					25,
					3,
					10
				],
				2025: [
					2,
					16,
					3,
					2
				],
				2026: [
					2,
					15,
					3,
					1
				]
			},
			{
				name: "Vacances de printemps",
				2020: [
					4,
					19,
					5,
					3
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					24,
					5,
					8
				],
				2023: [
					4,
					16,
					5,
					1
				],
				2024: [
					4,
					28,
					5,
					12
				],
				2025: [
					4,
					13,
					4,
					27
				],
				2026: [
					4,
					12,
					4,
					26
				]
			},
			{
				name: "Pont de l'Ascension",
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				]
			},
			{
				name: "Vacances d'été",
				2020: [
					7,
					5,
					9,
					2
				],
				2021: [
					7,
					9,
					9,
					2
				],
				2022: [
					7,
					9,
					8,
					1
				],
				2023: [
					7,
					8,
					9,
					4
				],
				2024: [
					7,
					7,
					9,
					2
				],
				2025: [
					7,
					6,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				]
			},
			{
				name: "Fin des cours",
				2026: [
					7,
					4,
					7,
					4
				]
			}
		] },
		"Grand Est": { SH: [
			{
				name: "Vacances d'hiver",
				2018: [
					2,
					25,
					3,
					11
				],
				2019: [
					2,
					10,
					2,
					24
				],
				2020: [
					2,
					16,
					3,
					1
				],
				2021: [
					2,
					21,
					3,
					7
				],
				2022: [
					2,
					6,
					2,
					20
				],
				2023: [
					2,
					12,
					2,
					26
				],
				2024: [
					2,
					25,
					3,
					10
				],
				2025: [
					2,
					9,
					2,
					23
				],
				2026: [
					2,
					15,
					3,
					1
				],
				2027: [
					2,
					21,
					3,
					7
				]
			},
			{
				name: "Vacances de printemps",
				2018: [
					4,
					22,
					5,
					6
				],
				2019: [
					4,
					7,
					4,
					22
				],
				2020: [
					4,
					12,
					5,
					26
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					10,
					4,
					24
				],
				2023: [
					4,
					16,
					5,
					1
				],
				2024: [
					4,
					21,
					5,
					5
				],
				2025: [
					4,
					6,
					4,
					21
				],
				2026: [
					4,
					12,
					4,
					26
				],
				2027: [
					4,
					18,
					5,
					2
				]
			},
			{
				name: "Pont de l'Ascension",
				2018: [
					5,
					10,
					5,
					10
				],
				2019: [
					5,
					30,
					6,
					2
				],
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2018: [
					7,
					8,
					9,
					2
				],
				2019: [
					7,
					7,
					9,
					1
				],
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2018: [
					10,
					21,
					11,
					4
				],
				2019: [
					10,
					20,
					11,
					3
				],
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Vacances de Noël",
				2018: [
					12,
					23,
					1,
					6
				],
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		Guadeloupe: { SH: [
			{
				name: "Vacances de Noël",
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				]
			},
			{
				name: "Vacances de Carnaval",
				2020: [
					2,
					16,
					3,
					1
				],
				2021: [
					2,
					10,
					2,
					21
				],
				2022: [
					2,
					20,
					3,
					6
				],
				2023: [
					2,
					12,
					2,
					26
				],
				2025: [
					2,
					23,
					3,
					9
				],
				2026: [
					2,
					8,
					2,
					22
				]
			},
			{
				name: "Vacances de Pâques",
				2020: [
					4,
					9,
					4,
					22
				],
				2021: [
					3,
					28,
					4,
					11
				],
				2022: [
					4,
					10,
					4,
					24
				],
				2023: [
					4,
					2,
					4,
					26
				],
				2025: [
					4,
					18,
					5,
					4
				],
				2026: [
					4,
					18,
					5,
					4
				]
			},
			{
				name: "Semaine en Mai",
				2020: [
					5,
					22,
					5,
					23
				],
				2021: [
					5,
					29,
					5,
					29
				],
				2022: [
					5,
					23,
					5,
					25
				],
				2024: [
					5,
					10,
					5,
					11
				],
				2025: [
					5,
					30,
					5,
					31
				],
				2026: [
					5,
					15,
					5,
					16
				]
			},
			{
				name: "Vacances d'été",
				2020: [
					7,
					5,
					8,
					31
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					23,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				]
			},
			{
				name: "Fin des cours",
				2026: [
					7,
					4,
					7,
					4
				]
			}
		] },
		Guyane: { SH: [
			{
				name: "Vacances de Noël",
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				]
			},
			{
				name: "Vacances de Carnaval",
				2020: [
					2,
					16,
					3,
					1
				],
				2021: [
					2,
					14,
					2,
					28
				],
				2022: [
					2,
					20,
					3,
					6
				],
				2024: [
					2,
					11,
					2,
					25
				],
				2025: [
					2,
					23,
					3,
					9
				],
				2026: [
					2,
					8,
					2,
					22
				]
			},
			{
				name: "Vacances de Pâques",
				2020: [
					4,
					10,
					4,
					27
				],
				2021: [
					4,
					2,
					4,
					18
				],
				2022: [
					4,
					15,
					5,
					1
				],
				2024: [
					4,
					21,
					5,
					2
				],
				2025: [
					4,
					18,
					5,
					4
				],
				2026: [
					4,
					2,
					4,
					15
				]
			},
			{
				name: "Pont de l'Ascension",
				2020: [
					5,
					23,
					5,
					24
				],
				2021: [
					5,
					14,
					5,
					15
				],
				2022: [
					5,
					27,
					5,
					28
				],
				2023: [
					5,
					14,
					5,
					21
				],
				2024: [
					5,
					10,
					5,
					11
				],
				2025: [
					5,
					30,
					5,
					31
				]
			},
			{
				name: "Vacances d'été",
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					4,
					9,
					1
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2025: [
					7,
					6,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2020: [
					10,
					25,
					11,
					8
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				]
			},
			{
				name: "Vacances d'hiver",
				2023: [
					2,
					19,
					3,
					5
				]
			},
			{
				name: "Semaine en Mai",
				2026: [
					5,
					15,
					5,
					16
				]
			},
			{
				name: "Fin des cours",
				2026: [
					7,
					4,
					7,
					4
				]
			}
		] },
		"Hauts-de-France": { SH: [
			{
				name: "Vacances d'hiver",
				2018: [
					2,
					25,
					3,
					11
				],
				2019: [
					2,
					10,
					2,
					24
				],
				2020: [
					2,
					16,
					3,
					1
				],
				2021: [
					2,
					21,
					3,
					7
				],
				2022: [
					2,
					6,
					2,
					20
				],
				2023: [
					2,
					12,
					2,
					26
				],
				2024: [
					2,
					25,
					3,
					10
				],
				2025: [
					2,
					9,
					2,
					23
				],
				2026: [
					2,
					15,
					3,
					1
				],
				2027: [
					2,
					21,
					3,
					7
				]
			},
			{
				name: "Vacances de printemps",
				2018: [
					4,
					22,
					5,
					6
				],
				2019: [
					4,
					7,
					4,
					22
				],
				2020: [
					4,
					12,
					5,
					26
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					10,
					4,
					24
				],
				2023: [
					4,
					16,
					5,
					1
				],
				2024: [
					4,
					21,
					5,
					5
				],
				2025: [
					4,
					6,
					4,
					21
				],
				2026: [
					4,
					12,
					4,
					26
				],
				2027: [
					4,
					18,
					5,
					2
				]
			},
			{
				name: "Pont de l'Ascension",
				2018: [
					5,
					10,
					5,
					10
				],
				2019: [
					5,
					30,
					6,
					2
				],
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2018: [
					7,
					8,
					9,
					2
				],
				2019: [
					7,
					7,
					9,
					1
				],
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2018: [
					10,
					21,
					11,
					4
				],
				2019: [
					10,
					20,
					11,
					3
				],
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Vacances de Noël",
				2018: [
					12,
					23,
					1,
					6
				],
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		"Île-de-France": { SH: [
			{
				name: "Vacances d'hiver",
				2018: [
					2,
					18,
					3,
					4
				],
				2019: [
					2,
					24,
					3,
					10
				],
				2020: [
					2,
					9,
					2,
					23
				],
				2021: [
					2,
					14,
					2,
					28
				],
				2022: [
					2,
					20,
					3,
					6
				],
				2023: [
					2,
					19,
					3,
					5
				],
				2024: [
					2,
					11,
					2,
					25
				],
				2025: [
					2,
					16,
					3,
					2
				],
				2026: [
					2,
					22,
					3,
					8
				],
				2027: [
					2,
					7,
					2,
					21
				]
			},
			{
				name: "Vacances de printemps",
				2018: [
					4,
					15,
					4,
					29
				],
				2019: [
					4,
					21,
					5,
					5
				],
				2020: [
					4,
					5,
					4,
					19
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					24,
					5,
					8
				],
				2023: [
					4,
					23,
					5,
					8
				],
				2024: [
					4,
					7,
					4,
					21
				],
				2025: [
					4,
					13,
					4,
					27
				],
				2026: [
					4,
					19,
					5,
					3
				],
				2027: [
					4,
					4,
					4,
					18
				]
			},
			{
				name: "Pont de l'Ascension",
				2018: [
					5,
					10,
					5,
					10
				],
				2019: [
					5,
					30,
					6,
					2
				],
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2018: [
					7,
					8,
					9,
					2
				],
				2019: [
					7,
					7,
					9,
					1
				],
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2018: [
					10,
					21,
					11,
					4
				],
				2019: [
					10,
					20,
					11,
					3
				],
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Vacances de Noël",
				2018: [
					12,
					23,
					1,
					6
				],
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		"La Réunion": { SH: [
			{
				name: "Vacances d'été austral",
				2019: [
					12,
					20,
					1,
					26
				],
				2020: [
					12,
					20,
					1,
					24
				],
				2021: [
					12,
					19,
					1,
					23
				],
				2022: [
					12,
					18,
					1,
					22
				],
				2023: [
					12,
					20,
					1,
					21
				],
				2024: [
					12,
					20,
					1,
					20
				],
				2025: [
					12,
					20,
					1,
					20
				],
				2026: [
					12,
					20,
					1,
					31
				]
			},
			{
				name: "Vacances après troisième période",
				2020: [
					3,
					9,
					3,
					22
				],
				2021: [
					3,
					7,
					3,
					21
				],
				2022: [
					3,
					13,
					3,
					27
				],
				2023: [
					3,
					12,
					3,
					26
				],
				2024: [
					3,
					3,
					3,
					17
				],
				2025: [
					3,
					2,
					3,
					16
				],
				2026: [
					3,
					1,
					3,
					15
				],
				2027: [
					3,
					17,
					3,
					29
				]
			},
			{
				name: "Vacances après quatrième période",
				2020: [
					5,
					1,
					5,
					13
				],
				2021: [
					5,
					5,
					5,
					16
				],
				2022: [
					5,
					15,
					5,
					29
				],
				2023: [
					5,
					14,
					5,
					29
				],
				2024: [
					5,
					5,
					5,
					20
				],
				2025: [
					5,
					4,
					5,
					18
				],
				2026: [
					5,
					3,
					5,
					17
				],
				2027: [
					5,
					6,
					5,
					18
				]
			},
			{
				name: "Vacances d'hiver austral",
				2020: [
					7,
					5,
					8,
					16
				],
				2021: [
					7,
					8,
					8,
					15
				],
				2022: [
					7,
					10,
					8,
					15
				],
				2023: [
					7,
					9,
					8,
					16
				],
				2024: [
					7,
					7,
					8,
					18
				],
				2025: [
					7,
					6,
					8,
					18
				],
				2026: [
					7,
					5,
					8,
					17
				],
				2027: [
					7,
					11,
					8,
					15
				]
			},
			{
				name: "Vacances après première période",
				2020: [
					10,
					11,
					10,
					25
				],
				2021: [
					10,
					10,
					10,
					24
				],
				2022: [
					10,
					9,
					10,
					23
				],
				2023: [
					10,
					15,
					10,
					29
				],
				2024: [
					10,
					13,
					10,
					27
				],
				2025: [
					10,
					12,
					10,
					26
				],
				2026: [
					10,
					11,
					10,
					24
				]
			}
		] },
		Martinique: { SH: [
			{
				name: "Vacances de Noël",
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				]
			},
			{
				name: "Vacances de Carnaval",
				2020: [
					2,
					23,
					3,
					8
				],
				2021: [
					2,
					7,
					2,
					21
				],
				2022: [
					2,
					20,
					3,
					6
				],
				2023: [
					2,
					12,
					2,
					26
				],
				2024: [
					2,
					11,
					2,
					25
				],
				2025: [
					2,
					23,
					3,
					9
				],
				2026: [
					2,
					8,
					2,
					22
				]
			},
			{
				name: "Vacances de Pâques",
				2020: [
					4,
					5,
					4,
					19
				],
				2021: [
					3,
					28,
					4,
					11
				],
				2022: [
					4,
					10,
					4,
					24
				],
				2023: [
					4,
					2,
					4,
					16
				],
				2024: [
					3,
					24,
					4,
					7
				],
				2025: [
					4,
					13,
					4,
					27
				],
				2026: [
					3,
					28,
					4,
					12
				]
			},
			{
				name: "Pas de cours",
				2020: [
					5,
					22,
					5,
					23
				],
				2021: [
					5,
					14,
					5,
					15
				],
				2022: [
					5,
					27,
					5,
					28
				],
				2023: [
					5,
					19,
					5,
					20
				],
				2024: [
					5,
					10,
					5,
					11
				],
				2025: [
					5,
					30,
					5,
					31
				],
				2026: [
					5,
					15,
					5,
					16
				]
			},
			{
				name: "Vacances d'été",
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2020: [
					10,
					25,
					11,
					8
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				]
			},
			{
				name: "Fin des cours",
				2026: [
					7,
					4,
					7,
					4
				]
			}
		] },
		Mayotte: { SH: [
			{
				name: "Vacances de Noël",
				2019: [
					12,
					15,
					1,
					12
				],
				2020: [
					12,
					13,
					1,
					10
				],
				2021: [
					12,
					12,
					1,
					9
				],
				2022: [
					12,
					11,
					1,
					8
				],
				2023: [
					12,
					17,
					1,
					14
				],
				2024: [
					12,
					15,
					1,
					12
				],
				2025: [
					12,
					14,
					1,
					11
				]
			},
			{
				name: "Vacances de février",
				2020: [
					3,
					1,
					3,
					15
				],
				2021: [
					2,
					28,
					3,
					14
				],
				2022: [
					2,
					27,
					3,
					13
				],
				2023: [
					2,
					19,
					3,
					5
				],
				2024: [
					2,
					25,
					3,
					10
				],
				2025: [
					3,
					2,
					3,
					16
				],
				2026: [
					3,
					2,
					3,
					8
				]
			},
			{
				name: "Vacances de Pâques",
				2020: [
					5,
					3,
					5,
					10
				],
				2021: [
					5,
					2,
					5,
					16
				],
				2022: [
					5,
					1,
					5,
					15
				],
				2023: [
					4,
					23,
					5,
					7
				],
				2024: [
					4,
					28,
					5,
					12
				],
				2025: [
					4,
					27,
					5,
					11
				],
				2026: [
					4,
					26,
					5,
					11
				]
			},
			{
				name: "Vacances d'été",
				2020: [
					7,
					5,
					8,
					23
				],
				2021: [
					7,
					7,
					8,
					23
				],
				2022: [
					7,
					6,
					8,
					23
				],
				2023: [
					7,
					8,
					8,
					22
				],
				2024: [
					7,
					7,
					8,
					25
				],
				2025: [
					7,
					5,
					8,
					22
				]
			},
			{
				name: "Vacances de la Toussaint",
				2020: [
					10,
					11,
					10,
					25
				],
				2021: [
					10,
					10,
					10,
					24
				],
				2022: [
					10,
					9,
					10,
					23
				],
				2023: [
					10,
					15,
					10,
					29
				],
				2024: [
					10,
					13,
					10,
					27
				],
				2025: [
					10,
					12,
					10,
					26
				]
			},
			{
				name: "Fin des cours",
				2026: [
					7,
					4,
					8,
					21
				]
			}
		] },
		Normandie: { SH: [
			{
				name: "Vacances d'hiver",
				2018: [
					2,
					25,
					3,
					11
				],
				2019: [
					2,
					10,
					2,
					24
				],
				2020: [
					2,
					16,
					3,
					1
				],
				2021: [
					2,
					21,
					3,
					7
				],
				2022: [
					2,
					6,
					2,
					20
				],
				2023: [
					2,
					12,
					2,
					26
				],
				2024: [
					2,
					25,
					3,
					10
				],
				2025: [
					2,
					9,
					2,
					23
				],
				2026: [
					2,
					15,
					3,
					1
				],
				2027: [
					2,
					21,
					3,
					7
				]
			},
			{
				name: "Vacances de printemps",
				2018: [
					4,
					22,
					5,
					6
				],
				2019: [
					4,
					7,
					4,
					22
				],
				2020: [
					4,
					12,
					5,
					26
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					10,
					4,
					24
				],
				2023: [
					4,
					16,
					5,
					1
				],
				2024: [
					4,
					21,
					5,
					5
				],
				2025: [
					4,
					6,
					4,
					21
				],
				2026: [
					4,
					12,
					4,
					26
				],
				2027: [
					4,
					18,
					5,
					2
				]
			},
			{
				name: "Pont de l'Ascension",
				2018: [
					5,
					10,
					5,
					10
				],
				2019: [
					5,
					30,
					6,
					2
				],
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2018: [
					7,
					8,
					9,
					2
				],
				2019: [
					7,
					7,
					9,
					1
				],
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2018: [
					10,
					21,
					11,
					4
				],
				2019: [
					10,
					20,
					11,
					3
				],
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Vacances de Noël",
				2018: [
					12,
					23,
					1,
					6
				],
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		"Nouvelle-Aquitaine": { SH: [
			{
				name: "Vacances d'hiver",
				2018: [
					2,
					11,
					2,
					25
				],
				2019: [
					2,
					17,
					3,
					3
				],
				2021: [
					2,
					7,
					2,
					21
				],
				2022: [
					2,
					13,
					2,
					27
				],
				2023: [
					2,
					5,
					2,
					19
				],
				2024: [
					2,
					18,
					3,
					3
				],
				2025: [
					2,
					23,
					3,
					9
				],
				2026: [
					2,
					8,
					2,
					22
				],
				2027: [
					2,
					14,
					2,
					28
				]
			},
			{
				name: "Vacances de printemps",
				2018: [
					4,
					8,
					4,
					22
				],
				2019: [
					4,
					14,
					4,
					28
				],
				2020: [
					4,
					19,
					5,
					3
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					17,
					5,
					1
				],
				2023: [
					4,
					9,
					4,
					23
				],
				2024: [
					4,
					14,
					4,
					28
				],
				2025: [
					4,
					20,
					5,
					4
				],
				2026: [
					4,
					5,
					4,
					19
				],
				2027: [
					4,
					11,
					4,
					25
				]
			},
			{
				name: "Pont de l'Ascension",
				2018: [
					5,
					10,
					5,
					10
				],
				2019: [
					5,
					30,
					6,
					2
				],
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2018: [
					7,
					8,
					9,
					2
				],
				2019: [
					7,
					7,
					9,
					1
				],
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2018: [
					10,
					21,
					11,
					4
				],
				2019: [
					10,
					20,
					11,
					3
				],
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Vacances de Noël",
				2018: [
					12,
					23,
					1,
					6
				],
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		Occitanie: { SH: [
			{
				name: "Vacances d'hiver",
				2018: [
					2,
					18,
					3,
					4
				],
				2019: [
					2,
					24,
					3,
					10
				],
				2020: [
					2,
					9,
					2,
					23
				],
				2021: [
					2,
					14,
					2,
					28
				],
				2022: [
					2,
					20,
					3,
					6
				],
				2023: [
					2,
					19,
					3,
					5
				],
				2024: [
					2,
					11,
					2,
					25
				],
				2025: [
					2,
					16,
					3,
					2
				],
				2026: [
					2,
					22,
					3,
					8
				]
			},
			{
				name: "Vacances de printemps",
				2018: [
					4,
					15,
					4,
					29
				],
				2019: [
					4,
					21,
					5,
					5
				],
				2020: [
					4,
					5,
					4,
					19
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					24,
					5,
					8
				],
				2023: [
					4,
					23,
					5,
					8
				],
				2024: [
					4,
					7,
					4,
					21
				],
				2025: [
					4,
					13,
					4,
					27
				],
				2026: [
					4,
					19,
					5,
					3
				],
				2027: [
					4,
					4,
					4,
					18
				]
			},
			{
				name: "Pont de l'Ascension",
				2018: [
					5,
					10,
					5,
					10
				],
				2019: [
					5,
					30,
					6,
					2
				],
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2018: [
					7,
					8,
					9,
					2
				],
				2019: [
					7,
					7,
					9,
					1
				],
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2018: [
					10,
					21,
					11,
					4
				],
				2019: [
					10,
					20,
					11,
					3
				],
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Vacances de Noël",
				2018: [
					12,
					23,
					1,
					6
				],
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		"Pays de la Loire": { SH: [
			{
				name: "Vacances d'hiver",
				2018: [
					2,
					25,
					3,
					11
				],
				2019: [
					2,
					10,
					2,
					24
				],
				2020: [
					2,
					16,
					3,
					1
				],
				2021: [
					2,
					21,
					3,
					7
				],
				2022: [
					2,
					6,
					2,
					20
				],
				2023: [
					2,
					12,
					2,
					26
				],
				2024: [
					2,
					25,
					3,
					10
				],
				2025: [
					2,
					9,
					2,
					23
				],
				2026: [
					2,
					15,
					3,
					1
				],
				2027: [
					2,
					21,
					3,
					7
				]
			},
			{
				name: "Vacances de printemps",
				2018: [
					4,
					22,
					5,
					6
				],
				2019: [
					4,
					7,
					4,
					22
				],
				2020: [
					4,
					12,
					5,
					26
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					10,
					4,
					24
				],
				2023: [
					4,
					16,
					5,
					1
				],
				2024: [
					4,
					21,
					5,
					5
				],
				2025: [
					4,
					6,
					4,
					21
				],
				2026: [
					4,
					12,
					4,
					26
				],
				2027: [
					4,
					18,
					5,
					2
				]
			},
			{
				name: "Pont de l'Ascension",
				2018: [
					5,
					10,
					5,
					10
				],
				2019: [
					5,
					30,
					6,
					2
				],
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2018: [
					7,
					8,
					9,
					2
				],
				2019: [
					7,
					7,
					9,
					1
				],
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2018: [
					10,
					21,
					11,
					4
				],
				2019: [
					10,
					20,
					11,
					3
				],
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Vacances de Noël",
				2018: [
					12,
					23,
					1,
					6
				],
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		"Provence-Alpes-Côte d'Azur": { SH: [
			{
				name: "Vacances d'hiver",
				2018: [
					2,
					25,
					3,
					11
				],
				2019: [
					2,
					10,
					2,
					24
				],
				2020: [
					2,
					16,
					3,
					1
				],
				2021: [
					2,
					21,
					3,
					7
				],
				2022: [
					2,
					6,
					2,
					20
				],
				2023: [
					2,
					12,
					2,
					26
				],
				2024: [
					2,
					25,
					3,
					10
				],
				2025: [
					2,
					9,
					2,
					23
				],
				2026: [
					2,
					15,
					3,
					1
				],
				2027: [
					2,
					21,
					3,
					7
				]
			},
			{
				name: "Vacances de printemps",
				2018: [
					4,
					22,
					5,
					6
				],
				2019: [
					4,
					7,
					4,
					22
				],
				2020: [
					4,
					12,
					5,
					26
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					10,
					4,
					24
				],
				2023: [
					4,
					16,
					5,
					1
				],
				2024: [
					4,
					21,
					5,
					5
				],
				2025: [
					4,
					6,
					4,
					21
				],
				2026: [
					4,
					12,
					4,
					26
				],
				2027: [
					4,
					18,
					5,
					2
				]
			},
			{
				name: "Pont de l'Ascension",
				2018: [
					5,
					10,
					5,
					10
				],
				2019: [
					5,
					30,
					6,
					2
				],
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2018: [
					7,
					8,
					9,
					2
				],
				2019: [
					7,
					7,
					9,
					1
				],
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2018: [
					10,
					21,
					11,
					4
				],
				2019: [
					10,
					20,
					11,
					3
				],
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Vacances de Noël",
				2018: [
					12,
					23,
					1,
					6
				],
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		"Saint-Barthélemy": { SH: [
			{
				name: "Vacances de Noël",
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				]
			},
			{
				name: "Vacances de Carnaval",
				2020: [
					2,
					16,
					3,
					1
				],
				2021: [
					2,
					10,
					2,
					21
				],
				2022: [
					2,
					20,
					3,
					6
				],
				2023: [
					2,
					12,
					2,
					26
				],
				2025: [
					2,
					23,
					3,
					9
				],
				2026: [
					2,
					8,
					2,
					22
				]
			},
			{
				name: "Vacances de Pâques",
				2020: [
					4,
					9,
					4,
					22
				],
				2021: [
					3,
					28,
					4,
					11
				],
				2022: [
					4,
					10,
					4,
					24
				],
				2023: [
					4,
					2,
					4,
					26
				],
				2025: [
					4,
					18,
					5,
					4
				],
				2026: [
					4,
					18,
					5,
					4
				]
			},
			{
				name: "Semaine en Mai",
				2020: [
					5,
					22,
					5,
					23
				],
				2024: [
					5,
					10,
					5,
					11
				],
				2025: [
					5,
					30,
					5,
					31
				],
				2026: [
					5,
					15,
					5,
					16
				]
			},
			{
				name: "Vacances d'été",
				2020: [
					7,
					5,
					8,
					31
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					23,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				]
			},
			{
				name: "Fin des cours",
				2026: [
					7,
					4,
					7,
					4
				]
			}
		] },
		"Saint-Martin": { SH: [
			{
				name: "Vacances de Noël",
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				]
			},
			{
				name: "Vacances de Carnaval",
				2020: [
					2,
					16,
					3,
					1
				],
				2021: [
					2,
					10,
					2,
					21
				],
				2022: [
					2,
					20,
					3,
					6
				],
				2023: [
					2,
					12,
					2,
					26
				],
				2025: [
					2,
					23,
					3,
					9
				],
				2026: [
					2,
					8,
					2,
					22
				]
			},
			{
				name: "Vacances de Pâques",
				2020: [
					4,
					9,
					4,
					22
				],
				2021: [
					3,
					28,
					4,
					11
				],
				2022: [
					4,
					10,
					4,
					24
				],
				2023: [
					4,
					2,
					4,
					26
				],
				2025: [
					4,
					18,
					5,
					4
				],
				2026: [
					4,
					18,
					5,
					4
				]
			},
			{
				name: "Semaine en Mai",
				2020: [
					5,
					22,
					5,
					23
				],
				2021: [
					5,
					29,
					5,
					29
				],
				2022: [
					5,
					23,
					5,
					25
				],
				2024: [
					5,
					10,
					5,
					11
				],
				2025: [
					5,
					30,
					5,
					31
				]
			},
			{
				name: "Vacances d'été",
				2020: [
					7,
					5,
					8,
					31
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					23,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				]
			},
			{
				name: "Fin des cours",
				2026: [
					7,
					4,
					7,
					4
				]
			}
		] },
		"Saint-Pierre-et-Miquelon": { SH: [
			{
				name: "Vacances de Noël",
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				]
			},
			{
				name: "Pont de l'Ascension",
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2025: [
					5,
					28,
					6,
					1
				]
			},
			{
				name: "Vacances d'été",
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					23,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				]
			},
			{
				name: "Vacances de printemps",
				2021: [
					4,
					11,
					4,
					25
				],
				2025: [
					4,
					19,
					5,
					4
				]
			},
			{
				name: "Vacances d'hiver",
				2025: [
					2,
					23,
					3,
					9
				]
			},
			{
				name: "Fin des cours",
				2026: [
					7,
					4,
					7,
					4
				]
			}
		] },
		"Zone A": { SH: [
			{
				name: "Vacances de Noël",
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Vacances de printemps",
				2020: [
					4,
					19,
					5,
					3
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					17,
					5,
					1
				],
				2023: [
					4,
					9,
					4,
					23
				],
				2024: [
					4,
					14,
					4,
					28
				],
				2025: [
					4,
					20,
					5,
					4
				],
				2026: [
					4,
					5,
					4,
					19
				],
				2027: [
					4,
					11,
					4,
					25
				]
			},
			{
				name: "Pont de l'Ascension",
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Vacances d'hiver",
				2021: [
					2,
					7,
					2,
					21
				],
				2022: [
					2,
					13,
					2,
					27
				],
				2023: [
					2,
					5,
					2,
					19
				],
				2024: [
					2,
					18,
					3,
					3
				],
				2025: [
					2,
					23,
					3,
					9
				],
				2026: [
					2,
					8,
					2,
					22
				],
				2027: [
					2,
					14,
					2,
					28
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		"Zone B": { SH: [
			{
				name: "Vacances de Noël",
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Vacances d'hiver",
				2020: [
					2,
					16,
					3,
					1
				],
				2021: [
					2,
					21,
					3,
					7
				],
				2022: [
					2,
					6,
					2,
					20
				],
				2023: [
					2,
					12,
					2,
					26
				],
				2024: [
					2,
					25,
					3,
					10
				],
				2025: [
					2,
					9,
					2,
					23
				],
				2026: [
					2,
					15,
					3,
					1
				],
				2027: [
					2,
					21,
					3,
					7
				]
			},
			{
				name: "Vacances de printemps",
				2020: [
					4,
					12,
					5,
					26
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					10,
					4,
					24
				],
				2023: [
					4,
					16,
					5,
					1
				],
				2024: [
					4,
					21,
					5,
					5
				],
				2025: [
					4,
					6,
					4,
					21
				],
				2026: [
					4,
					12,
					4,
					26
				],
				2027: [
					4,
					18,
					5,
					2
				]
			},
			{
				name: "Pont de l'Ascension",
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] },
		"Zone C": { SH: [
			{
				name: "Vacances de Noël",
				2019: [
					12,
					22,
					1,
					5
				],
				2020: [
					12,
					20,
					1,
					3
				],
				2021: [
					12,
					19,
					1,
					2
				],
				2022: [
					12,
					18,
					1,
					2
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					22,
					1,
					5
				],
				2025: [
					12,
					21,
					1,
					4
				],
				2026: [
					12,
					20,
					1,
					3
				]
			},
			{
				name: "Vacances d'hiver",
				2020: [
					2,
					9,
					2,
					23
				],
				2021: [
					2,
					14,
					2,
					28
				],
				2022: [
					2,
					20,
					3,
					6
				],
				2023: [
					2,
					19,
					3,
					5
				],
				2024: [
					2,
					11,
					2,
					25
				],
				2025: [
					2,
					16,
					3,
					2
				],
				2026: [
					2,
					22,
					3,
					8
				],
				2027: [
					2,
					7,
					2,
					21
				]
			},
			{
				name: "Vacances de printemps",
				2020: [
					4,
					5,
					4,
					19
				],
				2021: [
					4,
					11,
					4,
					25
				],
				2022: [
					4,
					24,
					5,
					8
				],
				2023: [
					4,
					23,
					5,
					8
				],
				2024: [
					4,
					7,
					4,
					21
				],
				2025: [
					4,
					13,
					4,
					27
				],
				2026: [
					4,
					19,
					5,
					3
				],
				2027: [
					4,
					4,
					4,
					18
				]
			},
			{
				name: "Pont de l'Ascension",
				2020: [
					5,
					21,
					5,
					24
				],
				2021: [
					5,
					13,
					5,
					16
				],
				2022: [
					5,
					26,
					5,
					29
				],
				2023: [
					5,
					18,
					5,
					21
				],
				2027: [
					5,
					6,
					5,
					9
				]
			},
			{
				name: "Vacances d'été",
				2020: [
					7,
					5,
					8,
					31
				],
				2021: [
					7,
					7,
					9,
					1
				],
				2022: [
					7,
					8,
					8,
					31
				],
				2023: [
					7,
					9,
					9,
					3
				],
				2024: [
					7,
					7,
					9,
					1
				],
				2025: [
					7,
					6,
					8,
					31
				],
				2026: [
					7,
					5,
					8,
					31
				]
			},
			{
				name: "Vacances de la Toussaint",
				2020: [
					10,
					18,
					11,
					1
				],
				2021: [
					10,
					24,
					11,
					7
				],
				2022: [
					10,
					23,
					11,
					6
				],
				2023: [
					10,
					22,
					11,
					5
				],
				2024: [
					10,
					20,
					11,
					3
				],
				2025: [
					10,
					19,
					11,
					2
				],
				2026: [
					10,
					18,
					11,
					1
				]
			},
			{
				name: "Fin des cours",
				2027: [
					7,
					3,
					7,
					3
				]
			}
		] }
	},
	gb: {
		England: {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=51.5073219&lon=-0.1276474&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year’s Day",
					fixed_date: [1, 1]
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Easter Monday",
					variable_date: "easter",
					offset: 1
				},
				{
					name: "Early May bank holiday",
					variable_date: "firstMayMonday"
				},
				{
					name: "Spring bank holiday",
					variable_date: "lastMayMonday"
				},
				{
					name: "Summer bank holiday",
					variable_date: "lastAugustMonday"
				},
				{
					name: "Christmas",
					fixed_date: [12, 25]
				},
				{
					name: "Boxing Day",
					fixed_date: [12, 26]
				}
			]
		},
		"Northern Ireland": {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=54.5950675&lon=-5.9298401&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year’s Day",
					fixed_date: [1, 1]
				},
				{
					name: "St Patrick’s Day",
					variable_date: "nextMo-Fr17March"
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Easter Monday",
					variable_date: "easter",
					offset: 1
				},
				{
					name: "Early May bank holiday",
					variable_date: "firstMayMonday"
				},
				{
					name: "Spring bank holiday",
					variable_date: "lastMayMonday"
				},
				{
					name: "Battle of the Boyne",
					variable_date: "nextMo-Fr12July"
				},
				{
					name: "Summer bank holiday",
					variable_date: "lastAugustMonday"
				},
				{
					name: "Christmas",
					fixed_date: [12, 25]
				},
				{
					name: "Boxing Day",
					fixed_date: [12, 26]
				}
			]
		},
		Scotland: {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=55.9557307&lon=-3.1976026&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year’s Day",
					fixed_date: [1, 1]
				},
				{
					name: "2nd January",
					fixed_date: [1, 2]
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Early May bank holiday",
					variable_date: "firstMayMonday"
				},
				{
					name: "Spring bank holiday",
					variable_date: "lastMayMonday"
				},
				{
					name: "Summer bank holiday",
					variable_date: "lastAugustMonday"
				},
				{
					name: "St. Andrew’s Day",
					variable_date: "nextMo-Fr30November"
				},
				{
					name: "Christmas",
					fixed_date: [12, 25]
				},
				{
					name: "Boxing Day",
					fixed_date: [12, 26]
				}
			]
		},
		Wales: {
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=52.2928116&lon=-3.73893&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year’s Day",
					fixed_date: [1, 1]
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Easter Monday",
					variable_date: "easter",
					offset: 1
				},
				{
					name: "Early May bank holiday",
					variable_date: "firstMayMonday"
				},
				{
					name: "Spring bank holiday",
					variable_date: "lastMayMonday"
				},
				{
					name: "Summer bank holiday",
					variable_date: "lastAugustMonday"
				},
				{
					name: "Christmas",
					fixed_date: [12, 25]
				},
				{
					name: "Boxing Day",
					fixed_date: [12, 26]
				}
			]
		}
	},
	gr: {
		PH: [
			{
				name: "Πρωτοχρονιά",
				fixed_date: [1, 1]
			},
			{
				name: "Θεοφάνια",
				fixed_date: [1, 6]
			},
			{
				name: "Καθαρά Δευτέρα",
				variable_date: "orthodox easter",
				offset: -48
			},
			{
				name: "25η Μαρτίου",
				fixed_date: [3, 25]
			},
			{
				name: "Μεγάλη Παρασκευή",
				variable_date: "orthodox easter",
				offset: -2
			},
			{
				name: "Πάσχα",
				variable_date: "orthodox easter",
				offset: 0
			},
			{
				name: "Δευτέρα του Πάσχα",
				variable_date: "orthodox easter",
				offset: 1
			},
			{
				name: "Πρωτομαγιά",
				fixed_date: [5, 1]
			},
			{
				name: "Κοίμηση της Θεοτόκου",
				fixed_date: [8, 15]
			},
			{
				name: "28η Οκτωβρίου",
				fixed_date: [10, 28]
			},
			{
				name: "Χριστούγεννα",
				fixed_date: [12, 25]
			},
			{
				name: "2η μέρα Χριστουγέννων",
				fixed_date: [12, 26]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Greece&&zoom=18&addressdetails=1&limit=1&accept-language=el,en"
	},
	hr: {
		PH: [
			{
				name: "Nova godina",
				fixed_date: [1, 1]
			},
			{
				name: "Sveta tri kralja",
				fixed_date: [1, 6]
			},
			{
				name: "Uskršnji ponedjeljak",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Praznik rada",
				fixed_date: [5, 1]
			},
			{
				name: "Tijelovo",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Dan antifašističke borbe",
				fixed_date: [6, 22]
			},
			{
				name: "Dan pobjede i domovinske zahvalnosti",
				fixed_date: [8, 5]
			},
			{
				name: "Velika Gospa",
				fixed_date: [8, 15]
			},
			{
				name: "Svi sveti",
				fixed_date: [11, 1]
			},
			{
				name: "Dan sjećanja na žrtve Domovinskog rata",
				fixed_date: [11, 18]
			},
			{
				name: "Božić",
				fixed_date: [12, 25]
			},
			{
				name: "Sveti Stjepan",
				fixed_date: [12, 26]
			}
		],
		SH: [
			{
				name: "Zimski odmor",
				2019: [
					12,
					23,
					1,
					3
				],
				2025: [
					12,
					24,
					1,
					9
				]
			},
			{
				name: "Zimski odmor (prvi dio)",
				2019: [
					12,
					23,
					1,
					3
				],
				2020: [
					12,
					24,
					1,
					8
				],
				2021: [
					12,
					24,
					1,
					7
				],
				2022: [
					12,
					27,
					1,
					5
				],
				2023: [
					12,
					27,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				]
			},
			{
				name: "Zimski odmor (drugi dio)",
				2020: [
					2,
					24,
					2,
					28
				],
				2021: [
					2,
					23,
					2,
					26
				],
				2022: [
					2,
					21,
					2,
					25
				],
				2023: [
					2,
					20,
					2,
					24
				],
				2024: [
					2,
					19,
					2,
					23
				],
				2025: [
					2,
					24,
					2,
					28
				]
			},
			{
				name: "Proljetni odmor",
				2020: [
					4,
					10,
					4,
					17
				],
				2021: [
					4,
					2,
					4,
					9
				],
				2022: [
					4,
					14,
					4,
					22
				],
				2023: [
					4,
					6,
					4,
					14
				],
				2024: [
					3,
					28,
					4,
					5
				],
				2025: [
					4,
					17,
					4,
					25
				],
				2026: [
					3,
					30,
					4,
					6
				]
			},
			{
				name: "Ljetni odmor",
				2020: [
					6,
					18,
					9,
					6
				],
				2021: [
					6,
					21,
					9,
					5
				],
				2022: [
					6,
					23,
					9,
					4
				],
				2023: [
					6,
					23,
					9,
					3
				],
				2024: [
					6,
					24,
					9,
					1
				],
				2025: [
					6,
					19,
					8,
					31
				],
				2026: [
					6,
					15,
					8,
					31
				]
			},
			{
				name: "Jesenski odmor",
				2020: [
					11,
					2,
					11,
					3
				],
				2021: [
					11,
					2,
					11,
					3
				],
				2022: [
					10,
					31,
					11,
					1
				],
				2023: [
					10,
					30,
					11,
					1
				],
				2024: [
					10,
					31,
					11,
					1
				]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lon=15.977&lat=45.813&zoom=18&addressdetails=1&accept-language=hr,en"
	},
	hu: {
		PH: [
			{
				name: "újév",
				fixed_date: [1, 1]
			},
			{
				name: "az 1848-as forradalom ünnepe",
				fixed_date: [3, 15]
			},
			{
				name: "nagypéntek",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "húsvétvasárnap",
				variable_date: "easter"
			},
			{
				name: "húsvéthétfő",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "pünkösdvasárnap",
				variable_date: "easter",
				offset: 49
			},
			{
				name: "pünkösdhétfő",
				variable_date: "easter",
				offset: 50
			},
			{
				name: "a munka ünnepe",
				fixed_date: [5, 1]
			},
			{
				name: "az államalapítás ünnepe",
				fixed_date: [8, 20]
			},
			{
				name: "az 1956-os forradalom ünnepe",
				fixed_date: [10, 23]
			},
			{
				name: "mindenszentek",
				fixed_date: [11, 1]
			},
			{
				name: "karácsony",
				fixed_date: [12, 25]
			},
			{
				name: "karácsony másnap",
				fixed_date: [12, 26]
			}
		],
		SH: [
			{
				name: "Őszi szünet",
				2014: [
					10,
					23,
					11,
					2
				],
				2015: [
					10,
					23,
					11,
					1
				],
				2016: [
					10,
					29,
					11,
					6
				],
				2017: [
					10,
					28,
					11,
					5
				],
				2018: [
					10,
					27,
					11,
					4
				],
				2019: [
					10,
					26,
					11,
					3
				],
				2020: [
					10,
					22,
					11,
					1
				],
				2021: [
					10,
					23,
					11,
					1
				],
				2022: [
					10,
					29,
					11,
					6
				],
				2023: [
					10,
					28,
					11,
					5
				],
				2024: [
					10,
					26,
					11,
					3
				],
				2025: [
					10,
					23,
					11,
					2
				]
			},
			{
				name: "Téli szünet",
				2014: [
					12,
					20,
					1,
					4
				],
				2015: [
					12,
					19,
					1,
					3
				],
				2016: [
					12,
					22,
					1,
					2
				],
				2017: [
					12,
					23,
					1,
					2
				],
				2018: [
					12,
					22,
					1,
					2
				],
				2019: [
					12,
					23,
					1,
					5
				],
				2020: [
					12,
					18,
					1,
					3
				],
				2021: [
					12,
					22,
					1,
					2
				],
				2022: [
					12,
					22,
					1,
					8
				],
				2023: [
					12,
					21,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					20,
					1,
					4
				]
			},
			{
				name: "Tavaszi szünet",
				2015: [
					4,
					2,
					4,
					7
				],
				2016: [
					3,
					24,
					3,
					29
				],
				2017: [
					4,
					13,
					4,
					18
				],
				2018: [
					3,
					29,
					4,
					3
				],
				2019: [
					4,
					18,
					4,
					23
				],
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					3,
					31,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					29,
					4,
					7
				],
				2025: [
					4,
					17,
					4,
					27
				],
				2026: [
					4,
					2,
					4,
					12
				]
			},
			{
				name: "Nyári szünet",
				2015: [
					6,
					16,
					8,
					31
				],
				2016: [
					6,
					16,
					8,
					31
				],
				2017: [
					6,
					16,
					8,
					31
				],
				2018: [
					6,
					16,
					9,
					2
				],
				2019: [
					6,
					15,
					9,
					1
				],
				2020: [
					6,
					16,
					8,
					31
				],
				2021: [
					6,
					16,
					8,
					31
				],
				2022: [
					6,
					16,
					8,
					31
				],
				2023: [
					6,
					16,
					8,
					31
				],
				2024: [
					6,
					16,
					8,
					31
				],
				2025: [
					6,
					21,
					8,
					31
				],
				2026: [
					6,
					20,
					8,
					31
				]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=47.4821&lon=19.0640&zoom=18&addressdetails=1&accept-language=hu,en"
	},
	ie: {
		PH: [
			{
				name: "New Year’s Day",
				fixed_date: [1, 1]
			},
			{
				name: "St Patrick’s Day",
				fixed_date: [3, 17]
			},
			{
				name: "St Patrick’s Day",
				variable_date: "nextMo-Fr17March"
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Easter Monday",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "May Bank Holiday",
				variable_date: "firstMayMonday"
			},
			{
				name: "June Bank Holiday",
				variable_date: "firstJuneMonday"
			},
			{
				name: "August Bank Holiday",
				variable_date: "firstAugustMonday"
			},
			{
				name: "October Bank Holiday (Halloween)",
				variable_date: "lastOctoberMonday"
			},
			{
				name: "Christmas",
				fixed_date: [12, 25]
			},
			{
				name: "St Stephen’s Day",
				fixed_date: [12, 26]
			},
			{
				name: "Bank Holiday",
				fixed_date: [12, 27]
			}
		],
		SH: [
			{
				name: "Christmas",
				2019: [
					12,
					20,
					1,
					5
				],
				2020: [
					12,
					22,
					1,
					5
				],
				2021: [
					12,
					22,
					1,
					5
				],
				2022: [
					12,
					21,
					1,
					4
				],
				2023: [
					12,
					22,
					1,
					7
				],
				2024: [
					12,
					20,
					1,
					5
				],
				2025: [
					12,
					19,
					1,
					4
				]
			},
			{
				name: "February mid-term break",
				2020: [
					2,
					20,
					2,
					21
				],
				2021: [
					2,
					18,
					2,
					19
				],
				2022: [
					2,
					24,
					2,
					25
				],
				2023: [
					2,
					16,
					2,
					17
				],
				2024: [
					2,
					15,
					2,
					16
				],
				2025: [
					2,
					20,
					2,
					21
				],
				2026: [
					2,
					19,
					2,
					20
				]
			},
			{
				name: "Easter",
				2020: [
					4,
					3,
					4,
					19
				],
				2021: [
					3,
					26,
					4,
					11
				],
				2022: [
					4,
					8,
					4,
					24
				],
				2023: [
					3,
					31,
					4,
					16
				],
				2024: [
					3,
					22,
					4,
					7
				],
				2025: [
					4,
					11,
					4,
					27
				],
				2026: [
					3,
					27,
					4,
					12
				]
			},
			{
				name: "October mid-term break",
				2020: [
					10,
					26,
					10,
					30
				],
				2021: [
					10,
					25,
					10,
					29
				],
				2022: [
					10,
					31,
					11,
					4
				],
				2023: [
					10,
					30,
					11,
					3
				],
				2024: [
					10,
					28,
					11,
					1
				],
				2025: [
					10,
					27,
					10,
					31
				]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=53.1424&lon=-7.6921&zoom=18&addressdetails=1&accept-language=ga,en"
	},
	it: {
		PH: [
			{
				name: "Capodanno",
				fixed_date: [1, 1]
			},
			{
				name: "Epifania",
				fixed_date: [1, 6]
			},
			{
				name: "Liberazione dal nazifascismo (1945)",
				fixed_date: [4, 25]
			},
			{
				name: "Pasqua",
				variable_date: "easter"
			},
			{
				name: "Lunedì di Pasqua",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Festa del lavoro",
				fixed_date: [5, 1]
			},
			{
				name: "Festa della Repubblica",
				fixed_date: [6, 2]
			},
			{
				name: "Assunzione di Maria",
				fixed_date: [8, 15]
			},
			{
				name: "Ognissanti",
				fixed_date: [11, 1]
			},
			{
				name: "Immacolata Concezione",
				fixed_date: [12, 8]
			},
			{
				name: "Natale di Gesù",
				fixed_date: [12, 25]
			},
			{
				name: "Santo Stefano",
				fixed_date: [12, 26]
			}
		],
		SH: [{
			name: "festività pasquali",
			2020: [
				4,
				9,
				4,
				14
			],
			2021: [
				4,
				1,
				4,
				6
			],
			2022: [
				4,
				14,
				4,
				19
			]
		}, {
			name: "vacanza galleggiante",
			2020: [
				4,
				24,
				4,
				24
			]
		}],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=41.9808038&lon=12.7662312&zoom=18&addressdetails=1&accept-language=it,en",
		Abruzzo: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					24,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					5
				],
				2021: [
					12,
					24,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					12,
					7,
					12,
					7
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					10,
					31,
					10,
					31
				],
				2023: [
					12,
					9,
					12,
					9
				],
				2024: [
					11,
					2,
					11,
					2
				],
				2025: [
					4,
					26,
					4,
					26
				],
				2026: [
					6,
					1,
					6,
					1
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					9,
					9,
					24
				],
				2021: [
					6,
					11,
					9,
					12
				],
				2022: [
					6,
					9,
					9,
					11
				],
				2023: [
					6,
					11,
					9,
					12
				],
				2024: [
					6,
					8,
					9,
					15
				],
				2025: [
					6,
					8,
					9,
					14
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					9,
					6,
					9
				]
			}
		] },
		Basilicata: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					5
				],
				2021: [
					12,
					24,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					12,
					7,
					12,
					7
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					11,
					2,
					11,
					2
				],
				2023: [
					12,
					9,
					12,
					9
				],
				2024: [
					11,
					2,
					11,
					2
				],
				2025: [
					4,
					26,
					4,
					26
				],
				2026: [
					6,
					1,
					6,
					1
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					12,
					9,
					24
				],
				2021: [
					6,
					12,
					9,
					12
				],
				2022: [
					6,
					9,
					9,
					11
				],
				2023: [
					6,
					11,
					9,
					12
				],
				2024: [
					6,
					8,
					9,
					15
				],
				2025: [
					6,
					11,
					9,
					14
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "vacanze galleggianti",
				2024: [
					4,
					26,
					4,
					27
				],
				2025: [
					3,
					3,
					3,
					4
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					10,
					6,
					10
				]
			}
		] },
		Bolzano: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					21,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					5
				],
				2021: [
					12,
					24,
					1,
					8
				],
				2022: [
					12,
					24,
					1,
					5
				],
				2023: [
					12,
					27,
					1,
					5
				],
				2024: [
					12,
					24,
					1,
					6
				],
				2025: [
					12,
					24,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					11,
					2,
					11,
					2
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					11,
					2,
					11,
					2
				],
				2023: [
					5,
					29,
					5,
					29
				],
				2024: [
					5,
					20,
					5,
					20
				],
				2025: [
					6,
					9,
					6,
					9
				],
				2026: [
					6,
					1,
					6,
					1
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					17,
					9,
					7
				],
				2021: [
					6,
					17,
					9,
					5
				],
				2022: [
					6,
					17,
					9,
					4
				],
				2023: [
					6,
					17,
					9,
					4
				],
				2024: [
					6,
					14,
					9,
					4
				],
				2025: [
					6,
					14,
					9,
					7
				]
			},
			{
				name: "vacanze galleggianti",
				2020: [
					11,
					3,
					11,
					7
				],
				2021: [
					11,
					3,
					11,
					6
				],
				2022: [
					12,
					9,
					12,
					10
				],
				2023: [
					11,
					1,
					11,
					3
				],
				2024: [
					10,
					26,
					11,
					3
				],
				2025: [
					3,
					1,
					3,
					9
				],
				2026: [
					2,
					14,
					2,
					22
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					8
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					16,
					6,
					16
				]
			}
		] },
		Calabria: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					24,
					1,
					6
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					23,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					12,
					7,
					12,
					7
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					10,
					31,
					10,
					31
				],
				2023: [
					12,
					9,
					12,
					9
				],
				2024: [
					11,
					2,
					11,
					2
				],
				2025: [
					4,
					26,
					4,
					26
				],
				2026: [
					5,
					2,
					5,
					2
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					10,
					9,
					24
				],
				2021: [
					6,
					13,
					9,
					19
				],
				2022: [
					6,
					10,
					9,
					13
				],
				2023: [
					6,
					11,
					9,
					13
				],
				2024: [
					6,
					8,
					9,
					15
				],
				2025: [
					6,
					8,
					9,
					15
				]
			},
			{
				name: "vacanze galleggianti",
				2022: [
					12,
					9,
					12,
					10
				],
				2024: [
					4,
					26,
					4,
					27
				],
				2025: [
					5,
					2,
					5,
					3
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					8,
					6,
					8
				]
			}
		] },
		Campania: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					21,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					8
				],
				2022: [
					12,
					23,
					1,
					5
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					23,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					12,
					7,
					12,
					7
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					11,
					2,
					11,
					2
				],
				2023: [
					12,
					9,
					12,
					9
				],
				2024: [
					11,
					2,
					11,
					2
				],
				2025: [
					4,
					26,
					4,
					26
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					7,
					9,
					24
				],
				2021: [
					6,
					13,
					9,
					14
				],
				2022: [
					6,
					9,
					9,
					12
				],
				2023: [
					6,
					11,
					9,
					12
				],
				2024: [
					6,
					8,
					9,
					15
				],
				2025: [
					6,
					8,
					9,
					14
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "vacanze galleggianti",
				2024: [
					2,
					12,
					2,
					13
				],
				2025: [
					5,
					2,
					5,
					3
				],
				2026: [
					2,
					16,
					2,
					17
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					6,
					6,
					6
				]
			}
		] },
		"Emilia-Romagna": { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					24,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					5
				],
				2021: [
					12,
					24,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					5
				],
				2023: [
					12,
					24,
					1,
					5
				],
				2024: [
					12,
					24,
					1,
					6
				],
				2025: [
					12,
					24,
					1,
					6
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					7,
					9,
					14
				],
				2021: [
					6,
					6,
					9,
					12
				],
				2022: [
					6,
					5,
					9,
					14
				],
				2023: [
					6,
					8,
					9,
					14
				],
				2024: [
					6,
					6,
					9,
					15
				],
				2025: [
					6,
					7,
					9,
					14
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					11,
					2,
					11,
					2
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					11,
					2,
					11,
					2
				],
				2023: [
					11,
					2,
					11,
					2
				],
				2024: [
					11,
					2,
					11,
					2
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					6,
					6,
					6
				]
			}
		] },
		"Friuli Venezia Giulia": { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					5
				],
				2021: [
					12,
					24,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					7
				],
				2023: [
					12,
					27,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					23,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					12,
					7,
					12,
					7
				],
				2021: [
					2,
					17,
					2,
					17
				],
				2022: [
					10,
					31,
					10,
					31
				],
				2023: [
					4,
					24,
					4,
					24
				],
				2024: [
					11,
					2,
					11,
					2
				],
				2025: [
					4,
					26,
					4,
					26
				],
				2026: [
					6,
					1,
					6,
					1
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					11,
					9,
					16
				],
				2021: [
					6,
					11,
					9,
					15
				],
				2022: [
					6,
					12,
					9,
					11
				],
				2023: [
					6,
					11,
					9,
					12
				],
				2024: [
					6,
					8,
					9,
					15
				],
				2025: [
					6,
					8,
					9,
					10
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "vacanze galleggianti",
				2024: [
					2,
					12,
					2,
					14
				],
				2025: [
					3,
					3,
					3,
					5
				],
				2026: [
					2,
					16,
					2,
					18
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					9,
					6,
					9
				]
			}
		] },
		Lazio: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					6
				],
				2022: [
					12,
					23,
					1,
					5
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					23,
					1,
					6
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					8,
					9,
					14
				],
				2021: [
					6,
					9,
					9,
					12
				],
				2022: [
					6,
					9,
					9,
					14
				],
				2023: [
					6,
					9,
					9,
					14
				],
				2024: [
					6,
					8,
					9,
					15
				],
				2025: [
					6,
					8,
					9,
					14
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					12,
					7,
					12,
					7
				]
			},
			{
				name: "vacanze galleggianti",
				2021: [
					5,
					31,
					6,
					1
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					8,
					6,
					8
				]
			}
		] },
		Liguria: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					5
				],
				2021: [
					12,
					24,
					1,
					8
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					27,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					12,
					7,
					12,
					7
				],
				2023: [
					4,
					24,
					4,
					24
				],
				2026: [
					6,
					1,
					6,
					1
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					11,
					9,
					14
				],
				2021: [
					6,
					10,
					9,
					14
				],
				2022: [
					6,
					11,
					9,
					13
				],
				2023: [
					6,
					11,
					9,
					13
				],
				2024: [
					6,
					8,
					9,
					15
				],
				2025: [
					6,
					11,
					9,
					14
				]
			},
			{
				name: "vacanze galleggianti",
				2022: [
					6,
					3,
					6,
					4
				],
				2024: [
					4,
					29,
					4,
					30
				],
				2025: [
					5,
					2,
					5,
					3
				],
				2026: [
					2,
					16,
					2,
					17
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					21
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					11,
					6,
					11
				]
			}
		] },
		Lombardia: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					5
				],
				2022: [
					12,
					23,
					1,
					5
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					23,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					2,
					29,
					2,
					29
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					3,
					1,
					3,
					1
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					8,
					9,
					14
				],
				2021: [
					6,
					9,
					9,
					12
				],
				2022: [
					6,
					9,
					9,
					11
				],
				2023: [
					6,
					9,
					9,
					11
				],
				2024: [
					6,
					8,
					9,
					15
				],
				2025: [
					6,
					8,
					9,
					11
				]
			},
			{
				name: "vacanze galleggianti",
				2021: [
					2,
					19,
					2,
					20
				],
				2022: [
					3,
					4,
					3,
					5
				],
				2023: [
					2,
					24,
					2,
					25
				],
				2024: [
					2,
					12,
					2,
					13
				],
				2025: [
					3,
					3,
					3,
					4
				],
				2026: [
					2,
					16,
					2,
					17
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					21
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					8,
					6,
					8
				]
			}
		] },
		Marche: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					24,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					5
				],
				2021: [
					12,
					24,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					7
				],
				2023: [
					12,
					24,
					1,
					6
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					23,
					1,
					6
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					7,
					9,
					14
				],
				2021: [
					6,
					6,
					9,
					14
				],
				2022: [
					6,
					5,
					9,
					13
				],
				2023: [
					6,
					11,
					9,
					12
				],
				2024: [
					6,
					6,
					9,
					15
				],
				2025: [
					6,
					8,
					9,
					14
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					11,
					2,
					11,
					2
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					11,
					2,
					11,
					2
				],
				2023: [
					12,
					9,
					12,
					9
				],
				2024: [
					11,
					2,
					11,
					2
				],
				2025: [
					4,
					26,
					4,
					26
				],
				2026: [
					6,
					1,
					6,
					1
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "vacanze galleggianti",
				2023: [
					11,
					1,
					11,
					3
				],
				2024: [
					4,
					26,
					4,
					27
				],
				2025: [
					5,
					2,
					5,
					3
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					6,
					6,
					6
				]
			}
		] },
		Molise: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					8
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					11,
					2,
					11,
					2
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					11,
					2,
					11,
					2
				],
				2023: [
					12,
					9,
					12,
					9
				],
				2024: [
					12,
					7,
					12,
					7
				],
				2025: [
					4,
					26,
					4,
					26
				],
				2026: [
					6,
					1,
					6,
					1
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					7,
					9,
					14
				],
				2021: [
					6,
					6,
					9,
					14
				],
				2022: [
					6,
					9,
					9,
					13
				],
				2023: [
					6,
					11,
					9,
					13
				],
				2024: [
					6,
					8,
					9,
					15
				],
				2025: [
					6,
					8,
					9,
					14
				]
			},
			{
				name: "vacanze galleggianti",
				2022: [
					12,
					9,
					12,
					10
				],
				2024: [
					4,
					29,
					4,
					30
				],
				2025: [
					5,
					2,
					5,
					3
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					9,
					6,
					9
				]
			}
		] },
		Piemonte: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					24,
					1,
					8
				],
				2022: [
					12,
					24,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					12,
					7,
					12,
					7
				],
				2021: [
					2,
					17,
					2,
					17
				],
				2022: [
					3,
					1,
					3,
					1
				],
				2023: [
					12,
					9,
					12,
					9
				],
				2024: [
					11,
					2,
					11,
					2
				],
				2025: [
					3,
					1,
					3,
					1
				],
				2026: [
					6,
					1,
					6,
					1
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					11,
					9,
					14
				],
				2021: [
					6,
					12,
					9,
					12
				],
				2022: [
					6,
					9,
					9,
					11
				],
				2023: [
					6,
					11,
					9,
					10
				],
				2024: [
					6,
					8,
					9,
					15
				],
				2025: [
					6,
					8,
					9,
					9
				]
			},
			{
				name: "vacanze galleggianti",
				2022: [
					12,
					9,
					12,
					10
				],
				2024: [
					4,
					26,
					4,
					27
				],
				2025: [
					5,
					2,
					5,
					3
				],
				2026: [
					2,
					14,
					2,
					17
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					10,
					6,
					10
				]
			}
		] },
		Puglia: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					9
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					12,
					2,
					12,
					2
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					10,
					31,
					10,
					31
				],
				2023: [
					12,
					9,
					12,
					9
				],
				2025: [
					4,
					26,
					4,
					26
				],
				2026: [
					6,
					1,
					6,
					1
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					11,
					9,
					24
				],
				2021: [
					6,
					12,
					9,
					19
				],
				2022: [
					6,
					10,
					9,
					13
				],
				2023: [
					6,
					11,
					9,
					13
				],
				2024: [
					6,
					7,
					9,
					15
				],
				2025: [
					6,
					8,
					9,
					15
				]
			},
			{
				name: "vacanze galleggianti",
				2022: [
					12,
					9,
					12,
					10
				],
				2024: [
					2,
					12,
					2,
					13
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					9,
					6,
					9
				]
			}
		] },
		Sardegna: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					5
				],
				2022: [
					12,
					23,
					1,
					5
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					23,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					11,
					2,
					11,
					2
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					11,
					2,
					11,
					2
				],
				2023: [
					11,
					2,
					11,
					2
				],
				2024: [
					11,
					2,
					11,
					2
				],
				2025: [
					4,
					28,
					4,
					28
				],
				2026: [
					5,
					2,
					5,
					2
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					7,
					9,
					22
				],
				2021: [
					6,
					13,
					9,
					13
				],
				2022: [
					6,
					9,
					9,
					13
				],
				2023: [
					6,
					11,
					9,
					13
				],
				2024: [
					6,
					7,
					9,
					15
				],
				2025: [
					6,
					8,
					9,
					14
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "vacanze galleggianti",
				2024: [
					2,
					13,
					2,
					13
				],
				2025: [
					3,
					3,
					3,
					4
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					8,
					6,
					8
				]
			}
		] },
		Sicilia: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					7
				],
				2021: [
					12,
					23,
					1,
					6
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					23,
					1,
					6
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					7,
					9,
					14
				],
				2021: [
					6,
					9,
					9,
					15
				],
				2022: [
					6,
					11,
					9,
					18
				],
				2023: [
					6,
					11,
					9,
					12
				],
				2024: [
					6,
					8,
					9,
					15
				],
				2025: [
					6,
					8,
					9,
					14
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "vacanza galleggiante",
				2023: [
					11,
					2,
					11,
					2
				],
				2024: [
					11,
					2,
					11,
					2
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					9,
					6,
					9
				]
			}
		] },
		Toscana: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					24,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					5
				],
				2021: [
					12,
					24,
					1,
					5
				],
				2022: [
					12,
					24,
					1,
					5
				],
				2023: [
					12,
					24,
					1,
					5
				],
				2024: [
					12,
					24,
					1,
					6
				],
				2025: [
					12,
					24,
					1,
					6
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					11,
					9,
					14
				],
				2021: [
					6,
					11,
					9,
					14
				],
				2022: [
					6,
					11,
					9,
					14
				],
				2023: [
					6,
					11,
					9,
					14
				],
				2024: [
					6,
					10,
					9,
					15
				],
				2025: [
					6,
					11,
					9,
					14
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					10,
					6,
					10
				]
			}
		] },
		Trento: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					6
				],
				2022: [
					12,
					23,
					1,
					5
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					12,
					7,
					12,
					7
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					10,
					31,
					10,
					31
				],
				2023: [
					12,
					9,
					12,
					9
				],
				2024: [
					11,
					2,
					11,
					2
				],
				2026: [
					6,
					1,
					6,
					1
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					11,
					9,
					14
				],
				2021: [
					6,
					11,
					9,
					12
				],
				2022: [
					6,
					11,
					9,
					11
				],
				2023: [
					6,
					10,
					9,
					10
				],
				2024: [
					6,
					11,
					9,
					8
				],
				2025: [
					6,
					13,
					9,
					9
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					18,
					4,
					26
				],
				2026: [
					4,
					2,
					4,
					8
				]
			},
			{
				name: "vacanze galleggianti",
				2024: [
					2,
					8,
					2,
					13
				],
				2025: [
					5,
					1,
					5,
					3
				],
				2026: [
					2,
					16,
					2,
					18
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					10,
					6,
					10
				]
			}
		] },
		Umbria: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					23,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					6
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					22,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					12,
					7,
					12,
					7
				],
				2021: [
					11,
					2,
					11,
					2
				],
				2022: [
					10,
					31,
					10,
					31
				],
				2023: [
					12,
					9,
					12,
					9
				],
				2024: [
					11,
					2,
					11,
					2
				],
				2025: [
					4,
					26,
					4,
					26
				],
				2026: [
					6,
					1,
					6,
					1
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					10,
					9,
					14
				],
				2021: [
					6,
					10,
					9,
					12
				],
				2022: [
					6,
					10,
					9,
					13
				],
				2023: [
					6,
					11,
					9,
					12
				],
				2024: [
					6,
					8,
					9,
					15
				],
				2025: [
					6,
					8,
					9,
					14
				]
			},
			{
				name: "vacanze galleggianti",
				2021: [
					5,
					31,
					6,
					1
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					9,
					6,
					9
				]
			}
		] },
		"Valle d'Aosta": { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					5
				],
				2021: [
					12,
					23,
					1,
					8
				],
				2022: [
					12,
					24,
					1,
					7
				],
				2023: [
					12,
					24,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					24,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					12,
					7,
					12,
					7
				],
				2021: [
					2,
					17,
					2,
					17
				],
				2022: [
					3,
					1,
					3,
					1
				],
				2023: [
					12,
					9,
					12,
					9
				],
				2024: [
					11,
					2,
					11,
					2
				],
				2025: [
					4,
					26,
					4,
					26
				],
				2026: [
					6,
					1,
					6,
					1
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					13,
					9,
					14
				],
				2021: [
					6,
					9,
					9,
					12
				],
				2022: [
					6,
					9,
					9,
					18
				],
				2023: [
					6,
					16,
					9,
					10
				],
				2024: [
					6,
					6,
					9,
					15
				],
				2025: [
					6,
					11,
					9,
					9
				]
			},
			{
				name: "vacanze galleggianti",
				2023: [
					1,
					30,
					1,
					31
				],
				2024: [
					4,
					26,
					4,
					27
				],
				2025: [
					5,
					2,
					5,
					3
				],
				2026: [
					2,
					16,
					2,
					18
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					1
				],
				2025: [
					4,
					17,
					4,
					21
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					10,
					6,
					10
				]
			}
		] },
		Veneto: { SH: [
			{
				name: "festività natalizie",
				2019: [
					12,
					23,
					1,
					6
				],
				2020: [
					12,
					24,
					1,
					5
				],
				2021: [
					12,
					24,
					1,
					8
				],
				2022: [
					12,
					24,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					5
				],
				2024: [
					12,
					23,
					1,
					6
				],
				2025: [
					12,
					24,
					1,
					6
				]
			},
			{
				name: "vacanza galleggiante",
				2020: [
					12,
					7,
					12,
					7
				],
				2021: [
					2,
					17,
					2,
					17
				],
				2022: [
					10,
					31,
					10,
					31
				],
				2023: [
					12,
					9,
					12,
					9
				],
				2024: [
					11,
					2,
					11,
					2
				],
				2025: [
					4,
					26,
					4,
					26
				],
				2026: [
					6,
					1,
					6,
					1
				]
			},
			{
				name: "vacanze estive",
				2020: [
					6,
					7,
					9,
					14
				],
				2021: [
					6,
					6,
					9,
					12
				],
				2022: [
					6,
					9,
					9,
					11
				],
				2023: [
					6,
					11,
					9,
					12
				],
				2024: [
					6,
					8,
					9,
					15
				],
				2025: [
					6,
					8,
					9,
					9
				]
			},
			{
				name: "vacanze galleggianti",
				2022: [
					12,
					9,
					12,
					10
				],
				2024: [
					4,
					26,
					4,
					27
				],
				2025: [
					5,
					2,
					5,
					3
				],
				2026: [
					2,
					16,
					2,
					18
				]
			},
			{
				name: "festività pasquali",
				2023: [
					4,
					6,
					4,
					8
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					19
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Fine delle lezioni",
				2026: [
					6,
					6,
					6,
					6
				]
			}
		] }
	},
	jp: {
		PH: [
			{
				name: "元日",
				fixed_date: [1, 1]
			},
			{
				name: "成人の日",
				variable_date: "firstJanuaryMonday",
				offset: 7
			},
			{
				name: "建国記念の日",
				fixed_date: [2, 11]
			},
			{
				name: "天皇誕生日",
				fixed_date: [2, 23]
			},
			{
				name: "昭和の日",
				fixed_date: [4, 29]
			},
			{
				name: "憲法記念日",
				fixed_date: [5, 3]
			},
			{
				name: "みどりの日",
				fixed_date: [5, 4]
			},
			{
				name: "こどもの日",
				fixed_date: [5, 5]
			},
			{
				name: "海の日",
				variable_date: "firstJulyMonday",
				offset: 14
			},
			{
				name: "山の日",
				fixed_date: [8, 11]
			},
			{
				name: "敬老の日",
				variable_date: "firstSeptemberMonday",
				offset: 14
			},
			{
				name: "スポーツの日",
				variable_date: "firstNovemberMonday",
				offset: 7
			},
			{
				name: "文化の日",
				fixed_date: [11, 3]
			},
			{
				name: "勤労感謝の日",
				fixed_date: [11, 23]
			},
			{
				name: "春分の日",
				variable_date: "springEquinox"
			},
			{
				name: "秋分の日",
				variable_date: "autumnalEquinox"
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=35.39291572&lon=139.44288869&zoom=18&addressdetails=1&accept-language=ja,en"
	},
	li: { SH: [
		{
			name: "Winterferien",
			2019: [
				12,
				21,
				1,
				6
			],
			2020: [
				12,
				24,
				1,
				6
			],
			2021: [
				12,
				24,
				1,
				9
			],
			2022: [
				12,
				24,
				1,
				8
			],
			2023: [
				12,
				23,
				1,
				7
			],
			2024: [
				12,
				21,
				1,
				6
			],
			2025: [
				12,
				24,
				1,
				6
			],
			2026: [
				12,
				24,
				1,
				6
			]
		},
		{
			name: "Sommerferien",
			2020: [
				7,
				4,
				8,
				16
			],
			2021: [
				7,
				3,
				8,
				15
			],
			2022: [
				7,
				2,
				8,
				16
			],
			2023: [
				7,
				8,
				8,
				20
			],
			2024: [
				7,
				6,
				8,
				18
			],
			2025: [
				7,
				5,
				8,
				17
			],
			2026: [
				7,
				4,
				8,
				16
			]
		},
		{
			name: "Herbstferien",
			2020: [
				10,
				3,
				10,
				18
			],
			2021: [
				10,
				2,
				10,
				17
			],
			2022: [
				10,
				1,
				10,
				16
			],
			2023: [
				10,
				7,
				10,
				22
			],
			2024: [
				10,
				5,
				10,
				20
			],
			2025: [
				10,
				4,
				10,
				19
			],
			2026: [
				10,
				3,
				10,
				18
			]
		},
		{
			name: "Sportferien",
			2020: [
				2,
				22,
				3,
				1
			],
			2021: [
				2,
				13,
				2,
				21
			],
			2022: [
				2,
				26,
				3,
				6
			],
			2023: [
				2,
				18,
				2,
				26
			],
			2024: [
				2,
				10,
				2,
				18
			],
			2025: [
				3,
				1,
				3,
				9
			],
			2026: [
				2,
				14,
				2,
				22
			]
		},
		{
			name: "Schulfrei",
			2020: [
				6,
				12,
				6,
				12
			],
			2021: [
				6,
				4,
				6,
				4
			],
			2022: [
				6,
				17,
				6,
				17
			],
			2023: [
				6,
				9,
				6,
				9
			],
			2024: [
				5,
				31,
				5,
				31
			],
			2025: [
				6,
				20,
				6,
				20
			],
			2026: [
				6,
				5,
				6,
				5
			]
		},
		{
			name: "Frühlingsferien",
			2020: [
				4,
				10,
				4,
				26
			],
			2021: [
				4,
				2,
				4,
				18
			],
			2022: [
				4,
				13,
				5,
				1
			],
			2023: [
				4,
				7,
				4,
				23
			],
			2024: [
				3,
				29,
				4,
				14
			],
			2025: [
				4,
				18,
				5,
				4
			],
			2026: [
				4,
				3,
				4,
				19
			]
		}
	] },
	lt: { SH: [
		{
			name: "Žiemos atostogos",
			2019: [
				12,
				23,
				1,
				3
			],
			2020: [
				12,
				23,
				1,
				5
			],
			2021: [
				12,
				27,
				1,
				7
			],
			2022: [
				12,
				27,
				1,
				6
			],
			2023: [
				12,
				27,
				1,
				5
			],
			2024: [
				12,
				27,
				1,
				3
			],
			2025: [
				12,
				24,
				1,
				4
			],
			2026: [
				12,
				23,
				1,
				3
			],
			2027: [
				2,
				15,
				2,
				21
			]
		},
		{
			name: "Pavasario atostogos",
			2020: [
				4,
				14,
				4,
				17
			],
			2021: [
				4,
				6,
				4,
				9
			],
			2022: [
				4,
				19,
				4,
				22
			],
			2023: [
				4,
				11,
				4,
				14
			],
			2024: [
				4,
				2,
				4,
				5
			],
			2025: [
				4,
				22,
				4,
				25
			],
			2026: [
				4,
				6,
				4,
				12
			],
			2027: [
				3,
				29,
				4,
				4
			]
		},
		{
			name: "Atgal į mokyklą",
			2020: [
				9,
				1,
				9,
				1
			],
			2021: [
				9,
				1,
				9,
				1
			],
			2022: [
				9,
				1,
				9,
				1
			],
			2023: [
				9,
				1,
				9,
				1
			],
			2024: [
				9,
				1,
				9,
				1
			],
			2025: [
				9,
				1,
				9,
				1
			],
			2026: [
				9,
				1,
				9,
				1
			],
			2027: [
				9,
				1,
				9,
				1
			]
		},
		{
			name: "Rudens atostogos",
			2020: [
				10,
				26,
				10,
				30
			],
			2021: [
				11,
				3,
				11,
				5
			],
			2022: [
				10,
				31,
				11,
				4
			],
			2023: [
				10,
				30,
				11,
				3
			],
			2024: [
				10,
				28,
				10,
				31
			],
			2025: [
				11,
				3,
				11,
				9
			],
			2026: [
				11,
				2,
				11,
				8
			]
		}
	] },
	lu: {
		PH: [
			{
				name: "Neijoerschdag - Neujahr - Nouvel An",
				fixed_date: [1, 1]
			},
			{
				name: "Ouschterméindeg - Ostermontag - Lundi de Pâques",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Dag vun der Aarbecht - Tag der Arbeit - Premier Mai",
				fixed_date: [5, 1]
			},
			{
				name: "Europadag - Europatag - Journée de l'Europe",
				fixed_date: [5, 1]
			},
			{
				name: "Christi Himmelfaart - Christi Himmelfahrt - Ascension",
				variable_date: "easter",
				offset: 39
			},
			{
				name: "Péngschtméindeg - Pfingstmontag - Lundi de Pentecôte",
				variable_date: "easter",
				offset: 50
			},
			{
				name: "Nationalfeierdag - Nationalfeiertag - Fête nationale",
				fixed_date: [6, 23]
			},
			{
				name: "Mariä Himmelfaart - Maria Himmelfahrt - Assomption",
				fixed_date: [8, 15]
			},
			{
				name: "Allerhellgen - Weihnachten - Allerheiligen - Toussaint",
				fixed_date: [11, 1]
			},
			{
				name: "Chrëschtdag - Noël",
				fixed_date: [12, 25]
			},
			{
				name: "Stiefesdag - Zweiter Weihnachtsfeiertag - St. Etienne",
				fixed_date: [12, 26]
			}
		],
		SH: [
			{
				name: "Vacances de Noël",
				2019: [
					12,
					21,
					1,
					5
				],
				2020: [
					12,
					19,
					1,
					3
				],
				2021: [
					12,
					18,
					1,
					2
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					20,
					1,
					4
				],
				2026: [
					12,
					19,
					1,
					3
				]
			},
			{
				name: "Congé de Carnaval",
				2020: [
					2,
					15,
					2,
					23
				],
				2021: [
					2,
					13,
					2,
					21
				],
				2022: [
					2,
					12,
					2,
					20
				],
				2023: [
					2,
					11,
					2,
					19
				],
				2024: [
					2,
					10,
					2,
					18
				],
				2025: [
					2,
					15,
					2,
					23
				],
				2026: [
					2,
					14,
					2,
					22
				],
				2027: [
					2,
					6,
					2,
					14
				]
			},
			{
				name: "Vacances de Pâques",
				2020: [
					4,
					4,
					4,
					19
				],
				2021: [
					4,
					3,
					4,
					22
				],
				2022: [
					4,
					2,
					4,
					18
				],
				2023: [
					4,
					1,
					4,
					16
				],
				2024: [
					3,
					30,
					4,
					14
				],
				2025: [
					4,
					5,
					4,
					20
				],
				2026: [
					3,
					28,
					4,
					12
				],
				2027: [
					3,
					27,
					4,
					11
				]
			},
			{
				name: "Congé de la Pentecôte",
				2020: [
					5,
					30,
					6,
					7
				],
				2021: [
					5,
					22,
					5,
					30
				],
				2022: [
					5,
					21,
					5,
					29
				],
				2023: [
					5,
					27,
					6,
					4
				],
				2024: [
					5,
					25,
					6,
					2
				],
				2025: [
					5,
					24,
					6,
					1
				],
				2026: [
					5,
					23,
					5,
					31
				],
				2027: [
					5,
					29,
					6,
					6
				]
			},
			{
				name: "Vacances d’été",
				2020: [
					7,
					16,
					9,
					14
				],
				2021: [
					7,
					16,
					9,
					14
				],
				2022: [
					7,
					16,
					9,
					14
				],
				2023: [
					7,
					15,
					9,
					14
				],
				2024: [
					7,
					16,
					9,
					15
				],
				2025: [
					7,
					16,
					9,
					14
				],
				2026: [
					7,
					16,
					9,
					14
				],
				2027: [
					7,
					16,
					9,
					14
				]
			},
			{
				name: "Congé de la Toussaint",
				2020: [
					10,
					31,
					11,
					8
				],
				2021: [
					10,
					30,
					11,
					7
				],
				2022: [
					10,
					29,
					11,
					6
				],
				2023: [
					10,
					28,
					11,
					5
				],
				2024: [
					10,
					26,
					11,
					3
				],
				2025: [
					11,
					1,
					11,
					9
				],
				2026: [
					10,
					31,
					11,
					8
				]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Luxembourg&zoom=18&addressdetails=1&limit=1&accept-language=lb,fr,de,en"
	},
	lv: { SH: [
		{
			name: "Ziemas brīvdienas",
			2019: [
				12,
				23,
				1,
				3
			],
			2020: [
				12,
				21,
				1,
				1
			],
			2021: [
				12,
				22,
				1,
				4
			],
			2022: [
				12,
				26,
				1,
				6
			],
			2023: [
				12,
				25,
				1,
				5
			],
			2024: [
				12,
				23,
				1,
				5
			]
		},
		{
			name: "Pavasara brīvdienas",
			2020: [
				3,
				16,
				3,
				20
			],
			2021: [
				3,
				15,
				3,
				19
			],
			2022: [
				3,
				14,
				3,
				18
			],
			2023: [
				3,
				13,
				3,
				17
			],
			2024: [
				3,
				11,
				3,
				15
			],
			2025: [
				3,
				10,
				3,
				16
			]
		},
		{
			name: "Vasaras brīvdienas",
			2020: [
				6,
				1,
				8,
				31
			],
			2021: [
				6,
				1,
				8,
				31
			],
			2022: [
				6,
				1,
				8,
				31
			],
			2023: [
				6,
				1,
				8,
				31
			],
			2024: [
				6,
				1,
				8,
				31
			],
			2025: [
				5,
				31,
				8,
				31
			]
		},
		{
			name: "Rudens brīvdienas",
			2020: [
				10,
				19,
				10,
				23
			],
			2021: [
				10,
				18,
				10,
				22
			],
			2022: [
				10,
				24,
				10,
				28
			],
			2023: [
				10,
				23,
				10,
				27
			],
			2024: [
				10,
				21,
				10,
				27
			]
		}
	] },
	mc: { SH: [
		{
			name: "Vacances de Noël",
			2019: [
				12,
				21,
				1,
				5
			],
			2020: [
				12,
				19,
				1,
				3
			],
			2021: [
				12,
				18,
				1,
				2
			],
			2022: [
				12,
				17,
				1,
				2
			],
			2023: [
				12,
				23,
				1,
				7
			],
			2024: [
				12,
				21,
				1,
				5
			],
			2025: [
				12,
				20,
				1,
				4
			]
		},
		{
			name: "Vacances d’hiver",
			2020: [
				2,
				15,
				3,
				1
			],
			2021: [
				2,
				20,
				3,
				7
			],
			2022: [
				2,
				5,
				2,
				20
			],
			2023: [
				2,
				11,
				2,
				26
			],
			2024: [
				2,
				24,
				3,
				10
			],
			2025: [
				2,
				8,
				2,
				23
			],
			2026: [
				2,
				14,
				3,
				1
			]
		},
		{
			name: "Vacances de printemps",
			2020: [
				4,
				11,
				4,
				26
			],
			2021: [
				4,
				10,
				4,
				25
			],
			2022: [
				4,
				9,
				4,
				24
			],
			2023: [
				4,
				15,
				5,
				1
			],
			2024: [
				4,
				20,
				5,
				5
			],
			2025: [
				4,
				5,
				4,
				21
			],
			2026: [
				4,
				11,
				4,
				26
			]
		},
		{
			name: "Grand Prix historique",
			2020: [
				5,
				8,
				5,
				8
			],
			2022: [
				5,
				13,
				5,
				15
			]
		},
		{
			name: "Grand Prix de Formule 1 et Pentecôte",
			2020: [
				5,
				21,
				5,
				24
			],
			2021: [
				5,
				15,
				5,
				24
			],
			2022: [
				5,
				26,
				5,
				29
			],
			2023: [
				5,
				25,
				5,
				29
			],
			2024: [
				5,
				23,
				5,
				26
			],
			2025: [
				5,
				22,
				5,
				25
			],
			2026: [
				5,
				21,
				5,
				25
			]
		},
		{
			name: "Vacances d’été",
			2020: [
				6,
				27,
				9,
				6
			],
			2021: [
				7,
				1,
				9,
				5
			],
			2022: [
				7,
				2,
				9,
				4
			],
			2023: [
				7,
				1,
				9,
				10
			],
			2024: [
				6,
				29,
				9,
				8
			],
			2025: [
				6,
				28,
				9,
				7
			],
			2026: [
				6,
				27,
				9,
				6
			]
		},
		{
			name: "Vacances de la Toussaint",
			2020: [
				10,
				22,
				11,
				2
			],
			2021: [
				10,
				28,
				11,
				7
			],
			2022: [
				10,
				22,
				11,
				2
			],
			2023: [
				10,
				21,
				11,
				1
			],
			2024: [
				10,
				24,
				11,
				3
			],
			2025: [
				10,
				23,
				11,
				2
			]
		}
	] },
	md: { SH: [
		{
			name: "Vacanţa de iarnă",
			2019: [
				12,
				25,
				1,
				8
			],
			2020: [
				12,
				25,
				1,
				10
			],
			2021: [
				12,
				25,
				1,
				9
			],
			2022: [
				12,
				24,
				1,
				8
			],
			2023: [
				12,
				23,
				1,
				8
			],
			2024: [
				12,
				25,
				1,
				8
			],
			2025: [
				12,
				25,
				1,
				8
			]
		},
		{
			name: "Vacanţa de primăvară",
			2020: [
				3,
				5,
				3,
				8
			],
			2021: [
				3,
				5,
				3,
				8
			],
			2022: [
				3,
				5,
				3,
				8
			],
			2023: [
				3,
				8,
				3,
				12
			],
			2024: [
				3,
				8,
				3,
				12
			],
			2025: [
				3,
				3,
				3,
				9
			],
			2026: [
				3,
				5,
				3,
				8
			]
		},
		{
			name: "Vacanţa de Paşti",
			2020: [
				4,
				18,
				4,
				27
			],
			2021: [
				5,
				1,
				5,
				10
			],
			2022: [
				4,
				23,
				5,
				2
			],
			2023: [
				4,
				15,
				4,
				24
			],
			2024: [
				5,
				4,
				5,
				13
			],
			2025: [
				4,
				19,
				4,
				28
			],
			2026: [
				4,
				11,
				4,
				20
			]
		},
		{
			name: "Vacanţa de vară",
			2020: [
				6,
				1,
				8,
				31
			],
			2021: [
				6,
				1,
				8,
				31
			],
			2022: [
				6,
				1,
				8,
				31
			],
			2023: [
				6,
				1,
				8,
				31
			],
			2024: [
				6,
				1,
				8,
				31
			],
			2025: [
				6,
				1,
				8,
				31
			],
			2026: [
				5,
				30,
				8,
				31
			]
		},
		{
			name: "Vacanţa de toamnă",
			2020: [
				10,
				24,
				11,
				1
			],
			2021: [
				10,
				27,
				10,
				31
			],
			2022: [
				10,
				26,
				10,
				30
			],
			2023: [
				11,
				1,
				11,
				5
			],
			2024: [
				10,
				28,
				11,
				3
			],
			2025: [
				10,
				27,
				11,
				2
			]
		}
	] },
	mt: { SH: [
		{
			name: "Vaganzi tal-Milied",
			2019: [
				12,
				23,
				1,
				6
			],
			2020: [
				12,
				23,
				1,
				6
			],
			2021: [
				12,
				23,
				1,
				6
			],
			2022: [
				12,
				23,
				1,
				6
			],
			2023: [
				12,
				23,
				1,
				6
			],
			2024: [
				12,
				23,
				1,
				6
			],
			2025: [
				12,
				23,
				1,
				6
			]
		},
		{
			name: "Festi tal-Karnival",
			2020: [
				2,
				24,
				2,
				25
			],
			2021: [
				2,
				15,
				2,
				17
			],
			2022: [
				2,
				28,
				3,
				2
			],
			2023: [
				2,
				20,
				2,
				21
			],
			2024: [
				2,
				12,
				2,
				14
			],
			2025: [
				3,
				1,
				3,
				4
			],
			2026: [
				2,
				16,
				2,
				17
			]
		},
		{
			name: "Vaganzi tal-Għid",
			2020: [
				4,
				8,
				4,
				15
			],
			2021: [
				3,
				31,
				4,
				7
			],
			2022: [
				4,
				13,
				4,
				20
			],
			2023: [
				4,
				5,
				4,
				12
			],
			2024: [
				3,
				27,
				4,
				3
			],
			2025: [
				4,
				16,
				4,
				23
			],
			2026: [
				4,
				1,
				4,
				8
			]
		},
		{
			name: "Kumpens għall-vaganzi fi tmiem il-ġimgħa",
			2020: [
				4,
				16,
				4,
				17
			],
			2021: [
				4,
				8,
				4,
				9
			],
			2022: [
				5,
				2,
				5,
				2
			],
			2023: [
				4,
				13,
				4,
				14
			],
			2024: [
				12,
				12,
				12,
				12
			],
			2025: [
				5,
				30,
				5,
				30
			],
			2026: [
				4,
				9,
				4,
				10
			]
		},
		{
			name: "Vaganzi tas-sajf",
			2020: [
				6,
				29,
				9,
				29
			],
			2021: [
				6,
				29,
				9,
				28
			],
			2022: [
				6,
				30,
				9,
				27
			],
			2023: [
				6,
				28,
				9,
				26
			],
			2024: [
				6,
				28,
				9,
				24
			],
			2025: [
				6,
				27,
				9,
				23
			],
			2026: [
				7,
				1,
				9,
				29
			]
		},
		{
			name: "Btajjel ta' nofs it-terminu",
			2020: [
				11,
				2,
				11,
				4
			],
			2021: [
				11,
				1,
				11,
				3
			],
			2022: [
				10,
				31,
				11,
				2
			],
			2023: [
				11,
				1,
				11,
				3
			],
			2024: [
				11,
				1,
				11,
				5
			],
			2025: [
				11,
				3,
				11,
				5
			]
		}
	] },
	mx: { SH: [
		{
			name: "Receso de invierno",
			2019: [
				12,
				23,
				1,
				7
			],
			2020: [
				12,
				21,
				1,
				5
			],
			2021: [
				12,
				20,
				12,
				31
			],
			2022: [
				12,
				19,
				12,
				30
			],
			2023: [
				12,
				18,
				1,
				2
			],
			2024: [
				12,
				19,
				1,
				3
			],
			2025: [
				12,
				22,
				1,
				6
			]
		},
		{
			name: "Receso de primavera",
			2020: [
				4,
				6,
				4,
				17
			],
			2021: [
				3,
				29,
				4,
				9
			],
			2022: [
				4,
				11,
				4,
				22
			],
			2023: [
				4,
				3,
				4,
				14
			],
			2024: [
				3,
				25,
				4,
				5
			],
			2025: [
				4,
				14,
				4,
				25
			],
			2026: [
				3,
				30,
				4,
				10
			]
		},
		{
			name: "Receso de clases",
			2020: [
				7,
				7,
				8,
				23
			],
			2021: [
				7,
				10,
				8,
				29
			],
			2022: [
				7,
				29,
				8,
				28
			],
			2023: [
				7,
				27,
				8,
				27
			],
			2024: [
				7,
				17,
				8,
				25
			],
			2025: [
				7,
				16,
				8,
				31
			]
		},
		{
			name: "Fin de lecciones",
			2026: [
				7,
				15,
				7,
				15
			]
		}
	] },
	na: {
		PH: [
			{
				name: "New Year’s Day",
				fixed_date: [1, 1]
			},
			{
				name: "Independence Day",
				fixed_date: [3, 21]
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Easter Monday",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Worker’s Day",
				fixed_date: [5, 1]
			},
			{
				name: "Cassinga Day",
				fixed_date: [5, 4]
			},
			{
				name: "Ascension Day",
				variable_date: "easter",
				offset: 39
			},
			{
				name: "Africa Day",
				fixed_date: [5, 25]
			},
			{
				name: "Heroes’ Day",
				fixed_date: [8, 26]
			},
			{
				name: "Human Rights Day",
				fixed_date: [12, 10]
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			},
			{
				name: "Family Day",
				fixed_date: [12, 26]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/search?format=json&country=Namibia&zoom=18&addressdetails=1&limit=1"
	},
	nl: {
		PH: [
			{
				name: "Nieuwjaarsdag",
				fixed_date: [1, 1]
			},
			{
				name: "Goede vrijdag",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Tweede Paasdag",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Koningsdag",
				fixed_date: [4, 27]
			},
			{
				name: "Bevrijdingsdag",
				fixed_date: [5, 5]
			},
			{
				name: "Hemelvaartsdag",
				variable_date: "easter",
				offset: 39
			},
			{
				name: "Tweede Pinksterdag",
				variable_date: "easter",
				offset: 50
			},
			{
				name: "Eerste Kerstdag",
				fixed_date: [12, 25]
			},
			{
				name: "Tweede Kerstdag",
				fixed_date: [12, 26]
			}
		],
		MI: { SH: [
			{
				name: "Kerstvakantie",
				2019: [
					12,
					21,
					1,
					5
				],
				2020: [
					12,
					19,
					1,
					3
				],
				2021: [
					12,
					25,
					1,
					9
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					20,
					1,
					4
				],
				2026: [
					12,
					19,
					1,
					3
				],
				2027: [
					12,
					25,
					1,
					9
				],
				2028: [
					12,
					23,
					1,
					7
				],
				2029: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Voorjaarsvakantie",
				2020: [
					2,
					22,
					3,
					1
				],
				2021: [
					2,
					20,
					2,
					28
				],
				2022: [
					2,
					26,
					3,
					6
				],
				2023: [
					2,
					25,
					3,
					5
				],
				2024: [
					2,
					17,
					2,
					25
				],
				2025: [
					2,
					22,
					3,
					2
				],
				2026: [
					2,
					14,
					2,
					22
				],
				2027: [
					2,
					20,
					2,
					28
				],
				2028: [
					2,
					26,
					3,
					5
				],
				2029: [
					2,
					17,
					2,
					25
				],
				2030: [
					2,
					23,
					3,
					3
				]
			},
			{
				name: "Meivakantie",
				2020: [
					4,
					25,
					5,
					3
				],
				2021: [
					5,
					1,
					5,
					9
				],
				2022: [
					4,
					30,
					5,
					8
				],
				2023: [
					4,
					29,
					5,
					7
				],
				2024: [
					4,
					27,
					5,
					5
				],
				2025: [
					4,
					26,
					5,
					4
				],
				2026: [
					4,
					25,
					5,
					3
				],
				2027: [
					4,
					24,
					5,
					2
				],
				2028: [
					4,
					29,
					5,
					7
				],
				2029: [
					4,
					28,
					5,
					6
				],
				2030: [
					4,
					27,
					5,
					5
				]
			},
			{
				name: "Zomervakantie",
				2020: [
					7,
					18,
					8,
					30
				],
				2021: [
					7,
					17,
					8,
					29
				],
				2022: [
					7,
					9,
					8,
					21
				],
				2023: [
					7,
					8,
					8,
					20
				],
				2024: [
					7,
					13,
					8,
					25
				],
				2025: [
					7,
					19,
					8,
					31
				],
				2026: [
					7,
					18,
					8,
					30
				],
				2027: [
					7,
					17,
					8,
					29
				],
				2028: [
					7,
					8,
					8,
					20
				],
				2029: [
					7,
					7,
					8,
					19
				],
				2030: [
					7,
					13,
					8,
					25
				]
			},
			{
				name: "Herfstvakantie",
				2020: [
					10,
					17,
					10,
					25
				],
				2021: [
					10,
					16,
					10,
					24
				],
				2022: [
					10,
					22,
					10,
					30
				],
				2023: [
					10,
					14,
					10,
					22
				],
				2024: [
					10,
					26,
					11,
					3
				],
				2025: [
					10,
					18,
					10,
					26
				],
				2026: [
					10,
					17,
					10,
					25
				],
				2027: [
					10,
					16,
					10,
					24
				],
				2028: [
					10,
					21,
					10,
					29
				],
				2029: [
					10,
					20,
					10,
					28
				]
			}
		] },
		NO: { SH: [
			{
				name: "Kerstvakantie",
				2019: [
					12,
					21,
					1,
					5
				],
				2020: [
					12,
					19,
					1,
					3
				],
				2021: [
					12,
					25,
					1,
					9
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					20,
					1,
					4
				],
				2026: [
					12,
					19,
					1,
					3
				],
				2027: [
					12,
					25,
					1,
					9
				],
				2028: [
					12,
					23,
					1,
					7
				],
				2029: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Voorjaarsvakantie",
				2020: [
					2,
					15,
					2,
					23
				],
				2021: [
					2,
					20,
					2,
					28
				],
				2022: [
					2,
					19,
					2,
					27
				],
				2023: [
					2,
					25,
					3,
					5
				],
				2024: [
					2,
					17,
					2,
					25
				],
				2025: [
					2,
					15,
					2,
					23
				],
				2026: [
					2,
					21,
					3,
					1
				],
				2027: [
					2,
					20,
					2,
					28
				],
				2028: [
					2,
					19,
					2,
					27
				],
				2029: [
					2,
					17,
					2,
					25
				],
				2030: [
					2,
					16,
					2,
					24
				]
			},
			{
				name: "Meivakantie",
				2020: [
					4,
					25,
					5,
					3
				],
				2021: [
					5,
					1,
					5,
					9
				],
				2022: [
					4,
					30,
					5,
					8
				],
				2023: [
					4,
					29,
					5,
					7
				],
				2024: [
					4,
					27,
					5,
					5
				],
				2025: [
					4,
					26,
					5,
					4
				],
				2026: [
					4,
					25,
					5,
					3
				],
				2027: [
					4,
					24,
					5,
					2
				],
				2028: [
					4,
					29,
					5,
					7
				],
				2029: [
					4,
					28,
					5,
					6
				],
				2030: [
					4,
					27,
					5,
					5
				]
			},
			{
				name: "Zomervakantie",
				2020: [
					7,
					4,
					8,
					16
				],
				2021: [
					7,
					10,
					8,
					22
				],
				2022: [
					7,
					16,
					8,
					28
				],
				2023: [
					7,
					22,
					9,
					3
				],
				2024: [
					7,
					20,
					9,
					1
				],
				2025: [
					7,
					12,
					8,
					24
				],
				2026: [
					7,
					4,
					8,
					16
				],
				2027: [
					7,
					10,
					8,
					22
				],
				2028: [
					7,
					15,
					8,
					27
				],
				2029: [
					7,
					21,
					9,
					2
				],
				2030: [
					7,
					20,
					9,
					1
				]
			},
			{
				name: "Herfstvakantie",
				2020: [
					10,
					10,
					10,
					18
				],
				2021: [
					10,
					16,
					10,
					24
				],
				2022: [
					10,
					15,
					10,
					23
				],
				2023: [
					10,
					21,
					10,
					29
				],
				2024: [
					10,
					26,
					11,
					3
				],
				2025: [
					10,
					18,
					10,
					26
				],
				2026: [
					10,
					10,
					10,
					18
				],
				2027: [
					10,
					16,
					10,
					24
				],
				2028: [
					10,
					14,
					10,
					22
				],
				2029: [
					10,
					20,
					10,
					28
				]
			}
		] },
		ZU: { SH: [
			{
				name: "Kerstvakantie",
				2019: [
					12,
					21,
					1,
					5
				],
				2020: [
					12,
					19,
					1,
					3
				],
				2021: [
					12,
					25,
					1,
					9
				],
				2022: [
					12,
					24,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					5
				],
				2025: [
					12,
					20,
					1,
					4
				],
				2026: [
					12,
					19,
					1,
					3
				],
				2027: [
					12,
					25,
					1,
					9
				],
				2028: [
					12,
					23,
					1,
					7
				],
				2029: [
					12,
					22,
					1,
					6
				]
			},
			{
				name: "Voorjaarsvakantie",
				2020: [
					2,
					22,
					3,
					1
				],
				2021: [
					2,
					13,
					2,
					21
				],
				2022: [
					2,
					26,
					3,
					6
				],
				2023: [
					2,
					18,
					2,
					26
				],
				2024: [
					2,
					10,
					2,
					18
				],
				2025: [
					2,
					22,
					3,
					2
				],
				2026: [
					2,
					14,
					2,
					22
				],
				2027: [
					2,
					13,
					3,
					21
				],
				2028: [
					2,
					26,
					3,
					5
				],
				2029: [
					2,
					10,
					3,
					18
				],
				2030: [
					2,
					23,
					3,
					3
				]
			},
			{
				name: "Meivakantie",
				2020: [
					4,
					25,
					5,
					3
				],
				2021: [
					5,
					1,
					5,
					9
				],
				2022: [
					4,
					30,
					5,
					8
				],
				2023: [
					4,
					29,
					5,
					7
				],
				2024: [
					4,
					27,
					5,
					5
				],
				2025: [
					4,
					26,
					5,
					4
				],
				2026: [
					4,
					25,
					5,
					3
				],
				2027: [
					4,
					24,
					5,
					2
				],
				2028: [
					4,
					29,
					5,
					7
				],
				2029: [
					4,
					28,
					5,
					6
				],
				2030: [
					4,
					27,
					5,
					5
				]
			},
			{
				name: "Zomervakantie",
				2020: [
					7,
					11,
					8,
					23
				],
				2021: [
					7,
					24,
					9,
					5
				],
				2022: [
					7,
					23,
					9,
					4
				],
				2023: [
					7,
					15,
					8,
					27
				],
				2024: [
					7,
					6,
					8,
					18
				],
				2025: [
					7,
					5,
					8,
					17
				],
				2026: [
					7,
					11,
					8,
					23
				],
				2027: [
					7,
					24,
					9,
					5
				],
				2028: [
					7,
					22,
					9,
					3
				],
				2029: [
					7,
					14,
					8,
					26
				],
				2030: [
					7,
					6,
					8,
					18
				]
			},
			{
				name: "Herfstvakantie",
				2020: [
					10,
					17,
					10,
					25
				],
				2021: [
					10,
					23,
					10,
					31
				],
				2022: [
					10,
					22,
					10,
					30
				],
				2023: [
					10,
					14,
					10,
					22
				],
				2024: [
					10,
					19,
					10,
					27
				],
				2025: [
					10,
					11,
					10,
					19
				],
				2026: [
					10,
					17,
					10,
					25
				],
				2027: [
					10,
					23,
					10,
					31
				],
				2028: [
					10,
					21,
					10,
					29
				],
				2029: [
					10,
					13,
					10,
					21
				]
			}
		] }
	},
	no: {
		PH: [
			{
				name: "Nyttårsdag",
				fixed_date: [1, 1]
			},
			{
				name: "Skjærtorsdag",
				variable_date: "easter",
				offset: -3
			},
			{
				name: "Langfredag",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Påskedag",
				variable_date: "easter"
			},
			{
				name: "2. Påskedag",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "1. Mai",
				fixed_date: [5, 1]
			},
			{
				name: "Grunnlovsdagen",
				fixed_date: [5, 17]
			},
			{
				name: "Kristi Himmelfartsdag",
				variable_date: "easter",
				offset: 39
			},
			{
				name: "Pinsedag",
				variable_date: "easter",
				offset: 49
			},
			{
				name: "2. Pinsedag",
				variable_date: "easter",
				offset: 50
			},
			{
				name: "Juledag",
				fixed_date: [12, 25]
			},
			{
				name: "2. Juledag",
				fixed_date: [12, 26]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=61.0&lon=8.0&zoom=8&addressdetails=1&accept-language=no,en"
	},
	nz: {
		PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Day after New Year's Day",
				fixed_date: [1, 2]
			},
			{
				name: "Waitangi Day",
				fixed_date: [2, 6]
			},
			{
				name: "Good Friday",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Easter Monday",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Anzac Day",
				fixed_date: [4, 25]
			},
			{
				name: "Queen's Birthday",
				variable_date: "firstJuneMonday"
			},
			{
				name: "Labour Day",
				variable_date: "firstOctoberMonday",
				offset: 21
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			},
			{
				name: "Boxing Day",
				fixed_date: [12, 26]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=-41.2922255&lon=174.7763033&zoom=16&addressdetails=1&accept-language=en"
	},
	pl: {
		PH: [
			{
				name: "Nowy Rok",
				fixed_date: [1, 1]
			},
			{
				name: "Święto Trzech Króli",
				fixed_date: [1, 6]
			},
			{
				name: "Wielkanoc",
				variable_date: "easter"
			},
			{
				name: "Lany Poniedziałek - drugi dzień Wielkiej Nocy",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Pierwszy Maja",
				fixed_date: [5, 1]
			},
			{
				name: "Trzeci Maja",
				fixed_date: [5, 3]
			},
			{
				name: "Zielone Świątki",
				variable_date: "easter",
				offset: 49
			},
			{
				name: "Boże Ciało",
				variable_date: "easter",
				offset: 60
			},
			{
				name: "Wniebowzięcie Najświętszej Maryi Panny",
				fixed_date: [8, 15]
			},
			{
				name: "Wszystkich Świętych",
				fixed_date: [11, 1]
			},
			{
				name: "Święto Niepodległości",
				fixed_date: [11, 11]
			},
			{
				name: "Wigilia Bożego Narodzenia",
				fixed_date: [12, 24]
			},
			{
				name: "pierwszy dzień Bożego Narodzenia",
				fixed_date: [12, 25]
			},
			{
				name: "drugi dzień Bożego Narodzenia",
				fixed_date: [12, 26]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=53.4825&lon=18.75823&zoom=18&addressdetails=1&accept-language=pl,en",
		Dolnośląskie: { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					10,
					1,
					23
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					14,
					1,
					27
				],
				2023: [
					1,
					13,
					1,
					26
				],
				2024: [
					1,
					15,
					1,
					28
				],
				2025: [
					2,
					3,
					2,
					16
				],
				2026: [
					2,
					2,
					2,
					15
				],
				2027: [
					1,
					18,
					1,
					31
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		"Kujawsko-pomorskie": { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					27,
					2,
					9
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					31,
					2,
					13
				],
				2023: [
					1,
					30,
					2,
					12
				],
				2024: [
					2,
					12,
					2,
					25
				],
				2025: [
					1,
					20,
					2,
					2
				],
				2026: [
					2,
					2,
					2,
					15
				],
				2027: [
					2,
					15,
					2,
					28
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		Łódzkie: { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					13,
					1,
					26
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					17,
					1,
					30
				],
				2023: [
					1,
					16,
					1,
					29
				],
				2024: [
					1,
					29,
					2,
					11
				],
				2025: [
					2,
					17,
					3,
					2
				],
				2026: [
					2,
					2,
					2,
					15
				],
				2027: [
					1,
					18,
					1,
					31
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		Lubelskie: { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					13,
					1,
					26
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					17,
					1,
					30
				],
				2023: [
					1,
					16,
					1,
					29
				],
				2024: [
					1,
					29,
					2,
					11
				],
				2025: [
					2,
					17,
					3,
					2
				],
				2026: [
					2,
					16,
					3,
					1
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		Lubuskie: { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					27,
					2,
					9
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					31,
					2,
					13
				],
				2023: [
					1,
					30,
					2,
					12
				],
				2024: [
					2,
					12,
					2,
					25
				],
				2025: [
					1,
					20,
					2,
					2
				],
				2026: [
					2,
					16,
					3,
					1
				],
				2027: [
					2,
					1,
					2,
					14
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		Małopolskie: { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					27,
					2,
					9
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					31,
					2,
					13
				],
				2023: [
					1,
					30,
					2,
					12
				],
				2024: [
					2,
					12,
					2,
					25
				],
				2025: [
					1,
					20,
					2,
					2
				],
				2026: [
					2,
					2,
					2,
					15
				],
				2027: [
					2,
					15,
					2,
					28
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		Mazowieckie: { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					10,
					1,
					23
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					14,
					1,
					27
				],
				2023: [
					1,
					13,
					1,
					26
				],
				2024: [
					1,
					15,
					1,
					28
				],
				2025: [
					2,
					3,
					2,
					16
				],
				2026: [
					1,
					19,
					2,
					1
				],
				2027: [
					2,
					1,
					2,
					14
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		Opolskie: { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					10,
					1,
					23
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					14,
					1,
					27
				],
				2023: [
					1,
					13,
					1,
					26
				],
				2024: [
					1,
					15,
					1,
					28
				],
				2025: [
					2,
					3,
					2,
					16
				],
				2026: [
					2,
					2,
					2,
					15
				],
				2027: [
					1,
					18,
					1,
					31
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		Podkarpackie: { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					13,
					1,
					26
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					17,
					1,
					30
				],
				2023: [
					1,
					16,
					1,
					29
				],
				2024: [
					1,
					29,
					2,
					11
				],
				2025: [
					2,
					17,
					3,
					2
				],
				2026: [
					2,
					16,
					3,
					1
				],
				2027: [
					1,
					18,
					1,
					31
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		Podlaskie: { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					20,
					2,
					2
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					24,
					2,
					6
				],
				2023: [
					1,
					23,
					2,
					5
				],
				2024: [
					1,
					22,
					2,
					4
				],
				2025: [
					1,
					27,
					2,
					9
				],
				2026: [
					1,
					19,
					2,
					1
				],
				2027: [
					1,
					18,
					1,
					31
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		Pomorskie: { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					13,
					1,
					26
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					17,
					1,
					30
				],
				2023: [
					1,
					16,
					1,
					29
				],
				2024: [
					1,
					29,
					2,
					11
				],
				2025: [
					2,
					17,
					3,
					2
				],
				2026: [
					1,
					19,
					2,
					1
				],
				2027: [
					2,
					1,
					2,
					14
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		Śląskie: { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					13,
					1,
					26
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					17,
					1,
					30
				],
				2023: [
					1,
					16,
					1,
					29
				],
				2024: [
					1,
					29,
					2,
					11
				],
				2025: [
					2,
					17,
					3,
					2
				],
				2026: [
					2,
					16,
					3,
					1
				],
				2027: [
					1,
					18,
					1,
					31
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		Świętokrzyskie: { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					27,
					2,
					9
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					31,
					2,
					13
				],
				2023: [
					1,
					30,
					2,
					12
				],
				2024: [
					2,
					12,
					2,
					25
				],
				2025: [
					1,
					20,
					2,
					2
				],
				2026: [
					1,
					19,
					2,
					1
				],
				2027: [
					2,
					1,
					2,
					14
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		"Warmińsko-mazurskie": { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					20,
					2,
					2
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					24,
					2,
					6
				],
				2023: [
					1,
					23,
					2,
					5
				],
				2024: [
					1,
					22,
					2,
					4
				],
				2025: [
					1,
					27,
					2,
					9
				],
				2026: [
					1,
					19,
					2,
					1
				],
				2027: [
					2,
					15,
					2,
					28
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		Wielkopolskie: { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					27,
					2,
					9
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					31,
					2,
					13
				],
				2023: [
					1,
					30,
					2,
					12
				],
				2024: [
					2,
					12,
					2,
					25
				],
				2025: [
					1,
					20,
					2,
					2
				],
				2026: [
					2,
					16,
					3,
					1
				],
				2027: [
					2,
					15,
					2,
					28
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] },
		Zachodniopomorskie: { SH: [
			{
				name: "Zimowa przerwa świąteczna",
				2019: [
					12,
					23,
					12,
					31
				],
				2020: [
					12,
					23,
					12,
					31
				],
				2021: [
					12,
					23,
					12,
					31
				],
				2022: [
					12,
					23,
					12,
					31
				],
				2023: [
					12,
					23,
					12,
					31
				],
				2024: [
					12,
					23,
					12,
					31
				],
				2025: [
					12,
					22,
					12,
					31
				]
			},
			{
				name: "Ferie zimowe",
				2020: [
					1,
					10,
					1,
					23
				],
				2021: [
					1,
					4,
					1,
					17
				],
				2022: [
					1,
					14,
					1,
					27
				],
				2023: [
					1,
					13,
					1,
					26
				],
				2024: [
					1,
					15,
					1,
					28
				],
				2025: [
					2,
					3,
					2,
					16
				],
				2026: [
					2,
					2,
					2,
					15
				],
				2027: [
					2,
					15,
					2,
					28
				]
			},
			{
				name: "Wiosenna przerwa świąteczna",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				]
			},
			{
				name: "Ferie letnie",
				2020: [
					6,
					27,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					25,
					8,
					31
				],
				2023: [
					6,
					24,
					8,
					31
				],
				2024: [
					6,
					22,
					8,
					31
				],
				2025: [
					6,
					28,
					8,
					31
				],
				2026: [
					6,
					27,
					8,
					31
				]
			}
		] }
	},
	pt: { SH: [
		{
			name: "Férias de Natal",
			2019: [
				12,
				18,
				1,
				3
			],
			2020: [
				12,
				21,
				12,
				31
			],
			2021: [
				12,
				20,
				1,
				7
			],
			2022: [
				12,
				19,
				1,
				2
			],
			2023: [
				12,
				18,
				1,
				2
			],
			2024: [
				12,
				18,
				1,
				3
			],
			2025: [
				12,
				16,
				1,
				5
			],
			2026: [
				12,
				16,
				12,
				31
			],
			2027: [
				12,
				20,
				12,
				31
			]
		},
		{
			name: "Férias de Carnaval",
			2020: [
				2,
				24,
				2,
				26
			],
			2022: [
				3,
				1,
				3,
				1
			],
			2023: [
				2,
				20,
				2,
				22
			],
			2024: [
				2,
				12,
				2,
				14
			],
			2025: [
				3,
				3,
				3,
				5
			],
			2026: [
				2,
				16,
				2,
				18
			],
			2027: [
				2,
				8,
				2,
				10
			],
			2028: [
				2,
				28,
				3,
				1
			]
		},
		{
			name: "Férias de Páscoa",
			2020: [
				3,
				30,
				4,
				13
			],
			2021: [
				3,
				29,
				4,
				1
			],
			2022: [
				4,
				11,
				4,
				18
			],
			2023: [
				4,
				3,
				4,
				14
			],
			2024: [
				3,
				25,
				4,
				5
			],
			2025: [
				4,
				7,
				4,
				21
			],
			2026: [
				3,
				30,
				4,
				10
			],
			2027: [
				3,
				22,
				4,
				2
			],
			2028: [
				4,
				3,
				4,
				17
			]
		},
		{
			name: "Férias de verão",
			2020: [
				6,
				20,
				9,
				13
			],
			2021: [
				7,
				9,
				9,
				13
			],
			2022: [
				7,
				1,
				9,
				12
			],
			2023: [
				7,
				1,
				9,
				11
			],
			2024: [
				6,
				29,
				9,
				11
			],
			2025: [
				6,
				28,
				9,
				10
			],
			2026: [
				7,
				1,
				9,
				10
			],
			2027: [
				7,
				1,
				9,
				12
			]
		},
		{
			name: "Fim das aulas",
			2028: [
				6,
				30,
				6,
				30
			]
		}
	] },
	ro: {
		PH: [
			{
				name: "Anul Nou",
				fixed_date: [1, 1]
			},
			{
				name: "A doua zi de Anul Nou",
				fixed_date: [1, 2]
			},
			{
				name: "Ziua Unirii Principatelor Române (Ziua Unirii)",
				fixed_date: [1, 24]
			},
			{
				name: "Paștele ortodox",
				variable_date: "orthodox easter"
			},
			{
				name: "A doua zi de Paște ortodox",
				variable_date: "orthodox easter",
				offset: 1
			},
			{
				name: "Ziua Muncii",
				fixed_date: [5, 1]
			},
			{
				name: "Rusaliile",
				variable_date: "orthodox easter",
				offset: 50
			},
			{
				name: "A doua zi de Rusalii",
				variable_date: "orthodox easter",
				offset: 51
			},
			{
				name: "Adormirea Maicii Domnului",
				fixed_date: [8, 15]
			},
			{
				name: "Sfântul Apostol Andrei",
				fixed_date: [11, 30]
			},
			{
				name: "Ziua Națională (Ziua Marii Uniri)",
				fixed_date: [12, 1]
			},
			{
				name: "Crăciunul",
				fixed_date: [12, 25]
			},
			{
				name: "A doua zi de Crăciun",
				fixed_date: [12, 26]
			}
		],
		SH: [
			{
				name: "Vacanța de iarnă",
				2014: [
					12,
					20,
					1,
					4
				],
				2015: [
					12,
					19,
					1,
					3
				]
			},
			{
				name: "Vacanţa intersemestrială",
				2015: [
					1,
					31,
					2,
					8
				],
				2016: [
					1,
					30,
					2,
					7
				],
				2021: [
					1,
					30,
					2,
					7
				]
			},
			{
				name: "Vacanța de primăvară",
				2015: [
					4,
					11,
					4,
					19
				],
				2016: [
					4,
					23,
					5,
					3
				]
			},
			{
				name: "Vacanța de vară",
				2015: [
					6,
					20,
					9,
					13
				],
				2016: [
					6,
					18,
					9,
					4
				]
			},
			{
				name: "Vacanţa de iarnă",
				2019: [
					12,
					21,
					1,
					12
				],
				2020: [
					12,
					23,
					1,
					10
				],
				2021: [
					12,
					24,
					1,
					9
				],
				2022: [
					12,
					23,
					1,
					8
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					21,
					1,
					7
				],
				2025: [
					12,
					20,
					1,
					7
				]
			},
			{
				name: "Vacanţa de primăvară",
				2020: [
					4,
					4,
					4,
					21
				],
				2022: [
					4,
					15,
					5,
					1
				],
				2023: [
					4,
					7,
					4,
					18
				],
				2024: [
					4,
					27,
					5,
					7
				],
				2025: [
					4,
					18,
					4,
					27
				],
				2026: [
					4,
					4,
					4,
					14
				]
			},
			{
				name: "Vacanţa de vară",
				2020: [
					6,
					13,
					9,
					13
				],
				2021: [
					6,
					19,
					9,
					12
				],
				2022: [
					6,
					11,
					9,
					4
				],
				2023: [
					6,
					17,
					9,
					3
				],
				2024: [
					6,
					22,
					9,
					8
				],
				2025: [
					6,
					21,
					9,
					7
				],
				2026: [
					6,
					20,
					9,
					6
				]
			},
			{
				name: "Vacanţa de toamnă",
				2020: [
					10,
					24,
					11,
					1
				],
				2021: [
					10,
					23,
					11,
					7
				],
				2022: [
					10,
					22,
					10,
					30
				],
				2023: [
					10,
					28,
					11,
					5
				],
				2024: [
					10,
					26,
					11,
					3
				],
				2025: [
					10,
					25,
					11,
					1
				]
			},
			{
				name: "Vacanţa de primăvară 1",
				2021: [
					4,
					2,
					4,
					11
				]
			},
			{
				name: "Vacanţa de primăvară 2",
				2021: [
					4,
					30,
					5,
					9
				]
			},
			{
				name: "Vacanţa de schi",
				2024: [
					2,
					12,
					2,
					18
				]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=45.9852129&lon=24.6859225&zoom=18&addressdetails=1&accept-language=ro,en",
		Alba: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Arad: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Argeș: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Bacău: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Bihor: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		"Bistrița-Năsăud": { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				12,
				2,
				18
			],
			2025: [
				2,
				10,
				2,
				14
			],
			2026: [
				2,
				9,
				2,
				13
			]
		}] },
		Botoșani: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Brăila: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Brașov: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		București: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Buzău: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Călărași: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		"Caraș-Severin": { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Cluj: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				9,
				2,
				13
			]
		}] },
		Constanța: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Covasna: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Dâmbovița: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Dolj: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Galați: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Giurgiu: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Gorj: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Harghita: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Hunedoara: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Ialomița: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Iași: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Ilfov: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				6,
				2,
				12
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Maramureș: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Mehedinți: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Mureș: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Neamț: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Olt: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Prahova: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Sălaj: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		"Satu Mare": { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				12,
				2,
				18
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Sibiu: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Suceava: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				6,
				2,
				12
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Teleorman: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				13,
				2,
				19
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Timiș: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				9,
				2,
				13
			]
		}] },
		Tulcea: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Vâlcea: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				26,
				3,
				3
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] },
		Vaslui: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		Vrancea: { SH: [{
			name: "Vacanţa de schi",
			2023: [
				2,
				20,
				2,
				26
			],
			2024: [
				2,
				19,
				2,
				25
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] }
	},
	rs: { SH: [
		{
			name: "Зимски распуст",
			2019: [
				12,
				30,
				1,
				7
			],
			2020: [
				12,
				31,
				1,
				8
			],
			2021: [
				12,
				31,
				1,
				21
			],
			2022: [
				1,
				4,
				1,
				21
			],
			2023: [
				1,
				3,
				1,
				20
			],
			2024: [
				12,
				30,
				1,
				17
			],
			2025: [
				12,
				31,
				1,
				16
			]
		},
		{
			name: "Пролећни распуст",
			2020: [
				4,
				15,
				4,
				20
			],
			2021: [
				4,
				30,
				5,
				7
			],
			2022: [
				4,
				22,
				5,
				3
			],
			2023: [
				4,
				11,
				4,
				18
			],
			2024: [
				4,
				29,
				5,
				6
			],
			2025: [
				4,
				16,
				4,
				21
			],
			2026: [
				4,
				10,
				4,
				14
			]
		},
		{
			name: "Летњи распуст",
			2020: [
				6,
				22,
				8,
				31
			],
			2021: [
				6,
				23,
				8,
				31
			],
			2022: [
				6,
				22,
				8,
				31
			],
			2023: [
				6,
				21,
				8,
				31
			],
			2024: [
				6,
				24,
				8,
				30
			],
			2025: [
				6,
				23,
				8,
				29
			],
			2026: [
				6,
				22,
				8,
				31
			]
		},
		{
			name: "Јесењи распуст",
			2020: [
				11,
				11,
				11,
				13
			],
			2021: [
				11,
				12,
				11,
				12
			],
			2023: [
				11,
				8,
				11,
				10
			],
			2024: [
				11,
				11,
				11,
				12
			],
			2025: [
				11,
				10,
				11,
				11
			]
		},
		{
			name: "Сретењски распуст",
			2026: [
				2,
				16,
				2,
				20
			]
		}
	] },
	ru: {
		PH: [
			{
				name: "1. Новогодние каникулы",
				fixed_date: [1, 1]
			},
			{
				name: "2. Новогодние каникулы",
				fixed_date: [1, 2]
			},
			{
				name: "3. Новогодние каникулы",
				fixed_date: [1, 3]
			},
			{
				name: "4. Новогодние каникулы",
				fixed_date: [1, 4]
			},
			{
				name: "5. Новогодние каникулы",
				fixed_date: [1, 5]
			},
			{
				name: "6. Новогодние каникулы",
				fixed_date: [1, 6]
			},
			{
				name: "Рождество Христово",
				fixed_date: [1, 7]
			},
			{
				name: "8. Новогодние каникулы",
				fixed_date: [1, 8]
			},
			{
				name: "День защитника Отечества",
				fixed_date: [2, 23]
			},
			{
				name: "Международный женский день",
				fixed_date: [3, 8]
			},
			{
				name: "День Победы",
				fixed_date: [5, 9]
			},
			{
				name: "Праздник Весны и Труда",
				fixed_date: [5, 1]
			},
			{
				name: "День народного единства",
				fixed_date: [11, 4]
			},
			{
				name: "День России",
				fixed_date: [6, 12]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=55.7780&lon=49.1303&zoom=18&addressdetails=1&accept-language=ru,en",
		Адыгея: {
			_state_code: "adygea",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=44.60627&lon=40.10432&zoom=18&addressdetails=1&accept-language=ru,us",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "Ураза-байрам",
					fixed_date: [7, 28]
				},
				{
					name: "Курбан-байрам",
					fixed_date: [10, 4]
				},
				{
					name: "День образования Республики Адыгея",
					fixed_date: [10, 5]
				}
			]
		},
		Башкортостан: {
			_state_code: "bashkortostan",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=54.1264&lon=56.5797&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "Ураза-байрам",
					fixed_date: [7, 28]
				},
				{
					name: "Курбан-байрам",
					fixed_date: [10, 4]
				},
				{
					name: "День Республики Башкирии",
					fixed_date: [10, 11]
				},
				{
					name: "День Конституции Башкортостана",
					fixed_date: [12, 24]
				}
			]
		},
		"Брянская область": {
			_state_code: "bryansk",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=52.952&lon=33.283&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "Радоница",
					fixed_date: [4, 29]
				},
				{
					name: "День освобождения города Брянска",
					fixed_date: [9, 17]
				}
			]
		},
		Дагестан: {
			_state_code: "dagestan",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=43.118&lon=46.959&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "День Конституции Республики Дагестан",
					fixed_date: [7, 26]
				},
				{
					name: "Ураза-байрам",
					fixed_date: [7, 28]
				},
				{
					name: "День единства народов Дагестана",
					fixed_date: [9, 15]
				},
				{
					name: "Курбан-байрам",
					fixed_date: [10, 4]
				}
			]
		},
		Ингушетия: {
			_state_code: "ingushetia",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=43.1171&lon=44.8626&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "День образования Республики Ингушетия",
					fixed_date: [6, 4]
				},
				{
					name: "Ураза-байрам",
					fixed_date: [7, 28]
				},
				{
					name: "Курбан-байрам",
					fixed_date: [10, 4]
				}
			]
		},
		"Кабардино-Балкария": {
			_state_code: "kabardino_balkaria",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=43.497&lon=43.423&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "День возрождения балкарского народа",
					fixed_date: [3, 28]
				},
				{
					name: "Черкесский день траура",
					fixed_date: [5, 21]
				},
				{
					name: "Ураза-байрам",
					fixed_date: [7, 28]
				},
				{
					name: "День государственности Кабардино-Балкарской Республики",
					fixed_date: [9, 1]
				},
				{
					name: "Курбан-байрам",
					fixed_date: [10, 4]
				}
			]
		},
		Калмыкия: {
			_state_code: "kalmykia",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=46.524&lon=44.731&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "Цаган Сар",
					fixed_date: [1, 14]
				},
				{
					name: "День принятия Степного Уложения (Конституции) Республики Калмыкия",
					fixed_date: [4, 5]
				},
				{
					name: "День рождения Будды Шакьямун",
					fixed_date: [6, 6]
				},
				{
					name: "Зул",
					fixed_date: [12, 15]
				},
				{
					name: "День памяти жертв депортации калмыцкого народа",
					fixed_date: [12, 28]
				}
			]
		},
		"Карачаево-Черкесия": {
			_state_code: "karachay_cherkess",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=43.7916&lon=41.7268&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "День возрождения карачаевского народа",
					fixed_date: [5, 3]
				},
				{
					name: "Ураза-байрам",
					fixed_date: [7, 28]
				},
				{
					name: "Курбан-байрам",
					fixed_date: [10, 4]
				}
			]
		},
		"Приволжский федеральный округ": {
			_state_code: "udmurtia",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=56.8642&lon=53.2054&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "День Государственности Удмуртской Республики",
					fixed_date: [5, 31]
				}
			]
		},
		"Республика Алтай": {
			_state_code: "altai",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=50.900&lon=86.899&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "Чага-Байрам",
					fixed_date: [1, 14]
				}
			]
		},
		"Республика Бурятия": {
			_state_code: "buryatia",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=52.014&lon=109.366&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "Сагаалган",
					fixed_date: [1, 14]
				}
			]
		},
		"Республика Карелия": {
			_state_code: "karelia",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=63.832&lon=33.626&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "День Республики Карелия",
					fixed_date: [6, 8]
				},
				{
					name: "День освобождения Карелии от фашистских захватчиков",
					fixed_date: [9, 30]
				}
			]
		},
		"Республика Коми": {
			_state_code: "komi",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=64.191&lon=55.826&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "День Республики Коми",
					fixed_date: [8, 22]
				}
			]
		},
		"Республика Саха (Якутия)": {
			_state_code: "sakha",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=62.1010&lon=129.7176&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "День Республики Саха",
					fixed_date: [4, 27]
				},
				{
					name: "Ысыах",
					fixed_date: [6, 23]
				},
				{
					name: "День государственности Республики Саха",
					fixed_date: [9, 27]
				}
			]
		},
		"Республика Тыва": {
			_state_code: "tuva",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=51.781&lon=94.033&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "Народный праздник Шагаа",
					fixed_date: [1, 14]
				},
				{
					name: "День Республики Тыва",
					fixed_date: [8, 15]
				}
			]
		},
		"Саратовская область": {
			_state_code: "saratov",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=51.335&lon=46.668&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "Радоница",
					fixed_date: [4, 29]
				}
			]
		},
		Татарстан: {
			_state_code: "tatarstan",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=55.7780&lon=49.1303&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "Ураза-байрам",
					fixed_date: [7, 28]
				},
				{
					name: "День Республики Татарстан",
					fixed_date: [8, 30]
				},
				{
					name: "Курбан-байрам",
					fixed_date: [10, 4]
				},
				{
					name: "День Конституции Республики Татарстан",
					fixed_date: [11, 6]
				}
			]
		},
		Чечня: {
			_state_code: "chechnya",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=43.451&lon=45.700&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "День мира в Чеченской Республике",
					fixed_date: [4, 16]
				},
				{
					name: "Ураза-байрам",
					fixed_date: [7, 28]
				},
				{
					name: "Курбан-байрам",
					fixed_date: [10, 4]
				}
			]
		},
		Чувашия: {
			_state_code: "chuvashia",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=55.4871&lon=47.1659&zoom=18&addressdetails=1&accept-language=ru,en",
			PH: [
				{
					name: "1. Новогодние каникулы",
					fixed_date: [1, 1]
				},
				{
					name: "2. Новогодние каникулы",
					fixed_date: [1, 2]
				},
				{
					name: "3. Новогодние каникулы",
					fixed_date: [1, 3]
				},
				{
					name: "4. Новогодние каникулы",
					fixed_date: [1, 4]
				},
				{
					name: "5. Новогодние каникулы",
					fixed_date: [1, 5]
				},
				{
					name: "6. Новогодние каникулы",
					fixed_date: [1, 6]
				},
				{
					name: "Рождество Христово",
					fixed_date: [1, 7]
				},
				{
					name: "8. Новогодние каникулы",
					fixed_date: [1, 8]
				},
				{
					name: "День защитника Отечества",
					fixed_date: [2, 23]
				},
				{
					name: "Международный женский день",
					fixed_date: [3, 8]
				},
				{
					name: "День Победы",
					fixed_date: [5, 9]
				},
				{
					name: "Праздник Весны и Труда",
					fixed_date: [5, 1]
				},
				{
					name: "День народного единства",
					fixed_date: [11, 4]
				},
				{
					name: "День России",
					fixed_date: [6, 12]
				},
				{
					name: "День Чувашской республики",
					fixed_date: [6, 24]
				}
			]
		}
	},
	se: {
		PH: [
			{
				name: "nyårsdagen",
				fixed_date: [1, 1]
			},
			{
				name: "trettondedag jul",
				fixed_date: [1, 6]
			},
			{
				name: "långfredagen",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "påskdagen",
				variable_date: "easter"
			},
			{
				name: "annandag påsk",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "första maj",
				fixed_date: [5, 1]
			},
			{
				name: "Kristi himmelsfärdsdag",
				variable_date: "easter",
				offset: 39
			},
			{
				name: "pingstdagen",
				variable_date: "easter",
				offset: 49
			},
			{
				name: "nationaldagen",
				fixed_date: [6, 6]
			},
			{
				name: "midsommardagen",
				variable_date: "nextSaturday20Jun"
			},
			{
				name: "alla helgons dag",
				variable_date: "nextSaturday31Oct"
			},
			{
				name: "juldagen",
				fixed_date: [12, 25]
			},
			{
				name: "annandag jul",
				fixed_date: [12, 26]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=63.1151&lon=16.5767&zoom=18&addressdetails=1&accept-language=sv,en"
	},
	si: {
		PH: [
			{
				name: "novo leto",
				fixed_date: [1, 1]
			},
			{
				name: "Prešernov dan, slovenski kulturni praznik",
				fixed_date: [2, 8]
			},
			{
				name: "velikonočna nedelja",
				variable_date: "easter"
			},
			{
				name: "velikonočni ponedeljek",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "dan upora proti okupatorju",
				fixed_date: [4, 27]
			},
			{
				name: "praznik dela 1",
				fixed_date: [5, 1]
			},
			{
				name: "praznik dela 2",
				fixed_date: [5, 2]
			},
			{
				name: "binkoštna nedelja - binkošti",
				variable_date: "easter",
				offset: 49
			},
			{
				name: "dan državnosti",
				fixed_date: [6, 25]
			},
			{
				name: "Marijino vnebovzetje",
				fixed_date: [8, 15]
			},
			{
				name: "dan reformacije",
				fixed_date: [10, 31]
			},
			{
				name: "dan spomina na mrtve",
				fixed_date: [11, 1]
			},
			{
				name: "božič",
				fixed_date: [12, 25]
			},
			{
				name: "dan samostojnosti in enotnosti",
				fixed_date: [12, 26]
			}
		],
		SH: [
			{
				name: "Novoletne počitnice",
				2019: [
					12,
					25,
					1,
					2
				],
				2020: [
					12,
					28,
					12,
					31
				],
				2021: [
					12,
					27,
					12,
					31
				],
				2022: [
					12,
					27,
					12,
					30
				],
				2023: [
					12,
					27,
					1,
					2
				],
				2024: [
					12,
					27,
					1,
					2
				],
				2025: [
					12,
					29,
					12,
					31
				]
			},
			{
				name: "Prvomajske počitnice",
				2020: [
					4,
					27,
					5,
					1
				],
				2021: [
					4,
					28,
					4,
					30
				],
				2022: [
					4,
					28,
					4,
					29
				],
				2023: [
					4,
					28,
					4,
					28
				],
				2024: [
					4,
					28,
					5,
					2
				],
				2025: [
					4,
					28,
					5,
					2
				],
				2026: [
					4,
					28,
					4,
					30
				]
			},
			{
				name: "Poletne počitnice",
				2020: [
					6,
					26,
					8,
					31
				],
				2021: [
					6,
					26,
					8,
					31
				],
				2022: [
					6,
					26,
					8,
					31
				],
				2023: [
					6,
					26,
					8,
					31
				],
				2024: [
					6,
					26,
					8,
					31
				],
				2025: [
					6,
					26,
					8,
					31
				],
				2026: [
					6,
					26,
					8,
					31
				]
			},
			{
				name: "Jesenske počitnice",
				2020: [
					10,
					26,
					10,
					30
				],
				2021: [
					10,
					25,
					11,
					1
				],
				2022: [
					10,
					31,
					11,
					4
				],
				2023: [
					10,
					30,
					11,
					1
				],
				2024: [
					10,
					28,
					11,
					1
				],
				2025: [
					10,
					27,
					10,
					31
				]
			},
			{
				name: "Pouka prost dan",
				2024: [
					5,
					3,
					5,
					3
				]
			}
		],
		"vzhodne regije": { SH: [{
			name: "Zimske počitnice",
			2020: [
				2,
				24,
				2,
				28
			],
			2021: [
				2,
				15,
				2,
				19
			],
			2022: [
				2,
				28,
				3,
				4
			],
			2023: [
				1,
				30,
				2,
				3
			],
			2024: [
				2,
				26,
				3,
				1
			],
			2025: [
				2,
				17,
				2,
				21
			],
			2026: [
				2,
				23,
				2,
				27
			]
		}] },
		"zahodne regije": { SH: [{
			name: "Zimske počitnice",
			2020: [
				2,
				17,
				2,
				21
			],
			2021: [
				2,
				22,
				2,
				26
			],
			2022: [
				2,
				21,
				2,
				25
			],
			2023: [
				2,
				6,
				2,
				10
			],
			2024: [
				2,
				19,
				2,
				23
			],
			2025: [
				2,
				24,
				2,
				28
			],
			2026: [
				2,
				16,
				2,
				20
			]
		}] }
	},
	sk: {
		PH: [
			{
				name: "Deň vzniku Slovenskej republiky",
				fixed_date: [1, 1]
			},
			{
				name: "Zjavenie Pána",
				fixed_date: [1, 6]
			},
			{
				name: "Veľký piatok",
				variable_date: "easter",
				offset: -2
			},
			{
				name: "Veľkonočná nedeľa",
				variable_date: "easter"
			},
			{
				name: "Veľkonočný pondelok",
				variable_date: "easter",
				offset: 1
			},
			{
				name: "Sviatok práce",
				fixed_date: [5, 1]
			},
			{
				name: "Deň víťazstva nad fašizmom",
				fixed_date: [5, 8]
			},
			{
				name: "Sviatok svätého Cyrila a Metoda",
				fixed_date: [7, 5]
			},
			{
				name: "Výročie Slovenského národného povstania",
				fixed_date: [8, 29]
			},
			{
				name: "Deň Ústavy Slovenskej republiky",
				fixed_date: [9, 1]
			},
			{
				name: "Sviatok Panny Márie Sedembolestnej",
				fixed_date: [9, 15]
			},
			{
				name: "Sviatok všetkých svätých",
				fixed_date: [11, 1]
			},
			{
				name: "Deň boja za slobodu a demokraciu",
				fixed_date: [11, 17]
			},
			{
				name: "Štedrý deň",
				fixed_date: [12, 24]
			},
			{
				name: "Prvý sviatok vianočný",
				fixed_date: [12, 25]
			},
			{
				name: "Druhý sviatok vianočný",
				fixed_date: [12, 26]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=48.7411522&lon=19.4528646&zoom=18&addressdetails=1&accept-language=sk,en",
		"Banskobystrický kraj": { SH: [
			{
				name: "Vianočné prázdniny",
				2019: [
					12,
					23,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					7
				],
				2021: [
					12,
					23,
					1,
					7
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					7
				],
				2025: [
					12,
					22,
					1,
					7
				],
				2026: [
					12,
					23,
					1,
					7
				],
				2027: [
					12,
					23,
					1,
					7
				]
			},
			{
				name: "Jarné prázdniny",
				2020: [
					2,
					24,
					2,
					28
				],
				2021: [
					2,
					15,
					2,
					19
				],
				2022: [
					3,
					7,
					3,
					11
				],
				2023: [
					2,
					27,
					3,
					3
				],
				2024: [
					2,
					19,
					2,
					23
				],
				2025: [
					3,
					3,
					3,
					7
				],
				2026: [
					2,
					23,
					2,
					27
				],
				2027: [
					2,
					15,
					2,
					19
				],
				2028: [
					3,
					6,
					3,
					10
				]
			},
			{
				name: "Veľkonočné prázdniny",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				],
				2027: [
					3,
					25,
					3,
					30
				],
				2028: [
					4,
					13,
					4,
					18
				]
			},
			{
				name: "Letné prázdniny",
				2020: [
					7,
					1,
					8,
					31
				],
				2021: [
					7,
					1,
					8,
					31
				],
				2022: [
					7,
					1,
					8,
					31
				],
				2023: [
					7,
					1,
					8,
					31
				],
				2024: [
					7,
					1,
					9,
					1
				],
				2025: [
					6,
					28,
					9,
					1
				],
				2026: [
					7,
					1,
					8,
					31
				],
				2027: [
					7,
					1,
					8,
					31
				],
				2028: [
					7,
					3,
					9,
					1
				]
			},
			{
				name: "Jesenné prázdniny",
				2020: [
					10,
					28,
					10,
					29
				],
				2021: [
					10,
					28,
					10,
					29
				],
				2022: [
					10,
					28,
					10,
					31
				],
				2023: [
					10,
					30,
					10,
					31
				],
				2024: [
					10,
					30,
					10,
					31
				],
				2025: [
					10,
					30,
					10,
					31
				],
				2026: [
					10,
					29,
					10,
					30
				],
				2027: [
					10,
					28,
					10,
					29
				]
			}
		] },
		"Bratislavský kraj": { SH: [
			{
				name: "Vianočné prázdniny",
				2019: [
					12,
					23,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					7
				],
				2021: [
					12,
					23,
					1,
					7
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					7
				],
				2025: [
					12,
					22,
					1,
					7
				],
				2026: [
					12,
					23,
					1,
					7
				],
				2027: [
					12,
					23,
					1,
					7
				]
			},
			{
				name: "Jarné prázdniny",
				2020: [
					2,
					17,
					2,
					21
				],
				2021: [
					3,
					1,
					3,
					5
				],
				2022: [
					2,
					28,
					3,
					4
				],
				2023: [
					2,
					20,
					2,
					24
				],
				2024: [
					3,
					4,
					3,
					8
				],
				2025: [
					2,
					24,
					2,
					28
				],
				2026: [
					2,
					16,
					2,
					20
				],
				2027: [
					3,
					1,
					3,
					5
				],
				2028: [
					2,
					28,
					3,
					3
				]
			},
			{
				name: "Veľkonočné prázdniny",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				],
				2027: [
					3,
					25,
					3,
					30
				],
				2028: [
					4,
					13,
					4,
					18
				]
			},
			{
				name: "Letné prázdniny",
				2020: [
					7,
					1,
					8,
					31
				],
				2021: [
					7,
					1,
					8,
					31
				],
				2022: [
					7,
					1,
					8,
					31
				],
				2023: [
					7,
					1,
					8,
					31
				],
				2024: [
					7,
					1,
					9,
					1
				],
				2025: [
					6,
					28,
					9,
					1
				],
				2026: [
					7,
					1,
					8,
					31
				],
				2027: [
					7,
					1,
					8,
					31
				],
				2028: [
					7,
					3,
					9,
					1
				]
			},
			{
				name: "Jesenné prázdniny",
				2020: [
					10,
					28,
					10,
					29
				],
				2021: [
					10,
					28,
					10,
					29
				],
				2022: [
					10,
					28,
					10,
					31
				],
				2023: [
					10,
					30,
					10,
					31
				],
				2024: [
					10,
					30,
					10,
					31
				],
				2025: [
					10,
					30,
					10,
					31
				],
				2026: [
					10,
					29,
					10,
					30
				],
				2027: [
					10,
					28,
					10,
					29
				]
			}
		] },
		"Košický kraj": { SH: [
			{
				name: "Vianočné prázdniny",
				2019: [
					12,
					23,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					7
				],
				2021: [
					12,
					23,
					1,
					7
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					7
				],
				2025: [
					12,
					22,
					1,
					7
				],
				2026: [
					12,
					23,
					1,
					7
				],
				2027: [
					12,
					23,
					1,
					7
				]
			},
			{
				name: "Jarné prázdniny",
				2020: [
					3,
					2,
					3,
					6
				],
				2021: [
					2,
					22,
					2,
					26
				],
				2022: [
					2,
					21,
					2,
					25
				],
				2023: [
					3,
					6,
					3,
					10
				],
				2024: [
					2,
					26,
					3,
					1
				],
				2025: [
					2,
					17,
					2,
					21
				],
				2026: [
					3,
					2,
					3,
					6
				],
				2027: [
					2,
					22,
					2,
					26
				],
				2028: [
					2,
					21,
					2,
					25
				]
			},
			{
				name: "Veľkonočné prázdniny",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				],
				2027: [
					3,
					25,
					3,
					30
				],
				2028: [
					4,
					13,
					4,
					18
				]
			},
			{
				name: "Letné prázdniny",
				2020: [
					7,
					1,
					8,
					31
				],
				2021: [
					7,
					1,
					8,
					31
				],
				2022: [
					7,
					1,
					8,
					31
				],
				2023: [
					7,
					1,
					8,
					31
				],
				2024: [
					7,
					1,
					9,
					1
				],
				2025: [
					6,
					28,
					9,
					1
				],
				2026: [
					7,
					1,
					8,
					31
				],
				2027: [
					7,
					1,
					8,
					31
				],
				2028: [
					7,
					3,
					9,
					1
				]
			},
			{
				name: "Jesenné prázdniny",
				2020: [
					10,
					28,
					10,
					29
				],
				2021: [
					10,
					28,
					10,
					29
				],
				2022: [
					10,
					28,
					10,
					31
				],
				2023: [
					10,
					30,
					10,
					31
				],
				2024: [
					10,
					30,
					10,
					31
				],
				2025: [
					10,
					30,
					10,
					31
				],
				2026: [
					10,
					29,
					10,
					30
				],
				2027: [
					10,
					28,
					10,
					29
				]
			}
		] },
		"Nitriansky kraj": { SH: [
			{
				name: "Vianočné prázdniny",
				2019: [
					12,
					23,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					7
				],
				2021: [
					12,
					23,
					1,
					7
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					7
				],
				2025: [
					12,
					22,
					1,
					7
				],
				2026: [
					12,
					23,
					1,
					7
				],
				2027: [
					12,
					23,
					1,
					7
				]
			},
			{
				name: "Jarné prázdniny",
				2020: [
					2,
					17,
					2,
					21
				],
				2021: [
					3,
					1,
					3,
					5
				],
				2022: [
					2,
					28,
					3,
					4
				],
				2023: [
					2,
					20,
					2,
					24
				],
				2024: [
					3,
					4,
					3,
					8
				],
				2025: [
					2,
					24,
					2,
					28
				],
				2026: [
					2,
					16,
					2,
					20
				],
				2027: [
					3,
					1,
					3,
					5
				],
				2028: [
					2,
					28,
					3,
					3
				]
			},
			{
				name: "Veľkonočné prázdniny",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				],
				2027: [
					3,
					25,
					3,
					30
				],
				2028: [
					4,
					13,
					4,
					18
				]
			},
			{
				name: "Letné prázdniny",
				2020: [
					7,
					1,
					8,
					31
				],
				2021: [
					7,
					1,
					8,
					31
				],
				2022: [
					7,
					1,
					8,
					31
				],
				2023: [
					7,
					1,
					8,
					31
				],
				2024: [
					7,
					1,
					9,
					1
				],
				2025: [
					6,
					28,
					9,
					1
				],
				2026: [
					7,
					1,
					8,
					31
				],
				2027: [
					7,
					1,
					8,
					31
				],
				2028: [
					7,
					3,
					9,
					1
				]
			},
			{
				name: "Jesenné prázdniny",
				2020: [
					10,
					28,
					10,
					29
				],
				2021: [
					10,
					28,
					10,
					29
				],
				2022: [
					10,
					28,
					10,
					31
				],
				2023: [
					10,
					30,
					10,
					31
				],
				2024: [
					10,
					30,
					10,
					31
				],
				2025: [
					10,
					30,
					10,
					31
				],
				2026: [
					10,
					29,
					10,
					30
				],
				2027: [
					10,
					28,
					10,
					29
				]
			}
		] },
		"Prešovský kraj": { SH: [
			{
				name: "Vianočné prázdniny",
				2019: [
					12,
					23,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					7
				],
				2021: [
					12,
					23,
					1,
					7
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					7
				],
				2025: [
					12,
					22,
					1,
					7
				],
				2026: [
					12,
					23,
					1,
					7
				],
				2027: [
					12,
					23,
					1,
					7
				]
			},
			{
				name: "Jarné prázdniny",
				2020: [
					3,
					2,
					3,
					6
				],
				2021: [
					2,
					22,
					2,
					26
				],
				2022: [
					2,
					21,
					2,
					25
				],
				2023: [
					3,
					6,
					3,
					10
				],
				2024: [
					2,
					26,
					3,
					1
				],
				2025: [
					2,
					17,
					2,
					21
				],
				2026: [
					3,
					2,
					3,
					6
				],
				2027: [
					2,
					22,
					2,
					26
				],
				2028: [
					2,
					21,
					2,
					25
				]
			},
			{
				name: "Veľkonočné prázdniny",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				],
				2027: [
					3,
					25,
					3,
					30
				],
				2028: [
					4,
					13,
					4,
					18
				]
			},
			{
				name: "Letné prázdniny",
				2020: [
					7,
					1,
					8,
					31
				],
				2021: [
					7,
					1,
					8,
					31
				],
				2022: [
					7,
					1,
					8,
					31
				],
				2023: [
					7,
					1,
					8,
					31
				],
				2024: [
					7,
					1,
					9,
					1
				],
				2025: [
					6,
					28,
					9,
					1
				],
				2026: [
					7,
					1,
					8,
					31
				],
				2027: [
					7,
					1,
					8,
					31
				],
				2028: [
					7,
					3,
					9,
					1
				]
			},
			{
				name: "Jesenné prázdniny",
				2020: [
					10,
					28,
					10,
					29
				],
				2021: [
					10,
					28,
					10,
					29
				],
				2022: [
					10,
					28,
					10,
					31
				],
				2023: [
					10,
					30,
					10,
					31
				],
				2024: [
					10,
					30,
					10,
					31
				],
				2025: [
					10,
					30,
					10,
					31
				],
				2026: [
					10,
					29,
					10,
					30
				],
				2027: [
					10,
					28,
					10,
					29
				]
			}
		] },
		"Trenčiansky kraj": { SH: [
			{
				name: "Vianočné prázdniny",
				2019: [
					12,
					23,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					7
				],
				2021: [
					12,
					23,
					1,
					7
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					7
				],
				2025: [
					12,
					22,
					1,
					7
				],
				2026: [
					12,
					23,
					1,
					7
				],
				2027: [
					12,
					23,
					1,
					7
				]
			},
			{
				name: "Jarné prázdniny",
				2020: [
					2,
					24,
					2,
					28
				],
				2021: [
					2,
					15,
					2,
					19
				],
				2022: [
					3,
					7,
					3,
					11
				],
				2023: [
					2,
					27,
					3,
					3
				],
				2024: [
					2,
					19,
					2,
					23
				],
				2025: [
					3,
					3,
					3,
					7
				],
				2026: [
					2,
					23,
					2,
					27
				],
				2027: [
					2,
					15,
					2,
					19
				],
				2028: [
					3,
					6,
					3,
					10
				]
			},
			{
				name: "Veľkonočné prázdniny",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				],
				2027: [
					3,
					25,
					3,
					30
				],
				2028: [
					4,
					13,
					4,
					18
				]
			},
			{
				name: "Letné prázdniny",
				2020: [
					7,
					1,
					8,
					31
				],
				2021: [
					7,
					1,
					8,
					31
				],
				2022: [
					7,
					1,
					8,
					31
				],
				2023: [
					7,
					1,
					8,
					31
				],
				2024: [
					7,
					1,
					9,
					1
				],
				2025: [
					6,
					28,
					9,
					1
				],
				2026: [
					7,
					1,
					8,
					31
				],
				2027: [
					7,
					1,
					8,
					31
				],
				2028: [
					7,
					3,
					9,
					1
				]
			},
			{
				name: "Jesenné prázdniny",
				2020: [
					10,
					28,
					10,
					29
				],
				2021: [
					10,
					28,
					10,
					29
				],
				2022: [
					10,
					28,
					10,
					31
				],
				2023: [
					10,
					30,
					10,
					31
				],
				2024: [
					10,
					30,
					10,
					31
				],
				2025: [
					10,
					30,
					10,
					31
				],
				2026: [
					10,
					29,
					10,
					30
				],
				2027: [
					10,
					28,
					10,
					29
				]
			}
		] },
		"Trnavský kraj": { SH: [
			{
				name: "Vianočné prázdniny",
				2019: [
					12,
					23,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					7
				],
				2021: [
					12,
					23,
					1,
					7
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					7
				],
				2025: [
					12,
					22,
					1,
					7
				],
				2026: [
					12,
					23,
					1,
					7
				],
				2027: [
					12,
					23,
					1,
					7
				]
			},
			{
				name: "Jarné prázdniny",
				2020: [
					2,
					17,
					2,
					21
				],
				2021: [
					3,
					1,
					3,
					5
				],
				2022: [
					2,
					28,
					3,
					4
				],
				2023: [
					2,
					20,
					2,
					24
				],
				2024: [
					3,
					4,
					3,
					8
				],
				2025: [
					2,
					24,
					2,
					28
				],
				2026: [
					2,
					16,
					2,
					20
				],
				2027: [
					3,
					1,
					3,
					5
				],
				2028: [
					2,
					28,
					3,
					3
				]
			},
			{
				name: "Veľkonočné prázdniny",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				],
				2027: [
					3,
					25,
					3,
					30
				],
				2028: [
					4,
					13,
					4,
					18
				]
			},
			{
				name: "Letné prázdniny",
				2020: [
					7,
					1,
					8,
					31
				],
				2021: [
					7,
					1,
					8,
					31
				],
				2022: [
					7,
					1,
					8,
					31
				],
				2023: [
					7,
					1,
					8,
					31
				],
				2024: [
					7,
					1,
					9,
					1
				],
				2025: [
					6,
					28,
					9,
					1
				],
				2026: [
					7,
					1,
					8,
					31
				],
				2027: [
					7,
					1,
					8,
					31
				],
				2028: [
					7,
					3,
					9,
					1
				]
			},
			{
				name: "Jesenné prázdniny",
				2020: [
					10,
					28,
					10,
					29
				],
				2021: [
					10,
					28,
					10,
					29
				],
				2022: [
					10,
					28,
					10,
					31
				],
				2023: [
					10,
					30,
					10,
					31
				],
				2024: [
					10,
					30,
					10,
					31
				],
				2025: [
					10,
					30,
					10,
					31
				],
				2026: [
					10,
					29,
					10,
					30
				],
				2027: [
					10,
					28,
					10,
					29
				]
			}
		] },
		"Žilinský kraj": { SH: [
			{
				name: "Vianočné prázdniny",
				2019: [
					12,
					23,
					1,
					7
				],
				2020: [
					12,
					23,
					1,
					7
				],
				2021: [
					12,
					23,
					1,
					7
				],
				2022: [
					12,
					23,
					1,
					7
				],
				2023: [
					12,
					23,
					1,
					7
				],
				2024: [
					12,
					23,
					1,
					7
				],
				2025: [
					12,
					22,
					1,
					7
				],
				2026: [
					12,
					23,
					1,
					7
				],
				2027: [
					12,
					23,
					1,
					7
				]
			},
			{
				name: "Jarné prázdniny",
				2020: [
					2,
					24,
					2,
					28
				],
				2021: [
					2,
					15,
					2,
					19
				],
				2022: [
					3,
					7,
					3,
					11
				],
				2023: [
					2,
					27,
					3,
					3
				],
				2024: [
					2,
					19,
					2,
					23
				],
				2025: [
					3,
					3,
					3,
					7
				],
				2026: [
					2,
					23,
					2,
					27
				],
				2027: [
					2,
					15,
					2,
					19
				],
				2028: [
					3,
					6,
					3,
					10
				]
			},
			{
				name: "Veľkonočné prázdniny",
				2020: [
					4,
					9,
					4,
					14
				],
				2021: [
					4,
					1,
					4,
					6
				],
				2022: [
					4,
					14,
					4,
					19
				],
				2023: [
					4,
					6,
					4,
					11
				],
				2024: [
					3,
					28,
					4,
					2
				],
				2025: [
					4,
					17,
					4,
					22
				],
				2026: [
					4,
					2,
					4,
					7
				],
				2027: [
					3,
					25,
					3,
					30
				],
				2028: [
					4,
					13,
					4,
					18
				]
			},
			{
				name: "Letné prázdniny",
				2020: [
					7,
					1,
					8,
					31
				],
				2021: [
					7,
					1,
					8,
					31
				],
				2022: [
					7,
					1,
					8,
					31
				],
				2023: [
					7,
					1,
					8,
					31
				],
				2024: [
					7,
					1,
					9,
					1
				],
				2025: [
					6,
					28,
					9,
					1
				],
				2026: [
					7,
					1,
					8,
					31
				],
				2027: [
					7,
					1,
					8,
					31
				],
				2028: [
					7,
					3,
					9,
					1
				]
			},
			{
				name: "Jesenné prázdniny",
				2020: [
					10,
					28,
					10,
					29
				],
				2021: [
					10,
					28,
					10,
					29
				],
				2022: [
					10,
					28,
					10,
					31
				],
				2023: [
					10,
					30,
					10,
					31
				],
				2024: [
					10,
					30,
					10,
					31
				],
				2025: [
					10,
					30,
					10,
					31
				],
				2026: [
					10,
					29,
					10,
					30
				],
				2027: [
					10,
					28,
					10,
					29
				]
			}
		] }
	},
	sm: { SH: [
		{
			name: "Vacanze Natalizie",
			2019: [
				12,
				24,
				1,
				4
			],
			2020: [
				12,
				24,
				1,
				5
			],
			2021: [
				12,
				24,
				1,
				5
			],
			2022: [
				12,
				24,
				1,
				7
			],
			2023: [
				12,
				24,
				1,
				5
			],
			2024: [
				12,
				23,
				1,
				5
			],
			2025: [
				12,
				24,
				1,
				5
			]
		},
		{
			name: "Vacanze Pasquali",
			2020: [
				4,
				9,
				4,
				14
			],
			2021: [
				4,
				2,
				4,
				6
			],
			2022: [
				4,
				14,
				4,
				19
			],
			2023: [
				4,
				3,
				4,
				10
			],
			2024: [
				3,
				26,
				4,
				1
			],
			2025: [
				4,
				17,
				4,
				22
			],
			2026: [
				4,
				2,
				4,
				7
			]
		},
		{
			name: "Vacanze Estive",
			2020: [
				6,
				11,
				9,
				6
			],
			2021: [
				6,
				12,
				9,
				12
			],
			2022: [
				6,
				12,
				9,
				14
			],
			2023: [
				6,
				8,
				9,
				17
			],
			2024: [
				6,
				8,
				9,
				17
			],
			2025: [
				6,
				11,
				9,
				14
			]
		},
		{
			name: "Termine lezioni",
			2026: [
				6,
				17,
				6,
				17
			]
		}
	] },
	ua: { PH: [
		{
			name: "Новий рік",
			fixed_date: [1, 1]
		},
		{
			name: "Різдво",
			fixed_date: [1, 7]
		},
		{
			name: "Міжнародний жіночий день",
			fixed_date: [3, 8]
		},
		{
			name: "Великдень",
			variable_date: "orthodox easter",
			offset: 1
		},
		{
			name: "День Праці 1",
			fixed_date: [5, 1]
		},
		{
			name: "День Праці 2",
			fixed_date: [5, 2]
		},
		{
			name: "День Перемоги",
			fixed_date: [5, 9]
		},
		{
			name: "День Конституції України",
			fixed_date: [6, 28]
		},
		{
			name: "День Незалежності України",
			fixed_date: [8, 24]
		}
	] },
	us: {
		PH: [
			{
				name: "New Year's Day",
				fixed_date: [1, 1]
			},
			{
				name: "Memorial Day",
				variable_date: "lastMayMonday"
			},
			{
				name: "Independence Day",
				fixed_date: [7, 4]
			},
			{
				name: "Labor Day",
				variable_date: "firstSeptemberMonday"
			},
			{
				name: "Veterans Day",
				fixed_date: [11, 11]
			},
			{
				name: "Thanksgiving",
				variable_date: "firstNovemberThursday",
				offset: 21
			},
			{
				name: "Christmas Day",
				fixed_date: [12, 25]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=32.3673&lon=-86.2983&zoom=18&addressdetails=1&accept-language=en",
		Alabama: {
			_state_code: "al",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=32.3673&lon=-86.2983&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Robert E. Lee/Martin Luther King Birthday",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "George Washington/Thomas Jefferson Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Confederate Memorial Day",
					variable_date: "firstAprilMonday",
					offset: 21
				},
				{
					name: "Jefferson Davis' Birthday",
					variable_date: "firstJuneMonday"
				}
			]
		},
		Alaska: {
			_state_code: "ak",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=64.5082&lon=-165.4066&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Seward's Day",
					variable_date: "lastMarchMonday"
				},
				{
					name: "Alaska Day",
					fixed_date: [10, 18]
				}
			]
		},
		Arizona: {
			_state_code: "az",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=34.9378&lon=-109.7565&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Dr. Martin Luther King Jr./Civil Rights Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		Arkansas: {
			_state_code: "ar",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=34.74610&lon=-92.29054&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Dr. Martin Luther King Jr. and Robert E. Lee's Birthdays",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "George Washington's Birthday and Daisy Gatson Bates Day",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Eve",
					fixed_date: [12, 24]
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		California: {
			_state_code: "ca",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=40.8001&lon=-124.1698&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "César Chávez Day",
					fixed_date: [3, 31]
				}
			]
		},
		Colorado: {
			_state_code: "co",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=39.1804&lon=-106.8218&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		Connecticut: {
			_state_code: "ct",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=41.9111&lon=-72.16014&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Lincoln's Birthday",
					fixed_date: [2, 12]
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				}
			]
		},
		Delaware: {
			_state_code: "de",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=38.7113&lon=-75.0978&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Day After Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 22
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				}
			]
		},
		"District of Columbia": {
			_state_code: "dc",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=38.8953&lon=-77.0356&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Emancipation Day",
					fixed_date: [4, 16]
				}
			]
		},
		Florida: {
			_state_code: "fl",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=25.7720&lon=-80.1324&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Friday after Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 22
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		Georgia: {
			_state_code: "ga",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=31.0823&lon=-81.4192&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Robert E. Lee's Birthday",
					variable_date: "firstNovemberThursday",
					offset: 22
				},
				{
					name: "Washington's Birthday",
					fixed_date: [12, 24]
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Confederate Memorial Day",
					variable_date: "lastAprilMonday"
				}
			]
		},
		Guam: {
			_state_code: "gu",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=13.4311&lon=144.6549&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Guam Discovery Day",
					fixed_date: [3, 5]
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Liberation Day",
					fixed_date: [7, 21]
				},
				{
					name: "All Souls' Day",
					fixed_date: [11, 2]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Lady of Camarin Day",
					fixed_date: [12, 8]
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		Hawaii: {
			_state_code: "hi",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=19.6423&lon=-155.4837&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Prince Jonah Kuhio Kalanianaole Day",
					fixed_date: [3, 26]
				},
				{
					name: "Kamehameha Day",
					fixed_date: [6, 11]
				},
				{
					name: "Statehood Day",
					variable_date: "firstAugustFriday",
					offset: 14
				},
				{
					name: "Election Day",
					variable_date: "firstNovemberMonday",
					offset: 1
				}
			]
		},
		Idaho: {
			_state_code: "id",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=47.6710&lon=-116.7671&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr.-Idaho Human Rights Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		Illinois: {
			_state_code: "il",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=42.05202&lon=-87.67594&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Lincoln's Birthday",
					fixed_date: [2, 12]
				},
				{
					name: "Casimir Pulaski Day",
					variable_date: "firstMarchMonday"
				},
				{
					name: "Election Day",
					variable_date: "firstNovemberMonday",
					offset: 1
				}
			]
		},
		Indiana: {
			_state_code: "in",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=40.4179&lon=-86.8969&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Lincoln's Birthday",
					variable_date: "firstNovemberThursday",
					offset: 22
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Primary Election Day",
					variable_date: "firstMayMonday",
					offset: 1
				},
				{
					name: "Election Day",
					variable_date: "firstNovemberMonday",
					offset: 1
				}
			]
		},
		Iowa: {
			_state_code: "ia",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=41.9747&lon=-91.6760&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Lincoln's Birthday",
					fixed_date: [2, 12]
				}
			]
		},
		Kansas: {
			_state_code: "ks",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=37.6888&lon=-97.3271&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		Kentucky: {
			_state_code: "ky",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=36.8446&lon=-83.3196&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Eve",
					fixed_date: [12, 24]
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "New Year's Eve",
					fixed_date: [12, 31]
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				}
			]
		},
		Louisiana: {
			_state_code: "la",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=30.1800&lon=-90.1787&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Mardi Gras",
					variable_date: "easter",
					offset: -47
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Election Day",
					variable_date: "firstNovemberMonday",
					offset: 1
				}
			]
		},
		Maine: {
			_state_code: "me",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=44.7903&lon=-68.7829&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Patriots' Day",
					variable_date: "firstAprilMonday",
					offset: 14
				}
			]
		},
		Maryland: {
			_state_code: "md",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=38.3206&lon=-75.6213&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Native American Heritage Day",
					variable_date: "firstNovemberThursday",
					offset: 22
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		Massachusetts: {
			_state_code: "ma",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=42.3550&lon=-71.0645&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Patriots' Day",
					variable_date: "firstAprilMonday",
					offset: 14
				}
			]
		},
		Michigan: {
			_state_code: "mi",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=42.7153&lon=-84.4995&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Eve",
					fixed_date: [12, 24]
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "New Year's Eve",
					fixed_date: [12, 31]
				}
			]
		},
		Minnesota: {
			_state_code: "mn",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=47.8278&lon=-90.0484&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		Mississippi: {
			_state_code: "ms",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=30.3986&lon=-88.8820&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King's and Robert E. Lee's Birthdays",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Confederate Memorial Day",
					variable_date: "lastAprilMonday"
				}
			]
		},
		Missouri: {
			_state_code: "mo",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=37.0799&lon=-94.5060&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Truman Day",
					fixed_date: [5, 8]
				}
			]
		},
		Montana: {
			_state_code: "mt",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=48.3866&lon=-115.5498&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Election Day",
					variable_date: "firstNovemberMonday",
					offset: 1
				},
				{
					name: "Christmas Eve",
					fixed_date: [12, 24]
				},
				{
					name: "New Year's Eve",
					fixed_date: [12, 31]
				}
			]
		},
		Nebraska: {
			_state_code: "ne",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=41.2587&lon=-95.9374&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Arbor Day",
					variable_date: "lastAprilFriday"
				}
			]
		},
		Nevada: {
			_state_code: "nv",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=36.1215&lon=-115.1704&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Nevada Day",
					variable_date: "lastOctoberFriday"
				},
				{
					name: "Family Day",
					variable_date: "firstNovemberThursday",
					offset: 22
				}
			]
		},
		"New Hampshire": {
			_state_code: "nh",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=43.5628&lon=-71.9447&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Civil Rights Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Day after Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 22
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Election Day",
					variable_date: "firstNovemberMonday",
					offset: 1
				}
			]
		},
		"New Jersey": {
			_state_code: "nj",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=39.9475&lon=-75.1066&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Lincoln's Birthday",
					fixed_date: [2, 12]
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Election Day",
					variable_date: "firstNovemberMonday",
					offset: 1
				}
			]
		},
		"New Mexico": {
			_state_code: "nm",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=34.0790&lon=-107.6179&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Day after Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 22
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		"New York": {
			_state_code: "ny",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=42.8126&lon=-73.9379&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Lincoln's Birthday",
					fixed_date: [2, 12]
				},
				{
					name: "Election Day",
					variable_date: "firstNovemberMonday",
					offset: 1
				}
			]
		},
		"North Carolina": {
			_state_code: "nc",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=35.7802&lon=-78.6394&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Day after Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 22
				},
				{
					name: "Christmas Eve",
					fixed_date: [12, 24]
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Day after Christmas",
					fixed_date: [12, 26]
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				}
			]
		},
		"North Dakota": {
			_state_code: "nd",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=48.1459&lon=-103.6232&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		Ohio: {
			_state_code: "oh",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=41.4846&lon=-82.6852&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		Oklahoma: {
			_state_code: "ok",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=36.0514&lon=-95.7892&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Day after Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 22
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		Oregon: {
			_state_code: "or",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=45.3732&lon=-121.6959&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		Pennsylvania: {
			_state_code: "pa",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=40.3340&lon=-75.9300&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Flag Day",
					fixed_date: [6, 14]
				}
			]
		},
		"Puerto Rico": {
			_state_code: "pr",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=18.4364&lon=-66.1188&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "Día de Año Nuevo",
					fixed_date: [1, 1]
				},
				{
					name: "Día de Reyes",
					fixed_date: [1, 6]
				},
				{
					name: "Natalicio de Eugenio María de Hostos",
					variable_date: "firstJanuaryMonday",
					offset: 7
				},
				{
					name: "Natalicio de Martin Luther King, Jr.",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Día de los Presidentes",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Día de la Abolición de Esclavitud",
					fixed_date: [3, 22]
				},
				{
					name: "Viernes Santo",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Natalicio de José de Diego",
					variable_date: "firstAprilMonday",
					offset: 14
				},
				{
					name: "Recordación de los Muertos de la Guerra",
					variable_date: "lastMayMonday"
				},
				{
					name: "Día de la Independencia",
					fixed_date: [7, 4]
				},
				{
					name: "Constitución de Puerto Rico",
					fixed_date: [7, 25]
				},
				{
					name: "Natalicio de Dr. José Celso Barbosa",
					fixed_date: [7, 27]
				},
				{
					name: "Día del Trabajo",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Día de la Raza Descubrimiento de América",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Día del Veterano",
					fixed_date: [11, 11]
				},
				{
					name: "Día del Descubrimiento de Puerto Rico",
					fixed_date: [11, 19]
				},
				{
					name: "Día de Acción de Gracias",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Noche Buena",
					fixed_date: [12, 24]
				},
				{
					name: "Día de Navidad",
					fixed_date: [12, 25]
				}
			]
		},
		"Rhode Island": {
			_state_code: "ri",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=41.8251&lon=-71.4194&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Victory Day",
					variable_date: "firstAugustMonday",
					offset: 7
				}
			]
		},
		"South Carolina": {
			_state_code: "sc",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=32.7878&lon=-79.9392&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Confederate Memorial Day",
					fixed_date: [5, 10]
				}
			]
		},
		"South Dakota": {
			_state_code: "sd",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=43.7148&lon=-98.0249&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Native American Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		Tennessee: {
			_state_code: "tn",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=35.1438&lon=-90.0231&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Eve",
					fixed_date: [12, 24]
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				}
			]
		},
		Texas: {
			_state_code: "tx",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=30.2655&lon=-97.7559&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Friday after Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 22
				},
				{
					name: "Christmas Eve",
					fixed_date: [12, 24]
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Day after Christmas",
					fixed_date: [12, 26]
				}
			]
		},
		"United States Virgin Islands": {
			_state_code: "vi",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=18.3433&lon=-64.9347&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Virgin Islands-Puerto Rico Friendship Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Three Kings Day",
					fixed_date: [1, 6]
				},
				{
					name: "Transfer Day",
					fixed_date: [3, 31]
				},
				{
					name: "Holy Thursday",
					variable_date: "easter",
					offset: -3
				},
				{
					name: "Good Friday",
					variable_date: "easter",
					offset: -2
				},
				{
					name: "Easter Monday",
					variable_date: "easter",
					offset: 1
				},
				{
					name: "Emancipation Day",
					fixed_date: [7, 3]
				},
				{
					name: "Hurricane Supplication Day",
					variable_date: "firstJulyMonday",
					offset: 21
				},
				{
					name: "Hurricane Thanksgiving",
					fixed_date: [10, 25]
				},
				{
					name: "Liberty Day",
					fixed_date: [11, 1]
				},
				{
					name: "Christmas Second Day",
					fixed_date: [12, 26]
				},
				{
					name: "New Year's Eve",
					fixed_date: [12, 31]
				}
			]
		},
		Utah: {
			_state_code: "ut",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=40.5888&lon=-111.6378&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Pioneer Day",
					fixed_date: [7, 24]
				}
			]
		},
		Vermont: {
			_state_code: "vt",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=44.2597&lon=-72.5800&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Town Meeting Day",
					variable_date: "firstMarchTuesday"
				},
				{
					name: "Battle of Bennington",
					variable_date: "firstAugustMonday",
					offset: 14
				}
			]
		},
		Virginia: {
			_state_code: "va",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=36.9454&lon=-76.2888&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Election Day",
					variable_date: "firstNovemberMonday",
					offset: 1
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		Washington: {
			_state_code: "wa",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=46.8598&lon=-121.7256&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		},
		"West Virginia": {
			_state_code: "wv",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=38.3686&lon=-81.6070&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "West Virginia Day",
					fixed_date: [6, 20]
				},
				{
					name: "Lincoln's Day",
					variable_date: "firstNovemberThursday",
					offset: 22
				}
			]
		},
		Wisconsin: {
			_state_code: "wi",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=45.8719&lon=-89.6930&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				},
				{
					name: "Primary Election Day",
					variable_date: "firstAugustTuesday",
					offset: 7
				},
				{
					name: "Election Day",
					variable_date: "firstNovemberMonday",
					offset: 1
				}
			]
		},
		Wyoming: {
			_state_code: "wy",
			_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=42.8590&lon=-106.3126&zoom=18&addressdetails=1&accept-language=en",
			PH: [
				{
					name: "New Year's Day",
					fixed_date: [1, 1]
				},
				{
					name: "Martin Luther King, Jr. Day",
					variable_date: "firstJanuaryMonday",
					offset: 14
				},
				{
					name: "Washington's Birthday",
					variable_date: "firstFebruaryMonday",
					offset: 14
				},
				{
					name: "Memorial Day",
					variable_date: "lastMayMonday"
				},
				{
					name: "Independence Day",
					fixed_date: [7, 4]
				},
				{
					name: "Labor Day",
					variable_date: "firstSeptemberMonday"
				},
				{
					name: "Columbus Day",
					variable_date: "firstOctoberMonday",
					offset: 7
				},
				{
					name: "Veterans Day",
					fixed_date: [11, 11]
				},
				{
					name: "Thanksgiving",
					variable_date: "firstNovemberThursday",
					offset: 21
				},
				{
					name: "Christmas Day",
					fixed_date: [12, 25]
				}
			]
		}
	},
	vn: {
		PH: [
			{
				name: "Tết Dương Lịch",
				fixed_date: [1, 1]
			},
			{
				name: "Ngày Quốc tế Phụ nữ",
				fixed_date: [3, 8]
			},
			{
				name: "Ngày thành lập Đoàn Thanh niên Cộng sản Hồ Chí Minh",
				fixed_date: [3, 26]
			},
			{
				name: "Ngày Quốc tế Thiếu nhi",
				fixed_date: [6, 1]
			},
			{
				name: "Ngày Nhà giáo Việt Nam",
				fixed_date: [11, 20]
			},
			{
				name: "Ngày Giải phóng miền Nam, Thống nhất Đất nước",
				fixed_date: [4, 30]
			},
			{
				name: "Ngày Quốc tế lao động",
				fixed_date: [5, 1]
			},
			{
				name: "Quốc Khánh",
				fixed_date: [9, 2]
			},
			{
				name: "Lễ Giáng Sinh",
				fixed_date: [12, 25]
			}
		],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=10.77374&lon=106.70094&zoom=16&addressdetails=1&accept-language=en"
	},
	xa: {
		PH: [{
			name: "New Year",
			fixed_date: [1, 1]
		}],
		SH: [{
			name: "Summer",
			2020: [
				6,
				21,
				9,
				23
			],
			2021: [
				6,
				21,
				9,
				23
			],
			2022: [
				6,
				21,
				9,
				23
			],
			2023: [
				6,
				21,
				9,
				23
			],
			2024: [
				6,
				21,
				9,
				23
			],
			2025: [
				6,
				21,
				9,
				23
			],
			2026: [
				6,
				21,
				9,
				23
			],
			2027: [
				6,
				21,
				9,
				23
			],
			2028: [
				6,
				21,
				9,
				23
			],
			2029: [
				6,
				21,
				9,
				23
			],
			2030: [
				6,
				21,
				9,
				23
			],
			2031: [
				6,
				21,
				9,
				23
			],
			2032: [
				6,
				21,
				9,
				23
			]
		}],
		_nominatim_url: "https://nominatim.openstreetmap.org/reverse?format=json&lat=0.0&lon=0.0&zoom=18&addressdetails=1&accept-language=en"
	},
	za: { SH: [
		{
			name: "Summer Break",
			2019: [
				12,
				7,
				1,
				12
			],
			2020: [
				12,
				17,
				1,
				10
			],
			2021: [
				12,
				11,
				1,
				9
			],
			2022: [
				12,
				17,
				1,
				8
			],
			2023: [
				12,
				16,
				1,
				14
			],
			2024: [
				12,
				14,
				1,
				12
			],
			2025: [
				12,
				13,
				1,
				11
			],
			2026: [
				12,
				12,
				1,
				10
			],
			2027: [
				12,
				11,
				1,
				9
			]
		},
		{
			name: "Autumn Break",
			2020: [
				3,
				19,
				5,
				31
			],
			2021: [
				3,
				27,
				4,
				12
			],
			2022: [
				3,
				18,
				4,
				4
			],
			2023: [
				3,
				25,
				4,
				11
			],
			2024: [
				3,
				22,
				4,
				2
			],
			2025: [
				3,
				29,
				4,
				7
			],
			2026: [
				3,
				28,
				4,
				7
			],
			2027: [
				3,
				20,
				4,
				5
			]
		},
		{
			name: "Winter Break",
			2020: [
				8,
				11,
				8,
				11
			],
			2021: [
				6,
				26,
				7,
				19
			],
			2022: [
				6,
				25,
				7,
				18
			],
			2023: [
				6,
				24,
				7,
				17
			],
			2024: [
				6,
				15,
				7,
				8
			],
			2025: [
				6,
				28,
				7,
				21
			],
			2026: [
				6,
				27,
				7,
				20
			],
			2027: [
				6,
				26,
				7,
				19
			]
		},
		{
			name: "Spring Break",
			2020: [
				9,
				25,
				10,
				4
			],
			2021: [
				10,
				2,
				10,
				11
			],
			2022: [
				10,
				1,
				10,
				10
			],
			2023: [
				9,
				30,
				10,
				9
			],
			2024: [
				9,
				21,
				9,
				30
			],
			2025: [
				10,
				4,
				10,
				12
			],
			2026: [
				10,
				3,
				10,
				12
			],
			2027: [
				10,
				2,
				10,
				10
			]
		},
		{
			name: "Special School Holiday",
			2021: [
				4,
				26,
				4,
				26
			],
			2022: [
				8,
				8,
				8,
				8
			],
			2023: [
				4,
				28,
				4,
				28
			],
			2024: [
				4,
				26,
				4,
				26
			],
			2025: [
				6,
				2,
				6,
				2
			],
			2026: [
				9,
				25,
				9,
				25
			],
			2027: [
				4,
				26,
				4,
				26
			]
		}
	] }
}), M = {
	"assuming ok for ko": {
		daytime: "sunrise-sunset",
		spring: "Mar-May",
		summer: "Jun-Aug",
		autumn: "Sep-Nov",
		winter: "Dec-Feb",
		_: "-",
		"=": "-",
		frühling: "Mar-May",
		frühjahr: "Mar-May",
		sommer: "Jun-Aug",
		herbst: "Sep-Nov",
		gesloten: "off",
		feestdag: "PH",
		feestdagen: "PH",
		m: "Mo",
		w: "We",
		f: "Fr",
		primavera: "Mar-May",
		estate: "Jun-Aug",
		autunno: "Sep-Nov",
		inverno: "Dec-Feb"
	},
	"please use English written ok for ko": { "(?:an )?feiertag(?:s|en?)?": "PH" },
	"please use off for ko": {
		"ruhetage?": "off",
		geschlossen: "off",
		geschl: "off",
		except: "off"
	},
	"please use ok for workday": {
		wd: "Mo-Fr",
		"on work days?": "Mo-Fr",
		"weekdays?": "Mo-Fr",
		"werktags?": "Mo-Sa",
		vardagar: "Mo-Fr"
	},
	"omit hour keyword": { h: "" },
	"omit ko": {
		season: "",
		hs: "",
		hrs: "",
		hours: "",
		uhr: "",
		geöffnet: "",
		zwischen: "",
		ist: "",
		durchgehend: "",
		"öffnungszeit(?:en)?:?": ""
	},
	"omit tag key": { "opening_hours\\s*=": "" },
	"omit wrong keyword open end": {
		from: "",
		ab: "",
		von: ""
	},
	"assuming open end for ko": { "(?:bis|till?|-|–)? ?(?:open ?end|late)": "+" },
	"please use ok for uncertainty": {
		"~": "-",
		"～": "-"
	},
	"please use fallback rule": { otherwise: "||" },
	"please use ok for missing data": { "\\?": "" },
	"please use ok for ko": {
		"→": "-",
		"−": "-",
		"—": "-",
		ー: "-",
		to: "-",
		до: "-",
		a: "-",
		as: "-",
		á: "-",
		ás: "-",
		às: "-",
		ate: "-",
		"till?": "-",
		until: "-",
		through: "-",
		and: ",",
		"&": ",",
		"：": ":",
		"'": "\"",
		always: "24/7",
		"always open": "24/7",
		"always closed": "closed",
		nonstop: "24/7",
		"24x7": "24/7",
		anytime: "24/7",
		"all day": "24/7",
		daily: "Mo-Su",
		everyday: "Mo-Su",
		"every day": "Mo-Su",
		"all days": "Mo-Su",
		"7j/7": "Mo-Su",
		"7/7": "Mo-Su",
		"7days": "Mo-Su",
		"7 days": "Mo-Su",
		"7 days a week": "Mo-Su",
		"7 days/week": "Mo-Su",
		"24 hours 7 days a week": "24/7",
		"24 hours": "00:00-24:00",
		midday: "12:00",
		midnight: "00:00",
		"(?:public )?holidays?": "PH",
		"(?:one )?day after public holiday": "PH +1 day",
		"(?:one )?day before public holiday": "PH -1 day",
		"school ?holidays?": "SH",
		"weekends?": "Sa,Su",
		daylight: "sunrise-sunset",
		"on(?:_| )?appointments?": "\"on appointment\"",
		"by(?:_| )?appointments?": "\"by appointment\"",
		"nach(?: |_)vereinbarung": "\"Nach Vereinbarung\"",
		"nach(?: |_)absprache": "\"Nach Absprache\"",
		bis: "-",
		täglich: "Mo-Su",
		"(?:schul)?ferien": "SH",
		"(?:an|nur)? ?sonn-?(?: und |/)feiertag(?:s|en?)?": "PH,Su",
		und: ",",
		u: ",",
		auch: ",",
		fermé: "off",
		et: ",",
		à: "-",
		"jours fériés": "PH",
		sundown: "sunset",
		morgendämmerung: "dawn",
		abenddämmerung: "dusk",
		sonnenaufgang: "sunrise",
		sonnenuntergang: "sunset",
		ostern: "easter"
	},
	"please use English abbreviation ok for so": { so: "Su" },
	"please use English abbreviation ok for ko": {
		sun: "Su",
		"sundays?": "Su",
		mon: "Mo",
		"mondays?": "Mo",
		"tues?": "Tu",
		"tuesdays?": "Tu",
		"weds?": "We",
		"wednesdays?": "We",
		thu: "Th",
		"thurs?": "Th",
		"thursdays?": "Th",
		fri: "Fr",
		"fridays?": "Fr",
		sat: "Sa",
		"saturdays?": "Sa",
		son: "Su",
		"sonn-": "Su",
		"sonntags?": "Su",
		"montags?": "Mo",
		di: "Tu",
		"die?": "Tu",
		"dienstags?": "Tu",
		mi: "We",
		"mit?": "We",
		"mittwochs?": "We",
		"don?": "Th",
		"donnerstags?": "Th",
		fre: "Fr",
		"freitags?": "Fr",
		sam: "Sa",
		"samstags?": "Sa",
		dim: "Su",
		"lun?": "Mo",
		mer: "We",
		"jeu?": "Th",
		"ven?": "Fr",
		"zon?": "Su",
		zontag: "Su",
		din: "Tu",
		"woe?": "We",
		"vri?": "Fr",
		"zat?": "Sa",
		ne: "Su",
		po: "Mo",
		út: "Tu",
		st: "We",
		čt: "Th",
		pá: "Fr",
		selasa: "Su",
		rabu: "Mo",
		kami: "Tu",
		jumat: "We",
		sabtu: "Th",
		minggu: "Fr",
		senin: "Sa",
		söndagar: "Su",
		ma: "Mo",
		lördagar: "Sa",
		niedz: "Su",
		n: "Su",
		ndz: "Su",
		poniedzialek: "Mo",
		pon: "Mo",
		pn: "Mo",
		wt: "Tu",
		sroda: "We",
		śr: "We",
		sr: "We",
		czw: "Th",
		cz: "Th",
		piatek: "Fr",
		pt: "Fr",
		sob: "Sa",
		Вс: "Su",
		"voskresen'ye": "Su",
		Пн: "Mo",
		"ponedel'nik": "Mo",
		vtornik: "Tu",
		chetverk: "Th",
		pyatnitsa: "Fr",
		subbota: "Sa",
		dom: "Su",
		"domenica?": "Su",
		"domeniche?": "Su",
		"lunedì?": "Mo",
		"mar?": "Tu",
		"martedì?": "Tu",
		"mer?": "We",
		"mercoledì?": "We",
		gio: "Th",
		"giovedì?": "Th",
		ven: "Fr",
		"venerdì?": "Fr",
		sab: "Sa",
		"sabato?": "Sa",
		jänner: "Jan",
		"june?": "Jun",
		"july?": "Jul",
		sept: "Sep",
		"märz?": "Mar",
		maerz: "Mar",
		okt: "Oct",
		dez: "Dec",
		fév: "Feb",
		avr: "Apr",
		aoû: "Aug",
		"giugno?": "Jun",
		"luglio?": "Jul",
		saterdag: "Sa",
		sondag: "Su",
		maandag: "Mo",
		dinsdag: "Tu",
		woensdag: "We",
		donderdag: "Th",
		vrydag: "Fr",
		"sa\\.": "Sa",
		"so\\.": "Su",
		"ma\\.": "Mo",
		"di\\.": "Tu",
		"wo\\.": "We",
		"do\\.": "Th",
		"vr\\.": "Fr",
		januarie: "Jan",
		februarie: "Feb",
		maart: "Mar",
		april: "Apr",
		mei: "May",
		junie: "Jun",
		julie: "Jul",
		augustus: "Aug",
		september: "Sep",
		oktober: "Oct",
		november: "Nov",
		desember: "Dec",
		"jan\\.": "Jan",
		"feb\\.": "Feb",
		"mrt\\.": "Mar",
		"apr\\.": "Apr",
		"jun\\.": "Jun",
		"jul\\.": "Jul",
		"aug\\.": "Aug",
		"sep\\.": "Sep",
		"okt\\.": "Oct",
		"nov\\.": "Nov",
		"des\\.": "Dec",
		memeneda: "Sa",
		kwasiada: "Su",
		dwoada: "Mo",
		benada: "Tu",
		wukuada: "We",
		yawoada: "Th",
		fiada: "Fr",
		mem: "Sa",
		dwo: "Mo",
		ben: "Tu",
		wuk: "We",
		yaw: "Th",
		fia: "Fr",
		ɔpɛpɔn: "Jan",
		ɔgyefoɔ: "Feb",
		ɔbɛnem: "Mar",
		oforisuo: "Apr",
		kɔtɔnimma: "May",
		ayɛwohomumu: "Jun",
		kutawonsa: "Jul",
		ɔsanaa: "Aug",
		ɛbɔ: "Sep",
		ahinime: "Oct",
		obubuo: "Nov",
		ɔpɛnimma: "Dec",
		ቅዳሜ: "Sa",
		እሑድ: "Su",
		ሰኞ: "Mo",
		ማክሰኞ: "Tu",
		ረቡዕ: "We",
		ሐሙስ: "Th",
		ዓርብ: "Fr",
		ማክሰ: "Tu",
		ጃንዋሪ: "Jan",
		ፌብሩዋሪ: "Feb",
		ማርች: "Mar",
		ኤፕሪል: "Apr",
		ሜይ: "May",
		ጁን: "Jun",
		ጁላይ: "Jul",
		ኦገስት: "Aug",
		ሴፕቴምበር: "Sep",
		ኦክቶበር: "Oct",
		ኖቬምበር: "Nov",
		ዲሴምበር: "Dec",
		ጃን: "Jan",
		ፌብ: "Feb",
		ኤፕሪ: "Apr",
		ኦገስ: "Aug",
		ሴፕቴ: "Sep",
		ኦክቶ: "Oct",
		ኖቬም: "Nov",
		ዲሴም: "Dec",
		السبت: "Sa",
		الأحد: "Su",
		الاثنين: "Mo",
		الثلاثاء: "Tu",
		الأربعاء: "We",
		الخميس: "Th",
		الجمعة: "Fr",
		يناير: "Jan",
		فبراير: "Feb",
		مارس: "Mar",
		أبريل: "Apr",
		مايو: "May",
		يونيو: "Jun",
		يوليو: "Jul",
		أغسطس: "Aug",
		سبتمبر: "Sep",
		أكتوبر: "Oct",
		نوفمبر: "Nov",
		ديسمبر: "Dec",
		শনিবাৰ: "Sa",
		দেওবাৰ: "Su",
		সোমবাৰ: "Mo",
		মঙ্গলবাৰ: "Tu",
		বুধবাৰ: "We",
		বৃহস্পতিবাৰ: "Th",
		শুক্ৰবাৰ: "Fr",
		শনি: "Sa",
		দেও: "Su",
		সোম: "Mo",
		মঙ্গল: "Tu",
		বুধ: "We",
		বৃহ: "Th",
		শুক্ৰ: "Fr",
		জানুৱাৰী: "Jan",
		ফেব্ৰুৱাৰী: "Feb",
		মাৰ্চ: "Mar",
		এপ্ৰিল: "Apr",
		"মে’": "May",
		জুন: "Jun",
		জুলাই: "Jul",
		আগষ্ট: "Aug",
		ছেপ্তেম্বৰ: "Sep",
		অক্টোবৰ: "Oct",
		নৱেম্বৰ: "Nov",
		ডিচেম্বৰ: "Dec",
		জানু: "Jan",
		ফেব্ৰু: "Feb",
		আগ: "Aug",
		ছেপ্তে: "Sep",
		অক্টো: "Oct",
		নৱে: "Nov",
		ডিচে: "Dec",
		şənbə: "Sa",
		bazar: "Su",
		"bazar ertəsi": "Mo",
		"çərşənbə axşamı": "Tu",
		çərşənbə: "We",
		"cümə axşamı": "Th",
		cümə: "Fr",
		"ş\\.": "Sa",
		"b\\.": "Su",
		"b\\.e\\.": "Mo",
		"ç\\.a\\.": "Tu",
		"ç\\.": "We",
		"c\\.a\\.": "Th",
		"c\\.": "Fr",
		yanvar: "Jan",
		fevral: "Feb",
		mart: "Mar",
		aprel: "Apr",
		iyun: "Jun",
		iyul: "Jul",
		avqust: "Aug",
		sentyabr: "Sep",
		oktyabr: "Oct",
		noyabr: "Nov",
		dekabr: "Dec",
		fev: "Feb",
		iyn: "Jun",
		iyl: "Jul",
		avq: "Aug",
		noy: "Nov",
		dek: "Dec",
		субота: "Sa",
		нядзеля: "Su",
		панядзелак: "Mo",
		аўторак: "Tu",
		серада: "We",
		чацвер: "Th",
		пятніца: "Fr",
		сб: "Sa",
		нд: "Su",
		аў: "Tu",
		ср: "We",
		чц: "Th",
		пт: "Fr",
		студзень: "Jan",
		люты: "Feb",
		сакавік: "Mar",
		красавік: "Apr",
		май: "May",
		чэрвень: "Jun",
		ліпень: "Jul",
		жнівень: "Aug",
		верасень: "Sep",
		кастрычнік: "Oct",
		лістапад: "Nov",
		снежань: "Dec",
		сту: "Jan",
		лют: "Feb",
		сак: "Mar",
		кра: "Apr",
		чэр: "Jun",
		ліп: "Jul",
		жні: "Aug",
		вер: "Sep",
		кас: "Oct",
		ліс: "Nov",
		сне: "Dec",
		събота: "Sa",
		неделя: "Su",
		понеделник: "Mo",
		вторник: "Tu",
		сряда: "We",
		четвъртък: "Th",
		петък: "Fr",
		вт: "Tu",
		чт: "Th",
		януари: "Jan",
		февруари: "Feb",
		март: "Mar",
		април: "Apr",
		юни: "Jun",
		юли: "Jul",
		август: "Aug",
		септември: "Sep",
		октомври: "Oct",
		ноември: "Nov",
		декември: "Dec",
		sibiri: "Sa",
		kari: "Su",
		ntɛnɛ: "Mo",
		tarata: "Tu",
		araba: "We",
		alamisa: "Th",
		juma: "Fr",
		ntɛ: "Mo",
		tar: "Tu",
		zanwuye: "Jan",
		feburuye: "Feb",
		marisi: "Mar",
		awirili: "Apr",
		mɛ: "May",
		zuwɛn: "Jun",
		zuluye: "Jul",
		uti: "Aug",
		sɛtanburu: "Sep",
		ɔkutɔburu: "Oct",
		nowanburu: "Nov",
		desanburu: "Dec",
		zan: "Jan",
		awi: "Apr",
		zuw: "Jun",
		zul: "Jul",
		sɛt: "Sep",
		ɔku: "Oct",
		now: "Nov",
		des: "Dec",
		শনিবার: "Sa",
		রবিবার: "Su",
		সোমবার: "Mo",
		মঙ্গলবার: "Tu",
		বুধবার: "We",
		বৃহস্পতিবার: "Th",
		শুক্রবার: "Fr",
		রবি: "Su",
		বৃহস্পতি: "Th",
		শুক্র: "Fr",
		জানুয়ারী: "Jan",
		ফেব্রুয়ারী: "Feb",
		মার্চ: "Mar",
		এপ্রিল: "Apr",
		মে: "May",
		আগস্ট: "Aug",
		সেপ্টেম্বর: "Sep",
		অক্টোবর: "Oct",
		নভেম্বর: "Nov",
		ডিসেম্বর: "Dec",
		ফেব: "Feb",
		"སྤེན་པ་": "Sa",
		"ཉི་མ་": "Su",
		"ཟླ་བ་": "Mo",
		"མིག་དམར་": "Tu",
		"ལྷག་པ་": "We",
		"ཕུར་བུ་": "Th",
		"པ་སངས་": "Fr",
		"ཟླ་བ་དང་པོ་": "Jan",
		"ཟླ་བ་གཉིས་པ་": "Feb",
		"ཟླ་བ་གསུམ་པ་": "Mar",
		"ཟླ་བ་བཞི་པ་": "Apr",
		"ཟླ་བ་ལྔ་པ་": "May",
		"ཟླ་བ་དྲུག་པ་": "Jun",
		"ཟླ་བ་བདུན་པ་": "Jul",
		"ཟླ་བ་བརྒྱད་པ་": "Aug",
		"ཟླ་བ་དགུ་པ་": "Sep",
		"ཟླ་བ་བཅུ་པ་": "Oct",
		"ཟླ་བ་བཅུ་གཅིག་པ་": "Nov",
		"ཟླ་བ་བཅུ་གཉིས་པ་": "Dec",
		"ཟླ་༡": "Jan",
		"ཟླ་༢": "Feb",
		"ཟླ་༣": "Mar",
		"ཟླ་༤": "Apr",
		"ཟླ་༥": "May",
		"ཟླ་༦": "Jun",
		"ཟླ་༧": "Jul",
		"ཟླ་༨": "Aug",
		"ཟླ་༩": "Sep",
		"ཟླ་༡༠": "Oct",
		"ཟླ་༡༡": "Nov",
		"ཟླ་༡༢": "Dec",
		sadorn: "Sa",
		mercʼher: "We",
		yaou: "Th",
		gwener: "Fr",
		"sad\\.": "Sa",
		"meu\\.": "Tu",
		"mer\\.": "We",
		"gwe\\.": "Fr",
		genver: "Jan",
		cʼhwevrer: "Feb",
		ebrel: "Apr",
		mae: "May",
		mezheven: "Jun",
		gouere: "Jul",
		eost: "Aug",
		gwengolo: "Sep",
		here: "Oct",
		kerzu: "Dec",
		"gen\\.": "Jan",
		"cʼhwe\\.": "Feb",
		"meur\\.": "Mar",
		"ebr\\.": "Apr",
		"mezh\\.": "Jun",
		"goue\\.": "Jul",
		"gwen\\.": "Sep",
		"kzu\\.": "Dec",
		subota: "Sa",
		nedjelja: "Su",
		ponedjeljak: "Mo",
		utorak: "Tu",
		srijeda: "We",
		četvrtak: "Th",
		petak: "Fr",
		sub: "Sa",
		ned: "Su",
		uto: "Tu",
		sri: "We",
		čet: "Th",
		pet: "Fr",
		januar: "Jan",
		februar: "Feb",
		juni: "Jun",
		juli: "Jul",
		august: "Aug",
		septembar: "Sep",
		oktobar: "Oct",
		novembar: "Nov",
		decembar: "Dec",
		dissabte: "Sa",
		diumenge: "Su",
		dilluns: "Mo",
		dimarts: "Tu",
		dimecres: "We",
		dijous: "Th",
		divendres: "Fr",
		"ds\\.": "Sa",
		"dg\\.": "Su",
		"dl\\.": "Mo",
		"dt\\.": "Tu",
		"dc\\.": "We",
		"dj\\.": "Th",
		"dv\\.": "Fr",
		gener: "Jan",
		febrer: "Feb",
		març: "Mar",
		abril: "Apr",
		maig: "May",
		juny: "Jun",
		juliol: "Jul",
		agost: "Aug",
		setembre: "Sep",
		octubre: "Oct",
		novembre: "Nov",
		desembre: "Dec",
		"febr\\.": "Feb",
		"abr\\.": "Apr",
		"ag\\.": "Aug",
		"set\\.": "Sep",
		"oct\\.": "Oct",
		шуот: "Sa",
		кӏира: "Su",
		оршот: "Mo",
		шинара: "Tu",
		кхаара: "We",
		еара: "Th",
		пӏераска: "Fr",
		шуо: "Sa",
		кӏи: "Su",
		ор: "Mo",
		ши: "Tu",
		кха: "We",
		еа: "Th",
		пӏе: "Fr",
		январь: "Jan",
		февраль: "Feb",
		апрель: "Apr",
		июнь: "Jun",
		июль: "Jul",
		сентябрь: "Sep",
		октябрь: "Oct",
		ноябрь: "Nov",
		декабрь: "Dec",
		янв: "Jan",
		фев: "Feb",
		мар: "Mar",
		апр: "Apr",
		июн: "Jun",
		июл: "Jul",
		авг: "Aug",
		сен: "Sep",
		окт: "Oct",
		ноя: "Nov",
		дек: "Dec",
		sobota: "Sa",
		neděle: "Su",
		pondělí: "Mo",
		úterý: "Tu",
		středa: "We",
		čtvrtek: "Th",
		pátek: "Fr",
		leden: "Jan",
		únor: "Feb",
		březen: "Mar",
		duben: "Apr",
		květen: "May",
		červen: "Jun",
		červenec: "Jul",
		srpen: "Aug",
		září: "Sep",
		říjen: "Oct",
		prosinec: "Dec",
		led: "Jan",
		úno: "Feb",
		bře: "Mar",
		dub: "Apr",
		kvě: "May",
		čvn: "Jun",
		čvc: "Jul",
		zář: "Sep",
		říj: "Oct",
		pro: "Dec",
		шӑматкун: "Sa",
		вырсарникун: "Su",
		тунтикун: "Mo",
		ытларикун: "Tu",
		юнкун: "We",
		кӗҫнерникун: "Th",
		эрнекун: "Fr",
		"шӑм\\.": "Sa",
		"выр\\.": "Su",
		"тун\\.": "Mo",
		"ытл\\.": "Tu",
		"юн\\.": "We",
		"кӗҫ\\.": "Th",
		"эр\\.": "Fr",
		кӑрлач: "Jan",
		нарӑс: "Feb",
		пуш: "Mar",
		ака: "Apr",
		ҫу: "May",
		ҫӗртме: "Jun",
		утӑ: "Jul",
		ҫурла: "Aug",
		авӑн: "Sep",
		юпа: "Oct",
		чӳк: "Nov",
		раштав: "Dec",
		"кӑр\\.": "Jan",
		"нар\\.": "Feb",
		"ҫӗр\\.": "Jun",
		"ҫур\\.": "Aug",
		"раш\\.": "Dec",
		"dydd sadwrn": "Sa",
		"dydd sul": "Su",
		"dydd llun": "Mo",
		"dydd mawrth": "Tu",
		"dydd mercher": "We",
		"dydd iau": "Th",
		"dydd gwener": "Fr",
		sad: "Sa",
		llun: "Mo",
		iau: "Th",
		gwe: "Fr",
		ionawr: "Jan",
		chwefror: "Feb",
		mawrth: "Mar",
		ebrill: "Apr",
		mai: "May",
		mehefin: "Jun",
		gorffennaf: "Jul",
		awst: "Aug",
		medi: "Sep",
		hydref: "Oct",
		tachwedd: "Nov",
		rhagfyr: "Dec",
		ion: "Jan",
		chw: "Feb",
		ebr: "Apr",
		meh: "Jun",
		gor: "Jul",
		hyd: "Oct",
		tach: "Nov",
		rhag: "Dec",
		lørdag: "Sa",
		søndag: "Su",
		mandag: "Mo",
		tirsdag: "Tu",
		onsdag: "We",
		torsdag: "Th",
		fredag: "Fr",
		"lør\\.": "Sa",
		"søn\\.": "Su",
		"man\\.": "Mo",
		"tirs\\.": "Tu",
		"ons\\.": "We",
		"tors\\.": "Th",
		"fre\\.": "Fr",
		marts: "Mar",
		december: "Dec",
		"dec\\.": "Dec",
		samstag: "Sa",
		sonntag: "Su",
		montag: "Mo",
		dienstag: "Tu",
		mittwoch: "We",
		donnerstag: "Th",
		freitag: "Fr",
		do: "Th",
		märz: "Mar",
		dezember: "Dec",
		mär: "Mar",
		"ཉི་": "Sa",
		"ཟླ་": "Su",
		"མིར་": "Mo",
		"ལྷག་": "Tu",
		"ཕུར་": "We",
		"སངས་": "Th",
		"སྤེན་": "Fr",
		"སྤྱི་སྤྱི་ཟླ་དངཔ་": "Jan",
		"སྤྱི་སྤྱི་ཟླ་གཉིས་པ་": "Feb",
		"སྤྱི་སྤྱི་ཟླ་གསུམ་པ་": "Mar",
		"སྤྱི་སྤྱི་ཟླ་བཞི་པ": "Apr",
		"སྤྱི་སྤྱི་ཟླ་ལྔ་པ་": "May",
		"སྤྱི་སྤྱི་ཟླ་དྲུག་པ": "Jun",
		"སྤྱི་སྤྱི་ཟླ་བདུན་པ་": "Jul",
		"སྤྱི་སྤྱི་ཟླ་བརྒྱད་པ་": "Aug",
		"སྤྱི་སྤྱི་ཟླ་དགུ་པ་": "Sep",
		"སྤྱི་སྤྱི་ཟླ་བཅུ་པ་": "Oct",
		"སྤྱི་སྤྱི་ཟླ་བཅུ་གཅིག་པ་": "Nov",
		"སྤྱི་སྤྱི་ཟླ་བཅུ་གཉིས་པ་": "Dec",
		"སྤྱི་ཟླ་༡": "Jan",
		"སྤྱི་ཟླ་༢": "Feb",
		"སྤྱི་ཟླ་༣": "Mar",
		"སྤྱི་ཟླ་༤": "Apr",
		"སྤྱི་ཟླ་༥": "May",
		"སྤྱི་ཟླ་༦": "Jun",
		"སྤྱི་ཟླ་༧": "Jul",
		"སྤྱི་ཟླ་༨": "Aug",
		"སྤྱི་ཟླ་༩": "Sep",
		"སྤྱི་ཟླ་༡༠": "Oct",
		"སྤྱི་ཟླ་༡༡": "Nov",
		"སྤྱི་ཟླ་༡༢": "Dec",
		memleɖa: "Sa",
		kɔsiɖa: "Su",
		dzoɖa: "Mo",
		blaɖa: "Tu",
		kuɖa: "We",
		yawoɖa: "Th",
		fiɖa: "Fr",
		kɔs: "Su",
		dzo: "Mo",
		bla: "Tu",
		kuɖ: "We",
		fiɖ: "Fr",
		dzove: "Jan",
		dzodze: "Feb",
		tedoxe: "Mar",
		afɔfĩe: "Apr",
		dame: "May",
		masa: "Jun",
		siamlɔm: "Jul",
		deasiamime: "Aug",
		anyɔnyɔ: "Sep",
		kele: "Oct",
		adeɛmekpɔxe: "Nov",
		dzome: "Dec",
		dzv: "Jan",
		dzd: "Feb",
		ted: "Mar",
		afɔ: "Apr",
		dam: "May",
		sia: "Jul",
		dea: "Aug",
		any: "Sep",
		ade: "Nov",
		dzm: "Dec",
		σάββατο: "Sa",
		κυριακή: "Su",
		δευτέρα: "Mo",
		τρίτη: "Tu",
		τετάρτη: "We",
		πέμπτη: "Th",
		παρασκευή: "Fr",
		σάβ: "Sa",
		κυρ: "Su",
		δευ: "Mo",
		τρί: "Tu",
		τετ: "We",
		πέμ: "Th",
		παρ: "Fr",
		ιανουαρίου: "Jan",
		φεβρουαρίου: "Feb",
		μαρτίου: "Mar",
		απριλίου: "Apr",
		μαΐου: "May",
		ιουνίου: "Jun",
		ιουλίου: "Jul",
		αυγούστου: "Aug",
		σεπτεμβρίου: "Sep",
		οκτωβρίου: "Oct",
		νοεμβρίου: "Nov",
		δεκεμβρίου: "Dec",
		ιαν: "Jan",
		φεβ: "Feb",
		μαρ: "Mar",
		απρ: "Apr",
		μαΐ: "May",
		ιουν: "Jun",
		ιουλ: "Jul",
		αυγ: "Aug",
		σεπ: "Sep",
		οκτ: "Oct",
		νοε: "Nov",
		δεκ: "Dec",
		saturday: "Sa",
		sunday: "Su",
		monday: "Mo",
		tuesday: "Tu",
		wednesday: "We",
		thursday: "Th",
		friday: "Fr",
		tue: "Tu",
		wed: "We",
		january: "Jan",
		february: "Feb",
		march: "Mar",
		june: "Jun",
		july: "Jul",
		october: "Oct",
		dimanĉo: "Su",
		lundo: "Mo",
		mardo: "Tu",
		merkredo: "We",
		ĵaŭdo: "Th",
		vendredo: "Fr",
		lu: "Mo",
		ĵa: "Th",
		ve: "Fr",
		januaro: "Jan",
		februaro: "Feb",
		marto: "Mar",
		aprilo: "Apr",
		majo: "May",
		junio: "Jun",
		julio: "Jul",
		aŭgusto: "Aug",
		septembro: "Sep",
		oktobro: "Oct",
		novembro: "Nov",
		decembro: "Dec",
		aŭg: "Aug",
		sábado: "Sa",
		domingo: "Su",
		lunes: "Mo",
		martes: "Tu",
		miércoles: "We",
		jueves: "Th",
		viernes: "Fr",
		sáb: "Sa",
		mié: "We",
		jue: "Th",
		vie: "Fr",
		enero: "Jan",
		febrero: "Feb",
		marzo: "Mar",
		mayo: "May",
		agosto: "Aug",
		septiembre: "Sep",
		noviembre: "Nov",
		diciembre: "Dec",
		ene: "Jan",
		abr: "Apr",
		ago: "Aug",
		laupäev: "Sa",
		pühapäev: "Su",
		esmaspäev: "Mo",
		teisipäev: "Tu",
		kolmapäev: "We",
		neljapäev: "Th",
		reede: "Fr",
		l: "Sa",
		e: "Mo",
		t: "Tu",
		r: "Fr",
		jaanuar: "Jan",
		veebruar: "Feb",
		märts: "Mar",
		aprill: "Apr",
		juuni: "Jun",
		juuli: "Jul",
		oktoober: "Oct",
		detsember: "Dec",
		larunbata: "Sa",
		igandea: "Su",
		astelehena: "Mo",
		asteartea: "Tu",
		asteazkena: "We",
		osteguna: "Th",
		ostirala: "Fr",
		"lr\\.": "Sa",
		"ig\\.": "Su",
		"al\\.": "Mo",
		"ar\\.": "Tu",
		"az\\.": "We",
		"og\\.": "Th",
		"or\\.": "Fr",
		urtarrila: "Jan",
		otsaila: "Feb",
		martxoa: "Mar",
		apirila: "Apr",
		maiatza: "May",
		ekaina: "Jun",
		uztaila: "Jul",
		abuztua: "Aug",
		iraila: "Sep",
		urria: "Oct",
		azaroa: "Nov",
		abendua: "Dec",
		"urt\\.": "Jan",
		"ots\\.": "Feb",
		"api\\.": "Apr",
		"mai\\.": "May",
		"eka\\.": "Jun",
		"uzt\\.": "Jul",
		"abu\\.": "Aug",
		"ira\\.": "Sep",
		"urr\\.": "Oct",
		"aza\\.": "Nov",
		"abe\\.": "Dec",
		شنبه: "Sa",
		یکشنبه: "Su",
		دوشنبه: "Mo",
		سه‌شنبه: "Tu",
		چهارشنبه: "We",
		پنجشنبه: "Th",
		جمعه: "Fr",
		دی: "Jan",
		بهمن: "Feb",
		اسفند: "Mar",
		فروردین: "Apr",
		اردیبهشت: "May",
		خرداد: "Jun",
		تیر: "Jul",
		مرداد: "Aug",
		شهریور: "Sep",
		مهر: "Oct",
		آبان: "Nov",
		آذر: "Dec",
		"hoore-biir": "Sa",
		dewo: "Su",
		aaɓnde: "Mo",
		mawbaare: "Tu",
		njeslaare: "We",
		naasaande: "Th",
		mawnde: "Fr",
		hbi: "Sa",
		dew: "Su",
		aaɓ: "Mo",
		naa: "Th",
		mwd: "Fr",
		siilo: "Jan",
		colte: "Feb",
		mbooy: "Mar",
		seeɗto: "Apr",
		duujal: "May",
		korse: "Jun",
		morso: "Jul",
		juko: "Aug",
		siilto: "Sep",
		yarkomaa: "Oct",
		jolal: "Nov",
		bowte: "Dec",
		sii: "Jan",
		col: "Feb",
		mbo: "Mar",
		duu: "May",
		kor: "Jun",
		juk: "Aug",
		slt: "Sep",
		yar: "Oct",
		bow: "Dec",
		lauantai: "Sa",
		sunnuntai: "Su",
		maanantai: "Mo",
		tiistai: "Tu",
		keskiviikko: "We",
		torstai: "Th",
		perjantai: "Fr",
		ti: "Tu",
		ke: "We",
		pe: "Fr",
		tammikuu: "Jan",
		helmikuu: "Feb",
		maaliskuu: "Mar",
		huhtikuu: "Apr",
		toukokuu: "May",
		kesäkuu: "Jun",
		heinäkuu: "Jul",
		elokuu: "Aug",
		syyskuu: "Sep",
		lokakuu: "Oct",
		marraskuu: "Nov",
		joulukuu: "Dec",
		tammi: "Jan",
		helmi: "Feb",
		maalis: "Mar",
		huhti: "Apr",
		touko: "May",
		kesä: "Jun",
		heinä: "Jul",
		elo: "Aug",
		syys: "Sep",
		loka: "Oct",
		marras: "Nov",
		joulu: "Dec",
		leygardagur: "Sa",
		sunnudagur: "Su",
		mánadagur: "Mo",
		týsdagur: "Tu",
		mikudagur: "We",
		hósdagur: "Th",
		fríggjadagur: "Fr",
		ley: "Sa",
		mán: "Mo",
		týs: "Tu",
		mik: "We",
		hós: "Th",
		frí: "Fr",
		mars: "Mar",
		apríl: "Apr",
		samedi: "Sa",
		dimanche: "Su",
		lundi: "Mo",
		mardi: "Tu",
		mercredi: "We",
		jeudi: "Th",
		vendredi: "Fr",
		"sam\\.": "Sa",
		"dim\\.": "Su",
		"lun\\.": "Mo",
		"jeu\\.": "Th",
		"ven\\.": "Fr",
		janvier: "Jan",
		février: "Feb",
		avril: "Apr",
		juin: "Jun",
		juillet: "Jul",
		août: "Aug",
		septembre: "Sep",
		octobre: "Oct",
		décembre: "Dec",
		"janv\\.": "Jan",
		"févr\\.": "Feb",
		"avr\\.": "Apr",
		"juil\\.": "Jul",
		"sept\\.": "Sep",
		"déc\\.": "Dec",
		sneon: "Sa",
		snein: "Su",
		moandei: "Mo",
		tiisdei: "Tu",
		woansdei: "We",
		tongersdei: "Th",
		freed: "Fr",
		si: "Su",
		wo: "We",
		jannewaris: "Jan",
		febrewaris: "Feb",
		maaie: "May",
		septimber: "Sep",
		novimber: "Nov",
		desimber: "Dec",
		mrt: "Mar",
		"dé sathairn": "Sa",
		"dé domhnaigh": "Su",
		"dé luain": "Mo",
		"dé máirt": "Tu",
		"dé céadaoin": "We",
		déardaoin: "Th",
		"dé haoine": "Fr",
		sath: "Sa",
		domh: "Su",
		luan: "Mo",
		máirt: "Tu",
		céad: "We",
		déar: "Th",
		aoine: "Fr",
		eanáir: "Jan",
		feabhra: "Feb",
		márta: "Mar",
		aibreán: "Apr",
		bealtaine: "May",
		meitheamh: "Jun",
		iúil: "Jul",
		lúnasa: "Aug",
		"meán fómhair": "Sep",
		"deireadh fómhair": "Oct",
		samhain: "Nov",
		nollaig: "Dec",
		ean: "Jan",
		feabh: "Feb",
		aib: "Apr",
		beal: "May",
		meith: "Jun",
		lún: "Aug",
		mfómh: "Sep",
		dfómh: "Oct",
		samh: "Nov",
		noll: "Dec",
		disathairne: "Sa",
		didòmhnaich: "Su",
		diluain: "Mo",
		dimàirt: "Tu",
		diciadain: "We",
		diardaoin: "Th",
		dihaoine: "Fr",
		did: "Su",
		dia: "Th",
		dih: "Fr",
		"am faoilleach": "Jan",
		"an gearran": "Feb",
		"am màrt": "Mar",
		"an giblean": "Apr",
		"an cèitean": "May",
		"an t-ògmhios": "Jun",
		"an t-iuchar": "Jul",
		"an lùnastal": "Aug",
		"an t-sultain": "Sep",
		"an dàmhair": "Oct",
		"an t-samhain": "Nov",
		"an dùbhlachd": "Dec",
		faoi: "Jan",
		gearr: "Feb",
		màrt: "Mar",
		gibl: "Apr",
		cèit: "May",
		ògmh: "Jun",
		iuch: "Jul",
		lùna: "Aug",
		sult: "Sep",
		dàmh: "Oct",
		dùbh: "Dec",
		luns: "Mo",
		mércores: "We",
		xoves: "Th",
		venres: "Fr",
		"sáb\\.": "Sa",
		"dom\\.": "Su",
		"mér\\.": "We",
		"xov\\.": "Th",
		xaneiro: "Jan",
		febreiro: "Feb",
		maio: "May",
		xuño: "Jun",
		xullo: "Jul",
		setembro: "Sep",
		outubro: "Oct",
		"xan\\.": "Jan",
		"xul\\.": "Jul",
		"ago\\.": "Aug",
		"out\\.": "Oct",
		શનિવાર: "Sa",
		રવિવાર: "Su",
		સોમવાર: "Mo",
		મંગળવાર: "Tu",
		બુધવાર: "We",
		ગુરુવાર: "Th",
		શુક્રવાર: "Fr",
		શનિ: "Sa",
		રવિ: "Su",
		સોમ: "Mo",
		મંગળ: "Tu",
		બુધ: "We",
		ગુરુ: "Th",
		શુક્ર: "Fr",
		જાન્યુઆરી: "Jan",
		ફેબ્રુઆરી: "Feb",
		માર્ચ: "Mar",
		એપ્રિલ: "Apr",
		મે: "May",
		જૂન: "Jun",
		જુલાઈ: "Jul",
		ઑગસ્ટ: "Aug",
		સપ્ટેમ્બર: "Sep",
		ઑક્ટોબર: "Oct",
		નવેમ્બર: "Nov",
		ડિસેમ્બર: "Dec",
		જાન્યુ: "Jan",
		ફેબ્રુ: "Feb",
		સપ્ટે: "Sep",
		ઑક્ટો: "Oct",
		નવે: "Nov",
		ડિસે: "Dec",
		jesarn: "Sa",
		jedoonee: "Su",
		jelhein: "Mo",
		jemayrt: "Tu",
		jercean: "We",
		jerdein: "Th",
		jeheiney: "Fr",
		jes: "Sa",
		jed: "Su",
		jel: "Mo",
		jem: "Tu",
		jerc: "We",
		jerd: "Th",
		jeh: "Fr",
		"jerrey-geuree": "Jan",
		"toshiaght-arree": "Feb",
		mayrnt: "Mar",
		averil: "Apr",
		boaldyn: "May",
		"mean-souree": "Jun",
		"jerrey-souree": "Jul",
		luanistyn: "Aug",
		"mean-fouyir": "Sep",
		"jerrey-fouyir": "Oct",
		"mee houney": "Nov",
		"mee ny nollick": "Dec",
		"j-guer": "Jan",
		"t-arree": "Feb",
		avrril: "Apr",
		"m-souree": "Jun",
		"j-souree": "Jul",
		"m-fouyir": "Sep",
		"j-fouyir": "Oct",
		"m-houney": "Nov",
		"m-nollick": "Dec",
		asabar: "Sa",
		lahadi: "Su",
		litinin: "Mo",
		talata: "Tu",
		laraba: "We",
		alhamis: "Th",
		jummaʼa: "Fr",
		lah: "Su",
		lit: "Mo",
		lar: "We",
		janairu: "Jan",
		faburairu: "Feb",
		maris: "Mar",
		afirilu: "Apr",
		mayu: "May",
		yuni: "Jun",
		yuli: "Jul",
		agusta: "Aug",
		satumba: "Sep",
		oktoba: "Oct",
		nuwamba: "Nov",
		disamba: "Dec",
		fab: "Feb",
		afi: "Apr",
		yun: "Jun",
		yul: "Jul",
		agu: "Aug",
		nuw: "Nov",
		"יום שבת": "Sa",
		"יום ראשון": "Su",
		"יום שני": "Mo",
		"יום שלישי": "Tu",
		"יום רביעי": "We",
		"יום חמישי": "Th",
		"יום שישי": "Fr",
		שבת: "Sa",
		"יום א׳": "Su",
		"יום ב׳": "Mo",
		"יום ג׳": "Tu",
		"יום ד׳": "We",
		"יום ה׳": "Th",
		"יום ו׳": "Fr",
		ינואר: "Jan",
		פברואר: "Feb",
		מרץ: "Mar",
		אפריל: "Apr",
		מאי: "May",
		יוני: "Jun",
		יולי: "Jul",
		אוגוסט: "Aug",
		ספטמבר: "Sep",
		אוקטובר: "Oct",
		נובמבר: "Nov",
		דצמבר: "Dec",
		"ינו׳": "Jan",
		"פבר׳": "Feb",
		"אפר׳": "Apr",
		"אוג׳": "Aug",
		"ספט׳": "Sep",
		"אוק׳": "Oct",
		"נוב׳": "Nov",
		"דצמ׳": "Dec",
		शनिवार: "Sa",
		रविवार: "Su",
		सोमवार: "Mo",
		मंगलवार: "Tu",
		बुधवार: "We",
		गुरुवार: "Th",
		शुक्रवार: "Fr",
		शनि: "Sa",
		रवि: "Su",
		सोम: "Mo",
		मंगल: "Tu",
		बुध: "We",
		गुरु: "Th",
		शुक्र: "Fr",
		जनवरी: "Jan",
		फ़रवरी: "Feb",
		मार्च: "Mar",
		अप्रैल: "Apr",
		मई: "May",
		जून: "Jun",
		जुलाई: "Jul",
		अगस्त: "Aug",
		सितंबर: "Sep",
		अक्तूबर: "Oct",
		नवंबर: "Nov",
		दिसंबर: "Dec",
		"जन॰": "Jan",
		"फ़र॰": "Feb",
		"जुल॰": "Jul",
		"अग॰": "Aug",
		"सित॰": "Sep",
		"अक्तू॰": "Oct",
		"नव॰": "Nov",
		"दिस॰": "Dec",
		siječanj: "Jan",
		veljača: "Feb",
		ožujak: "Mar",
		travanj: "Apr",
		svibanj: "May",
		lipanj: "Jun",
		srpanj: "Jul",
		kolovoz: "Aug",
		rujan: "Sep",
		studeni: "Nov",
		prosinac: "Dec",
		sij: "Jan",
		velj: "Feb",
		ožu: "Mar",
		tra: "Apr",
		svi: "May",
		ruj: "Sep",
		stu: "Nov",
		szombat: "Sa",
		vasárnap: "Su",
		hétfő: "Mo",
		kedd: "Tu",
		szerda: "We",
		csütörtök: "Th",
		péntek: "Fr",
		szo: "Sa",
		v: "Su",
		sze: "We",
		cs: "Th",
		január: "Jan",
		február: "Feb",
		március: "Mar",
		április: "Apr",
		május: "May",
		június: "Jun",
		július: "Jul",
		augusztus: "Aug",
		szeptember: "Sep",
		október: "Oct",
		"márc\\.": "Mar",
		"ápr\\.": "Apr",
		"máj\\.": "May",
		"jún\\.": "Jun",
		"júl\\.": "Jul",
		"szept\\.": "Sep",
		շաբաթ: "Sa",
		կիրակի: "Su",
		երկուշաբթի: "Mo",
		երեքշաբթի: "Tu",
		չորեքշաբթի: "We",
		հինգշաբթի: "Th",
		ուրբաթ: "Fr",
		շբթ: "Sa",
		կիր: "Su",
		երկ: "Mo",
		երք: "Tu",
		չրք: "We",
		հնգ: "Th",
		ուր: "Fr",
		հունվար: "Jan",
		փետրվար: "Feb",
		մարտ: "Mar",
		ապրիլ: "Apr",
		մայիս: "May",
		հունիս: "Jun",
		հուլիս: "Jul",
		օգոստոս: "Aug",
		սեպտեմբեր: "Sep",
		հոկտեմբեր: "Oct",
		նոյեմբեր: "Nov",
		դեկտեմբեր: "Dec",
		հնվ: "Jan",
		փտվ: "Feb",
		մրտ: "Mar",
		ապր: "Apr",
		մյս: "May",
		հնս: "Jun",
		հլս: "Jul",
		օգս: "Aug",
		սեպ: "Sep",
		հոկ: "Oct",
		նոյ: "Nov",
		դեկ: "Dec",
		sabbato: "Sa",
		dominica: "Su",
		lunedi: "Mo",
		martedi: "Tu",
		mercuridi: "We",
		jovedi: "Th",
		venerdi: "Fr",
		jov: "Th",
		januario: "Jan",
		februario: "Feb",
		martio: "Mar",
		augusto: "Aug",
		decembre: "Dec",
		kamis: "Th",
		sel: "Tu",
		rab: "We",
		kam: "Th",
		januari: "Jan",
		februari: "Feb",
		maret: "Mar",
		agustus: "Aug",
		saturdí: "Sa",
		soledí: "Su",
		lunedí: "Mo",
		mardí: "Tu",
		mercurdí: "We",
		jovedí: "Th",
		venerdí: "Fr",
		"sat\\.": "Sa",
		"sol\\.": "Su",
		"jov\\.": "Th",
		marte: "Mar",
		julí: "Jul",
		satọdee: "Sa",
		sọndee: "Su",
		mọnde: "Mo",
		tiuzdee: "Tu",
		wenezdee: "We",
		tọọzdee: "Th",
		fraịdee: "Fr",
		sọn: "Su",
		mọn: "Mo",
		tiu: "Tu",
		tọọ: "Th",
		fraị: "Fr",
		jenụwarị: "Jan",
		febrụwarị: "Feb",
		maachị: "Mar",
		epreel: "Apr",
		mee: "May",
		julaị: "Jul",
		ọgọọst: "Aug",
		septemba: "Sep",
		ọktoba: "Oct",
		novemba: "Nov",
		disemba: "Dec",
		jen: "Jan",
		epr: "Apr",
		juu: "Jun",
		ọgọ: "Aug",
		ọkt: "Oct",
		ꆏꊂꃘ: "Sa",
		ꑬꆏꑍ: "Su",
		ꆏꊂꋍ: "Mo",
		ꆏꊂꑍ: "Tu",
		ꆏꊂꌕ: "We",
		ꆏꊂꇖ: "Th",
		ꆏꊂꉬ: "Fr",
		ꆏꃘ: "Sa",
		ꑬꆏ: "Su",
		ꆏꋍ: "Mo",
		ꆏꑍ: "Tu",
		ꆏꌕ: "We",
		ꆏꇖ: "Th",
		ꆏꉬ: "Fr",
		ꋍꆪ: "Jan",
		ꑍꆪ: "Feb",
		ꌕꆪ: "Mar",
		ꇖꆪ: "Apr",
		ꉬꆪ: "May",
		ꃘꆪ: "Jun",
		ꏃꆪ: "Jul",
		ꉆꆪ: "Aug",
		ꈬꆪ: "Sep",
		ꊰꆪ: "Oct",
		ꊯꊪꆪ: "Nov",
		ꊰꑋꆪ: "Dec",
		laugardagur: "Sa",
		mánudagur: "Mo",
		þriðjudagur: "Tu",
		miðvikudagur: "We",
		fimmtudagur: "Th",
		föstudagur: "Fr",
		"lau\\.": "Sa",
		"sun\\.": "Su",
		"mán\\.": "Mo",
		"þri\\.": "Tu",
		"mið\\.": "We",
		"fim\\.": "Th",
		"fös\\.": "Fr",
		janúar: "Jan",
		febrúar: "Feb",
		maí: "May",
		júní: "Jun",
		júlí: "Jul",
		ágúst: "Aug",
		nóvember: "Nov",
		"ágú\\.": "Aug",
		"nóv\\.": "Nov",
		domenica: "Su",
		lunedì: "Mo",
		martedì: "Tu",
		mercoledì: "We",
		giovedì: "Th",
		venerdì: "Fr",
		gennaio: "Jan",
		febbraio: "Feb",
		aprile: "Apr",
		maggio: "May",
		giugno: "Jun",
		luglio: "Jul",
		settembre: "Sep",
		ottobre: "Oct",
		dicembre: "Dec",
		gen: "Jan",
		mag: "May",
		giu: "Jun",
		lug: "Jul",
		set: "Sep",
		ott: "Oct",
		土曜日: "Sa",
		日曜日: "Su",
		月曜日: "Mo",
		火曜日: "Tu",
		水曜日: "We",
		木曜日: "Th",
		金曜日: "Fr",
		土: "Sa",
		日: "Su",
		月: "Mo",
		火: "Tu",
		水: "We",
		木: "Th",
		金: "Fr",
		"1月": "Jan",
		"2月": "Feb",
		"3月": "Mar",
		"4月": "Apr",
		"5月": "May",
		"6月": "Jun",
		"7月": "Jul",
		"8月": "Aug",
		"9月": "Sep",
		"10月": "Oct",
		"11月": "Nov",
		"12月": "Dec",
		זונטיק: "Su",
		מאָנטיק: "Mo",
		דינסטיק: "Tu",
		מיטוואך: "We",
		דאנערשטיק: "Th",
		פֿרײַטיק: "Fr",
		יאַנואַר: "Jan",
		פֿעברואַר: "Feb",
		מערץ: "Mar",
		אַפּריל: "Apr",
		מיי: "May",
		אויגוסט: "Aug",
		סעפּטעמבער: "Sep",
		אקטאבער: "Oct",
		נאוועמבער: "Nov",
		דעצעמבער: "Dec",
		יאַנ: "Jan",
		פֿעב: "Feb",
		אַפּר: "Apr",
		אויג: "Aug",
		סעפּ: "Sep",
		אקט: "Oct",
		נאוו: "Nov",
		דעצ: "Dec",
		ahad: "Su",
		agt: "Aug",
		შაბათი: "Sa",
		კვირა: "Su",
		ორშაბათი: "Mo",
		სამშაბათი: "Tu",
		ოთხშაბათი: "We",
		ხუთშაბათი: "Th",
		პარასკევი: "Fr",
		შაბ: "Sa",
		კვი: "Su",
		ორშ: "Mo",
		სამ: "Tu",
		ოთხ: "We",
		ხუთ: "Th",
		პარ: "Fr",
		იანვარი: "Jan",
		თებერვალი: "Feb",
		მარტი: "Mar",
		აპრილი: "Apr",
		მაისი: "May",
		ივნისი: "Jun",
		ივლისი: "Jul",
		აგვისტო: "Aug",
		სექტემბერი: "Sep",
		ოქტომბერი: "Oct",
		ნოემბერი: "Nov",
		დეკემბერი: "Dec",
		იან: "Jan",
		თებ: "Feb",
		მარ: "Mar",
		აპრ: "Apr",
		მაი: "May",
		ივნ: "Jun",
		ივლ: "Jul",
		აგვ: "Aug",
		სექ: "Sep",
		ოქტ: "Oct",
		ნოე: "Nov",
		დეკ: "Dec",
		njumamothi: "Sa",
		kiumia: "Su",
		njumatatũ: "Mo",
		njumaine: "Tu",
		njumatana: "We",
		aramithi: "Th",
		njumaa: "Fr",
		nmm: "Sa",
		kma: "Su",
		ntt: "Mo",
		nmn: "Tu",
		nmt: "We",
		art: "Th",
		nma: "Fr",
		njenuarĩ: "Jan",
		"mwere wa kerĩ": "Feb",
		"mwere wa gatatũ": "Mar",
		"mwere wa kana": "Apr",
		"mwere wa gatano": "May",
		"mwere wa gatandatũ": "Jun",
		"mwere wa mũgwanja": "Jul",
		"mwere wa kanana": "Aug",
		"mwere wa kenda": "Sep",
		"mwere wa ikũmi": "Oct",
		"mwere wa ikũmi na ũmwe": "Nov",
		ndithemba: "Dec",
		wkr: "Feb",
		wgt: "Mar",
		wtd: "Jun",
		wmj: "Jul",
		wnn: "Aug",
		wkd: "Sep",
		wik: "Oct",
		wmw: "Nov",
		dit: "Dec",
		сенбі: "Sa",
		жексенбі: "Su",
		дүйсенбі: "Mo",
		сейсенбі: "Tu",
		сәрсенбі: "We",
		бейсенбі: "Th",
		жұма: "Fr",
		жс: "Su",
		дс: "Mo",
		сс: "Tu",
		жм: "Fr",
		қаңтар: "Jan",
		ақпан: "Feb",
		наурыз: "Mar",
		сәуір: "Apr",
		мамыр: "May",
		маусым: "Jun",
		шілде: "Jul",
		тамыз: "Aug",
		қыркүйек: "Sep",
		қазан: "Oct",
		қараша: "Nov",
		желтоқсан: "Dec",
		"қаң\\.": "Jan",
		"ақп\\.": "Feb",
		"нау\\.": "Mar",
		"сәу\\.": "Apr",
		"мам\\.": "May",
		"мау\\.": "Jun",
		"шіл\\.": "Jul",
		"там\\.": "Aug",
		"қыр\\.": "Sep",
		"қаз\\.": "Oct",
		"қар\\.": "Nov",
		"жел\\.": "Dec",
		arfininngorneq: "Sa",
		sapaat: "Su",
		ataasinngorneq: "Mo",
		marlunngorneq: "Tu",
		pingasunngorneq: "We",
		sisamanngorneq: "Th",
		tallimanngorneq: "Fr",
		arf: "Sa",
		pin: "We",
		sis: "Th",
		januaari: "Jan",
		februaari: "Feb",
		marsi: "Mar",
		apriili: "Apr",
		maaji: "May",
		aggusti: "Aug",
		septembari: "Sep",
		oktobari: "Oct",
		novembari: "Nov",
		decembari: "Dec",
		febr: "Feb",
		សៅរ៍: "Sa",
		អាទិត្យ: "Su",
		ចន្ទ: "Mo",
		អង្គារ: "Tu",
		ពុធ: "We",
		ព្រហស្បតិ៍: "Th",
		សុក្រ: "Fr",
		ព្រហ: "Th",
		មករា: "Jan",
		កុម្ភៈ: "Feb",
		មីនា: "Mar",
		មេសា: "Apr",
		ឧសភា: "May",
		មិថុនា: "Jun",
		កក្កដា: "Jul",
		សីហា: "Aug",
		កញ្ញា: "Sep",
		តុលា: "Oct",
		វិច្ឆិកា: "Nov",
		ធ្នូ: "Dec",
		ಶನಿವಾರ: "Sa",
		ಭಾನುವಾರ: "Su",
		ಸೋಮವಾರ: "Mo",
		ಮಂಗಳವಾರ: "Tu",
		ಬುಧವಾರ: "We",
		ಗುರುವಾರ: "Th",
		ಶುಕ್ರವಾರ: "Fr",
		ಶನಿ: "Sa",
		ಭಾನು: "Su",
		ಸೋಮ: "Mo",
		ಮಂಗಳ: "Tu",
		ಬುಧ: "We",
		ಗುರು: "Th",
		ಶುಕ್ರ: "Fr",
		ಜನವರಿ: "Jan",
		ಫೆಬ್ರವರಿ: "Feb",
		ಮಾರ್ಚ್: "Mar",
		ಏಪ್ರಿಲ್: "Apr",
		ಮೇ: "May",
		ಜೂನ್: "Jun",
		ಜುಲೈ: "Jul",
		ಆಗಸ್ಟ್: "Aug",
		ಸೆಪ್ಟೆಂಬರ್: "Sep",
		ಅಕ್ಟೋಬರ್: "Oct",
		ನವೆಂಬರ್: "Nov",
		ಡಿಸೆಂಬರ್: "Dec",
		ಜನ: "Jan",
		ಫೆಬ್ರ: "Feb",
		ಏಪ್ರಿ: "Apr",
		ಆಗ: "Aug",
		ಸೆಪ್ಟೆಂ: "Sep",
		ಅಕ್ಟೋ: "Oct",
		ನವೆಂ: "Nov",
		ಡಿಸೆಂ: "Dec",
		토요일: "Sa",
		일요일: "Su",
		월요일: "Mo",
		화요일: "Tu",
		수요일: "We",
		목요일: "Th",
		금요일: "Fr",
		토: "Sa",
		일: "Su",
		월: "Mo",
		화: "Tu",
		수: "We",
		목: "Th",
		금: "Fr",
		"1월": "Jan",
		"2월": "Feb",
		"3월": "Mar",
		"4월": "Apr",
		"5월": "May",
		"6월": "Jun",
		"7월": "Jul",
		"8월": "Aug",
		"9월": "Sep",
		"10월": "Oct",
		"11월": "Nov",
		"12월": "Dec",
		بٹوار: "Sa",
		اَتھوار: "Su",
		ژٔندرٕروار: "Mo",
		بۆموار: "Tu",
		بودوار: "We",
		برؠسوار: "Th",
		جُمہ: "Fr",
		آتھوار: "Su",
		ژٔندٕروار: "Mo",
		جنؤری: "Jan",
		فرؤری: "Feb",
		مارٕچ: "Mar",
		اپریل: "Apr",
		مئی: "May",
		جوٗن: "Jun",
		جوٗلایی: "Jul",
		اگست: "Aug",
		ستمبر: "Sep",
		اکتوٗبر: "Oct",
		نومبر: "Nov",
		دسمبر: "Dec",
		şemî: "Sa",
		yekşem: "Su",
		duşem: "Mo",
		sêşem: "Tu",
		çarşem: "We",
		pêncşem: "Th",
		înî: "Fr",
		şem: "Sa",
		yşm: "Su",
		dşm: "Mo",
		sşm: "Tu",
		çşm: "We",
		pşm: "Th",
		rêbendan: "Jan",
		sibat: "Feb",
		adar: "Mar",
		nîsan: "Apr",
		gulan: "May",
		hezîran: "Jun",
		tîrmeh: "Jul",
		tebax: "Aug",
		îlon: "Sep",
		cotmeh: "Oct",
		mijdar: "Nov",
		berfanbar: "Dec",
		rbn: "Jan",
		sbt: "Feb",
		adr: "Mar",
		nsn: "Apr",
		gln: "May",
		hzr: "Jun",
		trm: "Jul",
		tbx: "Aug",
		îln: "Sep",
		cot: "Oct",
		mjd: "Nov",
		brf: "Dec",
		"dy sadorn": "Sa",
		"dy sul": "Su",
		"dy lun": "Mo",
		"dy meurth": "Tu",
		"dy merher": "We",
		"dy yow": "Th",
		"dy gwener": "Fr",
		mth: "Tu",
		mhr: "We",
		yow: "Th",
		"mis genver": "Jan",
		"mis hwevrer": "Feb",
		"mis meurth": "Mar",
		"mis ebrel": "Apr",
		"mis me": "May",
		"mis metheven": "Jun",
		"mis gortheren": "Jul",
		"mis est": "Aug",
		"mis gwynngala": "Sep",
		"mis hedra": "Oct",
		"mis du": "Nov",
		"mis kevardhu": "Dec",
		hwe: "Feb",
		meu: "Mar",
		met: "Jun",
		gwn: "Sep",
		hed: "Oct",
		kev: "Dec",
		ишемби: "Sa",
		жекшемби: "Su",
		дүйшөмбү: "Mo",
		шейшемби: "Tu",
		шаршемби: "We",
		бейшемби: "Th",
		жума: "Fr",
		"ишм\\.": "Sa",
		"жек\\.": "Su",
		"дүй\\.": "Mo",
		"шейш\\.": "Tu",
		"шарш\\.": "We",
		"бейш\\.": "Th",
		samschdeg: "Sa",
		sonndeg: "Su",
		méindeg: "Mo",
		dënschdeg: "Tu",
		mëttwoch: "We",
		donneschdeg: "Th",
		freideg: "Fr",
		dën: "Tu",
		mët: "We",
		don: "Th",
		mäerz: "Mar",
		abrëll: "Apr",
		mäe: "Mar",
		lwamukaaga: "Sa",
		sabbiiti: "Su",
		balaza: "Mo",
		lwakubiri: "Tu",
		lwakusatu: "We",
		lwakuna: "Th",
		lwakutaano: "Fr",
		lw6: "Sa",
		bal: "Mo",
		lw2: "Tu",
		lw3: "We",
		lw4: "Th",
		lw5: "Fr",
		janwaliyo: "Jan",
		febwaliyo: "Feb",
		apuli: "Apr",
		maayi: "May",
		julaayi: "Jul",
		agusito: "Aug",
		sebuttemba: "Sep",
		okitobba: "Oct",
		desemba: "Dec",
		apu: "Apr",
		seb: "Sep",
		oki: "Oct",
		mpɔ́sɔ: "Sa",
		eyenga: "Su",
		"mokɔlɔ mwa yambo": "Mo",
		"mokɔlɔ mwa míbalé": "Tu",
		"mokɔlɔ mwa mísáto": "We",
		"mokɔlɔ ya mínéi": "Th",
		"mokɔlɔ ya mítáno": "Fr",
		mps: "Sa",
		eye: "Su",
		ybo: "Mo",
		mbl: "Tu",
		mst: "We",
		mtn: "Fr",
		"sánzá ya yambo": "Jan",
		"sánzá ya míbalé": "Feb",
		"sánzá ya mísáto": "Mar",
		"sánzá ya mínei": "Apr",
		"sánzá ya mítáno": "May",
		"sánzá ya motóbá": "Jun",
		"sánzá ya nsambo": "Jul",
		"sánzá ya mwambe": "Aug",
		"sánzá ya libwa": "Sep",
		"sánzá ya zómi": "Oct",
		"sánzá ya zómi na mɔ̌kɔ́": "Nov",
		"sánzá ya zómi na míbalé": "Dec",
		fbl: "Feb",
		msi: "Mar",
		apl: "Apr",
		stb: "Sep",
		ɔtb: "Oct",
		nvb: "Nov",
		dsb: "Dec",
		ວັນເສົາ: "Sa",
		ວັນອາທິດ: "Su",
		ວັນຈັນ: "Mo",
		ວັນອັງຄານ: "Tu",
		ວັນພຸດ: "We",
		ວັນພະຫັດ: "Th",
		ວັນສຸກ: "Fr",
		ເສົາ: "Sa",
		ອາທິດ: "Su",
		ຈັນ: "Mo",
		ອັງຄານ: "Tu",
		ພຸດ: "We",
		ພະຫັດ: "Th",
		ສຸກ: "Fr",
		ມັງກອນ: "Jan",
		ກຸມພາ: "Feb",
		ມີນາ: "Mar",
		ເມສາ: "Apr",
		ພຶດສະພາ: "May",
		ມິຖຸນາ: "Jun",
		ກໍລະກົດ: "Jul",
		ສິງຫາ: "Aug",
		ກັນຍາ: "Sep",
		ຕຸລາ: "Oct",
		ພະຈິກ: "Nov",
		ທັນວາ: "Dec",
		"ມ\\.ກ\\.": "Jan",
		"ກ\\.ພ\\.": "Feb",
		"ມ\\.ນ\\.": "Mar",
		"ມ\\.ສ\\.": "Apr",
		"ພ\\.ພ\\.": "May",
		"ມິ\\.ຖ\\.": "Jun",
		"ກ\\.ລ\\.": "Jul",
		"ສ\\.ຫ\\.": "Aug",
		"ກ\\.ຍ\\.": "Sep",
		"ຕ\\.ລ\\.": "Oct",
		"ພ\\.ຈ\\.": "Nov",
		"ທ\\.ວ\\.": "Dec",
		šeštadienis: "Sa",
		sekmadienis: "Su",
		pirmadienis: "Mo",
		antradienis: "Tu",
		trečiadienis: "We",
		ketvirtadienis: "Th",
		penktadienis: "Fr",
		sk: "Su",
		pr: "Mo",
		an: "Tu",
		tr: "We",
		kt: "Th",
		sausis: "Jan",
		vasaris: "Feb",
		kovas: "Mar",
		balandis: "Apr",
		gegužė: "May",
		birželis: "Jun",
		liepa: "Jul",
		rugpjūtis: "Aug",
		rugsėjis: "Sep",
		spalis: "Oct",
		lapkritis: "Nov",
		gruodis: "Dec",
		lubingu: "Sa",
		lumingu: "Su",
		nkodya: "Mo",
		ndàayà: "Tu",
		ndangù: "We",
		njòwa: "Th",
		ngòvya: "Fr",
		lub: "Sa",
		nko: "Mo",
		ndy: "Tu",
		ndg: "We",
		njw: "Th",
		ngv: "Fr",
		ciongo: "Jan",
		lùishi: "Feb",
		lusòlo: "Mar",
		mùuyà: "Apr",
		lumùngùlù: "May",
		lufuimi: "Jun",
		kabàlàshìpù: "Jul",
		lùshìkà: "Aug",
		lutongolo: "Sep",
		lungùdi: "Oct",
		kaswèkèsè: "Nov",
		ciswà: "Dec",
		cio: "Jan",
		lus: "Mar",
		muu: "Apr",
		luf: "Jun",
		kab: "Jul",
		lush: "Aug",
		cis: "Dec",
		sestdiena: "Sa",
		svētdiena: "Su",
		pirmdiena: "Mo",
		otrdiena: "Tu",
		trešdiena: "We",
		ceturtdiena: "Th",
		piektdiena: "Fr",
		"sestd\\.": "Sa",
		"svētd\\.": "Su",
		"pirmd\\.": "Mo",
		"otrd\\.": "Tu",
		"trešd\\.": "We",
		"ceturtd\\.": "Th",
		"piektd\\.": "Fr",
		janvāris: "Jan",
		februāris: "Feb",
		aprīlis: "Apr",
		maijs: "May",
		jūnijs: "Jun",
		jūlijs: "Jul",
		augusts: "Aug",
		septembris: "Sep",
		oktobris: "Oct",
		novembris: "Nov",
		decembris: "Dec",
		"jūn\\.": "Jun",
		"jūl\\.": "Jul",
		asabotsy: "Sa",
		alahady: "Su",
		alatsinainy: "Mo",
		alarobia: "We",
		alakamisy: "Th",
		zoma: "Fr",
		asab: "Sa",
		alah: "Su",
		alats: "Mo",
		alar: "We",
		alak: "Th",
		zom: "Fr",
		janoary: "Jan",
		febroary: "Feb",
		martsa: "Mar",
		aprily: "Apr",
		mey: "May",
		jona: "Jun",
		jolay: "Jul",
		aogositra: "Aug",
		septambra: "Sep",
		oktobra: "Oct",
		novambra: "Nov",
		desambra: "Dec",
		aog: "Aug",
		rāhoroi: "Sa",
		rātapu: "Su",
		mane: "Mo",
		tūrei: "Tu",
		wenerei: "We",
		tāite: "Th",
		paraire: "Fr",
		rāh: "Sa",
		rāt: "Su",
		man: "Mo",
		tūr: "Tu",
		tāi: "Th",
		par: "Fr",
		hānuere: "Jan",
		pēpuere: "Feb",
		māehe: "Mar",
		āperira: "Apr",
		hune: "Jun",
		hūrae: "Jul",
		ākuhata: "Aug",
		hepetema: "Sep",
		oketopa: "Oct",
		noema: "Nov",
		tīhema: "Dec",
		hān: "Jan",
		pēp: "Feb",
		māe: "Mar",
		āpe: "Apr",
		hun: "Jun",
		hūr: "Jul",
		āku: "Aug",
		hep: "Sep",
		oke: "Oct",
		noe: "Nov",
		tīh: "Dec",
		сабота: "Sa",
		недела: "Su",
		среда: "We",
		четврток: "Th",
		петок: "Fr",
		"саб\\.": "Sa",
		"нед\\.": "Su",
		"пон\\.": "Mo",
		"вто\\.": "Tu",
		"сре\\.": "We",
		"чет\\.": "Th",
		"пет\\.": "Fr",
		јануари: "Jan",
		мај: "May",
		јуни: "Jun",
		јули: "Jul",
		"јан\\.": "Jan",
		"фев\\.": "Feb",
		"мар\\.": "Mar",
		"апр\\.": "Apr",
		"јун\\.": "Jun",
		"јул\\.": "Jul",
		"авг\\.": "Aug",
		"сеп\\.": "Sep",
		"окт\\.": "Oct",
		"ное\\.": "Nov",
		"дек\\.": "Dec",
		ശനിയാഴ്‌ച: "Sa",
		ഞായറാഴ്‌ച: "Su",
		തിങ്കളാഴ്‌ച: "Mo",
		ചൊവ്വാഴ്‌ച: "Tu",
		ബുധനാഴ്‌ച: "We",
		വ്യാഴാഴ്‌ച: "Th",
		വെള്ളിയാഴ്‌ച: "Fr",
		ശനി: "Sa",
		ഞായർ: "Su",
		തിങ്കൾ: "Mo",
		ചൊവ്വ: "Tu",
		ബുധൻ: "We",
		വ്യാഴം: "Th",
		വെള്ളി: "Fr",
		ജനുവരി: "Jan",
		ഫെബ്രുവരി: "Feb",
		മാർച്ച്: "Mar",
		ഏപ്രിൽ: "Apr",
		മേയ്: "May",
		ജൂൺ: "Jun",
		ജൂലൈ: "Jul",
		ഓഗസ്റ്റ്: "Aug",
		സെപ്റ്റംബർ: "Sep",
		ഒക്‌ടോബർ: "Oct",
		നവംബർ: "Nov",
		ഡിസംബർ: "Dec",
		ജനു: "Jan",
		ഫെബ്രു: "Feb",
		മാർ: "Mar",
		ഏപ്രി: "Apr",
		ഓഗ: "Aug",
		സെപ്റ്റം: "Sep",
		ഒക്ടോ: "Oct",
		നവം: "Nov",
		ഡിസം: "Dec",
		бямба: "Sa",
		ням: "Su",
		даваа: "Mo",
		мягмар: "Tu",
		лхагва: "We",
		пүрэв: "Th",
		баасан: "Fr",
		бя: "Sa",
		ня: "Su",
		да: "Mo",
		мя: "Tu",
		лх: "We",
		пү: "Th",
		ба: "Fr",
		"нэгдүгээр сар": "Jan",
		"хоёрдугаар сар": "Feb",
		"гуравдугаар сар": "Mar",
		"дөрөвдүгээр сар": "Apr",
		"тавдугаар сар": "May",
		"зургаадугаар сар": "Jun",
		"долоодугаар сар": "Jul",
		"наймдугаар сар": "Aug",
		"есдүгээр сар": "Sep",
		"аравдугаар сар": "Oct",
		"арван нэгдүгээр сар": "Nov",
		"арван хоёрдугаар сар": "Dec",
		"1-р сар": "Jan",
		"2-р сар": "Feb",
		"3-р сар": "Mar",
		"4-р сар": "Apr",
		"5-р сар": "May",
		"6-р сар": "Jun",
		"7-р сар": "Jul",
		"8-р сар": "Aug",
		"9-р сар": "Sep",
		"10-р сар": "Oct",
		"11-р сар": "Nov",
		"12-р сар": "Dec",
		sâmbătă: "Sa",
		duminică: "Su",
		luni: "Mo",
		marți: "Tu",
		miercuri: "We",
		joi: "Th",
		vineri: "Fr",
		"sâm\\.": "Sa",
		"dum\\.": "Su",
		"mie\\.": "We",
		"vin\\.": "Fr",
		ianuarie: "Jan",
		martie: "Mar",
		aprilie: "Apr",
		iunie: "Jun",
		iulie: "Jul",
		septembrie: "Sep",
		octombrie: "Oct",
		noiembrie: "Nov",
		decembrie: "Dec",
		"ian\\.": "Jan",
		"iun\\.": "Jun",
		"iul\\.": "Jul",
		मंगळवार: "Tu",
		मंगळ: "Tu",
		जानेवारी: "Jan",
		फेब्रुवारी: "Feb",
		एप्रिल: "Apr",
		मे: "May",
		जुलै: "Jul",
		ऑगस्ट: "Aug",
		सप्टेंबर: "Sep",
		ऑक्टोबर: "Oct",
		नोव्हेंबर: "Nov",
		डिसेंबर: "Dec",
		जाने: "Jan",
		फेब्रु: "Feb",
		एप्रि: "Apr",
		ऑग: "Aug",
		सप्टें: "Sep",
		ऑक्टो: "Oct",
		नोव्हें: "Nov",
		डिसें: "Dec",
		isnin: "Mo",
		khamis: "Th",
		jumaat: "Fr",
		ahd: "Su",
		isn: "Mo",
		kha: "Th",
		julai: "Jul",
		ogos: "Aug",
		disember: "Dec",
		ogo: "Aug",
		"is-sibt": "Sa",
		"il-ħadd": "Su",
		"it-tnejn": "Mo",
		"it-tlieta": "Tu",
		"l-erbgħa": "We",
		"il-ħamis": "Th",
		"il-ġimgħa": "Fr",
		ħad: "Su",
		tne: "Mo",
		tli: "Tu",
		erb: "We",
		ħam: "Th",
		ġim: "Fr",
		jannar: "Jan",
		frar: "Feb",
		marzu: "Mar",
		mejju: "May",
		ġunju: "Jun",
		lulju: "Jul",
		awwissu: "Aug",
		settembru: "Sep",
		ottubru: "Oct",
		novembru: "Nov",
		diċembru: "Dec",
		fra: "Feb",
		mej: "May",
		ġun: "Jun",
		lul: "Jul",
		aww: "Aug",
		diċ: "Dec",
		စနေ: "Sa",
		တနင်္ဂနွေ: "Su",
		တနင်္လာ: "Mo",
		အင်္ဂါ: "Tu",
		ဗုဒ္ဓဟူး: "We",
		ကြာသပတေး: "Th",
		သောကြာ: "Fr",
		ဇန်နဝါရီ: "Jan",
		ဖေဖော်ဝါရီ: "Feb",
		မတ်: "Mar",
		ဧပြီ: "Apr",
		မေ: "May",
		ဇွန်: "Jun",
		ဇူလိုင်: "Jul",
		ဩဂုတ်: "Aug",
		စက်တင်ဘာ: "Sep",
		အောက်တိုဘာ: "Oct",
		နိုဝင်ဘာ: "Nov",
		ဒီဇင်ဘာ: "Dec",
		ဇန်: "Jan",
		ဖေ: "Feb",
		ဧ: "Apr",
		ဇူ: "Jul",
		ဩ: "Aug",
		စက်: "Sep",
		အောက်: "Oct",
		နို: "Nov",
		ဒီ: "Dec",
		"tir\\.": "Tu",
		mgqibelo: "Sa",
		sonto: "Su",
		mvulo: "Mo",
		sibili: "Tu",
		sithathu: "We",
		sine: "Th",
		sihlanu: "Fr",
		mgq: "Sa",
		sin: "Th",
		sih: "Fr",
		zibandlela: "Jan",
		nhlolanja: "Feb",
		mbimbitho: "Mar",
		mabasa: "Apr",
		nkwenkwezi: "May",
		nhlangula: "Jun",
		ntulikazi: "Jul",
		ncwabakazi: "Aug",
		mpandula: "Sep",
		mfumfu: "Oct",
		lwezi: "Nov",
		mpalakazi: "Dec",
		zib: "Jan",
		nhlo: "Feb",
		mab: "Apr",
		nkw: "May",
		nhla: "Jun",
		ntu: "Jul",
		ncw: "Aug",
		mpan: "Sep",
		mpal: "Dec",
		शनिबार: "Sa",
		आइतबार: "Su",
		सोमबार: "Mo",
		मङ्गलबार: "Tu",
		बुधबार: "We",
		बिहिबार: "Th",
		शुक्रबार: "Fr",
		आइत: "Su",
		मङ्गल: "Tu",
		बिहि: "Th",
		फेब्रुअरी: "Feb",
		अप्रिल: "Apr",
		जुन: "Jun",
		अगस्ट: "Aug",
		सेप्टेम्बर: "Sep",
		अक्टोबर: "Oct",
		नोभेम्बर: "Nov",
		डिसेम्बर: "Dec",
		zaterdag: "Sa",
		zondag: "Su",
		vrijdag: "Fr",
		za: "Sa",
		zo: "Su",
		vr: "Fr",
		laurdag: "Sa",
		måndag: "Mo",
		tysdag: "Tu",
		lau: "Sa",
		søn: "Su",
		mån: "Mo",
		tys: "Tu",
		ons: "We",
		tor: "Th",
		dimenge: "Su",
		diluns: "Mo",
		dimars: "Tu",
		dimècres: "We",
		dijòus: "Th",
		"de genièr": "Jan",
		"de febrièr": "Feb",
		"de març": "Mar",
		"d’abril": "Apr",
		"de mai": "May",
		"de junh": "Jun",
		"de julhet": "Jul",
		"d’agost": "Aug",
		"de setembre": "Sep",
		"d’octòbre": "Oct",
		"de novembre": "Nov",
		"de decembre": "Dec",
		sanbata: "Sa",
		dilbata: "Su",
		wiixata: "Mo",
		kibxata: "Tu",
		roobii: "We",
		kamisa: "Th",
		jimaata: "Fr",
		wix: "Mo",
		kib: "Tu",
		rob: "We",
		amajjii: "Jan",
		guraandhala: "Feb",
		bitootessa: "Mar",
		eebila: "Apr",
		caamsaa: "May",
		waxabajjii: "Jun",
		adoolessa: "Jul",
		hagayya: "Aug",
		fulbaana: "Sep",
		onkoloolessa: "Oct",
		sadaasa: "Nov",
		mudde: "Dec",
		ama: "Jan",
		gur: "Feb",
		elb: "Apr",
		cam: "May",
		wax: "Jun",
		ado: "Jul",
		hag: "Aug",
		onk: "Oct",
		mud: "Dec",
		ଶନିବାର: "Sa",
		ରବିବାର: "Su",
		ସୋମବାର: "Mo",
		ମଙ୍ଗଳବାର: "Tu",
		ବୁଧବାର: "We",
		ଗୁରୁବାର: "Th",
		ଶୁକ୍ରବାର: "Fr",
		ଶନି: "Sa",
		ରବି: "Su",
		ସୋମ: "Mo",
		ମଙ୍ଗଳ: "Tu",
		ବୁଧ: "We",
		ଗୁରୁ: "Th",
		ଶୁକ୍ର: "Fr",
		ଜାନୁଆରୀ: "Jan",
		ଫେବୃଆରୀ: "Feb",
		ମାର୍ଚ୍ଚ: "Mar",
		ଅପ୍ରେଲ: "Apr",
		ମଇ: "May",
		ଜୁନ: "Jun",
		ଜୁଲାଇ: "Jul",
		ଅଗଷ୍ଟ: "Aug",
		ସେପ୍ଟେମ୍ବର: "Sep",
		ଅକ୍ଟୋବର: "Oct",
		ନଭେମ୍ବର: "Nov",
		ଡିସେମ୍ବର: "Dec",
		сабат: "Sa",
		хуыцаубон: "Su",
		къуырисӕр: "Mo",
		дыццӕг: "Tu",
		ӕртыццӕг: "We",
		цыппӕрӕм: "Th",
		майрӕмбон: "Fr",
		сбт: "Sa",
		хцб: "Su",
		крс: "Mo",
		дцг: "Tu",
		ӕрт: "We",
		цпр: "Th",
		мрб: "Fr",
		мартъи: "Mar",
		"янв\\.": "Jan",
		"февр\\.": "Feb",
		"март\\.": "Mar",
		"сент\\.": "Sep",
		"нояб\\.": "Nov",
		ਸ਼ਨਿੱਚਰਵਾਰ: "Sa",
		ਐਤਵਾਰ: "Su",
		ਸੋਮਵਾਰ: "Mo",
		ਮੰਗਲਵਾਰ: "Tu",
		ਬੁੱਧਵਾਰ: "We",
		ਵੀਰਵਾਰ: "Th",
		ਸ਼ੁੱਕਰਵਾਰ: "Fr",
		ਸ਼ਨਿੱਚਰ: "Sa",
		ਐਤ: "Su",
		ਸੋਮ: "Mo",
		ਮੰਗਲ: "Tu",
		ਬੁੱਧ: "We",
		ਵੀਰ: "Th",
		ਸ਼ੁੱਕਰ: "Fr",
		ਜਨਵਰੀ: "Jan",
		ਫ਼ਰਵਰੀ: "Feb",
		ਮਾਰਚ: "Mar",
		ਅਪ੍ਰੈਲ: "Apr",
		ਮਈ: "May",
		ਜੂਨ: "Jun",
		ਜੁਲਾਈ: "Jul",
		ਅਗਸਤ: "Aug",
		ਸਤੰਬਰ: "Sep",
		ਅਕਤੂਬਰ: "Oct",
		ਨਵੰਬਰ: "Nov",
		ਦਸੰਬਰ: "Dec",
		ਜਨ: "Jan",
		ਫ਼ਰ: "Feb",
		ਅਪ੍ਰੈ: "Apr",
		ਜੁਲਾ: "Jul",
		ਅਗ: "Aug",
		ਸਤੰ: "Sep",
		ਅਕਤੂ: "Oct",
		ਨਵੰ: "Nov",
		ਦਸੰ: "Dec",
		niedziela: "Su",
		poniedziałek: "Mo",
		wtorek: "Tu",
		środa: "We",
		czwartek: "Th",
		piątek: "Fr",
		"sob\\.": "Sa",
		"niedz\\.": "Su",
		"pon\\.": "Mo",
		"wt\\.": "Tu",
		"śr\\.": "We",
		"czw\\.": "Th",
		"pt\\.": "Fr",
		styczeń: "Jan",
		luty: "Feb",
		marzec: "Mar",
		kwiecień: "Apr",
		czerwiec: "Jun",
		lipiec: "Jul",
		sierpień: "Aug",
		wrzesień: "Sep",
		październik: "Oct",
		grudzień: "Dec",
		sty: "Jan",
		kwi: "Apr",
		sie: "Aug",
		wrz: "Sep",
		paź: "Oct",
		gru: "Dec",
		اونۍ: "Sa",
		يونۍ: "Su",
		دونۍ: "Mo",
		درېنۍ: "Tu",
		څلرنۍ: "We",
		پينځنۍ: "Th",
		مرغومی: "Jan",
		سلواغه: "Feb",
		کب: "Mar",
		وری: "Apr",
		غویی: "May",
		غبرگولی: "Jun",
		چنگاښ: "Jul",
		زمری: "Aug",
		وږی: "Sep",
		تله: "Oct",
		لړم: "Nov",
		لیندۍ: "Dec",
		"segunda-feira": "Mo",
		"terça-feira": "Tu",
		"quarta-feira": "We",
		"quinta-feira": "Th",
		"sexta-feira": "Fr",
		"seg\\.": "Mo",
		"ter\\.": "Tu",
		"qua\\.": "We",
		"qui\\.": "Th",
		"sex\\.": "Fr",
		janeiro: "Jan",
		fevereiro: "Feb",
		março: "Mar",
		junho: "Jun",
		julho: "Jul",
		dezembro: "Dec",
		"fev\\.": "Feb",
		"dez\\.": "Dec",
		setiembre: "Sep",
		sonda: "Sa",
		dumengia: "Su",
		glindesdi: "Mo",
		mesemna: "We",
		gievgia: "Th",
		venderdi: "Fr",
		gli: "Mo",
		gie: "Th",
		schaner: "Jan",
		favrer: "Feb",
		avrigl: "Apr",
		matg: "May",
		zercladur: "Jun",
		fanadur: "Jul",
		avust: "Aug",
		settember: "Sep",
		"schan\\.": "Jan",
		"favr\\.": "Feb",
		"zercl\\.": "Jun",
		"fan\\.": "Jul",
		"sett\\.": "Sep",
		"ku wa gatandatu": "Sa",
		"ku w’indwi": "Su",
		"ku wa mbere": "Mo",
		"ku wa kabiri": "Tu",
		"ku wa gatatu": "We",
		"ku wa kane": "Th",
		"ku wa gatanu": "Fr",
		"gnd\\.": "Sa",
		"cu\\.": "Su",
		"mbe\\.": "Mo",
		"kab\\.": "Tu",
		"gtu\\.": "We",
		"gnu\\.": "Fr",
		nzero: "Jan",
		ruhuhuma: "Feb",
		ntwarante: "Mar",
		ndamukiza: "Apr",
		rusama: "May",
		ruheshi: "Jun",
		mukakaro: "Jul",
		nyandagaro: "Aug",
		gitugutu: "Oct",
		munyonyo: "Nov",
		kigarama: "Dec",
		"mut\\.": "Jan",
		"gas\\.": "Feb",
		"wer\\.": "Mar",
		"mat\\.": "Apr",
		"gic\\.": "May",
		"kam\\.": "Jun",
		"nya\\.": "Jul",
		"nze\\.": "Sep",
		"ukw\\.": "Oct",
		"ugu\\.": "Nov",
		"uku\\.": "Dec",
		суббота: "Sa",
		воскресенье: "Su",
		понедельник: "Mo",
		четверг: "Th",
		пятница: "Fr",
		"kuwa gatandatu": "Sa",
		"ku cyumweru": "Su",
		"kuwa mbere": "Mo",
		"kuwa kabiri": "Tu",
		"kuwa gatatu": "We",
		"kuwa kane": "Th",
		"kuwa gatanu": "Fr",
		"cyu\\.": "Su",
		mutarama: "Jan",
		gashyantare: "Feb",
		werurwe: "Mar",
		mata: "Apr",
		gicurasi: "May",
		kamena: "Jun",
		kanama: "Aug",
		nzeri: "Sep",
		ukwakira: "Oct",
		ugushyingo: "Nov",
		ukuboza: "Dec",
		शनिवासरः: "Sa",
		रविवासरः: "Su",
		सोमवासरः: "Mo",
		मंगलवासरः: "Tu",
		बुधवासरः: "We",
		"गुरुवासर:": "Th",
		शुक्रवासरः: "Fr",
		जनवरीमासः: "Jan",
		फरवरीमासः: "Feb",
		मार्चमासः: "Mar",
		अप्रैलमासः: "Apr",
		मईमासः: "May",
		जूनमासः: "Jun",
		जुलाईमासः: "Jul",
		अगस्तमासः: "Aug",
		सितंबरमासः: "Sep",
		अक्तूबरमासः: "Oct",
		नवंबरमासः: "Nov",
		दिसंबरमासः: "Dec",
		"जनवरी:": "Jan",
		"फरवरी:": "Feb",
		"मार्च:": "Mar",
		"अप्रैल:": "Apr",
		"जून:": "Jun",
		"जुलाई:": "Jul",
		"अगस्त:": "Aug",
		"सितंबर:": "Sep",
		"अक्तूबर:": "Oct",
		"नवंबर:": "Nov",
		"दिसंबर:": "Dec",
		sàbadu: "Sa",
		domìniga: "Su",
		lunis: "Mo",
		martis: "Tu",
		mèrcuris: "We",
		giòbia: "Th",
		chenàbura: "Fr",
		sàb: "Sa",
		mèr: "We",
		giò: "Th",
		ghennàrgiu: "Jan",
		freàrgiu: "Feb",
		martzu: "Mar",
		abrile: "Apr",
		maju: "May",
		làmpadas: "Jun",
		trìulas: "Jul",
		austu: "Aug",
		cabudanni: "Sep",
		santugaine: "Oct",
		santandria: "Nov",
		nadale: "Dec",
		ghe: "Jan",
		làm: "Jun",
		trì: "Jul",
		aus: "Aug",
		cab: "Sep",
		stg: "Oct",
		sta: "Nov",
		nad: "Dec",
		ڇنڇر: "Sa",
		آچر: "Su",
		سومر: "Mo",
		اڱارو: "Tu",
		اربع: "We",
		خميس: "Th",
		جمعو: "Fr",
		جنوري: "Jan",
		فيبروري: "Feb",
		مارچ: "Mar",
		اپريل: "Apr",
		مئي: "May",
		جون: "Jun",
		جولاءِ: "Jul",
		آگسٽ: "Aug",
		سيپٽمبر: "Sep",
		آڪٽوبر: "Oct",
		ڊسمبر: "Dec",
		lávvardat: "Sa",
		sotnabeaivi: "Su",
		vuossárga: "Mo",
		maŋŋebárga: "Tu",
		gaskavahkku: "We",
		duorasdat: "Th",
		bearjadat: "Fr",
		láv: "Sa",
		sotn: "Su",
		vuos: "Mo",
		maŋ: "Tu",
		gask: "We",
		duor: "Th",
		bear: "Fr",
		ođđajagemánnu: "Jan",
		guovvamánnu: "Feb",
		njukčamánnu: "Mar",
		cuoŋománnu: "Apr",
		miessemánnu: "May",
		geassemánnu: "Jun",
		suoidnemánnu: "Jul",
		borgemánnu: "Aug",
		čakčamánnu: "Sep",
		golggotmánnu: "Oct",
		skábmamánnu: "Nov",
		juovlamánnu: "Dec",
		ođđj: "Jan",
		guov: "Feb",
		njuk: "Mar",
		cuo: "Apr",
		mies: "May",
		geas: "Jun",
		suoi: "Jul",
		borg: "Aug",
		čakč: "Sep",
		golg: "Oct",
		skáb: "Nov",
		juov: "Dec",
		lâyenga: "Sa",
		"bikua-ôko": "Su",
		"bïkua-ûse": "Mo",
		"bïkua-ptâ": "Tu",
		"bïkua-usïö": "We",
		"bïkua-okü": "Th",
		lâpôsö: "Fr",
		lây: "Sa",
		bk1: "Su",
		bk2: "Mo",
		bk3: "Tu",
		bk4: "We",
		bk5: "Th",
		lâp: "Fr",
		nyenye: "Jan",
		fulundïgi: "Feb",
		mbängü: "Mar",
		ngubùe: "Apr",
		bêläwü: "May",
		föndo: "Jun",
		lengua: "Jul",
		kükürü: "Aug",
		mvuka: "Sep",
		ngberere: "Oct",
		nabändüru: "Nov",
		kakauka: "Dec",
		nye: "Jan",
		mbä: "Mar",
		bêl: "May",
		fön: "Jun",
		len: "Jul",
		kük: "Aug",
		nab: "Nov",
		kak: "Dec",
		nedelja: "Su",
		ponedeljak: "Mo",
		sreda: "We",
		sre: "We",
		avgust: "Aug",
		avg: "Aug",
		සෙනසුරාදා: "Sa",
		ඉරිදා: "Su",
		සඳුදා: "Mo",
		අඟහරුවාදා: "Tu",
		බදාදා: "We",
		බ්‍රහස්පතින්දා: "Th",
		සිකුරාදා: "Fr",
		සෙන: "Sa",
		අඟහ: "Tu",
		බ්‍රහස්: "Th",
		සිකු: "Fr",
		ජනවාරි: "Jan",
		පෙබරවාරි: "Feb",
		මාර්තු: "Mar",
		අප්‍රේල්: "Apr",
		මැයි: "May",
		ජූනි: "Jun",
		ජූලි: "Jul",
		අගෝස්තු: "Aug",
		සැප්තැම්බර්: "Sep",
		ඔක්තෝබර්: "Oct",
		නොවැම්බර්: "Nov",
		දෙසැම්බර්: "Dec",
		ජන: "Jan",
		පෙබ: "Feb",
		මාර්: "Mar",
		අගෝ: "Aug",
		සැප්: "Sep",
		ඔක්: "Oct",
		නොවැ: "Nov",
		දෙසැ: "Dec",
		nedeľa: "Su",
		pondelok: "Mo",
		utorok: "Tu",
		streda: "We",
		štvrtok: "Th",
		piatok: "Fr",
		marec: "Mar",
		máj: "May",
		jún: "Jun",
		júl: "Jul",
		ponedeljek: "Mo",
		torek: "Tu",
		četrtek: "Th",
		petek: "Fr",
		"ned\\.": "Su",
		"sre\\.": "We",
		"čet\\.": "Th",
		"pet\\.": "Fr",
		junij: "Jun",
		julij: "Jul",
		"avg\\.": "Aug",
		mugovera: "Sa",
		svondo: "Su",
		muvhuro: "Mo",
		chipiri: "Tu",
		chitatu: "We",
		china: "Th",
		chishanu: "Fr",
		svo: "Su",
		muv: "Mo",
		chp: "Tu",
		cht: "We",
		chn: "Th",
		chs: "Fr",
		ndira: "Jan",
		kukadzi: "Feb",
		kurume: "Mar",
		kubvumbi: "Apr",
		chivabvu: "May",
		chikumi: "Jun",
		chikunguru: "Jul",
		nyamavhuvhu: "Aug",
		gunyana: "Sep",
		gumiguru: "Oct",
		mbudzi: "Nov",
		zvita: "Dec",
		ndi: "Jan",
		kuk: "Feb",
		kub: "Apr",
		chv: "May",
		chk: "Jun",
		chg: "Jul",
		nya: "Aug",
		gun: "Sep",
		gum: "Oct",
		mbu: "Nov",
		zvi: "Dec",
		sabti: "Sa",
		axad: "Su",
		isniin: "Mo",
		talaado: "Tu",
		arbaco: "We",
		khamiis: "Th",
		jimco: "Fr",
		sbti: "Sa",
		axd: "Su",
		tldo: "Tu",
		arbc: "We",
		khms: "Th",
		jmc: "Fr",
		jannaayo: "Jan",
		febraayo: "Feb",
		maarso: "Mar",
		abriil: "Apr",
		maayo: "May",
		juun: "Jun",
		luulyo: "Jul",
		ogosto: "Aug",
		sebteembar: "Sep",
		oktoobar: "Oct",
		noofeembar: "Nov",
		diseembar: "Dec",
		ogs: "Aug",
		nof: "Nov",
		"e shtunë": "Sa",
		"e diel": "Su",
		"e hënë": "Mo",
		"e martë": "Tu",
		"e mërkurë": "We",
		"e enjte": "Th",
		"e premte": "Fr",
		die: "Su",
		hën: "Mo",
		mër: "We",
		enj: "Th",
		pre: "Fr",
		janar: "Jan",
		shkurt: "Feb",
		prill: "Apr",
		qershor: "Jun",
		korrik: "Jul",
		gusht: "Aug",
		shtator: "Sep",
		tetor: "Oct",
		nëntor: "Nov",
		dhjetor: "Dec",
		shk: "Feb",
		pri: "Apr",
		qer: "Jun",
		korr: "Jul",
		gush: "Aug",
		tet: "Oct",
		nën: "Nov",
		dhj: "Dec",
		недеља: "Su",
		понедељак: "Mo",
		уторак: "Tu",
		четвртак: "Th",
		петак: "Fr",
		суб: "Sa",
		нед: "Su",
		пон: "Mo",
		уто: "Tu",
		сре: "We",
		чет: "Th",
		пет: "Fr",
		јануар: "Jan",
		фебруар: "Feb",
		јун: "Jun",
		јул: "Jul",
		септембар: "Sep",
		октобар: "Oct",
		новембар: "Nov",
		децембар: "Dec",
		јан: "Jan",
		феб: "Feb",
		сеп: "Sep",
		нов: "Nov",
		дец: "Dec",
		moqebelo: "Sa",
		sontaha: "Su",
		mantaha: "Mo",
		labobedi: "Tu",
		laboraro: "We",
		labone: "Th",
		labohlano: "Fr",
		moq: "Sa",
		mma: "Mo",
		bed: "Tu",
		hla: "Fr",
		pherekgong: "Jan",
		hlakola: "Feb",
		hlakubele: "Mar",
		mmesa: "Apr",
		motsheanong: "May",
		phupjane: "Jun",
		phupu: "Jul",
		phato: "Aug",
		lwetse: "Sep",
		mphalane: "Oct",
		pudungwana: "Nov",
		tshitwe: "Dec",
		phe: "Jan",
		ube: "Mar",
		mme: "Apr",
		mot: "May",
		jan: "Jun",
		upu: "Jul",
		pha: "Aug",
		leo: "Sep",
		mph: "Oct",
		pun: "Nov",
		saptu: "Sa",
		senén: "Mo",
		salasa: "Tu",
		rebo: "We",
		kemis: "Th",
		jumaah: "Fr",
		mng: "Su",
		sal: "Tu",
		reb: "We",
		kem: "Th",
		pébruari: "Feb",
		séptémber: "Sep",
		nopémber: "Nov",
		désémber: "Dec",
		péb: "Feb",
		ags: "Aug",
		sép: "Sep",
		nop: "Nov",
		dés: "Dec",
		lördag: "Sa",
		söndag: "Su",
		tisdag: "Tu",
		lör: "Sa",
		sön: "Su",
		tors: "Th",
		augusti: "Aug",
		jumamosi: "Sa",
		jumapili: "Su",
		jumatatu: "Mo",
		jumanne: "Tu",
		jumatano: "We",
		alhamisi: "Th",
		ijumaa: "Fr",
		machi: "Mar",
		aprili: "Apr",
		agosti: "Aug",
		சனி: "Sa",
		ஞாயிறு: "Su",
		திங்கள்: "Mo",
		செவ்வாய்: "Tu",
		புதன்: "We",
		வியாழன்: "Th",
		வெள்ளி: "Fr",
		"ஞாயி\\.": "Su",
		"திங்\\.": "Mo",
		"செவ்\\.": "Tu",
		"புத\\.": "We",
		"வியா\\.": "Th",
		"வெள்\\.": "Fr",
		ஜனவரி: "Jan",
		பிப்ரவரி: "Feb",
		மார்ச்: "Mar",
		ஏப்ரல்: "Apr",
		மே: "May",
		ஜூன்: "Jun",
		ஜூலை: "Jul",
		ஆகஸ்ட்: "Aug",
		செப்டம்பர்: "Sep",
		அக்டோபர்: "Oct",
		நவம்பர்: "Nov",
		டிசம்பர்: "Dec",
		"ஜன\\.": "Jan",
		"பிப்\\.": "Feb",
		"மார்\\.": "Mar",
		"ஏப்\\.": "Apr",
		"ஆக\\.": "Aug",
		"செப்\\.": "Sep",
		"அக்\\.": "Oct",
		"நவ\\.": "Nov",
		"டிச\\.": "Dec",
		శనివారం: "Sa",
		ఆదివారం: "Su",
		సోమవారం: "Mo",
		మంగళవారం: "Tu",
		బుధవారం: "We",
		గురువారం: "Th",
		శుక్రవారం: "Fr",
		శని: "Sa",
		ఆది: "Su",
		సోమ: "Mo",
		మంగళ: "Tu",
		బుధ: "We",
		గురు: "Th",
		శుక్ర: "Fr",
		జనవరి: "Jan",
		ఫిబ్రవరి: "Feb",
		మార్చి: "Mar",
		ఏప్రిల్: "Apr",
		మే: "May",
		జూన్: "Jun",
		జులై: "Jul",
		ఆగస్టు: "Aug",
		సెప్టెంబర్: "Sep",
		అక్టోబర్: "Oct",
		నవంబర్: "Nov",
		డిసెంబర్: "Dec",
		జన: "Jan",
		ఫిబ్ర: "Feb",
		ఏప్రి: "Apr",
		ఆగ: "Aug",
		సెప్టెం: "Sep",
		అక్టో: "Oct",
		నవం: "Nov",
		డిసెం: "Dec",
		шанбе: "Sa",
		якшанбе: "Su",
		душанбе: "Mo",
		сешанбе: "Tu",
		чоршанбе: "We",
		панҷшанбе: "Th",
		ҷумъа: "Fr",
		шнб: "Sa",
		яшб: "Su",
		дшб: "Mo",
		сшб: "Tu",
		чшб: "We",
		пшб: "Th",
		ҷмъ: "Fr",
		январ: "Jan",
		феврал: "Feb",
		апрел: "Apr",
		сентябр: "Sep",
		октябр: "Oct",
		ноябр: "Nov",
		декабр: "Dec",
		วันเสาร์: "Sa",
		วันอาทิตย์: "Su",
		วันจันทร์: "Mo",
		วันอังคาร: "Tu",
		วันพุธ: "We",
		วันพฤหัสบดี: "Th",
		วันศุกร์: "Fr",
		"ส\\.": "Sa",
		"อา\\.": "Su",
		"จ\\.": "Mo",
		"อ\\.": "Tu",
		"พ\\.": "We",
		"พฤ\\.": "Th",
		"ศ\\.": "Fr",
		มกราคม: "Jan",
		กุมภาพันธ์: "Feb",
		มีนาคม: "Mar",
		เมษายน: "Apr",
		พฤษภาคม: "May",
		มิถุนายน: "Jun",
		กรกฎาคม: "Jul",
		สิงหาคม: "Aug",
		กันยายน: "Sep",
		ตุลาคม: "Oct",
		พฤศจิกายน: "Nov",
		ธันวาคม: "Dec",
		"ม\\.ค\\.": "Jan",
		"ก\\.พ\\.": "Feb",
		"มี\\.ค\\.": "Mar",
		"เม\\.ย\\.": "Apr",
		"พ\\.ค\\.": "May",
		"มิ\\.ย\\.": "Jun",
		"ก\\.ค\\.": "Jul",
		"ส\\.ค\\.": "Aug",
		"ก\\.ย\\.": "Sep",
		"ต\\.ค\\.": "Oct",
		"พ\\.ย\\.": "Nov",
		"ธ\\.ค\\.": "Dec",
		ቀዳም: "Sa",
		ሰንበት: "Su",
		ሰኑይ: "Mo",
		ሰሉስ: "Tu",
		ሓሙስ: "Th",
		ዓርቢ: "Fr",
		ቀዳ: "Sa",
		ሰን: "Su",
		ሰኑ: "Mo",
		ሰሉ: "Tu",
		ረቡ: "We",
		ሓሙ: "Th",
		ዓር: "Fr",
		ጥሪ: "Jan",
		ለካቲት: "Feb",
		መጋቢት: "Mar",
		ሚያዝያ: "Apr",
		ጉንበት: "May",
		ሰነ: "Jun",
		ሓምለ: "Jul",
		ነሓሰ: "Aug",
		መስከረም: "Sep",
		ጥቅምቲ: "Oct",
		ሕዳር: "Nov",
		ታሕሳስ: "Dec",
		ለካ: "Feb",
		መጋ: "Mar",
		ሚያ: "Apr",
		ግን: "May",
		ሓም: "Jul",
		ነሓ: "Aug",
		መስ: "Sep",
		ጥቅ: "Oct",
		ሕዳ: "Nov",
		ታሕ: "Dec",
		şenbe: "Sa",
		ýekşenbe: "Su",
		duşenbe: "Mo",
		sişenbe: "Tu",
		çarşenbe: "We",
		penşenbe: "Th",
		anna: "Fr",
		şen: "Sa",
		ýek: "Su",
		duş: "Mo",
		siş: "Tu",
		çar: "We",
		pen: "Th",
		ann: "Fr",
		ýanwar: "Jan",
		fewral: "Feb",
		maý: "May",
		iýun: "Jun",
		iýul: "Jul",
		awgust: "Aug",
		sentýabr: "Sep",
		oktýabr: "Oct",
		noýabr: "Nov",
		ýan: "Jan",
		few: "Feb",
		awg: "Aug",
		noý: "Nov",
		sabado: "Sa",
		linggo: "Su",
		miyerkules: "We",
		huwebes: "Th",
		biyernes: "Fr",
		miy: "We",
		huw: "Th",
		biy: "Fr",
		pebrero: "Feb",
		marso: "Mar",
		hunyo: "Jun",
		hulyo: "Jul",
		setyembre: "Sep",
		oktubre: "Oct",
		nobyembre: "Nov",
		disyembre: "Dec",
		peb: "Feb",
		hul: "Jul",
		nob: "Nov",
		matlhatso: "Sa",
		tshipi: "Su",
		mosupologo: "Mo",
		labotlhano: "Fr",
		mos: "Mo",
		labb: "Tu",
		labr: "We",
		labn: "Th",
		labt: "Fr",
		ferikgong: "Jan",
		tlhakole: "Feb",
		mopitlo: "Mar",
		moranang: "Apr",
		motsheganang: "May",
		seetebosigo: "Jun",
		phukwi: "Jul",
		phatwe: "Aug",
		diphalane: "Oct",
		ngwanatsele: "Nov",
		sedimonthole: "Dec",
		fer: "Jan",
		tlh: "Feb",
		mop: "Mar",
		phu: "Jul",
		ngw: "Nov",
		sed: "Dec",
		tokonaki: "Sa",
		sāpate: "Su",
		mōnite: "Mo",
		tūsite: "Tu",
		pulelulu: "We",
		tuʻapulelulu: "Th",
		falaite: "Fr",
		tok: "Sa",
		sāp: "Su",
		mōn: "Mo",
		tūs: "Tu",
		pul: "We",
		tuʻa: "Th",
		fal: "Fr",
		sānuali: "Jan",
		fēpueli: "Feb",
		maʻasi: "Mar",
		ʻepeleli: "Apr",
		mē: "May",
		sune: "Jun",
		siulai: "Jul",
		ʻaokosi: "Aug",
		sepitema: "Sep",
		ʻokatopa: "Oct",
		nōvema: "Nov",
		tīsema: "Dec",
		sān: "Jan",
		fēp: "Feb",
		maʻa: "Mar",
		ʻepe: "Apr",
		siu: "Jul",
		ʻaok: "Aug",
		sēp: "Sep",
		ʻoka: "Oct",
		nōv: "Nov",
		tīs: "Dec",
		cumartesi: "Sa",
		pazar: "Su",
		pazartesi: "Mo",
		salı: "Tu",
		çarşamba: "We",
		perşembe: "Th",
		cuma: "Fr",
		paz: "Su",
		pzt: "Mo",
		per: "Th",
		cum: "Fr",
		ocak: "Jan",
		şubat: "Feb",
		nisan: "Apr",
		mayıs: "May",
		haziran: "Jun",
		temmuz: "Jul",
		ağustos: "Aug",
		eylül: "Sep",
		ekim: "Oct",
		kasım: "Nov",
		aralık: "Dec",
		oca: "Jan",
		şub: "Feb",
		nis: "Apr",
		haz: "Jun",
		tem: "Jul",
		ağu: "Aug",
		eyl: "Sep",
		eki: "Oct",
		шимбә: "Sa",
		якшәмбе: "Su",
		дүшәмбе: "Mo",
		сишәмбе: "Tu",
		чәршәмбе: "We",
		пәнҗешәмбе: "Th",
		җомга: "Fr",
		"шим\\.": "Sa",
		"якш\\.": "Su",
		"дүш\\.": "Mo",
		"сиш\\.": "Tu",
		"чәр\\.": "We",
		"пәнҗ\\.": "Th",
		"җом\\.": "Fr",
		гыйнвар: "Jan",
		"гыйн\\.": "Jan",
		شەنبە: "Sa",
		يەكشەنبە: "Su",
		دۈشەنبە: "Mo",
		سەيشەنبە: "Tu",
		چارشەنبە: "We",
		پەيشەنبە: "Th",
		جۈمە: "Fr",
		شە: "Sa",
		يە: "Su",
		دۈ: "Mo",
		سە: "Tu",
		چا: "We",
		پە: "Th",
		جۈ: "Fr",
		يانۋار: "Jan",
		فېۋرال: "Feb",
		مارت: "Mar",
		ئاپرېل: "Apr",
		ماي: "May",
		ئىيۇن: "Jun",
		ئىيۇل: "Jul",
		ئاۋغۇست: "Aug",
		سېنتەبىر: "Sep",
		ئۆكتەبىر: "Oct",
		نويابىر: "Nov",
		دېكابىر: "Dec",
		неділя: "Su",
		понеділок: "Mo",
		вівторок: "Tu",
		середа: "We",
		четвер: "Th",
		пʼятниця: "Fr",
		січень: "Jan",
		лютий: "Feb",
		березень: "Mar",
		квітень: "Apr",
		травень: "May",
		червень: "Jun",
		липень: "Jul",
		серпень: "Aug",
		вересень: "Sep",
		жовтень: "Oct",
		листопад: "Nov",
		грудень: "Dec",
		"січ\\.": "Jan",
		"лют\\.": "Feb",
		"бер\\.": "Mar",
		"квіт\\.": "Apr",
		"трав\\.": "May",
		"черв\\.": "Jun",
		"лип\\.": "Jul",
		"серп\\.": "Aug",
		"вер\\.": "Sep",
		"жовт\\.": "Oct",
		"лист\\.": "Nov",
		"груд\\.": "Dec",
		ہفتہ: "Sa",
		اتوار: "Su",
		پیر: "Mo",
		منگل: "Tu",
		بدھ: "We",
		جمعرات: "Th",
		جمعہ: "Fr",
		جنوری: "Jan",
		فروری: "Feb",
		جولائی: "Jul",
		اکتوبر: "Oct",
		shanba: "Sa",
		yakshanba: "Su",
		dushanba: "Mo",
		seshanba: "Tu",
		chorshanba: "We",
		payshanba: "Th",
		shan: "Sa",
		yak: "Su",
		dush: "Mo",
		sesh: "Tu",
		chor: "We",
		sentabr: "Sep",
		oktabr: "Oct",
		"thứ bảy": "Sa",
		"chủ nhật": "Su",
		"thứ hai": "Mo",
		"thứ ba": "Tu",
		"thứ tư": "We",
		"thứ năm": "Th",
		"thứ sáu": "Fr",
		"th 7": "Sa",
		cn: "Su",
		"th 2": "Mo",
		"th 3": "Tu",
		"th 4": "We",
		"th 5": "Th",
		"th 6": "Fr",
		"tháng 1": "Jan",
		"tháng 2": "Feb",
		"tháng 3": "Mar",
		"tháng 4": "Apr",
		"tháng 5": "May",
		"tháng 6": "Jun",
		"tháng 7": "Jul",
		"tháng 8": "Aug",
		"tháng 9": "Sep",
		"tháng 10": "Oct",
		"tháng 11": "Nov",
		"tháng 12": "Dec",
		aseer: "Sa",
		dibéer: "Su",
		altine: "Mo",
		talaata: "Tu",
		àlarba: "We",
		alxamis: "Th",
		àjjuma: "Fr",
		ase: "Sa",
		dib: "Su",
		alt: "Mo",
		àla: "We",
		alx: "Th",
		àjj: "Fr",
		samwiyee: "Jan",
		fewriyee: "Feb",
		awril: "Apr",
		suwe: "Jun",
		sulet: "Jul",
		sàttumbar: "Sep",
		nowàmbar: "Nov",
		desàmbar: "Dec",
		awr: "Apr",
		suw: "Jun",
		sàt: "Sep",
		cawe: "Su",
		lwesibini: "Tu",
		lwesithathu: "We",
		lwesine: "Th",
		lwesihlanu: "Fr",
		caw: "Su",
		bin: "Tu",
		janyuwari: "Jan",
		februwari: "Feb",
		matshi: "Mar",
		epreli: "Apr",
		meyi: "May",
		julayi: "Jul",
		agasti: "Aug",
		okthoba: "Oct",
		aga: "Aug",
		àbámẹ́ta: "Sa",
		àìkú: "Su",
		ajé: "Mo",
		ìsẹ́gun: "Tu",
		ọjọ́rú: "We",
		ọjọ́bọ: "Th",
		ẹtì: "Fr",
		"oṣù ṣẹ́rẹ́": "Jan",
		"oṣù èrèlè": "Feb",
		"oṣù ẹrẹ̀nà": "Mar",
		"oṣù ìgbé": "Apr",
		"oṣù ẹ̀bibi": "May",
		"oṣù òkúdu": "Jun",
		"oṣù agẹmọ": "Jul",
		"oṣù ògún": "Aug",
		"oṣù owewe": "Sep",
		"oṣù ọ̀wàrà": "Oct",
		"oṣù bélú": "Nov",
		"oṣù ọ̀pẹ̀": "Dec",
		singhgizroek: "Sa",
		ngoenzsinghgiz: "Su",
		singhgizit: "Mo",
		singhgizngeih: "Tu",
		singhgizsam: "We",
		singhgizseiq: "Th",
		singhgizhaj: "Fr",
		ndwenit: "Jan",
		ndwenngeih: "Feb",
		ndwensam: "Mar",
		ndwenseiq: "Apr",
		ndwenngux: "May",
		ndwenloeg: "Jun",
		ndwencaet: "Jul",
		ndwenbet: "Aug",
		ndwengouj: "Sep",
		ndwencib: "Oct",
		"ndwencib’it": "Nov",
		ndwencibngeih: "Dec",
		星期六: "Sa",
		星期日: "Su",
		星期一: "Mo",
		星期二: "Tu",
		星期三: "We",
		星期四: "Th",
		星期五: "Fr",
		周六: "Sa",
		周日: "Su",
		周一: "Mo",
		周二: "Tu",
		周三: "We",
		周四: "Th",
		周五: "Fr",
		一月: "Jan",
		二月: "Feb",
		三月: "Mar",
		四月: "Apr",
		五月: "May",
		六月: "Jun",
		七月: "Jul",
		八月: "Aug",
		九月: "Sep",
		十月: "Oct",
		十一月: "Nov",
		十二月: "Dec",
		umgqibelo: "Sa",
		isonto: "Su",
		umsombuluko: "Mo",
		ulwesibili: "Tu",
		ulwesithathu: "We",
		ulwesine: "Th",
		ulwesihlanu: "Fr",
		mso: "Mo",
		bil: "Tu",
		januwari: "Jan",
		mashi: "Mar",
		ephreli: "Apr",
		septhemba: "Sep",
		eph: "Apr",
		tsuʔndzɨkɔʔɔ: "Sa",
		tsuʔntsɨ: "Su",
		tsuʔukpà: "Mo",
		tsuʔughɔe: "Tu",
		tsuʔutɔ̀mlò: "We",
		tsuʔumè: "Th",
		tsuʔughɨ̂m: "Fr",
		dzk: "Sa",
		nts: "Su",
		ghɔ: "Tu",
		tɔm: "We",
		ume: "Th",
		ghɨ: "Fr",
		ndzɔ̀ŋɔ̀nùm: "Jan",
		ndzɔ̀ŋɔ̀kɨ̀zùʔ: "Feb",
		ndzɔ̀ŋɔ̀tɨ̀dʉ̀ghà: "Mar",
		ndzɔ̀ŋɔ̀tǎafʉ̄ghā: "Apr",
		ndzɔ̀ŋèsèe: "May",
		ndzɔ̀ŋɔ̀nzùghò: "Jun",
		ndzɔ̀ŋɔ̀dùmlo: "Jul",
		ndzɔ̀ŋɔ̀kwîfɔ̀e: "Aug",
		ndzɔ̀ŋɔ̀tɨ̀fʉ̀ghàdzughù: "Sep",
		ndzɔ̀ŋɔ̀ghǔuwelɔ̀m: "Oct",
		"ndzɔ̀ŋɔ̀chwaʔàkaa wo": "Nov",
		ndzɔ̀ŋèfwòo: "Dec",
		nùm: "Jan",
		kɨz: "Feb",
		tɨd: "Mar",
		nzu: "Jun",
		fɔe: "Aug",
		dzu: "Sep",
		lɔm: "Oct",
		kaa: "Nov",
		fwo: "Dec",
		jmo: "Sa",
		jpi: "Su",
		jtt: "Mo",
		jnn: "Tu",
		jtn: "We",
		sábadu: "Sa",
		domingu: "Su",
		llunes: "Mo",
		xueves: "Th",
		vienres: "Fr",
		llu: "Mo",
		xue: "Th",
		xineru: "Jan",
		febreru: "Feb",
		xunu: "Jun",
		xunetu: "Jul",
		agostu: "Aug",
		ochobre: "Oct",
		payares: "Nov",
		avientu: "Dec",
		xin: "Jan",
		xun: "Jun",
		xnt: "Jul",
		och: "Oct",
		avi: "Dec",
		"ŋgwà jôn": "Sa",
		"ŋgwà nɔ̂y": "Su",
		"ŋgwà njaŋgumba": "Mo",
		"ŋgwà ûm": "Tu",
		"ŋgwà ŋgê": "We",
		"ŋgwà mbɔk": "Th",
		"ŋgwà kɔɔ": "Fr",
		nɔy: "Su",
		nja: "Mo",
		uum: "Tu",
		ŋge: "We",
		mbɔ: "Th",
		kɔɔ: "Fr",
		kɔndɔŋ: "Jan",
		màcɛ̂l: "Feb",
		màtùmb: "Mar",
		màtop: "Apr",
		m̀puyɛ: "May",
		hìlòndɛ̀: "Jun",
		njèbà: "Jul",
		hìkaŋ: "Aug",
		dìpɔ̀s: "Sep",
		bìòôm: "Oct",
		màyɛsèp: "Nov",
		"lìbuy li ńyèe": "Dec",
		kɔn: "Jan",
		mto: "Apr",
		mpu: "May",
		hil: "Jun",
		hik: "Aug",
		bio: "Oct",
		liɓ: "Dec",
		pachibelushi: "Sa",
		"pa mulungu": "Su",
		palichimo: "Mo",
		palichibuli: "Tu",
		palichitatu: "We",
		palichine: "Th",
		palichisano: "Fr",
		epreo: "Apr",
		ogasti: "Aug",
		oga: "Aug",
		"pa shahulembela": "Sa",
		"pa shahuviluha": "Mo",
		"pa hivili": "Tu",
		"pa hidatu": "We",
		"pa hitayi": "Th",
		"pa hihanu": "Fr",
		lem: "Sa",
		hiv: "Tu",
		hid: "We",
		hit: "Th",
		hih: "Fr",
		"pa mwedzi gwa hutala": "Jan",
		"pa mwedzi gwa wuvili": "Feb",
		"pa mwedzi gwa wudatu": "Mar",
		"pa mwedzi gwa wutai": "Apr",
		"pa mwedzi gwa wuhanu": "May",
		"pa mwedzi gwa sita": "Jun",
		"pa mwedzi gwa saba": "Jul",
		"pa mwedzi gwa nane": "Aug",
		"pa mwedzi gwa tisa": "Sep",
		"pa mwedzi gwa kumi": "Oct",
		"pa mwedzi gwa kumi na moja": "Nov",
		"pa mwedzi gwa kumi na mbili": "Dec",
		hut: "Jan",
		dat: "Mar",
		tai: "Apr",
		han: "May",
		nan: "Aug",
		kum: "Oct",
		kmj: "Nov",
		kmb: "Dec",
		ऐतवार: "Su",
		बृहस्पतवार: "Th",
		फरवरी: "Feb",
		सितम्बर: "Sep",
		अक्टूबर: "Oct",
		नवम्बर: "Nov",
		सनीचर: "Sa",
		रबीबार: "Su",
		मंगलबार: "Tu",
		बृहस्पतिबार: "Th",
		asiibi: "Sa",
		alahaɖɩ: "Su",
		aɖɩtɛnɛɛ: "Mo",
		atalaata: "Tu",
		alaarba: "We",
		alaamɩshɩ: "Th",
		arɩsǝma: "Fr",
		asib: "Sa",
		aɖɩt: "Mo",
		atal: "Tu",
		alam: "Th",
		arɩs: "Fr",
		"ɩjikawǝrka kaŋɔrɔ": "Jan",
		"ɩjikpaka kaŋɔrɔ": "Feb",
		"arɛ́cika kaŋɔrɔ": "Mar",
		"njɩbɔ nɖʊka kaŋɔrɔ": "Apr",
		"acafʊnɖuka kaŋɔrɔ": "May",
		"anɔɔɖuka kaŋɔrɔ": "Jun",
		"alàlaka kaŋɔrɔ": "Jul",
		"ɩjikǝuka kaŋɔrɔ": "Aug",
		"abofʊmka kaŋɔrɔ": "Sep",
		"ɩjicimka kaŋɔrɔ": "Oct",
		"acapomka kaŋɔrɔ": "Nov",
		"anɔɔbʊnka kaŋɔrɔ": "Dec",
		ci: "Mar",
		ɖʊ: "Apr",
		ɖu5: "May",
		ɖu6: "Jun",
		kǝu: "Aug",
		fʊm: "Sep",
		cim: "Oct",
		pom: "Nov",
		bʊn: "Dec",
		सनिबार: "Sa",
		रबिबार: "Su",
		समबार: "Mo",
		बिस्थिबार: "Th",
		सुुखुरबार: "Fr",
		सनि: "Sa",
		रबि: "Su",
		सम: "Mo",
		बिस्थि: "Th",
		सुखुर: "Fr",
		जानुवारी: "Jan",
		फेब्रूवारी: "Feb",
		आगष्ट: "Aug",
		सेप्थेम्बर: "Sep",
		"अक्ट’बर": "Oct",
		नवेम्बर: "Nov",
		जान: "Jan",
		फेब: "Feb",
		जुल: "Jul",
		आग: "Aug",
		सेप: "Sep",
		"अक्ट’": "Oct",
		नवे: "Nov",
		डिसे: "Dec",
		jumapiri: "Su",
		"murwa wa kanne": "Th",
		"murwa wa katano": "Fr",
		j1: "Sa",
		j2: "Su",
		j3: "Mo",
		j4: "Tu",
		j5: "We",
		al: "Th",
		ij: "Fr",
		𑄥𑄧𑄚𑄨𑄝𑄢𑄴: "Sa",
		𑄢𑄧𑄝𑄨𑄝𑄢𑄴: "Su",
		𑄥𑄧𑄟𑄴𑄝𑄢𑄴: "Mo",
		𑄟𑄧𑄁𑄉𑄧𑄣𑄴𑄝𑄢𑄴: "Tu",
		𑄝𑄪𑄖𑄴𑄝𑄢𑄴: "We",
		𑄝𑄳𑄢𑄨𑄥𑄪𑄛𑄴𑄝𑄢𑄴: "Th",
		𑄥𑄪𑄇𑄴𑄇𑄮𑄢𑄴𑄝𑄢𑄴: "Fr",
		𑄥𑄧𑄚𑄨: "Sa",
		𑄢𑄧𑄝𑄨: "Su",
		𑄥𑄧𑄟𑄴: "Mo",
		𑄟𑄧𑄁𑄉𑄧𑄣𑄴: "Tu",
		𑄝𑄪𑄖𑄴: "We",
		𑄝𑄳𑄢𑄨𑄥𑄪𑄛𑄴: "Th",
		𑄥𑄪𑄇𑄴𑄇𑄮𑄢𑄴: "Fr",
		𑄎𑄚𑄪𑄠𑄢𑄨: "Jan",
		𑄜𑄬𑄛𑄴𑄝𑄳𑄢𑄪𑄠𑄢𑄨: "Feb",
		𑄟𑄢𑄴𑄌𑄧: "Mar",
		𑄃𑄬𑄛𑄳𑄢𑄨𑄣𑄴: "Apr",
		𑄟𑄬: "May",
		𑄎𑄪𑄚𑄴: "Jun",
		𑄎𑄪𑄣𑄭: "Jul",
		𑄃𑄉𑄧𑄌𑄴𑄑𑄴: "Aug",
		𑄥𑄬𑄛𑄴𑄑𑄬𑄟𑄴𑄝𑄧𑄢𑄴: "Sep",
		𑄃𑄧𑄇𑄴𑄑𑄮𑄝𑄧𑄢𑄴: "Oct",
		𑄚𑄧𑄞𑄬𑄟𑄴𑄝𑄧𑄢𑄴: "Nov",
		𑄓𑄨𑄥𑄬𑄟𑄴𑄝𑄧𑄢𑄴: "Dec",
		septyembre: "Sep",
		orwamukaaga: "Sa",
		sande: "Su",
		orwokubanza: "Mo",
		orwakabiri: "Tu",
		orwakashatu: "We",
		orwakana: "Th",
		orwakataano: "Fr",
		omk: "Sa",
		ork: "Mo",
		okb: "Tu",
		oks: "We",
		okn: "Th",
		okwokubanza: "Jan",
		okwakabiri: "Feb",
		okwakashatu: "Mar",
		okwakana: "Apr",
		okwakataana: "May",
		okwamukaaga: "Jun",
		okwamushanju: "Jul",
		okwamunaana: "Aug",
		okwamwenda: "Sep",
		okwaikumi: "Oct",
		"okwaikumi na kumwe": "Nov",
		"okwaikumi na ibiri": "Dec",
		kbz: "Jan",
		kbr: "Feb",
		kst: "Mar",
		kkn: "Apr",
		ktn: "May",
		kmk: "Jun",
		kms: "Jul",
		kmn: "Aug",
		kmw: "Sep",
		kkm: "Oct",
		knk: "Nov",
		knb: "Dec",
		ꭴꮎꮩꮣꮘꮥꮎ: "Sa",
		ꭴꮎꮩꮣꮖꮝꭼ: "Su",
		ꭴꮎꮩꮣꮙꮕꭿ: "Mo",
		ꮤꮅꮑꭲꭶ: "Tu",
		ꮶꭲꮑꭲꭶ: "We",
		ꮕꭹꮑꭲꭶ: "Th",
		ꮷꮎꭹꮆꮝꮧ: "Fr",
		ꮘꮥꮎ: "Sa",
		ꮖꮝꭼ: "Su",
		ꮙꮕꭿ: "Mo",
		ꮤꮅꮑ: "Tu",
		ꮶꭲꮑ: "We",
		ꮕꭹꮑ: "Th",
		ꮷꮎꭹ: "Fr",
		ꭴꮓꮈꮤꮕ: "Jan",
		ꭷꭶꮅ: "Feb",
		ꭰꮕᏹ: "Mar",
		ꭷꮼꮒ: "Apr",
		ꭰꮒꮝꭼꮨ: "May",
		ꮥꭽꮇᏹ: "Jun",
		ꭻᏸꮙꮒ: "Jul",
		ꭶꮆꮒ: "Aug",
		ꮪꮅꮝꮧ: "Sep",
		ꮪꮒꮕꮧ: "Oct",
		ꮕꮣꮥꮖ: "Nov",
		ꭵꮝꭹᏹ: "Dec",
		ꭴꮓ: "Jan",
		ꭷꭶ: "Feb",
		ꭰꮕ: "Mar",
		ꭷꮼ: "Apr",
		ꭰꮒ: "May",
		ꮥꭽ: "Jun",
		ꭻᏸ: "Jul",
		ꭶꮆ: "Aug",
		ꮪꮅ: "Sep",
		ꮪꮒ: "Oct",
		ꮕꮣ: "Nov",
		ꭵꮝ: "Dec",
		شەممە: "Sa",
		یەکشەممە: "Su",
		دووشەممە: "Mo",
		سێشەممە: "Tu",
		چوارشەممە: "We",
		پێنجشەممە: "Th",
		ھەینی: "Fr",
		"کانوونی دووەم": "Jan",
		شوبات: "Feb",
		ئازار: "Mar",
		نیسان: "Apr",
		ئایار: "May",
		حوزەیران: "Jun",
		تەمووز: "Jul",
		ئاب: "Aug",
		ئەیلوول: "Sep",
		"تشرینی یەکەم": "Oct",
		"تشرینی دووەم": "Nov",
		"کانونی یەکەم": "Dec",
		ܫܒܬܐ: "Sa",
		ܚܕܒܫܒܐ: "Su",
		ܬܪܝܢܒܫܒܐ: "Mo",
		ܬܠܬܒܫܒܐ: "Tu",
		ܐܪܒܥܒܫܒܐ: "We",
		ܚܡܫܒܫܒܐ: "Th",
		ܥܪܘܒܬܐ: "Fr",
		ܚܕ: "Su",
		ܬܪܝܢ: "Mo",
		ܬܠܬ: "Tu",
		ܐܪܒܥ: "We",
		ܚܡܫ: "Th",
		ܥܪܘ: "Fr",
		"ܟܢܘܢ ܐܚܪܝܐ": "Jan",
		ܫܒܛ: "Feb",
		ܐܕܪ: "Mar",
		ܢܝܣܢ: "Apr",
		ܐܝܪ: "May",
		ܚܙܝܪܢ: "Jun",
		ܬܡܘܙ: "Jul",
		ܐܒ: "Aug",
		ܐܝܠܘܠ: "Sep",
		"ܬܫܪܝܢ ܩܕܡܝܐ": "Oct",
		"ܬܫܪܝܢ ܐܚܪܝܐ": "Nov",
		"ܟܢܘܢ ܩܕܡܝܐ": "Dec",
		"ܟܢܘܢ ܒ": "Jan",
		"ܬܫܪܝܢ ܐ": "Oct",
		"ܬܫܪܝܢ ܒ": "Nov",
		"ܟܢܘܢ ܐ": "Dec",
		ᒫᑎᓇᐍᑮᓯᑳᐤ: "Sa",
		ᐊᔭᒥᐦᐁᑮᓯᑳᐤ: "Su",
		"ᐴᓂ\xA0ᐊᔭᒥᐦᐁᑮᓯᑳᐤ": "Mo",
		ᓃᓱᑮᓯᑳᐤ: "Tu",
		ᐋᐱᐦᑕᐘᐣ: "We",
		ᐴᓂᐋᐱᐦᑕᐘᐣ: "Th",
		"ᑫᑳᐨ ᒫᑎᓇᐍᑮᓯᑳᐤ": "Fr",
		ᐅᒉᒥᑮᓯᑳᐏᐲᓯᒼ: "Jan",
		ᐸᐚᐦᒐᑭᓇᓰᐢ: "Feb",
		ᒥᑭᓯᐏᐲᓯᒼ: "Mar",
		ᓂᐢᑭᐲᓯᒼ: "Apr",
		ᐊᓃᑭᐲᓯᒼ: "May",
		ᐚᐏᐲᓯᒼ: "Jun",
		ᐹᐢᑲᐦᐋᐏᐲᓯᒼ: "Jul",
		ᐅᐸᐦᐅᐏᐲᓯᒼ: "Aug",
		ᓄᒌᑐᐏᐲᓯᒼ: "Sep",
		ᐱᓈᐢᑯᐏᐲᓯᒼ: "Oct",
		ᐋᕽᐘᑎᓄᐏᐲᓯᒼ: "Nov",
		ᒪᑯᓭᑮᓭᑳᐏᐲᓯᒼ: "Dec",
		"kifula nguwo": "Sa",
		"ituku ja jumwa": "Su",
		"kuramuka jimweri": "Mo",
		"kuramuka kawi": "Tu",
		"kuramuka kadadu": "We",
		"kuramuka kana": "Th",
		"kuramuka kasanu": "Fr",
		"mori ghwa imbiri": "Jan",
		"mori ghwa kawi": "Feb",
		"mori ghwa kadadu": "Mar",
		"mori ghwa kana": "Apr",
		"mori ghwa kasanu": "May",
		"mori ghwa karandadu": "Jun",
		"mori ghwa mfungade": "Jul",
		"mori ghwa wunyanya": "Aug",
		"mori ghwa ikenda": "Sep",
		"mori ghwa ikumi": "Oct",
		"mori ghwa ikumi na imweri": "Nov",
		"mori ghwa ikumi na iwi": "Dec",
		imb: "Jan",
		wun: "Aug",
		ike: "Sep",
		iku: "Oct",
		imw: "Nov",
		iwi: "Dec",
		ऐतबार: "Su",
		बीरबार: "Th",
		ऐत: "Su",
		बीर: "Th",
		मेई: "May",
		"जन\\.": "Jan",
		"फर\\.": "Feb",
		"अग\\.": "Aug",
		"सित\\.": "Sep",
		"अक्तू\\.": "Oct",
		"नव\\.": "Nov",
		"दिस\\.": "Dec",
		asibti: "Sa",
		alhadi: "Su",
		atinni: "Mo",
		alarba: "We",
		alzuma: "Fr",
		asi: "Sa",
		ati: "Mo",
		alm: "Th",
		alz: "Fr",
		žanwiye: "Jan",
		feewiriye: "Feb",
		awiril: "Apr",
		žuweŋ: "Jun",
		žuyye: "Jul",
		sektanbur: "Sep",
		oktoobur: "Oct",
		noowanbur: "Nov",
		deesanbur: "Dec",
		žan: "Jan",
		fee: "Feb",
		žuw: "Jun",
		žuy: "Jul",
		sek: "Sep",
		noo: "Nov",
		dee: "Dec",
		جدی: "Jan",
		دلو: "Feb",
		حوت: "Mar",
		حمل: "Apr",
		ثور: "May",
		جوزا: "Jun",
		سرطان: "Jul",
		اسد: "Aug",
		سنبلهٔ: "Sep",
		میزان: "Oct",
		عقرب: "Nov",
		قوس: "Dec",
		njeźela: "Su",
		pónjeźele: "Mo",
		wałtora: "Tu",
		srjoda: "We",
		stwórtk: "Th",
		pětk: "Fr",
		pón: "Mo",
		wał: "Tu",
		srj: "We",
		stw: "Th",
		pět: "Fr",
		měrc: "Mar",
		apryl: "Apr",
		nowember: "Nov",
		měr: "Mar",
		esaɓasú: "Sa",
		éti: "Su",
		mɔ́sú: "Mo",
		kwasú: "Tu",
		mukɔ́sú: "We",
		ŋgisú: "Th",
		ɗónɛsú: "Fr",
		esa: "Sa",
		ét: "Su",
		mɔ́s: "Mo",
		ŋgi: "Th",
		ɗón: "Fr",
		dimɔ́di: "Jan",
		ŋgɔndɛ: "Feb",
		sɔŋɛ: "Mar",
		diɓáɓá: "Apr",
		emiasele: "May",
		esɔpɛsɔpɛ: "Jun",
		madiɓɛ́díɓɛ́: "Jul",
		diŋgindi: "Aug",
		nyɛtɛki: "Sep",
		mayésɛ́: "Oct",
		tiníní: "Nov",
		eláŋgɛ́: "Dec",
		ŋgɔn: "Feb",
		sɔŋ: "Mar",
		diɓ: "Apr",
		emi: "May",
		esɔ: "Jun",
		diŋ: "Aug",
		nyɛt: "Sep",
		tin: "Nov",
		elá: "Dec",
		sibiti: "Sa",
		dimas: "Su",
		teneŋ: "Mo",
		alarbay: "We",
		aramisay: "Th",
		arjuma: "Fr",
		ten: "Mo",
		arj: "Fr",
		sanvie: "Jan",
		fébirie: "Feb",
		aburil: "Apr",
		sueŋ: "Jun",
		súuyee: "Jul",
		settembar: "Sep",
		disambar: "Dec",
		sa: "Jan",
		fe: "Feb",
		su: "Jun",
		sú: "Jul",
		se: "Sep",
		ok: "Oct",
		no: "Nov",
		njumamothii: "Sa",
		njumatatu: "Mo",
		njumatano: "We",
		arm: "Th",
		"mweri wa mbere": "Jan",
		"mweri wa kaĩri": "Feb",
		"mweri wa kathatũ": "Mar",
		"mweri wa kana": "Apr",
		"mweri wa gatano": "May",
		"mweri wa gatantatũ": "Jun",
		"mweri wa mũgwanja": "Jul",
		"mweri wa kanana": "Aug",
		"mweri wa kenda": "Sep",
		"mweri wa ikũmi": "Oct",
		"mweri wa ikũmi na ũmwe": "Nov",
		"mweri wa ikũmi na kaĩrĩ": "Dec",
		mbe: "Jan",
		kai: "Feb",
		kat: "Mar",
		gat: "May",
		gan: "Jun",
		knn: "Aug",
		ken: "Sep",
		igi: "Dec",
		séradé: "Sa",
		sɔ́ndɔ: "Su",
		mɔ́ndi: "Mo",
		"sɔ́ndɔ məlú mə́bɛ̌": "Tu",
		"sɔ́ndɔ məlú mə́lɛ́": "We",
		"sɔ́ndɔ məlú mə́nyi": "Th",
		fúladé: "Fr",
		sér: "Sa",
		sɔ́n: "Su",
		mɔ́n: "Mo",
		smb: "Tu",
		sml: "We",
		smn: "Th",
		fúl: "Fr",
		"ngɔn osú": "Jan",
		"ngɔn bɛ̌": "Feb",
		"ngɔn lála": "Mar",
		"ngɔn nyina": "Apr",
		"ngɔn tána": "May",
		"ngɔn saməna": "Jun",
		"ngɔn zamgbála": "Jul",
		"ngɔn mwom": "Aug",
		"ngɔn ebulú": "Sep",
		"ngɔn awóm": "Oct",
		"ngɔn awóm ai dziá": "Nov",
		"ngɔn awóm ai bɛ̌": "Dec",
		ngo: "Jan",
		ngl: "Mar",
		ngn: "Apr",
		ngt: "May",
		ngz: "Jul",
		ngm: "Aug",
		nga: "Oct",
		ngad: "Nov",
		ngab: "Dec",
		sabide: "Sa",
		domenie: "Su",
		martars: "Tu",
		miercus: "We",
		joibe: "Th",
		vinars: "Fr",
		mie: "We",
		vin: "Fr",
		zenâr: "Jan",
		fevrâr: "Feb",
		avrîl: "Apr",
		jugn: "Jun",
		avost: "Aug",
		setembar: "Sep",
		otubar: "Oct",
		dicembar: "Dec",
		zen: "Jan",
		jug: "Jun",
		avo: "Aug",
		otu: "Oct",
		hɔɔ: "Sa",
		hɔgbaa: "Su",
		ju: "Mo",
		jufɔ: "Tu",
		shɔ: "We",
		soo: "Th",
		sohaa: "Fr",
		aharabata: "Jan",
		oflɔ: "Feb",
		otsokrikri: "Mar",
		abɛibe: "Apr",
		agbiɛnaa: "May",
		otukwajaŋ: "Jun",
		maawɛ: "Jul",
		manyawale: "Aug",
		gbo: "Sep",
		antɔŋ: "Oct",
		alemle: "Nov",
		afuabe: "Dec",
		शेनवार: "Sa",
		आयतार: "Su",
		सोमार: "Mo",
		मंगळार: "Tu",
		बिरेस्तार: "Th",
		शुक्रार: "Fr",
		एप्रील: "Apr",
		जुलय: "Jul",
		एप्री: "Apr",
		नो: "Nov",
		samschtig: "Sa",
		sunntig: "Su",
		määntig: "Mo",
		ziischtig: "Tu",
		mittwuch: "We",
		dunschtig: "Th",
		friitig: "Fr",
		"su\\.": "Su",
		"mä\\.": "Mo",
		"zi\\.": "Tu",
		"mi\\.": "We",
		"du\\.": "Th",
		"fr\\.": "Fr",
		auguscht: "Aug",
		septämber: "Sep",
		novämber: "Nov",
		dezämber: "Dec",
		esabato: "Sa",
		chumapiri: "Su",
		chumatato: "Mo",
		chumaine: "Tu",
		chumatano: "We",
		aramisi: "Th",
		ichuma: "Fr",
		cpr: "Su",
		ctt: "Mo",
		cmn: "Tu",
		ars: "Th",
		icm: "Fr",
		chanuari: "Jan",
		feburari: "Feb",
		apiriri: "Apr",
		chulai: "Jul",
		okitoba: "Oct",
		nobemba: "Nov",
		can: "Jan",
		cul: "Jul",
		poʻaono: "Sa",
		lāpule: "Su",
		poʻakahi: "Mo",
		poʻalua: "Tu",
		poʻakolu: "We",
		poʻahā: "Th",
		poʻalima: "Fr",
		p6: "Sa",
		lp: "Su",
		p1: "Mo",
		p2: "Tu",
		p3: "We",
		p4: "Th",
		p5: "Fr",
		ianuali: "Jan",
		pepeluali: "Feb",
		malaki: "Mar",
		ʻapelila: "Apr",
		iune: "Jun",
		iulai: "Jul",
		ʻaukake: "Aug",
		kepakemapa: "Sep",
		ʻokakopa: "Oct",
		nowemapa: "Nov",
		kekemapa: "Dec",
		"pep\\.": "Feb",
		"mal\\.": "Mar",
		"ʻap\\.": "Apr",
		"ʻau\\.": "Aug",
		"kep\\.": "Sep",
		"ʻok\\.": "Oct",
		"now\\.": "Nov",
		"kek\\.": "Dec",
		njedźela: "Su",
		póndźela: "Mo",
		wutora: "Tu",
		srjeda: "We",
		štwórtk: "Th",
		pjatk: "Fr",
		štw: "Th",
		pja: "Fr",
		meja: "May",
		sásidɛ: "Sa",
		sɔ́ndi: "Su",
		"ápta mɔ́ndi": "Tu",
		wɛ́nɛsɛdɛ: "We",
		tɔ́sɛdɛ: "Th",
		fɛlâyɛdɛ: "Fr",
		"nduŋmbi saŋ": "Jan",
		"pɛsaŋ pɛ́pá": "Feb",
		"pɛsaŋ pɛ́tát": "Mar",
		"pɛsaŋ pɛ́nɛ́kwa": "Apr",
		"pɛsaŋ pataa": "May",
		"pɛsaŋ pɛ́nɛ́ntúkú": "Jun",
		"pɛsaŋ saambá": "Jul",
		"pɛsaŋ pɛ́nɛ́fɔm": "Aug",
		"pɛsaŋ pɛ́nɛ́pfúꞌú": "Sep",
		"pɛsaŋ nɛgɛ́m": "Oct",
		"pɛsaŋ ntsɔ̌pmɔ́": "Nov",
		"pɛsaŋ ntsɔ̌ppá": "Dec",
		jumapilyi: "Su",
		jumatatuu: "Mo",
		jumatanu: "We",
		iju: "Fr",
		aprilyi: "Apr",
		junyi: "Jun",
		julyai: "Jul",
		agusti: "Aug",
		sayass: "Sa",
		yanass: "Su",
		sanass: "Mo",
		kraḍass: "Tu",
		kuẓass: "We",
		samass: "Th",
		sḍisass: "Fr",
		say: "Sa",
		kraḍ: "Tu",
		kuẓ: "We",
		sḍis: "Fr",
		yennayer: "Jan",
		fuṛar: "Feb",
		meɣres: "Mar",
		yebrir: "Apr",
		mayyu: "May",
		yunyu: "Jun",
		yulyu: "Jul",
		ɣuct: "Aug",
		ctembeṛ: "Sep",
		tubeṛ: "Oct",
		nunembeṛ: "Nov",
		duǧembeṛ: "Dec",
		yen: "Jan",
		fur: "Feb",
		meɣ: "Mar",
		ɣuc: "Aug",
		cte: "Sep",
		tub: "Oct",
		nun: "Nov",
		duǧ: "Dec",
		"wa thanthatũ": "Sa",
		"wa kyumwa": "Su",
		"wa kwambĩlĩlya": "Mo",
		"wa kelĩ": "Tu",
		"wa katatũ": "We",
		"wa kana": "Th",
		"wa katano": "Fr",
		wth: "Sa",
		wky: "Su",
		wkw: "Mo",
		wkl: "Tu",
		wtũ: "We",
		"mwai wa mbee": "Jan",
		"mwai wa kelĩ": "Feb",
		"mwai wa katatũ": "Mar",
		"mwai wa kana": "Apr",
		"mwai wa katano": "May",
		"mwai wa thanthatũ": "Jun",
		"mwai wa muonza": "Jul",
		"mwai wa nyaanya": "Aug",
		"mwai wa kenda": "Sep",
		"mwai wa ĩkumi": "Oct",
		"mwai wa ĩkumi na ĩmwe": "Nov",
		"mwai wa ĩkumi na ilĩ": "Dec",
		ktũ: "Mar",
		moo: "Jul",
		knd: "Sep",
		ĩku: "Oct",
		ĩkm: "Nov",
		ĩkl: "Dec",
		"liduva litandi": "Sa",
		"liduva lyapili": "Su",
		"liduva lyatatu": "Mo",
		"liduva lyanchechi": "Tu",
		"liduva lyannyano": "We",
		"liduva lyannyano na linji": "Th",
		"liduva lyannyano na mavili": "Fr",
		ll1: "Sa",
		ll2: "Su",
		ll3: "Mo",
		ll4: "Tu",
		ll5: "We",
		ll6: "Th",
		ll7: "Fr",
		"mwedi ntandi": "Jan",
		"mwedi wa pili": "Feb",
		"mwedi wa tatu": "Mar",
		"mwedi wa nchechi": "Apr",
		"mwedi wa nnyano": "May",
		"mwedi wa nnyano na umo": "Jun",
		"mwedi wa nnyano na mivili": "Jul",
		"mwedi wa nnyano na mitatu": "Aug",
		"mwedi wa nnyano na nchechi": "Sep",
		"mwedi wa nnyano na nnyano": "Oct",
		"mwedi wa nnyano na nnyano na u": "Nov",
		"mwedi wa nnyano na nnyano na m": "Dec",
		dumingu: "Su",
		"sigunda-fera": "Mo",
		"tersa-fera": "Tu",
		"kuarta-fera": "We",
		"kinta-fera": "Th",
		"sesta-fera": "Fr",
		sig: "Mo",
		ter: "Tu",
		kua: "We",
		kin: "Th",
		ses: "Fr",
		janeru: "Jan",
		marsu: "Mar",
		maiu: "May",
		junhu: "Jun",
		julhu: "Jul",
		setenbru: "Sep",
		otubru: "Oct",
		nuvenbru: "Nov",
		dizenbru: "Dec",
		nuv: "Nov",
		diz: "Dec",
		savnu: "Sa",
		numĩggu: "Su",
		"pir-kurã-há": "Mo",
		"régre-kurã-há": "Tu",
		"tẽgtũ-kurã-há": "We",
		"vẽnhkãgra-kurã-há": "Th",
		"pénkar-kurã-há": "Fr",
		"sav\\.": "Sa",
		"num\\.": "Su",
		"pir\\.": "Mo",
		"rég\\.": "Tu",
		"tẽg\\.": "We",
		"vẽn\\.": "Th",
		"pén\\.": "Fr",
		"1-kysã": "Jan",
		"2-kysã": "Feb",
		"3-kysã": "Mar",
		"4-kysã": "Apr",
		"5-kysã": "May",
		"6-kysã": "Jun",
		"7-kysã": "Jul",
		"8-kysã": "Aug",
		"9-kysã": "Sep",
		"10-kysã": "Oct",
		"11-kysã": "Nov",
		"12-kysã": "Dec",
		"1ky\\.": "Jan",
		"2ky\\.": "Feb",
		"3ky\\.": "Mar",
		"4ky\\.": "Apr",
		"5ky\\.": "May",
		"6ky\\.": "Jun",
		"7ky\\.": "Jul",
		"8ky\\.": "Aug",
		"9ky\\.": "Sep",
		"10ky\\.": "Oct",
		"11ky\\.": "Nov",
		"12ky\\.": "Dec",
		assabdu: "Sa",
		atini: "Mo",
		atalata: "Tu",
		alhamiisa: "Th",
		aljuma: "Fr",
		ass: "Sa",
		alj: "Fr",
		"mɔnɔ sɔndi": "Sa",
		sɔndi: "Su",
		mɛrkɛrɛdi: "We",
		yedi: "Th",
		vaŋdɛrɛdi: "Fr",
		pamba: "Jan",
		wanja: "Feb",
		"mbiyɔ mɛndoŋgɔ": "Mar",
		nyɔlɔmbɔŋgɔ: "Apr",
		"mɔnɔ ŋgbanja": "May",
		"nyaŋgwɛ ŋgbanja": "Jun",
		kuŋgwɛ: "Jul",
		fɛ: "Aug",
		njapi: "Sep",
		nyukul: "Oct",
		m11: "Nov",
		ɓulɓusɛ: "Dec",
		kolo: "Sa",
		kotisap: "Su",
		kotaai: "Mo",
		"koaeng’": "Tu",
		kosomok: "We",
		"koang’wan": "Th",
		komuut: "Fr",
		kts: "Su",
		kot: "Mo",
		koo: "Tu",
		kos: "We",
		koa: "Th",
		kom: "Fr",
		mulgul: "Jan",
		"ng’atyaato": "Feb",
		kiptaamo: "Mar",
		iwootkuut: "Apr",
		mamuut: "May",
		paagi: "Jun",
		"ng’eiyeet": "Jul",
		rooptui: "Aug",
		bureet: "Sep",
		epeeso: "Oct",
		"kipsuunde ne taai": "Nov",
		"kipsuunde nebo aeng’": "Dec",
		ngat: "Feb",
		iwo: "Apr",
		paa: "Jun",
		roo: "Aug",
		bur: "Sep",
		epe: "Oct",
		kpt: "Nov",
		jumaamosi: "Sa",
		jumaapii: "Su",
		jumaatatu: "Mo",
		jumaane: "Tu",
		jumaatano: "We",
		jmn: "Tu",
		januali: "Jan",
		febluali: "Feb",
		aplili: "Apr",
		samdí: "Sa",
		sɔ́ndǝ: "Su",
		lǝndí: "Mo",
		maadí: "Tu",
		mɛkrɛdí: "We",
		jǝǝdí: "Th",
		júmbá: "Fr",
		lǝn: "Mo",
		mɛk: "We",
		jǝǝ: "Th",
		júm: "Fr",
		"ŋwíí a ntɔ́ntɔ": "Jan",
		"ŋwíí akǝ bɛ́ɛ": "Feb",
		"ŋwíí akǝ ráá": "Mar",
		"ŋwíí akǝ nin": "Apr",
		"ŋwíí akǝ táan": "May",
		"ŋwíí akǝ táafɔk": "Jun",
		"ŋwíí akǝ táabɛɛ": "Jul",
		"ŋwíí akǝ táaraa": "Aug",
		"ŋwíí akǝ táanin": "Sep",
		"ŋwíí akǝ ntɛk": "Oct",
		"ŋwíí akǝ ntɛk di bɔ́k": "Nov",
		"ŋwíí akǝ ntɛk di bɛ́ɛ": "Dec",
		ŋ1: "Jan",
		ŋ2: "Feb",
		ŋ3: "Mar",
		ŋ4: "Apr",
		ŋ5: "May",
		ŋ6: "Jun",
		ŋ7: "Jul",
		ŋ8: "Aug",
		ŋ9: "Sep",
		ŋ10: "Oct",
		ŋ11: "Nov",
		ŋ12: "Dec",
		samsdaach: "Sa",
		sunndaach: "Su",
		mohndaach: "Mo",
		dinnsdaach: "Tu",
		metwoch: "We",
		dunnersdaach: "Th",
		friidaach: "Fr",
		"mo\\.": "Mo",
		"me\\.": "We",
		jannewa: "Jan",
		fäbrowa: "Feb",
		määz: "Mar",
		aprell: "Apr",
		oujoß: "Aug",
		oktohber: "Oct",
		"fäb\\.": "Feb",
		"mäz\\.": "Mar",
		"ouj\\.": "Aug",
		"säp\\.": "Sep",
		"sani vara": "Sa",
		"aadi vara": "Su",
		smbara: "Mo",
		mangaḍa: "Tu",
		pudara: "We",
		"laki vara": "Th",
		"sukru vara": "Fr",
		sani: "Sa",
		aadi: "Su",
		smba: "Mo",
		manga: "Tu",
		puda: "We",
		laki: "Th",
		sukru: "Fr",
		"pusu lenju": "Jan",
		"maha lenju": "Feb",
		"pagu lenju": "Mar",
		"hire lenju": "Apr",
		"bese lenju": "May",
		"jaṭṭa lenju": "Jun",
		"aasaḍi lenju": "Jul",
		"srabĩ lenju": "Aug",
		"bado lenju": "Sep",
		"dasara lenju": "Oct",
		"divi lenju": "Nov",
		"pande lenju": "Dec",
		pusu: "Jan",
		maha: "Feb",
		pagu: "Mar",
		hire: "Apr",
		bese: "May",
		jaṭṭa: "Jun",
		aasaḍi: "Jul",
		srabĩ: "Aug",
		bado: "Sep",
		dasara: "Oct",
		divi: "Nov",
		pande: "Dec",
		jumamóosi: "Sa",
		jumapíiri: "Su",
		jumatátu: "Mo",
		jumaíne: "Tu",
		jumatáano: "We",
		alamíisi: "Th",
		ijumáa: "Fr",
		móosi: "Sa",
		píili: "Su",
		táatu: "Mo",
		íne: "Tu",
		táano: "We",
		kʉfúngatɨ: "Jan",
		kʉnaanɨ: "Feb",
		kʉkeenda: "Mar",
		kwiikumi: "Apr",
		kwiinyambála: "May",
		kwiidwaata: "Jun",
		kʉmʉʉnchɨ: "Jul",
		kʉvɨɨrɨ: "Aug",
		kʉsaatʉ: "Sep",
		kwiinyi: "Oct",
		kʉsaano: "Nov",
		kʉsasatʉ: "Dec",
		fúngatɨ: "Jan",
		naanɨ: "Feb",
		keenda: "Mar",
		ikúmi: "Apr",
		inyambala: "May",
		idwaata: "Jun",
		mʉʉnchɨ: "Jul",
		vɨɨrɨ: "Aug",
		saatʉ: "Sep",
		inyi: "Oct",
		saano: "Nov",
		sasatʉ: "Dec",
		sabbo: "Sa",
		domenega: "Su",
		lunesdì: "Mo",
		mätesdì: "Tu",
		mäcordì: "We",
		zeuggia: "Th",
		venardì: "Fr",
		"de zenâ": "Jan",
		"de frevâ": "Feb",
		"de marso": "Mar",
		"d’arvî": "Apr",
		"de mazzo": "May",
		"de zugno": "Jun",
		"de luggio": "Jul",
		"d’agosto": "Aug",
		"de settembre": "Sep",
		"d’ottobre": "Oct",
		"de dexembre": "Dec",
		owáŋgyužažapi: "Sa",
		aŋpétuwakȟaŋ: "Su",
		aŋpétuwaŋži: "Mo",
		aŋpétunuŋpa: "Tu",
		aŋpétuyamni: "We",
		aŋpétutopa: "Th",
		aŋpétuzaptaŋ: "Fr",
		"wiótheȟika wí": "Jan",
		"thiyóȟeyuŋka wí": "Feb",
		"ištáwičhayazaŋ wí": "Mar",
		"pȟežítȟo wí": "Apr",
		"čhaŋwápetȟo wí": "May",
		"wípazukȟa-wašté wí": "Jun",
		"čhaŋpȟásapa wí": "Jul",
		"wasútȟuŋ wí": "Aug",
		"čhaŋwápeǧi wí": "Sep",
		"čhaŋwápe-kasná wí": "Oct",
		"waníyetu wí": "Nov",
		"tȟahékapšuŋ wí": "Dec",
		sabet: "Sa",
		lundì: "Mo",
		mardì: "Tu",
		mercoldì: "We",
		sgiovedì: "Th",
		sginer: "Jan",
		fevrer: "Feb",
		marz: "Mar",
		masg: "May",
		sgiugn: "Jun",
		luj: "Jul",
		setember: "Sep",
		otover: "Oct",
		dicember: "Dec",
		dey: "Jan",
		bahman: "Feb",
		esfand: "Mar",
		farvardin: "Apr",
		ordibehesht: "May",
		khordad: "Jun",
		tir: "Jul",
		mordad: "Aug",
		shahrivar: "Sep",
		mehr: "Oct",
		aban: "Nov",
		azar: "Dec",
		ngeso: "Sa",
		jumapil: "Su",
		"wuok tich": "Mo",
		"tich ariyo": "Tu",
		"tich adek": "We",
		"tich ang’wen": "Th",
		"tich abich": "Fr",
		jmp: "Su",
		tad: "We",
		tab: "Fr",
		"dwe mar achiel": "Jan",
		"dwe mar ariyo": "Feb",
		"dwe mar adek": "Mar",
		"dwe mar ang’wen": "Apr",
		"dwe mar abich": "May",
		"dwe mar auchiel": "Jun",
		"dwe mar abiriyo": "Jul",
		"dwe mar aboro": "Aug",
		"dwe mar ochiko": "Sep",
		"dwe mar apar": "Oct",
		"dwe mar gi achiel": "Nov",
		"dwe mar apar gi ariyo": "Dec",
		dac: "Jan",
		dar: "Feb",
		dad: "Mar",
		dan: "Apr",
		dah: "May",
		dau: "Jun",
		dao: "Jul",
		dab: "Aug",
		doc: "Sep",
		dap: "Oct",
		dgi: "Nov",
		dag: "Dec",
		"शनि दिन": "Sa",
		"रवि दिन": "Su",
		"सोम दिन": "Mo",
		"मंगल दिन": "Tu",
		"बुध दिन": "We",
		"बृहस्पति दिन": "Th",
		"शुक्र दिन": "Fr",
		"फर॰": "Feb",
		jumamósi: "Sa",
		jumapílí: "Su",
		jumane: "Tu",
		jumatánɔ: "We",
		alaámisi: "Th",
		jumáa: "Fr",
		oladalʉ́: "Jan",
		arát: "Feb",
		ɔɛnɨ́ɔɨŋɔk: "Mar",
		"olodoyíóríê inkókúâ": "Apr",
		"oloilépūnyīē inkókúâ": "May",
		kújúɔrɔk: "Jun",
		mórusásin: "Jul",
		ɔlɔ́ɨ́bɔ́rárɛ: "Aug",
		kúshîn: "Sep",
		olgísan: "Oct",
		pʉshʉ́ka: "Nov",
		ntʉ́ŋʉ́s: "Dec",
		dal: "Jan",
		ará: "Feb",
		ɔɛn: "Mar",
		doy: "Apr",
		lép: "May",
		rok: "Jun",
		sás: "Jul",
		bɔ́r: "Aug",
		kús: "Sep",
		gís: "Oct",
		shʉ́: "Nov",
		ntʉ́: "Dec",
		muramuko: "Mo",
		wairi: "Tu",
		wethatu: "We",
		wena: "Th",
		wetano: "Fr",
		kiu: "Su",
		mra: "Mo",
		wai: "Tu",
		wet: "We",
		januarĩ: "Jan",
		feburuarĩ: "Feb",
		ĩpurũ: "Apr",
		mĩĩ: "May",
		njuni: "Jun",
		njuraĩ: "Jul",
		oktũba: "Oct",
		dicemba: "Dec",
		ĩpu: "Apr",
		nju: "Jun",
		njr: "Jul",
		spt: "Sep",
		samdi: "Sa",
		dimans: "Su",
		lindi: "Mo",
		merkredi: "We",
		zedi: "Th",
		vandredi: "Fr",
		ze: "Th",
		van: "Fr",
		zanvie: "Jan",
		fevriye: "Feb",
		zin: "Jun",
		zilye: "Jul",
		out: "Aug",
		septam: "Sep",
		oktob: "Oct",
		novam: "Nov",
		desam: "Dec",
		zil: "Jul",
		arahamisi: "Th",
		"mweri wo kwanza": "Jan",
		"mweri wo unayeli": "Feb",
		"mweri wo uneraru": "Mar",
		"mweri wo unecheshe": "Apr",
		"mweri wo unethanu": "May",
		"mweri wo thanu na mocha": "Jun",
		"mweri wo saba": "Jul",
		"mweri wo nane": "Aug",
		"mweri wo tisa": "Sep",
		"mweri wo kumi": "Oct",
		"mweri wo kumi na moja": "Nov",
		"mweri wo kumi na yel’li": "Dec",
		una: "Feb",
		moc: "Jun",
		moj: "Nov",
		yel: "Dec",
		"aneg 7": "Sa",
		"aneg 1": "Su",
		"aneg 2": "Mo",
		"aneg 3": "Tu",
		"aneg 4": "We",
		"aneg 5": "Th",
		"aneg 6": "Fr",
		"iməg mbegtug": "Jan",
		"imeg àbùbì": "Feb",
		"imeg mbəŋchubi": "Mar",
		"iməg ngwə̀t": "Apr",
		"iməg fog": "May",
		"iməg ichiibɔd": "Jun",
		"iməg àdùmbə̀ŋ": "Jul",
		"iməg ichika": "Aug",
		"iməg kud": "Sep",
		"iməg tèsiʼe": "Oct",
		"iməg zò": "Nov",
		"iməg krizmed": "Dec",
		mbegtug: "Jan",
		থাংজ: "Sa",
		নোংমাইজিং: "Su",
		নিংথৌকাবা: "Mo",
		লৈবাকপোকপা: "Tu",
		য়ুমশকৈশা: "We",
		শগোলশেন: "Th",
		ইরাই: "Fr",
		জানুৱারি: "Jan",
		ফেব্রুৱারি: "Feb",
		ওগষ্ট: "Aug",
		ওক্টোবর: "Oct",
		নবেম্বর: "Nov",
		ফেব্রু: "Feb",
		মার: "Mar",
		এপ্রি: "Apr",
		জুলা: "Jul",
		সেপ্ট: "Sep",
		ওক্টো: "Oct",
		নভে: "Nov",
		ডিসে: "Dec",
		comzyeɓsuu: "Sa",
		"com’yakke": "Su",
		comlaaɗii: "Mo",
		comzyiiɗii: "Tu",
		comkolle: "We",
		comkaldǝɓlii: "Th",
		comgaisuu: "Fr",
		cya: "Su",
		czi: "Tu",
		cko: "We",
		cka: "Th",
		cga: "Fr",
		"fĩi loo": "Jan",
		cokcwaklaŋne: "Feb",
		cokcwaklii: "Mar",
		"fĩi marfoo": "Apr",
		madǝǝuutǝbijaŋ: "May",
		mamǝŋgwãafahbii: "Jun",
		mamǝŋgwãalii: "Jul",
		madǝmbii: "Aug",
		"fĩi dǝɓlii": "Sep",
		"fĩi mundaŋ": "Oct",
		"fĩi gwahlle": "Nov",
		"fĩi yuru": "Dec",
		flo: "Jan",
		cki: "Mar",
		fmf: "Apr",
		mli: "Jul",
		fde: "Sep",
		fmu: "Oct",
		fgw: "Nov",
		fyu: "Dec",
		satertaxtsees: "Sa",
		sontaxtsees: "Su",
		mantaxtsees: "Mo",
		denstaxtsees: "Tu",
		wunstaxtsees: "We",
		dondertaxtsees: "Th",
		fraitaxtsees: "Fr",
		wu: "We",
		ǃkhanni: "Jan",
		ǃkhanǀgôab: "Feb",
		ǀkhuuǁkhâb: "Mar",
		ǃhôaǂkhaib: "Apr",
		ǃkhaitsâb: "May",
		gamaǀaeb: "Jun",
		ǂkhoesaob: "Jul",
		aoǁkhuumûǁkhâb: "Aug",
		taraǀkhuumûǁkhâb: "Sep",
		ǂnûǁnâiseb: "Oct",
		ǀhooǂgaeb: "Nov",
		hôasoreǁkhâb: "Dec",
		sünnavend: "Sa",
		sünndag: "Su",
		dingsdag: "Tu",
		middeweken: "We",
		dunnersdag: "Th",
		freedag: "Fr",
		januaar: "Jan",
		februaar: "Feb",
		oktover: "Oct",
		sásadi: "Sa",
		mɔ́ndɔ: "Mo",
		"sɔ́ndɔ mafú mába": "Tu",
		"sɔ́ndɔ mafú málal": "We",
		"sɔ́ndɔ mafú mána": "Th",
		"mabágá má sukul": "Fr",
		sas: "Sa",
		mbs: "Fr",
		"ngwɛn matáhra": "Jan",
		"ngwɛn ńmba": "Feb",
		"ngwɛn ńlal": "Mar",
		"ngwɛn ńna": "Apr",
		"ngwɛn ńtan": "May",
		"ngwɛn ńtuó": "Jun",
		"ngwɛn hɛmbuɛrí": "Jul",
		"ngwɛn lɔmbi": "Aug",
		"ngwɛn rɛbvuâ": "Sep",
		"ngwɛn wum": "Oct",
		"ngwɛn wum navǔr": "Nov",
		krísimin: "Dec",
		ng1: "Jan",
		ng2: "Feb",
		ng3: "Mar",
		ng4: "Apr",
		ng5: "May",
		ng6: "Jun",
		ng7: "Jul",
		ng8: "Aug",
		ng9: "Sep",
		ng10: "Oct",
		ng11: "Nov",
		kris: "Dec",
		"màga lyɛ̌ʼ": "Sa",
		"lyɛʼɛ́ sẅíŋtè": "Su",
		"mvfò lyɛ̌ʼ": "Mo",
		"mbɔ́ɔntè mvfò lyɛ̌ʼ": "Tu",
		"tsètsɛ̀ɛ lyɛ̌ʼ": "We",
		"mbɔ́ɔntè tsetsɛ̀ɛ lyɛ̌ʼ": "Th",
		"mvfò màga lyɛ̌ʼ": "Fr",
		"saŋ tsetsɛ̀ɛ lùm": "Jan",
		"saŋ kàg ngwóŋ": "Feb",
		"saŋ lepyè shúm": "Mar",
		"saŋ cÿó": "Apr",
		"saŋ tsɛ̀ɛ cÿó": "May",
		"saŋ njÿoláʼ": "Jun",
		"saŋ tyɛ̀b tyɛ̀b mbʉ̀ŋ": "Jul",
		"saŋ mbʉ̀ŋ": "Aug",
		"saŋ ngwɔ̀ʼ mbÿɛ": "Sep",
		"saŋ tàŋa tsetsáʼ": "Oct",
		"saŋ mejwoŋó": "Nov",
		"saŋ lùm": "Dec",
		ߞߍ߲ߘߍߟߏ߲: "Sa",
		ߞߊ߯ߙߌߟߏ߲: "Su",
		ߞߐ߬ߓߊ߬ߟߏ߲: "Mo",
		ߞߐ߬ߟߏ߲: "Tu",
		ߞߎߣߎ߲ߟߏ߲: "We",
		ߓߌߟߏ߲: "Th",
		ߛߌ߬ߣߌ߲߬ߟߏ߲: "Fr",
		ߞߍ߲ߘ: "Sa",
		ߞߊ߯ߙ: "Su",
		ߞߐ߬ߓ: "Mo",
		ߞߐ߬ߟ: "Tu",
		ߞߎߣ: "We",
		ߓߌߟ: "Th",
		ߛߌ߬ߣ: "Fr",
		ߓߌ߲ߠߊߥߎߟߋ߲: "Jan",
		ߞߏ߲ߞߏߜߍ: "Feb",
		ߕߙߊߓߊ: "Mar",
		ߞߏ߲ߞߏߘߌ߬ߓߌ: "Apr",
		ߘߓߊ߬ߕߊ: "May",
		ߥߊ߬ߛߌ߬ߥߙߊ: "Jun",
		ߞߊ߬ߙߌߝߐ߭: "Jul",
		ߘߓߊ߬ߓߌߟߊ: "Aug",
		ߕߎߟߊߝߌ߲: "Sep",
		ߞߏ߲ߓߌߕߌ߮: "Oct",
		ߣߍߣߍߓߊ: "Nov",
		ߞߏߟߌ߲ߞߏߟߌ߲: "Dec",
		ߓߌ߲ߠ: "Jan",
		ߞߏ߲ߞ: "Feb",
		ߕߙߊ: "Mar",
		ߞߏ߲ߘ: "Apr",
		ߘߓߊ߬ߕ: "May",
		ߥߊ߬ߛ: "Jun",
		ߞߊ߬ߙ: "Jul",
		ߘߓߊ߬ߓ: "Aug",
		ߞߏ߲ߓ: "Oct",
		ߣߍߣ: "Nov",
		ߞߏߟ: "Dec",
		mokibelo: "Sa",
		lamorena: "Su",
		mošupologo: "Mo",
		lam: "Su",
		janeware: "Jan",
		febereware: "Feb",
		matšhe: "Mar",
		aporele: "Apr",
		julae: "Jul",
		agosetose: "Aug",
		setemere: "Sep",
		oktobore: "Oct",
		nofemere: "Nov",
		disemere: "Dec",
		phere: "Jan",
		dibo: "Feb",
		hlak: "Mar",
		mora: "Apr",
		mose: "Jul",
		lewe: "Sep",
		dipha: "Oct",
		diba: "Nov",
		manth: "Dec",
		"bäkɛl lätni": "Sa",
		"cäŋ kuɔth": "Su",
		"jiec la̱t": "Mo",
		"rɛw lätni": "Tu",
		"diɔ̱k lätni": "We",
		"ŋuaan lätni": "Th",
		"dhieec lätni": "Fr",
		bäkɛl: "Sa",
		cäŋ: "Su",
		jiec: "Mo",
		rɛw: "Tu",
		diɔ̱k: "We",
		ŋuaan: "Th",
		dhieec: "Fr",
		"tiop thar pɛt": "Jan",
		pɛt: "Feb",
		duɔ̱ɔ̱ŋ: "Mar",
		guak: "Apr",
		duät: "May",
		kornyoot: "Jun",
		"pay yie̱tni": "Jul",
		tho̱o̱r: "Aug",
		tɛɛr: "Sep",
		laath: "Oct",
		"tio̱p in di̱i̱t": "Dec",
		tiop: "Jan",
		duɔ̱ɔ̱: "Mar",
		duä: "May",
		thoo: "Aug",
		tɛɛ: "Sep",
		laa: "Oct",
		tid: "Dec",
		sátọdè: "Sa",
		sọ́ndè: "Su",
		mọ́ndè: "Mo",
		tiúzdè: "Tu",
		wẹ́nẹ́zdè: "We",
		tọ́zdè: "Th",
		fraídè: "Fr",
		sát: "Sa",
		sọ́n: "Su",
		mọ́n: "Mo",
		tiú: "Tu",
		wẹ́n: "We",
		tọ́z: "Th",
		fraí: "Fr",
		jénúári: "Jan",
		fẹ́búári: "Feb",
		mach: "Mar",
		éprel: "Apr",
		ọgọst: "Aug",
		sẹptẹ́mba: "Sep",
		ọktóba: "Oct",
		nọvẹ́mba: "Nov",
		disẹ́mba: "Dec",
		jén: "Jan",
		fẹ́b: "Feb",
		épr: "Apr",
		ọ́gọ: "Aug",
		sẹp: "Sep",
		nọv: "Nov",
		sabattika: "Sa",
		nadīli: "Su",
		panadīli: "Mo",
		wisasīdis: "Tu",
		pussisawaiti: "We",
		ketwirtiks: "Th",
		pēntniks: "Fr",
		rags: "Jan",
		wassarins: "Feb",
		pūlis: "Mar",
		sakkis: "Apr",
		zallaws: "May",
		sīmenis: "Jun",
		līpa: "Jul",
		daggis: "Aug",
		sillins: "Sep",
		spallins: "Oct",
		lapkrūtis: "Nov",
		sallaws: "Dec",
		ijumamosi: "Sa",
		ijumapili: "Su",
		ijumatatu: "Mo",
		ijumanne: "Tu",
		ijumatano: "We",
		ijp: "Su",
		ijt: "Mo",
		ijn: "Tu",
		ijtn: "We",
		"mweri wa kwanza": "Jan",
		"mweri wa kaili": "Feb",
		"mweri wa katatu": "Mar",
		"mweri wa kaana": "Apr",
		"mweri wa tanu": "May",
		"mweri wa sita": "Jun",
		"mweri wa saba": "Jul",
		"mweri wa nane": "Aug",
		"mweri wa tisa": "Sep",
		"mweri wa ikumi": "Oct",
		"mweri wa ikumi na moja": "Nov",
		"mweri wa ikumi na mbili": "Dec",
		m1: "Jan",
		m2: "Feb",
		m3: "Mar",
		m4: "Apr",
		m5: "May",
		m6: "Jun",
		m7: "Jul",
		m8: "Aug",
		m9: "Sep",
		m10: "Oct",
		m12: "Dec",
		субуота: "Sa",
		баскыһыанньа: "Su",
		бэнидиэнньик: "Mo",
		оптуорунньук: "Tu",
		сэрэдэ: "We",
		чэппиэр: "Th",
		бээтиҥсэ: "Fr",
		бн: "Mo",
		оп: "Tu",
		сэ: "We",
		чп: "Th",
		бэ: "Fr",
		тохсунньу: "Jan",
		олунньу: "Feb",
		"кулун тутар": "Mar",
		"муус устар": "Apr",
		"ыам ыйа": "May",
		"бэс ыйа": "Jun",
		"от ыйа": "Jul",
		"атырдьых ыйа": "Aug",
		"балаҕан ыйа": "Sep",
		алтынньы: "Oct",
		сэтинньи: "Nov",
		ахсынньы: "Dec",
		тохс: "Jan",
		олун: "Feb",
		клн: "Mar",
		мсу: "Apr",
		ыам: "May",
		бэс: "Jun",
		отй: "Jul",
		атр: "Aug",
		блҕ: "Sep",
		алт: "Oct",
		сэт: "Nov",
		ахс: "Dec",
		"mderot ee kwe": "Sa",
		"mderot ee are": "Su",
		"mderot ee kuni": "Mo",
		"mderot ee ong’wan": "Tu",
		"mderot ee inet": "We",
		"mderot ee ile": "Th",
		"mderot ee sapa": "Fr",
		are: "Su",
		kun: "Mo",
		"lapa le obo": "Jan",
		"lapa le waare": "Feb",
		"lapa le okuni": "Mar",
		"lapa le ong’wan": "Apr",
		"lapa le imet": "May",
		"lapa le ile": "Jun",
		"lapa le sapa": "Jul",
		"lapa le isiet": "Aug",
		"lapa le saal": "Sep",
		"lapa le tomon": "Oct",
		"lapa le tomon obo": "Nov",
		"lapa le tomon waare": "Dec",
		obo: "Jan",
		waa: "Feb",
		oku: "Mar",
		ime: "May",
		isi: "Aug",
		saa: "Sep",
		tom: "Oct",
		tob: "Nov",
		tow: "Dec",
		ᱧᱩᱦᱩᱢ: "Sa",
		ᱥᱤᱸᱜᱮ: "Su",
		ᱚᱛᱮ: "Mo",
		ᱵᱟᱞᱮ: "Tu",
		ᱥᱟᱹᱜᱩᱱ: "We",
		ᱥᱟᱹᱨᱫᱤ: "Th",
		ᱡᱟᱹᱨᱩᱢ: "Fr",
		ᱧᱩ: "Sa",
		ᱥᱤᱸ: "Su",
		ᱚᱛ: "Mo",
		ᱵᱟ: "Tu",
		ᱥᱟᱹ: "We",
		ᱥᱟᱹᱨ: "Th",
		ᱡᱟᱹ: "Fr",
		ᱡᱟᱱᱣᱟᱨᱤ: "Jan",
		ᱯᱷᱟᱨᱣᱟᱨᱤ: "Feb",
		ᱢᱟᱨᱪ: "Mar",
		ᱟᱯᱨᱮᱞ: "Apr",
		ᱢᱮ: "May",
		ᱡᱩᱱ: "Jun",
		ᱡᱩᱞᱟᱭ: "Jul",
		ᱟᱜᱟᱥᱛ: "Aug",
		ᱥᱮᱯᱴᱮᱢᱵᱟᱨ: "Sep",
		ᱚᱠᱴᱚᱵᱟᱨ: "Oct",
		ᱱᱟᱣᱟᱢᱵᱟᱨ: "Nov",
		ᱫᱤᱥᱟᱢᱵᱟᱨ: "Dec",
		ᱡᱟᱱ: "Jan",
		ᱯᱷᱟ: "Feb",
		ᱢᱟᱨ: "Mar",
		ᱟᱯᱨ: "Apr",
		ᱡᱩᱞ: "Jul",
		ᱟᱜᱟ: "Aug",
		ᱥᱮᱯ: "Sep",
		ᱚᱠᱴ: "Oct",
		ᱱᱟᱣ: "Nov",
		ᱫᱤᱥ: "Dec",
		mulungu: "Su",
		alahamisi: "Th",
		mupalangulwa: "Jan",
		mwitope: "Feb",
		mushende: "Mar",
		munyi: "Apr",
		"mushende magali": "May",
		mujimbi: "Jun",
		mushipepo: "Jul",
		mupuguto: "Aug",
		munyense: "Sep",
		mokhu: "Oct",
		musongandembwe: "Nov",
		muhaano: "Dec",
		mup: "Jan",
		mwi: "Feb",
		msh: "Mar",
		mun: "Apr",
		muj: "Jun",
		msp: "Jul",
		mpg: "Aug",
		mye: "Sep",
		mus: "Nov",
		muh: "Dec",
		sabudu: "Sa",
		dimingu: "Su",
		chiposi: "Mo",
		chinai: "Th",
		pos: "Mo",
		pir: "Tu",
		nai: "Th",
		sha: "Fr",
		fevreiro: "Feb",
		marco: "Mar",
		otubro: "Oct",
		ⴰⵙⵉⴹⵢⴰⵙ: "Sa",
		ⴰⵙⴰⵎⴰⵙ: "Su",
		ⴰⵢⵏⴰⵙ: "Mo",
		ⴰⵙⵉⵏⴰⵙ: "Tu",
		ⴰⴽⵕⴰⵙ: "We",
		ⴰⴽⵡⴰⵙ: "Th",
		ⵙⵉⵎⵡⴰⵙ: "Fr",
		ⴰⵙⵉⴹ: "Sa",
		ⴰⵙⴰ: "Su",
		ⴰⵢⵏ: "Mo",
		ⴰⵙⵉ: "Tu",
		ⴰⴽⵕ: "We",
		ⴰⴽⵡ: "Th",
		ⴰⵙⵉⵎ: "Fr",
		ⵉⵏⵏⴰⵢⵔ: "Jan",
		ⴱⵕⴰⵢⵕ: "Feb",
		ⵎⴰⵕⵚ: "Mar",
		ⵉⴱⵔⵉⵔ: "Apr",
		ⵎⴰⵢⵢⵓ: "May",
		ⵢⵓⵏⵢⵓ: "Jun",
		ⵢⵓⵍⵢⵓⵣ: "Jul",
		ⵖⵓⵛⵜ: "Aug",
		ⵛⵓⵜⴰⵏⴱⵉⵔ: "Sep",
		ⴽⵜⵓⴱⵔ: "Oct",
		ⵏⵓⵡⴰⵏⴱⵉⵔ: "Nov",
		ⴷⵓⵊⴰⵏⴱⵉⵔ: "Dec",
		ⵉⵏⵏ: "Jan",
		ⴱⵕⴰ: "Feb",
		ⵎⴰⵕ: "Mar",
		ⵉⴱⵔ: "Apr",
		ⵎⴰⵢ: "May",
		ⵢⵓⵏ: "Jun",
		ⵢⵓⵍ: "Jul",
		ⵖⵓⵛ: "Aug",
		ⵛⵓⵜ: "Sep",
		ⴽⵜⵓ: "Oct",
		ⵏⵓⵡ: "Nov",
		ⴷⵓⵊ: "Dec",
		lávurdâh: "Sa",
		pasepeivi: "Su",
		vuossargâ: "Mo",
		majebargâ: "Tu",
		koskokko: "We",
		tuorâstâh: "Th",
		vástuppeivi: "Fr",
		pas: "Su",
		vuo: "Mo",
		tuo: "Th",
		vás: "Fr",
		uđđâivemáánu: "Jan",
		kuovâmáánu: "Feb",
		njuhčâmáánu: "Mar",
		cuáŋuimáánu: "Apr",
		vyesimáánu: "May",
		kesimáánu: "Jun",
		syeinimáánu: "Jul",
		porgemáánu: "Aug",
		čohčâmáánu: "Sep",
		roovvâdmáánu: "Oct",
		skammâmáánu: "Nov",
		juovlâmáánu: "Dec",
		uđiv: "Jan",
		kuovâ: "Feb",
		njuhčâ: "Mar",
		cuáŋui: "Apr",
		vyesi: "May",
		kesi: "Jun",
		syeini: "Jul",
		porge: "Aug",
		čohčâ: "Sep",
		roovvâd: "Oct",
		skammâ: "Nov",
		juovlâ: "Dec",
		niydziela: "Su",
		pyńdziałek: "Mo",
		strzoda: "We",
		sztwortek: "Th",
		piōntek: "Fr",
		stycznia: "Jan",
		lutego: "Feb",
		marca: "Mar",
		kwietnia: "Apr",
		moja: "May",
		czyrwca: "Jun",
		lipca: "Jul",
		siyrpnia: "Aug",
		września: "Sep",
		października: "Oct",
		listopada: "Nov",
		grudnia: "Dec",
		nakasabiti: "Sa",
		nakaejuma: "Su",
		nakaebarasa: "Mo",
		nakaare: "Tu",
		nakauni: "We",
		"nakaung’on": "Th",
		nakakany: "Fr",
		bar: "Mo",
		aar: "Tu",
		uni: "We",
		ung: "Th",
		orara: "Jan",
		omuk: "Feb",
		"okwamg’": "Mar",
		"odung’el": "Apr",
		omaruk: "May",
		"omodok’king’ol": "Jun",
		ojola: "Jul",
		opedel: "Aug",
		osokosokoma: "Sep",
		otibar: "Oct",
		olabor: "Nov",
		opoo: "Dec",
		dun: "Apr",
		mod: "Jun",
		ped: "Aug",
		sok: "Sep",
		tib: "Oct",
		lab: "Nov",
		poo: "Dec",
		"suno esun #6": "Sa",
		"suno esun #7": "Su",
		"suno esun #1": "Mo",
		"suno esun #2": "Tu",
		"suno esun #3": "We",
		"suno esun #4": "Th",
		"suno esun #5": "Fr",
		"mun #1": "Jan",
		"mun #2": "Feb",
		"mun #3": "Mar",
		"mun #4": "Apr",
		"mun #5": "May",
		"mun #6": "Jun",
		"mun #7": "Jul",
		"mun #8": "Aug",
		"mun #9": "Sep",
		"mun #10": "Oct",
		"mun #11": "Nov",
		"mun #12": "Dec",
		asiḍyas: "Sa",
		asamas: "Su",
		aynas: "Mo",
		asinas: "Tu",
		akras: "We",
		akwas: "Th",
		asimwas: "Fr",
		asḍ: "Sa",
		ayn: "Mo",
		asn: "Tu",
		akr: "We",
		akw: "Th",
		asm: "Fr",
		yebrayer: "Feb",
		ibrir: "Apr",
		yulyuz: "Jul",
		cutanbir: "Sep",
		kṭuber: "Oct",
		nwanbir: "Nov",
		dujanbir: "Dec",
		ibr: "Apr",
		cut: "Sep",
		kṭu: "Oct",
		nwa: "Nov",
		duj: "Dec",
		ꔻꔬꔳ: "Sa",
		ꕞꕌꔵ: "Su",
		ꗳꗡꘉ: "Mo",
		ꕚꕞꕚ: "Tu",
		ꕉꕞꕒ: "We",
		ꕉꔤꕆꕢ: "Th",
		ꕉꔤꕀꕮ: "Fr",
		"ꖨꖕ ꕪꕴ ꔞꔀꕮꕊ": "Jan",
		ꕒꕡꖝꖕ: "Feb",
		ꕾꖺ: "Mar",
		ꖢꖕ: "Apr",
		ꖑꕱ: "May",
		ꖱꘋ: "Jun",
		ꖱꕞꔤ: "Jul",
		ꗛꔕ: "Aug",
		ꕢꕌ: "Sep",
		ꕭꖃ: "Oct",
		"ꔞꘋꕔꕿ ꕸꖃꗏ": "Nov",
		"ꖨꖕ ꕪꕴ ꗏꖺꕮꕊ": "Dec",
		ꖨꖕꔞ: "Jan",
		ꕒꕡ: "Feb",
		ꖱꕞ: "Jul",
		ꔞꘋ: "Nov",
		ꖨꖕꗏ: "Dec",
		sabo: "Sa",
		doménega: "Su",
		marti: "Tu",
		mèrcore: "We",
		zoba: "Th",
		vènare: "Fr",
		zob: "Th",
		vèn: "Fr",
		jenaro: "Jan",
		febraro: "Feb",
		jugno: "Jun",
		lujo: "Jul",
		setenbre: "Sep",
		otobre: "Oct",
		novenbre: "Nov",
		dezenbre: "Dec",
		oto: "Oct",
		esaabadu: "Sa",
		ettiminku: "Su",
		"nihiku noolempwa": "Mo",
		namaanli: "Tu",
		namararu: "We",
		namaxexe: "Th",
		namathanu: "Fr",
		janeiru: "Jan",
		fevereiru: "Feb",
		junyu: "Jun",
		julyu: "Jul",
		setembru: "Sep",
		outubru: "Oct",
		dezembru: "Dec",
		samštag: "Sa",
		sunntag: "Su",
		mäntag: "Mo",
		zištag: "Tu",
		mittwuč: "We",
		fróntag: "Th",
		fritag: "Fr",
		män: "Mo",
		ziš: "Tu",
		fró: "Th",
		jenner: "Jan",
		hornig: "Feb",
		märze: "Mar",
		abrille: "Apr",
		meije: "May",
		bráčet: "Jun",
		heiwet: "Jul",
		öigšte: "Aug",
		herbštmánet: "Sep",
		wímánet: "Oct",
		wintermánet: "Nov",
		chrištmánet: "Dec",
		hor: "Feb",
		brá: "Jun",
		hei: "Jul",
		öig: "Aug",
		her: "Sep",
		wím: "Oct",
		win: "Nov",
		chr: "Dec",
		शनिच्चरवार: "Sa",
		तोआर: "Su",
		सोआर: "Mo",
		वीरवार: "Th",
		शुक्करवार: "Fr",
		वीर: "Th",
		शुक्कर: "Fr",
		olomukaaga: "Sa",
		sabiiti: "Su",
		owokubili: "Tu",
		owokusatu: "We",
		olokuna: "Th",
		olokutaanu: "Fr",
		muka: "Sa",
		sabi: "Su",
		bala: "Mo",
		kubi: "Tu",
		kusa: "We",
		kuna: "Th",
		kuta: "Fr",
		séselé: "Sa",
		sɔ́ndiɛ: "Su",
		móndie: "Mo",
		muányáŋmóndie: "Tu",
		metúkpíápɛ: "We",
		kúpélimetúkpiapɛ: "Th",
		feléte: "Fr",
		ss: "Sa",
		sd: "Su",
		md: "Mo",
		mw: "Tu",
		kl: "Th",
		fl: "Fr",
		"pikítíkítie, oólí ú kutúan": "Jan",
		"siɛyɛ́, oóli ú kándíɛ": "Feb",
		"ɔnsúmbɔl, oóli ú kátátúɛ": "Mar",
		"mesiŋ, oóli ú kénie": "Apr",
		"ensil, oóli ú kátánuɛ": "May",
		ɔsɔn: "Jun",
		efute: "Jul",
		pisuyú: "Aug",
		"imɛŋ i puɔs": "Sep",
		"imɛŋ i putúk,oóli ú kátíɛ": "Oct",
		makandikɛ: "Nov",
		pilɔndɔ́: "Dec",
		"o\\.1": "Jan",
		"o\\.2": "Feb",
		"o\\.3": "Mar",
		"o\\.4": "Apr",
		"o\\.5": "May",
		"o\\.6": "Jun",
		"o\\.7": "Jul",
		"o\\.8": "Aug",
		"o\\.9": "Sep",
		"o\\.10": "Oct",
		"o\\.11": "Nov",
		"o\\.12": "Dec",
		saurú: "Sa",
		mituú: "Su",
		murakipí: "Mo",
		"murakí-mukũi": "Tu",
		"murakí-musapíri": "We",
		supapá: "Th",
		yukuakú: "Fr",
		sau: "Sa",
		mur: "Mo",
		mmk: "Tu",
		mms: "We",
		sup: "Th",
		yuk: "Fr",
		yepé: "Jan",
		mukũi: "Feb",
		musapíri: "Mar",
		irũdí: "Apr",
		pú: "May",
		"pú-yepé": "Jun",
		"pú-mukũi": "Jul",
		"pú-musapíri": "Aug",
		"pú-irũdí": "Sep",
		"yepé-putimaã": "Oct",
		"yepé-yepé": "Nov",
		"yepé-mukũi": "Dec",
		ye: "Jan",
		mk: "Feb",
		ms: "Mar",
		id: "Apr",
		pu: "May",
		py: "Jun",
		ps: "Aug",
		yp: "Oct",
		yy: "Nov",
		ym: "Dec",
		ⴰⵙⵉⵎⵡⴰⵙ: "Fr"
	},
	"please use ok for similar looking ko": { оff: "off" },
	"please use 24 hours time for ko": {
		pm: "pm",
		"p.m.": "pm",
		рм: "pm",
		am: "am",
		"a.m.": "am",
		ам: "am"
	},
	"please use restriction comment time for ko": {
		damen: "open \"Damen\"",
		herren: "open \"Herren\""
	},
	"please use ok for typographically correct": {
		"–": "-",
		"„": "\"",
		"“": "\"",
		"”": "\"",
		"«": "\"",
		"»": "\"",
		"‚": "\"",
		"‘": "\"",
		"’": "\"",
		"「": "\"",
		"」": "\"",
		"『": "\"",
		"』": "\""
	},
	"Ambiguous words": {
		"གཟའ་སྤེན་པ་": "Word \"གཟའ་སྤེན་པ་\" is ambiguous: Sa (Tibetan) or Fr (Dzongkha). Please specify language context or use English weekday name.",
		"གཟའ་ཉི་མ་": "Word \"གཟའ་ཉི་མ་\" is ambiguous: Su (Tibetan) or Sa (Dzongkha). Please specify language context or use English weekday name.",
		"གཟའ་ཟླ་བ་": "Word \"གཟའ་ཟླ་བ་\" is ambiguous: Mo (Tibetan) or Su (Dzongkha). Please specify language context or use English weekday name.",
		"གཟའ་མིག་དམར་": "Word \"གཟའ་མིག་དམར་\" is ambiguous: Tu (Tibetan) or Mo (Dzongkha). Please specify language context or use English weekday name.",
		"གཟའ་ལྷག་པ་": "Word \"གཟའ་ལྷག་པ་\" is ambiguous: We (Tibetan) or Tu (Dzongkha). Please specify language context or use English weekday name.",
		"གཟའ་ཕུར་བུ་": "Word \"གཟའ་ཕུར་བུ་\" is ambiguous: Th (Tibetan) or We (Dzongkha). Please specify language context or use English weekday name.",
		"གཟའ་པ་སངས་": "Word \"གཟའ་པ་སངས་\" is ambiguous: Fr (Tibetan) or Th (Dzongkha). Please specify language context or use English weekday name.",
		meurzh: "Word \"meurzh\" is ambiguous: Mar (Breton) or Tu (Breton). Please specify language context or use English month name.",
		listopad: "Word \"listopad\" is ambiguous: Nov (Czech) or Oct (Croatian) or Nov (Polish). Please specify language context or use English month name.",
		sabato: "Word \"sabato\" is ambiguous: Sa (Esperanto) or Sa (Italian) or Su (Makhuwa-Meetto). Please specify language context or use English weekday name.",
		nyakanga: "Word \"nyakanga\" is ambiguous: Sep (Rundi) or Jul (Kinyarwanda). Please specify language context or use English month name."
	}
}, ee = {
	"unexpected token": "Unexpected token: \"{{token}}\" This means that the syntax is not valid at that point or it is currently not supported.",
	"no string": "The value (first parameter) is not a string.",
	nothing: "The value contains nothing meaningful which can be parsed.",
	"nothing useful": "This rule does not contain anything useful. Please remove this empty rule.",
	"combine rules": "Separate rules detected each of which only consists of a time selector. These rules should be written as one rule by combining them using \"{{ok}}\".",
	"value ends with token": "The value ends with \"{{token}}\". Please either continue after \"{{token}}\" or remove \"{{token}}\".",
	"programmers joke": "Might it be possible that you are a programmer and adding a semicolon after each statement is hardwired in your muscle memory ;) ? The thing is that the semicolon in the opening_hours syntax is defined as rule separator. So for compatibility reasons you should omit this last semicolon.",
	"interpreted as year": "The number {{number}} will be interpreted as year. This is probably not intended. Times can be specified as \"12:00\".",
	"rule before fallback empty": "Rule before fallback rule does not contain anything useful",
	"hour min separator": "Please use \":\" as hour/minute-separator",
	"warnings severity": "The parameter optional_conf_parm[\"warnings_severity\"] must be an integer number between 0 and 7 (inclusive). Given {{severity}}, expected one of the following numbers: {{allowed}}.",
	"optional conf parm type": "The optional_conf_parm parameter is of unknown type. Given {{given}}",
	"conf param tag key missing": "The optional_conf_parm[\"tag_key\"] is missing, required by optional_conf_parm[\"map_value\"].",
	"conf param mode invalid": "The optional_conf_parm[\"mode\"] parameter is a invalid number. Gave {{given}}, expected one of the following numbers: {{allowed}}.",
	"conf param unknown type": "The optional_conf_parm[\"{{key}}\"] parameter is of unknown type. Given {{given}}, expected {{expected}}.",
	"library bug": "An error occurred during evaluation of the value \"{{value}}\". Please file a bug report or pull request: {{url}}.{{message}}",
	"library bug PR only": "An error occurred during evaluation of the value \"{{value}}\". Please submit a pull request: {{url}}.{{message}}",
	"use multi": "You have used {{count}} {{part2}} Rules can be separated by \";\".",
	"selector multi 2a": "{{what}} in one rule. You may only use one in one rule.",
	"selector multi 2b": "not connected {{what}} in one rule. This is probably an error. Equal selector types can (and should) always be written in conjunction separated by comma. Example for time ranges \"12:00-13:00,15:00-18:00\". Example for weekdays \"Mo-We,Fr\".",
	"selector state": "state keywords",
	comments: "comments",
	"holiday ranges": "holiday ranges",
	months: "months",
	weekdays: "weekdays",
	ranges: "ranges",
	"default state": "This rule which changes the default state (which is closed) for all following rules is not the first rule. The rule will overwrite all previous rules. It can be legitimate to change the default state to open for example and then only specify for which times the facility is closed.",
	vague: "This rule is not very explicit because there is no time selector being used. A time selector is the part specifying hours when the object is opened, for example \"10:00-19:00\". Please add a time selector to this rule or use a comment to make it more explicit.",
	"empty comment": "You have used an empty comment. Please either write something in the comment or use the keyword unknown instead.",
	separator_for_readability: "You have used the optional symbol <separator_for_readability> in the wrong place. Please check the syntax specification to see where it could be used or remove it.",
	"strange 24/7": "You used 24/7 in a way that is probably not interpreted as \"24 hours 7 days a week\". For correctness you might want to use \"open\" or \"closed\" for this rule and then write your exceptions which should achieve the same goal and is more clear e.g. \"open; Mo 12:00-14:00 off\".",
	"public holiday": "There was no PH (public holiday) specified. This is not very explicit.{{part2}} Please either append a \"PH off\" rule if the amenity is closed on all public holidays or use something like \"Sa,Su,PH 12:00-16:00\" to say that on Saturdays, Sundays and on public holidays the amenity is open 12:00-16:00. Be careful with opening hours like \"Fr-Sa 18:00-06:00\" because \"PH off\" applies to 00:00-24:00. So \"Fr-Sa 18:00-06:00; PH 18:00-06:00 off\" is probably what you want. If the amenity is open everyday including public holidays then you can make this explicit by writing \"Mo-Su,PH\". If you are not certain try to find it out. If you can’t then do not add PH to the value and ignore this warning.",
	"public holiday part2": " Unfortunately the tag key (e.g. \"opening_hours\", or \"lit\") is unknown to opening_hours.js. This warning only applies to the key {{keys}}. If your value is for that key than read on. If not you can ignore the following.",
	"additional_rule_separator not used after time wrapping midnight": "This rule overwrites parts of the previous rule. This happens because normal rules apply to the whole day and overwrite any definition made by previous rules. You can make this rule an additional rule by using a \",\" instead of the normal \";\" to separate the rules. Note that the overwriting can also be desirable in which case you can ignore this warning.",
	"additional rule which evaluates to closed": "This rule will be evaluated as closed but it was specified as additional rule. It should be specified as normal rule using \";\" as rule separator. See https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification#explain:rule_modifier:closed.",
	switched: "The selector \"{{first}}\" was switched with the selector \"{{second}}\" for readability and compatibility reasons.",
	"no colon after": "Please don’t use \":\" after {{token}}.",
	"number -5 to 5": "Number between -5 and 5 (except 0) expected.",
	"one weekday constraint": "You can not use more than one constrained weekday in a month range",
	"range constrained weekdays": "You can not use a range of constrained weekdays in a month range",
	expected: "\"{{symbol}}\" expected.",
	"range zero": "You can not use {{type}} ranges with period equals zero.",
	"period one year+": "Please don’t use {{type}} ranges with period equals one. If you want to express that a facility is open starting from a year without limit use \"<year>+\".",
	"period one": "Please don’t use {{type}} ranges with period equals one.",
	"month 31": "The day for {{month}} must be between 1 and 31.",
	"month 30": "Month {{month}} doesn't have 31 days. The last day of {{month}} is day 30.",
	"month feb": "Month {{month}} either has 28 or 29 days (leap years).",
	"point in time": "hyphen (-) or open end (+) in time range {{calc}}expected. For working with points in time, the mode for {{libraryname}} has to be altered. Maybe wrong tag?",
	calculation: "calculation",
	"time range continue": "Time range does not continue as expected",
	"period continue": "Time period does not continue as expected. Example \"/01:30\".",
	"time range mode": "{{libraryname}} is running in \"time range mode\". Found point in time.",
	"point in time mode": "{{libraryname}} is running in \"points in time mode\". Found time range.",
	"outside current day": "Time range starts outside of the current day",
	"two midnights": "Time spanning more than two midnights not supported",
	"without minutes": "Time range without minutes specified. Not very explicit! Please use this syntax instead \"{{syntax}}\".",
	"outside day": "Time range starts outside of the current day",
	"zero calculation": "Adding zero in a variable time calculation does not change the variable time. Please omit the calculation (example: \"sunrise-(sunset-00:00)\").",
	"calculation syntax": "Calculation with variable time is not in the right syntax",
	"time offset hours only": "Time offset must be in format HH:MM, not just hours. Did you mean \"{{suggestion}}\"?",
	missing: "Missing \"{{symbol}}\"",
	"(time)": "(time)",
	"bad range": "Bad range: {{from}}-{{to}}",
	"] or more numbers": "\"]\" or more numbers expected.",
	"additional rule no sense": "An additional rule does not make sense here. Just use a \";\" as rule separator. See https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification#explain:additional_rule_separator",
	"unexpected token weekday range": "Unexpected token in weekday range: {{token}}",
	"max differ": "There should be no reason to differ more than {{maxdiffer}} days from a {{name}}. If so tell us …",
	"adding 0": "Adding 0 does not change the date. Please omit this.",
	"unexpected token holiday": "Unexpected token (holiday parser): {{token}}",
	"no holiday definition": "There are no holidays ({{name}}) defined for country {{cc}}.",
	"no holiday definition state": "There are no holidays ({{name}}) defined for country {{cc}} and state {{state}}.",
	"no country code": "Country code missing which is needed to select the correct holidays (see README how to provide it)",
	"no SH definition": "School holiday {{name}}not defined for the year {{year}}.",
	"movable no formula": "Movable day {{name}} can not not be calculated. Please add the formula how to calculate it.",
	"movable not in year": "The movable day {{name}} plus {{days}} days is not in the year of the movable day anymore. Currently not supported.",
	"year range one year": "A year range in which the start year is equal to the end year does not make sense. Please remove the end year. E.g. \"{{year}} May 23\"",
	"year range reverse": "A year range in which the start year is greater than the end year does not make sense. Please turn it over.",
	"year past": "The year is in the past.",
	"unexpected token year range": "Unexpected token in year range: {{token}}",
	"week range reverse": "You have specified a week range in reverse order or leaping over a year. This is (currently) not supported.",
	"week negative": "You have specified a week date less then one. A valid week date range is 1-53.",
	"week exceed": "You have specified a week date greater then 53. A valid week date range is 1-53.",
	"week period less than 2": "You have specified a week period which is less than two. If you want to select the whole range from week {{weekfrom}} to week {{weekto}} then just omit the \"/{{period}}\".",
	"week period greater than 26": "You have specified a week period which is greater than 26. 26.5 is the half of the maximum 53 week dates per year so a week date period greater than 26 would only apply once per year. Please specify the week selector as \"week {{weekfrom}}\" if that is what you want to express.",
	"unexpected token week range": "Unexpected token in week range: {{token}}",
	"unexpected token month range": "Unexpected token in month range: {{token}}",
	"day range reverse": "Range in wrong order. From day is greater than to day.",
	"open end": "Specified as open end. Closing time was guessed.",
	"date parameter needed": "Date parameter needed.",
	"assuming ok for ko": "Assuming \"{{ok}}\" for \"{{ko}}\".",
	"please use ok for ko": "Please use notation \"{{ok}}\" for \"{{ko}}\".",
	"please use ok for similar looking ko": "Please use notation \"{{ok}}\" for \"{{ko}}\". Those characters look very similar but are not the same!",
	"rant degree sign used for zero": "Note that this is not a (superscript) zero but a degree sign which is misused as zero. A superscript zero is defined in Unicode (°) and would have been more appropriate/uniform here. But note that the use of none-ASCII digits is not allowed.",
	"please use English written ok for ko": "Please use the English written \"{{ok}}\" for \"{{ko}}\".",
	"please use English abbreviation ok for ko": "Please use the English abbreviation \"{{ok}}\" for \"{{ko}}\".",
	"please use English abbreviation ok for so": "Please use the English abbreviation \"{{ok}}\" for \"{{ko}}\". Note that it might also mean Saturday in Polish.",
	"please use off for ko": "Please use \"{{ok}}\" for \"{{ko}}\". Example: \"Mo-Fr 08:00-12:00; Tu off\".",
	"please use ok for workday": "Assuming \"{{ok}}\" for \"{{ko}}\". Please avoid using \"workday\": https://wiki.openstreetmap.org/wiki/Talk:Key:opening_hours#need_syntax_for_holidays_and_workingdays",
	"omit hour keyword": "Please omit \"{{ko}}\" or use a colon instead. Example: \"12:00-14:00\".",
	"omit ko": "Please omit \"{{ko}}\".",
	"omit tag key": "Please omit \"{{ko}}\". The tag key must not be in the tag value.",
	"omit wrong keyword open end": "Please omit \"{{ko}}\". The tag key must not be in the tag value.",
	"assuming open end for ko": "Assuming \"{{ok}}\" (open end time) for \"{{ko}}\". Example: \"12:00+\".",
	"please use ok for uncertainty": "Please use notation \"{{ok}}\" for \"{{ko}}\". If there is reason to suspect uncertainty consider adding a comment. Example: 12:00-14:00 \"only on sunshine\".",
	"please use fallback rule": "Please use notation \"{{ok}}\" (Fallback rule) for \"{{ko}}\". Example: Mo-Fr 12:00-14:00; PH off || \"by appointment\"",
	"please use ok for missing data": "Please consider adding a FIXME tag instead.",
	"please use 24 hours time for ko": "Please use time format in 24 hours notation instead of the legacy 12 hours variant. If the 12 hours variant is used you might have to convert the hours to the 24 hours notation.",
	"please use restriction comment time for ko": "It looks like you might want to define additional restrictions. If that is the case and they can not be expressed by other syntax elements then you could use a comment together with the `open` keyword. Example: open \"female only\"",
	"please use ok for typographically correct": "Please use notation \"{{ok}}\" for \"{{ko}}\". Although using \"{{ko}}\" is typographical correct, it is not defined in the opening_hours syntax. Correct typography should be done on application level …"
}, N = {
	en: { opening_hours: { pretty: {
		off: "closed",
		SH: "school holidays",
		PH: "public holidays"
	} } },
	de: { opening_hours: {
		texts: {
			"unexpected token": "Unerwartetes Zeichen: \"{{token}}\" Das bedeutet, dass die Syntax an dieser Stelle nicht erkannt werden konnte.",
			"no string": "Der Wert (erster Parameter) ist kein String",
			nothing: "Der Wert enthält nichts, was ausgewertet werden könnte.",
			"nothing useful": "Diese Regel enthält nichts nützliches. Bitte entferne diese leere Regel.",
			"combine rules": "Getrennte Regeln erkannt welche jeweils nur aus einer Zeit Bereichsdefinition bestehen. Diese Regeln sollten mittels \"{{ok}}\" zu einer Regel kombiniert werden.",
			"value ends with token": "Der Wert endet mit \"{{token}}\". Bitte ergänze den Wert nach \"{{token}}\" oder lösche \"{{token}}\".",
			"programmers joke": "Kann es sein, dass du ein Programmierer bist und das Hinzufügen eines Semikolons nach jedem Statement ist zwanghaft ;) ? Es ist so, dass das Semikolon in der opening_hours-Syntax als Trenner für Regeln definiert ist. Bitte verzichte an dieser Stelle auf ein Semikolon.",
			"interpreted as year": "Die Zahl {{number}} wird als Jahr interpretiert. Vermutlich ist das nicht beabsichtigt. Uhrzeiten werden als \"12:00\" angegeben.",
			"rule before fallback empty": "Die Regel vor der Fallback-Regel enthält nichts nützliches",
			"hour min separator": "Bitte benutze \":\" als Stunden/Minuten-Trenner",
			"warnings severity": "Der Parameter optional_conf_parm[\"warnings_severity\"] muss eine ganze Zahl zwischen (einschließlich) 0 und (einschließlich) 7 sein. Gegeben: {{severity}}, erwartet: Eine der Zahlen: {{allowed}}.",
			"optional conf parm type": "Der optional_conf_parm Parameter hat einen unbekannten Typ. Gegeben: {{given}}",
			"conf param tag key missing": "Der optional_conf_parm[\"tag_key\"] fehlt, ist aber notwendig wegen optional_conf_parm[\"map_value\"].",
			"conf param mode invalid": "Der optional_conf_parm[\"mode\"]-Parameter ist eine ungültige Zahl. Gegeben: {{given}}, erwartet: Eine der Zahlen: {{allowed}}.",
			"conf param unknown type": "Der optional_conf_parm[\"{{key}}\"] Parameter hat einen unbekannten Typ. Gegeben: {{given}}, erwartet: {{expected}}.",
			"library bug": "Bei der Auswertung des Wertes \"{{value}}\" ist ein Fehler aufgetreten. Bitte melde diesen Fehler oder korrigiere diesen mittels eines Pull Requests oder Patches: {{-url}}.{{message}}",
			"library bug PR only": "Bei der Auswertung des Wertes \"{{value}}\" ist ein Fehler aufgetreten. Du kannst dies korrigieren, indem du das Problem löst und in Form eines Pull Requests oder Patches zum Projekt beiträgst: {{-url}}.{{message}}",
			"use multi": "Du hast {{count}} {{-part2}} Einzelne Regeln können mit \";\" getrennt werden.",
			"selector multi 2a": "{{what}} in einer Regel benutzt. Du kannst nur einen davon je Regel verwenden",
			"selector multi 2b": "nicht verbundene {{what}} in einer Regel benutzt. Das ist vermutlich ein Fehler. Gleiche Selektoren können (und sollten) immer zusammen und durch Kommas getrennt geschrieben werden. Beispiel für Zeitspannen \"12:00-13:00,15:00-18:00\". Beispiel für Wochentage \"Mo-We,Fr\".",
			"selector state": "Status-Schlüsselwörter (offen, geschlossen)",
			comments: "Kommentare",
			months: "Monate",
			weekdays: "Wochentage",
			ranges: "Zeitspannen",
			"default state": "Diese Regel, welche den Standard-Status (d.h. geschlossen) für alle folgenden Regeln ändert, ist nicht die erste Regel. Diese Regel überschreibt alle vorherigen Regeln. Es kann legitim sein, den Standard-Status z.B. auf geöffnet festzulegen und dann nur die Zeiten, zu denen geschlossen ist, anzugeben.",
			vague: "Diese Regel ist nicht sehr aussagekräftig, da kein Zeit Selektor angegeben wurde. Ein Zeit Selektor ist die Komponente die angibt, zu welcher Tageszeit ein Objekt geöffnet hat, zum Beispiel \"10:00-19:00\". Bitte füge eine Zeitangabe oder einen Kommentar hinzu, um dies zu verbessern.",
			"empty comment": "Du hast einen leeren Kommentar verwendet.\" Bitte schreibe entweder einen Kommentar-Text oder benutze stattdessen das Schlüsselwort \"unknown\".",
			separator_for_readability: "Du hast das optionale Symbol <separator_for_readability> an der falschen Stelle benutzt. Bitte lies die Syntax-Spezifikation um zu sehen, wo es verwendet werden kann, oder entferne es.",
			"strange 24/7": "Du hast 24/7 in einer Art verwendet, welche wahrscheinlich nicht als \"24 Stunden, 7 Tage die Woche\" interpretiert wird. Der Richtigkeit halber solltest du \"open\" oder \"closed\" für diese Regel verwenden und dann die Ausnahmen angeben um das selbe Ziel zu erreichen. So ist es klarer – zum Beispiel \"open; Mo 12:00-14:00 off\".",
			"public holiday": "Es wurde keine Regel für \"PH\" (feiertags) angegeben. Dies ist nicht sehr aussagekräftig.{{-part2}} Bitte füge die Regel \"PH off\" an, wenn die Einrichtung an allen Feiertagen geschlossen ist oder schreibe \"Sa,Su,PH 12:00-16:00\" um auszudrücken, dass Samstags, Sonntags und feiertags von 12:00-16:00 geöffnet ist. Bei einer Öffnungszeit wie \"Fr-Sa 18:00-06:00\" ist Vorsicht geboten, da \"PH off\" auf 00:00-24:00 zutrifft. Hier kann \"Fr-Sa 18:00-06:00; PH 18:00-06:00 off\" verwendet werden. Falls die Einrichtung täglich und an Feiertagen geöffnet ist, kann dies explizit mittels \"Mo-Su,PH\" ausgedrückt werden. Wenn du dir im Unklaren bist, versuche die Öffnungszeit zu klären. Falls das nicht möglich ist, lass die Angabe weg und ignoriere diese Warnung.",
			"public holiday part2": " Leider ist der \"tag key\" (beispielsweise \"opening_hours\", oder \"lit\") in opening_hours.js nicht bekannt. Diese Warnung betrifft nur die Keys: {{keys}}. Falls deine Angabe nicht für einen dieser ist, ignoriere bitte folgenden Hinweis:",
			"additional_rule_separator not used after time wrapping midnight": "Diese Regel überschreibt Teile der vorherigen Regel. Der Grund dafür ist, dass normale Regeln auf den ganzen Tag zutreffen und alle Definitionen von vorhergehenden Regeln für diesen Tag überschreiben. Du kannst diese Regel als additive Regel deklarieren indem du ein \",\" anstelle des üblichen \";\" für diese Regel verwendest. Beachte das die Überschreibung auch gewünscht sein kann und in so einem Fall diese Warnung ignoriert werden kann.",
			"additional rule which evaluates to closed": "Diese Regel wird als geschlossen ausgewertet aber wurde als additive Regel angegeben. Sie sollte als normale Regel mittels \";\" definiert sein. Siehe https://wiki.openstreetmap.org/wiki/DE:Key:opening_hours/specification#explain:rule_modifier:closed.",
			switched: "Der Selektor \"{{first}}\" wurde für eine bessere Lesbarkeit und der Vollständigkeit halber mit \"{{second}}\" getauscht.",
			"no colon after": "Bitte Benutze kein \":\" nach dem Token {{token}}.",
			"number -5 to 5": "Zahl zwischen -5 und 5 (außer 0) erwartet.",
			"one weekday constraint": "Du kannst höchstens einen beschränkten Wochentag in einer Monats-Spanne verwenden",
			"range constrained weekdays": "Du kannst keine Wochentags-Spanne als Beschränkung in einer Monats-Spanne verwenden",
			expected: "\"{{-symbol}}\" erwartet.",
			"range zero": "Du kannst keine {{type}}-Spanne mit Periode \"0\" verwenden.",
			"period one year+": "Bitte verwende keine {{type}}-Spannen mit Periode \"1\". Wenn du ausdrücken willst, das eine Einrichtung ab einem bestimmten Jahr immer offen ist, benutze bitte \"<year>+\".",
			"period one": "Bitte verwende keine {{type}}-Spannen mit Periode \"1\".",
			"month 31": "Die Tagesangabe für {{month}} muss zwischen 1 und 31 liegen.",
			"month 30": "Der Monat {{month}} hat keine 31 Tage. Der letzte Tag von {{month}} ist Tag 30.",
			"month feb": "\"Der Monat {{month}} hat entweder 28 oder 29 Tage (Schaltjahre).\"",
			"point in time": "Erwarte Bindestrich (-) oder offenes Ende (+) in der Zeitspanne {{calc}}. Um mit Zeitpunkten zu arbeiten, muss der Modus für  {{libraryname}} umgestellt werden. Vielleicht falsches OSM-tag verwendet?",
			calculation: "Berechnung",
			"time range continue": "Die Zeitspanne geht nicht wie erwartet weiter",
			"period continue": "Die Zeitspannen-Periode geht nicht wie erwartet weiter. Beispiel \"/01:30\".",
			"time range mode": "{{libraryname}} wurde im \"Zeitspannen-Modus\" aufgerufen. Zeitpunkt gefunden.",
			"time ranges": "Zeitspannen",
			"holiday ranges": "Feiertagen",
			"point in time mode": "{{libraryname}} wurde im \"Zeitpunkt-Modus\" aufgerufen. Zeitspanne gefunden.",
			"outside current day": "Zeitspanne beginnt außerhalb des aktuellen Tages",
			"two midnights": "Zeitspanne welche mehrmals Mitternacht beinhaltet wird nicht unterstützt",
			"without minutes": "Zeitspanne ohne Minutenangabe angegeben. Das ist nicht sehr eindeutig! Bitte verwende stattdessen folgende Syntax \"{{syntax}}\".",
			"outside day": "Die Zeitspanne beginnt außerhalb des aktuellen Tages",
			"zero calculation": "Das Hinzufügen von 0 in einer variablen Zeitberechnung ändert die variable Zeit nicht. Bitte entferne die Zeitberechnung (Beispiel: \"sunrise-(sunset-00:00)\").",
			"calculation syntax": "Berechnung mit variabler Zeit hat nicht die korrekte Syntax",
			"time offset hours only": "Zeitversatz muss im Format HH:MM angegeben werden, nicht nur Stunden. Meintest du \"{{suggestion}}\"?",
			missing: "Fehlendes \"{{symbol}}\"",
			"(time)": "(Zeit)",
			"bad range": "Ungültige Zeitspanne: {{from}}-{{to}}",
			"] or more numbers": "\"]\" oder weitere Zahlen erwartet.",
			"additional rule no sense": "Eine weitere Regel an dieser Stelle ergibt keinen Sinn. Benutze einfach \";\" als Trenner für Regeln. Siehe https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification#explain:additional_rule_separator",
			"unexpected token weekday range": "Unerwartes Token in Tages-Spanne: {{token}}",
			"max differ": "Es sollte keinen Grund geben, mehr als {{maxdiffer}} Tage von einem {{name}} abzuweichen. Wenn nötig, teile uns dies bitte mit …",
			"adding 0": "Addition von 0 verändert das Datum nicht. Bitte weglassen.",
			"unexpected token holiday": "Unerwarteter Token (in Feiertags-Auswertung): {{token}}",
			"no holiday definition": "{{name}} ist für das Land {{cc}} nicht definiert.",
			"no holiday definition state": "{{name}} ist für das Land {{cc}} und Bundesland {{state}} nicht definiert.",
			"no country code": "Der Ländercode fehlt. Dieser wird benötigt um die korrekten Feiertage zu bestimmen (siehe in der README wie dieser anzugeben ist)",
			"no SH definition": "Die Schulferien {{name}}sind für das Jahr {{year}} nicht definiert",
			"movable no formula": "Der bewegliche Feiertag {{name}} kann nicht berechnet werden. Bitte füge eine entsprechende Formel hinzu.",
			"movable not in year": "Der bewegliche Feiertag {{name}} plus {{days}} Tage befindet sich nicht mehr im selben Jahr. Aktuell nicht unterstützt.",
			"year range one year": "Eine Jahres-Spanne mit gleichem Jahr als Beginn und Ende ergibt keinen Sinn. Bitte entferne das Ende-Jahr. zum Beispiel: \"{{year}} May 23\"",
			"year range reverse": "Eine Jahres-Spanne mit Beginn größer als Ende ergibt keinen Sinn. Bitte umdrehen.",
			"year past": "Das Jahr liegt in der Vergangenheit.",
			"unexpected token year range": "Unerwartetes Token in der Jahres-Spanne: {{token}}",
			"week range reverse": "Du hast eine Wochen-Spanne in umgekehrter Reihenfolge oder mehrere Jahre umfassende angegeben. Dies ist aktuell nicht unterstützt.",
			"week negative": "Du hast eine Kalenderwoche kleiner 1 angegeben. Korrekte Angaben sind 1-53.",
			"week exceed": "Du hast eine Kalenderwoche größer als 53 angegeben. Korrekte Angaben sind 1-53.",
			"week period less than 2": "Du hast eine Wochenperiode kleiner 2 angegeben. Wenn du die gesamte Spanne von {{weekfrom}} bis {{weekto}} angeben willst, lasse \"/{{period}}\" einfach weg.",
			"week period greater than 26": "Du hast eine Wochen-Periode größer als 26 angegeben. 26,5 ist die Hälfte des Maximums von 53 Wochen pro Jahr. Damit würde eine Periode größer als 26 nur einmal pro Jahr auftreten. Bitte gibt den Wochen-Selektor als \"week {{weekfrom}}\" an, wenn es das ist, was du ausdrücken möchtest.",
			"unexpected token week range": "Unerwartetes Token in Wochen-Spanne: {{token}}",
			"unexpected token month range": "Unerwartetes Token in Monats-Spanne: {{token}}",
			"day range reverse": "Zeitspanne in falscher Reihenfolge. Beginn ist größer als Ende.",
			"open end": "Angegeben als \"open end\". Schließzeit wurde geraten.",
			"date parameter needed": "Datumsparameter nötig.",
			"assuming ok for ko": "\"{{ko}}\" wird als \"{{ok}}\" interpretiert.",
			"please use ok for ko": "Bitte verwende \"{{-ok}}\" anstelle von \"{{-ko}}\".",
			"please use ok for similar looking ko": "Please use notation \"{{ok}}\" for \"{{ko}}\". Those characters look very similar but are not the same!",
			"rant degree sign used for zero": "Beachte das dies ein Gradzeichen ist, welches als (hochgestellte) Null missbraucht wurde. Eine hochgestellte Null ist in Unicode definiert (°) und wäre angebrachter/einheitlicher an dieser Stelle. Allerdings ist die Verwendung von nicht ASCII Ziffern nicht erlaubt.",
			"please use English written ok for ko": "Bitte benutze die englische Schreibweise \"{{ok}}\" für \"{{ko}}\".",
			"please use English abbreviation ok for ko": "Bitte benutze die englische Abkürzung \"{{ok}}\" für \"{{ko}}\".",
			"please use English abbreviation ok for so": "Bitte benutze die englische Abkürzung \"{{ok}}\" für \"{{ko}}\". Beachte das Samstag in Polnisch gemeint sein kann.",
			"please use off for ko": "Bitte benutze \"{{ok}}\" für \"{{ko}}\". Beispiel: \"Mo-Fr 08:00-12:00; Tu off\".",
			"please use ok for workday": "\"{{ko}}\" wird als \"{{ok}}\" interpretiert. Werktag sollte nicht verwendet werden. Siehe https://wiki.openstreetmap.org/wiki/Talk:Key:opening_hours#need_syntax_for_holidays_and_workingdays",
			"omit hour keyword": "Bitte lasse \"{{ko}}\" weg oder verwende einen Doppelpunkt. Beispiel: \"12:00-14:00\".",
			"omit ko": "Bitte verzichte auf \"{{ko}}\".",
			"omit tag key": "Bitte lasse \"{{ko}}\" weg. Der Tag Schlüssel darf nicht im Tag Wert sein.",
			"omit wrong keyword open end": "Bitte lasse \"{{ko}}\" weg. Falls du \"open end\" ausdrücken möchtest verwende bitte ein \"+\". Beispiel: \"12:00+\".",
			"assuming open end for ko": "\"{{ko}}\" wird als \"{{ok}}\" (\"open end\") interpretiert. Example: \"12:00+\".",
			"please use ok for uncertainty": "Bitte verwende \"{{ok}}\" für \"{{ko}}\". Falls der begründete Verdacht der Ungewissheit vorliegt ziehe die Verwendung eines Kommentars in Betracht. Beispiel: 12:00-14:00 \"only on sunshine\".",
			"please use fallback rule": "Bitte verwende \"{{ok}}\" (Fallback Regel) für \"{{ko}}\". Beispiel: Mo-Fr 12:00-14:00; PH off || \"nach Vereinbarung\"",
			"please use ok for missing data": "Bitte verwende eine FIXME Notiz.",
			"please use 24 hours time for ko": "Bitte verwende 24 Stunden Zeitangaben anstelle der veralteten 12 Stunden Variante. Falls die 12 Stunden Variante verwendet wird ist eventuelle eine Konvertierung notwendig.",
			"please use restriction comment time for ko": "Es sieht so aus also möchtest du zusätzliche Einschränkungen für eine Öffnungszeit geben. Falls sich dies nicht mit der Syntax ausdrücken lässt können Kommentare verwendet werden. Zusätzlich sollte eventuell das Schlüsselwort `open` benutzt werden. Beispiel: open \"Nur Frauen\".",
			"please use ok for typographically correct": "Bitte verwende \"{{-ok}}\" für \"{{ko}}\". Auch wenn \"{{ko}}\" typografisch korrekt ist, ist dies in der opening_hours Syntax nicht definiert. Korrekte Typographie sollte auf Anwendungsebene sichergestellt werden …"
		},
		pretty: {
			off: "geschlossen",
			SH: "Schulferien",
			PH: "Feiertags"
		}
	} },
	eo: { opening_hours: {
		texts: {
			"assuming ok for ko": "\"{{ko}}\" estas interpretita kiel \"{{ok}}\".",
			"please use ok for ko": "Bonvolu uzi la esprimon \"{{-ok}}\" anstataŭ \"{{ko}}\".",
			"please use English abbreviation ok for ko": "Bonvolu uzi la anglan mallongigon \"{{ok}}\" für \"{{ko}}\"."
		},
		pretty: {
			off: "fermita",
			SH: "lernejaj ferioj",
			PH: "festotagoj"
		}
	} },
	fi: { opening_hours: { pretty: {
		off: "suljettu",
		SH: "koululomat",
		PH: "lailliset vapaapäivät"
	} } },
	fr: { opening_hours: {
		texts: {
			"assuming ok for ko": "suppose \"{{ok}}\" pour \"{{ko}}\".",
			"please use ok for ko": "S'il vous plaît utilisez \"{{ok}}\" pour \"{{ko}}\".",
			"please use English abbreviation ok for ko": "S'il vous plaît utiliseé l'abréviation \"{{ok}}\" pour \"{{ko}}\"."
		},
		pretty: {
			off: "fermé",
			SH: "vacances scolaires",
			PH: "jours fériés"
		}
	} },
	nl: { opening_hours: {
		texts: { "please use English abbreviation ok for ko": "Neem de engelse afkorting \"{{ok}}\" voor \"{{ko}}\" alstublieft." },
		pretty: {
			off: "gesloten",
			SH: "schoolvakantie",
			PH: "feestdagen"
		}
	} },
	ru: { opening_hours: { pretty: {
		off: "закрыто",
		SH: "каникулы",
		PH: "праздник"
	} } },
	it: { opening_hours: { pretty: {
		off: "chiuso",
		SH: "festività scolastiche",
		PH: "festività"
	} } }
};
N.en, N.de, N.eo, N.fi, N.fr, N.nl, N.ru, N.it;
var P = N, F = {
	language: "en",
	isInitialized: !0,
	t: function(e, t) {
		return this._translate(this.language, e, t);
	},
	getFixedT: function(e) {
		let t = this;
		return function(n, r) {
			return t._translate(e, n, r);
		};
	},
	_translate: function(e, t, n) {
		let r = Array.isArray(t) ? t : [t];
		for (let t of r) {
			let r = t.split(":"), i = r.length > 1 ? r[0] : "opening_hours", a = r.length > 1 ? r[1] : r[0], o = this._getNestedValue(P, [
				e,
				i,
				...a.split(".")
			]);
			if (o !== void 0) return typeof o == "string" && n ? o.replace(/{{-?([^{}]*)}}/g, function(e, t) {
				let r = t.trim();
				return n[r] === void 0 ? e : n[r];
			}) : o;
		}
		let i = r[r.length - 1];
		return i.includes(":") ? i.split(":")[1] : i;
	},
	_getNestedValue: function(e, t) {
		let n = e;
		for (let e of t) {
			if (n == null) return;
			n = n[e];
		}
		return n;
	}
};
function I(e, t, n) {
	let r = {
		dawn: 330,
		sunrise: 360,
		sunset: 1080,
		dusk: 1110
	}, i = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	], a = [
		"Su",
		"Mo",
		"Tu",
		"We",
		"Th",
		"Fr",
		"Sa"
	], o = {
		su: [0, "weekday"],
		mo: [1, "weekday"],
		tu: [2, "weekday"],
		we: [3, "weekday"],
		th: [4, "weekday"],
		fr: [5, "weekday"],
		sa: [6, "weekday"],
		jan: [0, "month"],
		feb: [1, "month"],
		mar: [2, "month"],
		apr: [3, "month"],
		may: [4, "month"],
		jun: [5, "month"],
		jul: [6, "month"],
		aug: [7, "month"],
		sep: [8, "month"],
		oct: [9, "month"],
		nov: [10, "month"],
		dec: [11, "month"],
		day: ["day", "calcday"],
		days: ["days", "calcday"],
		sunrise: ["sunrise", "timevar"],
		sunset: ["sunset", "timevar"],
		dawn: ["dawn", "timevar"],
		dusk: ["dusk", "timevar"],
		easter: ["easter", "event"],
		week: ["week", "week"],
		open: ["open", "state"],
		closed: ["closed", "state"],
		off: ["off", "state"],
		unknown: ["unknown", "state"]
	}, s = {
		zero_pad_hour: !0,
		one_zero_if_hour_zero: !1,
		leave_off_closed: !0,
		keyword_for_off_closed: "off",
		rule_sep_string: " ",
		print_semicolon: !0,
		leave_weekday_sep_one_day_betw: !0,
		sep_one_day_between: ",",
		zero_pad_month_and_week_numbers: !0,
		locale: "en",
		date_format: "short"
	}, c = {
		opening_hours: {
			mode: 0,
			warn_for_PH_missing: !0
		},
		collection_times: { mode: 2 },
		"opening_hours:.+": { mode: 0 },
		".+:opening_hours": { mode: 0 },
		".+:opening_hours:.+": { mode: 0 },
		smoking_hours: { mode: 0 },
		service_times: { mode: 2 },
		happy_hours: { mode: 0 },
		lit: {
			mode: 0,
			map: {
				yes: "sunset-sunrise open \"specified as yes: At night (unknown time schedule or daylight detection)\"",
				automatic: "unknown \"specified as automatic: When someone enters the way the lights are turned on.\"",
				no: "off \"specified as no: There are no lights installed.\"",
				interval: "unknown \"specified as interval\"",
				limited: "unknown \"specified as limited\""
			}
		}
	}, l = 1440, u = 1e3 * 60 * l, d = "opening_hours.js", f = "en";
	f = F.language;
	let p = function(e, t) {
		if (typeof f == "string" && ["de"].indexOf(f) !== -1) {
			let n;
			return n = F.language === f ? F.t : F.getFixedT(f), n("opening_hours:texts." + e, t);
		}
		let n = ee[e];
		return n === void 0 && (n = e), n.replace(/{{([^{}]*)}}/g, function(e, n) {
			return t[n] === void 0 ? e : t[n];
		});
	}, m, h, g, _;
	if (typeof t == "object" && t) typeof t.address == "object" && (typeof t.address.country_code == "string" && (m = t.address.country_code), typeof t.address.state == "string" ? h = t.address.state : typeof t.address.county == "string" && (h = t.address.county)), typeof t.lon == "string" && typeof t.lat == "string" && (g = t.lat, _ = t.lon);
	else if (t === null) m = "de", h = "Baden-Württemberg", g = "49.5400039", _ = "9.7937133";
	else if (t !== void 0) throw "The nominatim_object parameter is of unknown type. Given " + typeof t + ", expected object.";
	let v = 4, y, b = !1, x, S;
	if (typeof n == "number") y = n;
	else if (typeof n == "object") {
		if (typeof n.locale == "string" && (f = n.locale.split("-")[0]), B("mode", "number") && (y = n.mode), B("warnings_severity", "number") && (v = n.warnings_severity, [
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			7
		].indexOf(v) === -1)) throw p("warnings severity", {
			severity: v,
			allowed: "[ 0, 1, 2, 3, 4, 5, 6, 7 ]"
		});
		B("tag_key", "string") && (x = n.tag_key), B("map_value", "boolean") && (b = n.map_value);
	} else if (n !== void 0) throw p("optional conf parm type", { given: typeof n });
	if (typeof x == "string") S = z(x), b && typeof c[S] == "object" && typeof c[S].map == "object" && typeof c[S].map[e] == "string" && (e = c[S].map[e]);
	else if (b) throw p("conf param tag key missing");
	if (y === void 0) y = typeof x == "string" && c[S] !== void 0 && typeof c[S].mode == "number" ? c[S].mode : 0;
	else if ([
		0,
		1,
		2
	].indexOf(y) === -1) throw p("conf param mode invalid", {
		given: y,
		allowed: "[ 0, 1, 2 ]"
	});
	if (typeof e != "string") throw p("no string");
	if (/^(?:\s*;?)+$/.test(e)) throw p("nothing");
	let C = [], w = !1, T = !1, E = !1;
	var D = te(e);
	let O = "", k = !0, N, P, I = [], L = {}, R = [];
	for (P = 0; P < D.length; P++) {
		if (D[P][0].length === 0) {
			C.push([
				P,
				-1,
				p("nothing useful") + (P === D.length - 1 && P > 0 && !D[P][1] ? " " + p("programmers joke") : "")
			]);
			continue;
		}
		let e = 0, t = !1;
		do {
			if (e === D[P][0].length) break;
			if (N = {
				time: [],
				wraptime: [],
				weekday: [],
				holiday: [],
				week: [],
				month: [],
				monthday: [],
				year: [],
				date: [],
				fallback: D[P][1],
				additional: !!e,
				meaning: !0,
				unknown: !1,
				comment: void 0,
				build_from_token_rule: void 0
			}, N.build_from_token_rule = [
				P,
				e,
				R.length
			], e = ce(D[P][0], e, N, P), e = typeof e == "object" ? e[0] : 0, R.push([
				D[P][0].slice(N.build_from_token_rule[1], e === 0 ? D[P][0].length : e),
				D[P][1],
				D[P][2]
			]), t && R.length > 1 && R[R.length - 1][0].unshift(R[R.length - 2][0].pop()), t = e !== 0, [
				"year",
				"holiday",
				"month",
				"monthday",
				"week",
				"weekday"
			].forEach(function(e) {
				N[e].length > 0 && (N.date.push(N[e]), N[e] = []);
			}), I.push(N), N.wraptime.length > 0) {
				let e = {
					time: N.wraptime,
					date: [],
					meaning: N.meaning,
					unknown: N.unknown,
					comment: N.comment,
					wrapped: !0,
					build_from_token_rule: N.build_from_token_rule
				};
				for (let t = 0; t < N.date.length; t++) {
					e.date.push([]);
					for (let n = 0; n < N.date[t].length; n++) e.date[e.date.length - 1].push(se(N.date[t][n], -864e5));
				}
				I.push(e);
			}
		} while (e);
	}
	function z(e) {
		let t, n = !1;
		return Object.keys(c).forEach(function(r) {
			n !== !0 && (e === r ? (t = r, n = !0) : new RegExp(r).test(e) && (t = r));
		}), t;
	}
	function B(e, t) {
		if (typeof n[e] === t) return !0;
		if (n[e] !== void 0) throw p("conf param unknown type", {
			key: e,
			given: typeof n[e],
			expected: t
		});
		return !1;
	}
	function V(t, n, r, i) {
		if (i === void 0 && (i = D), typeof t == "number") {
			let a = 0;
			return t === -1 ? a = e.length - n : i[t][0][n] === void 0 ? i[t][0] !== void 0 && n === -1 ? (a = e.length, typeof i[t + 1] == "object" && typeof i[t + 1][2] == "number" ? a -= i[t + 1][2] : typeof i[t][2] == "number" && (a -= i[t][2])) : (H("Bug in warning generation code which could not determine the exact position of the warning or error in value."), a = e.length, typeof i[t][2] == "number" ? (a -= i[t][2], console.warn("Last token for rule: " + JSON.stringify(i[t]))) : console.warn("tokens_to_use[nrule][2] is undefined. This is ok if nrule is the last rule.")) : (a = e.length, typeof i[t][0][n + 1] == "object" ? a -= i[t][0][n + 1][2] : typeof i[t][2] == "number" && (a -= i[t][2])), e.substring(0, a) + " <--- (" + r + ")";
		} else if (typeof t == "string") return t.substring(0, n) + " <--- (" + r + ")";
	}
	function H(t, n) {
		return t = t === void 0 ? "" : " " + t, typeof n != "string" && (n = "library bug"), t = p(n, {
			value: e,
			url: "https://github.com/opening-hours/opening_hours.js",
			message: t
		}), console.error(t), t;
	}
	function te(e) {
		let t = /^([^\s\d\p{P}\p{S}\p{C}]{2,})(?=\s|$|[\s\d\p{P}\p{S}\p{C}])((?:[.]| before| after)?)/iu, n = [], r = [], i = !1;
		for (; e !== "";) {
			let a = e.match(t), s;
			if (a && a[2] === "" && (s = o[a[1].toLowerCase()]), typeof s == "object") r.push(s.concat([e.length])), e = e.substr(a[1].length);
			else if (a = e.match(/^\s+/)) e = e.substr(a[0].length);
			else if (a = e.match(/^24\/7/)) r.push([
				a[0],
				a[0],
				e.length
			]), e = e.substr(a[0].length);
			else if (/^;/.test(e)) n.push([
				r,
				i,
				e.length
			]), e = e.substr(1), r = [], i = !1;
			else if (/^[:.]/.test(e)) e[0] === "." && !w && C.push([
				-1,
				e.length - 1,
				p("hour min separator")
			]), r.push([
				":",
				"timesep",
				e.length
			]), e = e.substr(1);
			else if (a = e.match(/^(?:PH|SH)/i)) r.push([
				a[0].toUpperCase(),
				"holiday",
				e.length
			]), e = e.substr(2);
			else if (a = e.match(/^[°\u2070-\u209F\u00B2\u00B3\u00B9]{1,2}/)) {
				let t = {
					176: 0,
					8304: 0,
					185: 1,
					178: 2,
					179: 3
				}, n = a[0].split("").map(function(e) {
					let n = e.charCodeAt(0);
					if (typeof t[n] == "number") return t[n];
					if (8308 <= n && n <= 8313) return n - 8304;
					if (8320 <= n && n <= 8329) return n - 8320;
				}).join(""), i = "";
				if (r.length > 0 && U(r, r.length - 1, "number") && (i += ":"), i += n, !w) {
					for (let t = 0; t <= a[0].length; t++) e.charCodeAt(t) === 176 && C.push([
						-1,
						e.length - (1 + t),
						p("rant degree sign used for zero")
					]);
					C.push([
						-1,
						e.length - a[0].length,
						p("please use ok for ko", {
							ko: a[0],
							ok: i
						})
					]);
				}
				e = i + e.substr(a[0].length);
			} else if (a = e.match(/^(&|_|→|–|−|—|ー|=|·|öffnungszeit(?:en)?:?|opening_hours\s*=|\?|~|～|：|always (?:open|closed)|24x7|24 hours 7 days a week|24 hours|7 ?days(?:(?: a |\/)week)?|7j?\/7|all days?|every day|(?:bis|till?|-|–)? ?(?:open ?end|late)|(?:(?:one )?day (?:before|after) )?(?:school|public) holidays?|days(?=\s|$|[^\p{L}_])|до|рм|ам|jours fériés|on work days?|sonntags?|(?:nur |an )?sonn-?(?:(?: und |\/)feiertag(?:s|en?)?)?|(?:an )?feiertag(?:s|en?)?|(?:nach|on|by) (?:appointments?|vereinbarung|absprache)|p\.m\.|a\.m\.|(?:[^\s\d\p{P}\p{S}\p{C}]|_)+(?=\s|$|[\s\d\p{Po}\p{Ps}\p{Pe}\p{Pd}\p{Pf}\p{Pi}\p{S}\p{C}])|à|á|mo|tu|we|th|fr|sa|su|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(\.?)/iu)) {
				let t = ne(a[1].toLowerCase(), e.length);
				if (typeof t == "object") r.push([
					t[0],
					t[1],
					e.length
				]), e = e.substr(a[0].length);
				else if (typeof t == "string") {
					if (t === "am" || t === "pm") {
						let e = r.length - 1, n;
						e >= 0 && (e - 2 >= 0 && U(r, e - 2, "number", "timesep", "number") ? (e -= 2, n = r[e]) : U(r, e, "number") && (n = r[e]), typeof n == "object" && (t === "pm" && n[0] < 12 && (n[0] += 12), t === "am" && n[0] === 12 && (n[0] = 0), r[e] = n)), t = "";
					}
					let n = te(t)[0];
					if (n[1] === !0) throw H();
					for (let t = 0; t < n[0].length; t++) r.push([
						n[0][t][0],
						n[0][t][1],
						e.length
					]);
					e = e.substr(a[0].length);
				} else r.push([
					e[0].toLowerCase(),
					e[0].toLowerCase(),
					e.length - 1
				]), e = e.substr(1);
				typeof a[2] == "string" && a[2] !== "" && !w && C.push([
					-1,
					e.length,
					p("omit ko", { ko: a[2] })
				]);
			} else if (a = e.match(/^(\d+)(?:([.])([^\d]))?/)) Number(a[1]) > 1900 ? (r.push([
				Number(a[1]),
				"year",
				e.length
			]), Number(a[1]) >= 2100 && C.push([
				-1,
				e.length - 1,
				p("interpreted as year", { number: Number(a[1]) })
			])) : r.push([
				Number(a[1]),
				"number",
				e.length
			]), e = e.substr(a[1].length + (typeof a[2] == "string" ? a[2].length : 0)), typeof a[2] == "string" && a[2] !== "" && !w && C.push([
				-1,
				e.length,
				p("omit ko", { ko: a[2] })
			]);
			else if (/^\|\|/.test(e)) {
				if (r.length === 0) throw V(-1, e.length - 2, p("rule before fallback empty"));
				n.push([
					r,
					i,
					e.length
				]), r = [], e = e.substr(2), i = !0;
			} else if (a = e.match(/^"([^"]+)"/)) r.push([
				a[1],
				"comment",
				e.length
			]), e = e.substr(a[0].length);
			else if (a = e.match(/^(["'„“‚‘’«「『])([^"'“”‘’»」』;|]*)(["'”“‘’»」』])/)) {
				for (let t = 1; t <= 3; t += 2) if (typeof ne(a[t], e.length - (t === 3 ? a[1].length + a[2].length : 0)) != "string" && a[t] !== "\"") throw H("A character for error tolerance was allowed in the regular expression but is not covered by word_error_correction which is needed to format a proper message for the user.");
				r.push([
					a[2],
					"comment",
					e.length
				]), e = e.substr(a[0].length);
			} else /^(?:␣|\s)/.test(e) || r.push([
				e[0].toLowerCase(),
				e[0].toLowerCase(),
				e.length
			]), e = e.substr(1);
		}
		return n.push([r, i]), n;
	}
	function ne(e, t) {
		let n, r = o[e];
		if (typeof r == "object") return r;
		if (M["Ambiguous words"] && M["Ambiguous words"][e]) {
			if (!w) {
				let n = M["Ambiguous words"][e];
				C.push([
					-1,
					t - e.length,
					n
				]);
			}
			let n = M["Ambiguous words"][e].match(/: (\w+) \(/);
			return n && n[1] ? n[1] : void 0;
		}
		return Object.keys(M).forEach(function(r) {
			n || r !== "Ambiguous words" && Object.keys(M[r]).forEach(function(i) {
				if (!n && RegExp("^" + i + "$").test(e)) {
					let a = M[r][i];
					if (!w) {
						let n = p(r, {
							ko: e,
							ok: a
						});
						C.push([
							-1,
							t - e.length,
							n
						]);
					}
					n = a;
				}
			});
		}), n;
	}
	function re(e) {
		if (v < 4) return [];
		if (!w && typeof e == "object") {
			let t = [
				"year",
				"month",
				"week",
				"holiday"
			], r = [
				"weekday",
				"time",
				"24/7",
				"state",
				"comment"
			], i = [], a = [], o = {};
			for (let e = 0; e < R.length; e++) {
				if (R[e][0].length === 0) continue;
				let t = [
					0,
					0,
					void 0
				];
				i[e] = {}, a[e] = [];
				do {
					t = ae(R[e][0], t[1]);
					for (let n = 0; n <= t[1]; n++) typeof R[e][0][n] == "object" && R[e][0][n][0] === "PH" && (o.PH = !0);
					t[0] === t[1] && R[e][0][t[0]][0] === "24/7" && (o["24/7"] = !0), typeof i[e][t[2]] == "object" ? i[e][t[2]].push(t[1]) : i[e][t[2]] = [t[1]], a[e].push(t[2]), t[1]++;
				} while (t[1] < R[e][0].length);
			}
			for (let e = 0; e < i.length; e++) {
				Object.keys(i[e]).forEach(function(t) {
					i[e][t].length > 1 && (C.push([
						e,
						i[e][t][i[e][t].length - 1],
						p("use multi", {
							count: i[e][t].length,
							part2: /^(?:comment|state)/.test(t) ? p("selector multi 2a", { what: p(t === "state" ? "selector state" : "comments") }) : p("selector multi 2b", { what: p(t + (/^(?:month|weekday)$/.test(t) ? "s" : " ranges")) })
						})
					]), T = !0);
				}), typeof i[e].state == "object" && Object.keys(i[e]).length === 1 ? e !== 0 && C.push([
					e,
					R[e][0].length - 1,
					p("default state")
				]) : i[e].time === void 0 && (typeof i[e].state == "object" && R[e][0][i[e].state[0]][0] === "open" && i[e].comment === void 0 || i[e].comment === void 0 && i[e].state === void 0 && i[e]["24/7"] === void 0) && C.push([
					e,
					R[e][0].length - 1,
					p("vague")
				]), typeof i[e].comment == "object" && R[e][0][i[e].comment[0]][0].length === 0 && C.push([
					e,
					i[e].comment[0],
					p("empty comment")
				]);
				for (let n = 0; n < a[e].length - 1; n++) {
					let o = a[e][n], s = a[e][n + 1];
					(t.indexOf(o) !== -1 && t.indexOf(s) !== -1 || r.indexOf(o) !== -1 && r.indexOf(s) !== -1) && R[e][0][i[e][o][0]][0] === ":" && C.push([
						e,
						i[e][o][0],
						p("separator_for_readability")
					]);
				}
				if (typeof L[e] == "object" && typeof L[e].time_wraps_over_midnight == "boolean" && L[e].time_wraps_over_midnight === !0 && typeof i[e + 1] == "object" && i[e + 1]["rule separator"] === void 0 && R[e + 1][1] === !1) {
					let r = [e, e + 1].map(function(e) {
						for (let n = 0; n < t.length - 1; n++) if (typeof i[e][t[n]] == "object") return !0;
						return !1;
					}).filter(function(e) {
						return e;
					}).length, a = !1;
					if (typeof L[e] == "object" && typeof L[e] == "object" && typeof L[e].week_days == "object" && typeof L[e + 1] == "object" && typeof L[e + 1].week_days == "object") for (let t = 0; t < L[e].week_days.length; t++) {
						let n = L[e].week_days[t];
						if (L[e + 1].week_days.indexOf(n === 6 ? 0 : n + 1) !== -1) {
							a = !0;
							break;
						}
					}
					else a = !0;
					let o = (n || {}).additional_rule_separator !== !1;
					r < 2 && a && o && C.push([
						e + 1,
						R[e + 1][0].length - 1,
						p("additional_rule_separator not used after time wrapping midnight"),
						R
					]);
				}
				typeof R[e][0][0] == "object" && R[e][0][0][0] === "," && R[e][0][0][1] === "rule separator" && typeof i[e].state == "object" && (R[e][0][i[e].state[0]][0] === "closed" || R[e][0][i[e].state[0]][0] === "off") && C.push([
					e,
					R[e][0].length - 1,
					p("additional rule which evaluates to closed"),
					R
				]);
			}
			if (e.advance() === !0 && o["24/7"] && !w && C.push([
				-1,
				0,
				p("strange 24/7")
			]), v >= 5 && !o.PH && !o["24/7"] && !w && (typeof x == "string" && c[S].warn_for_PH_missing || typeof x != "string")) {
				let e = [];
				Object.keys(c).forEach(function(t) {
					c[t].warn_for_PH_missing && e.push(t);
				}), C.push([
					-1,
					0,
					p("public holiday", { part2: typeof x == "string" ? "" : p("public holiday part2", { keys: e.join(", ") }) })
				]);
			}
			a.length > 1 && a.filter(function(e) {
				return e.length === 1 && e[0] === "time";
			}).length === a.length && C.push([
				-1,
				0,
				p("combine rules", { ok: "," })
			]), oe();
		}
		w = !0;
		let t = [];
		for (let e = 0; e < C.length; e++) t.push(V(C[e][0], C[e][1], C[e][2], C[e][3]));
		return t;
	}
	function ie(e, t) {
		return typeof e[t][3] == "string" ? 3 : e[t][1] === "comment" || e[t][1] === "state" || e[t][1] === "24/7" || e[t][1] === "rule separator" ? 1 : !1;
	}
	function ae(e, t) {
		let n = t, r, i;
		for (; n >= 0 && (i = ie(e, n), !i); n--);
		if (r = n, i === 1) return r + 1 < e.length && e[r + 1][0] === ":" && r++, [
			n,
			r,
			e[n][i]
		];
		for (r++; r < e.length; r++) if (ie(e, r)) return [
			n,
			r - 1,
			e[n][i]
		];
		return [
			n,
			r - 1,
			e[n][i]
		];
	}
	function oe(e) {
		let t = {}, n = !1, r;
		O = "";
		let o = [];
		typeof e == "object" && (typeof e.conf == "object" && (t = e.conf), typeof e.rule_index == "number" && (r = e.rule_index), e.get_internals === !0 && (n = !0)), Object.keys(s).forEach(function(e) {
			t[e] === void 0 && (t[e] = s[e]);
		});
		let c = (t.locale === "en" || t.locale === "all") && t.date_format === "short", l = c ? i : [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12
		].map(function(e) {
			return new Date(2018, e - 1, 1).toLocaleString(t.locale, { month: t.date_format });
		}), u = c ? a : [
			1,
			2,
			3,
			4,
			5,
			6,
			7
		].map(function(e) {
			return new Date(2017, 0, e).toLocaleString(t.locale, { weekday: t.date_format });
		});
		for (let e = 0; e < R.length; e++) {
			if (R[e][0].length === 0) continue;
			if (typeof r == "number") {
				if (r !== e) continue;
			} else e !== 0 && (O += R[e][1] ? t.rule_sep_string + "|| " : (R[e][0][0][1] === "rule separator" ? "," : t.print_semicolon ? ";" : "") + t.rule_sep_string);
			let n = [
				0,
				0,
				void 0
			], s = [], c = 0;
			do {
				if (n = ae(R[e][0], n[1]), c > 50) throw H("Infinite loop.");
				n[2] !== "rule separator" && s.push([n, je(R[e][0], n[0], n[1], n[2], t)]), n[1]++, c++;
			} while (n[1] < R[e][0].length);
			let d = s.slice();
			T || s.sort(function(e, t) {
				let n = [
					"year",
					"month",
					"week",
					"holiday",
					"weekday",
					"time",
					"24/7",
					"state",
					"comment"
				];
				return n.indexOf(e[0][2]) - n.indexOf(t[0][2]);
			});
			let f = O.length;
			if (typeof t.locale == "string" && t.locale !== "en") {
				let e;
				e = F.language === t.locale ? F.t.bind(F) : F.getFixedT(t.locale);
				for (let t = 0; t < s.length; t++) {
					let n = s[t][0][2];
					n === "weekday" ? a.forEach(function(e, n) {
						s[t][1] = s[t][1].replace(new RegExp(e, "g"), u[n]);
					}) : n === "month" ? i.forEach(function(e, n) {
						s[t][1] = s[t][1].replace(new RegExp(e, "g"), l[n]);
					}) : s[t][1].indexOf(":") === -1 && (s[t][1] = e(["opening_hours:pretty." + s[t][1], s[t][1]]));
				}
			}
			if (O += s.map(function(e) {
				return e[1];
			}).join(" "), o.push(s), !E) {
				for (let e = 0, t = d.length; e < t; e++) if (d[e] !== s[e]) {
					let t = e + f;
					for (let n = 0; n <= e; n++) t += s[n][1].length;
					C.push([
						O,
						t,
						p("switched", {
							first: s[e][0][2],
							second: d[e][0][2]
						})
					]);
				}
			}
		}
		return E = !0, n ? [o, R] : O;
	}
	function U(e, t) {
		if (t + arguments.length - 2 > e.length) return !1;
		for (let n = 0; n < arguments.length - 2; n++) if (e[t + n][1] !== arguments[n + 2]) return !1;
		return !0;
	}
	function se(e, t) {
		return function(n) {
			let r = e(new Date(n.getTime() + t));
			return r[1] === void 0 ? r : [r[0], new Date(r[1].getTime() - t)];
		};
	}
	function ce(e, t, n, r) {
		let i = !1, a = [];
		for (; t < e.length;) {
			if (U(e, t, "weekday")) t = he(e, t, n, void 0, r);
			else if (U(e, t, "24/7")) n.time.push(function() {
				return [!0];
			}), t++;
			else if (U(e, t, "holiday")) t = U(e, t + 1, ",") ? _e(e, t, n, !0) : _e(e, t, n, !1), k = !1;
			else if (U(e, t, "month", "number") || U(e, t, "month", "weekday") || U(e, t, "year", "month", "number") || U(e, t, "year", "event") || U(e, t, "event")) t = Ae(e, t, r), k = !1;
			else if (U(e, t, "year")) t = Te(e, t), k = !1;
			else if (U(e, t, "month")) t = $(e, t);
			else if (U(e, t, "week")) e[t][3] = "week", t = Ee(e, t);
			else if (t !== 0 && t !== e.length - 1 && e[t][0] === ":" && !(typeof a[1] == "string" && a[1] === "time")) !w && U(e, t - 1, "holiday") && C.push([
				r,
				t,
				p("no colon after", { token: e[t - 1][1] })
			]), t++;
			else if (U(e, t, "number", "timesep") || U(e, t, "timevar") || U(e, t, "(", "timevar") || U(e, t, "number", "-")) t = pe(e, t, n, !1, r), a = [t, "time"];
			else if (U(e, t, "state")) e[t][0] === "open" ? n.meaning = !0 : e[t][0] === "closed" || e[t][0] === "off" ? n.meaning = !1 : (n.meaning = !1, n.unknown = !0), i = !0, t++, typeof e[t] == "object" && e[t][0] === "," && (t = [t + 1]);
			else if (U(e, t, "comment")) n.comment = e[t][0], i || (n.meaning = !1, n.unknown = !0), i = !0, t++, typeof e[t] == "object" && e[t][0] === "," && (t = [t + 1]);
			else if ((t === 0 || t === e.length - 1) && U(e, t, "rule separator")) t++;
			else {
				let n = re();
				throw V(r, t, p("unexpected token", { token: e[t][1] })) + (n ? " " + n.join("; ") : "");
			}
			if (typeof t == "object") {
				e[t[0] - 1][1] = "rule separator";
				break;
			}
			typeof a[0] == "number" && a[0] !== t && (a = []);
		}
		return t;
	}
	function W(e, t) {
		return new Date(e.getFullYear(), e.getMonth(), e.getDate(), 0, t);
	}
	function G(e, t) {
		let n = t - e.getDay();
		return new Date(e.getFullYear(), e.getMonth(), e.getDate() + n + (n < 0 ? 7 : 0));
	}
	function le(e, t, n) {
		for (; t < e.length; t++) {
			if (U(e, t, "number", "-", "number")) n(e[t][0], e[t + 2][0], t), t += 3;
			else if (U(e, t, "-", "number")) n(-e[t + 1][0], -e[t + 1][0], t), t += 2;
			else if (U(e, t, "number")) n(e[t][0], e[t][0], t), t++;
			else throw V(P, t + U(e, t, "-"), "Unexpected token in number range: " + e[t][1]);
			if (!U(e, t, ",")) break;
		}
		return t;
	}
	function ue(e, t) {
		let n = 0, r = le(e, t, function(e, t, r) {
			if (e === 0 || e < -5 || e > 5) throw V(P, r, p("number -5 to 5"));
			if (e === t) {
				if (n !== 0) throw V(P, r, p("one weekday constraint"));
				n = e;
			} else throw V(P, r + 2, p("range constrained weekdays"));
		});
		for (let n = t; n < r; n++) e[n][4] = "positive_number";
		if (!U(e, r, "]")) throw V(P, r, p("expected", { symbol: "]" }));
		return [n, r + 1];
	}
	function de(e, t, n, r) {
		if (!w) {
			if (t === 0) throw V(P, e, p("range zero", { type: n }));
			t === 1 && (typeof r == "string" && r === "no_end_year" ? C.push([
				P,
				e,
				p("period one year+", { type: n })
			]) : C.push([
				P,
				e,
				p("period one", { type: n })
			]));
		}
	}
	function fe(e, t, n, r, i) {
		let a = G(new Date(e, t + (r[0] > 0 ? 0 : 1), 1), n);
		return a.setDate(a.getDate() + (r[0] + (r[0] > 0 ? -1 : 0)) * 7), typeof i == "object" && i[1] && a.setDate(a.getDate() + i[0]), a;
	}
	function K(e, t, n, r) {
		if (t < 1 || t > 31) throw V(n, r, p("month 31", { month: i[e] }));
		if ((e === 3 || e === 5 || e === 8 || e === 10) && t === 31) throw V(n, r, p("month 30", { month: i[e] }));
		if (e === 1 && t === 30) throw V(n, r, p("month feb", { month: i[e] }));
	}
	function pe(e, t, n, i, a) {
		for (i || (e[t][3] = "time"); t < e.length; t++) {
			let o = [], s = [];
			s[0] = U(e, t, "number", "timesep", "number"), o[0] = U(e, t, "(", "timevar");
			let c, u, f = !1;
			if (s[0] || U(e, t, "timevar") || o[0]) {
				let m = !1, h = [0, 0], v = [], b;
				s[0] ? c = q(e, a, t + o[0]) : (v[0] = e[t + o[0]][0], c = r[v[0]], o[0] && (h[0] = me(e, t), c += h[0]));
				let x = t + (s[0] ? 3 : o[0] ? 7 : 1) + 1;
				if (!U(e, x - 1, "-")) if (U(e, x - 1, "+")) f = !0;
				else if (y === 0) throw V(a, t + (s[0] ? typeof e[t + 3] == "object" ? 3 : 2 : o[0] ? 2 : +(typeof e[t + 1] == "object")), p("point in time", {
					calc: o[0] ? p("calculation") + " " : "",
					libraryname: d
				}));
				else u = c + 1, m = !0;
				if (f) i === 1 && (c += l), u = c >= 1320 ? c + 480 : c >= 1020 ? c + 600 : l;
				else if (!m) {
					if (s[1] = U(e, x, "number", "timesep", "number"), o[1] = U(e, x, "(", "timevar"), !s[1] && !U(e, x, "timevar") && !o[1]) throw V(a, x - (typeof e[x] == "object" ? 0 : 1), p("time range continue"));
					s[1] ? u = q(e, a, x) : (v[1] = e[x + o[1]][0], u = r[v[1]]), o[1] && (h[1] = me(e, x), u += h[1]);
				}
				if (t = x + (m ? -1 : s[1] ? 3 : o[1] ? 7 : !f), U(e, t, "/", "number")) {
					if (U(e, t + 2, "timesep", "number")) b = q(e, a, t + 1), t += 4;
					else if (b = e[t + 1][0], t += 2, U(e, t, "timesep")) throw V(a, t, p("period continue"));
					if (y === 0) throw V(a, t - 1, p("time range mode", { libraryname: d }));
					m = !0;
				} else if (U(e, t, "+")) pe(e, x, n, u < c ? 1 : !0, a), t++;
				else if (y === 1 && !m) throw V(a, x, p("point in time mode", { libraryname: d }));
				if (typeof g == "string" ? (!s[0] || !(s[1] || f || m)) && (k = !1) : v = [], !i && c >= l) throw V(a, x - 2, p("outside current day"));
				if ((u < c || s[0] && s[1] && c === u) && (u += l), u > l * 2) throw V(a, x + (s[1] ? 4 : o[1] ? 7 : 1) - 2, p("two midnights"));
				c === 0 && u === l ? n.time.push(function() {
					return [!0];
				}) : u > l ? (n.time.push(function(e, t, n, r, i, a, o, s) {
					return function(c) {
						let u = c.getHours() * 60 + c.getMinutes();
						if (n[0]) {
							let t = A.default.getTimes(c, g, _)[n[0]];
							e = t.getHours() * 60 + t.getMinutes() + r[0];
						}
						if (n[1]) {
							let e = A.default.getTimes(c, g, _)[n[1]];
							t = e.getHours() * 60 + e.getMinutes() + r[1], t += l;
						} else a && typeof o != "number" && (t = e + 1);
						if (typeof o == "number") {
							if (u < e) return [!1, W(c, e)];
							if (u <= t) {
								for (let t = e; u + o >= t; t += o) if (t === u) return [!0, W(c, u + 1)];
								else if (u < t) return [!1, W(c, t)];
							}
							return [!1, W(c, l)];
						} else if (u < e) return [!1, W(c, e)];
						else return [
							!0,
							W(c, t),
							i,
							s
						];
					};
				}(c, u, v, h, f, m, b, i)), u - l > 0 && (L[a] === void 0 && (L[a] = {}), L[a].time_wraps_over_midnight = !0, n.wraptime.push(function(e, t, n, r, i, a) {
					return function(o) {
						let s = o.getHours() * 60 + o.getMinutes();
						if (t[1]) {
							let r = A.default.getTimes(o, g, _)[t[1]];
							e = r.getHours() * 60 + r.getMinutes() + n[1];
						}
						if (typeof i == "number") {
							if (s <= e) {
								for (let e = 0; s + i >= e; e += i) if (e === s) return [!0, W(o, s + 1)];
								else if (s < e) return [!1, W(o, e)];
							}
						} else if (s < e) return [
							!0,
							W(o, e),
							r,
							a
						];
						return [!1, void 0];
					};
				}(u - l, v, h, f, b, i)))) : n.time.push(function(e, t, n, r, i, a, o) {
					return function(s) {
						let c = s.getHours() * 60 + s.getMinutes();
						if (n[0]) {
							let t = A.default.getTimes(s, g, _)[n[0]];
							e = t.getHours() * 60 + t.getMinutes() + r[0];
						}
						if (n[1]) {
							let e = A.default.getTimes(s, g, _)[n[1]];
							t = e.getHours() * 60 + e.getMinutes() + r[1];
						} else a && typeof o != "number" && (t = e + 1);
						if (typeof o == "number") {
							if (c < e) return [!1, W(s, e)];
							if (c <= t) {
								for (let t = e; c + o >= t; t += o) if (t === c) return [!0, W(s, c + 1)];
								else if (c < t) return [!1, W(s, t)];
							}
							return [!1, W(s, l)];
						} else if (c < e) return [!1, W(s, e)];
						else if (c < t) return [
							!0,
							W(s, t),
							i
						];
						else return [!1, W(s, e + l)];
					};
				}(c, u, v, h, f, m, b));
			} else if (U(e, t, "number", "-", "number")) {
				if (c = e[t][0] * 60, u = e[t + 2][0] * 60, w || C.push([
					a,
					t + 2,
					p("without minutes", { syntax: (e[t][0] < 10 ? "0" : "") + e[t][0] + ":00-" + (e[t + 2][0] < 10 ? "0" : "") + e[t + 2][0] + ":00" })
				]), c >= l) throw V(a, t, p("outside day"));
				if (u < c && (u += l), u > l * 2) throw V(a, t + 2, p("two midnights"));
				u > l ? (n.time.push(function(e, t) {
					return function(n) {
						return n.getHours() * 60 + n.getMinutes() < e ? [!1, W(n, e)] : [!0, W(n, t)];
					};
				}(c, u)), u - l > 0 && (L[a] === void 0 && (L[a] = {}), L[a].time_wraps_over_midnight = !0, n.wraptime.push(function(e) {
					return function(t) {
						return t.getHours() * 60 + t.getMinutes() < e ? [!0, W(t, e)] : [!1, void 0];
					};
				}(u - l)))) : n.time.push(function(e, t) {
					return function(n) {
						let r = n.getHours() * 60 + n.getMinutes();
						return r < e ? [!1, W(n, e)] : r < t ? [
							!0,
							W(n, t),
							f
						] : [!1, W(n, e + l)];
					};
				}(c, u)), t += 3;
			} else {
				if (U(e, t, "(")) throw V(a, t, "Missing variable time (e.g. sunrise) after: \"" + e[t][1] + "\"");
				if (U(e, t, "number", "timesep")) throw V(a, t + 1, "Missing minutes in time range after: \"" + e[t + 1][1] + "\"");
				if (U(e, t, "number")) throw V(a, t + +(typeof e[t + 1] == "object"), "Missing time separator in time range after: \"" + e[t][1] + "\"");
				return [t];
			}
			if (!U(e, t, ",")) break;
			e[t + 1] === void 0 && !w && C.push([
				a,
				t,
				p("value ends with token", { token: e[t][1] })
			]);
		}
		return t;
	}
	function q(e, t, n) {
		if (e[n + 2][0] > 59) throw V(t, n + 2, "Minutes are greater than 59.");
		return e[n][0] * 60 + e[n + 2][0];
	}
	function me(e, t) {
		let n;
		if (U(e, t + 2, "+") || U(e, t + 2, "-")) if (U(e, t + 3, "number", "timesep", "number")) if (U(e, t + 6, ")")) {
			let n = e[t + 2][0] === "+" ? "1" : "-1", r = q(e, P, t + 3) * n;
			return r === 0 && C.push([
				P,
				t + 5,
				p("zero calculation")
			]), r;
		} else n = [t + 6, ". " + p("missing", { symbol: ")" }) + "."];
		else if (U(e, t + 3, "number") && U(e, t + 4, ")")) {
			let n = ("0" + e[t + 3][0]).slice(-2), r = "(" + e[t + 1][0] + e[t + 2][0] + n + ":00)";
			throw V(P, t + 3, p("time offset hours only", { suggestion: r }));
		} else n = [t + 5, " " + p("(time)") + "."];
		else n = [t + 2, ". " + p("expected", { symbol: "+\" or \"-" })];
		if (n) throw V(P, n[0], p("calculation syntax") + n[1]);
	}
	function he(e, t, n, r, i) {
		for (r || (r = !0, e[t][3] = "weekday"); t < e.length; t++) {
			if (U(e, t, "weekday", "[")) {
				let r = [], a = le(e, t + 2, function(e, t, n) {
					if (e === 0 || e < -5 || e > 5) throw V(i, n, p("number -5 to 5"));
					if (e === t) r.push(e);
					else if (e < t) for (let a = e; a <= t; a++) {
						if (a === 0 || a < -5 || a > 5) throw V(i, n + 2, p("number -5 to 5"));
						r.push(a);
					}
					else throw V(i, n + 2, p("bad range", {
						from: e,
						to: t
					}));
				});
				if (!U(e, a, "]")) throw V(i, a + (typeof e[a] == "object" ? 0 : -1), p("] or more numbers"));
				let o = J(e, a + 1, 6, "constrained weekdays");
				k = !1;
				for (let i = 0; i < r.length; i++) n.weekday.push(function(e, t, n) {
					return function(r) {
						let i = Y(r, !1), a = new Date(r.getFullYear(), r.getMonth(), 1), o = new Date(r.getFullYear(), r.getMonth() + 1, 1), s = fe(r.getFullYear(), r.getMonth(), e, [t]), c = new Date(s.getFullYear(), s.getMonth(), s.getDate() + n);
						if (c.getTime() < a.getTime()) if (s.getTime() >= a.getTime()) c = G(new Date(r.getFullYear(), r.getMonth() + (t > 0 ? 0 : 1) + 1, 1), e), s.setDate(c.getDate() + (t + (t > 0 ? -1 : 0)) * 7 + n);
						else return [!1, o];
						else if (c.getTime() >= o.getTime() && s.getTime() >= o.getTime()) return [!1, o];
						let u;
						if (n > 0) {
							if (u = G(new Date(r.getFullYear(), r.getMonth() + (t > 0 ? 0 : 1) - 1, 1), e), u.setDate(u.getDate() + (t + (t > 0 ? -1 : 0)) * 7 + n), i === Y(u, !1)) return [!0, W(r, l)];
						} else if (n < 0) if (u = G(new Date(r.getFullYear(), r.getMonth() + (t > 0 ? 0 : 1) + 1, 1), e), u.setDate(u.getDate() + (t + (t > 0 ? -1 : 0)) * 7 + n), u.getTime() >= o.getTime()) {
							if (c.getTime() >= o.getTime()) return [!1, u];
						} else {
							if (c.getTime() < o.getTime() && Y(c, !1) === i) return [!0, W(r, l)];
							c = u;
						}
						let d = new Date(r.getFullYear(), r.getMonth(), r.getDate()), f = new Date(c.getFullYear(), c.getMonth(), c.getDate());
						return d.getTime() === f.getTime() ? [!0, W(r, l)] : d.getTime() < f.getTime() ? [!1, c] : [!1, o];
					};
				}(e[t][0], r[i], o[0]));
				t = a + 1 + o[1];
			} else if (U(e, t, "weekday")) {
				let r = U(e, t + 1, "-", "weekday"), a = e[t][0], o = r ? e[t + 2][0] : a, s = !0;
				if (o < a) {
					let e = o;
					o = a - 1, a = e + 1, s = !1;
				}
				let c = Array.apply(0, Array(o - a + 1)).map(function(e, t) {
					return t + o;
				});
				L[i] === void 0 && (L[i] = {}), typeof L[i].week_days == "object" ? Array.prototype.push.apply(L[i].week_days, c) : L[i].week_days = c, o < a ? n.weekday.push(function() {
					return [!0];
				}) : n.weekday.push(function(e, t, n) {
					return function(r) {
						let i = r.getDay();
						return i < e || i > t ? [!n, G(r, e)] : [n, G(r, t + 1)];
					};
				}(a, o, s)), t += r ? 3 : 1;
			} else if (U(e, t, "holiday")) return k = !1, _e(e, t, n, !0, r);
			else if (U(e, t - 1, ",")) throw V(i, t - 1, p("additional rule no sense"));
			else throw V(i, t, p("unexpected token weekday range", { token: e[t][1] }));
			if (!U(e, t, ",")) break;
		}
		return t;
	}
	function J(e, t, n, r) {
		let i = [0, 0];
		if (i[0] = U(e, t, "+") || (U(e, t, "-") ? -1 : 0), i[0] !== 0 && U(e, t + 1, "number", "calcday")) {
			if (e[t + 1][0] > n) throw V(P, t + 2, p("max differ", {
				maxdiffer: n,
				name: r
			}));
			i[0] *= e[t + 1][0], i[0] === 0 && !w && C.push([
				P,
				t + 2,
				p("adding 0")
			]), i[1] = 3;
		} else i[0] = 0;
		return i;
	}
	function ge(e, t, n) {
		let r = e[t][0], i = Ce(r);
		if (r === "PH") {
			let r = J(e, t + 1, 1, "public holiday"), a = Se(i, r);
			return n.push(a), t + 1 + r[1];
		} else {
			let e = xe(i);
			return n.push(e), t + 1;
		}
	}
	function _e(e, t, n, r, i) {
		i || (e[t][3] = r ? "weekday" : "holiday");
		let a = r ? n.weekday : n.holiday;
		for (; t < e.length;) {
			if (U(e, t, "holiday")) t = ge(e, t, a);
			else if (U(e, t, "weekday")) return he(e, t, n, !0, P);
			else if (U(e, t - 1, ",")) throw V(P, t - 1, p("additional rule no sense"));
			else throw V(P, t, p("unexpected token holiday", { token: e[t][1] }));
			if (!U(e, t, ",")) break;
			t++;
		}
		return t;
	}
	function Y(e, t) {
		return (t ? e.getFullYear() * 1e4 : 0) + e.getMonth() * 100 + e.getDate();
	}
	function ve(e, t, n) {
		let r = e[t];
		if (!(r === void 0 && (r = e.default, r === void 0))) return r;
	}
	function X(e, t) {
		return (e - 1) * 100 + t;
	}
	function ye(e, t) {
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = ve(e[r], t);
			if (i !== void 0) for (let t = 0; t < i.length; t += 4) n.push({
				from_month: i[0 + t],
				from_day: i[1 + t],
				to_month: i[2 + t],
				to_day: i[3 + t],
				name: e[r].name,
				holiday_obj: e[r]
			});
		}
		return n;
	}
	function be(e) {
		return e.sort((e, t) => X(e.from_month, e.from_day) - X(t.from_month, t.from_day));
	}
	function xe(e) {
		return function(t) {
			let n = Y(t), r = t.getFullYear(), i = ye(e, r);
			be(i);
			for (let t = 0; t < e.length; t++) {
				let i = ve(e[t], r - 1);
				if (typeof i == "object") {
					let a = i.length - 4, o = X(i[a], i[a + 1]), s = X(i[a + 2], i[a + 3]);
					if (o > s && n <= s) return [
						!0,
						new Date(r, i[a + 2] - 1, i[a + 3] + 1),
						e[t].name
					];
				}
			}
			for (let e = 0; e < i.length; e++) {
				let t = i[e], a = X(t.from_month, t.from_day), o = X(t.to_month, t.to_day), s = o < a;
				if (n < a) return [!1, new Date(r, t.from_month - 1, t.from_day)];
				if (a <= n && (n <= o || s)) return [
					!0,
					new Date(r + s, t.to_month - 1, t.to_day + 1),
					t.name
				];
			}
			let a = [];
			for (let t = 0; t < e.length; t++) {
				let n = ve(e[t], r + 1);
				n !== void 0 && a.push({
					from_month: n[0],
					from_day: n[1],
					name: e[t].name
				});
			}
			if (a.length > 0) return be(a), [!1, new Date(r + 1, a[0].from_month - 1, a[0].from_day)];
			throw H(p("no SH definition", {
				name: "",
				year: r
			}), "library bug PR only");
		};
	}
	function Se(e, t) {
		return function(n) {
			let r = we(e, n.getFullYear(), t), i = Y(n, !0);
			for (let a = 0; a < r.length; a++) {
				let o = Y(r[a][0], !0);
				if (i < o) {
					if (t[0] > 0) {
						let r = we(e, n.getFullYear() - 1, t), a = r[r.length - 1], o = Y(a[0], !0);
						if (i < o) return [!1, a[0]];
						if (i === o) return [
							!0,
							W(a[0], l),
							"Day after " + a[1]
						];
					}
					return [!1, r[a][0]];
				} else if (i === o) return [
					!0,
					new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1),
					(t[0] > 0 ? "Day after " : t[0] < 0 ? "Day before " : "") + r[a][1]
				];
			}
			if (t[0] < 0) {
				let r = we(e, n.getFullYear() + 1, t)[0];
				if (i === Y(r[0], !0)) return [
					!0,
					W(r[0], l),
					"Day before " + r[1]
				];
			}
			return [!1, new Date(r[0][0].getFullYear() + 1, r[0][0].getMonth(), r[0][0].getDate())];
		};
	}
	function Ce(e) {
		if (typeof m != "string") throw p("no country code");
		if (!j[m]) throw H(p("no holiday definition", {
			name: e,
			cc: m
		}), "library bug PR only");
		let t = [];
		if (typeof h == "string" && typeof j[m][h] == "object" && typeof j[m][h][e] == "object") {
			let n = j[m][e] || [], r = j[m][h][e];
			if (e === "PH") t = r;
			else if (!n.length) t = r;
			else {
				let e = n.map(function(e) {
					return e.name;
				});
				t.push.apply(t, n), t.push.apply(t, r.filter(function(t) {
					return e.indexOf(t.name) === -1;
				})), t.sort(function(e, t) {
					let n = Object.keys(e).find(function(e) {
						return e !== "name";
					}), r = Object.keys(t).find(function(e) {
						return e !== "name";
					}), i = e[n], a = t[r];
					return i[0] - a[0] || i[1] - a[1];
				});
			}
		} else if (j[m][e]) {
			let n = j[m][e];
			switch (e) {
				case "PH":
					n.forEach(function(e) {
						"only_states" in e && e.only_states.indexOf(h) === -1 || t.push(e);
					});
					break;
				case "SH":
					t = n;
					break;
			}
		} else throw H(p("no holiday definition state", {
			name: e,
			cc: m,
			state: h
		}), "library bug PR only");
		if (t.length === 0) throw H(p("no holiday definition", {
			name: e,
			cc: m
		}), "library bug PR only");
		return t;
	}
	function Z(e) {
		let t = Math.floor(e / 100), n = e - 19 * Math.floor(e / 19), r = Math.floor((t - 17) / 25), i = t - Math.floor(t / 4) - Math.floor((t - r) / 3) + 19 * n + 15;
		i -= 30 * Math.floor(i / 30), i -= Math.floor(i / 28) * (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - n) / 11));
		let a = e + Math.floor(e / 4) + i + 2 - t + Math.floor(t / 4);
		a -= 7 * Math.floor(a / 7);
		let o = i - a, s = 3 + Math.floor((o + 40) / 44), c = o + 28 - 31 * Math.floor(s / 4), l = e % 4, u = e % 7, d = (e % 19 * 19 + 15) % 30, f = d + (2 * l + 4 * u - d + 34) % 7, p;
		p = f < 9 || f + 4 < 31 ? new Date(e, 3, f + 4) : new Date(e, 4, f - 26);
		let m = new Date(e, 2, 0), h = m.getDate() - m.getDay(), g = 24 - (6 + new Date(e, 4, 24).getDay()) % 7, _ = new Date(e, 6, 1).getDay() === 0 ? 2 : 1;
		function v(e) {
			if (e >= 1900 && e <= 1923) return e % 4 == 3 ? new Date(e, 2, 22) : new Date(e, 2, 21);
			if (e >= 1924 && e <= 1959) return new Date(e, 2, 21);
			if (e >= 1960 && e <= 1991) return e % 4 == 0 ? new Date(e, 2, 20) : new Date(e, 2, 21);
			if (e >= 1992 && e <= 2023) return e % 4 == 0 || e % 4 == 1 ? new Date(e, 2, 20) : new Date(e, 2, 21);
			if (e >= 2024 && e <= 2055) return e % 4 == 3 ? new Date(e, 2, 21) : new Date(e, 2, 20);
			if (e >= 2056 && e <= 2091) return new Date(e, 2, 20);
			if (e >= 2092 && e <= 2099) return e % 4 == 0 ? new Date(e, 2, 19) : new Date(e, 2, 20);
		}
		function y(e) {
			if (e >= 1900 && e <= 1919) return e % 4 == 0 ? new Date(e, 8, 23) : new Date(e, 8, 24);
			if (e >= 1920 && e <= 1947) return e % 4 == 0 || e % 4 == 1 ? new Date(e, 8, 23) : new Date(e, 8, 24);
			if (e >= 1948 && e <= 1979) return e % 4 == 3 ? new Date(e, 8, 24) : new Date(e, 8, 23);
			if (e >= 1980 && e <= 2011) return new Date(e, 8, 23);
			if (e >= 2012 && e <= 2043) return e % 4 == 0 ? new Date(e, 8, 22) : new Date(e, 8, 23);
			if (e >= 2044 && e <= 2075) return e % 4 == 0 || e % 4 == 1 ? new Date(e, 8, 22) : new Date(e, 8, 23);
			if (e >= 2076 && e <= 2099) return e % 4 == 3 ? new Date(e, 8, 23) : new Date(e, 8, 22);
		}
		function b(t, n) {
			let r = new Date(e, t, 1);
			return 1 + (7 + n - r.getDay()) % 7;
		}
		function x(t, n) {
			let r = new Date(e, t + 1, 0), i = (7 + r.getDay() - n) % 7;
			return r.getDate() - i;
		}
		function S(e, t) {
			let n = e - t.getDay();
			return n < 0 && (n += 7), t.setDate(t.getDate() + n), t;
		}
		function C(e, t, n) {
			if (e >= t) throw H("Not implemented yet.");
			if (e <= n.getDay() && n.getDay() <= t) return n;
			{
				let t = e - n.getDay();
				return t < 0 && (t += 7), n.setDate(n.getDate() + t), n;
			}
		}
		return {
			easter: new Date(e, s - 1, c),
			"orthodox easter": p,
			victoriaDay: new Date(e, 4, g),
			canadaDay: new Date(e, 6, _),
			firstJanuaryMonday: new Date(e, 0, b(0, 1)),
			firstFebruaryMonday: new Date(e, 1, b(1, 1)),
			lastFebruarySunday: new Date(e, 1, h),
			firstMarchMonday: new Date(e, 2, b(2, 1)),
			firstAprilMonday: new Date(e, 3, b(3, 1)),
			firstMayMonday: new Date(e, 4, b(4, 1)),
			firstJuneMonday: new Date(e, 5, b(5, 1)),
			firstJulyMonday: new Date(e, 6, b(6, 1)),
			firstAugustMonday: new Date(e, 7, b(7, 1)),
			firstSeptemberMonday: new Date(e, 8, b(8, 1)),
			firstSeptemberTuesday: new Date(e, 8, b(8, 2)),
			firstSeptemberSunday: new Date(e, 8, b(8, 0)),
			firstOctoberMonday: new Date(e, 9, b(9, 1)),
			firstNovemberMonday: new Date(e, 10, b(10, 1)),
			firstNovemberTuesday: new Date(e, 10, b(10, 2)),
			firstMarchTuesday: new Date(e, 2, b(2, 2)),
			firstAugustTuesday: new Date(e, 7, b(7, 2)),
			firstAugustFriday: new Date(e, 7, b(7, 5)),
			firstNovemberThursday: new Date(e, 10, b(10, 4)),
			lastMayMonday: new Date(e, 4, x(4, 1)),
			lastMarchMonday: new Date(e, 2, x(2, 1)),
			lastAprilMonday: new Date(e, 3, x(3, 1)),
			lastAprilFriday: new Date(e, 3, x(3, 5)),
			lastAugustMonday: new Date(e, 7, x(7, 1)),
			lastSeptemberMonday: new Date(e, 8, x(8, 1)),
			lastSeptemberFriday: new Date(e, 8, x(8, 5)),
			lastOctoberMonday: new Date(e, 9, x(9, 1)),
			lastOctoberFriday: new Date(e, 9, x(9, 5)),
			nextSaturday20Jun: S(6, new Date(e, 5, 20)),
			nextSaturday31Oct: S(6, new Date(e, 9, 31)),
			nextWednesday16Nov: S(3, new Date(e, 10, 16)),
			"nextMo-Fr17March": C(1, 5, new Date(e, 2, 17)),
			"nextMo-Sa01May": C(1, 6, new Date(e, 4, 1)),
			"nextMo-Fr12July": C(1, 5, new Date(e, 6, 12)),
			"nextMo-Sa07August": C(1, 6, new Date(e, 7, 7)),
			"nextMo-Fr30November": C(1, 5, new Date(e, 10, 30)),
			"nextMo-Sa25December": C(1, 6, new Date(e, 11, 25)),
			springEquinox: v(e),
			autumnalEquinox: y(e)
		};
	}
	function we(e, t, n) {
		let r = Z(t), i = [], a;
		return e.forEach(function(e) {
			if ("fixed_date" in e) a = new Date(t, e.fixed_date[0] - 1, e.fixed_date[1]);
			else if ("variable_date" in e) {
				let n = r[e.variable_date];
				if (!n) throw p("movable no formula", { name: e.name });
				let i = 0;
				if ("offset" in e && (i = e.offset), a = new Date(n.getFullYear(), n.getMonth(), n.getDate() + i), t !== a.getFullYear()) throw p("movable not in year", {
					name: e.variable_date,
					days: i
				});
			} else throw H("Unexpected object: " + JSON.stringify(e, null, "    "));
			n[0] && a.setDate(a.getDate() + n[0]), i.push([a, e.name]);
		}), i = i.sort(function(e, t) {
			return e[0].getTime() < t[0].getTime() ? -1 : +(e[0].getTime() > t[0].getTime());
		}), i;
	}
	function Te(e, t) {
		for (e[t][3] = "year"; t < e.length; t++) {
			if (U(e, t, "year")) {
				let n = !1, r, i;
				U(e, t + 1, "-", "year", "/", "number") ? (n = !0, r = !0, i = parseInt(e[t + 4][0]), de(t + 4, i, "year")) : (n = U(e, t + 1, "-", "year"), r = U(e, t + 1, "/", "number"), r ? (i = parseInt(e[t + 2][0]), de(t + 2, i, "year", "no_end_year")) : U(e, t + 1, "+") && (i = 1, r = 2));
				let a = parseInt(e[t][0]);
				if (n && e[t + 2][0] <= a) throw e[t + 2][0] === a ? V(P, t, p("year range one year", { year: a })) : V(P, t, p("year range reverse"));
				!n && a < (/* @__PURE__ */ new Date()).getFullYear() && C.push([
					P,
					t,
					p("year past")
				]), n && e[t + 2][0] < (/* @__PURE__ */ new Date()).getFullYear() && C.push([
					P,
					t + 2,
					p("year past")
				]), N.year.push(function(e, t, n, r, i, a) {
					return function(o) {
						let s = o.getFullYear(), c = r ? parseInt(e[t + 2][0]) : n;
						if (s < n) return [!1, new Date(n, 0, 1)];
						if (i) {
							if (n <= s) {
								if (r && s > c) return [!1];
								if (a > 0) return (s - n) % a === 0 ? [!0, new Date(s + 1, 0, 1)] : [!1, new Date(s + a - 1, 0, 1)];
							}
						} else if (r) {
							if (s <= c) return [!0, new Date(c + 1, 0, 1)];
						} else if (s === n) return [!0];
						return [!1];
					};
				}(e, t, a, n, r, i)), t += 1 + (n ? 2 : 0) + (r ? r === 2 ? 1 : 2 : 0);
			} else if (U(e, t - 1, ",")) throw V(P, t - 1, p("additional rule no sense"));
			else throw V(P, t, p("unexpected token year range", { token: e[t][1] }));
			if (!U(e, t, ",")) break;
		}
		return t;
	}
	function Ee(e, t) {
		for (; t < e.length; t++) {
			if (U(e, t, "week") && t++, U(e, t, "number")) {
				let n = U(e, t + 1, "-", "number"), r = 0, i = e[t][0], a = n ? e[t + 2][0] : i;
				if (i > a) throw V(P, t + 2, p("week range reverse"));
				if (i < 1) throw V(P, t, p("week negative"));
				if (a > 53) throw V(P, n ? t + 2 : t, p("week exceed"));
				if (n && (r = U(e, t + 3, "/", "number"), r)) {
					if (r = e[t + 4][0], e[t + 4][4] = "positive_number", r < 2) throw V(P, t + 4, p("week period less than 2", {
						weekfrom: i,
						weekto: a,
						period: r
					}));
					if (r > 26) throw V(P, t + 4, p("week period greater than 26", { weekfrom: i }));
				}
				k && (!(i <= 1 && a >= 53) || r) && (k = !1), !r && i === 1 && a === 53 ? N.week.push(function() {
					return [!0];
				}) : N.week.push(function(e, t, n) {
					return function(r) {
						let i = De(r);
						if (i < e || i > t) return [!1, Q(e, r)];
						if (n) {
							if ((i - e) % n === 0) return [!0, Q(i + 1, r)];
							{
								let a = i + (n - (i - e) % n);
								return a <= t ? [!1, Q(a, r)] : [!1, Q(e, r)];
							}
						}
						return [!0, Q(t === 53 ? 1 : t + 1, r)];
					};
				}(i, a, r)), t += 1 + (n ? 2 : 0) + (r ? 2 : 0);
			} else if (U(e, t - 1, ",")) throw V(P, t - 1, p("additional rule no sense"));
			else throw V(P, t, p("unexpected token week range", { token: e[t][1] }));
			if (!U(e, t, ",")) break;
		}
		return t;
	}
	function De(e) {
		e = /* @__PURE__ */ new Date(+e), e.setHours(0, 0, 0, 0), e.setDate(e.getDate() + 4 - (e.getDay() || 7));
		let t = new Date(e.getFullYear(), 0, 1);
		return Math.ceil(((e - t) / 864e5 + 1) / 7);
	}
	function Oe(e, t) {
		let n = new Date(t, 0, 1 + (e - 1) * 7), r = n.getDay(), i = n;
		return r <= 4 ? i.setDate(n.getDate() - n.getDay() + 1) : i.setDate(n.getDate() + 8 - n.getDay()), i;
	}
	function Q(e, t) {
		let n;
		for (let r = -1; r <= 1; r++) if (n = Oe(e, t.getFullYear() + r), n.getTime() > t.getTime()) return n;
		throw H();
	}
	function $(e, t, n, r) {
		for (r || (e[t][3] = "month"); t < e.length; t++) {
			if (U(e, t, "month", "number") && !U(e, t + 2, "timesep", "number")) return Ae(e, t, P, !0);
			if (U(e, t, "month")) {
				let r = U(e, t + 1, "-", "month"), i = e[t][0], a = r ? e[t + 2][0] : i;
				r && k ? i !== (a + 1) % 12 && (k = !1) : k = !1;
				let o = !0;
				if (a < i) {
					let e = a;
					a = i - 1, i = e + 1, o = !1;
				}
				let s = function(e, t, n) {
					return function(r) {
						let i = r.getMonth();
						return t < e ? [!n] : i < e || i > t ? [!n, ke(r, e)] : [n, ke(r, t + 1)];
					};
				}(i, a, o);
				n === !0 ? N.monthday.push(s) : N.month.push(s), t += r ? 3 : 1;
			} else throw V(P, t, p("unexpected token month range", { token: e[t][1] }));
			if (!U(e, t, ",")) break;
		}
		return t;
	}
	function ke(e, t) {
		return new Date(e.getFullYear(), t < e.getMonth() ? t + 12 : t);
	}
	function Ae(e, t, n, r) {
		for (r || (e[t][3] = "month"); t < e.length; t++) {
			let i = [], a = [], o = [], s = [], c = [];
			i[0] = U(e, t, "year"), a[0] = U(e, t + i[0], "month", "number"), o[0] = U(e, t + i[0], "event"), o[0] && (s[0] = J(e, t + i[0] + 1, 200, "event like easter"));
			let l;
			U(e, t + i[0], "month", "weekday", "[") ? (c[0] = ue(e, t + i[0] + 3), s[0] = J(e, c[0][1], 6, "constrained weekdays"), l = c[0][1] + (typeof s[0] == "object" && s[0][1] ? 3 : 0)) : l = t + i[0] + (o[0] ? typeof s[0] == "object" && s[0][1] ? 4 : 1 : 2);
			let d;
			if ((a[0] || o[0] || c[0]) && U(e, l, "-") && (i[1] = U(e, l + 1, "year"), d = l + 1 + i[1], a[1] = U(e, d, "month", "number"), a[1] || (o[1] = U(e, d, "event"), o[1] ? s[1] = J(e, d + 1, 366, "event like easter") : U(e, d, "month", "weekday", "[") && (c[1] = ue(e, d + 3), s[1] = J(e, c[1][1], 6, "constrained weekdays")))), i[0] === i[1] && (a[1] || o[1] || c[1])) {
				a[0] && K(e[t + i[0]][0], e[t + i[0] + 1][0], n, t + i[0] + 1), a[1] && K(e[d][0], e[d + 1][0], n, d + 1);
				let l = function(e, t, n, r, i, a, o, s) {
					return function(c) {
						let l = new Date(c.getFullYear() + 1, 0, 1), u, d;
						if (i[0]) {
							if (u = Z(r[0] ? parseInt(e[t][0]) : c.getFullYear()), d = u[e[t + r[0]][0]], typeof a[0] == "object" && a[0][1]) {
								let i = d.getFullYear();
								if (d.setDate(d.getDate() + a[0][0]), i !== d.getFullYear()) throw V(n, t + r[0] + a[0][1] * 3, p("movable not in year", {
									name: e[t + r[0]][0],
									days: a[0][0]
								}));
							}
						} else d = s[0] ? fe(r[0] ? e[t][0] : c.getFullYear(), e[t + r[0]][0], e[t + r[0] + 1][0], s[0], a[0]) : new Date(r[0] ? e[t][0] : c.getFullYear(), e[t + r[0]][0], e[t + r[0] + 1][0]);
						let f;
						if (i[1]) {
							if (u = Z(r[1] ? parseInt(e[o - 1][0]) : c.getFullYear()), f = u[e[o][0]], typeof a[1] == "object" && a[1][1]) {
								let t = f.getFullYear();
								if (f.setDate(f.getDate() + a[1][0]), t !== f.getFullYear()) throw V(n, o + a[1][1], p("movable not in year", {
									name: e[o][0],
									days: a[1][0]
								}));
							}
						} else f = s[1] ? fe(r[1] ? e[o - 1][0] : c.getFullYear(), e[o][0], e[o + 1][0], s[1], a[1]) : new Date(r[1] ? e[o - 1][0] : c.getFullYear(), e[o][0], e[o + 1][0] + 1);
						let m = !0;
						if (f < d) {
							let e = f;
							f = d, d = e, m = !1;
						}
						return c.getTime() < d.getTime() ? [!m, d] : c.getTime() < f.getTime() ? [m, f] : r[0] ? [!m] : [!m, l];
					};
				}(e, t, n, i, o, s, d, c);
				r === !0 ? N.month.push(l) : N.monthday.push(l), t = (c[1] ? c[1][1] : d + (o[1] ? 1 : 2)) + (typeof s[1] == "object" ? s[1][1] : 0);
			} else if (a[0]) {
				i = i[0];
				let a = e[t][0], o = e[t + i][0], s = !0, c;
				do {
					let l = e[t + 1 + i][0];
					c = U(e, t + 2 + i, "-", "number");
					let d, f = e[t + i + (c ? 3 : 1)][0] + 1;
					if (c && U(e, t + i + 4, "/", "number") && (d = e[t + i + 5][0], e[t + i + 5][4] = "positive_number", de(t + i + 5, d, "day")), s) {
						let n = t + i + 1 + (c ? 2 : 0) + (d ? 2 : 0) + !(c || d);
						if (U(e, n, "timesep", "number") && (U(e, n + 2, "+") || U(e, n + 2, "-") || y !== 0)) return $(e, t, !0, !0);
					}
					if (f < l) throw V(n, t + i + 3, p("day range reverse"));
					K(o, l, n, t + 1 + i), K(o, f - 1, n, t + i + (c ? 3 : 1));
					let m = function(e, t, n, r, i, a) {
						return function(o) {
							let s = new Date(o.getFullYear() + 1, 0, 1), l = new Date(t ? e : o.getFullYear(), n, r);
							if (n === 1 && r !== l.getDate()) return [!1];
							let d = new Date(l.getFullYear(), n, i);
							if (n === 1 && c && i !== d.getDate()) return [!1];
							if (o.getTime() < l.getTime()) return [!1, l];
							if (o.getTime() >= d.getTime()) return [!1, s];
							if (!a) return [!0, d];
							let f = Math.floor((o.getTime() - l.getTime()) / u) % a;
							return f === 0 ? [!0, new Date(o.getFullYear(), o.getMonth(), o.getDate() + 1)] : [!1, new Date(o.getFullYear(), o.getMonth(), o.getDate() + a - f)];
						};
					}(a, i, o, l, f, d);
					r === !0 ? N.month.push(m) : N.monthday.push(m), t += 2 + i + (c ? 2 : 0) + (d ? 2 : 0), s = !1;
				} while (U(e, t, ",", "number"));
			} else if (o[0]) {
				let a = function(e, t, n, r, i) {
					return function(a) {
						let o = Z(r ? e[t][0] : a.getFullYear())[e[t + r][0]];
						if (!o) throw p("movable no formula", { name: e[t + r][0] });
						if (i[0] && (o.setDate(o.getDate() + i[0]), a.getFullYear() !== o.getFullYear())) throw V(n, t + r + i[1], p("movable not in year", {
							name: e[t + r][0],
							days: i[0]
						}));
						return a.getTime() < o.getTime() ? [!1, o] : o.getMonth() * 100 + o.getDate() === a.getMonth() * 100 + a.getDate() ? [!0, new Date(a.getFullYear(), a.getMonth(), a.getDate() + 1)] : [!1, new Date(a.getFullYear() + 1, 0, 1)];
					};
				}(e, t, n, i[0], s[0]);
				r === !0 ? N.month.push(a) : N.monthday.push(a), t += i[0] + o[0] + (typeof s[0][1] == "number" && s[0][1] ? 3 : 0);
			} else if (c[0]) t = $(e, t);
			else if (U(e, t, "month")) return $(e, t, !0, !0);
			else return t;
			if (!U(e, t, ",")) break;
		}
		return t;
	}
	this.getStatePair = function(e) {
		let t = !1, n, r = !1, i, a, o = [];
		for (let t = 0; t < I.length; t++) {
			let r = !0;
			for (let a = 0; a < I[t].date.length; a++) {
				let o = I[t].date[a], s = !1;
				for (let r = 0; r < o.length; r++) {
					let a = o[r](e);
					a[0] && (s = !0, typeof a[2] == "string" && (i = [a[2], t])), (n === void 0 || typeof a[1] == "object" && a[1].getTime() < n.getTime()) && (n = a[1]);
				}
				if (!s) {
					r = !1;
					break;
				}
			}
			r && ((I[t].date.length > 0 || t > 0 && I[t].meaning && I[t - 1].date.length === 0) && (I[t].meaning || I[t].unknown) && !I[t].wrapped && !I[t].additional && !I[t].fallback && (o = []), o.push(t));
		}
		for (let s = 0; s < o.length; s++) {
			let c = o[s];
			I[c].time.length === 0 && (!I[c].fallback || I[c].fallback && !(t || r)) && (t = I[c].meaning, r = I[c].unknown, a = c);
			for (let o = 0; o < I[c].time.length; o++) {
				let s = I[c].time[o](e);
				if (s[0] && (!I[c].fallback || I[c].fallback && !(t || r))) {
					if (t = I[c].meaning, r = I[c].unknown, a = c, typeof i == "object" && i[0] === p("open end") && (i = void 0), s[2] === !0 && (t || r) && (i = [p("open end"), a], t = !1, r = !0, typeof I[c].time[o + 1] == "function")) {
						let n = I[c].time[o + 1](e);
						!n[0] && typeof n[1] == "object" && I[c].time[o](/* @__PURE__ */ new Date(e.getTime() - 1))[0] && (t = !1, r = !1);
					}
					I[c].fallback && (n === void 0 || s[1] !== void 0 && s[1] < n) && (n = s[1]);
				}
				(n === void 0 || typeof s[1] == "object" && s[1] < n) && (n = s[1]);
			}
		}
		return typeof I[a] == "object" && typeof I[a].comment == "string" ? i = I[a].comment : typeof i == "object" && (i = i[1] === a ? i[0] : void 0), [
			t,
			n,
			r,
			i,
			a
		];
	};
	function je(e, t, n, r, o) {
		let s = "", c = t;
		for (; c <= n;) U(e, c, "weekday") ? (!o.leave_weekday_sep_one_day_betw && c - t > 1 && (U(e, c - 1, ",") || U(e, c - 1, "-")) && U(e, c - 2, "weekday") && e[c][0] === (e[c - 2][0] + 1) % 7 && (s = s.substring(0, s.length - 1) + o.sep_one_day_between), s += a[e[c][0]]) : c - t > 0 && r === "time" && U(e, c - 1, "timesep") && U(e, c, "number") ? s += (e[c][0] < 10 ? "0" : "") + e[c][0].toString() : r === "time" && o.zero_pad_hour && c !== e.length && U(e, c, "number") && U(e, c + 1, "timesep") ? s += (e[c][0] < 10 ? e[c][0] === 0 && o.one_zero_if_hour_zero ? "" : "0" : "") + e[c][0].toString() : r === "time" && c + 2 <= n && U(e, c, "number") && U(e, c + 1, "-") && U(e, c + 2, "number") ? (s += (e[c][0] < 10 ? e[c][0] === 0 && o.one_zero_if_hour_zero ? "" : "0" : "") + e[c][0].toString(), s += ":00-" + (e[c + 2][0] < 10 ? "0" : "") + e[c + 2][0].toString() + ":00", c += 2) : U(e, c, "comment") ? s += "\"" + e[c][0].toString() + "\"" : U(e, c, "closed") ? s += o.leave_off_closed ? e[c][0] : o.keyword_for_off_closed : c - t > 0 && U(e, c, "number") && (r === "month" || r === "week") ? s += (U(e, c - 1, "month") || U(e, c - 1, "week") ? " " : "") + (o.zero_pad_month_and_week_numbers && e[c][4] !== "positive_number" && e[c][0] < 10 ? "0" : "") + e[c][0] : c - t > 0 && U(e, c, "month") && U(e, c - 1, "year") ? s += " " + i[[e[c][0]]] : c - t > 0 && U(e, c, "event") && U(e, c - 1, "year") ? s += " " + e[c][0] : U(e, c, "month") ? (s += i[[e[c][0]]], c + 1 <= n && U(e, c + 1, "weekday") && (s += " ")) : c + 2 <= n && (U(e, c, "-") || U(e, c, "+")) && U(e, c + 1, "number", "calcday") ? (s += " " + e[c][0] + e[c + 1][0] + " day" + (Math.abs(e[c + 1][0]) === 1 ? "" : "s"), c += 2) : c === n && r === "weekday" && e[c][0] === ":" || c === n && r === "time" && e[c][0] === "," || (s += e[c][0].toString()), c++;
		return s;
	}
	this.getState = function(e) {
		return this.getIterator(e).getState();
	}, this.getUnknown = function(e) {
		return this.getIterator(e).getUnknown();
	}, this.getStateString = function(e, t) {
		return this.getIterator(e).getStateString(t);
	}, this.getComment = function(e) {
		return this.getIterator(e).getComment();
	}, this.getMatchingRule = function(e) {
		return this.getIterator(e).getMatchingRule();
	}, this.getWarnings = function() {
		return re(this.getIterator());
	}, this.prettifyValue = function(e) {
		return this.getWarnings(), oe(e);
	}, this.getNextChange = function(e, t) {
		let n = this.getIterator(e);
		if (n.advance(t)) return n.getDate();
	}, this.isWeekStable = function() {
		return k;
	}, this.isEqualTo = function(e, t) {
		t === void 0 && (t = /* @__PURE__ */ new Date());
		let n;
		n = this.isWeekStable() && e.isWeekStable() ? new Date(t.getTime() + u * 10) : new Date(t.getTime() + u * 366 * 5);
		let r = this.getIterator(t), i = e.getIterator(t);
		for (; r.advance(n);) {
			i.advance(n);
			let e = [];
			if (r.getDate().getTime() !== i.getDate().getTime() && e.push("getDate"), r.getState() !== i.getState() && e.push("getState"), r.getUnknown() !== i.getUnknown() && e.push("getUnknown"), r.getComment() !== i.getComment() && e.push("getComment"), e.length) {
				let t = {};
				return t[r.getDate().getTime()] = e, [!1, {
					matching_rule: r.getMatchingRule(),
					matching_rule_other: i.getMatchingRule(),
					deviation_for_time: t
				}];
			}
		}
		return [!0];
	}, this.getOpenIntervals = function(e, t) {
		let n = [], r = this.getIterator(e);
		for ((r.getState() || r.getUnknown()) && n.push([
			e,
			void 0,
			r.getUnknown(),
			r.getComment()
		]); r.advance(t);) r.getState() || r.getUnknown() ? (n.length !== 0 && n[n.length - 1][1] === void 0 && (n[n.length - 1][1] = r.getDate()), n.push([
			r.getDate(),
			void 0,
			r.getUnknown(),
			r.getComment()
		])) : n.length !== 0 && n[n.length - 1][1] === void 0 && (n[n.length - 1][1] = r.getDate());
		return n.length > 0 && n[n.length - 1][1] === void 0 && (n[n.length - 1][1] = t), n;
	}, this.getOpenDuration = function(e, t) {
		let n = 0, r = 0, i = this.getIterator(e), a = i.getState() || i.getUnknown() ? e : void 0, o = i.getState(), s = i.getUnknown();
		for (; i.advance(t);) i.getState() || i.getUnknown() ? (typeof a == "object" && (s ? r += i.getDate().getTime() - a.getTime() : o && (n += i.getDate().getTime() - a.getTime())), a = i.getDate(), o = i.getState(), s = i.getUnknown()) : typeof a == "object" && (s ? r += i.getDate().getTime() - a.getTime() : n += i.getDate().getTime() - a.getTime(), a = void 0);
		return typeof a == "object" && (s ? r += t.getTime() - a.getTime() : n += t.getTime() - a.getTime()), [n, r];
	}, this.getIterator = function(e) {
		return new function(t) {
			e === void 0 && (e = /* @__PURE__ */ new Date());
			let n = [
				void 0,
				e,
				void 0,
				void 0,
				void 0
			], r = t.getStatePair(e);
			this.getDate = function() {
				return n[1];
			}, this.setDate = function(e) {
				if (typeof e != "object") throw p("date parameter needed");
				n = [
					void 0,
					e,
					void 0,
					void 0,
					void 0
				], r = t.getStatePair(e);
			}, this.getState = function() {
				return r[0];
			}, this.getUnknown = function() {
				return r[2];
			}, this.getStateString = function(e) {
				return r[0] ? "open" : r[2] ? "unknown" : e ? "closed" : "close";
			}, this.getComment = function() {
				return r[3];
			}, this.getMatchingRule = function() {
				if (r[4] !== void 0) return I[r[4]].build_from_token_rule[2];
			}, this.advance = function(e) {
				if (e === void 0) e = new Date(n[1].getTime() + u * 366 * 5);
				else if (e.getTime() <= n[1].getTime()) return !1;
				do {
					if (r[1] === void 0) return !1;
					if (r[1].getTime() <= n[1].getTime()) throw "Fatal: infinite loop in nextChange";
					if (r[1].getTime() >= e.getTime()) return !1;
					n = r, r = t.getStatePair(n[1]);
				} while (r[0] === n[0] && r[2] === n[2] && r[3] === n[3]);
				return !0;
			};
		}(this);
	};
}
//#endregion
//#region src/utils/normalizeTimeRestriction.ts
var L = (e) => {
	let t = e.trim();
	if (!t) return null;
	try {
		return new I(t, void 0, 0).prettifyValue();
	} catch {
		return null;
	}
}, R = (e) => e.replaceAll("01:", "1:").replaceAll("02:", "2:").replaceAll("03:", "3:").replaceAll("04:", "4:").replaceAll("05:", "5:").replaceAll("06:", "6:").replaceAll("07:", "7:").replaceAll("08:", "8:").replaceAll("09:", "9:").replaceAll(":00", ""), z = (e) => {
	let t = L(e);
	return t ? R(t) : e.trim();
}, B = (e) => {
	if (!e.recodgnizedSign || !e.valuePrompt?.format || !m(e.valuePrompt.format)) return e.osmValuePart;
	if (typeof e.signValue == "string") return `${e.signId}[${z(e.signValue)}]`;
	let { signId: t, signValue: n } = E(e.osmValuePart);
	return t !== e.signId || !n ? e.osmValuePart : `${e.signId}[${z(n)}]`;
}, V = (e, t) => {
	if (!t) return "";
	let n = !1;
	return e.map((r, i) => {
		let a = B(r), o = h.includes(a), s = "";
		n === !1 && !o && (s = `${t}:`, n = !0);
		let c = i === 0, l = c ? !1 : h.includes(B(e[i - 1]) || "");
		return `${c ? "" : r.kind === "traffic_sign" || l ? ";" : ","}${s}${a}`;
	}).join("");
};
//#endregion
export { v as combineSignIdSignValue, d as countries, y as createSvgImportname, p as getValuePromptInputAttributes, V as signsToTrafficSignTagValue, E as splitSignIdSignValue, k as trafficSignTagToSigns };

//# sourceMappingURL=id-field-browser.js.map