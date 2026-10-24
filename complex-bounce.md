---
layout: default
title: The stochastic complex bounce
permalink: /complex-bounce/
math: true
---

<p class="eyebrow">Interactive</p>

# The stochastic complex bounce

<p class="lede">Escape from a metastable well is dominated by a path that leaves the real line. Drag $D$ to watch it happen.</p>

{% include complex-bounce.html id="page" controls="true" %}

## What you're looking at

Take an overdamped particle in the cubic potential $V(x) = -x^3/3 + a^2 x$ — a well at $x=-a$, a barrier at $x=+a$ — driven by weak noise of strength $D$:

$$
dx = -V'(x)\,dt + \sqrt{2D}\,dW.
$$

In the path-integral formulation the escape rate is controlled, as $D \to 0$, by stationary paths of the Onsager–Machlup action. Those paths obey Newtonian mechanics in an *effective* potential. The textbook version uses $\Phi = -V'^2$; the point of the thesis is that if the path integral is discretised in the Itô sense, there is an extra term that is usually dropped and shouldn't be:

$$
\Phi(x) = -V'(x)^2 + 2D\,V''(x).
$$

For the cubic potential this is a tilted quartic (left panel; the shaded region is the tilt $-4Dx$). The tilt breaks the degeneracy of the two hilltops, so a particle released from the saddle near the well no longer arrives at the barrier with zero velocity — on the real line it would overshoot to infinity. The escape path still exists, but its turning point has moved into the complex plane: a complex-conjugate pair just off the barrier, at $x_t \approx a \pm i\sqrt{2D}$ (middle panel).

The resulting trajectory is the **complex bounce**: an instanton from the well to the barrier, a brief excursion through the complex plane, and an anti-instanton back (right panel). The instanton–anti-instanton pair has a *complex* separation, and as $D \to 0$ its real part grows like $\log(1/D)$ while the loop in the $x$-plane tends to the arc $\lvert x\rvert = a$. The real part of $x(t)$ recovers the familiar real bounce; the imaginary part carries the information that makes the quasi-zero-mode integral — divergent in the real formulation — converge on the appropriate Lefschetz thimble.

Details, the closed-form solution and the resulting escape rates are in [the paper](https://iopscience.iop.org/article/10.1088/1751-8121/ae8a00) and [the thesis](https://etheses.whiterose.ac.uk/id/eprint/38065/).

<p style="color:var(--muted);font-size:.9rem">The animation integrates the complex equation of motion $\ddot x = -2x(a^2-x^2) + 2D$ with RK4 from the turning point, using the energy of the saddle near the well; nothing is drawn from a fit or an approximation.</p>

Next: [how the thimble through this saddle is built, cut along the quasi-zero mode, and integrated exactly →](/thimble/)
