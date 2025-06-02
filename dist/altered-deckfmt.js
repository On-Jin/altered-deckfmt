var Zt = Object.defineProperty;
var Jt = (d, i, s) => i in d ? Zt(d, i, { enumerable: !0, configurable: !0, writable: !0, value: s }) : d[i] = s;
var B = (d, i, s) => Jt(d, typeof i != "symbol" ? i + "" : i, s);
var K = /* @__PURE__ */ ((d) => (d.Booster = "B", d.Promo = "P", d.AltArt = "A", d))(K || {}), $ = /* @__PURE__ */ ((d) => (d.Axiom = "AX", d.Bravos = "BR", d.Lyra = "LY", d.Muna = "MU", d.Ordis = "OR", d.Yzmir = "YZ", d.Neutral = "NE", d))($ || {}), Q = /* @__PURE__ */ ((d) => (d.Common = "C", d.Rare = "R1", d.RareOOF = "R2", d.Unique = "U", d))(Q || {}), Y = /* @__PURE__ */ ((d) => (d.CoreKS = "COREKS", d.Core = "CORE", d.Alize = "ALIZE", d.Bise = "BISE", d))(Y || {});
const st = {
  1: 5,
  // CoreKS range 0-31
  2: 5,
  // Core   range 0-31
  3: 6,
  // Alize  range 0-63
  4: 6
  // Bise   range 0-63
};
class Ft {
  constructor(i) {
    B(this, "set_code");
    B(this, "product");
    B(this, "faction");
    B(this, "num_in_faction");
    B(this, "rarity");
    B(this, "uniq_num");
    const s = i.match(/^ALT_(\w+)_(A|B|P)_(\w{2})_(\d{1,2})_(C|R1|R2|U)(?:_(\d+))?$/);
    if (!s)
      throw "unrecognized card id";
    if (this.set_code = s[1], this.product = s[2], this.faction = s[3], this.num_in_faction = parseInt(s[4], 10), this.rarity = s[5], this.uniq_num = s[6] ? parseInt(s[6]) : void 0, this.rarity == "U" && this.uniq_num == null)
      throw "unique card is missing a unique_number";
  }
  get productId() {
    switch (this.product) {
      case "B":
        return null;
      case "P":
        return 1;
      case "A":
        return 2;
    }
  }
  get factionId() {
    switch (this.faction) {
      case "AX":
        return 1;
      case "BR":
        return 2;
      case "LY":
        return 3;
      case "MU":
        return 4;
      case "OR":
        return 5;
      case "YZ":
        return 6;
      case "NE":
        return 7;
    }
    throw `Unrecognized Faction ${this.faction}`;
  }
  get rarityId() {
    switch (this.rarity) {
      case "C":
        return 0;
      case "R1":
        return 1;
      case "R2":
        return 2;
      case "U":
        return 3;
    }
    throw `Unrecognized Rarity ${this.rarity}`;
  }
  get setId() {
    switch (this.set_code) {
      case "COREKS":
        return 1;
      case "CORE":
        return 2;
      case "ALIZE":
        return 3;
      case "BISE":
        return 4;
    }
    throw `Unrecognized SetCode ${this.set_code}`;
  }
}
class H {
  constructor() {
    B(this, "setCode");
    B(this, "product");
    B(this, "faction");
    B(this, "numberInFaction");
    B(this, "rarity");
    B(this, "uniqueId");
  }
  static decode(i, s) {
    const u = new H();
    if (s.setCode === void 0)
      throw new D("Tried to decode Card without SetCode in context");
    if (u.setCode = s.setCode, i.readSync(1) == 1)
      u.product = null;
    else if (u.product = i.readSync(2), u.product == 0 || u.product == 3)
      throw new D(`Invalid product ID (${u.product})`);
    if (u.faction = i.readSync(3), u.faction == 0)
      throw new D(`Invalid faction ID (${u.faction})`);
    const a = st[u.setCode];
    if (a == null)
      throw new D(`Invalid set code (${u.setCode}) @${i.offset}`);
    return u.numberInFaction = i.readSync(a), u.rarity = i.readSync(2), u.rarity == 3 && (u.uniqueId = i.readSync(16)), u;
  }
  encode(i) {
    this.product == null ? i.write(1, 1) : (i.write(1, 0), i.write(2, this.product)), i.write(3, this.faction);
    const s = st[this.setCode];
    if (s == null)
      throw new Z(`Invalid set code (${this.setCode})`);
    if (i.write(s, this.numberInFaction), i.write(2, this.rarity), this.uniqueId !== void 0) {
      if (this.uniqueId > 65535)
        throw new Z("Cannot encode unique ID greater than 65535");
      i.write(16, this.uniqueId);
    }
  }
  get asCardId() {
    let i = "ALT_";
    switch (this.setCode) {
      case 1:
        i += Y.CoreKS;
        break;
      case 2:
        i += Y.Core;
        break;
      case 3:
        i += Y.Alize;
        break;
      case 4:
        i += Y.Bise;
        break;
    }
    switch (i += "_", this.product) {
      case null:
        i += K.Booster;
        break;
      case 1:
        i += K.Promo;
        break;
      case 2:
        i += K.AltArt;
        break;
    }
    switch (i += "_", this.faction) {
      case 1:
        i += $.Axiom;
        break;
      case 2:
        i += $.Bravos;
        break;
      case 3:
        i += $.Lyra;
        break;
      case 4:
        i += $.Muna;
        break;
      case 5:
        i += $.Ordis;
        break;
      case 6:
        i += $.Yzmir;
        break;
      case 7:
        i += $.Neutral;
        break;
    }
    switch (i += "_", this.numberInFaction < 10 && !(this.faction == 7 && (this.setCode == 1 || this.setCode == 2)) && (i += "0"), i += this.numberInFaction, i += "_", this.rarity) {
      case 0:
        i += Q.Common;
        break;
      case 1:
        i += Q.Rare;
        break;
      case 2:
        i += Q.RareOOF;
        break;
      case 3:
        i += Q.Unique + "_" + this.uniqueId;
        break;
    }
    return i;
  }
  static fromId(i) {
    let s = new H(), u = new Ft(i);
    return s.setCode = u.setId, s.product = u.productId, s.faction = u.factionId, s.numberInFaction = u.num_in_faction, s.rarity = u.rarityId, s.uniqueId = u.uniq_num, s;
  }
}
class V {
  constructor() {
    B(this, "quantity");
    // VLE: 2 (+6) bits
    B(this, "card");
  }
  static decode(i, s) {
    const u = new V(), c = i.readSync(2);
    if (c > 0)
      u.quantity = c;
    else {
      const a = i.readSync(6);
      u.quantity = a == 0 ? 0 : a + 3;
    }
    return u.card = H.decode(i, s), u;
  }
  encode(i) {
    if (this.quantity > 0 && this.quantity <= 3)
      i.write(2, this.quantity);
    else if (this.quantity > 3) {
      if (this.quantity > 65)
        throw new Z(`Cannot encode card quantity (${this.quantity}) greater than 65`);
      i.write(2, 0), i.write(6, this.quantity - 3);
    } else
      i.write(8, 0);
    this.card.encode(i);
  }
  get asCardRefQty() {
    return {
      quantity: this.quantity,
      id: this.card.asCardId
    };
  }
  static from(i, s) {
    let u = new V();
    return u.quantity = i, u.card = H.fromId(s), u;
  }
}
class G {
  constructor() {
    B(this, "setCode");
    // 8 bits
    B(this, "cardQty");
  }
  // count: 6 bits
  static decode(i, s) {
    const u = new G();
    if (u.setCode = i.readSync(8), !G.isValidSetCode(u.setCode))
      throw new D(`Invalid SetCode ID (${u.setCode}) @offset=${i.offset}`);
    s.setCode = u.setCode;
    const c = i.readSync(6), a = new Array();
    for (let p = 0; p < c; p++)
      a.push(V.decode(i, s));
    return u.cardQty = a, s.setCode = void 0, u;
  }
  encode(i) {
    if (this.cardQty.length <= 0)
      throw new Z("Cannot encode a SetGroup with 0 cards");
    const s = this.cardQty[0].card.setCode;
    i.write(8, s), i.write(6, this.cardQty.length);
    for (let u of this.cardQty)
      u.encode(i);
  }
  static from(i) {
    let s = new G();
    return s.cardQty = i.map((u) => V.from(u.quantity, u.id)), s;
  }
  static isValidSetCode(i) {
    return st[i] !== void 0;
  }
}
class z {
  constructor() {
    B(this, "version");
    // 4 bits
    B(this, "setGroups");
  }
  // count: 8 bits
  static decode(i) {
    const s = new z(), u = new te();
    if (s.version = i.readSync(4), s.version !== 1)
      throw new D(`Invalid version (${s.version}`);
    const c = i.readSync(8), a = new Array();
    for (let p = 0; p < c; p++)
      a.push(G.decode(i, u));
    return s.setGroups = a, s;
  }
  encode(i) {
    i.write(4, this.version), i.write(8, this.setGroups.length);
    for (let s of this.setGroups)
      s.encode(i);
    if (i.offset % 8 > 0) {
      const s = 8 - i.offset % 8;
      i.write(s, 0);
    }
  }
  get asCardRefQty() {
    return this.setGroups.reduce((i, s) => i.concat(s.cardQty.map((u) => u.asCardRefQty)), Array());
  }
  static fromList(i) {
    const s = z.groupedBySet(i).map((c) => vt(c, 63).map((p) => G.from(p)));
    let u = new z();
    return console.log("Groups: ", s.map((c) => `len=${c.length} ${c.map((a) => a.cardQty.length).join(",")}`).join(" ; ")), u.version = 1, u.setGroups = s.flat(), u;
  }
  static groupedBySet(i) {
    let s = /* @__PURE__ */ new Map();
    for (let u of i) {
      const c = new Ft(u.id).set_code;
      let a = s.get(c);
      a || (a = [], s.set(c, a)), a.push(u);
    }
    return Array.from(s, ([u, c]) => c);
  }
}
function vt(d, i) {
  let s = [];
  for (let u = 0; u < d.length; u += i)
    s.push(d.slice(u, u + i));
  return s;
}
class te {
  constructor() {
    B(this, "setCode");
  }
}
class D extends Error {
  constructor(i) {
    super(i), this.name = "DecodingError";
  }
}
class Z extends Error {
  constructor(i) {
    super(i), this.name = "EncodingError";
  }
}
var J = {}, v = {};
v.byteLength = ie;
v.toByteArray = se;
v.fromByteArray = ue;
var L = [], R = [], ee = typeof Uint8Array < "u" ? Uint8Array : Array, nt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var P = 0, re = nt.length; P < re; ++P)
  L[P] = nt[P], R[nt.charCodeAt(P)] = P;
