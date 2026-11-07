---
layout: bounce
title: "A general potential, perturbatively"
short: General
potential: "any smooth V(x)"
status: planned
order: 5
summary: "The three worked cases suggest a pattern. This page is reserved for the perturbative treatment that should make it a theorem: the complex bounce as a small-D deformation of the classical instanton pair, for any potential with a metastable minimum."
---

<p style="color:var(--muted)">Reserved. Nothing below is a result yet; it is the plan.</p>

## The conjecture the examples point to

For any smooth $V$ with a well at $x_w$ ($V'' = \omega_w > 0$) and a barrier at $x_b$ ($V'' = -\omega_b < 0$):

1. The Itô tilt lifts the well hilltop of $\Phi$ by $2D\omega_w$ and lowers the barrier hilltop by $2D\omega_b$, so the energy mismatch is $2D(\omega_w + \omega_b)$ and a real bounce from the well cannot exist for any $D > 0$.
2. The turning points nearest the barrier form a conjugate pair at $x_b \pm i\sqrt{2D(\omega_w + \omega_b)}/\omega_b + O(D)$: this is what both [the cubic](/research/bounces/cubic/) ($\omega_w = \omega_b = 2a$, giving $\sqrt{2D/a}$) and [the sine-Gordon](/research/bounces/sine-gordon/) ($\omega_w = \omega_b = a$, giving $2\sqrt{D/a}$) satisfy.
3. The complex bounce exists, is the analytic continuation of the classical instanton–anti-instanton pair to a complex separation with imaginary part $\pm i\pi/\omega$, and its real part tends to the classical bounce as $D \to 0$ with the separation growing like $\omega^{-1}\ln(1/D)$.
4. The quasi-zero-mode potential has the universal form $\mathcal{V}(\theta)/4D = \omega\theta - (A/D)e^{-\omega\theta}$ with $A$ determined by the instanton tails, and the thimble integral evaluates to $\Gamma(1)$ times a prefactor fixed by the classical fluctuation determinant.

## The method

Matched asymptotics in $D$: an outer solution (the classical instanton and anti-instanton, each a solution of $\dot x = \pm V'(x)$) and an inner solution near the barrier, where the turning point sits at distance $\sqrt D$ off the axis and the local problem is the quadratic-barrier one, which can be solved exactly (parabolic cylinder functions in the fluctuation problem; a hyperbola in the saddle itself). The matching region is where the outer solution is exponentially close to $x_b$ and the inner solution is far from the turning point on the scale $\sqrt D$. The $\log(1/D)$ in the separation is the usual signature of matching an exponential tail to an algebraic one.

The point of doing it in general is twofold: to show that nothing in the resolution of the $\sqrt{2\pi}/e$ factor depends on the cubic being elementary, and to extend the result to potentials where the one-dimensional exact answer is not available as a check, in particular to more than one dimension.

## Pre-requisites from the worked cases

- Cubic: done.
- Sine-Gordon: done, including the pole structure that a general periodic potential will share.
- Quartic: done. Its closed form is elliptic, and it is the case with unequal well and barrier curvatures. It supplies the general statement that the valley slope is always the barrier curvature once the transverse one-loop measure is transported along the quasi-zero mode, so the thimble integral is always $\Gamma(1)$; see [the tilted quartic page](/research/bounces/quartic/), §9.
