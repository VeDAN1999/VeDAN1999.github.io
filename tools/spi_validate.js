#!/usr/bin/env node
/* Validate assets/spi/engine.js against the 30-digit Python reference (tools/spi_reference.json).
   Usage: node tools/spi_validate.js      exits non-zero if any quantity disagrees beyond tolerance. */
const SPI = require('../assets/spi/engine.js'), ref = require('./spi_reference.json');
let worst = 0, fails = 0;
const chk = (name, got, want, tol, abs = false) => {
  const err = abs ? Math.abs(got - want) : Math.abs(got - want) / Math.max(1e-300, Math.abs(want));
  worst = Math.max(worst, err / tol);
  if (!(err <= tol)) { fails++; console.log(`   FAIL ${name}: got ${got}, want ${want}, err ${err.toExponential(2)} (tol ${tol})`); }
};
const wrap = (x) => Math.atan2(Math.sin(x), Math.cos(x));
for (const [name, r] of Object.entries(ref)) {
  const P = new SPI.Potential(r.text), E = new SPI.Escape(P, r.xR, r.xB), k = E.kink();
  const st = P.stationaryPoints(r.xB - 2, r.xR + 1.5);
  chk('finds x_B', Math.min(...st.map((s) => Math.abs(s.x - r.xB))), 0, 1e-10, true);
  chk('finds x_R', Math.min(...st.map((s) => Math.abs(s.x - r.xR))), 0, 1e-10, true);
  chk('kB', E.kB, r.kB, 1e-11); chk('kR', E.kR, r.kR, 1e-11); chk('dV', E.dV, r.dV, 1e-11); chk('p', E.p, r.p, 1e-11);
  chk('Lambda', k.Lam, r.Lam, 1e-9); chk('C_R', k.CR, r.CR, 1e-9, true); chk('C_R (second quadrature)', k.CR_quad, r.CR, 1e-9, true);
  chk('C_0', k.C0, r.C0, 1e-9);
  { const want = { cubic: 2, 'sine-Gordon': 1, quartic: 22 / 13, steep: 0.4, sextic: 22 / 13, exponential: 2 / 3, sinusoidal: 1.0711 }[name]; chk('regularity ratio', k.regularity, want, name === 'exponential' ? 5e-3 : 2e-4); } chk('g', k.g, r.g, 1e-9); chk('c_0', k.c0, r.c0, 1e-9, true); chk('c_1', E.c1(), r.c1, 1e-9);
  for (const run of r.runs) {
    const s = E.saddle(run.D), tag = ` (D=${run.D.toExponential(2)})`;
    chk('a' + tag, s.a, run.a, 1e-12); chk('E' + tag, s.E, run.E, 1e-10); chk('Omega' + tag, s.Om, run.Om, 1e-11);
    chk('Re rho' + tag, s.rho[0], run.rho[0], 1e-11, true); chk('Im rho' + tag, s.rho[1], run.rho[1], 1e-11, true);
    chk('Re B - dV/D' + tag, s.B[0] - E.dV / run.D, run.ReB_minus, 2e-8, true); chk('Im B' + tag, s.B[1], run.ImB, 2e-8, true);
    chk('log|C|' + tag, s.LogC[0], run.logabsC, 2e-8, true); chk('arg C' + tag, wrap(s.LogC[1] - run.argC), 0, 2e-8, true);
    chk('log|det|' + tag, Math.log(SPI.C.abs(s.det)), run.logabsdet, 5e-8, true);
    // the reference factorises the mean first-passage time into two Laplace integrals; with a second well 2.3 D below the
    // barrier (steep quartic at its largest D) that factorisation and the full double integral legitimately differ
    chk('exact rate' + tag, E.exactRate(run.D, { n: 40000 }).ratio, run.exact, name === 'steep' && run === r.runs[0] ? 3e-2 : 2e-5);
  }
  const ol = E.oneLoop(r.runs[2].D);
  console.log(`${name.padEnd(12)} p=${E.p.toFixed(4)}  regularity=${k.regularity.toFixed(4)}  one-loop/Kramers at D/dV=1e-4: ${ol.transported.toFixed(6)}  (gaussian ${ol.gaussian.toFixed(5)}, leading ${E.leading(1).gaussian.toFixed(5)})`);
}
// mirrored orientation: the cubic with the barrier on the right must give identical numbers
{ const A = new SPI.Escape(new SPI.Potential('x^3/3 - x'), 1, -1), B = new SPI.Escape(new SPI.Potential('-x^3/3 + x'), -1, 1);
  chk('mirror: Lambda', B.kink().Lam, A.kink().Lam, 1e-12); chk('mirror: Re B', B.saddle(1e-3).B[0], A.saddle(1e-3).B[0], 1e-12);
  chk('mirror: exact', B.exactRate(1e-2).ratio, A.exactRate(1e-2).ratio, 1e-9); }
// parser spot checks
{ const d = new SPI.Potential('2x^2(x-1) + 3 sin(2x)/x - e^(-x^2) + sqrt(1+x^2) + tanh(x) + x**3').real(0.7);
  const h = 1e-5, f = (x) => 2*x*x*(x-1) + 3*Math.sin(2*x)/x - Math.exp(-x*x) + Math.sqrt(1+x*x) + Math.tanh(x) + x**3;
  chk('parser value', d[0], f(0.7), 1e-13); chk('parser V\'', d[1], (f(0.7+h)-f(0.7-h))/(2*h), 1e-8); chk('parser V\'\'', d[2], (f(0.7+h)-2*f(0.7)+f(0.7-h))/(h*h), 1e-4); }
console.log(fails ? `\n${fails} check(s) FAILED` : `\nall checks passed (worst error is ${(worst*100).toFixed(1)}% of its tolerance)`);
process.exit(fails ? 1 : 0);
