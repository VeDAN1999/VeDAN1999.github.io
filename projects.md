---
layout: default
title: Projects
permalink: /projects/
math: true
---

# Projects

<p class="lede">Code that goes with the maths. Everything here is on <a href="https://github.com/{{ site.github }}">GitHub</a>.</p>

<div class="entry" id="stochastic-escape-simulator">
  <h3><a href="https://github.com/VeDAN1999/Stochastic-Escape-Simulator">Stochastic Escape Simulator</a><span class="tag">Python</span></h3>
  <div class="meta">Euler–Maruyama · first-passage times · Kramers' rate · exact MFPT</div>
  <figure>
    <img src="/assets/img/arrhenius_example.png" alt="log escape rate against 1/D: exact rate, Kramers' asymptotic, and Monte Carlo estimates">
    <figcaption>Escape rate $\Gamma$ from a tilted quartic well against $1/D$. Kramers' formula $\Gamma \approx \omega\, e^{-E_b/D}$ is only reliable for $D \ll E_b$; the exact rate from the mean first-passage-time integral holds throughout, and the Monte Carlo estimates follow it until escapes become too rare to sample.</figcaption>
  </figure>
  <p>Three ways of computing the same number, and where each one breaks. Monte Carlo simulation of overdamped Langevin dynamics with Numba acceleration, compared against the weak-noise asymptotic and the exact one-dimensional result. Includes an optional switch to exponentially correlated coloured noise via an Ornstein–Uhlenbeck auxiliary process.</p>
  <div class="links"><a href="https://github.com/VeDAN1999/Stochastic-Escape-Simulator">Code</a><a href="https://github.com/VeDAN1999/Stochastic-Escape-Simulator/blob/main/docs/maths.md">Maths notes</a></div>
</div>

<div class="entry" id="lefschetz-thimble-plotter">
  <h3><a href="https://github.com/VeDAN1999/lefschetz-thimble-plotter">Lefschetz Thimble Plotter</a><span class="tag">Mathematica</span></h3>
  <div class="meta">Picard–Lefschetz theory · holomorphic gradient flow</div>
  <figure>
    <img src="/assets/img/thimbles_example.png" alt="Lefschetz thimbles and dual thimbles in the complex plane for a polynomial action">
    <figcaption>Thimbles (steepest descent) and dual thimbles (steepest ascent) emanating from the saddles of a polynomial action $W(z)$.</figcaption>
  </figure>
  <p>Picard–Lefschetz theory rewrites an oscillatory or divergent integral $\int e^{-W(z)/\hbar}\,dz$ as a sum over thimbles on which the integrand is well behaved. This visualiser finds the saddles of a user-supplied $W$, integrates the upward and downward flow from each, and draws the resulting geometry — with a speed-normalised flow option that keeps high-degree potentials from blowing up numerically.</p>
  <div class="links"><a href="https://github.com/VeDAN1999/lefschetz-thimble-plotter">Code</a><a href="https://github.com/VeDAN1999/lefschetz-thimble-plotter/blob/main/docs/maths.md">Maths notes</a></div>
</div>

<p style="margin-top:2rem;color:var(--muted)">More to come — see <a href="/writing/">Writing</a> for puzzle solutions and shorter experiments.</p>
