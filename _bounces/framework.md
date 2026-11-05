---
layout: bounce
title: "From the Langevin equation to the complex bounce"
short: Framework
potential: "general V(x)"
status: complete
order: 1
summary: "The three steps that every potential goes through: Itô action, effective potential, first integral. Everything else in this series is this page applied to a specific V."
---

This page sets up the machinery once, with conventions, so that the pages on specific potentials can get straight to the calculation. The full treatment is in [the thesis](https://etheses.whiterose.ac.uk/id/eprint/38065/), chapters 1 to 3, and in [the paper](https://iopscience.iop.org/article/10.1088/1751-8121/ae8a00).

## 1. The process

Overdamped motion in a potential $V(x)$ with additive white noise of strength $D$:

$$
dx = -V'(x)\,dt + \sqrt{2D}\,dW_t .
$$

Units are chosen so that the mobility is 1, so $V'$ has the dimensions of a velocity and $D$ those of length squared over time. The question throughout is the rate at which the particle escapes from a metastable minimum of $V$ as $D \to 0$.

## 2. The Itô action

The Onsager–Machlup weight of a path is $e^{-S[x]}$ with, formally,

$$
S[x] = \frac{1}{4D}\int \big(\dot x + V'(x)\big)^2\,dt .
$$

Expand the square. The cross term $\tfrac{1}{2D}\int \dot x\,V'(x)\,dt$ is a stochastic integral, and its value depends on the discretisation. In the Itô (pre-point) convention Itô's lemma gives $\int V'(x)\,dx = V(x_f) - V(x_0) - D\int V''(x)\,dt$, so

$$
S_{\text{Itô}}[x] = \frac{1}{4D}\int \Big(\dot x^2 + V'(x)^2 - 2D\,V''(x)\Big)\,dt + \frac{V(x_f) - V(x_0)}{2D} .
$$

The boundary term is a constant for fixed endpoints. The $-2DV''$ term is the one that is usually dropped: it is $O(D)$ and looks like a correction to the prefactor. It is not. It changes which paths are stationary.

## 3. The effective potential and the first integral

The integrand is $\tfrac{1}{4D}\big(\dot x^2 - \Phi(x)\big)$ with

$$
\Phi(x) = -V'(x)^2 + 2D\,V''(x) ,
$$

so stationary paths are Newtonian trajectories in the potential $\Phi$, with the convention $L = \dot x^2 - \Phi$ (no factor of a half):

$$
\ddot x = -\tfrac12\,\Phi'(x) = V'(x)V''(x) - D\,V'''(x), \qquad \dot x^2 + \Phi(x) = E .
$$

Without the Itô term, $\Phi_0 = -V'^2$ has hilltops of exactly zero height at every critical point of $V$, well and barrier alike. The classical bounce leaves the well hilltop with zero energy, reaches the barrier hilltop with zero velocity in infinite time, and comes back: an instanton followed by an anti-instanton, with the separation between them a flat direction of the action. That flat direction is the quasi-zero mode, and the integral over it is the one that diverges in the real formulation.

With the Itô term the hilltops are tilted by $2DV''$. At a minimum of $V$, $V'' > 0$ and the hilltop rises; at a barrier, $V'' < 0$ and it falls. A particle released from the well hilltop therefore arrives at the barrier with velocity squared equal to the height difference and overshoots. On the real line there is no bounce. There is a bounce in the complex $x$-plane: the turning points, where $\Phi(x) = E$, have moved a distance of order $\sqrt{D}$ off the real axis, in a complex-conjugate pair just beside the barrier, and the trajectory through one of them returns to the well. That is the complex bounce, and the thimble through it is what makes the quasi-zero-mode integral converge.

## 4. What each potential page computes

For a given $V$ the calculation has the same shape every time:

1. **Hilltop.** Solve $\Phi'(x_h) = 0$ for the hilltop nearest the well, and read off the energy $E = \Phi(x_h)$ and the curvature $\omega^2 = -\tfrac12\Phi''(x_h)$, which is the rate at which the instanton leaves the hilltop.
2. **Turning points.** Solve $\Phi(x) = E$. There is always the double root at $x_h$; the remaining roots are the turning points. The complex bounce passes through the conjugate pair nearest the barrier.
3. **The saddles.** Integrate $\dot x = \pm\sqrt{E - \Phi(x)}$. Which solutions exist depends on the potential: a real bounce (when there is a real turning point at the right energy), an instanton–instanton or kink pair (when the potential has a second well to go to), and the complex bounce. The potential pages say which of these the potential supports and give closed forms where they exist.
4. **Behaviour as $D \to 0$.** The real part of the instanton separation grows like $\log(1/D)$, the imaginary part of the loop in the $x$-plane shrinks like $\sqrt{D}$, and the real part of $x(t)$ recovers the classical bounce.
5. **Action and the quasi-zero mode.** The action of the complex bounce, its expansion in the separation $\theta$, and the resulting quasi-zero-mode potential $\mathcal{V}(\theta)$, whose thimble is integrated on [the error factor page](/thimble/).

A note on verification. Every closed form in this series has been checked by substituting it into the equation of motion and the first integral numerically, over a range of $t$ that includes any singularities, with the script linked at the bottom of each page.
