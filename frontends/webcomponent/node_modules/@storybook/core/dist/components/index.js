var r7 = Object.create;
var si = Object.defineProperty;
var n7 = Object.getOwnPropertyDescriptor;
var o7 = Object.getOwnPropertyNames;
var a7 = Object.getPrototypeOf, i7 = Object.prototype.hasOwnProperty;
var a = (e, t) => si(e, "name", { value: t, configurable: !0 }), sa = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy <
"u" ? new Proxy(e, {
  get: (t, r) => (typeof require < "u" ? require : t)[r]
}) : e)(function(e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
});
var S = (e, t) => () => (e && (t = e(e = 0)), t);
var M = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), gn = (e, t) => {
  for (var r in t)
    si(e, r, { get: t[r], enumerable: !0 });
}, l7 = (e, t, r, n) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let o of o7(t))
      !i7.call(e, o) && o !== r && si(e, o, { get: () => t[o], enumerable: !(n = n7(t, o)) || n.enumerable });
  return e;
};
var Ce = (e, t, r) => (r = e != null ? r7(a7(e)) : {}, l7(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  t || !e || !e.__esModule ? si(r, "default", { value: e, enumerable: !0 }) : r,
  e
));

// ../node_modules/@babel/runtime/helpers/esm/extends.js
function ve() {
  return ve = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }, ve.apply(null, arguments);
}
var ua = S(() => {
  a(ve, "_extends");
});

// ../node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function bp(e) {
  if (e === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
var yp = S(() => {
  a(bp, "_assertThisInitialized");
});

// ../node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function tr(e, t) {
  return tr = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(r, n) {
    return r.__proto__ = n, r;
  }, tr(e, t);
}
var ui = S(() => {
  a(tr, "_setPrototypeOf");
});

// ../node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function ci(e) {
  return ci = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, ci(e);
}
var xp = S(() => {
  a(ci, "_getPrototypeOf");
});

// ../node_modules/@storybook/global/dist/index.mjs
var vn, fi = S(() => {
  vn = (() => {
    let e;
    return typeof window < "u" ? e = window : typeof globalThis < "u" ? e = globalThis : typeof global < "u" ? e = global : typeof self < "u" ?
    e = self : e = {}, e;
  })();
});

// ../node_modules/memoizerific/memoizerific.js
var da = M((Tp, Cs) => {
  (function(e) {
    if (typeof Tp == "object" && typeof Cs < "u")
      Cs.exports = e();
    else if (typeof define == "function" && define.amd)
      define([], e);
    else {
      var t;
      typeof window < "u" ? t = window : typeof global < "u" ? t = global : typeof self < "u" ? t = self : t = this, t.memoizerific = e();
    }
  })(function() {
    var e, t, r;
    return (/* @__PURE__ */ a(function n(o, i, l) {
      function u(d, h) {
        if (!i[d]) {
          if (!o[d]) {
            var f = typeof sa == "function" && sa;
            if (!h && f) return f(d, !0);
            if (c) return c(d, !0);
            var g = new Error("Cannot find module '" + d + "'");
            throw g.code = "MODULE_NOT_FOUND", g;
          }
          var w = i[d] = { exports: {} };
          o[d][0].call(w.exports, function(m) {
            var v = o[d][1][m];
            return u(v || m);
          }, w, w.exports, n, o, i, l);
        }
        return i[d].exports;
      }
      a(u, "s");
      for (var c = typeof sa == "function" && sa, p = 0; p < l.length; p++) u(l[p]);
      return u;
    }, "e"))({ 1: [function(n, o, i) {
      o.exports = function(l) {
        if (typeof Map != "function" || l) {
          var u = n("./similar");
          return new u();
        } else
          return /* @__PURE__ */ new Map();
      };
    }, { "./similar": 2 }], 2: [function(n, o, i) {
      function l() {
        return this.list = [], this.lastItem = void 0, this.size = 0, this;
      }
      a(l, "Similar"), l.prototype.get = function(u) {
        var c;
        if (this.lastItem && this.isEqual(this.lastItem.key, u))
          return this.lastItem.val;
        if (c = this.indexOf(u), c >= 0)
          return this.lastItem = this.list[c], this.list[c].val;
      }, l.prototype.set = function(u, c) {
        var p;
        return this.lastItem && this.isEqual(this.lastItem.key, u) ? (this.lastItem.val = c, this) : (p = this.indexOf(u), p >= 0 ? (this.lastItem =
        this.list[p], this.list[p].val = c, this) : (this.lastItem = { key: u, val: c }, this.list.push(this.lastItem), this.size++, this));
      }, l.prototype.delete = function(u) {
        var c;
        if (this.lastItem && this.isEqual(this.lastItem.key, u) && (this.lastItem = void 0), c = this.indexOf(u), c >= 0)
          return this.size--, this.list.splice(c, 1)[0];
      }, l.prototype.has = function(u) {
        var c;
        return this.lastItem && this.isEqual(this.lastItem.key, u) ? !0 : (c = this.indexOf(u), c >= 0 ? (this.lastItem = this.list[c], !0) :
        !1);
      }, l.prototype.forEach = function(u, c) {
        var p;
        for (p = 0; p < this.size; p++)
          u.call(c || this, this.list[p].val, this.list[p].key, this);
      }, l.prototype.indexOf = function(u) {
        var c;
        for (c = 0; c < this.size; c++)
          if (this.isEqual(this.list[c].key, u))
            return c;
        return -1;
      }, l.prototype.isEqual = function(u, c) {
        return u === c || u !== u && c !== c;
      }, o.exports = l;
    }, {}], 3: [function(n, o, i) {
      var l = n("map-or-similar");
      o.exports = function(d) {
        var h = new l(!1), f = [];
        return function(g) {
          var w = /* @__PURE__ */ a(function() {
            var m = h, v, y, b = arguments.length - 1, D = Array(b + 1), x = !0, C;
            if ((w.numArgs || w.numArgs === 0) && w.numArgs !== b + 1)
              throw new Error("Memoizerific functions should always be called with the same number of arguments");
            for (C = 0; C < b; C++) {
              if (D[C] = {
                cacheItem: m,
                arg: arguments[C]
              }, m.has(arguments[C])) {
                m = m.get(arguments[C]);
                continue;
              }
              x = !1, v = new l(!1), m.set(arguments[C], v), m = v;
            }
            return x && (m.has(arguments[b]) ? y = m.get(arguments[b]) : x = !1), x || (y = g.apply(null, arguments), m.set(arguments[b], y)),
            d > 0 && (D[b] = {
              cacheItem: m,
              arg: arguments[b]
            }, x ? u(f, D) : f.push(D), f.length > d && c(f.shift())), w.wasMemoized = x, w.numArgs = b + 1, y;
          }, "memoizerific");
          return w.limit = d, w.wasMemoized = !1, w.cache = h, w.lru = f, w;
        };
      };
      function u(d, h) {
        var f = d.length, g = h.length, w, m, v;
        for (m = 0; m < f; m++) {
          for (w = !0, v = 0; v < g; v++)
            if (!p(d[m][v].arg, h[v].arg)) {
              w = !1;
              break;
            }
          if (w)
            break;
        }
        d.push(d.splice(m, 1)[0]);
      }
      a(u, "moveToMostRecentLru");
      function c(d) {
        var h = d.length, f = d[h - 1], g, w;
        for (f.cacheItem.delete(f.arg), w = h - 2; w >= 0 && (f = d[w], g = f.cacheItem.get(f.arg), !g || !g.size); w--)
          f.cacheItem.delete(f.arg);
      }
      a(c, "removeCachedResult");
      function p(d, h) {
        return d === h || d !== d && h !== h;
      }
      a(p, "isEqual");
    }, { "map-or-similar": 1 }] }, {}, [3])(3);
  });
});

// ../node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function wn(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e) if ({}.hasOwnProperty.call(e, n)) {
    if (t.indexOf(n) >= 0) continue;
    r[n] = e[n];
  }
  return r;
}
var hi = S(() => {
  a(wn, "_objectWithoutPropertiesLoose");
});

// ../node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js
function Ip(e, t) {
  if (e == null) return {};
  var r, n, o = wn(e, t);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e);
    for (n = 0; n < i.length; n++) r = i[n], t.indexOf(r) >= 0 || {}.propertyIsEnumerable.call(e, r) && (o[r] = e[r]);
  }
  return o;
}
var Bp = S(() => {
  hi();
  a(Ip, "_objectWithoutProperties");
});

// ../node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function fa(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
  return n;
}
var Es = S(() => {
  a(fa, "_arrayLikeToArray");
});

// ../node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js
function Mp(e) {
  if (Array.isArray(e)) return fa(e);
}
var _p = S(() => {
  Es();
  a(Mp, "_arrayWithoutHoles");
});

// ../node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function Pp(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
var Hp = S(() => {
  a(Pp, "_iterableToArray");
});

// ../node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
function zp(e, t) {
  if (e) {
    if (typeof e == "string") return fa(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.
    test(r) ? fa(e, t) : void 0;
  }
}
var Op = S(() => {
  Es();
  a(zp, "_unsupportedIterableToArray");
});

// ../node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function Np() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
var $p = S(() => {
  a(Np, "_nonIterableSpread");
});

// ../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js
function Vp(e) {
  return Mp(e) || Pp(e) || zp(e) || Np();
}
var jp = S(() => {
  _p();
  Hp();
  Op();
  $p();
  a(Vp, "_toConsumableArray");
});

// ../node_modules/@babel/runtime/helpers/esm/typeof.js
function Fr(e) {
  "@babel/helpers - typeof";
  return Fr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Fr(e);
}
var Rs = S(() => {
  a(Fr, "_typeof");
});

// ../node_modules/@babel/runtime/helpers/esm/toPrimitive.js
function Wp(e, t) {
  if (Fr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t || "default");
    if (Fr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var qp = S(() => {
  Rs();
  a(Wp, "toPrimitive");
});

// ../node_modules/@babel/runtime/helpers/esm/toPropertyKey.js
function Up(e) {
  var t = Wp(e, "string");
  return Fr(t) == "symbol" ? t : t + "";
}
var Gp = S(() => {
  Rs();
  qp();
  a(Up, "toPropertyKey");
});

// ../node_modules/@babel/runtime/helpers/esm/defineProperty.js
function mi(e, t, r) {
  return (t = Up(t)) in e ? Object.defineProperty(e, t, {
    value: r,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = r, e;
}
var Ss = S(() => {
  Gp();
  a(mi, "_defineProperty");
});

// ../node_modules/react-syntax-highlighter/dist/esm/create-element.js
import z7 from "react";
function Yp(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function bn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Yp(Object(r), !0).forEach(function(n) {
      mi(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Yp(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function O7(e) {
  var t = e.length;
  if (t === 0 || t === 1) return e;
  if (t === 2)
    return [e[0], e[1], "".concat(e[0], ".").concat(e[1]), "".concat(e[1], ".").concat(e[0])];
  if (t === 3)
    return [e[0], e[1], e[2], "".concat(e[0], ".").concat(e[1]), "".concat(e[0], ".").concat(e[2]), "".concat(e[1], ".").concat(e[0]), "".concat(
    e[1], ".").concat(e[2]), "".concat(e[2], ".").concat(e[0]), "".concat(e[2], ".").concat(e[1]), "".concat(e[0], ".").concat(e[1], ".").concat(
    e[2]), "".concat(e[0], ".").concat(e[2], ".").concat(e[1]), "".concat(e[1], ".").concat(e[0], ".").concat(e[2]), "".concat(e[1], ".").concat(
    e[2], ".").concat(e[0]), "".concat(e[2], ".").concat(e[0], ".").concat(e[1]), "".concat(e[2], ".").concat(e[1], ".").concat(e[0])];
  if (t >= 4)
    return [e[0], e[1], e[2], e[3], "".concat(e[0], ".").concat(e[1]), "".concat(e[0], ".").concat(e[2]), "".concat(e[0], ".").concat(e[3]),
    "".concat(e[1], ".").concat(e[0]), "".concat(e[1], ".").concat(e[2]), "".concat(e[1], ".").concat(e[3]), "".concat(e[2], ".").concat(e[0]),
    "".concat(e[2], ".").concat(e[1]), "".concat(e[2], ".").concat(e[3]), "".concat(e[3], ".").concat(e[0]), "".concat(e[3], ".").concat(e[1]),
    "".concat(e[3], ".").concat(e[2]), "".concat(e[0], ".").concat(e[1], ".").concat(e[2]), "".concat(e[0], ".").concat(e[1], ".").concat(e[3]),
    "".concat(e[0], ".").concat(e[2], ".").concat(e[1]), "".concat(e[0], ".").concat(e[2], ".").concat(e[3]), "".concat(e[0], ".").concat(e[3],
    ".").concat(e[1]), "".concat(e[0], ".").concat(e[3], ".").concat(e[2]), "".concat(e[1], ".").concat(e[0], ".").concat(e[2]), "".concat(e[1],
    ".").concat(e[0], ".").concat(e[3]), "".concat(e[1], ".").concat(e[2], ".").concat(e[0]), "".concat(e[1], ".").concat(e[2], ".").concat(
    e[3]), "".concat(e[1], ".").concat(e[3], ".").concat(e[0]), "".concat(e[1], ".").concat(e[3], ".").concat(e[2]), "".concat(e[2], ".").concat(
    e[0], ".").concat(e[1]), "".concat(e[2], ".").concat(e[0], ".").concat(e[3]), "".concat(e[2], ".").concat(e[1], ".").concat(e[0]), "".concat(
    e[2], ".").concat(e[1], ".").concat(e[3]), "".concat(e[2], ".").concat(e[3], ".").concat(e[0]), "".concat(e[2], ".").concat(e[3], ".").concat(
    e[1]), "".concat(e[3], ".").concat(e[0], ".").concat(e[1]), "".concat(e[3], ".").concat(e[0], ".").concat(e[2]), "".concat(e[3], ".").concat(
    e[1], ".").concat(e[0]), "".concat(e[3], ".").concat(e[1], ".").concat(e[2]), "".concat(e[3], ".").concat(e[2], ".").concat(e[0]), "".concat(
    e[3], ".").concat(e[2], ".").concat(e[1]), "".concat(e[0], ".").concat(e[1], ".").concat(e[2], ".").concat(e[3]), "".concat(e[0], ".").concat(
    e[1], ".").concat(e[3], ".").concat(e[2]), "".concat(e[0], ".").concat(e[2], ".").concat(e[1], ".").concat(e[3]), "".concat(e[0], ".").concat(
    e[2], ".").concat(e[3], ".").concat(e[1]), "".concat(e[0], ".").concat(e[3], ".").concat(e[1], ".").concat(e[2]), "".concat(e[0], ".").concat(
    e[3], ".").concat(e[2], ".").concat(e[1]), "".concat(e[1], ".").concat(e[0], ".").concat(e[2], ".").concat(e[3]), "".concat(e[1], ".").concat(
    e[0], ".").concat(e[3], ".").concat(e[2]), "".concat(e[1], ".").concat(e[2], ".").concat(e[0], ".").concat(e[3]), "".concat(e[1], ".").concat(
    e[2], ".").concat(e[3], ".").concat(e[0]), "".concat(e[1], ".").concat(e[3], ".").concat(e[0], ".").concat(e[2]), "".concat(e[1], ".").concat(
    e[3], ".").concat(e[2], ".").concat(e[0]), "".concat(e[2], ".").concat(e[0], ".").concat(e[1], ".").concat(e[3]), "".concat(e[2], ".").concat(
    e[0], ".").concat(e[3], ".").concat(e[1]), "".concat(e[2], ".").concat(e[1], ".").concat(e[0], ".").concat(e[3]), "".concat(e[2], ".").concat(
    e[1], ".").concat(e[3], ".").concat(e[0]), "".concat(e[2], ".").concat(e[3], ".").concat(e[0], ".").concat(e[1]), "".concat(e[2], ".").concat(
    e[3], ".").concat(e[1], ".").concat(e[0]), "".concat(e[3], ".").concat(e[0], ".").concat(e[1], ".").concat(e[2]), "".concat(e[3], ".").concat(
    e[0], ".").concat(e[2], ".").concat(e[1]), "".concat(e[3], ".").concat(e[1], ".").concat(e[0], ".").concat(e[2]), "".concat(e[3], ".").concat(
    e[1], ".").concat(e[2], ".").concat(e[0]), "".concat(e[3], ".").concat(e[2], ".").concat(e[0], ".").concat(e[1]), "".concat(e[3], ".").concat(
    e[2], ".").concat(e[1], ".").concat(e[0])];
}
function N7(e) {
  if (e.length === 0 || e.length === 1) return e;
  var t = e.join(".");
  return As[t] || (As[t] = O7(e)), As[t];
}
function $7(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 ? arguments[2] : void 0, n = e.filter(
  function(i) {
    return i !== "token";
  }), o = N7(n);
  return o.reduce(function(i, l) {
    return bn(bn({}, i), r[l]);
  }, t);
}
function Xp(e) {
  return e.join(" ");
}
function V7(e, t) {
  var r = 0;
  return function(n) {
    return r += 1, n.map(function(o, i) {
      return kr({
        node: o,
        stylesheet: e,
        useInlineStyles: t,
        key: "code-segment-".concat(r, "-").concat(i)
      });
    });
  };
}
function kr(e) {
  var t = e.node, r = e.stylesheet, n = e.style, o = n === void 0 ? {} : n, i = e.useInlineStyles, l = e.key, u = t.properties, c = t.type, p = t.
  tagName, d = t.value;
  if (c === "text")
    return d;
  if (p) {
    var h = V7(r, i), f;
    if (!i)
      f = bn(bn({}, u), {}, {
        className: Xp(u.className)
      });
    else {
      var g = Object.keys(r).reduce(function(y, b) {
        return b.split(".").forEach(function(D) {
          y.includes(D) || y.push(D);
        }), y;
      }, []), w = u.className && u.className.includes("token") ? ["token"] : [], m = u.className && w.concat(u.className.filter(function(y) {
        return !g.includes(y);
      }));
      f = bn(bn({}, u), {}, {
        className: Xp(m) || void 0,
        style: $7(u.className, Object.assign({}, u.style, o), r)
      });
    }
    var v = h(t.children);
    return /* @__PURE__ */ z7.createElement(p, ve({
      key: l
    }, f), v);
  }
}
var As, Fs = S(() => {
  ua();
  Ss();
  a(Yp, "ownKeys");
  a(bn, "_objectSpread");
  a(O7, "powerSetPermutations");
  As = {};
  a(N7, "getClassNameCombinations");
  a($7, "createStyleObject");
  a(Xp, "createClassNameString");
  a(V7, "createChildren");
  a(kr, "createElement");
});

// ../node_modules/react-syntax-highlighter/dist/esm/checkForListedLanguage.js
var Zp, Kp = S(() => {
  Zp = /* @__PURE__ */ a(function(e, t) {
    var r = e.listLanguages();
    return r.indexOf(t) !== -1;
  }, "default");
});

// ../node_modules/react-syntax-highlighter/dist/esm/highlight.js
import Lr from "react";
function Jp(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    t && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Et(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Jp(Object(r), !0).forEach(function(n) {
      mi(e, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Jp(Object(r)).forEach(function(n) {
      Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return e;
}
function q7(e) {
  return e.match(W7);
}
function U7(e) {
  var t = e.lines, r = e.startingLineNumber, n = e.style;
  return t.map(function(o, i) {
    var l = i + r;
    return /* @__PURE__ */ Lr.createElement("span", {
      key: "line-".concat(i),
      className: "react-syntax-highlighter-line-number",
      style: typeof n == "function" ? n(l) : n
    }, "".concat(l, `
`));
  });
}
function G7(e) {
  var t = e.codeString, r = e.codeStyle, n = e.containerStyle, o = n === void 0 ? {
    float: "left",
    paddingRight: "10px"
  } : n, i = e.numberStyle, l = i === void 0 ? {} : i, u = e.startingLineNumber;
  return /* @__PURE__ */ Lr.createElement("code", {
    style: Object.assign({}, r, o)
  }, U7({
    lines: t.replace(/\n$/, "").split(`
`),
    style: l,
    startingLineNumber: u
  }));
}
function Y7(e) {
  return "".concat(e.toString().length, ".25em");
}
function Qp(e, t) {
  return {
    type: "element",
    tagName: "span",
    properties: {
      key: "line-number--".concat(e),
      className: ["comment", "linenumber", "react-syntax-highlighter-line-number"],
      style: t
    },
    children: [{
      type: "text",
      value: e
    }]
  };
}
function ed(e, t, r) {
  var n = {
    display: "inline-block",
    minWidth: Y7(r),
    paddingRight: "1em",
    textAlign: "right",
    userSelect: "none"
  }, o = typeof e == "function" ? e(t) : e, i = Et(Et({}, n), o);
  return i;
}
function gi(e) {
  var t = e.children, r = e.lineNumber, n = e.lineNumberStyle, o = e.largestLineNumber, i = e.showInlineLineNumbers, l = e.lineProps, u = l ===
  void 0 ? {} : l, c = e.className, p = c === void 0 ? [] : c, d = e.showLineNumbers, h = e.wrapLongLines, f = typeof u == "function" ? u(r) :
  u;
  if (f.className = p, r && i) {
    var g = ed(n, r, o);
    t.unshift(Qp(r, g));
  }
  return h & d && (f.style = Et(Et({}, f.style), {}, {
    display: "flex"
  })), {
    type: "element",
    tagName: "span",
    properties: f,
    children: t
  };
}
function td(e) {
  for (var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] :
  [], n = 0; n < e.length; n++) {
    var o = e[n];
    if (o.type === "text")
      r.push(gi({
        children: [o],
        className: Vp(new Set(t))
      }));
    else if (o.children) {
      var i = t.concat(o.properties.className);
      td(o.children, i).forEach(function(l) {
        return r.push(l);
      });
    }
  }
  return r;
}
function X7(e, t, r, n, o, i, l, u, c) {
  var p, d = td(e.value), h = [], f = -1, g = 0;
  function w(C, E) {
    var R = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    return gi({
      children: C,
      lineNumber: E,
      lineNumberStyle: u,
      largestLineNumber: l,
      showInlineLineNumbers: o,
      lineProps: r,
      className: R,
      showLineNumbers: n,
      wrapLongLines: c
    });
  }
  a(w, "createWrappedLine");
  function m(C, E) {
    if (n && E && o) {
      var R = ed(u, E, l);
      C.unshift(Qp(E, R));
    }
    return C;
  }
  a(m, "createUnwrappedLine");
  function v(C, E) {
    var R = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    return t || R.length > 0 ? w(C, E, R) : m(C, E);
  }
  a(v, "createLine");
  for (var y = /* @__PURE__ */ a(function() {
    var E = d[g], R = E.children[0].value, F = q7(R);
    if (F) {
      var A = R.split(`
`);
      A.forEach(function(k, B) {
        var j = n && h.length + i, V = {
          type: "text",
          value: "".concat(k, `
`)
        };
        if (B === 0) {
          var ee = d.slice(f + 1, g).concat(gi({
            children: [V],
            className: E.properties.className
          })), I = v(ee, j);
          h.push(I);
        } else if (B === A.length - 1) {
          var T = d[g + 1] && d[g + 1].children && d[g + 1].children[0], P = {
            type: "text",
            value: "".concat(k)
          };
          if (T) {
            var q = gi({
              children: [P],
              className: E.properties.className
            });
            d.splice(g + 1, 0, q);
          } else {
            var $ = [P], U = v($, j, E.properties.className);
            h.push(U);
          }
        } else {
          var H = [V], X = v(H, j, E.properties.className);
          h.push(X);
        }
      }), f = g;
    }
    g++;
  }, "_loop"); g < d.length; )
    y();
  if (f !== d.length - 1) {
    var b = d.slice(f + 1, d.length);
    if (b && b.length) {
      var D = n && h.length + i, x = v(b, D);
      h.push(x);
    }
  }
  return t ? h : (p = []).concat.apply(p, h);
}
function Z7(e) {
  var t = e.rows, r = e.stylesheet, n = e.useInlineStyles;
  return t.map(function(o, i) {
    return kr({
      node: o,
      stylesheet: r,
      useInlineStyles: n,
      key: "code-segement".concat(i)
    });
  });
}
function rd(e) {
  return e && typeof e.highlightAuto < "u";
}
function K7(e) {
  var t = e.astGenerator, r = e.language, n = e.code, o = e.defaultCodeValue;
  if (rd(t)) {
    var i = Zp(t, r);
    return r === "text" ? {
      value: o,
      language: "text"
    } : i ? t.highlight(r, n) : t.highlightAuto(n);
  }
  try {
    return r && r !== "text" ? {
      value: t.highlight(n, r)
    } : {
      value: o
    };
  } catch {
    return {
      value: o
    };
  }
}
function ks(e, t) {
  return /* @__PURE__ */ a(function(n) {
    var o = n.language, i = n.children, l = n.style, u = l === void 0 ? t : l, c = n.customStyle, p = c === void 0 ? {} : c, d = n.codeTagProps,
    h = d === void 0 ? {
      className: o ? "language-".concat(o) : void 0,
      style: Et(Et({}, u['code[class*="language-"]']), u['code[class*="language-'.concat(o, '"]')])
    } : d, f = n.useInlineStyles, g = f === void 0 ? !0 : f, w = n.showLineNumbers, m = w === void 0 ? !1 : w, v = n.showInlineLineNumbers, y = v ===
    void 0 ? !0 : v, b = n.startingLineNumber, D = b === void 0 ? 1 : b, x = n.lineNumberContainerStyle, C = n.lineNumberStyle, E = C === void 0 ?
    {} : C, R = n.wrapLines, F = n.wrapLongLines, A = F === void 0 ? !1 : F, k = n.lineProps, B = k === void 0 ? {} : k, j = n.renderer, V = n.
    PreTag, ee = V === void 0 ? "pre" : V, I = n.CodeTag, T = I === void 0 ? "code" : I, P = n.code, q = P === void 0 ? (Array.isArray(i) ? i[0] :
    i) || "" : P, $ = n.astGenerator, U = Ip(n, j7);
    $ = $ || e;
    var H = m ? /* @__PURE__ */ Lr.createElement(G7, {
      containerStyle: x,
      codeStyle: h.style || {},
      numberStyle: E,
      startingLineNumber: D,
      codeString: q
    }) : null, X = u.hljs || u['pre[class*="language-"]'] || {
      backgroundColor: "#fff"
    }, _e = rd($) ? "hljs" : "prismjs", xe = g ? Object.assign({}, U, {
      style: Object.assign({}, X, p)
    }) : Object.assign({}, U, {
      className: U.className ? "".concat(_e, " ").concat(U.className) : _e,
      style: Object.assign({}, p)
    });
    if (A ? h.style = Et(Et({}, h.style), {}, {
      whiteSpace: "pre-wrap"
    }) : h.style = Et(Et({}, h.style), {}, {
      whiteSpace: "pre"
    }), !$)
      return /* @__PURE__ */ Lr.createElement(ee, xe, H, /* @__PURE__ */ Lr.createElement(T, h, q));
    (R === void 0 && j || A) && (R = !0), j = j || Z7;
    var ge = [{
      type: "text",
      value: q
    }], Ae = K7({
      astGenerator: $,
      language: o,
      code: q,
      defaultCodeValue: ge
    });
    Ae.language === null && (Ae.value = ge);
    var Pe = Ae.value.length + D, He = X7(Ae, R, B, m, y, D, Pe, E, A);
    return /* @__PURE__ */ Lr.createElement(ee, xe, /* @__PURE__ */ Lr.createElement(T, h, !y && H, j({
      rows: He,
      stylesheet: u,
      useInlineStyles: g
    })));
  }, "SyntaxHighlighter");
}
var j7, W7, nd = S(() => {
  Bp();
  jp();
  Ss();
  Fs();
  Kp();
  j7 = ["language", "children", "style", "customStyle", "codeTagProps", "useInlineStyles", "showLineNumbers", "showInlineLineNumbers", "star\
tingLineNumber", "lineNumberContainerStyle", "lineNumberStyle", "wrapLines", "wrapLongLines", "lineProps", "renderer", "PreTag", "CodeTag", "\
code", "astGenerator"];
  a(Jp, "ownKeys");
  a(Et, "_objectSpread");
  W7 = /\n/g;
  a(q7, "getNewLines");
  a(U7, "getAllLineNumbers");
  a(G7, "AllLineNumbers");
  a(Y7, "getEmWidthOfNumber");
  a(Qp, "getInlineLineNumber");
  a(ed, "assembleLineNumberStyles");
  a(gi, "createLineElement");
  a(td, "flattenCodeTree");
  a(X7, "processLines");
  a(Z7, "defaultRenderer");
  a(rd, "isHighlightJs");
  a(K7, "getCodeTree");
  a(ks, "default");
});

// ../node_modules/xtend/immutable.js
var ad = M((HH, od) => {
  od.exports = Q7;
  var J7 = Object.prototype.hasOwnProperty;
  function Q7() {
    for (var e = {}, t = 0; t < arguments.length; t++) {
      var r = arguments[t];
      for (var n in r)
        J7.call(r, n) && (e[n] = r[n]);
    }
    return e;
  }
  a(Q7, "extend");
});

// ../node_modules/hastscript/node_modules/property-information/lib/util/schema.js
var Ts = M((OH, ld) => {
  "use strict";
  ld.exports = id;
  var Ls = id.prototype;
  Ls.space = null;
  Ls.normal = {};
  Ls.property = {};
  function id(e, t, r) {
    this.property = e, this.normal = t, r && (this.space = r);
  }
  a(id, "Schema");
});

// ../node_modules/hastscript/node_modules/property-information/lib/util/merge.js
var cd = M(($H, ud) => {
  "use strict";
  var sd = ad(), ew = Ts();
  ud.exports = tw;
  function tw(e) {
    for (var t = e.length, r = [], n = [], o = -1, i, l; ++o < t; )
      i = e[o], r.push(i.property), n.push(i.normal), l = i.space;
    return new ew(
      sd.apply(null, r),
      sd.apply(null, n),
      l
    );
  }
  a(tw, "merge");
});

// ../node_modules/hastscript/node_modules/property-information/normalize.js
var vi = M((jH, pd) => {
  "use strict";
  pd.exports = rw;
  function rw(e) {
    return e.toLowerCase();
  }
  a(rw, "normalize");
});

// ../node_modules/hastscript/node_modules/property-information/lib/util/info.js
var Is = M((qH, fd) => {
  "use strict";
  fd.exports = dd;
  var Je = dd.prototype;
  Je.space = null;
  Je.attribute = null;
  Je.property = null;
  Je.boolean = !1;
  Je.booleanish = !1;
  Je.overloadedBoolean = !1;
  Je.number = !1;
  Je.commaSeparated = !1;
  Je.spaceSeparated = !1;
  Je.commaOrSpaceSeparated = !1;
  Je.mustUseProperty = !1;
  Je.defined = !1;
  function dd(e, t) {
    this.property = e, this.attribute = t;
  }
  a(dd, "Info");
});

// ../node_modules/hastscript/node_modules/property-information/lib/util/types.js
var wi = M((nr) => {
  "use strict";
  var nw = 0;
  nr.boolean = Tr();
  nr.booleanish = Tr();
  nr.overloadedBoolean = Tr();
  nr.number = Tr();
  nr.spaceSeparated = Tr();
  nr.commaSeparated = Tr();
  nr.commaOrSpaceSeparated = Tr();
  function Tr() {
    return Math.pow(2, ++nw);
  }
  a(Tr, "increment");
});

// ../node_modules/hastscript/node_modules/property-information/lib/util/defined-info.js
var Ms = M((XH, wd) => {
  "use strict";
  var gd = Is(), hd = wi();
  wd.exports = Bs;
  Bs.prototype = new gd();
  Bs.prototype.defined = !0;
  var vd = [
    "boolean",
    "booleanish",
    "overloadedBoolean",
    "number",
    "commaSeparated",
    "spaceSeparated",
    "commaOrSpaceSeparated"
  ], ow = vd.length;
  function Bs(e, t, r, n) {
    var o = -1, i;
    for (md(this, "space", n), gd.call(this, e, t); ++o < ow; )
      i = vd[o], md(this, i, (r & hd[i]) === hd[i]);
  }
  a(Bs, "DefinedInfo");
  function md(e, t, r) {
    r && (e[t] = r);
  }
  a(md, "mark");
});

// ../node_modules/hastscript/node_modules/property-information/lib/util/create.js
var yn = M((KH, yd) => {
  "use strict";
  var bd = vi(), aw = Ts(), iw = Ms();
  yd.exports = lw;
  function lw(e) {
    var t = e.space, r = e.mustUseProperty || [], n = e.attributes || {}, o = e.properties, i = e.transform, l = {}, u = {}, c, p;
    for (c in o)
      p = new iw(
        c,
        i(n, c),
        o[c],
        t
      ), r.indexOf(c) !== -1 && (p.mustUseProperty = !0), l[c] = p, u[bd(c)] = c, u[bd(p.attribute)] = c;
    return new aw(l, u, t);
  }
  a(lw, "create");
});

// ../node_modules/hastscript/node_modules/property-information/lib/xlink.js
var xd = M((QH, Dd) => {
  "use strict";
  var sw = yn();
  Dd.exports = sw({
    space: "xlink",
    transform: uw,
    properties: {
      xLinkActuate: null,
      xLinkArcRole: null,
      xLinkHref: null,
      xLinkRole: null,
      xLinkShow: null,
      xLinkTitle: null,
      xLinkType: null
    }
  });
  function uw(e, t) {
    return "xlink:" + t.slice(5).toLowerCase();
  }
  a(uw, "xlinkTransform");
});

// ../node_modules/hastscript/node_modules/property-information/lib/xml.js
var Ed = M((tz, Cd) => {
  "use strict";
  var cw = yn();
  Cd.exports = cw({
    space: "xml",
    transform: pw,
    properties: {
      xmlLang: null,
      xmlBase: null,
      xmlSpace: null
    }
  });
  function pw(e, t) {
    return "xml:" + t.slice(3).toLowerCase();
  }
  a(pw, "xmlTransform");
});

// ../node_modules/hastscript/node_modules/property-information/lib/util/case-sensitive-transform.js
var Sd = M((nz, Rd) => {
  "use strict";
  Rd.exports = dw;
  function dw(e, t) {
    return t in e ? e[t] : t;
  }
  a(dw, "caseSensitiveTransform");
});

// ../node_modules/hastscript/node_modules/property-information/lib/util/case-insensitive-transform.js
var _s = M((az, Ad) => {
  "use strict";
  var fw = Sd();
  Ad.exports = hw;
  function hw(e, t) {
    return fw(e, t.toLowerCase());
  }
  a(hw, "caseInsensitiveTransform");
});

// ../node_modules/hastscript/node_modules/property-information/lib/xmlns.js
var kd = M((lz, Fd) => {
  "use strict";
  var mw = yn(), gw = _s();
  Fd.exports = mw({
    space: "xmlns",
    attributes: {
      xmlnsxlink: "xmlns:xlink"
    },
    transform: gw,
    properties: {
      xmlns: null,
      xmlnsXLink: null
    }
  });
});

// ../node_modules/hastscript/node_modules/property-information/lib/aria.js
var Td = M((sz, Ld) => {
  "use strict";
  var Ps = wi(), vw = yn(), Oe = Ps.booleanish, Qe = Ps.number, Ir = Ps.spaceSeparated;
  Ld.exports = vw({
    transform: ww,
    properties: {
      ariaActiveDescendant: null,
      ariaAtomic: Oe,
      ariaAutoComplete: null,
      ariaBusy: Oe,
      ariaChecked: Oe,
      ariaColCount: Qe,
      ariaColIndex: Qe,
      ariaColSpan: Qe,
      ariaControls: Ir,
      ariaCurrent: null,
      ariaDescribedBy: Ir,
      ariaDetails: null,
      ariaDisabled: Oe,
      ariaDropEffect: Ir,
      ariaErrorMessage: null,
      ariaExpanded: Oe,
      ariaFlowTo: Ir,
      ariaGrabbed: Oe,
      ariaHasPopup: null,
      ariaHidden: Oe,
      ariaInvalid: null,
      ariaKeyShortcuts: null,
      ariaLabel: null,
      ariaLabelledBy: Ir,
      ariaLevel: Qe,
      ariaLive: null,
      ariaModal: Oe,
      ariaMultiLine: Oe,
      ariaMultiSelectable: Oe,
      ariaOrientation: null,
      ariaOwns: Ir,
      ariaPlaceholder: null,
      ariaPosInSet: Qe,
      ariaPressed: Oe,
      ariaReadOnly: Oe,
      ariaRelevant: null,
      ariaRequired: Oe,
      ariaRoleDescription: Ir,
      ariaRowCount: Qe,
      ariaRowIndex: Qe,
      ariaRowSpan: Qe,
      ariaSelected: Oe,
      ariaSetSize: Qe,
      ariaSort: null,
      ariaValueMax: Qe,
      ariaValueMin: Qe,
      ariaValueNow: Qe,
      ariaValueText: null,
      role: null
    }
  });
  function ww(e, t) {
    return t === "role" ? t : "aria-" + t.slice(4).toLowerCase();
  }
  a(ww, "ariaTransform");
});

// ../node_modules/hastscript/node_modules/property-information/lib/html.js
var Bd = M((cz, Id) => {
  "use strict";
  var Dn = wi(), bw = yn(), yw = _s(), O = Dn.boolean, Dw = Dn.overloadedBoolean, ha = Dn.booleanish, Z = Dn.number, Te = Dn.spaceSeparated,
  bi = Dn.commaSeparated;
  Id.exports = bw({
    space: "html",
    attributes: {
      acceptcharset: "accept-charset",
      classname: "class",
      htmlfor: "for",
      httpequiv: "http-equiv"
    },
    transform: yw,
    mustUseProperty: ["checked", "multiple", "muted", "selected"],
    properties: {
      // Standard Properties.
      abbr: null,
      accept: bi,
      acceptCharset: Te,
      accessKey: Te,
      action: null,
      allow: null,
      allowFullScreen: O,
      allowPaymentRequest: O,
      allowUserMedia: O,
      alt: null,
      as: null,
      async: O,
      autoCapitalize: null,
      autoComplete: Te,
      autoFocus: O,
      autoPlay: O,
      capture: O,
      charSet: null,
      checked: O,
      cite: null,
      className: Te,
      cols: Z,
      colSpan: null,
      content: null,
      contentEditable: ha,
      controls: O,
      controlsList: Te,
      coords: Z | bi,
      crossOrigin: null,
      data: null,
      dateTime: null,
      decoding: null,
      default: O,
      defer: O,
      dir: null,
      dirName: null,
      disabled: O,
      download: Dw,
      draggable: ha,
      encType: null,
      enterKeyHint: null,
      form: null,
      formAction: null,
      formEncType: null,
      formMethod: null,
      formNoValidate: O,
      formTarget: null,
      headers: Te,
      height: Z,
      hidden: O,
      high: Z,
      href: null,
      hrefLang: null,
      htmlFor: Te,
      httpEquiv: Te,
      id: null,
      imageSizes: null,
      imageSrcSet: bi,
      inputMode: null,
      integrity: null,
      is: null,
      isMap: O,
      itemId: null,
      itemProp: Te,
      itemRef: Te,
      itemScope: O,
      itemType: Te,
      kind: null,
      label: null,
      lang: null,
      language: null,
      list: null,
      loading: null,
      loop: O,
      low: Z,
      manifest: null,
      max: null,
      maxLength: Z,
      media: null,
      method: null,
      min: null,
      minLength: Z,
      multiple: O,
      muted: O,
      name: null,
      nonce: null,
      noModule: O,
      noValidate: O,
      onAbort: null,
      onAfterPrint: null,
      onAuxClick: null,
      onBeforePrint: null,
      onBeforeUnload: null,
      onBlur: null,
      onCancel: null,
      onCanPlay: null,
      onCanPlayThrough: null,
      onChange: null,
      onClick: null,
      onClose: null,
      onContextMenu: null,
      onCopy: null,
      onCueChange: null,
      onCut: null,
      onDblClick: null,
      onDrag: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragExit: null,
      onDragLeave: null,
      onDragOver: null,
      onDragStart: null,
      onDrop: null,
      onDurationChange: null,
      onEmptied: null,
      onEnded: null,
      onError: null,
      onFocus: null,
      onFormData: null,
      onHashChange: null,
      onInput: null,
      onInvalid: null,
      onKeyDown: null,
      onKeyPress: null,
      onKeyUp: null,
      onLanguageChange: null,
      onLoad: null,
      onLoadedData: null,
      onLoadedMetadata: null,
      onLoadEnd: null,
      onLoadStart: null,
      onMessage: null,
      onMessageError: null,
      onMouseDown: null,
      onMouseEnter: null,
      onMouseLeave: null,
      onMouseMove: null,
      onMouseOut: null,
      onMouseOver: null,
      onMouseUp: null,
      onOffline: null,
      onOnline: null,
      onPageHide: null,
      onPageShow: null,
      onPaste: null,
      onPause: null,
      onPlay: null,
      onPlaying: null,
      onPopState: null,
      onProgress: null,
      onRateChange: null,
      onRejectionHandled: null,
      onReset: null,
      onResize: null,
      onScroll: null,
      onSecurityPolicyViolation: null,
      onSeeked: null,
      onSeeking: null,
      onSelect: null,
      onSlotChange: null,
      onStalled: null,
      onStorage: null,
      onSubmit: null,
      onSuspend: null,
      onTimeUpdate: null,
      onToggle: null,
      onUnhandledRejection: null,
      onUnload: null,
      onVolumeChange: null,
      onWaiting: null,
      onWheel: null,
      open: O,
      optimum: Z,
      pattern: null,
      ping: Te,
      placeholder: null,
      playsInline: O,
      poster: null,
      preload: null,
      readOnly: O,
      referrerPolicy: null,
      rel: Te,
      required: O,
      reversed: O,
      rows: Z,
      rowSpan: Z,
      sandbox: Te,
      scope: null,
      scoped: O,
      seamless: O,
      selected: O,
      shape: null,
      size: Z,
      sizes: null,
      slot: null,
      span: Z,
      spellCheck: ha,
      src: null,
      srcDoc: null,
      srcLang: null,
      srcSet: bi,
      start: Z,
      step: null,
      style: null,
      tabIndex: Z,
      target: null,
      title: null,
      translate: null,
      type: null,
      typeMustMatch: O,
      useMap: null,
      value: ha,
      width: Z,
      wrap: null,
      // Legacy.
      // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
      align: null,
      // Several. Use CSS `text-align` instead,
      aLink: null,
      // `<body>`. Use CSS `a:active {color}` instead
      archive: Te,
      // `<object>`. List of URIs to archives
      axis: null,
      // `<td>` and `<th>`. Use `scope` on `<th>`
      background: null,
      // `<body>`. Use CSS `background-image` instead
      bgColor: null,
      // `<body>` and table elements. Use CSS `background-color` instead
      border: Z,
      // `<table>`. Use CSS `border-width` instead,
      borderColor: null,
      // `<table>`. Use CSS `border-color` instead,
      bottomMargin: Z,
      // `<body>`
      cellPadding: null,
      // `<table>`
      cellSpacing: null,
      // `<table>`
      char: null,
      // Several table elements. When `align=char`, sets the character to align on
      charOff: null,
      // Several table elements. When `char`, offsets the alignment
      classId: null,
      // `<object>`
      clear: null,
      // `<br>`. Use CSS `clear` instead
      code: null,
      // `<object>`
      codeBase: null,
      // `<object>`
      codeType: null,
      // `<object>`
      color: null,
      // `<font>` and `<hr>`. Use CSS instead
      compact: O,
      // Lists. Use CSS to reduce space between items instead
      declare: O,
      // `<object>`
      event: null,
      // `<script>`
      face: null,
      // `<font>`. Use CSS instead
      frame: null,
      // `<table>`
      frameBorder: null,
      // `<iframe>`. Use CSS `border` instead
      hSpace: Z,
      // `<img>` and `<object>`
      leftMargin: Z,
      // `<body>`
      link: null,
      // `<body>`. Use CSS `a:link {color: *}` instead
      longDesc: null,
      // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
      lowSrc: null,
      // `<img>`. Use a `<picture>`
      marginHeight: Z,
      // `<body>`
      marginWidth: Z,
      // `<body>`
      noResize: O,
      // `<frame>`
      noHref: O,
      // `<area>`. Use no href instead of an explicit `nohref`
      noShade: O,
      // `<hr>`. Use background-color and height instead of borders
      noWrap: O,
      // `<td>` and `<th>`
      object: null,
      // `<applet>`
      profile: null,
      // `<head>`
      prompt: null,
      // `<isindex>`
      rev: null,
      // `<link>`
      rightMargin: Z,
      // `<body>`
      rules: null,
      // `<table>`
      scheme: null,
      // `<meta>`
      scrolling: ha,
      // `<frame>`. Use overflow in the child context
      standby: null,
      // `<object>`
      summary: null,
      // `<table>`
      text: null,
      // `<body>`. Use CSS `color` instead
      topMargin: Z,
      // `<body>`
      valueType: null,
      // `<param>`
      version: null,
      // `<html>`. Use a doctype.
      vAlign: null,
      // Several. Use CSS `vertical-align` instead
      vLink: null,
      // `<body>`. Use CSS `a:visited {color}` instead
      vSpace: Z,
      // `<img>` and `<object>`
      // Non-standard Properties.
      allowTransparency: null,
      autoCorrect: null,
      autoSave: null,
      disablePictureInPicture: O,
      disableRemotePlayback: O,
      prefix: null,
      property: null,
      results: Z,
      security: null,
      unselectable: null
    }
  });
});

// ../node_modules/hastscript/node_modules/property-information/html.js
var _d = M((pz, Md) => {
  "use strict";
  var xw = cd(), Cw = xd(), Ew = Ed(), Rw = kd(), Sw = Td(), Aw = Bd();
  Md.exports = xw([Ew, Cw, Rw, Sw, Aw]);
});

// ../node_modules/hastscript/node_modules/property-information/find.js
var zd = M((dz, Hd) => {
  "use strict";
  var Fw = vi(), kw = Ms(), Lw = Is(), Hs = "data";
  Hd.exports = Bw;
  var Tw = /^data[-\w.:]+$/i, Pd = /-[a-z]/g, Iw = /[A-Z]/g;
  function Bw(e, t) {
    var r = Fw(t), n = t, o = Lw;
    return r in e.normal ? e.property[e.normal[r]] : (r.length > 4 && r.slice(0, 4) === Hs && Tw.test(t) && (t.charAt(4) === "-" ? n = Mw(t) :
    t = _w(t), o = kw), new o(n, t));
  }
  a(Bw, "find");
  function Mw(e) {
    var t = e.slice(5).replace(Pd, Hw);
    return Hs + t.charAt(0).toUpperCase() + t.slice(1);
  }
  a(Mw, "datasetToProperty");
  function _w(e) {
    var t = e.slice(4);
    return Pd.test(t) ? e : (t = t.replace(Iw, Pw), t.charAt(0) !== "-" && (t = "-" + t), Hs + t);
  }
  a(_w, "datasetToAttribute");
  function Pw(e) {
    return "-" + e.toLowerCase();
  }
  a(Pw, "kebab");
  function Hw(e) {
    return e.charAt(1).toUpperCase();
  }
  a(Hw, "camelcase");
});

// ../node_modules/hast-util-parse-selector/index.js
var $d = M((hz, Nd) => {
  "use strict";
  Nd.exports = zw;
  var Od = /[#.]/g;
  function zw(e, t) {
    for (var r = e || "", n = t || "div", o = {}, i = 0, l, u, c; i < r.length; )
      Od.lastIndex = i, c = Od.exec(r), l = r.slice(i, c ? c.index : r.length), l && (u ? u === "#" ? o.id = l : o.className ? o.className.push(
      l) : o.className = [l] : n = l, i += l.length), c && (u = c[0], i++);
    return { type: "element", tagName: n, properties: o, children: [] };
  }
  a(zw, "parse");
});

// ../node_modules/hastscript/node_modules/space-separated-tokens/index.js
var jd = M((zs) => {
  "use strict";
  zs.parse = $w;
  zs.stringify = Vw;
  var Vd = "", Ow = " ", Nw = /[ \t\n\r\f]+/g;
  function $w(e) {
    var t = String(e || Vd).trim();
    return t === Vd ? [] : t.split(Nw);
  }
  a($w, "parse");
  function Vw(e) {
    return e.join(Ow).trim();
  }
  a(Vw, "stringify");
});

// ../node_modules/hastscript/node_modules/comma-separated-tokens/index.js
var qd = M((Ns) => {
  "use strict";
  Ns.parse = jw;
  Ns.stringify = Ww;
  var Os = ",", Wd = " ", ma = "";
  function jw(e) {
    for (var t = [], r = String(e || ma), n = r.indexOf(Os), o = 0, i = !1, l; !i; )
      n === -1 && (n = r.length, i = !0), l = r.slice(o, n).trim(), (l || !i) && t.push(l), o = n + 1, n = r.indexOf(Os, o);
    return t;
  }
  a(jw, "parse");
  function Ww(e, t) {
    var r = t || {}, n = r.padLeft === !1 ? ma : Wd, o = r.padRight ? Wd : ma;
    return e[e.length - 1] === ma && (e = e.concat(ma)), e.join(o + Os + n).trim();
  }
  a(Ww, "stringify");
});

// ../node_modules/hastscript/factory.js
var Jd = M((yz, Kd) => {
  "use strict";
  var qw = zd(), Ud = vi(), Uw = $d(), Gd = jd().parse, Yd = qd().parse;
  Kd.exports = Yw;
  var Gw = {}.hasOwnProperty;
  function Yw(e, t, r) {
    var n = r ? Qw(r) : null;
    return o;
    function o(l, u) {
      var c = Uw(l, t), p = Array.prototype.slice.call(arguments, 2), d = c.tagName.toLowerCase(), h;
      if (c.tagName = n && Gw.call(n, d) ? n[d] : d, u && Xw(u, c) && (p.unshift(u), u = null), u)
        for (h in u)
          i(c.properties, h, u[h]);
      return Zd(c.children, p), c.tagName === "template" && (c.content = { type: "root", children: c.children }, c.children = []), c;
    }
    function i(l, u, c) {
      var p, d, h;
      c == null || c !== c || (p = qw(e, u), d = p.property, h = c, typeof h == "string" && (p.spaceSeparated ? h = Gd(h) : p.commaSeparated ?
      h = Yd(h) : p.commaOrSpaceSeparated && (h = Gd(Yd(h).join(" ")))), d === "style" && typeof c != "string" && (h = Jw(h)), d === "classN\
ame" && l.className && (h = l.className.concat(h)), l[d] = Kw(p, d, h));
    }
  }
  a(Yw, "factory");
  function Xw(e, t) {
    return typeof e == "string" || "length" in e || Zw(t.tagName, e);
  }
  a(Xw, "isChildren");
  function Zw(e, t) {
    var r = t.type;
    return e === "input" || !r || typeof r != "string" ? !1 : typeof t.children == "object" && "length" in t.children ? !0 : (r = r.toLowerCase(),
    e === "button" ? r !== "menu" && r !== "submit" && r !== "reset" && r !== "button" : "value" in t);
  }
  a(Zw, "isNode");
  function Zd(e, t) {
    var r, n;
    if (typeof t == "string" || typeof t == "number") {
      e.push({ type: "text", value: String(t) });
      return;
    }
    if (typeof t == "object" && "length" in t) {
      for (r = -1, n = t.length; ++r < n; )
        Zd(e, t[r]);
      return;
    }
    if (typeof t != "object" || !("type" in t))
      throw new Error("Expected node, nodes, or string, got `" + t + "`");
    e.push(t);
  }
  a(Zd, "addChild");
  function Kw(e, t, r) {
    var n, o, i;
    if (typeof r != "object" || !("length" in r))
      return Xd(e, t, r);
    for (o = r.length, n = -1, i = []; ++n < o; )
      i[n] = Xd(e, t, r[n]);
    return i;
  }
  a(Kw, "parsePrimitives");
  function Xd(e, t, r) {
    var n = r;
    return e.number || e.positiveNumber ? !isNaN(n) && n !== "" && (n = Number(n)) : (e.boolean || e.overloadedBoolean) && typeof n == "stri\
ng" && (n === "" || Ud(r) === Ud(t)) && (n = !0), n;
  }
  a(Xd, "parsePrimitive");
  function Jw(e) {
    var t = [], r;
    for (r in e)
      t.push([r, e[r]].join(": "));
    return t.join("; ");
  }
  a(Jw, "style");
  function Qw(e) {
    for (var t = e.length, r = -1, n = {}, o; ++r < t; )
      o = e[r], n[o.toLowerCase()] = o;
    return n;
  }
  a(Qw, "createAdjustMap");
});

// ../node_modules/hastscript/html.js
var tf = M((xz, ef) => {
  "use strict";
  var e6 = _d(), t6 = Jd(), Qd = t6(e6, "div");
  Qd.displayName = "html";
  ef.exports = Qd;
});

// ../node_modules/hastscript/index.js
var nf = M((Cz, rf) => {
  "use strict";
  rf.exports = tf();
});

// ../node_modules/refractor/node_modules/character-entities-legacy/index.json
var of = M((Ez, r6) => {
  r6.exports = {
    AElig: "\xC6",
    AMP: "&",
    Aacute: "\xC1",
    Acirc: "\xC2",
    Agrave: "\xC0",
    Aring: "\xC5",
    Atilde: "\xC3",
    Auml: "\xC4",
    COPY: "\xA9",
    Ccedil: "\xC7",
    ETH: "\xD0",
    Eacute: "\xC9",
    Ecirc: "\xCA",
    Egrave: "\xC8",
    Euml: "\xCB",
    GT: ">",
    Iacute: "\xCD",
    Icirc: "\xCE",
    Igrave: "\xCC",
    Iuml: "\xCF",
    LT: "<",
    Ntilde: "\xD1",
    Oacute: "\xD3",
    Ocirc: "\xD4",
    Ograve: "\xD2",
    Oslash: "\xD8",
    Otilde: "\xD5",
    Ouml: "\xD6",
    QUOT: '"',
    REG: "\xAE",
    THORN: "\xDE",
    Uacute: "\xDA",
    Ucirc: "\xDB",
    Ugrave: "\xD9",
    Uuml: "\xDC",
    Yacute: "\xDD",
    aacute: "\xE1",
    acirc: "\xE2",
    acute: "\xB4",
    aelig: "\xE6",
    agrave: "\xE0",
    amp: "&",
    aring: "\xE5",
    atilde: "\xE3",
    auml: "\xE4",
    brvbar: "\xA6",
    ccedil: "\xE7",
    cedil: "\xB8",
    cent: "\xA2",
    copy: "\xA9",
    curren: "\xA4",
    deg: "\xB0",
    divide: "\xF7",
    eacute: "\xE9",
    ecirc: "\xEA",
    egrave: "\xE8",
    eth: "\xF0",
    euml: "\xEB",
    frac12: "\xBD",
    frac14: "\xBC",
    frac34: "\xBE",
    gt: ">",
    iacute: "\xED",
    icirc: "\xEE",
    iexcl: "\xA1",
    igrave: "\xEC",
    iquest: "\xBF",
    iuml: "\xEF",
    laquo: "\xAB",
    lt: "<",
    macr: "\xAF",
    micro: "\xB5",
    middot: "\xB7",
    nbsp: "\xA0",
    not: "\xAC",
    ntilde: "\xF1",
    oacute: "\xF3",
    ocirc: "\xF4",
    ograve: "\xF2",
    ordf: "\xAA",
    ordm: "\xBA",
    oslash: "\xF8",
    otilde: "\xF5",
    ouml: "\xF6",
    para: "\xB6",
    plusmn: "\xB1",
    pound: "\xA3",
    quot: '"',
    raquo: "\xBB",
    reg: "\xAE",
    sect: "\xA7",
    shy: "\xAD",
    sup1: "\xB9",
    sup2: "\xB2",
    sup3: "\xB3",
    szlig: "\xDF",
    thorn: "\xFE",
    times: "\xD7",
    uacute: "\xFA",
    ucirc: "\xFB",
    ugrave: "\xF9",
    uml: "\xA8",
    uuml: "\xFC",
    yacute: "\xFD",
    yen: "\xA5",
    yuml: "\xFF"
  };
});

// ../node_modules/refractor/node_modules/character-reference-invalid/index.json
var af = M((Rz, n6) => {
  n6.exports = {
    "0": "\uFFFD",
    "128": "\u20AC",
    "130": "\u201A",
    "131": "\u0192",
    "132": "\u201E",
    "133": "\u2026",
    "134": "\u2020",
    "135": "\u2021",
    "136": "\u02C6",
    "137": "\u2030",
    "138": "\u0160",
    "139": "\u2039",
    "140": "\u0152",
    "142": "\u017D",
    "145": "\u2018",
    "146": "\u2019",
    "147": "\u201C",
    "148": "\u201D",
    "149": "\u2022",
    "150": "\u2013",
    "151": "\u2014",
    "152": "\u02DC",
    "153": "\u2122",
    "154": "\u0161",
    "155": "\u203A",
    "156": "\u0153",
    "158": "\u017E",
    "159": "\u0178"
  };
});

// ../node_modules/refractor/node_modules/is-decimal/index.js
var $s = M((Sz, lf) => {
  "use strict";
  lf.exports = o6;
  function o6(e) {
    var t = typeof e == "string" ? e.charCodeAt(0) : e;
    return t >= 48 && t <= 57;
  }
  a(o6, "decimal");
});

// ../node_modules/refractor/node_modules/is-hexadecimal/index.js
var uf = M((Fz, sf) => {
  "use strict";
  sf.exports = a6;
  function a6(e) {
    var t = typeof e == "string" ? e.charCodeAt(0) : e;
    return t >= 97 && t <= 102 || t >= 65 && t <= 70 || t >= 48 && t <= 57;
  }
  a(a6, "hexadecimal");
});

// ../node_modules/refractor/node_modules/is-alphabetical/index.js
var pf = M((Lz, cf) => {
  "use strict";
  cf.exports = i6;
  function i6(e) {
    var t = typeof e == "string" ? e.charCodeAt(0) : e;
    return t >= 97 && t <= 122 || t >= 65 && t <= 90;
  }
  a(i6, "alphabetical");
});

// ../node_modules/refractor/node_modules/is-alphanumerical/index.js
var ff = M((Iz, df) => {
  "use strict";
  var l6 = pf(), s6 = $s();
  df.exports = u6;
  function u6(e) {
    return l6(e) || s6(e);
  }
  a(u6, "alphanumerical");
});

// ../node_modules/refractor/node_modules/parse-entities/decode-entity.browser.js
var mf = M((Mz, hf) => {
  "use strict";
  var yi, c6 = 59;
  hf.exports = p6;
  function p6(e) {
    var t = "&" + e + ";", r;
    return yi = yi || document.createElement("i"), yi.innerHTML = t, r = yi.textContent, r.charCodeAt(r.length - 1) === c6 && e !== "semi" ||
    r === t ? !1 : r;
  }
  a(p6, "decodeEntity");
});

// ../node_modules/refractor/node_modules/parse-entities/index.js
var kf = M((Pz, Ff) => {
  "use strict";
  var gf = of(), vf = af(), d6 = $s(), f6 = uf(), Df = ff(), h6 = mf();
  Ff.exports = A6;
  var m6 = {}.hasOwnProperty, xn = String.fromCharCode, g6 = Function.prototype, wf = {
    warning: null,
    reference: null,
    text: null,
    warningContext: null,
    referenceContext: null,
    textContext: null,
    position: {},
    additional: null,
    attribute: !1,
    nonTerminated: !0
  }, v6 = 9, bf = 10, w6 = 12, b6 = 32, yf = 38, y6 = 59, D6 = 60, x6 = 61, C6 = 35, E6 = 88, R6 = 120, S6 = 65533, Cn = "named", js = "hexa\
decimal", Ws = "decimal", qs = {};
  qs[js] = 16;
  qs[Ws] = 10;
  var Di = {};
  Di[Cn] = Df;
  Di[Ws] = d6;
  Di[js] = f6;
  var xf = 1, Cf = 2, Ef = 3, Rf = 4, Sf = 5, Vs = 6, Af = 7, or = {};
  or[xf] = "Named character references must be terminated by a semicolon";
  or[Cf] = "Numeric character references must be terminated by a semicolon";
  or[Ef] = "Named character references cannot be empty";
  or[Rf] = "Numeric character references cannot be empty";
  or[Sf] = "Named character references must be known";
  or[Vs] = "Numeric character references cannot be disallowed";
  or[Af] = "Numeric character references cannot be outside the permissible Unicode range";
  function A6(e, t) {
    var r = {}, n, o;
    t || (t = {});
    for (o in wf)
      n = t[o], r[o] = n ?? wf[o];
    return (r.position.indent || r.position.start) && (r.indent = r.position.indent || [], r.position = r.position.start), F6(e, r);
  }
  a(A6, "parseEntities");
  function F6(e, t) {
    var r = t.additional, n = t.nonTerminated, o = t.text, i = t.reference, l = t.warning, u = t.textContext, c = t.referenceContext, p = t.
    warningContext, d = t.position, h = t.indent || [], f = e.length, g = 0, w = -1, m = d.column || 1, v = d.line || 1, y = "", b = [], D, x,
    C, E, R, F, A, k, B, j, V, ee, I, T, P, q, $, U, H;
    for (typeof r == "string" && (r = r.charCodeAt(0)), q = X(), k = l ? _e : g6, g--, f++; ++g < f; )
      if (R === bf && (m = h[w] || 1), R = e.charCodeAt(g), R === yf) {
        if (A = e.charCodeAt(g + 1), A === v6 || A === bf || A === w6 || A === b6 || A === yf || A === D6 || A !== A || r && A === r) {
          y += xn(R), m++;
          continue;
        }
        for (I = g + 1, ee = I, H = I, A === C6 ? (H = ++ee, A = e.charCodeAt(H), A === E6 || A === R6 ? (T = js, H = ++ee) : T = Ws) : T = Cn,
        D = "", V = "", E = "", P = Di[T], H--; ++H < f && (A = e.charCodeAt(H), !!P(A)); )
          E += xn(A), T === Cn && m6.call(gf, E) && (D = E, V = gf[E]);
        C = e.charCodeAt(H) === y6, C && (H++, x = T === Cn ? h6(E) : !1, x && (D = E, V = x)), U = 1 + H - I, !C && !n || (E ? T === Cn ? (C &&
        !V ? k(Sf, 1) : (D !== E && (H = ee + D.length, U = 1 + H - ee, C = !1), C || (B = D ? xf : Ef, t.attribute ? (A = e.charCodeAt(H), A ===
        x6 ? (k(B, U), V = null) : Df(A) ? V = null : k(B, U)) : k(B, U))), F = V) : (C || k(Cf, U), F = parseInt(E, qs[T]), k6(F) ? (k(Af, U),
        F = xn(S6)) : F in vf ? (k(Vs, U), F = vf[F]) : (j = "", L6(F) && k(Vs, U), F > 65535 && (F -= 65536, j += xn(F >>> 10 | 55296), F =
        56320 | F & 1023), F = j + xn(F))) : T !== Cn && k(Rf, U)), F ? (xe(), q = X(), g = H - 1, m += H - I + 1, b.push(F), $ = X(), $.offset++,
        i && i.call(
          c,
          F,
          { start: q, end: $ },
          e.slice(I - 1, H)
        ), q = $) : (E = e.slice(I - 1, H), y += E, m += E.length, g = H - 1);
      } else
        R === 10 && (v++, w++, m = 0), R === R ? (y += xn(R), m++) : xe();
    return b.join("");
    function X() {
      return {
        line: v,
        column: m,
        offset: g + (d.offset || 0)
      };
    }
    function _e(ge, Ae) {
      var Pe = X();
      Pe.column += Ae, Pe.offset += Ae, l.call(p, or[ge], Pe, ge);
    }
    function xe() {
      y && (b.push(y), o && o.call(u, y, { start: q, end: X() }), y = "");
    }
  }
  a(F6, "parse");
  function k6(e) {
    return e >= 55296 && e <= 57343 || e > 1114111;
  }
  a(k6, "prohibited");
  function L6(e) {
    return e >= 1 && e <= 8 || e === 11 || e >= 13 && e <= 31 || e >= 127 && e <= 159 || e >= 64976 && e <= 65007 || (e & 65535) === 65535 ||
    (e & 65535) === 65534;
  }
  a(L6, "disallowed");
});

// ../node_modules/refractor/node_modules/prismjs/components/prism-core.js
var Tf = M((zz, xi) => {
  var T6 = typeof window < "u" ? window : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? self : {};
  var Lf = function(e) {
    var t = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i, r = 0, n = {}, o = {
      /**
       * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
       * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
       * additional languages or plugins yourself.
       *
       * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
       *
       * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
       * empty Prism object into the global scope before loading the Prism script like this:
       *
       * ```js
       * window.Prism = window.Prism || {};
       * Prism.manual = true;
       * // add a new <script> to load Prism's script
       * ```
       *
       * @default false
       * @type {boolean}
       * @memberof Prism
       * @public
       */
      manual: e.Prism && e.Prism.manual,
      /**
       * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
       * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
       * own worker, you don't want it to do this.
       *
       * By setting this value to `true`, Prism will not add its own listeners to the worker.
       *
       * You obviously have to change this value before Prism executes. To do this, you can add an
       * empty Prism object into the global scope before loading the Prism script like this:
       *
       * ```js
       * window.Prism = window.Prism || {};
       * Prism.disableWorkerMessageHandler = true;
       * // Load Prism's script
       * ```
       *
       * @default false
       * @type {boolean}
       * @memberof Prism
       * @public
       */
      disableWorkerMessageHandler: e.Prism && e.Prism.disableWorkerMessageHandler,
      /**
       * A namespace for utility methods.
       *
       * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
       * change or disappear at any time.
       *
       * @namespace
       * @memberof Prism
       */
      util: {
        encode: /* @__PURE__ */ a(function m(v) {
          return v instanceof i ? new i(v.type, m(v.content), v.alias) : Array.isArray(v) ? v.map(m) : v.replace(/&/g, "&amp;").replace(/</g,
          "&lt;").replace(/\u00a0/g, " ");
        }, "encode"),
        /**
         * Returns the name of the type of the given value.
         *
         * @param {any} o
         * @returns {string}
         * @example
         * type(null)      === 'Null'
         * type(undefined) === 'Undefined'
         * type(123)       === 'Number'
         * type('foo')     === 'String'
         * type(true)      === 'Boolean'
         * type([1, 2])    === 'Array'
         * type({})        === 'Object'
         * type(String)    === 'Function'
         * type(/abc+/)    === 'RegExp'
         */
        type: /* @__PURE__ */ a(function(m) {
          return Object.prototype.toString.call(m).slice(8, -1);
        }, "type"),
        /**
         * Returns a unique number for the given object. Later calls will still return the same number.
         *
         * @param {Object} obj
         * @returns {number}
         */
        objId: /* @__PURE__ */ a(function(m) {
          return m.__id || Object.defineProperty(m, "__id", { value: ++r }), m.__id;
        }, "objId"),
        /**
         * Creates a deep clone of the given object.
         *
         * The main intended use of this function is to clone language definitions.
         *
         * @param {T} o
         * @param {Record<number, any>} [visited]
         * @returns {T}
         * @template T
         */
        clone: /* @__PURE__ */ a(function m(v, y) {
          y = y || {};
          var b, D;
          switch (o.util.type(v)) {
            case "Object":
              if (D = o.util.objId(v), y[D])
                return y[D];
              b = /** @type {Record<string, any>} */
              {}, y[D] = b;
              for (var x in v)
                v.hasOwnProperty(x) && (b[x] = m(v[x], y));
              return (
                /** @type {any} */
                b
              );
            case "Array":
              return D = o.util.objId(v), y[D] ? y[D] : (b = [], y[D] = b, /** @type {Array} */
              /** @type {any} */
              v.forEach(function(C, E) {
                b[E] = m(C, y);
              }), /** @type {any} */
              b);
            default:
              return v;
          }
        }, "deepClone"),
        /**
         * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
         *
         * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
         *
         * @param {Element} element
         * @returns {string}
         */
        getLanguage: /* @__PURE__ */ a(function(m) {
          for (; m; ) {
            var v = t.exec(m.className);
            if (v)
              return v[1].toLowerCase();
            m = m.parentElement;
          }
          return "none";
        }, "getLanguage"),
        /**
         * Sets the Prism `language-xxxx` class of the given element.
         *
         * @param {Element} element
         * @param {string} language
         * @returns {void}
         */
        setLanguage: /* @__PURE__ */ a(function(m, v) {
          m.className = m.className.replace(RegExp(t, "gi"), ""), m.classList.add("language-" + v);
        }, "setLanguage"),
        /**
         * Returns the script element that is currently executing.
         *
         * This does __not__ work for line script element.
         *
         * @returns {HTMLScriptElement | null}
         */
        currentScript: /* @__PURE__ */ a(function() {
          if (typeof document > "u")
            return null;
          if ("currentScript" in document)
            return (
              /** @type {any} */
              document.currentScript
            );
          try {
            throw new Error();
          } catch (b) {
            var m = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(b.stack) || [])[1];
            if (m) {
              var v = document.getElementsByTagName("script");
              for (var y in v)
                if (v[y].src == m)
                  return v[y];
            }
            return null;
          }
        }, "currentScript"),
        /**
         * Returns whether a given class is active for `element`.
         *
         * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
         * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
         * given class is just the given class with a `no-` prefix.
         *
         * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
         * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
         * ancestors have the given class or the negated version of it, then the default activation will be returned.
         *
         * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
         * version of it, the class is considered active.
         *
         * @param {Element} element
         * @param {string} className
         * @param {boolean} [defaultActivation=false]
         * @returns {boolean}
         */
        isActive: /* @__PURE__ */ a(function(m, v, y) {
          for (var b = "no-" + v; m; ) {
            var D = m.classList;
            if (D.contains(v))
              return !0;
            if (D.contains(b))
              return !1;
            m = m.parentElement;
          }
          return !!y;
        }, "isActive")
      },
      /**
       * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
       *
       * @namespace
       * @memberof Prism
       * @public
       */
      languages: {
        /**
         * The grammar for plain, unformatted text.
         */
        plain: n,
        plaintext: n,
        text: n,
        txt: n,
        /**
         * Creates a deep copy of the language with the given id and appends the given tokens.
         *
         * If a token in `redef` also appears in the copied language, then the existing token in the copied language
         * will be overwritten at its original position.
         *
         * ## Best practices
         *
         * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
         * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
         * understand the language definition because, normally, the order of tokens matters in Prism grammars.
         *
         * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
         * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
         *
         * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
         * @param {Grammar} redef The new tokens to append.
         * @returns {Grammar} The new language created.
         * @public
         * @example
         * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
         *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
         *     // at its original position
         *     'comment': { ... },
         *     // CSS doesn't have a 'color' token, so this token will be appended
         *     'color': /\b(?:red|green|blue)\b/
         * });
         */
        extend: /* @__PURE__ */ a(function(m, v) {
          var y = o.util.clone(o.languages[m]);
          for (var b in v)
            y[b] = v[b];
          return y;
        }, "extend"),
        /**
         * Inserts tokens _before_ another token in a language definition or any other grammar.
         *
         * ## Usage
         *
         * This helper method makes it easy to modify existing languages. For example, the CSS language definition
         * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
         * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
         * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
         * this:
         *
         * ```js
         * Prism.languages.markup.style = {
         *     // token
         * };
         * ```
         *
         * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
         * before existing tokens. For the CSS example above, you would use it like this:
         *
         * ```js
         * Prism.languages.insertBefore('markup', 'cdata', {
         *     'style': {
         *         // token
         *     }
         * });
         * ```
         *
         * ## Special cases
         *
         * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
         * will be ignored.
         *
         * This behavior can be used to insert tokens after `before`:
         *
         * ```js
         * Prism.languages.insertBefore('markup', 'comment', {
         *     'comment': Prism.languages.markup.comment,
         *     // tokens after 'comment'
         * });
         * ```
         *
         * ## Limitations
         *
         * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
         * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
         * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
         * deleting properties which is necessary to insert at arbitrary positions.
         *
         * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
         * Instead, it will create a new object and replace all references to the target object with the new one. This
         * can be done without temporarily deleting properties, so the iteration order is well-defined.
         *
         * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
         * you hold the target object in a variable, then the value of the variable will not change.
         *
         * ```js
         * var oldMarkup = Prism.languages.markup;
         * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
         *
         * assert(oldMarkup !== Prism.languages.markup);
         * assert(newMarkup === Prism.languages.markup);
         * ```
         *
         * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
         * object to be modified.
         * @param {string} before The key to insert before.
         * @param {Grammar} insert An object containing the key-value pairs to be inserted.
         * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
         * object to be modified.
         *
         * Defaults to `Prism.languages`.
         * @returns {Grammar} The new grammar object.
         * @public
         */
        insertBefore: /* @__PURE__ */ a(function(m, v, y, b) {
          b = b || /** @type {any} */
          o.languages;
          var D = b[m], x = {};
          for (var C in D)
            if (D.hasOwnProperty(C)) {
              if (C == v)
                for (var E in y)
                  y.hasOwnProperty(E) && (x[E] = y[E]);
              y.hasOwnProperty(C) || (x[C] = D[C]);
            }
          var R = b[m];
          return b[m] = x, o.languages.DFS(o.languages, function(F, A) {
            A === R && F != m && (this[F] = x);
          }), x;
        }, "insertBefore"),
        // Traverse a language definition with Depth First Search
        DFS: /* @__PURE__ */ a(function m(v, y, b, D) {
          D = D || {};
          var x = o.util.objId;
          for (var C in v)
            if (v.hasOwnProperty(C)) {
              y.call(v, C, v[C], b || C);
              var E = v[C], R = o.util.type(E);
              R === "Object" && !D[x(E)] ? (D[x(E)] = !0, m(E, y, null, D)) : R === "Array" && !D[x(E)] && (D[x(E)] = !0, m(E, y, C, D));
            }
        }, "DFS")
      },
      plugins: {},
      /**
       * This is the most high-level function in Prism’s API.
       * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
       * each one of them.
       *
       * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
       *
       * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
       * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
       * @memberof Prism
       * @public
       */
      highlightAll: /* @__PURE__ */ a(function(m, v) {
        o.highlightAllUnder(document, m, v);
      }, "highlightAll"),
      /**
       * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
       * {@link Prism.highlightElement} on each one of them.
       *
       * The following hooks will be run:
       * 1. `before-highlightall`
       * 2. `before-all-elements-highlight`
       * 3. All hooks of {@link Prism.highlightElement} for each element.
       *
       * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
       * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
       * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
       * @memberof Prism
       * @public
       */
      highlightAllUnder: /* @__PURE__ */ a(function(m, v, y) {
        var b = {
          callback: y,
          container: m,
          selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };
        o.hooks.run("before-highlightall", b), b.elements = Array.prototype.slice.apply(b.container.querySelectorAll(b.selector)), o.hooks.run(
        "before-all-elements-highlight", b);
        for (var D = 0, x; x = b.elements[D++]; )
          o.highlightElement(x, v === !0, b.callback);
      }, "highlightAllUnder"),
      /**
       * Highlights the code inside a single element.
       *
       * The following hooks will be run:
       * 1. `before-sanity-check`
       * 2. `before-highlight`
       * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
       * 4. `before-insert`
       * 5. `after-highlight`
       * 6. `complete`
       *
       * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
       * the element's language.
       *
       * @param {Element} element The element containing the code.
       * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
       * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
       * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
       * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
       *
       * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
       * asynchronous highlighting to work. You can build your own bundle on the
       * [Download page](https://prismjs.com/download.html).
       * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
       * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
       * @memberof Prism
       * @public
       */
      highlightElement: /* @__PURE__ */ a(function(m, v, y) {
        var b = o.util.getLanguage(m), D = o.languages[b];
        o.util.setLanguage(m, b);
        var x = m.parentElement;
        x && x.nodeName.toLowerCase() === "pre" && o.util.setLanguage(x, b);
        var C = m.textContent, E = {
          element: m,
          language: b,
          grammar: D,
          code: C
        };
        function R(A) {
          E.highlightedCode = A, o.hooks.run("before-insert", E), E.element.innerHTML = E.highlightedCode, o.hooks.run("after-highlight", E),
          o.hooks.run("complete", E), y && y.call(E.element);
        }
        if (a(R, "insertHighlightedCode"), o.hooks.run("before-sanity-check", E), x = E.element.parentElement, x && x.nodeName.toLowerCase() ===
        "pre" && !x.hasAttribute("tabindex") && x.setAttribute("tabindex", "0"), !E.code) {
          o.hooks.run("complete", E), y && y.call(E.element);
          return;
        }
        if (o.hooks.run("before-highlight", E), !E.grammar) {
          R(o.util.encode(E.code));
          return;
        }
        if (v && e.Worker) {
          var F = new Worker(o.filename);
          F.onmessage = function(A) {
            R(A.data);
          }, F.postMessage(JSON.stringify({
            language: E.language,
            code: E.code,
            immediateClose: !0
          }));
        } else
          R(o.highlight(E.code, E.grammar, E.language));
      }, "highlightElement"),
      /**
       * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
       * and the language definitions to use, and returns a string with the HTML produced.
       *
       * The following hooks will be run:
       * 1. `before-tokenize`
       * 2. `after-tokenize`
       * 3. `wrap`: On each {@link Token}.
       *
       * @param {string} text A string with the code to be highlighted.
       * @param {Grammar} grammar An object containing the tokens to use.
       *
       * Usually a language definition like `Prism.languages.markup`.
       * @param {string} language The name of the language definition passed to `grammar`.
       * @returns {string} The highlighted HTML.
       * @memberof Prism
       * @public
       * @example
       * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
       */
      highlight: /* @__PURE__ */ a(function(m, v, y) {
        var b = {
          code: m,
          grammar: v,
          language: y
        };
        if (o.hooks.run("before-tokenize", b), !b.grammar)
          throw new Error('The language "' + b.language + '" has no grammar.');
        return b.tokens = o.tokenize(b.code, b.grammar), o.hooks.run("after-tokenize", b), i.stringify(o.util.encode(b.tokens), b.language);
      }, "highlight"),
      /**
       * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
       * and the language definitions to use, and returns an array with the tokenized code.
       *
       * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
       *
       * This method could be useful in other contexts as well, as a very crude parser.
       *
       * @param {string} text A string with the code to be highlighted.
       * @param {Grammar} grammar An object containing the tokens to use.
       *
       * Usually a language definition like `Prism.languages.markup`.
       * @returns {TokenStream} An array of strings and tokens, a token stream.
       * @memberof Prism
       * @public
       * @example
       * let code = `var foo = 0;`;
       * let tokens = Prism.tokenize(code, Prism.languages.javascript);
       * tokens.forEach(token => {
       *     if (token instanceof Prism.Token && token.type === 'number') {
       *         console.log(`Found numeric literal: ${token.content}`);
       *     }
       * });
       */
      tokenize: /* @__PURE__ */ a(function(m, v) {
        var y = v.rest;
        if (y) {
          for (var b in y)
            v[b] = y[b];
          delete v.rest;
        }
        var D = new c();
        return p(D, D.head, m), u(m, D, v, D.head, 0), h(D);
      }, "tokenize"),
      /**
       * @namespace
       * @memberof Prism
       * @public
       */
      hooks: {
        all: {},
        /**
         * Adds the given callback to the list of callbacks for the given hook.
         *
         * The callback will be invoked when the hook it is registered for is run.
         * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
         *
         * One callback function can be registered to multiple hooks and the same hook multiple times.
         *
         * @param {string} name The name of the hook.
         * @param {HookCallback} callback The callback function which is given environment variables.
         * @public
         */
        add: /* @__PURE__ */ a(function(m, v) {
          var y = o.hooks.all;
          y[m] = y[m] || [], y[m].push(v);
        }, "add"),
        /**
         * Runs a hook invoking all registered callbacks with the given environment variables.
         *
         * Callbacks will be invoked synchronously and in the order in which they were registered.
         *
         * @param {string} name The name of the hook.
         * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
         * @public
         */
        run: /* @__PURE__ */ a(function(m, v) {
          var y = o.hooks.all[m];
          if (!(!y || !y.length))
            for (var b = 0, D; D = y[b++]; )
              D(v);
        }, "run")
      },
      Token: i
    };
    e.Prism = o;
    function i(m, v, y, b) {
      this.type = m, this.content = v, this.alias = y, this.length = (b || "").length | 0;
    }
    a(i, "Token"), i.stringify = /* @__PURE__ */ a(function m(v, y) {
      if (typeof v == "string")
        return v;
      if (Array.isArray(v)) {
        var b = "";
        return v.forEach(function(R) {
          b += m(R, y);
        }), b;
      }
      var D = {
        type: v.type,
        content: m(v.content, y),
        tag: "span",
        classes: ["token", v.type],
        attributes: {},
        language: y
      }, x = v.alias;
      x && (Array.isArray(x) ? Array.prototype.push.apply(D.classes, x) : D.classes.push(x)), o.hooks.run("wrap", D);
      var C = "";
      for (var E in D.attributes)
        C += " " + E + '="' + (D.attributes[E] || "").replace(/"/g, "&quot;") + '"';
      return "<" + D.tag + ' class="' + D.classes.join(" ") + '"' + C + ">" + D.content + "</" + D.tag + ">";
    }, "stringify");
    function l(m, v, y, b) {
      m.lastIndex = v;
      var D = m.exec(y);
      if (D && b && D[1]) {
        var x = D[1].length;
        D.index += x, D[0] = D[0].slice(x);
      }
      return D;
    }
    a(l, "matchPattern");
    function u(m, v, y, b, D, x) {
      for (var C in y)
        if (!(!y.hasOwnProperty(C) || !y[C])) {
          var E = y[C];
          E = Array.isArray(E) ? E : [E];
          for (var R = 0; R < E.length; ++R) {
            if (x && x.cause == C + "," + R)
              return;
            var F = E[R], A = F.inside, k = !!F.lookbehind, B = !!F.greedy, j = F.alias;
            if (B && !F.pattern.global) {
              var V = F.pattern.toString().match(/[imsuy]*$/)[0];
              F.pattern = RegExp(F.pattern.source, V + "g");
            }
            for (var ee = F.pattern || F, I = b.next, T = D; I !== v.tail && !(x && T >= x.reach); T += I.value.length, I = I.next) {
              var P = I.value;
              if (v.length > m.length)
                return;
              if (!(P instanceof i)) {
                var q = 1, $;
                if (B) {
                  if ($ = l(ee, T, m, k), !$ || $.index >= m.length)
                    break;
                  var _e = $.index, U = $.index + $[0].length, H = T;
                  for (H += I.value.length; _e >= H; )
                    I = I.next, H += I.value.length;
                  if (H -= I.value.length, T = H, I.value instanceof i)
                    continue;
                  for (var X = I; X !== v.tail && (H < U || typeof X.value == "string"); X = X.next)
                    q++, H += X.value.length;
                  q--, P = m.slice(T, H), $.index -= T;
                } else if ($ = l(ee, 0, P, k), !$)
                  continue;
                var _e = $.index, xe = $[0], ge = P.slice(0, _e), Ae = P.slice(_e + xe.length), Pe = T + P.length;
                x && Pe > x.reach && (x.reach = Pe);
                var He = I.prev;
                ge && (He = p(v, He, ge), T += ge.length), d(v, He, q);
                var ia = new i(C, A ? o.tokenize(xe, A) : xe, j, xe);
                if (I = p(v, He, ia), Ae && p(v, I, Ae), q > 1) {
                  var la = {
                    cause: C + "," + R,
                    reach: Pe
                  };
                  u(m, v, y, I.prev, T, la), x && la.reach > x.reach && (x.reach = la.reach);
                }
              }
            }
          }
        }
    }
    a(u, "matchGrammar");
    function c() {
      var m = { value: null, prev: null, next: null }, v = { value: null, prev: m, next: null };
      m.next = v, this.head = m, this.tail = v, this.length = 0;
    }
    a(c, "LinkedList");
    function p(m, v, y) {
      var b = v.next, D = { value: y, prev: v, next: b };
      return v.next = D, b.prev = D, m.length++, D;
    }
    a(p, "addAfter");
    function d(m, v, y) {
      for (var b = v.next, D = 0; D < y && b !== m.tail; D++)
        b = b.next;
      v.next = b, b.prev = v, m.length -= D;
    }
    a(d, "removeRange");
    function h(m) {
      for (var v = [], y = m.head.next; y !== m.tail; )
        v.push(y.value), y = y.next;
      return v;
    }
    if (a(h, "toArray"), !e.document)
      return e.addEventListener && (o.disableWorkerMessageHandler || e.addEventListener("message", function(m) {
        var v = JSON.parse(m.data), y = v.language, b = v.code, D = v.immediateClose;
        e.postMessage(o.highlight(b, o.languages[y], y)), D && e.close();
      }, !1)), o;
    var f = o.util.currentScript();
    f && (o.filename = f.src, f.hasAttribute("data-manual") && (o.manual = !0));
    function g() {
      o.manual || o.highlightAll();
    }
    if (a(g, "highlightAutomaticallyCallback"), !o.manual) {
      var w = document.readyState;
      w === "loading" || w === "interactive" && f && f.defer ? document.addEventListener("DOMContentLoaded", g) : window.requestAnimationFrame ?
      window.requestAnimationFrame(g) : window.setTimeout(g, 16);
    }
    return o;
  }(T6);
  typeof xi < "u" && xi.exports && (xi.exports = Lf);
  typeof global < "u" && (global.Prism = Lf);
});

// ../node_modules/refractor/lang/markup.js
var Gs = M((Nz, If) => {
  "use strict";
  If.exports = Us;
  Us.displayName = "markup";
  Us.aliases = ["html", "mathml", "svg", "xml", "ssml", "atom", "rss"];
  function Us(e) {
    e.languages.markup = {
      comment: {
        pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
        greedy: !0
      },
      prolog: {
        pattern: /<\?[\s\S]+?\?>/,
        greedy: !0
      },
      doctype: {
        // https://www.w3.org/TR/xml/#NT-doctypedecl
        pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: !0,
        inside: {
          "internal-subset": {
            pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
            lookbehind: !0,
            greedy: !0,
            inside: null
            // see below
          },
          string: {
            pattern: /"[^"]*"|'[^']*'/,
            greedy: !0
          },
          punctuation: /^<!|>$|[[\]]/,
          "doctype-tag": /^DOCTYPE/i,
          name: /[^\s<>'"]+/
        }
      },
      cdata: {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        greedy: !0
      },
      tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
        greedy: !0,
        inside: {
          tag: {
            pattern: /^<\/?[^\s>\/]+/,
            inside: {
              punctuation: /^<\/?/,
              namespace: /^[^\s>\/:]+:/
            }
          },
          "special-attr": [],
          "attr-value": {
            pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
            inside: {
              punctuation: [
                {
                  pattern: /^=/,
                  alias: "attr-equals"
                },
                /"|'/
              ]
            }
          },
          punctuation: /\/?>/,
          "attr-name": {
            pattern: /[^\s>\/]+/,
            inside: {
              namespace: /^[^\s>\/:]+:/
            }
          }
        }
      },
      entity: [
        {
          pattern: /&[\da-z]{1,8};/i,
          alias: "named-entity"
        },
        /&#x?[\da-f]{1,8};/i
      ]
    }, e.languages.markup.tag.inside["attr-value"].inside.entity = e.languages.markup.entity, e.languages.markup.doctype.inside["internal-su\
bset"].inside = e.languages.markup, e.hooks.add("wrap", function(t) {
      t.type === "entity" && (t.attributes.title = t.content.value.replace(/&amp;/, "&"));
    }), Object.defineProperty(e.languages.markup.tag, "addInlined", {
      /**
       * Adds an inlined language to markup.
       *
       * An example of an inlined language is CSS with `<style>` tags.
       *
       * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
       * case insensitive.
       * @param {string} lang The language key.
       * @example
       * addInlined('style', 'css');
       */
      value: /* @__PURE__ */ a(function(r, n) {
        var o = {};
        o["language-" + n] = {
          pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
          lookbehind: !0,
          inside: e.languages[n]
        }, o.cdata = /^<!\[CDATA\[|\]\]>$/i;
        var i = {
          "included-cdata": {
            pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
            inside: o
          }
        };
        i["language-" + n] = {
          pattern: /[\s\S]+/,
          inside: e.languages[n]
        };
        var l = {};
        l[r] = {
          pattern: RegExp(
            /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
              /__/g,
              function() {
                return r;
              }
            ),
            "i"
          ),
          lookbehind: !0,
          greedy: !0,
          inside: i
        }, e.languages.insertBefore("markup", "cdata", l);
      }, "addInlined")
    }), Object.defineProperty(e.languages.markup.tag, "addAttribute", {
      /**
       * Adds an pattern to highlight languages embedded in HTML attributes.
       *
       * An example of an inlined language is CSS with `style` attributes.
       *
       * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
       * case insensitive.
       * @param {string} lang The language key.
       * @example
       * addAttribute('style', 'css');
       */
      value: /* @__PURE__ */ a(function(t, r) {
        e.languages.markup.tag.inside["special-attr"].push({
          pattern: RegExp(
            /(^|["'\s])/.source + "(?:" + t + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
            "i"
          ),
          lookbehind: !0,
          inside: {
            "attr-name": /^[^\s=]+/,
            "attr-value": {
              pattern: /=[\s\S]+/,
              inside: {
                value: {
                  pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                  lookbehind: !0,
                  alias: [r, "language-" + r],
                  inside: e.languages[r]
                },
                punctuation: [
                  {
                    pattern: /^=/,
                    alias: "attr-equals"
                  },
                  /"|'/
                ]
              }
            }
          }
        });
      }, "value")
    }), e.languages.html = e.languages.markup, e.languages.mathml = e.languages.markup, e.languages.svg = e.languages.markup, e.languages.xml =
    e.languages.extend("markup", {}), e.languages.ssml = e.languages.xml, e.languages.atom = e.languages.xml, e.languages.rss = e.languages.
    xml;
  }
  a(Us, "markup");
});

// ../node_modules/refractor/lang/css.js
var Xs = M((Vz, Bf) => {
  "use strict";
  Bf.exports = Ys;
  Ys.displayName = "css";
  Ys.aliases = [];
  function Ys(e) {
    (function(t) {
      var r = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
      t.languages.css = {
        comment: /\/\*[\s\S]*?\*\//,
        atrule: {
          pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
          inside: {
            rule: /^@[\w-]+/,
            "selector-function-argument": {
              pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
              lookbehind: !0,
              alias: "selector"
            },
            keyword: {
              pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
              lookbehind: !0
            }
            // See rest below
          }
        },
        url: {
          // https://drafts.csswg.org/css-values-3/#urls
          pattern: RegExp(
            "\\burl\\((?:" + r.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)",
            "i"
          ),
          greedy: !0,
          inside: {
            function: /^url/i,
            punctuation: /^\(|\)$/,
            string: {
              pattern: RegExp("^" + r.source + "$"),
              alias: "url"
            }
          }
        },
        selector: {
          pattern: RegExp(
            `(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + r.source + ")*(?=\\s*\\{)"
          ),
          lookbehind: !0
        },
        string: {
          pattern: r,
          greedy: !0
        },
        property: {
          pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
          lookbehind: !0
        },
        important: /!important\b/i,
        function: {
          pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
          lookbehind: !0
        },
        punctuation: /[(){};:,]/
      }, t.languages.css.atrule.inside.rest = t.languages.css;
      var n = t.languages.markup;
      n && (n.tag.addInlined("style", "css"), n.tag.addAttribute("style", "css"));
    })(e);
  }
  a(Ys, "css");
});

// ../node_modules/refractor/lang/clike.js
var _f = M((Wz, Mf) => {
  "use strict";
  Mf.exports = Zs;
  Zs.displayName = "clike";
  Zs.aliases = [];
  function Zs(e) {
    e.languages.clike = {
      comment: [
        {
          pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
          lookbehind: !0,
          greedy: !0
        },
        {
          pattern: /(^|[^\\:])\/\/.*/,
          lookbehind: !0,
          greedy: !0
        }
      ],
      string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
      },
      "class-name": {
        pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: !0,
        inside: {
          punctuation: /[.\\]/
        }
      },
      keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
      boolean: /\b(?:false|true)\b/,
      function: /\b\w+(?=\()/,
      number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
      operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
      punctuation: /[{}[\];(),.:]/
    };
  }
  a(Zs, "clike");
});

// ../node_modules/refractor/lang/javascript.js
var Hf = M((Uz, Pf) => {
  "use strict";
  Pf.exports = Ks;
  Ks.displayName = "javascript";
  Ks.aliases = ["js"];
  function Ks(e) {
    e.languages.javascript = e.languages.extend("clike", {
      "class-name": [
        e.languages.clike["class-name"],
        {
          pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
          lookbehind: !0
        }
      ],
      keyword: [
        {
          pattern: /((?:^|\})\s*)catch\b/,
          lookbehind: !0
        },
        {
          pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
          lookbehind: !0
        }
      ],
      // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
      function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
      number: {
        pattern: RegExp(
          /(^|[^\w$])/.source + "(?:" + // constant
          (/NaN|Infinity/.source + "|" + // binary integer
          /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
          /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
          /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
          /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
          /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
        ),
        lookbehind: !0
      },
      operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
    }), e.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/, e.languages.
    insertBefore("javascript", "keyword", {
      regex: {
        // eslint-disable-next-line regexp/no-dupe-characters-character-class
        pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
        lookbehind: !0,
        greedy: !0,
        inside: {
          "regex-source": {
            pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
            lookbehind: !0,
            alias: "language-regex",
            inside: e.languages.regex
          },
          "regex-delimiter": /^\/|\/$/,
          "regex-flags": /^[a-z]+$/
        }
      },
      // This must be declared before keyword because we use "function" inside the look-forward
      "function-variable": {
        pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
        alias: "function"
      },
      parameter: [
        {
          pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
          lookbehind: !0,
          inside: e.languages.javascript
        },
        {
          pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
          lookbehind: !0,
          inside: e.languages.javascript
        },
        {
          pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
          lookbehind: !0,
          inside: e.languages.javascript
        },
        {
          pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
          lookbehind: !0,
          inside: e.languages.javascript
        }
      ],
      constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    }), e.languages.insertBefore("javascript", "string", {
      hashbang: {
        pattern: /^#!.*/,
        greedy: !0,
        alias: "comment"
      },
      "template-string": {
        pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
        greedy: !0,
        inside: {
          "template-punctuation": {
            pattern: /^`|`$/,
            alias: "string"
          },
          interpolation: {
            pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
            lookbehind: !0,
            inside: {
              "interpolation-punctuation": {
                pattern: /^\$\{|\}$/,
                alias: "punctuation"
              },
              rest: e.languages.javascript
            }
          },
          string: /[\s\S]+/
        }
      },
      "string-property": {
        pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
        lookbehind: !0,
        greedy: !0,
        alias: "property"
      }
    }), e.languages.insertBefore("javascript", "operator", {
      "literal-property": {
        pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
        lookbehind: !0,
        alias: "property"
      }
    }), e.languages.markup && (e.languages.markup.tag.addInlined("script", "javascript"), e.languages.markup.tag.addAttribute(
      /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.
      source,
      "javascript"
    )), e.languages.js = e.languages.javascript;
  }
  a(Ks, "javascript");
});

// ../node_modules/refractor/core.js
var $f = M((Yz, Nf) => {
  "use strict";
  var ga = typeof globalThis == "object" ? globalThis : typeof self == "object" ? self : typeof window == "object" ? window : typeof global ==
  "object" ? global : {}, I6 = G6();
  ga.Prism = { manual: !0, disableWorkerMessageHandler: !0 };
  var B6 = nf(), M6 = kf(), zf = Tf(), _6 = Gs(), P6 = Xs(), H6 = _f(), z6 = Hf();
  I6();
  var Js = {}.hasOwnProperty;
  function Of() {
  }
  a(Of, "Refractor");
  Of.prototype = zf;
  var le = new Of();
  Nf.exports = le;
  le.highlight = N6;
  le.register = va;
  le.alias = O6;
  le.registered = $6;
  le.listLanguages = V6;
  va(_6);
  va(P6);
  va(H6);
  va(z6);
  le.util.encode = q6;
  le.Token.stringify = j6;
  function va(e) {
    if (typeof e != "function" || !e.displayName)
      throw new Error("Expected `function` for `grammar`, got `" + e + "`");
    le.languages[e.displayName] === void 0 && e(le);
  }
  a(va, "register");
  function O6(e, t) {
    var r = le.languages, n = e, o, i, l, u;
    t && (n = {}, n[e] = t);
    for (o in n)
      for (i = n[o], i = typeof i == "string" ? [i] : i, l = i.length, u = -1; ++u < l; )
        r[i[u]] = r[o];
  }
  a(O6, "alias");
  function N6(e, t) {
    var r = zf.highlight, n;
    if (typeof e != "string")
      throw new Error("Expected `string` for `value`, got `" + e + "`");
    if (le.util.type(t) === "Object")
      n = t, t = null;
    else {
      if (typeof t != "string")
        throw new Error("Expected `string` for `name`, got `" + t + "`");
      if (Js.call(le.languages, t))
        n = le.languages[t];
      else
        throw new Error("Unknown language: `" + t + "` is not registered");
    }
    return r.call(this, e, n, t);
  }
  a(N6, "highlight");
  function $6(e) {
    if (typeof e != "string")
      throw new Error("Expected `string` for `language`, got `" + e + "`");
    return Js.call(le.languages, e);
  }
  a($6, "registered");
  function V6() {
    var e = le.languages, t = [], r;
    for (r in e)
      Js.call(e, r) && typeof e[r] == "object" && t.push(r);
    return t;
  }
  a(V6, "listLanguages");
  function j6(e, t, r) {
    var n;
    return typeof e == "string" ? { type: "text", value: e } : le.util.type(e) === "Array" ? W6(e, t) : (n = {
      type: e.type,
      content: le.Token.stringify(e.content, t, r),
      tag: "span",
      classes: ["token", e.type],
      attributes: {},
      language: t,
      parent: r
    }, e.alias && (n.classes = n.classes.concat(e.alias)), le.hooks.run("wrap", n), B6(
      n.tag + "." + n.classes.join("."),
      U6(n.attributes),
      n.content
    ));
  }
  a(j6, "stringify");
  function W6(e, t) {
    for (var r = [], n = e.length, o = -1, i; ++o < n; )
      i = e[o], i !== "" && i !== null && i !== void 0 && r.push(i);
    for (o = -1, n = r.length; ++o < n; )
      i = r[o], r[o] = le.Token.stringify(i, t, r);
    return r;
  }
  a(W6, "stringifyAll");
  function q6(e) {
    return e;
  }
  a(q6, "encode");
  function U6(e) {
    var t;
    for (t in e)
      e[t] = M6(e[t]);
    return e;
  }
  a(U6, "attributes");
  function G6() {
    var e = "Prism" in ga, t = e ? ga.Prism : void 0;
    return r;
    function r() {
      e ? ga.Prism = t : delete ga.Prism, e = void 0, t = void 0;
    }
  }
  a(G6, "capture");
});

// ../node_modules/react-syntax-highlighter/dist/esm/prism-light.js
var Ci, Qs, Ei, Vf = S(() => {
  nd();
  Ci = Ce($f()), Qs = ks(Ci.default, {});
  Qs.registerLanguage = function(e, t) {
    return Ci.default.register(t);
  };
  Qs.alias = function(e, t) {
    return Ci.default.alias(e, t);
  };
  Ei = Qs;
});

// ../node_modules/react-syntax-highlighter/dist/esm/index.js
var jf = S(() => {
  Fs();
});

// ../node_modules/refractor/lang/bash.js
var qf = M((eO, Wf) => {
  "use strict";
  Wf.exports = eu;
  eu.displayName = "bash";
  eu.aliases = ["shell"];
  function eu(e) {
    (function(t) {
      var r = "\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE\
|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|G\
DMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HO\
STTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHON\
E|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OST\
YPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS\
|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRE\
NT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_\
SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b", n = {
        pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
        lookbehind: !0,
        alias: "punctuation",
        // this looks reasonably well in all themes
        inside: null
        // see below
      }, o = {
        bash: n,
        environment: {
          pattern: RegExp("\\$" + r),
          alias: "constant"
        },
        variable: [
          // [0]: Arithmetic Environment
          {
            pattern: /\$?\(\([\s\S]+?\)\)/,
            greedy: !0,
            inside: {
              // If there is a $ sign at the beginning highlight $(( and )) as variable
              variable: [
                {
                  pattern: /(^\$\(\([\s\S]+)\)\)/,
                  lookbehind: !0
                },
                /^\$\(\(/
              ],
              number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
              // Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
              operator: /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
              // If there is no $ sign at the beginning highlight (( and )) as punctuation
              punctuation: /\(\(?|\)\)?|,|;/
            }
          },
          // [1]: Command Substitution
          {
            pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
            greedy: !0,
            inside: {
              variable: /^\$\(|^`|\)$|`$/
            }
          },
          // [2]: Brace expansion
          {
            pattern: /\$\{[^}]+\}/,
            greedy: !0,
            inside: {
              operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
              punctuation: /[\[\]]/,
              environment: {
                pattern: RegExp("(\\{)" + r),
                lookbehind: !0,
                alias: "constant"
              }
            }
          },
          /\$(?:\w+|[#?*!@$])/
        ],
        // Escape sequences from echo and printf's manuals, and escaped quotes.
        entity: /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/
      };
      t.languages.bash = {
        shebang: {
          pattern: /^#!\s*\/.*/,
          alias: "important"
        },
        comment: {
          pattern: /(^|[^"{\\$])#.*/,
          lookbehind: !0
        },
        "function-name": [
          // a) function foo {
          // b) foo() {
          // c) function foo() {
          // but not “foo {”
          {
            // a) and c)
            pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
            lookbehind: !0,
            alias: "function"
          },
          {
            // b)
            pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/,
            alias: "function"
          }
        ],
        // Highlight variable names as variables in for and select beginnings.
        "for-or-select": {
          pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
          alias: "variable",
          lookbehind: !0
        },
        // Highlight variable names as variables in the left-hand part
        // of assignments (“=” and “+=”).
        "assign-left": {
          pattern: /(^|[\s;|&]|[<>]\()\w+(?=\+?=)/,
          inside: {
            environment: {
              pattern: RegExp("(^|[\\s;|&]|[<>]\\()" + r),
              lookbehind: !0,
              alias: "constant"
            }
          },
          alias: "variable",
          lookbehind: !0
        },
        string: [
          // Support for Here-documents https://en.wikipedia.org/wiki/Here_document
          {
            pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
            lookbehind: !0,
            greedy: !0,
            inside: o
          },
          // Here-document with quotes around the tag
          // → No expansion (so no “inside”).
          {
            pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
            lookbehind: !0,
            greedy: !0,
            inside: {
              bash: n
            }
          },
          // “Normal” string
          {
            // https://www.gnu.org/software/bash/manual/html_node/Double-Quotes.html
            pattern: /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
            lookbehind: !0,
            greedy: !0,
            inside: o
          },
          {
            // https://www.gnu.org/software/bash/manual/html_node/Single-Quotes.html
            pattern: /(^|[^$\\])'[^']*'/,
            lookbehind: !0,
            greedy: !0
          },
          {
            // https://www.gnu.org/software/bash/manual/html_node/ANSI_002dC-Quoting.html
            pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
            greedy: !0,
            inside: {
              entity: o.entity
            }
          }
        ],
        environment: {
          pattern: RegExp("\\$?" + r),
          alias: "constant"
        },
        variable: o.variable,
        function: {
          pattern: /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
          lookbehind: !0
        },
        keyword: {
          pattern: /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
          lookbehind: !0
        },
        // https://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
        builtin: {
          pattern: /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
          lookbehind: !0,
          // Alias added to make those easier to distinguish from strings.
          alias: "class-name"
        },
        boolean: {
          pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
          lookbehind: !0
        },
        "file-descriptor": {
          pattern: /\B&\d\b/,
          alias: "important"
        },
        operator: {
          // Lots of redirections here, but not just that.
          pattern: /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
          inside: {
            "file-descriptor": {
              pattern: /^\d/,
              alias: "important"
            }
          }
        },
        punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
        number: {
          pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
          lookbehind: !0
        }
      }, n.inside = t.languages.bash;
      for (var i = [
        "comment",
        "function-name",
        "for-or-select",
        "assign-left",
        "string",
        "environment",
        "function",
        "keyword",
        "builtin",
        "boolean",
        "file-descriptor",
        "operator",
        "punctuation",
        "number"
      ], l = o.variable[1].inside, u = 0; u < i.length; u++)
        l[i[u]] = t.languages.bash[i[u]];
      t.languages.shell = t.languages.bash;
    })(e);
  }
  a(eu, "bash");
});

// ../node_modules/react-syntax-highlighter/dist/esm/languages/prism/bash.js
var Uf, Gf, Yf = S(() => {
  Uf = Ce(qf()), Gf = Uf.default;
});

// ../node_modules/react-syntax-highlighter/dist/esm/languages/prism/css.js
var Xf, Zf, Kf = S(() => {
  Xf = Ce(Xs()), Zf = Xf.default;
});

// ../node_modules/refractor/lang/graphql.js
var Qf = M((oO, Jf) => {
  "use strict";
  Jf.exports = tu;
  tu.displayName = "graphql";
  tu.aliases = [];
  function tu(e) {
    e.languages.graphql = {
      comment: /#.*/,
      description: {
        pattern: /(?:"""(?:[^"]|(?!""")")*"""|"(?:\\.|[^\\"\r\n])*")(?=\s*[a-z_])/i,
        greedy: !0,
        alias: "string",
        inside: {
          "language-markdown": {
            pattern: /(^"(?:"")?)(?!\1)[\s\S]+(?=\1$)/,
            lookbehind: !0,
            inside: e.languages.markdown
          }
        }
      },
      string: {
        pattern: /"""(?:[^"]|(?!""")")*"""|"(?:\\.|[^\\"\r\n])*"/,
        greedy: !0
      },
      number: /(?:\B-|\b)\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
      boolean: /\b(?:false|true)\b/,
      variable: /\$[a-z_]\w*/i,
      directive: {
        pattern: /@[a-z_]\w*/i,
        alias: "function"
      },
      "attr-name": {
        pattern: /\b[a-z_]\w*(?=\s*(?:\((?:[^()"]|"(?:\\.|[^\\"\r\n])*")*\))?:)/i,
        greedy: !0
      },
      "atom-input": {
        pattern: /\b[A-Z]\w*Input\b/,
        alias: "class-name"
      },
      scalar: /\b(?:Boolean|Float|ID|Int|String)\b/,
      constant: /\b[A-Z][A-Z_\d]*\b/,
      "class-name": {
        pattern: /(\b(?:enum|implements|interface|on|scalar|type|union)\s+|&\s*|:\s*|\[)[A-Z_]\w*/,
        lookbehind: !0
      },
      fragment: {
        pattern: /(\bfragment\s+|\.{3}\s*(?!on\b))[a-zA-Z_]\w*/,
        lookbehind: !0,
        alias: "function"
      },
      "definition-mutation": {
        pattern: /(\bmutation\s+)[a-zA-Z_]\w*/,
        lookbehind: !0,
        alias: "function"
      },
      "definition-query": {
        pattern: /(\bquery\s+)[a-zA-Z_]\w*/,
        lookbehind: !0,
        alias: "function"
      },
      keyword: /\b(?:directive|enum|extend|fragment|implements|input|interface|mutation|on|query|repeatable|scalar|schema|subscription|type|union)\b/,
      operator: /[!=|&]|\.{3}/,
      "property-query": /\w+(?=\s*\()/,
      object: /\w+(?=\s*\{)/,
      punctuation: /[!(){}\[\]:=,]/,
      property: /\w+/
    }, e.hooks.add("after-tokenize", /* @__PURE__ */ a(function(r) {
      if (r.language !== "graphql")
        return;
      var n = r.tokens.filter(function(v) {
        return typeof v != "string" && v.type !== "comment" && v.type !== "scalar";
      }), o = 0;
      function i(v) {
        return n[o + v];
      }
      a(i, "getToken");
      function l(v, y) {
        y = y || 0;
        for (var b = 0; b < v.length; b++) {
          var D = i(b + y);
          if (!D || D.type !== v[b])
            return !1;
        }
        return !0;
      }
      a(l, "isTokenType");
      function u(v, y) {
        for (var b = 1, D = o; D < n.length; D++) {
          var x = n[D], C = x.content;
          if (x.type === "punctuation" && typeof C == "string") {
            if (v.test(C))
              b++;
            else if (y.test(C) && (b--, b === 0))
              return D;
          }
        }
        return -1;
      }
      a(u, "findClosingBracket");
      function c(v, y) {
        var b = v.alias;
        b ? Array.isArray(b) || (v.alias = b = [b]) : v.alias = b = [], b.push(y);
      }
      for (a(c, "addAlias"); o < n.length; ) {
        var p = n[o++];
        if (p.type === "keyword" && p.content === "mutation") {
          var d = [];
          if (l(["definition-mutation", "punctuation"]) && i(1).content === "(") {
            o += 2;
            var h = u(/^\($/, /^\)$/);
            if (h === -1)
              continue;
            for (; o < h; o++) {
              var f = i(0);
              f.type === "variable" && (c(f, "variable-input"), d.push(f.content));
            }
            o = h + 1;
          }
          if (l(["punctuation", "property-query"]) && i(0).content === "{" && (o++, c(i(0), "property-mutation"), d.length > 0)) {
            var g = u(/^\{$/, /^\}$/);
            if (g === -1)
              continue;
            for (var w = o; w < g; w++) {
              var m = n[w];
              m.type === "variable" && d.indexOf(m.content) >= 0 && c(m, "variable-input");
            }
          }
        }
      }
    }, "afterTokenizeGraphql"));
  }
  a(tu, "graphql");
});

// ../node_modules/react-syntax-highlighter/dist/esm/languages/prism/graphql.js
var e5, t5, r5 = S(() => {
  e5 = Ce(Qf()), t5 = e5.default;
});

// ../node_modules/refractor/lang/js-extras.js
var o5 = M((lO, n5) => {
  "use strict";
  n5.exports = ru;
  ru.displayName = "jsExtras";
  ru.aliases = [];
  function ru(e) {
    (function(t) {
      t.languages.insertBefore("javascript", "function-variable", {
        "method-variable": {
          pattern: RegExp(
            "(\\.\\s*)" + t.languages.javascript["function-variable"].pattern.source
          ),
          lookbehind: !0,
          alias: ["function-variable", "method", "function", "property-access"]
        }
      }), t.languages.insertBefore("javascript", "function", {
        method: {
          pattern: RegExp(
            "(\\.\\s*)" + t.languages.javascript.function.source
          ),
          lookbehind: !0,
          alias: ["function", "property-access"]
        }
      }), t.languages.insertBefore("javascript", "constant", {
        "known-class-name": [
          {
            // standard built-ins
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
            pattern: /\b(?:(?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)?Array|ArrayBuffer|BigInt|Boolean|DataView|Date|Error|Function|Intl|JSON|(?:Weak)?(?:Map|Set)|Math|Number|Object|Promise|Proxy|Reflect|RegExp|String|Symbol|WebAssembly)\b/,
            alias: "class-name"
          },
          {
            // errors
            pattern: /\b(?:[A-Z]\w*)Error\b/,
            alias: "class-name"
          }
        ]
      });
      function r(c, p) {
        return RegExp(
          c.replace(/<ID>/g, function() {
            return /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/.source;
          }),
          p
        );
      }
      a(r, "withId"), t.languages.insertBefore("javascript", "keyword", {
        imports: {
          // https://tc39.es/ecma262/#sec-imports
          pattern: r(
            /(\bimport\b\s*)(?:<ID>(?:\s*,\s*(?:\*\s*as\s+<ID>|\{[^{}]*\}))?|\*\s*as\s+<ID>|\{[^{}]*\})(?=\s*\bfrom\b)/.source
          ),
          lookbehind: !0,
          inside: t.languages.javascript
        },
        exports: {
          // https://tc39.es/ecma262/#sec-exports
          pattern: r(
            /(\bexport\b\s*)(?:\*(?:\s*as\s+<ID>)?(?=\s*\bfrom\b)|\{[^{}]*\})/.source
          ),
          lookbehind: !0,
          inside: t.languages.javascript
        }
      }), t.languages.javascript.keyword.unshift(
        {
          pattern: /\b(?:as|default|export|from|import)\b/,
          alias: "module"
        },
        {
          pattern: /\b(?:await|break|catch|continue|do|else|finally|for|if|return|switch|throw|try|while|yield)\b/,
          alias: "control-flow"
        },
        {
          pattern: /\bnull\b/,
          alias: ["null", "nil"]
        },
        {
          pattern: /\bundefined\b/,
          alias: "nil"
        }
      ), t.languages.insertBefore("javascript", "operator", {
        spread: {
          pattern: /\.{3}/,
          alias: "operator"
        },
        arrow: {
          pattern: /=>/,
          alias: "operator"
        }
      }), t.languages.insertBefore("javascript", "punctuation", {
        "property-access": {
          pattern: r(/(\.\s*)#?<ID>/.source),
          lookbehind: !0
        },
        "maybe-class-name": {
          pattern: /(^|[^$\w\xA0-\uFFFF])[A-Z][$\w\xA0-\uFFFF]+/,
          lookbehind: !0
        },
        dom: {
          // this contains only a few commonly used DOM variables
          pattern: /\b(?:document|(?:local|session)Storage|location|navigator|performance|window)\b/,
          alias: "variable"
        },
        console: {
          pattern: /\bconsole(?=\s*\.)/,
          alias: "class-name"
        }
      });
      for (var n = [
        "function",
        "function-variable",
        "method",
        "method-variable",
        "property-access"
      ], o = 0; o < n.length; o++) {
        var i = n[o], l = t.languages.javascript[i];
        t.util.type(l) === "RegExp" && (l = t.languages.javascript[i] = {
          pattern: l
        });
        var u = l.inside || {};
        l.inside = u, u["maybe-class-name"] = /^[A-Z][\s\S]*/;
      }
    })(e);
  }
  a(ru, "jsExtras");
});

// ../node_modules/react-syntax-highlighter/dist/esm/languages/prism/js-extras.js
var a5, i5, l5 = S(() => {
  a5 = Ce(o5()), i5 = a5.default;
});

// ../node_modules/refractor/lang/json.js
var u5 = M((cO, s5) => {
  "use strict";
  s5.exports = nu;
  nu.displayName = "json";
  nu.aliases = ["webmanifest"];
  function nu(e) {
    e.languages.json = {
      property: {
        pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
        lookbehind: !0,
        greedy: !0
      },
      string: {
        pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
        lookbehind: !0,
        greedy: !0
      },
      comment: {
        pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
        greedy: !0
      },
      number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
      punctuation: /[{}[\],]/,
      operator: /:/,
      boolean: /\b(?:false|true)\b/,
      null: {
        pattern: /\bnull\b/,
        alias: "keyword"
      }
    }, e.languages.webmanifest = e.languages.json;
  }
  a(nu, "json");
});

// ../node_modules/react-syntax-highlighter/dist/esm/languages/prism/json.js
var c5, p5, d5 = S(() => {
  c5 = Ce(u5()), p5 = c5.default;
});

// ../node_modules/refractor/lang/jsx.js
var au = M((fO, f5) => {
  "use strict";
  f5.exports = ou;
  ou.displayName = "jsx";
  ou.aliases = [];
  function ou(e) {
    (function(t) {
      var r = t.util.clone(t.languages.javascript), n = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source, o = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.
      source, i = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;
      function l(p, d) {
        return p = p.replace(/<S>/g, function() {
          return n;
        }).replace(/<BRACES>/g, function() {
          return o;
        }).replace(/<SPREAD>/g, function() {
          return i;
        }), RegExp(p, d);
      }
      a(l, "re"), i = l(i).source, t.languages.jsx = t.languages.extend("markup", r), t.languages.jsx.tag.pattern = l(
        /<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/.
        source
      ), t.languages.jsx.tag.inside.tag.pattern = /^<\/?[^\s>\/]*/, t.languages.jsx.tag.inside["attr-value"].pattern = /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/,
      t.languages.jsx.tag.inside.tag.inside["class-name"] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/, t.languages.jsx.tag.inside.comment = r.comment, t.languages.
      insertBefore(
        "inside",
        "attr-name",
        {
          spread: {
            pattern: l(/<SPREAD>/.source),
            inside: t.languages.jsx
          }
        },
        t.languages.jsx.tag
      ), t.languages.insertBefore(
        "inside",
        "special-attr",
        {
          script: {
            // Allow for two levels of nesting
            pattern: l(/=<BRACES>/.source),
            alias: "language-javascript",
            inside: {
              "script-punctuation": {
                pattern: /^=(?=\{)/,
                alias: "punctuation"
              },
              rest: t.languages.jsx
            }
          }
        },
        t.languages.jsx.tag
      );
      var u = /* @__PURE__ */ a(function(p) {
        return p ? typeof p == "string" ? p : typeof p.content == "string" ? p.content : p.content.map(u).join("") : "";
      }, "stringifyToken"), c = /* @__PURE__ */ a(function(p) {
        for (var d = [], h = 0; h < p.length; h++) {
          var f = p[h], g = !1;
          if (typeof f != "string" && (f.type === "tag" && f.content[0] && f.content[0].type === "tag" ? f.content[0].content[0].content ===
          "</" ? d.length > 0 && d[d.length - 1].tagName === u(f.content[0].content[1]) && d.pop() : f.content[f.content.length - 1].content ===
          "/>" || d.push({
            tagName: u(f.content[0].content[1]),
            openedBraces: 0
          }) : d.length > 0 && f.type === "punctuation" && f.content === "{" ? d[d.length - 1].openedBraces++ : d.length > 0 && d[d.length -
          1].openedBraces > 0 && f.type === "punctuation" && f.content === "}" ? d[d.length - 1].openedBraces-- : g = !0), (g || typeof f ==
          "string") && d.length > 0 && d[d.length - 1].openedBraces === 0) {
            var w = u(f);
            h < p.length - 1 && (typeof p[h + 1] == "string" || p[h + 1].type === "plain-text") && (w += u(p[h + 1]), p.splice(h + 1, 1)), h >
            0 && (typeof p[h - 1] == "string" || p[h - 1].type === "plain-text") && (w = u(p[h - 1]) + w, p.splice(h - 1, 1), h--), p[h] = new t.
            Token(
              "plain-text",
              w,
              null,
              w
            );
          }
          f.content && typeof f.content != "string" && c(f.content);
        }
      }, "walkTokens");
      t.hooks.add("after-tokenize", function(p) {
        p.language !== "jsx" && p.language !== "tsx" || c(p.tokens);
      });
    })(e);
  }
  a(ou, "jsx");
});

// ../node_modules/react-syntax-highlighter/dist/esm/languages/prism/jsx.js
var h5, m5, g5 = S(() => {
  h5 = Ce(au()), m5 = h5.default;
});

// ../node_modules/refractor/lang/markdown.js
var w5 = M((gO, v5) => {
  "use strict";
  v5.exports = iu;
  iu.displayName = "markdown";
  iu.aliases = ["md"];
  function iu(e) {
    (function(t) {
      var r = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?![\r\n]))/.source;
      function n(h) {
        return h = h.replace(/<inner>/g, function() {
          return r;
        }), RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + "(?:" + h + ")");
      }
      a(n, "createInline");
      var o = /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/.source, i = /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.
      replace(
        /__/g,
        function() {
          return o;
        }
      ), l = /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/.source;
      t.languages.markdown = t.languages.extend("markup", {}), t.languages.insertBefore("markdown", "prolog", {
        "front-matter-block": {
          pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
          lookbehind: !0,
          greedy: !0,
          inside: {
            punctuation: /^---|---$/,
            "front-matter": {
              pattern: /\S+(?:\s+\S+)*/,
              alias: ["yaml", "language-yaml"],
              inside: t.languages.yaml
            }
          }
        },
        blockquote: {
          // > ...
          pattern: /^>(?:[\t ]*>)*/m,
          alias: "punctuation"
        },
        table: {
          pattern: RegExp(
            "^" + i + l + "(?:" + i + ")*",
            "m"
          ),
          inside: {
            "table-data-rows": {
              pattern: RegExp(
                "^(" + i + l + ")(?:" + i + ")*$"
              ),
              lookbehind: !0,
              inside: {
                "table-data": {
                  pattern: RegExp(o),
                  inside: t.languages.markdown
                },
                punctuation: /\|/
              }
            },
            "table-line": {
              pattern: RegExp("^(" + i + ")" + l + "$"),
              lookbehind: !0,
              inside: {
                punctuation: /\||:?-{3,}:?/
              }
            },
            "table-header-row": {
              pattern: RegExp("^" + i + "$"),
              inside: {
                "table-header": {
                  pattern: RegExp(o),
                  alias: "important",
                  inside: t.languages.markdown
                },
                punctuation: /\|/
              }
            }
          }
        },
        code: [
          {
            // Prefixed by 4 spaces or 1 tab and preceded by an empty line
            pattern: /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
            lookbehind: !0,
            alias: "keyword"
          },
          {
            // ```optional language
            // code block
            // ```
            pattern: /^```[\s\S]*?^```$/m,
            greedy: !0,
            inside: {
              "code-block": {
                pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
                lookbehind: !0
              },
              "code-language": {
                pattern: /^(```).+/,
                lookbehind: !0
              },
              punctuation: /```/
            }
          }
        ],
        title: [
          {
            // title 1
            // =======
            // title 2
            // -------
            pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
            alias: "important",
            inside: {
              punctuation: /==+$|--+$/
            }
          },
          {
            // # title 1
            // ###### title 6
            pattern: /(^\s*)#.+/m,
            lookbehind: !0,
            alias: "important",
            inside: {
              punctuation: /^#+|#+$/
            }
          }
        ],
        hr: {
          // ***
          // ---
          // * * *
          // -----------
          pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
          lookbehind: !0,
          alias: "punctuation"
        },
        list: {
          // * item
          // + item
          // - item
          // 1. item
          pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
          lookbehind: !0,
          alias: "punctuation"
        },
        "url-reference": {
          // [id]: http://example.com "Optional title"
          // [id]: http://example.com 'Optional title'
          // [id]: http://example.com (Optional title)
          // [id]: <http://example.com> "Optional title"
          pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
          inside: {
            variable: {
              pattern: /^(!?\[)[^\]]+/,
              lookbehind: !0
            },
            string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
            punctuation: /^[\[\]!:]|[<>]/
          },
          alias: "url"
        },
        bold: {
          // **strong**
          // __strong__
          // allow one nested instance of italic text using the same delimiter
          pattern: n(
            /\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/.source
          ),
          lookbehind: !0,
          greedy: !0,
          inside: {
            content: {
              pattern: /(^..)[\s\S]+(?=..$)/,
              lookbehind: !0,
              inside: {}
              // see below
            },
            punctuation: /\*\*|__/
          }
        },
        italic: {
          // *em*
          // _em_
          // allow one nested instance of bold text using the same delimiter
          pattern: n(
            /\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/.source
          ),
          lookbehind: !0,
          greedy: !0,
          inside: {
            content: {
              pattern: /(^.)[\s\S]+(?=.$)/,
              lookbehind: !0,
              inside: {}
              // see below
            },
            punctuation: /[*_]/
          }
        },
        strike: {
          // ~~strike through~~
          // ~strike~
          // eslint-disable-next-line regexp/strict
          pattern: n(/(~~?)(?:(?!~)<inner>)+\2/.source),
          lookbehind: !0,
          greedy: !0,
          inside: {
            content: {
              pattern: /(^~~?)[\s\S]+(?=\1$)/,
              lookbehind: !0,
              inside: {}
              // see below
            },
            punctuation: /~~?/
          }
        },
        "code-snippet": {
          // `code`
          // ``code``
          pattern: /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
          lookbehind: !0,
          greedy: !0,
          alias: ["code", "keyword"]
        },
        url: {
          // [example](http://example.com "Optional title")
          // [example][id]
          // [example] [id]
          pattern: n(
            /!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/.source
          ),
          lookbehind: !0,
          greedy: !0,
          inside: {
            operator: /^!/,
            content: {
              pattern: /(^\[)[^\]]+(?=\])/,
              lookbehind: !0,
              inside: {}
              // see below
            },
            variable: {
              pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/,
              lookbehind: !0
            },
            url: {
              pattern: /(^\]\()[^\s)]+/,
              lookbehind: !0
            },
            string: {
              pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,
              lookbehind: !0
            }
          }
        }
      }), ["url", "bold", "italic", "strike"].forEach(function(h) {
        ["url", "bold", "italic", "strike", "code-snippet"].forEach(function(f) {
          h !== f && (t.languages.markdown[h].inside.content.inside[f] = t.languages.markdown[f]);
        });
      }), t.hooks.add("after-tokenize", function(h) {
        if (h.language !== "markdown" && h.language !== "md")
          return;
        function f(g) {
          if (!(!g || typeof g == "string"))
            for (var w = 0, m = g.length; w < m; w++) {
              var v = g[w];
              if (v.type !== "code") {
                f(v.content);
                continue;
              }
              var y = v.content[1], b = v.content[3];
              if (y && b && y.type === "code-language" && b.type === "code-block" && typeof y.content == "string") {
                var D = y.content.replace(/\b#/g, "sharp").replace(/\b\+\+/g, "pp");
                D = (/[a-z][\w-]*/i.exec(D) || [""])[0].toLowerCase();
                var x = "language-" + D;
                b.alias ? typeof b.alias == "string" ? b.alias = [b.alias, x] : b.alias.push(x) : b.alias = [x];
              }
            }
        }
        a(f, "walkTokens"), f(h.tokens);
      }), t.hooks.add("wrap", function(h) {
        if (h.type === "code-block") {
          for (var f = "", g = 0, w = h.classes.length; g < w; g++) {
            var m = h.classes[g], v = /language-(.+)/.exec(m);
            if (v) {
              f = v[1];
              break;
            }
          }
          var y = t.languages[f];
          if (y)
            h.content = t.highlight(
              d(h.content.value),
              y,
              f
            );
          else if (f && f !== "none" && t.plugins.autoloader) {
            var b = "md-" + (/* @__PURE__ */ new Date()).valueOf() + "-" + Math.floor(Math.random() * 1e16);
            h.attributes.id = b, t.plugins.autoloader.loadLanguages(f, function() {
              var D = document.getElementById(b);
              D && (D.innerHTML = t.highlight(
                D.textContent,
                t.languages[f],
                f
              ));
            });
          }
        }
      });
      var u = RegExp(t.languages.markup.tag.pattern.source, "gi"), c = {
        amp: "&",
        lt: "<",
        gt: ">",
        quot: '"'
      }, p = String.fromCodePoint || String.fromCharCode;
      function d(h) {
        var f = h.replace(u, "");
        return f = f.replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi, function(g, w) {
          if (w = w.toLowerCase(), w[0] === "#") {
            var m;
            return w[1] === "x" ? m = parseInt(w.slice(2), 16) : m = Number(w.slice(1)), p(m);
          } else {
            var v = c[w];
            return v || g;
          }
        }), f;
      }
      a(d, "textContent"), t.languages.md = t.languages.markdown;
    })(e);
  }
  a(iu, "markdown");
});

// ../node_modules/react-syntax-highlighter/dist/esm/languages/prism/markdown.js
var b5, y5, D5 = S(() => {
  b5 = Ce(w5()), y5 = b5.default;
});

// ../node_modules/react-syntax-highlighter/dist/esm/languages/prism/markup.js
var x5, C5, E5 = S(() => {
  x5 = Ce(Gs()), C5 = x5.default;
});

// ../node_modules/refractor/lang/typescript.js
var su = M((yO, R5) => {
  "use strict";
  R5.exports = lu;
  lu.displayName = "typescript";
  lu.aliases = ["ts"];
  function lu(e) {
    (function(t) {
      t.languages.typescript = t.languages.extend("javascript", {
        "class-name": {
          pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
          lookbehind: !0,
          greedy: !0,
          inside: null
          // see below
        },
        builtin: /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/
      }), t.languages.typescript.keyword.push(
        /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
        // keywords that have to be followed by an identifier
        /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
        // This is for `import type *, {}`
        /\btype\b(?=\s*(?:[\{*]|$))/
      ), delete t.languages.typescript.parameter, delete t.languages.typescript["literal-property"];
      var r = t.languages.extend("typescript", {});
      delete r["class-name"], t.languages.typescript["class-name"].inside = r, t.languages.insertBefore("typescript", "function", {
        decorator: {
          pattern: /@[$\w\xA0-\uFFFF]+/,
          inside: {
            at: {
              pattern: /^@/,
              alias: "operator"
            },
            function: /^[\s\S]+/
          }
        },
        "generic-function": {
          // e.g. foo<T extends "bar" | "baz">( ...
          pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
          greedy: !0,
          inside: {
            function: /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
            generic: {
              pattern: /<[\s\S]+/,
              // everything after the first <
              alias: "class-name",
              inside: r
            }
          }
        }
      }), t.languages.ts = t.languages.typescript;
    })(e);
  }
  a(lu, "typescript");
});

// ../node_modules/refractor/lang/tsx.js
var A5 = M((xO, S5) => {
  "use strict";
  var Y6 = au(), X6 = su();
  S5.exports = uu;
  uu.displayName = "tsx";
  uu.aliases = [];
  function uu(e) {
    e.register(Y6), e.register(X6), function(t) {
      var r = t.util.clone(t.languages.typescript);
      t.languages.tsx = t.languages.extend("jsx", r), delete t.languages.tsx.parameter, delete t.languages.tsx["literal-property"];
      var n = t.languages.tsx.tag;
      n.pattern = RegExp(
        /(^|[^\w$]|(?=<\/))/.source + "(?:" + n.pattern.source + ")",
        n.pattern.flags
      ), n.lookbehind = !0;
    }(e);
  }
  a(uu, "tsx");
});

// ../node_modules/react-syntax-highlighter/dist/esm/languages/prism/tsx.js
var F5, k5, L5 = S(() => {
  F5 = Ce(A5()), k5 = F5.default;
});

// ../node_modules/react-syntax-highlighter/dist/esm/languages/prism/typescript.js
var T5, I5, B5 = S(() => {
  T5 = Ce(su()), I5 = T5.default;
});

// ../node_modules/refractor/lang/yaml.js
var _5 = M((SO, M5) => {
  "use strict";
  M5.exports = cu;
  cu.displayName = "yaml";
  cu.aliases = ["yml"];
  function cu(e) {
    (function(t) {
      var r = /[*&][^\s[\]{},]+/, n = /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/, o = "(?:" + n.source +
      "(?:[ 	]+" + r.source + ")?|" + r.source + "(?:[ 	]+" + n.source + ")?)", i = /(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.
      source.replace(
        /<PLAIN>/g,
        function() {
          return /[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source;
        }
      ), l = /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;
      function u(c, p) {
        p = (p || "").replace(/m/g, "") + "m";
        var d = /([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g, function() {
          return o;
        }).replace(/<<value>>/g, function() {
          return c;
        });
        return RegExp(d, p);
      }
      a(u, "createValuePattern"), t.languages.yaml = {
        scalar: {
          pattern: RegExp(
            /([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(
              /<<prop>>/g,
              function() {
                return o;
              }
            )
          ),
          lookbehind: !0,
          alias: "string"
        },
        comment: /#.*/,
        key: {
          pattern: RegExp(
            /((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g, function() {
              return o;
            }).replace(/<<key>>/g, function() {
              return "(?:" + i + "|" + l + ")";
            })
          ),
          lookbehind: !0,
          greedy: !0,
          alias: "atrule"
        },
        directive: {
          pattern: /(^[ \t]*)%.+/m,
          lookbehind: !0,
          alias: "important"
        },
        datetime: {
          pattern: u(
            /\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.
            source
          ),
          lookbehind: !0,
          alias: "number"
        },
        boolean: {
          pattern: u(/false|true/.source, "i"),
          lookbehind: !0,
          alias: "important"
        },
        null: {
          pattern: u(/null|~/.source, "i"),
          lookbehind: !0,
          alias: "important"
        },
        string: {
          pattern: u(l),
          lookbehind: !0,
          greedy: !0
        },
        number: {
          pattern: u(
            /[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source,
            "i"
          ),
          lookbehind: !0
        },
        tag: n,
        important: r,
        punctuation: /---|[:[\]{}\-,|>?]|\.\.\./
      }, t.languages.yml = t.languages.yaml;
    })(e);
  }
  a(cu, "yaml");
});

// ../node_modules/react-syntax-highlighter/dist/esm/languages/prism/yaml.js
var P5, H5, z5 = S(() => {
  P5 = Ce(_5()), H5 = P5.default;
});

// src/components/components/ActionBar/ActionBar.tsx
import O5 from "react";
import { styled as N5 } from "@storybook/core/theming";
var Z6, $5, pu, du = S(() => {
  "use strict";
  Z6 = N5.div(({ theme: e }) => ({
    position: "absolute",
    bottom: 0,
    right: 0,
    maxWidth: "100%",
    display: "flex",
    background: e.background.content,
    zIndex: 1
  })), $5 = N5.button(
    ({ theme: e }) => ({
      margin: 0,
      border: "0 none",
      padding: "4px 10px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      color: e.color.defaultText,
      background: e.background.content,
      fontSize: 12,
      lineHeight: "16px",
      fontFamily: e.typography.fonts.base,
      fontWeight: e.typography.weight.bold,
      borderTop: `1px solid ${e.appBorderColor}`,
      borderLeft: `1px solid ${e.appBorderColor}`,
      marginLeft: -1,
      borderRadius: "4px 0 0 0",
      "&:not(:last-child)": { borderRight: `1px solid ${e.appBorderColor}` },
      "& + *": {
        borderLeft: `1px solid ${e.appBorderColor}`,
        borderRadius: 0
      },
      "&:focus": {
        boxShadow: `${e.color.secondary} 0 -3px 0 0 inset`,
        outline: "0 none"
      }
    }),
    ({ disabled: e }) => e && {
      cursor: "not-allowed",
      opacity: 0.5
    }
  );
  $5.displayName = "ActionButton";
  pu = /* @__PURE__ */ a(({ actionItems: e, ...t }) => /* @__PURE__ */ O5.createElement(Z6, { ...t }, e.map(({ title: r, className: n, onClick: o,
  disabled: i }, l) => /* @__PURE__ */ O5.createElement($5, { key: l, className: n, onClick: o, disabled: !!i }, r))), "ActionBar");
});

// ../node_modules/@radix-ui/react-compose-refs/dist/index.mjs
import * as V5 from "react";
function K6(e, t) {
  typeof e == "function" ? e(t) : e != null && (e.current = t);
}
function fu(...e) {
  return (t) => e.forEach((r) => K6(r, t));
}
function Ht(...e) {
  return V5.useCallback(fu(...e), e);
}
var Ri = S(() => {
  a(K6, "setRef");
  a(fu, "composeRefs");
  a(Ht, "useComposedRefs");
});

// ../node_modules/@radix-ui/react-primitive/node_modules/@radix-ui/react-slot/dist/index.mjs
import * as Ee from "react";
import { Fragment as J6, jsx as hu } from "react/jsx-runtime";
function eb(e) {
  return Ee.isValidElement(e) && e.type === Q6;
}
function tb(e, t) {
  let r = { ...t };
  for (let n in t) {
    let o = e[n], i = t[n];
    /^on[A-Z]/.test(n) ? o && i ? r[n] = (...u) => {
      i(...u), o(...u);
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...i } : n === "className" && (r[n] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
function rb(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref :
  e.props.ref || e.ref);
}
var gu, mu, Q6, j5 = S(() => {
  Ri();
  gu = Ee.forwardRef((e, t) => {
    let { children: r, ...n } = e, o = Ee.Children.toArray(r), i = o.find(eb);
    if (i) {
      let l = i.props.children, u = o.map((c) => c === i ? Ee.Children.count(l) > 1 ? Ee.Children.only(null) : Ee.isValidElement(l) ? l.props.
      children : null : c);
      return /* @__PURE__ */ hu(mu, { ...n, ref: t, children: Ee.isValidElement(l) ? Ee.cloneElement(l, void 0, u) : null });
    }
    return /* @__PURE__ */ hu(mu, { ...n, ref: t, children: r });
  });
  gu.displayName = "Slot";
  mu = Ee.forwardRef((e, t) => {
    let { children: r, ...n } = e;
    if (Ee.isValidElement(r)) {
      let o = rb(r);
      return Ee.cloneElement(r, {
        ...tb(n, r.props),
        // @ts-ignore
        ref: t ? fu(t, o) : o
      });
    }
    return Ee.Children.count(r) > 1 ? Ee.Children.only(null) : null;
  });
  mu.displayName = "SlotClone";
  Q6 = /* @__PURE__ */ a(({ children: e }) => /* @__PURE__ */ hu(J6, { children: e }), "Slottable");
  a(eb, "isSlottable");
  a(tb, "mergeProps");
  a(rb, "getElementRef");
});

// ../node_modules/@radix-ui/react-primitive/dist/index.mjs
import * as W5 from "react";
import * as nb from "react-dom";
import { jsx as ob } from "react/jsx-runtime";
var ab, En, q5 = S(() => {
  j5();
  ab = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "span",
    "svg",
    "ul"
  ], En = ab.reduce((e, t) => {
    let r = W5.forwardRef((n, o) => {
      let { asChild: i, ...l } = n, u = i ? gu : t;
      return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ ob(u, { ...l, ref: o });
    });
    return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
  }, {});
});

// ../node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
import * as U5 from "react";
var wa, vu = S(() => {
  wa = globalThis?.document ? U5.useLayoutEffect : () => {
  };
});

// ../node_modules/@radix-ui/react-scroll-area/node_modules/@radix-ui/react-presence/dist/index.mjs
import * as Ne from "react";
import * as G5 from "react-dom";
import * as Y5 from "react";
function ib(e, t) {
  return Y5.useReducer((r, n) => t[r][n] ?? r, e);
}
function lb(e) {
  let [t, r] = Ne.useState(), n = Ne.useRef({}), o = Ne.useRef(e), i = Ne.useRef("none"), l = e ? "mounted" : "unmounted", [u, c] = ib(l, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return Ne.useEffect(() => {
    let p = Si(n.current);
    i.current = u === "mounted" ? p : "none";
  }, [u]), wa(() => {
    let p = n.current, d = o.current;
    if (d !== e) {
      let f = i.current, g = Si(p);
      e ? c("MOUNT") : g === "none" || p?.display === "none" ? c("UNMOUNT") : c(d && f !== g ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, c]), wa(() => {
    if (t) {
      let p = /* @__PURE__ */ a((h) => {
        let g = Si(n.current).includes(h.animationName);
        h.target === t && g && G5.flushSync(() => c("ANIMATION_END"));
      }, "handleAnimationEnd"), d = /* @__PURE__ */ a((h) => {
        h.target === t && (i.current = Si(n.current));
      }, "handleAnimationStart");
      return t.addEventListener("animationstart", d), t.addEventListener("animationcancel", p), t.addEventListener("animationend", p), () => {
        t.removeEventListener("animationstart", d), t.removeEventListener("animationcancel", p), t.removeEventListener("animationend", p);
      };
    } else
      c("ANIMATION_END");
  }, [t, c]), {
    isPresent: ["mounted", "unmountSuspended"].includes(u),
    ref: Ne.useCallback((p) => {
      p && (n.current = getComputedStyle(p)), r(p);
    }, [])
  };
}
function Si(e) {
  return e?.animationName || "none";
}
function sb(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref :
  e.props.ref || e.ref);
}
var Rn, X5 = S(() => {
  "use client";
  Ri();
  vu();
  a(ib, "useStateMachine");
  Rn = /* @__PURE__ */ a((e) => {
    let { present: t, children: r } = e, n = lb(t), o = typeof r == "function" ? r({ present: n.isPresent }) : Ne.Children.only(r), i = Ht(n.
    ref, sb(o));
    return typeof r == "function" || n.isPresent ? Ne.cloneElement(o, { ref: i }) : null;
  }, "Presence");
  Rn.displayName = "Presence";
  a(lb, "usePresence");
  a(Si, "getAnimationName");
  a(sb, "getElementRef");
});

// ../node_modules/@radix-ui/react-scroll-area/node_modules/@radix-ui/react-context/dist/index.mjs
import * as zt from "react";
import { jsx as ub } from "react/jsx-runtime";
function Z5(e, t = []) {
  let r = [];
  function n(i, l) {
    let u = zt.createContext(l), c = r.length;
    r = [...r, l];
    function p(h) {
      let { scope: f, children: g, ...w } = h, m = f?.[e][c] || u, v = zt.useMemo(() => w, Object.values(w));
      return /* @__PURE__ */ ub(m.Provider, { value: v, children: g });
    }
    a(p, "Provider");
    function d(h, f) {
      let g = f?.[e][c] || u, w = zt.useContext(g);
      if (w) return w;
      if (l !== void 0) return l;
      throw new Error(`\`${h}\` must be used within \`${i}\``);
    }
    return a(d, "useContext2"), p.displayName = i + "Provider", [p, d];
  }
  a(n, "createContext3");
  let o = /* @__PURE__ */ a(() => {
    let i = r.map((l) => zt.createContext(l));
    return /* @__PURE__ */ a(function(u) {
      let c = u?.[e] || i;
      return zt.useMemo(
        () => ({ [`__scope${e}`]: { ...u, [e]: c } }),
        [u, c]
      );
    }, "useScope");
  }, "createScope");
  return o.scopeName = e, [n, cb(o, ...t)];
}
function cb(...e) {
  let t = e[0];
  if (e.length === 1) return t;
  let r = /* @__PURE__ */ a(() => {
    let n = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return /* @__PURE__ */ a(function(i) {
      let l = n.reduce((u, { useScope: c, scopeName: p }) => {
        let h = c(i)[`__scope${p}`];
        return { ...u, ...h };
      }, {});
      return zt.useMemo(() => ({ [`__scope${t.scopeName}`]: l }), [l]);
    }, "useComposedScopes");
  }, "createScope");
  return r.scopeName = t.scopeName, r;
}
var K5 = S(() => {
  a(Z5, "createContextScope");
  a(cb, "composeContextScopes");
});

// ../node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
import * as Sn from "react";
function ar(e) {
  let t = Sn.useRef(e);
  return Sn.useEffect(() => {
    t.current = e;
  }), Sn.useMemo(() => (...r) => t.current?.(...r), []);
}
var J5 = S(() => {
  a(ar, "useCallbackRef");
});

// ../node_modules/@radix-ui/react-direction/dist/index.mjs
import * as Ai from "react";
import { jsx as eN } from "react/jsx-runtime";
function Q5(e) {
  let t = Ai.useContext(pb);
  return e || t || "ltr";
}
var pb, e2 = S(() => {
  pb = Ai.createContext(void 0);
  a(Q5, "useDirection");
});

// ../node_modules/@radix-ui/number/dist/index.mjs
function t2(e, [t, r]) {
  return Math.min(r, Math.max(t, e));
}
var r2 = S(() => {
  a(t2, "clamp");
});

// ../node_modules/@radix-ui/primitive/dist/index.mjs
function ir(e, t, { checkForDefaultPrevented: r = !0 } = {}) {
  return /* @__PURE__ */ a(function(o) {
    if (e?.(o), r === !1 || !o.defaultPrevented)
      return t?.(o);
  }, "handleEvent");
}
var n2 = S(() => {
  a(ir, "composeEventHandlers");
});

// ../node_modules/@radix-ui/react-scroll-area/dist/index.mjs
import * as L from "react";
import * as a2 from "react";
import { Fragment as fb, jsx as G, jsxs as hb } from "react/jsx-runtime";
function db(e, t) {
  return a2.useReducer((r, n) => t[r][n] ?? r, e);
}
function ki(e) {
  return e ? parseInt(e, 10) : 0;
}
function g2(e, t) {
  let r = e / t;
  return isNaN(r) ? 0 : r;
}
function Li(e) {
  let t = g2(e.viewport, e.content), r = e.scrollbar.paddingStart + e.scrollbar.paddingEnd, n = (e.scrollbar.size - r) * t;
  return Math.max(n, 18);
}
function Cb(e, t, r, n = "ltr") {
  let o = Li(r), i = o / 2, l = t || i, u = o - l, c = r.scrollbar.paddingStart + l, p = r.scrollbar.size - r.scrollbar.paddingEnd - u, d = r.
  content - r.viewport, h = n === "ltr" ? [0, d] : [d * -1, 0];
  return v2([c, p], h)(e);
}
function o2(e, t, r = "ltr") {
  let n = Li(t), o = t.scrollbar.paddingStart + t.scrollbar.paddingEnd, i = t.scrollbar.size - o, l = t.content - t.viewport, u = i - n, c = r ===
  "ltr" ? [0, l] : [l * -1, 0], p = t2(e, c);
  return v2([0, l], [0, u])(p);
}
function v2(e, t) {
  return (r) => {
    if (e[0] === e[1] || t[0] === t[1]) return t[0];
    let n = (t[1] - t[0]) / (e[1] - e[0]);
    return t[0] + n * (r - e[0]);
  };
}
function w2(e, t) {
  return e > 0 && e < t;
}
function Ti(e, t) {
  let r = ar(e), n = L.useRef(0);
  return L.useEffect(() => () => window.clearTimeout(n.current), []), L.useCallback(() => {
    window.clearTimeout(n.current), n.current = window.setTimeout(r, t);
  }, [r, t]);
}
function An(e, t) {
  let r = ar(t);
  wa(() => {
    let n = 0;
    if (e) {
      let o = new ResizeObserver(() => {
        cancelAnimationFrame(n), n = window.requestAnimationFrame(r);
      });
      return o.observe(e), () => {
        window.cancelAnimationFrame(n), o.unobserve(e);
      };
    }
  }, [e, r]);
}
function Rb(e, t) {
  let { asChild: r, children: n } = e;
  if (!r) return typeof t == "function" ? t(n) : t;
  let o = L.Children.only(n);
  return L.cloneElement(o, {
    children: typeof t == "function" ? t(o.props.children) : t
  });
}
var wu, i2, vN, mb, et, l2, s2, u2, Rt, c2, gb, vb, p2, bu, wb, bb, yb, d2, f2, Fi, h2, Db, yu, m2, xb, Eb, b2, y2, D2, x2, C2, E2 = S(() => {
  "use client";
  q5();
  X5();
  K5();
  Ri();
  J5();
  e2();
  vu();
  r2();
  n2();
  a(db, "useStateMachine");
  wu = "ScrollArea", [i2, vN] = Z5(wu), [mb, et] = i2(wu), l2 = L.forwardRef(
    (e, t) => {
      let {
        __scopeScrollArea: r,
        type: n = "hover",
        dir: o,
        scrollHideDelay: i = 600,
        ...l
      } = e, [u, c] = L.useState(null), [p, d] = L.useState(null), [h, f] = L.useState(null), [g, w] = L.useState(null), [m, v] = L.useState(
      null), [y, b] = L.useState(0), [D, x] = L.useState(0), [C, E] = L.useState(!1), [R, F] = L.useState(!1), A = Ht(t, (B) => c(B)), k = Q5(
      o);
      return /* @__PURE__ */ G(
        mb,
        {
          scope: r,
          type: n,
          dir: k,
          scrollHideDelay: i,
          scrollArea: u,
          viewport: p,
          onViewportChange: d,
          content: h,
          onContentChange: f,
          scrollbarX: g,
          onScrollbarXChange: w,
          scrollbarXEnabled: C,
          onScrollbarXEnabledChange: E,
          scrollbarY: m,
          onScrollbarYChange: v,
          scrollbarYEnabled: R,
          onScrollbarYEnabledChange: F,
          onCornerWidthChange: b,
          onCornerHeightChange: x,
          children: /* @__PURE__ */ G(
            En.div,
            {
              dir: k,
              ...l,
              ref: A,
              style: {
                position: "relative",
                // Pass corner sizes as CSS vars to reduce re-renders of context consumers
                "--radix-scroll-area-corner-width": y + "px",
                "--radix-scroll-area-corner-height": D + "px",
                ...e.style
              }
            }
          )
        }
      );
    }
  );
  l2.displayName = wu;
  s2 = "ScrollAreaViewport", u2 = L.forwardRef(
    (e, t) => {
      let { __scopeScrollArea: r, children: n, asChild: o, nonce: i, ...l } = e, u = et(s2, r), c = L.useRef(null), p = Ht(t, c, u.onViewportChange);
      return /* @__PURE__ */ hb(fb, { children: [
        /* @__PURE__ */ G(
          "style",
          {
            dangerouslySetInnerHTML: {
              __html: `
[data-radix-scroll-area-viewport] {
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}
[data-radix-scroll-area-viewport]::-webkit-scrollbar {
  display: none;
}
:where([data-radix-scroll-area-viewport]) {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
:where([data-radix-scroll-area-content]) {
  flex-grow: 1;
}
`
            },
            nonce: i
          }
        ),
        /* @__PURE__ */ G(
          En.div,
          {
            "data-radix-scroll-area-viewport": "",
            ...l,
            asChild: o,
            ref: p,
            style: {
              /**
               * We don't support `visible` because the intention is to have at least one scrollbar
               * if this component is used and `visible` will behave like `auto` in that case
               * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#description
               *
               * We don't handle `auto` because the intention is for the native implementation
               * to be hidden if using this component. We just want to ensure the node is scrollable
               * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
               * the browser from having to work out whether to render native scrollbars or not,
               * we tell it to with the intention of hiding them in CSS.
               */
              overflowX: u.scrollbarXEnabled ? "scroll" : "hidden",
              overflowY: u.scrollbarYEnabled ? "scroll" : "hidden",
              ...e.style
            },
            children: Rb({ asChild: o, children: n }, (d) => /* @__PURE__ */ G(
              "div",
              {
                "data-radix-scroll-area-content": "",
                ref: u.onContentChange,
                style: { minWidth: u.scrollbarXEnabled ? "fit-content" : void 0 },
                children: d
              }
            ))
          }
        )
      ] });
    }
  );
  u2.displayName = s2;
  Rt = "ScrollAreaScrollbar", c2 = L.forwardRef(
    (e, t) => {
      let { forceMount: r, ...n } = e, o = et(Rt, e.__scopeScrollArea), { onScrollbarXEnabledChange: i, onScrollbarYEnabledChange: l } = o, u = e.
      orientation === "horizontal";
      return L.useEffect(() => (u ? i(!0) : l(!0), () => {
        u ? i(!1) : l(!1);
      }), [u, i, l]), o.type === "hover" ? /* @__PURE__ */ G(gb, { ...n, ref: t, forceMount: r }) : o.type === "scroll" ? /* @__PURE__ */ G(
      vb, { ...n, ref: t, forceMount: r }) : o.type === "auto" ? /* @__PURE__ */ G(p2, { ...n, ref: t, forceMount: r }) : o.type === "always" ?
      /* @__PURE__ */ G(bu, { ...n, ref: t }) : null;
    }
  );
  c2.displayName = Rt;
  gb = L.forwardRef((e, t) => {
    let { forceMount: r, ...n } = e, o = et(Rt, e.__scopeScrollArea), [i, l] = L.useState(!1);
    return L.useEffect(() => {
      let u = o.scrollArea, c = 0;
      if (u) {
        let p = /* @__PURE__ */ a(() => {
          window.clearTimeout(c), l(!0);
        }, "handlePointerEnter"), d = /* @__PURE__ */ a(() => {
          c = window.setTimeout(() => l(!1), o.scrollHideDelay);
        }, "handlePointerLeave");
        return u.addEventListener("pointerenter", p), u.addEventListener("pointerleave", d), () => {
          window.clearTimeout(c), u.removeEventListener("pointerenter", p), u.removeEventListener("pointerleave", d);
        };
      }
    }, [o.scrollArea, o.scrollHideDelay]), /* @__PURE__ */ G(Rn, { present: r || i, children: /* @__PURE__ */ G(
      p2,
      {
        "data-state": i ? "visible" : "hidden",
        ...n,
        ref: t
      }
    ) });
  }), vb = L.forwardRef((e, t) => {
    let { forceMount: r, ...n } = e, o = et(Rt, e.__scopeScrollArea), i = e.orientation === "horizontal", l = Ti(() => c("SCROLL_END"), 100),
    [u, c] = db("hidden", {
      hidden: {
        SCROLL: "scrolling"
      },
      scrolling: {
        SCROLL_END: "idle",
        POINTER_ENTER: "interacting"
      },
      interacting: {
        SCROLL: "interacting",
        POINTER_LEAVE: "idle"
      },
      idle: {
        HIDE: "hidden",
        SCROLL: "scrolling",
        POINTER_ENTER: "interacting"
      }
    });
    return L.useEffect(() => {
      if (u === "idle") {
        let p = window.setTimeout(() => c("HIDE"), o.scrollHideDelay);
        return () => window.clearTimeout(p);
      }
    }, [u, o.scrollHideDelay, c]), L.useEffect(() => {
      let p = o.viewport, d = i ? "scrollLeft" : "scrollTop";
      if (p) {
        let h = p[d], f = /* @__PURE__ */ a(() => {
          let g = p[d];
          h !== g && (c("SCROLL"), l()), h = g;
        }, "handleScroll");
        return p.addEventListener("scroll", f), () => p.removeEventListener("scroll", f);
      }
    }, [o.viewport, i, c, l]), /* @__PURE__ */ G(Rn, { present: r || u !== "hidden", children: /* @__PURE__ */ G(
      bu,
      {
        "data-state": u === "hidden" ? "hidden" : "visible",
        ...n,
        ref: t,
        onPointerEnter: ir(e.onPointerEnter, () => c("POINTER_ENTER")),
        onPointerLeave: ir(e.onPointerLeave, () => c("POINTER_LEAVE"))
      }
    ) });
  }), p2 = L.forwardRef((e, t) => {
    let r = et(Rt, e.__scopeScrollArea), { forceMount: n, ...o } = e, [i, l] = L.useState(!1), u = e.orientation === "horizontal", c = Ti(() => {
      if (r.viewport) {
        let p = r.viewport.offsetWidth < r.viewport.scrollWidth, d = r.viewport.offsetHeight < r.viewport.scrollHeight;
        l(u ? p : d);
      }
    }, 10);
    return An(r.viewport, c), An(r.content, c), /* @__PURE__ */ G(Rn, { present: n || i, children: /* @__PURE__ */ G(
      bu,
      {
        "data-state": i ? "visible" : "hidden",
        ...o,
        ref: t
      }
    ) });
  }), bu = L.forwardRef((e, t) => {
    let { orientation: r = "vertical", ...n } = e, o = et(Rt, e.__scopeScrollArea), i = L.useRef(null), l = L.useRef(0), [u, c] = L.useState(
    {
      content: 0,
      viewport: 0,
      scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
    }), p = g2(u.viewport, u.content), d = {
      ...n,
      sizes: u,
      onSizesChange: c,
      hasThumb: p > 0 && p < 1,
      onThumbChange: /* @__PURE__ */ a((f) => i.current = f, "onThumbChange"),
      onThumbPointerUp: /* @__PURE__ */ a(() => l.current = 0, "onThumbPointerUp"),
      onThumbPointerDown: /* @__PURE__ */ a((f) => l.current = f, "onThumbPointerDown")
    };
    function h(f, g) {
      return Cb(f, l.current, u, g);
    }
    return a(h, "getScrollPosition"), r === "horizontal" ? /* @__PURE__ */ G(
      wb,
      {
        ...d,
        ref: t,
        onThumbPositionChange: /* @__PURE__ */ a(() => {
          if (o.viewport && i.current) {
            let f = o.viewport.scrollLeft, g = o2(f, u, o.dir);
            i.current.style.transform = `translate3d(${g}px, 0, 0)`;
          }
        }, "onThumbPositionChange"),
        onWheelScroll: /* @__PURE__ */ a((f) => {
          o.viewport && (o.viewport.scrollLeft = f);
        }, "onWheelScroll"),
        onDragScroll: /* @__PURE__ */ a((f) => {
          o.viewport && (o.viewport.scrollLeft = h(f, o.dir));
        }, "onDragScroll")
      }
    ) : r === "vertical" ? /* @__PURE__ */ G(
      bb,
      {
        ...d,
        ref: t,
        onThumbPositionChange: /* @__PURE__ */ a(() => {
          if (o.viewport && i.current) {
            let f = o.viewport.scrollTop, g = o2(f, u);
            i.current.style.transform = `translate3d(0, ${g}px, 0)`;
          }
        }, "onThumbPositionChange"),
        onWheelScroll: /* @__PURE__ */ a((f) => {
          o.viewport && (o.viewport.scrollTop = f);
        }, "onWheelScroll"),
        onDragScroll: /* @__PURE__ */ a((f) => {
          o.viewport && (o.viewport.scrollTop = h(f));
        }, "onDragScroll")
      }
    ) : null;
  }), wb = L.forwardRef((e, t) => {
    let { sizes: r, onSizesChange: n, ...o } = e, i = et(Rt, e.__scopeScrollArea), [l, u] = L.useState(), c = L.useRef(null), p = Ht(t, c, i.
    onScrollbarXChange);
    return L.useEffect(() => {
      c.current && u(getComputedStyle(c.current));
    }, [c]), /* @__PURE__ */ G(
      f2,
      {
        "data-orientation": "horizontal",
        ...o,
        ref: p,
        sizes: r,
        style: {
          bottom: 0,
          left: i.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
          right: i.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
          "--radix-scroll-area-thumb-width": Li(r) + "px",
          ...e.style
        },
        onThumbPointerDown: /* @__PURE__ */ a((d) => e.onThumbPointerDown(d.x), "onThumbPointerDown"),
        onDragScroll: /* @__PURE__ */ a((d) => e.onDragScroll(d.x), "onDragScroll"),
        onWheelScroll: /* @__PURE__ */ a((d, h) => {
          if (i.viewport) {
            let f = i.viewport.scrollLeft + d.deltaX;
            e.onWheelScroll(f), w2(f, h) && d.preventDefault();
          }
        }, "onWheelScroll"),
        onResize: /* @__PURE__ */ a(() => {
          c.current && i.viewport && l && n({
            content: i.viewport.scrollWidth,
            viewport: i.viewport.offsetWidth,
            scrollbar: {
              size: c.current.clientWidth,
              paddingStart: ki(l.paddingLeft),
              paddingEnd: ki(l.paddingRight)
            }
          });
        }, "onResize")
      }
    );
  }), bb = L.forwardRef((e, t) => {
    let { sizes: r, onSizesChange: n, ...o } = e, i = et(Rt, e.__scopeScrollArea), [l, u] = L.useState(), c = L.useRef(null), p = Ht(t, c, i.
    onScrollbarYChange);
    return L.useEffect(() => {
      c.current && u(getComputedStyle(c.current));
    }, [c]), /* @__PURE__ */ G(
      f2,
      {
        "data-orientation": "vertical",
        ...o,
        ref: p,
        sizes: r,
        style: {
          top: 0,
          right: i.dir === "ltr" ? 0 : void 0,
          left: i.dir === "rtl" ? 0 : void 0,
          bottom: "var(--radix-scroll-area-corner-height)",
          "--radix-scroll-area-thumb-height": Li(r) + "px",
          ...e.style
        },
        onThumbPointerDown: /* @__PURE__ */ a((d) => e.onThumbPointerDown(d.y), "onThumbPointerDown"),
        onDragScroll: /* @__PURE__ */ a((d) => e.onDragScroll(d.y), "onDragScroll"),
        onWheelScroll: /* @__PURE__ */ a((d, h) => {
          if (i.viewport) {
            let f = i.viewport.scrollTop + d.deltaY;
            e.onWheelScroll(f), w2(f, h) && d.preventDefault();
          }
        }, "onWheelScroll"),
        onResize: /* @__PURE__ */ a(() => {
          c.current && i.viewport && l && n({
            content: i.viewport.scrollHeight,
            viewport: i.viewport.offsetHeight,
            scrollbar: {
              size: c.current.clientHeight,
              paddingStart: ki(l.paddingTop),
              paddingEnd: ki(l.paddingBottom)
            }
          });
        }, "onResize")
      }
    );
  }), [yb, d2] = i2(Rt), f2 = L.forwardRef((e, t) => {
    let {
      __scopeScrollArea: r,
      sizes: n,
      hasThumb: o,
      onThumbChange: i,
      onThumbPointerUp: l,
      onThumbPointerDown: u,
      onThumbPositionChange: c,
      onDragScroll: p,
      onWheelScroll: d,
      onResize: h,
      ...f
    } = e, g = et(Rt, r), [w, m] = L.useState(null), v = Ht(t, (A) => m(A)), y = L.useRef(null), b = L.useRef(""), D = g.viewport, x = n.content -
    n.viewport, C = ar(d), E = ar(c), R = Ti(h, 10);
    function F(A) {
      if (y.current) {
        let k = A.clientX - y.current.left, B = A.clientY - y.current.top;
        p({ x: k, y: B });
      }
    }
    return a(F, "handleDragScroll"), L.useEffect(() => {
      let A = /* @__PURE__ */ a((k) => {
        let B = k.target;
        w?.contains(B) && C(k, x);
      }, "handleWheel");
      return document.addEventListener("wheel", A, { passive: !1 }), () => document.removeEventListener("wheel", A, { passive: !1 });
    }, [D, w, x, C]), L.useEffect(E, [n, E]), An(w, R), An(g.content, R), /* @__PURE__ */ G(
      yb,
      {
        scope: r,
        scrollbar: w,
        hasThumb: o,
        onThumbChange: ar(i),
        onThumbPointerUp: ar(l),
        onThumbPositionChange: E,
        onThumbPointerDown: ar(u),
        children: /* @__PURE__ */ G(
          En.div,
          {
            ...f,
            ref: v,
            style: { position: "absolute", ...f.style },
            onPointerDown: ir(e.onPointerDown, (A) => {
              A.button === 0 && (A.target.setPointerCapture(A.pointerId), y.current = w.getBoundingClientRect(), b.current = document.body.style.
              webkitUserSelect, document.body.style.webkitUserSelect = "none", g.viewport && (g.viewport.style.scrollBehavior = "auto"), F(A));
            }),
            onPointerMove: ir(e.onPointerMove, F),
            onPointerUp: ir(e.onPointerUp, (A) => {
              let k = A.target;
              k.hasPointerCapture(A.pointerId) && k.releasePointerCapture(A.pointerId), document.body.style.webkitUserSelect = b.current, g.
              viewport && (g.viewport.style.scrollBehavior = ""), y.current = null;
            })
          }
        )
      }
    );
  }), Fi = "ScrollAreaThumb", h2 = L.forwardRef(
    (e, t) => {
      let { forceMount: r, ...n } = e, o = d2(Fi, e.__scopeScrollArea);
      return /* @__PURE__ */ G(Rn, { present: r || o.hasThumb, children: /* @__PURE__ */ G(Db, { ref: t, ...n }) });
    }
  ), Db = L.forwardRef(
    (e, t) => {
      let { __scopeScrollArea: r, style: n, ...o } = e, i = et(Fi, r), l = d2(Fi, r), { onThumbPositionChange: u } = l, c = Ht(
        t,
        (h) => l.onThumbChange(h)
      ), p = L.useRef(), d = Ti(() => {
        p.current && (p.current(), p.current = void 0);
      }, 100);
      return L.useEffect(() => {
        let h = i.viewport;
        if (h) {
          let f = /* @__PURE__ */ a(() => {
            if (d(), !p.current) {
              let g = Eb(h, u);
              p.current = g, u();
            }
          }, "handleScroll");
          return u(), h.addEventListener("scroll", f), () => h.removeEventListener("scroll", f);
        }
      }, [i.viewport, d, u]), /* @__PURE__ */ G(
        En.div,
        {
          "data-state": l.hasThumb ? "visible" : "hidden",
          ...o,
          ref: c,
          style: {
            width: "var(--radix-scroll-area-thumb-width)",
            height: "var(--radix-scroll-area-thumb-height)",
            ...n
          },
          onPointerDownCapture: ir(e.onPointerDownCapture, (h) => {
            let g = h.target.getBoundingClientRect(), w = h.clientX - g.left, m = h.clientY - g.top;
            l.onThumbPointerDown({ x: w, y: m });
          }),
          onPointerUp: ir(e.onPointerUp, l.onThumbPointerUp)
        }
      );
    }
  );
  h2.displayName = Fi;
  yu = "ScrollAreaCorner", m2 = L.forwardRef(
    (e, t) => {
      let r = et(yu, e.__scopeScrollArea), n = !!(r.scrollbarX && r.scrollbarY);
      return r.type !== "scroll" && n ? /* @__PURE__ */ G(xb, { ...e, ref: t }) : null;
    }
  );
  m2.displayName = yu;
  xb = L.forwardRef((e, t) => {
    let { __scopeScrollArea: r, ...n } = e, o = et(yu, r), [i, l] = L.useState(0), [u, c] = L.useState(0), p = !!(i && u);
    return An(o.scrollbarX, () => {
      let d = o.scrollbarX?.offsetHeight || 0;
      o.onCornerHeightChange(d), c(d);
    }), An(o.scrollbarY, () => {
      let d = o.scrollbarY?.offsetWidth || 0;
      o.onCornerWidthChange(d), l(d);
    }), p ? /* @__PURE__ */ G(
      En.div,
      {
        ...n,
        ref: t,
        style: {
          width: i,
          height: u,
          position: "absolute",
          right: o.dir === "ltr" ? 0 : void 0,
          left: o.dir === "rtl" ? 0 : void 0,
          bottom: 0,
          ...e.style
        }
      }
    ) : null;
  });
  a(ki, "toInt");
  a(g2, "getThumbRatio");
  a(Li, "getThumbSize");
  a(Cb, "getScrollPositionFromPointer");
  a(o2, "getThumbOffsetFromScroll");
  a(v2, "linearScale");
  a(w2, "isScrollingWithinScrollbarBounds");
  Eb = /* @__PURE__ */ a((e, t = () => {
  }) => {
    let r = { left: e.scrollLeft, top: e.scrollTop }, n = 0;
    return (/* @__PURE__ */ a(function o() {
      let i = { left: e.scrollLeft, top: e.scrollTop }, l = r.left !== i.left, u = r.top !== i.top;
      (l || u) && t(), r = i, n = window.requestAnimationFrame(o);
    }, "loop"))(), () => window.cancelAnimationFrame(n);
  }, "addUnlinkedScrollListener");
  a(Ti, "useDebounceCallback");
  a(An, "useResizeObserver");
  a(Rb, "getSubtree");
  b2 = l2, y2 = u2, D2 = c2, x2 = h2, C2 = m2;
});

// src/components/components/ScrollArea/ScrollArea.tsx
import Br, { forwardRef as Ab } from "react";
import { styled as Ii } from "@storybook/core/theming";
var Fb, kb, R2, S2, Fn, Bi = S(() => {
  "use strict";
  E2();
  Fb = Ii(b2)(
    ({ scrollbarsize: e, offset: t }) => ({
      width: "100%",
      height: "100%",
      overflow: "hidden",
      "--scrollbar-size": `${e + t}px`,
      "--radix-scroll-area-thumb-width": `${e}px`
    })
  ), kb = Ii(y2)({
    width: "100%",
    height: "100%"
  }), R2 = Ii(D2)(({ offset: e, horizontal: t, vertical: r }) => ({
    display: "flex",
    userSelect: "none",
    // ensures no selection
    touchAction: "none",
    // disable browser handling of all panning and zooming gestures on touch devices
    background: "transparent",
    transition: "all 0.2s ease-out",
    borderRadius: "var(--scrollbar-size)",
    zIndex: 1,
    '&[data-orientation="vertical"]': {
      width: "var(--scrollbar-size)",
      paddingRight: e,
      marginTop: e,
      marginBottom: t === "true" && r === "true" ? 0 : e
    },
    '&[data-orientation="horizontal"]': {
      flexDirection: "column",
      height: "var(--scrollbar-size)",
      paddingBottom: e,
      marginLeft: e,
      marginRight: t === "true" && r === "true" ? 0 : e
    }
  })), S2 = Ii(x2)(({ theme: e }) => ({
    flex: 1,
    background: e.textMutedColor,
    opacity: 0.5,
    borderRadius: "var(--scrollbar-size)",
    position: "relative",
    transition: "opacity 0.2s ease-out",
    "&:hover": { opacity: 0.8 },
    /* increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html */
    "::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      width: "100%",
      height: "100%"
    }
  })), Fn = Ab(
    ({ children: e, horizontal: t = !1, vertical: r = !1, offset: n = 2, scrollbarSize: o = 6, className: i }, l) => /* @__PURE__ */ Br.createElement(
    Fb, { scrollbarsize: o, offset: n, className: i }, /* @__PURE__ */ Br.createElement(kb, { ref: l }, e), t && /* @__PURE__ */ Br.createElement(
      R2,
      {
        orientation: "horizontal",
        offset: n,
        horizontal: t.toString(),
        vertical: r.toString()
      },
      /* @__PURE__ */ Br.createElement(S2, null)
    ), r && /* @__PURE__ */ Br.createElement(
      R2,
      {
        orientation: "vertical",
        offset: n,
        horizontal: t.toString(),
        vertical: r.toString()
      },
      /* @__PURE__ */ Br.createElement(S2, null)
    ), t && r && /* @__PURE__ */ Br.createElement(C2, null))
  );
  Fn.displayName = "ScrollArea";
});

// src/components/components/syntaxhighlighter/syntaxhighlighter.tsx
var xu = {};
gn(xu, {
  SyntaxHighlighter: () => Da,
  createCopyToClipboardFunction: () => Du,
  default: () => jb,
  supportedLanguages: () => L2
});
import ya, { useCallback as Lb, useEffect as Tb, useState as A2 } from "react";
import { styled as Mi } from "@storybook/core/theming";
import { logger as Ib } from "@storybook/core/client-logger";
function Du() {
  return F2?.clipboard ? (e) => F2.clipboard.writeText(e) : async (e) => {
    let t = ba.createElement("TEXTAREA"), r = ba.activeElement;
    t.value = e, ba.body.appendChild(t), t.select(), ba.execCommand("copy"), ba.body.removeChild(t), r.focus();
  };
}
var k2, F2, ba, Bb, L2, Mb, _b, Pb, Hb, zb, Ob, Nb, T2, $b, Vb, Da, jb, xa = S(() => {
  "use strict";
  fi();
  k2 = Ce(da(), 1);
  jf();
  Yf();
  Kf();
  r5();
  l5();
  d5();
  g5();
  D5();
  E5();
  L5();
  B5();
  z5();
  Vf();
  du();
  Bi();
  ({ navigator: F2, document: ba, window: Bb } = vn), L2 = {
    jsextra: i5,
    jsx: m5,
    json: p5,
    yml: H5,
    md: y5,
    bash: Gf,
    css: Zf,
    html: C5,
    tsx: k5,
    typescript: I5,
    graphql: t5
  };
  Object.entries(L2).forEach(([e, t]) => {
    Ei.registerLanguage(e, t);
  });
  Mb = (0, k2.default)(2)(
    (e) => Object.entries(e.code || {}).reduce((t, [r, n]) => ({ ...t, [`* .${r}`]: n }), {})
  ), _b = Du();
  a(Du, "createCopyToClipboardFunction");
  Pb = Mi.div(
    ({ theme: e }) => ({
      position: "relative",
      overflow: "hidden",
      color: e.color.defaultText
    }),
    ({ theme: e, bordered: t }) => t ? {
      border: `1px solid ${e.appBorderColor}`,
      borderRadius: e.borderRadius,
      background: e.background.content
    } : {},
    ({ showLineNumbers: e }) => e ? {
      // use the before pseudo element to display line numbers
      ".react-syntax-highlighter-line-number::before": {
        content: "attr(data-line-number)"
      }
    } : {}
  ), Hb = /* @__PURE__ */ a(({ children: e, className: t }) => /* @__PURE__ */ ya.createElement(Fn, { horizontal: !0, vertical: !0, className: t },
  e), "UnstyledScroller"), zb = Mi(Hb)(
    {
      position: "relative"
    },
    ({ theme: e }) => Mb(e)
  ), Ob = Mi.pre(({ theme: e, padded: t }) => ({
    display: "flex",
    justifyContent: "flex-start",
    margin: 0,
    padding: t ? e.layoutMargin : 0
  })), Nb = Mi.div(({ theme: e }) => ({
    flex: 1,
    paddingLeft: 2,
    // TODO: To match theming/global.ts for now
    paddingRight: e.layoutMargin,
    opacity: 1,
    fontFamily: e.typography.fonts.mono
  })), T2 = /* @__PURE__ */ a((e) => {
    let t = [...e.children], r = t[0], n = r.children[0].value, o = {
      ...r,
      // empty the line-number element
      children: [],
      properties: {
        ...r.properties,
        // add a data-line-number attribute to line-number element, so we can access the line number with `content: attr(data-line-number)`
        "data-line-number": n,
        // remove the 'userSelect: none' style, which will produce extra empty lines when copy-pasting in firefox
        style: { ...r.properties.style, userSelect: "auto" }
      }
    };
    return t[0] = o, { ...e, children: t };
  }, "processLineNumber"), $b = /* @__PURE__ */ a(({ rows: e, stylesheet: t, useInlineStyles: r }) => e.map((n, o) => kr({
    node: T2(n),
    stylesheet: t,
    useInlineStyles: r,
    key: `code-segement${o}`
  })), "defaultRenderer"), Vb = /* @__PURE__ */ a((e, t) => t ? e ? ({ rows: r, ...n }) => e({ rows: r.map((o) => T2(o)), ...n }) : $b : e, "\
wrapRenderer"), Da = /* @__PURE__ */ a(({
    children: e,
    language: t = "jsx",
    copyable: r = !1,
    bordered: n = !1,
    padded: o = !1,
    format: i = !0,
    formatter: l = void 0,
    className: u = void 0,
    showLineNumbers: c = !1,
    ...p
  }) => {
    if (typeof e != "string" || !e.trim())
      return null;
    let [d, h] = A2("");
    Tb(() => {
      l ? l(i, e).then(h) : h(e.trim());
    }, [e, i, l]);
    let [f, g] = A2(!1), w = Lb(
      (v) => {
        v.preventDefault(), _b(d).then(() => {
          g(!0), Bb.setTimeout(() => g(!1), 1500);
        }).catch(Ib.error);
      },
      [d]
    ), m = Vb(p.renderer, c);
    return /* @__PURE__ */ ya.createElement(
      Pb,
      {
        bordered: n,
        padded: o,
        showLineNumbers: c,
        className: u
      },
      /* @__PURE__ */ ya.createElement(zb, null, /* @__PURE__ */ ya.createElement(
        Ei,
        {
          padded: o || n,
          language: t,
          showLineNumbers: c,
          showInlineLineNumbers: c,
          useInlineStyles: !1,
          PreTag: Ob,
          CodeTag: Nb,
          lineNumberContainerStyle: {},
          ...p,
          renderer: m
        },
        d
      )),
      r ? /* @__PURE__ */ ya.createElement(pu, { actionItems: [{ title: f ? "Copied" : "Copy", onClick: w }] }) : null
    );
  }, "SyntaxHighlighter");
  Da.registerLanguage = (...e) => Ei.registerLanguage(...e);
  jb = Da;
});

// ../node_modules/prettier/plugins/html.mjs
function nC(e) {
  if (typeof e == "string") return vh;
  if (Array.isArray(e)) return wh;
  if (!e) return;
  let { type: t } = e;
  if (Eh.has(t)) return t;
}
function aC(e) {
  let t = e === null ? "null" : typeof e;
  if (t !== "string" && t !== "object") return `Unexpected doc '${t}', 
Expected it to be 'string' or 'object'.`;
  if (Rh(e)) throw new Error("doc is valid.");
  let r = Object.prototype.toString.call(e);
  if (r !== "[object Object]") return `Unexpected doc '${r}'.`;
  let n = oC([...Eh].map((o) => `'${o}'`));
  return `Unexpected doc.type '${e.type}'.
Expected it to be ${n}.`;
}
function Ft(e) {
  return Or(e), { type: ic, contents: e };
}
function Ah(e, t) {
  return Or(t), { type: lc, contents: t, n: e };
}
function ce(e, t = {}) {
  return Or(e), fc(t.expandedStates, !0), { type: sc, id: t.id, contents: e, break: !!t.shouldBreak, expandedStates: t.expandedStates };
}
function sC(e) {
  return Ah(Number.NEGATIVE_INFINITY, e);
}
function uC(e) {
  return Ah({ type: "root" }, e);
}
function Fh(e) {
  return fc(e), { type: uc, parts: e };
}
function Vi(e, t = "", r = {}) {
  return Or(e), t !== "" && Or(t), { type: cc, breakContents: e, flatContents: t, groupId: r.groupId };
}
function cC(e, t) {
  return Or(e), { type: pc, contents: e, groupId: t.groupId, negate: t.negate };
}
function uo(e, t) {
  Or(e), fc(t);
  let r = [];
  for (let n = 0; n < t.length; n++) n !== 0 && r.push(e), r.push(t[n]);
  return r;
}
function kh(e, t) {
  if (typeof e == "string") return t(e);
  let r = /* @__PURE__ */ new Map();
  return n(e);
  function n(i) {
    if (r.has(i)) return r.get(i);
    let l = o(i);
    return r.set(i, l), l;
  }
  function o(i) {
    switch (Rh(i)) {
      case wh:
        return t(i.map(n));
      case uc:
        return t({ ...i, parts: i.parts.map(n) });
      case cc:
        return t({ ...i, breakContents: n(i.breakContents), flatContents: n(i.flatContents) });
      case sc: {
        let { expandedStates: l, contents: u } = i;
        return l ? (l = l.map(n), u = l[0]) : u = n(u), t({ ...i, contents: u, expandedStates: l });
      }
      case lc:
      case ic:
      case pc:
      case Ch:
      case Dh:
        return t({ ...i, contents: n(i.contents) });
      case vh:
      case bh:
      case yh:
      case xh:
      case so:
      case dc:
        return t(i);
      default:
        throw new lC(i);
    }
  }
}
function dt(e, t = fC) {
  return kh(e, (r) => typeof r == "string" ? uo(t, r.split(`
`)) : r);
}
function mC(e, t) {
  let r = t === !0 || t === _i ? _i : P2, n = r === _i ? P2 : _i, o = 0, i = 0;
  for (let l of e) l === r ? o++ : l === n && i++;
  return o > i ? n : r;
}
function vC(e) {
  if (typeof e != "string") throw new TypeError("Expected a string");
  return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function EC(e) {
  return e?.type === "front-matter";
}
function Lh(e, t) {
  var r;
  if (e.type === "text" || e.type === "comment" || Zi(e) || e.type === "yaml" || e.type === "toml") return null;
  if (e.type === "attribute" && delete t.value, e.type === "docType" && delete t.value, e.type === "angularControlFlowBlock" && (r = e.parameters) !=
  null && r.children) for (let n of t.parameters.children) SC.has(e.name) ? delete n.expression : n.expression = n.expression.trim();
  e.type === "angularIcuExpression" && (t.switchValue = e.switchValue.trim()), e.type === "angularLetDeclarationInitializer" && delete t.value;
}
async function FC(e, t) {
  if (e.language === "yaml") {
    let r = e.value.trim(), n = r ? await t(r, { parser: "yaml" }) : "";
    return uC([e.startDelimiter, e.explicitLanguage, J, n, n ? J : "", e.endDelimiter]);
  }
}
function Ki(e, t = !0) {
  return [Ft([Fe, e]), t ? Fe : ""];
}
function co(e, t) {
  let r = e.type === "NGRoot" ? e.node.type === "NGMicrosyntax" && e.node.body.length === 1 && e.node.body[0].type === "NGMicrosyntaxExpress\
ion" ? e.node.body[0].expression : e.node : e.type === "JsExpressionRoot" ? e.node : e;
  return r && (r.type === "ObjectExpression" || r.type === "ArrayExpression" || (t.parser === "__vue_expression" || t.parser === "__vue_ts_e\
xpression") && (r.type === "TemplateLiteral" || r.type === "StringLiteral"));
}
async function ft(e, t, r, n) {
  r = { __isInHtmlAttribute: !0, __embeddedInHtml: !0, ...r };
  let o = !0;
  n && (r.__onHtmlBindingRoot = (l, u) => {
    o = n(l, u);
  });
  let i = await t(e, r, t);
  return o ? ce(i) : Ki(i);
}
function LC(e, t, r, n) {
  let { node: o } = r, i = n.originalText.slice(o.sourceSpan.start.offset, o.sourceSpan.end.offset);
  return /^\s*$/u.test(i) ? "" : ft(i, e, { parser: "__ng_directive", __isInHtmlAttribute: !1 }, co);
}
function H2(e, t) {
  if (!t) return;
  let r = IC(t).toLowerCase();
  return e.find(({ filenames: n }) => n?.some((o) => o.toLowerCase() === r)) ?? e.find(({ extensions: n }) => n?.some((o) => r.endsWith(o)));
}
function BC(e, t) {
  if (t) return e.find(({ name: r }) => r.toLowerCase() === t) ?? e.find(({ aliases: r }) => r?.includes(t)) ?? e.find(({ extensions: r }) => r?.
  includes(`.${t}`));
}
function MC(e, t) {
  let r = e.plugins.flatMap((o) => o.languages ?? []), n = BC(r, t.language) ?? H2(r, t.physicalFile) ?? H2(r, t.file) ?? (t.physicalFile, void 0);
  return n?.parsers[0];
}
function OC(e) {
  return e.type === "element" && !e.hasExplicitNamespace && !["html", "svg"].includes(e.namespace);
}
function Ih(e, t) {
  return !!(e.type === "ieConditionalComment" && e.lastChild && !e.lastChild.isSelfClosing && !e.lastChild.endSourceSpan || e.type === "ieCo\
nditionalComment" && !e.complete || lo(e) && e.children.some((r) => r.type !== "text" && r.type !== "interpolation") || mc(e, t) && !Ot(e) &&
  e.type !== "interpolation");
}
function Qi(e) {
  return e.type === "attribute" || !e.parent || !e.prev ? !1 : VC(e.prev);
}
function VC(e) {
  return e.type === "comment" && e.value.trim() === "prettier-ignore";
}
function tt(e) {
  return e.type === "text" || e.type === "comment";
}
function Ot(e) {
  return e.type === "element" && (e.fullName === "script" || e.fullName === "style" || e.fullName === "svg:style" || e.fullName === "svg:scr\
ipt" || La(e) && (e.name === "script" || e.name === "style"));
}
function jC(e) {
  return e.children && !Ot(e);
}
function WC(e) {
  return Ot(e) || e.type === "interpolation" || Bh(e);
}
function Bh(e) {
  return Nh(e).startsWith("pre");
}
function qC(e, t) {
  var r, n;
  let o = i();
  if (o && !e.prev && (n = (r = e.parent) == null ? void 0 : r.tagDefinition) != null && n.ignoreFirstLf) return e.type === "interpolation";
  return o;
  function i() {
    return Zi(e) || e.type === "angularControlFlowBlock" ? !1 : (e.type === "text" || e.type === "interpolation") && e.prev && (e.prev.type ===
    "text" || e.prev.type === "interpolation") ? !0 : !e.parent || e.parent.cssDisplay === "none" ? !1 : lo(e.parent) ? !0 : !(!e.prev && (e.
    parent.type === "root" || lo(e) && e.parent || Ot(e.parent) || el(e.parent, t) || !eE(e.parent.cssDisplay)) || e.prev && !nE(e.prev.cssDisplay));
  }
}
function UC(e, t) {
  return Zi(e) || e.type === "angularControlFlowBlock" ? !1 : (e.type === "text" || e.type === "interpolation") && e.next && (e.next.type ===
  "text" || e.next.type === "interpolation") ? !0 : !e.parent || e.parent.cssDisplay === "none" ? !1 : lo(e.parent) ? !0 : !(!e.next && (e.parent.
  type === "root" || lo(e) && e.parent || Ot(e.parent) || el(e.parent, t) || !tE(e.parent.cssDisplay)) || e.next && !rE(e.next.cssDisplay));
}
function GC(e) {
  return oE(e.cssDisplay) && !Ot(e);
}
function Pi(e) {
  return Zi(e) || e.next && e.sourceSpan.end && e.sourceSpan.end.line + 1 < e.next.sourceSpan.start.line;
}
function YC(e) {
  return Mh(e) || e.type === "element" && e.children.length > 0 && (["body", "script", "style"].includes(e.name) || e.children.some((t) => ZC(
  t))) || e.firstChild && e.firstChild === e.lastChild && e.firstChild.type !== "text" && Ph(e.firstChild) && (!e.lastChild.isTrailingSpaceSensitive ||
  Hh(e.lastChild));
}
function Mh(e) {
  return e.type === "element" && e.children.length > 0 && (["html", "head", "ul", "ol", "select"].includes(e.name) || e.cssDisplay.startsWith(
  "table") && e.cssDisplay !== "table-cell");
}
function Xu(e) {
  return zh(e) || e.prev && XC(e.prev) || _h(e);
}
function XC(e) {
  return zh(e) || e.type === "element" && e.fullName === "br" || _h(e);
}
function _h(e) {
  return Ph(e) && Hh(e);
}
function Ph(e) {
  return e.hasLeadingSpaces && (e.prev ? e.prev.sourceSpan.end.line < e.sourceSpan.start.line : e.parent.type === "root" || e.parent.startSourceSpan.
  end.line < e.sourceSpan.start.line);
}
function Hh(e) {
  return e.hasTrailingSpaces && (e.next ? e.next.sourceSpan.start.line > e.sourceSpan.end.line : e.parent.type === "root" || e.parent.endSourceSpan &&
  e.parent.endSourceSpan.start.line > e.sourceSpan.end.line);
}
function zh(e) {
  switch (e.type) {
    case "ieConditionalComment":
    case "comment":
    case "directive":
      return !0;
    case "element":
      return ["script", "select"].includes(e.name);
  }
  return !1;
}
function hc(e) {
  return e.lastChild ? hc(e.lastChild) : e;
}
function ZC(e) {
  var t;
  return (t = e.children) == null ? void 0 : t.some((r) => r.type !== "text");
}
function Oh(e) {
  if (e) switch (e) {
    case "module":
    case "text/javascript":
    case "text/babel":
    case "application/javascript":
      return "babel";
    case "application/x-typescript":
      return "typescript";
    case "text/markdown":
      return "markdown";
    case "text/html":
      return "html";
    case "text/x-handlebars-template":
      return "glimmer";
    default:
      if (e.endsWith("json") || e.endsWith("importmap") || e === "speculationrules") return "json";
  }
}
function KC(e, t) {
  let { name: r, attrMap: n } = e;
  if (r !== "script" || Object.prototype.hasOwnProperty.call(n, "src")) return;
  let { type: o, lang: i } = e.attrMap;
  return !i && !o ? "babel" : Ji(t, { language: i }) ?? Oh(o);
}
function JC(e, t) {
  if (!mc(e, t)) return;
  let { attrMap: r } = e;
  if (Object.prototype.hasOwnProperty.call(r, "src")) return;
  let { type: n, lang: o } = r;
  return Ji(t, { language: o }) ?? Oh(n);
}
function QC(e, t) {
  if (e.name !== "style") return;
  let { lang: r } = e.attrMap;
  return r ? Ji(t, { language: r }) : "css";
}
function z2(e, t) {
  return KC(e, t) ?? QC(e, t) ?? JC(e, t);
}
function Ba(e) {
  return e === "block" || e === "list-item" || e.startsWith("table");
}
function eE(e) {
  return !Ba(e) && e !== "inline-block";
}
function tE(e) {
  return !Ba(e) && e !== "inline-block";
}
function rE(e) {
  return !Ba(e);
}
function nE(e) {
  return !Ba(e);
}
function oE(e) {
  return !Ba(e) && e !== "inline-block";
}
function lo(e) {
  return Nh(e).startsWith("pre");
}
function aE(e, t) {
  let r = e;
  for (; r; ) {
    if (t(r)) return !0;
    r = r.parent;
  }
  return !1;
}
function iE(e, t) {
  var r;
  if (po(e, t)) return "block";
  if (((r = e.prev) == null ? void 0 : r.type) === "comment") {
    let o = e.prev.value.match(/^\s*display:\s*([a-z]+)\s*$/u);
    if (o) return o[1];
  }
  let n = !1;
  if (e.type === "element" && e.namespace === "svg") if (aE(e, (o) => o.fullName === "svg:foreignObject")) n = !0;
  else return e.name === "svg" ? "inline-block" : "block";
  switch (t.htmlWhitespaceSensitivity) {
    case "strict":
      return "inline";
    case "ignore":
      return "block";
    default:
      return e.type === "element" && (!e.namespace || n || La(e)) && PC[e.name] || _C;
  }
}
function Nh(e) {
  return e.type === "element" && (!e.namespace || La(e)) && zC[e.name] || HC;
}
function lE(e) {
  let t = Number.POSITIVE_INFINITY;
  for (let r of e.split(`
`)) {
    if (r.length === 0) continue;
    let n = At.getLeadingWhitespaceCount(r);
    if (n === 0) return 0;
    r.length !== n && n < t && (t = n);
  }
  return t === Number.POSITIVE_INFINITY ? 0 : t;
}
function $h(e, t = lE(e)) {
  return t === 0 ? e : e.split(`
`).map((r) => r.slice(t)).join(`
`);
}
function Vh(e) {
  return Ue(!1, Ue(!1, e, "&apos;", "'"), "&quot;", '"');
}
function pr(e) {
  return Vh(e.value);
}
function el(e, t) {
  return po(e, t) && !sE.has(e.fullName);
}
function po(e, t) {
  return t.parser === "vue" && e.type === "element" && e.parent.type === "root" && e.fullName.toLowerCase() !== "html";
}
function mc(e, t) {
  return po(e, t) && (el(e, t) || e.attrMap.lang && e.attrMap.lang !== "html");
}
function uE(e) {
  let t = e.fullName;
  return t.charAt(0) === "#" || t === "slot-scope" || t === "v-slot" || t.startsWith("v-slot:");
}
function cE(e, t) {
  let r = e.parent;
  if (!po(r, t)) return !1;
  let n = r.fullName, o = e.fullName;
  return n === "script" && o === "setup" || n === "style" && o === "vars";
}
function jh(e, t = e.value) {
  return e.parent.isWhitespaceSensitive ? e.parent.isIndentationSensitive ? dt(t) : dt($h(Th(t)), J) : uo(we, At.split(t));
}
function Wh(e, t) {
  return po(e, t) && e.name === "script";
}
async function pE(e, t) {
  let r = [];
  for (let [n, o] of e.split(qh).entries()) if (n % 2 === 0) r.push(dt(o));
  else try {
    r.push(ce(["{{", Ft([we, await ft(o, t, { parser: "__ng_interpolation", __isInHtmlInterpolation: !0 })]), we, "}}"]));
  } catch {
    r.push("{{", dt(o), "}}");
  }
  return r;
}
function gc({ parser: e }) {
  return (t, r, n) => ft(pr(n.node), t, { parser: e }, co);
}
function mE(e, t) {
  if (t.parser !== "angular") return;
  let { node: r } = e, n = r.fullName;
  if (n.startsWith("(") && n.endsWith(")") || n.startsWith("on-")) return dE;
  if (n.startsWith("[") && n.endsWith("]") || /^bind(?:on)?-/u.test(n) || /^ng-(?:if|show|hide|class|style)$/u.test(n)) return fE;
  if (n.startsWith("*")) return hE;
  let o = pr(r);
  if (/^i18n(?:-.+)?$/u.test(n)) return () => Ki(Fh(jh(r, o.trim())), !o.includes("@@"));
  if (qh.test(o)) return (i) => pE(o, i);
}
function vE(e, t) {
  let { node: r } = e, n = pr(r);
  if (r.fullName === "class" && !t.parentParser && !n.includes("{{")) return () => n.trim().split(/\s+/u).join(" ");
}
function O2(e) {
  return e === "	" || e === `
` || e === "\f" || e === "\r" || e === " ";
}
function EE(e) {
  let t = e.length, r, n, o, i, l, u = 0, c;
  function p(g) {
    let w, m = g.exec(e.substring(u));
    if (m) return [w] = m, u += w.length, w;
  }
  a(p, "p");
  let d = [];
  for (; ; ) {
    if (p(yE), u >= t) {
      if (d.length === 0) throw new Error("Must contain one or more image candidate strings.");
      return d;
    }
    c = u, r = p(DE), n = [], r.slice(-1) === "," ? (r = r.replace(xE, ""), f()) : h();
  }
  function h() {
    for (p(bE), o = "", i = "in descriptor"; ; ) {
      if (l = e.charAt(u), i === "in descriptor") if (O2(l)) o && (n.push(o), o = "", i = "after descriptor");
      else if (l === ",") {
        u += 1, o && n.push(o), f();
        return;
      } else if (l === "(") o += l, i = "in parens";
      else if (l === "") {
        o && n.push(o), f();
        return;
      } else o += l;
      else if (i === "in parens") if (l === ")") o += l, i = "in descriptor";
      else if (l === "") {
        n.push(o), f();
        return;
      } else o += l;
      else if (i === "after descriptor" && !O2(l)) if (l === "") {
        f();
        return;
      } else i = "in descriptor", u -= 1;
      u += 1;
    }
  }
  a(h, "f");
  function f() {
    let g = !1, w, m, v, y, b = {}, D, x, C, E, R;
    for (y = 0; y < n.length; y++) D = n[y], x = D[D.length - 1], C = D.substring(0, D.length - 1), E = parseInt(C, 10), R = parseFloat(C), N2.
    test(C) && x === "w" ? ((w || m) && (g = !0), E === 0 ? g = !0 : w = E) : CE.test(C) && x === "x" ? ((w || m || v) && (g = !0), R < 0 ? g =
    !0 : m = R) : N2.test(C) && x === "h" ? ((v || m) && (g = !0), E === 0 ? g = !0 : v = E) : g = !0;
    if (!g) b.source = { value: r, startOffset: c }, w && (b.width = { value: w }), m && (b.density = { value: m }), v && (b.height = { value: v }),
    d.push(b);
    else throw new Error(`Invalid srcset descriptor found in "${e}" at "${D}".`);
  }
  a(f, "d");
}
function SE(e) {
  if (e.node.fullName === "srcset" && (e.parent.fullName === "img" || e.parent.fullName === "source")) return () => FE(pr(e.node));
}
function FE(e) {
  let t = RE(e), r = AE.filter((d) => t.some((h) => Object.prototype.hasOwnProperty.call(h, d)));
  if (r.length > 1) throw new Error("Mixed descriptor in srcset is not supported");
  let [n] = r, o = Uh[n], i = t.map((d) => d.source.value), l = Math.max(...i.map((d) => d.length)), u = t.map((d) => d[n] ? String(d[n].value) :
  ""), c = u.map((d) => {
    let h = d.indexOf(".");
    return h === -1 ? d.length : h;
  }), p = Math.max(...c);
  return Ki(uo([",", we], i.map((d, h) => {
    let f = [d], g = u[h];
    if (g) {
      let w = l - d.length + 1, m = p - c[h], v = " ".repeat(w + m);
      f.push(Vi(v, " "), g + o);
    }
    return f;
  })));
}
function LE(e, t) {
  let { node: r } = e, n = pr(e.node).trim();
  if (r.fullName === "style" && !t.parentParser && !n.includes("{{")) return async (o) => Ki(await o(n, { parser: "css", __isHTMLStyleAttribute: !0 }));
}
function TE(e, t) {
  let { root: r } = e;
  return Zu.has(r) || Zu.set(r, r.children.some((n) => Wh(n, t) && ["ts", "typescript"].includes(n.attrMap.lang))), Zu.get(r);
}
function IE(e, t, r) {
  let { node: n } = r, o = pr(n);
  return ft(`type T<${o}> = any`, e, { parser: "babel-ts", __isEmbeddedTypescriptGenericParameters: !0 }, co);
}
function BE(e, t, { parseWithTs: r }) {
  return ft(`function _(${e}) {}`, t, { parser: r ? "babel-ts" : "babel", __isVueBindings: !0 });
}
async function ME(e, t, r, n) {
  let o = pr(r.node), { left: i, operator: l, right: u } = _E(o), c = vc(r, n);
  return [ce(await ft(`function _(${i}) {}`, e, { parser: c ? "babel-ts" : "babel", __isVueForBindingLeft: !0 })), " ", l, " ", await ft(u, e,
  { parser: c ? "__ts_expression" : "__js_expression" })];
}
function _E(e) {
  let t = /(.*?)\s+(in|of)\s+(.*)/su, r = /,([^,\]}]*)(?:,([^,\]}]*))?$/u, n = /^\(|\)$/gu, o = e.match(t);
  if (!o) return;
  let i = {};
  if (i.for = o[3].trim(), !i.for) return;
  let l = Ue(!1, o[1].trim(), n, ""), u = l.match(r);
  u ? (i.alias = l.replace(r, ""), i.iterator1 = u[1].trim(), u[2] && (i.iterator2 = u[2].trim())) : i.alias = l;
  let c = [i.alias, i.iterator1, i.iterator2];
  if (!c.some((p, d) => !p && (d === 0 || c.slice(d + 1).some(Boolean)))) return { left: c.filter(Boolean).join(","), operator: o[2], right: i.
  for };
}
function PE(e, t) {
  if (t.parser !== "vue") return;
  let { node: r } = e, n = r.fullName;
  if (n === "v-for") return ME;
  if (n === "generic" && Wh(r.parent, t)) return IE;
  let o = pr(r), i = vc(e, t);
  if (uE(r) || cE(r, t)) return (l) => BE(o, l, { parseWithTs: i });
  if (n.startsWith("@") || n.startsWith("v-on:")) return (l) => HE(o, l, { parseWithTs: i });
  if (n.startsWith(":") || n.startsWith("v-bind:")) return (l) => zE(o, l, { parseWithTs: i });
  if (n.startsWith("v-")) return (l) => Gh(o, l, { parseWithTs: i });
}
async function HE(e, t, { parseWithTs: r }) {
  var n;
  try {
    return await Gh(e, t, { parseWithTs: r });
  } catch (o) {
    if (((n = o.cause) == null ? void 0 : n.code) !== "BABEL_PARSER_SYNTAX_ERROR") throw o;
  }
  return ft(e, t, { parser: r ? "__vue_ts_event_binding" : "__vue_event_binding" }, co);
}
function zE(e, t, { parseWithTs: r }) {
  return ft(e, t, { parser: r ? "__vue_ts_expression" : "__vue_expression" }, co);
}
function Gh(e, t, { parseWithTs: r }) {
  return ft(e, t, { parser: r ? "__ts_expression" : "__js_expression" }, co);
}
function NE(e, t) {
  let { node: r } = e;
  if (r.value) {
    if (/^PRETTIER_HTML_PLACEHOLDER_\d+_\d+_IN_JS$/u.test(t.originalText.slice(r.valueSpan.start.offset, r.valueSpan.end.offset)) || t.parser ===
    "lwc" && r.value.startsWith("{") && r.value.endsWith("}")) return [r.rawName, "=", r.value];
    for (let n of [kE, LE, wE, OE, gE]) {
      let o = n(e, t);
      if (o) return $E(o);
    }
  }
}
function $E(e) {
  return async (t, r, n, o) => {
    let i = await e(t, r, n, o);
    if (i) return i = kh(i, (l) => typeof l == "string" ? Ue(!1, l, '"', "&quot;") : l), [n.node.rawName, '="', ce(i), '"'];
  };
}
function jE(e) {
  return Array.isArray(e) && e.length > 0;
}
function Ma(e) {
  return e.sourceSpan.start.offset;
}
function _a(e) {
  return e.sourceSpan.end.offset;
}
function rc(e, t) {
  return [e.isSelfClosing ? "" : WE(e, t), Aa(e, t)];
}
function WE(e, t) {
  return e.lastChild && Ta(e.lastChild) ? "" : [qE(e, t), bc(e, t)];
}
function Aa(e, t) {
  return (e.next ? $r(e.next) : Ha(e.parent)) ? "" : [Pa(e, t), Nr(e, t)];
}
function qE(e, t) {
  return Ha(e) ? Pa(e.lastChild, t) : "";
}
function Nr(e, t) {
  return Ta(e) ? bc(e.parent, t) : tl(e) ? yc(e.next, t) : "";
}
function bc(e, t) {
  if (Xh(!e.isSelfClosing), Zh(e, t)) return "";
  switch (e.type) {
    case "ieConditionalComment":
      return "<!";
    case "element":
      if (e.hasHtmComponentClosingTag) return "<//";
    default:
      return `</${e.rawName}`;
  }
}
function Pa(e, t) {
  if (Zh(e, t)) return "";
  switch (e.type) {
    case "ieConditionalComment":
    case "ieConditionalEndComment":
      return "[endif]-->";
    case "ieConditionalStartComment":
      return "]><!-->";
    case "interpolation":
      return "}}";
    case "angularIcuExpression":
      return "}";
    case "element":
      if (e.isSelfClosing) return "/>";
    default:
      return ">";
  }
}
function Zh(e, t) {
  return !e.isSelfClosing && !e.endSourceSpan && (Qi(e) || Ih(e.parent, t));
}
function $r(e) {
  return e.prev && e.prev.type !== "docType" && e.type !== "angularControlFlowBlock" && !tt(e.prev) && e.isLeadingSpaceSensitive && !e.hasLeadingSpaces;
}
function Ha(e) {
  var t;
  return ((t = e.lastChild) == null ? void 0 : t.isTrailingSpaceSensitive) && !e.lastChild.hasTrailingSpaces && !tt(hc(e.lastChild)) && !lo(
  e);
}
function Ta(e) {
  return !e.next && !e.hasTrailingSpaces && e.isTrailingSpaceSensitive && tt(hc(e));
}
function tl(e) {
  return e.next && !tt(e.next) && tt(e) && e.isTrailingSpaceSensitive && !e.hasTrailingSpaces;
}
function UE(e) {
  let t = e.trim().match(/^prettier-ignore-attribute(?:\s+(.+))?$/su);
  return t ? t[1] ? t[1].split(/\s+/u) : !0 : !1;
}
function rl(e) {
  return !e.prev && e.isLeadingSpaceSensitive && !e.hasLeadingSpaces;
}
function GE(e, t, r) {
  var n;
  let { node: o } = e;
  if (!wc(o.attrs)) return o.isSelfClosing ? " " : "";
  let i = ((n = o.prev) == null ? void 0 : n.type) === "comment" && UE(o.prev.value), l = typeof i == "boolean" ? () => i : Array.isArray(i) ?
  (h) => i.includes(h.rawName) : () => !1, u = e.map(({ node: h }) => l(h) ? dt(t.originalText.slice(Ma(h), _a(h))) : r(), "attrs"), c = o.type ===
  "element" && o.fullName === "script" && o.attrs.length === 1 && o.attrs[0].fullName === "src" && o.children.length === 0, p = t.singleAttributePerLine &&
  o.attrs.length > 1 && !po(o, t) ? J : we, d = [Ft([c ? " " : we, uo(p, u)])];
  return o.firstChild && rl(o.firstChild) || o.isSelfClosing && Ha(o.parent) || c ? d.push(o.isSelfClosing ? " " : "") : d.push(t.bracketSameLine ?
  o.isSelfClosing ? " " : "" : o.isSelfClosing ? we : Fe), d;
}
function YE(e) {
  return e.firstChild && rl(e.firstChild) ? "" : Dc(e);
}
function nc(e, t, r) {
  let { node: n } = e;
  return [Fa(n, t), GE(e, t, r), n.isSelfClosing ? "" : YE(n)];
}
function Fa(e, t) {
  return e.prev && tl(e.prev) ? "" : [Vr(e, t), yc(e, t)];
}
function Vr(e, t) {
  return rl(e) ? Dc(e.parent) : $r(e) ? Pa(e.prev, t) : "";
}
function yc(e, t) {
  switch (e.type) {
    case "ieConditionalComment":
    case "ieConditionalStartComment":
      return `<!--[if ${e.condition}`;
    case "ieConditionalEndComment":
      return "<!--<!";
    case "interpolation":
      return "{{";
    case "docType": {
      if (e.value === "html") {
        let r = t.filepath ?? "";
        if (/\.html?$/u.test(r)) return $2;
      }
      return t.originalText.slice(Ma(e), _a(e)).slice(0, $2.length);
    }
    case "angularIcuExpression":
      return "{";
    case "element":
      if (e.condition) return `<!--[if ${e.condition}]><!--><${e.rawName}`;
    default:
      return `<${e.rawName}`;
  }
}
function Dc(e) {
  switch (Xh(!e.isSelfClosing), e.type) {
    case "ieConditionalComment":
      return "]>";
    case "element":
      if (e.condition) return "><!--<![endif]-->";
    default:
      return ">";
  }
}
function XE(e, t) {
  if (!e.endSourceSpan) return "";
  let r = e.startSourceSpan.end.offset;
  e.firstChild && rl(e.firstChild) && (r -= Dc(e).length);
  let n = e.endSourceSpan.start.offset;
  return e.lastChild && Ta(e.lastChild) ? n += bc(e, t).length : Ha(e) && (n -= Pa(e.lastChild, t).length), t.originalText.slice(r, n);
}
function KE(e, t) {
  let { node: r } = e;
  switch (r.type) {
    case "element":
      if (Ot(r) || r.type === "interpolation") return;
      if (!r.isSelfClosing && mc(r, t)) {
        let n = z2(r, t);
        return n ? async (o, i) => {
          let l = Kh(r, t), u = /^\s*$/u.test(l), c = "";
          return u || (c = await o(Th(l), { parser: n, __embeddedInHtml: !0 }), u = c === ""), [Vr(r, t), ce(nc(e, t, i)), u ? "" : J, c, u ?
          "" : J, rc(r, t), Nr(r, t)];
        } : void 0;
      }
      break;
    case "text":
      if (Ot(r.parent)) {
        let n = z2(r.parent, t);
        if (n) return async (o) => {
          let i = n === "markdown" ? $h(r.value.replace(/^[^\S\n]*\n/u, "")) : r.value, l = { parser: n, __embeddedInHtml: !0 };
          if (t.parser === "html" && n === "babel") {
            let u = "script", { attrMap: c } = r.parent;
            c && (c.type === "module" || c.type === "text/babel" && c["data-type"] === "module") && (u = "module"), l.__babelSourceType = u;
          }
          return [Ia, Vr(r, t), await o(i, l), Nr(r, t)];
        };
      } else if (r.parent.type === "interpolation") return async (n) => {
        let o = { __isInHtmlInterpolation: !0, __embeddedInHtml: !0 };
        return t.parser === "angular" ? o.parser = "__ng_interpolation" : t.parser === "vue" ? o.parser = vc(e, t) ? "__vue_ts_expression" :
        "__vue_expression" : o.parser = "__js_expression", [Ft([we, await n(r.value, o)]), r.parent.next && $r(r.parent.next) ? " " : we];
      };
      break;
    case "attribute":
      return VE(e, t);
    case "front-matter":
      return (n) => kC(r, n);
    case "angularControlFlowBlockParameters":
      return ZE.has(e.parent.name) ? TC : void 0;
    case "angularLetDeclarationInitializer":
      return (n) => ft(r.value, n, { parser: "__ng_binding", __isInHtmlAttribute: !1 });
  }
}
function ka(e) {
  if (Ca !== null && typeof Ca.property) {
    let t = Ca;
    return Ca = ka.prototype = null, t;
  }
  return Ca = ka.prototype = e ?? /* @__PURE__ */ Object.create(null), new ka();
}
function eR(e) {
  return ka(e);
}
function tR(e, t = "type") {
  eR(e);
  function r(n) {
    let o = n[t], i = e[o];
    if (!Array.isArray(i)) throw Object.assign(new Error(`Missing visitor keys for '${o}'.`), { node: n });
    return i;
  }
  return a(r, "r"), r;
}
function lR(e) {
  return /^\s*<!--\s*@(?:format|prettier)\s*-->/u.test(e);
}
function sR(e) {
  return `<!-- @format -->

` + e;
}
function Jh(e) {
  let t = _a(e);
  return e.type === "element" && !e.endSourceSpan && wc(e.children) ? Math.max(t, Jh(Xi(!1, e.children, -1))) : t;
}
function Ea(e, t, r) {
  let n = e.node;
  if (Qi(n)) {
    let o = Jh(n);
    return [Vr(n, t), dt(At.trimEnd(t.originalText.slice(Ma(n) + (n.prev && tl(n.prev) ? yc(n).length : 0), o - (n.next && $r(n.next) ? Pa(n,
    t).length : 0)))), Nr(n, t)];
  }
  return r();
}
function Hi(e, t) {
  return tt(e) && tt(t) ? e.isTrailingSpaceSensitive ? e.hasTrailingSpaces ? Xu(t) ? J : we : "" : Xu(t) ? J : Fe : tl(e) && (Qi(t) || t.firstChild ||
  t.isSelfClosing || t.type === "element" && t.attrs.length > 0) || e.type === "element" && e.isSelfClosing && $r(t) ? "" : !t.isLeadingSpaceSensitive ||
  Xu(t) || $r(t) && e.lastChild && Ta(e.lastChild) && e.lastChild.lastChild && Ta(e.lastChild.lastChild) ? J : t.hasLeadingSpaces ? we : Fe;
}
function xc(e, t, r) {
  let { node: n } = e;
  if (Mh(n)) return [Ia, ...e.map((i) => {
    let l = i.node, u = l.prev ? Hi(l.prev, l) : "";
    return [u ? [u, Pi(l.prev) ? J : ""] : "", Ea(i, t, r)];
  }, "children")];
  let o = n.children.map(() => Symbol(""));
  return e.map((i, l) => {
    let u = i.node;
    if (tt(u)) {
      if (u.prev && tt(u.prev)) {
        let w = Hi(u.prev, u);
        if (w) return Pi(u.prev) ? [J, J, Ea(i, t, r)] : [w, Ea(i, t, r)];
      }
      return Ea(i, t, r);
    }
    let c = [], p = [], d = [], h = [], f = u.prev ? Hi(u.prev, u) : "", g = u.next ? Hi(u, u.next) : "";
    return f && (Pi(u.prev) ? c.push(J, J) : f === J ? c.push(J) : tt(u.prev) ? p.push(f) : p.push(Vi("", Fe, { groupId: o[l - 1] }))), g &&
    (Pi(u) ? tt(u.next) && h.push(J, J) : g === J ? tt(u.next) && h.push(J) : d.push(g)), [...c, ce([...p, ce([Ea(i, t, r), ...d], { id: o[l] })]),
    ...h];
  }, "children");
}
function cR(e, t, r) {
  let { node: n } = e, o = [];
  pR(e) && o.push("} "), o.push("@", n.name), n.parameters && o.push(" (", ce(r("parameters")), ")"), o.push(" {");
  let i = Qh(n);
  return n.children.length > 0 ? (n.firstChild.hasLeadingSpaces = !0, n.lastChild.hasTrailingSpaces = !0, o.push(Ft([J, xc(e, t, r)])), i &&
  o.push(J, "}")) : i && o.push("}"), ce(o, { shouldBreak: !0 });
}
function Qh(e) {
  var t, r;
  return !(((t = e.next) == null ? void 0 : t.type) === "angularControlFlowBlock" && (r = uR.get(e.name)) != null && r.has(e.next.name));
}
function pR(e) {
  let { previous: t } = e;
  return t?.type === "angularControlFlowBlock" && !Qi(t) && !Qh(t);
}
function dR(e, t, r) {
  return [Ft([Fe, uo([";", we], e.map(r, "children"))]), Fe];
}
function fR(e, t, r) {
  let { node: n } = e;
  return [Fa(n, t), ce([n.switchValue.trim(), ", ", n.clause, n.cases.length > 0 ? [",", Ft([we, uo(we, e.map(r, "cases"))])] : "", Fe]), Aa(
  n, t)];
}
function hR(e, t, r) {
  let { node: n } = e;
  return [n.value, " {", ce([Ft([Fe, e.map(({ node: o }) => o.type === "text" && !At.trim(o.value) ? "" : r(), "expression")]), Fe]), "}"];
}
function mR(e, t, r) {
  let { node: n } = e;
  if (Ih(n, t)) return [Vr(n, t), ce(nc(e, t, r)), dt(Kh(n, t)), ...rc(n, t), Nr(n, t)];
  let o = n.children.length === 1 && (n.firstChild.type === "interpolation" || n.firstChild.type === "angularIcuExpression") && n.firstChild.
  isLeadingSpaceSensitive && !n.firstChild.hasLeadingSpaces && n.lastChild.isTrailingSpaceSensitive && !n.lastChild.hasTrailingSpaces, i = Symbol(
  "element-attr-group-id"), l = /* @__PURE__ */ a((d) => ce([ce(nc(e, t, r), { id: i }), d, rc(n, t)]), "a"), u = /* @__PURE__ */ a((d) => o ?
  cC(d, { groupId: i }) : (Ot(n) || el(n, t)) && n.parent.type === "root" && t.parser === "vue" && !t.vueIndentScriptAndStyle ? d : Ft(d), "\
o"), c = /* @__PURE__ */ a(() => o ? Vi(Fe, "", { groupId: i }) : n.firstChild.hasLeadingSpaces && n.firstChild.isLeadingSpaceSensitive ? we :
  n.firstChild.type === "text" && n.isWhitespaceSensitive && n.isIndentationSensitive ? sC(Fe) : Fe, "u"), p = /* @__PURE__ */ a(() => (n.next ?
  $r(n.next) : Ha(n.parent)) ? n.lastChild.hasTrailingSpaces && n.lastChild.isTrailingSpaceSensitive ? " " : "" : o ? Vi(Fe, "", { groupId: i }) :
  n.lastChild.hasTrailingSpaces && n.lastChild.isTrailingSpaceSensitive ? we : (n.lastChild.type === "comment" || n.lastChild.type === "text" &&
  n.isWhitespaceSensitive && n.isIndentationSensitive) && new RegExp(`\\n[\\t ]{${t.tabWidth * (e.ancestors.length - 1)}}$`, "u").test(n.lastChild.
  value) ? "" : Fe, "p");
  return n.children.length === 0 ? l(n.hasDanglingSpaces && n.isDanglingSpaceSensitive ? we : "") : l([YC(n) ? Ia : "", u([c(), xc(e, t, r)]),
  p()]);
}
function ji(e) {
  return e >= 9 && e <= 32 || e == 160;
}
function Cc(e) {
  return 48 <= e && e <= 57;
}
function Wi(e) {
  return e >= 97 && e <= 122 || e >= 65 && e <= 90;
}
function gR(e) {
  return e >= 97 && e <= 102 || e >= 65 && e <= 70 || Cc(e);
}
function Ec(e) {
  return e === 10 || e === 13;
}
function V2(e) {
  return 48 <= e && e <= 55;
}
function Ku(e) {
  return e === 39 || e === 34 || e === 96;
}
function wR(e) {
  return e.replace(vR, (...t) => t[1].toUpperCase());
}
function yR(e, t) {
  for (let r of bR) r(e, t);
  return e;
}
function DR(e) {
  e.walk((t) => {
    if (t.type === "element" && t.tagDefinition.ignoreFirstLf && t.children.length > 0 && t.children[0].type === "text" && t.children[0].value[0] ===
    `
`) {
      let r = t.children[0];
      r.value.length === 1 ? t.removeChild(r) : r.value = r.value.slice(1);
    }
  });
}
function xR(e) {
  let t = /* @__PURE__ */ a((r) => {
    var n, o;
    return r.type === "element" && ((n = r.prev) == null ? void 0 : n.type) === "ieConditionalStartComment" && r.prev.sourceSpan.end.offset ===
    r.startSourceSpan.start.offset && ((o = r.firstChild) == null ? void 0 : o.type) === "ieConditionalEndComment" && r.firstChild.sourceSpan.
    start.offset === r.startSourceSpan.end.offset;
  }, "e");
  e.walk((r) => {
    if (r.children) for (let n = 0; n < r.children.length; n++) {
      let o = r.children[n];
      if (!t(o)) continue;
      let i = o.prev, l = o.firstChild;
      r.removeChild(i), n--;
      let u = new z(i.sourceSpan.start, l.sourceSpan.end), c = new z(u.start, o.sourceSpan.end);
      o.condition = i.condition, o.sourceSpan = c, o.startSourceSpan = u, o.removeChild(l);
    }
  });
}
function CR(e, t, r) {
  e.walk((n) => {
    if (n.children) for (let o = 0; o < n.children.length; o++) {
      let i = n.children[o];
      if (i.type !== "text" && !t(i)) continue;
      i.type !== "text" && (i.type = "text", i.value = r(i));
      let l = i.prev;
      !l || l.type !== "text" || (l.value += i.value, l.sourceSpan = new z(l.sourceSpan.start, i.sourceSpan.end), n.removeChild(i), o--);
    }
  });
}
function ER(e) {
  return CR(e, (t) => t.type === "cdata", (t) => `<![CDATA[${t.value}]]>`);
}
function RR(e) {
  let t = /* @__PURE__ */ a((r) => {
    var n, o;
    return r.type === "element" && r.attrs.length === 0 && r.children.length === 1 && r.firstChild.type === "text" && !At.hasWhitespaceCharacter(
    r.children[0].value) && !r.firstChild.hasLeadingSpaces && !r.firstChild.hasTrailingSpaces && r.isLeadingSpaceSensitive && !r.hasLeadingSpaces &&
    r.isTrailingSpaceSensitive && !r.hasTrailingSpaces && ((n = r.prev) == null ? void 0 : n.type) === "text" && ((o = r.next) == null ? void 0 :
    o.type) === "text";
  }, "e");
  e.walk((r) => {
    if (r.children) for (let n = 0; n < r.children.length; n++) {
      let o = r.children[n];
      if (!t(o)) continue;
      let i = o.prev, l = o.next;
      i.value += `<${o.rawName}>` + o.firstChild.value + `</${o.rawName}>` + l.value, i.sourceSpan = new z(i.sourceSpan.start, l.sourceSpan.
      end), i.isTrailingSpaceSensitive = l.isTrailingSpaceSensitive, i.hasTrailingSpaces = l.hasTrailingSpaces, r.removeChild(o), n--, r.removeChild(
      l);
    }
  });
}
function SR(e, t) {
  if (t.parser === "html") return;
  let r = /\{\{(.+?)\}\}/su;
  e.walk((n) => {
    if (jC(n)) for (let o of n.children) {
      if (o.type !== "text") continue;
      let i = o.sourceSpan.start, l = null, u = o.value.split(r);
      for (let c = 0; c < u.length; c++, i = l) {
        let p = u[c];
        if (c % 2 === 0) {
          l = i.moveBy(p.length), p.length > 0 && n.insertChildBefore(o, { type: "text", value: p, sourceSpan: new z(i, l) });
          continue;
        }
        l = i.moveBy(p.length + 4), n.insertChildBefore(o, { type: "interpolation", sourceSpan: new z(i, l), children: p.length === 0 ? [] :
        [{ type: "text", value: p, sourceSpan: new z(i.moveBy(2), l.moveBy(-2)) }] });
      }
      n.removeChild(o);
    }
  });
}
function AR(e) {
  e.walk((t) => {
    if (!t.children) return;
    if (t.children.length === 0 || t.children.length === 1 && t.children[0].type === "text" && At.trim(t.children[0].value).length === 0) {
      t.hasDanglingSpaces = t.children.length > 0, t.children = [];
      return;
    }
    let r = WC(t), n = Bh(t);
    if (!r) for (let o = 0; o < t.children.length; o++) {
      let i = t.children[o];
      if (i.type !== "text") continue;
      let { leadingWhitespace: l, text: u, trailingWhitespace: c } = $C(i.value), p = i.prev, d = i.next;
      u ? (i.value = u, i.sourceSpan = new z(i.sourceSpan.start.moveBy(l.length), i.sourceSpan.end.moveBy(-c.length)), l && (p && (p.hasTrailingSpaces =
      !0), i.hasLeadingSpaces = !0), c && (i.hasTrailingSpaces = !0, d && (d.hasLeadingSpaces = !0))) : (t.removeChild(i), o--, (l || c) && (p &&
      (p.hasTrailingSpaces = !0), d && (d.hasLeadingSpaces = !0)));
    }
    t.isWhitespaceSensitive = r, t.isIndentationSensitive = n;
  });
}
function FR(e) {
  e.walk((t) => {
    t.isSelfClosing = !t.children || t.type === "element" && (t.tagDefinition.isVoid || t.endSourceSpan && t.startSourceSpan.start === t.endSourceSpan.
    start && t.startSourceSpan.end === t.endSourceSpan.end);
  });
}
function kR(e, t) {
  e.walk((r) => {
    r.type === "element" && (r.hasHtmComponentClosingTag = r.endSourceSpan && /^<\s*\/\s*\/\s*>$/u.test(t.originalText.slice(r.endSourceSpan.
    start.offset, r.endSourceSpan.end.offset)));
  });
}
function LR(e, t) {
  e.walk((r) => {
    r.cssDisplay = iE(r, t);
  });
}
function TR(e, t) {
  e.walk((r) => {
    let { children: n } = r;
    if (n) {
      if (n.length === 0) {
        r.isDanglingSpaceSensitive = GC(r);
        return;
      }
      for (let o of n) o.isLeadingSpaceSensitive = qC(o, t), o.isTrailingSpaceSensitive = UC(o, t);
      for (let o = 0; o < n.length; o++) {
        let i = n[o];
        i.isLeadingSpaceSensitive = (o === 0 || i.prev.isTrailingSpaceSensitive) && i.isLeadingSpaceSensitive, i.isTrailingSpaceSensitive = (o ===
        n.length - 1 || i.next.isLeadingSpaceSensitive) && i.isTrailingSpaceSensitive;
      }
    }
  });
}
function BR(e, t, r) {
  let { node: n } = e;
  switch (n.type) {
    case "front-matter":
      return dt(n.raw);
    case "root":
      return t.__onHtmlRoot && t.__onHtmlRoot(n), [ce(xc(e, t, r)), J];
    case "element":
    case "ieConditionalComment":
      return mR(e, t, r);
    case "angularControlFlowBlock":
      return cR(e, t, r);
    case "angularControlFlowBlockParameters":
      return dR(e, t, r);
    case "angularControlFlowBlockParameter":
      return At.trim(n.expression);
    case "angularLetDeclaration":
      return ce(["@let ", ce([n.id, " =", ce(Ft([we, r("init")]))]), ";"]);
    case "angularLetDeclarationInitializer":
      return n.value;
    case "angularIcuExpression":
      return fR(e, t, r);
    case "angularIcuCase":
      return hR(e, t, r);
    case "ieConditionalStartComment":
    case "ieConditionalEndComment":
      return [Fa(n), Aa(n)];
    case "interpolation":
      return [Fa(n, t), ...e.map(r, "children"), Aa(n, t)];
    case "text": {
      if (n.parent.type === "interpolation") {
        let u = /\n[^\S\n]*$/u, c = u.test(n.value), p = c ? n.value.replace(u, "") : n.value;
        return [dt(p), c ? J : ""];
      }
      let o = Vr(n, t), i = jh(n), l = Nr(n, t);
      return i[0] = [o, i[0]], i.push([i.pop(), l]), Fh(i);
    }
    case "docType":
      return [ce([Fa(n, t), " ", Ue(!1, n.value.replace(/^html\b/iu, "html"), /\s+/gu, " ")]), Aa(n, t)];
    case "comment":
      return [Vr(n, t), dt(t.originalText.slice(Ma(n), _a(n))), Nr(n, t)];
    case "attribute": {
      if (n.value === null) return n.rawName;
      let o = Vh(n.value), i = gC(o, '"');
      return [n.rawName, "=", i, dt(i === '"' ? Ue(!1, o, '"', "&quot;") : Ue(!1, o, "'", "&apos;")), i];
    }
    case "cdata":
    default:
      throw new CC(n, "HTML");
  }
}
function nl(e, t = !0) {
  if (e[0] != ":") return [null, e];
  let r = e.indexOf(":", 1);
  if (r === -1) {
    if (t) throw new Error(`Unsupported format "${e}" expecting ":namespace:name"`);
    return [null, e];
  }
  return [e.slice(1, r), e.slice(r + 1)];
}
function K2(e) {
  return nl(e)[1] === "ng-container";
}
function J2(e) {
  return nl(e)[1] === "ng-content";
}
function Ni(e) {
  return e === null ? null : nl(e)[0];
}
function Ui(e, t) {
  return e ? `:${e}:${t}` : t;
}
function Q2() {
  return $i || ($i = {}, zi(Mr.HTML, ["iframe|srcdoc", "*|innerHTML", "*|outerHTML"]), zi(Mr.STYLE, ["*|style"]), zi(Mr.URL, ["*|formAction",
  "area|href", "area|ping", "audio|src", "a|href", "a|ping", "blockquote|cite", "body|background", "del|cite", "form|action", "img|src", "in\
put|src", "ins|cite", "q|cite", "source|src", "track|src", "video|poster", "video|src"]), zi(Mr.RESOURCE_URL, ["applet|code", "applet|codeba\
se", "base|href", "embed|src", "frame|src", "head|profile", "html|manifest", "iframe|src", "link|href", "media|src", "object|codebase", "obj\
ect|data", "script|src"])), $i;
}
function zi(e, t) {
  for (let r of t) $i[r.toLowerCase()] = e;
}
function GR(e) {
  switch (e) {
    case "width":
    case "height":
    case "minWidth":
    case "minHeight":
    case "maxWidth":
    case "maxHeight":
    case "left":
    case "top":
    case "bottom":
    case "right":
    case "fontSize":
    case "outlineWidth":
    case "outlineOffset":
    case "paddingTop":
    case "paddingLeft":
    case "paddingBottom":
    case "paddingRight":
    case "marginTop":
    case "marginLeft":
    case "marginBottom":
    case "marginRight":
    case "borderRadius":
    case "borderWidth":
    case "borderTopWidth":
    case "borderLeftWidth":
    case "borderRightWidth":
    case "borderBottomWidth":
    case "textIndent":
      return !0;
    default:
      return !1;
  }
}
function ac(e) {
  return Ra || (eh = new _({ canSelfClose: !0 }), Ra = Object.assign(/* @__PURE__ */ Object.create(null), { base: new _({ isVoid: !0 }), meta: new _(
  { isVoid: !0 }), area: new _({ isVoid: !0 }), embed: new _({ isVoid: !0 }), link: new _({ isVoid: !0 }), img: new _({ isVoid: !0 }), input: new _(
  { isVoid: !0 }), param: new _({ isVoid: !0 }), hr: new _({ isVoid: !0 }), br: new _({ isVoid: !0 }), source: new _({ isVoid: !0 }), track: new _(
  { isVoid: !0 }), wbr: new _({ isVoid: !0 }), p: new _({ closedByChildren: ["address", "article", "aside", "blockquote", "div", "dl", "fiel\
dset", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "main", "nav", "ol", "p", "pre", "section", "table", "\
ul"], closedByParent: !0 }), thead: new _({ closedByChildren: ["tbody", "tfoot"] }), tbody: new _({ closedByChildren: ["tbody", "tfoot"], closedByParent: !0 }),
  tfoot: new _({ closedByChildren: ["tbody"], closedByParent: !0 }), tr: new _({ closedByChildren: ["tr"], closedByParent: !0 }), td: new _(
  { closedByChildren: ["td", "th"], closedByParent: !0 }), th: new _({ closedByChildren: ["td", "th"], closedByParent: !0 }), col: new _({ isVoid: !0 }),
  svg: new _({ implicitNamespacePrefix: "svg" }), foreignObject: new _({ implicitNamespacePrefix: "svg", preventNamespaceInheritance: !0 }),
  math: new _({ implicitNamespacePrefix: "math" }), li: new _({ closedByChildren: ["li"], closedByParent: !0 }), dt: new _({ closedByChildren: [
  "dt", "dd"] }), dd: new _({ closedByChildren: ["dt", "dd"], closedByParent: !0 }), rb: new _({ closedByChildren: ["rb", "rt", "rtc", "rp"],
  closedByParent: !0 }), rt: new _({ closedByChildren: ["rb", "rt", "rtc", "rp"], closedByParent: !0 }), rtc: new _({ closedByChildren: ["rb",
  "rtc", "rp"], closedByParent: !0 }), rp: new _({ closedByChildren: ["rb", "rt", "rtc", "rp"], closedByParent: !0 }), optgroup: new _({ closedByChildren: [
  "optgroup"], closedByParent: !0 }), option: new _({ closedByChildren: ["option", "optgroup"], closedByParent: !0 }), pre: new _({ ignoreFirstLf: !0 }),
  listing: new _({ ignoreFirstLf: !0 }), style: new _({ contentType: pt.RAW_TEXT }), script: new _({ contentType: pt.RAW_TEXT }), title: new _(
  { contentType: { default: pt.ESCAPABLE_RAW_TEXT, svg: pt.PARSABLE_DATA } }), textarea: new _({ contentType: pt.ESCAPABLE_RAW_TEXT, ignoreFirstLf: !0 }) }),
  new UR().allKnownElementNames().forEach((t) => {
    !Ra[t] && Ni(t) === null && (Ra[t] = new _({ canSelfClose: !1 }));
  })), Ra[e] ?? eh;
}
function om(e, t, r = null) {
  let n = [], o = e.visit ? (i) => e.visit(i, r) || i.visit(e, r) : (i) => i.visit(e, r);
  return t.forEach((i) => {
    let l = o(i);
    l && n.push(l);
  }), n;
}
function oS(e, t) {
  if (t != null && !(Array.isArray(t) && t.length == 2)) throw new Error(`Expected '${e}' to be an array, [start, end].`);
  if (t != null) {
    let r = t[0], n = t[1];
    nS.forEach((o) => {
      if (o.test(r) || o.test(n)) throw new Error(`['${r}', '${n}'] contains unusable interpolation symbol.`);
    });
  }
}
function lS(e, t, r, n = {}) {
  let o = new cS(new em(e, t), r, n);
  return o.tokenize(), new iS(gS(o.tokens), o.errors, o.nonNormalizedIcuExpressions);
}
function Ln(e) {
  return `Unexpected character "${e === 0 ? "EOF" : String.fromCharCode(e)}"`;
}
function nh(e) {
  return `Unknown entity "${e}" - use the "&#<decimal>;" or  "&#x<hex>;" syntax`;
}
function uS(e, t) {
  return `Unable to parse entity "${t}" - ${e} character reference entities must end with ";"`;
}
function se(e) {
  return !ji(e) || e === 0;
}
function oh(e) {
  return ji(e) || e === 62 || e === 60 || e === 47 || e === 39 || e === 34 || e === 61 || e === 0;
}
function pS(e) {
  return (e < 97 || 122 < e) && (e < 65 || 90 < e) && (e < 48 || e > 57);
}
function dS(e) {
  return e === 59 || e === 0 || !gR(e);
}
function fS(e) {
  return e === 59 || e === 0 || !Wi(e);
}
function hS(e) {
  return e !== 125;
}
function mS(e, t) {
  return ah(e) === ah(t);
}
function ah(e) {
  return e >= 97 && e <= 122 ? e - 97 + 65 : e;
}
function ih(e) {
  return Wi(e) || Cc(e) || e === 95;
}
function lh(e) {
  return e !== 59 && se(e);
}
function gS(e) {
  let t = [], r;
  for (let n = 0; n < e.length; n++) {
    let o = e[n];
    r && r.type === 5 && o.type === 5 || r && r.type === 16 && o.type === 16 ? (r.parts[0] += o.parts[0], r.sourceSpan.end = o.sourceSpan.end) :
    (r = o, t.push(r));
  }
  return t;
}
function sh(e, t) {
  return e.length > 0 && e[e.length - 1] === t;
}
function uh(e, t) {
  return Gi[t] !== void 0 ? Gi[t] || e : /^#x[a-f0-9]+$/i.test(t) ? String.fromCodePoint(parseInt(t.slice(2), 16)) : /^#\d+$/.test(t) ? String.
  fromCodePoint(parseInt(t.slice(1), 10)) : e;
}
function ch(e, t = {}) {
  let { canSelfClose: r = !1, allowHtmComponentClosingTags: n = !1, isTagNameCaseSensitive: o = !1, getTagContentType: i, tokenizeAngularBlocks: l = !1,
  tokenizeAngularLetDeclaration: u = !1 } = t;
  return xS().parse(e, "angular-html-parser", { tokenizeExpansionForms: l, interpolationConfig: void 0, canSelfClose: r, allowHtmComponentClosingTags: n,
  tokenizeBlocks: l, tokenizeLet: u }, o, i);
}
function CS(e, t) {
  let r = new SyntaxError(e + " (" + t.loc.start.line + ":" + t.loc.start.column + ")");
  return Object.assign(r, t);
}
function RS(e) {
  let t = e.slice(0, Sa);
  if (t !== "---" && t !== "+++") return;
  let r = e.indexOf(`
`, Sa);
  if (r === -1) return;
  let n = e.slice(Sa, r).trim(), o = e.indexOf(`
${t}`, r), i = n;
  if (i || (i = t === "+++" ? "toml" : "yaml"), o === -1 && t === "---" && i === "yaml" && (o = e.indexOf(`
...`, r)), o === -1) return;
  let l = o + 1 + Sa, u = e.charAt(l + 1);
  if (!/\s?/u.test(u)) return;
  let c = e.slice(0, l);
  return { type: "front-matter", language: i, explicitLanguage: n, value: e.slice(r + 1, o), startDelimiter: t, endDelimiter: c.slice(-Sa), raw: c };
}
function SS(e) {
  let t = RS(e);
  if (!t) return { content: e };
  let { raw: r } = t;
  return { frontMatter: t, content: Ue(!1, r, /[^\n]/gu, " ") + e.slice(r.length) };
}
function kS(e, t) {
  let r = e.map(t);
  return r.some((n, o) => n !== e[o]) ? r : e;
}
function TS(e, t) {
  if (e.value) for (let { regex: r, parse: n } of LS) {
    let o = e.value.match(r);
    if (o) return n(e, t, o);
  }
  return null;
}
function IS(e, t, r) {
  let [, n, o, i] = r, l = 4 + n.length, u = e.sourceSpan.start.moveBy(l), c = u.moveBy(i.length), [p, d] = (() => {
    try {
      return [!0, t(i, u).children];
    } catch {
      return [!1, [{ type: "text", value: i, sourceSpan: new z(u, c) }]];
    }
  })();
  return { type: "ieConditionalComment", complete: p, children: d, condition: Ue(!1, o.trim(), /\s+/gu, " "), sourceSpan: e.sourceSpan, startSourceSpan: new z(
  e.sourceSpan.start, u), endSourceSpan: new z(c, e.sourceSpan.end) };
}
function BS(e, t, r) {
  let [, n] = r;
  return { type: "ieConditionalStartComment", condition: Ue(!1, n.trim(), /\s+/gu, " "), sourceSpan: e.sourceSpan };
}
function MS(e) {
  return { type: "ieConditionalEndComment", sourceSpan: e.sourceSpan };
}
function PS(e) {
  if (e.type === "block") {
    if (e.name = Ue(!1, e.name.toLowerCase(), /\s+/gu, " ").trim(), e.type = "angularControlFlowBlock", !wc(e.parameters)) {
      delete e.parameters;
      return;
    }
    for (let t of e.parameters) t.type = "angularControlFlowBlockParameter";
    e.parameters = { type: "angularControlFlowBlockParameters", children: e.parameters, sourceSpan: new z(e.parameters[0].sourceSpan.start, Xi(
    !1, e.parameters, -1).sourceSpan.end) };
  }
}
function HS(e) {
  e.type === "letDeclaration" && (e.type = "angularLetDeclaration", e.id = e.name, e.init = { type: "angularLetDeclarationInitializer", sourceSpan: new z(
  e.valueSpan.start, e.valueSpan.end), value: e.value }, delete e.name, delete e.value);
}
function zS(e) {
  (e.type === "plural" || e.type === "select") && (e.clause = e.type, e.type = "angularIcuExpression"), e.type === "expansionCase" && (e.type =
  "angularIcuCase");
}
function lm(e, t, r) {
  let { name: n, canSelfClose: o = !0, normalizeTagName: i = !1, normalizeAttributeName: l = !1, allowHtmComponentClosingTags: u = !1, isTagNameCaseSensitive: c = !1,
  shouldParseAsRawText: p } = t, { rootNodes: d, errors: h } = ch(e, { canSelfClose: o, allowHtmComponentClosingTags: u, isTagNameCaseSensitive: c,
  getTagContentType: p ? (...b) => p(...b) ? pt.RAW_TEXT : void 0 : void 0, tokenizeAngularBlocks: n === "angular" ? !0 : void 0, tokenizeAngularLetDeclaration: n ===
  "angular" ? !0 : void 0 });
  if (n === "vue") {
    if (d.some((C) => C.type === "docType" && C.value === "html" || C.type === "element" && C.name.toLowerCase() === "html")) return lm(e, um,
    r);
    let b, D = /* @__PURE__ */ a(() => b ?? (b = ch(e, { canSelfClose: o, allowHtmComponentClosingTags: u, isTagNameCaseSensitive: c })), "y"),
    x = /* @__PURE__ */ a((C) => D().rootNodes.find(({ startSourceSpan: E }) => E && E.start.offset === C.startSourceSpan.start.offset) ?? C,
    "M");
    for (let [C, E] of d.entries()) {
      let { endSourceSpan: R, startSourceSpan: F } = E;
      if (R === null) h = D().errors, d[C] = x(E);
      else if (OS(E, r)) {
        let A = D().errors.find((k) => k.span.start.offset > F.start.offset && k.span.start.offset < R.end.offset);
        A && dh(A), d[C] = x(E);
      }
    }
  }
  h.length > 0 && dh(h[0]);
  let f = /* @__PURE__ */ a((b) => {
    let D = b.name.startsWith(":") ? b.name.slice(1).split(":")[0] : null, x = b.nameSpan.toString(), C = D !== null && x.startsWith(`${D}:`),
    E = C ? x.slice(D.length + 1) : x;
    b.name = E, b.namespace = D, b.hasExplicitNamespace = C;
  }, "d"), g = /* @__PURE__ */ a((b) => {
    switch (b.type) {
      case "element":
        f(b);
        for (let D of b.attrs) f(D), D.valueSpan ? (D.value = D.valueSpan.toString(), /["']/u.test(D.value[0]) && (D.value = D.value.slice(1,
        -1))) : D.value = null;
        break;
      case "comment":
        b.value = b.sourceSpan.toString().slice(4, -3);
        break;
      case "text":
        b.value = b.sourceSpan.toString();
        break;
    }
  }, "C"), w = /* @__PURE__ */ a((b, D) => {
    let x = b.toLowerCase();
    return D(x) ? x : b;
  }, "A"), m = /* @__PURE__ */ a((b) => {
    if (b.type === "element" && (i && (!b.namespace || b.namespace === b.tagDefinition.implicitNamespacePrefix || La(b)) && (b.name = w(b.name,
    (D) => _S.has(D))), l)) for (let D of b.attrs) D.namespace || (D.name = w(D.name, (x) => tc.has(b.name) && (tc.get("*").has(x) || tc.get(
    b.name).has(x))));
  }, "D"), v = /* @__PURE__ */ a((b) => {
    b.sourceSpan && b.endSourceSpan && (b.sourceSpan = new z(b.sourceSpan.start, b.endSourceSpan.end));
  }, "R"), y = /* @__PURE__ */ a((b) => {
    if (b.type === "element") {
      let D = ac(c ? b.name : b.name.toLowerCase());
      !b.namespace || b.namespace === D.implicitNamespacePrefix || La(b) ? b.tagDefinition = D : b.tagDefinition = ac("");
    }
  }, "F");
  return om(new class extends tS {
    visitExpansionCase(b, D) {
      n === "angular" && this.visitChildren(D, (x) => {
        x(b.expression);
      });
    }
    visit(b) {
      g(b), y(b), m(b), v(b);
    }
  }(), d), d;
}
function OS(e, t) {
  var r;
  if (e.type !== "element" || e.name !== "template") return !1;
  let n = (r = e.attrs.find((o) => o.name === "lang")) == null ? void 0 : r.value;
  return !n || Ji(t, { language: n }) === "html";
}
function dh(e) {
  let { msg: t, span: { start: r, end: n } } = e;
  throw ES(t, { loc: { start: { line: r.line + 1, column: r.col + 1 }, end: { line: n.line + 1, column: n.col + 1 } }, cause: e });
}
function sm(e, t, r = {}, n = !0) {
  let { frontMatter: o, content: i } = n ? AS(e) : { frontMatter: null, content: e }, l = new em(e, r.filepath), u = new oc(l, 0, 0, 0), c = u.
  moveBy(e.length), p = { type: "root", sourceSpan: new z(u, c), children: lm(i, t, r) };
  if (o) {
    let f = new oc(l, 0, 0, 0), g = f.moveBy(o.raw.length);
    o.sourceSpan = new z(f, g), p.children.unshift(o);
  }
  let d = new FS(p), h = /* @__PURE__ */ a((f, g) => {
    let { offset: w } = g, m = Ue(!1, e.slice(0, w), /[^\n\r]/gu, " "), v = sm(m + f, t, r, !1);
    v.sourceSpan = new z(g, Xi(!1, v.children, -1).sourceSpan.end);
    let y = v.children[0];
    return y.length === w ? v.children.shift() : (y.sourceSpan = new z(y.sourceSpan.start.moveBy(w), y.sourceSpan.end), y.value = y.value.slice(
    w)), v;
  }, "f");
  return d.walk((f) => {
    if (f.type === "comment") {
      let g = TS(f, h);
      g && f.parent.replaceChild(f, g);
    }
    PS(f), HS(f), zS(f);
  }), d;
}
function ol(e) {
  return { parse: /* @__PURE__ */ a((t, r) => sm(t, e, r), "parse"), hasPragma: lR, astFormat: "html", locStart: Ma, locEnd: _a };
}
var Qx, fh, hh, mh, lr, eC, tC, gh, rC, Ue, vh, wh, bh, ic, lc, yh, sc, uc, cc, pc, Dh, xh, so, Ch, dc, Eh, Rh, oC, Tn, iC, lC, Sh, Or, fc, Ia,
pC, dC, we, Fe, J, fC, hC, Xi, _i, P2, gC, ct, In, wC, bC, yC, DC, At, Bn, xC, CC, Zi, RC, SC, AC, kC, TC, IC, Ji, _C, PC, HC, zC, La, NC, Th,
$C, sE, qh, dE, fE, hE, gE, wE, bE, yE, DE, xE, N2, CE, RE, Uh, AE, kE, Zu, vc, OE, VE, Yh, Xh, wc, $2, Kh, ZE, JE, Ca, QE, rR, nR, oR, aR, iR,
uR, vR, _r, oc, Mn, em, _n, z, qi, Pn, tm, bR, IR, MR, _R, PR, j2, W2, HR, zR, rm, BV, q2, U2, G2, Y2, X2, Mr, Z2, pt, $i, Hn, OR, NR, $R, VR,
jR, WR, nm, qR, zn, UR, On, _, eh, Ra, Nn, fo, $n, YR, Vn, XR, jn, ZR, Wn, KR, qn, JR, Un, sr, Gn, QR, Yn, eS, Xn, kn, Zn, th, Kn, rh, Jn, tS,
Gi, rS, nS, Pr, aS, am, Qn, Ju, eo, iS, sS, Yi, to, Qu, ro, cS, ur, im, cr, vS, no, Rc, Hr, Ie, oo, wS, ao, bS, zr, yS, io, DS, ec, xS, ES, Sa,
AS, Oi, ph, St, FS, LS, tc, _S, um, NS, $S, VS, jS, WS, cm, pm = S(() => {
  Qx = Object.defineProperty, fh = /* @__PURE__ */ a((e) => {
    throw TypeError(e);
  }, "Xr"), hh = /* @__PURE__ */ a((e, t) => {
    for (var r in t) Qx(e, r, { get: t[r], enumerable: !0 });
  }, "Jr"), mh = /* @__PURE__ */ a((e, t, r) => t.has(e) || fh("Cannot " + r), "Zr"), lr = /* @__PURE__ */ a((e, t, r) => (mh(e, t, "read fr\
om private field"), r ? r.call(e) : t.get(e)), "K"), eC = /* @__PURE__ */ a((e, t, r) => t.has(e) ? fh("Cannot add the same private member m\
ore than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), "en"), tC = /* @__PURE__ */ a((e, t, r, n) => (mh(e, t, "write to private f\
ield"), n ? n.call(e, r) : t.set(e, r), r), "tn"), gh = {};
  hh(gh, { languages: /* @__PURE__ */ a(() => PR, "languages"), options: /* @__PURE__ */ a(() => zR, "options"), parsers: /* @__PURE__ */ a(
  () => rm, "parsers"), printers: /* @__PURE__ */ a(() => WS, "printers") });
  rC = /* @__PURE__ */ a((e, t, r, n) => {
    if (!(e && t == null)) return t.replaceAll ? t.replaceAll(r, n) : r.global ? t.replace(r, n) : t.split(r).join(n);
  }, "ni"), Ue = rC, vh = "string", wh = "array", bh = "cursor", ic = "indent", lc = "align", yh = "trim", sc = "group", uc = "fill", cc = "\
if-break", pc = "indent-if-break", Dh = "line-suffix", xh = "line-suffix-boundary", so = "line", Ch = "label", dc = "break-parent", Eh = /* @__PURE__ */ new Set(
  [bh, ic, lc, yh, sc, uc, cc, pc, Dh, xh, so, Ch, dc]);
  a(nC, "si");
  Rh = nC, oC = /* @__PURE__ */ a((e) => new Intl.ListFormat("en-US", { type: "disjunction" }).format(e), "ii");
  a(aC, "ai");
  iC = (Tn = class extends Error {
    name = "InvalidDocError";
    constructor(t) {
      super(aC(t)), this.doc = t;
    }
  }, a(Tn, "or"), Tn), lC = iC, Sh = /* @__PURE__ */ a(() => {
  }, "rn"), Or = Sh, fc = Sh;
  a(Ft, "k");
  a(Ah, "nn");
  a(ce, "_");
  a(sC, "sn");
  a(uC, "an");
  a(Fh, "Et");
  a(Vi, "le");
  a(cC, "on");
  Ia = { type: dc }, pC = { type: so, hard: !0 }, dC = { type: so, hard: !0, literal: !0 }, we = { type: so }, Fe = { type: so, soft: !0 }, J =
  [pC, Ia], fC = [dC, Ia];
  a(uo, "q");
  hC = /* @__PURE__ */ a((e, t, r) => {
    if (!(e && t == null)) return Array.isArray(t) || typeof t == "string" ? t[r < 0 ? t.length + r : r] : t.at(r);
  }, "li"), Xi = hC;
  a(kh, "lr");
  a(dt, "B");
  _i = "'", P2 = '"';
  a(mC, "ci");
  gC = mC;
  a(vC, "cr");
  wC = (In = class {
    constructor(t) {
      eC(this, ct), tC(this, ct, new Set(t));
    }
    getLeadingWhitespaceCount(t) {
      let r = lr(this, ct), n = 0;
      for (let o = 0; o < t.length && r.has(t.charAt(o)); o++) n++;
      return n;
    }
    getTrailingWhitespaceCount(t) {
      let r = lr(this, ct), n = 0;
      for (let o = t.length - 1; o >= 0 && r.has(t.charAt(o)); o--) n++;
      return n;
    }
    getLeadingWhitespace(t) {
      let r = this.getLeadingWhitespaceCount(t);
      return t.slice(0, r);
    }
    getTrailingWhitespace(t) {
      let r = this.getTrailingWhitespaceCount(t);
      return t.slice(t.length - r);
    }
    hasLeadingWhitespace(t) {
      return lr(this, ct).has(t.charAt(0));
    }
    hasTrailingWhitespace(t) {
      return lr(this, ct).has(Xi(!1, t, -1));
    }
    trimStart(t) {
      let r = this.getLeadingWhitespaceCount(t);
      return t.slice(r);
    }
    trimEnd(t) {
      let r = this.getTrailingWhitespaceCount(t);
      return t.slice(0, t.length - r);
    }
    trim(t) {
      return this.trimEnd(this.trimStart(t));
    }
    split(t, r = !1) {
      let n = `[${vC([...lr(this, ct)].join(""))}]+`, o = new RegExp(r ? `(${n})` : n, "u");
      return t.split(o);
    }
    hasWhitespaceCharacter(t) {
      let r = lr(this, ct);
      return Array.prototype.some.call(t, (n) => r.has(n));
    }
    hasNonWhitespaceCharacter(t) {
      let r = lr(this, ct);
      return Array.prototype.some.call(t, (n) => !r.has(n));
    }
    isWhitespaceOnly(t) {
      let r = lr(this, ct);
      return Array.prototype.every.call(t, (n) => r.has(n));
    }
  }, a(In, "pr"), In);
  ct = /* @__PURE__ */ new WeakMap();
  bC = wC, yC = ["	", `
`, "\f", "\r", " "], DC = new bC(yC), At = DC, xC = (Bn = class extends Error {
    name = "UnexpectedNodeError";
    constructor(t, r, n = "type") {
      super(`Unexpected ${r} node ${n}: ${JSON.stringify(t[n])}.`), this.node = t;
    }
  }, a(Bn, "hr"), Bn), CC = xC;
  a(EC, "mi");
  Zi = EC, RC = /* @__PURE__ */ new Set(["sourceSpan", "startSourceSpan", "endSourceSpan", "nameSpan", "valueSpan", "keySpan", "tagDefinitio\
n", "tokens", "valueTokens", "switchValueSourceSpan", "expSourceSpan", "valueSourceSpan"]), SC = /* @__PURE__ */ new Set(["if", "else if", "\
for", "switch", "case"]);
  a(Lh, "mn");
  Lh.ignoredProperties = RC;
  AC = Lh;
  a(FC, "gi");
  kC = FC;
  a(Ki, "ce");
  a(co, "Y");
  a(ft, "T");
  a(LC, "Ci");
  TC = LC, IC = /* @__PURE__ */ a((e) => String(e).split(/[/\\]/u).pop(), "Si");
  a(H2, "Cn");
  a(BC, "_i");
  a(MC, "Ei");
  Ji = MC, _C = "inline", PC = { area: "none", base: "none", basefont: "none", datalist: "none", head: "none", link: "none", meta: "none", noembed: "\
none", noframes: "none", param: "block", rp: "none", script: "block", style: "none", template: "inline", title: "none", html: "block", body: "\
block", address: "block", blockquote: "block", center: "block", dialog: "block", div: "block", figure: "block", figcaption: "block", footer: "\
block", form: "block", header: "block", hr: "block", legend: "block", listing: "block", main: "block", p: "block", plaintext: "block", pre: "\
block", search: "block", xmp: "block", slot: "contents", ruby: "ruby", rt: "ruby-text", article: "block", aside: "block", h1: "block", h2: "\
block", h3: "block", h4: "block", h5: "block", h6: "block", hgroup: "block", nav: "block", section: "block", dir: "block", dd: "block", dl: "\
block", dt: "block", menu: "block", ol: "block", ul: "block", li: "list-item", table: "table", caption: "table-caption", colgroup: "table-co\
lumn-group", col: "table-column", thead: "table-header-group", tbody: "table-row-group", tfoot: "table-footer-group", tr: "table-row", td: "\
table-cell", th: "table-cell", input: "inline-block", button: "inline-block", fieldset: "block", details: "block", summary: "block", marquee: "\
inline-block", source: "block", track: "block", meter: "inline-block", progress: "inline-block", object: "inline-block", video: "inline-bloc\
k", audio: "inline-block", select: "inline-block", option: "block", optgroup: "block" }, HC = "normal", zC = { listing: "pre", plaintext: "p\
re", pre: "pre", xmp: "pre", nobr: "nowrap", table: "initial", textarea: "pre-wrap" };
  a(OC, "Ai");
  La = OC, NC = /* @__PURE__ */ a((e) => Ue(!1, e, /^[\t\f\r ]*\n/gu, ""), "Di"), Th = /* @__PURE__ */ a((e) => NC(At.trimEnd(e)), "mr"), $C =
  /* @__PURE__ */ a((e) => {
    let t = e, r = At.getLeadingWhitespace(t);
    r && (t = t.slice(r.length));
    let n = At.getTrailingWhitespace(t);
    return n && (t = t.slice(0, -n.length)), { leadingWhitespace: r, trailingWhitespace: n, text: t };
  }, "Dn");
  a(Ih, "Dt");
  a(Qi, "me");
  a(VC, "vi");
  a(tt, "O");
  a(Ot, "U");
  a(jC, "vn");
  a(WC, "yn");
  a(Bh, "fr");
  a(qC, "wn");
  a(UC, "bn");
  a(GC, "Tn");
  a(Pi, "Qe");
  a(YC, "xn");
  a(Mh, "dr");
  a(Xu, "vt");
  a(XC, "yi");
  a(_h, "kn");
  a(Ph, "Bn");
  a(Hh, "Ln");
  a(zh, "Fn");
  a(hc, "yt");
  a(ZC, "wi");
  a(Oh, "Nn");
  a(KC, "bi");
  a(JC, "Ti");
  a(QC, "xi");
  a(z2, "gr");
  a(Ba, "Xe");
  a(eE, "ki");
  a(tE, "Bi");
  a(rE, "Li");
  a(nE, "Fi");
  a(oE, "Ni");
  a(lo, "he");
  a(aE, "Pi");
  a(iE, "Pn");
  a(Nh, "In");
  a(lE, "Ii");
  a($h, "Cr");
  a(Vh, "Sr");
  a(pr, "P");
  sE = /* @__PURE__ */ new Set(["template", "style", "script"]);
  a(el, "Je");
  a(po, "fe");
  a(mc, "wt");
  a(uE, "Rn");
  a(cE, "On");
  a(jh, "bt");
  a(Wh, "Tt");
  qh = /\{\{(.+?)\}\}/su;
  a(pE, "$n");
  a(gc, "Er");
  dE = gc({ parser: "__ng_action" }), fE = gc({ parser: "__ng_binding" }), hE = gc({ parser: "__ng_directive" });
  a(mE, "qi");
  gE = mE;
  a(vE, "Hi");
  wE = vE;
  a(O2, "Hn");
  bE = /^[ \t\n\r\u000c]+/, yE = /^[, \t\n\r\u000c]+/, DE = /^[^ \t\n\r\u000c]+/, xE = /[,]+$/, N2 = /^\d+$/, CE = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;
  a(EE, "Yi");
  RE = EE;
  a(SE, "ji");
  Uh = { width: "w", height: "h", density: "x" }, AE = Object.keys(Uh);
  a(FE, "Qi");
  kE = SE;
  a(LE, "Gn");
  Zu = /* @__PURE__ */ new WeakMap();
  a(TE, "Xi");
  vc = TE;
  a(IE, "Yn");
  a(BE, "jn");
  a(ME, "Kn");
  a(_E, "Ji");
  a(PE, "Zi");
  a(HE, "ea");
  a(zE, "ta");
  a(Gh, "Qn");
  OE = PE;
  a(NE, "ra");
  a($E, "na");
  VE = NE, Yh = new Proxy(() => {
  }, { get: /* @__PURE__ */ a(() => Yh, "get") }), Xh = Yh;
  a(jE, "sa");
  wc = jE;
  a(Ma, "X");
  a(_a, "J");
  a(rc, "Ze");
  a(WE, "ia");
  a(Aa, "de");
  a(qE, "aa");
  a(Nr, "W");
  a(bc, "xt");
  a(Pa, "ge");
  a(Zh, "ts");
  a($r, "j");
  a(Ha, "Ce");
  a(Ta, "Se");
  a(tl, "et");
  a(UE, "oa");
  a(rl, "tt");
  a(GE, "ua");
  a(YE, "la");
  a(nc, "rt");
  a(Fa, "_e");
  a(Vr, "z");
  $2 = "<!doctype";
  a(yc, "kt");
  a(Dc, "Bt");
  a(XE, "ca");
  Kh = XE, ZE = /* @__PURE__ */ new Set(["if", "else if", "for", "switch", "case"]);
  a(KE, "ha");
  JE = KE, Ca = null;
  a(ka, "st");
  QE = 10;
  for (let e = 0; e <= QE; e++) ka();
  a(eR, "vr");
  a(tR, "fa");
  rR = tR, nR = { "front-matter": [], root: ["children"], element: ["attrs", "children"], ieConditionalComment: ["children"], ieConditionalStartComment: [],
  ieConditionalEndComment: [], interpolation: ["children"], text: ["children"], docType: [], comment: [], attribute: [], cdata: [], angularControlFlowBlock: [
  "children", "parameters"], angularControlFlowBlockParameters: ["children"], angularControlFlowBlockParameter: [], angularLetDeclaration: [
  "init"], angularLetDeclarationInitializer: [], angularIcuExpression: ["cases"], angularIcuCase: ["expression"] }, oR = nR, aR = rR(oR), iR =
  aR;
  a(lR, "as");
  a(sR, "os");
  uR = /* @__PURE__ */ new Map([["if", /* @__PURE__ */ new Set(["else if", "else"])], ["else if", /* @__PURE__ */ new Set(["else if", "else"])],
  ["for", /* @__PURE__ */ new Set(["empty"])], ["defer", /* @__PURE__ */ new Set(["placeholder", "error", "loading"])], ["placeholder", /* @__PURE__ */ new Set(
  ["placeholder", "error", "loading"])], ["error", /* @__PURE__ */ new Set(["placeholder", "error", "loading"])], ["loading", /* @__PURE__ */ new Set(
  ["placeholder", "error", "loading"])]]);
  a(Jh, "ls");
  a(Ea, "it");
  a(Hi, "Ft");
  a(xc, "Ne");
  a(cR, "cs");
  a(Qh, "ps");
  a(pR, "Ca");
  a(dR, "hs");
  a(fR, "ms");
  a(hR, "fs");
  a(mR, "ds");
  a(ji, "at");
  a(Cc, "Nt");
  a(Wi, "ot");
  a(gR, "gs");
  a(Ec, "Pt");
  a(V2, "yr");
  a(Ku, "It");
  vR = /-+([a-z0-9])/g;
  a(wR, "Ss");
  oc = (_r = class {
    constructor(t, r, n, o) {
      this.file = t, this.offset = r, this.line = n, this.col = o;
    }
    toString() {
      return this.offset != null ? `${this.file.url}@${this.line}:${this.col}` : this.file.url;
    }
    moveBy(t) {
      let r = this.file.content, n = r.length, o = this.offset, i = this.line, l = this.col;
      for (; o > 0 && t < 0; ) if (o--, t++, r.charCodeAt(o) == 10) {
        i--;
        let u = r.substring(0, o - 1).lastIndexOf(`
`);
        l = u > 0 ? o - u : o;
      } else l--;
      for (; o < n && t > 0; ) {
        let u = r.charCodeAt(o);
        o++, t--, u == 10 ? (i++, l = 0) : l++;
      }
      return new _r(this.file, o, i, l);
    }
    getContext(t, r) {
      let n = this.file.content, o = this.offset;
      if (o != null) {
        o > n.length - 1 && (o = n.length - 1);
        let i = o, l = 0, u = 0;
        for (; l < t && o > 0 && (o--, l++, !(n[o] == `
` && ++u == r)); ) ;
        for (l = 0, u = 0; l < t && i < n.length - 1 && (i++, l++, !(n[i] == `
` && ++u == r)); ) ;
        return { before: n.substring(o, this.offset), after: n.substring(this.offset, i + 1) };
      }
      return null;
    }
  }, a(_r, "t"), _r), em = (Mn = class {
    constructor(t, r) {
      this.content = t, this.url = r;
    }
  }, a(Mn, "Ee"), Mn), z = (_n = class {
    constructor(t, r, n = t, o = null) {
      this.start = t, this.end = r, this.fullStart = n, this.details = o;
    }
    toString() {
      return this.start.file.content.substring(this.start.offset, this.end.offset);
    }
  }, a(_n, "h"), _n);
  (function(e) {
    e[e.WARNING = 0] = "WARNING", e[e.ERROR = 1] = "ERROR";
  })(qi || (qi = {}));
  tm = (Pn = class {
    constructor(t, r, n = qi.ERROR) {
      this.span = t, this.msg = r, this.level = n;
    }
    contextualMessage() {
      let t = this.span.start.getContext(100, 3);
      return t ? `${this.msg} ("${t.before}[${qi[this.level]} ->]${t.after}")` : this.msg;
    }
    toString() {
      let t = this.span.details ? `, ${this.span.details}` : "";
      return `${this.contextualMessage()}: ${this.span.start}${t}`;
    }
  }, a(Pn, "Ie"), Pn), bR = [DR, xR, ER, SR, AR, LR, FR, kR, TR, RR];
  a(yR, "Ea");
  a(DR, "Aa");
  a(xR, "Da");
  a(CR, "va");
  a(ER, "ya");
  a(RR, "wa");
  a(SR, "ba");
  a(AR, "Ta");
  a(FR, "xa");
  a(kR, "ka");
  a(LR, "Ba");
  a(TR, "La");
  IR = yR;
  a(BR, "Fa");
  MR = { preprocess: IR, print: BR, insertPragma: sR, massageAstNode: AC, embed: JE, getVisitorKeys: iR }, _R = MR, PR = [{ linguistLanguageId: 146,
  name: "Angular", type: "markup", tmScope: "text.html.basic", aceMode: "html", codemirrorMode: "htmlmixed", codemirrorMimeType: "text/html",
  color: "#e34c26", aliases: ["xhtml"], extensions: [".component.html"], parsers: ["angular"], vscodeLanguageIds: ["html"], filenames: [] },
  { linguistLanguageId: 146, name: "HTML", type: "markup", tmScope: "text.html.basic", aceMode: "html", codemirrorMode: "htmlmixed", codemirrorMimeType: "\
text/html", color: "#e34c26", aliases: ["xhtml"], extensions: [".html", ".hta", ".htm", ".html.hl", ".inc", ".xht", ".xhtml", ".mjml"], parsers: [
  "html"], vscodeLanguageIds: ["html"] }, { linguistLanguageId: 146, name: "Lightning Web Components", type: "markup", tmScope: "text.html.b\
asic", aceMode: "html", codemirrorMode: "htmlmixed", codemirrorMimeType: "text/html", color: "#e34c26", aliases: ["xhtml"], extensions: [], parsers: [
  "lwc"], vscodeLanguageIds: ["html"], filenames: [] }, { linguistLanguageId: 391, name: "Vue", type: "markup", color: "#41b883", extensions: [
  ".vue"], tmScope: "text.html.vue", aceMode: "html", parsers: ["vue"], vscodeLanguageIds: ["vue"] }], j2 = { bracketSpacing: { category: "C\
ommon", type: "boolean", default: !0, description: "Print spaces between brackets.", oppositeDescription: "Do not print spaces between brack\
ets." }, singleQuote: { category: "Common", type: "boolean", default: !1, description: "Use single quotes instead of double quotes." }, proseWrap: {
  category: "Common", type: "choice", default: "preserve", description: "How to wrap prose.", choices: [{ value: "always", description: "Wra\
p prose if it exceeds the print width." }, { value: "never", description: "Do not wrap prose." }, { value: "preserve", description: "Wrap pr\
ose as-is." }] }, bracketSameLine: { category: "Common", type: "boolean", default: !1, description: "Put > of opening tags on the last line \
instead of on a new line." }, singleAttributePerLine: { category: "Common", type: "boolean", default: !1, description: "Enforce single attri\
bute per line in HTML, Vue and JSX." } }, W2 = "HTML", HR = { bracketSameLine: j2.bracketSameLine, htmlWhitespaceSensitivity: { category: W2,
  type: "choice", default: "css", description: "How to handle whitespaces in HTML.", choices: [{ value: "css", description: "Respect the def\
ault value of CSS display property." }, { value: "strict", description: "Whitespaces are considered sensitive." }, { value: "ignore", description: "\
Whitespaces are considered insensitive." }] }, singleAttributePerLine: j2.singleAttributePerLine, vueIndentScriptAndStyle: { category: W2, type: "\
boolean", default: !1, description: "Indent script and style tags in Vue files." } }, zR = HR, rm = {};
  hh(rm, { angular: /* @__PURE__ */ a(() => $S, "angular"), html: /* @__PURE__ */ a(() => NS, "html"), lwc: /* @__PURE__ */ a(() => jS, "lwc"),
  vue: /* @__PURE__ */ a(() => VS, "vue") });
  BV = new RegExp(`(\\:not\\()|(([\\.\\#]?)[-\\w]+)|(?:\\[([-.\\w*\\\\$]+)(?:=(["']?)([^\\]"']*)\\5)?\\])|(\\))|(\\s*,\\s*)`, "g");
  (function(e) {
    e[e.Emulated = 0] = "Emulated", e[e.None = 2] = "None", e[e.ShadowDom = 3] = "ShadowDom";
  })(q2 || (q2 = {}));
  (function(e) {
    e[e.OnPush = 0] = "OnPush", e[e.Default = 1] = "Default";
  })(U2 || (U2 = {}));
  (function(e) {
    e[e.None = 0] = "None", e[e.SignalBased = 1] = "SignalBased", e[e.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform";
  })(G2 || (G2 = {}));
  Y2 = { name: "custom-elements" }, X2 = { name: "no-errors-schema" };
  (function(e) {
    e[e.NONE = 0] = "NONE", e[e.HTML = 1] = "HTML", e[e.STYLE = 2] = "STYLE", e[e.SCRIPT = 3] = "SCRIPT", e[e.URL = 4] = "URL", e[e.RESOURCE_URL =
    5] = "RESOURCE_URL";
  })(Mr || (Mr = {}));
  (function(e) {
    e[e.Error = 0] = "Error", e[e.Warning = 1] = "Warning", e[e.Ignore = 2] = "Ignore";
  })(Z2 || (Z2 = {}));
  (function(e) {
    e[e.RAW_TEXT = 0] = "RAW_TEXT", e[e.ESCAPABLE_RAW_TEXT = 1] = "ESCAPABLE_RAW_TEXT", e[e.PARSABLE_DATA = 2] = "PARSABLE_DATA";
  })(pt || (pt = {}));
  a(nl, "ut");
  a(K2, "xr");
  a(J2, "kr");
  a(Ni, "Re");
  a(Ui, "Oe");
  a(Q2, "Br");
  a(zi, "Ot");
  OR = (Hn = class {
  }, a(Hn, "Mt"), Hn), NR = "boolean", $R = "number", VR = "string", jR = "object", WR = ["[Element]|textContent,%ariaAtomic,%ariaAutoComple\
te,%ariaBusy,%ariaChecked,%ariaColCount,%ariaColIndex,%ariaColSpan,%ariaCurrent,%ariaDescription,%ariaDisabled,%ariaExpanded,%ariaHasPopup,%\
ariaHidden,%ariaKeyShortcuts,%ariaLabel,%ariaLevel,%ariaLive,%ariaModal,%ariaMultiLine,%ariaMultiSelectable,%ariaOrientation,%ariaPlaceholde\
r,%ariaPosInSet,%ariaPressed,%ariaReadOnly,%ariaRelevant,%ariaRequired,%ariaRoleDescription,%ariaRowCount,%ariaRowIndex,%ariaRowSpan,%ariaSe\
lected,%ariaSetSize,%ariaSort,%ariaValueMax,%ariaValueMin,%ariaValueNow,%ariaValueText,%classList,className,elementTiming,id,innerHTML,*befo\
recopy,*beforecut,*beforepaste,*fullscreenchange,*fullscreenerror,*search,*webkitfullscreenchange,*webkitfullscreenerror,outerHTML,%part,#sc\
rollLeft,#scrollTop,slot,*message,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*webglcontextcreatione\
rror,*webglcontextlost,*webglcontextrestored", "[HTMLElement]^[Element]|accessKey,autocapitalize,!autofocus,contentEditable,dir,!draggable,e\
nterKeyHint,!hidden,!inert,innerText,inputMode,lang,nonce,*abort,*animationend,*animationiteration,*animationstart,*auxclick,*beforexrselect\
,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragle\
ave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointercapture,*input,*invalid,*keydown,*keypress\
,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,\
*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointero\
ver,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*securitypolicyviolation,*seeked,*seeking,*select,*selectionch\
ange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transitioncancel,*transitionend,*transitionrun,*transitionstart\
,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimationstart,*webkittransitionend,*wheel,outerText,!spellchec\
k,%style,#tabIndex,title,!translate,virtualKeyboardPolicy", "abbr,address,article,aside,b,bdi,bdo,cite,content,code,dd,dfn,dt,em,figcaption,\
figure,footer,header,hgroup,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,section,small,strong,sub,sup,u,var,wbr^[HTMLElement]|acces\
sKey,autocapitalize,!autofocus,contentEditable,dir,!draggable,enterKeyHint,!hidden,innerText,inputMode,lang,nonce,*abort,*animationend,*anim\
ationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cu\
echange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formda\
ta,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,\
*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*point\
erenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*secur\
itypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transit\
ioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimati\
onstart,*webkittransitionend,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate,virtualKeyboardPolicy", "media^[HTMLElement]|!au\
toplay,!controls,%controlsList,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,*\
waitingforkey,#playbackRate,preload,!preservesPitch,src,%srcObject,#volume", ":svg:^[HTMLElement]|!autofocus,nonce,*abort,*animationend,*ani\
mationiteration,*animationstart,*auxclick,*beforexrselect,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*c\
uechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formd\
ata,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown\
,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*poin\
terenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*secu\
ritypolicyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transi\
tioncancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimat\
ionstart,*webkittransitionend,*wheel,%style,#tabIndex", ":svg:graphics^:svg:|", ":svg:animation^:svg:|*begin,*end,*repeat", ":svg:geometry^:\
svg:|", ":svg:componentTransferFunction^:svg:|", ":svg:gradient^:svg:|", ":svg:textContent^:svg:graphics|", ":svg:textPositioning^:svg:textC\
ontent|", "a^[HTMLElement]|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,referrerPolicy\
,rel,%relList,rev,search,shape,target,text,type,username", "area^[HTMLElement]|alt,coords,download,hash,host,hostname,href,!noHref,password,\
pathname,ping,port,protocol,referrerPolicy,rel,%relList,search,shape,target,username", "audio^media|", "br^[HTMLElement]|clear", "base^[HTML\
Element]|href,target", "body^[HTMLElement]|aLink,background,bgColor,link,*afterprint,*beforeprint,*beforeunload,*blur,*error,*focus,*hashcha\
nge,*languagechange,*load,*message,*messageerror,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*\
unhandledrejection,*unload,text,vLink", "button^[HTMLElement]|!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,ty\
pe,value", "canvas^[HTMLElement]|#height,#width", "content^[HTMLElement]|select", "dl^[HTMLElement]|!compact", "data^[HTMLElement]|value", "\
datalist^[HTMLElement]|", "details^[HTMLElement]|!open", "dialog^[HTMLElement]|!open,returnValue", "dir^[HTMLElement]|!compact", "div^[HTMLE\
lement]|align", "embed^[HTMLElement]|align,height,name,src,type,width", "fieldset^[HTMLElement]|!disabled,name", "font^[HTMLElement]|color,f\
ace,size", "form^[HTMLElement]|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target", "frame^[HTMLElement]|fram\
eBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src", "frameset^[HTMLElement]|cols,*afterprint,*beforeprint,*beforeunload\
,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*messageerror,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandl\
ed,*resize,*scroll,*storage,*unhandledrejection,*unload,rows", "hr^[HTMLElement]|align,color,!noShade,size,width", "head^[HTMLElement]|", "h\
1,h2,h3,h4,h5,h6^[HTMLElement]|align", "html^[HTMLElement]|version", "iframe^[HTMLElement]|align,allow,!allowFullscreen,!allowPaymentRequest\
,csp,frameBorder,height,loading,longDesc,marginHeight,marginWidth,name,referrerPolicy,%sandbox,scrolling,src,srcdoc,width", "img^[HTMLElemen\
t]|align,alt,border,%crossOrigin,decoding,#height,#hspace,!isMap,loading,longDesc,lowsrc,name,referrerPolicy,sizes,src,srcset,useMap,#vspace\
,#width", "input^[HTMLElement]|accept,align,alt,autocomplete,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formE\
nctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeh\
older,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#wid\
th", "li^[HTMLElement]|type,#value", "label^[HTMLElement]|htmlFor", "legend^[HTMLElement]|align", "link^[HTMLElement]|as,charset,%crossOrigi\
n,!disabled,href,hreflang,imageSizes,imageSrcset,integrity,media,referrerPolicy,rel,%relList,rev,%sizes,target,type", "map^[HTMLElement]|nam\
e", "marquee^[HTMLElement]|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width", "menu^[HTML\
Element]|!compact", "meta^[HTMLElement]|content,httpEquiv,media,name,scheme", "meter^[HTMLElement]|#high,#low,#max,#min,#optimum,#value", "i\
ns,del^[HTMLElement]|cite,dateTime", "ol^[HTMLElement]|!compact,!reversed,#start,type", "object^[HTMLElement]|align,archive,border,code,code\
Base,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width", "optgroup^[HTMLElement]|!disabled,label", "option^[HTMLE\
lement]|!defaultSelected,!disabled,label,!selected,text,value", "output^[HTMLElement]|defaultValue,%htmlFor,name,value", "p^[HTMLElement]|al\
ign", "param^[HTMLElement]|name,type,value,valueType", "picture^[HTMLElement]|", "pre^[HTMLElement]|#width", "progress^[HTMLElement]|#max,#v\
alue", "q,blockquote,cite^[HTMLElement]|", "script^[HTMLElement]|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,!noModule,%refer\
rerPolicy,src,text,type", "select^[HTMLElement]|autocomplete,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value", "slot^[\
HTMLElement]|name", "source^[HTMLElement]|#height,media,sizes,src,srcset,type,#width", "span^[HTMLElement]|", "style^[HTMLElement]|!disabled\
,media,type", "caption^[HTMLElement]|align", "th,td^[HTMLElement]|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,\
scope,vAlign,width", "col,colgroup^[HTMLElement]|align,ch,chOff,#span,vAlign,width", "table^[HTMLElement]|align,bgColor,border,%caption,cell\
Padding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width", "tr^[HTMLElement]|align,bgColor,ch,chOff,vAlign", "tfoot,thead,tbody^[HTMLElem\
ent]|align,ch,chOff,vAlign", "template^[HTMLElement]|", "textarea^[HTMLElement]|autocomplete,#cols,defaultValue,dirName,!disabled,#maxLength\
,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap", "time^[HTMLElement]|dat\
eTime", "title^[HTMLElement]|text", "track^[HTMLElement]|!default,kind,label,src,srclang", "ul^[HTMLElement]|!compact,type", "unknown^[HTMLE\
lement]|", "video^media|!disablePictureInPicture,#height,*enterpictureinpicture,*leavepictureinpicture,!playsInline,poster,#width", ":svg:a^\
:svg:graphics|", ":svg:animate^:svg:animation|", ":svg:animateMotion^:svg:animation|", ":svg:animateTransform^:svg:animation|", ":svg:circle\
^:svg:geometry|", ":svg:clipPath^:svg:graphics|", ":svg:defs^:svg:graphics|", ":svg:desc^:svg:|", ":svg:discard^:svg:|", ":svg:ellipse^:svg:\
geometry|", ":svg:feBlend^:svg:|", ":svg:feColorMatrix^:svg:|", ":svg:feComponentTransfer^:svg:|", ":svg:feComposite^:svg:|", ":svg:feConvol\
veMatrix^:svg:|", ":svg:feDiffuseLighting^:svg:|", ":svg:feDisplacementMap^:svg:|", ":svg:feDistantLight^:svg:|", ":svg:feDropShadow^:svg:|",
  ":svg:feFlood^:svg:|", ":svg:feFuncA^:svg:componentTransferFunction|", ":svg:feFuncB^:svg:componentTransferFunction|", ":svg:feFuncG^:svg:\
componentTransferFunction|", ":svg:feFuncR^:svg:componentTransferFunction|", ":svg:feGaussianBlur^:svg:|", ":svg:feImage^:svg:|", ":svg:feMe\
rge^:svg:|", ":svg:feMergeNode^:svg:|", ":svg:feMorphology^:svg:|", ":svg:feOffset^:svg:|", ":svg:fePointLight^:svg:|", ":svg:feSpecularLigh\
ting^:svg:|", ":svg:feSpotLight^:svg:|", ":svg:feTile^:svg:|", ":svg:feTurbulence^:svg:|", ":svg:filter^:svg:|", ":svg:foreignObject^:svg:gr\
aphics|", ":svg:g^:svg:graphics|", ":svg:image^:svg:graphics|decoding", ":svg:line^:svg:geometry|", ":svg:linearGradient^:svg:gradient|", ":\
svg:mpath^:svg:|", ":svg:marker^:svg:|", ":svg:mask^:svg:|", ":svg:metadata^:svg:|", ":svg:path^:svg:geometry|", ":svg:pattern^:svg:|", ":sv\
g:polygon^:svg:geometry|", ":svg:polyline^:svg:geometry|", ":svg:radialGradient^:svg:gradient|", ":svg:rect^:svg:geometry|", ":svg:svg^:svg:\
graphics|#currentScale,#zoomAndPan", ":svg:script^:svg:|type", ":svg:set^:svg:animation|", ":svg:stop^:svg:|", ":svg:style^:svg:|!disabled,m\
edia,title,type", ":svg:switch^:svg:graphics|", ":svg:symbol^:svg:|", ":svg:tspan^:svg:textPositioning|", ":svg:text^:svg:textPositioning|",
  ":svg:textPath^:svg:textContent|", ":svg:title^:svg:|", ":svg:use^:svg:graphics|", ":svg:view^:svg:|#zoomAndPan", "data^[HTMLElement]|valu\
e", "keygen^[HTMLElement]|!autofocus,challenge,!disabled,form,keytype,name", "menuitem^[HTMLElement]|type,label,icon,!disabled,!checked,radi\
ogroup,!default", "summary^[HTMLElement]|", "time^[HTMLElement]|dateTime", ":svg:cursor^:svg:|", ":math:^[HTMLElement]|!autofocus,nonce,*abo\
rt,*animationend,*animationiteration,*animationstart,*auxclick,*beforeinput,*beforematch,*beforetoggle,*beforexrselect,*blur,*cancel,*canpla\
y,*canplaythrough,*change,*click,*close,*contentvisibilityautostatechange,*contextlost,*contextmenu,*contextrestored,*copy,*cuechange,*cut,*\
dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*formdata,*gotpointer\
capture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*m\
ouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*paste,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*point\
erleave,*pointermove,*pointerout,*pointerover,*pointerrawupdate,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*scrollend,*security\
policyviolation,*seeked,*seeking,*select,*selectionchange,*selectstart,*slotchange,*stalled,*submit,*suspend,*timeupdate,*toggle,*transition\
cancel,*transitionend,*transitionrun,*transitionstart,*volumechange,*waiting,*webkitanimationend,*webkitanimationiteration,*webkitanimations\
tart,*webkittransitionend,*wheel,%style,#tabIndex", ":math:math^:math:|", ":math:maction^:math:|", ":math:menclose^:math:|", ":math:merror^:\
math:|", ":math:mfenced^:math:|", ":math:mfrac^:math:|", ":math:mi^:math:|", ":math:mmultiscripts^:math:|", ":math:mn^:math:|", ":math:mo^:m\
ath:|", ":math:mover^:math:|", ":math:mpadded^:math:|", ":math:mphantom^:math:|", ":math:mroot^:math:|", ":math:mrow^:math:|", ":math:ms^:ma\
th:|", ":math:mspace^:math:|", ":math:msqrt^:math:|", ":math:mstyle^:math:|", ":math:msub^:math:|", ":math:msubsup^:math:|", ":math:msup^:ma\
th:|", ":math:mtable^:math:|", ":math:mtd^:math:|", ":math:mtext^:math:|", ":math:mtr^:math:|", ":math:munder^:math:|", ":math:munderover^:m\
ath:|", ":math:semantics^:math:|"], nm = new Map(Object.entries({ class: "className", for: "htmlFor", formaction: "formAction", innerHtml: "\
innerHTML", readonly: "readOnly", tabindex: "tabIndex" })), qR = Array.from(nm).reduce((e, [t, r]) => (e.set(t, r), e), /* @__PURE__ */ new Map()),
  UR = (zn = class extends OR {
    constructor() {
      super(), this._schema = /* @__PURE__ */ new Map(), this._eventSchema = /* @__PURE__ */ new Map(), WR.forEach((t) => {
        let r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), [o, i] = t.split("|"), l = i.split(","), [u, c] = o.split("^");
        u.split(",").forEach((d) => {
          this._schema.set(d.toLowerCase(), r), this._eventSchema.set(d.toLowerCase(), n);
        });
        let p = c && this._schema.get(c.toLowerCase());
        if (p) {
          for (let [d, h] of p) r.set(d, h);
          for (let d of this._eventSchema.get(c.toLowerCase())) n.add(d);
        }
        l.forEach((d) => {
          if (d.length > 0) switch (d[0]) {
            case "*":
              n.add(d.substring(1));
              break;
            case "!":
              r.set(d.substring(1), NR);
              break;
            case "#":
              r.set(d.substring(1), $R);
              break;
            case "%":
              r.set(d.substring(1), jR);
              break;
            default:
              r.set(d, VR);
          }
        });
      });
    }
    hasProperty(t, r, n) {
      if (n.some((o) => o.name === X2.name)) return !0;
      if (t.indexOf("-") > -1) {
        if (K2(t) || J2(t)) return !1;
        if (n.some((o) => o.name === Y2.name)) return !0;
      }
      return (this._schema.get(t.toLowerCase()) || this._schema.get("unknown")).has(r);
    }
    hasElement(t, r) {
      return r.some((n) => n.name === X2.name) || t.indexOf("-") > -1 && (K2(t) || J2(t) || r.some((n) => n.name === Y2.name)) ? !0 : this._schema.
      has(t.toLowerCase());
    }
    securityContext(t, r, n) {
      n && (r = this.getMappedPropName(r)), t = t.toLowerCase(), r = r.toLowerCase();
      let o = Q2()[t + "|" + r];
      return o || (o = Q2()["*|" + r], o || Mr.NONE);
    }
    getMappedPropName(t) {
      return nm.get(t) ?? t;
    }
    getDefaultComponentElementName() {
      return "ng-component";
    }
    validateProperty(t) {
      return t.toLowerCase().startsWith("on") ? { error: !0, msg: `Binding to event property '${t}' is disallowed for security reasons, plea\
se use (${t.slice(2)})=...
If '${t}' is a directive input, make sure the directive is imported by the current module.` } : { error: !1 };
    }
    validateAttribute(t) {
      return t.toLowerCase().startsWith("on") ? { error: !0, msg: `Binding to event attribute '${t}' is disallowed for security reasons, ple\
ase use (${t.slice(2)})=...` } : { error: !1 };
    }
    allKnownElementNames() {
      return Array.from(this._schema.keys());
    }
    allKnownAttributesOfElement(t) {
      let r = this._schema.get(t.toLowerCase()) || this._schema.get("unknown");
      return Array.from(r.keys()).map((n) => qR.get(n) ?? n);
    }
    allKnownEventsOfElement(t) {
      return Array.from(this._eventSchema.get(t.toLowerCase()) ?? []);
    }
    normalizeAnimationStyleProperty(t) {
      return wR(t);
    }
    normalizeAnimationStyleValue(t, r, n) {
      let o = "", i = n.toString().trim(), l = null;
      if (GR(t) && n !== 0 && n !== "0") if (typeof n == "number") o = "px";
      else {
        let u = n.match(/^[+-]?[\d\.]+([a-z]*)$/);
        u && u[1].length == 0 && (l = `Please provide a CSS unit value for ${r}:${n}`);
      }
      return { error: l, value: i + o };
    }
  }, a(zn, "qt"), zn);
  a(GR, "Ha");
  _ = (On = class {
    constructor({ closedByChildren: t, implicitNamespacePrefix: r, contentType: n = pt.PARSABLE_DATA, closedByParent: o = !1, isVoid: i = !1,
    ignoreFirstLf: l = !1, preventNamespaceInheritance: u = !1, canSelfClose: c = !1 } = {}) {
      this.closedByChildren = {}, this.closedByParent = !1, t && t.length > 0 && t.forEach((p) => this.closedByChildren[p] = !0), this.isVoid =
      i, this.closedByParent = o || i, this.implicitNamespacePrefix = r || null, this.contentType = n, this.ignoreFirstLf = l, this.preventNamespaceInheritance =
      u, this.canSelfClose = c ?? i;
    }
    isClosedByChild(t) {
      return this.isVoid || t.toLowerCase() in this.closedByChildren;
    }
    getContentType(t) {
      return typeof this.contentType == "object" ? (t === void 0 ? void 0 : this.contentType[t]) ?? this.contentType.default : this.contentType;
    }
  }, a(On, "m"), On);
  a(ac, "$e");
  fo = (Nn = class {
    constructor(t, r) {
      this.sourceSpan = t, this.i18n = r;
    }
  }, a(Nn, "ae"), Nn), YR = ($n = class extends fo {
    constructor(t, r, n, o) {
      super(r, o), this.value = t, this.tokens = n, this.type = "text";
    }
    visit(t, r) {
      return t.visitText(this, r);
    }
  }, a($n, "Ht"), $n), XR = (Vn = class extends fo {
    constructor(t, r, n, o) {
      super(r, o), this.value = t, this.tokens = n, this.type = "cdata";
    }
    visit(t, r) {
      return t.visitCdata(this, r);
    }
  }, a(Vn, "Vt"), Vn), ZR = (jn = class extends fo {
    constructor(t, r, n, o, i, l) {
      super(o, l), this.switchValue = t, this.type = r, this.cases = n, this.switchValueSourceSpan = i;
    }
    visit(t, r) {
      return t.visitExpansion(this, r);
    }
  }, a(jn, "Ut"), jn), KR = (Wn = class {
    constructor(t, r, n, o, i) {
      this.value = t, this.expression = r, this.sourceSpan = n, this.valueSourceSpan = o, this.expSourceSpan = i, this.type = "expansionCase";
    }
    visit(t, r) {
      return t.visitExpansionCase(this, r);
    }
  }, a(Wn, "Wt"), Wn), JR = (qn = class extends fo {
    constructor(t, r, n, o, i, l, u) {
      super(n, u), this.name = t, this.value = r, this.keySpan = o, this.valueSpan = i, this.valueTokens = l, this.type = "attribute";
    }
    visit(t, r) {
      return t.visitAttribute(this, r);
    }
    get nameSpan() {
      return this.keySpan;
    }
  }, a(qn, "zt"), qn), sr = (Un = class extends fo {
    constructor(t, r, n, o, i, l = null, u = null, c) {
      super(o, c), this.name = t, this.attrs = r, this.children = n, this.startSourceSpan = i, this.endSourceSpan = l, this.nameSpan = u, this.
      type = "element";
    }
    visit(t, r) {
      return t.visitElement(this, r);
    }
  }, a(Un, "G"), Un), QR = (Gn = class {
    constructor(t, r) {
      this.value = t, this.sourceSpan = r, this.type = "comment";
    }
    visit(t, r) {
      return t.visitComment(this, r);
    }
  }, a(Gn, "Gt"), Gn), eS = (Yn = class {
    constructor(t, r) {
      this.value = t, this.sourceSpan = r, this.type = "docType";
    }
    visit(t, r) {
      return t.visitDocType(this, r);
    }
  }, a(Yn, "Yt"), Yn), kn = (Xn = class extends fo {
    constructor(t, r, n, o, i, l, u = null, c) {
      super(o, c), this.name = t, this.parameters = r, this.children = n, this.nameSpan = i, this.startSourceSpan = l, this.endSourceSpan = u,
      this.type = "block";
    }
    visit(t, r) {
      return t.visitBlock(this, r);
    }
  }, a(Xn, "ee"), Xn), th = (Zn = class {
    constructor(t, r) {
      this.expression = t, this.sourceSpan = r, this.type = "blockParameter", this.startSourceSpan = null, this.endSourceSpan = null;
    }
    visit(t, r) {
      return t.visitBlockParameter(this, r);
    }
  }, a(Zn, "ct"), Zn), rh = (Kn = class {
    constructor(t, r, n, o, i) {
      this.name = t, this.value = r, this.sourceSpan = n, this.nameSpan = o, this.valueSpan = i, this.type = "letDeclaration", this.startSourceSpan =
      null, this.endSourceSpan = null;
    }
    visit(t, r) {
      return t.visitLetDeclaration(this, r);
    }
  }, a(Kn, "pt"), Kn);
  a(om, "jt");
  tS = (Jn = class {
    constructor() {
    }
    visitElement(t, r) {
      this.visitChildren(r, (n) => {
        n(t.attrs), n(t.children);
      });
    }
    visitAttribute(t, r) {
    }
    visitText(t, r) {
    }
    visitCdata(t, r) {
    }
    visitComment(t, r) {
    }
    visitDocType(t, r) {
    }
    visitExpansion(t, r) {
      return this.visitChildren(r, (n) => {
        n(t.cases);
      });
    }
    visitExpansionCase(t, r) {
    }
    visitBlock(t, r) {
      this.visitChildren(r, (n) => {
        n(t.parameters), n(t.children);
      });
    }
    visitBlockParameter(t, r) {
    }
    visitLetDeclaration(t, r) {
    }
    visitChildren(t, r) {
      let n = [], o = this;
      function i(l) {
        l && n.push(om(o, l, t));
      }
      return a(i, "i"), r(i), Array.prototype.concat.apply([], n);
    }
  }, a(Jn, "ht"), Jn), Gi = { AElig: "\xC6", AMP: "&", amp: "&", Aacute: "\xC1", Abreve: "\u0102", Acirc: "\xC2", Acy: "\u0410", Afr: "\u{1D504}",
  Agrave: "\xC0", Alpha: "\u0391", Amacr: "\u0100", And: "\u2A53", Aogon: "\u0104", Aopf: "\u{1D538}", ApplyFunction: "\u2061", af: "\u2061",
  Aring: "\xC5", angst: "\xC5", Ascr: "\u{1D49C}", Assign: "\u2254", colone: "\u2254", coloneq: "\u2254", Atilde: "\xC3", Auml: "\xC4", Backslash: "\
\u2216", setminus: "\u2216", setmn: "\u2216", smallsetminus: "\u2216", ssetmn: "\u2216", Barv: "\u2AE7", Barwed: "\u2306", doublebarwedge: "\
\u2306", Bcy: "\u0411", Because: "\u2235", becaus: "\u2235", because: "\u2235", Bernoullis: "\u212C", Bscr: "\u212C", bernou: "\u212C", Beta: "\
\u0392", Bfr: "\u{1D505}", Bopf: "\u{1D539}", Breve: "\u02D8", breve: "\u02D8", Bumpeq: "\u224E", HumpDownHump: "\u224E", bump: "\u224E", CHcy: "\
\u0427", COPY: "\xA9", copy: "\xA9", Cacute: "\u0106", Cap: "\u22D2", CapitalDifferentialD: "\u2145", DD: "\u2145", Cayleys: "\u212D", Cfr: "\
\u212D", Ccaron: "\u010C", Ccedil: "\xC7", Ccirc: "\u0108", Cconint: "\u2230", Cdot: "\u010A", Cedilla: "\xB8", cedil: "\xB8", CenterDot: "\xB7",
  centerdot: "\xB7", middot: "\xB7", Chi: "\u03A7", CircleDot: "\u2299", odot: "\u2299", CircleMinus: "\u2296", ominus: "\u2296", CirclePlus: "\
\u2295", oplus: "\u2295", CircleTimes: "\u2297", otimes: "\u2297", ClockwiseContourIntegral: "\u2232", cwconint: "\u2232", CloseCurlyDoubleQuote: "\
\u201D", rdquo: "\u201D", rdquor: "\u201D", CloseCurlyQuote: "\u2019", rsquo: "\u2019", rsquor: "\u2019", Colon: "\u2237", Proportion: "\u2237",
  Colone: "\u2A74", Congruent: "\u2261", equiv: "\u2261", Conint: "\u222F", DoubleContourIntegral: "\u222F", ContourIntegral: "\u222E", conint: "\
\u222E", oint: "\u222E", Copf: "\u2102", complexes: "\u2102", Coproduct: "\u2210", coprod: "\u2210", CounterClockwiseContourIntegral: "\u2233",
  awconint: "\u2233", Cross: "\u2A2F", Cscr: "\u{1D49E}", Cup: "\u22D3", CupCap: "\u224D", asympeq: "\u224D", DDotrahd: "\u2911", DJcy: "\u0402",
  DScy: "\u0405", DZcy: "\u040F", Dagger: "\u2021", ddagger: "\u2021", Darr: "\u21A1", Dashv: "\u2AE4", DoubleLeftTee: "\u2AE4", Dcaron: "\u010E",
  Dcy: "\u0414", Del: "\u2207", nabla: "\u2207", Delta: "\u0394", Dfr: "\u{1D507}", DiacriticalAcute: "\xB4", acute: "\xB4", DiacriticalDot: "\
\u02D9", dot: "\u02D9", DiacriticalDoubleAcute: "\u02DD", dblac: "\u02DD", DiacriticalGrave: "`", grave: "`", DiacriticalTilde: "\u02DC", tilde: "\
\u02DC", Diamond: "\u22C4", diam: "\u22C4", diamond: "\u22C4", DifferentialD: "\u2146", dd: "\u2146", Dopf: "\u{1D53B}", Dot: "\xA8", DoubleDot: "\
\xA8", die: "\xA8", uml: "\xA8", DotDot: "\u20DC", DotEqual: "\u2250", doteq: "\u2250", esdot: "\u2250", DoubleDownArrow: "\u21D3", Downarrow: "\
\u21D3", dArr: "\u21D3", DoubleLeftArrow: "\u21D0", Leftarrow: "\u21D0", lArr: "\u21D0", DoubleLeftRightArrow: "\u21D4", Leftrightarrow: "\u21D4",
  hArr: "\u21D4", iff: "\u21D4", DoubleLongLeftArrow: "\u27F8", Longleftarrow: "\u27F8", xlArr: "\u27F8", DoubleLongLeftRightArrow: "\u27FA",
  Longleftrightarrow: "\u27FA", xhArr: "\u27FA", DoubleLongRightArrow: "\u27F9", Longrightarrow: "\u27F9", xrArr: "\u27F9", DoubleRightArrow: "\
\u21D2", Implies: "\u21D2", Rightarrow: "\u21D2", rArr: "\u21D2", DoubleRightTee: "\u22A8", vDash: "\u22A8", DoubleUpArrow: "\u21D1", Uparrow: "\
\u21D1", uArr: "\u21D1", DoubleUpDownArrow: "\u21D5", Updownarrow: "\u21D5", vArr: "\u21D5", DoubleVerticalBar: "\u2225", par: "\u2225", parallel: "\
\u2225", shortparallel: "\u2225", spar: "\u2225", DownArrow: "\u2193", ShortDownArrow: "\u2193", darr: "\u2193", downarrow: "\u2193", DownArrowBar: "\
\u2913", DownArrowUpArrow: "\u21F5", duarr: "\u21F5", DownBreve: "\u0311", DownLeftRightVector: "\u2950", DownLeftTeeVector: "\u295E", DownLeftVector: "\
\u21BD", leftharpoondown: "\u21BD", lhard: "\u21BD", DownLeftVectorBar: "\u2956", DownRightTeeVector: "\u295F", DownRightVector: "\u21C1", rhard: "\
\u21C1", rightharpoondown: "\u21C1", DownRightVectorBar: "\u2957", DownTee: "\u22A4", top: "\u22A4", DownTeeArrow: "\u21A7", mapstodown: "\u21A7",
  Dscr: "\u{1D49F}", Dstrok: "\u0110", ENG: "\u014A", ETH: "\xD0", Eacute: "\xC9", Ecaron: "\u011A", Ecirc: "\xCA", Ecy: "\u042D", Edot: "\u0116",
  Efr: "\u{1D508}", Egrave: "\xC8", Element: "\u2208", in: "\u2208", isin: "\u2208", isinv: "\u2208", Emacr: "\u0112", EmptySmallSquare: "\u25FB",
  EmptyVerySmallSquare: "\u25AB", Eogon: "\u0118", Eopf: "\u{1D53C}", Epsilon: "\u0395", Equal: "\u2A75", EqualTilde: "\u2242", eqsim: "\u2242",
  esim: "\u2242", Equilibrium: "\u21CC", rightleftharpoons: "\u21CC", rlhar: "\u21CC", Escr: "\u2130", expectation: "\u2130", Esim: "\u2A73",
  Eta: "\u0397", Euml: "\xCB", Exists: "\u2203", exist: "\u2203", ExponentialE: "\u2147", ee: "\u2147", exponentiale: "\u2147", Fcy: "\u0424",
  Ffr: "\u{1D509}", FilledSmallSquare: "\u25FC", FilledVerySmallSquare: "\u25AA", blacksquare: "\u25AA", squarf: "\u25AA", squf: "\u25AA", Fopf: "\
\u{1D53D}", ForAll: "\u2200", forall: "\u2200", Fouriertrf: "\u2131", Fscr: "\u2131", GJcy: "\u0403", GT: ">", gt: ">", Gamma: "\u0393", Gammad: "\
\u03DC", Gbreve: "\u011E", Gcedil: "\u0122", Gcirc: "\u011C", Gcy: "\u0413", Gdot: "\u0120", Gfr: "\u{1D50A}", Gg: "\u22D9", ggg: "\u22D9", Gopf: "\
\u{1D53E}", GreaterEqual: "\u2265", ge: "\u2265", geq: "\u2265", GreaterEqualLess: "\u22DB", gel: "\u22DB", gtreqless: "\u22DB", GreaterFullEqual: "\
\u2267", gE: "\u2267", geqq: "\u2267", GreaterGreater: "\u2AA2", GreaterLess: "\u2277", gl: "\u2277", gtrless: "\u2277", GreaterSlantEqual: "\
\u2A7E", geqslant: "\u2A7E", ges: "\u2A7E", GreaterTilde: "\u2273", gsim: "\u2273", gtrsim: "\u2273", Gscr: "\u{1D4A2}", Gt: "\u226B", NestedGreaterGreater: "\
\u226B", gg: "\u226B", HARDcy: "\u042A", Hacek: "\u02C7", caron: "\u02C7", Hat: "^", Hcirc: "\u0124", Hfr: "\u210C", Poincareplane: "\u210C",
  HilbertSpace: "\u210B", Hscr: "\u210B", hamilt: "\u210B", Hopf: "\u210D", quaternions: "\u210D", HorizontalLine: "\u2500", boxh: "\u2500",
  Hstrok: "\u0126", HumpEqual: "\u224F", bumpe: "\u224F", bumpeq: "\u224F", IEcy: "\u0415", IJlig: "\u0132", IOcy: "\u0401", Iacute: "\xCD",
  Icirc: "\xCE", Icy: "\u0418", Idot: "\u0130", Ifr: "\u2111", Im: "\u2111", image: "\u2111", imagpart: "\u2111", Igrave: "\xCC", Imacr: "\u012A",
  ImaginaryI: "\u2148", ii: "\u2148", Int: "\u222C", Integral: "\u222B", int: "\u222B", Intersection: "\u22C2", bigcap: "\u22C2", xcap: "\u22C2",
  InvisibleComma: "\u2063", ic: "\u2063", InvisibleTimes: "\u2062", it: "\u2062", Iogon: "\u012E", Iopf: "\u{1D540}", Iota: "\u0399", Iscr: "\
\u2110", imagline: "\u2110", Itilde: "\u0128", Iukcy: "\u0406", Iuml: "\xCF", Jcirc: "\u0134", Jcy: "\u0419", Jfr: "\u{1D50D}", Jopf: "\u{1D541}",
  Jscr: "\u{1D4A5}", Jsercy: "\u0408", Jukcy: "\u0404", KHcy: "\u0425", KJcy: "\u040C", Kappa: "\u039A", Kcedil: "\u0136", Kcy: "\u041A", Kfr: "\
\u{1D50E}", Kopf: "\u{1D542}", Kscr: "\u{1D4A6}", LJcy: "\u0409", LT: "<", lt: "<", Lacute: "\u0139", Lambda: "\u039B", Lang: "\u27EA", Laplacetrf: "\
\u2112", Lscr: "\u2112", lagran: "\u2112", Larr: "\u219E", twoheadleftarrow: "\u219E", Lcaron: "\u013D", Lcedil: "\u013B", Lcy: "\u041B", LeftAngleBracket: "\
\u27E8", lang: "\u27E8", langle: "\u27E8", LeftArrow: "\u2190", ShortLeftArrow: "\u2190", larr: "\u2190", leftarrow: "\u2190", slarr: "\u2190",
  LeftArrowBar: "\u21E4", larrb: "\u21E4", LeftArrowRightArrow: "\u21C6", leftrightarrows: "\u21C6", lrarr: "\u21C6", LeftCeiling: "\u2308",
  lceil: "\u2308", LeftDoubleBracket: "\u27E6", lobrk: "\u27E6", LeftDownTeeVector: "\u2961", LeftDownVector: "\u21C3", dharl: "\u21C3", downharpoonleft: "\
\u21C3", LeftDownVectorBar: "\u2959", LeftFloor: "\u230A", lfloor: "\u230A", LeftRightArrow: "\u2194", harr: "\u2194", leftrightarrow: "\u2194",
  LeftRightVector: "\u294E", LeftTee: "\u22A3", dashv: "\u22A3", LeftTeeArrow: "\u21A4", mapstoleft: "\u21A4", LeftTeeVector: "\u295A", LeftTriangle: "\
\u22B2", vartriangleleft: "\u22B2", vltri: "\u22B2", LeftTriangleBar: "\u29CF", LeftTriangleEqual: "\u22B4", ltrie: "\u22B4", trianglelefteq: "\
\u22B4", LeftUpDownVector: "\u2951", LeftUpTeeVector: "\u2960", LeftUpVector: "\u21BF", uharl: "\u21BF", upharpoonleft: "\u21BF", LeftUpVectorBar: "\
\u2958", LeftVector: "\u21BC", leftharpoonup: "\u21BC", lharu: "\u21BC", LeftVectorBar: "\u2952", LessEqualGreater: "\u22DA", leg: "\u22DA",
  lesseqgtr: "\u22DA", LessFullEqual: "\u2266", lE: "\u2266", leqq: "\u2266", LessGreater: "\u2276", lessgtr: "\u2276", lg: "\u2276", LessLess: "\
\u2AA1", LessSlantEqual: "\u2A7D", leqslant: "\u2A7D", les: "\u2A7D", LessTilde: "\u2272", lesssim: "\u2272", lsim: "\u2272", Lfr: "\u{1D50F}",
  Ll: "\u22D8", Lleftarrow: "\u21DA", lAarr: "\u21DA", Lmidot: "\u013F", LongLeftArrow: "\u27F5", longleftarrow: "\u27F5", xlarr: "\u27F5", LongLeftRightArrow: "\
\u27F7", longleftrightarrow: "\u27F7", xharr: "\u27F7", LongRightArrow: "\u27F6", longrightarrow: "\u27F6", xrarr: "\u27F6", Lopf: "\u{1D543}",
  LowerLeftArrow: "\u2199", swarr: "\u2199", swarrow: "\u2199", LowerRightArrow: "\u2198", searr: "\u2198", searrow: "\u2198", Lsh: "\u21B0",
  lsh: "\u21B0", Lstrok: "\u0141", Lt: "\u226A", NestedLessLess: "\u226A", ll: "\u226A", Map: "\u2905", Mcy: "\u041C", MediumSpace: "\u205F",
  Mellintrf: "\u2133", Mscr: "\u2133", phmmat: "\u2133", Mfr: "\u{1D510}", MinusPlus: "\u2213", mnplus: "\u2213", mp: "\u2213", Mopf: "\u{1D544}",
  Mu: "\u039C", NJcy: "\u040A", Nacute: "\u0143", Ncaron: "\u0147", Ncedil: "\u0145", Ncy: "\u041D", NegativeMediumSpace: "\u200B", NegativeThickSpace: "\
\u200B", NegativeThinSpace: "\u200B", NegativeVeryThinSpace: "\u200B", ZeroWidthSpace: "\u200B", NewLine: `
`, Nfr: "\u{1D511}", NoBreak: "\u2060", NonBreakingSpace: "\xA0", nbsp: "\xA0", Nopf: "\u2115", naturals: "\u2115", Not: "\u2AEC", NotCongruent: "\
\u2262", nequiv: "\u2262", NotCupCap: "\u226D", NotDoubleVerticalBar: "\u2226", npar: "\u2226", nparallel: "\u2226", nshortparallel: "\u2226",
  nspar: "\u2226", NotElement: "\u2209", notin: "\u2209", notinva: "\u2209", NotEqual: "\u2260", ne: "\u2260", NotEqualTilde: "\u2242\u0338",
  nesim: "\u2242\u0338", NotExists: "\u2204", nexist: "\u2204", nexists: "\u2204", NotGreater: "\u226F", ngt: "\u226F", ngtr: "\u226F", NotGreaterEqual: "\
\u2271", nge: "\u2271", ngeq: "\u2271", NotGreaterFullEqual: "\u2267\u0338", ngE: "\u2267\u0338", ngeqq: "\u2267\u0338", NotGreaterGreater: "\
\u226B\u0338", nGtv: "\u226B\u0338", NotGreaterLess: "\u2279", ntgl: "\u2279", NotGreaterSlantEqual: "\u2A7E\u0338", ngeqslant: "\u2A7E\u0338",
  nges: "\u2A7E\u0338", NotGreaterTilde: "\u2275", ngsim: "\u2275", NotHumpDownHump: "\u224E\u0338", nbump: "\u224E\u0338", NotHumpEqual: "\u224F\
\u0338", nbumpe: "\u224F\u0338", NotLeftTriangle: "\u22EA", nltri: "\u22EA", ntriangleleft: "\u22EA", NotLeftTriangleBar: "\u29CF\u0338", NotLeftTriangleEqual: "\
\u22EC", nltrie: "\u22EC", ntrianglelefteq: "\u22EC", NotLess: "\u226E", nless: "\u226E", nlt: "\u226E", NotLessEqual: "\u2270", nle: "\u2270",
  nleq: "\u2270", NotLessGreater: "\u2278", ntlg: "\u2278", NotLessLess: "\u226A\u0338", nLtv: "\u226A\u0338", NotLessSlantEqual: "\u2A7D\u0338",
  nleqslant: "\u2A7D\u0338", nles: "\u2A7D\u0338", NotLessTilde: "\u2274", nlsim: "\u2274", NotNestedGreaterGreater: "\u2AA2\u0338", NotNestedLessLess: "\
\u2AA1\u0338", NotPrecedes: "\u2280", npr: "\u2280", nprec: "\u2280", NotPrecedesEqual: "\u2AAF\u0338", npre: "\u2AAF\u0338", npreceq: "\u2AAF\u0338",
  NotPrecedesSlantEqual: "\u22E0", nprcue: "\u22E0", NotReverseElement: "\u220C", notni: "\u220C", notniva: "\u220C", NotRightTriangle: "\u22EB",
  nrtri: "\u22EB", ntriangleright: "\u22EB", NotRightTriangleBar: "\u29D0\u0338", NotRightTriangleEqual: "\u22ED", nrtrie: "\u22ED", ntrianglerighteq: "\
\u22ED", NotSquareSubset: "\u228F\u0338", NotSquareSubsetEqual: "\u22E2", nsqsube: "\u22E2", NotSquareSuperset: "\u2290\u0338", NotSquareSupersetEqual: "\
\u22E3", nsqsupe: "\u22E3", NotSubset: "\u2282\u20D2", nsubset: "\u2282\u20D2", vnsub: "\u2282\u20D2", NotSubsetEqual: "\u2288", nsube: "\u2288",
  nsubseteq: "\u2288", NotSucceeds: "\u2281", nsc: "\u2281", nsucc: "\u2281", NotSucceedsEqual: "\u2AB0\u0338", nsce: "\u2AB0\u0338", nsucceq: "\
\u2AB0\u0338", NotSucceedsSlantEqual: "\u22E1", nsccue: "\u22E1", NotSucceedsTilde: "\u227F\u0338", NotSuperset: "\u2283\u20D2", nsupset: "\u2283\
\u20D2", vnsup: "\u2283\u20D2", NotSupersetEqual: "\u2289", nsupe: "\u2289", nsupseteq: "\u2289", NotTilde: "\u2241", nsim: "\u2241", NotTildeEqual: "\
\u2244", nsime: "\u2244", nsimeq: "\u2244", NotTildeFullEqual: "\u2247", ncong: "\u2247", NotTildeTilde: "\u2249", nap: "\u2249", napprox: "\
\u2249", NotVerticalBar: "\u2224", nmid: "\u2224", nshortmid: "\u2224", nsmid: "\u2224", Nscr: "\u{1D4A9}", Ntilde: "\xD1", Nu: "\u039D", OElig: "\
\u0152", Oacute: "\xD3", Ocirc: "\xD4", Ocy: "\u041E", Odblac: "\u0150", Ofr: "\u{1D512}", Ograve: "\xD2", Omacr: "\u014C", Omega: "\u03A9",
  ohm: "\u03A9", Omicron: "\u039F", Oopf: "\u{1D546}", OpenCurlyDoubleQuote: "\u201C", ldquo: "\u201C", OpenCurlyQuote: "\u2018", lsquo: "\u2018",
  Or: "\u2A54", Oscr: "\u{1D4AA}", Oslash: "\xD8", Otilde: "\xD5", Otimes: "\u2A37", Ouml: "\xD6", OverBar: "\u203E", oline: "\u203E", OverBrace: "\
\u23DE", OverBracket: "\u23B4", tbrk: "\u23B4", OverParenthesis: "\u23DC", PartialD: "\u2202", part: "\u2202", Pcy: "\u041F", Pfr: "\u{1D513}",
  Phi: "\u03A6", Pi: "\u03A0", PlusMinus: "\xB1", plusmn: "\xB1", pm: "\xB1", Popf: "\u2119", primes: "\u2119", Pr: "\u2ABB", Precedes: "\u227A",
  pr: "\u227A", prec: "\u227A", PrecedesEqual: "\u2AAF", pre: "\u2AAF", preceq: "\u2AAF", PrecedesSlantEqual: "\u227C", prcue: "\u227C", preccurlyeq: "\
\u227C", PrecedesTilde: "\u227E", precsim: "\u227E", prsim: "\u227E", Prime: "\u2033", Product: "\u220F", prod: "\u220F", Proportional: "\u221D",
  prop: "\u221D", propto: "\u221D", varpropto: "\u221D", vprop: "\u221D", Pscr: "\u{1D4AB}", Psi: "\u03A8", QUOT: '"', quot: '"', Qfr: "\u{1D514}",
  Qopf: "\u211A", rationals: "\u211A", Qscr: "\u{1D4AC}", RBarr: "\u2910", drbkarow: "\u2910", REG: "\xAE", circledR: "\xAE", reg: "\xAE", Racute: "\
\u0154", Rang: "\u27EB", Rarr: "\u21A0", twoheadrightarrow: "\u21A0", Rarrtl: "\u2916", Rcaron: "\u0158", Rcedil: "\u0156", Rcy: "\u0420", Re: "\
\u211C", Rfr: "\u211C", real: "\u211C", realpart: "\u211C", ReverseElement: "\u220B", SuchThat: "\u220B", ni: "\u220B", niv: "\u220B", ReverseEquilibrium: "\
\u21CB", leftrightharpoons: "\u21CB", lrhar: "\u21CB", ReverseUpEquilibrium: "\u296F", duhar: "\u296F", Rho: "\u03A1", RightAngleBracket: "\u27E9",
  rang: "\u27E9", rangle: "\u27E9", RightArrow: "\u2192", ShortRightArrow: "\u2192", rarr: "\u2192", rightarrow: "\u2192", srarr: "\u2192", RightArrowBar: "\
\u21E5", rarrb: "\u21E5", RightArrowLeftArrow: "\u21C4", rightleftarrows: "\u21C4", rlarr: "\u21C4", RightCeiling: "\u2309", rceil: "\u2309",
  RightDoubleBracket: "\u27E7", robrk: "\u27E7", RightDownTeeVector: "\u295D", RightDownVector: "\u21C2", dharr: "\u21C2", downharpoonright: "\
\u21C2", RightDownVectorBar: "\u2955", RightFloor: "\u230B", rfloor: "\u230B", RightTee: "\u22A2", vdash: "\u22A2", RightTeeArrow: "\u21A6",
  map: "\u21A6", mapsto: "\u21A6", RightTeeVector: "\u295B", RightTriangle: "\u22B3", vartriangleright: "\u22B3", vrtri: "\u22B3", RightTriangleBar: "\
\u29D0", RightTriangleEqual: "\u22B5", rtrie: "\u22B5", trianglerighteq: "\u22B5", RightUpDownVector: "\u294F", RightUpTeeVector: "\u295C", RightUpVector: "\
\u21BE", uharr: "\u21BE", upharpoonright: "\u21BE", RightUpVectorBar: "\u2954", RightVector: "\u21C0", rharu: "\u21C0", rightharpoonup: "\u21C0",
  RightVectorBar: "\u2953", Ropf: "\u211D", reals: "\u211D", RoundImplies: "\u2970", Rrightarrow: "\u21DB", rAarr: "\u21DB", Rscr: "\u211B",
  realine: "\u211B", Rsh: "\u21B1", rsh: "\u21B1", RuleDelayed: "\u29F4", SHCHcy: "\u0429", SHcy: "\u0428", SOFTcy: "\u042C", Sacute: "\u015A",
  Sc: "\u2ABC", Scaron: "\u0160", Scedil: "\u015E", Scirc: "\u015C", Scy: "\u0421", Sfr: "\u{1D516}", ShortUpArrow: "\u2191", UpArrow: "\u2191",
  uarr: "\u2191", uparrow: "\u2191", Sigma: "\u03A3", SmallCircle: "\u2218", compfn: "\u2218", Sopf: "\u{1D54A}", Sqrt: "\u221A", radic: "\u221A",
  Square: "\u25A1", squ: "\u25A1", square: "\u25A1", SquareIntersection: "\u2293", sqcap: "\u2293", SquareSubset: "\u228F", sqsub: "\u228F",
  sqsubset: "\u228F", SquareSubsetEqual: "\u2291", sqsube: "\u2291", sqsubseteq: "\u2291", SquareSuperset: "\u2290", sqsup: "\u2290", sqsupset: "\
\u2290", SquareSupersetEqual: "\u2292", sqsupe: "\u2292", sqsupseteq: "\u2292", SquareUnion: "\u2294", sqcup: "\u2294", Sscr: "\u{1D4AE}", Star: "\
\u22C6", sstarf: "\u22C6", Sub: "\u22D0", Subset: "\u22D0", SubsetEqual: "\u2286", sube: "\u2286", subseteq: "\u2286", Succeeds: "\u227B", sc: "\
\u227B", succ: "\u227B", SucceedsEqual: "\u2AB0", sce: "\u2AB0", succeq: "\u2AB0", SucceedsSlantEqual: "\u227D", sccue: "\u227D", succcurlyeq: "\
\u227D", SucceedsTilde: "\u227F", scsim: "\u227F", succsim: "\u227F", Sum: "\u2211", sum: "\u2211", Sup: "\u22D1", Supset: "\u22D1", Superset: "\
\u2283", sup: "\u2283", supset: "\u2283", SupersetEqual: "\u2287", supe: "\u2287", supseteq: "\u2287", THORN: "\xDE", TRADE: "\u2122", trade: "\
\u2122", TSHcy: "\u040B", TScy: "\u0426", Tab: "	", Tau: "\u03A4", Tcaron: "\u0164", Tcedil: "\u0162", Tcy: "\u0422", Tfr: "\u{1D517}", Therefore: "\
\u2234", there4: "\u2234", therefore: "\u2234", Theta: "\u0398", ThickSpace: "\u205F\u200A", ThinSpace: "\u2009", thinsp: "\u2009", Tilde: "\
\u223C", sim: "\u223C", thicksim: "\u223C", thksim: "\u223C", TildeEqual: "\u2243", sime: "\u2243", simeq: "\u2243", TildeFullEqual: "\u2245",
  cong: "\u2245", TildeTilde: "\u2248", ap: "\u2248", approx: "\u2248", asymp: "\u2248", thickapprox: "\u2248", thkap: "\u2248", Topf: "\u{1D54B}",
  TripleDot: "\u20DB", tdot: "\u20DB", Tscr: "\u{1D4AF}", Tstrok: "\u0166", Uacute: "\xDA", Uarr: "\u219F", Uarrocir: "\u2949", Ubrcy: "\u040E",
  Ubreve: "\u016C", Ucirc: "\xDB", Ucy: "\u0423", Udblac: "\u0170", Ufr: "\u{1D518}", Ugrave: "\xD9", Umacr: "\u016A", UnderBar: "_", lowbar: "\
_", UnderBrace: "\u23DF", UnderBracket: "\u23B5", bbrk: "\u23B5", UnderParenthesis: "\u23DD", Union: "\u22C3", bigcup: "\u22C3", xcup: "\u22C3",
  UnionPlus: "\u228E", uplus: "\u228E", Uogon: "\u0172", Uopf: "\u{1D54C}", UpArrowBar: "\u2912", UpArrowDownArrow: "\u21C5", udarr: "\u21C5",
  UpDownArrow: "\u2195", updownarrow: "\u2195", varr: "\u2195", UpEquilibrium: "\u296E", udhar: "\u296E", UpTee: "\u22A5", bot: "\u22A5", bottom: "\
\u22A5", perp: "\u22A5", UpTeeArrow: "\u21A5", mapstoup: "\u21A5", UpperLeftArrow: "\u2196", nwarr: "\u2196", nwarrow: "\u2196", UpperRightArrow: "\
\u2197", nearr: "\u2197", nearrow: "\u2197", Upsi: "\u03D2", upsih: "\u03D2", Upsilon: "\u03A5", Uring: "\u016E", Uscr: "\u{1D4B0}", Utilde: "\
\u0168", Uuml: "\xDC", VDash: "\u22AB", Vbar: "\u2AEB", Vcy: "\u0412", Vdash: "\u22A9", Vdashl: "\u2AE6", Vee: "\u22C1", bigvee: "\u22C1", xvee: "\
\u22C1", Verbar: "\u2016", Vert: "\u2016", VerticalBar: "\u2223", mid: "\u2223", shortmid: "\u2223", smid: "\u2223", VerticalLine: "|", verbar: "\
|", vert: "|", VerticalSeparator: "\u2758", VerticalTilde: "\u2240", wr: "\u2240", wreath: "\u2240", VeryThinSpace: "\u200A", hairsp: "\u200A",
  Vfr: "\u{1D519}", Vopf: "\u{1D54D}", Vscr: "\u{1D4B1}", Vvdash: "\u22AA", Wcirc: "\u0174", Wedge: "\u22C0", bigwedge: "\u22C0", xwedge: "\u22C0",
  Wfr: "\u{1D51A}", Wopf: "\u{1D54E}", Wscr: "\u{1D4B2}", Xfr: "\u{1D51B}", Xi: "\u039E", Xopf: "\u{1D54F}", Xscr: "\u{1D4B3}", YAcy: "\u042F",
  YIcy: "\u0407", YUcy: "\u042E", Yacute: "\xDD", Ycirc: "\u0176", Ycy: "\u042B", Yfr: "\u{1D51C}", Yopf: "\u{1D550}", Yscr: "\u{1D4B4}", Yuml: "\
\u0178", ZHcy: "\u0416", Zacute: "\u0179", Zcaron: "\u017D", Zcy: "\u0417", Zdot: "\u017B", Zeta: "\u0396", Zfr: "\u2128", zeetrf: "\u2128",
  Zopf: "\u2124", integers: "\u2124", Zscr: "\u{1D4B5}", aacute: "\xE1", abreve: "\u0103", ac: "\u223E", mstpos: "\u223E", acE: "\u223E\u0333",
  acd: "\u223F", acirc: "\xE2", acy: "\u0430", aelig: "\xE6", afr: "\u{1D51E}", agrave: "\xE0", alefsym: "\u2135", aleph: "\u2135", alpha: "\
\u03B1", amacr: "\u0101", amalg: "\u2A3F", and: "\u2227", wedge: "\u2227", andand: "\u2A55", andd: "\u2A5C", andslope: "\u2A58", andv: "\u2A5A",
  ang: "\u2220", angle: "\u2220", ange: "\u29A4", angmsd: "\u2221", measuredangle: "\u2221", angmsdaa: "\u29A8", angmsdab: "\u29A9", angmsdac: "\
\u29AA", angmsdad: "\u29AB", angmsdae: "\u29AC", angmsdaf: "\u29AD", angmsdag: "\u29AE", angmsdah: "\u29AF", angrt: "\u221F", angrtvb: "\u22BE",
  angrtvbd: "\u299D", angsph: "\u2222", angzarr: "\u237C", aogon: "\u0105", aopf: "\u{1D552}", apE: "\u2A70", apacir: "\u2A6F", ape: "\u224A",
  approxeq: "\u224A", apid: "\u224B", apos: "'", aring: "\xE5", ascr: "\u{1D4B6}", ast: "*", midast: "*", atilde: "\xE3", auml: "\xE4", awint: "\
\u2A11", bNot: "\u2AED", backcong: "\u224C", bcong: "\u224C", backepsilon: "\u03F6", bepsi: "\u03F6", backprime: "\u2035", bprime: "\u2035",
  backsim: "\u223D", bsim: "\u223D", backsimeq: "\u22CD", bsime: "\u22CD", barvee: "\u22BD", barwed: "\u2305", barwedge: "\u2305", bbrktbrk: "\
\u23B6", bcy: "\u0431", bdquo: "\u201E", ldquor: "\u201E", bemptyv: "\u29B0", beta: "\u03B2", beth: "\u2136", between: "\u226C", twixt: "\u226C",
  bfr: "\u{1D51F}", bigcirc: "\u25EF", xcirc: "\u25EF", bigodot: "\u2A00", xodot: "\u2A00", bigoplus: "\u2A01", xoplus: "\u2A01", bigotimes: "\
\u2A02", xotime: "\u2A02", bigsqcup: "\u2A06", xsqcup: "\u2A06", bigstar: "\u2605", starf: "\u2605", bigtriangledown: "\u25BD", xdtri: "\u25BD",
  bigtriangleup: "\u25B3", xutri: "\u25B3", biguplus: "\u2A04", xuplus: "\u2A04", bkarow: "\u290D", rbarr: "\u290D", blacklozenge: "\u29EB",
  lozf: "\u29EB", blacktriangle: "\u25B4", utrif: "\u25B4", blacktriangledown: "\u25BE", dtrif: "\u25BE", blacktriangleleft: "\u25C2", ltrif: "\
\u25C2", blacktriangleright: "\u25B8", rtrif: "\u25B8", blank: "\u2423", blk12: "\u2592", blk14: "\u2591", blk34: "\u2593", block: "\u2588",
  bne: "=\u20E5", bnequiv: "\u2261\u20E5", bnot: "\u2310", bopf: "\u{1D553}", bowtie: "\u22C8", boxDL: "\u2557", boxDR: "\u2554", boxDl: "\u2556",
  boxDr: "\u2553", boxH: "\u2550", boxHD: "\u2566", boxHU: "\u2569", boxHd: "\u2564", boxHu: "\u2567", boxUL: "\u255D", boxUR: "\u255A", boxUl: "\
\u255C", boxUr: "\u2559", boxV: "\u2551", boxVH: "\u256C", boxVL: "\u2563", boxVR: "\u2560", boxVh: "\u256B", boxVl: "\u2562", boxVr: "\u255F",
  boxbox: "\u29C9", boxdL: "\u2555", boxdR: "\u2552", boxdl: "\u2510", boxdr: "\u250C", boxhD: "\u2565", boxhU: "\u2568", boxhd: "\u252C", boxhu: "\
\u2534", boxminus: "\u229F", minusb: "\u229F", boxplus: "\u229E", plusb: "\u229E", boxtimes: "\u22A0", timesb: "\u22A0", boxuL: "\u255B", boxuR: "\
\u2558", boxul: "\u2518", boxur: "\u2514", boxv: "\u2502", boxvH: "\u256A", boxvL: "\u2561", boxvR: "\u255E", boxvh: "\u253C", boxvl: "\u2524",
  boxvr: "\u251C", brvbar: "\xA6", bscr: "\u{1D4B7}", bsemi: "\u204F", bsol: "\\", bsolb: "\u29C5", bsolhsub: "\u27C8", bull: "\u2022", bullet: "\
\u2022", bumpE: "\u2AAE", cacute: "\u0107", cap: "\u2229", capand: "\u2A44", capbrcup: "\u2A49", capcap: "\u2A4B", capcup: "\u2A47", capdot: "\
\u2A40", caps: "\u2229\uFE00", caret: "\u2041", ccaps: "\u2A4D", ccaron: "\u010D", ccedil: "\xE7", ccirc: "\u0109", ccups: "\u2A4C", ccupssm: "\
\u2A50", cdot: "\u010B", cemptyv: "\u29B2", cent: "\xA2", cfr: "\u{1D520}", chcy: "\u0447", check: "\u2713", checkmark: "\u2713", chi: "\u03C7",
  cir: "\u25CB", cirE: "\u29C3", circ: "\u02C6", circeq: "\u2257", cire: "\u2257", circlearrowleft: "\u21BA", olarr: "\u21BA", circlearrowright: "\
\u21BB", orarr: "\u21BB", circledS: "\u24C8", oS: "\u24C8", circledast: "\u229B", oast: "\u229B", circledcirc: "\u229A", ocir: "\u229A", circleddash: "\
\u229D", odash: "\u229D", cirfnint: "\u2A10", cirmid: "\u2AEF", cirscir: "\u29C2", clubs: "\u2663", clubsuit: "\u2663", colon: ":", comma: "\
,", commat: "@", comp: "\u2201", complement: "\u2201", congdot: "\u2A6D", copf: "\u{1D554}", copysr: "\u2117", crarr: "\u21B5", cross: "\u2717",
  cscr: "\u{1D4B8}", csub: "\u2ACF", csube: "\u2AD1", csup: "\u2AD0", csupe: "\u2AD2", ctdot: "\u22EF", cudarrl: "\u2938", cudarrr: "\u2935",
  cuepr: "\u22DE", curlyeqprec: "\u22DE", cuesc: "\u22DF", curlyeqsucc: "\u22DF", cularr: "\u21B6", curvearrowleft: "\u21B6", cularrp: "\u293D",
  cup: "\u222A", cupbrcap: "\u2A48", cupcap: "\u2A46", cupcup: "\u2A4A", cupdot: "\u228D", cupor: "\u2A45", cups: "\u222A\uFE00", curarr: "\u21B7",
  curvearrowright: "\u21B7", curarrm: "\u293C", curlyvee: "\u22CE", cuvee: "\u22CE", curlywedge: "\u22CF", cuwed: "\u22CF", curren: "\xA4", cwint: "\
\u2231", cylcty: "\u232D", dHar: "\u2965", dagger: "\u2020", daleth: "\u2138", dash: "\u2010", hyphen: "\u2010", dbkarow: "\u290F", rBarr: "\
\u290F", dcaron: "\u010F", dcy: "\u0434", ddarr: "\u21CA", downdownarrows: "\u21CA", ddotseq: "\u2A77", eDDot: "\u2A77", deg: "\xB0", delta: "\
\u03B4", demptyv: "\u29B1", dfisht: "\u297F", dfr: "\u{1D521}", diamondsuit: "\u2666", diams: "\u2666", digamma: "\u03DD", gammad: "\u03DD",
  disin: "\u22F2", div: "\xF7", divide: "\xF7", divideontimes: "\u22C7", divonx: "\u22C7", djcy: "\u0452", dlcorn: "\u231E", llcorner: "\u231E",
  dlcrop: "\u230D", dollar: "$", dopf: "\u{1D555}", doteqdot: "\u2251", eDot: "\u2251", dotminus: "\u2238", minusd: "\u2238", dotplus: "\u2214",
  plusdo: "\u2214", dotsquare: "\u22A1", sdotb: "\u22A1", drcorn: "\u231F", lrcorner: "\u231F", drcrop: "\u230C", dscr: "\u{1D4B9}", dscy: "\
\u0455", dsol: "\u29F6", dstrok: "\u0111", dtdot: "\u22F1", dtri: "\u25BF", triangledown: "\u25BF", dwangle: "\u29A6", dzcy: "\u045F", dzigrarr: "\
\u27FF", eacute: "\xE9", easter: "\u2A6E", ecaron: "\u011B", ecir: "\u2256", eqcirc: "\u2256", ecirc: "\xEA", ecolon: "\u2255", eqcolon: "\u2255",
  ecy: "\u044D", edot: "\u0117", efDot: "\u2252", fallingdotseq: "\u2252", efr: "\u{1D522}", eg: "\u2A9A", egrave: "\xE8", egs: "\u2A96", eqslantgtr: "\
\u2A96", egsdot: "\u2A98", el: "\u2A99", elinters: "\u23E7", ell: "\u2113", els: "\u2A95", eqslantless: "\u2A95", elsdot: "\u2A97", emacr: "\
\u0113", empty: "\u2205", emptyset: "\u2205", emptyv: "\u2205", varnothing: "\u2205", emsp13: "\u2004", emsp14: "\u2005", emsp: "\u2003", eng: "\
\u014B", ensp: "\u2002", eogon: "\u0119", eopf: "\u{1D556}", epar: "\u22D5", eparsl: "\u29E3", eplus: "\u2A71", epsi: "\u03B5", epsilon: "\u03B5",
  epsiv: "\u03F5", straightepsilon: "\u03F5", varepsilon: "\u03F5", equals: "=", equest: "\u225F", questeq: "\u225F", equivDD: "\u2A78", eqvparsl: "\
\u29E5", erDot: "\u2253", risingdotseq: "\u2253", erarr: "\u2971", escr: "\u212F", eta: "\u03B7", eth: "\xF0", euml: "\xEB", euro: "\u20AC",
  excl: "!", fcy: "\u0444", female: "\u2640", ffilig: "\uFB03", fflig: "\uFB00", ffllig: "\uFB04", ffr: "\u{1D523}", filig: "\uFB01", fjlig: "\
fj", flat: "\u266D", fllig: "\uFB02", fltns: "\u25B1", fnof: "\u0192", fopf: "\u{1D557}", fork: "\u22D4", pitchfork: "\u22D4", forkv: "\u2AD9",
  fpartint: "\u2A0D", frac12: "\xBD", half: "\xBD", frac13: "\u2153", frac14: "\xBC", frac15: "\u2155", frac16: "\u2159", frac18: "\u215B", frac23: "\
\u2154", frac25: "\u2156", frac34: "\xBE", frac35: "\u2157", frac38: "\u215C", frac45: "\u2158", frac56: "\u215A", frac58: "\u215D", frac78: "\
\u215E", frasl: "\u2044", frown: "\u2322", sfrown: "\u2322", fscr: "\u{1D4BB}", gEl: "\u2A8C", gtreqqless: "\u2A8C", gacute: "\u01F5", gamma: "\
\u03B3", gap: "\u2A86", gtrapprox: "\u2A86", gbreve: "\u011F", gcirc: "\u011D", gcy: "\u0433", gdot: "\u0121", gescc: "\u2AA9", gesdot: "\u2A80",
  gesdoto: "\u2A82", gesdotol: "\u2A84", gesl: "\u22DB\uFE00", gesles: "\u2A94", gfr: "\u{1D524}", gimel: "\u2137", gjcy: "\u0453", glE: "\u2A92",
  gla: "\u2AA5", glj: "\u2AA4", gnE: "\u2269", gneqq: "\u2269", gnap: "\u2A8A", gnapprox: "\u2A8A", gne: "\u2A88", gneq: "\u2A88", gnsim: "\u22E7",
  gopf: "\u{1D558}", gscr: "\u210A", gsime: "\u2A8E", gsiml: "\u2A90", gtcc: "\u2AA7", gtcir: "\u2A7A", gtdot: "\u22D7", gtrdot: "\u22D7", gtlPar: "\
\u2995", gtquest: "\u2A7C", gtrarr: "\u2978", gvertneqq: "\u2269\uFE00", gvnE: "\u2269\uFE00", hardcy: "\u044A", harrcir: "\u2948", harrw: "\
\u21AD", leftrightsquigarrow: "\u21AD", hbar: "\u210F", hslash: "\u210F", planck: "\u210F", plankv: "\u210F", hcirc: "\u0125", hearts: "\u2665",
  heartsuit: "\u2665", hellip: "\u2026", mldr: "\u2026", hercon: "\u22B9", hfr: "\u{1D525}", hksearow: "\u2925", searhk: "\u2925", hkswarow: "\
\u2926", swarhk: "\u2926", hoarr: "\u21FF", homtht: "\u223B", hookleftarrow: "\u21A9", larrhk: "\u21A9", hookrightarrow: "\u21AA", rarrhk: "\
\u21AA", hopf: "\u{1D559}", horbar: "\u2015", hscr: "\u{1D4BD}", hstrok: "\u0127", hybull: "\u2043", iacute: "\xED", icirc: "\xEE", icy: "\u0438",
  iecy: "\u0435", iexcl: "\xA1", ifr: "\u{1D526}", igrave: "\xEC", iiiint: "\u2A0C", qint: "\u2A0C", iiint: "\u222D", tint: "\u222D", iinfin: "\
\u29DC", iiota: "\u2129", ijlig: "\u0133", imacr: "\u012B", imath: "\u0131", inodot: "\u0131", imof: "\u22B7", imped: "\u01B5", incare: "\u2105",
  infin: "\u221E", infintie: "\u29DD", intcal: "\u22BA", intercal: "\u22BA", intlarhk: "\u2A17", intprod: "\u2A3C", iprod: "\u2A3C", iocy: "\
\u0451", iogon: "\u012F", iopf: "\u{1D55A}", iota: "\u03B9", iquest: "\xBF", iscr: "\u{1D4BE}", isinE: "\u22F9", isindot: "\u22F5", isins: "\
\u22F4", isinsv: "\u22F3", itilde: "\u0129", iukcy: "\u0456", iuml: "\xEF", jcirc: "\u0135", jcy: "\u0439", jfr: "\u{1D527}", jmath: "\u0237",
  jopf: "\u{1D55B}", jscr: "\u{1D4BF}", jsercy: "\u0458", jukcy: "\u0454", kappa: "\u03BA", kappav: "\u03F0", varkappa: "\u03F0", kcedil: "\u0137",
  kcy: "\u043A", kfr: "\u{1D528}", kgreen: "\u0138", khcy: "\u0445", kjcy: "\u045C", kopf: "\u{1D55C}", kscr: "\u{1D4C0}", lAtail: "\u291B",
  lBarr: "\u290E", lEg: "\u2A8B", lesseqqgtr: "\u2A8B", lHar: "\u2962", lacute: "\u013A", laemptyv: "\u29B4", lambda: "\u03BB", langd: "\u2991",
  lap: "\u2A85", lessapprox: "\u2A85", laquo: "\xAB", larrbfs: "\u291F", larrfs: "\u291D", larrlp: "\u21AB", looparrowleft: "\u21AB", larrpl: "\
\u2939", larrsim: "\u2973", larrtl: "\u21A2", leftarrowtail: "\u21A2", lat: "\u2AAB", latail: "\u2919", late: "\u2AAD", lates: "\u2AAD\uFE00",
  lbarr: "\u290C", lbbrk: "\u2772", lbrace: "{", lcub: "{", lbrack: "[", lsqb: "[", lbrke: "\u298B", lbrksld: "\u298F", lbrkslu: "\u298D", lcaron: "\
\u013E", lcedil: "\u013C", lcy: "\u043B", ldca: "\u2936", ldrdhar: "\u2967", ldrushar: "\u294B", ldsh: "\u21B2", le: "\u2264", leq: "\u2264",
  leftleftarrows: "\u21C7", llarr: "\u21C7", leftthreetimes: "\u22CB", lthree: "\u22CB", lescc: "\u2AA8", lesdot: "\u2A7F", lesdoto: "\u2A81",
  lesdotor: "\u2A83", lesg: "\u22DA\uFE00", lesges: "\u2A93", lessdot: "\u22D6", ltdot: "\u22D6", lfisht: "\u297C", lfr: "\u{1D529}", lgE: "\
\u2A91", lharul: "\u296A", lhblk: "\u2584", ljcy: "\u0459", llhard: "\u296B", lltri: "\u25FA", lmidot: "\u0140", lmoust: "\u23B0", lmoustache: "\
\u23B0", lnE: "\u2268", lneqq: "\u2268", lnap: "\u2A89", lnapprox: "\u2A89", lne: "\u2A87", lneq: "\u2A87", lnsim: "\u22E6", loang: "\u27EC",
  loarr: "\u21FD", longmapsto: "\u27FC", xmap: "\u27FC", looparrowright: "\u21AC", rarrlp: "\u21AC", lopar: "\u2985", lopf: "\u{1D55D}", loplus: "\
\u2A2D", lotimes: "\u2A34", lowast: "\u2217", loz: "\u25CA", lozenge: "\u25CA", lpar: "(", lparlt: "\u2993", lrhard: "\u296D", lrm: "\u200E",
  lrtri: "\u22BF", lsaquo: "\u2039", lscr: "\u{1D4C1}", lsime: "\u2A8D", lsimg: "\u2A8F", lsquor: "\u201A", sbquo: "\u201A", lstrok: "\u0142",
  ltcc: "\u2AA6", ltcir: "\u2A79", ltimes: "\u22C9", ltlarr: "\u2976", ltquest: "\u2A7B", ltrPar: "\u2996", ltri: "\u25C3", triangleleft: "\u25C3",
  lurdshar: "\u294A", luruhar: "\u2966", lvertneqq: "\u2268\uFE00", lvnE: "\u2268\uFE00", mDDot: "\u223A", macr: "\xAF", strns: "\xAF", male: "\
\u2642", malt: "\u2720", maltese: "\u2720", marker: "\u25AE", mcomma: "\u2A29", mcy: "\u043C", mdash: "\u2014", mfr: "\u{1D52A}", mho: "\u2127",
  micro: "\xB5", midcir: "\u2AF0", minus: "\u2212", minusdu: "\u2A2A", mlcp: "\u2ADB", models: "\u22A7", mopf: "\u{1D55E}", mscr: "\u{1D4C2}",
  mu: "\u03BC", multimap: "\u22B8", mumap: "\u22B8", nGg: "\u22D9\u0338", nGt: "\u226B\u20D2", nLeftarrow: "\u21CD", nlArr: "\u21CD", nLeftrightarrow: "\
\u21CE", nhArr: "\u21CE", nLl: "\u22D8\u0338", nLt: "\u226A\u20D2", nRightarrow: "\u21CF", nrArr: "\u21CF", nVDash: "\u22AF", nVdash: "\u22AE",
  nacute: "\u0144", nang: "\u2220\u20D2", napE: "\u2A70\u0338", napid: "\u224B\u0338", napos: "\u0149", natur: "\u266E", natural: "\u266E", ncap: "\
\u2A43", ncaron: "\u0148", ncedil: "\u0146", ncongdot: "\u2A6D\u0338", ncup: "\u2A42", ncy: "\u043D", ndash: "\u2013", neArr: "\u21D7", nearhk: "\
\u2924", nedot: "\u2250\u0338", nesear: "\u2928", toea: "\u2928", nfr: "\u{1D52B}", nharr: "\u21AE", nleftrightarrow: "\u21AE", nhpar: "\u2AF2",
  nis: "\u22FC", nisd: "\u22FA", njcy: "\u045A", nlE: "\u2266\u0338", nleqq: "\u2266\u0338", nlarr: "\u219A", nleftarrow: "\u219A", nldr: "\u2025",
  nopf: "\u{1D55F}", not: "\xAC", notinE: "\u22F9\u0338", notindot: "\u22F5\u0338", notinvb: "\u22F7", notinvc: "\u22F6", notnivb: "\u22FE",
  notnivc: "\u22FD", nparsl: "\u2AFD\u20E5", npart: "\u2202\u0338", npolint: "\u2A14", nrarr: "\u219B", nrightarrow: "\u219B", nrarrc: "\u2933\u0338",
  nrarrw: "\u219D\u0338", nscr: "\u{1D4C3}", nsub: "\u2284", nsubE: "\u2AC5\u0338", nsubseteqq: "\u2AC5\u0338", nsup: "\u2285", nsupE: "\u2AC6\u0338",
  nsupseteqq: "\u2AC6\u0338", ntilde: "\xF1", nu: "\u03BD", num: "#", numero: "\u2116", numsp: "\u2007", nvDash: "\u22AD", nvHarr: "\u2904",
  nvap: "\u224D\u20D2", nvdash: "\u22AC", nvge: "\u2265\u20D2", nvgt: ">\u20D2", nvinfin: "\u29DE", nvlArr: "\u2902", nvle: "\u2264\u20D2", nvlt: "\
<\u20D2", nvltrie: "\u22B4\u20D2", nvrArr: "\u2903", nvrtrie: "\u22B5\u20D2", nvsim: "\u223C\u20D2", nwArr: "\u21D6", nwarhk: "\u2923", nwnear: "\
\u2927", oacute: "\xF3", ocirc: "\xF4", ocy: "\u043E", odblac: "\u0151", odiv: "\u2A38", odsold: "\u29BC", oelig: "\u0153", ofcir: "\u29BF",
  ofr: "\u{1D52C}", ogon: "\u02DB", ograve: "\xF2", ogt: "\u29C1", ohbar: "\u29B5", olcir: "\u29BE", olcross: "\u29BB", olt: "\u29C0", omacr: "\
\u014D", omega: "\u03C9", omicron: "\u03BF", omid: "\u29B6", oopf: "\u{1D560}", opar: "\u29B7", operp: "\u29B9", or: "\u2228", vee: "\u2228",
  ord: "\u2A5D", order: "\u2134", orderof: "\u2134", oscr: "\u2134", ordf: "\xAA", ordm: "\xBA", origof: "\u22B6", oror: "\u2A56", orslope: "\
\u2A57", orv: "\u2A5B", oslash: "\xF8", osol: "\u2298", otilde: "\xF5", otimesas: "\u2A36", ouml: "\xF6", ovbar: "\u233D", para: "\xB6", parsim: "\
\u2AF3", parsl: "\u2AFD", pcy: "\u043F", percnt: "%", period: ".", permil: "\u2030", pertenk: "\u2031", pfr: "\u{1D52D}", phi: "\u03C6", phiv: "\
\u03D5", straightphi: "\u03D5", varphi: "\u03D5", phone: "\u260E", pi: "\u03C0", piv: "\u03D6", varpi: "\u03D6", planckh: "\u210E", plus: "+",
  plusacir: "\u2A23", pluscir: "\u2A22", plusdu: "\u2A25", pluse: "\u2A72", plussim: "\u2A26", plustwo: "\u2A27", pointint: "\u2A15", popf: "\
\u{1D561}", pound: "\xA3", prE: "\u2AB3", prap: "\u2AB7", precapprox: "\u2AB7", precnapprox: "\u2AB9", prnap: "\u2AB9", precneqq: "\u2AB5", prnE: "\
\u2AB5", precnsim: "\u22E8", prnsim: "\u22E8", prime: "\u2032", profalar: "\u232E", profline: "\u2312", profsurf: "\u2313", prurel: "\u22B0",
  pscr: "\u{1D4C5}", psi: "\u03C8", puncsp: "\u2008", qfr: "\u{1D52E}", qopf: "\u{1D562}", qprime: "\u2057", qscr: "\u{1D4C6}", quatint: "\u2A16",
  quest: "?", rAtail: "\u291C", rHar: "\u2964", race: "\u223D\u0331", racute: "\u0155", raemptyv: "\u29B3", rangd: "\u2992", range: "\u29A5",
  raquo: "\xBB", rarrap: "\u2975", rarrbfs: "\u2920", rarrc: "\u2933", rarrfs: "\u291E", rarrpl: "\u2945", rarrsim: "\u2974", rarrtl: "\u21A3",
  rightarrowtail: "\u21A3", rarrw: "\u219D", rightsquigarrow: "\u219D", ratail: "\u291A", ratio: "\u2236", rbbrk: "\u2773", rbrace: "}", rcub: "\
}", rbrack: "]", rsqb: "]", rbrke: "\u298C", rbrksld: "\u298E", rbrkslu: "\u2990", rcaron: "\u0159", rcedil: "\u0157", rcy: "\u0440", rdca: "\
\u2937", rdldhar: "\u2969", rdsh: "\u21B3", rect: "\u25AD", rfisht: "\u297D", rfr: "\u{1D52F}", rharul: "\u296C", rho: "\u03C1", rhov: "\u03F1",
  varrho: "\u03F1", rightrightarrows: "\u21C9", rrarr: "\u21C9", rightthreetimes: "\u22CC", rthree: "\u22CC", ring: "\u02DA", rlm: "\u200F",
  rmoust: "\u23B1", rmoustache: "\u23B1", rnmid: "\u2AEE", roang: "\u27ED", roarr: "\u21FE", ropar: "\u2986", ropf: "\u{1D563}", roplus: "\u2A2E",
  rotimes: "\u2A35", rpar: ")", rpargt: "\u2994", rppolint: "\u2A12", rsaquo: "\u203A", rscr: "\u{1D4C7}", rtimes: "\u22CA", rtri: "\u25B9",
  triangleright: "\u25B9", rtriltri: "\u29CE", ruluhar: "\u2968", rx: "\u211E", sacute: "\u015B", scE: "\u2AB4", scap: "\u2AB8", succapprox: "\
\u2AB8", scaron: "\u0161", scedil: "\u015F", scirc: "\u015D", scnE: "\u2AB6", succneqq: "\u2AB6", scnap: "\u2ABA", succnapprox: "\u2ABA", scnsim: "\
\u22E9", succnsim: "\u22E9", scpolint: "\u2A13", scy: "\u0441", sdot: "\u22C5", sdote: "\u2A66", seArr: "\u21D8", sect: "\xA7", semi: ";", seswar: "\
\u2929", tosa: "\u2929", sext: "\u2736", sfr: "\u{1D530}", sharp: "\u266F", shchcy: "\u0449", shcy: "\u0448", shy: "\xAD", sigma: "\u03C3", sigmaf: "\
\u03C2", sigmav: "\u03C2", varsigma: "\u03C2", simdot: "\u2A6A", simg: "\u2A9E", simgE: "\u2AA0", siml: "\u2A9D", simlE: "\u2A9F", simne: "\u2246",
  simplus: "\u2A24", simrarr: "\u2972", smashp: "\u2A33", smeparsl: "\u29E4", smile: "\u2323", ssmile: "\u2323", smt: "\u2AAA", smte: "\u2AAC",
  smtes: "\u2AAC\uFE00", softcy: "\u044C", sol: "/", solb: "\u29C4", solbar: "\u233F", sopf: "\u{1D564}", spades: "\u2660", spadesuit: "\u2660",
  sqcaps: "\u2293\uFE00", sqcups: "\u2294\uFE00", sscr: "\u{1D4C8}", star: "\u2606", sub: "\u2282", subset: "\u2282", subE: "\u2AC5", subseteqq: "\
\u2AC5", subdot: "\u2ABD", subedot: "\u2AC3", submult: "\u2AC1", subnE: "\u2ACB", subsetneqq: "\u2ACB", subne: "\u228A", subsetneq: "\u228A",
  subplus: "\u2ABF", subrarr: "\u2979", subsim: "\u2AC7", subsub: "\u2AD5", subsup: "\u2AD3", sung: "\u266A", sup1: "\xB9", sup2: "\xB2", sup3: "\
\xB3", supE: "\u2AC6", supseteqq: "\u2AC6", supdot: "\u2ABE", supdsub: "\u2AD8", supedot: "\u2AC4", suphsol: "\u27C9", suphsub: "\u2AD7", suplarr: "\
\u297B", supmult: "\u2AC2", supnE: "\u2ACC", supsetneqq: "\u2ACC", supne: "\u228B", supsetneq: "\u228B", supplus: "\u2AC0", supsim: "\u2AC8",
  supsub: "\u2AD4", supsup: "\u2AD6", swArr: "\u21D9", swnwar: "\u292A", szlig: "\xDF", target: "\u2316", tau: "\u03C4", tcaron: "\u0165", tcedil: "\
\u0163", tcy: "\u0442", telrec: "\u2315", tfr: "\u{1D531}", theta: "\u03B8", thetasym: "\u03D1", thetav: "\u03D1", vartheta: "\u03D1", thorn: "\
\xFE", times: "\xD7", timesbar: "\u2A31", timesd: "\u2A30", topbot: "\u2336", topcir: "\u2AF1", topf: "\u{1D565}", topfork: "\u2ADA", tprime: "\
\u2034", triangle: "\u25B5", utri: "\u25B5", triangleq: "\u225C", trie: "\u225C", tridot: "\u25EC", triminus: "\u2A3A", triplus: "\u2A39", trisb: "\
\u29CD", tritime: "\u2A3B", trpezium: "\u23E2", tscr: "\u{1D4C9}", tscy: "\u0446", tshcy: "\u045B", tstrok: "\u0167", uHar: "\u2963", uacute: "\
\xFA", ubrcy: "\u045E", ubreve: "\u016D", ucirc: "\xFB", ucy: "\u0443", udblac: "\u0171", ufisht: "\u297E", ufr: "\u{1D532}", ugrave: "\xF9",
  uhblk: "\u2580", ulcorn: "\u231C", ulcorner: "\u231C", ulcrop: "\u230F", ultri: "\u25F8", umacr: "\u016B", uogon: "\u0173", uopf: "\u{1D566}",
  upsi: "\u03C5", upsilon: "\u03C5", upuparrows: "\u21C8", uuarr: "\u21C8", urcorn: "\u231D", urcorner: "\u231D", urcrop: "\u230E", uring: "\
\u016F", urtri: "\u25F9", uscr: "\u{1D4CA}", utdot: "\u22F0", utilde: "\u0169", uuml: "\xFC", uwangle: "\u29A7", vBar: "\u2AE8", vBarv: "\u2AE9",
  vangrt: "\u299C", varsubsetneq: "\u228A\uFE00", vsubne: "\u228A\uFE00", varsubsetneqq: "\u2ACB\uFE00", vsubnE: "\u2ACB\uFE00", varsupsetneq: "\
\u228B\uFE00", vsupne: "\u228B\uFE00", varsupsetneqq: "\u2ACC\uFE00", vsupnE: "\u2ACC\uFE00", vcy: "\u0432", veebar: "\u22BB", veeeq: "\u225A",
  vellip: "\u22EE", vfr: "\u{1D533}", vopf: "\u{1D567}", vscr: "\u{1D4CB}", vzigzag: "\u299A", wcirc: "\u0175", wedbar: "\u2A5F", wedgeq: "\u2259",
  weierp: "\u2118", wp: "\u2118", wfr: "\u{1D534}", wopf: "\u{1D568}", wscr: "\u{1D4CC}", xfr: "\u{1D535}", xi: "\u03BE", xnis: "\u22FB", xopf: "\
\u{1D569}", xscr: "\u{1D4CD}", yacute: "\xFD", yacy: "\u044F", ycirc: "\u0177", ycy: "\u044B", yen: "\xA5", yfr: "\u{1D536}", yicy: "\u0457",
  yopf: "\u{1D56A}", yscr: "\u{1D4CE}", yucy: "\u044E", yuml: "\xFF", zacute: "\u017A", zcaron: "\u017E", zcy: "\u0437", zdot: "\u017C", zeta: "\
\u03B6", zfr: "\u{1D537}", zhcy: "\u0436", zigrarr: "\u21DD", zopf: "\u{1D56B}", zscr: "\u{1D4CF}", zwj: "\u200D", zwnj: "\u200C" }, rS = "\uE500";
  Gi.ngsp = rS;
  nS = [/@/, /^\s*$/, /[<>]/, /^[{}]$/, /&(#|[a-z])/i, /^\/\//];
  a(oS, "Bs");
  aS = (Pr = class {
    static fromArray(t) {
      return t ? (oS("interpolation", t), new Pr(t[0], t[1])) : am;
    }
    constructor(t, r) {
      this.start = t, this.end = r;
    }
  }, a(Pr, "t"), Pr), am = new aS("{{", "}}"), Ju = (Qn = class extends tm {
    constructor(t, r, n) {
      super(n, t), this.tokenType = r;
    }
  }, a(Qn, "ft"), Qn), iS = (eo = class {
    constructor(t, r, n) {
      this.tokens = t, this.errors = r, this.nonNormalizedIcuExpressions = n;
    }
  }, a(eo, "Or"), eo);
  a(lS, "Us");
  sS = /\r\n?/g;
  a(Ln, "qe");
  a(nh, "Is");
  a(uS, "co");
  (function(e) {
    e.HEX = "hexadecimal", e.DEC = "decimal";
  })(Yi || (Yi = {}));
  Qu = (to = class {
    constructor(t) {
      this.error = t;
    }
  }, a(to, "dt"), to), cS = (ro = class {
    constructor(t, r, n) {
      this._getTagContentType = r, this._currentTokenStart = null, this._currentTokenType = null, this._expansionCaseStack = [], this._inInterpolation =
      !1, this._fullNameStack = [], this.tokens = [], this.errors = [], this.nonNormalizedIcuExpressions = [], this._tokenizeIcu = n.tokenizeExpansionForms ||
      !1, this._interpolationConfig = n.interpolationConfig || am, this._leadingTriviaCodePoints = n.leadingTriviaChars && n.leadingTriviaChars.
      map((i) => i.codePointAt(0) || 0), this._canSelfClose = n.canSelfClose || !1, this._allowHtmComponentClosingTags = n.allowHtmComponentClosingTags ||
      !1;
      let o = n.range || { endPos: t.content.length, startPos: 0, startLine: 0, startCol: 0 };
      this._cursor = n.escapedString ? new vS(t, o) : new im(t, o), this._preserveLineEndings = n.preserveLineEndings || !1, this._i18nNormalizeLineEndingsInICUs =
      n.i18nNormalizeLineEndingsInICUs || !1, this._tokenizeBlocks = n.tokenizeBlocks ?? !0, this._tokenizeLet = n.tokenizeLet ?? !0;
      try {
        this._cursor.init();
      } catch (i) {
        this.handleError(i);
      }
    }
    _processCarriageReturns(t) {
      return this._preserveLineEndings ? t : t.replace(sS, `
`);
    }
    tokenize() {
      for (; this._cursor.peek() !== 0; ) {
        let t = this._cursor.clone();
        try {
          if (this._attemptCharCode(60)) if (this._attemptCharCode(33)) this._attemptStr("[CDATA[") ? this._consumeCdata(t) : this._attemptStr(
          "--") ? this._consumeComment(t) : this._attemptStrCaseInsensitive("doctype") ? this._consumeDocType(t) : this._consumeBogusComment(
          t);
          else if (this._attemptCharCode(47)) this._consumeTagClose(t);
          else {
            let r = this._cursor.clone();
            this._attemptCharCode(63) ? (this._cursor = r, this._consumeBogusComment(t)) : this._consumeTagOpen(t);
          }
          else this._tokenizeLet && this._cursor.peek() === 64 && !this._inInterpolation && this._attemptStr("@let") ? this._consumeLetDeclaration(
          t) : this._tokenizeBlocks && this._attemptCharCode(64) ? this._consumeBlockStart(t) : this._tokenizeBlocks && !this._inInterpolation &&
          !this._isInExpansionCase() && !this._isInExpansionForm() && this._attemptCharCode(125) ? this._consumeBlockEnd(t) : this._tokenizeIcu &&
          this._tokenizeExpansionForm() || this._consumeWithInterpolation(5, 8, () => this._isTextEnd(), () => this._isTagStart());
        } catch (r) {
          this.handleError(r);
        }
      }
      this._beginToken(34), this._endToken([]);
    }
    _getBlockName() {
      let t = !1, r = this._cursor.clone();
      return this._attemptCharCodeUntilFn((n) => ji(n) ? !t : ih(n) ? (t = !0, !1) : !0), this._cursor.getChars(r).trim();
    }
    _consumeBlockStart(t) {
      this._beginToken(25, t);
      let r = this._endToken([this._getBlockName()]);
      if (this._cursor.peek() === 40) if (this._cursor.advance(), this._consumeBlockParameters(), this._attemptCharCodeUntilFn(se), this._attemptCharCode(
      41)) this._attemptCharCodeUntilFn(se);
      else {
        r.type = 29;
        return;
      }
      this._attemptCharCode(123) ? (this._beginToken(26), this._endToken([])) : r.type = 29;
    }
    _consumeBlockEnd(t) {
      this._beginToken(27, t), this._endToken([]);
    }
    _consumeBlockParameters() {
      for (this._attemptCharCodeUntilFn(lh); this._cursor.peek() !== 41 && this._cursor.peek() !== 0; ) {
        this._beginToken(28);
        let t = this._cursor.clone(), r = null, n = 0;
        for (; this._cursor.peek() !== 59 && this._cursor.peek() !== 0 || r !== null; ) {
          let o = this._cursor.peek();
          if (o === 92) this._cursor.advance();
          else if (o === r) r = null;
          else if (r === null && Ku(o)) r = o;
          else if (o === 40 && r === null) n++;
          else if (o === 41 && r === null) {
            if (n === 0) break;
            n > 0 && n--;
          }
          this._cursor.advance();
        }
        this._endToken([this._cursor.getChars(t)]), this._attemptCharCodeUntilFn(lh);
      }
    }
    _consumeLetDeclaration(t) {
      if (this._beginToken(30, t), ji(this._cursor.peek())) this._attemptCharCodeUntilFn(se);
      else {
        let n = this._endToken([this._cursor.getChars(t)]);
        n.type = 33;
        return;
      }
      let r = this._endToken([this._getLetDeclarationName()]);
      if (this._attemptCharCodeUntilFn(se), !this._attemptCharCode(61)) {
        r.type = 33;
        return;
      }
      this._attemptCharCodeUntilFn((n) => se(n) && !Ec(n)), this._consumeLetDeclarationValue(), this._cursor.peek() === 59 ? (this._beginToken(
      32), this._endToken([]), this._cursor.advance()) : (r.type = 33, r.sourceSpan = this._cursor.getSpan(t));
    }
    _getLetDeclarationName() {
      let t = this._cursor.clone(), r = !1;
      return this._attemptCharCodeUntilFn((n) => Wi(n) || n === 36 || n === 95 || r && Cc(n) ? (r = !0, !1) : !0), this._cursor.getChars(t).
      trim();
    }
    _consumeLetDeclarationValue() {
      let t = this._cursor.clone();
      for (this._beginToken(31, t); this._cursor.peek() !== 0; ) {
        let r = this._cursor.peek();
        if (r === 59) break;
        Ku(r) && (this._cursor.advance(), this._attemptCharCodeUntilFn((n) => n === 92 ? (this._cursor.advance(), !1) : n === r)), this._cursor.
        advance();
      }
      this._endToken([this._cursor.getChars(t)]);
    }
    _tokenizeExpansionForm() {
      if (this.isExpansionFormStart()) return this._consumeExpansionFormStart(), !0;
      if (hS(this._cursor.peek()) && this._isInExpansionForm()) return this._consumeExpansionCaseStart(), !0;
      if (this._cursor.peek() === 125) {
        if (this._isInExpansionCase()) return this._consumeExpansionCaseEnd(), !0;
        if (this._isInExpansionForm()) return this._consumeExpansionFormEnd(), !0;
      }
      return !1;
    }
    _beginToken(t, r = this._cursor.clone()) {
      this._currentTokenStart = r, this._currentTokenType = t;
    }
    _endToken(t, r) {
      if (this._currentTokenStart === null) throw new Ju("Programming error - attempted to end a token when there was no start to the token",
      this._currentTokenType, this._cursor.getSpan(r));
      if (this._currentTokenType === null) throw new Ju("Programming error - attempted to end a token which has no token type", null, this._cursor.
      getSpan(this._currentTokenStart));
      let n = { type: this._currentTokenType, parts: t, sourceSpan: (r ?? this._cursor).getSpan(this._currentTokenStart, this._leadingTriviaCodePoints) };
      return this.tokens.push(n), this._currentTokenStart = null, this._currentTokenType = null, n;
    }
    _createError(t, r) {
      this._isInExpansionForm() && (t += ` (Do you have an unescaped "{" in your template? Use "{{ '{' }}") to escape it.)`);
      let n = new Ju(t, this._currentTokenType, r);
      return this._currentTokenStart = null, this._currentTokenType = null, new Qu(n);
    }
    handleError(t) {
      if (t instanceof Rc && (t = this._createError(t.msg, this._cursor.getSpan(t.cursor))), t instanceof Qu) this.errors.push(t.error);
      else throw t;
    }
    _attemptCharCode(t) {
      return this._cursor.peek() === t ? (this._cursor.advance(), !0) : !1;
    }
    _attemptCharCodeCaseInsensitive(t) {
      return mS(this._cursor.peek(), t) ? (this._cursor.advance(), !0) : !1;
    }
    _requireCharCode(t) {
      let r = this._cursor.clone();
      if (!this._attemptCharCode(t)) throw this._createError(Ln(this._cursor.peek()), this._cursor.getSpan(r));
    }
    _attemptStr(t) {
      let r = t.length;
      if (this._cursor.charsLeft() < r) return !1;
      let n = this._cursor.clone();
      for (let o = 0; o < r; o++) if (!this._attemptCharCode(t.charCodeAt(o))) return this._cursor = n, !1;
      return !0;
    }
    _attemptStrCaseInsensitive(t) {
      for (let r = 0; r < t.length; r++) if (!this._attemptCharCodeCaseInsensitive(t.charCodeAt(r))) return !1;
      return !0;
    }
    _requireStr(t) {
      let r = this._cursor.clone();
      if (!this._attemptStr(t)) throw this._createError(Ln(this._cursor.peek()), this._cursor.getSpan(r));
    }
    _requireStrCaseInsensitive(t) {
      let r = this._cursor.clone();
      if (!this._attemptStrCaseInsensitive(t)) throw this._createError(Ln(this._cursor.peek()), this._cursor.getSpan(r));
    }
    _attemptCharCodeUntilFn(t) {
      for (; !t(this._cursor.peek()); ) this._cursor.advance();
    }
    _requireCharCodeUntilFn(t, r) {
      let n = this._cursor.clone();
      if (this._attemptCharCodeUntilFn(t), this._cursor.diff(n) < r) throw this._createError(Ln(this._cursor.peek()), this._cursor.getSpan(n));
    }
    _attemptUntilChar(t) {
      for (; this._cursor.peek() !== t; ) this._cursor.advance();
    }
    _readChar() {
      let t = String.fromCodePoint(this._cursor.peek());
      return this._cursor.advance(), t;
    }
    _consumeEntity(t) {
      this._beginToken(9);
      let r = this._cursor.clone();
      if (this._cursor.advance(), this._attemptCharCode(35)) {
        let n = this._attemptCharCode(120) || this._attemptCharCode(88), o = this._cursor.clone();
        if (this._attemptCharCodeUntilFn(dS), this._cursor.peek() != 59) {
          this._cursor.advance();
          let l = n ? Yi.HEX : Yi.DEC;
          throw this._createError(uS(l, this._cursor.getChars(r)), this._cursor.getSpan());
        }
        let i = this._cursor.getChars(o);
        this._cursor.advance();
        try {
          let l = parseInt(i, n ? 16 : 10);
          this._endToken([String.fromCharCode(l), this._cursor.getChars(r)]);
        } catch {
          throw this._createError(nh(this._cursor.getChars(r)), this._cursor.getSpan());
        }
      } else {
        let n = this._cursor.clone();
        if (this._attemptCharCodeUntilFn(fS), this._cursor.peek() != 59) this._beginToken(t, r), this._cursor = n, this._endToken(["&"]);
        else {
          let o = this._cursor.getChars(n);
          this._cursor.advance();
          let i = Gi[o];
          if (!i) throw this._createError(nh(o), this._cursor.getSpan(r));
          this._endToken([i, `&${o};`]);
        }
      }
    }
    _consumeRawText(t, r) {
      this._beginToken(t ? 6 : 7);
      let n = [];
      for (; ; ) {
        let o = this._cursor.clone(), i = r();
        if (this._cursor = o, i) break;
        t && this._cursor.peek() === 38 ? (this._endToken([this._processCarriageReturns(n.join(""))]), n.length = 0, this._consumeEntity(6),
        this._beginToken(6)) : n.push(this._readChar());
      }
      this._endToken([this._processCarriageReturns(n.join(""))]);
    }
    _consumeComment(t) {
      this._beginToken(10, t), this._endToken([]), this._consumeRawText(!1, () => this._attemptStr("-->")), this._beginToken(11), this._requireStr(
      "-->"), this._endToken([]);
    }
    _consumeBogusComment(t) {
      this._beginToken(10, t), this._endToken([]), this._consumeRawText(!1, () => this._cursor.peek() === 62), this._beginToken(11), this._cursor.
      advance(), this._endToken([]);
    }
    _consumeCdata(t) {
      this._beginToken(12, t), this._endToken([]), this._consumeRawText(!1, () => this._attemptStr("]]>")), this._beginToken(13), this._requireStr(
      "]]>"), this._endToken([]);
    }
    _consumeDocType(t) {
      this._beginToken(18, t), this._endToken([]), this._consumeRawText(!1, () => this._cursor.peek() === 62), this._beginToken(19), this._cursor.
      advance(), this._endToken([]);
    }
    _consumePrefixAndName() {
      let t = this._cursor.clone(), r = "";
      for (; this._cursor.peek() !== 58 && !pS(this._cursor.peek()); ) this._cursor.advance();
      let n;
      this._cursor.peek() === 58 ? (r = this._cursor.getChars(t), this._cursor.advance(), n = this._cursor.clone()) : n = t, this._requireCharCodeUntilFn(
      oh, r === "" ? 0 : 1);
      let o = this._cursor.getChars(n);
      return [r, o];
    }
    _consumeTagOpen(t) {
      let r, n, o, i = [];
      try {
        if (!Wi(this._cursor.peek())) throw this._createError(Ln(this._cursor.peek()), this._cursor.getSpan(t));
        for (o = this._consumeTagOpenStart(t), n = o.parts[0], r = o.parts[1], this._attemptCharCodeUntilFn(se); this._cursor.peek() !== 47 &&
        this._cursor.peek() !== 62 && this._cursor.peek() !== 60 && this._cursor.peek() !== 0; ) {
          let [u, c] = this._consumeAttributeName();
          if (this._attemptCharCodeUntilFn(se), this._attemptCharCode(61)) {
            this._attemptCharCodeUntilFn(se);
            let p = this._consumeAttributeValue();
            i.push({ prefix: u, name: c, value: p });
          } else i.push({ prefix: u, name: c });
          this._attemptCharCodeUntilFn(se);
        }
        this._consumeTagOpenEnd();
      } catch (u) {
        if (u instanceof Qu) {
          o ? o.type = 4 : (this._beginToken(5, t), this._endToken(["<"]));
          return;
        }
        throw u;
      }
      if (this._canSelfClose && this.tokens[this.tokens.length - 1].type === 2) return;
      let l = this._getTagContentType(r, n, this._fullNameStack.length > 0, i);
      this._handleFullNameStackForTagOpen(n, r), l === pt.RAW_TEXT ? this._consumeRawTextWithTagClose(n, r, !1) : l === pt.ESCAPABLE_RAW_TEXT &&
      this._consumeRawTextWithTagClose(n, r, !0);
    }
    _consumeRawTextWithTagClose(t, r, n) {
      this._consumeRawText(n, () => !this._attemptCharCode(60) || !this._attemptCharCode(47) || (this._attemptCharCodeUntilFn(se), !this._attemptStrCaseInsensitive(
      t ? `${t}:${r}` : r)) ? !1 : (this._attemptCharCodeUntilFn(se), this._attemptCharCode(62))), this._beginToken(3), this._requireCharCodeUntilFn(
      (o) => o === 62, 3), this._cursor.advance(), this._endToken([t, r]), this._handleFullNameStackForTagClose(t, r);
    }
    _consumeTagOpenStart(t) {
      this._beginToken(0, t);
      let r = this._consumePrefixAndName();
      return this._endToken(r);
    }
    _consumeAttributeName() {
      let t = this._cursor.peek();
      if (t === 39 || t === 34) throw this._createError(Ln(t), this._cursor.getSpan());
      this._beginToken(14);
      let r = this._consumePrefixAndName();
      return this._endToken(r), r;
    }
    _consumeAttributeValue() {
      let t;
      if (this._cursor.peek() === 39 || this._cursor.peek() === 34) {
        let r = this._cursor.peek();
        this._consumeQuote(r);
        let n = /* @__PURE__ */ a(() => this._cursor.peek() === r, "n");
        t = this._consumeWithInterpolation(16, 17, n, n), this._consumeQuote(r);
      } else {
        let r = /* @__PURE__ */ a(() => oh(this._cursor.peek()), "r");
        t = this._consumeWithInterpolation(16, 17, r, r);
      }
      return t;
    }
    _consumeQuote(t) {
      this._beginToken(15), this._requireCharCode(t), this._endToken([String.fromCodePoint(t)]);
    }
    _consumeTagOpenEnd() {
      let t = this._attemptCharCode(47) ? 2 : 1;
      this._beginToken(t), this._requireCharCode(62), this._endToken([]);
    }
    _consumeTagClose(t) {
      if (this._beginToken(3, t), this._attemptCharCodeUntilFn(se), this._allowHtmComponentClosingTags && this._attemptCharCode(47)) this._attemptCharCodeUntilFn(
      se), this._requireCharCode(62), this._endToken([]);
      else {
        let [r, n] = this._consumePrefixAndName();
        this._attemptCharCodeUntilFn(se), this._requireCharCode(62), this._endToken([r, n]), this._handleFullNameStackForTagClose(r, n);
      }
    }
    _consumeExpansionFormStart() {
      this._beginToken(20), this._requireCharCode(123), this._endToken([]), this._expansionCaseStack.push(20), this._beginToken(7);
      let t = this._readUntil(44), r = this._processCarriageReturns(t);
      if (this._i18nNormalizeLineEndingsInICUs) this._endToken([r]);
      else {
        let o = this._endToken([t]);
        r !== t && this.nonNormalizedIcuExpressions.push(o);
      }
      this._requireCharCode(44), this._attemptCharCodeUntilFn(se), this._beginToken(7);
      let n = this._readUntil(44);
      this._endToken([n]), this._requireCharCode(44), this._attemptCharCodeUntilFn(se);
    }
    _consumeExpansionCaseStart() {
      this._beginToken(21);
      let t = this._readUntil(123).trim();
      this._endToken([t]), this._attemptCharCodeUntilFn(se), this._beginToken(22), this._requireCharCode(123), this._endToken([]), this._attemptCharCodeUntilFn(
      se), this._expansionCaseStack.push(22);
    }
    _consumeExpansionCaseEnd() {
      this._beginToken(23), this._requireCharCode(125), this._endToken([]), this._attemptCharCodeUntilFn(se), this._expansionCaseStack.pop();
    }
    _consumeExpansionFormEnd() {
      this._beginToken(24), this._requireCharCode(125), this._endToken([]), this._expansionCaseStack.pop();
    }
    _consumeWithInterpolation(t, r, n, o) {
      this._beginToken(t);
      let i = [];
      for (; !n(); ) {
        let u = this._cursor.clone();
        this._interpolationConfig && this._attemptStr(this._interpolationConfig.start) ? (this._endToken([this._processCarriageReturns(i.join(
        ""))], u), i.length = 0, this._consumeInterpolation(r, u, o), this._beginToken(t)) : this._cursor.peek() === 38 ? (this._endToken([this.
        _processCarriageReturns(i.join(""))]), i.length = 0, this._consumeEntity(t), this._beginToken(t)) : i.push(this._readChar());
      }
      this._inInterpolation = !1;
      let l = this._processCarriageReturns(i.join(""));
      return this._endToken([l]), l;
    }
    _consumeInterpolation(t, r, n) {
      let o = [];
      this._beginToken(t, r), o.push(this._interpolationConfig.start);
      let i = this._cursor.clone(), l = null, u = !1;
      for (; this._cursor.peek() !== 0 && (n === null || !n()); ) {
        let c = this._cursor.clone();
        if (this._isTagStart()) {
          this._cursor = c, o.push(this._getProcessedChars(i, c)), this._endToken(o);
          return;
        }
        if (l === null) if (this._attemptStr(this._interpolationConfig.end)) {
          o.push(this._getProcessedChars(i, c)), o.push(this._interpolationConfig.end), this._endToken(o);
          return;
        } else this._attemptStr("//") && (u = !0);
        let p = this._cursor.peek();
        this._cursor.advance(), p === 92 ? this._cursor.advance() : p === l ? l = null : !u && l === null && Ku(p) && (l = p);
      }
      o.push(this._getProcessedChars(i, this._cursor)), this._endToken(o);
    }
    _getProcessedChars(t, r) {
      return this._processCarriageReturns(r.getChars(t));
    }
    _isTextEnd() {
      return !!(this._isTagStart() || this._cursor.peek() === 0 || this._tokenizeIcu && !this._inInterpolation && (this.isExpansionFormStart() ||
      this._cursor.peek() === 125 && this._isInExpansionCase()) || this._tokenizeBlocks && !this._inInterpolation && !this._isInExpansion() &&
      (this._isBlockStart() || this._cursor.peek() === 64 || this._cursor.peek() === 125));
    }
    _isTagStart() {
      if (this._cursor.peek() === 60) {
        let t = this._cursor.clone();
        t.advance();
        let r = t.peek();
        if (97 <= r && r <= 122 || 65 <= r && r <= 90 || r === 47 || r === 33) return !0;
      }
      return !1;
    }
    _isBlockStart() {
      if (this._tokenizeBlocks && this._cursor.peek() === 64) {
        let t = this._cursor.clone();
        if (t.advance(), ih(t.peek())) return !0;
      }
      return !1;
    }
    _readUntil(t) {
      let r = this._cursor.clone();
      return this._attemptUntilChar(t), this._cursor.getChars(r);
    }
    _isInExpansion() {
      return this._isInExpansionCase() || this._isInExpansionForm();
    }
    _isInExpansionCase() {
      return this._expansionCaseStack.length > 0 && this._expansionCaseStack[this._expansionCaseStack.length - 1] === 22;
    }
    _isInExpansionForm() {
      return this._expansionCaseStack.length > 0 && this._expansionCaseStack[this._expansionCaseStack.length - 1] === 20;
    }
    isExpansionFormStart() {
      if (this._cursor.peek() !== 123) return !1;
      if (this._interpolationConfig) {
        let t = this._cursor.clone(), r = this._attemptStr(this._interpolationConfig.start);
        return this._cursor = t, !r;
      }
      return !0;
    }
    _handleFullNameStackForTagOpen(t, r) {
      let n = Ui(t, r);
      (this._fullNameStack.length === 0 || this._fullNameStack[this._fullNameStack.length - 1] === n) && this._fullNameStack.push(n);
    }
    _handleFullNameStackForTagClose(t, r) {
      let n = Ui(t, r);
      this._fullNameStack.length !== 0 && this._fullNameStack[this._fullNameStack.length - 1] === n && this._fullNameStack.pop();
    }
  }, a(ro, "$r"), ro);
  a(se, "b");
  a(oh, "Rs");
  a(pS, "po");
  a(dS, "ho");
  a(fS, "mo");
  a(hS, "fo");
  a(mS, "go");
  a(ah, "Os");
  a(ih, "$s");
  a(lh, "Ms");
  a(gS, "Co");
  im = (ur = class {
    constructor(t, r) {
      if (t instanceof ur) {
        this.file = t.file, this.input = t.input, this.end = t.end;
        let n = t.state;
        this.state = { peek: n.peek, offset: n.offset, line: n.line, column: n.column };
      } else {
        if (!r) throw new Error("Programming error: the range argument must be provided with a file argument.");
        this.file = t, this.input = t.content, this.end = r.endPos, this.state = { peek: -1, offset: r.startPos, line: r.startLine, column: r.
        startCol };
      }
    }
    clone() {
      return new ur(this);
    }
    peek() {
      return this.state.peek;
    }
    charsLeft() {
      return this.end - this.state.offset;
    }
    diff(t) {
      return this.state.offset - t.state.offset;
    }
    advance() {
      this.advanceState(this.state);
    }
    init() {
      this.updatePeek(this.state);
    }
    getSpan(t, r) {
      t = t || this;
      let n = t;
      if (r) for (; this.diff(t) > 0 && r.indexOf(t.peek()) !== -1; ) n === t && (t = t.clone()), t.advance();
      let o = this.locationFromCursor(t), i = this.locationFromCursor(this), l = n !== t ? this.locationFromCursor(n) : o;
      return new z(o, i, l);
    }
    getChars(t) {
      return this.input.substring(t.state.offset, this.state.offset);
    }
    charAt(t) {
      return this.input.charCodeAt(t);
    }
    advanceState(t) {
      if (t.offset >= this.end) throw this.state = t, new Rc('Unexpected character "EOF"', this);
      let r = this.charAt(t.offset);
      r === 10 ? (t.line++, t.column = 0) : Ec(r) || t.column++, t.offset++, this.updatePeek(t);
    }
    updatePeek(t) {
      t.peek = t.offset >= this.end ? 0 : this.charAt(t.offset);
    }
    locationFromCursor(t) {
      return new oc(t.file, t.state.offset, t.state.line, t.state.column);
    }
  }, a(ur, "t"), ur), vS = (cr = class extends im {
    constructor(t, r) {
      t instanceof cr ? (super(t), this.internalState = { ...t.internalState }) : (super(t, r), this.internalState = this.state);
    }
    advance() {
      this.state = this.internalState, super.advance(), this.processEscapeSequence();
    }
    init() {
      super.init(), this.processEscapeSequence();
    }
    clone() {
      return new cr(this);
    }
    getChars(t) {
      let r = t.clone(), n = "";
      for (; r.internalState.offset < this.internalState.offset; ) n += String.fromCodePoint(r.peek()), r.advance();
      return n;
    }
    processEscapeSequence() {
      let t = /* @__PURE__ */ a(() => this.internalState.peek, "e");
      if (t() === 92) if (this.internalState = { ...this.state }, this.advanceState(this.internalState), t() === 110) this.state.peek = 10;
      else if (t() === 114) this.state.peek = 13;
      else if (t() === 118) this.state.peek = 11;
      else if (t() === 116) this.state.peek = 9;
      else if (t() === 98) this.state.peek = 8;
      else if (t() === 102) this.state.peek = 12;
      else if (t() === 117) if (this.advanceState(this.internalState), t() === 123) {
        this.advanceState(this.internalState);
        let r = this.clone(), n = 0;
        for (; t() !== 125; ) this.advanceState(this.internalState), n++;
        this.state.peek = this.decodeHexDigits(r, n);
      } else {
        let r = this.clone();
        this.advanceState(this.internalState), this.advanceState(this.internalState), this.advanceState(this.internalState), this.state.peek =
        this.decodeHexDigits(r, 4);
      }
      else if (t() === 120) {
        this.advanceState(this.internalState);
        let r = this.clone();
        this.advanceState(this.internalState), this.state.peek = this.decodeHexDigits(r, 2);
      } else if (V2(t())) {
        let r = "", n = 0, o = this.clone();
        for (; V2(t()) && n < 3; ) o = this.clone(), r += String.fromCodePoint(t()), this.advanceState(this.internalState), n++;
        this.state.peek = parseInt(r, 8), this.internalState = o.internalState;
      } else Ec(this.internalState.peek) ? (this.advanceState(this.internalState), this.state = this.internalState) : this.state.peek = this.
      internalState.peek;
    }
    decodeHexDigits(t, r) {
      let n = this.input.slice(t.internalState.offset, t.internalState.offset + r), o = parseInt(n, 16);
      if (isNaN(o)) throw t.state = t.internalState, new Rc("Invalid hexadecimal escape sequence", t);
      return o;
    }
  }, a(cr, "t"), cr), Rc = (no = class {
    constructor(t, r) {
      this.msg = t, this.cursor = r;
    }
  }, a(no, "gt"), no), Ie = (Hr = class extends tm {
    static create(t, r, n) {
      return new Hr(t, r, n);
    }
    constructor(t, r, n) {
      super(r, n), this.elementName = t;
    }
  }, a(Hr, "t"), Hr), wS = (oo = class {
    constructor(t, r) {
      this.rootNodes = t, this.errors = r;
    }
  }, a(oo, "Vr"), oo), bS = (ao = class {
    constructor(t) {
      this.getTagDefinition = t;
    }
    parse(t, r, n, o = !1, i) {
      let l = /* @__PURE__ */ a((w) => (m, ...v) => w(m.toLowerCase(), ...v), "a"), u = o ? this.getTagDefinition : l(this.getTagDefinition),
      c = /* @__PURE__ */ a((w) => u(w).getContentType(), "u"), p = o ? i : l(i), d = lS(t, r, i ? (w, m, v, y) => {
        let b = p(w, m, v, y);
        return b !== void 0 ? b : c(w);
      } : c, n), h = n && n.canSelfClose || !1, f = n && n.allowHtmComponentClosingTags || !1, g = new yS(d.tokens, u, h, f, o);
      return g.build(), new wS(g.rootNodes, d.errors.concat(g.errors));
    }
  }, a(ao, "tr"), ao), yS = (zr = class {
    constructor(t, r, n, o, i) {
      this.tokens = t, this.getTagDefinition = r, this.canSelfClose = n, this.allowHtmComponentClosingTags = o, this.isTagNameCaseSensitive =
      i, this._index = -1, this._containerStack = [], this.rootNodes = [], this.errors = [], this._advance();
    }
    build() {
      for (; this._peek.type !== 34; ) this._peek.type === 0 || this._peek.type === 4 ? this._consumeStartTag(this._advance()) : this._peek.
      type === 3 ? (this._closeVoidElement(), this._consumeEndTag(this._advance())) : this._peek.type === 12 ? (this._closeVoidElement(), this.
      _consumeCdata(this._advance())) : this._peek.type === 10 ? (this._closeVoidElement(), this._consumeComment(this._advance())) : this._peek.
      type === 5 || this._peek.type === 7 || this._peek.type === 6 ? (this._closeVoidElement(), this._consumeText(this._advance())) : this._peek.
      type === 20 ? this._consumeExpansion(this._advance()) : this._peek.type === 25 ? (this._closeVoidElement(), this._consumeBlockOpen(this.
      _advance())) : this._peek.type === 27 ? (this._closeVoidElement(), this._consumeBlockClose(this._advance())) : this._peek.type === 29 ?
      (this._closeVoidElement(), this._consumeIncompleteBlock(this._advance())) : this._peek.type === 30 ? (this._closeVoidElement(), this._consumeLet(
      this._advance())) : this._peek.type === 18 ? this._consumeDocType(this._advance()) : this._peek.type === 33 ? (this._closeVoidElement(),
      this._consumeIncompleteLet(this._advance())) : this._advance();
      for (let t of this._containerStack) t instanceof kn && this.errors.push(Ie.create(t.name, t.sourceSpan, `Unclosed block "${t.name}"`));
    }
    _advance() {
      let t = this._peek;
      return this._index < this.tokens.length - 1 && this._index++, this._peek = this.tokens[this._index], t;
    }
    _advanceIf(t) {
      return this._peek.type === t ? this._advance() : null;
    }
    _consumeCdata(t) {
      let r = this._advance(), n = this._getText(r), o = this._advanceIf(13);
      this._addToParent(new XR(n, new z(t.sourceSpan.start, (o || r).sourceSpan.end), [r]));
    }
    _consumeComment(t) {
      let r = this._advanceIf(7), n = this._advanceIf(11), o = r != null ? r.parts[0].trim() : null, i = n == null ? t.sourceSpan : new z(t.
      sourceSpan.start, n.sourceSpan.end, t.sourceSpan.fullStart);
      this._addToParent(new QR(o, i));
    }
    _consumeDocType(t) {
      let r = this._advanceIf(7), n = this._advanceIf(19), o = r != null ? r.parts[0].trim() : null, i = new z(t.sourceSpan.start, (n || r ||
      t).sourceSpan.end);
      this._addToParent(new eS(o, i));
    }
    _consumeExpansion(t) {
      let r = this._advance(), n = this._advance(), o = [];
      for (; this._peek.type === 21; ) {
        let l = this._parseExpansionCase();
        if (!l) return;
        o.push(l);
      }
      if (this._peek.type !== 24) {
        this.errors.push(Ie.create(null, this._peek.sourceSpan, "Invalid ICU message. Missing '}'."));
        return;
      }
      let i = new z(t.sourceSpan.start, this._peek.sourceSpan.end, t.sourceSpan.fullStart);
      this._addToParent(new ZR(r.parts[0], n.parts[0], o, i, r.sourceSpan)), this._advance();
    }
    _parseExpansionCase() {
      let t = this._advance();
      if (this._peek.type !== 22) return this.errors.push(Ie.create(null, this._peek.sourceSpan, "Invalid ICU message. Missing '{'.")), null;
      let r = this._advance(), n = this._collectExpansionExpTokens(r);
      if (!n) return null;
      let o = this._advance();
      n.push({ type: 34, parts: [], sourceSpan: o.sourceSpan });
      let i = new zr(n, this.getTagDefinition, this.canSelfClose, this.allowHtmComponentClosingTags, this.isTagNameCaseSensitive);
      if (i.build(), i.errors.length > 0) return this.errors = this.errors.concat(i.errors), null;
      let l = new z(t.sourceSpan.start, o.sourceSpan.end, t.sourceSpan.fullStart), u = new z(r.sourceSpan.start, o.sourceSpan.end, r.sourceSpan.
      fullStart);
      return new KR(t.parts[0], i.rootNodes, l, t.sourceSpan, u);
    }
    _collectExpansionExpTokens(t) {
      let r = [], n = [22];
      for (; ; ) {
        if ((this._peek.type === 20 || this._peek.type === 22) && n.push(this._peek.type), this._peek.type === 23) if (sh(n, 22)) {
          if (n.pop(), n.length === 0) return r;
        } else return this.errors.push(Ie.create(null, t.sourceSpan, "Invalid ICU message. Missing '}'.")), null;
        if (this._peek.type === 24) if (sh(n, 20)) n.pop();
        else return this.errors.push(Ie.create(null, t.sourceSpan, "Invalid ICU message. Missing '}'.")), null;
        if (this._peek.type === 34) return this.errors.push(Ie.create(null, t.sourceSpan, "Invalid ICU message. Missing '}'.")), null;
        r.push(this._advance());
      }
    }
    _getText(t) {
      let r = t.parts[0];
      if (r.length > 0 && r[0] == `
`) {
        let n = this._getClosestParentElement();
        n != null && n.children.length == 0 && this.getTagDefinition(n.name).ignoreFirstLf && (r = r.substring(1));
      }
      return r;
    }
    _consumeText(t) {
      let r = [t], n = t.sourceSpan, o = t.parts[0];
      if (o.length > 0 && o[0] === `
`) {
        let i = this._getContainer();
        i != null && i.children.length === 0 && this.getTagDefinition(i.name).ignoreFirstLf && (o = o.substring(1), r[0] = { type: t.type, sourceSpan: t.
        sourceSpan, parts: [o] });
      }
      for (; this._peek.type === 8 || this._peek.type === 5 || this._peek.type === 9; ) t = this._advance(), r.push(t), t.type === 8 ? o += t.
      parts.join("").replace(/&([^;]+);/g, uh) : t.type === 9 ? o += t.parts[0] : o += t.parts.join("");
      if (o.length > 0) {
        let i = t.sourceSpan;
        this._addToParent(new YR(o, new z(n.start, i.end, n.fullStart, n.details), r));
      }
    }
    _closeVoidElement() {
      let t = this._getContainer();
      t instanceof sr && this.getTagDefinition(t.name).isVoid && this._containerStack.pop();
    }
    _consumeStartTag(t) {
      let [r, n] = t.parts, o = [];
      for (; this._peek.type === 14; ) o.push(this._consumeAttr(this._advance()));
      let i = this._getElementFullName(r, n, this._getClosestParentElement()), l = !1;
      if (this._peek.type === 2) {
        this._advance(), l = !0;
        let g = this.getTagDefinition(i);
        this.canSelfClose || g.canSelfClose || Ni(i) !== null || g.isVoid || this.errors.push(Ie.create(i, t.sourceSpan, `Only void, custom \
and foreign elements can be self closed "${t.parts[1]}"`));
      } else this._peek.type === 1 && (this._advance(), l = !1);
      let u = this._peek.sourceSpan.fullStart, c = new z(t.sourceSpan.start, u, t.sourceSpan.fullStart), p = new z(t.sourceSpan.start, u, t.
      sourceSpan.fullStart), d = new z(t.sourceSpan.start.moveBy(1), t.sourceSpan.end), h = new sr(i, o, [], c, p, void 0, d), f = this._getContainer();
      this._pushContainer(h, f instanceof sr && this.getTagDefinition(f.name).isClosedByChild(h.name)), l ? this._popContainer(i, sr, c) : t.
      type === 4 && (this._popContainer(i, sr, null), this.errors.push(Ie.create(i, c, `Opening tag "${i}" not terminated.`)));
    }
    _pushContainer(t, r) {
      r && this._containerStack.pop(), this._addToParent(t), this._containerStack.push(t);
    }
    _consumeEndTag(t) {
      let r = this.allowHtmComponentClosingTags && t.parts.length === 0 ? null : this._getElementFullName(t.parts[0], t.parts[1], this._getClosestParentElement());
      if (r && this.getTagDefinition(r).isVoid) this.errors.push(Ie.create(r, t.sourceSpan, `Void elements do not have end tags "${t.parts[1]}\
"`));
      else if (!this._popContainer(r, sr, t.sourceSpan)) {
        let n = `Unexpected closing tag "${r}". It may happen when the tag has already been closed by another tag. For more info see https:/\
/www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags`;
        this.errors.push(Ie.create(r, t.sourceSpan, n));
      }
    }
    _popContainer(t, r, n) {
      let o = !1;
      for (let i = this._containerStack.length - 1; i >= 0; i--) {
        let l = this._containerStack[i];
        if (Ni(l.name) ? l.name === t : (t == null || l.name.toLowerCase() === t.toLowerCase()) && l instanceof r) return l.endSourceSpan = n,
        l.sourceSpan.end = n !== null ? n.end : l.sourceSpan.end, this._containerStack.splice(i, this._containerStack.length - i), !o;
        (l instanceof kn || l instanceof sr && !this.getTagDefinition(l.name).closedByParent) && (o = !0);
      }
      return !1;
    }
    _consumeAttr(t) {
      let r = Ui(t.parts[0], t.parts[1]), n = t.sourceSpan.end, o;
      this._peek.type === 15 && (o = this._advance());
      let i = "", l = [], u, c;
      if (this._peek.type === 16) for (u = this._peek.sourceSpan, c = this._peek.sourceSpan.end; this._peek.type === 16 || this._peek.type ===
      17 || this._peek.type === 9; ) {
        let d = this._advance();
        l.push(d), d.type === 17 ? i += d.parts.join("").replace(/&([^;]+);/g, uh) : d.type === 9 ? i += d.parts[0] : i += d.parts.join(""),
        c = n = d.sourceSpan.end;
      }
      this._peek.type === 15 && (c = n = this._advance().sourceSpan.end);
      let p = u && c && new z(o?.sourceSpan.start ?? u.start, c, o?.sourceSpan.fullStart ?? u.fullStart);
      return new JR(r, i, new z(t.sourceSpan.start, n, t.sourceSpan.fullStart), t.sourceSpan, p, l.length > 0 ? l : void 0, void 0);
    }
    _consumeBlockOpen(t) {
      let r = [];
      for (; this._peek.type === 28; ) {
        let u = this._advance();
        r.push(new th(u.parts[0], u.sourceSpan));
      }
      this._peek.type === 26 && this._advance();
      let n = this._peek.sourceSpan.fullStart, o = new z(t.sourceSpan.start, n, t.sourceSpan.fullStart), i = new z(t.sourceSpan.start, n, t.
      sourceSpan.fullStart), l = new kn(t.parts[0], r, [], o, t.sourceSpan, i);
      this._pushContainer(l, !1);
    }
    _consumeBlockClose(t) {
      this._popContainer(null, kn, t.sourceSpan) || this.errors.push(Ie.create(null, t.sourceSpan, 'Unexpected closing block. The block may \
have been closed earlier. If you meant to write the } character, you should use the "&#125;" HTML entity instead.'));
    }
    _consumeIncompleteBlock(t) {
      let r = [];
      for (; this._peek.type === 28; ) {
        let u = this._advance();
        r.push(new th(u.parts[0], u.sourceSpan));
      }
      let n = this._peek.sourceSpan.fullStart, o = new z(t.sourceSpan.start, n, t.sourceSpan.fullStart), i = new z(t.sourceSpan.start, n, t.
      sourceSpan.fullStart), l = new kn(t.parts[0], r, [], o, t.sourceSpan, i);
      this._pushContainer(l, !1), this._popContainer(null, kn, null), this.errors.push(Ie.create(t.parts[0], o, `Incomplete block "${t.parts[0]}\
". If you meant to write the @ character, you should use the "&#64;" HTML entity instead.`));
    }
    _consumeLet(t) {
      let r = t.parts[0], n, o;
      if (this._peek.type !== 31) {
        this.errors.push(Ie.create(t.parts[0], t.sourceSpan, `Invalid @let declaration "${r}". Declaration must have a value.`));
        return;
      } else n = this._advance();
      if (this._peek.type !== 32) {
        this.errors.push(Ie.create(t.parts[0], t.sourceSpan, `Unterminated @let declaration "${r}". Declaration must be terminated with a se\
micolon.`));
        return;
      } else o = this._advance();
      let i = o.sourceSpan.fullStart, l = new z(t.sourceSpan.start, i, t.sourceSpan.fullStart), u = t.sourceSpan.toString().lastIndexOf(r), c = t.
      sourceSpan.start.moveBy(u), p = new z(c, t.sourceSpan.end), d = new rh(r, n.parts[0], l, p, n.sourceSpan);
      this._addToParent(d);
    }
    _consumeIncompleteLet(t) {
      let r = t.parts[0] ?? "", n = r ? ` "${r}"` : "";
      if (r.length > 0) {
        let o = t.sourceSpan.toString().lastIndexOf(r), i = t.sourceSpan.start.moveBy(o), l = new z(i, t.sourceSpan.end), u = new z(t.sourceSpan.
        start, t.sourceSpan.start.moveBy(0)), c = new rh(r, "", t.sourceSpan, l, u);
        this._addToParent(c);
      }
      this.errors.push(Ie.create(t.parts[0], t.sourceSpan, `Incomplete @let declaration${n}. @let declarations must be written as \`@let <nam\
e> = <value>;\``));
    }
    _getContainer() {
      return this._containerStack.length > 0 ? this._containerStack[this._containerStack.length - 1] : null;
    }
    _getClosestParentElement() {
      for (let t = this._containerStack.length - 1; t > -1; t--) if (this._containerStack[t] instanceof sr) return this._containerStack[t];
      return null;
    }
    _addToParent(t) {
      let r = this._getContainer();
      r === null ? this.rootNodes.push(t) : r.children.push(t);
    }
    _getElementFullName(t, r, n) {
      if (t === "" && (t = this.getTagDefinition(r).implicitNamespacePrefix || "", t === "" && n != null)) {
        let o = nl(n.name)[1];
        this.getTagDefinition(o).preventNamespaceInheritance || (t = Ni(n.name));
      }
      return Ui(t, r);
    }
  }, a(zr, "t"), zr);
  a(sh, "Ws");
  a(uh, "zs");
  DS = (io = class extends bS {
    constructor() {
      super(ac);
    }
    parse(t, r, n, o = !1, i) {
      return super.parse(t, r, n, o, i);
    }
  }, a(io, "rr"), io), ec = null, xS = /* @__PURE__ */ a(() => (ec || (ec = new DS()), ec), "So");
  a(ch, "zr");
  a(CS, "_o");
  ES = CS, Sa = 3;
  a(RS, "Eo");
  a(SS, "Ao");
  AS = SS, Oi = { attrs: !0, children: !0, cases: !0, expression: !0 }, ph = /* @__PURE__ */ new Set(["parent"]), FS = (St = class {
    constructor(t = {}) {
      for (let r of /* @__PURE__ */ new Set([...ph, ...Object.keys(t)])) this.setProperty(r, t[r]);
    }
    setProperty(t, r) {
      if (this[t] !== r) {
        if (t in Oi && (r = r.map((n) => this.createChild(n))), !ph.has(t)) {
          this[t] = r;
          return;
        }
        Object.defineProperty(this, t, { value: r, enumerable: !1, configurable: !0 });
      }
    }
    map(t) {
      let r;
      for (let n in Oi) {
        let o = this[n];
        if (o) {
          let i = kS(o, (l) => l.map(t));
          r !== o && (r || (r = new St({ parent: this.parent })), r.setProperty(n, i));
        }
      }
      if (r) for (let n in this) n in Oi || (r[n] = this[n]);
      return t(r || this);
    }
    walk(t) {
      for (let r in Oi) {
        let n = this[r];
        if (n) for (let o = 0; o < n.length; o++) n[o].walk(t);
      }
      t(this);
    }
    createChild(t) {
      let r = t instanceof St ? t.clone() : new St(t);
      return r.setProperty("parent", this), r;
    }
    insertChildBefore(t, r) {
      this.children.splice(this.children.indexOf(t), 0, this.createChild(r));
    }
    removeChild(t) {
      this.children.splice(this.children.indexOf(t), 1);
    }
    replaceChild(t, r) {
      this.children[this.children.indexOf(t)] = this.createChild(r);
    }
    clone() {
      return new St(this);
    }
    get firstChild() {
      var t;
      return (t = this.children) == null ? void 0 : t[0];
    }
    get lastChild() {
      var t;
      return (t = this.children) == null ? void 0 : t[this.children.length - 1];
    }
    get prev() {
      var t, r;
      return (r = (t = this.parent) == null ? void 0 : t.children) == null ? void 0 : r[this.parent.children.indexOf(this) - 1];
    }
    get next() {
      var t, r;
      return (r = (t = this.parent) == null ? void 0 : t.children) == null ? void 0 : r[this.parent.children.indexOf(this) + 1];
    }
    get rawName() {
      return this.hasExplicitNamespace ? this.fullName : this.name;
    }
    get fullName() {
      return this.namespace ? this.namespace + ":" + this.name : this.name;
    }
    get attrMap() {
      return Object.fromEntries(this.attrs.map((t) => [t.fullName, t.value]));
    }
  }, a(St, "t"), St);
  a(kS, "Do");
  LS = [{ regex: /^(\[if([^\]]*)\]>)(.*?)<!\s*\[endif\]$/su, parse: IS }, { regex: /^\[if([^\]]*)\]><!$/u, parse: BS }, { regex: /^<!\s*\[endif\]$/u,
  parse: MS }];
  a(TS, "Ks");
  a(IS, "yo");
  a(BS, "wo");
  a(MS, "bo");
  tc = /* @__PURE__ */ new Map([["*", /* @__PURE__ */ new Set(["accesskey", "autocapitalize", "autofocus", "class", "contenteditable", "dir",
  "draggable", "enterkeyhint", "hidden", "id", "inert", "inputmode", "is", "itemid", "itemprop", "itemref", "itemscope", "itemtype", "lang",
  "nonce", "popover", "slot", "spellcheck", "style", "tabindex", "title", "translate", "writingsuggestions"])], ["a", /* @__PURE__ */ new Set(
  ["charset", "coords", "download", "href", "hreflang", "name", "ping", "referrerpolicy", "rel", "rev", "shape", "target", "type"])], ["appl\
et", /* @__PURE__ */ new Set(["align", "alt", "archive", "code", "codebase", "height", "hspace", "name", "object", "vspace", "width"])], ["a\
rea", /* @__PURE__ */ new Set(["alt", "coords", "download", "href", "hreflang", "nohref", "ping", "referrerpolicy", "rel", "shape", "target",
  "type"])], ["audio", /* @__PURE__ */ new Set(["autoplay", "controls", "crossorigin", "loop", "muted", "preload", "src"])], ["base", /* @__PURE__ */ new Set(
  ["href", "target"])], ["basefont", /* @__PURE__ */ new Set(["color", "face", "size"])], ["blockquote", /* @__PURE__ */ new Set(["cite"])],
  ["body", /* @__PURE__ */ new Set(["alink", "background", "bgcolor", "link", "text", "vlink"])], ["br", /* @__PURE__ */ new Set(["clear"])],
  ["button", /* @__PURE__ */ new Set(["disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "name",
  "popovertarget", "popovertargetaction", "type", "value"])], ["canvas", /* @__PURE__ */ new Set(["height", "width"])], ["caption", /* @__PURE__ */ new Set(
  ["align"])], ["col", /* @__PURE__ */ new Set(["align", "char", "charoff", "span", "valign", "width"])], ["colgroup", /* @__PURE__ */ new Set(
  ["align", "char", "charoff", "span", "valign", "width"])], ["data", /* @__PURE__ */ new Set(["value"])], ["del", /* @__PURE__ */ new Set([
  "cite", "datetime"])], ["details", /* @__PURE__ */ new Set(["name", "open"])], ["dialog", /* @__PURE__ */ new Set(["open"])], ["dir", /* @__PURE__ */ new Set(
  ["compact"])], ["div", /* @__PURE__ */ new Set(["align"])], ["dl", /* @__PURE__ */ new Set(["compact"])], ["embed", /* @__PURE__ */ new Set(
  ["height", "src", "type", "width"])], ["fieldset", /* @__PURE__ */ new Set(["disabled", "form", "name"])], ["font", /* @__PURE__ */ new Set(
  ["color", "face", "size"])], ["form", /* @__PURE__ */ new Set(["accept", "accept-charset", "action", "autocomplete", "enctype", "method", "\
name", "novalidate", "target"])], ["frame", /* @__PURE__ */ new Set(["frameborder", "longdesc", "marginheight", "marginwidth", "name", "nore\
size", "scrolling", "src"])], ["frameset", /* @__PURE__ */ new Set(["cols", "rows"])], ["h1", /* @__PURE__ */ new Set(["align"])], ["h2", /* @__PURE__ */ new Set(
  ["align"])], ["h3", /* @__PURE__ */ new Set(["align"])], ["h4", /* @__PURE__ */ new Set(["align"])], ["h5", /* @__PURE__ */ new Set(["alig\
n"])], ["h6", /* @__PURE__ */ new Set(["align"])], ["head", /* @__PURE__ */ new Set(["profile"])], ["hr", /* @__PURE__ */ new Set(["align", "\
noshade", "size", "width"])], ["html", /* @__PURE__ */ new Set(["manifest", "version"])], ["iframe", /* @__PURE__ */ new Set(["align", "allo\
w", "allowfullscreen", "allowpaymentrequest", "allowusermedia", "frameborder", "height", "loading", "longdesc", "marginheight", "marginwidth",
  "name", "referrerpolicy", "sandbox", "scrolling", "src", "srcdoc", "width"])], ["img", /* @__PURE__ */ new Set(["align", "alt", "border", "\
crossorigin", "decoding", "fetchpriority", "height", "hspace", "ismap", "loading", "longdesc", "name", "referrerpolicy", "sizes", "src", "sr\
cset", "usemap", "vspace", "width"])], ["input", /* @__PURE__ */ new Set(["accept", "align", "alt", "autocomplete", "checked", "dirname", "d\
isabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "height", "ismap", "list", "max", "maxlength", "\
min", "minlength", "multiple", "name", "pattern", "placeholder", "popovertarget", "popovertargetaction", "readonly", "required", "size", "sr\
c", "step", "type", "usemap", "value", "width"])], ["ins", /* @__PURE__ */ new Set(["cite", "datetime"])], ["isindex", /* @__PURE__ */ new Set(
  ["prompt"])], ["label", /* @__PURE__ */ new Set(["for", "form"])], ["legend", /* @__PURE__ */ new Set(["align"])], ["li", /* @__PURE__ */ new Set(
  ["type", "value"])], ["link", /* @__PURE__ */ new Set(["as", "blocking", "charset", "color", "crossorigin", "disabled", "fetchpriority", "\
href", "hreflang", "imagesizes", "imagesrcset", "integrity", "media", "referrerpolicy", "rel", "rev", "sizes", "target", "type"])], ["map", /* @__PURE__ */ new Set(
  ["name"])], ["menu", /* @__PURE__ */ new Set(["compact"])], ["meta", /* @__PURE__ */ new Set(["charset", "content", "http-equiv", "media",
  "name", "scheme"])], ["meter", /* @__PURE__ */ new Set(["high", "low", "max", "min", "optimum", "value"])], ["object", /* @__PURE__ */ new Set(
  ["align", "archive", "border", "classid", "codebase", "codetype", "data", "declare", "form", "height", "hspace", "name", "standby", "type",
  "typemustmatch", "usemap", "vspace", "width"])], ["ol", /* @__PURE__ */ new Set(["compact", "reversed", "start", "type"])], ["optgroup", /* @__PURE__ */ new Set(
  ["disabled", "label"])], ["option", /* @__PURE__ */ new Set(["disabled", "label", "selected", "value"])], ["output", /* @__PURE__ */ new Set(
  ["for", "form", "name"])], ["p", /* @__PURE__ */ new Set(["align"])], ["param", /* @__PURE__ */ new Set(["name", "type", "value", "valuety\
pe"])], ["pre", /* @__PURE__ */ new Set(["width"])], ["progress", /* @__PURE__ */ new Set(["max", "value"])], ["q", /* @__PURE__ */ new Set(
  ["cite"])], ["script", /* @__PURE__ */ new Set(["async", "blocking", "charset", "crossorigin", "defer", "fetchpriority", "integrity", "lan\
guage", "nomodule", "referrerpolicy", "src", "type"])], ["select", /* @__PURE__ */ new Set(["autocomplete", "disabled", "form", "multiple", "\
name", "required", "size"])], ["slot", /* @__PURE__ */ new Set(["name"])], ["source", /* @__PURE__ */ new Set(["height", "media", "sizes", "\
src", "srcset", "type", "width"])], ["style", /* @__PURE__ */ new Set(["blocking", "media", "type"])], ["table", /* @__PURE__ */ new Set(["a\
lign", "bgcolor", "border", "cellpadding", "cellspacing", "frame", "rules", "summary", "width"])], ["tbody", /* @__PURE__ */ new Set(["align",
  "char", "charoff", "valign"])], ["td", /* @__PURE__ */ new Set(["abbr", "align", "axis", "bgcolor", "char", "charoff", "colspan", "headers",
  "height", "nowrap", "rowspan", "scope", "valign", "width"])], ["template", /* @__PURE__ */ new Set(["shadowrootclonable", "shadowrootdeleg\
atesfocus", "shadowrootmode"])], ["textarea", /* @__PURE__ */ new Set(["autocomplete", "cols", "dirname", "disabled", "form", "maxlength", "\
minlength", "name", "placeholder", "readonly", "required", "rows", "wrap"])], ["tfoot", /* @__PURE__ */ new Set(["align", "char", "charoff",
  "valign"])], ["th", /* @__PURE__ */ new Set(["abbr", "align", "axis", "bgcolor", "char", "charoff", "colspan", "headers", "height", "nowra\
p", "rowspan", "scope", "valign", "width"])], ["thead", /* @__PURE__ */ new Set(["align", "char", "charoff", "valign"])], ["time", /* @__PURE__ */ new Set(
  ["datetime"])], ["tr", /* @__PURE__ */ new Set(["align", "bgcolor", "char", "charoff", "valign"])], ["track", /* @__PURE__ */ new Set(["de\
fault", "kind", "label", "src", "srclang"])], ["ul", /* @__PURE__ */ new Set(["compact", "type"])], ["video", /* @__PURE__ */ new Set(["auto\
play", "controls", "crossorigin", "height", "loop", "muted", "playsinline", "poster", "preload", "src", "width"])]]), _S = /* @__PURE__ */ new Set(
  ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big",
  "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "da\
ta", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "fig\
ure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "ifr\
ame", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marque\
e", "math", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "op\
tgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rbc", "rp", "rt", "rtc", "ruby", "s", "sam\
p", "script", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "sum\
mary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul",
  "var", "video", "wbr", "xmp"]);
  a(PS, "To");
  a(HS, "xo");
  a(zS, "ko");
  a(lm, "Js");
  a(OS, "Bo");
  a(dh, "Xs");
  a(sm, "Zs");
  a(ol, "ar");
  um = { name: "html", normalizeTagName: !0, normalizeAttributeName: !0, allowHtmComponentClosingTags: !0 }, NS = ol(um), $S = ol({ name: "a\
ngular" }), VS = ol({ name: "vue", isTagNameCaseSensitive: !0, shouldParseAsRawText(e, t, r, n) {
    return e.toLowerCase() !== "html" && !r && (e !== "template" || n.some(({ name: o, value: i }) => o === "lang" && i !== "html" && i !== "" &&
    i !== void 0));
  } }), jS = ol({ name: "lwc", canSelfClose: !1 }), WS = { html: _R }, cm = gh;
});

// ../node_modules/prettier/standalone.mjs
function ht() {
}
function dm(e, t, r, n, o) {
  for (var i = [], l; t; ) i.push(t), l = t.previousComponent, delete t.previousComponent, t = l;
  i.reverse();
  for (var u = 0, c = i.length, p = 0, d = 0; u < c; u++) {
    var h = i[u];
    if (h.removed) h.value = e.join(n.slice(d, d + h.count)), d += h.count;
    else {
      if (!h.added && o) {
        var f = r.slice(p, p + h.count);
        f = f.map(function(g, w) {
          var m = n[d + w];
          return m.length > g.length ? m : g;
        }), h.value = e.join(f);
      } else h.value = e.join(r.slice(p, p + h.count));
      p += h.count, h.added || (d += h.count);
    }
  }
  return i;
}
function fm(e, t) {
  var r;
  for (r = 0; r < e.length && r < t.length; r++) if (e[r] != t[r]) return e.slice(0, r);
  return e.slice(0, r);
}
function hm(e, t) {
  var r;
  if (!e || !t || e[e.length - 1] != t[t.length - 1]) return "";
  for (r = 0; r < e.length && r < t.length; r++) if (e[e.length - (r + 1)] != t[t.length - (r + 1)]) return e.slice(-r);
  return e.slice(-r);
}
function Ic(e, t, r) {
  if (e.slice(0, t.length) != t) throw Error("string ".concat(JSON.stringify(e), " doesn't start with prefix ").concat(JSON.stringify(t), ";\
 this is a bug"));
  return r + e.slice(t.length);
}
function Bc(e, t, r) {
  if (!t) return e + r;
  if (e.slice(-t.length) != t) throw Error("string ".concat(JSON.stringify(e), " doesn't end with suffix ").concat(JSON.stringify(t), "; thi\
s is a bug"));
  return e.slice(0, -t.length) + r;
}
function Oa(e, t) {
  return Ic(e, t, "");
}
function al(e, t) {
  return Bc(e, t, "");
}
function mm(e, t) {
  return t.slice(0, tA(e, t));
}
function tA(e, t) {
  var r = 0;
  e.length > t.length && (r = e.length - t.length);
  var n = t.length;
  e.length < t.length && (n = e.length);
  var o = Array(n), i = 0;
  o[0] = 0;
  for (var l = 1; l < n; l++) {
    for (t[l] == t[i] ? o[l] = o[i] : o[l] = i; i > 0 && t[l] != t[i]; ) i = o[i];
    t[l] == t[i] && i++;
  }
  i = 0;
  for (var u = r; u < e.length; u++) {
    for (; i > 0 && e[u] != t[i]; ) i = o[i];
    e[u] == t[i] && i++;
  }
  return i;
}
function gm(e, t, r, n) {
  if (t && r) {
    var o = t.value.match(/^\s*/)[0], i = t.value.match(/\s*$/)[0], l = r.value.match(/^\s*/)[0], u = r.value.match(/\s*$/)[0];
    if (e) {
      var c = fm(o, l);
      e.value = Bc(e.value, l, c), t.value = Oa(t.value, c), r.value = Oa(r.value, c);
    }
    if (n) {
      var p = hm(i, u);
      n.value = Ic(n.value, u, p), t.value = al(t.value, p), r.value = al(r.value, p);
    }
  } else if (r) e && (r.value = r.value.replace(/^\s*/, "")), n && (n.value = n.value.replace(/^\s*/, ""));
  else if (e && n) {
    var d = n.value.match(/^\s*/)[0], h = t.value.match(/^\s*/)[0], f = t.value.match(/\s*$/)[0], g = fm(d, h);
    t.value = Oa(t.value, g);
    var w = hm(Oa(d, g), f);
    t.value = al(t.value, w), n.value = Ic(n.value, d, w), e.value = Bc(e.value, d, d.slice(0, d.length - w.length));
  } else if (n) {
    var m = n.value.match(/^\s*/)[0], v = t.value.match(/\s*$/)[0], y = mm(v, m);
    t.value = al(t.value, y);
  } else if (e) {
    var b = e.value.match(/\s*$/)[0], D = t.value.match(/^\s*/)[0], x = mm(b, D);
    t.value = Oa(t.value, x);
  }
}
function Mc(e) {
  "@babel/helpers - typeof";
  return Mc = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Mc(e);
}
function _c(e, t, r, n, o) {
  t = t || [], r = r || [], n && (e = n(o, e));
  var i;
  for (i = 0; i < t.length; i += 1) if (t[i] === e) return r[i];
  var l;
  if (Object.prototype.toString.call(e) === "[object Array]") {
    for (t.push(e), l = new Array(e.length), r.push(l), i = 0; i < e.length; i += 1) l[i] = _c(e[i], t, r, n, o);
    return t.pop(), r.pop(), l;
  }
  if (e && e.toJSON && (e = e.toJSON()), Mc(e) === "object" && e !== null) {
    t.push(e), l = {}, r.push(l);
    var u = [], c;
    for (c in e) Object.prototype.hasOwnProperty.call(e, c) && u.push(c);
    for (u.sort(), i = 0; i < u.length; i += 1) c = u[i], l[c] = _c(e[c], t, r, n, c);
    t.pop(), r.pop();
  } else l = e;
  return l;
}
function iA(e, t, r) {
  return dl.diff(e, t, r);
}
function lA(e) {
  let t = e.indexOf("\r");
  return t !== -1 ? e.charAt(t + 1) === `
` ? "crlf" : "cr" : "lf";
}
function Yc(e) {
  switch (e) {
    case "cr":
      return "\r";
    case "crlf":
      return `\r
`;
    default:
      return `
`;
  }
}
function Um(e, t) {
  let r;
  switch (t) {
    case `
`:
      r = /\n/gu;
      break;
    case "\r":
      r = /\r/gu;
      break;
    case `\r
`:
      r = /\r\n/gu;
      break;
    default:
      throw new Error(`Unexpected "eol" ${JSON.stringify(t)}.`);
  }
  let n = e.match(r);
  return n ? n.length : 0;
}
function sA(e) {
  return ml(!1, e, /\r\n?/gu, `
`);
}
function uA(e) {
  if (typeof e == "string") return Xr;
  if (Array.isArray(e)) return $t;
  if (!e) return;
  let { type: t } = e;
  if (Gm.has(t)) return t;
}
function pA(e) {
  let t = e === null ? "null" : typeof e;
  if (t !== "string" && t !== "object") return `Unexpected doc '${t}', 
Expected it to be 'string' or 'object'.`;
  if (Kr(e)) throw new Error("doc is valid.");
  let r = Object.prototype.toString.call(e);
  if (r !== "[object Object]") return `Unexpected doc '${r}'.`;
  let n = cA([...Gm].map((o) => `'${o}'`));
  return `Unexpected doc.type '${e.type}'.
Expected it to be ${n}.`;
}
function fA(e, t, r, n) {
  let o = [e];
  for (; o.length > 0; ) {
    let i = o.pop();
    if (i === vm) {
      r(o.pop());
      continue;
    }
    r && o.push(i, vm);
    let l = Kr(i);
    if (!l) throw new Bo(i);
    if (t?.(i) !== !1) switch (l) {
      case $t:
      case Tt: {
        let u = l === $t ? i : i.parts;
        for (let c = u.length, p = c - 1; p >= 0; --p) o.push(u[p]);
        break;
      }
      case Ge:
        o.push(i.flatContents, i.breakContents);
        break;
      case Ve:
        if (n && i.expandedStates) for (let u = i.expandedStates.length, c = u - 1; c >= 0; --c) o.push(i.expandedStates[c]);
        else o.push(i.contents);
        break;
      case jt:
      case Vt:
      case qt:
      case It:
      case Ut:
        o.push(i.contents);
        break;
      case Xr:
      case Zr:
      case Wt:
      case Gt:
      case Re:
      case rt:
        break;
      default:
        throw new Bo(i);
    }
  }
}
function fl(e) {
  return Lt(e), { type: Vt, contents: e };
}
function Mo(e, t) {
  return Lt(t), { type: jt, contents: t, n: e };
}
function Xm(e, t = {}) {
  return Lt(e), Zc(t.expandedStates, !0), { type: Ve, id: t.id, contents: e, break: !!t.shouldBreak, expandedStates: t.expandedStates };
}
function hA(e) {
  return Mo(Number.NEGATIVE_INFINITY, e);
}
function mA(e) {
  return Mo({ type: "root" }, e);
}
function gA(e) {
  return Mo(-1, e);
}
function vA(e, t) {
  return Xm(e[0], { ...t, expandedStates: e });
}
function wA(e) {
  return Zc(e), { type: Tt, parts: e };
}
function bA(e, t = "", r = {}) {
  return Lt(e), t !== "" && Lt(t), { type: Ge, breakContents: e, flatContents: t, groupId: r.groupId };
}
function yA(e, t) {
  return Lt(e), { type: qt, contents: e, groupId: t.groupId, negate: t.negate };
}
function Pc(e) {
  return Lt(e), { type: Ut, contents: e };
}
function Qm(e, t) {
  Lt(e), Zc(t);
  let r = [];
  for (let n = 0; n < t.length; n++) n !== 0 && r.push(e), r.push(t[n]);
  return r;
}
function eg(e, t, r) {
  Lt(e);
  let n = e;
  if (t > 0) {
    for (let o = 0; o < Math.floor(t / r); ++o) n = fl(n);
    n = Mo(t % r, n), n = Mo(Number.NEGATIVE_INFINITY, n);
  }
  return n;
}
function EA(e, t) {
  return Lt(t), e ? { type: It, label: e, contents: t } : t;
}
function Nt(e) {
  var t;
  if (!e) return "";
  if (Array.isArray(e)) {
    let r = [];
    for (let n of e) if (Array.isArray(n)) r.push(...Nt(n));
    else {
      let o = Nt(n);
      o !== "" && r.push(o);
    }
    return r;
  }
  return e.type === Ge ? { ...e, breakContents: Nt(e.breakContents), flatContents: Nt(e.flatContents) } : e.type === Ve ? { ...e, contents: Nt(
  e.contents), expandedStates: (t = e.expandedStates) == null ? void 0 : t.map(Nt) } : e.type === Tt ? { type: "fill", parts: e.parts.map(Nt) } :
  e.contents ? { ...e, contents: Nt(e.contents) } : e;
}
function RA(e) {
  let t = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ new Set();
  return n(Nt(e));
  function n(i, l, u) {
    var c, p;
    if (typeof i == "string") return JSON.stringify(i);
    if (Array.isArray(i)) {
      let d = i.map(n).filter(Boolean);
      return d.length === 1 ? d[0] : `[${d.join(", ")}]`;
    }
    if (i.type === Re) {
      let d = ((c = u?.[l + 1]) == null ? void 0 : c.type) === rt;
      return i.literal ? d ? "literalline" : "literallineWithoutBreakParent" : i.hard ? d ? "hardline" : "hardlineWithoutBreakParent" : i.soft ?
      "softline" : "line";
    }
    if (i.type === rt) return ((p = u?.[l - 1]) == null ? void 0 : p.type) === Re && u[l - 1].hard ? void 0 : "breakParent";
    if (i.type === Wt) return "trim";
    if (i.type === Vt) return "indent(" + n(i.contents) + ")";
    if (i.type === jt) return i.n === Number.NEGATIVE_INFINITY ? "dedentToRoot(" + n(i.contents) + ")" : i.n < 0 ? "dedent(" + n(i.contents) +
    ")" : i.n.type === "root" ? "markAsRoot(" + n(i.contents) + ")" : "align(" + JSON.stringify(i.n) + ", " + n(i.contents) + ")";
    if (i.type === Ge) return "ifBreak(" + n(i.breakContents) + (i.flatContents ? ", " + n(i.flatContents) : "") + (i.groupId ? (i.flatContents ?
    "" : ', ""') + `, { groupId: ${o(i.groupId)} }` : "") + ")";
    if (i.type === qt) {
      let d = [];
      i.negate && d.push("negate: true"), i.groupId && d.push(`groupId: ${o(i.groupId)}`);
      let h = d.length > 0 ? `, { ${d.join(", ")} }` : "";
      return `indentIfBreak(${n(i.contents)}${h})`;
    }
    if (i.type === Ve) {
      let d = [];
      i.break && i.break !== "propagated" && d.push("shouldBreak: true"), i.id && d.push(`id: ${o(i.id)}`);
      let h = d.length > 0 ? `, { ${d.join(", ")} }` : "";
      return i.expandedStates ? `conditionalGroup([${i.expandedStates.map((f) => n(f)).join(",")}]${h})` : `group(${n(i.contents)}${h})`;
    }
    if (i.type === Tt) return `fill([${i.parts.map((d) => n(d)).join(", ")}])`;
    if (i.type === Ut) return "lineSuffix(" + n(i.contents) + ")";
    if (i.type === Gt) return "lineSuffixBoundary";
    if (i.type === It) return `label(${JSON.stringify(i.label)}, ${n(i.contents)})`;
    throw new Error("Unknown doc type " + i.type);
  }
  function o(i) {
    if (typeof i != "symbol") return JSON.stringify(String(i));
    if (i in t) return t[i];
    let l = i.description || "symbol";
    for (let u = 0; ; u++) {
      let c = l + (u > 0 ? ` #${u}` : "");
      if (!r.has(c)) return r.add(c), t[i] = `Symbol.for(${JSON.stringify(c)})`;
    }
  }
}
function FA(e) {
  return e === 12288 || e >= 65281 && e <= 65376 || e >= 65504 && e <= 65510;
}
function kA(e) {
  return e >= 4352 && e <= 4447 || e === 8986 || e === 8987 || e === 9001 || e === 9002 || e >= 9193 && e <= 9196 || e === 9200 || e === 9203 ||
  e === 9725 || e === 9726 || e === 9748 || e === 9749 || e >= 9776 && e <= 9783 || e >= 9800 && e <= 9811 || e === 9855 || e >= 9866 && e <=
  9871 || e === 9875 || e === 9889 || e === 9898 || e === 9899 || e === 9917 || e === 9918 || e === 9924 || e === 9925 || e === 9934 || e ===
  9940 || e === 9962 || e === 9970 || e === 9971 || e === 9973 || e === 9978 || e === 9981 || e === 9989 || e === 9994 || e === 9995 || e ===
  10024 || e === 10060 || e === 10062 || e >= 10067 && e <= 10069 || e === 10071 || e >= 10133 && e <= 10135 || e === 10160 || e === 10175 ||
  e === 11035 || e === 11036 || e === 11088 || e === 11093 || e >= 11904 && e <= 11929 || e >= 11931 && e <= 12019 || e >= 12032 && e <= 12245 ||
  e >= 12272 && e <= 12287 || e >= 12289 && e <= 12350 || e >= 12353 && e <= 12438 || e >= 12441 && e <= 12543 || e >= 12549 && e <= 12591 ||
  e >= 12593 && e <= 12686 || e >= 12688 && e <= 12773 || e >= 12783 && e <= 12830 || e >= 12832 && e <= 12871 || e >= 12880 && e <= 42124 ||
  e >= 42128 && e <= 42182 || e >= 43360 && e <= 43388 || e >= 44032 && e <= 55203 || e >= 63744 && e <= 64255 || e >= 65040 && e <= 65049 ||
  e >= 65072 && e <= 65106 || e >= 65108 && e <= 65126 || e >= 65128 && e <= 65131 || e >= 94176 && e <= 94180 || e === 94192 || e === 94193 ||
  e >= 94208 && e <= 100343 || e >= 100352 && e <= 101589 || e >= 101631 && e <= 101640 || e >= 110576 && e <= 110579 || e >= 110581 && e <=
  110587 || e === 110589 || e === 110590 || e >= 110592 && e <= 110882 || e === 110898 || e >= 110928 && e <= 110930 || e === 110933 || e >=
  110948 && e <= 110951 || e >= 110960 && e <= 111355 || e >= 119552 && e <= 119638 || e >= 119648 && e <= 119670 || e === 126980 || e === 127183 ||
  e === 127374 || e >= 127377 && e <= 127386 || e >= 127488 && e <= 127490 || e >= 127504 && e <= 127547 || e >= 127552 && e <= 127560 || e ===
  127568 || e === 127569 || e >= 127584 && e <= 127589 || e >= 127744 && e <= 127776 || e >= 127789 && e <= 127797 || e >= 127799 && e <= 127868 ||
  e >= 127870 && e <= 127891 || e >= 127904 && e <= 127946 || e >= 127951 && e <= 127955 || e >= 127968 && e <= 127984 || e === 127988 || e >=
  127992 && e <= 128062 || e === 128064 || e >= 128066 && e <= 128252 || e >= 128255 && e <= 128317 || e >= 128331 && e <= 128334 || e >= 128336 &&
  e <= 128359 || e === 128378 || e === 128405 || e === 128406 || e === 128420 || e >= 128507 && e <= 128591 || e >= 128640 && e <= 128709 ||
  e === 128716 || e >= 128720 && e <= 128722 || e >= 128725 && e <= 128727 || e >= 128732 && e <= 128735 || e === 128747 || e === 128748 || e >=
  128756 && e <= 128764 || e >= 128992 && e <= 129003 || e === 129008 || e >= 129292 && e <= 129338 || e >= 129340 && e <= 129349 || e >= 129351 &&
  e <= 129535 || e >= 129648 && e <= 129660 || e >= 129664 && e <= 129673 || e >= 129679 && e <= 129734 || e >= 129742 && e <= 129756 || e >=
  129759 && e <= 129769 || e >= 129776 && e <= 129784 || e >= 131072 && e <= 196605 || e >= 196608 && e <= 262141;
}
function IA(e) {
  if (!e) return 0;
  if (!TA.test(e)) return e.length;
  e = e.replace(AA(), "  ");
  let t = 0;
  for (let r of e) {
    let n = r.codePointAt(0);
    n <= 31 || n >= 127 && n <= 159 || n >= 768 && n <= 879 || (t += LA(n) ? 1 : 2);
  }
  return t;
}
function wl(e, t) {
  if (typeof e == "string") return t(e);
  let r = /* @__PURE__ */ new Map();
  return n(e);
  function n(i) {
    if (r.has(i)) return r.get(i);
    let l = o(i);
    return r.set(i, l), l;
  }
  function o(i) {
    switch (Kr(i)) {
      case $t:
        return t(i.map(n));
      case Tt:
        return t({ ...i, parts: i.parts.map(n) });
      case Ge:
        return t({ ...i, breakContents: n(i.breakContents), flatContents: n(i.flatContents) });
      case Ve: {
        let { expandedStates: l, contents: u } = i;
        return l ? (l = l.map(n), u = l[0]) : u = n(u), t({ ...i, contents: u, expandedStates: l });
      }
      case jt:
      case Vt:
      case qt:
      case It:
      case Ut:
        return t({ ...i, contents: n(i.contents) });
      case Xr:
      case Zr:
      case Wt:
      case Gt:
      case Re:
      case rt:
        return t(i);
      default:
        throw new Bo(i);
    }
  }
}
function Qc(e, t, r) {
  let n = r, o = !1;
  function i(l) {
    if (o) return !1;
    let u = t(l);
    u !== void 0 && (o = !0, n = u);
  }
  return a(i, "i"), Xc(e, i), n;
}
function BA(e) {
  if (e.type === Ve && e.break || e.type === Re && e.hard || e.type === rt) return !0;
}
function MA(e) {
  return Qc(e, BA, !1);
}
function wm(e) {
  if (e.length > 0) {
    let t = be(!1, e, -1);
    !t.expandedStates && !t.break && (t.break = "propagated");
  }
  return null;
}
function _A(e) {
  let t = /* @__PURE__ */ new Set(), r = [];
  function n(i) {
    if (i.type === rt && wm(r), i.type === Ve) {
      if (r.push(i), t.has(i)) return !1;
      t.add(i);
    }
  }
  a(n, "n");
  function o(i) {
    i.type === Ve && r.pop().break && wm(r);
  }
  a(o, "u"), Xc(e, n, o, !0);
}
function PA(e) {
  return e.type === Re && !e.hard ? e.soft ? "" : " " : e.type === Ge ? e.flatContents : e;
}
function HA(e) {
  return wl(e, PA);
}
function bm(e) {
  for (e = [...e]; e.length >= 2 && be(!1, e, -2).type === Re && be(!1, e, -1).type === rt; ) e.length -= 2;
  if (e.length > 0) {
    let t = Na(be(!1, e, -1));
    e[e.length - 1] = t;
  }
  return e;
}
function Na(e) {
  switch (Kr(e)) {
    case Vt:
    case qt:
    case Ve:
    case Ut:
    case It: {
      let t = Na(e.contents);
      return { ...e, contents: t };
    }
    case Ge:
      return { ...e, breakContents: Na(e.breakContents), flatContents: Na(e.flatContents) };
    case Tt:
      return { ...e, parts: bm(e.parts) };
    case $t:
      return bm(e);
    case Xr:
      return e.replace(/[\n\r]*$/u, "");
    case jt:
    case Zr:
    case Wt:
    case Gt:
    case Re:
    case rt:
      break;
    default:
      throw new Bo(e);
  }
  return e;
}
function tg(e) {
  return Na(OA(e));
}
function zA(e) {
  switch (Kr(e)) {
    case Tt:
      if (e.parts.every((t) => t === "")) return "";
      break;
    case Ve:
      if (!e.contents && !e.id && !e.break && !e.expandedStates) return "";
      if (e.contents.type === Ve && e.contents.id === e.id && e.contents.break === e.break && e.contents.expandedStates === e.expandedStates)
       return e.contents;
      break;
    case jt:
    case Vt:
    case qt:
    case Ut:
      if (!e.contents) return "";
      break;
    case Ge:
      if (!e.flatContents && !e.breakContents) return "";
      break;
    case $t: {
      let t = [];
      for (let r of e) {
        if (!r) continue;
        let [n, ...o] = Array.isArray(r) ? r : [r];
        typeof n == "string" && typeof be(!1, t, -1) == "string" ? t[t.length - 1] += n : t.push(n), t.push(...o);
      }
      return t.length === 0 ? "" : t.length === 1 ? t[0] : t;
    }
    case Xr:
    case Zr:
    case Wt:
    case Gt:
    case Re:
    case It:
    case rt:
      break;
    default:
      throw new Bo(e);
  }
  return e;
}
function OA(e) {
  return wl(e, (t) => zA(t));
}
function NA(e, t = Jm) {
  return wl(e, (r) => typeof r == "string" ? Qm(t, r.split(`
`)) : r);
}
function $A(e) {
  if (e.type === Re) return !0;
}
function VA(e) {
  return Qc(e, $A, !1);
}
function sl(e, t) {
  return e.type === It ? { ...e, contents: t(e.contents) } : t(e);
}
function rg() {
  return { value: "", length: 0, queue: [] };
}
function jA(e, t) {
  return zc(e, { type: "indent" }, t);
}
function WA(e, t, r) {
  return t === Number.NEGATIVE_INFINITY ? e.root || rg() : t < 0 ? zc(e, { type: "dedent" }, r) : t ? t.type === "root" ? { ...e, root: e } :
  zc(e, { type: typeof t == "string" ? "stringAlign" : "numberAlign", n: t }, r) : e;
}
function zc(e, t, r) {
  let n = t.type === "dedent" ? e.queue.slice(0, -1) : [...e.queue, t], o = "", i = 0, l = 0, u = 0;
  for (let w of n) switch (w.type) {
    case "indent":
      d(), r.useTabs ? c(1) : p(r.tabWidth);
      break;
    case "stringAlign":
      d(), o += w.n, i += w.n.length;
      break;
    case "numberAlign":
      l += 1, u += w.n;
      break;
    default:
      throw new Error(`Unexpected type '${w.type}'`);
  }
  return f(), { ...e, value: o, length: i, queue: n };
  function c(w) {
    o += "	".repeat(w), i += r.tabWidth * w;
  }
  function p(w) {
    o += " ".repeat(w), i += w;
  }
  function d() {
    r.useTabs ? h() : f();
  }
  function h() {
    l > 0 && c(l), g();
  }
  function f() {
    u > 0 && p(u), g();
  }
  function g() {
    l = 0, u = 0;
  }
}
function Oc(e) {
  let t = 0, r = 0, n = e.length;
  e: for (; n--; ) {
    let o = e[n];
    if (o === ho) {
      r++;
      continue;
    }
    for (let i = o.length - 1; i >= 0; i--) {
      let l = o[i];
      if (l === " " || l === "	") t++;
      else {
        e[n] = o.slice(0, i + 1);
        break e;
      }
    }
  }
  if (t > 0 || r > 0) for (e.length = n + 1; r-- > 0; ) e.push(ho);
  return t;
}
function il(e, t, r, n, o, i) {
  if (r === Number.POSITIVE_INFINITY) return !0;
  let l = t.length, u = [e], c = [];
  for (; r >= 0; ) {
    if (u.length === 0) {
      if (l === 0) return !0;
      u.push(t[--l]);
      continue;
    }
    let { mode: p, doc: d } = u.pop(), h = Kr(d);
    switch (h) {
      case Xr:
        c.push(d), r -= Jc(d);
        break;
      case $t:
      case Tt: {
        let f = h === $t ? d : d.parts, g = d[Hc] ?? 0;
        for (let w = f.length - 1; w >= g; w--) u.push({ mode: p, doc: f[w] });
        break;
      }
      case Vt:
      case jt:
      case qt:
      case It:
        u.push({ mode: p, doc: d.contents });
        break;
      case Wt:
        r += Oc(c);
        break;
      case Ve: {
        if (i && d.break) return !1;
        let f = d.break ? $e : p, g = d.expandedStates && f === $e ? be(!1, d.expandedStates, -1) : d.contents;
        u.push({ mode: f, doc: g });
        break;
      }
      case Ge: {
        let f = (d.groupId ? o[d.groupId] || kt : p) === $e ? d.breakContents : d.flatContents;
        f && u.push({ mode: p, doc: f });
        break;
      }
      case Re:
        if (p === $e || d.hard) return !0;
        d.soft || (c.push(" "), r--);
        break;
      case Ut:
        n = !0;
        break;
      case Gt:
        if (n) return !1;
        break;
    }
  }
  return !1;
}
function bl(e, t) {
  let r = {}, n = t.printWidth, o = Yc(t.endOfLine), i = 0, l = [{ ind: rg(), mode: $e, doc: e }], u = [], c = !1, p = [], d = 0;
  for (_A(e); l.length > 0; ) {
    let { ind: f, mode: g, doc: w } = l.pop();
    switch (Kr(w)) {
      case Xr: {
        let m = o !== `
` ? ml(!1, w, `
`, o) : w;
        u.push(m), l.length > 0 && (i += Jc(m));
        break;
      }
      case $t:
        for (let m = w.length - 1; m >= 0; m--) l.push({ ind: f, mode: g, doc: w[m] });
        break;
      case Zr:
        if (d >= 2) throw new Error("There are too many 'cursor' in doc.");
        u.push(ho), d++;
        break;
      case Vt:
        l.push({ ind: jA(f, t), mode: g, doc: w.contents });
        break;
      case jt:
        l.push({ ind: WA(f, w.n, t), mode: g, doc: w.contents });
        break;
      case Wt:
        i -= Oc(u);
        break;
      case Ve:
        switch (g) {
          case kt:
            if (!c) {
              l.push({ ind: f, mode: w.break ? $e : kt, doc: w.contents });
              break;
            }
          case $e: {
            c = !1;
            let m = { ind: f, mode: kt, doc: w.contents }, v = n - i, y = p.length > 0;
            if (!w.break && il(m, l, v, y, r)) l.push(m);
            else if (w.expandedStates) {
              let b = be(!1, w.expandedStates, -1);
              if (w.break) {
                l.push({ ind: f, mode: $e, doc: b });
                break;
              } else for (let D = 1; D < w.expandedStates.length + 1; D++) if (D >= w.expandedStates.length) {
                l.push({ ind: f, mode: $e, doc: b });
                break;
              } else {
                let x = w.expandedStates[D], C = { ind: f, mode: kt, doc: x };
                if (il(C, l, v, y, r)) {
                  l.push(C);
                  break;
                }
              }
            } else l.push({ ind: f, mode: $e, doc: w.contents });
            break;
          }
        }
        w.id && (r[w.id] = be(!1, l, -1).mode);
        break;
      case Tt: {
        let m = n - i, v = w[Hc] ?? 0, { parts: y } = w, b = y.length - v;
        if (b === 0) break;
        let D = y[v + 0], x = y[v + 1], C = { ind: f, mode: kt, doc: D }, E = { ind: f, mode: $e, doc: D }, R = il(C, [], m, p.length > 0, r,
        !0);
        if (b === 1) {
          R ? l.push(C) : l.push(E);
          break;
        }
        let F = { ind: f, mode: kt, doc: x }, A = { ind: f, mode: $e, doc: x };
        if (b === 2) {
          R ? l.push(F, C) : l.push(A, E);
          break;
        }
        let k = y[v + 2], B = { ind: f, mode: g, doc: { ...w, [Hc]: v + 2 } };
        il({ ind: f, mode: kt, doc: [D, x, k] }, [], m, p.length > 0, r, !0) ? l.push(B, F, C) : R ? l.push(B, A, C) : l.push(B, A, E);
        break;
      }
      case Ge:
      case qt: {
        let m = w.groupId ? r[w.groupId] : g;
        if (m === $e) {
          let v = w.type === Ge ? w.breakContents : w.negate ? w.contents : fl(w.contents);
          v && l.push({ ind: f, mode: g, doc: v });
        }
        if (m === kt) {
          let v = w.type === Ge ? w.flatContents : w.negate ? fl(w.contents) : w.contents;
          v && l.push({ ind: f, mode: g, doc: v });
        }
        break;
      }
      case Ut:
        p.push({ ind: f, mode: g, doc: w.contents });
        break;
      case Gt:
        p.length > 0 && l.push({ ind: f, mode: g, doc: Kc });
        break;
      case Re:
        switch (g) {
          case kt:
            if (w.hard) c = !0;
            else {
              w.soft || (u.push(" "), i += 1);
              break;
            }
          case $e:
            if (p.length > 0) {
              l.push({ ind: f, mode: g, doc: w }, ...p.reverse()), p.length = 0;
              break;
            }
            w.literal ? f.root ? (u.push(o, f.root.value), i = f.root.length) : (u.push(o), i = 0) : (i -= Oc(u), u.push(o + f.value), i = f.
            length);
            break;
        }
        break;
      case It:
        l.push({ ind: f, mode: g, doc: w.contents });
        break;
      case rt:
        break;
      default:
        throw new Bo(w);
    }
    l.length === 0 && p.length > 0 && (l.push(...p.reverse()), p.length = 0);
  }
  let h = u.indexOf(ho);
  if (h !== -1) {
    let f = u.indexOf(ho, h + 1);
    if (f === -1) return { formatted: u.filter((v) => v !== ho).join("") };
    let g = u.slice(0, h).join(""), w = u.slice(h + 1, f).join(""), m = u.slice(f + 1).join("");
    return { formatted: g + w + m, cursorNodeStart: g.length, cursorNodeText: w };
  }
  return { formatted: u.join("") };
}
function qA(e, t, r = 0) {
  let n = 0;
  for (let o = r; o < e.length; ++o) e[o] === "	" ? n = n + t - n % t : n++;
  return n;
}
function YA(e) {
  return e !== null && typeof e == "object";
}
function* yl(e, t) {
  let { getVisitorKeys: r, filter: n = /* @__PURE__ */ a(() => !0, "n") } = t, o = /* @__PURE__ */ a((i) => XA(i) && n(i), "u");
  for (let i of r(e)) {
    let l = e[i];
    if (Array.isArray(l)) for (let u of l) o(u) && (yield u);
    else o(l) && (yield l);
  }
}
function* ZA(e, t) {
  let r = [e];
  for (let n = 0; n < r.length; n++) {
    let o = r[n];
    for (let i of yl(o, t)) yield i, r.push(i);
  }
}
function KA(e, t) {
  return yl(e, t).next().done;
}
function Va(e) {
  return (t, r, n) => {
    let o = !!(n != null && n.backwards);
    if (r === !1) return !1;
    let { length: i } = t, l = r;
    for (; l >= 0 && l < i; ) {
      let u = t.charAt(l);
      if (e instanceof RegExp) {
        if (!e.test(u)) return l;
      } else if (!e.includes(u)) return l;
      o ? l-- : l++;
    }
    return l === -1 || l === i ? l : !1;
  };
}
function QA(e, t, r) {
  let n = !!(r != null && r.backwards);
  if (t === !1) return !1;
  let o = e.charAt(t);
  if (n) {
    if (e.charAt(t - 1) === "\r" && o === `
`) return t - 2;
    if (o === `
` || o === "\r" || o === "\u2028" || o === "\u2029") return t - 1;
  } else {
    if (o === "\r" && e.charAt(t + 1) === `
`) return t + 2;
    if (o === `
` || o === "\r" || o === "\u2028" || o === "\u2029") return t + 1;
  }
  return t;
}
function eF(e, t, r = {}) {
  let n = fr(e, r.backwards ? t - 1 : t, r), o = Yr(e, n, r);
  return n !== o;
}
function tF(e) {
  return Array.isArray(e) && e.length > 0;
}
function oF(e) {
  return e ? (t) => e(t, ig) : nF;
}
function aF(e) {
  let t = e.type || e.kind || "(unknown type)", r = String(e.name || e.id && (typeof e.id == "object" ? e.id.name : e.id) || e.key && (typeof e.
  key == "object" ? e.key.name : e.key) || e.value && (typeof e.value == "object" ? "" : String(e.value)) || e.operator || "");
  return r.length > 20 && (r = r.slice(0, 19) + "\u2026"), t + (r ? " " + r : "");
}
function t0(e, t) {
  (e.comments ?? (e.comments = [])).push(t), t.printed = !1, t.nodeDescription = aF(e);
}
function mo(e, t) {
  t.leading = !0, t.trailing = !1, t0(e, t);
}
function Wr(e, t, r) {
  t.leading = !1, t.trailing = !1, r && (t.marker = r), t0(e, t);
}
function go(e, t) {
  t.leading = !1, t.trailing = !0, t0(e, t);
}
function r0(e, t) {
  if (Sc.has(e)) return Sc.get(e);
  let { printer: { getCommentChildNodes: r, canAttachComment: n, getVisitorKeys: o }, locStart: i, locEnd: l } = t;
  if (!n) return [];
  let u = (r?.(e, t) ?? [...yl(e, { getVisitorKeys: Dl(o) })]).flatMap((c) => n(c) ? [c] : r0(c, t));
  return u.sort((c, p) => i(c) - i(p) || l(c) - l(p)), Sc.set(e, u), u;
}
function lg(e, t, r, n) {
  let { locStart: o, locEnd: i } = r, l = o(t), u = i(t), c = r0(e, r), p, d, h = 0, f = c.length;
  for (; h < f; ) {
    let g = h + f >> 1, w = c[g], m = o(w), v = i(w);
    if (m <= l && u <= v) return lg(w, t, r, w);
    if (v <= l) {
      p = w, h = g + 1;
      continue;
    }
    if (u <= m) {
      d = w, f = g;
      continue;
    }
    throw new Error("Comment location overlaps with node location");
  }
  if (n?.type === "TemplateLiteral") {
    let { quasis: g } = n, w = Fc(g, t, r);
    p && Fc(g, p, r) !== w && (p = null), d && Fc(g, d, r) !== w && (d = null);
  }
  return { enclosingNode: n, precedingNode: p, followingNode: d };
}
function iF(e, t) {
  let { comments: r } = e;
  if (delete e.comments, !rF(r) || !t.printer.canAttachComment) return;
  let n = [], { locStart: o, locEnd: i, printer: { experimentalFeatures: { avoidAstMutation: l = !1 } = {}, handleComments: u = {} }, originalText: c } = t,
  { ownLine: p = Ac, endOfLine: d = Ac, remaining: h = Ac } = u, f = r.map((g, w) => ({ ...lg(e, g, t), comment: g, text: c, options: t, ast: e,
  isLastComment: r.length - 1 === w }));
  for (let [g, w] of f.entries()) {
    let { comment: m, precedingNode: v, enclosingNode: y, followingNode: b, text: D, options: x, ast: C, isLastComment: E } = w;
    if (x.parser === "json" || x.parser === "json5" || x.parser === "jsonc" || x.parser === "__js_expression" || x.parser === "__ts_expressi\
on" || x.parser === "__vue_expression" || x.parser === "__vue_ts_expression") {
      if (o(m) - o(C) <= 0) {
        mo(C, m);
        continue;
      }
      if (i(m) - i(C) >= 0) {
        go(C, m);
        continue;
      }
    }
    let R;
    if (l ? R = [w] : (m.enclosingNode = y, m.precedingNode = v, m.followingNode = b, R = [m, D, x, C, E]), lF(D, x, f, g)) m.placement = "o\
wnLine", p(...R) || (b ? mo(b, m) : v ? go(v, m) : Wr(y || C, m));
    else if (sF(D, x, f, g)) m.placement = "endOfLine", d(...R) || (v ? go(v, m) : b ? mo(b, m) : Wr(y || C, m));
    else if (m.placement = "remaining", !h(...R)) if (v && b) {
      let F = n.length;
      F > 0 && n[F - 1].followingNode !== b && ym(n, x), n.push(w);
    } else v ? go(v, m) : b ? mo(b, m) : Wr(y || C, m);
  }
  if (ym(n, t), !l) for (let g of r) delete g.precedingNode, delete g.enclosingNode, delete g.followingNode;
}
function lF(e, t, r, n) {
  let { comment: o, precedingNode: i } = r[n], { locStart: l, locEnd: u } = t, c = l(o);
  if (i) for (let p = n - 1; p >= 0; p--) {
    let { comment: d, precedingNode: h } = r[p];
    if (h !== i || !sg(e.slice(u(d), c))) break;
    c = l(d);
  }
  return dr(e, c, { backwards: !0 });
}
function sF(e, t, r, n) {
  let { comment: o, followingNode: i } = r[n], { locStart: l, locEnd: u } = t, c = u(o);
  if (i) for (let p = n + 1; p < r.length; p++) {
    let { comment: d, followingNode: h } = r[p];
    if (h !== i || !sg(e.slice(c, l(d)))) break;
    c = u(d);
  }
  return dr(e, c);
}
function ym(e, t) {
  var r, n;
  let o = e.length;
  if (o === 0) return;
  let { precedingNode: i, followingNode: l } = e[0], u = t.locStart(l), c;
  for (c = o; c > 0; --c) {
    let { comment: p, precedingNode: d, followingNode: h } = e[c - 1];
    $c.strictEqual(d, i), $c.strictEqual(h, l);
    let f = t.originalText.slice(t.locEnd(p), u);
    if (((n = (r = t.printer).isGap) == null ? void 0 : n.call(r, f, t)) ?? /^[\s(]*$/u.test(f)) u = t.locStart(p);
    else break;
  }
  for (let [p, { comment: d }] of e.entries()) p < c ? go(i, d) : mo(l, d);
  for (let p of [i, l]) p.comments && p.comments.length > 1 && p.comments.sort((d, h) => t.locStart(d) - t.locStart(h));
  e.length = 0;
}
function Fc(e, t, r) {
  let n = r.locStart(t) - 1;
  for (let o = 1; o < e.length; ++o) if (n < r.locStart(e[o])) return o - 1;
  return 0;
}
function uF(e, t) {
  let r = t - 1;
  r = fr(e, r, { backwards: !0 }), r = Yr(e, r, { backwards: !0 }), r = fr(e, r, { backwards: !0 });
  let n = Yr(e, r, { backwards: !0 });
  return r !== n;
}
function ug(e, t) {
  let r = e.node;
  return r.printed = !0, t.printer.printComment(e, t);
}
function cF(e, t) {
  var r;
  let n = e.node, o = [ug(e, t)], { printer: i, originalText: l, locStart: u, locEnd: c } = t;
  if ((r = i.isBlockComment) != null && r.call(i, n)) {
    let d = dr(l, c(n)) ? dr(l, u(n), { backwards: !0 }) ? Gr : Km : " ";
    o.push(d);
  } else o.push(Gr);
  let p = Yr(l, fr(l, c(n)));
  return p !== !1 && dr(l, p) && o.push(Gr), o;
}
function pF(e, t, r) {
  var n;
  let o = e.node, i = ug(e, t), { printer: l, originalText: u, locStart: c } = t, p = (n = l.isBlockComment) == null ? void 0 : n.call(l, o);
  if (r != null && r.hasLineSuffix && !(r != null && r.isBlock) || dr(u, c(o), { backwards: !0 })) {
    let d = n0(u, c(o));
    return { doc: Pc([Gr, d ? Gr : "", i]), isBlock: p, hasLineSuffix: !0 };
  }
  return !p || r != null && r.hasLineSuffix ? { doc: [Pc([" ", i]), vl], isBlock: p, hasLineSuffix: !0 } : { doc: [" ", i], isBlock: p, hasLineSuffix: !1 };
}
function dF(e, t) {
  let r = e.node;
  if (!r) return {};
  let n = t[Symbol.for("printedComments")];
  if ((r.comments || []).filter((u) => !n.has(u)).length === 0) return { leading: "", trailing: "" };
  let o = [], i = [], l;
  return e.each(() => {
    let u = e.node;
    if (n != null && n.has(u)) return;
    let { leading: c, trailing: p } = u;
    c ? o.push(cF(e, t)) : p && (l = pF(e, t, l), i.push(l.doc));
  }, "comments"), { leading: o, trailing: i };
}
function fF(e, t, r) {
  let { leading: n, trailing: o } = dF(e, r);
  return !n && !o ? t : sl(t, (i) => [n, i, o]);
}
function hF(e) {
  let { [Symbol.for("comments")]: t, [Symbol.for("printedComments")]: r } = e;
  for (let n of t) {
    if (!n.printed && !r.has(n)) throw new Error('Comment "' + n.value.trim() + '" was not printed. Please report this error!');
    delete n.printed;
  }
}
function mF(e) {
  return () => {
  };
}
function pg({ plugins: e = [], showDeprecated: t = !1 } = {}) {
  let r = e.flatMap((o) => o.languages ?? []), n = [];
  for (let o of bF(Object.assign({}, ...e.map(({ options: i }) => i), vF))) !t && o.deprecated || (Array.isArray(o.choices) && (t || (o.choices =
  o.choices.filter((i) => !i.deprecated)), o.name === "parser" && (o.choices = [...o.choices, ...wF(o.choices, r, e)])), o.pluginDefaults = Object.
  fromEntries(e.filter((i) => {
    var l;
    return ((l = i.defaultOptions) == null ? void 0 : l[o.name]) !== void 0;
  }).map((i) => [i.name, i.defaultOptions[o.name]])), n.push(o));
  return { languages: r, options: n };
}
function* wF(e, t, r) {
  let n = new Set(e.map((o) => o.value));
  for (let o of t) if (o.parsers) {
    for (let i of o.parsers) if (!n.has(i)) {
      n.add(i);
      let l = r.find((c) => c.parsers && Object.prototype.hasOwnProperty.call(c.parsers, i)), u = o.name;
      l != null && l.name && (u += ` (plugin: ${l.name})`), yield { value: i, description: u };
    }
  }
}
function bF(e) {
  let t = [];
  for (let [r, n] of Object.entries(e)) {
    let o = { name: r, ...n };
    Array.isArray(o.default) && (o.default = be(!1, o.default, -1).value), t.push(o);
  }
  return t;
}
function xm(e, t) {
  if (!t) return;
  let r = yF(t).toLowerCase();
  return e.find(({ filenames: n }) => n?.some((o) => o.toLowerCase() === r)) ?? e.find(({ extensions: n }) => n?.some((o) => r.endsWith(o)));
}
function DF(e, t) {
  if (t) return e.find(({ name: r }) => r.toLowerCase() === t) ?? e.find(({ aliases: r }) => r?.includes(t)) ?? e.find(({ extensions: r }) => r?.
  includes(`.${t}`));
}
function xF(e, t) {
  let r = e.plugins.flatMap((o) => o.languages ?? []), n = DF(r, t.language) ?? xm(r, t.physicalFile) ?? xm(r, t.file) ?? (t.physicalFile, void 0);
  return n?.parsers[0];
}
function Rm(e, t, r, n) {
  return [`Invalid ${wo.default.red(n.key(e))} value.`, `Expected ${wo.default.blue(r)},`, `but received ${t === dg ? wo.default.gray("nothi\
ng") : wo.default.red(n.value(t))}.`].join(" ");
}
function fg({ text: e, list: t }, r) {
  let n = [];
  return e && n.push(`- ${wo.default.blue(e)}`), t && n.push([`- ${wo.default.blue(t.title)}:`].concat(t.values.map((o) => fg(o, r - Em.length).
  replace(/^|\n/g, `$&${Em}`))).join(`
`)), hg(n, r);
}
function hg(e, t) {
  if (e.length === 1) return e[0];
  let [r, n] = e, [o, i] = e.map((l) => l.split(`
`, 1)[0].length);
  return o > t && o > i ? n : r;
}
function SF(e, t) {
  if (e === t) return 0;
  let r = e;
  e.length > t.length && (e = t, t = r);
  let n = e.length, o = t.length;
  for (; n > 0 && e.charCodeAt(~-n) === t.charCodeAt(~-o); ) n--, o--;
  let i = 0;
  for (; i < n && e.charCodeAt(i) === t.charCodeAt(i); ) i++;
  if (n -= i, o -= i, n === 0) return o;
  let l, u, c, p, d = 0, h = 0;
  for (; d < n; ) Am[d] = e.charCodeAt(i + d), kc[d] = ++d;
  for (; h < o; ) for (l = t.charCodeAt(i + h), c = h++, u = h, d = 0; d < n; d++) p = l === Am[d] ? c : c + 1, c = kc[d], u = kc[d] = c > u ?
  p > u ? u + 1 : p : p > c ? c + 1 : p;
  return u;
}
function FF(e, t) {
  let r = new e(t), n = Object.create(r);
  for (let o of AF) o in t && (n[o] = kF(t[o], r, hr.prototype[o].length));
  return n;
}
function kF(e, t, r) {
  return typeof e == "function" ? (...n) => e(...n.slice(0, r - 1), t, ...n.slice(r - 1)) : () => e;
}
function Fm({ from: e, to: t }) {
  return { from: [e], to: t };
}
function MF(e, t) {
  let r = /* @__PURE__ */ Object.create(null);
  for (let n of e) {
    let o = n[t];
    if (r[o]) throw new Error(`Duplicate ${t} ${JSON.stringify(o)}`);
    r[o] = n;
  }
  return r;
}
function _F(e, t) {
  let r = /* @__PURE__ */ new Map();
  for (let n of e) {
    let o = n[t];
    if (r.has(o)) throw new Error(`Duplicate ${t} ${JSON.stringify(o)}`);
    r.set(o, n);
  }
  return r;
}
function PF() {
  let e = /* @__PURE__ */ Object.create(null);
  return (t) => {
    let r = JSON.stringify(t);
    return e[r] ? !0 : (e[r] = !0, !1);
  };
}
function HF(e, t) {
  let r = [], n = [];
  for (let o of e) t(o) ? r.push(o) : n.push(o);
  return [r, n];
}
function zF(e) {
  return e === Math.floor(e);
}
function OF(e, t) {
  if (e === t) return 0;
  let r = typeof e, n = typeof t, o = ["undefined", "object", "boolean", "number", "string"];
  return r !== n ? o.indexOf(r) - o.indexOf(n) : r !== "string" ? Number(e) - Number(t) : e.localeCompare(t);
}
function NF(e) {
  return (...t) => {
    let r = e(...t);
    return typeof r == "string" ? new Error(r) : r;
  };
}
function km(e) {
  return e === void 0 ? {} : e;
}
function gg(e) {
  if (typeof e == "string") return { text: e };
  let { text: t, list: r } = e;
  return $F((t || r) !== void 0, "Unexpected `expected` result, there should be at least one field."), r ? { text: t, list: { title: r.title,
  values: r.values.map(gg) } } : { text: t };
}
function Lm(e, t) {
  return e === !0 ? !0 : e === !1 ? { value: t } : e;
}
function Tm(e, t, r = !1) {
  return e === !1 ? !1 : e === !0 ? r ? !0 : [{ value: t }] : "value" in e ? [e] : e.length === 0 ? !1 : e;
}
function Im(e, t) {
  return typeof e == "string" || "key" in e ? { from: t, to: e } : "from" in e ? { from: e.from, to: e.to } : { from: t, to: e.to };
}
function Vc(e, t) {
  return e === void 0 ? [] : Array.isArray(e) ? e.map((r) => Im(r, t)) : [Im(e, t)];
}
function Bm(e, t) {
  let r = Vc(typeof e == "object" && "redirect" in e ? e.redirect : e, t);
  return r.length === 0 ? { remain: t, redirect: r } : typeof e == "object" && "remain" in e ? { remain: e.remain, redirect: r } : { redirect: r };
}
function $F(e, t) {
  if (!e) throw new Error(t);
}
function ZF(e, t, { logger: r = !1, isCLI: n = !1, passThrough: o = !1, FlagSchema: i, descriptor: l } = {}) {
  if (n) {
    if (!i) throw new Error("'FlagSchema' option is required.");
    if (!l) throw new Error("'descriptor' option is required.");
  } else l = vo;
  let u = o ? Array.isArray(o) ? (f, g) => o.includes(f) ? { [f]: g } : void 0 : (f, g) => ({ [f]: g }) : (f, g, w) => {
    let { _: m, ...v } = w.schemas;
    return mg(f, g, { ...w, schemas: v });
  }, c = KF(t, { isCLI: n, FlagSchema: i }), p = new XF(c, { logger: r, unknown: u, descriptor: l }), d = r !== !1;
  d && Lc && (p._hasDeprecationWarned = Lc);
  let h = p.normalize(e);
  return d && (Lc = p._hasDeprecationWarned), h;
}
function KF(e, { isCLI: t, FlagSchema: r }) {
  let n = [];
  t && n.push(TF.create({ name: "_" }));
  for (let o of e) n.push(JF(o, { isCLI: t, optionInfos: e, FlagSchema: r })), o.alias && t && n.push(LF.create({ name: o.alias, sourceName: o.
  name }));
  return n;
}
function JF(e, { isCLI: t, optionInfos: r, FlagSchema: n }) {
  let { name: o } = e, i = { name: o }, l, u = {};
  switch (e.type) {
    case "int":
      l = WF, t && (i.preprocess = Number);
      break;
    case "string":
      l = Mm;
      break;
    case "choice":
      l = VF, i.choices = e.choices.map((c) => c != null && c.redirect ? { ...c, redirect: { to: { key: e.name, value: c.redirect } } } : c);
      break;
    case "boolean":
      l = BF;
      break;
    case "flag":
      l = n, i.flags = r.flatMap((c) => [c.alias, c.description && c.name, c.oppositeDescription && `no-${c.name}`].filter(Boolean));
      break;
    case "path":
      l = Mm;
      break;
    default:
      throw new Error(`Unexpected type ${e.type}`);
  }
  if (e.exception ? i.validate = (c, p, d) => e.exception(c) || p.validate(c, d) : i.validate = (c, p, d) => c === void 0 || p.validate(c, d),
  e.redirect && (u.redirect = (c) => c ? { to: typeof e.redirect == "string" ? e.redirect : { key: e.redirect.option, value: e.redirect.value } } :
  void 0), e.deprecated && (u.deprecated = !0), t && !e.array) {
    let c = i.preprocess || ((p) => p);
    i.preprocess = (p, d, h) => d.preprocess(c(Array.isArray(p) ? be(!1, p, -1) : p), h);
  }
  return e.array ? IF.create({ ...t ? { preprocess: /* @__PURE__ */ a((c) => Array.isArray(c) ? c : [c], "preprocess") } : {}, ...u, valueSchema: l.
  create(i) }) : l.create({ ...i, ...u });
}
function wg(e, t) {
  if (!t) throw new Error("parserName is required.");
  let r = vg(!1, e, (o) => o.parsers && Object.prototype.hasOwnProperty.call(o.parsers, t));
  if (r) return r;
  let n = `Couldn't resolve parser "${t}".`;
  throw n += " Plugins must be explicitly added to the standalone bundle.", new cg(n);
}
function tk(e, t) {
  if (!t) throw new Error("astFormat is required.");
  let r = vg(!1, e, (o) => o.printers && Object.prototype.hasOwnProperty.call(o.printers, t));
  if (r) return r;
  let n = `Couldn't find plugin for AST format "${t}".`;
  throw n += " Plugins must be explicitly added to the standalone bundle.", new cg(n);
}
function bg({ plugins: e, parser: t }) {
  let r = wg(e, t);
  return yg(r, t);
}
function yg(e, t) {
  let r = e.parsers[t];
  return typeof r == "function" ? r() : r;
}
function rk(e, t) {
  let r = e.printers[t];
  return typeof r == "function" ? r() : r;
}
async function nk(e, t = {}) {
  var r;
  let n = { ...e };
  if (!n.parser) if (n.filepath) {
    if (n.parser = CF(n, { physicalFile: n.filepath }), !n.parser) throw new Dm(`No parser could be inferred for file "${n.filepath}".`);
  } else throw new Dm("No parser and no file path given, couldn't infer a parser.");
  let o = pg({ plugins: e.plugins, showDeprecated: !0 }).options, i = { ..._m, ...Object.fromEntries(o.filter((f) => f.default !== void 0).map(
  (f) => [f.name, f.default])) }, l = wg(n.plugins, n.parser), u = await yg(l, n.parser);
  n.astFormat = u.astFormat, n.locEnd = u.locEnd, n.locStart = u.locStart;
  let c = (r = l.printers) != null && r[u.astFormat] ? l : tk(n.plugins, u.astFormat), p = await rk(c, u.astFormat);
  n.printer = p;
  let d = c.defaultOptions ? Object.fromEntries(Object.entries(c.defaultOptions).filter(([, f]) => f !== void 0)) : {}, h = { ...i, ...d };
  for (let [f, g] of Object.entries(h)) (n[f] === null || n[f] === void 0) && (n[f] = g);
  return n.parser === "json" && (n.trailingComma = "none"), QF(n, o, { passThrough: Object.keys(_m), ...t });
}
async function ak(e, t) {
  let r = await bg(t), n = r.preprocess ? r.preprocess(e, t) : e;
  t.originalText = n;
  let o;
  try {
    o = await r.parse(n, t, t);
  } catch (i) {
    ik(i, e);
  }
  return { text: n, ast: o };
}
function ik(e, t) {
  let { loc: r } = e;
  if (r) {
    let n = (0, ok.codeFrameColumns)(t, r, { highlightCode: !0 });
    throw e.message += `
` + n, e.codeFrame = n, e;
  }
  throw e;
}
async function lk(e, t, r, n, o) {
  let { embeddedLanguageFormatting: i, printer: { embed: l, hasPrettierIgnore: u = /* @__PURE__ */ a(() => !1, "s"), getVisitorKeys: c } } = r;
  if (!l || i !== "auto") return;
  if (l.length > 2) throw new Error("printer.embed has too many parameters. The API changed in Prettier v3. Please update your plugin. See h\
ttps://prettier.io/docs/en/plugins.html#optional-embed");
  let p = Dl(l.getVisitorKeys ?? c), d = [];
  g();
  let h = e.stack;
  for (let { print: w, node: m, pathStack: v } of d) try {
    e.stack = v;
    let y = await w(f, t, e, r);
    y && o.set(m, y);
  } catch (y) {
    if (globalThis.PRETTIER_DEBUG) throw y;
  }
  e.stack = h;
  function f(w, m) {
    return sk(w, m, r, n);
  }
  a(f, "f");
  function g() {
    let { node: w } = e;
    if (w === null || typeof w != "object" || u(e)) return;
    for (let v of p(w)) Array.isArray(w[v]) ? e.each(g, v) : e.call(g, v);
    let m = l(e, r);
    if (m) {
      if (typeof m == "function") {
        d.push({ print: m, node: w, pathStack: [...e.stack] });
        return;
      }
      o.set(w, m);
    }
  }
  a(g, "d");
}
async function sk(e, t, r, n) {
  let o = await _o({ ...r, ...t, parentParser: r.parser, originalText: e }, { passThrough: !0 }), { ast: i } = await ja(e, o), l = await n(i,
  o);
  return tg(l);
}
function uk(e, t) {
  let { originalText: r, [Symbol.for("comments")]: n, locStart: o, locEnd: i, [Symbol.for("printedComments")]: l } = t, { node: u } = e, c = o(
  u), p = i(u);
  for (let d of n) o(d) >= c && i(d) <= p && l.add(d);
  return r.slice(c, p);
}
async function xl(e, t) {
  ({ ast: e } = await Dg(e, t));
  let r = /* @__PURE__ */ new Map(), n = new GA(e), o = gF(t), i = /* @__PURE__ */ new Map();
  await lk(n, u, t, xl, i);
  let l = await Pm(n, t, u, void 0, i);
  if (hF(t), t.nodeAfterCursor && !t.nodeBeforeCursor) return [Ur, l];
  if (t.nodeBeforeCursor && !t.nodeAfterCursor) return [l, Ur];
  return l;
  function u(p, d) {
    return p === void 0 || p === n ? c(d) : Array.isArray(p) ? n.call(() => c(d), ...p) : n.call(() => c(d), p);
  }
  function c(p) {
    o(n);
    let d = n.node;
    if (d == null) return "";
    let h = d && typeof d == "object" && p === void 0;
    if (h && r.has(d)) return r.get(d);
    let f = Pm(n, t, u, p, i);
    return h && r.set(d, f), f;
  }
}
function Pm(e, t, r, n, o) {
  var i;
  let { node: l } = e, { printer: u } = t, c;
  switch ((i = u.hasPrettierIgnore) != null && i.call(u, e) ? c = ck(e, t) : o.has(l) ? c = o.get(l) : c = u.print(e, t, r, n), l) {
    case t.cursorNode:
      c = sl(c, (p) => [Ur, p, Ur]);
      break;
    case t.nodeBeforeCursor:
      c = sl(c, (p) => [p, Ur]);
      break;
    case t.nodeAfterCursor:
      c = sl(c, (p) => [Ur, p]);
      break;
  }
  return u.printComment && (!u.willPrintOwnComments || !u.willPrintOwnComments(e, t)) && (c = fF(e, c, t)), c;
}
async function Dg(e, t) {
  let r = e.comments ?? [];
  t[Symbol.for("comments")] = r, t[Symbol.for("tokens")] = e.tokens ?? [], t[Symbol.for("printedComments")] = /* @__PURE__ */ new Set(), iF(
  e, t);
  let { printer: { preprocess: n } } = t;
  return e = n ? await n(e, t) : e, { ast: e, comments: r };
}
function pk(e, t) {
  let { cursorOffset: r, locStart: n, locEnd: o } = t, i = Dl(t.printer.getVisitorKeys), l = /* @__PURE__ */ a((g) => n(g) <= r && o(g) >= r,
  "o"), u = e, c = [e];
  for (let g of ZA(e, { getVisitorKeys: i, filter: l })) c.push(g), u = g;
  if (KA(u, { getVisitorKeys: i })) return { cursorNode: u };
  let p, d, h = -1, f = Number.POSITIVE_INFINITY;
  for (; c.length > 0 && (p === void 0 || d === void 0); ) {
    u = c.pop();
    let g = p !== void 0, w = d !== void 0;
    for (let m of yl(u, { getVisitorKeys: i })) {
      if (!g) {
        let v = o(m);
        v <= r && v > h && (p = m, h = v);
      }
      if (!w) {
        let v = n(m);
        v >= r && v < f && (d = m, f = v);
      }
    }
  }
  return { nodeBeforeCursor: p, nodeAfterCursor: d };
}
function fk(e, t) {
  let { printer: { massageAstNode: r, getVisitorKeys: n } } = t;
  if (!r) return e;
  let o = Dl(n), i = r.ignoredProperties ?? /* @__PURE__ */ new Set();
  return l(e);
  function l(u, c) {
    if (!(u !== null && typeof u == "object")) return u;
    if (Array.isArray(u)) return u.map((f) => l(f, c)).filter(Boolean);
    let p = {}, d = new Set(o(u));
    for (let f in u) !Object.prototype.hasOwnProperty.call(u, f) || i.has(f) || (d.has(f) ? p[f] = l(u[f], u) : p[f] = u[f]);
    let h = r(u, p, c);
    if (h !== null) return h ?? p;
  }
}
function wk(e, t) {
  let r = [e.node, ...e.parentNodes], n = /* @__PURE__ */ new Set([t.node, ...t.parentNodes]);
  return r.find((o) => xg.has(o.type) && n.has(o));
}
function Hm(e) {
  let t = gk(!1, e, (r) => r.type !== "Program" && r.type !== "File");
  return t === -1 ? e : e.slice(0, t + 1);
}
function bk(e, t, { locStart: r, locEnd: n }) {
  let o = e.node, i = t.node;
  if (o === i) return { startNode: o, endNode: i };
  let l = r(e.node);
  for (let c of Hm(t.parentNodes)) if (r(c) >= l) i = c;
  else break;
  let u = n(t.node);
  for (let c of Hm(e.parentNodes)) {
    if (n(c) <= u) o = c;
    else break;
    if (o === i) break;
  }
  return { startNode: o, endNode: i };
}
function jc(e, t, r, n, o = [], i) {
  let { locStart: l, locEnd: u } = r, c = l(e), p = u(e);
  if (!(t > p || t < c || i === "rangeEnd" && t === c || i === "rangeStart" && t === p)) {
    for (let d of r0(e, r)) {
      let h = jc(d, t, r, n, [e, ...o], i);
      if (h) return h;
    }
    if (!n || n(e, o[0])) return { node: e, parentNodes: o };
  }
}
function yk(e, t) {
  return t !== "DeclareExportDeclaration" && e !== "TypeParameterDeclaration" && (e === "Directive" || e === "TypeAlias" || e === "TSExportA\
ssignment" || e.startsWith("Declare") || e.startsWith("TSDeclare") || e.endsWith("Statement") || e.endsWith("Declaration"));
}
function zm(e, t, r) {
  if (!t) return !1;
  switch (e.parser) {
    case "flow":
    case "babel":
    case "babel-flow":
    case "babel-ts":
    case "typescript":
    case "acorn":
    case "espree":
    case "meriyah":
    case "__babel_estree":
      return yk(t.type, r?.type);
    case "json":
    case "json5":
    case "jsonc":
    case "json-stringify":
      return xg.has(t.type);
    case "graphql":
      return Dk.has(t.kind);
    case "vue":
      return t.tag !== "root";
  }
  return !1;
}
function xk(e, t, r) {
  let { rangeStart: n, rangeEnd: o, locStart: i, locEnd: l } = t;
  $c.ok(o > n);
  let u = e.slice(n, o).search(/\S/u), c = u === -1;
  if (!c) for (n += u; o > n && !/\S/u.test(e[o - 1]); --o) ;
  let p = jc(r, n, t, (g, w) => zm(t, g, w), [], "rangeStart"), d = c ? p : jc(r, o, t, (g) => zm(t, g), [], "rangeEnd");
  if (!p || !d) return { rangeStart: 0, rangeEnd: 0 };
  let h, f;
  if (vk(t)) {
    let g = wk(p, d);
    h = g, f = g;
  } else ({ startNode: h, endNode: f } = bk(p, d, t));
  return { rangeStart: Math.min(i(h), i(f)), rangeEnd: Math.max(l(h), l(f)) };
}
async function Eg(e, t, r = 0) {
  if (!e || e.trim().length === 0) return { formatted: "", cursorOffset: -1, comments: [] };
  let { ast: n, text: o } = await ja(e, t);
  t.cursorOffset >= 0 && (t = { ...t, ...dk(n, t) });
  let i = await xl(n, t, r);
  r > 0 && (i = eg([Gr, i], r, t.tabWidth));
  let l = bl(i, t);
  if (r > 0) {
    let c = l.formatted.trim();
    l.cursorNodeStart !== void 0 && (l.cursorNodeStart -= l.formatted.indexOf(c), l.cursorNodeStart < 0 && (l.cursorNodeStart = 0, l.cursorNodeText =
    l.cursorNodeText.trimStart()), l.cursorNodeStart + l.cursorNodeText.length > c.length && (l.cursorNodeText = l.cursorNodeText.trimEnd())),
    l.formatted = c + Yc(t.endOfLine);
  }
  let u = t[Symbol.for("comments")];
  if (t.cursorOffset >= 0) {
    let c, p, d, h;
    if ((t.cursorNode || t.nodeBeforeCursor || t.nodeAfterCursor) && l.cursorNodeText) if (d = l.cursorNodeStart, h = l.cursorNodeText, t.cursorNode)
     c = t.locStart(t.cursorNode), p = o.slice(c, t.locEnd(t.cursorNode));
    else {
      if (!t.nodeBeforeCursor && !t.nodeAfterCursor) throw new Error("Cursor location must contain at least one of cursorNode, nodeBeforeCur\
sor, nodeAfterCursor");
      c = t.nodeBeforeCursor ? t.locEnd(t.nodeBeforeCursor) : 0;
      let y = t.nodeAfterCursor ? t.locStart(t.nodeAfterCursor) : o.length;
      p = o.slice(c, y);
    }
    else c = 0, p = o, d = 0, h = l.formatted;
    let f = t.cursorOffset - c;
    if (p === h) return { formatted: l.formatted, cursorOffset: d + f, comments: u };
    let g = p.split("");
    g.splice(f, 0, Om);
    let w = h.split(""), m = iA(g, w), v = d;
    for (let y of m) if (y.removed) {
      if (y.value.includes(Om)) break;
    } else v += y.count;
    return { formatted: l.formatted, cursorOffset: v, comments: u };
  }
  return { formatted: l.formatted, cursorOffset: -1, comments: u };
}
async function Ck(e, t) {
  let { ast: r, text: n } = await ja(e, t), { rangeStart: o, rangeEnd: i } = xk(n, t, r), l = n.slice(o, i), u = Math.min(o, n.lastIndexOf(`\

`, o) + 1), c = n.slice(u, o).match(/^\s*/u)[0], p = e0(c, t.tabWidth), d = await Eg(l, { ...t, rangeStart: 0, rangeEnd: Number.POSITIVE_INFINITY,
  cursorOffset: t.cursorOffset > o && t.cursorOffset <= i ? t.cursorOffset - o : -1, endOfLine: "lf" }, p), h = d.formatted.trimEnd(), { cursorOffset: f } = t;
  f > i ? f += h.length - l.length : d.cursorOffset >= 0 && (f = d.cursorOffset + o);
  let g = n.slice(0, o) + h + n.slice(i);
  if (t.endOfLine !== "lf") {
    let w = Yc(t.endOfLine);
    f >= 0 && w === `\r
` && (f += Um(g.slice(0, f), `
`)), g = ml(!1, g, `
`, w);
  }
  return { formatted: g, cursorOffset: f, comments: d.comments };
}
function Tc(e, t, r) {
  return typeof t != "number" || Number.isNaN(t) || t < 0 || t > e.length ? r : t;
}
function Nm(e, t) {
  let { cursorOffset: r, rangeStart: n, rangeEnd: o } = t;
  return r = Tc(e, r, -1), n = Tc(e, n, 0), o = Tc(e, o, e.length), { ...t, cursorOffset: r, rangeStart: n, rangeEnd: o };
}
function Rg(e, t) {
  let { cursorOffset: r, rangeStart: n, rangeEnd: o, endOfLine: i } = Nm(e, t), l = e.charAt(0) === Cg;
  if (l && (e = e.slice(1), r--, n--, o--), i === "auto" && (i = lA(e)), e.includes("\r")) {
    let u = /* @__PURE__ */ a((c) => Um(e.slice(0, Math.max(c, 0)), `\r
`), "s");
    r -= u(r), n -= u(n), o -= u(o), e = sA(e);
  }
  return { hasBOM: l, text: e, options: Nm(e, { ...t, cursorOffset: r, rangeStart: n, rangeEnd: o, endOfLine: i }) };
}
async function $m(e, t) {
  let r = await bg(t);
  return !r.hasPragma || r.hasPragma(e);
}
async function Sg(e, t) {
  let { hasBOM: r, text: n, options: o } = Rg(e, await _o(t));
  if (o.rangeStart >= o.rangeEnd && n !== "" || o.requirePragma && !await $m(n, o)) return { formatted: e, cursorOffset: t.cursorOffset, comments: [] };
  let i;
  return o.rangeStart > 0 || o.rangeEnd < n.length ? i = await Ck(n, o) : (!o.requirePragma && o.insertPragma && o.printer.insertPragma && !await $m(
  n, o) && (n = o.printer.insertPragma(n)), i = await Eg(n, o)), r && (i.formatted = Cg + i.formatted, i.cursorOffset >= 0 && i.cursorOffset++),
  i;
}
async function Ek(e, t, r) {
  let { text: n, options: o } = Rg(e, await _o(t)), i = await ja(n, o);
  return r && (r.preprocessForPrint && (i.ast = await Dg(i.ast, o)), r.massage && (i.ast = hk(i.ast, o))), i;
}
async function Rk(e, t) {
  t = await _o(t);
  let r = await xl(e, t);
  return bl(r, t);
}
async function Sk(e, t) {
  let r = RA(e), { formatted: n } = await Sg(r, { ...t, parser: "__js_expression" });
  return n;
}
async function Ak(e, t) {
  t = await _o(t);
  let { ast: r } = await ja(e, t);
  return xl(r, t);
}
async function Fk(e, t) {
  return bl(e, await _o(t));
}
function Bk(e, t) {
  if (t === !1) return !1;
  if (e.charAt(t) === "/" && e.charAt(t + 1) === "*") {
    for (let r = t + 2; r < e.length; ++r) if (e.charAt(r) === "*" && e.charAt(r + 1) === "/") return r + 2;
  }
  return t;
}
function Mk(e, t) {
  return t === !1 ? !1 : e.charAt(t) === "/" && e.charAt(t + 1) === "/" ? ag(e, t) : t;
}
function _k(e, t) {
  let r = null, n = t;
  for (; n !== r; ) r = n, n = fr(e, n), n = o0(e, n), n = a0(e, n), n = Yr(e, n);
  return n;
}
function Pk(e, t) {
  let r = null, n = t;
  for (; n !== r; ) r = n, n = og(e, n), n = o0(e, n), n = fr(e, n);
  return n = a0(e, n), n = Yr(e, n), n !== !1 && dr(e, n);
}
function Hk(e, t) {
  let r = e.lastIndexOf(`
`);
  return r === -1 ? 0 : e0(e.slice(r + 1).match(/^[\t ]*/u)[0], t);
}
function Ok(e) {
  if (typeof e != "string") throw new TypeError("Expected a string");
  return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
function Nk(e, t) {
  let r = e.match(new RegExp(`(${Ok(t)})+`, "gu"));
  return r === null ? 0 : r.reduce((n, o) => Math.max(n, o.length / t.length), 0);
}
function Vk(e, t) {
  let r = i0(e, t);
  return r === !1 ? "" : e.charAt(r);
}
function Wk(e, t) {
  let r = t === !0 || t === ll ? ll : Vm, n = r === ll ? Vm : ll, o = 0, i = 0;
  for (let l of e) l === r ? o++ : l === n && i++;
  return o > i ? n : r;
}
function Uk(e, t, r) {
  for (let n = t; n < r; ++n) if (e.charAt(n) === `
`) return !0;
  return !1;
}
function Yk(e, t, r = {}) {
  return fr(e, r.backwards ? t - 1 : t, r) !== t;
}
function Zk(e, t, r) {
  let n = t === '"' ? "'" : '"', o = ml(!1, e, /\\(.)|(["'])/gsu, (i, l, u) => l === n ? l : u === t ? "\\" + u : u || (r && /^[^\n\r"'0-7\\bfnrt-vx\u2028\u2029]$/u.
  test(l) ? l : "\\" + l));
  return t + o + t;
}
function Jk(e, t, r) {
  return i0(e, r(t));
}
function Qk(e, t) {
  return arguments.length === 2 || typeof t == "number" ? i0(e, t) : Jk(...arguments);
}
function eL(e, t, r) {
  return n0(e, r(t));
}
function tL(e, t) {
  return arguments.length === 2 || typeof t == "number" ? n0(e, t) : eL(...arguments);
}
function rL(e, t, r) {
  return l0(e, r(t));
}
function nL(e, t) {
  return arguments.length === 2 || typeof t == "number" ? l0(e, t) : rL(...arguments);
}
function qr(e, t = 1) {
  return async (...r) => {
    let n = r[t] ?? {}, o = n.plugins ?? [];
    return r[t] = { ...n, plugins: Array.isArray(o) ? o : Object.values(o) }, e(...r);
  };
}
async function Lg(e, t) {
  let { formatted: r } = await kg(e, { ...t, cursorOffset: -1 });
  return r;
}
async function oL(e, t) {
  return await Lg(e, t) === e;
}
var qS, Wc, US, GS, YS, XS, jm, Wm, qc, ZS, hl, KS, JS, za, Uc, QS, qm, eA, ml, HV, pl, rA, gl, nA, Gc, oA, aA, $a, dl, Xr, $t, Zr, Vt, jt, Wt,
Ve, Tt, Ge, qt, Ut, Gt, Re, It, rt, Gm, Kr, cA, bo, dA, Bo, vm, Xc, Ym, Lt, Zc, DA, vl, xA, Kc, Zm, Km, CA, Gr, Jm, Ur, SA, be, AA, LA, TA, Jc,
$e, kt, ho, Hc, e0, jr, Nc, ul, yo, UA, GA, ng, $c, XA, JA, fr, og, ag, Yr, dr, rF, ig, nF, Dl, Sc, Ac, sg, n0, gF, Do, cg, xo, Dm, vF, yF, CF,
vo, Cm, EF, wo, dg, cl, Em, RF, Sm, kc, Am, mg, AF, Co, hr, Eo, LF, Ro, TF, So, IF, Ao, BF, Fo, VF, ko, jF, Lo, WF, To, Mm, qF, UF, GF, YF, Io,
XF, Lc, QF, ek, vg, _m, _o, ok, ja, ck, dk, hk, mk, gk, vk, xg, Dk, Cg, Om, Ag, kk, Lk, Tk, Ik, Fg, o0, a0, i0, l0, zk, $k, jk, ll, Vm, qk, Gk,
Xk, Kk, kg, aL, iL, Tg, Ig = S(() => {
  qS = Object.create, Wc = Object.defineProperty, US = Object.getOwnPropertyDescriptor, GS = Object.getOwnPropertyNames, YS = Object.getPrototypeOf,
  XS = Object.prototype.hasOwnProperty, jm = /* @__PURE__ */ a((e) => {
    throw TypeError(e);
  }, "fr"), Wm = /* @__PURE__ */ a((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "dr"), qc = /* @__PURE__ */ a((e, t) => {
    for (var r in t) Wc(e, r, { get: t[r], enumerable: !0 });
  }, "Bt"), ZS = /* @__PURE__ */ a((e, t, r, n) => {
    if (t && typeof t == "object" || typeof t == "function") for (let o of GS(t)) !XS.call(e, o) && o !== r && Wc(e, o, { get: /* @__PURE__ */ a(
    () => t[o], "get"), enumerable: !(n = US(t, o)) || n.enumerable });
    return e;
  }, "_u"), hl = /* @__PURE__ */ a((e, t, r) => (r = e != null ? qS(YS(e)) : {}, ZS(t || !e || !e.__esModule ? Wc(r, "default", { value: e, enumerable: !0 }) :
  r, e)), "Me"), KS = /* @__PURE__ */ a((e, t, r) => t.has(e) || jm("Cannot " + r), "xu"), JS = /* @__PURE__ */ a((e, t, r) => t.has(e) ? jm(
  "Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), "pr"), za = /* @__PURE__ */ a((e, t, r) => (KS(
  e, t, "access private method"), r), "pe"), Uc = Wm((e, t) => {
    "use strict";
    var r = new Proxy(String, { get: /* @__PURE__ */ a(() => r, "get") });
    t.exports = r;
  }), QS = Wm((e) => {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });
    function t() {
      return new Proxy({}, { get: /* @__PURE__ */ a(() => (i) => i, "get") });
    }
    a(t, "Bi");
    var r = /\r\n|[\n\r\u2028\u2029]/;
    function n(i, l, u) {
      let c = Object.assign({ column: 0, line: -1 }, i.start), p = Object.assign({}, c, i.end), { linesAbove: d = 2, linesBelow: h = 3 } = u ||
      {}, f = c.line, g = c.column, w = p.line, m = p.column, v = Math.max(f - (d + 1), 0), y = Math.min(l.length, w + h);
      f === -1 && (v = 0), w === -1 && (y = l.length);
      let b = w - f, D = {};
      if (b) for (let x = 0; x <= b; x++) {
        let C = x + f;
        if (!g) D[C] = !0;
        else if (x === 0) {
          let E = l[C - 1].length;
          D[C] = [g, E - g + 1];
        } else if (x === b) D[C] = [0, m];
        else {
          let E = l[C - x].length;
          D[C] = [0, E];
        }
      }
      else g === m ? g ? D[f] = [g, 0] : D[f] = !0 : D[f] = [g, m - g];
      return { start: v, end: y, markerLines: D };
    }
    a(n, "wi");
    function o(i, l, u = {}) {
      let c = t(!1), p = i.split(r), { start: d, end: h, markerLines: f } = n(l, p, u), g = l.start && typeof l.start.column == "number", w = String(
      h).length, m = i.split(r, h).slice(d, h).map((v, y) => {
        let b = d + 1 + y, D = ` ${` ${b}`.slice(-w)} |`, x = f[b], C = !f[b + 1];
        if (x) {
          let E = "";
          if (Array.isArray(x)) {
            let R = v.slice(0, Math.max(x[0] - 1, 0)).replace(/[^\t]/g, " "), F = x[1] || 1;
            E = [`
 `, c.gutter(D.replace(/\d/g, " ")), " ", R, c.marker("^").repeat(F)].join(""), C && u.message && (E += " " + c.message(u.message));
          }
          return [c.marker(">"), c.gutter(D), v.length > 0 ? ` ${v}` : "", E].join("");
        } else return ` ${c.gutter(D)}${v.length > 0 ? ` ${v}` : ""}`;
      }).join(`
`);
      return u.message && !g && (m = `${" ".repeat(w + 1)}${u.message}
${m}`), m;
    }
    a(o, "_i"), e.codeFrameColumns = o;
  }), qm = {};
  qc(qm, { __debug: /* @__PURE__ */ a(() => iL, "__debug"), check: /* @__PURE__ */ a(() => oL, "check"), doc: /* @__PURE__ */ a(() => Ag, "d\
oc"), format: /* @__PURE__ */ a(() => Lg, "format"), formatWithCursor: /* @__PURE__ */ a(() => kg, "formatWithCursor"), getSupportInfo: /* @__PURE__ */ a(
  () => aL, "getSupportInfo"), util: /* @__PURE__ */ a(() => Fg, "util"), version: /* @__PURE__ */ a(() => Ik, "version") });
  eA = /* @__PURE__ */ a((e, t, r, n) => {
    if (!(e && t == null)) return t.replaceAll ? t.replaceAll(r, n) : r.global ? t.replace(r, n) : t.split(r).join(n);
  }, "bu"), ml = eA;
  a(ht, "M");
  ht.prototype = { diff: /* @__PURE__ */ a(function(e, t) {
    var r, n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = n.callback;
    typeof n == "function" && (o = n, n = {});
    var i = this;
    function l(D) {
      return D = i.postProcess(D, n), o ? (setTimeout(function() {
        o(D);
      }, 0), !0) : D;
    }
    a(l, "s"), e = this.castInput(e, n), t = this.castInput(t, n), e = this.removeEmpty(this.tokenize(e, n)), t = this.removeEmpty(this.tokenize(
    t, n));
    var u = t.length, c = e.length, p = 1, d = u + c;
    n.maxEditLength != null && (d = Math.min(d, n.maxEditLength));
    var h = (r = n.timeout) !== null && r !== void 0 ? r : 1 / 0, f = Date.now() + h, g = [{ oldPos: -1, lastComponent: void 0 }], w = this.
    extractCommon(g[0], t, e, 0, n);
    if (g[0].oldPos + 1 >= c && w + 1 >= u) return l(dm(i, g[0].lastComponent, t, e, i.useLongestToken));
    var m = -1 / 0, v = 1 / 0;
    function y() {
      for (var D = Math.max(m, -p); D <= Math.min(v, p); D += 2) {
        var x = void 0, C = g[D - 1], E = g[D + 1];
        C && (g[D - 1] = void 0);
        var R = !1;
        if (E) {
          var F = E.oldPos - D;
          R = E && 0 <= F && F < u;
        }
        var A = C && C.oldPos + 1 < c;
        if (!R && !A) {
          g[D] = void 0;
          continue;
        }
        if (!A || R && C.oldPos < E.oldPos ? x = i.addToPath(E, !0, !1, 0, n) : x = i.addToPath(C, !1, !0, 1, n), w = i.extractCommon(x, t, e,
        D, n), x.oldPos + 1 >= c && w + 1 >= u) return l(dm(i, x.lastComponent, t, e, i.useLongestToken));
        g[D] = x, x.oldPos + 1 >= c && (v = Math.min(v, D - 1)), w + 1 >= u && (m = Math.max(m, D + 1));
      }
      p++;
    }
    if (a(y, "C"), o) (/* @__PURE__ */ a(function D() {
      setTimeout(function() {
        if (p > d || Date.now() > f) return o();
        y() || D();
      }, 0);
    }, "E"))();
    else for (; p <= d && Date.now() <= f; ) {
      var b = y();
      if (b) return b;
    }
  }, "diff"), addToPath: /* @__PURE__ */ a(function(e, t, r, n, o) {
    var i = e.lastComponent;
    return i && !o.oneChangePerToken && i.added === t && i.removed === r ? { oldPos: e.oldPos + n, lastComponent: { count: i.count + 1, added: t,
    removed: r, previousComponent: i.previousComponent } } : { oldPos: e.oldPos + n, lastComponent: { count: 1, added: t, removed: r, previousComponent: i } };
  }, "addToPath"), extractCommon: /* @__PURE__ */ a(function(e, t, r, n, o) {
    for (var i = t.length, l = r.length, u = e.oldPos, c = u - n, p = 0; c + 1 < i && u + 1 < l && this.equals(r[u + 1], t[c + 1], o); ) c++,
    u++, p++, o.oneChangePerToken && (e.lastComponent = { count: 1, previousComponent: e.lastComponent, added: !1, removed: !1 });
    return p && !o.oneChangePerToken && (e.lastComponent = { count: p, previousComponent: e.lastComponent, added: !1, removed: !1 }), e.oldPos =
    u, c;
  }, "extractCommon"), equals: /* @__PURE__ */ a(function(e, t, r) {
    return r.comparator ? r.comparator(e, t) : e === t || r.ignoreCase && e.toLowerCase() === t.toLowerCase();
  }, "equals"), removeEmpty: /* @__PURE__ */ a(function(e) {
    for (var t = [], r = 0; r < e.length; r++) e[r] && t.push(e[r]);
    return t;
  }, "removeEmpty"), castInput: /* @__PURE__ */ a(function(e) {
    return e;
  }, "castInput"), tokenize: /* @__PURE__ */ a(function(e) {
    return Array.from(e);
  }, "tokenize"), join: /* @__PURE__ */ a(function(e) {
    return e.join("");
  }, "join"), postProcess: /* @__PURE__ */ a(function(e) {
    return e;
  }, "postProcess") };
  a(dm, "Fr");
  HV = new ht();
  a(fm, "mr");
  a(hm, "hr");
  a(Ic, "wt");
  a(Bc, "_t");
  a(Oa, "we");
  a(al, "Ue");
  a(mm, "Er");
  a(tA, "Nu");
  pl = "a-zA-Z0-9_\\u{C0}-\\u{FF}\\u{D8}-\\u{F6}\\u{F8}-\\u{2C6}\\u{2C8}-\\u{2D7}\\u{2DE}-\\u{2FF}\\u{1E00}-\\u{1EFF}", rA = new RegExp("[".
  concat(pl, "]+|\\s+|[^").concat(pl, "]"), "ug"), gl = new ht();
  gl.equals = function(e, t, r) {
    return r.ignoreCase && (e = e.toLowerCase(), t = t.toLowerCase()), e.trim() === t.trim();
  };
  gl.tokenize = function(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r;
    if (t.intlSegmenter) {
      if (t.intlSegmenter.resolvedOptions().granularity != "word") throw new Error('The segmenter passed must have a granularity of "word"');
      r = Array.from(t.intlSegmenter.segment(e), function(i) {
        return i.segment;
      });
    } else r = e.match(rA) || [];
    var n = [], o = null;
    return r.forEach(function(i) {
      /\s/.test(i) ? o == null ? n.push(i) : n.push(n.pop() + i) : /\s/.test(o) ? n[n.length - 1] == o ? n.push(n.pop() + i) : n.push(o + i) :
      n.push(i), o = i;
    }), n;
  };
  gl.join = function(e) {
    return e.map(function(t, r) {
      return r == 0 ? t : t.replace(/^\s+/, "");
    }).join("");
  };
  gl.postProcess = function(e, t) {
    if (!e || t.oneChangePerToken) return e;
    var r = null, n = null, o = null;
    return e.forEach(function(i) {
      i.added ? n = i : i.removed ? o = i : ((n || o) && gm(r, o, n, i), r = i, n = null, o = null);
    }), (n || o) && gm(r, o, n, null), e;
  };
  a(gm, "Cr");
  nA = new ht();
  nA.tokenize = function(e) {
    var t = new RegExp("(\\r?\\n)|[".concat(pl, "]+|[^\\S\\n\\r]+|[^").concat(pl, "]"), "ug");
    return e.match(t) || [];
  };
  Gc = new ht();
  Gc.tokenize = function(e, t) {
    t.stripTrailingCr && (e = e.replace(/\r\n/g, `
`));
    var r = [], n = e.split(/(\n|\r\n)/);
    n[n.length - 1] || n.pop();
    for (var o = 0; o < n.length; o++) {
      var i = n[o];
      o % 2 && !t.newlineIsToken ? r[r.length - 1] += i : r.push(i);
    }
    return r;
  };
  Gc.equals = function(e, t, r) {
    return r.ignoreWhitespace ? ((!r.newlineIsToken || !e.includes(`
`)) && (e = e.trim()), (!r.newlineIsToken || !t.includes(`
`)) && (t = t.trim())) : r.ignoreNewlineAtEof && !r.newlineIsToken && (e.endsWith(`
`) && (e = e.slice(0, -1)), t.endsWith(`
`) && (t = t.slice(0, -1))), ht.prototype.equals.call(this, e, t, r);
  };
  oA = new ht();
  oA.tokenize = function(e) {
    return e.split(/(\S.+?[.!?])(?=\s+|$)/);
  };
  aA = new ht();
  aA.tokenize = function(e) {
    return e.split(/([{}:;,]|\s+)/);
  };
  a(Mc, "xt");
  $a = new ht();
  $a.useLongestToken = !0;
  $a.tokenize = Gc.tokenize;
  $a.castInput = function(e, t) {
    var r = t.undefinedReplacement, n = t.stringifyReplacer, o = n === void 0 ? function(i, l) {
      return typeof l > "u" ? r : l;
    } : n;
    return typeof e == "string" ? e : JSON.stringify(_c(e, null, null, o), o, "  ");
  };
  $a.equals = function(e, t, r) {
    return ht.prototype.equals.call($a, e.replace(/,([\r\n])/g, "$1"), t.replace(/,([\r\n])/g, "$1"), r);
  };
  a(_c, "bt");
  dl = new ht();
  dl.tokenize = function(e) {
    return e.slice();
  };
  dl.join = dl.removeEmpty = function(e) {
    return e;
  };
  a(iA, "gr");
  a(lA, "yr");
  a(Yc, "xe");
  a(Um, "Ot");
  a(sA, "Ar");
  Xr = "string", $t = "array", Zr = "cursor", Vt = "indent", jt = "align", Wt = "trim", Ve = "group", Tt = "fill", Ge = "if-break", qt = "in\
dent-if-break", Ut = "line-suffix", Gt = "line-suffix-boundary", Re = "line", It = "label", rt = "break-parent", Gm = /* @__PURE__ */ new Set(
  [Zr, Vt, jt, Wt, Ve, Tt, Ge, qt, Ut, Gt, Re, It, rt]);
  a(uA, "Lu");
  Kr = uA, cA = /* @__PURE__ */ a((e) => new Intl.ListFormat("en-US", { type: "disjunction" }).format(e), "Pu");
  a(pA, "Iu");
  dA = (bo = class extends Error {
    name = "InvalidDocError";
    constructor(t) {
      super(pA(t)), this.doc = t;
    }
  }, a(bo, "St"), bo), Bo = dA, vm = {};
  a(fA, "Ru");
  Xc = fA, Ym = /* @__PURE__ */ a(() => {
  }, "Br"), Lt = Ym, Zc = Ym;
  a(fl, "le");
  a(Mo, "De");
  a(Xm, "Tt");
  a(hA, "wr");
  a(mA, "_r");
  a(gA, "xr");
  a(vA, "br");
  a(wA, "Nr");
  a(bA, "Or");
  a(yA, "Sr");
  a(Pc, "Ne");
  DA = { type: Gt }, vl = { type: rt }, xA = { type: Wt }, Kc = { type: Re, hard: !0 }, Zm = { type: Re, hard: !0, literal: !0 }, Km = { type: Re },
  CA = { type: Re, soft: !0 }, Gr = [Kc, vl], Jm = [Zm, vl], Ur = { type: Zr };
  a(Qm, "Se");
  a(eg, "Qe");
  a(EA, "Pr");
  a(Nt, "ee");
  a(RA, "Ir");
  SA = /* @__PURE__ */ a((e, t, r) => {
    if (!(e && t == null)) return Array.isArray(t) || typeof t == "string" ? t[r < 0 ? t.length + r : r] : t.at(r);
  }, "Yu"), be = SA, AA = /* @__PURE__ */ a(() => /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE89\uDE8F-\uDEC2\uDEC6\uDECE-\uDEDC\uDEDF-\uDEE9]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g,
  "Rr");
  a(FA, "Yr");
  a(kA, "jr");
  LA = /* @__PURE__ */ a((e) => !(FA(e) || kA(e)), "Hr"), TA = /[^\x20-\x7F]/u;
  a(IA, "Hu");
  Jc = IA;
  a(wl, "Le");
  a(Qc, "Ze");
  a(BA, "Wu");
  a(MA, "Mr");
  a(wm, "Wr");
  a(_A, "Ur");
  a(PA, "$u");
  a(HA, "Vr");
  a(bm, "$r");
  a(Na, "ke");
  a(tg, "et");
  a(zA, "Mu");
  a(OA, "Uu");
  a(NA, "zr");
  a($A, "Vu");
  a(VA, "Gr");
  a(sl, "me");
  $e = Symbol("MODE_BREAK"), kt = Symbol("MODE_FLAT"), ho = Symbol("cursor"), Hc = Symbol("DOC_FILL_PRINTED_LENGTH");
  a(rg, "Kr");
  a(jA, "zu");
  a(WA, "Gu");
  a(zc, "Pt");
  a(Oc, "It");
  a(il, "tt");
  a(bl, "Ee");
  a(qA, "Ku");
  e0 = qA, UA = (yo = class {
    constructor(t) {
      JS(this, jr), this.stack = [t];
    }
    get key() {
      let { stack: t, siblings: r } = this;
      return be(!1, t, r === null ? -2 : -4) ?? null;
    }
    get index() {
      return this.siblings === null ? null : be(!1, this.stack, -2);
    }
    get node() {
      return be(!1, this.stack, -1);
    }
    get parent() {
      return this.getNode(1);
    }
    get grandparent() {
      return this.getNode(2);
    }
    get isInArray() {
      return this.siblings !== null;
    }
    get siblings() {
      let { stack: t } = this, r = be(!1, t, -3);
      return Array.isArray(r) ? r : null;
    }
    get next() {
      let { siblings: t } = this;
      return t === null ? null : t[this.index + 1];
    }
    get previous() {
      let { siblings: t } = this;
      return t === null ? null : t[this.index - 1];
    }
    get isFirst() {
      return this.index === 0;
    }
    get isLast() {
      let { siblings: t, index: r } = this;
      return t !== null && r === t.length - 1;
    }
    get isRoot() {
      return this.stack.length === 1;
    }
    get root() {
      return this.stack[0];
    }
    get ancestors() {
      return [...za(this, jr, ul).call(this)];
    }
    getName() {
      let { stack: t } = this, { length: r } = t;
      return r > 1 ? be(!1, t, -2) : null;
    }
    getValue() {
      return be(!1, this.stack, -1);
    }
    getNode(t = 0) {
      let r = za(this, jr, Nc).call(this, t);
      return r === -1 ? null : this.stack[r];
    }
    getParentNode(t = 0) {
      return this.getNode(t + 1);
    }
    call(t, ...r) {
      let { stack: n } = this, { length: o } = n, i = be(!1, n, -1);
      for (let l of r) i = i[l], n.push(l, i);
      try {
        return t(this);
      } finally {
        n.length = o;
      }
    }
    callParent(t, r = 0) {
      let n = za(this, jr, Nc).call(this, r + 1), o = this.stack.splice(n + 1);
      try {
        return t(this);
      } finally {
        this.stack.push(...o);
      }
    }
    each(t, ...r) {
      let { stack: n } = this, { length: o } = n, i = be(!1, n, -1);
      for (let l of r) i = i[l], n.push(l, i);
      try {
        for (let l = 0; l < i.length; ++l) n.push(l, i[l]), t(this, l, i), n.length -= 2;
      } finally {
        n.length = o;
      }
    }
    map(t, ...r) {
      let n = [];
      return this.each((o, i, l) => {
        n[i] = t(o, i, l);
      }, ...r), n;
    }
    match(...t) {
      let r = this.stack.length - 1, n = null, o = this.stack[r--];
      for (let i of t) {
        if (o === void 0) return !1;
        let l = null;
        if (typeof n == "number" && (l = n, n = this.stack[r--], o = this.stack[r--]), i && !i(o, n, l)) return !1;
        n = this.stack[r--], o = this.stack[r--];
      }
      return !0;
    }
    findAncestor(t) {
      for (let r of za(this, jr, ul).call(this)) if (t(r)) return r;
    }
    hasAncestor(t) {
      for (let r of za(this, jr, ul).call(this)) if (t(r)) return !0;
      return !1;
    }
  }, a(yo, "Rt"), yo);
  jr = /* @__PURE__ */ new WeakSet(), Nc = /* @__PURE__ */ a(function(e) {
    let { stack: t } = this;
    for (let r = t.length - 1; r >= 0; r -= 2) if (!Array.isArray(t[r]) && --e < 0) return r;
    return -1;
  }, "Yt"), ul = /* @__PURE__ */ a(function* () {
    let { stack: e } = this;
    for (let t = e.length - 3; t >= 0; t -= 2) {
      let r = e[t];
      Array.isArray(r) || (yield r);
    }
  }, "rt");
  GA = UA, ng = new Proxy(() => {
  }, { get: /* @__PURE__ */ a(() => ng, "get") }), $c = ng;
  a(YA, "Ju");
  XA = YA;
  a(yl, "ge");
  a(ZA, "Qr");
  a(KA, "Zr");
  a(Va, "ye");
  JA = Va(/\s/u), fr = Va(" 	"), og = Va(",; 	"), ag = Va(/[^\n\r]/u);
  a(QA, "qu");
  Yr = QA;
  a(eF, "Xu");
  dr = eF;
  a(tF, "Qu");
  rF = tF, ig = /* @__PURE__ */ new Set(["tokens", "comments", "parent", "enclosingNode", "precedingNode", "followingNode"]), nF = /* @__PURE__ */ a(
  (e) => Object.keys(e).filter((t) => !ig.has(t)), "Zu");
  a(oF, "ei");
  Dl = oF;
  a(aF, "ti");
  a(t0, "Ht");
  a(mo, "ue");
  a(Wr, "re");
  a(go, "ie");
  Sc = /* @__PURE__ */ new WeakMap();
  a(r0, "it");
  a(lg, "nn");
  Ac = /* @__PURE__ */ a(() => !1, "$t");
  a(iF, "un");
  sg = /* @__PURE__ */ a((e) => !/[\S\n\u2028\u2029]/u.test(e), "on");
  a(lF, "ri");
  a(sF, "ni");
  a(ym, "rn");
  a(Fc, "Mt");
  a(uF, "ui");
  n0 = uF;
  a(ug, "sn");
  a(cF, "ii");
  a(pF, "oi");
  a(dF, "si");
  a(fF, "an");
  a(hF, "Dn");
  a(mF, "ai");
  gF = mF, cg = (Do = class extends Error {
    name = "ConfigError";
  }, a(Do, "Re"), Do), Dm = (xo = class extends Error {
    name = "UndefinedParserError";
  }, a(xo, "Ye"), xo), vF = { cursorOffset: { category: "Special", type: "int", default: -1, range: { start: -1, end: 1 / 0, step: 1 }, description: "\
Print (to stderr) where a cursor at the given position would move to after formatting.", cliCategory: "Editor" }, endOfLine: { category: "Gl\
obal", type: "choice", default: "lf", description: "Which end of line characters to apply.", choices: [{ value: "lf", description: "Line Fee\
d only (\\n), common on Linux and macOS as well as inside git repos" }, { value: "crlf", description: "Carriage Return + Line Feed character\
s (\\r\\n), common on Windows" }, { value: "cr", description: "Carriage Return character only (\\r), used very rarely" }, { value: "auto", description: `\
Maintain existing
(mixed values within one file are normalised by looking at what's used after the first line)` }] }, filepath: { category: "Special", type: "\
path", description: "Specify the input filepath. This will be used to do parser inference.", cliName: "stdin-filepath", cliCategory: "Other",
  cliDescription: "Path to the file to pretend that stdin comes from." }, insertPragma: { category: "Special", type: "boolean", default: !1,
  description: "Insert @format pragma into file's first docblock comment.", cliCategory: "Other" }, parser: { category: "Global", type: "cho\
ice", default: void 0, description: "Which parser to use.", exception: /* @__PURE__ */ a((e) => typeof e == "string" || typeof e == "functio\
n", "exception"), choices: [{ value: "flow", description: "Flow" }, { value: "babel", description: "JavaScript" }, { value: "babel-flow", description: "\
Flow" }, { value: "babel-ts", description: "TypeScript" }, { value: "typescript", description: "TypeScript" }, { value: "acorn", description: "\
JavaScript" }, { value: "espree", description: "JavaScript" }, { value: "meriyah", description: "JavaScript" }, { value: "css", description: "\
CSS" }, { value: "less", description: "Less" }, { value: "scss", description: "SCSS" }, { value: "json", description: "JSON" }, { value: "js\
on5", description: "JSON5" }, { value: "jsonc", description: "JSON with Comments" }, { value: "json-stringify", description: "JSON.stringify" },
  { value: "graphql", description: "GraphQL" }, { value: "markdown", description: "Markdown" }, { value: "mdx", description: "MDX" }, { value: "\
vue", description: "Vue" }, { value: "yaml", description: "YAML" }, { value: "glimmer", description: "Ember / Handlebars" }, { value: "html",
  description: "HTML" }, { value: "angular", description: "Angular" }, { value: "lwc", description: "Lightning Web Components" }] }, plugins: {
  type: "path", array: !0, default: [{ value: [] }], category: "Global", description: "Add a plugin. Multiple plugins can be passed as separ\
ate `--plugin`s.", exception: /* @__PURE__ */ a((e) => typeof e == "string" || typeof e == "object", "exception"), cliName: "plugin", cliCategory: "\
Config" }, printWidth: { category: "Global", type: "int", default: 80, description: "The line length where Prettier will try wrap.", range: {
  start: 0, end: 1 / 0, step: 1 } }, rangeEnd: { category: "Special", type: "int", default: 1 / 0, range: { start: 0, end: 1 / 0, step: 1 },
  description: `Format code ending at a given character offset (exclusive).
The range will extend forwards to the end of the selected statement.`, cliCategory: "Editor" }, rangeStart: { category: "Special", type: "in\
t", default: 0, range: { start: 0, end: 1 / 0, step: 1 }, description: `Format code starting at a given character offset.
The range will extend backwards to the start of the first line containing the selected statement.`, cliCategory: "Editor" }, requirePragma: {
  category: "Special", type: "boolean", default: !1, description: `Require either '@prettier' or '@format' to be present in the file's first\
 docblock comment
in order for it to be formatted.`, cliCategory: "Other" }, tabWidth: { type: "int", category: "Global", default: 2, description: "Number of \
spaces per indentation level.", range: { start: 0, end: 1 / 0, step: 1 } }, useTabs: { category: "Global", type: "boolean", default: !1, description: "\
Indent with tabs instead of spaces." }, embeddedLanguageFormatting: { category: "Global", type: "choice", default: "auto", description: "Con\
trol how Prettier formats quoted code embedded in the file.", choices: [{ value: "auto", description: "Format embedded code if Prettier can \
automatically identify it." }, { value: "off", description: "Never automatically format embedded code." }] } };
  a(pg, "ot");
  a(wF, "Di");
  a(bF, "li");
  yF = /* @__PURE__ */ a((e) => String(e).split(/[/\\]/u).pop(), "ci");
  a(xm, "fn");
  a(DF, "fi");
  a(xF, "di");
  CF = xF, vo = { key: /* @__PURE__ */ a((e) => /^[$_a-zA-Z][$_a-zA-Z0-9]*$/.test(e) ? e : JSON.stringify(e), "key"), value(e) {
    if (e === null || typeof e != "object") return JSON.stringify(e);
    if (Array.isArray(e)) return `[${e.map((r) => vo.value(r)).join(", ")}]`;
    let t = Object.keys(e);
    return t.length === 0 ? "{}" : `{ ${t.map((r) => `${vo.key(r)}: ${vo.value(e[r])}`).join(", ")} }`;
  }, pair: /* @__PURE__ */ a(({ key: e, value: t }) => vo.value({ [e]: t }), "pair") }, Cm = hl(Uc(), 1), EF = /* @__PURE__ */ a((e, t, { descriptor: r }) => {
    let n = [`${Cm.default.yellow(typeof e == "string" ? r.key(e) : r.pair(e))} is deprecated`];
    return t && n.push(`we now treat it as ${Cm.default.blue(typeof t == "string" ? r.key(t) : r.pair(t))}`), n.join("; ") + ".";
  }, "mn"), wo = hl(Uc(), 1), dg = Symbol.for("vnopts.VALUE_NOT_EXIST"), cl = Symbol.for("vnopts.VALUE_UNCHANGED"), Em = " ".repeat(2), RF =
  /* @__PURE__ */ a((e, t, r) => {
    let { text: n, list: o } = r.normalizeExpectedResult(r.schemas[e].expected(r)), i = [];
    return n && i.push(Rm(e, t, n, r.descriptor)), o && i.push([Rm(e, t, o.title, r.descriptor)].concat(o.values.map((l) => fg(l, r.loggerPrintWidth))).
    join(`
`)), hg(i, r.loggerPrintWidth);
  }, "Cn");
  a(Rm, "En");
  a(fg, "gn");
  a(hg, "yn");
  Sm = hl(Uc(), 1), kc = [], Am = [];
  a(SF, "zt");
  mg = /* @__PURE__ */ a((e, t, { descriptor: r, logger: n, schemas: o }) => {
    let i = [`Ignored unknown option ${Sm.default.yellow(r.pair({ key: e, value: t }))}.`], l = Object.keys(o).sort().find((u) => SF(e, u) <
    3);
    l && i.push(`Did you mean ${Sm.default.blue(r.key(l))}?`), n.warn(i.join(" "));
  }, "Dt"), AF = ["default", "expected", "validate", "deprecated", "forward", "redirect", "overlap", "preprocess", "postprocess"];
  a(FF, "Fi");
  hr = (Co = class {
    static create(t) {
      return FF(this, t);
    }
    constructor(t) {
      this.name = t.name;
    }
    default(t) {
    }
    expected(t) {
      return "nothing";
    }
    validate(t, r) {
      return !1;
    }
    deprecated(t, r) {
      return !1;
    }
    forward(t, r) {
    }
    redirect(t, r) {
    }
    overlap(t, r, n) {
      return t;
    }
    preprocess(t, r) {
      return t;
    }
    postprocess(t, r) {
      return cl;
    }
  }, a(Co, "x"), Co);
  a(kF, "mi");
  LF = (Eo = class extends hr {
    constructor(t) {
      super(t), this._sourceName = t.sourceName;
    }
    expected(t) {
      return t.schemas[this._sourceName].expected(t);
    }
    validate(t, r) {
      return r.schemas[this._sourceName].validate(t, r);
    }
    redirect(t, r) {
      return this._sourceName;
    }
  }, a(Eo, "lt"), Eo), TF = (Ro = class extends hr {
    expected() {
      return "anything";
    }
    validate() {
      return !0;
    }
  }, a(Ro, "ct"), Ro), IF = (So = class extends hr {
    constructor({ valueSchema: t, name: r = t.name, ...n }) {
      super({ ...n, name: r }), this._valueSchema = t;
    }
    expected(t) {
      let { text: r, list: n } = t.normalizeExpectedResult(this._valueSchema.expected(t));
      return { text: r && `an array of ${r}`, list: n && { title: "an array of the following values", values: [{ list: n }] } };
    }
    validate(t, r) {
      if (!Array.isArray(t)) return !1;
      let n = [];
      for (let o of t) {
        let i = r.normalizeValidateResult(this._valueSchema.validate(o, r), o);
        i !== !0 && n.push(i.value);
      }
      return n.length === 0 ? !0 : { value: n };
    }
    deprecated(t, r) {
      let n = [];
      for (let o of t) {
        let i = r.normalizeDeprecatedResult(this._valueSchema.deprecated(o, r), o);
        i !== !1 && n.push(...i.map(({ value: l }) => ({ value: [l] })));
      }
      return n;
    }
    forward(t, r) {
      let n = [];
      for (let o of t) {
        let i = r.normalizeForwardResult(this._valueSchema.forward(o, r), o);
        n.push(...i.map(Fm));
      }
      return n;
    }
    redirect(t, r) {
      let n = [], o = [];
      for (let i of t) {
        let l = r.normalizeRedirectResult(this._valueSchema.redirect(i, r), i);
        "remain" in l && n.push(l.remain), o.push(...l.redirect.map(Fm));
      }
      return n.length === 0 ? { redirect: o } : { redirect: o, remain: n };
    }
    overlap(t, r) {
      return t.concat(r);
    }
  }, a(So, "ft"), So);
  a(Fm, "vn");
  BF = (Ao = class extends hr {
    expected() {
      return "true or false";
    }
    validate(t) {
      return typeof t == "boolean";
    }
  }, a(Ao, "dt"), Ao);
  a(MF, "wn");
  a(_F, "_n");
  a(PF, "xn");
  a(HF, "bn");
  a(zF, "Nn");
  a(OF, "On");
  a(NF, "Sn");
  a(km, "Kt");
  a(gg, "Jt");
  a(Lm, "qt");
  a(Tm, "Xt");
  a(Im, "Bn");
  a(Vc, "pt");
  a(Bm, "Qt");
  a($F, "hi");
  VF = (Fo = class extends hr {
    constructor(t) {
      super(t), this._choices = _F(t.choices.map((r) => r && typeof r == "object" ? r : { value: r }), "value");
    }
    expected({ descriptor: t }) {
      let r = Array.from(this._choices.keys()).map((i) => this._choices.get(i)).filter(({ hidden: i }) => !i).map((i) => i.value).sort(OF).map(
      t.value), n = r.slice(0, -2), o = r.slice(-2);
      return { text: n.concat(o.join(" or ")).join(", "), list: { title: "one of the following values", values: r } };
    }
    validate(t) {
      return this._choices.has(t);
    }
    deprecated(t) {
      let r = this._choices.get(t);
      return r && r.deprecated ? { value: t } : !1;
    }
    forward(t) {
      let r = this._choices.get(t);
      return r ? r.forward : void 0;
    }
    redirect(t) {
      let r = this._choices.get(t);
      return r ? r.redirect : void 0;
    }
  }, a(Fo, "Ft"), Fo), jF = (ko = class extends hr {
    expected() {
      return "a number";
    }
    validate(t, r) {
      return typeof t == "number";
    }
  }, a(ko, "mt"), ko), WF = (Lo = class extends jF {
    expected() {
      return "an integer";
    }
    validate(t, r) {
      return r.normalizeValidateResult(super.validate(t, r), t) === !0 && zF(t);
    }
  }, a(Lo, "ht"), Lo), Mm = (To = class extends hr {
    expected() {
      return "a string";
    }
    validate(t) {
      return typeof t == "string";
    }
  }, a(To, "je"), To), qF = vo, UF = mg, GF = RF, YF = EF, XF = (Io = class {
    constructor(t, r) {
      let { logger: n = console, loggerPrintWidth: o = 80, descriptor: i = qF, unknown: l = UF, invalid: u = GF, deprecated: c = YF, missing: p = /* @__PURE__ */ a(
      () => !1, "D"), required: d = /* @__PURE__ */ a(() => !1, "l"), preprocess: h = /* @__PURE__ */ a((g) => g, "p"), postprocess: f = /* @__PURE__ */ a(
      () => cl, "f") } = r || {};
      this._utils = { descriptor: i, logger: n || { warn: /* @__PURE__ */ a(() => {
      }, "warn") }, loggerPrintWidth: o, schemas: MF(t, "name"), normalizeDefaultResult: km, normalizeExpectedResult: gg, normalizeDeprecatedResult: Tm,
      normalizeForwardResult: Vc, normalizeRedirectResult: Bm, normalizeValidateResult: Lm }, this._unknownHandler = l, this._invalidHandler =
      NF(u), this._deprecatedHandler = c, this._identifyMissing = (g, w) => !(g in w) || p(g, w), this._identifyRequired = d, this._preprocess =
      h, this._postprocess = f, this.cleanHistory();
    }
    cleanHistory() {
      this._hasDeprecationWarned = PF();
    }
    normalize(t) {
      let r = {}, n = [this._preprocess(t, this._utils)], o = /* @__PURE__ */ a(() => {
        for (; n.length !== 0; ) {
          let i = n.shift(), l = this._applyNormalization(i, r);
          n.push(...l);
        }
      }, "i");
      o();
      for (let i of Object.keys(this._utils.schemas)) {
        let l = this._utils.schemas[i];
        if (!(i in r)) {
          let u = km(l.default(this._utils));
          "value" in u && n.push({ [i]: u.value });
        }
      }
      o();
      for (let i of Object.keys(this._utils.schemas)) {
        if (!(i in r)) continue;
        let l = this._utils.schemas[i], u = r[i], c = l.postprocess(u, this._utils);
        c !== cl && (this._applyValidation(c, i, l), r[i] = c);
      }
      return this._applyPostprocess(r), this._applyRequiredCheck(r), r;
    }
    _applyNormalization(t, r) {
      let n = [], { knownKeys: o, unknownKeys: i } = this._partitionOptionKeys(t);
      for (let l of o) {
        let u = this._utils.schemas[l], c = u.preprocess(t[l], this._utils);
        this._applyValidation(c, l, u);
        let p = /* @__PURE__ */ a(({ from: f, to: g }) => {
          n.push(typeof g == "string" ? { [g]: f } : { [g.key]: g.value });
        }, "D"), d = /* @__PURE__ */ a(({ value: f, redirectTo: g }) => {
          let w = Tm(u.deprecated(f, this._utils), c, !0);
          if (w !== !1) if (w === !0) this._hasDeprecationWarned(l) || this._utils.logger.warn(this._deprecatedHandler(l, g, this._utils));
          else for (let { value: m } of w) {
            let v = { key: l, value: m };
            if (!this._hasDeprecationWarned(v)) {
              let y = typeof g == "string" ? { key: g, value: m } : g;
              this._utils.logger.warn(this._deprecatedHandler(v, y, this._utils));
            }
          }
        }, "l");
        Vc(u.forward(c, this._utils), c).forEach(p);
        let h = Bm(u.redirect(c, this._utils), c);
        if (h.redirect.forEach(p), "remain" in h) {
          let f = h.remain;
          r[l] = l in r ? u.overlap(r[l], f, this._utils) : f, d({ value: f });
        }
        for (let { from: f, to: g } of h.redirect) d({ value: f, redirectTo: g });
      }
      for (let l of i) {
        let u = t[l];
        this._applyUnknownHandler(l, u, r, (c, p) => {
          n.push({ [c]: p });
        });
      }
      return n;
    }
    _applyRequiredCheck(t) {
      for (let r of Object.keys(this._utils.schemas)) if (this._identifyMissing(r, t) && this._identifyRequired(r)) throw this._invalidHandler(
      r, dg, this._utils);
    }
    _partitionOptionKeys(t) {
      let [r, n] = HF(Object.keys(t).filter((o) => !this._identifyMissing(o, t)), (o) => o in this._utils.schemas);
      return { knownKeys: r, unknownKeys: n };
    }
    _applyValidation(t, r, n) {
      let o = Lm(n.validate(t, this._utils), t);
      if (o !== !0) throw this._invalidHandler(r, o.value, this._utils);
    }
    _applyUnknownHandler(t, r, n, o) {
      let i = this._unknownHandler(t, r, this._utils);
      if (i) for (let l of Object.keys(i)) {
        if (this._identifyMissing(l, i)) continue;
        let u = i[l];
        l in this._utils.schemas ? o(l, u) : n[l] = u;
      }
    }
    _applyPostprocess(t) {
      let r = this._postprocess(t, this._utils);
      if (r !== cl) {
        if (r.delete) for (let n of r.delete) delete t[n];
        if (r.override) {
          let { knownKeys: n, unknownKeys: o } = this._partitionOptionKeys(r.override);
          for (let i of n) {
            let l = r.override[i];
            this._applyValidation(l, i, this._utils.schemas[i]), t[i] = l;
          }
          for (let i of o) {
            let l = r.override[i];
            this._applyUnknownHandler(i, l, t, (u, c) => {
              let p = this._utils.schemas[u];
              this._applyValidation(c, u, p), t[u] = c;
            });
          }
        }
      }
    }
  }, a(Io, "Et"), Io);
  a(ZF, "Ci");
  a(KF, "gi");
  a(JF, "yi");
  QF = ZF, ek = /* @__PURE__ */ a((e, t, r) => {
    if (!(e && t == null)) {
      if (t.findLast) return t.findLast(r);
      for (let n = t.length - 1; n >= 0; n--) {
        let o = t[n];
        if (r(o, n, t)) return o;
      }
    }
  }, "Ai"), vg = ek;
  a(wg, "tr");
  a(tk, "Rn");
  a(bg, "Ct");
  a(yg, "rr");
  a(rk, "Yn");
  _m = { astFormat: "estree", printer: {}, originalText: void 0, locStart: null, locEnd: null };
  a(nk, "vi");
  _o = nk, ok = hl(QS(), 1);
  a(ak, "xi");
  a(ik, "bi");
  ja = ak;
  a(lk, "Mn");
  a(sk, "Ni");
  a(uk, "Oi");
  ck = uk;
  a(xl, "He");
  a(Pm, "Vn");
  a(Dg, "ur");
  a(pk, "Si");
  dk = pk;
  a(fk, "Ti");
  hk = fk, mk = /* @__PURE__ */ a((e, t, r) => {
    if (!(e && t == null)) {
      if (t.findLastIndex) return t.findLastIndex(r);
      for (let n = t.length - 1; n >= 0; n--) {
        let o = t[n];
        if (r(o, n, t)) return n;
      }
      return -1;
    }
  }, "ki"), gk = mk, vk = /* @__PURE__ */ a(({ parser: e }) => e === "json" || e === "json5" || e === "jsonc" || e === "json-stringify", "Li");
  a(wk, "Pi");
  a(Hm, "Jn");
  a(bk, "Ii");
  a(jc, "ir");
  a(yk, "Ri");
  xg = /* @__PURE__ */ new Set(["JsonRoot", "ObjectExpression", "ArrayExpression", "StringLiteral", "NumericLiteral", "BooleanLiteral", "Nul\
lLiteral", "UnaryExpression", "TemplateLiteral"]), Dk = /* @__PURE__ */ new Set(["OperationDefinition", "FragmentDefinition", "VariableDefin\
ition", "TypeExtensionDefinition", "ObjectTypeDefinition", "FieldDefinition", "DirectiveDefinition", "EnumTypeDefinition", "EnumValueDefinit\
ion", "InputValueDefinition", "InputObjectTypeDefinition", "SchemaDefinition", "OperationTypeDefinition", "InterfaceTypeDefinition", "UnionT\
ypeDefinition", "ScalarTypeDefinition"]);
  a(zm, "qn");
  a(xk, "Qn");
  Cg = "\uFEFF", Om = Symbol("cursor");
  a(Eg, "nu");
  a(Ck, "ji");
  a(Tc, "or");
  a(Nm, "eu");
  a(Rg, "uu");
  a($m, "tu");
  a(Sg, "sr");
  a(Ek, "iu");
  a(Rk, "ou");
  a(Sk, "su");
  a(Ak, "au");
  a(Fk, "Du");
  Ag = {};
  qc(Ag, { builders: /* @__PURE__ */ a(() => kk, "builders"), printer: /* @__PURE__ */ a(() => Lk, "printer"), utils: /* @__PURE__ */ a(() => Tk,
  "utils") });
  kk = { join: Qm, line: Km, softline: CA, hardline: Gr, literalline: Jm, group: Xm, conditionalGroup: vA, fill: wA, lineSuffix: Pc, lineSuffixBoundary: DA,
  cursor: Ur, breakParent: vl, ifBreak: bA, trim: xA, indent: fl, indentIfBreak: yA, align: Mo, addAlignmentToDoc: eg, markAsRoot: mA, dedentToRoot: hA,
  dedent: gA, hardlineWithoutBreakParent: Kc, literallineWithoutBreakParent: Zm, label: EA, concat: /* @__PURE__ */ a((e) => e, "concat") },
  Lk = { printDocToString: bl }, Tk = { willBreak: MA, traverseDoc: Xc, findInDoc: Qc, mapDoc: wl, removeLines: HA, stripTrailingHardline: tg,
  replaceEndOfLine: NA, canBreak: VA }, Ik = "3.4.2", Fg = {};
  qc(Fg, { addDanglingComment: /* @__PURE__ */ a(() => Wr, "addDanglingComment"), addLeadingComment: /* @__PURE__ */ a(() => mo, "addLeading\
Comment"), addTrailingComment: /* @__PURE__ */ a(() => go, "addTrailingComment"), getAlignmentSize: /* @__PURE__ */ a(() => e0, "getAlignmen\
tSize"), getIndentSize: /* @__PURE__ */ a(() => zk, "getIndentSize"), getMaxContinuousCount: /* @__PURE__ */ a(() => $k, "getMaxContinuousCo\
unt"), getNextNonSpaceNonCommentCharacter: /* @__PURE__ */ a(() => jk, "getNextNonSpaceNonCommentCharacter"), getNextNonSpaceNonCommentCharacterIndex: /* @__PURE__ */ a(
  () => Qk, "getNextNonSpaceNonCommentCharacterIndex"), getPreferredQuote: /* @__PURE__ */ a(() => qk, "getPreferredQuote"), getStringWidth: /* @__PURE__ */ a(
  () => Jc, "getStringWidth"), hasNewline: /* @__PURE__ */ a(() => dr, "hasNewline"), hasNewlineInRange: /* @__PURE__ */ a(() => Gk, "hasNew\
lineInRange"), hasSpaces: /* @__PURE__ */ a(() => Xk, "hasSpaces"), isNextLineEmpty: /* @__PURE__ */ a(() => nL, "isNextLineEmpty"), isNextLineEmptyAfterIndex: /* @__PURE__ */ a(
  () => l0, "isNextLineEmptyAfterIndex"), isPreviousLineEmpty: /* @__PURE__ */ a(() => tL, "isPreviousLineEmpty"), makeString: /* @__PURE__ */ a(
  () => Kk, "makeString"), skip: /* @__PURE__ */ a(() => Va, "skip"), skipEverythingButNewLine: /* @__PURE__ */ a(() => ag, "skipEverythingB\
utNewLine"), skipInlineComment: /* @__PURE__ */ a(() => o0, "skipInlineComment"), skipNewline: /* @__PURE__ */ a(() => Yr, "skipNewline"), skipSpaces: /* @__PURE__ */ a(
  () => fr, "skipSpaces"), skipToLineEnd: /* @__PURE__ */ a(() => og, "skipToLineEnd"), skipTrailingComment: /* @__PURE__ */ a(() => a0, "sk\
ipTrailingComment"), skipWhitespace: /* @__PURE__ */ a(() => JA, "skipWhitespace") });
  a(Bk, "Ui");
  o0 = Bk;
  a(Mk, "Vi");
  a0 = Mk;
  a(_k, "zi");
  i0 = _k;
  a(Pk, "Gi");
  l0 = Pk;
  a(Hk, "Ki");
  zk = Hk;
  a(Ok, "Dr");
  a(Nk, "Ji");
  $k = Nk;
  a(Vk, "qi");
  jk = Vk, ll = "'", Vm = '"';
  a(Wk, "Xi");
  qk = Wk;
  a(Uk, "Qi");
  Gk = Uk;
  a(Yk, "Zi");
  Xk = Yk;
  a(Zk, "eo");
  Kk = Zk;
  a(Jk, "to");
  a(Qk, "ro");
  a(eL, "no");
  a(tL, "uo");
  a(rL, "io");
  a(nL, "oo");
  a(qr, "de");
  kg = qr(Sg);
  a(Lg, "gu");
  a(oL, "so");
  aL = qr(pg, 0), iL = { parse: qr(Ek), formatAST: qr(Rk), formatDoc: qr(Sk), printToDoc: qr(Ak), printDocToString: qr(Fk) }, Tg = qm;
});

// ../node_modules/ts-dedent/esm/index.js
function Bg(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t[r - 1] = arguments[r];
  var n = Array.from(typeof e == "string" ? [e] : e);
  n[n.length - 1] = n[n.length - 1].replace(/\r?\n([\t ]*)$/, "");
  var o = n.reduce(function(u, c) {
    var p = c.match(/\n([\t ]+|(?!\s).)/g);
    return p ? u.concat(p.map(function(d) {
      var h, f;
      return (f = (h = d.match(/[\t ]/g)) === null || h === void 0 ? void 0 : h.length) !== null && f !== void 0 ? f : 0;
    })) : u;
  }, []);
  if (o.length) {
    var i = new RegExp(`
[	 ]{` + Math.min.apply(Math, o) + "}", "g");
    n = n.map(function(u) {
      return u.replace(i, `
`);
    });
  }
  n[0] = n[0].replace(/^\r?\n/, "");
  var l = n[0];
  return t.forEach(function(u, c) {
    var p = l.match(/(?:^|\n)( *)$/), d = p ? p[1] : "", h = u;
    typeof u == "string" && u.includes(`
`) && (h = String(u).split(`
`).map(function(f, g) {
      return g === 0 ? f : "" + d + f;
    }).join(`
`)), l += h + n[c + 1];
  }), l;
}
var Mg = S(() => {
  a(Bg, "dedent");
});

// src/components/components/syntaxhighlighter/formatter.ts
var Pg = {};
gn(Pg, {
  formatter: () => lL
});
var _g, lL, Hg = S(() => {
  "use strict";
  _g = Ce(da(), 1);
  pm();
  Ig();
  Mg();
  lL = (0, _g.default)(2)(async (e, t) => e === !1 ? t : e === "dedent" || e === !0 ? Bg(t) : (await Tg.format(t, {
    parser: e,
    plugins: [cm],
    htmlWhitespaceSensitivity: "ignore"
  })).trim());
});

// ../node_modules/react-popper/lib/esm/utils.js
import * as $l from "react";
var m1, g1, Cv = S(() => {
  m1 = /* @__PURE__ */ a(function(t) {
    return t.reduce(function(r, n) {
      var o = n[0], i = n[1];
      return r[o] = i, r;
    }, {});
  }, "fromEntries"), g1 = typeof window < "u" && window.document && window.document.createElement ? $l.useLayoutEffect : $l.useEffect;
});

// ../node_modules/@popperjs/core/lib/enums.js
var oe, he, ue, ie, Vl, wr, Zt, on, Ev, jl, Uo, Rv, v1, Wl, eB, tB, rB, nB, oB, aB, iB, lB, sB, Sv, Xe = S(() => {
  oe = "top", he = "bottom", ue = "right", ie = "left", Vl = "auto", wr = [oe, he, ue, ie], Zt = "start", on = "end", Ev = "clippingParents",
  jl = "viewport", Uo = "popper", Rv = "reference", v1 = /* @__PURE__ */ wr.reduce(function(e, t) {
    return e.concat([t + "-" + Zt, t + "-" + on]);
  }, []), Wl = /* @__PURE__ */ [].concat(wr, [Vl]).reduce(function(e, t) {
    return e.concat([t, t + "-" + Zt, t + "-" + on]);
  }, []), eB = "beforeRead", tB = "read", rB = "afterRead", nB = "beforeMain", oB = "main", aB = "afterMain", iB = "beforeWrite", lB = "writ\
e", sB = "afterWrite", Sv = [eB, tB, rB, nB, oB, aB, iB, lB, sB];
});

// ../node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
function ye(e) {
  return e ? (e.nodeName || "").toLowerCase() : null;
}
var br = S(() => {
  a(ye, "getNodeName");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getWindow.js
function Q(e) {
  if (e == null)
    return window;
  if (e.toString() !== "[object Window]") {
    var t = e.ownerDocument;
    return t && t.defaultView || window;
  }
  return e;
}
var wt = S(() => {
  a(Q, "getWindow");
});

// ../node_modules/@popperjs/core/lib/dom-utils/instanceOf.js
function it(e) {
  var t = Q(e).Element;
  return e instanceof t || e instanceof Element;
}
function me(e) {
  var t = Q(e).HTMLElement;
  return e instanceof t || e instanceof HTMLElement;
}
function Go(e) {
  if (typeof ShadowRoot > "u")
    return !1;
  var t = Q(e).ShadowRoot;
  return e instanceof t || e instanceof ShadowRoot;
}
var Ze = S(() => {
  wt();
  a(it, "isElement");
  a(me, "isHTMLElement");
  a(Go, "isShadowRoot");
});

// ../node_modules/@popperjs/core/lib/modifiers/applyStyles.js
function uB(e) {
  var t = e.state;
  Object.keys(t.elements).forEach(function(r) {
    var n = t.styles[r] || {}, o = t.attributes[r] || {}, i = t.elements[r];
    !me(i) || !ye(i) || (Object.assign(i.style, n), Object.keys(o).forEach(function(l) {
      var u = o[l];
      u === !1 ? i.removeAttribute(l) : i.setAttribute(l, u === !0 ? "" : u);
    }));
  });
}
function cB(e) {
  var t = e.state, r = {
    popper: {
      position: t.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  return Object.assign(t.elements.popper.style, r.popper), t.styles = r, t.elements.arrow && Object.assign(t.elements.arrow.style, r.arrow),
  function() {
    Object.keys(t.elements).forEach(function(n) {
      var o = t.elements[n], i = t.attributes[n] || {}, l = Object.keys(t.styles.hasOwnProperty(n) ? t.styles[n] : r[n]), u = l.reduce(function(c, p) {
        return c[p] = "", c;
      }, {});
      !me(o) || !ye(o) || (Object.assign(o.style, u), Object.keys(i).forEach(function(c) {
        o.removeAttribute(c);
      }));
    });
  };
}
var Av, Fv = S(() => {
  br();
  Ze();
  a(uB, "applyStyles");
  a(cB, "effect");
  Av = {
    name: "applyStyles",
    enabled: !0,
    phase: "write",
    fn: uB,
    effect: cB,
    requires: ["computeStyles"]
  };
});

// ../node_modules/@popperjs/core/lib/utils/getBasePlacement.js
function De(e) {
  return e.split("-")[0];
}
var yr = S(() => {
  a(De, "getBasePlacement");
});

// ../node_modules/@popperjs/core/lib/utils/math.js
var bt, an, Kt, Dr = S(() => {
  bt = Math.max, an = Math.min, Kt = Math.round;
});

// ../node_modules/@popperjs/core/lib/utils/userAgent.js
function Yo() {
  var e = navigator.userAgentData;
  return e != null && e.brands && Array.isArray(e.brands) ? e.brands.map(function(t) {
    return t.brand + "/" + t.version;
  }).join(" ") : navigator.userAgent;
}
var w1 = S(() => {
  a(Yo, "getUAString");
});

// ../node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js
function Xa() {
  return !/^((?!chrome|android).)*safari/i.test(Yo());
}
var b1 = S(() => {
  w1();
  a(Xa, "isLayoutViewport");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js
function lt(e, t, r) {
  t === void 0 && (t = !1), r === void 0 && (r = !1);
  var n = e.getBoundingClientRect(), o = 1, i = 1;
  t && me(e) && (o = e.offsetWidth > 0 && Kt(n.width) / e.offsetWidth || 1, i = e.offsetHeight > 0 && Kt(n.height) / e.offsetHeight || 1);
  var l = it(e) ? Q(e) : window, u = l.visualViewport, c = !Xa() && r, p = (n.left + (c && u ? u.offsetLeft : 0)) / o, d = (n.top + (c && u ?
  u.offsetTop : 0)) / i, h = n.width / o, f = n.height / i;
  return {
    width: h,
    height: f,
    top: d,
    right: p + h,
    bottom: d + f,
    left: p,
    x: p,
    y: d
  };
}
var Xo = S(() => {
  Ze();
  Dr();
  wt();
  b1();
  a(lt, "getBoundingClientRect");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
function ln(e) {
  var t = lt(e), r = e.offsetWidth, n = e.offsetHeight;
  return Math.abs(t.width - r) <= 1 && (r = t.width), Math.abs(t.height - n) <= 1 && (n = t.height), {
    x: e.offsetLeft,
    y: e.offsetTop,
    width: r,
    height: n
  };
}
var ql = S(() => {
  Xo();
  a(ln, "getLayoutRect");
});

// ../node_modules/@popperjs/core/lib/dom-utils/contains.js
function Za(e, t) {
  var r = t.getRootNode && t.getRootNode();
  if (e.contains(t))
    return !0;
  if (r && Go(r)) {
    var n = t;
    do {
      if (n && e.isSameNode(n))
        return !0;
      n = n.parentNode || n.host;
    } while (n);
  }
  return !1;
}
var y1 = S(() => {
  Ze();
  a(Za, "contains");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js
function Me(e) {
  return Q(e).getComputedStyle(e);
}
var Zo = S(() => {
  wt();
  a(Me, "getComputedStyle");
});

// ../node_modules/@popperjs/core/lib/dom-utils/isTableElement.js
function D1(e) {
  return ["table", "td", "th"].indexOf(ye(e)) >= 0;
}
var kv = S(() => {
  br();
  a(D1, "isTableElement");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js
function Se(e) {
  return ((it(e) ? e.ownerDocument : (
    // $FlowFixMe[prop-missing]
    e.document
  )) || window.document).documentElement;
}
var Jt = S(() => {
  Ze();
  a(Se, "getDocumentElement");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getParentNode.js
function Qt(e) {
  return ye(e) === "html" ? e : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    e.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    e.parentNode || // DOM Element detected
    (Go(e) ? e.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    Se(e)
  );
}
var Ka = S(() => {
  br();
  Jt();
  Ze();
  a(Qt, "getParentNode");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js
function Lv(e) {
  return !me(e) || // https://github.com/popperjs/popper-core/issues/837
  Me(e).position === "fixed" ? null : e.offsetParent;
}
function pB(e) {
  var t = /firefox/i.test(Yo()), r = /Trident/i.test(Yo());
  if (r && me(e)) {
    var n = Me(e);
    if (n.position === "fixed")
      return null;
  }
  var o = Qt(e);
  for (Go(o) && (o = o.host); me(o) && ["html", "body"].indexOf(ye(o)) < 0; ) {
    var i = Me(o);
    if (i.transform !== "none" || i.perspective !== "none" || i.contain === "paint" || ["transform", "perspective"].indexOf(i.willChange) !==
    -1 || t && i.willChange === "filter" || t && i.filter && i.filter !== "none")
      return o;
    o = o.parentNode;
  }
  return null;
}
function yt(e) {
  for (var t = Q(e), r = Lv(e); r && D1(r) && Me(r).position === "static"; )
    r = Lv(r);
  return r && (ye(r) === "html" || ye(r) === "body" && Me(r).position === "static") ? t : r || pB(e) || t;
}
var Ko = S(() => {
  wt();
  br();
  Zo();
  Ze();
  kv();
  Ka();
  w1();
  a(Lv, "getTrueOffsetParent");
  a(pB, "getContainingBlock");
  a(yt, "getOffsetParent");
});

// ../node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
function sn(e) {
  return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
}
var Ul = S(() => {
  a(sn, "getMainAxisFromPlacement");
});

// ../node_modules/@popperjs/core/lib/utils/within.js
function un(e, t, r) {
  return bt(e, an(t, r));
}
function Tv(e, t, r) {
  var n = un(e, t, r);
  return n > r ? r : n;
}
var x1 = S(() => {
  Dr();
  a(un, "within");
  a(Tv, "withinMaxClamp");
});

// ../node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
function Ja() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
var C1 = S(() => {
  a(Ja, "getFreshSideObject");
});

// ../node_modules/@popperjs/core/lib/utils/mergePaddingObject.js
function Qa(e) {
  return Object.assign({}, Ja(), e);
}
var E1 = S(() => {
  C1();
  a(Qa, "mergePaddingObject");
});

// ../node_modules/@popperjs/core/lib/utils/expandToHashMap.js
function ei(e, t) {
  return t.reduce(function(r, n) {
    return r[n] = e, r;
  }, {});
}
var R1 = S(() => {
  a(ei, "expandToHashMap");
});

// ../node_modules/@popperjs/core/lib/modifiers/arrow.js
function fB(e) {
  var t, r = e.state, n = e.name, o = e.options, i = r.elements.arrow, l = r.modifiersData.popperOffsets, u = De(r.placement), c = sn(u), p = [
  ie, ue].indexOf(u) >= 0, d = p ? "height" : "width";
  if (!(!i || !l)) {
    var h = dB(o.padding, r), f = ln(i), g = c === "y" ? oe : ie, w = c === "y" ? he : ue, m = r.rects.reference[d] + r.rects.reference[c] -
    l[c] - r.rects.popper[d], v = l[c] - r.rects.reference[c], y = yt(i), b = y ? c === "y" ? y.clientHeight || 0 : y.clientWidth || 0 : 0, D = m /
    2 - v / 2, x = h[g], C = b - f[d] - h[w], E = b / 2 - f[d] / 2 + D, R = un(x, E, C), F = c;
    r.modifiersData[n] = (t = {}, t[F] = R, t.centerOffset = R - E, t);
  }
}
function hB(e) {
  var t = e.state, r = e.options, n = r.element, o = n === void 0 ? "[data-popper-arrow]" : n;
  o != null && (typeof o == "string" && (o = t.elements.popper.querySelector(o), !o) || Za(t.elements.popper, o) && (t.elements.arrow = o));
}
var dB, Iv, Bv = S(() => {
  yr();
  ql();
  y1();
  Ko();
  Ul();
  x1();
  E1();
  R1();
  Xe();
  dB = /* @__PURE__ */ a(function(t, r) {
    return t = typeof t == "function" ? t(Object.assign({}, r.rects, {
      placement: r.placement
    })) : t, Qa(typeof t != "number" ? t : ei(t, wr));
  }, "toPaddingObject");
  a(fB, "arrow");
  a(hB, "effect");
  Iv = {
    name: "arrow",
    enabled: !0,
    phase: "main",
    fn: fB,
    effect: hB,
    requires: ["popperOffsets"],
    requiresIfExists: ["preventOverflow"]
  };
});

// ../node_modules/@popperjs/core/lib/utils/getVariation.js
function st(e) {
  return e.split("-")[1];
}
var Jo = S(() => {
  a(st, "getVariation");
});

// ../node_modules/@popperjs/core/lib/modifiers/computeStyles.js
function gB(e, t) {
  var r = e.x, n = e.y, o = t.devicePixelRatio || 1;
  return {
    x: Kt(r * o) / o || 0,
    y: Kt(n * o) / o || 0
  };
}
function Mv(e) {
  var t, r = e.popper, n = e.popperRect, o = e.placement, i = e.variation, l = e.offsets, u = e.position, c = e.gpuAcceleration, p = e.adaptive,
  d = e.roundOffsets, h = e.isFixed, f = l.x, g = f === void 0 ? 0 : f, w = l.y, m = w === void 0 ? 0 : w, v = typeof d == "function" ? d({
    x: g,
    y: m
  }) : {
    x: g,
    y: m
  };
  g = v.x, m = v.y;
  var y = l.hasOwnProperty("x"), b = l.hasOwnProperty("y"), D = ie, x = oe, C = window;
  if (p) {
    var E = yt(r), R = "clientHeight", F = "clientWidth";
    if (E === Q(r) && (E = Se(r), Me(E).position !== "static" && u === "absolute" && (R = "scrollHeight", F = "scrollWidth")), E = E, o === oe ||
    (o === ie || o === ue) && i === on) {
      x = he;
      var A = h && E === C && C.visualViewport ? C.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        E[R]
      );
      m -= A - n.height, m *= c ? 1 : -1;
    }
    if (o === ie || (o === oe || o === he) && i === on) {
      D = ue;
      var k = h && E === C && C.visualViewport ? C.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        E[F]
      );
      g -= k - n.width, g *= c ? 1 : -1;
    }
  }
  var B = Object.assign({
    position: u
  }, p && mB), j = d === !0 ? gB({
    x: g,
    y: m
  }, Q(r)) : {
    x: g,
    y: m
  };
  if (g = j.x, m = j.y, c) {
    var V;
    return Object.assign({}, B, (V = {}, V[x] = b ? "0" : "", V[D] = y ? "0" : "", V.transform = (C.devicePixelRatio || 1) <= 1 ? "translate\
(" + g + "px, " + m + "px)" : "translate3d(" + g + "px, " + m + "px, 0)", V));
  }
  return Object.assign({}, B, (t = {}, t[x] = b ? m + "px" : "", t[D] = y ? g + "px" : "", t.transform = "", t));
}
function vB(e) {
  var t = e.state, r = e.options, n = r.gpuAcceleration, o = n === void 0 ? !0 : n, i = r.adaptive, l = i === void 0 ? !0 : i, u = r.roundOffsets,
  c = u === void 0 ? !0 : u, p = {
    placement: De(t.placement),
    variation: st(t.placement),
    popper: t.elements.popper,
    popperRect: t.rects.popper,
    gpuAcceleration: o,
    isFixed: t.options.strategy === "fixed"
  };
  t.modifiersData.popperOffsets != null && (t.styles.popper = Object.assign({}, t.styles.popper, Mv(Object.assign({}, p, {
    offsets: t.modifiersData.popperOffsets,
    position: t.options.strategy,
    adaptive: l,
    roundOffsets: c
  })))), t.modifiersData.arrow != null && (t.styles.arrow = Object.assign({}, t.styles.arrow, Mv(Object.assign({}, p, {
    offsets: t.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: c
  })))), t.attributes.popper = Object.assign({}, t.attributes.popper, {
    "data-popper-placement": t.placement
  });
}
var mB, _v, Pv = S(() => {
  Xe();
  Ko();
  wt();
  Jt();
  Zo();
  yr();
  Jo();
  Dr();
  mB = {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto"
  };
  a(gB, "roundOffsetsByDPR");
  a(Mv, "mapToStyles");
  a(vB, "computeStyles");
  _v = {
    name: "computeStyles",
    enabled: !0,
    phase: "beforeWrite",
    fn: vB,
    data: {}
  };
});

// ../node_modules/@popperjs/core/lib/modifiers/eventListeners.js
function wB(e) {
  var t = e.state, r = e.instance, n = e.options, o = n.scroll, i = o === void 0 ? !0 : o, l = n.resize, u = l === void 0 ? !0 : l, c = Q(t.
  elements.popper), p = [].concat(t.scrollParents.reference, t.scrollParents.popper);
  return i && p.forEach(function(d) {
    d.addEventListener("scroll", r.update, Gl);
  }), u && c.addEventListener("resize", r.update, Gl), function() {
    i && p.forEach(function(d) {
      d.removeEventListener("scroll", r.update, Gl);
    }), u && c.removeEventListener("resize", r.update, Gl);
  };
}
var Gl, Hv, zv = S(() => {
  wt();
  Gl = {
    passive: !0
  };
  a(wB, "effect");
  Hv = {
    name: "eventListeners",
    enabled: !0,
    phase: "write",
    fn: /* @__PURE__ */ a(function() {
    }, "fn"),
    effect: wB,
    data: {}
  };
});

// ../node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
function Qo(e) {
  return e.replace(/left|right|bottom|top/g, function(t) {
    return bB[t];
  });
}
var bB, Ov = S(() => {
  bB = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  a(Qo, "getOppositePlacement");
});

// ../node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
function Yl(e) {
  return e.replace(/start|end/g, function(t) {
    return yB[t];
  });
}
var yB, Nv = S(() => {
  yB = {
    start: "end",
    end: "start"
  };
  a(Yl, "getOppositeVariationPlacement");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js
function cn(e) {
  var t = Q(e), r = t.pageXOffset, n = t.pageYOffset;
  return {
    scrollLeft: r,
    scrollTop: n
  };
}
var Xl = S(() => {
  wt();
  a(cn, "getWindowScroll");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js
function pn(e) {
  return lt(Se(e)).left + cn(e).scrollLeft;
}
var Zl = S(() => {
  Xo();
  Jt();
  Xl();
  a(pn, "getWindowScrollBarX");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js
function S1(e, t) {
  var r = Q(e), n = Se(e), o = r.visualViewport, i = n.clientWidth, l = n.clientHeight, u = 0, c = 0;
  if (o) {
    i = o.width, l = o.height;
    var p = Xa();
    (p || !p && t === "fixed") && (u = o.offsetLeft, c = o.offsetTop);
  }
  return {
    width: i,
    height: l,
    x: u + pn(e),
    y: c
  };
}
var $v = S(() => {
  wt();
  Jt();
  Zl();
  b1();
  a(S1, "getViewportRect");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js
function A1(e) {
  var t, r = Se(e), n = cn(e), o = (t = e.ownerDocument) == null ? void 0 : t.body, i = bt(r.scrollWidth, r.clientWidth, o ? o.scrollWidth :
  0, o ? o.clientWidth : 0), l = bt(r.scrollHeight, r.clientHeight, o ? o.scrollHeight : 0, o ? o.clientHeight : 0), u = -n.scrollLeft + pn(
  e), c = -n.scrollTop;
  return Me(o || r).direction === "rtl" && (u += bt(r.clientWidth, o ? o.clientWidth : 0) - i), {
    width: i,
    height: l,
    x: u,
    y: c
  };
}
var Vv = S(() => {
  Jt();
  Zo();
  Zl();
  Xl();
  Dr();
  a(A1, "getDocumentRect");
});

// ../node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js
function dn(e) {
  var t = Me(e), r = t.overflow, n = t.overflowX, o = t.overflowY;
  return /auto|scroll|overlay|hidden/.test(r + o + n);
}
var Kl = S(() => {
  Zo();
  a(dn, "isScrollParent");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js
function Jl(e) {
  return ["html", "body", "#document"].indexOf(ye(e)) >= 0 ? e.ownerDocument.body : me(e) && dn(e) ? e : Jl(Qt(e));
}
var jv = S(() => {
  Ka();
  Kl();
  br();
  Ze();
  a(Jl, "getScrollParent");
});

// ../node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js
function xr(e, t) {
  var r;
  t === void 0 && (t = []);
  var n = Jl(e), o = n === ((r = e.ownerDocument) == null ? void 0 : r.body), i = Q(n), l = o ? [i].concat(i.visualViewport || [], dn(n) ? n :
  []) : n, u = t.concat(l);
  return o ? u : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    u.concat(xr(Qt(l)))
  );
}
var F1 = S(() => {
  jv();
  Ka();
  wt();
  Kl();
  a(xr, "listScrollParents");
});

// ../node_modules/@popperjs/core/lib/utils/rectToClientRect.js
function ea(e) {
  return Object.assign({}, e, {
    left: e.x,
    top: e.y,
    right: e.x + e.width,
    bottom: e.y + e.height
  });
}
var k1 = S(() => {
  a(ea, "rectToClientRect");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js
function DB(e, t) {
  var r = lt(e, !1, t === "fixed");
  return r.top = r.top + e.clientTop, r.left = r.left + e.clientLeft, r.bottom = r.top + e.clientHeight, r.right = r.left + e.clientWidth, r.
  width = e.clientWidth, r.height = e.clientHeight, r.x = r.left, r.y = r.top, r;
}
function Wv(e, t, r) {
  return t === jl ? ea(S1(e, r)) : it(t) ? DB(t, r) : ea(A1(Se(e)));
}
function xB(e) {
  var t = xr(Qt(e)), r = ["absolute", "fixed"].indexOf(Me(e).position) >= 0, n = r && me(e) ? yt(e) : e;
  return it(n) ? t.filter(function(o) {
    return it(o) && Za(o, n) && ye(o) !== "body";
  }) : [];
}
function L1(e, t, r, n) {
  var o = t === "clippingParents" ? xB(e) : [].concat(t), i = [].concat(o, [r]), l = i[0], u = i.reduce(function(c, p) {
    var d = Wv(e, p, n);
    return c.top = bt(d.top, c.top), c.right = an(d.right, c.right), c.bottom = an(d.bottom, c.bottom), c.left = bt(d.left, c.left), c;
  }, Wv(e, l, n));
  return u.width = u.right - u.left, u.height = u.bottom - u.top, u.x = u.left, u.y = u.top, u;
}
var qv = S(() => {
  Xe();
  $v();
  Vv();
  F1();
  Ko();
  Jt();
  Zo();
  Ze();
  Xo();
  Ka();
  y1();
  br();
  k1();
  Dr();
  a(DB, "getInnerBoundingClientRect");
  a(Wv, "getClientRectFromMixedType");
  a(xB, "getClippingParents");
  a(L1, "getClippingRect");
});

// ../node_modules/@popperjs/core/lib/utils/computeOffsets.js
function ti(e) {
  var t = e.reference, r = e.element, n = e.placement, o = n ? De(n) : null, i = n ? st(n) : null, l = t.x + t.width / 2 - r.width / 2, u = t.
  y + t.height / 2 - r.height / 2, c;
  switch (o) {
    case oe:
      c = {
        x: l,
        y: t.y - r.height
      };
      break;
    case he:
      c = {
        x: l,
        y: t.y + t.height
      };
      break;
    case ue:
      c = {
        x: t.x + t.width,
        y: u
      };
      break;
    case ie:
      c = {
        x: t.x - r.width,
        y: u
      };
      break;
    default:
      c = {
        x: t.x,
        y: t.y
      };
  }
  var p = o ? sn(o) : null;
  if (p != null) {
    var d = p === "y" ? "height" : "width";
    switch (i) {
      case Zt:
        c[p] = c[p] - (t[d] / 2 - r[d] / 2);
        break;
      case on:
        c[p] = c[p] + (t[d] / 2 - r[d] / 2);
        break;
      default:
    }
  }
  return c;
}
var T1 = S(() => {
  yr();
  Jo();
  Ul();
  Xe();
  a(ti, "computeOffsets");
});

// ../node_modules/@popperjs/core/lib/utils/detectOverflow.js
function Dt(e, t) {
  t === void 0 && (t = {});
  var r = t, n = r.placement, o = n === void 0 ? e.placement : n, i = r.strategy, l = i === void 0 ? e.strategy : i, u = r.boundary, c = u ===
  void 0 ? Ev : u, p = r.rootBoundary, d = p === void 0 ? jl : p, h = r.elementContext, f = h === void 0 ? Uo : h, g = r.altBoundary, w = g ===
  void 0 ? !1 : g, m = r.padding, v = m === void 0 ? 0 : m, y = Qa(typeof v != "number" ? v : ei(v, wr)), b = f === Uo ? Rv : Uo, D = e.rects.
  popper, x = e.elements[w ? b : f], C = L1(it(x) ? x : x.contextElement || Se(e.elements.popper), c, d, l), E = lt(e.elements.reference), R = ti(
  {
    reference: E,
    element: D,
    strategy: "absolute",
    placement: o
  }), F = ea(Object.assign({}, D, R)), A = f === Uo ? F : E, k = {
    top: C.top - A.top + y.top,
    bottom: A.bottom - C.bottom + y.bottom,
    left: C.left - A.left + y.left,
    right: A.right - C.right + y.right
  }, B = e.modifiersData.offset;
  if (f === Uo && B) {
    var j = B[o];
    Object.keys(k).forEach(function(V) {
      var ee = [ue, he].indexOf(V) >= 0 ? 1 : -1, I = [oe, he].indexOf(V) >= 0 ? "y" : "x";
      k[V] += j[I] * ee;
    });
  }
  return k;
}
var ri = S(() => {
  qv();
  Jt();
  Xo();
  T1();
  k1();
  Xe();
  Ze();
  E1();
  R1();
  a(Dt, "detectOverflow");
});

// ../node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js
function I1(e, t) {
  t === void 0 && (t = {});
  var r = t, n = r.placement, o = r.boundary, i = r.rootBoundary, l = r.padding, u = r.flipVariations, c = r.allowedAutoPlacements, p = c ===
  void 0 ? Wl : c, d = st(n), h = d ? u ? v1 : v1.filter(function(w) {
    return st(w) === d;
  }) : wr, f = h.filter(function(w) {
    return p.indexOf(w) >= 0;
  });
  f.length === 0 && (f = h);
  var g = f.reduce(function(w, m) {
    return w[m] = Dt(e, {
      placement: m,
      boundary: o,
      rootBoundary: i,
      padding: l
    })[De(m)], w;
  }, {});
  return Object.keys(g).sort(function(w, m) {
    return g[w] - g[m];
  });
}
var Uv = S(() => {
  Jo();
  Xe();
  ri();
  yr();
  a(I1, "computeAutoPlacement");
});

// ../node_modules/@popperjs/core/lib/modifiers/flip.js
function CB(e) {
  if (De(e) === Vl)
    return [];
  var t = Qo(e);
  return [Yl(e), t, Yl(t)];
}
function EB(e) {
  var t = e.state, r = e.options, n = e.name;
  if (!t.modifiersData[n]._skip) {
    for (var o = r.mainAxis, i = o === void 0 ? !0 : o, l = r.altAxis, u = l === void 0 ? !0 : l, c = r.fallbackPlacements, p = r.padding, d = r.
    boundary, h = r.rootBoundary, f = r.altBoundary, g = r.flipVariations, w = g === void 0 ? !0 : g, m = r.allowedAutoPlacements, v = t.options.
    placement, y = De(v), b = y === v, D = c || (b || !w ? [Qo(v)] : CB(v)), x = [v].concat(D).reduce(function(xe, ge) {
      return xe.concat(De(ge) === Vl ? I1(t, {
        placement: ge,
        boundary: d,
        rootBoundary: h,
        padding: p,
        flipVariations: w,
        allowedAutoPlacements: m
      }) : ge);
    }, []), C = t.rects.reference, E = t.rects.popper, R = /* @__PURE__ */ new Map(), F = !0, A = x[0], k = 0; k < x.length; k++) {
      var B = x[k], j = De(B), V = st(B) === Zt, ee = [oe, he].indexOf(j) >= 0, I = ee ? "width" : "height", T = Dt(t, {
        placement: B,
        boundary: d,
        rootBoundary: h,
        altBoundary: f,
        padding: p
      }), P = ee ? V ? ue : ie : V ? he : oe;
      C[I] > E[I] && (P = Qo(P));
      var q = Qo(P), $ = [];
      if (i && $.push(T[j] <= 0), u && $.push(T[P] <= 0, T[q] <= 0), $.every(function(xe) {
        return xe;
      })) {
        A = B, F = !1;
        break;
      }
      R.set(B, $);
    }
    if (F)
      for (var U = w ? 3 : 1, H = /* @__PURE__ */ a(function(ge) {
        var Ae = x.find(function(Pe) {
          var He = R.get(Pe);
          if (He)
            return He.slice(0, ge).every(function(ia) {
              return ia;
            });
        });
        if (Ae)
          return A = Ae, "break";
      }, "_loop"), X = U; X > 0; X--) {
        var _e = H(X);
        if (_e === "break") break;
      }
    t.placement !== A && (t.modifiersData[n]._skip = !0, t.placement = A, t.reset = !0);
  }
}
var Gv, Yv = S(() => {
  Ov();
  yr();
  Nv();
  ri();
  Uv();
  Xe();
  Jo();
  a(CB, "getExpandedFallbackPlacements");
  a(EB, "flip");
  Gv = {
    name: "flip",
    enabled: !0,
    phase: "main",
    fn: EB,
    requiresIfExists: ["offset"],
    data: {
      _skip: !1
    }
  };
});

// ../node_modules/@popperjs/core/lib/modifiers/hide.js
function Xv(e, t, r) {
  return r === void 0 && (r = {
    x: 0,
    y: 0
  }), {
    top: e.top - t.height - r.y,
    right: e.right - t.width + r.x,
    bottom: e.bottom - t.height + r.y,
    left: e.left - t.width - r.x
  };
}
function Zv(e) {
  return [oe, ue, he, ie].some(function(t) {
    return e[t] >= 0;
  });
}
function RB(e) {
  var t = e.state, r = e.name, n = t.rects.reference, o = t.rects.popper, i = t.modifiersData.preventOverflow, l = Dt(t, {
    elementContext: "reference"
  }), u = Dt(t, {
    altBoundary: !0
  }), c = Xv(l, n), p = Xv(u, o, i), d = Zv(c), h = Zv(p);
  t.modifiersData[r] = {
    referenceClippingOffsets: c,
    popperEscapeOffsets: p,
    isReferenceHidden: d,
    hasPopperEscaped: h
  }, t.attributes.popper = Object.assign({}, t.attributes.popper, {
    "data-popper-reference-hidden": d,
    "data-popper-escaped": h
  });
}
var Kv, Jv = S(() => {
  Xe();
  ri();
  a(Xv, "getSideOffsets");
  a(Zv, "isAnySideFullyClipped");
  a(RB, "hide");
  Kv = {
    name: "hide",
    enabled: !0,
    phase: "main",
    requiresIfExists: ["preventOverflow"],
    fn: RB
  };
});

// ../node_modules/@popperjs/core/lib/modifiers/offset.js
function SB(e, t, r) {
  var n = De(e), o = [ie, oe].indexOf(n) >= 0 ? -1 : 1, i = typeof r == "function" ? r(Object.assign({}, t, {
    placement: e
  })) : r, l = i[0], u = i[1];
  return l = l || 0, u = (u || 0) * o, [ie, ue].indexOf(n) >= 0 ? {
    x: u,
    y: l
  } : {
    x: l,
    y: u
  };
}
function AB(e) {
  var t = e.state, r = e.options, n = e.name, o = r.offset, i = o === void 0 ? [0, 0] : o, l = Wl.reduce(function(d, h) {
    return d[h] = SB(h, t.rects, i), d;
  }, {}), u = l[t.placement], c = u.x, p = u.y;
  t.modifiersData.popperOffsets != null && (t.modifiersData.popperOffsets.x += c, t.modifiersData.popperOffsets.y += p), t.modifiersData[n] =
  l;
}
var Qv, e3 = S(() => {
  yr();
  Xe();
  a(SB, "distanceAndSkiddingToXY");
  a(AB, "offset");
  Qv = {
    name: "offset",
    enabled: !0,
    phase: "main",
    requires: ["popperOffsets"],
    fn: AB
  };
});

// ../node_modules/@popperjs/core/lib/modifiers/popperOffsets.js
function FB(e) {
  var t = e.state, r = e.name;
  t.modifiersData[r] = ti({
    reference: t.rects.reference,
    element: t.rects.popper,
    strategy: "absolute",
    placement: t.placement
  });
}
var t3, r3 = S(() => {
  T1();
  a(FB, "popperOffsets");
  t3 = {
    name: "popperOffsets",
    enabled: !0,
    phase: "read",
    fn: FB,
    data: {}
  };
});

// ../node_modules/@popperjs/core/lib/utils/getAltAxis.js
function B1(e) {
  return e === "x" ? "y" : "x";
}
var n3 = S(() => {
  a(B1, "getAltAxis");
});

// ../node_modules/@popperjs/core/lib/modifiers/preventOverflow.js
function kB(e) {
  var t = e.state, r = e.options, n = e.name, o = r.mainAxis, i = o === void 0 ? !0 : o, l = r.altAxis, u = l === void 0 ? !1 : l, c = r.boundary,
  p = r.rootBoundary, d = r.altBoundary, h = r.padding, f = r.tether, g = f === void 0 ? !0 : f, w = r.tetherOffset, m = w === void 0 ? 0 : w,
  v = Dt(t, {
    boundary: c,
    rootBoundary: p,
    padding: h,
    altBoundary: d
  }), y = De(t.placement), b = st(t.placement), D = !b, x = sn(y), C = B1(x), E = t.modifiersData.popperOffsets, R = t.rects.reference, F = t.
  rects.popper, A = typeof m == "function" ? m(Object.assign({}, t.rects, {
    placement: t.placement
  })) : m, k = typeof A == "number" ? {
    mainAxis: A,
    altAxis: A
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, A), B = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null, j = {
    x: 0,
    y: 0
  };
  if (E) {
    if (i) {
      var V, ee = x === "y" ? oe : ie, I = x === "y" ? he : ue, T = x === "y" ? "height" : "width", P = E[x], q = P + v[ee], $ = P - v[I], U = g ?
      -F[T] / 2 : 0, H = b === Zt ? R[T] : F[T], X = b === Zt ? -F[T] : -R[T], _e = t.elements.arrow, xe = g && _e ? ln(_e) : {
        width: 0,
        height: 0
      }, ge = t.modifiersData["arrow#persistent"] ? t.modifiersData["arrow#persistent"].padding : Ja(), Ae = ge[ee], Pe = ge[I], He = un(0, R[T],
      xe[T]), ia = D ? R[T] / 2 - U - He - Ae - k.mainAxis : H - He - Ae - k.mainAxis, la = D ? -R[T] / 2 + U + He + Pe + k.mainAxis : X + He +
      Pe + k.mainAxis, us = t.elements.arrow && yt(t.elements.arrow), K3 = us ? x === "y" ? us.clientTop || 0 : us.clientLeft || 0 : 0, cp = (V =
      B?.[x]) != null ? V : 0, J3 = P + ia - cp - K3, Q3 = P + la - cp, pp = un(g ? an(q, J3) : q, P, g ? bt($, Q3) : $);
      E[x] = pp, j[x] = pp - P;
    }
    if (u) {
      var dp, e7 = x === "x" ? oe : ie, t7 = x === "x" ? he : ue, Sr = E[C], li = C === "y" ? "height" : "width", fp = Sr + v[e7], hp = Sr -
      v[t7], cs = [oe, ie].indexOf(y) !== -1, mp = (dp = B?.[C]) != null ? dp : 0, gp = cs ? fp : Sr - R[li] - F[li] - mp + k.altAxis, vp = cs ?
      Sr + R[li] + F[li] - mp - k.altAxis : hp, wp = g && cs ? Tv(gp, Sr, vp) : un(g ? gp : fp, Sr, g ? vp : hp);
      E[C] = wp, j[C] = wp - Sr;
    }
    t.modifiersData[n] = j;
  }
}
var o3, a3 = S(() => {
  Xe();
  yr();
  Ul();
  n3();
  x1();
  ql();
  Ko();
  ri();
  Jo();
  C1();
  Dr();
  a(kB, "preventOverflow");
  o3 = {
    name: "preventOverflow",
    enabled: !0,
    phase: "main",
    fn: kB,
    requiresIfExists: ["offset"]
  };
});

// ../node_modules/@popperjs/core/lib/modifiers/index.js
var M1 = S(() => {
});

// ../node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
function _1(e) {
  return {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  };
}
var i3 = S(() => {
  a(_1, "getHTMLElementScroll");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js
function P1(e) {
  return e === Q(e) || !me(e) ? cn(e) : _1(e);
}
var l3 = S(() => {
  Xl();
  wt();
  Ze();
  i3();
  a(P1, "getNodeScroll");
});

// ../node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js
function LB(e) {
  var t = e.getBoundingClientRect(), r = Kt(t.width) / e.offsetWidth || 1, n = Kt(t.height) / e.offsetHeight || 1;
  return r !== 1 || n !== 1;
}
function H1(e, t, r) {
  r === void 0 && (r = !1);
  var n = me(t), o = me(t) && LB(t), i = Se(t), l = lt(e, o, r), u = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = {
    x: 0,
    y: 0
  };
  return (n || !n && !r) && ((ye(t) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  dn(i)) && (u = P1(t)), me(t) ? (c = lt(t, !0), c.x += t.clientLeft, c.y += t.clientTop) : i && (c.x = pn(i))), {
    x: l.left + u.scrollLeft - c.x,
    y: l.top + u.scrollTop - c.y,
    width: l.width,
    height: l.height
  };
}
var s3 = S(() => {
  Xo();
  l3();
  br();
  Ze();
  Zl();
  Jt();
  Kl();
  Dr();
  a(LB, "isElementScaled");
  a(H1, "getCompositeRect");
});

// ../node_modules/@popperjs/core/lib/utils/orderModifiers.js
function TB(e) {
  var t = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), n = [];
  e.forEach(function(i) {
    t.set(i.name, i);
  });
  function o(i) {
    r.add(i.name);
    var l = [].concat(i.requires || [], i.requiresIfExists || []);
    l.forEach(function(u) {
      if (!r.has(u)) {
        var c = t.get(u);
        c && o(c);
      }
    }), n.push(i);
  }
  return a(o, "sort"), e.forEach(function(i) {
    r.has(i.name) || o(i);
  }), n;
}
function z1(e) {
  var t = TB(e);
  return Sv.reduce(function(r, n) {
    return r.concat(t.filter(function(o) {
      return o.phase === n;
    }));
  }, []);
}
var u3 = S(() => {
  Xe();
  a(TB, "order");
  a(z1, "orderModifiers");
});

// ../node_modules/@popperjs/core/lib/utils/debounce.js
function O1(e) {
  var t;
  return function() {
    return t || (t = new Promise(function(r) {
      Promise.resolve().then(function() {
        t = void 0, r(e());
      });
    })), t;
  };
}
var c3 = S(() => {
  a(O1, "debounce");
});

// ../node_modules/@popperjs/core/lib/utils/mergeByName.js
function N1(e) {
  var t = e.reduce(function(r, n) {
    var o = r[n.name];
    return r[n.name] = o ? Object.assign({}, o, n, {
      options: Object.assign({}, o.options, n.options),
      data: Object.assign({}, o.data, n.data)
    }) : n, r;
  }, {});
  return Object.keys(t).map(function(r) {
    return t[r];
  });
}
var p3 = S(() => {
  a(N1, "mergeByName");
});

// ../node_modules/@popperjs/core/lib/createPopper.js
function f3() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  return !t.some(function(n) {
    return !(n && typeof n.getBoundingClientRect == "function");
  });
}
function h3(e) {
  e === void 0 && (e = {});
  var t = e, r = t.defaultModifiers, n = r === void 0 ? [] : r, o = t.defaultOptions, i = o === void 0 ? d3 : o;
  return /* @__PURE__ */ a(function(u, c, p) {
    p === void 0 && (p = i);
    var d = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, d3, i),
      modifiersData: {},
      elements: {
        reference: u,
        popper: c
      },
      attributes: {},
      styles: {}
    }, h = [], f = !1, g = {
      state: d,
      setOptions: /* @__PURE__ */ a(function(y) {
        var b = typeof y == "function" ? y(d.options) : y;
        m(), d.options = Object.assign({}, i, d.options, b), d.scrollParents = {
          reference: it(u) ? xr(u) : u.contextElement ? xr(u.contextElement) : [],
          popper: xr(c)
        };
        var D = z1(N1([].concat(n, d.options.modifiers)));
        return d.orderedModifiers = D.filter(function(x) {
          return x.enabled;
        }), w(), g.update();
      }, "setOptions"),
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: /* @__PURE__ */ a(function() {
        if (!f) {
          var y = d.elements, b = y.reference, D = y.popper;
          if (f3(b, D)) {
            d.rects = {
              reference: H1(b, yt(D), d.options.strategy === "fixed"),
              popper: ln(D)
            }, d.reset = !1, d.placement = d.options.placement, d.orderedModifiers.forEach(function(k) {
              return d.modifiersData[k.name] = Object.assign({}, k.data);
            });
            for (var x = 0; x < d.orderedModifiers.length; x++) {
              if (d.reset === !0) {
                d.reset = !1, x = -1;
                continue;
              }
              var C = d.orderedModifiers[x], E = C.fn, R = C.options, F = R === void 0 ? {} : R, A = C.name;
              typeof E == "function" && (d = E({
                state: d,
                options: F,
                name: A,
                instance: g
              }) || d);
            }
          }
        }
      }, "forceUpdate"),
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: O1(function() {
        return new Promise(function(v) {
          g.forceUpdate(), v(d);
        });
      }),
      destroy: /* @__PURE__ */ a(function() {
        m(), f = !0;
      }, "destroy")
    };
    if (!f3(u, c))
      return g;
    g.setOptions(p).then(function(v) {
      !f && p.onFirstUpdate && p.onFirstUpdate(v);
    });
    function w() {
      d.orderedModifiers.forEach(function(v) {
        var y = v.name, b = v.options, D = b === void 0 ? {} : b, x = v.effect;
        if (typeof x == "function") {
          var C = x({
            state: d,
            name: y,
            instance: g,
            options: D
          }), E = /* @__PURE__ */ a(function() {
          }, "noopFn");
          h.push(C || E);
        }
      });
    }
    a(w, "runModifierEffects");
    function m() {
      h.forEach(function(v) {
        return v();
      }), h = [];
    }
    return a(m, "cleanupModifierEffects"), g;
  }, "createPopper");
}
var d3, m3 = S(() => {
  s3();
  ql();
  F1();
  Ko();
  u3();
  c3();
  p3();
  Ze();
  d3 = {
    placement: "bottom",
    modifiers: [],
    strategy: "absolute"
  };
  a(f3, "areValidElements");
  a(h3, "popperGenerator");
});

// ../node_modules/@popperjs/core/lib/popper.js
var IB, $1, g3 = S(() => {
  m3();
  zv();
  r3();
  Pv();
  Fv();
  e3();
  Yv();
  a3();
  Bv();
  Jv();
  M1();
  IB = [Hv, t3, _v, Av, Qv, Gv, o3, Iv, Kv], $1 = /* @__PURE__ */ h3({
    defaultModifiers: IB
  });
});

// ../node_modules/@popperjs/core/lib/index.js
var v3 = S(() => {
  Xe();
  M1();
  g3();
});

// ../node_modules/react-fast-compare/index.js
var b3 = M((iJ, w3) => {
  var BB = typeof Element < "u", MB = typeof Map == "function", _B = typeof Set == "function", PB = typeof ArrayBuffer == "function" && !!ArrayBuffer.
  isView;
  function Ql(e, t) {
    if (e === t) return !0;
    if (e && t && typeof e == "object" && typeof t == "object") {
      if (e.constructor !== t.constructor) return !1;
      var r, n, o;
      if (Array.isArray(e)) {
        if (r = e.length, r != t.length) return !1;
        for (n = r; n-- !== 0; )
          if (!Ql(e[n], t[n])) return !1;
        return !0;
      }
      var i;
      if (MB && e instanceof Map && t instanceof Map) {
        if (e.size !== t.size) return !1;
        for (i = e.entries(); !(n = i.next()).done; )
          if (!t.has(n.value[0])) return !1;
        for (i = e.entries(); !(n = i.next()).done; )
          if (!Ql(n.value[1], t.get(n.value[0]))) return !1;
        return !0;
      }
      if (_B && e instanceof Set && t instanceof Set) {
        if (e.size !== t.size) return !1;
        for (i = e.entries(); !(n = i.next()).done; )
          if (!t.has(n.value[0])) return !1;
        return !0;
      }
      if (PB && ArrayBuffer.isView(e) && ArrayBuffer.isView(t)) {
        if (r = e.length, r != t.length) return !1;
        for (n = r; n-- !== 0; )
          if (e[n] !== t[n]) return !1;
        return !0;
      }
      if (e.constructor === RegExp) return e.source === t.source && e.flags === t.flags;
      if (e.valueOf !== Object.prototype.valueOf && typeof e.valueOf == "function" && typeof t.valueOf == "function") return e.valueOf() ===
      t.valueOf();
      if (e.toString !== Object.prototype.toString && typeof e.toString == "function" && typeof t.toString == "function") return e.toString() ===
      t.toString();
      if (o = Object.keys(e), r = o.length, r !== Object.keys(t).length) return !1;
      for (n = r; n-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(t, o[n])) return !1;
      if (BB && e instanceof Element) return !1;
      for (n = r; n-- !== 0; )
        if (!((o[n] === "_owner" || o[n] === "__v" || o[n] === "__o") && e.$$typeof) && !Ql(e[o[n]], t[o[n]]))
          return !1;
      return !0;
    }
    return e !== e && t !== t;
  }
  a(Ql, "equal");
  w3.exports = /* @__PURE__ */ a(function(t, r) {
    try {
      return Ql(t, r);
    } catch (n) {
      if ((n.message || "").match(/stack|recursion/i))
        return console.warn("react-fast-compare cannot handle circular refs"), !1;
      throw n;
    }
  }, "isEqual");
});

// ../node_modules/react-popper/lib/esm/usePopper.js
import * as Cr from "react";
import * as y3 from "react-dom";
var D3, HB, V1, x3 = S(() => {
  v3();
  D3 = Ce(b3());
  Cv();
  HB = [], V1 = /* @__PURE__ */ a(function(t, r, n) {
    n === void 0 && (n = {});
    var o = Cr.useRef(null), i = {
      onFirstUpdate: n.onFirstUpdate,
      placement: n.placement || "bottom",
      strategy: n.strategy || "absolute",
      modifiers: n.modifiers || HB
    }, l = Cr.useState({
      styles: {
        popper: {
          position: i.strategy,
          left: "0",
          top: "0"
        },
        arrow: {
          position: "absolute"
        }
      },
      attributes: {}
    }), u = l[0], c = l[1], p = Cr.useMemo(function() {
      return {
        name: "updateState",
        enabled: !0,
        phase: "write",
        fn: /* @__PURE__ */ a(function(g) {
          var w = g.state, m = Object.keys(w.elements);
          y3.flushSync(function() {
            c({
              styles: m1(m.map(function(v) {
                return [v, w.styles[v] || {}];
              })),
              attributes: m1(m.map(function(v) {
                return [v, w.attributes[v]];
              }))
            });
          });
        }, "fn"),
        requires: ["computeStyles"]
      };
    }, []), d = Cr.useMemo(function() {
      var f = {
        onFirstUpdate: i.onFirstUpdate,
        placement: i.placement,
        strategy: i.strategy,
        modifiers: [].concat(i.modifiers, [p, {
          name: "applyStyles",
          enabled: !1
        }])
      };
      return (0, D3.default)(o.current, f) ? o.current || f : (o.current = f, f);
    }, [i.onFirstUpdate, i.placement, i.strategy, i.modifiers, p]), h = Cr.useRef();
    return g1(function() {
      h.current && h.current.setOptions(d);
    }, [d]), g1(function() {
      if (!(t == null || r == null)) {
        var f = n.createPopper || $1, g = f(t, r, d);
        return h.current = g, function() {
          g.destroy(), h.current = null;
        };
      }
    }, [t, r, n.createPopper]), {
      state: h.current ? h.current.state : null,
      styles: u.styles,
      attributes: u.attributes,
      update: h.current ? h.current.update : null,
      forceUpdate: h.current ? h.current.forceUpdate : null
    };
  }, "usePopper");
});

// ../node_modules/react-popper/lib/esm/index.js
var C3 = S(() => {
  x3();
});

// ../node_modules/react-popper-tooltip/dist/esm/react-popper-tooltip.js
import * as W from "react";
function S3(e) {
  var t = W.useRef(e);
  return t.current = e, W.useCallback(function() {
    return t.current;
  }, []);
}
function OB(e) {
  var t = e.initial, r = e.value, n = e.onChange, o = n === void 0 ? zB : n;
  if (t === void 0 && r === void 0)
    throw new TypeError('Either "value" or "initial" variable must be set. Now both are undefined');
  var i = W.useState(t), l = i[0], u = i[1], c = S3(l), p = W.useCallback(function(h) {
    var f = c(), g = typeof h == "function" ? h(f) : h;
    typeof g.persist == "function" && g.persist(), u(g), typeof o == "function" && o(g);
  }, [c, o]), d = r !== void 0;
  return [d ? r : l, d ? o : p];
}
function A3(e, t) {
  return e === void 0 && (e = 0), t === void 0 && (t = 0), function() {
    return {
      width: 0,
      height: 0,
      top: t,
      right: e,
      bottom: t,
      left: e,
      x: 0,
      y: 0,
      toJSON: /* @__PURE__ */ a(function() {
        return null;
      }, "toJSON")
    };
  };
}
function F3(e, t) {
  var r, n, o;
  e === void 0 && (e = {}), t === void 0 && (t = {});
  var i = Object.keys(R3).reduce(function(I, T) {
    var P;
    return ve({}, I, (P = {}, P[T] = I[T] !== void 0 ? I[T] : R3[T], P));
  }, e), l = W.useMemo(
    function() {
      return [{
        name: "offset",
        options: {
          offset: i.offset
        }
      }];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Array.isArray(i.offset) ? i.offset : []
  ), u = ve({}, t, {
    placement: t.placement || i.placement,
    modifiers: t.modifiers || l
  }), c = W.useState(null), p = c[0], d = c[1], h = W.useState(null), f = h[0], g = h[1], w = OB({
    initial: i.defaultVisible,
    value: i.visible,
    onChange: i.onVisibleChange
  }), m = w[0], v = w[1], y = W.useRef();
  W.useEffect(function() {
    return function() {
      return clearTimeout(y.current);
    };
  }, []);
  var b = V1(i.followCursor ? E3 : p, f, u), D = b.styles, x = b.attributes, C = wn(b, NB), E = C.update, R = S3({
    visible: m,
    triggerRef: p,
    tooltipRef: f,
    finalConfig: i
  }), F = W.useCallback(
    function(I) {
      return Array.isArray(i.trigger) ? i.trigger.includes(I) : i.trigger === I;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Array.isArray(i.trigger) ? i.trigger : [i.trigger]
  ), A = W.useCallback(function() {
    clearTimeout(y.current), y.current = window.setTimeout(function() {
      return v(!1);
    }, i.delayHide);
  }, [i.delayHide, v]), k = W.useCallback(function() {
    clearTimeout(y.current), y.current = window.setTimeout(function() {
      return v(!0);
    }, i.delayShow);
  }, [i.delayShow, v]), B = W.useCallback(function() {
    R().visible ? A() : k();
  }, [R, A, k]);
  W.useEffect(function() {
    if (R().finalConfig.closeOnOutsideClick) {
      var I = /* @__PURE__ */ a(function(P) {
        var q, $ = R(), U = $.tooltipRef, H = $.triggerRef, X = (P.composedPath == null || (q = P.composedPath()) == null ? void 0 : q[0]) ||
        P.target;
        X instanceof Node && U != null && H != null && !U.contains(X) && !H.contains(X) && A();
      }, "handleClickOutside");
      return document.addEventListener("mousedown", I), function() {
        return document.removeEventListener("mousedown", I);
      };
    }
  }, [R, A]), W.useEffect(function() {
    if (!(p == null || !F("click")))
      return p.addEventListener("click", B), function() {
        return p.removeEventListener("click", B);
      };
  }, [p, F, B]), W.useEffect(function() {
    if (!(p == null || !F("double-click")))
      return p.addEventListener("dblclick", B), function() {
        return p.removeEventListener("dblclick", B);
      };
  }, [p, F, B]), W.useEffect(function() {
    if (!(p == null || !F("right-click"))) {
      var I = /* @__PURE__ */ a(function(P) {
        P.preventDefault(), B();
      }, "preventDefaultAndToggle");
      return p.addEventListener("contextmenu", I), function() {
        return p.removeEventListener("contextmenu", I);
      };
    }
  }, [p, F, B]), W.useEffect(function() {
    if (!(p == null || !F("focus")))
      return p.addEventListener("focus", k), p.addEventListener("blur", A), function() {
        p.removeEventListener("focus", k), p.removeEventListener("blur", A);
      };
  }, [p, F, k, A]), W.useEffect(function() {
    if (!(p == null || !F("hover")))
      return p.addEventListener("mouseenter", k), p.addEventListener("mouseleave", A), function() {
        p.removeEventListener("mouseenter", k), p.removeEventListener("mouseleave", A);
      };
  }, [p, F, k, A]), W.useEffect(function() {
    if (!(f == null || !F("hover") || !R().finalConfig.interactive))
      return f.addEventListener("mouseenter", k), f.addEventListener("mouseleave", A), function() {
        f.removeEventListener("mouseenter", k), f.removeEventListener("mouseleave", A);
      };
  }, [f, F, k, A, R]);
  var j = C == null || (r = C.state) == null || (n = r.modifiersData) == null || (o = n.hide) == null ? void 0 : o.isReferenceHidden;
  W.useEffect(function() {
    i.closeOnTriggerHidden && j && A();
  }, [i.closeOnTriggerHidden, A, j]), W.useEffect(function() {
    if (!i.followCursor || p == null) return;
    function I(T) {
      var P = T.clientX, q = T.clientY;
      E3.getBoundingClientRect = A3(P, q), E?.();
    }
    return a(I, "setMousePosition"), p.addEventListener("mousemove", I), function() {
      return p.removeEventListener("mousemove", I);
    };
  }, [i.followCursor, p, E]), W.useEffect(function() {
    if (!(f == null || E == null || i.mutationObserverOptions == null)) {
      var I = new MutationObserver(E);
      return I.observe(f, i.mutationObserverOptions), function() {
        return I.disconnect();
      };
    }
  }, [i.mutationObserverOptions, f, E]);
  var V = /* @__PURE__ */ a(function(T) {
    return T === void 0 && (T = {}), ve({}, T, {
      style: ve({}, T.style, D.popper)
    }, x.popper, {
      "data-popper-interactive": i.interactive
    });
  }, "getTooltipProps"), ee = /* @__PURE__ */ a(function(T) {
    return T === void 0 && (T = {}), ve({}, T, x.arrow, {
      style: ve({}, T.style, D.arrow),
      "data-popper-arrow": !0
    });
  }, "getArrowProps");
  return ve({
    getArrowProps: ee,
    getTooltipProps: V,
    setTooltipRef: g,
    setTriggerRef: d,
    tooltipRef: f,
    triggerRef: p,
    visible: m
  }, C);
}
var zB, NB, E3, R3, k3 = S(() => {
  hi();
  ua();
  C3();
  a(S3, "useGetLatest");
  zB = /* @__PURE__ */ a(function() {
  }, "noop");
  a(OB, "useControlledState");
  a(A3, "generateBoundingClientRect");
  NB = ["styles", "attributes"], E3 = {
    getBoundingClientRect: A3()
  }, R3 = {
    closeOnOutsideClick: !0,
    closeOnTriggerHidden: !1,
    defaultVisible: !1,
    delayHide: 0,
    delayShow: 0,
    followCursor: !1,
    interactive: !1,
    mutationObserverOptions: {
      attributes: !0,
      childList: !0,
      subtree: !0
    },
    offset: [0, 6],
    trigger: "hover"
  };
  a(F3, "usePopperTooltip");
});

// src/components/components/tooltip/Tooltip.tsx
import j1 from "react";
import { lighten as ni, styled as L3 } from "@storybook/core/theming";
var T3, ut, Er, $B, VB, W1, I3 = S(() => {
  "use strict";
  T3 = Ce(da(), 1), ut = (0, T3.default)(1e3)(
    (e, t, r, n = 0) => t.split("-")[0] === e ? r : n
  ), Er = 8, $B = L3.div(
    {
      position: "absolute",
      borderStyle: "solid"
    },
    ({ placement: e }) => {
      let t = 0, r = 0;
      switch (!0) {
        case (e.startsWith("left") || e.startsWith("right")): {
          r = 8;
          break;
        }
        case (e.startsWith("top") || e.startsWith("bottom")): {
          t = 8;
          break;
        }
        default:
      }
      return { transform: `translate3d(${t}px, ${r}px, 0px)` };
    },
    ({ theme: e, color: t, placement: r }) => ({
      bottom: `${ut("top", r, `${Er * -1}px`, "auto")}`,
      top: `${ut("bottom", r, `${Er * -1}px`, "auto")}`,
      right: `${ut("left", r, `${Er * -1}px`, "auto")}`,
      left: `${ut("right", r, `${Er * -1}px`, "auto")}`,
      borderBottomWidth: `${ut("top", r, "0", Er)}px`,
      borderTopWidth: `${ut("bottom", r, "0", Er)}px`,
      borderRightWidth: `${ut("left", r, "0", Er)}px`,
      borderLeftWidth: `${ut("right", r, "0", Er)}px`,
      borderTopColor: ut(
        "top",
        r,
        e.color[t] || t || e.base === "light" ? ni(e.background.app) : e.background.app,
        "transparent"
      ),
      borderBottomColor: ut(
        "bottom",
        r,
        e.color[t] || t || e.base === "light" ? ni(e.background.app) : e.background.app,
        "transparent"
      ),
      borderLeftColor: ut(
        "left",
        r,
        e.color[t] || t || e.base === "light" ? ni(e.background.app) : e.background.app,
        "transparent"
      ),
      borderRightColor: ut(
        "right",
        r,
        e.color[t] || t || e.base === "light" ? ni(e.background.app) : e.background.app,
        "transparent"
      )
    })
  ), VB = L3.div(
    ({ hidden: e }) => ({
      display: e ? "none" : "inline-block",
      zIndex: 2147483647
    }),
    ({ theme: e, color: t, hasChrome: r }) => r ? {
      background: t && e.color[t] || t || e.base === "light" ? ni(e.background.app) : e.background.app,
      filter: `
            drop-shadow(0px 5px 5px rgba(0,0,0,0.05))
            drop-shadow(0 1px 3px rgba(0,0,0,0.1))
          `,
      borderRadius: e.appBorderRadius + 2,
      fontSize: e.typography.size.s1
    } : {}
  ), W1 = j1.forwardRef(
    ({
      placement: e = "top",
      hasChrome: t = !0,
      children: r,
      arrowProps: n = {},
      tooltipRef: o,
      color: i,
      withArrows: l,
      ...u
    }, c) => /* @__PURE__ */ j1.createElement(VB, { "data-testid": "tooltip", hasChrome: t, ref: c, ...u, color: i }, t && l && /* @__PURE__ */ j1.
    createElement($B, { placement: e, ...n, color: i }), r)
  );
  W1.displayName = "Tooltip";
});

// src/components/components/tooltip/WithTooltip.tsx
var U1 = {};
gn(U1, {
  WithToolTipState: () => q1,
  WithTooltip: () => q1,
  WithTooltipPure: () => M3
});
import oi, { useCallback as jB, useEffect as WB, useState as qB } from "react";
import UB from "react-dom";
import { styled as B3 } from "@storybook/core/theming";
var es, GB, YB, M3, q1, ts = S(() => {
  "use strict";
  fi();
  k3();
  I3();
  ({ document: es } = vn), GB = B3.div`
  display: inline-block;
  cursor: ${(e) => (
    // @ts-expect-error (non strict)
    e.trigger === "hover" || e.trigger.includes("hover") ? "default" : "pointer"
  )};
`, YB = B3.g`
  cursor: ${(e) => (
    // @ts-expect-error (non strict)
    e.trigger === "hover" || e.trigger.includes("hover") ? "default" : "pointer"
  )};
`, M3 = /* @__PURE__ */ a(({
    svg: e = !1,
    trigger: t = "click",
    closeOnOutsideClick: r = !1,
    placement: n = "top",
    modifiers: o = [
      {
        name: "preventOverflow",
        options: {
          padding: 8
        }
      },
      {
        name: "offset",
        options: {
          offset: [8, 8]
        }
      },
      {
        name: "arrow",
        options: {
          padding: 8
        }
      }
    ],
    hasChrome: i = !0,
    defaultVisible: l = !1,
    withArrows: u,
    offset: c,
    tooltip: p,
    children: d,
    closeOnTriggerHidden: h,
    mutationObserverOptions: f,
    delayHide: g,
    visible: w,
    interactive: m,
    delayShow: v,
    strategy: y,
    followCursor: b,
    onVisibleChange: D,
    ...x
  }) => {
    let C = e ? YB : GB, {
      getArrowProps: E,
      getTooltipProps: R,
      setTooltipRef: F,
      setTriggerRef: A,
      visible: k,
      state: B
    } = F3(
      {
        trigger: t,
        placement: n,
        defaultVisible: l,
        delayHide: g,
        interactive: m,
        closeOnOutsideClick: r,
        closeOnTriggerHidden: h,
        onVisibleChange: D,
        delayShow: v,
        followCursor: b,
        mutationObserverOptions: f,
        visible: w,
        offset: c
      },
      {
        modifiers: o,
        strategy: y
      }
    ), j = k ? /* @__PURE__ */ oi.createElement(
      W1,
      {
        placement: B?.placement,
        ref: F,
        hasChrome: i,
        arrowProps: E(),
        withArrows: u,
        ...R()
      },
      typeof p == "function" ? p({ onHide: /* @__PURE__ */ a(() => D(!1), "onHide") }) : p
    ) : null;
    return /* @__PURE__ */ oi.createElement(oi.Fragment, null, /* @__PURE__ */ oi.createElement(C, { trigger: t, ref: A, ...x }, d), k && UB.
    createPortal(j, es.body));
  }, "WithTooltipPure"), q1 = /* @__PURE__ */ a(({
    startOpen: e = !1,
    onVisibleChange: t,
    ...r
  }) => {
    let [n, o] = qB(e), i = jB(
      (l) => {
        t && t(l) === !1 || o(l);
      },
      [t]
    );
    return WB(() => {
      let l = /* @__PURE__ */ a(() => i(!1), "hide");
      es.addEventListener("keydown", l, !1);
      let u = Array.from(es.getElementsByTagName("iframe")), c = [];
      return u.forEach((p) => {
        let d = /* @__PURE__ */ a(() => {
          try {
            p.contentWindow.document && (p.contentWindow.document.addEventListener("click", l), c.push(() => {
              try {
                p.contentWindow.document.removeEventListener("click", l);
              } catch {
              }
            }));
          } catch {
          }
        }, "bind");
        d(), p.addEventListener("load", d), c.push(() => {
          p.removeEventListener("load", d);
        });
      }), () => {
        es.removeEventListener("keydown", l), c.forEach((p) => {
          p();
        });
      };
    }), /* @__PURE__ */ oi.createElement(M3, { ...r, visible: n, onVisibleChange: i });
  }, "WithToolTipState");
});

// src/components/index.ts
import { createElement as P_, forwardRef as H_ } from "react";

// src/components/components/typography/components.tsx
import ne from "react";

// src/components/components/typography/DocumentFormatting.tsx
var te = /* @__PURE__ */ a(({ ...e }, t) => {
  let r = [e.class, e.className];
  return delete e.class, e.className = ["sbdocs", `sbdocs-${t}`, ...r].filter(Boolean).join(" "), e;
}, "nameSpaceClassNames");

// src/components/components/typography/ResetWrapper.tsx
import { styled as M7 } from "@storybook/core/theming";

// ../node_modules/polished/dist/polished.esm.js
ua();
yp();

// ../node_modules/@babel/runtime/helpers/esm/inheritsLoose.js
ui();
function Dp(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, tr(e, t);
}
a(Dp, "_inheritsLoose");

// ../node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js
xp();
ui();

// ../node_modules/@babel/runtime/helpers/esm/isNativeFunction.js
function Cp(e) {
  try {
    return Function.toString.call(e).indexOf("[native code]") !== -1;
  } catch {
    return typeof e == "function";
  }
}
a(Cp, "_isNativeFunction");

// ../node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js
function ps() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch {
  }
  return (ps = /* @__PURE__ */ a(function() {
    return !!e;
  }, "_isNativeReflectConstruct"))();
}
a(ps, "_isNativeReflectConstruct");

// ../node_modules/@babel/runtime/helpers/esm/construct.js
ui();
function Ep(e, t, r) {
  if (ps()) return Reflect.construct.apply(null, arguments);
  var n = [null];
  n.push.apply(n, t);
  var o = new (e.bind.apply(e, n))();
  return r && tr(o, r.prototype), o;
}
a(Ep, "_construct");

// ../node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js
function pi(e) {
  var t = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
  return pi = /* @__PURE__ */ a(function(n) {
    if (n === null || !Cp(n)) return n;
    if (typeof n != "function") throw new TypeError("Super expression must either be null or a function");
    if (t !== void 0) {
      if (t.has(n)) return t.get(n);
      t.set(n, o);
    }
    function o() {
      return Ep(n, arguments, ci(this).constructor);
    }
    return a(o, "Wrapper"), o.prototype = Object.create(n.prototype, {
      constructor: {
        value: o,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), tr(o, n);
  }, "_wrapNativeSuper"), pi(e);
}
a(pi, "_wrapNativeSuper");

// ../node_modules/polished/dist/polished.esm.js
var s7 = {
  1: `Passed invalid arguments to hsl, please pass multiple numbers e.g. hsl(360, 0.75, 0.4) or an object e.g. rgb({ hue: 255, saturation: 0\
.4, lightness: 0.75 }).

`,
  2: `Passed invalid arguments to hsla, please pass multiple numbers e.g. hsla(360, 0.75, 0.4, 0.7) or an object e.g. rgb({ hue: 255, satura\
tion: 0.4, lightness: 0.75, alpha: 0.7 }).

`,
  3: `Passed an incorrect argument to a color function, please pass a string representation of a color.

`,
  4: `Couldn't generate valid rgb string from %s, it returned %s.

`,
  5: `Couldn't parse the color string. Please provide the color as a string in hex, rgb, rgba, hsl or hsla notation.

`,
  6: `Passed invalid arguments to rgb, please pass multiple numbers e.g. rgb(255, 205, 100) or an object e.g. rgb({ red: 255, green: 205, bl\
ue: 100 }).

`,
  7: `Passed invalid arguments to rgba, please pass multiple numbers e.g. rgb(255, 205, 100, 0.75) or an object e.g. rgb({ red: 255, green: \
205, blue: 100, alpha: 0.75 }).

`,
  8: `Passed invalid argument to toColorString, please pass a RgbColor, RgbaColor, HslColor or HslaColor object.

`,
  9: `Please provide a number of steps to the modularScale helper.

`,
  10: `Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,
  11: `Invalid value passed as base to modularScale, expected number or em string but got "%s"

`,
  12: `Expected a string ending in "px" or a number passed as the first argument to %s(), got "%s" instead.

`,
  13: `Expected a string ending in "px" or a number passed as the second argument to %s(), got "%s" instead.

`,
  14: `Passed invalid pixel value ("%s") to %s(), please pass a value like "12px" or 12.

`,
  15: `Passed invalid base value ("%s") to %s(), please pass a value like "12px" or 12.

`,
  16: `You must provide a template to this method.

`,
  17: `You passed an unsupported selector state to this method.

`,
  18: `minScreen and maxScreen must be provided as stringified numbers with the same units.

`,
  19: `fromSize and toSize must be provided as stringified numbers with the same units.

`,
  20: `expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,
  21: "expects the objects in the first argument array to have the properties `prop`, `fromSize`, and `toSize`.\n\n",
  22: "expects the first argument object to have the properties `prop`, `fromSize`, and `toSize`.\n\n",
  23: `fontFace expects a name of a font-family.

`,
  24: `fontFace expects either the path to the font file(s) or a name of a local copy.

`,
  25: `fontFace expects localFonts to be an array.

`,
  26: `fontFace expects fileFormats to be an array.

`,
  27: `radialGradient requries at least 2 color-stops to properly render.

`,
  28: `Please supply a filename to retinaImage() as the first argument.

`,
  29: `Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,
  30: "Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",
  31: `The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation

`,
  32: `To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])
To pass a single animation please supply them in simple values, e.g. animation('rotate', '2s')

`,
  33: `The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation

`,
  34: `borderRadius expects a radius value as a string or number as the second argument.

`,
  35: `borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,
  36: `Property must be a string value.

`,
  37: `Syntax Error at %s.

`,
  38: `Formula contains a function that needs parentheses at %s.

`,
  39: `Formula is missing closing parenthesis at %s.

`,
  40: `Formula has too many closing parentheses at %s.

`,
  41: `All values in a formula must have the same unit or be unitless.

`,
  42: `Please provide a number of steps to the modularScale helper.

`,
  43: `Please pass a number or one of the predefined scales to the modularScale helper as the ratio.

`,
  44: `Invalid value passed as base to modularScale, expected number or em/rem string but got %s.

`,
  45: `Passed invalid argument to hslToColorString, please pass a HslColor or HslaColor object.

`,
  46: `Passed invalid argument to rgbToColorString, please pass a RgbColor or RgbaColor object.

`,
  47: `minScreen and maxScreen must be provided as stringified numbers with the same units.

`,
  48: `fromSize and toSize must be provided as stringified numbers with the same units.

`,
  49: `Expects either an array of objects or a single object with the properties prop, fromSize, and toSize.

`,
  50: `Expects the objects in the first argument array to have the properties prop, fromSize, and toSize.

`,
  51: `Expects the first argument object to have the properties prop, fromSize, and toSize.

`,
  52: `fontFace expects either the path to the font file(s) or a name of a local copy.

`,
  53: `fontFace expects localFonts to be an array.

`,
  54: `fontFace expects fileFormats to be an array.

`,
  55: `fontFace expects a name of a font-family.

`,
  56: `linearGradient requries at least 2 color-stops to properly render.

`,
  57: `radialGradient requries at least 2 color-stops to properly render.

`,
  58: `Please supply a filename to retinaImage() as the first argument.

`,
  59: `Passed invalid argument to triangle, please pass correct pointingDirection e.g. 'right'.

`,
  60: "Passed an invalid value to `height` or `width`. Please provide a pixel based unit.\n\n",
  61: `Property must be a string value.

`,
  62: `borderRadius expects a radius value as a string or number as the second argument.

`,
  63: `borderRadius expects one of "top", "bottom", "left" or "right" as the first argument.

`,
  64: `The animation shorthand only takes 8 arguments. See the specification for more information: http://mdn.io/animation.

`,
  65: `To pass multiple animations please supply them in arrays, e.g. animation(['rotate', '2s'], ['move', '1s'])\\nTo pass a single animatio\
n please supply them in simple values, e.g. animation('rotate', '2s').

`,
  66: `The animation shorthand arrays can only have 8 elements. See the specification for more information: http://mdn.io/animation.

`,
  67: `You must provide a template to this method.

`,
  68: `You passed an unsupported selector state to this method.

`,
  69: `Expected a string ending in "px" or a number passed as the first argument to %s(), got %s instead.

`,
  70: `Expected a string ending in "px" or a number passed as the second argument to %s(), got %s instead.

`,
  71: `Passed invalid pixel value %s to %s(), please pass a value like "12px" or 12.

`,
  72: `Passed invalid base value %s to %s(), please pass a value like "12px" or 12.

`,
  73: `Please provide a valid CSS variable.

`,
  74: `CSS variable not found and no default was provided.

`,
  75: `important requires a valid style object, got a %s instead.

`,
  76: `fromSize and toSize must be provided as stringified numbers with the same units as minScreen and maxScreen.

`,
  77: `remToPx expects a value in "rem" but you provided it in "%s".

`,
  78: `base must be set in "px" or "%" but you set it in "%s".
`
};
function u7() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  var n = t[0], o = [], i;
  for (i = 1; i < t.length; i += 1)
    o.push(t[i]);
  return o.forEach(function(l) {
    n = n.replace(/%[a-z]/, l);
  }), n;
}
a(u7, "format");
var Ct = /* @__PURE__ */ function(e) {
  Dp(t, e);
  function t(r) {
    for (var n, o = arguments.length, i = new Array(o > 1 ? o - 1 : 0), l = 1; l < o; l++)
      i[l - 1] = arguments[l];
    return n = e.call(this, u7.apply(void 0, [s7[r]].concat(i))) || this, bp(n);
  }
  return a(t, "PolishedError"), t;
}(/* @__PURE__ */ pi(Error));
function ds(e) {
  return Math.round(e * 255);
}
a(ds, "colorToInt");
function c7(e, t, r) {
  return ds(e) + "," + ds(t) + "," + ds(r);
}
a(c7, "convertToInt");
function ca(e, t, r, n) {
  if (n === void 0 && (n = c7), t === 0)
    return n(r, r, r);
  var o = (e % 360 + 360) % 360 / 60, i = (1 - Math.abs(2 * r - 1)) * t, l = i * (1 - Math.abs(o % 2 - 1)), u = 0, c = 0, p = 0;
  o >= 0 && o < 1 ? (u = i, c = l) : o >= 1 && o < 2 ? (u = l, c = i) : o >= 2 && o < 3 ? (c = i, p = l) : o >= 3 && o < 4 ? (c = l, p = i) :
  o >= 4 && o < 5 ? (u = l, p = i) : o >= 5 && o < 6 && (u = i, p = l);
  var d = r - i / 2, h = u + d, f = c + d, g = p + d;
  return n(h, f, g);
}
a(ca, "hslToRgb");
var Rp = {
  aliceblue: "f0f8ff",
  antiquewhite: "faebd7",
  aqua: "00ffff",
  aquamarine: "7fffd4",
  azure: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "000",
  blanchedalmond: "ffebcd",
  blue: "0000ff",
  blueviolet: "8a2be2",
  brown: "a52a2a",
  burlywood: "deb887",
  cadetblue: "5f9ea0",
  chartreuse: "7fff00",
  chocolate: "d2691e",
  coral: "ff7f50",
  cornflowerblue: "6495ed",
  cornsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "00ffff",
  darkblue: "00008b",
  darkcyan: "008b8b",
  darkgoldenrod: "b8860b",
  darkgray: "a9a9a9",
  darkgreen: "006400",
  darkgrey: "a9a9a9",
  darkkhaki: "bdb76b",
  darkmagenta: "8b008b",
  darkolivegreen: "556b2f",
  darkorange: "ff8c00",
  darkorchid: "9932cc",
  darkred: "8b0000",
  darksalmon: "e9967a",
  darkseagreen: "8fbc8f",
  darkslateblue: "483d8b",
  darkslategray: "2f4f4f",
  darkslategrey: "2f4f4f",
  darkturquoise: "00ced1",
  darkviolet: "9400d3",
  deeppink: "ff1493",
  deepskyblue: "00bfff",
  dimgray: "696969",
  dimgrey: "696969",
  dodgerblue: "1e90ff",
  firebrick: "b22222",
  floralwhite: "fffaf0",
  forestgreen: "228b22",
  fuchsia: "ff00ff",
  gainsboro: "dcdcdc",
  ghostwhite: "f8f8ff",
  gold: "ffd700",
  goldenrod: "daa520",
  gray: "808080",
  green: "008000",
  greenyellow: "adff2f",
  grey: "808080",
  honeydew: "f0fff0",
  hotpink: "ff69b4",
  indianred: "cd5c5c",
  indigo: "4b0082",
  ivory: "fffff0",
  khaki: "f0e68c",
  lavender: "e6e6fa",
  lavenderblush: "fff0f5",
  lawngreen: "7cfc00",
  lemonchiffon: "fffacd",
  lightblue: "add8e6",
  lightcoral: "f08080",
  lightcyan: "e0ffff",
  lightgoldenrodyellow: "fafad2",
  lightgray: "d3d3d3",
  lightgreen: "90ee90",
  lightgrey: "d3d3d3",
  lightpink: "ffb6c1",
  lightsalmon: "ffa07a",
  lightseagreen: "20b2aa",
  lightskyblue: "87cefa",
  lightslategray: "789",
  lightslategrey: "789",
  lightsteelblue: "b0c4de",
  lightyellow: "ffffe0",
  lime: "0f0",
  limegreen: "32cd32",
  linen: "faf0e6",
  magenta: "f0f",
  maroon: "800000",
  mediumaquamarine: "66cdaa",
  mediumblue: "0000cd",
  mediumorchid: "ba55d3",
  mediumpurple: "9370db",
  mediumseagreen: "3cb371",
  mediumslateblue: "7b68ee",
  mediumspringgreen: "00fa9a",
  mediumturquoise: "48d1cc",
  mediumvioletred: "c71585",
  midnightblue: "191970",
  mintcream: "f5fffa",
  mistyrose: "ffe4e1",
  moccasin: "ffe4b5",
  navajowhite: "ffdead",
  navy: "000080",
  oldlace: "fdf5e6",
  olive: "808000",
  olivedrab: "6b8e23",
  orange: "ffa500",
  orangered: "ff4500",
  orchid: "da70d6",
  palegoldenrod: "eee8aa",
  palegreen: "98fb98",
  paleturquoise: "afeeee",
  palevioletred: "db7093",
  papayawhip: "ffefd5",
  peachpuff: "ffdab9",
  peru: "cd853f",
  pink: "ffc0cb",
  plum: "dda0dd",
  powderblue: "b0e0e6",
  purple: "800080",
  rebeccapurple: "639",
  red: "f00",
  rosybrown: "bc8f8f",
  royalblue: "4169e1",
  saddlebrown: "8b4513",
  salmon: "fa8072",
  sandybrown: "f4a460",
  seagreen: "2e8b57",
  seashell: "fff5ee",
  sienna: "a0522d",
  silver: "c0c0c0",
  skyblue: "87ceeb",
  slateblue: "6a5acd",
  slategray: "708090",
  slategrey: "708090",
  snow: "fffafa",
  springgreen: "00ff7f",
  steelblue: "4682b4",
  tan: "d2b48c",
  teal: "008080",
  thistle: "d8bfd8",
  tomato: "ff6347",
  turquoise: "40e0d0",
  violet: "ee82ee",
  wheat: "f5deb3",
  white: "fff",
  whitesmoke: "f5f5f5",
  yellow: "ff0",
  yellowgreen: "9acd32"
};
function p7(e) {
  if (typeof e != "string") return e;
  var t = e.toLowerCase();
  return Rp[t] ? "#" + Rp[t] : e;
}
a(p7, "nameToHex");
var d7 = /^#[a-fA-F0-9]{6}$/, f7 = /^#[a-fA-F0-9]{8}$/, h7 = /^#[a-fA-F0-9]{3}$/, m7 = /^#[a-fA-F0-9]{4}$/, fs = /^rgb\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*\)$/i,
g7 = /^rgb(?:a)?\(\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,)?\s*(\d{1,3})\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i, v7 = /^hsl\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*\)$/i,
w7 = /^hsl(?:a)?\(\s*(\d{0,3}[.]?[0-9]+(?:deg)?)\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,)?\s*(\d{1,3}[.]?[0-9]?)%\s*(?:,|\/)\s*([-+]?\d*[.]?\d+[%]?)\s*\)$/i;
function vs(e) {
  if (typeof e != "string")
    throw new Ct(3);
  var t = p7(e);
  if (t.match(d7))
    return {
      red: parseInt("" + t[1] + t[2], 16),
      green: parseInt("" + t[3] + t[4], 16),
      blue: parseInt("" + t[5] + t[6], 16)
    };
  if (t.match(f7)) {
    var r = parseFloat((parseInt("" + t[7] + t[8], 16) / 255).toFixed(2));
    return {
      red: parseInt("" + t[1] + t[2], 16),
      green: parseInt("" + t[3] + t[4], 16),
      blue: parseInt("" + t[5] + t[6], 16),
      alpha: r
    };
  }
  if (t.match(h7))
    return {
      red: parseInt("" + t[1] + t[1], 16),
      green: parseInt("" + t[2] + t[2], 16),
      blue: parseInt("" + t[3] + t[3], 16)
    };
  if (t.match(m7)) {
    var n = parseFloat((parseInt("" + t[4] + t[4], 16) / 255).toFixed(2));
    return {
      red: parseInt("" + t[1] + t[1], 16),
      green: parseInt("" + t[2] + t[2], 16),
      blue: parseInt("" + t[3] + t[3], 16),
      alpha: n
    };
  }
  var o = fs.exec(t);
  if (o)
    return {
      red: parseInt("" + o[1], 10),
      green: parseInt("" + o[2], 10),
      blue: parseInt("" + o[3], 10)
    };
  var i = g7.exec(t.substring(0, 50));
  if (i)
    return {
      red: parseInt("" + i[1], 10),
      green: parseInt("" + i[2], 10),
      blue: parseInt("" + i[3], 10),
      alpha: parseFloat("" + i[4]) > 1 ? parseFloat("" + i[4]) / 100 : parseFloat("" + i[4])
    };
  var l = v7.exec(t);
  if (l) {
    var u = parseInt("" + l[1], 10), c = parseInt("" + l[2], 10) / 100, p = parseInt("" + l[3], 10) / 100, d = "rgb(" + ca(u, c, p) + ")", h = fs.
    exec(d);
    if (!h)
      throw new Ct(4, t, d);
    return {
      red: parseInt("" + h[1], 10),
      green: parseInt("" + h[2], 10),
      blue: parseInt("" + h[3], 10)
    };
  }
  var f = w7.exec(t.substring(0, 50));
  if (f) {
    var g = parseInt("" + f[1], 10), w = parseInt("" + f[2], 10) / 100, m = parseInt("" + f[3], 10) / 100, v = "rgb(" + ca(g, w, m) + ")", y = fs.
    exec(v);
    if (!y)
      throw new Ct(4, t, v);
    return {
      red: parseInt("" + y[1], 10),
      green: parseInt("" + y[2], 10),
      blue: parseInt("" + y[3], 10),
      alpha: parseFloat("" + f[4]) > 1 ? parseFloat("" + f[4]) / 100 : parseFloat("" + f[4])
    };
  }
  throw new Ct(5);
}
a(vs, "parseToRgb");
function b7(e) {
  var t = e.red / 255, r = e.green / 255, n = e.blue / 255, o = Math.max(t, r, n), i = Math.min(t, r, n), l = (o + i) / 2;
  if (o === i)
    return e.alpha !== void 0 ? {
      hue: 0,
      saturation: 0,
      lightness: l,
      alpha: e.alpha
    } : {
      hue: 0,
      saturation: 0,
      lightness: l
    };
  var u, c = o - i, p = l > 0.5 ? c / (2 - o - i) : c / (o + i);
  switch (o) {
    case t:
      u = (r - n) / c + (r < n ? 6 : 0);
      break;
    case r:
      u = (n - t) / c + 2;
      break;
    default:
      u = (t - r) / c + 4;
      break;
  }
  return u *= 60, e.alpha !== void 0 ? {
    hue: u,
    saturation: p,
    lightness: l,
    alpha: e.alpha
  } : {
    hue: u,
    saturation: p,
    lightness: l
  };
}
a(b7, "rgbToHsl");
function Sp(e) {
  return b7(vs(e));
}
a(Sp, "parseToHsl");
var y7 = /* @__PURE__ */ a(function(t) {
  return t.length === 7 && t[1] === t[2] && t[3] === t[4] && t[5] === t[6] ? "#" + t[1] + t[3] + t[5] : t;
}, "reduceHexValue"), ms = y7;
function Ar(e) {
  var t = e.toString(16);
  return t.length === 1 ? "0" + t : t;
}
a(Ar, "numberToHex");
function hs(e) {
  return Ar(Math.round(e * 255));
}
a(hs, "colorToHex");
function D7(e, t, r) {
  return ms("#" + hs(e) + hs(t) + hs(r));
}
a(D7, "convertToHex");
function di(e, t, r) {
  return ca(e, t, r, D7);
}
a(di, "hslToHex");
function x7(e, t, r) {
  if (typeof e == "number" && typeof t == "number" && typeof r == "number")
    return di(e, t, r);
  if (typeof e == "object" && t === void 0 && r === void 0)
    return di(e.hue, e.saturation, e.lightness);
  throw new Ct(1);
}
a(x7, "hsl");
function C7(e, t, r, n) {
  if (typeof e == "number" && typeof t == "number" && typeof r == "number" && typeof n == "number")
    return n >= 1 ? di(e, t, r) : "rgba(" + ca(e, t, r) + "," + n + ")";
  if (typeof e == "object" && t === void 0 && r === void 0 && n === void 0)
    return e.alpha >= 1 ? di(e.hue, e.saturation, e.lightness) : "rgba(" + ca(e.hue, e.saturation, e.lightness) + "," + e.alpha + ")";
  throw new Ct(2);
}
a(C7, "hsla");
function gs(e, t, r) {
  if (typeof e == "number" && typeof t == "number" && typeof r == "number")
    return ms("#" + Ar(e) + Ar(t) + Ar(r));
  if (typeof e == "object" && t === void 0 && r === void 0)
    return ms("#" + Ar(e.red) + Ar(e.green) + Ar(e.blue));
  throw new Ct(6);
}
a(gs, "rgb");
function pa(e, t, r, n) {
  if (typeof e == "string" && typeof t == "number") {
    var o = vs(e);
    return "rgba(" + o.red + "," + o.green + "," + o.blue + "," + t + ")";
  } else {
    if (typeof e == "number" && typeof t == "number" && typeof r == "number" && typeof n == "number")
      return n >= 1 ? gs(e, t, r) : "rgba(" + e + "," + t + "," + r + "," + n + ")";
    if (typeof e == "object" && t === void 0 && r === void 0 && n === void 0)
      return e.alpha >= 1 ? gs(e.red, e.green, e.blue) : "rgba(" + e.red + "," + e.green + "," + e.blue + "," + e.alpha + ")";
  }
  throw new Ct(7);
}
a(pa, "rgba");
var E7 = /* @__PURE__ */ a(function(t) {
  return typeof t.red == "number" && typeof t.green == "number" && typeof t.blue == "number" && (typeof t.alpha != "number" || typeof t.alpha >
  "u");
}, "isRgb"), R7 = /* @__PURE__ */ a(function(t) {
  return typeof t.red == "number" && typeof t.green == "number" && typeof t.blue == "number" && typeof t.alpha == "number";
}, "isRgba"), S7 = /* @__PURE__ */ a(function(t) {
  return typeof t.hue == "number" && typeof t.saturation == "number" && typeof t.lightness == "number" && (typeof t.alpha != "number" || typeof t.
  alpha > "u");
}, "isHsl"), A7 = /* @__PURE__ */ a(function(t) {
  return typeof t.hue == "number" && typeof t.saturation == "number" && typeof t.lightness == "number" && typeof t.alpha == "number";
}, "isHsla");
function Ap(e) {
  if (typeof e != "object") throw new Ct(8);
  if (R7(e)) return pa(e);
  if (E7(e)) return gs(e);
  if (A7(e)) return C7(e);
  if (S7(e)) return x7(e);
  throw new Ct(8);
}
a(Ap, "toColorString");
function Fp(e, t, r) {
  return /* @__PURE__ */ a(function() {
    var o = r.concat(Array.prototype.slice.call(arguments));
    return o.length >= t ? e.apply(this, o) : Fp(e, t, o);
  }, "fn");
}
a(Fp, "curried");
function ws(e) {
  return Fp(e, e.length, []);
}
a(ws, "curry");
function bs(e, t, r) {
  return Math.max(e, Math.min(t, r));
}
a(bs, "guard");
function F7(e, t) {
  if (t === "transparent") return t;
  var r = Sp(t);
  return Ap(ve({}, r, {
    lightness: bs(0, 1, r.lightness - parseFloat(e))
  }));
}
a(F7, "darken");
var k7 = /* @__PURE__ */ ws(F7), rr = k7;
function L7(e, t) {
  if (t === "transparent") return t;
  var r = Sp(t);
  return Ap(ve({}, r, {
    lightness: bs(0, 1, r.lightness + parseFloat(e))
  }));
}
a(L7, "lighten");
var T7 = /* @__PURE__ */ ws(L7), ys = T7;
function I7(e, t) {
  if (t === "transparent") return t;
  var r = vs(t), n = typeof r.alpha == "number" ? r.alpha : 1, o = ve({}, r, {
    alpha: bs(0, 1, +(n * 100 - parseFloat(e) * 100).toFixed(2) / 100)
  });
  return pa(o);
}
a(I7, "transparentize");
var B7 = /* @__PURE__ */ ws(I7), Le = B7;

// src/components/components/typography/lib/common.tsx
var Ke = /* @__PURE__ */ a(({ theme: e }) => ({
  margin: "20px 0 8px",
  padding: 0,
  cursor: "text",
  position: "relative",
  color: e.color.defaultText,
  "&:first-of-type": {
    marginTop: 0,
    paddingTop: 0
  },
  "&:hover a.anchor": {
    textDecoration: "none"
  },
  "& tt, & code": {
    fontSize: "inherit"
  }
}), "headerCommon"), Pt = /* @__PURE__ */ a(({ theme: e }) => ({
  lineHeight: 1,
  margin: "0 2px",
  padding: "3px 5px",
  whiteSpace: "nowrap",
  borderRadius: 3,
  fontSize: e.typography.size.s2 - 1,
  border: e.base === "light" ? `1px solid ${e.color.mediumlight}` : `1px solid ${e.color.darker}`,
  color: e.base === "light" ? Le(0.1, e.color.defaultText) : Le(0.3, e.color.defaultText),
  backgroundColor: e.base === "light" ? e.color.lighter : e.color.border
}), "codeCommon"), N = /* @__PURE__ */ a(({ theme: e }) => ({
  fontFamily: e.typography.fonts.base,
  fontSize: e.typography.size.s3,
  margin: 0,
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
  WebkitOverflowScrolling: "touch"
}), "withReset"), ze = {
  margin: "16px 0"
};

// src/components/components/typography/ResetWrapper.tsx
var kp = M7.div(N);

// src/components/components/typography/elements/A.tsx
import { styled as P7 } from "@storybook/core/theming";

// src/components/components/typography/elements/Link.tsx
import _7 from "react";
var Lp = /* @__PURE__ */ a(({
  href: e = "",
  ...t
}) => {
  let n = /^\//.test(e) ? `./?path=${e}` : e, i = /^#.*/.test(e) ? "_self" : "_top";
  return /* @__PURE__ */ _7.createElement("a", { href: n, target: i, ...t });
}, "Link");

// src/components/components/typography/elements/A.tsx
var Ds = P7(Lp)(N, ({ theme: e }) => ({
  fontSize: "inherit",
  lineHeight: "24px",
  color: e.color.secondary,
  textDecoration: "none",
  "&.absent": {
    color: "#cc0000"
  },
  "&.anchor": {
    display: "block",
    paddingLeft: 30,
    marginLeft: -30,
    cursor: "pointer",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0
  }
}));

// src/components/components/typography/elements/Blockquote.tsx
import { styled as H7 } from "@storybook/core/theming";
var xs = H7.blockquote(N, ze, ({ theme: e }) => ({
  borderLeft: `4px solid ${e.color.medium}`,
  padding: "0 15px",
  color: e.color.dark,
  "& > :first-of-type": {
    marginTop: 0
  },
  "& > :last-child": {
    marginBottom: 0
  }
}));

// src/components/components/typography/elements/Code.tsx
xa();
import B2, { Children as Wb } from "react";
import { styled as M2 } from "@storybook/core/theming";

// src/components/components/typography/lib/isReactChildString.tsx
var I2 = /* @__PURE__ */ a((e) => typeof e == "string", "isReactChildString");

// src/components/components/typography/elements/Code.tsx
var qb = /[\n\r]/g, Ub = M2.code(
  ({ theme: e }) => ({
    // from reset
    fontFamily: e.typography.fonts.mono,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    display: "inline-block",
    paddingLeft: 2,
    paddingRight: 2,
    verticalAlign: "baseline",
    color: "inherit"
  }),
  Pt
), Gb = M2(Da)(({ theme: e }) => ({
  // DocBlocks-specific styling and overrides
  fontFamily: e.typography.fonts.mono,
  fontSize: `${e.typography.size.s2 - 1}px`,
  lineHeight: "19px",
  margin: "25px 0 40px",
  borderRadius: e.appBorderRadius,
  boxShadow: e.base === "light" ? "rgba(0, 0, 0, 0.10) 0 1px 3px 0" : "rgba(0, 0, 0, 0.20) 0 2px 5px 0",
  "pre.prismjs": {
    padding: 20,
    background: "inherit"
  }
})), Cu = /* @__PURE__ */ a(({
  className: e,
  children: t,
  ...r
}) => {
  let n = (e || "").match(/lang-(\S+)/), o = Wb.toArray(t);
  return o.filter(I2).some((l) => l.match(qb)) ? /* @__PURE__ */ B2.createElement(
    Gb,
    {
      bordered: !0,
      copyable: !0,
      language: n?.[1] ?? "text",
      format: !1,
      ...r
    },
    t
  ) : /* @__PURE__ */ B2.createElement(Ub, { ...r, className: e }, o);
}, "Code");

// src/components/components/typography/elements/DL.tsx
import { styled as Yb } from "@storybook/core/theming";
var Eu = Yb.dl(N, ze, {
  padding: 0,
  "& dt": {
    fontSize: "14px",
    fontWeight: "bold",
    fontStyle: "italic",
    padding: 0,
    margin: "16px 0 4px"
  },
  "& dt:first-of-type": {
    padding: 0
  },
  "& dt > :first-of-type": {
    marginTop: 0
  },
  "& dt > :last-child": {
    marginBottom: 0
  },
  "& dd": {
    margin: "0 0 16px",
    padding: "0 15px"
  },
  "& dd > :first-of-type": {
    marginTop: 0
  },
  "& dd > :last-child": {
    marginBottom: 0
  }
});

// src/components/components/typography/elements/Div.tsx
import { styled as Xb } from "@storybook/core/theming";
var Ru = Xb.div(N);

// src/components/components/typography/elements/H1.tsx
import { styled as Zb } from "@storybook/core/theming";
var Su = Zb.h1(N, Ke, ({ theme: e }) => ({
  fontSize: `${e.typography.size.l1}px`,
  fontWeight: e.typography.weight.bold
}));

// src/components/components/typography/elements/H2.tsx
import { styled as Kb } from "@storybook/core/theming";
var Au = Kb.h2(N, Ke, ({ theme: e }) => ({
  fontSize: `${e.typography.size.m2}px`,
  paddingBottom: 4,
  borderBottom: `1px solid ${e.appBorderColor}`
}));

// src/components/components/typography/elements/H3.tsx
import { styled as Jb } from "@storybook/core/theming";
var Fu = Jb.h3(N, Ke, ({ theme: e }) => ({
  fontSize: `${e.typography.size.m1}px`
}));

// src/components/components/typography/elements/H4.tsx
import { styled as Qb } from "@storybook/core/theming";
var ku = Qb.h4(N, Ke, ({ theme: e }) => ({
  fontSize: `${e.typography.size.s3}px`
}));

// src/components/components/typography/elements/H5.tsx
import { styled as ey } from "@storybook/core/theming";
var Lu = ey.h5(N, Ke, ({ theme: e }) => ({
  fontSize: `${e.typography.size.s2}px`
}));

// src/components/components/typography/elements/H6.tsx
import { styled as ty } from "@storybook/core/theming";
var Tu = ty.h6(N, Ke, ({ theme: e }) => ({
  fontSize: `${e.typography.size.s2}px`,
  color: e.color.dark
}));

// src/components/components/typography/elements/HR.tsx
import { styled as ry } from "@storybook/core/theming";
var Iu = ry.hr(({ theme: e }) => ({
  border: "0 none",
  borderTop: `1px solid ${e.appBorderColor}`,
  height: 4,
  padding: 0
}));

// src/components/components/typography/elements/Img.tsx
import { styled as ny } from "@storybook/core/theming";
var Bu = ny.img({
  maxWidth: "100%"
});

// src/components/components/typography/elements/LI.tsx
import { styled as oy } from "@storybook/core/theming";
var Mu = oy.li(N, ({ theme: e }) => ({
  fontSize: e.typography.size.s2,
  color: e.color.defaultText,
  lineHeight: "24px",
  "& + li": {
    marginTop: ".25em"
  },
  "& ul, & ol": {
    marginTop: ".25em",
    marginBottom: 0
  },
  "& code": Pt({ theme: e })
}));

// src/components/components/typography/elements/OL.tsx
import { styled as ay } from "@storybook/core/theming";
var iy = {
  paddingLeft: 30,
  "& :first-of-type": {
    marginTop: 0
  },
  "& :last-child": {
    marginBottom: 0
  }
}, _u = ay.ol(N, ze, iy, {
  listStyle: "decimal"
});

// src/components/components/typography/elements/P.tsx
import { styled as ly } from "@storybook/core/theming";
var Pu = ly.p(N, ze, ({ theme: e }) => ({
  fontSize: e.typography.size.s2,
  lineHeight: "24px",
  color: e.color.defaultText,
  "& code": Pt({ theme: e })
}));

// src/components/components/typography/elements/Pre.tsx
import { styled as sy } from "@storybook/core/theming";
var Hu = sy.pre(N, ze, ({ theme: e }) => ({
  // reset
  fontFamily: e.typography.fonts.mono,
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  lineHeight: "18px",
  padding: "11px 1rem",
  whiteSpace: "pre-wrap",
  color: "inherit",
  borderRadius: 3,
  margin: "1rem 0",
  "&:not(.prismjs)": {
    background: "transparent",
    border: "none",
    borderRadius: 0,
    padding: 0,
    margin: 0
  },
  "& pre, &.prismjs": {
    padding: 15,
    margin: 0,
    whiteSpace: "pre-wrap",
    color: "inherit",
    fontSize: "13px",
    lineHeight: "19px",
    code: {
      color: "inherit",
      fontSize: "inherit"
    }
  },
  "& code": {
    whiteSpace: "pre"
  },
  "& code, & tt": {
    border: "none"
  }
}));

// src/components/components/typography/elements/Span.tsx
import { styled as uy } from "@storybook/core/theming";
var zu = uy.span(N, ({ theme: e }) => ({
  "&.frame": {
    display: "block",
    overflow: "hidden",
    "& > span": {
      border: `1px solid ${e.color.medium}`,
      display: "block",
      float: "left",
      overflow: "hidden",
      margin: "13px 0 0",
      padding: 7,
      width: "auto"
    },
    "& span img": {
      display: "block",
      float: "left"
    },
    "& span span": {
      clear: "both",
      color: e.color.darkest,
      display: "block",
      padding: "5px 0 0"
    }
  },
  "&.align-center": {
    display: "block",
    overflow: "hidden",
    clear: "both",
    "& > span": {
      display: "block",
      overflow: "hidden",
      margin: "13px auto 0",
      textAlign: "center"
    },
    "& span img": {
      margin: "0 auto",
      textAlign: "center"
    }
  },
  "&.align-right": {
    display: "block",
    overflow: "hidden",
    clear: "both",
    "& > span": {
      display: "block",
      overflow: "hidden",
      margin: "13px 0 0",
      textAlign: "right"
    },
    "& span img": {
      margin: 0,
      textAlign: "right"
    }
  },
  "&.float-left": {
    display: "block",
    marginRight: 13,
    overflow: "hidden",
    float: "left",
    "& span": {
      margin: "13px 0 0"
    }
  },
  "&.float-right": {
    display: "block",
    marginLeft: 13,
    overflow: "hidden",
    float: "right",
    "& > span": {
      display: "block",
      overflow: "hidden",
      margin: "13px auto 0",
      textAlign: "right"
    }
  }
}));

// src/components/components/typography/elements/TT.tsx
import { styled as cy } from "@storybook/core/theming";
var Ou = cy.title(Pt);

// src/components/components/typography/elements/Table.tsx
import { styled as py } from "@storybook/core/theming";
var Nu = py.table(N, ze, ({ theme: e }) => ({
  fontSize: e.typography.size.s2,
  lineHeight: "24px",
  padding: 0,
  borderCollapse: "collapse",
  "& tr": {
    borderTop: `1px solid ${e.appBorderColor}`,
    backgroundColor: e.appContentBg,
    margin: 0,
    padding: 0
  },
  "& tr:nth-of-type(2n)": {
    backgroundColor: e.base === "dark" ? e.color.darker : e.color.lighter
  },
  "& tr th": {
    fontWeight: "bold",
    color: e.color.defaultText,
    border: `1px solid ${e.appBorderColor}`,
    margin: 0,
    padding: "6px 13px"
  },
  "& tr td": {
    border: `1px solid ${e.appBorderColor}`,
    color: e.color.defaultText,
    margin: 0,
    padding: "6px 13px"
  },
  "& tr th :first-of-type, & tr td :first-of-type": {
    marginTop: 0
  },
  "& tr th :last-child, & tr td :last-child": {
    marginBottom: 0
  }
}));

// src/components/components/typography/elements/UL.tsx
import { styled as dy } from "@storybook/core/theming";
var fy = {
  paddingLeft: 30,
  "& :first-of-type": {
    marginTop: 0
  },
  "& :last-child": {
    marginBottom: 0
  }
}, $u = dy.ul(N, ze, fy, { listStyle: "disc" });

// src/components/components/typography/components.tsx
var Vu = {
  h1: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Su, { ...te(e, "h1") }), "h1"),
  h2: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Au, { ...te(e, "h2") }), "h2"),
  h3: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Fu, { ...te(e, "h3") }), "h3"),
  h4: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(ku, { ...te(e, "h4") }), "h4"),
  h5: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Lu, { ...te(e, "h5") }), "h5"),
  h6: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Tu, { ...te(e, "h6") }), "h6"),
  pre: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Hu, { ...te(e, "pre") }), "pre"),
  a: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Ds, { ...te(e, "a") }), "a"),
  hr: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Iu, { ...te(e, "hr") }), "hr"),
  dl: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Eu, { ...te(e, "dl") }), "dl"),
  blockquote: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(xs, { ...te(e, "blockquote") }), "blockquote"),
  table: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Nu, { ...te(e, "table") }), "table"),
  img: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Bu, { ...te(e, "img") }), "img"),
  div: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Ru, { ...te(e, "div") }), "div"),
  span: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(zu, { ...te(e, "span") }), "span"),
  li: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Mu, { ...te(e, "li") }), "li"),
  ul: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement($u, { ...te(e, "ul") }), "ul"),
  ol: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(_u, { ...te(e, "ol") }), "ol"),
  p: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Pu, { ...te(e, "p") }), "p"),
  code: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Cu, { ...te(e, "code") }), "code"),
  tt: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(Ou, { ...te(e, "tt") }), "tt"),
  resetwrapper: /* @__PURE__ */ a((e) => /* @__PURE__ */ ne.createElement(kp, { ...te(e, "resetwrapper") }), "resetwrapper")
};

// src/components/components/Badge/Badge.tsx
import my from "react";
import { styled as gy } from "@storybook/core/theming";
var vy = gy.div(
  ({ theme: e }) => ({
    display: "inline-block",
    fontSize: 11,
    lineHeight: "12px",
    alignSelf: "center",
    padding: "4px 12px",
    borderRadius: "3em",
    fontWeight: e.typography.weight.bold
  }),
  {
    svg: {
      height: 12,
      width: 12,
      marginRight: 4,
      marginTop: -2,
      path: {
        fill: "currentColor"
      }
    }
  },
  ({ theme: e, status: t }) => {
    switch (t) {
      case "critical":
        return {
          color: e.color.critical,
          background: e.background.critical
        };
      case "negative":
        return {
          color: e.color.negativeText,
          background: e.background.negative,
          boxShadow: e.base === "light" ? `inset 0 0 0 1px ${Le(0.9, e.color.negativeText)}` : "none"
        };
      case "warning":
        return {
          color: e.color.warningText,
          background: e.background.warning,
          boxShadow: e.base === "light" ? `inset 0 0 0 1px ${Le(0.9, e.color.warningText)}` : "none"
        };
      case "neutral":
        return {
          color: e.color.dark,
          background: e.color.mediumlight,
          boxShadow: e.base === "light" ? `inset 0 0 0 1px ${Le(0.9, e.color.dark)}` : "none"
        };
      case "positive":
        return {
          color: e.color.positiveText,
          background: e.background.positive,
          boxShadow: e.base === "light" ? `inset 0 0 0 1px ${Le(0.9, e.color.positiveText)}` : "none"
        };
      default:
        return {};
    }
  }
), wy = /* @__PURE__ */ a(({ ...e }) => /* @__PURE__ */ my.createElement(vy, { ...e }), "Badge");

// src/components/components/typography/link/link.tsx
import Gu from "react";
import { styled as _2 } from "@storybook/core/theming";

// ../node_modules/@storybook/icons/dist/index.mjs
var Uu = {};
gn(Uu, {
  AccessibilityAltIcon: () => Wx,
  AccessibilityIcon: () => jx,
  AccessibilityIgnoredIcon: () => qx,
  AddIcon: () => z9,
  AdminIcon: () => Bx,
  AlertAltIcon: () => dD,
  AlertIcon: () => pD,
  AlignLeftIcon: () => h8,
  AlignRightIcon: () => m8,
  AppleIcon: () => M8,
  ArrowBottomLeftIcon: () => ax,
  ArrowBottomRightIcon: () => ix,
  ArrowDownIcon: () => ex,
  ArrowLeftIcon: () => tx,
  ArrowRightIcon: () => rx,
  ArrowSolidDownIcon: () => sx,
  ArrowSolidLeftIcon: () => ux,
  ArrowSolidRightIcon: () => cx,
  ArrowSolidUpIcon: () => lx,
  ArrowTopLeftIcon: () => nx,
  ArrowTopRightIcon: () => ox,
  ArrowUpIcon: () => QD,
  AzureDevOpsIcon: () => N8,
  BackIcon: () => xx,
  BasketIcon: () => _D,
  BatchAcceptIcon: () => T9,
  BatchDenyIcon: () => L9,
  BeakerIcon: () => PD,
  BellIcon: () => vD,
  BitbucketIcon: () => $8,
  BoldIcon: () => x8,
  BookIcon: () => a8,
  BookmarkHollowIcon: () => ED,
  BookmarkIcon: () => RD,
  BottomBarIcon: () => f9,
  BottomBarToggleIcon: () => h9,
  BoxIcon: () => b9,
  BranchIcon: () => T8,
  BrowserIcon: () => a9,
  ButtonIcon: () => rD,
  CPUIcon: () => m9,
  CalendarIcon: () => d8,
  CameraIcon: () => Vy,
  CameraStabilizeIcon: () => Sy,
  CategoryIcon: () => s8,
  CertificateIcon: () => TD,
  ChangedIcon: () => j9,
  ChatIcon: () => Z9,
  CheckIcon: () => F9,
  ChevronDownIcon: () => GD,
  ChevronLeftIcon: () => YD,
  ChevronRightIcon: () => qu,
  ChevronSmallDownIcon: () => ZD,
  ChevronSmallLeftIcon: () => KD,
  ChevronSmallRightIcon: () => JD,
  ChevronSmallUpIcon: () => XD,
  ChevronUpIcon: () => UD,
  ChromaticIcon: () => V8,
  ChromeIcon: () => z8,
  CircleHollowIcon: () => xD,
  CircleIcon: () => CD,
  ClearIcon: () => q9,
  CloseAltIcon: () => M9,
  CloseIcon: () => N9,
  CloudHollowIcon: () => OD,
  CloudIcon: () => ND,
  CogIcon: () => x9,
  CollapseIcon: () => dx,
  CommandIcon: () => iD,
  CommentAddIcon: () => G9,
  CommentIcon: () => U9,
  CommentsIcon: () => X9,
  CommitIcon: () => L8,
  CompassIcon: () => Sx,
  ComponentDrivenIcon: () => j8,
  ComponentIcon: () => Dy,
  ContrastIcon: () => Hy,
  ContrastIgnoredIcon: () => Oy,
  ControlsIcon: () => I9,
  CopyIcon: () => l8,
  CreditIcon: () => tD,
  CrossIcon: () => Wu,
  DashboardIcon: () => Lx,
  DatabaseIcon: () => g9,
  DeleteIcon: () => $9,
  DiamondIcon: () => SD,
  DirectionIcon: () => Mx,
  DiscordIcon: () => W8,
  DocChartIcon: () => v8,
  DocListIcon: () => w8,
  DocumentIcon: () => i8,
  DownloadIcon: () => Dx,
  DragIcon: () => b8,
  EditIcon: () => D9,
  EllipsisIcon: () => R9,
  EmailIcon: () => fD,
  ExpandAltIcon: () => px,
  ExpandIcon: () => fx,
  EyeCloseIcon: () => By,
  EyeIcon: () => Iy,
  FaceHappyIcon: () => Nx,
  FaceNeutralIcon: () => $x,
  FaceSadIcon: () => Vx,
  FacebookIcon: () => q8,
  FailedIcon: () => W9,
  FastForwardIcon: () => Xy,
  FigmaIcon: () => U8,
  FilterIcon: () => g8,
  FlagIcon: () => zD,
  FolderIcon: () => u8,
  FormIcon: () => k9,
  GDriveIcon: () => G8,
  GithubIcon: () => Y8,
  GitlabIcon: () => X8,
  GlobeIcon: () => Rx,
  GoogleIcon: () => Z8,
  GraphBarIcon: () => f8,
  GraphLineIcon: () => p8,
  GraphqlIcon: () => K8,
  GridAltIcon: () => Ay,
  GridIcon: () => xy,
  GrowIcon: () => Py,
  HeartHollowIcon: () => AD,
  HeartIcon: () => FD,
  HomeIcon: () => Ix,
  HourglassIcon: () => HD,
  InfoIcon: () => sD,
  ItalicIcon: () => C8,
  JumpToIcon: () => DD,
  KeyIcon: () => Q9,
  LightningIcon: () => My,
  LightningOffIcon: () => ju,
  LinkBrokenIcon: () => gD,
  LinkIcon: () => mD,
  LinkedinIcon: () => n9,
  LinuxIcon: () => _8,
  ListOrderedIcon: () => R8,
  ListUnorderedIcon: () => S8,
  LocationIcon: () => Ax,
  LockIcon: () => K9,
  MarkdownIcon: () => F8,
  MarkupIcon: () => D8,
  MediumIcon: () => J8,
  MemoryIcon: () => v9,
  MenuIcon: () => y8,
  MergeIcon: () => B8,
  MirrorIcon: () => _y,
  MobileIcon: () => l9,
  MoonIcon: () => Jy,
  NutIcon: () => C9,
  OutboxIcon: () => eD,
  OutlineIcon: () => Cy,
  PaintBrushIcon: () => Ny,
  PaperClipIcon: () => E8,
  ParagraphIcon: () => A8,
  PassedIcon: () => V9,
  PhoneIcon: () => hD,
  PhotoDragIcon: () => Ey,
  PhotoIcon: () => yy,
  PhotoStabilizeIcon: () => Ry,
  PinAltIcon: () => P9,
  PinIcon: () => Fx,
  PlayAllHollowIcon: () => t8,
  PlayBackIcon: () => Uy,
  PlayHollowIcon: () => e8,
  PlayIcon: () => qy,
  PlayNextIcon: () => Gy,
  PlusIcon: () => B9,
  PointerDefaultIcon: () => oD,
  PointerHandIcon: () => aD,
  PowerIcon: () => y9,
  PrintIcon: () => c8,
  ProceedIcon: () => Cx,
  ProfileIcon: () => Ox,
  PullRequestIcon: () => I8,
  QuestionIcon: () => uD,
  RSSIcon: () => wD,
  RedirectIcon: () => gx,
  ReduxIcon: () => Q8,
  RefreshIcon: () => Ex,
  ReplyIcon: () => wx,
  RepoIcon: () => k8,
  RequestChangeIcon: () => Y9,
  RewindIcon: () => Yy,
  RulerIcon: () => $y,
  SaveIcon: () => lD,
  SearchIcon: () => Fy,
  ShareAltIcon: () => bD,
  ShareIcon: () => yD,
  ShieldIcon: () => MD,
  SideBySideIcon: () => n8,
  SidebarAltIcon: () => c9,
  SidebarAltToggleIcon: () => p9,
  SidebarIcon: () => u9,
  SidebarToggleIcon: () => d9,
  SpeakerIcon: () => Wy,
  StackedIcon: () => o8,
  StarHollowIcon: () => kD,
  StarIcon: () => LD,
  StatusFailIcon: () => VD,
  StatusIcon: () => jD,
  StatusPassIcon: () => qD,
  StatusWarnIcon: () => WD,
  StickerIcon: () => $D,
  StopAltHollowIcon: () => Qy,
  StopAltIcon: () => Zy,
  StopIcon: () => r8,
  StorybookIcon: () => O8,
  StructureIcon: () => w9,
  SubtractIcon: () => O9,
  SunIcon: () => Ky,
  SupportIcon: () => cD,
  SweepIcon: () => A9,
  SwitchAltIcon: () => zy,
  SyncIcon: () => bx,
  TabletIcon: () => i9,
  ThumbsUpIcon: () => BD,
  TimeIcon: () => kx,
  TimerIcon: () => Tx,
  TransferIcon: () => mx,
  TrashIcon: () => _9,
  TwitterIcon: () => e9,
  TypeIcon: () => nD,
  UbuntuIcon: () => P8,
  UndoIcon: () => vx,
  UnfoldIcon: () => hx,
  UnlockIcon: () => J9,
  UnpinIcon: () => H9,
  UploadIcon: () => yx,
  UserAddIcon: () => Hx,
  UserAltIcon: () => Px,
  UserIcon: () => _x,
  UsersIcon: () => zx,
  VSCodeIcon: () => r9,
  VerifiedIcon: () => ID,
  VideoIcon: () => jy,
  WandIcon: () => S9,
  WatchIcon: () => s9,
  WindowsIcon: () => H8,
  WrenchIcon: () => E9,
  XIcon: () => o9,
  YoutubeIcon: () => t9,
  ZoomIcon: () => ky,
  ZoomOutIcon: () => Ly,
  ZoomResetIcon: () => Ty,
  iconList: () => by
});
import * as s from "react";
var by = [
  {
    name: "Images",
    icons: [
      "PhotoIcon",
      "ComponentIcon",
      "GridIcon",
      "OutlineIcon",
      "PhotoDragIcon",
      "PhotoStabilizeIcon",
      "CameraStabilizeIcon",
      "GridAltIcon",
      "SearchIcon",
      "ZoomIcon",
      "ZoomOutIcon",
      "ZoomResetIcon",
      "EyeIcon",
      "EyeCloseIcon",
      "LightningIcon",
      "LightningOffIcon",
      "MirrorIcon",
      "GrowIcon",
      "ContrastIcon",
      "SwitchAltIcon",
      "ContrastIgnoredIcon",
      "PaintBrushIcon",
      "RulerIcon",
      "CameraIcon",
      "VideoIcon",
      "SpeakerIcon",
      "PlayIcon",
      "PlayBackIcon",
      "PlayNextIcon",
      "RewindIcon",
      "FastForwardIcon",
      "StopAltIcon",
      "SunIcon",
      "MoonIcon",
      "StopAltHollowIcon",
      "PlayHollowIcon",
      "PlayAllHollowIcon",
      "StopIcon",
      "SideBySideIcon",
      "StackedIcon"
    ]
  },
  {
    name: "Documents",
    icons: [
      "BookIcon",
      "DocumentIcon",
      "CopyIcon",
      "CategoryIcon",
      "FolderIcon",
      "PrintIcon",
      "GraphLineIcon",
      "CalendarIcon",
      "GraphBarIcon",
      "AlignLeftIcon",
      "AlignRightIcon",
      "FilterIcon",
      "DocChartIcon",
      "DocListIcon",
      "DragIcon",
      "MenuIcon"
    ]
  },
  {
    name: "Editing",
    icons: [
      "MarkupIcon",
      "BoldIcon",
      "ItalicIcon",
      "PaperClipIcon",
      "ListOrderedIcon",
      "ListUnorderedIcon",
      "ParagraphIcon",
      "MarkdownIcon"
    ]
  },
  {
    name: "Git",
    icons: [
      "RepoIcon",
      "CommitIcon",
      "BranchIcon",
      "PullRequestIcon",
      "MergeIcon"
    ]
  },
  {
    name: "OS",
    icons: [
      "AppleIcon",
      "LinuxIcon",
      "UbuntuIcon",
      "WindowsIcon",
      "ChromeIcon"
    ]
  },
  {
    name: "Logos",
    icons: [
      "StorybookIcon",
      "AzureDevOpsIcon",
      "BitbucketIcon",
      "ChromaticIcon",
      "ComponentDrivenIcon",
      "DiscordIcon",
      "FacebookIcon",
      "FigmaIcon",
      "GDriveIcon",
      "GithubIcon",
      "GitlabIcon",
      "GoogleIcon",
      "GraphqlIcon",
      "MediumIcon",
      "ReduxIcon",
      "TwitterIcon",
      "YoutubeIcon",
      "VSCodeIcon",
      "LinkedinIcon",
      "XIcon"
    ]
  },
  {
    name: "Devices",
    icons: [
      "BrowserIcon",
      "TabletIcon",
      "MobileIcon",
      "WatchIcon",
      "SidebarIcon",
      "SidebarAltIcon",
      "SidebarAltToggleIcon",
      "SidebarToggleIcon",
      "BottomBarIcon",
      "BottomBarToggleIcon",
      "CPUIcon",
      "DatabaseIcon",
      "MemoryIcon",
      "StructureIcon",
      "BoxIcon",
      "PowerIcon"
    ]
  },
  {
    name: "CRUD",
    icons: [
      "EditIcon",
      "CogIcon",
      "NutIcon",
      "WrenchIcon",
      "EllipsisIcon",
      "WandIcon",
      "SweepIcon",
      "CheckIcon",
      "FormIcon",
      "BatchDenyIcon",
      "BatchAcceptIcon",
      "ControlsIcon",
      "PlusIcon",
      "CloseAltIcon",
      "CrossIcon",
      "TrashIcon",
      "PinAltIcon",
      "UnpinIcon",
      "AddIcon",
      "SubtractIcon",
      "CloseIcon",
      "DeleteIcon",
      "PassedIcon",
      "ChangedIcon",
      "FailedIcon",
      "ClearIcon",
      "CommentIcon",
      "CommentAddIcon",
      "RequestChangeIcon",
      "CommentsIcon",
      "ChatIcon",
      "LockIcon",
      "UnlockIcon",
      "KeyIcon",
      "OutboxIcon",
      "CreditIcon",
      "ButtonIcon",
      "TypeIcon",
      "PointerDefaultIcon",
      "PointerHandIcon",
      "CommandIcon",
      "SaveIcon"
    ]
  },
  {
    name: "Communicate",
    icons: [
      "InfoIcon",
      "QuestionIcon",
      "SupportIcon",
      "AlertIcon",
      "AlertAltIcon",
      "EmailIcon",
      "PhoneIcon",
      "LinkIcon",
      "LinkBrokenIcon",
      "BellIcon",
      "RSSIcon",
      "ShareAltIcon",
      "ShareIcon",
      "JumpToIcon",
      "CircleHollowIcon",
      "CircleIcon",
      "BookmarkHollowIcon",
      "BookmarkIcon",
      "DiamondIcon",
      "HeartHollowIcon",
      "HeartIcon",
      "StarHollowIcon",
      "StarIcon",
      "CertificateIcon",
      "VerifiedIcon",
      "ThumbsUpIcon",
      "ShieldIcon",
      "BasketIcon",
      "BeakerIcon",
      "HourglassIcon",
      "FlagIcon",
      "CloudHollowIcon",
      "CloudIcon",
      "StickerIcon",
      "StatusFailIcon",
      "StatusIcon",
      "StatusWarnIcon",
      "StatusPassIcon"
    ]
  },
  {
    name: "Wayfinding",
    icons: [
      "ChevronUpIcon",
      "ChevronDownIcon",
      "ChevronLeftIcon",
      "ChevronRightIcon",
      "ChevronSmallUpIcon",
      "ChevronSmallDownIcon",
      "ChevronSmallLeftIcon",
      "ChevronSmallRightIcon",
      "ArrowUpIcon",
      "ArrowDownIcon",
      "ArrowLeftIcon",
      "ArrowRightIcon",
      "ArrowTopLeftIcon",
      "ArrowTopRightIcon",
      "ArrowBottomLeftIcon",
      "ArrowBottomRightIcon",
      "ArrowSolidUpIcon",
      "ArrowSolidDownIcon",
      "ArrowSolidLeftIcon",
      "ArrowSolidRightIcon",
      "ExpandAltIcon",
      "CollapseIcon",
      "ExpandIcon",
      "UnfoldIcon",
      "TransferIcon",
      "RedirectIcon",
      "UndoIcon",
      "ReplyIcon",
      "SyncIcon",
      "UploadIcon",
      "DownloadIcon",
      "BackIcon",
      "ProceedIcon",
      "RefreshIcon",
      "GlobeIcon",
      "CompassIcon",
      "LocationIcon",
      "PinIcon",
      "TimeIcon",
      "DashboardIcon",
      "TimerIcon",
      "HomeIcon",
      "AdminIcon",
      "DirectionIcon"
    ]
  },
  {
    name: "People",
    icons: [
      "UserIcon",
      "UserAltIcon",
      "UserAddIcon",
      "UsersIcon",
      "ProfileIcon",
      "FaceHappyIcon",
      "FaceNeutralIcon",
      "FaceSadIcon",
      "AccessibilityIcon",
      "AccessibilityAltIcon",
      "AccessibilityIgnoredIcon"
    ]
  }
], yy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M6.25 4.254a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm-.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M13 1.504v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5h11a.5.5 0 01.5.5zM2 9.297V2.004h10v5.293L9.854 5.15a.5.5 0 00-.\
708 0L6.5 7.797 5.354 6.65a.5.5 0 00-.708 0L2 9.297zM9.5 6.21l2.5 2.5v3.293H2V10.71l3-3 3.146 3.146a.5.5 0 00.708-.707L7.207 8.504 9.5 6.21z",
      fill: e
    }
  )
)), Dy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3.5 1.004a2.5 2.5 0 00-2.5 2.5v7a2.5 2.5 0 002.5 2.5h7a2.5 2.5 0 002.5-2.5v-7a2.5 2.5 0 00-2.5-2.5h-7zm8.5 5.5H7.5v-4.5h3a1.5 1.5\
 0 011.5 1.5v3zm0 1v3a1.5 1.5 0 01-1.5 1.5h-3v-4.5H12zm-5.5 4.5v-4.5H2v3a1.5 1.5 0 001.5 1.5h3zM2 6.504h4.5v-4.5h-3a1.5 1.5 0 00-1.5 1.5v3z",
      fill: e
    }
  )
)), xy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1 1.504a.5.5 0 01.5-.5H6a.5.5 0 01.5.5v4.5a.5.5 0 01-.5.5H1.5a.5.5 0 01-.5-.5v-4.5zm1 4v-3.5h3.5v3.5H2zM7.5 1.504a.5.5 0 01.5-.5h\
4.5a.5.5 0 01.5.5v4.5a.5.5 0 01-.5.5H8a.5.5 0 01-.5-.5v-4.5zm1 4v-3.5H12v3.5H8.5zM1.5 7.504a.5.5 0 00-.5.5v4.5a.5.5 0 00.5.5H6a.5.5 0 00.5-.\
5v-4.5a.5.5 0 00-.5-.5H1.5zm.5 1v3.5h3.5v-3.5H2zM7.5 8.004a.5.5 0 01.5-.5h4.5a.5.5 0 01.5.5v4.5a.5.5 0 01-.5.5H8a.5.5 0 01-.5-.5v-4.5zm1 4v-\
3.5H12v3.5H8.5z",
      fill: e
    }
  )
)), Cy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M2 2.004v2H1v-2.5a.5.5 0 01.5-.5H4v1H2zM1 9.004v-4h1v4H1zM1 10.004v2.5a.5.5 0 00.5.5H4v-1H2v-2H1zM10 13.004h2.5a.5.5 0 00.5-.5v-2.\
5h-1v2h-2v1zM12 4.004h1v-2.5a.5.5 0 00-.5-.5H10v1h2v2zM9 12.004v1H5v-1h4zM9 1.004v1H5v-1h4zM13 9.004h-1v-4h1v4zM7 8.004a1 1 0 100-2 1 1 0 00\
0 2z",
      fill: e
    }
  )
)), Ey = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M8.25 3.254a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm-.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7.003v-6.5a.5.5 0 00-.5-.5h-10a.5.5 0 00-.5.5v2.5H.5a.5.5 0 00-.5.5v2.5h1v-2h2v6.5a.5.5 0 00.5.5H10v2H8v1h2.5a.5.5 0 00.5-.5v-\
2.5h2.5a.5.5 0 00.5-.5v-3.5zm-10-6v5.794L5.646 5.15a.5.5 0 01.708 0L7.5 6.297l2.646-2.647a.5.5 0 01.708 0L13 5.797V1.004H4zm9 6.208l-2.5-2.5\
-2.293 2.293L9.354 8.15a.5.5 0 11-.708.707L6 6.211l-2 2v1.793h9V7.21z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M0 10.004v-3h1v3H0zM0 13.504v-2.5h1v2h2v1H.5a.5.5 0 01-.5-.5zM7 14.004H4v-1h3v1z",
      fill: e
    }
  )
)), Ry = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M2.5 1H4V0H2.5A2.5 2.5 0 000 2.5V4h1V2.5A1.5 1.5 0 012.5 1z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7.25 5.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm-.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M12 2.5v9a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h9a.5.5 0 01.5.5zM3 8.793V3h8v3.793L9.854 5.646a.5.5 0 00-.708 0L6.5 \
8.293 5.354 7.146a.5.5 0 00-.708 0L3 8.793zm6.5-2.086l1.5 1.5V11H3v-.793l2-2 2.146 2.147a.5.5 0 00.708-.708L7.207 9 9.5 6.707z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M10 1h1.5A1.5 1.5 0 0113 2.5V4h1V2.5A2.5 2.5 0 0011.5 0H10v1zM2.5 13H4v1H2.5A2.5 2.5 0 010 11.5V10h1v1.5A1.5 1.5 0 002.5 13zM10 13\
h1.5a1.5 1.5 0 001.5-1.5V10h1v1.5a2.5 2.5 0 01-2.5 2.5H10v-1z",
      fill: e
    }
  )
)), Sy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("g", { clipPath: "url(#prefix__clip0_2484_400)" }, /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M2.5 1A1.5 1.5 0 001 2.5v1a.5.5 0 01-1 0v-1A2.5 2.5 0 012.5 0h1a.5.5 0 010 1h-1zm3.352 1.223A.5.5 0 016.268 2h1.464a.5.5 0 01.416.\
223L9.333 4H11.5a.5.5 0 01.5.5v5a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5v-5a.5.5 0 01.5-.5h2.167l1.185-1.777zM11.5 1A1.5 1.5 0 0113 2.5v1a.5.5 0 0\
01 0v-1A2.5 2.5 0 0011.5 0h-1a.5.5 0 000 1h1zm-9 12A1.5 1.5 0 011 11.5v-1a.5.5 0 00-1 0v1A2.5 2.5 0 002.5 14h1a.5.5 0 000-1h-1zm9 0a1.5 1.5 \
0 001.5-1.5v-1a.5.5 0 011 0v1a2.5 2.5 0 01-2.5 2.5h-1a.5.5 0 010-1h1zM8 7a1 1 0 11-2 0 1 1 0 012 0zm1 0a2 2 0 11-4 0 2 2 0 014 0z",
      fill: e
    }
  )),
  /* @__PURE__ */ s.createElement("defs", null, /* @__PURE__ */ s.createElement("clipPath", { id: "prefix__clip0_2484_400" }, /* @__PURE__ */ s.createElement(
  "path", { fill: "#fff", d: "M0 0h14v14H0z" })))
)), Ay = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M4 3V1h1v2H4zM4 6v2h1V6H4zM4 11v2h1v-2H4zM9 11v2h1v-2H9zM9 8V6h1v2H9zM9 1v2h1V1H9zM13 5h-2V4h2v1zM11 10h2V9h-2v1zM3 10H1V9h2v1zM1 \
5h2V4H1v1zM8 5H6V4h2v1zM6 10h2V9H6v1zM4 4h1v1H4V4zM10 4H9v1h1V4zM9 9h1v1H9V9zM5 9H4v1h1V9z",
      fill: e
    }
  )
)), Fy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M9.544 10.206a5.5 5.5 0 11.662-.662.5.5 0 01.148.102l3 3a.5.5 0 01-.708.708l-3-3a.5.5 0 01-.102-.148zM10.5 6a4.5 4.5 0 11-9 0 4.5 \
4.5 0 019 0z",
      fill: e
    }
  )
)), ky = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M6 3.5a.5.5 0 01.5.5v1.5H8a.5.5 0 010 1H6.5V8a.5.5 0 01-1 0V6.5H4a.5.5 0 010-1h1.5V4a.5.5 0 01.5-.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M9.544 10.206a5.5 5.5 0 11.662-.662.5.5 0 01.148.102l3 3a.5.5 0 01-.708.708l-3-3a.5.5 0 01-.102-.148zM10.5 6a4.5 4.5 0 11-9 0 4.5 \
4.5 0 019 0z",
      fill: e
    }
  )
)), Ly = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("path", { d: "M4 5.5a.5.5 0 000 1h4a.5.5 0 000-1H4z", fill: e }),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M6 11.5c1.35 0 2.587-.487 3.544-1.294a.5.5 0 00.102.148l3 3a.5.5 0 00.708-.708l-3-3a.5.5 0 00-.148-.102A5.5 5.5 0 106 11.5zm0-1a4.\
5 4.5 0 100-9 4.5 4.5 0 000 9z",
      fill: e
    }
  )
)), Ty = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.5 2.837V1.5a.5.5 0 00-1 0V4a.5.5 0 00.5.5h2.5a.5.5 0 000-1H2.258a4.5 4.5 0 11-.496 4.016.5.5 0 10-.942.337 5.502 5.502 0 008.72\
4 2.353.5.5 0 00.102.148l3 3a.5.5 0 00.708-.708l-3-3a.5.5 0 00-.148-.102A5.5 5.5 0 101.5 2.837z",
      fill: e
    }
  )
)), Iy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("path", { d: "M7 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z", fill: e }),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7l-.21.293C13.669 7.465 10.739 11.5 7 11.5S.332 7.465.21 7.293L0 7l.21-.293C.331 6.536 3.261 2.5 7 2.5s6.668 4.036 6.79 4.207L\
14 7zM2.896 5.302A12.725 12.725 0 001.245 7c.296.37.874 1.04 1.65 1.698C4.043 9.67 5.482 10.5 7 10.5c1.518 0 2.958-.83 4.104-1.802A12.72 12.\
72 0 0012.755 7c-.297-.37-.875-1.04-1.65-1.698C9.957 4.33 8.517 3.5 7 3.5c-1.519 0-2.958.83-4.104 1.802z",
      fill: e
    }
  )
)), By = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.854 1.146a.5.5 0 10-.708.708l11 11a.5.5 0 00.708-.708l-11-11zM11.104 8.698c-.177.15-.362.298-.553.439l.714.714a13.25 13.25 0 00\
2.526-2.558L14 7l-.21-.293C13.669 6.536 10.739 2.5 7 2.5c-.89 0-1.735.229-2.506.58l.764.763A4.859 4.859 0 017 3.5c1.518 0 2.958.83 4.104 1.8\
02A12.724 12.724 0 0112.755 7a12.72 12.72 0 01-1.65 1.698zM.21 6.707c.069-.096 1.03-1.42 2.525-2.558l.714.714c-.191.141-.376.288-.553.439A12\
.725 12.725 0 001.245 7c.296.37.874 1.04 1.65 1.698C4.043 9.67 5.482 10.5 7 10.5a4.86 4.86 0 001.742-.344l.764.764c-.772.351-1.616.58-2.506.\
58C3.262 11.5.332 7.465.21 7.293L0 7l.21-.293z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M4.5 7c0-.322.061-.63.172-.914l3.242 3.242A2.5 2.5 0 014.5 7zM9.328 7.914L6.086 4.672a2.5 2.5 0 013.241 3.241z",
      fill: e
    }
  )
)), My = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M2.522 6.6a.566.566 0 00-.176.544.534.534 0 00.382.41l2.781.721-1.493 5.013a.563.563 0 00.216.627.496.496 0 00.63-.06l6.637-6.453a\
.568.568 0 00.151-.54.534.534 0 00-.377-.396l-2.705-.708 2.22-4.976a.568.568 0 00-.15-.666.497.497 0 00-.648.008L2.522 6.6zm7.72.63l-3.067-.\
804L9.02 2.29 3.814 6.803l2.95.764-1.277 4.285 4.754-4.622zM4.51 13.435l.037.011-.037-.011z",
      fill: e
    }
  )
)), ju = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M10.139 8.725l1.36-1.323a.568.568 0 00.151-.54.534.534 0 00-.377-.396l-2.705-.708 2.22-4.976a.568.568 0 00-.15-.666.497.497 0 00-.\
648.008L5.464 4.05l.708.71 2.848-2.47-1.64 3.677.697.697 2.164.567-.81.787.708.708zM2.523 6.6a.566.566 0 00-.177.544.534.534 0 00.382.41l2.7\
82.721-1.494 5.013a.563.563 0 00.217.627.496.496 0 00.629-.06l3.843-3.736-.708-.707-2.51 2.44 1.137-3.814-.685-.685-2.125-.55.844-.731-.71-.\
71L2.524 6.6zM1.854 1.146a.5.5 0 10-.708.708l11 11a.5.5 0 00.708-.708l-11-11z",
      fill: e
    }
  )
)), _y = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1 1.504a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11zm1 10.5h10v-10l-10 10z",
      fill: e
    }
  )
)), Py = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.5 1.004a.5.5 0 100 1H12v10.5a.5.5 0 001 0v-10.5a1 1 0 00-1-1H1.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1 3.504a.5.5 0 01.5-.5H10a1 1 0 011 1v8.5a.5.5 0 01-1 0v-8.5H1.5a.5.5 0 01-.5-.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1.5 5.004a.5.5 0 00-.5.5v7a.5.5 0 00.5.5h7a.5.5 0 00.5-.5v-7a.5.5 0 00-.5-.5h-7zm.5 1v6h6v-6H2z",
      fill: e
    }
  )
)), Hy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3 3.004H.5a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h10a.5.5 0 00.5-.5v-2.5h2.5a.5.5 0 00.5-.5v-10a.5.5 0 00-.5-.5h-10a.5.5 0 00-.5.5v2.5zm\
1 1v2.293l2.293-2.293H4zm-1 0v6.5a.499.499 0 00.497.5H10v2H1v-9h2zm1-1h6.5a.499.499 0 01.5.5v6.5h2v-9H4v2zm6 7V7.71l-2.293 2.293H10zm0-3.707\
V4.71l-5.293 5.293h1.586L10 6.297zm-.707-2.293H7.707L4 7.71v1.586l5.293-5.293z",
      fill: e
    }
  )
)), zy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3 3.004v-2.5a.5.5 0 01.5-.5h10a.5.5 0 01.5.5v10a.5.5 0 01-.5.5H11v2.5a.5.5 0 01-.5.5H.5a.5.5 0 01-.5-.5v-10a.5.5 0 01.5-.5H3zm1 0\
v-2h9v9h-2v-6.5a.5.5 0 00-.5-.5H4zm6 8v2H1v-9h2v6.5a.5.5 0 00.5.5H10zm0-1H4v-6h6v6z",
      fill: e
    }
  )
)), Oy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "g",
    {
      clipPath: "url(#prefix__clip0_2359_559)",
      fillRule: "evenodd",
      clipRule: "evenodd",
      fill: e
    },
    /* @__PURE__ */ s.createElement("path", { d: "M3 3.004H.5a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h7.176a4.526 4.526 0 01-.916-1H1v-9h2v6.5a.499.\
499 0 00.497.5h2.531a4.548 4.548 0 01-.001-1h-1.32l2.16-2.16c.274-.374.603-.703.977-.977L10 4.711v1.316a4.552 4.552 0 011 0V3.504a.48.48 0 0\
0-.038-.191.5.5 0 00-.462-.31H4v-2h9v5.755c.378.253.715.561 1 .913V.504a.5.5 0 00-.5-.5h-10a.5.5 0 00-.5.5v2.5zm1 1v2.293l2.293-2.293H4zm5.2\
93 0H7.707L4 7.71v1.586l5.293-5.293z" }),
    /* @__PURE__ */ s.createElement("path", { d: "M14 10.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm-5.5 0A.5.5 0 019 10h3a.5.5 0 010 1H9a.5.5 0 01\
-.5-.5z" })
  ),
  /* @__PURE__ */ s.createElement("defs", null, /* @__PURE__ */ s.createElement("clipPath", { id: "prefix__clip0_2359_559" }, /* @__PURE__ */ s.createElement(
  "path", { fill: "#fff", d: "M0 0h14v14H0z" })))
)), Ny = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M11.854.146a.5.5 0 00-.708 0L2.983 8.31a2.24 2.24 0 00-1.074.6C.677 10.14.24 11.902.085 12.997 0 13.6 0 14 0 14s.4 0 1.002-.085c1.\
095-.155 2.857-.592 4.089-1.824a2.24 2.24 0 00.6-1.074l8.163-8.163a.5.5 0 000-.708l-2-2zM5.6 9.692l.942-.942L5.25 7.457l-.942.943A2.242 2.24\
2 0 015.6 9.692zm1.649-1.65L12.793 2.5 11.5 1.207 5.957 6.75 7.25 8.043zM4.384 9.617a1.25 1.25 0 010 1.768c-.767.766-1.832 1.185-2.78 1.403-\
.17.04-.335.072-.49.098.027-.154.06-.318.099-.49.219-.947.637-2.012 1.403-2.779a1.25 1.25 0 011.768 0z",
      fill: e
    }
  )
)), $y = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.5 1.004a.5.5 0 01.5.5v.5h10v-.5a.5.5 0 011 0v2a.5.5 0 01-1 0v-.5H2v.5a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1.5 6a.5.5 0 00-.5.5v6a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-6a.5.5 0 00-.5-.5h-11zM2 7v5h10V7h-1v2.5a.5.5 0 01-1 0V7h-.75v1a.5.5 0 01\
-1 0V7H7.5v2.5a.5.5 0 01-1 0V7h-.75v1a.5.5 0 01-1 0V7H4v2.5a.5.5 0 01-1 0V7H2z",
      fill: e
    }
  )
)), Vy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M10 7a3 3 0 11-6 0 3 3 0 016 0zM9 7a2 2 0 11-4 0 2 2 0 014 0z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M2.5 1a.5.5 0 00-.5.5v.504H.5a.5.5 0 00-.5.5v9a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-9a.5.5 0 00-.5-.5H6V1.5a.5.5 0 00-.5-.5h-3zM1 3.00\
4v8h12v-8H1z",
      fill: e
    }
  )
)), jy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("path", { d: "M2.5 10a.5.5 0 100-1 .5.5 0 000 1z", fill: e }),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M0 4a2 2 0 012-2h6a2 2 0 012 2v.5l3.189-2.391A.5.5 0 0114 2.5v9a.5.5 0 01-.804.397L10 9.5v.5a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm9 0v1.\
5a.5.5 0 00.8.4L13 3.5v7L9.8 8.1a.5.5 0 00-.8.4V10a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1h6a1 1 0 011 1z",
      fill: e
    }
  )
)), Wy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1 4.5v5a.5.5 0 00.5.5H4l3.17 2.775a.5.5 0 00.83-.377V1.602a.5.5 0 00-.83-.376L4 4H1.5a.5.5 0 00-.5.5zM4 9V5H2v4h2zm.998.545A.504.\
504 0 005 9.5v-5c0-.015 0-.03-.002-.044L7 2.704v8.592L4.998 9.545z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M10.15 1.752a.5.5 0 00-.3.954 4.502 4.502 0 010 8.588.5.5 0 00.3.954 5.502 5.502 0 000-10.496z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M10.25 3.969a.5.5 0 00-.5.865 2.499 2.499 0 010 4.332.5.5 0 10.5.866 3.499 3.499 0 000-6.063z",
      fill: e
    }
  )
)), qy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M12.813 7.425l-9.05 5.603A.5.5 0 013 12.603V1.398a.5.5 0 01.763-.425l9.05 5.602a.5.5 0 010 .85z",
      fill: e
    }
  )
)), Uy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M11.24 12.035L3.697 7.427A.494.494 0 013.5 7.2v4.05a.75.75 0 01-1.5 0v-8.5a.75.75 0 011.5 0V6.8a.494.494 0 01.198-.227l7.541-4.608\
A.5.5 0 0112 2.39v9.217a.5.5 0 01-.76.427z",
      fill: e
    }
  )
)), Gy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M2.76 12.035l7.542-4.608A.495.495 0 0010.5 7.2v4.05a.75.75 0 001.5 0v-8.5a.75.75 0 00-1.5 0V6.8a.495.495 0 00-.198-.227L2.76 1.965\
A.5.5 0 002 2.39v9.217a.5.5 0 00.76.427z",
      fill: e
    }
  )
)), Yy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M9 2.42v2.315l4.228-2.736a.5.5 0 01.772.42v9.162a.5.5 0 01-.772.42L9 9.263v2.317a.5.5 0 01-.772.42L1.5 7.647v3.603a.75.75 0 01-1.5\
 0v-8.5a.75.75 0 011.5 0v3.603L8.228 2A.5.5 0 019 2.42z",
      fill: e
    }
  )
)), Xy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M5 2.42v2.315L.772 1.999a.5.5 0 00-.772.42v9.162a.5.5 0 00.772.42L5 9.263v2.317a.5.5 0 00.772.42L12.5 7.647v3.603a.75.75 0 001.5 0\
v-8.5a.75.75 0 00-1.5 0v3.603L5.772 2A.5.5 0 005 2.42z",
      fill: e
    }
  )
)), Zy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1 1.504a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11z",
      fill: e
    }
  )
)), Ky = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("g", { clipPath: "url(#prefix__clip0_1107_3492)", fill: e }, /* @__PURE__ */ s.createElement("path", { d: "\
M7.5.5a.5.5 0 00-1 0V2a.5.5 0 001 0V.5z" }), /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 10a3 3 0 100-6 3 3 0 000 6zm0-1a2 2 0 100-4 2 2 0 000 4z"
    }
  ), /* @__PURE__ */ s.createElement("path", { d: "M7 11.5a.5.5 0 01.5.5v1.5a.5.5 0 01-1 0V12a.5.5 0 01.5-.5zM11.5 7a.5.5 0 01.5-.5h1.5a.5.5\
 0 010 1H12a.5.5 0 01-.5-.5zM.5 6.5a.5.5 0 000 1H2a.5.5 0 000-1H.5zM3.818 10.182a.5.5 0 010 .707l-1.06 1.06a.5.5 0 11-.708-.706l1.06-1.06a.5\
.5 0 01.708 0zM11.95 2.757a.5.5 0 10-.707-.707l-1.061 1.061a.5.5 0 10.707.707l1.06-1.06zM10.182 10.182a.5.5 0 01.707 0l1.06 1.06a.5.5 0 11-.\
706.708l-1.061-1.06a.5.5 0 010-.708zM2.757 2.05a.5.5 0 10-.707.707l1.06 1.061a.5.5 0 00.708-.707l-1.06-1.06z" })),
  /* @__PURE__ */ s.createElement("defs", null, /* @__PURE__ */ s.createElement("clipPath", { id: "prefix__clip0_1107_3492" }, /* @__PURE__ */ s.createElement(
  "path", { fill: "#fff", d: "M0 0h14v14H0z" })))
)), Jy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 15 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("g", { clipPath: "url(#prefix__clip0_1107_3493)" }, /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M8.335.047l-.15-.015a7.499 7.499 0 106.14 10.577c.103-.229-.156-.447-.386-.346a5.393 5.393 0 01-.771.27A5.356 5.356 0 019.153.691C\
9.37.568 9.352.23 9.106.175a7.545 7.545 0 00-.77-.128zM6.977 1.092a6.427 6.427 0 005.336 10.671A6.427 6.427 0 116.977 1.092z",
      fill: e
    }
  )),
  /* @__PURE__ */ s.createElement("defs", null, /* @__PURE__ */ s.createElement("clipPath", { id: "prefix__clip0_1107_3493" }, /* @__PURE__ */ s.createElement(
    "path",
    {
      fill: "#fff",
      transform: "scale(1.07124)",
      d: "M0 0h14.001v14.002H0z"
    }
  )))
)), Qy = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M2.2 2.204v9.6h9.6v-9.6H2.2zm-.7-1.2a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5h-11z",
      fill: e
    }
  )
)), e8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M4.2 10.88L10.668 7 4.2 3.12v7.76zM3 2.414v9.174a.8.8 0 001.212.686l7.645-4.587a.8.8 0 000-1.372L4.212 1.727A.8.8 0 003 2.413z",
      fill: e
    }
  )
)), t8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M5.2 10.88L11.668 7 5.2 3.12v7.76zM4 2.414v9.174a.8.8 0 001.212.686l7.645-4.587a.8.8 0 000-1.372L5.212 1.727A.8.8 0 004 2.413zM1.5\
 1.6a.6.6 0 01.6.6v9.6a.6.6 0 11-1.2 0V2.2a.6.6 0 01.6-.6z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M.963 1.932a.6.6 0 01.805-.268l1 .5a.6.6 0 01-.536 1.073l-1-.5a.6.6 0 01-.269-.805zM3.037 11.132a.6.6 0 01-.269.805l-1 .5a.6.6 0 0\
1-.536-1.073l1-.5a.6.6 0 01.805.268z",
      fill: e
    }
  )
)), r8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M4.5 4a.5.5 0 00-.5.5v5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5v-5a.5.5 0 00-.5-.5h-5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7A7 7 0 110 7a7 7 0 0114 0zm-1 0A6 6 0 111 7a6 6 0 0112 0z",
      fill: e
    }
  )
)), n8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1 1.504a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11zm1 10.5v-10h5v10H2z",
      fill: e
    }
  )
)), o8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M12.5 1.004a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5h11zm-10.5 1h10v5H2v-5z",
      fill: e
    }
  )
)), a8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M13 2a2 2 0 00-2-2H1.5a.5.5 0 00-.5.5v13a.5.5 0 00.5.5H11a2 2 0 002-2V2zM3 13h8a1 1 0 001-1V2a1 1 0 00-1-1H7v6.004a.5.5 0 01-.856.\
352l-.002-.002L5.5 6.71l-.645.647A.5.5 0 014 7.009V1H3v12zM5 1v4.793l.146-.146a.5.5 0 01.743.039l.111.11V1H5z",
      fill: e
    }
  )
)), i8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M4 5.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zM4.5 7.5a.5.5 0 000 1h5a.5.5 0 000-1h-5zM4 10.5a.5.5 0 01.5-.5h5a.5.5 0 01\
0 1h-5a.5.5 0 01-.5-.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1.5 0a.5.5 0 00-.5.5v13a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V3.207a.5.5 0 00-.146-.353L10.146.146A.5.5 0 009.793 0H1.5zM2 1h7.5v2a.5.5\
 0 00.5.5h2V13H2V1z",
      fill: e
    }
  )
)), l8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M11.746.07A.5.5 0 0011.5.003h-6a.5.5 0 00-.5.5v2.5H.5a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h8a.5.5 0 00.5-.5v-2.5h4.5a.5.5 0 00.5-.5v-8a\
.498.498 0 00-.15-.357L11.857.154a.506.506 0 00-.11-.085zM9 10.003h4v-7h-1.5a.5.5 0 01-.5-.5v-1.5H6v2h.5a.5.5 0 01.357.15L8.85 5.147c.093.09\
.15.217.15.357v4.5zm-8-6v9h7v-7H6.5a.5.5 0 01-.5-.5v-1.5H1z",
      fill: e
    }
  )
)), s8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M3 1.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zM2 3.504a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1 5.5a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-7zM2 12V6h10v6H2z",
      fill: e
    }
  )
)), u8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M6.586 3.504l-1.5-1.5H1v9h12v-7.5H6.586zm.414-1L5.793 1.297a1 1 0 00-.707-.293H.5a.5.5 0 00-.5.5v10a.5.5 0 00.5.5h13a.5.5 0 00.5-.\
5v-8.5a.5.5 0 00-.5-.5H7z",
      fill: e
    }
  )
)), c8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M4.5 8.004a.5.5 0 100 1h5a.5.5 0 000-1h-5zM4.5 10.004a.5.5 0 000 1h5a.5.5 0 000-1h-5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M2 1.504a.5.5 0 01.5-.5h8a.498.498 0 01.357.15l.993.993c.093.09.15.217.15.357v1.5h1.5a.5.5 0 01.5.5v5a.5.5 0 01-.5.5H12v2.5a.5.5 0\
 01-.5.5h-9a.5.5 0 01-.5-.5v-2.5H.5a.5.5 0 01-.5-.5v-5a.5.5 0 01.5-.5H2v-2.5zm11 7.5h-1v-2.5a.5.5 0 00-.5-.5h-9a.5.5 0 00-.5.5v2.5H1v-4h12v4\
zm-2-6v1H3v-2h7v.5a.5.5 0 00.5.5h.5zm-8 9h8v-5H3v5z",
      fill: e
    }
  )
)), p8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M5.146 6.15a.5.5 0 01.708 0L7 7.297 9.146 5.15a.5.5 0 01.708 0l1 1a.5.5 0 01-.708.707L9.5 6.211 7.354 8.357a.5.5 0 01-.708 0L5.5 7\
.211 3.854 8.857a.5.5 0 11-.708-.707l2-2z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1.5 1.004a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5h-11zm.5 1v10h10v-10H2z",
      fill: e
    }
  )
)), d8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3.5 0a.5.5 0 01.5.5V1h6V.5a.5.5 0 011 0V1h1.5a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H3V.5a.5.5 0 \
01.5-.5zM2 4v2.3h3V4H2zm0 5.2V6.8h3v2.4H2zm0 .5V12h3V9.7H2zm3.5 0V12h3V9.7h-3zm3.5 0V12h3V9.7H9zm3-.5H9V6.8h3v2.4zm-3.5 0h-3V6.8h3v2.4zM9 4v\
2.3h3V4H9zM5.5 6.3h3V4h-3v2.3z",
      fill: e
    }
  )
)), f8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M12 2.5a.5.5 0 00-1 0v10a.5.5 0 001 0v-10zM9 4.5a.5.5 0 00-1 0v8a.5.5 0 001 0v-8zM5.5 7a.5.5 0 01.5.5v5a.5.5 0 01-1 0v-5a.5.5 0 01\
.5-.5zM3 10.5a.5.5 0 00-1 0v2a.5.5 0 001 0v-2z",
      fill: e
    }
  )
)), h8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M13 2a.5.5 0 010 1H1a.5.5 0 010-1h12zM10 5a.5.5 0 010 1H1a.5.5 0 010-1h9zM11.5 8.5A.5.5 0 0011 8H1a.5.5 0 000 1h10a.5.5 0 00.5-.5z\
M7.5 11a.5.5 0 010 1H1a.5.5 0 010-1h6.5z",
      fill: e
    }
  )
)), m8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1 2a.5.5 0 000 1h12a.5.5 0 000-1H1zM4 5a.5.5 0 000 1h9a.5.5 0 000-1H4zM2.5 8.5A.5.5 0 013 8h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zM6.\
5 11a.5.5 0 000 1H13a.5.5 0 000-1H6.5z",
      fill: e
    }
  )
)), g8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1 2a.5.5 0 000 1h12a.5.5 0 000-1H1zM3 5a.5.5 0 000 1h8a.5.5 0 000-1H3zM4.5 8.5A.5.5 0 015 8h4a.5.5 0 010 1H5a.5.5 0 01-.5-.5zM6.5\
 11a.5.5 0 000 1h1a.5.5 0 000-1h-1z",
      fill: e
    }
  )
)), v8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1 1.5a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11zM2 4v2.3h3V4H2zm0 5.2V6.8h3v2.4H2zm0 .5V12h3V9.7H\
2zm3.5 0V12h3V9.7h-3zm3.5 0V12h3V9.7H9zm3-.5H9V6.8h3v2.4zm-3.5 0h-3V6.8h3v2.4zM9 6.3h3V4H9v2.3zm-3.5 0h3V4h-3v2.3z",
      fill: e
    }
  )
)), w8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M3.5 6.5A.5.5 0 014 6h6a.5.5 0 010 1H4a.5.5 0 01-.5-.5zM4 9a.5.5 0 000 1h6a.5.5 0 000-1H4z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1 1.5a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11zM2 4v8h10V4H2z",
      fill: e
    }
  )
)), b8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M13 4a.5.5 0 010 1H1a.5.5 0 010-1h12zM13.5 9.5A.5.5 0 0013 9H1a.5.5 0 000 1h12a.5.5 0 00.5-.5z",
      fill: e
    }
  )
)), y8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M13 3.5a.5.5 0 010 1H1a.5.5 0 010-1h12zM13.5 10a.5.5 0 00-.5-.5H1a.5.5 0 000 1h12a.5.5 0 00.5-.5zM13 6.5a.5.5 0 010 1H1a.5.5 0 010\
-1h12z",
      fill: e
    }
  )
)), D8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M8.982 1.632a.5.5 0 00-.964-.263l-3 11a.5.5 0 10.964.263l3-11zM3.32 3.616a.5.5 0 01.064.704L1.151 7l2.233 2.68a.5.5 0 11-.768.64l-\
2.5-3a.5.5 0 010-.64l2.5-3a.5.5 0 01.704-.064zM10.68 3.616a.5.5 0 00-.064.704L12.849 7l-2.233 2.68a.5.5 0 00.768.64l2.5-3a.5.5 0 000-.64l-2.\
5-3a.5.5 0 00-.704-.064z",
      fill: e
    }
  )
)), x8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3 2v1.5h1v7H3V12h5a3 3 0 001.791-5.407A2.75 2.75 0 008 2.011V2H3zm5 5.5H5.5v3H8a1.5 1.5 0 100-3zm-.25-4H5.5V6h2.25a1.25 1.25 0 10\
0-2.5z",
      fill: e
    }
  )
)), C8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("path", { d: "M5 2h6v1H8.5l-2 8H9v1H3v-1h2.5l2-8H5V2z", fill: e })
)), E8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M10.553 2.268a1.5 1.5 0 00-2.12 0L2.774 7.925a2.5 2.5 0 003.536 3.535l3.535-3.535a.5.5 0 11.707.707l-3.535 3.536-.002.002a3.5 3.5 \
0 01-4.959-4.941l.011-.011L7.725 1.56l.007-.008a2.5 2.5 0 013.53 3.541l-.002.002-5.656 5.657-.003.003a1.5 1.5 0 01-2.119-2.124l3.536-3.536a.\
5.5 0 11.707.707L4.189 9.34a.5.5 0 00.707.707l5.657-5.657a1.5 1.5 0 000-2.121z",
      fill: e
    }
  )
)), R8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M5 2.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zM5 7a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7A.5.5 0 015 7zM5.5 11a.5.5 0 000 1h7a\
.5.5 0 000-1h-7zM2.5 2H1v1h1v3h1V2.5a.5.5 0 00-.5-.5zM3 8.5v1a.5.5 0 01-1 0V9h-.5a.5.5 0 010-1h1a.5.5 0 01.5.5zM2 10.5a.5.5 0 00-1 0V12h2v-1\
H2v-.5z",
      fill: e
    }
  )
)), S8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M2.75 2.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM5.5 2a.5.5 0 000 1h7a.5.5 0 000-1h-7zM5.5 11a.5.5 0 000 1h7a.5.5 0 000-1h-7zM2 12.25\
a.75.75 0 100-1.5.75.75 0 000 1.5zM5 7a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7A.5.5 0 015 7zM2 7.75a.75.75 0 100-1.5.75.75 0 000 1.5z",
      fill: e
    }
  )
)), A8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M6 7a3 3 0 110-6h5.5a.5.5 0 010 1H10v10.5a.5.5 0 01-1 0V2H7v10.5a.5.5 0 01-1 0V7z",
      fill: e
    }
  )
)), F8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M2 4.5h1.5L5 6.375 6.5 4.5H8v5H6.5V7L5 8.875 3.5 7v2.5H2v-5zM9.75 4.5h1.5V7h1.25l-2 2.5-2-2.5h1.25V4.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M.5 2a.5.5 0 00-.5.5v9a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-9a.5.5 0 00-.5-.5H.5zM1 3v8h12V3H1z",
      fill: e
    }
  )
)), k8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M5 2.5a.5.5 0 11-1 0 .5.5 0 011 0zM4.5 5a.5.5 0 100-1 .5.5 0 000 1zM5 6.5a.5.5 0 11-1 0 .5.5 0 011 0z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M11 0a2 2 0 012 2v10a2 2 0 01-2 2H1.5a.5.5 0 01-.5-.5V.5a.5.5 0 01.5-.5H11zm0 1H3v12h8a1 1 0 001-1V2a1 1 0 00-1-1z",
      fill: e
    }
  )
)), L8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3.031 7.5a4 4 0 007.938 0H13.5a.5.5 0 000-1h-2.53a4 4 0 00-7.94 0H.501a.5.5 0 000 1h2.531zM7 10a3 3 0 100-6 3 3 0 000 6z",
      fill: e
    }
  )
)), T8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M6 2.5a1.5 1.5 0 01-1 1.415v4.053C5.554 7.4 6.367 7 7.5 7c.89 0 1.453-.252 1.812-.557.218-.184.374-.4.482-.62a1.5 1.5 0 111.026.14\
3c-.155.423-.425.87-.86 1.24C9.394 7.685 8.59 8 7.5 8c-1.037 0-1.637.42-1.994.917a2.81 2.81 0 00-.472 1.18A1.5 1.5 0 114 10.086v-6.17A1.5 1.\
5 0 116 2.5zm-2 9a.5.5 0 111 0 .5.5 0 01-1 0zm1-9a.5.5 0 11-1 0 .5.5 0 011 0zm6 2a.5.5 0 11-1 0 .5.5 0 011 0z",
      fill: e
    }
  )
)), I8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M8.354 1.354L7.707 2H8.5A2.5 2.5 0 0111 4.5v5.585a1.5 1.5 0 11-1 0V4.5A1.5 1.5 0 008.5 3h-.793l.647.646a.5.5 0 11-.708.708l-1.5-1.\
5a.5.5 0 010-.708l1.5-1.5a.5.5 0 11.708.708zM11 11.5a.5.5 0 11-1 0 .5.5 0 011 0zM4 3.915a1.5 1.5 0 10-1 0v6.17a1.5 1.5 0 101 0v-6.17zM3.5 11\
a.5.5 0 100 1 .5.5 0 000-1zm0-8a.5.5 0 100-1 .5.5 0 000 1z",
      fill: e
    }
  )
)), B8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M4.108 3.872A1.5 1.5 0 103 3.915v6.17a1.5 1.5 0 101 0V6.41c.263.41.573.77.926 1.083 1.108.98 2.579 1.433 4.156 1.5A1.5 1.5 0 109.0\
9 7.99c-1.405-.065-2.62-.468-3.5-1.248-.723-.64-1.262-1.569-1.481-2.871zM3.5 11a.5.5 0 100 1 .5.5 0 000-1zM4 2.5a.5.5 0 11-1 0 .5.5 0 011 0z\
m7 6a.5.5 0 11-1 0 .5.5 0 011 0z",
      fill: e
    }
  )
)), M8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M11.03 8.103a3.044 3.044 0 01-.202-1.744 2.697 2.697 0 011.4-1.935c-.749-1.18-1.967-1.363-2.35-1.403-.835-.086-2.01.56-2.648.57h-.\
016c-.639-.01-1.814-.656-2.649-.57-.415.044-1.741.319-2.541 1.593-.281.447-.498 1.018-.586 1.744a6.361 6.361 0 00-.044.85c.005.305.028.604.0\
7.895.09.62.259 1.207.477 1.744.242.595.543 1.13.865 1.585.712 1.008 1.517 1.59 1.971 1.6.934.021 1.746-.61 2.416-.594.006.002.014.003.02.00\
2h.017c.007 0 .014 0 .021-.002.67-.017 1.481.615 2.416.595.453-.011 1.26-.593 1.971-1.6a7.95 7.95 0 00.97-1.856c-.697-.217-1.27-.762-1.578-1\
.474zm-2.168-5.97c.717-.848.69-2.07.624-2.125-.065-.055-1.25.163-1.985.984-.735.82-.69 2.071-.624 2.125.064.055 1.268-.135 1.985-.984z",
      fill: e
    }
  )
)), _8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 0a3 3 0 013 3v1.24c.129.132.25.27.362.415.113.111.283.247.515.433l.194.155c.325.261.711.582 1.095.966.765.765 1.545 1.806 1.823\
 3.186a.501.501 0 01-.338.581 3.395 3.395 0 01-1.338.134 2.886 2.886 0 01-1.049-.304 5.535 5.535 0 01-.17.519 2 2 0 11-2.892 2.55A5.507 5.50\
7 0 017 13c-.439 0-.838-.044-1.201-.125a2 2 0 11-2.892-2.55 5.553 5.553 0 01-.171-.519c-.349.182-.714.27-1.05.304A3.395 3.395 0 01.35 9.977a\
.497.497 0 01-.338-.582c.278-1.38 1.058-2.42 1.823-3.186.384-.384.77-.705 1.095-.966l.194-.155c.232-.186.402-.322.515-.433.112-.145.233-.283\
.362-.414V3a3 3 0 013-3zm1.003 11.895a2 2 0 012.141-1.89c.246-.618.356-1.322.356-2.005 0-.514-.101-1.07-.301-1.599l-.027-.017a6.387 6.387 0 \
00-.857-.42 6.715 6.715 0 00-1.013-.315l-.852.638a.75.75 0 01-.9 0l-.852-.638a6.716 6.716 0 00-1.693.634 4.342 4.342 0 00-.177.101l-.027.017\
A4.6 4.6 0 003.501 8c0 .683.109 1.387.355 2.005a2 2 0 012.142 1.89c.295.067.627.105 1.002.105s.707-.038 1.003-.105zM5 12a1 1 0 11-2 0 1 1 0 \
012 0zm6 0a1 1 0 11-2 0 1 1 0 012 0zM6.1 4.3a1.5 1.5 0 011.8 0l.267.2L7 5.375 5.833 4.5l.267-.2zM8.5 2a.5.5 0 01.5.5V3a.5.5 0 01-1 0v-.5a.5.\
5 0 01.5-.5zM6 2.5a.5.5 0 00-1 0V3a.5.5 0 001 0v-.5z",
      fill: e
    }
  )
)), P8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("g", { clipPath: "url(#prefix__clip0_1107_3497)", fill: e }, /* @__PURE__ */ s.createElement("path", { d: "\
M12.261 2.067c0 1.142-.89 2.068-1.988 2.068-1.099 0-1.99-.926-1.99-2.068C8.283.926 9.174 0 10.273 0c1.098 0 1.989.926 1.989 2.067zM3.978 6.6\
c0 1.142-.89 2.068-1.989 2.068C.891 8.668 0 7.742 0 6.601c0-1.142.89-2.068 1.989-2.068 1.099 0 1.989.926 1.989 2.068zM6.475 11.921A4.761 4.7\
61 0 014.539 11a4.993 4.993 0 01-1.367-1.696 2.765 2.765 0 01-1.701.217 6.725 6.725 0 001.844 2.635 6.379 6.379 0 004.23 1.577 3.033 3.033 0\
 01-.582-1.728 4.767 4.767 0 01-.488-.083zM11.813 11.933c0 1.141-.89 2.067-1.989 2.067-1.098 0-1.989-.926-1.989-2.067 0-1.142.891-2.068 1.99\
-2.068 1.098 0 1.989.926 1.989 2.068zM12.592 11.173a6.926 6.926 0 001.402-3.913 6.964 6.964 0 00-1.076-4.023A2.952 2.952 0 0111.8 4.6c.398.7\
8.592 1.656.564 2.539a5.213 5.213 0 01-.724 2.495c.466.396.8.935.952 1.54zM1.987 3.631c-.05 0-.101.002-.151.004C3.073 1.365 5.504.024 8.005.\
23a3.07 3.07 0 00-.603 1.676 4.707 4.707 0 00-2.206.596 4.919 4.919 0 00-1.7 1.576 2.79 2.79 0 00-1.509-.447z" })),
  /* @__PURE__ */ s.createElement("defs", null, /* @__PURE__ */ s.createElement("clipPath", { id: "prefix__clip0_1107_3497" }, /* @__PURE__ */ s.createElement(
  "path", { fill: "#fff", d: "M0 0h14v14H0z" })))
)), H8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M6.5 1H1v5.5h5.5V1zM13 1H7.5v5.5H13V1zM7.5 7.5H13V13H7.5V7.5zM6.5 7.5H1V13h5.5V7.5z",
      fill: e
    }
  )
)), z8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("g", { clipPath: "url(#prefix__clip0_1107_3496)" }, /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M13.023 3.431a.115.115 0 01-.099.174H7.296A3.408 3.408 0 003.7 6.148a.115.115 0 01-.21.028l-1.97-3.413a.115.115 0 01.01-.129A6.97 \
6.97 0 017 0a6.995 6.995 0 016.023 3.431zM7 9.615A2.619 2.619 0 014.384 7 2.62 2.62 0 017 4.383 2.619 2.619 0 019.616 7 2.619 2.619 0 017 9.\
615zm1.034.71a.115.115 0 00-.121-.041 3.4 3.4 0 01-.913.124 3.426 3.426 0 01-3.091-1.973L1.098 3.567a.115.115 0 00-.2.001 7.004 7.004 0 005.\
058 10.354l.017.001c.04 0 .078-.021.099-.057l1.971-3.414a.115.115 0 00-.009-.128zm1.43-5.954h3.947c.047 0 .09.028.107.072.32.815.481 1.675.4\
81 2.557a6.957 6.957 0 01-2.024 4.923A6.957 6.957 0 017.08 14h-.001a.115.115 0 01-.1-.172L9.794 8.95A3.384 3.384 0 0010.408 7c0-.921-.364-1.\
785-1.024-2.433a.115.115 0 01.08-.196z",
      fill: e
    }
  )),
  /* @__PURE__ */ s.createElement("defs", null, /* @__PURE__ */ s.createElement("clipPath", { id: "prefix__clip0_1107_3496" }, /* @__PURE__ */ s.createElement(
  "path", { fill: "#fff", d: "M0 0h14v14H0z" })))
)), O8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M2.042.616a.704.704 0 00-.66.729L1.816 12.9c.014.367.306.66.672.677l9.395.422h.032a.704.704 0 00.704-.703V.704c0-.015 0-.03-.002-.\
044a.704.704 0 00-.746-.659l-.773.049.057 1.615a.105.105 0 01-.17.086l-.52-.41-.617.468a.105.105 0 01-.168-.088L9.746.134 2.042.616zm8.003 4\
.747c-.247.192-2.092.324-2.092.05.04-1.045-.429-1.091-.689-1.091-.247 0-.662.075-.662.634 0 .57.607.893 1.32 1.27 1.014.538 2.24 1.188 2.24 \
2.823 0 1.568-1.273 2.433-2.898 2.433-1.676 0-3.141-.678-2.976-3.03.065-.275 2.197-.21 2.197 0-.026.971.195 1.256.753 1.256.43 0 .624-.236.6\
24-.634 0-.602-.633-.958-1.361-1.367-.987-.554-2.148-1.205-2.148-2.7 0-1.494 1.027-2.489 2.86-2.489 1.832 0 2.832.98 2.832 2.845z",
      fill: e
    }
  )
)), N8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("g", { clipPath: "url(#prefix__clip0_1107_3503)" }, /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M0 5.176l1.31-1.73 4.902-1.994V.014l4.299 3.144-8.78 1.706v4.8L0 9.162V5.176zm14-2.595v8.548l-3.355 2.857-5.425-1.783v1.783L1.73 9\
.661l8.784 1.047v-7.55L14 2.581z",
      fill: e
    }
  )),
  /* @__PURE__ */ s.createElement("defs", null, /* @__PURE__ */ s.createElement("clipPath", { id: "prefix__clip0_1107_3503" }, /* @__PURE__ */ s.createElement(
  "path", { fill: "#fff", d: "M0 0h14v14H0z" })))
)), $8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1 1.522a.411.411 0 00-.412.476l1.746 10.597a.56.56 0 00.547.466h8.373a.411.411 0 00.412-.345l1.017-6.248h-3.87L8.35 9.18H5.677l-.\
724-3.781h7.904L13.412 2A.411.411 0 0013 1.524L1 1.522z",
      fill: e
    }
  )
)), V8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M0 7a7 7 0 1014 0A7 7 0 000 7zm5.215-3.869a1.967 1.967 0 013.747.834v1.283l-3.346-1.93a2.486 2.486 0 00-.401-.187zm3.484 2.58l-3.3\
46-1.93a1.968 1.968 0 00-2.685.72 1.954 1.954 0 00.09 2.106 2.45 2.45 0 01.362-.254l1.514-.873a.27.27 0 01.268 0l2.1 1.21 1.697-.978zm-.323 \
4.972L6.86 9.81a.268.268 0 01-.134-.231V7.155l-1.698-.98v3.86a1.968 1.968 0 003.747.835 2.488 2.488 0 01-.4-.187zm.268-.464a1.967 1.967 0 00\
2.685-.719 1.952 1.952 0 00-.09-2.106c-.112.094-.233.18-.361.253L7.53 9.577l1.113.642zm-4.106.257a1.974 1.974 0 01-1.87-.975A1.95 1.95 0 012\
.47 8.01c.136-.507.461-.93.916-1.193L4.5 6.175v3.86c0 .148.013.295.039.44zM11.329 4.5a1.973 1.973 0 00-1.87-.976c.025.145.039.292.039.44v1.7\
47a.268.268 0 01-.135.232l-2.1 1.211v1.96l3.346-1.931a1.966 1.966 0 00.72-2.683z",
      fill: e
    }
  )
)), j8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M10.847 2.181L8.867.201a.685.685 0 00-.97 0l-4.81 4.81a.685.685 0 000 .969l2.466 2.465-2.405 2.404a.685.685 0 000 .97l1.98 1.98a.6\
85.685 0 00.97 0l4.81-4.81a.685.685 0 000-.969L8.441 5.555l2.405-2.404a.685.685 0 000-.97z",
      fill: e
    }
  )
)), W8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M11.852 2.885c-.893-.41-1.85-.712-2.85-.884a.043.043 0 00-.046.021c-.123.22-.26.505-.355.73a10.658 10.658 0 00-3.2 0 7.377 7.377 0\
 00-.36-.73.045.045 0 00-.046-.021c-1 .172-1.957.474-2.85.884a.04.04 0 00-.019.016C.311 5.612-.186 8.257.058 10.869a.048.048 0 00.018.033 11\
.608 11.608 0 003.496 1.767.045.045 0 00.049-.016c.27-.368.51-.755.715-1.163a.044.044 0 00-.024-.062 7.661 7.661 0 01-1.092-.52.045.045 0 01\
-.005-.075c.074-.055.147-.112.217-.17a.043.043 0 01.046-.006c2.29 1.046 4.771 1.046 7.035 0a.043.043 0 01.046.006c.07.057.144.115.218.17a.04\
5.045 0 01-.004.075 7.186 7.186 0 01-1.093.52.045.045 0 00-.024.062c.21.407.45.795.715 1.162.011.016.03.023.05.017a11.57 11.57 0 003.5-1.767\
.045.045 0 00.019-.032c.292-3.02-.49-5.643-2.07-7.969a.036.036 0 00-.018-.016zM4.678 9.279c-.69 0-1.258-.634-1.258-1.411 0-.778.558-1.411 1.\
258-1.411.707 0 1.27.639 1.259 1.41 0 .778-.558 1.412-1.259 1.412zm4.652 0c-.69 0-1.258-.634-1.258-1.411 0-.778.557-1.411 1.258-1.411.707 0 \
1.27.639 1.258 1.41 0 .778-.551 1.412-1.258 1.412z",
      fill: e
    }
  )
)), q8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7.399 14H5.06V7H3.5V4.588l1.56-.001-.002-1.421C5.058 1.197 5.533 0 7.6 0h1.721v2.413H8.246c-.805 0-.844.337-.844.966l-.003 1.208h\
1.934l-.228 2.412L7.401 7l-.002 7z",
      fill: e
    }
  )
)), U8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M9.2 0H4.803A2.603 2.603 0 003.41 4.802a2.603 2.603 0 000 4.396 2.602 2.602 0 103.998 2.199v-2.51a2.603 2.603 0 103.187-4.085A2.60\
4 2.604 0 009.2 0zM7.407 7a1.793 1.793 0 103.586 0 1.793 1.793 0 00-3.586 0zm-.81 2.603H4.803a1.793 1.793 0 101.794 1.794V9.603zM4.803 4.397\
h1.794V.81H4.803a1.793 1.793 0 000 3.587zm0 .81a1.793 1.793 0 000 3.586h1.794V5.207H4.803zm4.397-.81H7.407V.81H9.2a1.794 1.794 0 010 3.587z",
      fill: e
    }
  )
)), G8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M6.37 8.768l-2.042 3.537h6.755l2.042-3.537H6.37zm6.177-1.003l-3.505-6.07H4.96l3.504 6.07h4.084zM4.378 2.7L.875 8.77l2.042 3.536L6.\
42 6.236 4.378 2.7z",
      fill: e
    }
  )
)), Y8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 0C3.132 0 0 3.132 0 7a6.996 6.996 0 004.786 6.641c.35.062.482-.149.482-.332 0-.166-.01-.718-.01-1.304-1.758.324-2.213-.429-2.35\
3-.823-.079-.2-.42-.822-.717-.988-.246-.132-.596-.455-.01-.464.552-.009.946.508 1.077.717.63 1.06 1.636.762 2.039.578.061-.455.245-.761.446-\
.936-1.558-.175-3.185-.779-3.185-3.457 0-.76.271-1.39.717-1.88-.07-.176-.314-.893.07-1.856 0 0 .587-.183 1.925.718a6.495 6.495 0 011.75-.236\
c.595 0 1.19.078 1.75.236 1.34-.91 1.926-.718 1.926-.718.385.963.14 1.68.07 1.855.446.49.717 1.111.717 1.881 0 2.687-1.636 3.282-3.194 3.457\
.254.218.473.638.473 1.295 0 .936-.009 1.688-.009 1.925 0 .184.131.402.481.332A7.012 7.012 0 0014 7c0-3.868-3.133-7-7-7z",
      fill: e
    }
  )
)), X8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1.068 5.583l1.487-4.557a.256.256 0 01.487 0L4.53 5.583H1.068L7 13.15 4.53 5.583h4.941l-2.47 7.565 5.931-7.565H9.471l1.488-4.557a.\
256.256 0 01.486 0l1.488 4.557.75 2.3a.508.508 0 01-.185.568L7 13.148v.001H7L.503 8.452a.508.508 0 01-.186-.57l.75-2.299z",
      fill: e
    }
  )
)), Z8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M10.925 1.094H7.262c-1.643 0-3.189 1.244-3.189 2.685 0 1.473 1.12 2.661 2.791 2.661.116 0 .23-.002.34-.01a1.49 1.49 0 00-.186.684c\
0 .41.22.741.498 1.012-.21 0-.413.006-.635.006-2.034 0-3.6 1.296-3.6 2.64 0 1.323 1.717 2.15 3.75 2.15 2.32 0 3.6-1.315 3.6-2.639 0-1.06-.31\
3-1.696-1.28-2.38-.331-.235-.965-.805-.965-1.14 0-.392.112-.586.703-1.047.606-.474 1.035-1.14 1.035-1.914 0-.92-.41-1.819-1.18-2.115h1.161l.\
82-.593zm-1.335 8.96c.03.124.045.25.045.378 0 1.07-.688 1.905-2.665 1.905-1.406 0-2.421-.89-2.421-1.96 0-1.047 1.259-1.92 2.665-1.904.328.00\
4.634.057.911.146.764.531 1.311.832 1.465 1.436zM7.34 6.068c-.944-.028-1.841-1.055-2.005-2.295-.162-1.24.47-2.188 1.415-2.16.943.029 1.84 1.\
023 2.003 2.262.163 1.24-.47 2.222-1.414 2.193z",
      fill: e
    }
  )
)), K8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7.873 11.608a1.167 1.167 0 00-1.707-.027L3.46 10.018l.01-.04h7.072l.022.076-2.69 1.554zM6.166 2.42l.031.03-3.535 6.124a1.265 1.26\
5 0 00-.043-.012V5.438a1.166 1.166 0 00.84-1.456L6.167 2.42zm4.387 1.562a1.165 1.165 0 00.84 1.456v3.124l-.043.012-3.536-6.123a1.2 1.2 0 00.\
033-.032l2.706 1.563zM3.473 9.42a1.168 1.168 0 00-.327-.568L6.68 2.73a1.17 1.17 0 00.652 0l3.536 6.123a1.169 1.169 0 00-.327.567H3.473zm8.79\
-.736a1.169 1.169 0 00-.311-.124V5.44a1.17 1.17 0 10-1.122-1.942L8.13 1.938a1.168 1.168 0 00-1.122-1.5 1.17 1.17 0 00-1.121 1.5l-2.702 1.56a\
1.168 1.168 0 00-1.86.22 1.17 1.17 0 00.739 1.722v3.12a1.168 1.168 0 00-.74 1.721 1.17 1.17 0 001.861.221l2.701 1.56a1.169 1.169 0 102.233-.\
035l2.687-1.552a1.168 1.168 0 101.457-1.791z",
      fill: e
    }
  )
)), J8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M0 0v14h14V0H0zm11.63 3.317l-.75.72a.22.22 0 00-.083.212v-.001 5.289a.22.22 0 00.083.21l.733.72v.159H7.925v-.158l.76-.738c.074-.07\
4.074-.096.074-.21V5.244l-2.112 5.364h-.285l-2.46-5.364V8.84a.494.494 0 00.136.413h.001l.988 1.198v.158H2.226v-.158l.988-1.198a.477.477 0 00\
.126-.416v.003-4.157a.363.363 0 00-.118-.307l-.878-1.058v-.158h2.727l2.107 4.622L9.031 3.16h2.6v.158z",
      fill: e
    }
  )
)), Q8 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M4.06 9.689c.016.49.423.88.912.88h.032a.911.911 0 00.88-.945.916.916 0 00-.912-.88h-.033c-.033 0-.08 0-.113.016-.669-1.108-.946-2.\
314-.848-3.618.065-.978.391-1.825.961-2.526.473-.603 1.386-.896 2.005-.913 1.728-.032 2.461 2.119 2.51 2.983.212.049.57.163.815.244C10.073 2\
.29 8.444.92 6.88.92c-1.467 0-2.82 1.06-3.357 2.625-.75 2.086-.261 4.09.651 5.671a.74.74 0 00-.114.473zm8.279-2.298c-1.239-1.45-3.064-2.249-\
5.15-2.249h-.261a.896.896 0 00-.798-.489h-.033A.912.912 0 006.13 6.48h.031a.919.919 0 00.8-.554h.293c1.239 0 2.412.358 3.472 1.059.814.538 1\
.401 1.238 1.727 2.086.277.684.261 1.353-.033 1.923-.456.864-1.222 1.337-2.232 1.337a4.16 4.16 0 01-1.597-.343 9.58 9.58 0 01-.734.587c.7.32\
6 1.418.505 2.102.505 1.565 0 2.722-.863 3.162-1.727.473-.946.44-2.575-.782-3.961zm-7.433 5.51a4.005 4.005 0 01-.977.113c-1.206 0-2.298-.505\
-2.836-1.32C.376 10.603.13 8.289 2.494 6.577c.05.261.147.62.212.832-.31.228-.798.685-1.108 1.303-.44.864-.391 1.729.13 2.527.359.537.93.864 \
1.663.962.896.114 1.793-.05 2.657-.505 1.271-.669 2.119-1.467 2.672-2.56a.944.944 0 01-.26-.603.913.913 0 01.88-.945h.033a.915.915 0 01.098 \
1.825c-.897 1.842-2.478 3.08-4.565 3.488z",
      fill: e
    }
  )
)), e9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 2.547a5.632 5.632 0 01-1.65.464 2.946 2.946 0 001.263-1.63 5.67 5.67 0 01-1.823.715 2.837 2.837 0 00-2.097-.93c-1.586 0-2.872 \
1.319-2.872 2.946 0 .23.025.456.074.67C4.508 4.66 2.392 3.488.975 1.706c-.247.435-.389.941-.389 1.481 0 1.022.507 1.923 1.278 2.452a2.806 2.\
806 0 01-1.3-.368l-.001.037c0 1.427.99 2.617 2.303 2.888a2.82 2.82 0 01-1.297.05c.366 1.17 1.427 2.022 2.683 2.045A5.671 5.671 0 010 11.51a7\
.985 7.985 0 004.403 1.323c5.283 0 8.172-4.488 8.172-8.38 0-.128-.003-.255-.009-.38A5.926 5.926 0 0014 2.546z",
      fill: e
    }
  )
)), t9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M13.99 8.172c.005-.281.007-.672.007-1.172 0-.5-.002-.89-.007-1.172a14.952 14.952 0 00-.066-1.066 9.638 9.638 0 00-.169-1.153c-.083\
-.38-.264-.7-.542-.96a1.667 1.667 0 00-.972-.454C11.084 2.065 9.337 2 6.999 2s-4.085.065-5.241.195a1.65 1.65 0 00-.969.453c-.276.26-.455.58-\
.539.961a8.648 8.648 0 00-.176 1.153c-.039.43-.061.785-.066 1.066C.002 6.11 0 6.5 0 7c0 .5.002.89.008 1.172.005.281.027.637.066 1.067.04.43.\
095.813.168 1.152.084.38.265.7.543.96.279.261.603.412.973.453 1.156.13 2.902.196 5.24.196 2.34 0 4.087-.065 5.243-.196a1.65 1.65 0 00.967-.4\
53c.276-.26.456-.58.54-.96.077-.339.136-.722.175-1.152.04-.43.062-.786.067-1.067zM9.762 6.578A.45.45 0 019.997 7a.45.45 0 01-.235.422l-3.998\
 2.5a.442.442 0 01-.266.078.538.538 0 01-.242-.063.465.465 0 01-.258-.437v-5c0-.197.086-.343.258-.437a.471.471 0 01.508.016l3.998 2.5z",
      fill: e
    }
  )
)), r9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M10.243.04a.87.87 0 01.38.087l2.881 1.386a.874.874 0 01.496.79V11.713a.875.875 0 01-.496.775l-2.882 1.386a.872.872 0 01-.994-.17L4\
.11 8.674l-2.404 1.823a.583.583 0 01-.744-.034l-.771-.7a.583.583 0 010-.862L2.274 7 .19 5.1a.583.583 0 010-.862l.772-.701a.583.583 0 01.744-\
.033L4.11 5.327 9.628.296a.871.871 0 01.615-.255zm.259 3.784L6.315 7l4.187 3.176V3.824z",
      fill: e
    }
  )
)), n9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M11.667 13H2.333A1.333 1.333 0 011 11.667V2.333C1 1.597 1.597 1 2.333 1h9.334C12.403 1 13 1.597 13 2.333v9.334c0 .736-.597 1.333-1\
.333 1.333zm-2.114-1.667h1.78V7.675c0-1.548-.877-2.296-2.102-2.296-1.226 0-1.742.955-1.742.955v-.778H5.773v5.777h1.716V8.3c0-.812.374-1.296 \
1.09-1.296.658 0 .974.465.974 1.296v3.033zm-6.886-7.6c0 .589.474 1.066 1.058 1.066.585 0 1.058-.477 1.058-1.066 0-.589-.473-1.066-1.058-1.06\
6-.584 0-1.058.477-1.058 1.066zm1.962 7.6h-1.79V5.556h1.79v5.777z",
      fill: e
    }
  )
)), o9 = /* @__PURE__ */ s.forwardRef(
  ({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
    "svg",
    {
      width: t,
      height: t,
      viewBox: "0 0 14 14",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ref: n,
      ...r
    },
    /* @__PURE__ */ s.createElement(
      "path",
      {
        d: "M11.02.446h2.137L8.49 5.816l5.51 7.28H9.67L6.298 8.683l-3.88 4.413H.282l5.004-5.735L0 .446h4.442l3.064 4.048L11.02.446zm-.759 11\
.357h1.18L3.796 1.655H2.502l7.759 10.148z",
        fill: e
      }
    )
  )
), a9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M.5 13.004a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5h13a.5.5 0 01.5.5v11a.5.5 0 01-.5.5H.5zm.5-1v-8h12v8H1zm1-9.5a.5.5 0 11-1 0 .5.5 0 01\
1 0zm2 0a.5.5 0 11-1 0 .5.5 0 011 0zm2 0a.5.5 0 11-1 0 .5.5 0 011 0z",
      fill: e
    }
  )
)), i9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3.5.004a1.5 1.5 0 00-1.5 1.5v11a1.5 1.5 0 001.5 1.5h7a1.5 1.5 0 001.5-1.5v-11a1.5 1.5 0 00-1.5-1.5h-7zm0 1h7a.5.5 0 01.5.5v9.5H3v\
-9.5a.5.5 0 01.5-.5zm2.5 11a.5.5 0 000 1h2a.5.5 0 000-1H6z",
      fill: e
    }
  )
)), l9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3 1.504a1.5 1.5 0 011.5-1.5h5a1.5 1.5 0 011.5 1.5v11a1.5 1.5 0 01-1.5 1.5h-5a1.5 1.5 0 01-1.5-1.5v-11zm1 10.5v-10h6v10H4z",
      fill: e
    }
  )
)), s9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M4 .504a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm5.5 2.5h-5a.5.5 0 00-.5.5v7a.5.5 0 00.5.5h5a.5.5 0 00.5-.5v-7a.5.5 0 00-\
.5-.5zm-5-1a1.5 1.5 0 00-1.5 1.5v7a1.5 1.5 0 001.5 1.5h5a1.5 1.5 0 001.5-1.5v-7a1.5 1.5 0 00-1.5-1.5h-5zm2.5 2a.5.5 0 01.5.5v2h1a.5.5 0 110 \
1H7a.5.5 0 01-.5-.5v-2.5a.5.5 0 01.5-.5zm-2.5 9a.5.5 0 000 1h5a.5.5 0 000-1h-5z",
      fill: e
    }
  )
)), u9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M2.5 4.504a.5.5 0 01.5-.5h1a.5.5 0 110 1H3a.5.5 0 01-.5-.5zM3 6.004a.5.5 0 100 1h1a.5.5 0 000-1H3zM2.5 8.504a.5.5 0 01.5-.5h1a.5.5\
 0 110 1H3a.5.5 0 01-.5-.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1.5 13.004a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11zm.5-1v-10h3v10H2zm4-10h6v10H6v-10z",
      fill: e
    }
  )
)), c9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M9.5 4.504a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zM10 6.004a.5.5 0 100 1h1a.5.5 0 000-1h-1zM9.5 8.504a.5.5 0 01.5-.5h1a.\
5.5 0 010 1h-1a.5.5 0 01-.5-.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1.5 13.004a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11zm.5-1v-10h6v10H2zm7-10h3v10H9v-10z",
      fill: e
    }
  )
)), p9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M11.5 4.504a.5.5 0 00-.5-.5h-1a.5.5 0 100 1h1a.5.5 0 00.5-.5zM11 6.004a.5.5 0 010 1h-1a.5.5 0 010-1h1zM11.5 8.504a.5.5 0 00-.5-.5h\
-1a.5.5 0 100 1h1a.5.5 0 00.5-.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1.5 13.004a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11zm7.5-1h3v-10H9v10zm-1 0H2v-10h6v4.5H5.207l.6\
5-.65a.5.5 0 10-.707-.708L3.646 6.65a.5.5 0 000 .707l1.497 1.497a.5.5 0 10.707-.708l-.643-.642H8v4.5z",
      fill: e
    }
  )
)), d9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.5 4.504a.5.5 0 01.5-.5h1a.5.5 0 110 1H2a.5.5 0 01-.5-.5zM2 6.004a.5.5 0 100 1h1a.5.5 0 000-1H2zM1.5 8.504a.5.5 0 01.5-.5h1a.5.5\
 0 110 1H2a.5.5 0 01-.5-.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M.5 13.004a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5H.5zm.5-1v-10h3v10H1zm4 0v-4.5h2.793l-.643.642a.5.\
5 0 10.707.708l1.497-1.497a.5.5 0 000-.707L7.85 5.146a.5.5 0 10-.707.708l.65.65H5v-4.5h6v10H5z",
      fill: e
    }
  )
)), f9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M3 10.504a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zM6.5 10.004a.5.5 0 000 1h1a.5.5 0 000-1h-1zM9 10.504a.5.5 0 01.5-.5h1a.\
5.5 0 010 1h-1a.5.5 0 01-.5-.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1 1.504a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11zm1 6.5v-6h10v6H2zm10 1v3H2v-3h10z",
      fill: e
    }
  )
)), h9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M3.5 10.004a.5.5 0 000 1h1a.5.5 0 000-1h-1zM6 10.504a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zM9.5 10.004a.5.5 0 000 1h1a.\
5.5 0 000-1h-1z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1 12.504v-11a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5zm1-.5v-3h10v3H2zm4.5-4H2v-6h10v6H7.5V5.21l.646\
.646a.5.5 0 10.708-.707l-1.5-1.5a.5.5 0 00-.708 0l-1.5 1.5a.5.5 0 10.708.707l.646-.646v2.793z",
      fill: e
    }
  )
)), m9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M5 5.504a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5v-3zm1 2.5v-2h2v2H6z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M5.5.004a.5.5 0 01.5.5v1.5h2v-1.5a.5.5 0 011 0v1.5h2.5a.5.5 0 01.5.5v2.5h1.5a.5.5 0 010 1H12v2h1.5a.5.5 0 010 1H12v2.5a.5.5 0 01-.\
5.5H9v1.5a.5.5 0 01-1 0v-1.5H6v1.5a.5.5 0 01-1 0v-1.5H2.5a.5.5 0 01-.5-.5v-2.5H.5a.5.5 0 010-1H2v-2H.5a.5.5 0 010-1H2v-2.5a.5.5 0 01.5-.5H5v\
-1.5a.5.5 0 01.5-.5zm5.5 3H3v8h8v-8z",
      fill: e
    }
  )
)), g9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M12 3c0-1.105-2.239-2-5-2s-5 .895-5 2v8c0 .426.26.752.544.977.29.228.68.413 1.116.558.878.293 2.059.465 3.34.465 1.281 0 2.462-.17\
2 3.34-.465.436-.145.825-.33 1.116-.558.285-.225.544-.551.544-.977V3zm-1.03 0a.787.787 0 00-.05-.052c-.13-.123-.373-.28-.756-.434C9.404 2.21\
 8.286 2 7 2c-1.286 0-2.404.21-3.164.514-.383.153-.625.31-.756.434A.756.756 0 003.03 3a.756.756 0 00.05.052c.13.123.373.28.756.434C4.596 3.7\
9 5.714 4 7 4c1.286 0 2.404-.21 3.164-.514.383-.153.625-.31.756-.434A.787.787 0 0010.97 3zM11 5.75V4.2c-.912.486-2.364.8-4 .8-1.636 0-3.088-\
.314-4-.8v1.55l.002.008a.147.147 0 00.016.033.618.618 0 00.145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.37\
8-.126.648-.265.813-.395a.62.62 0 00.146-.15.149.149 0 00.015-.033A.03.03 0 0011 5.75zM3 7.013c.2.103.423.193.66.272.878.293 2.059.465 3.34.\
465 1.281 0 2.462-.172 3.34-.465.237-.079.46-.17.66-.272V8.5l-.002.008a.149.149 0 01-.015.033.62.62 0 01-.146.15c-.165.13-.435.27-.813.395-.\
751.25-1.82.414-3.024.414s-2.273-.163-3.024-.414c-.378-.126-.648-.265-.813-.395a.618.618 0 01-.145-.15.147.147 0 01-.016-.033A.027.027 0 013\
 8.5V7.013zm0 2.75V11l.002.008a.147.147 0 00.016.033.617.617 0 00.145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.\
414c.378-.126.648-.265.813-.395a.619.619 0 00.146-.15.148.148 0 00.015-.033L11 11V9.763c-.2.103-.423.193-.66.272-.878.293-2.059.465-3.34.465\
-1.281 0-2.462-.172-3.34-.465A4.767 4.767 0 013 9.763z",
      fill: e
    }
  )
)), v9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M5 3a.5.5 0 00-1 0v3a.5.5 0 001 0V3zM7 2.5a.5.5 0 01.5.5v3a.5.5 0 01-1 0V3a.5.5 0 01.5-.5zM10 4.504a.5.5 0 10-1 0V6a.5.5 0 001 0V4\
.504z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M12 3.54l-.001-.002a.499.499 0 00-.145-.388l-3-3a.499.499 0 00-.388-.145L8.464.004H2.5a.5.5 0 00-.5.5v13a.5.5 0 00.5.5h9a.5.5 0 00\
.5-.5V3.54zM3 1.004h5.293L11 3.71v5.293H3v-8zm0 9v3h8v-3H3z",
      fill: e
    }
  )
)), w9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M8.164 3.446a1.5 1.5 0 10-2.328 0L1.81 10.032A1.503 1.503 0 000 11.5a1.5 1.5 0 002.915.5h8.17a1.5 1.5 0 101.104-1.968L8.164 3.446z\
m-1.475.522a1.506 1.506 0 00.622 0l4.025 6.586a1.495 1.495 0 00-.25.446H2.914a1.497 1.497 0 00-.25-.446l4.024-6.586z",
      fill: e
    }
  )
)), b9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7.21.046l6.485 2.994A.5.5 0 0114 3.51v6.977a.495.495 0 01-.23.432.481.481 0 01-.071.038L7.23 13.944a.499.499 0 01-.46 0L.3 10.958\
a.498.498 0 01-.3-.47V3.511a.497.497 0 01.308-.473L6.78.051a.499.499 0 01.43-.005zM1 4.282v5.898l5.5 2.538V6.82L1 4.282zm6.5 8.436L13 10.18V\
4.282L7.5 6.82v5.898zM12.307 3.5L7 5.95 1.693 3.5 7 1.05l5.307 2.45z",
      fill: e
    }
  )
)), y9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("path", { d: "M7.5.5a.5.5 0 00-1 0v6a.5.5 0 001 0v-6z", fill: e }),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M4.273 2.808a.5.5 0 00-.546-.837 6 6 0 106.546 0 .5.5 0 00-.546.837 5 5 0 11-5.454 0z",
      fill: e
    }
  )
)), D9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M13.854 2.146l-2-2a.5.5 0 00-.708 0l-1.5 1.5-8.995 8.995a.499.499 0 00-.143.268L.012 13.39a.495.495 0 00.135.463.5.5 0 00.462.134l\
2.482-.496a.495.495 0 00.267-.143l8.995-8.995 1.5-1.5a.5.5 0 000-.708zM12 3.293l.793-.793L11.5 1.207 10.707 2 12 3.293zm-2-.586L1.707 11 3 1\
2.293 11.293 4 10 2.707zM1.137 12.863l.17-.849.679.679-.849.17z",
      fill: e
    }
  )
)), x9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M5.586 5.586A2 2 0 018.862 7.73a.5.5 0 10.931.365 3 3 0 10-1.697 1.697.5.5 0 10-.365-.93 2 2 0 01-2.145-3.277z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M.939 6.527c.127.128.19.297.185.464a.635.635 0 01-.185.465L0 8.395a7.099 7.099 0 001.067 2.572h1.32c.182 0 .345.076.46.197a.635.63\
5 0 01.198.46v1.317A7.097 7.097 0 005.602 14l.94-.94a.634.634 0 01.45-.186H7.021c.163 0 .326.061.45.186l.939.938a7.098 7.098 0 002.547-1.057\
V11.61c0-.181.075-.344.197-.46a.634.634 0 01.46-.197h1.33c.507-.76.871-1.622 1.056-2.55l-.946-.946a.635.635 0 01-.186-.465.635.635 0 01.186-\
.464l.943-.944a7.099 7.099 0 00-1.044-2.522h-1.34a.635.635 0 01-.46-.197.635.635 0 01-.196-.46V1.057A7.096 7.096 0 008.413.002l-.942.942a.63\
4.634 0 01-.45.186H6.992a.634.634 0 01-.45-.186L5.598 0a7.097 7.097 0 00-2.553 1.058v1.33c0 .182-.076.345-.197.46a.635.635 0 01-.46.198h-1.3\
3A7.098 7.098 0 00.003 5.591l.936.936zm.707 1.636c.324-.324.482-.752.479-1.172a1.634 1.634 0 00-.48-1.171l-.538-.539c.126-.433.299-.847.513-\
1.235h.768c.459 0 .873-.19 1.167-.49.3-.295.49-.708.49-1.167v-.77c.39-.215.807-.388 1.243-.515l.547.547c.32.32.742.48 1.157.48l.015-.001h.01\
4c.415 0 .836-.158 1.157-.479l.545-.544c.433.126.846.299 1.234.512v.784c0 .46.19.874.49 1.168.294.3.708.49 1.167.49h.776c.209.382.378.788.50\
2 1.213l-.545.546a1.635 1.635 0 00-.48 1.17c-.003.421.155.849.48 1.173l.549.55c-.126.434-.3.85-.513 1.239h-.77c-.458 0-.872.19-1.166.49-.3.2\
94-.49.708-.49 1.167v.77a6.09 6.09 0 01-1.238.514l-.54-.54a1.636 1.636 0 00-1.158-.48H6.992c-.415 0-.837.159-1.157.48l-.543.543a6.091 6.091 \
0 01-1.247-.516v-.756c0-.459-.19-.873-.49-1.167-.294-.3-.708-.49-1.167-.49h-.761a6.094 6.094 0 01-.523-1.262l.542-.542z",
      fill: e
    }
  )
)), C9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M5.585 8.414a2 2 0 113.277-.683.5.5 0 10.931.365 3 3 0 10-1.697 1.697.5.5 0 00-.365-.93 2 2 0 01-2.146-.449z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M6.5.289a1 1 0 011 0l5.062 2.922a1 1 0 01.5.866v5.846a1 1 0 01-.5.866L7.5 13.71a1 1 0 01-1 0L1.437 10.79a1 1 0 01-.5-.866V4.077a1 \
1 0 01.5-.866L6.5.29zm.5.866l5.062 2.922v5.846L7 12.845 1.937 9.923V4.077L7 1.155z",
      fill: e
    }
  )
)), E9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M10.5 1c.441 0 .564.521.252.833l-.806.807a.51.51 0 000 .72l.694.694a.51.51 0 00.72 0l.807-.806c.312-.312.833-.19.833.252a2.5 2.5 0\
 01-3.414 2.328l-6.879 6.88a1 1 0 01-1.414-1.415l6.88-6.88A2.5 2.5 0 0110.5 1zM2 12.5a.5.5 0 100-1 .5.5 0 000 1z",
      fill: e
    }
  )
)), R9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M4 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM13 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM7 8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
      fill: e
    }
  )
)), S9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M5.903.112a.107.107 0 01.194 0l.233.505.552.066c.091.01.128.123.06.185l-.408.377.109.546a.107.107 0 01-.158.114L6 1.633l-.486.272a\
.107.107 0 01-.157-.114l.108-.546-.408-.377a.107.107 0 01.06-.185L5.67.617l.233-.505zM2.194.224a.214.214 0 00-.389 0l-.466 1.01-1.104.13a.21\
4.214 0 00-.12.371l.816.755-.217 1.091a.214.214 0 00.315.23L2 3.266l.971.543c.16.09.35-.05.315-.229l-.217-1.09.817-.756a.214.214 0 00-.12-.3\
7L2.66 1.234 2.194.224zM12.194 8.224a.214.214 0 00-.389 0l-.466 1.01-1.104.13a.214.214 0 00-.12.371l.816.755-.217 1.091a.214.214 0 00.315.23\
l.97-.544.971.543c.16.09.35-.05.315-.229l-.217-1.09.817-.756a.214.214 0 00-.12-.37l-1.105-.131-.466-1.01z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M.147 11.857a.5.5 0 010-.707l11-11a.5.5 0 01.706 0l2 2a.5.5 0 010 .708l-11 11a.5.5 0 01-.706 0l-2-2zm2.353.94l-1.293-1.293 6.758-6\
.758L9.258 6.04 2.5 12.797zm7.465-7.465l2.828-2.828L11.5 1.211 8.672 4.039l1.293 1.293z",
      fill: e
    }
  )
)), A9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M9.621 3.914l.379.379 3.146-3.147a.5.5 0 01.708.708L10.707 5l.379.379a3 3 0 010 4.242l-.707.707-.005.005-.008.008-.012.013-1.733 1\
.732a3 3 0 01-4.242 0L.146 7.854a.5.5 0 01.708-.707.915.915 0 001.292 0L4.64 4.654a.52.52 0 01.007-.008l.733-.732a3 3 0 014.242 0zm-4.26 1.4\
32l.139-.139 3.146 3.147a.5.5 0 10.708-.707L6.212 4.505a2 2 0 012.702.116l.731.731.001.002h.002l.73.732a2 2 0 010 2.828l-.706.707-.012.013a.\
503.503 0 00-.014.013l-1.732 1.732a2 2 0 01-2.828 0L3.354 9.647a2.489 2.489 0 001.414-.708l1.086-1.085a.5.5 0 10-.708-.707L4.061 8.232a1.5 1\
.5 0 01-2.01.102c.294-.088.57-.248.803-.48l2.5-2.5a.475.475 0 00.007-.008z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M2 5.004a1 1 0 11-2 0 1 1 0 012 0zM4 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z",
      fill: e
    }
  )
)), F9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M13.854 3.354a.5.5 0 00-.708-.708L5 10.793.854 6.646a.5.5 0 10-.708.708l4.5 4.5a.5.5 0 00.708 0l8.5-8.5z",
      fill: e
    }
  )
)), k9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M2 1.004a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V6.393a.5.5 0 00-1 0v5.61H2v-10h7.5a.5.5 0 000-1H2z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M6.354 9.857l7.5-7.5a.5.5 0 00-.708-.707L6 8.797 3.854 6.65a.5.5 0 10-.708.707l2.5 2.5a.5.5 0 00.708 0z",
      fill: e
    }
  )
)), L9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M11.5 2a.5.5 0 000 1h2a.5.5 0 000-1h-2zM8.854 2.646a.5.5 0 010 .708L5.207 7l3.647 3.646a.5.5 0 01-.708.708L4.5 7.707.854 11.354a.5\
.5 0 01-.708-.708L3.793 7 .146 3.354a.5.5 0 11.708-.708L4.5 6.293l3.646-3.647a.5.5 0 01.708 0zM11 7a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2A.5.5 0 \
0111 7zM11.5 11a.5.5 0 000 1h2a.5.5 0 000-1h-2z",
      fill: e
    }
  )
)), T9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M11.5 2a.5.5 0 000 1h2a.5.5 0 000-1h-2zM9.3 2.6a.5.5 0 01.1.7l-5.995 7.993a.505.505 0 01-.37.206.5.5 0 01-.395-.152L.146 8.854a.5.\
5 0 11.708-.708l2.092 2.093L8.6 2.7a.5.5 0 01.7-.1zM11 7a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2A.5.5 0 0111 7zM11.5 11a.5.5 0 000 1h2a.5.5 0 000-1\
h-2z",
      fill: e
    }
  )
)), I9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M10.5 1a.5.5 0 01.5.5V2h1.5a.5.5 0 010 1H11v.5a.5.5 0 01-1 0V3H1.5a.5.5 0 010-1H10v-.5a.5.5 0 01.5-.5zM1.5 11a.5.5 0 000 1H10v.5a.\
5.5 0 001 0V12h1.5a.5.5 0 000-1H11v-.5a.5.5 0 00-1 0v.5H1.5zM1 7a.5.5 0 01.5-.5H3V6a.5.5 0 011 0v.5h8.5a.5.5 0 010 1H4V8a.5.5 0 01-1 0v-.5H1\
.5A.5.5 0 011 7z",
      fill: e
    }
  )
)), B9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7.5.5a.5.5 0 00-1 0v6h-6a.5.5 0 000 1h6v6a.5.5 0 001 0v-6h6a.5.5 0 000-1h-6v-6z",
      fill: e
    }
  )
)), M9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M2.03.97A.75.75 0 00.97 2.03L5.94 7 .97 11.97a.75.75 0 101.06 1.06L7 8.06l4.97 4.97a.75.75 0 101.06-1.06L8.06 7l4.97-4.97A.75.75 0\
 0011.97.97L7 5.94 2.03.97z",
      fill: e
    }
  )
)), Wu = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.854 1.146a.5.5 0 10-.708.708L6.293 7l-5.147 5.146a.5.5 0 00.708.708L7 7.707l5.146 5.147a.5.5 0 00.708-.708L7.707 7l5.147-5.146a\
.5.5 0 00-.708-.708L7 6.293 1.854 1.146z",
      fill: e
    }
  )
)), _9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M5.5 4.5A.5.5 0 016 5v5a.5.5 0 01-1 0V5a.5.5 0 01.5-.5zM9 5a.5.5 0 00-1 0v5a.5.5 0 001 0V5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M4.5.5A.5.5 0 015 0h4a.5.5 0 01.5.5V2h3a.5.5 0 010 1H12v8a2 2 0 01-2 2H4a2 2 0 01-2-2V3h-.5a.5.5 0 010-1h3V.5zM3 3v8a1 1 0 001 1h6\
a1 1 0 001-1V3H3zm2.5-2h3v1h-3V1z",
      fill: e
    }
  )
)), P9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("g", { clipPath: "url(#prefix__clip0_1107_3502)" }, /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M13.44 4.44L9.56.56a1.5 1.5 0 00-2.12 0L7 1a1.415 1.415 0 000 2L5 5H3.657A4 4 0 00.828 6.17l-.474.475a.5.5 0 000 .707l2.793 2.793-\
3 3a.5.5 0 00.707.708l3-3 2.792 2.792a.5.5 0 00.708 0l.474-.475A4 4 0 009 10.343V9l2-2a1.414 1.414 0 002 0l.44-.44a1.5 1.5 0 000-2.12zM11 5.\
585l-3 3v1.757a3 3 0 01-.879 2.121L7 12.586 1.414 7l.122-.122A3 3 0 013.656 6h1.758l3-3-.707-.707a.414.414 0 010-.586l.44-.44a.5.5 0 01.707 \
0l3.878 3.88a.5.5 0 010 .706l-.44.44a.414.414 0 01-.585 0L11 5.586z",
      fill: e
    }
  )),
  /* @__PURE__ */ s.createElement("defs", null, /* @__PURE__ */ s.createElement("clipPath", { id: "prefix__clip0_1107_3502" }, /* @__PURE__ */ s.createElement(
  "path", { fill: "#fff", d: "M0 0h14v14H0z" })))
)), H9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("g", { clipPath: "url(#prefix__clip0_1107_3501)", fill: e }, /* @__PURE__ */ s.createElement("path", { d: "\
M13.44 4.44L9.56.56a1.5 1.5 0 00-2.12 0L7 1a1.415 1.415 0 000 2L5.707 4.293 6.414 5l2-2-.707-.707a.414.414 0 010-.586l.44-.44a.5.5 0 01.707 \
0l3.878 3.88a.5.5 0 010 .706l-.44.44a.414.414 0 01-.585 0L11 5.586l-2 2 .707.707L11 7a1.414 1.414 0 002 0l.44-.44a1.5 1.5 0 000-2.12zM.828 6\
.171a4 4 0 012.758-1.17l1 .999h-.93a3 3 0 00-2.12.878L1.414 7 7 12.586l.121-.122A3 3 0 008 10.343v-.929l1 1a4 4 0 01-1.172 2.757l-.474.475a.\
5.5 0 01-.708 0l-2.792-2.792-3 3a.5.5 0 01-.708-.708l3-3L.355 7.353a.5.5 0 010-.707l.474-.475zM1.854 1.146a.5.5 0 10-.708.708l11 11a.5.5 0 0\
0.708-.708l-11-11z" })),
  /* @__PURE__ */ s.createElement("defs", null, /* @__PURE__ */ s.createElement("clipPath", { id: "prefix__clip0_1107_3501" }, /* @__PURE__ */ s.createElement(
  "path", { fill: "#fff", d: "M0 0h14v14H0z" })))
)), z9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7 3a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 017 3z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 14A7 7 0 107 0a7 7 0 000 14zm0-1A6 6 0 107 1a6 6 0 000 12z",
      fill: e
    }
  )
)), O9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("path", { d: "M3.5 6.5a.5.5 0 000 1h7a.5.5 0 000-1h-7z", fill: e }),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7A7 7 0 110 7a7 7 0 0114 0zm-1 0A6 6 0 111 7a6 6 0 0112 0z",
      fill: e
    }
  )
)), N9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M9.854 4.146a.5.5 0 010 .708L7.707 7l2.147 2.146a.5.5 0 01-.708.708L7 7.707 4.854 9.854a.5.5 0 01-.708-.708L6.293 7 4.146 4.854a.5\
.5 0 11.708-.708L7 6.293l2.146-2.147a.5.5 0 01.708 0z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 14A7 7 0 107 0a7 7 0 000 14zm0-1A6 6 0 107 1a6 6 0 000 12z",
      fill: e
    }
  )
)), $9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7A7 7 0 110 7a7 7 0 0114 0zm-1 0a6 6 0 01-9.874 4.582l8.456-8.456A5.976 5.976 0 0113 7zM2.418 10.874l8.456-8.456a6 6 0 00-8.45\
6 8.456z",
      fill: e
    }
  )
)), V9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 14A7 7 0 107 0a7 7 0 000 14zm3.854-9.354a.5.5 0 010 .708l-4.5 4.5a.5.5 0 01-.708 0l-2.5-2.5a.5.5 0 11.708-.708L6 8.793l4.146-4.\
147a.5.5 0 01.708 0z",
      fill: e
    }
  )
)), j9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 14A7 7 0 107 0a7 7 0 000 14zM3.5 6.5a.5.5 0 000 1h7a.5.5 0 000-1h-7z",
      fill: e
    }
  )
)), W9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 14A7 7 0 107 0a7 7 0 000 14zm2.854-9.854a.5.5 0 010 .708L7.707 7l2.147 2.146a.5.5 0 01-.708.708L7 7.707 4.854 9.854a.5.5 0 01-.\
708-.708L6.293 7 4.146 4.854a.5.5 0 11.708-.708L7 6.293l2.146-2.147a.5.5 0 01.708 0z",
      fill: e
    }
  )
)), q9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M5 2h7a2 2 0 012 2v6a2 2 0 01-2 2H5a1.994 1.994 0 01-1.414-.586l-3-3a2 2 0 010-2.828l3-3A1.994 1.994 0 015 2zm1.146 3.146a.5.5 0 0\
1.708 0L8 6.293l1.146-1.147a.5.5 0 11.708.708L8.707 7l1.147 1.146a.5.5 0 01-.708.708L8 7.707 6.854 8.854a.5.5 0 11-.708-.708L7.293 7 6.146 5\
.854a.5.5 0 010-.708z",
      fill: e
    }
  )
)), U9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M3.5 5.004a.5.5 0 100 1h7a.5.5 0 000-1h-7zM3 8.504a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M12.5 12.004H5.707l-1.853 1.854a.5.5 0 01-.351.146h-.006a.499.499 0 01-.497-.5v-1.5H1.5a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h11a.5.5 \
0 01.5.5v9a.5.5 0 01-.5.5zm-10.5-1v-8h10v8H2z",
      fill: e
    }
  )
)), G9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7.5 5.004a.5.5 0 10-1 0v1.5H5a.5.5 0 100 1h1.5v1.5a.5.5 0 001 0v-1.5H9a.5.5 0 000-1H7.5v-1.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3.691 13.966a.498.498 0 01-.188.038h-.006a.499.499 0 01-.497-.5v-1.5H1.5a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v9a.5.\
5 0 01-.5.5H5.707l-1.853 1.854a.5.5 0 01-.163.108zM2 3.004v8h10v-8H2z",
      fill: e
    }
  )
)), Y9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M9.854 6.65a.5.5 0 010 .707l-2 2a.5.5 0 11-.708-.707l1.15-1.15-3.796.004a.5.5 0 010-1L8.29 6.5 7.145 5.357a.5.5 0 11.708-.707l2 2z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3.691 13.966a.498.498 0 01-.188.038h-.006a.499.499 0 01-.497-.5v-1.5H1.5a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v9a.5.\
5 0 01-.5.5H5.707l-1.853 1.854a.5.5 0 01-.163.108zM2 3.004v8h10v-8H2z",
      fill: e
    }
  )
)), X9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M8.5 7.004a.5.5 0 000-1h-5a.5.5 0 100 1h5zM9 8.504a.5.5 0 01-.5.5h-5a.5.5 0 010-1h5a.5.5 0 01.5.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M12 11.504v-1.5h1.5a.5.5 0 00.5-.5v-8a.5.5 0 00-.5-.5h-11a.5.5 0 00-.5.5v1.5H.5a.5.5 0 00-.5.5v8a.5.5 0 00.5.5H2v1.5a.499.499 0 00\
.497.5h.006a.498.498 0 00.35-.146l1.854-1.854H11.5a.5.5 0 00.5-.5zm-9-8.5v-1h10v7h-1v-5.5a.5.5 0 00-.5-.5H3zm-2 8v-7h10v7H1z",
      fill: e
    }
  )
)), Z9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1 2a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6.986a.444.444 0 01-.124.103l-3.219 1.84A.43.43 0 013 13.569V12a2 2 0 01-2-2V2zm3.42\
 4.78a.921.921 0 110-1.843.921.921 0 010 1.842zm1.658-.922a.921.921 0 101.843 0 .921.921 0 00-1.843 0zm2.58 0a.921.921 0 101.842 0 .921.921 \
0 00-1.843 0z",
      fill: e
    }
  )
)), K9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M8 8.004a1 1 0 01-.5.866v1.634a.5.5 0 01-1 0V8.87A1 1 0 118 8.004z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3 4.004a4 4 0 118 0v1h1.5a.5.5 0 01.5.5v8a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-8a.5.5 0 01.5-.5H3v-1zm7 1v-1a3 3 0 10-6 0v1h6zm2 1\
H2v7h10v-7z",
      fill: e
    }
  )
)), J9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("g", { clipPath: "url(#prefix__clip0_1107_3614)", fill: e }, /* @__PURE__ */ s.createElement("path", { d: "\
M6.5 8.87a1 1 0 111 0v1.634a.5.5 0 01-1 0V8.87z" }), /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 1a3 3 0 00-3 3v1.004h8.5a.5.5 0 01.5.5v8a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-8a.5.5 0 01.5-.5H3V4a4 4 0 017.755-1.381.5.5 0 01-\
.939.345A3.001 3.001 0 007 1zM2 6.004h10v7H2v-7z"
    }
  )),
  /* @__PURE__ */ s.createElement("defs", null, /* @__PURE__ */ s.createElement("clipPath", { id: "prefix__clip0_1107_3614" }, /* @__PURE__ */ s.createElement(
  "path", { fill: "#fff", d: "M0 0h14v14H0z" })))
)), Q9 = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("path", { d: "M11 4a1 1 0 11-2 0 1 1 0 012 0z", fill: e }),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7.5 8.532V9.5a.5.5 0 01-.5.5H5.5v1.5a.5.5 0 01-.5.5H3.5v1.5a.5.5 0 01-.5.5H.5a.5.5 0 01-.5-.5v-2a.5.5 0 01.155-.362l5.11-5.11A4.5\
 4.5 0 117.5 8.532zM6 4.5a3.5 3.5 0 111.5 2.873c-.29-.203-1-.373-1 .481V9H5a.5.5 0 00-.5.5V11H3a.5.5 0 00-.5.5V13H1v-1.293l5.193-5.193a.552.\
552 0 00.099-.613A3.473 3.473 0 016 4.5z",
      fill: e
    }
  )
)), eD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7.354.15a.5.5 0 00-.708 0l-2 2a.5.5 0 10.708.707L6.5 1.711v6.793a.5.5 0 001 0V1.71l1.146 1.146a.5.5 0 10.708-.707l-2-2z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M2 7.504a.5.5 0 10-1 0v5a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-5a.5.5 0 00-1 0v4.5H2v-4.5z",
      fill: e
    }
  )
)), tD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("path", { d: "M2.5 8.004a.5.5 0 100 1h3a.5.5 0 000-1h-3z", fill: e }),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M0 11.504a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-9a.5.5 0 00-.5-.5H.5a.5.5 0 00-.5.5v9zm1-8.5v1h12v-1H1zm0 8h12v-5H1v5z",
      fill: e
    }
  )
)), rD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1 3.004a1 1 0 00-1 1v5a1 1 0 001 1h3.5a.5.5 0 100-1H1v-5h12v5h-1a.5.5 0 000 1h1a1 1 0 001-1v-5a1 1 0 00-1-1H1z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M6.45 7.006a.498.498 0 01.31.07L10.225 9.1a.5.5 0 01-.002.873l-1.074.621.75 1.3a.75.75 0 01-1.3.75l-.75-1.3-1.074.62a.497.497 0 01\
-.663-.135.498.498 0 01-.095-.3L6 7.515a.497.497 0 01.45-.509z",
      fill: e
    }
  )
)), nD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M4 1.504a.5.5 0 01.5-.5h5a.5.5 0 110 1h-2v10h2a.5.5 0 010 1h-5a.5.5 0 010-1h2v-10h-2a.5.5 0 01-.5-.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M0 4.504a.5.5 0 01.5-.5h4a.5.5 0 110 1H1v4h3.5a.5.5 0 110 1h-4a.5.5 0 01-.5-.5v-5zM9.5 4.004a.5.5 0 100 1H13v4H9.5a.5.5 0 100 1h4a\
.5.5 0 00.5-.5v-5a.5.5 0 00-.5-.5h-4z",
      fill: e
    }
  )
)), oD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M5.943 12.457a.27.27 0 00.248-.149L7.77 9.151l2.54 2.54a.257.257 0 00.188.073c.082 0 .158-.03.21-.077l.788-.79a.27.27 0 000-.392L8\
.891 7.9l3.416-1.708a.29.29 0 00.117-.106.222.222 0 00.033-.134.332.332 0 00-.053-.161.174.174 0 00-.092-.072l-.02-.007-10.377-4.15a.274.274\
 0 00-.355.354l4.15 10.372a.275.275 0 00.233.169zm-.036 1l-.02-.002c-.462-.03-.912-.31-1.106-.796L.632 2.287A1.274 1.274 0 012.286.633l10.35\
8 4.143c.516.182.782.657.81 1.114a1.25 1.25 0 01-.7 1.197L10.58 8.174l1.624 1.624a1.27 1.27 0 010 1.807l-.8.801-.008.007c-.491.46-1.298.48-1\
.792-.014l-1.56-1.56-.957 1.916a1.27 1.27 0 01-1.142.702h-.037z",
      fill: e
    }
  )
)), aD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M11.87 6.008a.505.505 0 00-.003-.028v-.002c-.026-.27-.225-.48-.467-.498a.5.5 0 00-.53.5v1.41c0 .25-.22.47-.47.47a.48.48 0 01-.47-.\
47V5.17a.6.6 0 00-.002-.05c-.023-.268-.223-.49-.468-.5a.5.5 0 00-.52.5v1.65a.486.486 0 01-.47.47.48.48 0 01-.47-.47V4.62a.602.602 0 00-.002-\
.05v-.002c-.023-.266-.224-.48-.468-.498a.5.5 0 00-.53.5v2.2c0 .25-.22.47-.47.47a.49.49 0 01-.47-.47V1.8c0-.017 0-.034-.002-.05-.022-.268-.21\
4-.49-.468-.5a.5.5 0 00-.52.5v6.78c0 .25-.22.47-.47.47a.48.48 0 01-.47-.47l.001-.1c.001-.053.002-.104 0-.155a.775.775 0 00-.06-.315.65.65 0 \
00-.16-.22 29.67 29.67 0 01-.21-.189c-.2-.182-.4-.365-.617-.532l-.003-.003A6.366 6.366 0 003.06 7l-.01-.007c-.433-.331-.621-.243-.69-.193-.2\
6.14-.29.5-.13.74l1.73 2.6v.01h-.016l-.035.023.05-.023s1.21 2.6 3.57 2.6c3.54 0 4.2-1.9 4.31-4.42.039-.591.036-1.189.032-1.783l-.002-.507v-.\
032zm.969 2.376c-.057 1.285-.254 2.667-1.082 3.72-.88 1.118-2.283 1.646-4.227 1.646-1.574 0-2.714-.87-3.406-1.623a6.958 6.958 0 01-1.046-1.5\
04l-.006-.012-1.674-2.516a1.593 1.593 0 01-.25-1.107 1.44 1.44 0 01.69-1.041c.195-.124.485-.232.856-.186.357.044.681.219.976.446.137.106.272\
.22.4.331V1.75A1.5 1.5 0 015.63.25c.93.036 1.431.856 1.431 1.55v1.335a1.5 1.5 0 01.53-.063h.017c.512.04.915.326 1.153.71a1.5 1.5 0 01.74-.16\
1c.659.025 1.115.458 1.316.964a1.493 1.493 0 01.644-.103h.017c.856.067 1.393.814 1.393 1.558l.002.48c.004.596.007 1.237-.033 1.864z",
      fill: e
    }
  )
)), iD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3.5 6A2.5 2.5 0 116 3.5V5h2V3.5A2.5 2.5 0 1110.5 6H9v2h1.5A2.5 2.5 0 118 10.5V9H6v1.5A2.5 2.5 0 113.5 8H5V6H3.5zM2 3.5a1.5 1.5 0 \
113 0V5H3.5A1.5 1.5 0 012 3.5zM6 6v2h2V6H6zm3-1h1.5A1.5 1.5 0 109 3.5V5zM3.5 9H5v1.5A1.5 1.5 0 113.5 9zM9 9v1.5A1.5 1.5 0 1010.5 9H9z",
      fill: e
    }
  )
)), lD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M11.083 12.25H2.917a1.167 1.167 0 01-1.167-1.167V2.917A1.167 1.167 0 012.917 1.75h6.416l2.917 2.917v6.416a1.167 1.167 0 01-1.167 1\
.167z",
      stroke: e,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M9.917 12.25V7.583H4.083v4.667M4.083 1.75v2.917H8.75",
      stroke: e,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }
  )
)), sD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7 5.5a.5.5 0 01.5.5v4a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zM7 4.5A.75.75 0 107 3a.75.75 0 000 1.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 14A7 7 0 107 0a7 7 0 000 14zm0-1A6 6 0 107 1a6 6 0 000 12z",
      fill: e
    }
  )
)), uD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M5.25 5.25A1.75 1.75 0 117 7a.5.5 0 00-.5.5V9a.5.5 0 001 0V7.955A2.75 2.75 0 104.25 5.25a.5.5 0 001 0zM7 11.5A.75.75 0 107 10a.75.\
75 0 000 1.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7A7 7 0 110 7a7 7 0 0114 0zm-1 0A6 6 0 111 7a6 6 0 0112 0z",
      fill: e
    }
  )
)), cD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7A7 7 0 110 7a7 7 0 0114 0zm-3.524 4.89A5.972 5.972 0 017 13a5.972 5.972 0 01-3.477-1.11l1.445-1.444C5.564 10.798 6.258 11 7 1\
1s1.436-.202 2.032-.554l1.444 1.445zm-.03-2.858l1.445 1.444A5.972 5.972 0 0013 7c0-1.296-.41-2.496-1.11-3.477l-1.444 1.445C10.798 5.564 11 6\
.258 11 7s-.202 1.436-.554 2.032zM9.032 3.554l1.444-1.445A5.972 5.972 0 007 1c-1.296 0-2.496.41-3.477 1.11l1.445 1.444A3.981 3.981 0 017 3c.\
742 0 1.436.202 2.032.554zM3.554 4.968L2.109 3.523A5.973 5.973 0 001 7c0 1.296.41 2.496 1.11 3.476l1.444-1.444A3.981 3.981 0 013 7c0-.742.20\
2-1.436.554-2.032zM10 7a3 3 0 11-6 0 3 3 0 016 0z",
      fill: e
    }
  )
)), pD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7 4.5a.5.5 0 01.5.5v3.5a.5.5 0 11-1 0V5a.5.5 0 01.5-.5zM7.75 10.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7.206 1.045a.498.498 0 01.23.209l6.494 10.992a.5.5 0 01-.438.754H.508a.497.497 0 01-.506-.452.498.498 0 01.072-.31l6.49-10.984a.4\
97.497 0 01.642-.21zM7 2.483L1.376 12h11.248L7 2.483z",
      fill: e
    }
  )
)), dD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7A7 7 0 110 7a7 7 0 0114 0zM6.5 8a.5.5 0 001 0V4a.5.5 0 00-1 0v4zm-.25 2.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z",
      fill: e
    }
  )
)), fD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M0 2.504a.5.5 0 01.5-.5h13a.5.5 0 01.5.5v9a.5.5 0 01-.5.5H.5a.5.5 0 01-.5-.5v-9zm1 1.012v7.488h12V3.519L7.313 7.894a.496.496 0 01-\
.526.062.497.497 0 01-.1-.062L1 3.516zm11.03-.512H1.974L7 6.874l5.03-3.87z",
      fill: e
    }
  )
)), hD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7.76 8.134l-.05.05a.2.2 0 01-.28.03 6.76 6.76 0 01-1.63-1.65.21.21 0 01.04-.27l.05-.05c.23-.2.54-.47.71-.96.17-.47-.02-1.04-.66-1\
.94-.26-.38-.72-.96-1.22-1.46-.68-.69-1.2-1-1.65-1a.98.98 0 00-.51.13A3.23 3.23 0 00.9 3.424c-.13 1.1.26 2.37 1.17 3.78a16.679 16.679 0 004.\
55 4.6 6.57 6.57 0 003.53 1.32 3.2 3.2 0 002.85-1.66c.14-.24.24-.64-.07-1.18a7.803 7.803 0 00-1.73-1.81c-.64-.5-1.52-1.11-2.13-1.11a.97.97 0\
 00-.34.06c-.472.164-.74.458-.947.685l-.023.025zm4.32 2.678a6.801 6.801 0 00-1.482-1.54l-.007-.005-.006-.005a8.418 8.418 0 00-.957-.662 2.7 \
2.7 0 00-.4-.193.683.683 0 00-.157-.043l-.004.002-.009.003c-.224.078-.343.202-.56.44l-.014.016-.046.045a1.2 1.2 0 01-1.602.149A7.76 7.76 0 0\
14.98 7.134l-.013-.019-.013-.02a1.21 1.21 0 01.195-1.522l.06-.06.026-.024c.219-.19.345-.312.422-.533l.003-.01v-.008a.518.518 0 00-.032-.142c\
-.06-.178-.203-.453-.502-.872l-.005-.008-.005-.007A10.18 10.18 0 004.013 2.59l-.005-.005c-.31-.314-.543-.5-.716-.605-.147-.088-.214-.096-.22\
2-.097h-.016l-.006.003-.01.006a2.23 2.23 0 00-1.145 1.656c-.09.776.175 1.806 1.014 3.108a15.68 15.68 0 004.274 4.32l.022.014.022.016a5.57 5.\
57 0 002.964 1.117 2.2 2.2 0 001.935-1.141l.006-.012.004-.007a.182.182 0 00-.007-.038.574.574 0 00-.047-.114z",
      fill: e
    }
  )
)), mD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M11.841 2.159a2.25 2.25 0 00-3.182 0l-2.5 2.5a2.25 2.25 0 000 3.182.5.5 0 01-.707.707 3.25 3.25 0 010-4.596l2.5-2.5a3.25 3.25 0 01\
4.596 4.596l-2.063 2.063a4.27 4.27 0 00-.094-1.32l1.45-1.45a2.25 2.25 0 000-3.182z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M3.61 7.21c-.1-.434-.132-.88-.095-1.321L1.452 7.952a3.25 3.25 0 104.596 4.596l2.5-2.5a3.25 3.25 0 000-4.596.5.5 0 00-.707.707 2.25\
 2.25 0 010 3.182l-2.5 2.5A2.25 2.25 0 112.159 8.66l1.45-1.45z",
      fill: e
    }
  )
)), gD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.452 7.952l1.305-1.305.708.707-1.306 1.305a2.25 2.25 0 103.182 3.182l1.306-1.305.707.707-1.306 1.305a3.25 3.25 0 01-4.596-4.596z\
M12.548 6.048l-1.305 1.306-.707-.708 1.305-1.305a2.25 2.25 0 10-3.182-3.182L7.354 3.464l-.708-.707 1.306-1.305a3.25 3.25 0 014.596 4.596zM1.\
854 1.146a.5.5 0 10-.708.708l11 11a.5.5 0 00.707-.707l-11-11z",
      fill: e
    }
  )
)), vD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7.994 1.11a1 1 0 10-1.988 0A4.502 4.502 0 002.5 5.5v3.882l-.943 1.885a.497.497 0 00-.053.295.5.5 0 00.506.438h3.575a1.5 1.5 0 102\
.83 0h3.575a.5.5 0 00.453-.733L11.5 9.382V5.5a4.502 4.502 0 00-3.506-4.39zM2.81 11h8.382l-.5-1H3.31l-.5 1zM10.5 9V5.5a3.5 3.5 0 10-7 0V9h7zm\
-4 3.5a.5.5 0 111 0 .5.5 0 01-1 0z",
      fill: e
    }
  )
)), wD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.5.5A.5.5 0 012 0c6.627 0 12 5.373 12 12a.5.5 0 01-1 0C13 5.925 8.075 1 2 1a.5.5 0 01-.5-.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.5 4.5A.5.5 0 012 4a8 8 0 018 8 .5.5 0 01-1 0 7 7 0 00-7-7 .5.5 0 01-.5-.5z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M5 11a2 2 0 11-4 0 2 2 0 014 0zm-1 0a1 1 0 11-2 0 1 1 0 012 0z",
      fill: e
    }
  )
)), bD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M2 1.004a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-4.5a.5.5 0 00-1 0v4.5H2v-10h4.5a.5.5 0 000-1H2z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7.354 7.357L12 2.711v1.793a.5.5 0 001 0v-3a.5.5 0 00-.5-.5h-3a.5.5 0 100 1h1.793L6.646 6.65a.5.5 0 10.708.707z",
      fill: e
    }
  )
)), yD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M6.646.15a.5.5 0 01.708 0l2 2a.5.5 0 11-.708.707L7.5 1.711v6.793a.5.5 0 01-1 0V1.71L5.354 2.857a.5.5 0 11-.708-.707l2-2z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M2 4.004a1 1 0 00-1 1v7a1 1 0 001 1h10a1 1 0 001-1v-7a1 1 0 00-1-1H9.5a.5.5 0 100 1H12v7H2v-7h2.5a.5.5 0 000-1H2z",
      fill: e
    }
  )
)), DD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M13.854 6.646a.5.5 0 010 .708l-2 2a.5.5 0 01-.708-.708L12.293 7.5H5.5a.5.5 0 010-1h6.793l-1.147-1.146a.5.5 0 01.708-.708l2 2z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M10 2a1 1 0 00-1-1H2a1 1 0 00-1 1v10a1 1 0 001 1h7a1 1 0 001-1V9.5a.5.5 0 00-1 0V12H2V2h7v2.5a.5.5 0 001 0V2z",
      fill: e
    }
  )
)), xD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 13A6 6 0 107 1a6 6 0 000 12zm0 1A7 7 0 107 0a7 7 0 000 14z",
      fill: e
    }
  )
)), CD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("path", { d: "M14 7A7 7 0 110 7a7 7 0 0114 0z", fill: e })
)), ED = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3.5 0h7a.5.5 0 01.5.5v13a.5.5 0 01-.454.498.462.462 0 01-.371-.118L7 11.159l-3.175 2.72a.46.46 0 01-.379.118A.5.5 0 013 13.5V.5a.\
5.5 0 01.5-.5zM4 12.413l2.664-2.284a.454.454 0 01.377-.128.498.498 0 01.284.12L10 12.412V1H4v11.413z",
      fill: e
    }
  )
)), RD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 15",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3.5 0h7a.5.5 0 01.5.5v13a.5.5 0 01-.454.498.462.462 0 01-.371-.118L7 11.159l-3.175 2.72a.46.46 0 01-.379.118A.5.5 0 013 13.5V.5a.\
5.5 0 01.5-.5z",
      fill: e
    }
  )
)), SD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("g", { clipPath: "url(#prefix__clip0_1449_588)" }, /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M8.414 1.586a2 2 0 00-2.828 0l-4 4a2 2 0 000 2.828l4 4a2 2 0 002.828 0l4-4a2 2 0 000-2.828l-4-4zm.707-.707a3 3 0 00-4.242 0l-4 4a3\
 3 0 000 4.242l4 4a3 3 0 004.242 0l4-4a3 3 0 000-4.242l-4-4z",
      fill: e
    }
  )),
  /* @__PURE__ */ s.createElement("defs", null, /* @__PURE__ */ s.createElement("clipPath", { id: "prefix__clip0_1449_588" }, /* @__PURE__ */ s.createElement(
  "path", { fill: "#fff", d: "M0 0h14v14H0z" })))
)), AD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M12.814 1.846c.06.05.116.101.171.154l.001.002a3.254 3.254 0 01.755 1.168c.171.461.259.974.259 1.538 0 .332-.046.656-.143.976a4.546\
 4.546 0 01-.397.937c-.169.302-.36.589-.58.864a7.627 7.627 0 01-.674.746l-4.78 4.596a.585.585 0 01-.427.173.669.669 0 01-.44-.173L1.78 8.217\
a7.838 7.838 0 01-.677-.748 6.124 6.124 0 01-.572-.855 4.975 4.975 0 01-.388-.931A3.432 3.432 0 010 4.708C0 4.144.09 3.63.265 3.17c.176-.459\
.429-.85.757-1.168a3.432 3.432 0 011.193-.74c.467-.176.99-.262 1.57-.262.304 0 .608.044.907.137.301.092.586.215.855.367.27.148.526.321.771.5\
12.244.193.471.386.682.584.202-.198.427-.391.678-.584.248-.19.507-.364.78-.512a4.65 4.65 0 01.845-.367c.294-.093.594-.137.9-.137.585 0 1.115\
.086 1.585.262.392.146.734.34 1.026.584zM1.2 3.526c.128-.333.304-.598.52-.806.218-.212.497-.389.849-.522m-1.37 1.328A3.324 3.324 0 001 4.708\
c0 .225.032.452.101.686.082.265.183.513.307.737.135.246.294.484.479.716.188.237.386.454.59.652l.001.002 4.514 4.355 4.519-4.344c.2-.193.398-\
.41.585-.648l.003-.003c.184-.23.345-.472.486-.726l.004-.007c.131-.23.232-.474.31-.732v-.002c.068-.224.101-.45.101-.686 0-.457-.07-.849-.195-\
1.185a2.177 2.177 0 00-.515-.802l.007-.012-.008.009a2.383 2.383 0 00-.85-.518l-.003-.001C11.1 2.072 10.692 2 10.203 2c-.21 0-.406.03-.597.09\
h-.001c-.22.07-.443.167-.663.289l-.007.003c-.22.12-.434.262-.647.426-.226.174-.42.341-.588.505l-.684.672-.7-.656a9.967 9.967 0 00-.615-.527 \
4.82 4.82 0 00-.635-.422l-.01-.005a3.289 3.289 0 00-.656-.281l-.008-.003A2.014 2.014 0 003.785 2c-.481 0-.881.071-1.217.198",
      fill: e
    }
  )
)), FD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M12.814 1.846c.06.05.116.101.171.154l.001.002a3.254 3.254 0 01.755 1.168c.171.461.259.974.259 1.538 0 .332-.046.656-.143.976a4.546\
 4.546 0 01-.397.937c-.169.302-.36.589-.58.864a7.627 7.627 0 01-.674.746l-4.78 4.596a.585.585 0 01-.427.173.669.669 0 01-.44-.173L1.78 8.217\
a7.838 7.838 0 01-.677-.748 6.124 6.124 0 01-.572-.855 4.975 4.975 0 01-.388-.931A3.432 3.432 0 010 4.708C0 4.144.09 3.63.265 3.17c.176-.459\
.429-.85.757-1.168a3.432 3.432 0 011.193-.74c.467-.176.99-.262 1.57-.262.304 0 .608.044.907.137.301.092.586.215.855.367.27.148.526.321.771.5\
12.244.193.471.386.682.584.202-.198.427-.391.678-.584.248-.19.507-.364.78-.512a4.65 4.65 0 01.845-.367c.294-.093.594-.137.9-.137.585 0 1.115\
.086 1.585.262.392.146.734.34 1.026.584z",
      fill: e
    }
  )
)), kD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M6.319.783a.75.75 0 011.362 0l1.63 3.535 3.867.458a.75.75 0 01.42 1.296L10.74 8.715l.76 3.819a.75.75 0 01-1.103.8L7 11.434l-3.398 \
1.902a.75.75 0 01-1.101-.801l.758-3.819L.401 6.072a.75.75 0 01.42-1.296l3.867-.458L6.318.783zm.68.91l-1.461 3.17a.75.75 0 01-.593.431l-3.467\
.412 2.563 2.37a.75.75 0 01.226.697l-.68 3.424 3.046-1.705a.75.75 0 01.733 0l3.047 1.705-.68-3.424a.75.75 0 01.226-.697l2.563-2.37-3.467-.41\
2a.75.75 0 01-.593-.43L7 1.694z",
      fill: e
    }
  )
)), LD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7.68.783a.75.75 0 00-1.361 0l-1.63 3.535-3.867.458A.75.75 0 00.4 6.072l2.858 2.643-.758 3.819a.75.75 0 001.101.8L7 11.434l3.397 1\
.902a.75.75 0 001.102-.801l-.759-3.819L13.6 6.072a.75.75 0 00-.421-1.296l-3.866-.458L7.68.783z",
      fill: e
    }
  )
)), TD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M10 7.854a4.5 4.5 0 10-6 0V13a.5.5 0 00.497.5h.006c.127 0 .254-.05.35-.146L7 11.207l2.146 2.147A.5.5 0 0010 13V7.854zM7 8a3.5 3.5 \
0 100-7 3.5 3.5 0 000 7zm-.354 2.146a.5.5 0 01.708 0L9 11.793v-3.26C8.398 8.831 7.718 9 7 9a4.481 4.481 0 01-2-.468v3.26l1.646-1.646z",
      fill: e
    }
  )
)), ID = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M6.565 13.123a.991.991 0 01.87 0l.987.482a.991.991 0 001.31-.426l.515-.97a.991.991 0 01.704-.511l1.082-.19a.99.99 0 00.81-1.115l-.\
154-1.087a.991.991 0 01.269-.828l.763-.789a.991.991 0 000-1.378l-.763-.79a.991.991 0 01-.27-.827l.155-1.087a.99.99 0 00-.81-1.115l-1.082-.19\
a.991.991 0 01-.704-.511L9.732.82a.99.99 0 00-1.31-.426l-.987.482a.991.991 0 01-.87 0L5.578.395a.99.99 0 00-1.31.426l-.515.97a.99.99 0 01-.7\
04.511l-1.082.19a.99.99 0 00-.81 1.115l.154 1.087a.99.99 0 01-.269.828L.28 6.31a.99.99 0 000 1.378l.763.79a.99.99 0 01.27.827l-.155 1.087a.9\
9.99 0 00.81 1.115l1.082.19a.99.99 0 01.704.511l.515.97c.25.473.83.661 1.31.426l.987-.482zm4.289-8.477a.5.5 0 010 .708l-4.5 4.5a.5.5 0 01-.7\
08 0l-2.5-2.5a.5.5 0 11.708-.708L6 8.793l4.146-4.147a.5.5 0 01.708 0z",
      fill: e
    }
  )
)), BD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M11 12.02c-.4.37-.91.56-1.56.56h-.88a5.493 5.493 0 01-1.3-.16c-.42-.1-.91-.25-1.47-.45a5.056 5.056 0 00-.95-.27H2.88a.84.84 0 01-.\
62-.26.84.84 0 01-.26-.61V6.45c0-.24.09-.45.26-.62a.84.84 0 01.62-.25h1.87c.16-.11.47-.47.93-1.06.27-.35.51-.64.74-.88.1-.11.19-.3.24-.58.05\
-.28.12-.57.2-.87.1-.3.24-.55.43-.74a.87.87 0 01.62-.25c.38 0 .72.07 1.03.22.3.15.54.38.7.7.15.31.23.73.23 1.27a3 3 0 01-.32 1.31h1.2c.47 0 \
.88.17 1.23.52s.52.8.52 1.22c0 .29-.04.66-.34 1.12.05.15.07.3.07.47 0 .35-.09.68-.26.98a2.05 2.05 0 01-.4 1.51 1.9 1.9 0 01-.57 1.5zm.473-5.\
33a.965.965 0 00.027-.25.742.742 0 00-.227-.513.683.683 0 00-.523-.227H7.927l.73-1.45a2 2 0 00.213-.867c0-.444-.068-.695-.127-.822a.53.53 0 \
00-.245-.244 1.296 1.296 0 00-.539-.116.989.989 0 00-.141.28 9.544 9.544 0 00-.174.755c-.069.387-.213.779-.484 1.077l-.009.01-.009.01c-.195.\
202-.41.46-.67.798l-.003.004c-.235.3-.44.555-.613.753-.151.173-.343.381-.54.516l-.255.176H5v4.133l.018.003c.384.07.76.176 1.122.318.532.189.\
98.325 1.352.413l.007.002a4.5 4.5 0 001.063.131h.878c.429 0 .683-.115.871-.285a.9.9 0 00.262-.702l-.028-.377.229-.3a1.05 1.05 0 00.205-.774l\
-.044-.333.165-.292a.969.969 0 00.13-.487.457.457 0 00-.019-.154l-.152-.458.263-.404a1.08 1.08 0 00.152-.325zM3.5 10.8a.5.5 0 100-1 .5.5 0 0\
00 1z",
      fill: e
    }
  )
)), MD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M11.765 2.076A.5.5 0 0112 2.5v6.009a.497.497 0 01-.17.366L7.337 12.87a.497.497 0 01-.674 0L2.17 8.875l-.009-.007a.498.498 0 01-.16\
-.358L2 8.5v-6a.5.5 0 01.235-.424l.018-.011c.016-.01.037-.024.065-.04.056-.032.136-.077.24-.128a6.97 6.97 0 01.909-.371C4.265 1.26 5.443 1 7\
 1s2.735.26 3.533.526c.399.133.702.267.91.37a4.263 4.263 0 01.304.169l.018.01zM3 2.793v5.482l1.068.95 6.588-6.588a6.752 6.752 0 00-.44-.163C\
9.517 2.24 8.444 2 7 2c-1.443 0-2.515.24-3.217.474-.351.117-.61.233-.778.317L3 2.793zm4 9.038l-2.183-1.94L11 3.706v4.568l-4 3.556z",
      fill: e
    }
  )
)), _D = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M10.354 2.854a.5.5 0 10-.708-.708l-3 3a.5.5 0 10.708.708l3-3z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M2.09 6H4.5a.5.5 0 000-1H1.795a.75.75 0 00-.74.873l.813 4.874A1.5 1.5 0 003.348 12h7.305a1.5 1.5 0 001.48-1.253l.812-4.874a.75.75 \
0 00-.74-.873H10a.5.5 0 000 1h1.91l-.764 4.582a.5.5 0 01-.493.418H3.347a.5.5 0 01-.493-.418L2.09 6z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M4.5 7a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zM10 7.5a.5.5 0 00-1 0v2a.5.5 0 001 0v-2zM6.5 9.5v-2a.5.5 0 011 0v2a.5.5 0 0\
1-1 0z",
      fill: e
    }
  )
)), PD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M4.5 2h.75v3.866l-3.034 5.26A1.25 1.25 0 003.299 13H10.7a1.25 1.25 0 001.083-1.875L8.75 5.866V2h.75a.5.5 0 100-1h-5a.5.5 0 000 1zm\
1.75 4V2h1.5v4.134l.067.116L8.827 8H5.173l1.01-1.75.067-.116V6zM4.597 9l-1.515 2.625A.25.25 0 003.3 12H10.7a.25.25 0 00.217-.375L9.404 9H4.5\
97z",
      fill: e
    }
  )
)), HD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("path", { d: "M7.5 10.5a.5.5 0 11-1 0 .5.5 0 011 0z", fill: e }),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3.5 1a.5.5 0 00-.5.5c0 1.063.137 1.892.678 2.974.346.692.858 1.489 1.598 2.526-.89 1.247-1.455 2.152-1.798 2.956-.377.886-.477 1.\
631-.478 2.537v.007a.5.5 0 00.5.5h7c.017 0 .034 0 .051-.003A.5.5 0 0011 12.5v-.007c0-.906-.1-1.65-.478-2.537-.343-.804-.909-1.709-1.798-2.95\
6.74-1.037 1.252-1.834 1.598-2.526C10.863 3.392 11 2.563 11 1.5a.5.5 0 00-.5-.5h-7zm6.487 11a4.675 4.675 0 00-.385-1.652c-.277-.648-.735-1.4\
07-1.499-2.494-.216.294-.448.606-.696.937a.497.497 0 01-.195.162.5.5 0 01-.619-.162c-.248-.331-.48-.643-.696-.937-.764 1.087-1.222 1.846-1.4\
99 2.494A4.675 4.675 0 004.013 12h5.974zM6.304 6.716c.212.293.443.609.696.948a90.058 90.058 0 00.709-.965c.48-.664.86-1.218 1.163-1.699H5.12\
8a32.672 32.672 0 001.176 1.716zM4.559 4h4.882c.364-.735.505-1.312.546-2H4.013c.04.688.182 1.265.546 2z",
      fill: e
    }
  )
)), zD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M11.5 1h-9a.5.5 0 00-.5.5v11a.5.5 0 001 0V8h8.5a.5.5 0 00.354-.854L9.207 4.5l2.647-2.646A.499.499 0 0011.5 1zM8.146 4.146L10.293 2\
H3v5h7.293L8.146 4.854a.5.5 0 010-.708z",
      fill: e
    }
  )
)), OD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M10 7V6a3 3 0 00-5.91-.736l-.17.676-.692.075A2.5 2.5 0 003.5 11h3c.063 0 .125-.002.187-.007l.076-.005.076.006c.053.004.106.006.161\
.006h4a2 2 0 100-4h-1zM3.12 5.02A3.5 3.5 0 003.5 12h3c.087 0 .174-.003.26-.01.079.007.16.01.24.01h4a3 3 0 100-6 4 4 0 00-7.88-.98z",
      fill: e
    }
  )
)), ND = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7 2a4 4 0 014 4 3 3 0 110 6H7c-.08 0-.161-.003-.24-.01-.086.007-.173.01-.26.01h-3a3.5 3.5 0 01-.38-6.98A4.002 4.002 0 017 2z",
      fill: e
    }
  )
)), $D = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M11 7a4 4 0 11-8 0 4 4 0 018 0zm-1 0a3 3 0 11-6 0 3 3 0 016 0z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M4.268 13.18c.25.472.83.66 1.31.425l.987-.482a.991.991 0 01.87 0l.987.482a.991.991 0 001.31-.426l.515-.97a.991.991 0 01.704-.511l1\
.082-.19a.99.99 0 00.81-1.115l-.154-1.087a.991.991 0 01.269-.828l.763-.789a.991.991 0 000-1.378l-.763-.79a.991.991 0 01-.27-.827l.155-1.087a\
.99.99 0 00-.81-1.115l-1.082-.19a.991.991 0 01-.704-.511L9.732.82a.99.99 0 00-1.31-.426l-.987.482a.991.991 0 01-.87 0L5.578.395a.99.99 0 00-\
1.31.426l-.515.97a.99.99 0 01-.704.511l-1.082.19a.99.99 0 00-.81 1.115l.154 1.087a.99.99 0 01-.269.828L.28 6.31a.99.99 0 000 1.378l.763.79a.\
99.99 0 01.27.827l-.155 1.087a.99.99 0 00.81 1.115l1.082.19a.99.99 0 01.704.511l.515.97zm5.096-1.44l-.511.963-.979-.478a1.99 1.99 0 00-1.748\
 0l-.979.478-.51-.962a1.991 1.991 0 00-1.415-1.028l-1.073-.188.152-1.079a1.991 1.991 0 00-.54-1.663L1.004 7l.757-.783a1.991 1.991 0 00.54-1.\
663L2.15 3.475l1.073-.188A1.991 1.991 0 004.636 2.26l.511-.962.979.478a1.99 1.99 0 001.748 0l.979-.478.51.962c.288.543.81.922 1.415 1.028l1.\
073.188-.152 1.079a1.99 1.99 0 00.54 1.663l.757.783-.757.783a1.99 1.99 0 00-.54 1.663l.152 1.079-1.073.188a1.991 1.991 0 00-1.414 1.028z",
      fill: e
    }
  )
)), VD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 4a3 3 0 100 6 3 3 0 000-6zM3 7a4 4 0 118 0 4 4 0 01-8 0z",
      fill: e
    }
  )
)), jD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("circle", { cx: 7, cy: 7, r: 3, fill: e })
)), WD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7.206 3.044a.498.498 0 01.23.212l3.492 5.985a.494.494 0 01.006.507.497.497 0 01-.443.252H3.51a.499.499 0 01-.437-.76l3.492-5.984a\
.497.497 0 01.642-.212zM7 4.492L4.37 9h5.26L7 4.492z",
      fill: e
    }
  )
)), qD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M10.854 4.146a.5.5 0 010 .708l-5 5a.5.5 0 01-.708 0l-2-2a.5.5 0 11.708-.708L5.5 8.793l4.646-4.647a.5.5 0 01.708 0z",
      fill: e
    }
  )
)), UD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7.354 3.896l5.5 5.5a.5.5 0 01-.708.708L7 4.957l-5.146 5.147a.5.5 0 01-.708-.708l5.5-5.5a.5.5 0 01.708 0z",
      fill: e
    }
  )
)), GD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.146 4.604l5.5 5.5a.5.5 0 00.708 0l5.5-5.5a.5.5 0 00-.708-.708L7 9.043 1.854 3.896a.5.5 0 10-.708.708z",
      fill: e
    }
  )
)), YD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M2.76 7.096a.498.498 0 00.136.258l5.5 5.5a.5.5 0 00.707-.708L3.958 7l5.147-5.146a.5.5 0 10-.708-.708l-5.5 5.5a.5.5 0 00-.137.45z",
      fill: e
    }
  )
)), qu = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M11.104 7.354l-5.5 5.5a.5.5 0 01-.708-.708L10.043 7 4.896 1.854a.5.5 0 11.708-.708l5.5 5.5a.5.5 0 010 .708z",
      fill: e
    }
  )
)), XD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M3.854 9.104a.5.5 0 11-.708-.708l3.5-3.5a.5.5 0 01.708 0l3.5 3.5a.5.5 0 01-.708.708L7 5.957 3.854 9.104z",
      fill: e
    }
  )
)), ZD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M3.854 4.896a.5.5 0 10-.708.708l3.5 3.5a.5.5 0 00.708 0l3.5-3.5a.5.5 0 00-.708-.708L7 8.043 3.854 4.896z",
      fill: e
    }
  )
)), KD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M9.104 10.146a.5.5 0 01-.708.708l-3.5-3.5a.5.5 0 010-.708l3.5-3.5a.5.5 0 11.708.708L5.957 7l3.147 3.146z",
      fill: e
    }
  )
)), JD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M4.896 10.146a.5.5 0 00.708.708l3.5-3.5a.5.5 0 000-.708l-3.5-3.5a.5.5 0 10-.708.708L8.043 7l-3.147 3.146z",
      fill: e
    }
  )
)), QD = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M11.854 4.646l-4.5-4.5a.5.5 0 00-.708 0l-4.5 4.5a.5.5 0 10.708.708L6.5 1.707V13.5a.5.5 0 001 0V1.707l3.646 3.647a.5.5 0 00.708-.70\
8z",
      fill: e
    }
  )
)), ex = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7.5.5a.5.5 0 00-1 0v11.793L2.854 8.646a.5.5 0 10-.708.708l4.5 4.5a.5.5 0 00.351.146h.006c.127 0 .254-.05.35-.146l4.5-4.5a.5.5 0 0\
0-.707-.708L7.5 12.293V.5z",
      fill: e
    }
  )
)), tx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M5.354 2.146a.5.5 0 010 .708L1.707 6.5H13.5a.5.5 0 010 1H1.707l3.647 3.646a.5.5 0 01-.708.708l-4.5-4.5a.5.5 0 010-.708l4.5-4.5a.5.\
5 0 01.708 0z",
      fill: e
    }
  )
)), rx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M8.646 2.146a.5.5 0 01.708 0l4.5 4.5a.5.5 0 010 .708l-4.5 4.5a.5.5 0 01-.708-.708L12.293 7.5H.5a.5.5 0 010-1h11.793L8.646 2.854a.5\
.5 0 010-.708z",
      fill: e
    }
  )
)), nx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.904 8.768V2.404a.5.5 0 01.5-.5h6.364a.5.5 0 110 1H3.61l8.339 8.339a.5.5 0 01-.707.707l-8.34-8.34v5.158a.5.5 0 01-1 0z",
      fill: e
    }
  )
)), ox = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M12.096 8.768V2.404a.5.5 0 00-.5-.5H5.232a.5.5 0 100 1h5.157L2.05 11.243a.5.5 0 10.707.707l8.34-8.34v5.158a.5.5 0 101 0z",
      fill: e
    }
  )
)), ax = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.904 5.232v6.364a.5.5 0 00.5.5h6.364a.5.5 0 000-1H3.61l8.339-8.339a.5.5 0 00-.707-.707l-8.34 8.34V5.231a.5.5 0 00-1 0z",
      fill: e
    }
  )
)), ix = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M12.096 5.232v6.364a.5.5 0 01-.5.5H5.232a.5.5 0 010-1h5.157L2.05 2.757a.5.5 0 01.707-.707l8.34 8.34V5.231a.5.5 0 111 0z",
      fill: e
    }
  )
)), lx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M6.772 3.59c.126-.12.33-.12.456 0l5.677 5.387c.203.193.06.523-.228.523H1.323c-.287 0-.431-.33-.228-.523L6.772 3.59z",
      fill: e
    }
  )
)), sx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7.228 10.41a.335.335 0 01-.456 0L1.095 5.023c-.203-.193-.06-.523.228-.523h11.354c.287 0 .431.33.228.523L7.228 10.41z",
      fill: e
    }
  )
)), ux = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3.712 7.212a.3.3 0 010-.424l5.276-5.276a.3.3 0 01.512.212v10.552a.3.3 0 01-.512.212L3.712 7.212z",
      fill: e
    }
  )
)), cx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M10.288 7.212a.3.3 0 000-.424L5.012 1.512a.3.3 0 00-.512.212v10.552a.3.3 0 00.512.212l5.276-5.276z",
      fill: e
    }
  )
)), px = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7.354.146l4 4a.5.5 0 01-.708.708L7 1.207 3.354 4.854a.5.5 0 11-.708-.708l4-4a.5.5 0 01.708 0zM11.354 9.146a.5.5 0 010 .708l-4 4a.\
5.5 0 01-.708 0l-4-4a.5.5 0 11.708-.708L7 12.793l3.646-3.647a.5.5 0 01.708 0z",
      fill: e
    }
  )
)), dx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M3.354.146a.5.5 0 10-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 00-.708-.708L7 3.793 3.354.146zM6.646 9.146a.5.5 0 01.708 0l4 4a.5.5 \
0 01-.708.708L7 10.207l-3.646 3.647a.5.5 0 01-.708-.708l4-4z",
      fill: e
    }
  )
)), fx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.5 1h2a.5.5 0 010 1h-.793l3.147 3.146a.5.5 0 11-.708.708L2 2.707V3.5a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zM10 1.5a.5.5 0 01.5-.5h2a.5\
.5 0 01.5.5v2a.5.5 0 01-1 0v-.793L8.854 5.854a.5.5 0 11-.708-.708L11.293 2H10.5a.5.5 0 01-.5-.5zM12.5 10a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.\
5.5 0 010-1h.793L8.146 8.854a.5.5 0 11.708-.708L12 11.293V10.5a.5.5 0 01.5-.5zM2 11.293V10.5a.5.5 0 00-1 0v2a.5.5 0 00.5.5h2a.5.5 0 000-1h-.\
793l3.147-3.146a.5.5 0 10-.708-.708L2 11.293z",
      fill: e
    }
  )
)), hx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M6.646.147l-1.5 1.5a.5.5 0 10.708.707l.646-.647V5a.5.5 0 001 0V1.707l.646.647a.5.5 0 10.708-.707l-1.5-1.5a.5.5 0 00-.708 0z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.309 4.038a.498.498 0 00-.16.106l-.005.005a.498.498 0 00.002.705L3.293 7 1.146 9.146A.498.498 0 001.5 10h3a.5.5 0 000-1H2.707l1.\
5-1.5h5.586l2.353 2.354a.5.5 0 00.708-.708L10.707 7l2.146-2.146.11-.545-.107.542A.499.499 0 0013 4.503v-.006a.5.5 0 00-.144-.348l-.005-.005A\
.498.498 0 0012.5 4h-3a.5.5 0 000 1h1.793l-1.5 1.5H4.207L2.707 5H4.5a.5.5 0 000-1h-3a.498.498 0 00-.191.038z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7 8.5a.5.5 0 01.5.5v3.293l.646-.647a.5.5 0 01.708.708l-1.5 1.5a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 01.708-.708l.646.647V9a.5.5 0 01.\
5-.5zM9 9.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5z",
      fill: e
    }
  )
)), mx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M10.646 2.646a.5.5 0 01.708 0l1.5 1.5a.5.5 0 010 .708l-1.5 1.5a.5.5 0 01-.708-.708L11.293 5H1.5a.5.5 0 010-1h9.793l-.647-.646a.5.5\
 0 010-.708zM3.354 8.354L2.707 9H12.5a.5.5 0 010 1H2.707l.647.646a.5.5 0 01-.708.708l-1.5-1.5a.5.5 0 010-.708l1.5-1.5a.5.5 0 11.708.708z",
      fill: e
    }
  )
)), gx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.5 1a.5.5 0 01.5.5V10a2 2 0 004 0V4a3 3 0 016 0v7.793l1.146-1.147a.5.5 0 01.708.708l-2 2a.5.5 0 01-.708 0l-2-2a.5.5 0 01.708-.70\
8L11 11.793V4a2 2 0 10-4 0v6.002a3 3 0 01-6 0V1.5a.5.5 0 01.5-.5z",
      fill: e
    }
  )
)), vx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.146 3.854a.5.5 0 010-.708l2-2a.5.5 0 11.708.708L2.707 3h6.295A4 4 0 019 11H3a.5.5 0 010-1h6a3 3 0 100-6H2.707l1.147 1.146a.5.5 \
0 11-.708.708l-2-2z",
      fill: e
    }
  )
)), wx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M4.354 2.146a.5.5 0 010 .708L1.707 5.5H9.5A4.5 4.5 0 0114 10v1.5a.5.5 0 01-1 0V10a3.5 3.5 0 00-3.5-3.5H1.707l2.647 2.646a.5.5 0 11\
-.708.708l-3.5-3.5a.5.5 0 010-.708l3.5-3.5a.5.5 0 01.708 0z",
      fill: e
    }
  )
)), bx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M5.5 1A.5.5 0 005 .5H2a.5.5 0 000 1h1.535a6.502 6.502 0 002.383 11.91.5.5 0 10.165-.986A5.502 5.502 0 014.5 2.1V4a.5.5 0 001 0V1.3\
53a.5.5 0 000-.023V1zM7.507 1a.5.5 0 01.576-.41 6.502 6.502 0 012.383 11.91H12a.5.5 0 010 1H9a.5.5 0 01-.5-.5v-3a.5.5 0 011 0v1.9A5.5 5.5 0 \
007.917 1.576.5.5 0 017.507 1z",
      fill: e
    }
  )
)), yx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M8.646 5.854L7.5 4.707V10.5a.5.5 0 01-1 0V4.707L5.354 5.854a.5.5 0 11-.708-.708l2-2a.5.5 0 01.708 0l2 2a.5.5 0 11-.708.708z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7A7 7 0 110 7a7 7 0 0114 0zm-1 0A6 6 0 111 7a6 6 0 0112 0z",
      fill: e
    }
  )
)), Dx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M5.354 8.146L6.5 9.293V3.5a.5.5 0 011 0v5.793l1.146-1.147a.5.5 0 11.708.708l-2 2a.5.5 0 01-.708 0l-2-2a.5.5 0 11.708-.708z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M0 7a7 7 0 1114 0A7 7 0 010 7zm1 0a6 6 0 1112 0A6 6 0 011 7z",
      fill: e
    }
  )
)), xx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M5.854 5.354L4.707 6.5H10.5a.5.5 0 010 1H4.707l1.147 1.146a.5.5 0 11-.708.708l-2-2a.5.5 0 010-.708l2-2a.5.5 0 11.708.708z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 0a7 7 0 110 14A7 7 0 017 0zm0 1a6 6 0 110 12A6 6 0 017 1z",
      fill: e
    }
  )
)), Cx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M3.5 6.5h5.793L8.146 5.354a.5.5 0 11.708-.708l2 2a.5.5 0 010 .708l-2 2a.5.5 0 11-.708-.708L9.293 7.5H3.5a.5.5 0 010-1z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 14A7 7 0 117 0a7 7 0 010 14zm0-1A6 6 0 117 1a6 6 0 010 12z",
      fill: e
    }
  )
)), Ex = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7.092.5H7a6.5 6.5 0 106.41 7.583.5.5 0 10-.986-.166A5.495 5.495 0 017 12.5a5.5 5.5 0 010-11h.006a5.5 5.5 0 014.894 3H10a.5.5 0 00\
0 1h3a.5.5 0 00.5-.5V2a.5.5 0 00-1 0v1.535A6.495 6.495 0 007.092.5z",
      fill: e
    }
  )
)), Rx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7A7 7 0 100 7a7 7 0 0014 0zm-6.535 5.738c-.233.23-.389.262-.465.262-.076 0-.232-.032-.465-.262-.238-.234-.497-.623-.737-1.182-\
.434-1.012-.738-2.433-.79-4.056h3.984c-.052 1.623-.356 3.043-.79 4.056-.24.56-.5.948-.737 1.182zM8.992 6.5H5.008c.052-1.623.356-3.044.79-4.0\
56.24-.56.5-.948.737-1.182C6.768 1.032 6.924 1 7 1c.076 0 .232.032.465.262.238.234.497.623.737 1.182.434 1.012.738 2.433.79 4.056zm1 1c-.065\
 2.176-.558 4.078-1.282 5.253A6.005 6.005 0 0012.98 7.5H9.992zm2.987-1H9.992c-.065-2.176-.558-4.078-1.282-5.253A6.005 6.005 0 0112.98 6.5zm-\
8.971 0c.065-2.176.558-4.078 1.282-5.253A6.005 6.005 0 001.02 6.5h2.988zm-2.987 1a6.005 6.005 0 004.27 5.253C4.565 11.578 4.072 9.676 4.007 \
7.5H1.02z",
      fill: e
    }
  )
)), Sx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M10.087 3.397L5.95 5.793a.374.374 0 00-.109.095.377.377 0 00-.036.052l-2.407 4.147a.374.374 0 00-.004.384c.104.179.334.24.513.136l\
4.142-2.404a.373.373 0 00.148-.143l2.406-4.146a.373.373 0 00-.037-.443.373.373 0 00-.478-.074zM4.75 9.25l2.847-1.652-1.195-1.195L4.75 9.25z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7A7 7 0 110 7a7 7 0 0114 0zm-1 0A6 6 0 111 7a6 6 0 0112 0z",
      fill: e
    }
  )
)), Ax = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M0 7a7 7 0 1114 0A7 7 0 010 7zm6.5 3.5v2.48A6.001 6.001 0 011.02 7.5H3.5a.5.5 0 000-1H1.02A6.001 6.001 0 016.5 1.02V3.5a.5.5 0 001\
 0V1.02a6.001 6.001 0 015.48 5.48H10.5a.5.5 0 000 1h2.48a6.002 6.002 0 01-5.48 5.48V10.5a.5.5 0 00-1 0z",
      fill: e
    }
  )
)), Fx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M9 5a2 2 0 11-4 0 2 2 0 014 0zM8 5a1 1 0 11-2 0 1 1 0 012 0z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M12 5A5 5 0 002 5c0 2.633 2.273 6.154 4.65 8.643.192.2.508.2.7 0C9.726 11.153 12 7.633 12 5zM7 1a4 4 0 014 4c0 1.062-.471 2.42-1.3\
03 3.88-.729 1.282-1.69 2.562-2.697 3.67-1.008-1.108-1.968-2.388-2.697-3.67C3.47 7.42 3 6.063 3 5a4 4 0 014-4z",
      fill: e
    }
  )
)), kx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7 2a.5.5 0 01.5.5v4H10a.5.5 0 010 1H7a.5.5 0 01-.5-.5V2.5A.5.5 0 017 2z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 14A7 7 0 107 0a7 7 0 000 14zm0-1A6 6 0 107 1a6 6 0 000 12z",
      fill: e
    }
  )
)), Lx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M9.79 4.093a.5.5 0 01.117.698L7.91 7.586a1 1 0 11-.814-.581l1.997-2.796a.5.5 0 01.698-.116z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M2.069 12.968a7 7 0 119.863 0A12.962 12.962 0 007 12c-1.746 0-3.41.344-4.931.968zm9.582-1.177a6 6 0 10-9.301 0A13.98 13.98 0 017 1\
1c1.629 0 3.194.279 4.65.791z",
      fill: e
    }
  )
)), Tx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("path", { d: "M7.5 4.5a.5.5 0 00-1 0v2.634a1 1 0 101 0V4.5z", fill: e }),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M5.5.5A.5.5 0 016 0h2a.5.5 0 010 1h-.5v1.02a5.973 5.973 0 013.374 1.398l.772-.772a.5.5 0 01.708.708l-.772.772A6 6 0 116.5 2.02V1H6\
a.5.5 0 01-.5-.5zM7 3a5 5 0 100 10A5 5 0 007 3z",
      fill: e
    }
  )
)), Ix = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7.354 1.146l5.5 5.5a.5.5 0 01-.708.708L12 7.207V12.5a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5V9H6v3.5a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5V\
7.207l-.146.147a.5.5 0 11-.708-.708l1-1 4.5-4.5a.5.5 0 01.708 0zM3 6.207V12h2V8.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V12h2V6.207l-4-4-4 4z",
      fill: e
    }
  )
)), Bx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1.213 4.094a.5.5 0 01.056-.034l5.484-2.995a.498.498 0 01.494 0L12.73 4.06a.507.507 0 01.266.389.498.498 0 01-.507.555H1.51a.5.5 0\
 01-.297-.91zm2.246-.09h7.082L7 2.07 3.459 4.004z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M4 6a.5.5 0 00-1 0v5a.5.5 0 001 0V6zM11 6a.5.5 0 00-1 0v5a.5.5 0 001 0V6zM5.75 5.5a.5.5 0 01.5.5v5a.5.5 0 01-1 0V6a.5.5 0 01.5-.5z\
M8.75 6a.5.5 0 00-1 0v5a.5.5 0 001 0V6zM1.5 12.504a.5.5 0 01.5-.5h10a.5.5 0 010 1H2a.5.5 0 01-.5-.5z",
      fill: e
    }
  )
)), Mx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("g", { clipPath: "url(#prefix__clip0_1107_3594)" }, /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M11.451.537l.01 12.922h0L7.61 8.946a1.077 1.077 0 00-.73-.374L.964 8.087 11.45.537h0z",
      stroke: e,
      strokeWidth: 1.077
    }
  )),
  /* @__PURE__ */ s.createElement("defs", null, /* @__PURE__ */ s.createElement("clipPath", { id: "prefix__clip0_1107_3594" }, /* @__PURE__ */ s.createElement(
  "path", { fill: "#fff", d: "M0 0h14v14H0z" })))
)), _x = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7A7 7 0 110 7a7 7 0 0114 0zM2.671 11.155c.696-1.006 2.602-1.816 3.194-1.91.226-.036.232-.658.232-.658s-.665-.658-.81-1.544c-.3\
9 0-.63-.94-.241-1.272a2.578 2.578 0 00-.012-.13c-.066-.607-.28-2.606 1.965-2.606 2.246 0 2.031 2 1.966 2.606l-.012.13c.39.331.149 1.272-.24\
 1.272-.146.886-.81 1.544-.81 1.544s.004.622.23.658c.593.094 2.5.904 3.195 1.91a6 6 0 10-8.657 0z",
      fill: e
    }
  )
)), Px = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M7.275 13.16a11.388 11.388 0 005.175-1.232v-.25c0-1.566-3.237-2.994-4.104-3.132-.27-.043-.276-.783-.276-.783s.791-.783.964-1.836c.\
463 0 .75-1.119.286-1.513C9.34 4 9.916 1.16 6.997 1.16c-2.92 0-2.343 2.84-2.324 3.254-.463.394-.177 1.513.287 1.513.172 1.053.963 1.836.963 \
1.836s-.006.74-.275.783c-.858.136-4.036 1.536-4.103 3.082a11.388 11.388 0 005.73 1.532z",
      fill: e
    }
  )
)), Hx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M1.183 11.906a10.645 10.645 0 01-1.181-.589c.062-1.439 3.02-2.74 3.818-2.868.25-.04.256-.728.256-.728s-.736-.729-.896-1.709c-.432 \
0-.698-1.041-.267-1.408A2.853 2.853 0 002.9 4.46c-.072-.672-.31-2.884 2.175-2.884 2.486 0 2.248 2.212 2.176 2.884-.007.062-.012.112-.014.144\
.432.367.165 1.408-.266 1.408-.16.98-.896 1.709-.896 1.709s.005.688.256.728c.807.129 3.82 1.457 3.82 2.915v.233a10.598 10.598 0 01-4.816 1.1\
46c-1.441 0-2.838-.282-4.152-.837zM11.5 2.16a.5.5 0 01.5.5v1.5h1.5a.5.5 0 010 1H12v1.5a.5.5 0 01-1 0v-1.5H9.5a.5.5 0 110-1H11v-1.5a.5.5 0 01\
.5-.5z",
      fill: e
    }
  )
)), zx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M9.21 11.623a10.586 10.586 0 01-4.031.787A10.585 10.585 0 010 11.07c.06-1.354 2.933-2.578 3.708-2.697.243-.038.249-.685.249-.685s-\
.715-.685-.87-1.607c-.42 0-.679-.979-.26-1.323a2.589 2.589 0 00-.013-.136c-.07-.632-.3-2.712 2.113-2.712 2.414 0 2.183 2.08 2.113 2.712-.007\
.059-.012.105-.013.136.419.344.16 1.323-.259 1.323-.156.922-.87 1.607-.87 1.607s.005.647.248.685c.784.12 3.71 1.37 3.71 2.74v.22c-.212.103-.\
427.2-.646.29z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M8.81 8.417a9.643 9.643 0 00-.736-.398c.61-.42 1.396-.71 1.7-.757.167-.026.171-.471.171-.471s-.491-.471-.598-1.104c-.288 0-.466-.6\
74-.178-.91-.001-.022-.005-.053-.01-.094-.048-.434-.206-1.864 1.453-1.864 1.66 0 1.5 1.43 1.453 1.864l-.01.094c.289.236.11.91-.178.91-.107.6\
33-.598 1.104-.598 1.104s.004.445.171.47c.539.084 2.55.942 2.55 1.884v.628a10.604 10.604 0 01-3.302.553 2.974 2.974 0 00-.576-.879c-.375-.40\
8-.853-.754-1.312-1.03z",
      fill: e
    }
  )
)), Ox = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M9.106 7.354c-.627.265-1.295.4-1.983.4a5.062 5.062 0 01-2.547-.681c.03-.688 1.443-1.31 1.824-1.37.12-.02.122-.348.122-.348s-.351-.\
348-.428-.816c-.206 0-.333-.498-.127-.673 0-.016-.003-.04-.007-.07C5.926 3.477 5.812 2.42 7 2.42c1.187 0 1.073 1.057 1.039 1.378l-.007.069c.\
207.175.08.673-.127.673-.076.468-.428.816-.428.816s.003.329.122.348c.386.06 1.825.696 1.825 1.392v.111c-.104.053-.21.102-.318.148zM3.75 11.2\
5A.25.25 0 014 11h6a.25.25 0 110 .5H4a.25.25 0 01-.25-.25zM4 9a.25.25 0 000 .5h6a.25.25 0 100-.5H4z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M1 .5a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v13a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5V.5zM2 13V1h10v12H2z",
      fill: e
    }
  )
)), Nx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M3.968 8.75a.5.5 0 00-.866.5A4.498 4.498 0 007 11.5c1.666 0 3.12-.906 3.898-2.25a.5.5 0 10-.866-.5A3.498 3.498 0 017 10.5a3.498 3.\
498 0 01-3.032-1.75zM5.5 5a1 1 0 11-2 0 1 1 0 012 0zM9.5 6a1 1 0 100-2 1 1 0 000 2z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7A7 7 0 110 7a7 7 0 0114 0zm-1 0A6 6 0 111 7a6 6 0 0112 0z",
      fill: e
    }
  )
)), $x = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M4.5 9a.5.5 0 000 1h5a.5.5 0 000-1h-5zM5.5 5a1 1 0 11-2 0 1 1 0 012 0zM9.5 6a1 1 0 100-2 1 1 0 000 2z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7A7 7 0 110 7a7 7 0 0114 0zm-1 0A6 6 0 111 7a6 6 0 0112 0z",
      fill: e
    }
  )
)), Vx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M3.968 10.25a.5.5 0 01-.866-.5A4.498 4.498 0 017 7.5c1.666 0 3.12.906 3.898 2.25a.5.5 0 11-.866.5A3.498 3.498 0 007 8.5a3.498 3.49\
8 0 00-3.032 1.75zM5.5 5a1 1 0 11-2 0 1 1 0 012 0zM9.5 6a1 1 0 100-2 1 1 0 000 2z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 7A7 7 0 110 7a7 7 0 0114 0zm-1 0A6 6 0 111 7a6 6 0 0112 0z",
      fill: e
    }
  )
)), jx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      d: "M3.526 4.842a.5.5 0 01.632-.316l2.051.684a2.5 2.5 0 001.582 0l2.05-.684a.5.5 0 01.317.948l-2.453.818a.3.3 0 00-.205.285v.243a4.5 4\
.5 0 00.475 2.012l.972 1.944a.5.5 0 11-.894.448L7 9.118l-1.053 2.106a.5.5 0 11-.894-.447l.972-1.945A4.5 4.5 0 006.5 6.82v-.243a.3.3 0 00-.20\
5-.285l-2.453-.818a.5.5 0 01-.316-.632z",
      fill: e
    }
  ),
  /* @__PURE__ */ s.createElement("path", { d: "M7 4.5a1 1 0 100-2 1 1 0 000 2z", fill: e }),
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 14A7 7 0 107 0a7 7 0 000 14zm0-1A6 6 0 107 1a6 6 0 000 12z",
      fill: e
    }
  )
)), Wx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M7 14A7 7 0 107 0a7 7 0 000 14zM8 3.5a1 1 0 11-2 0 1 1 0 012 0zM3.526 4.842a.5.5 0 01.632-.316l2.051.684a2.5 2.5 0 001.582 0l2.05-\
.684a.5.5 0 01.317.948l-2.453.818a.3.3 0 00-.205.285v.243a4.5 4.5 0 00.475 2.012l.972 1.944a.5.5 0 11-.894.448L7 9.118l-1.053 2.106a.5.5 0 1\
1-.894-.447l.972-1.945A4.5 4.5 0 006.5 6.82v-.243a.3.3 0 00-.205-.285l-2.453-.818a.5.5 0 01-.316-.632z",
      fill: e
    }
  )
)), qx = /* @__PURE__ */ s.forwardRef(({ color: e = "currentColor", size: t = 14, ...r }, n) => /* @__PURE__ */ s.createElement(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ref: n,
    ...r
  },
  /* @__PURE__ */ s.createElement("g", { clipPath: "url(#prefix__clip0_2359_558)", fill: e }, /* @__PURE__ */ s.createElement("path", { d: "\
M7.636 13.972a7 7 0 116.335-6.335c-.28-.34-.609-.637-.976-.883a6 6 0 10-6.24 6.241c.245.367.542.696.881.977z" }), /* @__PURE__ */ s.createElement(
  "path", { d: "M7.511 7.136a4.489 4.489 0 00-1.478 3.915l-.086.173a.5.5 0 11-.894-.447l.972-1.945A4.5 4.5 0 006.5 6.82v-.243a.3.3 0 00-.205\
-.285l-2.453-.818a.5.5 0 01.316-.948l2.051.684a2.5 2.5 0 001.582 0l2.05-.684a.5.5 0 01.317.948l-2.453.818a.3.3 0 00-.205.285v.243c0 .105.004\
.21.011.316z" }), /* @__PURE__ */ s.createElement("path", { d: "M8 3.5a1 1 0 11-2 0 1 1 0 012 0z" }), /* @__PURE__ */ s.createElement(
    "path",
    {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M14 10.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm-5.5 0A.5.5 0 019 10h3a.5.5 0 010 1H9a.5.5 0 01-.5-.5z"
    }
  )),
  /* @__PURE__ */ s.createElement("defs", null, /* @__PURE__ */ s.createElement("clipPath", { id: "prefix__clip0_2359_558" }, /* @__PURE__ */ s.createElement(
  "path", { fill: "#fff", d: "M0 0h14v14H0z" })))
));

// src/components/components/typography/link/link.tsx
var Ux = 0, Gx = /* @__PURE__ */ a((e) => e.button === Ux && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey, "isPlainLeftClick"), Yx = /* @__PURE__ */ a(
(e, t) => {
  Gx(e) && (e.preventDefault(), t(e));
}, "cancelled"), Xx = _2.span(
  ({ withArrow: e }) => e ? {
    "> svg:last-of-type": {
      height: "0.7em",
      width: "0.7em",
      marginRight: 0,
      marginLeft: "0.25em",
      bottom: "auto",
      verticalAlign: "inherit"
    }
  } : {},
  ({ containsIcon: e }) => e ? {
    svg: {
      height: "1em",
      width: "1em",
      verticalAlign: "middle",
      position: "relative",
      bottom: 0,
      marginRight: 0
    }
  } : {}
), Zx = _2.a(
  ({ theme: e }) => ({
    display: "inline-block",
    transition: "all 150ms ease-out",
    textDecoration: "none",
    color: e.color.secondary,
    "&:hover, &:focus": {
      cursor: "pointer",
      color: rr(0.07, e.color.secondary),
      "svg path:not([fill])": {
        fill: rr(0.07, e.color.secondary)
      }
    },
    "&:active": {
      color: rr(0.1, e.color.secondary),
      "svg path:not([fill])": {
        fill: rr(0.1, e.color.secondary)
      }
    },
    svg: {
      display: "inline-block",
      height: "1em",
      width: "1em",
      verticalAlign: "text-top",
      position: "relative",
      bottom: "-0.125em",
      marginRight: "0.4em",
      "& path": {
        fill: e.color.secondary
      }
    }
  }),
  ({ theme: e, secondary: t, tertiary: r }) => {
    let n;
    return t && (n = [e.textMutedColor, e.color.dark, e.color.darker]), r && (n = [e.color.dark, e.color.darkest, e.textMutedColor]), n ? {
      color: n[0],
      "svg path:not([fill])": {
        fill: n[0]
      },
      "&:hover": {
        color: n[1],
        "svg path:not([fill])": {
          fill: n[1]
        }
      },
      "&:active": {
        color: n[2],
        "svg path:not([fill])": {
          fill: n[2]
        }
      }
    } : {};
  },
  ({ nochrome: e }) => e ? {
    color: "inherit",
    "&:hover, &:active": {
      color: "inherit",
      textDecoration: "underline"
    }
  } : {},
  ({ theme: e, inverse: t }) => t ? {
    color: e.color.lightest,
    ":not([fill])": {
      fill: e.color.lightest
    },
    "&:hover": {
      color: e.color.lighter,
      "svg path:not([fill])": {
        fill: e.color.lighter
      }
    },
    "&:active": {
      color: e.color.light,
      "svg path:not([fill])": {
        fill: e.color.light
      }
    }
  } : {},
  ({ isButton: e }) => e ? {
    border: 0,
    borderRadius: 0,
    background: "none",
    padding: 0,
    fontSize: "inherit"
  } : {}
), Yu = /* @__PURE__ */ a(({
  cancel: e = !0,
  children: t,
  onClick: r = void 0,
  withArrow: n = !1,
  containsIcon: o = !1,
  className: i = void 0,
  style: l = void 0,
  ...u
}) => /* @__PURE__ */ Gu.createElement(
  Zx,
  {
    ...u,
    onClick: r && e ? (c) => Yx(c, r) : r,
    className: i
  },
  /* @__PURE__ */ Gu.createElement(Xx, { withArrow: n, containsIcon: o }, t, n && /* @__PURE__ */ Gu.createElement(qu, null))
), "Link");

// src/components/components/typography/DocumentWrapper.tsx
import { styled as Kx } from "@storybook/core/theming";
var Jx = Kx.div(({ theme: e }) => ({
  fontSize: `${e.typography.size.s2}px`,
  lineHeight: "1.6",
  h1: {
    fontSize: `${e.typography.size.l1}px`,
    fontWeight: e.typography.weight.bold
  },
  h2: {
    fontSize: `${e.typography.size.m2}px`,
    borderBottom: `1px solid ${e.appBorderColor}`
  },
  h3: {
    fontSize: `${e.typography.size.m1}px`
  },
  h4: {
    fontSize: `${e.typography.size.s3}px`
  },
  h5: {
    fontSize: `${e.typography.size.s2}px`
  },
  h6: {
    fontSize: `${e.typography.size.s2}px`,
    color: e.color.dark
  },
  "pre:not(.prismjs)": {
    background: "transparent",
    border: "none",
    borderRadius: 0,
    padding: 0,
    margin: 0
  },
  "pre pre, pre.prismjs": {
    padding: 15,
    margin: 0,
    whiteSpace: "pre-wrap",
    color: "inherit",
    fontSize: "13px",
    lineHeight: "19px"
  },
  "pre pre code, pre.prismjs code": {
    color: "inherit",
    fontSize: "inherit"
  },
  "pre code": {
    margin: 0,
    padding: 0,
    whiteSpace: "pre",
    border: "none",
    background: "transparent"
  },
  "pre code, pre tt": {
    backgroundColor: "transparent",
    border: "none"
  },
  /* GitHub inspired Markdown styles loosely from https://gist.github.com/tuzz/3331384 */
  "body > *:first-of-type": {
    marginTop: "0 !important"
  },
  "body > *:last-child": {
    marginBottom: "0 !important"
  },
  a: {
    color: e.color.secondary,
    textDecoration: "none"
  },
  "a.absent": {
    color: "#cc0000"
  },
  "a.anchor": {
    display: "block",
    paddingLeft: 30,
    marginLeft: -30,
    cursor: "pointer",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0
  },
  "h1, h2, h3, h4, h5, h6": {
    margin: "20px 0 10px",
    padding: 0,
    cursor: "text",
    position: "relative",
    "&:first-of-type": {
      marginTop: 0,
      paddingTop: 0
    },
    "&:hover a.anchor": {
      textDecoration: "none"
    },
    "& tt, & code": {
      fontSize: "inherit"
    }
  },
  "h1:first-of-type + h2": {
    marginTop: 0,
    paddingTop: 0
  },
  "p, blockquote, ul, ol, dl, li, table, pre": {
    margin: "15px 0"
  },
  hr: {
    border: "0 none",
    borderTop: `1px solid ${e.appBorderColor}`,
    height: 4,
    padding: 0
  },
  "body > h1:first-of-type, body > h2:first-of-type, body > h3:first-of-type, body > h4:first-of-type, body > h5:first-of-type, body > h6:fi\
rst-of-type": {
    marginTop: 0,
    paddingTop: 0
  },
  "body > h1:first-of-type + h2": {
    marginTop: 0,
    paddingTop: 0
  },
  "a:first-of-type h1, a:first-of-type h2, a:first-of-type h3, a:first-of-type h4, a:first-of-type h5, a:first-of-type h6": {
    marginTop: 0,
    paddingTop: 0
  },
  "h1 p, h2 p, h3 p, h4 p, h5 p, h6 p": {
    marginTop: 0
  },
  "li p.first": {
    display: "inline-block"
  },
  "ul, ol": {
    paddingLeft: 30,
    "& :first-of-type": {
      marginTop: 0
    },
    "& :last-child": {
      marginBottom: 0
    }
  },
  dl: {
    padding: 0
  },
  "dl dt": {
    fontSize: "14px",
    fontWeight: "bold",
    fontStyle: "italic",
    margin: "0 0 15px",
    padding: "0 15px",
    "&:first-of-type": {
      padding: 0
    },
    "& > :first-of-type": {
      marginTop: 0
    },
    "& > :last-child": {
      marginBottom: 0
    }
  },
  blockquote: {
    borderLeft: `4px solid ${e.color.medium}`,
    padding: "0 15px",
    color: e.color.dark,
    "& > :first-of-type": {
      marginTop: 0
    },
    "& > :last-child": {
      marginBottom: 0
    }
  },
  table: {
    padding: 0,
    borderCollapse: "collapse",
    "& tr": {
      borderTop: `1px solid ${e.appBorderColor}`,
      backgroundColor: "white",
      margin: 0,
      padding: 0,
      "& th": {
        fontWeight: "bold",
        border: `1px solid ${e.appBorderColor}`,
        textAlign: "left",
        margin: 0,
        padding: "6px 13px"
      },
      "& td": {
        border: `1px solid ${e.appBorderColor}`,
        textAlign: "left",
        margin: 0,
        padding: "6px 13px"
      },
      "&:nth-of-type(2n)": {
        backgroundColor: e.color.lighter
      },
      "& th :first-of-type, & td :first-of-type": {
        marginTop: 0
      },
      "& th :last-child, & td :last-child": {
        marginBottom: 0
      }
    }
  },
  img: {
    maxWidth: "100%"
  },
  "span.frame": {
    display: "block",
    overflow: "hidden",
    "& > span": {
      border: `1px solid ${e.color.medium}`,
      display: "block",
      float: "left",
      overflow: "hidden",
      margin: "13px 0 0",
      padding: 7,
      width: "auto"
    },
    "& span img": {
      display: "block",
      float: "left"
    },
    "& span span": {
      clear: "both",
      color: e.color.darkest,
      display: "block",
      padding: "5px 0 0"
    }
  },
  "span.align-center": {
    display: "block",
    overflow: "hidden",
    clear: "both",
    "& > span": {
      display: "block",
      overflow: "hidden",
      margin: "13px auto 0",
      textAlign: "center"
    },
    "& span img": {
      margin: "0 auto",
      textAlign: "center"
    }
  },
  "span.align-right": {
    display: "block",
    overflow: "hidden",
    clear: "both",
    "& > span": {
      display: "block",
      overflow: "hidden",
      margin: "13px 0 0",
      textAlign: "right"
    },
    "& span img": {
      margin: 0,
      textAlign: "right"
    }
  },
  "span.float-left": {
    display: "block",
    marginRight: 13,
    overflow: "hidden",
    float: "left",
    "& span": {
      margin: "13px 0 0"
    }
  },
  "span.float-right": {
    display: "block",
    marginLeft: 13,
    overflow: "hidden",
    float: "right",
    "& > span": {
      display: "block",
      overflow: "hidden",
      margin: "13px auto 0",
      textAlign: "right"
    }
  },
  "code, tt": {
    margin: "0 2px",
    padding: "0 5px",
    whiteSpace: "nowrap",
    border: `1px solid ${e.color.mediumlight}`,
    backgroundColor: e.color.lighter,
    borderRadius: 3,
    color: e.base === "dark" ? e.color.darkest : e.color.dark
  }
}));

// src/components/components/syntaxhighlighter/lazy-syntaxhighlighter.tsx
import Po, { Suspense as sL, lazy as zg } from "react";
var Jr = [], Ho = null, uL = zg(async () => {
  let { SyntaxHighlighter: e } = await Promise.resolve().then(() => (xa(), xu));
  return Jr.length > 0 && (Jr.forEach((t) => {
    e.registerLanguage(...t);
  }), Jr = []), Ho === null && (Ho = e), {
    default: /* @__PURE__ */ a((t) => /* @__PURE__ */ Po.createElement(e, { ...t }), "default")
  };
}), cL = zg(async () => {
  let [{ SyntaxHighlighter: e }, { formatter: t }] = await Promise.all([
    Promise.resolve().then(() => (xa(), xu)),
    Promise.resolve().then(() => (Hg(), Pg))
  ]);
  return Jr.length > 0 && (Jr.forEach((r) => {
    e.registerLanguage(...r);
  }), Jr = []), Ho === null && (Ho = e), {
    default: /* @__PURE__ */ a((r) => /* @__PURE__ */ Po.createElement(e, { ...r, formatter: t }), "default")
  };
}), Og = /* @__PURE__ */ a((e) => /* @__PURE__ */ Po.createElement(sL, { fallback: /* @__PURE__ */ Po.createElement("div", null) }, e.format !==
!1 ? /* @__PURE__ */ Po.createElement(cL, { ...e }) : /* @__PURE__ */ Po.createElement(uL, { ...e })), "SyntaxHighlighter");
Og.registerLanguage = (...e) => {
  if (Ho !== null) {
    Ho.registerLanguage(...e);
    return;
  }
  Jr.push(e);
};

// src/components/index.ts
xa();
du();

// src/components/components/Modal/Modal.tsx
import Wo from "react";

// node_modules/@radix-ui/react-dialog/dist/index.mjs
var Hl = {};
gn(Hl, {
  Close: () => Y0,
  Content: () => q0,
  Description: () => G0,
  Dialog: () => T0,
  DialogClose: () => N0,
  DialogContent: () => P0,
  DialogDescription: () => O0,
  DialogOverlay: () => _0,
  DialogPortal: () => M0,
  DialogTitle: () => z0,
  DialogTrigger: () => I0,
  Overlay: () => W0,
  Portal: () => j0,
  Root: () => V0,
  Title: () => U0,
  Trigger: () => IT,
  WarningProvider: () => FT,
  createDialogScope: () => DT
});
import * as Y from "react";

// node_modules/@radix-ui/primitive/dist/index.mjs
function Bt(e, t, { checkForDefaultPrevented: r = !0 } = {}) {
  return /* @__PURE__ */ a(function(o) {
    if (e?.(o), r === !1 || !o.defaultPrevented)
      return t?.(o);
  }, "handleEvent");
}
a(Bt, "composeEventHandlers");

// node_modules/@radix-ui/react-compose-refs/dist/index.mjs
import * as $g from "react";
function Ng(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
a(Ng, "setRef");
function Wa(...e) {
  return (t) => {
    let r = !1, n = e.map((o) => {
      let i = Ng(o, t);
      return !r && typeof i == "function" && (r = !0), i;
    });
    if (r)
      return () => {
        for (let o = 0; o < n.length; o++) {
          let i = n[o];
          typeof i == "function" ? i() : Ng(e[o], null);
        }
      };
  };
}
a(Wa, "composeRefs");
function mt(...e) {
  return $g.useCallback(Wa(...e), e);
}
a(mt, "useComposedRefs");

// node_modules/@radix-ui/react-context/dist/index.mjs
import * as nt from "react";
import { jsx as Vg } from "react/jsx-runtime";
function jg(e, t) {
  let r = nt.createContext(t), n = /* @__PURE__ */ a((i) => {
    let { children: l, ...u } = i, c = nt.useMemo(() => u, Object.values(u));
    return /* @__PURE__ */ Vg(r.Provider, { value: c, children: l });
  }, "Provider");
  n.displayName = e + "Provider";
  function o(i) {
    let l = nt.useContext(r);
    if (l) return l;
    if (t !== void 0) return t;
    throw new Error(`\`${i}\` must be used within \`${e}\``);
  }
  return a(o, "useContext2"), [n, o];
}
a(jg, "createContext2");
function Wg(e, t = []) {
  let r = [];
  function n(i, l) {
    let u = nt.createContext(l), c = r.length;
    r = [...r, l];
    let p = /* @__PURE__ */ a((h) => {
      let { scope: f, children: g, ...w } = h, m = f?.[e]?.[c] || u, v = nt.useMemo(() => w, Object.values(w));
      return /* @__PURE__ */ Vg(m.Provider, { value: v, children: g });
    }, "Provider");
    p.displayName = i + "Provider";
    function d(h, f) {
      let g = f?.[e]?.[c] || u, w = nt.useContext(g);
      if (w) return w;
      if (l !== void 0) return l;
      throw new Error(`\`${h}\` must be used within \`${i}\``);
    }
    return a(d, "useContext2"), [p, d];
  }
  a(n, "createContext3");
  let o = /* @__PURE__ */ a(() => {
    let i = r.map((l) => nt.createContext(l));
    return /* @__PURE__ */ a(function(u) {
      let c = u?.[e] || i;
      return nt.useMemo(
        () => ({ [`__scope${e}`]: { ...u, [e]: c } }),
        [u, c]
      );
    }, "useScope");
  }, "createScope");
  return o.scopeName = e, [n, pL(o, ...t)];
}
a(Wg, "createContextScope");
function pL(...e) {
  let t = e[0];
  if (e.length === 1) return t;
  let r = /* @__PURE__ */ a(() => {
    let n = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return /* @__PURE__ */ a(function(i) {
      let l = n.reduce((u, { useScope: c, scopeName: p }) => {
        let h = c(i)[`__scope${p}`];
        return { ...u, ...h };
      }, {});
      return nt.useMemo(() => ({ [`__scope${t.scopeName}`]: l }), [l]);
    }, "useComposedScopes");
  }, "createScope");
  return r.scopeName = t.scopeName, r;
}
a(pL, "composeContextScopes");

// node_modules/@radix-ui/react-id/dist/index.mjs
import * as s0 from "react";

// node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
import * as qg from "react";
var Yt = globalThis?.document ? qg.useLayoutEffect : () => {
};

// node_modules/@radix-ui/react-id/dist/index.mjs
var dL = s0[" useId ".trim().toString()] || (() => {
}), fL = 0;
function Cl(e) {
  let [t, r] = s0.useState(dL());
  return Yt(() => {
    e || r((n) => n ?? String(fL++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
a(Cl, "useId");

// node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
import * as ot from "react";
import * as El from "react";
var hL = ot[" useInsertionEffect ".trim().toString()] || Yt;
function Ug({
  prop: e,
  defaultProp: t,
  onChange: r = /* @__PURE__ */ a(() => {
  }, "onChange"),
  caller: n
}) {
  let [o, i, l] = mL({
    defaultProp: t,
    onChange: r
  }), u = e !== void 0, c = u ? e : o;
  {
    let d = ot.useRef(e !== void 0);
    ot.useEffect(() => {
      let h = d.current;
      h !== u && console.warn(
        `${n} is changing from ${h ? "controlled" : "uncontrolled"} to ${u ? "controlled" : "uncontrolled"}. Components should not switch fr\
om controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), d.current = u;
    }, [u, n]);
  }
  let p = ot.useCallback(
    (d) => {
      if (u) {
        let h = gL(d) ? d(e) : d;
        h !== e && l.current?.(h);
      } else
        i(d);
    },
    [u, e, i, l]
  );
  return [c, p];
}
a(Ug, "useControllableState");
function mL({
  defaultProp: e,
  onChange: t
}) {
  let [r, n] = ot.useState(e), o = ot.useRef(r), i = ot.useRef(t);
  return hL(() => {
    i.current = t;
  }, [t]), ot.useEffect(() => {
    o.current !== r && (i.current?.(r), o.current = r);
  }, [r, o]), [r, n, i];
}
a(mL, "useUncontrolledState");
function gL(e) {
  return typeof e == "function";
}
a(gL, "isFunction");
var ij = Symbol("RADIX:SYNC_STATE");

// node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
import * as re from "react";

// node_modules/@radix-ui/react-primitive/dist/index.mjs
import * as Xg from "react";
import * as Zg from "react-dom";

// node_modules/@radix-ui/react-primitive/node_modules/@radix-ui/react-slot/dist/index.mjs
import * as pe from "react";
import { Fragment as pj, jsx as Gg } from "react/jsx-runtime";
// @__NO_SIDE_EFFECTS__
function Yg(e) {
  let t = /* @__PURE__ */ vL(e), r = pe.forwardRef((n, o) => {
    let { children: i, ...l } = n, u = pe.Children.toArray(i), c = u.find(bL);
    if (c) {
      let p = c.props.children, d = u.map((h) => h === c ? pe.Children.count(p) > 1 ? pe.Children.only(null) : pe.isValidElement(p) ? p.props.
      children : null : h);
      return /* @__PURE__ */ Gg(t, { ...l, ref: o, children: pe.isValidElement(p) ? pe.cloneElement(p, void 0, d) : null });
    }
    return /* @__PURE__ */ Gg(t, { ...l, ref: o, children: i });
  });
  return r.displayName = `${e}.Slot`, r;
}
a(Yg, "createSlot");
// @__NO_SIDE_EFFECTS__
function vL(e) {
  let t = pe.forwardRef((r, n) => {
    let { children: o, ...i } = r;
    if (pe.isValidElement(o)) {
      let l = DL(o), u = yL(i, o.props);
      return o.type !== pe.Fragment && (u.ref = n ? Wa(n, l) : l), pe.cloneElement(o, u);
    }
    return pe.Children.count(o) > 1 ? pe.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
a(vL, "createSlotClone");
var wL = Symbol("radix.slottable");
function bL(e) {
  return pe.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === wL;
}
a(bL, "isSlottable");
function yL(e, t) {
  let r = { ...t };
  for (let n in t) {
    let o = e[n], i = t[n];
    /^on[A-Z]/.test(n) ? o && i ? r[n] = (...u) => {
      i(...u), o(...u);
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...i } : n === "className" && (r[n] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
a(yL, "mergeProps");
function DL(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref :
  e.props.ref || e.ref);
}
a(DL, "getElementRef");

// node_modules/@radix-ui/react-primitive/dist/index.mjs
import { jsx as xL } from "react/jsx-runtime";
var CL = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], Ye = CL.reduce((e, t) => {
  let r = Yg(`Primitive.${t}`), n = Xg.forwardRef((o, i) => {
    let { asChild: l, ...u } = o, c = l ? r : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ xL(c, { ...u, ref: i });
  });
  return n.displayName = `Primitive.${t}`, { ...e, [t]: n };
}, {});
function Kg(e, t) {
  e && Zg.flushSync(() => e.dispatchEvent(t));
}
a(Kg, "dispatchDiscreteCustomEvent");

// node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
import * as zo from "react";
function mr(e) {
  let t = zo.useRef(e);
  return zo.useEffect(() => {
    t.current = e;
  }), zo.useMemo(() => (...r) => t.current?.(...r), []);
}
a(mr, "useCallbackRef");

// node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs
import * as Jg from "react";
function Qg(e, t = globalThis?.document) {
  let r = mr(e);
  Jg.useEffect(() => {
    let n = /* @__PURE__ */ a((o) => {
      o.key === "Escape" && r(o);
    }, "handleKeyDown");
    return t.addEventListener("keydown", n, { capture: !0 }), () => t.removeEventListener("keydown", n, { capture: !0 });
  }, [r, t]);
}
a(Qg, "useEscapeKeydown");

// node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs
import { jsx as r4 } from "react/jsx-runtime";
var EL = "DismissableLayer", u0 = "dismissableLayer.update", RL = "dismissableLayer.pointerDownOutside", SL = "dismissableLayer.focusOutside",
e4, n4 = re.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), c0 = re.forwardRef(
  (e, t) => {
    let {
      disableOutsidePointerEvents: r = !1,
      onEscapeKeyDown: n,
      onPointerDownOutside: o,
      onFocusOutside: i,
      onInteractOutside: l,
      onDismiss: u,
      ...c
    } = e, p = re.useContext(n4), [d, h] = re.useState(null), f = d?.ownerDocument ?? globalThis?.document, [, g] = re.useState({}), w = mt(
    t, (R) => h(R)), m = Array.from(p.layers), [v] = [...p.layersWithOutsidePointerEventsDisabled].slice(-1), y = m.indexOf(v), b = d ? m.indexOf(
    d) : -1, D = p.layersWithOutsidePointerEventsDisabled.size > 0, x = b >= y, C = kL((R) => {
      let F = R.target, A = [...p.branches].some((k) => k.contains(F));
      !x || A || (o?.(R), l?.(R), R.defaultPrevented || u?.());
    }, f), E = LL((R) => {
      let F = R.target;
      [...p.branches].some((k) => k.contains(F)) || (i?.(R), l?.(R), R.defaultPrevented || u?.());
    }, f);
    return Qg((R) => {
      b === p.layers.size - 1 && (n?.(R), !R.defaultPrevented && u && (R.preventDefault(), u()));
    }, f), re.useEffect(() => {
      if (d)
        return r && (p.layersWithOutsidePointerEventsDisabled.size === 0 && (e4 = f.body.style.pointerEvents, f.body.style.pointerEvents = "\
none"), p.layersWithOutsidePointerEventsDisabled.add(d)), p.layers.add(d), t4(), () => {
          r && p.layersWithOutsidePointerEventsDisabled.size === 1 && (f.body.style.pointerEvents = e4);
        };
    }, [d, f, r, p]), re.useEffect(() => () => {
      d && (p.layers.delete(d), p.layersWithOutsidePointerEventsDisabled.delete(d), t4());
    }, [d, p]), re.useEffect(() => {
      let R = /* @__PURE__ */ a(() => g({}), "handleUpdate");
      return document.addEventListener(u0, R), () => document.removeEventListener(u0, R);
    }, []), /* @__PURE__ */ r4(
      Ye.div,
      {
        ...c,
        ref: w,
        style: {
          pointerEvents: D ? x ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: Bt(e.onFocusCapture, E.onFocusCapture),
        onBlurCapture: Bt(e.onBlurCapture, E.onBlurCapture),
        onPointerDownCapture: Bt(
          e.onPointerDownCapture,
          C.onPointerDownCapture
        )
      }
    );
  }
);
c0.displayName = EL;
var AL = "DismissableLayerBranch", FL = re.forwardRef((e, t) => {
  let r = re.useContext(n4), n = re.useRef(null), o = mt(t, n);
  return re.useEffect(() => {
    let i = n.current;
    if (i)
      return r.branches.add(i), () => {
        r.branches.delete(i);
      };
  }, [r.branches]), /* @__PURE__ */ r4(Ye.div, { ...e, ref: o });
});
FL.displayName = AL;
function kL(e, t = globalThis?.document) {
  let r = mr(e), n = re.useRef(!1), o = re.useRef(() => {
  });
  return re.useEffect(() => {
    let i = /* @__PURE__ */ a((u) => {
      if (u.target && !n.current) {
        let p = /* @__PURE__ */ a(function() {
          o4(
            RL,
            r,
            d,
            { discrete: !0 }
          );
        }, "handleAndDispatchPointerDownOutsideEvent2");
        var c = p;
        let d = { originalEvent: u };
        u.pointerType === "touch" ? (t.removeEventListener("click", o.current), o.current = p, t.addEventListener("click", o.current, { once: !0 })) :
        p();
      } else
        t.removeEventListener("click", o.current);
      n.current = !1;
    }, "handlePointerDown"), l = window.setTimeout(() => {
      t.addEventListener("pointerdown", i);
    }, 0);
    return () => {
      window.clearTimeout(l), t.removeEventListener("pointerdown", i), t.removeEventListener("click", o.current);
    };
  }, [t, r]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: /* @__PURE__ */ a(() => n.current = !0, "onPointerDownCapture")
  };
}
a(kL, "usePointerDownOutside");
function LL(e, t = globalThis?.document) {
  let r = mr(e), n = re.useRef(!1);
  return re.useEffect(() => {
    let o = /* @__PURE__ */ a((i) => {
      i.target && !n.current && o4(SL, r, { originalEvent: i }, {
        discrete: !1
      });
    }, "handleFocus");
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, r]), {
    onFocusCapture: /* @__PURE__ */ a(() => n.current = !0, "onFocusCapture"),
    onBlurCapture: /* @__PURE__ */ a(() => n.current = !1, "onBlurCapture")
  };
}
a(LL, "useFocusOutside");
function t4() {
  let e = new CustomEvent(u0);
  document.dispatchEvent(e);
}
a(t4, "dispatchUpdate");
function o4(e, t, r, { discrete: n }) {
  let o = r.originalEvent.target, i = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: r });
  t && o.addEventListener(e, t, { once: !0 }), n ? Kg(o, i) : o.dispatchEvent(i);
}
a(o4, "handleAndDispatchCustomEvent");

// node_modules/@radix-ui/react-focus-scope/dist/index.mjs
import * as at from "react";
import { jsx as TL } from "react/jsx-runtime";
var p0 = "focusScope.autoFocusOnMount", d0 = "focusScope.autoFocusOnUnmount", a4 = { bubbles: !1, cancelable: !0 }, IL = "FocusScope", f0 = at.forwardRef(
(e, t) => {
  let {
    loop: r = !1,
    trapped: n = !1,
    onMountAutoFocus: o,
    onUnmountAutoFocus: i,
    ...l
  } = e, [u, c] = at.useState(null), p = mr(o), d = mr(i), h = at.useRef(null), f = mt(t, (m) => c(m)), g = at.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  at.useEffect(() => {
    if (n) {
      let b = /* @__PURE__ */ a(function(E) {
        if (g.paused || !u) return;
        let R = E.target;
        u.contains(R) ? h.current = R : gr(h.current, { select: !0 });
      }, "handleFocusIn2"), D = /* @__PURE__ */ a(function(E) {
        if (g.paused || !u) return;
        let R = E.relatedTarget;
        R !== null && (u.contains(R) || gr(h.current, { select: !0 }));
      }, "handleFocusOut2"), x = /* @__PURE__ */ a(function(E) {
        if (document.activeElement === document.body)
          for (let F of E)
            F.removedNodes.length > 0 && gr(u);
      }, "handleMutations2");
      var m = b, v = D, y = x;
      document.addEventListener("focusin", b), document.addEventListener("focusout", D);
      let C = new MutationObserver(x);
      return u && C.observe(u, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", b), document.removeEventListener("focusout", D), C.disconnect();
      };
    }
  }, [n, u, g.paused]), at.useEffect(() => {
    if (u) {
      l4.add(g);
      let m = document.activeElement;
      if (!u.contains(m)) {
        let y = new CustomEvent(p0, a4);
        u.addEventListener(p0, p), u.dispatchEvent(y), y.defaultPrevented || (BL(zL(u4(u)), { select: !0 }), document.activeElement === m &&
        gr(u));
      }
      return () => {
        u.removeEventListener(p0, p), setTimeout(() => {
          let y = new CustomEvent(d0, a4);
          u.addEventListener(d0, d), u.dispatchEvent(y), y.defaultPrevented || gr(m ?? document.body, { select: !0 }), u.removeEventListener(
          d0, d), l4.remove(g);
        }, 0);
      };
    }
  }, [u, p, d, g]);
  let w = at.useCallback(
    (m) => {
      if (!r && !n || g.paused) return;
      let v = m.key === "Tab" && !m.altKey && !m.ctrlKey && !m.metaKey, y = document.activeElement;
      if (v && y) {
        let b = m.currentTarget, [D, x] = ML(b);
        D && x ? !m.shiftKey && y === x ? (m.preventDefault(), r && gr(D, { select: !0 })) : m.shiftKey && y === D && (m.preventDefault(), r &&
        gr(x, { select: !0 })) : y === b && m.preventDefault();
      }
    },
    [r, n, g.paused]
  );
  return /* @__PURE__ */ TL(Ye.div, { tabIndex: -1, ...l, ref: f, onKeyDown: w });
});
f0.displayName = IL;
function BL(e, { select: t = !1 } = {}) {
  let r = document.activeElement;
  for (let n of e)
    if (gr(n, { select: t }), document.activeElement !== r) return;
}
a(BL, "focusFirst");
function ML(e) {
  let t = u4(e), r = i4(t, e), n = i4(t.reverse(), e);
  return [r, n];
}
a(ML, "getTabbableEdges");
function u4(e) {
  let t = [], r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: /* @__PURE__ */ a((n) => {
      let o = n.tagName === "INPUT" && n.type === "hidden";
      return n.disabled || n.hidden || o ? NodeFilter.FILTER_SKIP : n.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }, "acceptNode")
  });
  for (; r.nextNode(); ) t.push(r.currentNode);
  return t;
}
a(u4, "getTabbableCandidates");
function i4(e, t) {
  for (let r of e)
    if (!_L(r, { upTo: t })) return r;
}
a(i4, "findVisible");
function _L(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
a(_L, "isHidden");
function PL(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
a(PL, "isSelectableInput");
function gr(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    let r = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== r && PL(e) && t && e.select();
  }
}
a(gr, "focus");
var l4 = HL();
function HL() {
  let e = [];
  return {
    add(t) {
      let r = e[0];
      t !== r && r?.pause(), e = s4(e, t), e.unshift(t);
    },
    remove(t) {
      e = s4(e, t), e[0]?.resume();
    }
  };
}
a(HL, "createFocusScopesStack");
function s4(e, t) {
  let r = [...e], n = r.indexOf(t);
  return n !== -1 && r.splice(n, 1), r;
}
a(s4, "arrayRemove");
function zL(e) {
  return e.filter((t) => t.tagName !== "A");
}
a(zL, "removeLinks");

// node_modules/@radix-ui/react-portal/dist/index.mjs
import * as Rl from "react";
import OL from "react-dom";
import { jsx as NL } from "react/jsx-runtime";
var $L = "Portal", h0 = Rl.forwardRef((e, t) => {
  let { container: r, ...n } = e, [o, i] = Rl.useState(!1);
  Yt(() => i(!0), []);
  let l = r || o && globalThis?.document?.body;
  return l ? OL.createPortal(/* @__PURE__ */ NL(Ye.div, { ...n, ref: t }), l) : null;
});
h0.displayName = $L;

// node_modules/@radix-ui/react-presence/dist/index.mjs
import * as je from "react";
import * as c4 from "react";
function VL(e, t) {
  return c4.useReducer((r, n) => t[r][n] ?? r, e);
}
a(VL, "useStateMachine");
var qa = /* @__PURE__ */ a((e) => {
  let { present: t, children: r } = e, n = jL(t), o = typeof r == "function" ? r({ present: n.isPresent }) : je.Children.only(r), i = mt(n.ref,
  WL(o));
  return typeof r == "function" || n.isPresent ? je.cloneElement(o, { ref: i }) : null;
}, "Presence");
qa.displayName = "Presence";
function jL(e) {
  let [t, r] = je.useState(), n = je.useRef(null), o = je.useRef(e), i = je.useRef("none"), l = e ? "mounted" : "unmounted", [u, c] = VL(l, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return je.useEffect(() => {
    let p = Sl(n.current);
    i.current = u === "mounted" ? p : "none";
  }, [u]), Yt(() => {
    let p = n.current, d = o.current;
    if (d !== e) {
      let f = i.current, g = Sl(p);
      e ? c("MOUNT") : g === "none" || p?.display === "none" ? c("UNMOUNT") : c(d && f !== g ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, c]), Yt(() => {
    if (t) {
      let p, d = t.ownerDocument.defaultView ?? window, h = /* @__PURE__ */ a((g) => {
        let m = Sl(n.current).includes(g.animationName);
        if (g.target === t && m && (c("ANIMATION_END"), !o.current)) {
          let v = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", p = d.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = v);
          });
        }
      }, "handleAnimationEnd"), f = /* @__PURE__ */ a((g) => {
        g.target === t && (i.current = Sl(n.current));
      }, "handleAnimationStart");
      return t.addEventListener("animationstart", f), t.addEventListener("animationcancel", h), t.addEventListener("animationend", h), () => {
        d.clearTimeout(p), t.removeEventListener("animationstart", f), t.removeEventListener("animationcancel", h), t.removeEventListener("a\
nimationend", h);
      };
    } else
      c("ANIMATION_END");
  }, [t, c]), {
    isPresent: ["mounted", "unmountSuspended"].includes(u),
    ref: je.useCallback((p) => {
      n.current = p ? getComputedStyle(p) : null, r(p);
    }, [])
  };
}
a(jL, "usePresence");
function Sl(e) {
  return e?.animationName || "none";
}
a(Sl, "getAnimationName");
function WL(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref :
  e.props.ref || e.ref);
}
a(WL, "getElementRef");

// node_modules/@radix-ui/react-focus-guards/dist/index.mjs
import * as d4 from "react";
var m0 = 0;
function f4() {
  d4.useEffect(() => {
    let e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", e[0] ?? p4()), document.body.insertAdjacentElement("beforeend", e[1] ?? p4()), m0++,
    () => {
      m0 === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), m0--;
    };
  }, []);
}
a(f4, "useFocusGuards");
function p4() {
  let e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "\
fixed", e.style.pointerEvents = "none", e;
}
a(p4, "createFocusGuard");

// ../node_modules/tslib/tslib.es6.mjs
var We = /* @__PURE__ */ a(function() {
  return We = Object.assign || /* @__PURE__ */ a(function(t) {
    for (var r, n = 1, o = arguments.length; n < o; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i]);
    }
    return t;
  }, "__assign"), We.apply(this, arguments);
}, "__assign");
function Al(e, t) {
  var r = {};
  for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, n = Object.getOwnPropertySymbols(e); o < n.length; o++)
      t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]]);
  return r;
}
a(Al, "__rest");
function h4(e, t, r) {
  if (r || arguments.length === 2) for (var n = 0, o = t.length, i; n < o; n++)
    (i || !(n in t)) && (i || (i = Array.prototype.slice.call(t, 0, n)), i[n] = t[n]);
  return e.concat(i || Array.prototype.slice.call(t));
}
a(h4, "__spreadArray");

// node_modules/react-remove-scroll/dist/es2015/Combination.js
import * as Il from "react";

// node_modules/react-remove-scroll/dist/es2015/UI.js
import * as ke from "react";

// node_modules/react-remove-scroll-bar/dist/es2015/constants.js
var Qr = "right-scroll-bar-position", en = "width-before-scroll-bar", g0 = "with-scroll-bars-hidden", v0 = "--removed-body-scroll-bar-size";

// node_modules/use-callback-ref/dist/es2015/assignRef.js
function Fl(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
a(Fl, "assignRef");

// node_modules/use-callback-ref/dist/es2015/useRef.js
import { useState as qL } from "react";
function m4(e, t) {
  var r = qL(function() {
    return {
      // value
      value: e,
      // last callback
      callback: t,
      // "memoized" public interface
      facade: {
        get current() {
          return r.value;
        },
        set current(n) {
          var o = r.value;
          o !== n && (r.value = n, r.callback(n, o));
        }
      }
    };
  })[0];
  return r.callback = t, r.facade;
}
a(m4, "useCallbackRef");

// node_modules/use-callback-ref/dist/es2015/useMergeRef.js
import * as kl from "react";
var UL = typeof window < "u" ? kl.useLayoutEffect : kl.useEffect, g4 = /* @__PURE__ */ new WeakMap();
function w0(e, t) {
  var r = m4(t || null, function(n) {
    return e.forEach(function(o) {
      return Fl(o, n);
    });
  });
  return UL(function() {
    var n = g4.get(r);
    if (n) {
      var o = new Set(n), i = new Set(e), l = r.current;
      o.forEach(function(u) {
        i.has(u) || Fl(u, null);
      }), i.forEach(function(u) {
        o.has(u) || Fl(u, l);
      });
    }
    g4.set(r, e);
  }, [e]), r;
}
a(w0, "useMergeRefs");

// node_modules/use-sidecar/dist/es2015/medium.js
function GL(e) {
  return e;
}
a(GL, "ItoI");
function YL(e, t) {
  t === void 0 && (t = GL);
  var r = [], n = !1, o = {
    read: /* @__PURE__ */ a(function() {
      if (n)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return r.length ? r[r.length - 1] : e;
    }, "read"),
    useMedium: /* @__PURE__ */ a(function(i) {
      var l = t(i, n);
      return r.push(l), function() {
        r = r.filter(function(u) {
          return u !== l;
        });
      };
    }, "useMedium"),
    assignSyncMedium: /* @__PURE__ */ a(function(i) {
      for (n = !0; r.length; ) {
        var l = r;
        r = [], l.forEach(i);
      }
      r = {
        push: /* @__PURE__ */ a(function(u) {
          return i(u);
        }, "push"),
        filter: /* @__PURE__ */ a(function() {
          return r;
        }, "filter")
      };
    }, "assignSyncMedium"),
    assignMedium: /* @__PURE__ */ a(function(i) {
      n = !0;
      var l = [];
      if (r.length) {
        var u = r;
        r = [], u.forEach(i), l = r;
      }
      var c = /* @__PURE__ */ a(function() {
        var d = l;
        l = [], d.forEach(i);
      }, "executeQueue"), p = /* @__PURE__ */ a(function() {
        return Promise.resolve().then(c);
      }, "cycle");
      p(), r = {
        push: /* @__PURE__ */ a(function(d) {
          l.push(d), p();
        }, "push"),
        filter: /* @__PURE__ */ a(function(d) {
          return l = l.filter(d), r;
        }, "filter")
      };
    }, "assignMedium")
  };
  return o;
}
a(YL, "innerCreateMedium");
function b0(e) {
  e === void 0 && (e = {});
  var t = YL(null);
  return t.options = We({ async: !0, ssr: !1 }, e), t;
}
a(b0, "createSidecarMedium");

// node_modules/use-sidecar/dist/es2015/exports.js
import * as v4 from "react";
var w4 = /* @__PURE__ */ a(function(e) {
  var t = e.sideCar, r = Al(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var n = t.read();
  if (!n)
    throw new Error("Sidecar medium not found");
  return v4.createElement(n, We({}, r));
}, "SideCar");
w4.isSideCarExport = !0;
function y0(e, t) {
  return e.useMedium(t), w4;
}
a(y0, "exportSidecar");

// node_modules/react-remove-scroll/dist/es2015/medium.js
var Ll = b0();

// node_modules/react-remove-scroll/dist/es2015/UI.js
var D0 = /* @__PURE__ */ a(function() {
}, "nothing"), Ua = ke.forwardRef(function(e, t) {
  var r = ke.useRef(null), n = ke.useState({
    onScrollCapture: D0,
    onWheelCapture: D0,
    onTouchMoveCapture: D0
  }), o = n[0], i = n[1], l = e.forwardProps, u = e.children, c = e.className, p = e.removeScrollBar, d = e.enabled, h = e.shards, f = e.sideCar,
  g = e.noIsolation, w = e.inert, m = e.allowPinchZoom, v = e.as, y = v === void 0 ? "div" : v, b = e.gapMode, D = Al(e, ["forwardProps", "c\
hildren", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), x = f,
  C = w0([r, t]), E = We(We({}, D), o);
  return ke.createElement(
    ke.Fragment,
    null,
    d && ke.createElement(x, { sideCar: Ll, removeScrollBar: p, shards: h, noIsolation: g, inert: w, setCallbacks: i, allowPinchZoom: !!m, lockRef: r,
    gapMode: b }),
    l ? ke.cloneElement(ke.Children.only(u), We(We({}, E), { ref: C })) : ke.createElement(y, We({}, E, { className: c, ref: C }), u)
  );
});
Ua.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
Ua.classNames = {
  fullWidth: en,
  zeroRight: Qr
};

// node_modules/react-remove-scroll/dist/es2015/SideEffect.js
import * as K from "react";

// node_modules/react-remove-scroll-bar/dist/es2015/component.js
import * as No from "react";

// node_modules/react-style-singleton/dist/es2015/hook.js
import * as D4 from "react";

// ../node_modules/get-nonce/dist/es2015/index.js
var b4;
var y4 = /* @__PURE__ */ a(function() {
  if (b4)
    return b4;
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
}, "getNonce");

// node_modules/react-style-singleton/dist/es2015/singleton.js
function XL() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = y4();
  return t && e.setAttribute("nonce", t), e;
}
a(XL, "makeStyleTag");
function ZL(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
a(ZL, "injectStyles");
function KL(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
a(KL, "insertStyleTag");
var x0 = /* @__PURE__ */ a(function() {
  var e = 0, t = null;
  return {
    add: /* @__PURE__ */ a(function(r) {
      e == 0 && (t = XL()) && (ZL(t, r), KL(t)), e++;
    }, "add"),
    remove: /* @__PURE__ */ a(function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }, "remove")
  };
}, "stylesheetSingleton");

// node_modules/react-style-singleton/dist/es2015/hook.js
var C0 = /* @__PURE__ */ a(function() {
  var e = x0();
  return function(t, r) {
    D4.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && r]);
  };
}, "styleHookSingleton");

// node_modules/react-style-singleton/dist/es2015/component.js
var Ga = /* @__PURE__ */ a(function() {
  var e = C0(), t = /* @__PURE__ */ a(function(r) {
    var n = r.styles, o = r.dynamic;
    return e(n, o), null;
  }, "Sheet");
  return t;
}, "styleSingleton");

// node_modules/react-remove-scroll-bar/dist/es2015/utils.js
var JL = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, E0 = /* @__PURE__ */ a(function(e) {
  return parseInt(e || "", 10) || 0;
}, "parse"), QL = /* @__PURE__ */ a(function(e) {
  var t = window.getComputedStyle(document.body), r = t[e === "padding" ? "paddingLeft" : "marginLeft"], n = t[e === "padding" ? "paddingTop" :
  "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [E0(r), E0(n), E0(o)];
}, "getOffset"), R0 = /* @__PURE__ */ a(function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return JL;
  var t = QL(e), r = document.documentElement.clientWidth, n = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, n - r + t[2] - t[0])
  };
}, "getGapWidth");

// node_modules/react-remove-scroll-bar/dist/es2015/component.js
var eT = Ga(), Oo = "data-scroll-locked", tT = /* @__PURE__ */ a(function(e, t, r, n) {
  var o = e.left, i = e.top, l = e.right, u = e.gap;
  return r === void 0 && (r = "margin"), `
  .`.concat(g0, ` {
   overflow: hidden `).concat(n, `;
   padding-right: `).concat(u, "px ").concat(n, `;
  }
  body[`).concat(Oo, `] {
    overflow: hidden `).concat(n, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(n, ";"),
    r === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(i, `px;
    padding-right: `).concat(l, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(u, "px ").concat(n, `;
    `),
    r === "padding" && "padding-right: ".concat(u, "px ").concat(n, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(Qr, ` {
    right: `).concat(u, "px ").concat(n, `;
  }
  
  .`).concat(en, ` {
    margin-right: `).concat(u, "px ").concat(n, `;
  }
  
  .`).concat(Qr, " .").concat(Qr, ` {
    right: 0 `).concat(n, `;
  }
  
  .`).concat(en, " .").concat(en, ` {
    margin-right: 0 `).concat(n, `;
  }
  
  body[`).concat(Oo, `] {
    `).concat(v0, ": ").concat(u, `px;
  }
`);
}, "getStyles"), x4 = /* @__PURE__ */ a(function() {
  var e = parseInt(document.body.getAttribute(Oo) || "0", 10);
  return isFinite(e) ? e : 0;
}, "getCurrentUseCounter"), rT = /* @__PURE__ */ a(function() {
  No.useEffect(function() {
    return document.body.setAttribute(Oo, (x4() + 1).toString()), function() {
      var e = x4() - 1;
      e <= 0 ? document.body.removeAttribute(Oo) : document.body.setAttribute(Oo, e.toString());
    };
  }, []);
}, "useLockAttribute"), S0 = /* @__PURE__ */ a(function(e) {
  var t = e.noRelative, r = e.noImportant, n = e.gapMode, o = n === void 0 ? "margin" : n;
  rT();
  var i = No.useMemo(function() {
    return R0(o);
  }, [o]);
  return No.createElement(eT, { styles: tT(i, !t, o, r ? "" : "!important") });
}, "RemoveScrollBar");

// node_modules/react-remove-scroll/dist/es2015/aggresiveCapture.js
var A0 = !1;
if (typeof window < "u")
  try {
    Ya = Object.defineProperty({}, "passive", {
      get: /* @__PURE__ */ a(function() {
        return A0 = !0, !0;
      }, "get")
    }), window.addEventListener("test", Ya, Ya), window.removeEventListener("test", Ya, Ya);
  } catch {
    A0 = !1;
  }
var Ya, tn = A0 ? { passive: !1 } : !1;

// node_modules/react-remove-scroll/dist/es2015/handleScroll.js
var nT = /* @__PURE__ */ a(function(e) {
  return e.tagName === "TEXTAREA";
}, "alwaysContainsScroll"), C4 = /* @__PURE__ */ a(function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var r = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    r[t] !== "hidden" && // contains scroll inside self
    !(r.overflowY === r.overflowX && !nT(e) && r[t] === "visible")
  );
}, "elementCanBeScrolled"), oT = /* @__PURE__ */ a(function(e) {
  return C4(e, "overflowY");
}, "elementCouldBeVScrolled"), aT = /* @__PURE__ */ a(function(e) {
  return C4(e, "overflowX");
}, "elementCouldBeHScrolled"), F0 = /* @__PURE__ */ a(function(e, t) {
  var r = t.ownerDocument, n = t;
  do {
    typeof ShadowRoot < "u" && n instanceof ShadowRoot && (n = n.host);
    var o = E4(e, n);
    if (o) {
      var i = R4(e, n), l = i[1], u = i[2];
      if (l > u)
        return !0;
    }
    n = n.parentNode;
  } while (n && n !== r.body);
  return !1;
}, "locationCouldBeScrolled"), iT = /* @__PURE__ */ a(function(e) {
  var t = e.scrollTop, r = e.scrollHeight, n = e.clientHeight;
  return [
    t,
    r,
    n
  ];
}, "getVScrollVariables"), lT = /* @__PURE__ */ a(function(e) {
  var t = e.scrollLeft, r = e.scrollWidth, n = e.clientWidth;
  return [
    t,
    r,
    n
  ];
}, "getHScrollVariables"), E4 = /* @__PURE__ */ a(function(e, t) {
  return e === "v" ? oT(t) : aT(t);
}, "elementCouldBeScrolled"), R4 = /* @__PURE__ */ a(function(e, t) {
  return e === "v" ? iT(t) : lT(t);
}, "getScrollVariables"), sT = /* @__PURE__ */ a(function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, "getDirectionFactor"), S4 = /* @__PURE__ */ a(function(e, t, r, n, o) {
  var i = sT(e, window.getComputedStyle(t).direction), l = i * n, u = r.target, c = t.contains(u), p = !1, d = l > 0, h = 0, f = 0;
  do {
    var g = R4(e, u), w = g[0], m = g[1], v = g[2], y = m - v - i * w;
    (w || y) && E4(e, u) && (h += y, f += w), u instanceof ShadowRoot ? u = u.host : u = u.parentNode;
  } while (
    // portaled content
    !c && u !== document.body || // self content
    c && (t.contains(u) || t === u)
  );
  return (d && (o && Math.abs(h) < 1 || !o && l > h) || !d && (o && Math.abs(f) < 1 || !o && -l > f)) && (p = !0), p;
}, "handleScroll");

// node_modules/react-remove-scroll/dist/es2015/SideEffect.js
var Tl = /* @__PURE__ */ a(function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, "getTouchXY"), A4 = /* @__PURE__ */ a(function(e) {
  return [e.deltaX, e.deltaY];
}, "getDeltaXY"), F4 = /* @__PURE__ */ a(function(e) {
  return e && "current" in e ? e.current : e;
}, "extractRef"), uT = /* @__PURE__ */ a(function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, "deltaCompare"), cT = /* @__PURE__ */ a(function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, "generateStyle"), pT = 0, $o = [];
function k4(e) {
  var t = K.useRef([]), r = K.useRef([0, 0]), n = K.useRef(), o = K.useState(pT++)[0], i = K.useState(Ga)[0], l = K.useRef(e);
  K.useEffect(function() {
    l.current = e;
  }, [e]), K.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var m = h4([e.lockRef.current], (e.shards || []).map(F4), !0).filter(Boolean);
      return m.forEach(function(v) {
        return v.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), m.forEach(function(v) {
          return v.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var u = K.useCallback(function(m, v) {
    if ("touches" in m && m.touches.length === 2 || m.type === "wheel" && m.ctrlKey)
      return !l.current.allowPinchZoom;
    var y = Tl(m), b = r.current, D = "deltaX" in m ? m.deltaX : b[0] - y[0], x = "deltaY" in m ? m.deltaY : b[1] - y[1], C, E = m.target, R = Math.
    abs(D) > Math.abs(x) ? "h" : "v";
    if ("touches" in m && R === "h" && E.type === "range")
      return !1;
    var F = F0(R, E);
    if (!F)
      return !0;
    if (F ? C = R : (C = R === "v" ? "h" : "v", F = F0(R, E)), !F)
      return !1;
    if (!n.current && "changedTouches" in m && (D || x) && (n.current = C), !C)
      return !0;
    var A = n.current || C;
    return S4(A, v, m, A === "h" ? D : x, !0);
  }, []), c = K.useCallback(function(m) {
    var v = m;
    if (!(!$o.length || $o[$o.length - 1] !== i)) {
      var y = "deltaY" in v ? A4(v) : Tl(v), b = t.current.filter(function(C) {
        return C.name === v.type && (C.target === v.target || v.target === C.shadowParent) && uT(C.delta, y);
      })[0];
      if (b && b.should) {
        v.cancelable && v.preventDefault();
        return;
      }
      if (!b) {
        var D = (l.current.shards || []).map(F4).filter(Boolean).filter(function(C) {
          return C.contains(v.target);
        }), x = D.length > 0 ? u(v, D[0]) : !l.current.noIsolation;
        x && v.cancelable && v.preventDefault();
      }
    }
  }, []), p = K.useCallback(function(m, v, y, b) {
    var D = { name: m, delta: v, target: y, should: b, shadowParent: dT(y) };
    t.current.push(D), setTimeout(function() {
      t.current = t.current.filter(function(x) {
        return x !== D;
      });
    }, 1);
  }, []), d = K.useCallback(function(m) {
    r.current = Tl(m), n.current = void 0;
  }, []), h = K.useCallback(function(m) {
    p(m.type, A4(m), m.target, u(m, e.lockRef.current));
  }, []), f = K.useCallback(function(m) {
    p(m.type, Tl(m), m.target, u(m, e.lockRef.current));
  }, []);
  K.useEffect(function() {
    return $o.push(i), e.setCallbacks({
      onScrollCapture: h,
      onWheelCapture: h,
      onTouchMoveCapture: f
    }), document.addEventListener("wheel", c, tn), document.addEventListener("touchmove", c, tn), document.addEventListener("touchstart", d,
    tn), function() {
      $o = $o.filter(function(m) {
        return m !== i;
      }), document.removeEventListener("wheel", c, tn), document.removeEventListener("touchmove", c, tn), document.removeEventListener("touc\
hstart", d, tn);
    };
  }, []);
  var g = e.removeScrollBar, w = e.inert;
  return K.createElement(
    K.Fragment,
    null,
    w ? K.createElement(i, { styles: cT(o) }) : null,
    g ? K.createElement(S0, { gapMode: e.gapMode }) : null
  );
}
a(k4, "RemoveScrollSideCar");
function dT(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
a(dT, "getOutermostShadowParent");

// node_modules/react-remove-scroll/dist/es2015/sidecar.js
var L4 = y0(Ll, k4);

// node_modules/react-remove-scroll/dist/es2015/Combination.js
var T4 = Il.forwardRef(function(e, t) {
  return Il.createElement(Ua, We({}, e, { ref: t, sideCar: L4 }));
});
T4.classNames = Ua.classNames;
var k0 = T4;

// node_modules/aria-hidden/dist/es2015/index.js
var fT = /* @__PURE__ */ a(function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, "getDefaultParent"), Vo = /* @__PURE__ */ new WeakMap(), Bl = /* @__PURE__ */ new WeakMap(), Ml = {}, L0 = 0, I4 = /* @__PURE__ */ a(function(e) {
  return e && (e.host || I4(e.parentNode));
}, "unwrapHost"), hT = /* @__PURE__ */ a(function(e, t) {
  return t.map(function(r) {
    if (e.contains(r))
      return r;
    var n = I4(r);
    return n && e.contains(n) ? n : (console.error("aria-hidden", r, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(r) {
    return !!r;
  });
}, "correctTargets"), mT = /* @__PURE__ */ a(function(e, t, r, n) {
  var o = hT(t, Array.isArray(e) ? e : [e]);
  Ml[r] || (Ml[r] = /* @__PURE__ */ new WeakMap());
  var i = Ml[r], l = [], u = /* @__PURE__ */ new Set(), c = new Set(o), p = /* @__PURE__ */ a(function(h) {
    !h || u.has(h) || (u.add(h), p(h.parentNode));
  }, "keep");
  o.forEach(p);
  var d = /* @__PURE__ */ a(function(h) {
    !h || c.has(h) || Array.prototype.forEach.call(h.children, function(f) {
      if (u.has(f))
        d(f);
      else
        try {
          var g = f.getAttribute(n), w = g !== null && g !== "false", m = (Vo.get(f) || 0) + 1, v = (i.get(f) || 0) + 1;
          Vo.set(f, m), i.set(f, v), l.push(f), m === 1 && w && Bl.set(f, !0), v === 1 && f.setAttribute(r, "true"), w || f.setAttribute(n, "\
true");
        } catch (y) {
          console.error("aria-hidden: cannot operate on ", f, y);
        }
    });
  }, "deep");
  return d(t), u.clear(), L0++, function() {
    l.forEach(function(h) {
      var f = Vo.get(h) - 1, g = i.get(h) - 1;
      Vo.set(h, f), i.set(h, g), f || (Bl.has(h) || h.removeAttribute(n), Bl.delete(h)), g || h.removeAttribute(r);
    }), L0--, L0 || (Vo = /* @__PURE__ */ new WeakMap(), Vo = /* @__PURE__ */ new WeakMap(), Bl = /* @__PURE__ */ new WeakMap(), Ml = {});
  };
}, "applyAttributeToOthers"), B4 = /* @__PURE__ */ a(function(e, t, r) {
  r === void 0 && (r = "data-aria-hidden");
  var n = Array.from(Array.isArray(e) ? e : [e]), o = t || fT(e);
  return o ? (n.push.apply(n, Array.from(o.querySelectorAll("[aria-live]"))), mT(n, o, r, "aria-hidden")) : function() {
    return null;
  };
}, "hideOthers");

// node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/react-slot/dist/index.mjs
import * as de from "react";
import { Fragment as Cq, jsx as M4 } from "react/jsx-runtime";
// @__NO_SIDE_EFFECTS__
function _4(e) {
  let t = /* @__PURE__ */ gT(e), r = de.forwardRef((n, o) => {
    let { children: i, ...l } = n, u = de.Children.toArray(i), c = u.find(wT);
    if (c) {
      let p = c.props.children, d = u.map((h) => h === c ? de.Children.count(p) > 1 ? de.Children.only(null) : de.isValidElement(p) ? p.props.
      children : null : h);
      return /* @__PURE__ */ M4(t, { ...l, ref: o, children: de.isValidElement(p) ? de.cloneElement(p, void 0, d) : null });
    }
    return /* @__PURE__ */ M4(t, { ...l, ref: o, children: i });
  });
  return r.displayName = `${e}.Slot`, r;
}
a(_4, "createSlot");
// @__NO_SIDE_EFFECTS__
function gT(e) {
  let t = de.forwardRef((r, n) => {
    let { children: o, ...i } = r;
    if (de.isValidElement(o)) {
      let l = yT(o), u = bT(i, o.props);
      return o.type !== de.Fragment && (u.ref = n ? Wa(n, l) : l), de.cloneElement(o, u);
    }
    return de.Children.count(o) > 1 ? de.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
a(gT, "createSlotClone");
var vT = Symbol("radix.slottable");
function wT(e) {
  return de.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === vT;
}
a(wT, "isSlottable");
function bT(e, t) {
  let r = { ...t };
  for (let n in t) {
    let o = e[n], i = t[n];
    /^on[A-Z]/.test(n) ? o && i ? r[n] = (...u) => {
      i(...u), o(...u);
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...i } : n === "className" && (r[n] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
a(bT, "mergeProps");
function yT(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref :
  e.props.ref || e.ref);
}
a(yT, "getElementRef");

// node_modules/@radix-ui/react-dialog/dist/index.mjs
import { Fragment as P4, jsx as ae, jsxs as H4 } from "react/jsx-runtime";
var Pl = "Dialog", [z4, DT] = Wg(Pl), [xT, gt] = z4(Pl), T0 = /* @__PURE__ */ a((e) => {
  let {
    __scopeDialog: t,
    children: r,
    open: n,
    defaultOpen: o,
    onOpenChange: i,
    modal: l = !0
  } = e, u = Y.useRef(null), c = Y.useRef(null), [p, d] = Ug({
    prop: n,
    defaultProp: o ?? !1,
    onChange: i,
    caller: Pl
  });
  return /* @__PURE__ */ ae(
    xT,
    {
      scope: t,
      triggerRef: u,
      contentRef: c,
      contentId: Cl(),
      titleId: Cl(),
      descriptionId: Cl(),
      open: p,
      onOpenChange: d,
      onOpenToggle: Y.useCallback(() => d((h) => !h), [d]),
      modal: l,
      children: r
    }
  );
}, "Dialog");
T0.displayName = Pl;
var O4 = "DialogTrigger", I0 = Y.forwardRef(
  (e, t) => {
    let { __scopeDialog: r, ...n } = e, o = gt(O4, r), i = mt(t, o.triggerRef);
    return /* @__PURE__ */ ae(
      Ye.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": $0(o.open),
        ...n,
        ref: i,
        onClick: Bt(e.onClick, o.onOpenToggle)
      }
    );
  }
);
I0.displayName = O4;
var B0 = "DialogPortal", [CT, N4] = z4(B0, {
  forceMount: void 0
}), M0 = /* @__PURE__ */ a((e) => {
  let { __scopeDialog: t, forceMount: r, children: n, container: o } = e, i = gt(B0, t);
  return /* @__PURE__ */ ae(CT, { scope: t, forceMount: r, children: Y.Children.map(n, (l) => /* @__PURE__ */ ae(qa, { present: r || i.open,
  children: /* @__PURE__ */ ae(h0, { asChild: !0, container: o, children: l }) })) });
}, "DialogPortal");
M0.displayName = B0;
var _l = "DialogOverlay", _0 = Y.forwardRef(
  (e, t) => {
    let r = N4(_l, e.__scopeDialog), { forceMount: n = r.forceMount, ...o } = e, i = gt(_l, e.__scopeDialog);
    return i.modal ? /* @__PURE__ */ ae(qa, { present: n || i.open, children: /* @__PURE__ */ ae(RT, { ...o, ref: t }) }) : null;
  }
);
_0.displayName = _l;
var ET = _4("DialogOverlay.RemoveScroll"), RT = Y.forwardRef(
  (e, t) => {
    let { __scopeDialog: r, ...n } = e, o = gt(_l, r);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ ae(k0, { as: ET, allowPinchZoom: !0, shards: [o.contentRef], children: /* @__PURE__ */ ae(
        Ye.div,
        {
          "data-state": $0(o.open),
          ...n,
          ref: t,
          style: { pointerEvents: "auto", ...n.style }
        }
      ) })
    );
  }
), rn = "DialogContent", P0 = Y.forwardRef(
  (e, t) => {
    let r = N4(rn, e.__scopeDialog), { forceMount: n = r.forceMount, ...o } = e, i = gt(rn, e.__scopeDialog);
    return /* @__PURE__ */ ae(qa, { present: n || i.open, children: i.modal ? /* @__PURE__ */ ae(ST, { ...o, ref: t }) : /* @__PURE__ */ ae(
    AT, { ...o, ref: t }) });
  }
);
P0.displayName = rn;
var ST = Y.forwardRef(
  (e, t) => {
    let r = gt(rn, e.__scopeDialog), n = Y.useRef(null), o = mt(t, r.contentRef, n);
    return Y.useEffect(() => {
      let i = n.current;
      if (i) return B4(i);
    }, []), /* @__PURE__ */ ae(
      $4,
      {
        ...e,
        ref: o,
        trapFocus: r.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: Bt(e.onCloseAutoFocus, (i) => {
          i.preventDefault(), r.triggerRef.current?.focus();
        }),
        onPointerDownOutside: Bt(e.onPointerDownOutside, (i) => {
          let l = i.detail.originalEvent, u = l.button === 0 && l.ctrlKey === !0;
          (l.button === 2 || u) && i.preventDefault();
        }),
        onFocusOutside: Bt(
          e.onFocusOutside,
          (i) => i.preventDefault()
        )
      }
    );
  }
), AT = Y.forwardRef(
  (e, t) => {
    let r = gt(rn, e.__scopeDialog), n = Y.useRef(!1), o = Y.useRef(!1);
    return /* @__PURE__ */ ae(
      $4,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: /* @__PURE__ */ a((i) => {
          e.onCloseAutoFocus?.(i), i.defaultPrevented || (n.current || r.triggerRef.current?.focus(), i.preventDefault()), n.current = !1, o.
          current = !1;
        }, "onCloseAutoFocus"),
        onInteractOutside: /* @__PURE__ */ a((i) => {
          e.onInteractOutside?.(i), i.defaultPrevented || (n.current = !0, i.detail.originalEvent.type === "pointerdown" && (o.current = !0));
          let l = i.target;
          r.triggerRef.current?.contains(l) && i.preventDefault(), i.detail.originalEvent.type === "focusin" && o.current && i.preventDefault();
        }, "onInteractOutside")
      }
    );
  }
), $4 = Y.forwardRef(
  (e, t) => {
    let { __scopeDialog: r, trapFocus: n, onOpenAutoFocus: o, onCloseAutoFocus: i, ...l } = e, u = gt(rn, r), c = Y.useRef(null), p = mt(t, c);
    return f4(), /* @__PURE__ */ H4(P4, { children: [
      /* @__PURE__ */ ae(
        f0,
        {
          asChild: !0,
          loop: !0,
          trapped: n,
          onMountAutoFocus: o,
          onUnmountAutoFocus: i,
          children: /* @__PURE__ */ ae(
            c0,
            {
              role: "dialog",
              id: u.contentId,
              "aria-describedby": u.descriptionId,
              "aria-labelledby": u.titleId,
              "data-state": $0(u.open),
              ...l,
              ref: p,
              onDismiss: /* @__PURE__ */ a(() => u.onOpenChange(!1), "onDismiss")
            }
          )
        }
      ),
      /* @__PURE__ */ H4(P4, { children: [
        /* @__PURE__ */ ae(kT, { titleId: u.titleId }),
        /* @__PURE__ */ ae(TT, { contentRef: c, descriptionId: u.descriptionId })
      ] })
    ] });
  }
), H0 = "DialogTitle", z0 = Y.forwardRef(
  (e, t) => {
    let { __scopeDialog: r, ...n } = e, o = gt(H0, r);
    return /* @__PURE__ */ ae(Ye.h2, { id: o.titleId, ...n, ref: t });
  }
);
z0.displayName = H0;
var V4 = "DialogDescription", O0 = Y.forwardRef(
  (e, t) => {
    let { __scopeDialog: r, ...n } = e, o = gt(V4, r);
    return /* @__PURE__ */ ae(Ye.p, { id: o.descriptionId, ...n, ref: t });
  }
);
O0.displayName = V4;
var j4 = "DialogClose", N0 = Y.forwardRef(
  (e, t) => {
    let { __scopeDialog: r, ...n } = e, o = gt(j4, r);
    return /* @__PURE__ */ ae(
      Ye.button,
      {
        type: "button",
        ...n,
        ref: t,
        onClick: Bt(e.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
N0.displayName = j4;
function $0(e) {
  return e ? "open" : "closed";
}
a($0, "getState");
var W4 = "DialogTitleWarning", [FT, q4] = jg(W4, {
  contentName: rn,
  titleName: H0,
  docsSlug: "dialog"
}), kT = /* @__PURE__ */ a(({ titleId: e }) => {
  let t = q4(W4), r = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
  return Y.useEffect(() => {
    e && (document.getElementById(e) || console.error(r));
  }, [r, e]), null;
}, "TitleWarning"), LT = "DialogDescriptionWarning", TT = /* @__PURE__ */ a(({ contentRef: e, descriptionId: t }) => {
  let n = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${q4(LT).contentName}}.`;
  return Y.useEffect(() => {
    let o = e.current?.getAttribute("aria-describedby");
    t && o && (document.getElementById(t) || console.warn(n));
  }, [n, e, t]), null;
}, "DescriptionWarning"), V0 = T0, IT = I0, j0 = M0, W0 = _0, q0 = P0, U0 = z0, G0 = O0, Y0 = N0;

// src/components/components/Modal/Modal.styled.tsx
var t1 = {};
gn(t1, {
  Actions: () => eI,
  CloseButton: () => Z4,
  Col: () => J4,
  Container: () => e1,
  Content: () => ZT,
  Description: () => QT,
  Error: () => tI,
  ErrorWrapper: () => Q4,
  Header: () => KT,
  Overlay: () => Q0,
  Row: () => K4,
  Title: () => JT
});
import vr from "react";
import { keyframes as J0, styled as Xt } from "@storybook/core/theming";

// src/components/components/IconButton/IconButton.tsx
import UT, { forwardRef as GT } from "react";

// src/components/components/Button/Button.tsx
import Y4, { forwardRef as OT, useEffect as NT, useState as $T } from "react";
import { isPropValid as VT, styled as jT } from "@storybook/core/theming";
import { deprecate as WT } from "@storybook/core/client-logger";

// ../node_modules/@radix-ui/react-slot/dist/index.mjs
import * as fe from "react";

// ../node_modules/@radix-ui/react-slot/node_modules/@radix-ui/react-compose-refs/dist/index.mjs
import * as BT from "react";
function U4(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
a(U4, "setRef");
function G4(...e) {
  return (t) => {
    let r = !1, n = e.map((o) => {
      let i = U4(o, t);
      return !r && typeof i == "function" && (r = !0), i;
    });
    if (r)
      return () => {
        for (let o = 0; o < n.length; o++) {
          let i = n[o];
          typeof i == "function" ? i() : U4(e[o], null);
        }
      };
  };
}
a(G4, "composeRefs");

// ../node_modules/@radix-ui/react-slot/dist/index.mjs
import { Fragment as MT, jsx as X0 } from "react/jsx-runtime";
var K0 = fe.forwardRef((e, t) => {
  let { children: r, ...n } = e, o = fe.Children.toArray(r), i = o.find(PT);
  if (i) {
    let l = i.props.children, u = o.map((c) => c === i ? fe.Children.count(l) > 1 ? fe.Children.only(null) : fe.isValidElement(l) ? l.props.
    children : null : c);
    return /* @__PURE__ */ X0(Z0, { ...n, ref: t, children: fe.isValidElement(l) ? fe.cloneElement(l, void 0, u) : null });
  }
  return /* @__PURE__ */ X0(Z0, { ...n, ref: t, children: r });
});
K0.displayName = "Slot";
var Z0 = fe.forwardRef((e, t) => {
  let { children: r, ...n } = e;
  if (fe.isValidElement(r)) {
    let o = zT(r), i = HT(n, r.props);
    return r.type !== fe.Fragment && (i.ref = t ? G4(t, o) : o), fe.cloneElement(r, i);
  }
  return fe.Children.count(r) > 1 ? fe.Children.only(null) : null;
});
Z0.displayName = "SlotClone";
var _T = /* @__PURE__ */ a(({ children: e }) => /* @__PURE__ */ X0(MT, { children: e }), "Slottable");
function PT(e) {
  return fe.isValidElement(e) && e.type === _T;
}
a(PT, "isSlottable");
function HT(e, t) {
  let r = { ...t };
  for (let n in t) {
    let o = e[n], i = t[n];
    /^on[A-Z]/.test(n) ? o && i ? r[n] = (...u) => {
      i(...u), o(...u);
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...i } : n === "className" && (r[n] = [o, i].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
a(HT, "mergeProps");
function zT(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref :
  e.props.ref || e.ref);
}
a(zT, "getElementRef");

// src/components/components/Button/Button.tsx
var jo = OT(
  ({
    asChild: e = !1,
    animation: t = "none",
    size: r = "small",
    variant: n = "outline",
    padding: o = "medium",
    disabled: i = !1,
    active: l = !1,
    onClick: u,
    ...c
  }, p) => {
    let d = "button";
    c.isLink && (d = "a"), e && (d = K0);
    let h = n, f = r, [g, w] = $T(!1), m = /* @__PURE__ */ a((v) => {
      u && u(v), t !== "none" && w(!0);
    }, "handleClick");
    if (NT(() => {
      let v = setTimeout(() => {
        g && w(!1);
      }, 1e3);
      return () => clearTimeout(v);
    }, [g]), c.primary && (h = "solid", f = "medium"), (c.secondary || c.tertiary || c.gray || c.outline || c.inForm) && (h = "outline", f =
    "medium"), c.small || c.isLink || c.primary || c.secondary || c.tertiary || c.gray || c.outline || c.inForm || c.containsIcon) {
      let v = Y4.Children.toArray(c.children).filter(
        (y) => typeof y == "string" && y !== ""
      );
      WT(
        `Use of deprecated props in the button ${v.length > 0 ? `"${v.join(" ")}"` : "component"} detected, see the migration notes at https\
://github.com/storybookjs/storybook/blob/next/MIGRATION.md#new-ui-and-props-for-button-and-iconbutton-components`
      );
    }
    return /* @__PURE__ */ Y4.createElement(
      qT,
      {
        as: d,
        ref: p,
        variant: h,
        size: f,
        padding: o,
        disabled: i,
        active: l,
        animating: g,
        animation: t,
        onClick: m,
        ...c
      }
    );
  }
);
jo.displayName = "Button";
var qT = jT("button", {
  shouldForwardProp: /* @__PURE__ */ a((e) => VT(e), "shouldForwardProp")
})(({ theme: e, variant: t, size: r, disabled: n, active: o, animating: i, animation: l = "none", padding: u }) => ({
  border: 0,
  cursor: n ? "not-allowed" : "pointer",
  display: "inline-flex",
  gap: "6px",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  padding: u === "none" ? 0 : u === "small" && r === "small" ? "0 7px" : u === "small" && r === "medium" ? "0 9px" : r === "small" ? "0 10px" :
  r === "medium" ? "0 12px" : 0,
  height: r === "small" ? "28px" : "32px",
  position: "relative",
  textAlign: "center",
  textDecoration: "none",
  transitionProperty: "background, box-shadow",
  transitionDuration: "150ms",
  transitionTimingFunction: "ease-out",
  verticalAlign: "top",
  whiteSpace: "nowrap",
  userSelect: "none",
  opacity: n ? 0.5 : 1,
  margin: 0,
  fontSize: `${e.typography.size.s1}px`,
  fontWeight: e.typography.weight.bold,
  lineHeight: "1",
  background: t === "solid" ? e.color.secondary : t === "outline" ? e.button.background : t === "ghost" && o ? e.background.hoverable : "tra\
nsparent",
  ...t === "ghost" ? {
    // This is a hack to apply bar styles to the button as soon as it is part of a bar
    // It is a temporary solution until we have implemented Theming 2.0.
    ".sb-bar &": {
      background: o ? Le(0.9, e.barTextColor) : "transparent",
      color: o ? e.barSelectedColor : e.barTextColor,
      "&:hover": {
        color: e.barHoverColor,
        background: Le(0.86, e.barHoverColor)
      },
      "&:active": {
        color: e.barSelectedColor,
        background: Le(0.9, e.barSelectedColor)
      },
      "&:focus": {
        boxShadow: `${pa(e.barHoverColor, 1)} 0 0 0 1px inset`,
        outline: "none"
      }
    }
  } : {},
  color: t === "solid" ? e.color.lightest : t === "outline" ? e.input.color : t === "ghost" && o ? e.color.secondary : t === "ghost" ? e.color.
  mediumdark : e.input.color,
  boxShadow: t === "outline" ? `${e.button.border} 0 0 0 1px inset` : "none",
  borderRadius: e.input.borderRadius,
  // Making sure that the button never shrinks below its minimum size
  flexShrink: 0,
  "&:hover": {
    color: t === "ghost" ? e.color.secondary : void 0,
    background: (() => {
      let c = e.color.secondary;
      return t === "solid" && (c = e.color.secondary), t === "outline" && (c = e.button.background), t === "ghost" ? Le(0.86, e.color.secondary) :
      e.base === "light" ? rr(0.02, c) : ys(0.03, c);
    })()
  },
  "&:active": {
    color: t === "ghost" ? e.color.secondary : void 0,
    background: (() => {
      let c = e.color.secondary;
      return t === "solid" && (c = e.color.secondary), t === "outline" && (c = e.button.background), t === "ghost" ? e.background.hoverable :
      e.base === "light" ? rr(0.02, c) : ys(0.03, c);
    })()
  },
  "&:focus": {
    boxShadow: `${pa(e.color.secondary, 1)} 0 0 0 1px inset`,
    outline: "none"
  },
  "> svg": {
    animation: i && l !== "none" ? `${e.animation[l]} 1000ms ease-out` : ""
  }
}));

// src/components/components/IconButton/IconButton.tsx
var zl = GT(
  ({ padding: e = "small", variant: t = "ghost", ...r }, n) => /* @__PURE__ */ UT.createElement(jo, { padding: e, variant: t, ref: n, ...r })
);
zl.displayName = "IconButton";

// src/components/components/Modal/Modal.styled.tsx
var X4 = J0({
  from: { opacity: 0 },
  to: { opacity: 1 }
}), YT = J0({
  from: { maxHeight: 0 },
  to: {}
}), XT = J0({
  from: {
    opacity: 0,
    transform: "translate(-50%, -50%) scale(0.9)"
  },
  to: {
    opacity: 1,
    transform: "translate(-50%, -50%) scale(1)"
  }
}), Q0 = Xt.div({
  backdropFilter: "blur(24px)",
  position: "fixed",
  inset: 0,
  width: "100%",
  height: "100%",
  zIndex: 10,
  animation: `${X4} 200ms`
}), e1 = Xt.div(
  ({ theme: e, width: t, height: r }) => ({
    backgroundColor: e.background.bar,
    borderRadius: 6,
    boxShadow: "0px 4px 67px 0px #00000040",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: t ?? 740,
    height: r ?? "auto",
    maxWidth: "calc(100% - 40px)",
    maxHeight: "85vh",
    overflow: "hidden",
    zIndex: 11,
    animation: `${XT} 200ms`,
    "&:focus-visible": {
      outline: "none"
    }
  })
), Z4 = /* @__PURE__ */ a((e) => /* @__PURE__ */ vr.createElement(Y0, { asChild: !0 }, /* @__PURE__ */ vr.createElement(zl, { ...e }, /* @__PURE__ */ vr.
createElement(Wu, null))), "CloseButton"), ZT = Xt.div({
  display: "flex",
  flexDirection: "column",
  margin: 16,
  gap: 16
}), K4 = Xt.div({
  display: "flex",
  justifyContent: "space-between",
  gap: 16
}), J4 = Xt.div({
  display: "flex",
  flexDirection: "column",
  gap: 4
}), KT = /* @__PURE__ */ a((e) => /* @__PURE__ */ vr.createElement(K4, null, /* @__PURE__ */ vr.createElement(J4, { ...e }), /* @__PURE__ */ vr.
createElement(Z4, null)), "Header"), JT = Xt(U0)(({ theme: e }) => ({
  margin: 0,
  fontSize: e.typography.size.s3,
  fontWeight: e.typography.weight.bold
})), QT = Xt(G0)(({ theme: e }) => ({
  position: "relative",
  zIndex: 1,
  margin: 0,
  fontSize: e.typography.size.s2
})), eI = Xt.div({
  display: "flex",
  flexDirection: "row-reverse",
  gap: 8
}), Q4 = Xt.div(({ theme: e }) => ({
  maxHeight: 100,
  overflow: "auto",
  animation: `${YT} 300ms, ${X4} 300ms`,
  backgroundColor: e.background.critical,
  color: e.color.lightest,
  fontSize: e.typography.size.s2,
  "& > div": {
    position: "relative",
    padding: "8px 16px"
  }
})), tI = /* @__PURE__ */ a(({
  children: e,
  ...t
}) => /* @__PURE__ */ vr.createElement(Q4, { ...t }, /* @__PURE__ */ vr.createElement("div", null, e)), "Error");

// src/components/components/Modal/Modal.tsx
function rI({
  children: e,
  width: t,
  height: r,
  onEscapeKeyDown: n,
  onInteractOutside: o = /* @__PURE__ */ a((c) => c.preventDefault(), "onInteractOutside"),
  className: i,
  container: l,
  ...u
}) {
  return /* @__PURE__ */ Wo.createElement(V0, { ...u }, /* @__PURE__ */ Wo.createElement(j0, { container: l }, /* @__PURE__ */ Wo.createElement(
  W0, { asChild: !0 }, /* @__PURE__ */ Wo.createElement(Q0, null)), /* @__PURE__ */ Wo.createElement(
    q0,
    {
      asChild: !0,
      onInteractOutside: o,
      onEscapeKeyDown: n
    },
    /* @__PURE__ */ Wo.createElement(e1, { className: i, width: t, height: r }, e)
  )));
}
a(rI, "BaseModal");
var nI = Object.assign(rI, t1, { Dialog: Hl });

// src/components/components/spaced/Spaced.tsx
import oI from "react";
import { ignoreSsrWarning as ev, styled as aI } from "@storybook/core/theming";
var iI = /* @__PURE__ */ a((e) => typeof e == "number" ? e : Number(e), "toNumber"), lI = aI.div(
  ({ theme: e, col: t, row: r = 1 }) => t ? {
    display: "inline-block",
    verticalAlign: "inherit",
    "& > *": {
      marginLeft: t * e.layoutMargin,
      verticalAlign: "inherit"
    },
    [`& > *:first-child${ev}`]: {
      marginLeft: 0
    }
  } : {
    "& > *": {
      marginTop: r * e.layoutMargin
    },
    [`& > *:first-child${ev}`]: {
      marginTop: 0
    }
  },
  ({ theme: e, outer: t, col: r, row: n }) => {
    switch (!0) {
      case !!(t && r):
        return {
          marginLeft: t * e.layoutMargin,
          marginRight: t * e.layoutMargin
        };
      case !!(t && n):
        return {
          marginTop: t * e.layoutMargin,
          marginBottom: t * e.layoutMargin
        };
      default:
        return {};
    }
  }
), sI = /* @__PURE__ */ a(({ col: e, row: t, outer: r, children: n, ...o }) => {
  let i = iI(typeof r == "number" || !r ? r : e || t);
  return /* @__PURE__ */ oI.createElement(lI, { col: e, row: t, outer: i, ...o }, n);
}, "Spaced");

// src/components/components/placeholder/placeholder.tsx
import r1, { Children as uI } from "react";
import { styled as n1 } from "@storybook/core/theming";
var cI = n1.div(({ theme: e }) => ({
  fontWeight: e.typography.weight.bold
})), pI = n1.div(), dI = n1.div(({ theme: e }) => ({
  padding: 30,
  textAlign: "center",
  color: e.color.defaultText,
  fontSize: e.typography.size.s2 - 1
})), fI = /* @__PURE__ */ a(({ children: e, ...t }) => {
  let [r, n] = uI.toArray(e);
  return /* @__PURE__ */ r1.createElement(dI, { ...t }, /* @__PURE__ */ r1.createElement(cI, null, r), n && /* @__PURE__ */ r1.createElement(
  pI, null, n));
}, "Placeholder");

// src/components/index.ts
Bi();

// src/components/components/Zoom/ZoomElement.tsx
import rv, { useCallback as vI, useEffect as wI, useRef as bI, useState as yI } from "react";
import { styled as DI } from "@storybook/core/theming";

// ../node_modules/use-resize-observer/dist/bundle.esm.js
import { useRef as nn, useEffect as o1, useCallback as a1, useState as hI, useMemo as mI } from "react";
function gI(e, t) {
  var r = nn(null), n = nn(null);
  n.current = t;
  var o = nn(null);
  o1(function() {
    i();
  });
  var i = a1(function() {
    var l = o.current, u = n.current, c = l || (u ? u instanceof Element ? u : u.current : null);
    r.current && r.current.element === c && r.current.subscriber === e || (r.current && r.current.cleanup && r.current.cleanup(), r.current =
    {
      element: c,
      subscriber: e,
      // Only calling the subscriber, if there's an actual element to report.
      // Setting cleanup to undefined unless a subscriber returns one, as an existing cleanup function would've been just called.
      cleanup: c ? e(c) : void 0
    });
  }, [e]);
  return o1(function() {
    return function() {
      r.current && r.current.cleanup && (r.current.cleanup(), r.current = null);
    };
  }, []), a1(function(l) {
    o.current = l, i();
  }, [i]);
}
a(gI, "useResolvedElement");
function tv(e, t, r) {
  return e[t] ? e[t][0] ? e[t][0][r] : (
    // TS complains about this, because the RO entry type follows the spec and does not reflect Firefox's current
    // behaviour of returning objects instead of arrays for `borderBoxSize` and `contentBoxSize`.
    // @ts-ignore
    e[t][r]
  ) : t === "contentBoxSize" ? e.contentRect[r === "inlineSize" ? "width" : "height"] : void 0;
}
a(tv, "extractSize");
function Ol(e) {
  e === void 0 && (e = {});
  var t = e.onResize, r = nn(void 0);
  r.current = t;
  var n = e.round || Math.round, o = nn(), i = hI({
    width: void 0,
    height: void 0
  }), l = i[0], u = i[1], c = nn(!1);
  o1(function() {
    return c.current = !1, function() {
      c.current = !0;
    };
  }, []);
  var p = nn({
    width: void 0,
    height: void 0
  }), d = gI(a1(function(h) {
    return (!o.current || o.current.box !== e.box || o.current.round !== n) && (o.current = {
      box: e.box,
      round: n,
      instance: new ResizeObserver(function(f) {
        var g = f[0], w = e.box === "border-box" ? "borderBoxSize" : e.box === "device-pixel-content-box" ? "devicePixelContentBoxSize" : "c\
ontentBoxSize", m = tv(g, w, "inlineSize"), v = tv(g, w, "blockSize"), y = m ? n(m) : void 0, b = v ? n(v) : void 0;
        if (p.current.width !== y || p.current.height !== b) {
          var D = {
            width: y,
            height: b
          };
          p.current.width = y, p.current.height = b, r.current ? r.current(D) : c.current || u(D);
        }
      })
    }), o.current.instance.observe(h, {
      box: e.box
    }), function() {
      o.current && o.current.instance.unobserve(h);
    };
  }, [e.box, n]), e.ref);
  return mI(function() {
    return {
      ref: d,
      width: l.width,
      height: l.height
    };
  }, [d, l.width, l.height]);
}
a(Ol, "useResizeObserver");

// src/components/components/Zoom/ZoomElement.tsx
var xI = DI.div(
  ({ scale: e = 1, elementHeight: t }) => ({
    height: t || "auto",
    transformOrigin: "top left",
    transform: `scale(${1 / e})`
  })
);
function nv({ scale: e, children: t }) {
  let r = bI(null), [n, o] = yI(0), i = vI(
    ({ height: l }) => {
      l && o(l / e);
    },
    [e]
  );
  return wI(() => {
    r.current && o(r.current.getBoundingClientRect().height);
  }, [e]), Ol({
    ref: r,
    onResize: i
  }), /* @__PURE__ */ rv.createElement(xI, { scale: e, elementHeight: n }, /* @__PURE__ */ rv.createElement("div", { ref: r, className: "inn\
erZoomElementWrapper" }, t));
}
a(nv, "ZoomElement");

// src/components/components/Zoom/ZoomIFrame.tsx
import ov, { Component as CI } from "react";
var i1 = class i1 extends CI {
  constructor() {
    super(...arguments);
    // @ts-expect-error (non strict)
    this.iframe = null;
  }
  componentDidMount() {
    let { iFrameRef: r } = this.props;
    this.iframe = r.current;
  }
  shouldComponentUpdate(r) {
    let { scale: n, active: o } = this.props;
    return n !== r.scale && this.setIframeInnerZoom(r.scale), o !== r.active && this.iframe.setAttribute("data-is-storybook", r.active ? "tr\
ue" : "false"), r.children.props.src !== this.props.children.props.src;
  }
  setIframeInnerZoom(r) {
    try {
      Object.assign(this.iframe.contentDocument.body.style, {
        width: `${r * 100}%`,
        height: `${r * 100}%`,
        transform: `scale(${1 / r})`,
        transformOrigin: "top left"
      });
    } catch {
      this.setIframeZoom(r);
    }
  }
  setIframeZoom(r) {
    Object.assign(this.iframe.style, {
      width: `${r * 100}%`,
      height: `${r * 100}%`,
      transform: `scale(${1 / r})`,
      transformOrigin: "top left"
    });
  }
  render() {
    let { children: r } = this.props;
    return /* @__PURE__ */ ov.createElement(ov.Fragment, null, r);
  }
};
a(i1, "ZoomIFrame");
var Nl = i1;

// src/components/components/Zoom/Zoom.tsx
var EI = {
  Element: nv,
  IFrame: Nl
};

// src/components/components/ErrorFormatter/ErrorFormatter.tsx
fi();
import qe, { Fragment as qo } from "react";
import { styled as l1 } from "@storybook/core/theming";
var { document: RI } = vn, SI = l1.strong(({ theme: e }) => ({
  color: e.color.orange
})), AI = l1.strong(({ theme: e }) => ({
  color: e.color.ancillary,
  textDecoration: "underline"
})), av = l1.em(({ theme: e }) => ({
  color: e.textMutedColor
})), FI = /(Error): (.*)\n/, kI = /at (?:(.*) )?\(?(.+)\)?/, LI = /([^@]+)?(?:\/<)?@(.+)?/, TI = /([^@]+)?@(.+)?/, II = /* @__PURE__ */ a(({
error: e }) => {
  if (!e)
    return /* @__PURE__ */ qe.createElement(qo, null, "This error has no stack or message");
  if (!e.stack)
    return /* @__PURE__ */ qe.createElement(qo, null, e.message || "This error has no stack or message");
  let t = e.stack.toString();
  t && e.message && !t.includes(e.message) && (t = `Error: ${e.message}

${t}`);
  let r = t.match(FI);
  if (!r)
    return /* @__PURE__ */ qe.createElement(qo, null, t);
  let [, n, o] = r, i = t.split(/\n/).slice(1), [, ...l] = i.map((u) => {
    let c = u.match(kI) || u.match(LI) || u.match(TI);
    return c ? {
      name: (c[1] || "").replace("/<", ""),
      location: c[2].replace(RI.location.origin, "")
    } : null;
  }).filter(Boolean);
  return /* @__PURE__ */ qe.createElement(qo, null, /* @__PURE__ */ qe.createElement("span", null, n), ": ", /* @__PURE__ */ qe.createElement(
  SI, null, o), /* @__PURE__ */ qe.createElement("br", null), l.map(
    (u, c) => u?.name ? /* @__PURE__ */ qe.createElement(qo, { key: c }, "  ", "at ", /* @__PURE__ */ qe.createElement(AI, null, u.name), " \
(", /* @__PURE__ */ qe.createElement(av, null, u.location), ")", /* @__PURE__ */ qe.createElement("br", null)) : /* @__PURE__ */ qe.createElement(
    qo, { key: c }, "  ", "at ", /* @__PURE__ */ qe.createElement(av, null, u?.location), /* @__PURE__ */ qe.createElement("br", null))
  ));
}, "ErrorFormatter");

// src/components/components/form/index.tsx
import { styled as JI } from "@storybook/core/theming";

// src/components/components/form/field/field.tsx
import s1 from "react";
import { styled as iv } from "@storybook/core/theming";
var BI = iv.label(({ theme: e }) => ({
  display: "flex",
  borderBottom: `1px solid ${e.appBorderColor}`,
  margin: "0 15px",
  padding: "8px 0",
  "&:last-child": {
    marginBottom: "3rem"
  }
})), MI = iv.span(({ theme: e }) => ({
  minWidth: 100,
  fontWeight: e.typography.weight.bold,
  marginRight: 15,
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  lineHeight: "16px"
})), lv = /* @__PURE__ */ a(({ label: e, children: t, ...r }) => /* @__PURE__ */ s1.createElement(BI, { ...r }, e ? /* @__PURE__ */ s1.createElement(
MI, null, /* @__PURE__ */ s1.createElement("span", null, e)) : null, t), "Field");

// src/components/components/form/input/input.tsx
import u1, { forwardRef as c1 } from "react";
import { styled as p1 } from "@storybook/core/theming";

// ../node_modules/react-textarea-autosize/dist/react-textarea-autosize.browser.esm.js
ua();
hi();
import * as vt from "react";

// ../node_modules/use-latest/dist/use-latest.esm.js
import * as uv from "react";

// ../node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js
import { useLayoutEffect as _I } from "react";
var PI = _I, sv = PI;

// ../node_modules/use-latest/dist/use-latest.esm.js
var cv = /* @__PURE__ */ a(function(t) {
  var r = uv.useRef(t);
  return sv(function() {
    r.current = t;
  }), r;
}, "useLatest");

// ../node_modules/use-composed-ref/dist/use-composed-ref.esm.js
import { useRef as HI, useCallback as zI } from "react";
var pv = /* @__PURE__ */ a(function(t, r) {
  if (typeof t == "function") {
    t(r);
    return;
  }
  t.current = r;
}, "updateRef"), OI = /* @__PURE__ */ a(function(t, r) {
  var n = HI();
  return zI(function(o) {
    t.current = o, n.current && pv(n.current, null), n.current = r, r && pv(r, o);
  }, [r]);
}, "useComposedRef"), dv = OI;

// ../node_modules/react-textarea-autosize/dist/react-textarea-autosize.browser.esm.js
var fv = {
  "min-height": "0",
  "max-height": "none",
  height: "0",
  visibility: "hidden",
  overflow: "hidden",
  position: "absolute",
  "z-index": "-1000",
  top: "0",
  right: "0"
}, NI = /* @__PURE__ */ a(function(t) {
  Object.keys(fv).forEach(function(r) {
    t.style.setProperty(r, fv[r], "important");
  });
}, "forceHiddenStyles"), hv = NI, Be = null, mv = /* @__PURE__ */ a(function(t, r) {
  var n = t.scrollHeight;
  return r.sizingStyle.boxSizing === "border-box" ? n + r.borderSize : n - r.paddingSize;
}, "getHeight");
function $I(e, t, r, n) {
  r === void 0 && (r = 1), n === void 0 && (n = 1 / 0), Be || (Be = document.createElement("textarea"), Be.setAttribute("tabindex", "-1"), Be.
  setAttribute("aria-hidden", "true"), hv(Be)), Be.parentNode === null && document.body.appendChild(Be);
  var o = e.paddingSize, i = e.borderSize, l = e.sizingStyle, u = l.boxSizing;
  Object.keys(l).forEach(function(f) {
    var g = f;
    Be.style[g] = l[g];
  }), hv(Be), Be.value = t;
  var c = mv(Be, e);
  Be.value = t, c = mv(Be, e), Be.value = "x";
  var p = Be.scrollHeight - o, d = p * r;
  u === "border-box" && (d = d + o + i), c = Math.max(d, c);
  var h = p * n;
  return u === "border-box" && (h = h + o + i), c = Math.min(h, c), [c, p];
}
a($I, "calculateNodeHeight");
var gv = /* @__PURE__ */ a(function() {
}, "noop"), VI = /* @__PURE__ */ a(function(t, r) {
  return t.reduce(function(n, o) {
    return n[o] = r[o], n;
  }, {});
}, "pick"), jI = [
  "borderBottomWidth",
  "borderLeftWidth",
  "borderRightWidth",
  "borderTopWidth",
  "boxSizing",
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  // non-standard
  "tabSize",
  "textIndent",
  // non-standard
  "textRendering",
  "textTransform",
  "width",
  "wordBreak"
], WI = !!document.documentElement.currentStyle, qI = /* @__PURE__ */ a(function(t) {
  var r = window.getComputedStyle(t);
  if (r === null)
    return null;
  var n = VI(jI, r), o = n.boxSizing;
  if (o === "")
    return null;
  WI && o === "border-box" && (n.width = parseFloat(n.width) + parseFloat(n.borderRightWidth) + parseFloat(n.borderLeftWidth) + parseFloat(n.
  paddingRight) + parseFloat(n.paddingLeft) + "px");
  var i = parseFloat(n.paddingBottom) + parseFloat(n.paddingTop), l = parseFloat(n.borderBottomWidth) + parseFloat(n.borderTopWidth);
  return {
    sizingStyle: n,
    paddingSize: i,
    borderSize: l
  };
}, "getSizingData"), UI = qI;
function vv(e, t, r) {
  var n = cv(r);
  vt.useLayoutEffect(function() {
    var o = /* @__PURE__ */ a(function(l) {
      return n.current(l);
    }, "handler");
    if (e)
      return e.addEventListener(t, o), function() {
        return e.removeEventListener(t, o);
      };
  }, []);
}
a(vv, "useListener");
var GI = /* @__PURE__ */ a(function(t) {
  vv(window, "resize", t);
}, "useWindowResizeListener"), YI = /* @__PURE__ */ a(function(t) {
  vv(document.fonts, "loadingdone", t);
}, "useFontsLoadedListener"), XI = ["cacheMeasurements", "maxRows", "minRows", "onChange", "onHeightChange"], ZI = /* @__PURE__ */ a(function(t, r) {
  var n = t.cacheMeasurements, o = t.maxRows, i = t.minRows, l = t.onChange, u = l === void 0 ? gv : l, c = t.onHeightChange, p = c === void 0 ?
  gv : c, d = wn(t, XI), h = d.value !== void 0, f = vt.useRef(null), g = dv(f, r), w = vt.useRef(0), m = vt.useRef(), v = /* @__PURE__ */ a(
  function() {
    var D = f.current, x = n && m.current ? m.current : UI(D);
    if (x) {
      m.current = x;
      var C = $I(x, D.value || D.placeholder || "x", i, o), E = C[0], R = C[1];
      w.current !== E && (w.current = E, D.style.setProperty("height", E + "px", "important"), p(E, {
        rowHeight: R
      }));
    }
  }, "resizeTextarea"), y = /* @__PURE__ */ a(function(D) {
    h || v(), u(D);
  }, "handleChange");
  return vt.useLayoutEffect(v), GI(v), YI(v), /* @__PURE__ */ vt.createElement("textarea", ve({}, d, {
    onChange: y,
    ref: g
  }));
}, "TextareaAutosize"), wv = /* @__PURE__ */ vt.forwardRef(ZI);

// src/components/components/form/input/input.tsx
var KI = {
  // resets
  appearance: "none",
  border: "0 none",
  boxSizing: "inherit",
  display: " block",
  margin: " 0",
  background: "transparent",
  padding: 0,
  fontSize: "inherit",
  position: "relative"
}, d1 = /* @__PURE__ */ a(({ theme: e }) => ({
  ...KI,
  transition: "box-shadow 200ms ease-out, opacity 200ms ease-out",
  color: e.input.color || "inherit",
  background: e.input.background,
  boxShadow: `${e.input.border} 0 0 0 1px inset`,
  borderRadius: e.input.borderRadius,
  fontSize: e.typography.size.s2 - 1,
  lineHeight: "20px",
  padding: "6px 10px",
  // 32
  boxSizing: "border-box",
  height: 32,
  '&[type="file"]': {
    height: "auto"
  },
  "&:focus": {
    boxShadow: `${e.color.secondary} 0 0 0 1px inset`,
    outline: "none"
  },
  "&[disabled]": {
    cursor: "not-allowed",
    opacity: 0.5
  },
  "&:-webkit-autofill": { WebkitBoxShadow: `0 0 0 3em ${e.color.lightest} inset` },
  "&::placeholder": {
    color: e.textMutedColor,
    opacity: 1
  }
}), "styles"), f1 = /* @__PURE__ */ a(({ size: e }) => {
  switch (e) {
    case "100%":
      return { width: "100%" };
    case "flex":
      return { flex: 1 };
    case "auto":
    default:
      return { display: "inline" };
  }
}, "sizes"), bv = /* @__PURE__ */ a(({
  align: e
}) => {
  switch (e) {
    case "end":
      return { textAlign: "right" };
    case "center":
      return { textAlign: "center" };
    case "start":
    default:
      return { textAlign: "left" };
  }
}, "alignment"), h1 = /* @__PURE__ */ a(({ valid: e, theme: t }) => {
  switch (e) {
    case "valid":
      return { boxShadow: `${t.color.positive} 0 0 0 1px inset !important` };
    case "error":
      return { boxShadow: `${t.color.negative} 0 0 0 1px inset !important` };
    case "warn":
      return {
        boxShadow: `${t.color.warning} 0 0 0 1px inset`
      };
    case void 0:
    case null:
    default:
      return {};
  }
}, "validation"), yv = Object.assign(
  p1(
    c1(/* @__PURE__ */ a(function({ size: t, valid: r, align: n, ...o }, i) {
      return /* @__PURE__ */ u1.createElement("input", { ...o, ref: i });
    }, "Input"))
  )(d1, f1, bv, h1, {
    minHeight: 32
  }),
  {
    displayName: "Input"
  }
), Dv = Object.assign(
  p1(
    c1(/* @__PURE__ */ a(function({ size: t, valid: r, align: n, ...o }, i) {
      return /* @__PURE__ */ u1.createElement("select", { ...o, ref: i });
    }, "Select"))
  )(d1, f1, h1, {
    height: 32,
    userSelect: "none",
    paddingRight: 20,
    appearance: "menulist"
  }),
  {
    displayName: "Select"
  }
), xv = Object.assign(
  p1(
    c1(/* @__PURE__ */ a(function({ size: t, valid: r, align: n, ...o }, i) {
      return /* @__PURE__ */ u1.createElement(wv, { ...o, ref: i });
    }, "Textarea"))
  )(d1, f1, bv, h1, ({ height: e = 400 }) => ({
    overflow: "visible",
    maxHeight: e
  })),
  {
    displayName: "Textarea"
  }
);

// src/components/components/form/index.tsx
var QI = Object.assign(
  JI.form({
    boxSizing: "border-box",
    width: "100%"
  }),
  {
    Field: lv,
    Input: yv,
    Select: Dv,
    Textarea: xv,
    Button: jo
  }
);

// src/components/components/tooltip/lazy-WithTooltip.tsx
import ta, { Suspense as _3, lazy as P3 } from "react";
var XB = P3(
  () => Promise.resolve().then(() => (ts(), U1)).then((e) => ({ default: e.WithTooltip }))
), ZB = /* @__PURE__ */ a((e) => /* @__PURE__ */ ta.createElement(_3, { fallback: /* @__PURE__ */ ta.createElement("div", null) }, /* @__PURE__ */ ta.
createElement(XB, { ...e })), "WithTooltip"), KB = P3(
  () => Promise.resolve().then(() => (ts(), U1)).then((e) => ({ default: e.WithTooltipPure }))
), JB = /* @__PURE__ */ a((e) => /* @__PURE__ */ ta.createElement(_3, { fallback: /* @__PURE__ */ ta.createElement("div", null) }, /* @__PURE__ */ ta.
createElement(KB, { ...e })), "WithTooltipPure");

// src/components/components/tooltip/TooltipMessage.tsx
import ra from "react";
import { styled as ai } from "@storybook/core/theming";
var QB = ai.div(({ theme: e }) => ({
  fontWeight: e.typography.weight.bold
})), eM = ai.span(), tM = ai.div(({ theme: e }) => ({
  marginTop: 8,
  textAlign: "center",
  "> *": {
    margin: "0 8px",
    fontWeight: e.typography.weight.bold
  }
})), rM = ai.div(({ theme: e }) => ({
  color: e.color.defaultText,
  lineHeight: "18px"
})), nM = ai.div({
  padding: 15,
  width: 280,
  boxSizing: "border-box"
}), oM = /* @__PURE__ */ a(({ title: e, desc: t, links: r }) => /* @__PURE__ */ ra.createElement(nM, null, /* @__PURE__ */ ra.createElement(
rM, null, e && /* @__PURE__ */ ra.createElement(QB, null, e), t && /* @__PURE__ */ ra.createElement(eM, null, t)), r && /* @__PURE__ */ ra.createElement(
tM, null, r.map(({ title: n, ...o }) => /* @__PURE__ */ ra.createElement(Yu, { ...o, key: n }, n)))), "TooltipMessage");

// src/components/components/tooltip/TooltipNote.tsx
import aM from "react";
import { styled as iM } from "@storybook/core/theming";
var lM = iM.div(({ theme: e }) => ({
  padding: "2px 6px",
  lineHeight: "16px",
  fontSize: 10,
  fontWeight: e.typography.weight.bold,
  color: e.color.lightest,
  boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.3)",
  borderRadius: 4,
  whiteSpace: "nowrap",
  pointerEvents: "none",
  zIndex: -1,
  background: e.base === "light" ? "rgba(60, 60, 60, 0.9)" : "rgba(0, 0, 0, 0.95)",
  margin: 6
})), sM = /* @__PURE__ */ a(({ note: e, ...t }) => /* @__PURE__ */ aM.createElement(lM, { ...t }, e), "TooltipNote");

// src/components/components/tooltip/TooltipLinkList.tsx
import ii, { Fragment as vM, useCallback as wM } from "react";
import { styled as z3 } from "@storybook/core/theming";

// src/components/components/tooltip/ListItem.tsx
var H3 = Ce(da(), 1);
import Mt from "react";
import { styled as na } from "@storybook/core/theming";
var uM = na(({ active: e, loading: t, disabled: r, ...n }) => /* @__PURE__ */ Mt.createElement("span", { ...n }))(
  ({ theme: e }) => ({
    color: e.color.defaultText,
    // Previously was theme.typography.weight.normal but this weight does not exists in Theme
    fontWeight: e.typography.weight.regular
  }),
  ({ active: e, theme: t }) => e ? {
    color: t.color.secondary,
    fontWeight: t.typography.weight.bold
  } : {},
  ({ loading: e, theme: t }) => e ? {
    display: "inline-block",
    flex: "none",
    ...t.animation.inlineGlow
  } : {},
  ({ disabled: e, theme: t }) => e ? {
    color: t.textMutedColor
  } : {}
), cM = na.span({
  display: "flex",
  "& svg": {
    height: 12,
    width: 12,
    margin: "3px 0",
    verticalAlign: "top"
  },
  "& path": {
    fill: "inherit"
  }
}), pM = na.span(
  {
    flex: 1,
    textAlign: "left",
    display: "flex",
    flexDirection: "column"
  },
  ({ isIndented: e }) => e ? { marginLeft: 24 } : {}
), dM = na.span(
  ({ theme: e }) => ({
    fontSize: "11px",
    lineHeight: "14px"
  }),
  ({ active: e, theme: t }) => e ? {
    color: t.color.secondary
  } : {},
  ({ theme: e, disabled: t }) => t ? {
    color: e.textMutedColor
  } : {}
), fM = na.span(
  ({ active: e, theme: t }) => e ? {
    color: t.color.secondary
  } : {},
  () => ({
    display: "flex",
    maxWidth: 14
  })
), hM = na.div(
  ({ theme: e }) => ({
    width: "100%",
    border: "none",
    borderRadius: e.appBorderRadius,
    background: "none",
    fontSize: e.typography.size.s1,
    transition: "all 150ms ease-out",
    color: e.color.dark,
    textDecoration: "none",
    justifyContent: "space-between",
    lineHeight: "18px",
    padding: "7px 10px",
    display: "flex",
    alignItems: "center",
    "& > * + *": {
      paddingLeft: 10
    }
  }),
  ({ theme: e, href: t, onClick: r }) => (t || r) && {
    cursor: "pointer",
    "&:hover": {
      background: e.background.hoverable
    },
    "&:hover svg": {
      opacity: 1
    }
  },
  ({ theme: e, as: t }) => t === "label" && {
    "&:has(input:not(:disabled))": {
      cursor: "pointer",
      "&:hover": {
        background: e.background.hoverable
      }
    }
  },
  ({ disabled: e }) => e && { cursor: "not-allowed" }
), mM = (0, H3.default)(100)((e, t, r) => ({
  ...e && {
    as: "button",
    onClick: e
  },
  ...t && {
    as: "a",
    href: t,
    ...r && {
      as: r,
      to: t
    }
  }
})), gM = /* @__PURE__ */ a(({
  loading: e = !1,
  title: t = /* @__PURE__ */ Mt.createElement("span", null, "Loading state"),
  center: r = null,
  right: n = null,
  active: o = !1,
  disabled: i = !1,
  isIndented: l,
  href: u = void 0,
  onClick: c = void 0,
  icon: p,
  LinkWrapper: d = void 0,
  ...h
}) => {
  let f = { active: o, disabled: i }, g = mM(c, u, d);
  return /* @__PURE__ */ Mt.createElement(hM, { ...h, ...f, ...g }, /* @__PURE__ */ Mt.createElement(Mt.Fragment, null, p && /* @__PURE__ */ Mt.
  createElement(fM, { ...f }, p), t || r ? /* @__PURE__ */ Mt.createElement(pM, { isIndented: !!(!p && l) }, t && /* @__PURE__ */ Mt.createElement(
  uM, { ...f, loading: e }, t), r && /* @__PURE__ */ Mt.createElement(dM, { ...f }, r)) : null, n && /* @__PURE__ */ Mt.createElement(cM, { ...f },
  n)));
}, "ListItem"), G1 = gM;

// src/components/components/tooltip/TooltipLinkList.tsx
var bM = z3.div(
  {
    minWidth: 180,
    overflow: "hidden",
    overflowY: "auto",
    maxHeight: 15.5 * 32 + 8
    // 15.5 items at 32px each + 8px padding
  },
  ({ theme: e }) => ({
    borderRadius: e.appBorderRadius + 2
  }),
  ({ theme: e }) => e.base === "dark" ? { background: e.background.content } : {}
), yM = z3.div(({ theme: e }) => ({
  padding: 4,
  "& + &": {
    borderTop: `1px solid ${e.appBorderColor}`
  }
})), DM = /* @__PURE__ */ a(({ id: e, onClick: t, ...r }) => {
  let { active: n, disabled: o, title: i, href: l } = r, u = wM(
    (c) => t?.(c, { id: e, active: n, disabled: o, title: i, href: l }),
    [t, e, n, o, i, l]
  );
  return /* @__PURE__ */ ii.createElement(G1, { id: `list-item-${e}`, ...r, ...t && { onClick: u } });
}, "Item"), Y1 = /* @__PURE__ */ a(({ links: e, LinkWrapper: t, ...r }) => {
  let n = Array.isArray(e[0]) ? e : [e], o = n.some((i) => i.some((l) => "icon" in l && l.icon));
  return /* @__PURE__ */ ii.createElement(bM, { ...r }, n.filter((i) => i.length).map((i, l) => /* @__PURE__ */ ii.createElement(yM, { key: i.
  map((u) => u.id).join(`~${l}~`) }, i.map((u) => "content" in u ? /* @__PURE__ */ ii.createElement(vM, { key: u.id }, u.content) : /* @__PURE__ */ ii.
  createElement(DM, { key: u.id, isIndented: o, LinkWrapper: t, ...u })))));
}, "TooltipLinkList");

// src/components/components/tabs/tabs.tsx
import xt, { Component as WM, memo as qM, useMemo as UM } from "react";
import { sanitize as GM } from "@storybook/core/csf";
import { styled as np } from "@storybook/core/theming";

// src/components/components/bar/bar.tsx
Bi();
import oa, { Children as xM } from "react";
import { styled as Z1 } from "@storybook/core/theming";
var X1 = Z1.div(
  {
    display: "flex",
    whiteSpace: "nowrap",
    flexBasis: "auto",
    marginLeft: 3,
    marginRight: 3
  },
  ({ scrollable: e }) => e ? { flexShrink: 0 } : {},
  ({ left: e }) => e ? {
    "& > *": {
      marginLeft: 4
    }
  } : {},
  ({ right: e }) => e ? {
    marginLeft: 30,
    "& > *": {
      marginRight: 4
    }
  } : {}
);
X1.displayName = "Side";
var CM = /* @__PURE__ */ a(({ children: e, className: t, scrollable: r }) => r ? /* @__PURE__ */ oa.createElement(Fn, { vertical: !1, className: t },
e) : /* @__PURE__ */ oa.createElement("div", { className: t }, e), "UnstyledBar"), K1 = Z1(CM)(
  ({ theme: e, scrollable: t = !0 }) => ({
    color: e.barTextColor,
    width: "100%",
    height: 40,
    flexShrink: 0,
    overflow: t ? "auto" : "hidden",
    overflowY: "hidden"
  }),
  ({ theme: e, border: t = !1 }) => t ? {
    boxShadow: `${e.appBorderColor}  0 -1px 0 0 inset`,
    background: e.barBg
  } : {}
);
K1.displayName = "Bar";
var EM = Z1.div(({ bgColor: e }) => ({
  display: "flex",
  justifyContent: "space-between",
  position: "relative",
  flexWrap: "nowrap",
  flexShrink: 0,
  height: 40,
  backgroundColor: e || ""
})), rs = /* @__PURE__ */ a(({ children: e, backgroundColor: t, className: r, ...n }) => {
  let [o, i] = xM.toArray(e);
  return /* @__PURE__ */ oa.createElement(K1, { className: `sb-bar ${r}`, ...n }, /* @__PURE__ */ oa.createElement(EM, { bgColor: t }, /* @__PURE__ */ oa.
  createElement(X1, { scrollable: n.scrollable, left: !0 }, o), i ? /* @__PURE__ */ oa.createElement(X1, { right: !0 }, i) : null));
}, "FlexBar");
rs.displayName = "FlexBar";

// src/components/components/bar/button.tsx
import ns, { forwardRef as RM } from "react";
import { isPropValid as SM, styled as J1 } from "@storybook/core/theming";
var AM = /* @__PURE__ */ a((e) => typeof e.props.href == "string", "isLink"), FM = /* @__PURE__ */ a((e) => typeof e.props.href != "string",
"isButton");
function kM({ children: e, ...t }, r) {
  let n = { props: t, ref: r };
  if (AM(n))
    return /* @__PURE__ */ ns.createElement("a", { ref: n.ref, ...n.props }, e);
  if (FM(n))
    return /* @__PURE__ */ ns.createElement("button", { ref: n.ref, type: "button", ...n.props }, e);
  throw new Error("invalid props");
}
a(kM, "ForwardRefFunction");
var O3 = RM(kM);
O3.displayName = "ButtonOrLink";
var fn = J1(O3, { shouldForwardProp: SM })(
  {
    whiteSpace: "normal",
    display: "inline-flex",
    overflow: "hidden",
    verticalAlign: "top",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    textDecoration: "none",
    "&:empty": {
      display: "none"
    },
    "&[hidden]": {
      display: "none"
    }
  },
  ({ theme: e }) => ({
    padding: "0 15px",
    transition: "color 0.2s linear, border-bottom-color 0.2s linear",
    height: 40,
    lineHeight: "12px",
    cursor: "pointer",
    background: "transparent",
    border: "0 solid transparent",
    borderTop: "3px solid transparent",
    borderBottom: "3px solid transparent",
    fontWeight: "bold",
    fontSize: 13,
    "&:focus": {
      outline: "0 none",
      borderBottomColor: e.barSelectedColor
    }
  }),
  ({ active: e, textColor: t, theme: r }) => e ? {
    color: t || r.barSelectedColor,
    borderBottomColor: r.barSelectedColor
  } : {
    color: t || r.barTextColor,
    borderBottomColor: "transparent",
    "&:hover": {
      color: r.barHoverColor
    }
  }
);
fn.displayName = "TabButton";
var LM = J1.div(({ theme: e }) => ({
  width: 14,
  height: 14,
  backgroundColor: e.appBorderColor,
  animation: `${e.animation.glow} 1.5s ease-in-out infinite`
})), TM = J1.div({
  marginTop: 6,
  padding: 7,
  height: 28
}), IM = /* @__PURE__ */ a(() => /* @__PURE__ */ ns.createElement(TM, null, /* @__PURE__ */ ns.createElement(LM, null)), "IconButtonSkeleton");

// src/components/components/tabs/EmptyTabContent.tsx
import os from "react";
import { styled as as } from "@storybook/core/theming";
var BM = as.div(({ theme: e }) => ({
  height: "100%",
  display: "flex",
  padding: 30,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: 15,
  background: e.background.content
})), MM = as.div({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  maxWidth: 415
}), _M = as.div(({ theme: e }) => ({
  fontWeight: e.typography.weight.bold,
  fontSize: e.typography.size.s2 - 1,
  textAlign: "center",
  color: e.textColor
})), PM = as.div(({ theme: e }) => ({
  fontWeight: e.typography.weight.regular,
  fontSize: e.typography.size.s2 - 1,
  textAlign: "center",
  color: e.textMutedColor
})), Q1 = /* @__PURE__ */ a(({ title: e, description: t, footer: r }) => /* @__PURE__ */ os.createElement(BM, null, /* @__PURE__ */ os.createElement(
MM, null, /* @__PURE__ */ os.createElement(_M, null, e), t && /* @__PURE__ */ os.createElement(PM, null, t)), r), "EmptyTabContent");

// src/components/components/tabs/tabs.helpers.tsx
import HM, { Children as zM } from "react";
import { styled as OM } from "@storybook/core/theming";
var ep = OM.div(
  ({ active: e }) => e ? { display: "block" } : { display: "none" }
), N3 = /* @__PURE__ */ a((e) => zM.toArray(e).map(
  // @ts-expect-error (non strict)
  ({
    props: { title: t, id: r, color: n, children: o }
  }) => {
    let i = Array.isArray(
      o
    ) ? o[0] : o;
    return {
      title: t,
      id: r,
      ...n ? { color: n } : {},
      render: typeof i == "function" ? i : ({ active: u }) => /* @__PURE__ */ HM.createElement(ep, { active: u, role: "tabpanel" }, i)
    };
  }
), "childrenToList");

// src/components/components/tabs/tabs.hooks.tsx
import hn, { useCallback as $3, useLayoutEffect as NM, useRef as is, useState as tp } from "react";
import { sanitize as $M } from "@storybook/core/csf";
import { styled as V3 } from "@storybook/core/theming";
ts();
var VM = V3.span(({ theme: e, isActive: t }) => ({
  display: "inline-block",
  width: 0,
  height: 0,
  marginLeft: 8,
  color: t ? e.color.secondary : e.color.mediumdark,
  borderRight: "3px solid transparent",
  borderLeft: "3px solid transparent",
  borderTop: "3px solid",
  transition: "transform .1s ease-out"
})), jM = V3(fn)(({ active: e, theme: t, preActive: r }) => `
    color: ${r || e ? t.barSelectedColor : t.barTextColor};
    .addon-collapsible-icon {
      color: ${r || e ? t.barSelectedColor : t.barTextColor};
    }
    &:hover {
      color: ${t.barHoverColor};
      .addon-collapsible-icon {
        color: ${t.barHoverColor};
      }
    }
  `);
function j3(e) {
  let t = is(), r = is(), n = is(/* @__PURE__ */ new Map()), { width: o = 1 } = Ol({
    // @ts-expect-error (non strict)
    ref: t
  }), [i, l] = tp(e), [u, c] = tp([]), p = is(e), d = $3(
    ({
      menuName: f,
      actions: g
    }) => {
      let w = u.some(({ active: y }) => y), [m, v] = tp(!1);
      return /* @__PURE__ */ hn.createElement(hn.Fragment, null, /* @__PURE__ */ hn.createElement(
        q1,
        {
          interactive: !0,
          visible: m,
          onVisibleChange: v,
          placement: "bottom",
          delayHide: 100,
          tooltip: /* @__PURE__ */ hn.createElement(
            Y1,
            {
              links: u.map(({ title: y, id: b, color: D, active: x }) => ({
                id: b,
                title: y,
                color: D,
                active: x,
                onClick: /* @__PURE__ */ a((C) => {
                  C.preventDefault(), g.onSelect(b);
                }, "onClick")
              }))
            }
          )
        },
        /* @__PURE__ */ hn.createElement(
          jM,
          {
            ref: r,
            active: w,
            preActive: m,
            style: { visibility: u.length ? "visible" : "hidden" },
            "aria-hidden": !u.length,
            className: "tabbutton",
            type: "button",
            role: "tab"
          },
          f,
          /* @__PURE__ */ hn.createElement(
            VM,
            {
              className: "addon-collapsible-icon",
              isActive: w || m
            }
          )
        )
      ), u.map(({ title: y, id: b, color: D }, x) => {
        let C = `index-${x}`;
        return /* @__PURE__ */ hn.createElement(
          fn,
          {
            id: `tabbutton-${$M(b) ?? C}`,
            style: { visibility: "hidden" },
            "aria-hidden": !0,
            tabIndex: -1,
            ref: (E) => {
              n.current.set(b, E);
            },
            className: "tabbutton",
            type: "button",
            key: b,
            textColor: D,
            role: "tab"
          },
          y
        );
      }));
    },
    [u]
  ), h = $3(() => {
    if (!t.current || !r.current)
      return;
    let { x: f, width: g } = t.current.getBoundingClientRect(), { width: w } = r.current.getBoundingClientRect(), m = u.length ? f + g - w :
    f + g, v = [], y = 0, b = e.filter((D) => {
      let { id: x } = D, C = n.current.get(x), { width: E = 0 } = C?.getBoundingClientRect() || {}, R = f + y + E > m;
      return (!R || !C) && v.push(D), y += E, R;
    });
    (v.length !== i.length || p.current !== e) && (l(v), c(b), p.current = e);
  }, [u.length, e, i]);
  return NM(h, [h, o]), {
    tabRefs: n,
    addonsRef: r,
    tabBarRef: t,
    visibleList: i,
    invisibleList: u,
    AddonTab: d
  };
}
a(j3, "useList");

// src/components/components/tabs/tabs.tsx
var YM = "/* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason */", XM = np.div(
  ({ theme: e, bordered: t }) => t ? {
    backgroundClip: "padding-box",
    border: `1px solid ${e.appBorderColor}`,
    borderRadius: e.appBorderRadius,
    overflow: "hidden",
    boxSizing: "border-box"
  } : {},
  ({ absolute: e }) => e ? {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column"
  } : {
    display: "block"
  }
), op = np.div({
  overflow: "hidden",
  "&:first-of-type": {
    marginLeft: -3
  },
  whiteSpace: "nowrap",
  flexGrow: 1
});
op.displayName = "TabBar";
var ZM = np.div(
  {
    display: "block",
    position: "relative"
  },
  ({ theme: e }) => ({
    fontSize: e.typography.size.s2 - 1,
    background: e.background.content
  }),
  ({ bordered: e, theme: t }) => e ? {
    borderRadius: `0 0 ${t.appBorderRadius - 1}px ${t.appBorderRadius - 1}px`
  } : {},
  ({ absolute: e, bordered: t }) => e ? {
    height: `calc(100% - ${t ? 42 : 40}px)`,
    position: "absolute",
    left: 0 + (t ? 1 : 0),
    right: 0 + (t ? 1 : 0),
    bottom: 0 + (t ? 1 : 0),
    top: 40 + (t ? 1 : 0),
    overflow: "auto",
    [`& > *:first-child${YM}`]: {
      position: "absolute",
      left: 0 + (t ? 1 : 0),
      right: 0 + (t ? 1 : 0),
      bottom: 0 + (t ? 1 : 0),
      top: 0 + (t ? 1 : 0),
      height: `calc(100% - ${t ? 2 : 0}px)`,
      overflow: "auto"
    }
  } : {}
), KM = /* @__PURE__ */ a(({ active: e, render: t, children: r }) => /* @__PURE__ */ xt.createElement(ep, { active: e }, t ? t() : r), "TabW\
rapper");
var ap = qM(
  ({
    children: e,
    selected: t = null,
    actions: r,
    absolute: n = !1,
    bordered: o = !1,
    tools: i = null,
    backgroundColor: l,
    id: u = null,
    menuName: c = "Tabs",
    emptyState: p,
    showToolsWhenEmpty: d
  }) => {
    let h = UM(
      () => N3(e).map((y, b) => ({
        ...y,
        active: t ? y.id === t : b === 0
      })),
      [e, t]
    ), { visibleList: f, tabBarRef: g, tabRefs: w, AddonTab: m } = j3(h), v = p ?? /* @__PURE__ */ xt.createElement(Q1, { title: "Nothing fo\
und" });
    return !d && h.length === 0 ? v : (
      // @ts-expect-error (non strict)
      /* @__PURE__ */ xt.createElement(XM, { absolute: n, bordered: o, id: u }, /* @__PURE__ */ xt.createElement(rs, { scrollable: !1, border: !0,
      backgroundColor: l }, /* @__PURE__ */ xt.createElement(op, { style: { whiteSpace: "normal" }, ref: g, role: "tablist" }, f.map(({ title: y,
      id: b, active: D, color: x }, C) => {
        let E = `index-${C}`;
        return /* @__PURE__ */ xt.createElement(
          fn,
          {
            id: `tabbutton-${GM(b) ?? E}`,
            ref: (R) => {
              w.current.set(b, R);
            },
            className: `tabbutton ${D ? "tabbutton-active" : ""}`,
            type: "button",
            key: b,
            active: D,
            textColor: x,
            onClick: (R) => {
              R.preventDefault(), r.onSelect(b);
            },
            role: "tab"
          },
          typeof y == "function" ? /* @__PURE__ */ xt.createElement("title", null) : y
        );
      }), /* @__PURE__ */ xt.createElement(m, { menuName: c, actions: r })), i), /* @__PURE__ */ xt.createElement(ZM, { id: "panel-tab-conte\
nt", bordered: o, absolute: n }, h.length ? h.map(({ id: y, active: b, render: D }) => xt.createElement(D, { key: y, active: b }, null)) : v))
    );
  }
);
ap.displayName = "Tabs";
var ls = class ls extends WM {
  constructor(r) {
    super(r);
    this.handlers = {
      onSelect: /* @__PURE__ */ a((r) => this.setState({ selected: r }), "onSelect")
    };
    this.state = {
      selected: r.initial
    };
  }
  render() {
    let { bordered: r = !1, absolute: n = !1, children: o, backgroundColor: i, menuName: l } = this.props, { selected: u } = this.state;
    return /* @__PURE__ */ xt.createElement(
      ap,
      {
        bordered: r,
        absolute: n,
        selected: u,
        backgroundColor: i,
        menuName: l,
        actions: this.handlers
      },
      o
    );
  }
};
a(ls, "TabsState"), ls.defaultProps = {
  children: [],
  // @ts-expect-error (non strict)
  initial: null,
  absolute: !1,
  bordered: !1,
  backgroundColor: "",
  // @ts-expect-error (non strict)
  menuName: void 0
};
var rp = ls;

// src/components/components/bar/separator.tsx
import W3, { Fragment as JM } from "react";
import { styled as QM } from "@storybook/core/theming";
var ip = QM.span(
  ({ theme: e }) => ({
    width: 1,
    height: 20,
    background: e.appBorderColor,
    marginLeft: 2,
    marginRight: 2
  }),
  ({ force: e }) => e ? {} : {
    "& + &": {
      display: "none"
    }
  }
);
ip.displayName = "Separator";
var e_ = /* @__PURE__ */ a((e) => e.reduce(
  (t, r, n) => r ? /* @__PURE__ */ W3.createElement(JM, { key: r.id || r.key || `f-${n}` }, t, n > 0 ? /* @__PURE__ */ W3.createElement(ip, {
  key: `s-${n}` }) : null, r.render() || r) : t,
  null
), "interleaveSeparators");

// src/components/components/addon-panel/addon-panel.tsx
import t_, { useEffect as r_, useRef as n_ } from "react";
var o_ = /* @__PURE__ */ a((e) => {
  let t = n_();
  return r_(() => {
    t.current = e;
  }, [e]), t.current;
}, "usePrevious"), a_ = /* @__PURE__ */ a((e, t) => {
  let r = o_(t);
  return e ? t : r;
}, "useUpdate"), i_ = /* @__PURE__ */ a(({ active: e, children: t }) => (
  // the hidden attribute is an valid html element that's both accessible and works to visually hide content
  /* @__PURE__ */ t_.createElement("div", { hidden: !e }, a_(e, t))
), "AddonPanel");

// src/components/components/icon/icon.tsx
import lp, { memo as l_ } from "react";
import { styled as s_ } from "@storybook/core/theming";
import { deprecate as u_, logger as c_ } from "@storybook/core/client-logger";
var p_ = Uu, d_ = s_.svg`
  display: inline-block;
  shape-rendering: inherit;
  vertical-align: middle;
  fill: currentColor;
  path {
    fill: currentColor;
  }
`, f_ = /* @__PURE__ */ a(({
  icon: e,
  useSymbol: t,
  __suppressDeprecationWarning: r = !1,
  ...n
}) => {
  r || u_(
    `Use of the deprecated Icons ${`(${e})` || ""} component detected. Please use the @storybook/icons component directly. For more informat\
ions, see the migration notes at https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#icons-is-deprecated`
  );
  let o = ss[e] || null;
  if (!o)
    return c_.warn(
      `Use of an unknown prop ${`(${e})` || ""} in the Icons component. The Icons component is deprecated. Please use the @storybook/icons c\
omponent directly. For more informations, see the migration notes at https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#icons-i\
s-deprecated`
    ), null;
  let i = p_[o];
  return /* @__PURE__ */ lp.createElement(i, { ...n });
}, "Icons"), h_ = l_(/* @__PURE__ */ a(function({ icons: t = Object.keys(ss) }) {
  return /* @__PURE__ */ lp.createElement(
    d_,
    {
      viewBox: "0 0 14 14",
      style: { position: "absolute", width: 0, height: 0 },
      "data-chromatic": "ignore"
    },
    t.map((r) => /* @__PURE__ */ lp.createElement("symbol", { id: `icon--${r}`, key: r }, ss[r]))
  );
}, "Symbols")), ss = {
  user: "UserIcon",
  useralt: "UserAltIcon",
  useradd: "UserAddIcon",
  users: "UsersIcon",
  profile: "ProfileIcon",
  facehappy: "FaceHappyIcon",
  faceneutral: "FaceNeutralIcon",
  facesad: "FaceSadIcon",
  accessibility: "AccessibilityIcon",
  accessibilityalt: "AccessibilityAltIcon",
  arrowup: "ChevronUpIcon",
  arrowdown: "ChevronDownIcon",
  arrowleft: "ChevronLeftIcon",
  arrowright: "ChevronRightIcon",
  arrowupalt: "ArrowUpIcon",
  arrowdownalt: "ArrowDownIcon",
  arrowleftalt: "ArrowLeftIcon",
  arrowrightalt: "ArrowRightIcon",
  expandalt: "ExpandAltIcon",
  collapse: "CollapseIcon",
  expand: "ExpandIcon",
  unfold: "UnfoldIcon",
  transfer: "TransferIcon",
  redirect: "RedirectIcon",
  undo: "UndoIcon",
  reply: "ReplyIcon",
  sync: "SyncIcon",
  upload: "UploadIcon",
  download: "DownloadIcon",
  back: "BackIcon",
  proceed: "ProceedIcon",
  refresh: "RefreshIcon",
  globe: "GlobeIcon",
  compass: "CompassIcon",
  location: "LocationIcon",
  pin: "PinIcon",
  time: "TimeIcon",
  dashboard: "DashboardIcon",
  timer: "TimerIcon",
  home: "HomeIcon",
  admin: "AdminIcon",
  info: "InfoIcon",
  question: "QuestionIcon",
  support: "SupportIcon",
  alert: "AlertIcon",
  email: "EmailIcon",
  phone: "PhoneIcon",
  link: "LinkIcon",
  unlink: "LinkBrokenIcon",
  bell: "BellIcon",
  rss: "RSSIcon",
  sharealt: "ShareAltIcon",
  share: "ShareIcon",
  circle: "CircleIcon",
  circlehollow: "CircleHollowIcon",
  bookmarkhollow: "BookmarkHollowIcon",
  bookmark: "BookmarkIcon",
  hearthollow: "HeartHollowIcon",
  heart: "HeartIcon",
  starhollow: "StarHollowIcon",
  star: "StarIcon",
  certificate: "CertificateIcon",
  verified: "VerifiedIcon",
  thumbsup: "ThumbsUpIcon",
  shield: "ShieldIcon",
  basket: "BasketIcon",
  beaker: "BeakerIcon",
  hourglass: "HourglassIcon",
  flag: "FlagIcon",
  cloudhollow: "CloudHollowIcon",
  edit: "EditIcon",
  cog: "CogIcon",
  nut: "NutIcon",
  wrench: "WrenchIcon",
  ellipsis: "EllipsisIcon",
  check: "CheckIcon",
  form: "FormIcon",
  batchdeny: "BatchDenyIcon",
  batchaccept: "BatchAcceptIcon",
  controls: "ControlsIcon",
  plus: "PlusIcon",
  closeAlt: "CloseAltIcon",
  cross: "CrossIcon",
  trash: "TrashIcon",
  pinalt: "PinAltIcon",
  unpin: "UnpinIcon",
  add: "AddIcon",
  subtract: "SubtractIcon",
  close: "CloseIcon",
  delete: "DeleteIcon",
  passed: "PassedIcon",
  changed: "ChangedIcon",
  failed: "FailedIcon",
  clear: "ClearIcon",
  comment: "CommentIcon",
  commentadd: "CommentAddIcon",
  requestchange: "RequestChangeIcon",
  comments: "CommentsIcon",
  lock: "LockIcon",
  unlock: "UnlockIcon",
  key: "KeyIcon",
  outbox: "OutboxIcon",
  credit: "CreditIcon",
  button: "ButtonIcon",
  type: "TypeIcon",
  pointerdefault: "PointerDefaultIcon",
  pointerhand: "PointerHandIcon",
  browser: "BrowserIcon",
  tablet: "TabletIcon",
  mobile: "MobileIcon",
  watch: "WatchIcon",
  sidebar: "SidebarIcon",
  sidebaralt: "SidebarAltIcon",
  sidebaralttoggle: "SidebarAltToggleIcon",
  sidebartoggle: "SidebarToggleIcon",
  bottombar: "BottomBarIcon",
  bottombartoggle: "BottomBarToggleIcon",
  cpu: "CPUIcon",
  database: "DatabaseIcon",
  memory: "MemoryIcon",
  structure: "StructureIcon",
  box: "BoxIcon",
  power: "PowerIcon",
  photo: "PhotoIcon",
  component: "ComponentIcon",
  grid: "GridIcon",
  outline: "OutlineIcon",
  photodrag: "PhotoDragIcon",
  search: "SearchIcon",
  zoom: "ZoomIcon",
  zoomout: "ZoomOutIcon",
  zoomreset: "ZoomResetIcon",
  eye: "EyeIcon",
  eyeclose: "EyeCloseIcon",
  lightning: "LightningIcon",
  lightningoff: "LightningOffIcon",
  contrast: "ContrastIcon",
  switchalt: "SwitchAltIcon",
  mirror: "MirrorIcon",
  grow: "GrowIcon",
  paintbrush: "PaintBrushIcon",
  ruler: "RulerIcon",
  stop: "StopIcon",
  camera: "CameraIcon",
  video: "VideoIcon",
  speaker: "SpeakerIcon",
  play: "PlayIcon",
  playback: "PlayBackIcon",
  playnext: "PlayNextIcon",
  rewind: "RewindIcon",
  fastforward: "FastForwardIcon",
  stopalt: "StopAltIcon",
  sidebyside: "SideBySideIcon",
  stacked: "StackedIcon",
  sun: "SunIcon",
  moon: "MoonIcon",
  book: "BookIcon",
  document: "DocumentIcon",
  copy: "CopyIcon",
  category: "CategoryIcon",
  folder: "FolderIcon",
  print: "PrintIcon",
  graphline: "GraphLineIcon",
  calendar: "CalendarIcon",
  graphbar: "GraphBarIcon",
  menu: "MenuIcon",
  menualt: "MenuIcon",
  filter: "FilterIcon",
  docchart: "DocChartIcon",
  doclist: "DocListIcon",
  markup: "MarkupIcon",
  bold: "BoldIcon",
  paperclip: "PaperClipIcon",
  listordered: "ListOrderedIcon",
  listunordered: "ListUnorderedIcon",
  paragraph: "ParagraphIcon",
  markdown: "MarkdownIcon",
  repository: "RepoIcon",
  commit: "CommitIcon",
  branch: "BranchIcon",
  pullrequest: "PullRequestIcon",
  merge: "MergeIcon",
  apple: "AppleIcon",
  linux: "LinuxIcon",
  ubuntu: "UbuntuIcon",
  windows: "WindowsIcon",
  storybook: "StorybookIcon",
  azuredevops: "AzureDevOpsIcon",
  bitbucket: "BitbucketIcon",
  chrome: "ChromeIcon",
  chromatic: "ChromaticIcon",
  componentdriven: "ComponentDrivenIcon",
  discord: "DiscordIcon",
  facebook: "FacebookIcon",
  figma: "FigmaIcon",
  gdrive: "GDriveIcon",
  github: "GithubIcon",
  gitlab: "GitlabIcon",
  google: "GoogleIcon",
  graphql: "GraphqlIcon",
  medium: "MediumIcon",
  redux: "ReduxIcon",
  twitter: "TwitterIcon",
  youtube: "YoutubeIcon",
  vscode: "VSCodeIcon"
};

// src/components/brand/StorybookLogo.tsx
import _t from "react";
var m_ = /* @__PURE__ */ a(({ alt: e, ...t }) => /* @__PURE__ */ _t.createElement("svg", { width: "200px", height: "40px", viewBox: "0 0 200\
 40", ...t, role: "img" }, e ? /* @__PURE__ */ _t.createElement("title", null, e) : null, /* @__PURE__ */ _t.createElement("defs", null, /* @__PURE__ */ _t.
createElement(
  "path",
  {
    d: "M1.2 36.9L0 3.9c0-1.1.8-2 1.9-2.1l28-1.8a2 2 0 0 1 2.2 1.9 2 2 0 0 1 0 .1v36a2 2 0 0 1-2 2 2 2 0 0 1-.1 0L3.2 38.8a2 2 0 0 1-2-2z",
    id: "a"
  }
)), /* @__PURE__ */ _t.createElement("g", { fill: "none", fillRule: "evenodd" }, /* @__PURE__ */ _t.createElement(
  "path",
  {
    d: "M53.3 31.7c-1.7 0-3.4-.3-5-.7-1.5-.5-2.8-1.1-3.9-2l1.6-3.5c2.2 1.5 4.6 2.3 7.3 2.3 1.5 0 2.5-.2 3.3-.7.7-.5 1.1-1 1.1-1.9 0-.7-.3-1.\
3-1-1.7s-2-.8-3.7-1.2c-2-.4-3.6-.9-4.8-1.5-1.1-.5-2-1.2-2.6-2-.5-1-.8-2-.8-3.2 0-1.4.4-2.6 1.2-3.6.7-1.1 1.8-2 3.2-2.6 1.3-.6 2.9-.9 4.7-.9 \
1.6 0 3.1.3 4.6.7 1.5.5 2.7 1.1 3.5 2l-1.6 3.5c-2-1.5-4.2-2.3-6.5-2.3-1.3 0-2.3.2-3 .8-.8.5-1.2 1.1-1.2 2 0 .5.2 1 .5 1.3.2.3.7.6 1.4.9l2.9.\
8c2.9.6 5 1.4 6.2 2.4a5 5 0 0 1 2 4.2 6 6 0 0 1-2.5 5c-1.7 1.2-4 1.9-7 1.9zm21-3.6l1.4-.1-.2 3.5-1.9.1c-2.4 0-4.1-.5-5.2-1.5-1.1-1-1.6-2.7-1\
.6-4.8v-6h-3v-3.6h3V11h4.8v4.6h4v3.6h-4v6c0 1.8.9 2.8 2.6 2.8zm11.1 3.5c-1.6 0-3-.3-4.3-1a7 7 0 0 1-3-2.8c-.6-1.3-1-2.7-1-4.4 0-1.6.4-3 1-4.\
3a7 7 0 0 1 3-2.8c1.2-.7 2.7-1 4.3-1 1.7 0 3.2.3 4.4 1a7 7 0 0 1 3 2.8c.6 1.2 1 2.7 1 4.3 0 1.7-.4 3.1-1 4.4a7 7 0 0 1-3 2.8c-1.2.7-2.7 1-4.\
4 1zm0-3.6c2.4 0 3.6-1.6 3.6-4.6 0-1.5-.3-2.6-1-3.4a3.2 3.2 0 0 0-2.6-1c-2.3 0-3.5 1.4-3.5 4.4 0 3 1.2 4.6 3.5 4.6zm21.7-8.8l-2.7.3c-1.3.2-2\
.3.5-2.8 1.2-.6.6-.9 1.4-.9 2.5v8.2H96V15.7h4.6v2.6c.8-1.8 2.5-2.8 5-3h1.3l.3 4zm14-3.5h4.8L116.4 37h-4.9l3-6.6-6.4-14.8h5l4 10 4-10zm16-.4c\
1.4 0 2.6.3 3.6 1 1 .6 1.9 1.6 2.5 2.8.6 1.2.9 2.7.9 4.3 0 1.6-.3 3-1 4.3a6.9 6.9 0 0 1-2.4 2.9c-1 .7-2.2 1-3.6 1-1 0-2-.2-3-.7-.8-.4-1.5-1-\
2-1.9v2.4h-4.7V8.8h4.8v9c.5-.8 1.2-1.4 2-1.9.9-.4 1.8-.6 3-.6zM135.7 28c1.1 0 2-.4 2.6-1.2.6-.8 1-2 1-3.4 0-1.5-.4-2.5-1-3.3s-1.5-1.1-2.6-1.\
1-2 .3-2.6 1.1c-.6.8-1 2-1 3.3 0 1.5.4 2.6 1 3.4.6.8 1.5 1.2 2.6 1.2zm18.9 3.6c-1.7 0-3.2-.3-4.4-1a7 7 0 0 1-3-2.8c-.6-1.3-1-2.7-1-4.4 0-1.6\
.4-3 1-4.3a7 7 0 0 1 3-2.8c1.2-.7 2.7-1 4.4-1 1.6 0 3 .3 4.3 1a7 7 0 0 1 3 2.8c.6 1.2 1 2.7 1 4.3 0 1.7-.4 3.1-1 4.4a7 7 0 0 1-3 2.8c-1.2.7-\
2.7 1-4.3 1zm0-3.6c2.3 0 3.5-1.6 3.5-4.6 0-1.5-.3-2.6-1-3.4a3.2 3.2 0 0 0-2.5-1c-2.4 0-3.6 1.4-3.6 4.4 0 3 1.2 4.6 3.6 4.6zm18 3.6c-1.7 0-3.\
2-.3-4.4-1a7 7 0 0 1-3-2.8c-.6-1.3-1-2.7-1-4.4 0-1.6.4-3 1-4.3a7 7 0 0 1 3-2.8c1.2-.7 2.7-1 4.4-1 1.6 0 3 .3 4.4 1a7 7 0 0 1 2.9 2.8c.6 1.2 \
1 2.7 1 4.3 0 1.7-.4 3.1-1 4.4a7 7 0 0 1-3 2.8c-1.2.7-2.7 1-4.3 1zm0-3.6c2.3 0 3.5-1.6 3.5-4.6 0-1.5-.3-2.6-1-3.4a3.2 3.2 0 0 0-2.5-1c-2.4 0\
-3.6 1.4-3.6 4.4 0 3 1.2 4.6 3.6 4.6zm27.4 3.4h-6l-6-7v7h-4.8V8.8h4.9v13.6l5.8-6.7h5.7l-6.6 7.5 7 8.2z",
    fill: "currentColor"
  }
), /* @__PURE__ */ _t.createElement("mask", { id: "b", fill: "#fff" }, /* @__PURE__ */ _t.createElement("use", { xlinkHref: "#a" })), /* @__PURE__ */ _t.
createElement("use", { fill: "#FF4785", fillRule: "nonzero", xlinkHref: "#a" }), /* @__PURE__ */ _t.createElement(
  "path",
  {
    d: "M23.7 5L24 .2l3.9-.3.1 4.8a.3.3 0 0 1-.5.2L26 3.8l-1.7 1.4a.3.3 0 0 1-.5-.3zm-5 10c0 .9 5.3.5 6 0 0-5.4-2.8-8.2-8-8.2-5.3 0-8.2 2.8-\
8.2 7.1 0 7.4 10 7.6 10 11.6 0 1.2-.5 1.9-1.8 1.9-1.6 0-2.2-.9-2.1-3.6 0-.6-6.1-.8-6.3 0-.5 6.7 3.7 8.6 8.5 8.6 4.6 0 8.3-2.5 8.3-7 0-7.9-10\
.2-7.7-10.2-11.6 0-1.6 1.2-1.8 2-1.8.6 0 2 0 1.9 3z",
    fill: "#FFF",
    fillRule: "nonzero",
    mask: "url(#b)"
  }
))), "StorybookLogo");

// src/components/brand/StorybookIcon.tsx
import aa from "react";
var g_ = /* @__PURE__ */ a((e) => /* @__PURE__ */ aa.createElement("svg", { viewBox: "0 0 64 64", ...e }, /* @__PURE__ */ aa.createElement("\
title", null, "Storybook icon"), /* @__PURE__ */ aa.createElement("g", { id: "Artboard", stroke: "none", strokeWidth: "1", fill: "none", fillRule: "\
evenodd" }, /* @__PURE__ */ aa.createElement(
  "path",
  {
    d: "M8.04798541,58.7875918 L6.07908839,6.32540407 C6.01406344,4.5927838 7.34257463,3.12440831 9.07303814,3.01625434 L53.6958037,0.227331\
489 C55.457209,0.117243658 56.974354,1.45590096 57.0844418,3.21730626 C57.0885895,3.28366922 57.0906648,3.35014546 57.0906648,3.41663791 L57\
.0906648,60.5834697 C57.0906648,62.3483119 55.6599776,63.7789992 53.8951354,63.7789992 C53.847325,63.7789992 53.7995207,63.7779262 53.751758\
5,63.775781 L11.0978899,61.8600599 C9.43669044,61.7854501 8.11034889,60.4492961 8.04798541,58.7875918 Z",
    id: "path-1",
    fill: "#FF4785",
    fillRule: "nonzero"
  }
), /* @__PURE__ */ aa.createElement(
  "path",
  {
    d: "M35.9095005,24.1768792 C35.9095005,25.420127 44.2838488,24.8242707 45.4080313,23.9509748 C45.4080313,15.4847538 40.8652557,11.035887\
8 32.5466666,11.0358878 C24.2280775,11.0358878 19.5673077,15.553972 19.5673077,22.3311017 C19.5673077,34.1346028 35.4965208,34.3605071 35.49\
65208,40.7987804 C35.4965208,42.606015 34.6115646,43.6790606 32.6646607,43.6790606 C30.127786,43.6790606 29.1248356,42.3834613 29.2428298,37\
.9783269 C29.2428298,37.0226907 19.5673077,36.7247626 19.2723223,37.9783269 C18.5211693,48.6535354 25.1720308,51.7326752 32.7826549,51.73267\
52 C40.1572906,51.7326752 45.939005,47.8018145 45.939005,40.6858282 C45.939005,28.035186 29.7738035,28.3740425 29.7738035,22.1051974 C29.773\
8035,19.5637737 31.6617103,19.2249173 32.7826549,19.2249173 C33.9625966,19.2249173 36.0864917,19.4328883 35.9095005,24.1768792 Z",
    id: "path9_fill-path",
    fill: "#FFFFFF",
    fillRule: "nonzero"
  }
), /* @__PURE__ */ aa.createElement(
  "path",
  {
    d: "M44.0461638,0.830433986 L50.1874092,0.446606143 L50.443532,7.7810017 C50.4527198,8.04410717 50.2468789,8.26484453 49.9837734,8.27403\
237 C49.871115,8.27796649 49.7607078,8.24184808 49.6721567,8.17209069 L47.3089847,6.3104681 L44.5110468,8.43287463 C44.3012992,8.591981 44.0\
022839,8.55092814 43.8431776,8.34118051 C43.7762017,8.25288717 43.742082,8.14401677 43.7466857,8.03329059 L44.0461638,0.830433986 Z",
    id: "Path",
    fill: "#FFFFFF"
  }
))), "StorybookIcon");

// src/components/components/Loader/Loader.tsx
import er from "react";
import { keyframes as w_, styled as mn } from "@storybook/core/theming";

// src/components/components/shared/animation.ts
import { keyframes as v_ } from "@storybook/core/theming";
var q3 = v_`
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
`;

// src/components/components/Loader/Loader.tsx
var b_ = mn.div(({ size: e = 32 }) => ({
  borderRadius: "50%",
  cursor: "progress",
  display: "inline-block",
  overflow: "hidden",
  position: "absolute",
  transition: "all 200ms ease-out",
  verticalAlign: "top",
  top: "50%",
  left: "50%",
  marginTop: -(e / 2),
  marginLeft: -(e / 2),
  height: e,
  width: e,
  zIndex: 4,
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: "rgba(97, 97, 97, 0.29)",
  borderTopColor: "rgb(100,100,100)",
  animation: `${q3} 0.7s linear infinite`,
  mixBlendMode: "difference"
})), U3 = mn.div({
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%"
}), y_ = mn.div(({ theme: e }) => ({
  position: "relative",
  width: "80%",
  marginBottom: "0.75rem",
  maxWidth: 300,
  height: 5,
  borderRadius: 5,
  background: Le(0.8, e.color.secondary),
  overflow: "hidden",
  cursor: "progress"
})), D_ = mn.div(({ theme: e }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  background: e.color.secondary
})), G3 = mn.div(({ theme: e }) => ({
  minHeight: "2em",
  fontSize: `${e.typography.size.s1}px`,
  color: e.textMutedColor
})), x_ = mn(ju)(({ theme: e }) => ({
  width: 20,
  height: 20,
  marginBottom: "0.5rem",
  color: e.textMutedColor
})), C_ = w_`
  from { content: "..." }
  33% { content: "." }
  66% { content: ".." }
  to { content: "..." }
`, E_ = mn.span({
  "&::after": {
    content: "'...'",
    animation: `${C_} 1s linear infinite`,
    animationDelay: "1s",
    display: "inline-block",
    width: "1em",
    height: "auto"
  }
}), R_ = /* @__PURE__ */ a(({ progress: e, error: t, size: r, ...n }) => {
  if (t)
    return /* @__PURE__ */ er.createElement(U3, { "aria-label": t.toString(), "aria-live": "polite", role: "status", ...n }, /* @__PURE__ */ er.
    createElement(x_, null), /* @__PURE__ */ er.createElement(G3, null, t.message));
  if (e) {
    let { value: o, modules: i } = e, { message: l } = e;
    return i && (l += ` ${i.complete} / ${i.total} modules`), /* @__PURE__ */ er.createElement(
      U3,
      {
        "aria-label": "Content is loading...",
        "aria-live": "polite",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": o * 100,
        "aria-valuetext": l,
        role: "progressbar",
        ...n
      },
      /* @__PURE__ */ er.createElement(y_, null, /* @__PURE__ */ er.createElement(D_, { style: { width: `${o * 100}%` } })),
      /* @__PURE__ */ er.createElement(G3, null, l, o < 1 && /* @__PURE__ */ er.createElement(E_, { key: l }))
    );
  }
  return /* @__PURE__ */ er.createElement(
    b_,
    {
      "aria-label": "Content is loading...",
      "aria-live": "polite",
      role: "status",
      size: r,
      ...n
    }
  );
}, "Loader");

// src/components/components/ProgressSpinner/ProgressSpinner.tsx
import Rr from "react";
import { keyframes as S_, styled as X3 } from "@storybook/core/theming";
var sp = "http://www.w3.org/2000/svg", A_ = S_({
  "0%": {
    transform: "rotate(0deg)"
  },
  "100%": {
    transform: "rotate(360deg)"
  }
}), Y3 = X3.div(({ size: e }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  minWidth: e,
  minHeight: e
})), up = X3.svg(
  ({ size: e, width: t }) => ({
    position: "absolute",
    width: `${e}px!important`,
    height: `${e}px!important`,
    transform: "rotate(-90deg)",
    circle: {
      r: (e - Math.ceil(t)) / 2,
      cx: e / 2,
      cy: e / 2,
      opacity: 0.15,
      fill: "transparent",
      stroke: "currentColor",
      strokeWidth: t,
      strokeLinecap: "round",
      strokeDasharray: Math.PI * (e - Math.ceil(t))
    }
  }),
  ({ progress: e }) => e && {
    circle: {
      opacity: 0.75
    }
  },
  ({ spinner: e }) => e && {
    animation: `${A_} 1s linear infinite`,
    circle: {
      opacity: 0.25
    }
  }
), F_ = /* @__PURE__ */ a(({
  percentage: e = void 0,
  running: t = !0,
  size: r = 24,
  width: n = 1.5,
  children: o = null,
  ...i
}) => typeof e == "number" ? /* @__PURE__ */ Rr.createElement(Y3, { size: r, ...i }, o, /* @__PURE__ */ Rr.createElement(up, { size: r, width: n,
xmlns: sp }, /* @__PURE__ */ Rr.createElement("circle", null)), t && /* @__PURE__ */ Rr.createElement(up, { size: r, width: n, xmlns: sp, spinner: !0 },
/* @__PURE__ */ Rr.createElement("circle", { strokeDashoffset: Math.PI * (r - Math.ceil(n)) * (1 - e / 100) })), /* @__PURE__ */ Rr.createElement(
up, { size: r, width: n, xmlns: sp, progress: !0 }, /* @__PURE__ */ Rr.createElement("circle", { strokeDashoffset: Math.PI * (r - Math.ceil(
n)) * (1 - e / 100) }))) : /* @__PURE__ */ Rr.createElement(Y3, { size: r, ...i }, o), "ProgressSpinner");

// src/components/components/utils/getStoryHref.ts
function k_(e) {
  let t = {}, r = e.split("&");
  for (let n = 0; n < r.length; n++) {
    let o = r[n].split("=");
    t[decodeURIComponent(o[0])] = decodeURIComponent(o[1] || "");
  }
  return t;
}
a(k_, "parseQuery");
var L_ = /* @__PURE__ */ a((e, t, r = {}) => {
  let [n, o] = e.split("?"), i = o ? {
    ...k_(o),
    ...r,
    id: t
  } : {
    ...r,
    id: t
  };
  return `${n}?${Object.entries(i).map((l) => `${l[0]}=${l[1]}`).join("&")}`;
}, "getStoryHref");

// src/components/components/clipboard/ClipboardCode.tsx
import T_ from "react";
import { color as I_, styled as B_, typography as Z3 } from "@storybook/core/theming";
var M_ = B_.pre`
  line-height: 18px;
  padding: 11px 1rem;
  white-space: pre-wrap;
  background: rgba(0, 0, 0, 0.05);
  color: ${I_.darkest};
  border-radius: 3px;
  margin: 1rem 0;
  width: 100%;
  display: block;
  overflow: hidden;
  font-family: ${Z3.fonts.mono};
  font-size: ${Z3.size.s2 - 1}px;
`, __ = /* @__PURE__ */ a(({ code: e, ...t }) => /* @__PURE__ */ T_.createElement(M_, { id: "clipboard-code", ...t }, e), "ClipboardCode");

// src/components/index.ts
var gee = Vu, z_ = {};
Object.keys(Vu).forEach((e) => {
  z_[e] = H_((t, r) => P_(e, { ...t, ref: r }));
});
export {
  Ds as A,
  pu as ActionBar,
  i_ as AddonPanel,
  wy as Badge,
  K1 as Bar,
  xs as Blockquote,
  jo as Button,
  __ as ClipboardCode,
  Cu as Code,
  Eu as DL,
  Ru as Div,
  Jx as DocumentWrapper,
  Q1 as EmptyTabContent,
  II as ErrorFormatter,
  rs as FlexBar,
  QI as Form,
  Su as H1,
  Au as H2,
  Fu as H3,
  ku as H4,
  Lu as H5,
  Tu as H6,
  Iu as HR,
  zl as IconButton,
  IM as IconButtonSkeleton,
  f_ as Icons,
  Bu as Img,
  Mu as LI,
  Yu as Link,
  G1 as ListItem,
  R_ as Loader,
  nI as Modal,
  _u as OL,
  Pu as P,
  fI as Placeholder,
  Hu as Pre,
  F_ as ProgressSpinner,
  kp as ResetWrapper,
  Fn as ScrollArea,
  ip as Separator,
  sI as Spaced,
  zu as Span,
  g_ as StorybookIcon,
  m_ as StorybookLogo,
  h_ as Symbols,
  Og as SyntaxHighlighter,
  Ou as TT,
  op as TabBar,
  fn as TabButton,
  KM as TabWrapper,
  Nu as Table,
  ap as Tabs,
  rp as TabsState,
  Y1 as TooltipLinkList,
  oM as TooltipMessage,
  sM as TooltipNote,
  $u as UL,
  ZB as WithTooltip,
  JB as WithTooltipPure,
  EI as Zoom,
  Pt as codeCommon,
  gee as components,
  Du as createCopyToClipboardFunction,
  L_ as getStoryHref,
  ss as icons,
  e_ as interleaveSeparators,
  te as nameSpaceClassNames,
  z_ as resetComponents,
  N as withReset
};
