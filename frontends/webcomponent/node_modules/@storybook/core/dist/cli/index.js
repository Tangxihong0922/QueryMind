import ESM_COMPAT_Module from "node:module";
import { fileURLToPath as ESM_COMPAT_fileURLToPath } from 'node:url';
import { dirname as ESM_COMPAT_dirname } from 'node:path';
const __filename = ESM_COMPAT_fileURLToPath(import.meta.url);
const __dirname = ESM_COMPAT_dirname(__filename);
const require = ESM_COMPAT_Module.createRequire(import.meta.url);
var A_ = Object.create;
var ua = Object.defineProperty;
var R_ = Object.getOwnPropertyDescriptor;
var k_ = Object.getOwnPropertyNames;
var O_ = Object.getPrototypeOf, B_ = Object.prototype.hasOwnProperty;
var s = (e, t) => ua(e, "name", { value: t, configurable: !0 }), x = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy <
"u" ? new Proxy(e, {
  get: (t, r) => (typeof require < "u" ? require : t)[r]
}) : e)(function(e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
});
var b = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var P_ = (e, t, r, i) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let n of k_(t))
      !B_.call(e, n) && n !== r && ua(e, n, { get: () => t[n], enumerable: !(i = R_(t, n)) || i.enumerable });
  return e;
};
var Ae = (e, t, r) => (r = e != null ? A_(O_(e)) : {}, P_(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  t || !e || !e.__esModule ? ua(r, "default", { value: e, enumerable: !0 }) : r,
  e
));

// ../node_modules/prompts/node_modules/kleur/index.js
var ge = b((G8, _d) => {
  "use strict";
  var { FORCE_COLOR: H_, NODE_DISABLE_COLORS: V_, TERM: Z_ } = process.env, ie = {
    enabled: !V_ && Z_ !== "dumb" && H_ !== "0",
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
  function vd(e, t) {
    let r = 0, i, n = "", o = "";
    for (; r < e.length; r++)
      i = e[r], n += i.open, o += i.close, t.includes(i.close) && (t = t.replace(i.rgx, i.close + i.open));
    return n + t + o;
  }
  s(vd, "run");
  function z_(e, t) {
    let r = { has: e, keys: t };
    return r.reset = ie.reset.bind(r), r.bold = ie.bold.bind(r), r.dim = ie.dim.bind(r), r.italic = ie.italic.bind(r), r.underline = ie.underline.
    bind(r), r.inverse = ie.inverse.bind(r), r.hidden = ie.hidden.bind(r), r.strikethrough = ie.strikethrough.bind(r), r.black = ie.black.bind(
    r), r.red = ie.red.bind(r), r.green = ie.green.bind(r), r.yellow = ie.yellow.bind(r), r.blue = ie.blue.bind(r), r.magenta = ie.magenta.bind(
    r), r.cyan = ie.cyan.bind(r), r.white = ie.white.bind(r), r.gray = ie.gray.bind(r), r.grey = ie.grey.bind(r), r.bgBlack = ie.bgBlack.bind(
    r), r.bgRed = ie.bgRed.bind(r), r.bgGreen = ie.bgGreen.bind(r), r.bgYellow = ie.bgYellow.bind(r), r.bgBlue = ie.bgBlue.bind(r), r.bgMagenta =
    ie.bgMagenta.bind(r), r.bgCyan = ie.bgCyan.bind(r), r.bgWhite = ie.bgWhite.bind(r), r;
  }
  s(z_, "chain");
  function se(e, t) {
    let r = {
      open: `\x1B[${e}m`,
      close: `\x1B[${t}m`,
      rgx: new RegExp(`\\x1b\\[${t}m`, "g")
    };
    return function(i) {
      return this !== void 0 && this.has !== void 0 ? (this.has.includes(e) || (this.has.push(e), this.keys.push(r)), i === void 0 ? this : ie.
      enabled ? vd(this.keys, i + "") : i + "") : i === void 0 ? z_([e], [r]) : ie.enabled ? vd([r], i + "") : i + "";
    };
  }
  s(se, "init");
  _d.exports = ie;
});

// ../node_modules/prompts/dist/util/action.js
var Ed = b((Y8, wd) => {
  "use strict";
  wd.exports = (e, t) => {
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
var ts = b((J8, Cd) => {
  "use strict";
  Cd.exports = (e) => {
    let t = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"].join("|"), r = new RegExp(t, "g");
    return typeof e == "string" ? e.replace(r, "") : e;
  };
});

// ../node_modules/sisteransi/src/index.js
var be = b((X8, xd) => {
  "use strict";
  var da = "\x1B", ye = `${da}[`, G_ = "\x07", fa = {
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
    save: `${da}7`,
    restore: `${da}8`
  }, K_ = {
    up: /* @__PURE__ */ s((e = 1) => `${ye}S`.repeat(e), "up"),
    down: /* @__PURE__ */ s((e = 1) => `${ye}T`.repeat(e), "down")
  }, Y_ = {
    screen: `${ye}2J`,
    up: /* @__PURE__ */ s((e = 1) => `${ye}1J`.repeat(e), "up"),
    down: /* @__PURE__ */ s((e = 1) => `${ye}J`.repeat(e), "down"),
    line: `${ye}2K`,
    lineEnd: `${ye}K`,
    lineStart: `${ye}1K`,
    lines(e) {
      let t = "";
      for (let r = 0; r < e; r++)
        t += this.line + (r < e - 1 ? fa.up() : "");
      return e && (t += fa.left), t;
    }
  };
  xd.exports = { cursor: fa, scroll: K_, erase: Y_, beep: G_ };
});

// ../node_modules/prompts/dist/util/clear.js
var Rd = b((eP, Ad) => {
  "use strict";
  function J_(e, t) {
    var r = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
    if (!r) {
      if (Array.isArray(e) || (r = X_(e)) || t && e && typeof e.length == "number") {
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
  s(J_, "_createForOfIteratorHelper");
  function X_(e, t) {
    if (e) {
      if (typeof e == "string") return Fd(e, t);
      var r = Object.prototype.toString.call(e).slice(8, -1);
      if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
      if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Fd(e, t);
    }
  }
  s(X_, "_unsupportedIterableToArray");
  function Fd(e, t) {
    (t == null || t > e.length) && (t = e.length);
    for (var r = 0, i = new Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  s(Fd, "_arrayLikeToArray");
  var Q_ = ts(), Td = be(), Sd = Td.erase, ew = Td.cursor, tw = /* @__PURE__ */ s((e) => [...Q_(e)].length, "width");
  Ad.exports = function(e, t) {
    if (!t) return Sd.line + ew.to(0);
    let r = 0, i = e.split(/\r?\n/);
    var n = J_(i), o;
    try {
      for (n.s(); !(o = n.n()).done; ) {
        let a = o.value;
        r += 1 + Math.floor(Math.max(tw(a) - 1, 0) / t);
      }
    } catch (a) {
      n.e(a);
    } finally {
      n.f();
    }
    return Sd.lines(r);
  };
});

// ../node_modules/prompts/dist/util/figures.js
var ha = b((rP, kd) => {
  "use strict";
  var Ni = {
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
  }, rw = {
    arrowUp: Ni.arrowUp,
    arrowDown: Ni.arrowDown,
    arrowLeft: Ni.arrowLeft,
    arrowRight: Ni.arrowRight,
    radioOn: "(*)",
    radioOff: "( )",
    tick: "\u221A",
    cross: "\xD7",
    ellipsis: "...",
    pointerSmall: "\xBB",
    line: "\u2500",
    pointer: ">"
  }, iw = process.platform === "win32" ? rw : Ni;
  kd.exports = iw;
});

// ../node_modules/prompts/dist/util/style.js
var Bd = b((iP, Od) => {
  "use strict";
  var Gr = ge(), lr = ha(), pa = Object.freeze({
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
  }), nw = /* @__PURE__ */ s((e) => pa[e] || pa.default, "render"), Ui = Object.freeze({
    aborted: Gr.red(lr.cross),
    done: Gr.green(lr.tick),
    exited: Gr.yellow(lr.cross),
    default: Gr.cyan("?")
  }), sw = /* @__PURE__ */ s((e, t, r) => t ? Ui.aborted : r ? Ui.exited : e ? Ui.done : Ui.default, "symbol"), ow = /* @__PURE__ */ s((e) => Gr.
  gray(e ? lr.ellipsis : lr.pointerSmall), "delimiter"), aw = /* @__PURE__ */ s((e, t) => Gr.gray(e ? t ? lr.pointerSmall : "+" : lr.line), "\
item");
  Od.exports = {
    styles: pa,
    render: nw,
    symbols: Ui,
    symbol: sw,
    delimiter: ow,
    item: aw
  };
});

// ../node_modules/prompts/dist/util/lines.js
var Id = b((sP, Pd) => {
  "use strict";
  var uw = ts();
  Pd.exports = function(e, t) {
    let r = String(uw(e) || "").split(/\r?\n/);
    return t ? r.map((i) => Math.ceil(i.length / t)).reduce((i, n) => i + n) : r.length;
  };
});

// ../node_modules/prompts/dist/util/wrap.js
var jd = b((oP, Md) => {
  "use strict";
  Md.exports = (e, t = {}) => {
    let r = Number.isSafeInteger(parseInt(t.margin)) ? new Array(parseInt(t.margin)).fill(" ").join("") : t.margin || "", i = t.width;
    return (e || "").split(/\r?\n/g).map((n) => n.split(/\s+/g).reduce((o, a) => (a.length + r.length >= i || o[o.length - 1].length + a.length +
    1 < i ? o[o.length - 1] += ` ${a}` : o.push(`${r}${a}`), o), [r]).join(`
`)).join(`
`);
  };
});

// ../node_modules/prompts/dist/util/entriesToDisplay.js
var Ld = b((aP, qd) => {
  "use strict";
  qd.exports = (e, t, r) => {
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
var tt = b((uP, Nd) => {
  "use strict";
  Nd.exports = {
    action: Ed(),
    clear: Rd(),
    style: Bd(),
    strip: ts(),
    figures: ha(),
    lines: Id(),
    wrap: jd(),
    entriesToDisplay: Ld()
  };
});

// ../node_modules/prompts/dist/elements/prompt.js
var _t = b((lP, Wd) => {
  "use strict";
  var Ud = x("readline"), lw = tt(), cw = lw.action, dw = x("events"), $d = be(), fw = $d.beep, hw = $d.cursor, pw = ge(), Da = class extends dw {
    static {
      s(this, "Prompt");
    }
    constructor(t = {}) {
      super(), this.firstRender = !0, this.in = t.stdin || process.stdin, this.out = t.stdout || process.stdout, this.onRender = (t.onRender ||
      (() => {
      })).bind(this);
      let r = Ud.createInterface({
        input: this.in,
        escapeCodeTimeout: 50
      });
      Ud.emitKeypressEvents(this.in, r), this.in.isTTY && this.in.setRawMode(!0);
      let i = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1, n = /* @__PURE__ */ s((o, a) => {
        let u = cw(a, i);
        u === !1 ? this._ && this._(o, a) : typeof this[u] == "function" ? this[u](a) : this.bell();
      }, "keypress");
      this.close = () => {
        this.out.write(hw.show), this.in.removeListener("keypress", n), this.in.isTTY && this.in.setRawMode(!1), r.close(), this.emit(this.aborted ?
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
      this.out.write(fw);
    }
    render() {
      this.onRender(pw), this.firstRender && (this.firstRender = !1);
    }
  };
  Wd.exports = Da;
});

// ../node_modules/prompts/dist/elements/text.js
var Gd = b((dP, zd) => {
  "use strict";
  function Hd(e, t, r, i, n, o, a) {
    try {
      var u = e[o](a), l = u.value;
    } catch (c) {
      r(c);
      return;
    }
    u.done ? t(l) : Promise.resolve(l).then(i, n);
  }
  s(Hd, "asyncGeneratorStep");
  function Vd(e) {
    return function() {
      var t = this, r = arguments;
      return new Promise(function(i, n) {
        var o = e.apply(t, r);
        function a(l) {
          Hd(o, i, n, a, u, "next", l);
        }
        s(a, "_next");
        function u(l) {
          Hd(o, i, n, a, u, "throw", l);
        }
        s(u, "_throw"), a(void 0);
      });
    };
  }
  s(Vd, "_asyncToGenerator");
  var rs = ge(), Dw = _t(), Zd = be(), mw = Zd.erase, $i = Zd.cursor, is = tt(), ma = is.style, ga = is.clear, gw = is.lines, yw = is.figures,
  ya = class extends Dw {
    static {
      s(this, "TextPrompt");
    }
    constructor(t = {}) {
      super(t), this.transform = ma.render(t.style), this.scale = this.transform.scale, this.msg = t.message, this.initial = t.initial || "",
      this.validator = t.validate || (() => !0), this.value = "", this.errorMsg = t.error || "Please Enter A Valid Value", this.cursor = +!!this.
      initial, this.cursorOffset = 0, this.clear = ga("", this.out.columns), this.render();
    }
    set value(t) {
      !t && this.initial ? (this.placeholder = !0, this.rendered = rs.gray(this.transform.render(this.initial))) : (this.placeholder = !1, this.
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
      return Vd(function* () {
        let r = yield t.validator(t.value);
        typeof r == "string" && (t.errorMsg = r, r = !1), t.error = !r;
      })();
    }
    submit() {
      var t = this;
      return Vd(function* () {
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
      this.closed || (this.firstRender || (this.outputError && this.out.write($i.down(gw(this.outputError, this.out.columns) - 1) + ga(this.
      outputError, this.out.columns)), this.out.write(ga(this.outputText, this.out.columns))), super.render(), this.outputError = "", this.outputText =
      [ma.symbol(this.done, this.aborted), rs.bold(this.msg), ma.delimiter(this.done), this.red ? rs.red(this.rendered) : this.rendered].join(
      " "), this.error && (this.outputError += this.errorMsg.split(`
`).reduce((t, r, i) => t + `
${i ? " " : yw.pointerSmall} ${rs.red().italic(r)}`, "")), this.out.write(mw.line + $i.to(0) + this.outputText + $i.save + this.outputError +
      $i.restore + $i.move(this.cursorOffset, 0)));
    }
  };
  zd.exports = ya;
});

// ../node_modules/prompts/dist/elements/select.js
var Xd = b((hP, Jd) => {
  "use strict";
  var wt = ge(), bw = _t(), Wi = tt(), Kd = Wi.style, Yd = Wi.clear, ns = Wi.figures, vw = Wi.wrap, _w = Wi.entriesToDisplay, ww = be(), Ew = ww.
  cursor, ba = class extends bw {
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
      })), this.optionsPerPage = t.optionsPerPage || 10, this.value = (this.choices[this.cursor] || {}).value, this.clear = Yd("", this.out.
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
      this.firstRender ? this.out.write(Ew.hide) : this.out.write(Yd(this.outputText, this.out.columns)), super.render();
      let t = _w(this.cursor, this.choices.length, this.optionsPerPage), r = t.startIndex, i = t.endIndex;
      if (this.outputText = [Kd.symbol(this.done, this.aborted), wt.bold(this.msg), Kd.delimiter(!1), this.done ? this.selection.title : this.
      selection.disabled ? wt.yellow(this.warn) : wt.gray(this.hint)].join(" "), !this.done) {
        this.outputText += `
`;
        for (let n = r; n < i; n++) {
          let o, a, u = "", l = this.choices[n];
          n === r && r > 0 ? a = ns.arrowUp : n === i - 1 && i < this.choices.length ? a = ns.arrowDown : a = " ", l.disabled ? (o = this.cursor ===
          n ? wt.gray().underline(l.title) : wt.strikethrough().gray(l.title), a = (this.cursor === n ? wt.bold().gray(ns.pointer) + " " : "\
  ") + a) : (o = this.cursor === n ? wt.cyan().underline(l.title) : l.title, a = (this.cursor === n ? wt.cyan(ns.pointer) + " " : "  ") + a,
          l.description && this.cursor === n && (u = ` - ${l.description}`, (a.length + o.length + u.length >= this.out.columns || l.description.
          split(/\r?\n/).length > 1) && (u = `
` + vw(l.description, {
            margin: 3,
            width: this.out.columns
          })))), this.outputText += `${a} ${o}${wt.gray(u)}
`;
        }
      }
      this.out.write(this.outputText);
    }
  };
  Jd.exports = ba;
});

// ../node_modules/prompts/dist/elements/toggle.js
var sf = b((DP, nf) => {
  "use strict";
  var ss = ge(), Cw = _t(), tf = tt(), Qd = tf.style, xw = tf.clear, rf = be(), ef = rf.cursor, Fw = rf.erase, va = class extends Cw {
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
      this.closed || (this.firstRender ? this.out.write(ef.hide) : this.out.write(xw(this.outputText, this.out.columns)), super.render(), this.
      outputText = [Qd.symbol(this.done, this.aborted), ss.bold(this.msg), Qd.delimiter(this.done), this.value ? this.inactive : ss.cyan().underline(
      this.inactive), ss.gray("/"), this.value ? ss.cyan().underline(this.active) : this.active].join(" "), this.out.write(Fw.line + ef.to(0) +
      this.outputText));
    }
  };
  nf.exports = va;
});

// ../node_modules/prompts/dist/dateparts/datepart.js
var at = b((gP, of) => {
  "use strict";
  var _a = class e {
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
  of.exports = _a;
});

// ../node_modules/prompts/dist/dateparts/meridiem.js
var uf = b((bP, af) => {
  "use strict";
  var Sw = at(), wa = class extends Sw {
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
  af.exports = wa;
});

// ../node_modules/prompts/dist/dateparts/day.js
var cf = b((_P, lf) => {
  "use strict";
  var Tw = at(), Aw = /* @__PURE__ */ s((e) => (e = e % 10, e === 1 ? "st" : e === 2 ? "nd" : e === 3 ? "rd" : "th"), "pos"), Ea = class extends Tw {
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
      return this.token === "DD" ? String(t).padStart(2, "0") : this.token === "Do" ? t + Aw(t) : this.token === "d" ? r + 1 : this.token ===
      "ddd" ? this.locales.weekdaysShort[r] : this.token === "dddd" ? this.locales.weekdays[r] : t;
    }
  };
  lf.exports = Ea;
});

// ../node_modules/prompts/dist/dateparts/hours.js
var ff = b((EP, df) => {
  "use strict";
  var Rw = at(), Ca = class extends Rw {
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
  df.exports = Ca;
});

// ../node_modules/prompts/dist/dateparts/milliseconds.js
var pf = b((xP, hf) => {
  "use strict";
  var kw = at(), xa = class extends kw {
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
  hf.exports = xa;
});

// ../node_modules/prompts/dist/dateparts/minutes.js
var mf = b((SP, Df) => {
  "use strict";
  var Ow = at(), Fa = class extends Ow {
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
  Df.exports = Fa;
});

// ../node_modules/prompts/dist/dateparts/month.js
var yf = b((AP, gf) => {
  "use strict";
  var Bw = at(), Sa = class extends Bw {
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
  gf.exports = Sa;
});

// ../node_modules/prompts/dist/dateparts/seconds.js
var vf = b((kP, bf) => {
  "use strict";
  var Pw = at(), Ta = class extends Pw {
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
  bf.exports = Ta;
});

// ../node_modules/prompts/dist/dateparts/year.js
var wf = b((BP, _f) => {
  "use strict";
  var Iw = at(), Aa = class extends Iw {
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
  _f.exports = Aa;
});

// ../node_modules/prompts/dist/dateparts/index.js
var Cf = b((IP, Ef) => {
  "use strict";
  Ef.exports = {
    DatePart: at(),
    Meridiem: uf(),
    Day: cf(),
    Hours: ff(),
    Milliseconds: pf(),
    Minutes: mf(),
    Month: yf(),
    Seconds: vf(),
    Year: wf()
  };
});

// ../node_modules/prompts/dist/elements/date.js
var Pf = b((MP, Bf) => {
  "use strict";
  function xf(e, t, r, i, n, o, a) {
    try {
      var u = e[o](a), l = u.value;
    } catch (c) {
      r(c);
      return;
    }
    u.done ? t(l) : Promise.resolve(l).then(i, n);
  }
  s(xf, "asyncGeneratorStep");
  function Ff(e) {
    return function() {
      var t = this, r = arguments;
      return new Promise(function(i, n) {
        var o = e.apply(t, r);
        function a(l) {
          xf(o, i, n, a, u, "next", l);
        }
        s(a, "_next");
        function u(l) {
          xf(o, i, n, a, u, "throw", l);
        }
        s(u, "_throw"), a(void 0);
      });
    };
  }
  s(Ff, "_asyncToGenerator");
  var Ra = ge(), Mw = _t(), Oa = tt(), Sf = Oa.style, Tf = Oa.clear, jw = Oa.figures, Of = be(), qw = Of.erase, Af = Of.cursor, Et = Cf(), Rf = Et.
  DatePart, Lw = Et.Meridiem, Nw = Et.Day, Uw = Et.Hours, $w = Et.Milliseconds, Ww = Et.Minutes, Hw = Et.Month, Vw = Et.Seconds, Zw = Et.Year,
  zw = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g, kf = {
    1: ({
      token: e
    }) => e.replace(/\\(.)/g, "$1"),
    2: (e) => new Nw(e),
    // Day // TODO
    3: (e) => new Hw(e),
    // Month
    4: (e) => new Zw(e),
    // Year
    5: (e) => new Lw(e),
    // AM/PM // TODO (special)
    6: (e) => new Uw(e),
    // Hours
    7: (e) => new Ww(e),
    // Minutes
    8: (e) => new Vw(e),
    // Seconds
    9: (e) => new $w(e)
    // Fractional seconds
  }, Gw = {
    months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
    monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
    weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
    weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
  }, ka = class extends Mw {
    static {
      s(this, "DatePrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.cursor = 0, this.typed = "", this.locales = Object.assign(Gw, t.locales), this._date = t.initial ||
      /* @__PURE__ */ new Date(), this.errorMsg = t.error || "Please Enter A Valid Value", this.validator = t.validate || (() => !0), this.mask =
      t.mask || "YYYY-MM-DD HH:mm:ss", this.clear = Tf("", this.out.columns), this.render();
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
      for (this.parts = []; r = zw.exec(t); ) {
        let n = r.shift(), o = r.findIndex((a) => a != null);
        this.parts.push(o in kf ? kf[o]({
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
      this.moveCursor(this.parts.findIndex((t) => t instanceof Rf)), this.fire(), this.render();
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
      return Ff(function* () {
        let r = yield t.validator(t.value);
        typeof r == "string" && (t.errorMsg = r, r = !1), t.error = !r;
      })();
    }
    submit() {
      var t = this;
      return Ff(function* () {
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
      this.moveCursor(t ? this.parts.indexOf(t) : this.parts.findIndex((r) => r instanceof Rf)), this.render();
    }
    _(t) {
      /\d/.test(t) && (this.typed += t, this.parts[this.cursor].setTo(this.typed), this.render());
    }
    render() {
      this.closed || (this.firstRender ? this.out.write(Af.hide) : this.out.write(Tf(this.outputText, this.out.columns)), super.render(), this.
      outputText = [Sf.symbol(this.done, this.aborted), Ra.bold(this.msg), Sf.delimiter(!1), this.parts.reduce((t, r, i) => t.concat(i === this.
      cursor && !this.done ? Ra.cyan().underline(r.toString()) : r), []).join("")].join(" "), this.error && (this.outputText += this.errorMsg.
      split(`
`).reduce((t, r, i) => t + `
${i ? " " : jw.pointerSmall} ${Ra.red().italic(r)}`, "")), this.out.write(qw.line + Af.to(0) + this.outputText));
    }
  };
  Bf.exports = ka;
});

// ../node_modules/prompts/dist/elements/number.js
var Uf = b((qP, Nf) => {
  "use strict";
  function If(e, t, r, i, n, o, a) {
    try {
      var u = e[o](a), l = u.value;
    } catch (c) {
      r(c);
      return;
    }
    u.done ? t(l) : Promise.resolve(l).then(i, n);
  }
  s(If, "asyncGeneratorStep");
  function Mf(e) {
    return function() {
      var t = this, r = arguments;
      return new Promise(function(i, n) {
        var o = e.apply(t, r);
        function a(l) {
          If(o, i, n, a, u, "next", l);
        }
        s(a, "_next");
        function u(l) {
          If(o, i, n, a, u, "throw", l);
        }
        s(u, "_throw"), a(void 0);
      });
    };
  }
  s(Mf, "_asyncToGenerator");
  var os = ge(), Kw = _t(), Lf = be(), as = Lf.cursor, Yw = Lf.erase, us = tt(), Ba = us.style, Jw = us.figures, jf = us.clear, Xw = us.lines,
  Qw = /[0-9]/, Pa = /* @__PURE__ */ s((e) => e !== void 0, "isDef"), qf = /* @__PURE__ */ s((e, t) => {
    let r = Math.pow(10, t);
    return Math.round(e * r) / r;
  }, "round"), Ia = class extends Kw {
    static {
      s(this, "NumberPrompt");
    }
    constructor(t = {}) {
      super(t), this.transform = Ba.render(t.style), this.msg = t.message, this.initial = Pa(t.initial) ? t.initial : "", this.float = !!t.float,
      this.round = t.round || 2, this.inc = t.increment || 1, this.min = Pa(t.min) ? t.min : -1 / 0, this.max = Pa(t.max) ? t.max : 1 / 0, this.
      errorMsg = t.error || "Please Enter A Valid Value", this.validator = t.validate || (() => !0), this.color = "cyan", this.value = "", this.
      typed = "", this.lastHit = 0, this.render();
    }
    set value(t) {
      !t && t !== 0 ? (this.placeholder = !0, this.rendered = os.gray(this.transform.render(`${this.initial}`)), this._value = "") : (this.placeholder =
      !1, this.rendered = this.transform.render(`${qf(t, this.round)}`), this._value = qf(t, this.round)), this.fire();
    }
    get value() {
      return this._value;
    }
    parse(t) {
      return this.float ? parseFloat(t) : parseInt(t);
    }
    valid(t) {
      return t === "-" || t === "." && this.float || Qw.test(t);
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
      return Mf(function* () {
        let r = yield t.validator(t.value);
        typeof r == "string" && (t.errorMsg = r, r = !1), t.error = !r;
      })();
    }
    submit() {
      var t = this;
      return Mf(function* () {
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
      this.closed || (this.firstRender || (this.outputError && this.out.write(as.down(Xw(this.outputError, this.out.columns) - 1) + jf(this.
      outputError, this.out.columns)), this.out.write(jf(this.outputText, this.out.columns))), super.render(), this.outputError = "", this.outputText =
      [Ba.symbol(this.done, this.aborted), os.bold(this.msg), Ba.delimiter(this.done), !this.done || !this.done && !this.placeholder ? os[this.
      color]().underline(this.rendered) : this.rendered].join(" "), this.error && (this.outputError += this.errorMsg.split(`
`).reduce((t, r, i) => t + `
${i ? " " : Jw.pointerSmall} ${os.red().italic(r)}`, "")), this.out.write(Yw.line + as.to(0) + this.outputText + as.save + this.outputError +
      as.restore));
    }
  };
  Nf.exports = Ia;
});

// ../node_modules/prompts/dist/elements/multiselect.js
var ja = b((NP, Hf) => {
  "use strict";
  var ut = ge(), eE = be(), tE = eE.cursor, rE = _t(), Hi = tt(), $f = Hi.clear, Vt = Hi.figures, Wf = Hi.style, iE = Hi.wrap, nE = Hi.entriesToDisplay,
  Ma = class extends rE {
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
      })), this.clear = $f("", this.out.columns), t.overrideRender || this.render();
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
      let o = (r.selected ? ut.green(Vt.radioOn) : Vt.radioOff) + " " + n + " ", a, u;
      return r.disabled ? a = t === i ? ut.gray().underline(r.title) : ut.strikethrough().gray(r.title) : (a = t === i ? ut.cyan().underline(
      r.title) : r.title, t === i && r.description && (u = ` - ${r.description}`, (o.length + a.length + u.length >= this.out.columns || r.description.
      split(/\r?\n/).length > 1) && (u = `
` + iE(r.description, {
        margin: o.length,
        width: this.out.columns
      })))), o + a + ut.gray(u || "");
    }
    // shared with autocompleteMultiselect
    paginateOptions(t) {
      if (t.length === 0)
        return ut.red("No matches for this query.");
      let r = nE(this.cursor, t.length, this.optionsPerPage), i = r.startIndex, n = r.endIndex, o, a = [];
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
      let t = [ut.gray(this.hint), this.renderInstructions()];
      return this.value[this.cursor].disabled && t.push(ut.yellow(this.warn)), t.join(" ");
    }
    render() {
      if (this.closed) return;
      this.firstRender && this.out.write(tE.hide), super.render();
      let t = [Wf.symbol(this.done, this.aborted), ut.bold(this.msg), Wf.delimiter(!1), this.renderDoneOrInstructions()].join(" ");
      this.showMinError && (t += ut.red(`You must select a minimum of ${this.minSelected} choices.`), this.showMinError = !1), t += this.renderOptions(
      this.value), this.out.write(this.clear + t), this.clear = $f(t, this.out.columns);
    }
  };
  Hf.exports = Ma;
});

// ../node_modules/prompts/dist/elements/autocomplete.js
var Jf = b(($P, Yf) => {
  "use strict";
  function Vf(e, t, r, i, n, o, a) {
    try {
      var u = e[o](a), l = u.value;
    } catch (c) {
      r(c);
      return;
    }
    u.done ? t(l) : Promise.resolve(l).then(i, n);
  }
  s(Vf, "asyncGeneratorStep");
  function sE(e) {
    return function() {
      var t = this, r = arguments;
      return new Promise(function(i, n) {
        var o = e.apply(t, r);
        function a(l) {
          Vf(o, i, n, a, u, "next", l);
        }
        s(a, "_next");
        function u(l) {
          Vf(o, i, n, a, u, "throw", l);
        }
        s(u, "_throw"), a(void 0);
      });
    };
  }
  s(sE, "_asyncToGenerator");
  var Vi = ge(), oE = _t(), Kf = be(), aE = Kf.erase, Zf = Kf.cursor, Zi = tt(), qa = Zi.style, zf = Zi.clear, La = Zi.figures, uE = Zi.wrap,
  lE = Zi.entriesToDisplay, Gf = /* @__PURE__ */ s((e, t) => e[t] && (e[t].value || e[t].title || e[t]), "getVal"), cE = /* @__PURE__ */ s((e, t) => e[t] &&
  (e[t].title || e[t].value || e[t]), "getTitle"), dE = /* @__PURE__ */ s((e, t) => {
    let r = e.findIndex((i) => i.value === t || i.title === t);
    return r > -1 ? r : void 0;
  }, "getIndex"), Na = class extends oE {
    static {
      s(this, "AutocompletePrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.suggest = t.suggest, this.choices = t.choices, this.initial = typeof t.initial == "number" ? t.initial :
      dE(t.choices, t.initial), this.select = this.initial || t.cursor || 0, this.i18n = {
        noMatches: t.noMatches || "no matches found"
      }, this.fallback = t.fallback || this.initial, this.clearFirst = t.clearFirst || !1, this.suggestions = [], this.input = "", this.limit =
      t.limit || 10, this.cursor = 0, this.transform = qa.render(t.style), this.scale = this.transform.scale, this.render = this.render.bind(
      this), this.complete = this.complete.bind(this), this.clear = zf("", this.out.columns), this.complete(this.render), this.render();
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
      this.select = t, this.suggestions.length > 0 ? this.value = Gf(this.suggestions, t) : this.value = this.fallback.value, this.fire();
    }
    complete(t) {
      var r = this;
      return sE(function* () {
        let i = r.completing = r.suggest(r.input, r.choices), n = yield i;
        if (r.completing !== i) return;
        r.suggestions = n.map((a, u, l) => ({
          title: cE(l, u),
          value: Gf(l, u),
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
      let o, a = i ? La.arrowUp : n ? La.arrowDown : " ", u = r ? Vi.cyan().underline(t.title) : t.title;
      return a = (r ? Vi.cyan(La.pointer) + " " : "  ") + a, t.description && (o = ` - ${t.description}`, (a.length + u.length + o.length >=
      this.out.columns || t.description.split(/\r?\n/).length > 1) && (o = `
` + uE(t.description, {
        margin: 3,
        width: this.out.columns
      }))), a + " " + u + Vi.gray(o || "");
    }
    render() {
      if (this.closed) return;
      this.firstRender ? this.out.write(Zf.hide) : this.out.write(zf(this.outputText, this.out.columns)), super.render();
      let t = lE(this.select, this.choices.length, this.limit), r = t.startIndex, i = t.endIndex;
      if (this.outputText = [qa.symbol(this.done, this.aborted, this.exited), Vi.bold(this.msg), qa.delimiter(this.completing), this.done &&
      this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)].join(" "), !this.
      done) {
        let n = this.suggestions.slice(r, i).map((o, a) => this.renderOption(o, this.select === a + r, a === 0 && r > 0, a + r === i - 1 && i <
        this.choices.length)).join(`
`);
        this.outputText += `
` + (n || Vi.gray(this.fallback.title));
      }
      this.out.write(aE.line + Zf.to(0) + this.outputText);
    }
  };
  Yf.exports = Na;
});

// ../node_modules/prompts/dist/elements/autocompleteMultiselect.js
var th = b((HP, eh) => {
  "use strict";
  var Ct = ge(), fE = be(), hE = fE.cursor, pE = ja(), $a = tt(), Xf = $a.clear, Qf = $a.style, Kr = $a.figures, Ua = class extends pE {
    static {
      s(this, "AutocompleteMultiselectPrompt");
    }
    constructor(t = {}) {
      t.overrideRender = !0, super(t), this.inputValue = "", this.clear = Xf("", this.out.columns), this.filteredOptions = this.value, this.
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
    ${Kr.arrowUp}/${Kr.arrowDown}: Highlight option
    ${Kr.arrowLeft}/${Kr.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
` : "";
    }
    renderCurrentInput() {
      return `
Filtered results for: ${this.inputValue ? this.inputValue : Ct.gray("Enter something to filter")}
`;
    }
    renderOption(t, r, i) {
      let n;
      return r.disabled ? n = t === i ? Ct.gray().underline(r.title) : Ct.strikethrough().gray(r.title) : n = t === i ? Ct.cyan().underline(
      r.title) : r.title, (r.selected ? Ct.green(Kr.radioOn) : Kr.radioOff) + "  " + n;
    }
    renderDoneOrInstructions() {
      if (this.done)
        return this.value.filter((r) => r.selected).map((r) => r.title).join(", ");
      let t = [Ct.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];
      return this.filteredOptions.length && this.filteredOptions[this.cursor].disabled && t.push(Ct.yellow(this.warn)), t.join(" ");
    }
    render() {
      if (this.closed) return;
      this.firstRender && this.out.write(hE.hide), super.render();
      let t = [Qf.symbol(this.done, this.aborted), Ct.bold(this.msg), Qf.delimiter(!1), this.renderDoneOrInstructions()].join(" ");
      this.showMinError && (t += Ct.red(`You must select a minimum of ${this.minSelected} choices.`), this.showMinError = !1), t += this.renderOptions(
      this.filteredOptions), this.out.write(this.clear + t), this.clear = Xf(t, this.out.columns);
    }
  };
  eh.exports = Ua;
});

// ../node_modules/prompts/dist/elements/confirm.js
var uh = b((ZP, ah) => {
  "use strict";
  var rh = ge(), DE = _t(), sh = tt(), ih = sh.style, mE = sh.clear, oh = be(), gE = oh.erase, nh = oh.cursor, Wa = class extends DE {
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
      this.closed || (this.firstRender ? this.out.write(nh.hide) : this.out.write(mE(this.outputText, this.out.columns)), super.render(), this.
      outputText = [ih.symbol(this.done, this.aborted), rh.bold(this.msg), ih.delimiter(this.done), this.done ? this.value ? this.yesMsg : this.
      noMsg : rh.gray(this.initialValue ? this.yesOption : this.noOption)].join(" "), this.out.write(gE.line + nh.to(0) + this.outputText));
    }
  };
  ah.exports = Wa;
});

// ../node_modules/prompts/dist/elements/index.js
var ch = b((GP, lh) => {
  "use strict";
  lh.exports = {
    TextPrompt: Gd(),
    SelectPrompt: Xd(),
    TogglePrompt: sf(),
    DatePrompt: Pf(),
    NumberPrompt: Uf(),
    MultiselectPrompt: ja(),
    AutocompletePrompt: Jf(),
    AutocompleteMultiselectPrompt: th(),
    ConfirmPrompt: uh()
  };
});

// ../node_modules/prompts/dist/prompts.js
var fh = b((dh) => {
  "use strict";
  var Ne = dh, yE = ch(), ls = /* @__PURE__ */ s((e) => e, "noop");
  function lt(e, t, r = {}) {
    return new Promise((i, n) => {
      let o = new yE[e](t), a = r.onAbort || ls, u = r.onSubmit || ls, l = r.onExit || ls;
      o.on("state", t.onState || ls), o.on("submit", (c) => i(u(c))), o.on("exit", (c) => i(l(c))), o.on("abort", (c) => n(a(c)));
    });
  }
  s(lt, "toPrompt");
  Ne.text = (e) => lt("TextPrompt", e);
  Ne.password = (e) => (e.style = "password", Ne.text(e));
  Ne.invisible = (e) => (e.style = "invisible", Ne.text(e));
  Ne.number = (e) => lt("NumberPrompt", e);
  Ne.date = (e) => lt("DatePrompt", e);
  Ne.confirm = (e) => lt("ConfirmPrompt", e);
  Ne.list = (e) => {
    let t = e.separator || ",";
    return lt("TextPrompt", e, {
      onSubmit: /* @__PURE__ */ s((r) => r.split(t).map((i) => i.trim()), "onSubmit")
    });
  };
  Ne.toggle = (e) => lt("TogglePrompt", e);
  Ne.select = (e) => lt("SelectPrompt", e);
  Ne.multiselect = (e) => {
    e.choices = [].concat(e.choices || []);
    let t = /* @__PURE__ */ s((r) => r.filter((i) => i.selected).map((i) => i.value), "toSelected");
    return lt("MultiselectPrompt", e, {
      onAbort: t,
      onSubmit: t
    });
  };
  Ne.autocompleteMultiselect = (e) => {
    e.choices = [].concat(e.choices || []);
    let t = /* @__PURE__ */ s((r) => r.filter((i) => i.selected).map((i) => i.value), "toSelected");
    return lt("AutocompleteMultiselectPrompt", e, {
      onAbort: t,
      onSubmit: t
    });
  };
  var bE = /* @__PURE__ */ s((e, t) => Promise.resolve(t.filter((r) => r.title.slice(0, e.length).toLowerCase() === e.toLowerCase())), "byTi\
tle");
  Ne.autocomplete = (e) => (e.suggest = e.suggest || bE, e.choices = [].concat(e.choices || []), lt("AutocompletePrompt", e));
});

// ../node_modules/prompts/dist/index.js
var vh = b((JP, bh) => {
  "use strict";
  function hh(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      t && (i = i.filter(function(n) {
        return Object.getOwnPropertyDescriptor(e, n).enumerable;
      })), r.push.apply(r, i);
    }
    return r;
  }
  s(hh, "ownKeys");
  function ph(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t] != null ? arguments[t] : {};
      t % 2 ? hh(Object(r), !0).forEach(function(i) {
        vE(e, i, r[i]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : hh(Object(r)).forEach(function(i) {
        Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(r, i));
      });
    }
    return e;
  }
  s(ph, "_objectSpread");
  function vE(e, t, r) {
    return t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
  }
  s(vE, "_defineProperty");
  function _E(e, t) {
    var r = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
    if (!r) {
      if (Array.isArray(e) || (r = wE(e)) || t && e && typeof e.length == "number") {
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
  s(_E, "_createForOfIteratorHelper");
  function wE(e, t) {
    if (e) {
      if (typeof e == "string") return Dh(e, t);
      var r = Object.prototype.toString.call(e).slice(8, -1);
      if (r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set") return Array.from(e);
      if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Dh(e, t);
    }
  }
  s(wE, "_unsupportedIterableToArray");
  function Dh(e, t) {
    (t == null || t > e.length) && (t = e.length);
    for (var r = 0, i = new Array(t); r < t; r++) i[r] = e[r];
    return i;
  }
  s(Dh, "_arrayLikeToArray");
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
  function gh(e) {
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
  s(gh, "_asyncToGenerator");
  var Ha = fh(), EE = ["suggest", "format", "onState", "validate", "onRender", "type"], yh = /* @__PURE__ */ s(() => {
  }, "noop");
  function Zt() {
    return Va.apply(this, arguments);
  }
  s(Zt, "prompt");
  function Va() {
    return Va = gh(function* (e = [], {
      onSubmit: t = yh,
      onCancel: r = yh
    } = {}) {
      let i = {}, n = Zt._override || {};
      e = [].concat(e);
      let o, a, u, l, c, d, p = /* @__PURE__ */ function() {
        var _ = gh(function* (C, F, w = !1) {
          if (!(!w && C.validate && C.validate(F) !== !0))
            return C.format ? yield C.format(F, i) : F;
        });
        return /* @__PURE__ */ s(function(F, w) {
          return _.apply(this, arguments);
        }, "getFormattedAnswer");
      }();
      var h = _E(e), f;
      try {
        for (h.s(); !(f = h.n()).done; ) {
          a = f.value;
          var g = a;
          if (l = g.name, c = g.type, typeof c == "function" && (c = yield c(o, ph({}, i), a), a.type = c), !!c) {
            for (let _ in a) {
              if (EE.includes(_)) continue;
              let C = a[_];
              a[_] = typeof C == "function" ? yield C(o, ph({}, i), d) : C;
            }
            if (d = a, typeof a.message != "string")
              throw new Error("prompt message is required");
            var E = a;
            if (l = E.name, c = E.type, Ha[c] === void 0)
              throw new Error(`prompt type (${c}) is not defined`);
            if (n[a.name] !== void 0 && (o = yield p(a, n[a.name]), o !== void 0)) {
              i[l] = o;
              continue;
            }
            try {
              o = Zt._injected ? CE(Zt._injected, a.initial) : yield Ha[c](a), i[l] = o = yield p(a, o, !0), u = yield t(a, o, i);
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
    }), Va.apply(this, arguments);
  }
  s(Va, "_prompt");
  function CE(e, t) {
    let r = e.shift();
    if (r instanceof Error)
      throw r;
    return r === void 0 ? t : r;
  }
  s(CE, "getInjectedAnswer");
  function xE(e) {
    Zt._injected = (Zt._injected || []).concat(e);
  }
  s(xE, "inject");
  function FE(e) {
    Zt._override = Object.assign({}, e);
  }
  s(FE, "override");
  bh.exports = Object.assign(Zt, {
    prompt: Zt,
    prompts: Ha,
    inject: xE,
    override: FE
  });
});

// ../node_modules/prompts/lib/util/action.js
var wh = b((QP, _h) => {
  "use strict";
  _h.exports = (e, t) => {
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
var cs = b((eI, Eh) => {
  "use strict";
  Eh.exports = (e) => {
    let t = [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))"
    ].join("|"), r = new RegExp(t, "g");
    return typeof e == "string" ? e.replace(r, "") : e;
  };
});

// ../node_modules/prompts/lib/util/clear.js
var Fh = b((tI, xh) => {
  "use strict";
  var SE = cs(), { erase: Ch, cursor: TE } = be(), AE = /* @__PURE__ */ s((e) => [...SE(e)].length, "width");
  xh.exports = function(e, t) {
    if (!t) return Ch.line + TE.to(0);
    let r = 0, i = e.split(/\r?\n/);
    for (let n of i)
      r += 1 + Math.floor(Math.max(AE(n) - 1, 0) / t);
    return Ch.lines(r);
  };
});

// ../node_modules/prompts/lib/util/figures.js
var Za = b((iI, Sh) => {
  "use strict";
  var zi = {
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
  }, RE = {
    arrowUp: zi.arrowUp,
    arrowDown: zi.arrowDown,
    arrowLeft: zi.arrowLeft,
    arrowRight: zi.arrowRight,
    radioOn: "(*)",
    radioOff: "( )",
    tick: "\u221A",
    cross: "\xD7",
    ellipsis: "...",
    pointerSmall: "\xBB",
    line: "\u2500",
    pointer: ">"
  }, kE = process.platform === "win32" ? RE : zi;
  Sh.exports = kE;
});

// ../node_modules/prompts/lib/util/style.js
var Ah = b((nI, Th) => {
  "use strict";
  var Yr = ge(), cr = Za(), za = Object.freeze({
    password: { scale: 1, render: /* @__PURE__ */ s((e) => "*".repeat(e.length), "render") },
    emoji: { scale: 2, render: /* @__PURE__ */ s((e) => "\u{1F603}".repeat(e.length), "render") },
    invisible: { scale: 0, render: /* @__PURE__ */ s((e) => "", "render") },
    default: { scale: 1, render: /* @__PURE__ */ s((e) => `${e}`, "render") }
  }), OE = /* @__PURE__ */ s((e) => za[e] || za.default, "render"), Gi = Object.freeze({
    aborted: Yr.red(cr.cross),
    done: Yr.green(cr.tick),
    exited: Yr.yellow(cr.cross),
    default: Yr.cyan("?")
  }), BE = /* @__PURE__ */ s((e, t, r) => t ? Gi.aborted : r ? Gi.exited : e ? Gi.done : Gi.default, "symbol"), PE = /* @__PURE__ */ s((e) => Yr.
  gray(e ? cr.ellipsis : cr.pointerSmall), "delimiter"), IE = /* @__PURE__ */ s((e, t) => Yr.gray(e ? t ? cr.pointerSmall : "+" : cr.line), "\
item");
  Th.exports = {
    styles: za,
    render: OE,
    symbols: Gi,
    symbol: BE,
    delimiter: PE,
    item: IE
  };
});

// ../node_modules/prompts/lib/util/lines.js
var kh = b((oI, Rh) => {
  "use strict";
  var ME = cs();
  Rh.exports = function(e, t) {
    let r = String(ME(e) || "").split(/\r?\n/);
    return t ? r.map((i) => Math.ceil(i.length / t)).reduce((i, n) => i + n) : r.length;
  };
});

// ../node_modules/prompts/lib/util/wrap.js
var Bh = b((aI, Oh) => {
  "use strict";
  Oh.exports = (e, t = {}) => {
    let r = Number.isSafeInteger(parseInt(t.margin)) ? new Array(parseInt(t.margin)).fill(" ").join("") : t.margin || "", i = t.width;
    return (e || "").split(/\r?\n/g).map((n) => n.split(/\s+/g).reduce((o, a) => (a.length + r.length >= i || o[o.length - 1].length + a.length +
    1 < i ? o[o.length - 1] += ` ${a}` : o.push(`${r}${a}`), o), [r]).join(`
`)).join(`
`);
  };
});

// ../node_modules/prompts/lib/util/entriesToDisplay.js
var Ih = b((uI, Ph) => {
  "use strict";
  Ph.exports = (e, t, r) => {
    r = r || t;
    let i = Math.min(t - r, e - Math.floor(r / 2));
    i < 0 && (i = 0);
    let n = Math.min(i + r, t);
    return { startIndex: i, endIndex: n };
  };
});

// ../node_modules/prompts/lib/util/index.js
var rt = b((lI, Mh) => {
  "use strict";
  Mh.exports = {
    action: wh(),
    clear: Fh(),
    style: Ah(),
    strip: cs(),
    figures: Za(),
    lines: kh(),
    wrap: Bh(),
    entriesToDisplay: Ih()
  };
});

// ../node_modules/prompts/lib/elements/prompt.js
var xt = b((cI, qh) => {
  "use strict";
  var jh = x("readline"), { action: jE } = rt(), qE = x("events"), { beep: LE, cursor: NE } = be(), UE = ge(), Ga = class extends qE {
    static {
      s(this, "Prompt");
    }
    constructor(t = {}) {
      super(), this.firstRender = !0, this.in = t.stdin || process.stdin, this.out = t.stdout || process.stdout, this.onRender = (t.onRender ||
      (() => {
      })).bind(this);
      let r = jh.createInterface({ input: this.in, escapeCodeTimeout: 50 });
      jh.emitKeypressEvents(this.in, r), this.in.isTTY && this.in.setRawMode(!0);
      let i = ["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1, n = /* @__PURE__ */ s((o, a) => {
        let u = jE(a, i);
        u === !1 ? this._ && this._(o, a) : typeof this[u] == "function" ? this[u](a) : this.bell();
      }, "keypress");
      this.close = () => {
        this.out.write(NE.show), this.in.removeListener("keypress", n), this.in.isTTY && this.in.setRawMode(!1), r.close(), this.emit(this.aborted ?
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
      this.out.write(LE);
    }
    render() {
      this.onRender(UE), this.firstRender && (this.firstRender = !1);
    }
  };
  qh.exports = Ga;
});

// ../node_modules/prompts/lib/elements/text.js
var Nh = b((fI, Lh) => {
  var ds = ge(), $E = xt(), { erase: WE, cursor: Ki } = be(), { style: Ka, clear: Ya, lines: HE, figures: VE } = rt(), Ja = class extends $E {
    static {
      s(this, "TextPrompt");
    }
    constructor(t = {}) {
      super(t), this.transform = Ka.render(t.style), this.scale = this.transform.scale, this.msg = t.message, this.initial = t.initial || "",
      this.validator = t.validate || (() => !0), this.value = "", this.errorMsg = t.error || "Please Enter A Valid Value", this.cursor = +!!this.
      initial, this.cursorOffset = 0, this.clear = Ya("", this.out.columns), this.render();
    }
    set value(t) {
      !t && this.initial ? (this.placeholder = !0, this.rendered = ds.gray(this.transform.render(this.initial))) : (this.placeholder = !1, this.
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
      this.closed || (this.firstRender || (this.outputError && this.out.write(Ki.down(HE(this.outputError, this.out.columns) - 1) + Ya(this.
      outputError, this.out.columns)), this.out.write(Ya(this.outputText, this.out.columns))), super.render(), this.outputError = "", this.outputText =
      [
        Ka.symbol(this.done, this.aborted),
        ds.bold(this.msg),
        Ka.delimiter(this.done),
        this.red ? ds.red(this.rendered) : this.rendered
      ].join(" "), this.error && (this.outputError += this.errorMsg.split(`
`).reduce((t, r, i) => t + `
${i ? " " : VE.pointerSmall} ${ds.red().italic(r)}`, "")), this.out.write(WE.line + Ki.to(0) + this.outputText + Ki.save + this.outputError +
      Ki.restore + Ki.move(this.cursorOffset, 0)));
    }
  };
  Lh.exports = Ja;
});

// ../node_modules/prompts/lib/elements/select.js
var Hh = b((pI, Wh) => {
  "use strict";
  var Ft = ge(), ZE = xt(), { style: Uh, clear: $h, figures: fs, wrap: zE, entriesToDisplay: GE } = rt(), { cursor: KE } = be(), Xa = class extends ZE {
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
      })), this.optionsPerPage = t.optionsPerPage || 10, this.value = (this.choices[this.cursor] || {}).value, this.clear = $h("", this.out.
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
      this.firstRender ? this.out.write(KE.hide) : this.out.write($h(this.outputText, this.out.columns)), super.render();
      let { startIndex: t, endIndex: r } = GE(this.cursor, this.choices.length, this.optionsPerPage);
      if (this.outputText = [
        Uh.symbol(this.done, this.aborted),
        Ft.bold(this.msg),
        Uh.delimiter(!1),
        this.done ? this.selection.title : this.selection.disabled ? Ft.yellow(this.warn) : Ft.gray(this.hint)
      ].join(" "), !this.done) {
        this.outputText += `
`;
        for (let i = t; i < r; i++) {
          let n, o, a = "", u = this.choices[i];
          i === t && t > 0 ? o = fs.arrowUp : i === r - 1 && r < this.choices.length ? o = fs.arrowDown : o = " ", u.disabled ? (n = this.cursor ===
          i ? Ft.gray().underline(u.title) : Ft.strikethrough().gray(u.title), o = (this.cursor === i ? Ft.bold().gray(fs.pointer) + " " : "\
  ") + o) : (n = this.cursor === i ? Ft.cyan().underline(u.title) : u.title, o = (this.cursor === i ? Ft.cyan(fs.pointer) + " " : "  ") + o,
          u.description && this.cursor === i && (a = ` - ${u.description}`, (o.length + n.length + a.length >= this.out.columns || u.description.
          split(/\r?\n/).length > 1) && (a = `
` + zE(u.description, { margin: 3, width: this.out.columns })))), this.outputText += `${o} ${n}${Ft.gray(a)}
`;
        }
      }
      this.out.write(this.outputText);
    }
  };
  Wh.exports = Xa;
});

// ../node_modules/prompts/lib/elements/toggle.js
var Gh = b((mI, zh) => {
  var hs = ge(), YE = xt(), { style: Vh, clear: JE } = rt(), { cursor: Zh, erase: XE } = be(), Qa = class extends YE {
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
      this.closed || (this.firstRender ? this.out.write(Zh.hide) : this.out.write(JE(this.outputText, this.out.columns)), super.render(), this.
      outputText = [
        Vh.symbol(this.done, this.aborted),
        hs.bold(this.msg),
        Vh.delimiter(this.done),
        this.value ? this.inactive : hs.cyan().underline(this.inactive),
        hs.gray("/"),
        this.value ? hs.cyan().underline(this.active) : this.active
      ].join(" "), this.out.write(XE.line + Zh.to(0) + this.outputText));
    }
  };
  zh.exports = Qa;
});

// ../node_modules/prompts/lib/dateparts/datepart.js
var ct = b((yI, Kh) => {
  "use strict";
  var eu = class e {
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
  Kh.exports = eu;
});

// ../node_modules/prompts/lib/dateparts/meridiem.js
var Jh = b((vI, Yh) => {
  "use strict";
  var QE = ct(), tu = class extends QE {
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
  Yh.exports = tu;
});

// ../node_modules/prompts/lib/dateparts/day.js
var Qh = b((wI, Xh) => {
  "use strict";
  var eC = ct(), tC = /* @__PURE__ */ s((e) => (e = e % 10, e === 1 ? "st" : e === 2 ? "nd" : e === 3 ? "rd" : "th"), "pos"), ru = class extends eC {
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
      return this.token === "DD" ? String(t).padStart(2, "0") : this.token === "Do" ? t + tC(t) : this.token === "d" ? r + 1 : this.token ===
      "ddd" ? this.locales.weekdaysShort[r] : this.token === "dddd" ? this.locales.weekdays[r] : t;
    }
  };
  Xh.exports = ru;
});

// ../node_modules/prompts/lib/dateparts/hours.js
var tp = b((CI, ep) => {
  "use strict";
  var rC = ct(), iu = class extends rC {
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
  ep.exports = iu;
});

// ../node_modules/prompts/lib/dateparts/milliseconds.js
var ip = b((FI, rp) => {
  "use strict";
  var iC = ct(), nu = class extends iC {
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
  rp.exports = nu;
});

// ../node_modules/prompts/lib/dateparts/minutes.js
var sp = b((TI, np) => {
  "use strict";
  var nC = ct(), su = class extends nC {
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
  np.exports = su;
});

// ../node_modules/prompts/lib/dateparts/month.js
var ap = b((RI, op) => {
  "use strict";
  var sC = ct(), ou = class extends sC {
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
  op.exports = ou;
});

// ../node_modules/prompts/lib/dateparts/seconds.js
var lp = b((OI, up) => {
  "use strict";
  var oC = ct(), au = class extends oC {
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
  up.exports = au;
});

// ../node_modules/prompts/lib/dateparts/year.js
var dp = b((PI, cp) => {
  "use strict";
  var aC = ct(), uu = class extends aC {
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
  cp.exports = uu;
});

// ../node_modules/prompts/lib/dateparts/index.js
var hp = b((MI, fp) => {
  "use strict";
  fp.exports = {
    DatePart: ct(),
    Meridiem: Jh(),
    Day: Qh(),
    Hours: tp(),
    Milliseconds: ip(),
    Minutes: sp(),
    Month: ap(),
    Seconds: lp(),
    Year: dp()
  };
});

// ../node_modules/prompts/lib/elements/date.js
var vp = b((jI, bp) => {
  "use strict";
  var lu = ge(), uC = xt(), { style: pp, clear: Dp, figures: lC } = rt(), { erase: cC, cursor: mp } = be(), { DatePart: gp, Meridiem: dC, Day: fC,
  Hours: hC, Milliseconds: pC, Minutes: DC, Month: mC, Seconds: gC, Year: yC } = hp(), bC = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g,
  yp = {
    1: ({ token: e }) => e.replace(/\\(.)/g, "$1"),
    2: (e) => new fC(e),
    // Day // TODO
    3: (e) => new mC(e),
    // Month
    4: (e) => new yC(e),
    // Year
    5: (e) => new dC(e),
    // AM/PM // TODO (special)
    6: (e) => new hC(e),
    // Hours
    7: (e) => new DC(e),
    // Minutes
    8: (e) => new gC(e),
    // Seconds
    9: (e) => new pC(e)
    // Fractional seconds
  }, vC = {
    months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
    monthsShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
    weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
    weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",")
  }, cu = class extends uC {
    static {
      s(this, "DatePrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.cursor = 0, this.typed = "", this.locales = Object.assign(vC, t.locales), this._date = t.initial ||
      /* @__PURE__ */ new Date(), this.errorMsg = t.error || "Please Enter A Valid Value", this.validator = t.validate || (() => !0), this.mask =
      t.mask || "YYYY-MM-DD HH:mm:ss", this.clear = Dp("", this.out.columns), this.render();
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
      for (this.parts = []; r = bC.exec(t); ) {
        let n = r.shift(), o = r.findIndex((a) => a != null);
        this.parts.push(o in yp ? yp[o]({ token: r[o] || n, date: this.date, parts: this.parts, locales: this.locales }) : r[o] || n);
      }
      let i = this.parts.reduce((n, o) => (typeof o == "string" && typeof n[n.length - 1] == "string" ? n[n.length - 1] += o : n.push(o), n),
      []);
      this.parts.splice(0), this.parts.push(...i), this.reset();
    }
    moveCursor(t) {
      this.typed = "", this.cursor = t, this.fire();
    }
    reset() {
      this.moveCursor(this.parts.findIndex((t) => t instanceof gp)), this.fire(), this.render();
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
      this.moveCursor(t ? this.parts.indexOf(t) : this.parts.findIndex((r) => r instanceof gp)), this.render();
    }
    _(t) {
      /\d/.test(t) && (this.typed += t, this.parts[this.cursor].setTo(this.typed), this.render());
    }
    render() {
      this.closed || (this.firstRender ? this.out.write(mp.hide) : this.out.write(Dp(this.outputText, this.out.columns)), super.render(), this.
      outputText = [
        pp.symbol(this.done, this.aborted),
        lu.bold(this.msg),
        pp.delimiter(!1),
        this.parts.reduce((t, r, i) => t.concat(i === this.cursor && !this.done ? lu.cyan().underline(r.toString()) : r), []).join("")
      ].join(" "), this.error && (this.outputText += this.errorMsg.split(`
`).reduce(
        (t, r, i) => t + `
${i ? " " : lC.pointerSmall} ${lu.red().italic(r)}`,
        ""
      )), this.out.write(cC.line + mp.to(0) + this.outputText));
    }
  };
  bp.exports = cu;
});

// ../node_modules/prompts/lib/elements/number.js
var Cp = b((LI, Ep) => {
  var ps = ge(), _C = xt(), { cursor: Ds, erase: wC } = be(), { style: du, figures: EC, clear: _p, lines: CC } = rt(), xC = /[0-9]/, fu = /* @__PURE__ */ s(
  (e) => e !== void 0, "isDef"), wp = /* @__PURE__ */ s((e, t) => {
    let r = Math.pow(10, t);
    return Math.round(e * r) / r;
  }, "round"), hu = class extends _C {
    static {
      s(this, "NumberPrompt");
    }
    constructor(t = {}) {
      super(t), this.transform = du.render(t.style), this.msg = t.message, this.initial = fu(t.initial) ? t.initial : "", this.float = !!t.float,
      this.round = t.round || 2, this.inc = t.increment || 1, this.min = fu(t.min) ? t.min : -1 / 0, this.max = fu(t.max) ? t.max : 1 / 0, this.
      errorMsg = t.error || "Please Enter A Valid Value", this.validator = t.validate || (() => !0), this.color = "cyan", this.value = "", this.
      typed = "", this.lastHit = 0, this.render();
    }
    set value(t) {
      !t && t !== 0 ? (this.placeholder = !0, this.rendered = ps.gray(this.transform.render(`${this.initial}`)), this._value = "") : (this.placeholder =
      !1, this.rendered = this.transform.render(`${wp(t, this.round)}`), this._value = wp(t, this.round)), this.fire();
    }
    get value() {
      return this._value;
    }
    parse(t) {
      return this.float ? parseFloat(t) : parseInt(t);
    }
    valid(t) {
      return t === "-" || t === "." && this.float || xC.test(t);
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
      this.closed || (this.firstRender || (this.outputError && this.out.write(Ds.down(CC(this.outputError, this.out.columns) - 1) + _p(this.
      outputError, this.out.columns)), this.out.write(_p(this.outputText, this.out.columns))), super.render(), this.outputError = "", this.outputText =
      [
        du.symbol(this.done, this.aborted),
        ps.bold(this.msg),
        du.delimiter(this.done),
        !this.done || !this.done && !this.placeholder ? ps[this.color]().underline(this.rendered) : this.rendered
      ].join(" "), this.error && (this.outputError += this.errorMsg.split(`
`).reduce((t, r, i) => t + `
${i ? " " : EC.pointerSmall} ${ps.red().italic(r)}`, "")), this.out.write(wC.line + Ds.to(0) + this.outputText + Ds.save + this.outputError +
      Ds.restore));
    }
  };
  Ep.exports = hu;
});

// ../node_modules/prompts/lib/elements/multiselect.js
var Du = b((UI, Sp) => {
  "use strict";
  var dt = ge(), { cursor: FC } = be(), SC = xt(), { clear: xp, figures: zt, style: Fp, wrap: TC, entriesToDisplay: AC } = rt(), pu = class extends SC {
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
      })), this.clear = xp("", this.out.columns), t.overrideRender || this.render();
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
      let o = (r.selected ? dt.green(zt.radioOn) : zt.radioOff) + " " + n + " ", a, u;
      return r.disabled ? a = t === i ? dt.gray().underline(r.title) : dt.strikethrough().gray(r.title) : (a = t === i ? dt.cyan().underline(
      r.title) : r.title, t === i && r.description && (u = ` - ${r.description}`, (o.length + a.length + u.length >= this.out.columns || r.description.
      split(/\r?\n/).length > 1) && (u = `
` + TC(r.description, { margin: o.length, width: this.out.columns })))), o + a + dt.gray(u || "");
    }
    // shared with autocompleteMultiselect
    paginateOptions(t) {
      if (t.length === 0)
        return dt.red("No matches for this query.");
      let { startIndex: r, endIndex: i } = AC(this.cursor, t.length, this.optionsPerPage), n, o = [];
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
      let t = [dt.gray(this.hint), this.renderInstructions()];
      return this.value[this.cursor].disabled && t.push(dt.yellow(this.warn)), t.join(" ");
    }
    render() {
      if (this.closed) return;
      this.firstRender && this.out.write(FC.hide), super.render();
      let t = [
        Fp.symbol(this.done, this.aborted),
        dt.bold(this.msg),
        Fp.delimiter(!1),
        this.renderDoneOrInstructions()
      ].join(" ");
      this.showMinError && (t += dt.red(`You must select a minimum of ${this.minSelected} choices.`), this.showMinError = !1), t += this.renderOptions(
      this.value), this.out.write(this.clear + t), this.clear = xp(t, this.out.columns);
    }
  };
  Sp.exports = pu;
});

// ../node_modules/prompts/lib/elements/autocomplete.js
var Op = b((WI, kp) => {
  "use strict";
  var Yi = ge(), RC = xt(), { erase: kC, cursor: Tp } = be(), { style: mu, clear: Ap, figures: gu, wrap: OC, entriesToDisplay: BC } = rt(), Rp = /* @__PURE__ */ s(
  (e, t) => e[t] && (e[t].value || e[t].title || e[t]), "getVal"), PC = /* @__PURE__ */ s((e, t) => e[t] && (e[t].title || e[t].value || e[t]),
  "getTitle"), IC = /* @__PURE__ */ s((e, t) => {
    let r = e.findIndex((i) => i.value === t || i.title === t);
    return r > -1 ? r : void 0;
  }, "getIndex"), yu = class extends RC {
    static {
      s(this, "AutocompletePrompt");
    }
    constructor(t = {}) {
      super(t), this.msg = t.message, this.suggest = t.suggest, this.choices = t.choices, this.initial = typeof t.initial == "number" ? t.initial :
      IC(t.choices, t.initial), this.select = this.initial || t.cursor || 0, this.i18n = { noMatches: t.noMatches || "no matches found" }, this.
      fallback = t.fallback || this.initial, this.clearFirst = t.clearFirst || !1, this.suggestions = [], this.input = "", this.limit = t.limit ||
      10, this.cursor = 0, this.transform = mu.render(t.style), this.scale = this.transform.scale, this.render = this.render.bind(this), this.
      complete = this.complete.bind(this), this.clear = Ap("", this.out.columns), this.complete(this.render), this.render();
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
      this.select = t, this.suggestions.length > 0 ? this.value = Rp(this.suggestions, t) : this.value = this.fallback.value, this.fire();
    }
    async complete(t) {
      let r = this.completing = this.suggest(this.input, this.choices), i = await r;
      if (this.completing !== r) return;
      this.suggestions = i.map((o, a, u) => ({ title: PC(u, a), value: Rp(u, a), description: o.description })), this.completing = !1;
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
      let o, a = i ? gu.arrowUp : n ? gu.arrowDown : " ", u = r ? Yi.cyan().underline(t.title) : t.title;
      return a = (r ? Yi.cyan(gu.pointer) + " " : "  ") + a, t.description && (o = ` - ${t.description}`, (a.length + u.length + o.length >=
      this.out.columns || t.description.split(/\r?\n/).length > 1) && (o = `
` + OC(t.description, { margin: 3, width: this.out.columns }))), a + " " + u + Yi.gray(o || "");
    }
    render() {
      if (this.closed) return;
      this.firstRender ? this.out.write(Tp.hide) : this.out.write(Ap(this.outputText, this.out.columns)), super.render();
      let { startIndex: t, endIndex: r } = BC(this.select, this.choices.length, this.limit);
      if (this.outputText = [
        mu.symbol(this.done, this.aborted, this.exited),
        Yi.bold(this.msg),
        mu.delimiter(this.completing),
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
` + (i || Yi.gray(this.fallback.title));
      }
      this.out.write(kC.line + Tp.to(0) + this.outputText);
    }
  };
  kp.exports = yu;
});

// ../node_modules/prompts/lib/elements/autocompleteMultiselect.js
var Mp = b((VI, Ip) => {
  "use strict";
  var St = ge(), { cursor: MC } = be(), jC = Du(), { clear: Bp, style: Pp, figures: Jr } = rt(), bu = class extends jC {
    static {
      s(this, "AutocompleteMultiselectPrompt");
    }
    constructor(t = {}) {
      t.overrideRender = !0, super(t), this.inputValue = "", this.clear = Bp("", this.out.columns), this.filteredOptions = this.value, this.
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
    ${Jr.arrowUp}/${Jr.arrowDown}: Highlight option
    ${Jr.arrowLeft}/${Jr.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
` : "";
    }
    renderCurrentInput() {
      return `
Filtered results for: ${this.inputValue ? this.inputValue : St.gray("Enter something to filter")}
`;
    }
    renderOption(t, r, i) {
      let n;
      return r.disabled ? n = t === i ? St.gray().underline(r.title) : St.strikethrough().gray(r.title) : n = t === i ? St.cyan().underline(
      r.title) : r.title, (r.selected ? St.green(Jr.radioOn) : Jr.radioOff) + "  " + n;
    }
    renderDoneOrInstructions() {
      if (this.done)
        return this.value.filter((r) => r.selected).map((r) => r.title).join(", ");
      let t = [St.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];
      return this.filteredOptions.length && this.filteredOptions[this.cursor].disabled && t.push(St.yellow(this.warn)), t.join(" ");
    }
    render() {
      if (this.closed) return;
      this.firstRender && this.out.write(MC.hide), super.render();
      let t = [
        Pp.symbol(this.done, this.aborted),
        St.bold(this.msg),
        Pp.delimiter(!1),
        this.renderDoneOrInstructions()
      ].join(" ");
      this.showMinError && (t += St.red(`You must select a minimum of ${this.minSelected} choices.`), this.showMinError = !1), t += this.renderOptions(
      this.filteredOptions), this.out.write(this.clear + t), this.clear = Bp(t, this.out.columns);
    }
  };
  Ip.exports = bu;
});

// ../node_modules/prompts/lib/elements/confirm.js
var Up = b((zI, Np) => {
  var jp = ge(), qC = xt(), { style: qp, clear: LC } = rt(), { erase: NC, cursor: Lp } = be(), vu = class extends qC {
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
      this.closed || (this.firstRender ? this.out.write(Lp.hide) : this.out.write(LC(this.outputText, this.out.columns)), super.render(), this.
      outputText = [
        qp.symbol(this.done, this.aborted),
        jp.bold(this.msg),
        qp.delimiter(this.done),
        this.done ? this.value ? this.yesMsg : this.noMsg : jp.gray(this.initialValue ? this.yesOption : this.noOption)
      ].join(" "), this.out.write(NC.line + Lp.to(0) + this.outputText));
    }
  };
  Np.exports = vu;
});

// ../node_modules/prompts/lib/elements/index.js
var Wp = b((KI, $p) => {
  "use strict";
  $p.exports = {
    TextPrompt: Nh(),
    SelectPrompt: Hh(),
    TogglePrompt: Gh(),
    DatePrompt: vp(),
    NumberPrompt: Cp(),
    MultiselectPrompt: Du(),
    AutocompletePrompt: Op(),
    AutocompleteMultiselectPrompt: Mp(),
    ConfirmPrompt: Up()
  };
});

// ../node_modules/prompts/lib/prompts.js
var Vp = b((Hp) => {
  "use strict";
  var Ue = Hp, UC = Wp(), ms = /* @__PURE__ */ s((e) => e, "noop");
  function ft(e, t, r = {}) {
    return new Promise((i, n) => {
      let o = new UC[e](t), a = r.onAbort || ms, u = r.onSubmit || ms, l = r.onExit || ms;
      o.on("state", t.onState || ms), o.on("submit", (c) => i(u(c))), o.on("exit", (c) => i(l(c))), o.on("abort", (c) => n(a(c)));
    });
  }
  s(ft, "toPrompt");
  Ue.text = (e) => ft("TextPrompt", e);
  Ue.password = (e) => (e.style = "password", Ue.text(e));
  Ue.invisible = (e) => (e.style = "invisible", Ue.text(e));
  Ue.number = (e) => ft("NumberPrompt", e);
  Ue.date = (e) => ft("DatePrompt", e);
  Ue.confirm = (e) => ft("ConfirmPrompt", e);
  Ue.list = (e) => {
    let t = e.separator || ",";
    return ft("TextPrompt", e, {
      onSubmit: /* @__PURE__ */ s((r) => r.split(t).map((i) => i.trim()), "onSubmit")
    });
  };
  Ue.toggle = (e) => ft("TogglePrompt", e);
  Ue.select = (e) => ft("SelectPrompt", e);
  Ue.multiselect = (e) => {
    e.choices = [].concat(e.choices || []);
    let t = /* @__PURE__ */ s((r) => r.filter((i) => i.selected).map((i) => i.value), "toSelected");
    return ft("MultiselectPrompt", e, {
      onAbort: t,
      onSubmit: t
    });
  };
  Ue.autocompleteMultiselect = (e) => {
    e.choices = [].concat(e.choices || []);
    let t = /* @__PURE__ */ s((r) => r.filter((i) => i.selected).map((i) => i.value), "toSelected");
    return ft("AutocompleteMultiselectPrompt", e, {
      onAbort: t,
      onSubmit: t
    });
  };
  var $C = /* @__PURE__ */ s((e, t) => Promise.resolve(
    t.filter((r) => r.title.slice(0, e.length).toLowerCase() === e.toLowerCase())
  ), "byTitle");
  Ue.autocomplete = (e) => (e.suggest = e.suggest || $C, e.choices = [].concat(e.choices || []), ft("AutocompletePrompt", e));
});

// ../node_modules/prompts/lib/index.js
var Gp = b((XI, zp) => {
  "use strict";
  var _u = Vp(), WC = ["suggest", "format", "onState", "validate", "onRender", "type"], Zp = /* @__PURE__ */ s(() => {
  }, "noop");
  async function Gt(e = [], { onSubmit: t = Zp, onCancel: r = Zp } = {}) {
    let i = {}, n = Gt._override || {};
    e = [].concat(e);
    let o, a, u, l, c, d, p = /* @__PURE__ */ s(async (h, f, g = !1) => {
      if (!(!g && h.validate && h.validate(f) !== !0))
        return h.format ? await h.format(f, i) : f;
    }, "getFormattedAnswer");
    for (a of e)
      if ({ name: l, type: c } = a, typeof c == "function" && (c = await c(o, { ...i }, a), a.type = c), !!c) {
        for (let h in a) {
          if (WC.includes(h)) continue;
          let f = a[h];
          a[h] = typeof f == "function" ? await f(o, { ...i }, d) : f;
        }
        if (d = a, typeof a.message != "string")
          throw new Error("prompt message is required");
        if ({ name: l, type: c } = a, _u[c] === void 0)
          throw new Error(`prompt type (${c}) is not defined`);
        if (n[a.name] !== void 0 && (o = await p(a, n[a.name]), o !== void 0)) {
          i[l] = o;
          continue;
        }
        try {
          o = Gt._injected ? HC(Gt._injected, a.initial) : await _u[c](a), i[l] = o = await p(a, o, !0), u = await t(a, o, i);
        } catch {
          u = !await r(a, i);
        }
        if (u) return i;
      }
    return i;
  }
  s(Gt, "prompt");
  function HC(e, t) {
    let r = e.shift();
    if (r instanceof Error)
      throw r;
    return r === void 0 ? t : r;
  }
  s(HC, "getInjectedAnswer");
  function VC(e) {
    Gt._injected = (Gt._injected || []).concat(e);
  }
  s(VC, "inject");
  function ZC(e) {
    Gt._override = Object.assign({}, e);
  }
  s(ZC, "override");
  zp.exports = Object.assign(Gt, { prompt: Gt, prompts: _u, inject: VC, override: ZC });
});

// ../node_modules/prompts/index.js
var gs = b((e6, Kp) => {
  function zC(e) {
    e = (Array.isArray(e) ? e : e.split(".")).map(Number);
    let t = 0, r = process.versions.node.split(".").map(Number);
    for (; t < e.length; t++) {
      if (r[t] > e[t]) return !1;
      if (e[t] > r[t]) return !0;
    }
    return !1;
  }
  s(zC, "isNodeLT");
  Kp.exports = zC("8.6.0") ? vh() : Gp();
});

// ../node_modules/picocolors/picocolors.js
var Eu = b((r6, wu) => {
  var Yp = process.argv || [], ys = process.env, GC = !("NO_COLOR" in ys || Yp.includes("--no-color")) && ("FORCE_COLOR" in ys || Yp.includes(
  "--color") || process.platform === "win32" || x != null && x("tty").isatty(1) && ys.TERM !== "dumb" || "CI" in ys), KC = /* @__PURE__ */ s(
  (e, t, r = e) => (i) => {
    let n = "" + i, o = n.indexOf(t, e.length);
    return ~o ? e + YC(n, t, r, o) + t : e + n + t;
  }, "formatter"), YC = /* @__PURE__ */ s((e, t, r, i) => {
    let n = "", o = 0;
    do
      n += e.substring(o, i) + r, o = i + t.length, i = e.indexOf(t, o);
    while (~i);
    return n + e.substring(o);
  }, "replaceClose"), Jp = /* @__PURE__ */ s((e = GC) => {
    let t = e ? KC : () => String;
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
  wu.exports = Jp();
  wu.exports.createColors = Jp;
});

// ../node_modules/wrappy/wrappy.js
var tD = b((u6, eD) => {
  eD.exports = Qp;
  function Qp(e, t) {
    if (e && t) return Qp(e)(t);
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
  s(Qp, "wrappy");
});

// ../node_modules/once/once.js
var vs = b((c6, Su) => {
  var rD = tD();
  Su.exports = rD(bs);
  Su.exports.strict = rD(iD);
  bs.proto = bs(function() {
    Object.defineProperty(Function.prototype, "once", {
      value: /* @__PURE__ */ s(function() {
        return bs(this);
      }, "value"),
      configurable: !0
    }), Object.defineProperty(Function.prototype, "onceStrict", {
      value: /* @__PURE__ */ s(function() {
        return iD(this);
      }, "value"),
      configurable: !0
    });
  });
  function bs(e) {
    var t = /* @__PURE__ */ s(function() {
      return t.called ? t.value : (t.called = !0, t.value = e.apply(this, arguments));
    }, "f");
    return t.called = !1, t;
  }
  s(bs, "once");
  function iD(e) {
    var t = /* @__PURE__ */ s(function() {
      if (t.called)
        throw new Error(t.onceError);
      return t.called = !0, t.value = e.apply(this, arguments);
    }, "f"), r = e.name || "Function wrapped with `once`";
    return t.onceError = r + " shouldn't be called more than once", t.called = !1, t;
  }
  s(iD, "onceStrict");
});

// ../node_modules/end-of-stream/index.js
var Xr = b((f6, sD) => {
  var tx = vs(), rx = /* @__PURE__ */ s(function() {
  }, "noop"), ix = /* @__PURE__ */ s(function(e) {
    return e.setHeader && typeof e.abort == "function";
  }, "isRequest"), nx = /* @__PURE__ */ s(function(e) {
    return e.stdio && Array.isArray(e.stdio) && e.stdio.length === 3;
  }, "isChildProcess"), nD = /* @__PURE__ */ s(function(e, t, r) {
    if (typeof t == "function") return nD(e, null, t);
    t || (t = {}), r = tx(r || rx);
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
    return ix(e) ? (e.on("complete", c), e.on("abort", f), e.req ? E() : e.on("request", E)) : a && !i && (e.on("end", l), e.on("close", l)),
    nx(e) && e.on("exit", p), e.on("end", d), e.on("finish", c), t.error !== !1 && e.on("error", h), e.on("close", f), function() {
      u = !0, e.removeListener("complete", c), e.removeListener("abort", f), e.removeListener("request", E), e.req && e.req.removeListener("\
finish", c), e.removeListener("end", l), e.removeListener("close", l), e.removeListener("finish", c), e.removeListener("exit", p), e.removeListener(
      "end", d), e.removeListener("error", h), e.removeListener("close", f);
    };
  }, "eos");
  sD.exports = nD;
});

// ../node_modules/pump/index.js
var Au = b((p6, aD) => {
  var sx = vs(), ox = Xr(), Tu = x("fs"), Xi = /* @__PURE__ */ s(function() {
  }, "noop"), ax = /^v?\.0/.test(process.version), _s = /* @__PURE__ */ s(function(e) {
    return typeof e == "function";
  }, "isFn"), ux = /* @__PURE__ */ s(function(e) {
    return !ax || !Tu ? !1 : (e instanceof (Tu.ReadStream || Xi) || e instanceof (Tu.WriteStream || Xi)) && _s(e.close);
  }, "isFS"), lx = /* @__PURE__ */ s(function(e) {
    return e.setHeader && _s(e.abort);
  }, "isRequest"), cx = /* @__PURE__ */ s(function(e, t, r, i) {
    i = sx(i);
    var n = !1;
    e.on("close", function() {
      n = !0;
    }), ox(e, { readable: t, writable: r }, function(a) {
      if (a) return i(a);
      n = !0, i();
    });
    var o = !1;
    return function(a) {
      if (!n && !o) {
        if (o = !0, ux(e)) return e.close(Xi);
        if (lx(e)) return e.abort();
        if (_s(e.destroy)) return e.destroy();
        i(a || new Error("stream was destroyed"));
      }
    };
  }, "destroyer"), oD = /* @__PURE__ */ s(function(e) {
    e();
  }, "call"), dx = /* @__PURE__ */ s(function(e, t) {
    return e.pipe(t);
  }, "pipe"), fx = /* @__PURE__ */ s(function() {
    var e = Array.prototype.slice.call(arguments), t = _s(e[e.length - 1] || Xi) && e.pop() || Xi;
    if (Array.isArray(e[0]) && (e = e[0]), e.length < 2) throw new Error("pump requires two streams per minimum");
    var r, i = e.map(function(n, o) {
      var a = o < e.length - 1, u = o > 0;
      return cx(n, a, u, function(l) {
        r || (r = l), l && i.forEach(oD), !a && (i.forEach(oD), t(r));
      });
    });
    return e.reduce(dx);
  }, "pump");
  aD.exports = fx;
});

// ../node_modules/tar-fs/node_modules/chownr/chownr.js
var pD = b((m6, hD) => {
  "use strict";
  var ze = x("fs"), dr = x("path"), hx = ze.lchown ? "lchown" : "chown", px = ze.lchownSync ? "lchownSync" : "chownSync", lD = ze.lchown && !process.
  version.match(/v1[1-9]+\./) && !process.version.match(/v10\.[6-9]/), uD = /* @__PURE__ */ s((e, t, r) => {
    try {
      return ze[px](e, t, r);
    } catch (i) {
      if (i.code !== "ENOENT")
        throw i;
    }
  }, "lchownSync"), Dx = /* @__PURE__ */ s((e, t, r) => {
    try {
      return ze.chownSync(e, t, r);
    } catch (i) {
      if (i.code !== "ENOENT")
        throw i;
    }
  }, "chownSync"), mx = lD ? (e, t, r, i) => (n) => {
    !n || n.code !== "EISDIR" ? i(n) : ze.chown(e, t, r, i);
  } : (e, t, r, i) => i, Ru = lD ? (e, t, r) => {
    try {
      return uD(e, t, r);
    } catch (i) {
      if (i.code !== "EISDIR")
        throw i;
      Dx(e, t, r);
    }
  } : (e, t, r) => uD(e, t, r), gx = process.version, cD = /* @__PURE__ */ s((e, t, r) => ze.readdir(e, t, r), "readdir"), yx = /* @__PURE__ */ s(
  (e, t) => ze.readdirSync(e, t), "readdirSync");
  /^v4\./.test(gx) && (cD = /* @__PURE__ */ s((e, t, r) => ze.readdir(e, r), "readdir"));
  var ws = /* @__PURE__ */ s((e, t, r, i) => {
    ze[hx](e, t, r, mx(e, t, r, (n) => {
      i(n && n.code !== "ENOENT" ? n : null);
    }));
  }, "chown"), dD = /* @__PURE__ */ s((e, t, r, i, n) => {
    if (typeof t == "string")
      return ze.lstat(dr.resolve(e, t), (o, a) => {
        if (o)
          return n(o.code !== "ENOENT" ? o : null);
        a.name = t, dD(e, a, r, i, n);
      });
    if (t.isDirectory())
      ku(dr.resolve(e, t.name), r, i, (o) => {
        if (o)
          return n(o);
        let a = dr.resolve(e, t.name);
        ws(a, r, i, n);
      });
    else {
      let o = dr.resolve(e, t.name);
      ws(o, r, i, n);
    }
  }, "chownrKid"), ku = /* @__PURE__ */ s((e, t, r, i) => {
    cD(e, { withFileTypes: !0 }, (n, o) => {
      if (n) {
        if (n.code === "ENOENT")
          return i();
        if (n.code !== "ENOTDIR" && n.code !== "ENOTSUP")
          return i(n);
      }
      if (n || !o.length)
        return ws(e, t, r, i);
      let a = o.length, u = null, l = /* @__PURE__ */ s((c) => {
        if (!u) {
          if (c)
            return i(u = c);
          if (--a === 0)
            return ws(e, t, r, i);
        }
      }, "then");
      o.forEach((c) => dD(e, c, t, r, l));
    });
  }, "chownr"), bx = /* @__PURE__ */ s((e, t, r, i) => {
    if (typeof t == "string")
      try {
        let n = ze.lstatSync(dr.resolve(e, t));
        n.name = t, t = n;
      } catch (n) {
        if (n.code === "ENOENT")
          return;
        throw n;
      }
    t.isDirectory() && fD(dr.resolve(e, t.name), r, i), Ru(dr.resolve(e, t.name), r, i);
  }, "chownrKidSync"), fD = /* @__PURE__ */ s((e, t, r) => {
    let i;
    try {
      i = yx(e, { withFileTypes: !0 });
    } catch (n) {
      if (n.code === "ENOENT")
        return;
      if (n.code === "ENOTDIR" || n.code === "ENOTSUP")
        return Ru(e, t, r);
      throw n;
    }
    return i && i.length && i.forEach((n) => bx(e, n, t, r)), Ru(e, t, r);
  }, "chownrSync");
  hD.exports = ku;
  ku.sync = fD;
});

// ../node_modules/readable-stream/lib/internal/streams/stream.js
var Ou = b((y6, DD) => {
  DD.exports = x("stream");
});

// ../node_modules/readable-stream/lib/internal/streams/buffer_list.js
var _D = b((b6, vD) => {
  "use strict";
  function mD(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      t && (i = i.filter(function(n) {
        return Object.getOwnPropertyDescriptor(e, n).enumerable;
      })), r.push.apply(r, i);
    }
    return r;
  }
  s(mD, "ownKeys");
  function gD(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t] != null ? arguments[t] : {};
      t % 2 ? mD(Object(r), !0).forEach(function(i) {
        vx(e, i, r[i]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : mD(Object(r)).forEach(function(i) {
        Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(r, i));
      });
    }
    return e;
  }
  s(gD, "_objectSpread");
  function vx(e, t, r) {
    return t = bD(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
  }
  s(vx, "_defineProperty");
  function _x(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  s(_x, "_classCallCheck");
  function yD(e, t) {
    for (var r = 0; r < t.length; r++) {
      var i = t[r];
      i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, bD(i.key), i);
    }
  }
  s(yD, "_defineProperties");
  function wx(e, t, r) {
    return t && yD(e.prototype, t), r && yD(e, r), Object.defineProperty(e, "prototype", { writable: !1 }), e;
  }
  s(wx, "_createClass");
  function bD(e) {
    var t = Ex(e, "string");
    return typeof t == "symbol" ? t : String(t);
  }
  s(bD, "_toPropertyKey");
  function Ex(e, t) {
    if (typeof e != "object" || e === null) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
      var i = r.call(e, t || "default");
      if (typeof i != "object") return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(e);
  }
  s(Ex, "_toPrimitive");
  var Cx = x("buffer"), Es = Cx.Buffer, xx = x("util"), Bu = xx.inspect, Fx = Bu && Bu.custom || "inspect";
  function Sx(e, t, r) {
    Es.prototype.copy.call(e, t, r);
  }
  s(Sx, "copyBuffer");
  vD.exports = /* @__PURE__ */ function() {
    function e() {
      _x(this, e), this.head = null, this.tail = null, this.length = 0;
    }
    return s(e, "BufferList"), wx(e, [{
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
        if (this.length === 0) return Es.alloc(0);
        for (var i = Es.allocUnsafe(r >>> 0), n = this.head, o = 0; n; )
          Sx(n.data, i, o), o += n.data.length, n = n.next;
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
        var i = Es.allocUnsafe(r), n = this.head, o = 1;
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
      key: Fx,
      value: /* @__PURE__ */ s(function(r, i) {
        return Bu(this, gD(gD({}, i), {}, {
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
var Iu = b((_6, ED) => {
  "use strict";
  function Tx(e, t) {
    var r = this, i = this._readableState && this._readableState.destroyed, n = this._writableState && this._writableState.destroyed;
    return i || n ? (t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, process.
    nextTick(Pu, this, e)) : process.nextTick(Pu, this, e)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState &&
    (this._writableState.destroyed = !0), this._destroy(e || null, function(o) {
      !t && o ? r._writableState ? r._writableState.errorEmitted ? process.nextTick(Cs, r) : (r._writableState.errorEmitted = !0, process.nextTick(
      wD, r, o)) : process.nextTick(wD, r, o) : t ? (process.nextTick(Cs, r), t(o)) : process.nextTick(Cs, r);
    }), this);
  }
  s(Tx, "destroy");
  function wD(e, t) {
    Pu(e, t), Cs(e);
  }
  s(wD, "emitErrorAndCloseNT");
  function Cs(e) {
    e._writableState && !e._writableState.emitClose || e._readableState && !e._readableState.emitClose || e.emit("close");
  }
  s(Cs, "emitCloseNT");
  function Ax() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.
    endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending =
    !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted =
    !1);
  }
  s(Ax, "undestroy");
  function Pu(e, t) {
    e.emit("error", t);
  }
  s(Pu, "emitErrorNT");
  function Rx(e, t) {
    var r = e._readableState, i = e._writableState;
    r && r.autoDestroy || i && i.autoDestroy ? e.destroy(t) : e.emit("error", t);
  }
  s(Rx, "errorOrDestroy");
  ED.exports = {
    destroy: Tx,
    undestroy: Ax,
    errorOrDestroy: Rx
  };
});

// ../node_modules/readable-stream/errors.js
var Kt = b((E6, FD) => {
  "use strict";
  var xD = {};
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
    n.prototype.name = r.name, n.prototype.code = e, xD[e] = n;
  }
  s(Ge, "createErrorType");
  function CD(e, t) {
    if (Array.isArray(e)) {
      let r = e.length;
      return e = e.map((i) => String(i)), r > 2 ? `one of ${t} ${e.slice(0, r - 1).join(", ")}, or ` + e[r - 1] : r === 2 ? `one of ${t} ${e[0]}\
 or ${e[1]}` : `of ${t} ${e[0]}`;
    } else
      return `of ${t} ${String(e)}`;
  }
  s(CD, "oneOf");
  function kx(e, t, r) {
    return e.substr(!r || r < 0 ? 0 : +r, t.length) === t;
  }
  s(kx, "startsWith");
  function Ox(e, t, r) {
    return (r === void 0 || r > e.length) && (r = e.length), e.substring(r - t.length, r) === t;
  }
  s(Ox, "endsWith");
  function Bx(e, t, r) {
    return typeof r != "number" && (r = 0), r + t.length > e.length ? !1 : e.indexOf(t, r) !== -1;
  }
  s(Bx, "includes");
  Ge("ERR_INVALID_OPT_VALUE", function(e, t) {
    return 'The value "' + t + '" is invalid for option "' + e + '"';
  }, TypeError);
  Ge("ERR_INVALID_ARG_TYPE", function(e, t, r) {
    let i;
    typeof t == "string" && kx(t, "not ") ? (i = "must not be", t = t.replace(/^not /, "")) : i = "must be";
    let n;
    if (Ox(e, " argument"))
      n = `The ${e} ${i} ${CD(t, "type")}`;
    else {
      let o = Bx(e, ".") ? "property" : "argument";
      n = `The "${e}" ${o} ${i} ${CD(t, "type")}`;
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
  FD.exports.codes = xD;
});

// ../node_modules/readable-stream/lib/internal/streams/state.js
var Mu = b((x6, SD) => {
  "use strict";
  var Px = Kt().codes.ERR_INVALID_OPT_VALUE;
  function Ix(e, t, r) {
    return e.highWaterMark != null ? e.highWaterMark : t ? e[r] : null;
  }
  s(Ix, "highWaterMarkFrom");
  function Mx(e, t, r, i) {
    var n = Ix(t, i, r);
    if (n != null) {
      if (!(isFinite(n) && Math.floor(n) === n) || n < 0) {
        var o = i ? r : "highWaterMark";
        throw new Px(o, n);
      }
      return Math.floor(n);
    }
    return e.objectMode ? 16 : 16 * 1024;
  }
  s(Mx, "getHighWaterMark");
  SD.exports = {
    getHighWaterMark: Mx
  };
});

// ../node_modules/inherits/inherits_browser.js
var TD = b((S6, ju) => {
  typeof Object.create == "function" ? ju.exports = /* @__PURE__ */ s(function(t, r) {
    r && (t.super_ = r, t.prototype = Object.create(r.prototype, {
      constructor: {
        value: t,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  }, "inherits") : ju.exports = /* @__PURE__ */ s(function(t, r) {
    if (r) {
      t.super_ = r;
      var i = /* @__PURE__ */ s(function() {
      }, "TempCtor");
      i.prototype = r.prototype, t.prototype = new i(), t.prototype.constructor = t;
    }
  }, "inherits");
});

// ../node_modules/inherits/inherits.js
var oe = b((A6, Lu) => {
  try {
    if (qu = x("util"), typeof qu.inherits != "function") throw "";
    Lu.exports = qu.inherits;
  } catch {
    Lu.exports = TD();
  }
  var qu;
});

// ../node_modules/util-deprecate/node.js
var Qi = b((R6, AD) => {
  AD.exports = x("util").deprecate;
});

// ../node_modules/readable-stream/lib/_stream_writable.js
var $u = b((k6, ID) => {
  "use strict";
  ID.exports = _e;
  function kD(e) {
    var t = this;
    this.next = null, this.entry = null, this.finish = function() {
      lF(t, e);
    };
  }
  s(kD, "CorkedRequest");
  var Qr;
  _e.WritableState = tn;
  var jx = {
    deprecate: Qi()
  }, OD = Ou(), Fs = x("buffer").Buffer, qx = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ? self : {}).
  Uint8Array || function() {
  };
  function Lx(e) {
    return Fs.from(e);
  }
  s(Lx, "_uint8ArrayToBuffer");
  function Nx(e) {
    return Fs.isBuffer(e) || e instanceof qx;
  }
  s(Nx, "_isUint8Array");
  var Uu = Iu(), Ux = Mu(), $x = Ux.getHighWaterMark, Yt = Kt().codes, Wx = Yt.ERR_INVALID_ARG_TYPE, Hx = Yt.ERR_METHOD_NOT_IMPLEMENTED, Vx = Yt.
  ERR_MULTIPLE_CALLBACK, Zx = Yt.ERR_STREAM_CANNOT_PIPE, zx = Yt.ERR_STREAM_DESTROYED, Gx = Yt.ERR_STREAM_NULL_VALUES, Kx = Yt.ERR_STREAM_WRITE_AFTER_END,
  Yx = Yt.ERR_UNKNOWN_ENCODING, ei = Uu.errorOrDestroy;
  oe()(_e, OD);
  function Jx() {
  }
  s(Jx, "nop");
  function tn(e, t, r) {
    Qr = Qr || fr(), e = e || {}, typeof r != "boolean" && (r = t instanceof Qr), this.objectMode = !!e.objectMode, r && (this.objectMode = this.
    objectMode || !!e.writableObjectMode), this.highWaterMark = $x(this, e, "writableHighWaterMark", r), this.finalCalled = !1, this.needDrain =
    !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var i = e.decodeStrings === !1;
    this.decodeStrings = !i, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync =
    !0, this.bufferProcessing = !1, this.onwrite = function(n) {
      nF(t, n);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished =
    !1, this.errorEmitted = !1, this.emitClose = e.emitClose !== !1, this.autoDestroy = !!e.autoDestroy, this.bufferedRequestCount = 0, this.
    corkedRequestsFree = new kD(this);
  }
  s(tn, "WritableState");
  tn.prototype.getBuffer = /* @__PURE__ */ s(function() {
    for (var t = this.bufferedRequest, r = []; t; )
      r.push(t), t = t.next;
    return r;
  }, "getBuffer");
  (function() {
    try {
      Object.defineProperty(tn.prototype, "buffer", {
        get: jx.deprecate(/* @__PURE__ */ s(function() {
          return this.getBuffer();
        }, "writableStateBufferGetter"), "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  })();
  var xs;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (xs = Function.prototype[Symbol.
  hasInstance], Object.defineProperty(_e, Symbol.hasInstance, {
    value: /* @__PURE__ */ s(function(t) {
      return xs.call(this, t) ? !0 : this !== _e ? !1 : t && t._writableState instanceof tn;
    }, "value")
  })) : xs = /* @__PURE__ */ s(function(t) {
    return t instanceof this;
  }, "realHasInstance");
  function _e(e) {
    Qr = Qr || fr();
    var t = this instanceof Qr;
    if (!t && !xs.call(_e, this)) return new _e(e);
    this._writableState = new tn(e, this, t), this.writable = !0, e && (typeof e.write == "function" && (this._write = e.write), typeof e.writev ==
    "function" && (this._writev = e.writev), typeof e.destroy == "function" && (this._destroy = e.destroy), typeof e.final == "function" && (this.
    _final = e.final)), OD.call(this);
  }
  s(_e, "Writable");
  _e.prototype.pipe = function() {
    ei(this, new Zx());
  };
  function Xx(e, t) {
    var r = new Kx();
    ei(e, r), process.nextTick(t, r);
  }
  s(Xx, "writeAfterEnd");
  function Qx(e, t, r, i) {
    var n;
    return r === null ? n = new Gx() : typeof r != "string" && !t.objectMode && (n = new Wx("chunk", ["string", "Buffer"], r)), n ? (ei(e, n),
    process.nextTick(i, n), !1) : !0;
  }
  s(Qx, "validChunk");
  _e.prototype.write = function(e, t, r) {
    var i = this._writableState, n = !1, o = !i.objectMode && Nx(e);
    return o && !Fs.isBuffer(e) && (e = Lx(e)), typeof t == "function" && (r = t, t = null), o ? t = "buffer" : t || (t = i.defaultEncoding),
    typeof r != "function" && (r = Jx), i.ending ? Xx(this, r) : (o || Qx(this, i, e, r)) && (i.pendingcb++, n = tF(this, i, o, e, t, r)), n;
  };
  _e.prototype.cork = function() {
    this._writableState.corked++;
  };
  _e.prototype.uncork = function() {
    var e = this._writableState;
    e.corked && (e.corked--, !e.writing && !e.corked && !e.bufferProcessing && e.bufferedRequest && BD(this, e));
  };
  _e.prototype.setDefaultEncoding = /* @__PURE__ */ s(function(t) {
    if (typeof t == "string" && (t = t.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "\
utf-16le", "raw"].indexOf((t + "").toLowerCase()) > -1)) throw new Yx(t);
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
  function eF(e, t, r) {
    return !e.objectMode && e.decodeStrings !== !1 && typeof t == "string" && (t = Fs.from(t, r)), t;
  }
  s(eF, "decodeChunk");
  Object.defineProperty(_e.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  function tF(e, t, r, i, n, o) {
    if (!r) {
      var a = eF(t, i, n);
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
      Nu(e, t, !1, u, i, n, o);
    return l;
  }
  s(tF, "writeOrBuffer");
  function Nu(e, t, r, i, n, o, a) {
    t.writelen = i, t.writecb = a, t.writing = !0, t.sync = !0, t.destroyed ? t.onwrite(new zx("write")) : r ? e._writev(n, t.onwrite) : e._write(
    n, o, t.onwrite), t.sync = !1;
  }
  s(Nu, "doWrite");
  function rF(e, t, r, i, n) {
    --t.pendingcb, r ? (process.nextTick(n, i), process.nextTick(en, e, t), e._writableState.errorEmitted = !0, ei(e, i)) : (n(i), e._writableState.
    errorEmitted = !0, ei(e, i), en(e, t));
  }
  s(rF, "onwriteError");
  function iF(e) {
    e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
  }
  s(iF, "onwriteStateUpdate");
  function nF(e, t) {
    var r = e._writableState, i = r.sync, n = r.writecb;
    if (typeof n != "function") throw new Vx();
    if (iF(r), t) rF(e, r, i, t, n);
    else {
      var o = PD(r) || e.destroyed;
      !o && !r.corked && !r.bufferProcessing && r.bufferedRequest && BD(e, r), i ? process.nextTick(RD, e, r, o, n) : RD(e, r, o, n);
    }
  }
  s(nF, "onwrite");
  function RD(e, t, r, i) {
    r || sF(e, t), t.pendingcb--, i(), en(e, t);
  }
  s(RD, "afterWrite");
  function sF(e, t) {
    t.length === 0 && t.needDrain && (t.needDrain = !1, e.emit("drain"));
  }
  s(sF, "onwriteDrain");
  function BD(e, t) {
    t.bufferProcessing = !0;
    var r = t.bufferedRequest;
    if (e._writev && r && r.next) {
      var i = t.bufferedRequestCount, n = new Array(i), o = t.corkedRequestsFree;
      o.entry = r;
      for (var a = 0, u = !0; r; )
        n[a] = r, r.isBuf || (u = !1), r = r.next, a += 1;
      n.allBuffers = u, Nu(e, t, !0, t.length, n, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree =
      o.next, o.next = null) : t.corkedRequestsFree = new kD(t), t.bufferedRequestCount = 0;
    } else {
      for (; r; ) {
        var l = r.chunk, c = r.encoding, d = r.callback, p = t.objectMode ? 1 : l.length;
        if (Nu(e, t, !1, p, l, c, d), r = r.next, t.bufferedRequestCount--, t.writing)
          break;
      }
      r === null && (t.lastBufferedRequest = null);
    }
    t.bufferedRequest = r, t.bufferProcessing = !1;
  }
  s(BD, "clearBuffer");
  _e.prototype._write = function(e, t, r) {
    r(new Hx("_write()"));
  };
  _e.prototype._writev = null;
  _e.prototype.end = function(e, t, r) {
    var i = this._writableState;
    return typeof e == "function" ? (r = e, e = null, t = null) : typeof t == "function" && (r = t, t = null), e != null && this.write(e, t),
    i.corked && (i.corked = 1, this.uncork()), i.ending || uF(this, i, r), this;
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
  function PD(e) {
    return e.ending && e.length === 0 && e.bufferedRequest === null && !e.finished && !e.writing;
  }
  s(PD, "needFinish");
  function oF(e, t) {
    e._final(function(r) {
      t.pendingcb--, r && ei(e, r), t.prefinished = !0, e.emit("prefinish"), en(e, t);
    });
  }
  s(oF, "callFinal");
  function aF(e, t) {
    !t.prefinished && !t.finalCalled && (typeof e._final == "function" && !t.destroyed ? (t.pendingcb++, t.finalCalled = !0, process.nextTick(
    oF, e, t)) : (t.prefinished = !0, e.emit("prefinish")));
  }
  s(aF, "prefinish");
  function en(e, t) {
    var r = PD(t);
    if (r && (aF(e, t), t.pendingcb === 0 && (t.finished = !0, e.emit("finish"), t.autoDestroy))) {
      var i = e._readableState;
      (!i || i.autoDestroy && i.endEmitted) && e.destroy();
    }
    return r;
  }
  s(en, "finishMaybe");
  function uF(e, t, r) {
    t.ending = !0, en(e, t), r && (t.finished ? process.nextTick(r) : e.once("finish", r)), t.ended = !0, e.writable = !1;
  }
  s(uF, "endWritable");
  function lF(e, t, r) {
    var i = e.entry;
    for (e.entry = null; i; ) {
      var n = i.callback;
      t.pendingcb--, n(r), i = i.next;
    }
    t.corkedRequestsFree.next = e;
  }
  s(lF, "onCorkedFinish");
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
  _e.prototype.destroy = Uu.destroy;
  _e.prototype._undestroy = Uu.undestroy;
  _e.prototype._destroy = function(e, t) {
    t(e);
  };
});

// ../node_modules/readable-stream/lib/_stream_duplex.js
var fr = b((B6, jD) => {
  "use strict";
  var cF = Object.keys || function(e) {
    var t = [];
    for (var r in e) t.push(r);
    return t;
  };
  jD.exports = ht;
  var MD = Vu(), Hu = $u();
  oe()(ht, MD);
  for (Wu = cF(Hu.prototype), Ss = 0; Ss < Wu.length; Ss++)
    Ts = Wu[Ss], ht.prototype[Ts] || (ht.prototype[Ts] = Hu.prototype[Ts]);
  var Wu, Ts, Ss;
  function ht(e) {
    if (!(this instanceof ht)) return new ht(e);
    MD.call(this, e), Hu.call(this, e), this.allowHalfOpen = !0, e && (e.readable === !1 && (this.readable = !1), e.writable === !1 && (this.
    writable = !1), e.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", dF)));
  }
  s(ht, "Duplex");
  Object.defineProperty(ht.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  Object.defineProperty(ht.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState && this._writableState.getBuffer();
    }, "get")
  });
  Object.defineProperty(ht.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.length;
    }, "get")
  });
  function dF() {
    this._writableState.ended || process.nextTick(fF, this);
  }
  s(dF, "onend");
  function fF(e) {
    e.end();
  }
  s(fF, "onEndNT");
  Object.defineProperty(ht.prototype, "destroyed", {
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
var As = b((I6, ND) => {
  "use strict";
  var qD = Kt().codes.ERR_STREAM_PREMATURE_CLOSE;
  function hF(e) {
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
  s(hF, "once");
  function pF() {
  }
  s(pF, "noop");
  function DF(e) {
    return e.setHeader && typeof e.abort == "function";
  }
  s(DF, "isRequest");
  function LD(e, t, r) {
    if (typeof t == "function") return LD(e, null, t);
    t || (t = {}), r = hF(r || pF);
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
        return (!e._readableState || !e._readableState.ended) && (g = new qD()), r.call(e, g);
      if (n && !a)
        return (!e._writableState || !e._writableState.ended) && (g = new qD()), r.call(e, g);
    }, "onclose"), h = /* @__PURE__ */ s(function() {
      e.req.on("finish", u);
    }, "onrequest");
    return DF(e) ? (e.on("complete", u), e.on("abort", p), e.req ? h() : e.on("request", h)) : n && !e._writableState && (e.on("end", o), e.
    on("close", o)), e.on("end", c), e.on("finish", u), t.error !== !1 && e.on("error", d), e.on("close", p), function() {
      e.removeListener("complete", u), e.removeListener("abort", p), e.removeListener("request", h), e.req && e.req.removeListener("finish",
      u), e.removeListener("end", o), e.removeListener("close", o), e.removeListener("finish", u), e.removeListener("end", c), e.removeListener(
      "error", d), e.removeListener("close", p);
    };
  }
  s(LD, "eos");
  ND.exports = LD;
});

// ../node_modules/readable-stream/lib/internal/streams/async_iterator.js
var $D = b((j6, UD) => {
  "use strict";
  var Rs;
  function Jt(e, t, r) {
    return t = mF(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
  }
  s(Jt, "_defineProperty");
  function mF(e) {
    var t = gF(e, "string");
    return typeof t == "symbol" ? t : String(t);
  }
  s(mF, "_toPropertyKey");
  function gF(e, t) {
    if (typeof e != "object" || e === null) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
      var i = r.call(e, t || "default");
      if (typeof i != "object") return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(e);
  }
  s(gF, "_toPrimitive");
  var yF = As(), Xt = Symbol("lastResolve"), hr = Symbol("lastReject"), rn = Symbol("error"), ks = Symbol("ended"), pr = Symbol("lastPromise"),
  Zu = Symbol("handlePromise"), Dr = Symbol("stream");
  function Qt(e, t) {
    return {
      value: e,
      done: t
    };
  }
  s(Qt, "createIterResult");
  function bF(e) {
    var t = e[Xt];
    if (t !== null) {
      var r = e[Dr].read();
      r !== null && (e[pr] = null, e[Xt] = null, e[hr] = null, t(Qt(r, !1)));
    }
  }
  s(bF, "readAndResolve");
  function vF(e) {
    process.nextTick(bF, e);
  }
  s(vF, "onReadable");
  function _F(e, t) {
    return function(r, i) {
      e.then(function() {
        if (t[ks]) {
          r(Qt(void 0, !0));
          return;
        }
        t[Zu](r, i);
      }, i);
    };
  }
  s(_F, "wrapForNext");
  var wF = Object.getPrototypeOf(function() {
  }), EF = Object.setPrototypeOf((Rs = {
    get stream() {
      return this[Dr];
    },
    next: /* @__PURE__ */ s(function() {
      var t = this, r = this[rn];
      if (r !== null)
        return Promise.reject(r);
      if (this[ks])
        return Promise.resolve(Qt(void 0, !0));
      if (this[Dr].destroyed)
        return new Promise(function(a, u) {
          process.nextTick(function() {
            t[rn] ? u(t[rn]) : a(Qt(void 0, !0));
          });
        });
      var i = this[pr], n;
      if (i)
        n = new Promise(_F(i, this));
      else {
        var o = this[Dr].read();
        if (o !== null)
          return Promise.resolve(Qt(o, !1));
        n = new Promise(this[Zu]);
      }
      return this[pr] = n, n;
    }, "next")
  }, Jt(Rs, Symbol.asyncIterator, function() {
    return this;
  }), Jt(Rs, "return", /* @__PURE__ */ s(function() {
    var t = this;
    return new Promise(function(r, i) {
      t[Dr].destroy(null, function(n) {
        if (n) {
          i(n);
          return;
        }
        r(Qt(void 0, !0));
      });
    });
  }, "_return")), Rs), wF), CF = /* @__PURE__ */ s(function(t) {
    var r, i = Object.create(EF, (r = {}, Jt(r, Dr, {
      value: t,
      writable: !0
    }), Jt(r, Xt, {
      value: null,
      writable: !0
    }), Jt(r, hr, {
      value: null,
      writable: !0
    }), Jt(r, rn, {
      value: null,
      writable: !0
    }), Jt(r, ks, {
      value: t._readableState.endEmitted,
      writable: !0
    }), Jt(r, Zu, {
      value: /* @__PURE__ */ s(function(o, a) {
        var u = i[Dr].read();
        u ? (i[pr] = null, i[Xt] = null, i[hr] = null, o(Qt(u, !1))) : (i[Xt] = o, i[hr] = a);
      }, "value"),
      writable: !0
    }), r));
    return i[pr] = null, yF(t, function(n) {
      if (n && n.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var o = i[hr];
        o !== null && (i[pr] = null, i[Xt] = null, i[hr] = null, o(n)), i[rn] = n;
        return;
      }
      var a = i[Xt];
      a !== null && (i[pr] = null, i[Xt] = null, i[hr] = null, a(Qt(void 0, !0))), i[ks] = !0;
    }), t.on("readable", vF.bind(null, i)), i;
  }, "createReadableStreamAsyncIterator");
  UD.exports = CF;
});

// ../node_modules/readable-stream/lib/internal/streams/from.js
var ZD = b((L6, VD) => {
  "use strict";
  function WD(e, t, r, i, n, o, a) {
    try {
      var u = e[o](a), l = u.value;
    } catch (c) {
      r(c);
      return;
    }
    u.done ? t(l) : Promise.resolve(l).then(i, n);
  }
  s(WD, "asyncGeneratorStep");
  function xF(e) {
    return function() {
      var t = this, r = arguments;
      return new Promise(function(i, n) {
        var o = e.apply(t, r);
        function a(l) {
          WD(o, i, n, a, u, "next", l);
        }
        s(a, "_next");
        function u(l) {
          WD(o, i, n, a, u, "throw", l);
        }
        s(u, "_throw"), a(void 0);
      });
    };
  }
  s(xF, "_asyncToGenerator");
  function HD(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      t && (i = i.filter(function(n) {
        return Object.getOwnPropertyDescriptor(e, n).enumerable;
      })), r.push.apply(r, i);
    }
    return r;
  }
  s(HD, "ownKeys");
  function FF(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = arguments[t] != null ? arguments[t] : {};
      t % 2 ? HD(Object(r), !0).forEach(function(i) {
        SF(e, i, r[i]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : HD(Object(r)).forEach(function(i) {
        Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(r, i));
      });
    }
    return e;
  }
  s(FF, "_objectSpread");
  function SF(e, t, r) {
    return t = TF(t), t in e ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = r, e;
  }
  s(SF, "_defineProperty");
  function TF(e) {
    var t = AF(e, "string");
    return typeof t == "symbol" ? t : String(t);
  }
  s(TF, "_toPropertyKey");
  function AF(e, t) {
    if (typeof e != "object" || e === null) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
      var i = r.call(e, t || "default");
      if (typeof i != "object") return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(e);
  }
  s(AF, "_toPrimitive");
  var RF = Kt().codes.ERR_INVALID_ARG_TYPE;
  function kF(e, t, r) {
    var i;
    if (t && typeof t.next == "function")
      i = t;
    else if (t && t[Symbol.asyncIterator]) i = t[Symbol.asyncIterator]();
    else if (t && t[Symbol.iterator]) i = t[Symbol.iterator]();
    else throw new RF("iterable", ["Iterable"], t);
    var n = new e(FF({
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
      return u = xF(function* () {
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
  s(kF, "from");
  VD.exports = kF;
});

// ../node_modules/readable-stream/lib/_stream_readable.js
var Vu = b(($6, rm) => {
  "use strict";
  rm.exports = K;
  var ti;
  K.ReadableState = YD;
  var U6 = x("events").EventEmitter, KD = /* @__PURE__ */ s(function(t, r) {
    return t.listeners(r).length;
  }, "EElistenerCount"), sn = Ou(), Os = x("buffer").Buffer, OF = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self <
  "u" ? self : {}).Uint8Array || function() {
  };
  function BF(e) {
    return Os.from(e);
  }
  s(BF, "_uint8ArrayToBuffer");
  function PF(e) {
    return Os.isBuffer(e) || e instanceof OF;
  }
  s(PF, "_isUint8Array");
  var zu = x("util"), Z;
  zu && zu.debuglog ? Z = zu.debuglog("stream") : Z = /* @__PURE__ */ s(function() {
  }, "debug");
  var IF = _D(), el = Iu(), MF = Mu(), jF = MF.getHighWaterMark, Bs = Kt().codes, qF = Bs.ERR_INVALID_ARG_TYPE, LF = Bs.ERR_STREAM_PUSH_AFTER_EOF,
  NF = Bs.ERR_METHOD_NOT_IMPLEMENTED, UF = Bs.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, ri, Gu, Ku;
  oe()(K, sn);
  var nn = el.errorOrDestroy, Yu = ["error", "close", "destroy", "pause", "resume"];
  function $F(e, t, r) {
    if (typeof e.prependListener == "function") return e.prependListener(t, r);
    !e._events || !e._events[t] ? e.on(t, r) : Array.isArray(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]];
  }
  s($F, "prependListener");
  function YD(e, t, r) {
    ti = ti || fr(), e = e || {}, typeof r != "boolean" && (r = t instanceof ti), this.objectMode = !!e.objectMode, r && (this.objectMode = this.
    objectMode || !!e.readableObjectMode), this.highWaterMark = jF(this, e, "readableHighWaterMark", r), this.buffer = new IF(), this.length =
    0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0,
    this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose =
    e.emitClose !== !1, this.autoDestroy = !!e.autoDestroy, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain =
    0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (ri || (ri = x("string_decoder/").StringDecoder), this.
    decoder = new ri(e.encoding), this.encoding = e.encoding);
  }
  s(YD, "ReadableState");
  function K(e) {
    if (ti = ti || fr(), !(this instanceof K)) return new K(e);
    var t = this instanceof ti;
    this._readableState = new YD(e, this, t), this.readable = !0, e && (typeof e.read == "function" && (this._read = e.read), typeof e.destroy ==
    "function" && (this._destroy = e.destroy)), sn.call(this);
  }
  s(K, "Readable");
  Object.defineProperty(K.prototype, "destroyed", {
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
  K.prototype.destroy = el.destroy;
  K.prototype._undestroy = el.undestroy;
  K.prototype._destroy = function(e, t) {
    t(e);
  };
  K.prototype.push = function(e, t) {
    var r = this._readableState, i;
    return r.objectMode ? i = !0 : typeof e == "string" && (t = t || r.defaultEncoding, t !== r.encoding && (e = Os.from(e, t), t = ""), i =
    !0), JD(this, e, t, !1, i);
  };
  K.prototype.unshift = function(e) {
    return JD(this, e, null, !0, !1);
  };
  function JD(e, t, r, i, n) {
    Z("readableAddChunk", t);
    var o = e._readableState;
    if (t === null)
      o.reading = !1, VF(e, o);
    else {
      var a;
      if (n || (a = WF(o, t)), a)
        nn(e, a);
      else if (o.objectMode || t && t.length > 0)
        if (typeof t != "string" && !o.objectMode && Object.getPrototypeOf(t) !== Os.prototype && (t = BF(t)), i)
          o.endEmitted ? nn(e, new UF()) : Ju(e, o, t, !0);
        else if (o.ended)
          nn(e, new LF());
        else {
          if (o.destroyed)
            return !1;
          o.reading = !1, o.decoder && !r ? (t = o.decoder.write(t), o.objectMode || t.length !== 0 ? Ju(e, o, t, !1) : Qu(e, o)) : Ju(e, o,
          t, !1);
        }
      else i || (o.reading = !1, Qu(e, o));
    }
    return !o.ended && (o.length < o.highWaterMark || o.length === 0);
  }
  s(JD, "readableAddChunk");
  function Ju(e, t, r, i) {
    t.flowing && t.length === 0 && !t.sync ? (t.awaitDrain = 0, e.emit("data", r)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.
    unshift(r) : t.buffer.push(r), t.needReadable && Ps(e)), Qu(e, t);
  }
  s(Ju, "addChunk");
  function WF(e, t) {
    var r;
    return !PF(t) && typeof t != "string" && t !== void 0 && !e.objectMode && (r = new qF("chunk", ["string", "Buffer", "Uint8Array"], t)), r;
  }
  s(WF, "chunkInvalid");
  K.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  };
  K.prototype.setEncoding = function(e) {
    ri || (ri = x("string_decoder/").StringDecoder);
    var t = new ri(e);
    this._readableState.decoder = t, this._readableState.encoding = this._readableState.decoder.encoding;
    for (var r = this._readableState.buffer.head, i = ""; r !== null; )
      i += t.write(r.data), r = r.next;
    return this._readableState.buffer.clear(), i !== "" && this._readableState.buffer.push(i), this._readableState.length = i.length, this;
  };
  var zD = 1073741824;
  function HF(e) {
    return e >= zD ? e = zD : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
  }
  s(HF, "computeNewHighWaterMark");
  function GD(e, t) {
    return e <= 0 || t.length === 0 && t.ended ? 0 : t.objectMode ? 1 : e !== e ? t.flowing && t.length ? t.buffer.head.data.length : t.length :
    (e > t.highWaterMark && (t.highWaterMark = HF(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
  }
  s(GD, "howMuchToRead");
  K.prototype.read = function(e) {
    Z("read", e), e = parseInt(e, 10);
    var t = this._readableState, r = e;
    if (e !== 0 && (t.emittedReadable = !1), e === 0 && t.needReadable && ((t.highWaterMark !== 0 ? t.length >= t.highWaterMark : t.length >
    0) || t.ended))
      return Z("read: emitReadable", t.length, t.ended), t.length === 0 && t.ended ? Xu(this) : Ps(this), null;
    if (e = GD(e, t), e === 0 && t.ended)
      return t.length === 0 && Xu(this), null;
    var i = t.needReadable;
    Z("need readable", i), (t.length === 0 || t.length - e < t.highWaterMark) && (i = !0, Z("length less than watermark", i)), t.ended || t.
    reading ? (i = !1, Z("reading or ended", i)) : i && (Z("do read"), t.reading = !0, t.sync = !0, t.length === 0 && (t.needReadable = !0),
    this._read(t.highWaterMark), t.sync = !1, t.reading || (e = GD(r, t)));
    var n;
    return e > 0 ? n = em(e, t) : n = null, n === null ? (t.needReadable = t.length <= t.highWaterMark, e = 0) : (t.length -= e, t.awaitDrain =
    0), t.length === 0 && (t.ended || (t.needReadable = !0), r !== e && t.ended && Xu(this)), n !== null && this.emit("data", n), n;
  };
  function VF(e, t) {
    if (Z("onEofChunk"), !t.ended) {
      if (t.decoder) {
        var r = t.decoder.end();
        r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
      }
      t.ended = !0, t.sync ? Ps(e) : (t.needReadable = !1, t.emittedReadable || (t.emittedReadable = !0, XD(e)));
    }
  }
  s(VF, "onEofChunk");
  function Ps(e) {
    var t = e._readableState;
    Z("emitReadable", t.needReadable, t.emittedReadable), t.needReadable = !1, t.emittedReadable || (Z("emitReadable", t.flowing), t.emittedReadable =
    !0, process.nextTick(XD, e));
  }
  s(Ps, "emitReadable");
  function XD(e) {
    var t = e._readableState;
    Z("emitReadable_", t.destroyed, t.length, t.ended), !t.destroyed && (t.length || t.ended) && (e.emit("readable"), t.emittedReadable = !1),
    t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark, tl(e);
  }
  s(XD, "emitReadable_");
  function Qu(e, t) {
    t.readingMore || (t.readingMore = !0, process.nextTick(ZF, e, t));
  }
  s(Qu, "maybeReadMore");
  function ZF(e, t) {
    for (; !t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && t.length === 0); ) {
      var r = t.length;
      if (Z("maybeReadMore read 0"), e.read(0), r === t.length)
        break;
    }
    t.readingMore = !1;
  }
  s(ZF, "maybeReadMore_");
  K.prototype._read = function(e) {
    nn(this, new NF("_read()"));
  };
  K.prototype.pipe = function(e, t) {
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
    i.pipesCount += 1, Z("pipe count=%d opts=%j", i.pipesCount, t);
    var n = (!t || t.end !== !1) && e !== process.stdout && e !== process.stderr, o = n ? u : E;
    i.endEmitted ? process.nextTick(o) : r.once("end", o), e.on("unpipe", a);
    function a(_, C) {
      Z("onunpipe"), _ === r && C && C.hasUnpiped === !1 && (C.hasUnpiped = !0, d());
    }
    s(a, "onunpipe");
    function u() {
      Z("onend"), e.end();
    }
    s(u, "onend");
    var l = zF(r);
    e.on("drain", l);
    var c = !1;
    function d() {
      Z("cleanup"), e.removeListener("close", f), e.removeListener("finish", g), e.removeListener("drain", l), e.removeListener("error", h),
      e.removeListener("unpipe", a), r.removeListener("end", u), r.removeListener("end", E), r.removeListener("data", p), c = !0, i.awaitDrain &&
      (!e._writableState || e._writableState.needDrain) && l();
    }
    s(d, "cleanup"), r.on("data", p);
    function p(_) {
      Z("ondata");
      var C = e.write(_);
      Z("dest.write", C), C === !1 && ((i.pipesCount === 1 && i.pipes === e || i.pipesCount > 1 && tm(i.pipes, e) !== -1) && !c && (Z("false\
 write response, pause", i.awaitDrain), i.awaitDrain++), r.pause());
    }
    s(p, "ondata");
    function h(_) {
      Z("onerror", _), E(), e.removeListener("error", h), KD(e, "error") === 0 && nn(e, _);
    }
    s(h, "onerror"), $F(e, "error", h);
    function f() {
      e.removeListener("finish", g), E();
    }
    s(f, "onclose"), e.once("close", f);
    function g() {
      Z("onfinish"), e.removeListener("close", f), E();
    }
    s(g, "onfinish"), e.once("finish", g);
    function E() {
      Z("unpipe"), r.unpipe(e);
    }
    return s(E, "unpipe"), e.emit("pipe", r), i.flowing || (Z("pipe resume"), r.resume()), e;
  };
  function zF(e) {
    return /* @__PURE__ */ s(function() {
      var r = e._readableState;
      Z("pipeOnDrain", r.awaitDrain), r.awaitDrain && r.awaitDrain--, r.awaitDrain === 0 && KD(e, "data") && (r.flowing = !0, tl(e));
    }, "pipeOnDrainFunctionResult");
  }
  s(zF, "pipeOnDrain");
  K.prototype.unpipe = function(e) {
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
    var a = tm(t.pipes, e);
    return a === -1 ? this : (t.pipes.splice(a, 1), t.pipesCount -= 1, t.pipesCount === 1 && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r),
    this);
  };
  K.prototype.on = function(e, t) {
    var r = sn.prototype.on.call(this, e, t), i = this._readableState;
    return e === "data" ? (i.readableListening = this.listenerCount("readable") > 0, i.flowing !== !1 && this.resume()) : e === "readable" &&
    !i.endEmitted && !i.readableListening && (i.readableListening = i.needReadable = !0, i.flowing = !1, i.emittedReadable = !1, Z("on reada\
ble", i.length, i.reading), i.length ? Ps(this) : i.reading || process.nextTick(GF, this)), r;
  };
  K.prototype.addListener = K.prototype.on;
  K.prototype.removeListener = function(e, t) {
    var r = sn.prototype.removeListener.call(this, e, t);
    return e === "readable" && process.nextTick(QD, this), r;
  };
  K.prototype.removeAllListeners = function(e) {
    var t = sn.prototype.removeAllListeners.apply(this, arguments);
    return (e === "readable" || e === void 0) && process.nextTick(QD, this), t;
  };
  function QD(e) {
    var t = e._readableState;
    t.readableListening = e.listenerCount("readable") > 0, t.resumeScheduled && !t.paused ? t.flowing = !0 : e.listenerCount("data") > 0 && e.
    resume();
  }
  s(QD, "updateReadableListening");
  function GF(e) {
    Z("readable nexttick read 0"), e.read(0);
  }
  s(GF, "nReadingNextTick");
  K.prototype.resume = function() {
    var e = this._readableState;
    return e.flowing || (Z("resume"), e.flowing = !e.readableListening, KF(this, e)), e.paused = !1, this;
  };
  function KF(e, t) {
    t.resumeScheduled || (t.resumeScheduled = !0, process.nextTick(YF, e, t));
  }
  s(KF, "resume");
  function YF(e, t) {
    Z("resume", t.reading), t.reading || e.read(0), t.resumeScheduled = !1, e.emit("resume"), tl(e), t.flowing && !t.reading && e.read(0);
  }
  s(YF, "resume_");
  K.prototype.pause = function() {
    return Z("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (Z("pause"), this._readableState.flowing =
    !1, this.emit("pause")), this._readableState.paused = !0, this;
  };
  function tl(e) {
    var t = e._readableState;
    for (Z("flow", t.flowing); t.flowing && e.read() !== null; ) ;
  }
  s(tl, "flow");
  K.prototype.wrap = function(e) {
    var t = this, r = this._readableState, i = !1;
    e.on("end", function() {
      if (Z("wrapped end"), r.decoder && !r.ended) {
        var a = r.decoder.end();
        a && a.length && t.push(a);
      }
      t.push(null);
    }), e.on("data", function(a) {
      if (Z("wrapped data"), r.decoder && (a = r.decoder.write(a)), !(r.objectMode && a == null) && !(!r.objectMode && (!a || !a.length))) {
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
    for (var o = 0; o < Yu.length; o++)
      e.on(Yu[o], this.emit.bind(this, Yu[o]));
    return this._read = function(a) {
      Z("wrapped _read", a), i && (i = !1, e.resume());
    }, this;
  };
  typeof Symbol == "function" && (K.prototype[Symbol.asyncIterator] = function() {
    return Gu === void 0 && (Gu = $D()), Gu(this);
  });
  Object.defineProperty(K.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._readableState.highWaterMark;
    }, "get")
  });
  Object.defineProperty(K.prototype, "readableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._readableState && this._readableState.buffer;
    }, "get")
  });
  Object.defineProperty(K.prototype, "readableFlowing", {
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
  K._fromList = em;
  Object.defineProperty(K.prototype, "readableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._readableState.length;
    }, "get")
  });
  function em(e, t) {
    if (t.length === 0) return null;
    var r;
    return t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (t.decoder ? r = t.buffer.join("") : t.buffer.length === 1 ? r = t.buffer.
    first() : r = t.buffer.concat(t.length), t.buffer.clear()) : r = t.buffer.consume(e, t.decoder), r;
  }
  s(em, "fromList");
  function Xu(e) {
    var t = e._readableState;
    Z("endReadable", t.endEmitted), t.endEmitted || (t.ended = !0, process.nextTick(JF, t, e));
  }
  s(Xu, "endReadable");
  function JF(e, t) {
    if (Z("endReadableNT", e.endEmitted, e.length), !e.endEmitted && e.length === 0 && (e.endEmitted = !0, t.readable = !1, t.emit("end"), e.
    autoDestroy)) {
      var r = t._writableState;
      (!r || r.autoDestroy && r.finished) && t.destroy();
    }
  }
  s(JF, "endReadableNT");
  typeof Symbol == "function" && (K.from = function(e, t) {
    return Ku === void 0 && (Ku = ZD()), Ku(K, e, t);
  });
  function tm(e, t) {
    for (var r = 0, i = e.length; r < i; r++)
      if (e[r] === t) return r;
    return -1;
  }
  s(tm, "indexOf");
});

// ../node_modules/readable-stream/lib/_stream_transform.js
var rl = b((H6, nm) => {
  "use strict";
  nm.exports = Tt;
  var Is = Kt().codes, XF = Is.ERR_METHOD_NOT_IMPLEMENTED, QF = Is.ERR_MULTIPLE_CALLBACK, e2 = Is.ERR_TRANSFORM_ALREADY_TRANSFORMING, t2 = Is.
  ERR_TRANSFORM_WITH_LENGTH_0, Ms = fr();
  oe()(Tt, Ms);
  function r2(e, t) {
    var r = this._transformState;
    r.transforming = !1;
    var i = r.writecb;
    if (i === null)
      return this.emit("error", new QF());
    r.writechunk = null, r.writecb = null, t != null && this.push(t), i(e);
    var n = this._readableState;
    n.reading = !1, (n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
  }
  s(r2, "afterTransform");
  function Tt(e) {
    if (!(this instanceof Tt)) return new Tt(e);
    Ms.call(this, e), this._transformState = {
      afterTransform: r2.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && (typeof e.transform == "function" && (this._transform = e.
    transform), typeof e.flush == "function" && (this._flush = e.flush)), this.on("prefinish", i2);
  }
  s(Tt, "Transform");
  function i2() {
    var e = this;
    typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(t, r) {
      im(e, t, r);
    }) : im(this, null, null);
  }
  s(i2, "prefinish");
  Tt.prototype.push = function(e, t) {
    return this._transformState.needTransform = !1, Ms.prototype.push.call(this, e, t);
  };
  Tt.prototype._transform = function(e, t, r) {
    r(new XF("_transform()"));
  };
  Tt.prototype._write = function(e, t, r) {
    var i = this._transformState;
    if (i.writecb = r, i.writechunk = e, i.writeencoding = t, !i.transforming) {
      var n = this._readableState;
      (i.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
    }
  };
  Tt.prototype._read = function(e) {
    var t = this._transformState;
    t.writechunk !== null && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform =
    !0;
  };
  Tt.prototype._destroy = function(e, t) {
    Ms.prototype._destroy.call(this, e, function(r) {
      t(r);
    });
  };
  function im(e, t, r) {
    if (t) return e.emit("error", t);
    if (r != null && e.push(r), e._writableState.length) throw new t2();
    if (e._transformState.transforming) throw new e2();
    return e.push(null);
  }
  s(im, "done");
});

// ../node_modules/readable-stream/lib/_stream_passthrough.js
var am = b((Z6, om) => {
  "use strict";
  om.exports = on;
  var sm = rl();
  oe()(on, sm);
  function on(e) {
    if (!(this instanceof on)) return new on(e);
    sm.call(this, e);
  }
  s(on, "PassThrough");
  on.prototype._transform = function(e, t, r) {
    r(null, e);
  };
});

// ../node_modules/readable-stream/lib/internal/streams/pipeline.js
var fm = b((G6, dm) => {
  "use strict";
  var il;
  function n2(e) {
    var t = !1;
    return function() {
      t || (t = !0, e.apply(void 0, arguments));
    };
  }
  s(n2, "once");
  var cm = Kt().codes, s2 = cm.ERR_MISSING_ARGS, o2 = cm.ERR_STREAM_DESTROYED;
  function um(e) {
    if (e) throw e;
  }
  s(um, "noop");
  function a2(e) {
    return e.setHeader && typeof e.abort == "function";
  }
  s(a2, "isRequest");
  function u2(e, t, r, i) {
    i = n2(i);
    var n = !1;
    e.on("close", function() {
      n = !0;
    }), il === void 0 && (il = As()), il(e, {
      readable: t,
      writable: r
    }, function(a) {
      if (a) return i(a);
      n = !0, i();
    });
    var o = !1;
    return function(a) {
      if (!n && !o) {
        if (o = !0, a2(e)) return e.abort();
        if (typeof e.destroy == "function") return e.destroy();
        i(a || new o2("pipe"));
      }
    };
  }
  s(u2, "destroyer");
  function lm(e) {
    e();
  }
  s(lm, "call");
  function l2(e, t) {
    return e.pipe(t);
  }
  s(l2, "pipe");
  function c2(e) {
    return !e.length || typeof e[e.length - 1] != "function" ? um : e.pop();
  }
  s(c2, "popCallback");
  function d2() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
      t[r] = arguments[r];
    var i = c2(t);
    if (Array.isArray(t[0]) && (t = t[0]), t.length < 2)
      throw new s2("streams");
    var n, o = t.map(function(a, u) {
      var l = u < t.length - 1, c = u > 0;
      return u2(a, l, c, function(d) {
        n || (n = d), d && o.forEach(lm), !l && (o.forEach(lm), i(n));
      });
    });
    return t.reduce(l2);
  }
  s(d2, "pipeline");
  dm.exports = d2;
});

// ../node_modules/readable-stream/readable.js
var ii = b((Ke, un) => {
  var an = x("stream");
  process.env.READABLE_STREAM === "disable" && an ? (un.exports = an.Readable, Object.assign(un.exports, an), un.exports.Stream = an) : (Ke =
  un.exports = Vu(), Ke.Stream = an || Ke, Ke.Readable = Ke, Ke.Writable = $u(), Ke.Duplex = fr(), Ke.Transform = rl(), Ke.PassThrough = am(),
  Ke.finished = As(), Ke.pipeline = fm());
});

// ../node_modules/bl/BufferList.js
var Dm = b((Y6, pm) => {
  "use strict";
  var { Buffer: it } = x("buffer"), hm = Symbol.for("BufferList");
  function ae(e) {
    if (!(this instanceof ae))
      return new ae(e);
    ae._init.call(this, e);
  }
  s(ae, "BufferList");
  ae._init = /* @__PURE__ */ s(function(t) {
    Object.defineProperty(this, hm, { value: !0 }), this._bufs = [], this.length = 0, t && this.append(t);
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
    return t != null && t[hm];
  }, "isBufferList");
  pm.exports = ae;
});

// ../node_modules/bl/bl.js
var mm = b((X6, js) => {
  "use strict";
  var nl = ii().Duplex, f2 = oe(), ln = Dm();
  function Ie(e) {
    if (!(this instanceof Ie))
      return new Ie(e);
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
    ln._init.call(this, e), nl.call(this);
  }
  s(Ie, "BufferListStream");
  f2(Ie, nl);
  Object.assign(Ie.prototype, ln.prototype);
  Ie.prototype._new = /* @__PURE__ */ s(function(t) {
    return new Ie(t);
  }, "_new");
  Ie.prototype._write = /* @__PURE__ */ s(function(t, r, i) {
    this._appendBuffer(t), typeof i == "function" && i();
  }, "_write");
  Ie.prototype._read = /* @__PURE__ */ s(function(t) {
    if (!this.length)
      return this.push(null);
    t = Math.min(t, this.length), this.push(this.slice(0, t)), this.consume(t);
  }, "_read");
  Ie.prototype.end = /* @__PURE__ */ s(function(t) {
    nl.prototype.end.call(this, t), this._callback && (this._callback(null, this.slice()), this._callback = null);
  }, "end");
  Ie.prototype._destroy = /* @__PURE__ */ s(function(t, r) {
    this._bufs.length = 0, this.length = 0, r(t);
  }, "_destroy");
  Ie.prototype._isBufferList = /* @__PURE__ */ s(function(t) {
    return t instanceof Ie || t instanceof ln || Ie.isBufferList(t);
  }, "_isBufferList");
  Ie.isBufferList = ln.isBufferList;
  js.exports = Ie;
  js.exports.BufferListStream = Ie;
  js.exports.BufferList = ln;
});

// ../node_modules/tar-stream/headers.js
var al = b((si) => {
  var h2 = Buffer.alloc, p2 = "0000000000000000000", D2 = "7777777777777777777", gm = 48, ym = Buffer.from("ustar\0", "binary"), m2 = Buffer.
  from("00", "binary"), g2 = Buffer.from("ustar ", "binary"), y2 = Buffer.from(" \0", "binary"), b2 = parseInt("7777", 8), cn = 257, ol = 263,
  v2 = /* @__PURE__ */ s(function(e, t, r) {
    return typeof e != "number" ? r : (e = ~~e, e >= t ? t : e >= 0 || (e += t, e >= 0) ? e : 0);
  }, "clamp"), _2 = /* @__PURE__ */ s(function(e) {
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
  }, "toType"), w2 = /* @__PURE__ */ s(function(e) {
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
  }, "toTypeflag"), bm = /* @__PURE__ */ s(function(e, t, r, i) {
    for (; r < i; r++)
      if (e[r] === t) return r;
    return i;
  }, "indexOf"), vm = /* @__PURE__ */ s(function(e) {
    for (var t = 256, r = 0; r < 148; r++) t += e[r];
    for (var i = 156; i < 512; i++) t += e[i];
    return t;
  }, "cksum"), er = /* @__PURE__ */ s(function(e, t) {
    return e = e.toString(8), e.length > t ? D2.slice(0, t) + " " : p2.slice(0, t - e.length) + e + " ";
  }, "encodeOct");
  function E2(e) {
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
  s(E2, "parse256");
  var tr = /* @__PURE__ */ s(function(e, t, r) {
    if (e = e.slice(t, t + r), t = 0, e[t] & 128)
      return E2(e);
    for (; t < e.length && e[t] === 32; ) t++;
    for (var i = v2(bm(e, 32, t, e.length), e.length, e.length); t < i && e[t] === 0; ) t++;
    return i === t ? 0 : parseInt(e.slice(t, i).toString(), 8);
  }, "decodeOct"), ni = /* @__PURE__ */ s(function(e, t, r, i) {
    return e.slice(t, bm(e, 0, t, t + r)).toString(i);
  }, "decodeStr"), sl = /* @__PURE__ */ s(function(e) {
    var t = Buffer.byteLength(e), r = Math.floor(Math.log(t) / Math.log(10)) + 1;
    return t + r >= Math.pow(10, r) && r++, t + r + e;
  }, "addLength");
  si.decodeLongPath = function(e, t) {
    return ni(e, 0, e.length, t);
  };
  si.encodePax = function(e) {
    var t = "";
    e.name && (t += sl(" path=" + e.name + `
`)), e.linkname && (t += sl(" linkpath=" + e.linkname + `
`));
    var r = e.pax;
    if (r)
      for (var i in r)
        t += sl(" " + i + "=" + r[i] + `
`);
    return Buffer.from(t);
  };
  si.decodePax = function(e) {
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
  si.encode = function(e) {
    var t = h2(512), r = e.name, i = "";
    if (e.typeflag === 5 && r[r.length - 1] !== "/" && (r += "/"), Buffer.byteLength(r) !== r.length) return null;
    for (; Buffer.byteLength(r) > 100; ) {
      var n = r.indexOf("/");
      if (n === -1) return null;
      i += i ? "/" + r.slice(0, n) : r.slice(0, n), r = r.slice(n + 1);
    }
    return Buffer.byteLength(r) > 100 || Buffer.byteLength(i) > 155 || e.linkname && Buffer.byteLength(e.linkname) > 100 ? null : (t.write(r),
    t.write(er(e.mode & b2, 6), 100), t.write(er(e.uid, 6), 108), t.write(er(e.gid, 6), 116), t.write(er(e.size, 11), 124), t.write(er(e.mtime.
    getTime() / 1e3 | 0, 11), 136), t[156] = gm + w2(e.type), e.linkname && t.write(e.linkname, 157), ym.copy(t, cn), m2.copy(t, ol), e.uname &&
    t.write(e.uname, 265), e.gname && t.write(e.gname, 297), t.write(er(e.devmajor || 0, 6), 329), t.write(er(e.devminor || 0, 6), 337), i &&
    t.write(i, 345), t.write(er(vm(t), 6), 148), t);
  };
  si.decode = function(e, t, r) {
    var i = e[156] === 0 ? 0 : e[156] - gm, n = ni(e, 0, 100, t), o = tr(e, 100, 8), a = tr(e, 108, 8), u = tr(e, 116, 8), l = tr(e, 124, 12),
    c = tr(e, 136, 12), d = _2(i), p = e[157] === 0 ? null : ni(e, 157, 100, t), h = ni(e, 265, 32), f = ni(e, 297, 32), g = tr(e, 329, 8), E = tr(
    e, 337, 8), _ = vm(e);
    if (_ === 8 * 32) return null;
    if (_ !== tr(e, 148, 8)) throw new Error("Invalid tar header. Maybe the tar is corrupted or it needs to be gunzipped?");
    if (ym.compare(e, cn, cn + 6) === 0)
      e[345] && (n = ni(e, 345, 155, t) + "/" + n);
    else if (!(g2.compare(e, cn, cn + 6) === 0 && y2.compare(e, ol, ol + 2) === 0)) {
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
var Sm = b((rM, Fm) => {
  var wm = x("util"), C2 = mm(), dn = al(), Em = ii().Writable, Cm = ii().PassThrough, xm = /* @__PURE__ */ s(function() {
  }, "noop"), _m = /* @__PURE__ */ s(function(e) {
    return e &= 511, e && 512 - e;
  }, "overflow"), x2 = /* @__PURE__ */ s(function(e, t) {
    var r = new qs(e, t);
    return r.end(), r;
  }, "emptyStream"), F2 = /* @__PURE__ */ s(function(e, t) {
    return t.path && (e.name = t.path), t.linkpath && (e.linkname = t.linkpath), t.size && (e.size = parseInt(t.size, 10)), e.pax = t, e;
  }, "mixinPax"), qs = /* @__PURE__ */ s(function(e, t) {
    this._parent = e, this.offset = t, Cm.call(this, { autoDestroy: !1 });
  }, "Source");
  wm.inherits(qs, Cm);
  qs.prototype.destroy = function(e) {
    this._parent.destroy(e);
  };
  var At = /* @__PURE__ */ s(function(e) {
    if (!(this instanceof At)) return new At(e);
    Em.call(this, e), e = e || {}, this._offset = 0, this._buffer = C2(), this._missing = 0, this._partial = !1, this._onparse = xm, this._header =
    null, this._stream = null, this._overflow = null, this._cb = null, this._locked = !1, this._destroyed = !1, this._pax = null, this._paxGlobal =
    null, this._gnuLongPath = null, this._gnuLongLinkPath = null;
    var t = this, r = t._buffer, i = /* @__PURE__ */ s(function() {
      t._continue();
    }, "oncontinue"), n = /* @__PURE__ */ s(function(h) {
      if (t._locked = !1, h) return t.destroy(h);
      t._stream || i();
    }, "onunlock"), o = /* @__PURE__ */ s(function() {
      t._stream = null;
      var h = _m(t._header.size);
      h ? t._parse(h, a) : t._parse(512, p), t._locked || i();
    }, "onstreamend"), a = /* @__PURE__ */ s(function() {
      t._buffer.consume(_m(t._header.size)), t._parse(512, p), i();
    }, "ondrain"), u = /* @__PURE__ */ s(function() {
      var h = t._header.size;
      t._paxGlobal = dn.decodePax(r.slice(0, h)), r.consume(h), o();
    }, "onpaxglobalheader"), l = /* @__PURE__ */ s(function() {
      var h = t._header.size;
      t._pax = dn.decodePax(r.slice(0, h)), t._paxGlobal && (t._pax = Object.assign({}, t._paxGlobal, t._pax)), r.consume(h), o();
    }, "onpaxheader"), c = /* @__PURE__ */ s(function() {
      var h = t._header.size;
      this._gnuLongPath = dn.decodeLongPath(r.slice(0, h), e.filenameEncoding), r.consume(h), o();
    }, "ongnulongpath"), d = /* @__PURE__ */ s(function() {
      var h = t._header.size;
      this._gnuLongLinkPath = dn.decodeLongPath(r.slice(0, h), e.filenameEncoding), r.consume(h), o();
    }, "ongnulonglinkpath"), p = /* @__PURE__ */ s(function() {
      var h = t._offset, f;
      try {
        f = t._header = dn.decode(r.slice(0, 512), e.filenameEncoding, e.allowUnknownFormat);
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
      null), t._pax && (t._header = f = F2(f, t._pax), t._pax = null), t._locked = !0, !f.size || f.type === "directory") {
        t._parse(512, p), t.emit("entry", f, x2(t, h), n);
        return;
      }
      t._stream = new qs(t, h), t.emit("entry", f, t._stream, n), t._parse(f.size, o), i();
    }, "onheader");
    this._onheader = p, this._parse(512, p);
  }, "Extract");
  wm.inherits(At, Em);
  At.prototype.destroy = function(e) {
    this._destroyed || (this._destroyed = !0, e && this.emit("error", e), this.emit("close"), this._stream && this._stream.emit("close"));
  };
  At.prototype._parse = function(e, t) {
    this._destroyed || (this._offset += e, this._missing = e, t === this._onheader && (this._partial = !1), this._onparse = t);
  };
  At.prototype._continue = function() {
    if (!this._destroyed) {
      var e = this._cb;
      this._cb = xm, this._overflow ? this._write(this._overflow, void 0, e) : e();
    }
  };
  At.prototype._write = function(e, t, r) {
    if (!this._destroyed) {
      var i = this._stream, n = this._buffer, o = this._missing;
      if (e.length && (this._partial = !0), e.length < o)
        return this._missing -= e.length, this._overflow = null, i ? i.write(e, r) : (n.append(e), r());
      this._cb = r, this._missing = 0;
      var a = null;
      e.length > o && (a = e.slice(o), e = e.slice(0, o)), i ? i.end(e) : n.append(e), this._overflow = a, this._onparse();
    }
  };
  At.prototype._final = function(e) {
    if (this._partial) return this.destroy(new Error("Unexpected end of data"));
    e();
  };
  Fm.exports = At;
});

// ../node_modules/fs-constants/index.js
var Am = b((nM, Tm) => {
  Tm.exports = x("fs").constants || x("constants");
});

// ../node_modules/tar-stream/pack.js
var Pm = b((sM, Bm) => {
  var oi = Am(), Rm = Xr(), Ns = oe(), S2 = Buffer.alloc, km = ii().Readable, ai = ii().Writable, T2 = x("string_decoder").StringDecoder, Ls = al(),
  A2 = parseInt("755", 8), R2 = parseInt("644", 8), Om = S2(1024), ll = /* @__PURE__ */ s(function() {
  }, "noop"), ul = /* @__PURE__ */ s(function(e, t) {
    t &= 511, t && e.push(Om.slice(0, 512 - t));
  }, "overflow");
  function k2(e) {
    switch (e & oi.S_IFMT) {
      case oi.S_IFBLK:
        return "block-device";
      case oi.S_IFCHR:
        return "character-device";
      case oi.S_IFDIR:
        return "directory";
      case oi.S_IFIFO:
        return "fifo";
      case oi.S_IFLNK:
        return "symlink";
    }
    return "file";
  }
  s(k2, "modeToType");
  var Us = /* @__PURE__ */ s(function(e) {
    ai.call(this), this.written = 0, this._to = e, this._destroyed = !1;
  }, "Sink");
  Ns(Us, ai);
  Us.prototype._write = function(e, t, r) {
    if (this.written += e.length, this._to.push(e)) return r();
    this._to._drain = r;
  };
  Us.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.emit("close"));
  };
  var $s = /* @__PURE__ */ s(function() {
    ai.call(this), this.linkname = "", this._decoder = new T2("utf-8"), this._destroyed = !1;
  }, "LinkSink");
  Ns($s, ai);
  $s.prototype._write = function(e, t, r) {
    this.linkname += this._decoder.write(e), r();
  };
  $s.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.emit("close"));
  };
  var fn = /* @__PURE__ */ s(function() {
    ai.call(this), this._destroyed = !1;
  }, "Void");
  Ns(fn, ai);
  fn.prototype._write = function(e, t, r) {
    r(new Error("No body allowed for this entry"));
  };
  fn.prototype.destroy = function() {
    this._destroyed || (this._destroyed = !0, this.emit("close"));
  };
  var pt = /* @__PURE__ */ s(function(e) {
    if (!(this instanceof pt)) return new pt(e);
    km.call(this, e), this._drain = ll, this._finalized = !1, this._finalizing = !1, this._destroyed = !1, this._stream = null;
  }, "Pack");
  Ns(pt, km);
  pt.prototype.entry = function(e, t, r) {
    if (this._stream) throw new Error("already piping an entry");
    if (!(this._finalized || this._destroyed)) {
      typeof t == "function" && (r = t, t = null), r || (r = ll);
      var i = this;
      if ((!e.size || e.type === "symlink") && (e.size = 0), e.type || (e.type = k2(e.mode)), e.mode || (e.mode = e.type === "directory" ? A2 :
      R2), e.uid || (e.uid = 0), e.gid || (e.gid = 0), e.mtime || (e.mtime = /* @__PURE__ */ new Date()), typeof t == "string" && (t = Buffer.
      from(t)), Buffer.isBuffer(t)) {
        e.size = t.length, this._encode(e);
        var n = this.push(t);
        return ul(i, e.size), n ? process.nextTick(r) : this._drain = r, new fn();
      }
      if (e.type === "symlink" && !e.linkname) {
        var o = new $s();
        return Rm(o, function(u) {
          if (u)
            return i.destroy(), r(u);
          e.linkname = o.linkname, i._encode(e), r();
        }), o;
      }
      if (this._encode(e), e.type !== "file" && e.type !== "contiguous-file")
        return process.nextTick(r), new fn();
      var a = new Us(this);
      return this._stream = a, Rm(a, function(u) {
        if (i._stream = null, u)
          return i.destroy(), r(u);
        if (a.written !== e.size)
          return i.destroy(), r(new Error("size mismatch"));
        ul(i, e.size), i._finalizing && i.finalize(), r();
      }), a;
    }
  };
  pt.prototype.finalize = function() {
    if (this._stream) {
      this._finalizing = !0;
      return;
    }
    this._finalized || (this._finalized = !0, this.push(Om), this.push(null));
  };
  pt.prototype.destroy = function(e) {
    this._destroyed || (this._destroyed = !0, e && this.emit("error", e), this.emit("close"), this._stream && this._stream.destroy && this._stream.
    destroy());
  };
  pt.prototype._encode = function(e) {
    if (!e.pax) {
      var t = Ls.encode(e);
      if (t) {
        this.push(t);
        return;
      }
    }
    this._encodePax(e);
  };
  pt.prototype._encodePax = function(e) {
    var t = Ls.encodePax({
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
    this.push(Ls.encode(r)), this.push(t), ul(this, t.length), r.size = e.size, r.type = e.type, this.push(Ls.encode(r));
  };
  pt.prototype._read = function(e) {
    var t = this._drain;
    this._drain = ll, t();
  };
  Bm.exports = pt;
});

// ../node_modules/tar-stream/index.js
var Im = b((cl) => {
  cl.extract = Sm();
  cl.pack = Pm();
});

// ../node_modules/mkdirp-classic/index.js
var Lm = b((uM, qm) => {
  var Ws = x("path"), Mm = x("fs"), jm = parseInt("0777", 8);
  qm.exports = ui.mkdirp = ui.mkdirP = ui;
  function ui(e, t, r, i) {
    typeof t == "function" ? (r = t, t = {}) : (!t || typeof t != "object") && (t = { mode: t });
    var n = t.mode, o = t.fs || Mm;
    n === void 0 && (n = jm & ~process.umask()), i || (i = null);
    var a = r || function() {
    };
    e = Ws.resolve(e), o.mkdir(e, n, function(u) {
      if (!u)
        return i = i || e, a(null, i);
      switch (u.code) {
        case "ENOENT":
          ui(Ws.dirname(e), t, function(l, c) {
            l ? a(l, c) : ui(e, t, a, c);
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
  s(ui, "mkdirP");
  ui.sync = /* @__PURE__ */ s(function e(t, r, i) {
    (!r || typeof r != "object") && (r = { mode: r });
    var n = r.mode, o = r.fs || Mm;
    n === void 0 && (n = jm & ~process.umask()), i || (i = null), t = Ws.resolve(t);
    try {
      o.mkdirSync(t, n), i = i || t;
    } catch (u) {
      switch (u.code) {
        case "ENOENT":
          i = e(Ws.dirname(t), r, i), e(t, r, i);
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
var zm = b((hl) => {
  var O2 = pD(), Um = Im(), $m = Au(), B2 = Lm(), Wm = x("fs"), He = x("path"), P2 = x("os"), hn = P2.platform() === "win32", pn = /* @__PURE__ */ s(
  function() {
  }, "noop"), fl = /* @__PURE__ */ s(function(e) {
    return e;
  }, "echo"), dl = hn ? function(e) {
    return e.replace(/\\/g, "/").replace(/[:?<>|]/g, "_");
  } : fl, I2 = /* @__PURE__ */ s(function(e, t, r, i, n, o) {
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
  }, "statAll"), Hm = /* @__PURE__ */ s(function(e, t) {
    return function(r) {
      r.name = r.name.split("/").slice(t).join("/");
      var i = r.linkname;
      return i && (r.type === "link" || He.isAbsolute(i)) && (r.linkname = i.split("/").slice(t).join("/")), e(r);
    };
  }, "strip");
  hl.pack = function(e, t) {
    e || (e = "."), t || (t = {});
    var r = t.fs || Wm, i = t.ignore || t.filter || pn, n = t.map || pn, o = t.mapStream || fl, a = I2(r, t.dereference ? r.stat : r.lstat, e,
    i, t.entries, t.sort), u = t.strict !== !1, l = typeof t.umask == "number" ? ~t.umask : ~Vm(), c = typeof t.dmode == "number" ? t.dmode :
    0, d = typeof t.fmode == "number" ? t.fmode : 0, p = t.pack || Um.pack(), h = t.finish || pn;
    t.strip && (n = Hm(n, t.strip)), t.readable && (c |= parseInt(555, 8), d |= parseInt(444, 8)), t.writable && (c |= parseInt(333, 8), d |=
    parseInt(222, 8));
    var f = /* @__PURE__ */ s(function(_, C) {
      r.readlink(He.join(e, _), function(F, w) {
        if (F) return p.destroy(F);
        C.linkname = dl(w), p.entry(C, E);
      });
    }, "onsymlink"), g = /* @__PURE__ */ s(function(_, C, F) {
      if (_) return p.destroy(_);
      if (!C)
        return t.finalize !== !1 && p.finalize(), h(p);
      if (F.isSocket()) return E();
      var w = {
        name: dl(C),
        mode: (F.mode | (F.isDirectory() ? c : d)) & l,
        mtime: F.mtime,
        size: F.size,
        type: "file",
        uid: F.uid,
        gid: F.gid
      };
      if (F.isDirectory())
        return w.size = 0, w.type = "directory", w = n(w) || w, p.entry(w, E);
      if (F.isSymbolicLink())
        return w.size = 0, w.type = "symlink", w = n(w) || w, f(C, w);
      if (w = n(w) || w, !F.isFile())
        return u ? p.destroy(new Error("unsupported type for " + C)) : E();
      var A = p.entry(w, E);
      if (A) {
        var T = o(r.createReadStream(He.join(e, C), { start: 0, end: w.size > 0 ? w.size - 1 : w.size }), w);
        T.on("error", function(S) {
          A.destroy(S);
        }), $m(T, A);
      }
    }, "onstat"), E = /* @__PURE__ */ s(function(_) {
      if (_) return p.destroy(_);
      a(g);
    }, "onnextentry");
    return E(), p;
  };
  var M2 = /* @__PURE__ */ s(function(e) {
    return e.length ? e[e.length - 1] : null;
  }, "head"), j2 = /* @__PURE__ */ s(function() {
    return process.getuid ? process.getuid() : -1;
  }, "processGetuid"), Vm = /* @__PURE__ */ s(function() {
    return process.umask ? process.umask() : 0;
  }, "processUmask");
  hl.extract = function(e, t) {
    e || (e = "."), t || (t = {});
    var r = t.fs || Wm, i = t.ignore || t.filter || pn, n = t.map || pn, o = t.mapStream || fl, a = t.chown !== !1 && !hn && j2() === 0, u = t.
    extract || Um.extract(), l = [], c = /* @__PURE__ */ new Date(), d = typeof t.umask == "number" ? ~t.umask : ~Vm(), p = typeof t.dmode ==
    "number" ? t.dmode : 0, h = typeof t.fmode == "number" ? t.fmode : 0, f = t.strict !== !1;
    t.strip && (n = Hm(n, t.strip)), t.readable && (p |= parseInt(555, 8), h |= parseInt(444, 8)), t.writable && (p |= parseInt(333, 8), h |=
    parseInt(222, 8));
    var g = /* @__PURE__ */ s(function(C, F) {
      for (var w; (w = M2(l)) && C.slice(0, w[0].length) !== w[0]; ) l.pop();
      if (!w) return F();
      r.utimes(w[0], c, w[1], F);
    }, "utimesParent"), E = /* @__PURE__ */ s(function(C, F, w) {
      if (t.utimes === !1) return w();
      if (F.type === "directory") return r.utimes(C, c, F.mtime, w);
      if (F.type === "symlink") return g(C, w);
      r.utimes(C, c, F.mtime, function(A) {
        if (A) return w(A);
        g(C, w);
      });
    }, "utimes"), _ = /* @__PURE__ */ s(function(C, F, w) {
      var A = F.type === "symlink", T = A ? r.lchmod : r.chmod, S = A ? r.lchown : r.chown;
      if (!T) return w();
      var M = (F.mode | (F.type === "directory" ? p : h)) & d;
      S && a ? S.call(r, C, F.uid, F.gid, L) : L(null);
      function L(j) {
        if (j) return w(j);
        if (!T) return w();
        T.call(r, C, M, w);
      }
      s(L, "onchown");
    }, "chperm");
    return u.on("entry", function(C, F, w) {
      C = n(C) || C, C.name = dl(C.name);
      var A = He.join(e, He.join("/", C.name));
      if (i(A, C))
        return F.resume(), w();
      var T = /* @__PURE__ */ s(function(V) {
        if (V) return w(V);
        E(A, C, function(Y) {
          if (Y) return w(Y);
          if (hn) return w();
          _(A, C, w);
        });
      }, "stat"), S = /* @__PURE__ */ s(function() {
        if (hn) return w();
        r.unlink(A, function() {
          r.symlink(C.linkname, A, T);
        });
      }, "onsymlink"), M = /* @__PURE__ */ s(function() {
        if (hn) return w();
        r.unlink(A, function() {
          var V = He.join(e, He.join("/", C.linkname));
          r.link(V, A, function(Y) {
            if (Y && Y.code === "EPERM" && t.hardlinkAsFilesFallback)
              return F = r.createReadStream(V), L();
            T(Y);
          });
        });
      }, "onlink"), L = /* @__PURE__ */ s(function() {
        var V = r.createWriteStream(A), Y = o(F, C);
        V.on("error", function(ve) {
          Y.destroy(ve);
        }), $m(Y, V, function(ve) {
          if (ve) return w(ve);
          V.on("close", T);
        });
      }, "onfile");
      if (C.type === "directory")
        return l.push([A, C.mtime]), Nm(A, {
          fs: r,
          own: a,
          uid: C.uid,
          gid: C.gid
        }, T);
      var j = He.dirname(A);
      Zm(r, j, He.join(e, "."), function(V, Y) {
        if (V) return w(V);
        if (!Y) return w(new Error(j + " is not a valid path"));
        Nm(j, {
          fs: r,
          own: a,
          uid: C.uid,
          gid: C.gid
        }, function(ve) {
          if (ve) return w(ve);
          switch (C.type) {
            case "file":
              return L();
            case "link":
              return M();
            case "symlink":
              return S();
          }
          if (f) return w(new Error("unsupported type for " + A + " (" + C.type + ")"));
          F.resume(), w();
        });
      });
    }), t.finish && u.on("finish", t.finish), u;
  };
  function Zm(e, t, r, i) {
    if (t === r) return i(null, !0);
    e.lstat(t, function(n, o) {
      if (n && n.code !== "ENOENT") return i(n);
      if (n || o.isDirectory()) return Zm(e, He.join(t, ".."), r, i);
      i(null, !1);
    });
  }
  s(Zm, "validate");
  function Nm(e, t, r) {
    B2(e, { fs: t.fs }, function(i, n) {
      !i && n && t.own ? O2(n, t.uid, t.gid, r) : r(i);
    });
  }
  s(Nm, "mkdirfix");
});

// ../node_modules/process-nextick-args/index.js
var Ve = b((fM, pl) => {
  "use strict";
  typeof process > "u" || !process.version || process.version.indexOf("v0.") === 0 || process.version.indexOf("v1.") === 0 && process.version.
  indexOf("v1.8.") !== 0 ? pl.exports = { nextTick: q2 } : pl.exports = process;
  function q2(e, t, r, i) {
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
  s(q2, "nextTick");
});

// ../node_modules/peek-stream/node_modules/isarray/index.js
var Km = b((pM, Gm) => {
  var L2 = {}.toString;
  Gm.exports = Array.isArray || function(e) {
    return L2.call(e) == "[object Array]";
  };
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/internal/streams/stream.js
var Dl = b((DM, Ym) => {
  Ym.exports = x("stream");
});

// ../node_modules/peek-stream/node_modules/safe-buffer/index.js
var Vs = b((ml, Xm) => {
  var Hs = x("buffer"), Rt = Hs.Buffer;
  function Jm(e, t) {
    for (var r in e)
      t[r] = e[r];
  }
  s(Jm, "copyProps");
  Rt.from && Rt.alloc && Rt.allocUnsafe && Rt.allocUnsafeSlow ? Xm.exports = Hs : (Jm(Hs, ml), ml.Buffer = li);
  function li(e, t, r) {
    return Rt(e, t, r);
  }
  s(li, "SafeBuffer");
  Jm(Rt, li);
  li.from = function(e, t, r) {
    if (typeof e == "number")
      throw new TypeError("Argument must not be a number");
    return Rt(e, t, r);
  };
  li.alloc = function(e, t, r) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    var i = Rt(e);
    return t !== void 0 ? typeof r == "string" ? i.fill(t, r) : i.fill(t) : i.fill(0), i;
  };
  li.allocUnsafe = function(e) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    return Rt(e);
  };
  li.allocUnsafeSlow = function(e) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    return Hs.SlowBuffer(e);
  };
});

// ../node_modules/core-util-is/lib/util.js
var je = b((Me) => {
  function N2(e) {
    return Array.isArray ? Array.isArray(e) : Zs(e) === "[object Array]";
  }
  s(N2, "isArray");
  Me.isArray = N2;
  function U2(e) {
    return typeof e == "boolean";
  }
  s(U2, "isBoolean");
  Me.isBoolean = U2;
  function $2(e) {
    return e === null;
  }
  s($2, "isNull");
  Me.isNull = $2;
  function W2(e) {
    return e == null;
  }
  s(W2, "isNullOrUndefined");
  Me.isNullOrUndefined = W2;
  function H2(e) {
    return typeof e == "number";
  }
  s(H2, "isNumber");
  Me.isNumber = H2;
  function V2(e) {
    return typeof e == "string";
  }
  s(V2, "isString");
  Me.isString = V2;
  function Z2(e) {
    return typeof e == "symbol";
  }
  s(Z2, "isSymbol");
  Me.isSymbol = Z2;
  function z2(e) {
    return e === void 0;
  }
  s(z2, "isUndefined");
  Me.isUndefined = z2;
  function G2(e) {
    return Zs(e) === "[object RegExp]";
  }
  s(G2, "isRegExp");
  Me.isRegExp = G2;
  function K2(e) {
    return typeof e == "object" && e !== null;
  }
  s(K2, "isObject");
  Me.isObject = K2;
  function Y2(e) {
    return Zs(e) === "[object Date]";
  }
  s(Y2, "isDate");
  Me.isDate = Y2;
  function J2(e) {
    return Zs(e) === "[object Error]" || e instanceof Error;
  }
  s(J2, "isError");
  Me.isError = J2;
  function X2(e) {
    return typeof e == "function";
  }
  s(X2, "isFunction");
  Me.isFunction = X2;
  function Q2(e) {
    return e === null || typeof e == "boolean" || typeof e == "number" || typeof e == "string" || typeof e == "symbol" || // ES6 symbol
    typeof e > "u";
  }
  s(Q2, "isPrimitive");
  Me.isPrimitive = Q2;
  Me.isBuffer = x("buffer").Buffer.isBuffer;
  function Zs(e) {
    return Object.prototype.toString.call(e);
  }
  s(Zs, "objectToString");
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/internal/streams/BufferList.js
var eg = b((bM, gl) => {
  "use strict";
  function eS(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  s(eS, "_classCallCheck");
  var Qm = Vs().Buffer, Dn = x("util");
  function tS(e, t, r) {
    e.copy(t, r);
  }
  s(tS, "copyBuffer");
  gl.exports = function() {
    function e() {
      eS(this, e), this.head = null, this.tail = null, this.length = 0;
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
      if (this.length === 0) return Qm.alloc(0);
      for (var i = Qm.allocUnsafe(r >>> 0), n = this.head, o = 0; n; )
        tS(n.data, i, o), o += n.data.length, n = n.next;
      return i;
    }, "concat"), e;
  }();
  Dn && Dn.inspect && Dn.inspect.custom && (gl.exports.prototype[Dn.inspect.custom] = function() {
    var e = Dn.inspect({ length: this.length });
    return this.constructor.name + " " + e;
  });
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/internal/streams/destroy.js
var yl = b((_M, tg) => {
  "use strict";
  var zs = Ve();
  function rS(e, t) {
    var r = this, i = this._readableState && this._readableState.destroyed, n = this._writableState && this._writableState.destroyed;
    return i || n ? (t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, zs.nextTick(
    Gs, this, e)) : zs.nextTick(Gs, this, e)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this.
    _writableState.destroyed = !0), this._destroy(e || null, function(o) {
      !t && o ? r._writableState ? r._writableState.errorEmitted || (r._writableState.errorEmitted = !0, zs.nextTick(Gs, r, o)) : zs.nextTick(
      Gs, r, o) : t && t(o);
    }), this);
  }
  s(rS, "destroy");
  function iS() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.
    endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending =
    !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted =
    !1);
  }
  s(iS, "undestroy");
  function Gs(e, t) {
    e.emit("error", t);
  }
  s(Gs, "emitErrorNT");
  tg.exports = {
    destroy: rS,
    undestroy: iS
  };
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/_stream_writable.js
var vl = b((EM, lg) => {
  "use strict";
  var mr = Ve();
  lg.exports = Ee;
  function ig(e) {
    var t = this;
    this.next = null, this.entry = null, this.finish = function() {
      _S(t, e);
    };
  }
  s(ig, "CorkedRequest");
  var nS = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : mr.nextTick, ci;
  Ee.WritableState = gn;
  var ng = Object.create(je());
  ng.inherits = oe();
  var sS = {
    deprecate: Qi()
  }, sg = Dl(), Ys = Vs().Buffer, oS = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array ||
  function() {
  };
  function aS(e) {
    return Ys.from(e);
  }
  s(aS, "_uint8ArrayToBuffer");
  function uS(e) {
    return Ys.isBuffer(e) || e instanceof oS;
  }
  s(uS, "_isUint8Array");
  var og = yl();
  ng.inherits(Ee, sg);
  function lS() {
  }
  s(lS, "nop");
  function gn(e, t) {
    ci = ci || gr(), e = e || {};
    var r = t instanceof ci;
    this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.writableObjectMode);
    var i = e.highWaterMark, n = e.writableHighWaterMark, o = this.objectMode ? 16 : 16 * 1024;
    i || i === 0 ? this.highWaterMark = i : r && (n || n === 0) ? this.highWaterMark = n : this.highWaterMark = o, this.highWaterMark = Math.
    floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed =
    !1;
    var a = e.decodeStrings === !1;
    this.decodeStrings = !a, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync =
    !0, this.bufferProcessing = !1, this.onwrite = function(u) {
      mS(t, u);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished =
    !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new ig(this);
  }
  s(gn, "WritableState");
  gn.prototype.getBuffer = /* @__PURE__ */ s(function() {
    for (var t = this.bufferedRequest, r = []; t; )
      r.push(t), t = t.next;
    return r;
  }, "getBuffer");
  (function() {
    try {
      Object.defineProperty(gn.prototype, "buffer", {
        get: sS.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  })();
  var Ks;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (Ks = Function.prototype[Symbol.
  hasInstance], Object.defineProperty(Ee, Symbol.hasInstance, {
    value: /* @__PURE__ */ s(function(e) {
      return Ks.call(this, e) ? !0 : this !== Ee ? !1 : e && e._writableState instanceof gn;
    }, "value")
  })) : Ks = /* @__PURE__ */ s(function(e) {
    return e instanceof this;
  }, "realHasInstance");
  function Ee(e) {
    if (ci = ci || gr(), !Ks.call(Ee, this) && !(this instanceof ci))
      return new Ee(e);
    this._writableState = new gn(e, this), this.writable = !0, e && (typeof e.write == "function" && (this._write = e.write), typeof e.writev ==
    "function" && (this._writev = e.writev), typeof e.destroy == "function" && (this._destroy = e.destroy), typeof e.final == "function" && (this.
    _final = e.final)), sg.call(this);
  }
  s(Ee, "Writable");
  Ee.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function cS(e, t) {
    var r = new Error("write after end");
    e.emit("error", r), mr.nextTick(t, r);
  }
  s(cS, "writeAfterEnd");
  function dS(e, t, r, i) {
    var n = !0, o = !1;
    return r === null ? o = new TypeError("May not write null values to stream") : typeof r != "string" && r !== void 0 && !t.objectMode && (o =
    new TypeError("Invalid non-string/buffer chunk")), o && (e.emit("error", o), mr.nextTick(i, o), n = !1), n;
  }
  s(dS, "validChunk");
  Ee.prototype.write = function(e, t, r) {
    var i = this._writableState, n = !1, o = !i.objectMode && uS(e);
    return o && !Ys.isBuffer(e) && (e = aS(e)), typeof t == "function" && (r = t, t = null), o ? t = "buffer" : t || (t = i.defaultEncoding),
    typeof r != "function" && (r = lS), i.ended ? cS(this, r) : (o || dS(this, i, e, r)) && (i.pendingcb++, n = hS(this, i, o, e, t, r)), n;
  };
  Ee.prototype.cork = function() {
    var e = this._writableState;
    e.corked++;
  };
  Ee.prototype.uncork = function() {
    var e = this._writableState;
    e.corked && (e.corked--, !e.writing && !e.corked && !e.bufferProcessing && e.bufferedRequest && ag(this, e));
  };
  Ee.prototype.setDefaultEncoding = /* @__PURE__ */ s(function(t) {
    if (typeof t == "string" && (t = t.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "\
utf-16le", "raw"].indexOf((t + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + t);
    return this._writableState.defaultEncoding = t, this;
  }, "setDefaultEncoding");
  function fS(e, t, r) {
    return !e.objectMode && e.decodeStrings !== !1 && typeof t == "string" && (t = Ys.from(t, r)), t;
  }
  s(fS, "decodeChunk");
  Object.defineProperty(Ee.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  function hS(e, t, r, i, n, o) {
    if (!r) {
      var a = fS(t, i, n);
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
      bl(e, t, !1, u, i, n, o);
    return l;
  }
  s(hS, "writeOrBuffer");
  function bl(e, t, r, i, n, o, a) {
    t.writelen = i, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(n, t.onwrite) : e._write(n, o, t.onwrite), t.sync = !1;
  }
  s(bl, "doWrite");
  function pS(e, t, r, i, n) {
    --t.pendingcb, r ? (mr.nextTick(n, i), mr.nextTick(mn, e, t), e._writableState.errorEmitted = !0, e.emit("error", i)) : (n(i), e._writableState.
    errorEmitted = !0, e.emit("error", i), mn(e, t));
  }
  s(pS, "onwriteError");
  function DS(e) {
    e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
  }
  s(DS, "onwriteStateUpdate");
  function mS(e, t) {
    var r = e._writableState, i = r.sync, n = r.writecb;
    if (DS(r), t) pS(e, r, i, t, n);
    else {
      var o = ug(r);
      !o && !r.corked && !r.bufferProcessing && r.bufferedRequest && ag(e, r), i ? nS(rg, e, r, o, n) : rg(e, r, o, n);
    }
  }
  s(mS, "onwrite");
  function rg(e, t, r, i) {
    r || gS(e, t), t.pendingcb--, i(), mn(e, t);
  }
  s(rg, "afterWrite");
  function gS(e, t) {
    t.length === 0 && t.needDrain && (t.needDrain = !1, e.emit("drain"));
  }
  s(gS, "onwriteDrain");
  function ag(e, t) {
    t.bufferProcessing = !0;
    var r = t.bufferedRequest;
    if (e._writev && r && r.next) {
      var i = t.bufferedRequestCount, n = new Array(i), o = t.corkedRequestsFree;
      o.entry = r;
      for (var a = 0, u = !0; r; )
        n[a] = r, r.isBuf || (u = !1), r = r.next, a += 1;
      n.allBuffers = u, bl(e, t, !0, t.length, n, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree =
      o.next, o.next = null) : t.corkedRequestsFree = new ig(t), t.bufferedRequestCount = 0;
    } else {
      for (; r; ) {
        var l = r.chunk, c = r.encoding, d = r.callback, p = t.objectMode ? 1 : l.length;
        if (bl(e, t, !1, p, l, c, d), r = r.next, t.bufferedRequestCount--, t.writing)
          break;
      }
      r === null && (t.lastBufferedRequest = null);
    }
    t.bufferedRequest = r, t.bufferProcessing = !1;
  }
  s(ag, "clearBuffer");
  Ee.prototype._write = function(e, t, r) {
    r(new Error("_write() is not implemented"));
  };
  Ee.prototype._writev = null;
  Ee.prototype.end = function(e, t, r) {
    var i = this._writableState;
    typeof e == "function" ? (r = e, e = null, t = null) : typeof t == "function" && (r = t, t = null), e != null && this.write(e, t), i.corked &&
    (i.corked = 1, this.uncork()), i.ending || vS(this, i, r);
  };
  function ug(e) {
    return e.ending && e.length === 0 && e.bufferedRequest === null && !e.finished && !e.writing;
  }
  s(ug, "needFinish");
  function yS(e, t) {
    e._final(function(r) {
      t.pendingcb--, r && e.emit("error", r), t.prefinished = !0, e.emit("prefinish"), mn(e, t);
    });
  }
  s(yS, "callFinal");
  function bS(e, t) {
    !t.prefinished && !t.finalCalled && (typeof e._final == "function" ? (t.pendingcb++, t.finalCalled = !0, mr.nextTick(yS, e, t)) : (t.prefinished =
    !0, e.emit("prefinish")));
  }
  s(bS, "prefinish");
  function mn(e, t) {
    var r = ug(t);
    return r && (bS(e, t), t.pendingcb === 0 && (t.finished = !0, e.emit("finish"))), r;
  }
  s(mn, "finishMaybe");
  function vS(e, t, r) {
    t.ending = !0, mn(e, t), r && (t.finished ? mr.nextTick(r) : e.once("finish", r)), t.ended = !0, e.writable = !1;
  }
  s(vS, "endWritable");
  function _S(e, t, r) {
    var i = e.entry;
    for (e.entry = null; i; ) {
      var n = i.callback;
      t.pendingcb--, n(r), i = i.next;
    }
    t.corkedRequestsFree.next = e;
  }
  s(_S, "onCorkedFinish");
  Object.defineProperty(Ee.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._writableState && (this._writableState.destroyed = e);
    }, "set")
  });
  Ee.prototype.destroy = og.destroy;
  Ee.prototype._undestroy = og.undestroy;
  Ee.prototype._destroy = function(e, t) {
    this.end(), t(e);
  };
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/_stream_duplex.js
var gr = b((xM, hg) => {
  "use strict";
  var cg = Ve(), wS = Object.keys || function(e) {
    var t = [];
    for (var r in e)
      t.push(r);
    return t;
  };
  hg.exports = kt;
  var dg = Object.create(je());
  dg.inherits = oe();
  var fg = El(), wl = vl();
  dg.inherits(kt, fg);
  for (_l = wS(wl.prototype), Js = 0; Js < _l.length; Js++)
    Xs = _l[Js], kt.prototype[Xs] || (kt.prototype[Xs] = wl.prototype[Xs]);
  var _l, Xs, Js;
  function kt(e) {
    if (!(this instanceof kt)) return new kt(e);
    fg.call(this, e), wl.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.
    allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", ES);
  }
  s(kt, "Duplex");
  Object.defineProperty(kt.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  function ES() {
    this.allowHalfOpen || this._writableState.ended || cg.nextTick(CS, this);
  }
  s(ES, "onend");
  function CS(e) {
    e.end();
  }
  s(CS, "onEndNT");
  Object.defineProperty(kt.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = e, this._writableState.destroyed =
      e);
    }, "set")
  });
  kt.prototype._destroy = function(e, t) {
    this.push(null), this.end(), cg.nextTick(t, e);
  };
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/_stream_readable.js
var El = b((TM, xg) => {
  "use strict";
  var fi = Ve();
  xg.exports = ce;
  var xS = Km(), yn;
  ce.ReadableState = vg;
  var SM = x("events").EventEmitter, gg = /* @__PURE__ */ s(function(e, t) {
    return e.listeners(t).length;
  }, "EElistenerCount"), Tl = Dl(), bn = Vs().Buffer, FS = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ?
  self : {}).Uint8Array || function() {
  };
  function SS(e) {
    return bn.from(e);
  }
  s(SS, "_uint8ArrayToBuffer");
  function TS(e) {
    return bn.isBuffer(e) || e instanceof FS;
  }
  s(TS, "_isUint8Array");
  var yg = Object.create(je());
  yg.inherits = oe();
  var Cl = x("util"), Q = void 0;
  Cl && Cl.debuglog ? Q = Cl.debuglog("stream") : Q = /* @__PURE__ */ s(function() {
  }, "debug");
  var AS = eg(), bg = yl(), di;
  yg.inherits(ce, Tl);
  var xl = ["error", "close", "destroy", "pause", "resume"];
  function RS(e, t, r) {
    if (typeof e.prependListener == "function") return e.prependListener(t, r);
    !e._events || !e._events[t] ? e.on(t, r) : xS(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]];
  }
  s(RS, "prependListener");
  function vg(e, t) {
    yn = yn || gr(), e = e || {};
    var r = t instanceof yn;
    this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.readableObjectMode);
    var i = e.highWaterMark, n = e.readableHighWaterMark, o = this.objectMode ? 16 : 16 * 1024;
    i || i === 0 ? this.highWaterMark = i : r && (n || n === 0) ? this.highWaterMark = n : this.highWaterMark = o, this.highWaterMark = Math.
    floor(this.highWaterMark), this.buffer = new AS(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended =
    !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening =
    !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore =
    !1, this.decoder = null, this.encoding = null, e.encoding && (di || (di = x("string_decoder/").StringDecoder), this.decoder = new di(e.encoding),
    this.encoding = e.encoding);
  }
  s(vg, "ReadableState");
  function ce(e) {
    if (yn = yn || gr(), !(this instanceof ce)) return new ce(e);
    this._readableState = new vg(e, this), this.readable = !0, e && (typeof e.read == "function" && (this._read = e.read), typeof e.destroy ==
    "function" && (this._destroy = e.destroy)), Tl.call(this);
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
  ce.prototype.destroy = bg.destroy;
  ce.prototype._undestroy = bg.undestroy;
  ce.prototype._destroy = function(e, t) {
    this.push(null), t(e);
  };
  ce.prototype.push = function(e, t) {
    var r = this._readableState, i;
    return r.objectMode ? i = !0 : typeof e == "string" && (t = t || r.defaultEncoding, t !== r.encoding && (e = bn.from(e, t), t = ""), i =
    !0), _g(this, e, t, !1, i);
  };
  ce.prototype.unshift = function(e) {
    return _g(this, e, null, !0, !1);
  };
  function _g(e, t, r, i, n) {
    var o = e._readableState;
    if (t === null)
      o.reading = !1, PS(e, o);
    else {
      var a;
      n || (a = kS(o, t)), a ? e.emit("error", a) : o.objectMode || t && t.length > 0 ? (typeof t != "string" && !o.objectMode && Object.getPrototypeOf(
      t) !== bn.prototype && (t = SS(t)), i ? o.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : Fl(e, o, t, !0) :
      o.ended ? e.emit("error", new Error("stream.push() after EOF")) : (o.reading = !1, o.decoder && !r ? (t = o.decoder.write(t), o.objectMode ||
      t.length !== 0 ? Fl(e, o, t, !1) : wg(e, o)) : Fl(e, o, t, !1))) : i || (o.reading = !1);
    }
    return OS(o);
  }
  s(_g, "readableAddChunk");
  function Fl(e, t, r, i) {
    t.flowing && t.length === 0 && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(
    r) : t.buffer.push(r), t.needReadable && Qs(e)), wg(e, t);
  }
  s(Fl, "addChunk");
  function kS(e, t) {
    var r;
    return !TS(t) && typeof t != "string" && t !== void 0 && !e.objectMode && (r = new TypeError("Invalid non-string/buffer chunk")), r;
  }
  s(kS, "chunkInvalid");
  function OS(e) {
    return !e.ended && (e.needReadable || e.length < e.highWaterMark || e.length === 0);
  }
  s(OS, "needMoreData");
  ce.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  };
  ce.prototype.setEncoding = function(e) {
    return di || (di = x("string_decoder/").StringDecoder), this._readableState.decoder = new di(e), this._readableState.encoding = e, this;
  };
  var pg = 8388608;
  function BS(e) {
    return e >= pg ? e = pg : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
  }
  s(BS, "computeNewHighWaterMark");
  function Dg(e, t) {
    return e <= 0 || t.length === 0 && t.ended ? 0 : t.objectMode ? 1 : e !== e ? t.flowing && t.length ? t.buffer.head.data.length : t.length :
    (e > t.highWaterMark && (t.highWaterMark = BS(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
  }
  s(Dg, "howMuchToRead");
  ce.prototype.read = function(e) {
    Q("read", e), e = parseInt(e, 10);
    var t = this._readableState, r = e;
    if (e !== 0 && (t.emittedReadable = !1), e === 0 && t.needReadable && (t.length >= t.highWaterMark || t.ended))
      return Q("read: emitReadable", t.length, t.ended), t.length === 0 && t.ended ? Sl(this) : Qs(this), null;
    if (e = Dg(e, t), e === 0 && t.ended)
      return t.length === 0 && Sl(this), null;
    var i = t.needReadable;
    Q("need readable", i), (t.length === 0 || t.length - e < t.highWaterMark) && (i = !0, Q("length less than watermark", i)), t.ended || t.
    reading ? (i = !1, Q("reading or ended", i)) : i && (Q("do read"), t.reading = !0, t.sync = !0, t.length === 0 && (t.needReadable = !0),
    this._read(t.highWaterMark), t.sync = !1, t.reading || (e = Dg(r, t)));
    var n;
    return e > 0 ? n = Eg(e, t) : n = null, n === null ? (t.needReadable = !0, e = 0) : t.length -= e, t.length === 0 && (t.ended || (t.needReadable =
    !0), r !== e && t.ended && Sl(this)), n !== null && this.emit("data", n), n;
  };
  function PS(e, t) {
    if (!t.ended) {
      if (t.decoder) {
        var r = t.decoder.end();
        r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
      }
      t.ended = !0, Qs(e);
    }
  }
  s(PS, "onEofChunk");
  function Qs(e) {
    var t = e._readableState;
    t.needReadable = !1, t.emittedReadable || (Q("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? fi.nextTick(mg, e) : mg(e));
  }
  s(Qs, "emitReadable");
  function mg(e) {
    Q("emit readable"), e.emit("readable"), Al(e);
  }
  s(mg, "emitReadable_");
  function wg(e, t) {
    t.readingMore || (t.readingMore = !0, fi.nextTick(IS, e, t));
  }
  s(wg, "maybeReadMore");
  function IS(e, t) {
    for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (Q("maybeReadMore read 0"), e.read(0), r !==
    t.length); )
      r = t.length;
    t.readingMore = !1;
  }
  s(IS, "maybeReadMore_");
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
    i.pipesCount += 1, Q("pipe count=%d opts=%j", i.pipesCount, t);
    var n = (!t || t.end !== !1) && e !== process.stdout && e !== process.stderr, o = n ? u : _;
    i.endEmitted ? fi.nextTick(o) : r.once("end", o), e.on("unpipe", a);
    function a(C, F) {
      Q("onunpipe"), C === r && F && F.hasUnpiped === !1 && (F.hasUnpiped = !0, d());
    }
    s(a, "onunpipe");
    function u() {
      Q("onend"), e.end();
    }
    s(u, "onend");
    var l = MS(r);
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
      var F = e.write(C);
      F === !1 && !p && ((i.pipesCount === 1 && i.pipes === e || i.pipesCount > 1 && Cg(i.pipes, e) !== -1) && !c && (Q("false write respons\
e, pause", i.awaitDrain), i.awaitDrain++, p = !0), r.pause());
    }
    s(h, "ondata");
    function f(C) {
      Q("onerror", C), _(), e.removeListener("error", f), gg(e, "error") === 0 && e.emit("error", C);
    }
    s(f, "onerror"), RS(e, "error", f);
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
  function MS(e) {
    return function() {
      var t = e._readableState;
      Q("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, t.awaitDrain === 0 && gg(e, "data") && (t.flowing = !0, Al(e));
    };
  }
  s(MS, "pipeOnDrain");
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
    var a = Cg(t.pipes, e);
    return a === -1 ? this : (t.pipes.splice(a, 1), t.pipesCount -= 1, t.pipesCount === 1 && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r),
    this);
  };
  ce.prototype.on = function(e, t) {
    var r = Tl.prototype.on.call(this, e, t);
    if (e === "data")
      this._readableState.flowing !== !1 && this.resume();
    else if (e === "readable") {
      var i = this._readableState;
      !i.endEmitted && !i.readableListening && (i.readableListening = i.needReadable = !0, i.emittedReadable = !1, i.reading ? i.length && Qs(
      this) : fi.nextTick(jS, this));
    }
    return r;
  };
  ce.prototype.addListener = ce.prototype.on;
  function jS(e) {
    Q("readable nexttick read 0"), e.read(0);
  }
  s(jS, "nReadingNextTick");
  ce.prototype.resume = function() {
    var e = this._readableState;
    return e.flowing || (Q("resume"), e.flowing = !0, qS(this, e)), this;
  };
  function qS(e, t) {
    t.resumeScheduled || (t.resumeScheduled = !0, fi.nextTick(LS, e, t));
  }
  s(qS, "resume");
  function LS(e, t) {
    t.reading || (Q("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), Al(e), t.flowing && !t.reading &&
    e.read(0);
  }
  s(LS, "resume_");
  ce.prototype.pause = function() {
    return Q("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (Q("pause"), this._readableState.flowing =
    !1, this.emit("pause")), this;
  };
  function Al(e) {
    var t = e._readableState;
    for (Q("flow", t.flowing); t.flowing && e.read() !== null; )
      ;
  }
  s(Al, "flow");
  ce.prototype.wrap = function(e) {
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
    for (var o = 0; o < xl.length; o++)
      e.on(xl[o], this.emit.bind(this, xl[o]));
    return this._read = function(a) {
      Q("wrapped _read", a), i && (i = !1, e.resume());
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
  ce._fromList = Eg;
  function Eg(e, t) {
    if (t.length === 0) return null;
    var r;
    return t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (t.decoder ? r = t.buffer.join("") : t.buffer.length === 1 ? r = t.buffer.
    head.data : r = t.buffer.concat(t.length), t.buffer.clear()) : r = NS(e, t.buffer, t.decoder), r;
  }
  s(Eg, "fromList");
  function NS(e, t, r) {
    var i;
    return e < t.head.data.length ? (i = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : e === t.head.data.length ? i = t.shift() :
    i = r ? US(e, t) : $S(e, t), i;
  }
  s(NS, "fromListPartial");
  function US(e, t) {
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
  s(US, "copyFromBufferString");
  function $S(e, t) {
    var r = bn.allocUnsafe(e), i = t.head, n = 1;
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
  s($S, "copyFromBuffer");
  function Sl(e) {
    var t = e._readableState;
    if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
    t.endEmitted || (t.ended = !0, fi.nextTick(WS, t, e));
  }
  s(Sl, "endReadable");
  function WS(e, t) {
    !e.endEmitted && e.length === 0 && (e.endEmitted = !0, t.readable = !1, t.emit("end"));
  }
  s(WS, "endReadableNT");
  function Cg(e, t) {
    for (var r = 0, i = e.length; r < i; r++)
      if (e[r] === t) return r;
    return -1;
  }
  s(Cg, "indexOf");
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/_stream_transform.js
var Rl = b((RM, Tg) => {
  "use strict";
  Tg.exports = Ot;
  var eo = gr(), Sg = Object.create(je());
  Sg.inherits = oe();
  Sg.inherits(Ot, eo);
  function HS(e, t) {
    var r = this._transformState;
    r.transforming = !1;
    var i = r.writecb;
    if (!i)
      return this.emit("error", new Error("write callback called multiple times"));
    r.writechunk = null, r.writecb = null, t != null && this.push(t), i(e);
    var n = this._readableState;
    n.reading = !1, (n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
  }
  s(HS, "afterTransform");
  function Ot(e) {
    if (!(this instanceof Ot)) return new Ot(e);
    eo.call(this, e), this._transformState = {
      afterTransform: HS.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && (typeof e.transform == "function" && (this._transform = e.
    transform), typeof e.flush == "function" && (this._flush = e.flush)), this.on("prefinish", VS);
  }
  s(Ot, "Transform");
  function VS() {
    var e = this;
    typeof this._flush == "function" ? this._flush(function(t, r) {
      Fg(e, t, r);
    }) : Fg(this, null, null);
  }
  s(VS, "prefinish");
  Ot.prototype.push = function(e, t) {
    return this._transformState.needTransform = !1, eo.prototype.push.call(this, e, t);
  };
  Ot.prototype._transform = function(e, t, r) {
    throw new Error("_transform() is not implemented");
  };
  Ot.prototype._write = function(e, t, r) {
    var i = this._transformState;
    if (i.writecb = r, i.writechunk = e, i.writeencoding = t, !i.transforming) {
      var n = this._readableState;
      (i.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
    }
  };
  Ot.prototype._read = function(e) {
    var t = this._transformState;
    t.writechunk !== null && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) :
    t.needTransform = !0;
  };
  Ot.prototype._destroy = function(e, t) {
    var r = this;
    eo.prototype._destroy.call(this, e, function(i) {
      t(i), r.emit("close");
    });
  };
  function Fg(e, t, r) {
    if (t) return e.emit("error", t);
    if (r != null && e.push(r), e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
    if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
    return e.push(null);
  }
  s(Fg, "done");
});

// ../node_modules/peek-stream/node_modules/readable-stream/lib/_stream_passthrough.js
var Og = b((OM, kg) => {
  "use strict";
  kg.exports = vn;
  var Ag = Rl(), Rg = Object.create(je());
  Rg.inherits = oe();
  Rg.inherits(vn, Ag);
  function vn(e) {
    if (!(this instanceof vn)) return new vn(e);
    Ag.call(this, e);
  }
  s(vn, "PassThrough");
  vn.prototype._transform = function(e, t, r) {
    r(null, e);
  };
});

// ../node_modules/peek-stream/node_modules/readable-stream/readable.js
var Bg = b((Re, to) => {
  var Dt = x("stream");
  process.env.READABLE_STREAM === "disable" && Dt ? (to.exports = Dt, Re = to.exports = Dt.Readable, Re.Readable = Dt.Readable, Re.Writable =
  Dt.Writable, Re.Duplex = Dt.Duplex, Re.Transform = Dt.Transform, Re.PassThrough = Dt.PassThrough, Re.Stream = Dt) : (Re = to.exports = El(),
  Re.Stream = Dt || Re, Re.Readable = Re, Re.Writable = vl(), Re.Duplex = gr(), Re.Transform = Rl(), Re.PassThrough = Og());
});

// ../node_modules/stream-shift/index.js
var kl = b((PM, Pg) => {
  Pg.exports = ZS;
  function ZS(e) {
    var t = e._readableState;
    return t ? t.objectMode || typeof e._duplexState == "number" ? e.read() : e.read(zS(t)) : null;
  }
  s(ZS, "shift");
  function zS(e) {
    if (e.buffer.length) {
      var t = e.bufferIndex || 0;
      if (e.buffer.head)
        return e.buffer.head.data.length;
      if (e.buffer.length - t > 0 && e.buffer[t])
        return e.buffer[t].length;
    }
    return e.length;
  }
  s(zS, "getStateLength");
});

// ../node_modules/peek-stream/node_modules/duplexify/index.js
var Lg = b((MM, qg) => {
  var ro = Bg(), Ig = Xr(), GS = oe(), KS = kl(), Mg = Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from([0]) : new Buffer([0]), Ol = /* @__PURE__ */ s(
  function(e, t) {
    e._corked ? e.once("uncork", t) : t();
  }, "onuncork"), YS = /* @__PURE__ */ s(function(e, t) {
    e._autoDestroy && e.destroy(t);
  }, "autoDestroy"), jg = /* @__PURE__ */ s(function(e, t) {
    return function(r) {
      r ? YS(e, r.message === "premature close" ? null : r) : t && !e._ended && e.end();
    };
  }, "destroyer"), JS = /* @__PURE__ */ s(function(e, t) {
    if (!e || e._writableState && e._writableState.finished) return t();
    if (e._writableState) return e.end(t);
    e.end(), t();
  }, "end"), XS = /* @__PURE__ */ s(function(e) {
    return new ro.Readable({ objectMode: !0, highWaterMark: 16 }).wrap(e);
  }, "toStreams2"), ke = /* @__PURE__ */ s(function(e, t, r) {
    if (!(this instanceof ke)) return new ke(e, t, r);
    ro.Duplex.call(this, r), this._writable = null, this._readable = null, this._readable2 = null, this._autoDestroy = !r || r.autoDestroy !==
    !1, this._forwardDestroy = !r || r.destroy !== !1, this._forwardEnd = !r || r.end !== !1, this._corked = 1, this._ondrain = null, this._drained =
    !1, this._forwarding = !1, this._unwrite = null, this._unread = null, this._ended = !1, this.destroyed = !1, e && this.setWritable(e), t &&
    this.setReadable(t);
  }, "Duplexify");
  GS(ke, ro.Duplex);
  ke.obj = function(e, t, r) {
    return r || (r = {}), r.objectMode = !0, r.highWaterMark = 16, new ke(e, t, r);
  };
  ke.prototype.cork = function() {
    ++this._corked === 1 && this.emit("cork");
  };
  ke.prototype.uncork = function() {
    this._corked && --this._corked === 0 && this.emit("uncork");
  };
  ke.prototype.setWritable = function(e) {
    if (this._unwrite && this._unwrite(), this.destroyed) {
      e && e.destroy && e.destroy();
      return;
    }
    if (e === null || e === !1) {
      this.end();
      return;
    }
    var t = this, r = Ig(e, { writable: !0, readable: !1 }, jg(this, this._forwardEnd)), i = /* @__PURE__ */ s(function() {
      var o = t._ondrain;
      t._ondrain = null, o && o();
    }, "ondrain"), n = /* @__PURE__ */ s(function() {
      t._writable.removeListener("drain", i), r();
    }, "clear");
    this._unwrite && process.nextTick(i), this._writable = e, this._writable.on("drain", i), this._unwrite = n, this.uncork();
  };
  ke.prototype.setReadable = function(e) {
    if (this._unread && this._unread(), this.destroyed) {
      e && e.destroy && e.destroy();
      return;
    }
    if (e === null || e === !1) {
      this.push(null), this.resume();
      return;
    }
    var t = this, r = Ig(e, { writable: !1, readable: !0 }, jg(this)), i = /* @__PURE__ */ s(function() {
      t._forward();
    }, "onreadable"), n = /* @__PURE__ */ s(function() {
      t.push(null);
    }, "onend"), o = /* @__PURE__ */ s(function() {
      t._readable2.removeListener("readable", i), t._readable2.removeListener("end", n), r();
    }, "clear");
    this._drained = !0, this._readable = e, this._readable2 = e._readableState ? e : XS(e), this._readable2.on("readable", i), this._readable2.
    on("end", n), this._unread = o, this._forward();
  };
  ke.prototype._read = function() {
    this._drained = !0, this._forward();
  };
  ke.prototype._forward = function() {
    if (!(this._forwarding || !this._readable2 || !this._drained)) {
      this._forwarding = !0;
      for (var e; this._drained && (e = KS(this._readable2)) !== null; )
        this.destroyed || (this._drained = this.push(e));
      this._forwarding = !1;
    }
  };
  ke.prototype.destroy = function(e) {
    if (!this.destroyed) {
      this.destroyed = !0;
      var t = this;
      process.nextTick(function() {
        t._destroy(e);
      });
    }
  };
  ke.prototype._destroy = function(e) {
    if (e) {
      var t = this._ondrain;
      this._ondrain = null, t ? t(e) : this.emit("error", e);
    }
    this._forwardDestroy && (this._readable && this._readable.destroy && this._readable.destroy(), this._writable && this._writable.destroy &&
    this._writable.destroy()), this.emit("close");
  };
  ke.prototype._write = function(e, t, r) {
    if (this.destroyed) return r();
    if (this._corked) return Ol(this, this._write.bind(this, e, t, r));
    if (e === Mg) return this._finish(r);
    if (!this._writable) return r();
    this._writable.write(e) === !1 ? this._ondrain = r : r();
  };
  ke.prototype._finish = function(e) {
    var t = this;
    this.emit("preend"), Ol(this, function() {
      JS(t._forwardEnd && t._writable, function() {
        t._writableState.prefinished === !1 && (t._writableState.prefinished = !0), t.emit("prefinish"), Ol(t, e);
      });
    });
  };
  ke.prototype.end = function(e, t, r) {
    return typeof e == "function" ? this.end(null, null, e) : typeof t == "function" ? this.end(e, null, t) : (this._ended = !0, e && this.write(
    e), this._writableState.ending || this.write(Mg), ro.Writable.prototype.end.call(this, r));
  };
  qg.exports = ke;
});

// ../node_modules/through2/node_modules/isarray/index.js
var Ug = b((qM, Ng) => {
  var QS = {}.toString;
  Ng.exports = Array.isArray || function(e) {
    return QS.call(e) == "[object Array]";
  };
});

// ../node_modules/through2/node_modules/readable-stream/lib/internal/streams/stream.js
var Bl = b((LM, $g) => {
  $g.exports = x("stream");
});

// ../node_modules/through2/node_modules/safe-buffer/index.js
var no = b((Pl, Hg) => {
  var io = x("buffer"), Bt = io.Buffer;
  function Wg(e, t) {
    for (var r in e)
      t[r] = e[r];
  }
  s(Wg, "copyProps");
  Bt.from && Bt.alloc && Bt.allocUnsafe && Bt.allocUnsafeSlow ? Hg.exports = io : (Wg(io, Pl), Pl.Buffer = hi);
  function hi(e, t, r) {
    return Bt(e, t, r);
  }
  s(hi, "SafeBuffer");
  Wg(Bt, hi);
  hi.from = function(e, t, r) {
    if (typeof e == "number")
      throw new TypeError("Argument must not be a number");
    return Bt(e, t, r);
  };
  hi.alloc = function(e, t, r) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    var i = Bt(e);
    return t !== void 0 ? typeof r == "string" ? i.fill(t, r) : i.fill(t) : i.fill(0), i;
  };
  hi.allocUnsafe = function(e) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    return Bt(e);
  };
  hi.allocUnsafeSlow = function(e) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    return io.SlowBuffer(e);
  };
});

// ../node_modules/through2/node_modules/readable-stream/lib/internal/streams/BufferList.js
var Zg = b((UM, Il) => {
  "use strict";
  function eT(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  s(eT, "_classCallCheck");
  var Vg = no().Buffer, _n = x("util");
  function tT(e, t, r) {
    e.copy(t, r);
  }
  s(tT, "copyBuffer");
  Il.exports = function() {
    function e() {
      eT(this, e), this.head = null, this.tail = null, this.length = 0;
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
      if (this.length === 0) return Vg.alloc(0);
      for (var i = Vg.allocUnsafe(r >>> 0), n = this.head, o = 0; n; )
        tT(n.data, i, o), o += n.data.length, n = n.next;
      return i;
    }, "concat"), e;
  }();
  _n && _n.inspect && _n.inspect.custom && (Il.exports.prototype[_n.inspect.custom] = function() {
    var e = _n.inspect({ length: this.length });
    return this.constructor.name + " " + e;
  });
});

// ../node_modules/through2/node_modules/readable-stream/lib/internal/streams/destroy.js
var Ml = b((WM, zg) => {
  "use strict";
  var so = Ve();
  function rT(e, t) {
    var r = this, i = this._readableState && this._readableState.destroyed, n = this._writableState && this._writableState.destroyed;
    return i || n ? (t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, so.nextTick(
    oo, this, e)) : so.nextTick(oo, this, e)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this.
    _writableState.destroyed = !0), this._destroy(e || null, function(o) {
      !t && o ? r._writableState ? r._writableState.errorEmitted || (r._writableState.errorEmitted = !0, so.nextTick(oo, r, o)) : so.nextTick(
      oo, r, o) : t && t(o);
    }), this);
  }
  s(rT, "destroy");
  function iT() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.
    endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending =
    !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted =
    !1);
  }
  s(iT, "undestroy");
  function oo(e, t) {
    e.emit("error", t);
  }
  s(oo, "emitErrorNT");
  zg.exports = {
    destroy: rT,
    undestroy: iT
  };
});

// ../node_modules/through2/node_modules/readable-stream/lib/_stream_writable.js
var ql = b((VM, ty) => {
  "use strict";
  var yr = Ve();
  ty.exports = Ce;
  function Kg(e) {
    var t = this;
    this.next = null, this.entry = null, this.finish = function() {
      _T(t, e);
    };
  }
  s(Kg, "CorkedRequest");
  var nT = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : yr.nextTick, pi;
  Ce.WritableState = En;
  var Yg = Object.create(je());
  Yg.inherits = oe();
  var sT = {
    deprecate: Qi()
  }, Jg = Bl(), uo = no().Buffer, oT = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array ||
  function() {
  };
  function aT(e) {
    return uo.from(e);
  }
  s(aT, "_uint8ArrayToBuffer");
  function uT(e) {
    return uo.isBuffer(e) || e instanceof oT;
  }
  s(uT, "_isUint8Array");
  var Xg = Ml();
  Yg.inherits(Ce, Jg);
  function lT() {
  }
  s(lT, "nop");
  function En(e, t) {
    pi = pi || br(), e = e || {};
    var r = t instanceof pi;
    this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.writableObjectMode);
    var i = e.highWaterMark, n = e.writableHighWaterMark, o = this.objectMode ? 16 : 16 * 1024;
    i || i === 0 ? this.highWaterMark = i : r && (n || n === 0) ? this.highWaterMark = n : this.highWaterMark = o, this.highWaterMark = Math.
    floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed =
    !1;
    var a = e.decodeStrings === !1;
    this.decodeStrings = !a, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync =
    !0, this.bufferProcessing = !1, this.onwrite = function(u) {
      mT(t, u);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished =
    !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new Kg(this);
  }
  s(En, "WritableState");
  En.prototype.getBuffer = /* @__PURE__ */ s(function() {
    for (var t = this.bufferedRequest, r = []; t; )
      r.push(t), t = t.next;
    return r;
  }, "getBuffer");
  (function() {
    try {
      Object.defineProperty(En.prototype, "buffer", {
        get: sT.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  })();
  var ao;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (ao = Function.prototype[Symbol.
  hasInstance], Object.defineProperty(Ce, Symbol.hasInstance, {
    value: /* @__PURE__ */ s(function(e) {
      return ao.call(this, e) ? !0 : this !== Ce ? !1 : e && e._writableState instanceof En;
    }, "value")
  })) : ao = /* @__PURE__ */ s(function(e) {
    return e instanceof this;
  }, "realHasInstance");
  function Ce(e) {
    if (pi = pi || br(), !ao.call(Ce, this) && !(this instanceof pi))
      return new Ce(e);
    this._writableState = new En(e, this), this.writable = !0, e && (typeof e.write == "function" && (this._write = e.write), typeof e.writev ==
    "function" && (this._writev = e.writev), typeof e.destroy == "function" && (this._destroy = e.destroy), typeof e.final == "function" && (this.
    _final = e.final)), Jg.call(this);
  }
  s(Ce, "Writable");
  Ce.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function cT(e, t) {
    var r = new Error("write after end");
    e.emit("error", r), yr.nextTick(t, r);
  }
  s(cT, "writeAfterEnd");
  function dT(e, t, r, i) {
    var n = !0, o = !1;
    return r === null ? o = new TypeError("May not write null values to stream") : typeof r != "string" && r !== void 0 && !t.objectMode && (o =
    new TypeError("Invalid non-string/buffer chunk")), o && (e.emit("error", o), yr.nextTick(i, o), n = !1), n;
  }
  s(dT, "validChunk");
  Ce.prototype.write = function(e, t, r) {
    var i = this._writableState, n = !1, o = !i.objectMode && uT(e);
    return o && !uo.isBuffer(e) && (e = aT(e)), typeof t == "function" && (r = t, t = null), o ? t = "buffer" : t || (t = i.defaultEncoding),
    typeof r != "function" && (r = lT), i.ended ? cT(this, r) : (o || dT(this, i, e, r)) && (i.pendingcb++, n = hT(this, i, o, e, t, r)), n;
  };
  Ce.prototype.cork = function() {
    var e = this._writableState;
    e.corked++;
  };
  Ce.prototype.uncork = function() {
    var e = this._writableState;
    e.corked && (e.corked--, !e.writing && !e.corked && !e.bufferProcessing && e.bufferedRequest && Qg(this, e));
  };
  Ce.prototype.setDefaultEncoding = /* @__PURE__ */ s(function(t) {
    if (typeof t == "string" && (t = t.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "\
utf-16le", "raw"].indexOf((t + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + t);
    return this._writableState.defaultEncoding = t, this;
  }, "setDefaultEncoding");
  function fT(e, t, r) {
    return !e.objectMode && e.decodeStrings !== !1 && typeof t == "string" && (t = uo.from(t, r)), t;
  }
  s(fT, "decodeChunk");
  Object.defineProperty(Ce.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  function hT(e, t, r, i, n, o) {
    if (!r) {
      var a = fT(t, i, n);
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
      jl(e, t, !1, u, i, n, o);
    return l;
  }
  s(hT, "writeOrBuffer");
  function jl(e, t, r, i, n, o, a) {
    t.writelen = i, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(n, t.onwrite) : e._write(n, o, t.onwrite), t.sync = !1;
  }
  s(jl, "doWrite");
  function pT(e, t, r, i, n) {
    --t.pendingcb, r ? (yr.nextTick(n, i), yr.nextTick(wn, e, t), e._writableState.errorEmitted = !0, e.emit("error", i)) : (n(i), e._writableState.
    errorEmitted = !0, e.emit("error", i), wn(e, t));
  }
  s(pT, "onwriteError");
  function DT(e) {
    e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
  }
  s(DT, "onwriteStateUpdate");
  function mT(e, t) {
    var r = e._writableState, i = r.sync, n = r.writecb;
    if (DT(r), t) pT(e, r, i, t, n);
    else {
      var o = ey(r);
      !o && !r.corked && !r.bufferProcessing && r.bufferedRequest && Qg(e, r), i ? nT(Gg, e, r, o, n) : Gg(e, r, o, n);
    }
  }
  s(mT, "onwrite");
  function Gg(e, t, r, i) {
    r || gT(e, t), t.pendingcb--, i(), wn(e, t);
  }
  s(Gg, "afterWrite");
  function gT(e, t) {
    t.length === 0 && t.needDrain && (t.needDrain = !1, e.emit("drain"));
  }
  s(gT, "onwriteDrain");
  function Qg(e, t) {
    t.bufferProcessing = !0;
    var r = t.bufferedRequest;
    if (e._writev && r && r.next) {
      var i = t.bufferedRequestCount, n = new Array(i), o = t.corkedRequestsFree;
      o.entry = r;
      for (var a = 0, u = !0; r; )
        n[a] = r, r.isBuf || (u = !1), r = r.next, a += 1;
      n.allBuffers = u, jl(e, t, !0, t.length, n, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree =
      o.next, o.next = null) : t.corkedRequestsFree = new Kg(t), t.bufferedRequestCount = 0;
    } else {
      for (; r; ) {
        var l = r.chunk, c = r.encoding, d = r.callback, p = t.objectMode ? 1 : l.length;
        if (jl(e, t, !1, p, l, c, d), r = r.next, t.bufferedRequestCount--, t.writing)
          break;
      }
      r === null && (t.lastBufferedRequest = null);
    }
    t.bufferedRequest = r, t.bufferProcessing = !1;
  }
  s(Qg, "clearBuffer");
  Ce.prototype._write = function(e, t, r) {
    r(new Error("_write() is not implemented"));
  };
  Ce.prototype._writev = null;
  Ce.prototype.end = function(e, t, r) {
    var i = this._writableState;
    typeof e == "function" ? (r = e, e = null, t = null) : typeof t == "function" && (r = t, t = null), e != null && this.write(e, t), i.corked &&
    (i.corked = 1, this.uncork()), i.ending || vT(this, i, r);
  };
  function ey(e) {
    return e.ending && e.length === 0 && e.bufferedRequest === null && !e.finished && !e.writing;
  }
  s(ey, "needFinish");
  function yT(e, t) {
    e._final(function(r) {
      t.pendingcb--, r && e.emit("error", r), t.prefinished = !0, e.emit("prefinish"), wn(e, t);
    });
  }
  s(yT, "callFinal");
  function bT(e, t) {
    !t.prefinished && !t.finalCalled && (typeof e._final == "function" ? (t.pendingcb++, t.finalCalled = !0, yr.nextTick(yT, e, t)) : (t.prefinished =
    !0, e.emit("prefinish")));
  }
  s(bT, "prefinish");
  function wn(e, t) {
    var r = ey(t);
    return r && (bT(e, t), t.pendingcb === 0 && (t.finished = !0, e.emit("finish"))), r;
  }
  s(wn, "finishMaybe");
  function vT(e, t, r) {
    t.ending = !0, wn(e, t), r && (t.finished ? yr.nextTick(r) : e.once("finish", r)), t.ended = !0, e.writable = !1;
  }
  s(vT, "endWritable");
  function _T(e, t, r) {
    var i = e.entry;
    for (e.entry = null; i; ) {
      var n = i.callback;
      t.pendingcb--, n(r), i = i.next;
    }
    t.corkedRequestsFree.next = e;
  }
  s(_T, "onCorkedFinish");
  Object.defineProperty(Ce.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._writableState && (this._writableState.destroyed = e);
    }, "set")
  });
  Ce.prototype.destroy = Xg.destroy;
  Ce.prototype._undestroy = Xg.undestroy;
  Ce.prototype._destroy = function(e, t) {
    this.end(), t(e);
  };
});

// ../node_modules/through2/node_modules/readable-stream/lib/_stream_duplex.js
var br = b((zM, sy) => {
  "use strict";
  var ry = Ve(), wT = Object.keys || function(e) {
    var t = [];
    for (var r in e)
      t.push(r);
    return t;
  };
  sy.exports = Pt;
  var iy = Object.create(je());
  iy.inherits = oe();
  var ny = Ul(), Nl = ql();
  iy.inherits(Pt, ny);
  for (Ll = wT(Nl.prototype), lo = 0; lo < Ll.length; lo++)
    co = Ll[lo], Pt.prototype[co] || (Pt.prototype[co] = Nl.prototype[co]);
  var Ll, co, lo;
  function Pt(e) {
    if (!(this instanceof Pt)) return new Pt(e);
    ny.call(this, e), Nl.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.
    allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", ET);
  }
  s(Pt, "Duplex");
  Object.defineProperty(Pt.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  function ET() {
    this.allowHalfOpen || this._writableState.ended || ry.nextTick(CT, this);
  }
  s(ET, "onend");
  function CT(e) {
    e.end();
  }
  s(CT, "onEndNT");
  Object.defineProperty(Pt.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = e, this._writableState.destroyed =
      e);
    }, "set")
  });
  Pt.prototype._destroy = function(e, t) {
    this.push(null), this.end(), ry.nextTick(t, e);
  };
});

// ../node_modules/through2/node_modules/readable-stream/lib/_stream_readable.js
var Ul = b((YM, gy) => {
  "use strict";
  var mi = Ve();
  gy.exports = de;
  var xT = Ug(), Cn;
  de.ReadableState = fy;
  var KM = x("events").EventEmitter, ly = /* @__PURE__ */ s(function(e, t) {
    return e.listeners(t).length;
  }, "EElistenerCount"), Zl = Bl(), xn = no().Buffer, FT = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ?
  self : {}).Uint8Array || function() {
  };
  function ST(e) {
    return xn.from(e);
  }
  s(ST, "_uint8ArrayToBuffer");
  function TT(e) {
    return xn.isBuffer(e) || e instanceof FT;
  }
  s(TT, "_isUint8Array");
  var cy = Object.create(je());
  cy.inherits = oe();
  var $l = x("util"), ee = void 0;
  $l && $l.debuglog ? ee = $l.debuglog("stream") : ee = /* @__PURE__ */ s(function() {
  }, "debug");
  var AT = Zg(), dy = Ml(), Di;
  cy.inherits(de, Zl);
  var Wl = ["error", "close", "destroy", "pause", "resume"];
  function RT(e, t, r) {
    if (typeof e.prependListener == "function") return e.prependListener(t, r);
    !e._events || !e._events[t] ? e.on(t, r) : xT(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]];
  }
  s(RT, "prependListener");
  function fy(e, t) {
    Cn = Cn || br(), e = e || {};
    var r = t instanceof Cn;
    this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.readableObjectMode);
    var i = e.highWaterMark, n = e.readableHighWaterMark, o = this.objectMode ? 16 : 16 * 1024;
    i || i === 0 ? this.highWaterMark = i : r && (n || n === 0) ? this.highWaterMark = n : this.highWaterMark = o, this.highWaterMark = Math.
    floor(this.highWaterMark), this.buffer = new AT(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended =
    !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening =
    !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore =
    !1, this.decoder = null, this.encoding = null, e.encoding && (Di || (Di = x("string_decoder/").StringDecoder), this.decoder = new Di(e.encoding),
    this.encoding = e.encoding);
  }
  s(fy, "ReadableState");
  function de(e) {
    if (Cn = Cn || br(), !(this instanceof de)) return new de(e);
    this._readableState = new fy(e, this), this.readable = !0, e && (typeof e.read == "function" && (this._read = e.read), typeof e.destroy ==
    "function" && (this._destroy = e.destroy)), Zl.call(this);
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
  de.prototype.destroy = dy.destroy;
  de.prototype._undestroy = dy.undestroy;
  de.prototype._destroy = function(e, t) {
    this.push(null), t(e);
  };
  de.prototype.push = function(e, t) {
    var r = this._readableState, i;
    return r.objectMode ? i = !0 : typeof e == "string" && (t = t || r.defaultEncoding, t !== r.encoding && (e = xn.from(e, t), t = ""), i =
    !0), hy(this, e, t, !1, i);
  };
  de.prototype.unshift = function(e) {
    return hy(this, e, null, !0, !1);
  };
  function hy(e, t, r, i, n) {
    var o = e._readableState;
    if (t === null)
      o.reading = !1, PT(e, o);
    else {
      var a;
      n || (a = kT(o, t)), a ? e.emit("error", a) : o.objectMode || t && t.length > 0 ? (typeof t != "string" && !o.objectMode && Object.getPrototypeOf(
      t) !== xn.prototype && (t = ST(t)), i ? o.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : Hl(e, o, t, !0) :
      o.ended ? e.emit("error", new Error("stream.push() after EOF")) : (o.reading = !1, o.decoder && !r ? (t = o.decoder.write(t), o.objectMode ||
      t.length !== 0 ? Hl(e, o, t, !1) : py(e, o)) : Hl(e, o, t, !1))) : i || (o.reading = !1);
    }
    return OT(o);
  }
  s(hy, "readableAddChunk");
  function Hl(e, t, r, i) {
    t.flowing && t.length === 0 && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(
    r) : t.buffer.push(r), t.needReadable && fo(e)), py(e, t);
  }
  s(Hl, "addChunk");
  function kT(e, t) {
    var r;
    return !TT(t) && typeof t != "string" && t !== void 0 && !e.objectMode && (r = new TypeError("Invalid non-string/buffer chunk")), r;
  }
  s(kT, "chunkInvalid");
  function OT(e) {
    return !e.ended && (e.needReadable || e.length < e.highWaterMark || e.length === 0);
  }
  s(OT, "needMoreData");
  de.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  };
  de.prototype.setEncoding = function(e) {
    return Di || (Di = x("string_decoder/").StringDecoder), this._readableState.decoder = new Di(e), this._readableState.encoding = e, this;
  };
  var oy = 8388608;
  function BT(e) {
    return e >= oy ? e = oy : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
  }
  s(BT, "computeNewHighWaterMark");
  function ay(e, t) {
    return e <= 0 || t.length === 0 && t.ended ? 0 : t.objectMode ? 1 : e !== e ? t.flowing && t.length ? t.buffer.head.data.length : t.length :
    (e > t.highWaterMark && (t.highWaterMark = BT(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
  }
  s(ay, "howMuchToRead");
  de.prototype.read = function(e) {
    ee("read", e), e = parseInt(e, 10);
    var t = this._readableState, r = e;
    if (e !== 0 && (t.emittedReadable = !1), e === 0 && t.needReadable && (t.length >= t.highWaterMark || t.ended))
      return ee("read: emitReadable", t.length, t.ended), t.length === 0 && t.ended ? Vl(this) : fo(this), null;
    if (e = ay(e, t), e === 0 && t.ended)
      return t.length === 0 && Vl(this), null;
    var i = t.needReadable;
    ee("need readable", i), (t.length === 0 || t.length - e < t.highWaterMark) && (i = !0, ee("length less than watermark", i)), t.ended || t.
    reading ? (i = !1, ee("reading or ended", i)) : i && (ee("do read"), t.reading = !0, t.sync = !0, t.length === 0 && (t.needReadable = !0),
    this._read(t.highWaterMark), t.sync = !1, t.reading || (e = ay(r, t)));
    var n;
    return e > 0 ? n = Dy(e, t) : n = null, n === null ? (t.needReadable = !0, e = 0) : t.length -= e, t.length === 0 && (t.ended || (t.needReadable =
    !0), r !== e && t.ended && Vl(this)), n !== null && this.emit("data", n), n;
  };
  function PT(e, t) {
    if (!t.ended) {
      if (t.decoder) {
        var r = t.decoder.end();
        r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
      }
      t.ended = !0, fo(e);
    }
  }
  s(PT, "onEofChunk");
  function fo(e) {
    var t = e._readableState;
    t.needReadable = !1, t.emittedReadable || (ee("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? mi.nextTick(uy, e) : uy(e));
  }
  s(fo, "emitReadable");
  function uy(e) {
    ee("emit readable"), e.emit("readable"), zl(e);
  }
  s(uy, "emitReadable_");
  function py(e, t) {
    t.readingMore || (t.readingMore = !0, mi.nextTick(IT, e, t));
  }
  s(py, "maybeReadMore");
  function IT(e, t) {
    for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (ee("maybeReadMore read 0"), e.read(0), r !==
    t.length); )
      r = t.length;
    t.readingMore = !1;
  }
  s(IT, "maybeReadMore_");
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
    i.pipesCount += 1, ee("pipe count=%d opts=%j", i.pipesCount, t);
    var n = (!t || t.end !== !1) && e !== process.stdout && e !== process.stderr, o = n ? u : _;
    i.endEmitted ? mi.nextTick(o) : r.once("end", o), e.on("unpipe", a);
    function a(C, F) {
      ee("onunpipe"), C === r && F && F.hasUnpiped === !1 && (F.hasUnpiped = !0, d());
    }
    s(a, "onunpipe");
    function u() {
      ee("onend"), e.end();
    }
    s(u, "onend");
    var l = MT(r);
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
      var F = e.write(C);
      F === !1 && !p && ((i.pipesCount === 1 && i.pipes === e || i.pipesCount > 1 && my(i.pipes, e) !== -1) && !c && (ee("false write respon\
se, pause", i.awaitDrain), i.awaitDrain++, p = !0), r.pause());
    }
    s(h, "ondata");
    function f(C) {
      ee("onerror", C), _(), e.removeListener("error", f), ly(e, "error") === 0 && e.emit("error", C);
    }
    s(f, "onerror"), RT(e, "error", f);
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
  function MT(e) {
    return function() {
      var t = e._readableState;
      ee("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, t.awaitDrain === 0 && ly(e, "data") && (t.flowing = !0, zl(e));
    };
  }
  s(MT, "pipeOnDrain");
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
    var a = my(t.pipes, e);
    return a === -1 ? this : (t.pipes.splice(a, 1), t.pipesCount -= 1, t.pipesCount === 1 && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r),
    this);
  };
  de.prototype.on = function(e, t) {
    var r = Zl.prototype.on.call(this, e, t);
    if (e === "data")
      this._readableState.flowing !== !1 && this.resume();
    else if (e === "readable") {
      var i = this._readableState;
      !i.endEmitted && !i.readableListening && (i.readableListening = i.needReadable = !0, i.emittedReadable = !1, i.reading ? i.length && fo(
      this) : mi.nextTick(jT, this));
    }
    return r;
  };
  de.prototype.addListener = de.prototype.on;
  function jT(e) {
    ee("readable nexttick read 0"), e.read(0);
  }
  s(jT, "nReadingNextTick");
  de.prototype.resume = function() {
    var e = this._readableState;
    return e.flowing || (ee("resume"), e.flowing = !0, qT(this, e)), this;
  };
  function qT(e, t) {
    t.resumeScheduled || (t.resumeScheduled = !0, mi.nextTick(LT, e, t));
  }
  s(qT, "resume");
  function LT(e, t) {
    t.reading || (ee("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), zl(e), t.flowing && !t.reading &&
    e.read(0);
  }
  s(LT, "resume_");
  de.prototype.pause = function() {
    return ee("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (ee("pause"), this._readableState.
    flowing = !1, this.emit("pause")), this;
  };
  function zl(e) {
    var t = e._readableState;
    for (ee("flow", t.flowing); t.flowing && e.read() !== null; )
      ;
  }
  s(zl, "flow");
  de.prototype.wrap = function(e) {
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
    for (var o = 0; o < Wl.length; o++)
      e.on(Wl[o], this.emit.bind(this, Wl[o]));
    return this._read = function(a) {
      ee("wrapped _read", a), i && (i = !1, e.resume());
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
  de._fromList = Dy;
  function Dy(e, t) {
    if (t.length === 0) return null;
    var r;
    return t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (t.decoder ? r = t.buffer.join("") : t.buffer.length === 1 ? r = t.buffer.
    head.data : r = t.buffer.concat(t.length), t.buffer.clear()) : r = NT(e, t.buffer, t.decoder), r;
  }
  s(Dy, "fromList");
  function NT(e, t, r) {
    var i;
    return e < t.head.data.length ? (i = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : e === t.head.data.length ? i = t.shift() :
    i = r ? UT(e, t) : $T(e, t), i;
  }
  s(NT, "fromListPartial");
  function UT(e, t) {
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
  s(UT, "copyFromBufferString");
  function $T(e, t) {
    var r = xn.allocUnsafe(e), i = t.head, n = 1;
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
  s($T, "copyFromBuffer");
  function Vl(e) {
    var t = e._readableState;
    if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
    t.endEmitted || (t.ended = !0, mi.nextTick(WT, t, e));
  }
  s(Vl, "endReadable");
  function WT(e, t) {
    !e.endEmitted && e.length === 0 && (e.endEmitted = !0, t.readable = !1, t.emit("end"));
  }
  s(WT, "endReadableNT");
  function my(e, t) {
    for (var r = 0, i = e.length; r < i; r++)
      if (e[r] === t) return r;
    return -1;
  }
  s(my, "indexOf");
});

// ../node_modules/through2/node_modules/readable-stream/lib/_stream_transform.js
var Gl = b((XM, vy) => {
  "use strict";
  vy.exports = It;
  var ho = br(), by = Object.create(je());
  by.inherits = oe();
  by.inherits(It, ho);
  function HT(e, t) {
    var r = this._transformState;
    r.transforming = !1;
    var i = r.writecb;
    if (!i)
      return this.emit("error", new Error("write callback called multiple times"));
    r.writechunk = null, r.writecb = null, t != null && this.push(t), i(e);
    var n = this._readableState;
    n.reading = !1, (n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
  }
  s(HT, "afterTransform");
  function It(e) {
    if (!(this instanceof It)) return new It(e);
    ho.call(this, e), this._transformState = {
      afterTransform: HT.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && (typeof e.transform == "function" && (this._transform = e.
    transform), typeof e.flush == "function" && (this._flush = e.flush)), this.on("prefinish", VT);
  }
  s(It, "Transform");
  function VT() {
    var e = this;
    typeof this._flush == "function" ? this._flush(function(t, r) {
      yy(e, t, r);
    }) : yy(this, null, null);
  }
  s(VT, "prefinish");
  It.prototype.push = function(e, t) {
    return this._transformState.needTransform = !1, ho.prototype.push.call(this, e, t);
  };
  It.prototype._transform = function(e, t, r) {
    throw new Error("_transform() is not implemented");
  };
  It.prototype._write = function(e, t, r) {
    var i = this._transformState;
    if (i.writecb = r, i.writechunk = e, i.writeencoding = t, !i.transforming) {
      var n = this._readableState;
      (i.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
    }
  };
  It.prototype._read = function(e) {
    var t = this._transformState;
    t.writechunk !== null && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) :
    t.needTransform = !0;
  };
  It.prototype._destroy = function(e, t) {
    var r = this;
    ho.prototype._destroy.call(this, e, function(i) {
      t(i), r.emit("close");
    });
  };
  function yy(e, t, r) {
    if (t) return e.emit("error", t);
    if (r != null && e.push(r), e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
    if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
    return e.push(null);
  }
  s(yy, "done");
});

// ../node_modules/through2/node_modules/readable-stream/lib/_stream_passthrough.js
var Cy = b((ej, Ey) => {
  "use strict";
  Ey.exports = Fn;
  var _y = Gl(), wy = Object.create(je());
  wy.inherits = oe();
  wy.inherits(Fn, _y);
  function Fn(e) {
    if (!(this instanceof Fn)) return new Fn(e);
    _y.call(this, e);
  }
  s(Fn, "PassThrough");
  Fn.prototype._transform = function(e, t, r) {
    r(null, e);
  };
});

// ../node_modules/through2/node_modules/readable-stream/readable.js
var xy = b((Oe, po) => {
  var mt = x("stream");
  process.env.READABLE_STREAM === "disable" && mt ? (po.exports = mt, Oe = po.exports = mt.Readable, Oe.Readable = mt.Readable, Oe.Writable =
  mt.Writable, Oe.Duplex = mt.Duplex, Oe.Transform = mt.Transform, Oe.PassThrough = mt.PassThrough, Oe.Stream = mt) : (Oe = po.exports = Ul(),
  Oe.Stream = mt || Oe, Oe.Readable = Oe, Oe.Writable = ql(), Oe.Duplex = br(), Oe.Transform = Gl(), Oe.PassThrough = Cy());
});

// ../node_modules/xtend/immutable.js
var Sy = b((rj, Fy) => {
  Fy.exports = zT;
  var ZT = Object.prototype.hasOwnProperty;
  function zT() {
    for (var e = {}, t = 0; t < arguments.length; t++) {
      var r = arguments[t];
      for (var i in r)
        ZT.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }
  s(zT, "extend");
});

// ../node_modules/through2/through2.js
var Yl = b((nj, Do) => {
  var Ty = xy().Transform, Ay = x("util").inherits, Ry = Sy();
  function gi(e) {
    Ty.call(this, e), this._destroyed = !1;
  }
  s(gi, "DestroyableTransform");
  Ay(gi, Ty);
  gi.prototype.destroy = function(e) {
    if (!this._destroyed) {
      this._destroyed = !0;
      var t = this;
      process.nextTick(function() {
        e && t.emit("error", e), t.emit("close");
      });
    }
  };
  function GT(e, t, r) {
    r(null, e);
  }
  s(GT, "noop");
  function Kl(e) {
    return function(t, r, i) {
      return typeof t == "function" && (i = r, r = t, t = {}), typeof r != "function" && (r = GT), typeof i != "function" && (i = null), e(t,
      r, i);
    };
  }
  s(Kl, "through2");
  Do.exports = Kl(function(e, t, r) {
    var i = new gi(e);
    return i._transform = t, r && (i._flush = r), i;
  });
  Do.exports.ctor = Kl(function(e, t, r) {
    function i(n) {
      if (!(this instanceof i))
        return new i(n);
      this.options = Ry(e, n), gi.call(this, this.options);
    }
    return s(i, "Through2"), Ay(i, gi), i.prototype._transform = t, r && (i.prototype._flush = r), i;
  });
  Do.exports.obj = Kl(function(e, t, r) {
    var i = new gi(Ry({ objectMode: !0, highWaterMark: 16 }, e));
    return i._transform = t, r && (i._flush = r), i;
  });
});

// ../node_modules/buffer-from/index.js
var Oy = b((oj, ky) => {
  var KT = Object.prototype.toString, Jl = typeof Buffer < "u" && typeof Buffer.alloc == "function" && typeof Buffer.allocUnsafe == "functio\
n" && typeof Buffer.from == "function";
  function YT(e) {
    return KT.call(e).slice(8, -1) === "ArrayBuffer";
  }
  s(YT, "isArrayBuffer");
  function JT(e, t, r) {
    t >>>= 0;
    var i = e.byteLength - t;
    if (i < 0)
      throw new RangeError("'offset' is out of bounds");
    if (r === void 0)
      r = i;
    else if (r >>>= 0, r > i)
      throw new RangeError("'length' is out of bounds");
    return Jl ? Buffer.from(e.slice(t, t + r)) : new Buffer(new Uint8Array(e.slice(t, t + r)));
  }
  s(JT, "fromArrayBuffer");
  function XT(e, t) {
    if ((typeof t != "string" || t === "") && (t = "utf8"), !Buffer.isEncoding(t))
      throw new TypeError('"encoding" must be a valid string encoding');
    return Jl ? Buffer.from(e, t) : new Buffer(e, t);
  }
  s(XT, "fromString");
  function QT(e, t, r) {
    if (typeof e == "number")
      throw new TypeError('"value" argument must not be a number');
    return YT(e) ? JT(e, t, r) : typeof e == "string" ? XT(e, t) : Jl ? Buffer.from(e) : new Buffer(e);
  }
  s(QT, "bufferFrom");
  ky.exports = QT;
});

// ../node_modules/peek-stream/index.js
var Iy = b((uj, Py) => {
  var eA = Lg(), tA = Yl(), rA = Oy(), iA = /* @__PURE__ */ s(function(e) {
    return !Buffer.isBuffer(e) && typeof e != "string";
  }, "isObject"), By = /* @__PURE__ */ s(function(e, t) {
    if (typeof e == "number" && (e = { maxBuffer: e }), typeof e == "function") return By(null, e);
    e || (e = {});
    var r = typeof e.maxBuffer == "number" ? e.maxBuffer : 65535, i = e.strict, n = e.newline !== !1, o = [], a = 0, u = eA.obj(), l = tA.obj(
    { highWaterMark: 1 }, function(p, h, f) {
      if (iA(p)) return d(p, null, f);
      if (Buffer.isBuffer(p) || (p = rA(p)), n) {
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
  Py.exports = By;
});

// ../node_modules/pumpify/node_modules/pump/index.js
var qy = b((cj, jy) => {
  var nA = vs(), sA = Xr(), Xl = x("fs"), Sn = /* @__PURE__ */ s(function() {
  }, "noop"), oA = /^v?\.0/.test(process.version), mo = /* @__PURE__ */ s(function(e) {
    return typeof e == "function";
  }, "isFn"), aA = /* @__PURE__ */ s(function(e) {
    return !oA || !Xl ? !1 : (e instanceof (Xl.ReadStream || Sn) || e instanceof (Xl.WriteStream || Sn)) && mo(e.close);
  }, "isFS"), uA = /* @__PURE__ */ s(function(e) {
    return e.setHeader && mo(e.abort);
  }, "isRequest"), lA = /* @__PURE__ */ s(function(e, t, r, i) {
    i = nA(i);
    var n = !1;
    e.on("close", function() {
      n = !0;
    }), sA(e, { readable: t, writable: r }, function(a) {
      if (a) return i(a);
      n = !0, i();
    });
    var o = !1;
    return function(a) {
      if (!n && !o) {
        if (o = !0, aA(e)) return e.close(Sn);
        if (uA(e)) return e.abort();
        if (mo(e.destroy)) return e.destroy();
        i(a || new Error("stream was destroyed"));
      }
    };
  }, "destroyer"), My = /* @__PURE__ */ s(function(e) {
    e();
  }, "call"), cA = /* @__PURE__ */ s(function(e, t) {
    return e.pipe(t);
  }, "pipe"), dA = /* @__PURE__ */ s(function() {
    var e = Array.prototype.slice.call(arguments), t = mo(e[e.length - 1] || Sn) && e.pop() || Sn;
    if (Array.isArray(e[0]) && (e = e[0]), e.length < 2) throw new Error("pump requires two streams per minimum");
    var r, i = e.map(function(n, o) {
      var a = o < e.length - 1, u = o > 0;
      return lA(n, a, u, function(l) {
        r || (r = l), l && i.forEach(My), !a && (i.forEach(My), t(r));
      });
    });
    e.reduce(cA);
  }, "pump");
  jy.exports = dA;
});

// ../node_modules/pumpify/node_modules/isarray/index.js
var Ny = b((fj, Ly) => {
  var fA = {}.toString;
  Ly.exports = Array.isArray || function(e) {
    return fA.call(e) == "[object Array]";
  };
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/internal/streams/stream.js
var Ql = b((hj, Uy) => {
  Uy.exports = x("stream");
});

// ../node_modules/pumpify/node_modules/safe-buffer/index.js
var yo = b((ec, Wy) => {
  var go = x("buffer"), Mt = go.Buffer;
  function $y(e, t) {
    for (var r in e)
      t[r] = e[r];
  }
  s($y, "copyProps");
  Mt.from && Mt.alloc && Mt.allocUnsafe && Mt.allocUnsafeSlow ? Wy.exports = go : ($y(go, ec), ec.Buffer = yi);
  function yi(e, t, r) {
    return Mt(e, t, r);
  }
  s(yi, "SafeBuffer");
  $y(Mt, yi);
  yi.from = function(e, t, r) {
    if (typeof e == "number")
      throw new TypeError("Argument must not be a number");
    return Mt(e, t, r);
  };
  yi.alloc = function(e, t, r) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    var i = Mt(e);
    return t !== void 0 ? typeof r == "string" ? i.fill(t, r) : i.fill(t) : i.fill(0), i;
  };
  yi.allocUnsafe = function(e) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    return Mt(e);
  };
  yi.allocUnsafeSlow = function(e) {
    if (typeof e != "number")
      throw new TypeError("Argument must be a number");
    return go.SlowBuffer(e);
  };
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/internal/streams/BufferList.js
var Vy = b((Dj, tc) => {
  "use strict";
  function hA(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  s(hA, "_classCallCheck");
  var Hy = yo().Buffer, Tn = x("util");
  function pA(e, t, r) {
    e.copy(t, r);
  }
  s(pA, "copyBuffer");
  tc.exports = function() {
    function e() {
      hA(this, e), this.head = null, this.tail = null, this.length = 0;
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
      if (this.length === 0) return Hy.alloc(0);
      for (var i = Hy.allocUnsafe(r >>> 0), n = this.head, o = 0; n; )
        pA(n.data, i, o), o += n.data.length, n = n.next;
      return i;
    }, "concat"), e;
  }();
  Tn && Tn.inspect && Tn.inspect.custom && (tc.exports.prototype[Tn.inspect.custom] = function() {
    var e = Tn.inspect({ length: this.length });
    return this.constructor.name + " " + e;
  });
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/internal/streams/destroy.js
var rc = b((gj, Zy) => {
  "use strict";
  var bo = Ve();
  function DA(e, t) {
    var r = this, i = this._readableState && this._readableState.destroyed, n = this._writableState && this._writableState.destroyed;
    return i || n ? (t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, bo.nextTick(
    vo, this, e)) : bo.nextTick(vo, this, e)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this.
    _writableState.destroyed = !0), this._destroy(e || null, function(o) {
      !t && o ? r._writableState ? r._writableState.errorEmitted || (r._writableState.errorEmitted = !0, bo.nextTick(vo, r, o)) : bo.nextTick(
      vo, r, o) : t && t(o);
    }), this);
  }
  s(DA, "destroy");
  function mA() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.
    endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending =
    !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted =
    !1);
  }
  s(mA, "undestroy");
  function vo(e, t) {
    e.emit("error", t);
  }
  s(vo, "emitErrorNT");
  Zy.exports = {
    destroy: DA,
    undestroy: mA
  };
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/_stream_writable.js
var nc = b((bj, eb) => {
  "use strict";
  var vr = Ve();
  eb.exports = xe;
  function Gy(e) {
    var t = this;
    this.next = null, this.entry = null, this.finish = function() {
      PA(t, e);
    };
  }
  s(Gy, "CorkedRequest");
  var gA = !process.browser && ["v0.10", "v0.9."].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : vr.nextTick, bi;
  xe.WritableState = Rn;
  var Ky = Object.create(je());
  Ky.inherits = oe();
  var yA = {
    deprecate: Qi()
  }, Yy = Ql(), wo = yo().Buffer, bA = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array ||
  function() {
  };
  function vA(e) {
    return wo.from(e);
  }
  s(vA, "_uint8ArrayToBuffer");
  function _A(e) {
    return wo.isBuffer(e) || e instanceof bA;
  }
  s(_A, "_isUint8Array");
  var Jy = rc();
  Ky.inherits(xe, Yy);
  function wA() {
  }
  s(wA, "nop");
  function Rn(e, t) {
    bi = bi || _r(), e = e || {};
    var r = t instanceof bi;
    this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.writableObjectMode);
    var i = e.highWaterMark, n = e.writableHighWaterMark, o = this.objectMode ? 16 : 16 * 1024;
    i || i === 0 ? this.highWaterMark = i : r && (n || n === 0) ? this.highWaterMark = n : this.highWaterMark = o, this.highWaterMark = Math.
    floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed =
    !1;
    var a = e.decodeStrings === !1;
    this.decodeStrings = !a, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync =
    !0, this.bufferProcessing = !1, this.onwrite = function(u) {
      AA(t, u);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished =
    !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new Gy(this);
  }
  s(Rn, "WritableState");
  Rn.prototype.getBuffer = /* @__PURE__ */ s(function() {
    for (var t = this.bufferedRequest, r = []; t; )
      r.push(t), t = t.next;
    return r;
  }, "getBuffer");
  (function() {
    try {
      Object.defineProperty(Rn.prototype, "buffer", {
        get: yA.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  })();
  var _o;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (_o = Function.prototype[Symbol.
  hasInstance], Object.defineProperty(xe, Symbol.hasInstance, {
    value: /* @__PURE__ */ s(function(e) {
      return _o.call(this, e) ? !0 : this !== xe ? !1 : e && e._writableState instanceof Rn;
    }, "value")
  })) : _o = /* @__PURE__ */ s(function(e) {
    return e instanceof this;
  }, "realHasInstance");
  function xe(e) {
    if (bi = bi || _r(), !_o.call(xe, this) && !(this instanceof bi))
      return new xe(e);
    this._writableState = new Rn(e, this), this.writable = !0, e && (typeof e.write == "function" && (this._write = e.write), typeof e.writev ==
    "function" && (this._writev = e.writev), typeof e.destroy == "function" && (this._destroy = e.destroy), typeof e.final == "function" && (this.
    _final = e.final)), Yy.call(this);
  }
  s(xe, "Writable");
  xe.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function EA(e, t) {
    var r = new Error("write after end");
    e.emit("error", r), vr.nextTick(t, r);
  }
  s(EA, "writeAfterEnd");
  function CA(e, t, r, i) {
    var n = !0, o = !1;
    return r === null ? o = new TypeError("May not write null values to stream") : typeof r != "string" && r !== void 0 && !t.objectMode && (o =
    new TypeError("Invalid non-string/buffer chunk")), o && (e.emit("error", o), vr.nextTick(i, o), n = !1), n;
  }
  s(CA, "validChunk");
  xe.prototype.write = function(e, t, r) {
    var i = this._writableState, n = !1, o = !i.objectMode && _A(e);
    return o && !wo.isBuffer(e) && (e = vA(e)), typeof t == "function" && (r = t, t = null), o ? t = "buffer" : t || (t = i.defaultEncoding),
    typeof r != "function" && (r = wA), i.ended ? EA(this, r) : (o || CA(this, i, e, r)) && (i.pendingcb++, n = FA(this, i, o, e, t, r)), n;
  };
  xe.prototype.cork = function() {
    var e = this._writableState;
    e.corked++;
  };
  xe.prototype.uncork = function() {
    var e = this._writableState;
    e.corked && (e.corked--, !e.writing && !e.corked && !e.bufferProcessing && e.bufferedRequest && Xy(this, e));
  };
  xe.prototype.setDefaultEncoding = /* @__PURE__ */ s(function(t) {
    if (typeof t == "string" && (t = t.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "\
utf-16le", "raw"].indexOf((t + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + t);
    return this._writableState.defaultEncoding = t, this;
  }, "setDefaultEncoding");
  function xA(e, t, r) {
    return !e.objectMode && e.decodeStrings !== !1 && typeof t == "string" && (t = wo.from(t, r)), t;
  }
  s(xA, "decodeChunk");
  Object.defineProperty(xe.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  function FA(e, t, r, i, n, o) {
    if (!r) {
      var a = xA(t, i, n);
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
      ic(e, t, !1, u, i, n, o);
    return l;
  }
  s(FA, "writeOrBuffer");
  function ic(e, t, r, i, n, o, a) {
    t.writelen = i, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(n, t.onwrite) : e._write(n, o, t.onwrite), t.sync = !1;
  }
  s(ic, "doWrite");
  function SA(e, t, r, i, n) {
    --t.pendingcb, r ? (vr.nextTick(n, i), vr.nextTick(An, e, t), e._writableState.errorEmitted = !0, e.emit("error", i)) : (n(i), e._writableState.
    errorEmitted = !0, e.emit("error", i), An(e, t));
  }
  s(SA, "onwriteError");
  function TA(e) {
    e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
  }
  s(TA, "onwriteStateUpdate");
  function AA(e, t) {
    var r = e._writableState, i = r.sync, n = r.writecb;
    if (TA(r), t) SA(e, r, i, t, n);
    else {
      var o = Qy(r);
      !o && !r.corked && !r.bufferProcessing && r.bufferedRequest && Xy(e, r), i ? gA(zy, e, r, o, n) : zy(e, r, o, n);
    }
  }
  s(AA, "onwrite");
  function zy(e, t, r, i) {
    r || RA(e, t), t.pendingcb--, i(), An(e, t);
  }
  s(zy, "afterWrite");
  function RA(e, t) {
    t.length === 0 && t.needDrain && (t.needDrain = !1, e.emit("drain"));
  }
  s(RA, "onwriteDrain");
  function Xy(e, t) {
    t.bufferProcessing = !0;
    var r = t.bufferedRequest;
    if (e._writev && r && r.next) {
      var i = t.bufferedRequestCount, n = new Array(i), o = t.corkedRequestsFree;
      o.entry = r;
      for (var a = 0, u = !0; r; )
        n[a] = r, r.isBuf || (u = !1), r = r.next, a += 1;
      n.allBuffers = u, ic(e, t, !0, t.length, n, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree =
      o.next, o.next = null) : t.corkedRequestsFree = new Gy(t), t.bufferedRequestCount = 0;
    } else {
      for (; r; ) {
        var l = r.chunk, c = r.encoding, d = r.callback, p = t.objectMode ? 1 : l.length;
        if (ic(e, t, !1, p, l, c, d), r = r.next, t.bufferedRequestCount--, t.writing)
          break;
      }
      r === null && (t.lastBufferedRequest = null);
    }
    t.bufferedRequest = r, t.bufferProcessing = !1;
  }
  s(Xy, "clearBuffer");
  xe.prototype._write = function(e, t, r) {
    r(new Error("_write() is not implemented"));
  };
  xe.prototype._writev = null;
  xe.prototype.end = function(e, t, r) {
    var i = this._writableState;
    typeof e == "function" ? (r = e, e = null, t = null) : typeof t == "function" && (r = t, t = null), e != null && this.write(e, t), i.corked &&
    (i.corked = 1, this.uncork()), i.ending || BA(this, i, r);
  };
  function Qy(e) {
    return e.ending && e.length === 0 && e.bufferedRequest === null && !e.finished && !e.writing;
  }
  s(Qy, "needFinish");
  function kA(e, t) {
    e._final(function(r) {
      t.pendingcb--, r && e.emit("error", r), t.prefinished = !0, e.emit("prefinish"), An(e, t);
    });
  }
  s(kA, "callFinal");
  function OA(e, t) {
    !t.prefinished && !t.finalCalled && (typeof e._final == "function" ? (t.pendingcb++, t.finalCalled = !0, vr.nextTick(kA, e, t)) : (t.prefinished =
    !0, e.emit("prefinish")));
  }
  s(OA, "prefinish");
  function An(e, t) {
    var r = Qy(t);
    return r && (OA(e, t), t.pendingcb === 0 && (t.finished = !0, e.emit("finish"))), r;
  }
  s(An, "finishMaybe");
  function BA(e, t, r) {
    t.ending = !0, An(e, t), r && (t.finished ? vr.nextTick(r) : e.once("finish", r)), t.ended = !0, e.writable = !1;
  }
  s(BA, "endWritable");
  function PA(e, t, r) {
    var i = e.entry;
    for (e.entry = null; i; ) {
      var n = i.callback;
      t.pendingcb--, n(r), i = i.next;
    }
    t.corkedRequestsFree.next = e;
  }
  s(PA, "onCorkedFinish");
  Object.defineProperty(xe.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._writableState && (this._writableState.destroyed = e);
    }, "set")
  });
  xe.prototype.destroy = Jy.destroy;
  xe.prototype._undestroy = Jy.undestroy;
  xe.prototype._destroy = function(e, t) {
    this.end(), t(e);
  };
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/_stream_duplex.js
var _r = b((_j, nb) => {
  "use strict";
  var tb = Ve(), IA = Object.keys || function(e) {
    var t = [];
    for (var r in e)
      t.push(r);
    return t;
  };
  nb.exports = jt;
  var rb = Object.create(je());
  rb.inherits = oe();
  var ib = ac(), oc = nc();
  rb.inherits(jt, ib);
  for (sc = IA(oc.prototype), Eo = 0; Eo < sc.length; Eo++)
    Co = sc[Eo], jt.prototype[Co] || (jt.prototype[Co] = oc.prototype[Co]);
  var sc, Co, Eo;
  function jt(e) {
    if (!(this instanceof jt)) return new jt(e);
    ib.call(this, e), oc.call(this, e), e && e.readable === !1 && (this.readable = !1), e && e.writable === !1 && (this.writable = !1), this.
    allowHalfOpen = !0, e && e.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", MA);
  }
  s(jt, "Duplex");
  Object.defineProperty(jt.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: /* @__PURE__ */ s(function() {
      return this._writableState.highWaterMark;
    }, "get")
  });
  function MA() {
    this.allowHalfOpen || this._writableState.ended || tb.nextTick(jA, this);
  }
  s(MA, "onend");
  function jA(e) {
    e.end();
  }
  s(jA, "onEndNT");
  Object.defineProperty(jt.prototype, "destroyed", {
    get: /* @__PURE__ */ s(function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    }, "get"),
    set: /* @__PURE__ */ s(function(e) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = e, this._writableState.destroyed =
      e);
    }, "set")
  });
  jt.prototype._destroy = function(e, t) {
    this.push(null), this.end(), tb.nextTick(t, e);
  };
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/_stream_readable.js
var ac = b((Cj, mb) => {
  "use strict";
  var _i = Ve();
  mb.exports = fe;
  var qA = Ny(), kn;
  fe.ReadableState = db;
  var Ej = x("events").EventEmitter, ub = /* @__PURE__ */ s(function(e, t) {
    return e.listeners(t).length;
  }, "EElistenerCount"), fc = Ql(), On = yo().Buffer, LA = (typeof global < "u" ? global : typeof window < "u" ? window : typeof self < "u" ?
  self : {}).Uint8Array || function() {
  };
  function NA(e) {
    return On.from(e);
  }
  s(NA, "_uint8ArrayToBuffer");
  function UA(e) {
    return On.isBuffer(e) || e instanceof LA;
  }
  s(UA, "_isUint8Array");
  var lb = Object.create(je());
  lb.inherits = oe();
  var uc = x("util"), te = void 0;
  uc && uc.debuglog ? te = uc.debuglog("stream") : te = /* @__PURE__ */ s(function() {
  }, "debug");
  var $A = Vy(), cb = rc(), vi;
  lb.inherits(fe, fc);
  var lc = ["error", "close", "destroy", "pause", "resume"];
  function WA(e, t, r) {
    if (typeof e.prependListener == "function") return e.prependListener(t, r);
    !e._events || !e._events[t] ? e.on(t, r) : qA(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]];
  }
  s(WA, "prependListener");
  function db(e, t) {
    kn = kn || _r(), e = e || {};
    var r = t instanceof kn;
    this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.readableObjectMode);
    var i = e.highWaterMark, n = e.readableHighWaterMark, o = this.objectMode ? 16 : 16 * 1024;
    i || i === 0 ? this.highWaterMark = i : r && (n || n === 0) ? this.highWaterMark = n : this.highWaterMark = o, this.highWaterMark = Math.
    floor(this.highWaterMark), this.buffer = new $A(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended =
    !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening =
    !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore =
    !1, this.decoder = null, this.encoding = null, e.encoding && (vi || (vi = x("string_decoder/").StringDecoder), this.decoder = new vi(e.encoding),
    this.encoding = e.encoding);
  }
  s(db, "ReadableState");
  function fe(e) {
    if (kn = kn || _r(), !(this instanceof fe)) return new fe(e);
    this._readableState = new db(e, this), this.readable = !0, e && (typeof e.read == "function" && (this._read = e.read), typeof e.destroy ==
    "function" && (this._destroy = e.destroy)), fc.call(this);
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
  fe.prototype.destroy = cb.destroy;
  fe.prototype._undestroy = cb.undestroy;
  fe.prototype._destroy = function(e, t) {
    this.push(null), t(e);
  };
  fe.prototype.push = function(e, t) {
    var r = this._readableState, i;
    return r.objectMode ? i = !0 : typeof e == "string" && (t = t || r.defaultEncoding, t !== r.encoding && (e = On.from(e, t), t = ""), i =
    !0), fb(this, e, t, !1, i);
  };
  fe.prototype.unshift = function(e) {
    return fb(this, e, null, !0, !1);
  };
  function fb(e, t, r, i, n) {
    var o = e._readableState;
    if (t === null)
      o.reading = !1, zA(e, o);
    else {
      var a;
      n || (a = HA(o, t)), a ? e.emit("error", a) : o.objectMode || t && t.length > 0 ? (typeof t != "string" && !o.objectMode && Object.getPrototypeOf(
      t) !== On.prototype && (t = NA(t)), i ? o.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : cc(e, o, t, !0) :
      o.ended ? e.emit("error", new Error("stream.push() after EOF")) : (o.reading = !1, o.decoder && !r ? (t = o.decoder.write(t), o.objectMode ||
      t.length !== 0 ? cc(e, o, t, !1) : hb(e, o)) : cc(e, o, t, !1))) : i || (o.reading = !1);
    }
    return VA(o);
  }
  s(fb, "readableAddChunk");
  function cc(e, t, r, i) {
    t.flowing && t.length === 0 && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(
    r) : t.buffer.push(r), t.needReadable && xo(e)), hb(e, t);
  }
  s(cc, "addChunk");
  function HA(e, t) {
    var r;
    return !UA(t) && typeof t != "string" && t !== void 0 && !e.objectMode && (r = new TypeError("Invalid non-string/buffer chunk")), r;
  }
  s(HA, "chunkInvalid");
  function VA(e) {
    return !e.ended && (e.needReadable || e.length < e.highWaterMark || e.length === 0);
  }
  s(VA, "needMoreData");
  fe.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  };
  fe.prototype.setEncoding = function(e) {
    return vi || (vi = x("string_decoder/").StringDecoder), this._readableState.decoder = new vi(e), this._readableState.encoding = e, this;
  };
  var sb = 8388608;
  function ZA(e) {
    return e >= sb ? e = sb : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
  }
  s(ZA, "computeNewHighWaterMark");
  function ob(e, t) {
    return e <= 0 || t.length === 0 && t.ended ? 0 : t.objectMode ? 1 : e !== e ? t.flowing && t.length ? t.buffer.head.data.length : t.length :
    (e > t.highWaterMark && (t.highWaterMark = ZA(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
  }
  s(ob, "howMuchToRead");
  fe.prototype.read = function(e) {
    te("read", e), e = parseInt(e, 10);
    var t = this._readableState, r = e;
    if (e !== 0 && (t.emittedReadable = !1), e === 0 && t.needReadable && (t.length >= t.highWaterMark || t.ended))
      return te("read: emitReadable", t.length, t.ended), t.length === 0 && t.ended ? dc(this) : xo(this), null;
    if (e = ob(e, t), e === 0 && t.ended)
      return t.length === 0 && dc(this), null;
    var i = t.needReadable;
    te("need readable", i), (t.length === 0 || t.length - e < t.highWaterMark) && (i = !0, te("length less than watermark", i)), t.ended || t.
    reading ? (i = !1, te("reading or ended", i)) : i && (te("do read"), t.reading = !0, t.sync = !0, t.length === 0 && (t.needReadable = !0),
    this._read(t.highWaterMark), t.sync = !1, t.reading || (e = ob(r, t)));
    var n;
    return e > 0 ? n = pb(e, t) : n = null, n === null ? (t.needReadable = !0, e = 0) : t.length -= e, t.length === 0 && (t.ended || (t.needReadable =
    !0), r !== e && t.ended && dc(this)), n !== null && this.emit("data", n), n;
  };
  function zA(e, t) {
    if (!t.ended) {
      if (t.decoder) {
        var r = t.decoder.end();
        r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
      }
      t.ended = !0, xo(e);
    }
  }
  s(zA, "onEofChunk");
  function xo(e) {
    var t = e._readableState;
    t.needReadable = !1, t.emittedReadable || (te("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? _i.nextTick(ab, e) : ab(e));
  }
  s(xo, "emitReadable");
  function ab(e) {
    te("emit readable"), e.emit("readable"), hc(e);
  }
  s(ab, "emitReadable_");
  function hb(e, t) {
    t.readingMore || (t.readingMore = !0, _i.nextTick(GA, e, t));
  }
  s(hb, "maybeReadMore");
  function GA(e, t) {
    for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (te("maybeReadMore read 0"), e.read(0), r !==
    t.length); )
      r = t.length;
    t.readingMore = !1;
  }
  s(GA, "maybeReadMore_");
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
    i.pipesCount += 1, te("pipe count=%d opts=%j", i.pipesCount, t);
    var n = (!t || t.end !== !1) && e !== process.stdout && e !== process.stderr, o = n ? u : _;
    i.endEmitted ? _i.nextTick(o) : r.once("end", o), e.on("unpipe", a);
    function a(C, F) {
      te("onunpipe"), C === r && F && F.hasUnpiped === !1 && (F.hasUnpiped = !0, d());
    }
    s(a, "onunpipe");
    function u() {
      te("onend"), e.end();
    }
    s(u, "onend");
    var l = KA(r);
    e.on("drain", l);
    var c = !1;
    function d() {
      te("cleanup"), e.removeListener("close", g), e.removeListener("finish", E), e.removeListener("drain", l), e.removeListener("error", f),
      e.removeListener("unpipe", a), r.removeListener("end", u), r.removeListener("end", _), r.removeListener("data", h), c = !0, i.awaitDrain &&
      (!e._writableState || e._writableState.needDrain) && l();
    }
    s(d, "cleanup");
    var p = !1;
    r.on("data", h);
    function h(C) {
      te("ondata"), p = !1;
      var F = e.write(C);
      F === !1 && !p && ((i.pipesCount === 1 && i.pipes === e || i.pipesCount > 1 && Db(i.pipes, e) !== -1) && !c && (te("false write respon\
se, pause", i.awaitDrain), i.awaitDrain++, p = !0), r.pause());
    }
    s(h, "ondata");
    function f(C) {
      te("onerror", C), _(), e.removeListener("error", f), ub(e, "error") === 0 && e.emit("error", C);
    }
    s(f, "onerror"), WA(e, "error", f);
    function g() {
      e.removeListener("finish", E), _();
    }
    s(g, "onclose"), e.once("close", g);
    function E() {
      te("onfinish"), e.removeListener("close", g), _();
    }
    s(E, "onfinish"), e.once("finish", E);
    function _() {
      te("unpipe"), r.unpipe(e);
    }
    return s(_, "unpipe"), e.emit("pipe", r), i.flowing || (te("pipe resume"), r.resume()), e;
  };
  function KA(e) {
    return function() {
      var t = e._readableState;
      te("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, t.awaitDrain === 0 && ub(e, "data") && (t.flowing = !0, hc(e));
    };
  }
  s(KA, "pipeOnDrain");
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
    var a = Db(t.pipes, e);
    return a === -1 ? this : (t.pipes.splice(a, 1), t.pipesCount -= 1, t.pipesCount === 1 && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r),
    this);
  };
  fe.prototype.on = function(e, t) {
    var r = fc.prototype.on.call(this, e, t);
    if (e === "data")
      this._readableState.flowing !== !1 && this.resume();
    else if (e === "readable") {
      var i = this._readableState;
      !i.endEmitted && !i.readableListening && (i.readableListening = i.needReadable = !0, i.emittedReadable = !1, i.reading ? i.length && xo(
      this) : _i.nextTick(YA, this));
    }
    return r;
  };
  fe.prototype.addListener = fe.prototype.on;
  function YA(e) {
    te("readable nexttick read 0"), e.read(0);
  }
  s(YA, "nReadingNextTick");
  fe.prototype.resume = function() {
    var e = this._readableState;
    return e.flowing || (te("resume"), e.flowing = !0, JA(this, e)), this;
  };
  function JA(e, t) {
    t.resumeScheduled || (t.resumeScheduled = !0, _i.nextTick(XA, e, t));
  }
  s(JA, "resume");
  function XA(e, t) {
    t.reading || (te("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), hc(e), t.flowing && !t.reading &&
    e.read(0);
  }
  s(XA, "resume_");
  fe.prototype.pause = function() {
    return te("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (te("pause"), this._readableState.
    flowing = !1, this.emit("pause")), this;
  };
  function hc(e) {
    var t = e._readableState;
    for (te("flow", t.flowing); t.flowing && e.read() !== null; )
      ;
  }
  s(hc, "flow");
  fe.prototype.wrap = function(e) {
    var t = this, r = this._readableState, i = !1;
    e.on("end", function() {
      if (te("wrapped end"), r.decoder && !r.ended) {
        var a = r.decoder.end();
        a && a.length && t.push(a);
      }
      t.push(null);
    }), e.on("data", function(a) {
      if (te("wrapped data"), r.decoder && (a = r.decoder.write(a)), !(r.objectMode && a == null) && !(!r.objectMode && (!a || !a.length))) {
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
    for (var o = 0; o < lc.length; o++)
      e.on(lc[o], this.emit.bind(this, lc[o]));
    return this._read = function(a) {
      te("wrapped _read", a), i && (i = !1, e.resume());
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
  fe._fromList = pb;
  function pb(e, t) {
    if (t.length === 0) return null;
    var r;
    return t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (t.decoder ? r = t.buffer.join("") : t.buffer.length === 1 ? r = t.buffer.
    head.data : r = t.buffer.concat(t.length), t.buffer.clear()) : r = QA(e, t.buffer, t.decoder), r;
  }
  s(pb, "fromList");
  function QA(e, t, r) {
    var i;
    return e < t.head.data.length ? (i = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : e === t.head.data.length ? i = t.shift() :
    i = r ? e1(e, t) : t1(e, t), i;
  }
  s(QA, "fromListPartial");
  function e1(e, t) {
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
  s(e1, "copyFromBufferString");
  function t1(e, t) {
    var r = On.allocUnsafe(e), i = t.head, n = 1;
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
  s(t1, "copyFromBuffer");
  function dc(e) {
    var t = e._readableState;
    if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
    t.endEmitted || (t.ended = !0, _i.nextTick(r1, t, e));
  }
  s(dc, "endReadable");
  function r1(e, t) {
    !e.endEmitted && e.length === 0 && (e.endEmitted = !0, t.readable = !1, t.emit("end"));
  }
  s(r1, "endReadableNT");
  function Db(e, t) {
    for (var r = 0, i = e.length; r < i; r++)
      if (e[r] === t) return r;
    return -1;
  }
  s(Db, "indexOf");
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/_stream_transform.js
var pc = b((Fj, bb) => {
  "use strict";
  bb.exports = qt;
  var Fo = _r(), yb = Object.create(je());
  yb.inherits = oe();
  yb.inherits(qt, Fo);
  function i1(e, t) {
    var r = this._transformState;
    r.transforming = !1;
    var i = r.writecb;
    if (!i)
      return this.emit("error", new Error("write callback called multiple times"));
    r.writechunk = null, r.writecb = null, t != null && this.push(t), i(e);
    var n = this._readableState;
    n.reading = !1, (n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
  }
  s(i1, "afterTransform");
  function qt(e) {
    if (!(this instanceof qt)) return new qt(e);
    Fo.call(this, e), this._transformState = {
      afterTransform: i1.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && (typeof e.transform == "function" && (this._transform = e.
    transform), typeof e.flush == "function" && (this._flush = e.flush)), this.on("prefinish", n1);
  }
  s(qt, "Transform");
  function n1() {
    var e = this;
    typeof this._flush == "function" ? this._flush(function(t, r) {
      gb(e, t, r);
    }) : gb(this, null, null);
  }
  s(n1, "prefinish");
  qt.prototype.push = function(e, t) {
    return this._transformState.needTransform = !1, Fo.prototype.push.call(this, e, t);
  };
  qt.prototype._transform = function(e, t, r) {
    throw new Error("_transform() is not implemented");
  };
  qt.prototype._write = function(e, t, r) {
    var i = this._transformState;
    if (i.writecb = r, i.writechunk = e, i.writeencoding = t, !i.transforming) {
      var n = this._readableState;
      (i.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
    }
  };
  qt.prototype._read = function(e) {
    var t = this._transformState;
    t.writechunk !== null && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) :
    t.needTransform = !0;
  };
  qt.prototype._destroy = function(e, t) {
    var r = this;
    Fo.prototype._destroy.call(this, e, function(i) {
      t(i), r.emit("close");
    });
  };
  function gb(e, t, r) {
    if (t) return e.emit("error", t);
    if (r != null && e.push(r), e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
    if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
    return e.push(null);
  }
  s(gb, "done");
});

// ../node_modules/pumpify/node_modules/readable-stream/lib/_stream_passthrough.js
var Eb = b((Tj, wb) => {
  "use strict";
  wb.exports = Bn;
  var vb = pc(), _b = Object.create(je());
  _b.inherits = oe();
  _b.inherits(Bn, vb);
  function Bn(e) {
    if (!(this instanceof Bn)) return new Bn(e);
    vb.call(this, e);
  }
  s(Bn, "PassThrough");
  Bn.prototype._transform = function(e, t, r) {
    r(null, e);
  };
});

// ../node_modules/pumpify/node_modules/readable-stream/readable.js
var Cb = b((Be, So) => {
  var gt = x("stream");
  process.env.READABLE_STREAM === "disable" && gt ? (So.exports = gt, Be = So.exports = gt.Readable, Be.Readable = gt.Readable, Be.Writable =
  gt.Writable, Be.Duplex = gt.Duplex, Be.Transform = gt.Transform, Be.PassThrough = gt.PassThrough, Be.Stream = gt) : (Be = So.exports = ac(),
  Be.Stream = gt || Be, Be.Readable = Be, Be.Writable = nc(), Be.Duplex = _r(), Be.Transform = pc(), Be.PassThrough = Eb());
});

// ../node_modules/pumpify/node_modules/duplexify/index.js
var Ab = b((Rj, Tb) => {
  var To = Cb(), xb = Xr(), s1 = oe(), o1 = kl(), Fb = Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from([0]) : new Buffer([0]), Dc = /* @__PURE__ */ s(
  function(e, t) {
    e._corked ? e.once("uncork", t) : t();
  }, "onuncork"), a1 = /* @__PURE__ */ s(function(e, t) {
    e._autoDestroy && e.destroy(t);
  }, "autoDestroy"), Sb = /* @__PURE__ */ s(function(e, t) {
    return function(r) {
      r ? a1(e, r.message === "premature close" ? null : r) : t && !e._ended && e.end();
    };
  }, "destroyer"), u1 = /* @__PURE__ */ s(function(e, t) {
    if (!e || e._writableState && e._writableState.finished) return t();
    if (e._writableState) return e.end(t);
    e.end(), t();
  }, "end"), l1 = /* @__PURE__ */ s(function(e) {
    return new To.Readable({ objectMode: !0, highWaterMark: 16 }).wrap(e);
  }, "toStreams2"), Pe = /* @__PURE__ */ s(function(e, t, r) {
    if (!(this instanceof Pe)) return new Pe(e, t, r);
    To.Duplex.call(this, r), this._writable = null, this._readable = null, this._readable2 = null, this._autoDestroy = !r || r.autoDestroy !==
    !1, this._forwardDestroy = !r || r.destroy !== !1, this._forwardEnd = !r || r.end !== !1, this._corked = 1, this._ondrain = null, this._drained =
    !1, this._forwarding = !1, this._unwrite = null, this._unread = null, this._ended = !1, this.destroyed = !1, e && this.setWritable(e), t &&
    this.setReadable(t);
  }, "Duplexify");
  s1(Pe, To.Duplex);
  Pe.obj = function(e, t, r) {
    return r || (r = {}), r.objectMode = !0, r.highWaterMark = 16, new Pe(e, t, r);
  };
  Pe.prototype.cork = function() {
    ++this._corked === 1 && this.emit("cork");
  };
  Pe.prototype.uncork = function() {
    this._corked && --this._corked === 0 && this.emit("uncork");
  };
  Pe.prototype.setWritable = function(e) {
    if (this._unwrite && this._unwrite(), this.destroyed) {
      e && e.destroy && e.destroy();
      return;
    }
    if (e === null || e === !1) {
      this.end();
      return;
    }
    var t = this, r = xb(e, { writable: !0, readable: !1 }, Sb(this, this._forwardEnd)), i = /* @__PURE__ */ s(function() {
      var o = t._ondrain;
      t._ondrain = null, o && o();
    }, "ondrain"), n = /* @__PURE__ */ s(function() {
      t._writable.removeListener("drain", i), r();
    }, "clear");
    this._unwrite && process.nextTick(i), this._writable = e, this._writable.on("drain", i), this._unwrite = n, this.uncork();
  };
  Pe.prototype.setReadable = function(e) {
    if (this._unread && this._unread(), this.destroyed) {
      e && e.destroy && e.destroy();
      return;
    }
    if (e === null || e === !1) {
      this.push(null), this.resume();
      return;
    }
    var t = this, r = xb(e, { writable: !1, readable: !0 }, Sb(this)), i = /* @__PURE__ */ s(function() {
      t._forward();
    }, "onreadable"), n = /* @__PURE__ */ s(function() {
      t.push(null);
    }, "onend"), o = /* @__PURE__ */ s(function() {
      t._readable2.removeListener("readable", i), t._readable2.removeListener("end", n), r();
    }, "clear");
    this._drained = !0, this._readable = e, this._readable2 = e._readableState ? e : l1(e), this._readable2.on("readable", i), this._readable2.
    on("end", n), this._unread = o, this._forward();
  };
  Pe.prototype._read = function() {
    this._drained = !0, this._forward();
  };
  Pe.prototype._forward = function() {
    if (!(this._forwarding || !this._readable2 || !this._drained)) {
      this._forwarding = !0;
      for (var e; this._drained && (e = o1(this._readable2)) !== null; )
        this.destroyed || (this._drained = this.push(e));
      this._forwarding = !1;
    }
  };
  Pe.prototype.destroy = function(e) {
    if (!this.destroyed) {
      this.destroyed = !0;
      var t = this;
      process.nextTick(function() {
        t._destroy(e);
      });
    }
  };
  Pe.prototype._destroy = function(e) {
    if (e) {
      var t = this._ondrain;
      this._ondrain = null, t ? t(e) : this.emit("error", e);
    }
    this._forwardDestroy && (this._readable && this._readable.destroy && this._readable.destroy(), this._writable && this._writable.destroy &&
    this._writable.destroy()), this.emit("close");
  };
  Pe.prototype._write = function(e, t, r) {
    if (this.destroyed) return r();
    if (this._corked) return Dc(this, this._write.bind(this, e, t, r));
    if (e === Fb) return this._finish(r);
    if (!this._writable) return r();
    this._writable.write(e) === !1 ? this._ondrain = r : r();
  };
  Pe.prototype._finish = function(e) {
    var t = this;
    this.emit("preend"), Dc(this, function() {
      u1(t._forwardEnd && t._writable, function() {
        t._writableState.prefinished === !1 && (t._writableState.prefinished = !0), t.emit("prefinish"), Dc(t, e);
      });
    });
  };
  Pe.prototype.end = function(e, t, r) {
    return typeof e == "function" ? this.end(null, null, e) : typeof t == "function" ? this.end(e, null, t) : (this._ended = !0, e && this.write(
    e), this._writableState.ending || this.write(Fb), To.Writable.prototype.end.call(this, r));
  };
  Tb.exports = Pe;
});

// ../node_modules/pumpify/index.js
var Ob = b((Oj, Ao) => {
  var c1 = qy(), d1 = oe(), Rb = Ab(), kb = /* @__PURE__ */ s(function(e) {
    return e.length ? Array.isArray(e[0]) ? e[0] : Array.prototype.slice.call(e) : [];
  }, "toArray"), mc = /* @__PURE__ */ s(function(e) {
    var t = /* @__PURE__ */ s(function() {
      var r = kb(arguments);
      if (!(this instanceof t)) return new t(r);
      Rb.call(this, null, null, e), r.length && this.setPipeline(r);
    }, "Pumpify");
    return d1(t, Rb), t.prototype.setPipeline = function() {
      var r = kb(arguments), i = this, n = !1, o = r[0], a = r[r.length - 1];
      a = a.readable ? a : null, o = o.writable ? o : null;
      var u = /* @__PURE__ */ s(function() {
        r[0].emit("error", new Error("stream was destroyed"));
      }, "onclose");
      if (this.on("close", u), this.on("prefinish", function() {
        n || i.cork();
      }), c1(r, function(l) {
        if (i.removeListener("close", u), l) return i.destroy(l.message === "premature close" ? null : l);
        n = !0, i._autoDestroy === !1 && (i._autoDestroy = !0), i.uncork();
      }), this.destroyed) return u();
      this.setWritable(o), this.setReadable(a);
    }, t;
  }, "define");
  Ao.exports = mc({ autoDestroy: !1, destroy: !1 });
  Ao.exports.obj = mc({ autoDestroy: !1, destroy: !1, objectMode: !0, highWaterMark: 16 });
  Ao.exports.ctor = mc;
});

// ../node_modules/is-gzip/index.js
var Pb = b((Pj, Bb) => {
  "use strict";
  Bb.exports = function(e) {
    return !e || e.length < 3 ? !1 : e[0] === 31 && e[1] === 139 && e[2] === 8;
  };
});

// ../node_modules/is-deflate/index.js
var Mb = b((Ij, Ib) => {
  "use strict";
  Ib.exports = function(e) {
    return !e || e.length < 2 ? !1 : e[0] === 120 && (e[1] === 1 || e[1] === 156 || e[1] === 218);
  };
});

// ../node_modules/gunzip-maybe/index.js
var Nb = b((Mj, Lb) => {
  var jb = x("zlib"), f1 = Iy(), h1 = Yl(), qb = Ob(), p1 = Pb(), D1 = Mb(), m1 = /* @__PURE__ */ s(function(e) {
    return p1(e) ? 1 : D1(e) ? 2 : 0;
  }, "isCompressed"), gc = /* @__PURE__ */ s(function(e) {
    return e === void 0 && (e = 3), f1({ newline: !1, maxBuffer: 10 }, function(t, r) {
      if (e < 0) return r(new Error("Maximum recursion reached"));
      switch (m1(t)) {
        case 1:
          r(null, qb(jb.createGunzip(), gc(e - 1)));
          break;
        case 2:
          r(null, qb(jb.createInflate(), gc(e - 1)));
          break;
        default:
          r(null, h1());
      }
    });
  }, "gunzip");
  Lb.exports = gc;
});

// ../node_modules/@ndelangen/get-tarball/dist/index.js
var I0 = b((Nj, P0) => {
  "use strict";
  var g1 = Object.create, No = Object.defineProperty, y1 = Object.getOwnPropertyDescriptor, d0 = Object.getOwnPropertyNames, b1 = Object.getPrototypeOf,
  v1 = Object.prototype.hasOwnProperty, J = /* @__PURE__ */ s((e, t) => /* @__PURE__ */ s(function() {
    return t || (0, e[d0(e)[0]])((t = { exports: {} }).exports, t), t.exports;
  }, "__require"), "__commonJS"), _1 = /* @__PURE__ */ s((e, t) => {
    for (var r in t)
      No(e, r, { get: t[r], enumerable: !0 });
  }, "__export"), f0 = /* @__PURE__ */ s((e, t, r, i) => {
    if (t && typeof t == "object" || typeof t == "function")
      for (let n of d0(t))
        !v1.call(e, n) && n !== r && No(e, n, { get: /* @__PURE__ */ s(() => t[n], "get"), enumerable: !(i = y1(t, n)) || i.enumerable });
    return e;
  }, "__copyProps"), Fe = /* @__PURE__ */ s((e, t, r) => (r = e != null ? g1(b1(e)) : {}, f0(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    t || !e || !e.__esModule ? No(r, "default", { value: e, enumerable: !0 }) : r,
    e
  )), "__toESM"), w1 = /* @__PURE__ */ s((e) => f0(No({}, "__esModule", { value: !0 }), e), "__toCommonJS"), E1 = J({
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
  }), C1 = J({
    "node_modules/.pnpm/get-stream@6.0.1/node_modules/get-stream/buffer-stream.js"(e, t) {
      "use strict";
      var { PassThrough: r } = x("stream");
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
  }), h0 = J({
    "node_modules/.pnpm/get-stream@6.0.1/node_modules/get-stream/index.js"(e, t) {
      "use strict";
      var { constants: r } = x("buffer"), i = x("stream"), { promisify: n } = x("util"), o = C1(), a = n(i.pipeline), u = class extends Error {
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
  }), x1 = J({
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
          _fromObject: F
        } = {}) {
          if (F) {
            this._fromObject(F);
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
  }), F1 = J({
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
  }), S1 = J({
    "node_modules/.pnpm/keyv@4.5.2/node_modules/keyv/src/index.js"(e, t) {
      "use strict";
      var r = x("events"), i = F1(), n = /* @__PURE__ */ s((u) => {
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
          return new (x(l[c]))(u);
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
  }), T1 = J({
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
  }), A1 = J({
    "node_modules/.pnpm/decompress-response@6.0.0/node_modules/decompress-response/index.js"(e, t) {
      "use strict";
      var { Transform: r, PassThrough: i } = x("stream"), n = x("zlib"), o = T1();
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
  }), p0 = J({
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
  }), D0 = J({
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
  }), Ci = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/agent.js"(e, t) {
      "use strict";
      var { URL: r } = x("url"), i = x("events"), n = x("tls"), o = x("http2"), a = p0(), u = D0(), l = Symbol("currentStreamCount"), c = Symbol(
      "request"), d = Symbol("cachedOriginSet"), p = Symbol("gracefullyClosing"), h = Symbol("length"), f = [
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
      ], g = /* @__PURE__ */ s((A, T, S) => {
        let M = 0, L = A.length;
        for (; M < L; ) {
          let j = M + L >>> 1;
          S(A[j], T) ? M = j + 1 : L = j;
        }
        return M;
      }, "getSortedIndex"), E = /* @__PURE__ */ s((A, T) => A.remoteSettings.maxConcurrentStreams > T.remoteSettings.maxConcurrentStreams, "\
compareSessions"), _ = /* @__PURE__ */ s((A, T) => {
        for (let S = 0; S < A.length; S++) {
          let M = A[S];
          // Unfortunately `.every()` returns true for an empty array
          M[d].length > 0 && M[d].length < T[d].length && M[d].every((L) => T[d].includes(L)) && M[l] + T[l] <= T.remoteSettings.maxConcurrentStreams &&
          F(M);
        }
      }, "closeCoveredSessions"), C = /* @__PURE__ */ s((A, T) => {
        for (let S = 0; S < A.length; S++) {
          let M = A[S];
          if (T[d].length > 0 && T[d].length < M[d].length && T[d].every((L) => M[d].includes(L)) && T[l] + M[l] <= M.remoteSettings.maxConcurrentStreams)
            return F(T), !0;
        }
        return !1;
      }, "closeSessionIfCovered"), F = /* @__PURE__ */ s((A) => {
        A[p] = !0, A[l] === 0 && A.close();
      }, "gracefullyClose"), w = class extends i {
        static {
          s(this, "Agent");
        }
        constructor({ timeout: A = 0, maxSessions: T = Number.POSITIVE_INFINITY, maxEmptySessions: S = 10, maxCachedTlsSessions: M = 100 } = {}) {
          super(), this.sessions = {}, this.queue = {}, this.timeout = A, this.maxSessions = T, this.maxEmptySessions = S, this._emptySessionCount =
          0, this._sessionCount = 0, this.settings = {
            enablePush: !1,
            initialWindowSize: 1024 * 1024 * 32
            // 32MB, see https://github.com/nodejs/node/issues/38426
          }, this.tlsSessionCache = new a({ maxSize: M });
        }
        get protocol() {
          return "https:";
        }
        normalizeOptions(A) {
          let T = "";
          for (let S = 0; S < f.length; S++) {
            let M = f[S];
            T += ":", A && A[M] !== void 0 && (T += A[M]);
          }
          return T;
        }
        _processQueue() {
          if (this._sessionCount >= this.maxSessions) {
            this.closeEmptySessions(this.maxSessions - this._sessionCount + 1);
            return;
          }
          for (let A in this.queue)
            for (let T in this.queue[A]) {
              let S = this.queue[A][T];
              S.completed || (S.completed = !0, S());
            }
        }
        _isBetterSession(A, T) {
          return A > T;
        }
        _accept(A, T, S, M) {
          let L = 0;
          for (; L < T.length && A[l] < A.remoteSettings.maxConcurrentStreams; )
            T[L].resolve(A), L++;
          T.splice(0, L), T.length > 0 && (this.getSession(S, M, T), T.length = 0);
        }
        getSession(A, T, S) {
          return new Promise((M, L) => {
            Array.isArray(S) && S.length > 0 ? (S = [...S], M()) : S = [{ resolve: M, reject: L }];
            try {
              if (typeof A == "string")
                A = new r(A);
              else if (!(A instanceof r))
                throw new TypeError("The `origin` argument needs to be a string or an URL object");
              if (T) {
                let { servername: q } = T, { hostname: P } = A;
                if (q && P !== q)
                  throw new Error(`Origin ${P} differs from servername ${q}`);
              }
            } catch (q) {
              for (let P = 0; P < S.length; P++)
                S[P].reject(q);
              return;
            }
            let j = this.normalizeOptions(T), V = A.origin;
            if (j in this.sessions) {
              let q = this.sessions[j], P = -1, $ = -1, pe;
              for (let X = 0; X < q.length; X++) {
                let I = q[X], Se = I.remoteSettings.maxConcurrentStreams;
                if (Se < P)
                  break;
                if (!I[d].includes(V))
                  continue;
                let G = I[l];
                G >= Se || I[p] || I.destroyed || (pe || (P = Se), this._isBetterSession(G, $) && (pe = I, $ = G));
              }
              if (pe) {
                this._accept(pe, S, V, T);
                return;
              }
            }
            if (j in this.queue) {
              if (V in this.queue[j]) {
                this.queue[j][V].listeners.push(...S);
                return;
              }
            } else
              this.queue[j] = {
                [h]: 0
              };
            let Y = /* @__PURE__ */ s(() => {
              j in this.queue && this.queue[j][V] === ve && (delete this.queue[j][V], --this.queue[j][h] === 0 && delete this.queue[j]);
            }, "removeFromQueue"), ve = /* @__PURE__ */ s(async () => {
              this._sessionCount++;
              let q = `${V}:${j}`, P = !1, $;
              try {
                let pe = { ...T };
                pe.settings === void 0 && (pe.settings = this.settings), pe.session === void 0 && (pe.session = this.tlsSessionCache.get(q)),
                $ = await (pe.createConnection || this.createConnection).call(this, A, pe), pe.createConnection = () => $;
                let I = o.connect(A, pe);
                I[l] = 0, I[p] = !1;
                let Se = /* @__PURE__ */ s(() => {
                  let { socket: z } = I, le;
                  return z.servername === !1 ? (z.servername = z.remoteAddress, le = I.originSet, z.servername = !1) : le = I.originSet, le;
                }, "getOriginSet"), G = /* @__PURE__ */ s(() => I[l] < I.remoteSettings.maxConcurrentStreams, "isFree");
                I.socket.once("session", (z) => {
                  this.tlsSessionCache.set(q, z);
                }), I.once("error", (z) => {
                  for (let le = 0; le < S.length; le++)
                    S[le].reject(z);
                  this.tlsSessionCache.delete(q);
                }), I.setTimeout(this.timeout, () => {
                  I.destroy();
                }), I.once("close", () => {
                  if (this._sessionCount--, P) {
                    this._emptySessionCount--;
                    let z = this.sessions[j];
                    z.length === 1 ? delete this.sessions[j] : z.splice(z.indexOf(I), 1);
                  } else {
                    Y();
                    let z = new Error("Session closed without receiving a SETTINGS frame");
                    z.code = "HTTP2WRAPPER_NOSETTINGS";
                    for (let le = 0; le < S.length; le++)
                      S[le].reject(z);
                  }
                  this._processQueue();
                });
                let ji = /* @__PURE__ */ s(() => {
                  let z = this.queue[j];
                  if (!z)
                    return;
                  let le = I[d];
                  for (let ot = 0; ot < le.length; ot++) {
                    let qi = le[ot];
                    if (qi in z) {
                      let { listeners: gd, completed: T_ } = z[qi], es = 0;
                      for (; es < gd.length && G(); )
                        gd[es].resolve(I), es++;
                      if (z[qi].listeners.splice(0, es), z[qi].listeners.length === 0 && !T_ && (delete z[qi], --z[h] === 0)) {
                        delete this.queue[j];
                        break;
                      }
                      if (!G())
                        break;
                    }
                  }
                }, "processListeners");
                I.on("origin", () => {
                  I[d] = Se() || [], I[p] = !1, C(this.sessions[j], I), !(I[p] || !G()) && (ji(), G() && _(this.sessions[j], I));
                }), I.once("remoteSettings", () => {
                  if (ve.destroyed) {
                    let z = new Error("Agent has been destroyed");
                    for (let le = 0; le < S.length; le++)
                      S[le].reject(z);
                    I.destroy();
                    return;
                  }
                  if (I.setLocalWindowSize && I.setLocalWindowSize(1024 * 1024 * 4), I[d] = Se() || [], I.socket.encrypted) {
                    let z = I[d][0];
                    if (z !== V) {
                      let le = new Error(`Requested origin ${V} does not match server ${z}`);
                      for (let ot = 0; ot < S.length; ot++)
                        S[ot].reject(le);
                      I.destroy();
                      return;
                    }
                  }
                  Y();
                  {
                    let z = this.sessions;
                    if (j in z) {
                      let le = z[j];
                      le.splice(g(le, I, E), 0, I);
                    } else
                      z[j] = [I];
                  }
                  P = !0, this._emptySessionCount++, this.emit("session", I), this._accept(I, S, V, T), I[l] === 0 && this._emptySessionCount >
                  this.maxEmptySessions && this.closeEmptySessions(this._emptySessionCount - this.maxEmptySessions), I.on("remoteSettings", () => {
                    G() && (ji(), G() && _(this.sessions[j], I));
                  });
                }), I[c] = I.request, I.request = (z, le) => {
                  if (I[p])
                    throw new Error("The session is gracefully closing. No new streams are allowed.");
                  let ot = I[c](z, le);
                  return I.ref(), I[l]++ === 0 && this._emptySessionCount--, ot.once("close", () => {
                    if (--I[l] === 0 && (this._emptySessionCount++, I.unref(), this._emptySessionCount > this.maxEmptySessions || I[p])) {
                      I.close();
                      return;
                    }
                    I.destroyed || I.closed || G() && !C(this.sessions[j], I) && (_(this.sessions[j], I), ji(), I[l] === 0 && this._processQueue());
                  }), ot;
                };
              } catch (pe) {
                Y(), this._sessionCount--;
                for (let X = 0; X < S.length; X++)
                  S[X].reject(pe);
              }
            }, "entry");
            ve.listeners = S, ve.completed = !1, ve.destroyed = !1, this.queue[j][V] = ve, this.queue[j][h]++, this._processQueue();
          });
        }
        request(A, T, S, M) {
          return new Promise((L, j) => {
            this.getSession(A, T, [{
              reject: j,
              resolve: /* @__PURE__ */ s((V) => {
                try {
                  let Y = V.request(S, M);
                  u(Y), L(Y);
                } catch (Y) {
                  j(Y);
                }
              }, "resolve")
            }]);
          });
        }
        async createConnection(A, T) {
          return w.connect(A, T);
        }
        static connect(A, T) {
          T.ALPNProtocols = ["h2"];
          let S = A.port || 443, M = A.hostname;
          typeof T.servername > "u" && (T.servername = M);
          let L = n.connect(S, M, T);
          return T.socket && (L._peername = {
            family: void 0,
            address: void 0,
            port: S
          }), L;
        }
        closeEmptySessions(A = Number.POSITIVE_INFINITY) {
          let T = 0, { sessions: S } = this;
          for (let M in S) {
            let L = S[M];
            for (let j = 0; j < L.length; j++) {
              let V = L[j];
              if (V[l] === 0 && (T++, V.close(), T >= A))
                return T;
            }
          }
          return T;
        }
        destroy(A) {
          let { sessions: T, queue: S } = this;
          for (let M in T) {
            let L = T[M];
            for (let j = 0; j < L.length; j++)
              L[j].destroy(A);
          }
          for (let M in S) {
            let L = S[M];
            for (let j in L)
              L[j].destroyed = !0;
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
  }), m0 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/incoming-message.js"(e, t) {
      "use strict";
      var { Readable: r } = x("stream"), i = class extends r {
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
  }), R1 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/proxy-events.js"(e, t) {
      "use strict";
      t.exports = (r, i, n) => {
        for (let o of n)
          r.on(o, (...a) => i.emit(o, ...a));
      };
    }
  }), Uo = J({
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
  }), k1 = J({
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
  }), g0 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/validate-header-name.js"(e, t) {
      "use strict";
      var { ERR_INVALID_HTTP_TOKEN: r } = Uo(), i = k1(), n = /^[\^`\-\w!#$%&*+.|~]+$/;
      t.exports = (o) => {
        if (typeof o != "string" || !n.test(o) && !i(o))
          throw new r("Header name", o);
      };
    }
  }), y0 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/validate-header-value.js"(e, t) {
      "use strict";
      var {
        ERR_HTTP_INVALID_HEADER_VALUE: r,
        ERR_INVALID_CHAR: i
      } = Uo(), n = /[^\t\u0020-\u007E\u0080-\u00FF]/;
      t.exports = (o, a) => {
        if (typeof a > "u")
          throw new r(a, o);
        if (n.test(a))
          throw new i("header content", o);
      };
    }
  }), O1 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/proxy-socket-handler.js"(e, t) {
      "use strict";
      var { ERR_HTTP2_NO_SOCKET_MANIPULATION: r } = Uo(), i = {
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
  }), b0 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/client-request.js"(e, t) {
      "use strict";
      var { URL: r, urlToHttpOptions: i } = x("url"), n = x("http2"), { Writable: o } = x("stream"), { Agent: a, globalAgent: u } = Ci(), l = m0(),
      c = R1(), {
        ERR_INVALID_ARG_TYPE: d,
        ERR_INVALID_PROTOCOL: p,
        ERR_HTTP_HEADERS_SENT: h
      } = Uo(), f = g0(), g = y0(), E = O1(), {
        HTTP2_HEADER_STATUS: _,
        HTTP2_HEADER_METHOD: C,
        HTTP2_HEADER_PATH: F,
        HTTP2_HEADER_AUTHORITY: w,
        HTTP2_METHOD_CONNECT: A
      } = n.constants, T = Symbol("headers"), S = Symbol("origin"), M = Symbol("session"), L = Symbol("options"), j = Symbol("flushedHeaders"),
      V = Symbol("jobs"), Y = Symbol("pendingAgentPromise"), ve = class extends o {
        static {
          s(this, "ClientRequest");
        }
        constructor(q, P, $) {
          if (super({
            autoDestroy: !1,
            emitClose: !1
          }), typeof q == "string" ? q = i(new r(q)) : q instanceof r ? q = i(q) : q = { ...q }, typeof P == "function" || P === void 0 ? ($ =
          P, P = q) : P = Object.assign(q, P), P.h2session) {
            if (this[M] = P.h2session, this[M].destroyed)
              throw new Error("The session has been closed already");
            this.protocol = this[M].socket.encrypted ? "https:" : "http:";
          } else if (P.agent === !1)
            this.agent = new a({ maxEmptySessions: 0 });
          else if (typeof P.agent > "u" || P.agent === null)
            this.agent = u;
          else if (typeof P.agent.request == "function")
            this.agent = P.agent;
          else
            throw new d("options.agent", ["http2wrapper.Agent-like Object", "undefined", "false"], P.agent);
          if (this.agent && (this.protocol = this.agent.protocol), P.protocol && P.protocol !== this.protocol)
            throw new p(P.protocol, this.protocol);
          P.port || (P.port = P.defaultPort || this.agent && this.agent.defaultPort || 443), P.host = P.hostname || P.host || "localhost", delete P.
          hostname;
          let { timeout: pe } = P;
          P.timeout = void 0, this[T] = /* @__PURE__ */ Object.create(null), this[V] = [], this[Y] = void 0, this.socket = null, this.connection =
          null, this.method = P.method || "GET", this.method === "CONNECT" && (P.path === "/" || P.path === void 0) || (this.path = P.path),
          this.res = null, this.aborted = !1, this.reusedSocket = !1;
          let { headers: X } = P;
          if (X)
            for (let Se in X)
              this.setHeader(Se, X[Se]);
          P.auth && !("authorization" in this[T]) && (this[T].authorization = "Basic " + Buffer.from(P.auth).toString("base64")), P.session =
          P.tlsSession, P.path = P.socketPath, this[L] = P, this[S] = new r(`${this.protocol}//${P.servername || P.host}:${P.port}`);
          let I = P._reuseSocket;
          I && (P.createConnection = (...Se) => I.destroyed ? this.agent.createConnection(...Se) : I, this.agent.getSession(this[S], this[L]).
          catch(() => {
          })), pe && this.setTimeout(pe), $ && this.once("response", $), this[j] = !1;
        }
        get method() {
          return this[T][C];
        }
        set method(q) {
          q && (this[T][C] = q.toUpperCase());
        }
        get path() {
          let q = this.method === "CONNECT" ? w : F;
          return this[T][q];
        }
        set path(q) {
          if (q) {
            let P = this.method === "CONNECT" ? w : F;
            this[T][P] = q;
          }
        }
        get host() {
          return this[S].hostname;
        }
        set host(q) {
        }
        get _mustNotHaveABody() {
          return this.method === "GET" || this.method === "HEAD" || this.method === "DELETE";
        }
        _write(q, P, $) {
          if (this._mustNotHaveABody) {
            $(new Error("The GET, HEAD and DELETE methods must NOT have a body"));
            return;
          }
          this.flushHeaders();
          let pe = /* @__PURE__ */ s(() => this._request.write(q, P, $), "callWrite");
          this._request ? pe() : this[V].push(pe);
        }
        _final(q) {
          this.flushHeaders();
          let P = /* @__PURE__ */ s(() => {
            if (this._mustNotHaveABody || this.method === "CONNECT") {
              q();
              return;
            }
            this._request.end(q);
          }, "callEnd");
          this._request ? P() : this[V].push(P);
        }
        abort() {
          this.res && this.res.complete || (this.aborted || process.nextTick(() => this.emit("abort")), this.aborted = !0, this.destroy());
        }
        async _destroy(q, P) {
          this.res && this.res._dump(), this._request ? this._request.destroy() : process.nextTick(() => {
            this.emit("close");
          });
          try {
            await this[Y];
          } catch ($) {
            this.aborted && (q = $);
          }
          P(q);
        }
        async flushHeaders() {
          if (this[j] || this.destroyed)
            return;
          this[j] = !0;
          let q = this.method === A, P = /* @__PURE__ */ s(($) => {
            if (this._request = $, this.destroyed) {
              $.destroy();
              return;
            }
            q || c($, this, ["timeout", "continue"]), $.once("error", (X) => {
              this.destroy(X);
            }), $.once("aborted", () => {
              let { res: X } = this;
              X ? (X.aborted = !0, X.emit("aborted"), X.destroy()) : this.destroy(new Error("The server aborted the HTTP/2 stream"));
            });
            let pe = /* @__PURE__ */ s((X, I, Se) => {
              let G = new l(this.socket, $.readableHighWaterMark);
              this.res = G, G.url = `${this[S].origin}${this.path}`, G.req = this, G.statusCode = X[_], G.headers = X, G.rawHeaders = Se, G.
              once("end", () => {
                G.complete = !0, G.socket = null, G.connection = null;
              }), q ? (G.upgrade = !0, this.emit("connect", G, $, Buffer.alloc(0)) ? this.emit("close") : $.destroy()) : ($.on("data", (ji) => {
                !G._dumped && !G.push(ji) && $.pause();
              }), $.once("end", () => {
                this.aborted || G.push(null);
              }), this.emit("response", G) || G._dump());
            }, "onResponse");
            $.once("response", pe), $.once("headers", (X) => this.emit("information", { statusCode: X[_] })), $.once("trailers", (X, I, Se) => {
              let { res: G } = this;
              if (G === null) {
                pe(X, I, Se);
                return;
              }
              G.trailers = X, G.rawTrailers = Se;
            }), $.once("close", () => {
              let { aborted: X, res: I } = this;
              if (I) {
                X && (I.aborted = !0, I.emit("aborted"), I.destroy());
                let Se = /* @__PURE__ */ s(() => {
                  I.emit("close"), this.destroy(), this.emit("close");
                }, "finish");
                I.readable ? I.once("end", Se) : Se();
                return;
              }
              if (!this.destroyed) {
                this.destroy(new Error("The HTTP/2 stream has been early terminated")), this.emit("close");
                return;
              }
              this.destroy(), this.emit("close");
            }), this.socket = new Proxy($, E);
            for (let X of this[V])
              X();
            this[V].length = 0, this.emit("socket", this.socket);
          }, "onStream");
          if (!(w in this[T]) && !q && (this[T][w] = this[S].host), this[M])
            try {
              P(this[M].request(this[T]));
            } catch ($) {
              this.destroy($);
            }
          else {
            this.reusedSocket = !0;
            try {
              let $ = this.agent.request(this[S], this[L], this[T]);
              this[Y] = $, P(await $), this[Y] = !1;
            } catch ($) {
              this[Y] = !1, this.destroy($);
            }
          }
        }
        get connection() {
          return this.socket;
        }
        set connection(q) {
          this.socket = q;
        }
        getHeaderNames() {
          return Object.keys(this[T]);
        }
        hasHeader(q) {
          if (typeof q != "string")
            throw new d("name", "string", q);
          return !!this[T][q.toLowerCase()];
        }
        getHeader(q) {
          if (typeof q != "string")
            throw new d("name", "string", q);
          return this[T][q.toLowerCase()];
        }
        get headersSent() {
          return this[j];
        }
        removeHeader(q) {
          if (typeof q != "string")
            throw new d("name", "string", q);
          if (this.headersSent)
            throw new h("remove");
          delete this[T][q.toLowerCase()];
        }
        setHeader(q, P) {
          if (this.headersSent)
            throw new h("set");
          f(q), g(q, P);
          let $ = q.toLowerCase();
          if ($ === "connection") {
            if (P.toLowerCase() === "keep-alive")
              return;
            throw new Error(`Invalid 'connection' header: ${P}`);
          }
          $ === "host" && this.method === "CONNECT" ? this[T][w] = P : this[T][$] = P;
        }
        setNoDelay() {
        }
        setSocketKeepAlive() {
        }
        setTimeout(q, P) {
          let $ = /* @__PURE__ */ s(() => this._request.setTimeout(q, P), "applyTimeout");
          return this._request ? $() : this[V].push($), this;
        }
        get maxHeadersCount() {
          if (!this.destroyed && this._request)
            return this._request.session.localSettings.maxHeaderListSize;
        }
        set maxHeadersCount(q) {
        }
      };
      t.exports = ve;
    }
  }), B1 = J({
    "node_modules/.pnpm/resolve-alpn@1.2.1/node_modules/resolve-alpn/index.js"(e, t) {
      "use strict";
      var r = x("tls");
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
  }), P1 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/calculate-server-name.js"(e, t) {
      "use strict";
      var { isIP: r } = x("net"), i = x("assert"), n = /* @__PURE__ */ s((o) => {
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
  }), I1 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/auto.js"(e, t) {
      "use strict";
      var { URL: r, urlToHttpOptions: i } = x("url"), n = x("http"), o = x("https"), a = B1(), u = p0(), { Agent: l, globalAgent: c } = Ci(),
      d = b0(), p = P1(), h = D0(), f = new u({ maxSize: 100 }), g = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ s((F, w, A) => {
        w._httpMessage = { shouldKeepAlive: !0 };
        let T = /* @__PURE__ */ s(() => {
          F.emit("free", w, A);
        }, "onFree");
        w.on("free", T);
        let S = /* @__PURE__ */ s(() => {
          F.removeSocket(w, A);
        }, "onClose");
        w.on("close", S);
        let M = /* @__PURE__ */ s(() => {
          let { freeSockets: j } = F;
          for (let V of Object.values(j))
            if (V.includes(w)) {
              w.destroy();
              return;
            }
        }, "onTimeout");
        w.on("timeout", M);
        let L = /* @__PURE__ */ s(() => {
          F.removeSocket(w, A), w.off("close", S), w.off("free", T), w.off("timeout", M), w.off("agentRemove", L);
        }, "onRemove");
        w.on("agentRemove", L), F.emit("free", w, A);
      }, "installSocket"), _ = /* @__PURE__ */ s((F, w = /* @__PURE__ */ new Map(), A = void 0) => async (T) => {
        let S = `${T.host}:${T.port}:${T.ALPNProtocols.sort()}`;
        if (!F.has(S)) {
          if (w.has(S))
            return { alpnProtocol: (await w.get(S)).alpnProtocol };
          let { path: M } = T;
          T.path = T.socketPath;
          let L = a(T, A);
          w.set(S, L);
          try {
            let j = await L;
            return F.set(S, j.alpnProtocol), w.delete(S), T.path = M, j;
          } catch (j) {
            throw w.delete(S), T.path = M, j;
          }
        }
        return { alpnProtocol: F.get(S) };
      }, "createResolveProtocol"), C = _(f, g);
      t.exports = async (F, w, A) => {
        if (typeof F == "string" ? F = i(new r(F)) : F instanceof r ? F = i(F) : F = { ...F }, typeof w == "function" || w === void 0 ? (A =
        w, w = F) : w = Object.assign(F, w), w.ALPNProtocols = w.ALPNProtocols || ["h2", "http/1.1"], !Array.isArray(w.ALPNProtocols) || w.ALPNProtocols.
        length === 0)
          throw new Error("The `ALPNProtocols` option must be an Array with at least one entry");
        w.protocol = w.protocol || "https:";
        let T = w.protocol === "https:";
        w.host = w.hostname || w.host || "localhost", w.session = w.tlsSession, w.servername = w.servername || p(w.headers && w.headers.host ||
        w.host), w.port = w.port || (T ? 443 : 80), w._defaultAgent = T ? o.globalAgent : n.globalAgent;
        let S = w.resolveProtocol || C, { agent: M } = w;
        if (M !== void 0 && M !== !1 && M.constructor.name !== "Object")
          throw new Error("The `options.agent` can be only an object `http`, `https` or `http2` properties");
        if (T) {
          w.resolveSocket = !0;
          let { socket: L, alpnProtocol: j, timeout: V } = await S(w);
          if (V) {
            L && L.destroy();
            let ve = new Error(`Timed out resolving ALPN: ${w.timeout} ms`);
            throw ve.code = "ETIMEDOUT", ve.ms = w.timeout, ve;
          }
          L && w.createConnection && (L.destroy(), L = void 0), delete w.resolveSocket;
          let Y = j === "h2";
          if (M && (M = Y ? M.http2 : M.https, w.agent = M), M === void 0 && (M = Y ? c : o.globalAgent), L)
            if (M === !1)
              L.destroy();
            else {
              let ve = (Y ? l : o.Agent).prototype.createConnection;
              M.createConnection === ve ? Y ? w._reuseSocket = L : E(M, L, w) : L.destroy();
            }
          if (Y)
            return h(new d(w, A));
        } else M && (w.agent = M.http);
        return h(n.request(w, A));
      }, t.exports.protocolCache = f, t.exports.resolveProtocol = C, t.exports.createResolveProtocol = _;
    }
  }), v0 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/utils/js-stream-socket.js"(e, t) {
      "use strict";
      var r = x("stream"), i = x("tls"), n = new i.TLSSocket(new r.PassThrough())._handle._parentWrap.constructor;
      t.exports = n;
    }
  }), _0 = J({
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
  }), M1 = J({
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
  }), w0 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/proxies/initialize.js"(e, t) {
      "use strict";
      var { URL: r } = x("url"), i = M1();
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
  }), Ac = J({
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
  }), j1 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/proxies/h1-over-h2.js"(e, t) {
      "use strict";
      var r = x("tls"), i = x("http"), n = x("https"), o = v0(), { globalAgent: a } = Ci(), u = _0(), l = w0(), c = Ac(), d = /* @__PURE__ */ s(
      (f, g, E) => {
        (async () => {
          try {
            let { proxyOptions: _ } = f, { url: C, headers: F, raw: w } = _, A = await a.request(C, _, {
              ...c(f),
              ...F,
              ":method": "CONNECT",
              ":authority": `${g.host}:${g.port}`
            });
            A.once("error", E), A.once("response", (T) => {
              let S = T[":status"];
              if (S !== 200) {
                E(new u(S, ""));
                return;
              }
              let M = f instanceof n.Agent;
              if (w && M) {
                g.socket = A;
                let j = r.connect(g);
                j.once("close", () => {
                  A.destroy();
                }), E(null, j);
                return;
              }
              let L = new o(A);
              L.encrypted = !1, L._handle.getpeername = (j) => {
                j.family = void 0, j.address = void 0, j.port = void 0;
              }, E(null, L);
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
  }), E0 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/proxies/h2-over-hx.js"(e, t) {
      "use strict";
      var { Agent: r } = Ci(), i = v0(), n = _0(), o = w0(), a = class extends r {
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
  }), q1 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/proxies/h2-over-h2.js"(e, t) {
      "use strict";
      var { globalAgent: r } = Ci(), i = E0(), n = Ac(), o = /* @__PURE__ */ s((u) => new Promise((l, c) => {
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
  }), L1 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/proxies/h2-over-h1.js"(e, t) {
      "use strict";
      var r = x("http"), i = x("https"), n = E0(), o = Ac(), a = /* @__PURE__ */ s((l) => new Promise((c, d) => {
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
  }), N1 = J({
    "node_modules/.pnpm/http2-wrapper@2.2.0/node_modules/http2-wrapper/source/index.js"(e, t) {
      "use strict";
      var r = x("http2"), {
        Agent: i,
        globalAgent: n
      } = Ci(), o = b0(), a = m0(), u = I1(), {
        HttpOverHttp2: l,
        HttpsOverHttp2: c
      } = j1(), d = q1(), {
        Http2OverHttp: p,
        Http2OverHttps: h
      } = L1(), f = g0(), g = y0(), E = /* @__PURE__ */ s((C, F, w) => new o(C, F, w), "request"), _ = /* @__PURE__ */ s((C, F, w) => {
        let A = new o(C, F, w);
        return A.end(), A;
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
  }), C0 = {};
  _1(C0, {
    default: /* @__PURE__ */ s(() => UR, "default")
  });
  P0.exports = w1(C0);
  var U1 = x("http"), $1 = x("https"), x0 = [
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
  function W1(e) {
    return x0.includes(e);
  }
  s(W1, "isTypedArrayName");
  var H1 = [
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
    ...x0
  ];
  function V1(e) {
    return H1.includes(e);
  }
  s(V1, "isObjectTypeName");
  var Z1 = [
    "null",
    "undefined",
    "string",
    "number",
    "bigint",
    "boolean",
    "symbol"
  ];
  function z1(e) {
    return Z1.includes(e);
  }
  s(z1, "isPrimitiveTypeName");
  function xi(e) {
    return (t) => typeof t === e;
  }
  s(xi, "isOfType");
  var { toString: G1 } = Object.prototype, Un = /* @__PURE__ */ s((e) => {
    let t = G1.call(e).slice(8, -1);
    if (/HTML\w+Element/.test(t) && D.domElement(e))
      return "HTMLElement";
    if (V1(t))
      return t;
  }, "getObjectType"), ne = /* @__PURE__ */ s((e) => (t) => Un(t) === e, "isObjectOfType");
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
    let t = Un(e);
    if (t)
      return t;
    if (e instanceof String || e instanceof Boolean || e instanceof Number)
      throw new TypeError("Please don't use object wrappers for primitive types");
    return "Object";
  }
  s(D, "is");
  D.undefined = xi("undefined");
  D.string = xi("string");
  var K1 = xi("number");
  D.number = (e) => K1(e) && !D.nan(e);
  D.bigint = xi("bigint");
  D.function_ = xi("function");
  D.null_ = (e) => e === null;
  D.class_ = (e) => D.function_(e) && e.toString().startsWith("class ");
  D.boolean = (e) => e === !0 || e === !1;
  D.symbol = xi("symbol");
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
  var Y1 = /* @__PURE__ */ s((e) => D.function_(e?.then) && D.function_(e?.catch), "hasPromiseApi");
  D.promise = (e) => D.nativePromise(e) || Y1(e);
  D.generatorFunction = ne("GeneratorFunction");
  D.asyncGeneratorFunction = (e) => Un(e) === "AsyncGeneratorFunction";
  D.asyncFunction = (e) => Un(e) === "AsyncFunction";
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
  D.primitive = (e) => D.null_(e) || z1(typeof e);
  D.integer = (e) => Number.isInteger(e);
  D.safeInteger = (e) => Number.isSafeInteger(e);
  D.plainObject = (e) => {
    if (typeof e != "object" || e === null)
      return !1;
    let t = Object.getPrototypeOf(e);
    return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in
    e);
  };
  D.typedArray = (e) => W1(Un(e));
  var J1 = /* @__PURE__ */ s((e) => D.safeInteger(e) && e >= 0, "isValidLength");
  D.arrayLike = (e) => !D.nullOrUndefined(e) && !D.function_(e) && J1(e.length);
  D.inRange = (e, t) => {
    if (D.number(t))
      return e >= Math.min(0, t) && e <= Math.max(t, 0);
    if (D.array(t) && t.length === 2)
      return e >= Math.min(...t) && e <= Math.max(...t);
    throw new TypeError(`Invalid range: ${JSON.stringify(t)}`);
  };
  var X1 = 1, Q1 = [
    "innerHTML",
    "ownerDocument",
    "style",
    "attributes",
    "nodeValue"
  ];
  D.domElement = (e) => D.object(e) && e.nodeType === X1 && D.string(e.nodeName) && !D.plainObject(e) && Q1.every((t) => t in e);
  D.observable = (e) => {
    var t, r;
    return e ? e === ((t = e[Symbol.observable]) == null ? void 0 : t.call(e)) || e === ((r = e["@@observable"]) == null ? void 0 : r.call(e)) :
    !1;
  };
  D.nodeStream = (e) => D.object(e) && D.function_(e.pipe) && !D.observable(e);
  D.infinite = (e) => e === Number.POSITIVE_INFINITY || e === Number.NEGATIVE_INFINITY;
  var F0 = /* @__PURE__ */ s((e) => (t) => D.integer(t) && Math.abs(t % 2) === e, "isAbsoluteMod2");
  D.evenInteger = F0(0);
  D.oddInteger = F0(1);
  D.emptyArray = (e) => D.array(e) && e.length === 0;
  D.nonEmptyArray = (e) => D.array(e) && e.length > 0;
  D.emptyString = (e) => D.string(e) && e.length === 0;
  var e3 = /* @__PURE__ */ s((e) => D.string(e) && !/\S/.test(e), "isWhiteSpaceString");
  D.emptyStringOrWhitespace = (e) => D.emptyString(e) || e3(e);
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
  var S0 = /* @__PURE__ */ s((e, t, r) => {
    if (!D.function_(t))
      throw new TypeError(`Invalid predicate: ${JSON.stringify(t)}`);
    if (r.length === 0)
      throw new TypeError("Invalid number of values");
    return e.call(r, t);
  }, "predicateOnArray");
  D.any = (e, ...t) => (D.array(e) ? e : [e]).some((i) => S0(Array.prototype.some, i, t));
  D.all = (e, ...t) => S0(Array.prototype.every, e, t);
  var O = /* @__PURE__ */ s((e, t, r, i = {}) => {
    if (!e) {
      let { multipleValues: n } = i, o = n ? `received values of types ${[
        ...new Set(r.map((a) => `\`${D(a)}\``))
      ].join(", ")}` : `received value of type \`${D(r)}\``;
      throw new TypeError(`Expected value which is \`${t}\`, ${o}.`);
    }
  }, "assertType"), R = {
    // Unknowns.
    undefined: /* @__PURE__ */ s((e) => O(D.undefined(e), "undefined", e), "undefined"),
    string: /* @__PURE__ */ s((e) => O(D.string(e), "string", e), "string"),
    number: /* @__PURE__ */ s((e) => O(D.number(e), "number", e), "number"),
    bigint: /* @__PURE__ */ s((e) => O(D.bigint(e), "bigint", e), "bigint"),
    // eslint-disable-next-line @typescript-eslint/ban-types
    function_: /* @__PURE__ */ s((e) => O(D.function_(e), "Function", e), "function_"),
    null_: /* @__PURE__ */ s((e) => O(D.null_(e), "null", e), "null_"),
    class_: /* @__PURE__ */ s((e) => O(D.class_(e), "Class", e), "class_"),
    boolean: /* @__PURE__ */ s((e) => O(D.boolean(e), "boolean", e), "boolean"),
    symbol: /* @__PURE__ */ s((e) => O(D.symbol(e), "symbol", e), "symbol"),
    numericString: /* @__PURE__ */ s((e) => O(D.numericString(e), "string with a number", e), "numericString"),
    array: /* @__PURE__ */ s((e, t) => {
      O(D.array(e), "Array", e), t && e.forEach(t);
    }, "array"),
    buffer: /* @__PURE__ */ s((e) => O(D.buffer(e), "Buffer", e), "buffer"),
    blob: /* @__PURE__ */ s((e) => O(D.blob(e), "Blob", e), "blob"),
    nullOrUndefined: /* @__PURE__ */ s((e) => O(D.nullOrUndefined(e), "null or undefined", e), "nullOrUndefined"),
    object: /* @__PURE__ */ s((e) => O(D.object(e), "Object", e), "object"),
    iterable: /* @__PURE__ */ s((e) => O(D.iterable(e), "Iterable", e), "iterable"),
    asyncIterable: /* @__PURE__ */ s((e) => O(D.asyncIterable(e), "AsyncIterable", e), "asyncIterable"),
    generator: /* @__PURE__ */ s((e) => O(D.generator(e), "Generator", e), "generator"),
    asyncGenerator: /* @__PURE__ */ s((e) => O(D.asyncGenerator(e), "AsyncGenerator", e), "asyncGenerator"),
    nativePromise: /* @__PURE__ */ s((e) => O(D.nativePromise(e), "native Promise", e), "nativePromise"),
    promise: /* @__PURE__ */ s((e) => O(D.promise(e), "Promise", e), "promise"),
    generatorFunction: /* @__PURE__ */ s((e) => O(D.generatorFunction(e), "GeneratorFunction", e), "generatorFunction"),
    asyncGeneratorFunction: /* @__PURE__ */ s((e) => O(D.asyncGeneratorFunction(e), "AsyncGeneratorFunction", e), "asyncGeneratorFunction"),
    // eslint-disable-next-line @typescript-eslint/ban-types
    asyncFunction: /* @__PURE__ */ s((e) => O(D.asyncFunction(e), "AsyncFunction", e), "asyncFunction"),
    // eslint-disable-next-line @typescript-eslint/ban-types
    boundFunction: /* @__PURE__ */ s((e) => O(D.boundFunction(e), "Function", e), "boundFunction"),
    regExp: /* @__PURE__ */ s((e) => O(D.regExp(e), "RegExp", e), "regExp"),
    date: /* @__PURE__ */ s((e) => O(D.date(e), "Date", e), "date"),
    error: /* @__PURE__ */ s((e) => O(D.error(e), "Error", e), "error"),
    map: /* @__PURE__ */ s((e) => O(D.map(e), "Map", e), "map"),
    set: /* @__PURE__ */ s((e) => O(D.set(e), "Set", e), "set"),
    weakMap: /* @__PURE__ */ s((e) => O(D.weakMap(e), "WeakMap", e), "weakMap"),
    weakSet: /* @__PURE__ */ s((e) => O(D.weakSet(e), "WeakSet", e), "weakSet"),
    weakRef: /* @__PURE__ */ s((e) => O(D.weakRef(e), "WeakRef", e), "weakRef"),
    int8Array: /* @__PURE__ */ s((e) => O(D.int8Array(e), "Int8Array", e), "int8Array"),
    uint8Array: /* @__PURE__ */ s((e) => O(D.uint8Array(e), "Uint8Array", e), "uint8Array"),
    uint8ClampedArray: /* @__PURE__ */ s((e) => O(D.uint8ClampedArray(e), "Uint8ClampedArray", e), "uint8ClampedArray"),
    int16Array: /* @__PURE__ */ s((e) => O(D.int16Array(e), "Int16Array", e), "int16Array"),
    uint16Array: /* @__PURE__ */ s((e) => O(D.uint16Array(e), "Uint16Array", e), "uint16Array"),
    int32Array: /* @__PURE__ */ s((e) => O(D.int32Array(e), "Int32Array", e), "int32Array"),
    uint32Array: /* @__PURE__ */ s((e) => O(D.uint32Array(e), "Uint32Array", e), "uint32Array"),
    float32Array: /* @__PURE__ */ s((e) => O(D.float32Array(e), "Float32Array", e), "float32Array"),
    float64Array: /* @__PURE__ */ s((e) => O(D.float64Array(e), "Float64Array", e), "float64Array"),
    bigInt64Array: /* @__PURE__ */ s((e) => O(D.bigInt64Array(e), "BigInt64Array", e), "bigInt64Array"),
    bigUint64Array: /* @__PURE__ */ s((e) => O(D.bigUint64Array(e), "BigUint64Array", e), "bigUint64Array"),
    arrayBuffer: /* @__PURE__ */ s((e) => O(D.arrayBuffer(e), "ArrayBuffer", e), "arrayBuffer"),
    sharedArrayBuffer: /* @__PURE__ */ s((e) => O(D.sharedArrayBuffer(e), "SharedArrayBuffer", e), "sharedArrayBuffer"),
    dataView: /* @__PURE__ */ s((e) => O(D.dataView(e), "DataView", e), "dataView"),
    enumCase: /* @__PURE__ */ s((e, t) => O(D.enumCase(e, t), "EnumCase", e), "enumCase"),
    urlInstance: /* @__PURE__ */ s((e) => O(D.urlInstance(e), "URL", e), "urlInstance"),
    urlString: /* @__PURE__ */ s((e) => O(D.urlString(e), "string with a URL", e), "urlString"),
    truthy: /* @__PURE__ */ s((e) => O(D.truthy(e), "truthy", e), "truthy"),
    falsy: /* @__PURE__ */ s((e) => O(D.falsy(e), "falsy", e), "falsy"),
    nan: /* @__PURE__ */ s((e) => O(D.nan(e), "NaN", e), "nan"),
    primitive: /* @__PURE__ */ s((e) => O(D.primitive(e), "primitive", e), "primitive"),
    integer: /* @__PURE__ */ s((e) => O(D.integer(e), "integer", e), "integer"),
    safeInteger: /* @__PURE__ */ s((e) => O(D.safeInteger(e), "integer", e), "safeInteger"),
    plainObject: /* @__PURE__ */ s((e) => O(D.plainObject(e), "plain object", e), "plainObject"),
    typedArray: /* @__PURE__ */ s((e) => O(D.typedArray(e), "TypedArray", e), "typedArray"),
    arrayLike: /* @__PURE__ */ s((e) => O(D.arrayLike(e), "array-like", e), "arrayLike"),
    domElement: /* @__PURE__ */ s((e) => O(D.domElement(e), "HTMLElement", e), "domElement"),
    observable: /* @__PURE__ */ s((e) => O(D.observable(e), "Observable", e), "observable"),
    nodeStream: /* @__PURE__ */ s((e) => O(D.nodeStream(e), "Node.js Stream", e), "nodeStream"),
    infinite: /* @__PURE__ */ s((e) => O(D.infinite(e), "infinite number", e), "infinite"),
    emptyArray: /* @__PURE__ */ s((e) => O(D.emptyArray(e), "empty array", e), "emptyArray"),
    nonEmptyArray: /* @__PURE__ */ s((e) => O(D.nonEmptyArray(e), "non-empty array", e), "nonEmptyArray"),
    emptyString: /* @__PURE__ */ s((e) => O(D.emptyString(e), "empty string", e), "emptyString"),
    emptyStringOrWhitespace: /* @__PURE__ */ s((e) => O(D.emptyStringOrWhitespace(e), "empty string or whitespace", e), "emptyStringOrWhites\
pace"),
    nonEmptyString: /* @__PURE__ */ s((e) => O(D.nonEmptyString(e), "non-empty string", e), "nonEmptyString"),
    nonEmptyStringAndNotWhitespace: /* @__PURE__ */ s((e) => O(D.nonEmptyStringAndNotWhitespace(e), "non-empty string and not whitespace", e),
    "nonEmptyStringAndNotWhitespace"),
    emptyObject: /* @__PURE__ */ s((e) => O(D.emptyObject(e), "empty object", e), "emptyObject"),
    nonEmptyObject: /* @__PURE__ */ s((e) => O(D.nonEmptyObject(e), "non-empty object", e), "nonEmptyObject"),
    emptySet: /* @__PURE__ */ s((e) => O(D.emptySet(e), "empty set", e), "emptySet"),
    nonEmptySet: /* @__PURE__ */ s((e) => O(D.nonEmptySet(e), "non-empty set", e), "nonEmptySet"),
    emptyMap: /* @__PURE__ */ s((e) => O(D.emptyMap(e), "empty map", e), "emptyMap"),
    nonEmptyMap: /* @__PURE__ */ s((e) => O(D.nonEmptyMap(e), "non-empty map", e), "nonEmptyMap"),
    propertyKey: /* @__PURE__ */ s((e) => O(D.propertyKey(e), "PropertyKey", e), "propertyKey"),
    formData: /* @__PURE__ */ s((e) => O(D.formData(e), "FormData", e), "formData"),
    urlSearchParams: /* @__PURE__ */ s((e) => O(D.urlSearchParams(e), "URLSearchParams", e), "urlSearchParams"),
    // Numbers.
    evenInteger: /* @__PURE__ */ s((e) => O(D.evenInteger(e), "even integer", e), "evenInteger"),
    oddInteger: /* @__PURE__ */ s((e) => O(D.oddInteger(e), "odd integer", e), "oddInteger"),
    // Two arguments.
    directInstanceOf: /* @__PURE__ */ s((e, t) => O(D.directInstanceOf(e, t), "T", e), "directInstanceOf"),
    inRange: /* @__PURE__ */ s((e, t) => O(D.inRange(e, t), "in range", e), "inRange"),
    // Variadic functions.
    any: /* @__PURE__ */ s((e, ...t) => O(D.any(e, ...t), "predicate returns truthy for any value", t, { multipleValues: !0 }), "any"),
    all: /* @__PURE__ */ s((e, ...t) => O(D.all(e, ...t), "predicate returns truthy for all values", t, { multipleValues: !0 }), "all")
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
  Object.defineProperties(R, {
    class: {
      value: R.class_
    },
    function: {
      value: R.function_
    },
    null: {
      value: R.null_
    }
  });
  var m = D, t3 = x("events"), r3 = class extends Error {
    static {
      s(this, "CancelError");
    }
    constructor(e) {
      super(e || "Promise was canceled"), this.name = "CancelError";
    }
    get isCanceled() {
      return !0;
    }
  }, Rc = class {
    static {
      s(this, "PCancelable");
    }
    static fn(e) {
      return (...t) => new Rc((r, i, n) => {
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
        this._rejectOnCancel && this._reject(new r3(e));
      }
    }
    get isCanceled() {
      return this._isCanceled;
    }
  };
  Object.setPrototypeOf(Rc.prototype, Promise.prototype);
  function i3(e) {
    return m.object(e) && "_onResponse" in e;
  }
  s(i3, "isRequest");
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
      t.input, i3(r) ? (Object.defineProperty(this, "request", {
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
  }, n3 = class extends Te {
    static {
      s(this, "MaxRedirectsError");
    }
    constructor(e) {
      super(`Redirected ${e.options.maxRedirects} times. Aborting.`, {}, e), this.name = "MaxRedirectsError", this.code = "ERR_TOO_MANY_REDI\
RECTS";
    }
  }, qo = class extends Te {
    static {
      s(this, "HTTPError");
    }
    constructor(e) {
      super(`Response code ${e.statusCode} (${e.statusMessage})`, {}, e.request), this.name = "HTTPError", this.code = "ERR_NON_2XX_3XX_RESP\
ONSE";
    }
  }, s3 = class extends Te {
    static {
      s(this, "CacheError");
    }
    constructor(e, t) {
      super(e.message, e, t), this.name = "CacheError", this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_CACHE_ACCESS" : this.code;
    }
  }, Ub = class extends Te {
    static {
      s(this, "UploadError");
    }
    constructor(e, t) {
      super(e.message, e, t), this.name = "UploadError", this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_UPLOAD" : this.code;
    }
  }, o3 = class extends Te {
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
  }, $b = class extends Te {
    static {
      s(this, "ReadError");
    }
    constructor(e, t) {
      super(e.message, e, t), this.name = "ReadError", this.code = this.code === "ERR_GOT_REQUEST_ERROR" ? "ERR_READING_RESPONSE_STREAM" : this.
      code;
    }
  }, a3 = class extends Te {
    static {
      s(this, "RetryError");
    }
    constructor(e) {
      super("Retrying", {}, e), this.name = "RetryError", this.code = "ERR_RETRYING";
    }
  }, u3 = class extends Te {
    static {
      s(this, "AbortError");
    }
    constructor(e) {
      super("This operation was aborted.", {}, e), this.code = "ERR_ABORTED", this.name = "AbortError";
    }
  }, T0 = Fe(x("process"), 1), yc = x("buffer"), l3 = x("stream"), Wb = x("url"), bc = Fe(x("http"), 1), c3 = x("events"), d3 = x("util"), f3 = Fe(
  E1(), 1), h3 = /* @__PURE__ */ s((e) => {
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
      a.once(c3.errorMonitor, () => {
        t.error = Date.now(), t.phases.total = t.error - t.start;
      });
    }, "handleError");
    r(e);
    let i = /* @__PURE__ */ s(() => {
      t.abort = Date.now(), t.phases.total = t.abort - t.start;
    }, "onAbort");
    e.prependOnceListener("abort", i);
    let n = /* @__PURE__ */ s((a) => {
      if (t.socket = Date.now(), t.phases.wait = t.socket - t.start, d3.types.isProxy(a))
        return;
      let u = /* @__PURE__ */ s(() => {
        t.lookup = Date.now(), t.phases.dns = t.lookup - t.socket;
      }, "lookupListener");
      a.prependOnceListener("lookup", u), (0, f3.default)(a, {
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
  }, "timer"), p3 = h3, D3 = Fe(x("events"), 1), Ro = Fe(x("url"), 1), m3 = Fe(x("crypto"), 1), A0 = Fe(x("stream"), 1), g3 = "text/plain", y3 = "\
us-ascii", vc = /* @__PURE__ */ s((e, t) => t.some((r) => r instanceof RegExp ? r.test(e) : r === e), "testParameter"), b3 = /* @__PURE__ */ new Set(
  [
    "https:",
    "http:",
    "file:"
  ]), v3 = /* @__PURE__ */ s((e) => {
    try {
      let { protocol: t } = new URL(e);
      return t.endsWith(":") && !b3.has(t);
    } catch {
      return !1;
    }
  }, "hasCustomProtocol"), _3 = /* @__PURE__ */ s((e, { stripHash: t }) => {
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
        return f === "charset" && (g = g.toLowerCase(), g === y3) ? "" : `${f}${g ? `=${g}` : ""}`;
      }).filter(Boolean)
    ];
    return l && p.push("base64"), (p.length > 0 || c && c !== g3) && p.unshift(c), `data:${p.join(";")},${l ? o.trim() : o}${a ? `#${a}` : ""}`;
  }, "normalizeDataURL");
  function w3(e, t) {
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
      return _3(e, t);
    if (v3(e))
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
      vc(u, t.removeDirectoryIndex) && (a = a.slice(0, -1), n.pathname = a.slice(1).join("/") + "/");
    }
    if (n.hostname && (n.hostname = n.hostname.replace(/\.$/, ""), t.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(n.
    hostname) && (n.hostname = n.hostname.replace(/^www\./, ""))), Array.isArray(t.removeQueryParameters))
      for (let a of [...n.searchParams.keys()])
        vc(a, t.removeQueryParameters) && n.searchParams.delete(a);
    if (!Array.isArray(t.keepQueryParameters) && t.removeQueryParameters === !0 && (n.search = ""), Array.isArray(t.keepQueryParameters) && t.
    keepQueryParameters.length > 0)
      for (let a of [...n.searchParams.keys()])
        vc(a, t.keepQueryParameters) || n.searchParams.delete(a);
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
  s(w3, "normalizeUrl");
  var E3 = Fe(h0(), 1), _c = Fe(x1(), 1), C3 = x("stream");
  function Tc(e) {
    return Object.fromEntries(Object.entries(e).map(([t, r]) => [t.toLowerCase(), r]));
  }
  s(Tc, "lowercaseKeys");
  var Hb = class extends C3.Readable {
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
      }), this.statusCode = e, this.headers = Tc(t), this.body = r, this.url = i;
    }
  }, ko = Fe(S1(), 1), x3 = [
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
  function F3(e, t) {
    if (t._readableState.autoDestroy)
      throw new Error("The second stream must have the `autoDestroy` option set to `false`");
    let r = /* @__PURE__ */ new Set([...Object.keys(e), ...x3]), i = {};
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
  s(F3, "mimicResponse");
  var S3 = class extends Error {
    static {
      s(this, "RequestError2");
    }
    constructor(e) {
      super(e.message), Object.assign(this, e);
    }
  }, Nn = class extends Error {
    static {
      s(this, "CacheError2");
    }
    constructor(e) {
      super(e.message), Object.assign(this, e);
    }
  }, T3 = class {
    static {
      s(this, "CacheableRequest");
    }
    constructor(e, t) {
      this.hooks = /* @__PURE__ */ new Map(), this.request = () => (r, i) => {
        let n;
        if (typeof r == "string")
          n = wc(Ro.default.parse(r)), r = {};
        else if (r instanceof Ro.default.URL)
          n = wc(Ro.default.parse(r.toString())), r = {};
        else {
          let [p, ...h] = (r.path ?? "").split("?"), f = h.length > 0 ? `?${h.join("?")}` : "";
          n = wc({ ...r, pathname: p, search: f });
        }
        r = {
          headers: {},
          method: "GET",
          cache: !0,
          strictTtl: !1,
          automaticFailover: !1,
          ...r,
          ...k3(n)
        }, r.headers = Object.fromEntries(A3(r.headers).map(([p, h]) => [p.toLowerCase(), h]));
        let o = new D3.default(), a = w3(Ro.default.format(n), {
          stripWWW: !1,
          removeTrailingSlash: !1,
          stripAuthentication: !1
        }), u = `${r.method}:${a}`;
        r.body && r.method !== void 0 && ["POST", "PATCH", "PUT"].includes(r.method) && (r.body instanceof A0.default.Readable ? r.cache = !1 :
        u += `:${m3.default.createHash("md5").update(r.body).digest("hex")}`);
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
              let F = _c.default.fromObject(l.cachePolicy).revalidatedPolicy(p, _);
              if (!F.modified) {
                _.resume(), await new Promise((A) => {
                  _.once("end", A);
                });
                let w = Vb(F.policy.responseHeaders());
                _ = new Hb({ statusCode: l.statusCode, headers: w, body: l.body, url: l.url }), _.cachePolicy = F.policy, _.fromCache = !0;
              }
            }
            _.fromCache || (_.cachePolicy = new _c.default(p, _, p), _.fromCache = !1);
            let C;
            p.cache && _.cachePolicy.storable() ? (C = R3(_), (async () => {
              try {
                let F = E3.default.buffer(_);
                await Promise.race([
                  g,
                  new Promise((S) => _.once("end", S)),
                  new Promise((S) => _.once("close", S))
                  // eslint-disable-line no-promise-executor-return
                ]);
                let w = await F, A = {
                  url: _.url,
                  statusCode: _.fromCache ? l.statusCode : _.statusCode,
                  body: w,
                  cachePolicy: _.cachePolicy.toObject()
                }, T = p.strictTtl ? _.cachePolicy.timeToLive() : void 0;
                if (p.maxTtl && (T = T ? Math.min(T, p.maxTtl) : p.maxTtl), this.hooks.size > 0)
                  for (let S of this.hooks.keys())
                    A = await this.runHook(S, A, _);
                await this.cache.set(u, A, T);
              } catch (F) {
                o.emit("error", new Nn(F));
              }
            })()) : p.cache && l && (async () => {
              try {
                await this.cache.delete(u);
              } catch (F) {
                o.emit("error", new Nn(F));
              }
            })(), o.emit("response", C ?? _), typeof i == "function" && i(C ?? _);
          }, "handler");
          try {
            let _ = this.cacheRequest(p, E);
            _.once("error", f), _.once("abort", f), _.once("destroy", f), o.emit("request", _);
          } catch (_) {
            o.emit("error", new S3(_));
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
            let E = _c.default.fromObject(g.cachePolicy);
            if (E.satisfiesWithoutRevalidation(f) && !f.forceRefresh) {
              let _ = Vb(E.responseHeaders()), C = new Hb({ statusCode: g.statusCode, headers: _, body: g.body, url: g.url });
              C.cachePolicy = E, C.fromCache = !0, o.emit("response", C), typeof i == "function" && i(C);
            } else E.satisfiesWithoutRevalidation(f) && Date.now() >= E.timeToLive() && f.forceRefresh ? (await this.cache.delete(u), f.headers =
            E.revalidationHeaders(f), d(f)) : (l = g, f.headers = E.revalidationHeaders(f), d(f));
          }, "get"), h = /* @__PURE__ */ s((f) => o.emit("error", new Nn(f)), "errorHandler");
          if (this.cache instanceof ko.default) {
            let f = this.cache;
            f.once("error", h), o.on("error", () => f.removeListener("error", h)), o.on("response", () => f.removeListener("error", h));
          }
          try {
            await p(r);
          } catch (f) {
            r.automaticFailover && !c && d(r), o.emit("error", new Nn(f));
          }
        })(), o;
      }, this.addHook = (r, i) => {
        this.hooks.has(r) || this.hooks.set(r, i);
      }, this.removeHook = (r) => this.hooks.delete(r), this.getHook = (r) => this.hooks.get(r), this.runHook = async (r, ...i) => {
        var n;
        return (n = this.hooks.get(r)) == null ? void 0 : n(...i);
      }, t instanceof ko.default ? this.cache = t : typeof t == "string" ? this.cache = new ko.default({
        uri: t,
        namespace: "cacheable-request"
      }) : this.cache = new ko.default({
        store: t,
        namespace: "cacheable-request"
      }), this.request = this.request.bind(this), this.cacheRequest = e;
    }
  }, A3 = Object.entries, R3 = /* @__PURE__ */ s((e) => {
    let t = new A0.PassThrough({ autoDestroy: !1 });
    return F3(e, t), e.pipe(t);
  }, "cloneResponse"), k3 = /* @__PURE__ */ s((e) => {
    let t = { ...e };
    return t.path = `${e.pathname || "/"}${e.search || ""}`, delete t.pathname, delete t.search, t;
  }, "urlObjectToRequestOptions"), wc = /* @__PURE__ */ s((e) => (
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
  ), "normalizeUrlObject"), Vb = /* @__PURE__ */ s((e) => {
    let t = [];
    for (let r of Object.keys(e))
      t[r.toLowerCase()] = e[r];
    return t;
  }, "convertHeaders"), O3 = T3, B3 = Fe(A1(), 1), P3 = Fe(h0(), 1), Lt = /* @__PURE__ */ s((e) => typeof e == "function", "isFunction"), I3 = /* @__PURE__ */ s(
  (e) => Lt(e[Symbol.asyncIterator]), "isAsyncIterable");
  async function* M3(e) {
    let t = e.getReader();
    for (; ; ) {
      let { done: r, value: i } = await t.read();
      if (r)
        break;
      yield i;
    }
  }
  s(M3, "readStream");
  var j3 = /* @__PURE__ */ s((e) => {
    if (I3(e))
      return e;
    if (Lt(e.getReader))
      return M3(e);
    throw new TypeError("Unsupported data source: Expected either ReadableStream or async iterable.");
  }, "getStreamIterator"), Zb = "abcdefghijklmnopqrstuvwxyz0123456789";
  function q3() {
    let e = 16, t = "";
    for (; e--; )
      t += Zb[Math.random() * Zb.length << 0];
    return t;
  }
  s(q3, "createBoundary");
  var zb = /* @__PURE__ */ s((e) => String(e).replace(/\r|\n/g, (t, r, i) => t === "\r" && i[r + 1] !== `
` || t === `
` && i[r - 1] !== "\r" ? `\r
` : t), "normalizeValue"), L3 = /* @__PURE__ */ s((e) => Object.prototype.toString.call(e).slice(8, -1).toLowerCase(), "getType");
  function Gb(e) {
    if (L3(e) !== "object")
      return !1;
    let t = Object.getPrototypeOf(e);
    return t == null ? !0 : (t.constructor && t.constructor.toString()) === Object.toString();
  }
  s(Gb, "isPlainObject");
  function Kb(e, t) {
    if (typeof t == "string") {
      for (let [r, i] of Object.entries(e))
        if (t.toLowerCase() === r.toLowerCase())
          return i;
    }
  }
  s(Kb, "getProperty");
  var N3 = /* @__PURE__ */ s((e) => new Proxy(e, {
    get: /* @__PURE__ */ s((t, r) => Kb(t, r), "get"),
    has: /* @__PURE__ */ s((t, r) => Kb(t, r) !== void 0, "has")
  }), "proxyHeaders"), kc = /* @__PURE__ */ s((e) => !!(e && Lt(e.constructor) && e[Symbol.toStringTag] === "FormData" && Lt(e.append) && Lt(
  e.getAll) && Lt(e.entries) && Lt(e[Symbol.iterator])), "isFormData"), Yb = /* @__PURE__ */ s((e) => String(e).replace(/\r/g, "%0D").replace(
  /\n/g, "%0A").replace(/"/g, "%22"), "escapeName"), wr = /* @__PURE__ */ s((e) => !!(e && typeof e == "object" && Lt(e.constructor) && e[Symbol.
  toStringTag] === "File" && Lt(e.stream) && e.name != null), "isFile"), Pn = /* @__PURE__ */ s(function(e, t, r, i, n) {
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
  }, "__classPrivateFieldGet"), In, rr, Mn, Oo, jn, Er, qn, Ln, Bo, Ec, Jb, U3 = {
    enableAdditionalHeaders: !1
  }, Po = { writable: !1, configurable: !1 }, $3 = class {
    static {
      s(this, "FormDataEncoder");
    }
    constructor(e, t, r) {
      if (In.add(this), rr.set(this, `\r
`), Mn.set(this, void 0), Oo.set(this, void 0), jn.set(this, "-".repeat(2)), Er.set(this, new TextEncoder()), qn.set(this, void 0), Ln.set(this,
      void 0), Bo.set(this, void 0), !kc(e))
        throw new TypeError("Expected first argument to be a FormData instance.");
      let i;
      if (Gb(t) ? r = t : i = t, i || (i = q3()), typeof i != "string")
        throw new TypeError("Expected boundary argument to be a string.");
      if (r && !Gb(r))
        throw new TypeError("Expected options argument to be an object.");
      Pn(this, Ln, Array.from(e.entries()), "f"), Pn(this, Bo, { ...U3, ...r }, "f"), Pn(this, Mn, he(this, Er, "f").encode(he(this, rr, "f")),
      "f"), Pn(this, Oo, he(this, Mn, "f").byteLength, "f"), this.boundary = `form-data-boundary-${i}`, this.contentType = `multipart/form-d\
ata; boundary=${this.boundary}`, Pn(this, qn, he(this, Er, "f").encode(`${he(this, jn, "f")}${this.boundary}${he(this, jn, "f")}${he(this, rr,
      "f").repeat(2)}`), "f");
      let n = {
        "Content-Type": this.contentType
      }, o = he(this, In, "m", Jb).call(this);
      o && (this.contentLength = o, n["Content-Length"] = o), this.headers = N3(Object.freeze(n)), Object.defineProperties(this, {
        boundary: Po,
        contentType: Po,
        contentLength: Po,
        headers: Po
      });
    }
    getContentLength() {
      return this.contentLength == null ? void 0 : Number(this.contentLength);
    }
    *values() {
      for (let [e, t] of he(this, Ln, "f")) {
        let r = wr(t) ? t : he(this, Er, "f").encode(zb(t));
        yield he(this, In, "m", Ec).call(this, e, r), yield r, yield he(this, Mn, "f");
      }
      yield he(this, qn, "f");
    }
    async *encode() {
      for (let e of this.values())
        wr(e) ? yield* j3(e.stream()) : yield e;
    }
    [(rr = /* @__PURE__ */ new WeakMap(), Mn = /* @__PURE__ */ new WeakMap(), Oo = /* @__PURE__ */ new WeakMap(), jn = /* @__PURE__ */ new WeakMap(),
    Er = /* @__PURE__ */ new WeakMap(), qn = /* @__PURE__ */ new WeakMap(), Ln = /* @__PURE__ */ new WeakMap(), Bo = /* @__PURE__ */ new WeakMap(),
    In = /* @__PURE__ */ new WeakSet(), Ec = /* @__PURE__ */ s(function(t, r) {
      let i = "";
      i += `${he(this, jn, "f")}${this.boundary}${he(this, rr, "f")}`, i += `Content-Disposition: form-data; name="${Yb(t)}"`, wr(r) && (i +=
      `; filename="${Yb(r.name)}"${he(this, rr, "f")}`, i += `Content-Type: ${r.type || "application/octet-stream"}`);
      let n = wr(r) ? r.size : r.byteLength;
      return he(this, Bo, "f").enableAdditionalHeaders === !0 && n != null && !isNaN(n) && (i += `${he(this, rr, "f")}Content-Length: ${wr(r) ?
      r.size : r.byteLength}`), he(this, Er, "f").encode(`${i}${he(this, rr, "f").repeat(2)}`);
    }, "_FormDataEncoder_getFieldHeader2"), Jb = /* @__PURE__ */ s(function() {
      let t = 0;
      for (let [r, i] of he(this, Ln, "f")) {
        let n = wr(i) ? i : he(this, Er, "f").encode(zb(i)), o = wr(n) ? n.size : n.byteLength;
        if (o == null || isNaN(o))
          return;
        t += he(this, In, "m", Ec).call(this, r, n).byteLength, t += o, t += he(this, Oo, "f");
      }
      return String(t + he(this, qn, "f").byteLength);
    }, "_FormDataEncoder_getContentLength2"), Symbol.iterator)]() {
      return this.values();
    }
    [Symbol.asyncIterator]() {
      return this.encode();
    }
  }, W3 = x("buffer"), H3 = x("util");
  function R0(e) {
    return m.nodeStream(e) && m.function_(e.getBoundary);
  }
  s(R0, "isFormData2");
  async function V3(e, t) {
    if (t && "content-length" in t)
      return Number(t["content-length"]);
    if (!e)
      return 0;
    if (m.string(e))
      return W3.Buffer.byteLength(e);
    if (m.buffer(e))
      return e.length;
    if (R0(e))
      return (0, H3.promisify)(e.getLength.bind(e))();
  }
  s(V3, "getBodySize");
  function k0(e, t, r) {
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
  s(k0, "proxyEvents");
  var Z3 = Fe(x("net"), 1);
  function z3() {
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
  s(z3, "unhandle");
  var Xb = Symbol("reentry"), G3 = /* @__PURE__ */ s(() => {
  }, "noop"), O0 = class extends Error {
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
  function K3(e, t, r) {
    if (Xb in e)
      return G3;
    e[Xb] = !0;
    let i = [], { once: n, unhandleAll: o } = z3(), a = /* @__PURE__ */ s((E, _, C) => {
      var F;
      let w = setTimeout(_, E, E, C);
      (F = w.unref) == null || F.call(w);
      let A = /* @__PURE__ */ s(() => {
        clearTimeout(w);
      }, "cancel");
      return i.push(A), A;
    }, "addTimeout"), { host: u, hostname: l } = r, c = /* @__PURE__ */ s((E, _) => {
      e.destroy(new O0(E, _));
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
        let C = !!(_ ?? Z3.default.isIP(l ?? u ?? "") !== 0);
        if (p && !C && typeof E.address().address > "u") {
          let F = a(t.lookup, c, "lookup");
          n(E, "lookup", F);
        }
        if (h) {
          let F = /* @__PURE__ */ s(() => a(t.connect, c, "connect"), "timeConnect");
          C ? n(E, "connect", F()) : n(E, "lookup", (w) => {
            w === null && n(E, "connect", F());
          });
        }
        f && r.protocol === "https:" && n(E, "connect", () => {
          let F = a(t.secureConnect, c, "secureConnect");
          n(E, "secureConnect", F);
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
  s(K3, "timedOut");
  function Y3(e) {
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
  s(Y3, "urlToOptions");
  var J3 = class {
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
  }, X3 = /* @__PURE__ */ s(({ attemptCount: e, retryOptions: t, error: r, retryAfter: i, computedValue: n }) => {
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
  }, "calculateRetryDelay"), Q3 = X3, eR = Fe(x("process"), 1), Cc = x("util"), Cr = x("url"), tR = x("tls"), rR = Fe(x("http"), 1), iR = Fe(
  x("https"), 1), Ei = x("dns"), xc = x("util"), nR = Fe(x("os"), 1), { Resolver: Qb } = Ei.promises, wi = Symbol("cacheableLookupCreateConn\
ection"), Fc = Symbol("cacheableLookupInstance"), e0 = Symbol("expires"), sR = typeof Ei.ALL == "number", t0 = /* @__PURE__ */ s((e) => {
    if (!(e && typeof e.createConnection == "function"))
      throw new Error("Expected an Agent instance as the first argument");
  }, "verifyAgent"), oR = /* @__PURE__ */ s((e) => {
    for (let t of e)
      t.family !== 6 && (t.address = `::ffff:${t.address}`, t.family = 6);
  }, "map4to6"), r0 = /* @__PURE__ */ s(() => {
    let e = !1, t = !1;
    for (let r of Object.values(nR.default.networkInterfaces()))
      for (let i of r)
        if (!i.internal && (i.family === "IPv6" ? t = !0 : e = !0, e && t))
          return { has4: e, has6: t };
    return { has4: e, has6: t };
  }, "getIfaceInfo"), aR = /* @__PURE__ */ s((e) => Symbol.iterator in e, "isIterable"), Io = /* @__PURE__ */ s((e) => e.catch((t) => {
    if (t.code === "ENODATA" || t.code === "ENOTFOUND" || t.code === "ENOENT")
      return [];
    throw t;
  }), "ignoreNoResultErrors"), i0 = { ttl: !0 }, uR = { all: !0 }, lR = { all: !0, family: 4 }, cR = { all: !0, family: 6 }, dR = class {
    static {
      s(this, "CacheableLookup");
    }
    constructor({
      cache: e = /* @__PURE__ */ new Map(),
      maxTtl: t = 1 / 0,
      fallbackDuration: r = 3600,
      errorTtl: i = 0.15,
      resolver: n = new Qb(),
      lookup: o = Ei.lookup
    } = {}) {
      if (this.maxTtl = t, this.errorTtl = i, this._cache = e, this._resolver = n, this._dnsLookup = o && (0, xc.promisify)(o), this.stats =
      {
        cache: 0,
        query: 0
      }, this._resolver instanceof Qb ? (this._resolve4 = this._resolver.resolve4.bind(this._resolver), this._resolve6 = this._resolver.resolve6.
      bind(this._resolver)) : (this._resolve4 = (0, xc.promisify)(this._resolver.resolve4.bind(this._resolver)), this._resolve6 = (0, xc.promisify)(
      this._resolver.resolve6.bind(this._resolver))), this._iface = r0(), this._pending = {}, this._nextRemovalTime = !1, this._hostnamesToFallback =
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
        t.hints & Ei.V4MAPPED && (sR && t.hints & Ei.ALL || i.length === 0) ? oR(r) : r = i;
      } else t.family === 4 && (r = r.filter((i) => i.family === 4));
      if (t.hints & Ei.ADDRCONFIG) {
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
        Io(this._resolve4(e, i0)),
        Io(this._resolve6(e, i0))
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
          Io(this._dnsLookup(e, lR)),
          Io(this._dnsLookup(e, cR))
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
        r = Math.min(r, this.maxTtl) * 1e3, t[e0] = Date.now() + r;
        try {
          await this._cache.set(e, t, r);
        } catch (i) {
          this.lookupAsync = async () => {
            let n = new Error("Cache Error. Please recreate the CacheableLookup instance.");
            throw n.cause = i, n;
          };
        }
        aR(this._cache) && this._tick(r);
      }
    }
    async queryAndCache(e) {
      if (this._hostnamesToFallback.has(e))
        return this._dnsLookup(e, uR);
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
          let a = o[e0];
          i >= a ? this._cache.delete(n) : a < r && (r = a);
        }
        r !== 1 / 0 && this._tick(r - i);
      }, e), this._removalTimeout.unref && this._removalTimeout.unref());
    }
    install(e) {
      if (t0(e), wi in e)
        throw new Error("CacheableLookup has been already installed");
      e[wi] = e.createConnection, e[Fc] = this, e.createConnection = (t, r) => ("lookup" in t || (t.lookup = this.lookup), e[wi](t, r));
    }
    uninstall(e) {
      if (t0(e), e[wi]) {
        if (e[Fc] !== this)
          throw new Error("The agent is not owned by this CacheableLookup instance");
        e.createConnection = e[wi], delete e[wi], delete e[Fc];
      }
    }
    updateInterfaceInfo() {
      let { _iface: e } = this;
      this._iface = r0(), (e.has4 && !this._iface.has4 || e.has6 && !this._iface.has6) && this._cache.clear();
    }
    clear(e) {
      if (e) {
        this._cache.delete(e);
        return;
      }
      this._cache.clear();
    }
  }, fR = Fe(N1(), 1);
  function hR(e) {
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
  s(hR, "parseLinkHeader");
  var [n0, pR] = eR.default.versions.node.split(".").map(Number);
  function DR(e) {
    for (let t in e) {
      let r = e[t];
      R.any([m.string, m.number, m.boolean, m.null_, m.undefined], r);
    }
  }
  s(DR, "validateSearchParameters");
  var mR = /* @__PURE__ */ new Map(), Mo, gR = /* @__PURE__ */ s(() => Mo || (Mo = new dR(), Mo), "getGlobalDnsCache"), yR = {
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
        let i = hR(t).find((n) => n.parameters.rel === "next" || n.parameters.rel === '"next"');
        return i ? {
          url: new Cr.URL(i.reference, e.url)
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
  }, bR = /* @__PURE__ */ s((e) => {
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
      searchParams: e.searchParams ? new Cr.URLSearchParams(e.searchParams) : void 0,
      pagination: { ...e.pagination }
    };
    return i.url !== void 0 && (i.prefixUrl = ""), i;
  }, "cloneInternals"), vR = /* @__PURE__ */ s((e) => {
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
  }, "cloneRaw"), _R = /* @__PURE__ */ s((e) => {
    let t = [e.timeout.socket, e.timeout.connect, e.timeout.lookup, e.timeout.request, e.timeout.secureConnect].filter((r) => typeof r == "n\
umber");
    if (t.length > 0)
      return Math.min(...t);
  }, "getHttp2TimeoutOption"), s0 = /* @__PURE__ */ s((e, t, r) => {
    var i;
    let n = (i = e.hooks) == null ? void 0 : i.init;
    if (n)
      for (let o of n)
        o(t, r);
  }, "init"), Nt = class {
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
      }), R.any([m.string, m.urlInstance, m.object, m.undefined], e), R.any([m.object, m.undefined], t), R.any([m.object, m.undefined], r), e instanceof
      Nt || t instanceof Nt)
        throw new TypeError("The defaults must be passed as the third argument");
      this._internals = bR(r?._internals ?? r ?? yR), this._init = [...r?._init ?? []], this._merging = !1, this._unixOptions = void 0;
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
        if (e instanceof Nt) {
          for (let t of e._init)
            this.merge(t);
          return;
        }
        e = vR(e), s0(this, e, this), s0(e, e, this), this._merging = !0, "isStream" in e && (this.isStream = e.isStream);
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
      R.any([m.function_, m.undefined], e), this._internals.request = e;
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
      R.plainObject(e);
      for (let t in e) {
        if (!(t in this._internals.agent))
          throw new TypeError(`Unexpected agent option: ${t}`);
        R.any([m.object, m.undefined], e[t]);
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
      R.boolean(e), this._internals.decompress = e;
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
      R.plainObject(e);
      for (let t in e) {
        if (!(t in this._internals.timeout))
          throw new Error(`Unexpected timeout option: ${t}`);
        R.any([m.number, m.undefined], e[t]);
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
      if (R.any([m.string, m.urlInstance], e), e === "") {
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
      R.any([m.string, m.buffer, m.nodeStream, m.generator, m.asyncGenerator, kc, m.undefined], e), m.nodeStream(e) && R.truthy(e.readable),
      e !== void 0 && (R.undefined(this._internals.form), R.undefined(this._internals.json)), this._internals.body = e;
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
      R.any([m.plainObject, m.undefined], e), e !== void 0 && (R.undefined(this._internals.body), R.undefined(this._internals.json)), this._internals.
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
      e !== void 0 && (R.undefined(this._internals.body), R.undefined(this._internals.form)), this._internals.json = e;
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
      if (R.any([m.string, m.urlInstance, m.undefined], e), e === void 0) {
        this._internals.url = void 0;
        return;
      }
      if (m.string(e) && e.startsWith("/"))
        throw new Error("`url` must not start with a slash");
      let t = `${this.prefixUrl}${e.toString()}`, r = new Cr.URL(t);
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
      if (R.any([m.object, m.undefined], e), e === void 0) {
        this._internals.cookieJar = void 0;
        return;
      }
      let { setCookie: t, getCookieString: r } = e;
      R.function_(t), R.function_(r), t.length === 4 && r.length === 0 ? (t = (0, Cc.promisify)(t.bind(e)), r = (0, Cc.promisify)(r.bind(e)),
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
      R.object(e), this._internals.signal = e;
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
      R.boolean(e), this._internals.ignoreInvalidCookies = e;
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
      new Cr.URLSearchParams()), this._internals.searchParams);
    }
    set searchParams(e) {
      R.any([m.string, m.object, m.undefined], e);
      let t = this._internals.url;
      if (e === void 0) {
        this._internals.searchParams = void 0, t && (t.search = "");
        return;
      }
      let r = this.searchParams, i;
      if (m.string(e))
        i = new Cr.URLSearchParams(e);
      else if (e instanceof Cr.URLSearchParams)
        i = e;
      else {
        DR(e), i = new Cr.URLSearchParams();
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
      R.any([m.function_, m.undefined], e), this._internals.dnsLookup = e;
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
      R.any([m.object, m.boolean, m.undefined], e), e === !0 ? this._internals.dnsCache = gR() : e === !1 ? this._internals.dnsCache = void 0 :
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
      R.object(e), this._merging ? Object.assign(this._internals.context, e) : this._internals.context = { ...e };
    }
    /**
    Hooks allow modifications during the request lifecycle.
    Hook functions may be async and are run serially.
    */
    get hooks() {
      return this._internals.hooks;
    }
    set hooks(e) {
      R.object(e);
      for (let t in e) {
        if (!(t in this._internals.hooks))
          throw new Error(`Unexpected hook event: ${t}`);
        let r = t, i = e[r];
        if (R.any([m.array, m.undefined], i), i)
          for (let n of i)
            R.function_(n);
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
      R.boolean(e), this._internals.followRedirect = e;
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
      R.number(e), this._internals.maxRedirects = e;
    }
    /**
        A cache adapter instance for storing cached response data.
    
        @default false
        */
    get cache() {
      return this._internals.cache;
    }
    set cache(e) {
      R.any([m.object, m.string, m.boolean, m.undefined], e), e === !0 ? this._internals.cache = mR : e === !1 ? this._internals.cache = void 0 :
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
      R.boolean(e), this._internals.throwHttpErrors = e;
    }
    get username() {
      let e = this._internals.url, t = e ? e.username : this._internals.username;
      return decodeURIComponent(t);
    }
    set username(e) {
      R.string(e);
      let t = this._internals.url, r = encodeURIComponent(e);
      t ? t.username = r : this._internals.username = r;
    }
    get password() {
      let e = this._internals.url, t = e ? e.password : this._internals.password;
      return decodeURIComponent(t);
    }
    set password(e) {
      R.string(e);
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
      R.boolean(e), this._internals.http2 = e;
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
      R.boolean(e), this._internals.allowGetBody = e;
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
      R.plainObject(e), this._merging ? Object.assign(this._internals.headers, Tc(e)) : this._internals.headers = Tc(e);
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
      R.boolean(e), this._internals.methodRewriting = e;
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
      R.function_(e), this._internals.parseJson = e;
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
      R.function_(e), this._internals.stringifyJson = e;
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
      if (R.plainObject(e), R.any([m.function_, m.undefined], e.calculateDelay), R.any([m.number, m.undefined], e.maxRetryAfter), R.any([m.number,
      m.undefined], e.limit), R.any([m.array, m.undefined], e.methods), R.any([m.array, m.undefined], e.statusCodes), R.any([m.array, m.undefined],
      e.errorCodes), R.any([m.number, m.undefined], e.noise), e.noise && Math.abs(e.noise) > 100)
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
      R.any([m.string, m.undefined], e), this._internals.localAddress = e;
    }
    /**
        The HTTP method used to make the request.
    
        @default 'GET'
        */
    get method() {
      return this._internals.method;
    }
    set method(e) {
      R.string(e), this._internals.method = e.toUpperCase();
    }
    get createConnection() {
      return this._internals.createConnection;
    }
    set createConnection(e) {
      R.any([m.function_, m.undefined], e), this._internals.createConnection = e;
    }
    /**
        From `http-cache-semantics`
    
        @default {}
        */
    get cacheOptions() {
      return this._internals.cacheOptions;
    }
    set cacheOptions(e) {
      R.plainObject(e), R.any([m.boolean, m.undefined], e.shared), R.any([m.number, m.undefined], e.cacheHeuristic), R.any([m.number, m.undefined],
      e.immutableMinTimeToLive), R.any([m.boolean, m.undefined], e.ignoreCargoCult);
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
      R.plainObject(e), R.any([m.boolean, m.undefined], e.rejectUnauthorized), R.any([m.function_, m.undefined], e.checkServerIdentity), R.any(
      [m.string, m.object, m.array, m.undefined], e.certificateAuthority), R.any([m.string, m.object, m.array, m.undefined], e.key), R.any([
      m.string, m.object, m.array, m.undefined], e.certificate), R.any([m.string, m.undefined], e.passphrase), R.any([m.string, m.buffer, m.
      array, m.undefined], e.pfx), R.any([m.array, m.undefined], e.alpnProtocols), R.any([m.string, m.undefined], e.ciphers), R.any([m.string,
      m.buffer, m.undefined], e.dhparam), R.any([m.string, m.undefined], e.signatureAlgorithms), R.any([m.string, m.undefined], e.minVersion),
      R.any([m.string, m.undefined], e.maxVersion), R.any([m.boolean, m.undefined], e.honorCipherOrder), R.any([m.number, m.undefined], e.tlsSessionLifetime),
      R.any([m.string, m.undefined], e.ecdhCurve), R.any([m.string, m.buffer, m.array, m.undefined], e.certificateRevocationLists);
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
      R.any([m.string, m.undefined], e), this._internals.encoding = e;
    }
    /**
        When set to `true` the promise will return the Response body instead of the Response object.
    
        @default false
        */
    get resolveBodyOnly() {
      return this._internals.resolveBodyOnly;
    }
    set resolveBodyOnly(e) {
      R.boolean(e), this._internals.resolveBodyOnly = e;
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
      R.boolean(e), this._internals.isStream = e;
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
      R.object(e), this._merging ? Object.assign(this._internals.pagination, e) : this._internals.pagination = e;
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
      R.boolean(e), this._internals.setHost = e;
    }
    get maxHeaderSize() {
      return this._internals.maxHeaderSize;
    }
    set maxHeaderSize(e) {
      R.any([m.number, m.undefined], e), this._internals.maxHeaderSize = e;
    }
    get enableUnixSockets() {
      return this._internals.enableUnixSockets;
    }
    set enableUnixSockets(e) {
      R.boolean(e), this._internals.enableUnixSockets = e;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    toJSON() {
      return { ...this._internals };
    }
    [Symbol.for("nodejs.util.inspect.custom")](e, t) {
      return (0, Cc.inspect)(this._internals, t);
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
        checkServerIdentity: n.checkServerIdentity ?? tR.checkServerIdentity,
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
        timeout: t.http2 ? _R(t) : void 0,
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
            if (n0 < 15 || n0 === 15 && pR < 10) {
              let t = new Error("To use the `http2` option, install Node.js 15.10.0 or above");
              throw t.code = "EUNSUPPORTED", t;
            }
            return fR.default.auto;
          }
          return iR.default.request;
        }
        return rR.default.request;
      }
    }
    freeze() {
      let e = this._internals;
      Object.freeze(e), Object.freeze(e.hooks), Object.freeze(e.hooks.afterResponse), Object.freeze(e.hooks.beforeError), Object.freeze(e.hooks.
      beforeRedirect), Object.freeze(e.hooks.beforeRequest), Object.freeze(e.hooks.beforeRetry), Object.freeze(e.hooks.init), Object.freeze(
      e.https), Object.freeze(e.cacheOptions), Object.freeze(e.agent), Object.freeze(e.headers), Object.freeze(e.timeout), Object.freeze(e.retry),
      Object.freeze(e.retry.errorCodes), Object.freeze(e.retry.methods), Object.freeze(e.retry.statusCodes);
    }
  }, Lo = /* @__PURE__ */ s((e) => {
    let { statusCode: t } = e, r = e.request.options.followRedirect ? 299 : 399;
    return t >= 200 && t <= r || t === 304;
  }, "isResponseOk"), o0 = class extends Te {
    static {
      s(this, "ParseError");
    }
    constructor(e, t) {
      let { options: r } = t.request;
      super(`${e.message} in "${r.url.toString()}"`, e, t.request), this.name = "ParseError", this.code = "ERR_BODY_PARSE_FAILURE";
    }
  }, a0 = /* @__PURE__ */ s((e, t, r, i) => {
    let { rawBody: n } = e;
    try {
      if (t === "text")
        return n.toString(i);
      if (t === "json")
        return n.length === 0 ? "" : r(n.toString(i));
      if (t === "buffer")
        return n;
    } catch (o) {
      throw new o0(o, e);
    }
    throw new o0({
      message: `Unknown body type '${t}'`,
      name: "Error"
    }, e);
  }, "parseBody");
  function wR(e) {
    return e.writable && !e.writableEnded;
  }
  s(wR, "isClientRequest");
  var ER = wR;
  function u0(e) {
    return e.protocol === "unix:" || e.hostname === "unix";
  }
  s(u0, "isUnixSocketURL");
  var CR = m.string(T0.default.versions.brotli), xR = /* @__PURE__ */ new Set(["GET", "HEAD"]), Sc = new J3(), FR = /* @__PURE__ */ new Set(
  [300, 301, 302, 303, 304, 307, 308]), SR = [
    "socket",
    "connect",
    "continue",
    "information",
    "upgrade"
  ], jo = /* @__PURE__ */ s(() => {
  }, "noop2"), Oc = class extends l3.Duplex {
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
      _cannotHaveBody = !1, this._unproxyEvents = jo, this._triggerRead = !1, this._cancelTimeouts = jo, this._removeListeners = jo, this._jobs =
      [], this._flushed = !1, this._requestInitialized = !1, this._aborted = !1, this.redirectUrls = [], this.retryCount = 0, this._stopRetry =
      jo, this.on("pipe", (n) => {
        n.headers && Object.assign(this.options.headers, n.headers);
      }), this.on("newListener", (n) => {
        if (n === "retry" && this.listenerCount("retry") > 0)
          throw new Error("A retry listener has been attached already.");
      });
      try {
        if (this.options = new Nt(e, t, r), !this.options.url) {
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
        this._flushed ? this._beforeError(new Ub(n, this)) : this.flush = async () => {
          this.flush = async () => {
          }, this._beforeError(new Ub(n, this));
        };
      }), this.options.signal) {
        let n = /* @__PURE__ */ s(() => {
          this.destroy(new u3(this));
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
              computedValue: Q3({
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
              let c = new Oc(r.url, l, r);
              return c.retryCount = this.retryCount + 1, T0.default.nextTick(() => {
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
      return e instanceof bc.ServerResponse && this._pipedServerResponses.add(e), super.pipe(e, t);
    }
    unpipe(e) {
      return e instanceof bc.ServerResponse && this._pipedServerResponses.delete(e), super.unpipe(e), this;
    }
    async _finalizeBody() {
      let { options: e } = this, { headers: t } = e, r = !m.undefined(e.form), i = !m.undefined(e.json), n = !m.undefined(e.body), o = xR.has(
      e.method) && !(e.method === "GET" && e.allowGetBody);
      if (this._cannotHaveBody = o, r || i || n) {
        if (o)
          throw new TypeError(`The \`${e.method}\` method cannot be used with a body`);
        let a = !m.string(t["content-type"]);
        if (n) {
          if (kc(e.body)) {
            let l = new $3(e.body);
            a && (t["content-type"] = l.headers["Content-Type"]), "Content-Length" in l.headers && (t["content-length"] = l.headers["Content\
-Length"]), e.body = l.encode();
          }
          R0(e.body) && a && (t["content-type"] = `multipart/form-data; boundary=${e.body.getBoundary()}`);
        } else if (r) {
          a && (t["content-type"] = "application/x-www-form-urlencoded");
          let { form: l } = e;
          e.form = void 0, e.body = new Wb.URLSearchParams(l).toString();
        } else {
          a && (t["content-type"] = "application/json");
          let { json: l } = e;
          e.json = void 0, e.body = e.stringifyJson(l);
        }
        let u = await V3(e.body, e.headers);
        m.undefined(t["content-length"]) && m.undefined(t["transfer-encoding"]) && !o && !m.undefined(u) && (t["content-length"] = String(u));
      }
      e.responseType === "json" && !("accept" in e.headers) && (e.headers.accept = "application/json"), this._bodySize = Number(t["content-l\
ength"]) || void 0;
    }
    async _onResponseBase(e) {
      if (this.isAborted)
        return;
      let { options: t } = this, { url: r } = t;
      this._nativeResponse = e, t.decompress && (e = (0, B3.default)(e));
      let i = e.statusCode, n = e;
      n.statusMessage = n.statusMessage ? n.statusMessage : bc.default.STATUS_CODES[i], n.url = t.url.toString(), n.requestUrl = this.requestUrl,
      n.redirectUrls = this.redirectUrls, n.request = this, n.isFromCache = this._nativeResponse.fromCache ?? !1, n.ip = this.ip, n.retryCount =
      this.retryCount, n.ok = Lo(n), this._isFromCache = n.isFromCache, this._responseSize = Number(e.headers["content-length"]) || void 0, this.
      response = n, e.once("end", () => {
        this._responseSize = this._downloadedSize, this.emit("downloadProgress", this.downloadProgress);
      }), e.once("error", (a) => {
        this._aborted = !0, e.destroy(), this._beforeError(new $b(a, this));
      }), e.once("aborted", () => {
        this._aborted = !0, this._beforeError(new $b({
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
        if (t.followRedirect && e.headers.location && FR.has(i)) {
          if (e.resume(), this._cancelTimeouts(), this._unproxyEvents(), this.redirectUrls.length >= t.maxRedirects) {
            this._beforeError(new n3(this));
            return;
          }
          this._request = void 0;
          let a = new Nt(void 0, void 0, this.options), u = i === 303 && a.method !== "GET" && a.method !== "HEAD", l = i !== 307 && i !== 308,
          c = a.methodRewriting && l;
          (u || c) && (a.method = "GET", a.body = void 0, a.json = void 0, a.form = void 0, delete a.headers["content-length"]);
          try {
            let d = yc.Buffer.from(e.headers.location, "binary").toString(), p = new Wb.URL(d, r);
            if (!u0(r) && u0(p)) {
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
        if (t.isStream && t.throwHttpErrors && !Lo(n)) {
          this._beforeError(new qo(n));
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
        let t = await (0, P3.buffer)(e);
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
      p3(e), this.options.http2 && e.setTimeout(0), this._cancelTimeouts = K3(e, r, i);
      let n = t.cache ? "cacheableResponse" : "response";
      e.once(n, (o) => {
        this._onResponse(o);
      }), e.once("error", (o) => {
        this._aborted = !0, e.destroy(), o = o instanceof O0 ? new o3(o, this.timings, this) : new Te(o.message, o, this), this._beforeError(
        o);
      }), this._unproxyEvents = k0(e, this, SR), this._request = e, this.emit("uploadProgress", this.uploadProgress), this._sendBody(), this.
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
      if (!Sc.has(e)) {
        let t = new O3((r, i) => {
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
        Sc.set(e, t.request());
      }
    }
    async _createCacheableRequest(e, t) {
      return new Promise((r, i) => {
        Object.assign(t, Y3(e));
        let n, o = Sc.get(t.cache)(t, async (a) => {
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
      if (e.decompress && m.undefined(t["accept-encoding"]) && (t["accept-encoding"] = CR ? "gzip, deflate, br" : "gzip, deflate"), r || i) {
        let l = yc.Buffer.from(`${r}:${i}`).toString("base64");
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
        ER(l) ? this._onRequest(l) : this.writable ? (this.once("finish", () => {
          this._onResponse(l);
        }), this._sendBody()) : this._onResponse(l);
      } catch (l) {
        throw l instanceof Nn ? new s3(l, this) : l;
      }
    }
    async _error(e) {
      try {
        if (!(e instanceof qo && !this.options.throwHttpErrors))
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
          this._uploadedSize += yc.Buffer.byteLength(e, t);
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
  }, TR = class extends Te {
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
  }, AR = [
    "request",
    "response",
    "redirect",
    "uploadProgress",
    "downloadProgress"
  ];
  function l0(e) {
    let t, r, i, n = new t3.EventEmitter(), o = new Rc((u, l, c) => {
      c(() => {
        t.destroy();
      }), c.shouldReject = !1, c(() => {
        l(new TR(t));
      });
      let d = /* @__PURE__ */ s((p) => {
        var h;
        c(() => {
        });
        let f = e ?? new Oc(void 0, void 0, i);
        f.retryCount = p, f._noPipe = !0, t = f, f.once("response", async (_) => {
          let C = (_.headers["content-encoding"] ?? "").toLowerCase(), F = C === "gzip" || C === "deflate" || C === "br", { options: w } = f;
          if (F && !w.decompress)
            _.body = _.rawBody;
          else
            try {
              _.body = a0(_, w.responseType, w.parseJson, w.encoding);
            } catch (A) {
              if (_.body = _.rawBody.toString(), Lo(_)) {
                f._beforeError(A);
                return;
              }
            }
          try {
            let A = w.hooks.afterResponse;
            for (let [T, S] of A.entries())
              if (_ = await S(_, async (M) => {
                throw w.merge(M), w.prefixUrl = "", M.url && (w.url = M.url), w.hooks.afterResponse = w.hooks.afterResponse.slice(0, T), new a3(
                f);
              }), !(m.object(_) && m.number(_.statusCode) && !m.nullOrUndefined(_.body)))
                throw new TypeError("The `afterResponse` hook returned an invalid value");
          } catch (A) {
            f._beforeError(A);
            return;
          }
          if (r = _, !Lo(_)) {
            f._beforeError(new qo(_));
            return;
          }
          f.destroy(), u(f.options.resolveBodyOnly ? _.body : _);
        });
        let g = /* @__PURE__ */ s((_) => {
          if (o.isCanceled)
            return;
          let { options: C } = f;
          if (_ instanceof qo && !C.throwHttpErrors) {
            let { response: F } = _;
            f.destroy(), u(f.options.resolveBodyOnly ? F.body : F);
            return;
          }
          l(_);
        }, "onError");
        f.once("error", g);
        let E = (h = f.options) == null ? void 0 : h.body;
        f.once("retry", (_, C) => {
          e = void 0;
          let F = f.options.body;
          if (E === F && m.nodeStream(F)) {
            C.message = "Cannot retry with consumed body stream", g(C);
            return;
          }
          i = f.options, d(_);
        }), k0(f, n, AR), m.undefined(e) && f.flush();
      }, "makeRequest");
      d(0);
    });
    o.on = (u, l) => (n.on(u, l), o), o.off = (u, l) => (n.off(u, l), o);
    let a = /* @__PURE__ */ s((u) => {
      let l = (async () => {
        await o;
        let { options: c } = r.request;
        return a0(r, u, c.parseJson, c.encoding);
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
  s(l0, "asPromise");
  var RR = /* @__PURE__ */ s(async (e) => new Promise((t) => {
    setTimeout(t, e);
  }), "delay"), kR = /* @__PURE__ */ s((e) => m.function_(e), "isGotInstance"), OR = [
    "get",
    "post",
    "put",
    "patch",
    "head",
    "delete"
  ], B0 = /* @__PURE__ */ s((e) => {
    e = {
      options: new Nt(void 0, void 0, e.options),
      handlers: [...e.handlers],
      mutableDefaults: e.mutableDefaults
    }, Object.defineProperty(e, "mutableDefaults", {
      enumerable: !0,
      configurable: !1,
      writable: !1
    });
    let t = /* @__PURE__ */ s((i, n, o = e.options) => {
      let a = new Oc(i, n, o), u, l = /* @__PURE__ */ s((p) => (a.options = p, a._noPipe = !p.isStream, a.flush(), p.isStream ? a : (u || (u =
      l0(a)), u)), "lastHandler"), c = 0, d = /* @__PURE__ */ s((p) => {
        let f = (e.handlers[c++] ?? l)(p, d);
        if (m.promise(f) && !a.options.isStream && (u || (u = l0(a)), f !== u)) {
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
      let n = new Nt(void 0, void 0, e.options), o = [...e.handlers], a;
      for (let u of i)
        kR(u) ? (n.merge(u.defaults.options), o.push(...u.defaults.handlers), a = u.defaults.mutableDefaults) : (n.merge(u), u.handlers && o.
        push(...u.handlers), a = u.mutableDefaults);
      return B0({
        options: n,
        handlers: o,
        mutableDefaults: !!a
      });
    };
    let r = /* @__PURE__ */ s(async function* (i, n) {
      let o = new Nt(i, n, e.options);
      o.resolveBodyOnly = !1;
      let { pagination: a } = o;
      R.function_(a.transform), R.function_(a.shouldContinue), R.function_(a.filter), R.function_(a.paginate), R.number(a.countLimit), R.number(
      a.requestLimit), R.number(a.backoff);
      let u = [], { countLimit: l } = a, c = 0;
      for (; c < a.requestLimit; ) {
        c !== 0 && await RR(a.backoff);
        let d = await t(void 0, void 0, o), p = await a.transform(d), h = [];
        R.array(p);
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
        f === d.request.options ? o = d.request.options : (o.merge(f), R.any([m.urlInstance, m.undefined], f.url), f.url !== void 0 && (o.prefixUrl =
        "", o.url = f.url)), c++;
      }
    }, "paginateEach");
    t.paginate = r, t.paginate.all = async (i, n) => {
      let o = [];
      for await (let a of r(i, n))
        o.push(a);
      return o;
    }, t.paginate.each = r, t.stream = (i, n) => t(i, { ...n, isStream: !0 });
    for (let i of OR)
      t[i] = (n, o) => t(n, { ...o, method: i }), t.stream[i] = (n, o) => t(n, { ...o, method: i, isStream: !0 });
    return e.mutableDefaults || (Object.freeze(e.handlers), e.options.freeze()), Object.defineProperty(t, "defaults", {
      value: e,
      writable: !1,
      configurable: !1,
      enumerable: !0
    }), t;
  }, "create"), BR = B0, PR = {
    options: new Nt(),
    handlers: [],
    mutableDefaults: !1
  }, IR = BR(PR), MR = IR, jR = Fe(Au()), qR = zm(), LR = Fe(Nb()), c0 = {
    keepAlive: !0,
    maxSockets: 20
  }, NR = {
    http: new U1.Agent(c0),
    https: new $1.Agent(c0)
  };
  async function UR({ url: e, gotOpts: t, extractOpts: r, dir: i }) {
    return new Promise((n, o) => {
      let a = /* @__PURE__ */ s((u) => {
        u ? o(u) : n();
      }, "callback");
      (0, jR.default)(
        MR.stream(e, Object.assign({ agent: NR }, t)),
        (0, LR.default)(),
        (0, qR.extract)(i, r),
        a
      );
    });
  }
  s(UR, "download");
});

// ../node_modules/get-npm-tarball-url/lib/index.js
var q0 = b((Eq, j0) => {
  var Bc = Object.defineProperty, $R = Object.getOwnPropertyDescriptor, WR = Object.getOwnPropertyNames, HR = Object.prototype.hasOwnProperty,
  VR = /* @__PURE__ */ s((e, t) => {
    for (var r in t)
      Bc(e, r, { get: t[r], enumerable: !0 });
  }, "__export"), ZR = /* @__PURE__ */ s((e, t, r, i) => {
    if (t && typeof t == "object" || typeof t == "function")
      for (let n of WR(t))
        !HR.call(e, n) && n !== r && Bc(e, n, { get: /* @__PURE__ */ s(() => t[n], "get"), enumerable: !(i = $R(t, n)) || i.enumerable });
    return e;
  }, "__copyProps"), zR = /* @__PURE__ */ s((e) => ZR(Bc({}, "__esModule", { value: !0 }), e), "__toCommonJS"), M0 = {};
  VR(M0, {
    default: /* @__PURE__ */ s(() => GR, "default")
  });
  j0.exports = zR(M0);
  function GR(e, t, r) {
    let i;
    r?.registry ? i = r.registry.endsWith("/") ? r.registry : `${r.registry}/` : i = "https://registry.npmjs.org/";
    let n = YR(e);
    return `${i}${e}/-/${n}-${KR(t)}.tgz`;
  }
  s(GR, "src_default");
  function KR(e) {
    let t = e.indexOf("+");
    return t === -1 ? e : e.substring(0, t);
  }
  s(KR, "removeBuildMetadataFromVersion");
  function YR(e) {
    return e[0] !== "@" ? e : e.split("/")[1];
  }
  s(YR, "getScopelessName");
});

// ../node_modules/eastasianwidth/eastasianwidth.js
var Nc = b((FL, Lc) => {
  var ir = {};
  typeof Lc > "u" ? window.eastasianwidth = ir : Lc.exports = ir;
  ir.eastAsianWidth = function(e) {
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
  ir.characterLength = function(e) {
    var t = this.eastAsianWidth(e);
    return t == "F" || t == "W" || t == "A" ? 2 : 1;
  };
  function X0(e) {
    return e.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
  }
  s(X0, "stringToArray");
  ir.length = function(e) {
    for (var t = X0(e), r = 0, i = 0; i < t.length; i++)
      r = r + this.characterLength(t[i]);
    return r;
  };
  ir.slice = function(e, t, r) {
    textLen = ir.length(e), t = t || 0, r = r || 1, t < 0 && (t = textLen + t), r < 0 && (r = textLen + r);
    for (var i = "", n = 0, o = X0(e), a = 0; a < o.length; a++) {
      var u = o[a], l = ir.length(u);
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
var Uc = b((TL, Q0) => {
  "use strict";
  Q0.exports = function() {
    return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|(?:\uD83E\uDDD1\uD83C\uDFFF\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFC-\uDFFF])|\uD83D\uDC68(?:\uD83C\uDFFB(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|[\u2695\u2696\u2708]\uFE0F|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))?|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFF]))|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])\uFE0F|\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC)?|(?:\uD83D\uDC69(?:\uD83C\uDFFB\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|(?:\uD83C[\uDFFC-\uDFFF])\u200D\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC69(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83E\uDDD1(?:\u200D(?:\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|\uD83D\uDE36\u200D\uD83C\uDF2B|\uD83C\uDFF3\uFE0F\u200D\u26A7|\uD83D\uDC3B\u200D\u2744|(?:(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\uD83C\uDFF4\u200D\u2620|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])\u200D[\u2640\u2642]|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600-\u2604\u260E\u2611\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F0\u26F1\u26F4\u26F7\u26F8\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u3030\u303D\u3297\u3299]|\uD83C[\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]|\uD83D[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3])\uFE0F|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDE35\u200D\uD83D\uDCAB|\uD83D\uDE2E\u200D\uD83D\uDCA8|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83E\uDDD1(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83D\uDC69(?:\uD83C\uDFFF|\uD83C\uDFFE|\uD83C\uDFFD|\uD83C\uDFFC|\uD83C\uDFFB)?|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC08\u200D\u2B1B|\u2764\uFE0F\u200D(?:\uD83D\uDD25|\uD83E\uDE79)|\uD83D\uDC41\uFE0F|\uD83C\uDFF3\uFE0F|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|[#\*0-9]\uFE0F\u20E3|\u2764\uFE0F|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF4|(?:[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270C\u270D]|\uD83D[\uDD74\uDD90])(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])|[\u270A\u270B]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC08\uDC15\uDC3B\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE2E\uDE35\uDE36\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5]|\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD4\uDDD6-\uDDDD]|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF]|[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0D\uDD0E\uDD10-\uDD17\uDD1D\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78\uDD7A-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCB\uDDD0\uDDE0-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6]|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5-\uDED7\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0C\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDD77\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
  };
});

// ../node_modules/cli-boxes/boxes.json
var hv = b((XL, Zk) => {
  Zk.exports = {
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
var zc = b((QL, Zc) => {
  "use strict";
  var pv = hv();
  Zc.exports = pv;
  Zc.exports.default = pv;
});

// ../node_modules/string-width/node_modules/ansi-regex/index.js
var vv = b((r4, bv) => {
  "use strict";
  bv.exports = ({ onlyFirst: e = !1 } = {}) => {
    let t = [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
    ].join("|");
    return new RegExp(t, e ? void 0 : "g");
  };
});

// ../node_modules/string-width/node_modules/strip-ansi/index.js
var wv = b((i4, _v) => {
  "use strict";
  var Qk = vv();
  _v.exports = (e) => typeof e == "string" ? e.replace(Qk(), "") : e;
});

// ../node_modules/is-fullwidth-code-point/index.js
var Cv = b((n4, Yc) => {
  "use strict";
  var Ev = /* @__PURE__ */ s((e) => Number.isNaN(e) ? !1 : e >= 4352 && (e <= 4447 || // Hangul Jamo
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
  Yc.exports = Ev;
  Yc.exports.default = Ev;
});

// ../node_modules/string-width/node_modules/emoji-regex/index.js
var Fv = b((o4, xv) => {
  "use strict";
  xv.exports = function() {
    return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
  };
});

// ../node_modules/string-width/index.js
var Tv = b((a4, Jc) => {
  "use strict";
  var eO = wv(), tO = Cv(), rO = Fv(), Sv = /* @__PURE__ */ s((e) => {
    if (typeof e != "string" || e.length === 0 || (e = eO(e), e.length === 0))
      return 0;
    e = e.replace(rO(), "  ");
    let t = 0;
    for (let r = 0; r < e.length; r++) {
      let i = e.codePointAt(r);
      i <= 31 || i >= 127 && i <= 159 || i >= 768 && i <= 879 || (i > 65535 && r++, t += tO(i) ? 2 : 1);
    }
    return t;
  }, "stringWidth");
  Jc.exports = Sv;
  Jc.exports.default = Sv;
});

// ../node_modules/ansi-align/index.js
var Rv = b((l4, Av) => {
  "use strict";
  var iO = Tv();
  function Tr(e, t) {
    if (!e) return e;
    t = t || {};
    let r = t.align || "center";
    if (r === "left") return e;
    let i = t.split || `
`, n = t.pad || " ", o = r !== "right" ? nO : sO, a = !1;
    Array.isArray(e) || (a = !0, e = String(e).split(i));
    let u, l = 0;
    return e = e.map(function(c) {
      return c = String(c), u = iO(c), l = Math.max(u, l), {
        str: c,
        width: u
      };
    }).map(function(c) {
      return new Array(o(l, c.width) + 1).join(n) + c.str;
    }), a ? e.join(i) : e;
  }
  s(Tr, "ansiAlign");
  Tr.left = /* @__PURE__ */ s(function(t) {
    return Tr(t, { align: "left" });
  }, "left");
  Tr.center = /* @__PURE__ */ s(function(t) {
    return Tr(t, { align: "center" });
  }, "center");
  Tr.right = /* @__PURE__ */ s(function(t) {
    return Tr(t, { align: "right" });
  }, "right");
  Av.exports = Tr;
  function nO(e, t) {
    return Math.floor((e - t) / 2);
  }
  s(nO, "halfDiff");
  function sO(e, t) {
    return e - t;
  }
  s(sO, "fullDiff");
});

// ../node_modules/ts-dedent/dist/index.js
var Ko = b((Zn) => {
  "use strict";
  Object.defineProperty(Zn, "__esModule", { value: !0 });
  Zn.dedent = void 0;
  function Zv(e) {
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
  s(Zv, "dedent");
  Zn.dedent = Zv;
  Zn.default = Zv;
});

// ../node_modules/zod/lib/helpers/util.js
var Gn = b((ue) => {
  "use strict";
  Object.defineProperty(ue, "__esModule", { value: !0 });
  ue.getParsedType = ue.ZodParsedType = ue.objectUtil = ue.util = void 0;
  var ud;
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
  })(ud || (ue.util = ud = {}));
  var r_;
  (function(e) {
    e.mergeShapes = (t, r) => ({
      ...t,
      ...r
      // second overwrites first
    });
  })(r_ || (ue.objectUtil = r_ = {}));
  ue.ZodParsedType = ud.arrayToEnum([
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
  var UO = /* @__PURE__ */ s((e) => {
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
  ue.getParsedType = UO;
});

// ../node_modules/zod/lib/ZodError.js
var Jo = b((sr) => {
  "use strict";
  Object.defineProperty(sr, "__esModule", { value: !0 });
  sr.ZodError = sr.quotelessJson = sr.ZodIssueCode = void 0;
  var i_ = Gn();
  sr.ZodIssueCode = i_.util.arrayToEnum([
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
  var $O = /* @__PURE__ */ s((e) => JSON.stringify(e, null, 2).replace(/"([^"]+)":/g, "$1:"), "quotelessJson");
  sr.quotelessJson = $O;
  var Kn = class e extends Error {
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
      return JSON.stringify(this.issues, i_.util.jsonStringifyReplacer, 2);
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
  sr.ZodError = Kn;
  Kn.create = (e) => new Kn(e);
});

// ../node_modules/zod/lib/locales/en.js
var cd = b((ld) => {
  "use strict";
  Object.defineProperty(ld, "__esModule", { value: !0 });
  var Rr = Gn(), qe = Jo(), WO = /* @__PURE__ */ s((e, t) => {
    let r;
    switch (e.code) {
      case qe.ZodIssueCode.invalid_type:
        e.received === Rr.ZodParsedType.undefined ? r = "Required" : r = `Expected ${e.expected}, received ${e.received}`;
        break;
      case qe.ZodIssueCode.invalid_literal:
        r = `Invalid literal value, expected ${JSON.stringify(e.expected, Rr.util.jsonStringifyReplacer)}`;
        break;
      case qe.ZodIssueCode.unrecognized_keys:
        r = `Unrecognized key(s) in object: ${Rr.util.joinValues(e.keys, ", ")}`;
        break;
      case qe.ZodIssueCode.invalid_union:
        r = "Invalid input";
        break;
      case qe.ZodIssueCode.invalid_union_discriminator:
        r = `Invalid discriminator value. Expected ${Rr.util.joinValues(e.options)}`;
        break;
      case qe.ZodIssueCode.invalid_enum_value:
        r = `Invalid enum value. Expected ${Rr.util.joinValues(e.options)}, received '${e.received}'`;
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
: must end with "${e.validation.endsWith}"` : Rr.util.assertNever(e.validation) : e.validation !== "regex" ? r = `Invalid ${e.validation}` :
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
        r = t.defaultError, Rr.util.assertNever(e);
    }
    return { message: r };
  }, "errorMap");
  ld.default = WO;
});

// ../node_modules/zod/lib/errors.js
var Xo = b((yt) => {
  "use strict";
  var HO = yt && yt.__importDefault || function(e) {
    return e && e.__esModule ? e : { default: e };
  };
  Object.defineProperty(yt, "__esModule", { value: !0 });
  yt.getErrorMap = yt.setErrorMap = yt.defaultErrorMap = void 0;
  var n_ = HO(cd());
  yt.defaultErrorMap = n_.default;
  var s_ = n_.default;
  function VO(e) {
    s_ = e;
  }
  s(VO, "setErrorMap");
  yt.setErrorMap = VO;
  function ZO() {
    return s_;
  }
  s(ZO, "getErrorMap");
  yt.getErrorMap = ZO;
});

// ../node_modules/zod/lib/helpers/parseUtil.js
var fd = b((re) => {
  "use strict";
  var zO = re && re.__importDefault || function(e) {
    return e && e.__esModule ? e : { default: e };
  };
  Object.defineProperty(re, "__esModule", { value: !0 });
  re.isAsync = re.isValid = re.isDirty = re.isAborted = re.OK = re.DIRTY = re.INVALID = re.ParseStatus = re.addIssueToContext = re.EMPTY_PATH =
  re.makeIssue = void 0;
  var GO = Xo(), o_ = zO(cd()), KO = /* @__PURE__ */ s((e) => {
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
  re.makeIssue = KO;
  re.EMPTY_PATH = [];
  function YO(e, t) {
    let r = (0, GO.getErrorMap)(), i = (0, re.makeIssue)({
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
        r === o_.default ? void 0 : o_.default
        // then global default map
      ].filter((n) => !!n)
    });
    e.common.issues.push(i);
  }
  s(YO, "addIssueToContext");
  re.addIssueToContext = YO;
  var dd = class e {
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
          return re.INVALID;
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
          return re.INVALID;
        o.status === "dirty" && t.dirty(), a.status === "dirty" && t.dirty(), o.value !== "__proto__" && (typeof a.value < "u" || n.alwaysSet) &&
        (i[o.value] = a.value);
      }
      return { status: t.value, value: i };
    }
  };
  re.ParseStatus = dd;
  re.INVALID = Object.freeze({
    status: "aborted"
  });
  var JO = /* @__PURE__ */ s((e) => ({ status: "dirty", value: e }), "DIRTY");
  re.DIRTY = JO;
  var XO = /* @__PURE__ */ s((e) => ({ status: "valid", value: e }), "OK");
  re.OK = XO;
  var QO = /* @__PURE__ */ s((e) => e.status === "aborted", "isAborted");
  re.isAborted = QO;
  var eB = /* @__PURE__ */ s((e) => e.status === "dirty", "isDirty");
  re.isDirty = eB;
  var tB = /* @__PURE__ */ s((e) => e.status === "valid", "isValid");
  re.isValid = tB;
  var rB = /* @__PURE__ */ s((e) => typeof Promise < "u" && e instanceof Promise, "isAsync");
  re.isAsync = rB;
});

// ../node_modules/zod/lib/helpers/typeAliases.js
var u_ = b((a_) => {
  "use strict";
  Object.defineProperty(a_, "__esModule", { value: !0 });
});

// ../node_modules/zod/lib/helpers/errorUtil.js
var c_ = b((Qo) => {
  "use strict";
  Object.defineProperty(Qo, "__esModule", { value: !0 });
  Qo.errorUtil = void 0;
  var l_;
  (function(e) {
    e.errToObj = (t) => typeof t == "string" ? { message: t } : t || {}, e.toString = (t) => typeof t == "string" ? t : t?.message;
  })(l_ || (Qo.errorUtil = l_ = {}));
});

// ../node_modules/zod/lib/types.js
var w_ = b((y) => {
  "use strict";
  var ta = y && y.__classPrivateFieldGet || function(e, t, r, i) {
    if (r === "a" && !i) throw new TypeError("Private accessor was defined without a getter");
    if (typeof t == "function" ? e !== t || !i : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did n\
ot declare it");
    return r === "m" ? i : r === "a" ? i.call(e) : i ? i.value : t.get(e);
  }, f_ = y && y.__classPrivateFieldSet || function(e, t, r, i, n) {
    if (i === "m") throw new TypeError("Private method is not writable");
    if (i === "a" && !n) throw new TypeError("Private accessor was defined without a setter");
    if (typeof t == "function" ? e !== t || !n : !t.has(e)) throw new TypeError("Cannot write private member to an object whose class did no\
t declare it");
    return i === "a" ? n.call(e, r) : n ? n.value = r : t.set(e, r), r;
  }, Yn, Jn;
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
  var ea = Xo(), N = c_(), v = fd(), B = Gn(), k = Jo(), Qe = class {
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
  }, d_ = /* @__PURE__ */ s((e, t) => {
    if ((0, v.isValid)(t))
      return { success: !0, data: t.value };
    if (!e.common.issues.length)
      throw new Error("Validation failed but no issues detected.");
    return {
      success: !1,
      get error() {
        if (this._error)
          return this._error;
        let r = new k.ZodError(e.common.issues);
        return this._error = r, this._error;
      }
    };
  }, "handleResult");
  function W(e) {
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
  s(W, "processCreateParams");
  var H = class {
    static {
      s(this, "ZodType");
    }
    get description() {
      return this._def.description;
    }
    _getType(t) {
      return (0, B.getParsedType)(t.data);
    }
    _getOrReturnCtx(t, r) {
      return r || {
        common: t.parent.common,
        data: t.data,
        parsedType: (0, B.getParsedType)(t.data),
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
          parsedType: (0, B.getParsedType)(t.data),
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
        parsedType: (0, B.getParsedType)(t)
      }, o = this._parseSync({ data: t, path: n.path, parent: n });
      return d_(n, o);
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
        parsedType: (0, B.getParsedType)(t)
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
        parsedType: (0, B.getParsedType)(t)
      }, n = this._parse({ data: t, path: i.path, parent: i }), o = await ((0, v.isAsync)(n) ? n : Promise.resolve(n));
      return d_(i, o);
    }
    refine(t, r) {
      let i = /* @__PURE__ */ s((n) => typeof r == "string" || typeof r > "u" ? { message: r } : typeof r == "function" ? r(n) : r, "getIssu\
eProperties");
      return this._refinement((n, o) => {
        let a = t(n), u = /* @__PURE__ */ s(() => o.addIssue({
          code: k.ZodIssueCode.custom,
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
        typeName: U.ZodEffects,
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
      return vt.create(this, this._def);
    }
    nullish() {
      return this.nullable().optional();
    }
    array() {
      return Ht.create(this);
    }
    promise() {
      return ur.create(this, this._def);
    }
    or(t) {
      return jr.create([this, t], this._def);
    }
    and(t) {
      return qr.create(this, t, this._def);
    }
    transform(t) {
      return new Ze({
        ...W(this._def),
        schema: this,
        typeName: U.ZodEffects,
        effect: { type: "transform", transform: t }
      });
    }
    default(t) {
      let r = typeof t == "function" ? t : () => t;
      return new Wr({
        ...W(this._def),
        innerType: this,
        defaultValue: r,
        typeName: U.ZodDefault
      });
    }
    brand() {
      return new Xn({
        typeName: U.ZodBranded,
        type: this,
        ...W(this._def)
      });
    }
    catch(t) {
      let r = typeof t == "function" ? t : () => t;
      return new Hr({
        ...W(this._def),
        innerType: this,
        catchValue: r,
        typeName: U.ZodCatch
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
      return Qn.create(this, t);
    }
    readonly() {
      return Vr.create(this);
    }
    isOptional() {
      return this.safeParse(void 0).success;
    }
    isNullable() {
      return this.safeParse(null).success;
    }
  };
  y.ZodType = H;
  y.Schema = H;
  y.ZodSchema = H;
  var iB = /^c[^\s-]{8,}$/i, nB = /^[0-9a-z]+$/, sB = /^[0-9A-HJKMNP-TV-Z]{26}$/i, oB = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
  aB = /^[a-z0-9_-]{21}$/i, uB = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, lB = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,
  cB = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, dB = "^(\\p{Extended_Pictographic}|\\p{Emoji_Comp\
onent})+$", hd, fB = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, hB = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  pB = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
  DB = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  mB = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, gB = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  h_ = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469\
]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", yB = new RegExp(`^${h_}$`);
  function p_(e) {
    let t = "([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d";
    return e.precision ? t = `${t}\\.\\d{${e.precision}}` : e.precision == null && (t = `${t}(\\.\\d+)?`), t;
  }
  s(p_, "timeRegexSource");
  function bB(e) {
    return new RegExp(`^${p_(e)}$`);
  }
  s(bB, "timeRegex");
  function D_(e) {
    let t = `${h_}T${p_(e)}`, r = [];
    return r.push(e.local ? "Z?" : "Z"), e.offset && r.push("([+-]\\d{2}:?\\d{2})"), t = `${t}(${r.join("|")})`, new RegExp(`^${t}$`);
  }
  s(D_, "datetimeRegex");
  y.datetimeRegex = D_;
  function vB(e, t) {
    return !!((t === "v4" || !t) && fB.test(e) || (t === "v6" || !t) && pB.test(e));
  }
  s(vB, "isValidIP");
  function _B(e, t) {
    if (!uB.test(e))
      return !1;
    try {
      let [r] = e.split("."), i = r.replace(/-/g, "+").replace(/_/g, "/").padEnd(r.length + (4 - r.length % 4) % 4, "="), n = JSON.parse(atob(
      i));
      return !(typeof n != "object" || n === null || !n.typ || !n.alg || t && n.alg !== t);
    } catch {
      return !1;
    }
  }
  s(_B, "isValidJWT");
  function wB(e, t) {
    return !!((t === "v4" || !t) && hB.test(e) || (t === "v6" || !t) && DB.test(e));
  }
  s(wB, "isValidCidr");
  var or = class e extends H {
    static {
      s(this, "ZodString");
    }
    _parse(t) {
      if (this._def.coerce && (t.data = String(t.data)), this._getType(t) !== B.ZodParsedType.string) {
        let o = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(o, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.string,
          received: o.parsedType
        }), v.INVALID;
      }
      let i = new v.ParseStatus(), n;
      for (let o of this._def.checks)
        if (o.kind === "min")
          t.data.length < o.value && (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            code: k.ZodIssueCode.too_small,
            minimum: o.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: o.message
          }), i.dirty());
        else if (o.kind === "max")
          t.data.length > o.value && (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            code: k.ZodIssueCode.too_big,
            maximum: o.value,
            type: "string",
            inclusive: !0,
            exact: !1,
            message: o.message
          }), i.dirty());
        else if (o.kind === "length") {
          let a = t.data.length > o.value, u = t.data.length < o.value;
          (a || u) && (n = this._getOrReturnCtx(t, n), a ? (0, v.addIssueToContext)(n, {
            code: k.ZodIssueCode.too_big,
            maximum: o.value,
            type: "string",
            inclusive: !0,
            exact: !0,
            message: o.message
          }) : u && (0, v.addIssueToContext)(n, {
            code: k.ZodIssueCode.too_small,
            minimum: o.value,
            type: "string",
            inclusive: !0,
            exact: !0,
            message: o.message
          }), i.dirty());
        } else if (o.kind === "email")
          cB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            validation: "email",
            code: k.ZodIssueCode.invalid_string,
            message: o.message
          }), i.dirty());
        else if (o.kind === "emoji")
          hd || (hd = new RegExp(dB, "u")), hd.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            validation: "emoji",
            code: k.ZodIssueCode.invalid_string,
            message: o.message
          }), i.dirty());
        else if (o.kind === "uuid")
          oB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            validation: "uuid",
            code: k.ZodIssueCode.invalid_string,
            message: o.message
          }), i.dirty());
        else if (o.kind === "nanoid")
          aB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            validation: "nanoid",
            code: k.ZodIssueCode.invalid_string,
            message: o.message
          }), i.dirty());
        else if (o.kind === "cuid")
          iB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            validation: "cuid",
            code: k.ZodIssueCode.invalid_string,
            message: o.message
          }), i.dirty());
        else if (o.kind === "cuid2")
          nB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            validation: "cuid2",
            code: k.ZodIssueCode.invalid_string,
            message: o.message
          }), i.dirty());
        else if (o.kind === "ulid")
          sB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
            validation: "ulid",
            code: k.ZodIssueCode.invalid_string,
            message: o.message
          }), i.dirty());
        else if (o.kind === "url")
          try {
            new URL(t.data);
          } catch {
            n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
              validation: "url",
              code: k.ZodIssueCode.invalid_string,
              message: o.message
            }), i.dirty();
          }
        else o.kind === "regex" ? (o.regex.lastIndex = 0, o.regex.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(
        n, {
          validation: "regex",
          code: k.ZodIssueCode.invalid_string,
          message: o.message
        }), i.dirty())) : o.kind === "trim" ? t.data = t.data.trim() : o.kind === "includes" ? t.data.includes(o.value, o.position) || (n = this.
        _getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: k.ZodIssueCode.invalid_string,
          validation: { includes: o.value, position: o.position },
          message: o.message
        }), i.dirty()) : o.kind === "toLowerCase" ? t.data = t.data.toLowerCase() : o.kind === "toUpperCase" ? t.data = t.data.toUpperCase() :
        o.kind === "startsWith" ? t.data.startsWith(o.value) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: k.ZodIssueCode.invalid_string,
          validation: { startsWith: o.value },
          message: o.message
        }), i.dirty()) : o.kind === "endsWith" ? t.data.endsWith(o.value) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: k.ZodIssueCode.invalid_string,
          validation: { endsWith: o.value },
          message: o.message
        }), i.dirty()) : o.kind === "datetime" ? D_(o).test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: k.ZodIssueCode.invalid_string,
          validation: "datetime",
          message: o.message
        }), i.dirty()) : o.kind === "date" ? yB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: k.ZodIssueCode.invalid_string,
          validation: "date",
          message: o.message
        }), i.dirty()) : o.kind === "time" ? bB(o).test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: k.ZodIssueCode.invalid_string,
          validation: "time",
          message: o.message
        }), i.dirty()) : o.kind === "duration" ? lB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          validation: "duration",
          code: k.ZodIssueCode.invalid_string,
          message: o.message
        }), i.dirty()) : o.kind === "ip" ? vB(t.data, o.version) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          validation: "ip",
          code: k.ZodIssueCode.invalid_string,
          message: o.message
        }), i.dirty()) : o.kind === "jwt" ? _B(t.data, o.alg) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          validation: "jwt",
          code: k.ZodIssueCode.invalid_string,
          message: o.message
        }), i.dirty()) : o.kind === "cidr" ? wB(t.data, o.version) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          validation: "cidr",
          code: k.ZodIssueCode.invalid_string,
          message: o.message
        }), i.dirty()) : o.kind === "base64" ? mB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          validation: "base64",
          code: k.ZodIssueCode.invalid_string,
          message: o.message
        }), i.dirty()) : o.kind === "base64url" ? gB.test(t.data) || (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          validation: "base64url",
          code: k.ZodIssueCode.invalid_string,
          message: o.message
        }), i.dirty()) : B.util.assertNever(o);
      return { status: i.value, value: t.data };
    }
    _regex(t, r, i) {
      return this.refinement((n) => t.test(n), {
        validation: r,
        code: k.ZodIssueCode.invalid_string,
        ...N.errorUtil.errToObj(i)
      });
    }
    _addCheck(t) {
      return new e({
        ...this._def,
        checks: [...this._def.checks, t]
      });
    }
    email(t) {
      return this._addCheck({ kind: "email", ...N.errorUtil.errToObj(t) });
    }
    url(t) {
      return this._addCheck({ kind: "url", ...N.errorUtil.errToObj(t) });
    }
    emoji(t) {
      return this._addCheck({ kind: "emoji", ...N.errorUtil.errToObj(t) });
    }
    uuid(t) {
      return this._addCheck({ kind: "uuid", ...N.errorUtil.errToObj(t) });
    }
    nanoid(t) {
      return this._addCheck({ kind: "nanoid", ...N.errorUtil.errToObj(t) });
    }
    cuid(t) {
      return this._addCheck({ kind: "cuid", ...N.errorUtil.errToObj(t) });
    }
    cuid2(t) {
      return this._addCheck({ kind: "cuid2", ...N.errorUtil.errToObj(t) });
    }
    ulid(t) {
      return this._addCheck({ kind: "ulid", ...N.errorUtil.errToObj(t) });
    }
    base64(t) {
      return this._addCheck({ kind: "base64", ...N.errorUtil.errToObj(t) });
    }
    base64url(t) {
      return this._addCheck({
        kind: "base64url",
        ...N.errorUtil.errToObj(t)
      });
    }
    jwt(t) {
      return this._addCheck({ kind: "jwt", ...N.errorUtil.errToObj(t) });
    }
    ip(t) {
      return this._addCheck({ kind: "ip", ...N.errorUtil.errToObj(t) });
    }
    cidr(t) {
      return this._addCheck({ kind: "cidr", ...N.errorUtil.errToObj(t) });
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
        ...N.errorUtil.errToObj(t?.message)
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
        ...N.errorUtil.errToObj(t?.message)
      });
    }
    duration(t) {
      return this._addCheck({ kind: "duration", ...N.errorUtil.errToObj(t) });
    }
    regex(t, r) {
      return this._addCheck({
        kind: "regex",
        regex: t,
        ...N.errorUtil.errToObj(r)
      });
    }
    includes(t, r) {
      return this._addCheck({
        kind: "includes",
        value: t,
        position: r?.position,
        ...N.errorUtil.errToObj(r?.message)
      });
    }
    startsWith(t, r) {
      return this._addCheck({
        kind: "startsWith",
        value: t,
        ...N.errorUtil.errToObj(r)
      });
    }
    endsWith(t, r) {
      return this._addCheck({
        kind: "endsWith",
        value: t,
        ...N.errorUtil.errToObj(r)
      });
    }
    min(t, r) {
      return this._addCheck({
        kind: "min",
        value: t,
        ...N.errorUtil.errToObj(r)
      });
    }
    max(t, r) {
      return this._addCheck({
        kind: "max",
        value: t,
        ...N.errorUtil.errToObj(r)
      });
    }
    length(t, r) {
      return this._addCheck({
        kind: "length",
        value: t,
        ...N.errorUtil.errToObj(r)
      });
    }
    /**
     * Equivalent to `.min(1)`
     */
    nonempty(t) {
      return this.min(1, N.errorUtil.errToObj(t));
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
  y.ZodString = or;
  or.create = (e) => {
    var t;
    return new or({
      checks: [],
      typeName: U.ZodString,
      coerce: (t = e?.coerce) !== null && t !== void 0 ? t : !1,
      ...W(e)
    });
  };
  function EB(e, t) {
    let r = (e.toString().split(".")[1] || "").length, i = (t.toString().split(".")[1] || "").length, n = r > i ? r : i, o = parseInt(e.toFixed(
    n).replace(".", "")), a = parseInt(t.toFixed(n).replace(".", ""));
    return o % a / Math.pow(10, n);
  }
  s(EB, "floatSafeRemainder");
  var kr = class e extends H {
    static {
      s(this, "ZodNumber");
    }
    constructor() {
      super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
    }
    _parse(t) {
      if (this._def.coerce && (t.data = Number(t.data)), this._getType(t) !== B.ZodParsedType.number) {
        let o = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(o, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.number,
          received: o.parsedType
        }), v.INVALID;
      }
      let i, n = new v.ParseStatus();
      for (let o of this._def.checks)
        o.kind === "int" ? B.util.isInteger(t.data) || (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(i, {
          code: k.ZodIssueCode.invalid_type,
          expected: "integer",
          received: "float",
          message: o.message
        }), n.dirty()) : o.kind === "min" ? (o.inclusive ? t.data < o.value : t.data <= o.value) && (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(
        i, {
          code: k.ZodIssueCode.too_small,
          minimum: o.value,
          type: "number",
          inclusive: o.inclusive,
          exact: !1,
          message: o.message
        }), n.dirty()) : o.kind === "max" ? (o.inclusive ? t.data > o.value : t.data >= o.value) && (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(
        i, {
          code: k.ZodIssueCode.too_big,
          maximum: o.value,
          type: "number",
          inclusive: o.inclusive,
          exact: !1,
          message: o.message
        }), n.dirty()) : o.kind === "multipleOf" ? EB(t.data, o.value) !== 0 && (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(i,
        {
          code: k.ZodIssueCode.not_multiple_of,
          multipleOf: o.value,
          message: o.message
        }), n.dirty()) : o.kind === "finite" ? Number.isFinite(t.data) || (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(i, {
          code: k.ZodIssueCode.not_finite,
          message: o.message
        }), n.dirty()) : B.util.assertNever(o);
      return { status: n.value, value: t.data };
    }
    gte(t, r) {
      return this.setLimit("min", t, !0, N.errorUtil.toString(r));
    }
    gt(t, r) {
      return this.setLimit("min", t, !1, N.errorUtil.toString(r));
    }
    lte(t, r) {
      return this.setLimit("max", t, !0, N.errorUtil.toString(r));
    }
    lt(t, r) {
      return this.setLimit("max", t, !1, N.errorUtil.toString(r));
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
            message: N.errorUtil.toString(n)
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
        message: N.errorUtil.toString(t)
      });
    }
    positive(t) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !1,
        message: N.errorUtil.toString(t)
      });
    }
    negative(t) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !1,
        message: N.errorUtil.toString(t)
      });
    }
    nonpositive(t) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !0,
        message: N.errorUtil.toString(t)
      });
    }
    nonnegative(t) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !0,
        message: N.errorUtil.toString(t)
      });
    }
    multipleOf(t, r) {
      return this._addCheck({
        kind: "multipleOf",
        value: t,
        message: N.errorUtil.toString(r)
      });
    }
    finite(t) {
      return this._addCheck({
        kind: "finite",
        message: N.errorUtil.toString(t)
      });
    }
    safe(t) {
      return this._addCheck({
        kind: "min",
        inclusive: !0,
        value: Number.MIN_SAFE_INTEGER,
        message: N.errorUtil.toString(t)
      })._addCheck({
        kind: "max",
        inclusive: !0,
        value: Number.MAX_SAFE_INTEGER,
        message: N.errorUtil.toString(t)
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
      return !!this._def.checks.find((t) => t.kind === "int" || t.kind === "multipleOf" && B.util.isInteger(t.value));
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
  y.ZodNumber = kr;
  kr.create = (e) => new kr({
    checks: [],
    typeName: U.ZodNumber,
    coerce: e?.coerce || !1,
    ...W(e)
  });
  var Or = class e extends H {
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
      if (this._getType(t) !== B.ZodParsedType.bigint)
        return this._getInvalidInput(t);
      let i, n = new v.ParseStatus();
      for (let o of this._def.checks)
        o.kind === "min" ? (o.inclusive ? t.data < o.value : t.data <= o.value) && (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(
        i, {
          code: k.ZodIssueCode.too_small,
          type: "bigint",
          minimum: o.value,
          inclusive: o.inclusive,
          message: o.message
        }), n.dirty()) : o.kind === "max" ? (o.inclusive ? t.data > o.value : t.data >= o.value) && (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(
        i, {
          code: k.ZodIssueCode.too_big,
          type: "bigint",
          maximum: o.value,
          inclusive: o.inclusive,
          message: o.message
        }), n.dirty()) : o.kind === "multipleOf" ? t.data % o.value !== BigInt(0) && (i = this._getOrReturnCtx(t, i), (0, v.addIssueToContext)(
        i, {
          code: k.ZodIssueCode.not_multiple_of,
          multipleOf: o.value,
          message: o.message
        }), n.dirty()) : B.util.assertNever(o);
      return { status: n.value, value: t.data };
    }
    _getInvalidInput(t) {
      let r = this._getOrReturnCtx(t);
      return (0, v.addIssueToContext)(r, {
        code: k.ZodIssueCode.invalid_type,
        expected: B.ZodParsedType.bigint,
        received: r.parsedType
      }), v.INVALID;
    }
    gte(t, r) {
      return this.setLimit("min", t, !0, N.errorUtil.toString(r));
    }
    gt(t, r) {
      return this.setLimit("min", t, !1, N.errorUtil.toString(r));
    }
    lte(t, r) {
      return this.setLimit("max", t, !0, N.errorUtil.toString(r));
    }
    lt(t, r) {
      return this.setLimit("max", t, !1, N.errorUtil.toString(r));
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
            message: N.errorUtil.toString(n)
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
        message: N.errorUtil.toString(t)
      });
    }
    negative(t) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: !1,
        message: N.errorUtil.toString(t)
      });
    }
    nonpositive(t) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: !0,
        message: N.errorUtil.toString(t)
      });
    }
    nonnegative(t) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: !0,
        message: N.errorUtil.toString(t)
      });
    }
    multipleOf(t, r) {
      return this._addCheck({
        kind: "multipleOf",
        value: t,
        message: N.errorUtil.toString(r)
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
  y.ZodBigInt = Or;
  Or.create = (e) => {
    var t;
    return new Or({
      checks: [],
      typeName: U.ZodBigInt,
      coerce: (t = e?.coerce) !== null && t !== void 0 ? t : !1,
      ...W(e)
    });
  };
  var Br = class extends H {
    static {
      s(this, "ZodBoolean");
    }
    _parse(t) {
      if (this._def.coerce && (t.data = !!t.data), this._getType(t) !== B.ZodParsedType.boolean) {
        let i = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(i, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.boolean,
          received: i.parsedType
        }), v.INVALID;
      }
      return (0, v.OK)(t.data);
    }
  };
  y.ZodBoolean = Br;
  Br.create = (e) => new Br({
    typeName: U.ZodBoolean,
    coerce: e?.coerce || !1,
    ...W(e)
  });
  var Pr = class e extends H {
    static {
      s(this, "ZodDate");
    }
    _parse(t) {
      if (this._def.coerce && (t.data = new Date(t.data)), this._getType(t) !== B.ZodParsedType.date) {
        let o = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(o, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.date,
          received: o.parsedType
        }), v.INVALID;
      }
      if (isNaN(t.data.getTime())) {
        let o = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(o, {
          code: k.ZodIssueCode.invalid_date
        }), v.INVALID;
      }
      let i = new v.ParseStatus(), n;
      for (let o of this._def.checks)
        o.kind === "min" ? t.data.getTime() < o.value && (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: k.ZodIssueCode.too_small,
          message: o.message,
          inclusive: !0,
          exact: !1,
          minimum: o.value,
          type: "date"
        }), i.dirty()) : o.kind === "max" ? t.data.getTime() > o.value && (n = this._getOrReturnCtx(t, n), (0, v.addIssueToContext)(n, {
          code: k.ZodIssueCode.too_big,
          message: o.message,
          inclusive: !0,
          exact: !1,
          maximum: o.value,
          type: "date"
        }), i.dirty()) : B.util.assertNever(o);
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
        message: N.errorUtil.toString(r)
      });
    }
    max(t, r) {
      return this._addCheck({
        kind: "max",
        value: t.getTime(),
        message: N.errorUtil.toString(r)
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
  y.ZodDate = Pr;
  Pr.create = (e) => new Pr({
    checks: [],
    coerce: e?.coerce || !1,
    typeName: U.ZodDate,
    ...W(e)
  });
  var Ri = class extends H {
    static {
      s(this, "ZodSymbol");
    }
    _parse(t) {
      if (this._getType(t) !== B.ZodParsedType.symbol) {
        let i = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(i, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.symbol,
          received: i.parsedType
        }), v.INVALID;
      }
      return (0, v.OK)(t.data);
    }
  };
  y.ZodSymbol = Ri;
  Ri.create = (e) => new Ri({
    typeName: U.ZodSymbol,
    ...W(e)
  });
  var Ir = class extends H {
    static {
      s(this, "ZodUndefined");
    }
    _parse(t) {
      if (this._getType(t) !== B.ZodParsedType.undefined) {
        let i = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(i, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.undefined,
          received: i.parsedType
        }), v.INVALID;
      }
      return (0, v.OK)(t.data);
    }
  };
  y.ZodUndefined = Ir;
  Ir.create = (e) => new Ir({
    typeName: U.ZodUndefined,
    ...W(e)
  });
  var Mr = class extends H {
    static {
      s(this, "ZodNull");
    }
    _parse(t) {
      if (this._getType(t) !== B.ZodParsedType.null) {
        let i = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(i, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.null,
          received: i.parsedType
        }), v.INVALID;
      }
      return (0, v.OK)(t.data);
    }
  };
  y.ZodNull = Mr;
  Mr.create = (e) => new Mr({
    typeName: U.ZodNull,
    ...W(e)
  });
  var ar = class extends H {
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
  y.ZodAny = ar;
  ar.create = (e) => new ar({
    typeName: U.ZodAny,
    ...W(e)
  });
  var Wt = class extends H {
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
    typeName: U.ZodUnknown,
    ...W(e)
  });
  var st = class extends H {
    static {
      s(this, "ZodNever");
    }
    _parse(t) {
      let r = this._getOrReturnCtx(t);
      return (0, v.addIssueToContext)(r, {
        code: k.ZodIssueCode.invalid_type,
        expected: B.ZodParsedType.never,
        received: r.parsedType
      }), v.INVALID;
    }
  };
  y.ZodNever = st;
  st.create = (e) => new st({
    typeName: U.ZodNever,
    ...W(e)
  });
  var ki = class extends H {
    static {
      s(this, "ZodVoid");
    }
    _parse(t) {
      if (this._getType(t) !== B.ZodParsedType.undefined) {
        let i = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(i, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.void,
          received: i.parsedType
        }), v.INVALID;
      }
      return (0, v.OK)(t.data);
    }
  };
  y.ZodVoid = ki;
  ki.create = (e) => new ki({
    typeName: U.ZodVoid,
    ...W(e)
  });
  var Ht = class e extends H {
    static {
      s(this, "ZodArray");
    }
    _parse(t) {
      let { ctx: r, status: i } = this._processInputParams(t), n = this._def;
      if (r.parsedType !== B.ZodParsedType.array)
        return (0, v.addIssueToContext)(r, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.array,
          received: r.parsedType
        }), v.INVALID;
      if (n.exactLength !== null) {
        let a = r.data.length > n.exactLength.value, u = r.data.length < n.exactLength.value;
        (a || u) && ((0, v.addIssueToContext)(r, {
          code: a ? k.ZodIssueCode.too_big : k.ZodIssueCode.too_small,
          minimum: u ? n.exactLength.value : void 0,
          maximum: a ? n.exactLength.value : void 0,
          type: "array",
          inclusive: !0,
          exact: !0,
          message: n.exactLength.message
        }), i.dirty());
      }
      if (n.minLength !== null && r.data.length < n.minLength.value && ((0, v.addIssueToContext)(r, {
        code: k.ZodIssueCode.too_small,
        minimum: n.minLength.value,
        type: "array",
        inclusive: !0,
        exact: !1,
        message: n.minLength.message
      }), i.dirty()), n.maxLength !== null && r.data.length > n.maxLength.value && ((0, v.addIssueToContext)(r, {
        code: k.ZodIssueCode.too_big,
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
        minLength: { value: t, message: N.errorUtil.toString(r) }
      });
    }
    max(t, r) {
      return new e({
        ...this._def,
        maxLength: { value: t, message: N.errorUtil.toString(r) }
      });
    }
    length(t, r) {
      return new e({
        ...this._def,
        exactLength: { value: t, message: N.errorUtil.toString(r) }
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
    typeName: U.ZodArray,
    ...W(t)
  });
  function Ai(e) {
    if (e instanceof $e) {
      let t = {};
      for (let r in e.shape) {
        let i = e.shape[r];
        t[r] = Xe.create(Ai(i));
      }
      return new $e({
        ...e._def,
        shape: /* @__PURE__ */ s(() => t, "shape")
      });
    } else return e instanceof Ht ? new Ht({
      ...e._def,
      type: Ai(e.element)
    }) : e instanceof Xe ? Xe.create(Ai(e.unwrap())) : e instanceof vt ? vt.create(Ai(e.unwrap())) : e instanceof bt ? bt.create(e.items.map(
    (t) => Ai(t))) : e;
  }
  s(Ai, "deepPartialify");
  var $e = class e extends H {
    static {
      s(this, "ZodObject");
    }
    constructor() {
      super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
    }
    _getCached() {
      if (this._cached !== null)
        return this._cached;
      let t = this._def.shape(), r = B.util.objectKeys(t);
      return this._cached = { shape: t, keys: r };
    }
    _parse(t) {
      if (this._getType(t) !== B.ZodParsedType.object) {
        let c = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(c, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.object,
          received: c.parsedType
        }), v.INVALID;
      }
      let { status: i, ctx: n } = this._processInputParams(t), { shape: o, keys: a } = this._getCached(), u = [];
      if (!(this._def.catchall instanceof st && this._def.unknownKeys === "strip"))
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
      if (this._def.catchall instanceof st) {
        let c = this._def.unknownKeys;
        if (c === "passthrough")
          for (let d of u)
            l.push({
              key: { status: "valid", value: d },
              value: { status: "valid", value: n.data[d] }
            });
        else if (c === "strict")
          u.length > 0 && ((0, v.addIssueToContext)(n, {
            code: k.ZodIssueCode.unrecognized_keys,
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
      return N.errorUtil.errToObj, new e({
        ...this._def,
        unknownKeys: "strict",
        ...t !== void 0 ? {
          errorMap: /* @__PURE__ */ s((r, i) => {
            var n, o, a, u;
            let l = (a = (o = (n = this._def).errorMap) === null || o === void 0 ? void 0 : o.call(n, r, i).message) !== null && a !== void 0 ?
            a : i.defaultError;
            return r.code === "unrecognized_keys" ? {
              message: (u = N.errorUtil.errToObj(t).message) !== null && u !== void 0 ? u : l
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
        typeName: U.ZodObject
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
      return B.util.objectKeys(t).forEach((i) => {
        t[i] && this.shape[i] && (r[i] = this.shape[i]);
      }), new e({
        ...this._def,
        shape: /* @__PURE__ */ s(() => r, "shape")
      });
    }
    omit(t) {
      let r = {};
      return B.util.objectKeys(this.shape).forEach((i) => {
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
      return Ai(this);
    }
    partial(t) {
      let r = {};
      return B.util.objectKeys(this.shape).forEach((i) => {
        let n = this.shape[i];
        t && !t[i] ? r[i] = n : r[i] = n.optional();
      }), new e({
        ...this._def,
        shape: /* @__PURE__ */ s(() => r, "shape")
      });
    }
    required(t) {
      let r = {};
      return B.util.objectKeys(this.shape).forEach((i) => {
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
      return m_(B.util.objectKeys(this.shape));
    }
  };
  y.ZodObject = $e;
  $e.create = (e, t) => new $e({
    shape: /* @__PURE__ */ s(() => e, "shape"),
    unknownKeys: "strip",
    catchall: st.create(),
    typeName: U.ZodObject,
    ...W(t)
  });
  $e.strictCreate = (e, t) => new $e({
    shape: /* @__PURE__ */ s(() => e, "shape"),
    unknownKeys: "strict",
    catchall: st.create(),
    typeName: U.ZodObject,
    ...W(t)
  });
  $e.lazycreate = (e, t) => new $e({
    shape: e,
    unknownKeys: "strip",
    catchall: st.create(),
    typeName: U.ZodObject,
    ...W(t)
  });
  var jr = class extends H {
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
        let a = o.map((u) => new k.ZodError(u.ctx.common.issues));
        return (0, v.addIssueToContext)(r, {
          code: k.ZodIssueCode.invalid_union,
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
        let u = a.map((l) => new k.ZodError(l));
        return (0, v.addIssueToContext)(r, {
          code: k.ZodIssueCode.invalid_union,
          unionErrors: u
        }), v.INVALID;
      }
    }
    get options() {
      return this._def.options;
    }
  };
  y.ZodUnion = jr;
  jr.create = (e, t) => new jr({
    options: e,
    typeName: U.ZodUnion,
    ...W(t)
  });
  var $t = /* @__PURE__ */ s((e) => e instanceof Lr ? $t(e.schema) : e instanceof Ze ? $t(e.innerType()) : e instanceof Nr ? [e.value] : e instanceof
  Ur ? e.options : e instanceof $r ? B.util.objectValues(e.enum) : e instanceof Wr ? $t(e._def.innerType) : e instanceof Ir ? [void 0] : e instanceof
  Mr ? [null] : e instanceof Xe ? [void 0, ...$t(e.unwrap())] : e instanceof vt ? [null, ...$t(e.unwrap())] : e instanceof Xn || e instanceof
  Vr ? $t(e.unwrap()) : e instanceof Hr ? $t(e._def.innerType) : [], "getDiscriminator"), ra = class e extends H {
    static {
      s(this, "ZodDiscriminatedUnion");
    }
    _parse(t) {
      let { ctx: r } = this._processInputParams(t);
      if (r.parsedType !== B.ZodParsedType.object)
        return (0, v.addIssueToContext)(r, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.object,
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
        code: k.ZodIssueCode.invalid_union_discriminator,
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
        typeName: U.ZodDiscriminatedUnion,
        discriminator: t,
        options: r,
        optionsMap: n,
        ...W(i)
      });
    }
  };
  y.ZodDiscriminatedUnion = ra;
  function pd(e, t) {
    let r = (0, B.getParsedType)(e), i = (0, B.getParsedType)(t);
    if (e === t)
      return { valid: !0, data: e };
    if (r === B.ZodParsedType.object && i === B.ZodParsedType.object) {
      let n = B.util.objectKeys(t), o = B.util.objectKeys(e).filter((u) => n.indexOf(u) !== -1), a = { ...e, ...t };
      for (let u of o) {
        let l = pd(e[u], t[u]);
        if (!l.valid)
          return { valid: !1 };
        a[u] = l.data;
      }
      return { valid: !0, data: a };
    } else if (r === B.ZodParsedType.array && i === B.ZodParsedType.array) {
      if (e.length !== t.length)
        return { valid: !1 };
      let n = [];
      for (let o = 0; o < e.length; o++) {
        let a = e[o], u = t[o], l = pd(a, u);
        if (!l.valid)
          return { valid: !1 };
        n.push(l.data);
      }
      return { valid: !0, data: n };
    } else return r === B.ZodParsedType.date && i === B.ZodParsedType.date && +e == +t ? { valid: !0, data: e } : { valid: !1 };
  }
  s(pd, "mergeValues");
  var qr = class extends H {
    static {
      s(this, "ZodIntersection");
    }
    _parse(t) {
      let { status: r, ctx: i } = this._processInputParams(t), n = /* @__PURE__ */ s((o, a) => {
        if ((0, v.isAborted)(o) || (0, v.isAborted)(a))
          return v.INVALID;
        let u = pd(o.value, a.value);
        return u.valid ? (((0, v.isDirty)(o) || (0, v.isDirty)(a)) && r.dirty(), { status: r.value, value: u.data }) : ((0, v.addIssueToContext)(
        i, {
          code: k.ZodIssueCode.invalid_intersection_types
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
  y.ZodIntersection = qr;
  qr.create = (e, t, r) => new qr({
    left: e,
    right: t,
    typeName: U.ZodIntersection,
    ...W(r)
  });
  var bt = class e extends H {
    static {
      s(this, "ZodTuple");
    }
    _parse(t) {
      let { status: r, ctx: i } = this._processInputParams(t);
      if (i.parsedType !== B.ZodParsedType.array)
        return (0, v.addIssueToContext)(i, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.array,
          received: i.parsedType
        }), v.INVALID;
      if (i.data.length < this._def.items.length)
        return (0, v.addIssueToContext)(i, {
          code: k.ZodIssueCode.too_small,
          minimum: this._def.items.length,
          inclusive: !0,
          exact: !1,
          type: "array"
        }), v.INVALID;
      !this._def.rest && i.data.length > this._def.items.length && ((0, v.addIssueToContext)(i, {
        code: k.ZodIssueCode.too_big,
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
  y.ZodTuple = bt;
  bt.create = (e, t) => {
    if (!Array.isArray(e))
      throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    return new bt({
      items: e,
      typeName: U.ZodTuple,
      rest: null,
      ...W(t)
    });
  };
  var ia = class e extends H {
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
      if (i.parsedType !== B.ZodParsedType.object)
        return (0, v.addIssueToContext)(i, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.object,
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
      return r instanceof H ? new e({
        keyType: t,
        valueType: r,
        typeName: U.ZodRecord,
        ...W(i)
      }) : new e({
        keyType: or.create(),
        valueType: t,
        typeName: U.ZodRecord,
        ...W(r)
      });
    }
  };
  y.ZodRecord = ia;
  var Oi = class extends H {
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
      if (i.parsedType !== B.ZodParsedType.map)
        return (0, v.addIssueToContext)(i, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.map,
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
  y.ZodMap = Oi;
  Oi.create = (e, t, r) => new Oi({
    valueType: t,
    keyType: e,
    typeName: U.ZodMap,
    ...W(r)
  });
  var Bi = class e extends H {
    static {
      s(this, "ZodSet");
    }
    _parse(t) {
      let { status: r, ctx: i } = this._processInputParams(t);
      if (i.parsedType !== B.ZodParsedType.set)
        return (0, v.addIssueToContext)(i, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.set,
          received: i.parsedType
        }), v.INVALID;
      let n = this._def;
      n.minSize !== null && i.data.size < n.minSize.value && ((0, v.addIssueToContext)(i, {
        code: k.ZodIssueCode.too_small,
        minimum: n.minSize.value,
        type: "set",
        inclusive: !0,
        exact: !1,
        message: n.minSize.message
      }), r.dirty()), n.maxSize !== null && i.data.size > n.maxSize.value && ((0, v.addIssueToContext)(i, {
        code: k.ZodIssueCode.too_big,
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
        minSize: { value: t, message: N.errorUtil.toString(r) }
      });
    }
    max(t, r) {
      return new e({
        ...this._def,
        maxSize: { value: t, message: N.errorUtil.toString(r) }
      });
    }
    size(t, r) {
      return this.min(t, r).max(t, r);
    }
    nonempty(t) {
      return this.min(1, t);
    }
  };
  y.ZodSet = Bi;
  Bi.create = (e, t) => new Bi({
    valueType: e,
    minSize: null,
    maxSize: null,
    typeName: U.ZodSet,
    ...W(t)
  });
  var na = class e extends H {
    static {
      s(this, "ZodFunction");
    }
    constructor() {
      super(...arguments), this.validate = this.implement;
    }
    _parse(t) {
      let { ctx: r } = this._processInputParams(t);
      if (r.parsedType !== B.ZodParsedType.function)
        return (0, v.addIssueToContext)(r, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.function,
          received: r.parsedType
        }), v.INVALID;
      function i(u, l) {
        return (0, v.makeIssue)({
          data: u,
          path: r.path,
          errorMaps: [
            r.common.contextualErrorMap,
            r.schemaErrorMap,
            (0, ea.getErrorMap)(),
            ea.defaultErrorMap
          ].filter((c) => !!c),
          issueData: {
            code: k.ZodIssueCode.invalid_arguments,
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
            (0, ea.getErrorMap)(),
            ea.defaultErrorMap
          ].filter((c) => !!c),
          issueData: {
            code: k.ZodIssueCode.invalid_return_type,
            returnTypeError: l
          }
        });
      }
      s(n, "makeReturnsIssue");
      let o = { errorMap: r.common.contextualErrorMap }, a = r.data;
      if (this._def.returns instanceof ur) {
        let u = this;
        return (0, v.OK)(async function(...l) {
          let c = new k.ZodError([]), d = await u._def.args.parseAsync(l, o).catch((f) => {
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
            throw new k.ZodError([i(l, c.error)]);
          let d = Reflect.apply(a, this, c.data), p = u._def.returns.safeParse(d, o);
          if (!p.success)
            throw new k.ZodError([n(d, p.error)]);
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
        args: bt.create(t).rest(Wt.create())
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
        args: t || bt.create([]).rest(Wt.create()),
        returns: r || Wt.create(),
        typeName: U.ZodFunction,
        ...W(i)
      });
    }
  };
  y.ZodFunction = na;
  var Lr = class extends H {
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
  y.ZodLazy = Lr;
  Lr.create = (e, t) => new Lr({
    getter: e,
    typeName: U.ZodLazy,
    ...W(t)
  });
  var Nr = class extends H {
    static {
      s(this, "ZodLiteral");
    }
    _parse(t) {
      if (t.data !== this._def.value) {
        let r = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(r, {
          received: r.data,
          code: k.ZodIssueCode.invalid_literal,
          expected: this._def.value
        }), v.INVALID;
      }
      return { status: "valid", value: t.data };
    }
    get value() {
      return this._def.value;
    }
  };
  y.ZodLiteral = Nr;
  Nr.create = (e, t) => new Nr({
    value: e,
    typeName: U.ZodLiteral,
    ...W(t)
  });
  function m_(e, t) {
    return new Ur({
      values: e,
      typeName: U.ZodEnum,
      ...W(t)
    });
  }
  s(m_, "createZodEnum");
  var Ur = class e extends H {
    static {
      s(this, "ZodEnum");
    }
    constructor() {
      super(...arguments), Yn.set(this, void 0);
    }
    _parse(t) {
      if (typeof t.data != "string") {
        let r = this._getOrReturnCtx(t), i = this._def.values;
        return (0, v.addIssueToContext)(r, {
          expected: B.util.joinValues(i),
          received: r.parsedType,
          code: k.ZodIssueCode.invalid_type
        }), v.INVALID;
      }
      if (ta(this, Yn, "f") || f_(this, Yn, new Set(this._def.values), "f"), !ta(this, Yn, "f").has(t.data)) {
        let r = this._getOrReturnCtx(t), i = this._def.values;
        return (0, v.addIssueToContext)(r, {
          received: r.data,
          code: k.ZodIssueCode.invalid_enum_value,
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
  y.ZodEnum = Ur;
  Yn = /* @__PURE__ */ new WeakMap();
  Ur.create = m_;
  var $r = class extends H {
    static {
      s(this, "ZodNativeEnum");
    }
    constructor() {
      super(...arguments), Jn.set(this, void 0);
    }
    _parse(t) {
      let r = B.util.getValidEnumValues(this._def.values), i = this._getOrReturnCtx(t);
      if (i.parsedType !== B.ZodParsedType.string && i.parsedType !== B.ZodParsedType.number) {
        let n = B.util.objectValues(r);
        return (0, v.addIssueToContext)(i, {
          expected: B.util.joinValues(n),
          received: i.parsedType,
          code: k.ZodIssueCode.invalid_type
        }), v.INVALID;
      }
      if (ta(this, Jn, "f") || f_(this, Jn, new Set(B.util.getValidEnumValues(this._def.values)), "f"), !ta(this, Jn, "f").has(t.data)) {
        let n = B.util.objectValues(r);
        return (0, v.addIssueToContext)(i, {
          received: i.data,
          code: k.ZodIssueCode.invalid_enum_value,
          options: n
        }), v.INVALID;
      }
      return (0, v.OK)(t.data);
    }
    get enum() {
      return this._def.values;
    }
  };
  y.ZodNativeEnum = $r;
  Jn = /* @__PURE__ */ new WeakMap();
  $r.create = (e, t) => new $r({
    values: e,
    typeName: U.ZodNativeEnum,
    ...W(t)
  });
  var ur = class extends H {
    static {
      s(this, "ZodPromise");
    }
    unwrap() {
      return this._def.type;
    }
    _parse(t) {
      let { ctx: r } = this._processInputParams(t);
      if (r.parsedType !== B.ZodParsedType.promise && r.common.async === !1)
        return (0, v.addIssueToContext)(r, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.promise,
          received: r.parsedType
        }), v.INVALID;
      let i = r.parsedType === B.ZodParsedType.promise ? r.data : Promise.resolve(r.data);
      return (0, v.OK)(i.then((n) => this._def.type.parseAsync(n, {
        path: r.path,
        errorMap: r.common.contextualErrorMap
      })));
    }
  };
  y.ZodPromise = ur;
  ur.create = (e, t) => new ur({
    type: e,
    typeName: U.ZodPromise,
    ...W(t)
  });
  var Ze = class extends H {
    static {
      s(this, "ZodEffects");
    }
    innerType() {
      return this._def.schema;
    }
    sourceType() {
      return this._def.schema._def.typeName === U.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
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
      B.util.assertNever(n);
    }
  };
  y.ZodEffects = Ze;
  y.ZodTransformer = Ze;
  Ze.create = (e, t, r) => new Ze({
    schema: e,
    typeName: U.ZodEffects,
    effect: t,
    ...W(r)
  });
  Ze.createWithPreprocess = (e, t, r) => new Ze({
    schema: t,
    effect: { type: "preprocess", transform: e },
    typeName: U.ZodEffects,
    ...W(r)
  });
  var Xe = class extends H {
    static {
      s(this, "ZodOptional");
    }
    _parse(t) {
      return this._getType(t) === B.ZodParsedType.undefined ? (0, v.OK)(void 0) : this._def.innerType._parse(t);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  y.ZodOptional = Xe;
  Xe.create = (e, t) => new Xe({
    innerType: e,
    typeName: U.ZodOptional,
    ...W(t)
  });
  var vt = class extends H {
    static {
      s(this, "ZodNullable");
    }
    _parse(t) {
      return this._getType(t) === B.ZodParsedType.null ? (0, v.OK)(null) : this._def.innerType._parse(t);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  y.ZodNullable = vt;
  vt.create = (e, t) => new vt({
    innerType: e,
    typeName: U.ZodNullable,
    ...W(t)
  });
  var Wr = class extends H {
    static {
      s(this, "ZodDefault");
    }
    _parse(t) {
      let { ctx: r } = this._processInputParams(t), i = r.data;
      return r.parsedType === B.ZodParsedType.undefined && (i = this._def.defaultValue()), this._def.innerType._parse({
        data: i,
        path: r.path,
        parent: r
      });
    }
    removeDefault() {
      return this._def.innerType;
    }
  };
  y.ZodDefault = Wr;
  Wr.create = (e, t) => new Wr({
    innerType: e,
    typeName: U.ZodDefault,
    defaultValue: typeof t.default == "function" ? t.default : () => t.default,
    ...W(t)
  });
  var Hr = class extends H {
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
            return new k.ZodError(i.common.issues);
          },
          input: i.data
        })
      })) : {
        status: "valid",
        value: n.status === "valid" ? n.value : this._def.catchValue({
          get error() {
            return new k.ZodError(i.common.issues);
          },
          input: i.data
        })
      };
    }
    removeCatch() {
      return this._def.innerType;
    }
  };
  y.ZodCatch = Hr;
  Hr.create = (e, t) => new Hr({
    innerType: e,
    typeName: U.ZodCatch,
    catchValue: typeof t.catch == "function" ? t.catch : () => t.catch,
    ...W(t)
  });
  var Pi = class extends H {
    static {
      s(this, "ZodNaN");
    }
    _parse(t) {
      if (this._getType(t) !== B.ZodParsedType.nan) {
        let i = this._getOrReturnCtx(t);
        return (0, v.addIssueToContext)(i, {
          code: k.ZodIssueCode.invalid_type,
          expected: B.ZodParsedType.nan,
          received: i.parsedType
        }), v.INVALID;
      }
      return { status: "valid", value: t.data };
    }
  };
  y.ZodNaN = Pi;
  Pi.create = (e) => new Pi({
    typeName: U.ZodNaN,
    ...W(e)
  });
  y.BRAND = Symbol("zod_brand");
  var Xn = class extends H {
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
  y.ZodBranded = Xn;
  var Qn = class e extends H {
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
        typeName: U.ZodPipeline
      });
    }
  };
  y.ZodPipeline = Qn;
  var Vr = class extends H {
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
  y.ZodReadonly = Vr;
  Vr.create = (e, t) => new Vr({
    innerType: e,
    typeName: U.ZodReadonly,
    ...W(t)
  });
  function g_(e, t = {}, r) {
    return e ? ar.create().superRefine((i, n) => {
      var o, a;
      if (!e(i)) {
        let u = typeof t == "function" ? t(i) : typeof t == "string" ? { message: t } : t, l = (a = (o = u.fatal) !== null && o !== void 0 ?
        o : r) !== null && a !== void 0 ? a : !0, c = typeof u == "string" ? { message: u } : u;
        n.addIssue({ code: "custom", ...c, fatal: l });
      }
    }) : ar.create();
  }
  s(g_, "custom");
  y.custom = g_;
  y.late = {
    object: $e.lazycreate
  };
  var U;
  (function(e) {
    e.ZodString = "ZodString", e.ZodNumber = "ZodNumber", e.ZodNaN = "ZodNaN", e.ZodBigInt = "ZodBigInt", e.ZodBoolean = "ZodBoolean", e.ZodDate =
    "ZodDate", e.ZodSymbol = "ZodSymbol", e.ZodUndefined = "ZodUndefined", e.ZodNull = "ZodNull", e.ZodAny = "ZodAny", e.ZodUnknown = "ZodUn\
known", e.ZodNever = "ZodNever", e.ZodVoid = "ZodVoid", e.ZodArray = "ZodArray", e.ZodObject = "ZodObject", e.ZodUnion = "ZodUnion", e.ZodDiscriminatedUnion =
    "ZodDiscriminatedUnion", e.ZodIntersection = "ZodIntersection", e.ZodTuple = "ZodTuple", e.ZodRecord = "ZodRecord", e.ZodMap = "ZodMap",
    e.ZodSet = "ZodSet", e.ZodFunction = "ZodFunction", e.ZodLazy = "ZodLazy", e.ZodLiteral = "ZodLiteral", e.ZodEnum = "ZodEnum", e.ZodEffects =
    "ZodEffects", e.ZodNativeEnum = "ZodNativeEnum", e.ZodOptional = "ZodOptional", e.ZodNullable = "ZodNullable", e.ZodDefault = "ZodDefaul\
t", e.ZodCatch = "ZodCatch", e.ZodPromise = "ZodPromise", e.ZodBranded = "ZodBranded", e.ZodPipeline = "ZodPipeline", e.ZodReadonly = "ZodRe\
adonly";
  })(U || (y.ZodFirstPartyTypeKind = U = {}));
  var CB = /* @__PURE__ */ s((e, t = {
    message: `Input not instance of ${e.name}`
  }) => g_((r) => r instanceof e, t), "instanceOfType");
  y.instanceof = CB;
  var y_ = or.create;
  y.string = y_;
  var b_ = kr.create;
  y.number = b_;
  var xB = Pi.create;
  y.nan = xB;
  var FB = Or.create;
  y.bigint = FB;
  var v_ = Br.create;
  y.boolean = v_;
  var SB = Pr.create;
  y.date = SB;
  var TB = Ri.create;
  y.symbol = TB;
  var AB = Ir.create;
  y.undefined = AB;
  var RB = Mr.create;
  y.null = RB;
  var kB = ar.create;
  y.any = kB;
  var OB = Wt.create;
  y.unknown = OB;
  var BB = st.create;
  y.never = BB;
  var PB = ki.create;
  y.void = PB;
  var IB = Ht.create;
  y.array = IB;
  var MB = $e.create;
  y.object = MB;
  var jB = $e.strictCreate;
  y.strictObject = jB;
  var qB = jr.create;
  y.union = qB;
  var LB = ra.create;
  y.discriminatedUnion = LB;
  var NB = qr.create;
  y.intersection = NB;
  var UB = bt.create;
  y.tuple = UB;
  var $B = ia.create;
  y.record = $B;
  var WB = Oi.create;
  y.map = WB;
  var HB = Bi.create;
  y.set = HB;
  var VB = na.create;
  y.function = VB;
  var ZB = Lr.create;
  y.lazy = ZB;
  var zB = Nr.create;
  y.literal = zB;
  var GB = Ur.create;
  y.enum = GB;
  var KB = $r.create;
  y.nativeEnum = KB;
  var YB = ur.create;
  y.promise = YB;
  var __ = Ze.create;
  y.effect = __;
  y.transformer = __;
  var JB = Xe.create;
  y.optional = JB;
  var XB = vt.create;
  y.nullable = XB;
  var QB = Ze.createWithPreprocess;
  y.preprocess = QB;
  var e8 = Qn.create;
  y.pipeline = e8;
  var t8 = /* @__PURE__ */ s(() => y_().optional(), "ostring");
  y.ostring = t8;
  var r8 = /* @__PURE__ */ s(() => b_().optional(), "onumber");
  y.onumber = r8;
  var i8 = /* @__PURE__ */ s(() => v_().optional(), "oboolean");
  y.oboolean = i8;
  y.coerce = {
    string: /* @__PURE__ */ s((e) => or.create({ ...e, coerce: !0 }), "string"),
    number: /* @__PURE__ */ s((e) => kr.create({ ...e, coerce: !0 }), "number"),
    boolean: /* @__PURE__ */ s((e) => Br.create({
      ...e,
      coerce: !0
    }), "boolean"),
    bigint: /* @__PURE__ */ s((e) => Or.create({ ...e, coerce: !0 }), "bigint"),
    date: /* @__PURE__ */ s((e) => Pr.create({ ...e, coerce: !0 }), "date")
  };
  y.NEVER = v.INVALID;
});

// ../node_modules/zod/lib/external.js
var Dd = b((et) => {
  "use strict";
  var n8 = et && et.__createBinding || (Object.create ? function(e, t, r, i) {
    i === void 0 && (i = r);
    var n = Object.getOwnPropertyDescriptor(t, r);
    (!n || ("get" in n ? !t.__esModule : n.writable || n.configurable)) && (n = { enumerable: !0, get: /* @__PURE__ */ s(function() {
      return t[r];
    }, "get") }), Object.defineProperty(e, i, n);
  } : function(e, t, r, i) {
    i === void 0 && (i = r), e[i] = t[r];
  }), Ii = et && et.__exportStar || function(e, t) {
    for (var r in e) r !== "default" && !Object.prototype.hasOwnProperty.call(t, r) && n8(t, e, r);
  };
  Object.defineProperty(et, "__esModule", { value: !0 });
  Ii(Xo(), et);
  Ii(fd(), et);
  Ii(u_(), et);
  Ii(Gn(), et);
  Ii(w_(), et);
  Ii(Jo(), et);
});

// ../node_modules/zod/lib/index.js
var x_ = b((We) => {
  "use strict";
  var E_ = We && We.__createBinding || (Object.create ? function(e, t, r, i) {
    i === void 0 && (i = r);
    var n = Object.getOwnPropertyDescriptor(t, r);
    (!n || ("get" in n ? !t.__esModule : n.writable || n.configurable)) && (n = { enumerable: !0, get: /* @__PURE__ */ s(function() {
      return t[r];
    }, "get") }), Object.defineProperty(e, i, n);
  } : function(e, t, r, i) {
    i === void 0 && (i = r), e[i] = t[r];
  }), s8 = We && We.__setModuleDefault || (Object.create ? function(e, t) {
    Object.defineProperty(e, "default", { enumerable: !0, value: t });
  } : function(e, t) {
    e.default = t;
  }), o8 = We && We.__importStar || function(e) {
    if (e && e.__esModule) return e;
    var t = {};
    if (e != null) for (var r in e) r !== "default" && Object.prototype.hasOwnProperty.call(e, r) && E_(t, e, r);
    return s8(t, e), t;
  }, a8 = We && We.__exportStar || function(e, t) {
    for (var r in e) r !== "default" && !Object.prototype.hasOwnProperty.call(t, r) && E_(t, e, r);
  };
  Object.defineProperty(We, "__esModule", { value: !0 });
  We.z = void 0;
  var C_ = o8(Dd());
  We.z = C_;
  a8(Dd(), We);
  We.default = C_;
});

// src/cli/detect.ts
import { existsSync as $o } from "node:fs";
import { resolve as _k } from "node:path";
import { HandledError as wk, commandLog as Y0 } from "@storybook/core/common";
import { logger as Ek } from "@storybook/core/node-logger";

// node_modules/find-up/index.js
import Li from "node:path";

// ../node_modules/locate-path/index.js
import I_ from "node:process";
import M_ from "node:path";
import yd, { promises as x8 } from "node:fs";
import { fileURLToPath as j_ } from "node:url";
var bd = {
  directory: "isDirectory",
  file: "isFile"
};
function q_(e) {
  if (!Object.hasOwnProperty.call(bd, e))
    throw new Error(`Invalid type specified: ${e}`);
}
s(q_, "checkType");
var L_ = /* @__PURE__ */ s((e, t) => t[bd[e]](), "matchType"), N_ = /* @__PURE__ */ s((e) => e instanceof URL ? j_(e) : e, "toPath");
function la(e, {
  cwd: t = I_.cwd(),
  type: r = "file",
  allowSymlinks: i = !0
} = {}) {
  q_(r), t = N_(t);
  let n = i ? yd.statSync : yd.lstatSync;
  for (let o of e)
    try {
      let a = n(M_.resolve(t, o), {
        throwIfNoEntry: !1
      });
      if (!a)
        continue;
      if (L_(r, a))
        return o;
    } catch {
    }
}
s(la, "locatePathSync");

// node_modules/unicorn-magic/node.js
import { fileURLToPath as U_ } from "node:url";
function ca(e) {
  return e instanceof URL ? U_(e) : e;
}
s(ca, "toPath");

// node_modules/path-exists/index.js
import I8, { promises as M8 } from "node:fs";

// node_modules/find-up/index.js
var $_ = Symbol("findUpStop");
function W_(e, t = {}) {
  let r = Li.resolve(ca(t.cwd) ?? ""), { root: i } = Li.parse(r), n = Li.resolve(r, ca(t.stopAt) ?? i), o = t.limit ?? Number.POSITIVE_INFINITY,
  a = [e].flat(), u = /* @__PURE__ */ s((c) => {
    if (typeof e != "function")
      return la(a, c);
    let d = e(c.cwd);
    return typeof d == "string" ? la([d], c) : d;
  }, "runMatcher"), l = [];
  for (; ; ) {
    let c = u({ ...t, cwd: r });
    if (c === $_ || (c && l.push(Li.resolve(r, c)), r === n || l.length >= o))
      break;
    r = Li.dirname(r);
  }
  return l;
}
s(W_, "findUpMultipleSync");
function zr(e, t = {}) {
  return W_(e, { ...t, limit: 1 })[0];
}
s(zr, "findUpSync");

// src/cli/detect.ts
var J0 = Ae(gs(), 1);
import xr from "semver";

// src/cli/helpers.ts
import { cpSync as ak, existsSync as Ut, readFileSync as uk, writeFileSync as lk } from "node:fs";
import { cp as Z0, readFile as ck, writeFile as dk } from "node:fs/promises";
import { join as Fi, resolve as jc } from "node:path";
import {
  frameworkToRenderer as fk
} from "@storybook/core/common";
import { versions as hk } from "@storybook/core/common";
var z0 = Ae(Eu(), 1);
import { coerce as G0, major as pk, satisfies as Dk } from "semver";

// ../node_modules/strip-json-comments/index.js
var Cu = Symbol("singleComment"), Xp = Symbol("multiComment"), JC = /* @__PURE__ */ s(() => "", "stripWithoutWhitespace"), XC = /* @__PURE__ */ s(
(e, t, r) => e.slice(t, r).replace(/\S/g, " "), "stripWithWhitespace"), QC = /* @__PURE__ */ s((e, t) => {
  let r = t - 1, i = 0;
  for (; e[r] === "\\"; )
    r -= 1, i += 1;
  return !!(i % 2);
}, "isEscaped");
function xu(e, { whitespace: t = !0, trailingCommas: r = !1 } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected argument \`jsonString\` to be a \`string\`, got \`${typeof e}\``);
  let i = t ? XC : JC, n = !1, o = !1, a = 0, u = "", l = "", c = -1;
  for (let d = 0; d < e.length; d++) {
    let p = e[d], h = e[d + 1];
    if (!o && p === '"' && (QC(e, d) || (n = !n)), !n)
      if (!o && p + h === "//")
        u += e.slice(a, d), a = d, o = Cu, d++;
      else if (o === Cu && p + h === `\r
`) {
        d++, o = !1, u += i(e, a, d), a = d;
        continue;
      } else if (o === Cu && p === `
`)
        o = !1, u += i(e, a, d), a = d;
      else if (!o && p + h === "/*") {
        u += e.slice(a, d), a = d, o = Xp, d++;
        continue;
      } else if (o === Xp && p + h === "*/") {
        d++, o = !1, u += i(e, a, d + 1), a = d + 1;
        continue;
      } else r && !o && (c !== -1 ? p === "}" || p === "]" ? (u += e.slice(a, d), l += i(u, 0, 1) + u.slice(1), u = "", a = d, c = -1) : p !==
      " " && p !== "	" && p !== "\r" && p !== `
` && (u += e.slice(a, d), a = d, c = -1) : p === "," && (l += u + e.slice(a, d), u = "", a = d, c = d));
  }
  return l + u + (o ? i(e.slice(a)) : e.slice(a));
}
s(xu, "stripJsonComments");

// ../node_modules/tiny-invariant/dist/esm/tiny-invariant.js
var ex = process.env.NODE_ENV === "production", Fu = "Invariant failed";
function Ji(e, t) {
  if (!e) {
    if (ex)
      throw new Error(Fu);
    var r = typeof t == "function" ? t() : t, i = r ? "".concat(Fu, ": ").concat(r) : Fu;
    throw new Error(i);
  }
}
s(Ji, "invariant");

// src/cli/dirs.ts
var Ic = Ae(I0(), 1), Mc = Ae(q0(), 1);
import { dirname as ik, join as H0 } from "node:path";
import { temporaryDirectory as nk, versions as sk } from "@storybook/core/common";

// src/cli/project_types.ts
import { minVersion as JR, validRange as XR } from "semver";
function QR(e, t) {
  return XR(e) ? JR(e)?.major === t : !1;
}
s(QR, "eqMajor");
var L0 = [
  { name: "qwik", packageName: "storybook-framework-qwik" },
  { name: "solid", frameworks: ["storybook-solidjs-vite"], renderer: "storybook-solidjs" },
  {
    name: "nuxt",
    packageName: "@storybook-vue/nuxt",
    frameworks: ["@storybook-vue/nuxt"],
    renderer: "@storybook/vue3"
  }
], Fq = [
  "react",
  "react-native",
  "vue3",
  "angular",
  "ember",
  "preact",
  "svelte",
  "qwik",
  "solid"
], Pc = /* @__PURE__ */ ((S) => (S.UNDETECTED = "UNDETECTED", S.UNSUPPORTED = "UNSUPPORTED", S.REACT = "REACT", S.REACT_SCRIPTS = "REACT_SCR\
IPTS", S.REACT_NATIVE = "REACT_NATIVE", S.REACT_NATIVE_WEB = "REACT_NATIVE_WEB", S.REACT_PROJECT = "REACT_PROJECT", S.WEBPACK_REACT = "WEBPA\
CK_REACT", S.NEXTJS = "NEXTJS", S.VUE3 = "VUE3", S.NUXT = "NUXT", S.ANGULAR = "ANGULAR", S.EMBER = "EMBER", S.WEB_COMPONENTS = "WEB_COMPONEN\
TS", S.HTML = "HTML", S.QWIK = "QWIK", S.PREACT = "PREACT", S.SVELTE = "SVELTE", S.SVELTEKIT = "SVELTEKIT", S.SERVER = "SERVER", S.NX = "NX",
S.SOLID = "SOLID", S))(Pc || {}), N0 = /* @__PURE__ */ ((r) => (r.Webpack5 = "webpack5", r.Vite = "vite", r))(N0 || {}), ek = /* @__PURE__ */ ((r) => (r.
Babel = "babel", r.SWC = "swc", r))(ek || {}), tk = /* @__PURE__ */ ((t) => (t.Rsbuild = "rsbuild", t))(tk || {}), Sq = {
  "@storybook/addon-webpack5-compiler-babel": "babel",
  "@storybook/addon-webpack5-compiler-swc": "swc"
}, Tq = {
  "@storybook/builder-webpack5": "webpack5",
  "@storybook/builder-vite": "vite"
}, U0 = /* @__PURE__ */ ((i) => (i.JAVASCRIPT = "javascript", i.TYPESCRIPT_3_8 = "typescript-3-8", i.TYPESCRIPT_4_9 = "typescript-4-9", i))(
U0 || {}), $0 = [
  {
    preset: "NUXT",
    dependencies: ["nuxt"],
    matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.every(Boolean) ?? !0, "matcherFunction")
  },
  {
    preset: "VUE3",
    dependencies: {
      // This Vue template works with Vue 3
      vue: /* @__PURE__ */ s((e) => e === "next" || QR(e, 3), "vue")
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
], W0 = {
  preset: "UNSUPPORTED",
  dependencies: {},
  matcherFunction: /* @__PURE__ */ s(({ dependencies: e }) => e?.some(Boolean) ?? !1, "matcherFunction")
}, rk = [
  "UNDETECTED",
  "UNSUPPORTED",
  "NX"
], Aq = Object.values(Pc).filter((e) => !rk.includes(e)).map((e) => e.toLowerCase());

// src/cli/dirs.ts
var ok = /* @__PURE__ */ s(async (e, t) => {
  let r = await nk(), n = sk[t] || await e.latestVersion(t), o = Mc.default.default || Mc.default, a = Ic.default.default || Ic.default, u = o(
  t, n, {
    registry: await e.getRegistryURL()
  });
  return await a({ url: u, dir: r }), H0(r, "package");
}, "resolveUsingBranchInstall");
async function V0(e, t) {
  let r = L0.find((a) => a.name === t), i = r?.packageName || r?.renderer || `@storybook/${t}`, n = H0(i, "package.json"), o = [];
  try {
    return ik(
      x.resolve(n, {
        paths: [process.cwd()]
      })
    );
  } catch (a) {
    Ji(a instanceof Error), o.push(a);
  }
  try {
    return await ok(e, i);
  } catch (a) {
    Ji(a instanceof Error), o.push(a);
  }
  throw new Error(`Cannot find ${n}, ${o.map((a) => a.stack).join(`

`)}`);
}
s(V0, "getRendererDir");

// src/cli/helpers.ts
var mk = console;
function Gq(e, t) {
  let r = jc(e);
  if (!Ut(r))
    return !1;
  let i = uk(r, "utf8"), n = t ? xu(i) : i;
  try {
    return JSON.parse(n);
  } catch (o) {
    throw mk.error(z0.default.red(`Invalid json in file: ${r}`)), o;
  }
}
s(Gq, "readFileAsJson");
var Kq = /* @__PURE__ */ s((e, t) => {
  let r = jc(e);
  return Ut(r) ? (lk(r, `${JSON.stringify(t, null, 2)}
`), !0) : !1;
}, "writeFileAsJson");
async function Yq(e, t) {
  let r = [], i = "^8.0.0-0", n = t.dependencies["babel-core"] || t.devDependencies["babel-core"];
  if (n) {
    let o = await e.latestVersion(
      "babel-core",
      n
    );
    Dk(o, "^6.0.0") && (i = "^7.0.0");
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
s(Yq, "getBabelDependencies");
function Jq(e, t, r) {
  !e.dependencies?.[t] && !e.devDependencies?.[t] && (e.devDependencies ? e.devDependencies[t] = r : e.devDependencies = {
    [t]: r
  });
}
s(Jq, "addToDevDependenciesIfNotPresent");
function Xq(e, t = ".") {
  let r = jc(e, "template-csf/");
  if (!Ut(r))
    throw new Error("Couldn't find template dir");
  ak(r, t, { recursive: !0 });
}
s(Xq, "copyTemplate");
var gk = fk, Qq = {
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
async function yk(e, t) {
  try {
    let r = await e.getInstalledVersion(t);
    return r || (r = (await e.getAllDependencies())[t] ?? ""), G0(r, { includePrerelease: !0 })?.toString();
  } catch {
  }
}
s(yk, "getVersionSafe");
var bk = /* @__PURE__ */ s(async () => Ut("./src") ? "./src/stories" : "./stories", "cliStoriesTargetPath");
async function eL({
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
    let d = await yk(e, "svelte");
    d && pk(d) >= 5 && (a = {
      // keeping this for backwards compatibility in case community packages are using it
      typescript: "ts",
      javascript: "svelte-5-js",
      "typescript-3-8": "svelte-5-ts-3-8",
      "typescript-4-9": "svelte-5-ts-4-9"
    });
  }
  let u = /* @__PURE__ */ s(async () => {
    let d = await V0(e, t), p = Fi(d, "template", "cli"), h = Fi(p, a[r]), f = Fi(p, a.javascript), g = Fi(p, a.typescript), E = Fi(p, a["ty\
pescript-3-8"]);
    if (Ut(h))
      return h;
    if (r === "typescript-4-9" && Ut(E))
      return E;
    if (Ut(g))
      return g;
    if (Ut(f))
      return f;
    if (Ut(p))
      return p;
    throw new Error(`Unsupported renderer: ${t} (${d})`);
  }, "templatePath"), l = i ?? await bk(), c = /* @__PURE__ */ s((d) => o.includes("docs") || !d.endsWith(".mdx"), "filter");
  if (n && await Z0(n, l, { recursive: !0, filter: c }), await Z0(await u(), l, { recursive: !0, filter: c }), n && o.includes("docs")) {
    let d = gk[t] || "react";
    d === "vue3" && (d = "vue"), await vk(Fi(l, "Configure.mdx"), { renderer: d });
  }
}
s(eL, "copyTemplateFiles");
async function vk(e, t) {
  let r = await ck(e, { encoding: "utf8" });
  Object.keys(t).forEach((i) => {
    r = r.replaceAll(`{{${i}}}`, `${t[i]}`);
  }), await dk(e, r);
}
s(vk, "adjustTemplate");
function tL(e) {
  let t = {
    ...e.dependencies,
    ...e.devDependencies,
    ...e.optionalDependencies
  }, r = Object.keys(t).find((i) => hk[i]);
  if (!r)
    throw new Error("Couldn't find any official storybook packages in package.json");
  return t[r];
}
s(tL, "getStorybookVersionSpecifier");
async function K0() {
  return zr("nx.json");
}
s(K0, "isNxProject");
function rL(e) {
  let t = G0(e);
  return Ji(t != null, `Could not coerce ${e} into a semver.`), t;
}
s(rL, "coerceSemver");
async function iL(e) {
  let t = await e.getAllDependencies();
  return Object.keys(t).some((r) => r.includes("storybook"));
}
s(iL, "hasStorybookDependencies");

// src/cli/detect.ts
var Ck = ["vite.config.ts", "vite.config.js", "vite.config.mjs"], xk = ["webpack.config.js"], Fk = /* @__PURE__ */ s((e, t, r) => {
  let i = e.dependencies?.[t] || e.devDependencies?.[t];
  return i && typeof r == "function" ? r(i) : !!i;
}, "hasDependency"), Sk = /* @__PURE__ */ s((e, t, r) => {
  let i = e.peerDependencies?.[t];
  return i && typeof r == "function" ? r(i) : !!i;
}, "hasPeerDependency"), Tk = /* @__PURE__ */ s((e, t) => {
  let r = {
    dependencies: [!1],
    peerDependencies: [!1],
    files: [!1]
  }, { preset: i, files: n, dependencies: o, peerDependencies: a, matcherFunction: u } = t, l = [];
  Array.isArray(o) ? l = o.map((d) => [d, void 0]) : typeof o == "object" && (l = Object.entries(o)), l.length > 0 && (r.dependencies = l.map(
    ([d, p]) => Fk(e, d, p)
  ));
  let c = [];
  return Array.isArray(a) ? c = a.map((d) => [d, void 0]) : typeof a == "object" && (c = Object.entries(a)), c.length > 0 && (r.peerDependencies =
  c.map(
    ([d, p]) => Sk(e, d, p)
  )), Array.isArray(n) && n.length > 0 && (r.files = n.map((d) => $o(d))), u(r) ? i : null;
}, "getFrameworkPreset");
function Ak(e = {}) {
  let t = [...$0, W0].find((r) => Tk(e, r) !== null);
  return t ? t.preset : "UNDETECTED";
}
s(Ak, "detectFrameworkPreset");
async function pL(e, t) {
  let r = zr(Ck), i = zr(xk), n = await e.getAllDependencies();
  if (r || n.vite && n.webpack === void 0)
    return Y0("Detected Vite project. Setting builder to Vite")(), "vite";
  if (i || (n.webpack || n["@nuxt/webpack-builder"]) && n.vite !== void 0)
    return Y0("Detected webpack project. Setting builder to webpack")(), "webpack5";
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
      let { builder: o } = await (0, J0.default)(
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
            throw new wk("Canceled by the user");
          }, "onCancel")
        }
      );
      return o;
  }
}
s(pL, "detectBuilder");
function DL(e = _k(process.cwd(), ".storybook")) {
  return $o(e);
}
s(DL, "isStorybookInstantiated");
async function mL() {
  return !!zr([".pnp.js", ".pnp.cjs"]);
}
s(mL, "detectPnp");
async function gL(e) {
  let t = "javascript";
  if ($o("jsconfig.json"))
    return t;
  let r = await e.getAllDependencies().then((l) => !!l.typescript), i = await e.getPackageVersion("typescript"), n = await e.getPackageVersion(
  "prettier"), o = await e.getPackageVersion(
    "@babel/plugin-transform-typescript"
  ), a = await e.getPackageVersion(
    "@typescript-eslint/parser"
  ), u = await e.getPackageVersion("eslint-plugin-storybook");
  return r && i ? xr.gte(i, "4.9.0") && (!n || xr.gte(n, "2.8.0")) && (!o || xr.gte(o, "7.20.0")) && (!a || xr.gte(a, "5.44.0")) && (!u || xr.
  gte(u, "0.6.8")) ? t = "typescript-4-9" : xr.gte(i, "3.8.0") ? t = "typescript-3-8" : xr.lt(i, "3.8.0") && Ek.warn("Detected TypeScript < \
3.8, populating with JavaScript examples") : $o("tsconfig.json") && (t = "typescript-4-9"), t;
}
s(gL, "detectLanguage");
async function yL(e, t = {}) {
  let r = await e.retrievePackageJson();
  return r ? await K0() ? "NX" : t.html ? "HTML" : Ak(r) : "UNDETECTED";
}
s(yL, "detect");

// src/cli/angular/helpers.ts
import { existsSync as CO, readFileSync as xO, writeFileSync as FO } from "node:fs";
import { join as SO } from "node:path";
import { logger as TO } from "@storybook/core/node-logger";
import { MissingAngularJsonError as AO } from "@storybook/core/server-errors";

// ../node_modules/boxen/index.js
import Go from "node:process";

// ../node_modules/ansi-regex/index.js
function qc({ onlyFirst: e = !1 } = {}) {
  let t = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
  ].join("|");
  return new RegExp(t, e ? void 0 : "g");
}
s(qc, "ansiRegex");

// ../node_modules/strip-ansi/index.js
var Rk = qc();
function Fr(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a \`string\`, got \`${typeof e}\``);
  return e.replace(Rk, "");
}
s(Fr, "stripAnsi");

// ../node_modules/boxen/node_modules/string-width/index.js
var ev = Ae(Nc(), 1), tv = Ae(Uc(), 1);
function Ye(e, t = {}) {
  if (typeof e != "string" || e.length === 0 || (t = {
    ambiguousIsNarrow: !0,
    ...t
  }, e = Fr(e), e.length === 0))
    return 0;
  e = e.replace((0, tv.default)(), "  ");
  let r = t.ambiguousIsNarrow ? 1 : 2, i = 0;
  for (let n of e) {
    let o = n.codePointAt(0);
    if (o <= 31 || o >= 127 && o <= 159 || o >= 768 && o <= 879)
      continue;
    switch (ev.default.eastAsianWidth(n)) {
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
var rv = /* @__PURE__ */ s((e = 0) => (t) => `\x1B[${t + e}m`, "wrapAnsi16"), iv = /* @__PURE__ */ s((e = 0) => (t) => `\x1B[${38 + e};5;${t}\
m`, "wrapAnsi256"), nv = /* @__PURE__ */ s((e = 0) => (t, r, i) => `\x1B[${38 + e};2;${t};${r};${i}m`, "wrapAnsi16m"), De = {
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
}, OL = Object.keys(De.modifier), kk = Object.keys(De.color), Ok = Object.keys(De.bgColor), BL = [...kk, ...Ok];
function Bk() {
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
  }), De.color.close = "\x1B[39m", De.bgColor.close = "\x1B[49m", De.color.ansi = rv(), De.color.ansi256 = iv(), De.color.ansi16m = nv(), De.
  bgColor.ansi = rv(10), De.bgColor.ansi256 = iv(10), De.bgColor.ansi16m = nv(10), Object.defineProperties(De, {
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
s(Bk, "assembleStyles");
var Pk = Bk(), nt = Pk;

// ../node_modules/boxen/node_modules/chalk/source/vendor/supports-color/index.js
import $c from "node:process";
import Ik from "node:os";
import sv from "node:tty";
function Je(e, t = globalThis.Deno ? globalThis.Deno.args : $c.argv) {
  let r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", i = t.indexOf(r + e), n = t.indexOf("--");
  return i !== -1 && (n === -1 || i < n);
}
s(Je, "hasFlag");
var { env: we } = $c, Wo;
Je("no-color") || Je("no-colors") || Je("color=false") || Je("color=never") ? Wo = 0 : (Je("color") || Je("colors") || Je("color=true") || Je(
"color=always")) && (Wo = 1);
function Mk() {
  if ("FORCE_COLOR" in we)
    return we.FORCE_COLOR === "true" ? 1 : we.FORCE_COLOR === "false" ? 0 : we.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(we.FORCE_COLOR,
    10), 3);
}
s(Mk, "envForceColor");
function jk(e) {
  return e === 0 ? !1 : {
    level: e,
    hasBasic: !0,
    has256: e >= 2,
    has16m: e >= 3
  };
}
s(jk, "translateLevel");
function qk(e, { streamIsTTY: t, sniffFlags: r = !0 } = {}) {
  let i = Mk();
  i !== void 0 && (Wo = i);
  let n = r ? Wo : i;
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
  if ($c.platform === "win32") {
    let a = Ik.release().split(".");
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
s(qk, "_supportsColor");
function ov(e, t = {}) {
  let r = qk(e, {
    streamIsTTY: e && e.isTTY,
    ...t
  });
  return jk(r);
}
s(ov, "createSupportsColor");
var Lk = {
  stdout: ov({ isTTY: sv.isatty(1) }),
  stderr: ov({ isTTY: sv.isatty(2) })
}, av = Lk;

// ../node_modules/boxen/node_modules/chalk/source/utilities.js
function uv(e, t, r) {
  let i = e.indexOf(t);
  if (i === -1)
    return e;
  let n = t.length, o = 0, a = "";
  do
    a += e.slice(o, i) + t + r, o = i + n, i = e.indexOf(t, o);
  while (i !== -1);
  return a += e.slice(o), a;
}
s(uv, "stringReplaceAll");
function lv(e, t, r, i) {
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
s(lv, "stringEncaseCRLFWithFirstIndex");

// ../node_modules/boxen/node_modules/chalk/source/index.js
var { stdout: cv, stderr: dv } = av, Wc = Symbol("GENERATOR"), Si = Symbol("STYLER"), $n = Symbol("IS_EMPTY"), fv = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
], Ti = /* @__PURE__ */ Object.create(null), Nk = /* @__PURE__ */ s((e, t = {}) => {
  if (t.level && !(Number.isInteger(t.level) && t.level >= 0 && t.level <= 3))
    throw new Error("The `level` option should be an integer from 0 to 3");
  let r = cv ? cv.level : 0;
  e.level = t.level === void 0 ? r : t.level;
}, "applyOptions");
var Uk = /* @__PURE__ */ s((e) => {
  let t = /* @__PURE__ */ s((...r) => r.join(" "), "chalk");
  return Nk(t, e), Object.setPrototypeOf(t, Wn.prototype), t;
}, "chalkFactory");
function Wn(e) {
  return Uk(e);
}
s(Wn, "createChalk");
Object.setPrototypeOf(Wn.prototype, Function.prototype);
for (let [e, t] of Object.entries(nt))
  Ti[e] = {
    get() {
      let r = Ho(this, Vc(t.open, t.close, this[Si]), this[$n]);
      return Object.defineProperty(this, e, { value: r }), r;
    }
  };
Ti.visible = {
  get() {
    let e = Ho(this, this[Si], !0);
    return Object.defineProperty(this, "visible", { value: e }), e;
  }
};
var Hc = /* @__PURE__ */ s((e, t, r, ...i) => e === "rgb" ? t === "ansi16m" ? nt[r].ansi16m(...i) : t === "ansi256" ? nt[r].ansi256(nt.rgbToAnsi256(
...i)) : nt[r].ansi(nt.rgbToAnsi(...i)) : e === "hex" ? Hc("rgb", t, r, ...nt.hexToRgb(...i)) : nt[r][e](...i), "getModelAnsi"), $k = ["rgb",
"hex", "ansi256"];
for (let e of $k) {
  Ti[e] = {
    get() {
      let { level: r } = this;
      return function(...i) {
        let n = Vc(Hc(e, fv[r], "color", ...i), nt.color.close, this[Si]);
        return Ho(this, n, this[$n]);
      };
    }
  };
  let t = "bg" + e[0].toUpperCase() + e.slice(1);
  Ti[t] = {
    get() {
      let { level: r } = this;
      return function(...i) {
        let n = Vc(Hc(e, fv[r], "bgColor", ...i), nt.bgColor.close, this[Si]);
        return Ho(this, n, this[$n]);
      };
    }
  };
}
var Wk = Object.defineProperties(() => {
}, {
  ...Ti,
  level: {
    enumerable: !0,
    get() {
      return this[Wc].level;
    },
    set(e) {
      this[Wc].level = e;
    }
  }
}), Vc = /* @__PURE__ */ s((e, t, r) => {
  let i, n;
  return r === void 0 ? (i = e, n = t) : (i = r.openAll + e, n = t + r.closeAll), {
    open: e,
    close: t,
    openAll: i,
    closeAll: n,
    parent: r
  };
}, "createStyler"), Ho = /* @__PURE__ */ s((e, t, r) => {
  let i = /* @__PURE__ */ s((...n) => Hk(i, n.length === 1 ? "" + n[0] : n.join(" ")), "builder");
  return Object.setPrototypeOf(i, Wk), i[Wc] = e, i[Si] = t, i[$n] = r, i;
}, "createBuilder"), Hk = /* @__PURE__ */ s((e, t) => {
  if (e.level <= 0 || !t)
    return e[$n] ? "" : t;
  let r = e[Si];
  if (r === void 0)
    return t;
  let { openAll: i, closeAll: n } = r;
  if (t.includes("\x1B"))
    for (; r !== void 0; )
      t = uv(t, r.close, r.open), r = r.parent;
  let o = t.indexOf(`
`);
  return o !== -1 && (t = lv(t, n, i, o)), i + t + n;
}, "applyStyle");
Object.defineProperties(Wn.prototype, Ti);
var Vk = Wn(), ZL = Wn({ level: dv ? dv.level : 0 });
var Sr = Vk;

// ../node_modules/boxen/node_modules/widest-line/index.js
function Vo(e) {
  let t = 0;
  for (let r of e.split(`
`))
    t = Math.max(t, Ye(r));
  return t;
}
s(Vo, "widestLine");

// ../node_modules/boxen/index.js
var Hv = Ae(zc(), 1);

// ../node_modules/boxen/node_modules/camelcase/index.js
var zk = /[\p{Lu}]/u, Gk = /[\p{Ll}]/u, Dv = /^[\p{Lu}](?![\p{Lu}])/gu, yv = /([\p{Alpha}\p{N}_]|$)/u, Gc = /[_.\- ]+/, Kk = new RegExp("^" +
Gc.source), mv = new RegExp(Gc.source + yv.source, "gu"), gv = new RegExp("\\d+" + yv.source, "gu"), Yk = /* @__PURE__ */ s((e, t, r, i) => {
  let n = !1, o = !1, a = !1, u = !1;
  for (let l = 0; l < e.length; l++) {
    let c = e[l];
    u = l > 2 ? e[l - 3] === "-" : !0, n && zk.test(c) ? (e = e.slice(0, l) + "-" + e.slice(l), n = !1, a = o, o = !0, l++) : o && a && Gk.test(
    c) && (!u || i) ? (e = e.slice(0, l - 1) + "-" + e.slice(l - 1), a = o, o = !1, n = !0) : (n = t(c) === c && r(c) !== c, a = o, o = r(c) ===
    c && t(c) !== c);
  }
  return e;
}, "preserveCamelCase"), Jk = /* @__PURE__ */ s((e, t) => (Dv.lastIndex = 0, e.replace(Dv, (r) => t(r))), "preserveConsecutiveUppercase"), Xk = /* @__PURE__ */ s(
(e, t) => (mv.lastIndex = 0, gv.lastIndex = 0, e.replace(mv, (r, i) => t(i)).replace(gv, (r) => t(r))), "postProcess");
function Kc(e, t) {
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
  return e.length === 1 ? Gc.test(e) ? "" : t.pascalCase ? i(e) : r(e) : (e !== r(e) && (e = Yk(e, r, i, t.preserveConsecutiveUppercase)), e =
  e.replace(Kk, ""), e = t.preserveConsecutiveUppercase ? Jk(e, r) : r(e), t.pascalCase && (e = i(e.charAt(0)) + e.slice(1)), Xk(e, i));
}
s(Kc, "camelCase");

// ../node_modules/boxen/index.js
var td = Ae(Rv(), 1);

// ../node_modules/wrap-ansi/node_modules/string-width/index.js
var kv = Ae(Nc(), 1), Ov = Ae(Uc(), 1);
function Ar(e, t = {}) {
  if (typeof e != "string" || e.length === 0 || (t = {
    ambiguousIsNarrow: !0,
    ...t
  }, e = Fr(e), e.length === 0))
    return 0;
  e = e.replace((0, Ov.default)(), "  ");
  let r = t.ambiguousIsNarrow ? 1 : 2, i = 0;
  for (let n of e) {
    let o = n.codePointAt(0);
    if (o <= 31 || o >= 127 && o <= 159 || o >= 768 && o <= 879)
      continue;
    switch (kv.default.eastAsianWidth(n)) {
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
s(Ar, "stringWidth");

// ../node_modules/wrap-ansi/node_modules/ansi-styles/index.js
var Bv = /* @__PURE__ */ s((e = 0) => (t) => `\x1B[${t + e}m`, "wrapAnsi16"), Pv = /* @__PURE__ */ s((e = 0) => (t) => `\x1B[${38 + e};5;${t}\
m`, "wrapAnsi256"), Iv = /* @__PURE__ */ s((e = 0) => (t, r, i) => `\x1B[${38 + e};2;${t};${r};${i}m`, "wrapAnsi16m"), me = {
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
}, p4 = Object.keys(me.modifier), oO = Object.keys(me.color), aO = Object.keys(me.bgColor), D4 = [...oO, ...aO];
function uO() {
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
  }), me.color.close = "\x1B[39m", me.bgColor.close = "\x1B[49m", me.color.ansi = Bv(), me.color.ansi256 = Pv(), me.color.ansi16m = Iv(), me.
  bgColor.ansi = Bv(10), me.bgColor.ansi256 = Pv(10), me.bgColor.ansi16m = Iv(10), Object.defineProperties(me, {
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
s(uO, "assembleStyles");
var lO = uO(), Mv = lO;

// ../node_modules/wrap-ansi/index.js
var Zo = /* @__PURE__ */ new Set([
  "\x1B",
  "\x9B"
]), cO = 39, Qc = "\x07", Lv = "[", dO = "]", Nv = "m", ed = `${dO}8;;`, jv = /* @__PURE__ */ s((e) => `${Zo.values().next().value}${Lv}${e}${Nv}`,
"wrapAnsiCode"), qv = /* @__PURE__ */ s((e) => `${Zo.values().next().value}${ed}${e}${Qc}`, "wrapAnsiHyperlink"), fO = /* @__PURE__ */ s((e) => e.
split(" ").map((t) => Ar(t)), "wordLengths"), Xc = /* @__PURE__ */ s((e, t, r) => {
  let i = [...t], n = !1, o = !1, a = Ar(Fr(e[e.length - 1]));
  for (let [u, l] of i.entries()) {
    let c = Ar(l);
    if (a + c <= r ? e[e.length - 1] += l : (e.push(l), a = 0), Zo.has(l) && (n = !0, o = i.slice(u + 1).join("").startsWith(ed)), n) {
      o ? l === Qc && (n = !1, o = !1) : l === Nv && (n = !1);
      continue;
    }
    a += c, a === r && u < i.length - 1 && (e.push(""), a = 0);
  }
  !a && e[e.length - 1].length > 0 && e.length > 1 && (e[e.length - 2] += e.pop());
}, "wrapWord"), hO = /* @__PURE__ */ s((e) => {
  let t = e.split(" "), r = t.length;
  for (; r > 0 && !(Ar(t[r - 1]) > 0); )
    r--;
  return r === t.length ? e : t.slice(0, r).join(" ") + t.slice(r).join("");
}, "stringVisibleTrimSpacesRight"), pO = /* @__PURE__ */ s((e, t, r = {}) => {
  if (r.trim !== !1 && e.trim() === "")
    return "";
  let i = "", n, o, a = fO(e), u = [""];
  for (let [c, d] of e.split(" ").entries()) {
    r.trim !== !1 && (u[u.length - 1] = u[u.length - 1].trimStart());
    let p = Ar(u[u.length - 1]);
    if (c !== 0 && (p >= t && (r.wordWrap === !1 || r.trim === !1) && (u.push(""), p = 0), (p > 0 || r.trim === !1) && (u[u.length - 1] += "\
 ", p++)), r.hard && a[c] > t) {
      let h = t - p, f = 1 + Math.floor((a[c] - h - 1) / t);
      Math.floor((a[c] - 1) / t) < f && u.push(""), Xc(u, d, t);
      continue;
    }
    if (p + a[c] > t && p > 0 && a[c] > 0) {
      if (r.wordWrap === !1 && p < t) {
        Xc(u, d, t);
        continue;
      }
      u.push("");
    }
    if (p + a[c] > t && r.wordWrap === !1) {
      Xc(u, d, t);
      continue;
    }
    u[u.length - 1] += d;
  }
  r.trim !== !1 && (u = u.map((c) => hO(c)));
  let l = [...u.join(`
`)];
  for (let [c, d] of l.entries()) {
    if (i += d, Zo.has(d)) {
      let { groups: h } = new RegExp(`(?:\\${Lv}(?<code>\\d+)m|\\${ed}(?<uri>.*)${Qc})`).exec(l.slice(c).join("")) || { groups: {} };
      if (h.code !== void 0) {
        let f = Number.parseFloat(h.code);
        n = f === cO ? void 0 : f;
      } else h.uri !== void 0 && (o = h.uri.length === 0 ? void 0 : h.uri);
    }
    let p = Mv.codes.get(Number(n));
    l[c + 1] === `
` ? (o && (i += qv("")), n && p && (i += jv(p))) : d === `
` && (n && p && (i += jv(n)), o && (i += qv(o)));
  }
  return i;
}, "exec");
function zo(e, t, r) {
  return String(e).normalize().replace(/\r\n/g, `
`).split(`
`).map((i) => pO(i, t, r)).join(`
`);
}
s(zo, "wrapAnsi");

// ../node_modules/boxen/index.js
var EO = Ae(zc(), 1);
var nr = `
`, Le = " ", Hn = "none", Vv = /* @__PURE__ */ s(() => {
  let { env: e, stdout: t, stderr: r } = Go;
  return t?.columns ? t.columns : r?.columns ? r.columns : e.COLUMNS ? Number.parseInt(e.COLUMNS, 10) : 80;
}, "terminalColumns"), Uv = /* @__PURE__ */ s((e) => typeof e == "number" ? {
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
}, "getObject"), Vn = /* @__PURE__ */ s((e) => e === Hn ? 0 : 2, "getBorderWidth"), DO = /* @__PURE__ */ s((e) => {
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
  if (e === Hn) {
    e = {};
    for (let i of t)
      e[i] = "";
  }
  if (typeof e == "string") {
    if (r = Hv.default[e], !r)
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
}, "getBorderChars"), mO = /* @__PURE__ */ s((e, t, r) => {
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
}, "makeTitle"), gO = /* @__PURE__ */ s((e, { padding: t, width: r, textAlignment: i, height: n }) => {
  e = (0, td.default)(e, { align: i });
  let o = e.split(nr), a = Vo(e), u = r - t.left - t.right;
  if (a > u) {
    let d = [];
    for (let p of o) {
      let h = zo(p, u, { hard: !0 }), g = (0, td.default)(h, { align: i }).split(`
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
  fill(Le.repeat(r))]), o.join(nr);
}, "makeContentText"), yO = /* @__PURE__ */ s((e, t, r) => {
  let i = /* @__PURE__ */ s((d) => {
    let p = r.borderColor ? _O(r.borderColor)(d) : d;
    return r.dimBorder ? Sr.dim(p) : p;
  }, "colorizeBorder"), n = /* @__PURE__ */ s((d) => r.backgroundColor ? wO(r.backgroundColor)(d) : d, "colorizeContent"), o = DO(r.borderStyle),
  a = Vv(), u = Le.repeat(r.margin.left);
  if (r.float === "center") {
    let d = Math.max((a - t - Vn(r.borderStyle)) / 2, 0);
    u = Le.repeat(d);
  } else if (r.float === "right") {
    let d = Math.max(a - t - r.margin.right - Vn(r.borderStyle), 0);
    u = Le.repeat(d);
  }
  let l = "";
  r.margin.top && (l += nr.repeat(r.margin.top)), (r.borderStyle !== Hn || r.title) && (l += i(u + o.topLeft + (r.title ? mO(r.title, o.top.
  repeat(t), r.titleAlignment) : o.top.repeat(t)) + o.topRight) + nr);
  let c = e.split(nr);
  return l += c.map((d) => u + i(o.left) + n(d) + i(o.right)).join(nr), r.borderStyle !== Hn && (l += nr + i(u + o.bottomLeft + o.bottom.repeat(
  t) + o.bottomRight)), r.margin.bottom && (l += nr.repeat(r.margin.bottom)), l;
}, "boxContent"), bO = /* @__PURE__ */ s((e) => {
  if (e.fullscreen && Go?.stdout) {
    let t = [Go.stdout.columns, Go.stdout.rows];
    typeof e.fullscreen == "function" && (t = e.fullscreen(...t)), e.width || (e.width = t[0]), e.height || (e.height = t[1]);
  }
  return e.width && (e.width = Math.max(1, e.width - Vn(e.borderStyle))), e.height && (e.height = Math.max(1, e.height - Vn(e.borderStyle))),
  e;
}, "sanitizeOptions"), $v = /* @__PURE__ */ s((e, t) => t === Hn ? e : ` ${e} `, "formatTitle"), vO = /* @__PURE__ */ s((e, t) => {
  t = bO(t);
  let r = t.width !== void 0, i = Vv(), n = Vn(t.borderStyle), o = i - t.margin.left - t.margin.right - n, a = Vo(zo(e, i - n, { hard: !0, trim: !1 })) +
  t.padding.left + t.padding.right;
  if (t.title && r ? (t.title = t.title.slice(0, Math.max(0, t.width - 2)), t.title && (t.title = $v(t.title, t.borderStyle))) : t.title && (t.
  title = t.title.slice(0, Math.max(0, o - 2)), t.title && (t.title = $v(t.title, t.borderStyle), Ye(t.title) > a && (t.width = Ye(t.title)))),
  t.width = t.width ? t.width : a, !r) {
    if (t.margin.left && t.margin.right && t.width > o) {
      let l = (i - t.width - n) / (t.margin.left + t.margin.right);
      t.margin.left = Math.max(0, Math.floor(t.margin.left * l)), t.margin.right = Math.max(0, Math.floor(t.margin.right * l));
    }
    t.width = Math.min(t.width, i - n - t.margin.left - t.margin.right);
  }
  return t.width - (t.padding.left + t.padding.right) <= 0 && (t.padding.left = 0, t.padding.right = 0), t.height && t.height - (t.padding.top +
  t.padding.bottom) <= 0 && (t.padding.top = 0, t.padding.bottom = 0), t;
}, "determineDimensions"), rd = /* @__PURE__ */ s((e) => e.match(/^#(?:[0-f]{3}){1,2}$/i), "isHex"), Wv = /* @__PURE__ */ s((e) => typeof e ==
"string" && (Sr[e] ?? rd(e)), "isColorValid"), _O = /* @__PURE__ */ s((e) => rd(e) ? Sr.hex(e) : Sr[e], "getColorFn"), wO = /* @__PURE__ */ s(
(e) => rd(e) ? Sr.bgHex(e) : Sr[Kc(["bg", e])], "getBGColorFn");
function id(e, t) {
  if (t = {
    padding: 0,
    borderStyle: "single",
    dimBorder: !1,
    textAlignment: "left",
    float: "left",
    titleAlignment: "left",
    ...t
  }, t.align && (t.textAlignment = t.align), t.borderColor && !Wv(t.borderColor))
    throw new Error(`${t.borderColor} is not a valid borderColor`);
  if (t.backgroundColor && !Wv(t.backgroundColor))
    throw new Error(`${t.backgroundColor} is not a valid backgroundColor`);
  return t.padding = Uv(t.padding), t.margin = Uv(t.margin), t = vO(e, t), e = gO(e, t), yO(e, t.width, t);
}
s(id, "boxen");

// src/cli/angular/helpers.ts
var nd = Ae(gs(), 1), sd = Ae(Ko(), 1);
var Yo = "angular.json", q4 = sd.dedent`
  import { setCompodocJson } from "@storybook/addon-docs/angular";
  import docJson from "../documentation.json";
  setCompodocJson(docJson);
`.trimStart(), L4 = /* @__PURE__ */ s(async () => {
  TO.plain(
    // Create a text which explains the user why compodoc is necessary
    id(
      sd.dedent`
      Compodoc is a great tool to generate documentation for your Angular projects.
      Storybook can use the documentation generated by Compodoc to extract argument definitions
      and JSDOC comments to display them in the Storybook UI. We highly recommend using Compodoc for
      your Angular projects to get the best experience out of Storybook.
    `,
      { title: "Compodoc", borderStyle: "round", padding: 1, borderColor: "#F1618C" }
    )
  );
  let { useCompoDoc: e } = await (0, nd.default)({
    type: "confirm",
    name: "useCompoDoc",
    message: "Do you want to use Compodoc for documentation?"
  });
  return e;
}, "promptForCompoDocs"), zv = class {
  static {
    s(this, "AngularJSON");
  }
  constructor() {
    if (!CO(Yo))
      throw new AO({ path: SO(process.cwd(), Yo) });
    let t = xO(Yo, "utf8");
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
      let { projectName: t } = await (0, nd.default)({
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
    FO(Yo, JSON.stringify(this.json, null, 2));
  }
};

// src/cli/eslintPlugin.ts
import { existsSync as Yv } from "node:fs";
import { readFile as Jv, writeFile as IO } from "node:fs/promises";
import { paddedLog as Xv } from "@storybook/core/common";
import { readConfig as MO, writeConfig as jO } from "@storybook/core/csf-tools";

// ../node_modules/detect-indent/index.js
var RO = /^(?:( )+|\t+)/, zn = "space", Kv = "tab";
function Gv(e, t) {
  let r = /* @__PURE__ */ new Map(), i = 0, n, o;
  for (let a of e.split(/\n/g)) {
    if (!a)
      continue;
    let u, l, c, d, p, h = a.match(RO);
    if (h === null)
      i = 0, n = "";
    else {
      if (u = h[0].length, l = h[1] ? zn : Kv, t && l === zn && u === 1)
        continue;
      l !== n && (i = 0), n = l, c = 1, d = 0;
      let f = u - i;
      if (i = u, f === 0)
        c = 0, d = 1;
      else {
        let g = f > 0 ? f : -f;
        o = kO(l, g);
      }
      p = r.get(o), p = p === void 0 ? [1, 0] : [p[0] + c, p[1] + d], r.set(o, p);
    }
  }
  return r;
}
s(Gv, "makeIndentsMap");
function kO(e, t) {
  return (e === zn ? "s" : "t") + String(t);
}
s(kO, "encodeIndentsKey");
function OO(e) {
  let r = e[0] === "s" ? zn : Kv, i = Number(e.slice(1));
  return { type: r, amount: i };
}
s(OO, "decodeIndentsKey");
function BO(e) {
  let t, r = 0, i = 0;
  for (let [n, [o, a]] of e)
    (o > r || o === r && a > i) && (r = o, i = a, t = n);
  return t;
}
s(BO, "getMostUsedKey");
function PO(e, t) {
  return (e === zn ? " " : "	").repeat(t);
}
s(PO, "makeIndentString");
function od(e) {
  if (typeof e != "string")
    throw new TypeError("Expected a string");
  let t = Gv(e, !0);
  t.size === 0 && (t = Gv(e, !1));
  let r = BO(t), i, n = 0, o = "";
  return r !== void 0 && ({ type: i, amount: n } = OO(r), o = PO(i, n)), {
    amount: n,
    type: i,
    indent: o
  };
}
s(od, "detectIndent");

// src/cli/eslintPlugin.ts
var Qv = Ae(Eu(), 1), e_ = Ae(gs(), 1), t_ = Ae(Ko(), 1);
var qO = ["js", "cjs", "json"], LO = ["yaml", "yml"], NO = /* @__PURE__ */ s(() => {
  let e = ".eslintrc", t = LO.find(
    (i) => Yv(`${e}.${i}`)
  );
  if (t)
    throw new Error(t);
  let r = qO.find(
    (i) => Yv(`${e}.${i}`)
  );
  return r ? `${e}.${r}` : null;
}, "findEslintFile");
async function K4(e) {
  let t = await e.getAllDependencies(), r = await e.retrievePackageJson(), i = null;
  try {
    i = NO();
  } catch {
  }
  let n = !!t["eslint-plugin-storybook"];
  return { hasEslint: t.eslint || i || r.eslintConfig, isStorybookPluginInstalled: n, eslintConfigFile: i };
}
s(K4, "extractEslintInfo");
var ad = /* @__PURE__ */ s((e) => {
  if (!e)
    return [];
  if (typeof e == "string")
    return [e];
  if (Array.isArray(e))
    return e;
  throw new Error(`Invalid eslint extends ${e}`);
}, "normalizeExtends");
async function Y4(e, t) {
  if (e)
    if (Xv(`Configuring Storybook ESLint plugin at ${e}`), e.endsWith("json")) {
      let r = JSON.parse(await Jv(e, { encoding: "utf8" })), i = ad(r.extends).filter(Boolean);
      r.extends = [...i, "plugin:storybook/recommended"];
      let n = await Jv(e, { encoding: "utf8" }), o = od(n).amount || 2;
      await IO(e, JSON.stringify(r, void 0, o));
    } else {
      let r = await MO(e), i = ad(r.getFieldValue(["extends"])).filter(Boolean);
      r.setFieldValue(["extends"], [...i, "plugin:storybook/recommended"]), await jO(r);
    }
  else {
    Xv("Configuring eslint-plugin-storybook in your package.json");
    let r = await t.retrievePackageJson(), i = ad(r.eslintConfig?.extends).filter(Boolean);
    await t.writePackageJson({
      ...r,
      eslintConfig: {
        ...r.eslintConfig,
        extends: [...i, "plugin:storybook/recommended"]
      }
    });
  }
}
s(Y4, "configureEslintPlugin");
var J4 = /* @__PURE__ */ s(async () => {
  let { shouldInstall: e } = await (0, e_.default)({
    type: "confirm",
    name: "shouldInstall",
    message: t_.dedent`
        We have detected that you're using ESLint. Storybook provides a plugin that gives the best experience with Storybook and helps follow best practices: ${Qv.default.
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
var Mi = Ae(x_(), 1);
import md from "node:fs/promises";
import { homedir as u8 } from "node:os";
import { dirname as l8, join as c8 } from "node:path";

// src/server-errors.ts
var S_ = Ae(Ko(), 1);

// src/storybook-error.ts
function F_({
  code: e,
  category: t
}) {
  let r = String(e).padStart(4, "0");
  return `SB_${t}_${r}`;
}
s(F_, "parseErrorCode");
var sa = class e extends Error {
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
    return F_({ code: this.code, category: this.category });
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
    return r === !0 ? a = `https://storybook.js.org/error/${F_({ code: i, category: n })}` : typeof r == "string" ? a = r : Array.isArray(r) &&
    (a = `
${r.map((u) => `	- ${u}`).join(`
`)}`), `${o}${a != null ? `

More info: ${a}
` : ""}`;
  }
};

// src/server-errors.ts
var oa = class extends sa {
  constructor(r) {
    super({
      category: "CORE-SERVER",
      code: 1,
      message: S_.dedent`
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
var d8 = c8(u8(), ".storybook", "settings.json"), f8 = 1, h8 = Mi.z.object({
  version: Mi.z.number(),
  // NOTE: every key (and subkey) below must be optional, for forwards compatibility reasons
  // (we can remove keys once they are deprecated)
  userSince: Mi.z.number().optional(),
  init: Mi.z.object({ skipOnboarding: Mi.z.boolean().optional() }).optional()
}), Zr;
async function SN(e = d8) {
  if (Zr)
    return Zr;
  try {
    let t = await md.readFile(e, "utf8"), r = h8.parse(JSON.parse(t));
    Zr = new aa(e, r);
  } catch {
    Zr = new aa(e, { version: f8, userSince: Date.now() }), await Zr.save();
  }
  return Zr;
}
s(SN, "globalSettings");
function TN() {
  Zr = void 0;
}
s(TN, "_clearGlobalSettings");
var aa = class {
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
      await md.mkdir(l8(this.filePath), { recursive: !0 }), await md.writeFile(this.filePath, JSON.stringify(this.value, null, 2));
    } catch (t) {
      throw new oa({
        filePath: this.filePath,
        error: t
      });
    }
  }
};
export {
  Yo as ANGULAR_JSON_PATH,
  zv as AngularJSON,
  tk as CommunityBuilder,
  N0 as CoreBuilder,
  ek as CoreWebpackCompilers,
  Pc as ProjectType,
  qO as SUPPORTED_ESLINT_EXTENSIONS,
  Fq as SUPPORTED_RENDERERS,
  aa as Settings,
  U0 as SupportedLanguage,
  TN as _clearGlobalSettings,
  Jq as addToDevDependenciesIfNotPresent,
  vk as adjustTemplate,
  Tq as builderNameToCoreBuilder,
  bk as cliStoriesTargetPath,
  rL as coerceSemver,
  Sq as compilerNameToCoreCompiler,
  q4 as compoDocPreviewPrefix,
  Y4 as configureEslintPlugin,
  Xq as copyTemplate,
  eL as copyTemplateFiles,
  yL as detect,
  pL as detectBuilder,
  Ak as detectFrameworkPreset,
  gL as detectLanguage,
  mL as detectPnp,
  L0 as externalFrameworks,
  K4 as extractEslintInfo,
  NO as findEslintFile,
  Qq as frameworkToDefaultBuilder,
  gk as frameworkToRenderer,
  Yq as getBabelDependencies,
  V0 as getRendererDir,
  tL as getStorybookVersionSpecifier,
  yk as getVersionSafe,
  SN as globalSettings,
  iL as hasStorybookDependencies,
  Aq as installableProjectTypes,
  K0 as isNxProject,
  DL as isStorybookInstantiated,
  ad as normalizeExtends,
  L4 as promptForCompoDocs,
  Gq as readFileAsJson,
  J4 as suggestESLintPlugin,
  $0 as supportedTemplates,
  W0 as unsupportedTemplate,
  Kq as writeFileAsJson
};