R[45] = 62;
R[95] = 63;
function St(d) {
  var i = d.length;
  if (i % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var s = d.indexOf("=");
  s === -1 && (s = i);
  var u = s === i ? 0 : 4 - s % 4;
  return [s, u];
}
function ie(d) {
  var i = St(d), s = i[0], u = i[1];
  return (s + u) * 3 / 4 - u;
}
function ne(d, i, s) {
  return (i + s) * 3 / 4 - s;
}
function se(d) {
  var i, s = St(d), u = s[0], c = s[1], a = new ee(ne(d, u, c)), p = 0, y = c > 0 ? u - 4 : u, f;
  for (f = 0; f < y; f += 4)
    i = R[d.charCodeAt(f)] << 18 | R[d.charCodeAt(f + 1)] << 12 | R[d.charCodeAt(f + 2)] << 6 | R[d.charCodeAt(f + 3)], a[p++] = i >> 16 & 255, a[p++] = i >> 8 & 255, a[p++] = i & 255;
  return c === 2 && (i = R[d.charCodeAt(f)] << 2 | R[d.charCodeAt(f + 1)] >> 4, a[p++] = i & 255), c === 1 && (i = R[d.charCodeAt(f)] << 10 | R[d.charCodeAt(f + 1)] << 4 | R[d.charCodeAt(f + 2)] >> 2, a[p++] = i >> 8 & 255, a[p++] = i & 255), a;
}
function oe(d) {
  return L[d >> 18 & 63] + L[d >> 12 & 63] + L[d >> 6 & 63] + L[d & 63];
}
function fe(d, i, s) {
  for (var u, c = [], a = i; a < s; a += 3)
    u = (d[a] << 16 & 16711680) + (d[a + 1] << 8 & 65280) + (d[a + 2] & 255), c.push(oe(u));
  return c.join("");
}
function ue(d) {
  for (var i, s = d.length, u = s % 3, c = [], a = 16383, p = 0, y = s - u; p < y; p += a)
    c.push(fe(d, p, p + a > y ? y : p + a));
  return u === 1 ? (i = d[s - 1], c.push(
    L[i >> 2] + L[i << 4 & 63] + "=="
  )) : u === 2 && (i = (d[s - 2] << 8) + d[s - 1], c.push(
    L[i >> 10] + L[i >> 4 & 63] + L[i << 2 & 63] + "="
  )), c.join("");
}
var ot = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
ot.read = function(d, i, s, u, c) {
  var a, p, y = c * 8 - u - 1, f = (1 << y) - 1, I = f >> 1, b = -7, x = s ? c - 1 : 0, E = s ? -1 : 1, S = d[i + x];
  for (x += E, a = S & (1 << -b) - 1, S >>= -b, b += y; b > 0; a = a * 256 + d[i + x], x += E, b -= 8)
    ;
  for (p = a & (1 << -b) - 1, a >>= -b, b += u; b > 0; p = p * 256 + d[i + x], x += E, b -= 8)
    ;
  if (a === 0)
    a = 1 - I;
  else {
    if (a === f)
      return p ? NaN : (S ? -1 : 1) * (1 / 0);
    p = p + Math.pow(2, u), a = a - I;
  }
  return (S ? -1 : 1) * p * Math.pow(2, a - u);
};
ot.write = function(d, i, s, u, c, a) {
  var p, y, f, I = a * 8 - c - 1, b = (1 << I) - 1, x = b >> 1, E = c === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, S = u ? 0 : a - 1, F = u ? 1 : -1, N = i < 0 || i === 0 && 1 / i < 0 ? 1 : 0;
  for (i = Math.abs(i), isNaN(i) || i === 1 / 0 ? (y = isNaN(i) ? 1 : 0, p = b) : (p = Math.floor(Math.log(i) / Math.LN2), i * (f = Math.pow(2, -p)) < 1 && (p--, f *= 2), p + x >= 1 ? i += E / f : i += E * Math.pow(2, 1 - x), i * f >= 2 && (p++, f /= 2), p + x >= b ? (y = 0, p = b) : p + x >= 1 ? (y = (i * f - 1) * Math.pow(2, c), p = p + x) : (y = i * Math.pow(2, x - 1) * Math.pow(2, c), p = 0)); c >= 8; d[s + S] = y & 255, S += F, y /= 256, c -= 8)
    ;
  for (p = p << c | y, I += c; I > 0; d[s + S] = p & 255, S += F, p /= 256, I -= 8)
    ;
  d[s + S - F] |= N * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(d) {
  const i = v, s = ot, u = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  d.Buffer = f, d.SlowBuffer = Ut, d.INSPECT_MAX_BYTES = 50;
  const c = 2147483647;
  d.kMaxLength = c;
  const a = (1 << 28) - 16;
  d.kStringMaxLength = a, d.constants = {
    MAX_LENGTH: c,
    MAX_STRING_LENGTH: a
  }, d.Blob = typeof Blob < "u" ? Blob : void 0, d.File = typeof File < "u" ? File : void 0, d.atob = typeof atob < "u" ? atob : void 0, d.btoa = typeof btoa < "u" ? btoa : void 0, f.TYPED_ARRAY_SUPPORT = p(), !f.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function p() {
    try {
      const r = new Uint8Array(1), t = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(r, t), r.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(f.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (f.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(f.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (f.isBuffer(this))
        return this.byteOffset;
    }
  });
  function y(r) {
    if (r > c)
      throw new RangeError('The value "' + r + '" is invalid for option "size"');
    const t = new Uint8Array(r);
    return Object.setPrototypeOf(t, f.prototype), t;
  }
  function f(r, t, e) {
    if (typeof r == "number") {
      if (typeof t == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return E(r);
    }
    return I(r, t, e);
  }
  f.poolSize = 8192;
  function I(r, t, e) {
    if (typeof r == "string")
      return S(r, t);
    if (ArrayBuffer.isView(r))
      return N(r);
    if (r == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r
      );
    if (k(r, ArrayBuffer) || r && k(r.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (k(r, SharedArrayBuffer) || r && k(r.buffer, SharedArrayBuffer)))
      return tt(r, t, e);
    if (typeof r == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const n = r.valueOf && r.valueOf();
    if (n != null && n !== r)
      return f.from(n, t, e);
    const o = Ct(r);
    if (o) return o;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof r[Symbol.toPrimitive] == "function")
      return f.from(r[Symbol.toPrimitive]("string"), t, e);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r
    );
  }
  f.from = function(r, t, e) {
    return I(r, t, e);
  }, Object.setPrototypeOf(f.prototype, Uint8Array.prototype), Object.setPrototypeOf(f, Uint8Array);
  function b(r) {
    if (typeof r != "number")
      throw new TypeError('"size" argument must be of type number');
    if (r < 0)
      throw new RangeError('The value "' + r + '" is invalid for option "size"');
  }
  function x(r, t, e) {
    return b(r), r <= 0 ? y(r) : t !== void 0 ? typeof e == "string" ? y(r).fill(t, e) : y(r).fill(t) : y(r);
  }
  f.alloc = function(r, t, e) {
    return x(r, t, e);
  };
  function E(r) {
    return b(r), y(r < 0 ? 0 : et(r) | 0);
  }
  f.allocUnsafe = function(r) {
    return E(r);
  }, f.allocUnsafeSlow = function(r) {
    return E(r);
  };
  function S(r, t) {
    if ((typeof t != "string" || t === "") && (t = "utf8"), !f.isEncoding(t))
      throw new TypeError("Unknown encoding: " + t);
    const e = ft(r, t) | 0;
    let n = y(e);
    const o = n.write(r, t);
    return o !== e && (n = n.slice(0, o)), n;
  }
  function F(r) {
    const t = r.length < 0 ? 0 : et(r.length) | 0, e = y(t);
    for (let n = 0; n < t; n += 1)
      e[n] = r[n] & 255;
    return e;
  }
  function N(r) {
    if (k(r, Uint8Array)) {
      const t = new Uint8Array(r);
      return tt(t.buffer, t.byteOffset, t.byteLength);
    }
    return F(r);
  }
  function tt(r, t, e) {
    if (t < 0 || r.byteLength < t)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (r.byteLength < t + (e || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let n;
    return t === void 0 && e === void 0 ? n = new Uint8Array(r) : e === void 0 ? n = new Uint8Array(r, t) : n = new Uint8Array(r, t, e), Object.setPrototypeOf(n, f.prototype), n;
  }
  function Ct(r) {
    if (f.isBuffer(r)) {
      const t = et(r.length) | 0, e = y(t);
      return e.length === 0 || r.copy(e, 0, 0, t), e;
    }
    if (r.length !== void 0)
      return typeof r.length != "number" || At(r.length) ? y(0) : F(r);
    if (r.type === "Buffer" && Array.isArray(r.data))
      return F(r.data);
  }
  function et(r) {
    if (r >= c)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + c.toString(16) + " bytes");
    return r | 0;
  }
  function Ut(r) {
    return +r != r && (r = 0), f.alloc(+r);
  }
  f.isBuffer = function(t) {
    return t != null && t._isBuffer === !0 && t !== f.prototype;
  }, f.compare = function(t, e) {
    if (!k(t, Uint8Array) || !k(e, Uint8Array))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (t === e) return 0;
    let n = t.length, o = e.length;
    for (let h = 0, l = Math.min(n, o); h < l; ++h)
      if (t[h] !== e[h]) {
        n = t[h], o = e[h];
        break;
      }
    return n < o ? -1 : o < n ? 1 : 0;
  }, f.isEncoding = function(t) {
    switch (String(t).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64url":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  }, f.concat = function(t, e) {
    if (!Array.isArray(t))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (t.length === 0)
      return f.alloc(0);
    let n;
    if (e === void 0)
      for (e = 0, n = 0; n < t.length; ++n)
        e += t[n].length;
    const o = f.allocUnsafe(e);
    let h = 0;
    for (n = 0; n < t.length; ++n) {
      const l = t[n];
      if (!k(l, Uint8Array))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (h + l.length > o.length) {
        o.set(l.subarray(0, o.length - h), h);
        break;
      }
      o.set(l, h), h += l.length;
    }
    return o;
  };
  function ft(r, t) {
    if (ArrayBuffer.isView(r) || k(r, ArrayBuffer) || typeof SharedArrayBuffer < "u" && k(r, SharedArrayBuffer))
      return r.byteLength;
    if (typeof r != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof r
      );
    const e = r.length, n = arguments.length > 2 && arguments[2] === !0;
    if (!n && e === 0) return 0;
    let o = !1;
    for (; ; )
      switch (t) {
        case "ascii":
        case "latin1":
        case "binary":
          return e;
        case "utf8":
        case "utf-8":
          return it(r).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return e * 2;
        case "hex":
          return e >>> 1;
        case "base64":
          return Et(r).length;
        default:
          if (o)
            return n ? -1 : it(r).length;
          t = ("" + t).toLowerCase(), o = !0;
      }
  }
  f.byteLength = ft;
  function kt(r, t, e) {
    let n = !1;
    if ((t === void 0 || t < 0) && (t = 0), t > this.length || ((e === void 0 || e > this.length) && (e = this.length), e <= 0) || (e >>>= 0, t >>>= 0, e <= t))
      return "";
    for (r || (r = "utf8"); ; )
      switch (r) {
        case "hex":
          return Dt(this, t, e);
        case "utf8":
        case "utf-8":
          return at(this, t, e);
        case "ascii":
          return qt(this, t, e);
        case "latin1":
        case "binary":
          return Pt(this, t, e);
        case "base64url":
        case "base64":
          return Mt(this, t, e, r);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Gt(this, t, e);
        default:
          if (n) throw new TypeError("Unknown encoding: " + r);
          r = (r + "").toLowerCase(), n = !0;
      }
  }
  f.prototype._isBuffer = !0;
  function M(r, t, e) {
    const n = r[t];
    r[t] = r[e], r[e] = n;
  }
  f.prototype.swap16 = function() {
    const t = this.length;
    if (t % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let e = 0; e < t; e += 2)
      M(this, e, e + 1);
    return this;
  }, f.prototype.swap32 = function() {
    const t = this.length;
    if (t % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let e = 0; e < t; e += 4)
      M(this, e, e + 3), M(this, e + 1, e + 2);
    return this;
  }, f.prototype.swap64 = function() {
    const t = this.length;
    if (t % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let e = 0; e < t; e += 8)
      M(this, e, e + 7), M(this, e + 1, e + 6), M(this, e + 2, e + 5), M(this, e + 3, e + 4);
    return this;
  }, f.prototype.toString = function() {
    const t = this.length;
    return t === 0 ? "" : arguments.length === 0 ? at(this, 0, t) : kt.apply(this, arguments);
  }, f.prototype.toLocaleString = f.prototype.toString, f.prototype.equals = function(t) {
    return this === t ? !0 : f.compare(this, t) === 0;
  }, f.prototype.inspect = function() {
    let t = "";
    const e = d.INSPECT_MAX_BYTES;
    return t = this.toString("hex", 0, e).replace(/(.{2})/g, "$1 ").trim(), this.length > e && (t += " ... "), "<Buffer " + t + ">";
  }, u && (f.prototype[u] = f.prototype.inspect), f.prototype.compare = function(t, e, n, o, h) {
    if (!k(t, Uint8Array))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t
      );
    if (e === void 0 && (e = 0), n === void 0 && (n = t ? t.length : 0), o === void 0 && (o = 0), h === void 0 && (h = this.length), e < 0 || n > t.length || o < 0 || h > this.length)
      throw new RangeError("out of range index");
    if (o >= h && e >= n)
      return 0;
    if (o >= h)
      return -1;
    if (e >= n)
      return 1;
    if (e >>>= 0, n >>>= 0, o >>>= 0, h >>>= 0, this === t) return 0;
    let l = h - o, w = n - e;
    const m = Math.min(l, w);
    for (let g = 0; g < m; ++g)
      if (this[o + g] !== t[e + g]) {
        l = this[o + g], w = t[e + g];
        break;
      }
    return l < w ? -1 : w < l ? 1 : 0;
  };
  function ut(r, t, e, n, o) {
    if (r.length === 0) return -1;
    if (typeof e == "string" ? (n = e, e = 0) : e > 2147483647 ? e = 2147483647 : e < -2147483648 && (e = -2147483648), e = +e, At(e) && (e = o ? 0 : r.length - 1), e < 0 && (e = r.length + e), e >= r.length) {
      if (o) return -1;
      e = r.length - 1;
    } else if (e < 0)
      if (o) e = 0;
      else return -1;
    if (typeof t == "string" && (t = f.from(t, n)), f.isBuffer(t))
      return t.length === 0 ? -1 : ht(r, t, e, n, o);
    if (typeof t == "number")
      return t = t & 255, typeof Uint8Array.prototype.indexOf == "function" ? o ? Uint8Array.prototype.indexOf.call(r, t, e) : Uint8Array.prototype.lastIndexOf.call(r, t, e) : ht(r, [t], e, n, o);
    throw new TypeError("val must be string, number or Buffer");
  }
  function ht(r, t, e, n, o) {
    let h = 1, l = r.length, w = t.length;
    if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
      if (r.length < 2 || t.length < 2)
        return -1;
      h = 2, l /= 2, w /= 2, e /= 2;
    }
    function m(A, _) {
      return h === 1 ? A[_] : A.readUInt16BE(_ * h);
    }
    let g;
    if (o) {
      let A = -1;
      for (g = e; g < l; g++)
        if (m(r, g) === m(t, A === -1 ? 0 : g - A)) {
          if (A === -1 && (A = g), g - A + 1 === w) return A * h;
        } else
          A !== -1 && (g -= g - A), A = -1;
    } else
      for (e + w > l && (e = l - w), g = e; g >= 0; g--) {
        let A = !0;
        for (let _ = 0; _ < w; _++)
          if (m(r, g + _) !== m(t, _)) {
            A = !1;
            break;
          }
        if (A) return g;
      }
    return -1;
  }
  f.prototype.includes = function(t, e, n) {
    return this.indexOf(t, e, n) !== -1;
  }, f.prototype.indexOf = function(t, e, n) {
    return ut(this, t, e, n, !0);
  }, f.prototype.lastIndexOf = function(t, e, n) {
    return ut(this, t, e, n, !1);
  };
  function Rt(r, t, e, n) {
    e = Number(e) || 0;
    const o = r.length - e;
    n ? (n = Number(n), n > o && (n = o)) : n = o;
    const h = t.length;
    n > h >>> 1 && (n = h >>> 1);
    for (let l = 0; l < n; ++l) {
      const w = t.charCodeAt(l * 2 + 0), m = t.charCodeAt(l * 2 + 1), g = _t[w & 127], A = _t[m & 127];
      if ((w | m | g | A) & -128)
        return l;
      r[e + l] = g << 4 | A;
    }
    return n;
  }
  function Lt(r, t, e, n) {
    return W(it(t, r.length - e), r, e, n);
  }
  function Tt(r, t, e, n) {
    return W(Vt(t), r, e, n);
  }
  function $t(r, t, e, n, o) {
    const h = o === "base64url" ? Qt(t) : t;
    return W(Et(h), r, e, n);
  }
  function Nt(r, t, e, n) {
    return W(Wt(t, r.length - e), r, e, n);
  }
  f.prototype.write = function(t, e, n, o) {
    if (e === void 0)
      o = "utf8", n = this.length, e = 0;
    else if (n === void 0 && typeof e == "string")
      o = e, n = this.length, e = 0;
    else if (isFinite(e))
      e = e >>> 0, isFinite(n) ? (n = n >>> 0, o === void 0 && (o = "utf8")) : (o = n, n = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const h = this.length - e;
    if ((n === void 0 || n > h) && (n = h), t.length > 0 && (n < 0 || e < 0) || e > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    o || (o = "utf8");
    let l = !1;
    for (; ; )
      switch (o) {
        case "hex":
          return Rt(this, t, e, n);
        case "utf8":
        case "utf-8":
          return Lt(this, t, e, n);
        case "ascii":
        case "latin1":
        case "binary":
          return Tt(this, t, e, n);
        case "base64url":
        case "base64":
          return $t(this, t, e, n, o);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Nt(this, t, e, n);
        default:
          if (l) throw new TypeError("Unknown encoding: " + o);
          o = ("" + o).toLowerCase(), l = !0;
      }
  }, f.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this, 0)
    };
  };
  function Mt(r, t, e, n) {
    let o;
    return t === 0 && e === r.length ? o = i.fromByteArray(r) : o = i.fromByteArray(r.slice(t, e)), n === "base64url" ? Yt(o) : o;
  }
  function at(r, t, e) {
    e = Math.min(r.length, e);
    const n = [];
    let o = t;
    for (; o < e; ) {
      const h = r[o];
      let l = null, w = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
      if (o + w <= e) {
        let m, g, A, _;
        switch (w) {
          case 1:
            h < 128 && (l = h);
            break;
          case 2:
            m = r[o + 1], (m & 192) === 128 && (_ = (h & 31) << 6 | m & 63, _ > 127 && (l = _));
            break;
          case 3:
            m = r[o + 1], g = r[o + 2], (m & 192) === 128 && (g & 192) === 128 && (_ = (h & 15) << 12 | (m & 63) << 6 | g & 63, _ > 2047 && (_ < 55296 || _ > 57343) && (l = _));
            break;
          case 4:
            m = r[o + 1], g = r[o + 2], A = r[o + 3], (m & 192) === 128 && (g & 192) === 128 && (A & 192) === 128 && (_ = (h & 15) << 18 | (m & 63) << 12 | (g & 63) << 6 | A & 63, _ > 65535 && _ < 1114112 && (l = _));
        }
      }
      l === null ? (l = 65533, w = 1) : l > 65535 && (l -= 65536, n.push(l >>> 10 & 1023 | 55296), l = 56320 | l & 1023), n.push(l), o += w;
    }
    return Ot(n);
  }
  const ct = 4096;
  function Ot(r) {
    const t = r.length;
    if (t <= ct)
      return String.fromCharCode.apply(String, r);
    let e = "", n = 0;
    for (; n < t; )
      e += String.fromCharCode.apply(
        String,
        r.slice(n, n += ct)
      );
    return e;
  }
  function qt(r, t, e) {
    let n = "";
    e = Math.min(r.length, e);
    for (let o = t; o < e; ++o)
      n += String.fromCharCode(r[o] & 127);
    return n;
  }
  function Pt(r, t, e) {
    let n = "";
    e = Math.min(r.length, e);
    for (let o = t; o < e; ++o)
      n += String.fromCharCode(r[o]);
    return n;
  }
  function Dt(r, t, e) {
    const n = r.length;
    (!t || t < 0) && (t = 0), (!e || e < 0 || e > n) && (e = n);
    let o = "";
    for (let h = t; h < e; ++h)
      o += Xt[r[h]];
    return o;
  }
  function Gt(r, t, e) {
    const n = r.slice(t, e);
    let o = "";
    for (let h = 0; h < n.length - 1; h += 2)
      o += String.fromCharCode(n[h] + n[h + 1] * 256);
    return o;
  }
  f.prototype.slice = function(t, e) {
    const n = this.length;
    t = ~~t, e = e === void 0 ? n : ~~e, t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), e < t && (e = t);
    const o = this.subarray(t, e);
    return Object.setPrototypeOf(o, f.prototype), o;
  };
  function C(r, t, e) {
    if (r % 1 !== 0 || r < 0) throw new RangeError("offset is not uint");
    if (r + t > e) throw new RangeError("Trying to access beyond buffer length");
  }
  f.prototype.readUintLE = f.prototype.readUIntLE = function(t, e, n) {
    t = t >>> 0, e = e >>> 0, n || C(t, e, this.length);
    let o = this[t], h = 1, l = 0;
    for (; ++l < e && (h *= 256); )
      o += this[t + l] * h;
    return o;
  }, f.prototype.readUintBE = f.prototype.readUIntBE = function(t, e, n) {
    t = t >>> 0, e = e >>> 0, n || C(t, e, this.length);
    let o = this[t + --e], h = 1;
    for (; e > 0 && (h *= 256); )
      o += this[t + --e] * h;
    return o;
  }, f.prototype.readUint8 = f.prototype.readUInt8 = function(t, e) {
    return t = t >>> 0, e || C(t, 1, this.length), this[t];
  }, f.prototype.readUint16LE = f.prototype.readUInt16LE = function(t, e) {
    return t = t >>> 0, e || C(t, 2, this.length), this[t] | this[t + 1] << 8;
  }, f.prototype.readUint16BE = f.prototype.readUInt16BE = function(t, e) {
    return t = t >>> 0, e || C(t, 2, this.length), this[t] << 8 | this[t + 1];
  }, f.prototype.readUint32LE = f.prototype.readUInt32LE = function(t, e) {
    return t = t >>> 0, e || C(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + this[t + 3] * 16777216;
  }, f.prototype.readUint32BE = f.prototype.readUInt32BE = function(t, e) {
    return t = t >>> 0, e || C(t, 4, this.length), this[t] * 16777216 + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
  }, f.prototype.readBigUInt64LE = T(function(t) {
    t = t >>> 0, q(t, "offset");
    const e = this[t], n = this[t + 7];
    (e === void 0 || n === void 0) && j(t, this.length - 8);
    const o = e + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24, h = this[++t] + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + n * 2 ** 24;
    return BigInt(o) + (BigInt(h) << BigInt(32));
  }), f.prototype.readBigUInt64BE = T(function(t) {
    t = t >>> 0, q(t, "offset");
    const e = this[t], n = this[t + 7];
    (e === void 0 || n === void 0) && j(t, this.length - 8);
    const o = e * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t], h = this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + n;
    return (BigInt(o) << BigInt(32)) + BigInt(h);
  }), f.prototype.readIntLE = function(t, e, n) {
    t = t >>> 0, e = e >>> 0, n || C(t, e, this.length);
    let o = this[t], h = 1, l = 0;
    for (; ++l < e && (h *= 256); )
      o += this[t + l] * h;
    return h *= 128, o >= h && (o -= Math.pow(2, 8 * e)), o;
  }, f.prototype.readIntBE = function(t, e, n) {
    t = t >>> 0, e = e >>> 0, n || C(t, e, this.length);
    let o = e, h = 1, l = this[t + --o];
    for (; o > 0 && (h *= 256); )
      l += this[t + --o] * h;
    return h *= 128, l >= h && (l -= Math.pow(2, 8 * e)), l;
  }, f.prototype.readInt8 = function(t, e) {
    return t = t >>> 0, e || C(t, 1, this.length), this[t] & 128 ? (255 - this[t] + 1) * -1 : this[t];
  }, f.prototype.readInt16LE = function(t, e) {
    t = t >>> 0, e || C(t, 2, this.length);
    const n = this[t] | this[t + 1] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, f.prototype.readInt16BE = function(t, e) {
    t = t >>> 0, e || C(t, 2, this.length);
    const n = this[t + 1] | this[t] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, f.prototype.readInt32LE = function(t, e) {
    return t = t >>> 0, e || C(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
  }, f.prototype.readInt32BE = function(t, e) {
    return t = t >>> 0, e || C(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
  }, f.prototype.readBigInt64LE = T(function(t) {
    t = t >>> 0, q(t, "offset");
    const e = this[t], n = this[t + 7];
    (e === void 0 || n === void 0) && j(t, this.length - 8);
    const o = this[t + 4] + this[t + 5] * 2 ** 8 + this[t + 6] * 2 ** 16 + (n << 24);
    return (BigInt(o) << BigInt(32)) + BigInt(e + this[++t] * 2 ** 8 + this[++t] * 2 ** 16 + this[++t] * 2 ** 24);
  }), f.prototype.readBigInt64BE = T(function(t) {
    t = t >>> 0, q(t, "offset");
    const e = this[t], n = this[t + 7];
    (e === void 0 || n === void 0) && j(t, this.length - 8);
    const o = (e << 24) + // Overflow
    this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + this[++t];
    return (BigInt(o) << BigInt(32)) + BigInt(this[++t] * 2 ** 24 + this[++t] * 2 ** 16 + this[++t] * 2 ** 8 + n);
  }), f.prototype.readFloatLE = function(t, e) {
    return t = t >>> 0, e || C(t, 4, this.length), s.read(this, t, !0, 23, 4);
  }, f.prototype.readFloatBE = function(t, e) {
    return t = t >>> 0, e || C(t, 4, this.length), s.read(this, t, !1, 23, 4);
  }, f.prototype.readDoubleLE = function(t, e) {
    return t = t >>> 0, e || C(t, 8, this.length), s.read(this, t, !0, 52, 8);
  }, f.prototype.readDoubleBE = function(t, e) {
    return t = t >>> 0, e || C(t, 8, this.length), s.read(this, t, !1, 52, 8);
  };
  function U(r, t, e, n, o, h) {
    if (!f.isBuffer(r)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (t > o || t < h) throw new RangeError('"value" argument is out of bounds');
    if (e + n > r.length) throw new RangeError("Index out of range");
  }
  f.prototype.writeUintLE = f.prototype.writeUIntLE = function(t, e, n, o) {
    if (t = +t, e = e >>> 0, n = n >>> 0, !o) {
      const w = Math.pow(2, 8 * n) - 1;
      U(this, t, e, n, w, 0);
    }
    let h = 1, l = 0;
    for (this[e] = t & 255; ++l < n && (h *= 256); )
      this[e + l] = t / h & 255;
    return e + n;
  }, f.prototype.writeUintBE = f.prototype.writeUIntBE = function(t, e, n, o) {
    if (t = +t, e = e >>> 0, n = n >>> 0, !o) {
      const w = Math.pow(2, 8 * n) - 1;
      U(this, t, e, n, w, 0);
    }
    let h = n - 1, l = 1;
    for (this[e + h] = t & 255; --h >= 0 && (l *= 256); )
      this[e + h] = t / l & 255;
    return e + n;
  }, f.prototype.writeUint8 = f.prototype.writeUInt8 = function(t, e, n) {
    return t = +t, e = e >>> 0, n || U(this, t, e, 1, 255, 0), this[e] = t & 255, e + 1;
  }, f.prototype.writeUint16LE = f.prototype.writeUInt16LE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || U(this, t, e, 2, 65535, 0), this[e] = t & 255, this[e + 1] = t >>> 8, e + 2;
  }, f.prototype.writeUint16BE = f.prototype.writeUInt16BE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || U(this, t, e, 2, 65535, 0), this[e] = t >>> 8, this[e + 1] = t & 255, e + 2;
  }, f.prototype.writeUint32LE = f.prototype.writeUInt32LE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || U(this, t, e, 4, 4294967295, 0), this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = t & 255, e + 4;
  }, f.prototype.writeUint32BE = f.prototype.writeUInt32BE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || U(this, t, e, 4, 4294967295, 0), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = t & 255, e + 4;
  };
  function lt(r, t, e, n, o) {
    gt(t, n, o, r, e, 7);
    let h = Number(t & BigInt(4294967295));
    r[e++] = h, h = h >> 8, r[e++] = h, h = h >> 8, r[e++] = h, h = h >> 8, r[e++] = h;
    let l = Number(t >> BigInt(32) & BigInt(4294967295));
    return r[e++] = l, l = l >> 8, r[e++] = l, l = l >> 8, r[e++] = l, l = l >> 8, r[e++] = l, e;
  }
  function dt(r, t, e, n, o) {
    gt(t, n, o, r, e, 7);
    let h = Number(t & BigInt(4294967295));
    r[e + 7] = h, h = h >> 8, r[e + 6] = h, h = h >> 8, r[e + 5] = h, h = h >> 8, r[e + 4] = h;
    let l = Number(t >> BigInt(32) & BigInt(4294967295));
    return r[e + 3] = l, l = l >> 8, r[e + 2] = l, l = l >> 8, r[e + 1] = l, l = l >> 8, r[e] = l, e + 8;
  }
  f.prototype.writeBigUInt64LE = T(function(t, e = 0) {
    return lt(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), f.prototype.writeBigUInt64BE = T(function(t, e = 0) {
    return dt(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
  }), f.prototype.writeIntLE = function(t, e, n, o) {
    if (t = +t, e = e >>> 0, !o) {
      const m = Math.pow(2, 8 * n - 1);
      U(this, t, e, n, m - 1, -m);
    }
    let h = 0, l = 1, w = 0;
    for (this[e] = t & 255; ++h < n && (l *= 256); )
      t < 0 && w === 0 && this[e + h - 1] !== 0 && (w = 1), this[e + h] = (t / l >> 0) - w & 255;
    return e + n;
  }, f.prototype.writeIntBE = function(t, e, n, o) {
    if (t = +t, e = e >>> 0, !o) {
      const m = Math.pow(2, 8 * n - 1);
      U(this, t, e, n, m - 1, -m);
    }
    let h = n - 1, l = 1, w = 0;
    for (this[e + h] = t & 255; --h >= 0 && (l *= 256); )
      t < 0 && w === 0 && this[e + h + 1] !== 0 && (w = 1), this[e + h] = (t / l >> 0) - w & 255;
    return e + n;
  }, f.prototype.writeInt8 = function(t, e, n) {
    return t = +t, e = e >>> 0, n || U(this, t, e, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[e] = t & 255, e + 1;
  }, f.prototype.writeInt16LE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || U(this, t, e, 2, 32767, -32768), this[e] = t & 255, this[e + 1] = t >>> 8, e + 2;
  }, f.prototype.writeInt16BE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || U(this, t, e, 2, 32767, -32768), this[e] = t >>> 8, this[e + 1] = t & 255, e + 2;
  }, f.prototype.writeInt32LE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || U(this, t, e, 4, 2147483647, -2147483648), this[e] = t & 255, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24, e + 4;
  }, f.prototype.writeInt32BE = function(t, e, n) {
    return t = +t, e = e >>> 0, n || U(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = t & 255, e + 4;
  }, f.prototype.writeBigInt64LE = T(function(t, e = 0) {
    return lt(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), f.prototype.writeBigInt64BE = T(function(t, e = 0) {
    return dt(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function pt(r, t, e, n, o, h) {
    if (e + n > r.length) throw new RangeError("Index out of range");
    if (e < 0) throw new RangeError("Index out of range");
  }
  function yt(r, t, e, n, o) {
    return t = +t, e = e >>> 0, o || pt(r, t, e, 4), s.write(r, t, e, n, 23, 4), e + 4;
  }
  f.prototype.writeFloatLE = function(t, e, n) {
    return yt(this, t, e, !0, n);
  }, f.prototype.writeFloatBE = function(t, e, n) {
    return yt(this, t, e, !1, n);
  };
  function wt(r, t, e, n, o) {
    return t = +t, e = e >>> 0, o || pt(r, t, e, 8), s.write(r, t, e, n, 52, 8), e + 8;
  }
  f.prototype.writeDoubleLE = function(t, e, n) {
    return wt(this, t, e, !0, n);
  }, f.prototype.writeDoubleBE = function(t, e, n) {
    return wt(this, t, e, !1, n);
  }, f.prototype.copy = function(t, e, n, o) {
    if (!k(t, Uint8Array)) throw new TypeError("argument should be a Buffer");
    if (n || (n = 0), !o && o !== 0 && (o = this.length), e >= t.length && (e = t.length), e || (e = 0), o > 0 && o < n && (o = n), o === n || t.length === 0 || this.length === 0) return 0;
    if (e < 0)
      throw new RangeError("targetStart out of bounds");
    if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
    if (o < 0) throw new RangeError("sourceEnd out of bounds");
    o > this.length && (o = this.length), t.length - e < o - n && (o = t.length - e + n);
    const h = o - n;
    return this === t && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(e, n, o) : Uint8Array.prototype.set.call(
      t,
      this.subarray(n, o),
      e
    ), h;
  }, f.prototype.fill = function(t, e, n, o) {
    if (typeof t == "string") {
      if (typeof e == "string" ? (o = e, e = 0, n = this.length) : typeof n == "string" && (o = n, n = this.length), o !== void 0 && typeof o != "string")
        throw new TypeError("encoding must be a string");
      if (typeof o == "string" && !f.isEncoding(o))
        throw new TypeError("Unknown encoding: " + o);
      if (t.length === 1) {
        const l = t.charCodeAt(0);
        (o === "utf8" && l < 128 || o === "latin1") && (t = l);
      }
    } else typeof t == "number" ? t = t & 255 : typeof t == "boolean" && (t = Number(t));
    if (e < 0 || this.length < e || this.length < n)
      throw new RangeError("Out of range index");
    if (n <= e)
      return this;
    e = e >>> 0, n = n === void 0 ? this.length : n >>> 0, t || (t = 0);
    let h;
    if (typeof t == "number")
      for (h = e; h < n; ++h)
        this[h] = t;
    else {
      const l = k(t, Uint8Array) ? t : f.from(t, o), w = l.length;
      if (w === 0)
        throw new TypeError('The value "' + t + '" is invalid for argument "value"');
      for (h = 0; h < n - e; ++h)
        this[h + e] = l[h % w];
    }
    return this;
  };
  const O = {};
  function rt(r, t, e) {
    function n() {
      const o = new e(t.apply(null, arguments));
      return Object.setPrototypeOf(o, n.prototype), o.code = r, o.name = `${o.name} [${r}]`, Error.captureStackTrace && Error.captureStackTrace(o, n), o.stack, delete o.name, o;
    }
    Object.setPrototypeOf(n.prototype, e.prototype), Object.setPrototypeOf(n, e), n.prototype.toString = function() {
      return `${this.name} [${r}]: ${this.message}`;
    }, O[r] = n;
  }
  rt(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(r) {
      return r ? `${r} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), rt(
    "ERR_INVALID_ARG_TYPE",
    function(r, t) {
      return `The "${r}" argument must be of type number. Received type ${typeof t}`;
    },
    TypeError
  ), rt(
    "ERR_OUT_OF_RANGE",
    function(r, t, e) {
      let n = `The value of "${r}" is out of range.`, o = e;
      return Number.isInteger(e) && Math.abs(e) > 2 ** 32 ? o = Bt(String(e)) : typeof e == "bigint" && (o = String(e), (e > BigInt(2) ** BigInt(32) || e < -(BigInt(2) ** BigInt(32))) && (o = Bt(o)), o += "n"), n += ` It must be ${t}. Received ${o}`, n;
    },
    RangeError
  );
  function Bt(r) {
    let t = "", e = r.length;
    const n = r[0] === "-" ? 1 : 0;
    for (; e >= n + 4; e -= 3)
      t = `_${r.slice(e - 3, e)}${t}`;
    return `${r.slice(0, e)}${t}`;
  }
  function zt(r, t, e) {
    q(t, "offset"), (r[t] === void 0 || r[t + e] === void 0) && j(t, r.length - (e + 1));
  }
  function gt(r, t, e, n, o, h) {
    if (r > e || r < t) {
      const l = typeof t == "bigint" ? "n" : "";
      let w;
      throw t === 0 || t === BigInt(0) ? w = `>= 0${l} and < 2${l} ** ${(h + 1) * 8}${l}` : w = `>= -(2${l} ** ${(h + 1) * 8 - 1}${l}) and < 2 ** ${(h + 1) * 8 - 1}${l}`, new O.ERR_OUT_OF_RANGE("value", w, r);
    }
    zt(n, o, h);
  }
  function q(r, t) {
    if (typeof r != "number")
      throw new O.ERR_INVALID_ARG_TYPE(t, "number", r);
  }
  function j(r, t, e) {
    throw Math.floor(r) !== r ? (q(r, e), new O.ERR_OUT_OF_RANGE("offset", "an integer", r)) : t < 0 ? new O.ERR_BUFFER_OUT_OF_BOUNDS() : new O.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${t}`,
      r
    );
  }
  const jt = /[^+/0-9A-Za-z-_]/g, bt = "+", It = "/", xt = "-", mt = "_";
  function Qt(r) {
    return r.replaceAll(xt, bt).replaceAll(mt, It);
  }
  function Yt(r) {
    return r.replaceAll(bt, xt).replaceAll(It, mt);
  }
  function Ht(r) {
    if (r = r.split("=")[0], r = r.trim().replace(jt, ""), r.length < 2) return "";
    for (; r.length % 4 !== 0; )
      r = r + "=";
    return r;
  }
  function it(r, t) {
    t = t || 1 / 0;
    let e;
    const n = r.length;
    let o = null;
    const h = [];
    for (let l = 0; l < n; ++l) {
      if (e = r.charCodeAt(l), e > 55295 && e < 57344) {
        if (!o) {
          if (e > 56319) {
            (t -= 3) > -1 && h.push(239, 191, 189);
            continue;
          } else if (l + 1 === n) {
            (t -= 3) > -1 && h.push(239, 191, 189);
            continue;
          }
          o = e;
          continue;
        }
        if (e < 56320) {
          (t -= 3) > -1 && h.push(239, 191, 189), o = e;
          continue;
        }
        e = (o - 55296 << 10 | e - 56320) + 65536;
      } else o && (t -= 3) > -1 && h.push(239, 191, 189);
      if (o = null, e < 128) {
        if ((t -= 1) < 0) break;
        h.push(e);
      } else if (e < 2048) {
        if ((t -= 2) < 0) break;
        h.push(
          e >> 6 | 192,
          e & 63 | 128
        );
      } else if (e < 65536) {
        if ((t -= 3) < 0) break;
        h.push(
          e >> 12 | 224,
          e >> 6 & 63 | 128,
          e & 63 | 128
        );
      } else if (e < 1114112) {
        if ((t -= 4) < 0) break;
        h.push(
          e >> 18 | 240,
          e >> 12 & 63 | 128,
          e >> 6 & 63 | 128,
          e & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return h;
  }
  function Vt(r) {
    const t = [];
    for (let e = 0; e < r.length; ++e)
      t.push(r.charCodeAt(e) & 255);
    return t;
  }
  function Wt(r, t) {
    let e, n, o;
    const h = [];
    for (let l = 0; l < r.length && !((t -= 2) < 0); ++l)
      e = r.charCodeAt(l), n = e >> 8, o = e % 256, h.push(o), h.push(n);
    return h;
  }
  function Et(r) {
    return i.toByteArray(Ht(r));
  }
  function W(r, t, e, n) {
    let o;
    for (o = 0; o < n && !(o + e >= t.length || o >= r.length); ++o)
      t[o + e] = r[o];
    return o;
  }
  function k(r, t) {
    return r instanceof t || r != null && r.constructor != null && r.constructor.name != null && r.constructor.name === t.name || t === Uint8Array && f.isBuffer(r);
  }
  function At(r) {
    return r !== r;
  }
  const Xt = function() {
    const r = "0123456789abcdef", t = new Array(256);
    for (let e = 0; e < 16; ++e) {
      const n = e * 16;
      for (let o = 0; o < 16; ++o)
        t[n + o] = r[e] + r[o];
    }
    return t;
  }(), _t = [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    10,
    11,
    12,
    13,
    14,
    15,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    10,
    11,
    12,
    13,
    14,
    15,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
  ];
  function T(r) {
    return typeof BigInt > "u" ? Kt : r;
  }
  function Kt() {
    throw new Error("BigInt not supported");
  }
})(J);
class he {
  constructor() {
    B(this, "buffer", new Uint8Array(0));
  }
  write(i) {
    let s = new Uint8Array(this.buffer.length + i.length);
    s.set(this.buffer), s.set(i, this.buffer.length), this.buffer = s;
  }
}
class ae {
  /**
   * Create a new writer
   * @param stream The writable stream to write to
   * @param bufferSize The number of bytes to buffer before flushing onto the writable
   */
  constructor(i, s = 1) {
    B(this, "pendingByte", BigInt(0));
    B(this, "pendingBits", 0);
    B(this, "buffer");
    B(this, "bufferedBytes", 0);
    B(this, "_offset", 0);
    this.stream = i, this.bufferSize = s, this.buffer = new Uint8Array(s);
  }
  /**
   * How many bits have been written via this writer in total
   */
  get offset() {
    return this._offset;
  }
  /**
   * How many bits into the current byte is the write cursor.
   * If this value is zero, then we are currently byte-aligned.
   * A value of 7 means we are 1 bit away from the byte boundary.
   */
  get byteOffset() {
    return this.pendingBits;
  }
  /**
   * Finish the current byte (assuming zeros for the remaining bits, if necessary)
   * and flushes the output.
   */
  end() {
    this.finishByte(), this.flush();
  }
  /**
   * Reset the bit offset of this writer back to zero.
   */
  reset() {
    this._offset = 0;
  }
  finishByte() {
    this.pendingBits > 0 && (this.buffer[this.bufferedBytes++] = Number(this.pendingByte), this.pendingBits = 0, this.pendingByte = BigInt(0));
  }
  flush() {
    this.bufferedBytes > 0 && (this.stream.write(J.Buffer.from(this.buffer.slice(0, this.bufferedBytes))), this.bufferedBytes = 0);
  }
  min(i, s) {
    return i < s ? i : s;
  }
  /**
   * Write the given number to the bitstream with the given bitlength. If the number is too large for the 
   * number of bits specified, the lower-order bits are written and the higher-order bits are ignored.
   * @param length The number of bits to write
   * @param value The number to write
   */
  write(i, s) {
    if (s == null && (s = 0), s = Number(s), Number.isNaN(s))
      throw new Error(`Cannot write to bitstream: Value ${s} is not a number`);
    if (!Number.isFinite(s))
      throw new Error(`Cannot write to bitstream: Value ${s} must be finite`);
    let u = BigInt(s % Math.pow(2, i)), c = i;
    for (; c > 0; ) {
      let a = BigInt(8 - this.pendingBits - c), p = a >= 0 ? u << a : u >> -a, y = Number(a >= 0 ? c : this.min(-a, BigInt(8 - this.pendingBits)));
      this.pendingByte = this.pendingByte | p, this.pendingBits += y, this._offset += y, c -= y, u = u % BigInt(Math.pow(2, c)), this.pendingBits === 8 && (this.finishByte(), this.bufferedBytes >= this.buffer.length && this.flush());
    }
  }
}
let X;
class ce {
  constructor() {
    B(this, "buffers", []);
    B(this, "bufferedLength", 0);
    B(this, "blockedRequest", null);
    B(this, "_offsetIntoBuffer", 0);
    B(this, "_bufferIndex", 0);
    B(this, "_offset", 0);
    B(this, "_spentBufferSize", 0);
    /**
     * When true, buffers are not removed, which allows the user to 
     * "rewind" the current offset back into buffers that have already been 
     * visited. If you enable this, you will need to remove buffers manually using 
     * clean()
     */
    B(this, "retainBuffers", !1);
    B(this, "textDecoder", new TextDecoder());
    B(this, "skippedLength", 0);
    B(this, "_ended", !1);
  }
  /**
   * Get the index of the buffer currently being read. This will always be zero unless retainBuffers=true
   */
  get bufferIndex() {
    return this._bufferIndex;
  }
  /**
   * Get the current offset in bits, starting from the very first bit read by this reader (across all 
   * buffers added)
   */
  get offset() {
    return this._offset;
  }
  /**
   * The total number of bits which were in buffers that have previously been read, and have since been discarded.
   */
  get spentBufferSize() {
    return this._spentBufferSize;
  }
  /**
   * Set the current offset in bits, as measured from the very first bit read by this reader (across all buffers
   * added). If the given offset points into a previously discarded buffer, an error will be thrown. See the 
   * retainBuffers option if you need to seek back into previous buffers. If the desired offset is in a previous
   * buffer which has not been discarded, the current read head is moved into the appropriate offset of that buffer.
   */
  set offset(i) {
    if (i < this._spentBufferSize)
      throw new Error(
        `Offset ${i} points into a discarded buffer! If you need to seek backwards outside the current buffer, make sure to set retainBuffers=true`
      );
    let s = i - this._spentBufferSize, u = 0;
    for (let c = 0, a = this.buffers.length; c < a; ++c) {
      let p = this.buffers[c], y = p.length * 8;
      if (s < y) {
        this._bufferIndex = u, this._offset = i, this._offsetIntoBuffer = s, this.bufferedLength = p.length * 8 - this._offsetIntoBuffer;
        for (let f = c + 1; f < a; ++f)
          this.bufferedLength += this.buffers[f].length * 8;
        return;
      }
      s -= y, ++u;
    }
  }
  /**
   * Run a function which can synchronously read bits without affecting the read head after the function 
   * has finished.
   * @param func 
   */
  simulateSync(i) {
    let s = this.retainBuffers, u = this.offset;
    this.retainBuffers = !0;
    try {
      return i();
    } finally {
      this.retainBuffers = s, this.offset = u;
    }
  }
  /**
   * Run a function which can asynchronously read bits without affecting the read head after the function 
   * has finished.
   * @param func 
   */
  async simulate(i) {
    let s = this.retainBuffers, u = this.offset;
    this.retainBuffers = !0;
    try {
      return await i();
    } finally {
      this.retainBuffers = s, this.offset = u;
    }
  }
  /**
   * Remove any fully used up buffers. Only has an effect if retainBuffers is true.
   * Optional `count` parameter lets you control how many buffers can be freed.
   */
  clean(i) {
    let s = i !== void 0 ? Math.min(i, this._bufferIndex) : this._bufferIndex;
    for (let u = 0, c = s; u < c; ++u)
      this._spentBufferSize += this.buffers[0].length * 8, this.buffers.shift();
    this._bufferIndex -= s;
  }
  /**
   * The number of bits that are currently available.
   */
  get available() {
    return this.bufferedLength - this.skippedLength;
  }
  /**
   * Check if the given number of bits are currently available.
   * @param length The number of bits to check for
   * @returns True if the required number of bits is available, false otherwise
   */
  isAvailable(i) {
    return this.bufferedLength >= i;
  }
  ensureNoReadPending() {
    if (this.blockedRequest)
      throw new Error("Only one read() can be outstanding at a time.");
  }
  /**
   * Asynchronously read the given number of bytes, encode it into a string, and return the result,
   * optionally using a specific text encoding.
   * @param length The number of bytes to read
   * @param options A set of options to control conversion into a string. @see StringEncodingOptions
   * @returns The resulting string
   */
  async readString(i, s) {
    return this.ensureNoReadPending(), await this.assure(8 * i), this.readStringSync(i, s);
  }
  /**
   * Synchronously read the given number of bytes, encode it into a string, and return the result,
   * optionally using a specific text encoding.
   * @param length The number of bytes to read
   * @param options A set of options to control conversion into a string. @see StringEncodingOptions
   * @returns The resulting string
   */
  readStringSync(i, s) {
    s || (s = {}), this.ensureNoReadPending();
    let u = new Uint8Array(i), c = -1, a = 1, p = s.encoding ?? "utf-8";
    ["utf16le", "ucs-2", "ucs2"].includes(p) && (a = 2);
    for (let y = 0, f = i; y < f; ++y)
      u[y] = this.readSync(8);
    for (let y = 0, f = i; y < f; y += a) {
      let I = u[y];
      if (a === 2 && (I = I << 8 | (u[y + 1] ?? 0)), I === 0) {
        c = y;
        break;
      }
    }
    if (s.nullTerminated !== !1 && c >= 0 && (u = u.subarray(0, c)), p === "utf-8")
      return this.textDecoder.decode(u);
    if (typeof Buffer > "u")
      throw new Error(`Encoding '${p}' is not supported: No Node.js Buffer implementation and TextDecoder only supports utf-8`);
    return Buffer.from(u).toString(p);
  }
  /**
   * Read a number of the given bitlength synchronously without advancing
   * the read head.
   * @param length The number of bits to read
   * @returns The number read from the bitstream
   */
  peekSync(i) {
    return this.readCoreSync(i, !1);
  }
  /**
   * Skip the given number of bits. 
   * @param length The number of bits to skip
   */
  skip(i) {
    this.skippedLength += i;
  }
  /**
   * Read an unsigned integer of the given bit length synchronously. If there are not enough 
   * bits available, an error is thrown.
   * 
   * @param length The number of bits to read
   * @returns The unsigned integer that was read
   */
  readSync(i) {
    return this.readCoreSync(i, !0);
  }
  /**
   * Read a number of bytes from the stream. Returns a generator that ends when the read is complete,
   * and yields a number of *bytes* still to be read (not bits like in other read methods)
   * 
   * @param buffer The buffer/typed array to write to
   * @param offset The offset into the buffer to write to. Defaults to zero
   * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
   */
  *readBytes(i, s = 0, u) {
    var a;
    if (u ?? (u = i.length - s), this._offsetIntoBuffer % 8 === 0) {
      globalThis.BITSTREAM_TRACE && (console.log(`------------------------------------------------------------    Byte-aligned readBytes(), length=${u}`), console.log(`------------------------------------------------------------    readBytes(): Pre-operation: buffered=${this.bufferedLength} bits, bufferIndex=${this._bufferIndex}, bufferOffset=${this._offsetIntoBuffer}, bufferLength=${((a = this.buffers[this._bufferIndex]) == null ? void 0 : a.length) || "<none>"} bufferCount=${this.buffers.length}`));
      let p = u, y = 0;
      for (; p > 0; ) {
        this.available < p * 8 && (yield Math.max((p * 8 - this.available) / 8));
        let f = Math.floor(this._offsetIntoBuffer / 8), I = this.buffers[this._bufferIndex], b = Math.min(p, I.length);
        for (let E = 0; E < b; ++E)
          i[y + E] = I[f + E];
        y += b;
        let x = b * 8;
        this.consume(x), p -= x, globalThis.BITSTREAM_TRACE && (console.log(`------------------------------------------------------------    readBytes(): consumed=${b} bytes, remaining=${p}`), console.log(`------------------------------------------------------------    readBytes(): buffered=${this.bufferedLength} bits, bufferIndex=${this._bufferIndex}, bufferOffset=${this._offsetIntoBuffer}, bufferCount=${this.buffers.length}`));
      }
    } else
      for (let p = s, y = Math.min(i.length, s + u); p < y; ++p)
        this.isAvailable(8) || (yield y - p), i[p] = this.readSync(8);
    return i;
  }
  /**
   * Read a number of bytes from the stream synchronously. If not enough bytes are available, an 
   * exception is thrown.
   * 
   * @param buffer The buffer/typed array to write to
   * @param offset The offset into the buffer to write to. Defaults to zero
   * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
   */
  readBytesSync(i, s = 0, u) {
    u ?? (u = i.length - s);
    let c = this.readBytes(i, s, u);
    for (; ; ) {
      if (c.next().done === !1)
        throw new Error(`underrun: Not enough bits are available (requested ${u} bytes)`);
      break;
    }
    return i;
  }
  /**
   * Read a number of bytes from the stream. Blocks and waits for more bytes if not enough bytes are available.
   * 
   * @param buffer The buffer/typed array to write to
   * @param offset The offset into the buffer to write to. Defaults to zero
   * @param length The length of bytes to read. Defaults to the length of the array (sans the offset)
   */
  async readBytesBlocking(i, s = 0, u) {
    u ?? (u = i.length - s);
    let c = this.readBytes(i, s, u);
    for (; ; ) {
      let a = c.next();
      if (a.done === !1)
        await this.assure(a.value * 8);
      else
        break;
    }
    return i;
  }
  /**
   * Read a two's complement signed integer of the given bit length synchronously. If there are not
   * enough bits available, an error is thrown.
   * 
   * @param length The number of bits to read
   * @returns The signed integer that was read
   */
  readSignedSync(i) {
    const s = this.readSync(i), u = 2 ** (i - 1), c = u - 1;
    return s & u ? -((~(s - 1) & c) >>> 0) : s;
  }
  maskOf(i) {
    if (!X) {
      X = /* @__PURE__ */ new Map();
      for (let s = 0; s <= 64; ++s)
        X.set(s, Math.pow(2, s) - 1);
    }
    return X.get(i) ?? Math.pow(2, i) - 1;
  }
  /**
   * Read an IEEE 754 floating point value with the given bit length (32 or 64). If there are not 
   * enough bits available, an error is thrown.
   * 
   * @param length Must be 32 for 32-bit single-precision or 64 for 64-bit double-precision. All
   *        other values result in TypeError
   * @returns The floating point value that was read
   */
  readFloatSync(i) {
    if (i !== 32 && i !== 64)
      throw new TypeError(`Invalid length (${i} bits) Only 4-byte (32 bit / single-precision) and 8-byte (64 bit / double-precision) IEEE 754 values are supported`);
    if (!this.isAvailable(i))
      throw new Error(`underrun: Not enough bits are available (requested=${i}, available=${this.bufferedLength}, buffers=${this.buffers.length})`);
    let s = new ArrayBuffer(i / 8), u = new DataView(s);
    for (let c = 0, a = s.byteLength; c < a; ++c)
      u.setUint8(c, this.readSync(8));
    if (i === 32)
      return u.getFloat32(0, !1);
    if (i === 64)
      return u.getFloat64(0, !1);
    throw new TypeError(`Invalid length (${i} bits) Only 4-byte (32 bit / single-precision) and 8-byte (64 bit / double-precision) IEEE 754 values are supported`);
  }
  readByteAligned(i) {
    let s = this.buffers[this._bufferIndex], u = s[this._offsetIntoBuffer / 8];
    return i && (this.bufferedLength -= 8, this._offsetIntoBuffer += 8, this._offset += 8, this._offsetIntoBuffer >= s.length * 8 && (this._bufferIndex += 1, this._offsetIntoBuffer = 0, this.retainBuffers || this.clean())), u;
  }
  consume(i) {
    this.bufferedLength -= i, this._offsetIntoBuffer += i, this._offset += i;
    let s = this.buffers[this._bufferIndex];
    for (; s && this._offsetIntoBuffer >= s.length * 8; )
      this._bufferIndex += 1, this._offsetIntoBuffer -= s.length * 8, s = this.buffers[this._bufferIndex], this.retainBuffers || this.clean();
  }
  readShortByteAligned(i, s) {
    let u = this.buffers[this._bufferIndex], c = this._offsetIntoBuffer / 8, a = u[c], p;
    if (c + 1 >= u.length ? p = this.buffers[this._bufferIndex + 1][0] : p = u[c + 1], i && this.consume(16), s === "lsb") {
      let y = a;
      a = p, p = y;
    }
    return a << 8 | p;
  }
  readLongByteAligned(i, s) {
    let u = this._bufferIndex, c = this.buffers[u], a = this._offsetIntoBuffer / 8, p = c[a++];
    a >= c.length && (c = this.buffers[++u], a = 0);
    let y = c[a++];
    a >= c.length && (c = this.buffers[++u], a = 0);
    let f = c[a++];
    a >= c.length && (c = this.buffers[++u], a = 0);
    let I = c[a++];
    a >= c.length && (c = this.buffers[++u], a = 0), i && this.consume(32);
    let b = (p & 128) !== 0;
    if (p &= -129, s === "lsb") {
      let E = I, S = f, F = y, N = p;
      p = E, y = S, f = F, I = N;
    }
    let x = p << 24 | y << 16 | f << 8 | I;
    return b && (x += 2 ** 31), x;
  }
  read3ByteAligned(i, s) {
    let u = this._bufferIndex, c = this.buffers[u], a = this._offsetIntoBuffer / 8, p = c[a++];
    a >= c.length && (c = this.buffers[++u], a = 0);
    let y = c[a++];
    a >= c.length && (c = this.buffers[++u], a = 0);
    let f = c[a++];
    if (a >= c.length && (c = this.buffers[++u], a = 0), i && this.consume(24), s === "lsb") {
      let I = p;
      p = f, f = I;
    }
    return p << 16 | y << 8 | f;
  }
  readPartialByte(i, s) {
    let c = this.buffers[this._bufferIndex][Math.floor(this._offsetIntoBuffer / 8)], a = this._offsetIntoBuffer % 8 | 0;
    return s && this.consume(i), c >> 8 - i - a & this.maskOf(i) | 0;
  }
  /**
   * @param length 
   * @param consume 
   * @param byteOrder The byte order to use when the length is greater than 8 and is a multiple of 8. 
   *                  Defaults to MSB (most significant byte). If the length is not a multiple of 8, 
   *                  this is unused
   * @returns 
   */
  readCoreSync(i, s, u = "msb") {
    if (this.ensureNoReadPending(), this.available < i)
      throw new Error(`underrun: Not enough bits are available (requested=${i}, available=${this.bufferedLength}, buffers=${this.buffers.length})`);
    this.adjustSkip();
    let c = this._offsetIntoBuffer % 8;
    if (c === 0) {
      if (i === 8)
        return this.readByteAligned(s);
      if (i === 16)
        return this.readShortByteAligned(s, u);
      if (i === 24)
        return this.read3ByteAligned(s, u);
      if (i === 32)
        return this.readLongByteAligned(s, u);
    }
    if (i < 8 && (8 - c | 0) >= i)
      return this.readPartialByte(i, s);
    let a = i, p = this._offsetIntoBuffer, y = this._bufferIndex, f = BigInt(0), I = 0, b = i > 31;
    for (; a > 0; ) {
      if (y >= this.buffers.length)
        throw new Error(`Internal error: Buffer index out of range (index=${y}, count=${this.buffers.length}), offset=${this.offset}, readLength=${i}, available=${this.available})`);
      let x = this.buffers[y], E = Math.floor(p / 8);
      if (E >= x.length)
        throw new Error(`Internal error: Current buffer (index ${y}) has length ${x.length} but our position within the buffer is ${E}! offset=${this.offset}, bufs=${this.buffers.length}`);
      let S = p % 8, F, N = x[E];
      F = Math.min(8 - S, a), b ? f = f << BigInt(F) | BigInt(x[E]) >> BigInt(8) - BigInt(F) - BigInt(S) & BigInt(this.maskOf(F)) : I = I << F | N >> 8 - F - S & this.maskOf(F), p += F, a -= F | 0, p >= x.length * 8 && (y += 1, p = 0);
    }
    return s && this.consume(i), b ? Number(f) : I;
  }
  adjustSkip() {
    if (!(this.skippedLength <= 0)) {
      for (; this.buffers && this.skippedLength > this.buffers[0].length * 8 - this._offsetIntoBuffer; )
        this.skippedLength -= this.buffers[0].length * 8 - this._offsetIntoBuffer, this._offsetIntoBuffer = 0, this.buffers.shift();
      this.buffers.length > 0 && (this._offsetIntoBuffer += this.skippedLength, this.skippedLength = 0);
    }
  }
  /**
   * Wait until the given number of bits is available
   * @param length The number of bits to wait for
   * @param optional When true, the returned promise will resolve even if the stream ends before all bits are 
   *                 available. Otherwise, the promise will reject. 
   * @returns A promise which will resolve when the requested number of bits are available. Rejects if the stream 
   *          ends before the request is satisfied, unless optional parameter is true. 
   */
  assure(i, s = !1) {
    return this.ensureNoReadPending(), this.bufferedLength >= i ? Promise.resolve() : this.block({ length: i, assure: !0 }).then((u) => {
      if (u < i && !s)
        throw this.endOfStreamError(i);
    });
  }
  /**
   * Read an unsigned integer with the given bit length, waiting until enough bits are 
   * available for the operation. 
   * 
   * @param length The number of bits to read
   * @returns A promise which resolves to the unsigned integer once it is read
   */
  read(i) {
    return this.ensureNoReadPending(), this.available >= i ? Promise.resolve(this.readSync(i)) : this.block({ length: i });
  }
  /**
   * Read a two's complement signed integer with the given bit length, waiting until enough bits are 
   * available for the operation. 
   * 
   * @param length The number of bits to read
   * @returns A promise which resolves to the signed integer value once it is read
   */
  readSigned(i) {
    return this.ensureNoReadPending(), this.available >= i ? Promise.resolve(this.readSignedSync(i)) : this.block({ length: i, signed: !0 });
  }
  promise() {
    let i = () => {
    }, s = () => {
    };
    return { promise: new Promise((c, a) => (i = c, s = a)), resolve: i, reject: s };
  }
  block(i) {
    return this._ended ? i.assure ? Promise.resolve(this.available) : Promise.reject(this.endOfStreamError(i.length)) : (this.blockedRequest = {
      ...i,
      ...this.promise()
    }, this.blockedRequest.promise);
  }
  /**
   * Read an IEEE 754 floating point value with the given bit length, waiting until enough bits are
   * available for the operation.
   * 
   * @param length The number of bits to read (must be 32 for 32-bit single-precision or 
   *                  64 for 64-bit double-precision)
   * @returns A promise which resolves to the floating point value once it is read
   */
  readFloat(i) {
    return this.ensureNoReadPending(), this.available >= i ? Promise.resolve(this.readFloatSync(i)) : this.block({ length: i, float: !0 });
  }
  /**
   * Asynchronously read a number of the given bitlength without advancing the read head.
   * @param length The number of bits to read. If there are not enough bits available 
   * to complete the operation, the operation is delayed until enough bits become available.
   * @returns A promise which resolves iwth the number read from the bitstream
   */
  async peek(i) {
    return await this.assure(i), this.peekSync(i);
  }
  /**
   * Add a buffer onto the end of the bitstream.
   * @param buffer The buffer to add to the bitstream
   */
  addBuffer(i) {
    if (this._ended)
      throw new Error("Cannot add buffers to a reader which has been marked as ended without calling reset() first");
    if (this.buffers.push(i), this.bufferedLength += i.length * 8, this.blockedRequest && this.blockedRequest.length <= this.available) {
      let s = this.blockedRequest;
      this.blockedRequest = null, s.assure ? s.resolve(s.length) : s.signed ? s.resolve(this.readSignedSync(s.length)) : s.float ? s.resolve(this.readFloatSync(s.length)) : s.resolve(this.readSync(s.length));
    }
  }
  get ended() {
    return this._ended;
  }
  reset() {
    if (this.blockedRequest)
      throw new Error("Cannot reset while there is a blocked request!");
    this.buffers = [], this.bufferedLength = 0, this.blockedRequest = null, this._offsetIntoBuffer = 0, this._bufferIndex = 0, this._offset = 0, this._spentBufferSize = 0, this._ended = !1;
  }
  /**
   * Inform this reader that it will not receive any further buffers. Any requests to assure bits beyond the end of the 
   * buffer will result ss
   */
  end() {
    if (this._ended = !0, this.blockedRequest) {
      let i = this.blockedRequest;
      if (this.blockedRequest = null, i.length <= this.available)
        throw new Error("Internal inconsistency in @/bitstream: Should have granted request prior. Please report this bug.");
      i.assure ? i.resolve(this.available) : i.reject(this.endOfStreamError(i.length));
    }
  }
  endOfStreamError(i) {
    return new Error(`End of stream reached while reading ${i} bits, only ${this.available} bits are left in the stream`);
  }
}
function de(d) {
  const s = d.split(`
`).flatMap((p) => {
    const y = p.trim().match(/^(\d+) (\w+)$/);
    return y && parseInt(y[1], 10) > 0 ? [{ quantity: parseInt(y[1], 10), id: y[2] }] : [];
  }), u = new he(), c = new ae(u, 1024);
  return z.fromList(s).encode(c), c.end(), J.Buffer.concat([u.buffer]).toString("base64url");
}
function pe(d) {
  const i = J.Buffer.from(d, "base64url");
  let s = new ce();
  return s.addBuffer(i), z.decode(s).asCardRefQty.map((a) => `${a.quantity} ${a.id}`).join(`
`);
}
export {
  pe as decodeList,
  de as encodeList
};
