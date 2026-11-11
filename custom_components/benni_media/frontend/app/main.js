//#region \0rolldown/runtime.js
var e = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), t = /* @__PURE__ */ e(((e) => {
	function t(e, t) {
		var n = e.length;
		e.push(t);
		a: for (; 0 < n;) {
			var r = n - 1 >>> 1, a = e[r];
			if (0 < i(a, t)) e[r] = t, e[n] = a, n = r;
			else break a;
		}
	}
	function n(e) {
		return e.length === 0 ? null : e[0];
	}
	function r(e) {
		if (e.length === 0) return null;
		var t = e[0], n = e.pop();
		if (n !== t) {
			e[0] = n;
			a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
				var s = 2 * (r + 1) - 1, c = e[s], l = s + 1, u = e[l];
				if (0 > i(c, n)) l < a && 0 > i(u, c) ? (e[r] = u, e[l] = n, r = l) : (e[r] = c, e[s] = n, r = s);
				else if (l < a && 0 > i(u, n)) e[r] = u, e[l] = n, r = l;
				else break a;
			}
		}
		return t;
	}
	function i(e, t) {
		var n = e.sortIndex - t.sortIndex;
		return n === 0 ? e.id - t.id : n;
	}
	if (e.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
		var a = performance;
		e.unstable_now = function() {
			return a.now();
		};
	} else {
		var o = Date, s = o.now();
		e.unstable_now = function() {
			return o.now() - s;
		};
	}
	var c = [], l = [], u = 1, d = null, f = 3, p = !1, m = !1, h = !1, g = !1, _ = typeof setTimeout == "function" ? setTimeout : null, v = typeof clearTimeout == "function" ? clearTimeout : null, y = typeof setImmediate < "u" ? setImmediate : null;
	function b(e) {
		for (var i = n(l); i !== null;) {
			if (i.callback === null) r(l);
			else if (i.startTime <= e) r(l), i.sortIndex = i.expirationTime, t(c, i);
			else break;
			i = n(l);
		}
	}
	function x(e) {
		if (h = !1, b(e), !m) if (n(c) !== null) m = !0, ee || (ee = !0, T());
		else {
			var t = n(l);
			t !== null && E(x, t.startTime - e);
		}
	}
	var ee = !1, S = -1, C = 5, te = -1;
	function w() {
		return g ? !0 : !(e.unstable_now() - te < C);
	}
	function ne() {
		if (g = !1, ee) {
			var t = e.unstable_now();
			te = t;
			var i = !0;
			try {
				a: {
					m = !1, h && (h = !1, v(S), S = -1), p = !0;
					var a = f;
					try {
						b: {
							for (b(t), d = n(c); d !== null && !(d.expirationTime > t && w());) {
								var o = d.callback;
								if (typeof o == "function") {
									d.callback = null, f = d.priorityLevel;
									var s = o(d.expirationTime <= t);
									if (t = e.unstable_now(), typeof s == "function") {
										d.callback = s, b(t), i = !0;
										break b;
									}
									d === n(c) && r(c), b(t);
								} else r(c);
								d = n(c);
							}
							if (d !== null) i = !0;
							else {
								var u = n(l);
								u !== null && E(x, u.startTime - t), i = !1;
							}
						}
						break a;
					} finally {
						d = null, f = a, p = !1;
					}
					i = void 0;
				}
			} finally {
				i ? T() : ee = !1;
			}
		}
	}
	var T;
	if (typeof y == "function") T = function() {
		y(ne);
	};
	else if (typeof MessageChannel < "u") {
		var re = new MessageChannel(), ie = re.port2;
		re.port1.onmessage = ne, T = function() {
			ie.postMessage(null);
		};
	} else T = function() {
		_(ne, 0);
	};
	function E(t, n) {
		S = _(function() {
			t(e.unstable_now());
		}, n);
	}
	e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(e) {
		e.callback = null;
	}, e.unstable_forceFrameRate = function(e) {
		0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : C = 0 < e ? Math.floor(1e3 / e) : 5;
	}, e.unstable_getCurrentPriorityLevel = function() {
		return f;
	}, e.unstable_next = function(e) {
		switch (f) {
			case 1:
			case 2:
			case 3:
				var t = 3;
				break;
			default: t = f;
		}
		var n = f;
		f = t;
		try {
			return e();
		} finally {
			f = n;
		}
	}, e.unstable_requestPaint = function() {
		g = !0;
	}, e.unstable_runWithPriority = function(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5: break;
			default: e = 3;
		}
		var n = f;
		f = e;
		try {
			return t();
		} finally {
			f = n;
		}
	}, e.unstable_scheduleCallback = function(r, i, a) {
		var o = e.unstable_now();
		switch (typeof a == "object" && a ? (a = a.delay, a = typeof a == "number" && 0 < a ? o + a : o) : a = o, r) {
			case 1:
				var s = -1;
				break;
			case 2:
				s = 250;
				break;
			case 5:
				s = 1073741823;
				break;
			case 4:
				s = 1e4;
				break;
			default: s = 5e3;
		}
		return s = a + s, r = {
			id: u++,
			callback: i,
			priorityLevel: r,
			startTime: a,
			expirationTime: s,
			sortIndex: -1
		}, a > o ? (r.sortIndex = a, t(l, r), n(c) === null && r === n(l) && (h ? (v(S), S = -1) : h = !0, E(x, a - o))) : (r.sortIndex = s, t(c, r), m || p || (m = !0, ee || (ee = !0, T()))), r;
	}, e.unstable_shouldYield = w, e.unstable_wrapCallback = function(e) {
		var t = f;
		return function() {
			var n = f;
			f = t;
			try {
				return e.apply(this, arguments);
			} finally {
				f = n;
			}
		};
	};
})), n = /* @__PURE__ */ e(((e, n) => {
	n.exports = t();
})), r = /* @__PURE__ */ e(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), a = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), s = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), l = Symbol.for("react.suspense"), u = Symbol.for("react.memo"), d = Symbol.for("react.lazy"), f = Symbol.for("react.activity"), p = Symbol.iterator;
	function m(e) {
		return typeof e != "object" || !e ? null : (e = p && e[p] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var h = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	}, g = Object.assign, _ = {};
	function v(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	v.prototype.isReactComponent = {}, v.prototype.setState = function(e, t) {
		if (typeof e != "object" && typeof e != "function" && e != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, e, t, "setState");
	}, v.prototype.forceUpdate = function(e) {
		this.updater.enqueueForceUpdate(this, e, "forceUpdate");
	};
	function y() {}
	y.prototype = v.prototype;
	function b(e, t, n) {
		this.props = e, this.context = t, this.refs = _, this.updater = n || h;
	}
	var x = b.prototype = new y();
	x.constructor = b, g(x, v.prototype), x.isPureReactComponent = !0;
	var ee = Array.isArray;
	function S() {}
	var C = {
		H: null,
		A: null,
		T: null,
		S: null
	}, te = Object.prototype.hasOwnProperty;
	function w(e, n, r) {
		var i = r.ref;
		return {
			$$typeof: t,
			type: e,
			key: n,
			ref: i === void 0 ? null : i,
			props: r
		};
	}
	function ne(e, t) {
		return w(e.type, t, e.props);
	}
	function T(e) {
		return typeof e == "object" && !!e && e.$$typeof === t;
	}
	function re(e) {
		var t = {
			"=": "=0",
			":": "=2"
		};
		return "$" + e.replace(/[=:]/g, function(e) {
			return t[e];
		});
	}
	var ie = /\/+/g;
	function E(e, t) {
		return typeof e == "object" && e && e.key != null ? re("" + e.key) : t.toString(36);
	}
	function ae(e) {
		switch (e.status) {
			case "fulfilled": return e.value;
			case "rejected": throw e.reason;
			default: switch (typeof e.status == "string" ? e.then(S, S) : (e.status = "pending", e.then(function(t) {
				e.status === "pending" && (e.status = "fulfilled", e.value = t);
			}, function(t) {
				e.status === "pending" && (e.status = "rejected", e.reason = t);
			})), e.status) {
				case "fulfilled": return e.value;
				case "rejected": throw e.reason;
			}
		}
		throw e;
	}
	function oe(e, r, i, a, o) {
		var s = typeof e;
		(s === "undefined" || s === "boolean") && (e = null);
		var c = !1;
		if (e === null) c = !0;
		else switch (s) {
			case "bigint":
			case "string":
			case "number":
				c = !0;
				break;
			case "object": switch (e.$$typeof) {
				case t:
				case n:
					c = !0;
					break;
				case d: return c = e._init, oe(c(e._payload), r, i, a, o);
			}
		}
		if (c) return o = o(e), c = a === "" ? "." + E(e, 0) : a, ee(o) ? (i = "", c != null && (i = c.replace(ie, "$&/") + "/"), oe(o, r, i, "", function(e) {
			return e;
		})) : o != null && (T(o) && (o = ne(o, i + (o.key == null || e && e.key === o.key ? "" : ("" + o.key).replace(ie, "$&/") + "/") + c)), r.push(o)), 1;
		c = 0;
		var l = a === "" ? "." : a + ":";
		if (ee(e)) for (var u = 0; u < e.length; u++) a = e[u], s = l + E(a, u), c += oe(a, r, i, s, o);
		else if (u = m(e), typeof u == "function") for (e = u.call(e), u = 0; !(a = e.next()).done;) a = a.value, s = l + E(a, u++), c += oe(a, r, i, s, o);
		else if (s === "object") {
			if (typeof e.then == "function") return oe(ae(e), r, i, a, o);
			throw r = String(e), Error("Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead.");
		}
		return c;
	}
	function se(e, t, n) {
		if (e == null) return e;
		var r = [], i = 0;
		return oe(e, r, "", "", function(e) {
			return t.call(n, e, i++);
		}), r;
	}
	function ce(e) {
		if (e._status === -1) {
			var t = e._result;
			t = t(), t.then(function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 1, e._result = t);
			}, function(t) {
				(e._status === 0 || e._status === -1) && (e._status = 2, e._result = t);
			}), e._status === -1 && (e._status = 0, e._result = t);
		}
		if (e._status === 1) return e._result.default;
		throw e._result;
	}
	var D = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, O = {
		map: se,
		forEach: function(e, t, n) {
			se(e, function() {
				t.apply(this, arguments);
			}, n);
		},
		count: function(e) {
			var t = 0;
			return se(e, function() {
				t++;
			}), t;
		},
		toArray: function(e) {
			return se(e, function(e) {
				return e;
			}) || [];
		},
		only: function(e) {
			if (!T(e)) throw Error("React.Children.only expected to receive a single React element child.");
			return e;
		}
	};
	e.Activity = f, e.Children = O, e.Component = v, e.Fragment = r, e.Profiler = a, e.PureComponent = b, e.StrictMode = i, e.Suspense = l, e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = C, e.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(e) {
			return C.H.useMemoCache(e);
		}
	}, e.cache = function(e) {
		return function() {
			return e.apply(null, arguments);
		};
	}, e.cacheSignal = function() {
		return null;
	}, e.cloneElement = function(e, t, n) {
		if (e == null) throw Error("The argument must be a React element, but you passed " + e + ".");
		var r = g({}, e.props), i = e.key;
		if (t != null) for (a in t.key !== void 0 && (i = "" + t.key), t) !te.call(t, a) || a === "key" || a === "__self" || a === "__source" || a === "ref" && t.ref === void 0 || (r[a] = t[a]);
		var a = arguments.length - 2;
		if (a === 1) r.children = n;
		else if (1 < a) {
			for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
			r.children = o;
		}
		return w(e.type, i, r);
	}, e.createContext = function(e) {
		return e = {
			$$typeof: s,
			_currentValue: e,
			_currentValue2: e,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, e.Provider = e, e.Consumer = {
			$$typeof: o,
			_context: e
		}, e;
	}, e.createElement = function(e, t, n) {
		var r, i = {}, a = null;
		if (t != null) for (r in t.key !== void 0 && (a = "" + t.key), t) te.call(t, r) && r !== "key" && r !== "__self" && r !== "__source" && (i[r] = t[r]);
		var o = arguments.length - 2;
		if (o === 1) i.children = n;
		else if (1 < o) {
			for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
			i.children = s;
		}
		if (e && e.defaultProps) for (r in o = e.defaultProps, o) i[r] === void 0 && (i[r] = o[r]);
		return w(e, a, i);
	}, e.createRef = function() {
		return { current: null };
	}, e.forwardRef = function(e) {
		return {
			$$typeof: c,
			render: e
		};
	}, e.isValidElement = T, e.lazy = function(e) {
		return {
			$$typeof: d,
			_payload: {
				_status: -1,
				_result: e
			},
			_init: ce
		};
	}, e.memo = function(e, t) {
		return {
			$$typeof: u,
			type: e,
			compare: t === void 0 ? null : t
		};
	}, e.startTransition = function(e) {
		var t = C.T, n = {};
		C.T = n;
		try {
			var r = e(), i = C.S;
			i !== null && i(n, r), typeof r == "object" && r && typeof r.then == "function" && r.then(S, D);
		} catch (e) {
			D(e);
		} finally {
			t !== null && n.types !== null && (t.types = n.types), C.T = t;
		}
	}, e.unstable_useCacheRefresh = function() {
		return C.H.useCacheRefresh();
	}, e.use = function(e) {
		return C.H.use(e);
	}, e.useActionState = function(e, t, n) {
		return C.H.useActionState(e, t, n);
	}, e.useCallback = function(e, t) {
		return C.H.useCallback(e, t);
	}, e.useContext = function(e) {
		return C.H.useContext(e);
	}, e.useDebugValue = function() {}, e.useDeferredValue = function(e, t) {
		return C.H.useDeferredValue(e, t);
	}, e.useEffect = function(e, t) {
		return C.H.useEffect(e, t);
	}, e.useEffectEvent = function(e) {
		return C.H.useEffectEvent(e);
	}, e.useId = function() {
		return C.H.useId();
	}, e.useImperativeHandle = function(e, t, n) {
		return C.H.useImperativeHandle(e, t, n);
	}, e.useInsertionEffect = function(e, t) {
		return C.H.useInsertionEffect(e, t);
	}, e.useLayoutEffect = function(e, t) {
		return C.H.useLayoutEffect(e, t);
	}, e.useMemo = function(e, t) {
		return C.H.useMemo(e, t);
	}, e.useOptimistic = function(e, t) {
		return C.H.useOptimistic(e, t);
	}, e.useReducer = function(e, t, n) {
		return C.H.useReducer(e, t, n);
	}, e.useRef = function(e) {
		return C.H.useRef(e);
	}, e.useState = function(e) {
		return C.H.useState(e);
	}, e.useSyncExternalStore = function(e, t, n) {
		return C.H.useSyncExternalStore(e, t, n);
	}, e.useTransition = function() {
		return C.H.useTransition();
	}, e.version = "19.2.7";
})), i = /* @__PURE__ */ e(((e, t) => {
	t.exports = r();
})), a = /* @__PURE__ */ e(((e) => {
	var t = i();
	function n(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function r() {}
	var a = {
		d: {
			f: r,
			r: function() {
				throw Error(n(522));
			},
			D: r,
			C: r,
			L: r,
			m: r,
			X: r,
			S: r,
			M: r
		},
		p: 0,
		findDOMNode: null
	}, o = Symbol.for("react.portal");
	function s(e, t, n) {
		var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: o,
			key: r == null ? null : "" + r,
			children: e,
			containerInfo: t,
			implementation: n
		};
	}
	var c = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function l(e, t) {
		if (e === "font") return "";
		if (typeof t == "string") return t === "use-credentials" ? t : "";
	}
	e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = a, e.createPortal = function(e, t) {
		var r = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11) throw Error(n(299));
		return s(e, t, null, r);
	}, e.flushSync = function(e) {
		var t = c.T, n = a.p;
		try {
			if (c.T = null, a.p = 2, e) return e();
		} finally {
			c.T = t, a.p = n, a.d.f();
		}
	}, e.preconnect = function(e, t) {
		typeof e == "string" && (t ? (t = t.crossOrigin, t = typeof t == "string" ? t === "use-credentials" ? t : "" : void 0) : t = null, a.d.C(e, t));
	}, e.prefetchDNS = function(e) {
		typeof e == "string" && a.d.D(e);
	}, e.preinit = function(e, t) {
		if (typeof e == "string" && t && typeof t.as == "string") {
			var n = t.as, r = l(n, t.crossOrigin), i = typeof t.integrity == "string" ? t.integrity : void 0, o = typeof t.fetchPriority == "string" ? t.fetchPriority : void 0;
			n === "style" ? a.d.S(e, typeof t.precedence == "string" ? t.precedence : void 0, {
				crossOrigin: r,
				integrity: i,
				fetchPriority: o
			}) : n === "script" && a.d.X(e, {
				crossOrigin: r,
				integrity: i,
				fetchPriority: o,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0
			});
		}
	}, e.preinitModule = function(e, t) {
		if (typeof e == "string") if (typeof t == "object" && t) {
			if (t.as == null || t.as === "script") {
				var n = l(t.as, t.crossOrigin);
				a.d.M(e, {
					crossOrigin: n,
					integrity: typeof t.integrity == "string" ? t.integrity : void 0,
					nonce: typeof t.nonce == "string" ? t.nonce : void 0
				});
			}
		} else t ?? a.d.M(e);
	}, e.preload = function(e, t) {
		if (typeof e == "string" && typeof t == "object" && t && typeof t.as == "string") {
			var n = t.as, r = l(n, t.crossOrigin);
			a.d.L(e, n, {
				crossOrigin: r,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0,
				nonce: typeof t.nonce == "string" ? t.nonce : void 0,
				type: typeof t.type == "string" ? t.type : void 0,
				fetchPriority: typeof t.fetchPriority == "string" ? t.fetchPriority : void 0,
				referrerPolicy: typeof t.referrerPolicy == "string" ? t.referrerPolicy : void 0,
				imageSrcSet: typeof t.imageSrcSet == "string" ? t.imageSrcSet : void 0,
				imageSizes: typeof t.imageSizes == "string" ? t.imageSizes : void 0,
				media: typeof t.media == "string" ? t.media : void 0
			});
		}
	}, e.preloadModule = function(e, t) {
		if (typeof e == "string") if (t) {
			var n = l(t.as, t.crossOrigin);
			a.d.m(e, {
				as: typeof t.as == "string" && t.as !== "script" ? t.as : void 0,
				crossOrigin: n,
				integrity: typeof t.integrity == "string" ? t.integrity : void 0
			});
		} else a.d.m(e);
	}, e.requestFormReset = function(e) {
		a.d.r(e);
	}, e.unstable_batchedUpdates = function(e, t) {
		return e(t);
	}, e.useFormState = function(e, t, n) {
		return c.H.useFormState(e, t, n);
	}, e.useFormStatus = function() {
		return c.H.useHostTransitionStatus();
	}, e.version = "19.2.7";
})), o = /* @__PURE__ */ e(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = a();
})), s = /* @__PURE__ */ e(((e) => {
	var t = n(), r = i(), a = o();
	function s(e) {
		var t = "https://react.dev/errors/" + e;
		if (1 < arguments.length) {
			t += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
		}
		return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function c(e) {
		return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
	}
	function l(e) {
		var t = e, n = e;
		if (e.alternate) for (; t.return;) t = t.return;
		else {
			e = t;
			do
				t = e, t.flags & 4098 && (n = t.return), e = t.return;
			while (e);
		}
		return t.tag === 3 ? n : null;
	}
	function u(e) {
		if (e.tag === 13) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function d(e) {
		if (e.tag === 31) {
			var t = e.memoizedState;
			if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
		}
		return null;
	}
	function f(e) {
		if (l(e) !== e) throw Error(s(188));
	}
	function p(e) {
		var t = e.alternate;
		if (!t) {
			if (t = l(e), t === null) throw Error(s(188));
			return t === e ? e : null;
		}
		for (var n = e, r = t;;) {
			var i = n.return;
			if (i === null) break;
			var a = i.alternate;
			if (a === null) {
				if (r = i.return, r !== null) {
					n = r;
					continue;
				}
				break;
			}
			if (i.child === a.child) {
				for (a = i.child; a;) {
					if (a === n) return f(i), e;
					if (a === r) return f(i), t;
					a = a.sibling;
				}
				throw Error(s(188));
			}
			if (n.return !== r.return) n = i, r = a;
			else {
				for (var o = !1, c = i.child; c;) {
					if (c === n) {
						o = !0, n = i, r = a;
						break;
					}
					if (c === r) {
						o = !0, r = i, n = a;
						break;
					}
					c = c.sibling;
				}
				if (!o) {
					for (c = a.child; c;) {
						if (c === n) {
							o = !0, n = a, r = i;
							break;
						}
						if (c === r) {
							o = !0, r = a, n = i;
							break;
						}
						c = c.sibling;
					}
					if (!o) throw Error(s(189));
				}
			}
			if (n.alternate !== r) throw Error(s(190));
		}
		if (n.tag !== 3) throw Error(s(188));
		return n.stateNode.current === n ? e : t;
	}
	function m(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e;
		for (e = e.child; e !== null;) {
			if (t = m(e), t !== null) return t;
			e = e.sibling;
		}
		return null;
	}
	var h = Object.assign, g = Symbol.for("react.element"), _ = Symbol.for("react.transitional.element"), v = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), b = Symbol.for("react.strict_mode"), x = Symbol.for("react.profiler"), ee = Symbol.for("react.consumer"), S = Symbol.for("react.context"), C = Symbol.for("react.forward_ref"), te = Symbol.for("react.suspense"), w = Symbol.for("react.suspense_list"), ne = Symbol.for("react.memo"), T = Symbol.for("react.lazy"), re = Symbol.for("react.activity"), ie = Symbol.for("react.memo_cache_sentinel"), E = Symbol.iterator;
	function ae(e) {
		return typeof e != "object" || !e ? null : (e = E && e[E] || e["@@iterator"], typeof e == "function" ? e : null);
	}
	var oe = Symbol.for("react.client.reference");
	function se(e) {
		if (e == null) return null;
		if (typeof e == "function") return e.$$typeof === oe ? null : e.displayName || e.name || null;
		if (typeof e == "string") return e;
		switch (e) {
			case y: return "Fragment";
			case x: return "Profiler";
			case b: return "StrictMode";
			case te: return "Suspense";
			case w: return "SuspenseList";
			case re: return "Activity";
		}
		if (typeof e == "object") switch (e.$$typeof) {
			case v: return "Portal";
			case S: return e.displayName || "Context";
			case ee: return (e._context.displayName || "Context") + ".Consumer";
			case C:
				var t = e.render;
				return e = e.displayName, e ||= (e = t.displayName || t.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
			case ne: return t = e.displayName || null, t === null ? se(e.type) || "Memo" : t;
			case T:
				t = e._payload, e = e._init;
				try {
					return se(e(t));
				} catch {}
		}
		return null;
	}
	var ce = Array.isArray, D = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, O = a.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, le = {
		pending: !1,
		data: null,
		method: null,
		action: null
	}, ue = [], de = -1;
	function fe(e) {
		return { current: e };
	}
	function pe(e) {
		0 > de || (e.current = ue[de], ue[de] = null, de--);
	}
	function k(e, t) {
		de++, ue[de] = e.current, e.current = t;
	}
	var me = fe(null), he = fe(null), ge = fe(null), _e = fe(null);
	function ve(e, t) {
		switch (k(ge, t), k(he, e), k(me, null), t.nodeType) {
			case 9:
			case 11:
				e = (e = t.documentElement) && (e = e.namespaceURI) ? Vd(e) : 0;
				break;
			default: if (e = t.tagName, t = t.namespaceURI) t = Vd(t), e = Hd(t, e);
			else switch (e) {
				case "svg":
					e = 1;
					break;
				case "math":
					e = 2;
					break;
				default: e = 0;
			}
		}
		pe(me), k(me, e);
	}
	function ye() {
		pe(me), pe(he), pe(ge);
	}
	function be(e) {
		e.memoizedState !== null && k(_e, e);
		var t = me.current, n = Hd(t, e.type);
		t !== n && (k(he, e), k(me, n));
	}
	function xe(e) {
		he.current === e && (pe(me), pe(he)), _e.current === e && (pe(_e), Qf._currentValue = le);
	}
	var Se, Ce;
	function we(e) {
		if (Se === void 0) try {
			throw Error();
		} catch (e) {
			var t = e.stack.trim().match(/\n( *(at )?)/);
			Se = t && t[1] || "", Ce = -1 < e.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
		}
		return "\n" + Se + e + Ce;
	}
	var Te = !1;
	function Ee(e, t) {
		if (!e || Te) return "";
		Te = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var r = { DetermineComponentFrameRoot: function() {
				try {
					if (t) {
						var n = function() {
							throw Error();
						};
						if (Object.defineProperty(n.prototype, "props", { set: function() {
							throw Error();
						} }), typeof Reflect == "object" && Reflect.construct) {
							try {
								Reflect.construct(n, []);
							} catch (e) {
								var r = e;
							}
							Reflect.construct(e, [], n);
						} else {
							try {
								n.call();
							} catch (e) {
								r = e;
							}
							e.call(n.prototype);
						}
					} else {
						try {
							throw Error();
						} catch (e) {
							r = e;
						}
						(n = e()) && typeof n.catch == "function" && n.catch(function() {});
					}
				} catch (e) {
					if (e && r && typeof e.stack == "string") return [e.stack, r.stack];
				}
				return [null, null];
			} };
			r.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(r.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
			var a = r.DetermineComponentFrameRoot(), o = a[0], s = a[1];
			if (o && s) {
				var c = o.split("\n"), l = s.split("\n");
				for (i = r = 0; r < c.length && !c[r].includes("DetermineComponentFrameRoot");) r++;
				for (; i < l.length && !l[i].includes("DetermineComponentFrameRoot");) i++;
				if (r === c.length || i === l.length) for (r = c.length - 1, i = l.length - 1; 1 <= r && 0 <= i && c[r] !== l[i];) i--;
				for (; 1 <= r && 0 <= i; r--, i--) if (c[r] !== l[i]) {
					if (r !== 1 || i !== 1) do
						if (r--, i--, 0 > i || c[r] !== l[i]) {
							var u = "\n" + c[r].replace(" at new ", " at ");
							return e.displayName && u.includes("<anonymous>") && (u = u.replace("<anonymous>", e.displayName)), u;
						}
					while (1 <= r && 0 <= i);
					break;
				}
			}
		} finally {
			Te = !1, Error.prepareStackTrace = n;
		}
		return (n = e ? e.displayName || e.name : "") ? we(n) : "";
	}
	function De(e, t) {
		switch (e.tag) {
			case 26:
			case 27:
			case 5: return we(e.type);
			case 16: return we("Lazy");
			case 13: return e.child !== t && t !== null ? we("Suspense Fallback") : we("Suspense");
			case 19: return we("SuspenseList");
			case 0:
			case 15: return Ee(e.type, !1);
			case 11: return Ee(e.type.render, !1);
			case 1: return Ee(e.type, !0);
			case 31: return we("Activity");
			default: return "";
		}
	}
	function Oe(e) {
		try {
			var t = "", n = null;
			do
				t += De(e, n), n = e, e = e.return;
			while (e);
			return t;
		} catch (e) {
			return "\nError generating stack: " + e.message + "\n" + e.stack;
		}
	}
	var ke = Object.prototype.hasOwnProperty, Ae = t.unstable_scheduleCallback, A = t.unstable_cancelCallback, je = t.unstable_shouldYield, Me = t.unstable_requestPaint, Ne = t.unstable_now, Pe = t.unstable_getCurrentPriorityLevel, Fe = t.unstable_ImmediatePriority, j = t.unstable_UserBlockingPriority, M = t.unstable_NormalPriority, N = t.unstable_LowPriority, Ie = t.unstable_IdlePriority, Le = t.log, Re = t.unstable_setDisableYieldValue, ze = null, Be = null;
	function Ve(e) {
		if (typeof Le == "function" && Re(e), Be && typeof Be.setStrictMode == "function") try {
			Be.setStrictMode(ze, e);
		} catch {}
	}
	var He = Math.clz32 ? Math.clz32 : Ge, Ue = Math.log, We = Math.LN2;
	function Ge(e) {
		return e >>>= 0, e === 0 ? 32 : 31 - (Ue(e) / We | 0) | 0;
	}
	var Ke = 256, qe = 262144, P = 4194304;
	function Je(e) {
		var t = e & 42;
		if (t !== 0) return t;
		switch (e & -e) {
			case 1: return 1;
			case 2: return 2;
			case 4: return 4;
			case 8: return 8;
			case 16: return 16;
			case 32: return 32;
			case 64: return 64;
			case 128: return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072: return e & 261888;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return e & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return e & 62914560;
			case 67108864: return 67108864;
			case 134217728: return 134217728;
			case 268435456: return 268435456;
			case 536870912: return 536870912;
			case 1073741824: return 0;
			default: return e;
		}
	}
	function Ye(e, t, n) {
		var r = e.pendingLanes;
		if (r === 0) return 0;
		var i = 0, a = e.suspendedLanes, o = e.pingedLanes;
		e = e.warmLanes;
		var s = r & 134217727;
		return s === 0 ? (s = r & ~a, s === 0 ? o === 0 ? n || (n = r & ~e, n !== 0 && (i = Je(n))) : i = Je(o) : i = Je(s)) : (r = s & ~a, r === 0 ? (o &= s, o === 0 ? n || (n = s & ~e, n !== 0 && (i = Je(n))) : i = Je(o)) : i = Je(r)), i === 0 ? 0 : t !== 0 && t !== i && (t & a) === 0 && (a = i & -i, n = t & -t, a >= n || a === 32 && n & 4194048) ? t : i;
	}
	function Xe(e, t) {
		return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
	}
	function Ze(e, t) {
		switch (e) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64: return t + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152: return t + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432: return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824: return -1;
			default: return -1;
		}
	}
	function Qe() {
		var e = P;
		return P <<= 1, !(P & 62914560) && (P = 4194304), e;
	}
	function $e(e) {
		for (var t = [], n = 0; 31 > n; n++) t.push(e);
		return t;
	}
	function et(e, t) {
		e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
	}
	function tt(e, t, n, r, i, a) {
		var o = e.pendingLanes;
		e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= n, e.entangledLanes &= n, e.errorRecoveryDisabledLanes &= n, e.shellSuspendCounter = 0;
		var s = e.entanglements, c = e.expirationTimes, l = e.hiddenUpdates;
		for (n = o & ~n; 0 < n;) {
			var u = 31 - He(n), d = 1 << u;
			s[u] = 0, c[u] = -1;
			var f = l[u];
			if (f !== null) for (l[u] = null, u = 0; u < f.length; u++) {
				var p = f[u];
				p !== null && (p.lane &= -536870913);
			}
			n &= ~d;
		}
		r !== 0 && nt(e, r, 0), a !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= a & ~(o & ~t));
	}
	function nt(e, t, n) {
		e.pendingLanes |= t, e.suspendedLanes &= ~t;
		var r = 31 - He(t);
		e.entangledLanes |= t, e.entanglements[r] = e.entanglements[r] | 1073741824 | n & 261930;
	}
	function rt(e, t) {
		var n = e.entangledLanes |= t;
		for (e = e.entanglements; n;) {
			var r = 31 - He(n), i = 1 << r;
			i & t | e[r] & t && (e[r] |= t), n &= ~i;
		}
	}
	function it(e, t) {
		var n = t & -t;
		return n = n & 42 ? 1 : at(n), (n & (e.suspendedLanes | t)) === 0 ? n : 0;
	}
	function at(e) {
		switch (e) {
			case 2:
				e = 1;
				break;
			case 8:
				e = 4;
				break;
			case 32:
				e = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				e = 128;
				break;
			case 268435456:
				e = 134217728;
				break;
			default: e = 0;
		}
		return e;
	}
	function ot(e) {
		return e &= -e, 2 < e ? 8 < e ? e & 134217727 ? 32 : 268435456 : 8 : 2;
	}
	function st() {
		var e = O.p;
		return e === 0 ? (e = window.event, e === void 0 ? 32 : mp(e.type)) : e;
	}
	function ct(e, t) {
		var n = O.p;
		try {
			return O.p = e, t();
		} finally {
			O.p = n;
		}
	}
	var lt = Math.random().toString(36).slice(2), ut = "__reactFiber$" + lt, dt = "__reactProps$" + lt, ft = "__reactContainer$" + lt, pt = "__reactEvents$" + lt, mt = "__reactListeners$" + lt, ht = "__reactHandles$" + lt, gt = "__reactResources$" + lt, _t = "__reactMarker$" + lt;
	function vt(e) {
		delete e[ut], delete e[dt], delete e[pt], delete e[mt], delete e[ht];
	}
	function yt(e) {
		var t = e[ut];
		if (t) return t;
		for (var n = e.parentNode; n;) {
			if (t = n[ft] || n[ut]) {
				if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = df(e); e !== null;) {
					if (n = e[ut]) return n;
					e = df(e);
				}
				return t;
			}
			e = n, n = e.parentNode;
		}
		return null;
	}
	function bt(e) {
		if (e = e[ut] || e[ft]) {
			var t = e.tag;
			if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
		}
		return null;
	}
	function xt(e) {
		var t = e.tag;
		if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
		throw Error(s(33));
	}
	function St(e) {
		var t = e[gt];
		return t ||= e[gt] = {
			hoistableStyles: /* @__PURE__ */ new Map(),
			hoistableScripts: /* @__PURE__ */ new Map()
		}, t;
	}
	function F(e) {
		e[_t] = !0;
	}
	var Ct = /* @__PURE__ */ new Set(), wt = {};
	function Tt(e, t) {
		Et(e, t), Et(e + "Capture", t);
	}
	function Et(e, t) {
		for (wt[e] = t, e = 0; e < t.length; e++) Ct.add(t[e]);
	}
	var Dt = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Ot = {}, kt = {};
	function At(e) {
		return ke.call(kt, e) ? !0 : ke.call(Ot, e) ? !1 : Dt.test(e) ? kt[e] = !0 : (Ot[e] = !0, !1);
	}
	function jt(e, t, n) {
		if (At(t)) if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
					e.removeAttribute(t);
					return;
				case "boolean":
					var r = t.toLowerCase().slice(0, 5);
					if (r !== "data-" && r !== "aria-") {
						e.removeAttribute(t);
						return;
					}
			}
			e.setAttribute(t, "" + n);
		}
	}
	function Mt(e, t, n) {
		if (n === null) e.removeAttribute(t);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(t);
					return;
			}
			e.setAttribute(t, "" + n);
		}
	}
	function Nt(e, t, n, r) {
		if (r === null) e.removeAttribute(n);
		else {
			switch (typeof r) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					e.removeAttribute(n);
					return;
			}
			e.setAttributeNS(t, n, "" + r);
		}
	}
	function Pt(e) {
		switch (typeof e) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined": return e;
			case "object": return e;
			default: return "";
		}
	}
	function Ft(e) {
		var t = e.type;
		return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
	}
	function It(e, t, n) {
		var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
		if (!e.hasOwnProperty(t) && r !== void 0 && typeof r.get == "function" && typeof r.set == "function") {
			var i = r.get, a = r.set;
			return Object.defineProperty(e, t, {
				configurable: !0,
				get: function() {
					return i.call(this);
				},
				set: function(e) {
					n = "" + e, a.call(this, e);
				}
			}), Object.defineProperty(e, t, { enumerable: r.enumerable }), {
				getValue: function() {
					return n;
				},
				setValue: function(e) {
					n = "" + e;
				},
				stopTracking: function() {
					e._valueTracker = null, delete e[t];
				}
			};
		}
	}
	function Lt(e) {
		if (!e._valueTracker) {
			var t = Ft(e) ? "checked" : "value";
			e._valueTracker = It(e, t, "" + e[t]);
		}
	}
	function Rt(e) {
		if (!e) return !1;
		var t = e._valueTracker;
		if (!t) return !0;
		var n = t.getValue(), r = "";
		return e && (r = Ft(e) ? e.checked ? "true" : "false" : e.value), e = r, e === n ? !1 : (t.setValue(e), !0);
	}
	function zt(e) {
		if (e ||= typeof document < "u" ? document : void 0, e === void 0) return null;
		try {
			return e.activeElement || e.body;
		} catch {
			return e.body;
		}
	}
	var Bt = /[\n"\\]/g;
	function Vt(e) {
		return e.replace(Bt, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " ";
		});
	}
	function Ht(e, t, n, r, i, a, o, s) {
		e.name = "", o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.type = o : e.removeAttribute("type"), t == null ? o !== "submit" && o !== "reset" || e.removeAttribute("value") : o === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Pt(t)) : e.value !== "" + Pt(t) && (e.value = "" + Pt(t)), t == null ? n == null ? r != null && e.removeAttribute("value") : Wt(e, o, Pt(n)) : Wt(e, o, Pt(t)), i == null && a != null && (e.defaultChecked = !!a), i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"), s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? e.name = "" + Pt(s) : e.removeAttribute("name");
	}
	function Ut(e, t, n, r, i, a, o, s) {
		if (a != null && typeof a != "function" && typeof a != "symbol" && typeof a != "boolean" && (e.type = a), t != null || n != null) {
			if (!(a !== "submit" && a !== "reset" || t != null)) {
				Lt(e);
				return;
			}
			n = n == null ? "" : "" + Pt(n), t = t == null ? n : "" + Pt(t), s || t === e.value || (e.value = t), e.defaultValue = t;
		}
		r ??= i, r = typeof r != "function" && typeof r != "symbol" && !!r, e.checked = s ? e.checked : !!r, e.defaultChecked = !!r, o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (e.name = o), Lt(e);
	}
	function Wt(e, t, n) {
		t === "number" && zt(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n);
	}
	function Gt(e, t, n, r) {
		if (e = e.options, t) {
			t = {};
			for (var i = 0; i < n.length; i++) t["$" + n[i]] = !0;
			for (n = 0; n < e.length; n++) i = t.hasOwnProperty("$" + e[n].value), e[n].selected !== i && (e[n].selected = i), i && r && (e[n].defaultSelected = !0);
		} else {
			for (n = "" + Pt(n), t = null, i = 0; i < e.length; i++) {
				if (e[i].value === n) {
					e[i].selected = !0, r && (e[i].defaultSelected = !0);
					return;
				}
				t !== null || e[i].disabled || (t = e[i]);
			}
			t !== null && (t.selected = !0);
		}
	}
	function Kt(e, t, n) {
		if (t != null && (t = "" + Pt(t), t !== e.value && (e.value = t), n == null)) {
			e.defaultValue !== t && (e.defaultValue = t);
			return;
		}
		e.defaultValue = n == null ? "" : "" + Pt(n);
	}
	function qt(e, t, n, r) {
		if (t == null) {
			if (r != null) {
				if (n != null) throw Error(s(92));
				if (ce(r)) {
					if (1 < r.length) throw Error(s(93));
					r = r[0];
				}
				n = r;
			}
			n ??= "", t = n;
		}
		n = Pt(t), e.defaultValue = n, r = e.textContent, r === n && r !== "" && r !== null && (e.value = r), Lt(e);
	}
	function Jt(e, t) {
		if (t) {
			var n = e.firstChild;
			if (n && n === e.lastChild && n.nodeType === 3) {
				n.nodeValue = t;
				return;
			}
		}
		e.textContent = t;
	}
	var Yt = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
	function Xt(e, t, n) {
		var r = t.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? r ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : r ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Yt.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px";
	}
	function Zt(e, t, n) {
		if (t != null && typeof t != "object") throw Error(s(62));
		if (e = e.style, n != null) {
			for (var r in n) !n.hasOwnProperty(r) || t != null && t.hasOwnProperty(r) || (r.indexOf("--") === 0 ? e.setProperty(r, "") : r === "float" ? e.cssFloat = "" : e[r] = "");
			for (var i in t) r = t[i], t.hasOwnProperty(i) && n[i] !== r && Xt(e, i, r);
		} else for (var a in t) t.hasOwnProperty(a) && Xt(e, a, t[a]);
	}
	function Qt(e) {
		if (e.indexOf("-") === -1) return !1;
		switch (e) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph": return !1;
			default: return !0;
		}
	}
	var $t = /* @__PURE__ */ new Map([
		["acceptCharset", "accept-charset"],
		["htmlFor", "for"],
		["httpEquiv", "http-equiv"],
		["crossOrigin", "crossorigin"],
		["accentHeight", "accent-height"],
		["alignmentBaseline", "alignment-baseline"],
		["arabicForm", "arabic-form"],
		["baselineShift", "baseline-shift"],
		["capHeight", "cap-height"],
		["clipPath", "clip-path"],
		["clipRule", "clip-rule"],
		["colorInterpolation", "color-interpolation"],
		["colorInterpolationFilters", "color-interpolation-filters"],
		["colorProfile", "color-profile"],
		["colorRendering", "color-rendering"],
		["dominantBaseline", "dominant-baseline"],
		["enableBackground", "enable-background"],
		["fillOpacity", "fill-opacity"],
		["fillRule", "fill-rule"],
		["floodColor", "flood-color"],
		["floodOpacity", "flood-opacity"],
		["fontFamily", "font-family"],
		["fontSize", "font-size"],
		["fontSizeAdjust", "font-size-adjust"],
		["fontStretch", "font-stretch"],
		["fontStyle", "font-style"],
		["fontVariant", "font-variant"],
		["fontWeight", "font-weight"],
		["glyphName", "glyph-name"],
		["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
		["glyphOrientationVertical", "glyph-orientation-vertical"],
		["horizAdvX", "horiz-adv-x"],
		["horizOriginX", "horiz-origin-x"],
		["imageRendering", "image-rendering"],
		["letterSpacing", "letter-spacing"],
		["lightingColor", "lighting-color"],
		["markerEnd", "marker-end"],
		["markerMid", "marker-mid"],
		["markerStart", "marker-start"],
		["overlinePosition", "overline-position"],
		["overlineThickness", "overline-thickness"],
		["paintOrder", "paint-order"],
		["panose-1", "panose-1"],
		["pointerEvents", "pointer-events"],
		["renderingIntent", "rendering-intent"],
		["shapeRendering", "shape-rendering"],
		["stopColor", "stop-color"],
		["stopOpacity", "stop-opacity"],
		["strikethroughPosition", "strikethrough-position"],
		["strikethroughThickness", "strikethrough-thickness"],
		["strokeDasharray", "stroke-dasharray"],
		["strokeDashoffset", "stroke-dashoffset"],
		["strokeLinecap", "stroke-linecap"],
		["strokeLinejoin", "stroke-linejoin"],
		["strokeMiterlimit", "stroke-miterlimit"],
		["strokeOpacity", "stroke-opacity"],
		["strokeWidth", "stroke-width"],
		["textAnchor", "text-anchor"],
		["textDecoration", "text-decoration"],
		["textRendering", "text-rendering"],
		["transformOrigin", "transform-origin"],
		["underlinePosition", "underline-position"],
		["underlineThickness", "underline-thickness"],
		["unicodeBidi", "unicode-bidi"],
		["unicodeRange", "unicode-range"],
		["unitsPerEm", "units-per-em"],
		["vAlphabetic", "v-alphabetic"],
		["vHanging", "v-hanging"],
		["vIdeographic", "v-ideographic"],
		["vMathematical", "v-mathematical"],
		["vectorEffect", "vector-effect"],
		["vertAdvY", "vert-adv-y"],
		["vertOriginX", "vert-origin-x"],
		["vertOriginY", "vert-origin-y"],
		["wordSpacing", "word-spacing"],
		["writingMode", "writing-mode"],
		["xmlnsXlink", "xmlns:xlink"],
		["xHeight", "x-height"]
	]), en = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
	function tn(e) {
		return en.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
	}
	function nn() {}
	var rn = null;
	function an(e) {
		return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
	}
	var on = null, sn = null;
	function cn(e) {
		var t = bt(e);
		if (t && (e = t.stateNode)) {
			var n = e[dt] || null;
			a: switch (e = t.stateNode, t.type) {
				case "input":
					if (Ht(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), t = n.name, n.type === "radio" && t != null) {
						for (n = e; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll("input[name=\"" + Vt("" + t) + "\"][type=\"radio\"]"), t = 0; t < n.length; t++) {
							var r = n[t];
							if (r !== e && r.form === e.form) {
								var i = r[dt] || null;
								if (!i) throw Error(s(90));
								Ht(r, i.value, i.defaultValue, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name);
							}
						}
						for (t = 0; t < n.length; t++) r = n[t], r.form === e.form && Rt(r);
					}
					break a;
				case "textarea":
					Kt(e, n.value, n.defaultValue);
					break a;
				case "select": t = n.value, t != null && Gt(e, !!n.multiple, t, !1);
			}
		}
	}
	var ln = !1;
	function un(e, t, n) {
		if (ln) return e(t, n);
		ln = !0;
		try {
			return e(t);
		} finally {
			if (ln = !1, (on !== null || sn !== null) && (bu(), on && (t = on, e = sn, sn = on = null, cn(t), e))) for (t = 0; t < e.length; t++) cn(e[t]);
		}
	}
	function dn(e, t) {
		var n = e.stateNode;
		if (n === null) return null;
		var r = n[dt] || null;
		if (r === null) return null;
		n = r[t];
		a: switch (t) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
				break a;
			default: e = !1;
		}
		if (e) return null;
		if (n && typeof n != "function") throw Error(s(231, t, typeof n));
		return n;
	}
	var fn = !(typeof window > "u" || window.document === void 0 || window.document.createElement === void 0), pn = !1;
	if (fn) try {
		var mn = {};
		Object.defineProperty(mn, "passive", { get: function() {
			pn = !0;
		} }), window.addEventListener("test", mn, mn), window.removeEventListener("test", mn, mn);
	} catch {
		pn = !1;
	}
	var hn = null, gn = null, _n = null;
	function vn() {
		if (_n) return _n;
		var e, t = gn, n = t.length, r, i = "value" in hn ? hn.value : hn.textContent, a = i.length;
		for (e = 0; e < n && t[e] === i[e]; e++);
		var o = n - e;
		for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
		return _n = i.slice(e, 1 < r ? 1 - r : void 0);
	}
	function yn(e) {
		var t = e.keyCode;
		return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
	}
	function bn() {
		return !0;
	}
	function xn() {
		return !1;
	}
	function Sn(e) {
		function t(t, n, r, i, a) {
			for (var o in this._reactName = t, this._targetInst = r, this.type = n, this.nativeEvent = i, this.target = a, this.currentTarget = null, e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(i) : i[o]);
			return this.isDefaultPrevented = (i.defaultPrevented == null ? !1 === i.returnValue : i.defaultPrevented) ? bn : xn, this.isPropagationStopped = xn, this;
		}
		return h(t.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var e = this.nativeEvent;
				e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = bn);
			},
			stopPropagation: function() {
				var e = this.nativeEvent;
				e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = bn);
			},
			persist: function() {},
			isPersistent: bn
		}), t;
	}
	var Cn = {
		eventPhase: 0,
		bubbles: 0,
		cancelable: 0,
		timeStamp: function(e) {
			return e.timeStamp || Date.now();
		},
		defaultPrevented: 0,
		isTrusted: 0
	}, wn = Sn(Cn), Tn = h({}, Cn, {
		view: 0,
		detail: 0
	}), En = Sn(Tn), Dn, On, kn, An = h({}, Tn, {
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		pageX: 0,
		pageY: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		getModifierState: Vn,
		button: 0,
		buttons: 0,
		relatedTarget: function(e) {
			return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
		},
		movementX: function(e) {
			return "movementX" in e ? e.movementX : (e !== kn && (kn && e.type === "mousemove" ? (Dn = e.screenX - kn.screenX, On = e.screenY - kn.screenY) : On = Dn = 0, kn = e), Dn);
		},
		movementY: function(e) {
			return "movementY" in e ? e.movementY : On;
		}
	}), jn = Sn(An), Mn = Sn(h({}, An, { dataTransfer: 0 })), Nn = Sn(h({}, Tn, { relatedTarget: 0 })), Pn = Sn(h({}, Cn, {
		animationName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Fn = Sn(h({}, Cn, { clipboardData: function(e) {
		return "clipboardData" in e ? e.clipboardData : window.clipboardData;
	} })), In = Sn(h({}, Cn, { data: 0 })), Ln = {
		Esc: "Escape",
		Spacebar: " ",
		Left: "ArrowLeft",
		Up: "ArrowUp",
		Right: "ArrowRight",
		Down: "ArrowDown",
		Del: "Delete",
		Win: "OS",
		Menu: "ContextMenu",
		Apps: "ContextMenu",
		Scroll: "ScrollLock",
		MozPrintableKey: "Unidentified"
	}, Rn = {
		8: "Backspace",
		9: "Tab",
		12: "Clear",
		13: "Enter",
		16: "Shift",
		17: "Control",
		18: "Alt",
		19: "Pause",
		20: "CapsLock",
		27: "Escape",
		32: " ",
		33: "PageUp",
		34: "PageDown",
		35: "End",
		36: "Home",
		37: "ArrowLeft",
		38: "ArrowUp",
		39: "ArrowRight",
		40: "ArrowDown",
		45: "Insert",
		46: "Delete",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		144: "NumLock",
		145: "ScrollLock",
		224: "Meta"
	}, zn = {
		Alt: "altKey",
		Control: "ctrlKey",
		Meta: "metaKey",
		Shift: "shiftKey"
	};
	function Bn(e) {
		var t = this.nativeEvent;
		return t.getModifierState ? t.getModifierState(e) : (e = zn[e]) ? !!t[e] : !1;
	}
	function Vn() {
		return Bn;
	}
	var Hn = Sn(h({}, Tn, {
		key: function(e) {
			if (e.key) {
				var t = Ln[e.key] || e.key;
				if (t !== "Unidentified") return t;
			}
			return e.type === "keypress" ? (e = yn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Rn[e.keyCode] || "Unidentified" : "";
		},
		code: 0,
		location: 0,
		ctrlKey: 0,
		shiftKey: 0,
		altKey: 0,
		metaKey: 0,
		repeat: 0,
		locale: 0,
		getModifierState: Vn,
		charCode: function(e) {
			return e.type === "keypress" ? yn(e) : 0;
		},
		keyCode: function(e) {
			return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		},
		which: function(e) {
			return e.type === "keypress" ? yn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
		}
	})), Un = Sn(h({}, An, {
		pointerId: 0,
		width: 0,
		height: 0,
		pressure: 0,
		tangentialPressure: 0,
		tiltX: 0,
		tiltY: 0,
		twist: 0,
		pointerType: 0,
		isPrimary: 0
	})), Wn = Sn(h({}, Tn, {
		touches: 0,
		targetTouches: 0,
		changedTouches: 0,
		altKey: 0,
		metaKey: 0,
		ctrlKey: 0,
		shiftKey: 0,
		getModifierState: Vn
	})), Gn = Sn(h({}, Cn, {
		propertyName: 0,
		elapsedTime: 0,
		pseudoElement: 0
	})), Kn = Sn(h({}, An, {
		deltaX: function(e) {
			return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
		},
		deltaY: function(e) {
			return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
		},
		deltaZ: 0,
		deltaMode: 0
	})), qn = Sn(h({}, Cn, {
		newState: 0,
		oldState: 0
	})), Jn = [
		9,
		13,
		27,
		32
	], Yn = fn && "CompositionEvent" in window, Xn = null;
	fn && "documentMode" in document && (Xn = document.documentMode);
	var Zn = fn && "TextEvent" in window && !Xn, Qn = fn && (!Yn || Xn && 8 < Xn && 11 >= Xn), $n = " ", er = !1;
	function tr(e, t) {
		switch (e) {
			case "keyup": return Jn.indexOf(t.keyCode) !== -1;
			case "keydown": return t.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout": return !0;
			default: return !1;
		}
	}
	function nr(e) {
		return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
	}
	var rr = !1;
	function ir(e, t) {
		switch (e) {
			case "compositionend": return nr(t);
			case "keypress": return t.which === 32 ? (er = !0, $n) : null;
			case "textInput": return e = t.data, e === $n && er ? null : e;
			default: return null;
		}
	}
	function ar(e, t) {
		if (rr) return e === "compositionend" || !Yn && tr(e, t) ? (e = vn(), _n = gn = hn = null, rr = !1, e) : null;
		switch (e) {
			case "paste": return null;
			case "keypress":
				if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
					if (t.char && 1 < t.char.length) return t.char;
					if (t.which) return String.fromCharCode(t.which);
				}
				return null;
			case "compositionend": return Qn && t.locale !== "ko" ? null : t.data;
			default: return null;
		}
	}
	var or = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};
	function sr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t === "input" ? !!or[e.type] : t === "textarea";
	}
	function cr(e, t, n, r) {
		on ? sn ? sn.push(r) : sn = [r] : on = r, t = Ed(t, "onChange"), 0 < t.length && (n = new wn("onChange", "change", null, n, r), e.push({
			event: n,
			listeners: t
		}));
	}
	var lr = null, ur = null;
	function dr(e) {
		yd(e, 0);
	}
	function fr(e) {
		if (Rt(xt(e))) return e;
	}
	function pr(e, t) {
		if (e === "change") return t;
	}
	var mr = !1;
	if (fn) {
		var hr;
		if (fn) {
			var gr = "oninput" in document;
			if (!gr) {
				var _r = document.createElement("div");
				_r.setAttribute("oninput", "return;"), gr = typeof _r.oninput == "function";
			}
			hr = gr;
		} else hr = !1;
		mr = hr && (!document.documentMode || 9 < document.documentMode);
	}
	function vr() {
		lr && (lr.detachEvent("onpropertychange", yr), ur = lr = null);
	}
	function yr(e) {
		if (e.propertyName === "value" && fr(ur)) {
			var t = [];
			cr(t, ur, e, an(e)), un(dr, t);
		}
	}
	function br(e, t, n) {
		e === "focusin" ? (vr(), lr = t, ur = n, lr.attachEvent("onpropertychange", yr)) : e === "focusout" && vr();
	}
	function xr(e) {
		if (e === "selectionchange" || e === "keyup" || e === "keydown") return fr(ur);
	}
	function Sr(e, t) {
		if (e === "click") return fr(t);
	}
	function Cr(e, t) {
		if (e === "input" || e === "change") return fr(t);
	}
	function wr(e, t) {
		return e === t && (e !== 0 || 1 / e == 1 / t) || e !== e && t !== t;
	}
	var Tr = typeof Object.is == "function" ? Object.is : wr;
	function Er(e, t) {
		if (Tr(e, t)) return !0;
		if (typeof e != "object" || !e || typeof t != "object" || !t) return !1;
		var n = Object.keys(e), r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (r = 0; r < n.length; r++) {
			var i = n[r];
			if (!ke.call(t, i) || !Tr(e[i], t[i])) return !1;
		}
		return !0;
	}
	function Dr(e) {
		for (; e && e.firstChild;) e = e.firstChild;
		return e;
	}
	function Or(e, t) {
		var n = Dr(e);
		e = 0;
		for (var r; n;) {
			if (n.nodeType === 3) {
				if (r = e + n.textContent.length, e <= t && r >= t) return {
					node: n,
					offset: t - e
				};
				e = r;
			}
			a: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break a;
					}
					n = n.parentNode;
				}
				n = void 0;
			}
			n = Dr(n);
		}
	}
	function kr(e, t) {
		return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? kr(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
	}
	function Ar(e) {
		e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
		for (var t = zt(e.document); t instanceof e.HTMLIFrameElement;) {
			try {
				var n = typeof t.contentWindow.location.href == "string";
			} catch {
				n = !1;
			}
			if (n) e = t.contentWindow;
			else break;
			t = zt(e.document);
		}
		return t;
	}
	function jr(e) {
		var t = e && e.nodeName && e.nodeName.toLowerCase();
		return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
	}
	var Mr = fn && "documentMode" in document && 11 >= document.documentMode, Nr = null, Pr = null, Fr = null, Ir = !1;
	function Lr(e, t, n) {
		var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		Ir || Nr == null || Nr !== zt(r) || (r = Nr, "selectionStart" in r && jr(r) ? r = {
			start: r.selectionStart,
			end: r.selectionEnd
		} : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
			anchorNode: r.anchorNode,
			anchorOffset: r.anchorOffset,
			focusNode: r.focusNode,
			focusOffset: r.focusOffset
		}), Fr && Er(Fr, r) || (Fr = r, r = Ed(Pr, "onSelect"), 0 < r.length && (t = new wn("onSelect", "select", null, t, n), e.push({
			event: t,
			listeners: r
		}), t.target = Nr)));
	}
	function Rr(e, t) {
		var n = {};
		return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
	}
	var zr = {
		animationend: Rr("Animation", "AnimationEnd"),
		animationiteration: Rr("Animation", "AnimationIteration"),
		animationstart: Rr("Animation", "AnimationStart"),
		transitionrun: Rr("Transition", "TransitionRun"),
		transitionstart: Rr("Transition", "TransitionStart"),
		transitioncancel: Rr("Transition", "TransitionCancel"),
		transitionend: Rr("Transition", "TransitionEnd")
	}, Br = {}, Vr = {};
	fn && (Vr = document.createElement("div").style, "AnimationEvent" in window || (delete zr.animationend.animation, delete zr.animationiteration.animation, delete zr.animationstart.animation), "TransitionEvent" in window || delete zr.transitionend.transition);
	function Hr(e) {
		if (Br[e]) return Br[e];
		if (!zr[e]) return e;
		var t = zr[e], n;
		for (n in t) if (t.hasOwnProperty(n) && n in Vr) return Br[e] = t[n];
		return e;
	}
	var Ur = Hr("animationend"), Wr = Hr("animationiteration"), Gr = Hr("animationstart"), Kr = Hr("transitionrun"), qr = Hr("transitionstart"), Jr = Hr("transitioncancel"), Yr = Hr("transitionend"), Xr = /* @__PURE__ */ new Map(), Zr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	Zr.push("scrollEnd");
	function Qr(e, t) {
		Xr.set(e, t), Tt(t, [e]);
	}
	var $r = typeof reportError == "function" ? reportError : function(e) {
		if (typeof window == "object" && typeof window.ErrorEvent == "function") {
			var t = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: typeof e == "object" && e && typeof e.message == "string" ? String(e.message) : String(e),
				error: e
			});
			if (!window.dispatchEvent(t)) return;
		} else if (typeof process == "object" && typeof process.emit == "function") {
			process.emit("uncaughtException", e);
			return;
		}
		console.error(e);
	}, ei = [], ti = 0, ni = 0;
	function ri() {
		for (var e = ti, t = ni = ti = 0; t < e;) {
			var n = ei[t];
			ei[t++] = null;
			var r = ei[t];
			ei[t++] = null;
			var i = ei[t];
			ei[t++] = null;
			var a = ei[t];
			if (ei[t++] = null, r !== null && i !== null) {
				var o = r.pending;
				o === null ? i.next = i : (i.next = o.next, o.next = i), r.pending = i;
			}
			a !== 0 && si(n, i, a);
		}
	}
	function ii(e, t, n, r) {
		ei[ti++] = e, ei[ti++] = t, ei[ti++] = n, ei[ti++] = r, ni |= r, e.lanes |= r, e = e.alternate, e !== null && (e.lanes |= r);
	}
	function ai(e, t, n, r) {
		return ii(e, t, n, r), ci(e);
	}
	function oi(e, t) {
		return ii(e, null, null, t), ci(e);
	}
	function si(e, t, n) {
		e.lanes |= n;
		var r = e.alternate;
		r !== null && (r.lanes |= n);
		for (var i = !1, a = e.return; a !== null;) a.childLanes |= n, r = a.alternate, r !== null && (r.childLanes |= n), a.tag === 22 && (e = a.stateNode, e === null || e._visibility & 1 || (i = !0)), e = a, a = a.return;
		return e.tag === 3 ? (a = e.stateNode, i && t !== null && (i = 31 - He(n), e = a.hiddenUpdates, r = e[i], r === null ? e[i] = [t] : r.push(t), t.lane = n | 536870912), a) : null;
	}
	function ci(e) {
		if (50 < du) throw du = 0, fu = null, Error(s(185));
		for (var t = e.return; t !== null;) e = t, t = e.return;
		return e.tag === 3 ? e.stateNode : null;
	}
	var li = {};
	function ui(e, t, n, r) {
		this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
	}
	function di(e, t, n, r) {
		return new ui(e, t, n, r);
	}
	function fi(e) {
		return e = e.prototype, !(!e || !e.isReactComponent);
	}
	function pi(e, t) {
		var n = e.alternate;
		return n === null ? (n = di(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 65011712, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n.refCleanup = e.refCleanup, n;
	}
	function mi(e, t) {
		e.flags &= 65011714;
		var n = e.alternate;
		return n === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = n.childLanes, e.lanes = n.lanes, e.child = n.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = n.memoizedProps, e.memoizedState = n.memoizedState, e.updateQueue = n.updateQueue, e.type = n.type, t = n.dependencies, e.dependencies = t === null ? null : {
			lanes: t.lanes,
			firstContext: t.firstContext
		}), e;
	}
	function hi(e, t, n, r, i, a) {
		var o = 0;
		if (r = e, typeof e == "function") fi(e) && (o = 1);
		else if (typeof e == "string") o = Uf(e, n, me.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
		else a: switch (e) {
			case re: return e = di(31, n, t, i), e.elementType = re, e.lanes = a, e;
			case y: return gi(n.children, i, a, t);
			case b:
				o = 8, i |= 24;
				break;
			case x: return e = di(12, n, t, i | 2), e.elementType = x, e.lanes = a, e;
			case te: return e = di(13, n, t, i), e.elementType = te, e.lanes = a, e;
			case w: return e = di(19, n, t, i), e.elementType = w, e.lanes = a, e;
			default:
				if (typeof e == "object" && e) switch (e.$$typeof) {
					case S:
						o = 10;
						break a;
					case ee:
						o = 9;
						break a;
					case C:
						o = 11;
						break a;
					case ne:
						o = 14;
						break a;
					case T:
						o = 16, r = null;
						break a;
				}
				o = 29, n = Error(s(130, e === null ? "null" : typeof e, "")), r = null;
		}
		return t = di(o, n, t, i), t.elementType = e, t.type = r, t.lanes = a, t;
	}
	function gi(e, t, n, r) {
		return e = di(7, e, r, t), e.lanes = n, e;
	}
	function _i(e, t, n) {
		return e = di(6, e, null, t), e.lanes = n, e;
	}
	function vi(e) {
		var t = di(18, null, null, 0);
		return t.stateNode = e, t;
	}
	function yi(e, t, n) {
		return t = di(4, e.children === null ? [] : e.children, e.key, t), t.lanes = n, t.stateNode = {
			containerInfo: e.containerInfo,
			pendingChildren: null,
			implementation: e.implementation
		}, t;
	}
	var bi = /* @__PURE__ */ new WeakMap();
	function xi(e, t) {
		if (typeof e == "object" && e) {
			var n = bi.get(e);
			return n === void 0 ? (t = {
				value: e,
				source: t,
				stack: Oe(t)
			}, bi.set(e, t), t) : n;
		}
		return {
			value: e,
			source: t,
			stack: Oe(t)
		};
	}
	var Si = [], Ci = 0, wi = null, Ti = 0, Ei = [], Di = 0, Oi = null, ki = 1, Ai = "";
	function ji(e, t) {
		Si[Ci++] = Ti, Si[Ci++] = wi, wi = e, Ti = t;
	}
	function Mi(e, t, n) {
		Ei[Di++] = ki, Ei[Di++] = Ai, Ei[Di++] = Oi, Oi = e;
		var r = ki;
		e = Ai;
		var i = 32 - He(r) - 1;
		r &= ~(1 << i), n += 1;
		var a = 32 - He(t) + i;
		if (30 < a) {
			var o = i - i % 5;
			a = (r & (1 << o) - 1).toString(32), r >>= o, i -= o, ki = 1 << 32 - He(t) + i | n << i | r, Ai = a + e;
		} else ki = 1 << a | n << i | r, Ai = e;
	}
	function Ni(e) {
		e.return !== null && (ji(e, 1), Mi(e, 1, 0));
	}
	function Pi(e) {
		for (; e === wi;) wi = Si[--Ci], Si[Ci] = null, Ti = Si[--Ci], Si[Ci] = null;
		for (; e === Oi;) Oi = Ei[--Di], Ei[Di] = null, Ai = Ei[--Di], Ei[Di] = null, ki = Ei[--Di], Ei[Di] = null;
	}
	function Fi(e, t) {
		Ei[Di++] = ki, Ei[Di++] = Ai, Ei[Di++] = Oi, ki = t.id, Ai = t.overflow, Oi = e;
	}
	var Ii = null, I = null, L = !1, Li = null, Ri = !1, zi = Error(s(519));
	function Bi(e) {
		throw Ki(xi(Error(s(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", "")), e)), zi;
	}
	function Vi(e) {
		var t = e.stateNode, n = e.type, r = e.memoizedProps;
		switch (t[ut] = e, t[dt] = r, n) {
			case "dialog":
				Q("cancel", t), Q("close", t);
				break;
			case "iframe":
			case "object":
			case "embed":
				Q("load", t);
				break;
			case "video":
			case "audio":
				for (n = 0; n < _d.length; n++) Q(_d[n], t);
				break;
			case "source":
				Q("error", t);
				break;
			case "img":
			case "image":
			case "link":
				Q("error", t), Q("load", t);
				break;
			case "details":
				Q("toggle", t);
				break;
			case "input":
				Q("invalid", t), Ut(t, r.value, r.defaultValue, r.checked, r.defaultChecked, r.type, r.name, !0);
				break;
			case "select":
				Q("invalid", t);
				break;
			case "textarea": Q("invalid", t), qt(t, r.value, r.defaultValue, r.children);
		}
		n = r.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || !0 === r.suppressHydrationWarning || Md(t.textContent, n) ? (r.popover != null && (Q("beforetoggle", t), Q("toggle", t)), r.onScroll != null && Q("scroll", t), r.onScrollEnd != null && Q("scrollend", t), r.onClick != null && (t.onclick = nn), t = !0) : t = !1, t || Bi(e, !0);
	}
	function Hi(e) {
		for (Ii = e.return; Ii;) switch (Ii.tag) {
			case 5:
			case 31:
			case 13:
				Ri = !1;
				return;
			case 27:
			case 3:
				Ri = !0;
				return;
			default: Ii = Ii.return;
		}
	}
	function Ui(e) {
		if (e !== Ii) return !1;
		if (!L) return Hi(e), L = !0, !1;
		var t = e.tag, n;
		if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type, n = !(n !== "form" && n !== "button") || Ud(e.type, e.memoizedProps)), n = !n), n && I && Bi(e), Hi(e), t === 13) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(s(317));
			I = uf(e);
		} else if (t === 31) {
			if (e = e.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(s(317));
			I = uf(e);
		} else t === 27 ? (t = I, Zd(e.type) ? (e = lf, lf = null, I = e) : I = t) : I = Ii ? cf(e.stateNode.nextSibling) : null;
		return !0;
	}
	function Wi() {
		I = Ii = null, L = !1;
	}
	function Gi() {
		var e = Li;
		return e !== null && (Zl === null ? Zl = e : Zl.push.apply(Zl, e), Li = null), e;
	}
	function Ki(e) {
		Li === null ? Li = [e] : Li.push(e);
	}
	var qi = fe(null), Ji = null, Yi = null;
	function Xi(e, t, n) {
		k(qi, t._currentValue), t._currentValue = n;
	}
	function Zi(e) {
		e._currentValue = qi.current, pe(qi);
	}
	function Qi(e, t, n) {
		for (; e !== null;) {
			var r = e.alternate;
			if ((e.childLanes & t) === t ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t) : (e.childLanes |= t, r !== null && (r.childLanes |= t)), e === n) break;
			e = e.return;
		}
	}
	function $i(e, t, n, r) {
		var i = e.child;
		for (i !== null && (i.return = e); i !== null;) {
			var a = i.dependencies;
			if (a !== null) {
				var o = i.child;
				a = a.firstContext;
				a: for (; a !== null;) {
					var c = a;
					a = i;
					for (var l = 0; l < t.length; l++) if (c.context === t[l]) {
						a.lanes |= n, c = a.alternate, c !== null && (c.lanes |= n), Qi(a.return, n, e), r || (o = null);
						break a;
					}
					a = c.next;
				}
			} else if (i.tag === 18) {
				if (o = i.return, o === null) throw Error(s(341));
				o.lanes |= n, a = o.alternate, a !== null && (a.lanes |= n), Qi(o, n, e), o = null;
			} else o = i.child;
			if (o !== null) o.return = i;
			else for (o = i; o !== null;) {
				if (o === e) {
					o = null;
					break;
				}
				if (i = o.sibling, i !== null) {
					i.return = o.return, o = i;
					break;
				}
				o = o.return;
			}
			i = o;
		}
	}
	function ea(e, t, n, r) {
		e = null;
		for (var i = t, a = !1; i !== null;) {
			if (!a) {
				if (i.flags & 524288) a = !0;
				else if (i.flags & 262144) break;
			}
			if (i.tag === 10) {
				var o = i.alternate;
				if (o === null) throw Error(s(387));
				if (o = o.memoizedProps, o !== null) {
					var c = i.type;
					Tr(i.pendingProps.value, o.value) || (e === null ? e = [c] : e.push(c));
				}
			} else if (i === _e.current) {
				if (o = i.alternate, o === null) throw Error(s(387));
				o.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e === null ? e = [Qf] : e.push(Qf));
			}
			i = i.return;
		}
		e !== null && $i(t, e, n, r), t.flags |= 262144;
	}
	function ta(e) {
		for (e = e.firstContext; e !== null;) {
			if (!Tr(e.context._currentValue, e.memoizedValue)) return !0;
			e = e.next;
		}
		return !1;
	}
	function na(e) {
		Ji = e, Yi = null, e = e.dependencies, e !== null && (e.firstContext = null);
	}
	function ra(e) {
		return aa(Ji, e);
	}
	function ia(e, t) {
		return Ji === null && na(e), aa(e, t);
	}
	function aa(e, t) {
		var n = t._currentValue;
		if (t = {
			context: t,
			memoizedValue: n,
			next: null
		}, Yi === null) {
			if (e === null) throw Error(s(308));
			Yi = t, e.dependencies = {
				lanes: 0,
				firstContext: t
			}, e.flags |= 524288;
		} else Yi = Yi.next = t;
		return n;
	}
	var oa = typeof AbortController < "u" ? AbortController : function() {
		var e = [], t = this.signal = {
			aborted: !1,
			addEventListener: function(t, n) {
				e.push(n);
			}
		};
		this.abort = function() {
			t.aborted = !0, e.forEach(function(e) {
				return e();
			});
		};
	}, sa = t.unstable_scheduleCallback, ca = t.unstable_NormalPriority, la = {
		$$typeof: S,
		Consumer: null,
		Provider: null,
		_currentValue: null,
		_currentValue2: null,
		_threadCount: 0
	};
	function ua() {
		return {
			controller: new oa(),
			data: /* @__PURE__ */ new Map(),
			refCount: 0
		};
	}
	function da(e) {
		e.refCount--, e.refCount === 0 && sa(ca, function() {
			e.controller.abort();
		});
	}
	var fa = null, pa = 0, ma = 0, ha = null;
	function ga(e, t) {
		if (fa === null) {
			var n = fa = [];
			pa = 0, ma = dd(), ha = {
				status: "pending",
				value: void 0,
				then: function(e) {
					n.push(e);
				}
			};
		}
		return pa++, t.then(_a, _a), t;
	}
	function _a() {
		if (--pa === 0 && fa !== null) {
			ha !== null && (ha.status = "fulfilled");
			var e = fa;
			fa = null, ma = 0, ha = null;
			for (var t = 0; t < e.length; t++) (0, e[t])();
		}
	}
	function va(e, t) {
		var n = [], r = {
			status: "pending",
			value: null,
			reason: null,
			then: function(e) {
				n.push(e);
			}
		};
		return e.then(function() {
			r.status = "fulfilled", r.value = t;
			for (var e = 0; e < n.length; e++) (0, n[e])(t);
		}, function(e) {
			for (r.status = "rejected", r.reason = e, e = 0; e < n.length; e++) (0, n[e])(void 0);
		}), r;
	}
	var ya = D.S;
	D.S = function(e, t) {
		eu = Ne(), typeof t == "object" && t && typeof t.then == "function" && ga(e, t), ya !== null && ya(e, t);
	};
	var ba = fe(null);
	function xa() {
		var e = ba.current;
		return e === null ? K.pooledCache : e;
	}
	function Sa(e, t) {
		t === null ? k(ba, ba.current) : k(ba, t.pool);
	}
	function Ca() {
		var e = xa();
		return e === null ? null : {
			parent: la._currentValue,
			pool: e
		};
	}
	var wa = Error(s(460)), Ta = Error(s(474)), Ea = Error(s(542)), Da = { then: function() {} };
	function Oa(e) {
		return e = e.status, e === "fulfilled" || e === "rejected";
	}
	function ka(e, t, n) {
		switch (n = e[n], n === void 0 ? e.push(t) : n !== t && (t.then(nn, nn), t = n), t.status) {
			case "fulfilled": return t.value;
			case "rejected": throw e = t.reason, Na(e), e;
			default:
				if (typeof t.status == "string") t.then(nn, nn);
				else {
					if (e = K, e !== null && 100 < e.shellSuspendCounter) throw Error(s(482));
					e = t, e.status = "pending", e.then(function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "fulfilled", n.value = e;
						}
					}, function(e) {
						if (t.status === "pending") {
							var n = t;
							n.status = "rejected", n.reason = e;
						}
					});
				}
				switch (t.status) {
					case "fulfilled": return t.value;
					case "rejected": throw e = t.reason, Na(e), e;
				}
				throw ja = t, wa;
		}
	}
	function Aa(e) {
		try {
			var t = e._init;
			return t(e._payload);
		} catch (e) {
			throw typeof e == "object" && e && typeof e.then == "function" ? (ja = e, wa) : e;
		}
	}
	var ja = null;
	function Ma() {
		if (ja === null) throw Error(s(459));
		var e = ja;
		return ja = null, e;
	}
	function Na(e) {
		if (e === wa || e === Ea) throw Error(s(483));
	}
	var Pa = null, Fa = 0;
	function Ia(e) {
		var t = Fa;
		return Fa += 1, Pa === null && (Pa = []), ka(Pa, e, t);
	}
	function La(e, t) {
		t = t.props.ref, e.ref = t === void 0 ? null : t;
	}
	function Ra(e, t) {
		throw t.$$typeof === g ? Error(s(525)) : (e = Object.prototype.toString.call(t), Error(s(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)));
	}
	function za(e) {
		function t(t, n) {
			if (e) {
				var r = t.deletions;
				r === null ? (t.deletions = [n], t.flags |= 16) : r.push(n);
			}
		}
		function n(n, r) {
			if (!e) return null;
			for (; r !== null;) t(n, r), r = r.sibling;
			return null;
		}
		function r(e) {
			for (var t = /* @__PURE__ */ new Map(); e !== null;) e.key === null ? t.set(e.index, e) : t.set(e.key, e), e = e.sibling;
			return t;
		}
		function i(e, t) {
			return e = pi(e, t), e.index = 0, e.sibling = null, e;
		}
		function a(t, n, r) {
			return t.index = r, e ? (r = t.alternate, r === null ? (t.flags |= 67108866, n) : (r = r.index, r < n ? (t.flags |= 67108866, n) : r)) : (t.flags |= 1048576, n);
		}
		function o(t) {
			return e && t.alternate === null && (t.flags |= 67108866), t;
		}
		function c(e, t, n, r) {
			return t === null || t.tag !== 6 ? (t = _i(n, e.mode, r), t.return = e, t) : (t = i(t, n), t.return = e, t);
		}
		function l(e, t, n, r) {
			var a = n.type;
			return a === y ? d(e, t, n.props.children, r, n.key) : t !== null && (t.elementType === a || typeof a == "object" && a && a.$$typeof === T && Aa(a) === t.type) ? (t = i(t, n.props), La(t, n), t.return = e, t) : (t = hi(n.type, n.key, n.props, null, e.mode, r), La(t, n), t.return = e, t);
		}
		function u(e, t, n, r) {
			return t === null || t.tag !== 4 || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = yi(n, e.mode, r), t.return = e, t) : (t = i(t, n.children || []), t.return = e, t);
		}
		function d(e, t, n, r, a) {
			return t === null || t.tag !== 7 ? (t = gi(n, e.mode, r, a), t.return = e, t) : (t = i(t, n), t.return = e, t);
		}
		function f(e, t, n) {
			if (typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "bigint") return t = _i("" + t, e.mode, n), t.return = e, t;
			if (typeof t == "object" && t) {
				switch (t.$$typeof) {
					case _: return n = hi(t.type, t.key, t.props, null, e.mode, n), La(n, t), n.return = e, n;
					case v: return t = yi(t, e.mode, n), t.return = e, t;
					case T: return t = Aa(t), f(e, t, n);
				}
				if (ce(t) || ae(t)) return t = gi(t, e.mode, n, null), t.return = e, t;
				if (typeof t.then == "function") return f(e, Ia(t), n);
				if (t.$$typeof === S) return f(e, ia(e, t), n);
				Ra(e, t);
			}
			return null;
		}
		function p(e, t, n, r) {
			var i = t === null ? null : t.key;
			if (typeof n == "string" && n !== "" || typeof n == "number" || typeof n == "bigint") return i === null ? c(e, t, "" + n, r) : null;
			if (typeof n == "object" && n) {
				switch (n.$$typeof) {
					case _: return n.key === i ? l(e, t, n, r) : null;
					case v: return n.key === i ? u(e, t, n, r) : null;
					case T: return n = Aa(n), p(e, t, n, r);
				}
				if (ce(n) || ae(n)) return i === null ? d(e, t, n, r, null) : null;
				if (typeof n.then == "function") return p(e, t, Ia(n), r);
				if (n.$$typeof === S) return p(e, t, ia(e, n), r);
				Ra(e, n);
			}
			return null;
		}
		function m(e, t, n, r, i) {
			if (typeof r == "string" && r !== "" || typeof r == "number" || typeof r == "bigint") return e = e.get(n) || null, c(t, e, "" + r, i);
			if (typeof r == "object" && r) {
				switch (r.$$typeof) {
					case _: return e = e.get(r.key === null ? n : r.key) || null, l(t, e, r, i);
					case v: return e = e.get(r.key === null ? n : r.key) || null, u(t, e, r, i);
					case T: return r = Aa(r), m(e, t, n, r, i);
				}
				if (ce(r) || ae(r)) return e = e.get(n) || null, d(t, e, r, i, null);
				if (typeof r.then == "function") return m(e, t, n, Ia(r), i);
				if (r.$$typeof === S) return m(e, t, n, ia(t, r), i);
				Ra(t, r);
			}
			return null;
		}
		function h(i, o, s, c) {
			for (var l = null, u = null, d = o, h = o = 0, g = null; d !== null && h < s.length; h++) {
				d.index > h ? (g = d, d = null) : g = d.sibling;
				var _ = p(i, d, s[h], c);
				if (_ === null) {
					d === null && (d = g);
					break;
				}
				e && d && _.alternate === null && t(i, d), o = a(_, o, h), u === null ? l = _ : u.sibling = _, u = _, d = g;
			}
			if (h === s.length) return n(i, d), L && ji(i, h), l;
			if (d === null) {
				for (; h < s.length; h++) d = f(i, s[h], c), d !== null && (o = a(d, o, h), u === null ? l = d : u.sibling = d, u = d);
				return L && ji(i, h), l;
			}
			for (d = r(d); h < s.length; h++) g = m(d, i, h, s[h], c), g !== null && (e && g.alternate !== null && d.delete(g.key === null ? h : g.key), o = a(g, o, h), u === null ? l = g : u.sibling = g, u = g);
			return e && d.forEach(function(e) {
				return t(i, e);
			}), L && ji(i, h), l;
		}
		function g(i, o, c, l) {
			if (c == null) throw Error(s(151));
			for (var u = null, d = null, h = o, g = o = 0, _ = null, v = c.next(); h !== null && !v.done; g++, v = c.next()) {
				h.index > g ? (_ = h, h = null) : _ = h.sibling;
				var y = p(i, h, v.value, l);
				if (y === null) {
					h === null && (h = _);
					break;
				}
				e && h && y.alternate === null && t(i, h), o = a(y, o, g), d === null ? u = y : d.sibling = y, d = y, h = _;
			}
			if (v.done) return n(i, h), L && ji(i, g), u;
			if (h === null) {
				for (; !v.done; g++, v = c.next()) v = f(i, v.value, l), v !== null && (o = a(v, o, g), d === null ? u = v : d.sibling = v, d = v);
				return L && ji(i, g), u;
			}
			for (h = r(h); !v.done; g++, v = c.next()) v = m(h, i, g, v.value, l), v !== null && (e && v.alternate !== null && h.delete(v.key === null ? g : v.key), o = a(v, o, g), d === null ? u = v : d.sibling = v, d = v);
			return e && h.forEach(function(e) {
				return t(i, e);
			}), L && ji(i, g), u;
		}
		function b(e, r, a, c) {
			if (typeof a == "object" && a && a.type === y && a.key === null && (a = a.props.children), typeof a == "object" && a) {
				switch (a.$$typeof) {
					case _:
						a: {
							for (var l = a.key; r !== null;) {
								if (r.key === l) {
									if (l = a.type, l === y) {
										if (r.tag === 7) {
											n(e, r.sibling), c = i(r, a.props.children), c.return = e, e = c;
											break a;
										}
									} else if (r.elementType === l || typeof l == "object" && l && l.$$typeof === T && Aa(l) === r.type) {
										n(e, r.sibling), c = i(r, a.props), La(c, a), c.return = e, e = c;
										break a;
									}
									n(e, r);
									break;
								} else t(e, r);
								r = r.sibling;
							}
							a.type === y ? (c = gi(a.props.children, e.mode, c, a.key), c.return = e, e = c) : (c = hi(a.type, a.key, a.props, null, e.mode, c), La(c, a), c.return = e, e = c);
						}
						return o(e);
					case v:
						a: {
							for (l = a.key; r !== null;) {
								if (r.key === l) if (r.tag === 4 && r.stateNode.containerInfo === a.containerInfo && r.stateNode.implementation === a.implementation) {
									n(e, r.sibling), c = i(r, a.children || []), c.return = e, e = c;
									break a;
								} else {
									n(e, r);
									break;
								}
								else t(e, r);
								r = r.sibling;
							}
							c = yi(a, e.mode, c), c.return = e, e = c;
						}
						return o(e);
					case T: return a = Aa(a), b(e, r, a, c);
				}
				if (ce(a)) return h(e, r, a, c);
				if (ae(a)) {
					if (l = ae(a), typeof l != "function") throw Error(s(150));
					return a = l.call(a), g(e, r, a, c);
				}
				if (typeof a.then == "function") return b(e, r, Ia(a), c);
				if (a.$$typeof === S) return b(e, r, ia(e, a), c);
				Ra(e, a);
			}
			return typeof a == "string" && a !== "" || typeof a == "number" || typeof a == "bigint" ? (a = "" + a, r !== null && r.tag === 6 ? (n(e, r.sibling), c = i(r, a), c.return = e, e = c) : (n(e, r), c = _i(a, e.mode, c), c.return = e, e = c), o(e)) : n(e, r);
		}
		return function(e, t, n, r) {
			try {
				Fa = 0;
				var i = b(e, t, n, r);
				return Pa = null, i;
			} catch (t) {
				if (t === wa || t === Ea) throw t;
				var a = di(29, t, null, e.mode);
				return a.lanes = r, a.return = e, a;
			}
		};
	}
	var Ba = za(!0), Va = za(!1), Ha = !1;
	function Ua(e) {
		e.updateQueue = {
			baseState: e.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		};
	}
	function Wa(e, t) {
		e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
			baseState: e.baseState,
			firstBaseUpdate: e.firstBaseUpdate,
			lastBaseUpdate: e.lastBaseUpdate,
			shared: e.shared,
			callbacks: null
		});
	}
	function Ga(e) {
		return {
			lane: e,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		};
	}
	function Ka(e, t, n) {
		var r = e.updateQueue;
		if (r === null) return null;
		if (r = r.shared, G & 2) {
			var i = r.pending;
			return i === null ? t.next = t : (t.next = i.next, i.next = t), r.pending = t, t = ci(e), si(e, null, n), t;
		}
		return ii(e, r, t, n), ci(e);
	}
	function qa(e, t, n) {
		if (t = t.updateQueue, t !== null && (t = t.shared, n & 4194048)) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, rt(e, n);
		}
	}
	function Ja(e, t) {
		var n = e.updateQueue, r = e.alternate;
		if (r !== null && (r = r.updateQueue, n === r)) {
			var i = null, a = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var o = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					a === null ? i = a = o : a = a.next = o, n = n.next;
				} while (n !== null);
				a === null ? i = a = t : a = a.next = t;
			} else i = a = t;
			n = {
				baseState: r.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: a,
				shared: r.shared,
				callbacks: r.callbacks
			}, e.updateQueue = n;
			return;
		}
		e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
	}
	var Ya = !1;
	function Xa() {
		if (Ya) {
			var e = ha;
			if (e !== null) throw e;
		}
	}
	function Za(e, t, n, r) {
		Ya = !1;
		var i = e.updateQueue;
		Ha = !1;
		var a = i.firstBaseUpdate, o = i.lastBaseUpdate, s = i.shared.pending;
		if (s !== null) {
			i.shared.pending = null;
			var c = s, l = c.next;
			c.next = null, o === null ? a = l : o.next = l, o = c;
			var u = e.alternate;
			u !== null && (u = u.updateQueue, s = u.lastBaseUpdate, s !== o && (s === null ? u.firstBaseUpdate = l : s.next = l, u.lastBaseUpdate = c));
		}
		if (a !== null) {
			var d = i.baseState;
			o = 0, u = l = c = null, s = a;
			do {
				var f = s.lane & -536870913, p = f !== s.lane;
				if (p ? (J & f) === f : (r & f) === f) {
					f !== 0 && f === ma && (Ya = !0), u !== null && (u = u.next = {
						lane: 0,
						tag: s.tag,
						payload: s.payload,
						callback: null,
						next: null
					});
					a: {
						var m = e, g = s;
						f = t;
						var _ = n;
						switch (g.tag) {
							case 1:
								if (m = g.payload, typeof m == "function") {
									d = m.call(_, d, f);
									break a;
								}
								d = m;
								break a;
							case 3: m.flags = m.flags & -65537 | 128;
							case 0:
								if (m = g.payload, f = typeof m == "function" ? m.call(_, d, f) : m, f == null) break a;
								d = h({}, d, f);
								break a;
							case 2: Ha = !0;
						}
					}
					f = s.callback, f !== null && (e.flags |= 64, p && (e.flags |= 8192), p = i.callbacks, p === null ? i.callbacks = [f] : p.push(f));
				} else p = {
					lane: f,
					tag: s.tag,
					payload: s.payload,
					callback: s.callback,
					next: null
				}, u === null ? (l = u = p, c = d) : u = u.next = p, o |= f;
				if (s = s.next, s === null) {
					if (s = i.shared.pending, s === null) break;
					p = s, s = p.next, p.next = null, i.lastBaseUpdate = p, i.shared.pending = null;
				}
			} while (1);
			u === null && (c = d), i.baseState = c, i.firstBaseUpdate = l, i.lastBaseUpdate = u, a === null && (i.shared.lanes = 0), Gl |= o, e.lanes = o, e.memoizedState = d;
		}
	}
	function Qa(e, t) {
		if (typeof e != "function") throw Error(s(191, e));
		e.call(t);
	}
	function $a(e, t) {
		var n = e.callbacks;
		if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) Qa(n[e], t);
	}
	var eo = fe(null), to = fe(0);
	function no(e, t) {
		e = Wl, k(to, e), k(eo, t), Wl = e | t.baseLanes;
	}
	function ro() {
		k(to, Wl), k(eo, eo.current);
	}
	function io() {
		Wl = to.current, pe(eo), pe(to);
	}
	var ao = fe(null), oo = null;
	function so(e) {
		var t = e.alternate;
		k(R, R.current & 1), k(ao, e), oo === null && (t === null || eo.current !== null || t.memoizedState !== null) && (oo = e);
	}
	function co(e) {
		k(R, R.current), k(ao, e), oo === null && (oo = e);
	}
	function lo(e) {
		e.tag === 22 ? (k(R, R.current), k(ao, e), oo === null && (oo = e)) : uo(e);
	}
	function uo() {
		k(R, R.current), k(ao, ao.current);
	}
	function fo(e) {
		pe(ao), oo === e && (oo = null), pe(R);
	}
	var R = fe(0);
	function po(e) {
		for (var t = e; t !== null;) {
			if (t.tag === 13) {
				var n = t.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || af(n) || of(n))) return t;
			} else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
				if (t.flags & 128) return t;
			} else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue;
			}
			if (t === e) break;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) return null;
				t = t.return;
			}
			t.sibling.return = t.return, t = t.sibling;
		}
		return null;
	}
	var mo = 0, z = null, B = null, ho = null, go = !1, _o = !1, vo = !1, yo = 0, bo = 0, xo = null, So = 0;
	function V() {
		throw Error(s(321));
	}
	function Co(e, t) {
		if (t === null) return !1;
		for (var n = 0; n < t.length && n < e.length; n++) if (!Tr(e[n], t[n])) return !1;
		return !0;
	}
	function wo(e, t, n, r, i, a) {
		return mo = a, z = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, D.H = e === null || e.memoizedState === null ? Bs : Vs, vo = !1, a = n(r, i), vo = !1, _o && (a = Eo(t, n, r, i)), To(e), a;
	}
	function To(e) {
		D.H = zs;
		var t = B !== null && B.next !== null;
		if (mo = 0, ho = B = z = null, go = !1, bo = 0, xo = null, t) throw Error(s(300));
		e === null || ic || (e = e.dependencies, e !== null && ta(e) && (ic = !0));
	}
	function Eo(e, t, n, r) {
		z = e;
		var i = 0;
		do {
			if (_o && (xo = null), bo = 0, _o = !1, 25 <= i) throw Error(s(301));
			if (i += 1, ho = B = null, e.updateQueue != null) {
				var a = e.updateQueue;
				a.lastEffect = null, a.events = null, a.stores = null, a.memoCache != null && (a.memoCache.index = 0);
			}
			D.H = Hs, a = t(n, r);
		} while (_o);
		return a;
	}
	function Do() {
		var e = D.H, t = e.useState()[0];
		return t = typeof t.then == "function" ? No(t) : t, e = e.useState()[0], (B === null ? null : B.memoizedState) !== e && (z.flags |= 1024), t;
	}
	function Oo() {
		var e = yo !== 0;
		return yo = 0, e;
	}
	function ko(e, t, n) {
		t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~n;
	}
	function Ao(e) {
		if (go) {
			for (e = e.memoizedState; e !== null;) {
				var t = e.queue;
				t !== null && (t.pending = null), e = e.next;
			}
			go = !1;
		}
		mo = 0, ho = B = z = null, _o = !1, bo = yo = 0, xo = null;
	}
	function jo() {
		var e = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return ho === null ? z.memoizedState = ho = e : ho = ho.next = e, ho;
	}
	function H() {
		if (B === null) {
			var e = z.alternate;
			e = e === null ? null : e.memoizedState;
		} else e = B.next;
		var t = ho === null ? z.memoizedState : ho.next;
		if (t !== null) ho = t, B = e;
		else {
			if (e === null) throw z.alternate === null ? Error(s(467)) : Error(s(310));
			B = e, e = {
				memoizedState: B.memoizedState,
				baseState: B.baseState,
				baseQueue: B.baseQueue,
				queue: B.queue,
				next: null
			}, ho === null ? z.memoizedState = ho = e : ho = ho.next = e;
		}
		return ho;
	}
	function Mo() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		};
	}
	function No(e) {
		var t = bo;
		return bo += 1, xo === null && (xo = []), e = ka(xo, e, t), t = z, (ho === null ? t.memoizedState : ho.next) === null && (t = t.alternate, D.H = t === null || t.memoizedState === null ? Bs : Vs), e;
	}
	function Po(e) {
		if (typeof e == "object" && e) {
			if (typeof e.then == "function") return No(e);
			if (e.$$typeof === S) return ra(e);
		}
		throw Error(s(438, String(e)));
	}
	function Fo(e) {
		var t = null, n = z.updateQueue;
		if (n !== null && (t = n.memoCache), t == null) {
			var r = z.alternate;
			r !== null && (r = r.updateQueue, r !== null && (r = r.memoCache, r != null && (t = {
				data: r.data.map(function(e) {
					return e.slice();
				}),
				index: 0
			})));
		}
		if (t ??= {
			data: [],
			index: 0
		}, n === null && (n = Mo(), z.updateQueue = n), n.memoCache = t, n = t.data[t.index], n === void 0) for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ie;
		return t.index++, n;
	}
	function Io(e, t) {
		return typeof t == "function" ? t(e) : t;
	}
	function Lo(e) {
		return Ro(H(), B, e);
	}
	function Ro(e, t, n) {
		var r = e.queue;
		if (r === null) throw Error(s(311));
		r.lastRenderedReducer = n;
		var i = e.baseQueue, a = r.pending;
		if (a !== null) {
			if (i !== null) {
				var o = i.next;
				i.next = a.next, a.next = o;
			}
			t.baseQueue = i = a, r.pending = null;
		}
		if (a = e.baseState, i === null) e.memoizedState = a;
		else {
			t = i.next;
			var c = o = null, l = null, u = t, d = !1;
			do {
				var f = u.lane & -536870913;
				if (f === u.lane ? (mo & f) === f : (J & f) === f) {
					var p = u.revertLane;
					if (p === 0) l !== null && (l = l.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}), f === ma && (d = !0);
					else if ((mo & p) === p) {
						u = u.next, p === ma && (d = !0);
						continue;
					} else f = {
						lane: 0,
						revertLane: u.revertLane,
						gesture: null,
						action: u.action,
						hasEagerState: u.hasEagerState,
						eagerState: u.eagerState,
						next: null
					}, l === null ? (c = l = f, o = a) : l = l.next = f, z.lanes |= p, Gl |= p;
					f = u.action, vo && n(a, f), a = u.hasEagerState ? u.eagerState : n(a, f);
				} else p = {
					lane: f,
					revertLane: u.revertLane,
					gesture: u.gesture,
					action: u.action,
					hasEagerState: u.hasEagerState,
					eagerState: u.eagerState,
					next: null
				}, l === null ? (c = l = p, o = a) : l = l.next = p, z.lanes |= f, Gl |= f;
				u = u.next;
			} while (u !== null && u !== t);
			if (l === null ? o = a : l.next = c, !Tr(a, e.memoizedState) && (ic = !0, d && (n = ha, n !== null))) throw n;
			e.memoizedState = a, e.baseState = o, e.baseQueue = l, r.lastRenderedState = a;
		}
		return i === null && (r.lanes = 0), [e.memoizedState, r.dispatch];
	}
	function zo(e) {
		var t = H(), n = t.queue;
		if (n === null) throw Error(s(311));
		n.lastRenderedReducer = e;
		var r = n.dispatch, i = n.pending, a = t.memoizedState;
		if (i !== null) {
			n.pending = null;
			var o = i = i.next;
			do
				a = e(a, o.action), o = o.next;
			while (o !== i);
			Tr(a, t.memoizedState) || (ic = !0), t.memoizedState = a, t.baseQueue === null && (t.baseState = a), n.lastRenderedState = a;
		}
		return [a, r];
	}
	function Bo(e, t, n) {
		var r = z, i = H(), a = L;
		if (a) {
			if (n === void 0) throw Error(s(407));
			n = n();
		} else n = t();
		var o = !Tr((B || i).memoizedState, n);
		if (o && (i.memoizedState = n, ic = !0), i = i.queue, ds(Uo.bind(null, r, i, e), [e]), i.getSnapshot !== t || o || ho !== null && ho.memoizedState.tag & 1) {
			if (r.flags |= 2048, os(9, { destroy: void 0 }, Ho.bind(null, r, i, n, t), null), K === null) throw Error(s(349));
			a || mo & 127 || Vo(r, t, n);
		}
		return n;
	}
	function Vo(e, t, n) {
		e.flags |= 16384, e = {
			getSnapshot: t,
			value: n
		}, t = z.updateQueue, t === null ? (t = Mo(), z.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
	}
	function Ho(e, t, n, r) {
		t.value = n, t.getSnapshot = r, Wo(t) && Go(e);
	}
	function Uo(e, t, n) {
		return n(function() {
			Wo(t) && Go(e);
		});
	}
	function Wo(e) {
		var t = e.getSnapshot;
		e = e.value;
		try {
			var n = t();
			return !Tr(e, n);
		} catch {
			return !0;
		}
	}
	function Go(e) {
		var t = oi(e, 2);
		t !== null && hu(t, e, 2);
	}
	function Ko(e) {
		var t = jo();
		if (typeof e == "function") {
			var n = e;
			if (e = n(), vo) {
				Ve(!0);
				try {
					n();
				} finally {
					Ve(!1);
				}
			}
		}
		return t.memoizedState = t.baseState = e, t.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Io,
			lastRenderedState: e
		}, t;
	}
	function qo(e, t, n, r) {
		return e.baseState = n, Ro(e, B, typeof r == "function" ? r : Io);
	}
	function Jo(e, t, n, r, i) {
		if (Is(e)) throw Error(s(485));
		if (e = t.action, e !== null) {
			var a = {
				payload: i,
				action: e,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(e) {
					a.listeners.push(e);
				}
			};
			D.T === null ? a.isTransition = !1 : n(!0), r(a), n = t.pending, n === null ? (a.next = t.pending = a, Yo(t, a)) : (a.next = n.next, t.pending = n.next = a);
		}
	}
	function Yo(e, t) {
		var n = t.action, r = t.payload, i = e.state;
		if (t.isTransition) {
			var a = D.T, o = {};
			D.T = o;
			try {
				var s = n(i, r), c = D.S;
				c !== null && c(o, s), Xo(e, t, s);
			} catch (n) {
				Qo(e, t, n);
			} finally {
				a !== null && o.types !== null && (a.types = o.types), D.T = a;
			}
		} else try {
			a = n(i, r), Xo(e, t, a);
		} catch (n) {
			Qo(e, t, n);
		}
	}
	function Xo(e, t, n) {
		typeof n == "object" && n && typeof n.then == "function" ? n.then(function(n) {
			Zo(e, t, n);
		}, function(n) {
			return Qo(e, t, n);
		}) : Zo(e, t, n);
	}
	function Zo(e, t, n) {
		t.status = "fulfilled", t.value = n, $o(t), e.state = n, t = e.pending, t !== null && (n = t.next, n === t ? e.pending = null : (n = n.next, t.next = n, Yo(e, n)));
	}
	function Qo(e, t, n) {
		var r = e.pending;
		if (e.pending = null, r !== null) {
			r = r.next;
			do
				t.status = "rejected", t.reason = n, $o(t), t = t.next;
			while (t !== r);
		}
		e.action = null;
	}
	function $o(e) {
		e = e.listeners;
		for (var t = 0; t < e.length; t++) (0, e[t])();
	}
	function es(e, t) {
		return t;
	}
	function ts(e, t) {
		if (L) {
			var n = K.formState;
			if (n !== null) {
				a: {
					var r = z;
					if (L) {
						if (I) {
							b: {
								for (var i = I, a = Ri; i.nodeType !== 8;) {
									if (!a) {
										i = null;
										break b;
									}
									if (i = cf(i.nextSibling), i === null) {
										i = null;
										break b;
									}
								}
								a = i.data, i = a === "F!" || a === "F" ? i : null;
							}
							if (i) {
								I = cf(i.nextSibling), r = i.data === "F!";
								break a;
							}
						}
						Bi(r);
					}
					r = !1;
				}
				r && (t = n[0]);
			}
		}
		return n = jo(), n.memoizedState = n.baseState = t, r = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: es,
			lastRenderedState: t
		}, n.queue = r, n = Ns.bind(null, z, r), r.dispatch = n, r = Ko(!1), a = Fs.bind(null, z, !1, r.queue), r = jo(), i = {
			state: t,
			dispatch: null,
			action: e,
			pending: null
		}, r.queue = i, n = Jo.bind(null, z, i, a, n), i.dispatch = n, r.memoizedState = e, [
			t,
			n,
			!1
		];
	}
	function ns(e) {
		return rs(H(), B, e);
	}
	function rs(e, t, n) {
		if (t = Ro(e, t, es)[0], e = Lo(Io)[0], typeof t == "object" && t && typeof t.then == "function") try {
			var r = No(t);
		} catch (e) {
			throw e === wa ? Ea : e;
		}
		else r = t;
		t = H();
		var i = t.queue, a = i.dispatch;
		return n !== t.memoizedState && (z.flags |= 2048, os(9, { destroy: void 0 }, is.bind(null, i, n), null)), [
			r,
			a,
			e
		];
	}
	function is(e, t) {
		e.action = t;
	}
	function as(e) {
		var t = H(), n = B;
		if (n !== null) return rs(t, n, e);
		H(), t = t.memoizedState, n = H();
		var r = n.queue.dispatch;
		return n.memoizedState = e, [
			t,
			r,
			!1
		];
	}
	function os(e, t, n, r) {
		return e = {
			tag: e,
			create: n,
			deps: r,
			inst: t,
			next: null
		}, t = z.updateQueue, t === null && (t = Mo(), z.updateQueue = t), n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e), e;
	}
	function ss() {
		return H().memoizedState;
	}
	function cs(e, t, n, r) {
		var i = jo();
		z.flags |= e, i.memoizedState = os(1 | t, { destroy: void 0 }, n, r === void 0 ? null : r);
	}
	function ls(e, t, n, r) {
		var i = H();
		r = r === void 0 ? null : r;
		var a = i.memoizedState.inst;
		B !== null && r !== null && Co(r, B.memoizedState.deps) ? i.memoizedState = os(t, a, n, r) : (z.flags |= e, i.memoizedState = os(1 | t, a, n, r));
	}
	function us(e, t) {
		cs(8390656, 8, e, t);
	}
	function ds(e, t) {
		ls(2048, 8, e, t);
	}
	function fs(e) {
		z.flags |= 4;
		var t = z.updateQueue;
		if (t === null) t = Mo(), z.updateQueue = t, t.events = [e];
		else {
			var n = t.events;
			n === null ? t.events = [e] : n.push(e);
		}
	}
	function ps(e) {
		var t = H().memoizedState;
		return fs({
			ref: t,
			nextImpl: e
		}), function() {
			if (G & 2) throw Error(s(440));
			return t.impl.apply(void 0, arguments);
		};
	}
	function ms(e, t) {
		return ls(4, 2, e, t);
	}
	function hs(e, t) {
		return ls(4, 4, e, t);
	}
	function gs(e, t) {
		if (typeof t == "function") {
			e = e();
			var n = t(e);
			return function() {
				typeof n == "function" ? n() : t(null);
			};
		}
		if (t != null) return e = e(), t.current = e, function() {
			t.current = null;
		};
	}
	function _s(e, t, n) {
		n = n == null ? null : n.concat([e]), ls(4, 4, gs.bind(null, t, e), n);
	}
	function vs() {}
	function ys(e, t) {
		var n = H();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		return t !== null && Co(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
	}
	function bs(e, t) {
		var n = H();
		t = t === void 0 ? null : t;
		var r = n.memoizedState;
		if (t !== null && Co(t, r[1])) return r[0];
		if (r = e(), vo) {
			Ve(!0);
			try {
				e();
			} finally {
				Ve(!1);
			}
		}
		return n.memoizedState = [r, t], r;
	}
	function xs(e, t, n) {
		return n === void 0 || mo & 1073741824 && !(J & 261930) ? e.memoizedState = t : (e.memoizedState = n, e = mu(), z.lanes |= e, Gl |= e, n);
	}
	function Ss(e, t, n, r) {
		return Tr(n, t) ? n : eo.current === null ? !(mo & 42) || mo & 1073741824 && !(J & 261930) ? (ic = !0, e.memoizedState = n) : (e = mu(), z.lanes |= e, Gl |= e, t) : (e = xs(e, n, r), Tr(e, t) || (ic = !0), e);
	}
	function Cs(e, t, n, r, i) {
		var a = O.p;
		O.p = a !== 0 && 8 > a ? a : 8;
		var o = D.T, s = {};
		D.T = s, Fs(e, !1, t, n);
		try {
			var c = i(), l = D.S;
			l !== null && l(s, c), typeof c == "object" && c && typeof c.then == "function" ? Ps(e, t, va(c, r), pu(e)) : Ps(e, t, r, pu(e));
		} catch (n) {
			Ps(e, t, {
				then: function() {},
				status: "rejected",
				reason: n
			}, pu());
		} finally {
			O.p = a, o !== null && s.types !== null && (o.types = s.types), D.T = o;
		}
	}
	function ws() {}
	function Ts(e, t, n, r) {
		if (e.tag !== 5) throw Error(s(476));
		var i = Es(e).queue;
		Cs(e, i, t, le, n === null ? ws : function() {
			return Ds(e), n(r);
		});
	}
	function Es(e) {
		var t = e.memoizedState;
		if (t !== null) return t;
		t = {
			memoizedState: le,
			baseState: le,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Io,
				lastRenderedState: le
			},
			next: null
		};
		var n = {};
		return t.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Io,
				lastRenderedState: n
			},
			next: null
		}, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
	}
	function Ds(e) {
		var t = Es(e);
		t.next === null && (t = e.alternate.memoizedState), Ps(e, t.next.queue, {}, pu());
	}
	function Os() {
		return ra(Qf);
	}
	function ks() {
		return H().memoizedState;
	}
	function As() {
		return H().memoizedState;
	}
	function js(e) {
		for (var t = e.return; t !== null;) {
			switch (t.tag) {
				case 24:
				case 3:
					var n = pu();
					e = Ga(n);
					var r = Ka(t, e, n);
					r !== null && (hu(r, t, n), qa(r, t, n)), t = { cache: ua() }, e.payload = t;
					return;
			}
			t = t.return;
		}
	}
	function Ms(e, t, n) {
		var r = pu();
		n = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Is(e) ? Ls(t, n) : (n = ai(e, t, n, r), n !== null && (hu(n, e, r), Rs(n, t, r)));
	}
	function Ns(e, t, n) {
		Ps(e, t, n, pu());
	}
	function Ps(e, t, n, r) {
		var i = {
			lane: r,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (Is(e)) Ls(t, i);
		else {
			var a = e.alternate;
			if (e.lanes === 0 && (a === null || a.lanes === 0) && (a = t.lastRenderedReducer, a !== null)) try {
				var o = t.lastRenderedState, s = a(o, n);
				if (i.hasEagerState = !0, i.eagerState = s, Tr(s, o)) return ii(e, t, i, 0), K === null && ri(), !1;
			} catch {}
			if (n = ai(e, t, i, r), n !== null) return hu(n, e, r), Rs(n, t, r), !0;
		}
		return !1;
	}
	function Fs(e, t, n, r) {
		if (r = {
			lane: 2,
			revertLane: dd(),
			gesture: null,
			action: r,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Is(e)) {
			if (t) throw Error(s(479));
		} else t = ai(e, n, r, 2), t !== null && hu(t, e, 2);
	}
	function Is(e) {
		var t = e.alternate;
		return e === z || t !== null && t === z;
	}
	function Ls(e, t) {
		_o = go = !0;
		var n = e.pending;
		n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
	}
	function Rs(e, t, n) {
		if (n & 4194048) {
			var r = t.lanes;
			r &= e.pendingLanes, n |= r, t.lanes = n, rt(e, n);
		}
	}
	var zs = {
		readContext: ra,
		use: Po,
		useCallback: V,
		useContext: V,
		useEffect: V,
		useImperativeHandle: V,
		useLayoutEffect: V,
		useInsertionEffect: V,
		useMemo: V,
		useReducer: V,
		useRef: V,
		useState: V,
		useDebugValue: V,
		useDeferredValue: V,
		useTransition: V,
		useSyncExternalStore: V,
		useId: V,
		useHostTransitionStatus: V,
		useFormState: V,
		useActionState: V,
		useOptimistic: V,
		useMemoCache: V,
		useCacheRefresh: V
	};
	zs.useEffectEvent = V;
	var Bs = {
		readContext: ra,
		use: Po,
		useCallback: function(e, t) {
			return jo().memoizedState = [e, t === void 0 ? null : t], e;
		},
		useContext: ra,
		useEffect: us,
		useImperativeHandle: function(e, t, n) {
			n = n == null ? null : n.concat([e]), cs(4194308, 4, gs.bind(null, t, e), n);
		},
		useLayoutEffect: function(e, t) {
			return cs(4194308, 4, e, t);
		},
		useInsertionEffect: function(e, t) {
			cs(4, 2, e, t);
		},
		useMemo: function(e, t) {
			var n = jo();
			t = t === void 0 ? null : t;
			var r = e();
			if (vo) {
				Ve(!0);
				try {
					e();
				} finally {
					Ve(!1);
				}
			}
			return n.memoizedState = [r, t], r;
		},
		useReducer: function(e, t, n) {
			var r = jo();
			if (n !== void 0) {
				var i = n(t);
				if (vo) {
					Ve(!0);
					try {
						n(t);
					} finally {
						Ve(!1);
					}
				}
			} else i = t;
			return r.memoizedState = r.baseState = i, e = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: e,
				lastRenderedState: i
			}, r.queue = e, e = e.dispatch = Ms.bind(null, z, e), [r.memoizedState, e];
		},
		useRef: function(e) {
			var t = jo();
			return e = { current: e }, t.memoizedState = e;
		},
		useState: function(e) {
			e = Ko(e);
			var t = e.queue, n = Ns.bind(null, z, t);
			return t.dispatch = n, [e.memoizedState, n];
		},
		useDebugValue: vs,
		useDeferredValue: function(e, t) {
			return xs(jo(), e, t);
		},
		useTransition: function() {
			var e = Ko(!1);
			return e = Cs.bind(null, z, e.queue, !0, !1), jo().memoizedState = e, [!1, e];
		},
		useSyncExternalStore: function(e, t, n) {
			var r = z, i = jo();
			if (L) {
				if (n === void 0) throw Error(s(407));
				n = n();
			} else {
				if (n = t(), K === null) throw Error(s(349));
				J & 127 || Vo(r, t, n);
			}
			i.memoizedState = n;
			var a = {
				value: n,
				getSnapshot: t
			};
			return i.queue = a, us(Uo.bind(null, r, a, e), [e]), r.flags |= 2048, os(9, { destroy: void 0 }, Ho.bind(null, r, a, n, t), null), n;
		},
		useId: function() {
			var e = jo(), t = K.identifierPrefix;
			if (L) {
				var n = Ai, r = ki;
				n = (r & ~(1 << 32 - He(r) - 1)).toString(32) + n, t = "_" + t + "R_" + n, n = yo++, 0 < n && (t += "H" + n.toString(32)), t += "_";
			} else n = So++, t = "_" + t + "r_" + n.toString(32) + "_";
			return e.memoizedState = t;
		},
		useHostTransitionStatus: Os,
		useFormState: ts,
		useActionState: ts,
		useOptimistic: function(e) {
			var t = jo();
			t.memoizedState = t.baseState = e;
			var n = {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: null,
				lastRenderedState: null
			};
			return t.queue = n, t = Fs.bind(null, z, !0, n), n.dispatch = t, [e, t];
		},
		useMemoCache: Fo,
		useCacheRefresh: function() {
			return jo().memoizedState = js.bind(null, z);
		},
		useEffectEvent: function(e) {
			var t = jo(), n = { impl: e };
			return t.memoizedState = n, function() {
				if (G & 2) throw Error(s(440));
				return n.impl.apply(void 0, arguments);
			};
		}
	}, Vs = {
		readContext: ra,
		use: Po,
		useCallback: ys,
		useContext: ra,
		useEffect: ds,
		useImperativeHandle: _s,
		useInsertionEffect: ms,
		useLayoutEffect: hs,
		useMemo: bs,
		useReducer: Lo,
		useRef: ss,
		useState: function() {
			return Lo(Io);
		},
		useDebugValue: vs,
		useDeferredValue: function(e, t) {
			return Ss(H(), B.memoizedState, e, t);
		},
		useTransition: function() {
			var e = Lo(Io)[0], t = H().memoizedState;
			return [typeof e == "boolean" ? e : No(e), t];
		},
		useSyncExternalStore: Bo,
		useId: ks,
		useHostTransitionStatus: Os,
		useFormState: ns,
		useActionState: ns,
		useOptimistic: function(e, t) {
			return qo(H(), B, e, t);
		},
		useMemoCache: Fo,
		useCacheRefresh: As
	};
	Vs.useEffectEvent = ps;
	var Hs = {
		readContext: ra,
		use: Po,
		useCallback: ys,
		useContext: ra,
		useEffect: ds,
		useImperativeHandle: _s,
		useInsertionEffect: ms,
		useLayoutEffect: hs,
		useMemo: bs,
		useReducer: zo,
		useRef: ss,
		useState: function() {
			return zo(Io);
		},
		useDebugValue: vs,
		useDeferredValue: function(e, t) {
			var n = H();
			return B === null ? xs(n, e, t) : Ss(n, B.memoizedState, e, t);
		},
		useTransition: function() {
			var e = zo(Io)[0], t = H().memoizedState;
			return [typeof e == "boolean" ? e : No(e), t];
		},
		useSyncExternalStore: Bo,
		useId: ks,
		useHostTransitionStatus: Os,
		useFormState: as,
		useActionState: as,
		useOptimistic: function(e, t) {
			var n = H();
			return B === null ? (n.baseState = e, [e, n.queue.dispatch]) : qo(n, B, e, t);
		},
		useMemoCache: Fo,
		useCacheRefresh: As
	};
	Hs.useEffectEvent = ps;
	function Us(e, t, n, r) {
		t = e.memoizedState, n = n(r, t), n = n == null ? t : h({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
	}
	var Ws = {
		enqueueSetState: function(e, t, n) {
			e = e._reactInternals;
			var r = pu(), i = Ga(r);
			i.payload = t, n != null && (i.callback = n), t = Ka(e, i, r), t !== null && (hu(t, e, r), qa(t, e, r));
		},
		enqueueReplaceState: function(e, t, n) {
			e = e._reactInternals;
			var r = pu(), i = Ga(r);
			i.tag = 1, i.payload = t, n != null && (i.callback = n), t = Ka(e, i, r), t !== null && (hu(t, e, r), qa(t, e, r));
		},
		enqueueForceUpdate: function(e, t) {
			e = e._reactInternals;
			var n = pu(), r = Ga(n);
			r.tag = 2, t != null && (r.callback = t), t = Ka(e, r, n), t !== null && (hu(t, e, n), qa(t, e, n));
		}
	};
	function Gs(e, t, n, r, i, a, o) {
		return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, a, o) : t.prototype && t.prototype.isPureReactComponent ? !Er(n, r) || !Er(i, a) : !0;
	}
	function Ks(e, t, n, r) {
		e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Ws.enqueueReplaceState(t, t.state, null);
	}
	function qs(e, t) {
		var n = t;
		if ("ref" in t) for (var r in n = {}, t) r !== "ref" && (n[r] = t[r]);
		if (e = e.defaultProps) for (var i in n === t && (n = h({}, n)), e) n[i] === void 0 && (n[i] = e[i]);
		return n;
	}
	function Js(e) {
		$r(e);
	}
	function Ys(e) {
		console.error(e);
	}
	function Xs(e) {
		$r(e);
	}
	function Zs(e, t) {
		try {
			var n = e.onUncaughtError;
			n(t.value, { componentStack: t.stack });
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function Qs(e, t, n) {
		try {
			var r = e.onCaughtError;
			r(n.value, {
				componentStack: n.stack,
				errorBoundary: t.tag === 1 ? t.stateNode : null
			});
		} catch (e) {
			setTimeout(function() {
				throw e;
			});
		}
	}
	function $s(e, t, n) {
		return n = Ga(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
			Zs(e, t);
		}, n;
	}
	function ec(e) {
		return e = Ga(e), e.tag = 3, e;
	}
	function tc(e, t, n, r) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var a = r.value;
			e.payload = function() {
				return i(a);
			}, e.callback = function() {
				Qs(t, n, r);
			};
		}
		var o = n.stateNode;
		o !== null && typeof o.componentDidCatch == "function" && (e.callback = function() {
			Qs(t, n, r), typeof i != "function" && (ru === null ? ru = /* @__PURE__ */ new Set([this]) : ru.add(this));
			var e = r.stack;
			this.componentDidCatch(r.value, { componentStack: e === null ? "" : e });
		});
	}
	function nc(e, t, n, r, i) {
		if (n.flags |= 32768, typeof r == "object" && r && typeof r.then == "function") {
			if (t = n.alternate, t !== null && ea(t, n, i, !0), n = ao.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13: return oo === null ? Du() : n.alternate === null && X === 0 && (X = 3), n.flags &= -257, n.flags |= 65536, n.lanes = i, r === Da ? n.flags |= 16384 : (t = n.updateQueue, t === null ? n.updateQueue = /* @__PURE__ */ new Set([r]) : t.add(r), Gu(e, r, i)), !1;
					case 22: return n.flags |= 65536, r === Da ? n.flags |= 16384 : (t = n.updateQueue, t === null ? (t = {
						transitions: null,
						markerInstances: null,
						retryQueue: /* @__PURE__ */ new Set([r])
					}, n.updateQueue = t) : (n = t.retryQueue, n === null ? t.retryQueue = /* @__PURE__ */ new Set([r]) : n.add(r)), Gu(e, r, i)), !1;
				}
				throw Error(s(435, n.tag));
			}
			return Gu(e, r, i), Du(), !1;
		}
		if (L) return t = ao.current, t === null ? (r !== zi && (t = Error(s(423), { cause: r }), Ki(xi(t, n))), e = e.current.alternate, e.flags |= 65536, i &= -i, e.lanes |= i, r = xi(r, n), i = $s(e.stateNode, r, i), Ja(e, i), X !== 4 && (X = 2)) : (!(t.flags & 65536) && (t.flags |= 256), t.flags |= 65536, t.lanes = i, r !== zi && (e = Error(s(422), { cause: r }), Ki(xi(e, n)))), !1;
		var a = Error(s(520), { cause: r });
		if (a = xi(a, n), Xl === null ? Xl = [a] : Xl.push(a), X !== 4 && (X = 2), t === null) return !0;
		r = xi(r, n), n = t;
		do {
			switch (n.tag) {
				case 3: return n.flags |= 65536, e = i & -i, n.lanes |= e, e = $s(n.stateNode, r, e), Ja(n, e), !1;
				case 1: if (t = n.type, a = n.stateNode, !(n.flags & 128) && (typeof t.getDerivedStateFromError == "function" || a !== null && typeof a.componentDidCatch == "function" && (ru === null || !ru.has(a)))) return n.flags |= 65536, i &= -i, n.lanes |= i, i = ec(i), tc(i, e, n, r), Ja(n, i), !1;
			}
			n = n.return;
		} while (n !== null);
		return !1;
	}
	var rc = Error(s(461)), ic = !1;
	function ac(e, t, n, r) {
		t.child = e === null ? Va(t, null, n, r) : Ba(t, e.child, n, r);
	}
	function oc(e, t, n, r, i) {
		n = n.render;
		var a = t.ref;
		if ("ref" in r) {
			var o = {};
			for (var s in r) s !== "ref" && (o[s] = r[s]);
		} else o = r;
		return na(t), r = wo(e, t, n, o, a, i), s = Oo(), e !== null && !ic ? (ko(e, t, i), Ac(e, t, i)) : (L && s && Ni(t), t.flags |= 1, ac(e, t, r, i), t.child);
	}
	function sc(e, t, n, r, i) {
		if (e === null) {
			var a = n.type;
			return typeof a == "function" && !fi(a) && a.defaultProps === void 0 && n.compare === null ? (t.tag = 15, t.type = a, cc(e, t, a, r, i)) : (e = hi(n.type, null, r, t, t.mode, i), e.ref = t.ref, e.return = t, t.child = e);
		}
		if (a = e.child, !jc(e, i)) {
			var o = a.memoizedProps;
			if (n = n.compare, n = n === null ? Er : n, n(o, r) && e.ref === t.ref) return Ac(e, t, i);
		}
		return t.flags |= 1, e = pi(a, r), e.ref = t.ref, e.return = t, t.child = e;
	}
	function cc(e, t, n, r, i) {
		if (e !== null) {
			var a = e.memoizedProps;
			if (Er(a, r) && e.ref === t.ref) if (ic = !1, t.pendingProps = r = a, jc(e, i)) e.flags & 131072 && (ic = !0);
			else return t.lanes = e.lanes, Ac(e, t, i);
		}
		return gc(e, t, n, r, i);
	}
	function lc(e, t, n, r) {
		var i = r.children, a = e === null ? null : e.memoizedState;
		if (e === null && t.stateNode === null && (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), r.mode === "hidden") {
			if (t.flags & 128) {
				if (a = a === null ? n : a.baseLanes | n, e !== null) {
					for (r = t.child = e.child, i = 0; r !== null;) i = i | r.lanes | r.childLanes, r = r.sibling;
					r = i & ~a;
				} else r = 0, t.child = null;
				return dc(e, t, a, n, r);
			}
			if (n & 536870912) t.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, e !== null && Sa(t, a === null ? null : a.cachePool), a === null ? ro() : no(t, a), lo(t);
			else return r = t.lanes = 536870912, dc(e, t, a === null ? n : a.baseLanes | n, n, r);
		} else a === null ? (e !== null && Sa(t, null), ro(), uo(t)) : (Sa(t, a.cachePool), no(t, a), uo(t), t.memoizedState = null);
		return ac(e, t, i, n), t.child;
	}
	function uc(e, t) {
		return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), t.sibling;
	}
	function dc(e, t, n, r, i) {
		var a = xa();
		return a = a === null ? null : {
			parent: la._currentValue,
			pool: a
		}, t.memoizedState = {
			baseLanes: n,
			cachePool: a
		}, e !== null && Sa(t, null), ro(), lo(t), e !== null && ea(e, t, r, !0), t.childLanes = i, null;
	}
	function fc(e, t) {
		return t = Tc({
			mode: t.mode,
			children: t.children
		}, e.mode), t.ref = e.ref, e.child = t, t.return = e, t;
	}
	function pc(e, t, n) {
		return Ba(t, e.child, null, n), e = fc(t, t.pendingProps), e.flags |= 2, fo(t), t.memoizedState = null, e;
	}
	function mc(e, t, n) {
		var r = t.pendingProps, i = (t.flags & 128) != 0;
		if (t.flags &= -129, e === null) {
			if (L) {
				if (r.mode === "hidden") return e = fc(t, r), t.lanes = 536870912, uc(null, e);
				if (co(t), (e = I) ? (e = rf(e, Ri), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Oi === null ? null : {
						id: ki,
						overflow: Ai
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = vi(e), n.return = t, t.child = n, Ii = t, I = null)) : e = null, e === null) throw Bi(t);
				return t.lanes = 536870912, null;
			}
			return fc(t, r);
		}
		var a = e.memoizedState;
		if (a !== null) {
			var o = a.dehydrated;
			if (co(t), i) if (t.flags & 256) t.flags &= -257, t = pc(e, t, n);
			else if (t.memoizedState !== null) t.child = e.child, t.flags |= 128, t = null;
			else throw Error(s(558));
			else if (ic || ea(e, t, n, !1), i = (n & e.childLanes) !== 0, ic || i) {
				if (r = K, r !== null && (o = it(r, n), o !== 0 && o !== a.retryLane)) throw a.retryLane = o, oi(e, o), hu(r, e, o), rc;
				Du(), t = pc(e, t, n);
			} else e = a.treeContext, I = cf(o.nextSibling), Ii = t, L = !0, Li = null, Ri = !1, e !== null && Fi(t, e), t = fc(t, r), t.flags |= 4096;
			return t;
		}
		return e = pi(e.child, {
			mode: r.mode,
			children: r.children
		}), e.ref = t.ref, t.child = e, e.return = t, e;
	}
	function hc(e, t) {
		var n = t.ref;
		if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(s(284));
			(e === null || e.ref !== n) && (t.flags |= 4194816);
		}
	}
	function gc(e, t, n, r, i) {
		return na(t), n = wo(e, t, n, r, void 0, i), r = Oo(), e !== null && !ic ? (ko(e, t, i), Ac(e, t, i)) : (L && r && Ni(t), t.flags |= 1, ac(e, t, n, i), t.child);
	}
	function _c(e, t, n, r, i, a) {
		return na(t), t.updateQueue = null, n = Eo(t, r, n, i), To(e), r = Oo(), e !== null && !ic ? (ko(e, t, a), Ac(e, t, a)) : (L && r && Ni(t), t.flags |= 1, ac(e, t, n, a), t.child);
	}
	function vc(e, t, n, r, i) {
		if (na(t), t.stateNode === null) {
			var a = li, o = n.contextType;
			typeof o == "object" && o && (a = ra(o)), a = new n(r, a), t.memoizedState = a.state !== null && a.state !== void 0 ? a.state : null, a.updater = Ws, t.stateNode = a, a._reactInternals = t, a = t.stateNode, a.props = r, a.state = t.memoizedState, a.refs = {}, Ua(t), o = n.contextType, a.context = typeof o == "object" && o ? ra(o) : li, a.state = t.memoizedState, o = n.getDerivedStateFromProps, typeof o == "function" && (Us(t, n, o, r), a.state = t.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof a.getSnapshotBeforeUpdate == "function" || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (o = a.state, typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount(), o !== a.state && Ws.enqueueReplaceState(a, a.state, null), Za(t, r, a, i), Xa(), a.state = t.memoizedState), typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !0;
		} else if (e === null) {
			a = t.stateNode;
			var s = t.memoizedProps, c = qs(n, s);
			a.props = c;
			var l = a.context, u = n.contextType;
			o = li, typeof u == "object" && u && (o = ra(u));
			var d = n.getDerivedStateFromProps;
			u = typeof d == "function" || typeof a.getSnapshotBeforeUpdate == "function", s = t.pendingProps !== s, u || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (s || l !== o) && Ks(t, a, r, o), Ha = !1;
			var f = t.memoizedState;
			a.state = f, Za(t, r, a, i), Xa(), l = t.memoizedState, s || f !== l || Ha ? (typeof d == "function" && (Us(t, n, d, r), l = t.memoizedState), (c = Ha || Gs(t, n, c, r, f, l, o)) ? (u || typeof a.UNSAFE_componentWillMount != "function" && typeof a.componentWillMount != "function" || (typeof a.componentWillMount == "function" && a.componentWillMount(), typeof a.UNSAFE_componentWillMount == "function" && a.UNSAFE_componentWillMount()), typeof a.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = l), a.props = r, a.state = l, a.context = o, r = c) : (typeof a.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
		} else {
			a = t.stateNode, Wa(e, t), o = t.memoizedProps, u = qs(n, o), a.props = u, d = t.pendingProps, f = a.context, l = n.contextType, c = li, typeof l == "object" && l && (c = ra(l)), s = n.getDerivedStateFromProps, (l = typeof s == "function" || typeof a.getSnapshotBeforeUpdate == "function") || typeof a.UNSAFE_componentWillReceiveProps != "function" && typeof a.componentWillReceiveProps != "function" || (o !== d || f !== c) && Ks(t, a, r, c), Ha = !1, f = t.memoizedState, a.state = f, Za(t, r, a, i), Xa();
			var p = t.memoizedState;
			o !== d || f !== p || Ha || e !== null && e.dependencies !== null && ta(e.dependencies) ? (typeof s == "function" && (Us(t, n, s, r), p = t.memoizedState), (u = Ha || Gs(t, n, u, r, f, p, c) || e !== null && e.dependencies !== null && ta(e.dependencies)) ? (l || typeof a.UNSAFE_componentWillUpdate != "function" && typeof a.componentWillUpdate != "function" || (typeof a.componentWillUpdate == "function" && a.componentWillUpdate(r, p, c), typeof a.UNSAFE_componentWillUpdate == "function" && a.UNSAFE_componentWillUpdate(r, p, c)), typeof a.componentDidUpdate == "function" && (t.flags |= 4), typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = p), a.props = r, a.state = p, a.context = c, r = u) : (typeof a.componentDidUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 4), typeof a.getSnapshotBeforeUpdate != "function" || o === e.memoizedProps && f === e.memoizedState || (t.flags |= 1024), r = !1);
		}
		return a = r, hc(e, t), r = (t.flags & 128) != 0, a || r ? (a = t.stateNode, n = r && typeof n.getDerivedStateFromError != "function" ? null : a.render(), t.flags |= 1, e !== null && r ? (t.child = Ba(t, e.child, null, i), t.child = Ba(t, null, n, i)) : ac(e, t, n, i), t.memoizedState = a.state, e = t.child) : e = Ac(e, t, i), e;
	}
	function yc(e, t, n, r) {
		return Wi(), t.flags |= 256, ac(e, t, n, r), t.child;
	}
	var bc = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};
	function xc(e) {
		return {
			baseLanes: e,
			cachePool: Ca()
		};
	}
	function Sc(e, t, n) {
		return e = e === null ? 0 : e.childLanes & ~n, t && (e |= Jl), e;
	}
	function Cc(e, t, n) {
		var r = t.pendingProps, i = !1, a = (t.flags & 128) != 0, o;
		if ((o = a) || (o = e !== null && e.memoizedState === null ? !1 : (R.current & 2) != 0), o && (i = !0, t.flags &= -129), o = (t.flags & 32) != 0, t.flags &= -33, e === null) {
			if (L) {
				if (i ? so(t) : uo(t), (e = I) ? (e = rf(e, Ri), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
					dehydrated: e,
					treeContext: Oi === null ? null : {
						id: ki,
						overflow: Ai
					},
					retryLane: 536870912,
					hydrationErrors: null
				}, n = vi(e), n.return = t, t.child = n, Ii = t, I = null)) : e = null, e === null) throw Bi(t);
				return of(e) ? t.lanes = 32 : t.lanes = 536870912, null;
			}
			var c = r.children;
			return r = r.fallback, i ? (uo(t), i = t.mode, c = Tc({
				mode: "hidden",
				children: c
			}, i), r = gi(r, i, n, null), c.return = t, r.return = t, c.sibling = r, t.child = c, r = t.child, r.memoizedState = xc(n), r.childLanes = Sc(e, o, n), t.memoizedState = bc, uc(null, r)) : (so(t), wc(t, c));
		}
		var l = e.memoizedState;
		if (l !== null && (c = l.dehydrated, c !== null)) {
			if (a) t.flags & 256 ? (so(t), t.flags &= -257, t = Ec(e, t, n)) : t.memoizedState === null ? (uo(t), c = r.fallback, i = t.mode, r = Tc({
				mode: "visible",
				children: r.children
			}, i), c = gi(c, i, n, null), c.flags |= 2, r.return = t, c.return = t, r.sibling = c, t.child = r, Ba(t, e.child, null, n), r = t.child, r.memoizedState = xc(n), r.childLanes = Sc(e, o, n), t.memoizedState = bc, t = uc(null, r)) : (uo(t), t.child = e.child, t.flags |= 128, t = null);
			else if (so(t), of(c)) {
				if (o = c.nextSibling && c.nextSibling.dataset, o) var u = o.dgst;
				o = u, r = Error(s(419)), r.stack = "", r.digest = o, Ki({
					value: r,
					source: null,
					stack: null
				}), t = Ec(e, t, n);
			} else if (ic || ea(e, t, n, !1), o = (n & e.childLanes) !== 0, ic || o) {
				if (o = K, o !== null && (r = it(o, n), r !== 0 && r !== l.retryLane)) throw l.retryLane = r, oi(e, r), hu(o, e, r), rc;
				af(c) || Du(), t = Ec(e, t, n);
			} else af(c) ? (t.flags |= 192, t.child = e.child, t = null) : (e = l.treeContext, I = cf(c.nextSibling), Ii = t, L = !0, Li = null, Ri = !1, e !== null && Fi(t, e), t = wc(t, r.children), t.flags |= 4096);
			return t;
		}
		return i ? (uo(t), c = r.fallback, i = t.mode, l = e.child, u = l.sibling, r = pi(l, {
			mode: "hidden",
			children: r.children
		}), r.subtreeFlags = l.subtreeFlags & 65011712, u === null ? (c = gi(c, i, n, null), c.flags |= 2) : c = pi(u, c), c.return = t, r.return = t, r.sibling = c, t.child = r, uc(null, r), r = t.child, c = e.child.memoizedState, c === null ? c = xc(n) : (i = c.cachePool, i === null ? i = Ca() : (l = la._currentValue, i = i.parent === l ? i : {
			parent: l,
			pool: l
		}), c = {
			baseLanes: c.baseLanes | n,
			cachePool: i
		}), r.memoizedState = c, r.childLanes = Sc(e, o, n), t.memoizedState = bc, uc(e.child, r)) : (so(t), n = e.child, e = n.sibling, n = pi(n, {
			mode: "visible",
			children: r.children
		}), n.return = t, n.sibling = null, e !== null && (o = t.deletions, o === null ? (t.deletions = [e], t.flags |= 16) : o.push(e)), t.child = n, t.memoizedState = null, n);
	}
	function wc(e, t) {
		return t = Tc({
			mode: "visible",
			children: t
		}, e.mode), t.return = e, e.child = t;
	}
	function Tc(e, t) {
		return e = di(22, e, null, t), e.lanes = 0, e;
	}
	function Ec(e, t, n) {
		return Ba(t, e.child, null, n), e = wc(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
	}
	function Dc(e, t, n) {
		e.lanes |= t;
		var r = e.alternate;
		r !== null && (r.lanes |= t), Qi(e.return, t, n);
	}
	function Oc(e, t, n, r, i, a) {
		var o = e.memoizedState;
		o === null ? e.memoizedState = {
			isBackwards: t,
			rendering: null,
			renderingStartTime: 0,
			last: r,
			tail: n,
			tailMode: i,
			treeForkCount: a
		} : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = i, o.treeForkCount = a);
	}
	function kc(e, t, n) {
		var r = t.pendingProps, i = r.revealOrder, a = r.tail;
		r = r.children;
		var o = R.current, s = (o & 2) != 0;
		if (s ? (o = o & 1 | 2, t.flags |= 128) : o &= 1, k(R, o), ac(e, t, r, n), r = L ? Ti : 0, !s && e !== null && e.flags & 128) a: for (e = t.child; e !== null;) {
			if (e.tag === 13) e.memoizedState !== null && Dc(e, n, t);
			else if (e.tag === 19) Dc(e, n, t);
			else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue;
			}
			if (e === t) break a;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) break a;
				e = e.return;
			}
			e.sibling.return = e.return, e = e.sibling;
		}
		switch (i) {
			case "forwards":
				for (n = t.child, i = null; n !== null;) e = n.alternate, e !== null && po(e) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = t.child, t.child = null) : (i = n.sibling, n.sibling = null), Oc(t, !1, i, n, a, r);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = t.child, t.child = null; i !== null;) {
					if (e = i.alternate, e !== null && po(e) === null) {
						t.child = i;
						break;
					}
					e = i.sibling, i.sibling = n, n = i, i = e;
				}
				Oc(t, !0, n, null, a, r);
				break;
			case "together":
				Oc(t, !1, null, null, void 0, r);
				break;
			default: t.memoizedState = null;
		}
		return t.child;
	}
	function Ac(e, t, n) {
		if (e !== null && (t.dependencies = e.dependencies), Gl |= t.lanes, (n & t.childLanes) === 0) if (e !== null) {
			if (ea(e, t, n, !1), (n & t.childLanes) === 0) return null;
		} else return null;
		if (e !== null && t.child !== e.child) throw Error(s(153));
		if (t.child !== null) {
			for (e = t.child, n = pi(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = pi(e, e.pendingProps), n.return = t;
			n.sibling = null;
		}
		return t.child;
	}
	function jc(e, t) {
		return (e.lanes & t) === 0 ? (e = e.dependencies, !!(e !== null && ta(e))) : !0;
	}
	function Mc(e, t, n) {
		switch (t.tag) {
			case 3:
				ve(t, t.stateNode.containerInfo), Xi(t, la, e.memoizedState.cache), Wi();
				break;
			case 27:
			case 5:
				be(t);
				break;
			case 4:
				ve(t, t.stateNode.containerInfo);
				break;
			case 10:
				Xi(t, t.type, t.memoizedProps.value);
				break;
			case 31:
				if (t.memoizedState !== null) return t.flags |= 128, co(t), null;
				break;
			case 13:
				var r = t.memoizedState;
				if (r !== null) return r.dehydrated === null ? (n & t.child.childLanes) === 0 ? (so(t), e = Ac(e, t, n), e === null ? null : e.sibling) : Cc(e, t, n) : (so(t), t.flags |= 128, null);
				so(t);
				break;
			case 19:
				var i = (e.flags & 128) != 0;
				if (r = (n & t.childLanes) !== 0, r ||= (ea(e, t, n, !1), (n & t.childLanes) !== 0), i) {
					if (r) return kc(e, t, n);
					t.flags |= 128;
				}
				if (i = t.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), k(R, R.current), r) break;
				return null;
			case 22: return t.lanes = 0, lc(e, t, n, t.pendingProps);
			case 24: Xi(t, la, e.memoizedState.cache);
		}
		return Ac(e, t, n);
	}
	function Nc(e, t, n) {
		if (e !== null) if (e.memoizedProps !== t.pendingProps) ic = !0;
		else {
			if (!jc(e, n) && !(t.flags & 128)) return ic = !1, Mc(e, t, n);
			ic = !!(e.flags & 131072);
		}
		else ic = !1, L && t.flags & 1048576 && Mi(t, Ti, t.index);
		switch (t.lanes = 0, t.tag) {
			case 16:
				a: {
					var r = t.pendingProps;
					if (e = Aa(t.elementType), t.type = e, typeof e == "function") fi(e) ? (r = qs(e, r), t.tag = 1, t = vc(null, t, e, r, n)) : (t.tag = 0, t = gc(null, t, e, r, n));
					else {
						if (e != null) {
							var i = e.$$typeof;
							if (i === C) {
								t.tag = 11, t = oc(null, t, e, r, n);
								break a;
							} else if (i === ne) {
								t.tag = 14, t = sc(null, t, e, r, n);
								break a;
							}
						}
						throw t = se(e) || e, Error(s(306, t, ""));
					}
				}
				return t;
			case 0: return gc(e, t, t.type, t.pendingProps, n);
			case 1: return r = t.type, i = qs(r, t.pendingProps), vc(e, t, r, i, n);
			case 3:
				a: {
					if (ve(t, t.stateNode.containerInfo), e === null) throw Error(s(387));
					r = t.pendingProps;
					var a = t.memoizedState;
					i = a.element, Wa(e, t), Za(t, r, null, n);
					var o = t.memoizedState;
					if (r = o.cache, Xi(t, la, r), r !== a.cache && $i(t, [la], n, !0), Xa(), r = o.element, a.isDehydrated) if (a = {
						element: r,
						isDehydrated: !1,
						cache: o.cache
					}, t.updateQueue.baseState = a, t.memoizedState = a, t.flags & 256) {
						t = yc(e, t, r, n);
						break a;
					} else if (r !== i) {
						i = xi(Error(s(424)), t), Ki(i), t = yc(e, t, r, n);
						break a;
					} else {
						switch (e = t.stateNode.containerInfo, e.nodeType) {
							case 9:
								e = e.body;
								break;
							default: e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
						}
						for (I = cf(e.firstChild), Ii = t, L = !0, Li = null, Ri = !0, n = Va(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
					}
					else {
						if (Wi(), r === i) {
							t = Ac(e, t, n);
							break a;
						}
						ac(e, t, r, n);
					}
					t = t.child;
				}
				return t;
			case 26: return hc(e, t), e === null ? (n = kf(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : L || (n = t.type, e = t.pendingProps, r = Bd(ge.current).createElement(n), r[ut] = t, r[dt] = e, Pd(r, n, e), F(r), t.stateNode = r) : t.memoizedState = kf(t.type, e.memoizedProps, t.pendingProps, e.memoizedState), null;
			case 27: return be(t), e === null && L && (r = t.stateNode = ff(t.type, t.pendingProps, ge.current), Ii = t, Ri = !0, i = I, Zd(t.type) ? (lf = i, I = cf(r.firstChild)) : I = i), ac(e, t, t.pendingProps.children, n), hc(e, t), e === null && (t.flags |= 4194304), t.child;
			case 5: return e === null && L && ((i = r = I) && (r = tf(r, t.type, t.pendingProps, Ri), r === null ? i = !1 : (t.stateNode = r, Ii = t, I = cf(r.firstChild), Ri = !1, i = !0)), i || Bi(t)), be(t), i = t.type, a = t.pendingProps, o = e === null ? null : e.memoizedProps, r = a.children, Ud(i, a) ? r = null : o !== null && Ud(i, o) && (t.flags |= 32), t.memoizedState !== null && (i = wo(e, t, Do, null, null, n), Qf._currentValue = i), hc(e, t), ac(e, t, r, n), t.child;
			case 6: return e === null && L && ((e = n = I) && (n = nf(n, t.pendingProps, Ri), n === null ? e = !1 : (t.stateNode = n, Ii = t, I = null, e = !0)), e || Bi(t)), null;
			case 13: return Cc(e, t, n);
			case 4: return ve(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Ba(t, null, r, n) : ac(e, t, r, n), t.child;
			case 11: return oc(e, t, t.type, t.pendingProps, n);
			case 7: return ac(e, t, t.pendingProps, n), t.child;
			case 8: return ac(e, t, t.pendingProps.children, n), t.child;
			case 12: return ac(e, t, t.pendingProps.children, n), t.child;
			case 10: return r = t.pendingProps, Xi(t, t.type, r.value), ac(e, t, r.children, n), t.child;
			case 9: return i = t.type._context, r = t.pendingProps.children, na(t), i = ra(i), r = r(i), t.flags |= 1, ac(e, t, r, n), t.child;
			case 14: return sc(e, t, t.type, t.pendingProps, n);
			case 15: return cc(e, t, t.type, t.pendingProps, n);
			case 19: return kc(e, t, n);
			case 31: return mc(e, t, n);
			case 22: return lc(e, t, n, t.pendingProps);
			case 24: return na(t), r = ra(la), e === null ? (i = xa(), i === null && (i = K, a = ua(), i.pooledCache = a, a.refCount++, a !== null && (i.pooledCacheLanes |= n), i = a), t.memoizedState = {
				parent: r,
				cache: i
			}, Ua(t), Xi(t, la, i)) : ((e.lanes & n) !== 0 && (Wa(e, t), Za(t, null, null, n), Xa()), i = e.memoizedState, a = t.memoizedState, i.parent === r ? (r = a.cache, Xi(t, la, r), r !== i.cache && $i(t, [la], n, !0)) : (i = {
				parent: r,
				cache: r
			}, t.memoizedState = i, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i), Xi(t, la, r))), ac(e, t, t.pendingProps.children, n), t.child;
			case 29: throw t.pendingProps;
		}
		throw Error(s(156, t.tag));
	}
	function Pc(e) {
		e.flags |= 4;
	}
	function Fc(e, t, n, r, i) {
		if ((t = (e.mode & 32) != 0) && (t = !1), t) {
			if (e.flags |= 16777216, (i & 335544128) === i) if (e.stateNode.complete) e.flags |= 8192;
			else if (wu()) e.flags |= 8192;
			else throw ja = Da, Ta;
		} else e.flags &= -16777217;
	}
	function Ic(e, t) {
		if (t.type !== "stylesheet" || t.state.loading & 4) e.flags &= -16777217;
		else if (e.flags |= 16777216, !Wf(t)) if (wu()) e.flags |= 8192;
		else throw ja = Da, Ta;
	}
	function Lc(e, t) {
		t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag === 22 ? 536870912 : Qe(), e.lanes |= t, Yl |= t);
	}
	function Rc(e, t) {
		if (!L) switch (e.tailMode) {
			case "hidden":
				t = e.tail;
				for (var n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
				n === null ? e.tail = null : n.sibling = null;
				break;
			case "collapsed":
				n = e.tail;
				for (var r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
				r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
		}
	}
	function U(e) {
		var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
		if (t) for (var i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags & 65011712, r |= i.flags & 65011712, i.return = e, i = i.sibling;
		else for (i = e.child; i !== null;) n |= i.lanes | i.childLanes, r |= i.subtreeFlags, r |= i.flags, i.return = e, i = i.sibling;
		return e.subtreeFlags |= r, e.childLanes = n, t;
	}
	function zc(e, t, n) {
		var r = t.pendingProps;
		switch (Pi(t), t.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14: return U(t), null;
			case 1: return U(t), null;
			case 3: return n = t.stateNode, r = null, e !== null && (r = e.memoizedState.cache), t.memoizedState.cache !== r && (t.flags |= 2048), Zi(la), ye(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (e === null || e.child === null) && (Ui(t) ? Pc(t) : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, Gi())), U(t), null;
			case 26:
				var i = t.type, a = t.memoizedState;
				return e === null ? (Pc(t), a === null ? (U(t), Fc(t, i, null, r, n)) : (U(t), Ic(t, a))) : a ? a === e.memoizedState ? (U(t), t.flags &= -16777217) : (Pc(t), U(t), Ic(t, a)) : (e = e.memoizedProps, e !== r && Pc(t), U(t), Fc(t, i, e, r, n)), null;
			case 27:
				if (xe(t), n = ge.current, i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Pc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(s(166));
						return U(t), null;
					}
					e = me.current, Ui(t) ? Vi(t, e) : (e = ff(i, r, n), t.stateNode = e, Pc(t));
				}
				return U(t), null;
			case 5:
				if (xe(t), i = t.type, e !== null && t.stateNode != null) e.memoizedProps !== r && Pc(t);
				else {
					if (!r) {
						if (t.stateNode === null) throw Error(s(166));
						return U(t), null;
					}
					if (a = me.current, Ui(t)) Vi(t, a);
					else {
						var o = Bd(ge.current);
						switch (a) {
							case 1:
								a = o.createElementNS("http://www.w3.org/2000/svg", i);
								break;
							case 2:
								a = o.createElementNS("http://www.w3.org/1998/Math/MathML", i);
								break;
							default: switch (i) {
								case "svg":
									a = o.createElementNS("http://www.w3.org/2000/svg", i);
									break;
								case "math":
									a = o.createElementNS("http://www.w3.org/1998/Math/MathML", i);
									break;
								case "script":
									a = o.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild);
									break;
								case "select":
									a = typeof r.is == "string" ? o.createElement("select", { is: r.is }) : o.createElement("select"), r.multiple ? a.multiple = !0 : r.size && (a.size = r.size);
									break;
								default: a = typeof r.is == "string" ? o.createElement(i, { is: r.is }) : o.createElement(i);
							}
						}
						a[ut] = t, a[dt] = r;
						a: for (o = t.child; o !== null;) {
							if (o.tag === 5 || o.tag === 6) a.appendChild(o.stateNode);
							else if (o.tag !== 4 && o.tag !== 27 && o.child !== null) {
								o.child.return = o, o = o.child;
								continue;
							}
							if (o === t) break a;
							for (; o.sibling === null;) {
								if (o.return === null || o.return === t) break a;
								o = o.return;
							}
							o.sibling.return = o.return, o = o.sibling;
						}
						t.stateNode = a;
						a: switch (Pd(a, i, r), i) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								r = !!r.autoFocus;
								break a;
							case "img":
								r = !0;
								break a;
							default: r = !1;
						}
						r && Pc(t);
					}
				}
				return U(t), Fc(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n), null;
			case 6:
				if (e && t.stateNode != null) e.memoizedProps !== r && Pc(t);
				else {
					if (typeof r != "string" && t.stateNode === null) throw Error(s(166));
					if (e = ge.current, Ui(t)) {
						if (e = t.stateNode, n = t.memoizedProps, r = null, i = Ii, i !== null) switch (i.tag) {
							case 27:
							case 5: r = i.memoizedProps;
						}
						e[ut] = t, e = !!(e.nodeValue === n || r !== null && !0 === r.suppressHydrationWarning || Md(e.nodeValue, n)), e || Bi(t, !0);
					} else e = Bd(e).createTextNode(r), e[ut] = t, t.stateNode = e;
				}
				return U(t), null;
			case 31:
				if (n = t.memoizedState, e === null || e.memoizedState !== null) {
					if (r = Ui(t), n !== null) {
						if (e === null) {
							if (!r) throw Error(s(318));
							if (e = t.memoizedState, e = e === null ? null : e.dehydrated, !e) throw Error(s(557));
							e[ut] = t;
						} else Wi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						U(t), e = !1;
					} else n = Gi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), e = !0;
					if (!e) return t.flags & 256 ? (fo(t), t) : (fo(t), null);
					if (t.flags & 128) throw Error(s(558));
				}
				return U(t), null;
			case 13:
				if (r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
					if (i = Ui(t), r !== null && r.dehydrated !== null) {
						if (e === null) {
							if (!i) throw Error(s(318));
							if (i = t.memoizedState, i = i === null ? null : i.dehydrated, !i) throw Error(s(317));
							i[ut] = t;
						} else Wi(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
						U(t), i = !1;
					} else i = Gi(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i), i = !0;
					if (!i) return t.flags & 256 ? (fo(t), t) : (fo(t), null);
				}
				return fo(t), t.flags & 128 ? (t.lanes = n, t) : (n = r !== null, e = e !== null && e.memoizedState !== null, n && (r = t.child, i = null, r.alternate !== null && r.alternate.memoizedState !== null && r.alternate.memoizedState.cachePool !== null && (i = r.alternate.memoizedState.cachePool.pool), a = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (a = r.memoizedState.cachePool.pool), a !== i && (r.flags |= 2048)), n !== e && n && (t.child.flags |= 8192), Lc(t, t.updateQueue), U(t), null);
			case 4: return ye(), e === null && Sd(t.stateNode.containerInfo), U(t), null;
			case 10: return Zi(t.type), U(t), null;
			case 19:
				if (pe(R), r = t.memoizedState, r === null) return U(t), null;
				if (i = (t.flags & 128) != 0, a = r.rendering, a === null) if (i) Rc(r, !1);
				else {
					if (X !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null;) {
						if (a = po(e), a !== null) {
							for (t.flags |= 128, Rc(r, !1), e = a.updateQueue, t.updateQueue = e, Lc(t, e), t.subtreeFlags = 0, e = n, n = t.child; n !== null;) mi(n, e), n = n.sibling;
							return k(R, R.current & 1 | 2), L && ji(t, r.treeForkCount), t.child;
						}
						e = e.sibling;
					}
					r.tail !== null && Ne() > tu && (t.flags |= 128, i = !0, Rc(r, !1), t.lanes = 4194304);
				}
				else {
					if (!i) if (e = po(a), e !== null) {
						if (t.flags |= 128, i = !0, e = e.updateQueue, t.updateQueue = e, Lc(t, e), Rc(r, !0), r.tail === null && r.tailMode === "hidden" && !a.alternate && !L) return U(t), null;
					} else 2 * Ne() - r.renderingStartTime > tu && n !== 536870912 && (t.flags |= 128, i = !0, Rc(r, !1), t.lanes = 4194304);
					r.isBackwards ? (a.sibling = t.child, t.child = a) : (e = r.last, e === null ? t.child = a : e.sibling = a, r.last = a);
				}
				return r.tail === null ? (U(t), null) : (e = r.tail, r.rendering = e, r.tail = e.sibling, r.renderingStartTime = Ne(), e.sibling = null, n = R.current, k(R, i ? n & 1 | 2 : n & 1), L && ji(t, r.treeForkCount), e);
			case 22:
			case 23: return fo(t), io(), r = t.memoizedState !== null, e === null ? r && (t.flags |= 8192) : e.memoizedState !== null !== r && (t.flags |= 8192), r ? n & 536870912 && !(t.flags & 128) && (U(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : U(t), n = t.updateQueue, n !== null && Lc(t, n.retryQueue), n = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), r = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (r = t.memoizedState.cachePool.pool), r !== n && (t.flags |= 2048), e !== null && pe(ba), null;
			case 24: return n = null, e !== null && (n = e.memoizedState.cache), t.memoizedState.cache !== n && (t.flags |= 2048), Zi(la), U(t), null;
			case 25: return null;
			case 30: return null;
		}
		throw Error(s(156, t.tag));
	}
	function Bc(e, t) {
		switch (Pi(t), t.tag) {
			case 1: return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 3: return Zi(la), ye(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
			case 26:
			case 27:
			case 5: return xe(t), null;
			case 31:
				if (t.memoizedState !== null) {
					if (fo(t), t.alternate === null) throw Error(s(340));
					Wi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 13:
				if (fo(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
					if (t.alternate === null) throw Error(s(340));
					Wi();
				}
				return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 19: return pe(R), null;
			case 4: return ye(), null;
			case 10: return Zi(t.type), null;
			case 22:
			case 23: return fo(t), io(), e !== null && pe(ba), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
			case 24: return Zi(la), null;
			case 25: return null;
			default: return null;
		}
	}
	function Vc(e, t) {
		switch (Pi(t), t.tag) {
			case 3:
				Zi(la), ye();
				break;
			case 26:
			case 27:
			case 5:
				xe(t);
				break;
			case 4:
				ye();
				break;
			case 31:
				t.memoizedState !== null && fo(t);
				break;
			case 13:
				fo(t);
				break;
			case 19:
				pe(R);
				break;
			case 10:
				Zi(t.type);
				break;
			case 22:
			case 23:
				fo(t), io(), e !== null && pe(ba);
				break;
			case 24: Zi(la);
		}
	}
	function Hc(e, t) {
		try {
			var n = t.updateQueue, r = n === null ? null : n.lastEffect;
			if (r !== null) {
				var i = r.next;
				n = i;
				do {
					if ((n.tag & e) === e) {
						r = void 0;
						var a = n.create, o = n.inst;
						r = a(), o.destroy = r;
					}
					n = n.next;
				} while (n !== i);
			}
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Uc(e, t, n) {
		try {
			var r = t.updateQueue, i = r === null ? null : r.lastEffect;
			if (i !== null) {
				var a = i.next;
				r = a;
				do {
					if ((r.tag & e) === e) {
						var o = r.inst, s = o.destroy;
						if (s !== void 0) {
							o.destroy = void 0, i = t;
							var c = n, l = s;
							try {
								l();
							} catch (e) {
								Z(i, c, e);
							}
						}
					}
					r = r.next;
				} while (r !== a);
			}
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function Wc(e) {
		var t = e.updateQueue;
		if (t !== null) {
			var n = e.stateNode;
			try {
				$a(t, n);
			} catch (t) {
				Z(e, e.return, t);
			}
		}
	}
	function Gc(e, t, n) {
		n.props = qs(e.type, e.memoizedProps), n.state = e.memoizedState;
		try {
			n.componentWillUnmount();
		} catch (n) {
			Z(e, t, n);
		}
	}
	function Kc(e, t) {
		try {
			var n = e.ref;
			if (n !== null) {
				switch (e.tag) {
					case 26:
					case 27:
					case 5:
						var r = e.stateNode;
						break;
					case 30:
						r = e.stateNode;
						break;
					default: r = e.stateNode;
				}
				typeof n == "function" ? e.refCleanup = n(r) : n.current = r;
			}
		} catch (n) {
			Z(e, t, n);
		}
	}
	function qc(e, t) {
		var n = e.ref, r = e.refCleanup;
		if (n !== null) if (typeof r == "function") try {
			r();
		} catch (n) {
			Z(e, t, n);
		} finally {
			e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
		}
		else if (typeof n == "function") try {
			n(null);
		} catch (n) {
			Z(e, t, n);
		}
		else n.current = null;
	}
	function Jc(e) {
		var t = e.type, n = e.memoizedProps, r = e.stateNode;
		try {
			a: switch (t) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && r.focus();
					break a;
				case "img": n.src ? r.src = n.src : n.srcSet && (r.srcset = n.srcSet);
			}
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Yc(e, t, n) {
		try {
			var r = e.stateNode;
			Fd(r, e.type, n, t), r[dt] = t;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	function Xc(e) {
		return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Zd(e.type) || e.tag === 4;
	}
	function Zc(e) {
		a: for (;;) {
			for (; e.sibling === null;) {
				if (e.return === null || Xc(e.return)) return null;
				e = e.return;
			}
			for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
				if (e.tag === 27 && Zd(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue a;
				e.child.return = e, e = e.child;
			}
			if (!(e.flags & 2)) return e.stateNode;
		}
	}
	function Qc(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, t.appendChild(e), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = nn));
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode, t = null), e = e.child, e !== null)) for (Qc(e, t, n), e = e.sibling; e !== null;) Qc(e, t, n), e = e.sibling;
	}
	function $c(e, t, n) {
		var r = e.tag;
		if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
		else if (r !== 4 && (r === 27 && Zd(e.type) && (n = e.stateNode), e = e.child, e !== null)) for ($c(e, t, n), e = e.sibling; e !== null;) $c(e, t, n), e = e.sibling;
	}
	function el(e) {
		var t = e.stateNode, n = e.memoizedProps;
		try {
			for (var r = e.type, i = t.attributes; i.length;) t.removeAttributeNode(i[0]);
			Pd(t, r, n), t[ut] = e, t[dt] = n;
		} catch (t) {
			Z(e, e.return, t);
		}
	}
	var tl = !1, nl = !1, rl = !1, il = typeof WeakSet == "function" ? WeakSet : Set, al = null;
	function ol(e, t) {
		if (e = e.containerInfo, Rd = sp, e = Ar(e), jr(e)) {
			if ("selectionStart" in e) var n = {
				start: e.selectionStart,
				end: e.selectionEnd
			};
			else a: {
				n = (n = e.ownerDocument) && n.defaultView || window;
				var r = n.getSelection && n.getSelection();
				if (r && r.rangeCount !== 0) {
					n = r.anchorNode;
					var i = r.anchorOffset, a = r.focusNode;
					r = r.focusOffset;
					try {
						n.nodeType, a.nodeType;
					} catch {
						n = null;
						break a;
					}
					var o = 0, c = -1, l = -1, u = 0, d = 0, f = e, p = null;
					b: for (;;) {
						for (var m; f !== n || i !== 0 && f.nodeType !== 3 || (c = o + i), f !== a || r !== 0 && f.nodeType !== 3 || (l = o + r), f.nodeType === 3 && (o += f.nodeValue.length), (m = f.firstChild) !== null;) p = f, f = m;
						for (;;) {
							if (f === e) break b;
							if (p === n && ++u === i && (c = o), p === a && ++d === r && (l = o), (m = f.nextSibling) !== null) break;
							f = p, p = f.parentNode;
						}
						f = m;
					}
					n = c === -1 || l === -1 ? null : {
						start: c,
						end: l
					};
				} else n = null;
			}
			n ||= {
				start: 0,
				end: 0
			};
		} else n = null;
		for (zd = {
			focusedElem: e,
			selectionRange: n
		}, sp = !1, al = t; al !== null;) if (t = al, e = t.child, t.subtreeFlags & 1028 && e !== null) e.return = t, al = e;
		else for (; al !== null;) {
			switch (t = al, a = t.alternate, e = t.flags, t.tag) {
				case 0:
					if (e & 4 && (e = t.updateQueue, e = e === null ? null : e.events, e !== null)) for (n = 0; n < e.length; n++) i = e[n], i.ref.impl = i.nextImpl;
					break;
				case 11:
				case 15: break;
				case 1:
					if (e & 1024 && a !== null) {
						e = void 0, n = t, i = a.memoizedProps, a = a.memoizedState, r = n.stateNode;
						try {
							var h = qs(n.type, i);
							e = r.getSnapshotBeforeUpdate(h, a), r.__reactInternalSnapshotBeforeUpdate = e;
						} catch (e) {
							Z(n, n.return, e);
						}
					}
					break;
				case 3:
					if (e & 1024) {
						if (e = t.stateNode.containerInfo, n = e.nodeType, n === 9) ef(e);
						else if (n === 1) switch (e.nodeName) {
							case "HEAD":
							case "HTML":
							case "BODY":
								ef(e);
								break;
							default: e.textContent = "";
						}
					}
					break;
				case 5:
				case 26:
				case 27:
				case 6:
				case 4:
				case 17: break;
				default: if (e & 1024) throw Error(s(163));
			}
			if (e = t.sibling, e !== null) {
				e.return = t.return, al = e;
				break;
			}
			al = t.return;
		}
	}
	function sl(e, t, n) {
		var r = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				xl(e, n), r & 4 && Hc(5, n);
				break;
			case 1:
				if (xl(e, n), r & 4) if (e = n.stateNode, t === null) try {
					e.componentDidMount();
				} catch (e) {
					Z(n, n.return, e);
				}
				else {
					var i = qs(n.type, t.memoizedProps);
					t = t.memoizedState;
					try {
						e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate);
					} catch (e) {
						Z(n, n.return, e);
					}
				}
				r & 64 && Wc(n), r & 512 && Kc(n, n.return);
				break;
			case 3:
				if (xl(e, n), r & 64 && (e = n.updateQueue, e !== null)) {
					if (t = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							t = n.child.stateNode;
							break;
						case 1: t = n.child.stateNode;
					}
					try {
						$a(e, t);
					} catch (e) {
						Z(n, n.return, e);
					}
				}
				break;
			case 27: t === null && r & 4 && el(n);
			case 26:
			case 5:
				xl(e, n), t === null && r & 4 && Jc(n), r & 512 && Kc(n, n.return);
				break;
			case 12:
				xl(e, n);
				break;
			case 31:
				xl(e, n), r & 4 && fl(e, n);
				break;
			case 13:
				xl(e, n), r & 4 && pl(e, n), r & 64 && (e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null && (n = Ju.bind(null, n), sf(e, n))));
				break;
			case 22:
				if (r = n.memoizedState !== null || tl, !r) {
					t = t !== null && t.memoizedState !== null || nl, i = tl;
					var a = nl;
					tl = r, (nl = t) && !a ? Cl(e, n, (n.subtreeFlags & 8772) != 0) : xl(e, n), tl = i, nl = a;
				}
				break;
			case 30: break;
			default: xl(e, n);
		}
	}
	function cl(e) {
		var t = e.alternate;
		t !== null && (e.alternate = null, cl(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && vt(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
	}
	var W = null, ll = !1;
	function ul(e, t, n) {
		for (n = n.child; n !== null;) dl(e, t, n), n = n.sibling;
	}
	function dl(e, t, n) {
		if (Be && typeof Be.onCommitFiberUnmount == "function") try {
			Be.onCommitFiberUnmount(ze, n);
		} catch {}
		switch (n.tag) {
			case 26:
				nl || qc(n, t), ul(e, t, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				nl || qc(n, t);
				var r = W, i = ll;
				Zd(n.type) && (W = n.stateNode, ll = !1), ul(e, t, n), pf(n.stateNode), W = r, ll = i;
				break;
			case 5: nl || qc(n, t);
			case 6:
				if (r = W, i = ll, W = null, ul(e, t, n), W = r, ll = i, W !== null) if (ll) try {
					(W.nodeType === 9 ? W.body : W.nodeName === "HTML" ? W.ownerDocument.body : W).removeChild(n.stateNode);
				} catch (e) {
					Z(n, t, e);
				}
				else try {
					W.removeChild(n.stateNode);
				} catch (e) {
					Z(n, t, e);
				}
				break;
			case 18:
				W !== null && (ll ? (e = W, Qd(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode), Np(e)) : Qd(W, n.stateNode));
				break;
			case 4:
				r = W, i = ll, W = n.stateNode.containerInfo, ll = !0, ul(e, t, n), W = r, ll = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Uc(2, n, t), nl || Uc(4, n, t), ul(e, t, n);
				break;
			case 1:
				nl || (qc(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function" && Gc(n, t, r)), ul(e, t, n);
				break;
			case 21:
				ul(e, t, n);
				break;
			case 22:
				nl = (r = nl) || n.memoizedState !== null, ul(e, t, n), nl = r;
				break;
			default: ul(e, t, n);
		}
	}
	function fl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
			e = e.dehydrated;
			try {
				Np(e);
			} catch (e) {
				Z(t, t.return, e);
			}
		}
	}
	function pl(e, t) {
		if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null)))) try {
			Np(e);
		} catch (e) {
			Z(t, t.return, e);
		}
	}
	function ml(e) {
		switch (e.tag) {
			case 31:
			case 13:
			case 19:
				var t = e.stateNode;
				return t === null && (t = e.stateNode = new il()), t;
			case 22: return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new il()), t;
			default: throw Error(s(435, e.tag));
		}
	}
	function hl(e, t) {
		var n = ml(e);
		t.forEach(function(t) {
			if (!n.has(t)) {
				n.add(t);
				var r = Yu.bind(null, e, t);
				t.then(r, r);
			}
		});
	}
	function gl(e, t) {
		var n = t.deletions;
		if (n !== null) for (var r = 0; r < n.length; r++) {
			var i = n[r], a = e, o = t, c = o;
			a: for (; c !== null;) {
				switch (c.tag) {
					case 27:
						if (Zd(c.type)) {
							W = c.stateNode, ll = !1;
							break a;
						}
						break;
					case 5:
						W = c.stateNode, ll = !1;
						break a;
					case 3:
					case 4:
						W = c.stateNode.containerInfo, ll = !0;
						break a;
				}
				c = c.return;
			}
			if (W === null) throw Error(s(160));
			dl(a, o, i), W = null, ll = !1, a = i.alternate, a !== null && (a.return = null), i.return = null;
		}
		if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) vl(t, e), t = t.sibling;
	}
	var _l = null;
	function vl(e, t) {
		var n = e.alternate, r = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				gl(t, e), yl(e), r & 4 && (Uc(3, e, e.return), Hc(3, e), Uc(5, e, e.return));
				break;
			case 1:
				gl(t, e), yl(e), r & 512 && (nl || n === null || qc(n, n.return)), r & 64 && tl && (e = e.updateQueue, e !== null && (r = e.callbacks, r !== null && (n = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = n === null ? r : n.concat(r))));
				break;
			case 26:
				var i = _l;
				if (gl(t, e), yl(e), r & 512 && (nl || n === null || qc(n, n.return)), r & 4) {
					var a = n === null ? null : n.memoizedState;
					if (r = e.memoizedState, n === null) if (r === null) if (e.stateNode === null) {
						a: {
							r = e.type, n = e.memoizedProps, i = i.ownerDocument || i;
							b: switch (r) {
								case "title":
									a = i.getElementsByTagName("title")[0], (!a || a[_t] || a[ut] || a.namespaceURI === "http://www.w3.org/2000/svg" || a.hasAttribute("itemprop")) && (a = i.createElement(r), i.head.insertBefore(a, i.querySelector("head > title"))), Pd(a, r, n), a[ut] = e, F(a), r = a;
									break a;
								case "link":
									var o = Vf("link", "href", i).get(r + (n.href || ""));
									if (o) {
										for (var c = 0; c < o.length; c++) if (a = o[c], a.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && a.getAttribute("rel") === (n.rel == null ? null : n.rel) && a.getAttribute("title") === (n.title == null ? null : n.title) && a.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
											o.splice(c, 1);
											break b;
										}
									}
									a = i.createElement(r), Pd(a, r, n), i.head.appendChild(a);
									break;
								case "meta":
									if (o = Vf("meta", "content", i).get(r + (n.content || ""))) {
										for (c = 0; c < o.length; c++) if (a = o[c], a.getAttribute("content") === (n.content == null ? null : "" + n.content) && a.getAttribute("name") === (n.name == null ? null : n.name) && a.getAttribute("property") === (n.property == null ? null : n.property) && a.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && a.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
											o.splice(c, 1);
											break b;
										}
									}
									a = i.createElement(r), Pd(a, r, n), i.head.appendChild(a);
									break;
								default: throw Error(s(468, r));
							}
							a[ut] = e, F(a), r = a;
						}
						e.stateNode = r;
					} else Hf(i, e.type, e.stateNode);
					else e.stateNode = If(i, r, e.memoizedProps);
					else a === r ? r === null && e.stateNode !== null && Yc(e, e.memoizedProps, n.memoizedProps) : (a === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : a.count--, r === null ? Hf(i, e.type, e.stateNode) : If(i, r, e.memoizedProps));
				}
				break;
			case 27:
				gl(t, e), yl(e), r & 512 && (nl || n === null || qc(n, n.return)), n !== null && r & 4 && Yc(e, e.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (gl(t, e), yl(e), r & 512 && (nl || n === null || qc(n, n.return)), e.flags & 32) {
					i = e.stateNode;
					try {
						Jt(i, "");
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				r & 4 && e.stateNode != null && (i = e.memoizedProps, Yc(e, i, n === null ? i : n.memoizedProps)), r & 1024 && (rl = !0);
				break;
			case 6:
				if (gl(t, e), yl(e), r & 4) {
					if (e.stateNode === null) throw Error(s(162));
					r = e.memoizedProps, n = e.stateNode;
					try {
						n.nodeValue = r;
					} catch (t) {
						Z(e, e.return, t);
					}
				}
				break;
			case 3:
				if (Bf = null, i = _l, _l = gf(t.containerInfo), gl(t, e), _l = i, yl(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
					Np(t.containerInfo);
				} catch (t) {
					Z(e, e.return, t);
				}
				rl && (rl = !1, bl(e));
				break;
			case 4:
				r = _l, _l = gf(e.stateNode.containerInfo), gl(t, e), yl(e), _l = r;
				break;
			case 12:
				gl(t, e), yl(e);
				break;
			case 31:
				gl(t, e), yl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, hl(e, r)));
				break;
			case 13:
				gl(t, e), yl(e), e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && ($l = Ne()), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, hl(e, r)));
				break;
			case 22:
				i = e.memoizedState !== null;
				var l = n !== null && n.memoizedState !== null, u = tl, d = nl;
				if (tl = u || i, nl = d || l, gl(t, e), nl = d, tl = u, yl(e), r & 8192) a: for (t = e.stateNode, t._visibility = i ? t._visibility & -2 : t._visibility | 1, i && (n === null || l || tl || nl || Sl(e)), n = null, t = e;;) {
					if (t.tag === 5 || t.tag === 26) {
						if (n === null) {
							l = n = t;
							try {
								if (a = l.stateNode, i) o = a.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none";
								else {
									c = l.stateNode;
									var f = l.memoizedProps.style, p = f != null && f.hasOwnProperty("display") ? f.display : null;
									c.style.display = p == null || typeof p == "boolean" ? "" : ("" + p).trim();
								}
							} catch (e) {
								Z(l, l.return, e);
							}
						}
					} else if (t.tag === 6) {
						if (n === null) {
							l = t;
							try {
								l.stateNode.nodeValue = i ? "" : l.memoizedProps;
							} catch (e) {
								Z(l, l.return, e);
							}
						}
					} else if (t.tag === 18) {
						if (n === null) {
							l = t;
							try {
								var m = l.stateNode;
								i ? $d(m, !0) : $d(l.stateNode, !1);
							} catch (e) {
								Z(l, l.return, e);
							}
						}
					} else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
						t.child.return = t, t = t.child;
						continue;
					}
					if (t === e) break a;
					for (; t.sibling === null;) {
						if (t.return === null || t.return === e) break a;
						n === t && (n = null), t = t.return;
					}
					n === t && (n = null), t.sibling.return = t.return, t = t.sibling;
				}
				r & 4 && (r = e.updateQueue, r !== null && (n = r.retryQueue, n !== null && (r.retryQueue = null, hl(e, n))));
				break;
			case 19:
				gl(t, e), yl(e), r & 4 && (r = e.updateQueue, r !== null && (e.updateQueue = null, hl(e, r)));
				break;
			case 30: break;
			case 21: break;
			default: gl(t, e), yl(e);
		}
	}
	function yl(e) {
		var t = e.flags;
		if (t & 2) {
			try {
				for (var n, r = e.return; r !== null;) {
					if (Xc(r)) {
						n = r;
						break;
					}
					r = r.return;
				}
				if (n == null) throw Error(s(160));
				switch (n.tag) {
					case 27:
						var i = n.stateNode;
						$c(e, Zc(e), i);
						break;
					case 5:
						var a = n.stateNode;
						n.flags & 32 && (Jt(a, ""), n.flags &= -33), $c(e, Zc(e), a);
						break;
					case 3:
					case 4:
						var o = n.stateNode.containerInfo;
						Qc(e, Zc(e), o);
						break;
					default: throw Error(s(161));
				}
			} catch (t) {
				Z(e, e.return, t);
			}
			e.flags &= -3;
		}
		t & 4096 && (e.flags &= -4097);
	}
	function bl(e) {
		if (e.subtreeFlags & 1024) for (e = e.child; e !== null;) {
			var t = e;
			bl(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
		}
	}
	function xl(e, t) {
		if (t.subtreeFlags & 8772) for (t = t.child; t !== null;) sl(e, t.alternate, t), t = t.sibling;
	}
	function Sl(e) {
		for (e = e.child; e !== null;) {
			var t = e;
			switch (t.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Uc(4, t, t.return), Sl(t);
					break;
				case 1:
					qc(t, t.return);
					var n = t.stateNode;
					typeof n.componentWillUnmount == "function" && Gc(t, t.return, n), Sl(t);
					break;
				case 27: pf(t.stateNode);
				case 26:
				case 5:
					qc(t, t.return), Sl(t);
					break;
				case 22:
					t.memoizedState === null && Sl(t);
					break;
				case 30:
					Sl(t);
					break;
				default: Sl(t);
			}
			e = e.sibling;
		}
	}
	function Cl(e, t, n) {
		for (n &&= (t.subtreeFlags & 8772) != 0, t = t.child; t !== null;) {
			var r = t.alternate, i = e, a = t, o = a.flags;
			switch (a.tag) {
				case 0:
				case 11:
				case 15:
					Cl(i, a, n), Hc(4, a);
					break;
				case 1:
					if (Cl(i, a, n), r = a, i = r.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount();
					} catch (e) {
						Z(r, r.return, e);
					}
					if (r = a, i = r.updateQueue, i !== null) {
						var s = r.stateNode;
						try {
							var c = i.shared.hiddenCallbacks;
							if (c !== null) for (i.shared.hiddenCallbacks = null, i = 0; i < c.length; i++) Qa(c[i], s);
						} catch (e) {
							Z(r, r.return, e);
						}
					}
					n && o & 64 && Wc(a), Kc(a, a.return);
					break;
				case 27: el(a);
				case 26:
				case 5:
					Cl(i, a, n), n && r === null && o & 4 && Jc(a), Kc(a, a.return);
					break;
				case 12:
					Cl(i, a, n);
					break;
				case 31:
					Cl(i, a, n), n && o & 4 && fl(i, a);
					break;
				case 13:
					Cl(i, a, n), n && o & 4 && pl(i, a);
					break;
				case 22:
					a.memoizedState === null && Cl(i, a, n), Kc(a, a.return);
					break;
				case 30: break;
				default: Cl(i, a, n);
			}
			t = t.sibling;
		}
	}
	function wl(e, t) {
		var n = null;
		e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== n && (e != null && e.refCount++, n != null && da(n));
	}
	function Tl(e, t) {
		e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && da(e));
	}
	function El(e, t, n, r) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) Dl(e, t, n, r), t = t.sibling;
	}
	function Dl(e, t, n, r) {
		var i = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				El(e, t, n, r), i & 2048 && Hc(9, t);
				break;
			case 1:
				El(e, t, n, r);
				break;
			case 3:
				El(e, t, n, r), i & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && da(e)));
				break;
			case 12:
				if (i & 2048) {
					El(e, t, n, r), e = t.stateNode;
					try {
						var a = t.memoizedProps, o = a.id, s = a.onPostCommit;
						typeof s == "function" && s(o, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0);
					} catch (e) {
						Z(t, t.return, e);
					}
				} else El(e, t, n, r);
				break;
			case 31:
				El(e, t, n, r);
				break;
			case 13:
				El(e, t, n, r);
				break;
			case 23: break;
			case 22:
				a = t.stateNode, o = t.alternate, t.memoizedState === null ? a._visibility & 2 ? El(e, t, n, r) : (a._visibility |= 2, Ol(e, t, n, r, (t.subtreeFlags & 10256) != 0 || !1)) : a._visibility & 2 ? El(e, t, n, r) : kl(e, t), i & 2048 && wl(o, t);
				break;
			case 24:
				El(e, t, n, r), i & 2048 && Tl(t.alternate, t);
				break;
			default: El(e, t, n, r);
		}
	}
	function Ol(e, t, n, r, i) {
		for (i &&= (t.subtreeFlags & 10256) != 0 || !1, t = t.child; t !== null;) {
			var a = e, o = t, s = n, c = r, l = o.flags;
			switch (o.tag) {
				case 0:
				case 11:
				case 15:
					Ol(a, o, s, c, i), Hc(8, o);
					break;
				case 23: break;
				case 22:
					var u = o.stateNode;
					o.memoizedState === null ? (u._visibility |= 2, Ol(a, o, s, c, i)) : u._visibility & 2 ? Ol(a, o, s, c, i) : kl(a, o), i && l & 2048 && wl(o.alternate, o);
					break;
				case 24:
					Ol(a, o, s, c, i), i && l & 2048 && Tl(o.alternate, o);
					break;
				default: Ol(a, o, s, c, i);
			}
			t = t.sibling;
		}
	}
	function kl(e, t) {
		if (t.subtreeFlags & 10256) for (t = t.child; t !== null;) {
			var n = e, r = t, i = r.flags;
			switch (r.tag) {
				case 22:
					kl(n, r), i & 2048 && wl(r.alternate, r);
					break;
				case 24:
					kl(n, r), i & 2048 && Tl(r.alternate, r);
					break;
				default: kl(n, r);
			}
			t = t.sibling;
		}
	}
	var Al = 8192;
	function jl(e, t, n) {
		if (e.subtreeFlags & Al) for (e = e.child; e !== null;) Ml(e, t, n), e = e.sibling;
	}
	function Ml(e, t, n) {
		switch (e.tag) {
			case 26:
				jl(e, t, n), e.flags & Al && e.memoizedState !== null && Gf(n, _l, e.memoizedState, e.memoizedProps);
				break;
			case 5:
				jl(e, t, n);
				break;
			case 3:
			case 4:
				var r = _l;
				_l = gf(e.stateNode.containerInfo), jl(e, t, n), _l = r;
				break;
			case 22:
				e.memoizedState === null && (r = e.alternate, r !== null && r.memoizedState !== null ? (r = Al, Al = 16777216, jl(e, t, n), Al = r) : jl(e, t, n));
				break;
			default: jl(e, t, n);
		}
	}
	function Nl(e) {
		var t = e.alternate;
		if (t !== null && (e = t.child, e !== null)) {
			t.child = null;
			do
				t = e.sibling, e.sibling = null, e = t;
			while (e !== null);
		}
	}
	function Pl(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				al = r, Ll(r, e);
			}
			Nl(e);
		}
		if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) Fl(e), e = e.sibling;
	}
	function Fl(e) {
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				Pl(e), e.flags & 2048 && Uc(9, e, e.return);
				break;
			case 3:
				Pl(e);
				break;
			case 12:
				Pl(e);
				break;
			case 22:
				var t = e.stateNode;
				e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Il(e)) : Pl(e);
				break;
			default: Pl(e);
		}
	}
	function Il(e) {
		var t = e.deletions;
		if (e.flags & 16) {
			if (t !== null) for (var n = 0; n < t.length; n++) {
				var r = t[n];
				al = r, Ll(r, e);
			}
			Nl(e);
		}
		for (e = e.child; e !== null;) {
			switch (t = e, t.tag) {
				case 0:
				case 11:
				case 15:
					Uc(8, t, t.return), Il(t);
					break;
				case 22:
					n = t.stateNode, n._visibility & 2 && (n._visibility &= -3, Il(t));
					break;
				default: Il(t);
			}
			e = e.sibling;
		}
	}
	function Ll(e, t) {
		for (; al !== null;) {
			var n = al;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Uc(8, n, t);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var r = n.memoizedState.cachePool.pool;
						r != null && r.refCount++;
					}
					break;
				case 24: da(n.memoizedState.cache);
			}
			if (r = n.child, r !== null) r.return = n, al = r;
			else a: for (n = e; al !== null;) {
				r = al;
				var i = r.sibling, a = r.return;
				if (cl(r), r === n) {
					al = null;
					break a;
				}
				if (i !== null) {
					i.return = a, al = i;
					break a;
				}
				al = a;
			}
		}
	}
	var Rl = {
		getCacheForType: function(e) {
			var t = ra(la), n = t.data.get(e);
			return n === void 0 && (n = e(), t.data.set(e, n)), n;
		},
		cacheSignal: function() {
			return ra(la).controller.signal;
		}
	}, zl = typeof WeakMap == "function" ? WeakMap : Map, G = 0, K = null, q = null, J = 0, Y = 0, Bl = null, Vl = !1, Hl = !1, Ul = !1, Wl = 0, X = 0, Gl = 0, Kl = 0, ql = 0, Jl = 0, Yl = 0, Xl = null, Zl = null, Ql = !1, $l = 0, eu = 0, tu = Infinity, nu = null, ru = null, iu = 0, au = null, ou = null, su = 0, cu = 0, lu = null, uu = null, du = 0, fu = null;
	function pu() {
		return G & 2 && J !== 0 ? J & -J : D.T === null ? st() : dd();
	}
	function mu() {
		if (Jl === 0) if (!(J & 536870912) || L) {
			var e = qe;
			qe <<= 1, !(qe & 3932160) && (qe = 262144), Jl = e;
		} else Jl = 536870912;
		return e = ao.current, e !== null && (e.flags |= 32), Jl;
	}
	function hu(e, t, n) {
		(e === K && (Y === 2 || Y === 9) || e.cancelPendingCommit !== null) && (Su(e, 0), yu(e, J, Jl, !1)), et(e, n), (!(G & 2) || e !== K) && (e === K && (!(G & 2) && (Kl |= n), X === 4 && yu(e, J, Jl, !1)), rd(e));
	}
	function gu(e, t, n) {
		if (G & 6) throw Error(s(327));
		var r = !n && (t & 127) == 0 && (t & e.expiredLanes) === 0 || Xe(e, t), i = r ? Au(e, t) : Ou(e, t, !0), a = r;
		do {
			if (i === 0) {
				Hl && !r && yu(e, t, 0, !1);
				break;
			} else {
				if (n = e.current.alternate, a && !vu(n)) {
					i = Ou(e, t, !1), a = !1;
					continue;
				}
				if (i === 2) {
					if (a = t, e.errorRecoveryDisabledLanes & a) var o = 0;
					else o = e.pendingLanes & -536870913, o = o === 0 ? o & 536870912 ? 536870912 : 0 : o;
					if (o !== 0) {
						t = o;
						a: {
							var c = e;
							i = Xl;
							var l = c.current.memoizedState.isDehydrated;
							if (l && (Su(c, o).flags |= 256), o = Ou(c, o, !1), o !== 2) {
								if (Ul && !l) {
									c.errorRecoveryDisabledLanes |= a, Kl |= a, i = 4;
									break a;
								}
								a = Zl, Zl = i, a !== null && (Zl === null ? Zl = a : Zl.push.apply(Zl, a));
							}
							i = o;
						}
						if (a = !1, i !== 2) continue;
					}
				}
				if (i === 1) {
					Su(e, 0), yu(e, t, 0, !0);
					break;
				}
				a: {
					switch (r = e, a = i, a) {
						case 0:
						case 1: throw Error(s(345));
						case 4: if ((t & 4194048) !== t) break;
						case 6:
							yu(r, t, Jl, !Vl);
							break a;
						case 2:
							Zl = null;
							break;
						case 3:
						case 5: break;
						default: throw Error(s(329));
					}
					if ((t & 62914560) === t && (i = $l + 300 - Ne(), 10 < i)) {
						if (yu(r, t, Jl, !Vl), Ye(r, 0, !0) !== 0) break a;
						su = t, r.timeoutHandle = Kd(_u.bind(null, r, n, Zl, nu, Ql, t, Jl, Kl, Yl, Vl, a, "Throttled", -0, 0), i);
						break a;
					}
					_u(r, n, Zl, nu, Ql, t, Jl, Kl, Yl, Vl, a, null, -0, 0);
				}
			}
			break;
		} while (1);
		rd(e);
	}
	function _u(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
		if (e.timeoutHandle = -1, d = t.subtreeFlags, d & 8192 || (d & 16785408) == 16785408) {
			d = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: nn
			}, Ml(t, a, d);
			var m = (a & 62914560) === a ? $l - Ne() : (a & 4194048) === a ? eu - Ne() : 0;
			if (m = qf(d, m), m !== null) {
				su = a, e.cancelPendingCommit = m(Lu.bind(null, e, t, a, n, r, i, o, s, c, u, d, null, f, p)), yu(e, a, o, !l);
				return;
			}
		}
		Lu(e, t, a, n, r, i, o, s, c);
	}
	function vu(e) {
		for (var t = e;;) {
			var n = t.tag;
			if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue, n !== null && (n = n.stores, n !== null))) for (var r = 0; r < n.length; r++) {
				var i = n[r], a = i.getSnapshot;
				i = i.value;
				try {
					if (!Tr(a(), i)) return !1;
				} catch {
					return !1;
				}
			}
			if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
			else {
				if (t === e) break;
				for (; t.sibling === null;) {
					if (t.return === null || t.return === e) return !0;
					t = t.return;
				}
				t.sibling.return = t.return, t = t.sibling;
			}
		}
		return !0;
	}
	function yu(e, t, n, r) {
		t &= ~ql, t &= ~Kl, e.suspendedLanes |= t, e.pingedLanes &= ~t, r && (e.warmLanes |= t), r = e.expirationTimes;
		for (var i = t; 0 < i;) {
			var a = 31 - He(i), o = 1 << a;
			r[a] = -1, i &= ~o;
		}
		n !== 0 && nt(e, n, t);
	}
	function bu() {
		return G & 6 ? !0 : (id(0, !1), !1);
	}
	function xu() {
		if (q !== null) {
			if (Y === 0) var e = q.return;
			else e = q, Yi = Ji = null, Ao(e), Pa = null, Fa = 0, e = q;
			for (; e !== null;) Vc(e.alternate, e), e = e.return;
			q = null;
		}
	}
	function Su(e, t) {
		var n = e.timeoutHandle;
		n !== -1 && (e.timeoutHandle = -1, qd(n)), n = e.cancelPendingCommit, n !== null && (e.cancelPendingCommit = null, n()), su = 0, xu(), K = e, q = n = pi(e.current, null), J = t, Y = 0, Bl = null, Vl = !1, Hl = Xe(e, t), Ul = !1, Yl = Jl = ql = Kl = Gl = X = 0, Zl = Xl = null, Ql = !1, t & 8 && (t |= t & 32);
		var r = e.entangledLanes;
		if (r !== 0) for (e = e.entanglements, r &= t; 0 < r;) {
			var i = 31 - He(r), a = 1 << i;
			t |= e[i], r &= ~a;
		}
		return Wl = t, ri(), n;
	}
	function Cu(e, t) {
		z = null, D.H = zs, t === wa || t === Ea ? (t = Ma(), Y = 3) : t === Ta ? (t = Ma(), Y = 4) : Y = t === rc ? 8 : typeof t == "object" && t && typeof t.then == "function" ? 6 : 1, Bl = t, q === null && (X = 1, Zs(e, xi(t, e.current)));
	}
	function wu() {
		var e = ao.current;
		return e === null ? !0 : (J & 4194048) === J ? oo === null : (J & 62914560) === J || J & 536870912 ? e === oo : !1;
	}
	function Tu() {
		var e = D.H;
		return D.H = zs, e === null ? zs : e;
	}
	function Eu() {
		var e = D.A;
		return D.A = Rl, e;
	}
	function Du() {
		X = 4, Vl || (J & 4194048) !== J && ao.current !== null || (Hl = !0), !(Gl & 134217727) && !(Kl & 134217727) || K === null || yu(K, J, Jl, !1);
	}
	function Ou(e, t, n) {
		var r = G;
		G |= 2;
		var i = Tu(), a = Eu();
		(K !== e || J !== t) && (nu = null, Su(e, t)), t = !1;
		var o = X;
		a: do
			try {
				if (Y !== 0 && q !== null) {
					var s = q, c = Bl;
					switch (Y) {
						case 8:
							xu(), o = 6;
							break a;
						case 3:
						case 2:
						case 9:
						case 6:
							ao.current === null && (t = !0);
							var l = Y;
							if (Y = 0, Bl = null, Pu(e, s, c, l), n && Hl) {
								o = 0;
								break a;
							}
							break;
						default: l = Y, Y = 0, Bl = null, Pu(e, s, c, l);
					}
				}
				ku(), o = X;
				break;
			} catch (t) {
				Cu(e, t);
			}
		while (1);
		return t && e.shellSuspendCounter++, Yi = Ji = null, G = r, D.H = i, D.A = a, q === null && (K = null, J = 0, ri()), o;
	}
	function ku() {
		for (; q !== null;) Mu(q);
	}
	function Au(e, t) {
		var n = G;
		G |= 2;
		var r = Tu(), i = Eu();
		K !== e || J !== t ? (nu = null, tu = Ne() + 500, Su(e, t)) : Hl = Xe(e, t);
		a: do
			try {
				if (Y !== 0 && q !== null) {
					t = q;
					var a = Bl;
					b: switch (Y) {
						case 1:
							Y = 0, Bl = null, Pu(e, t, a, 1);
							break;
						case 2:
						case 9:
							if (Oa(a)) {
								Y = 0, Bl = null, Nu(t);
								break;
							}
							t = function() {
								Y !== 2 && Y !== 9 || K !== e || (Y = 7), rd(e);
							}, a.then(t, t);
							break a;
						case 3:
							Y = 7;
							break a;
						case 4:
							Y = 5;
							break a;
						case 7:
							Oa(a) ? (Y = 0, Bl = null, Nu(t)) : (Y = 0, Bl = null, Pu(e, t, a, 7));
							break;
						case 5:
							var o = null;
							switch (q.tag) {
								case 26: o = q.memoizedState;
								case 5:
								case 27:
									var c = q;
									if (o ? Wf(o) : c.stateNode.complete) {
										Y = 0, Bl = null;
										var l = c.sibling;
										if (l !== null) q = l;
										else {
											var u = c.return;
											u === null ? q = null : (q = u, Fu(u));
										}
										break b;
									}
							}
							Y = 0, Bl = null, Pu(e, t, a, 5);
							break;
						case 6:
							Y = 0, Bl = null, Pu(e, t, a, 6);
							break;
						case 8:
							xu(), X = 6;
							break a;
						default: throw Error(s(462));
					}
				}
				ju();
				break;
			} catch (t) {
				Cu(e, t);
			}
		while (1);
		return Yi = Ji = null, D.H = r, D.A = i, G = n, q === null ? (K = null, J = 0, ri(), X) : 0;
	}
	function ju() {
		for (; q !== null && !je();) Mu(q);
	}
	function Mu(e) {
		var t = Nc(e.alternate, e, Wl);
		e.memoizedProps = e.pendingProps, t === null ? Fu(e) : q = t;
	}
	function Nu(e) {
		var t = e, n = t.alternate;
		switch (t.tag) {
			case 15:
			case 0:
				t = _c(n, t, t.pendingProps, t.type, void 0, J);
				break;
			case 11:
				t = _c(n, t, t.pendingProps, t.type.render, t.ref, J);
				break;
			case 5: Ao(t);
			default: Vc(n, t), t = q = mi(t, Wl), t = Nc(n, t, Wl);
		}
		e.memoizedProps = e.pendingProps, t === null ? Fu(e) : q = t;
	}
	function Pu(e, t, n, r) {
		Yi = Ji = null, Ao(t), Pa = null, Fa = 0;
		var i = t.return;
		try {
			if (nc(e, i, t, n, J)) {
				X = 1, Zs(e, xi(n, e.current)), q = null;
				return;
			}
		} catch (t) {
			if (i !== null) throw q = i, t;
			X = 1, Zs(e, xi(n, e.current)), q = null;
			return;
		}
		t.flags & 32768 ? (L || r === 1 ? e = !0 : Hl || J & 536870912 ? e = !1 : (Vl = e = !0, (r === 2 || r === 9 || r === 3 || r === 6) && (r = ao.current, r !== null && r.tag === 13 && (r.flags |= 16384))), Iu(t, e)) : Fu(t);
	}
	function Fu(e) {
		var t = e;
		do {
			if (t.flags & 32768) {
				Iu(t, Vl);
				return;
			}
			e = t.return;
			var n = zc(t.alternate, t, Wl);
			if (n !== null) {
				q = n;
				return;
			}
			if (t = t.sibling, t !== null) {
				q = t;
				return;
			}
			q = t = e;
		} while (t !== null);
		X === 0 && (X = 5);
	}
	function Iu(e, t) {
		do {
			var n = Bc(e.alternate, e);
			if (n !== null) {
				n.flags &= 32767, q = n;
				return;
			}
			if (n = e.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !t && (e = e.sibling, e !== null)) {
				q = e;
				return;
			}
			q = e = n;
		} while (e !== null);
		X = 6, q = null;
	}
	function Lu(e, t, n, r, i, a, o, c, l) {
		e.cancelPendingCommit = null;
		do
			Hu();
		while (iu !== 0);
		if (G & 6) throw Error(s(327));
		if (t !== null) {
			if (t === e.current) throw Error(s(177));
			if (a = t.lanes | t.childLanes, a |= ni, tt(e, n, a, o, c, l), e === K && (q = K = null, J = 0), ou = t, au = e, su = n, cu = a, lu = i, uu = r, t.subtreeFlags & 10256 || t.flags & 10256 ? (e.callbackNode = null, e.callbackPriority = 0, Xu(M, function() {
				return Uu(), null;
			})) : (e.callbackNode = null, e.callbackPriority = 0), r = (t.flags & 13878) != 0, t.subtreeFlags & 13878 || r) {
				r = D.T, D.T = null, i = O.p, O.p = 2, o = G, G |= 4;
				try {
					ol(e, t, n);
				} finally {
					G = o, O.p = i, D.T = r;
				}
			}
			iu = 1, Ru(), zu(), Bu();
		}
	}
	function Ru() {
		if (iu === 1) {
			iu = 0;
			var e = au, t = ou, n = (t.flags & 13878) != 0;
			if (t.subtreeFlags & 13878 || n) {
				n = D.T, D.T = null;
				var r = O.p;
				O.p = 2;
				var i = G;
				G |= 4;
				try {
					vl(t, e);
					var a = zd, o = Ar(e.containerInfo), s = a.focusedElem, c = a.selectionRange;
					if (o !== s && s && s.ownerDocument && kr(s.ownerDocument.documentElement, s)) {
						if (c !== null && jr(s)) {
							var l = c.start, u = c.end;
							if (u === void 0 && (u = l), "selectionStart" in s) s.selectionStart = l, s.selectionEnd = Math.min(u, s.value.length);
							else {
								var d = s.ownerDocument || document, f = d && d.defaultView || window;
								if (f.getSelection) {
									var p = f.getSelection(), m = s.textContent.length, h = Math.min(c.start, m), g = c.end === void 0 ? h : Math.min(c.end, m);
									!p.extend && h > g && (o = g, g = h, h = o);
									var _ = Or(s, h), v = Or(s, g);
									if (_ && v && (p.rangeCount !== 1 || p.anchorNode !== _.node || p.anchorOffset !== _.offset || p.focusNode !== v.node || p.focusOffset !== v.offset)) {
										var y = d.createRange();
										y.setStart(_.node, _.offset), p.removeAllRanges(), h > g ? (p.addRange(y), p.extend(v.node, v.offset)) : (y.setEnd(v.node, v.offset), p.addRange(y));
									}
								}
							}
						}
						for (d = [], p = s; p = p.parentNode;) p.nodeType === 1 && d.push({
							element: p,
							left: p.scrollLeft,
							top: p.scrollTop
						});
						for (typeof s.focus == "function" && s.focus(), s = 0; s < d.length; s++) {
							var b = d[s];
							b.element.scrollLeft = b.left, b.element.scrollTop = b.top;
						}
					}
					sp = !!Rd, zd = Rd = null;
				} finally {
					G = i, O.p = r, D.T = n;
				}
			}
			e.current = t, iu = 2;
		}
	}
	function zu() {
		if (iu === 2) {
			iu = 0;
			var e = au, t = ou, n = (t.flags & 8772) != 0;
			if (t.subtreeFlags & 8772 || n) {
				n = D.T, D.T = null;
				var r = O.p;
				O.p = 2;
				var i = G;
				G |= 4;
				try {
					sl(e, t.alternate, t);
				} finally {
					G = i, O.p = r, D.T = n;
				}
			}
			iu = 3;
		}
	}
	function Bu() {
		if (iu === 4 || iu === 3) {
			iu = 0, Me();
			var e = au, t = ou, n = su, r = uu;
			t.subtreeFlags & 10256 || t.flags & 10256 ? iu = 5 : (iu = 0, ou = au = null, Vu(e, e.pendingLanes));
			var i = e.pendingLanes;
			if (i === 0 && (ru = null), ot(n), t = t.stateNode, Be && typeof Be.onCommitFiberRoot == "function") try {
				Be.onCommitFiberRoot(ze, t, void 0, (t.current.flags & 128) == 128);
			} catch {}
			if (r !== null) {
				t = D.T, i = O.p, O.p = 2, D.T = null;
				try {
					for (var a = e.onRecoverableError, o = 0; o < r.length; o++) {
						var s = r[o];
						a(s.value, { componentStack: s.stack });
					}
				} finally {
					D.T = t, O.p = i;
				}
			}
			su & 3 && Hu(), rd(e), i = e.pendingLanes, n & 261930 && i & 42 ? e === fu ? du++ : (du = 0, fu = e) : du = 0, id(0, !1);
		}
	}
	function Vu(e, t) {
		(e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, da(t)));
	}
	function Hu() {
		return Ru(), zu(), Bu(), Uu();
	}
	function Uu() {
		if (iu !== 5) return !1;
		var e = au, t = cu;
		cu = 0;
		var n = ot(su), r = D.T, i = O.p;
		try {
			O.p = 32 > n ? 32 : n, D.T = null, n = lu, lu = null;
			var a = au, o = su;
			if (iu = 0, ou = au = null, su = 0, G & 6) throw Error(s(331));
			var c = G;
			if (G |= 4, Fl(a.current), Dl(a, a.current, o, n), G = c, id(0, !1), Be && typeof Be.onPostCommitFiberRoot == "function") try {
				Be.onPostCommitFiberRoot(ze, a);
			} catch {}
			return !0;
		} finally {
			O.p = i, D.T = r, Vu(e, t);
		}
	}
	function Wu(e, t, n) {
		t = xi(n, t), t = $s(e.stateNode, t, 2), e = Ka(e, t, 2), e !== null && (et(e, 2), rd(e));
	}
	function Z(e, t, n) {
		if (e.tag === 3) Wu(e, e, n);
		else for (; t !== null;) {
			if (t.tag === 3) {
				Wu(t, e, n);
				break;
			} else if (t.tag === 1) {
				var r = t.stateNode;
				if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (ru === null || !ru.has(r))) {
					e = xi(n, e), n = ec(2), r = Ka(t, n, 2), r !== null && (tc(n, r, t, e), et(r, 2), rd(r));
					break;
				}
			}
			t = t.return;
		}
	}
	function Gu(e, t, n) {
		var r = e.pingCache;
		if (r === null) {
			r = e.pingCache = new zl();
			var i = /* @__PURE__ */ new Set();
			r.set(t, i);
		} else i = r.get(t), i === void 0 && (i = /* @__PURE__ */ new Set(), r.set(t, i));
		i.has(n) || (Ul = !0, i.add(n), e = Ku.bind(null, e, t, n), t.then(e, e));
	}
	function Ku(e, t, n) {
		var r = e.pingCache;
		r !== null && r.delete(t), e.pingedLanes |= e.suspendedLanes & n, e.warmLanes &= ~n, K === e && (J & n) === n && (X === 4 || X === 3 && (J & 62914560) === J && 300 > Ne() - $l ? !(G & 2) && Su(e, 0) : ql |= n, Yl === J && (Yl = 0)), rd(e);
	}
	function qu(e, t) {
		t === 0 && (t = Qe()), e = oi(e, t), e !== null && (et(e, t), rd(e));
	}
	function Ju(e) {
		var t = e.memoizedState, n = 0;
		t !== null && (n = t.retryLane), qu(e, n);
	}
	function Yu(e, t) {
		var n = 0;
		switch (e.tag) {
			case 31:
			case 13:
				var r = e.stateNode, i = e.memoizedState;
				i !== null && (n = i.retryLane);
				break;
			case 19:
				r = e.stateNode;
				break;
			case 22:
				r = e.stateNode._retryCache;
				break;
			default: throw Error(s(314));
		}
		r !== null && r.delete(t), qu(e, n);
	}
	function Xu(e, t) {
		return Ae(e, t);
	}
	var Zu = null, Qu = null, $u = !1, ed = !1, td = !1, nd = 0;
	function rd(e) {
		e !== Qu && e.next === null && (Qu === null ? Zu = Qu = e : Qu = Qu.next = e), ed = !0, $u || ($u = !0, ud());
	}
	function id(e, t) {
		if (!td && ed) {
			td = !0;
			do
				for (var n = !1, r = Zu; r !== null;) {
					if (!t) if (e !== 0) {
						var i = r.pendingLanes;
						if (i === 0) var a = 0;
						else {
							var o = r.suspendedLanes, s = r.pingedLanes;
							a = (1 << 31 - He(42 | e) + 1) - 1, a &= i & ~(o & ~s), a = a & 201326741 ? a & 201326741 | 1 : a ? a | 2 : 0;
						}
						a !== 0 && (n = !0, ld(r, a));
					} else a = J, a = Ye(r, r === K ? a : 0, r.cancelPendingCommit !== null || r.timeoutHandle !== -1), !(a & 3) || Xe(r, a) || (n = !0, ld(r, a));
					r = r.next;
				}
			while (n);
			td = !1;
		}
	}
	function ad() {
		od();
	}
	function od() {
		ed = $u = !1;
		var e = 0;
		nd !== 0 && Gd() && (e = nd);
		for (var t = Ne(), n = null, r = Zu; r !== null;) {
			var i = r.next, a = sd(r, t);
			a === 0 ? (r.next = null, n === null ? Zu = i : n.next = i, i === null && (Qu = n)) : (n = r, (e !== 0 || a & 3) && (ed = !0)), r = i;
		}
		iu !== 0 && iu !== 5 || id(e, !1), nd !== 0 && (nd = 0);
	}
	function sd(e, t) {
		for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, a = e.pendingLanes & -62914561; 0 < a;) {
			var o = 31 - He(a), s = 1 << o, c = i[o];
			c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = Ze(s, t)) : c <= t && (e.expiredLanes |= s), a &= ~s;
		}
		if (t = K, n = J, n = Ye(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r = e.callbackNode, n === 0 || e === t && (Y === 2 || Y === 9) || e.cancelPendingCommit !== null) return r !== null && r !== null && A(r), e.callbackNode = null, e.callbackPriority = 0;
		if (!(n & 3) || Xe(e, n)) {
			if (t = n & -n, t === e.callbackPriority) return t;
			switch (r !== null && A(r), ot(n)) {
				case 2:
				case 8:
					n = j;
					break;
				case 32:
					n = M;
					break;
				case 268435456:
					n = Ie;
					break;
				default: n = M;
			}
			return r = cd.bind(null, e), n = Ae(n, r), e.callbackPriority = t, e.callbackNode = n, t;
		}
		return r !== null && r !== null && A(r), e.callbackPriority = 2, e.callbackNode = null, 2;
	}
	function cd(e, t) {
		if (iu !== 0 && iu !== 5) return e.callbackNode = null, e.callbackPriority = 0, null;
		var n = e.callbackNode;
		if (Hu() && e.callbackNode !== n) return null;
		var r = J;
		return r = Ye(e, e === K ? r : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1), r === 0 ? null : (gu(e, r, t), sd(e, Ne()), e.callbackNode != null && e.callbackNode === n ? cd.bind(null, e) : null);
	}
	function ld(e, t) {
		if (Hu()) return null;
		gu(e, t, !0);
	}
	function ud() {
		Yd(function() {
			G & 6 ? Ae(Fe, ad) : od();
		});
	}
	function dd() {
		if (nd === 0) {
			var e = ma;
			e === 0 && (e = Ke, Ke <<= 1, !(Ke & 261888) && (Ke = 256)), nd = e;
		}
		return nd;
	}
	function fd(e) {
		return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : tn("" + e);
	}
	function pd(e, t) {
		var n = t.ownerDocument.createElement("input");
		return n.name = t.name, n.value = t.value, e.id && n.setAttribute("form", e.id), t.parentNode.insertBefore(n, t), e = new FormData(e), n.parentNode.removeChild(n), e;
	}
	function md(e, t, n, r, i) {
		if (t === "submit" && n && n.stateNode === i) {
			var a = fd((i[dt] || null).action), o = r.submitter;
			o && (t = (t = o[dt] || null) ? fd(t.formAction) : o.getAttribute("formAction"), t !== null && (a = t, o = null));
			var s = new wn("action", "action", null, r, i);
			e.push({
				event: s,
				listeners: [{
					instance: null,
					listener: function() {
						if (r.defaultPrevented) {
							if (nd !== 0) {
								var e = o ? pd(i, o) : new FormData(i);
								Ts(n, {
									pending: !0,
									data: e,
									method: i.method,
									action: a
								}, null, e);
							}
						} else typeof a == "function" && (s.preventDefault(), e = o ? pd(i, o) : new FormData(i), Ts(n, {
							pending: !0,
							data: e,
							method: i.method,
							action: a
						}, a, e));
					},
					currentTarget: i
				}]
			});
		}
	}
	for (var hd = 0; hd < Zr.length; hd++) {
		var gd = Zr[hd];
		Qr(gd.toLowerCase(), "on" + (gd[0].toUpperCase() + gd.slice(1)));
	}
	Qr(Ur, "onAnimationEnd"), Qr(Wr, "onAnimationIteration"), Qr(Gr, "onAnimationStart"), Qr("dblclick", "onDoubleClick"), Qr("focusin", "onFocus"), Qr("focusout", "onBlur"), Qr(Kr, "onTransitionRun"), Qr(qr, "onTransitionStart"), Qr(Jr, "onTransitionCancel"), Qr(Yr, "onTransitionEnd"), Et("onMouseEnter", ["mouseout", "mouseover"]), Et("onMouseLeave", ["mouseout", "mouseover"]), Et("onPointerEnter", ["pointerout", "pointerover"]), Et("onPointerLeave", ["pointerout", "pointerover"]), Tt("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Tt("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Tt("onBeforeInput", [
		"compositionend",
		"keypress",
		"textInput",
		"paste"
	]), Tt("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Tt("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Tt("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var _d = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), vd = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(_d));
	function yd(e, t) {
		t = (t & 4) != 0;
		for (var n = 0; n < e.length; n++) {
			var r = e[n], i = r.event;
			r = r.listeners;
			a: {
				var a = void 0;
				if (t) for (var o = r.length - 1; 0 <= o; o--) {
					var s = r[o], c = s.instance, l = s.currentTarget;
					if (s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						$r(e);
					}
					i.currentTarget = null, a = c;
				}
				else for (o = 0; o < r.length; o++) {
					if (s = r[o], c = s.instance, l = s.currentTarget, s = s.listener, c !== a && i.isPropagationStopped()) break a;
					a = s, i.currentTarget = l;
					try {
						a(i);
					} catch (e) {
						$r(e);
					}
					i.currentTarget = null, a = c;
				}
			}
		}
	}
	function Q(e, t) {
		var n = t[pt];
		n === void 0 && (n = t[pt] = /* @__PURE__ */ new Set());
		var r = e + "__bubble";
		n.has(r) || (Cd(t, e, 2, !1), n.add(r));
	}
	function bd(e, t, n) {
		var r = 0;
		t && (r |= 4), Cd(n, e, r, t);
	}
	var xd = "_reactListening" + Math.random().toString(36).slice(2);
	function Sd(e) {
		if (!e[xd]) {
			e[xd] = !0, Ct.forEach(function(t) {
				t !== "selectionchange" && (vd.has(t) || bd(t, !1, e), bd(t, !0, e));
			});
			var t = e.nodeType === 9 ? e : e.ownerDocument;
			t === null || t[xd] || (t[xd] = !0, bd("selectionchange", !1, t));
		}
	}
	function Cd(e, t, n, r) {
		switch (mp(t)) {
			case 2:
				var i = cp;
				break;
			case 8:
				i = lp;
				break;
			default: i = up;
		}
		n = i.bind(null, t, n, e), i = void 0, !pn || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0), r ? i === void 0 ? e.addEventListener(t, n, !0) : e.addEventListener(t, n, {
			capture: !0,
			passive: i
		}) : i === void 0 ? e.addEventListener(t, n, !1) : e.addEventListener(t, n, { passive: i });
	}
	function wd(e, t, n, r, i) {
		var a = r;
		if (!(t & 1) && !(t & 2) && r !== null) a: for (;;) {
			if (r === null) return;
			var o = r.tag;
			if (o === 3 || o === 4) {
				var s = r.stateNode.containerInfo;
				if (s === i) break;
				if (o === 4) for (o = r.return; o !== null;) {
					var c = o.tag;
					if ((c === 3 || c === 4) && o.stateNode.containerInfo === i) return;
					o = o.return;
				}
				for (; s !== null;) {
					if (o = yt(s), o === null) return;
					if (c = o.tag, c === 5 || c === 6 || c === 26 || c === 27) {
						r = a = o;
						continue a;
					}
					s = s.parentNode;
				}
			}
			r = r.return;
		}
		un(function() {
			var r = a, i = an(n), o = [];
			a: {
				var s = Xr.get(e);
				if (s !== void 0) {
					var c = wn, u = e;
					switch (e) {
						case "keypress": if (yn(n) === 0) break a;
						case "keydown":
						case "keyup":
							c = Hn;
							break;
						case "focusin":
							u = "focus", c = Nn;
							break;
						case "focusout":
							u = "blur", c = Nn;
							break;
						case "beforeblur":
						case "afterblur":
							c = Nn;
							break;
						case "click": if (n.button === 2) break a;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							c = jn;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							c = Mn;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							c = Wn;
							break;
						case Ur:
						case Wr:
						case Gr:
							c = Pn;
							break;
						case Yr:
							c = Gn;
							break;
						case "scroll":
						case "scrollend":
							c = En;
							break;
						case "wheel":
							c = Kn;
							break;
						case "copy":
						case "cut":
						case "paste":
							c = Fn;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							c = Un;
							break;
						case "toggle":
						case "beforetoggle": c = qn;
					}
					var d = (t & 4) != 0, f = !d && (e === "scroll" || e === "scrollend"), p = d ? s === null ? null : s + "Capture" : s;
					d = [];
					for (var m = r, h; m !== null;) {
						var g = m;
						if (h = g.stateNode, g = g.tag, g !== 5 && g !== 26 && g !== 27 || h === null || p === null || (g = dn(m, p), g != null && d.push(Td(m, g, h))), f) break;
						m = m.return;
					}
					0 < d.length && (s = new c(s, u, null, n, i), o.push({
						event: s,
						listeners: d
					}));
				}
			}
			if (!(t & 7)) {
				a: {
					if (s = e === "mouseover" || e === "pointerover", c = e === "mouseout" || e === "pointerout", s && n !== rn && (u = n.relatedTarget || n.fromElement) && (yt(u) || u[ft])) break a;
					if ((c || s) && (s = i.window === i ? i : (s = i.ownerDocument) ? s.defaultView || s.parentWindow : window, c ? (u = n.relatedTarget || n.toElement, c = r, u = u ? yt(u) : null, u !== null && (f = l(u), d = u.tag, u !== f || d !== 5 && d !== 27 && d !== 6) && (u = null)) : (c = null, u = r), c !== u)) {
						if (d = jn, g = "onMouseLeave", p = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (d = Un, g = "onPointerLeave", p = "onPointerEnter", m = "pointer"), f = c == null ? s : xt(c), h = u == null ? s : xt(u), s = new d(g, m + "leave", c, n, i), s.target = f, s.relatedTarget = h, g = null, yt(i) === r && (d = new d(p, m + "enter", u, n, i), d.target = h, d.relatedTarget = f, g = d), f = g, c && u) b: {
							for (d = Dd, p = c, m = u, h = 0, g = p; g; g = d(g)) h++;
							g = 0;
							for (var _ = m; _; _ = d(_)) g++;
							for (; 0 < h - g;) p = d(p), h--;
							for (; 0 < g - h;) m = d(m), g--;
							for (; h--;) {
								if (p === m || m !== null && p === m.alternate) {
									d = p;
									break b;
								}
								p = d(p), m = d(m);
							}
							d = null;
						}
						else d = null;
						c !== null && Od(o, s, c, d, !1), u !== null && f !== null && Od(o, f, u, d, !0);
					}
				}
				a: {
					if (s = r ? xt(r) : window, c = s.nodeName && s.nodeName.toLowerCase(), c === "select" || c === "input" && s.type === "file") var v = pr;
					else if (sr(s)) if (mr) v = Cr;
					else {
						v = xr;
						var y = br;
					}
					else c = s.nodeName, !c || c.toLowerCase() !== "input" || s.type !== "checkbox" && s.type !== "radio" ? r && Qt(r.elementType) && (v = pr) : v = Sr;
					if (v &&= v(e, r)) {
						cr(o, v, n, i);
						break a;
					}
					y && y(e, s, r), e === "focusout" && r && s.type === "number" && r.memoizedProps.value != null && Wt(s, "number", s.value);
				}
				switch (y = r ? xt(r) : window, e) {
					case "focusin":
						(sr(y) || y.contentEditable === "true") && (Nr = y, Pr = r, Fr = null);
						break;
					case "focusout":
						Fr = Pr = Nr = null;
						break;
					case "mousedown":
						Ir = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						Ir = !1, Lr(o, n, i);
						break;
					case "selectionchange": if (Mr) break;
					case "keydown":
					case "keyup": Lr(o, n, i);
				}
				var b;
				if (Yn) b: {
					switch (e) {
						case "compositionstart":
							var x = "onCompositionStart";
							break b;
						case "compositionend":
							x = "onCompositionEnd";
							break b;
						case "compositionupdate":
							x = "onCompositionUpdate";
							break b;
					}
					x = void 0;
				}
				else rr ? tr(e, n) && (x = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (x = "onCompositionStart");
				x && (Qn && n.locale !== "ko" && (rr || x !== "onCompositionStart" ? x === "onCompositionEnd" && rr && (b = vn()) : (hn = i, gn = "value" in hn ? hn.value : hn.textContent, rr = !0)), y = Ed(r, x), 0 < y.length && (x = new In(x, e, null, n, i), o.push({
					event: x,
					listeners: y
				}), b ? x.data = b : (b = nr(n), b !== null && (x.data = b)))), (b = Zn ? ir(e, n) : ar(e, n)) && (x = Ed(r, "onBeforeInput"), 0 < x.length && (y = new In("onBeforeInput", "beforeinput", null, n, i), o.push({
					event: y,
					listeners: x
				}), y.data = b)), md(o, e, r, n, i);
			}
			yd(o, t);
		});
	}
	function Td(e, t, n) {
		return {
			instance: e,
			listener: t,
			currentTarget: n
		};
	}
	function Ed(e, t) {
		for (var n = t + "Capture", r = []; e !== null;) {
			var i = e, a = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || a === null || (i = dn(e, n), i != null && r.unshift(Td(e, i, a)), i = dn(e, t), i != null && r.push(Td(e, i, a))), e.tag === 3) return r;
			e = e.return;
		}
		return [];
	}
	function Dd(e) {
		if (e === null) return null;
		do
			e = e.return;
		while (e && e.tag !== 5 && e.tag !== 27);
		return e || null;
	}
	function Od(e, t, n, r, i) {
		for (var a = t._reactName, o = []; n !== null && n !== r;) {
			var s = n, c = s.alternate, l = s.stateNode;
			if (s = s.tag, c !== null && c === r) break;
			s !== 5 && s !== 26 && s !== 27 || l === null || (c = l, i ? (l = dn(n, a), l != null && o.unshift(Td(n, l, c))) : i || (l = dn(n, a), l != null && o.push(Td(n, l, c)))), n = n.return;
		}
		o.length !== 0 && e.push({
			event: t,
			listeners: o
		});
	}
	var kd = /\r\n?/g, Ad = /\u0000|\uFFFD/g;
	function jd(e) {
		return (typeof e == "string" ? e : "" + e).replace(kd, "\n").replace(Ad, "");
	}
	function Md(e, t) {
		return t = jd(t), jd(e) === t;
	}
	function $(e, t, n, r, i, a) {
		switch (n) {
			case "children":
				typeof r == "string" ? t === "body" || t === "textarea" && r === "" || Jt(e, r) : (typeof r == "number" || typeof r == "bigint") && t !== "body" && Jt(e, "" + r);
				break;
			case "className":
				Mt(e, "class", r);
				break;
			case "tabIndex":
				Mt(e, "tabindex", r);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Mt(e, n, r);
				break;
			case "style":
				Zt(e, r, a);
				break;
			case "data": if (t !== "object") {
				Mt(e, "data", r);
				break;
			}
			case "src":
			case "href":
				if (r === "" && (t !== "a" || n !== "href")) {
					e.removeAttribute(n);
					break;
				}
				if (r == null || typeof r == "function" || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = tn("" + r), e.setAttribute(n, r);
				break;
			case "action":
			case "formAction":
				if (typeof r == "function") {
					e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break;
				} else typeof a == "function" && (n === "formAction" ? (t !== "input" && $(e, t, "name", i.name, i, null), $(e, t, "formEncType", i.formEncType, i, null), $(e, t, "formMethod", i.formMethod, i, null), $(e, t, "formTarget", i.formTarget, i, null)) : ($(e, t, "encType", i.encType, i, null), $(e, t, "method", i.method, i, null), $(e, t, "target", i.target, i, null)));
				if (r == null || typeof r == "symbol" || typeof r == "boolean") {
					e.removeAttribute(n);
					break;
				}
				r = tn("" + r), e.setAttribute(n, r);
				break;
			case "onClick":
				r != null && (e.onclick = nn);
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				break;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(s(61));
					if (n = r.__html, n != null) {
						if (i.children != null) throw Error(s(60));
						e.innerHTML = n;
					}
				}
				break;
			case "multiple":
				e.multiple = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "muted":
				e.muted = r && typeof r != "function" && typeof r != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref": break;
			case "autoFocus": break;
			case "xlinkHref":
				if (r == null || typeof r == "function" || typeof r == "boolean" || typeof r == "symbol") {
					e.removeAttribute("xlink:href");
					break;
				}
				n = tn("" + r), e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "" + r) : e.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				r && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
				break;
			case "capture":
			case "download":
				!0 === r ? e.setAttribute(n, "") : !1 !== r && r != null && typeof r != "function" && typeof r != "symbol" ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				r != null && typeof r != "function" && typeof r != "symbol" && !isNaN(r) && 1 <= r ? e.setAttribute(n, r) : e.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				r == null || typeof r == "function" || typeof r == "symbol" || isNaN(r) ? e.removeAttribute(n) : e.setAttribute(n, r);
				break;
			case "popover":
				Q("beforetoggle", e), Q("toggle", e), jt(e, "popover", r);
				break;
			case "xlinkActuate":
				Nt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", r);
				break;
			case "xlinkArcrole":
				Nt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", r);
				break;
			case "xlinkRole":
				Nt(e, "http://www.w3.org/1999/xlink", "xlink:role", r);
				break;
			case "xlinkShow":
				Nt(e, "http://www.w3.org/1999/xlink", "xlink:show", r);
				break;
			case "xlinkTitle":
				Nt(e, "http://www.w3.org/1999/xlink", "xlink:title", r);
				break;
			case "xlinkType":
				Nt(e, "http://www.w3.org/1999/xlink", "xlink:type", r);
				break;
			case "xmlBase":
				Nt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", r);
				break;
			case "xmlLang":
				Nt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", r);
				break;
			case "xmlSpace":
				Nt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", r);
				break;
			case "is":
				jt(e, "is", r);
				break;
			case "innerText":
			case "textContent": break;
			default: (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = $t.get(n) || n, jt(e, n, r));
		}
	}
	function Nd(e, t, n, r, i, a) {
		switch (n) {
			case "style":
				Zt(e, r, a);
				break;
			case "dangerouslySetInnerHTML":
				if (r != null) {
					if (typeof r != "object" || !("__html" in r)) throw Error(s(61));
					if (n = r.__html, n != null) {
						if (i.children != null) throw Error(s(60));
						e.innerHTML = n;
					}
				}
				break;
			case "children":
				typeof r == "string" ? Jt(e, r) : (typeof r == "number" || typeof r == "bigint") && Jt(e, "" + r);
				break;
			case "onScroll":
				r != null && Q("scroll", e);
				break;
			case "onScrollEnd":
				r != null && Q("scrollend", e);
				break;
			case "onClick":
				r != null && (e.onclick = nn);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref": break;
			case "innerText":
			case "textContent": break;
			default: if (!wt.hasOwnProperty(n)) a: {
				if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), t = n.slice(2, i ? n.length - 7 : void 0), a = e[dt] || null, a = a == null ? null : a[n], typeof a == "function" && e.removeEventListener(t, a, i), typeof r == "function")) {
					typeof a != "function" && a !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)), e.addEventListener(t, r, i);
					break a;
				}
				n in e ? e[n] = r : !0 === r ? e.setAttribute(n, "") : jt(e, n, r);
			}
		}
	}
	function Pd(e, t, n) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "img":
				Q("error", e), Q("load", e);
				var r = !1, i = !1, a;
				for (a in n) if (n.hasOwnProperty(a)) {
					var o = n[a];
					if (o != null) switch (a) {
						case "src":
							r = !0;
							break;
						case "srcSet":
							i = !0;
							break;
						case "children":
						case "dangerouslySetInnerHTML": throw Error(s(137, t));
						default: $(e, t, a, o, n, null);
					}
				}
				i && $(e, t, "srcSet", n.srcSet, n, null), r && $(e, t, "src", n.src, n, null);
				return;
			case "input":
				Q("invalid", e);
				var c = a = o = i = null, l = null, u = null;
				for (r in n) if (n.hasOwnProperty(r)) {
					var d = n[r];
					if (d != null) switch (r) {
						case "name":
							i = d;
							break;
						case "type":
							o = d;
							break;
						case "checked":
							l = d;
							break;
						case "defaultChecked":
							u = d;
							break;
						case "value":
							a = d;
							break;
						case "defaultValue":
							c = d;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (d != null) throw Error(s(137, t));
							break;
						default: $(e, t, r, d, n, null);
					}
				}
				Ut(e, a, c, l, u, o, i, !1);
				return;
			case "select":
				for (i in Q("invalid", e), r = o = a = null, n) if (n.hasOwnProperty(i) && (c = n[i], c != null)) switch (i) {
					case "value":
						a = c;
						break;
					case "defaultValue":
						o = c;
						break;
					case "multiple": r = c;
					default: $(e, t, i, c, n, null);
				}
				t = a, n = o, e.multiple = !!r, t == null ? n != null && Gt(e, !!r, n, !0) : Gt(e, !!r, t, !1);
				return;
			case "textarea":
				for (o in Q("invalid", e), a = i = r = null, n) if (n.hasOwnProperty(o) && (c = n[o], c != null)) switch (o) {
					case "value":
						r = c;
						break;
					case "defaultValue":
						i = c;
						break;
					case "children":
						a = c;
						break;
					case "dangerouslySetInnerHTML":
						if (c != null) throw Error(s(91));
						break;
					default: $(e, t, o, c, n, null);
				}
				qt(e, r, i, a);
				return;
			case "option":
				for (l in n) if (n.hasOwnProperty(l) && (r = n[l], r != null)) switch (l) {
					case "selected":
						e.selected = r && typeof r != "function" && typeof r != "symbol";
						break;
					default: $(e, t, l, r, n, null);
				}
				return;
			case "dialog":
				Q("beforetoggle", e), Q("toggle", e), Q("cancel", e), Q("close", e);
				break;
			case "iframe":
			case "object":
				Q("load", e);
				break;
			case "video":
			case "audio":
				for (r = 0; r < _d.length; r++) Q(_d[r], e);
				break;
			case "image":
				Q("error", e), Q("load", e);
				break;
			case "details":
				Q("toggle", e);
				break;
			case "embed":
			case "source":
			case "link": Q("error", e), Q("load", e);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (u in n) if (n.hasOwnProperty(u) && (r = n[u], r != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML": throw Error(s(137, t));
					default: $(e, t, u, r, n, null);
				}
				return;
			default: if (Qt(t)) {
				for (d in n) n.hasOwnProperty(d) && (r = n[d], r !== void 0 && Nd(e, t, d, r, n, void 0));
				return;
			}
		}
		for (c in n) n.hasOwnProperty(c) && (r = n[c], r != null && $(e, t, c, r, n, null));
	}
	function Fd(e, t, n, r) {
		switch (t) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li": break;
			case "input":
				var i = null, a = null, o = null, c = null, l = null, u = null, d = null;
				for (m in n) {
					var f = n[m];
					if (n.hasOwnProperty(m) && f != null) switch (m) {
						case "checked": break;
						case "value": break;
						case "defaultValue": l = f;
						default: r.hasOwnProperty(m) || $(e, t, m, null, r, f);
					}
				}
				for (var p in r) {
					var m = r[p];
					if (f = n[p], r.hasOwnProperty(p) && (m != null || f != null)) switch (p) {
						case "type":
							a = m;
							break;
						case "name":
							i = m;
							break;
						case "checked":
							u = m;
							break;
						case "defaultChecked":
							d = m;
							break;
						case "value":
							o = m;
							break;
						case "defaultValue":
							c = m;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (m != null) throw Error(s(137, t));
							break;
						default: m !== f && $(e, t, p, m, r, f);
					}
				}
				Ht(e, o, c, l, u, d, a, i);
				return;
			case "select":
				for (a in m = o = c = p = null, n) if (l = n[a], n.hasOwnProperty(a) && l != null) switch (a) {
					case "value": break;
					case "multiple": m = l;
					default: r.hasOwnProperty(a) || $(e, t, a, null, r, l);
				}
				for (i in r) if (a = r[i], l = n[i], r.hasOwnProperty(i) && (a != null || l != null)) switch (i) {
					case "value":
						p = a;
						break;
					case "defaultValue":
						c = a;
						break;
					case "multiple": o = a;
					default: a !== l && $(e, t, i, a, r, l);
				}
				t = c, n = o, r = m, p == null ? !!r != !!n && (t == null ? Gt(e, !!n, n ? [] : "", !1) : Gt(e, !!n, t, !0)) : Gt(e, !!n, p, !1);
				return;
			case "textarea":
				for (c in m = p = null, n) if (i = n[c], n.hasOwnProperty(c) && i != null && !r.hasOwnProperty(c)) switch (c) {
					case "value": break;
					case "children": break;
					default: $(e, t, c, null, r, i);
				}
				for (o in r) if (i = r[o], a = n[o], r.hasOwnProperty(o) && (i != null || a != null)) switch (o) {
					case "value":
						p = i;
						break;
					case "defaultValue":
						m = i;
						break;
					case "children": break;
					case "dangerouslySetInnerHTML":
						if (i != null) throw Error(s(91));
						break;
					default: i !== a && $(e, t, o, i, r, a);
				}
				Kt(e, p, m);
				return;
			case "option":
				for (var h in n) if (p = n[h], n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h)) switch (h) {
					case "selected":
						e.selected = !1;
						break;
					default: $(e, t, h, null, r, p);
				}
				for (l in r) if (p = r[l], m = n[l], r.hasOwnProperty(l) && p !== m && (p != null || m != null)) switch (l) {
					case "selected":
						e.selected = p && typeof p != "function" && typeof p != "symbol";
						break;
					default: $(e, t, l, p, r, m);
				}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var g in n) p = n[g], n.hasOwnProperty(g) && p != null && !r.hasOwnProperty(g) && $(e, t, g, null, r, p);
				for (u in r) if (p = r[u], m = n[u], r.hasOwnProperty(u) && p !== m && (p != null || m != null)) switch (u) {
					case "children":
					case "dangerouslySetInnerHTML":
						if (p != null) throw Error(s(137, t));
						break;
					default: $(e, t, u, p, r, m);
				}
				return;
			default: if (Qt(t)) {
				for (var _ in n) p = n[_], n.hasOwnProperty(_) && p !== void 0 && !r.hasOwnProperty(_) && Nd(e, t, _, void 0, r, p);
				for (d in r) p = r[d], m = n[d], !r.hasOwnProperty(d) || p === m || p === void 0 && m === void 0 || Nd(e, t, d, p, r, m);
				return;
			}
		}
		for (var v in n) p = n[v], n.hasOwnProperty(v) && p != null && !r.hasOwnProperty(v) && $(e, t, v, null, r, p);
		for (f in r) p = r[f], m = n[f], !r.hasOwnProperty(f) || p === m || p == null && m == null || $(e, t, f, p, r, m);
	}
	function Id(e) {
		switch (e) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link": return !0;
			default: return !1;
		}
	}
	function Ld() {
		if (typeof performance.getEntriesByType == "function") {
			for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), r = 0; r < n.length; r++) {
				var i = n[r], a = i.transferSize, o = i.initiatorType, s = i.duration;
				if (a && s && Id(o)) {
					for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
						var c = n[r], l = c.startTime;
						if (l > s) break;
						var u = c.transferSize, d = c.initiatorType;
						u && Id(d) && (c = c.responseEnd, o += u * (c < s ? 1 : (s - l) / (c - l)));
					}
					if (--r, t += 8 * (a + o) / (i.duration / 1e3), e++, 10 < e) break;
				}
			}
			if (0 < e) return t / e / 1e6;
		}
		return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
	}
	var Rd = null, zd = null;
	function Bd(e) {
		return e.nodeType === 9 ? e : e.ownerDocument;
	}
	function Vd(e) {
		switch (e) {
			case "http://www.w3.org/2000/svg": return 1;
			case "http://www.w3.org/1998/Math/MathML": return 2;
			default: return 0;
		}
	}
	function Hd(e, t) {
		if (e === 0) switch (t) {
			case "svg": return 1;
			case "math": return 2;
			default: return 0;
		}
		return e === 1 && t === "foreignObject" ? 0 : e;
	}
	function Ud(e, t) {
		return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
	}
	var Wd = null;
	function Gd() {
		var e = window.event;
		return e && e.type === "popstate" ? e === Wd ? !1 : (Wd = e, !0) : (Wd = null, !1);
	}
	var Kd = typeof setTimeout == "function" ? setTimeout : void 0, qd = typeof clearTimeout == "function" ? clearTimeout : void 0, Jd = typeof Promise == "function" ? Promise : void 0, Yd = typeof queueMicrotask == "function" ? queueMicrotask : Jd === void 0 ? Kd : function(e) {
		return Jd.resolve(null).then(e).catch(Xd);
	};
	function Xd(e) {
		setTimeout(function() {
			throw e;
		});
	}
	function Zd(e) {
		return e === "head";
	}
	function Qd(e, t) {
		var n = t, r = 0;
		do {
			var i = n.nextSibling;
			if (e.removeChild(n), i && i.nodeType === 8) if (n = i.data, n === "/$" || n === "/&") {
				if (r === 0) {
					e.removeChild(i), Np(t);
					return;
				}
				r--;
			} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") r++;
			else if (n === "html") pf(e.ownerDocument.documentElement);
			else if (n === "head") {
				n = e.ownerDocument.head, pf(n);
				for (var a = n.firstChild; a;) {
					var o = a.nextSibling, s = a.nodeName;
					a[_t] || s === "SCRIPT" || s === "STYLE" || s === "LINK" && a.rel.toLowerCase() === "stylesheet" || n.removeChild(a), a = o;
				}
			} else n === "body" && pf(e.ownerDocument.body);
			n = i;
		} while (n);
		Np(t);
	}
	function $d(e, t) {
		var n = e;
		e = 0;
		do {
			var r = n.nextSibling;
			if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), r && r.nodeType === 8) if (n = r.data, n === "/$") {
				if (e === 0) break;
				e--;
			} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
			n = r;
		} while (n);
	}
	function ef(e) {
		var t = e.firstChild;
		for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
			var n = t;
			switch (t = t.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					ef(n), vt(n);
					continue;
				case "SCRIPT":
				case "STYLE": continue;
				case "LINK": if (n.rel.toLowerCase() === "stylesheet") continue;
			}
			e.removeChild(n);
		}
	}
	function tf(e, t, n, r) {
		for (; e.nodeType === 1;) {
			var i = n;
			if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
				if (!r && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
			} else if (!r) if (t === "input" && e.type === "hidden") {
				var a = i.name == null ? null : "" + i.name;
				if (i.type === "hidden" && e.getAttribute("name") === a) return e;
			} else return e;
			else if (!e[_t]) switch (t) {
				case "meta":
					if (!e.hasAttribute("itemprop")) break;
					return e;
				case "link":
					if (a = e.getAttribute("rel"), a === "stylesheet" && e.hasAttribute("data-precedence") || a !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title)) break;
					return e;
				case "style":
					if (e.hasAttribute("data-precedence")) break;
					return e;
				case "script":
					if (a = e.getAttribute("src"), (a !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && a && e.hasAttribute("async") && !e.hasAttribute("itemprop")) break;
					return e;
				default: return e;
			}
			if (e = cf(e.nextSibling), e === null) break;
		}
		return null;
	}
	function nf(e, t, n) {
		if (t === "") return null;
		for (; e.nodeType !== 3;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = cf(e.nextSibling), e === null)) return null;
		return e;
	}
	function rf(e, t) {
		for (; e.nodeType !== 8;) if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = cf(e.nextSibling), e === null)) return null;
		return e;
	}
	function af(e) {
		return e.data === "$?" || e.data === "$~";
	}
	function of(e) {
		return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
	}
	function sf(e, t) {
		var n = e.ownerDocument;
		if (e.data === "$~") e._reactRetry = t;
		else if (e.data !== "$?" || n.readyState !== "loading") t();
		else {
			var r = function() {
				t(), n.removeEventListener("DOMContentLoaded", r);
			};
			n.addEventListener("DOMContentLoaded", r), e._reactRetry = r;
		}
	}
	function cf(e) {
		for (; e != null; e = e.nextSibling) {
			var t = e.nodeType;
			if (t === 1 || t === 3) break;
			if (t === 8) {
				if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F") break;
				if (t === "/$" || t === "/&") return null;
			}
		}
		return e;
	}
	var lf = null;
	function uf(e) {
		e = e.nextSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "/$" || n === "/&") {
					if (t === 0) return cf(e.nextSibling);
					t--;
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++;
			}
			e = e.nextSibling;
		}
		return null;
	}
	function df(e) {
		e = e.previousSibling;
		for (var t = 0; e;) {
			if (e.nodeType === 8) {
				var n = e.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (t === 0) return e;
					t--;
				} else n !== "/$" && n !== "/&" || t++;
			}
			e = e.previousSibling;
		}
		return null;
	}
	function ff(e, t, n) {
		switch (t = Bd(n), e) {
			case "html":
				if (e = t.documentElement, !e) throw Error(s(452));
				return e;
			case "head":
				if (e = t.head, !e) throw Error(s(453));
				return e;
			case "body":
				if (e = t.body, !e) throw Error(s(454));
				return e;
			default: throw Error(s(451));
		}
	}
	function pf(e) {
		for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
		vt(e);
	}
	var mf = /* @__PURE__ */ new Map(), hf = /* @__PURE__ */ new Set();
	function gf(e) {
		return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
	}
	var _f = O.d;
	O.d = {
		f: vf,
		r: yf,
		D: Sf,
		C: Cf,
		L: wf,
		m: Tf,
		X: Df,
		S: Ef,
		M: Of
	};
	function vf() {
		var e = _f.f(), t = bu();
		return e || t;
	}
	function yf(e) {
		var t = bt(e);
		t !== null && t.tag === 5 && t.type === "form" ? Ds(t) : _f.r(e);
	}
	var bf = typeof document > "u" ? null : document;
	function xf(e, t, n) {
		var r = bf;
		if (r && typeof t == "string" && t) {
			var i = Vt(t);
			i = "link[rel=\"" + e + "\"][href=\"" + i + "\"]", typeof n == "string" && (i += "[crossorigin=\"" + n + "\"]"), hf.has(i) || (hf.add(i), e = {
				rel: e,
				crossOrigin: n,
				href: t
			}, r.querySelector(i) === null && (t = r.createElement("link"), Pd(t, "link", e), F(t), r.head.appendChild(t)));
		}
	}
	function Sf(e) {
		_f.D(e), xf("dns-prefetch", e, null);
	}
	function Cf(e, t) {
		_f.C(e, t), xf("preconnect", e, t);
	}
	function wf(e, t, n) {
		_f.L(e, t, n);
		var r = bf;
		if (r && e && t) {
			var i = "link[rel=\"preload\"][as=\"" + Vt(t) + "\"]";
			t === "image" && n && n.imageSrcSet ? (i += "[imagesrcset=\"" + Vt(n.imageSrcSet) + "\"]", typeof n.imageSizes == "string" && (i += "[imagesizes=\"" + Vt(n.imageSizes) + "\"]")) : i += "[href=\"" + Vt(e) + "\"]";
			var a = i;
			switch (t) {
				case "style":
					a = Af(e);
					break;
				case "script": a = Pf(e);
			}
			mf.has(a) || (e = h({
				rel: "preload",
				href: t === "image" && n && n.imageSrcSet ? void 0 : e,
				as: t
			}, n), mf.set(a, e), r.querySelector(i) !== null || t === "style" && r.querySelector(jf(a)) || t === "script" && r.querySelector(Ff(a)) || (t = r.createElement("link"), Pd(t, "link", e), F(t), r.head.appendChild(t)));
		}
	}
	function Tf(e, t) {
		_f.m(e, t);
		var n = bf;
		if (n && e) {
			var r = t && typeof t.as == "string" ? t.as : "script", i = "link[rel=\"modulepreload\"][as=\"" + Vt(r) + "\"][href=\"" + Vt(e) + "\"]", a = i;
			switch (r) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script": a = Pf(e);
			}
			if (!mf.has(a) && (e = h({
				rel: "modulepreload",
				href: e
			}, t), mf.set(a, e), n.querySelector(i) === null)) {
				switch (r) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script": if (n.querySelector(Ff(a))) return;
				}
				r = n.createElement("link"), Pd(r, "link", e), F(r), n.head.appendChild(r);
			}
		}
	}
	function Ef(e, t, n) {
		_f.S(e, t, n);
		var r = bf;
		if (r && e) {
			var i = St(r).hoistableStyles, a = Af(e);
			t ||= "default";
			var o = i.get(a);
			if (!o) {
				var s = {
					loading: 0,
					preload: null
				};
				if (o = r.querySelector(jf(a))) s.loading = 5;
				else {
					e = h({
						rel: "stylesheet",
						href: e,
						"data-precedence": t
					}, n), (n = mf.get(a)) && Rf(e, n);
					var c = o = r.createElement("link");
					F(c), Pd(c, "link", e), c._p = new Promise(function(e, t) {
						c.onload = e, c.onerror = t;
					}), c.addEventListener("load", function() {
						s.loading |= 1;
					}), c.addEventListener("error", function() {
						s.loading |= 2;
					}), s.loading |= 4, Lf(o, t, r);
				}
				o = {
					type: "stylesheet",
					instance: o,
					count: 1,
					state: s
				}, i.set(a, o);
			}
		}
	}
	function Df(e, t) {
		_f.X(e, t);
		var n = bf;
		if (n && e) {
			var r = St(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), F(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function Of(e, t) {
		_f.M(e, t);
		var n = bf;
		if (n && e) {
			var r = St(n).hoistableScripts, i = Pf(e), a = r.get(i);
			a || (a = n.querySelector(Ff(i)), a || (e = h({
				src: e,
				async: !0,
				type: "module"
			}, t), (t = mf.get(i)) && zf(e, t), a = n.createElement("script"), F(a), Pd(a, "link", e), n.head.appendChild(a)), a = {
				type: "script",
				instance: a,
				count: 1,
				state: null
			}, r.set(i, a));
		}
	}
	function kf(e, t, n, r) {
		var i = (i = ge.current) ? gf(i) : null;
		if (!i) throw Error(s(446));
		switch (e) {
			case "meta":
			case "title": return null;
			case "style": return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Af(n.href), n = St(i).hoistableStyles, r = n.get(t), r || (r = {
				type: "style",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					e = Af(n.href);
					var a = St(i).hoistableStyles, o = a.get(e);
					if (o || (i = i.ownerDocument || i, o = {
						type: "stylesheet",
						instance: null,
						count: 0,
						state: {
							loading: 0,
							preload: null
						}
					}, a.set(e, o), (a = i.querySelector(jf(e))) && !a._p && (o.instance = a, o.state.loading = 5), mf.has(e) || (n = {
						rel: "preload",
						as: "style",
						href: n.href,
						crossOrigin: n.crossOrigin,
						integrity: n.integrity,
						media: n.media,
						hrefLang: n.hrefLang,
						referrerPolicy: n.referrerPolicy
					}, mf.set(e, n), a || Nf(i, e, n, o.state))), t && r === null) throw Error(s(528, ""));
					return o;
				}
				if (t && r !== null) throw Error(s(529, ""));
				return null;
			case "script": return t = n.async, n = n.src, typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Pf(n), n = St(i).hoistableScripts, r = n.get(t), r || (r = {
				type: "script",
				instance: null,
				count: 0,
				state: null
			}, n.set(t, r)), r) : {
				type: "void",
				instance: null,
				count: 0,
				state: null
			};
			default: throw Error(s(444, e));
		}
	}
	function Af(e) {
		return "href=\"" + Vt(e) + "\"";
	}
	function jf(e) {
		return "link[rel=\"stylesheet\"][" + e + "]";
	}
	function Mf(e) {
		return h({}, e, {
			"data-precedence": e.precedence,
			precedence: null
		});
	}
	function Nf(e, t, n, r) {
		e.querySelector("link[rel=\"preload\"][as=\"style\"][" + t + "]") ? r.loading = 1 : (t = e.createElement("link"), r.preload = t, t.addEventListener("load", function() {
			return r.loading |= 1;
		}), t.addEventListener("error", function() {
			return r.loading |= 2;
		}), Pd(t, "link", n), F(t), e.head.appendChild(t));
	}
	function Pf(e) {
		return "[src=\"" + Vt(e) + "\"]";
	}
	function Ff(e) {
		return "script[async]" + e;
	}
	function If(e, t, n) {
		if (t.count++, t.instance === null) switch (t.type) {
			case "style":
				var r = e.querySelector("style[data-href~=\"" + Vt(n.href) + "\"]");
				if (r) return t.instance = r, F(r), r;
				var i = h({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return r = (e.ownerDocument || e).createElement("style"), F(r), Pd(r, "style", i), Lf(r, n.precedence, e), t.instance = r;
			case "stylesheet":
				i = Af(n.href);
				var a = e.querySelector(jf(i));
				if (a) return t.state.loading |= 4, t.instance = a, F(a), a;
				r = Mf(n), (i = mf.get(i)) && Rf(r, i), a = (e.ownerDocument || e).createElement("link"), F(a);
				var o = a;
				return o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), Pd(a, "link", r), t.state.loading |= 4, Lf(a, n.precedence, e), t.instance = a;
			case "script": return a = Pf(n.src), (i = e.querySelector(Ff(a))) ? (t.instance = i, F(i), i) : (r = n, (i = mf.get(a)) && (r = h({}, n), zf(r, i)), e = e.ownerDocument || e, i = e.createElement("script"), F(i), Pd(i, "link", r), e.head.appendChild(i), t.instance = i);
			case "void": return null;
			default: throw Error(s(443, t.type));
		}
		else t.type === "stylesheet" && !(t.state.loading & 4) && (r = t.instance, t.state.loading |= 4, Lf(r, n.precedence, e));
		return t.instance;
	}
	function Lf(e, t, n) {
		for (var r = n.querySelectorAll("link[rel=\"stylesheet\"][data-precedence],style[data-precedence]"), i = r.length ? r[r.length - 1] : null, a = i, o = 0; o < r.length; o++) {
			var s = r[o];
			if (s.dataset.precedence === t) a = s;
			else if (a !== i) break;
		}
		a ? a.parentNode.insertBefore(e, a.nextSibling) : (t = n.nodeType === 9 ? n.head : n, t.insertBefore(e, t.firstChild));
	}
	function Rf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.title ??= t.title;
	}
	function zf(e, t) {
		e.crossOrigin ??= t.crossOrigin, e.referrerPolicy ??= t.referrerPolicy, e.integrity ??= t.integrity;
	}
	var Bf = null;
	function Vf(e, t, n) {
		if (Bf === null) {
			var r = /* @__PURE__ */ new Map(), i = Bf = /* @__PURE__ */ new Map();
			i.set(n, r);
		} else i = Bf, r = i.get(n), r || (r = /* @__PURE__ */ new Map(), i.set(n, r));
		if (r.has(e)) return r;
		for (r.set(e, null), n = n.getElementsByTagName(e), i = 0; i < n.length; i++) {
			var a = n[i];
			if (!(a[_t] || a[ut] || e === "link" && a.getAttribute("rel") === "stylesheet") && a.namespaceURI !== "http://www.w3.org/2000/svg") {
				var o = a.getAttribute(t) || "";
				o = e + o;
				var s = r.get(o);
				s ? s.push(a) : r.set(o, [a]);
			}
		}
		return r;
	}
	function Hf(e, t, n) {
		e = e.ownerDocument || e, e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null);
	}
	function Uf(e, t, n) {
		if (n === 1 || t.itemProp != null) return !1;
		switch (e) {
			case "meta":
			case "title": return !0;
			case "style":
				if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "") break;
				return !0;
			case "link":
				if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError) break;
				switch (t.rel) {
					case "stylesheet": return e = t.disabled, typeof t.precedence == "string" && e == null;
					default: return !0;
				}
			case "script": if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string") return !0;
		}
		return !1;
	}
	function Wf(e) {
		return !(e.type === "stylesheet" && !(e.state.loading & 3));
	}
	function Gf(e, t, n, r) {
		if (n.type === "stylesheet" && (typeof r.media != "string" || !1 !== matchMedia(r.media).matches) && !(n.state.loading & 4)) {
			if (n.instance === null) {
				var i = Af(r.href), a = t.querySelector(jf(i));
				if (a) {
					t = a._p, typeof t == "object" && t && typeof t.then == "function" && (e.count++, e = Jf.bind(e), t.then(e, e)), n.state.loading |= 4, n.instance = a, F(a);
					return;
				}
				a = t.ownerDocument || t, r = Mf(r), (i = mf.get(i)) && Rf(r, i), a = a.createElement("link"), F(a);
				var o = a;
				o._p = new Promise(function(e, t) {
					o.onload = e, o.onerror = t;
				}), Pd(a, "link", r), n.instance = a;
			}
			e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(n, t), (t = n.state.preload) && !(n.state.loading & 3) && (e.count++, n = Jf.bind(e), t.addEventListener("load", n), t.addEventListener("error", n));
		}
	}
	var Kf = 0;
	function qf(e, t) {
		return e.stylesheets && e.count === 0 && Xf(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(n) {
			var r = setTimeout(function() {
				if (e.stylesheets && Xf(e, e.stylesheets), e.unsuspend) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, 6e4 + t);
			0 < e.imgBytes && Kf === 0 && (Kf = 62500 * Ld());
			var i = setTimeout(function() {
				if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Xf(e, e.stylesheets), e.unsuspend)) {
					var t = e.unsuspend;
					e.unsuspend = null, t();
				}
			}, (e.imgBytes > Kf ? 50 : 800) + t);
			return e.unsuspend = n, function() {
				e.unsuspend = null, clearTimeout(r), clearTimeout(i);
			};
		} : null;
	}
	function Jf() {
		if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
			if (this.stylesheets) Xf(this, this.stylesheets);
			else if (this.unsuspend) {
				var e = this.unsuspend;
				this.unsuspend = null, e();
			}
		}
	}
	var Yf = null;
	function Xf(e, t) {
		e.stylesheets = null, e.unsuspend !== null && (e.count++, Yf = /* @__PURE__ */ new Map(), t.forEach(Zf, e), Yf = null, Jf.call(e));
	}
	function Zf(e, t) {
		if (!(t.state.loading & 4)) {
			var n = Yf.get(e);
			if (n) var r = n.get(null);
			else {
				n = /* @__PURE__ */ new Map(), Yf.set(e, n);
				for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), a = 0; a < i.length; a++) {
					var o = i[a];
					(o.nodeName === "LINK" || o.getAttribute("media") !== "not all") && (n.set(o.dataset.precedence, o), r = o);
				}
				r && n.set(null, r);
			}
			i = t.instance, o = i.getAttribute("data-precedence"), a = n.get(o) || r, a === r && n.set(null, i), n.set(o, i), this.count++, r = Jf.bind(this), i.addEventListener("load", r), i.addEventListener("error", r), a ? a.parentNode.insertBefore(i, a.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(i, e.firstChild)), t.state.loading |= 4;
		}
	}
	var Qf = {
		$$typeof: S,
		Provider: null,
		Consumer: null,
		_currentValue: le,
		_currentValue2: le,
		_threadCount: 0
	};
	function $f(e, t, n, r, i, a, o, s, c) {
		this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = $e(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = $e(0), this.hiddenUpdates = $e(null), this.identifierPrefix = r, this.onUncaughtError = i, this.onCaughtError = a, this.onRecoverableError = o, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = c, this.incompleteTransitions = /* @__PURE__ */ new Map();
	}
	function ep(e, t, n, r, i, a, o, s, c, l, u, d) {
		return e = new $f(e, t, n, o, c, l, u, d, s), t = 1, !0 === a && (t |= 24), a = di(3, null, null, t), e.current = a, a.stateNode = e, t = ua(), t.refCount++, e.pooledCache = t, t.refCount++, a.memoizedState = {
			element: r,
			isDehydrated: n,
			cache: t
		}, Ua(a), e;
	}
	function tp(e) {
		return e ? (e = li, e) : li;
	}
	function np(e, t, n, r, i, a) {
		i = tp(i), r.context === null ? r.context = i : r.pendingContext = i, r = Ga(t), r.payload = { element: n }, a = a === void 0 ? null : a, a !== null && (r.callback = a), n = Ka(e, r, t), n !== null && (hu(n, e, t), qa(n, e, t));
	}
	function rp(e, t) {
		if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
			var n = e.retryLane;
			e.retryLane = n !== 0 && n < t ? n : t;
		}
	}
	function ip(e, t) {
		rp(e, t), (e = e.alternate) && rp(e, t);
	}
	function ap(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = oi(e, 67108864);
			t !== null && hu(t, e, 67108864), ip(e, 67108864);
		}
	}
	function op(e) {
		if (e.tag === 13 || e.tag === 31) {
			var t = pu();
			t = at(t);
			var n = oi(e, t);
			n !== null && hu(n, e, t), ip(e, t);
		}
	}
	var sp = !0;
	function cp(e, t, n, r) {
		var i = D.T;
		D.T = null;
		var a = O.p;
		try {
			O.p = 2, up(e, t, n, r);
		} finally {
			O.p = a, D.T = i;
		}
	}
	function lp(e, t, n, r) {
		var i = D.T;
		D.T = null;
		var a = O.p;
		try {
			O.p = 8, up(e, t, n, r);
		} finally {
			O.p = a, D.T = i;
		}
	}
	function up(e, t, n, r) {
		if (sp) {
			var i = dp(r);
			if (i === null) wd(e, t, r, fp, n), Cp(e, r);
			else if (Tp(i, e, t, n, r)) r.stopPropagation();
			else if (Cp(e, r), t & 4 && -1 < Sp.indexOf(e)) {
				for (; i !== null;) {
					var a = bt(i);
					if (a !== null) switch (a.tag) {
						case 3:
							if (a = a.stateNode, a.current.memoizedState.isDehydrated) {
								var o = Je(a.pendingLanes);
								if (o !== 0) {
									var s = a;
									for (s.pendingLanes |= 2, s.entangledLanes |= 2; o;) {
										var c = 1 << 31 - He(o);
										s.entanglements[1] |= c, o &= ~c;
									}
									rd(a), !(G & 6) && (tu = Ne() + 500, id(0, !1));
								}
							}
							break;
						case 31:
						case 13: s = oi(a, 2), s !== null && hu(s, a, 2), bu(), ip(a, 2);
					}
					if (a = dp(r), a === null && wd(e, t, r, fp, n), a === i) break;
					i = a;
				}
				i !== null && r.stopPropagation();
			} else wd(e, t, r, null, n);
		}
	}
	function dp(e) {
		return e = an(e), pp(e);
	}
	var fp = null;
	function pp(e) {
		if (fp = null, e = yt(e), e !== null) {
			var t = l(e);
			if (t === null) e = null;
			else {
				var n = t.tag;
				if (n === 13) {
					if (e = u(t), e !== null) return e;
					e = null;
				} else if (n === 31) {
					if (e = d(t), e !== null) return e;
					e = null;
				} else if (n === 3) {
					if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
					e = null;
				} else t !== e && (e = null);
			}
		}
		return fp = e, null;
	}
	function mp(e) {
		switch (e) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "resize":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart": return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave": return 8;
			case "message": switch (Pe()) {
				case Fe: return 2;
				case j: return 8;
				case M:
				case N: return 32;
				case Ie: return 268435456;
				default: return 32;
			}
			default: return 32;
		}
	}
	var hp = !1, gp = null, _p = null, vp = null, yp = /* @__PURE__ */ new Map(), bp = /* @__PURE__ */ new Map(), xp = [], Sp = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
	function Cp(e, t) {
		switch (e) {
			case "focusin":
			case "focusout":
				gp = null;
				break;
			case "dragenter":
			case "dragleave":
				_p = null;
				break;
			case "mouseover":
			case "mouseout":
				vp = null;
				break;
			case "pointerover":
			case "pointerout":
				yp.delete(t.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture": bp.delete(t.pointerId);
		}
	}
	function wp(e, t, n, r, i, a) {
		return e === null || e.nativeEvent !== a ? (e = {
			blockedOn: t,
			domEventName: n,
			eventSystemFlags: r,
			nativeEvent: a,
			targetContainers: [i]
		}, t !== null && (t = bt(t), t !== null && ap(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, i !== null && t.indexOf(i) === -1 && t.push(i), e);
	}
	function Tp(e, t, n, r, i) {
		switch (t) {
			case "focusin": return gp = wp(gp, e, t, n, r, i), !0;
			case "dragenter": return _p = wp(_p, e, t, n, r, i), !0;
			case "mouseover": return vp = wp(vp, e, t, n, r, i), !0;
			case "pointerover":
				var a = i.pointerId;
				return yp.set(a, wp(yp.get(a) || null, e, t, n, r, i)), !0;
			case "gotpointercapture": return a = i.pointerId, bp.set(a, wp(bp.get(a) || null, e, t, n, r, i)), !0;
		}
		return !1;
	}
	function Ep(e) {
		var t = yt(e.target);
		if (t !== null) {
			var n = l(t);
			if (n !== null) {
				if (t = n.tag, t === 13) {
					if (t = u(n), t !== null) {
						e.blockedOn = t, ct(e.priority, function() {
							op(n);
						});
						return;
					}
				} else if (t === 31) {
					if (t = d(n), t !== null) {
						e.blockedOn = t, ct(e.priority, function() {
							op(n);
						});
						return;
					}
				} else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return;
				}
			}
		}
		e.blockedOn = null;
	}
	function Dp(e) {
		if (e.blockedOn !== null) return !1;
		for (var t = e.targetContainers; 0 < t.length;) {
			var n = dp(e.nativeEvent);
			if (n === null) {
				n = e.nativeEvent;
				var r = new n.constructor(n.type, n);
				rn = r, n.target.dispatchEvent(r), rn = null;
			} else return t = bt(n), t !== null && ap(t), e.blockedOn = n, !1;
			t.shift();
		}
		return !0;
	}
	function Op(e, t, n) {
		Dp(e) && n.delete(t);
	}
	function kp() {
		hp = !1, gp !== null && Dp(gp) && (gp = null), _p !== null && Dp(_p) && (_p = null), vp !== null && Dp(vp) && (vp = null), yp.forEach(Op), bp.forEach(Op);
	}
	function Ap(e, n) {
		e.blockedOn === n && (e.blockedOn = null, hp || (hp = !0, t.unstable_scheduleCallback(t.unstable_NormalPriority, kp)));
	}
	var jp = null;
	function Mp(e) {
		jp !== e && (jp = e, t.unstable_scheduleCallback(t.unstable_NormalPriority, function() {
			jp === e && (jp = null);
			for (var t = 0; t < e.length; t += 3) {
				var n = e[t], r = e[t + 1], i = e[t + 2];
				if (typeof r != "function") {
					if (pp(r || n) === null) continue;
					break;
				}
				var a = bt(n);
				a !== null && (e.splice(t, 3), t -= 3, Ts(a, {
					pending: !0,
					data: i,
					method: n.method,
					action: r
				}, r, i));
			}
		}));
	}
	function Np(e) {
		function t(t) {
			return Ap(t, e);
		}
		gp !== null && Ap(gp, e), _p !== null && Ap(_p, e), vp !== null && Ap(vp, e), yp.forEach(t), bp.forEach(t);
		for (var n = 0; n < xp.length; n++) {
			var r = xp[n];
			r.blockedOn === e && (r.blockedOn = null);
		}
		for (; 0 < xp.length && (n = xp[0], n.blockedOn === null);) Ep(n), n.blockedOn === null && xp.shift();
		if (n = (e.ownerDocument || e).$$reactFormReplay, n != null) for (r = 0; r < n.length; r += 3) {
			var i = n[r], a = n[r + 1], o = i[dt] || null;
			if (typeof a == "function") o || Mp(n);
			else if (o) {
				var s = null;
				if (a && a.hasAttribute("formAction")) {
					if (i = a, o = a[dt] || null) s = o.formAction;
					else if (pp(i) !== null) continue;
				} else s = o.action;
				typeof s == "function" ? n[r + 1] = s : (n.splice(r, 3), r -= 3), Mp(n);
			}
		}
	}
	function Pp() {
		function e(e) {
			e.canIntercept && e.info === "react-transition" && e.intercept({
				handler: function() {
					return new Promise(function(e) {
						return i = e;
					});
				},
				focusReset: "manual",
				scroll: "manual"
			});
		}
		function t() {
			i !== null && (i(), i = null), r || setTimeout(n, 20);
		}
		function n() {
			if (!r && !navigation.transition) {
				var e = navigation.currentEntry;
				e && e.url != null && navigation.navigate(e.url, {
					state: e.getState(),
					info: "react-transition",
					history: "replace"
				});
			}
		}
		if (typeof navigation == "object") {
			var r = !1, i = null;
			return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(n, 100), function() {
				r = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), i !== null && (i(), i = null);
			};
		}
	}
	function Fp(e) {
		this._internalRoot = e;
	}
	Ip.prototype.render = Fp.prototype.render = function(e) {
		var t = this._internalRoot;
		if (t === null) throw Error(s(409));
		var n = t.current;
		np(n, pu(), e, t, null, null);
	}, Ip.prototype.unmount = Fp.prototype.unmount = function() {
		var e = this._internalRoot;
		if (e !== null) {
			this._internalRoot = null;
			var t = e.containerInfo;
			np(e.current, 2, null, e, null, null), bu(), t[ft] = null;
		}
	};
	function Ip(e) {
		this._internalRoot = e;
	}
	Ip.prototype.unstable_scheduleHydration = function(e) {
		if (e) {
			var t = st();
			e = {
				blockedOn: null,
				target: e,
				priority: t
			};
			for (var n = 0; n < xp.length && t !== 0 && t < xp[n].priority; n++);
			xp.splice(n, 0, e), n === 0 && Ep(e);
		}
	};
	var Lp = r.version;
	if (Lp !== "19.2.7") throw Error(s(527, Lp, "19.2.7"));
	O.findDOMNode = function(e) {
		var t = e._reactInternals;
		if (t === void 0) throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
		return e = p(t), e = e === null ? null : m(e), e = e === null ? null : e.stateNode, e;
	};
	var Rp = {
		bundleType: 0,
		version: "19.2.7",
		rendererPackageName: "react-dom",
		currentDispatcherRef: D,
		reconcilerVersion: "19.2.7"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var zp = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!zp.isDisabled && zp.supportsFiber) try {
			ze = zp.inject(Rp), Be = zp;
		} catch {}
	}
	e.createRoot = function(e, t) {
		if (!c(e)) throw Error(s(299));
		var n = !1, r = "", i = Js, a = Ys, o = Xs;
		return t != null && (!0 === t.unstable_strictMode && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onUncaughtError !== void 0 && (i = t.onUncaughtError), t.onCaughtError !== void 0 && (a = t.onCaughtError), t.onRecoverableError !== void 0 && (o = t.onRecoverableError)), t = ep(e, 1, !1, null, null, n, r, null, i, a, o, Pp), e[ft] = t.current, Sd(e), new Fp(t);
	};
})), c = /* @__PURE__ */ e(((e, t) => {
	function n() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
		} catch (e) {
			console.error(e);
		}
	}
	n(), t.exports = s();
})), l = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), u = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), d = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), f = (e) => {
	let t = d(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, p = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round"
}, m = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, h = i(), g = (0, h.createContext)({}), _ = () => (0, h.useContext)(g), v = (0, h.forwardRef)(({ color: e, size: t, strokeWidth: n, absoluteStrokeWidth: r, className: i = "", children: a, iconNode: o, ...s }, c) => {
	let { size: u = 24, strokeWidth: d = 2, absoluteStrokeWidth: f = !1, color: g = "currentColor", className: v = "" } = _() ?? {}, y = r ?? f ? Number(n ?? d) * 24 / Number(t ?? u) : n ?? d;
	return (0, h.createElement)("svg", {
		ref: c,
		...p,
		width: t ?? u ?? p.width,
		height: t ?? u ?? p.height,
		stroke: e ?? g,
		strokeWidth: y,
		className: l("lucide", v, i),
		...!a && !m(s) && { "aria-hidden": "true" },
		...s
	}, [...o.map(([e, t]) => (0, h.createElement)(e, t)), ...Array.isArray(a) ? a : [a]]);
}), y = (e, t) => {
	let n = (0, h.forwardRef)(({ className: n, ...r }, i) => (0, h.createElement)(v, {
		ref: i,
		iconNode: t,
		className: l(`lucide-${u(f(e))}`, `lucide-${e}`, n),
		...r
	}));
	return n.displayName = f(e), n;
}, b = y("activity", [["path", {
	d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
	key: "169zse"
}]]), x = y("apple", [["path", {
	d: "M12 6.528V3a1 1 0 0 1 1-1h0",
	key: "11qiee"
}], ["path", {
	d: "M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21",
	key: "110c12"
}]]), ee = y("audio-lines", [
	["path", {
		d: "M2 10v3",
		key: "1fnikh"
	}],
	["path", {
		d: "M6 6v11",
		key: "11sgs0"
	}],
	["path", {
		d: "M10 3v18",
		key: "yhl04a"
	}],
	["path", {
		d: "M14 8v7",
		key: "3a1oy3"
	}],
	["path", {
		d: "M18 5v13",
		key: "123xd1"
	}],
	["path", {
		d: "M22 10v3",
		key: "154ddg"
	}]
]), S = y("bell-ring", [
	["path", {
		d: "M10.268 21a2 2 0 0 0 3.464 0",
		key: "vwvbt9"
	}],
	["path", {
		d: "M22 8c0-2.3-.8-4.3-2-6",
		key: "5bb3ad"
	}],
	["path", {
		d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
		key: "11g9vi"
	}],
	["path", {
		d: "M4 2C2.8 3.7 2 5.7 2 8",
		key: "tap9e0"
	}]
]), C = y("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), te = y("circle-gauge", [
	["path", {
		d: "M15.6 2.7a10 10 0 1 0 5.7 5.7",
		key: "1e0p6d"
	}],
	["circle", {
		cx: "12",
		cy: "12",
		r: "2",
		key: "1c9p78"
	}],
	["path", {
		d: "M13.4 10.6 19 5",
		key: "1kr7tw"
	}]
]), w = y("cloud-sun", [
	["path", {
		d: "M12 2v2",
		key: "tus03m"
	}],
	["path", {
		d: "m4.93 4.93 1.41 1.41",
		key: "149t6j"
	}],
	["path", {
		d: "M20 12h2",
		key: "1q8mjw"
	}],
	["path", {
		d: "m19.07 4.93-1.41 1.41",
		key: "1shlcs"
	}],
	["path", {
		d: "M15.947 12.65a4 4 0 0 0-5.925-4.128",
		key: "dpwdj0"
	}],
	["path", {
		d: "M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z",
		key: "s09mg5"
	}]
]), ne = y("gamepad-2", [
	["line", {
		x1: "6",
		x2: "10",
		y1: "11",
		y2: "11",
		key: "1gktln"
	}],
	["line", {
		x1: "8",
		x2: "8",
		y1: "9",
		y2: "13",
		key: "qnk9ow"
	}],
	["line", {
		x1: "15",
		x2: "15.01",
		y1: "12",
		y2: "12",
		key: "krot7o"
	}],
	["line", {
		x1: "18",
		x2: "18.01",
		y1: "10",
		y2: "10",
		key: "1lcuu1"
	}],
	["path", {
		d: "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",
		key: "mfqc10"
	}]
]), T = y("headphones", [["path", {
	d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",
	key: "1xhozi"
}]]), re = y("heart", [["path", {
	d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
	key: "mvr1a0"
}]]), ie = y("house", [["path", {
	d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
	key: "5wwlr5"
}], ["path", {
	d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
	key: "r6nss1"
}]]), E = y("info", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M12 16v-4",
		key: "1dtifu"
	}],
	["path", {
		d: "M12 8h.01",
		key: "e9boi3"
	}]
]), ae = y("layout-dashboard", [
	["rect", {
		width: "7",
		height: "9",
		x: "3",
		y: "3",
		rx: "1",
		key: "10lvy0"
	}],
	["rect", {
		width: "7",
		height: "5",
		x: "14",
		y: "3",
		rx: "1",
		key: "16une8"
	}],
	["rect", {
		width: "7",
		height: "9",
		x: "14",
		y: "12",
		rx: "1",
		key: "1hutg5"
	}],
	["rect", {
		width: "7",
		height: "5",
		x: "3",
		y: "16",
		rx: "1",
		key: "ldoo1y"
	}]
]), oe = y("lightbulb", [
	["path", {
		d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
		key: "1gvzjb"
	}],
	["path", {
		d: "M9 18h6",
		key: "x1upvd"
	}],
	["path", {
		d: "M10 22h4",
		key: "ceow96"
	}]
]), se = y("list-music", [
	["path", {
		d: "M16 5H3",
		key: "m91uny"
	}],
	["path", {
		d: "M11 12H3",
		key: "51ecnj"
	}],
	["path", {
		d: "M11 19H3",
		key: "zflm78"
	}],
	["path", {
		d: "M21 16V5",
		key: "yxg4q8"
	}],
	["circle", {
		cx: "18",
		cy: "16",
		r: "3",
		key: "1hluhg"
	}]
]), ce = y("lock-keyhole", [
	["circle", {
		cx: "12",
		cy: "16",
		r: "1",
		key: "1au0dj"
	}],
	["rect", {
		x: "3",
		y: "10",
		width: "18",
		height: "12",
		rx: "2",
		key: "6s8ecr"
	}],
	["path", {
		d: "M7 10V7a5 5 0 0 1 10 0v3",
		key: "1pqi11"
	}]
]), D = y("menu", [
	["path", {
		d: "M4 5h16",
		key: "1tepv9"
	}],
	["path", {
		d: "M4 12h16",
		key: "1lakjw"
	}],
	["path", {
		d: "M4 19h16",
		key: "1djgab"
	}]
]), O = y("monitor", [
	["rect", {
		width: "20",
		height: "14",
		x: "2",
		y: "3",
		rx: "2",
		key: "48i651"
	}],
	["line", {
		x1: "8",
		x2: "16",
		y1: "21",
		y2: "21",
		key: "1svkeh"
	}],
	["line", {
		x1: "12",
		x2: "12",
		y1: "17",
		y2: "21",
		key: "vw1qmm"
	}]
]), le = y("moon", [["path", {
	d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
	key: "kfwtm"
}]]), ue = y("music-2", [["circle", {
	cx: "8",
	cy: "18",
	r: "4",
	key: "1fc0mg"
}], ["path", {
	d: "M12 18V2l7 4",
	key: "g04rme"
}]]), de = y("pause", [["rect", {
	x: "14",
	y: "3",
	width: "5",
	height: "18",
	rx: "1",
	key: "kaeet6"
}], ["rect", {
	x: "5",
	y: "3",
	width: "5",
	height: "18",
	rx: "1",
	key: "1wsw3u"
}]]), fe = y("play", [["path", {
	d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
	key: "10ikf1"
}]]), pe = y("radio", [
	["path", {
		d: "M16.247 7.761a6 6 0 0 1 0 8.478",
		key: "1fwjs5"
	}],
	["path", {
		d: "M19.075 4.933a10 10 0 0 1 0 14.134",
		key: "ehdyv1"
	}],
	["path", {
		d: "M4.925 19.067a10 10 0 0 1 0-14.134",
		key: "1q22gi"
	}],
	["path", {
		d: "M7.753 16.239a6 6 0 0 1 0-8.478",
		key: "r2q7qm"
	}],
	["circle", {
		cx: "12",
		cy: "12",
		r: "2",
		key: "1c9p78"
	}]
]), k = y("refresh-cw", [
	["path", {
		d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
		key: "v9h5vc"
	}],
	["path", {
		d: "M21 3v5h-5",
		key: "1q7to0"
	}],
	["path", {
		d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
		key: "3uifl3"
	}],
	["path", {
		d: "M8 16H3v5",
		key: "1cv678"
	}]
]), me = y("save", [
	["path", {
		d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
		key: "1c8476"
	}],
	["path", {
		d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
		key: "1ydtos"
	}],
	["path", {
		d: "M7 3v4a1 1 0 0 0 1 1h7",
		key: "t51u73"
	}]
]), he = y("search", [["path", {
	d: "m21 21-4.34-4.34",
	key: "14j7rj"
}], ["circle", {
	cx: "11",
	cy: "11",
	r: "8",
	key: "4ej97u"
}]]), ge = y("settings-2", [
	["path", {
		d: "M14 17H5",
		key: "gfn3mx"
	}],
	["path", {
		d: "M19 7h-9",
		key: "6i9tg"
	}],
	["circle", {
		cx: "17",
		cy: "17",
		r: "3",
		key: "18b49y"
	}],
	["circle", {
		cx: "7",
		cy: "7",
		r: "3",
		key: "dfmy0x"
	}]
]), _e = y("shield-check", [["path", {
	d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
	key: "oel41y"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]), ve = y("sliders-horizontal", [
	["path", {
		d: "M10 5H3",
		key: "1qgfaw"
	}],
	["path", {
		d: "M12 19H3",
		key: "yhmn1j"
	}],
	["path", {
		d: "M14 3v4",
		key: "1sua03"
	}],
	["path", {
		d: "M16 17v4",
		key: "1q0r14"
	}],
	["path", {
		d: "M21 12h-9",
		key: "1o4lsq"
	}],
	["path", {
		d: "M21 19h-5",
		key: "1rlt1p"
	}],
	["path", {
		d: "M21 5h-7",
		key: "1oszz2"
	}],
	["path", {
		d: "M8 10v4",
		key: "tgpxqk"
	}],
	["path", {
		d: "M8 12H3",
		key: "a7s4jb"
	}]
]), ye = y("sparkles", [
	["path", {
		d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
		key: "1s2grr"
	}],
	["path", {
		d: "M20 2v4",
		key: "1rf3ol"
	}],
	["path", {
		d: "M22 4h-4",
		key: "gwowj6"
	}],
	["circle", {
		cx: "4",
		cy: "20",
		r: "2",
		key: "6kqj1y"
	}]
]), be = y("speaker", [
	["rect", {
		width: "16",
		height: "20",
		x: "4",
		y: "2",
		rx: "2",
		key: "1nb95v"
	}],
	["path", {
		d: "M12 6h.01",
		key: "1vi96p"
	}],
	["circle", {
		cx: "12",
		cy: "14",
		r: "4",
		key: "1jruaj"
	}],
	["path", {
		d: "M12 14h.01",
		key: "1etili"
	}]
]), xe = y("sun-medium", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "4",
		key: "4exip2"
	}],
	["path", {
		d: "M12 3v1",
		key: "1asbbs"
	}],
	["path", {
		d: "M12 20v1",
		key: "1wcdkc"
	}],
	["path", {
		d: "M3 12h1",
		key: "lp3yf2"
	}],
	["path", {
		d: "M20 12h1",
		key: "1vloll"
	}],
	["path", {
		d: "m18.364 5.636-.707.707",
		key: "1hakh0"
	}],
	["path", {
		d: "m6.343 17.657-.707.707",
		key: "18m9nf"
	}],
	["path", {
		d: "m5.636 5.636.707.707",
		key: "1xv1c5"
	}],
	["path", {
		d: "m17.657 17.657.707.707",
		key: "vl76zb"
	}]
]), Se = y("triangle-alert", [
	["path", {
		d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
		key: "wmoenq"
	}],
	["path", {
		d: "M12 9v4",
		key: "juzpu7"
	}],
	["path", {
		d: "M12 17h.01",
		key: "p32p05"
	}]
]), Ce = y("tv", [["path", {
	d: "m17 2-5 5-5-5",
	key: "16satq"
}], ["rect", {
	width: "20",
	height: "15",
	x: "2",
	y: "7",
	rx: "2",
	key: "1e6viu"
}]]), we = y("volume-2", [
	["path", {
		d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
		key: "uqj9uw"
	}],
	["path", {
		d: "M16 9a5 5 0 0 1 0 6",
		key: "1q6k2b"
	}],
	["path", {
		d: "M19.364 18.364a9 9 0 0 0 0-12.728",
		key: "ijwkga"
	}]
]), Te = y("wand-sparkles", [
	["path", {
		d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
		key: "ul74o6"
	}],
	["path", {
		d: "m14 7 3 3",
		key: "1r5n42"
	}],
	["path", {
		d: "M5 6v4",
		key: "ilb8ba"
	}],
	["path", {
		d: "M19 14v4",
		key: "blhpug"
	}],
	["path", {
		d: "M10 2v2",
		key: "7u0qdc"
	}],
	["path", {
		d: "M7 8H3",
		key: "zfb6yr"
	}],
	["path", {
		d: "M21 16h-4",
		key: "1cnmox"
	}],
	["path", {
		d: "M11 3H9",
		key: "1obp7u"
	}]
]), Ee = y("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), De = c(), Oe = (e) => e == null || Number.isNaN(Number(e)) ? "—" : `${Math.round(Number(e) * 100)} %`, ke = (e) => e == null ? "—" : `${e > 0 ? "+" : e < 0 ? "−" : ""}${Math.abs(Math.round(e * 100))}`, Ae = (e) => e ? new Intl.DateTimeFormat("de-DE", {
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit"
}).format(new Date(e)) : "—", A = (e) => (e || "—").replaceAll("_", " ").replace(/\b\w/g, (e) => e.toUpperCase()), je = (e) => ({
	playing: "Spielt",
	paused: "Pausiert",
	on: "An",
	off: "Aus",
	idle: "Bereit",
	unavailable: "Nicht verfügbar"
})[e || ""] || A(e);
//#endregion
//#region frontend-src/src/artwork.ts
function Me(e, t) {
	let n = e.trim();
	if (!n) return {
		kind: "missing",
		reason: "missing"
	};
	let r = /^([a-z][a-z\d+.-]*):/i.exec(n)?.[1].toLowerCase();
	if (r === "data") return /^data:image\//i.test(n) ? {
		url: n,
		kind: "data_image"
	} : {
		kind: "data",
		reason: "unsupported_data_type"
	};
	if (r && r !== "http" && r !== "https") return {
		kind: "unsupported",
		reason: "unsupported_scheme"
	};
	try {
		if (n.includes("\\")) return {
			kind: "invalid",
			reason: "invalid_url"
		};
		let e = new URL(r || n.startsWith("/") ? n : `/${n}`, t);
		return e.username || e.password ? {
			kind: "invalid",
			reason: "credentials_in_url"
		} : e.protocol !== "http:" && e.protocol !== "https:" ? {
			kind: "unsupported",
			reason: "unsupported_scheme"
		} : {
			url: e.toString(),
			kind: r || n.startsWith("//") ? e.protocol.slice(0, -1) : "ha_relative"
		};
	} catch {
		return {
			kind: "invalid",
			reason: "invalid_url"
		};
	}
}
function Ne(e) {
	return [
		"music_assistant",
		"media_image_url",
		"entity_picture",
		"entity_picture_local",
		"title_classifier",
		"artwork_url"
	].includes(e || "") ? e : "candidate";
}
function Pe(e) {
	return Array.isArray(e) ? e.map(Pe) : !e || typeof e != "object" ? e : Object.fromEntries(Object.entries(e).map(([e, t]) => [
		"artwork_url",
		"media_image_url",
		"entity_picture",
		"entity_picture_local"
	].includes(e) ? [e, t && "[artwork URL omitted]"] : e === "artwork_candidates" && Array.isArray(t) ? [e, t.map((e) => ({
		source: Ne(e?.source),
		url: "[artwork URL omitted]"
	}))] : [e, Pe(t)]));
}
//#endregion
//#region node_modules/react/cjs/react-jsx-runtime.production.js
var Fe = /* @__PURE__ */ e(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), j = (/* @__PURE__ */ e(((e, t) => {
	t.exports = Fe();
})))(), M = {
	Activity: b,
	AlertTriangle: Se,
	Apple: x,
	AudioLines: ee,
	BellRing: S,
	ChevronRight: C,
	CircleGauge: te,
	CloudSun: w,
	Gamepad2: ne,
	Headphones: T,
	Heart: re,
	House: ie,
	Info: E,
	LayoutDashboard: ae,
	Lightbulb: oe,
	ListMusic: se,
	LockKeyhole: ce,
	Menu: D,
	Monitor: O,
	Moon: le,
	Music2: ue,
	Pause: de,
	Play: fe,
	Radio: pe,
	RefreshCw: k,
	Save: me,
	Search: he,
	Settings2: ge,
	ShieldCheck: _e,
	SlidersHorizontal: ve,
	Sparkles: ye,
	Speaker: be,
	SunMedium: xe,
	Tv: Ce,
	Volume2: we,
	WandSparkles: Te,
	X: Ee
};
function N({ children: e, className: t = "", title: n, action: r }) {
	return /* @__PURE__ */ (0, j.jsxs)("section", {
		className: `card ${t}`,
		children: [(n || r) && /* @__PURE__ */ (0, j.jsxs)("div", {
			className: "card-head",
			children: [n && /* @__PURE__ */ (0, j.jsx)("h2", { children: n }), r]
		}), e]
	});
}
function Ie({ icon: e = E, title: t, text: n, compact: r = !1 }) {
	return /* @__PURE__ */ (0, j.jsxs)("div", {
		className: `empty ${r ? "compact" : ""}`,
		children: [/* @__PURE__ */ (0, j.jsx)(e, { size: r ? 18 : 28 }), /* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("strong", { children: t }), /* @__PURE__ */ (0, j.jsx)("p", { children: n })] })]
	});
}
function Le({ health: e }) {
	return /* @__PURE__ */ (0, j.jsx)("span", {
		className: `status-dot ${e?.healthy ? "good" : e?.available ? "warn" : "bad"}`,
		title: e?.error || (e?.healthy ? "Healthy" : "Nicht verfügbar")
	});
}
var Re = {
	tv: Ce,
	apple_tv: x,
	ps5: ne,
	switch: ne,
	pc: O,
	homepods: be,
	denon: ee,
	subwoofer: we
}, ze = {
	tv: "TV",
	apple_tv: "Apple TV",
	ps5: "PlayStation 5",
	switch: "Nintendo Switch",
	pc: "PC",
	homepods: "HomePods",
	denon: "Denon AVR-X1400H",
	subwoofer: "Subwoofer"
};
function Be({ devices: e = {} }) {
	let t = Object.entries(e).filter(([, e]) => !e.ignored);
	return t.length ? /* @__PURE__ */ (0, j.jsx)("div", {
		className: "device-grid",
		children: t.map(([e, t]) => {
			let n = Re[e] || O;
			return /* @__PURE__ */ (0, j.jsxs)("div", {
				className: `device-tile ${t.active ? "active" : ""}`,
				children: [/* @__PURE__ */ (0, j.jsx)(n, { size: 22 }), /* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("span", { children: ze[e] || A(e) }), /* @__PURE__ */ (0, j.jsxs)("strong", { children: [je(t.state), t.volume == null ? "" : ` · ${Oe(t.volume)}`] })] })]
			}, e);
		})
	}) : /* @__PURE__ */ (0, j.jsx)(Ie, {
		compact: !0,
		title: "Keine Gerätedaten",
		text: "Media State liefert aktuell keine Geräte-Matrix."
	});
}
function Ve(e) {
	return /* @__PURE__ */ (0, j.jsx)(He, { ...e }, JSON.stringify([
		e.title,
		e.src,
		e.candidates
	]));
}
function He({ src: e, candidates: t = [], kind: n, title: r }) {
	let i = n === "music" ? ue : n === "gaming" ? ne : Ce, a = [...new Set([e, ...t.map((e) => e.url)].filter((e) => !!e))], [o, s] = (0, h.useState)(/* @__PURE__ */ new Set()), [c, l] = (0, h.useState)(), u = a.map((e) => ({
		source: Ne(t.find((t) => t.url === e)?.source || "artwork_url"),
		...Me(e, window.location.origin)
	})), d = u.find((e) => e.url && !o.has(e.url)), f = d ? c === d.url ? "ready" : "loading" : "unavailable", p = u.map((e) => `${e.source}: ${e.reason || (o.has(e.url) ? "load_failed" : e === d ? f : "pending")} (${e.kind})`).join("; ") || "missing";
	return /* @__PURE__ */ (0, j.jsx)("div", {
		className: `artwork ${n}`,
		"aria-label": r ? `Artwork für ${r}` : "Artwork nicht verfügbar",
		"data-artwork-source": d?.source || "none",
		"data-artwork-state": f,
		title: p,
		children: d?.url ? /* @__PURE__ */ (0, j.jsx)("img", {
			src: d.url,
			alt: "",
			referrerPolicy: "no-referrer",
			onLoad: () => l(d.url),
			onError: () => s((e) => new Set(e).add(d.url))
		}, d.url) : /* @__PURE__ */ (0, j.jsxs)(j.Fragment, { children: [/* @__PURE__ */ (0, j.jsx)(i, { size: 38 }), /* @__PURE__ */ (0, j.jsx)("span", { children: "Artwork nicht verfügbar" })] })
	});
}
function Ue({ kind: e, eyebrow: t, title: n, subtitle: r, detail: i, device: a, volume: o, artwork: s, artworkCandidates: c, badges: l, active: u = !0, controls: d }) {
	return /* @__PURE__ */ (0, j.jsxs)(N, {
		className: `media-card ${e} ${u ? "active" : ""}`,
		children: [/* @__PURE__ */ (0, j.jsxs)("div", {
			className: "media-card-main",
			children: [/* @__PURE__ */ (0, j.jsx)(Ve, {
				src: s,
				candidates: c,
				kind: e,
				title: n
			}), /* @__PURE__ */ (0, j.jsxs)("div", {
				className: "media-copy",
				children: [
					/* @__PURE__ */ (0, j.jsxs)("span", {
						className: "eyebrow",
						children: [e === "music" ? /* @__PURE__ */ (0, j.jsx)(ue, {}) : e === "gaming" ? /* @__PURE__ */ (0, j.jsx)(ne, {}) : /* @__PURE__ */ (0, j.jsx)(Ce, {}), t]
					}),
					/* @__PURE__ */ (0, j.jsx)("h3", { children: n }),
					r && /* @__PURE__ */ (0, j.jsx)("p", { children: r }),
					l && /* @__PURE__ */ (0, j.jsx)("div", {
						className: "effect-badges",
						children: l
					}),
					i && /* @__PURE__ */ (0, j.jsx)("span", {
						className: "session-detail",
						children: i
					})
				]
			})]
		}), (a || o != null || d) && /* @__PURE__ */ (0, j.jsxs)("div", {
			className: "output-row",
			children: [
				/* @__PURE__ */ (0, j.jsx)(be, { size: 19 }),
				/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("span", { children: a || "Ausgabegerät" }), /* @__PURE__ */ (0, j.jsx)("strong", { children: u ? "Aktiv" : "Bereit" })] }),
				/* @__PURE__ */ (0, j.jsx)("b", { children: Oe(o) }),
				d
			]
		})]
	});
}
var We = [
	["base", "Basis"],
	["scenario_offset", "Szenario / Grind"],
	["window_offset", "Fenster"],
	["activity_offset", "Activity"],
	["manual_nudge", "Nudge"],
	["track_boost", "Boost"],
	["cap_override", "Cap / Override"]
];
function Ge({ name: e, data: t, accent: n = "cyan" }) {
	if (!t) return /* @__PURE__ */ (0, j.jsx)(N, {
		title: e,
		children: /* @__PURE__ */ (0, j.jsx)(Ie, {
			compact: !0,
			title: "Keine Formeldaten",
			text: "Media Policy liefert für dieses Gerät noch keinen Breakdown."
		})
	});
	let r = We.filter(([e]) => t[e] != null).map(([e, n], r) => {
		let i = Number(t[e] || 0);
		return /* @__PURE__ */ (0, j.jsx)("span", {
			className: i < 0 ? "negative" : i > 0 && r ? "positive" : "",
			children: r === 0 ? `${Math.round(i * 100)} % ${n}` : `${Math.abs(Math.round(i * 100))} ${n}`
		}, e);
	});
	return /* @__PURE__ */ (0, j.jsxs)(N, {
		className: `volume-breakdown ${n}`,
		title: e,
		children: [
			/* @__PURE__ */ (0, j.jsxs)("div", {
				className: "formula-compact",
				children: [r, /* @__PURE__ */ (0, j.jsxs)("strong", { children: ["= ", Oe(t.result)] })]
			}),
			/* @__PURE__ */ (0, j.jsxs)("div", {
				className: "formula-grid",
				children: [
					We.map(([e, n]) => {
						let r = typeof t[e] == "number" ? t[e] : void 0;
						return /* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("span", { children: n }), /* @__PURE__ */ (0, j.jsx)("b", { children: e === "base" ? Oe(r) : ke(r) })] }, e);
					}),
					t.effective_max != null && /* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("span", { children: "Wirksame Obergrenze" }), /* @__PURE__ */ (0, j.jsx)("b", { children: new Intl.NumberFormat("de-DE", {
						style: "percent",
						maximumFractionDigits: 1
					}).format(t.effective_max) })] }),
					t.track_boost_effective != null && t.track_boost !== t.track_boost_effective && /* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("span", { children: "Wirksamer Boost" }), /* @__PURE__ */ (0, j.jsx)("b", { children: ke(t.track_boost_effective) })] })
				]
			}),
			/* @__PURE__ */ (0, j.jsx)("div", {
				className: "volume-meter",
				children: /* @__PURE__ */ (0, j.jsx)("i", { style: { width: `${Math.max(0, Math.min(100, Number(t.result || 0) * 100))}%` } })
			})
		]
	});
}
function Ke({ reasons: e = [], activeReasons: t = [], compact: n = !1 }) {
	let r = e.length ? e : t.map((e) => ({
		text: qe(e),
		severity: e.includes("unavailable") ? "warn" : "ok"
	}));
	return /* @__PURE__ */ (0, j.jsx)(N, {
		className: n ? "reason compact" : "reason",
		title: "Warum so?",
		children: r.length ? /* @__PURE__ */ (0, j.jsx)("div", {
			className: "reason-list",
			children: r.slice(0, n ? 5 : 10).map((e, t) => /* @__PURE__ */ (0, j.jsxs)("div", {
				className: `reason-item ${e.severity || "ok"}`,
				children: [e.severity === "warn" ? /* @__PURE__ */ (0, j.jsx)(Se, { size: 17 }) : t === 0 ? /* @__PURE__ */ (0, j.jsx)(ye, { size: 17 }) : /* @__PURE__ */ (0, j.jsx)(C, { size: 17 }), /* @__PURE__ */ (0, j.jsx)("span", { children: qe(e.text) })]
			}, `${e.text}-${t}`))
		}) : /* @__PURE__ */ (0, j.jsx)(Ie, {
			compact: !0,
			title: "Keine aktiven Gründe",
			text: "Die Decision Engine meldet derzeit keinen Why-Stack."
		})
	});
}
function qe(e) {
	let t = {
		"scenario:gaming": "Benni spielt gerade.",
		grind: "Grind-Modus ist aktiv.",
		"audio:homepods": "Musik läuft über die HomePods.",
		"window:tilted": "Fenster gekippt, Lautstärke reduziert.",
		audio_only_idle: "Musik läuft, ohne ein Bildschirm-Szenario zu aktivieren.",
		"private:manual:switch+pc": "Private Time wurde manuell aktiviert.",
		away_gate: "Niemand ist zuhause; Medien bleiben aus."
	};
	return t[e] ? t[e] : e.replaceAll("_", " ").replaceAll(":", " · ").replace(/\bps5\b/gi, "PlayStation 5").replace(/\bhomepods\b/gi, "HomePods").replace(/^./, (e) => e.toUpperCase());
}
function P({ children: e, tone: t = "neutral" }) {
	return /* @__PURE__ */ (0, j.jsx)("span", {
		className: `pill ${t}`,
		children: e
	});
}
var Je = {
	overview: {
		label: "Übersicht",
		sub: "Aktueller Medienstatus und Steuerung",
		icon: ae
	},
	music: {
		label: "Musik",
		sub: "Wiedergabe, Radios und Bibliothek",
		icon: ue
	},
	gaming: {
		label: "Gaming",
		sub: "Spiel, Modus und Audio-Routing",
		icon: ne
	},
	tv: {
		label: "TV & Streaming",
		sub: "Quelle, Geräte und aktuelle Entscheidung",
		icon: Ce
	},
	rules: {
		label: "Regeln",
		sub: "Persistierte Volume-Matrix und Sicherheitswerte",
		icon: ve
	},
	diagnostics: {
		label: "Diagnose",
		sub: "State, Policy, Apply, Bindings und Raw JSON",
		icon: ge
	}
};
function Ye({ active: e, onClick: t, icon: n, children: r, disabled: i, title: a }) {
	return /* @__PURE__ */ (0, j.jsxs)("button", {
		className: `button ${e ? "active" : ""}`,
		onClick: t,
		disabled: i,
		title: a,
		children: [n && /* @__PURE__ */ (0, j.jsx)(n, { size: 17 }), r]
	});
}
//#endregion
//#region frontend-src/src/AppShell.tsx
var Xe = [
	{
		label: "Klima",
		icon: M.CloudSun
	},
	{
		label: "Medien",
		icon: M.AudioLines,
		active: !0
	},
	{
		label: "Licht",
		icon: M.Lightbulb
	},
	{
		label: "Beschattung",
		icon: M.SunMedium
	},
	{
		label: "Sicherheit",
		icon: M.ShieldCheck
	},
	{
		label: "System",
		icon: M.Settings2
	}
];
function Ze({ page: e, onPage: t, children: n, updatedAt: r, modulesHealth: i = {}, onRefresh: a, refreshing: o }) {
	let [s, c] = (0, h.useState)(!1), l = Je[e];
	return /* @__PURE__ */ (0, j.jsxs)("div", {
		className: "app-shell",
		children: [
			/* @__PURE__ */ (0, j.jsxs)("header", {
				className: "topbar",
				children: [
					/* @__PURE__ */ (0, j.jsxs)("div", {
						className: "brand",
						children: [/* @__PURE__ */ (0, j.jsx)("div", {
							className: "brand-mark",
							children: /* @__PURE__ */ (0, j.jsx)(M.House, { size: 17 })
						}), /* @__PURE__ */ (0, j.jsx)("span", { children: "Benni Home" })]
					}),
					/* @__PURE__ */ (0, j.jsx)("nav", {
						className: "module-nav",
						"aria-label": "Module",
						children: Xe.map(({ label: e, icon: t, active: n }) => /* @__PURE__ */ (0, j.jsxs)("button", {
							className: n ? "active" : "",
							disabled: !n,
							title: n ? void 0 : `${e} folgt später`,
							children: [/* @__PURE__ */ (0, j.jsx)(t, { size: 19 }), /* @__PURE__ */ (0, j.jsx)("span", { children: e })]
						}, e))
					}),
					/* @__PURE__ */ (0, j.jsxs)("div", {
						className: "top-status",
						children: [
							/* @__PURE__ */ (0, j.jsx)(M.BellRing, { size: 19 }),
							/* @__PURE__ */ (0, j.jsx)("span", {
								className: "avatar",
								children: "B"
							}),
							/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("b", { children: "Benni" }), /* @__PURE__ */ (0, j.jsx)("small", { children: "zuhause" })] })
						]
					}),
					/* @__PURE__ */ (0, j.jsx)("button", {
						className: "mobile-menu",
						onClick: () => c(!s),
						"aria-label": "Navigation öffnen",
						children: /* @__PURE__ */ (0, j.jsx)(M.Menu, { size: 20 })
					})
				]
			}),
			/* @__PURE__ */ (0, j.jsxs)("aside", {
				className: `sidebar ${s ? "open" : ""}`,
				children: [
					/* @__PURE__ */ (0, j.jsxs)("div", {
						className: "sidebar-title",
						children: [/* @__PURE__ */ (0, j.jsx)("span", { children: "Medien" }), /* @__PURE__ */ (0, j.jsx)("button", {
							onClick: () => c(!1),
							children: /* @__PURE__ */ (0, j.jsx)(M.X, { size: 18 })
						})]
					}),
					/* @__PURE__ */ (0, j.jsx)("nav", {
						"aria-label": "Medien",
						children: Object.keys(Je).map((n) => {
							let r = Je[n], i = r.icon;
							return /* @__PURE__ */ (0, j.jsxs)("button", {
								className: n === e ? "active" : "",
								onClick: () => {
									t(n), c(!1);
								},
								children: [/* @__PURE__ */ (0, j.jsx)(i, { size: 19 }), /* @__PURE__ */ (0, j.jsx)("span", { children: r.label })]
							}, n);
						})
					}),
					/* @__PURE__ */ (0, j.jsxs)("div", {
						className: "sidebar-health",
						children: [/* @__PURE__ */ (0, j.jsx)("span", { children: "Stack-Status" }), [
							"state",
							"policy",
							"apply"
						].map((e) => /* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)(Le, { health: i[e] }), e] }, e))]
					})
				]
			}),
			s && /* @__PURE__ */ (0, j.jsx)("button", {
				className: "scrim",
				onClick: () => c(!1),
				"aria-label": "Navigation schließen"
			}),
			/* @__PURE__ */ (0, j.jsxs)("main", { children: [/* @__PURE__ */ (0, j.jsxs)("div", {
				className: "page-header",
				children: [/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("h1", { children: l.label }), /* @__PURE__ */ (0, j.jsx)("p", { children: l.sub })] }), /* @__PURE__ */ (0, j.jsxs)("div", {
					className: "page-meta",
					children: [/* @__PURE__ */ (0, j.jsxs)("span", { children: [
						"Letzte Aktualisierung",
						/* @__PURE__ */ (0, j.jsx)("br", {}),
						/* @__PURE__ */ (0, j.jsx)("b", { children: r ? new Intl.DateTimeFormat("de-DE", {
							dateStyle: "short",
							timeStyle: "medium"
						}).format(new Date(r)) : "—" })
					] }), /* @__PURE__ */ (0, j.jsx)("button", {
						onClick: a,
						disabled: o,
						"aria-label": "Aktualisieren",
						children: /* @__PURE__ */ (0, j.jsx)(M.RefreshCw, {
							className: o ? "spin" : "",
							size: 19
						})
					})]
				})]
			}), /* @__PURE__ */ (0, j.jsx)("div", {
				className: "page-content",
				children: n
			})] }),
			/* @__PURE__ */ (0, j.jsxs)("footer", { children: [
				/* @__PURE__ */ (0, j.jsx)("span", { children: "benni_media · React/Vite Cockpit" }),
				/* @__PURE__ */ (0, j.jsxs)("span", { children: [/* @__PURE__ */ (0, j.jsx)(Le, { health: i.policy }), " Media Stack"] }),
				/* @__PURE__ */ (0, j.jsx)("span", { children: "Umbrella UX" })
			] })
		]
	});
}
//#endregion
//#region frontend-src/src/api.ts
var Qe = {
	overview: "benni_media/get_overview",
	state: "benni_media/get_state",
	policy: "benni_media/get_policy",
	apply: "benni_media/get_apply",
	diagnostics: "benni_media/get_diagnostics",
	matrix: "benni_media_policy/get_matrix",
	setMatrix: "benni_media_policy/set_matrix",
	resetMatrix: "benni_media_policy/reset_matrix",
	setScalars: "benni_media_policy/set_scalars",
	applyStatus: "benni_media_apply/get_status",
	scheduleReapply: "benni_media_apply/schedule_reapply",
	applyReapplyNow: "benni_media_apply/apply_reapply_now",
	cancelReapply: "benni_media_apply/cancel_reapply",
	action: "benni_media/action"
};
async function $e(e) {
	let [t, n, r, i, a, o] = await Promise.allSettled([
		e.callWS({ type: Qe.overview }),
		e.callWS({ type: Qe.state }),
		e.callWS({ type: Qe.policy }),
		e.callWS({ type: Qe.apply }),
		e.callWS({ type: Qe.diagnostics }),
		e.callWS({ type: Qe.matrix })
	]), s = (e) => e.status === "fulfilled" ? e.value : void 0;
	return {
		overview: s(t),
		state: s(n),
		policy: s(r),
		apply: s(i),
		diagnostics: s(a),
		matrix: s(o)
	};
}
async function et(e, t, n, r = {}) {
	return e.callWS({
		type: Qe.action,
		module: t,
		action: n,
		params: r
	});
}
var tt = (e, t) => e.callWS({
	type: Qe.setMatrix,
	patch: t
}), nt = (e, t) => e.callWS({
	type: Qe.setScalars,
	patch: t
}), rt = (e) => e.callWS({ type: Qe.matrix }), it = (e) => e.callWS({ type: Qe.applyStatus }), at = (e, t = 30) => e.callWS({
	type: Qe.scheduleReapply,
	delay_s: t,
	reason: "rules_saved"
}), ot = (e) => e.callWS({ type: Qe.applyReapplyNow }), st = (e) => e.callWS({ type: Qe.cancelReapply });
//#endregion
//#region frontend-src/src/useCockpit.ts
function ct(e) {
	let [t, n] = (0, h.useState)({}), [r, i] = (0, h.useState)(!0), [a, o] = (0, h.useState)(null), s = (0, h.useRef)(!0), c = (0, h.useCallback)(async (t = !1) => {
		t || i(!0);
		try {
			let t = await $e(e);
			s.current && (n(t), o(null));
		} catch (e) {
			s.current && o(e instanceof Error ? e.message : String(e));
		} finally {
			s.current && !t && i(!1);
		}
	}, [e]);
	return (0, h.useEffect)(() => {
		s.current = !0;
		let e = window.setTimeout(() => void c(), 0), t = window.setInterval(() => void c(!0), 5e3);
		return () => {
			s.current = !1, window.clearTimeout(e), window.clearInterval(t);
		};
	}, [c]), {
		data: t,
		setData: n,
		loading: r,
		error: a,
		refresh: c
	};
}
//#endregion
//#region frontend-src/src/RadioShortcuts.tsx
var lt = [{
	key: "radiobrowser",
	label: "Radio Browser"
}, {
	key: "tunein",
	label: "TuneIn"
}];
function ut(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		if (!n || typeof n != "object") continue;
		let e = n;
		if (typeof e.key != "string" || !e.key.trim() || typeof e.name != "string" || !e.name.trim()) continue;
		let r = t.get(e.key) || {
			key: e.key,
			name: e.name.replace(/ \(TuneIn\)$/, ""),
			sources: {}
		};
		t.set(e.key, r), (e.provider === "radiobrowser" || e.provider === "tunein") && typeof e.uri == "string" && (e.provider === "radiobrowser" ? /^radiobrowser:\/\/radio\/[^\s]+$/.test(e.uri) : /^tunein(?:--[^\s:/]+)?:\/\/radio\/[^\s]+$/.test(e.uri)) && (r.sources[e.provider] = e.uri, e.playing === !0 && (r.playing = e.provider));
	}
	return [...t.values()];
}
function dt({ hass: e, onChanged: t }) {
	let [n, r] = (0, h.useState)([]), [i, a] = (0, h.useState)(!0), [o, s] = (0, h.useState)(!1), [c, l] = (0, h.useState)(!1), [u, d] = (0, h.useState)(), [f, p] = (0, h.useState)(0), m = (0, h.useRef)(!1);
	(0, h.useEffect)(() => {
		let t = !0;
		return et(e, "apply", "radio_shortcuts").then((e) => {
			if (e?.ok !== !0 || !Array.isArray(e.result?.results)) throw Error("Invalid shortcuts response");
			t && (r(ut(e.result.results)), s(!1), a(!1));
		}).catch(() => {
			t && (r([]), s(!0), a(!1));
		}), () => {
			t = !1;
		};
	}, [e, f]);
	let g = async (n) => {
		if (!m.current) {
			m.current = !0, d(n), l(!1);
			try {
				let r = await et(e, "apply", "play_radio", { media_id: n });
				if (r?.ok !== !0 || r.result?.ok === !1) throw Error("Radio command failed");
				t();
			} catch {
				l(!0);
			} finally {
				m.current = !1, d(void 0);
			}
		}
	};
	return /* @__PURE__ */ (0, j.jsxs)("div", {
		className: "radio-shortcuts",
		children: [
			i && /* @__PURE__ */ (0, j.jsx)("p", {
				role: "status",
				children: "Sender werden geladen …"
			}),
			o && /* @__PURE__ */ (0, j.jsxs)("div", {
				role: "alert",
				children: ["Sender konnten nicht geladen werden. ", /* @__PURE__ */ (0, j.jsx)("button", {
					onClick: () => {
						a(!0), s(!1), p(f + 1);
					},
					children: "Erneut laden"
				})]
			}),
			!i && !o && !n.length && /* @__PURE__ */ (0, j.jsx)("p", { children: "Keine Radiosender verfügbar." }),
			c && /* @__PURE__ */ (0, j.jsx)("p", {
				role: "alert",
				children: "Der Start ist fehlgeschlagen. Prüfe die Wiedergabediagnose oder wähle die andere Quelle."
			}),
			/* @__PURE__ */ (0, j.jsx)("div", {
				className: "radio-station-grid",
				children: n.map((e) => /* @__PURE__ */ (0, j.jsxs)("div", {
					className: "radio-station",
					role: "group",
					"aria-label": e.name,
					children: [/* @__PURE__ */ (0, j.jsxs)("b", { children: [/* @__PURE__ */ (0, j.jsx)(M.Radio, { size: 17 }), e.name] }), /* @__PURE__ */ (0, j.jsx)("div", {
						className: "radio-provider-buttons",
						children: lt.map((t) => {
							let n = e.sources[t.key];
							return /* @__PURE__ */ (0, j.jsxs)("button", {
								disabled: !n || !!u,
								onClick: () => n && void g(n),
								"aria-label": `${e.name}: ${t.label}`,
								title: n ? `Über ${t.label} abspielen` : `${t.label} nicht verfügbar`,
								children: [
									u === n && n ? "Start wird angefordert …" : t.label,
									e.playing === t.key && /* @__PURE__ */ (0, j.jsx)("small", { children: "Live" }),
									!n && /* @__PURE__ */ (0, j.jsx)("small", { children: "Nicht verfügbar" })
								]
							}, t.key);
						})
					})]
				}, e.key))
			})
		]
	});
}
//#endregion
//#region frontend-src/src/pages/OverviewPage.tsx
function ft({ data: e, hass: t, onChanged: n }) {
	let r = e?.raw?.state || {}, i = e?.raw?.policy || {}, a = e?.raw?.apply || {}, o = e?.devices || r.devices || {}, s = e?.now_playing || r.now_playing, c = r.context === "gaming" || e?.scenario === "gaming" || !!r.gaming_platform, l = o.ps5?.active ? o.ps5 : o.pc?.active ? o.pc : void 0, u = l?.title || "Aktive Gaming-Session", d = r.context || e?.scenario || "", f = ["tv", "streaming"].includes(d), p = o.tv, m = o.apple_tv, h = m?.app || m?.source || p?.source || r.subcontext, g = m?.title || p?.title || h || "TV aktiv", _ = r.classifiers?.homepods?.label === "boost" && !i.track_boost_applied, v = r.quiet_mode ? "Quiet Mode blockiert den Boost" : ["work_home", "work_away"].includes(String(r.activity_context || r.context_cards?.activity)) ? "Arbeitsmodus blockiert den Boost" : "Boost ist durch die aktuelle Regel gesperrt", y = async (e, r, i = {}) => {
		await et(t, e, r, i), n();
	};
	return /* @__PURE__ */ (0, j.jsxs)(j.Fragment, { children: [
		/* @__PURE__ */ (0, j.jsxs)("div", {
			className: "section-heading",
			children: [/* @__PURE__ */ (0, j.jsx)("h2", { children: "Aktive Medien" }), /* @__PURE__ */ (0, j.jsxs)(P, {
				tone: "green",
				children: [[
					!!s,
					c,
					f
				].filter(Boolean).length || 0, " aktiv"]
			})]
		}),
		/* @__PURE__ */ (0, j.jsxs)("div", {
			className: "overview-hero",
			children: [/* @__PURE__ */ (0, j.jsxs)("div", {
				className: "session-grid",
				children: [
					s ? /* @__PURE__ */ (0, j.jsx)(Ue, {
						kind: "music",
						eyebrow: "Musik",
						title: s.title || "Unbekannter Titel",
						subtitle: s.artist,
						detail: "Musik läuft über die HomePods",
						device: "HomePods",
						volume: s.volume ?? o.homepods?.volume,
						artwork: s.artwork_url,
						artworkCandidates: s.artwork_candidates || o.homepods?.artwork_candidates,
						badges: /* @__PURE__ */ (0, j.jsxs)(j.Fragment, { children: [
							i.track_boost_applied && /* @__PURE__ */ (0, j.jsx)(P, {
								tone: "pink",
								children: "Track-Boost aktiv"
							}),
							i.music_muted && /* @__PURE__ */ (0, j.jsx)(P, {
								tone: "orange",
								children: "Classifier-Mute"
							}),
							_ && /* @__PURE__ */ (0, j.jsx)(P, {
								tone: "orange",
								children: "Boost blockiert"
							})
						] }),
						controls: /* @__PURE__ */ (0, j.jsx)(Ye, {
							disabled: !0,
							title: "Play/Pause benötigt einen additiven Backend-Contract",
							icon: M.Pause,
							children: "Pause"
						})
					}) : /* @__PURE__ */ (0, j.jsx)(N, { children: /* @__PURE__ */ (0, j.jsx)(Ie, {
						icon: M.Music2,
						title: "Keine Musik-Session",
						text: "Sobald die HomePods spielen, erscheint die Session hier."
					}) }),
					c ? /* @__PURE__ */ (0, j.jsx)(Ue, {
						kind: "gaming",
						eyebrow: "Gaming",
						title: r.classifiers?.[r.gaming_platform || "ps5"]?.display_name || u,
						subtitle: A(r.gaming_platform || e?.gaming_platform || e?.gaming_source),
						detail: i.is_grind ? "Grind-Modus aktiv" : r.headset_active ? "Headset-Modus aktiv" : A(r.subcontext),
						device: o.denon?.active ? "Denon AVR-X1400H" : "Gaming-Audio",
						volume: i.volume_target_denon ?? e?.targets?.denon_volume,
						artwork: l?.artwork_url || r.classifiers?.[r.gaming_platform || "ps5"]?.artwork_url,
						artworkCandidates: l?.artwork_candidates,
						badges: /* @__PURE__ */ (0, j.jsxs)(j.Fragment, { children: [
							i.is_grind && /* @__PURE__ */ (0, j.jsx)(P, {
								tone: "pink",
								children: "Grind"
							}),
							r.headset_active && /* @__PURE__ */ (0, j.jsx)(P, {
								tone: "cyan",
								children: "Headset"
							}),
							r.private_time_active && /* @__PURE__ */ (0, j.jsx)(P, {
								tone: "violet",
								children: "Private Time"
							})
						] })
					}) : /* @__PURE__ */ (0, j.jsx)(N, { children: /* @__PURE__ */ (0, j.jsx)(Ie, {
						icon: M.Gamepad2,
						title: "Keine Gaming-Session",
						text: "PlayStation- oder PC-Gaming wird parallel zur Musik eingeblendet."
					}) }),
					f && /* @__PURE__ */ (0, j.jsx)(Ue, {
						kind: "tv",
						eyebrow: d === "streaming" ? "Streaming" : "TV",
						title: g,
						subtitle: h ? `Quelle · ${h}` : void 0,
						detail: i.audio_scenario_detail || A(r.subcontext),
						artwork: m?.artwork_url || p?.artwork_url,
						artworkCandidates: d === "streaming" ? m?.artwork_candidates : p?.artwork_candidates,
						device: "Denon AVR-X1400H",
						volume: i.volume_target_denon ?? e?.targets?.denon_volume
					})
				]
			}), /* @__PURE__ */ (0, j.jsx)(Ke, {
				compact: !0,
				reasons: i.reasons,
				activeReasons: e?.active_reasons || r.active_reasons
			})]
		}),
		(i.track_boost_applied || i.music_muted || i.is_grind || r.headset_active || r.private_time_active || _) && /* @__PURE__ */ (0, j.jsx)(N, {
			className: "effects-hero",
			title: "Aktive Sonderregeln",
			children: /* @__PURE__ */ (0, j.jsxs)("div", {
				className: "effect-badges",
				children: [
					i.track_boost_applied && /* @__PURE__ */ (0, j.jsx)(P, {
						tone: "pink",
						children: "Track-Boost aktiv"
					}),
					i.music_muted && /* @__PURE__ */ (0, j.jsx)(P, {
						tone: "orange",
						children: "HomePods stumm"
					}),
					i.is_grind && /* @__PURE__ */ (0, j.jsx)(P, {
						tone: "pink",
						children: "Grind-Modus"
					}),
					r.headset_active && /* @__PURE__ */ (0, j.jsx)(P, {
						tone: "cyan",
						children: "Headset-Modus"
					}),
					r.private_time_active && /* @__PURE__ */ (0, j.jsx)(P, {
						tone: "violet",
						children: "Private Time"
					}),
					_ && /* @__PURE__ */ (0, j.jsx)(P, {
						tone: "orange",
						children: v
					})
				]
			})
		}),
		/* @__PURE__ */ (0, j.jsxs)("div", {
			className: "dashboard-grid volumes",
			children: [/* @__PURE__ */ (0, j.jsx)(Ge, {
				name: "HomePods",
				data: i.volume_formula?.homepods,
				accent: "pink"
			}), /* @__PURE__ */ (0, j.jsx)(Ge, {
				name: "Denon AVR-X1400H",
				data: i.volume_formula?.denon,
				accent: "cyan"
			})]
		}),
		/* @__PURE__ */ (0, j.jsxs)("div", {
			className: "dashboard-grid lower",
			children: [
				/* @__PURE__ */ (0, j.jsxs)(N, {
					className: "quick-control",
					title: "Schnellsteuerung",
					children: [
						/* @__PURE__ */ (0, j.jsxs)("div", {
							className: "button-row",
							children: [
								/* @__PURE__ */ (0, j.jsx)(Ye, {
									icon: M.Volume2,
									onClick: () => void y("policy", "nudge_volume", { delta: -.05 }),
									children: "− 5 %"
								}),
								/* @__PURE__ */ (0, j.jsx)(Ye, {
									icon: M.RefreshCw,
									onClick: () => void y("policy", "reset_nudge"),
									children: "Nudge Reset"
								}),
								/* @__PURE__ */ (0, j.jsx)(Ye, {
									icon: M.Volume2,
									onClick: () => void y("policy", "nudge_volume", { delta: .05 }),
									children: "+ 5 %"
								}),
								/* @__PURE__ */ (0, j.jsx)(Ye, {
									active: e?.audio_owner === "private",
									icon: M.Headphones,
									onClick: () => void y("state", "toggle_private"),
									children: "Private Time"
								}),
								/* @__PURE__ */ (0, j.jsx)(Ye, {
									disabled: !i.nudge?.boost_active,
									icon: M.WandSparkles,
									onClick: () => void y("policy", "reset_boost"),
									children: "Boost Reset"
								})
							]
						}),
						/* @__PURE__ */ (0, j.jsx)("h3", { children: "Radio-Schnellwahl" }),
						/* @__PURE__ */ (0, j.jsx)(dt, {
							hass: t,
							onChanged: n
						})
					]
				}),
				/* @__PURE__ */ (0, j.jsx)(N, {
					title: "Geräte-Status",
					children: /* @__PURE__ */ (0, j.jsx)(Be, { devices: o })
				}),
				/* @__PURE__ */ (0, j.jsx)(N, {
					title: "Letzte Aktionen",
					children: /* @__PURE__ */ (0, j.jsxs)("div", {
						className: "action-log",
						children: [(a.log || []).slice(0, 6).map((e, t) => /* @__PURE__ */ (0, j.jsxs)("div", { children: [
							/* @__PURE__ */ (0, j.jsx)("time", { children: Ae(e.ts) }),
							/* @__PURE__ */ (0, j.jsx)(M.Activity, { size: 16 }),
							/* @__PURE__ */ (0, j.jsxs)("span", { children: [
								A(e.action),
								e.denon_target == null ? "" : ` · Denon ${Oe(e.denon_target)}`,
								e.homepods_target == null ? "" : ` · HomePods ${Oe(e.homepods_target)}`
							] }),
							/* @__PURE__ */ (0, j.jsx)(P, {
								tone: e.executed ? "green" : "orange",
								children: e.executed ? "live" : "shadow"
							})
						] }, `${e.ts}-${t}`)), !a.log?.length && /* @__PURE__ */ (0, j.jsx)(Ie, {
							compact: !0,
							title: "Noch keine Aktionen",
							text: "Apply-Aktionen erscheinen nach dem nächsten relevanten Wechsel."
						})]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, j.jsxs)("div", {
			className: "decision-strip",
			children: [
				/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("span", { children: "Szenario" }), /* @__PURE__ */ (0, j.jsx)("strong", { children: e?.overview_audio_scenario_label || e?.audio_scenario_label || A(e?.scenario) })] }),
				/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("span", { children: "Modus" }), /* @__PURE__ */ (0, j.jsx)("strong", { children: i.is_grind ? "Grind-Modus" : A(e?.volume_policy) })] }),
				/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("span", { children: "Audio-Routing" }), /* @__PURE__ */ (0, j.jsx)("strong", { children: A(e?.audio_owner) })] }),
				/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("span", { children: "HomePods" }), /* @__PURE__ */ (0, j.jsxs)("strong", { children: [
					je(o.homepods?.state),
					" · ",
					Oe(e?.targets?.homepods_volume)
				] })] })
			]
		})
	] });
}
//#endregion
//#region frontend-src/src/pages/MusicPage.tsx
function pt({ state: e = {}, policy: t = {}, hass: n, onChanged: r }) {
	let [i, a] = (0, h.useState)(""), [o, s] = (0, h.useState)([]), [c, l] = (0, h.useState)(!1), u = e.now_playing, d = async (e) => {
		await et(n, "apply", "play_radio", { media_id: e }), r();
	}, f = async () => {
		if (i.trim()) {
			l(!0);
			try {
				let e = await et(n, "apply", "search_radio", { query: i });
				s(e?.result?.results || []);
			} finally {
				l(!1);
			}
		}
	};
	return /* @__PURE__ */ (0, j.jsxs)("div", {
		className: "music-layout",
		children: [/* @__PURE__ */ (0, j.jsxs)("div", {
			className: "music-main",
			children: [
				/* @__PURE__ */ (0, j.jsx)("div", {
					className: "now-playing-wide",
					children: u ? /* @__PURE__ */ (0, j.jsx)(Ue, {
						kind: "music",
						eyebrow: "Aktuelle Wiedergabe",
						title: u.title || "Unbekannter Titel",
						subtitle: u.artist,
						detail: `HomePods · ${Oe(u.volume ?? e.devices?.homepods?.volume)}`,
						artwork: u.artwork_url,
						device: "HomePods",
						volume: t.volume_target_homepods,
						controls: /* @__PURE__ */ (0, j.jsx)(Ye, {
							disabled: !0,
							icon: M.Pause,
							title: "Play/Pause ist im aktuellen Umbrella-Contract nicht vorhanden",
							children: "Pause"
						})
					}) : /* @__PURE__ */ (0, j.jsx)(N, { children: /* @__PURE__ */ (0, j.jsx)(Ie, {
						icon: M.Music2,
						title: "Gerade läuft keine Musik",
						text: "Radio oder Music Assistant starten; die Wiedergabe erscheint automatisch."
					}) })
				}),
				/* @__PURE__ */ (0, j.jsx)(N, {
					title: "Radiosender",
					action: /* @__PURE__ */ (0, j.jsx)(P, {
						tone: "pink",
						children: "Music Assistant"
					}),
					children: /* @__PURE__ */ (0, j.jsx)(dt, {
						hass: n,
						onChanged: r
					})
				}),
				/* @__PURE__ */ (0, j.jsxs)(N, {
					title: "Radio suchen",
					children: [/* @__PURE__ */ (0, j.jsxs)("div", {
						className: "search-box",
						children: [
							/* @__PURE__ */ (0, j.jsx)(M.Search, { size: 18 }),
							/* @__PURE__ */ (0, j.jsx)("input", {
								value: i,
								onChange: (e) => a(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && void f(),
								placeholder: "Sender in Music Assistant suchen …"
							}),
							/* @__PURE__ */ (0, j.jsx)("button", {
								onClick: () => void f(),
								disabled: c,
								children: c ? "Suche …" : "Suchen"
							})
						]
					}), o.length > 0 && /* @__PURE__ */ (0, j.jsx)("div", {
						className: "search-results",
						children: o.map((e) => /* @__PURE__ */ (0, j.jsxs)("div", { children: [
							e.image ? /* @__PURE__ */ (0, j.jsx)("img", {
								src: e.image,
								alt: ""
							}) : /* @__PURE__ */ (0, j.jsx)(M.Radio, {}),
							/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("b", { children: e.name }), /* @__PURE__ */ (0, j.jsx)("small", { children: e.favorite ? "Favorit" : "Radio" })] }),
							/* @__PURE__ */ (0, j.jsxs)("button", {
								onClick: () => void d(e.uri),
								children: [/* @__PURE__ */ (0, j.jsx)(M.Play, { size: 17 }), "Abspielen"]
							})
						] }, e.uri))
					})]
				}),
				/* @__PURE__ */ (0, j.jsx)("div", {
					className: "library-grid",
					children: [
						"Zuletzt gespielt",
						"Favoriten",
						"Playlists",
						"Kürzlich hinzugefügt"
					].map((e) => /* @__PURE__ */ (0, j.jsx)(N, {
						title: e,
						children: /* @__PURE__ */ (0, j.jsx)(Ie, {
							compact: !0,
							icon: e === "Favoriten" ? M.Heart : M.ListMusic,
							title: "Backend-Daten fehlen",
							text: "Für diesen Music-Assistant-Bereich existiert noch kein Umbrella-Contract."
						})
					}, e))
				})
			]
		}), /* @__PURE__ */ (0, j.jsxs)("aside", {
			className: "music-aside",
			children: [/* @__PURE__ */ (0, j.jsx)(N, {
				title: "Wiedergabegeräte",
				children: /* @__PURE__ */ (0, j.jsx)(Be, { devices: Object.fromEntries(Object.entries(e.devices || {}).filter(([e]) => ["homepods", "denon"].includes(e))) })
			}), /* @__PURE__ */ (0, j.jsx)(N, {
				title: "Musik-Entscheidung",
				children: /* @__PURE__ */ (0, j.jsxs)("div", {
					className: "key-values",
					children: [
						/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Audio Owner", /* @__PURE__ */ (0, j.jsx)("b", { children: t.audio_owner || "—" })] }),
						/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Ziel HomePods", /* @__PURE__ */ (0, j.jsx)("b", { children: Oe(t.volume_target_homepods) })] }),
						/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Boost", /* @__PURE__ */ (0, j.jsx)("b", { children: t.track_boost_applied ? "Aktiv" : "Aus" })] }),
						/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Quiet Mode", /* @__PURE__ */ (0, j.jsx)("b", { children: t.quiet_mode ? "Aktiv" : "Aus" })] })
					]
				})
			})]
		})]
	});
}
//#endregion
//#region frontend-src/src/pages/GamingPage.tsx
function mt({ state: e = {}, policy: t = {} }) {
	let n = e.devices?.ps5?.active ? "ps5" : e.devices?.pc?.active ? "pc" : e.gaming_platform || "ps5", r = e.devices?.[n], i = e.classifiers?.[n], a = e.context === "gaming" || !!r?.active, o = i?.display_name || r?.title || (a ? "Gaming-Session" : "Kein Spiel aktiv"), s = t.is_grind ? "Grind-Modus" : e.headset_active ? "Headset-Modus" : "Normal-Modus";
	return /* @__PURE__ */ (0, j.jsxs)("div", {
		className: "gaming-page",
		children: [
			/* @__PURE__ */ (0, j.jsxs)("div", {
				className: "gaming-hero",
				children: [a ? /* @__PURE__ */ (0, j.jsx)(Ue, {
					kind: "gaming",
					eyebrow: "Aktives Spiel",
					title: o,
					subtitle: A(i?.platform || e.gaming_platform || n),
					detail: s,
					artwork: r?.artwork_url || i?.artwork_url,
					artworkCandidates: r?.artwork_candidates,
					badges: /* @__PURE__ */ (0, j.jsxs)(j.Fragment, { children: [/* @__PURE__ */ (0, j.jsx)(P, {
						tone: t.is_grind ? "pink" : e.headset_active ? "cyan" : "violet",
						children: s
					}), !t.subwoofer_allowed && /* @__PURE__ */ (0, j.jsx)(P, {
						tone: "orange",
						children: "Subwoofer gesperrt"
					})] }),
					device: e.devices?.denon?.active ? "Denon AVR-X1400H" : "Gaming-Audio",
					volume: t.volume_target_denon
				}) : /* @__PURE__ */ (0, j.jsx)(N, { children: /* @__PURE__ */ (0, j.jsx)(Ie, {
					icon: M.Gamepad2,
					title: "Kein Spiel aktiv",
					text: "PlayStation- und PC-Titel erscheinen automatisch aus Media State."
				}) }), /* @__PURE__ */ (0, j.jsx)(Ke, {
					reasons: t.reasons,
					activeReasons: e.active_reasons
				})]
			}),
			/* @__PURE__ */ (0, j.jsxs)("div", {
				className: "gaming-kpis",
				children: [
					/* @__PURE__ */ (0, j.jsxs)(N, { children: [
						/* @__PURE__ */ (0, j.jsx)("span", {
							className: "kpi-label",
							children: "Plattform"
						}),
						/* @__PURE__ */ (0, j.jsx)("strong", { children: A(i?.platform || e.gaming_platform || n) }),
						/* @__PURE__ */ (0, j.jsx)(P, {
							tone: "cyan",
							children: je(r?.state)
						})
					] }),
					/* @__PURE__ */ (0, j.jsxs)(N, { children: [
						/* @__PURE__ */ (0, j.jsx)("span", {
							className: "kpi-label",
							children: "Erkannter Modus"
						}),
						/* @__PURE__ */ (0, j.jsx)("strong", { children: s }),
						/* @__PURE__ */ (0, j.jsx)(P, {
							tone: t.is_grind ? "pink" : "violet",
							children: s
						})
					] }),
					/* @__PURE__ */ (0, j.jsxs)(N, { children: [
						/* @__PURE__ */ (0, j.jsx)("span", {
							className: "kpi-label",
							children: "Audio-Routing"
						}),
						/* @__PURE__ */ (0, j.jsx)("strong", { children: A(t.audio_owner) }),
						/* @__PURE__ */ (0, j.jsx)("small", { children: t.action ? A(t.action) : "Aktuelle Policy-Entscheidung" })
					] }),
					/* @__PURE__ */ (0, j.jsxs)(N, { children: [
						/* @__PURE__ */ (0, j.jsx)("span", {
							className: "kpi-label",
							children: "Subwoofer"
						}),
						/* @__PURE__ */ (0, j.jsx)("strong", { children: t.subwoofer_allowed ? "Erlaubt" : "Gesperrt" }),
						/* @__PURE__ */ (0, j.jsx)(P, {
							tone: t.subwoofer_allowed ? "green" : "orange",
							children: t.is_grind ? "Grind reduziert" : "Policy"
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, j.jsxs)("div", {
				className: "dashboard-grid volumes",
				children: [/* @__PURE__ */ (0, j.jsx)(Ge, {
					name: "HomePods",
					data: t.volume_formula?.homepods,
					accent: "pink"
				}), /* @__PURE__ */ (0, j.jsx)(Ge, {
					name: "Denon AVR-X1400H",
					data: t.volume_formula?.denon,
					accent: "cyan"
				})]
			}),
			/* @__PURE__ */ (0, j.jsxs)("div", {
				className: "dashboard-grid gaming-bottom",
				children: [/* @__PURE__ */ (0, j.jsxs)(N, {
					title: "Title Classifier",
					children: [/* @__PURE__ */ (0, j.jsxs)("div", {
						className: "classifier-panel",
						children: [
							/* @__PURE__ */ (0, j.jsxs)("div", { children: [
								/* @__PURE__ */ (0, j.jsx)(M.WandSparkles, {}),
								/* @__PURE__ */ (0, j.jsx)("span", { children: "Anzeigename" }),
								/* @__PURE__ */ (0, j.jsx)("b", { children: i?.display_name || o })
							] }),
							/* @__PURE__ */ (0, j.jsxs)("div", { children: [
								/* @__PURE__ */ (0, j.jsx)(M.Info, {}),
								/* @__PURE__ */ (0, j.jsx)("span", { children: "Originaltitel" }),
								/* @__PURE__ */ (0, j.jsx)("b", { children: i?.original_title || r?.title || "Nicht verfügbar" })
							] }),
							/* @__PURE__ */ (0, j.jsxs)("div", { children: [
								/* @__PURE__ */ (0, j.jsx)(M.CircleGauge, {}),
								/* @__PURE__ */ (0, j.jsx)("span", { children: "Modus" }),
								/* @__PURE__ */ (0, j.jsx)("b", { children: s })
							] }),
							/* @__PURE__ */ (0, j.jsxs)("div", { children: [
								/* @__PURE__ */ (0, j.jsx)(M.Info, {}),
								/* @__PURE__ */ (0, j.jsx)("span", { children: "Katalog-ID" }),
								/* @__PURE__ */ (0, j.jsx)("b", { children: i?.entry_id || "Noch nicht im Contract" })
							] })
						]
					}), /* @__PURE__ */ (0, j.jsxs)("button", {
						className: "button edit-disabled",
						disabled: !0,
						title: "Der stabile Entry-Identifier bereitet eine spätere Bearbeitung vor; diese MVP-Runde schreibt nicht in den Classifier.",
						children: [/* @__PURE__ */ (0, j.jsx)(M.Settings2, { size: 17 }), "Klassifizierung bearbeiten (vorbereitet)"]
					})]
				}), /* @__PURE__ */ (0, j.jsx)(N, {
					title: "Lautstärken & Geräte",
					children: /* @__PURE__ */ (0, j.jsxs)("div", {
						className: "key-values",
						children: [
							/* @__PURE__ */ (0, j.jsxs)("span", { children: ["HomePods", /* @__PURE__ */ (0, j.jsx)("b", { children: Oe(t.volume_target_homepods) })] }),
							/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Denon", /* @__PURE__ */ (0, j.jsx)("b", { children: Oe(t.volume_target_denon) })] }),
							/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Headset", /* @__PURE__ */ (0, j.jsx)("b", { children: e.headset_active ? "Aktiv" : "Nicht aktiv" })] }),
							/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Entertainment", /* @__PURE__ */ (0, j.jsx)("b", { children: e.entertainment_active ? "Aktiv" : "Aus" })] })
						]
					})
				})]
			})
		]
	});
}
//#endregion
//#region frontend-src/src/pages/TvPage.tsx
function ht({ state: e = {}, policy: t = {} }) {
	let n = e.devices?.tv, r = e.devices?.apple_tv, i = !!(n?.active || r?.active || ["tv", "streaming"].includes(e.context || "")), a = r?.app || r?.source || n?.source || e.subcontext, o = r?.title || n?.title || a || (i ? "TV aktiv" : "Kein TV-Inhalt aktiv");
	return /* @__PURE__ */ (0, j.jsxs)("div", {
		className: "tv-page",
		children: [
			/* @__PURE__ */ (0, j.jsxs)("div", {
				className: "tv-hero",
				children: [i ? /* @__PURE__ */ (0, j.jsx)(Ue, {
					kind: "tv",
					eyebrow: r?.active ? "Streaming" : "TV",
					title: o,
					subtitle: a ? `Quelle · ${a}` : void 0,
					detail: t.audio_scenario_detail || A(e.subcontext),
					artwork: r?.artwork_url || n?.artwork_url,
					artworkCandidates: r?.active ? r?.artwork_candidates : n?.artwork_candidates,
					device: "Denon AVR-X1400H",
					volume: t.volume_target_denon
				}) : /* @__PURE__ */ (0, j.jsx)(N, { children: /* @__PURE__ */ (0, j.jsx)(Ie, {
					icon: M.Tv,
					title: "TV und Streaming sind aus",
					text: "Quelle, App und Routing erscheinen, sobald TV oder Apple TV aktiv sind."
				}) }), /* @__PURE__ */ (0, j.jsx)(Ke, {
					reasons: t.reasons,
					activeReasons: e.active_reasons
				})]
			}),
			/* @__PURE__ */ (0, j.jsxs)("div", {
				className: "dashboard-grid tv-status",
				children: [/* @__PURE__ */ (0, j.jsx)(N, {
					title: "Geräte",
					children: /* @__PURE__ */ (0, j.jsx)(Be, { devices: Object.fromEntries(Object.entries(e.devices || {}).filter(([e]) => [
						"tv",
						"apple_tv",
						"denon"
					].includes(e))) })
				}), /* @__PURE__ */ (0, j.jsx)(N, {
					title: "Aktuelle Entscheidung",
					children: /* @__PURE__ */ (0, j.jsxs)("div", {
						className: "key-values",
						children: [
							/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Szenario", /* @__PURE__ */ (0, j.jsx)("b", { children: t.audio_scenario_label || A(e.context) })] }),
							/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Routing", /* @__PURE__ */ (0, j.jsx)("b", { children: A(t.audio_owner) })] }),
							/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Denon Ziel", /* @__PURE__ */ (0, j.jsx)("b", { children: Oe(t.volume_target_denon) })] }),
							/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Aktion", /* @__PURE__ */ (0, j.jsx)("b", { children: A(t.action) })] })
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, j.jsx)(Ge, {
				name: "Denon Lautstärke-Erklärung",
				data: t.volume_formula?.denon,
				accent: "cyan"
			})
		]
	});
}
//#endregion
//#region frontend-src/src/pages/RulesPage.tsx
var gt = {
	early_morning: "Früher Morgen",
	forenoon: "Vormittag",
	midday: "Mittag",
	afternoon: "Nachmittag",
	late_afternoon: "Später Nachmittag",
	evening: "Abend",
	late_evening: "Später Abend",
	early_night: "Frühe Nacht",
	late_night: "Späte Nacht",
	late_morning: "Später Morgen",
	early_evening: "Früher Abend"
}, _t = {
	idle: "Inaktiv",
	free_time: "Freizeit",
	work_home: "Arbeit zuhause",
	work_away: "Arbeit außer Haus",
	household: "Haushalt"
}, vt = [
	"idle",
	"free_time",
	"work_home",
	"work_away",
	"household"
], yt = ["homepods", "denon"], bt = { "auto_blocked:denon_off": "Automatischer Eintritt blockiert: Denon ist ausgeschaltet." };
function xt(e) {
	return e ? bt[e] || e : "Kein aktiver oder blockierter Grund";
}
function St({ text: e }) {
	return /* @__PURE__ */ (0, j.jsx)("span", {
		className: "rule-help",
		title: e,
		"aria-label": e,
		children: /* @__PURE__ */ (0, j.jsx)(M.Info, { size: 15 })
	});
}
function F({ value: e, offset: t = !1, overridden: n, disabled: r, resetToken: i = 0, onDraft: a, onClear: o, label: s }) {
	let c = e == null ? "" : String(o ? Math.round(e * 1e3) / 10 : Math.round(e * 100)), [l, u] = (0, h.useState)(c);
	(0, h.useEffect)(() => {
		let e = window.setTimeout(() => u(c), 0);
		return () => window.clearTimeout(e);
	}, [c, i]);
	let d = (e) => {
		if (u(e), r || !a) return;
		if (e === "" && o) {
			o();
			return;
		}
		let n = Number(e);
		a(e.trim() !== "" && Number.isFinite(n) && n >= (t ? -100 : 0) && n <= 100 ? o ? Math.round(n * 10) / 1e3 : n / 100 : void 0);
	};
	return /* @__PURE__ */ (0, j.jsxs)("label", {
		className: `percent-input ${n ? "overridden" : ""} ${r ? "readonly" : ""}`,
		title: t ? "Offset in Prozentpunkten" : "Lautstärke in Prozent",
		children: [/* @__PURE__ */ (0, j.jsx)("input", {
			"aria-label": s ?? (t ? "Prozentpunkte" : "Prozent"),
			type: "number",
			value: l,
			min: t ? -100 : 0,
			max: 100,
			step: o ? .1 : void 0,
			placeholder: o ? "Global" : void 0,
			disabled: r,
			onChange: (e) => d(e.target.value)
		}), /* @__PURE__ */ (0, j.jsx)("span", { children: t ? "Pkt." : "%" })]
	});
}
function Ct({ value: e, unit: t = "", missing: n }) {
	return e == null ? /* @__PURE__ */ (0, j.jsx)("span", {
		className: "contract-missing",
		title: n || "Dieser Wert fehlt im aktuellen Umbrella-Contract.",
		children: "Contract fehlt"
	}) : /* @__PURE__ */ (0, j.jsxs)("strong", {
		className: "read-value",
		children: [typeof e == "boolean" ? e ? "Ja" : "Nein" : e, t]
	});
}
function wt({ label: e, supported: t = !0, onReset: n }) {
	return /* @__PURE__ */ (0, j.jsxs)("button", {
		className: "button section-reset",
		disabled: !t,
		title: t ? `${e} auf Backend-Defaults zurücksetzen` : "Der Backend-Contract kann diesen Abschnitt noch nicht auf gespeicherte Defaults zurücksetzen.",
		onClick: n,
		children: [/* @__PURE__ */ (0, j.jsx)(M.RefreshCw, { size: 14 }), " Zurücksetzen"]
	});
}
function Tt({ index: e, title: t, sub: n, unit: r, help: i, resetSupported: a = !0, onReset: o, showDevices: s = !0 }) {
	return /* @__PURE__ */ (0, j.jsxs)("div", {
		className: "rule-title",
		children: [
			/* @__PURE__ */ (0, j.jsx)("span", { children: e }),
			/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsxs)("h2", { children: [
				t,
				" ",
				/* @__PURE__ */ (0, j.jsx)(St, { text: i })
			] }), /* @__PURE__ */ (0, j.jsx)("p", { children: n })] }),
			/* @__PURE__ */ (0, j.jsxs)("div", {
				className: "rule-title-actions",
				children: [r && /* @__PURE__ */ (0, j.jsx)(P, {
					tone: "violet",
					children: r
				}), /* @__PURE__ */ (0, j.jsx)(wt, {
					label: t,
					supported: a,
					onReset: o
				})]
			}),
			s && /* @__PURE__ */ (0, j.jsxs)("div", {
				className: "rule-device-head",
				children: [/* @__PURE__ */ (0, j.jsx)("b", { children: "HomePods" }), /* @__PURE__ */ (0, j.jsx)("b", { children: "Denon" })]
			})
		]
	});
}
function Et({ matrix: e, dimension: t, rows: n, labels: r, offset: i, resetToken: a, onDraft: o }) {
	return /* @__PURE__ */ (0, j.jsx)("div", {
		className: "rule-table",
		children: n.map((n) => /* @__PURE__ */ (0, j.jsxs)("div", {
			className: "rule-row",
			children: [/* @__PURE__ */ (0, j.jsx)("span", { children: r[n] || e.catalog.scenario_labels[n] || A(n) }), yt.map((r) => /* @__PURE__ */ (0, j.jsx)(F, {
				offset: i,
				resetToken: a,
				value: e[t]?.[r]?.[n] ?? 0,
				overridden: e.override?.[t]?.[r]?.[n] !== void 0,
				onDraft: (e) => o(r, n, e)
			}, r))]
		}, n))
	});
}
function Dt({ matrix: e, apply: t = {}, state: n = {}, hass: r, onMatrix: i, onDirtyChange: a }) {
	let [o, s] = (0, h.useState)("matrix"), [c, l] = (0, h.useState)(e), [u, d] = (0, h.useState)({}), [f, p] = (0, h.useState)({}), [m, g] = (0, h.useState)("idle"), [_, v] = (0, h.useState)(""), [y, b] = (0, h.useState)(/* @__PURE__ */ new Set()), [x, ee] = (0, h.useState)(0), [S, C] = (0, h.useState)(t.reapply), te = Object.values(u).reduce((e, t) => e + Object.values(t || {}).reduce((e, t) => e + Object.keys(t || {}).length, 0), 0) + Object.keys(f).length + y.size, w = te > 0, ne = (0, h.useMemo)(() => c?.catalog.scenarios.filter((e) => ![
		"gaming",
		"private",
		"private_time"
	].includes(e)) || [], [c]);
	if ((0, h.useEffect)(() => {
		if (w) return;
		let t = window.setTimeout(() => l(e), 0);
		return () => window.clearTimeout(t);
	}, [e, w]), (0, h.useEffect)(() => {
		a?.(w);
	}, [w, a]), (0, h.useEffect)(() => () => a?.(!1), [a]), (0, h.useEffect)(() => {
		let e = (e) => {
			w && (e.preventDefault(), e.returnValue = "");
		};
		return window.addEventListener("beforeunload", e), () => window.removeEventListener("beforeunload", e);
	}, [w]), (0, h.useEffect)(() => {
		let e = !1, t = async () => {
			try {
				let t = await it(r);
				e || C(t.reapply);
			} catch {}
		};
		t();
		let n = window.setInterval(() => {
			S?.pending && t();
		}, 1e3);
		return () => {
			e = !0, window.clearInterval(n);
		};
	}, [r, S?.pending]), !c) return /* @__PURE__ */ (0, j.jsx)(N, { children: /* @__PURE__ */ (0, j.jsx)(Ie, {
		icon: M.SlidersHorizontal,
		title: "Regel-Contract nicht verfügbar",
		text: "benni_media_policy/get_matrix konnte nicht geladen werden. Es wird nichts lokal gespeichert."
	}) });
	let T = (t, n, r, i) => {
		g("idle"), v(""), d((a) => {
			let o = structuredClone(a), s = e?.[t]?.[n]?.[r], c = e?.override?.[t]?.[n]?.[r];
			return (i === null ? c === void 0 : s === i) ? (delete o[t]?.[n]?.[r], o[t]?.[n] && Object.keys(o[t][n]).length === 0 && delete o[t][n], o[t] && Object.keys(o[t]).length === 0 && delete o[t]) : (o[t] ||= {}, o[t][n] ||= {}, o[t][n][r] = i), o;
		}), l((e) => {
			let a = structuredClone(e);
			return t === "boost_allowed" ? typeof i == "boolean" && (a.boost_allowed[n][r] = i) : typeof i == "number" ? a[t][n][r] = i : t === "phase_max" && delete a.phase_max[n][r], a;
		});
	}, re = (e, t, n, r) => {
		let i = `${e}.${t}.${n}`;
		b((e) => {
			let t = new Set(e);
			return r === void 0 ? t.add(i) : t.delete(i), t;
		}), r === void 0 ? (g("idle"), v("")) : T(e, t, n, r);
	}, ie = (t, n) => {
		g("idle"), v(""), p((r) => {
			let i = { ...r };
			return e?.scalars[t] === n ? delete i[t] : i[t] = n, i;
		}), l((e) => {
			let r = structuredClone(e);
			return r.scalars[t] = n, r;
		});
	}, E = (e, t) => {
		let n = `scalar.${e}`;
		b((e) => {
			let r = new Set(e);
			return t === void 0 ? r.add(n) : r.delete(n), r;
		}), t === void 0 ? (g("idle"), v("")) : ie(e, t);
	}, ae = () => {
		d({}), p({}), b(/* @__PURE__ */ new Set()), l(e), g("idle"), v(""), ee((e) => e + 1);
	}, oe = (t, n, r) => {
		window.confirm(`${t} zurücksetzen? Es werden nur die gespeicherten Overrides dieses Abschnitts gelöscht; andere Regeln bleiben unverändert.`) && yt.forEach((t) => {
			(n === "base" ? Object.keys(e?.override?.base?.[t] || {}) : r).forEach((e) => T(n, t, e, null));
		});
	}, se = () => {
		window.confirm("Matrixwerte auf Standard zurücksetzen? Betroffen sind Tagesphasen-Basis, Phasen-Maxima und Boost-Freigaben sowie Szenario-Offsets einschließlich Gaming Normal und Activity-Offsets. Fensterwerte, Grind-Offsets, Private-Time-Cap, Quiet/Ducking, Boost-Höhe, globale Maxima sowie Apply-Optionen und Delays bleiben unverändert. Der Reset wird erst mit „Änderungen speichern“ persistiert.") && [
			"base",
			"scenario_off",
			"activity_off",
			"phase_max",
			"boost_allowed"
		].forEach((t) => yt.forEach((n) => Object.keys(e?.override?.[t]?.[n] || {}).forEach((e) => T(t, n, e, null))));
	}, ce = async () => {
		if (!w || y.size || m === "saving") return;
		g("saving"), v("");
		let e = !1, t = !1;
		try {
			C((await at(r, 30)).reapply), Object.keys(u).length && (await tt(r, u), e = !0), Object.keys(f).length && (await nt(r, f), t = !0);
			let n = await rt(r);
			for (let e of Object.keys(u)) for (let t of yt) for (let [r, i] of Object.entries(u[e]?.[t] || {})) {
				let a = i === null ? n.override?.[e]?.[t]?.[r] : n[e]?.[t]?.[r];
				if (i === null ? a !== void 0 : a !== i) throw Error(`${e}.${t}.${r} wurde vom Backend nicht bestätigt.`);
			}
			for (let [e, t] of Object.entries(f)) if (n.scalars[e] !== t) throw Error(`Skalar ${e} wurde vom Backend nicht bestätigt.`);
			d({}), p({}), b(/* @__PURE__ */ new Set()), l(n), i(n), g("saved");
		} catch (n) {
			try {
				C((await st(r)).reapply);
			} catch {}
			let i = [e && "Matrixwerte gespeichert", t && "Skalare gespeichert"].filter(Boolean).join("; ");
			v(`${i ? `${i}; ` : ""}${n instanceof Error ? n.message : String(n)}`), g("error");
		}
	}, D = c.phase_max != null && c.boost_allowed != null, O = (e) => c.scalars[e], le = n.private_time_active ? n.private_source === "automatic" ? "Automatischer Pfad aktiv" : n.private_source === "manual" ? "Manueller Pfad aktiv" : "Private Time aktiv" : "Kein Pfad aktiv", ue = /* @__PURE__ */ (0, j.jsxs)("div", {
		className: `rules-save-bar ${m}`,
		role: "status",
		"aria-live": "polite",
		children: [/* @__PURE__ */ (0, j.jsxs)("div", { children: [
			/* @__PURE__ */ (0, j.jsx)("b", { children: m === "saving" ? "Änderungen werden gespeichert …" : m === "saved" ? "Änderungen gespeichert" : m === "error" ? "Speichern fehlgeschlagen" : w ? "Ungespeicherte Änderungen" : "Keine ungespeicherten Änderungen" }),
			m === "error" && /* @__PURE__ */ (0, j.jsx)("span", { children: _ }),
			w && m !== "error" && /* @__PURE__ */ (0, j.jsxs)("span", { children: [
				te,
				" geänderte ",
				te === 1 ? "Einstellung" : "Einstellungen",
				y.size ? ` · ${y.size} ungültig` : ""
			] }),
			S?.pending && /* @__PURE__ */ (0, j.jsxs)("span", { children: [
				"Neue Ziele werden in ",
				Math.ceil(Number(S.remaining_s || 0)),
				" s mit aktuellem Medienkontext angewendet."
			] })
		] }), /* @__PURE__ */ (0, j.jsxs)("div", {
			className: "rules-save-actions",
			children: [
				S?.pending && /* @__PURE__ */ (0, j.jsxs)(j.Fragment, { children: [/* @__PURE__ */ (0, j.jsxs)("button", {
					className: "button",
					onClick: () => void ot(r).then((e) => C(e.reapply)),
					children: [/* @__PURE__ */ (0, j.jsx)(M.Play, { size: 16 }), " Jetzt anwenden"]
				}), /* @__PURE__ */ (0, j.jsx)("button", {
					className: "button",
					onClick: () => void st(r).then((e) => C(e.reapply)),
					children: "Anwendung abbrechen"
				})] }),
				/* @__PURE__ */ (0, j.jsx)("button", {
					className: "button",
					disabled: !w || m === "saving",
					onClick: ae,
					children: "Änderungen verwerfen"
				}),
				/* @__PURE__ */ (0, j.jsxs)("button", {
					className: "button primary",
					disabled: !w || y.size > 0 || m === "saving",
					onClick: () => void ce(),
					children: [/* @__PURE__ */ (0, j.jsx)(M.Save, { size: 17 }), " Änderungen speichern"]
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, j.jsxs)("div", {
		className: `rules-page ${m === "saving" ? "busy" : ""}`,
		children: [
			/* @__PURE__ */ (0, j.jsxs)("div", {
				className: "rules-tabs",
				children: [
					/* @__PURE__ */ (0, j.jsx)(Ye, {
						active: o === "matrix",
						onClick: () => s("matrix"),
						icon: M.SlidersHorizontal,
						children: "Matrix"
					}),
					/* @__PURE__ */ (0, j.jsx)(Ye, {
						active: o === "gaming",
						onClick: () => s("gaming"),
						icon: M.Gamepad2,
						children: "Gaming-Modi"
					}),
					/* @__PURE__ */ (0, j.jsx)(Ye, {
						active: o === "safety",
						onClick: () => s("safety"),
						icon: M.ShieldCheck,
						children: "Caps & Private Time"
					}),
					/* @__PURE__ */ (0, j.jsx)(Ye, {
						active: o === "delays",
						onClick: () => s("delays"),
						icon: M.Activity,
						children: "Delays, Sleep & Waking"
					}),
					/* @__PURE__ */ (0, j.jsx)("span", {}),
					/* @__PURE__ */ (0, j.jsxs)("button", {
						className: "button danger",
						title: "Merkt das Löschen der Matrix-Overrides vor; gespeichert wird erst über den Save-Button.",
						onClick: se,
						children: [/* @__PURE__ */ (0, j.jsx)(M.RefreshCw, { size: 17 }), "Matrixwerte auf Standard zurücksetzen"]
					})
				]
			}),
			/* @__PURE__ */ (0, j.jsxs)("p", {
				className: "reset-explainer",
				children: [/* @__PURE__ */ (0, j.jsx)(M.Info, { size: 14 }), " Der globale Reset löscht nur den Policy-Matrix-Store. Skalare und Apply-Optionen besitzen im aktuellen Contract keinen Reset-Endpunkt."]
			}),
			ue,
			o === "matrix" && /* @__PURE__ */ (0, j.jsxs)(j.Fragment, { children: [
				/* @__PURE__ */ (0, j.jsxs)(N, {
					className: "rule-section",
					children: [/* @__PURE__ */ (0, j.jsx)(Tt, {
						index: 1,
						title: "Basiswerte je Tagesphase",
						sub: D ? "Leere Maximalfelder übernehmen das globale Geräte-Maximum." : "Grundlautstärke je Tagesphase und Gerät",
						unit: "Prozent",
						help: "Der niedrigere Wert aus Phasen-Maximum und globalem Maximum begrenzt das Ziel. Titel-Boost gilt nur für HomePods.",
						onReset: () => oe("Tagesphasen-Basis", "base", c.catalog.dayphases),
						showDevices: !D
					}), D ? /* @__PURE__ */ (0, j.jsx)("div", {
						className: "phase-rules",
						children: /* @__PURE__ */ (0, j.jsxs)("table", { children: [/* @__PURE__ */ (0, j.jsx)("thead", { children: /* @__PURE__ */ (0, j.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, j.jsx)("th", {
								scope: "col",
								children: "Tagesphase"
							}),
							/* @__PURE__ */ (0, j.jsx)("th", {
								scope: "col",
								children: "HomePods"
							}),
							/* @__PURE__ */ (0, j.jsx)("th", {
								scope: "col",
								children: "Denon"
							}),
							/* @__PURE__ */ (0, j.jsx)("th", {
								scope: "col",
								children: "Max HomePods"
							}),
							/* @__PURE__ */ (0, j.jsx)("th", {
								scope: "col",
								children: "Max Denon"
							}),
							/* @__PURE__ */ (0, j.jsx)("th", {
								scope: "col",
								children: "Titel-Boost"
							})
						] }) }), /* @__PURE__ */ (0, j.jsx)("tbody", { children: c.catalog.dayphases.map((e) => {
							let t = gt[e] || A(e);
							return /* @__PURE__ */ (0, j.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, j.jsx)("th", {
									scope: "row",
									children: t
								}),
								yt.map((n) => /* @__PURE__ */ (0, j.jsx)("td", { children: /* @__PURE__ */ (0, j.jsx)(F, {
									resetToken: x,
									value: c.base[n]?.[e],
									overridden: c.override?.base?.[n]?.[e] !== void 0,
									label: `${t} ${n === "homepods" ? "HomePods" : "Denon"}`,
									onDraft: (t) => re("base", n, e, t)
								}) }, n)),
								yt.map((n) => /* @__PURE__ */ (0, j.jsx)("td", { children: /* @__PURE__ */ (0, j.jsx)(F, {
									resetToken: x,
									value: c.phase_max?.[n]?.[e],
									overridden: c.override?.phase_max?.[n]?.[e] !== void 0,
									label: `${t} Max ${n === "homepods" ? "HomePods" : "Denon"}`,
									onDraft: (t) => re("phase_max", n, e, t),
									onClear: () => re("phase_max", n, e, null)
								}) }, n)),
								/* @__PURE__ */ (0, j.jsx)("td", { children: /* @__PURE__ */ (0, j.jsx)("label", {
									className: "phase-boost",
									children: /* @__PURE__ */ (0, j.jsx)("input", {
										type: "checkbox",
										"aria-label": `${t} Titel-Boost`,
										checked: c.boost_allowed?.homepods?.[e] === !0,
										onChange: (t) => T("boost_allowed", "homepods", e, t.target.checked)
									})
								}) })
							] }, e);
						}) })] })
					}) : /* @__PURE__ */ (0, j.jsx)(Et, {
						matrix: c,
						dimension: "base",
						rows: c.catalog.dayphases,
						labels: gt,
						resetToken: x,
						onDraft: (e, t, n) => re("base", e, t, n)
					})]
				}),
				/* @__PURE__ */ (0, j.jsxs)(N, {
					className: "rule-section",
					children: [/* @__PURE__ */ (0, j.jsx)(Tt, {
						index: 2,
						title: "Fenster",
						sub: "Geschlossen ohne Abzug; gekippt und offen verwenden denselben Wert",
						unit: "Prozentpunkte",
						help: "Der Öffnungs-Master unterscheidet geschlossen, gekippt und offen. Die Policy wendet für gekippt und offen bewusst denselben gerätespezifischen Offset an.",
						resetSupported: !1
					}), /* @__PURE__ */ (0, j.jsxs)("div", {
						className: "rule-table",
						children: [
							/* @__PURE__ */ (0, j.jsxs)("div", {
								className: "rule-row",
								children: [/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Geschlossen ", /* @__PURE__ */ (0, j.jsx)(P, {
									tone: "green",
									children: "fest 0"
								})] }), yt.map((e) => /* @__PURE__ */ (0, j.jsx)(F, {
									value: 0,
									offset: !0,
									disabled: !0
								}, e))]
							}),
							/* @__PURE__ */ (0, j.jsxs)("div", {
								className: "rule-row",
								children: [
									/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Gekippt ", /* @__PURE__ */ (0, j.jsx)(P, {
										tone: "orange",
										children: "additiv"
									})] }),
									/* @__PURE__ */ (0, j.jsx)(F, {
										resetToken: x,
										value: O("opening_offset_homepods"),
										offset: !0,
										onDraft: (e) => E("opening_offset_homepods", e)
									}),
									/* @__PURE__ */ (0, j.jsx)(F, {
										resetToken: x,
										value: O("opening_offset_denon"),
										offset: !0,
										onDraft: (e) => E("opening_offset_denon", e)
									})
								]
							}),
							/* @__PURE__ */ (0, j.jsxs)("div", {
								className: "rule-row",
								children: [
									/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Offen ", /* @__PURE__ */ (0, j.jsx)(P, {
										tone: "violet",
										children: "wie gekippt"
									})] }),
									/* @__PURE__ */ (0, j.jsx)(F, {
										value: O("opening_offset_homepods"),
										offset: !0,
										disabled: !0
									}),
									/* @__PURE__ */ (0, j.jsx)(F, {
										value: O("opening_offset_denon"),
										offset: !0,
										disabled: !0
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, j.jsxs)(N, {
					className: "rule-section",
					children: [/* @__PURE__ */ (0, j.jsx)(Tt, {
						index: 3,
						title: "Szenario-Offsets",
						sub: "Allgemeine additive Offsets; Gaming und Private Time sind separat modelliert",
						unit: "Prozentpunkte",
						help: "Private Time ist kein normaler Szenario-Offset. Gaming besitzt eigene Modusregeln und wird deshalb im nächsten Reiter dargestellt.",
						onReset: () => oe("Szenario-Offsets", "scenario_off", ne)
					}), /* @__PURE__ */ (0, j.jsx)(Et, {
						matrix: c,
						dimension: "scenario_off",
						rows: ne,
						labels: {},
						offset: !0,
						resetToken: x,
						onDraft: (e, t, n) => re("scenario_off", e, t, n)
					})]
				}),
				/* @__PURE__ */ (0, j.jsxs)(N, {
					className: "rule-section",
					children: [/* @__PURE__ */ (0, j.jsx)(Tt, {
						index: 4,
						title: "Activity-Offsets",
						sub: "Vollständiger Activity-Katalog aus dem Lastenheft",
						unit: "Prozentpunkte",
						help: "Der Backend-Store akzeptiert offene Activity-Keys. Die UX zeigt deshalb auch idle, free_time und household, obwohl der aktuelle Katalog-Endpunkt nur die beiden Work-Werte listet.",
						onReset: () => oe("Activity-Offsets", "activity_off", vt)
					}), /* @__PURE__ */ (0, j.jsx)(Et, {
						matrix: c,
						dimension: "activity_off",
						rows: vt,
						labels: _t,
						offset: !0,
						resetToken: x,
						onDraft: (e, t, n) => re("activity_off", e, t, n)
					})]
				})
			] }),
			o === "gaming" && /* @__PURE__ */ (0, j.jsxs)("div", {
				className: "mode-stack",
				children: [
					/* @__PURE__ */ (0, j.jsxs)(N, {
						className: "rule-section",
						children: [/* @__PURE__ */ (0, j.jsx)(Tt, {
							index: 1,
							title: "Gaming Normal",
							sub: "Allgemeiner Gaming-Szenario-Offset je Gerät",
							unit: "Prozentpunkte",
							help: "Diese beiden Matrixzellen bilden den Normal-Modus. Sie werden auch als Grundanteil im Grind-Modus berücksichtigt.",
							onReset: () => oe("Gaming Normal", "scenario_off", ["gaming"])
						}), /* @__PURE__ */ (0, j.jsx)("div", {
							className: "rule-table",
							children: /* @__PURE__ */ (0, j.jsxs)("div", {
								className: "rule-row",
								children: [/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Gaming Normal ", /* @__PURE__ */ (0, j.jsx)(P, {
									tone: "cyan",
									children: "Normal"
								})] }), yt.map((e) => /* @__PURE__ */ (0, j.jsx)(F, {
									resetToken: x,
									offset: !0,
									value: c.scenario_off?.[e]?.gaming ?? 0,
									overridden: c.override?.scenario_off?.[e]?.gaming !== void 0,
									onDraft: (t) => re("scenario_off", e, "gaming", t)
								}, e))]
							})
						})]
					}),
					/* @__PURE__ */ (0, j.jsxs)(N, {
						className: "rule-section",
						children: [/* @__PURE__ */ (0, j.jsx)(Tt, {
							index: 2,
							title: "Gaming Grind",
							sub: "Zusätzliche Grind-Offsets; HomePods dominant, Denon als Kulisse",
							unit: "Prozentpunkte",
							help: "Berechnung: Gaming-Normal-Offset plus Grind-Offset. Der Subwoofer-Block ist eine feste R16-Regel und kein gewöhnlicher Offset.",
							resetSupported: !1
						}), /* @__PURE__ */ (0, j.jsxs)("div", {
							className: "rule-table",
							children: [/* @__PURE__ */ (0, j.jsxs)("div", {
								className: "rule-row",
								children: [
									/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Zusätzlicher Grind-Offset ", /* @__PURE__ */ (0, j.jsx)(P, {
										tone: "pink",
										children: "Grind"
									})] }),
									/* @__PURE__ */ (0, j.jsx)(F, {
										resetToken: x,
										offset: !0,
										value: O("grind_homepods_offset"),
										onDraft: (e) => E("grind_homepods_offset", e)
									}),
									/* @__PURE__ */ (0, j.jsx)(F, {
										resetToken: x,
										offset: !0,
										value: O("grind_denon_offset"),
										onDraft: (e) => E("grind_denon_offset", e)
									})
								]
							}), /* @__PURE__ */ (0, j.jsxs)("div", {
								className: "rule-row hard-rule",
								children: [/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Subwoofer ", /* @__PURE__ */ (0, j.jsx)(P, {
									tone: "orange",
									children: "Hard-Override"
								})] }), /* @__PURE__ */ (0, j.jsx)("strong", {
									className: "span-devices",
									children: "Immer gesperrt · nicht editierbar"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, j.jsxs)(N, {
						className: "rule-section",
						children: [/* @__PURE__ */ (0, j.jsx)(Tt, {
							index: 3,
							title: "Gaming Headset",
							sub: "Definierter Classifier-Modus: Das Headset trägt den Spielton",
							help: "Der Title Classifier liefert gaming_headset (Enum 2). Die feste Headset-Regel sperrt den Subwoofer; auf dem PC bleibt Raum-Musik erhalten und der Denon aus. Lediglich ein editierbarer Geräte-Offset-Contract ist noch nicht implementiert.",
							resetSupported: !1
						}), /* @__PURE__ */ (0, j.jsxs)("div", {
							className: "fixed-rule-grid",
							children: [
								/* @__PURE__ */ (0, j.jsxs)("div", { children: [
									/* @__PURE__ */ (0, j.jsx)(P, {
										tone: "cyan",
										children: "Classifier 2"
									}),
									/* @__PURE__ */ (0, j.jsx)("b", { children: "Spielton über Headset" }),
									/* @__PURE__ */ (0, j.jsxs)("span", { children: [
										"Der definierte Modus ist ",
										/* @__PURE__ */ (0, j.jsx)("code", { children: "gaming_headset" }),
										"."
									] })
								] }),
								/* @__PURE__ */ (0, j.jsxs)("div", { children: [
									/* @__PURE__ */ (0, j.jsx)(P, {
										tone: "orange",
										children: "Hard-Override"
									}),
									/* @__PURE__ */ (0, j.jsx)("b", { children: "Subwoofer gesperrt" }),
									/* @__PURE__ */ (0, j.jsxs)("span", { children: [
										"Gilt, sobald ",
										/* @__PURE__ */ (0, j.jsx)("code", { children: "headset_active" }),
										" gesetzt ist."
									] })
								] }),
								/* @__PURE__ */ (0, j.jsxs)("div", { children: [
									/* @__PURE__ */ (0, j.jsx)(P, {
										tone: "orange",
										children: "Umsetzungslücke"
									}),
									/* @__PURE__ */ (0, j.jsx)("b", { children: "Kein editierbarer Geräte-Offset" }),
									/* @__PURE__ */ (0, j.jsx)("span", { children: "Das Feld bleibt read-only, bis ein persistenter Backend-Contract existiert." })
								] })
							]
						})]
					})
				]
			}),
			o === "safety" && /* @__PURE__ */ (0, j.jsxs)("div", {
				className: "safety-grid",
				children: [
					/* @__PURE__ */ (0, j.jsxs)(N, {
						className: "private-card",
						title: "Private Time",
						action: /* @__PURE__ */ (0, j.jsx)(wt, {
							label: "Private Time",
							supported: !1
						}),
						children: [
							/* @__PURE__ */ (0, j.jsxs)("div", {
								className: "private-paths",
								children: [/* @__PURE__ */ (0, j.jsxs)("div", { children: [
									/* @__PURE__ */ (0, j.jsx)(P, {
										tone: "violet",
										children: "Automatisch"
									}),
									/* @__PURE__ */ (0, j.jsx)("b", { children: "Classifier + PC + Denon" }),
									/* @__PURE__ */ (0, j.jsx)("span", { children: "Alle drei Bedingungen müssen gleichzeitig aktiv sein." })
								] }), /* @__PURE__ */ (0, j.jsxs)("div", { children: [
									/* @__PURE__ */ (0, j.jsx)(P, {
										tone: "cyan",
										children: "Manuell"
									}),
									/* @__PURE__ */ (0, j.jsx)("b", { children: "Schalter + PC" }),
									/* @__PURE__ */ (0, j.jsx)("span", { children: "Headset-Pfad ohne Denon und ohne Classifier; schaltet Denon nie ein." })
								] })]
							}),
							/* @__PURE__ */ (0, j.jsxs)("div", {
								className: "hard-rule-banner",
								children: [/* @__PURE__ */ (0, j.jsx)(M.LockKeyhole, { size: 18 }), /* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("b", { children: "HomePods bleiben aus" }), /* @__PURE__ */ (0, j.jsx)("span", { children: "Beide Private-Time-Pfade übersteuern die normale Matrix. Private Time startet niemals eine Wake-Sequenz." })] })]
							}),
							/* @__PURE__ */ (0, j.jsxs)("div", {
								className: "private-values",
								children: [
									/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("span", { children: "Denon-Cap" }), /* @__PURE__ */ (0, j.jsx)(F, {
										resetToken: x,
										value: O("private_denon_cap"),
										onDraft: (e) => E("private_denon_cap", e)
									})] }),
									/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("span", { children: "Exit-Delay" }), /* @__PURE__ */ (0, j.jsx)(Ct, {
										value: t.private_exit?.delay_s,
										unit: " s",
										missing: "Apply besitzt die Option private_exit_delay_seconds, veröffentlicht den aktuellen Wert aber nicht im Status."
									})] }),
									/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("span", { children: "Aktiver Pfad" }), /* @__PURE__ */ (0, j.jsx)("strong", { children: le })] }),
									/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)("span", { children: "Diagnose" }), /* @__PURE__ */ (0, j.jsx)("strong", { children: xt(n.private_reason || n.private_blocked_reason) })] })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, j.jsxs)(N, {
						title: "Quiet, Boost & Mute",
						action: /* @__PURE__ */ (0, j.jsx)(wt, {
							label: "Quiet, Boost & Mute",
							supported: !1
						}),
						children: [/* @__PURE__ */ (0, j.jsxs)("div", {
							className: "scalar-list detailed",
							children: [/* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Quiet / Ducking ", /* @__PURE__ */ (0, j.jsx)("small", { children: "gemeinsamer Contract für beide Geräte" })] }), /* @__PURE__ */ (0, j.jsx)(F, {
								resetToken: x,
								value: O("ducked_target"),
								onDraft: (e) => E("ducked_target", e)
							})] }), /* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Track Boost ", /* @__PURE__ */ (0, j.jsx)("small", { children: "nur HomePods" })] }), /* @__PURE__ */ (0, j.jsx)(F, {
								resetToken: x,
								offset: !0,
								value: O("boost_offset"),
								onDraft: (e) => E("boost_offset", e)
							})] })]
						}), /* @__PURE__ */ (0, j.jsxs)("div", {
							className: "rule-notes",
							children: [
								/* @__PURE__ */ (0, j.jsxs)("p", { children: [/* @__PURE__ */ (0, j.jsx)(P, {
									tone: "orange",
									children: "Hard-Override"
								}), " Quiet setzt aktive Ausgaben direkt auf das Ducking-Ziel innerhalb der wirksamen Geräteobergrenze."] }),
								/* @__PURE__ */ (0, j.jsxs)("p", { children: [/* @__PURE__ */ (0, j.jsx)(P, {
									tone: "violet",
									children: "Boost-Block"
								}), " Blockiert bei Arbeit zuhause, Arbeit außer Haus, Quiet Mode und fehlender Phasenfreigabe."] }),
								/* @__PURE__ */ (0, j.jsxs)("p", { children: [/* @__PURE__ */ (0, j.jsx)(P, {
									tone: "orange",
									children: "Hard-Mute"
								}), " HomePods-Classifier „Stumm“ setzt die HomePods unabhängig von der Matrix auf 0."] }),
								/* @__PURE__ */ (0, j.jsx)("p", {
									className: "contract-warning",
									children: "Der Contract hat nur einen gemeinsamen Ducking-Wert. Getrennte HomePods-/Denon-Werte fehlen."
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, j.jsxs)(N, {
						title: "Caps & Grenzen",
						action: /* @__PURE__ */ (0, j.jsx)(wt, {
							label: "Caps & Grenzen",
							supported: !1
						}),
						children: [
							/* @__PURE__ */ (0, j.jsxs)("div", {
								className: "device-scalar-head",
								children: [/* @__PURE__ */ (0, j.jsx)("b", { children: "HomePods" }), /* @__PURE__ */ (0, j.jsx)("b", { children: "Denon" })]
							}),
							/* @__PURE__ */ (0, j.jsxs)("div", {
								className: "paired-values",
								children: [
									/* @__PURE__ */ (0, j.jsx)("span", { children: "Maximalpegel" }),
									/* @__PURE__ */ (0, j.jsx)(F, {
										resetToken: x,
										value: O("homepods_max"),
										onDraft: (e) => E("homepods_max", e)
									}),
									/* @__PURE__ */ (0, j.jsx)(F, {
										resetToken: x,
										value: O("denon_max"),
										onDraft: (e) => E("denon_max", e)
									}),
									/* @__PURE__ */ (0, j.jsx)("span", { children: "Aktiv-Mindestpegel" }),
									/* @__PURE__ */ (0, j.jsx)(F, {
										resetToken: x,
										value: O("active_min"),
										onDraft: (e) => E("active_min", e)
									}),
									/* @__PURE__ */ (0, j.jsx)(F, {
										value: O("active_min"),
										disabled: !0
									})
								]
							}),
							/* @__PURE__ */ (0, j.jsx)("p", {
								className: "muted-copy",
								children: "Der Mindestpegel ist ein gemeinsamer Policy-Wert. Caps greifen nach additiver Matrix und Nudge; Hard-Overrides bleiben dominant."
							})
						]
					})
				]
			}),
			o === "delays" && /* @__PURE__ */ (0, j.jsxs)("div", {
				className: "delay-grid",
				children: [
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "Sleep",
						action: /* @__PURE__ */ (0, j.jsx)(wt, {
							label: "Sleep",
							supported: !1
						}),
						children: /* @__PURE__ */ (0, j.jsxs)("div", {
							className: "key-values rule-values",
							children: [
								/* @__PURE__ */ (0, j.jsxs)("span", { children: ["HomePods im Sleep", /* @__PURE__ */ (0, j.jsx)("b", { children: /* @__PURE__ */ (0, j.jsx)(P, {
									tone: "orange",
									children: "Aus · Hard-Override"
								}) })] }),
								/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Denon-Sleep-Ziel", /* @__PURE__ */ (0, j.jsx)(Ct, { missing: "R25 fordert einen eigenen Denon-Sleep-Zielwert; Policy-Property und Berechnung fehlen." })] }),
								/* @__PURE__ */ (0, j.jsxs)("span", { children: ["TV automatisch aus", /* @__PURE__ */ (0, j.jsx)(Ct, {
									value: t.sleep_tv?.delay_s,
									unit: " s"
								})] }),
								/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Warn-Vorlauf", /* @__PURE__ */ (0, j.jsx)(Ct, {
									value: t.sleep_tv?.warn_lead_s,
									unit: " s"
								})] })
							]
						})
					}),
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "Denon-Nachlauf & Private Exit",
						action: /* @__PURE__ */ (0, j.jsx)(wt, {
							label: "Nachlauf & Private Exit",
							supported: !1
						}),
						children: /* @__PURE__ */ (0, j.jsxs)("div", {
							className: "key-values rule-values",
							children: [
								/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Nachlauf PC", /* @__PURE__ */ (0, j.jsx)(Ct, { missing: "Option denon_nachlauf_pc_seconds existiert, wird aber im Apply-Status nicht als konfigurierter Wert veröffentlicht." })] }),
								/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Nachlauf TV", /* @__PURE__ */ (0, j.jsx)(Ct, { missing: "Option denon_nachlauf_tv_seconds existiert, wird aber im Apply-Status nicht als konfigurierter Wert veröffentlicht." })] }),
								/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Private-Time-Exit", /* @__PURE__ */ (0, j.jsx)(Ct, {
									value: t.private_exit?.delay_s,
									unit: " s",
									missing: "Option private_exit_delay_seconds existiert, wird aber im Apply-Status nicht veröffentlicht."
								})] }),
								/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Timer aktuell aktiv", /* @__PURE__ */ (0, j.jsx)(Ct, { value: !!t.nachlauf?.active })] })
							]
						})
					}),
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "HomePods-Ramp",
						action: /* @__PURE__ */ (0, j.jsx)(wt, {
							label: "HomePods-Ramp",
							supported: !1
						}),
						children: /* @__PURE__ */ (0, j.jsxs)("div", {
							className: "key-values rule-values",
							children: [
								/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Ramp-Schritte", /* @__PURE__ */ (0, j.jsx)(Ct, { value: t.settings?.ramp_steps })] }),
								/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Ramp-Intervall", /* @__PURE__ */ (0, j.jsx)(Ct, {
									value: t.settings?.ramp_step_delay_s,
									unit: " s"
								})] }),
								/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Tiny Delta", /* @__PURE__ */ (0, j.jsx)(Ct, { value: t.settings?.tiny_delta == null ? null : `${Math.round(Number(t.settings.tiny_delta) * 100)} %` })] }),
								/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Ramp aktuell", /* @__PURE__ */ (0, j.jsx)(Ct, { value: !!t.ramp_active })] })
							]
						})
					}),
					/* @__PURE__ */ (0, j.jsxs)(N, {
						className: "waking-card",
						title: "Waking",
						action: /* @__PURE__ */ (0, j.jsx)(wt, {
							label: "Waking",
							supported: !1
						}),
						children: [
							/* @__PURE__ */ (0, j.jsxs)("div", {
								className: "waking-formula",
								children: [
									/* @__PURE__ */ (0, j.jsx)("span", { children: "Tagesphasen-Basis HomePods" }),
									/* @__PURE__ */ (0, j.jsx)("b", { children: "+" }),
									/* @__PURE__ */ (0, j.jsx)("span", {
										className: "missing-field",
										children: "Waking-Offset: Contract fehlt"
									}),
									/* @__PURE__ */ (0, j.jsx)("b", { children: "=" }),
									/* @__PURE__ */ (0, j.jsx)("span", { children: "Ergebnis auf 0–100 % begrenzen" })
								]
							}),
							/* @__PURE__ */ (0, j.jsxs)("p", { children: [
								"Der neue Offset gilt ausschließlich für HomePods bei ",
								/* @__PURE__ */ (0, j.jsx)("code", { children: "bio_state=waking" }),
								". Denon bleibt unberührt. Die Startlautstärke der Wake-Rampe ist davon getrennt."
							] }),
							/* @__PURE__ */ (0, j.jsxs)("div", {
								className: "key-values rule-values",
								children: [
									/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Benötigte Property", /* @__PURE__ */ (0, j.jsx)("b", { children: /* @__PURE__ */ (0, j.jsx)("code", { children: "waking_homepods_offset" }) })] }),
									/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Wake-Startlautstärke", /* @__PURE__ */ (0, j.jsx)(Ct, { value: t.wake?.start_volume == null ? null : `${Math.round(Number(t.wake.start_volume) * 100)} %` })] }),
									/* @__PURE__ */ (0, j.jsxs)("span", { children: ["Wake-Debounce", /* @__PURE__ */ (0, j.jsx)(Ct, {
										value: t.wake?.debounce_s,
										unit: " s"
									})] })
								]
							}),
							/* @__PURE__ */ (0, j.jsx)("div", {
								className: "contract-warning",
								children: "Das Eingabefeld bleibt deaktiviert, bis Policy-Persistenz, `get_matrix.scalars`, `set_scalars` und die Berechnung nach der Tagesphasen-Basis vorhanden sind."
							})
						]
					}),
					/* @__PURE__ */ (0, j.jsx)(N, { children: /* @__PURE__ */ (0, j.jsx)(Ie, {
						icon: M.LockKeyhole,
						title: "Apply-Werte nur lesbar",
						text: "Apply-Delays, Sleep und Wake sind im Options-Flow konfigurierbar, besitzen aber keine persistente Umbrella-Schreib- oder Reset-API. Fehlende Snapshot-Werte werden nicht durch Defaults vorgetäuscht."
					}) })
				]
			})
		]
	});
}
//#endregion
//#region frontend-src/src/pages/DiagnosticsPage.tsx
function Ot({ data: e }) {
	let [t, n] = (0, h.useState)("state"), r = e.state?.data || {}, i = e.policy?.data || {}, a = e.apply?.data || {}, o = e.diagnostics?.data || {};
	return /* @__PURE__ */ (0, j.jsxs)("div", {
		className: "diagnostics-page",
		children: [
			/* @__PURE__ */ (0, j.jsx)("div", {
				className: "diag-tabs",
				children: [
					["state", "Zustand"],
					["policy", "Entscheidung"],
					["apply", "Apply & Queue"],
					["bindings", "Bindings"],
					["logs", "Logs"],
					["raw", "Raw JSON"]
				].map(([e, r]) => /* @__PURE__ */ (0, j.jsx)(Ye, {
					active: t === e,
					onClick: () => n(e),
					children: r
				}, e))
			}),
			t === "state" && /* @__PURE__ */ (0, j.jsxs)("div", {
				className: "diag-grid",
				children: [
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "Zustandserkennung",
						children: /* @__PURE__ */ (0, j.jsx)(kt, { data: {
							Szenario: r.context || r.media_scenario,
							Subkontext: r.subcontext,
							Gerät: r.device,
							"Gaming-Quelle": r.gaming_source,
							Plattform: r.gaming_platform,
							"Entertainment aktiv": r.entertainment_active,
							"Headset aktiv": r.headset_active
						} })
					}),
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "Core-State-Kontext",
						children: /* @__PURE__ */ (0, j.jsx)(kt, { data: r.context_cards || {} })
					}),
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "Aktive Gründe",
						children: /* @__PURE__ */ (0, j.jsx)(At, { values: r.active_reasons || [] })
					}),
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "Classifier",
						children: /* @__PURE__ */ (0, j.jsx)(kt, { data: Object.fromEntries(Object.entries(r.classifiers || {}).map(([e, t]) => [e, `${t.enum ?? "—"} · ${t.label || "—"}`])) })
					})
				]
			}),
			t === "policy" && /* @__PURE__ */ (0, j.jsxs)("div", {
				className: "diag-grid",
				children: [
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "Decision Engine",
						children: /* @__PURE__ */ (0, j.jsx)(kt, { data: {
							"Audio Owner": i.audio_owner,
							Szenario: i.audio_scenario_label,
							Detail: i.audio_scenario_detail,
							Aktion: i.action,
							"Volume Policy": i.volume_policy,
							HomePods: Oe(i.volume_target_homepods),
							Denon: Oe(i.volume_target_denon),
							"Subwoofer erlaubt": i.subwoofer_allowed
						} })
					}),
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "Why-Stack",
						children: /* @__PURE__ */ (0, j.jsx)("div", {
							className: "diag-list",
							children: (i.reasons || []).map((e, t) => /* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)(P, {
								tone: e.severity === "warn" ? "orange" : "green",
								children: e.severity || "ok"
							}), /* @__PURE__ */ (0, j.jsx)("span", { children: e.text })] }, t))
						})
					}),
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "Nudge / Boost",
						children: /* @__PURE__ */ (0, j.jsx)(kt, { data: i.nudge || {} })
					}),
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "Volume-Formel",
						children: /* @__PURE__ */ (0, j.jsx)("pre", { children: JSON.stringify(i.volume_formula || {}, null, 2) })
					})
				]
			}),
			t === "apply" && /* @__PURE__ */ (0, j.jsxs)("div", {
				className: "diag-grid",
				children: [
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "Gate",
						children: /* @__PURE__ */ (0, j.jsx)(kt, { data: a.gates || {} })
					}),
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "Queue / Debounce",
						children: /* @__PURE__ */ (0, j.jsx)(kt, { data: a.debounce || {} })
					}),
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "Nächster Plan",
						children: /* @__PURE__ */ (0, j.jsx)(kt, { data: a.plan || {} })
					}),
					/* @__PURE__ */ (0, j.jsx)(N, {
						title: "Nachlauf",
						children: /* @__PURE__ */ (0, j.jsx)(kt, { data: a.nachlauf || {} })
					})
				]
			}),
			t === "bindings" && /* @__PURE__ */ (0, j.jsxs)("div", {
				className: "binding-grid",
				children: [Object.entries(o.bindings || {}).map(([e, t]) => /* @__PURE__ */ (0, j.jsx)(N, {
					title: `Bindings · ${A(e)}`,
					children: /* @__PURE__ */ (0, j.jsx)("div", {
						className: "bindings",
						children: t.map((e) => /* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsxs)("span", { children: [e.key, /* @__PURE__ */ (0, j.jsx)("small", { children: e.entity_id || "nicht gebunden" })] }), /* @__PURE__ */ (0, j.jsx)(P, {
							tone: e.status === "bound" ? "green" : e.status === "unavailable" ? "orange" : "neutral",
							children: e.status
						})] }, e.key))
					})
				}, e)), !Object.keys(o.bindings || {}).length && /* @__PURE__ */ (0, j.jsx)(N, { children: /* @__PURE__ */ (0, j.jsx)(Ie, {
					title: "Keine Binding-Daten",
					text: "Diagnostics liefert derzeit keine Bindings."
				}) })]
			}),
			t === "logs" && /* @__PURE__ */ (0, j.jsx)(N, {
				title: "Apply-Log",
				children: /* @__PURE__ */ (0, j.jsx)("div", {
					className: "action-log technical",
					children: (a.log || []).map((e, t) => /* @__PURE__ */ (0, j.jsxs)("div", { children: [
						/* @__PURE__ */ (0, j.jsx)("time", { children: Ae(e.ts) }),
						/* @__PURE__ */ (0, j.jsx)(M.Activity, { size: 16 }),
						/* @__PURE__ */ (0, j.jsxs)("span", { children: [
							e.action || "—",
							" · HP ",
							Oe(e.homepods_target),
							" · Denon ",
							Oe(e.denon_target)
						] }),
						/* @__PURE__ */ (0, j.jsx)(P, {
							tone: e.executed ? "green" : "orange",
							children: e.executed ? "live" : "shadow"
						})
					] }, t))
				})
			}),
			t === "raw" && /* @__PURE__ */ (0, j.jsx)(N, {
				title: "Raw JSON",
				action: /* @__PURE__ */ (0, j.jsx)("button", {
					className: "button",
					onClick: () => void navigator.clipboard?.writeText(JSON.stringify(Pe({
						state: r,
						policy: i,
						apply: a,
						diagnostics: o
					}), null, 2)),
					children: "JSON kopieren"
				}),
				children: /* @__PURE__ */ (0, j.jsx)("pre", {
					className: "raw-json",
					children: JSON.stringify(Pe({
						state: r,
						policy: i,
						apply: a,
						diagnostics: o
					}), null, 2)
				})
			})
		]
	});
}
function kt({ data: e }) {
	let t = Object.entries(e).filter(([, e]) => e !== void 0);
	return t.length ? /* @__PURE__ */ (0, j.jsx)("div", {
		className: "key-values",
		children: t.map(([e, t]) => /* @__PURE__ */ (0, j.jsxs)("span", { children: [A(e), /* @__PURE__ */ (0, j.jsx)("b", { children: typeof t == "object" ? JSON.stringify(t) : typeof t == "boolean" ? t ? "Ja" : "Nein" : String(t ?? "—") })] }, e))
	}) : /* @__PURE__ */ (0, j.jsx)(Ie, {
		compact: !0,
		title: "Keine Daten",
		text: "Dieser Snapshot-Bereich ist leer."
	});
}
function At({ values: e }) {
	return e.length ? /* @__PURE__ */ (0, j.jsx)("div", {
		className: "diag-list",
		children: e.map((e) => /* @__PURE__ */ (0, j.jsxs)("div", { children: [/* @__PURE__ */ (0, j.jsx)(M.ChevronRight, { size: 16 }), /* @__PURE__ */ (0, j.jsx)("span", { children: e })] }, e))
	}) : /* @__PURE__ */ (0, j.jsx)(Ie, {
		compact: !0,
		title: "Keine Einträge",
		text: "Aktuell sind keine Gründe aktiv."
	});
}
//#endregion
//#region frontend-src/src/App.tsx
var jt = () => {
	let e = window.location.hash.replace("#", "");
	return [
		"overview",
		"music",
		"gaming",
		"tv",
		"rules",
		"diagnostics"
	].includes(e) ? e : "overview";
}, Mt = (e) => !e || window.confirm("Es gibt ungespeicherte Änderungen. Seite wirklich verlassen?"), Nt = (e) => ({
	state: e.state?.data ?? e.overview?.data?.raw?.state ?? {},
	policy: e.policy?.data ?? e.overview?.data?.raw?.policy ?? {},
	apply: e.apply?.data ?? e.overview?.data?.raw?.apply ?? {}
});
function Pt({ hass: e }) {
	let [t, n] = (0, h.useState)(jt()), [r, i] = (0, h.useState)(!1), { data: a, setData: o, loading: s, error: c, refresh: l } = ct(e), u = (e) => {
		e !== t && !Mt(r) || n(e);
	}, d = (e) => o((t) => ({
		...t,
		matrix: e
	})), { state: f, policy: p, apply: m } = Nt(a), g;
	return g = s && !a.overview ? /* @__PURE__ */ (0, j.jsx)(N, { children: /* @__PURE__ */ (0, j.jsxs)("div", {
		className: "loading",
		children: [/* @__PURE__ */ (0, j.jsx)(M.RefreshCw, { className: "spin" }), /* @__PURE__ */ (0, j.jsx)("span", { children: "Media-Cockpit wird geladen …" })]
	}) }) : c && !a.overview ? /* @__PURE__ */ (0, j.jsx)(N, { children: /* @__PURE__ */ (0, j.jsx)(Ie, {
		icon: M.AlertTriangle,
		title: "Cockpit nicht erreichbar",
		text: c
	}) }) : t === "overview" ? /* @__PURE__ */ (0, j.jsx)(ft, {
		data: a.overview?.data,
		hass: e,
		onChanged: () => void l(!0)
	}) : t === "music" ? /* @__PURE__ */ (0, j.jsx)(pt, {
		state: f,
		policy: p,
		apply: m,
		hass: e,
		onChanged: () => void l(!0)
	}) : t === "gaming" ? /* @__PURE__ */ (0, j.jsx)(mt, {
		state: f,
		policy: p
	}) : t === "tv" ? /* @__PURE__ */ (0, j.jsx)(ht, {
		state: f,
		policy: p
	}) : t === "rules" ? /* @__PURE__ */ (0, j.jsx)(Dt, {
		matrix: a.matrix,
		apply: m,
		state: f,
		hass: e,
		onMatrix: d,
		onDirtyChange: i
	}) : /* @__PURE__ */ (0, j.jsx)(Ot, { data: a }), /* @__PURE__ */ (0, j.jsx)(Ze, {
		page: t,
		onPage: u,
		updatedAt: a.overview?.updated_at,
		modulesHealth: a.overview?.modules || a.state?.modules,
		onRefresh: () => void l(),
		refreshing: s,
		children: g
	});
}
//#endregion
//#region frontend-src/src/styles.css?inline
var Ft = ":host,#demo{--bg:#0d1018;--bg2:#121722;--panel:#171c29;--panel2:#1d2332;--line:#2b3242;--text:#eef0f8;--muted:#949caf;--violet:#a879ff;--pink:#ff5d9e;--cyan:#5db8ff;--green:#8bd450;--orange:#ffa337;--red:#ff5e6c;color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-size:14px}*{box-sizing:border-box}button,input{font:inherit}button{color:inherit}code{color:var(--cyan)}.app-shell{background:radial-gradient(circle at 45% -10%,#20263a 0,transparent 35%),var(--bg);grid-template-rows:56px minmax(calc(100vh - 92px),1fr) 36px;grid-template-columns:216px minmax(0,1fr);min-height:100vh;display:grid}.topbar{-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);z-index:20;background:#0c1019e6;border-bottom:1px solid #242a38;grid-column:1/-1;grid-template-columns:216px minmax(500px,1fr) auto;align-items:center;display:grid;position:sticky;top:0}.brand{border-right:1px solid #202632;align-items:center;gap:12px;height:100%;padding:0 20px;font-weight:650;display:flex}.brand-mark{color:#fff;background:linear-gradient(145deg,#287bd7,#5ed0ff);border-radius:7px;place-items:center;width:25px;height:25px;display:grid;box-shadow:0 0 22px #287bd744}.module-nav{justify-content:center;gap:8px;height:100%;display:flex}.module-nav button{color:#b0b6c8;cursor:pointer;background:0 0;border:0;justify-content:center;align-items:center;gap:9px;min-width:105px;height:100%;display:flex;position:relative}.module-nav button.active{color:#c69cff}.module-nav button.active:after{content:\"\";background:var(--violet);height:2px;box-shadow:0 0 14px var(--violet);position:absolute;bottom:0;left:15px;right:15px}.module-nav button:disabled{opacity:.7;cursor:not-allowed}.top-status{border-left:1px solid #242a38;align-items:center;gap:10px;height:65%;padding:0 18px;display:flex}.top-status>svg{color:#a8afc1;margin-right:5px}.top-status div:last-child{flex-direction:column;display:flex}.top-status small{color:var(--muted);font-size:10px}.avatar{color:#20242d;background:linear-gradient(135deg,#f3d0b0,#6f8db5);border:2px solid #d9dbe3;border-radius:50%;place-items:center;width:29px;height:29px;font-weight:800;display:grid}.mobile-menu{background:0 0;border:0;display:none}.sidebar{background:linear-gradient(#101520 0%,#0c1018 100%);border-right:1px solid #202632;flex-direction:column;grid-row:2;padding:20px 12px;display:flex}.sidebar-title{color:#81899a;text-transform:uppercase;letter-spacing:.08em;padding:0 9px 10px;font-size:11px}.sidebar-title button{display:none}.sidebar nav{flex-direction:column;gap:5px;display:flex}.sidebar nav button{text-align:left;color:#b9bfd0;cursor:pointer;background:0 0;border:1px solid #0000;border-radius:8px;align-items:center;gap:12px;padding:12px 11px;display:flex}.sidebar nav button.active{color:#d7c0ff;background:linear-gradient(90deg,#29233e,#24283a);border-color:#312c49}.sidebar nav button:hover{background:#1b2130}.sidebar-health{border:1px solid var(--line);color:var(--muted);text-transform:capitalize;background:#151b27;border-radius:9px;grid-template-columns:1fr 1fr;gap:9px;margin-top:auto;padding:12px;font-size:11px;display:grid}.sidebar-health>span{text-transform:uppercase;letter-spacing:.08em;grid-column:1/-1;font-size:10px}.sidebar-health div{align-items:center;gap:6px;display:flex}.status-dot{background:#667;border-radius:50%;width:8px;height:8px;display:inline-block}.status-dot.good{background:var(--green);box-shadow:0 0 8px #8bd45088}.status-dot.warn{background:var(--orange)}.status-dot.bad{background:var(--red)}main{grid-area:2/2;min-width:0;overflow:hidden}.page-header{background:#12172273;border-bottom:1px solid #272d3a;justify-content:space-between;align-items:center;min-height:96px;padding:18px 26px;display:flex}.page-header h1{margin:0 0 4px;font-size:22px}.page-header p{color:var(--muted);margin:0}.page-meta{color:var(--muted);text-align:right;align-items:center;gap:18px;font-size:11px;display:flex}.page-meta b{color:#b8bfce;font-weight:500}.page-meta button{border:1px solid var(--line);cursor:pointer;background:#1c2230;border-radius:8px;place-items:center;width:39px;height:39px;display:grid}.page-content{max-width:1560px;margin:auto;padding:20px 25px 26px}.section-heading{align-items:center;gap:9px;margin-bottom:10px;display:flex}.section-heading h2{margin:0;font-size:16px}footer{color:#7f879a;background:#0e131d;border-top:1px solid #252b38;grid-column:1/-1;justify-content:space-between;align-items:center;padding:0 20px;font-size:11px;display:flex}footer span{align-items:center;gap:7px;display:flex}.card{border:1px solid var(--line);background:linear-gradient(145deg,#1c2230eb,#121722f0);border-radius:10px;min-width:0;padding:15px;box-shadow:inset 0 1px #ffffff05,0 10px 30px #00000014}.card-head{justify-content:space-between;align-items:center;margin-bottom:13px;display:flex}.card h2{margin:0;font-size:15px}.card h3{margin:18px 0 8px;font-size:13px}.pill{color:#bbc1d0;background:#2a3040;border:1px solid #353d50;border-radius:999px;align-items:center;gap:5px;padding:3px 8px;font-size:10px;display:inline-flex}.pill.green{color:var(--green);background:#1b2a1e;border-color:#2c492d}.pill.pink{color:var(--pink);background:#2b1c27;border-color:#503046}.pill.cyan{color:var(--cyan);background:#182936;border-color:#29475d}.pill.orange{color:var(--orange);background:#2c2519;border-color:#504124}.pill.violet{color:#bd96ff;background:#292139;border-color:#43335e}.empty{text-align:left;color:#697184;justify-content:center;align-items:center;gap:13px;min-height:140px;display:flex}.empty svg{color:#596175}.empty strong{color:#aab1c1;margin-bottom:3px;display:block}.empty p{max-width:360px;margin:0;font-size:12px;line-height:1.5}.empty.compact{justify-content:flex-start;min-height:56px}.empty.compact strong{font-size:12px}.empty.compact p{font-size:11px}.overview-hero{grid-template-columns:minmax(0,2fr) minmax(270px,.95fr);gap:12px;display:grid}.session-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;display:grid}.media-card{border-color:#384153;position:relative;overflow:hidden}.media-card.music.active{background:linear-gradient(145deg,#411c309e,#1a1a27f5);border-color:#9a3d68}.media-card.gaming.active{background:linear-gradient(145deg,#1c2e45bf,#171c28f5);border-color:#3f70a0}.media-card.tv.active{background:linear-gradient(145deg,#18373fb3,#161c28f2);border-color:#3d7989}.media-card-main{gap:15px;display:flex}.artwork{color:#81899b;background:linear-gradient(135deg,#252a3a,#151a25);border:1px solid #343c4e;border-radius:9px;flex-direction:column;flex:none;justify-content:center;align-items:center;gap:7px;width:118px;height:126px;font-size:10px;display:flex;overflow:hidden}.artwork.music{color:#f98abd;background:linear-gradient(135deg,#713151,#261b31)}.artwork.gaming{color:#76bdff;background:linear-gradient(135deg,#244f78,#1d273a)}.artwork.tv{color:#77d4e6;background:linear-gradient(135deg,#235763,#192a34)}.artwork img{object-fit:cover;width:100%;height:100%}.media-copy{min-width:0;padding-top:2px}.eyebrow{color:var(--cyan);align-items:center;gap:7px;font-size:12px;font-weight:650;display:flex}.music .eyebrow{color:var(--pink)}.eyebrow svg{width:17px}.media-copy h3{text-overflow:ellipsis;margin:16px 0 8px;font-size:18px;overflow:hidden}.media-copy p{color:#afb6c8;margin:0 0 12px;font-size:14px}.session-detail{color:var(--green);font-size:12px}.output-row{background:#080c1359;border:1px solid #323949;border-radius:8px;align-items:center;gap:10px;margin-top:13px;padding:10px 12px;display:flex}.output-row>div{flex-direction:column;min-width:0;display:flex}.output-row span{color:#aab1c2;font-size:11px}.output-row strong{color:var(--green);font-size:10px;font-weight:500}.output-row>b{white-space:nowrap;margin-left:auto;font-size:22px}.output-row .button{margin-left:6px;padding:6px 8px}.reason-list{flex-direction:column;gap:9px;display:flex}.reason-item{color:#b9bfce;align-items:flex-start;gap:9px;font-size:12px;line-height:1.35;display:flex}.reason-item svg{color:var(--violet);flex:none}.reason-item.warn svg{color:var(--orange)}.reason.compact{padding:16px}.reason.compact .card-head{margin-bottom:17px}.dashboard-grid{gap:12px;margin-top:12px;display:grid}.dashboard-grid.volumes{grid-template-columns:repeat(2,minmax(0,1fr))}.volume-breakdown.pink{--accent:var(--pink)}.volume-breakdown.cyan{--accent:var(--cyan)}.formula-compact{color:#838b9e;flex-wrap:wrap;align-items:center;gap:7px;margin-bottom:13px;font-size:11px;display:flex}.formula-compact span:not(:first-child):before{content:\" + \";color:#666f82}.formula-compact span.negative:before{content:\" − \";color:var(--orange)}.formula-compact span.positive{color:var(--green)}.formula-compact span.negative{color:var(--orange)}.formula-compact strong{color:var(--accent);margin-left:auto;font-size:20px}.formula-grid{grid-template-columns:repeat(7,minmax(56px,1fr));gap:0;display:grid}.formula-grid div{border-left:1px solid #303747;flex-direction:column;gap:4px;padding:0 9px;display:flex}.formula-grid div:first-child{border:0;padding-left:0}.formula-grid span{color:#81899a;font-size:10px}.formula-grid b{font-size:13px}.volume-meter{background:#2b303f;border-radius:4px;height:4px;margin-top:14px}.volume-meter i{background:var(--accent);height:100%;box-shadow:0 0 9px color-mix(in srgb,var(--accent) 55%,transparent);border-radius:4px;display:block}.dashboard-grid.lower{grid-template-columns:minmax(0,1.6fr) minmax(320px,1fr) minmax(290px,.9fr)}.button-row{flex-wrap:wrap;gap:7px;display:flex}.button{cursor:pointer;color:#c4cad8;background:#222938;border:1px solid #343c4e;border-radius:7px;justify-content:center;align-items:center;gap:7px;padding:9px 11px;font-size:12px;display:inline-flex}.button:hover:not(:disabled),.button.active{color:#d5baff;background:#322942;border-color:#6b5293}.button:disabled{opacity:.48;cursor:not-allowed}.button.danger{color:#ff9a83}.radio-row{flex-wrap:wrap;gap:8px;display:flex}.radio-row>button{color:#ff78ab;cursor:pointer;background:#29202c;border:1px solid #3e3344;border-radius:7px;align-items:center;gap:8px;padding:10px 12px;display:flex}.device-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;display:grid}.device-tile{color:#697184;background:#202633;border:1px solid #293141;border-radius:8px;align-items:center;gap:9px;padding:9px;display:flex}.device-tile.active{color:#aab2c4}.device-tile div{flex-direction:column;min-width:0;display:flex}.device-tile span{white-space:nowrap;text-overflow:ellipsis;font-size:10px;overflow:hidden}.device-tile strong{color:#7a8396;font-size:10px;font-weight:500}.device-tile.active strong{color:var(--green)}.action-log{flex-direction:column;gap:8px;display:flex}.action-log>div{color:#a9b0c1;grid-template-columns:58px 16px 1fr auto;align-items:center;gap:7px;font-size:11px;display:grid}.action-log time{color:#687185}.action-log svg{color:var(--violet)}.decision-strip{border:1px solid var(--line);background:#151a25;border-radius:9px;grid-template-columns:repeat(4,1fr);margin-top:12px;display:grid;overflow:hidden}.decision-strip div{border-left:1px solid var(--line);flex-direction:column;gap:3px;padding:11px 15px;display:flex}.decision-strip div:first-child{border:0}.decision-strip span,.kpi-label{color:#777f91;text-transform:uppercase;letter-spacing:.05em;font-size:10px}.decision-strip strong{color:#bdc3d2;font-size:12px}.music-layout{grid-template-columns:minmax(0,1fr) 310px;gap:12px;display:grid}.music-main,.music-aside{flex-direction:column;gap:12px;display:flex}.now-playing-wide .media-card-main{align-items:center}.now-playing-wide .artwork{width:160px;height:160px}.now-playing-wide .media-copy h3{font-size:25px}.radio-cards{grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;display:grid}.radio-cards button{text-align:left;cursor:pointer;background:#241e2a;border:1px solid #373344;border-radius:8px;grid-template-rows:auto auto;grid-template-columns:46px 1fr auto;align-items:center;gap:2px 10px;padding:9px;display:grid}.radio-cards .radio-art{width:46px;height:46px;color:var(--pink);background:linear-gradient(135deg,#7a2f57,#34203c);border-radius:7px;grid-row:1/3;place-items:center;display:grid}.radio-cards b{font-size:12px}.radio-cards small{color:#7e8799}.radio-cards>button>svg{color:var(--pink);grid-area:1/3/3}.search-box{background:#111621;border:1px solid #343c4d;border-radius:8px;align-items:center;gap:10px;padding:5px 6px 5px 12px;display:flex}.search-box input{color:var(--text);background:0 0;border:0;outline:none;flex:1}.search-box button,.search-results button{color:#d6b6ff;cursor:pointer;background:#312540;border:1px solid #4c3a68;border-radius:6px;padding:8px 12px}.search-results{flex-direction:column;gap:7px;margin-top:10px;display:flex}.search-results>div{background:#1b2130;border-radius:7px;align-items:center;gap:10px;padding:7px;display:flex}.search-results img,.search-results>div>svg{object-fit:cover;border-radius:5px;width:38px;height:38px}.search-results div div{flex-direction:column;flex:1;display:flex}.search-results small{color:var(--muted)}.search-results button{align-items:center;gap:6px;display:flex}.library-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;display:grid}.key-values{flex-direction:column;display:flex}.key-values>span{color:#848c9e;border-top:1px solid #2c3342;justify-content:space-between;gap:15px;padding:9px 0;font-size:11px;display:flex}.key-values>span:first-child{border:0}.key-values b{color:#c1c7d5;text-align:right;overflow-wrap:anywhere;font-weight:550}.gaming-hero,.tv-hero{grid-template-columns:minmax(0,1.65fr) minmax(310px,1fr);gap:12px;display:grid}.gaming-kpis{grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:12px;display:grid}.gaming-kpis .card{flex-direction:column;gap:7px;display:flex}.gaming-kpis strong{font-size:16px}.gaming-kpis .pill{align-self:flex-start}.gaming-kpis small{color:var(--muted)}.gaming-bottom,.tv-status{grid-template-columns:repeat(2,minmax(0,1fr))}.classifier-panel{grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:12px;display:grid}.classifier-panel div{background:#1b2130;border-radius:7px;flex-direction:column;gap:5px;padding:10px;display:flex}.classifier-panel svg{color:var(--violet)}.classifier-panel span{color:var(--muted);font-size:10px}.classifier-panel b{font-size:12px}.edit-disabled{width:100%}.tv-page>.volume-breakdown{margin-top:12px}.rules-tabs,.diag-tabs{gap:7px;margin-bottom:12px;display:flex}.rules-tabs>span{flex:1}.rules-page.busy{opacity:.8}.rule-section{margin-bottom:12px;padding:0;overflow:hidden}.rule-title{border-bottom:1px solid var(--line);background:#1b2130;grid-template-columns:36px 1fr 270px;align-items:center;padding:13px 16px;display:grid}.rule-title>span{color:#c9a9ff;background:#33284a;border-radius:50%;place-items:center;width:25px;height:25px;font-size:11px;display:grid}.rule-title h2{margin:0;font-size:14px}.rule-title p{color:var(--muted);margin:3px 0 0;font-size:10px}.rule-device-head{text-align:center;color:#aeb5c5;grid-template-columns:repeat(2,1fr);font-size:11px;display:grid}.rule-device-head b:first-child{color:var(--pink)}.rule-device-head b:last-child{color:var(--cyan)}.rule-row{border-top:1px solid #252c3a;grid-template-columns:minmax(180px,1fr) 135px 135px;align-items:center;min-height:48px;padding:6px 16px;display:grid}.rule-row:first-child{border:0}.rule-row>span{font-size:12px}.percent-input{background:#111620;border:1px solid #353d4e;border-radius:6px;justify-self:center;align-items:center;width:94px;display:flex;overflow:hidden}.percent-input.overridden{box-shadow:inset 2px 0 var(--violet);border-color:#7554a4}.percent-input input{color:#d8dbe4;text-align:right;background:0 0;border:0;outline:none;width:66px;padding:7px}.percent-input span{color:#70798b;padding-right:7px}.scalar-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;display:grid}.scalar-list>div{border-top:1px solid #2d3443;justify-content:space-between;align-items:center;padding:8px 0;display:flex}.scalar-list>div:first-child{border:0}.scalar-list>div>span{font-size:12px}.muted-copy{color:var(--muted);line-height:1.6}.reset-explainer{color:#858da0;align-items:center;gap:7px;margin:-3px 0 12px;font-size:11px;display:flex}.rule-title{grid-template-columns:36px minmax(260px,1fr) auto}.rule-title-actions{justify-content:flex-end;align-items:center;gap:8px;display:flex}.rule-device-head{grid-column:3;min-width:270px;margin-top:8px}.rule-help{vertical-align:middle;color:#798397;cursor:help;display:inline-flex}.section-reset{padding:6px 8px;font-size:10px}.percent-input.readonly{opacity:.65}.percent-input input:disabled{cursor:not-allowed}.rule-row>span{align-items:center;gap:7px;display:flex}.span-devices{text-align:center;color:var(--orange);grid-column:2/4}.hard-rule{background:#261f19}.mode-stack{flex-direction:column;gap:12px;display:flex}.fixed-rule-grid,.private-paths{grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;padding:15px;display:grid}.fixed-rule-grid>div,.private-paths>div{background:#171d29;border:1px solid #303849;border-radius:8px;flex-direction:column;gap:6px;padding:12px;display:flex}.fixed-rule-grid span,.private-paths span{color:var(--muted);font-size:11px;line-height:1.45}.fixed-rule-grid .pill,.private-paths .pill{align-self:flex-start}.safety-grid,.delay-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;display:grid}.private-card{grid-column:1/-1}.private-paths{grid-template-columns:repeat(2,1fr);margin-bottom:12px;padding:0}.hard-rule-banner{color:var(--orange);background:#2b2118;border:1px solid #60452b;border-radius:8px;align-items:center;gap:10px;padding:12px;display:flex}.hard-rule-banner div{flex-direction:column;gap:3px;display:flex}.hard-rule-banner span{color:#baa98f;font-size:11px}.private-values{grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px;display:grid}.private-values>div{background:#171d29;border-radius:7px;flex-direction:column;gap:7px;padding:10px;display:flex}.private-values span,.device-scalar-head{color:var(--muted);font-size:10px}.private-values strong{font-size:12px}.scalar-list.detailed small{color:var(--muted);margin-top:3px;display:block}.rule-notes{border-top:1px solid var(--line);margin-top:12px;padding-top:8px}.rule-notes p{color:#aeb5c5;align-items:center;gap:7px;font-size:11px;display:flex}.contract-warning{background:#2b2418;border:1px solid #634b25;border-radius:7px;padding:9px;font-size:11px;line-height:1.5;color:#e8ad53!important}.device-scalar-head{text-align:center;grid-template-columns:1fr 1fr;margin-left:35%;display:grid}.device-scalar-head b:first-child{color:var(--pink)}.device-scalar-head b:last-child{color:var(--cyan)}.paired-values{grid-template-columns:minmax(130px,1fr) 105px 105px;align-items:center;gap:8px;display:grid}.paired-values>span{font-size:11px}.contract-missing{color:var(--orange);cursor:help;background:#30271b;border-radius:6px;padding:4px 7px;font-size:10px;display:inline-flex}.read-value{color:#c8cedb;font-size:12px}.rule-values>span{align-items:center}.rule-values>span>b,.rule-values>span>.read-value,.rule-values>span>.contract-missing{margin-left:auto}.waking-card{grid-column:1/-1}.waking-formula{text-align:center;background:#151b27;border:1px solid #31394a;border-radius:8px;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;gap:10px;padding:12px;display:grid}.waking-formula b{color:var(--violet)}.waking-formula span{background:#1e2533;border-radius:6px;padding:9px}.waking-formula .missing-field{color:var(--orange);background:#282117;border:1px dashed #765529}.waking-card>p{color:var(--muted);font-size:12px;line-height:1.55}.delay-grid>.card:last-child{grid-column:1/-1}.diagnostics-page pre{color:#9ab8da;background:#0d121b;border:1px solid #282f3d;border-radius:7px;margin:0;padding:12px;font-size:11px;line-height:1.5;overflow:auto}.diag-grid,.binding-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;display:grid}.diag-list{flex-direction:column;gap:8px;display:flex}.diag-list>div{color:#aeb5c4;align-items:center;gap:9px;font-size:12px;display:flex}.bindings>div{border-top:1px solid #2b3241;justify-content:space-between;align-items:center;padding:8px 0;display:flex}.bindings>div:first-child{border:0}.bindings span{flex-direction:column;font-size:12px;display:flex}.bindings small{color:#737c90;margin-top:3px;font-size:10px}.raw-json{max-height:65vh}.technical>div{grid-template-columns:70px 16px 1fr auto}.loading{min-height:280px;color:var(--muted);justify-content:center;align-items:center;gap:12px;display:flex}.spin{animation:1s linear infinite spin}@keyframes spin{to{transform:rotate(360deg)}}.scrim{display:none}@media (width<=1180px){.module-nav{gap:0}.module-nav button{min-width:88px}.module-nav button span{font-size:12px}.topbar{grid-template-columns:190px 1fr auto}.app-shell{grid-template-columns:190px minmax(0,1fr)}.brand{padding-left:14px}.sidebar{padding-left:9px;padding-right:9px}.overview-hero,.gaming-hero,.tv-hero{grid-template-columns:1fr}.dashboard-grid.lower{grid-template-columns:1fr 1fr}.quick-control{grid-column:1/-1}.formula-grid{grid-template-columns:repeat(4,1fr);row-gap:12px}.music-layout{grid-template-columns:1fr}.music-aside{grid-template-columns:repeat(2,1fr);display:grid}.gaming-kpis{grid-template-columns:repeat(2,1fr)}}@media (width<=900px){.app-shell{min-height:100vh;padding-top:56px;padding-bottom:36px;display:block}.topbar{height:56px;display:flex;position:fixed;top:0;left:0;right:0}.brand{border:0;flex:1}.module-nav,.top-status{display:none}.mobile-menu{place-items:center;margin-right:12px;display:grid}.sidebar{z-index:50;width:245px;transition:transform .2s;position:fixed;top:56px;bottom:0;left:0;transform:translate(-100%)}.sidebar.open{transform:translate(0)}.sidebar-title{justify-content:space-between;align-items:center;display:flex}.sidebar-title button{background:0 0;border:0;display:grid}.scrim{z-index:40;background:#03050aaa;border:0;display:block;position:fixed;inset:56px 0 0}main{display:block}.page-header{padding:15px 18px}.page-content{padding:16px}.page-meta>span{display:none}footer{z-index:20;height:36px;position:fixed;bottom:0;left:0;right:0}footer span:first-child,footer span:last-child{display:none}.session-grid,.dashboard-grid.volumes,.dashboard-grid.lower,.gaming-bottom,.tv-status,.library-grid,.scalar-grid,.diag-grid,.binding-grid,.music-aside{grid-template-columns:1fr}.radio-cards,.device-grid,.decision-strip{grid-template-columns:repeat(2,1fr)}.gaming-kpis{grid-template-columns:1fr 1fr}.classifier-panel{grid-template-columns:1fr}.rule-title{grid-template-columns:35px 1fr}.rule-device-head{display:none}.rule-row{grid-template-columns:minmax(150px,1fr) 100px 100px;padding:6px 10px}.rules-tabs,.diag-tabs{overflow:auto}.rules-tabs .button,.diag-tabs .button{white-space:nowrap}}@media (width<=600px){.session-grid,.gaming-kpis{grid-template-columns:1fr}.media-card-main{align-items:center}.artwork{width:94px;height:104px}.media-copy h3{margin-top:10px;font-size:16px}.formula-grid{grid-template-columns:repeat(2,1fr)}.radio-cards,.decision-strip{grid-template-columns:1fr}.decision-strip div{border-left:0;border-top:1px solid var(--line)}.page-header h1{font-size:19px}.rule-row{grid-template-columns:1fr 82px 82px}.percent-input{width:75px}.percent-input input{width:52px}.now-playing-wide .artwork{width:110px;height:110px}.now-playing-wide .media-copy h3{font-size:19px}}@media (width<=1100px){.safety-grid,.delay-grid{grid-template-columns:1fr}.private-card,.waking-card,.delay-grid>.card:last-child{grid-column:auto}.private-values{grid-template-columns:repeat(2,1fr)}.rules-tabs>span{display:none}.rules-tabs{flex-wrap:wrap}}@media (width<=900px){.rule-title{grid-template-columns:35px 1fr}.rule-title-actions{grid-column:2;justify-content:flex-start;margin-top:8px}.rule-device-head{display:none}.fixed-rule-grid,.waking-formula{grid-template-columns:1fr}.waking-formula b{transform:rotate(90deg)}.private-paths{grid-template-columns:1fr}}@media (width<=600px){.private-values{grid-template-columns:1fr}.paired-values{grid-template-columns:1fr 80px 80px}.rules-tabs .button.danger{width:100%}.reset-explainer{align-items:flex-start}}.rules-page .rule-row{min-height:39px;padding-top:4px;padding-bottom:4px}.rules-page .rule-title{padding-top:9px;padding-bottom:9px}.rules-page .percent-input input{padding-top:5px;padding-bottom:5px}.phase-rules{overflow-x:auto}.phase-rules table{border-collapse:collapse;width:100%;min-width:640px}.phase-rules th,.phase-rules td{text-align:center;border-bottom:1px solid var(--line);padding:6px 8px}.phase-rules th:first-child{text-align:left;padding-left:16px}.phase-rules .percent-input{margin-inline:auto}.phase-boost{cursor:pointer;place-items:center;width:44px;min-height:44px;margin-inline:auto;display:grid}.phase-rules input[type=checkbox]{width:18px;height:18px;accent-color:var(--cyan)}.phase-rules input:focus-visible{outline:2px solid var(--cyan);outline-offset:-2px}.rules-page{padding-bottom:82px}.rules-save-bar{z-index:25;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);background:#171d29ee;border:1px solid #394255;border-radius:10px;justify-content:space-between;align-items:center;gap:16px;margin:14px 0;padding:12px 14px;display:flex;position:sticky;top:8px;box-shadow:0 10px 28px #05070dbb}.rules-save-bar>div{flex-direction:column;gap:3px;display:flex}.rules-save-bar b{font-size:13px}.rules-save-bar span{color:var(--muted);font-size:10px}.rules-save-bar.idle b{color:var(--orange)}.rules-save-bar.saving b{color:var(--cyan)}.rules-save-bar.saved b{color:var(--green)}.rules-save-bar.error{border-color:#763b48}.rules-save-bar.error b,.rules-save-bar.error span{color:#ff7185}.rules-save-actions{flex-wrap:wrap;justify-content:flex-end;flex-direction:row!important;display:flex!important}.rules-save-bar .button{justify-content:center;min-width:0}.effect-badges{flex-wrap:wrap;gap:6px;margin:7px 0;display:flex}.radio-row button img{object-fit:cover;border-radius:6px;width:28px;height:28px}.radio-row button.playing{border-color:var(--green);box-shadow:inset 0 0 0 1px #50fa7b33}.radio-row button small{color:var(--green);text-transform:uppercase;font-size:9px;display:block}.artwork.gaming img{object-fit:contain;object-position:center}.radio-station-grid{grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;display:grid}.radio-station{border:1px solid var(--line);background:var(--panel);border-radius:8px;min-width:0;padding:12px}.radio-station>b{align-items:center;gap:8px;margin-bottom:8px;display:flex}.radio-provider-buttons{gap:4px;display:flex}.radio-shortcuts button{border:1px solid var(--line);background:var(--panel2);min-height:44px;color:var(--text);cursor:pointer;border-radius:8px;padding:6px 8px}.radio-provider-buttons button{flex:1;min-width:0;font-size:12px}.radio-provider-buttons small{color:var(--muted);font-size:10px;display:block}.radio-shortcuts button:disabled{opacity:.55;cursor:not-allowed}.radio-shortcuts button:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}.radio-shortcuts [role=alert]{color:var(--orange)}.radio-shortcuts [role=status]{color:var(--muted)}", It = class extends HTMLElement {
	root;
	appHost;
	_hass;
	set hass(e) {
		this._hass = e, this.renderApp();
	}
	get hass() {
		return this._hass;
	}
	connectedCallback() {
		if (!this.shadowRoot) {
			let e = this.attachShadow({ mode: "open" }), t = document.createElement("style");
			t.textContent = Ft, e.append(t), this.appHost = document.createElement("div"), e.append(this.appHost);
		}
		this.renderApp();
	}
	disconnectedCallback() {
		this.root?.unmount(), this.root = void 0;
	}
	renderApp() {
		let e = this._hass;
		!this.isConnected || !e || !this.appHost || (this.root ||= (0, De.createRoot)(this.appHost), this.root.render(/* @__PURE__ */ (0, j.jsx)(Pt, { hass: e })));
	}
};
customElements.get("benni-media-app") || customElements.define("benni-media-app", It);
//#endregion
