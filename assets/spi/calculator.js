/* SPI-1: the stochastic path integral calculator. UI for assets/spi/engine.js. */
(function () {
  'use strict';
  const root = document.getElementById('spi'); if (!root || !window.SPI) return;
  const SPI = window.SPI, C = SPI.C;
  const $ = (s) => root.querySelector(s), $$ = (s) => Array.from(root.querySelectorAll(s));
  const canvas = $('.spi-canvas'), ctx = canvas.getContext('2d');
  const input = $('#spi-v'), slider = $('.spi-slider'), msg = $('.spi-msg'), tape = $('.spi-tape-in');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PRESETS = {
    cubic:   { text: '-x^3/3 + x', well: -1, barrier: 1 },
    quartic: { text: 'x^4/4 - x^2/2 + 120/343*x', well: 5 / 7, barrier: 3 / 7 },
    sg:      { text: '-cos(x)', well: 0, barrier: -Math.PI },
    wiggly:  { text: '(x^2-1)^2/4 + x/4 + 2/25*sin(4x)', well: 0.9859, barrier: 0.3486 },
    sextic:  { text: 'x^6/2 - 6x^5/5 + x^4/4 + 2x^3 - 2x^2', well: 1, barrier: 0 },
    steep:   { text: 'x^4 - x^3 - x^2/2', well: 1, barrier: 0 },
  };
  const S = { mode: 'bounce', logR: -2, curves: { gauss: false, flat: false, c1: true }, pot: null, st: [], well: null, barrier: null, esc: null, res: null, rate: null, traj: null, t0: 0 };

  // ---------------------------------------------------------------- formatting
  const fmt = (x, n = 6) => { if (!isFinite(x)) return String(x); if (x === 0) return '0'; const a = Math.abs(x);
    if (a >= 1e5 || a < 1e-3) return x.toExponential(Math.max(1, n - 2)).replace('e+', 'e'); return Number(x.toPrecision(n)).toString(); };
  const pad = (s, n) => (s + ' '.repeat(n)).slice(0, Math.max(n, s.length));
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const css = (name) => getComputedStyle(root).getPropertyValue(name).trim();

  // ---------------------------------------------------------------- model
  function setPotential(text, prefer) {
    S.pot = null; S.esc = null; S.res = null; S.rate = null; S.traj = null;
    try {
      const pot = new SPI.Potential(text);
      let st = pot.stationaryPoints(-12, 12, 9000);
      if (!st.length) throw new Error('No stationary points of V found for -12 < x < 12');
      const mins = st.filter((s) => s.type === 'min');
      const pairs = [];
      st.forEach((s, i) => { if (s.type !== 'min') return;
        [i - 1, i + 1].forEach((j) => { if (st[j] && st[j].type === 'max' && st[j].V > s.V) pairs.push({ well: s, barrier: st[j], dV: st[j].V - s.V }); }); });
      if (!mins.length || !pairs.length) throw new Error('V needs a minimum with a maximum next to it: a well and a barrier');
      let pick;
      if (prefer) pick = pairs.slice().sort((a, b) => (Math.abs(a.well.x - prefer.well) + Math.abs(a.barrier.x - prefer.barrier)) - (Math.abs(b.well.x - prefer.well) + Math.abs(b.barrier.x - prefer.barrier)))[0];
      else pick = pairs.slice().sort((a, b) => a.dV - b.dV)[0];
      const shown = pairs.slice().sort((a, b) => Math.abs(a.well.x) + Math.abs(a.barrier.x) - Math.abs(b.well.x) - Math.abs(b.barrier.x)).slice(0, 4);
      if (shown.indexOf(pick) < 0) shown[3] = pick; shown.sort((a, b) => a.well.x - b.well.x || a.barrier.x - b.barrier.x);
      S.pot = pot; S.st = st; S.pairs = shown; S.text = text;
      choose(pick.well, pick.barrier);
    } catch (e) { fail(e.message); }
  }
  function choose(well, barrier) {
    try {
      S.well = well; S.barrier = barrier; S.rate = null; S.traj = null;
      S.esc = new SPI.Escape(S.pot, well.x, barrier.x); S.kink = S.esc.kink();
      buildWellKeys(); compute();
    } catch (e) { fail(e.message); }
  }
  function compute() {
    if (!S.esc) return;
    const E = S.esc, D = E.dV * Math.pow(10, S.logR); S.D = D; S.traj = null;
    $('.spi-dread').textContent = 'D = ' + fmt(D, 3) + '   D/ΔV = ' + fmt(D / E.dV, 2);
    $('.spi-st-l').textContent = 'V(x) = ' + S.text; $('.spi-st-r').textContent = 'D/ΔV = ' + fmt(D / E.dV, 2);
    try {
      const ol = E.oneLoop(D), ex = E.exactRate(D), cls = E.classify(D, S.st), hb = E.hilltop(D, E.xB);
      S.res = { ol, ex, cls, EB: hb.E, lead: E.leading(D) };
      msg.classList.remove('err');
    } catch (e) { S.res = null; say('Noise too strong for this barrier: the complex turning points have merged. Turn D down.', true); }
    printTape(); draw();
  }
  function fail(m) { S.esc = null; S.res = null; say(m, true); tape.innerHTML = '<span class="warn">' + esc(m) + '</span>'; $('.spi-wells').innerHTML = ''; draw(); }
  function say(m, isErr) { msg.textContent = m; msg.classList.toggle('err', !!isErr); }

  function buildWellKeys() {
    const box = $('.spi-wells'); box.innerHTML = '<span class="spi-wl">ESCAPE</span>';
    S.pairs.forEach((p) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'spi-key';
      const right = p.barrier.x > p.well.x;
      b.textContent = (right ? '' : '◄ ') + 'well ' + fmt(p.well.x, 3) + ' over ' + fmt(p.barrier.x, 3) + (right ? ' ►' : '');
      b.setAttribute('aria-pressed', String(p.well === S.well && p.barrier === S.barrier));
      b.addEventListener('click', () => choose(p.well, p.barrier));
      box.appendChild(b);
    });
  }
  function regime() { const r = S.kink.regularity; if (!isFinite(r)) return 'unknown'; return Math.abs(r - 1) < 2e-3 ? 'marginal' : (r > 1 ? 'regular' : 'singular'); }

  // ---------------------------------------------------------------- the paper tape
  function printTape() {
    if (!S.esc) return; const E = S.esc, k = S.kink, L = [];
    const row = (a, b, c) => pad(a, 21) + pad(b, 14) + (c || '');
    L.push('<span class="h">SPI-1   STOCHASTIC PATH INTEGRAL</span>');
    L.push('<span class="dim">dx = -V\'(x) dt + sqrt(2D) dW</span>');
    L.push(''); L.push('V(x) = ' + esc(S.text));
    L.push(row('well      x_R', fmt(S.well.x), 'V\'\' = ' + fmt(E.kR)));
    L.push(row('barrier   x_B', fmt(S.barrier.x), 'V\'\' = ' + fmt(-E.kB)));
    L.push(row('barrier height', fmt(E.dV))); L.push(row('p = (kR+kB)/2kB', fmt(E.p)));
    L.push(row('kink invariant', fmt(k.Lam), '(Lambda)'));
    const reg = regime();
    L.push(row('bounce is', reg.toUpperCase(), reg === 'regular' ? 'a path in real time' : reg === 'marginal' ? 'passes through infinity' : reg === 'singular' ? 'lives on a bent time contour' : ''));
    if (!S.res) { L.push(''); L.push('<span class="warn">D too large: no complex bounce</span>'); tape.innerHTML = L.join('\n'); return; }
    const { ol, ex, cls, lead } = S.res, s = ol.saddle, D = S.D;
    L.push(''); L.push('<span class="h">---- D = ' + fmt(D, 4) + '   (D/dV = ' + fmt(D / E.dV, 3) + ') ----</span>');
    L.push('<span class="dim">hilltops of U = -V\'^2 + 2DV\'\'</span>');
    L.push(row('E_R (well)', fmt(s.E), '~ 2D kR')); L.push(row('E_B (barrier)', fmt(S.res.EB), '~ -2D kB'));
    const rho = E.toUser(s.rho);
    L.push(row('turning point', fmt(rho[0], 5) + (rho[1] >= 0 ? ' + ' : ' - ') + fmt(Math.abs(rho[1]), 5) + ' i'));
    L.push(''); L.push('<span class="dim">what stops a path leaving the well hilltop</span>');
    cls.forEach((c) => { L.push(row((c.isBarrier ? 'barrier ' : c.type === 'min' ? 'well    ' : 'max     ') + fmt(c.x, 4), c.turning.toUpperCase(), c.turning === 'real' ? 'taller: stops you' : 'lower: sail over'));
    });
    L.push(row('=> escape saddle', 'COMPLEX BOUNCE'));
    L.push(''); L.push('<span class="h">KRAMERS, FACTOR BY FACTOR</span>');
    L.push('<span class="dim">' + row('factor', 'modulus', 'phase/pi') + '</span>');
    const P = -s.B[1] / Math.PI, Th = -s.LogC[1] / Math.PI;
    const act = Math.exp(-(s.B[0] - E.dV / D)), zm = Math.sqrt(C.abs(s.N) / (4 * Math.PI * D)), dt = 1 / Math.sqrt(C.abs(s.det)), q = Math.exp(E.p) / Math.sqrt(2 * Math.PI * E.p);
    L.push(row('action  e^-B', fmt(act, 5), fmt(P, 5))); L.push(row('zero mode', fmt(zm, 5), '0'));
    L.push(row('determinant^-1/2', fmt(dt, 5), fmt(-(Th - 0.5), 5))); L.push(row('quasi-zero mode', fmt(q, 5), '0'));
    L.push('<span class="dim">' + row('', '(x e^-dV/D)', '') + '</span>');
    const total = act * zm * dt * q;
    L.push(row('product', fmt(total, 6), fmt(P - Th + 0.5, 5) + '  (-> 1)'));
    L.push(row('Kramers prefactor', fmt(E.kramers, 6), 'sqrt(kR kB)/2pi'));
    L.push('');
    L.push('<span class="big">' + row('bounce / Kramers', fmt(ol.transported, 6)) + '</span>');
    L.push('<span class="big">' + row('exact  / Kramers', fmt(ex.ratio, 6)) + '</span>');
    L.push(row('Kramers + c1 D', fmt(1 + E.c1() * D, 6)));
    L.push('<span class="dim">' + row('Gaussian QZM', fmt(ol.gaussian, 5), '-> ' + fmt(lead.gaussian, 5)) + '</span>');
    L.push('<span class="dim">' + row('flat measure', fmt(ol.flat, 5), '-> ' + fmt(lead.flat, 5)) + '</span>');
    const off = Math.abs(ol.transported - 1), offx = Math.abs(ol.transported / ex.ratio - 1);
    L.push(''); L.push(off < 0.01 ? '<span class="ok">THE BOUNCE GIVES KRAMERS (to ' + fmt(100 * off, 2) + '%)</span>'
      : off < 0.1 ? '<span class="ok">THE BOUNCE GIVES KRAMERS to ' + fmt(100 * off, 2) + '%</span>\n<span class="dim">the gap to exact (' + fmt(100 * offx, 2) + '%) is the order-D term,\nwhich one loop does not reach</span>'
      : '<span class="warn">NOISE TOO STRONG FOR ONE LOOP: ' + fmt(100 * offx, 2) + '% from exact</span>\n<span class="dim">turn the noise down and watch it close</span>');
    L.push('<span class="dim">sign of the one-bounce term: e^(i pi) = -1,\nthe minus in exp(-rate x t) = 1 - rate x t</span>');
    L.push('<span class="dim">exact rate: mean first-passage time,\nabsorbing at x = ' + fmt(ex.xabs, 4) + '</span>');
    tape.innerHTML = L.join('\n');
  }

  // ---------------------------------------------------------------- drawing
  let W = 0, H = 0;
  function size() { const r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2.5); W = r.width; H = r.height; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  const col = () => ({ ink: css('--spi-lcd-ink'), dim: css('--spi-lcd-dim'), a: css('--spi-a'), b: css('--spi-b'), c: css('--spi-c'), grid: css('--spi-grid') });
  function text(s, x, y, color, align, size) { ctx.fillStyle = color; ctx.font = (size || 11) + 'px ' + (css('--mono') || 'monospace'); ctx.textAlign = align || 'left'; ctx.fillText(s, x, y); }
  function line(pts, color, width, dash) { if (pts.length < 2) return; ctx.beginPath(); ctx.setLineDash(dash || []); ctx.strokeStyle = color; ctx.lineWidth = width || 1.5; ctx.lineJoin = 'round';
    let pen = false; for (const p of pts) { if (!p) { pen = false; continue; } if (pen) ctx.lineTo(p[0], p[1]); else { ctx.moveTo(p[0], p[1]); pen = true; } } ctx.stroke(); ctx.setLineDash([]); }
  function dot(x, y, r, color) { ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fillStyle = color; ctx.fill(); }

  function draw() {
    size(); ctx.clearRect(0, 0, W, H); const c = col();
    if (!S.esc) { text('enter a potential with a well and a barrier', W / 2, H / 2, c.dim, 'center', 12); return; }
    if (S.mode === 'land') drawLandscape(c); else if (S.mode === 'rate') drawRate(c); else drawBounce(c);
  }

  function xRange() { const E = S.esc, xs = S.st.map((s) => s.x), w = Math.abs(S.well.x - S.barrier.x);
    const near = xs.filter((x) => Math.abs(x - S.well.x) < 4.5 * w); const lo = Math.min(...near), hi = Math.max(...near); return [lo - 0.55 * w, hi + 0.55 * w]; }

  function drawLandscape(c) {
    const E = S.esc, [x0, x1] = xRange(), n = 420, top = 26, mid = H * 0.44, bot = H - 10, L = 14, R = W - 14;
    const X = (x) => L + (R - L) * (x - x0) / (x1 - x0);
    const xs = SPI.linspace(x0, x1, n), d = xs.map((x) => S.pot.real(x));
    // --- V
    const VR = S.well.V, VB = S.barrier.V, dV = E.dV; let vlo = VR - 0.6 * dV, vhi = VB + 0.7 * dV;
    S.st.forEach((s) => { if (s.x > x0 && s.x < x1) { vlo = Math.min(vlo, s.V - 0.3 * dV); vhi = Math.max(vhi, s.V + 0.3 * dV); } });
    vlo = Math.max(vlo, VR - 3 * dV); vhi = Math.min(vhi, VB + 3 * dV);
    const YV = (v) => mid - 8 - (mid - 8 - top) * (v - vlo) / (vhi - vlo);
    ctx.save(); ctx.beginPath(); ctx.rect(L, top - 4, R - L, mid - top); ctx.clip();
    line(xs.map((x, i) => [X(x), YV(d[i][0])]), c.ink, 1.8); ctx.restore();
    text('V(x)', L + 2, top + 6, c.dim);
    dot(X(S.well.x), YV(VR), 3.5, c.b); text('well', X(S.well.x), YV(VR) + 15, c.b, 'center'); dot(X(S.barrier.x), YV(VB), 3.5, c.a); text('barrier', X(S.barrier.x), YV(VB) - 8, c.a, 'center');
    line([[L, mid], [R, mid]], c.grid, 1);
    // --- U
    text('U = -V\'^2 + 2DV\'\'', L + 2, mid + 14, c.dim);
    if (!S.res) return;
    const D = S.D, ER = S.res.ol.saddle.E, EB = S.res.EB, gap = Math.max(ER - EB, 1e-300);
    let ulo = EB - 2.6 * gap, uhi = ER + 1.3 * gap; S.res.cls.forEach((q) => { if (q.x > x0 && q.x < x1) uhi = Math.max(uhi, q.hilltopEnergy + 0.6 * gap); }); uhi = Math.min(uhi, ER + 6 * gap);
    const YU = (u) => bot - (bot - mid - 22) * (u - ulo) / (uhi - ulo);
    const U = d.map((q) => -q[1] * q[1] + 2 * D * q[2]);
    ctx.save(); ctx.beginPath(); ctx.rect(L, mid + 18, R - L, bot - mid - 14); ctx.clip();
    line(xs.map((x, i) => [X(x), YU(-d[i][1] * d[i][1])]), c.dim, 1, [3, 4]);
    line(xs.map((x, i) => [X(x), YU(U[i])]), c.b, 1.8);
    line([[L, YU(ER)], [R, YU(ER)]], c.a, 1.2, [6, 4]); ctx.restore();
    text('E_R', R - 2, YU(ER) - 5, c.a, 'right');
    const aR = E.toUser(S.res.ol.saddle.a); dot(X(aR), YU(ER), 3.5, c.a);
    S.res.cls.forEach((q) => { if (q.x < x0 || q.x > x1) return; const y = YU(Math.min(q.hilltopEnergy, uhi));
      dot(X(q.x), YU(q.hilltopEnergy), 3, q.turning === 'real' ? c.c : c.ink);
      if (q.turning === 'real') { const xa = X(q.x - q.halfWidth), xb = X(q.x + q.halfWidth); line([[xa, YU(ER) - 5], [xa, YU(ER) + 5]], c.c, 2); line([[xb, YU(ER) - 5], [xb, YU(ER) + 5]], c.c, 2); text('real stop', X(q.x), Math.max(mid + 30, y - 9), c.c, 'center', 10); }
      else text(q.isBarrier ? 'no real stop here' : 'complex', X(q.x), YU(ER) - 9, c.ink, 'center', 10); });
    say('The well hilltop is raised and the barrier hilltop lowered. At energy E_R nothing real stops the path at the barrier.');
  }

  function ensureTraj() { if (S.traj || !S.res) return; try { S.traj = S.esc.trajectory(S.D); } catch (e) { S.traj = { failed: true }; } }
  function drawBounce(c) {
    const E = S.esc; if (!S.res) return; ensureTraj(); const tr = S.traj;
    const xB = S.barrier.x, xR = S.well.x, w = Math.abs(xR - xB), rho = E.toUser(S.res.ol.saddle.rho);
    let pts = (tr && !tr.failed && tr.landed) ? tr.z : [];
    if (pts.length && pts[pts.length - 1][1] < 0) pts = pts.map((q) => [q[0], -q[1]]);
    let xmin = Math.min(xB, xR) - 0.3 * w, xmax = Math.max(xB, xR) + 0.3 * w, ymax = Math.max(0.28 * w, rho[1] * 1.6);
    pts.forEach((p) => { xmin = Math.min(xmin, p[0] - 0.08 * w); xmax = Math.max(xmax, p[0] + 0.08 * w); ymax = Math.max(ymax, Math.abs(p[1]) * 1.12); });
    const top = 24, bot = H - 22, cx = (xmin + xmax) / 2, sc = Math.min((W - 28) / (xmax - xmin), (bot - top) / (2 * ymax)), cy = (top + bot) / 2;
    const X = (x) => W / 2 + (x - cx) * sc, Y = (y) => cy - y * sc;
    // grid
    const step = Math.pow(10, Math.floor(Math.log10(w / 2))); for (let gx = Math.ceil((cx - W / 2 / sc) / step) * step; gx < cx + W / 2 / sc; gx += step) line([[X(gx), top - 6], [X(gx), bot + 6]], c.grid, 1);
    for (let gy = -Math.ceil(ymax / step) * step; gy <= ymax + 1e-12; gy += step) line([[0, Y(gy)], [W, Y(gy)]], c.grid, 1);
    line([[0, Y(0)], [W, Y(0)]], c.dim, 1); text('Re z', W - 6, Y(0) - 6, c.dim, 'right'); text('complex z-plane', 8, top - 6, c.dim);
    // cut and turning points
    line([[X(rho[0]), Y(rho[1])], [X(rho[0]), Y(-rho[1])]], c.c, 2.5);
    // paths
    if (pts.length) {
      const P1 = pts.map((p) => [X(p[0]), Y(p[1])]), P2 = pts.map((p) => [X(p[0]), Y(-p[1])]);
      ctx.globalAlpha = 0.3; line(P2, c.a, 1.5); ctx.globalAlpha = 1;
      ctx.shadowColor = c.a; ctx.shadowBlur = 8; line(P1, c.a, 2.2, tr.regular ? null : [5, 4]); ctx.shadowBlur = 0;
      // moving particle: out to the turning point and back
      const n = pts.length - 1, ph = reduceMotion ? 1 : ((performance.now() - S.t0) / 5200) % 1, u = ph < 0.5 ? ph * 2 : 2 - ph * 2;
      const ease = 0.5 - 0.5 * Math.cos(Math.PI * u), i = Math.min(n, Math.round(ease * n)); dot(P1[i][0], P1[i][1], 4.5, '#fff'); ctx.globalAlpha = 0.35; dot(P1[i][0], P1[i][1], 9, c.a); ctx.globalAlpha = 1;
    }
    dot(X(rho[0]), Y(rho[1]), 4, c.c); dot(X(rho[0]), Y(-rho[1]), 3, c.c); text('ρ', X(rho[0]) - 9, Y(rho[1]) - 7, c.c, 'right', 13);
    dot(X(xB), Y(0), 3, c.ink); text('barrier', X(xB), Y(0) + 16, c.ink, 'center'); dot(X(xR), Y(0), 3, c.b); text('well', X(xR), Y(0) + 16, c.b, 'center');
    const reg = regime();
    say(!pts.length ? 'Could not trace the bounce at this noise strength.' : tr.regular ? 'The escape path leaves the real line, turns at ρ beside the barrier top, and returns. Faint: its mirror image.'
      : reg === 'marginal' ? 'Marginal case: in real time this bounce runs through infinity. Shown: its image on the bent time contour (dashed).'
      : 'Singular case (well much stiffer than barrier): no real-time path exists. Shown: the bounce on its bent time contour (dashed).');
  }

  function ensureRate() {
    if (S.rate || !S.esc) return; const E = S.esc, xs = [], bounce = [], gauss = [], flat = [], exact = [];
    for (let r = -4; r <= -0.5 + 1e-9; r += 0.05) { const D = E.dV * Math.pow(10, r); xs.push(r);
      try { const o = E.oneLoop(D); bounce.push(o.transported); gauss.push(o.gaussian); flat.push(o.flat); } catch (e) { bounce.push(NaN); gauss.push(NaN); flat.push(NaN); }
      try { exact.push(E.exactRate(D, { n: 3000 }).ratio); } catch (e) { exact.push(NaN); } }
    S.rate = { xs, bounce, gauss, flat, exact, c1: E.c1() };
  }
  function drawRate(c) {
    ensureRate(); const E = S.esc, r = S.rate, L = 44, R = W - 14, top = 22, bot = H - 50;
    let ymax = 1.5; r.bounce.concat(r.exact).forEach((v) => { if (isFinite(v)) ymax = Math.max(ymax, Math.min(v * 1.08, 2.6)); });
    const X = (x) => L + (R - L) * (x + 4) / 3.5, Y = (y) => bot - (bot - top) * Math.min(Math.max(y, -0.2), ymax + 0.2) / ymax;
    for (let g = 0; g <= ymax + 1e-9; g += 0.5) { line([[L, Y(g)], [R, Y(g)]], c.grid, 1); text(g.toFixed(1), L - 6, Y(g) + 4, c.dim, 'right', 10); }
    for (let g = -4; g <= -0.5; g += 1) { line([[X(g), top], [X(g), bot]], c.grid, 1); text('10^' + g, X(g), bot + 14, c.dim, 'center', 10); }
    text('rate / Kramers', L + 4, top - 7, c.dim); text('D / ΔV', R, bot + 28, c.dim, 'right');
    const curve = (ys) => r.xs.map((x, i) => (isFinite(ys[i]) && ys[i] < ymax * 1.5 ? [X(x), Y(ys[i])] : null));
    ctx.save(); ctx.beginPath(); ctx.rect(L, top - 2, R - L, bot - top + 4); ctx.clip();
    line([[L, Y(1)], [R, Y(1)]], c.dim, 1.5);
    if (S.curves.c1) line(r.xs.map((x) => [X(x), Y(1 + r.c1 * E.dV * Math.pow(10, x))]), c.dim, 1.5, [5, 4]);
    if (S.curves.gauss) line(curve(r.gauss), c.c, 1.3, [2, 3]);
    if (S.curves.flat) line(curve(r.flat), c.c, 1.3);
    line(curve(r.exact), c.ink, 2.2); ctx.shadowColor = c.a; ctx.shadowBlur = 6; line(curve(r.bounce), c.a, 2.2); ctx.shadowBlur = 0;
    line([[X(S.logR), top], [X(S.logR), bot]], c.b, 1, [2, 3]); ctx.restore();
    if (S.res) { dot(X(S.logR), Y(S.res.ol.transported), 4, c.a); dot(X(S.logR), Y(S.res.ex.ratio), 4, c.ink); }
    // legend
    const items = [['exact (first-passage time)', c.ink, null], ['complex bounce, one loop', c.a, null], ['Kramers', c.dim, null]];
    if (S.curves.c1) items.push(['Kramers + first correction', c.dim, [5, 4]]); if (S.curves.flat) items.push(['flat measure', c.c, null]); if (S.curves.gauss) items.push(['Gaussian', c.c, [2, 3]]);
    let lx = L + 10, ly = bot + 31; items.forEach((it) => { const wd = ctx.measureText(it[0]).width; if (lx + wd + 34 > R - 60) { lx = L + 10; ly += 13; } line([[lx, ly - 3], [lx + 16, ly - 3]], it[1], 2, it[2]); text(it[0], lx + 21, ly, c.dim, 'left', 9.5); lx += wd * 0.9 + 44; });
    say('Orange is one loop about the complex bounce. It meets Kramers as D goes to 0; the first correction in D is beyond one loop.');
  }

  // ---------------------------------------------------------------- wiring
  function setMode(m) { S.mode = m; $$('.spi-modes .spi-key').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === m))); S.t0 = performance.now(); draw(); }
  function enter(prefer) { $$('.spi-preset').forEach((b) => b.setAttribute('aria-pressed', 'false')); setPotential(input.value.trim(), prefer); }
  $$('.spi-modes .spi-key').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $$('.spi-preset').forEach((b) => b.addEventListener('click', () => { const p = PRESETS[b.dataset.preset]; input.value = p.text; enter(p); b.setAttribute('aria-pressed', 'true'); }));
  $('.spi-enter').addEventListener('click', () => enter());
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); enter(); } });
  let pending = false; const recompute = () => { if (pending) return; pending = true; requestAnimationFrame(() => { pending = false; compute(); }); };
  slider.addEventListener('input', () => { S.logR = parseFloat(slider.value); recompute(); });
  const nudge = (f) => { S.logR = Math.min(-0.5, Math.max(-4, S.logR + Math.log10(f))); slider.value = S.logR; compute(); };
  $('[data-act="dminus"]').addEventListener('click', () => nudge(0.5)); $('[data-act="dplus"]').addEventListener('click', () => nudge(2));
  $$('.spi-toggles input').forEach((cb) => cb.addEventListener('change', () => { S.curves[cb.dataset.curve] = cb.checked; draw(); }));
  window.addEventListener('resize', draw);
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  (function loop() { if (S.mode === 'bounce' && S.esc && !reduceMotion && document.visibilityState !== 'hidden') draw(); requestAnimationFrame(loop); })();

  S.logR = parseFloat(slider.value); setMode('bounce'); input.value = PRESETS.quartic.text; enter(PRESETS.quartic);
  const first = root.querySelector('[data-preset="quartic"]'); if (first) first.setAttribute('aria-pressed', 'true');
})();
