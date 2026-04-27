"use strict";
var rw = Object.create;
var $i = Object.defineProperty;
var iw = Object.getOwnPropertyDescriptor;
var nw = Object.getOwnPropertyNames;
var sw = Object.getPrototypeOf, ow = Object.prototype.hasOwnProperty;
var s = (e, t) => $i(e, "name", { value: t, configurable: !0 });
var b = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), aw = (e, t) => {
  for (var r in t)
    $i(e, r, { get: t[r], enumerable: !0 });
}, qd = (e, t, r, i) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let n of nw(t))
      !ow.call(e, n) && n !== r && $i(e, n, { get: () => t[n], enumerable: !(i = iw(t, n)) || i.enumerable });
  return e;
};
var re = (e, t, r) => (r = e != null ? rw(sw(e)) : {}, qd(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  t || !e || !e.__esModule ? $i(r, "default", { value: e, enumerable: !0 }) : r,
  e
)), uw = (e) => qd($i({}, "__esModule", { value: !0 }), e);

// ../node_modules/prompts/node_modules/kleur/index.js
var ge = b((Y8, Zd) => {
  "use strict";
  var { FORCE_COLOR: pw, NODE_DISABLE_COLORS: Dw, TERM: mw } = process.env, ie = {
    enabled: !Dw && mw !== "dumb" && pw !== "0",
    // modifiers
    reset: se(0, 0),
    bold: se(1, 22),
    dim: se(2, 22),
    italic: se(3, 23),
    underline: se(4, 24),
    inverse: se(7, 27),
    hidden: se(8, 28),
    strikethrough: se(9, 29),
    // colors
    black: se(30, 39),
    red: se(31, 39),
    green: se(32, 39),
    yellow: se(33, 39),
    blue: se(34, 39),
    magenta: se(35, 39),
    cyan: se(36, 39),
    white: se(37, 39),
    gray: se(90, 39),
    grey: se(90, 39),
    // background colors
    bgBlack: se(40, 49),
    bgRed: se(41, 49),
    bgGreen: se(42, 49),
    bgYellow: se(43, 49),
    bgBlue: se(44, 49),
    bgMagenta: se(45, 49),
    bgCyan: se(46, 49),
    bgWhite: se(47, 49)
  };
  function Vd(e, t) {
    let r = 0, i, n = "", o = "";
    for (; r < e.length; r++)
      i = e[r], n += i.open, o += i.close, t.includes(i.close) && (t = t.replace(i.rgx, i.close + i.open));
    return n + t + o;
  }
  s(Vd, "run");
  function gw(e, t) {
    let r = { has: e, keys: t };
    return r.reset = ie.reset.bind(r), r.bold = ie.bold.bind(r), r.dim = ie.dim.bind(r), r.italic = ie.italic.bind(r), r.underline = ie.underline.
    bind(r), r.inverse = ie.inverse.bind(r), r.hidden = ie.hidden.bind(r), r.strikethrough = ie.strikethrough.bind(r), r.black = ie.black.bind(
    r), r.red = ie.red.bind(r), r.green = ie.green.bind(r), r.yellow = ie.yellow.bind(r), r.blue = ie.blue.bind(r), r.magenta = ie.magenta.bind(
    r), r.cyan = ie.cyan.bind(r), r.white = ie.white.bind(r), r.gray = ie.gray.bind(r), r.grey = ie.grey.bind(r), r.bgBlack = ie.bgBlack.bind(
    r), r.bgRed = ie.bgRed.bind(r), r.bgGreen = ie.bgGreen.bind(r), r.bgYellow = ie.bgYellow.bind(r), r.bgBlue = ie.bgBlue.bind(r), r.bgMagenta =
    ie.bgMagenta.bind(r), r.bgCyan = ie.bgCyan.bind(r), r.bgWhite = ie.bgWhite.bind(r), r;
  }
  s(gw, "chain");
  function se(e, t) {
    let r = {
      open: `\x1B[${e}m`,
      close: `\x1B[${t}m`,
      rgx: new RegExp(`\\x1b\\[${t}m`, "g")
    };
    return function(i) {
      return this !== void 0 && this.has !== void 0 ? (this.has.includes(e) || (this.has.push(e), this.keys.push(r)), i === void 0 ? this : ie.
      enabled ? Vd(this.keys, i + "") : i + "") : i === void 0 ? gw([e], [r]) : ie.enabled ? Vd([r], i + "") : i + "";
    };
  }
  s(se, "init");
  Zd.exports = ie;
});

// ../node_modules/prompts/dist/util/action.js
var Gd = b((X8, zd) => {
  "use strict";
  zd.exports = (e, t) => {
    if (!(e.meta && e.name !== "escape")) {
      if (e.ctrl) {
        if (e.name === "a") return "first";
        if (e.name === "c" || e.name === "d") return "abort";
        if (e.name === "e") return "last";
        if (e.name === "g") return "reset";
      }
      if (t) {
        if (e.name === "j") return "down";
        if (e.name === "k") return "up";
      }
      return e.name === "return" || e.name === "enter" ? "submit" : e.name === "backspace" ? "delete" : e.name === "delete" ? "deleteForward" :
      e.name === "abort" ? "abort" : e.name === "escape" ? "exit" : e.name === "tab" ? "next" : e.name === "pagedown" ? "nextPage" : e.name ===
      "pageup" ? "prevPage" : e.name === "home" ? "home" : e.name === "end" ? "end" : e.name === "up" ? "up" : e.name === "down" ? "down" : e.
      name === "right" ? "right" : e.name === "left" ? "left" : !1;
    }
  };
});

// ../node_modules/prompts/dist/util/strip.js
var fs = b((Q8, Kd) => {
  "use strict";
  Kd.exports = (e) => {
    let t = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"].join("|"), r = new RegExp(t, "g");
    return typeof e == "string" ? e.replace(r, "") : e;
  };
});

// ../node_modules/sisteransi/src/index.js
var be = b((eP, Yd) => {
  "use strict";
  var xa = "\x1B", ye = `${xa}[`, yw = "\x07", Fa = {
    to(e, t) {
      return t ? `${ye}${t + 1};${e + 1}H` : `${ye}${e + 1}G`;
    },
    move(e, t) {
      let r = "";
      return e < 0 ? r += `${ye}${-e}D` : e > 0 && (r += `${ye}${e}C`), t < 0 ? r += `${ye}${-t}A` : t > 0 && (r += `${ye}${t}B`), r;
    },
    up: /* @__PURE__ */ s((e = 1) => `${ye}${e}A`, "up"),
    down: /* @__PURE__ */ s((e = 1) => `${ye}${e}B`, "down"),
    forward: /* @__PURE__ */ s((e = 1) => `${ye}${e}C`, "forward"),
    backward: /* @__PURE__ */ s((e = 1) => `${ye}${e}D`, "backward"),
    nextLine: /* @__PURE__ */ s((e = 1) => `${ye}E`.repeat(e), "nextLine"),
    prevLine: /* @__PURE__ */ s((e = 1) => `${ye}F`.repeat(e), "prevLine"),
    left: `${ye}G`,
    hide: `${ye}?25l`,
    show: `${ye}?25h`,
    save: `${xa}7`,
    restore: `${xa}8`
  }, bw = {
    up: /* @__PURE__ */ s((e = 1) => `${ye}S`.repeat(e), "up"),
    down: /* @__PURE__ */ s((e = 1) => `${ye}T`.repeat(e), "down")
  }, vw = {
    screen: `${ye}2J`,
    up: /* @__PURE__ */ s((e = 1) => `${ye}1J`.repeat(e), "up"),
    down: /* @__PURE__ */ s((e = 1) => `${ye}J`.repeat(e), "down"),
    line: `${ye}2K`,
    lineEnd: `${ye}K`,
    lineStart: `${ye}1K`,
    lines(e) {
      let t = "";
      for (let r = 0; r < e; r++)
        t += this.line + (r < e - 1 ? Fa.up() : "");
      return e && (t += Fa.left), t;
    }
  };
  Yd.exports = { cursor: Fa, scroll: bw, erase: vw, beep: yw };
});

// ../node_modules/prompts/dist/util/clear.js
var tf = b((rP, ef) => {
  "use strict";
  function _w(e, t) {
    var r = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
    if (!r) {
      if (Array.isArray(e) || (r = ww(e)) || t && e && typeof e.length == "number") {
        r && (e = r);
        var i = 0, n = /* @__PURE__ */ s(function() {
        }, "F");
        return { s: n, n: /* @__PURE__ */ s(function() {
          return i >= e.length ? { done: !0 } : { done: !1, value: e[i++] };
        }, "n"), e: /* @__PURE__ */ s(function(c) {
          throw c;
        }, "e"), f: n };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    var o = !0, a = !1, u;
    return { s: /* @__PURE__ */ s(function() {
      r = r.call(e);
    }, "s"), n: /* @__PURE__ */ s(function() {
      var c = r.next();
      return o = c.done, c;
    }, "n"), e: /* @__PURE__ */ s(function(c) {
      a = !0, u = c;
    }, "e"), f: /* @__PURE__ */ s(function() {
      try {
        !o && r.return != null && r.return();
      } finally {
        if (a) throw u;
      }
    }, "f") };
  }
  s(_w, "_createForOfIteratorHelper");
  function ww(e, t) {
    if (e) {
      if (typeof e == "string") return Jd(e, t);
      var r = Object.prototype.toString.call(e).slice(8, -1);
      if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
      if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Jd(e, t);
    }
  }
  s(ww, "_unsupportedIterableToArray");
  function Jd(e, t) {
    (t == null || t > e.length) && (t = e.length);
    for (var r = 0, i = new Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  s(Jd, "_arrayLikeToArray");
  var Ew = fs(), Qd = be(), Xd = Qd.erase, Cw = Qd.cursor, xw = /* @__PURE__ */ s((e) => [...Ew(e)].length, "width");
  ef.exports = function(e, t) {
    if (!t) return Xd.line + Cw.to(0);
    let r = 0, i = e.split(/\r?\n/);
    var n = _w(i), o;
    try {
      for (n.s(); !(o = n.n()).done; ) {
        let a = o.value;
        r += 1 + Math.floor(Math.max(xw(a) - 1, 0) / t);
      }
    } catch (a) {
      n.e(a);
    } finally {
      n.f();
    }
    return Xd.lines(r);
  };
});

// ../node_modules/prompts/dist/util/figures.js
var Sa = b((nP, rf) => {
  "use strict";
  var Wi = {
    arrowUp: "\u2191",
    arrowDown: "\u2193",
    arrowLeft: "\u2190",
    arrowRight: "\u2192",
    radioOn: "\u25C9",
    radioOff: "\u25EF",
    tick: "\u2714",
    cross: "\u2716",
    ellipsis: "\u2026",
    pointerSmall: "\u203A",
    line: "\u2500",
    pointer: "\u276F"
  }, Fw = {
    arrowUp: Wi.arrowUp,
    arrowDown: Wi.arrowDown,
    arrowLeft: Wi.arrowLeft,
    arrowRight: Wi.arrowRight,
    radioOn: "(*)",
    radioOff: "( )",
    tick: "\u221A",
    cross: "\xD7",
    ellipsis: "...",
    pointerSmall: "\xBB",
    line: "\u2500",
    pointer: ">"
  }, Sw = process.platform === "win32" ? Fw : Wi;
  rf.exports = Sw;
});

// ../node_modules/prompts/dist/util/style.js
var sf = b((sP, nf) => {
  "use strict";
  var Jr = ge(), cr = Sa(), Ta = Object.freeze({
    password: {
      scale: 1,
      render: /* @__PURE__ */ s((e) => "*".repeat(e.length), "render")
    },
    emoji: {
      scale: 2,
      render: /* @__PURE__ */ s((e) => "\u{1F603}".repeat(e.length), "render")
    },
    invisible: {
      scale: 0,
      render: /* @__PURE__ */ s((e) => "", "render")
    },
    default: {
      scale: 1,
      render: /* @__PURE__ */ s((e) => `${e}`, "render")
    }
  }), Tw = /* @__PURE__ */ s((e) => Ta[e] || Ta.default, "render"), Hi = Object.freeze({
    aborted: Jr.red(cr.cross),
    done: Jr.green(cr.tick),
    exited: Jr.yellow(cr.cross),
    default: Jr.cyan("?")
  }), Aw = /* @__PURE__ */ s((e, t, r) => t ? Hi.aborted : r ? Hi.exited : e ? Hi.done : Hi.default, "symbol"), Rw = /* @__PURE__ */ s((e) => Jr.
  gray(e ? cr.ellipsis : cr.pointerSmall), "delimiter"), kw = /* @__PURE__ */ s((e, t) => Jr.gray(e ? t ? cr.pointerSmall : "+" : cr.line), "\
item");
  nf.exports = {
    styles: Ta,
    render: Tw,
    symbols: Hi,
    symbol: Aw,
    delimiter: Rw,
    item: kw
  };
});

// ../node_modules/prompts/dist/util/lines.js
var af = b((aP, of) => {
  "use strict";
  var Ow = fs();
  of.exports = function(e, t) {
    let r = String(Ow(e) || "").split(/\r?\n/);
    return t ? r.map((i) => Math.ceil(i.length / t)).reduce((i, n) => i + n) : r.length;
  };
});

// ../node_modules/prompts/dist/util/wrap.js
var lf = b((uP, uf) => {
  "use strict";
  uf.exports = (e, t = {}) => {
    let r = Number.isSafeInteger(parseInt(t.margin)) ? new Array(parseInt(t.margin)).fill(" ").join("") : t.margin || "", i = t.width;
    return (e || "").split(/\r?\n/g).map((n) => n.split(/\s+/g).reduce((o, a) => (a.length + r.length >= i || o[o.length - 1].length + a.length +
    1 < i ? o[o.length - 1] += ` ${a}` : o.push(`${r}${a}`), o), [r]).join(`
`)).join(`
`);
  };
});

// ../node_modules/prompts/dist/util/entriesToDisplay.js
var df = b((lP, cf) => {
  "use strict";
  cf.exports = (e, t, r) => {
    r = r || t;
    let i = Math.min(t - r, e - Math.floor(r / 2));
    i < 0 && (i = 0);
    let n = Math.min(i + r, t);
    return {
      startIndex: i,
      endIndex: n
    };
  };
});

// ../node_modules/prompts/dist/util/index.js
var tt = b((cP, ff) => {
  "use strict";
  ff.exports = {
    action: Gd(),
    clear: tf(),
    style: sf(),
    strip: fs(),
    figures: Sa(),
    lines: af(),
    wrap: lf(),
    entriesToDisplay: df()
  };
});

// ../node_modules/prompts/dist/elements/prompt.js
var wt = b((dP, Df) => {
  "use strict";
  var hf = require("readline"), Bw = tt(), Pw = Bw.action, Iw = require("events"), pf = be(), Mw = pf.beep, jw = pf.cursor, qw = ge(), Aa = class extends Iw {
    static {
      s(this, "Prompt");
    }
    constructor(t = {}) {
      super(), this.firstRender = !0, this.in = t.stdin || process.stdin, this.out = t.stdout || process.stdout, this.onRender = (t.onRender ||
      (() => {
      })).bind(this);
      let r = hf.createInterface({
        input: this.in,
        escapeCodeTimeout: 50
      });
      hf.emitKeypressEvents(this.in, r), this.in.isTTY && this.in.setRawMode(!0);
      let i = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1, n = /* @__PURE__ */ s((o, a) => {
        let u = Pw(a, i);
        u === !1 ? this._ && this._(o, a) : typeof this[u] == "function" ? this[u](a) : this.bell();
      }, "keypress");
      this.close = () => {
        this.out.write(jw.show), this.in.removeListener("keypress", n), this.in.isTTY && this.in.setRawMode(!1), r.close(), this.emit(this.aborted ?
        "abort" : this.exited ? "exit" : "submit", this.value), this.closed = !0;
      }, this.in.on("keypress", n);
    }
    fire() {
      this.emit("state", {
        value: this.value,
        aborted: !!this.aborted,
        exited: !!this.exited
      });
    }
    bell() {
      this.out.write(Mw);
    }
    render() {
      this.onRender(qw), this.firstRender && (this.firstRender = !1);
    }
  };
  Df.exports = Aa;
});

// ../node_modules/prompts/dist/elements/text.js
var vf = b((hP, bf) => {
  "use strict";
  function mf(e, t, r, i, n, o, a) {
    try {
      var u = e[o](a), l = u.value;
    } catch (c) {
      r(c);
      return;
    }
    u.done ? t(l) : Promise.resolve(l).then(i, n);
  }
  s(mf, "asyncGeneratorStep");
  function gf(e) {
    return function() {
      var t = this, r = arguments;
      return new Promise(function(i, n) {
        var o = e.apply(t, r);
        function a(l) {
          mf(o, i, n, a, u, "next", l);
        }
        s(a, "_next");
        function u(l) {
          mf(o, i, n, a, u, "throw", l);
        }
        s(u, "_throw"), a(void 0);
      });
    };
  }
  s(gf, "_asyncToGenerator");
  var hs = ge(), Lw = wt(), yf = be(), Nw = yf.erase, Vi = yf.cursor, ps = tt(), Ra = ps.style, ka = ps.clear, Uw = ps.lines, $w = ps.figures,
  Oa = class extends Lw {
    static {
      s(this, "TextPrompt");
    }
    constructor(t = {}) {
      super(t), this.transform = Ra.render(t.style), this.scale = this.transform.scale, this.msg = t.message, this.initial = t.initial || "",
      this.validator = t.validate || (() => !0), this.value = "", this.errorMsg = t.error || "Please Enter A Valid Value", this.cursor = +!!this.
      initial, this.cursorOffset = 0, this.clear = ka("", this.out.columns), this.render();
    }
    set value(t) {
      !t && this.initial ? (this.placeholder = !0, this.rendered = hs.gray(this.transform.render(this.initial))) : (this.placeholder = !1, this.
      rendered = this.transform.render(t)), this._value = t, this.fire();
    }
    get value() {
      return this._value;
    }
    reset() {
      this.value = "", this.cursor = +!!this.initial, this.cursorOffset = 0, this.fire(), this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.value = this.value || this.initial, this.done = this.aborted = !0, this.error = !1, this.red = !1, this.fire(), this.render(), this.
      out.write(`
`), this.close();
    }
    validate() {
      var t = this;
      return gf(function* () {
        let r = yield t.validator(t.value);
        typeof r == "string" && (t.errorMsg = r, r = !1), t.error = !r;
      })();
    }
    submit() {
      var t = this;
      return gf(function* () {
        if (t.value = t.value || t.initial, t.cursorOffset = 0, t.cursor = t.rendered.length, yield t.validate(), t.error) {
          t.red = !0, t.fire(), t.render();
          return;
        }
        t.done = !0, t.aborted = !1, t.fire(), t.render(), t.out.write(`
`), t.close();
      })();
    }
    next() {
      if (!this.placeholder) return this.bell();
      this.value = this.initial, this.cursor = this.rendered.length, this.fire(), this.render();
    }
    moveCursor(t) {
      this.placeholder || (this.cursor = this.cursor + t, this.cursorOffset += t);
    }
    _(t, r) {
      let i = this.value.slice(0, this.cursor), n = this.value.slice(this.cursor);
      this.value = `${i}${t}${n}`, this.red = !1, this.cursor = this.placeholder ? 0 : i.length + 1, this.render();
    }
    delete() {
      if (this.isCursorAtStart()) return this.bell();
      let t = this.value.slice(0, this.cursor - 1), r = this.value.slice(this.cursor);
      this.value = `${t}${r}`, this.red = !1, this.isCursorAtStart() ? this.cursorOffset = 0 : (this.cursorOffset++, this.moveCursor(-1)), this.
      render();
    }
    deleteForward() {
      if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
      let t = this.value.slice(0, this.cursor), r = this.value.slice(this.cursor + 1);
      this.value = `${t}${r}`, this.red = !1, this.isCursorAtEnd() ? this.cursorOffset = 0 : this.cursorOffset++, this.render();
    }
    first() {
      this.cursor = 0, this.render();
    }
    last() {
      this.cursor = this.value.length, this.render();
    }
    left() {
      if (this.cursor <= 0 || this.placeholder) return this.bell();
      this.moveCursor(-1), this.render();
    }
    right() {
      if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
      this.moveCursor(1), this.render();
    }
    isCursorAtStart() {
      return this.cursor === 0 || this.placeholder && this.cursor === 1;
    }
    isCursorAtEnd() {
      return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
    }
    render() {
      this.closed || (this.firstRender || (this.outputError && this.out.write(Vi.down(Uw(this.outputError, this.out.columns) - 1) + ka(this.
      outputError, this.out.columns)), this.out.write(ka(this.outputText, this.out.columns))), super.render(), this.outputError = "", this.outputText =
      [Ra.symbol(this.done, this.aborted), hs.bold(this.msg), Ra.delimiter(this.done), this.red ? hs.red(this.rendered) : this.rendered].join(
      " "), this.error && (this.outputError += this.errorMsg.split(`
`).reduce((t, r, i) => t + `
${i ? " " : $w.pointerSmall} ${hs.red().italic(r)}`, "")), this.out.write(Nw.line + Vi.to(0) + this.outputText + Vi.save + this.outputError +
      Vi.restore + Vi.move(this.cursorOffset, 0)));
    }
  };
  bf.exports = Oa;
});

// ../node_modules/prompts/dist/elements/select.js
var Cf = b((DP, Ef) => {
  "use strict";
  var Et = ge(), Ww = wt(), Zi = tt(), _f = Zi.style, wf = Zi.clear, Ds = Zi.figures, Hw = Zi.wrap, Vw = Zi.entriesToDisplay, Zw = be(), zw = Zw.
  cursor, Ba = class extends Ww {
    static {
      s(this, "SelectPrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.hint = t.hint || "- Use arrow-keys. Return to submit.", this.warn = t.warn || "- This option is d\
isabled", this.cursor = t.initial || 0, this.choices = t.choices.map((r, i) => (typeof r == "string" && (r = {
        title: r,
        value: i
      }), {
        title: r && (r.title || r.value || r),
        value: r && (r.value === void 0 ? i : r.value),
        description: r && r.description,
        selected: r && r.selected,
        disabled: r && r.disabled
      })), this.optionsPerPage = t.optionsPerPage || 10, this.value = (this.choices[this.cursor] || {}).value, this.clear = wf("", this.out.
      columns), this.render();
    }
    moveCursor(t) {
      this.cursor = t, this.value = this.choices[t].value, this.fire();
    }
    reset() {
      this.moveCursor(0), this.fire(), this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = !0, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    submit() {
      this.selection.disabled ? this.bell() : (this.done = !0, this.aborted = !1, this.fire(), this.render(), this.out.write(`
`), this.close());
    }
    first() {
      this.moveCursor(0), this.render();
    }
    last() {
      this.moveCursor(this.choices.length - 1), this.render();
    }
    up() {
      this.cursor === 0 ? this.moveCursor(this.choices.length - 1) : this.moveCursor(this.cursor - 1), this.render();
    }
    down() {
      this.cursor === this.choices.length - 1 ? this.moveCursor(0) : this.moveCursor(this.cursor + 1), this.render();
    }
    next() {
      this.moveCursor((this.cursor + 1) % this.choices.length), this.render();
    }
    _(t, r) {
      if (t === " ") return this.submit();
    }
    get selection() {
      return this.choices[this.cursor];
    }
    render() {
      if (this.closed) return;
      this.firstRender ? this.out.write(zw.hide) : this.out.write(wf(this.outputText, this.out.columns)), super.render();
      let t = Vw(this.cursor, this.choices.length, this.optionsPerPage), r = t.startIndex, i = t.endIndex;
      if (this.outputText = [_f.symbol(this.done, this.aborted), Et.bold(this.msg), _f.delimiter(!1), this.done ? this.selection.title : this.
      selection.disabled ? Et.yellow(this.warn) : Et.gray(this.hint)].join(" "), !this.done) {
        this.outputText += `
`;
        for (let n = r; n < i; n++) {
          let o, a, u = "", l = this.choices[n];
          n === r && r > 0 ? a = Ds.arrowUp : n === i - 1 && i < this.choices.length ? a = Ds.arrowDown : a = " ", l.disabled ? (o = this.cursor ===
          n ? Et.gray().underline(l.title) : Et.strikethrough().gray(l.title), a = (this.cursor === n ? Et.bold().gray(Ds.pointer) + " " : "\
  ") + a) : (o = this.cursor === n ? Et.cyan().underline(l.title) : l.title, a = (this.cursor === n ? Et.cyan(Ds.pointer) + " " : "  ") + a,
          l.description && this.cursor === n && (u = ` - ${l.description}`, (a.length + o.length + u.length >= this.out.columns || l.description.
          split(/\r?\n/).length > 1) && (u = `
` + Hw(l.description, {
            margin: 3,
            width: this.out.columns
          })))), this.outputText += `${a} ${o}${Et.gray(u)}
`;
        }
      }
      this.out.write(this.outputText);
    }
  };
  Ef.exports = Ba;
});

// ../node_modules/prompts/dist/elements/toggle.js
var Rf = b((gP, Af) => {
  "use strict";
  var ms = ge(), Gw = wt(), Sf = tt(), xf = Sf.style, Kw = Sf.clear, Tf = be(), Ff = Tf.cursor, Yw = Tf.erase, Pa = class extends Gw {
    static {
      s(this, "TogglePrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.value = !!t.initial, this.active = t.active || "on", this.inactive = t.inactive || "off", this.initialValue =
      this.value, this.render();
    }
    reset() {
      this.value = this.initialValue, this.fire(), this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = !0, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    submit() {
      this.done = !0, this.aborted = !1, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    deactivate() {
      if (this.value === !1) return this.bell();
      this.value = !1, this.render();
    }
    activate() {
      if (this.value === !0) return this.bell();
      this.value = !0, this.render();
    }
    delete() {
      this.deactivate();
    }
    left() {
      this.deactivate();
    }
    right() {
      this.activate();
    }
    down() {
      this.deactivate();
    }
    up() {
      this.activate();
    }
    next() {
      this.value = !this.value, this.fire(), this.render();
    }
    _(t, r) {
      if (t === " ")
        this.value = !this.value;
      else if (t === "1")
        this.value = !0;
      else if (t === "0")
        this.value = !1;
      else return this.bell();
      this.render();
    }
    render() {
      this.closed || (this.firstRender ? this.out.write(Ff.hide) : this.out.write(Kw(this.outputText, this.out.columns)), super.render(), this.
      outputText = [xf.symbol(this.done, this.aborted), ms.bold(this.msg), xf.delimiter(this.done), this.value ? this.inactive : ms.cyan().underline(
      this.inactive), ms.gray("/"), this.value ? ms.cyan().underline(this.active) : this.active].join(" "), this.out.write(Yw.line + Ff.to(0) +
      this.outputText));
    }
  };
  Af.exports = Pa;
});

// ../node_modules/prompts/dist/dateparts/datepart.js
var ut = b((bP, kf) => {
  "use strict";
  var Ia = class e {
    static {
      s(this, "DatePart");
    }
    constructor({
      token: t,
      date: r,
      parts: i,
      locales: n
    }) {
      this.token = t, this.date = r || /* @__PURE__ */ new Date(), this.parts = i || [this], this.locales = n || {};
    }
    up() {
    }
    down() {
    }
    next() {
      let t = this.parts.indexOf(this);
      return this.parts.find((r, i) => i > t && r instanceof e);
    }
    setTo(t) {
    }
    prev() {
      let t = [].concat(this.parts).reverse(), r = t.indexOf(this);
      return t.find((i, n) => n > r && i instanceof e);
    }
    toString() {
      return String(this.date);
    }
  };
  kf.exports = Ia;
});

// ../node_modules/prompts/dist/dateparts/meridiem.js
var Bf = b((_P, Of) => {
  "use strict";
  var Jw = ut(), Ma = class extends Jw {
    static {
      s(this, "Meridiem");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setHours((this.date.getHours() + 12) % 24);
    }
    down() {
      this.up();
    }
    toString() {
      let t = this.date.getHours() > 12 ? "pm" : "am";
      return /\A/.test(this.token) ? t.toUpperCase() : t;
    }
  };
  Of.exports = Ma;
});

// ../node_modules/prompts/dist/dateparts/day.js
var If = b((EP, Pf) => {
  "use strict";
  var Xw = ut(), Qw = /* @__PURE__ */ s((e) => (e = e % 10, e === 1 ? "st" : e === 2 ? "nd" : e === 3 ? "rd" : "th"), "pos"), ja = class extends Xw {
    static {
      s(this, "Day");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setDate(this.date.getDate() + 1);
    }
    down() {
      this.date.setDate(this.date.getDate() - 1);
    }
    setTo(t) {
      this.date.setDate(parseInt(t.substr(-2)));
    }
    toString() {
      let t = this.date.getDate(), r = this.date.getDay();
      return this.token === "DD" ? String(t).padStart(2, "0") : this.token === "Do" ? t + Qw(t) : this.token === "d" ? r + 1 : this.token ===
      "ddd" ? this.locales.weekdaysShort[r] : this.token === "dddd" ? this.locales.weekdays[r] : t;
    }
  };
  Pf.exports = ja;
});

// ../node_modules/prompts/dist/dateparts/hours.js
var jf = b((xP, Mf) => {
  "use strict";
  var eE = ut(), qa = class extends eE {
    static {
      s(this, "Hours");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setHours(this.date.getHours() + 1);
    }
    down() {
      this.date.setHours(this.date.getHours() - 1);
    }
    setTo(t) {
      this.date.setHours(parseInt(t.substr(-2)));
    }
    toString() {
      let t = this.date.getHours();
      return /h/.test(this.token) && (t = t % 12 || 12), this.token.length > 1 ? String(t).padStart(2, "0") : t;
    }
  };
  Mf.exports = qa;
});

// ../node_modules/prompts/dist/dateparts/milliseconds.js
var Lf = b((SP, qf) => {
  "use strict";
  var tE = ut(), La = class extends tE {
    static {
      s(this, "Milliseconds");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setMilliseconds(this.date.getMilliseconds() + 1);
    }
    down() {
      this.date.setMilliseconds(this.date.getMilliseconds() - 1);
    }
    setTo(t) {
      this.date.setMilliseconds(parseInt(t.substr(-this.token.length)));
    }
    toString() {
      return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
    }
  };
  qf.exports = La;
});

// ../node_modules/prompts/dist/dateparts/minutes.js
var Uf = b((AP, Nf) => {
  "use strict";
  var rE = ut(), Na = class extends rE {
    static {
      s(this, "Minutes");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setMinutes(this.date.getMinutes() + 1);
    }
    down() {
      this.date.setMinutes(this.date.getMinutes() - 1);
    }
    setTo(t) {
      this.date.setMinutes(parseInt(t.substr(-2)));
    }
    toString() {
      let t = this.date.getMinutes();
      return this.token.length > 1 ? String(t).padStart(2, "0") : t;
    }
  };
  Nf.exports = Na;
});

// ../node_modules/prompts/dist/dateparts/month.js
var Wf = b((kP, $f) => {
  "use strict";
  var iE = ut(), Ua = class extends iE {
    static {
      s(this, "Month");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setMonth(this.date.getMonth() + 1);
    }
    down() {
      this.date.setMonth(this.date.getMonth() - 1);
    }
    setTo(t) {
      t = parseInt(t.substr(-2)) - 1, this.date.setMonth(t < 0 ? 0 : t);
    }
    toString() {
      let t = this.date.getMonth(), r = this.token.length;
      return r === 2 ? String(t + 1).padStart(2, "0") : r === 3 ? this.locales.monthsShort[t] : r === 4 ? this.locales.months[t] : String(t +
      1);
    }
  };
  $f.exports = Ua;
});

// ../node_modules/prompts/dist/dateparts/seconds.js
var Vf = b((BP, Hf) => {
  "use strict";
  var nE = ut(), $a = class extends nE {
    static {
      s(this, "Seconds");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setSeconds(this.date.getSeconds() + 1);
    }
    down() {
      this.date.setSeconds(this.date.getSeconds() - 1);
    }
    setTo(t) {
      this.date.setSeconds(parseInt(t.substr(-2)));
    }
    toString() {
      let t = this.date.getSeconds();
      return this.token.length > 1 ? String(t).padStart(2, "0") : t;
    }
  };
  Hf.exports = $a;
});

// ../node_modules/prompts/dist/dateparts/year.js
var zf = b((IP, Zf) => {
  "use strict";
  var sE = ut(), Wa = class extends sE {
    static {
      s(this, "Year");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setFullYear(this.date.getFullYear() + 1);
    }
    down() {
      this.date.setFullYear(this.date.getFullYear() - 1);
    }
    setTo(t) {
      this.date.setFullYear(t.substr(-4));
    }
    toString() {
      let t = String(this.date.getFullYear()).padStart(4, "0");
      return this.token.length === 2 ? t.substr(-2) : t;
    }
  };
  Zf.exports = Wa;
});

// ../node_modules/prompts/dist/dateparts/index.js
var Kf = b((jP, Gf) => {
  "use strict";
  Gf.exports = {
    DatePart: ut(),
    Meridiem: Bf(),
    Day: If(),
    Hours: jf(),
    Milliseconds: Lf(),
    Minutes: Uf(),
    Month: Wf(),
    Seconds: Vf(),
    Year: zf()
  };
});

// ../node_modules/prompts/dist/elements/date.js
var sh = b((qP, nh) => {
  "use strict";
  function Yf(e, t, r, i, n, o, a) {
    try {
      var u = e[o](a), l = u.value;
    } catch (c) {
      r(c);
      return;
    }
    u.done ? t(l) : Promise.resolve(l).then(i, n);
  }
  s(Yf, "asyncGeneratorStep");
  function Jf(e) {
    return function() {
      var t = this, r = arguments;
      return new Promise(function(i, n) {
        var o = e.apply(t, r);
        function a(l) {
          Yf(o, i, n, a, u, "next", l);
        }
        s(a, "_next");
        function u(l) {
          Yf(o, i, n, a, u, "throw", l);
        }
        s(u, "_throw"), a(void 0);
      });
    };
  }
  s(Jf, "_asyncToGenerator");
  var Ha = ge(), oE = wt(), Za = tt(), Xf = Za.style, Qf = Za.clear, aE = Za.figures, ih = be(), uE = ih.erase, eh = ih.cursor, Ct = Kf(), th = Ct.
  DatePart, lE = Ct.Meridiem, cE = Ct.Day, dE = Ct.Hours, fE = Ct.Milliseconds, hE = Ct.Minutes, pE = Ct.Month, DE = Ct.Seconds, mE = Ct.Year,
  gE = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g, rh = {
    1: ({
      token: e
    }) => e.replace(/\\(.)/g, "$1"),
    2: (e) => new cE(e),
    // Day // TODO
    3: (e) => new pE(e),
    // Month
    4: (e) => new mE(e),
    // Year
    5: (e) => new lE(e),
    // AM/PM // TODO (special)
    6: (e) => new dE(e),
    // Hours
    7: (e) => new hE(e),
    // Minutes
    8: (e) => new DE(e),
    // Seconds
    9: (e) => new fE(e)
    // Fractional seconds
  }, yE = {
    months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
    monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
    weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
    weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
  }, Va = class extends oE {
    static {
      s(this, "DatePrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.cursor = 0, this.typed = "", this.locales = Object.assign(yE, t.locales), this._date = t.initial ||
      /* @__PURE__ */ new Date(), this.errorMsg = t.error || "Please Enter A Valid Value", this.validator = t.validate || (() => !0), this.mask =
      t.mask || "YYYY-MM-DD HH:mm:ss", this.clear = Qf("", this.out.columns), this.render();
    }
    get value() {
      return this.date;
    }
    get date() {
      return this._date;
    }
    set date(t) {
      t && this._date.setTime(t.getTime());
    }
    set mask(t) {
      let r;
      for (this.parts = []; r = gE.exec(t); ) {
        let n = r.shift(), o = r.findIndex((a) => a != null);
        this.parts.push(o in rh ? rh[o]({
          token: r[o] || n,
          date: this.date,
          parts: this.parts,
          locales: this.locales
        }) : r[o] || n);
      }
      let i = this.parts.reduce((n, o) => (typeof o == "string" && typeof n[n.length - 1] == "string" ? n[n.length - 1] += o : n.push(o), n),
      []);
      this.parts.splice(0), this.parts.push(...i), this.reset();
    }
    moveCursor(t) {
      this.typed = "", this.cursor = t, this.fire();
    }
    reset() {
      this.moveCursor(this.parts.findIndex((t) => t instanceof th)), this.fire(), this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = !0, this.error = !1, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    validate() {
      var t = this;
      return Jf(function* () {
        let r = yield t.validator(t.value);
        typeof r == "string" && (t.errorMsg = r, r = !1), t.error = !r;
      })();
    }
    submit() {
      var t = this;
      return Jf(function* () {
        if (yield t.validate(), t.error) {
          t.color = "red", t.fire(), t.render();
          return;
        }
        t.done = !0, t.aborted = !1, t.fire(), t.render(), t.out.write(`
`), t.close();
      })();
    }
    up() {
      this.typed = "", this.parts[this.cursor].up(), this.render();
    }
    down() {
      this.typed = "", this.parts[this.cursor].down(), this.render();
    }
    left() {
      let t = this.parts[this.cursor].prev();
      if (t == null) return this.bell();
      this.moveCursor(this.parts.indexOf(t)), this.render();
    }
    right() {
      let t = this.parts[this.cursor].next();
      if (t == null) return this.bell();
      this.moveCursor(this.parts.indexOf(t)), this.render();
    }
    next() {
      let t = this.parts[this.cursor].next();
      this.moveCursor(t ? this.parts.indexOf(t) : this.parts.findIndex((r) => r instanceof th)), this.render();
    }
    _(t) {
      /\d/.test(t) && (this.typed += t, this.parts[this.cursor].setTo(this.typed), this.render());
    }
    render() {
      this.closed || (this.firstRender ? this.out.write(eh.hide) : this.out.write(Qf(this.outputText, this.out.columns)), super.render(), this.
      outputText = [Xf.symbol(this.done, this.aborted), Ha.bold(this.msg), Xf.delimiter(!1), this.parts.reduce((t, r, i) => t.concat(i === this.
      cursor && !this.done ? Ha.cyan().underline(r.toString()) : r), []).join("")].join(" "), this.error && (this.outputText += this.errorMsg.
      split(`
`).reduce((t, r, i) => t + `
${i ? " " : aE.pointerSmall} ${Ha.red().italic(r)}`, "")), this.out.write(uE.line + eh.to(0) + this.outputText));
    }
  };
  nh.exports = Va;
});

// ../node_modules/prompts/dist/elements/number.js
var fh = b((NP, dh) => {
  "use strict";
  function oh(e, t, r, i, n, o, a) {
    try {
      var u = e[o](a), l = u.value;
    } catch (c) {
      r(c);
      return;
    }
    u.done ? t(l) : Promise.resolve(l).then(i, n);
  }
  s(oh, "asyncGeneratorStep");
  function ah(e) {
    return function() {
      var t = this, r = arguments;
      return new Promise(function(i, n) {
        var o = e.apply(t, r);
        function a(l) {
          oh(o, i, n, a, u, "next", l);
        }
        s(a, "_next");
        function u(l) {
          oh(o, i, n, a, u, "throw", l);
        }
        s(u, "_throw"), a(void 0);
      });
    };
  }
  s(ah, "_asyncToGenerator");
  var gs = ge(), bE = wt(), ch = be(), ys = ch.cursor, vE = ch.erase, bs = tt(), za = bs.style, _E = bs.figures, uh = bs.clear, wE = bs.lines,
  EE = /[0-9]/, Ga = /* @__PURE__ */ s((e) => e !== void 0, "isDef"), lh = /* @__PURE__ */ s((e, t) => {
    let r = Math.pow(10, t);
    return Math.round(e * r) / r;
  }, "round"), Ka = class extends bE {
    static {
      s(this, "NumberPrompt");
    }
    constructor(t = {}) {
      super(t), this.transform = za.render(t.style), this.msg = t.message, this.initial = Ga(t.initial) ? t.initial : "", this.float = !!t.float,
      this.round = t.round || 2, this.inc = t.increment || 1, this.min = Ga(t.min) ? t.min : -1 / 0, this.max = Ga(t.max) ? t.max : 1 / 0, this.
      errorMsg = t.error || "Please Enter A Valid Value", this.validator = t.validate || (() => !0), this.color = "cyan", this.value = "", this.
      typed = "", this.lastHit = 0, this.render();
    }
    set value(t) {
      !t && t !== 0 ? (this.placeholder = !0, this.rendered = gs.gray(this.transform.render(`${this.initial}`)), this._value = "") : (this.placeholder =
      !1, this.rendered = this.transform.render(`${lh(t, this.round)}`), this._value = lh(t, this.round)), this.fire();
    }
    get value() {
      return this._value;
    }
    parse(t) {
      return this.float ? parseFloat(t) : parseInt(t);
    }
    valid(t) {
      return t === "-" || t === "." && this.float || EE.test(t);
    }
    reset() {
      this.typed = "", this.value = "", this.fire(), this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      let t = this.value;
      this.value = t !== "" ? t : this.initial, this.done = this.aborted = !0, this.error = !1, this.fire(), this.render(), this.out.write(`\

`), this.close();
    }
    validate() {
      var t = this;
      return ah(function* () {
        let r = yield t.validator(t.value);
        typeof r == "string" && (t.errorMsg = r, r = !1), t.error = !r;
      })();
    }
    submit() {
      var t = this;
      return ah(function* () {
        if (yield t.validate(), t.error) {
          t.color = "red", t.fire(), t.render();
          return;
        }
        let r = t.value;
        t.value = r !== "" ? r : t.initial, t.done = !0, t.aborted = !1, t.error = !1, t.fire(), t.render(), t.out.write(`
`), t.close();
      })();
    }
    up() {
      if (this.typed = "", this.value === "" && (this.value = this.min - this.inc), this.value >= this.max) return this.bell();
      this.value += this.inc, this.color = "cyan", this.fire(), this.render();
    }
    down() {
      if (this.typed = "", this.value === "" && (this.value = this.min + this.inc), this.value <= this.min) return this.bell();
      this.value -= this.inc, this.color = "cyan", this.fire(), this.render();
    }
    delete() {
      let t = this.value.toString();
      if (t.length === 0) return this.bell();
      this.value = this.parse(t = t.slice(0, -1)) || "", this.value !== "" && this.value < this.min && (this.value = this.min), this.color =
      "cyan", this.fire(), this.render();
    }
    next() {
      this.value = this.initial, this.fire(), this.render();
    }
    _(t, r) {
      if (!this.valid(t)) return this.bell();
      let i = Date.now();
      if (i - this.lastHit > 1e3 && (this.typed = ""), this.typed += t, this.lastHit = i, this.color = "cyan", t === ".") return this.fire();
      this.value = Math.min(this.parse(this.typed), this.max), this.value > this.max && (this.value = this.max), this.value < this.min && (this.
      value = this.min), this.fire(), this.render();
    }
    render() {
      this.closed || (this.firstRender || (this.outputError && this.out.write(ys.down(wE(this.outputError, this.out.columns) - 1) + uh(this.
      outputError, this.out.columns)), this.out.write(uh(this.outputText, this.out.columns))), super.render(), this.outputError = "", this.outputText =
      [za.symbol(this.done, this.aborted), gs.bold(this.msg), za.delimiter(this.done), !this.done || !this.done && !this.placeholder ? gs[this.
      color]().underline(this.rendered) : this.rendered].join(" "), this.error && (this.outputError += this.errorMsg.split(`
`).reduce((t, r, i) => t + `
${i ? " " : _E.pointerSmall} ${gs.red().italic(r)}`, "")), this.out.write(vE.line + ys.to(0) + this.outputText + ys.save + this.outputError +
      ys.restore));
    }
  };
  dh.exports = Ka;
});

// ../node_modules/prompts/dist/elements/multiselect.js
var Ja = b(($P, Dh) => {
  "use strict";
  var lt = ge(), CE = be(), xE = CE.cursor, FE = wt(), zi = tt(), hh = zi.clear, Vt = zi.figures, ph = zi.style, SE = zi.wrap, TE = zi.entriesToDisplay,
  Ya = class extends FE {
    static {
      s(this, "MultiselectPrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.cursor = t.cursor || 0, this.scrollIndex = t.cursor || 0, this.hint = t.hint || "", this.warn = t.
      warn || "- This option is disabled -", this.minSelected = t.min, this.showMinError = !1, this.maxChoices = t.max, this.instructions = t.
      instructions, this.optionsPerPage = t.optionsPerPage || 10, this.value = t.choices.map((r, i) => (typeof r == "string" && (r = {
        title: r,
        value: i
      }), {
        title: r && (r.title || r.value || r),
        description: r && r.description,
        value: r && (r.value === void 0 ? i : r.value),
        selected: r && r.selected,
        disabled: r && r.disabled
      })), this.clear = hh("", this.out.columns), t.overrideRender || this.render();
    }
    reset() {
      this.value.map((t) => !t.selected), this.cursor = 0, this.fire(), this.render();
    }
    selected() {
      return this.value.filter((t) => t.selected);
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = !0, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    submit() {
      let t = this.value.filter((r) => r.selected);
      this.minSelected && t.length < this.minSelected ? (this.showMinError = !0, this.render()) : (this.done = !0, this.aborted = !1, this.fire(),
      this.render(), this.out.write(`
`), this.close());
    }
    first() {
      this.cursor = 0, this.render();
    }
    last() {
      this.cursor = this.value.length - 1, this.render();
    }
    next() {
      this.cursor = (this.cursor + 1) % this.value.length, this.render();
    }
    up() {
      this.cursor === 0 ? this.cursor = this.value.length - 1 : this.cursor--, this.render();
    }
    down() {
      this.cursor === this.value.length - 1 ? this.cursor = 0 : this.cursor++, this.render();
    }
    left() {
      this.value[this.cursor].selected = !1, this.render();
    }
    right() {
      if (this.value.filter((t) => t.selected).length >= this.maxChoices) return this.bell();
      this.value[this.cursor].selected = !0, this.render();
    }
    handleSpaceToggle() {
      let t = this.value[this.cursor];
      if (t.selected)
        t.selected = !1, this.render();
      else {
        if (t.disabled || this.value.filter((r) => r.selected).length >= this.maxChoices)
          return this.bell();
        t.selected = !0, this.render();
      }
    }
    toggleAll() {
      if (this.maxChoices !== void 0 || this.value[this.cursor].disabled)
        return this.bell();
      let t = !this.value[this.cursor].selected;
      this.value.filter((r) => !r.disabled).forEach((r) => r.selected = t), this.render();
    }
    _(t, r) {
      if (t === " ")
        this.handleSpaceToggle();
      else if (t === "a")
        this.toggleAll();
      else
        return this.bell();
    }
    renderInstructions() {
      return this.instructions === void 0 || this.instructions ? typeof this.instructions == "string" ? this.instructions : `
Instructions:
    ${Vt.arrowUp}/${Vt.arrowDown}: Highlight option
    ${Vt.arrowLeft}/${Vt.arrowRight}/[space]: Toggle selection
` + (this.maxChoices === void 0 ? `    a: Toggle all
` : "") + "    enter/return: Complete answer" : "";
    }
    renderOption(t, r, i, n) {
      let o = (r.selected ? lt.green(Vt.radioOn) : Vt.radioOff) + " " + n + " ", a, u;
      return r.disabled ? a = t === i ? lt.gray().underline(r.title) : lt.strikethrough().gray(r.title) : (a = t === i ? lt.cyan().underline(
      r.title) : r.title, t === i && r.description && (u = ` - ${r.description}`, (o.length + a.length + u.length >= this.out.columns || r.description.
      split(/\r?\n/).length > 1) && (u = `
` + SE(r.description, {
        margin: o.length,
        width: this.out.columns
      })))), o + a + lt.gray(u || "");
    }
    // shared with autocompleteMultiselect
    paginateOptions(t) {
      if (t.length === 0)
        return lt.red("No matches for this query.");
      let r = TE(this.cursor, t.length, this.optionsPerPage), i = r.startIndex, n = r.endIndex, o, a = [];
      for (let u = i; u < n; u++)
        u === i && i > 0 ? o = Vt.arrowUp : u === n - 1 && n < t.length ? o = Vt.arrowDown : o = " ", a.push(this.renderOption(this.cursor, t[u],
        u, o));
      return `
` + a.join(`
`);
    }
    // shared with autocomleteMultiselect
    renderOptions(t) {
      return this.done ? "" : this.paginateOptions(t);
    }
    renderDoneOrInstructions() {
      if (this.done)
        return this.value.filter((r) => r.selected).map((r) => r.title).join(", ");
      let t = [lt.gray(this.hint), this.renderInstructions()];
      return this.value[this.cursor].disabled && t.push(lt.yellow(this.warn)), t.join(" ");
    }
    render() {
      if (this.closed) return;
      this.firstRender && this.out.write(xE.hide), super.render();
      let t = [ph.symbol(this.done, this.aborted), lt.bold(this.msg), ph.delimiter(!1), this.renderDoneOrInstructions()].join(" ");
      this.showMinError && (t += lt.red(`You must select a minimum of ${this.minSelected} choices.`), this.showMinError = !1), t += this.renderOptions(
      this.value), this.out.write(this.clear + t), this.clear = hh(t, this.out.columns);
    }
  };
  Dh.exports = Ya;
});

// ../node_modules/prompts/dist/elements/autocomplete.js
var wh = b((HP, _h) => {
  "use strict";
  function mh(e, t, r, i, n, o, a) {
    try {
      var u = e[o](a), l = u.value;
    } catch (c) {
      r(c);
      return;
    }
    u.done ? t(l) : Promise.resolve(l).then(i, n);
  }
  s(mh, "asyncGeneratorStep");
  function AE(e) {
    return function() {
      var t = this, r = arguments;
      return new Promise(function(i, n) {
        var o = e.apply(t, r);
        function a(l) {
          mh(o, i, n, a, u, "next", l);
        }
        s(a, "_next");
        function u(l) {
          mh(o, i, n, a, u, "throw", l);
        }
        s(u, "_throw"), a(void 0);
      });
    };
  }
  s(AE, "_asyncToGenerator");
  var Gi = ge(), RE = wt(), vh = be(), kE = vh.erase, gh = vh.cursor, Ki = tt(), Xa = Ki.style, yh = Ki.clear, Qa = Ki.figures, OE = Ki.wrap,
  BE = Ki.entriesToDisplay, bh = /* @__PURE__ */ s((e, t) => e[t] && (e[t].value || e[t].title || e[t]), "getVal"), PE = /* @__PURE__ */ s((e, t) => e[t] &&
  (e[t].title || e[t].value || e[t]), "getTitle"), IE = /* @__PURE__ */ s((e, t) => {
    let r = e.findIndex((i) => i.value === t || i.title === t);
    return r > -1 ? r : void 0;
  }, "getIndex"), eu = class extends RE {
    static {
      s(this, "AutocompletePrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.suggest = t.suggest, this.choices = t.choices, this.initial = typeof t.initial == "number" ? t.initial :
      IE(t.choices, t.initial), this.select = this.initial || t.cursor || 0, this.i18n = {
        noMatches: t.noMatches || "no matches found"
      }, this.fallback = t.fallback || this.initial, this.clearFirst = t.clearFirst || !1, this.suggestions = [], this.input = "", this.limit =
      t.limit || 10, this.cursor = 0, this.transform = Xa.render(t.style), this.scale = this.transform.scale, this.render = this.render.bind(
      this), this.complete = this.complete.bind(this), this.clear = yh("", this.out.columns), this.complete(this.render), this.render();
    }
    set fallback(t) {
      this._fb = Number.isSafeInteger(parseInt(t)) ? parseInt(t) : t;
    }
    get fallback() {
      let t;
      return typeof this._fb == "number" ? t = this.choices[this._fb] : typeof this._fb == "string" && (t = {
        title: this._fb
      }), t || this._fb || {
        title: this.i18n.noMatches
      };
    }
    moveSelect(t) {
      this.select = t, this.suggestions.length > 0 ? this.value = bh(this.suggestions, t) : this.value = this.fallback.value, this.fire();
    }
    complete(t) {
      var r = this;
      return AE(function* () {
        let i = r.completing = r.suggest(r.input, r.choices), n = yield i;
        if (r.completing !== i) return;
        r.suggestions = n.map((a, u, l) => ({
          title: PE(l, u),
          value: bh(l, u),
          description: a.description
        })), r.completing = !1;
        let o = Math.max(n.length - 1, 0);
        r.moveSelect(Math.min(o, r.select)), t && t();
      })();
    }
    reset() {
      this.input = "", this.complete(() => {
        this.moveSelect(this.initial !== void 0 ? this.initial : 0), this.render();
      }), this.render();
    }
    exit() {
      this.clearFirst && this.input.length > 0 ? this.reset() : (this.done = this.exited = !0, this.aborted = !1, this.fire(), this.render(),
      this.out.write(`
`), this.close());
    }
    abort() {
      this.done = this.aborted = !0, this.exited = !1, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    submit() {
      this.done = !0, this.aborted = this.exited = !1, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    _(t, r) {
      let i = this.input.slice(0, this.cursor), n = this.input.slice(this.cursor);
      this.input = `${i}${t}${n}`, this.cursor = i.length + 1, this.complete(this.render), this.render();
    }
    delete() {
      if (this.cursor === 0) return this.bell();
      let t = this.input.slice(0, this.cursor - 1), r = this.input.slice(this.cursor);
      this.input = `${t}${r}`, this.complete(this.render), this.cursor = this.cursor - 1, this.render();
    }
    deleteForward() {
      if (this.cursor * this.scale >= this.rendered.length) return this.bell();
      let t = this.input.slice(0, this.cursor), r = this.input.slice(this.cursor + 1);
      this.input = `${t}${r}`, this.complete(this.render), this.render();
    }
    first() {
      this.moveSelect(0), this.render();
    }
    last() {
      this.moveSelect(this.suggestions.length - 1), this.render();
    }
    up() {
      this.select === 0 ? this.moveSelect(this.suggestions.length - 1) : this.moveSelect(this.select - 1), this.render();
    }
    down() {
      this.select === this.suggestions.length - 1 ? this.moveSelect(0) : this.moveSelect(this.select + 1), this.render();
    }
    next() {
      this.select === this.suggestions.length - 1 ? this.moveSelect(0) : this.moveSelect(this.select + 1), this.render();
    }
    nextPage() {
      this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1)), this.render();
    }
    prevPage() {
      this.moveSelect(Math.max(this.select - this.limit, 0)), this.render();
    }
    left() {
      if (this.cursor <= 0) return this.bell();
      this.cursor = this.cursor - 1, this.render();
    }
    right() {
      if (this.cursor * this.scale >= this.rendered.length) return this.bell();
      this.cursor = this.cursor + 1, this.render();
    }
    renderOption(t, r, i, n) {
      let o, a = i ? Qa.arrowUp : n ? Qa.arrowDown : " ", u = r ? Gi.cyan().underline(t.title) : t.title;
      return a = (r ? Gi.cyan(Qa.pointer) + " " : "  ") + a, t.description && (o = ` - ${t.description}`, (a.length + u.length + o.length >=
      this.out.columns || t.description.split(/\r?\n/).length > 1) && (o = `
` + OE(t.description, {
        margin: 3,
        width: this.out.columns
      }))), a + " " + u + Gi.gray(o || "");
    }
    render() {
      if (this.closed) return;
      this.firstRender ? this.out.write(gh.hide) : this.out.write(yh(this.outputText, this.out.columns)), super.render();
      let t = BE(this.select, this.choices.length, this.limit), r = t.startIndex, i = t.endIndex;
      if (this.outputText = [Xa.symbol(this.done, this.aborted, this.exited), Gi.bold(this.msg), Xa.delimiter(this.completing), this.done &&
      this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)].join(" "), !this.
      done) {
        let n = this.suggestions.slice(r, i).map((o, a) => this.renderOption(o, this.select === a + r, a === 0 && r > 0, a + r === i - 1 && i <
        this.choices.length)).join(`
`);
        this.outputText += `
` + (n || Gi.gray(this.fallback.title));
      }
      this.out.write(kE.line + gh.to(0) + this.outputText);
    }
  };
  _h.exports = eu;
});

// ../node_modules/prompts/dist/elements/autocompleteMultiselect.js
var Fh = b((ZP, xh) => {
  "use strict";
  var xt = ge(), ME = be(), jE = ME.cursor, qE = Ja(), ru = tt(), Eh = ru.clear, Ch = ru.style, Xr = ru.figures, tu = class extends qE {
    static {
      s(this, "AutocompleteMultiselectPrompt");
    }
    constructor(t = {}) {
      t.overrideRender = !0, super(t), this.inputValue = "", this.clear = Eh("", this.out.columns), this.filteredOptions = this.value, this.
      render();
    }
    last() {
      this.cursor = this.filteredOptions.length - 1, this.render();
    }
    next() {
      this.cursor = (this.cursor + 1) % this.filteredOptions.length, this.render();
    }
    up() {
      this.cursor === 0 ? this.cursor = this.filteredOptions.length - 1 : this.cursor--, this.render();
    }
    down() {
      this.cursor === this.filteredOptions.length - 1 ? this.cursor = 0 : this.cursor++, this.render();
    }
    left() {
      this.filteredOptions[this.cursor].selected = !1, this.render();
    }
    right() {
      if (this.value.filter((t) => t.selected).length >= this.maxChoices) return this.bell();
      this.filteredOptions[this.cursor].selected = !0, this.render();
    }
    delete() {
      this.inputValue.length && (this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1), this.updateFilteredOptions());
    }
    updateFilteredOptions() {
      let t = this.filteredOptions[this.cursor];
      this.filteredOptions = this.value.filter((i) => this.inputValue ? !!(typeof i.title == "string" && i.title.toLowerCase().includes(this.
      inputValue.toLowerCase()) || typeof i.value == "string" && i.value.toLowerCase().includes(this.inputValue.toLowerCase())) : !0);
      let r = this.filteredOptions.findIndex((i) => i === t);
      this.cursor = r < 0 ? 0 : r, this.render();
    }
    handleSpaceToggle() {
      let t = this.filteredOptions[this.cursor];
      if (t.selected)
        t.selected = !1, this.render();
      else {
        if (t.disabled || this.value.filter((r) => r.selected).length >= this.maxChoices)
          return this.bell();
        t.selected = !0, this.render();
      }
    }
    handleInputChange(t) {
      this.inputValue = this.inputValue + t, this.updateFilteredOptions();
    }
    _(t, r) {
      t === " " ? this.handleSpaceToggle() : this.handleInputChange(t);
    }
    renderInstructions() {
      return this.instructions === void 0 || this.instructions ? typeof this.instructions == "string" ? this.instructions : `
Instructions:
    ${Xr.arrowUp}/${Xr.arrowDown}: Highlight option
    ${Xr.arrowLeft}/${Xr.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
` : "";
    }
    renderCurrentInput() {
      return `
Filtered results for: ${this.inputValue ? this.inputValue : xt.gray("Enter something to filter")}
`;
    }
    renderOption(t, r, i) {
      let n;
      return r.disabled ? n = t === i ? xt.gray().underline(r.title) : xt.strikethrough().gray(r.title) : n = t === i ? xt.cyan().underline(
      r.title) : r.title, (r.selected ? xt.green(Xr.radioOn) : Xr.radioOff) + "  " + n;
    }
    renderDoneOrInstructions() {
      if (this.done)
        return this.value.filter((r) => r.selected).map((r) => r.title).join(", ");
      let t = [xt.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];
      return this.filteredOptions.length && this.filteredOptions[this.cursor].disabled && t.push(xt.yellow(this.warn)), t.join(" ");
    }
    render() {
      if (this.closed) return;
      this.firstRender && this.out.write(jE.hide), super.render();
      let t = [Ch.symbol(this.done, this.aborted), xt.bold(this.msg), Ch.delimiter(!1), this.renderDoneOrInstructions()].join(" ");
      this.showMinError && (t += xt.red(`You must select a minimum of ${this.minSelected} choices.`), this.showMinError = !1), t += this.renderOptions(
      this.filteredOptions), this.out.write(this.clear + t), this.clear = Eh(t, this.out.columns);
    }
  };
  xh.exports = tu;
});

// ../node_modules/prompts/dist/elements/confirm.js
var Bh = b((GP, Oh) => {
  "use strict";
  var Sh = ge(), LE = wt(), Rh = tt(), Th = Rh.style, NE = Rh.clear, kh = be(), UE = kh.erase, Ah = kh.cursor, iu = class extends LE {
    static {
      s(this, "ConfirmPrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.value = t.initial, this.initialValue = !!t.initial, this.yesMsg = t.yes || "yes", this.yesOption =
      t.yesOption || "(Y/n)", this.noMsg = t.no || "no", this.noOption = t.noOption || "(y/N)", this.render();
    }
    reset() {
      this.value = this.initialValue, this.fire(), this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = !0, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    submit() {
      this.value = this.value || !1, this.done = !0, this.aborted = !1, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    _(t, r) {
      return t.toLowerCase() === "y" ? (this.value = !0, this.submit()) : t.toLowerCase() === "n" ? (this.value = !1, this.submit()) : this.
      bell();
    }
    render() {
      this.closed || (this.firstRender ? this.out.write(Ah.hide) : this.out.write(NE(this.outputText, this.out.columns)), super.render(), this.
      outputText = [Th.symbol(this.done, this.aborted), Sh.bold(this.msg), Th.delimiter(this.done), this.done ? this.value ? this.yesMsg : this.
      noMsg : Sh.gray(this.initialValue ? this.yesOption : this.noOption)].join(" "), this.out.write(UE.line + Ah.to(0) + this.outputText));
    }
  };
  Oh.exports = iu;
});

// ../node_modules/prompts/dist/elements/index.js
var Ih = b((YP, Ph) => {
  "use strict";
  Ph.exports = {
    TextPrompt: vf(),
    SelectPrompt: Cf(),
    TogglePrompt: Rf(),
    DatePrompt: sh(),
    NumberPrompt: fh(),
    MultiselectPrompt: Ja(),
    AutocompletePrompt: wh(),
    AutocompleteMultiselectPrompt: Fh(),
    ConfirmPrompt: Bh()
  };
});

// ../node_modules/prompts/dist/prompts.js
var jh = b((Mh) => {
  "use strict";
  var Ne = Mh, $E = Ih(), vs = /* @__PURE__ */ s((e) => e, "noop");
  function ct(e, t, r = {}) {
    return new Promise((i, n) => {
      let o = new $E[e](t), a = r.onAbort || vs, u = r.onSubmit || vs, l = r.onExit || vs;
      o.on("state", t.onState || vs), o.on("submit", (c) => i(u(c))), o.on("exit", (c) => i(l(c))), o.on("abort", (c) => n(a(c)));
    });
  }
  s(ct, "toPrompt");
  Ne.text = (e) => ct("TextPrompt", e);
  Ne.password = (e) => (e.style = "password", Ne.text(e));
  Ne.invisible = (e) => (e.style = "invisible", Ne.text(e));
  Ne.number = (e) => ct("NumberPrompt", e);
  Ne.date = (e) => ct("DatePrompt", e);
  Ne.confirm = (e) => ct("ConfirmPrompt", e);
  Ne.list = (e) => {
    let t = e.separator || ",";
    return ct("TextPrompt", e, {
      onSubmit: /* @__PURE__ */ s((r) => r.split(t).map((i) => i.trim()), "onSubmit")
    });
  };
  Ne.toggle = (e) => ct("TogglePrompt", e);
  Ne.select = (e) => ct("SelectPrompt", e);
  Ne.multiselect = (e) => {
    e.choices = [].concat(e.choices || []);
    let t = /* @__PURE__ */ s((r) => r.filter((i) => i.selected).map((i) => i.value), "toSelected");
    return ct("MultiselectPrompt", e, {
      onAbort: t,
      onSubmit: t
    });
  };
  Ne.autocompleteMultiselect = (e) => {
    e.choices = [].concat(e.choices || []);
    let t = /* @__PURE__ */ s((r) => r.filter((i) => i.selected).map((i) => i.value), "toSelected");
    return ct("AutocompleteMultiselectPrompt", e, {
      onAbort: t,
      onSubmit: t
    });
  };
  var WE = /* @__PURE__ */ s((e, t) => Promise.resolve(t.filter((r) => r.title.slice(0, e.length).toLowerCase() === e.toLowerCase())), "byTi\
tle");
  Ne.autocomplete = (e) => (e.suggest = e.suggest || WE, e.choices = [].concat(e.choices || []), ct("AutocompletePrompt", e));
});

// ../node_modules/prompts/dist/index.js
var Vh = b((QP, Hh) => {
  "use strict";
  function qh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      t && (i = i.filter(function(n) {
        return Object.getOwnPropertyDescriptor(e, n).enumerable;
      })), r.push.apply(r, i);
    }
    return r;
  }
  s(qh, "ownKeys");
  function Lh(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t] != null ? arguments[t] : {};
      t % 2 ? qh(Object(r), !0).forEach(function(i) {
        HE(e, i, r[i]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : qh(Object(r)).forEach(function(i) {
        Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(r, i));
      });
    }
    return e;
  }
  s(Lh, "_objectSpread");
  function HE(e, t, r) {
    return t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
  }
  s(HE, "_defineProperty");
  function VE(e, t) {
    var r = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
    if (!r) {
      if (Array.isArray(e) || (r = ZE(e)) || t && e && typeof e.length == "number") {
        r && (e = r);
        var i = 0, n = /* @__PURE__ */ s(function() {
        }, "F");
        return { s: n, n: /* @__PURE__ */ s(function() {
          return i >= e.length ? { done: !0 } : { done: !1, value: e[i++] };
        }, "n"), e: /* @__PURE__ */ s(function(c) {
          throw c;
        }, "e"), f: n };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    var o = !0, a = !1, u;
    return { s: /* @__PURE__ */ s(function() {
      r = r.call(e);
    }, "s"), n: /* @__PURE__ */ s(function() {
      var c = r.next();
      return o = c.done, c;
    }, "n"), e: /* @__PURE__ */ s(function(c) {
      a = !0, u = c;
    }, "e"), f: /* @__PURE__ */ s(function() {
      try {
        !o && r.return != null && r.return();
      } finally {
        if (a) throw u;
      }
    }, "f") };
  }
  s(VE, "_createForOfIteratorHelper");
  function ZE(e, t) {
    if (e) {
      if (typeof e == "string") return Nh(e, t);
      var r = Object.prototype.toString.call(e).slice(8, -1);
      if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
      if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Nh(e, t);
    }
  }
  s(ZE, "_unsupportedIterableToArray");
  function Nh(e, t) {
    (t == null || t > e.length) && (t = e.length);
    for (var r = 0, i = new Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  s(Nh, "_arrayLikeToArray");
  function Uh(e, t, r, i, n, o, a) {
    try {
      var u = e[o](a), l = u.value;
    } catch (c) {
      r(c);
      return;
    }
    u.done ? t(l) : Promise.resolve(l).then(i, n);
  }
  s(Uh, "asyncGeneratorStep");
  function $h(e) {
    return function() {
      var t = this, r = arguments;
      return new Promise(function(i, n) {
        var o = e.apply(t, r);
        function a(l) {
          Uh(o, i, n, a, u, "next", l);
        }
        s(a, "_next");
        function u(l) {
          Uh(o, i, n, a, u, "throw", l);
        }
        s(u, "_throw"), a(void 0);
      });
    };
  }
  s($h, "_asyncToGenerator");
  var nu = jh(), zE = ["suggest", "format", "onState", "validate", "onRender", "type"], Wh = /* @__PURE__ */ s(() => {
  }, "noop");
  function Zt() {
    return su.apply(this, arguments);
  }
  s(Zt, "prompt");
  function su() {
    return su = $h(function* (e = [], {
      onSubmit: t = Wh,
      onCancel: r = Wh
    } = {}) {
      let i = {}, n = Zt._override || {};
      e = [].concat(e);
      let o, a, u, l, c, d, p = /* @__PURE__ */ function() {
        var _ = $h(function* (C, x, w = !1) {
          if (!(!w && C.validate && C.validate(x) !== !0))
            return C.format ? yield C.format(x, i) : x;
        });
        return /* @__PURE__ */ s(function(x, w) {
          return _.apply(this, arguments);
        }, "getFormattedAnswer");
      }();
      var h = VE(e), f;
      try {
        for (h.s(); !(f = h.n()).done; ) {
          a = f.value;
          var g = a;
          if (l = g.name, c = g.type, typeof c == "function" && (c = yield c(o, Lh({}, i), a), a.type = c), !!c) {
            for (let _ in a) {
              if (zE.includes(_)) continue;
              let C = a[_];
              a[_] = typeof C == "function" ? yield C(o, Lh({}, i), d) : C;
            }
            if (d = a, typeof a.message != "string")
              throw new Error("prompt message is required");
            var E = a;
            if (l = E.name, c = E.type, nu[c] === void 0)
              throw new Error(`prompt type (${c}) is not defined`);
            if (n[a.name] !== void 0 && (o = yield p(a, n[a.name]), o !== void 0)) {
              i[l] = o;
              continue;
            }
            try {
              o = Zt._injected ? GE(Zt._injected, a.initial) : yield nu[c](a), i[l] = o = yield p(a, o, !0), u = yield t(a, o, i);
            } catch {
              u = !(yield r(a, i));
            }
            if (u) return i;
          }
        }
      } catch (_) {
        h.e(_);
      } finally {
        h.f();
      }
      return i;
    }), su.apply(this, arguments);
  }
  s(su, "_prompt");
  function GE(e, t) {
    let r = e.shift();
    if (r instanceof Error)
      throw r;
    return r === void 0 ? t : r;
  }
  s(GE, "getInjectedAnswer");
  function KE(e) {
    Zt._injected = (Zt._injected || []).concat(e);
  }
  s(KE, "inject");
  function YE(e) {
    Zt._override = Object.assign({}, e);
  }
  s(YE, "override");
  Hh.exports = Object.assign(Zt, {
    prompt: Zt,
    prompts: nu,
    inject: KE,
    override: YE
  });
});

// ../node_modules/prompts/lib/util/action.js
var zh = b((tI, Zh) => {
  "use strict";
  Zh.exports = (e, t) => {
    if (!(e.meta && e.name !== "escape")) {
      if (e.ctrl) {
        if (e.name === "a") return "first";
        if (e.name === "c" || e.name === "d") return "abort";
        if (e.name === "e") return "last";
        if (e.name === "g") return "reset";
      }
      if (t) {
        if (e.name === "j") return "down";
        if (e.name === "k") return "up";
      }
      return e.name === "return" || e.name === "enter" ? "submit" : e.name === "backspace" ? "delete" : e.name === "delete" ? "deleteForward" :
      e.name === "abort" ? "abort" : e.name === "escape" ? "exit" : e.name === "tab" ? "next" : e.name === "pagedown" ? "nextPage" : e.name ===
      "pageup" ? "prevPage" : e.name === "home" ? "home" : e.name === "end" ? "end" : e.name === "up" ? "up" : e.name === "down" ? "down" : e.
      name === "right" ? "right" : e.name === "left" ? "left" : !1;
    }
  };
});

// ../node_modules/prompts/lib/util/strip.js
var _s = b((rI, Gh) => {
  "use strict";
  Gh.exports = (e) => {
    let t = [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"
    ].join("|"), r = new RegExp(t, "g");
    return typeof e == "string" ? e.replace(r, "") : e;
  };
});

// ../node_modules/prompts/lib/util/clear.js
var Jh = b((iI, Yh) => {
  "use strict";
  var JE = _s(), { erase: Kh, cursor: XE } = be(), QE = /* @__PURE__ */ s((e) => [...JE(e)].length, "width");
  Yh.exports = function(e, t) {
    if (!t) return Kh.line + XE.to(0);
    let r = 0, i = e.split(/\r?\n/);
    for (let n of i)
      r += 1 + Math.floor(Math.max(QE(n) - 1, 0) / t);
    return Kh.lines(r);
  };
});

// ../node_modules/prompts/lib/util/figures.js
var ou = b((sI, Xh) => {
  "use strict";
  var Yi = {
    arrowUp: "\u2191",
    arrowDown: "\u2193",
    arrowLeft: "\u2190",
    arrowRight: "\u2192",
    radioOn: "\u25C9",
    radioOff: "\u25EF",
    tick: "\u2714",
    cross: "\u2716",
    ellipsis: "\u2026",
    pointerSmall: "\u203A",
    line: "\u2500",
    pointer: "\u276F"
  }, eC = {
    arrowUp: Yi.arrowUp,
    arrowDown: Yi.arrowDown,
    arrowLeft: Yi.arrowLeft,
    arrowRight: Yi.arrowRight,
    radioOn: "(*)",
    radioOff: "( )",
    tick: "\u221A",
    cross: "\xD7",
    ellipsis: "...",
    pointerSmall: "\xBB",
    line: "\u2500",
    pointer: ">"
  }, tC = process.platform === "win32" ? eC : Yi;
  Xh.exports = tC;
});

// ../node_modules/prompts/lib/util/style.js
var ep = b((oI, Qh) => {
  "use strict";
  var Qr = ge(), dr = ou(), au = Object.freeze({
    password: { scale: 1, render: /* @__PURE__ */ s((e) => "*".repeat(e.length), "render") },
    emoji: { scale: 2, render: /* @__PURE__ */ s((e) => "\u{1F603}".repeat(e.length), "render") },
    invisible: { scale: 0, render: /* @__PURE__ */ s((e) => "", "render") },
    default: { scale: 1, render: /* @__PURE__ */ s((e) => `${e}`, "render") }
  }), rC = /* @__PURE__ */ s((e) => au[e] || au.default, "render"), Ji = Object.freeze({
    aborted: Qr.red(dr.cross),
    done: Qr.green(dr.tick),
    exited: Qr.yellow(dr.cross),
    default: Qr.cyan("?")
  }), iC = /* @__PURE__ */ s((e, t, r) => t ? Ji.aborted : r ? Ji.exited : e ? Ji.done : Ji.default, "symbol"), nC = /* @__PURE__ */ s((e) => Qr.
  gray(e ? dr.ellipsis : dr.pointerSmall), "delimiter"), sC = /* @__PURE__ */ s((e, t) => Qr.gray(e ? t ? dr.pointerSmall : "+" : dr.line), "\
item");
  Qh.exports = {
    styles: au,
    render: rC,
    symbols: Ji,
    symbol: iC,
    delimiter: nC,
    item: sC
  };
});

// ../node_modules/prompts/lib/util/lines.js
var rp = b((uI, tp) => {
  "use strict";
  var oC = _s();
  tp.exports = function(e, t) {
    let r = String(oC(e) || "").split(/\r?\n/);
    return t ? r.map((i) => Math.ceil(i.length / t)).reduce((i, n) => i + n) : r.length;
  };
});

// ../node_modules/prompts/lib/util/wrap.js
var np = b((lI, ip) => {
  "use strict";
  ip.exports = (e, t = {}) => {
    let r = Number.isSafeInteger(parseInt(t.margin)) ? new Array(parseInt(t.margin)).fill(" ").join("") : t.margin || "", i = t.width;
    return (e || "").split(/\r?\n/g).map((n) => n.split(/\s+/g).reduce((o, a) => (a.length + r.length >= i || o[o.length - 1].length + a.length +
    1 < i ? o[o.length - 1] += ` ${a}` : o.push(`${r}${a}`), o), [r]).join(`
`)).join(`
`);
  };
});

// ../node_modules/prompts/lib/util/entriesToDisplay.js
var op = b((cI, sp) => {
  "use strict";
  sp.exports = (e, t, r) => {
    r = r || t;
    let i = Math.min(t - r, e - Math.floor(r / 2));
    i < 0 && (i = 0);
    let n = Math.min(i + r, t);
    return { startIndex: i, endIndex: n };
  };
});

// ../node_modules/prompts/lib/util/index.js
var rt = b((dI, ap) => {
  "use strict";
  ap.exports = {
    action: zh(),
    clear: Jh(),
    style: ep(),
    strip: _s(),
    figures: ou(),
    lines: rp(),
    wrap: np(),
    entriesToDisplay: op()
  };
});

// ../node_modules/prompts/lib/elements/prompt.js
var Ft = b((fI, lp) => {
  "use strict";
  var up = require("readline"), { action: aC } = rt(), uC = require("events"), { beep: lC, cursor: cC } = be(), dC = ge(), uu = class extends uC {
    static {
      s(this, "Prompt");
    }
    constructor(t = {}) {
      super(), this.firstRender = !0, this.in = t.stdin || process.stdin, this.out = t.stdout || process.stdout, this.onRender = (t.onRender ||
      (() => {
      })).bind(this);
      let r = up.createInterface({ input: this.in, escapeCodeTimeout: 50 });
      up.emitKeypressEvents(this.in, r), this.in.isTTY && this.in.setRawMode(!0);
      let i = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1, n = /* @__PURE__ */ s((o, a) => {
        let u = aC(a, i);
        u === !1 ? this._ && this._(o, a) : typeof this[u] == "function" ? this[u](a) : this.bell();
      }, "keypress");
      this.close = () => {
        this.out.write(cC.show), this.in.removeListener("keypress", n), this.in.isTTY && this.in.setRawMode(!1), r.close(), this.emit(this.aborted ?
        "abort" : this.exited ? "exit" : "submit", this.value), this.closed = !0;
      }, this.in.on("keypress", n);
    }
    fire() {
      this.emit("state", {
        value: this.value,
        aborted: !!this.aborted,
        exited: !!this.exited
      });
    }
    bell() {
      this.out.write(lC);
    }
    render() {
      this.onRender(dC), this.firstRender && (this.firstRender = !1);
    }
  };
  lp.exports = uu;
});

// ../node_modules/prompts/lib/elements/text.js
var dp = b((pI, cp) => {
  var ws = ge(), fC = Ft(), { erase: hC, cursor: Xi } = be(), { style: lu, clear: cu, lines: pC, figures: DC } = rt(), du = class extends fC {
    static {
      s(this, "TextPrompt");
    }
    constructor(t = {}) {
      super(t), this.transform = lu.render(t.style), this.scale = this.transform.scale, this.msg = t.message, this.initial = t.initial || "",
      this.validator = t.validate || (() => !0), this.value = "", this.errorMsg = t.error || "Please Enter A Valid Value", this.cursor = +!!this.
      initial, this.cursorOffset = 0, this.clear = cu("", this.out.columns), this.render();
    }
    set value(t) {
      !t && this.initial ? (this.placeholder = !0, this.rendered = ws.gray(this.transform.render(this.initial))) : (this.placeholder = !1, this.
      rendered = this.transform.render(t)), this._value = t, this.fire();
    }
    get value() {
      return this._value;
    }
    reset() {
      this.value = "", this.cursor = +!!this.initial, this.cursorOffset = 0, this.fire(), this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.value = this.value || this.initial, this.done = this.aborted = !0, this.error = !1, this.red = !1, this.fire(), this.render(), this.
      out.write(`
`), this.close();
    }
    async validate() {
      let t = await this.validator(this.value);
      typeof t == "string" && (this.errorMsg = t, t = !1), this.error = !t;
    }
    async submit() {
      if (this.value = this.value || this.initial, this.cursorOffset = 0, this.cursor = this.rendered.length, await this.validate(), this.error) {
        this.red = !0, this.fire(), this.render();
        return;
      }
      this.done = !0, this.aborted = !1, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    next() {
      if (!this.placeholder) return this.bell();
      this.value = this.initial, this.cursor = this.rendered.length, this.fire(), this.render();
    }
    moveCursor(t) {
      this.placeholder || (this.cursor = this.cursor + t, this.cursorOffset += t);
    }
    _(t, r) {
      let i = this.value.slice(0, this.cursor), n = this.value.slice(this.cursor);
      this.value = `${i}${t}${n}`, this.red = !1, this.cursor = this.placeholder ? 0 : i.length + 1, this.render();
    }
    delete() {
      if (this.isCursorAtStart()) return this.bell();
      let t = this.value.slice(0, this.cursor - 1), r = this.value.slice(this.cursor);
      this.value = `${t}${r}`, this.red = !1, this.isCursorAtStart() ? this.cursorOffset = 0 : (this.cursorOffset++, this.moveCursor(-1)), this.
      render();
    }
    deleteForward() {
      if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
      let t = this.value.slice(0, this.cursor), r = this.value.slice(this.cursor + 1);
      this.value = `${t}${r}`, this.red = !1, this.isCursorAtEnd() ? this.cursorOffset = 0 : this.cursorOffset++, this.render();
    }
    first() {
      this.cursor = 0, this.render();
    }
    last() {
      this.cursor = this.value.length, this.render();
    }
    left() {
      if (this.cursor <= 0 || this.placeholder) return this.bell();
      this.moveCursor(-1), this.render();
    }
    right() {
      if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
      this.moveCursor(1), this.render();
    }
    isCursorAtStart() {
      return this.cursor === 0 || this.placeholder && this.cursor === 1;
    }
    isCursorAtEnd() {
      return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
    }
    render() {
      this.closed || (this.firstRender || (this.outputError && this.out.write(Xi.down(pC(this.outputError, this.out.columns) - 1) + cu(this.
      outputError, this.out.columns)), this.out.write(cu(this.outputText, this.out.columns))), super.render(), this.outputError = "", this.outputText =
      [
        lu.symbol(this.done, this.aborted),
        ws.bold(this.msg),
        lu.delimiter(this.done),
        this.red ? ws.red(this.rendered) : this.rendered
      ].join(" "), this.error && (this.outputError += this.errorMsg.split(`
`).reduce((t, r, i) => t + `
${i ? " " : DC.pointerSmall} ${ws.red().italic(r)}`, "")), this.out.write(hC.line + Xi.to(0) + this.outputText + Xi.save + this.outputError +
      Xi.restore + Xi.move(this.cursorOffset, 0)));
    }
  };
  cp.exports = du;
});

// ../node_modules/prompts/lib/elements/select.js
var Dp = b((mI, pp) => {
  "use strict";
  var St = ge(), mC = Ft(), { style: fp, clear: hp, figures: Es, wrap: gC, entriesToDisplay: yC } = rt(), { cursor: bC } = be(), fu = class extends mC {
    static {
      s(this, "SelectPrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.hint = t.hint || "- Use arrow-keys. Return to submit.", this.warn = t.warn || "- This option is d\
isabled", this.cursor = t.initial || 0, this.choices = t.choices.map((r, i) => (typeof r == "string" && (r = { title: r, value: i }), {
        title: r && (r.title || r.value || r),
        value: r && (r.value === void 0 ? i : r.value),
        description: r && r.description,
        selected: r && r.selected,
        disabled: r && r.disabled
      })), this.optionsPerPage = t.optionsPerPage || 10, this.value = (this.choices[this.cursor] || {}).value, this.clear = hp("", this.out.
      columns), this.render();
    }
    moveCursor(t) {
      this.cursor = t, this.value = this.choices[t].value, this.fire();
    }
    reset() {
      this.moveCursor(0), this.fire(), this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = !0, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    submit() {
      this.selection.disabled ? this.bell() : (this.done = !0, this.aborted = !1, this.fire(), this.render(), this.out.write(`
`), this.close());
    }
    first() {
      this.moveCursor(0), this.render();
    }
    last() {
      this.moveCursor(this.choices.length - 1), this.render();
    }
    up() {
      this.cursor === 0 ? this.moveCursor(this.choices.length - 1) : this.moveCursor(this.cursor - 1), this.render();
    }
    down() {
      this.cursor === this.choices.length - 1 ? this.moveCursor(0) : this.moveCursor(this.cursor + 1), this.render();
    }
    next() {
      this.moveCursor((this.cursor + 1) % this.choices.length), this.render();
    }
    _(t, r) {
      if (t === " ") return this.submit();
    }
    get selection() {
      return this.choices[this.cursor];
    }
    render() {
      if (this.closed) return;
      this.firstRender ? this.out.write(bC.hide) : this.out.write(hp(this.outputText, this.out.columns)), super.render();
      let { startIndex: t, endIndex: r } = yC(this.cursor, this.choices.length, this.optionsPerPage);
      if (this.outputText = [
        fp.symbol(this.done, this.aborted),
        St.bold(this.msg),
        fp.delimiter(!1),
        this.done ? this.selection.title : this.selection.disabled ? St.yellow(this.warn) : St.gray(this.hint)
      ].join(" "), !this.done) {
        this.outputText += `
`;
        for (let i = t; i < r; i++) {
          let n, o, a = "", u = this.choices[i];
          i === t && t > 0 ? o = Es.arrowUp : i === r - 1 && r < this.choices.length ? o = Es.arrowDown : o = " ", u.disabled ? (n = this.cursor ===
          i ? St.gray().underline(u.title) : St.strikethrough().gray(u.title), o = (this.cursor === i ? St.bold().gray(Es.pointer) + " " : "\
  ") + o) : (n = this.cursor === i ? St.cyan().underline(u.title) : u.title, o = (this.cursor === i ? St.cyan(Es.pointer) + " " : "  ") + o,
          u.description && this.cursor === i && (a = ` - ${u.description}`, (o.length + n.length + a.length >= this.out.columns || u.description.
          split(/\r?\n/).length > 1) && (a = `
` + gC(u.description, { margin: 3, width: this.out.columns })))), this.outputText += `${o} ${n}${St.gray(a)}
`;
        }
      }
      this.out.write(this.outputText);
    }
  };
  pp.exports = fu;
});

// ../node_modules/prompts/lib/elements/toggle.js
var bp = b((yI, yp) => {
  var Cs = ge(), vC = Ft(), { style: mp, clear: _C } = rt(), { cursor: gp, erase: wC } = be(), hu = class extends vC {
    static {
      s(this, "TogglePrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.value = !!t.initial, this.active = t.active || "on", this.inactive = t.inactive || "off", this.initialValue =
      this.value, this.render();
    }
    reset() {
      this.value = this.initialValue, this.fire(), this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = !0, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    submit() {
      this.done = !0, this.aborted = !1, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    deactivate() {
      if (this.value === !1) return this.bell();
      this.value = !1, this.render();
    }
    activate() {
      if (this.value === !0) return this.bell();
      this.value = !0, this.render();
    }
    delete() {
      this.deactivate();
    }
    left() {
      this.deactivate();
    }
    right() {
      this.activate();
    }
    down() {
      this.deactivate();
    }
    up() {
      this.activate();
    }
    next() {
      this.value = !this.value, this.fire(), this.render();
    }
    _(t, r) {
      if (t === " ")
        this.value = !this.value;
      else if (t === "1")
        this.value = !0;
      else if (t === "0")
        this.value = !1;
      else return this.bell();
      this.render();
    }
    render() {
      this.closed || (this.firstRender ? this.out.write(gp.hide) : this.out.write(_C(this.outputText, this.out.columns)), super.render(), this.
      outputText = [
        mp.symbol(this.done, this.aborted),
        Cs.bold(this.msg),
        mp.delimiter(this.done),
        this.value ? this.inactive : Cs.cyan().underline(this.inactive),
        Cs.gray("/"),
        this.value ? Cs.cyan().underline(this.active) : this.active
      ].join(" "), this.out.write(wC.line + gp.to(0) + this.outputText));
    }
  };
  yp.exports = hu;
});

// ../node_modules/prompts/lib/dateparts/datepart.js
var dt = b((vI, vp) => {
  "use strict";
  var pu = class e {
    static {
      s(this, "DatePart");
    }
    constructor({ token: t, date: r, parts: i, locales: n }) {
      this.token = t, this.date = r || /* @__PURE__ */ new Date(), this.parts = i || [this], this.locales = n || {};
    }
    up() {
    }
    down() {
    }
    next() {
      let t = this.parts.indexOf(this);
      return this.parts.find((r, i) => i > t && r instanceof e);
    }
    setTo(t) {
    }
    prev() {
      let t = [].concat(this.parts).reverse(), r = t.indexOf(this);
      return t.find((i, n) => n > r && i instanceof e);
    }
    toString() {
      return String(this.date);
    }
  };
  vp.exports = pu;
});

// ../node_modules/prompts/lib/dateparts/meridiem.js
var wp = b((wI, _p) => {
  "use strict";
  var EC = dt(), Du = class extends EC {
    static {
      s(this, "Meridiem");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setHours((this.date.getHours() + 12) % 24);
    }
    down() {
      this.up();
    }
    toString() {
      let t = this.date.getHours() > 12 ? "pm" : "am";
      return /\A/.test(this.token) ? t.toUpperCase() : t;
    }
  };
  _p.exports = Du;
});

// ../node_modules/prompts/lib/dateparts/day.js
var Cp = b((CI, Ep) => {
  "use strict";
  var CC = dt(), xC = /* @__PURE__ */ s((e) => (e = e % 10, e === 1 ? "st" : e === 2 ? "nd" : e === 3 ? "rd" : "th"), "pos"), mu = class extends CC {
    static {
      s(this, "Day");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setDate(this.date.getDate() + 1);
    }
    down() {
      this.date.setDate(this.date.getDate() - 1);
    }
    setTo(t) {
      this.date.setDate(parseInt(t.substr(-2)));
    }
    toString() {
      let t = this.date.getDate(), r = this.date.getDay();
      return this.token === "DD" ? String(t).padStart(2, "0") : this.token === "Do" ? t + xC(t) : this.token === "d" ? r + 1 : this.token ===
      "ddd" ? this.locales.weekdaysShort[r] : this.token === "dddd" ? this.locales.weekdays[r] : t;
    }
  };
  Ep.exports = mu;
});

// ../node_modules/prompts/lib/dateparts/hours.js
var Fp = b((FI, xp) => {
  "use strict";
  var FC = dt(), gu = class extends FC {
    static {
      s(this, "Hours");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setHours(this.date.getHours() + 1);
    }
    down() {
      this.date.setHours(this.date.getHours() - 1);
    }
    setTo(t) {
      this.date.setHours(parseInt(t.substr(-2)));
    }
    toString() {
      let t = this.date.getHours();
      return /h/.test(this.token) && (t = t % 12 || 12), this.token.length > 1 ? String(t).padStart(2, "0") : t;
    }
  };
  xp.exports = gu;
});

// ../node_modules/prompts/lib/dateparts/milliseconds.js
var Tp = b((TI, Sp) => {
  "use strict";
  var SC = dt(), yu = class extends SC {
    static {
      s(this, "Milliseconds");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setMilliseconds(this.date.getMilliseconds() + 1);
    }
    down() {
      this.date.setMilliseconds(this.date.getMilliseconds() - 1);
    }
    setTo(t) {
      this.date.setMilliseconds(parseInt(t.substr(-this.token.length)));
    }
    toString() {
      return String(this.date.getMilliseconds()).padStart(4, "0").substr(0, this.token.length);
    }
  };
  Sp.exports = yu;
});

// ../node_modules/prompts/lib/dateparts/minutes.js
var Rp = b((RI, Ap) => {
  "use strict";
  var TC = dt(), bu = class extends TC {
    static {
      s(this, "Minutes");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setMinutes(this.date.getMinutes() + 1);
    }
    down() {
      this.date.setMinutes(this.date.getMinutes() - 1);
    }
    setTo(t) {
      this.date.setMinutes(parseInt(t.substr(-2)));
    }
    toString() {
      let t = this.date.getMinutes();
      return this.token.length > 1 ? String(t).padStart(2, "0") : t;
    }
  };
  Ap.exports = bu;
});

// ../node_modules/prompts/lib/dateparts/month.js
var Op = b((OI, kp) => {
  "use strict";
  var AC = dt(), vu = class extends AC {
    static {
      s(this, "Month");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setMonth(this.date.getMonth() + 1);
    }
    down() {
      this.date.setMonth(this.date.getMonth() - 1);
    }
    setTo(t) {
      t = parseInt(t.substr(-2)) - 1, this.date.setMonth(t < 0 ? 0 : t);
    }
    toString() {
      let t = this.date.getMonth(), r = this.token.length;
      return r === 2 ? String(t + 1).padStart(2, "0") : r === 3 ? this.locales.monthsShort[t] : r === 4 ? this.locales.months[t] : String(t +
      1);
    }
  };
  kp.exports = vu;
});

// ../node_modules/prompts/lib/dateparts/seconds.js
var Pp = b((PI, Bp) => {
  "use strict";
  var RC = dt(), _u = class extends RC {
    static {
      s(this, "Seconds");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setSeconds(this.date.getSeconds() + 1);
    }
    down() {
      this.date.setSeconds(this.date.getSeconds() - 1);
    }
    setTo(t) {
      this.date.setSeconds(parseInt(t.substr(-2)));
    }
    toString() {
      let t = this.date.getSeconds();
      return this.token.length > 1 ? String(t).padStart(2, "0") : t;
    }
  };
  Bp.exports = _u;
});

// ../node_modules/prompts/lib/dateparts/year.js
var Mp = b((MI, Ip) => {
  "use strict";
  var kC = dt(), wu = class extends kC {
    static {
      s(this, "Year");
    }
    constructor(t = {}) {
      super(t);
    }
    up() {
      this.date.setFullYear(this.date.getFullYear() + 1);
    }
    down() {
      this.date.setFullYear(this.date.getFullYear() - 1);
    }
    setTo(t) {
      this.date.setFullYear(t.substr(-4));
    }
    toString() {
      let t = String(this.date.getFullYear()).padStart(4, "0");
      return this.token.length === 2 ? t.substr(-2) : t;
    }
  };
  Ip.exports = wu;
});

// ../node_modules/prompts/lib/dateparts/index.js
var qp = b((qI, jp) => {
  "use strict";
  jp.exports = {
    DatePart: dt(),
    Meridiem: wp(),
    Day: Cp(),
    Hours: Fp(),
    Milliseconds: Tp(),
    Minutes: Rp(),
    Month: Op(),
    Seconds: Pp(),
    Year: Mp()
  };
});

// ../node_modules/prompts/lib/elements/date.js
var Vp = b((LI, Hp) => {
  "use strict";
  var Eu = ge(), OC = Ft(), { style: Lp, clear: Np, figures: BC } = rt(), { erase: PC, cursor: Up } = be(), { DatePart: $p, Meridiem: IC, Day: MC,
  Hours: jC, Milliseconds: qC, Minutes: LC, Month: NC, Seconds: UC, Year: $C } = qp(), WC = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g,
  Wp = {
    1: ({ token: e }) => e.replace(/\\(.)/g, "$1"),
    2: (e) => new MC(e),
    // Day // TODO
    3: (e) => new NC(e),
    // Month
    4: (e) => new $C(e),
    // Year
    5: (e) => new IC(e),
    // AM/PM // TODO (special)
    6: (e) => new jC(e),
    // Hours
    7: (e) => new LC(e),
    // Minutes
    8: (e) => new UC(e),
    // Seconds
    9: (e) => new qC(e)
    // Fractional seconds
  }, HC = {
    months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
    monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
    weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
    weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
  }, Cu = class extends OC {
    static {
      s(this, "DatePrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.cursor = 0, this.typed = "", this.locales = Object.assign(HC, t.locales), this._date = t.initial ||
      /* @__PURE__ */ new Date(), this.errorMsg = t.error || "Please Enter A Valid Value", this.validator = t.validate || (() => !0), this.mask =
      t.mask || "YYYY-MM-DD HH:mm:ss", this.clear = Np("", this.out.columns), this.render();
    }
    get value() {
      return this.date;
    }
    get date() {
      return this._date;
    }
    set date(t) {
      t && this._date.setTime(t.getTime());
    }
    set mask(t) {
      let r;
      for (this.parts = []; r = WC.exec(t); ) {
        let n = r.shift(), o = r.findIndex((a) => a != null);
        this.parts.push(o in Wp ? Wp[o]({ token: r[o] || n, date: this.date, parts: this.parts, locales: this.locales }) : r[o] || n);
      }
      let i = this.parts.reduce((n, o) => (typeof o == "string" && typeof n[n.length - 1] == "string" ? n[n.length - 1] += o : n.push(o), n),
      []);
      this.parts.splice(0), this.parts.push(...i), this.reset();
    }
    moveCursor(t) {
      this.typed = "", this.cursor = t, this.fire();
    }
    reset() {
      this.moveCursor(this.parts.findIndex((t) => t instanceof $p)), this.fire(), this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = !0, this.error = !1, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    async validate() {
      let t = await this.validator(this.value);
      typeof t == "string" && (this.errorMsg = t, t = !1), this.error = !t;
    }
    async submit() {
      if (await this.validate(), this.error) {
        this.color = "red", this.fire(), this.render();
        return;
      }
      this.done = !0, this.aborted = !1, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    up() {
      this.typed = "", this.parts[this.cursor].up(), this.render();
    }
    down() {
      this.typed = "", this.parts[this.cursor].down(), this.render();
    }
    left() {
      let t = this.parts[this.cursor].prev();
      if (t == null) return this.bell();
      this.moveCursor(this.parts.indexOf(t)), this.render();
    }
    right() {
      let t = this.parts[this.cursor].next();
      if (t == null) return this.bell();
      this.moveCursor(this.parts.indexOf(t)), this.render();
    }
    next() {
      let t = this.parts[this.cursor].next();
      this.moveCursor(t ? this.parts.indexOf(t) : this.parts.findIndex((r) => r instanceof $p)), this.render();
    }
    _(t) {
      /\d/.test(t) && (this.typed += t, this.parts[this.cursor].setTo(this.typed), this.render());
    }
    render() {
      this.closed || (this.firstRender ? this.out.write(Up.hide) : this.out.write(Np(this.outputText, this.out.columns)), super.render(), this.
      outputText = [
        Lp.symbol(this.done, this.aborted),
        Eu.bold(this.msg),
        Lp.delimiter(!1),
        this.parts.reduce((t, r, i) => t.concat(i === this.cursor && !this.done ? Eu.cyan().underline(r.toString()) : r), []).join("")
      ].join(" "), this.error && (this.outputText += this.errorMsg.split(`
`).reduce(
        (t, r, i) => t + `
${i ? " " : BC.pointerSmall} ${Eu.red().italic(r)}`,
        ""
      )), this.out.write(PC.line + Up.to(0) + this.outputText));
    }
  };
  Hp.exports = Cu;
});

// ../node_modules/prompts/lib/elements/number.js
var Kp = b((UI, Gp) => {
  var xs = ge(), VC = Ft(), { cursor: Fs, erase: ZC } = be(), { style: xu, figures: zC, clear: Zp, lines: GC } = rt(), KC = /[0-9]/, Fu = /* @__PURE__ */ s(
  (e) => e !== void 0, "isDef"), zp = /* @__PURE__ */ s((e, t) => {
    let r = Math.pow(10, t);
    return Math.round(e * r) / r;
  }, "round"), Su = class extends VC {
    static {
      s(this, "NumberPrompt");
    }
    constructor(t = {}) {
      super(t), this.transform = xu.render(t.style), this.msg = t.message, this.initial = Fu(t.initial) ? t.initial : "", this.float = !!t.float,
      this.round = t.round || 2, this.inc = t.increment || 1, this.min = Fu(t.min) ? t.min : -1 / 0, this.max = Fu(t.max) ? t.max : 1 / 0, this.
      errorMsg = t.error || "Please Enter A Valid Value", this.validator = t.validate || (() => !0), this.color = "cyan", this.value = "", this.
      typed = "", this.lastHit = 0, this.render();
    }
    set value(t) {
      !t && t !== 0 ? (this.placeholder = !0, this.rendered = xs.gray(this.transform.render(`${this.initial}`)), this._value = "") : (this.placeholder =
      !1, this.rendered = this.transform.render(`${zp(t, this.round)}`), this._value = zp(t, this.round)), this.fire();
    }
    get value() {
      return this._value;
    }
    parse(t) {
      return this.float ? parseFloat(t) : parseInt(t);
    }
    valid(t) {
      return t === "-" || t === "." && this.float || KC.test(t);
    }
    reset() {
      this.typed = "", this.value = "", this.fire(), this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      let t = this.value;
      this.value = t !== "" ? t : this.initial, this.done = this.aborted = !0, this.error = !1, this.fire(), this.render(), this.out.write(`\

`), this.close();
    }
    async validate() {
      let t = await this.validator(this.value);
      typeof t == "string" && (this.errorMsg = t, t = !1), this.error = !t;
    }
    async submit() {
      if (await this.validate(), this.error) {
        this.color = "red", this.fire(), this.render();
        return;
      }
      let t = this.value;
      this.value = t !== "" ? t : this.initial, this.done = !0, this.aborted = !1, this.error = !1, this.fire(), this.render(), this.out.write(
      `
`), this.close();
    }
    up() {
      if (this.typed = "", this.value === "" && (this.value = this.min - this.inc), this.value >= this.max) return this.bell();
      this.value += this.inc, this.color = "cyan", this.fire(), this.render();
    }
    down() {
      if (this.typed = "", this.value === "" && (this.value = this.min + this.inc), this.value <= this.min) return this.bell();
      this.value -= this.inc, this.color = "cyan", this.fire(), this.render();
    }
    delete() {
      let t = this.value.toString();
      if (t.length === 0) return this.bell();
      this.value = this.parse(t = t.slice(0, -1)) || "", this.value !== "" && this.value < this.min && (this.value = this.min), this.color =
      "cyan", this.fire(), this.render();
    }
    next() {
      this.value = this.initial, this.fire(), this.render();
    }
    _(t, r) {
      if (!this.valid(t)) return this.bell();
      let i = Date.now();
      if (i - this.lastHit > 1e3 && (this.typed = ""), this.typed += t, this.lastHit = i, this.color = "cyan", t === ".") return this.fire();
      this.value = Math.min(this.parse(this.typed), this.max), this.value > this.max && (this.value = this.max), this.value < this.min && (this.
      value = this.min), this.fire(), this.render();
    }
    render() {
      this.closed || (this.firstRender || (this.outputError && this.out.write(Fs.down(GC(this.outputError, this.out.columns) - 1) + Zp(this.
      outputError, this.out.columns)), this.out.write(Zp(this.outputText, this.out.columns))), super.render(), this.outputError = "", this.outputText =
      [
        xu.symbol(this.done, this.aborted),
        xs.bold(this.msg),
        xu.delimiter(this.done),
        !this.done || !this.done && !this.placeholder ? xs[this.color]().underline(this.rendered) : this.rendered
      ].join(" "), this.error && (this.outputError += this.errorMsg.split(`
`).reduce((t, r, i) => t + `
${i ? " " : zC.pointerSmall} ${xs.red().italic(r)}`, "")), this.out.write(ZC.line + Fs.to(0) + this.outputText + Fs.save + this.outputError +
      Fs.restore));
    }
  };
  Gp.exports = Su;
});

// ../node_modules/prompts/lib/elements/multiselect.js
var Au = b((WI, Xp) => {
  "use strict";
  var ft = ge(), { cursor: YC } = be(), JC = Ft(), { clear: Yp, figures: zt, style: Jp, wrap: XC, entriesToDisplay: QC } = rt(), Tu = class extends JC {
    static {
      s(this, "MultiselectPrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.cursor = t.cursor || 0, this.scrollIndex = t.cursor || 0, this.hint = t.hint || "", this.warn = t.
      warn || "- This option is disabled -", this.minSelected = t.min, this.showMinError = !1, this.maxChoices = t.max, this.instructions = t.
      instructions, this.optionsPerPage = t.optionsPerPage || 10, this.value = t.choices.map((r, i) => (typeof r == "string" && (r = { title: r,
      value: i }), {
        title: r && (r.title || r.value || r),
        description: r && r.description,
        value: r && (r.value === void 0 ? i : r.value),
        selected: r && r.selected,
        disabled: r && r.disabled
      })), this.clear = Yp("", this.out.columns), t.overrideRender || this.render();
    }
    reset() {
      this.value.map((t) => !t.selected), this.cursor = 0, this.fire(), this.render();
    }
    selected() {
      return this.value.filter((t) => t.selected);
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = !0, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    submit() {
      let t = this.value.filter((r) => r.selected);
      this.minSelected && t.length < this.minSelected ? (this.showMinError = !0, this.render()) : (this.done = !0, this.aborted = !1, this.fire(),
      this.render(), this.out.write(`
`), this.close());
    }
    first() {
      this.cursor = 0, this.render();
    }
    last() {
      this.cursor = this.value.length - 1, this.render();
    }
    next() {
      this.cursor = (this.cursor + 1) % this.value.length, this.render();
    }
    up() {
      this.cursor === 0 ? this.cursor = this.value.length - 1 : this.cursor--, this.render();
    }
    down() {
      this.cursor === this.value.length - 1 ? this.cursor = 0 : this.cursor++, this.render();
    }
    left() {
      this.value[this.cursor].selected = !1, this.render();
    }
    right() {
      if (this.value.filter((t) => t.selected).length >= this.maxChoices) return this.bell();
      this.value[this.cursor].selected = !0, this.render();
    }
    handleSpaceToggle() {
      let t = this.value[this.cursor];
      if (t.selected)
        t.selected = !1, this.render();
      else {
        if (t.disabled || this.value.filter((r) => r.selected).length >= this.maxChoices)
          return this.bell();
        t.selected = !0, this.render();
      }
    }
    toggleAll() {
      if (this.maxChoices !== void 0 || this.value[this.cursor].disabled)
        return this.bell();
      let t = !this.value[this.cursor].selected;
      this.value.filter((r) => !r.disabled).forEach((r) => r.selected = t), this.render();
    }
    _(t, r) {
      if (t === " ")
        this.handleSpaceToggle();
      else if (t === "a")
        this.toggleAll();
      else
        return this.bell();
    }
    renderInstructions() {
      return this.instructions === void 0 || this.instructions ? typeof this.instructions == "string" ? this.instructions : `
Instructions:
    ${zt.arrowUp}/${zt.arrowDown}: Highlight option
    ${zt.arrowLeft}/${zt.arrowRight}/[space]: Toggle selection
` + (this.maxChoices === void 0 ? `    a: Toggle all
` : "") + "    enter/return: Complete answer" : "";
    }
    renderOption(t, r, i, n) {
      let o = (r.selected ? ft.green(zt.radioOn) : zt.radioOff) + " " + n + " ", a, u;
      return r.disabled ? a = t === i ? ft.gray().underline(r.title) : ft.strikethrough().gray(r.title) : (a = t === i ? ft.cyan().underline(
      r.title) : r.title, t === i && r.description && (u = ` - ${r.description}`, (o.length + a.length + u.length >= this.out.columns || r.description.
      split(/\r?\n/).length > 1) && (u = `
` + XC(r.description, { margin: o.length, width: this.out.columns })))), o + a + ft.gray(u || "");
    }
    // shared with autocompleteMultiselect
    paginateOptions(t) {
      if (t.length === 0)
        return ft.red("No matches for this query.");
      let { startIndex: r, endIndex: i } = QC(this.cursor, t.length, this.optionsPerPage), n, o = [];
      for (let a = r; a < i; a++)
        a === r && r > 0 ? n = zt.arrowUp : a === i - 1 && i < t.length ? n = zt.arrowDown : n = " ", o.push(this.renderOption(this.cursor, t[a],
        a, n));
      return `
` + o.join(`
`);
    }
    // shared with autocomleteMultiselect
    renderOptions(t) {
      return this.done ? "" : this.paginateOptions(t);
    }
    renderDoneOrInstructions() {
      if (this.done)
        return this.value.filter((r) => r.selected).map((r) => r.title).join(", ");
      let t = [ft.gray(this.hint), this.renderInstructions()];
      return this.value[this.cursor].disabled && t.push(ft.yellow(this.warn)), t.join(" ");
    }
    render() {
      if (this.closed) return;
      this.firstRender && this.out.write(YC.hide), super.render();
      let t = [
        Jp.symbol(this.done, this.aborted),
        ft.bold(this.msg),
        Jp.delimiter(!1),
        this.renderDoneOrInstructions()
      ].join(" ");
      this.showMinError && (t += ft.red(`You must select a minimum of ${this.minSelected} choices.`), this.showMinError = !1), t += this.renderOptions(
      this.value), this.out.write(this.clear + t), this.clear = Yp(t, this.out.columns);
    }
  };
  Xp.exports = Tu;
});

// ../node_modules/prompts/lib/elements/autocomplete.js
var iD = b((VI, rD) => {
  "use strict";
  var Qi = ge(), ex = Ft(), { erase: tx, cursor: Qp } = be(), { style: Ru, clear: eD, figures: ku, wrap: rx, entriesToDisplay: ix } = rt(), tD = /* @__PURE__ */ s(
  (e, t) => e[t] && (e[t].value || e[t].title || e[t]), "getVal"), nx = /* @__PURE__ */ s((e, t) => e[t] && (e[t].title || e[t].value || e[t]),
  "getTitle"), sx = /* @__PURE__ */ s((e, t) => {
    let r = e.findIndex((i) => i.value === t || i.title === t);
    return r > -1 ? r : void 0;
  }, "getIndex"), Ou = class extends ex {
    static {
      s(this, "AutocompletePrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.suggest = t.suggest, this.choices = t.choices, this.initial = typeof t.initial == "number" ? t.initial :
      sx(t.choices, t.initial), this.select = this.initial || t.cursor || 0, this.i18n = { noMatches: t.noMatches || "no matches found" }, this.
      fallback = t.fallback || this.initial, this.clearFirst = t.clearFirst || !1, this.suggestions = [], this.input = "", this.limit = t.limit ||
      10, this.cursor = 0, this.transform = Ru.render(t.style), this.scale = this.transform.scale, this.render = this.render.bind(this), this.
      complete = this.complete.bind(this), this.clear = eD("", this.out.columns), this.complete(this.render), this.render();
    }
    set fallback(t) {
      this._fb = Number.isSafeInteger(parseInt(t)) ? parseInt(t) : t;
    }
    get fallback() {
      let t;
      return typeof this._fb == "number" ? t = this.choices[this._fb] : typeof this._fb == "string" && (t = { title: this._fb }), t || this.
      _fb || { title: this.i18n.noMatches };
    }
    moveSelect(t) {
      this.select = t, this.suggestions.length > 0 ? this.value = tD(this.suggestions, t) : this.value = this.fallback.value, this.fire();
    }
    async complete(t) {
      let r = this.completing = this.suggest(this.input, this.choices), i = await r;
      if (this.completing !== r) return;
      this.suggestions = i.map((o, a, u) => ({ title: nx(u, a), value: tD(u, a), description: o.description })), this.completing = !1;
      let n = Math.max(i.length - 1, 0);
      this.moveSelect(Math.min(n, this.select)), t && t();
    }
    reset() {
      this.input = "", this.complete(() => {
        this.moveSelect(this.initial !== void 0 ? this.initial : 0), this.render();
      }), this.render();
    }
    exit() {
      this.clearFirst && this.input.length > 0 ? this.reset() : (this.done = this.exited = !0, this.aborted = !1, this.fire(), this.render(),
      this.out.write(`
`), this.close());
    }
    abort() {
      this.done = this.aborted = !0, this.exited = !1, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    submit() {
      this.done = !0, this.aborted = this.exited = !1, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    _(t, r) {
      let i = this.input.slice(0, this.cursor), n = this.input.slice(this.cursor);
      this.input = `${i}${t}${n}`, this.cursor = i.length + 1, this.complete(this.render), this.render();
    }
    delete() {
      if (this.cursor === 0) return this.bell();
      let t = this.input.slice(0, this.cursor - 1), r = this.input.slice(this.cursor);
      this.input = `${t}${r}`, this.complete(this.render), this.cursor = this.cursor - 1, this.render();
    }
    deleteForward() {
      if (this.cursor * this.scale >= this.rendered.length) return this.bell();
      let t = this.input.slice(0, this.cursor), r = this.input.slice(this.cursor + 1);
      this.input = `${t}${r}`, this.complete(this.render), this.render();
    }
    first() {
      this.moveSelect(0), this.render();
    }
    last() {
      this.moveSelect(this.suggestions.length - 1), this.render();
    }
    up() {
      this.select === 0 ? this.moveSelect(this.suggestions.length - 1) : this.moveSelect(this.select - 1), this.render();
    }
    down() {
      this.select === this.suggestions.length - 1 ? this.moveSelect(0) : this.moveSelect(this.select + 1), this.render();
    }
    next() {
      this.select === this.suggestions.length - 1 ? this.moveSelect(0) : this.moveSelect(this.select + 1), this.render();
    }
    nextPage() {
      this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1)), this.render();
    }
    prevPage() {
      this.moveSelect(Math.max(this.select - this.limit, 0)), this.render();
    }
    left() {
      if (this.cursor <= 0) return this.bell();
      this.cursor = this.cursor - 1, this.render();
    }
    right() {
      if (this.cursor * this.scale >= this.rendered.length) return this.bell();
      this.cursor = this.cursor + 1, this.render();
    }
    renderOption(t, r, i, n) {
      let o, a = i ? ku.arrowUp : n ? ku.arrowDown : " ", u = r ? Qi.cyan().underline(t.title) : t.title;
      return a = (r ? Qi.cyan(ku.pointer) + " " : "  ") + a, t.description && (o = ` - ${t.description}`, (a.length + u.length + o.length >=
      this.out.columns || t.description.split(/\r?\n/).length > 1) && (o = `
` + rx(t.description, { margin: 3, width: this.out.columns }))), a + " " + u + Qi.gray(o || "");
    }
    render() {
      if (this.closed) return;
      this.firstRender ? this.out.write(Qp.hide) : this.out.write(eD(this.outputText, this.out.columns)), super.render();
      let { startIndex: t, endIndex: r } = ix(this.select, this.choices.length, this.limit);
      if (this.outputText = [
        Ru.symbol(this.done, this.aborted, this.exited),
        Qi.bold(this.msg),
        Ru.delimiter(this.completing),
        this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)
      ].join(" "), !this.done) {
        let i = this.suggestions.slice(t, r).map((n, o) => this.renderOption(
          n,
          this.select === o + t,
          o === 0 && t > 0,
          o + t === r - 1 && r < this.choices.length
        )).join(`
`);
        this.outputText += `
` + (i || Qi.gray(this.fallback.title));
      }
      this.out.write(tx.line + Qp.to(0) + this.outputText);
    }
  };
  rD.exports = Ou;
});

// ../node_modules/prompts/lib/elements/autocompleteMultiselect.js
var aD = b((zI, oD) => {
  "use strict";
  var Tt = ge(), { cursor: ox } = be(), ax = Au(), { clear: nD, style: sD, figures: ei } = rt(), Bu = class extends ax {
    static {
      s(this, "AutocompleteMultiselectPrompt");
    }
    constructor(t = {}) {
      t.overrideRender = !0, super(t), this.inputValue = "", this.clear = nD("", this.out.columns), this.filteredOptions = this.value, this.
      render();
    }
    last() {
      this.cursor = this.filteredOptions.length - 1, this.render();
    }
    next() {
      this.cursor = (this.cursor + 1) % this.filteredOptions.length, this.render();
    }
    up() {
      this.cursor === 0 ? this.cursor = this.filteredOptions.length - 1 : this.cursor--, this.render();
    }
    down() {
      this.cursor === this.filteredOptions.length - 1 ? this.cursor = 0 : this.cursor++, this.render();
    }
    left() {
      this.filteredOptions[this.cursor].selected = !1, this.render();
    }
    right() {
      if (this.value.filter((t) => t.selected).length >= this.maxChoices) return this.bell();
      this.filteredOptions[this.cursor].selected = !0, this.render();
    }
    delete() {
      this.inputValue.length && (this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1), this.updateFilteredOptions());
    }
    updateFilteredOptions() {
      let t = this.filteredOptions[this.cursor];
      this.filteredOptions = this.value.filter((i) => this.inputValue ? !!(typeof i.title == "string" && i.title.toLowerCase().includes(this.
      inputValue.toLowerCase()) || typeof i.value == "string" && i.value.toLowerCase().includes(this.inputValue.toLowerCase())) : !0);
      let r = this.filteredOptions.findIndex((i) => i === t);
      this.cursor = r < 0 ? 0 : r, this.render();
    }
    handleSpaceToggle() {
      let t = this.filteredOptions[this.cursor];
      if (t.selected)
        t.selected = !1, this.render();
      else {
        if (t.disabled || this.value.filter((r) => r.selected).length >= this.maxChoices)
          return this.bell();
        t.selected = !0, this.render();
      }
    }
    handleInputChange(t) {
      this.inputValue = this.inputValue + t, this.updateFilteredOptions();
    }
    _(t, r) {
      t === " " ? this.handleSpaceToggle() : this.handleInputChange(t);
    }
    renderInstructions() {
      return this.instructions === void 0 || this.instructions ? typeof this.instructions == "string" ? this.instructions : `
Instructions:
    ${ei.arrowUp}/${ei.arrowDown}: Highlight option
    ${ei.arrowLeft}/${ei.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
` : "";
    }
    renderCurrentInput() {
      return `
Filtered results for: ${this.inputValue ? this.inputValue : Tt.gray("Enter something to filter")}
`;
    }
    renderOption(t, r, i) {
      let n;
      return r.disabled ? n = t === i ? Tt.gray().underline(r.title) : Tt.strikethrough().gray(r.title) : n = t === i ? Tt.cyan().underline(
      r.title) : r.title, (r.selected ? Tt.green(ei.radioOn) : ei.radioOff) + "  " + n;
    }
    renderDoneOrInstructions() {
      if (this.done)
        return this.value.filter((r) => r.selected).map((r) => r.title).join(", ");
      let t = [Tt.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];
      return this.filteredOptions.length && this.filteredOptions[this.cursor].disabled && t.push(Tt.yellow(this.warn)), t.join(" ");
    }
    render() {
      if (this.closed) return;
      this.firstRender && this.out.write(ox.hide), super.render();
      let t = [
        sD.symbol(this.done, this.aborted),
        Tt.bold(this.msg),
        sD.delimiter(!1),
        this.renderDoneOrInstructions()
      ].join(" ");
      this.showMinError && (t += Tt.red(`You must select a minimum of ${this.minSelected} choices.`), this.showMinError = !1), t += this.renderOptions(
      this.filteredOptions), this.out.write(this.clear + t), this.clear = nD(t, this.out.columns);
    }
  };
  oD.exports = Bu;
});

// ../node_modules/prompts/lib/elements/confirm.js
var fD = b((KI, dD) => {
  var uD = ge(), ux = Ft(), { style: lD, clear: lx } = rt(), { erase: cx, cursor: cD } = be(), Pu = class extends ux {
    static {
      s(this, "ConfirmPrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.value = t.initial, this.initialValue = !!t.initial, this.yesMsg = t.yes || "yes", this.yesOption =
      t.yesOption || "(Y/n)", this.noMsg = t.no || "no", this.noOption = t.noOption || "(y/N)", this.render();
    }
    reset() {
      this.value = this.initialValue, this.fire(), this.render();
    }
    exit() {
      this.abort();
    }
    abort() {
      this.done = this.aborted = !0, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    submit() {
      this.value = this.value || !1, this.done = !0, this.aborted = !1, this.fire(), this.render(), this.out.write(`
`), this.close();
    }
    _(t, r) {
      return t.toLowerCase() === "y" ? (this.value = !0, this.submit()) : t.toLowerCase() === "n" ? (this.value = !1, this.submit()) : this.
      bell();
    }
    render() {
      this.closed || (this.firstRender ? this.out.write(cD.hide) : this.out.write(lx(this.outputText, this.out.columns)), super.render(), this.
      outputText = [
        lD.symbol(this.done, this.aborted),
        uD.bold(this.msg),
        lD.delimiter(this.done),
        this.done ? this.value ? this.yesMsg : this.noMsg : uD.gray(this.initialValue ? this.yesOption : this.noOption)
      ].join(" "), this.out.write(cx.line + cD.to(0) + this.outputText));
    }
  };
  dD.exports = Pu;
});

// ../node_modules/prompts/lib/elements/index.js
var pD = b((JI, hD) => {
  "use strict";
  hD.exports = {
    TextPrompt: dp(),
    SelectPrompt: Dp(),
    TogglePrompt: bp(),
    DatePrompt: Vp(),
    NumberPrompt: Kp(),
    MultiselectPrompt: Au(),
    AutocompletePrompt: iD(),
    AutocompleteMultiselectPrompt: aD(),
    ConfirmPrompt: fD()
  };
});

// ../node_modules/prompts/lib/prompts.js
var mD = b((DD) => {
  "use strict";
  var Ue = DD, dx = pD(), Ss = /* @__PURE__ */ s((e) => e, "noop");
  function ht(e, t, r = {}) {
    return new Promise((i, n) => {
      let o = new dx[e](t), a = r.onAbort || Ss, u = r.onSubmit || Ss, l = r.onExit || Ss;
      o.on("state", t.onState || Ss), o.on("submit", (c) => i(u(c))), o.on("exit", (c) => i(l(c))), o.on("abort", (c) => n(a(c)));
    });
  }
  s(ht, "toPrompt");
  Ue.text = (e) => ht("TextPrompt", e);
  Ue.password = (e) => (e.style = "password", Ue.text(e));
  Ue.invisible = (e) => (e.style = "invisible", Ue.text(e));
  Ue.number = (e) => ht("NumberPrompt", e);
  Ue.date = (e) => ht("DatePrompt", e);
  Ue.confirm = (e) => ht("ConfirmPrompt", e);
  Ue.list = (e) => {
    let t = e.separator || ",";
    return ht("TextPrompt", e, {
      onSubmit: /* @__PURE__ */ s((r) => r.split(t).map((i) => i.trim()), "onSubmit")
    });
  };
  Ue.toggle = (e) => ht("TogglePrompt", e);
  Ue.select = (e) => ht("SelectPrompt", e);
  Ue.multiselect = (e) => {
    e.choices = [].concat(e.choices || []);
    let t = /* @__PURE__ */ s((r) => r.filter((i) => i.selected).map((i) => i.value), "toSelected");
    return ht("MultiselectPrompt", e, {
      onAbort: t,
      onSubmit: t
    });
  };
  Ue.autocompleteMultiselect = (e) => {
    e.choices = [].concat(e.choices || []);
    let t = /* @__PURE__ */ s((r) => r.filter((i) => i.selected).map((i) => i.value), "toSelected");
    return ht("AutocompleteMultiselectPrompt", e, {
      onAbort: t,
      onSubmit: t
    });
  };
  var fx = /* @__PURE__ */ s((e, t) => Promise.resolve(
    t.filter((r) => r.title.slice(0, e.length).toLowerCase() === e.toLowerCase())
  ), "byTitle");
  Ue.autocomplete = (e) => (e.suggest = e.suggest || fx, e.choices = [].concat(e.choices || []), ht("AutocompletePrompt", e));
});

// ../node_modules/prompts/lib/index.js
var bD = b((e6, yD) => {
  "use strict";
  var Iu = mD(), hx = ["suggest", "format", "onState", "validate", "onRender", "type"], gD = /* @__PURE__ */ s(() => {
  }, "noop");
  async function Gt(e = [], { onSubmit: t = gD, onCancel: r = gD } = {}) {
    let i = {}, n = Gt._override || {};
    e = [].concat(e);
    let o, a, u, l, c, d, p = /* @__PURE__ */ s(async (h, f, g = !1) => {
      if (!(!g && h.validate && h.validate(f) !== !0))
        return h.format ? await h.format(f, i) : f;
    }, "getFormattedAnswer");
    for (a of e)
      if ({ name: l, type: c } = a, typeof c == "function" && (c = await c(o, { ...i }, a), a.type = c), !!c) {
        for (let h in a) {
          if (hx.includes(h)) continue;
          let f = a[h];
          a[h] = typeof f == "function" ? await f(o, { ...i }, d) : f;
        }
        if (d = a, typeof a.message != "string")
          throw new Error("prompt message is required");
        if ({ name: l, type: c } = a, Iu[c] === void 0)
          throw new Error(`prompt type (${c}) is not defined`);
        if (n[a.name] !== void 0 && (o = await p(a, n[a.name]), o !== void 0)) {
          i[l] = o;
          continue;
        }
        try {
          o = Gt._injected ? px(Gt._injected, a.initial) : await Iu[c](a), i[l] = o = await p(a, o, !0), u = await t(a, o, i);
        } catch {
          u = !await r(a, i);
        }
        if (u) return i;
      }
    return i;
  }
  s(Gt, "prompt");
  function px(e, t) {
    let r = e.shift();
    if (r instanceof Error)
      throw r;
    return r === void 0 ? t : r;
  }
  s(px, "getInjectedAnswer");
  function Dx(e) {
    Gt._injected = (Gt._injected || []).concat(e);
  }
  s(Dx, "inject");
  function mx(e) {
    Gt._override = Object.assign({}, e);
  }
  s(mx, "override");
  yD.exports = Object.assign(Gt, { prompt: Gt, prompts: Iu, inject: Dx, override: mx });
});

// ../node_modules/prompts/index.js
var Ts = b((r6, vD) => {
  function gx(e) {
    e = (Array.isArray(e) ? e : e.split(".")).map(Number);
    let t = 0, r = process.versions.node.split(".").map(Number);
    for (; t < e.length; t++) {
      if (r[t] > e[t]) return !1;
      if (e[t] > r[t]) return !0;
    }
    return !1;
  }
  s(gx, "isNodeLT");
  vD.exports = gx("8.6.0") ? Vh() : bD();
});

// ../node_modules/picocolors/picocolors.js
var ju = b((n6, Mu) => {
  var _D = process.argv || [], As = process.env, yx = !("NO_COLOR" in As || _D.includes("--no-color")) && ("FORCE_COLOR" in As || _D.includes(
  "--color") || process.platform === "win32" || require != null && require("tty").isatty(1) && As.TERM !== "dumb" || "CI" in As), bx = /* @__PURE__ */ s(
  (e, t, r = e) => (i) => {
    let n = "" + i, o = n.indexOf(t, e.length);
    return ~o ? e + vx(n, t, r, o) + t : e + n + t;
  }, "formatter"), vx = /* @__PURE__ */ s((e, t, r, i) => {
    let n = "", o = 0;
    do
      n += e.substring(o, i) + r, o = i + t.length, i = e.indexOf(t, o);
    while (~i);
    return n + e.substring(o);
  }, "replaceClose"), wD = /* @__PURE__ */ s((e = yx) => {
    let t = e ? bx : () => String;
    return {
      isColorSupported: e,
      reset: t("\x1B[0m", "\x1B[0m"),
      bold: t("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
      dim: t("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
      italic: t("\x1B[3m", "\x1B[23m"),
      underline: t("\x1B[4m", "\x1B[24m"),
      inverse: t("\x1B[7m", "\x1B[27m"),
      hidden: t("\x1B[8m", "\x1B[28m"),
      strikethrough: t("\x1B[9m", "\x1B[29m"),
      black: t("\x1B[30m", "\x1B[39m"),
      red: t("\x1B[31m", "\x1B[39m"),
      green: t("\x1B[32m", "\x1B[39m"),
      yellow: t("\x1B[33m", "\x1B[39m"),
      blue: t("\x1B[34m", "\x1B[39m"),
      magenta: t("\x1B[35m", "\x1B[39m"),
      cyan: t("\x1B[36m", "\x1B[39m"),
      white: t("\x1B[37m", "\x1B[39m"),
      gray: t("\x1B[90m", "\x1B[39m"),
      bgBlack: t("\x1B[40m", "\x1B[49m"),
      bgRed: t("\x1B[41m", "\x1B[49m"),
      bgGreen: t("\x1B[42m", "\x1B[49m"),
      bgYellow: t("\x1B[43m", "\x1B[49m"),
      bgBlue: t("\x1B[44m", "\x1B[49m"),
      bgMagenta: t("\x1B[45m", "\x1B[49m"),
      bgCyan: t("\x1B[46m", "\x1B[49m"),
      bgWhite: t("\x1B[47m", "\x1B[49m"),
      blackBright: t("\x1B[90m", "\x1B[39m"),
      redBright: t("\x1B[91m", "\x1B[39m"),
      greenBright: t("\x1B[92m", "\x1B[39m"),
      yellowBright: t("\x1B[93m", "\x1B[39m"),
      blueBright: t("\x1B[94m", "\x1B[39m"),
      magentaBright: t("\x1B[95m", "\x1B[39m"),
      cyanBright: t("\x1B[96m", "\x1B[39m"),
      whiteBright: t("\x1B[97m", "\x1B[39m"),
      bgBlackBright: t("\x1B[100m", "\x1B[49m"),
      bgRedBright: t("\x1B[101m", "\x1B[49m"),
      bgGreenBright: t("\x1B[102m", "\x1B[49m"),
      bgYellowBright: t("\x1B[103m", "\x1B[49m"),
      bgBlueBright: t("\x1B[104m", "\x1B[49m"),
      bgMagentaBright: t("\x1B[105m", "\x1B[49m"),
      bgCyanBright: t("\x1B[106m", "\x1B[49m"),
      bgWhiteBright: t("\x1B[107m", "\x1B[49m")
    };
  }, "createColors");
  Mu.exports = wD();
  Mu.exports.createColors = wD;
});

// ../node_modules/wrappy/wrappy.js
var FD = b((c6, xD) => {
  xD.exports = CD;
  function CD(e, t) {
    if (e && t) return CD(e)(t);
    if (typeof e != "function")
      throw new TypeError("need wrapper function");
    return Object.keys(e).forEach(function(i) {
      r[i] = e[i];
    }), r;
    function r() {
      for (var i = new Array(arguments.length), n = 0; n < i.length; n++)
        i[n] = arguments[n];
      var o = e.apply(this, i), a = i[i.length - 1];
      return typeof o == "function" && o !== a && Object.keys(a).forEach(function(u) {
        o[u] = a[u];
      }), o;
    }
    s(r, "wrapper");
  }
  s(CD, "wrappy");
});

// ../node_modules/once/once.js
var ks = b((f6, Uu) => {
  var SD = FD();
  Uu.exports = SD(Rs);
  Uu.exports.strict = SD(TD);
  Rs.proto = Rs(function() {
    Object.defineProperty(Function.prototype, "once", {
      value: /* @__PURE__ */ s(function() {
        return Rs(this);
      }, "value"),
      configurable: !0
    }), Object.defineProperty(Function.prototype, "onceStrict", {
      value: /* @__PURE__ */ s(function() {
        return TD(this);
      }, "value"),
      configurable: !0
    });
  });
  function Rs(e) {
    var t = /* @__PURE__ */ s(function() {
      return t.called ? t.value : (t.called = !0, t.value = e.apply(this, arguments));
    }, "f");
    return t.called = !1, t;
  }
  s(Rs, "once");
  function TD(e) {
    var t = /* @__PURE__ */ s(function() {
      if (t.called)
        throw new Error(t.onceError);
      return t.called = !0, t.value = e.apply(this, arguments);
    }, "f"), r = e.name || "Function wrapped with `once`";
    return t.onceError = r + " shouldn't be called more than once", t.called = !1, t;
  }
  s(TD, "onceStrict");
});

// ../node_modules/end-of-stream/index.js
var ti = b((p6, RD) => {
  var xx = ks(), Fx = /* @__PURE__ */ s(function() {
  }, "noop"), Sx = /* @__PURE__ */ s(function(e) {
    return e.setHeader && typeof e.abort == "function";
  }, "isRequest"), Tx = /* @__PURE__ */ s(function(e) {
    return e.stdio && Array.isArray(e.stdio) && e.stdio.length === 3;
  }, "isChildProcess"), AD = /* @__PURE__ */ s(function(e, t, r) {
    if (typeof t == "function") return AD(e, null, t);
    t || (t = {}), r = xx(r || Fx);
    var i = e._writableState, n = e._readableState, o = t.readable || t.readable !== !1 && e.readable, a = t.writable || t.writable !== !1 &&
    e.writable, u = !1, l = /* @__PURE__ */ s(function() {
      e.writable || c();
    }, "onlegacyfinish"), c = /* @__PURE__ */ s(function() {
      a = !1, o || r.call(e);
    }, "onfinish"), d = /* @__PURE__ */ s(function() {
      o = !1, a || r.call(e);
    }, "onend"), p = /* @__PURE__ */ s(function(_) {
      r.call(e, _ ? new Error("exited with error code: " + _) : null);
    }, "onexit"), h = /* @__PURE__ */ s(function(_) {
      r.call(e, _);
    }, "onerror"), f = /* @__PURE__ */ s(function() {
      process.nextTick(g);
    }, "onclose"), g = /* @__PURE__ */ s(function() {
      if (!u) {
        if (o && !(n && n.ended && !n.destroyed)) return r.call(e, new Error("premature close"));
        if (a && !(i && i.ended && !i.destroyed)) return r.call(e, new Error("premature close"));
      }
    }, "onclosenexttick"), E = /* @__PURE__ */ s(function() {
      e.req.on("finish", c);
    }, "onrequest");
    return Sx(e) ? (e.on("complete", c), e.on("abort", f), e.req ? E() : e.on("request", E)) : a && !i && (e.on("end", l), e.on("close", l)),
    Tx(e) && e.on("exit", p), e.on("end", d), e.on("finish", c), t.error !== !1 && e.on("error", h), e.on("close", f), function() {
      u = !0, e.removeListener("complete", c), e.removeListener("abort", f), e.removeListener("request", E), e.req && e.req.removeListener("\
finish", c), e.removeListener("end", l), e.removeListener("close", l), e.removeListener("finish", c), e.removeListener("exit", p), e.removeListener(
      "end", d), e.removeListener("error", h), e.removeListener("close", f);
    };
  }, "eos");
  RD.exports = AD;
});

// ../node_modules/pump/index.js
var Wu = b((m6, OD) => {
  var Ax = ks(), Rx = ti(), $u = require("fs"), tn = /* @__PURE__ */ s(function() {
  }, "noop"), kx = /^v?\.0/.test(process.version), Os = /* @__PURE__ */ s(function(e) {
    return typeof e == "function";
  }, "isFn"), Ox = /* @__PURE__ */ s(function(e) {
    return !kx || !$u ? !1 : (e instanceof ($u.ReadStream || tn) || e instanceof ($u.WriteStream || tn)) && Os(e.close);
  }, "isFS"), Bx = /* @__PURE__ */ s(function(e) {
    return e.setHeader && Os(e.abort);
  }, "isRequest"), Px = /* @__PURE__ */ s(function(e, t, r, i) {
    i = Ax(i);
    var n = !1;
    e.on("close", function() {
      n = !0;
    }), Rx(e, { readable: t, writable: r }, function(a) {
      if (a) return i(a);
      n = !0, i();
    });
    var o = !1;
    return function(a) {
      if (!n && !o) {
        if (o = !0, Ox(e)) return e.close(tn);
        if (Bx(e)) return e.abort();
        if (Os(e.destroy)) return e.destroy();
        i(a || new Error("stream was destroyed"));
      }
    };
  }, "destroyer"), kD = /* @__PURE__ */ s(function(e) {
    e();
  }, "call"), Ix = /* @__PURE__ */ s(function(e, t) {
    return e.pipe(t);
  }, "pipe"), Mx = /* @__PURE__ */ s(function() {
    var e = Array.prototype.slice.call(arguments), t = Os(e[e.length - 1] || tn) && e.pop() || tn;
    if (Array.isArray(e[0]) && (e = e[0]), e.length < 2) throw new Error("pump requires two streams per minimum");
    var r, i = e.map(function(n, o) {
      var a = o < e.length - 1, u = o > 0;
      return Px(n, a, u, function(l) {
        r || (r = l), l && i.forEach(kD), !a && (i.forEach(kD), t(r));
      });
    });
    return e.reduce(Ix);
  }, "pump");
  OD.exports = Mx;
});

// ../node_modules/tar-fs/node_modules/chownr/chownr.js
var LD = b((y6, qD) => {
  "use strict";
  var ze = require("fs"), fr = require("path"), jx = ze.lchown ? "lchown" : "chown", qx = ze.lchownSync ? "lchownSync" : "chownSync", PD = ze.
  lchown && !process.version.match(/v1[1-9]+\./) && !process.version.match(/v10\.[6-9]/), BD = /* @__PURE__ */ s((e, t, r) => {
    try {
      return ze[qx](e, t, r);
    } catch (i) {
      if (i.code !== "ENOENT")
        throw i;
    }
  }, "lchownSync"), Lx = /* @__PURE__ */ s((e, t, r) => {
    try {
      return ze.chownSync(e, t, r);
    } catch (i) {
      if (i.code !== "ENOENT")
        throw i;
    }
  }, "chownSync"), Nx = PD ? (e, t, r, i) => (n) => {
    !n || n.code !== "EISDIR" ? i(n) : ze.chown(e, t, r, i);
  } : (e, t, r, i) => i, Hu = PD ? (e, t, r) => {
    try {
      return BD(e, t, r);
    } catch (i) {
      if (i.code !== "EISDIR")
        throw i;
      Lx(e, t, r);
    }
  } : (e, t, r) => BD(e, t, r), Ux = process.version, ID = /* @__PURE__ */ s((e, t, r) => ze.readdir(e, t, r), "readdir"), $x = /* @__PURE__ */ s(
  (e, t) => ze.readdirSync(e, t), "readdirSync");
  /^v4\./.test(Ux) && (ID = /* @__PURE__ */ s((e, t, r) => ze.readdir(e, r), "readdir"));
  var Bs = /* @__PURE__ */ s((e, t, r, i) => {
    ze[jx](e, t, r, Nx(e, t, r, (n) => {
      i(n && n.code !== "ENOENT" ? n : null);
    }));
  }, "chown"), MD = /* @__PURE__ */ s((e, t, r, i, n) => {
    if (typeof t == "string")
      return ze.lstat(fr.resolve(e, t), (o, a) => {
        if (o)
          return n(o.code !== "ENOENT" ? o : null);
        a.name = t, MD(e, a, r, i, n);
      });
    if (t.isDirectory())
      Vu(fr.resolve(e, t.name), r, i, (o) => {
        if (o)
          return n(o);
        let a = fr.resolve(e, t.name);
        Bs(a, r, i, n);
      });
    else {
      let o = fr.resolve(e, t.name);
      Bs(o, r, i, n);
    }
  }, "chownrKid"), Vu = /* @__PURE__ */ s((e, t, r, i) => {
    ID(e, { withFileTypes: !0 }, (n, o) => {
      if (n) {
        if (n.code === "ENOENT")
          return i();
        if (n.code !== "ENOTDIR" && n.code !== "ENOTSUP")
          return i(n);
      }
      if (n || !o.length)
        return Bs(e, t, r, i);
      let a = o.length, u = null, l = /* @__PURE__ */ s((c) => {
        if (!u) {
          if (c)
            return i(u = c);
          if (--a === 0)
            return Bs(e, t, r, i);
        }
      }, "then");
      o.forEach((c) => MD(e, c, t, r, l));
    });
  }, "chownr"), Wx = /* @__PURE__ */ s((e, t, r, i) => {
    if (typeof t == "string")
      try {
        let n = ze.lstatSync(fr.resolve(e, t));
        n.name = t, t = n;
      } catch (n) {
        if (n.code === "ENOENT")
          return;
        throw n;
      }
    t.isDirectory() && jD(fr.resolve(e, t.name), r, i), Hu(fr.resolve(e, t.name), r, i);
  }, "chownrKidSync"), jD = /* @__PURE__ */ s((e, t, r) => {
    let i;
    try {
      i = $x(e, { withFileTypes: !0 });
    } catch (n) {
      if (n.code === "ENOENT")
        return;
      if (n.code === "ENOTDIR" || n.code === "ENOTSUP")
        return Hu(e, t, r);
      throw n;
    }
    return i && i.length && i.forEach((n) => Wx(e, n, t, r)), Hu(e, t, r);
  }, "chownrSync");
  qD.exports = Vu;
  Vu.sync = jD;
});

// ../node_modules/readable-stream/lib/internal/streams/stream.js
var Zu = b((v6, ND) => {
  ND.exports = require("stream");
});

// ../node_modules/readable-stream/lib/internal/streams/buffer_list.js
var ZD = b((_6, VD) => {
  "use strict";
  function UD(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      t && (i = i.filter(function(n) {
        return Object.getOwnPropertyDescriptor(e, n).enumerable;
      })), r.push.apply(r, i);
    }
    return r;
  }
  s(UD, "ownKeys");
  function $D(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t] != null ? arguments[t] : {};
      t % 2 ? UD(Object(r), !0).forEach(function(i) {
        Hx(e, i, r[i]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : UD(Object(r)).forEach(function(i) {
        Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(r, i));
      });
    }
    return e;
  }
  s($D, "_objectSpread");
  function Hx(e, t, r) {
    return t = HD(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
  }
  s(Hx, "_defineProperty");
  function Vx(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  s(Vx, "_classCallCheck");
  function WD(e, t) {
    for (var r = 0; r < t.length; r++) {
      var i = t[r];
      i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, HD(i.key), i);
    }
  }
  s(WD, "_defineProperties");
  function Zx(e, t, r) {
    return t && WD(e.prototype, t), r && WD(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
  }
  s(Zx, "_createClass");
  function HD(e) {
    var t = zx(e, "string");
    return typeof t == "symbol" ? t : String(t);
  }
  s(HD, "_toPropertyKey");
  function zx(e, t) {
    if (typeof e != "object" || e === null) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
      var i = r.call(e, t || "default");
      if (typeof i != "object") return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(e);
  }
  s(zx, "_toPrimitive");
  var Gx = require("buffer"), Ps = Gx.Buffer, Kx = require("util"), zu = Kx.inspect, Yx = zu && zu.custom || "inspect";
  function Jx(e, t, r) {
    Ps.prototype.copy.call(e, t, r);
  }
  s(Jx, "copyBuffer");
  VD.exports = /* @__PURE__ */ function() {
    function e() {
      Vx(this, e), this.head = null, this.tail = null, this.length = 0;
    }
    return s(e, "BufferList"), Zx(e, [{
      key: "push",
      value: /* @__PURE__ */ s(function(r) {
        var i = {
          data: r,
          next: null
        };
        this.length > 0 ? this.tail.next = i : this.head = i, this.tail = i, ++this.length;
      }, "push")
    }, {
      key: "unshift",
      value: /* @__PURE__ */ s(function(r) {
        var i = {
          data: r,
          next: this.head
        };
        this.length === 0 && (this.tail = i), this.head = i, ++this.length;
      }, "unshift")
    }, {
      key: "shift",
      value: /* @__PURE__ */ s(function() {
        if (this.length !== 0) {
          var r = this.head.data;
          return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, r;
        }
      }, "shift")
    }, {
      key: "clear",
      value: /* @__PURE__ */ s(function() {
        this.head = this.tail = null, this.length = 0;
      }, "clear")
    }, {
      key: "join",
      value: /* @__PURE__ */ s(function(r) {
        if (this.length === 0) return "";
        for (var i = this.head, n = "" + i.data; i = i.next; ) n += r + i.data;
        return n;
      }, "join")
    }, {
      key: "concat",
      value: /* @__PURE__ */ s(function(r) {
        if (this.length === 0) return Ps.alloc(0);
        for (var i = Ps.allocUnsafe(r >>> 0), n = this.head, o = 0; n; )
          Jx(n.data, i, o), o += n.data.length, n = n.next;
        return i;
      }, "concat")
      // Consumes a specified amount of bytes or characters from the buffered data.
    }, {
      key: "consume",
      value: /* @__PURE__ */ s(function(r, i) {
        var n;
        return r < this.head.data.length ? (n = this.head.data.slice(0, r), this.head.data = this.head.data.slice(r)) : r === this.head.data.
        length ? n = this.shift() : n = i ? this._getString(r) : this._getBuffer(r), n;
      }, "consume")
    }, {
      key: "first",
      value: /* @__PURE__ */ s(function() {
        return this.head.data;
      }, "first")
      // Consumes a specified amount of characters from the buffered data.
    }, {
      key: "_getString",
      value: /* @__PURE__ */ s(function(r) {
        var i = this.head, n = 1, o = i.data;
        for (r -= o.length; i = i.next; ) {
          var a = i.data, u = r > a.length ? a.length : r;
          if (u === a.length ? o += a : o += a.slice(0, r), r -= u, r === 0) {
            u === a.length ? (++n, i.next ? this.head = i.next : this.head = this.tail = null) : (this.head = i, i.data = a.slice(u));
            break;
          }
          ++n;
        }
        return this.length -= n, o;
      }, "_getString")
      // Consumes a specified amount of bytes from the buffered data.
    }, {
      key: "_getBuffer",
      value: /* @__PURE__ */ s(function(r) {
        var i = Ps.allocUnsafe(r), n = this.head, o = 1;
        for (n.data.copy(i), r -= n.data.length; n = n.next; ) {
          var a = n.data, u = r > a.length ? a.length : r;
          if (a.copy(i, i.length - r, 0, u), r -= u, r === 0) {
            u === a.length ? (++o, n.next ? this.head = n.next : this.head = this.tail = null) : (this.head = n, n.data = a.slice(u));
            break;
          }
          ++o;
        }
        return this.length -= o, i;
      }, "_getBuffer")
      // Make sure the linked list only shows the minimal necessary information.
    }, {
      key: Yx,
      value: /* @__PURE__ */ s(function(r, i) {
        return zu(this, $D($D({}, i), {}, {
          // Only inspect one level.
          depth: 0,
          // It should not recurse.
          customInspect: !1
        }));
      }, "value")
    }]), e;
  }();
});

// ../node_modules/readable-stream/lib/internal/streams/destroy.js
var Ku = b((E6, GD) => {
  "use strict";
  function Xx(e, t) {
    var r = this, i = this._readableState && this._readableState.destroyed, n = this._writableState && this._writableState.destroyed;
    return i || n ? (t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, process.
    nextTick(Gu, this, e)) : process.nextTick(Gu, this, e)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState &&
    (this._writableState.destroyed = !0), this._destroy(e || null, function(o) {
      !t && o ? r._writableState ? r._writableState.errorEmitted ? process.nextTick(Is, r) : (r._writableState.errorEmitted = !0, process.nextTick(
      zD, r, o)) : process.nextTick(zD, r, o) : t ? (process.nextTick(Is, r), t(o)) : process.nextTick(Is, r);
    }), this);
  }
  s(Xx, "destroy");
  function zD(e, t) {
    Gu(e, t), Is(e);
  }
  s(zD, "emitErrorAndCloseNT");
  function Is(e) {
    e._writableState && !e._writableState.emitClose || e._readableState && !e._readableState.emitClose || e.emit("close");
  }
  s(Is, "emitCloseNT");
  function Qx() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.
    endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending =
    !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted =
    !1);
  }
  s(Qx, "undestroy");
  function Gu(e, t) {
    e.emit("error", t);
  }
  s(Gu, "emitErrorNT");
  function eF(e, t) {
    var r = e._readableState, i = e._writableState;
    r && r.autoDestroy || i && i.autoDestroy ? e.destroy(t) : e.emit("error", t);
  }
  s(eF, "errorOrDestroy");
  GD.exports = {
    destroy: Xx,
    undestroy: Qx,
    errorOrDestroy: eF
  };
});

// ../node_modules/readable-stream/errors.js
var Kt = b((x6, JD) => {
  "use strict";
  var YD = {};
  function Ge(e, t, r) {
    r || (r = Error);
    function i(o, a, u) {
      return typeof t == "string" ? t : t(o, a, u);
    }
    s(i, "getMessage");
    class n extends r {
      static {
        s(this, "NodeError");
      }
      constructor(a, u, l) {
        super(i(a, u, l));
      }
    }
    n.prototype.name = r.name, n.prototype.code = e, YD[e] = n;
  }
  s(Ge, "createErrorType");
  function KD(e, t) {
    if (Array.isArray(e)) {
      let r = e.length;
      return e = e.map((i) => String(i)), r > 2 ? `one of ${t} ${e.slice(0, r - 1).join(", ")}, or ` + e[r - 1] : r === 2 ? `one of ${t} ${e[0]}\
 or ${e[1]}` : `of ${t} ${e[0]}`;
    } else
      return `of ${t} ${String(e)}`;
  }
  s(KD, "oneOf");
  function tF(e, t, r) {
    return e.substr(!r || r < 0 ? 0 : +r, t.length) === t;
  }
  s(tF, "startsWith");
  function rF(e, t, r) {
    return (r === void 0 || r > e.length) && (r = e.length), e.substring(r - t.length, r) === t;
  }
  s(rF, "endsWith");
  function iF(e, t, r) {
    return typeof r != "number" && (r = 0), r + t.length > e.length ? !1 : e.indexOf(t, r) !== -1;
  }
  s(iF, "includes");
  Ge("ERR_INVALID_OPT_VALUE", function(e, t) {
    return 'The value "' + t + '" is invalid for option "' + e + '"';
  }, TypeError);
  Ge("ERR_INVALID_ARG_TYPE", function(e, t, r) {
    let i;
    typeof t == "string" && tF(t, "not ") ? (i = "must not be", t = t.replace(/^not /, "")) : i = "must be";
    let n;
    if (rF(e, " argument"))
      n = `The ${e} ${i} ${KD(t, "type")}`;
    else {
      let o = iF(e, ".") ? "property" : "argument";
      n = `The "${e}" ${o} ${i} ${KD(t, "type")}`;
    }
    return n += `. Received type ${typeof r}`, n;
  }, TypeError);
  Ge("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
  Ge("ERR_METHOD_NOT_IMPLEMENTED", function(e) {
    return "The " + e + " method is not implemented";
  });
  Ge("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
  Ge("ERR_STREAM_DESTROYED", function(e) {
    return "Cannot call " + e + " after a stream was destroyed";
  });
  Ge("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
  Ge("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
  Ge("ERR_STREAM_WRITE_AFTER_END", "write after end");
  Ge("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
  Ge("ERR_UNKNOWN_ENCODING", function(e) {
    return "Unknown encoding: " + e;
  }, TypeError);
  Ge("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
  JD.exports.codes = YD;
});

// ../node_modules/readable-stream/lib/internal/streams/state.js
var Yu = b((S6, XD) => {
  "use strict";
  var nF = Kt().codes.ERR_INVALID_OPT_VALUE;
  function sF(e, t, r) {
    return e.highWaterMark != null ? e.highWaterMark : t ? e[r] : null;
  }
  s(sF, "highWaterMarkFrom");
  function oF(e, t, r, i) {
    var n = sF(t, i, r);
    if (n != null) {
      if (!(isFinite(n) && Math.floor(n) === n) || n < 0) {
        var o = i ? r : "highWaterMark";
        throw new nF(o, n);
      }
      return Math.floor(n);
    }
    return e.objectMode ? 16 : 16 * 1024;
  }
  s(oF, "getHighWaterMark");
  XD.exports = {
    getHighWaterMark: oF
  };
});

// ../node_modules/inherits/inherits_browser.js
var QD = b((A6, Ju) => {
  typeof Object.create == "function" ? Ju.exports = /* @__PURE__ */ s(function(t, r) {
    r && (t.super_ = r, t.prototype = Object.create(r.prototype, {
      constructor: {
        value: t,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  }, "inherits") : Ju.exports = /* @__PURE__ */ s(function(t, r) {
    if (r) {
      t.super_ = r;
      var i = /* @__PURE__ */ s(function() {
      }, "TempCtor");
      i.prototype = r.prototype, t.prototype = new i(), t.prototype.constructor = t;
    }
  }, "inherits");
});

// ../node_modules/inherits/inherits.js
var oe = b((k6, Qu) => {
  try {
    if (Xu = require("util"), typeof Xu.inherits != "function") throw "";
    Qu.exports = Xu.inherits;
  } catch {
    Qu.exports = QD();
  }
  var Xu;
});

// ../node_modules/util-deprecate/node.js
var rn = b((O6, em) => {
  em.exports = require("util").deprecate;
});

// ../node_modules/readable-stream/lib/_stream_writable.js
var rl = b((B6, om) => {
  "use strict";
  om.exports = _e;
  function rm(e) {
    var t = this;
    this.next = null, this.entry = null, this.finish = function() {
      BF(t, e);
    };
  }
  s(rm, "CorkedRequest");
  var ri;
  _e.WritableState = sn;
  var aF = {
    deprecate: rn()
  }, im = Zu(), js = require("buffer").Buffer, uF = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ? self :
  {}).Uint8Array || function() {
  };
  function lF(e) {
    return js.from(e);
  }
  s(lF, "_uint8ArrayToBuffer");
  function cF(e) {
    return js.isBuffer(e) || e instanceof uF;
  }
  s(cF, "_isUint8Array");
  var tl = Ku(), dF = Yu(), fF = dF.getHighWaterMark, Yt = Kt().codes, hF = Yt.ERR_INVALID_ARG_TYPE, pF = Yt.ERR_METHOD_NOT_IMPLEMENTED, DF = Yt.
  ERR_MULTIPLE_CALLBACK, mF = Yt.ERR_STREAM_CANNOT_PIPE, gF = Yt.ERR_STREAM_DESTROYED, yF = Yt.ERR_STREAM_NULL_VALUES, bF = Yt.ERR_STREAM_WRITE_AFTER_END,
  vF = Yt.ERR_UNKNOWN_ENCODING, ii = tl.errorOrDestroy;
  oe()(_e, im);
  function _F() {
  }
  s(_F, "nop");
  function sn(e, t, r) {
    ri = ri || hr(), e = e || {}, typeof r != "boolean" && (r = t instanceof ri), this.objectMode = !!e.objectMode, r && (this.objectMode = this.
    objectMode || !!e.writableObjectMode), this.highWaterMark = fF(this, e, "writableHighWaterMark", r), this.finalCalled = !1, this.needDrain =
    !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var i = e.decodeStrings === !1;
    this.decodeStrings = !i, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync =
    !0, this.bufferProcessing = !1, this.onwrite = function(n) {
      TF(t, n);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished =
    !1, this.errorEmitted = !1, this.emitClose = e.emitClose !== !1, this.autoDestroy = !!e.autoDestroy, this.bufferedRequestCount = 0, this.
    corkedRequestsFree = new rm(this);
  }
  s(sn, "WritableState");
  sn.prototype.getBuffer = /* @__PURE__ */ s(function() {
    for (var t = this.bufferedRequest, r = []; t; )
      r.push(t), t = t.next;
    return r;
  }, "getBuffer");
  (function() {
    try {
      Object.defineProperty(sn.prototype, "buffer", {
        get: aF.deprecate(/* @__PURE__ */ s(function() {
          return this.getBuffer();
        }, "writableStateBufferGetter"), "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  })();
  var Ms;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (Ms = Function.prototype[Symbol.
  hasInstance], Object.defineProperty(_e, Symbol.hasInstance, {
    value: /* @__PURE__ */ s(function(t) {
      return Ms.call(this, t) ? !0 : this !== _e ? !1 : t && t._writableState instanceof sn;
    }, "value")
  })) : Ms = /* @__PURE__ */ s(function(t) {
    return t instanceof this;
  }, "realHasInstance");
  function _e(e) {
    ri = ri || hr();
    var t = this instanceof ri;
    if (!t && !Ms.call(_e, this)) return new _e(e);
    this._writableState = new sn(e, this, t), this.writable = !0, e && (typeof e.write == "function" && (this._write = e.write), typeof e.writev ==
    "function" && (this._writev = e.writev), typeof e.destroy == "function" && (this._destroy = e.destroy), typeof e.final == "function" && (this.
    _final = e.final)), im.call(this);
  }
  s(_e, "Writable");
  _e.prototype.pipe = function() {
    ii(this, new mF());
  };
  function wF(e, t) {
    var r = new bF();
    ii(e, r), process.nextTick(t, r);
  }
  s(wF, "writeAfterEnd");
  function EF(e, t, r, i) {
    var n;
    return r === null ? n = new yF() : typeof r != "string" && !t.objectMode && (n = new hF("chunk", ["string", "Buffer"], r)), n ? (ii(e, n),
    process.nextTick(i, n), !1) : !0;
  }
  s(EF, "validChunk");
  _e.prototype.write = function(e, t, r) {
    var i = this._writableState, n = !1, o = !i.objectMode && cF(e);
    return o && !js.isBuffer(e) && (e = lF(e)), typeof t == "function" && (r = t, t = null), o ? t = "buffer" : t || (t = i.defaultEncoding),
    typeof r != "function" && (r = _F), i.ending ? wF(this, r) : (o || EF(this, i, e, r)) && (i.pendingcb++, n = xF(this, i, o, e, t, r)), n;
  };
  _e.prototype.cork = function() {
    this._writableState.corked++;
  };
  _e.prototype.uncork = function() {
    var e = this._writableState;
    e.corked && (e.corked--, !e.writing && !e.corked && !e.bufferProcessing && e.bufferedRequest && nm(this, e));
  };
  _e.prototype.setDefaultEncoding = /* @__PURE__ */ s(function(t) {
    if (typeof t == "string" && (t = t.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "\
utf-16le", "raw"].indexOf((t + "").toLowerCase()) > -1)) throw new vF(t);
    return this._writableState.defaultEncoding = t, this;
  }, "setDefaultEncoding");
  Object.defineProperty(_e.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState && this._writableState.getBuffer();
    }, "get")
  });
  function CF(e, t, r) {
    return !e.objectMode && e.decodeStrings !== !1 && typeof t == "string" && (t = js.from(t, r)), t;
  }
  s(CF, "decodeChunk");
  Object.defineProperty(_e.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  function xF(e, t, r, i, n, o) {
    if (!r) {
      var a = CF(t, i, n);
      i !== a && (r = !0, n = "buffer", i = a);
    }
    var u = t.objectMode ? 1 : i.length;
    t.length += u;
    var l = t.length < t.highWaterMark;
    if (l || (t.needDrain = !0), t.writing || t.corked) {
      var c = t.lastBufferedRequest;
      t.lastBufferedRequest = {
        chunk: i,
        encoding: n,
        isBuf: r,
        callback: o,
        next: null
      }, c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
    } else
      el(e, t, !1, u, i, n, o);
    return l;
  }
  s(xF, "writeOrBuffer");
  function el(e, t, r, i, n, o, a) {
    t.writelen = i, t.writecb = a, t.writing = !0, t.sync = !0, t.destroyed ? t.onwrite(new gF("write")) : r ? e._writev(n, t.onwrite) : e._write(
    n, o, t.onwrite), t.sync = !1;
  }
  s(el, "doWrite");
  function FF(e, t, r, i, n) {
    --t.pendingcb, r ? (process.nextTick(n, i), process.nextTick(nn, e, t), e._writableState.errorEmitted = !0, ii(e, i)) : (n(i), e._writableState.
    errorEmitted = !0, ii(e, i), nn(e, t));
  }
  s(FF, "onwriteError");
  function SF(e) {
    e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
  }
  s(SF, "onwriteStateUpdate");
  function TF(e, t) {
    var r = e._writableState, i = r.sync, n = r.writecb;
    if (typeof n != "function") throw new DF();
    if (SF(r), t) FF(e, r, i, t, n);
    else {
      var o = sm(r) || e.destroyed;
      !o && !r.corked && !r.bufferProcessing && r.bufferedRequest && nm(e, r), i ? process.nextTick(tm, e, r, o, n) : tm(e, r, o, n);
    }
  }
  s(TF, "onwrite");
  function tm(e, t, r, i) {
    r || AF(e, t), t.pendingcb--, i(), nn(e, t);
  }
  s(tm, "afterWrite");
  function AF(e, t) {
    t.length === 0 && t.needDrain && (t.needDrain = !1, e.emit("drain"));
  }
  s(AF, "onwriteDrain");
  function nm(e, t) {
    t.bufferProcessing = !0;
    var r = t.bufferedRequest;
    if (e._writev && r && r.next) {
      var i = t.bufferedRequestCount, n = new Array(i), o = t.corkedRequestsFree;
      o.entry = r;
      for (var a = 0, u = !0; r; )
        n[a] = r, r.isBuf || (u = !1), r = r.next, a += 1;
      n.allBuffers = u, el(e, t, !0, t.length, n, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree =
      o.next, o.next = null) : t.corkedRequestsFree = new rm(t), t.bufferedRequestCount = 0;
    } else {
      for (; r; ) {
        var l = r.chunk, c = r.encoding, d = r.callback, p = t.objectMode ? 1 : l.length;
        if (el(e, t, !1, p, l, c, d), r = r.next, t.bufferedRequestCount--, t.writing)
          break;
      }
      r === null && (t.lastBufferedRequest = null);
    }
    t.bufferedRequest = r, t.bufferProcessing = !1;
  }
  s(nm, "clearBuffer");
  _e.prototype._write = function(e, t, r) {
    r(new pF("_write()"));
  };
  _e.prototype._writev = null;
  _e.prototype.end = function(e, t, r) {
    var i = this._writableState;
    return typeof e == "function" ? (r = e, e = null, t = null) : typeof t == "function" && (r = t, t = null), e != null && this.write(e, t),
    i.corked && (i.corked = 1, this.uncork()), i.ending || OF(this, i, r), this;
  };
  Object.defineProperty(_e.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.length;
    }, "get")
  });
  function sm(e) {
    return e.ending && e.length === 0 && e.bufferedRequest === null && !e.finished && !e.writing;
  }
  s(sm, "needFinish");
  function RF(e, t) {
    e._final(function(r) {
      t.pendingcb--, r && ii(e, r), t.prefinished = !0, e.emit("prefinish"), nn(e, t);
    });
  }
  s(RF, "callFinal");
  function kF(e, t) {
    !t.prefinished && !t.finalCalled && (typeof e._final == "function" && !t.destroyed ? (t.pendingcb++, t.finalCalled = !0, process.nextTick(
    RF, e, t)) : (t.prefinished = !0, e.emit("prefinish")));
  }
  s(kF, "prefinish");
  function nn(e, t) {
    var r = sm(t);
    if (r && (kF(e, t), t.pendingcb === 0 && (t.finished = !0, e.emit("finish"), t.autoDestroy))) {
      var i = e._readableState;
      (!i || i.autoDestroy && i.endEmitted) && e.destroy();
    }
    return r;
  }
  s(nn, "finishMaybe");
  function OF(e, t, r) {
    t.ending = !0, nn(e, t), r && (t.finished ? process.nextTick(r) : e.once("finish", r)), t.ended = !0, e.writable = !1;
  }
  s(OF, "endWritable");
  function BF(e, t, r) {
    var i = e.entry;
    for (e.entry = null; i; ) {
      var n = i.callback;
      t.pendingcb--, n(r), i = i.next;
    }
    t.corkedRequestsFree.next = e;
  }
  s(BF, "onCorkedFinish");
  Object.defineProperty(_e.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(t) {
      this._writableState && (this._writableState.destroyed = t);
    }, "set")
  });
  _e.prototype.destroy = tl.destroy;
  _e.prototype._undestroy = tl.undestroy;
  _e.prototype._destroy = function(e, t) {
    t(e);
  };
});

// ../node_modules/readable-stream/lib/_stream_duplex.js
var hr = b((I6, um) => {
  "use strict";
  var PF = Object.keys || function(e) {
    var t = [];
    for (var r in e) t.push(r);
    return t;
  };
  um.exports = pt;
  var am = sl(), nl = rl();
  oe()(pt, am);
  for (il = PF(nl.prototype), qs = 0; qs < il.length; qs++)
    Ls = il[qs], pt.prototype[Ls] || (pt.prototype[Ls] = nl.prototype[Ls]);
  var il, Ls, qs;
  function pt(e) {
    if (!(this instanceof pt)) return new pt(e);
    am.call(this, e), nl.call(this, e), this.allowHalfOpen = !0, e && (e.readable === !1 && (this.readable = !1), e.writable === !1 && (this.
    writable = !1), e.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", IF)));
  }
  s(pt, "Duplex");
  Object.defineProperty(pt.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  Object.defineProperty(pt.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState && this._writableState.getBuffer();
    }, "get")
  });
  Object.defineProperty(pt.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.length;
    }, "get")
  });
  function IF() {
    this._writableState.ended || process.nextTick(MF, this);
  }
  s(IF, "onend");
  function MF(e) {
    e.end();
  }
  s(MF, "onEndNT");
  Object.defineProperty(pt.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(t) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = t, this._writableState.destroyed =
      t);
    }, "set")
  });
});

// ../node_modules/readable-stream/lib/internal/streams/end-of-stream.js
var Ns = b((j6, dm) => {
  "use strict";
  var lm = Kt().codes.ERR_STREAM_PREMATURE_CLOSE;
  function jF(e) {
    var t = !1;
    return function() {
      if (!t) {
        t = !0;
        for (var r = arguments.length, i = new Array(r), n = 0; n < r; n++)
          i[n] = arguments[n];
        e.apply(this, i);
      }
    };
  }
  s(jF, "once");
  function qF() {
  }
  s(qF, "noop");
  function LF(e) {
    return e.setHeader && typeof e.abort == "function";
  }
  s(LF, "isRequest");
  function cm(e, t, r) {
    if (typeof t == "function") return cm(e, null, t);
    t || (t = {}), r = jF(r || qF);
    var i = t.readable || t.readable !== !1 && e.readable, n = t.writable || t.writable !== !1 && e.writable, o = /* @__PURE__ */ s(function() {
      e.writable || u();
    }, "onlegacyfinish"), a = e._writableState && e._writableState.finished, u = /* @__PURE__ */ s(function() {
      n = !1, a = !0, i || r.call(e);
    }, "onfinish"), l = e._readableState && e._readableState.endEmitted, c = /* @__PURE__ */ s(function() {
      i = !1, l = !0, n || r.call(e);
    }, "onend"), d = /* @__PURE__ */ s(function(g) {
      r.call(e, g);
    }, "onerror"), p = /* @__PURE__ */ s(function() {
      var g;
      if (i && !l)
        return (!e._readableState || !e._readableState.ended) && (g = new lm()), r.call(e, g);
      if (n && !a)
        return (!e._writableState || !e._writableState.ended) && (g = new lm()), r.call(e, g);
    }, "onclose"), h = /* @__PURE__ */ s(function() {
      e.req.on("finish", u);
    }, "onrequest");
    return LF(e) ? (e.on("complete", u), e.on("abort", p), e.req ? h() : e.on("request", h)) : n && !e._writableState && (e.on("end", o), e.
    on("close", o)), e.on("end", c), e.on("finish", u), t.error !== !1 && e.on("error", d), e.on("close", p), function() {
      e.removeListener("complete", u), e.removeListener("abort", p), e.removeListener("request", h), e.req && e.req.removeListener("finish",
      u), e.removeListener("end", o), e.removeListener("close", o), e.removeListener("finish", u), e.removeListener("end", c), e.removeListener(
      "error", d), e.removeListener("close", p);
    };
  }
  s(cm, "eos");
  dm.exports = cm;
});

// ../node_modules/readable-stream/lib/internal/streams/async_iterator.js
var hm = b((L6, fm) => {
  "use strict";
  var Us;
  function Jt(e, t, r) {
    return t = NF(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
  }
  s(Jt, "_defineProperty");
  function NF(e) {
    var t = UF(e, "string");
    return typeof t == "symbol" ? t : String(t);
  }
  s(NF, "_toPropertyKey");
  function UF(e, t) {
    if (typeof e != "object" || e === null) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
      var i = r.call(e, t || "default");
      if (typeof i != "object") return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(e);
  }
  s(UF, "_toPrimitive");
  var $F = Ns(), Xt = Symbol("lastResolve"), pr = Symbol("lastReject"), on = Symbol("error"), $s = Symbol("ended"), Dr = Symbol("lastPromise"),
  ol = Symbol("handlePromise"), mr = Symbol("stream");
  function Qt(e, t) {
    return {
      value: e,
      done: t
    };
  }
  s(Qt, "createIterResult");
  function WF(e) {
    var t = e[Xt];
    if (t !== null) {
      var r = e[mr].read();
      r !== null && (e[Dr] = null, e[Xt] = null, e[pr] = null, t(Qt(r, !1)));
    }
  }
  s(WF, "readAndResolve");
  function HF(e) {
    process.nextTick(WF, e);
  }
  s(HF, "onReadable");
  function VF(e, t) {
    return function(r, i) {
      e.then(function() {
        if (t[$s]) {
          r(Qt(void 0, !0));
          return;
        }
        t[ol](r, i);
      }, i);
    };
  }
  s(VF, "wrapForNext");
  var ZF = Object.getPrototypeOf(function() {
  }), zF = Object.setPrototypeOf((Us = {
    get stream() {
      return this[mr];
    },
    next: /* @__PURE__ */ s(function() {
      var t = this, r = this[on];
      if (r !== null)
        return Promise.reject(r);
      if (this[$s])
        return Promise.resolve(Qt(void 0, !0));
      if (this[mr].destroyed)
        return new Promise(function(a, u) {
          process.nextTick(function() {
            t[on] ? u(t[on]) : a(Qt(void 0, !0));
          });
        });
      var i = this[Dr], n;
      if (i)
        n = new Promise(VF(i, this));
      else {
        var o = this[mr].read();
        if (o !== null)
          return Promise.resolve(Qt(o, !1));
        n = new Promise(this[ol]);
      }
      return this[Dr] = n, n;
    }, "next")
  }, Jt(Us, Symbol.asyncIterator, function() {
    return this;
  }), Jt(Us, "return", /* @__PURE__ */ s(function() {
    var t = this;
    return new Promise(function(r, i) {
      t[mr].destroy(null, function(n) {
        if (n) {
          i(n);
          return;
        }
        r(Qt(void 0, !0));
      });
    });
  }, "_return")), Us), ZF), GF = /* @__PURE__ */ s(function(t) {
    var r, i = Object.create(zF, (r = {}, Jt(r, mr, {
      value: t,
      writable: !0
    }), Jt(r, Xt, {
      value: null,
      writable: !0
    }), Jt(r, pr, {
      value: null,
      writable: !0
    }), Jt(r, on, {
      value: null,
      writable: !0
    }), Jt(r, $s, {
      value: t._readableState.endEmitted,
      writable: !0
    }), Jt(r, ol, {
      value: /* @__PURE__ */ s(function(o, a) {
        var u = i[mr].read();
        u ? (i[Dr] = null, i[Xt] = null, i[pr] = null, o(Qt(u, !1))) : (i[Xt] = o, i[pr] = a);
      }, "value"),
      writable: !0
    }), r));
    return i[Dr] = null, $F(t, function(n) {
      if (n && n.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var o = i[pr];
        o !== null && (i[Dr] = null, i[Xt] = null, i[pr] = null, o(n)), i[on] = n;
        return;
      }
      var a = i[Xt];
      a !== null && (i[Dr] = null, i[Xt] = null, i[pr] = null, a(Qt(void 0, !0))), i[$s] = !0;
    }), t.on("readable", HF.bind(null, i)), i;
  }, "createReadableStreamAsyncIterator");
  fm.exports = GF;
});

// ../node_modules/readable-stream/lib/internal/streams/from.js
var gm = b((U6, mm) => {
  "use strict";
  function pm(e, t, r, i, n, o, a) {
    try {
      var u = e[o](a), l = u.value;
    } catch (c) {
      r(c);
      return;
    }
    u.done ? t(l) : Promise.resolve(l).then(i, n);
  }
  s(pm, "asyncGeneratorStep");
  function KF(e) {
    return function() {
      var t = this, r = arguments;
      return new Promise(function(i, n) {
        var o = e.apply(t, r);
        function a(l) {
          pm(o, i, n, a, u, "next", l);
        }
        s(a, "_next");
        function u(l) {
          pm(o, i, n, a, u, "throw", l);
        }
        s(u, "_throw"), a(void 0);
      });
    };
  }
  s(KF, "_asyncToGenerator");
  function Dm(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      t && (i = i.filter(function(n) {
        return Object.getOwnPropertyDescriptor(e, n).enumerable;
      })), r.push.apply(r, i);
    }
    return r;
  }
  s(Dm, "ownKeys");
  function YF(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t] != null ? arguments[t] : {};
      t % 2 ? Dm(Object(r), !0).forEach(function(i) {
        JF(e, i, r[i]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : Dm(Object(r)).forEach(function(i) {
        Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(r, i));
      });
    }
    return e;
  }
  s(YF, "_objectSpread");
  function JF(e, t, r) {
    return t = XF(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
  }
  s(JF, "_defineProperty");
  function XF(e) {
    var t = QF(e, "string");
    return typeof t == "symbol" ? t : String(t);
  }
  s(XF, "_toPropertyKey");
  function QF(e, t) {
    if (typeof e != "object" || e === null) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
      var i = r.call(e, t || "default");
      if (typeof i != "object") return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(e);
  }
  s(QF, "_toPrimitive");
  var e2 = Kt().codes.ERR_INVALID_ARG_TYPE;
  function t2(e, t, r) {
    var i;
    if (t && typeof t.next == "function")
      i = t;
    else if (t && t[Symbol.asyncIterator]) i = t[Symbol.asyncIterator]();
    else if (t && t[Symbol.iterator]) i = t[Symbol.iterator]();
    else throw new e2("iterable", ["Iterable"], t);
    var n = new e(YF({
      objectMode: !0
    }, r)), o = !1;
    n._read = function() {
      o || (o = !0, a());
    };
    function a() {
      return u.apply(this, arguments);
    }
    s(a, "next");
    function u() {
      return u = KF(function* () {
        try {
          var l = yield i.next(), c = l.value, d = l.done;
          d ? n.push(null) : n.push(yield c) ? a() : o = !1;
        } catch (p) {
          n.destroy(p);
        }
      }), u.apply(this, arguments);
    }
    return s(u, "_next2"), n;
  }
  s(t2, "from");
  mm.exports = t2;
});

// ../node_modules/readable-stream/lib/_stream_readable.js
var sl = b((H6, Sm) => {
  "use strict";
  Sm.exports = G;
  var ni;
  G.ReadableState = _m;
  var W6 = require("events").EventEmitter, vm = /* @__PURE__ */ s(function(t, r) {
    return t.listeners(r).length;
  }, "EElistenerCount"), un = Zu(), Ws = require("buffer").Buffer, r2 = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self <
  "u" ? self : {}).Uint8Array || function() {
  };
  function i2(e) {
    return Ws.from(e);
  }
  s(i2, "_uint8ArrayToBuffer");
  function n2(e) {
    return Ws.isBuffer(e) || e instanceof r2;
  }
  s(n2, "_isUint8Array");
  var al = require("util"), V;
  al && al.debuglog ? V = al.debuglog("stream") : V = /* @__PURE__ */ s(function() {
  }, "debug");
  var s2 = ZD(), pl = Ku(), o2 = Yu(), a2 = o2.getHighWaterMark, Hs = Kt().codes, u2 = Hs.ERR_INVALID_ARG_TYPE, l2 = Hs.ERR_STREAM_PUSH_AFTER_EOF,
  c2 = Hs.ERR_METHOD_NOT_IMPLEMENTED, d2 = Hs.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, si, ul, ll;
  oe()(G, un);
  var an = pl.errorOrDestroy, cl = ["error", "close", "destroy", "pause", "resume"];
  function f2(e, t, r) {
    if (typeof e.prependListener == "function") return e.prependListener(t, r);
    !e._events || !e._events[t] ? e.on(t, r) : Array.isArray(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]];
  }
  s(f2, "prependListener");
  function _m(e, t, r) {
    ni = ni || hr(), e = e || {}, typeof r != "boolean" && (r = t instanceof ni), this.objectMode = !!e.objectMode, r && (this.objectMode = this.
    objectMode || !!e.readableObjectMode), this.highWaterMark = a2(this, e, "readableHighWaterMark", r), this.buffer = new s2(), this.length =
    0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0,
    this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose =
    e.emitClose !== !1, this.autoDestroy = !!e.autoDestroy, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain =
    0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (si || (si = require("string_decoder/").StringDecoder),
    this.decoder = new si(e.encoding), this.encoding = e.encoding);
  }
  s(_m, "ReadableState");
  function G(e) {
    if (ni = ni || hr(), !(this instanceof G)) return new G(e);
    var t = this instanceof ni;
    this._readableState = new _m(e, this, t), this.readable = !0, e && (typeof e.read == "function" && (this._read = e.read), typeof e.destroy ==
    "function" && (this._destroy = e.destroy)), un.call(this);
  }
  s(G, "Readable");
  Object.defineProperty(G.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(t) {
      this._readableState && (this._readableState.destroyed = t);
    }, "set")
  });
  G.prototype.destroy = pl.destroy;
  G.prototype._undestroy = pl.undestroy;
  G.prototype._destroy = function(e, t) {
    t(e);
  };
  G.prototype.push = function(e, t) {
    var r = this._readableState, i;
    return r.objectMode ? i = !0 : typeof e == "string" && (t = t || r.defaultEncoding, t !== r.encoding && (e = Ws.from(e, t), t = ""), i =
    !0), wm(this, e, t, !1, i);
  };
  G.prototype.unshift = function(e) {
    return wm(this, e, null, !0, !1);
  };
  function wm(e, t, r, i, n) {
    V("readableAddChunk", t);
    var o = e._readableState;
    if (t === null)
      o.reading = !1, D2(e, o);
    else {
      var a;
      if (n || (a = h2(o, t)), a)
        an(e, a);
      else if (o.objectMode || t && t.length > 0)
        if (typeof t != "string" && !o.objectMode && Object.getPrototypeOf(t) !== Ws.prototype && (t = i2(t)), i)
          o.endEmitted ? an(e, new d2()) : dl(e, o, t, !0);
        else if (o.ended)
          an(e, new l2());
        else {
          if (o.destroyed)
            return !1;
          o.reading = !1, o.decoder && !r ? (t = o.decoder.write(t), o.objectMode || t.length !== 0 ? dl(e, o, t, !1) : hl(e, o)) : dl(e, o,
          t, !1);
        }
      else i || (o.reading = !1, hl(e, o));
    }
    return !o.ended && (o.length < o.highWaterMark || o.length === 0);
  }
  s(wm, "readableAddChunk");
  function dl(e, t, r, i) {
    t.flowing && t.length === 0 && !t.sync ? (t.awaitDrain = 0, e.emit("data", r)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.
    unshift(r) : t.buffer.push(r), t.needReadable && Vs(e)), hl(e, t);
  }
  s(dl, "addChunk");
  function h2(e, t) {
    var r;
    return !n2(t) && typeof t != "string" && t !== void 0 && !e.objectMode && (r = new u2("chunk", ["string", "Buffer", "Uint8Array"], t)), r;
  }
  s(h2, "chunkInvalid");
  G.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  };
  G.prototype.setEncoding = function(e) {
    si || (si = require("string_decoder/").StringDecoder);
    var t = new si(e);
    this._readableState.decoder = t, this._readableState.encoding = this._readableState.decoder.encoding;
    for (var r = this._readableState.buffer.head, i = ""; r !== null; )
      i += t.write(r.data), r = r.next;
    return this._readableState.buffer.clear(), i !== "" && this._readableState.buffer.push(i), this._readableState.length = i.length, this;
  };
  var ym = 1073741824;
  function p2(e) {
    return e >= ym ? e = ym : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
  }
  s(p2, "computeNewHighWaterMark");
  function bm(e, t) {
    return e <= 0 || t.length === 0 && t.ended ? 0 : t.objectMode ? 1 : e !== e ? t.flowing && t.length ? t.buffer.head.data.length : t.length :
    (e > t.highWaterMark && (t.highWaterMark = p2(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
  }
  s(bm, "howMuchToRead");
  G.prototype.read = function(e) {
    V("read", e), e = parseInt(e, 10);
    var t = this._readableState, r = e;
    if (e !== 0 && (t.emittedReadable = !1), e === 0 && t.needReadable && ((t.highWaterMark !== 0 ? t.length >= t.highWaterMark : t.length >
    0) || t.ended))
      return V("read: emitReadable", t.length, t.ended), t.length === 0 && t.ended ? fl(this) : Vs(this), null;
    if (e = bm(e, t), e === 0 && t.ended)
      return t.length === 0 && fl(this), null;
    var i = t.needReadable;
    V("need readable", i), (t.length === 0 || t.length - e < t.highWaterMark) && (i = !0, V("length less than watermark", i)), t.ended || t.
    reading ? (i = !1, V("reading or ended", i)) : i && (V("do read"), t.reading = !0, t.sync = !0, t.length === 0 && (t.needReadable = !0),
    this._read(t.highWaterMark), t.sync = !1, t.reading || (e = bm(r, t)));
    var n;
    return e > 0 ? n = xm(e, t) : n = null, n === null ? (t.needReadable = t.length <= t.highWaterMark, e = 0) : (t.length -= e, t.awaitDrain =
    0), t.length === 0 && (t.ended || (t.needReadable = !0), r !== e && t.ended && fl(this)), n !== null && this.emit("data", n), n;
  };
  function D2(e, t) {
    if (V("onEofChunk"), !t.ended) {
      if (t.decoder) {
        var r = t.decoder.end();
        r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
      }
      t.ended = !0, t.sync ? Vs(e) : (t.needReadable = !1, t.emittedReadable || (t.emittedReadable = !0, Em(e)));
    }
  }
  s(D2, "onEofChunk");
  function Vs(e) {
    var t = e._readableState;
    V("emitReadable", t.needReadable, t.emittedReadable), t.needReadable = !1, t.emittedReadable || (V("emitReadable", t.flowing), t.emittedReadable =
    !0, process.nextTick(Em, e));
  }
  s(Vs, "emitReadable");
  function Em(e) {
    var t = e._readableState;
    V("emitReadable_", t.destroyed, t.length, t.ended), !t.destroyed && (t.length || t.ended) && (e.emit("readable"), t.emittedReadable = !1),
    t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark, Dl(e);
  }
  s(Em, "emitReadable_");
  function hl(e, t) {
    t.readingMore || (t.readingMore = !0, process.nextTick(m2, e, t));
  }
  s(hl, "maybeReadMore");
  function m2(e, t) {
    for (; !t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && t.length === 0); ) {
      var r = t.length;
      if (V("maybeReadMore read 0"), e.read(0), r === t.length)
        break;
    }
    t.readingMore = !1;
  }
  s(m2, "maybeReadMore_");
  G.prototype._read = function(e) {
    an(this, new c2("_read()"));
  };
  G.prototype.pipe = function(e, t) {
    var r = this, i = this._readableState;
    switch (i.pipesCount) {
      case 0:
        i.pipes = e;
        break;
      case 1:
        i.pipes = [i.pipes, e];
        break;
      default:
        i.pipes.push(e);
        break;
    }
    i.pipesCount += 1, V("pipe count=%d opts=%j", i.pipesCount, t);
    var n = (!t || t.end !== !1) && e !== process.stdout && e !== process.stderr, o = n ? u : E;
    i.endEmitted ? process.nextTick(o) : r.once("end", o), e.on("unpipe", a);
    function a(_, C) {
      V("onunpipe"), _ === r && C && C.hasUnpiped === !1 && (C.hasUnpiped = !0, d());
    }
    s(a, "onunpipe");
    function u() {
      V("onend"), e.end();
    }
    s(u, "onend");
    var l = g2(r);
    e.on("drain", l);
    var c = !1;
    function d() {
      V("cleanup"), e.removeListener("close", f), e.removeListener("finish", g), e.removeListener("drain", l), e.removeListener("error", h),
      e.removeListener("unpipe", a), r.removeListener("end", u), r.removeListener("end", E), r.removeListener("data", p), c = !0, i.awaitDrain &&
      (!e._writableState || e._writableState.needDrain) && l();
    }
    s(d, "cleanup"), r.on("data", p);
    function p(_) {
      V("ondata");
      var C = e.write(_);
      V("dest.write", C), C === !1 && ((i.pipesCount === 1 && i.pipes === e || i.pipesCount > 1 && Fm(i.pipes, e) !== -1) && !c && (V("false\
 write response, pause", i.awaitDrain), i.awaitDrain++), r.pause());
    }
    s(p, "ondata");
    function h(_) {
      V("onerror", _), E(), e.removeListener("error", h), vm(e, "error") === 0 && an(e, _);
    }
    s(h, "onerror"), f2(e, "error", h);
    function f() {
      e.removeListener("finish", g), E();
    }
    s(f, "onclose"), e.once("close", f);
    function g() {
      V("onfinish"), e.removeListener("close", f), E();
    }
    s(g, "onfinish"), e.once("finish", g);
    function E() {
      V("unpipe"), r.unpipe(e);
    }
    return s(E, "unpipe"), e.emit("pipe", r), i.flowing || (V("pipe resume"), r.resume()), e;
  };
  function g2(e) {
    return /* @__PURE__ */ s(function() {
      var r = e._readableState;
      V("pipeOnDrain", r.awaitDrain), r.awaitDrain && r.awaitDrain--, r.awaitDrain === 0 && vm(e, "data") && (r.flowing = !0, Dl(e));
    }, "pipeOnDrainFunctionResult");
  }
  s(g2, "pipeOnDrain");
  G.prototype.unpipe = function(e) {
    var t = this._readableState, r = {
      hasUnpiped: !1
    };
    if (t.pipesCount === 0) return this;
    if (t.pipesCount === 1)
      return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r),
      this);
    if (!e) {
      var i = t.pipes, n = t.pipesCount;
      t.pipes = null, t.pipesCount = 0, t.flowing = !1;
      for (var o = 0; o < n; o++) i[o].emit("unpipe", this, {
        hasUnpiped: !1
      });
      return this;
    }
    var a = Fm(t.pipes, e);
    return a === -1 ? this : (t.pipes.splice(a, 1), t.pipesCount -= 1, t.pipesCount === 1 && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r),
    this);
  };
  G.prototype.on = function(e, t) {
    var r = un.prototype.on.call(this, e, t), i = this._readableState;
    return e === "data" ? (i.readableListening = this.listenerCount("readable") > 0, i.flowing !== !1 && this.resume()) : e === "readable" &&
    !i.endEmitted && !i.readableListening && (i.readableListening = i.needReadable = !0, i.flowing = !1, i.emittedReadable = !1, V("on reada\
ble", i.length, i.reading), i.length ? Vs(this) : i.reading || process.nextTick(y2, this)), r;
  };
  G.prototype.addListener = G.prototype.on;
  G.prototype.removeListener = function(e, t) {
    var r = un.prototype.removeListener.call(this, e, t);
    return e === "readable" && process.nextTick(Cm, this), r;
  };
  G.prototype.removeAllListeners = function(e) {
    var t = un.prototype.removeAllListeners.apply(this, arguments);
    return (e === "readable" || e === void 0) && process.nextTick(Cm, this), t;
  };
  function Cm(e) {
    var t = e._readableState;
    t.readableListening = e.listenerCount("readable") > 0, t.resumeScheduled && !t.paused ? t.flowing = !0 : e.listenerCount("data") > 0 && e.
    resume();
  }
  s(Cm, "updateReadableListening");
  function y2(e) {
    V("readable nexttick read 0"), e.read(0);
  }
  s(y2, "nReadingNextTick");
  G.prototype.resume = function() {
    var e = this._readableState;
    return e.flowing || (V("resume"), e.flowing = !e.readableListening, b2(this, e)), e.paused = !1, this;
  };
  function b2(e, t) {
    t.resumeScheduled || (t.resumeScheduled = !0, process.nextTick(v2, e, t));
  }
  s(b2, "resume");
  function v2(e, t) {
    V("resume", t.reading), t.reading || e.read(0), t.resumeScheduled = !1, e.emit("resume"), Dl(e), t.flowing && !t.reading && e.read(0);
  }
  s(v2, "resume_");
  G.prototype.pause = function() {
    return V("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (V("pause"), this._readableState.flowing =
    !1, this.emit("pause")), this._readableState.paused = !0, this;
  };
  function Dl(e) {
    var t = e._readableState;
    for (V("flow", t.flowing); t.flowing && e.read() !== null; ) ;
  }
  s(Dl, "flow");
  G.prototype.wrap = function(e) {
    var t = this, r = this._readableState, i = !1;
    e.on("end", function() {
      if (V("wrapped end"), r.decoder && !r.ended) {
        var a = r.decoder.end();
        a && a.length && t.push(a);
      }
      t.push(null);
    }), e.on("data", function(a) {
      if (V("wrapped data"), r.decoder && (a = r.decoder.write(a)), !(r.objectMode && a == null) && !(!r.objectMode && (!a || !a.length))) {
        var u = t.push(a);
        u || (i = !0, e.pause());
      }
    });
    for (var n in e)
      this[n] === void 0 && typeof e[n] == "function" && (this[n] = (/* @__PURE__ */ s(function(u) {
        return /* @__PURE__ */ s(function() {
          return e[u].apply(e, arguments);
        }, "methodWrapReturnFunction");
      }, "methodWrap"))(n));
    for (var o = 0; o < cl.length; o++)
      e.on(cl[o], this.emit.bind(this, cl[o]));
    return this._read = function(a) {
      V("wrapped _read", a), i && (i = !1, e.resume());
    }, this;
  };
  typeof Symbol == "function" && (G.prototype[Symbol.asyncIterator] = function() {
    return ul === void 0 && (ul = hm()), ul(this);
  });
  Object.defineProperty(G.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._readableState.highWaterMark;
    }, "get")
  });
  Object.defineProperty(G.prototype, "readableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._readableState && this._readableState.buffer;
    }, "get")
  });
  Object.defineProperty(G.prototype, "readableFlowing", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._readableState.flowing;
    }, "get"),
    set: /* @__PURE__ */ s(function(t) {
      this._readableState && (this._readableState.flowing = t);
    }, "set")
  });
  G._fromList = xm;
  Object.defineProperty(G.prototype, "readableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._readableState.length;
    }, "get")
  });
  function xm(e, t) {
    if (t.length === 0) return null;
    var r;
    return t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (t.decoder ? r = t.buffer.join("") : t.buffer.length === 1 ? r = t.buffer.
    first() : r = t.buffer.concat(t.length), t.buffer.clear()) : r = t.buffer.consume(e, t.decoder), r;
  }
  s(xm, "fromList");
  function fl(e) {
    var t = e._readableState;
    V("endReadable", t.endEmitted), t.endEmitted || (t.ended = !0, process.nextTick(_2, t, e));
  }
  s(fl, "endReadable");
  function _2(e, t) {
    if (V("endReadableNT", e.endEmitted, e.length), !e.endEmitted && e.length === 0 && (e.endEmitted = !0, t.readable = !1, t.emit("end"), e.
    autoDestroy)) {
      var r = t._writableState;
      (!r || r.autoDestroy && r.finished) && t.destroy();
    }
  }
  s(_2, "endReadableNT");
  typeof Symbol == "function" && (G.from = function(e, t) {
    return ll === void 0 && (ll = gm()), ll(G, e, t);
  });
  function Fm(e, t) {
    for (var r = 0, i = e.length; r < i; r++)
      if (e[r] === t) return r;
    return -1;
  }
  s(Fm, "indexOf");
});

// ../node_modules/readable-stream/lib/_stream_transform.js
var ml = b((Z6, Am) => {
  "use strict";
  Am.exports = At;
  var Zs = Kt().codes, w2 = Zs.ERR_METHOD_NOT_IMPLEMENTED, E2 = Zs.ERR_MULTIPLE_CALLBACK, C2 = Zs.ERR_TRANSFORM_ALREADY_TRANSFORMING, x2 = Zs.
  ERR_TRANSFORM_WITH_LENGTH_0, zs = hr();
  oe()(At, zs);
  function F2(e, t) {
    var r = this._transformState;
    r.transforming = !1;
    var i = r.writecb;
    if (i === null)
      return this.emit("error", new E2());
    r.writechunk = null, r.writecb = null, t != null && this.push(t), i(e);
    var n = this._readableState;
    n.reading = !1, (n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
  }
  s(F2, "afterTransform");
  function At(e) {
    if (!(this instanceof At)) return new At(e);
    zs.call(this, e), this._transformState = {
      afterTransform: F2.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && (typeof e.transform == "function" && (this._transform = e.
    transform), typeof e.flush == "function" && (this._flush = e.flush)), this.on("prefinish", S2);
  }
  s(At, "Transform");
  function S2() {
    var e = this;
    typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(t, r) {
      Tm(e, t, r);
    }) : Tm(this, null, null);
  }
  s(S2, "prefinish");
  At.prototype.push = function(e, t) {
    return this._transformState.needTransform = !1, zs.prototype.push.call(this, e, t);
  };
  At.prototype._transform = function(e, t, r) {
    r(new w2("_transform()"));
  };
  At.prototype._write = function(e, t, r) {
    var i = this._transformState;
    if (i.writecb = r, i.writechunk = e, i.writeencoding = t, !i.transforming) {
      var n = this._readableState;
      (i.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
    }
  };
  At.prototype._read = function(e) {
    var t = this._transformState;
    t.writechunk !== null && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform =
    !0;
  };
  At.prototype._destroy = function(e, t) {
    zs.prototype._destroy.call(this, e, function(r) {
      t(r);
    });
  };
  function Tm(e, t, r) {
    if (t) return e.emit("error", t);
    if (r != null && e.push(r), e._writableState.length) throw new x2();
    if (e._transformState.transforming) throw new C2();
    return e.push(null);
  }
  s(Tm, "done");
});

// ../node_modules/readable-stream/lib/_stream_passthrough.js
var Om = b((G6, km) => {
  "use strict";
  km.exports = ln;
  var Rm = ml();
  oe()(ln, Rm);
  function ln(e) {
    if (!(this instanceof ln)) return new ln(e);
    Rm.call(this, e);
  }
  s(ln, "PassThrough");
  ln.prototype._transform = function(e, t, r) {
    r(null, e);
  };
});

// ../node_modules/readable-stream/lib/internal/streams/pipeline.js
var jm = b((Y6, Mm) => {
  "use strict";
  var gl;
  function T2(e) {
    var t = !1;
    return function() {
      t || (t = !0, e.apply(void 0, arguments));
    };
  }
  s(T2, "once");
  var Im = Kt().codes, A2 = Im.ERR_MISSING_ARGS, R2 = Im.ERR_STREAM_DESTROYED;
  function Bm(e) {
    if (e) throw e;
  }
  s(Bm, "noop");
  function k2(e) {
    return e.setHeader && typeof e.abort == "function";
  }
  s(k2, "isRequest");
  function O2(e, t, r, i) {
    i = T2(i);
    var n = !1;
    e.on("close", function() {
      n = !0;
    }), gl === void 0 && (gl = Ns()), gl(e, {
      readable: t,
      writable: r
    }, function(a) {
      if (a) return i(a);
      n = !0, i();
    });
    var o = !1;
    return function(a) {
      if (!n && !o) {
        if (o = !0, k2(e)) return e.abort();
        if (typeof e.destroy == "function") return e.destroy();
        i(a || new R2("pipe"));
      }
    };
  }
  s(O2, "destroyer");
  function Pm(e) {
    e();
  }
  s(Pm, "call");
  function B2(e, t) {
    return e.pipe(t);
  }
  s(B2, "pipe");
  function P2(e) {
    return !e.length || typeof e[e.length - 1] != "function" ? Bm : e.pop();
  }
  s(P2, "popCallback");
  function I2() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
      t[r] = arguments[r];
    var i = P2(t);
    if (Array.isArray(t[0]) && (t = t[0]), t.length < 2)
      throw new A2("streams");
    var n, o = t.map(function(a, u) {
      var l = u < t.length - 1, c = u > 0;
      return O2(a, l, c, function(d) {
        n || (n = d), d && o.forEach(Pm), !l && (o.forEach(Pm), i(n));
      });
    });
    return t.reduce(B2);
  }
  s(I2, "pipeline");
  Mm.exports = I2;
});

// ../node_modules/readable-stream/readable.js
var oi = b((Ke, dn) => {
  var cn = require("stream");
  process.env.READABLE_STREAM === "disable" && cn ? (dn.exports = cn.Readable, Object.assign(dn.exports, cn), dn.exports.Stream = cn) : (Ke =
  dn.exports = sl(), Ke.Stream = cn || Ke, Ke.Readable = Ke, Ke.Writable = rl(), Ke.Duplex = hr(), Ke.Transform = ml(), Ke.PassThrough = Om(),
  Ke.finished = Ns(), Ke.pipeline = jm());
});

// ../node_modules/bl/BufferList.js
var Nm = b((X6, Lm) => {
  "use strict";
  var { Buffer: it } = require("buffer"), qm = Symbol.for("BufferList");
  function ae(e) {
    if (!(this instanceof ae))
      return new ae(e);
    ae._init.call(this, e);
  }
  s(ae, "BufferList");
  ae._init = /* @__PURE__ */ s(function(t) {
    Object.defineProperty(this, qm, { value: !0 }), this._bufs = [], this.length = 0, t && this.append(t);
  }, "_init");
  ae.prototype._new = /* @__PURE__ */ s(function(t) {
    return new ae(t);
  }, "_new");
  ae.prototype._offset = /* @__PURE__ */ s(function(t) {
    if (t === 0)
      return [0, 0];
    let r = 0;
    for (let i = 0; i < this._bufs.length; i++) {
      let n = r + this._bufs[i].length;
      if (t < n || i === this._bufs.length - 1)
        return [i, t - r];
      r = n;
    }
  }, "_offset");
  ae.prototype._reverseOffset = function(e) {
    let t = e[0], r = e[1];
    for (let i = 0; i < t; i++)
      r += this._bufs[i].length;
    return r;
  };
  ae.prototype.get = /* @__PURE__ */ s(function(t) {
    if (t > this.length || t < 0)
      return;
    let r = this._offset(t);
    return this._bufs[r[0]][r[1]];
  }, "get");
  ae.prototype.slice = /* @__PURE__ */ s(function(t, r) {
    return typeof t == "number" && t < 0 && (t += this.length), typeof r == "number" && r < 0 && (r += this.length), this.copy(null, 0, t, r);
  }, "slice");
  ae.prototype.copy = /* @__PURE__ */ s(function(t, r, i, n) {
    if ((typeof i != "number" || i < 0) && (i = 0), (typeof n != "number" || n > this.length) && (n = this.length), i >= this.length || n <=
    0)
      return t || it.alloc(0);
    let o = !!t, a = this._offset(i), u = n - i, l = u, c = o && r || 0, d = a[1];
    if (i === 0 && n === this.length) {
      if (!o)
        return this._bufs.length === 1 ? this._bufs[0] : it.concat(this._bufs, this.length);
      for (let p = 0; p < this._bufs.length; p++)
        this._bufs[p].copy(t, c), c += this._bufs[p].length;
      return t;
    }
    if (l <= this._bufs[a[0]].length - d)
      return o ? this._bufs[a[0]].copy(t, r, d, d + l) : this._bufs[a[0]].slice(d, d + l);
    o || (t = it.allocUnsafe(u));
    for (let p = a[0]; p < this._bufs.length; p++) {
      let h = this._bufs[p].length - d;
      if (l > h)
        this._bufs[p].copy(t, c, d), c += h;
      else {
        this._bufs[p].copy(t, c, d, d + l), c += h;
        break;
      }
      l -= h, d && (d = 0);
    }
    return t.length > c ? t.slice(0, c) : t;
  }, "copy");
  ae.prototype.shallowSlice = /* @__PURE__ */ s(function(t, r) {
    if (t = t || 0, r = typeof r != "number" ? this.length : r, t < 0 && (t += this.length), r < 0 && (r += this.length), t === r)
      return this._new();
    let i = this._offset(t), n = this._offset(r), o = this._bufs.slice(i[0], n[0] + 1);
    return n[1] === 0 ? o.pop() : o[o.length - 1] = o[o.length - 1].slice(0, n[1]), i[1] !== 0 && (o[0] = o[0].slice(i[1])), this._new(o);
  }, "shallowSlice");
  ae.prototype.toString = /* @__PURE__ */ s(function(t, r, i) {
    return this.slice(r, i).toString(t);
  }, "toString");
  ae.prototype.consume = /* @__PURE__ */ s(function(t) {
    if (t = Math.trunc(t), Number.isNaN(t) || t <= 0) return this;
    for (; this._bufs.length; )
      if (t >= this._bufs[0].length)
        t -= this._bufs[0].length, this.length -= this._bufs[0].length, this._bufs.shift();
      else {
        this._bufs[0] = this._bufs[0].slice(t), this.length -= t;
        break;
      }
    return this;
  }, "consume");
  ae.prototype.duplicate = /* @__PURE__ */ s(function() {
    let t = this._new();
    for (let r = 0; r < this._bufs.length; r++)
      t.append(this._bufs[r]);
    return t;
  }, "duplicate");
  ae.prototype.append = /* @__PURE__ */ s(function(t) {
    if (t == null)
      return this;
    if (t.buffer)
      this._appendBuffer(it.from(t.buffer, t.byteOffset, t.byteLength));
    else if (Array.isArray(t))
      for (let r = 0; r < t.length; r++)
        this.append(t[r]);
    else if (this._isBufferList(t))
      for (let r = 0; r < t._bufs.length; r++)
        this.append(t._bufs[r]);
    else
      typeof t == "number" && (t = t.toString()), this._appendBuffer(it.from(t));
    return this;
  }, "append");
  ae.prototype._appendBuffer = /* @__PURE__ */ s(function(t) {
    this._bufs.push(t), this.length += t.length;
  }, "appendBuffer");
  ae.prototype.indexOf = function(e, t, r) {
    if (r === void 0 && typeof t == "string" && (r = t, t = void 0), typeof e == "function" || Array.isArray(e))
      throw new TypeError('The "value" argument must be one of type string, Buffer, BufferList, or Uint8Array.');
    if (typeof e == "number" ? e = it.from([e]) : typeof e == "string" ? e = it.from(e, r) : this._isBufferList(e) ? e = e.slice() : Array.isArray(
    e.buffer) ? e = it.from(e.buffer, e.byteOffset, e.byteLength) : it.isBuffer(e) || (e = it.from(e)), t = Number(t || 0), isNaN(t) && (t =
    0), t < 0 && (t = this.length + t), t < 0 && (t = 0), e.length === 0)
      return t > this.length ? this.length : t;
    let i = this._offset(t), n = i[0], o = i[1];
    for (; n < this._bufs.length; n++) {
      let a = this._bufs[n];
      for (; o < a.length; )
        if (a.length - o >= e.length) {
          let l = a.indexOf(e, o);
          if (l !== -1)
            return this._reverseOffset([n, l]);
          o = a.length - e.length + 1;
        } else {
          let l = this._reverseOffset([n, o]);
          if (this._match(l, e))
            return l;
          o++;
        }
      o = 0;
    }
    return -1;
  };
  ae.prototype._match = function(e, t) {
    if (this.length - e < t.length)
      return !1;
    for (let r = 0; r < t.length; r++)
      if (this.get(e + r) !== t[r])
        return !1;
    return !0;
  };
  (function() {
    let e = {
      readDoubleBE: 8,
      readDoubleLE: 8,
      readFloatBE: 4,
      readFloatLE: 4,
      readInt32BE: 4,
      readInt32LE: 4,
      readUInt32BE: 4,
      readUInt32LE: 4,
      readInt16BE: 2,
      readInt16LE: 2,
      readUInt16BE: 2,
      readUInt16LE: 2,
      readInt8: 1,
      readUInt8: 1,
      readIntBE: null,
      readIntLE: null,
      readUIntBE: null,
      readUIntLE: null
    };
    for (let t in e)
      (function(r) {
        e[r] === null ? ae.prototype[r] = function(i, n) {
          return this.slice(i, i + n)[r](0, n);
        } : ae.prototype[r] = function(i = 0) {
          return this.slice(i, i + e[r])[r](0);
        };
      })(t);
  })();
  ae.prototype._isBufferList = /* @__PURE__ */ s(function(t) {
    return t instanceof ae || ae.isBufferList(t);
  }, "_isBufferList");
  ae.isBufferList = /* @__PURE__ */ s(function(t) {
    return t != null && t[qm];
  }, "isBufferList");
  Lm.exports = ae;
});

// ../node_modules/bl/bl.js
var Um = b((eM, Gs) => {
  "use strict";
  var yl = oi().Duplex, M2 = oe(), fn = Nm();
  function Pe(e) {
    if (!(this instanceof Pe))
      return new Pe(e);
    if (typeof e == "function") {
      this._callback = e;
      let t = (/* @__PURE__ */ s(function(i) {
        this._callback && (this._callback(i), this._callback = null);
      }, "piper")).bind(this);
      this.on("pipe", /* @__PURE__ */ s(function(i) {
        i.on("error", t);
      }, "onPipe")), this.on("unpipe", /* @__PURE__ */ s(function(i) {
        i.removeListener("error", t);
      }, "onUnpipe")), e = null;
    }
    fn._init.call(this, e), yl.call(this);
  }
  s(Pe, "BufferListStream");
  M2(Pe, yl);
  Object.assign(Pe.prototype, fn.prototype);
  Pe.prototype._new = /* @__PURE__ */ s(function(t) {
    return new Pe(t);
  }, "_new");
  Pe.prototype._write = /* @__PURE__ */ s(function(t, r, i) {
    this._appendBuffer(t), typeof i == "function" && i();
  }, "_write");
  Pe.prototype._read = /* @__PURE__ */ s(function(t) {
    if (!this.length)
      return this.push(null);
    t = Math.min(t, this.length), this.push(this.slice(0, t)), this.consume(t);
  }, "_read");
  Pe.prototype.end = /* @__PURE__ */ s(function(t) {
    yl.prototype.end.call(this, t), this._callback && (this._callback(null, this.slice()), this._callback = null);
  }, "end");
  Pe.prototype._destroy = /* @__PURE__ */ s(function(t, r) {
    this._bufs.length = 0, this.length = 0, r(t);
  }, "_destroy");
  Pe.prototype._isBufferList = /* @__PURE__ */ s(function(t) {
    return t instanceof Pe || t instanceof fn || Pe.isBufferList(t);
  }, "_isBufferList");
  Pe.isBufferList = fn.isBufferList;
  Gs.exports = Pe;
  Gs.exports.BufferListStream = Pe;
  Gs.exports.BufferList = fn;
});

// ../node_modules/tar-stream/headers.js
var _l = b((ui) => {
  var j2 = Buffer.alloc, q2 = "0000000000000000000", L2 = "7777777777777777777", $m = 48, Wm = Buffer.from("ustar\0", "binary"), N2 = Buffer.
  from("00", "binary"), U2 = Buffer.from("ustar ", "binary"), $2 = Buffer.from(" \0", "binary"), W2 = parseInt("7777", 8), hn = 257, vl = 263,
  H2 = /* @__PURE__ */ s(function(e, t, r) {
    return typeof e != "number" ? r : (e = ~~e, e >= t ? t : e >= 0 || (e += t, e >= 0) ? e : 0);
  }, "clamp"), V2 = /* @__PURE__ */ s(function(e) {
    switch (e) {
      case 0:
        return "file";
      case 1:
        return "link";
      case 2:
        return "symlink";
      case 3:
        return "character-device";
      case 4:
        return "block-device";
      case 5:
        return "directory";
      case 6:
        return "fifo";
      case 7:
        return "contiguous-file";
      case 72:
        return "pax-header";
      case 55:
        return "pax-global-header";
      case 27:
        return "gnu-long-link-path";
      case 28:
      case 30:
        return "gnu-long-path";
    }
    return null;
  }, "toType"), Z2 = /* @__PURE__ */ s(function(e) {
    switch (e) {
      case "file":
        return 0;
      case "link":
        return 1;
      case "symlink":
        return 2;
      case "character-device":
        return 3;
      case "block-device":
        return 4;
      case "directory":
        return 5;
      case "fifo":
        return 6;
      case "contiguous-file":
        return 7;
      case "pax-header":
        return 72;
    }
    return 0;
  }, "toTypeflag"), Hm = /* @__PURE__ */ s(function(e, t, r, i) {
    for (; r < i; r++)
      if (e[r] === t) return r;
    return i;
  }, "indexOf"), Vm = /* @__PURE__ */ s(function(e) {
    for (var t = 256, r = 0; r < 148; r++) t += e[r];
    for (var i = 156; i < 512; i++) t += e[i];
    return t;
  }, "cksum"), er = /* @__PURE__ */ s(function(e, t) {
    return e = e.toString(8), e.length > t ? L2.slice(0, t) + " " : q2.slice(0, t - e.length) + e + " ";
  }, "encodeOct");
  function z2(e) {
    var t;
    if (e[0] === 128) t = !0;
    else if (e[0] === 255) t = !1;
    else return null;
    for (var r = [], i = e.length - 1; i > 0; i--) {
      var n = e[i];
      t ? r.push(n) : r.push(255 - n);
    }
    var o = 0, a = r.length;
    for (i = 0; i < a; i++)
      o += r[i] * Math.pow(256, i);
    return t ? o : -1 * o;
  }
  s(z2, "parse256");
  var tr = /* @__PURE__ */ s(function(e, t, r) {
    if (e = e.slice(t, t + r), t = 0, e[t] & 128)
      return z2(e);
    for (; t < e.length && e[t] === 32; ) t++;
    for (var i = H2(Hm(e, 32, t, e.length), e.length, e.length); t < i && e[t] === 0; ) t++;
    return i === t ? 0 : parseInt(e.slice(t, i).toString(), 8);
  }, "decodeOct"), ai = /* @__PURE__ */ s(function(e, t, r, i) {
    return e.slice(t, Hm(e, 0, t, t + r)).toString(i);
  }, "decodeStr"), bl = /* @__PURE__ */ s(function(e) {
    var t = Buffer.byteLength(e), r = Math.floor(Math.log(t) / Math.log(10)) + 1;
    return t + r >= Math.pow(10, r) && r++, t + r + e;
  }, "addLength");
  ui.decodeLongPath = function(e, t) {
    return ai(e, 0, e.length, t);
  };
  ui.encodePax = function(e) {
    var t = "";
    e.name && (t += bl(" path=" + e.name + `
`)), e.linkname && (t += bl(" linkpath=" + e.linkname + `
`));
    var r = e.pax;
    if (r)
      for (var i in r)
        t += bl(" " + i + "=" + r[i] + `
`);
    return Buffer.from(t);
  };
  ui.decodePax = function(e) {
    for (var t = {}; e.length; ) {
      for (var r = 0; r < e.length && e[r] !== 32; ) r++;
      var i = parseInt(e.slice(0, r).toString(), 10);
      if (!i) return t;
      var n = e.slice(r + 1, i - 1).toString(), o = n.indexOf("=");
      if (o === -1) return t;
      t[n.slice(0, o)] = n.slice(o + 1), e = e.slice(i);
    }
    return t;
  };
  ui.encode = function(e) {
    var t = j2(512), r = e.name, i = "";
    if (e.typeflag === 5 && r[r.length - 1] !== "/" && (r += "/"), Buffer.byteLength(r) !== r.length) return null;
    for (; Buffer.byteLength(r) > 100; ) {
      var n = r.indexOf("/");
      if (n === -1) return null;
      i += i ? "/" + r.slice(0, n) : r.slice(0, n), r = r.slice(n + 1);
    }
    return Buffer.byteLength(r) > 100 || Buffer.byteLength(i) > 155 || e.linkname && Buffer.byteLength(e.linkname) > 100 ? null : (t.write(r),
    t.write(er(e.mode & W2, 6), 100), t.write(er(e.uid, 6), 108), t.write(er(e.gid, 6), 116), t.write(er(e.size, 11), 124), t.write(er(e.mtime.
    getTime() / 1e3 | 0, 11), 136), t[156] = $m + Z2(e.type), e.linkname && t.write(e.linkname, 157), Wm.copy(t, hn), N2.copy(t, vl), e.uname &&
    t.write(e.uname, 265), e.gname && t.write(e.gname, 297), t.write(er(e.devmajor || 0, 6), 329), t.write(er(e.devminor || 0, 6), 337), i &&
    t.write(i, 345), t.write(er(Vm(t), 6), 148), t);
  };
  ui.decode = function(e, t, r) {
    var i = e[156] === 0 ? 0 : e[156] - $m, n = ai(e, 0, 100, t), o = tr(e, 100, 8), a = tr(e, 108, 8), u = tr(e, 116, 8), l = tr(e, 124, 12),
    c = tr(e, 136, 12), d = V2(i), p = e[157] === 0 ? null : ai(e, 157, 100, t), h = ai(e, 265, 32), f = ai(e, 297, 32), g = tr(e, 329, 8), E = tr(
    e, 337, 8), _ = Vm(e);
    if (_ === 8 * 32) return null;
    if (_ !== tr(e, 148, 8)) throw new Error("Invalid tar header. Maybe the tar is corrupted or it needs to be gunzipped?");
    if (Wm.compare(e, hn, hn + 6) === 0)
      e[345] && (n = ai(e, 345, 155, t) + "/" + n);
    else if (!(U2.compare(e, hn, hn + 6) === 0 && $2.compare(e, vl, vl + 2) === 0)) {
      if (!r)
        throw new Error("Invalid tar header: unknown format.");
    }
    return i === 0 && n && n[n.length - 1] === "/" && (i = 5), {
      name: n,
      mode: o,
      uid: a,
      gid: u,
      size: l,
      mtime: new Date(1e3 * c),
      type: d,
      linkname: p,
      uname: h,
      gname: f,
      devmajor: g,
      devminor: E
    };
  };
});

// ../node_modules/tar-stream/extract.js
var Xm = b((nM, Jm) => {
  var zm = require("util"), G2 = Um(), pn = _l(), Gm = oi().Writable, Km = oi().PassThrough, Ym = /* @__PURE__ */ s(function() {
  }, "noop"), Zm = /* @__PURE__ */ s(function(e) {
    return e &= 511, e && 512 - e;
  }, "overflow"), K2 = /* @__PURE__ */ s(function(e, t) {
    var r = new Ks(e, t);
    return r.end(), r;
  }, "emptyStream"), Y2 = /* @__PURE__ */ s(function(e, t) {
    return t.path && (e.name = t.path), t.linkpath && (e.linkname = t.linkpath), t.size && (e.size = parseInt(t.size, 10)), e.pax = t, e;
  }, "mixinPax"), Ks = /* @__PURE__ */ s(function(e, t) {
    this._parent = e, this.offset = t, Km.call(this, { autoDestroy: !1 });
  }, "Source");
  zm.inherits(Ks, Km);
  Ks.prototype.destroy = function(e) {
    this._parent.destroy(e);
  };
  var Rt = /* @__PURE__ */ s(function(e) {
    if (!(this instanceof Rt)) return new Rt(e);
    Gm.call(this, e), e = e || {}, this._offset = 0, this._buffer = G2(), this._missing = 0, this._partial = !1, this._onparse = Ym, this._header =
    null, this._stream = null, this._overflow = null, this._cb = null, this._locked = !1, this._destroyed = !1, this._pax = null, this._paxGlobal =
    null, this._gnuLongPath = null, this._gnuLongLinkPath = null;
    var t = this, r = t._buffer, i = /* @__PURE__ */ s(function() {
      t._continue();
    }, "oncontinue"), n = /* @__PURE__ */ s(function(h) {
      if (t._locked = !1, h) return t.destroy(h);
      t._stream || i();
    }, "onunlock"), o = /* @__PURE__ */ s(function() {
      t._stream = null;
      var h = Zm(t._header.size);
      h ? t._parse(h, a) : t._parse(512, p), t._locked || i();
    }, "onstreamend"), a = /* @__PURE__ */ s(function() {
      t._buffer.consume(Zm(t._header.size)), t._parse(512, p), i();
    }, "ondrain"), u = /* @__PURE__ */ s(function() {
      var h = t._header.size;
      t._paxGlobal = pn.decodePax(r.slice(0, h)), r.consume(h), o();
    }, "onpaxglobalheader"), l = /* @__PURE__ */ s(function() {
      var h = t._header.size;
      t._pax = pn.decodePax(r.slice(0, h)), t._paxGlobal && (t._pax = Object.assign({}, t._paxGlobal, t._pax)), r.consume(h), o();
    }, "onpaxheader"), c = /* @__PURE__ */ s(function() {
      var h = t._header.size;
      this._gnuLongPath = pn.decodeLongPath(r.slice(0, h), e.filenameEncoding), r.consume(h), o();
    }, "ongnulongpath"), d = /* @__PURE__ */ s(function() {
      var h = t._header.size;
      this._gnuLongLinkPath = pn.decodeLongPath(r.slice(0, h), e.filenameEncoding), r.consume(h), o();
    }, "ongnulonglinkpath"), p = /* @__PURE__ */ s(function() {
      var h = t._offset, f;
      try {
        f = t._header = pn.decode(r.slice(0, 512), e.filenameEncoding, e.allowUnknownFormat);
      } catch (g) {
        t.emit("error", g);
      }
      if (r.consume(512), !f) {
        t._parse(512, p), i();
        return;
      }
      if (f.type === "gnu-long-path") {
        t._parse(f.size, c), i();
        return;
      }
      if (f.type === "gnu-long-link-path") {
        t._parse(f.size, d), i();
        return;
      }
      if (f.type === "pax-global-header") {
        t._parse(f.size, u), i();
        return;
      }
      if (f.type === "pax-header") {
        t._parse(f.size, l), i();
        return;
      }
      if (t._gnuLongPath && (f.name = t._gnuLongPath, t._gnuLongPath = null), t._gnuLongLinkPath && (f.linkname = t._gnuLongLinkPath, t._gnuLongLinkPath =
      null), t._pax && (t._header = f = Y2(f, t._pax), t._pax = null), t._locked = !0, !f.size || f.type === "directory") {
        t._parse(512, p), t.emit("entry", f, K2(t, h), n);
        return;
      }
      t._stream = new Ks(t, h), t.emit("entry", f, t._stream, n), t._parse(f.size, o), i();
    }, "onheader");
    this._onheader = p, this._parse(512, p);
  }, "Extract");
  zm.inherits(Rt, Gm);
  Rt.prototype.destroy = function(e) {
    this._destroyed || (this._destroyed = !0, e && this.emit("error", e), this.emit("close"), this._stream && this._stream.emit("close"));
  };
  Rt.prototype._parse = function(e, t) {
    this._destroyed || (this._offset += e, this._missing = e, t === this._onheader && (this._partial = !1), this._onparse = t);
  };
  Rt.prototype._continue = function() {
    if (!this._destroyed) {
      var e = this._cb;
      this._cb = Ym, this._overflow ? this._write(this._overflow, void 0, e) : e();
    }
  };
  Rt.prototype._write = function(e, t, r) {
    if (!this._destroyed) {
      var i = this._stream, n = this._buffer, o = this._missing;
      if (e.length && (this._partial = !0), e.length < o)
        return this._missing -= e.length, this._overflow = null, i ? i.write(e, r) : (n.append(e), r());
      this._cb = r, this._missing = 0;
      var a = null;
      e.length > o && (a = e.slice(o), e = e.slice(0, o)), i ? i.end(e) : n.append(e), this._overflow = a, this._onparse();
    }
  };
  Rt.prototype._final = function(e) {
    if (this._partial) return this.destroy(new Error("Unexpected end of data"));
    e();
  };
  Jm.exports = Rt;
});

// ../node_modules/fs-constants/index.js
var eg = b((oM, Qm) => {
  Qm.exports = require("fs").constants || require("constants");
});

// ../node_modules/tar-stream/pack.js
var sg = b((aM, ng) => {
  var li = eg(), tg = ti(), Js = oe(), J2 = Buffer.alloc, rg = oi().Readable, ci = oi().Writable, X2 = require("string_decoder").StringDecoder,
  Ys = _l(), Q2 = parseInt("755", 8), eS = parseInt("644", 8), ig = J2(1024), El = /* @__PURE__ */ s(function() {
  }, "noop"), wl = /* @__PURE__ */ s(function(e, t) {
    t &= 511, t && e.push(ig.slice(0, 512 - t));
  }, "overflow");
  function tS(e) {
    switch (e & li.S_IFMT) {
      case li.S_IFBLK:
        return "block-device";
      case li.S_IFCHR:
        return "character-device";
      case li.S_IFDIR:
        return "directory";
      case li.S_IFIFO:
        return "fifo";
      case li.S_IFLNK:
        return "symlink";
    }
    return "file";
  }
  s(tS, "modeToType");
  var Xs = /* @__PURE__ */ s(function(e) {
    ci.call(this), this.written = 0, this._to = e, this._destroyed = !1;
  }, "Sink");
  Js(Xs, ci);
  Xs.prototype._write = function(e, t, r) {
    if (this.written += e.length, this._to.push(e)) return r();
    this._to._drain = r;
  };
  Xs.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.emit("close"));
  };
  var Qs = /* @__PURE__ */ s(function() {
    ci.call(this), this.linkname = "", this._decoder = new X2("utf-8"), this._destroyed = !1;
  }, "LinkSink");
  Js(Qs, ci);
  Qs.prototype._write = function(e, t, r) {
    this.linkname += this._decoder.write(e), r();
  };
  Qs.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.emit("close"));
  };
  var Dn = /* @__PURE__ */ s(function() {
    ci.call(this), this._destroyed = !1;
  }, "Void");
  Js(Dn, ci);
  Dn.prototype._write = function(e, t, r) {
    r(new Error("No body allowed for this entry"));
  };
  Dn.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.emit("close"));
  };
  var Dt = /* @__PURE__ */ s(function(e) {
    if (!(this instanceof Dt)) return new Dt(e);
    rg.call(this, e), this._drain = El, this._finalized = !1, this._finalizing = !1, this._destroyed = !1, this._stream = null;
  }, "Pack");
  Js(Dt, rg);
  Dt.prototype.entry = function(e, t, r) {
    if (this._stream) throw new Error("already piping an entry");
    if (!(this._finalized || this._destroyed)) {
      typeof t == "function" && (r = t, t = null), r || (r = El);
      var i = this;
      if ((!e.size || e.type === "symlink") && (e.size = 0), e.type || (e.type = tS(e.mode)), e.mode || (e.mode = e.type === "directory" ? Q2 :
      eS), e.uid || (e.uid = 0), e.gid || (e.gid = 0), e.mtime || (e.mtime = /* @__PURE__ */ new Date()), typeof t == "string" && (t = Buffer.
      from(t)), Buffer.isBuffer(t)) {
        e.size = t.length, this._encode(e);
        var n = this.push(t);
        return wl(i, e.size), n ? process.nextTick(r) : this._drain = r, new Dn();
      }
      if (e.type === "symlink" && !e.linkname) {
        var o = new Qs();
        return tg(o, function(u) {
          if (u)
            return i.destroy(), r(u);
          e.linkname = o.linkname, i._encode(e), r();
        }), o;
      }
      if (this._encode(e), e.type !== "file" && e.type !== "contiguous-file")
        return process.nextTick(r), new Dn();
      var a = new Xs(this);
      return this._stream = a, tg(a, function(u) {
        if (i._stream = null, u)
          return i.destroy(), r(u);
        if (a.written !== e.size)
          return i.destroy(), r(new Error("size mismatch"));
        wl(i, e.size), i._finalizing && i.finalize(), r();
      }), a;
    }
  };
  Dt.prototype.finalize = function() {
    if (this._stream) {
      this._finalizing = !0;
      return;
    }
    this._finalized || (this._finalized = !0, this.push(ig), this.push(null));
  };
  Dt.prototype.destroy = function(e) {
    this._destroyed || (this._destroyed = !0, e && this.emit("error", e), this.emit("close"), this._stream && this._stream.destroy && this._stream.
    destroy());
  };
  Dt.prototype._encode = function(e) {
    if (!e.pax) {
      var t = Ys.encode(e);
      if (t) {
        this.push(t);
        return;
      }
    }
    this._encodePax(e);
  };
  Dt.prototype._encodePax = function(e) {
    var t = Ys.encodePax({
      name: e.name,
      linkname: e.linkname,
      pax: e.pax
    }), r = {
      name: "PaxHeader",
      mode: e.mode,
      uid: e.uid,
      gid: e.gid,
      size: t.length,
      mtime: e.mtime,
      type: "pax-header",
      linkname: e.linkname && "PaxHeader",
      uname: e.uname,
      gname: e.gname,
      devmajor: e.devmajor,
      devminor: e.devminor
    };
    this.push(Ys.encode(r)), this.push(t), wl(this, t.length), r.size = e.size, r.type = e.type, this.push(Ys.encode(r));
  };
  Dt.prototype._read = function(e) {
    var t = this._drain;
    this._drain = El, t();
  };
  ng.exports = Dt;
});

// ../node_modules/tar-stream/index.js
var og = b((Cl) => {
  Cl.extract = Xm();
  Cl.pack = sg();
});

// ../node_modules/mkdirp-classic/index.js
var cg = b((cM, lg) => {
  var eo = require("path"), ag = require("fs"), ug = parseInt("0777", 8);
  lg.exports = di.mkdirp = di.mkdirP = di;
  function di(e, t, r, i) {
    typeof t == "function" ? (r = t, t = {}) : (!t || typeof t != "object") && (t = { mode: t });
    var n = t.mode, o = t.fs || ag;
    n === void 0 && (n = ug & ~process.umask()), i || (i = null);
    var a = r || function() {
    };
    e = eo.resolve(e), o.mkdir(e, n, function(u) {
      if (!u)
        return i = i || e, a(null, i);
      switch (u.code) {
        case "ENOENT":
          di(eo.dirname(e), t, function(l, c) {
            l ? a(l, c) : di(e, t, a, c);
          });
          break;
        // In the case of any other error, just see if there's a dir
        // there already.  If so, then hooray!  If not, then something
        // is borked.
        default:
          o.stat(e, function(l, c) {
            l || !c.isDirectory() ? a(u, i) : a(null, i);
          });
          break;
      }
    });
  }
  s(di, "mkdirP");
  di.sync = /* @__PURE__ */ s(function e(t, r, i) {
    (!r || typeof r != "object") && (r = { mode: r });
    var n = r.mode, o = r.fs || ag;
    n === void 0 && (n = ug & ~process.umask()), i || (i = null), t = eo.resolve(t);
    try {
      o.mkdirSync(t, n), i = i || t;
    } catch (u) {
      switch (u.code) {
        case "ENOENT":
          i = e(eo.dirname(t), r, i), e(t, r, i);
          break;
        // In the case of any other error, just see if there's a dir
        // there already.  If so, then hooray!  If not, then something
        // is borked.
        default:
          var a;
          try {
            a = o.statSync(t);
          } catch {
            throw u;
          }
          if (!a.isDirectory()) throw u;
          break;
      }
    }
    return i;
  }, "sync");
});

// ../node_modules/tar-fs/index.js
var yg = b((Sl) => {
  var rS = LD(), fg = og(), hg = Wu(), iS = cg(), pg = require("fs"), He = require("path"), nS = require("os"), mn = nS.platform() === "win3\
2", gn = /* @__PURE__ */ s(function() {
  }, "noop"), Fl = /* @__PURE__ */ s(function(e) {
    return e;
  }, "echo"), xl = mn ? function(e) {
    return e.replace(/\\/g, "/").replace(/[:?<>|]/g, "_");
  } : Fl, sS = /* @__PURE__ */ s(function(e, t, r, i, n, o) {
    var a = n || ["."];
    return /* @__PURE__ */ s(function(l) {
      if (!a.length) return l();
      var c = a.shift(), d = He.join(r, c);
      t.call(e, d, function(p, h) {
        if (p) return l(p);
        if (!h.isDirectory()) return l(null, c, h);
        e.readdir(d, function(f, g) {
          if (f) return l(f);
          o && g.sort();
          for (var E = 0; E < g.length; E++)
            i(He.join(r, c, g[E])) || a.push(He.join(c, g[E]));
          l(null, c, h);
        });
      });
    }, "loop");
  }, "statAll"), Dg = /* @__PURE__ */ s(function(e, t) {
    return function(r) {
      r.name = r.name.split("/").slice(t).join("/");
      var i = r.linkname;
      return i && (r.type === "link" || He.isAbsolute(i)) && (r.linkname = i.split("/").slice(t).join("/")), e(r);
    };
  }, "strip");
  Sl.pack = function(e, t) {
    e || (e = "."), t || (t = {});
    var r = t.fs || pg, i = t.ignore || t.filter || gn, n = t.map || gn, o = t.mapStream || Fl, a = sS(r, t.dereference ? r.stat : r.lstat, e,
    i, t.entries, t.sort), u = t.strict !== !1, l = typeof t.umask == "number" ? ~t.umask : ~mg(), c = typeof t.dmode == "number" ? t.dmode :
    0, d = typeof t.fmode == "number" ? t.fmode : 0, p = t.pack || fg.pack(), h = t.finish || gn;
    t.strip && (n = Dg(n, t.strip)), t.readable && (c |= parseInt(555, 8), d |= parseInt(444, 8)), t.writable && (c |= parseInt(333, 8), d |=
    parseInt(222, 8));
    var f = /* @__PURE__ */ s(function(_, C) {
      r.readlink(He.join(e, _), function(x, w) {
        if (x) return p.destroy(x);
        C.linkname = xl(w), p.entry(C, E);
      });
    }, "onsymlink"), g = /* @__PURE__ */ s(function(_, C, x) {
      if (_) return p.destroy(_);
      if (!C)
        return t.finalize !== !1 && p.finalize(), h(p);
      if (x.isSocket()) return E();
      var w = {
        name: xl(C),
        mode: (x.mode | (x.isDirectory() ? c : d)) & l,
        mtime: x.mtime,
        size: x.size,
        type: "file",
        uid: x.uid,
        gid: x.gid
      };
      if (x.isDirectory())
        return w.size = 0, w.type = "directory", w = n(w) || w, p.entry(w, E);
      if (x.isSymbolicLink())
        return w.size = 0, w.type = "symlink", w = n(w) || w, f(C, w);
      if (w = n(w) || w, !x.isFile())
        return u ? p.destroy(new Error("unsupported type for " + C)) : E();
      var T = p.entry(w, E);
      if (T) {
        var S = o(r.createReadStream(He.join(e, C), { start: 0, end: w.size > 0 ? w.size - 1 : w.size }), w);
        S.on("error", function(F) {
          T.destroy(F);
        }), hg(S, T);
      }
    }, "onstat"), E = /* @__PURE__ */ s(function(_) {
      if (_) return p.destroy(_);
      a(g);
    }, "onnextentry");
    return E(), p;
  };
  var oS = /* @__PURE__ */ s(function(e) {
    return e.length ? e[e.length - 1] : null;
  }, "head"), aS = /* @__PURE__ */ s(function() {
    return process.getuid ? process.getuid() : -1;
  }, "processGetuid"), mg = /* @__PURE__ */ s(function() {
    return process.umask ? process.umask() : 0;
  }, "processUmask");
  Sl.extract = function(e, t) {
    e || (e = "."), t || (t = {});
    var r = t.fs || pg, i = t.ignore || t.filter || gn, n = t.map || gn, o = t.mapStream || Fl, a = t.chown !== !1 && !mn && aS() === 0, u = t.
    extract || fg.extract(), l = [], c = /* @__PURE__ */ new Date(), d = typeof t.umask == "number" ? ~t.umask : ~mg(), p = typeof t.dmode ==
    "number" ? t.dmode : 0, h = typeof t.fmode == "number" ? t.fmode : 0, f = t.strict !== !1;
    t.strip && (n = Dg(n, t.strip)), t.readable && (p |= parseInt(555, 8), h |= parseInt(444, 8)), t.writable && (p |= parseInt(333, 8), h |=
    parseInt(222, 8));
    var g = /* @__PURE__ */ s(function(C, x) {
      for (var w; (w = oS(l)) && C.slice(0, w[0].length) !== w[0]; ) l.pop();
      if (!w) return x();
      r.utimes(w[0], c, w[1], x);
    }, "utimesParent"), E = /* @__PURE__ */ s(function(C, x, w) {
      if (t.utimes === !1) return w();
      if (x.type === "directory") return r.utimes(C, c, x.mtime, w);
      if (x.type === "symlink") return g(C, w);
      r.utimes(C, c, x.mtime, function(T) {
        if (T) return w(T);
        g(C, w);
      });
    }, "utimes"), _ = /* @__PURE__ */ s(function(C, x, w) {
      var T = x.type === "symlink", S = T ? r.lchmod : r.chmod, F = T ? r.lchown : r.chown;
      if (!S) return w();
      var I = (x.mode | (x.type === "directory" ? p : h)) & d;
      F && a ? F.call(r, C, x.uid, x.gid, q) : q(null);
      function q(M) {
        if (M) return w(M);
        if (!S) return w();
        S.call(r, C, I, w);
      }
      s(q, "onchown");
    }, "chperm");
    return u.on("entry", function(C, x, w) {
      C = n(C) || C, C.name = xl(C.name);
      var T = He.join(e, He.join("/", C.name));
      if (i(T, C))
        return x.resume(), w();
      var S = /* @__PURE__ */ s(function(H) {
        if (H) return w(H);
        E(T, C, function(K) {
          if (K) return w(K);
          if (mn) return w();
          _(T, C, w);
        });
      }, "stat"), F = /* @__PURE__ */ s(function() {
        if (mn) return w();
        r.unlink(T, function() {
          r.symlink(C.linkname, T, S);
        });
      }, "onsymlink"), I = /* @__PURE__ */ s(function() {
        if (mn) return w();
        r.unlink(T, function() {
          var H = He.join(e, He.join("/", C.linkname));
          r.link(H, T, function(K) {
            if (K && K.code === "EPERM" && t.hardlinkAsFilesFallback)
              return x = r.createReadStream(H), q();
            S(K);
          });
        });
      }, "onlink"), q = /* @__PURE__ */ s(function() {
        var H = r.createWriteStream(T), K = o(x, C);
        H.on("error", function(ve) {
          K.destroy(ve);
        }), hg(K, H, function(ve) {
          if (ve) return w(ve);
          H.on("close", S);
        });
      }, "onfile");
      if (C.type === "directory")
        return l.push([T, C.mtime]), dg(T, {
          fs: r,
          own: a,
          uid: C.uid,
          gid: C.gid
        }, S);
      var M = He.dirname(T);
      gg(r, M, He.join(e, "."), function(H, K) {
        if (H) return w(H);
        if (!K) return w(new Error(M + " is not a valid path"));
        dg(M, {
          fs: r,
          own: a,
          uid: C.uid,
          gid: C.gid
        }, function(ve) {
          if (ve) return w(ve);
          switch (C.type) {
            case "file":
              return q();
            case "link":
              return I();
            case "symlink":
              return F();
          }
          if (f) return w(new Error("unsupported type for " + T + " (" + C.type + ")"));
          x.resume(), w();
        });
      });
    }), t.finish && u.on("finish", t.finish), u;
  };
  function gg(e, t, r, i) {
    if (t === r) return i(null, !0);
    e.lstat(t, function(n, o) {
      if (n && n.code !== "ENOENT") return i(n);
      if (n || o.isDirectory()) return gg(e, He.join(t, ".."), r, i);
      i(null, !1);
    });
  }
  s(gg, "validate");
  function dg(e, t, r) {
    iS(e, { fs: t.fs }, function(i, n) {
      !i && n && t.own ? rS(n, t.uid, t.gid, r) : r(i);
    });
  }
  s(dg, "mkdirfix");
});

// ../node_modules/process-nextick-args/index.js
var Ve = b((pM, Tl) => {
  "use strict";
  typeof process > "u" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.
  indexOf("v1.8.") !== 0 ? Tl.exports = { nextTick: uS } : Tl.exports = process;
  function uS(e, t, r, i) {
    if (typeof e != "function")
      throw new TypeError('"callback" argument must be a function');
    var n = arguments.length, o, a;
    switch (n) {
      case 0:
      case 1:
        return process.nextTick(e);
      case 2:
        return process.nextTick(/* @__PURE__ */ s(function() {
          e.call(null, t);
        }, "afterTickOne"));
      case 3:
        return process.nextTick(/* @__PURE__ */ s(function() {
          e.call(null, t, r);
        }, "afterTickTwo"));
      case 4:
        return process.nextTick(/* @__PURE__ */ s(function() {
          e.call(null, t, r, i);
        }, "afterTickThree"));
      default:
        for (o = new Array(n - 1), a = 0; a < o.length; )
          o[a++] = arguments[a];
        return process.nextTick(/* @__PURE__ */ s(function() {
          e.apply(null, o);
        }, "afterTick"));
    }
  }
  s(uS, "nextTick");
});

// ../node_modules/peek-stream/node_modules/isarray/index.js
var vg = b((mM, bg) => {
  var lS = {}.toString;
  bg.exports = Array.isArray || function(e) {
    return lS.call(e) == "[object Array]";
  };
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/internal/streams/stream.js
var Al = b((gM, _g) => {
  _g.exports = require("stream");
});

// ../node_modules/peek-stream/node_modules/safe-buffer/index.js
var ro = b((Rl, Eg) => {
  var to = require("buffer"), kt = to.Buffer;
  function wg(e, t) {
    for (var r in e)
      t[r] = e[r];
  }
  s(wg, "copyProps");
  kt.from && kt.alloc && kt.allocUnsafe && kt.allocUnsafeSlow ? Eg.exports = to : (wg(to, Rl), Rl.Buffer = fi);
  function fi(e, t, r) {
    return kt(e, t, r);
  }
  s(fi, "SafeBuffer");
  wg(kt, fi);
  fi.from = function(e, t, r) {
    if (typeof e == "number")
      throw new TypeError("Argument must not be a number");
    return kt(e, t, r);
  };
  fi.alloc = function(e, t, r) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    var i = kt(e);
    return t !== void 0 ? typeof r == "string" ? i.fill(t, r) : i.fill(t) : i.fill(0), i;
  };
  fi.allocUnsafe = function(e) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    return kt(e);
  };
  fi.allocUnsafeSlow = function(e) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    return to.SlowBuffer(e);
  };
});

// ../node_modules/core-util-is/lib/util.js
var Me = b((Ie) => {
  function cS(e) {
    return Array.isArray ? Array.isArray(e) : io(e) === "[object Array]";
  }
  s(cS, "isArray");
  Ie.isArray = cS;
  function dS(e) {
    return typeof e == "boolean";
  }
  s(dS, "isBoolean");
  Ie.isBoolean = dS;
  function fS(e) {
    return e === null;
  }
  s(fS, "isNull");
  Ie.isNull = fS;
  function hS(e) {
    return e == null;
  }
  s(hS, "isNullOrUndefined");
  Ie.isNullOrUndefined = hS;
  function pS(e) {
    return typeof e == "number";
  }
  s(pS, "isNumber");
  Ie.isNumber = pS;
  function DS(e) {
    return typeof e == "string";
  }
  s(DS, "isString");
  Ie.isString = DS;
  function mS(e) {
    return typeof e == "symbol";
  }
  s(mS, "isSymbol");
  Ie.isSymbol = mS;
  function gS(e) {
    return e === void 0;
  }
  s(gS, "isUndefined");
  Ie.isUndefined = gS;
  function yS(e) {
    return io(e) === "[object RegExp]";
  }
  s(yS, "isRegExp");
  Ie.isRegExp = yS;
  function bS(e) {
    return typeof e == "object" && e !== null;
  }
  s(bS, "isObject");
  Ie.isObject = bS;
  function vS(e) {
    return io(e) === "[object Date]";
  }
  s(vS, "isDate");
  Ie.isDate = vS;
  function _S(e) {
    return io(e) === "[object Error]" || e instanceof Error;
  }
  s(_S, "isError");
  Ie.isError = _S;
  function wS(e) {
    return typeof e == "function";
  }
  s(wS, "isFunction");
  Ie.isFunction = wS;
  function ES(e) {
    return e === null || typeof e == "boolean" || typeof e == "number" || typeof e == "string" || typeof e == "symbol" || // ES6 symbol
    typeof e > "u";
  }
  s(ES, "isPrimitive");
  Ie.isPrimitive = ES;
  Ie.isBuffer = require("buffer").Buffer.isBuffer;
  function io(e) {
    return Object.prototype.toString.call(e);
  }
  s(io, "objectToString");
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/internal/streams/BufferList.js
var xg = b((_M, kl) => {
  "use strict";
  function CS(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  s(CS, "_classCallCheck");
  var Cg = ro().Buffer, yn = require("util");
  function xS(e, t, r) {
    e.copy(t, r);
  }
  s(xS, "copyBuffer");
  kl.exports = function() {
    function e() {
      CS(this, e), this.head = null, this.tail = null, this.length = 0;
    }
    return s(e, "BufferList"), e.prototype.push = /* @__PURE__ */ s(function(r) {
      var i = { data: r, next: null };
      this.length > 0 ? this.tail.next = i : this.head = i, this.tail = i, ++this.length;
    }, "push"), e.prototype.unshift = /* @__PURE__ */ s(function(r) {
      var i = { data: r, next: this.head };
      this.length === 0 && (this.tail = i), this.head = i, ++this.length;
    }, "unshift"), e.prototype.shift = /* @__PURE__ */ s(function() {
      if (this.length !== 0) {
        var r = this.head.data;
        return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, r;
      }
    }, "shift"), e.prototype.clear = /* @__PURE__ */ s(function() {
      this.head = this.tail = null, this.length = 0;
    }, "clear"), e.prototype.join = /* @__PURE__ */ s(function(r) {
      if (this.length === 0) return "";
      for (var i = this.head, n = "" + i.data; i = i.next; )
        n += r + i.data;
      return n;
    }, "join"), e.prototype.concat = /* @__PURE__ */ s(function(r) {
      if (this.length === 0) return Cg.alloc(0);
      for (var i = Cg.allocUnsafe(r >>> 0), n = this.head, o = 0; n; )
        xS(n.data, i, o), o += n.data.length, n = n.next;
      return i;
    }, "concat"), e;
  }();
  yn && yn.inspect && yn.inspect.custom && (kl.exports.prototype[yn.inspect.custom] = function() {
    var e = yn.inspect({ length: this.length });
    return this.constructor.name + " " + e;
  });
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/internal/streams/destroy.js
var Ol = b((EM, Fg) => {
  "use strict";
  var no = Ve();
  function FS(e, t) {
    var r = this, i = this._readableState && this._readableState.destroyed, n = this._writableState && this._writableState.destroyed;
    return i || n ? (t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, no.nextTick(
    so, this, e)) : no.nextTick(so, this, e)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this.
    _writableState.destroyed = !0), this._destroy(e || null, function(o) {
      !t && o ? r._writableState ? r._writableState.errorEmitted || (r._writableState.errorEmitted = !0, no.nextTick(so, r, o)) : no.nextTick(
      so, r, o) : t && t(o);
    }), this);
  }
  s(FS, "destroy");
  function SS() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.
    endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending =
    !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted =
    !1);
  }
  s(SS, "undestroy");
  function so(e, t) {
    e.emit("error", t);
  }
  s(so, "emitErrorNT");
  Fg.exports = {
    destroy: FS,
    undestroy: SS
  };
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/_stream_writable.js
var Pl = b((xM, Pg) => {
  "use strict";
  var gr = Ve();
  Pg.exports = Ee;
  function Tg(e) {
    var t = this;
    this.next = null, this.entry = null, this.finish = function() {
      VS(t, e);
    };
  }
  s(Tg, "CorkedRequest");
  var TS = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : gr.nextTick, hi;
  Ee.WritableState = vn;
  var Ag = Object.create(Me());
  Ag.inherits = oe();
  var AS = {
    deprecate: rn()
  }, Rg = Al(), ao = ro().Buffer, RS = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array ||
  function() {
  };
  function kS(e) {
    return ao.from(e);
  }
  s(kS, "_uint8ArrayToBuffer");
  function OS(e) {
    return ao.isBuffer(e) || e instanceof RS;
  }
  s(OS, "_isUint8Array");
  var kg = Ol();
  Ag.inherits(Ee, Rg);
  function BS() {
  }
  s(BS, "nop");
  function vn(e, t) {
    hi = hi || yr(), e = e || {};
    var r = t instanceof hi;
    this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.writableObjectMode);
    var i = e.highWaterMark, n = e.writableHighWaterMark, o = this.objectMode ? 16 : 16 * 1024;
    i || i === 0 ? this.highWaterMark = i : r && (n || n === 0) ? this.highWaterMark = n : this.highWaterMark = o, this.highWaterMark = Math.
    floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed =
    !1;
    var a = e.decodeStrings === !1;
    this.decodeStrings = !a, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync =
    !0, this.bufferProcessing = !1, this.onwrite = function(u) {
      NS(t, u);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished =
    !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new Tg(this);
  }
  s(vn, "WritableState");
  vn.prototype.getBuffer = /* @__PURE__ */ s(function() {
    for (var t = this.bufferedRequest, r = []; t; )
      r.push(t), t = t.next;
    return r;
  }, "getBuffer");
  (function() {
    try {
      Object.defineProperty(vn.prototype, "buffer", {
        get: AS.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  })();
  var oo;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (oo = Function.prototype[Symbol.
  hasInstance], Object.defineProperty(Ee, Symbol.hasInstance, {
    value: /* @__PURE__ */ s(function(e) {
      return oo.call(this, e) ? !0 : this !== Ee ? !1 : e && e._writableState instanceof vn;
    }, "value")
  })) : oo = /* @__PURE__ */ s(function(e) {
    return e instanceof this;
  }, "realHasInstance");
  function Ee(e) {
    if (hi = hi || yr(), !oo.call(Ee, this) && !(this instanceof hi))
      return new Ee(e);
    this._writableState = new vn(e, this), this.writable = !0, e && (typeof e.write == "function" && (this._write = e.write), typeof e.writev ==
    "function" && (this._writev = e.writev), typeof e.destroy == "function" && (this._destroy = e.destroy), typeof e.final == "function" && (this.
    _final = e.final)), Rg.call(this);
  }
  s(Ee, "Writable");
  Ee.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function PS(e, t) {
    var r = new Error("write after end");
    e.emit("error", r), gr.nextTick(t, r);
  }
  s(PS, "writeAfterEnd");
  function IS(e, t, r, i) {
    var n = !0, o = !1;
    return r === null ? o = new TypeError("May not write null values to stream") : typeof r != "string" && r !== void 0 && !t.objectMode && (o =
    new TypeError("Invalid non-string/buffer chunk")), o && (e.emit("error", o), gr.nextTick(i, o), n = !1), n;
  }
  s(IS, "validChunk");
  Ee.prototype.write = function(e, t, r) {
    var i = this._writableState, n = !1, o = !i.objectMode && OS(e);
    return o && !ao.isBuffer(e) && (e = kS(e)), typeof t == "function" && (r = t, t = null), o ? t = "buffer" : t || (t = i.defaultEncoding),
    typeof r != "function" && (r = BS), i.ended ? PS(this, r) : (o || IS(this, i, e, r)) && (i.pendingcb++, n = jS(this, i, o, e, t, r)), n;
  };
  Ee.prototype.cork = function() {
    var e = this._writableState;
    e.corked++;
  };
  Ee.prototype.uncork = function() {
    var e = this._writableState;
    e.corked && (e.corked--, !e.writing && !e.corked && !e.bufferProcessing && e.bufferedRequest && Og(this, e));
  };
  Ee.prototype.setDefaultEncoding = /* @__PURE__ */ s(function(t) {
    if (typeof t == "string" && (t = t.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "\
utf-16le", "raw"].indexOf((t + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + t);
    return this._writableState.defaultEncoding = t, this;
  }, "setDefaultEncoding");
  function MS(e, t, r) {
    return !e.objectMode && e.decodeStrings !== !1 && typeof t == "string" && (t = ao.from(t, r)), t;
  }
  s(MS, "decodeChunk");
  Object.defineProperty(Ee.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  function jS(e, t, r, i, n, o) {
    if (!r) {
      var a = MS(t, i, n);
      i !== a && (r = !0, n = "buffer", i = a);
    }
    var u = t.objectMode ? 1 : i.length;
    t.length += u;
    var l = t.length < t.highWaterMark;
    if (l || (t.needDrain = !0), t.writing || t.corked) {
      var c = t.lastBufferedRequest;
      t.lastBufferedRequest = {
        chunk: i,
        encoding: n,
        isBuf: r,
        callback: o,
        next: null
      }, c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
    } else
      Bl(e, t, !1, u, i, n, o);
    return l;
  }
  s(jS, "writeOrBuffer");
  function Bl(e, t, r, i, n, o, a) {
    t.writelen = i, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(n, t.onwrite) : e._write(n, o, t.onwrite), t.sync = !1;
  }
  s(Bl, "doWrite");
  function qS(e, t, r, i, n) {
    --t.pendingcb, r ? (gr.nextTick(n, i), gr.nextTick(bn, e, t), e._writableState.errorEmitted = !0, e.emit("error", i)) : (n(i), e._writableState.
    errorEmitted = !0, e.emit("error", i), bn(e, t));
  }
  s(qS, "onwriteError");
  function LS(e) {
    e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
  }
  s(LS, "onwriteStateUpdate");
  function NS(e, t) {
    var r = e._writableState, i = r.sync, n = r.writecb;
    if (LS(r), t) qS(e, r, i, t, n);
    else {
      var o = Bg(r);
      !o && !r.corked && !r.bufferProcessing && r.bufferedRequest && Og(e, r), i ? TS(Sg, e, r, o, n) : Sg(e, r, o, n);
    }
  }
  s(NS, "onwrite");
  function Sg(e, t, r, i) {
    r || US(e, t), t.pendingcb--, i(), bn(e, t);
  }
  s(Sg, "afterWrite");
  function US(e, t) {
    t.length === 0 && t.needDrain && (t.needDrain = !1, e.emit("drain"));
  }
  s(US, "onwriteDrain");
  function Og(e, t) {
    t.bufferProcessing = !0;
    var r = t.bufferedRequest;
    if (e._writev && r && r.next) {
      var i = t.bufferedRequestCount, n = new Array(i), o = t.corkedRequestsFree;
      o.entry = r;
      for (var a = 0, u = !0; r; )
        n[a] = r, r.isBuf || (u = !1), r = r.next, a += 1;
      n.allBuffers = u, Bl(e, t, !0, t.length, n, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree =
      o.next, o.next = null) : t.corkedRequestsFree = new Tg(t), t.bufferedRequestCount = 0;
    } else {
      for (; r; ) {
        var l = r.chunk, c = r.encoding, d = r.callback, p = t.objectMode ? 1 : l.length;
        if (Bl(e, t, !1, p, l, c, d), r = r.next, t.bufferedRequestCount--, t.writing)
          break;
      }
      r === null && (t.lastBufferedRequest = null);
    }
    t.bufferedRequest = r, t.bufferProcessing = !1;
  }
  s(Og, "clearBuffer");
  Ee.prototype._write = function(e, t, r) {
    r(new Error("_write() is not implemented"));
  };
  Ee.prototype._writev = null;
  Ee.prototype.end = function(e, t, r) {
    var i = this._writableState;
    typeof e == "function" ? (r = e, e = null, t = null) : typeof t == "function" && (r = t, t = null), e != null && this.write(e, t), i.corked &&
    (i.corked = 1, this.uncork()), i.ending || HS(this, i, r);
  };
  function Bg(e) {
    return e.ending && e.length === 0 && e.bufferedRequest === null && !e.finished && !e.writing;
  }
  s(Bg, "needFinish");
  function $S(e, t) {
    e._final(function(r) {
      t.pendingcb--, r && e.emit("error", r), t.prefinished = !0, e.emit("prefinish"), bn(e, t);
    });
  }
  s($S, "callFinal");
  function WS(e, t) {
    !t.prefinished && !t.finalCalled && (typeof e._final == "function" ? (t.pendingcb++, t.finalCalled = !0, gr.nextTick($S, e, t)) : (t.prefinished =
    !0, e.emit("prefinish")));
  }
  s(WS, "prefinish");
  function bn(e, t) {
    var r = Bg(t);
    return r && (WS(e, t), t.pendingcb === 0 && (t.finished = !0, e.emit("finish"))), r;
  }
  s(bn, "finishMaybe");
  function HS(e, t, r) {
    t.ending = !0, bn(e, t), r && (t.finished ? gr.nextTick(r) : e.once("finish", r)), t.ended = !0, e.writable = !1;
  }
  s(HS, "endWritable");
  function VS(e, t, r) {
    var i = e.entry;
    for (e.entry = null; i; ) {
      var n = i.callback;
      t.pendingcb--, n(r), i = i.next;
    }
    t.corkedRequestsFree.next = e;
  }
  s(VS, "onCorkedFinish");
  Object.defineProperty(Ee.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._writableState && (this._writableState.destroyed = e);
    }, "set")
  });
  Ee.prototype.destroy = kg.destroy;
  Ee.prototype._undestroy = kg.undestroy;
  Ee.prototype._destroy = function(e, t) {
    this.end(), t(e);
  };
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/_stream_duplex.js
var yr = b((SM, qg) => {
  "use strict";
  var Ig = Ve(), ZS = Object.keys || function(e) {
    var t = [];
    for (var r in e)
      t.push(r);
    return t;
  };
  qg.exports = Ot;
  var Mg = Object.create(Me());
  Mg.inherits = oe();
  var jg = jl(), Ml = Pl();
  Mg.inherits(Ot, jg);
  for (Il = ZS(Ml.prototype), uo = 0; uo < Il.length; uo++)
    lo = Il[uo], Ot.prototype[lo] || (Ot.prototype[lo] = Ml.prototype[lo]);
  var Il, lo, uo;
  function Ot(e) {
    if (!(this instanceof Ot)) return new Ot(e);
    jg.call(this, e), Ml.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.
    allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", zS);
  }
  s(Ot, "Duplex");
  Object.defineProperty(Ot.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  function zS() {
    this.allowHalfOpen || this._writableState.ended || Ig.nextTick(GS, this);
  }
  s(zS, "onend");
  function GS(e) {
    e.end();
  }
  s(GS, "onEndNT");
  Object.defineProperty(Ot.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = e, this._writableState.destroyed =
      e);
    }, "set")
  });
  Ot.prototype._destroy = function(e, t) {
    this.push(null), this.end(), Ig.nextTick(t, e);
  };
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/_stream_readable.js
var jl = b((RM, Yg) => {
  "use strict";
  var Di = Ve();
  Yg.exports = ce;
  var KS = vg(), _n;
  ce.ReadableState = Vg;
  var AM = require("events").EventEmitter, $g = /* @__PURE__ */ s(function(e, t) {
    return e.listeners(t).length;
  }, "EElistenerCount"), $l = Al(), wn = ro().Buffer, YS = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ?
  self : {}).Uint8Array || function() {
  };
  function JS(e) {
    return wn.from(e);
  }
  s(JS, "_uint8ArrayToBuffer");
  function XS(e) {
    return wn.isBuffer(e) || e instanceof YS;
  }
  s(XS, "_isUint8Array");
  var Wg = Object.create(Me());
  Wg.inherits = oe();
  var ql = require("util"), X = void 0;
  ql && ql.debuglog ? X = ql.debuglog("stream") : X = /* @__PURE__ */ s(function() {
  }, "debug");
  var QS = xg(), Hg = Ol(), pi;
  Wg.inherits(ce, $l);
  var Ll = ["error", "close", "destroy", "pause", "resume"];
  function eT(e, t, r) {
    if (typeof e.prependListener == "function") return e.prependListener(t, r);
    !e._events || !e._events[t] ? e.on(t, r) : KS(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]];
  }
  s(eT, "prependListener");
  function Vg(e, t) {
    _n = _n || yr(), e = e || {};
    var r = t instanceof _n;
    this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.readableObjectMode);
    var i = e.highWaterMark, n = e.readableHighWaterMark, o = this.objectMode ? 16 : 16 * 1024;
    i || i === 0 ? this.highWaterMark = i : r && (n || n === 0) ? this.highWaterMark = n : this.highWaterMark = o, this.highWaterMark = Math.
    floor(this.highWaterMark), this.buffer = new QS(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended =
    !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening =
    !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore =
    !1, this.decoder = null, this.encoding = null, e.encoding && (pi || (pi = require("string_decoder/").StringDecoder), this.decoder = new pi(
    e.encoding), this.encoding = e.encoding);
  }
  s(Vg, "ReadableState");
  function ce(e) {
    if (_n = _n || yr(), !(this instanceof ce)) return new ce(e);
    this._readableState = new Vg(e, this), this.readable = !0, e && (typeof e.read == "function" && (this._read = e.read), typeof e.destroy ==
    "function" && (this._destroy = e.destroy)), $l.call(this);
  }
  s(ce, "Readable");
  Object.defineProperty(ce.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._readableState && (this._readableState.destroyed = e);
    }, "set")
  });
  ce.prototype.destroy = Hg.destroy;
  ce.prototype._undestroy = Hg.undestroy;
  ce.prototype._destroy = function(e, t) {
    this.push(null), t(e);
  };
  ce.prototype.push = function(e, t) {
    var r = this._readableState, i;
    return r.objectMode ? i = !0 : typeof e == "string" && (t = t || r.defaultEncoding, t !== r.encoding && (e = wn.from(e, t), t = ""), i =
    !0), Zg(this, e, t, !1, i);
  };
  ce.prototype.unshift = function(e) {
    return Zg(this, e, null, !0, !1);
  };
  function Zg(e, t, r, i, n) {
    var o = e._readableState;
    if (t === null)
      o.reading = !1, nT(e, o);
    else {
      var a;
      n || (a = tT(o, t)), a ? e.emit("error", a) : o.objectMode || t && t.length > 0 ? (typeof t != "string" && !o.objectMode && Object.getPrototypeOf(
      t) !== wn.prototype && (t = JS(t)), i ? o.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : Nl(e, o, t, !0) :
      o.ended ? e.emit("error", new Error("stream.push() after EOF")) : (o.reading = !1, o.decoder && !r ? (t = o.decoder.write(t), o.objectMode ||
      t.length !== 0 ? Nl(e, o, t, !1) : zg(e, o)) : Nl(e, o, t, !1))) : i || (o.reading = !1);
    }
    return rT(o);
  }
  s(Zg, "readableAddChunk");
  function Nl(e, t, r, i) {
    t.flowing && t.length === 0 && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(
    r) : t.buffer.push(r), t.needReadable && co(e)), zg(e, t);
  }
  s(Nl, "addChunk");
  function tT(e, t) {
    var r;
    return !XS(t) && typeof t != "string" && t !== void 0 && !e.objectMode && (r = new TypeError("Invalid non-string/buffer chunk")), r;
  }
  s(tT, "chunkInvalid");
  function rT(e) {
    return !e.ended && (e.needReadable || e.length < e.highWaterMark || e.length === 0);
  }
  s(rT, "needMoreData");
  ce.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  };
  ce.prototype.setEncoding = function(e) {
    return pi || (pi = require("string_decoder/").StringDecoder), this._readableState.decoder = new pi(e), this._readableState.encoding = e,
    this;
  };
  var Lg = 8388608;
  function iT(e) {
    return e >= Lg ? e = Lg : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
  }
  s(iT, "computeNewHighWaterMark");
  function Ng(e, t) {
    return e <= 0 || t.length === 0 && t.ended ? 0 : t.objectMode ? 1 : e !== e ? t.flowing && t.length ? t.buffer.head.data.length : t.length :
    (e > t.highWaterMark && (t.highWaterMark = iT(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
  }
  s(Ng, "howMuchToRead");
  ce.prototype.read = function(e) {
    X("read", e), e = parseInt(e, 10);
    var t = this._readableState, r = e;
    if (e !== 0 && (t.emittedReadable = !1), e === 0 && t.needReadable && (t.length >= t.highWaterMark || t.ended))
      return X("read: emitReadable", t.length, t.ended), t.length === 0 && t.ended ? Ul(this) : co(this), null;
    if (e = Ng(e, t), e === 0 && t.ended)
      return t.length === 0 && Ul(this), null;
    var i = t.needReadable;
    X("need readable", i), (t.length === 0 || t.length - e < t.highWaterMark) && (i = !0, X("length less than watermark", i)), t.ended || t.
    reading ? (i = !1, X("reading or ended", i)) : i && (X("do read"), t.reading = !0, t.sync = !0, t.length === 0 && (t.needReadable = !0),
    this._read(t.highWaterMark), t.sync = !1, t.reading || (e = Ng(r, t)));
    var n;
    return e > 0 ? n = Gg(e, t) : n = null, n === null ? (t.needReadable = !0, e = 0) : t.length -= e, t.length === 0 && (t.ended || (t.needReadable =
    !0), r !== e && t.ended && Ul(this)), n !== null && this.emit("data", n), n;
  };
  function nT(e, t) {
    if (!t.ended) {
      if (t.decoder) {
        var r = t.decoder.end();
        r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
      }
      t.ended = !0, co(e);
    }
  }
  s(nT, "onEofChunk");
  function co(e) {
    var t = e._readableState;
    t.needReadable = !1, t.emittedReadable || (X("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? Di.nextTick(Ug, e) : Ug(e));
  }
  s(co, "emitReadable");
  function Ug(e) {
    X("emit readable"), e.emit("readable"), Wl(e);
  }
  s(Ug, "emitReadable_");
  function zg(e, t) {
    t.readingMore || (t.readingMore = !0, Di.nextTick(sT, e, t));
  }
  s(zg, "maybeReadMore");
  function sT(e, t) {
    for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (X("maybeReadMore read 0"), e.read(0), r !==
    t.length); )
      r = t.length;
    t.readingMore = !1;
  }
  s(sT, "maybeReadMore_");
  ce.prototype._read = function(e) {
    this.emit("error", new Error("_read() is not implemented"));
  };
  ce.prototype.pipe = function(e, t) {
    var r = this, i = this._readableState;
    switch (i.pipesCount) {
      case 0:
        i.pipes = e;
        break;
      case 1:
        i.pipes = [i.pipes, e];
        break;
      default:
        i.pipes.push(e);
        break;
    }
    i.pipesCount += 1, X("pipe count=%d opts=%j", i.pipesCount, t);
    var n = (!t || t.end !== !1) && e !== process.stdout && e !== process.stderr, o = n ? u : _;
    i.endEmitted ? Di.nextTick(o) : r.once("end", o), e.on("unpipe", a);
    function a(C, x) {
      X("onunpipe"), C === r && x && x.hasUnpiped === !1 && (x.hasUnpiped = !0, d());
    }
    s(a, "onunpipe");
    function u() {
      X("onend"), e.end();
    }
    s(u, "onend");
    var l = oT(r);
    e.on("drain", l);
    var c = !1;
    function d() {
      X("cleanup"), e.removeListener("close", g), e.removeListener("finish", E), e.removeListener("drain", l), e.removeListener("error", f),
      e.removeListener("unpipe", a), r.removeListener("end", u), r.removeListener("end", _), r.removeListener("data", h), c = !0, i.awaitDrain &&
      (!e._writableState || e._writableState.needDrain) && l();
    }
    s(d, "cleanup");
    var p = !1;
    r.on("data", h);
    function h(C) {
      X("ondata"), p = !1;
      var x = e.write(C);
      x === !1 && !p && ((i.pipesCount === 1 && i.pipes === e || i.pipesCount > 1 && Kg(i.pipes, e) !== -1) && !c && (X("false write respons\
e, pause", i.awaitDrain), i.awaitDrain++, p = !0), r.pause());
    }
    s(h, "ondata");
    function f(C) {
      X("onerror", C), _(), e.removeListener("error", f), $g(e, "error") === 0 && e.emit("error", C);
    }
    s(f, "onerror"), eT(e, "error", f);
    function g() {
      e.removeListener("finish", E), _();
    }
    s(g, "onclose"), e.once("close", g);
    function E() {
      X("onfinish"), e.removeListener("close", g), _();
    }
    s(E, "onfinish"), e.once("finish", E);
    function _() {
      X("unpipe"), r.unpipe(e);
    }
    return s(_, "unpipe"), e.emit("pipe", r), i.flowing || (X("pipe resume"), r.resume()), e;
  };
  function oT(e) {
    return function() {
      var t = e._readableState;
      X("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, t.awaitDrain === 0 && $g(e, "data") && (t.flowing = !0, Wl(e));
    };
  }
  s(oT, "pipeOnDrain");
  ce.prototype.unpipe = function(e) {
    var t = this._readableState, r = { hasUnpiped: !1 };
    if (t.pipesCount === 0) return this;
    if (t.pipesCount === 1)
      return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r),
      this);
    if (!e) {
      var i = t.pipes, n = t.pipesCount;
      t.pipes = null, t.pipesCount = 0, t.flowing = !1;
      for (var o = 0; o < n; o++)
        i[o].emit("unpipe", this, { hasUnpiped: !1 });
      return this;
    }
    var a = Kg(t.pipes, e);
    return a === -1 ? this : (t.pipes.splice(a, 1), t.pipesCount -= 1, t.pipesCount === 1 && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r),
    this);
  };
  ce.prototype.on = function(e, t) {
    var r = $l.prototype.on.call(this, e, t);
    if (e === "data")
      this._readableState.flowing !== !1 && this.resume();
    else if (e === "readable") {
      var i = this._readableState;
      !i.endEmitted && !i.readableListening && (i.readableListening = i.needReadable = !0, i.emittedReadable = !1, i.reading ? i.length && co(
      this) : Di.nextTick(aT, this));
    }
    return r;
  };
  ce.prototype.addListener = ce.prototype.on;
  function aT(e) {
    X("readable nexttick read 0"), e.read(0);
  }
  s(aT, "nReadingNextTick");
  ce.prototype.resume = function() {
    var e = this._readableState;
    return e.flowing || (X("resume"), e.flowing = !0, uT(this, e)), this;
  };
  function uT(e, t) {
    t.resumeScheduled || (t.resumeScheduled = !0, Di.nextTick(lT, e, t));
  }
  s(uT, "resume");
  function lT(e, t) {
    t.reading || (X("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), Wl(e), t.flowing && !t.reading &&
    e.read(0);
  }
  s(lT, "resume_");
  ce.prototype.pause = function() {
    return X("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (X("pause"), this._readableState.flowing =
    !1, this.emit("pause")), this;
  };
  function Wl(e) {
    var t = e._readableState;
    for (X("flow", t.flowing); t.flowing && e.read() !== null; )
      ;
  }
  s(Wl, "flow");
  ce.prototype.wrap = function(e) {
    var t = this, r = this._readableState, i = !1;
    e.on("end", function() {
      if (X("wrapped end"), r.decoder && !r.ended) {
        var a = r.decoder.end();
        a && a.length && t.push(a);
      }
      t.push(null);
    }), e.on("data", function(a) {
      if (X("wrapped data"), r.decoder && (a = r.decoder.write(a)), !(r.objectMode && a == null) && !(!r.objectMode && (!a || !a.length))) {
        var u = t.push(a);
        u || (i = !0, e.pause());
      }
    });
    for (var n in e)
      this[n] === void 0 && typeof e[n] == "function" && (this[n] = /* @__PURE__ */ function(a) {
        return function() {
          return e[a].apply(e, arguments);
        };
      }(n));
    for (var o = 0; o < Ll.length; o++)
      e.on(Ll[o], this.emit.bind(this, Ll[o]));
    return this._read = function(a) {
      X("wrapped _read", a), i && (i = !1, e.resume());
    }, this;
  };
  Object.defineProperty(ce.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._readableState.highWaterMark;
    }, "get")
  });
  ce._fromList = Gg;
  function Gg(e, t) {
    if (t.length === 0) return null;
    var r;
    return t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (t.decoder ? r = t.buffer.join("") : t.buffer.length === 1 ? r = t.buffer.
    head.data : r = t.buffer.concat(t.length), t.buffer.clear()) : r = cT(e, t.buffer, t.decoder), r;
  }
  s(Gg, "fromList");
  function cT(e, t, r) {
    var i;
    return e < t.head.data.length ? (i = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : e === t.head.data.length ? i = t.shift() :
    i = r ? dT(e, t) : fT(e, t), i;
  }
  s(cT, "fromListPartial");
  function dT(e, t) {
    var r = t.head, i = 1, n = r.data;
    for (e -= n.length; r = r.next; ) {
      var o = r.data, a = e > o.length ? o.length : e;
      if (a === o.length ? n += o : n += o.slice(0, e), e -= a, e === 0) {
        a === o.length ? (++i, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = o.slice(a));
        break;
      }
      ++i;
    }
    return t.length -= i, n;
  }
  s(dT, "copyFromBufferString");
  function fT(e, t) {
    var r = wn.allocUnsafe(e), i = t.head, n = 1;
    for (i.data.copy(r), e -= i.data.length; i = i.next; ) {
      var o = i.data, a = e > o.length ? o.length : e;
      if (o.copy(r, r.length - e, 0, a), e -= a, e === 0) {
        a === o.length ? (++n, i.next ? t.head = i.next : t.head = t.tail = null) : (t.head = i, i.data = o.slice(a));
        break;
      }
      ++n;
    }
    return t.length -= n, r;
  }
  s(fT, "copyFromBuffer");
  function Ul(e) {
    var t = e._readableState;
    if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
    t.endEmitted || (t.ended = !0, Di.nextTick(hT, t, e));
  }
  s(Ul, "endReadable");
  function hT(e, t) {
    !e.endEmitted && e.length === 0 && (e.endEmitted = !0, t.readable = !1, t.emit("end"));
  }
  s(hT, "endReadableNT");
  function Kg(e, t) {
    for (var r = 0, i = e.length; r < i; r++)
      if (e[r] === t) return r;
    return -1;
  }
  s(Kg, "indexOf");
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/_stream_transform.js
var Hl = b((OM, Qg) => {
  "use strict";
  Qg.exports = Bt;
  var fo = yr(), Xg = Object.create(Me());
  Xg.inherits = oe();
  Xg.inherits(Bt, fo);
  function pT(e, t) {
    var r = this._transformState;
    r.transforming = !1;
    var i = r.writecb;
    if (!i)
      return this.emit("error", new Error("write callback called multiple times"));
    r.writechunk = null, r.writecb = null, t != null && this.push(t), i(e);
    var n = this._readableState;
    n.reading = !1, (n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
  }
  s(pT, "afterTransform");
  function Bt(e) {
    if (!(this instanceof Bt)) return new Bt(e);
    fo.call(this, e), this._transformState = {
      afterTransform: pT.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && (typeof e.transform == "function" && (this._transform = e.
    transform), typeof e.flush == "function" && (this._flush = e.flush)), this.on("prefinish", DT);
  }
  s(Bt, "Transform");
  function DT() {
    var e = this;
    typeof this._flush == "function" ? this._flush(function(t, r) {
      Jg(e, t, r);
    }) : Jg(this, null, null);
  }
  s(DT, "prefinish");
  Bt.prototype.push = function(e, t) {
    return this._transformState.needTransform = !1, fo.prototype.push.call(this, e, t);
  };
  Bt.prototype._transform = function(e, t, r) {
    throw new Error("_transform() is not implemented");
  };
  Bt.prototype._write = function(e, t, r) {
    var i = this._transformState;
    if (i.writecb = r, i.writechunk = e, i.writeencoding = t, !i.transforming) {
      var n = this._readableState;
      (i.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
    }
  };
  Bt.prototype._read = function(e) {
    var t = this._transformState;
    t.writechunk !== null && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) :
    t.needTransform = !0;
  };
  Bt.prototype._destroy = function(e, t) {
    var r = this;
    fo.prototype._destroy.call(this, e, function(i) {
      t(i), r.emit("close");
    });
  };
  function Jg(e, t, r) {
    if (t) return e.emit("error", t);
    if (r != null && e.push(r), e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
    if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
    return e.push(null);
  }
  s(Jg, "done");
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/_stream_passthrough.js
var iy = b((PM, ry) => {
  "use strict";
  ry.exports = En;
  var ey = Hl(), ty = Object.create(Me());
  ty.inherits = oe();
  ty.inherits(En, ey);
  function En(e) {
    if (!(this instanceof En)) return new En(e);
    ey.call(this, e);
  }
  s(En, "PassThrough");
  En.prototype._transform = function(e, t, r) {
    r(null, e);
  };
});

// ../node_modules/peek-stream/node_modules/readable-stream/readable.js
var ny = b((Ae, ho) => {
  var mt = require("stream");
  process.env.READABLE_STREAM === "disable" && mt ? (ho.exports = mt, Ae = ho.exports = mt.Readable, Ae.Readable = mt.Readable, Ae.Writable =
  mt.Writable, Ae.Duplex = mt.Duplex, Ae.Transform = mt.Transform, Ae.PassThrough = mt.PassThrough, Ae.Stream = mt) : (Ae = ho.exports = jl(),
  Ae.Stream = mt || Ae, Ae.Readable = Ae, Ae.Writable = Pl(), Ae.Duplex = yr(), Ae.Transform = Hl(), Ae.PassThrough = iy());
});

// ../node_modules/stream-shift/index.js
var Vl = b((MM, sy) => {
  sy.exports = mT;
  function mT(e) {
    var t = e._readableState;
    return t ? t.objectMode || typeof e._duplexState == "number" ? e.read() : e.read(gT(t)) : null;
  }
  s(mT, "shift");
  function gT(e) {
    if (e.buffer.length) {
      var t = e.bufferIndex || 0;
      if (e.buffer.head)
        return e.buffer.head.data.length;
      if (e.buffer.length - t > 0 && e.buffer[t])
        return e.buffer[t].length;
    }
    return e.length;
  }
  s(gT, "getStateLength");
});

// ../node_modules/peek-stream/node_modules/duplexify/index.js
var cy = b((qM, ly) => {
  var po = ny(), oy = ti(), yT = oe(), bT = Vl(), ay = Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from([0]) : new Buffer([0]), Zl = /* @__PURE__ */ s(
  function(e, t) {
    e._corked ? e.once("uncork", t) : t();
  }, "onuncork"), vT = /* @__PURE__ */ s(function(e, t) {
    e._autoDestroy && e.destroy(t);
  }, "autoDestroy"), uy = /* @__PURE__ */ s(function(e, t) {
    return function(r) {
      r ? vT(e, r.message === "premature close" ? null : r) : t && !e._ended && e.end();
    };
  }, "destroyer"), _T = /* @__PURE__ */ s(function(e, t) {
    if (!e || e._writableState && e._writableState.finished) return t();
    if (e._writableState) return e.end(t);
    e.end(), t();
  }, "end"), wT = /* @__PURE__ */ s(function(e) {
    return new po.Readable({ objectMode: !0, highWaterMark: 16 }).wrap(e);
  }, "toStreams2"), Re = /* @__PURE__ */ s(function(e, t, r) {
    if (!(this instanceof Re)) return new Re(e, t, r);
    po.Duplex.call(this, r), this._writable = null, this._readable = null, this._readable2 = null, this._autoDestroy = !r || r.autoDestroy !==
    !1, this._forwardDestroy = !r || r.destroy !== !1, this._forwardEnd = !r || r.end !== !1, this._corked = 1, this._ondrain = null, this._drained =
    !1, this._forwarding = !1, this._unwrite = null, this._unread = null, this._ended = !1, this.destroyed = !1, e && this.setWritable(e), t &&
    this.setReadable(t);
  }, "Duplexify");
  yT(Re, po.Duplex);
  Re.obj = function(e, t, r) {
    return r || (r = {}), r.objectMode = !0, r.highWaterMark = 16, new Re(e, t, r);
  };
  Re.prototype.cork = function() {
    ++this._corked === 1 && this.emit("cork");
  };
  Re.prototype.uncork = function() {
    this._corked && --this._corked === 0 && this.emit("uncork");
  };
  Re.prototype.setWritable = function(e) {
    if (this._unwrite && this._unwrite(), this.destroyed) {
      e && e.destroy && e.destroy();
      return;
    }
    if (e === null || e === !1) {
      this.end();
      return;
    }
    var t = this, r = oy(e, { writable: !0, readable: !1 }, uy(this, this._forwardEnd)), i = /* @__PURE__ */ s(function() {
      var o = t._ondrain;
      t._ondrain = null, o && o();
    }, "ondrain"), n = /* @__PURE__ */ s(function() {
      t._writable.removeListener("drain", i), r();
    }, "clear");
    this._unwrite && process.nextTick(i), this._writable = e, this._writable.on("drain", i), this._unwrite = n, this.uncork();
  };
  Re.prototype.setReadable = function(e) {
    if (this._unread && this._unread(), this.destroyed) {
      e && e.destroy && e.destroy();
      return;
    }
    if (e === null || e === !1) {
      this.push(null), this.resume();
      return;
    }
    var t = this, r = oy(e, { writable: !1, readable: !0 }, uy(this)), i = /* @__PURE__ */ s(function() {
      t._forward();
    }, "onreadable"), n = /* @__PURE__ */ s(function() {
      t.push(null);
    }, "onend"), o = /* @__PURE__ */ s(function() {
      t._readable2.removeListener("readable", i), t._readable2.removeListener("end", n), r();
    }, "clear");
    this._drained = !0, this._readable = e, this._readable2 = e._readableState ? e : wT(e), this._readable2.on("readable", i), this._readable2.
    on("end", n), this._unread = o, this._forward();
  };
  Re.prototype._read = function() {
    this._drained = !0, this._forward();
  };
  Re.prototype._forward = function() {
    if (!(this._forwarding || !this._readable2 || !this._drained)) {
      this._forwarding = !0;
      for (var e; this._drained && (e = bT(this._readable2)) !== null; )
        this.destroyed || (this._drained = this.push(e));
      this._forwarding = !1;
    }
  };
  Re.prototype.destroy = function(e) {
    if (!this.destroyed) {
      this.destroyed = !0;
      var t = this;
      process.nextTick(function() {
        t._destroy(e);
      });
    }
  };
  Re.prototype._destroy = function(e) {
    if (e) {
      var t = this._ondrain;
      this._ondrain = null, t ? t(e) : this.emit("error", e);
    }
    this._forwardDestroy && (this._readable && this._readable.destroy && this._readable.destroy(), this._writable && this._writable.destroy &&
    this._writable.destroy()), this.emit("close");
  };
  Re.prototype._write = function(e, t, r) {
    if (this.destroyed) return r();
    if (this._corked) return Zl(this, this._write.bind(this, e, t, r));
    if (e === ay) return this._finish(r);
    if (!this._writable) return r();
    this._writable.write(e) === !1 ? this._ondrain = r : r();
  };
  Re.prototype._finish = function(e) {
    var t = this;
    this.emit("preend"), Zl(this, function() {
      _T(t._forwardEnd && t._writable, function() {
        t._writableState.prefinished === !1 && (t._writableState.prefinished = !0), t.emit("prefinish"), Zl(t, e);
      });
    });
  };
  Re.prototype.end = function(e, t, r) {
    return typeof e == "function" ? this.end(null, null, e) : typeof t == "function" ? this.end(e, null, t) : (this._ended = !0, e && this.write(
    e), this._writableState.ending || this.write(ay), po.Writable.prototype.end.call(this, r));
  };
  ly.exports = Re;
});

// ../node_modules/through2/node_modules/isarray/index.js
var fy = b((NM, dy) => {
  var ET = {}.toString;
  dy.exports = Array.isArray || function(e) {
    return ET.call(e) == "[object Array]";
  };
});

// ../node_modules/through2/node_modules/readable-stream/lib/internal/streams/stream.js
var zl = b((UM, hy) => {
  hy.exports = require("stream");
});

// ../node_modules/through2/node_modules/safe-buffer/index.js
var mo = b((Gl, Dy) => {
  var Do = require("buffer"), Pt = Do.Buffer;
  function py(e, t) {
    for (var r in e)
      t[r] = e[r];
  }
  s(py, "copyProps");
  Pt.from && Pt.alloc && Pt.allocUnsafe && Pt.allocUnsafeSlow ? Dy.exports = Do : (py(Do, Gl), Gl.Buffer = mi);
  function mi(e, t, r) {
    return Pt(e, t, r);
  }
  s(mi, "SafeBuffer");
  py(Pt, mi);
  mi.from = function(e, t, r) {
    if (typeof e == "number")
      throw new TypeError("Argument must not be a number");
    return Pt(e, t, r);
  };
  mi.alloc = function(e, t, r) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    var i = Pt(e);
    return t !== void 0 ? typeof r == "string" ? i.fill(t, r) : i.fill(t) : i.fill(0), i;
  };
  mi.allocUnsafe = function(e) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    return Pt(e);
  };
  mi.allocUnsafeSlow = function(e) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    return Do.SlowBuffer(e);
  };
});

// ../node_modules/through2/node_modules/readable-stream/lib/internal/streams/BufferList.js
var gy = b((WM, Kl) => {
  "use strict";
  function CT(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  s(CT, "_classCallCheck");
  var my = mo().Buffer, Cn = require("util");
  function xT(e, t, r) {
    e.copy(t, r);
  }
  s(xT, "copyBuffer");
  Kl.exports = function() {
    function e() {
      CT(this, e), this.head = null, this.tail = null, this.length = 0;
    }
    return s(e, "BufferList"), e.prototype.push = /* @__PURE__ */ s(function(r) {
      var i = { data: r, next: null };
      this.length > 0 ? this.tail.next = i : this.head = i, this.tail = i, ++this.length;
    }, "push"), e.prototype.unshift = /* @__PURE__ */ s(function(r) {
      var i = { data: r, next: this.head };
      this.length === 0 && (this.tail = i), this.head = i, ++this.length;
    }, "unshift"), e.prototype.shift = /* @__PURE__ */ s(function() {
      if (this.length !== 0) {
        var r = this.head.data;
        return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, r;
      }
    }, "shift"), e.prototype.clear = /* @__PURE__ */ s(function() {
      this.head = this.tail = null, this.length = 0;
    }, "clear"), e.prototype.join = /* @__PURE__ */ s(function(r) {
      if (this.length === 0) return "";
      for (var i = this.head, n = "" + i.data; i = i.next; )
        n += r + i.data;
      return n;
    }, "join"), e.prototype.concat = /* @__PURE__ */ s(function(r) {
      if (this.length === 0) return my.alloc(0);
      for (var i = my.allocUnsafe(r >>> 0), n = this.head, o = 0; n; )
        xT(n.data, i, o), o += n.data.length, n = n.next;
      return i;
    }, "concat"), e;
  }();
  Cn && Cn.inspect && Cn.inspect.custom && (Kl.exports.prototype[Cn.inspect.custom] = function() {
    var e = Cn.inspect({ length: this.length });
    return this.constructor.name + " " + e;
  });
});

// ../node_modules/through2/node_modules/readable-stream/lib/internal/streams/destroy.js
var Yl = b((VM, yy) => {
  "use strict";
  var go = Ve();
  function FT(e, t) {
    var r = this, i = this._readableState && this._readableState.destroyed, n = this._writableState && this._writableState.destroyed;
    return i || n ? (t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, go.nextTick(
    yo, this, e)) : go.nextTick(yo, this, e)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this.
    _writableState.destroyed = !0), this._destroy(e || null, function(o) {
      !t && o ? r._writableState ? r._writableState.errorEmitted || (r._writableState.errorEmitted = !0, go.nextTick(yo, r, o)) : go.nextTick(
      yo, r, o) : t && t(o);
    }), this);
  }
  s(FT, "destroy");
  function ST() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.
    endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending =
    !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted =
    !1);
  }
  s(ST, "undestroy");
  function yo(e, t) {
    e.emit("error", t);
  }
  s(yo, "emitErrorNT");
  yy.exports = {
    destroy: FT,
    undestroy: ST
  };
});

// ../node_modules/through2/node_modules/readable-stream/lib/_stream_writable.js
var Xl = b((zM, Fy) => {
  "use strict";
  var br = Ve();
  Fy.exports = Ce;
  function vy(e) {
    var t = this;
    this.next = null, this.entry = null, this.finish = function() {
      VT(t, e);
    };
  }
  s(vy, "CorkedRequest");
  var TT = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : br.nextTick, gi;
  Ce.WritableState = Fn;
  var _y = Object.create(Me());
  _y.inherits = oe();
  var AT = {
    deprecate: rn()
  }, wy = zl(), vo = mo().Buffer, RT = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array ||
  function() {
  };
  function kT(e) {
    return vo.from(e);
  }
  s(kT, "_uint8ArrayToBuffer");
  function OT(e) {
    return vo.isBuffer(e) || e instanceof RT;
  }
  s(OT, "_isUint8Array");
  var Ey = Yl();
  _y.inherits(Ce, wy);
  function BT() {
  }
  s(BT, "nop");
  function Fn(e, t) {
    gi = gi || vr(), e = e || {};
    var r = t instanceof gi;
    this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.writableObjectMode);
    var i = e.highWaterMark, n = e.writableHighWaterMark, o = this.objectMode ? 16 : 16 * 1024;
    i || i === 0 ? this.highWaterMark = i : r && (n || n === 0) ? this.highWaterMark = n : this.highWaterMark = o, this.highWaterMark = Math.
    floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed =
    !1;
    var a = e.decodeStrings === !1;
    this.decodeStrings = !a, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync =
    !0, this.bufferProcessing = !1, this.onwrite = function(u) {
      NT(t, u);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished =
    !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new vy(this);
  }
  s(Fn, "WritableState");
  Fn.prototype.getBuffer = /* @__PURE__ */ s(function() {
    for (var t = this.bufferedRequest, r = []; t; )
      r.push(t), t = t.next;
    return r;
  }, "getBuffer");
  (function() {
    try {
      Object.defineProperty(Fn.prototype, "buffer", {
        get: AT.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  })();
  var bo;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (bo = Function.prototype[Symbol.
  hasInstance], Object.defineProperty(Ce, Symbol.hasInstance, {
    value: /* @__PURE__ */ s(function(e) {
      return bo.call(this, e) ? !0 : this !== Ce ? !1 : e && e._writableState instanceof Fn;
    }, "value")
  })) : bo = /* @__PURE__ */ s(function(e) {
    return e instanceof this;
  }, "realHasInstance");
  function Ce(e) {
    if (gi = gi || vr(), !bo.call(Ce, this) && !(this instanceof gi))
      return new Ce(e);
    this._writableState = new Fn(e, this), this.writable = !0, e && (typeof e.write == "function" && (this._write = e.write), typeof e.writev ==
    "function" && (this._writev = e.writev), typeof e.destroy == "function" && (this._destroy = e.destroy), typeof e.final == "function" && (this.
    _final = e.final)), wy.call(this);
  }
  s(Ce, "Writable");
  Ce.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function PT(e, t) {
    var r = new Error("write after end");
    e.emit("error", r), br.nextTick(t, r);
  }
  s(PT, "writeAfterEnd");
  function IT(e, t, r, i) {
    var n = !0, o = !1;
    return r === null ? o = new TypeError("May not write null values to stream") : typeof r != "string" && r !== void 0 && !t.objectMode && (o =
    new TypeError("Invalid non-string/buffer chunk")), o && (e.emit("error", o), br.nextTick(i, o), n = !1), n;
  }
  s(IT, "validChunk");
  Ce.prototype.write = function(e, t, r) {
    var i = this._writableState, n = !1, o = !i.objectMode && OT(e);
    return o && !vo.isBuffer(e) && (e = kT(e)), typeof t == "function" && (r = t, t = null), o ? t = "buffer" : t || (t = i.defaultEncoding),
    typeof r != "function" && (r = BT), i.ended ? PT(this, r) : (o || IT(this, i, e, r)) && (i.pendingcb++, n = jT(this, i, o, e, t, r)), n;
  };
  Ce.prototype.cork = function() {
    var e = this._writableState;
    e.corked++;
  };
  Ce.prototype.uncork = function() {
    var e = this._writableState;
    e.corked && (e.corked--, !e.writing && !e.corked && !e.bufferProcessing && e.bufferedRequest && Cy(this, e));
  };
  Ce.prototype.setDefaultEncoding = /* @__PURE__ */ s(function(t) {
    if (typeof t == "string" && (t = t.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "\
utf-16le", "raw"].indexOf((t + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + t);
    return this._writableState.defaultEncoding = t, this;
  }, "setDefaultEncoding");
  function MT(e, t, r) {
    return !e.objectMode && e.decodeStrings !== !1 && typeof t == "string" && (t = vo.from(t, r)), t;
  }
  s(MT, "decodeChunk");
  Object.defineProperty(Ce.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  function jT(e, t, r, i, n, o) {
    if (!r) {
      var a = MT(t, i, n);
      i !== a && (r = !0, n = "buffer", i = a);
    }
    var u = t.objectMode ? 1 : i.length;
    t.length += u;
    var l = t.length < t.highWaterMark;
    if (l || (t.needDrain = !0), t.writing || t.corked) {
      var c = t.lastBufferedRequest;
      t.lastBufferedRequest = {
        chunk: i,
        encoding: n,
        isBuf: r,
        callback: o,
        next: null
      }, c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
    } else
      Jl(e, t, !1, u, i, n, o);
    return l;
  }
  s(jT, "writeOrBuffer");
  function Jl(e, t, r, i, n, o, a) {
    t.writelen = i, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(n, t.onwrite) : e._write(n, o, t.onwrite), t.sync = !1;
  }
  s(Jl, "doWrite");
  function qT(e, t, r, i, n) {
    --t.pendingcb, r ? (br.nextTick(n, i), br.nextTick(xn, e, t), e._writableState.errorEmitted = !0, e.emit("error", i)) : (n(i), e._writableState.
    errorEmitted = !0, e.emit("error", i), xn(e, t));
  }
  s(qT, "onwriteError");
  function LT(e) {
    e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
  }
  s(LT, "onwriteStateUpdate");
  function NT(e, t) {
    var r = e._writableState, i = r.sync, n = r.writecb;
    if (LT(r), t) qT(e, r, i, t, n);
    else {
      var o = xy(r);
      !o && !r.corked && !r.bufferProcessing && r.bufferedRequest && Cy(e, r), i ? TT(by, e, r, o, n) : by(e, r, o, n);
    }
  }
  s(NT, "onwrite");
  function by(e, t, r, i) {
    r || UT(e, t), t.pendingcb--, i(), xn(e, t);
  }
  s(by, "afterWrite");
  function UT(e, t) {
    t.length === 0 && t.needDrain && (t.needDrain = !1, e.emit("drain"));
  }
  s(UT, "onwriteDrain");
  function Cy(e, t) {
    t.bufferProcessing = !0;
    var r = t.bufferedRequest;
    if (e._writev && r && r.next) {
      var i = t.bufferedRequestCount, n = new Array(i), o = t.corkedRequestsFree;
      o.entry = r;
      for (var a = 0, u = !0; r; )
        n[a] = r, r.isBuf || (u = !1), r = r.next, a += 1;
      n.allBuffers = u, Jl(e, t, !0, t.length, n, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree =
      o.next, o.next = null) : t.corkedRequestsFree = new vy(t), t.bufferedRequestCount = 0;
    } else {
      for (; r; ) {
        var l = r.chunk, c = r.encoding, d = r.callback, p = t.objectMode ? 1 : l.length;
        if (Jl(e, t, !1, p, l, c, d), r = r.next, t.bufferedRequestCount--, t.writing)
          break;
      }
      r === null && (t.lastBufferedRequest = null);
    }
    t.bufferedRequest = r, t.bufferProcessing = !1;
  }
  s(Cy, "clearBuffer");
  Ce.prototype._write = function(e, t, r) {
    r(new Error("_write() is not implemented"));
  };
  Ce.prototype._writev = null;
  Ce.prototype.end = function(e, t, r) {
    var i = this._writableState;
    typeof e == "function" ? (r = e, e = null, t = null) : typeof t == "function" && (r = t, t = null), e != null && this.write(e, t), i.corked &&
    (i.corked = 1, this.uncork()), i.ending || HT(this, i, r);
  };
  function xy(e) {
    return e.ending && e.length === 0 && e.bufferedRequest === null && !e.finished && !e.writing;
  }
  s(xy, "needFinish");
  function $T(e, t) {
    e._final(function(r) {
      t.pendingcb--, r && e.emit("error", r), t.prefinished = !0, e.emit("prefinish"), xn(e, t);
    });
  }
  s($T, "callFinal");
  function WT(e, t) {
    !t.prefinished && !t.finalCalled && (typeof e._final == "function" ? (t.pendingcb++, t.finalCalled = !0, br.nextTick($T, e, t)) : (t.prefinished =
    !0, e.emit("prefinish")));
  }
  s(WT, "prefinish");
  function xn(e, t) {
    var r = xy(t);
    return r && (WT(e, t), t.pendingcb === 0 && (t.finished = !0, e.emit("finish"))), r;
  }
  s(xn, "finishMaybe");
  function HT(e, t, r) {
    t.ending = !0, xn(e, t), r && (t.finished ? br.nextTick(r) : e.once("finish", r)), t.ended = !0, e.writable = !1;
  }
  s(HT, "endWritable");
  function VT(e, t, r) {
    var i = e.entry;
    for (e.entry = null; i; ) {
      var n = i.callback;
      t.pendingcb--, n(r), i = i.next;
    }
    t.corkedRequestsFree.next = e;
  }
  s(VT, "onCorkedFinish");
  Object.defineProperty(Ce.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._writableState && (this._writableState.destroyed = e);
    }, "set")
  });
  Ce.prototype.destroy = Ey.destroy;
  Ce.prototype._undestroy = Ey.undestroy;
  Ce.prototype._destroy = function(e, t) {
    this.end(), t(e);
  };
});

// ../node_modules/through2/node_modules/readable-stream/lib/_stream_duplex.js
var vr = b((KM, Ry) => {
  "use strict";
  var Sy = Ve(), ZT = Object.keys || function(e) {
    var t = [];
    for (var r in e)
      t.push(r);
    return t;
  };
  Ry.exports = It;
  var Ty = Object.create(Me());
  Ty.inherits = oe();
  var Ay = tc(), ec = Xl();
  Ty.inherits(It, Ay);
  for (Ql = ZT(ec.prototype), _o = 0; _o < Ql.length; _o++)
    wo = Ql[_o], It.prototype[wo] || (It.prototype[wo] = ec.prototype[wo]);
  var Ql, wo, _o;
  function It(e) {
    if (!(this instanceof It)) return new It(e);
    Ay.call(this, e), ec.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.
    allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", zT);
  }
  s(It, "Duplex");
  Object.defineProperty(It.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  function zT() {
    this.allowHalfOpen || this._writableState.ended || Sy.nextTick(GT, this);
  }
  s(zT, "onend");
  function GT(e) {
    e.end();
  }
  s(GT, "onEndNT");
  Object.defineProperty(It.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = e, this._writableState.destroyed =
      e);
    }, "set")
  });
  It.prototype._destroy = function(e, t) {
    this.push(null), this.end(), Sy.nextTick(t, e);
  };
});

// ../node_modules/through2/node_modules/readable-stream/lib/_stream_readable.js
var tc = b((XM, $y) => {
  "use strict";
  var bi = Ve();
  $y.exports = de;
  var KT = fy(), Sn;
  de.ReadableState = jy;
  var JM = require("events").EventEmitter, Py = /* @__PURE__ */ s(function(e, t) {
    return e.listeners(t).length;
  }, "EElistenerCount"), oc = zl(), Tn = mo().Buffer, YT = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ?
  self : {}).Uint8Array || function() {
  };
  function JT(e) {
    return Tn.from(e);
  }
  s(JT, "_uint8ArrayToBuffer");
  function XT(e) {
    return Tn.isBuffer(e) || e instanceof YT;
  }
  s(XT, "_isUint8Array");
  var Iy = Object.create(Me());
  Iy.inherits = oe();
  var rc = require("util"), Q = void 0;
  rc && rc.debuglog ? Q = rc.debuglog("stream") : Q = /* @__PURE__ */ s(function() {
  }, "debug");
  var QT = gy(), My = Yl(), yi;
  Iy.inherits(de, oc);
  var ic = ["error", "close", "destroy", "pause", "resume"];
  function eA(e, t, r) {
    if (typeof e.prependListener == "function") return e.prependListener(t, r);
    !e._events || !e._events[t] ? e.on(t, r) : KT(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]];
  }
  s(eA, "prependListener");
  function jy(e, t) {
    Sn = Sn || vr(), e = e || {};
    var r = t instanceof Sn;
    this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.readableObjectMode);
    var i = e.highWaterMark, n = e.readableHighWaterMark, o = this.objectMode ? 16 : 16 * 1024;
    i || i === 0 ? this.highWaterMark = i : r && (n || n === 0) ? this.highWaterMark = n : this.highWaterMark = o, this.highWaterMark = Math.
    floor(this.highWaterMark), this.buffer = new QT(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended =
    !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening =
    !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore =
    !1, this.decoder = null, this.encoding = null, e.encoding && (yi || (yi = require("string_decoder/").StringDecoder), this.decoder = new yi(
    e.encoding), this.encoding = e.encoding);
  }
  s(jy, "ReadableState");
  function de(e) {
    if (Sn = Sn || vr(), !(this instanceof de)) return new de(e);
    this._readableState = new jy(e, this), this.readable = !0, e && (typeof e.read == "function" && (this._read = e.read), typeof e.destroy ==
    "function" && (this._destroy = e.destroy)), oc.call(this);
  }
  s(de, "Readable");
  Object.defineProperty(de.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._readableState && (this._readableState.destroyed = e);
    }, "set")
  });
  de.prototype.destroy = My.destroy;
  de.prototype._undestroy = My.undestroy;
  de.prototype._destroy = function(e, t) {
    this.push(null), t(e);
  };
  de.prototype.push = function(e, t) {
    var r = this._readableState, i;
    return r.objectMode ? i = !0 : typeof e == "string" && (t = t || r.defaultEncoding, t !== r.encoding && (e = Tn.from(e, t), t = ""), i =
    !0), qy(this, e, t, !1, i);
  };
  de.prototype.unshift = function(e) {
    return qy(this, e, null, !0, !1);
  };
  function qy(e, t, r, i, n) {
    var o = e._readableState;
    if (t === null)
      o.reading = !1, nA(e, o);
    else {
      var a;
      n || (a = tA(o, t)), a ? e.emit("error", a) : o.objectMode || t && t.length > 0 ? (typeof t != "string" && !o.objectMode && Object.getPrototypeOf(
      t) !== Tn.prototype && (t = JT(t)), i ? o.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : nc(e, o, t, !0) :
      o.ended ? e.emit("error", new Error("stream.push() after EOF")) : (o.reading = !1, o.decoder && !r ? (t = o.decoder.write(t), o.objectMode ||
      t.length !== 0 ? nc(e, o, t, !1) : Ly(e, o)) : nc(e, o, t, !1))) : i || (o.reading = !1);
    }
    return rA(o);
  }
  s(qy, "readableAddChunk");
  function nc(e, t, r, i) {
    t.flowing && t.length === 0 && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(
    r) : t.buffer.push(r), t.needReadable && Eo(e)), Ly(e, t);
  }
  s(nc, "addChunk");
  function tA(e, t) {
    var r;
    return !XT(t) && typeof t != "string" && t !== void 0 && !e.objectMode && (r = new TypeError("Invalid non-string/buffer chunk")), r;
  }
  s(tA, "chunkInvalid");
  function rA(e) {
    return !e.ended && (e.needReadable || e.length < e.highWaterMark || e.length === 0);
  }
  s(rA, "needMoreData");
  de.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  };
  de.prototype.setEncoding = function(e) {
    return yi || (yi = require("string_decoder/").StringDecoder), this._readableState.decoder = new yi(e), this._readableState.encoding = e,
    this;
  };
  var ky = 8388608;
  function iA(e) {
    return e >= ky ? e = ky : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
  }
  s(iA, "computeNewHighWaterMark");
  function Oy(e, t) {
    return e <= 0 || t.length === 0 && t.ended ? 0 : t.objectMode ? 1 : e !== e ? t.flowing && t.length ? t.buffer.head.data.length : t.length :
    (e > t.highWaterMark && (t.highWaterMark = iA(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
  }
  s(Oy, "howMuchToRead");
  de.prototype.read = function(e) {
    Q("read", e), e = parseInt(e, 10);
    var t = this._readableState, r = e;
    if (e !== 0 && (t.emittedReadable = !1), e === 0 && t.needReadable && (t.length >= t.highWaterMark || t.ended))
      return Q("read: emitReadable", t.length, t.ended), t.length === 0 && t.ended ? sc(this) : Eo(this), null;
    if (e = Oy(e, t), e === 0 && t.ended)
      return t.length === 0 && sc(this), null;
    var i = t.needReadable;
    Q("need readable", i), (t.length === 0 || t.length - e < t.highWaterMark) && (i = !0, Q("length less than watermark", i)), t.ended || t.
    reading ? (i = !1, Q("reading or ended", i)) : i && (Q("do read"), t.reading = !0, t.sync = !0, t.length === 0 && (t.needReadable = !0),
    this._read(t.highWaterMark), t.sync = !1, t.reading || (e = Oy(r, t)));
    var n;
    return e > 0 ? n = Ny(e, t) : n = null, n === null ? (t.needReadable = !0, e = 0) : t.length -= e, t.length === 0 && (t.ended || (t.needReadable =
    !0), r !== e && t.ended && sc(this)), n !== null && this.emit("data", n), n;
  };
  function nA(e, t) {
    if (!t.ended) {
      if (t.decoder) {
        var r = t.decoder.end();
        r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
      }
      t.ended = !0, Eo(e);
    }
  }
  s(nA, "onEofChunk");
  function Eo(e) {
    var t = e._readableState;
    t.needReadable = !1, t.emittedReadable || (Q("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? bi.nextTick(By, e) : By(e));
  }
  s(Eo, "emitReadable");
  function By(e) {
    Q("emit readable"), e.emit("readable"), ac(e);
  }
  s(By, "emitReadable_");
  function Ly(e, t) {
    t.readingMore || (t.readingMore = !0, bi.nextTick(sA, e, t));
  }
  s(Ly, "maybeReadMore");
  function sA(e, t) {
    for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (Q("maybeReadMore read 0"), e.read(0), r !==
    t.length); )
      r = t.length;
    t.readingMore = !1;
  }
  s(sA, "maybeReadMore_");
  de.prototype._read = function(e) {
    this.emit("error", new Error("_read() is not implemented"));
  };
  de.prototype.pipe = function(e, t) {
    var r = this, i = this._readableState;
    switch (i.pipesCount) {
      case 0:
        i.pipes = e;
        break;
      case 1:
        i.pipes = [i.pipes, e];
        break;
      default:
        i.pipes.push(e);
        break;
    }
    i.pipesCount += 1, Q("pipe count=%d opts=%j", i.pipesCount, t);
    var n = (!t || t.end !== !1) && e !== process.stdout && e !== process.stderr, o = n ? u : _;
    i.endEmitted ? bi.nextTick(o) : r.once("end", o), e.on("unpipe", a);
    function a(C, x) {
      Q("onunpipe"), C === r && x && x.hasUnpiped === !1 && (x.hasUnpiped = !0, d());
    }
    s(a, "onunpipe");
    function u() {
      Q("onend"), e.end();
    }
    s(u, "onend");
    var l = oA(r);
    e.on("drain", l);
    var c = !1;
    function d() {
      Q("cleanup"), e.removeListener("close", g), e.removeListener("finish", E), e.removeListener("drain", l), e.removeListener("error", f),
      e.removeListener("unpipe", a), r.removeListener("end", u), r.removeListener("end", _), r.removeListener("data", h), c = !0, i.awaitDrain &&
      (!e._writableState || e._writableState.needDrain) && l();
    }
    s(d, "cleanup");
    var p = !1;
    r.on("data", h);
    function h(C) {
      Q("ondata"), p = !1;
      var x = e.write(C);
      x === !1 && !p && ((i.pipesCount === 1 && i.pipes === e || i.pipesCount > 1 && Uy(i.pipes, e) !== -1) && !c && (Q("false write respons\
e, pause", i.awaitDrain), i.awaitDrain++, p = !0), r.pause());
    }
    s(h, "ondata");
    function f(C) {
      Q("onerror", C), _(), e.removeListener("error", f), Py(e, "error") === 0 && e.emit("error", C);
    }
    s(f, "onerror"), eA(e, "error", f);
    function g() {
      e.removeListener("finish", E), _();
    }
    s(g, "onclose"), e.once("close", g);
    function E() {
      Q("onfinish"), e.removeListener("close", g), _();
    }
    s(E, "onfinish"), e.once("finish", E);
    function _() {
      Q("unpipe"), r.unpipe(e);
    }
    return s(_, "unpipe"), e.emit("pipe", r), i.flowing || (Q("pipe resume"), r.resume()), e;
  };
  function oA(e) {
    return function() {
      var t = e._readableState;
      Q("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, t.awaitDrain === 0 && Py(e, "data") && (t.flowing = !0, ac(e));
    };
  }
  s(oA, "pipeOnDrain");
  de.prototype.unpipe = function(e) {
    var t = this._readableState, r = { hasUnpiped: !1 };
    if (t.pipesCount === 0) return this;
    if (t.pipesCount === 1)
      return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r),
      this);
    if (!e) {
      var i = t.pipes, n = t.pipesCount;
      t.pipes = null, t.pipesCount = 0, t.flowing = !1;
      for (var o = 0; o < n; o++)
        i[o].emit("unpipe", this, { hasUnpiped: !1 });
      return this;
    }
    var a = Uy(t.pipes, e);
    return a === -1 ? this : (t.pipes.splice(a, 1), t.pipesCount -= 1, t.pipesCount === 1 && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r),
    this);
  };
  de.prototype.on = function(e, t) {
    var r = oc.prototype.on.call(this, e, t);
    if (e === "data")
      this._readableState.flowing !== !1 && this.resume();
    else if (e === "readable") {
      var i = this._readableState;
      !i.endEmitted && !i.readableListening && (i.readableListening = i.needReadable = !0, i.emittedReadable = !1, i.reading ? i.length && Eo(
      this) : bi.nextTick(aA, this));
    }
    return r;
  };
  de.prototype.addListener = de.prototype.on;
  function aA(e) {
    Q("readable nexttick read 0"), e.read(0);
  }
  s(aA, "nReadingNextTick");
  de.prototype.resume = function() {
    var e = this._readableState;
    return e.flowing || (Q("resume"), e.flowing = !0, uA(this, e)), this;
  };
  function uA(e, t) {
    t.resumeScheduled || (t.resumeScheduled = !0, bi.nextTick(lA, e, t));
  }
  s(uA, "resume");
  function lA(e, t) {
    t.reading || (Q("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), ac(e), t.flowing && !t.reading &&
    e.read(0);
  }
  s(lA, "resume_");
  de.prototype.pause = function() {
    return Q("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (Q("pause"), this._readableState.flowing =
    !1, this.emit("pause")), this;
  };
  function ac(e) {
    var t = e._readableState;
    for (Q("flow", t.flowing); t.flowing && e.read() !== null; )
      ;
  }
  s(ac, "flow");
  de.prototype.wrap = function(e) {
    var t = this, r = this._readableState, i = !1;
    e.on("end", function() {
      if (Q("wrapped end"), r.decoder && !r.ended) {
        var a = r.decoder.end();
        a && a.length && t.push(a);
      }
      t.push(null);
    }), e.on("data", function(a) {
      if (Q("wrapped data"), r.decoder && (a = r.decoder.write(a)), !(r.objectMode && a == null) && !(!r.objectMode && (!a || !a.length))) {
        var u = t.push(a);
        u || (i = !0, e.pause());
      }
    });
    for (var n in e)
      this[n] === void 0 && typeof e[n] == "function" && (this[n] = /* @__PURE__ */ function(a) {
        return function() {
          return e[a].apply(e, arguments);
        };
      }(n));
    for (var o = 0; o < ic.length; o++)
      e.on(ic[o], this.emit.bind(this, ic[o]));
    return this._read = function(a) {
      Q("wrapped _read", a), i && (i = !1, e.resume());
    }, this;
  };
  Object.defineProperty(de.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._readableState.highWaterMark;
    }, "get")
  });
  de._fromList = Ny;
  function Ny(e, t) {
    if (t.length === 0) return null;
    var r;
    return t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (t.decoder ? r = t.buffer.join("") : t.buffer.length === 1 ? r = t.buffer.
    head.data : r = t.buffer.concat(t.length), t.buffer.clear()) : r = cA(e, t.buffer, t.decoder), r;
  }
  s(Ny, "fromList");
  function cA(e, t, r) {
    var i;
    return e < t.head.data.length ? (i = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : e === t.head.data.length ? i = t.shift() :
    i = r ? dA(e, t) : fA(e, t), i;
  }
  s(cA, "fromListPartial");
  function dA(e, t) {
    var r = t.head, i = 1, n = r.data;
    for (e -= n.length; r = r.next; ) {
      var o = r.data, a = e > o.length ? o.length : e;
      if (a === o.length ? n += o : n += o.slice(0, e), e -= a, e === 0) {
        a === o.length ? (++i, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = o.slice(a));
        break;
      }
      ++i;
    }
    return t.length -= i, n;
  }
  s(dA, "copyFromBufferString");
  function fA(e, t) {
    var r = Tn.allocUnsafe(e), i = t.head, n = 1;
    for (i.data.copy(r), e -= i.data.length; i = i.next; ) {
      var o = i.data, a = e > o.length ? o.length : e;
      if (o.copy(r, r.length - e, 0, a), e -= a, e === 0) {
        a === o.length ? (++n, i.next ? t.head = i.next : t.head = t.tail = null) : (t.head = i, i.data = o.slice(a));
        break;
      }
      ++n;
    }
    return t.length -= n, r;
  }
  s(fA, "copyFromBuffer");
  function sc(e) {
    var t = e._readableState;
    if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
    t.endEmitted || (t.ended = !0, bi.nextTick(hA, t, e));
  }
  s(sc, "endReadable");
  function hA(e, t) {
    !e.endEmitted && e.length === 0 && (e.endEmitted = !0, t.readable = !1, t.emit("end"));
  }
  s(hA, "endReadableNT");
  function Uy(e, t) {
    for (var r = 0, i = e.length; r < i; r++)
      if (e[r] === t) return r;
    return -1;
  }
  s(Uy, "indexOf");
});

// ../node_modules/through2/node_modules/readable-stream/lib/_stream_transform.js
var uc = b((ej, Vy) => {
  "use strict";
  Vy.exports = Mt;
  var Co = vr(), Hy = Object.create(Me());
  Hy.inherits = oe();
  Hy.inherits(Mt, Co);
  function pA(e, t) {
    var r = this._transformState;
    r.transforming = !1;
    var i = r.writecb;
    if (!i)
      return this.emit("error", new Error("write callback called multiple times"));
    r.writechunk = null, r.writecb = null, t != null && this.push(t), i(e);
    var n = this._readableState;
    n.reading = !1, (n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
  }
  s(pA, "afterTransform");
  function Mt(e) {
    if (!(this instanceof Mt)) return new Mt(e);
    Co.call(this, e), this._transformState = {
      afterTransform: pA.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && (typeof e.transform == "function" && (this._transform = e.
    transform), typeof e.flush == "function" && (this._flush = e.flush)), this.on("prefinish", DA);
  }
  s(Mt, "Transform");
  function DA() {
    var e = this;
    typeof this._flush == "function" ? this._flush(function(t, r) {
      Wy(e, t, r);
    }) : Wy(this, null, null);
  }
  s(DA, "prefinish");
  Mt.prototype.push = function(e, t) {
    return this._transformState.needTransform = !1, Co.prototype.push.call(this, e, t);
  };
  Mt.prototype._transform = function(e, t, r) {
    throw new Error("_transform() is not implemented");
  };
  Mt.prototype._write = function(e, t, r) {
    var i = this._transformState;
    if (i.writecb = r, i.writechunk = e, i.writeencoding = t, !i.transforming) {
      var n = this._readableState;
      (i.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
    }
  };
  Mt.prototype._read = function(e) {
    var t = this._transformState;
    t.writechunk !== null && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) :
    t.needTransform = !0;
  };
  Mt.prototype._destroy = function(e, t) {
    var r = this;
    Co.prototype._destroy.call(this, e, function(i) {
      t(i), r.emit("close");
    });
  };
  function Wy(e, t, r) {
    if (t) return e.emit("error", t);
    if (r != null && e.push(r), e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
    if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
    return e.push(null);
  }
  s(Wy, "done");
});

// ../node_modules/through2/node_modules/readable-stream/lib/_stream_passthrough.js
var Ky = b((rj, Gy) => {
  "use strict";
  Gy.exports = An;
  var Zy = uc(), zy = Object.create(Me());
  zy.inherits = oe();
  zy.inherits(An, Zy);
  function An(e) {
    if (!(this instanceof An)) return new An(e);
    Zy.call(this, e);
  }
  s(An, "PassThrough");
  An.prototype._transform = function(e, t, r) {
    r(null, e);
  };
});

// ../node_modules/through2/node_modules/readable-stream/readable.js
var Yy = b((ke, xo) => {
  var gt = require("stream");
  process.env.READABLE_STREAM === "disable" && gt ? (xo.exports = gt, ke = xo.exports = gt.Readable, ke.Readable = gt.Readable, ke.Writable =
  gt.Writable, ke.Duplex = gt.Duplex, ke.Transform = gt.Transform, ke.PassThrough = gt.PassThrough, ke.Stream = gt) : (ke = xo.exports = tc(),
  ke.Stream = gt || ke, ke.Readable = ke, ke.Writable = Xl(), ke.Duplex = vr(), ke.Transform = uc(), ke.PassThrough = Ky());
});

// ../node_modules/xtend/immutable.js
var Xy = b((nj, Jy) => {
  Jy.exports = gA;
  var mA = Object.prototype.hasOwnProperty;
  function gA() {
    for (var e = {}, t = 0; t < arguments.length; t++) {
      var r = arguments[t];
      for (var i in r)
        mA.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }
  s(gA, "extend");
});

// ../node_modules/through2/through2.js
var cc = b((oj, Fo) => {
  var Qy = Yy().Transform, eb = require("util").inherits, tb = Xy();
  function vi(e) {
    Qy.call(this, e), this._destroyed = !1;
  }
  s(vi, "DestroyableTransform");
  eb(vi, Qy);
  vi.prototype.destroy = function(e) {
    if (!this._destroyed) {
      this._destroyed = !0;
      var t = this;
      process.nextTick(function() {
        e && t.emit("error", e), t.emit("close");
      });
    }
  };
  function yA(e, t, r) {
    r(null, e);
  }
  s(yA, "noop");
  function lc(e) {
    return function(t, r, i) {
      return typeof t == "function" && (i = r, r = t, t = {}), typeof r != "function" && (r = yA), typeof i != "function" && (i = null), e(t,
      r, i);
    };
  }
  s(lc, "through2");
  Fo.exports = lc(function(e, t, r) {
    var i = new vi(e);
    return i._transform = t, r && (i._flush = r), i;
  });
  Fo.exports.ctor = lc(function(e, t, r) {
    function i(n) {
      if (!(this instanceof i))
        return new i(n);
      this.options = tb(e, n), vi.call(this, this.options);
    }
    return s(i, "Through2"), eb(i, vi), i.prototype._transform = t, r && (i.prototype._flush = r), i;
  });
  Fo.exports.obj = lc(function(e, t, r) {
    var i = new vi(tb({ objectMode: !0, highWaterMark: 16 }, e));
    return i._transform = t, r && (i._flush = r), i;
  });
});

// ../node_modules/buffer-from/index.js
var ib = b((uj, rb) => {
  var bA = Object.prototype.toString, dc = typeof Buffer < "u" && typeof Buffer.alloc == "function" && typeof Buffer.allocUnsafe == "functio\
n" && typeof Buffer.from == "function";
  function vA(e) {
    return bA.call(e).slice(8, -1) === "ArrayBuffer";
  }
  s(vA, "isArrayBuffer");
  function _A(e, t, r) {
    t >>>= 0;
    var i = e.byteLength - t;
    if (i < 0)
      throw new RangeError("'offset' is out of bounds");
    if (r === void 0)
      r = i;
    else if (r >>>= 0, r > i)
      throw new RangeError("'length' is out of bounds");
    return dc ? Buffer.from(e.slice(t, t + r)) : new Buffer(new Uint8Array(e.slice(t, t + r)));
  }
  s(_A, "fromArrayBuffer");
  function wA(e, t) {
    if ((typeof t != "string" || t === "") && (t = "utf8"), !Buffer.isEncoding(t))
      throw new TypeError('"encoding" must be a valid string encoding');
    return dc ? Buffer.from(e, t) : new Buffer(e, t);
  }
  s(wA, "fromString");
  function EA(e, t, r) {
    if (typeof e == "number")
      throw new TypeError('"value" argument must not be a number');
    return vA(e) ? _A(e, t, r) : typeof e == "string" ? wA(e, t) : dc ? Buffer.from(e) : new Buffer(e);
  }
  s(EA, "bufferFrom");
  rb.exports = EA;
});

// ../node_modules/peek-stream/index.js
var ob = b((cj, sb) => {
  var CA = cy(), xA = cc(), FA = ib(), SA = /* @__PURE__ */ s(function(e) {
    return !Buffer.isBuffer(e) && typeof e != "string";
  }, "isObject"), nb = /* @__PURE__ */ s(function(e, t) {
    if (typeof e == "number" && (e = { maxBuffer: e }), typeof e == "function") return nb(null, e);
    e || (e = {});
    var r = typeof e.maxBuffer == "number" ? e.maxBuffer : 65535, i = e.strict, n = e.newline !== !1, o = [], a = 0, u = CA.obj(), l = xA.obj(
    { highWaterMark: 1 }, function(p, h, f) {
      if (SA(p)) return d(p, null, f);
      if (Buffer.isBuffer(p) || (p = FA(p)), n) {
        var g = Array.prototype.indexOf.call(p, 10);
        if (g > 0 && p[g - 1] === 13 && g--, g > -1)
          return o.push(p.slice(0, g)), d(Buffer.concat(o), p.slice(g), f);
      }
      if (o.push(p), a += p.length, a < r) return f();
      if (i) return f(new Error("No newline found"));
      d(Buffer.concat(o), null, f);
    }), c = /* @__PURE__ */ s(function() {
      if (i) return u.destroy(new Error("No newline found"));
      u.cork(), d(Buffer.concat(o), null, function(p) {
        if (p) return u.destroy(p);
        u.uncork();
      });
    }, "onpreend"), d = /* @__PURE__ */ s(function(p, h, f) {
      u.removeListener("preend", c), t(p, function(g, E) {
        if (g) return f(g);
        u.setWritable(E), u.setReadable(E), p && E.write(p), h && E.write(h), h = o = l = null, f();
      });
    }, "ready");
    return u.on("preend", c), u.setWritable(l), u;
  }, "peek");
  sb.exports = nb;
});

// ../node_modules/pumpify/node_modules/pump/index.js
var lb = b((fj, ub) => {
  var TA = ks(), AA = ti(), fc = require("fs"), Rn = /* @__PURE__ */ s(function() {
  }, "noop"), RA = /^v?\.0/.test(process.version), So = /* @__PURE__ */ s(function(e) {
    return typeof e == "function";
  }, "isFn"), kA = /* @__PURE__ */ s(function(e) {
    return !RA || !fc ? !1 : (e instanceof (fc.ReadStream || Rn) || e instanceof (fc.WriteStream || Rn)) && So(e.close);
  }, "isFS"), OA = /* @__PURE__ */ s(function(e) {
    return e.setHeader && So(e.abort);
  }, "isRequest"), BA = /* @__PURE__ */ s(function(e, t, r, i) {
    i = TA(i);
    var n = !1;
    e.on("close", function() {
      n = !0;
    }), AA(e, { readable: t, writable: r }, function(a) {
      if (a) return i(a);
      n = !0, i();
    });
    var o = !1;
    return function(a) {
      if (!n && !o) {
        if (o = !0, kA(e)) return e.close(Rn);
        if (OA(e)) return e.abort();
        if (So(e.destroy)) return e.destroy();
        i(a || new Error("stream was destroyed"));
      }
    };
  }, "destroyer"), ab = /* @__PURE__ */ s(function(e) {
    e();
  }, "call"), PA = /* @__PURE__ */ s(function(e, t) {
    return e.pipe(t);
  }, "pipe"), IA = /* @__PURE__ */ s(function() {
    var e = Array.prototype.slice.call(arguments), t = So(e[e.length - 1] || Rn) && e.pop() || Rn;
    if (Array.isArray(e[0]) && (e = e[0]), e.length < 2) throw new Error("pump requires two streams per minimum");
    var r, i = e.map(function(n, o) {
      var a = o < e.length - 1, u = o > 0;
      return BA(n, a, u, function(l) {
        r || (r = l), l && i.forEach(ab), !a && (i.forEach(ab), t(r));
      });
    });
    e.reduce(PA);
  }, "pump");
  ub.exports = IA;
});

// ../node_modules/pumpify/node_modules/isarray/index.js
var db = b((pj, cb) => {
  var MA = {}.toString;
  cb.exports = Array.isArray || function(e) {
    return MA.call(e) == "[object Array]";
  };
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/internal/streams/stream.js
var hc = b((Dj, fb) => {
  fb.exports = require("stream");
});

// ../node_modules/pumpify/node_modules/safe-buffer/index.js
var Ao = b((pc, pb) => {
  var To = require("buffer"), jt = To.Buffer;
  function hb(e, t) {
    for (var r in e)
      t[r] = e[r];
  }
  s(hb, "copyProps");
  jt.from && jt.alloc && jt.allocUnsafe && jt.allocUnsafeSlow ? pb.exports = To : (hb(To, pc), pc.Buffer = _i);
  function _i(e, t, r) {
    return jt(e, t, r);
  }
  s(_i, "SafeBuffer");
  hb(jt, _i);
  _i.from = function(e, t, r) {
    if (typeof e == "number")
      throw new TypeError("Argument must not be a number");
    return jt(e, t, r);
  };
  _i.alloc = function(e, t, r) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    var i = jt(e);
    return t !== void 0 ? typeof r == "string" ? i.fill(t, r) : i.fill(t) : i.fill(0), i;
  };
  _i.allocUnsafe = function(e) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    return jt(e);
  };
  _i.allocUnsafeSlow = function(e) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    return To.SlowBuffer(e);
  };
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/internal/streams/BufferList.js
var mb = b((gj, Dc) => {
  "use strict";
  function jA(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  s(jA, "_classCallCheck");
  var Db = Ao().Buffer, kn = require("util");
  function qA(e, t, r) {
    e.copy(t, r);
  }
  s(qA, "copyBuffer");
  Dc.exports = function() {
    function e() {
      jA(this, e), this.head = null, this.tail = null, this.length = 0;
    }
    return s(e, "BufferList"), e.prototype.push = /* @__PURE__ */ s(function(r) {
      var i = { data: r, next: null };
      this.length > 0 ? this.tail.next = i : this.head = i, this.tail = i, ++this.length;
    }, "push"), e.prototype.unshift = /* @__PURE__ */ s(function(r) {
      var i = { data: r, next: this.head };
      this.length === 0 && (this.tail = i), this.head = i, ++this.length;
    }, "unshift"), e.prototype.shift = /* @__PURE__ */ s(function() {
      if (this.length !== 0) {
        var r = this.head.data;
        return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, r;
      }
    }, "shift"), e.prototype.clear = /* @__PURE__ */ s(function() {
      this.head = this.tail = null, this.length = 0;
    }, "clear"), e.prototype.join = /* @__PURE__ */ s(function(r) {
      if (this.length === 0) return "";
      for (var i = this.head, n = "" + i.data; i = i.next; )
        n += r + i.data;
      return n;
    }, "join"), e.prototype.concat = /* @__PURE__ */ s(function(r) {
      if (this.length === 0) return Db.alloc(0);
      for (var i = Db.allocUnsafe(r >>> 0), n = this.head, o = 0; n; )
        qA(n.data, i, o), o += n.data.length, n = n.next;
      return i;
    }, "concat"), e;
  }();
  kn && kn.inspect && kn.inspect.custom && (Dc.exports.prototype[kn.inspect.custom] = function() {
    var e = kn.inspect({ length: this.length });
    return this.constructor.name + " " + e;
  });
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/internal/streams/destroy.js
var mc = b((bj, gb) => {
  "use strict";
  var Ro = Ve();
  function LA(e, t) {
    var r = this, i = this._readableState && this._readableState.destroyed, n = this._writableState && this._writableState.destroyed;
    return i || n ? (t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, Ro.nextTick(
    ko, this, e)) : Ro.nextTick(ko, this, e)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this.
    _writableState.destroyed = !0), this._destroy(e || null, function(o) {
      !t && o ? r._writableState ? r._writableState.errorEmitted || (r._writableState.errorEmitted = !0, Ro.nextTick(ko, r, o)) : Ro.nextTick(
      ko, r, o) : t && t(o);
    }), this);
  }
  s(LA, "destroy");
  function NA() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.
    endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending =
    !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted =
    !1);
  }
  s(NA, "undestroy");
  function ko(e, t) {
    e.emit("error", t);
  }
  s(ko, "emitErrorNT");
  gb.exports = {
    destroy: LA,
    undestroy: NA
  };
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/_stream_writable.js
var yc = b((_j, xb) => {
  "use strict";
  var _r = Ve();
  xb.exports = xe;
  function bb(e) {
    var t = this;
    this.next = null, this.entry = null, this.finish = function() {
      n1(t, e);
    };
  }
  s(bb, "CorkedRequest");
  var UA = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : _r.nextTick, wi;
  xe.WritableState = Bn;
  var vb = Object.create(Me());
  vb.inherits = oe();
  var $A = {
    deprecate: rn()
  }, _b = hc(), Bo = Ao().Buffer, WA = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array ||
  function() {
  };
  function HA(e) {
    return Bo.from(e);
  }
  s(HA, "_uint8ArrayToBuffer");
  function VA(e) {
    return Bo.isBuffer(e) || e instanceof WA;
  }
  s(VA, "_isUint8Array");
  var wb = mc();
  vb.inherits(xe, _b);
  function ZA() {
  }
  s(ZA, "nop");
  function Bn(e, t) {
    wi = wi || wr(), e = e || {};
    var r = t instanceof wi;
    this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.writableObjectMode);
    var i = e.highWaterMark, n = e.writableHighWaterMark, o = this.objectMode ? 16 : 16 * 1024;
    i || i === 0 ? this.highWaterMark = i : r && (n || n === 0) ? this.highWaterMark = n : this.highWaterMark = o, this.highWaterMark = Math.
    floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed =
    !1;
    var a = e.decodeStrings === !1;
    this.decodeStrings = !a, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync =
    !0, this.bufferProcessing = !1, this.onwrite = function(u) {
      QA(t, u);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished =
    !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new bb(this);
  }
  s(Bn, "WritableState");
  Bn.prototype.getBuffer = /* @__PURE__ */ s(function() {
    for (var t = this.bufferedRequest, r = []; t; )
      r.push(t), t = t.next;
    return r;
  }, "getBuffer");
  (function() {
    try {
      Object.defineProperty(Bn.prototype, "buffer", {
        get: $A.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  })();
  var Oo;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (Oo = Function.prototype[Symbol.
  hasInstance], Object.defineProperty(xe, Symbol.hasInstance, {
    value: /* @__PURE__ */ s(function(e) {
      return Oo.call(this, e) ? !0 : this !== xe ? !1 : e && e._writableState instanceof Bn;
    }, "value")
  })) : Oo = /* @__PURE__ */ s(function(e) {
    return e instanceof this;
  }, "realHasInstance");
  function xe(e) {
    if (wi = wi || wr(), !Oo.call(xe, this) && !(this instanceof wi))
      return new xe(e);
    this._writableState = new Bn(e, this), this.writable = !0, e && (typeof e.write == "function" && (this._write = e.write), typeof e.writev ==
    "function" && (this._writev = e.writev), typeof e.destroy == "function" && (this._destroy = e.destroy), typeof e.final == "function" && (this.
    _final = e.final)), _b.call(this);
  }
  s(xe, "Writable");
  xe.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function zA(e, t) {
    var r = new Error("write after end");
    e.emit("error", r), _r.nextTick(t, r);
  }
  s(zA, "writeAfterEnd");
  function GA(e, t, r, i) {
    var n = !0, o = !1;
    return r === null ? o = new TypeError("May not write null values to stream") : typeof r != "string" && r !== void 0 && !t.objectMode && (o =
    new TypeError("Invalid non-string/buffer chunk")), o && (e.emit("error", o), _r.nextTick(i, o), n = !1), n;
  }
  s(GA, "validChunk");
  xe.prototype.write = function(e, t, r) {
    var i = this._writableState, n = !1, o = !i.objectMode && VA(e);
    return o && !Bo.isBuffer(e) && (e = HA(e)), typeof t == "function" && (r = t, t = null), o ? t = "buffer" : t || (t = i.defaultEncoding),
    typeof r != "function" && (r = ZA), i.ended ? zA(this, r) : (o || GA(this, i, e, r)) && (i.pendingcb++, n = YA(this, i, o, e, t, r)), n;
  };
  xe.prototype.cork = function() {
    var e = this._writableState;
    e.corked++;
  };
  xe.prototype.uncork = function() {
    var e = this._writableState;
    e.corked && (e.corked--, !e.writing && !e.corked && !e.bufferProcessing && e.bufferedRequest && Eb(this, e));
  };
  xe.prototype.setDefaultEncoding = /* @__PURE__ */ s(function(t) {
    if (typeof t == "string" && (t = t.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "\
utf-16le", "raw"].indexOf((t + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + t);
    return this._writableState.defaultEncoding = t, this;
  }, "setDefaultEncoding");
  function KA(e, t, r) {
    return !e.objectMode && e.decodeStrings !== !1 && typeof t == "string" && (t = Bo.from(t, r)), t;
  }
  s(KA, "decodeChunk");
  Object.defineProperty(xe.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  function YA(e, t, r, i, n, o) {
    if (!r) {
      var a = KA(t, i, n);
      i !== a && (r = !0, n = "buffer", i = a);
    }
    var u = t.objectMode ? 1 : i.length;
    t.length += u;
    var l = t.length < t.highWaterMark;
    if (l || (t.needDrain = !0), t.writing || t.corked) {
      var c = t.lastBufferedRequest;
      t.lastBufferedRequest = {
        chunk: i,
        encoding: n,
        isBuf: r,
        callback: o,
        next: null
      }, c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
    } else
      gc(e, t, !1, u, i, n, o);
    return l;
  }
  s(YA, "writeOrBuffer");
  function gc(e, t, r, i, n, o, a) {
    t.writelen = i, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(n, t.onwrite) : e._write(n, o, t.onwrite), t.sync = !1;
  }
  s(gc, "doWrite");
  function JA(e, t, r, i, n) {
    --t.pendingcb, r ? (_r.nextTick(n, i), _r.nextTick(On, e, t), e._writableState.errorEmitted = !0, e.emit("error", i)) : (n(i), e._writableState.
    errorEmitted = !0, e.emit("error", i), On(e, t));
  }
  s(JA, "onwriteError");
  function XA(e) {
    e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
  }
  s(XA, "onwriteStateUpdate");
  function QA(e, t) {
    var r = e._writableState, i = r.sync, n = r.writecb;
    if (XA(r), t) JA(e, r, i, t, n);
    else {
      var o = Cb(r);
      !o && !r.corked && !r.bufferProcessing && r.bufferedRequest && Eb(e, r), i ? UA(yb, e, r, o, n) : yb(e, r, o, n);
    }
  }
  s(QA, "onwrite");
  function yb(e, t, r, i) {
    r || e1(e, t), t.pendingcb--, i(), On(e, t);
  }
  s(yb, "afterWrite");
  function e1(e, t) {
    t.length === 0 && t.needDrain && (t.needDrain = !1, e.emit("drain"));
  }
  s(e1, "onwriteDrain");
  function Eb(e, t) {
    t.bufferProcessing = !0;
    var r = t.bufferedRequest;
    if (e._writev && r && r.next) {
      var i = t.bufferedRequestCount, n = new Array(i), o = t.corkedRequestsFree;
      o.entry = r;
      for (var a = 0, u = !0; r; )
        n[a] = r, r.isBuf || (u = !1), r = r.next, a += 1;
      n.allBuffers = u, gc(e, t, !0, t.length, n, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree =
      o.next, o.next = null) : t.corkedRequestsFree = new bb(t), t.bufferedRequestCount = 0;
    } else {
      for (; r; ) {
        var l = r.chunk, c = r.encoding, d = r.callback, p = t.objectMode ? 1 : l.length;
        if (gc(e, t, !1, p, l, c, d), r = r.next, t.bufferedRequestCount--, t.writing)
          break;
      }
      r === null && (t.lastBufferedRequest = null);
    }
    t.bufferedRequest = r, t.bufferProcessing = !1;
  }
  s(Eb, "clearBuffer");
  xe.prototype._write = function(e, t, r) {
    r(new Error("_write() is not implemented"));
  };
  xe.prototype._writev = null;
  xe.prototype.end = function(e, t, r) {
    var i = this._writableState;
    typeof e == "function" ? (r = e, e = null, t = null) : typeof t == "function" && (r = t, t = null), e != null && this.write(e, t), i.corked &&
    (i.corked = 1, this.uncork()), i.ending || i1(this, i, r);
  };
  function Cb(e) {
    return e.ending && e.length === 0 && e.bufferedRequest === null && !e.finished && !e.writing;
  }
  s(Cb, "needFinish");
  function t1(e, t) {
    e._final(function(r) {
      t.pendingcb--, r && e.emit("error", r), t.prefinished = !0, e.emit("prefinish"), On(e, t);
    });
  }
  s(t1, "callFinal");
  function r1(e, t) {
    !t.prefinished && !t.finalCalled && (typeof e._final == "function" ? (t.pendingcb++, t.finalCalled = !0, _r.nextTick(t1, e, t)) : (t.prefinished =
    !0, e.emit("prefinish")));
  }
  s(r1, "prefinish");
  function On(e, t) {
    var r = Cb(t);
    return r && (r1(e, t), t.pendingcb === 0 && (t.finished = !0, e.emit("finish"))), r;
  }
  s(On, "finishMaybe");
  function i1(e, t, r) {
    t.ending = !0, On(e, t), r && (t.finished ? _r.nextTick(r) : e.once("finish", r)), t.ended = !0, e.writable = !1;
  }
  s(i1, "endWritable");
  function n1(e, t, r) {
    var i = e.entry;
    for (e.entry = null; i; ) {
      var n = i.callback;
      t.pendingcb--, n(r), i = i.next;
    }
    t.corkedRequestsFree.next = e;
  }
  s(n1, "onCorkedFinish");
  Object.defineProperty(xe.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._writableState && (this._writableState.destroyed = e);
    }, "set")
  });
  xe.prototype.destroy = wb.destroy;
  xe.prototype._undestroy = wb.undestroy;
  xe.prototype._destroy = function(e, t) {
    this.end(), t(e);
  };
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/_stream_duplex.js
var wr = b((Ej, Ab) => {
  "use strict";
  var Fb = Ve(), s1 = Object.keys || function(e) {
    var t = [];
    for (var r in e)
      t.push(r);
    return t;
  };
  Ab.exports = qt;
  var Sb = Object.create(Me());
  Sb.inherits = oe();
  var Tb = _c(), vc = yc();
  Sb.inherits(qt, Tb);
  for (bc = s1(vc.prototype), Po = 0; Po < bc.length; Po++)
    Io = bc[Po], qt.prototype[Io] || (qt.prototype[Io] = vc.prototype[Io]);
  var bc, Io, Po;
  function qt(e) {
    if (!(this instanceof qt)) return new qt(e);
    Tb.call(this, e), vc.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.
    allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", o1);
  }
  s(qt, "Duplex");
  Object.defineProperty(qt.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  function o1() {
    this.allowHalfOpen || this._writableState.ended || Fb.nextTick(a1, this);
  }
  s(o1, "onend");
  function a1(e) {
    e.end();
  }
  s(a1, "onEndNT");
  Object.defineProperty(qt.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = e, this._writableState.destroyed =
      e);
    }, "set")
  });
  qt.prototype._destroy = function(e, t) {
    this.push(null), this.end(), Fb.nextTick(t, e);
  };
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/_stream_readable.js
var _c = b((Fj, Ub) => {
  "use strict";
  var Ci = Ve();
  Ub.exports = fe;
  var u1 = db(), Pn;
  fe.ReadableState = Mb;
  var xj = require("events").EventEmitter, Bb = /* @__PURE__ */ s(function(e, t) {
    return e.listeners(t).length;
  }, "EElistenerCount"), Fc = hc(), In = Ao().Buffer, l1 = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ?
  self : {}).Uint8Array || function() {
  };
  function c1(e) {
    return In.from(e);
  }
  s(c1, "_uint8ArrayToBuffer");
  function d1(e) {
    return In.isBuffer(e) || e instanceof l1;
  }
  s(d1, "_isUint8Array");
  var Pb = Object.create(Me());
  Pb.inherits = oe();
  var wc = require("util"), ee = void 0;
  wc && wc.debuglog ? ee = wc.debuglog("stream") : ee = /* @__PURE__ */ s(function() {
  }, "debug");
  var f1 = mb(), Ib = mc(), Ei;
  Pb.inherits(fe, Fc);
  var Ec = ["error", "close", "destroy", "pause", "resume"];
  function h1(e, t, r) {
    if (typeof e.prependListener == "function") return e.prependListener(t, r);
    !e._events || !e._events[t] ? e.on(t, r) : u1(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]];
  }
  s(h1, "prependListener");
  function Mb(e, t) {
    Pn = Pn || wr(), e = e || {};
    var r = t instanceof Pn;
    this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.readableObjectMode);
    var i = e.highWaterMark, n = e.readableHighWaterMark, o = this.objectMode ? 16 : 16 * 1024;
    i || i === 0 ? this.highWaterMark = i : r && (n || n === 0) ? this.highWaterMark = n : this.highWaterMark = o, this.highWaterMark = Math.
    floor(this.highWaterMark), this.buffer = new f1(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended =
    !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening =
    !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore =
    !1, this.decoder = null, this.encoding = null, e.encoding && (Ei || (Ei = require("string_decoder/").StringDecoder), this.decoder = new Ei(
    e.encoding), this.encoding = e.encoding);
  }
  s(Mb, "ReadableState");
  function fe(e) {
    if (Pn = Pn || wr(), !(this instanceof fe)) return new fe(e);
    this._readableState = new Mb(e, this), this.readable = !0, e && (typeof e.read == "function" && (this._read = e.read), typeof e.destroy ==
    "function" && (this._destroy = e.destroy)), Fc.call(this);
  }
  s(fe, "Readable");
  Object.defineProperty(fe.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._readableState && (this._readableState.destroyed = e);
    }, "set")
  });
  fe.prototype.destroy = Ib.destroy;
  fe.prototype._undestroy = Ib.undestroy;
  fe.prototype._destroy = function(e, t) {
    this.push(null), t(e);
  };
  fe.prototype.push = function(e, t) {
    var r = this._readableState, i;
    return r.objectMode ? i = !0 : typeof e == "string" && (t = t || r.defaultEncoding, t !== r.encoding && (e = In.from(e, t), t = ""), i =
    !0), jb(this, e, t, !1, i);
  };
  fe.prototype.unshift = function(e) {
    return jb(this, e, null, !0, !1);
  };
  function jb(e, t, r, i, n) {
    var o = e._readableState;
    if (t === null)
      o.reading = !1, g1(e, o);
    else {
      var a;
      n || (a = p1(o, t)), a ? e.emit("error", a) : o.objectMode || t && t.length > 0 ? (typeof t != "string" && !o.objectMode && Object.getPrototypeOf(
      t) !== In.prototype && (t = c1(t)), i ? o.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : Cc(e, o, t, !0) :
      o.ended ? e.emit("error", new Error("stream.push() after EOF")) : (o.reading = !1, o.decoder && !r ? (t = o.decoder.write(t), o.objectMode ||
      t.length !== 0 ? Cc(e, o, t, !1) : qb(e, o)) : Cc(e, o, t, !1))) : i || (o.reading = !1);
    }
    return D1(o);
  }
  s(jb, "readableAddChunk");
  function Cc(e, t, r, i) {
    t.flowing && t.length === 0 && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(
    r) : t.buffer.push(r), t.needReadable && Mo(e)), qb(e, t);
  }
  s(Cc, "addChunk");
  function p1(e, t) {
    var r;
    return !d1(t) && typeof t != "string" && t !== void 0 && !e.objectMode && (r = new TypeError("Invalid non-string/buffer chunk")), r;
  }
  s(p1, "chunkInvalid");
  function D1(e) {
    return !e.ended && (e.needReadable || e.length < e.highWaterMark || e.length === 0);
  }
  s(D1, "needMoreData");
  fe.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  };
  fe.prototype.setEncoding = function(e) {
    return Ei || (Ei = require("string_decoder/").StringDecoder), this._readableState.decoder = new Ei(e), this._readableState.encoding = e,
    this;
  };
  var Rb = 8388608;
  function m1(e) {
    return e >= Rb ? e = Rb : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
  }
  s(m1, "computeNewHighWaterMark");
  function kb(e, t) {
    return e <= 0 || t.length === 0 && t.ended ? 0 : t.objectMode ? 1 : e !== e ? t.flowing && t.length ? t.buffer.head.data.length : t.length :
    (e > t.highWaterMark && (t.highWaterMark = m1(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
  }
  s(kb, "howMuchToRead");
  fe.prototype.read = function(e) {
    ee("read", e), e = parseInt(e, 10);
    var t = this._readableState, r = e;
    if (e !== 0 && (t.emittedReadable = !1), e === 0 && t.needReadable && (t.length >= t.highWaterMark || t.ended))
      return ee("read: emitReadable", t.length, t.ended), t.length === 0 && t.ended ? xc(this) : Mo(this), null;
    if (e = kb(e, t), e === 0 && t.ended)
      return t.length === 0 && xc(this), null;
    var i = t.needReadable;
    ee("need readable", i), (t.length === 0 || t.length - e < t.highWaterMark) && (i = !0, ee("length less than watermark", i)), t.ended || t.
    reading ? (i = !1, ee("reading or ended", i)) : i && (ee("do read"), t.reading = !0, t.sync = !0, t.length === 0 && (t.needReadable = !0),
    this._read(t.highWaterMark), t.sync = !1, t.reading || (e = kb(r, t)));
    var n;
    return e > 0 ? n = Lb(e, t) : n = null, n === null ? (t.needReadable = !0, e = 0) : t.length -= e, t.length === 0 && (t.ended || (t.needReadable =
    !0), r !== e && t.ended && xc(this)), n !== null && this.emit("data", n), n;
  };
  function g1(e, t) {
    if (!t.ended) {
      if (t.decoder) {
        var r = t.decoder.end();
        r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
      }
      t.ended = !0, Mo(e);
    }
  }
  s(g1, "onEofChunk");
  function Mo(e) {
    var t = e._readableState;
    t.needReadable = !1, t.emittedReadable || (ee("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? Ci.nextTick(Ob, e) : Ob(e));
  }
  s(Mo, "emitReadable");
  function Ob(e) {
    ee("emit readable"), e.emit("readable"), Sc(e);
  }
  s(Ob, "emitReadable_");
  function qb(e, t) {
    t.readingMore || (t.readingMore = !0, Ci.nextTick(y1, e, t));
  }
  s(qb, "maybeReadMore");
  function y1(e, t) {
    for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (ee("maybeReadMore read 0"), e.read(0), r !==
    t.length); )
      r = t.length;
    t.readingMore = !1;
  }
  s(y1, "maybeReadMore_");
  fe.prototype._read = function(e) {
    this.emit("error", new Error("_read() is not implemented"));
  };
  fe.prototype.pipe = function(e, t) {
    var r = this, i = this._readableState;
    switch (i.pipesCount) {
      case 0:
        i.pipes = e;
        break;
      case 1:
        i.pipes = [i.pipes, e];
        break;
      default:
        i.pipes.push(e);
        break;
    }
    i.pipesCount += 1, ee("pipe count=%d opts=%j", i.pipesCount, t);
    var n = (!t || t.end !== !1) && e !== process.stdout && e !== process.stderr, o = n ? u : _;
    i.endEmitted ? Ci.nextTick(o) : r.once("end", o), e.on("unpipe", a);
    function a(C, x) {
      ee("onunpipe"), C === r && x && x.hasUnpiped === !1 && (x.hasUnpiped = !0, d());
    }
    s(a, "onunpipe");
    function u() {
      ee("onend"), e.end();
    }
    s(u, "onend");
    var l = b1(r);
    e.on("drain", l);
    var c = !1;
    function d() {
      ee("cleanup"), e.removeListener("close", g), e.removeListener("finish", E), e.removeListener("drain", l), e.removeListener("error", f),
      e.removeListener("unpipe", a), r.removeListener("end", u), r.removeListener("end", _), r.removeListener("data", h), c = !0, i.awaitDrain &&
      (!e._writableState || e._writableState.needDrain) && l();
    }
    s(d, "cleanup");
    var p = !1;
    r.on("data", h);
    function h(C) {
      ee("ondata"), p = !1;
      var x = e.write(C);
      x === !1 && !p && ((i.pipesCount === 1 && i.pipes === e || i.pipesCount > 1 && Nb(i.pipes, e) !== -1) && !c && (ee("false write respon\
se, pause", i.awaitDrain), i.awaitDrain++, p = !0), r.pause());
    }
    s(h, "ondata");
    function f(C) {
      ee("onerror", C), _(), e.removeListener("error", f), Bb(e, "error") === 0 && e.emit("error", C);
    }
    s(f, "onerror"), h1(e, "error", f);
    function g() {
      e.removeListener("finish", E), _();
    }
    s(g, "onclose"), e.once("close", g);
    function E() {
      ee("onfinish"), e.removeListener("close", g), _();
    }
    s(E, "onfinish"), e.once("finish", E);
    function _() {
      ee("unpipe"), r.unpipe(e);
    }
    return s(_, "unpipe"), e.emit("pipe", r), i.flowing || (ee("pipe resume"), r.resume()), e;
  };
  function b1(e) {
    return function() {
      var t = e._readableState;
      ee("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, t.awaitDrain === 0 && Bb(e, "data") && (t.flowing = !0, Sc(e));
    };
  }
  s(b1, "pipeOnDrain");
  fe.prototype.unpipe = function(e) {
    var t = this._readableState, r = { hasUnpiped: !1 };
    if (t.pipesCount === 0) return this;
    if (t.pipesCount === 1)
      return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r),
      this);
    if (!e) {
      var i = t.pipes, n = t.pipesCount;
      t.pipes = null, t.pipesCount = 0, t.flowing = !1;
      for (var o = 0; o < n; o++)
        i[o].emit("unpipe", this, { hasUnpiped: !1 });
      return this;
    }
    var a = Nb(t.pipes, e);
    return a === -1 ? this : (t.pipes.splice(a, 1), t.pipesCount -= 1, t.pipesCount === 1 && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r),
    this);
  };
  fe.prototype.on = function(e, t) {
    var r = Fc.prototype.on.call(this, e, t);
    if (e === "data")
      this._readableState.flowing !== !1 && this.resume();
    else if (e === "readable") {
      var i = this._readableState;
      !i.endEmitted && !i.readableListening && (i.readableListening = i.needReadable = !0, i.emittedReadable = !1, i.reading ? i.length && Mo(
      this) : Ci.nextTick(v1, this));
    }
    return r;
  };
  fe.prototype.addListener = fe.prototype.on;
  function v1(e) {
    ee("readable nexttick read 0"), e.read(0);
  }
  s(v1, "nReadingNextTick");
  fe.prototype.resume = function() {
    var e = this._readableState;
    return e.flowing || (ee("resume"), e.flowing = !0, _1(this, e)), this;
  };
  function _1(e, t) {
    t.resumeScheduled || (t.resumeScheduled = !0, Ci.nextTick(w1, e, t));
  }
  s(_1, "resume");
  function w1(e, t) {
    t.reading || (ee("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), Sc(e), t.flowing && !t.reading &&
    e.read(0);
  }
  s(w1, "resume_");
  fe.prototype.pause = function() {
    return ee("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (ee("pause"), this._readableState.
    flowing = !1, this.emit("pause")), this;
  };
  function Sc(e) {
    var t = e._readableState;
    for (ee("flow", t.flowing); t.flowing && e.read() !== null; )
      ;
  }
  s(Sc, "flow");
  fe.prototype.wrap = function(e) {
    var t = this, r = this._readableState, i = !1;
    e.on("end", function() {
      if (ee("wrapped end"), r.decoder && !r.ended) {
        var a = r.decoder.end();
        a && a.length && t.push(a);
      }
      t.push(null);
    }), e.on("data", function(a) {
      if (ee("wrapped data"), r.decoder && (a = r.decoder.write(a)), !(r.objectMode && a == null) && !(!r.objectMode && (!a || !a.length))) {
        var u = t.push(a);
        u || (i = !0, e.pause());
      }
    });
    for (var n in e)
      this[n] === void 0 && typeof e[n] == "function" && (this[n] = /* @__PURE__ */ function(a) {
        return function() {
          return e[a].apply(e, arguments);
        };
      }(n));
    for (var o = 0; o < Ec.length; o++)
      e.on(Ec[o], this.emit.bind(this, Ec[o]));
    return this._read = function(a) {
      ee("wrapped _read", a), i && (i = !1, e.resume());
    }, this;
  };
  Object.defineProperty(fe.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._readableState.highWaterMark;
    }, "get")
  });
  fe._fromList = Lb;
  function Lb(e, t) {
    if (t.length === 0) return null;
    var r;
    return t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (t.decoder ? r = t.buffer.join("") : t.buffer.length === 1 ? r = t.buffer.
    head.data : r = t.buffer.concat(t.length), t.buffer.clear()) : r = E1(e, t.buffer, t.decoder), r;
  }
  s(Lb, "fromList");
  function E1(e, t, r) {
    var i;
    return e < t.head.data.length ? (i = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : e === t.head.data.length ? i = t.shift() :
    i = r ? C1(e, t) : x1(e, t), i;
  }
  s(E1, "fromListPartial");
  function C1(e, t) {
    var r = t.head, i = 1, n = r.data;
    for (e -= n.length; r = r.next; ) {
      var o = r.data, a = e > o.length ? o.length : e;
      if (a === o.length ? n += o : n += o.slice(0, e), e -= a, e === 0) {
        a === o.length ? (++i, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r, r.data = o.slice(a));
        break;
      }
      ++i;
    }
    return t.length -= i, n;
  }
  s(C1, "copyFromBufferString");
  function x1(e, t) {
    var r = In.allocUnsafe(e), i = t.head, n = 1;
    for (i.data.copy(r), e -= i.data.length; i = i.next; ) {
      var o = i.data, a = e > o.length ? o.length : e;
      if (o.copy(r, r.length - e, 0, a), e -= a, e === 0) {
        a === o.length ? (++n, i.next ? t.head = i.next : t.head = t.tail = null) : (t.head = i, i.data = o.slice(a));
        break;
      }
      ++n;
    }
    return t.length -= n, r;
  }
  s(x1, "copyFromBuffer");
  function xc(e) {
    var t = e._readableState;
    if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
    t.endEmitted || (t.ended = !0, Ci.nextTick(F1, t, e));
  }
  s(xc, "endReadable");
  function F1(e, t) {
    !e.endEmitted && e.length === 0 && (e.endEmitted = !0, t.readable = !1, t.emit("end"));
  }
  s(F1, "endReadableNT");
  function Nb(e, t) {
    for (var r = 0, i = e.length; r < i; r++)
      if (e[r] === t) return r;
    return -1;
  }
  s(Nb, "indexOf");
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/_stream_transform.js
var Tc = b((Tj, Hb) => {
  "use strict";
  Hb.exports = Lt;
  var jo = wr(), Wb = Object.create(Me());
  Wb.inherits = oe();
  Wb.inherits(Lt, jo);
  function S1(e, t) {
    var r = this._transformState;
    r.transforming = !1;
    var i = r.writecb;
    if (!i)
      return this.emit("error", new Error("write callback called multiple times"));
    r.writechunk = null, r.writecb = null, t != null && this.push(t), i(e);
    var n = this._readableState;
    n.reading = !1, (n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
  }
  s(S1, "afterTransform");
  function Lt(e) {
    if (!(this instanceof Lt)) return new Lt(e);
    jo.call(this, e), this._transformState = {
      afterTransform: S1.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && (typeof e.transform == "function" && (this._transform = e.
    transform), typeof e.flush == "function" && (this._flush = e.flush)), this.on("prefinish", T1);
  }
  s(Lt, "Transform");
  function T1() {
    var e = this;
    typeof this._flush == "function" ? this._flush(function(t, r) {
      $b(e, t, r);
    }) : $b(this, null, null);
  }
  s(T1, "prefinish");
  Lt.prototype.push = function(e, t) {
    return this._transformState.needTransform = !1, jo.prototype.push.call(this, e, t);
  };
  Lt.prototype._transform = function(e, t, r) {
    throw new Error("_transform() is not implemented");
  };
  Lt.prototype._write = function(e, t, r) {
    var i = this._transformState;
    if (i.writecb = r, i.writechunk = e, i.writeencoding = t, !i.transforming) {
      var n = this._readableState;
      (i.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
    }
  };
  Lt.prototype._read = function(e) {
    var t = this._transformState;
    t.writechunk !== null && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) :
    t.needTransform = !0;
  };
  Lt.prototype._destroy = function(e, t) {
    var r = this;
    jo.prototype._destroy.call(this, e, function(i) {
      t(i), r.emit("close");
    });
  };
  function $b(e, t, r) {
    if (t) return e.emit("error", t);
    if (r != null && e.push(r), e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
    if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
    return e.push(null);
  }
  s($b, "done");
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/_stream_passthrough.js
var Gb = b((Rj, zb) => {
  "use strict";
  zb.exports = Mn;
  var Vb = Tc(), Zb = Object.create(Me());
  Zb.inherits = oe();
  Zb.inherits(Mn, Vb);
  function Mn(e) {
    if (!(this instanceof Mn)) return new Mn(e);
    Vb.call(this, e);
  }
  s(Mn, "PassThrough");
  Mn.prototype._transform = function(e, t, r) {
    r(null, e);
  };
});

// ../node_modules/pumpify/node_modules/readable-stream/readable.js
var Kb = b((Oe, qo) => {
  var yt = require("stream");
  process.env.READABLE_STREAM === "disable" && yt ? (qo.exports = yt, Oe = qo.exports = yt.Readable, Oe.Readable = yt.Readable, Oe.Writable =
  yt.Writable, Oe.Duplex = yt.Duplex, Oe.Transform = yt.Transform, Oe.PassThrough = yt.PassThrough, Oe.Stream = yt) : (Oe = qo.exports = _c(),
  Oe.Stream = yt || Oe, Oe.Readable = Oe, Oe.Writable = yc(), Oe.Duplex = wr(), Oe.Transform = Tc(), Oe.PassThrough = Gb());
});

// ../node_modules/pumpify/node_modules/duplexify/index.js
var e0 = b((Oj, Qb) => {
  var Lo = Kb(), Yb = ti(), A1 = oe(), R1 = Vl(), Jb = Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from([0]) : new Buffer([0]), Ac = /* @__PURE__ */ s(
  function(e, t) {
    e._corked ? e.once("uncork", t) : t();
  }, "onuncork"), k1 = /* @__PURE__ */ s(function(e, t) {
    e._autoDestroy && e.destroy(t);
  }, "autoDestroy"), Xb = /* @__PURE__ */ s(function(e, t) {
    return function(r) {
      r ? k1(e, r.message === "premature close" ? null : r) : t && !e._ended && e.end();
    };
  }, "destroyer"), O1 = /* @__PURE__ */ s(function(e, t) {
    if (!e || e._writableState && e._writableState.finished) return t();
    if (e._writableState) return e.end(t);
    e.end(), t();
  }, "end"), B1 = /* @__PURE__ */ s(function(e) {
    return new Lo.Readable({ objectMode: !0, highWaterMark: 16 }).wrap(e);
  }, "toStreams2"), Be = /* @__PURE__ */ s(function(e, t, r) {
    if (!(this instanceof Be)) return new Be(e, t, r);
    Lo.Duplex.call(this, r), this._writable = null, this._readable = null, this._readable2 = null, this._autoDestroy = !r || r.autoDestroy !==
    !1, this._forwardDestroy = !r || r.destroy !== !1, this._forwardEnd = !r || r.end !== !1, this._corked = 1, this._ondrain = null, this._drained =
    !1, this._forwarding = !1, this._unwrite = null, this._unread = null, this._ended = !1, this.destroyed = !1, e && this.setWritable(e), t &&
    this.setReadable(t);
  }, "Duplexify");
  A1(Be, Lo.Duplex);
  Be.obj = function(e, t, r) {
    return r || (r = {}), r.objectMode = !0, r.highWaterMark = 16, new Be(e, t, r);
  };
  Be.prototype.cork = function() {
    ++this._corked === 1 && this.emit("cork");
  };
  Be.prototype.uncork = function() {
    this._corked && --this._corked === 0 && this.emit("uncork");
  };
  Be.prototype.setWritable = function(e) {
    if (this._unwrite && this._unwrite(), this.destroyed) {
      e && e.destroy && e.destroy();
      return;
    }
    if (e === null || e === !1) {
      this.end();
      return;
    }
    var t = this, r = Yb(e, { writable: !0, readable: !1 }, Xb(this, this._forwardEnd)), i = /* @__PURE__ */ s(function() {
      var o = t._ondrain;
      t._ondrain = null, o && o();
    }, "ondrain"), n = /* @__PURE__ */ s(function() {
      t._writable.removeListener("drain", i), r();
    }, "clear");
    this._unwrite && process.nextTick(i), this._writable = e, this._writable.on("drain", i), this._unwrite = n, this.uncork();
  };
  Be.prototype.setReadable = function(e) {
    if (this._unread && this._unread(), this.destroyed) {
      e && e.destroy && e.destroy();
      return;
    }
    if (e === null || e === !1) {
      this.push(null), this.resume();
      return;
    }
    var t = this, r = Yb(e, { writable: !1, readable: !0 }, Xb(this)), i = /* @__PURE__ */ s(function() {
      t._forward();
    }, "onreadable"), n = /* @__PURE__ */ s(function() {
      t.push(null);
    }, "onend"), o = /* @__PURE__ */ s(function() {
      t._readable2.removeListener("readable", i), t._readable2.removeListener("end", n), r();
    }, "clear");
    this._drained = !0, this._readable = e, this._readable2 = e._readableState ? e : B1(e), this._readable2.on("readable", i), this._readable2.
    on("end", n), this._unread = o, this._forward();
  };
  Be.prototype._read = function() {
    this._drained = !0, this._forward();
  };
  Be.prototype._forward = function() {
    if (!(this._forwarding || !this._readable2 || !this._drained)) {
      this._forwarding = !0;
      for (var e; this._drained && (e = R1(this._readable2)) !== null; )
        this.destroyed || (this._drained = this.push(e));
      this._forwarding = !1;
    }
  };
  Be.prototype.destroy = function(e) {
    if (!this.destroyed) {
      this.destroyed = !0;
      var t = this;
      process.nextTick(function() {
        t._destroy(e);
      });
    }
  };
  Be.prototype._destroy = function(e) {
    if (e) {
      var t = this._ondrain;
      this._ondrain = null, t ? t(e) : this.emit("error", e);
    }
    this._forwardDestroy && (this._readable && this._readable.destroy && this._readable.destroy(), this._writable && this._writable.destroy &&
    this._writable.destroy()), this.emit("close");
  };
  Be.prototype._write = function(e, t, r) {
    if (this.destroyed) return r();
    if (this._corked) return Ac(this, this._write.bind(this, e, t, r));
    if (e === Jb) return this._finish(r);
    if (!this._writable) return r();
    this._writable.write(e) === !1 ? this._ondrain = r : r();
  };
  Be.prototype._finish = function(e) {
    var t = this;
    this.emit("preend"), Ac(this, function() {
      O1(t._forwardEnd && t._writable, function() {
        t._writableState.prefinished === !1 && (t._writableState.prefinished = !0), t.emit("prefinish"), Ac(t, e);
      });
    });
  };
  Be.prototype.end = function(e, t, r) {
    return typeof e == "function" ? this.end(null, null, e) : typeof t == "function" ? this.end(e, null, t) : (this._ended = !0, e && this.write(
    e), this._writableState.ending || this.write(Jb), Lo.Writable.prototype.end.call(this, r));
  };
  Qb.exports = Be;
});

// ../node_modules/pumpify/index.js
var i0 = b((Pj, No) => {
  var P1 = lb(), I1 = oe(), t0 = e0(), r0 = /* @__PURE__ */ s(function(e) {
    return e.length ? Array.isArray(e[0]) ? e[0] : Array.prototype.slice.call(e) : [];
  }, "toArray"), Rc = /* @__PURE__ */ s(function(e) {
    var t = /* @__PURE__ */ s(function() {
      var r = r0(arguments);
      if (!(this instanceof t)) return new t(r);
      t0.call(this, null, null, e), r.length && this.setPipeline(r);
    }, "Pumpify");
    return I1(t, t0), t.prototype.setPipeline = function() {
      var r = r0(arguments), i = this, n = !1, o = r[0], a = r[r.length - 1];
      a = a.readable ? a : null, o = o.writable ? o : null;
      var u = /* @__PURE__ */ s(function() {
        r[0].emit("error", new Error("stream was destroyed"));
      }, "onclose");
      if (this.on("close", u), this.on("prefinish", function() {
        n || i.cork();
      }), P1(r, function(l) {
        if (i.removeListener("close", u), l) return i.destroy(l.message === "premature close" ? null : l);
        n = !0, i._autoDestroy === !1 && (i._autoDestroy = !0), i.uncork();
      }), this.destroyed) return u();
      this.setWritable(o), this.setReadable(a);
    }, t;
  }, "define");
  No.exports = Rc({ autoDestroy: !1, destroy: !1 });
  No.exports.obj = Rc({ autoDestroy: !1, destroy: !1, objectMode: !0, highWaterMark: 16 });
  No.exports.ctor = Rc;
});

// ../node_modules/is-gzip/index.js
var s0 = b((Mj, n0) => {
  "use strict";
  n0.exports = function(e) {
    return !e || e.length < 3 ? !1 : e[0] === 31 && e[1] === 139 && e[2] === 8;
  };
});

// ../node_modules/is-deflate/index.js
var a0 = b((jj, o0) => {
  "use strict";
  o0.exports = function(e) {
    return !e || e.length < 2 ? !1 : e[0] === 120 && (e[1] === 1 || e[1] === 156 || e[1] === 218);
  };
});

// ../node_modules/gunzip-maybe/index.js
var d0 = b((qj, c0) => {
  var u0 = require("zlib"), M1 = ob(), j1 = cc(), l0 = i0(), q1 = s0(), L1 = a0(), N1 = /* @__PURE__ */ s(function(e) {
    return q1(e) ? 1 : L1(e) ? 2 : 0;
  }, "isCompressed"), kc = /* @__PURE__ */ s(function(e) {
    return e === void 0 && (e = 3), M1({ newline: !1, maxBuffer: 10 }, function(t, r) {
      if (e < 0) return r(new Error("Maximum recursion reached"));
      switch (N1(t)) {
        case 1:
          r(null, l0(u0.createGunzip(), kc(e - 1)));
          break;
        case 2:
          r(null, l0(u0.createInflate(), kc(e - 1)));
          break;
        default:
          r(null, j1());
      }
    });
  }, "gunzip");
  c0.exports = kc;
});

// ../node_modules/@ndelangen/get-tarball/dist/index.js
var ov = b(($j, sv) => {
  "use strict";
  var U1 = Object.create, Jo = Object.defineProperty, $1 = Object.getOwnPropertyDescriptor, M0 = Object.getOwnPropertyNames, W1 = Object.getPrototypeOf,
  H1 = Object.prototype.hasOwnProperty, Y = /* @__PURE__ */ s((e, t) => /* @__PURE__ */ s(function() {
    return t || (0, e[M0(e)[0]])((t = { exports: {} }).exports, t), t.exports;
  }, "__require"), "__commonJS"), V1 = /* @__PURE__ */ s((e, t) => {
    for (var r in t)
      Jo(e, r, { get: t[r], enumerable: !0 });
  }, "__export"), j0 = /* @__PURE__ */ s((e, t, r, i) => {
    if (t && typeof t == "object" || typeof t == "function")
      for (let n of M0(t))
        !H1.call(e, n) && n !== r && Jo(e, n, { get: /* @__PURE__ */ s(() => t[n], "get"), enumerable: !(i = $1(t, n)) || i.enumerable });
    return e;
  }, "__copyProps"), Fe = /* @__PURE__ */ s((e, t, r) => (r = e != null ? U1(W1(e)) : {}, j0(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    t || !e || !e.__esModule ? Jo(r, "default", { value: e, enumerable: !0 }) : r,
    e
  )), "__toESM"), Z1 = /* @__PURE__ */ s((e) => j0(Jo({}, "__esModule", { value: !0 }), e), "__toCommonJS"), z1 = Y({
    "node_modules/.pnpm/defer-to-connect@2.0.1/node_modules/defer-to-connect/dist/source/index.js"(e, t) {
      "use strict";
      Object.defineProperty(e, "__esModule", { value: !0 });
      function r(n) {
        return n.encrypted;
      }
      s(r, "isTLSSocket");
      var i = /* @__PURE__ */ s((n, o) => {
        let a;
        typeof o == "function" ? a = { connect: o } : a = o;
        let u = typeof a.connect == "function", l = typeof a.secureConnect == "function", c = typeof a.close == "function", d = /* @__PURE__ */ s(
        () => {
          u && a.connect(), r(n) && l && (n.authorized ? a.secureConnect() : n.authorizationError || n.once("secureConnect", a.secureConnect)),
          c && n.once("close", a.close);
        }, "onConnect");
        n.writable && !n.connecting ? d() : n.connecting ? n.once("connect", d) : n.destroyed && c && a.close(n._hadError);
      }, "deferToConnect2");
      e.default = i, t.exports = i, t.exports.default = i;
    }
  }), G1 = Y({
    "node_modules/.pnpm/get-stream@6.0.1/node_modules/get-stream/buffer-stream.js"(e, t) {
      "use strict";
      var { PassThrough: r } = require("stream");
      t.exports = (i) => {
        i = { ...i };
        let { array: n } = i, { encoding: o } = i, a = o === "buffer", u = !1;
        n ? u = !(o || a) : o = o || "utf8", a && (o = null);
        let l = new r({ objectMode: u });
        o && l.setEncoding(o);
        let c = 0, d = [];
        return l.on("data", (p) => {
          d.push(p), u ? c = d.length : c += p.length;
        }), l.getBufferedValue = () => n ? d : a ? Buffer.concat(d, c) : d.join(""), l.getBufferedLength = () => c, l;
      };
    }
  }), q0 = Y({
    "node_modules/.pnpm/get-stream@6.0.1/node_modules/get-stream/index.js"(e, t) {
      "use strict";
      var { constants: r } = require("buffer"), i = require("stream"), { promisify: n } = require("util"), o = G1(), a = n(i.pipeline), u = class extends Error {
        static {
          s(this, "MaxBufferError");
        }
        constructor() {
          super("maxBuffer exceeded"), this.name = "MaxBufferError";
        }
      };
      async function l(c, d) {
        if (!c)
          throw new Error("Expected a stream");
        d = {
          maxBuffer: 1 / 0,
          ...d
        };
        let { maxBuffer: p } = d, h = o(d);
        return await new Promise((f, g) => {
          let E = /* @__PURE__ */ s((_) => {
            _ && h.getBufferedLength() <= r.MAX_LENGTH && (_.bufferedData = h.getBufferedValue()), g(_);
          }, "rejectPromise");
          (async () => {
            try {
              await a(c, h), f();
            } catch (_) {
              E(_);
            }
          })(), h.on("data", () => {
            h.getBufferedLength() > p && E(new u());
          });
        }), h.getBufferedValue();
      }
      s(l, "getStream2"), t.exports = l, t.exports.buffer = (c, d) => l(c, { ...d, encoding: "buffer" }), t.exports.array = (c, d) => l(c, {
      ...d, array: !0 }), t.exports.MaxBufferError = u;
    }
  }), K1 = Y({
    "node_modules/.pnpm/http-cache-semantics@4.1.1/node_modules/http-cache-semantics/index.js"(e, t) {
      "use strict";
      var r = /* @__PURE__ */ new Set([
        200,
        203,
        204,
        206,
        300,
        301,
        308,
        404,
        405,
        410,
        414,
        501
      ]), i = /* @__PURE__ */ new Set([
        200,
        203,
        204,
        300,
        301,
        302,
        303,
        307,
        308,
        404,
        405,
        410,
        414,
        501
      ]), n = /* @__PURE__ */ new Set([
        500,
        502,
        503,
        504
      ]), o = {
        date: !0,
        // included, because we add Age update Date
        connection: !0,
        "keep-alive": !0,
        "proxy-authenticate": !0,
        "proxy-authorization": !0,
        te: !0,
        trailer: !0,
        "transfer-encoding": !0,
        upgrade: !0
      }, a = {
        // Since the old body is reused, it doesn't make sense to change properties of the body
        "content-length": !0,
        "content-encoding": !0,
        "transfer-encoding": !0,
        "content-range": !0
      };
      function u(p) {
        let h = parseInt(p, 10);
        return isFinite(h) ? h : 0;
      }
      s(u, "toNumberOrZero");
      function l(p) {
        return p ? n.has(p.status) : !0;
      }
      s(l, "isErrorResponse");
      function c(p) {
        let h = {};
        if (!p)
          return h;
        let f = p.trim().split(/,/);
        for (let g of f) {
          let [E, _] = g.split(/=/, 2);
          h[E.trim()] = _ === void 0 ? !0 : _.trim().replace(/^"|"$/g, "");
        }
        return h;
      }
      s(c, "parseCacheControl");
      function d(p) {
        let h = [];
        for (let f in p) {
          let g = p[f];
          h.push(g === !0 ? f : f + "=" + g);
        }
        if (h.length)
          return h.join(", ");
      }
      s(d, "formatCacheControl"), t.exports = class {
        static {
          s(this, "CachePolicy");
        }
        constructor(h, f, {
          shared: g,
          cacheHeuristic: E,
          immutableMinTimeToLive: _,
          ignoreCargoCult: C,
          _fromObject: x
        } = {}) {
          if (x) {
            this._fromObject(x);
            return;
          }
          if (!f || !f.headers)
            throw Error("Response headers missing");
          this._assertRequestHasHeaders(h), this._responseTime = this.now(), this._isShared = g !== !1, this._cacheHeuristic = E !== void 0 ?
          E : 0.1, this._immutableMinTtl = _ !== void 0 ? _ : 24 * 3600 * 1e3, this._status = "status" in f ? f.status : 200, this._resHeaders =
          f.headers, this._rescc = c(f.headers["cache-control"]), this._method = "method" in h ? h.method : "GET", this._url = h.url, this._host =
          h.headers.host, this._noAuthorization = !h.headers.authorization, this._reqHeaders = f.headers.vary ? h.headers : null, this._reqcc =
          c(h.headers["cache-control"]), C && "pre-check" in this._rescc && "post-check" in this._rescc && (delete this._rescc["pre-check"],
          delete this._rescc["post-check"], delete this._rescc["no-cache"], delete this._rescc["no-store"], delete this._rescc["must-revalid\
ate"], this._resHeaders = Object.assign({}, this._resHeaders, {
            "cache-control": d(this._rescc)
          }), delete this._resHeaders.expires, delete this._resHeaders.pragma), f.headers["cache-control"] == null && /no-cache/.test(f.headers.
          pragma) && (this._rescc["no-cache"] = !0);
        }
        now() {
          return Date.now();
        }
        storable() {
          return !!(!this._reqcc["no-store"] && // A cache MUST NOT store a response to any request, unless:
          // The request method is understood by the cache and defined as being cacheable, and
          (this._method === "GET" || this._method === "HEAD" || this._method === "POST" && this._hasExplicitExpiration()) && // the response status code is understood by the cache, and
          i.has(this._status) && // the "no-store" cache directive does not appear in request or response header fields, and
          !this._rescc["no-store"] && // the "private" response directive does not appear in the response, if the cache is shared, and
          (!this._isShared || !this._rescc.private) && // the Authorization header field does not appear in the request, if the cache is shared,
          (!this._isShared || this._noAuthorization || this._allowsStoringAuthenticated()) && // the response either:
          // contains an Expires header field, or
          (this._resHeaders.expires || // contains a max-age response directive, or
          // contains a s-maxage response directive and the cache is shared, or
          // contains a public response directive.
          this._rescc["max-age"] || this._isShared && this._rescc["s-maxage"] || this._rescc.public || // has a status code that is defined as cacheable by default
          r.has(this._status)));
        }
        _hasExplicitExpiration() {
          return this._isShared && this._rescc["s-maxage"] || this._rescc["max-age"] || this._resHeaders.expires;
        }
        _assertRequestHasHeaders(h) {
          if (!h || !h.headers)
            throw Error("Request headers missing");
        }
        satisfiesWithoutRevalidation(h) {
          this._assertRequestHasHeaders(h);
          let f = c(h.headers["cache-control"]);
          return f["no-cache"] || /no-cache/.test(h.headers.pragma) || f["max-age"] && this.age() > f["max-age"] || f["min-fresh"] && this.timeToLive() <
          1e3 * f["min-fresh"] || this.stale() && !(f["max-stale"] && !this._rescc["must-revalidate"] && (f["max-stale"] === !0 || f["max-st\
ale"] > this.age() - this.maxAge())) ? !1 : this._requestMatches(h, !1);
        }
        _requestMatches(h, f) {
          return (!this._url || this._url === h.url) && this._host === h.headers.host && // the request method associated with the stored response allows it to be used for the presented request, and
          (!h.method || this._method === h.method || f && h.method === "HEAD") && // selecting header fields nominated by the stored response (if any) match those presented, and
          this._varyMatches(h);
        }
        _allowsStoringAuthenticated() {
          return this._rescc["must-revalidate"] || this._rescc.public || this._rescc["s-maxage"];
        }
        _varyMatches(h) {
          if (!this._resHeaders.vary)
            return !0;
          if (this._resHeaders.vary === "*")
            return !1;
          let f = this._resHeaders.vary.trim().toLowerCase().split(/\s*,\s*/);
          for (let g of f)
            if (h.headers[g] !== this._reqHeaders[g])
              return !1;
          return !0;
        }
        _copyWithoutHopByHopHeaders(h) {
          let f = {};
          for (let g in h)
            o[g] || (f[g] = h[g]);
          if (h.connection) {
            let g = h.connection.trim().split(/\s*,\s*/);
            for (let E of g)
              delete f[E];
          }
          if (f.warning) {
            let g = f.warning.split(/,/).filter((E) => !/^\s*1[0-9][0-9]/.test(E));
            g.length ? f.warning = g.join(",").trim() : delete f.warning;
          }
          return f;
        }
        responseHeaders() {
          let h = this._copyWithoutHopByHopHeaders(this._resHeaders), f = this.age();
          return f > 3600 * 24 && !this._hasExplicitExpiration() && this.maxAge() > 3600 * 24 && (h.warning = (h.warning ? `${h.warning}, ` :
          "") + '113 - "rfc7234 5.5.4"'), h.age = `${Math.round(f)}`, h.date = new Date(this.now()).toUTCString(), h;
        }
        /**
         * Value of the Date response header or current time if Date was invalid
         * @return timestamp
         */
        date() {
          let h = Date.parse(this._resHeaders.date);
          return isFinite(h) ? h : this._responseTime;
        }
        /**
         * Value of the Age header, in seconds, updated for the current time.
         * May be fractional.
         *
         * @return Number
         */
        age() {
          let h = this._ageValue(), f = (this.now() - this._responseTime) / 1e3;
          return h + f;
        }
        _ageValue() {
          return u(this._resHeaders.age);
        }
        /**
         * Value of applicable max-age (or heuristic equivalent) in seconds. This counts since response's `Date`.
         *
         * For an up-to-date value, see `timeToLive()`.
         *
         * @return Number
         */
        maxAge() {
          if (!this.storable() || this._rescc["no-cache"] || this._isShared && this._resHeaders["set-cookie"] && !this._rescc.public && !this.
          _rescc.immutable || this._resHeaders.vary === "*")
            return 0;
          if (this._isShared) {
            if (this._rescc["proxy-revalidate"])
              return 0;
            if (this._rescc["s-maxage"])
              return u(this._rescc["s-maxage"]);
          }
          if (this._rescc["max-age"])
            return u(this._rescc["max-age"]);
          let h = this._rescc.immutable ? this._immutableMinTtl : 0, f = this.date();
          if (this._resHeaders.expires) {
            let g = Date.parse(this._resHeaders.expires);
            return Number.isNaN(g) || g < f ? 0 : Math.max(h, (g - f) / 1e3);
          }
          if (this._resHeaders["last-modified"]) {
            let g = Date.parse(this._resHeaders["last-modified"]);
            if (isFinite(g) && f > g)
              return Math.max(
                h,
                (f - g) / 1e3 * this._cacheHeuristic
              );
          }
          return h;
        }
        timeToLive() {
          let h = this.maxAge() - this.age(), f = h + u(this._rescc["stale-if-error"]), g = h + u(this._rescc["stale-while-revalidate"]);
          return Math.max(0, h, f, g) * 1e3;
        }
        stale() {
          return this.maxAge() <= this.age();
        }
        _useStaleIfError() {
          return this.maxAge() + u(this._rescc["stale-if-error"]) > this.age();
        }
        useStaleWhileRevalidate() {
          return this.maxAge() + u(this._rescc["stale-while-revalidate"]) > this.age();
        }
        static fromObject(h) {
          return new this(void 0, void 0, { _fromObject: h });
        }
        _fromObject(h) {
          if (this._responseTime)
            throw Error("Reinitialized");
          if (!h || h.v !== 1)
            throw Error("Invalid serialization");
          this._responseTime = h.t, this._isShared = h.sh, this._cacheHeuristic = h.ch, this._immutableMinTtl = h.imm !== void 0 ? h.imm : 24 *
          3600 * 1e3, this._status = h.st, this._resHeaders = h.resh, this._rescc = h.rescc, this._method = h.m, this._url = h.u, this._host =
          h.h, this._noAuthorization = h.a, this._reqHeaders = h.reqh, this._reqcc = h.reqcc;
        }
        toObject() {
          return {
            v: 1,
            t: this._responseTime,
            sh: this._isShared,
            ch: this._cacheHeuristic,
            imm: this._immutableMinTtl,
            st: this._status,
            resh: this._resHeaders,
            rescc: this._rescc,
            m: this._method,
            u: this._url,
            h: this._host,
            a: this._noAuthorization,
            reqh: this._reqHeaders,
            reqcc: this._reqcc
          };
        }
        /**
         * Headers for sending to the origin server to revalidate stale response.
         * Allows server to return 304 to allow reuse of the previous response.
         *
         * Hop by hop headers are always stripped.
         * Revalidation headers may be added or removed, depending on request.
         */
        revalidationHeaders(h) {
          this._assertRequestHasHeaders(h);
          let f = this._copyWithoutHopByHopHeaders(h.headers);
          if (delete f["if-range"], !this._requestMatches(h, !0) || !this.storable())
            return delete f["if-none-match"], delete f["if-modified-since"], f;
          if (this._resHeaders.etag && (f["if-none-match"] = f["if-none-match"] ? `${f["if-none-match"]}, ${this._resHeaders.etag}` : this._resHeaders.
          etag), f["accept-ranges"] || f["if-match"] || f["if-unmodified-since"] || this._method && this._method != "GET") {
            if (delete f["if-modified-since"], f["if-none-match"]) {
              let E = f["if-none-match"].split(/,/).filter((_) => !/^\s*W\//.test(_));
              E.length ? f["if-none-match"] = E.join(",").trim() : delete f["if-none-match"];
            }
          } else this._resHeaders["last-modified"] && !f["if-modified-since"] && (f["if-modified-since"] = this._resHeaders["last-modified"]);
          return f;
        }
        /**
         * Creates new CachePolicy with information combined from the previews response,
         * and the new revalidation response.
         *
         * Returns {policy, modified} where modified is a boolean indicating
         * whether the response body has been modified, and old cached body can't be used.
         *
         * @return {Object} {policy: CachePolicy, modified: Boolean}
         */
        revalidatedPolicy(h, f) {
          if (this._assertRequestHasHeaders(h), this._useStaleIfError() && l(f))
            return {
              modified: !1,
              matches: !1,
              policy: this
            };
          if (!f || !f.headers)
            throw Error("Response headers missing");
          let g = !1;
          if (f.status !== void 0 && f.status != 304 ? g = !1 : f.headers.etag && !/^\s*W\//.test(f.headers.etag) ? g = this._resHeaders.etag &&
          this._resHeaders.etag.replace(/^\s*W\//, "") === f.headers.etag : this._resHeaders.etag && f.headers.etag ? g = this._resHeaders.etag.
          replace(/^\s*W\//, "") === f.headers.etag.replace(/^\s*W\//, "") : this._resHeaders["last-modified"] ? g = this._resHeaders["last-\
modified"] === f.headers["last-modified"] : !this._resHeaders.etag && !this._resHeaders["last-modified"] && !f.headers.etag && !f.headers["l\
ast-modified"] && (g = !0), !g)
            return {
              policy: new this.constructor(h, f),
              // Client receiving 304 without body, even if it's invalid/mismatched has no option
              // but to reuse a cached body. We don't have a good way to tell clients to do
              // error recovery in such case.
              modified: f.status != 304,
              matches: !1
            };
          let E = {};
          for (let C in this._resHeaders)
            E[C] = C in f.headers && !a[C] ? f.headers[C] : this._resHeaders[C];
          let _ = Object.assign({}, f, {
            status: this._status,
            method: this._method,
            headers: E
          });
          return {
            policy: new this.constructor(h, _, {
              shared: this._isShared,
              cacheHeuristic: this._cacheHeuristic,
              immutableMinTimeToLive: this._immutableMinTtl
            }),
            modified: !1,
            matches: !0
          };
        }
      };
    }
  }), Y1 = Y({
    "node_modules/.pnpm/json-buffer@3.0.1/node_modules/json-buffer/index.js"(e) {
      e.stringify = /* @__PURE__ */ s(function t(r) {
        if (typeof r > "u")
          return r;
        if (r && Buffer.isBuffer(r))
          return JSON.stringify(":base64:" + r.toString("base64"));
        if (r && r.toJSON && (r = r.toJSON()), r && typeof r == "object") {
          var i = "", n = Array.isArray(r);
          i = n ? "[" : "{";
          var o = !0;
          for (var a in r) {
            var u = typeof r[a] == "function" || !n && typeof r[a] > "u";
            Object.hasOwnProperty.call(r, a) && !u && (o || (i += ","), o = !1, n ? r[a] == null ? i += "null" : i += t(r[a]) : r[a] !== void 0 &&
            (i += t(a) + ":" + t(r[a])));
          }
          return i += n ? "]" : "}", i;
        } else return typeof r == "string" ? JSON.stringify(/^:/.test(r) ? ":" + r : r) : typeof r > "u" ? "null" : JSON.stringify(r);
      }, "stringify"), e.parse = function(t) {
        return JSON.parse(t, function(r, i) {
          return typeof i == "string" ? /^:base64:/.test(i) ? Buffer.from(i.substring(8), "base64") : /^:/.test(i) ? i.substring(1) : i : i;
        });
      };
    }
  }), J1 = Y({
    "node_modules/.pnpm/keyv@4.5.2/node_modules/keyv/src/index.js"(e, t) {
      "use strict";
      var r = require("events"), i = Y1(), n = /* @__PURE__ */ s((u) => {
        let l = {
          redis: "@keyv/redis",
          rediss: "@keyv/redis",
          mongodb: "@keyv/mongo",
          mongo: "@keyv/mongo",
          sqlite: "@keyv/sqlite",
          postgresql: "@keyv/postgres",
          postgres: "@keyv/postgres",
          mysql: "@keyv/mysql",
          etcd: "@keyv/etcd",
          offline: "@keyv/offline",
          tiered: "@keyv/tiered"
        };
        if (u.adapter || u.uri) {
          let c = u.adapter || /^[^:+]*/.exec(u.uri)[0];
          return new (require(l[c]))(u);
        }
        return /* @__PURE__ */ new Map();
      }, "loadStore"), o = [
        "sqlite",
        "postgres",
        "mysql",
        "mongo",
        "redis",
        "tiered"
      ], a = class extends r {
        static {
          s(this, "Keyv2");
        }
        constructor(u, { emitErrors: l = !0, ...c } = {}) {
          if (super(), this.opts = {
            namespace: "keyv",
            serialize: i.stringify,
            deserialize: i.parse,
            ...typeof u == "string" ? { uri: u } : u,
            ...c
          }, !this.opts.store) {
            let p = { ...this.opts };
            this.opts.store = n(p);
          }
          if (this.opts.compression) {
            let p = this.opts.compression;
            this.opts.serialize = p.serialize.bind(p), this.opts.deserialize = p.deserialize.bind(p);
          }
          typeof this.opts.store.on == "function" && l && this.opts.store.on("error", (p) => this.emit("error", p)), this.opts.store.namespace =
          this.opts.namespace;
          let d = /* @__PURE__ */ s((p) => async function* () {
            for await (let [h, f] of typeof p == "function" ? p(this.opts.store.namespace) : p) {
              let g = this.opts.deserialize(f);
              if (!(this.opts.store.namespace && !h.includes(this.opts.store.namespace))) {
                if (typeof g.expires == "number" && Date.now() > g.expires) {
                  this.delete(h);
                  continue;
                }
                yield [this._getKeyUnprefix(h), g.value];
              }
            }
          }, "generateIterator");
          typeof this.opts.store[Symbol.iterator] == "function" && this.opts.store instanceof Map ? this.iterator = d(this.opts.store) : typeof this.
          opts.store.iterator == "function" && this.opts.store.opts && this._checkIterableAdaptar() && (this.iterator = d(this.opts.store.iterator.
          bind(this.opts.store)));
        }
        _checkIterableAdaptar() {
          return o.includes(this.opts.store.opts.dialect) || o.findIndex((u) => this.opts.store.opts.url.includes(u)) >= 0;
        }
        _getKeyPrefix(u) {
          return `${this.opts.namespace}:${u}`;
        }
        _getKeyPrefixArray(u) {
          return u.map((l) => `${this.opts.namespace}:${l}`);
        }
        _getKeyUnprefix(u) {
          return u.split(":").splice(1).join(":");
        }
        get(u, l) {
          let { store: c } = this.opts, d = Array.isArray(u), p = d ? this._getKeyPrefixArray(u) : this._getKeyPrefix(u);
          if (d && c.getMany === void 0) {
            let h = [];
            for (let f of p)
              h.push(
                Promise.resolve().then(() => c.get(f)).then((g) => typeof g == "string" ? this.opts.deserialize(g) : this.opts.compression ?
                this.opts.deserialize(g) : g).then((g) => {
                  if (g != null)
                    return typeof g.expires == "number" && Date.now() > g.expires ? this.delete(f).then(() => {
                    }) : l && l.raw ? g : g.value;
                })
              );
            return Promise.allSettled(h).then((f) => {
              let g = [];
              for (let E of f)
                g.push(E.value);
              return g;
            });
          }
          return Promise.resolve().then(() => d ? c.getMany(p) : c.get(p)).then((h) => typeof h == "string" ? this.opts.deserialize(h) : this.
          opts.compression ? this.opts.deserialize(h) : h).then((h) => {
            if (h != null) {
              if (d) {
                let f = [];
                for (let g of h) {
                  if (typeof g == "string" && (g = this.opts.deserialize(g)), g == null) {
                    f.push(void 0);
                    continue;
                  }
                  typeof g.expires == "number" && Date.now() > g.expires ? (this.delete(u).then(() => {
                  }), f.push(void 0)) : f.push(l && l.raw ? g : g.value);
                }
                return f;
              }
              return typeof h.expires == "number" && Date.now() > h.expires ? this.delete(u).then(() => {
              }) : l && l.raw ? h : h.value;
            }
          });
        }
        set(u, l, c) {
          let d = this._getKeyPrefix(u);
          typeof c > "u" && (c = this.opts.ttl), c === 0 && (c = void 0);
          let { store: p } = this.opts;
          return Promise.resolve().then(() => {
            let h = typeof c == "number" ? Date.now() + c : null;
            return typeof l == "symbol" && this.emit("error", "symbol cannot be serialized"), l = { value: l, expires: h }, this.opts.serialize(
            l);
          }).then((h) => p.set(d, h, c)).then(() => !0);
        }
        delete(u) {
          let { store: l } = this.opts;
          if (Array.isArray(u)) {
            let d = this._getKeyPrefixArray(u);
            if (l.deleteMany === void 0) {
              let p = [];
              for (let h of d)
                p.push(l.delete(h));
              return Promise.allSettled(p).then((h) => h.every((f) => f.value === !0));
            }
            return Promise.resolve().then(() => l.deleteMany(d));
          }
          let c = this._getKeyPrefix(u);
          return Promise.resolve().then(() => l.delete(c));
        }
        clear() {
          let { store: u } = this.opts;
          return Promise.resolve().then(() => u.clear());
        }
        has(u) {
          let l = this._getKeyPrefix(u), { store: c } = this.opts;
          return Promise.resolve().then(async () => typeof c.has == "function" ? c.has(l) : await c.get(l) !== void 0);
        }
        disconnect() {
          let { store: u } = this.opts;
          if (typeof u.disconnect == "function")
            return u.disconnect();
        }
      };
      t.exports = a;
    }
  }), X1 = Y({
    "node_modules/.pnpm/mimic-response@3.1.0/node_modules/mimic-response/index.js"(e, t) {
      "use strict";
      var r = [
        "aborted",
        "complete",
        "headers",
        "httpVersion",
        "httpVersionMinor",
        "httpVersionMajor",
        "method",
        "rawHeaders",
        "rawTrailers",
        "setTimeout",
        "socket",
        "statusCode",
        "statusMessage",
        "trailers",
        "url"
      ];
      t.exports = (i, n) => {
        if (n._readableState.autoDestroy)
          throw new Error("The second stream must have the `autoDestroy` option set to `false`");
        let o = new Set(Object.keys(i).concat(r)), a = {};
        for (let u of o)
          u in n || (a[u] = {
            get() {
              let l = i[u];
              return typeof l == "function" ? l.bind(i) : l;
            },
            set(l) {
              i[u] = l;
            },
            enumerable: !0,
            configurable: !1
          });
        return Object.defineProperties(n, a), i.once("aborted", () => {
          n.destroy(), n.emit("aborted");
        }), i.once("close", () => {
          i.complete && n.readable ? n.once("end", () => {
            n.emit("close");
          }) : n.emit("close");
        }), n;
      };
    }
  }), Q1 = Y({
    "node_modules/.pnpm/decompress-response@6.0.0/node_modules/decompress-response/index.js"(e, t) {
      "use strict";
      var { Transform: r, PassThrough: i } = require("stream"), n = require("zlib"), o = X1();
      t.exports = (a) => {
        let u = (a.headers["content-encoding"] || "").toLowerCase();
        if (!["gzip", "deflate", "br"].includes(u))
          return a;
        let l = u === "br";
        if (l && typeof n.createBrotliDecompress != "function")
          return a.destroy(new Error("Brotli is not supported on Node.js < 12")), a;
        let c = !0, d = new r({
          transform(f, g, E) {
            c = !1, E(null, f);
          },
          flush(f) {
            f();
          }
        }), p = new i({
          autoDestroy: !1,
          destroy(f, g) {
            a.destroy(), g(f);
          }
        }), h = l ? n.createBrotliDecompress() : n.createUnzip();
        return h.once("error", (f) => {
          if (c && !a.readable) {
            p.end();
            return;
          }
          p.destroy(f);
        }), o(a, p), a.pipe(d).pipe(h).pipe(p), p;
      };
    }
  }), L0 = Y({
    "node_modules/.pnpm/quick-lru@5.1.1/node_modules/quick-lru/index.js"(e, t) {
      "use strict";
      var r = class {
        static {
          s(this, "QuickLRU");
        }
        constructor(i = {}) {
          if (!(i.maxSize && i.maxSize > 0))
            throw new TypeError("`maxSize` must be a number greater than 0");
          this.maxSize = i.maxSize, this.onEviction = i.onEviction, this.cache = /* @__PURE__ */ new Map(), this.oldCache = /* @__PURE__ */ new Map(),
          this._size = 0;
        }
        _set(i, n) {
          if (this.cache.set(i, n), this._size++, this._size >= this.maxSize) {
            if (this._size = 0, typeof this.onEviction == "function")
              for (let [o, a] of this.oldCache.entries())
                this.onEviction(o, a);
            this.oldCache = this.cache, this.cache = /* @__PURE__ */ new Map();
          }
        }
        get(i) {
          if (this.cache.has(i))
            return this.cache.get(i);
          if (this.oldCache.has(i)) {
            let n = this.oldCache.get(i);
            return this.oldCache.delete(i), this._set(i, n), n;
          }
        }
        set(i, n) {
          return this.cache.has(i) ? this.cache.set(i, n) : this._set(i, n), this;
        }
        has(i) {
          return this.cache.has(i) || this.oldCache.has(i);
        }
        peek(i) {
          if (this.cache.has(i))
            return this.cache.get(i);
          if (this.oldCache.has(i))
            return this.oldCache.get(i);
        }
        delete(i) {
          let n = this.cache.delete(i);
          return n && this._size--, this.oldCache.delete(i) || n;
        }
        clear() {
          this.cache.clear(), this.oldCache.clear(), this._size = 0;
        }
        *keys() {
          for (let [i] of this)
            yield i;
        }
        *values() {
          for (let [, i] of this)
            yield i;
        }
        *[Symbol.iterator]() {
          for (let i of this.cache)
            yield i;
          for (let i of this.oldCache) {
            let [n] = i;
            this.cache.has(n) || (yield i);
          }
        }
        get size() {
          let i = 0;
          for (let n of this.oldCache.keys())
            this.cache.has(n) || i++;
          return Math.min(this._size + i, this.maxSize);
        }
      };
      t.exports = r;
    }
  }), N0 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/delay-async-destroy.js"(e, t) {
      "use strict";
      t.exports = (r) => {
        if (r.listenerCount("error") !== 0)
          return r;
        r.__destroy = r._destroy, r._destroy = (...n) => {
          let o = n.pop();
          r.__destroy(...n, async (a) => {
            await Promise.resolve(), o(a);
          });
        };
        let i = /* @__PURE__ */ s((n) => {
          Promise.resolve().then(() => {
            r.emit("error", n);
          });
        }, "onError");
        return r.once("error", i), Promise.resolve().then(() => {
          r.off("error", i);
        }), r;
      };
    }
  }), Si = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/agent.js"(e, t) {
      "use strict";
      var { URL: r } = require("url"), i = require("events"), n = require("tls"), o = require("http2"), a = L0(), u = N0(), l = Symbol("curr\
entStreamCount"), c = Symbol("request"), d = Symbol("cachedOriginSet"), p = Symbol("gracefullyClosing"), h = Symbol("length"), f = [
        // Not an Agent option actually
        "createConnection",
        // `http2.connect()` options
        "maxDeflateDynamicTableSize",
        "maxSettings",
        "maxSessionMemory",
        "maxHeaderListPairs",
        "maxOutstandingPings",
        "maxReservedRemoteStreams",
        "maxSendHeaderBlockLength",
        "paddingStrategy",
        "peerMaxConcurrentStreams",
        "settings",
        // `tls.connect()` source options
        "family",
        "localAddress",
        "rejectUnauthorized",
        // `tls.connect()` secure context options
        "pskCallback",
        "minDHSize",
        // `tls.connect()` destination options
        // - `servername` is automatically validated, skip it
        // - `host` and `port` just describe the destination server,
        "path",
        "socket",
        // `tls.createSecureContext()` options
        "ca",
        "cert",
        "sigalgs",
        "ciphers",
        "clientCertEngine",
        "crl",
        "dhparam",
        "ecdhCurve",
        "honorCipherOrder",
        "key",
        "privateKeyEngine",
        "privateKeyIdentifier",
        "maxVersion",
        "minVersion",
        "pfx",
        "secureOptions",
        "secureProtocol",
        "sessionIdContext",
        "ticketKeys"
      ], g = /* @__PURE__ */ s((T, S, F) => {
        let I = 0, q = T.length;
        for (; I < q; ) {
          let M = I + q >>> 1;
          F(T[M], S) ? I = M + 1 : q = M;
        }
        return I;
      }, "getSortedIndex"), E = /* @__PURE__ */ s((T, S) => T.remoteSettings.maxConcurrentStreams > S.remoteSettings.maxConcurrentStreams, "\
compareSessions"), _ = /* @__PURE__ */ s((T, S) => {
        for (let F = 0; F < T.length; F++) {
          let I = T[F];
          // Unfortunately `.every()` returns true for an empty array
          I[d].length > 0 && I[d].length < S[d].length && I[d].every((q) => S[d].includes(q)) && I[l] + S[l] <= S.remoteSettings.maxConcurrentStreams &&
          x(I);
        }
      }, "closeCoveredSessions"), C = /* @__PURE__ */ s((T, S) => {
        for (let F = 0; F < T.length; F++) {
          let I = T[F];
          if (S[d].length > 0 && S[d].length < I[d].length && S[d].every((q) => I[d].includes(q)) && S[l] + I[l] <= I.remoteSettings.maxConcurrentStreams)
            return x(S), !0;
        }
        return !1;
      }, "closeSessionIfCovered"), x = /* @__PURE__ */ s((T) => {
        T[p] = !0, T[l] === 0 && T.close();
      }, "gracefullyClose"), w = class extends i {
        static {
          s(this, "Agent");
        }
        constructor({ timeout: T = 0, maxSessions: S = Number.POSITIVE_INFINITY, maxEmptySessions: F = 10, maxCachedTlsSessions: I = 100 } = {}) {
          super(), this.sessions = {}, this.queue = {}, this.timeout = T, this.maxSessions = S, this.maxEmptySessions = F, this._emptySessionCount =
          0, this._sessionCount = 0, this.settings = {
            enablePush: !1,
            initialWindowSize: 1024 * 1024 * 32
            // 32MB, see https://github.com/nodejs/node/issues/38426
          }, this.tlsSessionCache = new a({ maxSize: I });
        }
        get protocol() {
          return "https:";
        }
        normalizeOptions(T) {
          let S = "";
          for (let F = 0; F < f.length; F++) {
            let I = f[F];
            S += ":", T && T[I] !== void 0 && (S += T[I]);
          }
          return S;
        }
        _processQueue() {
          if (this._sessionCount >= this.maxSessions) {
            this.closeEmptySessions(this.maxSessions - this._sessionCount + 1);
            return;
          }
          for (let T in this.queue)
            for (let S in this.queue[T]) {
              let F = this.queue[T][S];
              F.completed || (F.completed = !0, F());
            }
        }
        _isBetterSession(T, S) {
          return T > S;
        }
        _accept(T, S, F, I) {
          let q = 0;
          for (; q < S.length && T[l] < T.remoteSettings.maxConcurrentStreams; )
            S[q].resolve(T), q++;
          S.splice(0, q), S.length > 0 && (this.getSession(F, I, S), S.length = 0);
        }
        getSession(T, S, F) {
          return new Promise((I, q) => {
            Array.isArray(F) && F.length > 0 ? (F = [...F], I()) : F = [{ resolve: I, reject: q }];
            try {
              if (typeof T == "string")
                T = new r(T);
              else if (!(T instanceof r))
                throw new TypeError("The `origin` argument needs to be a string or an URL object");
              if (S) {
                let { servername: j } = S, { hostname: B } = T;
                if (j && B !== j)
                  throw new Error(`Origin ${B} differs from servername ${j}`);
              }
            } catch (j) {
              for (let B = 0; B < F.length; B++)
                F[B].reject(j);
              return;
            }
            let M = this.normalizeOptions(S), H = T.origin;
            if (M in this.sessions) {
              let j = this.sessions[M], B = -1, U = -1, pe;
              for (let J = 0; J < j.length; J++) {
                let P = j[J], Se = P.remoteSettings.maxConcurrentStreams;
                if (Se < B)
                  break;
                if (!P[d].includes(H))
                  continue;
                let z = P[l];
                z >= Se || P[p] || P.destroyed || (pe || (B = Se), this._isBetterSession(z, U) && (pe = P, U = z));
              }
              if (pe) {
                this._accept(pe, F, H, S);
                return;
              }
            }
            if (M in this.queue) {
              if (H in this.queue[M]) {
                this.queue[M][H].listeners.push(...F);
                return;
              }
            } else
              this.queue[M] = {
                [h]: 0
              };
            let K = /* @__PURE__ */ s(() => {
              M in this.queue && this.queue[M][H] === ve && (delete this.queue[M][H], --this.queue[M][h] === 0 && delete this.queue[M]);
            }, "removeFromQueue"), ve = /* @__PURE__ */ s(async () => {
              this._sessionCount++;
              let j = `${H}:${M}`, B = !1, U;
              try {
                let pe = { ...S };
                pe.settings === void 0 && (pe.settings = this.settings), pe.session === void 0 && (pe.session = this.tlsSessionCache.get(j)),
                U = await (pe.createConnection || this.createConnection).call(this, T, pe), pe.createConnection = () => U;
                let P = o.connect(T, pe);
                P[l] = 0, P[p] = !1;
                let Se = /* @__PURE__ */ s(() => {
                  let { socket: Z } = P, le;
                  return Z.servername === !1 ? (Z.servername = Z.remoteAddress, le = P.originSet, Z.servername = !1) : le = P.originSet, le;
                }, "getOriginSet"), z = /* @__PURE__ */ s(() => P[l] < P.remoteSettings.maxConcurrentStreams, "isFree");
                P.socket.once("session", (Z) => {
                  this.tlsSessionCache.set(j, Z);
                }), P.once("error", (Z) => {
                  for (let le = 0; le < F.length; le++)
                    F[le].reject(Z);
                  this.tlsSessionCache.delete(j);
                }), P.setTimeout(this.timeout, () => {
                  P.destroy();
                }), P.once("close", () => {
                  if (this._sessionCount--, B) {
                    this._emptySessionCount--;
                    let Z = this.sessions[M];
                    Z.length === 1 ? delete this.sessions[M] : Z.splice(Z.indexOf(P), 1);
                  } else {
                    K();
                    let Z = new Error("Session closed without receiving a SETTINGS frame");
                    Z.code = "HTTP2WRAPPER_NOSETTINGS";
                    for (let le = 0; le < F.length; le++)
                      F[le].reject(Z);
                  }
                  this._processQueue();
                });
                let Ni = /* @__PURE__ */ s(() => {
                  let Z = this.queue[M];
                  if (!Z)
                    return;
                  let le = P[d];
                  for (let at = 0; at < le.length; at++) {
                    let Ui = le[at];
                    if (Ui in Z) {
                      let { listeners: jd, completed: tw } = Z[Ui], cs = 0;
                      for (; cs < jd.length && z(); )
                        jd[cs].resolve(P), cs++;
                      if (Z[Ui].listeners.splice(0, cs), Z[Ui].listeners.length === 0 && !tw && (delete Z[Ui], --Z[h] === 0)) {
                        delete this.queue[M];
                        break;
                      }
                      if (!z())
                        break;
                    }
                  }
                }, "processListeners");
                P.on("origin", () => {
                  P[d] = Se() || [], P[p] = !1, C(this.sessions[M], P), !(P[p] || !z()) && (Ni(), z() && _(this.sessions[M], P));
                }), P.once("remoteSettings", () => {
                  if (ve.destroyed) {
                    let Z = new Error("Agent has been destroyed");
                    for (let le = 0; le < F.length; le++)
                      F[le].reject(Z);
                    P.destroy();
                    return;
                  }
                  if (P.setLocalWindowSize && P.setLocalWindowSize(1024 * 1024 * 4), P[d] = Se() || [], P.socket.encrypted) {
                    let Z = P[d][0];
                    if (Z !== H) {
                      let le = new Error(`Requested origin ${H} does not match server ${Z}`);
                      for (let at = 0; at < F.length; at++)
                        F[at].reject(le);
                      P.destroy();
                      return;
                    }
                  }
                  K();
                  {
                    let Z = this.sessions;
                    if (M in Z) {
                      let le = Z[M];
                      le.splice(g(le, P, E), 0, P);
                    } else
                      Z[M] = [P];
                  }
                  B = !0, this._emptySessionCount++, this.emit("session", P), this._accept(P, F, H, S), P[l] === 0 && this._emptySessionCount >
                  this.maxEmptySessions && this.closeEmptySessions(this._emptySessionCount - this.maxEmptySessions), P.on("remoteSettings", () => {
                    z() && (Ni(), z() && _(this.sessions[M], P));
                  });
                }), P[c] = P.request, P.request = (Z, le) => {
                  if (P[p])
                    throw new Error("The session is gracefully closing. No new streams are allowed.");
                  let at = P[c](Z, le);
                  return P.ref(), P[l]++ === 0 && this._emptySessionCount--, at.once("close", () => {
                    if (--P[l] === 0 && (this._emptySessionCount++, P.unref(), this._emptySessionCount > this.maxEmptySessions || P[p])) {
                      P.close();
                      return;
                    }
                    P.destroyed || P.closed || z() && !C(this.sessions[M], P) && (_(this.sessions[M], P), Ni(), P[l] === 0 && this._processQueue());
                  }), at;
                };
              } catch (pe) {
                K(), this._sessionCount--;
                for (let J = 0; J < F.length; J++)
                  F[J].reject(pe);
              }
            }, "entry");
            ve.listeners = F, ve.completed = !1, ve.destroyed = !1, this.queue[M][H] = ve, this.queue[M][h]++, this._processQueue();
          });
        }
        request(T, S, F, I) {
          return new Promise((q, M) => {
            this.getSession(T, S, [{
              reject: M,
              resolve: /* @__PURE__ */ s((H) => {
                try {
                  let K = H.request(F, I);
                  u(K), q(K);
                } catch (K) {
                  M(K);
                }
              }, "resolve")
            }]);
          });
        }
        async createConnection(T, S) {
          return w.connect(T, S);
        }
        static connect(T, S) {
          S.ALPNProtocols = ["h2"];
          let F = T.port || 443, I = T.hostname;
          typeof S.servername > "u" && (S.servername = I);
          let q = n.connect(F, I, S);
          return S.socket && (q._peername = {
            family: void 0,
            address: void 0,
            port: F
          }), q;
        }
        closeEmptySessions(T = Number.POSITIVE_INFINITY) {
          let S = 0, { sessions: F } = this;
          for (let I in F) {
            let q = F[I];
            for (let M = 0; M < q.length; M++) {
              let H = q[M];
              if (H[l] === 0 && (S++, H.close(), S >= T))
                return S;
            }
          }
          return S;
        }
        destroy(T) {
          let { sessions: S, queue: F } = this;
          for (let I in S) {
            let q = S[I];
            for (let M = 0; M < q.length; M++)
              q[M].destroy(T);
          }
          for (let I in F) {
            let q = F[I];
            for (let M in q)
              q[M].destroyed = !0;
          }
          this.queue = {}, this.tlsSessionCache.clear();
        }
        get emptySessionCount() {
          return this._emptySessionCount;
        }
        get pendingSessionCount() {
          return this._sessionCount - this._emptySessionCount;
        }
        get sessionCount() {
          return this._sessionCount;
        }
      };
      w.kCurrentStreamCount = l, w.kGracefullyClosing = p, t.exports = {
        Agent: w,
        globalAgent: new w()
      };
    }
  }), U0 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/incoming-message.js"(e, t) {
      "use strict";
      var { Readable: r } = require("stream"), i = class extends r {
        static {
          s(this, "IncomingMessage");
        }
        constructor(n, o) {
          super({
            emitClose: !1,
            autoDestroy: !0,
            highWaterMark: o
          }), this.statusCode = null, this.statusMessage = "", this.httpVersion = "2.0", this.httpVersionMajor = 2, this.httpVersionMinor = 0,
          this.headers = {}, this.trailers = {}, this.req = null, this.aborted = !1, this.complete = !1, this.upgrade = null, this.rawHeaders =
          [], this.rawTrailers = [], this.socket = n, this._dumped = !1;
        }
        get connection() {
          return this.socket;
        }
        set connection(n) {
          this.socket = n;
        }
        _destroy(n, o) {
          this.readableEnded || (this.aborted = !0), o(), this.req._request.destroy(n);
        }
        setTimeout(n, o) {
          return this.req.setTimeout(n, o), this;
        }
        _dump() {
          this._dumped || (this._dumped = !0, this.removeAllListeners("data"), this.resume());
        }
        _read() {
          this.req && this.req._request.resume();
        }
      };
      t.exports = i;
    }
  }), e3 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/proxy-events.js"(e, t) {
      "use strict";
      t.exports = (r, i, n) => {
        for (let o of n)
          r.on(o, (...a) => i.emit(o, ...a));
      };
    }
  }), Xo = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/errors.js"(e, t) {
      "use strict";
      var r = /* @__PURE__ */ s((i, n, o) => {
        t.exports[n] = class extends i {
          static {
            s(this, "NodeError");
          }
          constructor(...u) {
            super(typeof o == "string" ? o : o(u)), this.name = `${super.name} [${n}]`, this.code = n;
          }
        };
      }, "makeError");
      r(TypeError, "ERR_INVALID_ARG_TYPE", (i) => {
        let n = i[0].includes(".") ? "property" : "argument", o = i[1], a = Array.isArray(o);
        return a && (o = `${o.slice(0, -1).join(", ")} or ${o.slice(-1)}`), `The "${i[0]}" ${n} must be ${a ? "one of" : "of"} type ${o}. Re\
ceived ${typeof i[2]}`;
      }), r(
        TypeError,
        "ERR_INVALID_PROTOCOL",
        (i) => `Protocol "${i[0]}" not supported. Expected "${i[1]}"`
      ), r(
        Error,
        "ERR_HTTP_HEADERS_SENT",
        (i) => `Cannot ${i[0]} headers after they are sent to the client`
      ), r(
        TypeError,
        "ERR_INVALID_HTTP_TOKEN",
        (i) => `${i[0]} must be a valid HTTP token [${i[1]}]`
      ), r(
        TypeError,
        "ERR_HTTP_INVALID_HEADER_VALUE",
        (i) => `Invalid value "${i[0]} for header "${i[1]}"`
      ), r(
        TypeError,
        "ERR_INVALID_CHAR",
        (i) => `Invalid character in ${i[0]} [${i[1]}]`
      ), r(
        Error,
        "ERR_HTTP2_NO_SOCKET_MANIPULATION",
        "HTTP/2 sockets should not be directly manipulated (e.g. read and written)"
      );
    }
  }), t3 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/is-request-pseudo-header.js"(e, t) {
      "use strict";
      t.exports = (r) => {
        switch (r) {
          case ":method":
          case ":scheme":
          case ":authority":
          case ":path":
            return !0;
          default:
            return !1;
        }
      };
    }
  }), $0 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/validate-header-name.js"(e, t) {
      "use strict";
      var { ERR_INVALID_HTTP_TOKEN: r } = Xo(), i = t3(), n = /^[\^`\-\w!#$%&*+.|~]+$/;
      t.exports = (o) => {
        if (typeof o != "string" || !n.test(o) && !i(o))
          throw new r("Header name", o);
      };
    }
  }), W0 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/validate-header-value.js"(e, t) {
      "use strict";
      var {
        ERR_HTTP_INVALID_HEADER_VALUE: r,
        ERR_INVALID_CHAR: i
      } = Xo(), n = /[^\t\u0020-\u007E\u0080-\u00FF]/;
      t.exports = (o, a) => {
        if (typeof a > "u")
          throw new r(a, o);
        if (n.test(a))
          throw new i("header content", o);
      };
    }
  }), r3 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/proxy-socket-handler.js"(e, t) {
      "use strict";
      var { ERR_HTTP2_NO_SOCKET_MANIPULATION: r } = Xo(), i = {
        has(n, o) {
          let a = n.session === void 0 ? n : n.session.socket;
          return o in n || o in a;
        },
        get(n, o) {
          switch (o) {
            case "on":
            case "once":
            case "end":
            case "emit":
            case "destroy":
              return n[o].bind(n);
            case "writable":
            case "destroyed":
              return n[o];
            case "readable":
              return n.destroyed ? !1 : n.readable;
            case "setTimeout": {
              let { session: a } = n;
              return a !== void 0 ? a.setTimeout.bind(a) : n.setTimeout.bind(n);
            }
            case "write":
            case "read":
            case "pause":
            case "resume":
              throw new r();
            default: {
              let a = n.session === void 0 ? n : n.session.socket, u = a[o];
              return typeof u == "function" ? u.bind(a) : u;
            }
          }
        },
        getPrototypeOf(n) {
          return n.session !== void 0 ? Reflect.getPrototypeOf(n.session.socket) : Reflect.getPrototypeOf(n);
        },
        set(n, o, a) {
          switch (o) {
            case "writable":
            case "readable":
            case "destroyed":
            case "on":
            case "once":
            case "end":
            case "emit":
            case "destroy":
              return n[o] = a, !0;
            case "setTimeout": {
              let { session: u } = n;
              return u === void 0 ? n.setTimeout = a : u.setTimeout = a, !0;
            }
            case "write":
            case "read":
            case "pause":
            case "resume":
              throw new r();
            default: {
              let u = n.session === void 0 ? n : n.session.socket;
              return u[o] = a, !0;
            }
          }
        }
      };
      t.exports = i;
    }
  }), H0 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/client-request.js"(e, t) {
      "use strict";
      var { URL: r, urlToHttpOptions: i } = require("url"), n = require("http2"), { Writable: o } = require("stream"), { Agent: a, globalAgent: u } = Si(),
      l = U0(), c = e3(), {
        ERR_INVALID_ARG_TYPE: d,
        ERR_INVALID_PROTOCOL: p,
        ERR_HTTP_HEADERS_SENT: h
      } = Xo(), f = $0(), g = W0(), E = r3(), {
        HTTP2_HEADER_STATUS: _,
        HTTP2_HEADER_METHOD: C,
        HTTP2_HEADER_PATH: x,
        HTTP2_HEADER_AUTHORITY: w,
        HTTP2_METHOD_CONNECT: T
      } = n.constants, S = Symbol("headers"), F = Symbol("origin"), I = Symbol("session"), q = Symbol("options"), M = Symbol("flushedHeaders"),
      H = Symbol("jobs"), K = Symbol("pendingAgentPromise"), ve = class extends o {
        static {
          s(this, "ClientRequest");
        }
        constructor(j, B, U) {
          if (super({
            autoDestroy: !1,
            emitClose: !1
          }), typeof j == "string" ? j = i(new r(j)) : j instanceof r ? j = i(j) : j = { ...j }, typeof B == "function" || B === void 0 ? (U =
          B, B = j) : B = Object.assign(j, B), B.h2session) {
            if (this[I] = B.h2session, this[I].destroyed)
              throw new Error("The session has been closed already");
            this.protocol = this[I].socket.encrypted ? "https:" : "http:";
          } else if (B.agent === !1)
            this.agent = new a({ maxEmptySessions: 0 });
          else if (typeof B.agent > "u" || B.agent === null)
            this.agent = u;
          else if (typeof B.agent.request == "function")
            this.agent = B.agent;
          else
            throw new d("options.agent", ["http2wrapper.Agent-like Object", "undefined", "false"], B.agent);
          if (this.agent && (this.protocol = this.agent.protocol), B.protocol && B.protocol !== this.protocol)
            throw new p(B.protocol, this.protocol);
          B.port || (B.port = B.defaultPort || this.agent && this.agent.defaultPort || 443), B.host = B.hostname || B.host || "localhost", delete B.
          hostname;
          let { timeout: pe } = B;
          B.timeout = void 0, this[S] = /* @__PURE__ */ Object.create(null), this[H] = [], this[K] = void 0, this.socket = null, this.connection =
          null, this.method = B.method || "GET", this.method === "CONNECT" && (B.path === "/" || B.path === void 0) || (this.path = B.path),
          this.res = null, this.aborted = !1, this.reusedSocket = !1;
          let { headers: J } = B;
          if (J)
            for (let Se in J)
              this.setHeader(Se, J[Se]);
          B.auth && !("authorization" in this[S]) && (this[S].authorization = "Basic " + Buffer.from(B.auth).toString("base64")), B.session =
          B.tlsSession, B.path = B.socketPath, this[q] = B, this[F] = new r(`${this.protocol}//${B.servername || B.host}:${B.port}`);
          let P = B._reuseSocket;
          P && (B.createConnection = (...Se) => P.destroyed ? this.agent.createConnection(...Se) : P, this.agent.getSession(this[F], this[q]).
          catch(() => {
          })), pe && this.setTimeout(pe), U && this.once("response", U), this[M] = !1;
        }
        get method() {
          return this[S][C];
        }
        set method(j) {
          j && (this[S][C] = j.toUpperCase());
        }
        get path() {
          let j = this.method === "CONNECT" ? w : x;
          return this[S][j];
        }
        set path(j) {
          if (j) {
            let B = this.method === "CONNECT" ? w : x;
            this[S][B] = j;
          }
        }
        get host() {
          return this[F].hostname;
        }
        set host(j) {
        }
        get _mustNotHaveABody() {
          return this.method === "GET" || this.method === "HEAD" || this.method === "DELETE";
        }
        _write(j, B, U) {
          if (this._mustNotHaveABody) {
            U(new Error("The GET, HEAD and DELETE methods must NOT have a body"));
            return;
          }
          this.flushHeaders();
          let pe = /* @__PURE__ */ s(() => this._request.write(j, B, U), "callWrite");
          this._request ? pe() : this[H].push(pe);
        }
        _final(j) {
          this.flushHeaders();
          let B = /* @__PURE__ */ s(() => {
            if (this._mustNotHaveABody || this.method === "CONNECT") {
              j();
              return;
            }
            this._request.end(j);
          }, "callEnd");
          this._request ? B() : this[H].push(B);
        }
        abort() {
          this.res && this.res.complete || (this.aborted || process.nextTick(() => this.emit("abort")), this.aborted = !0, this.destroy());
        }
        async _destroy(j, B) {
          this.res && this.res._dump(), this._request ? this._request.destroy() : process.nextTick(() => {
            this.emit("close");
          });
          try {
            await this[K];
          } catch (U) {
            this.aborted && (j = U);
          }
          B(j);
        }
        async flushHeaders() {
          if (this[M] || this.destroyed)
            return;
          this[M] = !0;
          let j = this.method === T, B = /* @__PURE__ */ s((U) => {
            if (this._request = U, this.destroyed) {
              U.destroy();
              return;
            }
            j || c(U, this, ["timeout", "continue"]), U.once("error", (J) => {
              this.destroy(J);
            }), U.once("aborted", () => {
              let { res: J } = this;
              J ? (J.aborted = !0, J.emit("aborted"), J.destroy()) : this.destroy(new Error("The server aborted the HTTP/2 stream"));
            });
            let pe = /* @__PURE__ */ s((J, P, Se) => {
              let z = new l(this.socket, U.readableHighWaterMark);
              this.res = z, z.url = `${this[F].origin}${this.path}`, z.req = this, z.statusCode = J[_], z.headers = J, z.rawHeaders = Se, z.
              once("end", () => {
                z.complete = !0, z.socket = null, z.connection = null;
              }), j ? (z.upgrade = !0, this.emit("connect", z, U, Buffer.alloc(0)) ? this.emit("close") : U.destroy()) : (U.on("data", (Ni) => {
                !z._dumped && !z.push(Ni) && U.pause();
              }), U.once("end", () => {
                this.aborted || z.push(null);
              }), this.emit("response", z) || z._dump());
            }, "onResponse");
            U.once("response", pe), U.once("headers", (J) => this.emit("information", { statusCode: J[_] })), U.once("trailers", (J, P, Se) => {
              let { res: z } = this;
              if (z === null) {
                pe(J, P, Se);
                return;
              }
              z.trailers = J, z.rawTrailers = Se;
            }), U.once("close", () => {
              let { aborted: J, res: P } = this;
              if (P) {
                J && (P.aborted = !0, P.emit("aborted"), P.destroy());
                let Se = /* @__PURE__ */ s(() => {
                  P.emit("close"), this.destroy(), this.emit("close");
                }, "finish");
                P.readable ? P.once("end", Se) : Se();
                return;
              }
              if (!this.destroyed) {
                this.destroy(new Error("The HTTP/2 stream has been early terminated")), this.emit("close");
                return;
              }
              this.destroy(), this.emit("close");
            }), this.socket = new Proxy(U, E);
            for (let J of this[H])
              J();
            this[H].length = 0, this.emit("socket", this.socket);
          }, "onStream");
          if (!(w in this[S]) && !j && (this[S][w] = this[F].host), this[I])
            try {
              B(this[I].request(this[S]));
            } catch (U) {
              this.destroy(U);
            }
          else {
            this.reusedSocket = !0;
            try {
              let U = this.agent.request(this[F], this[q], this[S]);
              this[K] = U, B(await U), this[K] = !1;
            } catch (U) {
              this[K] = !1, this.destroy(U);
            }
          }
        }
        get connection() {
          return this.socket;
        }
        set connection(j) {
          this.socket = j;
        }
        getHeaderNames() {
          return Object.keys(this[S]);
        }
        hasHeader(j) {
          if (typeof j != "string")
            throw new d("name", "string", j);
          return !!this[S][j.toLowerCase()];
        }
        getHeader(j) {
          if (typeof j != "string")
            throw new d("name", "string", j);
          return this[S][j.toLowerCase()];
        }
        get headersSent() {
          return this[M];
        }
        removeHeader(j) {
          if (typeof j != "string")
            throw new d("name", "string", j);
          if (this.headersSent)
            throw new h("remove");
          delete this[S][j.toLowerCase()];
        }
        setHeader(j, B) {
          if (this.headersSent)
            throw new h("set");
          f(j), g(j, B);
          let U = j.toLowerCase();
          if (U === "connection") {
            if (B.toLowerCase() === "keep-alive")
              return;
            throw new Error(`Invalid 'connection' header: ${B}`);
          }
          U === "host" && this.method === "CONNECT" ? this[S][w] = B : this[S][U] = B;
        }
        setNoDelay() {
        }
        setSocketKeepAlive() {
        }
        setTimeout(j, B) {
          let U = /* @__PURE__ */ s(() => this._request.setTimeout(j, B), "applyTimeout");
          return this._request ? U() : this[H].push(U), this;
        }
        get maxHeadersCount() {
          if (!this.destroyed && this._request)
            return this._request.session.localSettings.maxHeaderListSize;
        }
        set maxHeadersCount(j) {
        }
      };
      t.exports = ve;
    }
  }), i3 = Y({
    "node_modules/.pnpm/resolve-alpn@1.2.1/node_modules/resolve-alpn/index.js"(e, t) {
      "use strict";
      var r = require("tls");
      t.exports = (i = {}, n = r.connect) => new Promise((o, a) => {
        let u = !1, l, c = /* @__PURE__ */ s(async () => {
          await p, l.off("timeout", d), l.off("error", a), i.resolveSocket ? (o({ alpnProtocol: l.alpnProtocol, socket: l, timeout: u }), u &&
          (await Promise.resolve(), l.emit("timeout"))) : (l.destroy(), o({ alpnProtocol: l.alpnProtocol, timeout: u }));
        }, "callback"), d = /* @__PURE__ */ s(async () => {
          u = !0, c();
        }, "onTimeout"), p = (async () => {
          try {
            l = await n(i, c), l.on("error", a), l.once("timeout", d);
          } catch (h) {
            a(h);
          }
        })();
      });
    }
  }), n3 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/calculate-server-name.js"(e, t) {
      "use strict";
      var { isIP: r } = require("net"), i = require("assert"), n = /* @__PURE__ */ s((o) => {
        if (o[0] === "[") {
          let u = o.indexOf("]");
          return i(u !== -1), o.slice(1, u);
        }
        let a = o.indexOf(":");
        return a === -1 ? o : o.slice(0, a);
      }, "getHost");
      t.exports = (o) => {
        let a = n(o);
        return r(a) ? "" : a;
      };
    }
  }), s3 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/auto.js"(e, t) {
      "use strict";
      var { URL: r, urlToHttpOptions: i } = require("url"), n = require("http"), o = require("https"), a = i3(), u = L0(), { Agent: l, globalAgent: c } = Si(),
      d = H0(), p = n3(), h = N0(), f = new u({ maxSize: 100 }), g = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ s((x, w, T) => {
        w._httpMessage = { shouldKeepAlive: !0 };
        let S = /* @__PURE__ */ s(() => {
          x.emit("free", w, T);
        }, "onFree");
        w.on("free", S);
        let F = /* @__PURE__ */ s(() => {
          x.removeSocket(w, T);
        }, "onClose");
        w.on("close", F);
        let I = /* @__PURE__ */ s(() => {
          let { freeSockets: M } = x;
          for (let H of Object.values(M))
            if (H.includes(w)) {
              w.destroy();
              return;
            }
        }, "onTimeout");
        w.on("timeout", I);
        let q = /* @__PURE__ */ s(() => {
          x.removeSocket(w, T), w.off("close", F), w.off("free", S), w.off("timeout", I), w.off("agentRemove", q);
        }, "onRemove");
        w.on("agentRemove", q), x.emit("free", w, T);
      }, "installSocket"), _ = /* @__PURE__ */ s((x, w = /* @__PURE__ */ new Map(), T = void 0) => async (S) => {
        let F = `${S.host}:${S.port}:${S.ALPNProtocols.sort()}`;
        if (!x.has(F)) {
          if (w.has(F))
            return { alpnProtocol: (await w.get(F)).alpnProtocol };
          let { path: I } = S;
          S.path = S.socketPath;
          let q = a(S, T);
          w.set(F, q);
          try {
            let M = await q;
            return x.set(F, M.alpnProtocol), w.delete(F), S.path = I, M;
          } catch (M) {
            throw w.delete(F), S.path = I, M;
          }
        }
        return { alpnProtocol: x.get(F) };
      }, "createResolveProtocol"), C = _(f, g);
      t.exports = async (x, w, T) => {
        if (typeof x == "string" ? x = i(new r(x)) : x instanceof r ? x = i(x) : x = { ...x }, typeof w == "function" || w === void 0 ? (T =
        w, w = x) : w = Object.assign(x, w), w.ALPNProtocols = w.ALPNProtocols || ["h2", "http/1.1"], !Array.isArray(w.ALPNProtocols) || w.ALPNProtocols.
        length === 0)
          throw new Error("The `ALPNProtocols` option must be an Array with at least one entry");
        w.protocol = w.protocol || "https:";
        let S = w.protocol === "https:";
        w.host = w.hostname || w.host || "localhost", w.session = w.tlsSession, w.servername = w.servername || p(w.headers && w.headers.host ||
        w.host), w.port = w.port || (S ? 443 : 80), w._defaultAgent = S ? o.globalAgent : n.globalAgent;
        let F = w.resolveProtocol || C, { agent: I } = w;
        if (I !== void 0 && I !== !1 && I.constructor.name !== "Object")
          throw new Error("The `options.agent` can be only an object `http`, `https` or `http2` properties");
        if (S) {
          w.resolveSocket = !0;
          let { socket: q, alpnProtocol: M, timeout: H } = await F(w);
          if (H) {
            q && q.destroy();
            let ve = new Error(`Timed out resolving ALPN: ${w.timeout} ms`);
            throw ve.code = "ETIMEDOUT", ve.ms = w.timeout, ve;
          }
          q && w.createConnection && (q.destroy(), q = void 0), delete w.resolveSocket;
          let K = M === "h2";
          if (I && (I = K ? I.http2 : I.https, w.agent = I), I === void 0 && (I = K ? c : o.globalAgent), q)
            if (I === !1)
              q.destroy();
            else {
              let ve = (K ? l : o.Agent).prototype.createConnection;
              I.createConnection === ve ? K ? w._reuseSocket = q : E(I, q, w) : q.destroy();
            }
          if (K)
            return h(new d(w, T));
        } else I && (w.agent = I.http);
        return h(n.request(w, T));
      }, t.exports.protocolCache = f, t.exports.resolveProtocol = C, t.exports.createResolveProtocol = _;
    }
  }), V0 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/js-stream-socket.js"(e, t) {
      "use strict";
      var r = require("stream"), i = require("tls"), n = new i.TLSSocket(new r.PassThrough())._handle._parentWrap.constructor;
      t.exports = n;
    }
  }), Z0 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/proxies/unexpected-status-code-error.js"(e, t) {
      "use strict";
      var r = class extends Error {
        static {
          s(this, "UnexpectedStatusCodeError");
        }
        constructor(i, n = "") {
          super(`The proxy server rejected the request with status code ${i} (${n || "empty status message"})`), this.statusCode = i, this.statusMessage =
          n;
        }
      };
      t.exports = r;
    }
  }), o3 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/check-type.js"(e, t) {
      "use strict";
      var r = /* @__PURE__ */ s((i, n, o) => {
        if (!o.some((u) => typeof u === "string" ? typeof n === u : n instanceof u)) {
          let u = o.map((l) => typeof l == "string" ? l : l.name);
          throw new TypeError(`Expected '${i}' to be a type of ${u.join(" or ")}, got ${typeof n}`);
        }
      }, "checkType");
      t.exports = r;
    }
  }), z0 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/proxies/initialize.js"(e, t) {
      "use strict";
      var { URL: r } = require("url"), i = o3();
      t.exports = (n, o) => {
        i("proxyOptions", o, ["object"]), i("proxyOptions.headers", o.headers, ["object", "undefined"]), i("proxyOptions.raw", o.raw, ["bool\
ean", "undefined"]), i("proxyOptions.url", o.url, [r, "string"]);
        let a = new r(o.url);
        n.proxyOptions = {
          raw: !0,
          ...o,
          headers: { ...o.headers },
          url: a
        };
      };
    }
  }), Wc = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/proxies/get-auth-headers.js"(e, t) {
      "use strict";
      t.exports = (r) => {
        let { username: i, password: n } = r.proxyOptions.url;
        if (i || n) {
          let o = `${i}:${n}`, a = `Basic ${Buffer.from(o).toString("base64")}`;
          return {
            "proxy-authorization": a,
            authorization: a
          };
        }
        return {};
      };
    }
  }), a3 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/proxies/h1-over-h2.js"(e, t) {
      "use strict";
      var r = require("tls"), i = require("http"), n = require("https"), o = V0(), { globalAgent: a } = Si(), u = Z0(), l = z0(), c = Wc(), d = /* @__PURE__ */ s(
      (f, g, E) => {
        (async () => {
          try {
            let { proxyOptions: _ } = f, { url: C, headers: x, raw: w } = _, T = await a.request(C, _, {
              ...c(f),
              ...x,
              ":method": "CONNECT",
              ":authority": `${g.host}:${g.port}`
            });
            T.once("error", E), T.once("response", (S) => {
              let F = S[":status"];
              if (F !== 200) {
                E(new u(F, ""));
                return;
              }
              let I = f instanceof n.Agent;
              if (w && I) {
                g.socket = T;
                let M = r.connect(g);
                M.once("close", () => {
                  T.destroy();
                }), E(null, M);
                return;
              }
              let q = new o(T);
              q.encrypted = !1, q._handle.getpeername = (M) => {
                M.family = void 0, M.address = void 0, M.port = void 0;
              }, E(null, q);
            });
          } catch (_) {
            E(_);
          }
        })();
      }, "createConnection"), p = class extends i.Agent {
        static {
          s(this, "HttpOverHttp2");
        }
        constructor(f) {
          super(f), l(this, f.proxyOptions);
        }
        createConnection(f, g) {
          d(this, f, g);
        }
      }, h = class extends n.Agent {
        static {
          s(this, "HttpsOverHttp2");
        }
        constructor(f) {
          super(f), l(this, f.proxyOptions);
        }
        createConnection(f, g) {
          d(this, f, g);
        }
      };
      t.exports = {
        HttpOverHttp2: p,
        HttpsOverHttp2: h
      };
    }
  }), G0 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/proxies/h2-over-hx.js"(e, t) {
      "use strict";
      var { Agent: r } = Si(), i = V0(), n = Z0(), o = z0(), a = class extends r {
        static {
          s(this, "Http2OverHttpX");
        }
        constructor(u) {
          super(u), o(this, u.proxyOptions);
        }
        async createConnection(u, l) {
          let c = `${u.hostname}:${u.port || 443}`, [d, p, h] = await this._getProxyStream(c);
          if (p !== 200)
            throw new n(p, h);
          if (this.proxyOptions.raw)
            l.socket = d;
          else {
            let f = new i(d);
            return f.encrypted = !1, f._handle.getpeername = (g) => {
              g.family = void 0, g.address = void 0, g.port = void 0;
            }, f;
          }
          return super.createConnection(u, l);
        }
      };
      t.exports = a;
    }
  }), u3 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/proxies/h2-over-h2.js"(e, t) {
      "use strict";
      var { globalAgent: r } = Si(), i = G0(), n = Wc(), o = /* @__PURE__ */ s((u) => new Promise((l, c) => {
        u.once("error", c), u.once("response", (d) => {
          u.off("error", c), l(d[":status"]);
        });
      }), "getStatusCode"), a = class extends i {
        static {
          s(this, "Http2OverHttp2");
        }
        async _getProxyStream(u) {
          let { proxyOptions: l } = this, c = {
            ...n(this),
            ...l.headers,
            ":method": "CONNECT",
            ":authority": u
          }, d = await r.request(l.url, l, c), p = await o(d);
          return [d, p, ""];
        }
      };
      t.exports = a;
    }
  }), l3 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/proxies/h2-over-h1.js"(e, t) {
      "use strict";
      var r = require("http"), i = require("https"), n = G0(), o = Wc(), a = /* @__PURE__ */ s((l) => new Promise((c, d) => {
        let p = /* @__PURE__ */ s((h, f, g) => {
          f.unshift(g), l.off("error", d), c([f, h.statusCode, h.statusMessage]);
        }, "onConnect");
        l.once("error", d), l.once("connect", p);
      }), "getStream2"), u = class extends n {
        static {
          s(this, "Http2OverHttp");
        }
        async _getProxyStream(l) {
          let { proxyOptions: c } = this, { url: d, headers: p } = this.proxyOptions, f = (d.protocol === "https:" ? i : r).request({
            ...c,
            hostname: d.hostname,
            port: d.port,
            path: l,
            headers: {
              ...o(this),
              ...p,
              host: l
            },
            method: "CONNECT"
          }).end();
          return a(f);
        }
      };
      t.exports = {
        Http2OverHttp: u,
        Http2OverHttps: u
      };
    }
  }), c3 = Y({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/index.js"(e, t) {
      "use strict";
      var r = require("http2"), {
        Agent: i,
        globalAgent: n
      } = Si(), o = H0(), a = U0(), u = s3(), {
        HttpOverHttp2: l,
        HttpsOverHttp2: c
      } = a3(), d = u3(), {
        Http2OverHttp: p,
        Http2OverHttps: h
      } = l3(), f = $0(), g = W0(), E = /* @__PURE__ */ s((C, x, w) => new o(C, x, w), "request"), _ = /* @__PURE__ */ s((C, x, w) => {
        let T = new o(C, x, w);
        return T.end(), T;
      }, "get");
      t.exports = {
        ...r,
        ClientRequest: o,
        IncomingMessage: a,
        Agent: i,
        globalAgent: n,
        request: E,
        get: _,
        auto: u,
        proxies: {
          HttpOverHttp2: l,
          HttpsOverHttp2: c,
          Http2OverHttp2: d,
          Http2OverHttp: p,
          Http2OverHttps: h
        },
        validateHeaderName: f,
        validateHeaderValue: g
      };
    }
  }), K0 = {};
  V1(K0, {
    default: /* @__PURE__ */ s(() => dk, "default")
  });
  sv.exports = Z1(K0);
  var d3 = require("http"), f3 = require("https"), Y0 = [
    "Int8Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Int16Array",
    "Uint16Array",
    "Int32Array",
    "Uint32Array",
    "Float32Array",
    "Float64Array",
    "BigInt64Array",
    "BigUint64Array"
  ];
  function h3(e) {
    return Y0.includes(e);
  }
  s(h3, "isTypedArrayName");
  var p3 = [
    "Function",
    "Generator",
    "AsyncGenerator",
    "GeneratorFunction",
    "AsyncGeneratorFunction",
    "AsyncFunction",
    "Observable",
    "Array",
    "Buffer",
    "Blob",
    "Object",
    "RegExp",
    "Date",
    "Error",
    "Map",
    "Set",
    "WeakMap",
    "WeakSet",
    "WeakRef",
    "ArrayBuffer",
    "SharedArrayBuffer",
    "DataView",
    "Promise",
    "URL",
    "FormData",
    "URLSearchParams",
    "HTMLElement",
    "NaN",
    ...Y0
  ];
  function D3(e) {
    return p3.includes(e);
  }
  s(D3, "isObjectTypeName");
  var m3 = [
    "null",
    "undefined",
    "string",
    "number",
    "bigint",
    "boolean",
    "symbol"
  ];
  function g3(e) {
    return m3.includes(e);
  }
  s(g3, "isPrimitiveTypeName");
  function Ti(e) {
    return (t) => typeof t === e;
  }
  s(Ti, "isOfType");
  var { toString: y3 } = Object.prototype, Hn = /* @__PURE__ */ s((e) => {
    let t = y3.call(e).slice(8, -1);
    if (/HTML\w+Element/.test(t) && D.domElement(e))
      return "HTMLElement";
    if (D3(t))
      return t;
  }, "getObjectType"), ne = /* @__PURE__ */ s((e) => (t) => Hn(t) === e, "isObjectOfType");
  function D(e) {
    if (e === null)
      return "null";
    switch (typeof e) {
      case "undefined":
        return "undefined";
      case "string":
        return "string";
      case "number":
        return Number.isNaN(e) ? "NaN" : "number";
      case "boolean":
        return "boolean";
      case "function":
        return "Function";
      case "bigint":
        return "bigint";
      case "symbol":
        return "symbol";
      default:
    }
    if (D.observable(e))
      return "Observable";
    if (D.array(e))
      return "Array";
    if (D.buffer(e))
      return "Buffer";
    let t = Hn(e);
    if (t)
      return t;
    if (e instanceof String || e instanceof Boolean || e instanceof Number)
      throw new TypeError("Please don't use object wrappers for primitive types");
    return "Object";
  }
  s(D, "is");
  D.undefined = Ti("undefined");
  D.string = Ti("string");
  var b3 = Ti("number");
  D.number = (e) => b3(e) && !D.nan(e);
  D.bigint = Ti("bigint");
  D.function_ = Ti("function");
  D.null_ = (e) => e === null;
  D.class_ = (e) => D.function_(e) && e.toString().startsWith("class ");
  D.boolean = (e) => e === !0 || e === !1;
  D.symbol = Ti("symbol");
  D.numericString = (e) => D.string(e) && !D.emptyStringOrWhitespace(e) && !Number.isNaN(Number(e));
  D.array = (e, t) => Array.isArray(e) ? D.function_(t) ? e.every((r) => t(r)) : !0 : !1;
  D.buffer = (e) => {
    var t, r;
    return ((r = (t = e?.constructor) == null ? void 0 : t.isBuffer) == null ? void 0 : r.call(t, e)) ?? !1;
  };
  D.blob = (e) => ne("Blob")(e);
  D.nullOrUndefined = (e) => D.null_(e) || D.undefined(e);
  D.object = (e) => !D.null_(e) && (typeof e == "object" || D.function_(e));
  D.iterable = (e) => D.function_(e?.[Symbol.iterator]);
  D.asyncIterable = (e) => D.function_(e?.[Symbol.asyncIterator]);
  D.generator = (e) => D.iterable(e) && D.function_(e?.next) && D.function_(e?.throw);
  D.asyncGenerator = (e) => D.asyncIterable(e) && D.function_(e.next) && D.function_(e.throw);
  D.nativePromise = (e) => ne("Promise")(e);
  var v3 = /* @__PURE__ */ s((e) => D.function_(e?.then) && D.function_(e?.catch), "hasPromiseApi");
  D.promise = (e) => D.nativePromise(e) || v3(e);
  D.generatorFunction = ne("GeneratorFunction");
  D.asyncGeneratorFunction = (e) => Hn(e) === "AsyncGeneratorFunction";
  D.asyncFunction = (e) => Hn(e) === "AsyncFunction";
  D.boundFunction = (e) => D.function_(e) && !e.hasOwnProperty("prototype");
  D.regExp = ne("RegExp");
  D.date = ne("Date");
  D.error = ne("Error");
  D.map = (e) => ne("Map")(e);
  D.set = (e) => ne("Set")(e);
  D.weakMap = (e) => ne("WeakMap")(e);
  D.weakSet = (e) => ne("WeakSet")(e);
  D.weakRef = (e) => ne("WeakRef")(e);
  D.int8Array = ne("Int8Array");
  D.uint8Array = ne("Uint8Array");
  D.uint8ClampedArray = ne("Uint8ClampedArray");
  D.int16Array = ne("Int16Array");
  D.uint16Array = ne("Uint16Array");
  D.int32Array = ne("Int32Array");
  D.uint32Array = ne("Uint32Array");
  D.float32Array = ne("Float32Array");
  D.float64Array = ne("Float64Array");
  D.bigInt64Array = ne("BigInt64Array");
  D.bigUint64Array = ne("BigUint64Array");
  D.arrayBuffer = ne("ArrayBuffer");
  D.sharedArrayBuffer = ne("SharedArrayBuffer");
  D.dataView = ne("DataView");
  D.enumCase = (e, t) => Object.values(t).includes(e);
  D.directInstanceOf = (e, t) => Object.getPrototypeOf(e) === t.prototype;
  D.urlInstance = (e) => ne("URL")(e);
  D.urlString = (e) => {
    if (!D.string(e))
      return !1;
    try {
      return new URL(e), !0;
    } catch {
      return !1;
    }
  };
  D.truthy = (e) => !!e;
  D.falsy = (e) => !e;
  D.nan = (e) => Number.isNaN(e);
  D.primitive = (e) => D.null_(e) || g3(typeof e);
  D.integer = (e) => Number.isInteger(e);
  D.safeInteger = (e) => Number.isSafeInteger(e);
  D.plainObject = (e) => {
    if (typeof e != "object" || e === null)
      return !1;
    let t = Object.getPrototypeOf(e);
    return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in
    e);
  };
  D.typedArray = (e) => h3(Hn(e));
  var _3 = /* @__PURE__ */ s((e) => D.safeInteger(e) && e >= 0, "isValidLength");
  D.arrayLike = (e) => !D.nullOrUndefined(e) && !D.function_(e) && _3(e.length);
  D.inRange = (e, t) => {
    if (D.number(t))
      return e >= Math.min(0, t) && e <= Math.max(t, 0);
    if (D.array(t) && t.length === 2)
      return e >= Math.min(...t) && e <= Math.max(...t);
    throw new TypeError(`Invalid range: ${JSON.stringify(t)}`);
  };
  var w3 = 1, E3 = [
    "innerHTML",
    "ownerDocument",
    "style",
    "attributes",
    "nodeValue"
  ];
  D.domElement = (e) => D.object(e) && e.nodeType === w3 && D.string(e.nodeName) && !D.plainObject(e) && E3.every((t) => t in e);
  D.observable = (e) => {
    var t, r;
    return e ? e === ((t = e[Symbol.observable]) == null ? void 0 : t.call(e)) || e === ((r = e["@@observable"]) == null ? void 0 : r.call(e)) :
    !1;
  };
  D.nodeStream = (e) => D.object(e) && D.function_(e.pipe) && !D.observable(e);
  D.infinite = (e) => e === Number.POSITIVE_INFINITY || e === Number.NEGATIVE_INFINITY;
  var J0 = /* @__PURE__ */ s((e) => (t) => D.integer(t) && Math.abs(t % 2) === e, "isAbsoluteMod2");
  D.evenInteger = J0(0);
  D.oddInteger = J0(1);
  D.emptyArray = (e) => D.array(e) && e.length === 0;
  D.nonEmptyArray = (e) => D.array(e) && e.length > 0;
  D.emptyString = (e) => D.string(e) && e.length === 0;
  var C3 = /* @__PURE__ */ s((e) => D.string(e) && !/\S/.test(e), "isWhiteSpaceString");
  D.emptyStringOrWhitespace = (e) => D.emptyString(e) || C3(e);
  D.nonEmptyString = (e) => D.string(e) && e.length > 0;
  D.nonEmptyStringAndNotWhitespace = (e) => D.string(e) && !D.emptyStringOrWhitespace(e);
  D.emptyObject = (e) => D.object(e) && !D.map(e) && !D.set(e) && Object.keys(e).length === 0;
  D.nonEmptyObject = (e) => D.object(e) && !D.map(e) && !D.set(e) && Object.keys(e).length > 0;
  D.emptySet = (e) => D.set(e) && e.size === 0;
  D.nonEmptySet = (e) => D.set(e) && e.size > 0;
  D.emptyMap = (e) => D.map(e) && e.size === 0;
  D.nonEmptyMap = (e) => D.map(e) && e.size > 0;
  D.propertyKey = (e) => D.any([D.string, D.number, D.symbol], e);
  D.formData = (e) => ne("FormData")(e);
  D.urlSearchParams = (e) => ne("URLSearchParams")(e);
  var X0 = /* @__PURE__ */ s((e, t, r) => {
    if (!D.function_(t))
      throw new TypeError(`Invalid predicate: ${JSON.stringify(t)}`);
    if (r.length === 0)
      throw new TypeError("Invalid number of values");
    return e.call(r, t);
  }, "predicateOnArray");
  D.any = (e, ...t) => (D.array(e) ? e : [e]).some((i) => X0(Array.prototype.some, i, t));
  D.all = (e, ...t) => X0(Array.prototype.every, e, t);
  var k = /* @__PURE__ */ s((e, t, r, i = {}) => {
    if (!e) {
      let { multipleValues: n } = i, o = n ? `received values of types ${[
        ...new Set(r.map((a) => `\`${D(a)}\``))
      ].join(", ")}` : `received value of type \`${D(r)}\``;
      throw new TypeError(`Expected value which is \`${t}\`, ${o}.`);
    }
  }, "assertType"), A = {
    // Unknowns.
    undefined: /* @__PURE__ */ s((e) => k(D.undefined(e), "undefined", e), "undefined"),
    string: /* @__PURE__ */ s((e) => k(D.string(e), "string", e), "string"),
    number: /* @__PURE__ */ s((e) => k(D.number(e), "number", e), "number"),
    bigint: /* @__PURE__ */ s((e) => k(D.bigint(e), "bigint", e), "bigint"),
    // eslint-disable-next-line @typescript-eslint/ban-types
    function_: /* @__PURE__ */ s((e) => k(D.function_(e), "Function", e), "function_"),
    null_: /* @__PURE__ */ s((e) => k(D.null_(e), "null", e), "null_"),
    class_: /* @__PURE__ */ s((e) => k(D.class_(e), "Class", e), "class_"),
    boolean: /* @__PURE__ */ s((e) => k(D.boolean(e), "boolean", e), "boolean"),
    symbol: /* @__PURE__ */ s((e) => k(D.symbol(e), "symbol", e), "symbol"),
    numericString: /* @__PURE__ */ s((e) => k(D.numericString(e), "string with a number", e), "numericString"),
    array: /* @__PURE__ */ s((e, t) => {
      k(D.array(e), "Array", e), t && e.forEach(t);
    }, "array"),
    buffer: /* @__PURE__ */ s((e) => k(D.buffer(e), "Buffer", e), "buffer"),
    blob: /* @__PURE__ */ s((e) => k(D.blob(e), "Blob", e), "blob"),
    nullOrUndefined: /* @__PURE__ */ s((e) => k(D.nullOrUndefined(e), "null or undefined", e), "nullOrUndefined"),
    object: /* @__PURE__ */ s((e) => k(D.object(e), "Object", e), "object"),
    iterable: /* @__PURE__ */ s((e) => k(D.iterable(e), "Iterable", e), "iterable"),
    asyncIterable: /* @__PURE__ */ s((e) => k(D.asyncIterable(e), "AsyncIterable", e), "asyncIterable"),
    generator: /* @__PURE__ */ s((e) => k(D.generator(e), "Generator", e), "generator"),
    asyncGenerator: /* @__PURE__ */ s((e) => k(D.asyncGenerator(e), "AsyncGenerator", e), "asyncGenerator"),
    nativePromise: /* @__PURE__ */ s((e) => k(D.nativePromise(e), "native Promise", e), "nativePromise"),
    promise: /* @__PURE__ */ s((e) => k(D.promise(e), "Promise", e), "promise"),
    generatorFunction: /* @__PURE__ */ s((e) => k(D.generatorFunction(e), "GeneratorFunction", e), "generatorFunction"),
    asyncGeneratorFunction: /* @__PURE__ */ s((e) => k(D.asyncGeneratorFunction(e), "AsyncGeneratorFunction", e), "asyncGeneratorFunction"),
    // eslint-disable-next-line @typescript-eslint/ban-types
    asyncFunction: /* @__PURE__ */ s((e) => k(D.asyncFunction(e), "AsyncFunction", e), "asyncFunction"),
    // eslint-disable-next-line @typescript-eslint/ban-types
    boundFunction: /* @__PURE__ */ s((e) => k(D.boundFunction(e), "Function", e), "boundFunction"),
    regExp: /* @__PURE__ */ s((e) => k(D.regExp(e), "RegExp", e), "regExp"),
    date: /* @__PURE__ */ s((e) => k(D.date(e), "Date", e), "date"),
    error: /* @__PURE__ */ s((e) => k(D.error(e), "Error", e), "error"),
    map: /* @__PURE__ */ s((e) => k(D.map(e), "Map", e), "map"),
    set: /* @__PURE__ */ s((e) => k(D.set(e), "Set", e), "set"),
    weakMap: /* @__PURE__ */ s((e) => k(D.weakMap(e), "WeakMap", e), "weakMap"),
    weakSet: /* @__PURE__ */ s((e) => k(D.weakSet(e), "WeakSet", e), "weakSet"),
    weakRef: /* @__PURE__ */ s((e) => k(D.weakRef(e), "WeakRef", e), "weakRef"),
    int8Array: /* @__PURE__ */ s((e) => k(D.int8Array(e), "Int8Array", e), "int8Array"),
    uint8Array: /* @__PURE__ */ s((e) => k(D.uint8Array(e), "Uint8Array", e), "uint8Array"),
    uint8ClampedArray: /* @__PURE__ */ s((e) => k(D.uint8ClampedArray(e), "Uint8ClampedArray", e), "uint8ClampedArray"),
    int16Array: /* @__PURE__ */ s((e) => k(D.int16Array(e), "Int16Array", e), "int16Array"),
    uint16Array: /* @__PURE__ */ s((e) => k(D.uint16Array(e), "Uint16Array", e), "uint16Array"),
    int32Array: /* @__PURE__ */ s((e) => k(D.int32Array(e), "Int32Array", e), "int32Array"),
    uint32Array: /* @__PURE__ */ s((e) => k(D.uint32Array(e), "Uint32Array", e), "uint32Array"),
    float32Array: /* @__PURE__ */ s((e) => k(D.float32Array(e), "Float32Array", e), "float32Array"),
    float64Array: /* @__PURE__ */ s((e) => k(D.float64Array(e), "Float64Array", e), "float64Array"),
    bigInt64Array: /* @__PURE__ */ s((e) => k(D.bigInt64Array(e), "BigInt64Array", e), "bigInt64Array"),
    bigUint64Array: /* @__PURE__ */ s((e) => k(D.bigUint64Array(e), "BigUint64Array", e), "bigUint64Array"),
    arrayBuffer: /* @__PURE__ */ s((e) => k(D.arrayBuffer(e), "ArrayBuffer", e), "arrayBuffer"),
    sharedArrayBuffer: /* @__PURE__ */ s((e) => k(D.sharedArrayBuffer(e), "SharedArrayBuffer", e), "sharedArrayBuffer"),
    dataView: /* @__PURE__ */ s((e) => k(D.dataView(e), "DataView", e), "dataView"),
    enumCase: /* @__PURE__ */ s((e, t) => k(D.enumCase(e, t), "EnumCase", e), "enumCase"),
    urlInstance: /* @__PURE__ */ s((e) => k(D.urlInstance(e), "URL", e), "urlInstance"),
    urlString: /* @__PURE__ */ s((e) => k(D.urlString(e), "string with a URL", e), "urlString"),
    truthy: /* @__PURE__ */ s((e) => k(D.truthy(e), "truthy", e), "truthy"),
    falsy: /* @__PURE__ */ s((e) => k(D.falsy(e), "falsy", e), "falsy"),
    nan: /* @__PURE__ */ s((e) => k(D.nan(e), "NaN", e), "nan"),
    primitive: /* @__PURE__ */ s((e) => k(D.primitive(e), "primitive", e), "primitive"),
    integer: /* @__PURE__ */ s((e) => k(D.integer(e), "integer", e), "integer"),
    safeInteger: /* @__PURE__ */ s((e) => k(D.safeInteger(e), "integer", e), "safeInteger"),
    plainObject: /* @__PURE__ */ s((e) => k(D.plainObject(e), "plain object", e), "plainObject"),
    typedArray: /* @__PURE__ */ s((e) => k(D.typedArray(e), "TypedArray", e), "typedArray"),
    arrayLike: /* @__PURE__ */ s((e) => k(D.arrayLike(e), "array-like", e), "arrayLike"),
    domElement: /* @__PURE__ */ s((e) => k(D.domElement(e), "HTMLElement", e), "domElement"),
    observable: /* @__PURE__ */ s((e) => k(D.observable(e), "Observable", e), "observable"),
    nodeStream: /* @__PURE__ */ s((e) => k(D.nodeStream(e), "Node.js Stream", e), "nodeStream"),
    infinite: /* @__PURE__ */ s((e) => k(D.infinite(e), "infinite number", e), "infinite"),
    emptyArray: /* @__PURE__ */ s((e) => k(D.emptyArray(e), "empty array", e), "emptyArray"),
    nonEmptyArray: /* @__PURE__ */ s((e) => k(D.nonEmptyArray(e), "non-empty array", e), "nonEmptyArray"),
    emptyString: /* @__PURE__ */ s((e) => k(D.emptyString(e), "empty string", e), "emptyString"),
    emptyStringOrWhitespace: /* @__PURE__ */ s((e) => k(D.emptyStringOrWhitespace(e), "empty string or whitespace", e), "emptyStringOrWhites\
pace"),
    nonEmptyString: /* @__PURE__ */ s((e) => k(D.nonEmptyString(e), "non-empty string", e), "nonEmptyString"),
    nonEmptyStringAndNotWhitespace: /* @__PURE__ */ s((e) => k(D.nonEmptyStringAndNotWhitespace(e), "non-empty string and not whitespace", e),
    "nonEmptyStringAndNotWhitespace"),
    emptyObject: /* @__PURE__ */ s((e) => k(D.emptyObject(e), "empty object", e), "emptyObject"),
    nonEmptyObject: /* @__PURE__ */ s((e) => k(D.nonEmptyObject(e), "non-empty object", e), "nonEmptyObject"),
    emptySet: /* @__PURE__ */ s((e) => k(D.emptySet(e), "empty set", e), "emptySet"),
    nonEmptySet: /* @__PURE__ */ s((e) => k(D.nonEmptySet(e), "non-empty set", e), "nonEmptySet"),
    emptyMap: /* @__PURE__ */ s((e) => k(D.emptyMap(e), "empty map", e), "emptyMap"),
    nonEmptyMap: /* @__PURE__ */ s((e) => k(D.nonEmptyMap(e), "non-empty map", e), "nonEmptyMap"),
    propertyKey: /* @__PURE__ */ s((e) => k(D.propertyKey(e), "PropertyKey", e), "propertyKey"),
    formData: /* @__PURE__ */ s((e) => k(D.formData(e), "FormData", e), "formData"),
    urlSearchParams: /* @__PURE__ */ s((e) => k(D.urlSearchParams(e), "URLSearchParams", e), "urlSearchParams"),
    // Numbers.
    evenInteger: /* @__PURE__ */ s((e) => k(D.evenInteger(e), "even integer", e), "evenInteger"),
    oddInteger: /* @__PURE__ */ s((e) => k(D.oddInteger(e), "odd integer", e), "oddInteger"),
    // Two arguments.
    directInstanceOf: /* @__PURE__ */ s((e, t) => k(D.directInstanceOf(e, t), "T", e), "directInstanceOf"),
    inRange: /* @__PURE__ */ s((e, t) => k(D.inRange(e, t), "in range", e), "inRange"),
    // Variadic functions.
    any: /* @__PURE__ */ s((e, ...t) => k(D.any(e, ...t), "predicate returns truthy for any value", t, { multipleValues: !0 }), "any"),
    all: /* @__PURE__ */ s((e, ...t) => k(D.all(e, ...t), "predicate returns truthy for all values", t, { multipleValues: !0 }), "all")
  };
  Object.defineProperties(D, {
    class: {
      value: D.class_
    },
    function: {
      value: D.function_
    },
    null: {
      value: D.null_
    }
  });
  Object.defineProperties(A, {
    class: {
      value: A.class_
    },
    function: {
      value: A.function_
    },
    null: {
      value: A.null_
    }
  });
  var m = D, x3 = require("events"), F3 = class extends Error {
    static {
      s(this, "CancelError");
    }
    constructor(e) {
      super(e || "Promise was canceled"), this.name = "CancelError";
    }
    get isCanceled() {
      return !0;
    }
  }, Hc = class {
    static {
      s(this, "PCancelable");
    }
    static fn(e) {
      return (...t) => new Hc((r, i, n) => {
        t.push(n), e(...t).then(r, i);
      });
    }
    constructor(e) {
      this._cancelHandlers = [], this._isPending = !0, this._isCanceled = !1, this._rejectOnCancel = !0, this._promise = new Promise((t, r) => {
        this._reject = r;
        let i = /* @__PURE__ */ s((a) => {
          (!this._isCanceled || !o.shouldReject) && (this._isPending = !1, t(a));
        }, "onResolve"), n = /* @__PURE__ */ s((a) => {
          this._isPending = !1, r(a);
        }, "onReject"), o = /* @__PURE__ */ s((a) => {
          if (!this._isPending)
            throw new Error("The `onCancel` handler was attached after the promise settled.");
          this._cancelHandlers.push(a);
        }, "onCancel");
        Object.defineProperties(o, {
          shouldReject: {
            get: /* @__PURE__ */ s(() => this._rejectOnCancel, "get"),
            set: /* @__PURE__ */ s((a) => {
              this._rejectOnCancel = a;
            }, "set")
          }
        }), e(i, n, o);
      });
    }
    then(e, t) {
      return this._promise.then(e, t);
    }
    catch(e) {
      return this._promise.catch(e);
    }
    finally(e) {
      return this._promise.finally(e);
    }
    cancel(e) {
      if (!(!this._isPending || this._isCanceled)) {
        if (this._isCanceled = !0, this._cancelHandlers.length > 0)
          try {
            for (let t of this._cancelHandlers)
              t();
          } catch (t) {
            this._reject(t);
            return;
          }
        this._rejectOnCancel && this._reject(new F3(e));
      }
    }
    get isCanceled() {
      return this._isCanceled;
    }
  };
  Object.setPrototypeOf(Hc.prototype, Promise.prototype);
  function S3(e) {
    return m.object(e) && "_onResponse" in e;
  }
  s(S3, "isRequest");
  var Te = class extends Error {
    static {
      s(this, "RequestError");
    }
    constructor(e, t, r) {
      var i;
      if (super(e), Object.defineProperty(this, "input", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "code", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "stack", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "response", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "request", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "timings", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Error.captureStackTrace(this, this.constructor), this.name = "RequestError", this.code = t.code ?? "ERR_GOT_REQUEST_ERROR", this.input =
      t.input, S3(r) ? (Object.defineProperty(this, "request", {
        enumerable: !1,
        value: r
      }), Object.defineProperty(this, "response", {
        enumerable: !1,
        value: r.response
      }), this.options = r.options) : this.options = r, this.timings = (i = this.request) == null ? void 0 : i.timings, m.string(t.stack) &&
      m.string(this.stack)) {
        let n = this.stack.indexOf(this.message) + this.message.length, o = this.stack.slice(n).split(`
`).reverse(), a = t.stack.slice(t.stack.indexOf(t.message) + t.message.length).split(`
`).reverse();
        for (; a.length > 0 && a[0] === o[0]; )
          o.shift();
        this.stack = `${this.stack.slice(0, n)}${o.reverse().join(`
`)}${a.reverse().join(`
`)}`;
      }
    }
  }, T3 = class extends Te {
    static {
      s(this, "MaxRedirectsError");
    }
    constructor(e) {
      super(`Redirected ${e.options.maxRedirects} times. Aborting.`, {}, e), this.name = "MaxRedirectsError", this.code = "ERR_TOO_MANY_REDI\
RECTS";
    }
  }, Ko = class extends Te {
    static {
      s(this, "HTTPError");
    }
    constructor(e) {
      super(`Response code ${e.statusCode} (${e.statusMessage})`, {}, e.request), this.name = "HTTPError", this.code = "ERR_NON_2XX_3XX_RESP\
ONSE";
    }
  }, A3 = class extends Te {
    static {
      s(this, "CacheError");
    }
    constructor(e, t) {
      super(e.message, e, t), this.name = "CacheError", this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_CACHE_ACCESS" : this.code;
    }
  }, f0 = class extends Te {
    static {
      s(this, "UploadError");
    }
    constructor(e, t) {
      super(e.message, e, t), this.name = "UploadError", this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_UPLOAD" : this.code;
    }
  }, R3 = class extends Te {
    static {
      s(this, "TimeoutError");
    }
    constructor(e, t, r) {
      super(e.message, e, r), Object.defineProperty(this, "timings", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "event", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), this.name = "TimeoutError", this.event = e.event, this.timings = t;
    }
  }, h0 = class extends Te {
    static {
      s(this, "ReadError");
    }
    constructor(e, t) {
      super(e.message, e, t), this.name = "ReadError", this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_READING_RESPONSE_STREAM" : this.
      code;
    }
  }, k3 = class extends Te {
    static {
      s(this, "RetryError");
    }
    constructor(e) {
      super("Retrying", {}, e), this.name = "RetryError", this.code = "ERR_RETRYING";
    }
  }, O3 = class extends Te {
    static {
      s(this, "AbortError");
    }
    constructor(e) {
      super("This operation was aborted.", {}, e), this.code = "ERR_ABORTED", this.name = "AbortError";
    }
  }, Q0 = Fe(require("process"), 1), Oc = require("buffer"), B3 = require("stream"), p0 = require("url"), Bc = Fe(require("http"), 1), P3 = require("events"),
  I3 = require("util"), M3 = Fe(z1(), 1), j3 = /* @__PURE__ */ s((e) => {
    if (e.timings)
      return e.timings;
    let t = {
      start: Date.now(),
      socket: void 0,
      lookup: void 0,
      connect: void 0,
      secureConnect: void 0,
      upload: void 0,
      response: void 0,
      end: void 0,
      error: void 0,
      abort: void 0,
      phases: {
        wait: void 0,
        dns: void 0,
        tcp: void 0,
        tls: void 0,
        request: void 0,
        firstByte: void 0,
        download: void 0,
        total: void 0
      }
    };
    e.timings = t;
    let r = /* @__PURE__ */ s((a) => {
      a.once(P3.errorMonitor, () => {
        t.error = Date.now(), t.phases.total = t.error - t.start;
      });
    }, "handleError");
    r(e);
    let i = /* @__PURE__ */ s(() => {
      t.abort = Date.now(), t.phases.total = t.abort - t.start;
    }, "onAbort");
    e.prependOnceListener("abort", i);
    let n = /* @__PURE__ */ s((a) => {
      if (t.socket = Date.now(), t.phases.wait = t.socket - t.start, I3.types.isProxy(a))
        return;
      let u = /* @__PURE__ */ s(() => {
        t.lookup = Date.now(), t.phases.dns = t.lookup - t.socket;
      }, "lookupListener");
      a.prependOnceListener("lookup", u), (0, M3.default)(a, {
        connect: /* @__PURE__ */ s(() => {
          t.connect = Date.now(), t.lookup === void 0 && (a.removeListener("lookup", u), t.lookup = t.connect, t.phases.dns = t.lookup - t.socket),
          t.phases.tcp = t.connect - t.lookup;
        }, "connect"),
        secureConnect: /* @__PURE__ */ s(() => {
          t.secureConnect = Date.now(), t.phases.tls = t.secureConnect - t.connect;
        }, "secureConnect")
      });
    }, "onSocket");
    e.socket ? n(e.socket) : e.prependOnceListener("socket", n);
    let o = /* @__PURE__ */ s(() => {
      t.upload = Date.now(), t.phases.request = t.upload - (t.secureConnect ?? t.connect);
    }, "onUpload");
    return e.writableFinished ? o() : e.prependOnceListener("finish", o), e.prependOnceListener("response", (a) => {
      t.response = Date.now(), t.phases.firstByte = t.response - t.upload, a.timings = t, r(a), a.prependOnceListener("end", () => {
        e.off("abort", i), a.off("aborted", i), !t.phases.total && (t.end = Date.now(), t.phases.download = t.end - t.response, t.phases.total =
        t.end - t.start);
      }), a.prependOnceListener("aborted", i);
    }), t;
  }, "timer"), q3 = j3, L3 = Fe(require("events"), 1), Uo = Fe(require("url"), 1), N3 = Fe(require("crypto"), 1), ev = Fe(require("stream"),
  1), U3 = "text/plain", $3 = "us-ascii", Pc = /* @__PURE__ */ s((e, t) => t.some((r) => r instanceof RegExp ? r.test(e) : r === e), "testPa\
rameter"), W3 = /* @__PURE__ */ new Set([
    "https:",
    "http:",
    "file:"
  ]), H3 = /* @__PURE__ */ s((e) => {
    try {
      let { protocol: t } = new URL(e);
      return t.endsWith(":") && !W3.has(t);
    } catch {
      return !1;
    }
  }, "hasCustomProtocol"), V3 = /* @__PURE__ */ s((e, { stripHash: t }) => {
    var r;
    let i = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(e);
    if (!i)
      throw new Error(`Invalid URL: ${e}`);
    let { type: n, data: o, hash: a } = i.groups, u = n.split(";");
    a = t ? "" : a;
    let l = !1;
    u[u.length - 1] === "base64" && (u.pop(), l = !0);
    let c = ((r = u.shift()) == null ? void 0 : r.toLowerCase()) ?? "", p = [
      ...u.map((h) => {
        let [f, g = ""] = h.split("=").map((E) => E.trim());
        return f === "charset" && (g = g.toLowerCase(), g === $3) ? "" : `${f}${g ? `=${g}` : ""}`;
      }).filter(Boolean)
    ];
    return l && p.push("base64"), (p.length > 0 || c && c !== U3) && p.unshift(c), `data:${p.join(";")},${l ? o.trim() : o}${a ? `#${a}` : ""}`;
  }, "normalizeDataURL");
  function Z3(e, t) {
    if (t = {
      defaultProtocol: "http",
      normalizeProtocol: !0,
      forceHttp: !1,
      forceHttps: !1,
      stripAuthentication: !0,
      stripHash: !1,
      stripTextFragment: !0,
      stripWWW: !0,
      removeQueryParameters: [/^utm_\w+/i],
      removeTrailingSlash: !0,
      removeSingleSlash: !0,
      removeDirectoryIndex: !1,
      removeExplicitPort: !1,
      sortQueryParameters: !0,
      ...t
    }, typeof t.defaultProtocol == "string" && !t.defaultProtocol.endsWith(":") && (t.defaultProtocol = `${t.defaultProtocol}:`), e = e.trim(),
    /^data:/i.test(e))
      return V3(e, t);
    if (H3(e))
      return e;
    let r = e.startsWith("//");
    !r && /^\.*\//.test(e) || (e = e.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, t.defaultProtocol));
    let n = new URL(e);
    if (t.forceHttp && t.forceHttps)
      throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
    if (t.forceHttp && n.protocol === "https:" && (n.protocol = "http:"), t.forceHttps && n.protocol === "http:" && (n.protocol = "https:"),
    t.stripAuthentication && (n.username = "", n.password = ""), t.stripHash ? n.hash = "" : t.stripTextFragment && (n.hash = n.hash.replace(
    /#?:~:text.*?$/i, "")), n.pathname) {
      let a = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g, u = 0, l = "";
      for (; ; ) {
        let d = a.exec(n.pathname);
        if (!d)
          break;
        let p = d[0], h = d.index, f = n.pathname.slice(u, h);
        l += f.replace(/\/{2,}/g, "/"), l += p, u = h + p.length;
      }
      let c = n.pathname.slice(u, n.pathname.length);
      l += c.replace(/\/{2,}/g, "/"), n.pathname = l;
    }
    if (n.pathname)
      try {
        n.pathname = decodeURI(n.pathname);
      } catch {
      }
    if (t.removeDirectoryIndex === !0 && (t.removeDirectoryIndex = [/^index\.[a-z]+$/]), Array.isArray(t.removeDirectoryIndex) && t.removeDirectoryIndex.
    length > 0) {
      let a = n.pathname.split("/"), u = a[a.length - 1];
      Pc(u, t.removeDirectoryIndex) && (a = a.slice(0, -1), n.pathname = a.slice(1).join("/") + "/");
    }
    if (n.hostname && (n.hostname = n.hostname.replace(/\.$/, ""), t.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(n.
    hostname) && (n.hostname = n.hostname.replace(/^www\./, ""))), Array.isArray(t.removeQueryParameters))
      for (let a of [...n.searchParams.keys()])
        Pc(a, t.removeQueryParameters) && n.searchParams.delete(a);
    if (!Array.isArray(t.keepQueryParameters) && t.removeQueryParameters === !0 && (n.search = ""), Array.isArray(t.keepQueryParameters) && t.
    keepQueryParameters.length > 0)
      for (let a of [...n.searchParams.keys()])
        Pc(a, t.keepQueryParameters) || n.searchParams.delete(a);
    if (t.sortQueryParameters) {
      n.searchParams.sort();
      try {
        n.search = decodeURIComponent(n.search);
      } catch {
      }
    }
    t.removeTrailingSlash && (n.pathname = n.pathname.replace(/\/$/, "")), t.removeExplicitPort && n.port && (n.port = "");
    let o = e;
    return e = n.toString(), !t.removeSingleSlash && n.pathname === "/" && !o.endsWith("/") && n.hash === "" && (e = e.replace(/\/$/, "")), (t.
    removeTrailingSlash || n.pathname === "/") && n.hash === "" && t.removeSingleSlash && (e = e.replace(/\/$/, "")), r && !t.normalizeProtocol &&
    (e = e.replace(/^http:\/\//, "//")), t.stripProtocol && (e = e.replace(/^(?:https?:)?\/\//, "")), e;
  }
  s(Z3, "normalizeUrl");
  var z3 = Fe(q0(), 1), Ic = Fe(K1(), 1), G3 = require("stream");
  function $c(e) {
    return Object.fromEntries(Object.entries(e).map(([t, r]) => [t.toLowerCase(), r]));
  }
  s($c, "lowercaseKeys");
  var D0 = class extends G3.Readable {
    static {
      s(this, "Response");
    }
    statusCode;
    headers;
    body;
    url;
    constructor({ statusCode: e, headers: t, body: r, url: i }) {
      if (typeof e != "number")
        throw new TypeError("Argument `statusCode` should be a number");
      if (typeof t != "object")
        throw new TypeError("Argument `headers` should be an object");
      if (!(r instanceof Uint8Array))
        throw new TypeError("Argument `body` should be a buffer");
      if (typeof i != "string")
        throw new TypeError("Argument `url` should be a string");
      super({
        read() {
          this.push(r), this.push(null);
        }
      }), this.statusCode = e, this.headers = $c(t), this.body = r, this.url = i;
    }
  }, $o = Fe(J1(), 1), K3 = [
    "aborted",
    "complete",
    "headers",
    "httpVersion",
    "httpVersionMinor",
    "httpVersionMajor",
    "method",
    "rawHeaders",
    "rawTrailers",
    "setTimeout",
    "socket",
    "statusCode",
    "statusMessage",
    "trailers",
    "url"
  ];
  function Y3(e, t) {
    if (t._readableState.autoDestroy)
      throw new Error("The second stream must have the `autoDestroy` option set to `false`");
    let r = /* @__PURE__ */ new Set([...Object.keys(e), ...K3]), i = {};
    for (let n of r)
      n in t || (i[n] = {
        get() {
          let o = e[n];
          return typeof o == "function" ? o.bind(e) : o;
        },
        set(o) {
          e[n] = o;
        },
        enumerable: !0,
        configurable: !1
      });
    return Object.defineProperties(t, i), e.once("aborted", () => {
      t.destroy(), t.emit("aborted");
    }), e.once("close", () => {
      e.complete && t.readable ? t.once("end", () => {
        t.emit("close");
      }) : t.emit("close");
    }), t;
  }
  s(Y3, "mimicResponse");
  var J3 = class extends Error {
    static {
      s(this, "RequestError2");
    }
    constructor(e) {
      super(e.message), Object.assign(this, e);
    }
  }, Wn = class extends Error {
    static {
      s(this, "CacheError2");
    }
    constructor(e) {
      super(e.message), Object.assign(this, e);
    }
  }, X3 = class {
    static {
      s(this, "CacheableRequest");
    }
    constructor(e, t) {
      this.hooks = /* @__PURE__ */ new Map(), this.request = () => (r, i) => {
        let n;
        if (typeof r == "string")
          n = Mc(Uo.default.parse(r)), r = {};
        else if (r instanceof Uo.default.URL)
          n = Mc(Uo.default.parse(r.toString())), r = {};
        else {
          let [p, ...h] = (r.path ?? "").split("?"), f = h.length > 0 ? `?${h.join("?")}` : "";
          n = Mc({ ...r, pathname: p, search: f });
        }
        r = {
          headers: {},
          method: "GET",
          cache: !0,
          strictTtl: !1,
          automaticFailover: !1,
          ...r,
          ...tR(n)
        }, r.headers = Object.fromEntries(Q3(r.headers).map(([p, h]) => [p.toLowerCase(), h]));
        let o = new L3.default(), a = Z3(Uo.default.format(n), {
          stripWWW: !1,
          removeTrailingSlash: !1,
          stripAuthentication: !1
        }), u = `${r.method}:${a}`;
        r.body && r.method !== void 0 && ["POST", "PATCH", "PUT"].includes(r.method) && (r.body instanceof ev.default.Readable ? r.cache = !1 :
        u += `:${N3.default.createHash("md5").update(r.body).digest("hex")}`);
        let l = !1, c = !1, d = /* @__PURE__ */ s((p) => {
          c = !0;
          let h = !1, f = /* @__PURE__ */ s(() => {
          }, "requestErrorCallback"), g = new Promise((_) => {
            f = /* @__PURE__ */ s(() => {
              h || (h = !0, _());
            }, "requestErrorCallback");
          }), E = /* @__PURE__ */ s(async (_) => {
            if (l) {
              _.status = _.statusCode;
              let x = Ic.default.fromObject(l.cachePolicy).revalidatedPolicy(p, _);
              if (!x.modified) {
                _.resume(), await new Promise((T) => {
                  _.once("end", T);
                });
                let w = m0(x.policy.responseHeaders());
                _ = new D0({ statusCode: l.statusCode, headers: w, body: l.body, url: l.url }), _.cachePolicy = x.policy, _.fromCache = !0;
              }
            }
            _.fromCache || (_.cachePolicy = new Ic.default(p, _, p), _.fromCache = !1);
            let C;
            p.cache && _.cachePolicy.storable() ? (C = eR(_), (async () => {
              try {
                let x = z3.default.buffer(_);
                await Promise.race([
                  g,
                  new Promise((F) => _.once("end", F)),
                  new Promise((F) => _.once("close", F))
                  // eslint-disable-line no-promise-executor-return
                ]);
                let w = await x, T = {
                  url: _.url,
                  statusCode: _.fromCache ? l.statusCode : _.statusCode,
                  body: w,
                  cachePolicy: _.cachePolicy.toObject()
                }, S = p.strictTtl ? _.cachePolicy.timeToLive() : void 0;
                if (p.maxTtl && (S = S ? Math.min(S, p.maxTtl) : p.maxTtl), this.hooks.size > 0)
                  for (let F of this.hooks.keys())
                    T = await this.runHook(F, T, _);
                await this.cache.set(u, T, S);
              } catch (x) {
                o.emit("error", new Wn(x));
              }
            })()) : p.cache && l && (async () => {
              try {
                await this.cache.delete(u);
              } catch (x) {
                o.emit("error", new Wn(x));
              }
            })(), o.emit("response", C ?? _), typeof i == "function" && i(C ?? _);
          }, "handler");
          try {
            let _ = this.cacheRequest(p, E);
            _.once("error", f), _.once("abort", f), _.once("destroy", f), o.emit("request", _);
          } catch (_) {
            o.emit("error", new J3(_));
          }
        }, "makeRequest");
        return (async () => {
          let p = /* @__PURE__ */ s(async (f) => {
            await Promise.resolve();
            let g = f.cache ? await this.cache.get(u) : void 0;
            if (typeof g > "u" && !f.forceRefresh) {
              d(f);
              return;
            }
            let E = Ic.default.fromObject(g.cachePolicy);
            if (E.satisfiesWithoutRevalidation(f) && !f.forceRefresh) {
              let _ = m0(E.responseHeaders()), C = new D0({ statusCode: g.statusCode, headers: _, body: g.body, url: g.url });
              C.cachePolicy = E, C.fromCache = !0, o.emit("response", C), typeof i == "function" && i(C);
            } else E.satisfiesWithoutRevalidation(f) && Date.now() >= E.timeToLive() && f.forceRefresh ? (await this.cache.delete(u), f.headers =
            E.revalidationHeaders(f), d(f)) : (l = g, f.headers = E.revalidationHeaders(f), d(f));
          }, "get"), h = /* @__PURE__ */ s((f) => o.emit("error", new Wn(f)), "errorHandler");
          if (this.cache instanceof $o.default) {
            let f = this.cache;
            f.once("error", h), o.on("error", () => f.removeListener("error", h)), o.on("response", () => f.removeListener("error", h));
          }
          try {
            await p(r);
          } catch (f) {
            r.automaticFailover && !c && d(r), o.emit("error", new Wn(f));
          }
        })(), o;
      }, this.addHook = (r, i) => {
        this.hooks.has(r) || this.hooks.set(r, i);
      }, this.removeHook = (r) => this.hooks.delete(r), this.getHook = (r) => this.hooks.get(r), this.runHook = async (r, ...i) => {
        var n;
        return (n = this.hooks.get(r)) == null ? void 0 : n(...i);
      }, t instanceof $o.default ? this.cache = t : typeof t == "string" ? this.cache = new $o.default({
        uri: t,
        namespace: "cacheable-request"
      }) : this.cache = new $o.default({
        store: t,
        namespace: "cacheable-request"
      }), this.request = this.request.bind(this), this.cacheRequest = e;
    }
  }, Q3 = Object.entries, eR = /* @__PURE__ */ s((e) => {
    let t = new ev.PassThrough({ autoDestroy: !1 });
    return Y3(e, t), e.pipe(t);
  }, "cloneResponse"), tR = /* @__PURE__ */ s((e) => {
    let t = { ...e };
    return t.path = `${e.pathname || "/"}${e.search || ""}`, delete t.pathname, delete t.search, t;
  }, "urlObjectToRequestOptions"), Mc = /* @__PURE__ */ s((e) => (
    // If url was parsed by url.parse or new URL:
    // - hostname will be set
    // - host will be hostname[:port]
    // - port will be set if it was explicit in the parsed string
    // Otherwise, url was from request options:
    // - hostname or host may be set
    // - host shall not have port encoded
    {
      protocol: e.protocol,
      auth: e.auth,
      hostname: e.hostname || e.host || "localhost",
      port: e.port,
      pathname: e.pathname,
      search: e.search
    }
  ), "normalizeUrlObject"), m0 = /* @__PURE__ */ s((e) => {
    let t = [];
    for (let r of Object.keys(e))
      t[r.toLowerCase()] = e[r];
    return t;
  }, "convertHeaders"), rR = X3, iR = Fe(Q1(), 1), nR = Fe(q0(), 1), Nt = /* @__PURE__ */ s((e) => typeof e == "function", "isFunction"), sR = /* @__PURE__ */ s(
  (e) => Nt(e[Symbol.asyncIterator]), "isAsyncIterable");
  async function* oR(e) {
    let t = e.getReader();
    for (; ; ) {
      let { done: r, value: i } = await t.read();
      if (r)
        break;
      yield i;
    }
  }
  s(oR, "readStream");
  var aR = /* @__PURE__ */ s((e) => {
    if (sR(e))
      return e;
    if (Nt(e.getReader))
      return oR(e);
    throw new TypeError("Unsupported data source: Expected either ReadableStream or async iterable.");
  }, "getStreamIterator"), g0 = "abcdefghijklmnopqrstuvwxyz0123456789";
  function uR() {
    let e = 16, t = "";
    for (; e--; )
      t += g0[Math.random() * g0.length << 0];
    return t;
  }
  s(uR, "createBoundary");
  var y0 = /* @__PURE__ */ s((e) => String(e).replace(/\r|\n/g, (t, r, i) => t === "\r" && i[r + 1] !== `
` || t === `
` && i[r - 1] !== "\r" ? `\r
` : t), "normalizeValue"), lR = /* @__PURE__ */ s((e) => Object.prototype.toString.call(e).slice(8, -1).toLowerCase(), "getType");
  function b0(e) {
    if (lR(e) !== "object")
      return !1;
    let t = Object.getPrototypeOf(e);
    return t == null ? !0 : (t.constructor && t.constructor.toString()) === Object.toString();
  }
  s(b0, "isPlainObject");
  function v0(e, t) {
    if (typeof t == "string") {
      for (let [r, i] of Object.entries(e))
        if (t.toLowerCase() === r.toLowerCase())
          return i;
    }
  }
  s(v0, "getProperty");
  var cR = /* @__PURE__ */ s((e) => new Proxy(e, {
    get: /* @__PURE__ */ s((t, r) => v0(t, r), "get"),
    has: /* @__PURE__ */ s((t, r) => v0(t, r) !== void 0, "has")
  }), "proxyHeaders"), Vc = /* @__PURE__ */ s((e) => !!(e && Nt(e.constructor) && e[Symbol.toStringTag] === "FormData" && Nt(e.append) && Nt(
  e.getAll) && Nt(e.entries) && Nt(e[Symbol.iterator])), "isFormData"), _0 = /* @__PURE__ */ s((e) => String(e).replace(/\r/g, "%0D").replace(
  /\n/g, "%0A").replace(/"/g, "%22"), "escapeName"), Er = /* @__PURE__ */ s((e) => !!(e && typeof e == "object" && Nt(e.constructor) && e[Symbol.
  toStringTag] === "File" && Nt(e.stream) && e.name != null), "isFile"), jn = /* @__PURE__ */ s(function(e, t, r, i, n) {
    if (i === "m")
      throw new TypeError("Private method is not writable");
    if (i === "a" && !n)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof t == "function" ? e !== t || !n : !t.has(e))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return i === "a" ? n.call(e, r) : n ? n.value = r : t.set(e, r), r;
  }, "__classPrivateFieldSet"), he = /* @__PURE__ */ s(function(e, t, r, i) {
    if (r === "a" && !i)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof t == "function" ? e !== t || !i : !t.has(e))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return r === "m" ? i : r === "a" ? i.call(e) : i ? i.value : t.get(e);
  }, "__classPrivateFieldGet"), qn, rr, Ln, Wo, Nn, Cr, Un, $n, Ho, jc, w0, dR = {
    enableAdditionalHeaders: !1
  }, Vo = { writable: !1, configurable: !1 }, fR = class {
    static {
      s(this, "FormDataEncoder");
    }
    constructor(e, t, r) {
      if (qn.add(this), rr.set(this, `\r
`), Ln.set(this, void 0), Wo.set(this, void 0), Nn.set(this, "-".repeat(2)), Cr.set(this, new TextEncoder()), Un.set(this, void 0), $n.set(this,
      void 0), Ho.set(this, void 0), !Vc(e))
        throw new TypeError("Expected first argument to be a FormData instance.");
      let i;
      if (b0(t) ? r = t : i = t, i || (i = uR()), typeof i != "string")
        throw new TypeError("Expected boundary argument to be a string.");
      if (r && !b0(r))
        throw new TypeError("Expected options argument to be an object.");
      jn(this, $n, Array.from(e.entries()), "f"), jn(this, Ho, { ...dR, ...r }, "f"), jn(this, Ln, he(this, Cr, "f").encode(he(this, rr, "f")),
      "f"), jn(this, Wo, he(this, Ln, "f").byteLength, "f"), this.boundary = `form-data-boundary-${i}`, this.contentType = `multipart/form-d\
ata; boundary=${this.boundary}`, jn(this, Un, he(this, Cr, "f").encode(`${he(this, Nn, "f")}${this.boundary}${he(this, Nn, "f")}${he(this, rr,
      "f").repeat(2)}`), "f");
      let n = {
        "Content-Type": this.contentType
      }, o = he(this, qn, "m", w0).call(this);
      o && (this.contentLength = o, n["Content-Length"] = o), this.headers = cR(Object.freeze(n)), Object.defineProperties(this, {
        boundary: Vo,
        contentType: Vo,
        contentLength: Vo,
        headers: Vo
      });
    }
    getContentLength() {
      return this.contentLength == null ? void 0 : Number(this.contentLength);
    }
    *values() {
      for (let [e, t] of he(this, $n, "f")) {
        let r = Er(t) ? t : he(this, Cr, "f").encode(y0(t));
        yield he(this, qn, "m", jc).call(this, e, r), yield r, yield he(this, Ln, "f");
      }
      yield he(this, Un, "f");
    }
    async *encode() {
      for (let e of this.values())
        Er(e) ? yield* aR(e.stream()) : yield e;
    }
    [(rr = /* @__PURE__ */ new WeakMap(), Ln = /* @__PURE__ */ new WeakMap(), Wo = /* @__PURE__ */ new WeakMap(), Nn = /* @__PURE__ */ new WeakMap(),
    Cr = /* @__PURE__ */ new WeakMap(), Un = /* @__PURE__ */ new WeakMap(), $n = /* @__PURE__ */ new WeakMap(), Ho = /* @__PURE__ */ new WeakMap(),
    qn = /* @__PURE__ */ new WeakSet(), jc = /* @__PURE__ */ s(function(t, r) {
      let i = "";
      i += `${he(this, Nn, "f")}${this.boundary}${he(this, rr, "f")}`, i += `Content-Disposition: form-data; name="${_0(t)}"`, Er(r) && (i +=
      `; filename="${_0(r.name)}"${he(this, rr, "f")}`, i += `Content-Type: ${r.type || "application/octet-stream"}`);
      let n = Er(r) ? r.size : r.byteLength;
      return he(this, Ho, "f").enableAdditionalHeaders === !0 && n != null && !isNaN(n) && (i += `${he(this, rr, "f")}Content-Length: ${Er(r) ?
      r.size : r.byteLength}`), he(this, Cr, "f").encode(`${i}${he(this, rr, "f").repeat(2)}`);
    }, "_FormDataEncoder_getFieldHeader2"), w0 = /* @__PURE__ */ s(function() {
      let t = 0;
      for (let [r, i] of he(this, $n, "f")) {
        let n = Er(i) ? i : he(this, Cr, "f").encode(y0(i)), o = Er(n) ? n.size : n.byteLength;
        if (o == null || isNaN(o))
          return;
        t += he(this, qn, "m", jc).call(this, r, n).byteLength, t += o, t += he(this, Wo, "f");
      }
      return String(t + he(this, Un, "f").byteLength);
    }, "_FormDataEncoder_getContentLength2"), Symbol.iterator)]() {
      return this.values();
    }
    [Symbol.asyncIterator]() {
      return this.encode();
    }
  }, hR = require("buffer"), pR = require("util");
  function tv(e) {
    return m.nodeStream(e) && m.function_(e.getBoundary);
  }
  s(tv, "isFormData2");
  async function DR(e, t) {
    if (t && "content-length" in t)
      return Number(t["content-length"]);
    if (!e)
      return 0;
    if (m.string(e))
      return hR.Buffer.byteLength(e);
    if (m.buffer(e))
      return e.length;
    if (tv(e))
      return (0, pR.promisify)(e.getLength.bind(e))();
  }
  s(DR, "getBodySize");
  function rv(e, t, r) {
    let i = {};
    for (let n of r) {
      let o = /* @__PURE__ */ s((...a) => {
        t.emit(n, ...a);
      }, "eventFunction");
      i[n] = o, e.on(n, o);
    }
    return () => {
      for (let [n, o] of Object.entries(i))
        e.off(n, o);
    };
  }
  s(rv, "proxyEvents");
  var mR = Fe(require("net"), 1);
  function gR() {
    let e = [];
    return {
      once(t, r, i) {
        t.once(r, i), e.push({ origin: t, event: r, fn: i });
      },
      unhandleAll() {
        for (let t of e) {
          let { origin: r, event: i, fn: n } = t;
          r.removeListener(i, n);
        }
        e.length = 0;
      }
    };
  }
  s(gR, "unhandle");
  var E0 = Symbol("reentry"), yR = /* @__PURE__ */ s(() => {
  }, "noop"), iv = class extends Error {
    static {
      s(this, "TimeoutError2");
    }
    constructor(e, t) {
      super(`Timeout awaiting '${t}' for ${e}ms`), Object.defineProperty(this, "event", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: t
      }), Object.defineProperty(this, "code", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), this.name = "TimeoutError", this.code = "ETIMEDOUT";
    }
  };
  function bR(e, t, r) {
    if (E0 in e)
      return yR;
    e[E0] = !0;
    let i = [], { once: n, unhandleAll: o } = gR(), a = /* @__PURE__ */ s((E, _, C) => {
      var x;
      let w = setTimeout(_, E, E, C);
      (x = w.unref) == null || x.call(w);
      let T = /* @__PURE__ */ s(() => {
        clearTimeout(w);
      }, "cancel");
      return i.push(T), T;
    }, "addTimeout"), { host: u, hostname: l } = r, c = /* @__PURE__ */ s((E, _) => {
      e.destroy(new iv(E, _));
    }, "timeoutHandler"), d = /* @__PURE__ */ s(() => {
      for (let E of i)
        E();
      o();
    }, "cancelTimeouts");
    if (e.once("error", (E) => {
      if (d(), e.listenerCount("error") === 0)
        throw E;
    }), typeof t.request < "u") {
      let E = a(t.request, c, "request");
      n(e, "response", (_) => {
        n(_, "end", E);
      });
    }
    if (typeof t.socket < "u") {
      let { socket: E } = t, _ = /* @__PURE__ */ s(() => {
        c(E, "socket");
      }, "socketTimeoutHandler");
      e.setTimeout(E, _), i.push(() => {
        e.removeListener("timeout", _);
      });
    }
    let p = typeof t.lookup < "u", h = typeof t.connect < "u", f = typeof t.secureConnect < "u", g = typeof t.send < "u";
    return (p || h || f || g) && n(e, "socket", (E) => {
      let { socketPath: _ } = e;
      if (E.connecting) {
        let C = !!(_ ?? mR.default.isIP(l ?? u ?? "") !== 0);
        if (p && !C && typeof E.address().address > "u") {
          let x = a(t.lookup, c, "lookup");
          n(E, "lookup", x);
        }
        if (h) {
          let x = /* @__PURE__ */ s(() => a(t.connect, c, "connect"), "timeConnect");
          C ? n(E, "connect", x()) : n(E, "lookup", (w) => {
            w === null && n(E, "connect", x());
          });
        }
        f && r.protocol === "https:" && n(E, "connect", () => {
          let x = a(t.secureConnect, c, "secureConnect");
          n(E, "secureConnect", x);
        });
      }
      if (g) {
        let C = /* @__PURE__ */ s(() => a(t.send, c, "send"), "timeRequest");
        E.connecting ? n(E, "connect", () => {
          n(e, "upload-complete", C());
        }) : n(e, "upload-complete", C());
      }
    }), typeof t.response < "u" && n(e, "upload-complete", () => {
      let E = a(t.response, c, "response");
      n(e, "response", E);
    }), typeof t.read < "u" && n(e, "response", (E) => {
      let _ = a(t.read, c, "read");
      n(E, "end", _);
    }), d;
  }
  s(bR, "timedOut");
  function vR(e) {
    e = e;
    let t = {
      protocol: e.protocol,
      hostname: m.string(e.hostname) && e.hostname.startsWith("[") ? e.hostname.slice(1, -1) : e.hostname,
      host: e.host,
      hash: e.hash,
      search: e.search,
      pathname: e.pathname,
      href: e.href,
      path: `${e.pathname || ""}${e.search || ""}`
    };
    return m.string(e.port) && e.port.length > 0 && (t.port = Number(e.port)), (e.username || e.password) && (t.auth = `${e.username || ""}:${e.
    password || ""}`), t;
  }
  s(vR, "urlToOptions");
  var _R = class {
    static {
      s(this, "WeakableMap");
    }
    constructor() {
      Object.defineProperty(this, "weakMap", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "map", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), this.weakMap = /* @__PURE__ */ new WeakMap(), this.map = /* @__PURE__ */ new Map();
    }
    set(e, t) {
      typeof e == "object" ? this.weakMap.set(e, t) : this.map.set(e, t);
    }
    get(e) {
      return typeof e == "object" ? this.weakMap.get(e) : this.map.get(e);
    }
    has(e) {
      return typeof e == "object" ? this.weakMap.has(e) : this.map.has(e);
    }
  }, wR = /* @__PURE__ */ s(({ attemptCount: e, retryOptions: t, error: r, retryAfter: i, computedValue: n }) => {
    if (r.name === "RetryError")
      return 1;
    if (e > t.limit)
      return 0;
    let o = t.methods.includes(r.options.method), a = t.errorCodes.includes(r.code), u = r.response && t.statusCodes.includes(r.response.statusCode);
    if (!o || !a && !u)
      return 0;
    if (r.response) {
      if (i)
        return i > n ? 0 : i;
      if (r.response.statusCode === 413)
        return 0;
    }
    let l = Math.random() * t.noise;
    return Math.min(2 ** (e - 1) * 1e3, t.backoffLimit) + l;
  }, "calculateRetryDelay"), ER = wR, CR = Fe(require("process"), 1), qc = require("util"), xr = require("url"), xR = require("tls"), FR = Fe(
  require("http"), 1), SR = Fe(require("https"), 1), Fi = require("dns"), Lc = require("util"), TR = Fe(require("os"), 1), { Resolver: C0 } = Fi.
  promises, xi = Symbol("cacheableLookupCreateConnection"), Nc = Symbol("cacheableLookupInstance"), x0 = Symbol("expires"), AR = typeof Fi.ALL ==
  "number", F0 = /* @__PURE__ */ s((e) => {
    if (!(e && typeof e.createConnection == "function"))
      throw new Error("Expected an Agent instance as the first argument");
  }, "verifyAgent"), RR = /* @__PURE__ */ s((e) => {
    for (let t of e)
      t.family !== 6 && (t.address = `::ffff:${t.address}`, t.family = 6);
  }, "map4to6"), S0 = /* @__PURE__ */ s(() => {
    let e = !1, t = !1;
    for (let r of Object.values(TR.default.networkInterfaces()))
      for (let i of r)
        if (!i.internal && (i.family === "IPv6" ? t = !0 : e = !0, e && t))
          return { has4: e, has6: t };
    return { has4: e, has6: t };
  }, "getIfaceInfo"), kR = /* @__PURE__ */ s((e) => Symbol.iterator in e, "isIterable"), Zo = /* @__PURE__ */ s((e) => e.catch((t) => {
    if (t.code === "ENODATA" || t.code === "ENOTFOUND" || t.code === "ENOENT")
      return [];
    throw t;
  }), "ignoreNoResultErrors"), T0 = { ttl: !0 }, OR = { all: !0 }, BR = { all: !0, family: 4 }, PR = { all: !0, family: 6 }, IR = class {
    static {
      s(this, "CacheableLookup");
    }
    constructor({
      cache: e = /* @__PURE__ */ new Map(),
      maxTtl: t = 1 / 0,
      fallbackDuration: r = 3600,
      errorTtl: i = 0.15,
      resolver: n = new C0(),
      lookup: o = Fi.lookup
    } = {}) {
      if (this.maxTtl = t, this.errorTtl = i, this._cache = e, this._resolver = n, this._dnsLookup = o && (0, Lc.promisify)(o), this.stats =
      {
        cache: 0,
        query: 0
      }, this._resolver instanceof C0 ? (this._resolve4 = this._resolver.resolve4.bind(this._resolver), this._resolve6 = this._resolver.resolve6.
      bind(this._resolver)) : (this._resolve4 = (0, Lc.promisify)(this._resolver.resolve4.bind(this._resolver)), this._resolve6 = (0, Lc.promisify)(
      this._resolver.resolve6.bind(this._resolver))), this._iface = S0(), this._pending = {}, this._nextRemovalTime = !1, this._hostnamesToFallback =
      /* @__PURE__ */ new Set(), this.fallbackDuration = r, r > 0) {
        let a = setInterval(() => {
          this._hostnamesToFallback.clear();
        }, r * 1e3);
        a.unref && a.unref(), this._fallbackInterval = a;
      }
      this.lookup = this.lookup.bind(this), this.lookupAsync = this.lookupAsync.bind(this);
    }
    set servers(e) {
      this.clear(), this._resolver.setServers(e);
    }
    get servers() {
      return this._resolver.getServers();
    }
    lookup(e, t, r) {
      if (typeof t == "function" ? (r = t, t = {}) : typeof t == "number" && (t = {
        family: t
      }), !r)
        throw new Error("Callback must be a function.");
      this.lookupAsync(e, t).then((i) => {
        t.all ? r(null, i) : r(null, i.address, i.family, i.expires, i.ttl, i.source);
      }, r);
    }
    async lookupAsync(e, t = {}) {
      typeof t == "number" && (t = {
        family: t
      });
      let r = await this.query(e);
      if (t.family === 6) {
        let i = r.filter((n) => n.family === 6);
        t.hints & Fi.V4MAPPED && (AR && t.hints & Fi.ALL || i.length === 0) ? RR(r) : r = i;
      } else t.family === 4 && (r = r.filter((i) => i.family === 4));
      if (t.hints & Fi.ADDRCONFIG) {
        let { _iface: i } = this;
        r = r.filter((n) => n.family === 6 ? i.has6 : i.has4);
      }
      if (r.length === 0) {
        let i = new Error(`cacheableLookup ENOTFOUND ${e}`);
        throw i.code = "ENOTFOUND", i.hostname = e, i;
      }
      return t.all ? r : r[0];
    }
    async query(e) {
      let t = "cache", r = await this._cache.get(e);
      if (r && this.stats.cache++, !r) {
        let i = this._pending[e];
        if (i)
          this.stats.cache++, r = await i;
        else {
          t = "query";
          let n = this.queryAndCache(e);
          this._pending[e] = n, this.stats.query++;
          try {
            r = await n;
          } finally {
            delete this._pending[e];
          }
        }
      }
      return r = r.map((i) => ({ ...i, source: t })), r;
    }
    async _resolve(e) {
      let [t, r] = await Promise.all([
        Zo(this._resolve4(e, T0)),
        Zo(this._resolve6(e, T0))
      ]), i = 0, n = 0, o = 0, a = Date.now();
      for (let u of t)
        u.family = 4, u.expires = a + u.ttl * 1e3, i = Math.max(i, u.ttl);
      for (let u of r)
        u.family = 6, u.expires = a + u.ttl * 1e3, n = Math.max(n, u.ttl);
      return t.length > 0 ? r.length > 0 ? o = Math.min(i, n) : o = i : o = n, {
        entries: [
          ...t,
          ...r
        ],
        cacheTtl: o
      };
    }
    async _lookup(e) {
      try {
        let [t, r] = await Promise.all([
          // Passing {all: true} doesn't return all IPv4 and IPv6 entries.
          // See https://github.com/szmarczak/cacheable-lookup/issues/42
          Zo(this._dnsLookup(e, BR)),
          Zo(this._dnsLookup(e, PR))
        ]);
        return {
          entries: [
            ...t,
            ...r
          ],
          cacheTtl: 0
        };
      } catch {
        return {
          entries: [],
          cacheTtl: 0
        };
      }
    }
    async _set(e, t, r) {
      if (this.maxTtl > 0 && r > 0) {
        r = Math.min(r, this.maxTtl) * 1e3, t[x0] = Date.now() + r;
        try {
          await this._cache.set(e, t, r);
        } catch (i) {
          this.lookupAsync = async () => {
            let n = new Error("Cache Error. Please recreate the CacheableLookup instance.");
            throw n.cause = i, n;
          };
        }
        kR(this._cache) && this._tick(r);
      }
    }
    async queryAndCache(e) {
      if (this._hostnamesToFallback.has(e))
        return this._dnsLookup(e, OR);
      let t = await this._resolve(e);
      t.entries.length === 0 && this._dnsLookup && (t = await this._lookup(e), t.entries.length !== 0 && this.fallbackDuration > 0 && this._hostnamesToFallback.
      add(e));
      let r = t.entries.length === 0 ? this.errorTtl : t.cacheTtl;
      return await this._set(e, t.entries, r), t.entries;
    }
    _tick(e) {
      let t = this._nextRemovalTime;
      (!t || e < t) && (clearTimeout(this._removalTimeout), this._nextRemovalTime = e, this._removalTimeout = setTimeout(() => {
        this._nextRemovalTime = !1;
        let r = 1 / 0, i = Date.now();
        for (let [n, o] of this._cache) {
          let a = o[x0];
          i >= a ? this._cache.delete(n) : a < r && (r = a);
        }
        r !== 1 / 0 && this._tick(r - i);
      }, e), this._removalTimeout.unref && this._removalTimeout.unref());
    }
    install(e) {
      if (F0(e), xi in e)
        throw new Error("CacheableLookup has been already installed");
      e[xi] = e.createConnection, e[Nc] = this, e.createConnection = (t, r) => ("lookup" in t || (t.lookup = this.lookup), e[xi](t, r));
    }
    uninstall(e) {
      if (F0(e), e[xi]) {
        if (e[Nc] !== this)
          throw new Error("The agent is not owned by this CacheableLookup instance");
        e.createConnection = e[xi], delete e[xi], delete e[Nc];
      }
    }
    updateInterfaceInfo() {
      let { _iface: e } = this;
      this._iface = S0(), (e.has4 && !this._iface.has4 || e.has6 && !this._iface.has6) && this._cache.clear();
    }
    clear(e) {
      if (e) {
        this._cache.delete(e);
        return;
      }
      this._cache.clear();
    }
  }, MR = Fe(c3(), 1);
  function jR(e) {
    let t = [], r = e.split(",");
    for (let i of r) {
      let [n, ...o] = i.split(";"), a = n.trim();
      if (a[0] !== "<" || a[a.length - 1] !== ">")
        throw new Error(`Invalid format of the Link header reference: ${a}`);
      let u = a.slice(1, -1), l = {};
      if (o.length === 0)
        throw new Error(`Unexpected end of Link header parameters: ${o.join(";")}`);
      for (let c of o) {
        let d = c.trim(), p = d.indexOf("=");
        if (p === -1)
          throw new Error(`Failed to parse Link header: ${e}`);
        let h = d.slice(0, p).trim(), f = d.slice(p + 1).trim();
        l[h] = f;
      }
      t.push({
        reference: u,
        parameters: l
      });
    }
    return t;
  }
  s(jR, "parseLinkHeader");
  var [A0, qR] = CR.default.versions.node.split(".").map(Number);
  function LR(e) {
    for (let t in e) {
      let r = e[t];
      A.any([m.string, m.number, m.boolean, m.null_, m.undefined], r);
    }
  }
  s(LR, "validateSearchParameters");
  var NR = /* @__PURE__ */ new Map(), zo, UR = /* @__PURE__ */ s(() => zo || (zo = new IR(), zo), "getGlobalDnsCache"), $R = {
    request: void 0,
    agent: {
      http: void 0,
      https: void 0,
      http2: void 0
    },
    h2session: void 0,
    decompress: !0,
    timeout: {
      connect: void 0,
      lookup: void 0,
      read: void 0,
      request: void 0,
      response: void 0,
      secureConnect: void 0,
      send: void 0,
      socket: void 0
    },
    prefixUrl: "",
    body: void 0,
    form: void 0,
    json: void 0,
    cookieJar: void 0,
    ignoreInvalidCookies: !1,
    searchParams: void 0,
    dnsLookup: void 0,
    dnsCache: void 0,
    context: {},
    hooks: {
      init: [],
      beforeRequest: [],
      beforeError: [],
      beforeRedirect: [],
      beforeRetry: [],
      afterResponse: []
    },
    followRedirect: !0,
    maxRedirects: 10,
    cache: void 0,
    throwHttpErrors: !0,
    username: "",
    password: "",
    http2: !1,
    allowGetBody: !1,
    headers: {
      "user-agent": "got (https://github.com/sindresorhus/got)"
    },
    methodRewriting: !1,
    dnsLookupIpVersion: void 0,
    parseJson: JSON.parse,
    stringifyJson: JSON.stringify,
    retry: {
      limit: 2,
      methods: [
        "GET",
        "PUT",
        "HEAD",
        "DELETE",
        "OPTIONS",
        "TRACE"
      ],
      statusCodes: [
        408,
        413,
        429,
        500,
        502,
        503,
        504,
        521,
        522,
        524
      ],
      errorCodes: [
        "ETIMEDOUT",
        "ECONNRESET",
        "EADDRINUSE",
        "ECONNREFUSED",
        "EPIPE",
        "ENOTFOUND",
        "ENETUNREACH",
        "EAI_AGAIN"
      ],
      maxRetryAfter: void 0,
      calculateDelay: /* @__PURE__ */ s(({ computedValue: e }) => e, "calculateDelay"),
      backoffLimit: Number.POSITIVE_INFINITY,
      noise: 100
    },
    localAddress: void 0,
    method: "GET",
    createConnection: void 0,
    cacheOptions: {
      shared: void 0,
      cacheHeuristic: void 0,
      immutableMinTimeToLive: void 0,
      ignoreCargoCult: void 0
    },
    https: {
      alpnProtocols: void 0,
      rejectUnauthorized: void 0,
      checkServerIdentity: void 0,
      certificateAuthority: void 0,
      key: void 0,
      certificate: void 0,
      passphrase: void 0,
      pfx: void 0,
      ciphers: void 0,
      honorCipherOrder: void 0,
      minVersion: void 0,
      maxVersion: void 0,
      signatureAlgorithms: void 0,
      tlsSessionLifetime: void 0,
      dhparam: void 0,
      ecdhCurve: void 0,
      certificateRevocationLists: void 0
    },
    encoding: void 0,
    resolveBodyOnly: !1,
    isStream: !1,
    responseType: "text",
    url: void 0,
    pagination: {
      transform(e) {
        return e.request.options.responseType === "json" ? e.body : JSON.parse(e.body);
      },
      paginate({ response: e }) {
        let t = e.headers.link;
        if (typeof t != "string" || t.trim() === "")
          return !1;
        let i = jR(t).find((n) => n.parameters.rel === "next" || n.parameters.rel === '"next"');
        return i ? {
          url: new xr.URL(i.reference, e.url)
        } : !1;
      },
      filter: /* @__PURE__ */ s(() => !0, "filter"),
      shouldContinue: /* @__PURE__ */ s(() => !0, "shouldContinue"),
      countLimit: Number.POSITIVE_INFINITY,
      backoff: 0,
      requestLimit: 1e4,
      stackAllItems: !1
    },
    setHost: !0,
    maxHeaderSize: void 0,
    signal: void 0,
    enableUnixSockets: !0
  }, WR = /* @__PURE__ */ s((e) => {
    let { hooks: t, retry: r } = e, i = {
      ...e,
      context: { ...e.context },
      cacheOptions: { ...e.cacheOptions },
      https: { ...e.https },
      agent: { ...e.agent },
      headers: { ...e.headers },
      retry: {
        ...r,
        errorCodes: [...r.errorCodes],
        methods: [...r.methods],
        statusCodes: [...r.statusCodes]
      },
      timeout: { ...e.timeout },
      hooks: {
        init: [...t.init],
        beforeRequest: [...t.beforeRequest],
        beforeError: [...t.beforeError],
        beforeRedirect: [...t.beforeRedirect],
        beforeRetry: [...t.beforeRetry],
        afterResponse: [...t.afterResponse]
      },
      searchParams: e.searchParams ? new xr.URLSearchParams(e.searchParams) : void 0,
      pagination: { ...e.pagination }
    };
    return i.url !== void 0 && (i.prefixUrl = ""), i;
  }, "cloneInternals"), HR = /* @__PURE__ */ s((e) => {
    let { hooks: t, retry: r } = e, i = { ...e };
    return m.object(e.context) && (i.context = { ...e.context }), m.object(e.cacheOptions) && (i.cacheOptions = { ...e.cacheOptions }), m.object(
    e.https) && (i.https = { ...e.https }), m.object(e.cacheOptions) && (i.cacheOptions = { ...i.cacheOptions }), m.object(e.agent) && (i.agent =
    { ...e.agent }), m.object(e.headers) && (i.headers = { ...e.headers }), m.object(r) && (i.retry = { ...r }, m.array(r.errorCodes) && (i.
    retry.errorCodes = [...r.errorCodes]), m.array(r.methods) && (i.retry.methods = [...r.methods]), m.array(r.statusCodes) && (i.retry.statusCodes =
    [...r.statusCodes])), m.object(e.timeout) && (i.timeout = { ...e.timeout }), m.object(t) && (i.hooks = {
      ...t
    }, m.array(t.init) && (i.hooks.init = [...t.init]), m.array(t.beforeRequest) && (i.hooks.beforeRequest = [...t.beforeRequest]), m.array(
    t.beforeError) && (i.hooks.beforeError = [...t.beforeError]), m.array(t.beforeRedirect) && (i.hooks.beforeRedirect = [...t.beforeRedirect]),
    m.array(t.beforeRetry) && (i.hooks.beforeRetry = [...t.beforeRetry]), m.array(t.afterResponse) && (i.hooks.afterResponse = [...t.afterResponse])),
    m.object(e.pagination) && (i.pagination = { ...e.pagination }), i;
  }, "cloneRaw"), VR = /* @__PURE__ */ s((e) => {
    let t = [e.timeout.socket, e.timeout.connect, e.timeout.lookup, e.timeout.request, e.timeout.secureConnect].filter((r) => typeof r == "n\
umber");
    if (t.length > 0)
      return Math.min(...t);
  }, "getHttp2TimeoutOption"), R0 = /* @__PURE__ */ s((e, t, r) => {
    var i;
    let n = (i = e.hooks) == null ? void 0 : i.init;
    if (n)
      for (let o of n)
        o(t, r);
  }, "init"), Ut = class {
    static {
      s(this, "Options");
    }
    constructor(e, t, r) {
      if (Object.defineProperty(this, "_unixOptions", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_internals", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_merging", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_init", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), A.any([m.string, m.urlInstance, m.object, m.undefined], e), A.any([m.object, m.undefined], t), A.any([m.object, m.undefined], r), e instanceof
      Ut || t instanceof Ut)
        throw new TypeError("The defaults must be passed as the third argument");
      this._internals = WR(r?._internals ?? r ?? $R), this._init = [...r?._init ?? []], this._merging = !1, this._unixOptions = void 0;
      try {
        if (m.plainObject(e))
          try {
            this.merge(e), this.merge(t);
          } finally {
            this.url = e.url;
          }
        else
          try {
            this.merge(t);
          } finally {
            if (t?.url !== void 0)
              if (e === void 0)
                this.url = t.url;
              else
                throw new TypeError("The `url` option is mutually exclusive with the `input` argument");
            else e !== void 0 && (this.url = e);
          }
      } catch (i) {
        throw i.options = this, i;
      }
    }
    merge(e) {
      if (e) {
        if (e instanceof Ut) {
          for (let t of e._init)
            this.merge(t);
          return;
        }
        e = HR(e), R0(this, e, this), R0(e, e, this), this._merging = !0, "isStream" in e && (this.isStream = e.isStream);
        try {
          let t = !1;
          for (let r in e)
            if (!(r === "mutableDefaults" || r === "handlers") && r !== "url") {
              if (!(r in this))
                throw new Error(`Unexpected option: ${r}`);
              this[r] = e[r], t = !0;
            }
          t && this._init.push(e);
        } finally {
          this._merging = !1;
        }
      }
    }
    /**
        Custom request function.
        The main purpose of this is to [support HTTP2 using a wrapper](https://github.com/szmarczak/http2-wrapper).
    
        @default http.request | https.request
        */
    get request() {
      return this._internals.request;
    }
    set request(e) {
      A.any([m.function_, m.undefined], e), this._internals.request = e;
    }
    /**
        An object representing `http`, `https` and `http2` keys for [`http.Agent`](https://nodejs.org/api/http.html#http_class_http_agent), [`https.Agent`](https://nodejs.org/api/https.html#https_class_https_agent) and [`http2wrapper.Agent`](https://github.com/szmarczak/http2-wrapper#new-http2agentoptions) instance.
        This is necessary because a request to one protocol might redirect to another.
        In such a scenario, Got will switch over to the right protocol agent for you.
    
        If a key is not present, it will default to a global agent.
    
        @example
        ```
        import got from 'got';
        import HttpAgent from 'agentkeepalive';
    
        const {HttpsAgent} = HttpAgent;
    
        await got('https://sindresorhus.com', {
            agent: {
                http: new HttpAgent(),
                https: new HttpsAgent()
            }
        });
        ```
        */
    get agent() {
      return this._internals.agent;
    }
    set agent(e) {
      A.plainObject(e);
      for (let t in e) {
        if (!(t in this._internals.agent))
          throw new TypeError(`Unexpected agent option: ${t}`);
        A.any([m.object, m.undefined], e[t]);
      }
      this._merging ? Object.assign(this._internals.agent, e) : this._internals.agent = { ...e };
    }
    get h2session() {
      return this._internals.h2session;
    }
    set h2session(e) {
      this._internals.h2session = e;
    }
    /**
        Decompress the response automatically.
    
        This will set the `accept-encoding` header to `gzip, deflate, br` unless you set it yourself.
    
        If this is disabled, a compressed response is returned as a `Buffer`.
        This may be useful if you want to handle decompression yourself or stream the raw compressed data.
    
        @default true
        */
    get decompress() {
      return this._internals.decompress;
    }
    set decompress(e) {
      A.boolean(e), this._internals.decompress = e;
    }
    /**
        Milliseconds to wait for the server to end the response before aborting the request with `got.TimeoutError` error (a.k.a. `request` property).
        By default, there's no timeout.
    
        This also accepts an `object` with the following fields to constrain the duration of each phase of the request lifecycle:
    
        - `lookup` starts when a socket is assigned and ends when the hostname has been resolved.
            Does not apply when using a Unix domain socket.
        - `connect` starts when `lookup` completes (or when the socket is assigned if lookup does not apply to the request) and ends when the socket is connected.
        - `secureConnect` starts when `connect` completes and ends when the handshaking process completes (HTTPS only).
        - `socket` starts when the socket is connected. See [request.setTimeout](https://nodejs.org/api/http.html#http_request_settimeout_timeout_callback).
        - `response` starts when the request has been written to the socket and ends when the response headers are received.
        - `send` starts when the socket is connected and ends with the request has been written to the socket.
        - `request` starts when the request is initiated and ends when the response's end event fires.
        */
    get timeout() {
      return this._internals.timeout;
    }
    set timeout(e) {
      A.plainObject(e);
      for (let t in e) {
        if (!(t in this._internals.timeout))
          throw new Error(`Unexpected timeout option: ${t}`);
        A.any([m.number, m.undefined], e[t]);
      }
      this._merging ? Object.assign(this._internals.timeout, e) : this._internals.timeout = { ...e };
    }
    /**
        When specified, `prefixUrl` will be prepended to `url`.
        The prefix can be any valid URL, either relative or absolute.
        A trailing slash `/` is optional - one will be added automatically.
    
        __Note__: `prefixUrl` will be ignored if the `url` argument is a URL instance.
    
        __Note__: Leading slashes in `input` are disallowed when using this option to enforce consistency and avoid confusion.
        For example, when the prefix URL is `https://example.com/foo` and the input is `/bar`, there's ambiguity whether the resulting URL would become `https://example.com/foo/bar` or `https://example.com/bar`.
        The latter is used by browsers.
    
        __Tip__: Useful when used with `got.extend()` to create niche-specific Got instances.
    
        __Tip__: You can change `prefixUrl` using hooks as long as the URL still includes the `prefixUrl`.
        If the URL doesn't include it anymore, it will throw.
    
        @example
        ```
        import got from 'got';
    
        await got('unicorn', {prefixUrl: 'https://cats.com'});
        //=> 'https://cats.com/unicorn'
    
        const instance = got.extend({
            prefixUrl: 'https://google.com'
        });
    
        await instance('unicorn', {
            hooks: {
                beforeRequest: [
                    options => {
                        options.prefixUrl = 'https://cats.com';
                    }
                ]
            }
        });
        //=> 'https://cats.com/unicorn'
        ```
        */
    get prefixUrl() {
      return this._internals.prefixUrl;
    }
    set prefixUrl(e) {
      if (A.any([m.string, m.urlInstance], e), e === "") {
        this._internals.prefixUrl = "";
        return;
      }
      if (e = e.toString(), e.endsWith("/") || (e += "/"), this._internals.prefixUrl && this._internals.url) {
        let { href: t } = this._internals.url;
        this._internals.url.href = e + t.slice(this._internals.prefixUrl.length);
      }
      this._internals.prefixUrl = e;
    }
    /**
        __Note #1__: The `body` option cannot be used with the `json` or `form` option.
    
        __Note #2__: If you provide this option, `got.stream()` will be read-only.
    
        __Note #3__: If you provide a payload with the `GET` or `HEAD` method, it will throw a `TypeError` unless the method is `GET` and the `allowGetBody` option is set to `true`.
    
        __Note #4__: This option is not enumerable and will not be merged with the instance defaults.
    
        The `content-length` header will be automatically set if `body` is a `string` / `Buffer` / [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) / [`form-data` instance](https://github.com/form-data/form-data), and `content-length` and `transfer-encoding` are not manually set in `options.headers`.
    
        Since Got 12, the `content-length` is not automatically set when `body` is a `fs.createReadStream`.
        */
    get body() {
      return this._internals.body;
    }
    set body(e) {
      A.any([m.string, m.buffer, m.nodeStream, m.generator, m.asyncGenerator, Vc, m.undefined], e), m.nodeStream(e) && A.truthy(e.readable),
      e !== void 0 && (A.undefined(this._internals.form), A.undefined(this._internals.json)), this._internals.body = e;
    }
    /**
        The form body is converted to a query string using [`(new URLSearchParams(object)).toString()`](https://nodejs.org/api/url.html#url_constructor_new_urlsearchparams_obj).
    
        If the `Content-Type` header is not present, it will be set to `application/x-www-form-urlencoded`.
    
        __Note #1__: If you provide this option, `got.stream()` will be read-only.
    
        __Note #2__: This option is not enumerable and will not be merged with the instance defaults.
        */
    get form() {
      return this._internals.form;
    }
    set form(e) {
      A.any([m.plainObject, m.undefined], e), e !== void 0 && (A.undefined(this._internals.body), A.undefined(this._internals.json)), this._internals.
      form = e;
    }
    /**
        JSON body. If the `Content-Type` header is not set, it will be set to `application/json`.
    
        __Note #1__: If you provide this option, `got.stream()` will be read-only.
    
        __Note #2__: This option is not enumerable and will not be merged with the instance defaults.
        */
    get json() {
      return this._internals.json;
    }
    set json(e) {
      e !== void 0 && (A.undefined(this._internals.body), A.undefined(this._internals.form)), this._internals.json = e;
    }
    /**
        The URL to request, as a string, a [`https.request` options object](https://nodejs.org/api/https.html#https_https_request_options_callback), or a [WHATWG `URL`](https://nodejs.org/api/url.html#url_class_url).
    
        Properties from `options` will override properties in the parsed `url`.
    
        If no protocol is specified, it will throw a `TypeError`.
    
        __Note__: The query string is **not** parsed as search params.
    
        @example
        ```
        await got('https://example.com/?query=a b'); //=> https://example.com/?query=a%20b
        await got('https://example.com/', {searchParams: {query: 'a b'}}); //=> https://example.com/?query=a+b
    
        // The query string is overridden by `searchParams`
        await got('https://example.com/?query=a b', {searchParams: {query: 'a b'}}); //=> https://example.com/?query=a+b
        ```
        */
    get url() {
      return this._internals.url;
    }
    set url(e) {
      if (A.any([m.string, m.urlInstance, m.undefined], e), e === void 0) {
        this._internals.url = void 0;
        return;
      }
      if (m.string(e) && e.startsWith("/"))
        throw new Error("`url` must not start with a slash");
      let t = `${this.prefixUrl}${e.toString()}`, r = new xr.URL(t);
      if (this._internals.url = r, decodeURI(t), r.protocol === "unix:" && (r.href = `http://unix${r.pathname}${r.search}`), r.protocol !== "\
http:" && r.protocol !== "https:") {
        let i = new Error(`Unsupported protocol: ${r.protocol}`);
        throw i.code = "ERR_UNSUPPORTED_PROTOCOL", i;
      }
      if (this._internals.username && (r.username = this._internals.username, this._internals.username = ""), this._internals.password && (r.
      password = this._internals.password, this._internals.password = ""), this._internals.searchParams && (r.search = this._internals.searchParams.
      toString(), this._internals.searchParams = void 0), r.hostname === "unix") {
        if (!this._internals.enableUnixSockets)
          throw new Error("Using UNIX domain sockets but option `enableUnixSockets` is not enabled");
        let i = /(?<socketPath>.+?):(?<path>.+)/.exec(`${r.pathname}${r.search}`);
        if (i?.groups) {
          let { socketPath: n, path: o } = i.groups;
          this._unixOptions = {
            socketPath: n,
            path: o,
            host: ""
          };
        } else
          this._unixOptions = void 0;
        return;
      }
      this._unixOptions = void 0;
    }
    /**
        Cookie support. You don't have to care about parsing or how to store them.
    
        __Note__: If you provide this option, `options.headers.cookie` will be overridden.
        */
    get cookieJar() {
      return this._internals.cookieJar;
    }
    set cookieJar(e) {
      if (A.any([m.object, m.undefined], e), e === void 0) {
        this._internals.cookieJar = void 0;
        return;
      }
      let { setCookie: t, getCookieString: r } = e;
      A.function_(t), A.function_(r), t.length === 4 && r.length === 0 ? (t = (0, qc.promisify)(t.bind(e)), r = (0, qc.promisify)(r.bind(e)),
      this._internals.cookieJar = {
        setCookie: t,
        getCookieString: r
      }) : this._internals.cookieJar = e;
    }
    /**
        You can abort the `request` using [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
    
        *Requires Node.js 16 or later.*
    
        @example
        ```
        import got from 'got';
    
        const abortController = new AbortController();
    
        const request = got('https://httpbin.org/anything', {
            signal: abortController.signal
        });
    
        setTimeout(() => {
            abortController.abort();
        }, 100);
        ```
        */
    // TODO: Replace `any` with `AbortSignal` when targeting Node 16.
    get signal() {
      return this._internals.signal;
    }
    // TODO: Replace `any` with `AbortSignal` when targeting Node 16.
    set signal(e) {
      A.object(e), this._internals.signal = e;
    }
    /**
        Ignore invalid cookies instead of throwing an error.
        Only useful when the `cookieJar` option has been set. Not recommended.
    
        @default false
        */
    get ignoreInvalidCookies() {
      return this._internals.ignoreInvalidCookies;
    }
    set ignoreInvalidCookies(e) {
      A.boolean(e), this._internals.ignoreInvalidCookies = e;
    }
    /**
        Query string that will be added to the request URL.
        This will override the query string in `url`.
    
        If you need to pass in an array, you can do it using a `URLSearchParams` instance.
    
        @example
        ```
        import got from 'got';
    
        const searchParams = new URLSearchParams([['key', 'a'], ['key', 'b']]);
    
        await got('https://example.com', {searchParams});
    
        console.log(searchParams.toString());
        //=> 'key=a&key=b'
        ```
        */
    get searchParams() {
      return this._internals.url ? this._internals.url.searchParams : (this._internals.searchParams === void 0 && (this._internals.searchParams =
      new xr.URLSearchParams()), this._internals.searchParams);
    }
    set searchParams(e) {
      A.any([m.string, m.object, m.undefined], e);
      let t = this._internals.url;
      if (e === void 0) {
        this._internals.searchParams = void 0, t && (t.search = "");
        return;
      }
      let r = this.searchParams, i;
      if (m.string(e))
        i = new xr.URLSearchParams(e);
      else if (e instanceof xr.URLSearchParams)
        i = e;
      else {
        LR(e), i = new xr.URLSearchParams();
        for (let n in e) {
          let o = e[n];
          o === null ? i.append(n, "") : o === void 0 ? r.delete(n) : i.append(n, o);
        }
      }
      if (this._merging) {
        for (let n of i.keys())
          r.delete(n);
        for (let [n, o] of i)
          r.append(n, o);
      } else t ? t.search = r.toString() : this._internals.searchParams = r;
    }
    get searchParameters() {
      throw new Error("The `searchParameters` option does not exist. Use `searchParams` instead.");
    }
    set searchParameters(e) {
      throw new Error("The `searchParameters` option does not exist. Use `searchParams` instead.");
    }
    get dnsLookup() {
      return this._internals.dnsLookup;
    }
    set dnsLookup(e) {
      A.any([m.function_, m.undefined], e), this._internals.dnsLookup = e;
    }
    /**
        An instance of [`CacheableLookup`](https://github.com/szmarczak/cacheable-lookup) used for making DNS lookups.
        Useful when making lots of requests to different *public* hostnames.
    
        `CacheableLookup` uses `dns.resolver4(..)` and `dns.resolver6(...)` under the hood and fall backs to `dns.lookup(...)` when the first two fail, which may lead to additional delay.
    
        __Note__: This should stay disabled when making requests to internal hostnames such as `localhost`, `database.local` etc.
    
        @default false
        */
    get dnsCache() {
      return this._internals.dnsCache;
    }
    set dnsCache(e) {
      A.any([m.object, m.boolean, m.undefined], e), e === !0 ? this._internals.dnsCache = UR() : e === !1 ? this._internals.dnsCache = void 0 :
      this._internals.dnsCache = e;
    }
    /**
        User data. `context` is shallow merged and enumerable. If it contains non-enumerable properties they will NOT be merged.
    
        @example
        ```
        import got from 'got';
    
        const instance = got.extend({
            hooks: {
                beforeRequest: [
                    options => {
                        if (!options.context || !options.context.token) {
                            throw new Error('Token required');
                        }
    
                        options.headers.token = options.context.token;
                    }
                ]
            }
        });
    
        const context = {
            token: 'secret'
        };
    
        const response = await instance('https://httpbin.org/headers', {context});
    
        // Let's see the headers
        console.log(response.body);
        ```
        */
    get context() {
      return this._internals.context;
    }
    set context(e) {
      A.object(e), this._merging ? Object.assign(this._internals.context, e) : this._internals.context = { ...e };
    }
    /**
    Hooks allow modifications during the request lifecycle.
    Hook functions may be async and are run serially.
    */
    get hooks() {
      return this._internals.hooks;
    }
    set hooks(e) {
      A.object(e);
      for (let t in e) {
        if (!(t in this._internals.hooks))
          throw new Error(`Unexpected hook event: ${t}`);
        let r = t, i = e[r];
        if (A.any([m.array, m.undefined], i), i)
          for (let n of i)
            A.function_(n);
        if (this._merging)
          i && this._internals.hooks[r].push(...i);
        else {
          if (!i)
            throw new Error(`Missing hook event: ${t}`);
          this._internals.hooks[t] = [...i];
        }
      }
    }
    /**
        Defines if redirect responses should be followed automatically.
    
        Note that if a `303` is sent by the server in response to any request type (`POST`, `DELETE`, etc.), Got will automatically request the resource pointed to in the location header via `GET`.
        This is in accordance with [the spec](https://tools.ietf.org/html/rfc7231#section-6.4.4). You can optionally turn on this behavior also for other redirect codes - see `methodRewriting`.
    
        @default true
        */
    get followRedirect() {
      return this._internals.followRedirect;
    }
    set followRedirect(e) {
      A.boolean(e), this._internals.followRedirect = e;
    }
    get followRedirects() {
      throw new TypeError("The `followRedirects` option does not exist. Use `followRedirect` instead.");
    }
    set followRedirects(e) {
      throw new TypeError("The `followRedirects` option does not exist. Use `followRedirect` instead.");
    }
    /**
        If exceeded, the request will be aborted and a `MaxRedirectsError` will be thrown.
    
        @default 10
        */
    get maxRedirects() {
      return this._internals.maxRedirects;
    }
    set maxRedirects(e) {
      A.number(e), this._internals.maxRedirects = e;
    }
    /**
        A cache adapter instance for storing cached response data.
    
        @default false
        */
    get cache() {
      return this._internals.cache;
    }
    set cache(e) {
      A.any([m.object, m.string, m.boolean, m.undefined], e), e === !0 ? this._internals.cache = NR : e === !1 ? this._internals.cache = void 0 :
      this._internals.cache = e;
    }
    /**
        Determines if a `got.HTTPError` is thrown for unsuccessful responses.
    
        If this is disabled, requests that encounter an error status code will be resolved with the `response` instead of throwing.
        This may be useful if you are checking for resource availability and are expecting error responses.
    
        @default true
        */
    get throwHttpErrors() {
      return this._internals.throwHttpErrors;
    }
    set throwHttpErrors(e) {
      A.boolean(e), this._internals.throwHttpErrors = e;
    }
    get username() {
      let e = this._internals.url, t = e ? e.username : this._internals.username;
      return decodeURIComponent(t);
    }
    set username(e) {
      A.string(e);
      let t = this._internals.url, r = encodeURIComponent(e);
      t ? t.username = r : this._internals.username = r;
    }
    get password() {
      let e = this._internals.url, t = e ? e.password : this._internals.password;
      return decodeURIComponent(t);
    }
    set password(e) {
      A.string(e);
      let t = this._internals.url, r = encodeURIComponent(e);
      t ? t.password = r : this._internals.password = r;
    }
    /**
        If set to `true`, Got will additionally accept HTTP2 requests.
    
        It will choose either HTTP/1.1 or HTTP/2 depending on the ALPN protocol.
    
        __Note__: This option requires Node.js 15.10.0 or newer as HTTP/2 support on older Node.js versions is very buggy.
    
        __Note__: Overriding `options.request` will disable HTTP2 support.
    
        @default false
    
        @example
        ```
        import got from 'got';
    
        const {headers} = await got('https://nghttp2.org/httpbin/anything', {http2: true});
    
        console.log(headers.via);
        //=> '2 nghttpx'
        ```
        */
    get http2() {
      return this._internals.http2;
    }
    set http2(e) {
      A.boolean(e), this._internals.http2 = e;
    }
    /**
        Set this to `true` to allow sending body for the `GET` method.
        However, the [HTTP/2 specification](https://tools.ietf.org/html/rfc7540#section-8.1.3) says that `An HTTP GET request includes request header fields and no payload body`, therefore when using the HTTP/2 protocol this option will have no effect.
        This option is only meant to interact with non-compliant servers when you have no other choice.
    
        __Note__: The [RFC 7231](https://tools.ietf.org/html/rfc7231#section-4.3.1) doesn't specify any particular behavior for the GET method having a payload, therefore __it's considered an [anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern)__.
    
        @default false
        */
    get allowGetBody() {
      return this._internals.allowGetBody;
    }
    set allowGetBody(e) {
      A.boolean(e), this._internals.allowGetBody = e;
    }
    /**
        Request headers.
    
        Existing headers will be overwritten. Headers set to `undefined` will be omitted.
    
        @default {}
        */
    get headers() {
      return this._internals.headers;
    }
    set headers(e) {
      A.plainObject(e), this._merging ? Object.assign(this._internals.headers, $c(e)) : this._internals.headers = $c(e);
    }
    /**
        Specifies if the HTTP request method should be [rewritten as `GET`](https://tools.ietf.org/html/rfc7231#section-6.4) on redirects.
    
        As the [specification](https://tools.ietf.org/html/rfc7231#section-6.4) prefers to rewrite the HTTP method only on `303` responses, this is Got's default behavior.
        Setting `methodRewriting` to `true` will also rewrite `301` and `302` responses, as allowed by the spec. This is the behavior followed by `curl` and browsers.
    
        __Note__: Got never performs method rewriting on `307` and `308` responses, as this is [explicitly prohibited by the specification](https://www.rfc-editor.org/rfc/rfc7231#section-6.4.7).
    
        @default false
        */
    get methodRewriting() {
      return this._internals.methodRewriting;
    }
    set methodRewriting(e) {
      A.boolean(e), this._internals.methodRewriting = e;
    }
    /**
        Indicates which DNS record family to use.
    
        Values:
        - `undefined`: IPv4 (if present) or IPv6
        - `4`: Only IPv4
        - `6`: Only IPv6
    
        @default undefined
        */
    get dnsLookupIpVersion() {
      return this._internals.dnsLookupIpVersion;
    }
    set dnsLookupIpVersion(e) {
      if (e !== void 0 && e !== 4 && e !== 6)
        throw new TypeError(`Invalid DNS lookup IP version: ${e}`);
      this._internals.dnsLookupIpVersion = e;
    }
    /**
        A function used to parse JSON responses.
    
        @example
        ```
        import got from 'got';
        import Bourne from '@hapi/bourne';
    
        const parsed = await got('https://example.com', {
            parseJson: text => Bourne.parse(text)
        }).json();
    
        console.log(parsed);
        ```
        */
    get parseJson() {
      return this._internals.parseJson;
    }
    set parseJson(e) {
      A.function_(e), this._internals.parseJson = e;
    }
    /**
        A function used to stringify the body of JSON requests.
    
        @example
        ```
        import got from 'got';
    
        await got.post('https://example.com', {
            stringifyJson: object => JSON.stringify(object, (key, value) => {
                if (key.startsWith('_')) {
                    return;
                }
    
                return value;
            }),
            json: {
                some: 'payload',
                _ignoreMe: 1234
            }
        });
        ```
    
        @example
        ```
        import got from 'got';
    
        await got.post('https://example.com', {
            stringifyJson: object => JSON.stringify(object, (key, value) => {
                if (typeof value === 'number') {
                    return value.toString();
                }
    
                return value;
            }),
            json: {
                some: 'payload',
                number: 1
            }
        });
        ```
        */
    get stringifyJson() {
      return this._internals.stringifyJson;
    }
    set stringifyJson(e) {
      A.function_(e), this._internals.stringifyJson = e;
    }
    /**
        An object representing `limit`, `calculateDelay`, `methods`, `statusCodes`, `maxRetryAfter` and `errorCodes` fields for maximum retry count, retry handler, allowed methods, allowed status codes, maximum [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) time and allowed error codes.
    
        Delays between retries counts with function `1000 * Math.pow(2, retry) + Math.random() * 100`, where `retry` is attempt number (starts from 1).
    
        The `calculateDelay` property is a `function` that receives an object with `attemptCount`, `retryOptions`, `error` and `computedValue` properties for current retry count, the retry options, error and default computed value.
        The function must return a delay in milliseconds (or a Promise resolving with it) (`0` return value cancels retry).
    
        By default, it retries *only* on the specified methods, status codes, and on these network errors:
    
        - `ETIMEDOUT`: One of the [timeout](#timeout) limits were reached.
        - `ECONNRESET`: Connection was forcibly closed by a peer.
        - `EADDRINUSE`: Could not bind to any free port.
        - `ECONNREFUSED`: Connection was refused by the server.
        - `EPIPE`: The remote side of the stream being written has been closed.
        - `ENOTFOUND`: Couldn't resolve the hostname to an IP address.
        - `ENETUNREACH`: No internet connection.
        - `EAI_AGAIN`: DNS lookup timed out.
    
        __Note__: If `maxRetryAfter` is set to `undefined`, it will use `options.timeout`.
        __Note__: If [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header is greater than `maxRetryAfter`, it will cancel the request.
        */
    get retry() {
      return this._internals.retry;
    }
    set retry(e) {
      if (A.plainObject(e), A.any([m.function_, m.undefined], e.calculateDelay), A.any([m.number, m.undefined], e.maxRetryAfter), A.any([m.number,
      m.undefined], e.limit), A.any([m.array, m.undefined], e.methods), A.any([m.array, m.undefined], e.statusCodes), A.any([m.array, m.undefined],
      e.errorCodes), A.any([m.number, m.undefined], e.noise), e.noise && Math.abs(e.noise) > 100)
        throw new Error(`The maximum acceptable retry noise is +/- 100ms, got ${e.noise}`);
      for (let r in e)
        if (!(r in this._internals.retry))
          throw new Error(`Unexpected retry option: ${r}`);
      this._merging ? Object.assign(this._internals.retry, e) : this._internals.retry = { ...e };
      let { retry: t } = this._internals;
      t.methods = [...new Set(t.methods.map((r) => r.toUpperCase()))], t.statusCodes = [...new Set(t.statusCodes)], t.errorCodes = [...new Set(
      t.errorCodes)];
    }
    /**
        From `http.RequestOptions`.
    
        The IP address used to send the request from.
        */
    get localAddress() {
      return this._internals.localAddress;
    }
    set localAddress(e) {
      A.any([m.string, m.undefined], e), this._internals.localAddress = e;
    }
    /**
        The HTTP method used to make the request.
    
        @default 'GET'
        */
    get method() {
      return this._internals.method;
    }
    set method(e) {
      A.string(e), this._internals.method = e.toUpperCase();
    }
    get createConnection() {
      return this._internals.createConnection;
    }
    set createConnection(e) {
      A.any([m.function_, m.undefined], e), this._internals.createConnection = e;
    }
    /**
        From `http-cache-semantics`
    
        @default {}
        */
    get cacheOptions() {
      return this._internals.cacheOptions;
    }
    set cacheOptions(e) {
      A.plainObject(e), A.any([m.boolean, m.undefined], e.shared), A.any([m.number, m.undefined], e.cacheHeuristic), A.any([m.number, m.undefined],
      e.immutableMinTimeToLive), A.any([m.boolean, m.undefined], e.ignoreCargoCult);
      for (let t in e)
        if (!(t in this._internals.cacheOptions))
          throw new Error(`Cache option \`${t}\` does not exist`);
      this._merging ? Object.assign(this._internals.cacheOptions, e) : this._internals.cacheOptions = { ...e };
    }
    /**
    Options for the advanced HTTPS API.
    */
    get https() {
      return this._internals.https;
    }
    set https(e) {
      A.plainObject(e), A.any([m.boolean, m.undefined], e.rejectUnauthorized), A.any([m.function_, m.undefined], e.checkServerIdentity), A.any(
      [m.string, m.object, m.array, m.undefined], e.certificateAuthority), A.any([m.string, m.object, m.array, m.undefined], e.key), A.any([
      m.string, m.object, m.array, m.undefined], e.certificate), A.any([m.string, m.undefined], e.passphrase), A.any([m.string, m.buffer, m.
      array, m.undefined], e.pfx), A.any([m.array, m.undefined], e.alpnProtocols), A.any([m.string, m.undefined], e.ciphers), A.any([m.string,
      m.buffer, m.undefined], e.dhparam), A.any([m.string, m.undefined], e.signatureAlgorithms), A.any([m.string, m.undefined], e.minVersion),
      A.any([m.string, m.undefined], e.maxVersion), A.any([m.boolean, m.undefined], e.honorCipherOrder), A.any([m.number, m.undefined], e.tlsSessionLifetime),
      A.any([m.string, m.undefined], e.ecdhCurve), A.any([m.string, m.buffer, m.array, m.undefined], e.certificateRevocationLists);
      for (let t in e)
        if (!(t in this._internals.https))
          throw new Error(`HTTPS option \`${t}\` does not exist`);
      this._merging ? Object.assign(this._internals.https, e) : this._internals.https = { ...e };
    }
    /**
        [Encoding](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings) to be used on `setEncoding` of the response data.
    
        To get a [`Buffer`](https://nodejs.org/api/buffer.html), you need to set `responseType` to `buffer` instead.
        Don't set this option to `null`.
    
        __Note__: This doesn't affect streams! Instead, you need to do `got.stream(...).setEncoding(encoding)`.
    
        @default 'utf-8'
        */
    get encoding() {
      return this._internals.encoding;
    }
    set encoding(e) {
      if (e === null)
        throw new TypeError("To get a Buffer, set `options.responseType` to `buffer` instead");
      A.any([m.string, m.undefined], e), this._internals.encoding = e;
    }
    /**
        When set to `true` the promise will return the Response body instead of the Response object.
    
        @default false
        */
    get resolveBodyOnly() {
      return this._internals.resolveBodyOnly;
    }
    set resolveBodyOnly(e) {
      A.boolean(e), this._internals.resolveBodyOnly = e;
    }
    /**
        Returns a `Stream` instead of a `Promise`.
        This is equivalent to calling `got.stream(url, options?)`.
    
        @default false
        */
    get isStream() {
      return this._internals.isStream;
    }
    set isStream(e) {
      A.boolean(e), this._internals.isStream = e;
    }
    /**
        The parsing method.
    
        The promise also has `.text()`, `.json()` and `.buffer()` methods which return another Got promise for the parsed body.
    
        It's like setting the options to `{responseType: 'json', resolveBodyOnly: true}` but without affecting the main Got promise.
    
        __Note__: When using streams, this option is ignored.
    
        @example
        ```
        const responsePromise = got(url);
        const bufferPromise = responsePromise.buffer();
        const jsonPromise = responsePromise.json();
    
        const [response, buffer, json] = Promise.all([responsePromise, bufferPromise, jsonPromise]);
        // `response` is an instance of Got Response
        // `buffer` is an instance of Buffer
        // `json` is an object
        ```
    
        @example
        ```
        // This
        const body = await got(url).json();
    
        // is semantically the same as this
        const body = await got(url, {responseType: 'json', resolveBodyOnly: true});
        ```
        */
    get responseType() {
      return this._internals.responseType;
    }
    set responseType(e) {
      if (e === void 0) {
        this._internals.responseType = "text";
        return;
      }
      if (e !== "text" && e !== "buffer" && e !== "json")
        throw new Error(`Invalid \`responseType\` option: ${e}`);
      this._internals.responseType = e;
    }
    get pagination() {
      return this._internals.pagination;
    }
    set pagination(e) {
      A.object(e), this._merging ? Object.assign(this._internals.pagination, e) : this._internals.pagination = e;
    }
    get auth() {
      throw new Error("Parameter `auth` is deprecated. Use `username` / `password` instead.");
    }
    set auth(e) {
      throw new Error("Parameter `auth` is deprecated. Use `username` / `password` instead.");
    }
    get setHost() {
      return this._internals.setHost;
    }
    set setHost(e) {
      A.boolean(e), this._internals.setHost = e;
    }
    get maxHeaderSize() {
      return this._internals.maxHeaderSize;
    }
    set maxHeaderSize(e) {
      A.any([m.number, m.undefined], e), this._internals.maxHeaderSize = e;
    }
    get enableUnixSockets() {
      return this._internals.enableUnixSockets;
    }
    set enableUnixSockets(e) {
      A.boolean(e), this._internals.enableUnixSockets = e;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    toJSON() {
      return { ...this._internals };
    }
    [Symbol.for("nodejs.util.inspect.custom")](e, t) {
      return (0, qc.inspect)(this._internals, t);
    }
    createNativeRequestOptions() {
      var e;
      let t = this._internals, r = t.url, i;
      r.protocol === "https:" ? i = t.http2 ? t.agent : t.agent.https : i = t.agent.http;
      let { https: n } = t, { pfx: o } = n;
      return m.array(o) && m.plainObject(o[0]) && (o = o.map((a) => ({
        buf: a.buffer,
        passphrase: a.passphrase
      }))), {
        ...t.cacheOptions,
        ...this._unixOptions,
        // HTTPS options
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ALPNProtocols: n.alpnProtocols,
        ca: n.certificateAuthority,
        cert: n.certificate,
        key: n.key,
        passphrase: n.passphrase,
        pfx: n.pfx,
        rejectUnauthorized: n.rejectUnauthorized,
        checkServerIdentity: n.checkServerIdentity ?? xR.checkServerIdentity,
        ciphers: n.ciphers,
        honorCipherOrder: n.honorCipherOrder,
        minVersion: n.minVersion,
        maxVersion: n.maxVersion,
        sigalgs: n.signatureAlgorithms,
        sessionTimeout: n.tlsSessionLifetime,
        dhparam: n.dhparam,
        ecdhCurve: n.ecdhCurve,
        crl: n.certificateRevocationLists,
        // HTTP options
        lookup: t.dnsLookup ?? ((e = t.dnsCache) == null ? void 0 : e.lookup),
        family: t.dnsLookupIpVersion,
        agent: i,
        setHost: t.setHost,
        method: t.method,
        maxHeaderSize: t.maxHeaderSize,
        localAddress: t.localAddress,
        headers: t.headers,
        createConnection: t.createConnection,
        timeout: t.http2 ? VR(t) : void 0,
        // HTTP/2 options
        h2session: t.h2session
      };
    }
    getRequestFunction() {
      let e = this._internals.url, { request: t } = this._internals;
      return !t && e ? this.getFallbackRequestFunction() : t;
    }
    getFallbackRequestFunction() {
      let e = this._internals.url;
      if (e) {
        if (e.protocol === "https:") {
          if (this._internals.http2) {
            if (A0 < 15 || A0 === 15 && qR < 10) {
              let t = new Error("To use the `http2` option, install Node.js 15.10.0 or above");
              throw t.code = "EUNSUPPORTED", t;
            }
            return MR.default.auto;
          }
          return SR.default.request;
        }
        return FR.default.request;
      }
    }
    freeze() {
      let e = this._internals;
      Object.freeze(e), Object.freeze(e.hooks), Object.freeze(e.hooks.afterResponse), Object.freeze(e.hooks.beforeError), Object.freeze(e.hooks.
      beforeRedirect), Object.freeze(e.hooks.beforeRequest), Object.freeze(e.hooks.beforeRetry), Object.freeze(e.hooks.init), Object.freeze(
      e.https), Object.freeze(e.cacheOptions), Object.freeze(e.agent), Object.freeze(e.headers), Object.freeze(e.timeout), Object.freeze(e.retry),
      Object.freeze(e.retry.errorCodes), Object.freeze(e.retry.methods), Object.freeze(e.retry.statusCodes);
    }
  }, Yo = /* @__PURE__ */ s((e) => {
    let { statusCode: t } = e, r = e.request.options.followRedirect ? 299 : 399;
    return t >= 200 && t <= r || t === 304;
  }, "isResponseOk"), k0 = class extends Te {
    static {
      s(this, "ParseError");
    }
    constructor(e, t) {
      let { options: r } = t.request;
      super(`${e.message} in "${r.url.toString()}"`, e, t.request), this.name = "ParseError", this.code = "ERR_BODY_PARSE_FAILURE";
    }
  }, O0 = /* @__PURE__ */ s((e, t, r, i) => {
    let { rawBody: n } = e;
    try {
      if (t === "text")
        return n.toString(i);
      if (t === "json")
        return n.length === 0 ? "" : r(n.toString(i));
      if (t === "buffer")
        return n;
    } catch (o) {
      throw new k0(o, e);
    }
    throw new k0({
      message: `Unknown body type '${t}'`,
      name: "Error"
    }, e);
  }, "parseBody");
  function ZR(e) {
    return e.writable && !e.writableEnded;
  }
  s(ZR, "isClientRequest");
  var zR = ZR;
  function B0(e) {
    return e.protocol === "unix:" || e.hostname === "unix";
  }
  s(B0, "isUnixSocketURL");
  var GR = m.string(Q0.default.versions.brotli), KR = /* @__PURE__ */ new Set(["GET", "HEAD"]), Uc = new _R(), YR = /* @__PURE__ */ new Set(
  [300, 301, 302, 303, 304, 307, 308]), JR = [
    "socket",
    "connect",
    "continue",
    "information",
    "upgrade"
  ], Go = /* @__PURE__ */ s(() => {
  }, "noop2"), Zc = class extends B3.Duplex {
    static {
      s(this, "Request");
    }
    constructor(e, t, r) {
      super({
        // Don't destroy immediately, as the error may be emitted on unsuccessful retry
        autoDestroy: !1,
        // It needs to be zero because we're just proxying the data to another stream
        highWaterMark: 0
      }), Object.defineProperty(this, "constructor", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_noPipe", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "options", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "response", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "requestUrl", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "redirectUrls", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "retryCount", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_stopRetry", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_downloadedSize", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_uploadedSize", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_stopReading", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_pipedServerResponses", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_request", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_responseSize", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_bodySize", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_unproxyEvents", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_isFromCache", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_cannotHaveBody", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_triggerRead", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_cancelTimeouts", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_removeListeners", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_nativeResponse", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_flushed", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_aborted", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), Object.defineProperty(this, "_requestInitialized", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: void 0
      }), this._downloadedSize = 0, this._uploadedSize = 0, this._stopReading = !1, this._pipedServerResponses = /* @__PURE__ */ new Set(), this.
      _cannotHaveBody = !1, this._unproxyEvents = Go, this._triggerRead = !1, this._cancelTimeouts = Go, this._removeListeners = Go, this._jobs =
      [], this._flushed = !1, this._requestInitialized = !1, this._aborted = !1, this.redirectUrls = [], this.retryCount = 0, this._stopRetry =
      Go, this.on("pipe", (n) => {
        n.headers && Object.assign(this.options.headers, n.headers);
      }), this.on("newListener", (n) => {
        if (n === "retry" && this.listenerCount("retry") > 0)
          throw new Error("A retry listener has been attached already.");
      });
      try {
        if (this.options = new Ut(e, t, r), !this.options.url) {
          if (this.options.prefixUrl === "")
            throw new TypeError("Missing `url` property");
          this.options.url = "";
        }
        this.requestUrl = this.options.url;
      } catch (n) {
        let { options: o } = n;
        o && (this.options = o), this.flush = async () => {
          this.flush = async () => {
          }, this.destroy(n);
        };
        return;
      }
      let { body: i } = this.options;
      if (m.nodeStream(i) && i.once("error", (n) => {
        this._flushed ? this._beforeError(new f0(n, this)) : this.flush = async () => {
          this.flush = async () => {
          }, this._beforeError(new f0(n, this));
        };
      }), this.options.signal) {
        let n = /* @__PURE__ */ s(() => {
          this.destroy(new O3(this));
        }, "abort");
        this.options.signal.aborted ? n() : (this.options.signal.addEventListener("abort", n), this._removeListeners = () => {
          this.options.signal.removeEventListener("abort", n);
        });
      }
    }
    async flush() {
      var e;
      if (!this._flushed) {
        this._flushed = !0;
        try {
          if (await this._finalizeBody(), this.destroyed)
            return;
          if (await this._makeRequest(), this.destroyed) {
            (e = this._request) == null || e.destroy();
            return;
          }
          for (let t of this._jobs)
            t();
          this._jobs.length = 0, this._requestInitialized = !0;
        } catch (t) {
          this._beforeError(t);
        }
      }
    }
    _beforeError(e) {
      if (this._stopReading)
        return;
      let { response: t, options: r } = this, i = this.retryCount + (e.name === "RetryError" ? 0 : 1);
      this._stopReading = !0, e instanceof Te || (e = new Te(e.message, e, this));
      let n = e;
      (async () => {
        var o, a;
        if (t?.readable && !t.rawBody && !((a = (o = this._request) == null ? void 0 : o.socket) != null && a.destroyed) && (t.setEncoding(this.
        readableEncoding), await this._setRawBody(t) && (t.body = t.rawBody.toString())), this.listenerCount("retry") !== 0) {
          let u;
          try {
            let l;
            t && "retry-after" in t.headers && (l = Number(t.headers["retry-after"]), Number.isNaN(l) ? (l = Date.parse(t.headers["retry-aft\
er"]) - Date.now(), l <= 0 && (l = 1)) : l *= 1e3);
            let c = r.retry;
            u = await c.calculateDelay({
              attemptCount: i,
              retryOptions: c,
              error: n,
              retryAfter: l,
              computedValue: ER({
                attemptCount: i,
                retryOptions: c,
                error: n,
                retryAfter: l,
                computedValue: c.maxRetryAfter ?? r.timeout.request ?? Number.POSITIVE_INFINITY
              })
            });
          } catch (l) {
            this._error(new Te(l.message, l, this));
            return;
          }
          if (u) {
            if (await new Promise((l) => {
              let c = setTimeout(l, u);
              this._stopRetry = () => {
                clearTimeout(c), l();
              };
            }), this.destroyed)
              return;
            try {
              for (let l of this.options.hooks.beforeRetry)
                await l(n, this.retryCount + 1);
            } catch (l) {
              this._error(new Te(l.message, e, this));
              return;
            }
            if (this.destroyed)
              return;
            this.destroy(), this.emit("retry", this.retryCount + 1, e, (l) => {
              let c = new Zc(r.url, l, r);
              return c.retryCount = this.retryCount + 1, Q0.default.nextTick(() => {
                c.flush();
              }), c;
            });
            return;
          }
        }
        this._error(n);
      })();
    }
    _read() {
      this._triggerRead = !0;
      let { response: e } = this;
      if (e && !this._stopReading) {
        e.readableLength && (this._triggerRead = !1);
        let t;
        for (; (t = e.read()) !== null; ) {
          this._downloadedSize += t.length;
          let r = this.downloadProgress;
          r.percent < 1 && this.emit("downloadProgress", r), this.push(t);
        }
      }
    }
    _write(e, t, r) {
      let i = /* @__PURE__ */ s(() => {
        this._writeRequest(e, t, r);
      }, "write");
      this._requestInitialized ? i() : this._jobs.push(i);
    }
    _final(e) {
      let t = /* @__PURE__ */ s(() => {
        if (!this._request || this._request.destroyed) {
          e();
          return;
        }
        this._request.end((r) => {
          var i;
          (i = this._request._writableState) != null && i.errored || (r || (this._bodySize = this._uploadedSize, this.emit("uploadProgress",
          this.uploadProgress), this._request.emit("upload-complete")), e(r));
        });
      }, "endRequest");
      this._requestInitialized ? t() : this._jobs.push(t);
    }
    _destroy(e, t) {
      if (this._stopReading = !0, this.flush = async () => {
      }, this._stopRetry(), this._cancelTimeouts(), this._removeListeners(), this.options) {
        let { body: r } = this.options;
        m.nodeStream(r) && r.destroy();
      }
      this._request && this._request.destroy(), e !== null && !m.undefined(e) && !(e instanceof Te) && (e = new Te(e.message, e, this)), t(e);
    }
    pipe(e, t) {
      return e instanceof Bc.ServerResponse && this._pipedServerResponses.add(e), super.pipe(e, t);
    }
    unpipe(e) {
      return e instanceof Bc.ServerResponse && this._pipedServerResponses.delete(e), super.unpipe(e), this;
    }
    async _finalizeBody() {
      let { options: e } = this, { headers: t } = e, r = !m.undefined(e.form), i = !m.undefined(e.json), n = !m.undefined(e.body), o = KR.has(
      e.method) && !(e.method === "GET" && e.allowGetBody);
      if (this._cannotHaveBody = o, r || i || n) {
        if (o)
          throw new TypeError(`The \`${e.method}\` method cannot be used with a body`);
        let a = !m.string(t["content-type"]);
        if (n) {
          if (Vc(e.body)) {
            let l = new fR(e.body);
            a && (t["content-type"] = l.headers["Content-Type"]), "Content-Length" in l.headers && (t["content-length"] = l.headers["Content\
-Length"]), e.body = l.encode();
          }
          tv(e.body) && a && (t["content-type"] = `multipart/form-data; boundary=${e.body.getBoundary()}`);
        } else if (r) {
          a && (t["content-type"] = "application/x-www-form-urlencoded");
          let { form: l } = e;
          e.form = void 0, e.body = new p0.URLSearchParams(l).toString();
        } else {
          a && (t["content-type"] = "application/json");
          let { json: l } = e;
          e.json = void 0, e.body = e.stringifyJson(l);
        }
        let u = await DR(e.body, e.headers);
        m.undefined(t["content-length"]) && m.undefined(t["transfer-encoding"]) && !o && !m.undefined(u) && (t["content-length"] = String(u));
      }
      e.responseType === "json" && !("accept" in e.headers) && (e.headers.accept = "application/json"), this._bodySize = Number(t["content-l\
ength"]) || void 0;
    }
    async _onResponseBase(e) {
      if (this.isAborted)
        return;
      let { options: t } = this, { url: r } = t;
      this._nativeResponse = e, t.decompress && (e = (0, iR.default)(e));
      let i = e.statusCode, n = e;
      n.statusMessage = n.statusMessage ? n.statusMessage : Bc.default.STATUS_CODES[i], n.url = t.url.toString(), n.requestUrl = this.requestUrl,
      n.redirectUrls = this.redirectUrls, n.request = this, n.isFromCache = this._nativeResponse.fromCache ?? !1, n.ip = this.ip, n.retryCount =
      this.retryCount, n.ok = Yo(n), this._isFromCache = n.isFromCache, this._responseSize = Number(e.headers["content-length"]) || void 0, this.
      response = n, e.once("end", () => {
        this._responseSize = this._downloadedSize, this.emit("downloadProgress", this.downloadProgress);
      }), e.once("error", (a) => {
        this._aborted = !0, e.destroy(), this._beforeError(new h0(a, this));
      }), e.once("aborted", () => {
        this._aborted = !0, this._beforeError(new h0({
          name: "Error",
          message: "The server aborted pending request",
          code: "ECONNRESET"
        }, this));
      }), this.emit("downloadProgress", this.downloadProgress);
      let o = e.headers["set-cookie"];
      if (m.object(t.cookieJar) && o) {
        let a = o.map(async (u) => t.cookieJar.setCookie(u, r.toString()));
        t.ignoreInvalidCookies && (a = a.map(async (u) => {
          try {
            await u;
          } catch {
          }
        }));
        try {
          await Promise.all(a);
        } catch (u) {
          this._beforeError(u);
          return;
        }
      }
      if (!this.isAborted) {
        if (t.followRedirect && e.headers.location && YR.has(i)) {
          if (e.resume(), this._cancelTimeouts(), this._unproxyEvents(), this.redirectUrls.length >= t.maxRedirects) {
            this._beforeError(new T3(this));
            return;
          }
          this._request = void 0;
          let a = new Ut(void 0, void 0, this.options), u = i === 303 && a.method !== "GET" && a.method !== "HEAD", l = i !== 307 && i !== 308,
          c = a.methodRewriting && l;
          (u || c) && (a.method = "GET", a.body = void 0, a.json = void 0, a.form = void 0, delete a.headers["content-length"]);
          try {
            let d = Oc.Buffer.from(e.headers.location, "binary").toString(), p = new p0.URL(d, r);
            if (!B0(r) && B0(p)) {
              this._beforeError(new Te("Cannot redirect to UNIX socket", {}, this));
              return;
            }
            p.hostname !== r.hostname || p.port !== r.port ? ("host" in a.headers && delete a.headers.host, "cookie" in a.headers && delete a.
            headers.cookie, "authorization" in a.headers && delete a.headers.authorization, (a.username || a.password) && (a.username = "", a.
            password = "")) : (p.username = a.username, p.password = a.password), this.redirectUrls.push(p), a.prefixUrl = "", a.url = p;
            for (let h of a.hooks.beforeRedirect)
              await h(a, n);
            this.emit("redirect", a, n), this.options = a, await this._makeRequest();
          } catch (d) {
            this._beforeError(d);
            return;
          }
          return;
        }
        if (t.isStream && t.throwHttpErrors && !Yo(n)) {
          this._beforeError(new Ko(n));
          return;
        }
        if (e.on("readable", () => {
          this._triggerRead && this._read();
        }), this.on("resume", () => {
          e.resume();
        }), this.on("pause", () => {
          e.pause();
        }), e.once("end", () => {
          this.push(null);
        }), this._noPipe) {
          await this._setRawBody() && this.emit("response", e);
          return;
        }
        this.emit("response", e);
        for (let a of this._pipedServerResponses)
          if (!a.headersSent) {
            for (let u in e.headers) {
              let l = t.decompress ? u !== "content-encoding" : !0, c = e.headers[u];
              l && a.setHeader(u, c);
            }
            a.statusCode = i;
          }
      }
    }
    async _setRawBody(e = this) {
      if (e.readableEnded)
        return !1;
      try {
        let t = await (0, nR.buffer)(e);
        if (!this.isAborted)
          return this.response.rawBody = t, !0;
      } catch {
      }
      return !1;
    }
    async _onResponse(e) {
      try {
        await this._onResponseBase(e);
      } catch (t) {
        this._beforeError(t);
      }
    }
    _onRequest(e) {
      let { options: t } = this, { timeout: r, url: i } = t;
      q3(e), this.options.http2 && e.setTimeout(0), this._cancelTimeouts = bR(e, r, i);
      let n = t.cache ? "cacheableResponse" : "response";
      e.once(n, (o) => {
        this._onResponse(o);
      }), e.once("error", (o) => {
        this._aborted = !0, e.destroy(), o = o instanceof iv ? new R3(o, this.timings, this) : new Te(o.message, o, this), this._beforeError(
        o);
      }), this._unproxyEvents = rv(e, this, JR), this._request = e, this.emit("uploadProgress", this.uploadProgress), this._sendBody(), this.
      emit("request", e);
    }
    async _asyncWrite(e) {
      return new Promise((t, r) => {
        super.write(e, (i) => {
          if (i) {
            r(i);
            return;
          }
          t();
        });
      });
    }
    _sendBody() {
      let { body: e } = this.options, t = this.redirectUrls.length === 0 ? this : this._request ?? this;
      m.nodeStream(e) ? e.pipe(t) : m.generator(e) || m.asyncGenerator(e) ? (async () => {
        try {
          for await (let r of e)
            await this._asyncWrite(r);
          super.end();
        } catch (r) {
          this._beforeError(r);
        }
      })() : m.undefined(e) ? (this._cannotHaveBody || this._noPipe) && t.end() : (this._writeRequest(e, void 0, () => {
      }), t.end());
    }
    _prepareCache(e) {
      if (!Uc.has(e)) {
        let t = new rR((r, i) => {
          let n = r._request(r, i);
          return m.promise(n) && (n.once = (o, a) => {
            if (o === "error")
              (async () => {
                try {
                  await n;
                } catch (u) {
                  a(u);
                }
              })();
            else if (o === "abort")
              (async () => {
                try {
                  (await n).once("abort", a);
                } catch {
                }
              })();
            else
              throw new Error(`Unknown HTTP2 promise event: ${o}`);
            return n;
          }), n;
        }, e);
        Uc.set(e, t.request());
      }
    }
    async _createCacheableRequest(e, t) {
      return new Promise((r, i) => {
        Object.assign(t, vR(e));
        let n, o = Uc.get(t.cache)(t, async (a) => {
          if (a._readableState.autoDestroy = !1, n) {
            let u = /* @__PURE__ */ s(() => {
              a.req && (a.complete = a.req.res.complete);
            }, "fix");
            a.prependOnceListener("end", u), u(), (await n).emit("cacheableResponse", a);
          }
          r(a);
        });
        o.once("error", i), o.once("request", async (a) => {
          n = a, r(n);
        });
      });
    }
    async _makeRequest() {
      let { options: e } = this, { headers: t, username: r, password: i } = e, n = e.cookieJar;
      for (let l in t)
        if (m.undefined(t[l]))
          delete t[l];
        else if (m.null_(t[l]))
          throw new TypeError(`Use \`undefined\` instead of \`null\` to delete the \`${l}\` header`);
      if (e.decompress && m.undefined(t["accept-encoding"]) && (t["accept-encoding"] = GR ? "gzip, deflate, br" : "gzip, deflate"), r || i) {
        let l = Oc.Buffer.from(`${r}:${i}`).toString("base64");
        t.authorization = `Basic ${l}`;
      }
      if (n) {
        let l = await n.getCookieString(e.url.toString());
        m.nonEmptyString(l) && (t.cookie = l);
      }
      e.prefixUrl = "";
      let o;
      for (let l of e.hooks.beforeRequest) {
        let c = await l(e);
        if (!m.undefined(c)) {
          o = /* @__PURE__ */ s(() => c, "request");
          break;
        }
      }
      o || (o = e.getRequestFunction());
      let a = e.url;
      this._requestOptions = e.createNativeRequestOptions(), e.cache && (this._requestOptions._request = o, this._requestOptions.cache = e.cache,
      this._requestOptions.body = e.body, this._prepareCache(e.cache));
      let u = e.cache ? this._createCacheableRequest : o;
      try {
        let l = u(a, this._requestOptions);
        m.promise(l) && (l = await l), m.undefined(l) && (l = e.getFallbackRequestFunction()(a, this._requestOptions), m.promise(l) && (l = await l)),
        zR(l) ? this._onRequest(l) : this.writable ? (this.once("finish", () => {
          this._onResponse(l);
        }), this._sendBody()) : this._onResponse(l);
      } catch (l) {
        throw l instanceof Wn ? new A3(l, this) : l;
      }
    }
    async _error(e) {
      try {
        if (!(e instanceof Ko && !this.options.throwHttpErrors))
          for (let t of this.options.hooks.beforeError)
            e = await t(e);
      } catch (t) {
        e = new Te(t.message, t, this);
      }
      this.destroy(e);
    }
    _writeRequest(e, t, r) {
      !this._request || this._request.destroyed || this._request.write(e, t, (i) => {
        if (!i && !this._request.destroyed) {
          this._uploadedSize += Oc.Buffer.byteLength(e, t);
          let n = this.uploadProgress;
          n.percent < 1 && this.emit("uploadProgress", n);
        }
        r(i);
      });
    }
    /**
    The remote IP address.
    */
    get ip() {
      var e;
      return (e = this.socket) == null ? void 0 : e.remoteAddress;
    }
    /**
    Indicates whether the request has been aborted or not.
    */
    get isAborted() {
      return this._aborted;
    }
    get socket() {
      var e;
      return ((e = this._request) == null ? void 0 : e.socket) ?? void 0;
    }
    /**
    Progress event for downloading (receiving a response).
    */
    get downloadProgress() {
      let e;
      return this._responseSize ? e = this._downloadedSize / this._responseSize : this._responseSize === this._downloadedSize ? e = 1 : e = 0,
      {
        percent: e,
        transferred: this._downloadedSize,
        total: this._responseSize
      };
    }
    /**
    Progress event for uploading (sending a request).
    */
    get uploadProgress() {
      let e;
      return this._bodySize ? e = this._uploadedSize / this._bodySize : this._bodySize === this._uploadedSize ? e = 1 : e = 0, {
        percent: e,
        transferred: this._uploadedSize,
        total: this._bodySize
      };
    }
    /**
        The object contains the following properties:
    
        - `start` - Time when the request started.
        - `socket` - Time when a socket was assigned to the request.
        - `lookup` - Time when the DNS lookup finished.
        - `connect` - Time when the socket successfully connected.
        - `secureConnect` - Time when the socket securely connected.
        - `upload` - Time when the request finished uploading.
        - `response` - Time when the request fired `response` event.
        - `end` - Time when the response fired `end` event.
        - `error` - Time when the request fired `error` event.
        - `abort` - Time when the request fired `abort` event.
        - `phases`
            - `wait` - `timings.socket - timings.start`
            - `dns` - `timings.lookup - timings.socket`
            - `tcp` - `timings.connect - timings.lookup`
            - `tls` - `timings.secureConnect - timings.connect`
            - `request` - `timings.upload - (timings.secureConnect || timings.connect)`
            - `firstByte` - `timings.response - timings.upload`
            - `download` - `timings.end - timings.response`
            - `total` - `(timings.end || timings.error || timings.abort) - timings.start`
    
        If something has not been measured yet, it will be `undefined`.
    
        __Note__: The time is a `number` representing the milliseconds elapsed since the UNIX epoch.
        */
    get timings() {
      var e;
      return (e = this._request) == null ? void 0 : e.timings;
    }
    /**
    Whether the response was retrieved from the cache.
    */
    get isFromCache() {
      return this._isFromCache;
    }
    get reusedSocket() {
      var e;
      return (e = this._request) == null ? void 0 : e.reusedSocket;
    }
  }, XR = class extends Te {
    static {
      s(this, "CancelError2");
    }
    constructor(e) {
      super("Promise was canceled", {}, e), this.name = "CancelError", this.code = "ERR_CANCELED";
    }
    /**
    Whether the promise is canceled.
    */
    get isCanceled() {
      return !0;
    }
  }, QR = [
    "request",
    "response",
    "redirect",
    "uploadProgress",
    "downloadProgress"
  ];
  function P0(e) {
    let t, r, i, n = new x3.EventEmitter(), o = new Hc((u, l, c) => {
      c(() => {
        t.destroy();
      }), c.shouldReject = !1, c(() => {
        l(new XR(t));
      });
      let d = /* @__PURE__ */ s((p) => {
        var h;
        c(() => {
        });
        let f = e ?? new Zc(void 0, void 0, i);
        f.retryCount = p, f._noPipe = !0, t = f, f.once("response", async (_) => {
          let C = (_.headers["content-encoding"] ?? "").toLowerCase(), x = C === "gzip" || C === "deflate" || C === "br", { options: w } = f;
          if (x && !w.decompress)
            _.body = _.rawBody;
          else
            try {
              _.body = O0(_, w.responseType, w.parseJson, w.encoding);
            } catch (T) {
              if (_.body = _.rawBody.toString(), Yo(_)) {
                f._beforeError(T);
                return;
              }
            }
          try {
            let T = w.hooks.afterResponse;
            for (let [S, F] of T.entries())
              if (_ = await F(_, async (I) => {
                throw w.merge(I), w.prefixUrl = "", I.url && (w.url = I.url), w.hooks.afterResponse = w.hooks.afterResponse.slice(0, S), new k3(
                f);
              }), !(m.object(_) && m.number(_.statusCode) && !m.nullOrUndefined(_.body)))
                throw new TypeError("The `afterResponse` hook returned an invalid value");
          } catch (T) {
            f._beforeError(T);
            return;
          }
          if (r = _, !Yo(_)) {
            f._beforeError(new Ko(_));
            return;
          }
          f.destroy(), u(f.options.resolveBodyOnly ? _.body : _);
        });
        let g = /* @__PURE__ */ s((_) => {
          if (o.isCanceled)
            return;
          let { options: C } = f;
          if (_ instanceof Ko && !C.throwHttpErrors) {
            let { response: x } = _;
            f.destroy(), u(f.options.resolveBodyOnly ? x.body : x);
            return;
          }
          l(_);
        }, "onError");
        f.once("error", g);
        let E = (h = f.options) == null ? void 0 : h.body;
        f.once("retry", (_, C) => {
          e = void 0;
          let x = f.options.body;
          if (E === x && m.nodeStream(x)) {
            C.message = "Cannot retry with consumed body stream", g(C);
            return;
          }
          i = f.options, d(_);
        }), rv(f, n, QR), m.undefined(e) && f.flush();
      }, "makeRequest");
      d(0);
    });
    o.on = (u, l) => (n.on(u, l), o), o.off = (u, l) => (n.off(u, l), o);
    let a = /* @__PURE__ */ s((u) => {
      let l = (async () => {
        await o;
        let { options: c } = r.request;
        return O0(r, u, c.parseJson, c.encoding);
      })();
      return Object.defineProperties(l, Object.getOwnPropertyDescriptors(o)), l;
    }, "shortcut");
    return o.json = () => {
      if (t.options) {
        let { headers: u } = t.options;
        !t.writableFinished && !("accept" in u) && (u.accept = "application/json");
      }
      return a("json");
    }, o.buffer = () => a("buffer"), o.text = () => a("text"), o;
  }
  s(P0, "asPromise");
  var ek = /* @__PURE__ */ s(async (e) => new Promise((t) => {
    setTimeout(t, e);
  }), "delay"), tk = /* @__PURE__ */ s((e) => m.function_(e), "isGotInstance"), rk = [
    "get",
    "post",
    "put",
    "patch",
    "head",
    "delete"
  ], nv = /* @__PURE__ */ s((e) => {
    e = {
      options: new Ut(void 0, void 0, e.options),
      handlers: [...e.handlers],
      mutableDefaults: e.mutableDefaults
    }, Object.defineProperty(e, "mutableDefaults", {
      enumerable: !0,
      configurable: !1,
      writable: !1
    });
    let t = /* @__PURE__ */ s((i, n, o = e.options) => {
      let a = new Zc(i, n, o), u, l = /* @__PURE__ */ s((p) => (a.options = p, a._noPipe = !p.isStream, a.flush(), p.isStream ? a : (u || (u =
      P0(a)), u)), "lastHandler"), c = 0, d = /* @__PURE__ */ s((p) => {
        let f = (e.handlers[c++] ?? l)(p, d);
        if (m.promise(f) && !a.options.isStream && (u || (u = P0(a)), f !== u)) {
          let g = Object.getOwnPropertyDescriptors(u);
          for (let E in g)
            E in f && delete g[E];
          Object.defineProperties(f, g), f.cancel = u.cancel;
        }
        return f;
      }, "iterateHandlers");
      return d(a.options);
    }, "got2");
    t.extend = (...i) => {
      let n = new Ut(void 0, void 0, e.options), o = [...e.handlers], a;
      for (let u of i)
        tk(u) ? (n.merge(u.defaults.options), o.push(...u.defaults.handlers), a = u.defaults.mutableDefaults) : (n.merge(u), u.handlers && o.
        push(...u.handlers), a = u.mutableDefaults);
      return nv({
        options: n,
        handlers: o,
        mutableDefaults: !!a
      });
    };
    let r = /* @__PURE__ */ s(async function* (i, n) {
      let o = new Ut(i, n, e.options);
      o.resolveBodyOnly = !1;
      let { pagination: a } = o;
      A.function_(a.transform), A.function_(a.shouldContinue), A.function_(a.filter), A.function_(a.paginate), A.number(a.countLimit), A.number(
      a.requestLimit), A.number(a.backoff);
      let u = [], { countLimit: l } = a, c = 0;
      for (; c < a.requestLimit; ) {
        c !== 0 && await ek(a.backoff);
        let d = await t(void 0, void 0, o), p = await a.transform(d), h = [];
        A.array(p);
        for (let g of p)
          if (a.filter({ item: g, currentItems: h, allItems: u }) && (!a.shouldContinue({ item: g, currentItems: h, allItems: u }) || (yield g,
          a.stackAllItems && u.push(g), h.push(g), --l <= 0)))
            return;
        let f = a.paginate({
          response: d,
          currentItems: h,
          allItems: u
        });
        if (f === !1)
          return;
        f === d.request.options ? o = d.request.options : (o.merge(f), A.any([m.urlInstance, m.undefined], f.url), f.url !== void 0 && (o.prefixUrl =
        "", o.url = f.url)), c++;
      }
    }, "paginateEach");
    t.paginate = r, t.paginate.all = async (i, n) => {
      let o = [];
      for await (let a of r(i, n))
        o.push(a);
      return o;
    }, t.paginate.each = r, t.stream = (i, n) => t(i, { ...n, isStream: !0 });
    for (let i of rk)
      t[i] = (n, o) => t(n, { ...o, method: i }), t.stream[i] = (n, o) => t(n, { ...o, method: i, isStream: !0 });
    return e.mutableDefaults || (Object.freeze(e.handlers), e.options.freeze()), Object.defineProperty(t, "defaults", {
      value: e,
      writable: !1,
      configurable: !1,
      enumerable: !0
    }), t;
  }, "create"), ik = nv, nk = {
    options: new Ut(),
    handlers: [],
    mutableDefaults: !1
  }, sk = ik(nk), ok = sk, ak = Fe(Wu()), uk = yg(), lk = Fe(d0()), I0 = {
    keepAlive: !0,
    maxSockets: 20
  }, ck = {
    http: new d3.Agent(I0),
    https: new f3.Agent(I0)
  };
  async function dk({ url: e, gotOpts: t, extractOpts: r, dir: i }) {
    return new Promise((n, o) => {
      let a = /* @__PURE__ */ s((u) => {
        u ? o(u) : n();
      }, "callback");
      (0, ak.default)(
        ok.stream(e, Object.assign({ agent: ck }, t)),
        (0, lk.default)(),
        (0, uk.extract)(i, r),
        a
      );
    });
  }
  s(dk, "download");
});

// ../node_modules/get-npm-tarball-url/lib/index.js
var lv = b((xq, uv) => {
  var zc = Object.defineProperty, fk = Object.getOwnPropertyDescriptor, hk = Object.getOwnPropertyNames, pk = Object.prototype.hasOwnProperty,
  Dk = /* @__PURE__ */ s((e, t) => {
    for (var r in t)
      zc(e, r, { get: t[r], enumerable: !0 });
  }, "__export"), mk = /* @__PURE__ */ s((e, t, r, i) => {
    if (t && typeof t == "object" || typeof t == "function")
      for (let n of hk(t))
        !pk.call(e, n) && n !== r && zc(e, n, { get: /* @__PURE__ */ s(() => t[n], "get"), enumerable: !(i = fk(t, n)) || i.enumerable });
    return e;
  }, "__copyProps"), gk = /* @__PURE__ */ s((e) => mk(zc({}, "__esModule", { value: !0 }), e), "__toCommonJS"), av = {};
  Dk(av, {
    default: /* @__PURE__ */ s(() => yk, "default")
  });
  uv.exports = gk(av);
  function yk(e, t, r) {
    let i;
    r?.registry ? i = r.registry.endsWith("/") ? r.registry : `${r.registry}/` : i = "https://registry.npmjs.org/";
    let n = vk(e);
    return `${i}${e}/-/${n}-${bk(t)}.tgz`;
  }
  s(yk, "src_default");
  function bk(e) {
    let t = e.indexOf("+");
    return t === -1 ? e : e.substring(0, t);
  }
  s(bk, "removeBuildMetadataFromVersion");
  function vk(e) {
    return e[0] !== "@" ? e : e.split("/")[1];
  }
  s(vk, "getScopelessName");
});

// ../node_modules/eastasianwidth/eastasianwidth.js
var sd = b((Kq, nd) => {
  var nr = {};
  typeof nd > "u" ? window.eastasianwidth = nr : nd.exports = nr;
  nr.eastAsianWidth = function(e) {
    var t = e.charCodeAt(0), r = e.length == 2 ? e.charCodeAt(1) : 0, i = t;
    return 55296 <= t && t <= 56319 && 56320 <= r && r <= 57343 && (t &= 1023, r &= 1023, i = t << 10 | r, i += 65536), i == 12288 || 65281 <=
    i && i <= 65376 || 65504 <= i && i <= 65510 ? "F" : i == 8361 || 65377 <= i && i <= 65470 || 65474 <= i && i <= 65479 || 65482 <= i && i <=
    65487 || 65490 <= i && i <= 65495 || 65498 <= i && i <= 65500 || 65512 <= i && i <= 65518 ? "H" : 4352 <= i && i <= 4447 || 4515 <= i &&
    i <= 4519 || 4602 <= i && i <= 4607 || 9001 <= i && i <= 9002 || 11904 <= i && i <= 11929 || 11931 <= i && i <= 12019 || 12032 <= i && i <=
    12245 || 12272 <= i && i <= 12283 || 12289 <= i && i <= 12350 || 12353 <= i && i <= 12438 || 12441 <= i && i <= 12543 || 12549 <= i && i <=
    12589 || 12593 <= i && i <= 12686 || 12688 <= i && i <= 12730 || 12736 <= i && i <= 12771 || 12784 <= i && i <= 12830 || 12832 <= i && i <=
    12871 || 12880 <= i && i <= 13054 || 13056 <= i && i <= 19903 || 19968 <= i && i <= 42124 || 42128 <= i && i <= 42182 || 43360 <= i && i <=
    43388 || 44032 <= i && i <= 55203 || 55216 <= i && i <= 55238 || 55243 <= i && i <= 55291 || 63744 <= i && i <= 64255 || 65040 <= i && i <=
    65049 || 65072 <= i && i <= 65106 || 65108 <= i && i <= 65126 || 65128 <= i && i <= 65131 || 110592 <= i && i <= 110593 || 127488 <= i &&
    i <= 127490 || 127504 <= i && i <= 127546 || 127552 <= i && i <= 127560 || 127568 <= i && i <= 127569 || 131072 <= i && i <= 194367 || 177984 <=
    i && i <= 196605 || 196608 <= i && i <= 262141 ? "W" : 32 <= i && i <= 126 || 162 <= i && i <= 163 || 165 <= i && i <= 166 || i == 172 ||
    i == 175 || 10214 <= i && i <= 10221 || 10629 <= i && i <= 10630 ? "Na" : i == 161 || i == 164 || 167 <= i && i <= 168 || i == 170 || 173 <=
    i && i <= 174 || 176 <= i && i <= 180 || 182 <= i && i <= 186 || 188 <= i && i <= 191 || i == 198 || i == 208 || 215 <= i && i <= 216 ||
    222 <= i && i <= 225 || i == 230 || 232 <= i && i <= 234 || 236 <= i && i <= 237 || i == 240 || 242 <= i && i <= 243 || 247 <= i && i <=
    250 || i == 252 || i == 254 || i == 257 || i == 273 || i == 275 || i == 283 || 294 <= i && i <= 295 || i == 299 || 305 <= i && i <= 307 ||
    i == 312 || 319 <= i && i <= 322 || i == 324 || 328 <= i && i <= 331 || i == 333 || 338 <= i && i <= 339 || 358 <= i && i <= 359 || i ==
    363 || i == 462 || i == 464 || i == 466 || i == 468 || i == 470 || i == 472 || i == 474 || i == 476 || i == 593 || i == 609 || i == 708 ||
    i == 711 || 713 <= i && i <= 715 || i == 717 || i == 720 || 728 <= i && i <= 731 || i == 733 || i == 735 || 768 <= i && i <= 879 || 913 <=
    i && i <= 929 || 931 <= i && i <= 937 || 945 <= i && i <= 961 || 963 <= i && i <= 969 || i == 1025 || 1040 <= i && i <= 1103 || i == 1105 ||
    i == 8208 || 8211 <= i && i <= 8214 || 8216 <= i && i <= 8217 || 8220 <= i && i <= 8221 || 8224 <= i && i <= 8226 || 8228 <= i && i <= 8231 ||
    i == 8240 || 8242 <= i && i <= 8243 || i == 8245 || i == 8251 || i == 8254 || i == 8308 || i == 8319 || 8321 <= i && i <= 8324 || i == 8364 ||
    i == 8451 || i == 8453 || i == 8457 || i == 8467 || i == 8470 || 8481 <= i && i <= 8482 || i == 8486 || i == 8491 || 8531 <= i && i <= 8532 ||
    8539 <= i && i <= 8542 || 8544 <= i && i <= 8555 || 8560 <= i && i <= 8569 || i == 8585 || 8592 <= i && i <= 8601 || 8632 <= i && i <= 8633 ||
    i == 8658 || i == 8660 || i == 8679 || i == 8704 || 8706 <= i && i <= 8707 || 8711 <= i && i <= 8712 || i == 8715 || i == 8719 || i == 8721 ||
    i == 8725 || i == 8730 || 8733 <= i && i <= 8736 || i == 8739 || i == 8741 || 8743 <= i && i <= 8748 || i == 8750 || 8756 <= i && i <= 8759 ||
    8764 <= i && i <= 8765 || i == 8776 || i == 8780 || i == 8786 || 8800 <= i && i <= 8801 || 8804 <= i && i <= 8807 || 8810 <= i && i <= 8811 ||
    8814 <= i && i <= 8815 || 8834 <= i && i <= 8835 || 8838 <= i && i <= 8839 || i == 8853 || i == 8857 || i == 8869 || i == 8895 || i == 8978 ||
    9312 <= i && i <= 9449 || 9451 <= i && i <= 9547 || 9552 <= i && i <= 9587 || 9600 <= i && i <= 9615 || 9618 <= i && i <= 9621 || 9632 <=
    i && i <= 9633 || 9635 <= i && i <= 9641 || 9650 <= i && i <= 9651 || 9654 <= i && i <= 9655 || 9660 <= i && i <= 9661 || 9664 <= i && i <=
    9665 || 9670 <= i && i <= 9672 || i == 9675 || 9678 <= i && i <= 9681 || 9698 <= i && i <= 9701 || i == 9711 || 9733 <= i && i <= 9734 ||
    i == 9737 || 9742 <= i && i <= 9743 || 9748 <= i && i <= 9749 || i == 9756 || i == 9758 || i == 9792 || i == 9794 || 9824 <= i && i <= 9825 ||
    9827 <= i && i <= 9829 || 9831 <= i && i <= 9834 || 9836 <= i && i <= 9837 || i == 9839 || 9886 <= i && i <= 9887 || 9918 <= i && i <= 9919 ||
    9924 <= i && i <= 9933 || 9935 <= i && i <= 9953 || i == 9955 || 9960 <= i && i <= 9983 || i == 10045 || i == 10071 || 10102 <= i && i <=
    10111 || 11093 <= i && i <= 11097 || 12872 <= i && i <= 12879 || 57344 <= i && i <= 63743 || 65024 <= i && i <= 65039 || i == 65533 || 127232 <=
    i && i <= 127242 || 127248 <= i && i <= 127277 || 127280 <= i && i <= 127337 || 127344 <= i && i <= 127386 || 917760 <= i && i <= 917999 ||
    983040 <= i && i <= 1048573 || 1048576 <= i && i <= 1114109 ? "A" : "N";
  };
  nr.characterLength = function(e) {
    var t = this.eastAsianWidth(e);
    return t == "F" || t == "W" || t == "A" ? 2 : 1;
  };
  function Ev(e) {
    return e.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
  }
  s(Ev, "stringToArray");
  nr.length = function(e) {
    for (var t = Ev(e), r = 0, i = 0; i < t.length; i++)
      r = r + this.characterLength(t[i]);
    return r;
  };
  nr.slice = function(e, t, r) {
    textLen = nr.length(e), t = t || 0, r = r || 1, t < 0 && (t = textLen + t), r < 0 && (r = textLen + r);
    for (var i = "", n = 0, o = Ev(e), a = 0; a < o.length; a++) {
      var u = o[a], l = nr.length(u);
      if (n >= t - (l == 2 ? 1 : 0))
        if (n + l <= r)
          i += u;
        else
          break;
      n += l;
    }
    return i;
  };
});

// ../node_modules/emoji-regex/index.js
var od = b((Jq, Cv) => {
  "use strict";
  Cv.exports = function() {
    return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC68(?:\uD83C\uDFFB(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))?|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC)?|(?:\uD83D\uDC69(?:\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83E\uDDD1(?:\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83E\uDDD1(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\u2764\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|\u2764\uFE0F|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE2E\uDE35\uDE36\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
  };
});

// ../node_modules/cli-boxes/boxes.json
var qv = b((yL, cO) => {
  cO.exports = {
    single: {
      topLeft: "\u250C",
      top: "\u2500",
      topRight: "\u2510",
      right: "\u2502",
      bottomRight: "\u2518",
      bottom: "\u2500",
      bottomLeft: "\u2514",
      left: "\u2502"
    },
    double: {
      topLeft: "\u2554",
      top: "\u2550",
      topRight: "\u2557",
      right: "\u2551",
      bottomRight: "\u255D",
      bottom: "\u2550",
      bottomLeft: "\u255A",
      left: "\u2551"
    },
    round: {
      topLeft: "\u256D",
      top: "\u2500",
      topRight: "\u256E",
      right: "\u2502",
      bottomRight: "\u256F",
      bottom: "\u2500",
      bottomLeft: "\u2570",
      left: "\u2502"
    },
    bold: {
      topLeft: "\u250F",
      top: "\u2501",
      topRight: "\u2513",
      right: "\u2503",
      bottomRight: "\u251B",
      bottom: "\u2501",
      bottomLeft: "\u2517",
      left: "\u2503"
    },
    singleDouble: {
      topLeft: "\u2553",
      top: "\u2500",
      topRight: "\u2556",
      right: "\u2551",
      bottomRight: "\u255C",
      bottom: "\u2500",
      bottomLeft: "\u2559",
      left: "\u2551"
    },
    doubleSingle: {
      topLeft: "\u2552",
      top: "\u2550",
      topRight: "\u2555",
      right: "\u2502",
      bottomRight: "\u255B",
      bottom: "\u2550",
      bottomLeft: "\u2558",
      left: "\u2502"
    },
    classic: {
      topLeft: "+",
      top: "-",
      topRight: "+",
      right: "|",
      bottomRight: "+",
      bottom: "-",
      bottomLeft: "+",
      left: "|"
    },
    arrow: {
      topLeft: "\u2198",
      top: "\u2193",
      topRight: "\u2199",
      right: "\u2190",
      bottomRight: "\u2196",
      bottom: "\u2191",
      bottomLeft: "\u2197",
      left: "\u2192"
    }
  };
});

// ../node_modules/cli-boxes/index.js
var fd = b((bL, dd) => {
  "use strict";
  var Lv = qv();
  dd.exports = Lv;
  dd.exports.default = Lv;
});

// ../node_modules/string-width/node_modules/ansi-regex/index.js
var Vv = b((wL, Hv) => {
  "use strict";
  Hv.exports = ({ onlyFirst: e = !1 } = {}) => {
    let t = [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
    ].join("|");
    return new RegExp(t, e ? void 0 : "g");
  };
});

// ../node_modules/string-width/node_modules/strip-ansi/index.js
var zv = b((EL, Zv) => {
  "use strict";
  var gO = Vv();
  Zv.exports = (e) => typeof e == "string" ? e.replace(gO(), "") : e;
});

// ../node_modules/is-fullwidth-code-point/index.js
var Kv = b((CL, Dd) => {
  "use strict";
  var Gv = /* @__PURE__ */ s((e) => Number.isNaN(e) ? !1 : e >= 4352 && (e <= 4447 || // Hangul Jamo
  e === 9001 || // LEFT-POINTING ANGLE BRACKET
  e === 9002 || // RIGHT-POINTING ANGLE BRACKET
  // CJK Radicals Supplement .. Enclosed CJK Letters and Months
  11904 <= e && e <= 12871 && e !== 12351 || // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
  12880 <= e && e <= 19903 || // CJK Unified Ideographs .. Yi Radicals
  19968 <= e && e <= 42182 || // Hangul Jamo Extended-A
  43360 <= e && e <= 43388 || // Hangul Syllables
  44032 <= e && e <= 55203 || // CJK Compatibility Ideographs
  63744 <= e && e <= 64255 || // Vertical Forms
  65040 <= e && e <= 65049 || // CJK Compatibility Forms .. Small Form Variants
  65072 <= e && e <= 65131 || // Halfwidth and Fullwidth Forms
  65281 <= e && e <= 65376 || 65504 <= e && e <= 65510 || // Kana Supplement
  110592 <= e && e <= 110593 || // Enclosed Ideographic Supplement
  127488 <= e && e <= 127569 || // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
  131072 <= e && e <= 262141), "isFullwidthCodePoint");
  Dd.exports = Gv;
  Dd.exports.default = Gv;
});

// ../node_modules/string-width/node_modules/emoji-regex/index.js
var Jv = b((FL, Yv) => {
  "use strict";
  Yv.exports = function() {
    return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
  };
});

// ../node_modules/string-width/index.js
var Qv = b((SL, md) => {
  "use strict";
  var yO = zv(), bO = Kv(), vO = Jv(), Xv = /* @__PURE__ */ s((e) => {
    if (typeof e != "string" || e.length === 0 || (e = yO(e), e.length === 0))
      return 0;
    e = e.replace(vO(), "  ");
    let t = 0;
    for (let r = 0; r < e.length; r++) {
      let i = e.codePointAt(r);
      i <= 31 || i >= 127 && i <= 159 || i >= 768 && i <= 879 || (i > 65535 && r++, t += bO(i) ? 2 : 1);
    }
    return t;
  }, "stringWidth");
  md.exports = Xv;
  md.exports.default = Xv;
});

// ../node_modules/ansi-align/index.js
var t_ = b((AL, e_) => {
  "use strict";
  var _O = Qv();
  function Rr(e, t) {
    if (!e) return e;
    t = t || {};
    let r = t.align || "center";
    if (r === "left") return e;
    let i = t.split || `
`, n = t.pad || " ", o = r !== "right" ? wO : EO, a = !1;
    Array.isArray(e) || (a = !0, e = String(e).split(i));
    let u, l = 0;
    return e = e.map(function(c) {
      return c = String(c), u = _O(c), l = Math.max(u, l), {
        str: c,
        width: u
      };
    }).map(function(c) {
      return new Array(o(l, c.width) + 1).join(n) + c.str;
    }), a ? e.join(i) : e;
  }
  s(Rr, "ansiAlign");
  Rr.left = /* @__PURE__ */ s(function(t) {
    return Rr(t, { align: "left" });
  }, "left");
  Rr.center = /* @__PURE__ */ s(function(t) {
    return Rr(t, { align: "center" });
  }, "center");
  Rr.right = /* @__PURE__ */ s(function(t) {
    return Rr(t, { align: "right" });
  }, "right");
  e_.exports = Rr;
  function wO(e, t) {
    return Math.floor((e - t) / 2);
  }
  s(wO, "halfDiff");
  function EO(e, t) {
    return e - t;
  }
  s(EO, "fullDiff");
});

// ../node_modules/ts-dedent/dist/index.js
var ua = b((Qn) => {
  "use strict";
  Object.defineProperty(Qn, "__esModule", { value: !0 });
  Qn.dedent = void 0;
  function g_(e) {
    for (var t = [], r = 1; r < arguments.length; r++)
      t[r - 1] = arguments[r];
    var i = Array.from(typeof e == "string" ? [e] : e);
    i[i.length - 1] = i[i.length - 1].replace(/\r?\n([\t ]*)$/, "");
    var n = i.reduce(function(u, l) {
      var c = l.match(/\n([\t ]+|(?!\s).)/g);
      return c ? u.concat(c.map(function(d) {
        var p, h;
        return (h = (p = d.match(/[\t ]/g)) === null || p === void 0 ? void 0 : p.length) !== null && h !== void 0 ? h : 0;
      })) : u;
    }, []);
    if (n.length) {
      var o = new RegExp(`
[	 ]{` + Math.min.apply(Math, n) + "}", "g");
      i = i.map(function(u) {
        return u.replace(o, `
`);
      });
    }
    i[0] = i[0].replace(/^\r?\n/, "");
    var a = i[0];
    return t.forEach(function(u, l) {
      var c = a.match(/(?:^|\n)( *)$/), d = c ? c[1] : "", p = u;
      typeof u == "string" && u.includes(`
`) && (p = String(u).split(`
`).map(function(h, f) {
        return f === 0 ? h : "" + d + h;
      }).join(`
`)), a += p + i[l + 1];
    }), a;
  }
  s(g_, "dedent");
  Qn.dedent = g_;
  Qn.default = g_;
});

// ../node_modules/zod/lib/helpers/util.js
var is = b((ue) => {
  "use strict";
  Object.defineProperty(ue, "__esModule", { value: !0 });
  ue.getParsedType = ue.ZodParsedType = ue.objectUtil = ue.util = void 0;
  var Ad;
  (function(e) {
    e.assertEqual = (n) => n;
    function t(n) {
    }
    s(t, "assertIs"), e.assertIs = t;
    function r(n) {
      throw new Error();
    }
    s(r, "assertNever"), e.assertNever = r, e.arrayToEnum = (n) => {
      let o = {};
      for (let a of n)
        o[a] = a;
      return o;
    }, e.getValidEnumValues = (n) => {
      let o = e.objectKeys(n).filter((u) => typeof n[n[u]] != "number"), a = {};
      for (let u of o)
        a[u] = n[u];
      return e.objectValues(a);
    }, e.objectValues = (n) => e.objectKeys(n).map(function(o) {
      return n[o];
    }), e.objectKeys = typeof Object.keys == "function" ? (n) => Object.keys(n) : (n) => {
      let o = [];
      for (let a in n)
        Object.prototype.hasOwnProperty.call(n, a) && o.push(a);
      return o;
    }, e.find = (n, o) => {
      for (let a of n)
        if (o(a))
          return a;
    }, e.isInteger = typeof Number.isInteger == "function" ? (n) => Number.isInteger(n) : (n) => typeof n == "number" && isFinite(n) && Math.
    floor(n) === n;
    function i(n, o = " | ") {
      return n.map((a) => typeof a == "string" ? `'${a}'` : a).join(o);
    }
    s(i, "joinValues"), e.joinValues = i, e.jsonStringifyReplacer = (n, o) => typeof o == "bigint" ? o.toString() : o;
  })(Ad || (ue.util = Ad = {}));
  var T_;
  (function(e) {
    e.mergeShapes = (t, r) => ({
      ...t,
      ...r
      // second overwrites first
    });
  })(T_ || (ue.objectUtil = T_ = {}));
  ue.ZodParsedType = Ad.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set"
  ]);
  var QO = /* @__PURE__ */ s((e) => {
    switch (typeof e) {
      case "undefined":
        return ue.ZodParsedType.undefined;
      case "string":
        return ue.ZodParsedType.string;
      case "number":
        return isNaN(e) ? ue.ZodParsedType.nan : ue.ZodParsedType.number;
      case "boolean":
        return ue.ZodParsedType.boolean;
      case "function":
        return ue.ZodParsedType.function;
      case "bigint":
        return ue.ZodParsedType.bigint;
      case "symbol":
        return ue.ZodParsedType.symbol;
      case "object":
        return Array.isArray(e) ? ue.ZodParsedType.array : e === null ? ue.ZodParsedType.null : e.then && typeof e.then == "function" && e.catch &&
        typeof e.catch == "function" ? ue.ZodParsedType.promise : typeof Map < "u" && e instanceof Map ? ue.ZodParsedType.map : typeof Set <
        "u" && e instanceof Set ? ue.ZodParsedType.set : typeof Date < "u" && e instanceof Date ? ue.ZodParsedType.date : ue.ZodParsedType.object;
      default:
        return ue.ZodParsedType.unknown;
    }
  }, "getParsedType");
  ue.getParsedType = QO;
});

// ../node_modules/zod/lib/ZodError.js
var da = b((or) => {
  "use strict";
  Object.defineProperty(or, "__esModule", { value: !0 });
  or.ZodError = or.quotelessJson = or.ZodIssueCode = void 0;
  var A_ = is();
  or.ZodIssueCode = A_.util.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite"
  ]);
  var eB = /* @__PURE__ */ s((e) => JSON.stringify(e, null, 2).replace(/"([^"]+)":/g, "$1:"), "quotelessJson");
  or.quotelessJson = eB;
  var ns = class e extends Error {
    static {
      s(this, "ZodError");
    }
    get errors() {
      return this.issues;
    }
    constructor(t) {
      super(), this.issues = [], this.addIssue = (i) => {
        this.issues = [...this.issues, i];
      }, this.addIssues = (i = []) => {
        this.issues = [...this.issues, ...i];
      };
      let r = new.target.prototype;
      Object.setPrototypeOf ? Object.setPrototypeOf(this, r) : this.__proto__ = r, this.name = "ZodError", this.issues = t;
    }
    format(t) {
      let r = t || function(o) {
        return o.message;
      }, i = { _errors: [] }, n = /* @__PURE__ */ s((o) => {
        for (let a of o.issues)
          if (a.code === "invalid_union")
            a.unionErrors.map(n);
          else if (a.code === "invalid_return_type")
            n(a.returnTypeError);
          else if (a.code === "invalid_arguments")
            n(a.argumentsError);
          else if (a.path.length === 0)
            i._errors.push(r(a));
          else {
            let u = i, l = 0;
            for (; l < a.path.length; ) {
              let c = a.path[l];
              l === a.path.length - 1 ? (u[c] = u[c] || { _errors: [] }, u[c]._errors.push(r(a))) : u[c] = u[c] || { _errors: [] }, u = u[c],
              l++;
            }
          }
      }, "processError");
      return n(this), i;
    }
    static assert(t) {
      if (!(t instanceof e))
        throw new Error(`Not a ZodError: ${t}`);
    }
    toString() {
      return this.message;
    }
    get message() {
      return JSON.stringify(this.issues, A_.util.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
      return this.issues.length === 0;
    }
    flatten(t = (r) => r.message) {
      let r = {}, i = [];
      for (let n of this.issues)
        n.path.length > 0 ? (r[n.path[0]] = r[n.path[0]] || [], r[n.path[0]].push(t(n))) : i.push(t(n));
      return { formErrors: i, fieldErrors: r };
    }
    get formErrors() {
      return this.flatten();
    }
  };
  or.ZodError = ns;
  ns.create = (e) => new ns(e);
});

// ../node_modules/zod/lib/locales/en.js
var kd = b((Rd) => {
  "use strict";
  Object.defineProperty(Rd, "__esModule", { value: !0 });
  var Or = is(), qe = da(), tB = /* @__PURE__ */ s((e, t) => {
    let r;
    switch (e.code) {
      case qe.ZodIssueCode.invalid_type:
        e.received === Or.ZodParsedType.undefined ? r = "Required" : r = `Expected ${e.expected}, received ${e.received}`;
        break;
      case qe.ZodIssueCode.invalid_literal:
        r = `Invalid literal value, expected ${JSON.stringify(e.expected, Or.util.jsonStringifyReplacer)}`;
        break;
      case qe.ZodIssueCode.unrecognized_keys:
        r = `Unrecognized key(s) in object: ${Or.util.joinValues(e.keys, ", ")}`;
        break;
      case qe.ZodIssueCode.invalid_union:
        r = "Invalid input";
        break;
      case qe.ZodIssueCode.invalid_union_discriminator:
        r = `Invalid discriminator value. Expected ${Or.util.joinValues(e.options)}`;
        break;
      case qe.ZodIssueCode.invalid_enum_value:
        r = `Invalid enum value. Expected ${Or.util.joinValues(e.options)}, received '${e.received}'`;
        break;
      case qe.ZodIssueCode.invalid_arguments:
        r = "Invalid function arguments";
        break;
      case qe.ZodIssueCode.invalid_return_type:
        r = "Invalid function return type";
        break;
      case qe.ZodIssueCode.invalid_date:
        r = "Invalid date";
        break;
      case qe.ZodIssueCode.invalid_string:
        typeof e.validation == "object" ? "includes" in e.validation ? (r = `Invalid input: must include "${e.validation.includes}"`, typeof e.
        validation.position == "number" && (r = `${r} at one or more positions greater than or equal to ${e.validation.position}`)) : "start\
sWith" in e.validation ? r = `Invalid input: must start with "${e.validation.startsWith}"` : "endsWith" in e.validation ? r = `Invalid input\
: must end with "${e.validation.endsWith}"` : Or.util.assertNever(e.validation) : e.validation !== "regex" ? r = `Invalid ${e.validation}` :
        r = "Invalid";
        break;
      case qe.ZodIssueCode.too_small:
        e.type === "array" ? r = `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "more than"} ${e.minimum} element(s)` :
        e.type === "string" ? r = `String must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "over"} ${e.minimum} character(s)` :
        e.type === "number" ? r = `Number must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater tha\
n "}${e.minimum}` : e.type === "date" ? r = `Date must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "gre\
ater than "}${new Date(Number(e.minimum))}` : r = "Invalid input";
        break;
      case qe.ZodIssueCode.too_big:
        e.type === "array" ? r = `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "less than"} ${e.maximum} element(s)` :
        e.type === "string" ? r = `String must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "under"} ${e.maximum} character(s)` :
        e.type === "number" ? r = `Number must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` :
        e.type === "bigint" ? r = `BigInt must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` :
        e.type === "date" ? r = `Date must be ${e.exact ? "exactly" : e.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(
        Number(e.maximum))}` : r = "Invalid input";
        break;
      case qe.ZodIssueCode.custom:
        r = "Invalid input";
        break;
      case qe.ZodIssueCode.invalid_intersection_types:
        r = "Intersection results could not be merged";
        break;
      case qe.ZodIssueCode.not_multiple_of:
        r = `Number must be a multiple of ${e.multipleOf}`;
        break;
      case qe.ZodIssueCode.not_finite:
        r = "Number must be finite";
        break;
      default:
        r = t.defaultError, Or.util.assertNever(e);
    }
    return { message: r };
  }, "errorMap");
  Rd.default = tB;
});

// ../node_modules/zod/lib/errors.js
var fa = b((bt) => {
  "use strict";
  var rB = bt && bt.__importDefault || function(e) {
    return e && e.__esModule ? e : { default: e };
  };
  Object.defineProperty(bt, "__esModule", { value: !0 });
  bt.getErrorMap = bt.setErrorMap = bt.defaultErrorMap = void 0;
  var R_ = rB(kd());
  bt.defaultErrorMap = R_.default;
  var k_ = R_.default;
  function iB(e) {
    k_ = e;
  }
  s(iB, "setErrorMap");
  bt.setErrorMap = iB;
  function nB() {
    return k_;
  }
  s(nB, "getErrorMap");
  bt.getErrorMap = nB;
});

// ../node_modules/zod/lib/helpers/parseUtil.js
var Bd = b((te) => {
  "use strict";
  var sB = te && te.__importDefault || function(e) {
    return e && e.__esModule ? e : { default: e };
  };
  Object.defineProperty(te, "__esModule", { value: !0 });
  te.isAsync = te.isValid = te.isDirty = te.isAborted = te.OK = te.DIRTY = te.INVALID = te.ParseStatus = te.addIssueToContext = te.EMPTY_PATH =
  te.makeIssue = void 0;
  var oB = fa(), O_ = sB(kd()), aB = /* @__PURE__ */ s((e) => {
    let { data: t, path: r, errorMaps: i, issueData: n } = e, o = [...r, ...n.path || []], a = {
      ...n,
      path: o
    };
    if (n.message !== void 0)
      return {
        ...n,
        path: o,
        message: n.message
      };
    let u = "", l = i.filter((c) => !!c).slice().reverse();
    for (let c of l)
      u = c(a, { data: t, defaultError: u }).message;
    return {
      ...n,
      path: o,
      message: u
    };
  }, "makeIssue");
  te.makeIssue = aB;
  te.EMPTY_PATH = [];
  function uB(e, t) {
    let r = (0, oB.getErrorMap)(), i = (0, te.makeIssue)({
      issueData: t,
      data: e.data,
      path: e.path,
      errorMaps: [
        e.common.contextualErrorMap,
        // contextual error map is first priority
        e.schemaErrorMap,
        // then schema-bound map if available
        r,
        // then global override map
        r === O_.default ? void 0 : O_.default
        // then global default map
      ].filter((n) => !!n)
    });
    e.common.issues.push(i);
  }
  s(uB, "addIssueToContext");
  te.addIssueToContext = uB;
  var Od = class e {
    static {
      s(this, "ParseStatus");
    }
    constructor() {
      this.value = "valid";
    }
    dirty() {
      this.value === "valid" && (this.value = "dirty");
    }
    abort() {
      this.value !== "aborted" && (this.value = "aborted");
    }
    static mergeArray(t, r) {
      let i = [];
      for (let n of r) {
        if (n.status === "aborted")
          return te.INVALID;
        n.status === "dirty" && t.dirty(), i.push(n.value);
      }
      return { status: t.value, value: i };
    }
    static async mergeObjectAsync(t, r) {
      let i = [];
      for (let n of r) {
        let o = await n.key, a = await n.value;
        i.push({
          key: o,
          value: a
        });
      }
      return e.mergeObjectSync(t, i);
    }
    static mergeObjectSync(t, r) {
      let i = {};
      for (let n of r) {
        let { key: o, value: a } = n;
        if (o.status === "aborted" || a.status === "aborted")
          return te.INVALID;
        o.status === "dirty" && t.dirty(), a.status === "dirty" && t.dirty(), o.value !== "__proto__" && (typeof a.value < "u" || n.alwaysSet) &&
        (i[o.value] = a.value);
      }
      return { status: t.value, value: i };
    }
  };
  te.ParseStatus = Od;
  te.INVALID = Object.freeze({
    status: "aborted"
  });
  var lB = /* @__PURE__ */ s((e) => ({ status: "dirty", value: e }), "DIRTY");
  te.DIRTY = lB;
  var cB = /* @__PURE__ */ s((e) => ({ status: "valid", value: e }), "OK");
  te.OK = cB;
  var dB = /* @__PURE__ */ s((e) => e.status === "aborted", "isAborted");
  te.isAborted = dB;
  var fB = /* @__PURE__ */ s((e) => e.status === "dirty", "isDirty");
  te.isDirty = fB;
  var hB = /* @__PURE__ */ s((e) => e.status === "valid", "isValid");
  te.isValid = hB;
  var pB = /* @__PURE__ */ s((e) => typeof Promise < "u" && e instanceof Promise, "isAsync");
  te.isAsync = pB;
});

// ../node_modules/zod/lib/helpers/typeAliases.js
var P_ = b((B_) => {
  "use strict";
  Object.defineProperty(B_, "__esModule", { value: !0 });
});

// ../node_modules/zod/lib/helpers/errorUtil.js
var M_ = b((ha) => {
  "use strict";
  Object.defineProperty(ha, "__esModule", { value: !0 });
  ha.errorUtil = void 0;
  var I_;
  (function(e) {
    e.errToObj = (t) => typeof t == "string" ? { message: t } : t || {}, e.toString = (t) => typeof t == "string" ? t : t?.message;
  })(I_ || (ha.errorUtil = I_ = {}));
});

// ../node_modules/zod/lib/types.js
var G_ = b((y) => {
  "use strict";
  var Da = y && y.__classPrivateFieldGet || function(e, t, r, i) {
    if (r === "a" && !i) throw new TypeError("Private accessor was defined without a getter");
    if (typeof t == "function" ? e !== t || !i : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did n\
ot declare it");
    return r === "m" ? i : r === "a" ? i.call(e) : i ? i.value : t.get(e);
  }, q_ = y && y.__classPrivateFieldSet || function(e, t, r, i, n) {
    if (i === "m") throw new TypeError("Private method is not writable");
    if (i === "a" && !n) throw new TypeError("Private accessor was defined without a setter");
    if (typeof t == "function" ? e !== t || !n : !t.has(e)) throw new TypeError("Cannot write private member to an object whose class did no\
t declare it");
    return i === "a" ? n.call(e, r) : n ? n.value = r : t.set(e, r), r;
  }, ss, os;
  Object.defineProperty(y, "__esModule", { value: !0 });
  y.boolean = y.bigint = y.array = y.any = y.coerce = y.ZodFirstPartyTypeKind = y.late = y.ZodSchema = y.Schema = y.custom = y.ZodReadonly =
  y.ZodPipeline = y.ZodBranded = y.BRAND = y.ZodNaN = y.ZodCatch = y.ZodDefault = y.ZodNullable = y.ZodOptional = y.ZodTransformer = y.ZodEffects =
  y.ZodPromise = y.ZodNativeEnum = y.ZodEnum = y.ZodLiteral = y.ZodLazy = y.ZodFunction = y.ZodSet = y.ZodMap = y.ZodRecord = y.ZodTuple = y.
  ZodIntersection = y.ZodDiscriminatedUnion = y.ZodUnion = y.ZodObject = y.ZodArray = y.ZodVoid = y.ZodNever = y.ZodUnknown = y.ZodAny = y.ZodNull =
  y.ZodUndefined = y.ZodSymbol = y.ZodDate = y.ZodBoolean = y.ZodBigInt = y.ZodNumber = y.ZodString = y.datetimeRegex = y.ZodType = void 0;
  y.NEVER = y.void = y.unknown = y.union = y.undefined = y.tuple = y.transformer = y.symbol = y.string = y.strictObject = y.set = y.record =
  y.promise = y.preprocess = y.pipeline = y.ostring = y.optional = y.onumber = y.oboolean = y.object = y.number = y.nullable = y.null = y.never =
  y.nativeEnum = y.nan = y.map = y.literal = y.lazy = y.intersection = y.instanceof = y.function = y.enum = y.effect = y.discriminatedUnion =
  y.date = void 0;
  var pa = fa(), L = M_(), v = Bd(), O = is(), R = da(), Qe = class {
    static {
      s(this, "ParseInputLazyPath");
    }
    constructor(t, r, i, n) {
      this._cachedPath = [], this.parent = t, this.data = r, this._path = i, this._key = n;
    }
    get path() {
      return this._cachedPath.length || (this._key instanceof Array ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.
      push(...this._path, this._key)), this._cachedPath;
    }
  }, j_ = /* @__PURE__ */ s((e, t) => {
    if ((0, v.isValid)(t))
      return { success: !0, data: t.value };
    if (!e.common.issues.length)
      throw new Error("Validation failed but no issues detected.");
    return {
      success: !1,
      get error() {
        if (this._error)
          return this._error;
        let r = new R.ZodError(e.common.issues);
        return this._error = r, this._error;
      }
    };
  }, "handleResult");
  function $(e) {
    if (!e)
      return {};
    let { errorMap: t, invalid_type_error: r, required_error: i, description: n } = e;
    if (t && (r || i))
      throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    return t ? { errorMap: t, description: n } : { errorMap: /* @__PURE__ */ s((a, u) => {
      var l, c;
      let { message: d } = e;
      return a.code === "invalid_enum_value" ? { message: d ?? u.defaultError } : typeof u.data > "u" ? { message: (l = d ?? i) !== null && l !==
      void 0 ? l : u.defaultError } : a.code !== "invalid_type" ? { message: u.defaultError } : { message: (c = d ?? r) !== null && c !== void 0 ?
      c : u.defaultError };
    }, "customMap"), description: n };
  }
  s($, "processCreateParams");
  var W = class {
    static {
      s(this, "ZodType");
    }
    get description() {
      return this._def.description;
    }
    _getType(t) {
      return (0, O.getParsedType)(t.data);
    }
    _getOrReturnCtx(t, r) {
      return r || {
        common: t.parent.common,
        data: t.data,
        parsedType: (0, O.getParsedType)(t.data),
        schemaErrorMap: this._def.errorMap,
        path: t.path,
        parent: t.parent
      };
    }
    _processInputParams(t) {
      return {
        status: new v.ParseStatus(),
        ctx: {
          common: t.parent.common,
          data: t.data,
          parsedType: (0, O.getParsedType)(t.data),
          schemaErrorMap: this._def.errorMap,
          path: t.path,
          parent: t.parent
        }
      };
    }
    _parseSync(t) {
      let r = this._parse(t);
      if ((0, v.isAsync)(r))
        throw new Error("Synchronous parse encountered promise.");
      return r;
    }
    _parseAsync(t) {
      let r = this._parse(t);
      return Promise.resolve(r);
    }
    parse(t, r) {
      let i = this.safeParse(t, r);
      if (i.success)
        return i.data;
      throw i.error;
    }
    safeParse(t, r) {
      var i;
      let n = {
        common: {
          issues: [],
          async: (i = r?.async) !== null && i !== void 0 ? i : !1,
          contextualErrorMap: r?.errorMap
        },
        path: r?.path || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: t,
        parsedType: (0, O.getParsedType)(t)
      }, o = this._parseSync({ data: t, path: n.path, parent: n });
      return j_(n, o);
    }
    "~validate"(t) {
      var r, i;
      let n = {
        common: {
          issues: [],
          async: !!this["~standard"].async
        },
        path: [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: t,
        parsedType: (0, O.getParsedType)(t)
      };
      if (!this["~standard"].async)
        try {
          let o = this._parseSync({ data: t, path: [], parent: n });
          return (0, v.isValid)(o) ? {
            value: o.value
          } : {
            issues: n.common.issues
          };
        } catch (o) {
          !((i = (r = o?.message) === null || r === void 0 ? void 0 : r.toLowerCase()) === null || i === void 0) && i.includes("encountered") &&
          (this["~standard"].async = !0), n.common = {
            issues: [],
            async: !0
          };
        }
      return this._parseAsync({ data: t, path: [], parent: n }).then((o) => (0, v.isValid)(o) ? {
        value: o.value
      } : {
        issues: n.common.issues
      });
    }
    async parseAsync(t, r) {
      let i = await this.safeParseAsync(t, r);
      if (i.success)
        return i.data;
      throw i.error;
    }
    async safeParseAsync(t, r) {
      let i = {
        common: {
          issues: [],
          contextualErrorMap: r?.errorMap,
          async: !0
        },
        path: r?.path || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data: t,
        parsedType: (0, O.getParsedType)(t)
      }, n = this._parse({ data: t, path: i.path, parent: i }), o = await ((0, v.isAsync)(n) ? n : Promise.resolve(n));
      return j_(i, o);
    }
    refine(t, r) {
      let i = /* @__PURE__ */ s((n) => typeof r == "string" || typeof r > "u" ? { message: r } : typeof r == "function" ? r(n) : r, "getIssu\
eProperties");
      return this._refinement((n, o) => {
        let a = t(n), u = /* @__PURE__ */ s(() => o.addIssue({
          code: R.ZodIssueCode.custom,
          ...i(n)
        }), "setError");
        return typeof Promise < "u" && a instanceof Promise ? a.then((l) => l ? !0 : (u(), !1)) : a ? !0 : (u(), !1);
      });
    }
    refinement(t, r) {
      return this._refinement((i, n) => t(i) ? !0 : (n.addIssue(typeof r == "function" ? r(i, n) : r), !1));
    }
    _refinement(t) {
      return new Ze({
        schema: this,
        typeName: N.ZodEffects,
        effect: { type: "refinement", refinement: t }
      });
    }
    superRefine(t) {
      return this._refinement(t);
    }
    constructor(t) {
      this.spa = this.safeParseAsync, this._def = t, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync =
      this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.
      bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.
      bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.
      promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(
      this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe =
      this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.
      bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
        version: 1,
        vendor: "zod",
        validate: /* @__PURE__ */ s((r) => this["~validate"](r), "validate")
      };
    }
    optional() {
      return Xe.create(this, this._def);
    }
    nullable() {
      return _t.create(this, this._def);
    }
    nullish() {
      return this.nullable().optional();
    }
    array() {
      return Ht.create(this);
    }
    promise() {
      return lr.create(this, this._def);
    }
    or(t) {
      return Lr.create([this, t], this._def);
    }
    and(t) {
      return Nr.create(this, t, this._def);
    }
    transform(t) {
      return new Ze({
        ...$(this._def),
        schema: this,
        typeName: N.ZodEffects,
        effect: { type: "transform", transform: t }
      });
    }
    default(t) {
      let r = typeof t == "function" ? t : () => t;
      return new Vr({
        ...$(this._def),
        innerType: this,
        defaultValue: r,
        typeName: N.ZodDefault
      });
    }
    brand() {
      return new as({
        typeName: N.ZodBranded,
        type: this,
        ...$(this._def)
      });
    }
    catch(t) {
      let r = typeof t == "function" ? t : () => t;
      return new Zr({
        ...$(this._def),
        innerType: this,
        catchValue: r,
        typeName: N.ZodCatch
      });
    }
    describe(t) {
      let r = this.constructor;
      return new r({
        ...this._def,
        description: t
      });
    }
    pipe(t) {
      return us.create(this, t);
    }
    readonly() {
      return zr.create(this);
    }
    isOptional() {
      return this.safeParse(void 0).success;
    }
    isNullable() {
      return this.safeParse(null).success;
    }
  };
  y.ZodType = W;
  y.Schema = W;
  y.ZodSchema = W;
  var DB = /^c[^\s-]{8,}$/i, mB = /^[0-9a-z]+$/, gB = /^[0-9A-HJKMNP-TV-Z]{26}$/i, yB = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
  bB = /^[a-z0-9_-]{21}$/i, vB = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, _B = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,
  wB = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, EB = "^(\\p{Extended_Pictographic}|\\p{Emoji_Comp\
onent})+$", Pd, CB = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, xB = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  FB = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
  SB = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  TB = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, AB = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  L_ = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469\
]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", RB = new RegExp(`^${L_}$`);
  function N_(e) {
    let t = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
    return e.precision ? t = `${t}\\.\\d{${e.precision}}` : e.precision == null && (t = `${t}(\\.\\d+)?`), t;
  }
  s(N_, "timeRegexSource");
  function kB(e) {
    return new RegExp(`^${N_(e)}$`);
  }
  s(kB, "timeRegex");
  function U_(e) {
    let t = `${L_}T${N_(e)}`, r = [];
    return r.push(e.local ? "Z?" : "Z"), e.offset && r.push("([+-]\\d{2}:?\\d{2})"), t = `${t}(${r.join("|")})`, new RegExp(`^${t}$`);
  }
  s(U_, "datetimeRegex");
  y.datetimeRegex = U_;
  function OB(e, t) {
    return !!((t === "v4" || !t) && CB.test(e) || (t === "v6" || !t) && FB.test(e));
  }
  s(OB, "isValidIP");
  function BB(e, t) {
    if (!vB.test(e))
      return !1;
    try {
      let [r] = e.split("."), i = r.replace(/-/g, "+").replace(/_/g, "/").padEnd(r.length + (4 - r.length % 4) % 4, "="), n = JSON.parse(atob(
      i));
      return !(typeof n != "object" || n === null || !n.typ || !n.alg || t && n.alg !== t);
    } catch {
      return !1;
    }
  }
  s(BB, "isValidJWT");
  function PB(e, t) {
    return !!((t === "v4" || !t) && xB.test(e) || (t === "v6" || !t) && SB.test(e));
  }
  s(PB, "isValidCidr");
  var ar = class e extends W {
    static {
      s(this, "ZodString");
    }
    _parse(t) {
      if (this._def.coerce && (t.data = String(t.data)), this._getType(t) !== O.ZodParsedType.string) {
        let o = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(o, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.string,
          received: o.parsedType
        }), v.INVALID;
      }
      let i = new v.ParseStatus(), n;
      for (let o of this._def.checks)
        if (o.kind === "min")
          t.data.length < o.value && (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            code: R.ZodIssueCode.too_small,
            minimum: o.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: o.message
          }), i.dirty());
        else if (o.kind === "max")
          t.data.length > o.value && (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            code: R.ZodIssueCode.too_big,
            maximum: o.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: o.message
          }), i.dirty());
        else if (o.kind === "length") {
          let a = t.data.length > o.value, u = t.data.length < o.value;
          (a || u) && (n = this._getOrReturnCtx(t, n), a ? (0, v.addIssueToContext)(n, {
            code: R.ZodIssueCode.too_big,
            maximum: o.value,
            type: "string",
            inclusive: !0,
            exact: !0,
            message: o.message
          }) : u && (0, v.addIssueToContext)(n, {
            code: R.ZodIssueCode.too_small,
            minimum: o.value,
            type: "string",
            inclusive: !0,
            exact: !0,
            message: o.message
          }), i.dirty());
        } else if (o.kind === "email")
          wB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            validation: "email",
            code: R.ZodIssueCode.invalid_string,
            message: o.message
          }), i.dirty());
        else if (o.kind === "emoji")
          Pd || (Pd = new RegExp(EB, "u")), Pd.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            validation: "emoji",
            code: R.ZodIssueCode.invalid_string,
            message: o.message
          }), i.dirty());
        else if (o.kind === "uuid")
          yB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            validation: "uuid",
            code: R.ZodIssueCode.invalid_string,
            message: o.message
          }), i.dirty());
        else if (o.kind === "nanoid")
          bB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            validation: "nanoid",
            code: R.ZodIssueCode.invalid_string,
            message: o.message
          }), i.dirty());
        else if (o.kind === "cuid")
          DB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            validation: "cuid",
            code: R.ZodIssueCode.invalid_string,
            message: o.message
          }), i.dirty());
        else if (o.kind === "cuid2")
          mB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            validation: "cuid2",
            code: R.ZodIssueCode.invalid_string,
            message: o.message
          }), i.dirty());
        else if (o.kind === "ulid")
          gB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            validation: "ulid",
            code: R.ZodIssueCode.invalid_string,
            message: o.message
          }), i.dirty());
        else if (o.kind === "url")
          try {
            new URL(t.data);
          } catch {
            n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
              validation: "url",
              code: R.ZodIssueCode.invalid_string,
              message: o.message
            }), i.dirty();
          }
        else o.kind === "regex" ? (o.regex.lastIndex = 0, o.regex.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(
        n, {
          validation: "regex",
          code: R.ZodIssueCode.invalid_string,
          message: o.message
        }), i.dirty())) : o.kind === "trim" ? t.data = t.data.trim() : o.kind === "includes" ? t.data.includes(o.value, o.position) || (n = this.
        _getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: R.ZodIssueCode.invalid_string,
          validation: { includes: o.value, position: o.position },
          message: o.message
        }), i.dirty()) : o.kind === "toLowerCase" ? t.data = t.data.toLowerCase() : o.kind === "toUpperCase" ? t.data = t.data.toUpperCase() :
        o.kind === "startsWith" ? t.data.startsWith(o.value) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: R.ZodIssueCode.invalid_string,
          validation: { startsWith: o.value },
          message: o.message
        }), i.dirty()) : o.kind === "endsWith" ? t.data.endsWith(o.value) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: R.ZodIssueCode.invalid_string,
          validation: { endsWith: o.value },
          message: o.message
        }), i.dirty()) : o.kind === "datetime" ? U_(o).test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: R.ZodIssueCode.invalid_string,
          validation: "datetime",
          message: o.message
        }), i.dirty()) : o.kind === "date" ? RB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: R.ZodIssueCode.invalid_string,
          validation: "date",
          message: o.message
        }), i.dirty()) : o.kind === "time" ? kB(o).test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: R.ZodIssueCode.invalid_string,
          validation: "time",
          message: o.message
        }), i.dirty()) : o.kind === "duration" ? _B.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          validation: "duration",
          code: R.ZodIssueCode.invalid_string,
          message: o.message
        }), i.dirty()) : o.kind === "ip" ? OB(t.data, o.version) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          validation: "ip",
          code: R.ZodIssueCode.invalid_string,
          message: o.message
        }), i.dirty()) : o.kind === "jwt" ? BB(t.data, o.alg) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          validation: "jwt",
          code: R.ZodIssueCode.invalid_string,
          message: o.message
        }), i.dirty()) : o.kind === "cidr" ? PB(t.data, o.version) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          validation: "cidr",
          code: R.ZodIssueCode.invalid_string,
          message: o.message
        }), i.dirty()) : o.kind === "base64" ? TB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          validation: "base64",
          code: R.ZodIssueCode.invalid_string,
          message: o.message
        }), i.dirty()) : o.kind === "base64url" ? AB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          validation: "base64url",
          code: R.ZodIssueCode.invalid_string,
          message: o.message
        }), i.dirty()) : O.util.assertNever(o);
      return { status: i.value, value: t.data };
    }
    _regex(t, r, i) {
      return this.refinement((n) => t.test(n), {
        validation: r,
        code: R.ZodIssueCode.invalid_string,
        ...L.errorUtil.errToObj(i)
      });
    }
    _addCheck(t) {
      return new e({
        ...this._def,
        checks: [...this._def.checks, t]
      });
    }
    email(t) {
      return this._addCheck({ kind: "email", ...L.errorUtil.errToObj(t) });
    }
    url(t) {
      return this._addCheck({ kind: "url", ...L.errorUtil.errToObj(t) });
    }
    emoji(t) {
      return this._addCheck({ kind: "emoji", ...L.errorUtil.errToObj(t) });
    }
    uuid(t) {
      return this._addCheck({ kind: "uuid", ...L.errorUtil.errToObj(t) });
    }
    nanoid(t) {
      return this._addCheck({ kind: "nanoid", ...L.errorUtil.errToObj(t) });
    }
    cuid(t) {
      return this._addCheck({ kind: "cuid", ...L.errorUtil.errToObj(t) });
    }
    cuid2(t) {
      return this._addCheck({ kind: "cuid2", ...L.errorUtil.errToObj(t) });
    }
    ulid(t) {
      return this._addCheck({ kind: "ulid", ...L.errorUtil.errToObj(t) });
    }
    base64(t) {
      return this._addCheck({ kind: "base64", ...L.errorUtil.errToObj(t) });
    }
    base64url(t) {
      return this._addCheck({
        kind: "base64url",
        ...L.errorUtil.errToObj(t)
      });
    }
    jwt(t) {
      return this._addCheck({ kind: "jwt", ...L.errorUtil.errToObj(t) });
    }
    ip(t) {
      return this._addCheck({ kind: "ip", ...L.errorUtil.errToObj(t) });
    }
    cidr(t) {
      return this._addCheck({ kind: "cidr", ...L.errorUtil.errToObj(t) });
    }
    datetime(t) {
      var r, i;
      return typeof t == "string" ? this._addCheck({
        kind: "datetime",
        precision: null,
        offset: !1,
        local: !1,
        message: t
      }) : this._addCheck({
        kind: "datetime",
        precision: typeof t?.precision > "u" ? null : t?.precision,
        offset: (r = t?.offset) !== null && r !== void 0 ? r : !1,
        local: (i = t?.local) !== null && i !== void 0 ? i : !1,
        ...L.errorUtil.errToObj(t?.message)
      });
    }
    date(t) {
      return this._addCheck({ kind: "date", message: t });
    }
    time(t) {
      return typeof t == "string" ? this._addCheck({
        kind: "time",
        precision: null,
        message: t
      }) : this._addCheck({
        kind: "time",
        precision: typeof t?.precision > "u" ? null : t?.precision,
        ...L.errorUtil.errToObj(t?.message)
      });
    }
    duration(t) {
      return this._addCheck({ kind: "duration", ...L.errorUtil.errToObj(t) });
    }
    regex(t, r) {
      return this._addCheck({
        kind: "regex",
        regex: t,
        ...L.errorUtil.errToObj(r)
      });
    }
    includes(t, r) {
      return this._addCheck({
        kind: "includes",
        value: t,
        position: r?.position,
        ...L.errorUtil.errToObj(r?.message)
      });
    }
    startsWith(t, r) {
      return this._addCheck({
        kind: "startsWith",
        value: t,
        ...L.errorUtil.errToObj(r)
      });
    }
    endsWith(t, r) {
      return this._addCheck({
        kind: "endsWith",
        value: t,
        ...L.errorUtil.errToObj(r)
      });
    }
    min(t, r) {
      return this._addCheck({
        kind: "min",
        value: t,
        ...L.errorUtil.errToObj(r)
      });
    }
    max(t, r) {
      return this._addCheck({
        kind: "max",
        value: t,
        ...L.errorUtil.errToObj(r)
      });
    }
    length(t, r) {
      return this._addCheck({
        kind: "length",
        value: t,
        ...L.errorUtil.errToObj(r)
      });
    }
    /**
     * Equivalent to `.min(1)`
     */
    nonempty(t) {
      return this.min(1, L.errorUtil.errToObj(t));
    }
    trim() {
      return new e({
        ...this._def,
        checks: [...this._def.checks, { kind: "trim" }]
      });
    }
    toLowerCase() {
      return new e({
        ...this._def,
        checks: [...this._def.checks, { kind: "toLowerCase" }]
      });
    }
    toUpperCase() {
      return new e({
        ...this._def,
        checks: [...this._def.checks, { kind: "toUpperCase" }]
      });
    }
    get isDatetime() {
      return !!this._def.checks.find((t) => t.kind === "datetime");
    }
    get isDate() {
      return !!this._def.checks.find((t) => t.kind === "date");
    }
    get isTime() {
      return !!this._def.checks.find((t) => t.kind === "time");
    }
    get isDuration() {
      return !!this._def.checks.find((t) => t.kind === "duration");
    }
    get isEmail() {
      return !!this._def.checks.find((t) => t.kind === "email");
    }
    get isURL() {
      return !!this._def.checks.find((t) => t.kind === "url");
    }
    get isEmoji() {
      return !!this._def.checks.find((t) => t.kind === "emoji");
    }
    get isUUID() {
      return !!this._def.checks.find((t) => t.kind === "uuid");
    }
    get isNANOID() {
      return !!this._def.checks.find((t) => t.kind === "nanoid");
    }
    get isCUID() {
      return !!this._def.checks.find((t) => t.kind === "cuid");
    }
    get isCUID2() {
      return !!this._def.checks.find((t) => t.kind === "cuid2");
    }
    get isULID() {
      return !!this._def.checks.find((t) => t.kind === "ulid");
    }
    get isIP() {
      return !!this._def.checks.find((t) => t.kind === "ip");
    }
    get isCIDR() {
      return !!this._def.checks.find((t) => t.kind === "cidr");
    }
    get isBase64() {
      return !!this._def.checks.find((t) => t.kind === "base64");
    }
    get isBase64url() {
      return !!this._def.checks.find((t) => t.kind === "base64url");
    }
    get minLength() {
      let t = null;
      for (let r of this._def.checks)
        r.kind === "min" && (t === null || r.value > t) && (t = r.value);
      return t;
    }
    get maxLength() {
      let t = null;
      for (let r of this._def.checks)
        r.kind === "max" && (t === null || r.value < t) && (t = r.value);
      return t;
    }
  };
  y.ZodString = ar;
  ar.create = (e) => {
    var t;
    return new ar({
      checks: [],
      typeName: N.ZodString,
      coerce: (t = e?.coerce) !== null && t !== void 0 ? t : !1,
      ...$(e)
    });
  };
  function IB(e, t) {
    let r = (e.toString().split(".")[1] || "").length, i = (t.toString().split(".")[1] || "").length, n = r > i ? r : i, o = parseInt(e.toFixed(
    n).replace(".", "")), a = parseInt(t.toFixed(n).replace(".", ""));
    return o % a / Math.pow(10, n);
  }
  s(IB, "floatSafeRemainder");
  var Br = class e extends W {
    static {
      s(this, "ZodNumber");
    }
    constructor() {
      super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
    }
    _parse(t) {
      if (this._def.coerce && (t.data = Number(t.data)), this._getType(t) !== O.ZodParsedType.number) {
        let o = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(o, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.number,
          received: o.parsedType
        }), v.INVALID;
      }
      let i, n = new v.ParseStatus();
      for (let o of this._def.checks)
        o.kind === "int" ? O.util.isInteger(t.data) || (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(i, {
          code: R.ZodIssueCode.invalid_type,
          expected: "integer",
          received: "float",
          message: o.message
        }), n.dirty()) : o.kind === "min" ? (o.inclusive ? t.data < o.value : t.data <= o.value) && (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(
        i, {
          code: R.ZodIssueCode.too_small,
          minimum: o.value,
          type: "number",
          inclusive: o.inclusive,
          exact: !1,
          message: o.message
        }), n.dirty()) : o.kind === "max" ? (o.inclusive ? t.data > o.value : t.data >= o.value) && (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(
        i, {
          code: R.ZodIssueCode.too_big,
          maximum: o.value,
          type: "number",
          inclusive: o.inclusive,
          exact: !1,
          message: o.message
        }), n.dirty()) : o.kind === "multipleOf" ? IB(t.data, o.value) !== 0 && (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(i,
        {
          code: R.ZodIssueCode.not_multiple_of,
          multipleOf: o.value,
          message: o.message
        }), n.dirty()) : o.kind === "finite" ? Number.isFinite(t.data) || (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(i, {
          code: R.ZodIssueCode.not_finite,
          message: o.message
        }), n.dirty()) : O.util.assertNever(o);
      return { status: n.value, value: t.data };
    }
    gte(t, r) {
      return this.setLimit("min", t, !0, L.errorUtil.toString(r));
    }
    gt(t, r) {
      return this.setLimit("min", t, !1, L.errorUtil.toString(r));
    }
    lte(t, r) {
      return this.setLimit("max", t, !0, L.errorUtil.toString(r));
    }
    lt(t, r) {
      return this.setLimit("max", t, !1, L.errorUtil.toString(r));
    }
    setLimit(t, r, i, n) {
      return new e({
        ...this._def,
        checks: [
          ...this._def.checks,
          {
            kind: t,
            value: r,
            inclusive: i,
            message: L.errorUtil.toString(n)
          }
        ]
      });
    }
    _addCheck(t) {
      return new e({
        ...this._def,
        checks: [...this._def.checks, t]
      });
    }
    int(t) {
      return this._addCheck({
        kind: "int",
        message: L.errorUtil.toString(t)
      });
    }
    positive(t) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !1,
        message: L.errorUtil.toString(t)
      });
    }
    negative(t) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !1,
        message: L.errorUtil.toString(t)
      });
    }
    nonpositive(t) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !0,
        message: L.errorUtil.toString(t)
      });
    }
    nonnegative(t) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !0,
        message: L.errorUtil.toString(t)
      });
    }
    multipleOf(t, r) {
      return this._addCheck({
        kind: "multipleOf",
        value: t,
        message: L.errorUtil.toString(r)
      });
    }
    finite(t) {
      return this._addCheck({
        kind: "finite",
        message: L.errorUtil.toString(t)
      });
    }
    safe(t) {
      return this._addCheck({
        kind: "min",
        inclusive: !0,
        value: Number.MIN_SAFE_INTEGER,
        message: L.errorUtil.toString(t)
      })._addCheck({
        kind: "max",
        inclusive: !0,
        value: Number.MAX_SAFE_INTEGER,
        message: L.errorUtil.toString(t)
      });
    }
    get minValue() {
      let t = null;
      for (let r of this._def.checks)
        r.kind === "min" && (t === null || r.value > t) && (t = r.value);
      return t;
    }
    get maxValue() {
      let t = null;
      for (let r of this._def.checks)
        r.kind === "max" && (t === null || r.value < t) && (t = r.value);
      return t;
    }
    get isInt() {
      return !!this._def.checks.find((t) => t.kind === "int" || t.kind === "multipleOf" && O.util.isInteger(t.value));
    }
    get isFinite() {
      let t = null, r = null;
      for (let i of this._def.checks) {
        if (i.kind === "finite" || i.kind === "int" || i.kind === "multipleOf")
          return !0;
        i.kind === "min" ? (r === null || i.value > r) && (r = i.value) : i.kind === "max" && (t === null || i.value < t) && (t = i.value);
      }
      return Number.isFinite(r) && Number.isFinite(t);
    }
  };
  y.ZodNumber = Br;
  Br.create = (e) => new Br({
    checks: [],
    typeName: N.ZodNumber,
    coerce: e?.coerce || !1,
    ...$(e)
  });
  var Pr = class e extends W {
    static {
      s(this, "ZodBigInt");
    }
    constructor() {
      super(...arguments), this.min = this.gte, this.max = this.lte;
    }
    _parse(t) {
      if (this._def.coerce)
        try {
          t.data = BigInt(t.data);
        } catch {
          return this._getInvalidInput(t);
        }
      if (this._getType(t) !== O.ZodParsedType.bigint)
        return this._getInvalidInput(t);
      let i, n = new v.ParseStatus();
      for (let o of this._def.checks)
        o.kind === "min" ? (o.inclusive ? t.data < o.value : t.data <= o.value) && (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(
        i, {
          code: R.ZodIssueCode.too_small,
          type: "bigint",
          minimum: o.value,
          inclusive: o.inclusive,
          message: o.message
        }), n.dirty()) : o.kind === "max" ? (o.inclusive ? t.data > o.value : t.data >= o.value) && (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(
        i, {
          code: R.ZodIssueCode.too_big,
          type: "bigint",
          maximum: o.value,
          inclusive: o.inclusive,
          message: o.message
        }), n.dirty()) : o.kind === "multipleOf" ? t.data % o.value !== BigInt(0) && (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(
        i, {
          code: R.ZodIssueCode.not_multiple_of,
          multipleOf: o.value,
          message: o.message
        }), n.dirty()) : O.util.assertNever(o);
      return { status: n.value, value: t.data };
    }
    _getInvalidInput(t) {
      let r = this._getOrReturnCtx(t);
      return (0, v.addIssueToContext)(r, {
        code: R.ZodIssueCode.invalid_type,
        expected: O.ZodParsedType.bigint,
        received: r.parsedType
      }), v.INVALID;
    }
    gte(t, r) {
      return this.setLimit("min", t, !0, L.errorUtil.toString(r));
    }
    gt(t, r) {
      return this.setLimit("min", t, !1, L.errorUtil.toString(r));
    }
    lte(t, r) {
      return this.setLimit("max", t, !0, L.errorUtil.toString(r));
    }
    lt(t, r) {
      return this.setLimit("max", t, !1, L.errorUtil.toString(r));
    }
    setLimit(t, r, i, n) {
      return new e({
        ...this._def,
        checks: [
          ...this._def.checks,
          {
            kind: t,
            value: r,
            inclusive: i,
            message: L.errorUtil.toString(n)
          }
        ]
      });
    }
    _addCheck(t) {
      return new e({
        ...this._def,
        checks: [...this._def.checks, t]
      });
    }
    positive(t) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: !1,
        message: L.errorUtil.toString(t)
      });
    }
    negative(t) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: !1,
        message: L.errorUtil.toString(t)
      });
    }
    nonpositive(t) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: !0,
        message: L.errorUtil.toString(t)
      });
    }
    nonnegative(t) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: !0,
        message: L.errorUtil.toString(t)
      });
    }
    multipleOf(t, r) {
      return this._addCheck({
        kind: "multipleOf",
        value: t,
        message: L.errorUtil.toString(r)
      });
    }
    get minValue() {
      let t = null;
      for (let r of this._def.checks)
        r.kind === "min" && (t === null || r.value > t) && (t = r.value);
      return t;
    }
    get maxValue() {
      let t = null;
      for (let r of this._def.checks)
        r.kind === "max" && (t === null || r.value < t) && (t = r.value);
      return t;
    }
  };
  y.ZodBigInt = Pr;
  Pr.create = (e) => {
    var t;
    return new Pr({
      checks: [],
      typeName: N.ZodBigInt,
      coerce: (t = e?.coerce) !== null && t !== void 0 ? t : !1,
      ...$(e)
    });
  };
  var Ir = class extends W {
    static {
      s(this, "ZodBoolean");
    }
    _parse(t) {
      if (this._def.coerce && (t.data = !!t.data), this._getType(t) !== O.ZodParsedType.boolean) {
        let i = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(i, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.boolean,
          received: i.parsedType
        }), v.INVALID;
      }
      return (0, v.OK)(t.data);
    }
  };
  y.ZodBoolean = Ir;
  Ir.create = (e) => new Ir({
    typeName: N.ZodBoolean,
    coerce: e?.coerce || !1,
    ...$(e)
  });
  var Mr = class e extends W {
    static {
      s(this, "ZodDate");
    }
    _parse(t) {
      if (this._def.coerce && (t.data = new Date(t.data)), this._getType(t) !== O.ZodParsedType.date) {
        let o = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(o, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.date,
          received: o.parsedType
        }), v.INVALID;
      }
      if (isNaN(t.data.getTime())) {
        let o = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(o, {
          code: R.ZodIssueCode.invalid_date
        }), v.INVALID;
      }
      let i = new v.ParseStatus(), n;
      for (let o of this._def.checks)
        o.kind === "min" ? t.data.getTime() < o.value && (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: R.ZodIssueCode.too_small,
          message: o.message,
          inclusive: !0,
          exact: !1,
          minimum: o.value,
          type: "date"
        }), i.dirty()) : o.kind === "max" ? t.data.getTime() > o.value && (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: R.ZodIssueCode.too_big,
          message: o.message,
          inclusive: !0,
          exact: !1,
          maximum: o.value,
          type: "date"
        }), i.dirty()) : O.util.assertNever(o);
      return {
        status: i.value,
        value: new Date(t.data.getTime())
      };
    }
    _addCheck(t) {
      return new e({
        ...this._def,
        checks: [...this._def.checks, t]
      });
    }
    min(t, r) {
      return this._addCheck({
        kind: "min",
        value: t.getTime(),
        message: L.errorUtil.toString(r)
      });
    }
    max(t, r) {
      return this._addCheck({
        kind: "max",
        value: t.getTime(),
        message: L.errorUtil.toString(r)
      });
    }
    get minDate() {
      let t = null;
      for (let r of this._def.checks)
        r.kind === "min" && (t === null || r.value > t) && (t = r.value);
      return t != null ? new Date(t) : null;
    }
    get maxDate() {
      let t = null;
      for (let r of this._def.checks)
        r.kind === "max" && (t === null || r.value < t) && (t = r.value);
      return t != null ? new Date(t) : null;
    }
  };
  y.ZodDate = Mr;
  Mr.create = (e) => new Mr({
    checks: [],
    coerce: e?.coerce || !1,
    typeName: N.ZodDate,
    ...$(e)
  });
  var Bi = class extends W {
    static {
      s(this, "ZodSymbol");
    }
    _parse(t) {
      if (this._getType(t) !== O.ZodParsedType.symbol) {
        let i = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(i, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.symbol,
          received: i.parsedType
        }), v.INVALID;
      }
      return (0, v.OK)(t.data);
    }
  };
  y.ZodSymbol = Bi;
  Bi.create = (e) => new Bi({
    typeName: N.ZodSymbol,
    ...$(e)
  });
  var jr = class extends W {
    static {
      s(this, "ZodUndefined");
    }
    _parse(t) {
      if (this._getType(t) !== O.ZodParsedType.undefined) {
        let i = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(i, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.undefined,
          received: i.parsedType
        }), v.INVALID;
      }
      return (0, v.OK)(t.data);
    }
  };
  y.ZodUndefined = jr;
  jr.create = (e) => new jr({
    typeName: N.ZodUndefined,
    ...$(e)
  });
  var qr = class extends W {
    static {
      s(this, "ZodNull");
    }
    _parse(t) {
      if (this._getType(t) !== O.ZodParsedType.null) {
        let i = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(i, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.null,
          received: i.parsedType
        }), v.INVALID;
      }
      return (0, v.OK)(t.data);
    }
  };
  y.ZodNull = qr;
  qr.create = (e) => new qr({
    typeName: N.ZodNull,
    ...$(e)
  });
  var ur = class extends W {
    static {
      s(this, "ZodAny");
    }
    constructor() {
      super(...arguments), this._any = !0;
    }
    _parse(t) {
      return (0, v.OK)(t.data);
    }
  };
  y.ZodAny = ur;
  ur.create = (e) => new ur({
    typeName: N.ZodAny,
    ...$(e)
  });
  var Wt = class extends W {
    static {
      s(this, "ZodUnknown");
    }
    constructor() {
      super(...arguments), this._unknown = !0;
    }
    _parse(t) {
      return (0, v.OK)(t.data);
    }
  };
  y.ZodUnknown = Wt;
  Wt.create = (e) => new Wt({
    typeName: N.ZodUnknown,
    ...$(e)
  });
  var ot = class extends W {
    static {
      s(this, "ZodNever");
    }
    _parse(t) {
      let r = this._getOrReturnCtx(t);
      return (0, v.addIssueToContext)(r, {
        code: R.ZodIssueCode.invalid_type,
        expected: O.ZodParsedType.never,
        received: r.parsedType
      }), v.INVALID;
    }
  };
  y.ZodNever = ot;
  ot.create = (e) => new ot({
    typeName: N.ZodNever,
    ...$(e)
  });
  var Pi = class extends W {
    static {
      s(this, "ZodVoid");
    }
    _parse(t) {
      if (this._getType(t) !== O.ZodParsedType.undefined) {
        let i = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(i, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.void,
          received: i.parsedType
        }), v.INVALID;
      }
      return (0, v.OK)(t.data);
    }
  };
  y.ZodVoid = Pi;
  Pi.create = (e) => new Pi({
    typeName: N.ZodVoid,
    ...$(e)
  });
  var Ht = class e extends W {
    static {
      s(this, "ZodArray");
    }
    _parse(t) {
      let { ctx: r, status: i } = this._processInputParams(t), n = this._def;
      if (r.parsedType !== O.ZodParsedType.array)
        return (0, v.addIssueToContext)(r, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.array,
          received: r.parsedType
        }), v.INVALID;
      if (n.exactLength !== null) {
        let a = r.data.length > n.exactLength.value, u = r.data.length < n.exactLength.value;
        (a || u) && ((0, v.addIssueToContext)(r, {
          code: a ? R.ZodIssueCode.too_big : R.ZodIssueCode.too_small,
          minimum: u ? n.exactLength.value : void 0,
          maximum: a ? n.exactLength.value : void 0,
          type: "array",
          inclusive: !0,
          exact: !0,
          message: n.exactLength.message
        }), i.dirty());
      }
      if (n.minLength !== null && r.data.length < n.minLength.value && ((0, v.addIssueToContext)(r, {
        code: R.ZodIssueCode.too_small,
        minimum: n.minLength.value,
        type: "array",
        inclusive: !0,
        exact: !1,
        message: n.minLength.message
      }), i.dirty()), n.maxLength !== null && r.data.length > n.maxLength.value && ((0, v.addIssueToContext)(r, {
        code: R.ZodIssueCode.too_big,
        maximum: n.maxLength.value,
        type: "array",
        inclusive: !0,
        exact: !1,
        message: n.maxLength.message
      }), i.dirty()), r.common.async)
        return Promise.all([...r.data].map((a, u) => n.type._parseAsync(new Qe(r, a, r.path, u)))).then((a) => v.ParseStatus.mergeArray(i, a));
      let o = [...r.data].map((a, u) => n.type._parseSync(new Qe(r, a, r.path, u)));
      return v.ParseStatus.mergeArray(i, o);
    }
    get element() {
      return this._def.type;
    }
    min(t, r) {
      return new e({
        ...this._def,
        minLength: { value: t, message: L.errorUtil.toString(r) }
      });
    }
    max(t, r) {
      return new e({
        ...this._def,
        maxLength: { value: t, message: L.errorUtil.toString(r) }
      });
    }
    length(t, r) {
      return new e({
        ...this._def,
        exactLength: { value: t, message: L.errorUtil.toString(r) }
      });
    }
    nonempty(t) {
      return this.min(1, t);
    }
  };
  y.ZodArray = Ht;
  Ht.create = (e, t) => new Ht({
    type: e,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: N.ZodArray,
    ...$(t)
  });
  function Oi(e) {
    if (e instanceof $e) {
      let t = {};
      for (let r in e.shape) {
        let i = e.shape[r];
        t[r] = Xe.create(Oi(i));
      }
      return new $e({
        ...e._def,
        shape: /* @__PURE__ */ s(() => t, "shape")
      });
    } else return e instanceof Ht ? new Ht({
      ...e._def,
      type: Oi(e.element)
    }) : e instanceof Xe ? Xe.create(Oi(e.unwrap())) : e instanceof _t ? _t.create(Oi(e.unwrap())) : e instanceof vt ? vt.create(e.items.map(
    (t) => Oi(t))) : e;
  }
  s(Oi, "deepPartialify");
  var $e = class e extends W {
    static {
      s(this, "ZodObject");
    }
    constructor() {
      super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
    }
    _getCached() {
      if (this._cached !== null)
        return this._cached;
      let t = this._def.shape(), r = O.util.objectKeys(t);
      return this._cached = { shape: t, keys: r };
    }
    _parse(t) {
      if (this._getType(t) !== O.ZodParsedType.object) {
        let c = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(c, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.object,
          received: c.parsedType
        }), v.INVALID;
      }
      let { status: i, ctx: n } = this._processInputParams(t), { shape: o, keys: a } = this._getCached(), u = [];
      if (!(this._def.catchall instanceof ot && this._def.unknownKeys === "strip"))
        for (let c in n.data)
          a.includes(c) || u.push(c);
      let l = [];
      for (let c of a) {
        let d = o[c], p = n.data[c];
        l.push({
          key: { status: "valid", value: c },
          value: d._parse(new Qe(n, p, n.path, c)),
          alwaysSet: c in n.data
        });
      }
      if (this._def.catchall instanceof ot) {
        let c = this._def.unknownKeys;
        if (c === "passthrough")
          for (let d of u)
            l.push({
              key: { status: "valid", value: d },
              value: { status: "valid", value: n.data[d] }
            });
        else if (c === "strict")
          u.length > 0 && ((0, v.addIssueToContext)(n, {
            code: R.ZodIssueCode.unrecognized_keys,
            keys: u
          }), i.dirty());
        else if (c !== "strip")
          throw new Error("Internal ZodObject error: invalid unknownKeys value.");
      } else {
        let c = this._def.catchall;
        for (let d of u) {
          let p = n.data[d];
          l.push({
            key: { status: "valid", value: d },
            value: c._parse(
              new Qe(n, p, n.path, d)
              //, ctx.child(key), value, getParsedType(value)
            ),
            alwaysSet: d in n.data
          });
        }
      }
      return n.common.async ? Promise.resolve().then(async () => {
        let c = [];
        for (let d of l) {
          let p = await d.key, h = await d.value;
          c.push({
            key: p,
            value: h,
            alwaysSet: d.alwaysSet
          });
        }
        return c;
      }).then((c) => v.ParseStatus.mergeObjectSync(i, c)) : v.ParseStatus.mergeObjectSync(i, l);
    }
    get shape() {
      return this._def.shape();
    }
    strict(t) {
      return L.errorUtil.errToObj, new e({
        ...this._def,
        unknownKeys: "strict",
        ...t !== void 0 ? {
          errorMap: /* @__PURE__ */ s((r, i) => {
            var n, o, a, u;
            let l = (a = (o = (n = this._def).errorMap) === null || o === void 0 ? void 0 : o.call(n, r, i).message) !== null && a !== void 0 ?
            a : i.defaultError;
            return r.code === "unrecognized_keys" ? {
              message: (u = L.errorUtil.errToObj(t).message) !== null && u !== void 0 ? u : l
            } : {
              message: l
            };
          }, "errorMap")
        } : {}
      });
    }
    strip() {
      return new e({
        ...this._def,
        unknownKeys: "strip"
      });
    }
    passthrough() {
      return new e({
        ...this._def,
        unknownKeys: "passthrough"
      });
    }
    // const AugmentFactory =
    //   <Def extends ZodObjectDef>(def: Def) =>
    //   <Augmentation extends ZodRawShape>(
    //     augmentation: Augmentation
    //   ): ZodObject<
    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
    //     Def["unknownKeys"],
    //     Def["catchall"]
    //   > => {
    //     return new ZodObject({
    //       ...def,
    //       shape: () => ({
    //         ...def.shape(),
    //         ...augmentation,
    //       }),
    //     }) as any;
    //   };
    extend(t) {
      return new e({
        ...this._def,
        shape: /* @__PURE__ */ s(() => ({
          ...this._def.shape(),
          ...t
        }), "shape")
      });
    }
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
    merge(t) {
      return new e({
        unknownKeys: t._def.unknownKeys,
        catchall: t._def.catchall,
        shape: /* @__PURE__ */ s(() => ({
          ...this._def.shape(),
          ...t._def.shape()
        }), "shape"),
        typeName: N.ZodObject
      });
    }
    // merge<
    //   Incoming extends AnyZodObject,
    //   Augmentation extends Incoming["shape"],
    //   NewOutput extends {
    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
    //       ? Augmentation[k]["_output"]
    //       : k extends keyof Output
    //       ? Output[k]
    //       : never;
    //   },
    //   NewInput extends {
    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
    //       ? Augmentation[k]["_input"]
    //       : k extends keyof Input
    //       ? Input[k]
    //       : never;
    //   }
    // >(
    //   merging: Incoming
    // ): ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"],
    //   NewOutput,
    //   NewInput
    // > {
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    setKey(t, r) {
      return this.augment({ [t]: r });
    }
    // merge<Incoming extends AnyZodObject>(
    //   merging: Incoming
    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
    // ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"]
    // > {
    //   // const mergedShape = objectUtil.mergeShapes(
    //   //   this._def.shape(),
    //   //   merging._def.shape()
    //   // );
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    catchall(t) {
      return new e({
        ...this._def,
        catchall: t
      });
    }
    pick(t) {
      let r = {};
      return O.util.objectKeys(t).forEach((i) => {
        t[i] && this.shape[i] && (r[i] = this.shape[i]);
      }), new e({
        ...this._def,
        shape: /* @__PURE__ */ s(() => r, "shape")
      });
    }
    omit(t) {
      let r = {};
      return O.util.objectKeys(this.shape).forEach((i) => {
        t[i] || (r[i] = this.shape[i]);
      }), new e({
        ...this._def,
        shape: /* @__PURE__ */ s(() => r, "shape")
      });
    }
    /**
     * @deprecated
     */
    deepPartial() {
      return Oi(this);
    }
    partial(t) {
      let r = {};
      return O.util.objectKeys(this.shape).forEach((i) => {
        let n = this.shape[i];
        t && !t[i] ? r[i] = n : r[i] = n.optional();
      }), new e({
        ...this._def,
        shape: /* @__PURE__ */ s(() => r, "shape")
      });
    }
    required(t) {
      let r = {};
      return O.util.objectKeys(this.shape).forEach((i) => {
        if (t && !t[i])
          r[i] = this.shape[i];
        else {
          let o = this.shape[i];
          for (; o instanceof Xe; )
            o = o._def.innerType;
          r[i] = o;
        }
      }), new e({
        ...this._def,
        shape: /* @__PURE__ */ s(() => r, "shape")
      });
    }
    keyof() {
      return $_(O.util.objectKeys(this.shape));
    }
  };
  y.ZodObject = $e;
  $e.create = (e, t) => new $e({
    shape: /* @__PURE__ */ s(() => e, "shape"),
    unknownKeys: "strip",
    catchall: ot.create(),
    typeName: N.ZodObject,
    ...$(t)
  });
  $e.strictCreate = (e, t) => new $e({
    shape: /* @__PURE__ */ s(() => e, "shape"),
    unknownKeys: "strict",
    catchall: ot.create(),
    typeName: N.ZodObject,
    ...$(t)
  });
  $e.lazycreate = (e, t) => new $e({
    shape: e,
    unknownKeys: "strip",
    catchall: ot.create(),
    typeName: N.ZodObject,
    ...$(t)
  });
  var Lr = class extends W {
    static {
      s(this, "ZodUnion");
    }
    _parse(t) {
      let { ctx: r } = this._processInputParams(t), i = this._def.options;
      function n(o) {
        for (let u of o)
          if (u.result.status === "valid")
            return u.result;
        for (let u of o)
          if (u.result.status === "dirty")
            return r.common.issues.push(...u.ctx.common.issues), u.result;
        let a = o.map((u) => new R.ZodError(u.ctx.common.issues));
        return (0, v.addIssueToContext)(r, {
          code: R.ZodIssueCode.invalid_union,
          unionErrors: a
        }), v.INVALID;
      }
      if (s(n, "handleResults"), r.common.async)
        return Promise.all(i.map(async (o) => {
          let a = {
            ...r,
            common: {
              ...r.common,
              issues: []
            },
            parent: null
          };
          return {
            result: await o._parseAsync({
              data: r.data,
              path: r.path,
              parent: a
            }),
            ctx: a
          };
        })).then(n);
      {
        let o, a = [];
        for (let l of i) {
          let c = {
            ...r,
            common: {
              ...r.common,
              issues: []
            },
            parent: null
          }, d = l._parseSync({
            data: r.data,
            path: r.path,
            parent: c
          });
          if (d.status === "valid")
            return d;
          d.status === "dirty" && !o && (o = { result: d, ctx: c }), c.common.issues.length && a.push(c.common.issues);
        }
        if (o)
          return r.common.issues.push(...o.ctx.common.issues), o.result;
        let u = a.map((l) => new R.ZodError(l));
        return (0, v.addIssueToContext)(r, {
          code: R.ZodIssueCode.invalid_union,
          unionErrors: u
        }), v.INVALID;
      }
    }
    get options() {
      return this._def.options;
    }
  };
  y.ZodUnion = Lr;
  Lr.create = (e, t) => new Lr({
    options: e,
    typeName: N.ZodUnion,
    ...$(t)
  });
  var $t = /* @__PURE__ */ s((e) => e instanceof Ur ? $t(e.schema) : e instanceof Ze ? $t(e.innerType()) : e instanceof $r ? [e.value] : e instanceof
  Wr ? e.options : e instanceof Hr ? O.util.objectValues(e.enum) : e instanceof Vr ? $t(e._def.innerType) : e instanceof jr ? [void 0] : e instanceof
  qr ? [null] : e instanceof Xe ? [void 0, ...$t(e.unwrap())] : e instanceof _t ? [null, ...$t(e.unwrap())] : e instanceof as || e instanceof
  zr ? $t(e.unwrap()) : e instanceof Zr ? $t(e._def.innerType) : [], "getDiscriminator"), ma = class e extends W {
    static {
      s(this, "ZodDiscriminatedUnion");
    }
    _parse(t) {
      let { ctx: r } = this._processInputParams(t);
      if (r.parsedType !== O.ZodParsedType.object)
        return (0, v.addIssueToContext)(r, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.object,
          received: r.parsedType
        }), v.INVALID;
      let i = this.discriminator, n = r.data[i], o = this.optionsMap.get(n);
      return o ? r.common.async ? o._parseAsync({
        data: r.data,
        path: r.path,
        parent: r
      }) : o._parseSync({
        data: r.data,
        path: r.path,
        parent: r
      }) : ((0, v.addIssueToContext)(r, {
        code: R.ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [i]
      }), v.INVALID);
    }
    get discriminator() {
      return this._def.discriminator;
    }
    get options() {
      return this._def.options;
    }
    get optionsMap() {
      return this._def.optionsMap;
    }
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */
    static create(t, r, i) {
      let n = /* @__PURE__ */ new Map();
      for (let o of r) {
        let a = $t(o.shape[t]);
        if (!a.length)
          throw new Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);
        for (let u of a) {
          if (n.has(u))
            throw new Error(`Discriminator property ${String(t)} has duplicate value ${String(u)}`);
          n.set(u, o);
        }
      }
      return new e({
        typeName: N.ZodDiscriminatedUnion,
        discriminator: t,
        options: r,
        optionsMap: n,
        ...$(i)
      });
    }
  };
  y.ZodDiscriminatedUnion = ma;
  function Id(e, t) {
    let r = (0, O.getParsedType)(e), i = (0, O.getParsedType)(t);
    if (e === t)
      return { valid: !0, data: e };
    if (r === O.ZodParsedType.object && i === O.ZodParsedType.object) {
      let n = O.util.objectKeys(t), o = O.util.objectKeys(e).filter((u) => n.indexOf(u) !== -1), a = { ...e, ...t };
      for (let u of o) {
        let l = Id(e[u], t[u]);
        if (!l.valid)
          return { valid: !1 };
        a[u] = l.data;
      }
      return { valid: !0, data: a };
    } else if (r === O.ZodParsedType.array && i === O.ZodParsedType.array) {
      if (e.length !== t.length)
        return { valid: !1 };
      let n = [];
      for (let o = 0; o < e.length; o++) {
        let a = e[o], u = t[o], l = Id(a, u);
        if (!l.valid)
          return { valid: !1 };
        n.push(l.data);
      }
      return { valid: !0, data: n };
    } else return r === O.ZodParsedType.date && i === O.ZodParsedType.date && +e == +t ? { valid: !0, data: e } : { valid: !1 };
  }
  s(Id, "mergeValues");
  var Nr = class extends W {
    static {
      s(this, "ZodIntersection");
    }
    _parse(t) {
      let { status: r, ctx: i } = this._processInputParams(t), n = /* @__PURE__ */ s((o, a) => {
        if ((0, v.isAborted)(o) || (0, v.isAborted)(a))
          return v.INVALID;
        let u = Id(o.value, a.value);
        return u.valid ? (((0, v.isDirty)(o) || (0, v.isDirty)(a)) && r.dirty(), { status: r.value, value: u.data }) : ((0, v.addIssueToContext)(
        i, {
          code: R.ZodIssueCode.invalid_intersection_types
        }), v.INVALID);
      }, "handleParsed");
      return i.common.async ? Promise.all([
        this._def.left._parseAsync({
          data: i.data,
          path: i.path,
          parent: i
        }),
        this._def.right._parseAsync({
          data: i.data,
          path: i.path,
          parent: i
        })
      ]).then(([o, a]) => n(o, a)) : n(this._def.left._parseSync({
        data: i.data,
        path: i.path,
        parent: i
      }), this._def.right._parseSync({
        data: i.data,
        path: i.path,
        parent: i
      }));
    }
  };
  y.ZodIntersection = Nr;
  Nr.create = (e, t, r) => new Nr({
    left: e,
    right: t,
    typeName: N.ZodIntersection,
    ...$(r)
  });
  var vt = class e extends W {
    static {
      s(this, "ZodTuple");
    }
    _parse(t) {
      let { status: r, ctx: i } = this._processInputParams(t);
      if (i.parsedType !== O.ZodParsedType.array)
        return (0, v.addIssueToContext)(i, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.array,
          received: i.parsedType
        }), v.INVALID;
      if (i.data.length < this._def.items.length)
        return (0, v.addIssueToContext)(i, {
          code: R.ZodIssueCode.too_small,
          minimum: this._def.items.length,
          inclusive: !0,
          exact: !1,
          type: "array"
        }), v.INVALID;
      !this._def.rest && i.data.length > this._def.items.length && ((0, v.addIssueToContext)(i, {
        code: R.ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), r.dirty());
      let o = [...i.data].map((a, u) => {
        let l = this._def.items[u] || this._def.rest;
        return l ? l._parse(new Qe(i, a, i.path, u)) : null;
      }).filter((a) => !!a);
      return i.common.async ? Promise.all(o).then((a) => v.ParseStatus.mergeArray(r, a)) : v.ParseStatus.mergeArray(r, o);
    }
    get items() {
      return this._def.items;
    }
    rest(t) {
      return new e({
        ...this._def,
        rest: t
      });
    }
  };
  y.ZodTuple = vt;
  vt.create = (e, t) => {
    if (!Array.isArray(e))
      throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    return new vt({
      items: e,
      typeName: N.ZodTuple,
      rest: null,
      ...$(t)
    });
  };
  var ga = class e extends W {
    static {
      s(this, "ZodRecord");
    }
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(t) {
      let { status: r, ctx: i } = this._processInputParams(t);
      if (i.parsedType !== O.ZodParsedType.object)
        return (0, v.addIssueToContext)(i, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.object,
          received: i.parsedType
        }), v.INVALID;
      let n = [], o = this._def.keyType, a = this._def.valueType;
      for (let u in i.data)
        n.push({
          key: o._parse(new Qe(i, u, i.path, u)),
          value: a._parse(new Qe(i, i.data[u], i.path, u)),
          alwaysSet: u in i.data
        });
      return i.common.async ? v.ParseStatus.mergeObjectAsync(r, n) : v.ParseStatus.mergeObjectSync(r, n);
    }
    get element() {
      return this._def.valueType;
    }
    static create(t, r, i) {
      return r instanceof W ? new e({
        keyType: t,
        valueType: r,
        typeName: N.ZodRecord,
        ...$(i)
      }) : new e({
        keyType: ar.create(),
        valueType: t,
        typeName: N.ZodRecord,
        ...$(r)
      });
    }
  };
  y.ZodRecord = ga;
  var Ii = class extends W {
    static {
      s(this, "ZodMap");
    }
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(t) {
      let { status: r, ctx: i } = this._processInputParams(t);
      if (i.parsedType !== O.ZodParsedType.map)
        return (0, v.addIssueToContext)(i, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.map,
          received: i.parsedType
        }), v.INVALID;
      let n = this._def.keyType, o = this._def.valueType, a = [...i.data.entries()].map(([u, l], c) => ({
        key: n._parse(new Qe(i, u, i.path, [c, "key"])),
        value: o._parse(new Qe(i, l, i.path, [c, "value"]))
      }));
      if (i.common.async) {
        let u = /* @__PURE__ */ new Map();
        return Promise.resolve().then(async () => {
          for (let l of a) {
            let c = await l.key, d = await l.value;
            if (c.status === "aborted" || d.status === "aborted")
              return v.INVALID;
            (c.status === "dirty" || d.status === "dirty") && r.dirty(), u.set(c.value, d.value);
          }
          return { status: r.value, value: u };
        });
      } else {
        let u = /* @__PURE__ */ new Map();
        for (let l of a) {
          let c = l.key, d = l.value;
          if (c.status === "aborted" || d.status === "aborted")
            return v.INVALID;
          (c.status === "dirty" || d.status === "dirty") && r.dirty(), u.set(c.value, d.value);
        }
        return { status: r.value, value: u };
      }
    }
  };
  y.ZodMap = Ii;
  Ii.create = (e, t, r) => new Ii({
    valueType: t,
    keyType: e,
    typeName: N.ZodMap,
    ...$(r)
  });
  var Mi = class e extends W {
    static {
      s(this, "ZodSet");
    }
    _parse(t) {
      let { status: r, ctx: i } = this._processInputParams(t);
      if (i.parsedType !== O.ZodParsedType.set)
        return (0, v.addIssueToContext)(i, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.set,
          received: i.parsedType
        }), v.INVALID;
      let n = this._def;
      n.minSize !== null && i.data.size < n.minSize.value && ((0, v.addIssueToContext)(i, {
        code: R.ZodIssueCode.too_small,
        minimum: n.minSize.value,
        type: "set",
        inclusive: !0,
        exact: !1,
        message: n.minSize.message
      }), r.dirty()), n.maxSize !== null && i.data.size > n.maxSize.value && ((0, v.addIssueToContext)(i, {
        code: R.ZodIssueCode.too_big,
        maximum: n.maxSize.value,
        type: "set",
        inclusive: !0,
        exact: !1,
        message: n.maxSize.message
      }), r.dirty());
      let o = this._def.valueType;
      function a(l) {
        let c = /* @__PURE__ */ new Set();
        for (let d of l) {
          if (d.status === "aborted")
            return v.INVALID;
          d.status === "dirty" && r.dirty(), c.add(d.value);
        }
        return { status: r.value, value: c };
      }
      s(a, "finalizeSet");
      let u = [...i.data.values()].map((l, c) => o._parse(new Qe(i, l, i.path, c)));
      return i.common.async ? Promise.all(u).then((l) => a(l)) : a(u);
    }
    min(t, r) {
      return new e({
        ...this._def,
        minSize: { value: t, message: L.errorUtil.toString(r) }
      });
    }
    max(t, r) {
      return new e({
        ...this._def,
        maxSize: { value: t, message: L.errorUtil.toString(r) }
      });
    }
    size(t, r) {
      return this.min(t, r).max(t, r);
    }
    nonempty(t) {
      return this.min(1, t);
    }
  };
  y.ZodSet = Mi;
  Mi.create = (e, t) => new Mi({
    valueType: e,
    minSize: null,
    maxSize: null,
    typeName: N.ZodSet,
    ...$(t)
  });
  var ya = class e extends W {
    static {
      s(this, "ZodFunction");
    }
    constructor() {
      super(...arguments), this.validate = this.implement;
    }
    _parse(t) {
      let { ctx: r } = this._processInputParams(t);
      if (r.parsedType !== O.ZodParsedType.function)
        return (0, v.addIssueToContext)(r, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.function,
          received: r.parsedType
        }), v.INVALID;
      function i(u, l) {
        return (0, v.makeIssue)({
          data: u,
          path: r.path,
          errorMaps: [
            r.common.contextualErrorMap,
            r.schemaErrorMap,
            (0, pa.getErrorMap)(),
            pa.defaultErrorMap
          ].filter((c) => !!c),
          issueData: {
            code: R.ZodIssueCode.invalid_arguments,
            argumentsError: l
          }
        });
      }
      s(i, "makeArgsIssue");
      function n(u, l) {
        return (0, v.makeIssue)({
          data: u,
          path: r.path,
          errorMaps: [
            r.common.contextualErrorMap,
            r.schemaErrorMap,
            (0, pa.getErrorMap)(),
            pa.defaultErrorMap
          ].filter((c) => !!c),
          issueData: {
            code: R.ZodIssueCode.invalid_return_type,
            returnTypeError: l
          }
        });
      }
      s(n, "makeReturnsIssue");
      let o = { errorMap: r.common.contextualErrorMap }, a = r.data;
      if (this._def.returns instanceof lr) {
        let u = this;
        return (0, v.OK)(async function(...l) {
          let c = new R.ZodError([]), d = await u._def.args.parseAsync(l, o).catch((f) => {
            throw c.addIssue(i(l, f)), c;
          }), p = await Reflect.apply(a, this, d);
          return await u._def.returns._def.type.parseAsync(p, o).catch((f) => {
            throw c.addIssue(n(p, f)), c;
          });
        });
      } else {
        let u = this;
        return (0, v.OK)(function(...l) {
          let c = u._def.args.safeParse(l, o);
          if (!c.success)
            throw new R.ZodError([i(l, c.error)]);
          let d = Reflect.apply(a, this, c.data), p = u._def.returns.safeParse(d, o);
          if (!p.success)
            throw new R.ZodError([n(d, p.error)]);
          return p.data;
        });
      }
    }
    parameters() {
      return this._def.args;
    }
    returnType() {
      return this._def.returns;
    }
    args(...t) {
      return new e({
        ...this._def,
        args: vt.create(t).rest(Wt.create())
      });
    }
    returns(t) {
      return new e({
        ...this._def,
        returns: t
      });
    }
    implement(t) {
      return this.parse(t);
    }
    strictImplement(t) {
      return this.parse(t);
    }
    static create(t, r, i) {
      return new e({
        args: t || vt.create([]).rest(Wt.create()),
        returns: r || Wt.create(),
        typeName: N.ZodFunction,
        ...$(i)
      });
    }
  };
  y.ZodFunction = ya;
  var Ur = class extends W {
    static {
      s(this, "ZodLazy");
    }
    get schema() {
      return this._def.getter();
    }
    _parse(t) {
      let { ctx: r } = this._processInputParams(t);
      return this._def.getter()._parse({ data: r.data, path: r.path, parent: r });
    }
  };
  y.ZodLazy = Ur;
  Ur.create = (e, t) => new Ur({
    getter: e,
    typeName: N.ZodLazy,
    ...$(t)
  });
  var $r = class extends W {
    static {
      s(this, "ZodLiteral");
    }
    _parse(t) {
      if (t.data !== this._def.value) {
        let r = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(r, {
          received: r.data,
          code: R.ZodIssueCode.invalid_literal,
          expected: this._def.value
        }), v.INVALID;
      }
      return { status: "valid", value: t.data };
    }
    get value() {
      return this._def.value;
    }
  };
  y.ZodLiteral = $r;
  $r.create = (e, t) => new $r({
    value: e,
    typeName: N.ZodLiteral,
    ...$(t)
  });
  function $_(e, t) {
    return new Wr({
      values: e,
      typeName: N.ZodEnum,
      ...$(t)
    });
  }
  s($_, "createZodEnum");
  var Wr = class e extends W {
    static {
      s(this, "ZodEnum");
    }
    constructor() {
      super(...arguments), ss.set(this, void 0);
    }
    _parse(t) {
      if (typeof t.data != "string") {
        let r = this._getOrReturnCtx(t), i = this._def.values;
        return (0, v.addIssueToContext)(r, {
          expected: O.util.joinValues(i),
          received: r.parsedType,
          code: R.ZodIssueCode.invalid_type
        }), v.INVALID;
      }
      if (Da(this, ss, "f") || q_(this, ss, new Set(this._def.values), "f"), !Da(this, ss, "f").has(t.data)) {
        let r = this._getOrReturnCtx(t), i = this._def.values;
        return (0, v.addIssueToContext)(r, {
          received: r.data,
          code: R.ZodIssueCode.invalid_enum_value,
          options: i
        }), v.INVALID;
      }
      return (0, v.OK)(t.data);
    }
    get options() {
      return this._def.values;
    }
    get enum() {
      let t = {};
      for (let r of this._def.values)
        t[r] = r;
      return t;
    }
    get Values() {
      let t = {};
      for (let r of this._def.values)
        t[r] = r;
      return t;
    }
    get Enum() {
      let t = {};
      for (let r of this._def.values)
        t[r] = r;
      return t;
    }
    extract(t, r = this._def) {
      return e.create(t, {
        ...this._def,
        ...r
      });
    }
    exclude(t, r = this._def) {
      return e.create(this.options.filter((i) => !t.includes(i)), {
        ...this._def,
        ...r
      });
    }
  };
  y.ZodEnum = Wr;
  ss = /* @__PURE__ */ new WeakMap();
  Wr.create = $_;
  var Hr = class extends W {
    static {
      s(this, "ZodNativeEnum");
    }
    constructor() {
      super(...arguments), os.set(this, void 0);
    }
    _parse(t) {
      let r = O.util.getValidEnumValues(this._def.values), i = this._getOrReturnCtx(t);
      if (i.parsedType !== O.ZodParsedType.string && i.parsedType !== O.ZodParsedType.number) {
        let n = O.util.objectValues(r);
        return (0, v.addIssueToContext)(i, {
          expected: O.util.joinValues(n),
          received: i.parsedType,
          code: R.ZodIssueCode.invalid_type
        }), v.INVALID;
      }
      if (Da(this, os, "f") || q_(this, os, new Set(O.util.getValidEnumValues(this._def.values)), "f"), !Da(this, os, "f").has(t.data)) {
        let n = O.util.objectValues(r);
        return (0, v.addIssueToContext)(i, {
          received: i.data,
          code: R.ZodIssueCode.invalid_enum_value,
          options: n
        }), v.INVALID;
      }
      return (0, v.OK)(t.data);
    }
    get enum() {
      return this._def.values;
    }
  };
  y.ZodNativeEnum = Hr;
  os = /* @__PURE__ */ new WeakMap();
  Hr.create = (e, t) => new Hr({
    values: e,
    typeName: N.ZodNativeEnum,
    ...$(t)
  });
  var lr = class extends W {
    static {
      s(this, "ZodPromise");
    }
    unwrap() {
      return this._def.type;
    }
    _parse(t) {
      let { ctx: r } = this._processInputParams(t);
      if (r.parsedType !== O.ZodParsedType.promise && r.common.async === !1)
        return (0, v.addIssueToContext)(r, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.promise,
          received: r.parsedType
        }), v.INVALID;
      let i = r.parsedType === O.ZodParsedType.promise ? r.data : Promise.resolve(r.data);
      return (0, v.OK)(i.then((n) => this._def.type.parseAsync(n, {
        path: r.path,
        errorMap: r.common.contextualErrorMap
      })));
    }
  };
  y.ZodPromise = lr;
  lr.create = (e, t) => new lr({
    type: e,
    typeName: N.ZodPromise,
    ...$(t)
  });
  var Ze = class extends W {
    static {
      s(this, "ZodEffects");
    }
    innerType() {
      return this._def.schema;
    }
    sourceType() {
      return this._def.schema._def.typeName === N.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
    }
    _parse(t) {
      let { status: r, ctx: i } = this._processInputParams(t), n = this._def.effect || null, o = {
        addIssue: /* @__PURE__ */ s((a) => {
          (0, v.addIssueToContext)(i, a), a.fatal ? r.abort() : r.dirty();
        }, "addIssue"),
        get path() {
          return i.path;
        }
      };
      if (o.addIssue = o.addIssue.bind(o), n.type === "preprocess") {
        let a = n.transform(i.data, o);
        if (i.common.async)
          return Promise.resolve(a).then(async (u) => {
            if (r.value === "aborted")
              return v.INVALID;
            let l = await this._def.schema._parseAsync({
              data: u,
              path: i.path,
              parent: i
            });
            return l.status === "aborted" ? v.INVALID : l.status === "dirty" || r.value === "dirty" ? (0, v.DIRTY)(l.value) : l;
          });
        {
          if (r.value === "aborted")
            return v.INVALID;
          let u = this._def.schema._parseSync({
            data: a,
            path: i.path,
            parent: i
          });
          return u.status === "aborted" ? v.INVALID : u.status === "dirty" || r.value === "dirty" ? (0, v.DIRTY)(u.value) : u;
        }
      }
      if (n.type === "refinement") {
        let a = /* @__PURE__ */ s((u) => {
          let l = n.refinement(u, o);
          if (i.common.async)
            return Promise.resolve(l);
          if (l instanceof Promise)
            throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
          return u;
        }, "executeRefinement");
        if (i.common.async === !1) {
          let u = this._def.schema._parseSync({
            data: i.data,
            path: i.path,
            parent: i
          });
          return u.status === "aborted" ? v.INVALID : (u.status === "dirty" && r.dirty(), a(u.value), { status: r.value, value: u.value });
        } else
          return this._def.schema._parseAsync({ data: i.data, path: i.path, parent: i }).then((u) => u.status === "aborted" ? v.INVALID : (u.
          status === "dirty" && r.dirty(), a(u.value).then(() => ({ status: r.value, value: u.value }))));
      }
      if (n.type === "transform")
        if (i.common.async === !1) {
          let a = this._def.schema._parseSync({
            data: i.data,
            path: i.path,
            parent: i
          });
          if (!(0, v.isValid)(a))
            return a;
          let u = n.transform(a.value, o);
          if (u instanceof Promise)
            throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
          return { status: r.value, value: u };
        } else
          return this._def.schema._parseAsync({ data: i.data, path: i.path, parent: i }).then((a) => (0, v.isValid)(a) ? Promise.resolve(n.transform(
          a.value, o)).then((u) => ({ status: r.value, value: u })) : a);
      O.util.assertNever(n);
    }
  };
  y.ZodEffects = Ze;
  y.ZodTransformer = Ze;
  Ze.create = (e, t, r) => new Ze({
    schema: e,
    typeName: N.ZodEffects,
    effect: t,
    ...$(r)
  });
  Ze.createWithPreprocess = (e, t, r) => new Ze({
    schema: t,
    effect: { type: "preprocess", transform: e },
    typeName: N.ZodEffects,
    ...$(r)
  });
  var Xe = class extends W {
    static {
      s(this, "ZodOptional");
    }
    _parse(t) {
      return this._getType(t) === O.ZodParsedType.undefined ? (0, v.OK)(void 0) : this._def.innerType._parse(t);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  y.ZodOptional = Xe;
  Xe.create = (e, t) => new Xe({
    innerType: e,
    typeName: N.ZodOptional,
    ...$(t)
  });
  var _t = class extends W {
    static {
      s(this, "ZodNullable");
    }
    _parse(t) {
      return this._getType(t) === O.ZodParsedType.null ? (0, v.OK)(null) : this._def.innerType._parse(t);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  y.ZodNullable = _t;
  _t.create = (e, t) => new _t({
    innerType: e,
    typeName: N.ZodNullable,
    ...$(t)
  });
  var Vr = class extends W {
    static {
      s(this, "ZodDefault");
    }
    _parse(t) {
      let { ctx: r } = this._processInputParams(t), i = r.data;
      return r.parsedType === O.ZodParsedType.undefined && (i = this._def.defaultValue()), this._def.innerType._parse({
        data: i,
        path: r.path,
        parent: r
      });
    }
    removeDefault() {
      return this._def.innerType;
    }
  };
  y.ZodDefault = Vr;
  Vr.create = (e, t) => new Vr({
    innerType: e,
    typeName: N.ZodDefault,
    defaultValue: typeof t.default == "function" ? t.default : () => t.default,
    ...$(t)
  });
  var Zr = class extends W {
    static {
      s(this, "ZodCatch");
    }
    _parse(t) {
      let { ctx: r } = this._processInputParams(t), i = {
        ...r,
        common: {
          ...r.common,
          issues: []
        }
      }, n = this._def.innerType._parse({
        data: i.data,
        path: i.path,
        parent: {
          ...i
        }
      });
      return (0, v.isAsync)(n) ? n.then((o) => ({
        status: "valid",
        value: o.status === "valid" ? o.value : this._def.catchValue({
          get error() {
            return new R.ZodError(i.common.issues);
          },
          input: i.data
        })
      })) : {
        status: "valid",
        value: n.status === "valid" ? n.value : this._def.catchValue({
          get error() {
            return new R.ZodError(i.common.issues);
          },
          input: i.data
        })
      };
    }
    removeCatch() {
      return this._def.innerType;
    }
  };
  y.ZodCatch = Zr;
  Zr.create = (e, t) => new Zr({
    innerType: e,
    typeName: N.ZodCatch,
    catchValue: typeof t.catch == "function" ? t.catch : () => t.catch,
    ...$(t)
  });
  var ji = class extends W {
    static {
      s(this, "ZodNaN");
    }
    _parse(t) {
      if (this._getType(t) !== O.ZodParsedType.nan) {
        let i = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(i, {
          code: R.ZodIssueCode.invalid_type,
          expected: O.ZodParsedType.nan,
          received: i.parsedType
        }), v.INVALID;
      }
      return { status: "valid", value: t.data };
    }
  };
  y.ZodNaN = ji;
  ji.create = (e) => new ji({
    typeName: N.ZodNaN,
    ...$(e)
  });
  y.BRAND = Symbol("zod_brand");
  var as = class extends W {
    static {
      s(this, "ZodBranded");
    }
    _parse(t) {
      let { ctx: r } = this._processInputParams(t), i = r.data;
      return this._def.type._parse({
        data: i,
        path: r.path,
        parent: r
      });
    }
    unwrap() {
      return this._def.type;
    }
  };
  y.ZodBranded = as;
  var us = class e extends W {
    static {
      s(this, "ZodPipeline");
    }
    _parse(t) {
      let { status: r, ctx: i } = this._processInputParams(t);
      if (i.common.async)
        return (/* @__PURE__ */ s(async () => {
          let o = await this._def.in._parseAsync({
            data: i.data,
            path: i.path,
            parent: i
          });
          return o.status === "aborted" ? v.INVALID : o.status === "dirty" ? (r.dirty(), (0, v.DIRTY)(o.value)) : this._def.out._parseAsync(
          {
            data: o.value,
            path: i.path,
            parent: i
          });
        }, "handleAsync"))();
      {
        let n = this._def.in._parseSync({
          data: i.data,
          path: i.path,
          parent: i
        });
        return n.status === "aborted" ? v.INVALID : n.status === "dirty" ? (r.dirty(), {
          status: "dirty",
          value: n.value
        }) : this._def.out._parseSync({
          data: n.value,
          path: i.path,
          parent: i
        });
      }
    }
    static create(t, r) {
      return new e({
        in: t,
        out: r,
        typeName: N.ZodPipeline
      });
    }
  };
  y.ZodPipeline = us;
  var zr = class extends W {
    static {
      s(this, "ZodReadonly");
    }
    _parse(t) {
      let r = this._def.innerType._parse(t), i = /* @__PURE__ */ s((n) => ((0, v.isValid)(n) && (n.value = Object.freeze(n.value)), n), "fre\
eze");
      return (0, v.isAsync)(r) ? r.then((n) => i(n)) : i(r);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  y.ZodReadonly = zr;
  zr.create = (e, t) => new zr({
    innerType: e,
    typeName: N.ZodReadonly,
    ...$(t)
  });
  function W_(e, t = {}, r) {
    return e ? ur.create().superRefine((i, n) => {
      var o, a;
      if (!e(i)) {
        let u = typeof t == "function" ? t(i) : typeof t == "string" ? { message: t } : t, l = (a = (o = u.fatal) !== null && o !== void 0 ?
        o : r) !== null && a !== void 0 ? a : !0, c = typeof u == "string" ? { message: u } : u;
        n.addIssue({ code: "custom", ...c, fatal: l });
      }
    }) : ur.create();
  }
  s(W_, "custom");
  y.custom = W_;
  y.late = {
    object: $e.lazycreate
  };
  var N;
  (function(e) {
    e.ZodString = "ZodString", e.ZodNumber = "ZodNumber", e.ZodNaN = "ZodNaN", e.ZodBigInt = "ZodBigInt", e.ZodBoolean = "ZodBoolean", e.ZodDate =
    "ZodDate", e.ZodSymbol = "ZodSymbol", e.ZodUndefined = "ZodUndefined", e.ZodNull = "ZodNull", e.ZodAny = "ZodAny", e.ZodUnknown = "ZodUn\
known", e.ZodNever = "ZodNever", e.ZodVoid = "ZodVoid", e.ZodArray = "ZodArray", e.ZodObject = "ZodObject", e.ZodUnion = "ZodUnion", e.ZodDiscriminatedUnion =
    "ZodDiscriminatedUnion", e.ZodIntersection = "ZodIntersection", e.ZodTuple = "ZodTuple", e.ZodRecord = "ZodRecord", e.ZodMap = "ZodMap",
    e.ZodSet = "ZodSet", e.ZodFunction = "ZodFunction", e.ZodLazy = "ZodLazy", e.ZodLiteral = "ZodLiteral", e.ZodEnum = "ZodEnum", e.ZodEffects =
    "ZodEffects", e.ZodNativeEnum = "ZodNativeEnum", e.ZodOptional = "ZodOptional", e.ZodNullable = "ZodNullable", e.ZodDefault = "ZodDefaul\
t", e.ZodCatch = "ZodCatch", e.ZodPromise = "ZodPromise", e.ZodBranded = "ZodBranded", e.ZodPipeline = "ZodPipeline", e.ZodReadonly = "ZodRe\
adonly";
  })(N || (y.ZodFirstPartyTypeKind = N = {}));
  var MB = /* @__PURE__ */ s((e, t = {
    message: `Input not instance of ${e.name}`
  }) => W_((r) => r instanceof e, t), "instanceOfType");
  y.instanceof = MB;
  var H_ = ar.create;
  y.string = H_;
  var V_ = Br.create;
  y.number = V_;
  var jB = ji.create;
  y.nan = jB;
  var qB = Pr.create;
  y.bigint = qB;
  var Z_ = Ir.create;
  y.boolean = Z_;
  var LB = Mr.create;
  y.date = LB;
  var NB = Bi.create;
  y.symbol = NB;
  var UB = jr.create;
  y.undefined = UB;
  var $B = qr.create;
  y.null = $B;
  var WB = ur.create;
  y.any = WB;
  var HB = Wt.create;
  y.unknown = HB;
  var VB = ot.create;
  y.never = VB;
  var ZB = Pi.create;
  y.void = ZB;
  var zB = Ht.create;
  y.array = zB;
  var GB = $e.create;
  y.object = GB;
  var KB = $e.strictCreate;
  y.strictObject = KB;
  var YB = Lr.create;
  y.union = YB;
  var JB = ma.create;
  y.discriminatedUnion = JB;
  var XB = Nr.create;
  y.intersection = XB;
  var QB = vt.create;
  y.tuple = QB;
  var e8 = ga.create;
  y.record = e8;
  var t8 = Ii.create;
  y.map = t8;
  var r8 = Mi.create;
  y.set = r8;
  var i8 = ya.create;
  y.function = i8;
  var n8 = Ur.create;
  y.lazy = n8;
  var s8 = $r.create;
  y.literal = s8;
  var o8 = Wr.create;
  y.enum = o8;
  var a8 = Hr.create;
  y.nativeEnum = a8;
  var u8 = lr.create;
  y.promise = u8;
  var z_ = Ze.create;
  y.effect = z_;
  y.transformer = z_;
  var l8 = Xe.create;
  y.optional = l8;
  var c8 = _t.create;
  y.nullable = c8;
  var d8 = Ze.createWithPreprocess;
  y.preprocess = d8;
  var f8 = us.create;
  y.pipeline = f8;
  var h8 = /* @__PURE__ */ s(() => H_().optional(), "ostring");
  y.ostring = h8;
  var p8 = /* @__PURE__ */ s(() => V_().optional(), "onumber");
  y.onumber = p8;
  var D8 = /* @__PURE__ */ s(() => Z_().optional(), "oboolean");
  y.oboolean = D8;
  y.coerce = {
    string: /* @__PURE__ */ s((e) => ar.create({ ...e, coerce: !0 }), "string"),
    number: /* @__PURE__ */ s((e) => Br.create({ ...e, coerce: !0 }), "number"),
    boolean: /* @__PURE__ */ s((e) => Ir.create({
      ...e,
      coerce: !0
    }), "boolean"),
    bigint: /* @__PURE__ */ s((e) => Pr.create({ ...e, coerce: !0 }), "bigint"),
    date: /* @__PURE__ */ s((e) => Mr.create({ ...e, coerce: !0 }), "date")
  };
  y.NEVER = v.INVALID;
});

// ../node_modules/zod/lib/external.js
var Md = b((et) => {
  "use strict";
  var m8 = et && et.__createBinding || (Object.create ? function(e, t, r, i) {
    i === void 0 && (i = r);
    var n = Object.getOwnPropertyDescriptor(t, r);
    (!n || ("get" in n ? !t.__esModule : n.writable || n.configurable)) && (n = { enumerable: !0, get: /* @__PURE__ */ s(function() {
      return t[r];
    }, "get") }), Object.defineProperty(e, i, n);
  } : function(e, t, r, i) {
    i === void 0 && (i = r), e[i] = t[r];
  }), qi = et && et.__exportStar || function(e, t) {
    for (var r in e) r !== "default" && !Object.prototype.hasOwnProperty.call(t, r) && m8(t, e, r);
  };
  Object.defineProperty(et, "__esModule", { value: !0 });
  qi(fa(), et);
  qi(Bd(), et);
  qi(P_(), et);
  qi(is(), et);
  qi(G_(), et);
  qi(da(), et);
});

// ../node_modules/zod/lib/index.js
var J_ = b((We) => {
  "use strict";
  var K_ = We && We.__createBinding || (Object.create ? function(e, t, r, i) {
    i === void 0 && (i = r);
    var n = Object.getOwnPropertyDescriptor(t, r);
    (!n || ("get" in n ? !t.__esModule : n.writable || n.configurable)) && (n = { enumerable: !0, get: /* @__PURE__ */ s(function() {
      return t[r];
    }, "get") }), Object.defineProperty(e, i, n);
  } : function(e, t, r, i) {
    i === void 0 && (i = r), e[i] = t[r];
  }), g8 = We && We.__setModuleDefault || (Object.create ? function(e, t) {
    Object.defineProperty(e, "default", { enumerable: !0, value: t });
  } : function(e, t) {
    e.default = t;
  }), y8 = We && We.__importStar || function(e) {
    if (e && e.__esModule) return e;
    var t = {};
    if (e != null) for (var r in e) r !== "default" && Object.prototype.hasOwnProperty.call(e, r) && K_(t, e, r);
    return g8(t, e), t;
  }, b8 = We && We.__exportStar || function(e, t) {
    for (var r in e) r !== "default" && !Object.prototype.hasOwnProperty.call(t, r) && K_(t, e, r);
  };
  Object.defineProperty(We, "__esModule", { value: !0 });
  We.z = void 0;
  var Y_ = y8(Md());
  We.z = Y_;
  b8(Md(), We);
  We.default = Y_;
});

// src/cli/index.ts
var x8 = {};
aw(x8, {
  ANGULAR_JSON_PATH: () => es,
  AngularJSON: () => Ed,
  CommunityBuilder: () => dv,
  CoreBuilder: () => Kc,
  CoreWebpackCompilers: () => cv,
  ProjectType: () => ea,
  SUPPORTED_ESLINT_EXTENSIONS: () => F_,
  SUPPORTED_RENDERERS: () => wk,
  Settings: () => ls,
  SupportedLanguage: () => Yc,
  _clearGlobalSettings: () => C8,
  addToDevDependenciesIfNotPresent: () => Ok,
  adjustTemplate: () => yv,
  builderNameToCoreBuilder: () => Ck,
  cliStoriesTargetPath: () => gv,
  coerceSemver: () => jk,
  compilerNameToCoreCompiler: () => Ek,
  compoDocPreviewPrefix: () => $O,
  configureEslintPlugin: () => JO,
  copyTemplate: () => Bk,
  copyTemplateFiles: () => Ik,
  detect: () => Gk,
  detectBuilder: () => Hk,
  detectFrameworkPreset: () => wv,
  detectLanguage: () => zk,
  detectPnp: () => Zk,
  externalFrameworks: () => Gc,
  extractEslintInfo: () => YO,
  findEslintFile: () => S_,
  frameworkToDefaultBuilder: () => Pk,
  frameworkToRenderer: () => Dv,
  getBabelDependencies: () => kk,
  getRendererDir: () => td,
  getStorybookVersionSpecifier: () => Mk,
  getVersionSafe: () => mv,
  globalSettings: () => E8,
  hasStorybookDependencies: () => qk,
  installableProjectTypes: () => Fk,
  isNxProject: () => rd,
  isStorybookInstantiated: () => Vk,
  normalizeExtends: () => la,
  promptForCompoDocs: () => WO,
  readFileAsJson: () => Ak,
  suggestESLintPlugin: () => XO,
  supportedTemplates: () => Jc,
  unsupportedTemplate: () => Xc,
  writeFileAsJson: () => Rk
});
module.exports = uw(x8);

// src/cli/detect.ts
var Zn = require("node:fs"), bv = require("node:path"), zn = require("@storybook/core/common"), vv = require("@storybook/core/node-logger");

// node_modules/find-up/index.js
var Kr = re(require("node:path"), 1);

// ../node_modules/locate-path/index.js
var Ld = re(require("node:process"), 1), Nd = re(require("node:path"), 1), ds = re(require("node:fs"), 1), Ud = require("node:url");
var $d = {
  directory: "isDirectory",
  file: "isFile"
};
function lw(e) {
  if (!Object.hasOwnProperty.call($d, e))
    throw new Error(`Invalid type specified: ${e}`);
}
s(lw, "checkType");
var cw = /* @__PURE__ */ s((e, t) => t[$d[e]](), "matchType"), dw = /* @__PURE__ */ s((e) => e instanceof URL ? (0, Ud.fileURLToPath)(e) : e,
"toPath");
function Ea(e, {
  cwd: t = Ld.default.cwd(),
  type: r = "file",
  allowSymlinks: i = !0
} = {}) {
  lw(r), t = dw(t);
  let n = i ? ds.default.statSync : ds.default.lstatSync;
  for (let o of e)
    try {
      let a = n(Nd.default.resolve(t, o), {
        throwIfNoEntry: !1
      });
      if (!a)
        continue;
      if (cw(r, a))
        return o;
    } catch {
    }
}
s(Ea, "locatePathSync");

// node_modules/unicorn-magic/node.js
var Wd = require("node:url");
function Ca(e) {
  return e instanceof URL ? (0, Wd.fileURLToPath)(e) : e;
}
s(Ca, "toPath");

// node_modules/path-exists/index.js
var Hd = re(require("node:fs"), 1);

// node_modules/find-up/index.js
var fw = Symbol("findUpStop");
function hw(e, t = {}) {
  let r = Kr.default.resolve(Ca(t.cwd) ?? ""), { root: i } = Kr.default.parse(r), n = Kr.default.resolve(r, Ca(t.stopAt) ?? i), o = t.limit ??
  Number.POSITIVE_INFINITY, a = [e].flat(), u = /* @__PURE__ */ s((c) => {
    if (typeof e != "function")
      return Ea(a, c);
    let d = e(c.cwd);
    return typeof d == "string" ? Ea([d], c) : d;
  }, "runMatcher"), l = [];
  for (; ; ) {
    let c = u({ ...t, cwd: r });
    if (c === fw || (c && l.push(Kr.default.resolve(r, c)), r === n || l.length >= o))
      break;
    r = Kr.default.dirname(r);
  }
  return l;
}
s(hw, "findUpMultipleSync");
function Yr(e, t = {}) {
  return hw(e, { ...t, limit: 1 })[0];
}
s(Yr, "findUpSync");

// src/cli/detect.ts
var _v = re(Ts(), 1), ir = re(require("semver"), 1);

// src/cli/helpers.ts
var je = require("node:fs"), Fr = require("node:fs/promises"), nt = require("node:path"), fv = require("@storybook/core/common"), hv = require("@storybook/core/common");
var pv = re(ju(), 1), Sr = require("semver");

// ../node_modules/strip-json-comments/index.js
var qu = Symbol("singleComment"), ED = Symbol("multiComment"), _x = /* @__PURE__ */ s(() => "", "stripWithoutWhitespace"), wx = /* @__PURE__ */ s(
(e, t, r) => e.slice(t, r).replace(/\S/g, " "), "stripWithWhitespace"), Ex = /* @__PURE__ */ s((e, t) => {
  let r = t - 1, i = 0;
  for (; e[r] === "\\"; )
    r -= 1, i += 1;
  return !!(i % 2);
}, "isEscaped");
function Lu(e, { whitespace: t = !0, trailingCommas: r = !1 } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected argument \`jsonString\` to be a \`string\`, got \`${typeof e}\``);
  let i = t ? wx : _x, n = !1, o = !1, a = 0, u = "", l = "", c = -1;
  for (let d = 0; d < e.length; d++) {
    let p = e[d], h = e[d + 1];
    if (!o && p === '"' && (Ex(e, d) || (n = !n)), !n)
      if (!o && p + h === "//")
        u += e.slice(a, d), a = d, o = qu, d++;
      else if (o === qu && p + h === `\r
`) {
        d++, o = !1, u += i(e, a, d), a = d;
        continue;
      } else if (o === qu && p === `
`)
        o = !1, u += i(e, a, d), a = d;
      else if (!o && p + h === "/*") {
        u += e.slice(a, d), a = d, o = ED, d++;
        continue;
      } else if (o === ED && p + h === "*/") {
        d++, o = !1, u += i(e, a, d + 1), a = d + 1;
        continue;
      } else r && !o && (c !== -1 ? p === "}" || p === "]" ? (u += e.slice(a, d), l += i(u, 0, 1) + u.slice(1), u = "", a = d, c = -1) : p !==
      " " && p !== "	" && p !== "\r" && p !== `
` && (u += e.slice(a, d), a = d, c = -1) : p === "," && (l += u + e.slice(a, d), u = "", a = d, c = d));
  }
  return l + u + (o ? i(e.slice(a)) : e.slice(a));
}
s(Lu, "stripJsonComments");

// ../node_modules/tiny-invariant/dist/esm/tiny-invariant.js
var Cx = process.env.NODE_ENV === "production", Nu = "Invariant failed";
function en(e, t) {
  if (!e) {
    if (Cx)
      throw new Error(Nu);
    var r = typeof t == "function" ? t() : t, i = r ? "".concat(Nu, ": ").concat(r) : Nu;
    throw new Error(i);
  }
}
s(en, "invariant");

// src/cli/dirs.ts
var Vn = require("node:path"), ta = require("@storybook/core/common"), Qc = re(ov(), 1), ed = re(lv(), 1);

// src/cli/project_types.ts
var Qo = require("semver");
function _k(e, t) {
  return (0, Qo.validRange)(e) ? (0, Qo.minVersion)(e)?.major === t : !1;
}
s(_k, "eqMajor");
var Gc = [
  { name: "qwik", packageName: "storybook-framework-qwik" },
  { name: "solid", frameworks: ["storybook-solidjs-vite"], renderer: "storybook-solidjs" },
  {
    name: "nuxt",
    packageName: "@storybook-vue/nuxt",
    frameworks: ["@storybook-vue/nuxt"],
    renderer: "@storybook/vue3"
  }
], wk = [
  "react",
  "react-native",
  "vue3",
  "angular",
  "ember",
  "preact",
  "svelte",
  "qwik",
  "solid"
], ea = /* @__PURE__ */ ((F) => (F.UNDETECTED = "UNDETECTED", F.UNSUPPORTED = "UNSUPPORTED", F.REACT = "REACT", F.REACT_SCRIPTS = "REACT_SCR\
IPTS", F.REACT_NATIVE = "REACT_NATIVE", F.REACT_NATIVE_WEB = "REACT_NATIVE_WEB", F.REACT_PROJECT = "REACT_PROJECT", F.WEBPACK_REACT = "WEBPA\
CK_REACT", F.NEXTJS = "NEXTJS", F.VUE3 = "VUE3", F.NUXT = "NUXT", F.ANGULAR = "ANGULAR", F.EMBER = "EMBER", F.WEB_COMPONENTS = "WEB_COMPONEN\
TS", F.HTML = "HTML", F.QWIK = "QWIK", F.PREACT = "PREACT", F.SVELTE = "SVELTE", F.SVELTEKIT = "SVELTEKIT", F.SERVER = "SERVER", F.NX = "NX",
F.SOLID = "SOLID", F))(ea || {}), Kc = /* @__PURE__ */ ((r) => (r.Webpack5 = "webpack5", r.Vite = "vite", r))(Kc || {}), cv = /* @__PURE__ */ ((r) => (r.
Babel = "babel", r.SWC = "swc", r))(cv || {}), dv = /* @__PURE__ */ ((t) => (t.Rsbuild = "rsbuild", t))(dv || {}), Ek = {
  "@storybook/addon-webpack5-compiler-babel": "babel",
  "@storybook/addon-webpack5-compiler-swc": "swc"
}, Ck = {
  "@storybook/builder-webpack5": "webpack5",
  "@storybook/builder-vite": "vite"
}, Yc = /* @__PURE__ */ ((i) => (i.JAVASCRIPT = "javascript", i.TYPESCRIPT_3_8 = "typescript-3-8", i.TYPESCRIPT_4_9 = "typescript-4-9", i))(
Yc || {}), Jc = [
  {
    preset: "NUXT",
    dependencies: ["nuxt"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.every(Boolean) ?? !0, "matcherFunction")
  },
  {
    preset: "VUE3",
    dependencies: {
      // This Vue template works with Vue 3
      vue: /* @__PURE__ */ s((e) => e === "next" || _k(e, 3), "vue")
    },
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.some(Boolean) ?? !1, "matcherFunction")
  },
  {
    preset: "EMBER",
    dependencies: ["ember-cli"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.every(Boolean) ?? !0, "matcherFunction")
  },
  {
    preset: "NEXTJS",
    dependencies: ["next"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.every(Boolean) ?? !0, "matcherFunction")
  },
  {
    preset: "QWIK",
    dependencies: ["@builder.io/qwik"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.every(Boolean) ?? !0, "matcherFunction")
  },
  {
    preset: "REACT_PROJECT",
    peerDependencies: ["react"],
    matcherFunction: /* @__PURE__ */ s(({ peerDependencies: e }) => e?.every(Boolean) ?? !0, "matcherFunction")
  },
  {
    preset: "REACT_NATIVE",
    dependencies: ["react-native", "react-native-scripts"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.some(Boolean) ?? !1, "matcherFunction")
  },
  {
    preset: "REACT_SCRIPTS",
    // For projects using a custom/forked `react-scripts` package.
    files: ["/node_modules/.bin/react-scripts"],
    // For standard CRA projects
    dependencies: ["react-scripts"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e, files: t }) => (e?.every(Boolean) || t?.every(Boolean)) ?? !1, "matcherFunction")
  },
  {
    preset: "ANGULAR",
    dependencies: ["@angular/core"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.every(Boolean) ?? !0, "matcherFunction")
  },
  {
    preset: "WEB_COMPONENTS",
    dependencies: ["lit-element", "lit-html", "lit"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.some(Boolean) ?? !1, "matcherFunction")
  },
  {
    preset: "PREACT",
    dependencies: ["preact"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.every(Boolean) ?? !0, "matcherFunction")
  },
  {
    // TODO: This only works because it is before the SVELTE template. could be more explicit
    preset: "SVELTEKIT",
    dependencies: ["@sveltejs/kit"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.every(Boolean) ?? !0, "matcherFunction")
  },
  {
    preset: "SVELTE",
    dependencies: ["svelte"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.every(Boolean) ?? !0, "matcherFunction")
  },
  {
    preset: "SOLID",
    dependencies: ["solid-js"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.every(Boolean) ?? !0, "matcherFunction")
  },
  // DO NOT MOVE ANY TEMPLATES BELOW THIS LINE
  // React is part of every Template, after Storybook is initialized once
  {
    preset: "WEBPACK_REACT",
    dependencies: ["react", "webpack"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.every(Boolean) ?? !0, "matcherFunction")
  },
  {
    preset: "REACT",
    dependencies: ["react"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.every(Boolean) ?? !0, "matcherFunction")
  }
], Xc = {
  preset: "UNSUPPORTED",
  dependencies: {},
  matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.some(Boolean) ?? !1, "matcherFunction")
}, xk = [
  "UNDETECTED",
  "UNSUPPORTED",
  "NX"
], Fk = Object.values(ea).filter((e) => !xk.includes(e)).map((e) => e.toLowerCase());

// src/cli/dirs.ts
var Sk = /* @__PURE__ */ s(async (e, t) => {
  let r = await (0, ta.temporaryDirectory)(), n = ta.versions[t] || await e.latestVersion(t), o = ed.default.default || ed.default, a = Qc.default.
  default || Qc.default, u = o(t, n, {
    registry: await e.getRegistryURL()
  });
  return await a({ url: u, dir: r }), (0, Vn.join)(r, "package");
}, "resolveUsingBranchInstall");
async function td(e, t) {
  let r = Gc.find((a) => a.name === t), i = r?.packageName || r?.renderer || `@storybook/${t}`, n = (0, Vn.join)(i, "package.json"), o = [];
  try {
    return (0, Vn.dirname)(
      require.resolve(n, {
        paths: [process.cwd()]
      })
    );
  } catch (a) {
    en(a instanceof Error), o.push(a);
  }
  try {
    return await Sk(e, i);
  } catch (a) {
    en(a instanceof Error), o.push(a);
  }
  throw new Error(`Cannot find ${n}, ${o.map((a) => a.stack).join(`

`)}`);
}
s(td, "getRendererDir");

// src/cli/helpers.ts
var Tk = console;
function Ak(e, t) {
  let r = (0, nt.resolve)(e);
  if (!(0, je.existsSync)(r))
    return !1;
  let i = (0, je.readFileSync)(r, "utf8"), n = t ? Lu(i) : i;
  try {
    return JSON.parse(n);
  } catch (o) {
    throw Tk.error(pv.default.red(`Invalid json in file: ${r}`)), o;
  }
}
s(Ak, "readFileAsJson");
var Rk = /* @__PURE__ */ s((e, t) => {
  let r = (0, nt.resolve)(e);
  return (0, je.existsSync)(r) ? ((0, je.writeFileSync)(r, `${JSON.stringify(t, null, 2)}
`), !0) : !1;
}, "writeFileAsJson");
async function kk(e, t) {
  let r = [], i = "^8.0.0-0", n = t.dependencies["babel-core"] || t.devDependencies["babel-core"];
  if (n) {
    let o = await e.latestVersion(
      "babel-core",
      n
    );
    (0, Sr.satisfies)(o, "^6.0.0") && (i = "^7.0.0");
  } else if (!t.dependencies["@babel/core"] && !t.devDependencies["@babel/core"]) {
    let o = await e.getVersion("@babel/core");
    r.push(`@babel/core@${o}`);
  }
  if (!t.dependencies["babel-loader"] && !t.devDependencies["babel-loader"]) {
    let o = await e.getVersion(
      "babel-loader",
      i
    );
    r.push(`babel-loader@${o}`);
  }
  return r;
}
s(kk, "getBabelDependencies");
function Ok(e, t, r) {
  !e.dependencies?.[t] && !e.devDependencies?.[t] && (e.devDependencies ? e.devDependencies[t] = r : e.devDependencies = {
    [t]: r
  });
}
s(Ok, "addToDevDependenciesIfNotPresent");
function Bk(e, t = ".") {
  let r = (0, nt.resolve)(e, "template-csf/");
  if (!(0, je.existsSync)(r))
    throw new Error("Couldn't find template dir");
  (0, je.cpSync)(r, t, { recursive: !0 });
}
s(Bk, "copyTemplate");
var Dv = fv.frameworkToRenderer, Pk = {
  angular: "webpack5",
  ember: "webpack5",
  "html-vite": "vite",
  "html-webpack5": "webpack5",
  nextjs: "webpack5",
  nuxt: "vite",
  "experimental-nextjs-vite": "vite",
  "preact-vite": "vite",
  "preact-webpack5": "webpack5",
  qwik: "vite",
  "react-native-web-vite": "vite",
  "react-vite": "vite",
  "react-webpack5": "webpack5",
  "server-webpack5": "webpack5",
  solid: "vite",
  "svelte-vite": "vite",
  "svelte-webpack5": "webpack5",
  sveltekit: "vite",
  "vue3-vite": "vite",
  "vue3-webpack5": "webpack5",
  "web-components-vite": "vite",
  "web-components-webpack5": "webpack5",
  // Only to pass type checking, will never be used
  "react-rsbuild": "rsbuild",
  "vue3-rsbuild": "rsbuild"
};
async function mv(e, t) {
  try {
    let r = await e.getInstalledVersion(t);
    return r || (r = (await e.getAllDependencies())[t] ?? ""), (0, Sr.coerce)(r, { includePrerelease: !0 })?.toString();
  } catch {
  }
}
s(mv, "getVersionSafe");
var gv = /* @__PURE__ */ s(async () => (0, je.existsSync)("./src") ? "./src/stories" : "./stories", "cliStoriesTargetPath");
async function Ik({
  packageManager: e,
  renderer: t,
  language: r,
  destination: i,
  commonAssetsDir: n,
  features: o
}) {
  let a = {
    // keeping this for backwards compatibility in case community packages are using it
    typescript: "ts",
    javascript: "js",
    "typescript-3-8": "ts-3-8",
    "typescript-4-9": "ts-4-9"
  };
  if (t === "svelte") {
    let d = await mv(e, "svelte");
    d && (0, Sr.major)(d) >= 5 && (a = {
      // keeping this for backwards compatibility in case community packages are using it
      typescript: "ts",
      javascript: "svelte-5-js",
      "typescript-3-8": "svelte-5-ts-3-8",
      "typescript-4-9": "svelte-5-ts-4-9"
    });
  }
  let u = /* @__PURE__ */ s(async () => {
    let d = await td(e, t), p = (0, nt.join)(d, "template", "cli"), h = (0, nt.join)(p, a[r]), f = (0, nt.join)(p, a.javascript), g = (0, nt.join)(
    p, a.typescript), E = (0, nt.join)(p, a["typescript-3-8"]);
    if ((0, je.existsSync)(h))
      return h;
    if (r === "typescript-4-9" && (0, je.existsSync)(E))
      return E;
    if ((0, je.existsSync)(g))
      return g;
    if ((0, je.existsSync)(f))
      return f;
    if ((0, je.existsSync)(p))
      return p;
    throw new Error(`Unsupported renderer: ${t} (${d})`);
  }, "templatePath"), l = i ?? await gv(), c = /* @__PURE__ */ s((d) => o.includes("docs") || !d.endsWith(".mdx"), "filter");
  if (n && await (0, Fr.cp)(n, l, { recursive: !0, filter: c }), await (0, Fr.cp)(await u(), l, { recursive: !0, filter: c }), n && o.includes(
  "docs")) {
    let d = Dv[t] || "react";
    d === "vue3" && (d = "vue"), await yv((0, nt.join)(l, "Configure.mdx"), { renderer: d });
  }
}
s(Ik, "copyTemplateFiles");
async function yv(e, t) {
  let r = await (0, Fr.readFile)(e, { encoding: "utf8" });
  Object.keys(t).forEach((i) => {
    r = r.replaceAll(`{{${i}}}`, `${t[i]}`);
  }), await (0, Fr.writeFile)(e, r);
}
s(yv, "adjustTemplate");
function Mk(e) {
  let t = {
    ...e.dependencies,
    ...e.devDependencies,
    ...e.optionalDependencies
  }, r = Object.keys(t).find((i) => hv.versions[i]);
  if (!r)
    throw new Error("Couldn't find any official storybook packages in package.json");
  return t[r];
}
s(Mk, "getStorybookVersionSpecifier");
async function rd() {
  return Yr("nx.json");
}
s(rd, "isNxProject");
function jk(e) {
  let t = (0, Sr.coerce)(e);
  return en(t != null, `Could not coerce ${e} into a semver.`), t;
}
s(jk, "coerceSemver");
async function qk(e) {
  let t = await e.getAllDependencies();
  return Object.keys(t).some((r) => r.includes("storybook"));
}
s(qk, "hasStorybookDependencies");

// src/cli/detect.ts
var Lk = ["vite.config.ts", "vite.config.js", "vite.config.mjs"], Nk = ["webpack.config.js"], Uk = /* @__PURE__ */ s((e, t, r) => {
  let i = e.dependencies?.[t] || e.devDependencies?.[t];
  return i && typeof r == "function" ? r(i) : !!i;
}, "hasDependency"), $k = /* @__PURE__ */ s((e, t, r) => {
  let i = e.peerDependencies?.[t];
  return i && typeof r == "function" ? r(i) : !!i;
}, "hasPeerDependency"), Wk = /* @__PURE__ */ s((e, t) => {
  let r = {
    dependencies: [!1],
    peerDependencies: [!1],
    files: [!1]
  }, { preset: i, files: n, dependencies: o, peerDependencies: a, matcherFunction: u } = t, l = [];
  Array.isArray(o) ? l = o.map((d) => [d, void 0]) : typeof o == "object" && (l = Object.entries(o)), l.length > 0 && (r.dependencies = l.map(
    ([d, p]) => Uk(e, d, p)
  ));
  let c = [];
  return Array.isArray(a) ? c = a.map((d) => [d, void 0]) : typeof a == "object" && (c = Object.entries(a)), c.length > 0 && (r.peerDependencies =
  c.map(
    ([d, p]) => $k(e, d, p)
  )), Array.isArray(n) && n.length > 0 && (r.files = n.map((d) => (0, Zn.existsSync)(d))), u(r) ? i : null;
}, "getFrameworkPreset");
function wv(e = {}) {
  let t = [...Jc, Xc].find((r) => Wk(e, r) !== null);
  return t ? t.preset : "UNDETECTED";
}
s(wv, "detectFrameworkPreset");
async function Hk(e, t) {
  let r = Yr(Lk), i = Yr(Nk), n = await e.getAllDependencies();
  if (r || n.vite && n.webpack === void 0)
    return (0, zn.commandLog)("Detected Vite project. Setting builder to Vite")(), "vite";
  if (i || (n.webpack || n["@nuxt/webpack-builder"]) && n.vite !== void 0)
    return (0, zn.commandLog)("Detected webpack project. Setting builder to webpack")(), "webpack5";
  switch (t) {
    case "REACT_NATIVE_WEB":
      return "vite";
    case "REACT_SCRIPTS":
    case "ANGULAR":
    case "REACT_NATIVE":
    // technically react native doesn't use webpack, we just want to set something
    case "NEXTJS":
    case "EMBER":
      return "webpack5";
    case "NUXT":
      return "vite";
    default:
      let { builder: o } = await (0, _v.default)(
        {
          type: "select",
          name: "builder",
          message: `
We were not able to detect the right builder for your project. Please select one:`,
          choices: [
            { title: "Vite", value: "vite" },
            { title: "Webpack 5", value: "webpack5" }
          ]
        },
        {
          onCancel: /* @__PURE__ */ s(() => {
            throw new zn.HandledError("Canceled by the user");
          }, "onCancel")
        }
      );
      return o;
  }
}
s(Hk, "detectBuilder");
function Vk(e = (0, bv.resolve)(process.cwd(), ".storybook")) {
  return (0, Zn.existsSync)(e);
}
s(Vk, "isStorybookInstantiated");
async function Zk() {
  return !!Yr([".pnp.js", ".pnp.cjs"]);
}
s(Zk, "detectPnp");
async function zk(e) {
  let t = "javascript";
  if ((0, Zn.existsSync)("jsconfig.json"))
    return t;
  let r = await e.getAllDependencies().then((l) => !!l.typescript), i = await e.getPackageVersion("typescript"), n = await e.getPackageVersion(
  "prettier"), o = await e.getPackageVersion(
    "@babel/plugin-transform-typescript"
  ), a = await e.getPackageVersion(
    "@typescript-eslint/parser"
  ), u = await e.getPackageVersion("eslint-plugin-storybook");
  return r && i ? ir.default.gte(i, "4.9.0") && (!n || ir.default.gte(n, "2.8.0")) && (!o || ir.default.gte(o, "7.20.0")) && (!a || ir.default.
  gte(a, "5.44.0")) && (!u || ir.default.gte(u, "0.6.8")) ? t = "typescript-4-9" : ir.default.gte(i, "3.8.0") ? t = "typescript-3-8" : ir.default.
  lt(i, "3.8.0") && vv.logger.warn("Detected TypeScript < 3.8, populating with JavaScript examples") : (0, Zn.existsSync)("tsconfig.json") &&
  (t = "typescript-4-9"), t;
}
s(zk, "detectLanguage");
async function Gk(e, t = {}) {
  let r = await e.retrievePackageJson();
  return r ? await rd() ? "NX" : t.html ? "HTML" : wv(r) : "UNDETECTED";
}
s(Gk, "detect");

// src/cli/angular/helpers.ts
var ki = require("node:fs"), y_ = require("node:path"), b_ = require("@storybook/core/node-logger"), v_ = require("@storybook/core/server-errors");

// ../node_modules/boxen/index.js
var Yn = re(require("node:process"), 1);

// ../node_modules/ansi-regex/index.js
function id({ onlyFirst: e = !1 } = {}) {
  let t = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
  ].join("|");
  return new RegExp(t, e ? void 0 : "g");
}
s(id, "ansiRegex");

// ../node_modules/strip-ansi/index.js
var Kk = id();
function Tr(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a \`string\`, got \`${typeof e}\``);
  return e.replace(Kk, "");
}
s(Tr, "stripAnsi");

// ../node_modules/boxen/node_modules/string-width/index.js
var xv = re(sd(), 1), Fv = re(od(), 1);
function Ye(e, t = {}) {
  if (typeof e != "string" || e.length === 0 || (t = {
    ambiguousIsNarrow: !0,
    ...t
  }, e = Tr(e), e.length === 0))
    return 0;
  e = e.replace((0, Fv.default)(), "  ");
  let r = t.ambiguousIsNarrow ? 1 : 2, i = 0;
  for (let n of e) {
    let o = n.codePointAt(0);
    if (o <= 31 || o >= 127 && o <= 159 || o >= 768 && o <= 879)
      continue;
    switch (xv.default.eastAsianWidth(n)) {
      case "F":
      case "W":
        i += 2;
        break;
      case "A":
        i += r;
        break;
      default:
        i += 1;
    }
  }
  return i;
}
s(Ye, "stringWidth");

// ../node_modules/boxen/node_modules/chalk/source/vendor/ansi-styles/index.js
var Sv = /* @__PURE__ */ s((e = 0) => (t) => `\x1B[${t + e}m`, "wrapAnsi16"), Tv = /* @__PURE__ */ s((e = 0) => (t) => `\x1B[${38 + e};5;${t}\
m`, "wrapAnsi256"), Av = /* @__PURE__ */ s((e = 0) => (t, r, i) => `\x1B[${38 + e};2;${t};${r};${i}m`, "wrapAnsi16m"), De = {
  modifier: {
    reset: [0, 0],
    // 21 isn't widely supported and 22 does the same thing
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    // Bright color
    blackBright: [90, 39],
    gray: [90, 39],
    // Alias of `blackBright`
    grey: [90, 39],
    // Alias of `blackBright`
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    // Bright color
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    // Alias of `bgBlackBright`
    bgGrey: [100, 49],
    // Alias of `bgBlackBright`
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
}, tL = Object.keys(De.modifier), Yk = Object.keys(De.color), Jk = Object.keys(De.bgColor), rL = [...Yk, ...Jk];
function Xk() {
  let e = /* @__PURE__ */ new Map();
  for (let [t, r] of Object.entries(De)) {
    for (let [i, n] of Object.entries(r))
      De[i] = {
        open: `\x1B[${n[0]}m`,
        close: `\x1B[${n[1]}m`
      }, r[i] = De[i], e.set(n[0], n[1]);
    Object.defineProperty(De, t, {
      value: r,
      enumerable: !1
    });
  }
  return Object.defineProperty(De, "codes", {
    value: e,
    enumerable: !1
  }), De.color.close = "\x1B[39m", De.bgColor.close = "\x1B[49m", De.color.ansi = Sv(), De.color.ansi256 = Tv(), De.color.ansi16m = Av(), De.
  bgColor.ansi = Sv(10), De.bgColor.ansi256 = Tv(10), De.bgColor.ansi16m = Av(10), Object.defineProperties(De, {
    rgbToAnsi256: {
      value(t, r, i) {
        return t === r && r === i ? t < 8 ? 16 : t > 248 ? 231 : Math.round((t - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(t / 255 * 5) + 6 *
        Math.round(r / 255 * 5) + Math.round(i / 255 * 5);
      },
      enumerable: !1
    },
    hexToRgb: {
      value(t) {
        let r = /[a-f\d]{6}|[a-f\d]{3}/i.exec(t.toString(16));
        if (!r)
          return [0, 0, 0];
        let [i] = r;
        i.length === 3 && (i = [...i].map((o) => o + o).join(""));
        let n = Number.parseInt(i, 16);
        return [
          /* eslint-disable no-bitwise */
          n >> 16 & 255,
          n >> 8 & 255,
          n & 255
          /* eslint-enable no-bitwise */
        ];
      },
      enumerable: !1
    },
    hexToAnsi256: {
      value: /* @__PURE__ */ s((t) => De.rgbToAnsi256(...De.hexToRgb(t)), "value"),
      enumerable: !1
    },
    ansi256ToAnsi: {
      value(t) {
        if (t < 8)
          return 30 + t;
        if (t < 16)
          return 90 + (t - 8);
        let r, i, n;
        if (t >= 232)
          r = ((t - 232) * 10 + 8) / 255, i = r, n = r;
        else {
          t -= 16;
          let u = t % 36;
          r = Math.floor(t / 36) / 5, i = Math.floor(u / 6) / 5, n = u % 6 / 5;
        }
        let o = Math.max(r, i, n) * 2;
        if (o === 0)
          return 30;
        let a = 30 + (Math.round(n) << 2 | Math.round(i) << 1 | Math.round(r));
        return o === 2 && (a += 60), a;
      },
      enumerable: !1
    },
    rgbToAnsi: {
      value: /* @__PURE__ */ s((t, r, i) => De.ansi256ToAnsi(De.rgbToAnsi256(t, r, i)), "value"),
      enumerable: !1
    },
    hexToAnsi: {
      value: /* @__PURE__ */ s((t) => De.ansi256ToAnsi(De.hexToAnsi256(t)), "value"),
      enumerable: !1
    }
  }), De;
}
s(Xk, "assembleStyles");
var Qk = Xk(), st = Qk;

// ../node_modules/boxen/node_modules/chalk/source/vendor/supports-color/index.js
var ia = re(require("node:process"), 1), kv = re(require("node:os"), 1), ad = re(require("node:tty"), 1);
function Je(e, t = globalThis.Deno ? globalThis.Deno.args : ia.default.argv) {
  let r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", i = t.indexOf(r + e), n = t.indexOf("--");
  return i !== -1 && (n === -1 || i < n);
}
s(Je, "hasFlag");
var { env: we } = ia.default, ra;
Je("no-color") || Je("no-colors") || Je("color=false") || Je("color=never") ? ra = 0 : (Je("color") || Je("colors") || Je("color=true") || Je(
"color=always")) && (ra = 1);
function eO() {
  if ("FORCE_COLOR" in we)
    return we.FORCE_COLOR === "true" ? 1 : we.FORCE_COLOR === "false" ? 0 : we.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(we.FORCE_COLOR,
    10), 3);
}
s(eO, "envForceColor");
function tO(e) {
  return e === 0 ? !1 : {
    level: e,
    hasBasic: !0,
    has256: e >= 2,
    has16m: e >= 3
  };
}
s(tO, "translateLevel");
function rO(e, { streamIsTTY: t, sniffFlags: r = !0 } = {}) {
  let i = eO();
  i !== void 0 && (ra = i);
  let n = r ? ra : i;
  if (n === 0)
    return 0;
  if (r) {
    if (Je("color=16m") || Je("color=full") || Je("color=truecolor"))
      return 3;
    if (Je("color=256"))
      return 2;
  }
  if ("TF_BUILD" in we && "AGENT_NAME" in we)
    return 1;
  if (e && !t && n === void 0)
    return 0;
  let o = n || 0;
  if (we.TERM === "dumb")
    return o;
  if (ia.default.platform === "win32") {
    let a = kv.default.release().split(".");
    return Number(a[0]) >= 10 && Number(a[2]) >= 10586 ? Number(a[2]) >= 14931 ? 3 : 2 : 1;
  }
  if ("CI" in we)
    return ["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((a) => a in we) ? 3 : ["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRON\
E"].some((a) => a in we) || we.CI_NAME === "codeship" ? 1 : o;
  if ("TEAMCITY_VERSION" in we)
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(we.TEAMCITY_VERSION) ? 1 : 0;
  if (we.COLORTERM === "truecolor" || we.TERM === "xterm-kitty")
    return 3;
  if ("TERM_PROGRAM" in we) {
    let a = Number.parseInt((we.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (we.TERM_PROGRAM) {
      case "iTerm.app":
        return a >= 3 ? 3 : 2;
      case "Apple_Terminal":
        return 2;
    }
  }
  return /-256(color)?$/i.test(we.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(we.TERM) || "COLORTERM" in we ?
  1 : o;
}
s(rO, "_supportsColor");
function Rv(e, t = {}) {
  let r = rO(e, {
    streamIsTTY: e && e.isTTY,
    ...t
  });
  return tO(r);
}
s(Rv, "createSupportsColor");
var iO = {
  stdout: Rv({ isTTY: ad.default.isatty(1) }),
  stderr: Rv({ isTTY: ad.default.isatty(2) })
}, Ov = iO;

// ../node_modules/boxen/node_modules/chalk/source/utilities.js
function Bv(e, t, r) {
  let i = e.indexOf(t);
  if (i === -1)
    return e;
  let n = t.length, o = 0, a = "";
  do
    a += e.slice(o, i) + t + r, o = i + n, i = e.indexOf(t, o);
  while (i !== -1);
  return a += e.slice(o), a;
}
s(Bv, "stringReplaceAll");
function Pv(e, t, r, i) {
  let n = 0, o = "";
  do {
    let a = e[i - 1] === "\r";
    o += e.slice(n, a ? i - 1 : i) + t + (a ? `\r
` : `
`) + r, n = i + 1, i = e.indexOf(`
`, n);
  } while (i !== -1);
  return o += e.slice(n), o;
}
s(Pv, "stringEncaseCRLFWithFirstIndex");

// ../node_modules/boxen/node_modules/chalk/source/index.js
var { stdout: Iv, stderr: Mv } = Ov, ud = Symbol("GENERATOR"), Ai = Symbol("STYLER"), Gn = Symbol("IS_EMPTY"), jv = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
], Ri = /* @__PURE__ */ Object.create(null), nO = /* @__PURE__ */ s((e, t = {}) => {
  if (t.level && !(Number.isInteger(t.level) && t.level >= 0 && t.level <= 3))
    throw new Error("The `level` option should be an integer from 0 to 3");
  let r = Iv ? Iv.level : 0;
  e.level = t.level === void 0 ? r : t.level;
}, "applyOptions");
var sO = /* @__PURE__ */ s((e) => {
  let t = /* @__PURE__ */ s((...r) => r.join(" "), "chalk");
  return nO(t, e), Object.setPrototypeOf(t, Kn.prototype), t;
}, "chalkFactory");
function Kn(e) {
  return sO(e);
}
s(Kn, "createChalk");
Object.setPrototypeOf(Kn.prototype, Function.prototype);
for (let [e, t] of Object.entries(st))
  Ri[e] = {
    get() {
      let r = na(this, cd(t.open, t.close, this[Ai]), this[Gn]);
      return Object.defineProperty(this, e, { value: r }), r;
    }
  };
Ri.visible = {
  get() {
    let e = na(this, this[Ai], !0);
    return Object.defineProperty(this, "visible", { value: e }), e;
  }
};
var ld = /* @__PURE__ */ s((e, t, r, ...i) => e === "rgb" ? t === "ansi16m" ? st[r].ansi16m(...i) : t === "ansi256" ? st[r].ansi256(st.rgbToAnsi256(
...i)) : st[r].ansi(st.rgbToAnsi(...i)) : e === "hex" ? ld("rgb", t, r, ...st.hexToRgb(...i)) : st[r][e](...i), "getModelAnsi"), oO = ["rgb",
"hex", "ansi256"];
for (let e of oO) {
  Ri[e] = {
    get() {
      let { level: r } = this;
      return function(...i) {
        let n = cd(ld(e, jv[r], "color", ...i), st.color.close, this[Ai]);
        return na(this, n, this[Gn]);
      };
    }
  };
  let t = "bg" + e[0].toUpperCase() + e.slice(1);
  Ri[t] = {
    get() {
      let { level: r } = this;
      return function(...i) {
        let n = cd(ld(e, jv[r], "bgColor", ...i), st.bgColor.close, this[Ai]);
        return na(this, n, this[Gn]);
      };
    }
  };
}
var aO = Object.defineProperties(() => {
}, {
  ...Ri,
  level: {
    enumerable: !0,
    get() {
      return this[ud].level;
    },
    set(e) {
      this[ud].level = e;
    }
  }
}), cd = /* @__PURE__ */ s((e, t, r) => {
  let i, n;
  return r === void 0 ? (i = e, n = t) : (i = r.openAll + e, n = t + r.closeAll), {
    open: e,
    close: t,
    openAll: i,
    closeAll: n,
    parent: r
  };
}, "createStyler"), na = /* @__PURE__ */ s((e, t, r) => {
  let i = /* @__PURE__ */ s((...n) => uO(i, n.length === 1 ? "" + n[0] : n.join(" ")), "builder");
  return Object.setPrototypeOf(i, aO), i[ud] = e, i[Ai] = t, i[Gn] = r, i;
}, "createBuilder"), uO = /* @__PURE__ */ s((e, t) => {
  if (e.level <= 0 || !t)
    return e[Gn] ? "" : t;
  let r = e[Ai];
  if (r === void 0)
    return t;
  let { openAll: i, closeAll: n } = r;
  if (t.includes("\x1B"))
    for (; r !== void 0; )
      t = Bv(t, r.close, r.open), r = r.parent;
  let o = t.indexOf(`
`);
  return o !== -1 && (t = Pv(t, n, i, o)), i + t + n;
}, "applyStyle");
Object.defineProperties(Kn.prototype, Ri);
var lO = Kn(), fL = Kn({ level: Mv ? Mv.level : 0 });
var Ar = lO;

// ../node_modules/boxen/node_modules/widest-line/index.js
function sa(e) {
  let t = 0;
  for (let r of e.split(`
`))
    t = Math.max(t, Ye(r));
  return t;
}
s(sa, "widestLine");

// ../node_modules/boxen/index.js
var D_ = re(fd(), 1);

// ../node_modules/boxen/node_modules/camelcase/index.js
var dO = /[\p{Lu}]/u, fO = /[\p{Ll}]/u, Nv = /^[\p{Lu}](?![\p{Lu}])/gu, Wv = /([\p{Alpha}\p{N}_]|$)/u, hd = /[_.\- ]+/, hO = new RegExp("^" +
hd.source), Uv = new RegExp(hd.source + Wv.source, "gu"), $v = new RegExp("\\d+" + Wv.source, "gu"), pO = /* @__PURE__ */ s((e, t, r, i) => {
  let n = !1, o = !1, a = !1, u = !1;
  for (let l = 0; l < e.length; l++) {
    let c = e[l];
    u = l > 2 ? e[l - 3] === "-" : !0, n && dO.test(c) ? (e = e.slice(0, l) + "-" + e.slice(l), n = !1, a = o, o = !0, l++) : o && a && fO.test(
    c) && (!u || i) ? (e = e.slice(0, l - 1) + "-" + e.slice(l - 1), a = o, o = !1, n = !0) : (n = t(c) === c && r(c) !== c, a = o, o = r(c) ===
    c && t(c) !== c);
  }
  return e;
}, "preserveCamelCase"), DO = /* @__PURE__ */ s((e, t) => (Nv.lastIndex = 0, e.replace(Nv, (r) => t(r))), "preserveConsecutiveUppercase"), mO = /* @__PURE__ */ s(
(e, t) => (Uv.lastIndex = 0, $v.lastIndex = 0, e.replace(Uv, (r, i) => t(i)).replace($v, (r) => t(r))), "postProcess");
function pd(e, t) {
  if (!(typeof e == "string" || Array.isArray(e)))
    throw new TypeError("Expected the input to be `string | string[]`");
  if (t = {
    pascalCase: !1,
    preserveConsecutiveUppercase: !1,
    ...t
  }, Array.isArray(e) ? e = e.map((o) => o.trim()).filter((o) => o.length).join("-") : e = e.trim(), e.length === 0)
    return "";
  let r = t.locale === !1 ? (o) => o.toLowerCase() : (o) => o.toLocaleLowerCase(t.locale), i = t.locale === !1 ? (o) => o.toUpperCase() : (o) => o.
  toLocaleUpperCase(t.locale);
  return e.length === 1 ? hd.test(e) ? "" : t.pascalCase ? i(e) : r(e) : (e !== r(e) && (e = pO(e, r, i, t.preserveConsecutiveUppercase)), e =
  e.replace(hO, ""), e = t.preserveConsecutiveUppercase ? DO(e, r) : r(e), t.pascalCase && (e = i(e.charAt(0)) + e.slice(1)), mO(e, i));
}
s(pd, "camelCase");

// ../node_modules/boxen/index.js
var vd = re(t_(), 1);

// ../node_modules/wrap-ansi/node_modules/string-width/index.js
var r_ = re(sd(), 1), i_ = re(od(), 1);
function kr(e, t = {}) {
  if (typeof e != "string" || e.length === 0 || (t = {
    ambiguousIsNarrow: !0,
    ...t
  }, e = Tr(e), e.length === 0))
    return 0;
  e = e.replace((0, i_.default)(), "  ");
  let r = t.ambiguousIsNarrow ? 1 : 2, i = 0;
  for (let n of e) {
    let o = n.codePointAt(0);
    if (o <= 31 || o >= 127 && o <= 159 || o >= 768 && o <= 879)
      continue;
    switch (r_.default.eastAsianWidth(n)) {
      case "F":
      case "W":
        i += 2;
        break;
      case "A":
        i += r;
        break;
      default:
        i += 1;
    }
  }
  return i;
}
s(kr, "stringWidth");

// ../node_modules/wrap-ansi/node_modules/ansi-styles/index.js
var n_ = /* @__PURE__ */ s((e = 0) => (t) => `\x1B[${t + e}m`, "wrapAnsi16"), s_ = /* @__PURE__ */ s((e = 0) => (t) => `\x1B[${38 + e};5;${t}\
m`, "wrapAnsi256"), o_ = /* @__PURE__ */ s((e = 0) => (t, r, i) => `\x1B[${38 + e};2;${t};${r};${i}m`, "wrapAnsi16m"), me = {
  modifier: {
    reset: [0, 0],
    // 21 isn't widely supported and 22 does the same thing
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    // Bright color
    blackBright: [90, 39],
    gray: [90, 39],
    // Alias of `blackBright`
    grey: [90, 39],
    // Alias of `blackBright`
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    // Bright color
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    // Alias of `bgBlackBright`
    bgGrey: [100, 49],
    // Alias of `bgBlackBright`
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
}, PL = Object.keys(me.modifier), CO = Object.keys(me.color), xO = Object.keys(me.bgColor), IL = [...CO, ...xO];
function FO() {
  let e = /* @__PURE__ */ new Map();
  for (let [t, r] of Object.entries(me)) {
    for (let [i, n] of Object.entries(r))
      me[i] = {
        open: `\x1B[${n[0]}m`,
        close: `\x1B[${n[1]}m`
      }, r[i] = me[i], e.set(n[0], n[1]);
    Object.defineProperty(me, t, {
      value: r,
      enumerable: !1
    });
  }
  return Object.defineProperty(me, "codes", {
    value: e,
    enumerable: !1
  }), me.color.close = "\x1B[39m", me.bgColor.close = "\x1B[49m", me.color.ansi = n_(), me.color.ansi256 = s_(), me.color.ansi16m = o_(), me.
  bgColor.ansi = n_(10), me.bgColor.ansi256 = s_(10), me.bgColor.ansi16m = o_(10), Object.defineProperties(me, {
    rgbToAnsi256: {
      value: /* @__PURE__ */ s((t, r, i) => t === r && r === i ? t < 8 ? 16 : t > 248 ? 231 : Math.round((t - 8) / 247 * 24) + 232 : 16 + 36 *
      Math.round(t / 255 * 5) + 6 * Math.round(r / 255 * 5) + Math.round(i / 255 * 5), "value"),
      enumerable: !1
    },
    hexToRgb: {
      value: /* @__PURE__ */ s((t) => {
        let r = /[a-f\d]{6}|[a-f\d]{3}/i.exec(t.toString(16));
        if (!r)
          return [0, 0, 0];
        let [i] = r;
        i.length === 3 && (i = [...i].map((o) => o + o).join(""));
        let n = Number.parseInt(i, 16);
        return [
          /* eslint-disable no-bitwise */
          n >> 16 & 255,
          n >> 8 & 255,
          n & 255
          /* eslint-enable no-bitwise */
        ];
      }, "value"),
      enumerable: !1
    },
    hexToAnsi256: {
      value: /* @__PURE__ */ s((t) => me.rgbToAnsi256(...me.hexToRgb(t)), "value"),
      enumerable: !1
    },
    ansi256ToAnsi: {
      value: /* @__PURE__ */ s((t) => {
        if (t < 8)
          return 30 + t;
        if (t < 16)
          return 90 + (t - 8);
        let r, i, n;
        if (t >= 232)
          r = ((t - 232) * 10 + 8) / 255, i = r, n = r;
        else {
          t -= 16;
          let u = t % 36;
          r = Math.floor(t / 36) / 5, i = Math.floor(u / 6) / 5, n = u % 6 / 5;
        }
        let o = Math.max(r, i, n) * 2;
        if (o === 0)
          return 30;
        let a = 30 + (Math.round(n) << 2 | Math.round(i) << 1 | Math.round(r));
        return o === 2 && (a += 60), a;
      }, "value"),
      enumerable: !1
    },
    rgbToAnsi: {
      value: /* @__PURE__ */ s((t, r, i) => me.ansi256ToAnsi(me.rgbToAnsi256(t, r, i)), "value"),
      enumerable: !1
    },
    hexToAnsi: {
      value: /* @__PURE__ */ s((t) => me.ansi256ToAnsi(me.hexToAnsi256(t)), "value"),
      enumerable: !1
    }
  }), me;
}
s(FO, "assembleStyles");
var SO = FO(), a_ = SO;

// ../node_modules/wrap-ansi/index.js
var oa = /* @__PURE__ */ new Set([
  "\x1B",
  "\x9B"
]), TO = 39, yd = "\x07", c_ = "[", AO = "]", d_ = "m", bd = `${AO}8;;`, u_ = /* @__PURE__ */ s((e) => `${oa.values().next().value}${c_}${e}${d_}`,
"wrapAnsiCode"), l_ = /* @__PURE__ */ s((e) => `${oa.values().next().value}${bd}${e}${yd}`, "wrapAnsiHyperlink"), RO = /* @__PURE__ */ s((e) => e.
split(" ").map((t) => kr(t)), "wordLengths"), gd = /* @__PURE__ */ s((e, t, r) => {
  let i = [...t], n = !1, o = !1, a = kr(Tr(e[e.length - 1]));
  for (let [u, l] of i.entries()) {
    let c = kr(l);
    if (a + c <= r ? e[e.length - 1] += l : (e.push(l), a = 0), oa.has(l) && (n = !0, o = i.slice(u + 1).join("").startsWith(bd)), n) {
      o ? l === yd && (n = !1, o = !1) : l === d_ && (n = !1);
      continue;
    }
    a += c, a === r && u < i.length - 1 && (e.push(""), a = 0);
  }
  !a && e[e.length - 1].length > 0 && e.length > 1 && (e[e.length - 2] += e.pop());
}, "wrapWord"), kO = /* @__PURE__ */ s((e) => {
  let t = e.split(" "), r = t.length;
  for (; r > 0 && !(kr(t[r - 1]) > 0); )
    r--;
  return r === t.length ? e : t.slice(0, r).join(" ") + t.slice(r).join("");
}, "stringVisibleTrimSpacesRight"), OO = /* @__PURE__ */ s((e, t, r = {}) => {
  if (r.trim !== !1 && e.trim() === "")
    return "";
  let i = "", n, o, a = RO(e), u = [""];
  for (let [c, d] of e.split(" ").entries()) {
    r.trim !== !1 && (u[u.length - 1] = u[u.length - 1].trimStart());
    let p = kr(u[u.length - 1]);
    if (c !== 0 && (p >= t && (r.wordWrap === !1 || r.trim === !1) && (u.push(""), p = 0), (p > 0 || r.trim === !1) && (u[u.length - 1] += "\
 ", p++)), r.hard && a[c] > t) {
      let h = t - p, f = 1 + Math.floor((a[c] - h - 1) / t);
      Math.floor((a[c] - 1) / t) < f && u.push(""), gd(u, d, t);
      continue;
    }
    if (p + a[c] > t && p > 0 && a[c] > 0) {
      if (r.wordWrap === !1 && p < t) {
        gd(u, d, t);
        continue;
      }
      u.push("");
    }
    if (p + a[c] > t && r.wordWrap === !1) {
      gd(u, d, t);
      continue;
    }
    u[u.length - 1] += d;
  }
  r.trim !== !1 && (u = u.map((c) => kO(c)));
  let l = [...u.join(`
`)];
  for (let [c, d] of l.entries()) {
    if (i += d, oa.has(d)) {
      let { groups: h } = new RegExp(`(?:\\${c_}(?<code>\\d+)m|\\${bd}(?<uri>.*)${yd})`).exec(l.slice(c).join("")) || { groups: {} };
      if (h.code !== void 0) {
        let f = Number.parseFloat(h.code);
        n = f === TO ? void 0 : f;
      } else h.uri !== void 0 && (o = h.uri.length === 0 ? void 0 : h.uri);
    }
    let p = a_.codes.get(Number(n));
    l[c + 1] === `
` ? (o && (i += l_("")), n && p && (i += u_(p))) : d === `
` && (n && p && (i += u_(n)), o && (i += l_(o)));
  }
  return i;
}, "exec");
function aa(e, t, r) {
  return String(e).normalize().replace(/\r\n/g, `
`).split(`
`).map((i) => OO(i, t, r)).join(`
`);
}
s(aa, "wrapAnsi");

// ../node_modules/boxen/index.js
var UO = re(fd(), 1);
var sr = `
`, Le = " ", Jn = "none", m_ = /* @__PURE__ */ s(() => {
  let { env: e, stdout: t, stderr: r } = Yn.default;
  return t?.columns ? t.columns : r?.columns ? r.columns : e.COLUMNS ? Number.parseInt(e.COLUMNS, 10) : 80;
}, "terminalColumns"), f_ = /* @__PURE__ */ s((e) => typeof e == "number" ? {
  top: e,
  right: e * 3,
  bottom: e,
  left: e * 3
} : {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  ...e
}, "getObject"), Xn = /* @__PURE__ */ s((e) => e === Jn ? 0 : 2, "getBorderWidth"), BO = /* @__PURE__ */ s((e) => {
  let t = [
    "topLeft",
    "topRight",
    "bottomRight",
    "bottomLeft",
    "left",
    "right",
    "top",
    "bottom"
  ], r;
  if (e === Jn) {
    e = {};
    for (let i of t)
      e[i] = "";
  }
  if (typeof e == "string") {
    if (r = D_.default[e], !r)
      throw new TypeError(`Invalid border style: ${e}`);
  } else {
    typeof e?.vertical == "string" && (e.left = e.vertical, e.right = e.vertical), typeof e?.horizontal == "string" && (e.top = e.horizontal,
    e.bottom = e.horizontal);
    for (let i of t)
      if (e[i] === null || typeof e[i] != "string")
        throw new TypeError(`Invalid border style: ${i}`);
    r = e;
  }
  return r;
}, "getBorderChars"), PO = /* @__PURE__ */ s((e, t, r) => {
  let i = "", n = Ye(e);
  switch (r) {
    case "left": {
      i = e + t.slice(n);
      break;
    }
    case "right": {
      i = t.slice(n) + e;
      break;
    }
    default: {
      t = t.slice(n), t.length % 2 === 1 ? (t = t.slice(Math.floor(t.length / 2)), i = t.slice(1) + e + t) : (t = t.slice(t.length / 2), i =
      t + e + t);
      break;
    }
  }
  return i;
}, "makeTitle"), IO = /* @__PURE__ */ s((e, { padding: t, width: r, textAlignment: i, height: n }) => {
  e = (0, vd.default)(e, { align: i });
  let o = e.split(sr), a = sa(e), u = r - t.left - t.right;
  if (a > u) {
    let d = [];
    for (let p of o) {
      let h = aa(p, u, { hard: !0 }), g = (0, vd.default)(h, { align: i }).split(`
`), E = Math.max(...g.map((_) => Ye(_)));
      for (let _ of g) {
        let C;
        switch (i) {
          case "center": {
            C = Le.repeat((u - E) / 2) + _;
            break;
          }
          case "right": {
            C = Le.repeat(u - E) + _;
            break;
          }
          default: {
            C = _;
            break;
          }
        }
        d.push(C);
      }
    }
    o = d;
  }
  i === "center" && a < u ? o = o.map((d) => Le.repeat((u - a) / 2) + d) : i === "right" && a < u && (o = o.map((d) => Le.repeat(u - a) + d));
  let l = Le.repeat(t.left), c = Le.repeat(t.right);
  return o = o.map((d) => l + d + c), o = o.map((d) => {
    if (r - Ye(d) > 0)
      switch (i) {
        case "center":
          return d + Le.repeat(r - Ye(d));
        case "right":
          return d + Le.repeat(r - Ye(d));
        default:
          return d + Le.repeat(r - Ye(d));
      }
    return d;
  }), t.top > 0 && (o = [...Array.from({ length: t.top }).fill(Le.repeat(r)), ...o]), t.bottom > 0 && (o = [...o, ...Array.from({ length: t.
  bottom }).fill(Le.repeat(r))]), n && o.length > n ? o = o.slice(0, n) : n && o.length < n && (o = [...o, ...Array.from({ length: n - o.length }).
  fill(Le.repeat(r))]), o.join(sr);
}, "makeContentText"), MO = /* @__PURE__ */ s((e, t, r) => {
  let i = /* @__PURE__ */ s((d) => {
    let p = r.borderColor ? LO(r.borderColor)(d) : d;
    return r.dimBorder ? Ar.dim(p) : p;
  }, "colorizeBorder"), n = /* @__PURE__ */ s((d) => r.backgroundColor ? NO(r.backgroundColor)(d) : d, "colorizeContent"), o = BO(r.borderStyle),
  a = m_(), u = Le.repeat(r.margin.left);
  if (r.float === "center") {
    let d = Math.max((a - t - Xn(r.borderStyle)) / 2, 0);
    u = Le.repeat(d);
  } else if (r.float === "right") {
    let d = Math.max(a - t - r.margin.right - Xn(r.borderStyle), 0);
    u = Le.repeat(d);
  }
  let l = "";
  r.margin.top && (l += sr.repeat(r.margin.top)), (r.borderStyle !== Jn || r.title) && (l += i(u + o.topLeft + (r.title ? PO(r.title, o.top.
  repeat(t), r.titleAlignment) : o.top.repeat(t)) + o.topRight) + sr);
  let c = e.split(sr);
  return l += c.map((d) => u + i(o.left) + n(d) + i(o.right)).join(sr), r.borderStyle !== Jn && (l += sr + i(u + o.bottomLeft + o.bottom.repeat(
  t) + o.bottomRight)), r.margin.bottom && (l += sr.repeat(r.margin.bottom)), l;
}, "boxContent"), jO = /* @__PURE__ */ s((e) => {
  if (e.fullscreen && Yn.default?.stdout) {
    let t = [Yn.default.stdout.columns, Yn.default.stdout.rows];
    typeof e.fullscreen == "function" && (t = e.fullscreen(...t)), e.width || (e.width = t[0]), e.height || (e.height = t[1]);
  }
  return e.width && (e.width = Math.max(1, e.width - Xn(e.borderStyle))), e.height && (e.height = Math.max(1, e.height - Xn(e.borderStyle))),
  e;
}, "sanitizeOptions"), h_ = /* @__PURE__ */ s((e, t) => t === Jn ? e : ` ${e} `, "formatTitle"), qO = /* @__PURE__ */ s((e, t) => {
  t = jO(t);
  let r = t.width !== void 0, i = m_(), n = Xn(t.borderStyle), o = i - t.margin.left - t.margin.right - n, a = sa(aa(e, i - n, { hard: !0, trim: !1 })) +
  t.padding.left + t.padding.right;
  if (t.title && r ? (t.title = t.title.slice(0, Math.max(0, t.width - 2)), t.title && (t.title = h_(t.title, t.borderStyle))) : t.title && (t.
  title = t.title.slice(0, Math.max(0, o - 2)), t.title && (t.title = h_(t.title, t.borderStyle), Ye(t.title) > a && (t.width = Ye(t.title)))),
  t.width = t.width ? t.width : a, !r) {
    if (t.margin.left && t.margin.right && t.width > o) {
      let l = (i - t.width - n) / (t.margin.left + t.margin.right);
      t.margin.left = Math.max(0, Math.floor(t.margin.left * l)), t.margin.right = Math.max(0, Math.floor(t.margin.right * l));
    }
    t.width = Math.min(t.width, i - n - t.margin.left - t.margin.right);
  }
  return t.width - (t.padding.left + t.padding.right) <= 0 && (t.padding.left = 0, t.padding.right = 0), t.height && t.height - (t.padding.top +
  t.padding.bottom) <= 0 && (t.padding.top = 0, t.padding.bottom = 0), t;
}, "determineDimensions"), _d = /* @__PURE__ */ s((e) => e.match(/^#(?:[0-f]{3}){1,2}$/i), "isHex"), p_ = /* @__PURE__ */ s((e) => typeof e ==
"string" && (Ar[e] ?? _d(e)), "isColorValid"), LO = /* @__PURE__ */ s((e) => _d(e) ? Ar.hex(e) : Ar[e], "getColorFn"), NO = /* @__PURE__ */ s(
(e) => _d(e) ? Ar.bgHex(e) : Ar[pd(["bg", e])], "getBGColorFn");
function wd(e, t) {
  if (t = {
    padding: 0,
    borderStyle: "single",
    dimBorder: !1,
    textAlignment: "left",
    float: "left",
    titleAlignment: "left",
    ...t
  }, t.align && (t.textAlignment = t.align), t.borderColor && !p_(t.borderColor))
    throw new Error(`${t.borderColor} is not a valid borderColor`);
  if (t.backgroundColor && !p_(t.backgroundColor))
    throw new Error(`${t.backgroundColor} is not a valid backgroundColor`);
  return t.padding = f_(t.padding), t.margin = f_(t.margin), t = qO(e, t), e = IO(e, t), MO(e, t.width, t);
}
s(wd, "boxen");

// src/cli/angular/helpers.ts
var Cd = re(Ts(), 1), xd = re(ua(), 1);
var es = "angular.json", $O = xd.dedent`
  import { setCompodocJson } from "@storybook/addon-docs/angular";
  import docJson from "../documentation.json";
  setCompodocJson(docJson);
`.trimStart(), WO = /* @__PURE__ */ s(async () => {
  b_.logger.plain(
    // Create a text which explains the user why compodoc is necessary
    wd(
      xd.dedent`
      Compodoc is a great tool to generate documentation for your Angular projects.
      Storybook can use the documentation generated by Compodoc to extract argument definitions
      and JSDOC comments to display them in the Storybook UI. We highly recommend using Compodoc for
      your Angular projects to get the best experience out of Storybook.
    `,
      { title: "Compodoc", borderStyle: "round", padding: 1, borderColor: "#F1618C" }
    )
  );
  let { useCompoDoc: e } = await (0, Cd.default)({
    type: "confirm",
    name: "useCompoDoc",
    message: "Do you want to use Compodoc for documentation?"
  });
  return e;
}, "promptForCompoDocs"), Ed = class {
  static {
    s(this, "AngularJSON");
  }
  constructor() {
    if (!(0, ki.existsSync)(es))
      throw new v_.MissingAngularJsonError({ path: (0, y_.join)(process.cwd(), es) });
    let t = (0, ki.readFileSync)(es, "utf8");
    this.json = JSON.parse(t);
  }
  get projects() {
    return this.json.projects;
  }
  get projectsWithoutStorybook() {
    return Object.keys(this.projects).filter((t) => {
      let { architect: r } = this.projects[t];
      return !r.storybook;
    });
  }
  get hasStorybookBuilder() {
    return Object.keys(this.projects).some((t) => {
      let { architect: r } = this.projects[t];
      return Object.keys(r).some((i) => r[i].builder === "@storybook/angular:start-storybook");
    });
  }
  get rootProject() {
    let t = Object.keys(this.projects).find((r) => {
      let { root: i } = this.projects[r];
      return i === "" || i === ".";
    });
    return t ? this.projects[t] : null;
  }
  getProjectSettingsByName(t) {
    return this.projects[t];
  }
  async getProjectName() {
    if (this.projectsWithoutStorybook.length > 1) {
      let { projectName: t } = await (0, Cd.default)({
        type: "select",
        name: "projectName",
        message: "For which project do you want to generate Storybook configuration?",
        choices: this.projectsWithoutStorybook.map((r) => ({
          title: r,
          value: r
        }))
      });
      return t;
    }
    return this.projectsWithoutStorybook[0];
  }
  addStorybookEntries({
    angularProjectName: t,
    storybookFolder: r,
    useCompodoc: i,
    root: n
  }) {
    let { architect: o } = this.projects[t], a = {
      configDir: r,
      browserTarget: `${t}:build`,
      compodoc: i,
      ...i && { compodocArgs: ["-e", "json", "-d", n || "."] }
    };
    o.storybook || (o.storybook = {
      builder: "@storybook/angular:start-storybook",
      options: {
        ...a,
        port: 6006
      }
    }), o["build-storybook"] || (o["build-storybook"] = {
      builder: "@storybook/angular:build-storybook",
      options: {
        ...a,
        outputDir: Object.keys(this.projects).length === 1 ? "storybook-static" : `dist/storybook/${t}`
      }
    });
  }
  write() {
    (0, ki.writeFileSync)(es, JSON.stringify(this.json, null, 2));
  }
};

// src/cli/eslintPlugin.ts
var Sd = require("node:fs"), rs = require("node:fs/promises"), Td = require("@storybook/core/common"), ca = require("@storybook/core/csf-tools");

// ../node_modules/detect-indent/index.js
var HO = /^(?:( )+|\t+)/, ts = "space", w_ = "tab";
function __(e, t) {
  let r = /* @__PURE__ */ new Map(), i = 0, n, o;
  for (let a of e.split(/\n/g)) {
    if (!a)
      continue;
    let u, l, c, d, p, h = a.match(HO);
    if (h === null)
      i = 0, n = "";
    else {
      if (u = h[0].length, l = h[1] ? ts : w_, t && l === ts && u === 1)
        continue;
      l !== n && (i = 0), n = l, c = 1, d = 0;
      let f = u - i;
      if (i = u, f === 0)
        c = 0, d = 1;
      else {
        let g = f > 0 ? f : -f;
        o = VO(l, g);
      }
      p = r.get(o), p = p === void 0 ? [1, 0] : [p[0] + c, p[1] + d], r.set(o, p);
    }
  }
  return r;
}
s(__, "makeIndentsMap");
function VO(e, t) {
  return (e === ts ? "s" : "t") + String(t);
}
s(VO, "encodeIndentsKey");
function ZO(e) {
  let r = e[0] === "s" ? ts : w_, i = Number(e.slice(1));
  return { type: r, amount: i };
}
s(ZO, "decodeIndentsKey");
function zO(e) {
  let t, r = 0, i = 0;
  for (let [n, [o, a]] of e)
    (o > r || o === r && a > i) && (r = o, i = a, t = n);
  return t;
}
s(zO, "getMostUsedKey");
function GO(e, t) {
  return (e === ts ? " " : "	").repeat(t);
}
s(GO, "makeIndentString");
function Fd(e) {
  if (typeof e != "string")
    throw new TypeError("Expected a string");
  let t = __(e, !0);
  t.size === 0 && (t = __(e, !1));
  let r = zO(t), i, n = 0, o = "";
  return r !== void 0 && ({ type: i, amount: n } = ZO(r), o = GO(i, n)), {
    amount: n,
    type: i,
    indent: o
  };
}
s(Fd, "detectIndent");

// src/cli/eslintPlugin.ts
var E_ = re(ju(), 1), C_ = re(Ts(), 1), x_ = re(ua(), 1);
var F_ = ["js", "cjs", "json"], KO = ["yaml", "yml"], S_ = /* @__PURE__ */ s(() => {
  let e = ".eslintrc", t = KO.find(
    (i) => (0, Sd.existsSync)(`${e}.${i}`)
  );
  if (t)
    throw new Error(t);
  let r = F_.find(
    (i) => (0, Sd.existsSync)(`${e}.${i}`)
  );
  return r ? `${e}.${r}` : null;
}, "findEslintFile");
async function YO(e) {
  let t = await e.getAllDependencies(), r = await e.retrievePackageJson(), i = null;
  try {
    i = S_();
  } catch {
  }
  let n = !!t["eslint-plugin-storybook"];
  return { hasEslint: t.eslint || i || r.eslintConfig, isStorybookPluginInstalled: n, eslintConfigFile: i };
}
s(YO, "extractEslintInfo");
var la = /* @__PURE__ */ s((e) => {
  if (!e)
    return [];
  if (typeof e == "string")
    return [e];
  if (Array.isArray(e))
    return e;
  throw new Error(`Invalid eslint extends ${e}`);
}, "normalizeExtends");
async function JO(e, t) {
  if (e)
    if ((0, Td.paddedLog)(`Configuring Storybook ESLint plugin at ${e}`), e.endsWith("json")) {
      let r = JSON.parse(await (0, rs.readFile)(e, { encoding: "utf8" })), i = la(r.extends).filter(Boolean);
      r.extends = [...i, "plugin:storybook/recommended"];
      let n = await (0, rs.readFile)(e, { encoding: "utf8" }), o = Fd(n).amount || 2;
      await (0, rs.writeFile)(e, JSON.stringify(r, void 0, o));
    } else {
      let r = await (0, ca.readConfig)(e), i = la(r.getFieldValue(["extends"])).filter(Boolean);
      r.setFieldValue(["extends"], [...i, "plugin:storybook/recommended"]), await (0, ca.writeConfig)(r);
    }
  else {
    (0, Td.paddedLog)("Configuring eslint-plugin-storybook in your package.json");
    let r = await t.retrievePackageJson(), i = la(r.eslintConfig?.extends).filter(Boolean);
    await t.writePackageJson({
      ...r,
      eslintConfig: {
        ...r.eslintConfig,
        extends: [...i, "plugin:storybook/recommended"]
      }
    });
  }
}
s(JO, "configureEslintPlugin");
var XO = /* @__PURE__ */ s(async () => {
  let { shouldInstall: e } = await (0, C_.default)({
    type: "confirm",
    name: "shouldInstall",
    message: x_.dedent`
        We have detected that you're using ESLint. Storybook provides a plugin that gives the best experience with Storybook and helps follow best practices: ${E_.default.
    yellow(
      "https://github.com/storybookjs/eslint-plugin-storybook#readme"
    )}

        Would you like to install it?
      `,
    initial: !0
  });
  return e;
}, "suggestESLintPlugin");

// src/cli/globalSettings.ts
var _a = re(require("node:fs/promises"), 1), ew = require("node:os"), wa = require("node:path"), Li = re(J_(), 1);

// src/server-errors.ts
var Q_ = re(ua(), 1);

// src/storybook-error.ts
function X_({
  code: e,
  category: t
}) {
  let r = String(e).padStart(4, "0");
  return `SB_${t}_${r}`;
}
s(X_, "parseErrorCode");
var ba = class e extends Error {
  constructor(r) {
    super(e.getFullMessage(r));
    /**
     * Data associated with the error. Used to provide additional information in the error message or
     * to be passed to telemetry.
     */
    this.data = {};
    /** Flag used to easily determine if the error originates from Storybook. */
    this.fromStorybook = !0;
    this.category = r.category, this.documentation = r.documentation ?? !1, this.code = r.code;
  }
  static {
    s(this, "StorybookError");
  }
  get fullErrorCode() {
    return X_({ code: this.code, category: this.category });
  }
  /** Overrides the default `Error.name` property in the format: SB_<CATEGORY>_<CODE>. */
  get name() {
    let r = this.constructor.name;
    return `${this.fullErrorCode} (${r})`;
  }
  /** Generates the error message along with additional documentation link (if applicable). */
  static getFullMessage({
    documentation: r,
    code: i,
    category: n,
    message: o
  }) {
    let a;
    return r === !0 ? a = `https://storybook.js.org/error/${X_({ code: i, category: n })}` : typeof r == "string" ? a = r : Array.isArray(r) &&
    (a = `
${r.map((u) => `	- ${u}`).join(`
`)}`), `${o}${a != null ? `

More info: ${a}
` : ""}`;
  }
};

// src/server-errors.ts
var va = class extends ba {
  constructor(r) {
    super({
      category: "CORE-SERVER",
      code: 1,
      message: Q_.dedent`
        Unable to save global settings file to ${r.filePath}
        ${r.error && `Reason: ${r.error}`}`
    });
    this.data = r;
  }
  static {
    s(this, "SavingGlobalSettingsFileError");
  }
};

// src/cli/globalSettings.ts
var v8 = (0, wa.join)((0, ew.homedir)(), ".storybook", "settings.json"), _8 = 1, w8 = Li.z.object({
  version: Li.z.number(),
  // NOTE: every key (and subkey) below must be optional, for forwards compatibility reasons
  // (we can remove keys once they are deprecated)
  userSince: Li.z.number().optional(),
  init: Li.z.object({ skipOnboarding: Li.z.boolean().optional() }).optional()
}), Gr;
async function E8(e = v8) {
  if (Gr)
    return Gr;
  try {
    let t = await _a.default.readFile(e, "utf8"), r = w8.parse(JSON.parse(t));
    Gr = new ls(e, r);
  } catch {
    Gr = new ls(e, { version: _8, userSince: Date.now() }), await Gr.save();
  }
  return Gr;
}
s(E8, "globalSettings");
function C8() {
  Gr = void 0;
}
s(C8, "_clearGlobalSettings");
var ls = class {
  static {
    s(this, "Settings");
  }
  /**
   * Create a new Settings instance
   *
   * @param filePath Path to the JSON settings file
   * @param value Loaded value of settings
   */
  constructor(t, r) {
    this.filePath = t, this.value = r;
  }
  /** Save settings to the file */
  async save() {
    try {
      await _a.default.mkdir((0, wa.dirname)(this.filePath), { recursive: !0 }), await _a.default.writeFile(this.filePath, JSON.stringify(this.
      value, null, 2));
    } catch (t) {
      throw new va({
        filePath: this.filePath,
        error: t
      });
    }
  }
};
