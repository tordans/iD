//#region src/buildToolUrl.ts
var e = "https://trafficsigns.osm-verkehrswende.org", t = ({ countryPrefix: t, tagValue: n }) => {
	let r = n.trim();
	return r ? `${e}/${t}?${new URLSearchParams({ signs: r }).toString()}` : `${e}/${t}`;
}, n = { value: () => {} };
function r() {
	for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
		if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw Error("illegal type: " + r);
		n[r] = [];
	}
	return new i(n);
}
function i(e) {
	this._ = e;
}
function a(e, t) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var n = "", r = e.indexOf(".");
		if (r >= 0 && (n = e.slice(r + 1), e = e.slice(0, r)), e && !t.hasOwnProperty(e)) throw Error("unknown type: " + e);
		return {
			type: e,
			name: n
		};
	});
}
i.prototype = r.prototype = {
	constructor: i,
	on: function(e, t) {
		var n = this._, r = a(e + "", n), i, c = -1, l = r.length;
		if (arguments.length < 2) {
			for (; ++c < l;) if ((i = (e = r[c]).type) && (i = o(n[i], e.name))) return i;
			return;
		}
		if (t != null && typeof t != "function") throw Error("invalid callback: " + t);
		for (; ++c < l;) if (i = (e = r[c]).type) n[i] = s(n[i], e.name, t);
		else if (t == null) for (i in n) n[i] = s(n[i], e.name, null);
		return this;
	},
	copy: function() {
		var e = {}, t = this._;
		for (var n in t) e[n] = t[n].slice();
		return new i(e);
	},
	call: function(e, t) {
		if ((i = arguments.length - 2) > 0) for (var n = Array(i), r = 0, i, a; r < i; ++r) n[r] = arguments[r + 2];
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (a = this._[e], r = 0, i = a.length; r < i; ++r) a[r].value.apply(t, n);
	},
	apply: function(e, t, n) {
		if (!this._.hasOwnProperty(e)) throw Error("unknown type: " + e);
		for (var r = this._[e], i = 0, a = r.length; i < a; ++i) r[i].value.apply(t, n);
	}
};
function o(e, t) {
	for (var n = 0, r = e.length, i; n < r; ++n) if ((i = e[n]).name === t) return i.value;
}
function s(e, t, r) {
	for (var i = 0, a = e.length; i < a; ++i) if (e[i].name === t) {
		e[i] = n, e = e.slice(0, i).concat(e.slice(i + 1));
		break;
	}
	return r != null && e.push({
		name: t,
		value: r
	}), e;
}
var c = {
	svg: "http://www.w3.org/2000/svg",
	xhtml: "http://www.w3.org/1999/xhtml",
	xlink: "http://www.w3.org/1999/xlink",
	xml: "http://www.w3.org/XML/1998/namespace",
	xmlns: "http://www.w3.org/2000/xmlns/"
};
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/namespace.js
function l(e) {
	var t = e += "", n = t.indexOf(":");
	return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), c.hasOwnProperty(t) ? {
		space: c[t],
		local: e
	} : e;
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/creator.js
function u(e) {
	return function() {
		var t = this.ownerDocument, n = this.namespaceURI;
		return n === "http://www.w3.org/1999/xhtml" && t.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml" ? t.createElement(e) : t.createElementNS(n, e);
	};
}
function d(e) {
	return function() {
		return this.ownerDocument.createElementNS(e.space, e.local);
	};
}
function f(e) {
	var t = l(e);
	return (t.local ? d : u)(t);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selector.js
function p() {}
function m(e) {
	return e == null ? p : function() {
		return this.querySelector(e);
	};
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/select.js
function h(e) {
	typeof e != "function" && (e = m(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = Array(o), c, l, u = 0; u < o; ++u) (c = a[u]) && (l = e.call(c, c.__data__, u, a)) && ("__data__" in c && (l.__data__ = c.__data__), s[u] = l);
	return new G(r, this._parents);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/array.js
function g(e) {
	return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selectorAll.js
function _() {
	return [];
}
function v(e) {
	return e == null ? _ : function() {
		return this.querySelectorAll(e);
	};
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/selectAll.js
function y(e) {
	return function() {
		return g(e.apply(this, arguments));
	};
}
function b(e) {
	e = typeof e == "function" ? y(e) : v(e);
	for (var t = this._groups, n = t.length, r = [], i = [], a = 0; a < n; ++a) for (var o = t[a], s = o.length, c, l = 0; l < s; ++l) (c = o[l]) && (r.push(e.call(c, c.__data__, l, o)), i.push(c));
	return new G(r, i);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/matcher.js
function x(e) {
	return function() {
		return this.matches(e);
	};
}
function S(e) {
	return function(t) {
		return t.matches(e);
	};
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/selectChild.js
var C = Array.prototype.find;
function w(e) {
	return function() {
		return C.call(this.children, e);
	};
}
function T() {
	return this.firstElementChild;
}
function ee(e) {
	return this.select(e == null ? T : w(typeof e == "function" ? e : S(e)));
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/selectChildren.js
var E = Array.prototype.filter;
function D() {
	return Array.from(this.children);
}
function O(e) {
	return function() {
		return E.call(this.children, e);
	};
}
function k(e) {
	return this.selectAll(e == null ? D : O(typeof e == "function" ? e : S(e)));
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/filter.js
function A(e) {
	typeof e != "function" && (e = x(e));
	for (var t = this._groups, n = t.length, r = Array(n), i = 0; i < n; ++i) for (var a = t[i], o = a.length, s = r[i] = [], c, l = 0; l < o; ++l) (c = a[l]) && e.call(c, c.__data__, l, a) && s.push(c);
	return new G(r, this._parents);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/sparse.js
function j(e) {
	return Array(e.length);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/enter.js
function te() {
	return new G(this._enter || this._groups.map(j), this._parents);
}
function M(e, t) {
	this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
M.prototype = {
	constructor: M,
	appendChild: function(e) {
		return this._parent.insertBefore(e, this._next);
	},
	insertBefore: function(e, t) {
		return this._parent.insertBefore(e, t);
	},
	querySelector: function(e) {
		return this._parent.querySelector(e);
	},
	querySelectorAll: function(e) {
		return this._parent.querySelectorAll(e);
	}
};
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/constant.js
function N(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/data.js
function ne(e, t, n, r, i, a) {
	for (var o = 0, s, c = t.length, l = a.length; o < l; ++o) (s = t[o]) ? (s.__data__ = a[o], r[o] = s) : n[o] = new M(e, a[o]);
	for (; o < c; ++o) (s = t[o]) && (i[o] = s);
}
function P(e, t, n, r, i, a, o) {
	var s, c, l = /* @__PURE__ */ new Map(), u = t.length, d = a.length, f = Array(u), p;
	for (s = 0; s < u; ++s) (c = t[s]) && (f[s] = p = o.call(c, c.__data__, s, t) + "", l.has(p) ? i[s] = c : l.set(p, c));
	for (s = 0; s < d; ++s) p = o.call(e, a[s], s, a) + "", (c = l.get(p)) ? (r[s] = c, c.__data__ = a[s], l.delete(p)) : n[s] = new M(e, a[s]);
	for (s = 0; s < u; ++s) (c = t[s]) && l.get(f[s]) === c && (i[s] = c);
}
function F(e) {
	return e.__data__;
}
function re(e, t) {
	if (!arguments.length) return Array.from(this, F);
	var n = t ? P : ne, r = this._parents, i = this._groups;
	typeof e != "function" && (e = N(e));
	for (var a = i.length, o = Array(a), s = Array(a), c = Array(a), l = 0; l < a; ++l) {
		var u = r[l], d = i[l], f = d.length, p = ie(e.call(u, u && u.__data__, l, r)), m = p.length, h = s[l] = Array(m), g = o[l] = Array(m);
		n(u, d, h, g, c[l] = Array(f), p, t);
		for (var _ = 0, v = 0, y, b; _ < m; ++_) if (y = h[_]) {
			for (_ >= v && (v = _ + 1); !(b = g[v]) && ++v < m;);
			y._next = b || null;
		}
	}
	return o = new G(o, r), o._enter = s, o._exit = c, o;
}
function ie(e) {
	return typeof e == "object" && "length" in e ? e : Array.from(e);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/exit.js
function ae() {
	return new G(this._exit || this._groups.map(j), this._parents);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/join.js
function oe(e, t, n) {
	var r = this.enter(), i = this, a = this.exit();
	return typeof e == "function" ? (r = e(r), r &&= r.selection()) : r = r.append(e + ""), t != null && (i = t(i), i &&= i.selection()), n == null ? a.remove() : n(a), r && i ? r.merge(i).order() : i;
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/merge.js
function I(e) {
	for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, a = r.length, o = Math.min(i, a), s = Array(i), c = 0; c < o; ++c) for (var l = n[c], u = r[c], d = l.length, f = s[c] = Array(d), p, m = 0; m < d; ++m) (p = l[m] || u[m]) && (f[m] = p);
	for (; c < i; ++c) s[c] = n[c];
	return new G(s, this._parents);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/order.js
function L() {
	for (var e = this._groups, t = -1, n = e.length; ++t < n;) for (var r = e[t], i = r.length - 1, a = r[i], o; --i >= 0;) (o = r[i]) && (a && o.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(o, a), a = o);
	return this;
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/sort.js
function se(e) {
	e ||= ce;
	function t(t, n) {
		return t && n ? e(t.__data__, n.__data__) : !t - !n;
	}
	for (var n = this._groups, r = n.length, i = Array(r), a = 0; a < r; ++a) {
		for (var o = n[a], s = o.length, c = i[a] = Array(s), l, u = 0; u < s; ++u) (l = o[u]) && (c[u] = l);
		c.sort(t);
	}
	return new G(i, this._parents).order();
}
function ce(e, t) {
	return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/call.js
function le() {
	var e = arguments[0];
	return arguments[0] = this, e.apply(null, arguments), this;
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/nodes.js
function ue() {
	return Array.from(this);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/node.js
function R() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length; i < a; ++i) {
		var o = r[i];
		if (o) return o;
	}
	return null;
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/size.js
function z() {
	let e = 0;
	for (let t of this) ++e;
	return e;
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/empty.js
function de() {
	return !this.node();
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/each.js
function fe(e) {
	for (var t = this._groups, n = 0, r = t.length; n < r; ++n) for (var i = t[n], a = 0, o = i.length, s; a < o; ++a) (s = i[a]) && e.call(s, s.__data__, a, i);
	return this;
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/attr.js
function pe(e) {
	return function() {
		this.removeAttribute(e);
	};
}
function B(e) {
	return function() {
		this.removeAttributeNS(e.space, e.local);
	};
}
function me(e, t) {
	return function() {
		this.setAttribute(e, t);
	};
}
function he(e, t) {
	return function() {
		this.setAttributeNS(e.space, e.local, t);
	};
}
function ge(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
	};
}
function V(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
	};
}
function _e(e, t) {
	var n = l(e);
	if (arguments.length < 2) {
		var r = this.node();
		return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
	}
	return this.each((t == null ? n.local ? B : pe : typeof t == "function" ? n.local ? V : ge : n.local ? he : me)(n, t));
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/window.js
function H(e) {
	return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/style.js
function ve(e) {
	return function() {
		this.style.removeProperty(e);
	};
}
function ye(e, t, n) {
	return function() {
		this.style.setProperty(e, t, n);
	};
}
function U(e, t, n) {
	return function() {
		var r = t.apply(this, arguments);
		r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
	};
}
function be(e, t, n) {
	return arguments.length > 1 ? this.each((t == null ? ve : typeof t == "function" ? U : ye)(e, t, n ?? "")) : xe(this.node(), e);
}
function xe(e, t) {
	return e.style.getPropertyValue(t) || H(e).getComputedStyle(e, null).getPropertyValue(t);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/property.js
function Se(e) {
	return function() {
		delete this[e];
	};
}
function Ce(e, t) {
	return function() {
		this[e] = t;
	};
}
function we(e, t) {
	return function() {
		var n = t.apply(this, arguments);
		n == null ? delete this[e] : this[e] = n;
	};
}
function Te(e, t) {
	return arguments.length > 1 ? this.each((t == null ? Se : typeof t == "function" ? we : Ce)(e, t)) : this.node()[e];
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/classed.js
function Ee(e) {
	return e.trim().split(/^|\s+/);
}
function W(e) {
	return e.classList || new De(e);
}
function De(e) {
	this._node = e, this._names = Ee(e.getAttribute("class") || "");
}
De.prototype = {
	add: function(e) {
		this._names.indexOf(e) < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
	},
	remove: function(e) {
		var t = this._names.indexOf(e);
		t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
	},
	contains: function(e) {
		return this._names.indexOf(e) >= 0;
	}
};
function Oe(e, t) {
	for (var n = W(e), r = -1, i = t.length; ++r < i;) n.add(t[r]);
}
function ke(e, t) {
	for (var n = W(e), r = -1, i = t.length; ++r < i;) n.remove(t[r]);
}
function Ae(e) {
	return function() {
		Oe(this, e);
	};
}
function je(e) {
	return function() {
		ke(this, e);
	};
}
function Me(e, t) {
	return function() {
		(t.apply(this, arguments) ? Oe : ke)(this, e);
	};
}
function Ne(e, t) {
	var n = Ee(e + "");
	if (arguments.length < 2) {
		for (var r = W(this.node()), i = -1, a = n.length; ++i < a;) if (!r.contains(n[i])) return !1;
		return !0;
	}
	return this.each((typeof t == "function" ? Me : t ? Ae : je)(n, t));
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/text.js
function Pe() {
	this.textContent = "";
}
function Fe(e) {
	return function() {
		this.textContent = e;
	};
}
function Ie(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.textContent = t ?? "";
	};
}
function Le(e) {
	return arguments.length ? this.each(e == null ? Pe : (typeof e == "function" ? Ie : Fe)(e)) : this.node().textContent;
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/html.js
function Re() {
	this.innerHTML = "";
}
function ze(e) {
	return function() {
		this.innerHTML = e;
	};
}
function Be(e) {
	return function() {
		var t = e.apply(this, arguments);
		this.innerHTML = t ?? "";
	};
}
function Ve(e) {
	return arguments.length ? this.each(e == null ? Re : (typeof e == "function" ? Be : ze)(e)) : this.node().innerHTML;
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/raise.js
function He() {
	this.nextSibling && this.parentNode.appendChild(this);
}
function Ue() {
	return this.each(He);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/lower.js
function We() {
	this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Ge() {
	return this.each(We);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/append.js
function Ke(e) {
	var t = typeof e == "function" ? e : f(e);
	return this.select(function() {
		return this.appendChild(t.apply(this, arguments));
	});
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/insert.js
function qe() {
	return null;
}
function Je(e, t) {
	var n = typeof e == "function" ? e : f(e), r = t == null ? qe : typeof t == "function" ? t : m(t);
	return this.select(function() {
		return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
	});
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/remove.js
function Ye() {
	var e = this.parentNode;
	e && e.removeChild(this);
}
function Xe() {
	return this.each(Ye);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/clone.js
function Ze() {
	var e = this.cloneNode(!1), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Qe() {
	var e = this.cloneNode(!0), t = this.parentNode;
	return t ? t.insertBefore(e, this.nextSibling) : e;
}
function $e(e) {
	return this.select(e ? Qe : Ze);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/datum.js
function et(e) {
	return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/on.js
function tt(e) {
	return function(t) {
		e.call(this, t, this.__data__);
	};
}
function nt(e) {
	return e.trim().split(/^|\s+/).map(function(e) {
		var t = "", n = e.indexOf(".");
		return n >= 0 && (t = e.slice(n + 1), e = e.slice(0, n)), {
			type: e,
			name: t
		};
	});
}
function rt(e) {
	return function() {
		var t = this.__on;
		if (t) {
			for (var n = 0, r = -1, i = t.length, a; n < i; ++n) a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++r] = a;
			++r ? t.length = r : delete this.__on;
		}
	};
}
function it(e, t, n) {
	return function() {
		var r = this.__on, i, a = tt(t);
		if (r) {
			for (var o = 0, s = r.length; o < s; ++o) if ((i = r[o]).type === e.type && i.name === e.name) {
				this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = a, i.options = n), i.value = t;
				return;
			}
		}
		this.addEventListener(e.type, a, n), i = {
			type: e.type,
			name: e.name,
			value: t,
			listener: a,
			options: n
		}, r ? r.push(i) : this.__on = [i];
	};
}
function at(e, t, n) {
	var r = nt(e + ""), i, a = r.length, o;
	if (arguments.length < 2) {
		var s = this.node().__on;
		if (s) {
			for (var c = 0, l = s.length, u; c < l; ++c) for (i = 0, u = s[c]; i < a; ++i) if ((o = r[i]).type === u.type && o.name === u.name) return u.value;
		}
		return;
	}
	for (s = t ? it : rt, i = 0; i < a; ++i) this.each(s(r[i], t, n));
	return this;
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/dispatch.js
function ot(e, t, n) {
	var r = H(e), i = r.CustomEvent;
	typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function st(e, t) {
	return function() {
		return ot(this, e, t);
	};
}
function ct(e, t) {
	return function() {
		return ot(this, e, t.apply(this, arguments));
	};
}
function lt(e, t) {
	return this.each((typeof t == "function" ? ct : st)(e, t));
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/iterator.js
function* ut() {
	for (var e = this._groups, t = 0, n = e.length; t < n; ++t) for (var r = e[t], i = 0, a = r.length, o; i < a; ++i) (o = r[i]) && (yield o);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/selection/index.js
var dt = [null];
function G(e, t) {
	this._groups = e, this._parents = t;
}
function ft() {
	return new G([[document.documentElement]], dt);
}
function pt() {
	return this;
}
G.prototype = ft.prototype = {
	constructor: G,
	select: h,
	selectAll: b,
	selectChild: ee,
	selectChildren: k,
	filter: A,
	data: re,
	enter: te,
	exit: ae,
	join: oe,
	merge: I,
	selection: pt,
	order: L,
	sort: se,
	call: le,
	nodes: ue,
	node: R,
	size: z,
	empty: de,
	each: fe,
	attr: _e,
	style: be,
	property: Te,
	classed: Ne,
	text: Le,
	html: Ve,
	raise: Ue,
	lower: Ge,
	append: Ke,
	insert: Je,
	remove: Xe,
	clone: $e,
	datum: et,
	on: at,
	dispatch: lt,
	[Symbol.iterator]: ut
};
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/select.js
function K(e) {
	return typeof e == "string" ? new G([[document.querySelector(e)]], [document.documentElement]) : new G([[e]], dt);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/sourceEvent.js
function mt(e) {
	let t;
	for (; t = e.sourceEvent;) e = t;
	return e;
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-selection@3.0.0-6dd51b03b6c1d561/node_modules/d3-selection/src/pointer.js
function ht(e, t) {
	if (e = mt(e), t === void 0 && (t = e.currentTarget), t) {
		var n = t.ownerSVGElement || t;
		if (n.createSVGPoint) {
			var r = n.createSVGPoint();
			return r.x = e.clientX, r.y = e.clientY, r = r.matrixTransform(t.getScreenCTM().inverse()), [r.x, r.y];
		}
		if (t.getBoundingClientRect) {
			var i = t.getBoundingClientRect();
			return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
		}
	}
	return [e.pageX, e.pageY];
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-drag@3.0.0-920540fd83b10f23/node_modules/d3-drag/src/noevent.js
var gt = { passive: !1 }, q = {
	capture: !0,
	passive: !1
};
function J(e) {
	e.stopImmediatePropagation();
}
function Y(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-drag@3.0.0-920540fd83b10f23/node_modules/d3-drag/src/nodrag.js
function _t(e) {
	var t = e.document.documentElement, n = K(e).on("dragstart.drag", Y, q);
	"onselectstart" in t ? n.on("selectstart.drag", Y, q) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function vt(e, t) {
	var n = e.document.documentElement, r = K(e).on("dragstart.drag", null);
	t && (r.on("click.drag", Y, q), setTimeout(function() {
		r.on("click.drag", null);
	}, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-drag@3.0.0-920540fd83b10f23/node_modules/d3-drag/src/constant.js
var X = (e) => () => e;
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-drag@3.0.0-920540fd83b10f23/node_modules/d3-drag/src/event.js
function Z(e, { sourceEvent: t, subject: n, target: r, identifier: i, active: a, x: o, y: s, dx: c, dy: l, dispatch: u }) {
	Object.defineProperties(this, {
		type: {
			value: e,
			enumerable: !0,
			configurable: !0
		},
		sourceEvent: {
			value: t,
			enumerable: !0,
			configurable: !0
		},
		subject: {
			value: n,
			enumerable: !0,
			configurable: !0
		},
		target: {
			value: r,
			enumerable: !0,
			configurable: !0
		},
		identifier: {
			value: i,
			enumerable: !0,
			configurable: !0
		},
		active: {
			value: a,
			enumerable: !0,
			configurable: !0
		},
		x: {
			value: o,
			enumerable: !0,
			configurable: !0
		},
		y: {
			value: s,
			enumerable: !0,
			configurable: !0
		},
		dx: {
			value: c,
			enumerable: !0,
			configurable: !0
		},
		dy: {
			value: l,
			enumerable: !0,
			configurable: !0
		},
		_: { value: u }
	});
}
Z.prototype.on = function() {
	var e = this._.on.apply(this._, arguments);
	return e === this._ ? this : e;
};
//#endregion
//#region ../../../../../.bun/install/cache/links/d3-drag@3.0.0-920540fd83b10f23/node_modules/d3-drag/src/drag.js
function yt(e) {
	return !e.ctrlKey && !e.button;
}
function bt() {
	return this.parentNode;
}
function xt(e, t) {
	return t ?? {
		x: e.x,
		y: e.y
	};
}
function St() {
	return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Ct() {
	var e = yt, t = bt, n = xt, i = St, a = {}, o = r("start", "drag", "end"), s = 0, c, l, u, d, f = 0;
	function p(e) {
		e.on("mousedown.drag", m).filter(i).on("touchstart.drag", _).on("touchmove.drag", v, gt).on("touchend.drag touchcancel.drag", y).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	}
	function m(n, r) {
		if (!d && e.call(this, n, r)) {
			var i = b(this, t.call(this, n, r), n, r, "mouse");
			i && (K(n.view).on("mousemove.drag", h, q).on("mouseup.drag", g, q), _t(n.view), J(n), u = !1, c = n.clientX, l = n.clientY, i("start", n));
		}
	}
	function h(e) {
		if (Y(e), !u) {
			var t = e.clientX - c, n = e.clientY - l;
			u = t * t + n * n > f;
		}
		a.mouse("drag", e);
	}
	function g(e) {
		K(e.view).on("mousemove.drag mouseup.drag", null), vt(e.view, u), Y(e), a.mouse("end", e);
	}
	function _(n, r) {
		if (e.call(this, n, r)) for (var i = n.changedTouches, a = t.call(this, n, r), o = i.length, s = 0, c; s < o; ++s) (c = b(this, a, n, r, i[s].identifier, i[s])) && (J(n), c("start", n, i[s]));
	}
	function v(e) {
		for (var t = e.changedTouches, n = t.length, r = 0, i; r < n; ++r) (i = a[t[r].identifier]) && (Y(e), i("drag", e, t[r]));
	}
	function y(e) {
		var t = e.changedTouches, n = t.length, r, i;
		for (d && clearTimeout(d), d = setTimeout(function() {
			d = null;
		}, 500), r = 0; r < n; ++r) (i = a[t[r].identifier]) && (J(e), i("end", e, t[r]));
	}
	function b(e, t, r, i, c, l) {
		var u = o.copy(), d = ht(l || r, t), f, m, h;
		if ((h = n.call(e, new Z("beforestart", {
			sourceEvent: r,
			target: p,
			identifier: c,
			active: s,
			x: d[0],
			y: d[1],
			dx: 0,
			dy: 0,
			dispatch: u
		}), i)) != null) return f = h.x - d[0] || 0, m = h.y - d[1] || 0, function n(r, o, l) {
			var g = d, _;
			switch (r) {
				case "start":
					a[c] = n, _ = s++;
					break;
				case "end": delete a[c], --s;
				case "drag": d = ht(l || o, t), _ = s;
			}
			u.call(r, e, new Z(r, {
				sourceEvent: o,
				subject: h,
				target: p,
				identifier: c,
				active: _,
				x: d[0] + f,
				y: d[1] + m,
				dx: d[0] - g[0],
				dy: d[1] - g[1],
				dispatch: u
			}), i);
		};
	}
	return p.filter = function(t) {
		return arguments.length ? (e = typeof t == "function" ? t : X(!!t), p) : e;
	}, p.container = function(e) {
		return arguments.length ? (t = typeof e == "function" ? e : X(e), p) : t;
	}, p.subject = function(e) {
		return arguments.length ? (n = typeof e == "function" ? e : X(e), p) : n;
	}, p.touchable = function(e) {
		return arguments.length ? (i = typeof e == "function" ? e : X(!!e), p) : i;
	}, p.on = function() {
		var e = o.on.apply(o, arguments);
		return e === o ? p : e;
	}, p.clickDistance = function(e) {
		return arguments.length ? (f = (e = +e) * e, p) : Math.sqrt(f);
	}, p;
}
//#endregion
//#region src/resolveCountryPrefix.ts
var wt = /^([A-Z]{2}):/, Tt = (e) => {
	if (e && !Array.isArray(e)) return e.match(wt)?.[1];
}, Et = async ({ tagValue: e, entityIDs: t, context: n, adapters: r, converter: i }) => {
	let a = Tt(e);
	if (a && i.countries.includes(a)) return a;
	if (t.length > 0) {
		let e = r.utilTotalExtent(t, n.graph()), a = (e && r.countryCoder.iso1A2Code(e.center()))?.toUpperCase();
		if (a && i.countries.includes(a)) return a;
	}
	return i.countries[0];
}, Dt = (e) => {
	let t = e.catalogue?.focus;
	return t ? Object.values(t).includes("highlight") : !1;
}, Ot = (e, t) => {
	let n = (e.signId ?? "").toLowerCase(), r = e.osmValuePart.toLowerCase();
	if (n === t || r === t) return 0;
	if (n.startsWith(t) || r.startsWith(t)) return 1;
	let i = [e.name, e.descriptiveName].filter((e) => !!e).map((e) => e.toLowerCase());
	return i.some((e) => e.startsWith(t)) ? 2 : i.some((e) => e.split(/\s+/).some((e) => e.startsWith(t))) ? 3 : i.some((e) => e.includes(t)) ? 4 : n.includes(t) || r.includes(t) ? 5 : e.description?.toLowerCase().includes(t) ? 6 : null;
}, kt = (e, t, n) => {
	let r = n?.exclude, i = r ? e.filter((e) => !r(e)) : e, a = t.trim().toLowerCase();
	if (!a) return i.map((e, t) => ({
		sign: e,
		index: t,
		promoted: Dt(e)
	})).sort((e, t) => Number(t.promoted) - Number(e.promoted) || e.index - t.index).map((e) => e.sign);
	let o = [];
	for (let e of i) {
		let t = Ot(e, a);
		t !== null && o.push({
			sign: e,
			score: t,
			promoted: Dt(e)
		});
	}
	return o.sort((e, t) => e.score - t.score || Number(t.promoted) - Number(e.promoted)).map((e) => e.sign);
}, At = (e, t) => {
	let n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
	for (let e of t) {
		if (!e.recodgnizedSign || !e.signId) continue;
		n.add(e.signId);
		let t = "compatibility" in e ? e.compatibility?.incompatibleModifiers : void 0;
		for (let e of t ?? []) r.add(e);
	}
	return e.signId && r.has(e.signId) ? !0 : (e.compatibility?.incompatibleModifiers ?? []).some((e) => n.has(e));
}, jt = /* @__PURE__ */ new Set([
	"cycleway",
	"footway",
	"path",
	"pedestrian",
	"track",
	"bridleway",
	"steps"
]), Mt = /* @__PURE__ */ new Set([
	"bicycle",
	"foot",
	"segregated"
]), Nt = (e) => {
	if (e === "traffic_sign") return { kind: "self" };
	let t = e.match(/^(cycleway|sidewalk)(?::(left|right|both))?:traffic_sign$/);
	if (t) return {
		kind: "side",
		prefix: t[1],
		side: t[2]
	};
}, Pt = (e, t) => (n) => {
	let r = e.trafficSignTagToSigns(n, t);
	return Object.fromEntries(e.signsToTags(r, t, "way"));
}, Ft = (e, t) => {
	try {
		return e(t);
	} catch {
		return {};
	}
}, It = (e, t, n) => {
	let r = {};
	if (t.kind === "side") {
		let n = t.side ? `${t.prefix}:${t.side}` : t.prefix;
		for (let [t, i] of Object.entries(e)) Mt.has(t) && typeof i == "string" && (r[`${n}:${t}`] = i);
		return r;
	}
	let i = e.highway, a = n.highway;
	if (Array.isArray(i) && i.length && a && !i.includes(a)) {
		if (!jt.has(a)) return {};
		r.highway = i[0];
	}
	for (let [t, n] of Object.entries(e)) t !== "highway" && t !== "traffic_sign" && typeof n == "string" && (r[t] = n);
	return r;
}, Lt = ({ key: e, tags: t, previousSign: n, originalTags: r, recommend: i }) => {
	let a = Nt(e), o = t[e];
	if (!a || n === o) return;
	let s = [], c = o ? Ft(i, o) : {}, l = o ? It(c, a, t) : {};
	o && typeof c.traffic_sign == "string" && c.traffic_sign !== o && s.push({
		kind: "change",
		key: e,
		value: c.traffic_sign,
		from: o,
		cause: "normalize"
	});
	for (let [e, n] of Object.entries(l)) {
		let r = t[e];
		r === void 0 ? s.push({
			kind: "add",
			key: e,
			value: n,
			cause: "sign"
		}) : r !== n && s.push({
			kind: "change",
			key: e,
			value: n,
			from: r,
			cause: "sign"
		});
	}
	if (n) {
		let e = It(Ft(i, n), a, t);
		for (let [n, i] of Object.entries(e)) {
			if (n === "highway" || n in l || t[n] !== i) continue;
			let e = r?.[n];
			e !== void 0 && e !== i ? s.push({
				kind: "change",
				key: n,
				value: e,
				from: i,
				cause: "restore"
			}) : s.push({
				kind: "remove",
				key: n,
				value: i,
				cause: "previous_sign"
			});
		}
	}
	return s;
}, Rt = (e) => {
	let t = {};
	for (let n of e) t[n.key] = n.kind === "remove" ? void 0 : n.value;
	return t;
}, Q = (e, t, n) => !t || Array.isArray(t) || !n ? [] : e.trafficSignTagToSigns(t, n), zt = (e, t, n) => {
	if (n && t.length !== 0) return e.signsToTrafficSignTagValue(t, n) || void 0;
}, Bt = 300, $ = (e) => e.recodgnizedSign && "valuePrompt" in e && !!e.valuePrompt, Vt = (e, n, i) => {
	let a = r("change"), { uiCombobox: o, utilGetSetValue: s, utilNoAuto: c, utilRebind: l, svgIcon: u, t: d, loadConverter: f, loadCountryCatalogue: p, getSvgAssetUrl: m } = i, h = K(null), g = K(null), _ = K(null), v = K(null), y = K(null), b = [], x = {}, S = [], C, w = null, T = null, ee = null, E = /* @__PURE__ */ new Map(), D = !1, O, k = null, A = o(n, "traffic-sign-" + (e.safeid || e.key)), j = () => (ee ??= f().then(async (e) => {
		T = e;
	}), ee), te = async (e) => {
		if (!e) {
			w = null;
			return;
		}
		try {
			w = (await p(e)).trafficSignData;
		} catch {
			w = null;
		}
	}, M = () => {
		let t = x[e.key];
		return Array.isArray(t) ? void 0 : t;
	}, N = (e, t, n = {}) => d(e, {
		default: t,
		...n
	}).replace(/\{(\w+)\}/g, (e, t) => n[t] ?? e), ne = (e) => {
		D ? e !== O && (k = O, O = e) : (D = !0, O = e);
	}, P = (t) => {
		if (!T) return;
		S = t, V(), B();
		let n = zt(T, t, C), r = { [e.key]: n };
		a.call("change", U, r);
	}, F = async () => {
		if (await j(), !T) return;
		let e = M();
		C = await Et({
			tagValue: e,
			entityIDs: b,
			context: n,
			adapters: i,
			converter: T
		}), await te(C), S = Q(T, e, C), V(), B(), me(), oe();
	}, re = (e, t, n) => {
		switch (e.cause) {
			case "normalize": return N("traffic_sign_field.suggestions.cause.normalize", "The usual way to write this sign");
			case "restore": return N("traffic_sign_field.suggestions.cause.restore", "Was implied by the previous sign {sign}; back to the downloaded value", { sign: n });
			case "previous_sign": return N("traffic_sign_field.suggestions.cause.previous_sign", "Was implied by the previous sign {sign}", { sign: n });
			default: return N("traffic_sign_field.suggestions.cause.sign", "{sign} implies this", { sign: t });
		}
	}, ie = () => {
		if (b.length !== 1) return;
		let e = {};
		for (let [t, n] of Object.entries(x)) {
			if (Array.isArray(n)) return;
			n !== void 0 && (e[t] = n);
		}
		return e;
	}, ae = () => {
		if (i.suggestTags === !1 || !T || !C) return [];
		let t = ie();
		if (!t) return [];
		let r = n.history?.().base().hasEntity(b[0])?.tags, a = k === null ? r?.[e.key] : k;
		return (Lt({
			key: e.key,
			tags: t,
			previousSign: a,
			originalTags: r,
			recommend: Pt(T, C)
		}) ?? []).map((n) => ({
			row: n,
			reason: re(n, t[e.key] ?? "", a ?? "")
		}));
	}, oe = () => {
		if (h.empty()) return;
		let e = ae(), t = h.selectAll(".traffic-sign-suggestions").data(e.length ? [0] : []);
		t.exit().remove();
		let n = t.enter().insert("div", () => g.node()?.nextSibling ?? null).attr("class", "traffic-sign-suggestions");
		n.append("div").attr("class", "traffic-sign-suggestions__header").text(N("traffic_sign_field.suggestions.header", "The traffic sign suggests these tags:")), n.append("ul").attr("class", "traffic-sign-suggestions__list"), n.append("button").attr("type", "button").attr("class", "button action traffic-sign-suggestions__apply").text(N("traffic_sign_field.suggestions.apply", "Apply these tags"));
		let r = n.merge(t);
		if (!e.length) return;
		let i = r.select(".traffic-sign-suggestions__list").selectAll("li").data(e);
		i.exit().remove(), i.enter().append("li").merge(i).attr("class", (e) => {
			let { row: t } = e;
			return `traffic-sign-suggestions__item traffic-sign-suggestions__item--${t.kind}`;
		}).each(function(e) {
			let { row: t, reason: n } = e, r = K(this).text(""), i = t.kind === "change" ? `${t.key}: ${t.from} → ${t.value}` : `${t.key}=${t.value}`;
			r.append("code").text(i), r.append("span").attr("class", "traffic-sign-suggestions__reason").text(n);
		}), r.select(".traffic-sign-suggestions__apply").on("click", (t) => {
			t.preventDefault();
			let n = Rt(e.map(({ row: e }) => e));
			a.call("change", U, n);
		});
	}, I = (e) => "descriptiveName" in e && e.descriptiveName ? e.descriptiveName : "name" in e && e.name ? e.name : e.osmValuePart, L = (e) => e.osmValuePart === "none", se = (e) => L(e) ? N("traffic_sign_field.no_sign", "No sign") : e.recodgnizedSign ? I(e) : N("traffic_sign_field.unknown_sign", "Unknown sign"), ce = (e) => L(e) ? N("traffic_sign_field.no_sign_description", "There is explicitly no traffic sign here (traffic_sign=none)") : e.recodgnizedSign ? "description" in e && e.description ? e.description : "name" in e && e.name ? e.name : I(e) : N("traffic_sign_field.unknown_sign", "Unknown sign"), le = (e) => !T || !C ? null : e.svgName ? e.svgName : T.createSvgImportname(C, e.osmValuePart), ue = (e) => "signValue" in e && e.signValue !== void 0 && e.signValue !== "" ? e.signValue : e.valuePrompt.defaultValue ?? "", R = (e) => {
		let t = E.get(e);
		t && (clearTimeout(t), E.delete(e));
	}, z = (e, t) => {
		if (!T) return;
		let n = S[e];
		if (!n || !$(n)) return;
		let { signId: r } = T.splitSignIdSignValue(n.osmValuePart), i = n.valuePrompt.defaultValue, a = t || i, o = {
			...n,
			signValue: t,
			osmValuePart: T.combineSignIdSignValue(r, a)
		};
		S = S.map((t, n) => n === e ? o : t), P(S);
	}, de = (e, t) => {
		R(e), E.set(e, setTimeout(() => {
			E.delete(e), z(e, t);
		}, Bt));
	}, fe = (e) => {
		R(e), S = S.filter((t, n) => n !== e), P(S);
	}, pe = (e, t) => {
		let n = e + t;
		if (n < 0 || n >= S.length) return;
		let r = [...S], [i] = r.splice(e, 1);
		i && (r.splice(n, 0, i), S = r, P(S), _.selectAll(".traffic-sign-row__drag").nodes()[n]?.focus());
	}, B = () => {
		if (h.empty()) return;
		let e = h.select(".field-label").selectAll(".traffic-sign-tool-link").data([0]), n = e.enter().insert("button", ".remove-icon").attr("type", "button").attr("class", "traffic-sign-tool-link").attr("title", N("traffic_sign_field.open_tool", "Open in Traffic Sign Tool")).call(u("#iD-icon-out-link")).on("click", (e) => {
			if (e.preventDefault(), e.stopPropagation(), !C) return;
			let n = M() || "";
			window.open(t({
				countryPrefix: C,
				tagValue: n
			}), "_blank", "noopener");
		}).merge(e);
		if (!C) {
			n.style("display", "none");
			return;
		}
		n.style("display", null);
	}, me = () => {
		if (h.empty()) return;
		let e = h.select(".tag-reference-body");
		if (e.empty()) return;
		let t = e.selectAll(".traffic-sign-order-hint").data([0]);
		t.enter().append("p").attr("class", "tag-reference-description traffic-sign-order-hint").merge(t).text(N("traffic_sign_field.order_hint", "Signs are read top to bottom. The top sign is the main sign."));
	}, he = (t, n) => {
		let r = $(n.sign) ? [n] : [], i = t.selectAll(".traffic-sign-row__value-prompt").data(r);
		i.exit().remove();
		let a = i.enter().append("label").attr("class", "traffic-sign-row__value-prompt");
		a.append("span").attr("class", "traffic-sign-row__value-label"), a.append("input").attr("type", "text").attr("class", "traffic-sign-row__value-input").call(c).on("input", function(e, t) {
			let n = t, r = e.target;
			de(n.index, r.value);
		}).on("blur", function(e, t) {
			let n = t, r = e.target;
			R(n.index), z(n.index, r.value);
		});
		let o = a.merge(i);
		o.select(".traffic-sign-row__value-label").text((e) => $(e.sign) ? `${e.sign.valuePrompt.prompt}:` : "").attr("title", (e) => $(e.sign) ? e.sign.valuePrompt.prompt : null), o.select(".traffic-sign-row__value-input").each(function(t) {
			if (!$(t.sign) || !T) return;
			let n = K(this), r = n.node(), { type: i, step: a } = T.getValuePromptInputAttributes(t.sign.valuePrompt.format), o = ue(t.sign);
			n.attr("type", i).attr("step", a ?? null).attr("id", `${e.domId || e.key}-value-${t.index}`), document.activeElement !== r && n.property("value", o);
		});
	}, ge = (e) => ("signId" in e.sign && e.sign.signId || e.sign.osmValuePart) + ":" + e.index, V = () => {
		if (_.empty()) return;
		let e = _.selectAll(".traffic-sign-empty").data(S.length === 0 ? [0] : []);
		e.exit().remove(), e.enter().append("li").attr("class", "traffic-sign-empty").text(N("traffic_sign_field.empty", "No signs yet. Search below by name or sign ID to add one."));
		let t = _.selectAll(".traffic-sign-row").data(S.map((e, t) => ({
			index: t,
			sign: e
		})), ge);
		t.exit().remove();
		let n = t.enter().append("li").attr("class", "traffic-sign-row chip").each(function(e) {
			let t = K(this);
			t.append("button").attr("type", "button").attr("class", "traffic-sign-row__drag").attr("title", N("traffic_sign_field.drag", "Drag or use arrow keys to reorder")).attr("aria-label", N("traffic_sign_field.drag", "Drag or use arrow keys to reorder")).text("⋮⋮").on("keydown", (e, t) => {
				let n = e;
				(n.key === "ArrowUp" || n.key === "ArrowDown") && (n.preventDefault(), n.stopPropagation(), pe(t.index, n.key === "ArrowUp" ? -1 : 1));
			});
			let n = t.append("figure").attr("class", "traffic-sign-row__icon");
			if (e.sign.recodgnizedSign && C) {
				let t = le(e.sign);
				t && n.append("img").attr("class", "traffic-sign-row__img").attr("src", m(C, t)).attr("alt", I(e.sign));
			} else L(e.sign) ? n.append("span").attr("class", "traffic-sign-row__unknown traffic-sign-row__none").text("–") : n.append("span").attr("class", "traffic-sign-row__unknown").text("?");
			let r = t.append("div").attr("class", "traffic-sign-row__body");
			r.append("div").attr("class", "traffic-sign-row__title").text(se(e.sign)), r.append("div").attr("class", "traffic-sign-row__meta").append("code").attr("class", "traffic-sign-row__code").text(e.sign.osmValuePart), t.append("button").attr("type", "button").attr("class", "traffic-sign-row__remove remove-icon").attr("title", N("icons.remove", "remove")).call(u("#iD-operation-delete")).on("click", (e, t) => {
				e.preventDefault(), e.stopPropagation(), fe(t.index);
			});
		}).merge(t);
		n.select(".traffic-sign-row__drag"), n.select(".traffic-sign-row__remove"), n.attr("title", (e) => ce(e.sign)), n.select(".traffic-sign-row__title").text((e) => se(e.sign)), n.select(".traffic-sign-row__code").text((e) => e.sign.osmValuePart), n.select(".traffic-sign-row__img").attr("src", (e) => {
			if (!e.sign.recodgnizedSign || !C) return null;
			let t = le(e.sign);
			return t ? m(C, t) : null;
		}), n.each(function(e) {
			he(K(this).select(".traffic-sign-row__meta"), e);
		}), _e(n);
	}, _e = (e) => {
		let t, n = null;
		e.call(Ct().on("start", function(e) {
			t = {
				x: e.x,
				y: e.y
			}, n = null;
		}).on("drag", function(r) {
			let i = K(this), a = i.node(), o = r.x - t.x, s = r.y - t.y;
			if (!i.classed("dragging") && Math.sqrt(o * o + s * s) <= 5) return;
			let c = e.nodes().indexOf(a);
			i.classed("dragging", !0), n = null, _.selectAll(".traffic-sign-row").style("transform", function(e, t) {
				let i = this;
				return c === t ? `translate(${o}px, ${s}px)` : t > c && r.y > i.offsetTop ? (n = n === null || t > n ? t : n, "translateY(-100%)") : t < c && r.y < i.offsetTop + i.offsetHeight ? (n = n === null || t < n ? t : n, "translateY(100%)") : null;
			});
		}).on("end", function() {
			if (!K(this).classed("dragging")) return;
			let r = e.nodes().indexOf(this);
			if (K(this).classed("dragging", !1), _.selectAll(".traffic-sign-row").style("transform", null), typeof n == "number" && r !== n) {
				let e = [...S], [t] = e.splice(r, 1);
				t && (e.splice(n, 0, t), S = e, P(S));
			}
			t = void 0, n = null;
		}));
	}, H = (e) => {
		let t = n.cleanTagValue(e.trim());
		if (!t || !T || !C) return;
		let r = Q(T, t, C);
		if (r.length > 0 && r.every((e) => !e.recodgnizedSign) && w) {
			let [e] = kt(w, t, { exclude: (e) => At(e, S) });
			if (e) r = Q(T, e.osmValuePart, C);
			else if (kt(w, t).length > 0) return;
		}
		r.length !== 0 && (S = [...S, ...r], s(y, ""), P(S));
	}, ve = (e) => {
		let t = e.descriptiveName || e.name;
		return {
			key: e.osmValuePart,
			value: e.osmValuePart,
			title: e.description || e.name || t,
			display: (n) => {
				let r = n.append("span").attr("class", "traffic-sign-option");
				if (T && C) {
					let t = T.createSvgImportname(C, e.osmValuePart);
					t && r.append("img").attr("class", "traffic-sign-option__img").attr("src", m(C, t)).attr("alt", "").attr("loading", "lazy").attr("decoding", "async").on("error", function() {
						this.remove();
					});
				}
				let i = r.append("span").attr("class", "traffic-sign-option__body");
				i.append("span").attr("class", "traffic-sign-option__title").text(t), i.append("code").attr("class", "traffic-sign-option__code").text(e.osmValuePart);
			}
		};
	}, ye = (e, t) => {
		A.off && A.off(n), e.call(A.caseSensitive(!0).minItems(1).fetcher((e, t) => {
			if (!w) {
				t([]);
				return;
			}
			t(kt(w, e, { exclude: (e) => At(e, S) }).map(ve));
		}), t);
	};
	function U(t) {
		j().then(() => {
			h = t, g = t.selectAll(".form-field-input-wrap").data([0]), g = g.enter().append("div").attr("class", "form-field-input-wrap form-field-input-traffic-sign").merge(g), _ = g.selectAll(".traffic-sign-list").data([0]), _ = _.enter().append("ul").attr("class", "traffic-sign-list chiplist full-line-chips").merge(_), v = g.selectAll(".traffic-sign-add-row").data([0]), v = v.enter().append("div").attr("class", "traffic-sign-add-row").merge(v), y = v.selectAll("input").data([0]), y = y.enter().append("input").attr("type", "text").attr("dir", "auto").attr("id", e.domId || void 0).attr("placeholder", N("traffic_sign_field.add_sign", "Add sign…")).merge(y).call(c).call(ye, g), y.on("change", () => H(s(y))).on("keydown.field", (e) => {
				e.key === "Enter" && (y.node()?.blur(), e.stopPropagation());
			}).on("focus", () => g.classed("active", !0)).on("blur", () => g.classed("active", !1)), A.on("accept", (e) => {
				H(e?.value ?? s(y)), window.setTimeout(() => y.node()?.focus(), 10);
			}), F();
		});
	}
	return U.tags = function(t) {
		x = t;
		let n = t[e.key];
		return ne(typeof n == "string" ? n : void 0), F(), U;
	}, U.entityIDs = function(e) {
		return e.join() !== b.join() && (D = !1, k = null), b = e, U;
	}, U.focus = function() {
		return y.node()?.focus(), U;
	}, l(U, a, "on");
};
//#endregion
export { t as buildToolUrl, Vt as createTrafficSignField, Q as parseTagToSigns, zt as serializeSignsToTag };

//# sourceMappingURL=id-field.esm.js.map