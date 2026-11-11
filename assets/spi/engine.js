/* Stochastic path integral engine.
 * dx = -V'(x) dt + sqrt(2D) dW.  U = -V'^2 + 2 D V''.  Complex bounce from the well hilltop, to one loop.
 * No dependencies. Works in the browser (window.SPI) and in node (module.exports).
 * Conventions follow "Complex paths for real stochastic processes, III" (general potential notes):
 *   internally the barrier x_B is to the LEFT of the well x_R; a potential with the barrier on the right is mirrored.
 */
(function (root) {
  'use strict';
  // ------------------------------------------------------------------ complex numbers as [re, im]
  const C = {
    of: (a, b = 0) => [a, b],
    add: (a, b) => [a[0] + b[0], a[1] + b[1]],
    sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
    mul: (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]],
    scale: (a, s) => [a[0] * s, a[1] * s],
    div: (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; },
    neg: (a) => [-a[0], -a[1]],
    conj: (a) => [a[0], -a[1]],
    abs: (a) => Math.hypot(a[0], a[1]),
    arg: (a) => Math.atan2(a[1], a[0]),
    exp: (a) => { const e = Math.exp(a[0]); return [e * Math.cos(a[1]), e * Math.sin(a[1])]; },
    log: (a) => [Math.log(Math.hypot(a[0], a[1])), Math.atan2(a[1], a[0])],
    sqrt: (a) => { const r = Math.hypot(a[0], a[1]); const s = Math.sqrt((r + Math.abs(a[0])) / 2);
      if (s === 0) return [0, 0];
      return a[0] >= 0 ? [s, a[1] / (2 * s)] : [Math.abs(a[1]) / (2 * s), a[1] >= 0 ? s : -s]; },
    sin: (a) => [Math.sin(a[0]) * Math.cosh(a[1]), Math.cos(a[0]) * Math.sinh(a[1])],
    cos: (a) => [Math.cos(a[0]) * Math.cosh(a[1]), -Math.sin(a[0]) * Math.sinh(a[1])],
    sinh: (a) => [Math.sinh(a[0]) * Math.cos(a[1]), Math.cosh(a[0]) * Math.sin(a[1])],
    cosh: (a) => [Math.cosh(a[0]) * Math.cos(a[1]), Math.sinh(a[0]) * Math.sin(a[1])],
  };

  // ------------------------------------------------------------------ truncated Taylor series ("jets") over C
  const ORD = 6;                                    // coefficients c_0..c_5, c_k = f^(k)/k!
  const J = {
    konst: (c) => { const j = new Array(ORD).fill(null).map(() => [0, 0]); j[0] = c; return j; },
    variable: (z) => { const j = J.konst(z); j[1] = [1, 0]; return j; },
    add: (a, b) => a.map((x, k) => C.add(x, b[k])),
    sub: (a, b) => a.map((x, k) => C.sub(x, b[k])),
    neg: (a) => a.map(C.neg),
    mul: (a, b) => { const r = [];
      for (let k = 0; k < ORD; k++) { let s = [0, 0]; for (let i = 0; i <= k; i++) s = C.add(s, C.mul(a[i], b[k - i])); r.push(s); } return r; },
    div: (a, b) => { const r = [];
      for (let k = 0; k < ORD; k++) { let s = a[k]; for (let i = 1; i <= k; i++) s = C.sub(s, C.mul(b[i], r[k - i])); r.push(C.div(s, b[0])); } return r; },
    exp: (a) => { const r = [C.exp(a[0])];
      for (let k = 1; k < ORD; k++) { let s = [0, 0]; for (let i = 1; i <= k; i++) s = C.add(s, C.scale(C.mul(a[i], r[k - i]), i)); r.push(C.scale(s, 1 / k)); } return r; },
    log: (a) => { const r = [C.log(a[0])];
      for (let k = 1; k < ORD; k++) { let s = [0, 0]; for (let i = 1; i < k; i++) s = C.add(s, C.scale(C.mul(r[i], a[k - i]), i));
        r.push(C.div(C.sub(a[k], C.scale(s, 1 / k)), a[0])); } return r; },
    sincos: (a, hyp) => { const s = [hyp ? C.sinh(a[0]) : C.sin(a[0])], c = [hyp ? C.cosh(a[0]) : C.cos(a[0])];
      for (let k = 1; k < ORD; k++) { let ss = [0, 0], cc = [0, 0];
        for (let i = 1; i <= k; i++) { ss = C.add(ss, C.scale(C.mul(a[i], c[k - i]), i)); cc = C.add(cc, C.scale(C.mul(a[i], s[k - i]), i)); }
        s.push(C.scale(ss, 1 / k)); c.push(C.scale(cc, (hyp ? 1 : -1) / k)); }
      return [s, c]; },
    powi: (a, n) => { let r = J.konst([1, 0]), b = a, m = Math.abs(n);
      while (m > 0) { if (m & 1) r = J.mul(r, b); b = J.mul(b, b); m >>= 1; }
      return n < 0 ? J.div(J.konst([1, 0]), r) : r; },
    pow: (a, b) => J.exp(J.mul(b, J.log(a))),
  };

  // ------------------------------------------------------------------ expression parser:  V(x) as text -> jet evaluator
  const FUNCS = {
    sin: (a) => J.sincos(a, false)[0], cos: (a) => J.sincos(a, false)[1],
    tan: (a) => { const sc = J.sincos(a, false); return J.div(sc[0], sc[1]); },
    sinh: (a) => J.sincos(a, true)[0], cosh: (a) => J.sincos(a, true)[1],
    tanh: (a) => { const sc = J.sincos(a, true); return J.div(sc[0], sc[1]); },
    exp: J.exp, log: J.log, ln: J.log, sqrt: (a) => J.pow(a, J.konst([0.5, 0])),
  };
  function tokenize(src) {
    const out = []; let i = 0; const s = src.replace(/\*\*/g, '^').replace(/[−–]/g, '-').replace(/[·×]/g, '*');
    while (i < s.length) {
      const ch = s[i];
      if (/\s/.test(ch)) { i++; continue; }
      if (/[0-9.]/.test(ch)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++;
        if (j < s.length && /[eE]/.test(s[j]) && /[-+0-9]/.test(s[j + 1] || '')) { j += 2; while (j < s.length && /[0-9]/.test(s[j])) j++; }
        const v = Number(s.slice(i, j)); if (!isFinite(v)) throw new Error('Bad number "' + s.slice(i, j) + '"');
        out.push({ t: 'num', v }); i = j; continue; }
      if (/[A-Za-z_]/.test(ch)) { let j = i; while (j < s.length && /[A-Za-z_0-9]/.test(s[j])) j++; out.push({ t: 'id', v: s.slice(i, j) }); i = j; continue; }
      if ('+-*/^()'.includes(ch)) { out.push({ t: ch }); i++; continue; }
      throw new Error('Unexpected character "' + ch + '"');
    }
    return out;
  }
  function parse(src) {
    const tk = tokenize(src); let pos = 0;
    const peek = () => tk[pos], next = () => tk[pos++];
    const startsAtom = (t) => t && (t.t === 'num' || t.t === 'id' || t.t === '(');
    function expr() { let n = term(); while (peek() && (peek().t === '+' || peek().t === '-')) { const op = next().t; n = { op, a: n, b: term() }; } return n; }
    function term() { let n = unary();
      for (;;) { const t = peek();
        if (t && (t.t === '*' || t.t === '/')) { next(); n = { op: t.t, a: n, b: unary() }; }
        else if (startsAtom(t)) { n = { op: '*', a: n, b: power() }; }       // implicit multiplication: 2x, x(x-1), 3 sin(x)
        else break; }
      return n; }
    function unary() { const t = peek(); if (t && t.t === '-') { next(); return { op: 'neg', a: unary() }; } if (t && t.t === '+') { next(); return unary(); } return power(); }
    function power() { const b = atom(); if (peek() && peek().t === '^') { next(); return { op: '^', a: b, b: unary() }; } return b; }
    function atom() { const t = next(); if (!t) throw new Error('Unexpected end of expression');
      if (t.t === 'num') return { op: 'num', v: t.v };
      if (t.t === '(') { const n = expr(); if (!peek() || next().t !== ')') throw new Error('Missing ")"'); return n; }
      if (t.t === 'id') {
        if (t.v === 'x') return { op: 'x' };
        if (t.v === 'pi') return { op: 'num', v: Math.PI };
        if (t.v === 'e') return { op: 'num', v: Math.E };
        if (FUNCS[t.v]) { if (!peek() || next().t !== '(') throw new Error(t.v + ' needs brackets: ' + t.v + '(...)'); const n = expr();
          if (!peek() || next().t !== ')') throw new Error('Missing ")"'); return { op: 'fn', f: t.v, a: n }; }
        throw new Error('Unknown name "' + t.v + '" (the variable is x)');
      }
      throw new Error('Unexpected "' + t.t + '"');
    }
    const ast = expr(); if (pos < tk.length) throw new Error('Unexpected "' + (tk[pos].v !== undefined ? tk[pos].v : tk[pos].t) + '"');
    const isConst = (n) => n.op === 'num' || (n.op === 'neg' && isConst(n.a)) || (('+-*/^'.includes(n.op)) && n.a && n.b && isConst(n.a) && isConst(n.b));
    const constVal = (n) => n.op === 'num' ? n.v : n.op === 'neg' ? -constVal(n.a) : n.op === '+' ? constVal(n.a) + constVal(n.b) : n.op === '-' ? constVal(n.a) - constVal(n.b)
      : n.op === '*' ? constVal(n.a) * constVal(n.b) : n.op === '/' ? constVal(n.a) / constVal(n.b) : Math.pow(constVal(n.a), constVal(n.b));
    function ev(n, z) {
      switch (n.op) {
        case 'num': return J.konst([n.v, 0]);
        case 'x': return J.variable(z);
        case 'neg': return J.neg(ev(n.a, z));
        case '+': return J.add(ev(n.a, z), ev(n.b, z));
        case '-': return J.sub(ev(n.a, z), ev(n.b, z));
        case '*': return J.mul(ev(n.a, z), ev(n.b, z));
        case '/': return J.div(ev(n.a, z), ev(n.b, z));
        case '^': if (isConst(n.b)) { const e = constVal(n.b); if (Number.isInteger(e) && Math.abs(e) <= 64) return J.powi(ev(n.a, z), e); }
          return J.pow(ev(n.a, z), ev(n.b, z));
        case 'fn': return FUNCS[n.f](ev(n.a, z));
      }
      throw new Error('internal');
    }
    return (z) => ev(ast, z);
  }

  // ------------------------------------------------------------------ numerics
  // Gauss-Legendre nodes and weights on [-1, 1]
  function gaussLegendre(n) {
    const x = [], w = [];
    for (let i = 0; i < n; i++) {
      let t = Math.cos(Math.PI * (i + 0.75) / (n + 0.5)), dp = 1;
      for (let it = 0; it < 100; it++) {
        let p0 = 1, p1 = t;
        for (let k = 2; k <= n; k++) { const p2 = ((2 * k - 1) * t * p1 - (k - 1) * p0) / k; p0 = p1; p1 = p2; }
        dp = n * (t * p1 - p0) / (t * t - 1); const dt = p1 / dp; t -= dt; if (Math.abs(dt) < 1e-16) break;
      }
      x.push(t); w.push(2 / ((1 - t * t) * dp * dp));
    }
    return { x, w };
  }
  const GL = gaussLegendre(24);
  /** integral of a complex- or real-valued F over the real nodes list [t0, t1, ..., tm] (composite Gauss-Legendre). */
  function quad(F, nodes) {
    let s = [0, 0];
    for (let k = 0; k + 1 < nodes.length; k++) {
      const a = nodes[k], b = nodes[k + 1], h = (b - a) / 2, m = (a + b) / 2;
      for (let i = 0; i < GL.x.length; i++) { let v = F(m + h * GL.x[i]); if (typeof v === 'number') v = [v, 0]; s = C.add(s, C.scale(v, h * GL.w[i])); }
    }
    return s;
  }
  const linspace = (a, b, n) => Array.from({ length: n }, (_, i) => a + (b - a) * i / (n - 1));
  function newtonC(F, dF, z0, tol = 1e-15, itmax = 80) {
    let z = z0;
    for (let i = 0; i < itmax; i++) { const dz = C.div(F(z), dF(z)); z = C.sub(z, dz); if (C.abs(dz) < tol * (1 + C.abs(z))) return z; }
    throw new Error('Newton iteration did not converge');
  }

  // ------------------------------------------------------------------ the potential
  function Potential(text) {
    const jet = parse(text);
    const FACT = [1, 1, 2, 6, 24, 120];
    /** derivs(z)[k] = V^(k)(z), k = 0..5, for complex z given as [re, im]. */
    this.text = text;
    this.derivs = (z) => jet(z).map((c, k) => C.scale(c, FACT[k]));
    this.real = (x) => this.derivs([x, 0]).map((c) => c[0]);
    this.V = (x) => this.real(x)[0];
    // probe: the expression must be finite and real on the real axis somewhere
    const d = this.derivs([0.1234, 0]); if (!d.every((c) => isFinite(c[0]) && isFinite(c[1]))) { /* may still be fine elsewhere */ }
  }
  /** stationary points of V on [xmin, xmax]: [{x, type:'min'|'max', V, curvature}], sorted. */
  Potential.prototype.stationaryPoints = function (xmin, xmax, n = 4000) {
    const pts = []; let xp = xmin, fp = this.real(xp)[1];
    for (let i = 1; i <= n; i++) {
      const x = xmin + (xmax - xmin) * (i - 0.381966) / n, f = this.real(x)[1];      // offset grid: never lands exactly on a root
      if (isFinite(f) && isFinite(fp) && fp * f < 0) {
        let a = xp, b = x, fa = fp;
        for (let it = 0; it < 80; it++) { const m = (a + b) / 2, fm = this.real(m)[1]; if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
        let r = (a + b) / 2;
        for (let it = 0; it < 4; it++) { const d = this.real(r); if (d[2] !== 0) r -= d[1] / d[2]; }
        const d = this.real(r);
        if (Math.abs(d[2]) > 1e-9) pts.push({ x: r, type: d[2] > 0 ? 'min' : 'max', V: d[0], curvature: d[2] });
      }
      xp = x; fp = f;
    }
    return pts;
  };

  // ------------------------------------------------------------------ the escape problem  well x_R  over barrier x_B
  function Escape(pot, xWell, xBarrier) {
    this.pot = pot; this.mirror = xBarrier > xWell;                  // internally x_B < x_R
    const sgn = this.mirror ? -1 : 1;
    // derivatives of the (possibly mirrored) potential W(y) = V(sgn*y):  W^(k)(y) = sgn^k V^(k)(sgn y)
    this.d = (z) => { const v = pot.derivs(C.scale(z, sgn)); return v.map((c, k) => (k % 2 ? C.scale(c, sgn) : c)); };
    this.dr = (x) => this.d([x, 0]).map((c) => c[0]);
    this.toUser = (z) => (typeof z === 'number' ? sgn * z : [sgn * z[0], z[1]]);      // mirror the real part only
    this.xR = sgn * xWell; this.xB = sgn * xBarrier;
    const dR = this.dr(this.xR), dB = this.dr(this.xB);
    this.kR = dR[2]; this.kB = -dB[2];
    if (!(this.kR > 0)) throw new Error('The chosen well is not a minimum of V');
    if (!(this.kB > 0)) throw new Error('The chosen barrier is not a maximum of V');
    this.dV = dB[0] - dR[0];
    if (!(this.dV > 0)) throw new Error('The barrier must be higher than the well');
    this.p = (this.kR + this.kB) / (2 * this.kB);
    this.lam = Math.sqrt(4 * this.p / this.kB);
    this.kramers = Math.sqrt(this.kR * this.kB) / (2 * Math.PI);    // prefactor; rate = kramers * exp(-dV/D)
    // f must be negative strictly between x_B and x_R (adjacent stationary points)
    for (const x of linspace(this.xB, this.xR, 203).slice(1, -1)) if (!(this.dr(x)[1] < 0)) throw new Error('The well and the barrier must be adjacent stationary points');
  }
  /** D = 0 kink constants (kink centred at the mid-point) and everything built from them. */
  Escape.prototype.kink = function () {
    if (this._kink) return this._kink;
    const { xB, xR, kB, kR, p, dV } = this, m = (xB + xR) / 2;
    const f = (q) => this.dr(q)[1], f1 = (q) => this.dr(q)[2];
    const JB = quad((q) => 1 / (-f(q)) - 1 / (kB * (q - xB)), linspace(xB, m, 9))[0];
    const JR = quad((q) => 1 / (-f(q)) - 1 / (kR * (xR - q)), linspace(m, xR, 9))[0];
    const AB = (m - xB) * Math.exp(kB * JB), AR = (xR - m) * Math.exp(kR * JR);
    const Jint = quad((q) => 1 / (-f(q)) - 1 / (kB * (q - xB)) - 1 / (kR * (xR - q)), linspace(xB, xR, 17))[0];
    const Lam = Math.pow(xR - xB, 2 * p) * Math.exp(kR * Jint);
    const reg = quad((z) => (kR - f1(z)) / (-f(z)) - 2 * p / (z - xB), linspace(xB, xR, 17))[0];
    const CR_quad = 2 * p * (Math.log(2 * (xR - xB) / this.lam) + 0.5) + reg;
    const g = kB * AB * AB, c0 = Math.log(kR * AR / (kB * AB));
    const CR = p + p * Math.log(kB / p) + Math.log(kR / kB) + Math.log(Lam);
    const C0 = Lam * Math.pow(kB / p, p - 0.5);
    // strip of analyticity: sigma_V = |Im int_m^{+i inf} dq / V'(q)|
    let sigma = NaN;
    try {
      const v = quad((t) => { const y = t / (1 - t); const fz = this.d([m, y])[1];
        if (!isFinite(fz[0]) || !isFinite(fz[1])) return [0, 0];                 // V' has overflowed: the integrand is zero
        const r = C.scale(C.div([0, 1], fz), 1 / ((1 - t) * (1 - t))); return isFinite(r[0]) && isFinite(r[1]) ? r : [0, 0]; }, linspace(0, 1, 161));
      sigma = Math.abs(v[1]);
    } catch (e) { /* leave NaN */ }
    this._kink = { m, AB, AR, Lam, g, c0, CR, CR_quad, C0, Kdet: dV / (kR ** 3 * C0 * C0), Kkink: dV / (kB * AB * kR * AR), sigma,
      regularity: 2 * kB * sigma / Math.PI };
    return this._kink;
  };
  Escape.prototype.U = function (z, D) { const d = this.d(z); return C.add(C.neg(C.mul(d[1], d[1])), C.scale(d[2], 2 * D)); };
  Escape.prototype.U1 = function (z, D) { const d = this.d(z); return C.add(C.scale(C.mul(d[1], d[2]), -2), C.scale(d[3], 2 * D)); };
  Escape.prototype.U2 = function (z, D) { const d = this.d(z); return C.add(C.add(C.scale(C.mul(d[2], d[2]), -2), C.scale(C.mul(d[1], d[3]), -2)), C.scale(d[4], 2 * D)); };
  Escape.prototype.U3 = function (z, D) { const d = this.d(z); return C.add(C.add(C.scale(C.mul(d[2], d[3]), -6), C.scale(C.mul(d[1], d[4]), -2)), C.scale(d[5], 2 * D)); };
  /** hilltop of U near a stationary point x0 of V: {a, E, Om2} (all real). */
  Escape.prototype.hilltop = function (D, x0) {
    if (x0 === undefined) x0 = this.xR;
    const d0 = this.dr(x0); let a = x0 + D * d0[3] / (d0[2] * d0[2]);
    for (let i = 0; i < 60; i++) { const da = this.U1([a, 0], D)[0] / this.U2([a, 0], D)[0]; a -= da; if (Math.abs(da) < 1e-15 * (1 + Math.abs(a))) break; }
    const E = this.U([a, 0], D)[0], Om2 = -this.U2([a, 0], D)[0] / 2;
    return { a, E, Om2, Om: Math.sqrt(Math.abs(Om2)) };
  };
  /** complex turning point beside the barrier at energy E (sign = +1: upper half-plane). */
  Escape.prototype.turning = function (D, E, sign = 1) {
    const r1 = -this.kR * this.dr(this.xB)[3] / this.kB ** 3;
    const z0 = [this.xB + r1 * D, sign * this.lam * Math.sqrt(D)];
    const rho = newtonC((z) => C.scale(C.sub([E, 0], this.U(z, D)), 1 / D), (z) => C.scale(C.neg(this.U1(z, D)), 1 / D), z0);
    if (C.abs(C.sub(rho, z0)) > 0.5 * this.lam * Math.sqrt(D) + 20 * D) throw new Error('Turning point not found: D is too large for this barrier');
    return rho;
  };
  /** exact saddle data at noise strength D:  action integral I, tail amplitude C, determinant (master formula). */
  Escape.prototype.saddle = function (D, sign = 1) {
    const { a, E, Om } = this.hilltop(D);
    const rho = this.turning(D, E, sign), rhob = C.conj(rho);
    const aC = [a, 0], w = C.sub(aC, rho), sw = C.sqrt(w);
    const parts = (s) => {
      const z = C.add(rho, C.scale(w, s * s)), az = C.sub(aC, z);
      const G = C.sub([E, 0], this.U(z, D));
      const R = C.div(G, C.mul(C.mul(az, az), C.mul(C.sub(z, rho), C.sub(z, rhob))));
      return { z, az, q: C.mul(C.mul(sw, C.sqrt(C.sub(z, rhob))), C.sqrt(R)) };     // q = sqrt(Q)/s
    };
    const sg = parts(1 - 1e-9).q[0] > 0 ? 1 : -1;
    const sIn = Math.min(0.5, 4 * Math.sqrt(C.abs(C.sub(rho, rhob)) / C.abs(w)));
    const nodes = [0, sIn / 16, sIn / 4, sIn, (1 + 3 * sIn) / 4, (1 + sIn) / 2, (3 + sIn) / 4, 1];
    const I = quad((s) => { const { az, q } = parts(s); return C.scale(C.mul(C.mul(az, q), w), sg * 2 * s * s); }, nodes);
    const Cint = quad((s) => { const { az, q } = parts(s); const t = C.sub(C.div([Om, 0], C.scale(q, sg * s)), [1, 0]); return C.scale(C.mul(C.div(t, az), w), 2 * s); }, nodes);
    const LogC = C.add(C.log(w), Cint), Camp = C.exp(LogC);
    const det = C.neg(C.div(I, C.scale(C.mul(Camp, Camp), Om ** 3)));
    const B = C.scale(I, 1 / D);
    return { D, a, E, Om, rho, I, B, LogC, C: Camp, det, N: C.scale(I, 2) };
  };
  /** one-bounce rate from the complex bounce, in units of the Kramers PREFACTOR times exp(-dV/D):
   *   gaussian   : quasi-zero mode integrated as a Gaussian
   *   flat       : exact thimble integral, flat measure
   *   transported: exact thimble integral with the one-loop transport factor (the result of the notes)  */
  Escape.prototype.oneLoop = function (D) {
    const s = this.saddle(D), p = this.p;
    // |G| = exp(-Re B) * Om^{3/2} |C| / sqrt(2 pi D)
    const logG = -s.B[0] + 1.5 * Math.log(s.Om) + s.LogC[0] - 0.5 * Math.log(2 * Math.PI * D);
    const gauss = Math.exp(logG + this.dV / D) / this.kramers;        // -> sqrt(2 pi p) e^{-p}
    const corr = Math.exp(p) / Math.sqrt(2 * Math.PI * p);
    return { saddle: s, gaussian: gauss, transported: gauss * corr, flat: gauss * corr * gammaFn(p) * Math.pow(p, 1 - p) / 1,
      phaseAction: -s.B[1], logRate: logG + Math.log(corr) };
  };
  /** Kramers and its classical first correction, in units of kramers*exp(-dV/D). */
  Escape.prototype.c1 = function () {
    const r = this.dr(this.xR), b = this.dr(this.xB), kR = this.kR, kB = this.kB;
    return -(5 * r[3] ** 2 / (24 * kR ** 3) - r[4] / (8 * kR ** 2) + 5 * b[3] ** 2 / (24 * kB ** 3) + b[4] / (8 * kB ** 2));
  };
  /** leading-order closed forms of the notes (R1-R4), for display next to the exact numbers. */
  Escape.prototype.leading = function (D) {
    const k = this.kink(), { p, kB, kR, dV } = this;
    return { ReB: dV / D - p * Math.log(D) + k.CR, ImB: -p * Math.PI, absC: k.C0 * Math.pow(D, -(p - 0.5)), argC: -(p - 0.5) * Math.PI,
      absDet: k.Kdet * Math.pow(D, 2 * p - 1), argDet: 2 * Math.PI * (p - 1), gaussian: Math.sqrt(2 * Math.PI * p) * Math.exp(-p),
      flat: gammaFn(p) * Math.pow(p, 1 - p), transported: 1, tauStarRe: Math.log(k.g / (p * D)) / kB, tauStarIm: -Math.PI / kB,
      softMode: 4 * p * kB * kB * D / dV };
  };
  /** Exact rate from the mean first-passage time, in units of kramers*exp(-dV/D).
   *  T = (1/D) int_{x_abs}^{x_R} dy e^{V(y)/D} int_y^{x_up} dz e^{-V(z)/D};  rate = 1/T.
   *  x_abs: absorbing point beyond the barrier; x_up: reflecting point beyond the well (both chosen automatically). */
  Escape.prototype.exactRate = function (D, opts = {}) {
    const { xB, xR } = this, VR = this.dr(xR)[0], VB = this.dr(xB)[0], w = xR - xB;
    // reflecting wall: walk right until V - V_R > 40 D (or a maximum is met, or 8 widths)
    let xup = opts.xup;
    if (xup === undefined) { xup = xR; const h = w / 400; for (let i = 0; i < 3200; i++) { const d = this.dr(xup + h); if (!isFinite(d[0]) || d[0] - VR > 40 * D || d[1] < 0) break; xup += h; } }
    // absorbing point: walk left from the barrier until V has dropped below V_R - 0.0*... i.e. to the next minimum or V <= V_R - 5D, whichever first
    let xabs = opts.xabs;
    if (xabs === undefined) { xabs = xB; const h = w / 400; for (let i = 0; i < 3200; i++) { const d = this.dr(xabs - h); if (!isFinite(d[0])) break; xabs -= h; if (d[1] < 0 && i > 2) break; if (d[0] < Math.min(VR, VB - 40 * D) - 5 * D) break; } }
    const n = opts.n || 6000, h = (xup - xabs) / n;
    // inner cumulative integral from the right, with the constant V_R removed; outer with V_B removed
    const xs = new Array(n + 1), eIn = new Array(n + 1), eOut = new Array(n + 1);
    for (let i = 0; i <= n; i++) { const x = xabs + i * h, V = this.dr(x)[0]; xs[i] = x; eIn[i] = Math.exp(-(V - VR) / D); eOut[i] = Math.exp((V - VB) / D); }
    const inner = new Array(n + 1).fill(0);
    for (let i = n - 1; i >= 0; i--) inner[i] = inner[i + 1] + 0.5 * h * (eIn[i] + eIn[i + 1]);
    let T = 0; const iR = Math.round((xR - xabs) / h);
    for (let i = 0; i < iR; i++) T += 0.5 * h * (eOut[i] * inner[i] + eOut[i + 1] * inner[i + 1]);
    T /= D;                                                             // in units of exp(dV/D)
    return { ratio: 1 / (T * this.kramers), xabs: this.toUser(xabs), xup: this.toUser(xup) };
  };
  /** The bounce as a curve in the z-plane (user coordinates), for drawing.
   *  Integrated backwards from the well tail, first along the real time axis. If that does not land on the turning
   *  point the bounce is not a regular real-time path, and the contour through Im t = -pi/(2 kB) is used instead.
   *  Returns { z: [[re, im], ...] from the hilltop to rho, t: [...], regular: bool, miss } for the + saddle. */
  Escape.prototype.trajectory = function (D, nSteps = 2400) {
    const s = this.saddle(D), a = s.a, Om = s.Om, Camp = s.C, rho = s.rho, w = this.xR - this.xB;
    const b = this.U3([a, 0], D)[0] / (12 * Om * Om);
    const eps = 1e-4 * w, tL = Math.log(C.abs(Camp) / eps) / Om;
    const e0 = C.scale(Camp, Math.exp(-Om * tL)), e2 = C.mul(e0, e0);
    const start = [C.sub([a, 0], C.add(e0, C.scale(e2, b))), C.add(C.scale(e0, Om), C.scale(e2, 2 * Om * b))];
    const acc = (z) => { const d = this.d(z); return C.sub(C.mul(d[1], d[2]), C.scale(d[3], D)); };   // equation of motion
    const run = (legs) => {
      let z = start[0], v = start[1]; const zs = [z], ts = [[tL, 0]]; let t = [tL, 0], ok = true;
      for (const [target, n] of legs) {
        const dt = C.scale(C.sub(target, t), 1 / n);
        for (let i = 0; i < n; i++) {
          const k1z = v, k1v = acc(z);
          const z2 = C.add(z, C.scale(C.mul(dt, k1z), 0.5)), v2 = C.add(v, C.scale(C.mul(dt, k1v), 0.5)), k2v = acc(z2);
          const z3 = C.add(z, C.scale(C.mul(dt, v2), 0.5)), v3 = C.add(v, C.scale(C.mul(dt, k2v), 0.5)), k3v = acc(z3);
          const z4 = C.add(z, C.mul(dt, v3)), v4 = C.add(v, C.mul(dt, k3v)), k4v = acc(z4);
          z = C.add(z, C.scale(C.mul(dt, C.add(C.add(k1z, C.scale(v2, 2)), C.add(C.scale(v3, 2), v4))), 1 / 6));
          v = C.add(v, C.scale(C.mul(dt, C.add(C.add(k1v, C.scale(k2v, 2)), C.add(C.scale(k3v, 2), k4v))), 1 / 6));
          if (!isFinite(z[0]) || !isFinite(z[1]) || C.abs(z) > 1e3 * (1 + Math.abs(this.xR) + w)) { ok = false; break; }
          zs.push(z); t = C.add(t, dt); ts.push(t);
        }
        if (!ok) break; t = target;
      }
      return { zs, ts, miss: ok ? C.abs(C.sub(z, rho)) : Infinity };
    };
    const tol = 2e-3 * (this.lam * Math.sqrt(D) + 1e-3 * w);
    let r = run([[[0, 0], nSteps]]); const regular = r.miss < tol;
    if (!regular) { const y = -Math.PI / (2 * this.kB); r = run([[[tL, y], nSteps / 4], [[0, y], nSteps], [[0, 0], nSteps / 4]]); }
    return { z: r.zs.map((q) => this.toUser(q)), t: r.ts, regular, miss: r.miss, landed: r.miss < 20 * tol, tL, saddle: s };
  };

  /** which saddles exist at noise D: the classification of turning points beside every other stationary point. */
  Escape.prototype.classify = function (D, stationary) {
    const ER = this.hilltop(D).E, out = [];
    for (const s of stationary) {
      const y = (this.mirror ? -1 : 1) * s.x;
      if (Math.abs(y - this.xR) < 1e-9) continue;
      const h = this.hilltop(D, y), gap = h.E - ER, k = Math.abs(s.curvature);
      out.push({ x: s.x, type: s.type, hilltopEnergy: h.E, wellEnergy: ER, turning: gap > 0 ? 'real' : 'complex', halfWidth: Math.sqrt(Math.abs(gap)) / k,
        isBarrier: Math.abs(y - this.xB) < 1e-9 });
    }
    return out;
  };

  function gammaFn(x) {                                                // Lanczos, x > 0
    const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gammaFn(1 - x));
    x -= 1; let a = c[0]; const t = x + g + 0.5; for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
    return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
  }

  const SPI = { C, J, parse, Potential, Escape, quad, linspace, gammaFn, version: '0.1' };
  if (typeof module !== 'undefined' && module.exports) module.exports = SPI; else root.SPI = SPI;
})(typeof window !== 'undefined' ? window : globalThis);
