XRegExp = XRegExp || function(a) {
    "use strict";
    function b(a, b, c) {
        var d;
        for (d in k.prototype)
            k.prototype.hasOwnProperty(d) && (a[d] = k.prototype[d]);
        return a.xregexp = {
            captureNames: b,
            isNative: !!c
        },
        a
    }
    function c(a) {
        return (a.global ? "g" : "") + (a.ignoreCase ? "i" : "") + (a.multiline ? "m" : "") + (a.extended ? "x" : "") + (a.sticky ? "y" : "")
    }
    function d(a, d, e) {
        if (!k.isRegExp(a))
            throw new TypeError("type RegExp expected");
        var f = o.replace.call(c(a) + (d || ""), w, "");
        return e && (f = o.replace.call(f, new RegExp("[" + e + "]+","g"), "")),
        a = a.xregexp && !a.xregexp.isNative ? b(k(a.source, f), a.xregexp.captureNames ? a.xregexp.captureNames.slice(0) : null) : b(new RegExp(a.source,f), null, !0)
    }
    function e(a, b) {
        var c = a.length;
        if (Array.prototype.lastIndexOf)
            return a.lastIndexOf(b);
        for (; c--; )
            if (a[c] === b)
                return c;
        return -1
    }
    function f(a, b) {
        return Object.prototype.toString.call(a).toLowerCase() === "[object " + b + "]"
    }
    function g(a) {
        return a = a || {},
        "all" === a || a.all ? a = {
            natives: !0,
            extensibility: !0
        } : f(a, "string") && (a = k.forEach(a, /[^\s,]+/, function(a) {
            this[a] = !0
        }, {})),
        a
    }
    function h(a, b, c, d) {
        var e, f, g = r.length, h = null;
        A = !0;
        try {
            for (; g--; )
                if (f = r[g],
                ("all" === f.scope || f.scope === c) && (!f.trigger || f.trigger.call(d)) && (f.pattern.lastIndex = b,
                e = p.exec.call(f.pattern, a),
                e && e.index === b)) {
                    h = {
                        output: f.handler.call(d, e, c),
                        match: e
                    };
                    break
                }
        } catch (i) {
            throw i
        } finally {
            A = !1
        }
        return h
    }
    function i(a) {
        k.addToken = l[a ? "on" : "off"],
        n.extensibility = a
    }
    function j(a) {
        RegExp.prototype.exec = (a ? p : o).exec,
        RegExp.prototype.test = (a ? p : o).test,
        String.prototype.match = (a ? p : o).match,
        String.prototype.replace = (a ? p : o).replace,
        String.prototype.split = (a ? p : o).split,
        n.natives = a
    }
    var k, l, m, n = {
        natives: !1,
        extensibility: !1
    }, o = {
        exec: RegExp.prototype.exec,
        test: RegExp.prototype.test,
        match: String.prototype.match,
        replace: String.prototype.replace,
        split: String.prototype.split
    }, p = {}, q = {}, r = [], s = "default", t = "class", u = {
        "default": /^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/,
        "class": /^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/
    }, v = /\$(?:{([\w$]+)}|(\d\d?|[\s\S]))/g, w = /([\s\S])(?=[\s\S]*\1)/g, x = /^(?:[?*+]|{\d+(?:,\d*)?})\??/, y = o.exec.call(/()??/, "")[1] === a, z = RegExp.prototype.sticky !== a, A = !1, B = "gim" + (z ? "y" : "");
    return k = function(c, e) {
        if (k.isRegExp(c)) {
            if (e !== a)
                throw new TypeError("can't supply flags when constructing one RegExp from another");
            return d(c)
        }
        if (A)
            throw new Error("can't call the XRegExp constructor within token definition functions");
        var f, g, i, j = [], l = s, m = {
            hasNamedCapture: !1,
            captureNames: [],
            hasFlag: function(a) {
                return e.indexOf(a) > -1
            }
        }, n = 0;
        if (c = c === a ? "" : String(c),
        e = e === a ? "" : String(e),
        o.match.call(e, w))
            throw new SyntaxError("invalid duplicate regular expression flag");
        for (c = o.replace.call(c, /^\(\?([\w$]+)\)/, function(a, b) {
            if (o.test.call(/[gy]/, b))
                throw new SyntaxError("can't use flag g or y in mode modifier");
            return e = o.replace.call(e + b, w, ""),
            ""
        }),
        k.forEach(e, /[\s\S]/, function(a) {
            if (B.indexOf(a[0]) < 0)
                throw new SyntaxError("invalid regular expression flag " + a[0])
        }); n < c.length; )
            f = h(c, n, l, m),
            f ? (j.push(f.output),
            n += f.match[0].length || 1) : (g = o.exec.call(u[l], c.slice(n)),
            g ? (j.push(g[0]),
            n += g[0].length) : (i = c.charAt(n),
            "[" === i ? l = t : "]" === i && (l = s),
            j.push(i),
            ++n));
        return b(new RegExp(j.join(""),o.replace.call(e, /[^gimy]+/g, "")), m.hasNamedCapture ? m.captureNames : null)
    }
    ,
    l = {
        on: function(a, b, c) {
            c = c || {},
            a && r.push({
                pattern: d(a, "g" + (z ? "y" : "")),
                handler: b,
                scope: c.scope || s,
                trigger: c.trigger || null
            }),
            c.customFlags && (B = o.replace.call(B + c.customFlags, w, ""))
        },
        off: function() {
            throw new Error("extensibility must be installed before using addToken")
        }
    },
    k.addToken = l.off,
    k.cache = function(a, b) {
        var c = a + "/" + (b || "");
        return q[c] || (q[c] = k(a, b))
    }
    ,
    k.escape = function(a) {
        return o.replace.call(a, /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    }
    ,
    k.exec = function(a, b, c, e) {
        var f, g = d(b, "g" + (e && z ? "y" : ""), e === !1 ? "y" : "");
        return g.lastIndex = c = c || 0,
        f = p.exec.call(g, a),
        e && f && f.index !== c && (f = null),
        b.global && (b.lastIndex = f ? g.lastIndex : 0),
        f
    }
    ,
    k.forEach = function(a, b, c, d) {
        for (var e, f = 0, g = -1; e = k.exec(a, b, f); )
            c.call(d, e, ++g, a, b),
            f = e.index + (e[0].length || 1);
        return d
    }
    ,
    k.globalize = function(a) {
        return d(a, "g")
    }
    ,
    k.install = function(a) {
        a = g(a),
        !n.natives && a.natives && j(!0),
        !n.extensibility && a.extensibility && i(!0)
    }
    ,
    k.isInstalled = function(a) {
        return !!n[a]
    }
    ,
    k.isRegExp = function(a) {
        return f(a, "regexp")
    }
    ,
    k.matchChain = function(a, b) {
        return function c(a, d) {
            for (var e = b[d].regex ? b[d] : {
                regex: b[d]
            }, f = [], g = function(a) {
                f.push(e.backref ? a[e.backref] || "" : a[0])
            }, h = 0; h < a.length; ++h)
                k.forEach(a[h], e.regex, g);
            return d !== b.length - 1 && f.length ? c(f, d + 1) : f
        }([a], 0)
    }
    ,
    k.replace = function(b, c, e, f) {
        var g, h = k.isRegExp(c), i = c;
        return h ? (f === a && c.global && (f = "all"),
        i = d(c, "all" === f ? "g" : "", "all" === f ? "" : "g")) : "all" === f && (i = new RegExp(k.escape(String(c)),"g")),
        g = p.replace.call(String(b), i, e),
        h && c.global && (c.lastIndex = 0),
        g
    }
    ,
    k.split = function(a, b, c) {
        return p.split.call(a, b, c)
    }
    ,
    k.test = function(a, b, c, d) {
        return !!k.exec(a, b, c, d)
    }
    ,
    k.uninstall = function(a) {
        a = g(a),
        n.natives && a.natives && j(!1),
        n.extensibility && a.extensibility && i(!1)
    }
    ,
    k.union = function(a, b) {
        var c, d, e, g, h = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g, i = 0, j = function(a, b, e) {
            var f = d[i - c];
            if (b) {
                if (++i,
                f)
                    return "(?<" + f + ">"
            } else if (e)
                return "\\" + (+e + c);
            return a
        }, l = [];
        if (!f(a, "array") || !a.length)
            throw new TypeError("patterns must be a nonempty array");
        for (g = 0; g < a.length; ++g)
            e = a[g],
            k.isRegExp(e) ? (c = i,
            d = e.xregexp && e.xregexp.captureNames || [],
            l.push(k(e.source).source.replace(h, j))) : l.push(k.escape(e));
        return k(l.join("|"), b)
    }
    ,
    k.version = "2.0.0",
    p.exec = function(b) {
        var d, f, g, h, i;
        if (this.global || (h = this.lastIndex),
        d = o.exec.apply(this, arguments)) {
            if (!y && d.length > 1 && e(d, "") > -1 && (g = new RegExp(this.source,o.replace.call(c(this), "g", "")),
            o.replace.call(String(b).slice(d.index), g, function() {
                for (var b = 1; b < arguments.length - 2; ++b)
                    arguments[b] === a && (d[b] = a)
            })),
            this.xregexp && this.xregexp.captureNames)
                for (i = 1; i < d.length; ++i)
                    f = this.xregexp.captureNames[i - 1],
                    f && (d[f] = d[i]);
            this.global && !d[0].length && this.lastIndex > d.index && (this.lastIndex = d.index)
        }
        return this.global || (this.lastIndex = h),
        d
    }
    ,
    p.test = function(a) {
        return !!p.exec.call(this, a)
    }
    ,
    p.match = function(a) {
        if (k.isRegExp(a)) {
            if (a.global) {
                var b = o.match.apply(this, arguments);
                return a.lastIndex = 0,
                b
            }
        } else
            a = new RegExp(a);
        return p.exec.call(a, this)
    }
    ,
    p.replace = function(a, b) {
        var c, d, g, h, i = k.isRegExp(a);
        return i ? (a.xregexp && (c = a.xregexp.captureNames),
        a.global || (h = a.lastIndex)) : a += "",
        f(b, "function") ? d = o.replace.call(String(this), a, function() {
            var d, e = arguments;
            if (c)
                for (e[0] = new String(e[0]),
                d = 0; d < c.length; ++d)
                    c[d] && (e[0][c[d]] = e[d + 1]);
            return i && a.global && (a.lastIndex = e[e.length - 2] + e[0].length),
            b.apply(null, e)
        }) : (g = String(this),
        d = o.replace.call(g, a, function() {
            var a = arguments;
            return o.replace.call(String(b), v, function(b, d, f) {
                var g;
                if (d) {
                    if (g = +d,
                    g <= a.length - 3)
                        return a[g] || "";
                    if (g = c ? e(c, d) : -1,
                    0 > g)
                        throw new SyntaxError("backreference to undefined group " + b);
                    return a[g + 1] || ""
                }
                if ("$" === f)
                    return "$";
                if ("&" === f || 0 == +f)
                    return a[0];
                if ("`" === f)
                    return a[a.length - 1].slice(0, a[a.length - 2]);
                if ("'" === f)
                    return a[a.length - 1].slice(a[a.length - 2] + a[0].length);
                if (f = +f,
                !isNaN(f)) {
                    if (f > a.length - 3)
                        throw new SyntaxError("backreference to undefined group " + b);
                    return a[f] || ""
                }
                throw new SyntaxError("invalid token " + b)
            })
        })),
        i && (a.lastIndex = a.global ? 0 : h),
        d
    }
    ,
    p.split = function(b, c) {
        if (!k.isRegExp(b))
            return o.split.apply(this, arguments);
        var d, e = String(this), f = b.lastIndex, g = [], h = 0;
        return c = (c === a ? -1 : c) >>> 0,
        k.forEach(e, b, function(a) {
            a.index + a[0].length > h && (g.push(e.slice(h, a.index)),
            a.length > 1 && a.index < e.length && Array.prototype.push.apply(g, a.slice(1)),
            d = a[0].length,
            h = a.index + d)
        }),
        h === e.length ? (!o.test.call(b, "") || d) && g.push("") : g.push(e.slice(h)),
        b.lastIndex = f,
        g.length > c ? g.slice(0, c) : g
    }
    ,
    m = l.on,
    m(/\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4})|x(?![\dA-Fa-f]{2}))/, function(a, b) {
        if ("B" === a[1] && b === s)
            return a[0];
        throw new SyntaxError("invalid escape " + a[0])
    }, {
        scope: "all"
    }),
    m(/\[(\^?)]/, function(a) {
        return a[1] ? "[\\s\\S]" : "\\b\\B"
    }),
    m(/(?:\(\?#[^)]*\))+/, function(a) {
        return o.test.call(x, a.input.slice(a.index + a[0].length)) ? "" : "(?:)"
    }),
    m(/\\k<([\w$]+)>/, function(a) {
        var b = isNaN(a[1]) ? e(this.captureNames, a[1]) + 1 : +a[1]
          , c = a.index + a[0].length;
        if (!b || b > this.captureNames.length)
            throw new SyntaxError("backreference to undefined group " + a[0]);
        return "\\" + b + (c === a.input.length || isNaN(a.input.charAt(c)) ? "" : "(?:)")
    }),
    m(/(?:\s+|#.*)+/, function(a) {
        return o.test.call(x, a.input.slice(a.index + a[0].length)) ? "" : "(?:)"
    }, {
        trigger: function() {
            return this.hasFlag("x")
        },
        customFlags: "x"
    }),
    m(/\./, function() {
        return "[\\s\\S]"
    }, {
        trigger: function() {
            return this.hasFlag("s")
        },
        customFlags: "s"
    }),
    m(/\(\?P?<([\w$]+)>/, function(a) {
        if (!isNaN(a[1]))
            throw new SyntaxError("can't use integer as capture name " + a[0]);
        return this.captureNames.push(a[1]),
        this.hasNamedCapture = !0,
        "("
    }),
    m(/\\(\d+)/, function(a, b) {
        if (!(b === s && /^[1-9]/.test(a[1]) && +a[1] <= this.captureNames.length) && "0" !== a[1])
            throw new SyntaxError("can't use octal escape or backreference to undefined group " + a[0]);
        return a[0]
    }, {
        scope: "all"
    }),
    m(/\((?!\?)/, function() {
        return this.hasFlag("n") ? "(?:" : (this.captureNames.push(null),
        "(")
    }, {
        customFlags: "n"
    }),
    "undefined" != typeof exports && (exports.XRegExp = k),
    k
}()