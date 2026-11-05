---
layout: bounce
title: "The sine-Gordon potential"
short: Sine-Gordon
potential: "V(x) = −4a³ cos(x/2a)"
status: complete
order: 3
script: /assets/research/bounces_check.py
summary: "A periodic potential with three distinct saddles: a real bounce, a kink pair from one well to the next, and a complex bounce that goes through infinity and is discontinuous in x(t). All three are elementary, and the discontinuous one is right."
---

The potential is

$$
V(x) = -4a^3\cos\frac{x}{2a}, \qquad V' = 2a^2\sin\frac{x}{2a}, \qquad V'' = a\cos\frac{x}{2a}, \qquad V''' = -\tfrac12\sin\frac{x}{2a},
$$

with wells at $x = 4\pi a\,n$, barriers at $x = 2\pi a + 4\pi a\,n$, and barrier height $8a^3$. The normalisation is chosen so that the well curvature is $V''(0) = a$ and the rate at the untilted hilltop is $a$, playing the role of $2a$ in [the cubic](/research/bounces/cubic/). Unlike the cubic there is a second well to escape *to*, and that adds a saddle.

It helps to use the half-angle variable throughout:

$$
y = \frac{x}{4a}, \qquad \text{wells at } y = n\pi, \quad \text{barriers at } y = \tfrac{\pi}{2} + n\pi .
$$

## 1. Effective potential and first integral

$$
\Phi(x) = -4a^4\sin^2\frac{x}{2a} + 2Da\cos\frac{x}{2a} .
$$

The untilted part has hilltops of height zero at every well and every barrier; the Itô term lifts the well hilltops to $+2Da$ and lowers the barrier hilltops to $-2Da$. By periodicity all well hilltops are at exactly the same height, which is what makes the kink pair possible. The equation of motion and first integral:

$$
\ddot x = a^3\sin\frac{x}{a} + \frac{D}{2}\sin\frac{x}{2a}, \qquad \dot x^2 = 4a^4\sin^2\frac{x}{2a} - 2Da\cos\frac{x}{2a} + E .
$$

The hilltops are exactly at the wells and barriers, with no $O(D)$ shift, because $\Phi$ is a function of $\cos(x/2a)$ alone: $\Phi'$ carries a factor $\sin(x/2a)$. So $x_h = 0$ exactly, and

$$
E = \Phi(0) = 2Da, \qquad \omega^2 = -\tfrac12\Phi''(0) = a^2 + \frac{D}{4a} = a^2\kappa^2, \qquad \kappa \equiv \sqrt{1 + \delta^2}, \quad \delta^2 \equiv \frac{D}{4a^3} .
$$

$\delta$ is the small parameter of the problem: the noise strength relative to the barrier height, up to a factor.

## 2. Reduction to a quadrature

Substitute $u = x/2a$, then $y = u/2$, and use $\sin^2 u = 4\sin^2 y\cos^2 y$, $1 - \cos u = 2\sin^2 y$. At the well energy $E = 2Da$,

$$
\dot x^2 = 4a^4\sin^2 u + 2Da(1 - \cos u) = 16a^4\sin^2 y\,\big(\cos^2 y + \delta^2\big),
$$

so, with $\dot x = 4a\dot y$,

$$
\dot y = \pm\, a\,\sin y\,\sqrt{\cos^2 y + \delta^2} .
$$

With $c = \cos y$ this is $\int \dfrac{dc}{(1 - c^2)\sqrt{c^2 + \delta^2}} = \mp a\,t$, and the substitution $c = \delta\sinh\phi$ turns it into $\int \dfrac{d\phi}{1 - \delta^2\sinh^2\phi} = \dfrac{1}{\kappa}\,\mathrm{artanh}\big(\kappa\tanh\phi\big)$. Hence every solution at this energy satisfies

$$
\kappa\tanh\phi = \tanh\big(\kappa a(t - t_0)\big), \qquad \cos y = \delta\sinh\phi,
$$

and the three saddles are three choices of the complex constant $t_0$, together with the branch of the square root.

## 3. The turning points

$\Phi(x) = 2Da$ reduces to $\sin^2 y\,(\cos^2 y + \delta^2) = 0$: the wells themselves (the double roots), and

$$
\cos y = \pm i\delta, \qquad\text{i.e.}\qquad x_t = 2\pi a \pm 4a\,i\,\mathrm{arsinh}\,\delta = 2\pi a \pm 2i\sqrt{\frac{D}{a}} + O(D^{3/2}) .
$$

A conjugate pair a distance $\sim\sqrt D$ off the barrier, as in the cubic, but now sitting exactly above the barrier rather than slightly beyond it.

## 4. The kink pair (instanton–instanton)

Take $t_0$ real. Then $|\tanh(\kappa a t)| < 1 < \kappa$ keeps $\phi$ real and bounded, and

$$
\boxed{\;\cos\frac{x}{4a} = \frac{\delta\sinh(\omega t)}{\sqrt{1 + \delta^2\cosh^2(\omega t)}}, \qquad \omega = \kappa a\;}
$$

runs from $\cos y = -1$ ($x = 4\pi a$) at $t = -\infty$ through the barrier $\cos y = 0$ at $t = 0$ to $\cos y = +1$ ($x = 0$) at $t = +\infty$. It is the real path from one well hilltop to the next: a kink followed by a kink, not a kink followed by an anti-kink, and it describes hopping to the neighbouring well rather than returning. As $D \to 0$ it tends to the classical double kink of the untilted problem, $\tan y = e^{at}$, which crosses the barrier $y = \pi/2$ at $t = 0$.

## 5. The real bounce (from the barrier)

There is no real turning point at the well energy, so there is no real bounce that starts at the well. There is one that starts at the barrier. At the barrier energy $E = \Phi(2\pi a) = -2Da$ the first integral becomes $\dot y^2 = a^2\cos^2 y\,(\sin^2 y - \delta^2)$, real where $|\sin y| > \delta$, and the same substitution (with $\delta^2 \to -\delta^2$ and $y \to \tfrac{\pi}{2} - y$) gives

$$
\boxed{\;\sin\frac{x}{4a} = \frac{\delta}{\sqrt{1 - \kappa'^2\tanh^2(\omega' t)}}, \qquad \kappa' = \sqrt{1 - \delta^2}, \quad \omega' = \kappa' a\;}
$$

which leaves the barrier $y = \pi/2$ at $t = -\infty$, turns at $\sin y = \delta$ (a distance $4a\arcsin\delta \approx 2\sqrt{D/a}$ from the well, on the real axis) at $t = 0$, and returns to the barrier. This is a perfectly real saddle. It describes relaxation *towards* the well from the barrier, not escape, and its rate $\omega' = a\sqrt{1 - \delta^2}$ is the barrier curvature, lowered by the tilt.

## 6. The complex bounce

Now take $t_0 = \pm\dfrac{i\pi}{2\kappa a}$, the imaginary half-period of $\tanh$. Then $\tanh(\kappa a t \mp i\pi/2) = \coth(\kappa a t)$ and

$$
\boxed{\;\cos\frac{x}{4a} = \frac{\delta\cosh(\omega t)}{\sqrt{\delta^2\sinh^2(\omega t) - 1}}\;}
$$

This is the complex bounce, and it does something the cubic one does not. The denominator vanishes at

$$
\omega t = \pm\,\mathrm{arsinh}\frac{1}{\delta} \equiv \pm\,\omega s_1, \qquad s_1 = \frac{1}{\omega}\ln\frac{2}{\delta} + O(\delta^2) = \frac{1}{2\omega}\ln\frac{16a^3}{D} + O(D),
$$

so $\cos y$ has simple poles at two real times, and $y(t)$ itself goes to complex infinity there. Reading the formula from left to right in $t$:

- For $t < -s_1$: $\delta^2\sinh^2 > 1$, the square root is real, $\cos y > 1$. So $y$ is purely imaginary: $\mathrm{Re}\,x = 0$, the path sits over the *well* and moves down the imaginary axis from $x = 0$ at $t = -\infty$ to $-i\infty$ at $t = -s_1$.
- For $-s_1 < t < s_1$: the square root is imaginary, $\cos y = i\mu$ with $\mu$ real, $\mu \ge \delta$. So $\mathrm{Re}\,y = \pi/2$: $\mathrm{Re}\,x = 2\pi a$, the path sits over the *barrier*, comes in from $+i\infty$, reaches the turning point $x_t = 2\pi a + 2i\sqrt{D/a}$ at $t = 0$, and goes back out to $+i\infty$ at $t = s_1$.
- For $t > s_1$: back over the well, returning from $-i\infty$ to $x = 0$ as $t \to +\infty$.

The real part of $x(t)$ is a step function: $0$, then $2\pi a$ for a time $2s_1 \sim \log(1/D)/\omega$, then $0$. That is the "discontinuous complex bounce". The conjugate path (the other sign of $t_0$, equivalently the other turning point) has the imaginary parts reversed.

**Why it is nonetheless correct.** Three observations.

1. *It solves the equation of motion.* On each of the three intervals the closed form satisfies $\ddot x = -\tfrac12\Phi'(x)$ and conserves $E = 2Da$; numerically, with $a = 1$, $D = 0.05$, the finite-difference residual is about $10^{-5}$ away from the poles and the energy is conserved to the same order. The poles at $\pm s_1$ are singularities of $x(t)$ as a meromorphic function of $t$, not failures of the solution: in the variable $c = \cos y$, in which the first integral is polynomial, the solution is smooth across them.
2. *The action is finite, and its ambiguity is exactly $\pm i\pi$.* Near $t = s_1$ the closed form gives $\cos^2 y = 1 + \kappa^2/f(t)$ with $f = \delta^2\sinh^2(\omega t) - 1$ vanishing linearly, so $\cos y \sim (t - s_1)^{-1/2}$, $y \sim \pm\tfrac{i}{2}\ln\big(1/(t - s_1)\big)$, and the kinetic term has a double pole. Expanding the Laurent series one order further (the first integral makes $\dot x^2 = E - \Phi$ a rational function of $f$, so this is mechanical) gives

   $$
   \dot x^2 = -\frac{4a^2}{(t - s_1)^2} - \frac{D}{t - s_1} + O(1), \qquad \text{so}\qquad \frac{2\dot x^2 - E}{4D} = -\frac{2a^2}{D\,(t - s_1)^2} - \frac{1}{2\,(t - s_1)} + O(1) .
   $$

   The residue of the action density is exactly $-\tfrac12$ at each pole, independent of $D$ and $a$ (checked numerically by a contour integral around the pole: $-0.5000$ for $a = 1$, $D = 0.05$). The double-pole part integrates to a finite, well-defined number however the $t$-contour is deformed around $s_1$; the simple pole contributes $\pm i\pi$ depending on which side of it the contour passes. So the real part of $S$ is the finite part of the real-line integral, unambiguous, and $S$ as a whole is defined up to $\pm i\pi$ per pole. That is the same $\pm i\pi$ that labels complex saddles in the Behtash–Dunne–Schäfer–Sulejmanpasic–Ünsal framework, showing up here in the saddle itself. The two poles together give $0$ or $\pm 2\pi i$, so $e^{-S}$ is single-valued either way: the discontinuous bounce has a well-defined weight.
3. *Periodicity makes the jump invisible to the physics.* Every quantity that enters the escape rate is a function of $x$ only through $\cos(x/2a)$ and $\sin(x/2a)$, which are entire in $x$ and single-valued along the path. The jump in $\mathrm{Re}\,x$ by half a period is a jump between two points that the potential cannot distinguish from one another once $\mathrm{Im}\,x \to \infty$: $\cos(x/2a) \to \infty$ either way, and the path is continuous on the Riemann sphere of the natural variable $\cos(x/2a)$.

The discontinuity is a statement about the coordinate, not about the saddle. The $x$-plane is the wrong place to draw it; the $c$-plane is the right one, and there the complex bounce is as tame as the cubic's.

## 7. Comparison with the cubic

| | Cubic | Sine-Gordon |
|---|---|---|
| Hilltop shift | $x_h = -a - D/2a^2 + \dots$ | none: $x_h = 0$ exactly |
| Well energy | $4Da + O(D^2)$ | $2Da$ exactly |
| Rate $\omega$ | $\sqrt{6x_h^2 - 2a^2} \approx 2a$ | $a\sqrt{1 + D/4a^3}$ exactly |
| Turning points | $-x_h \pm i\sqrt{2(x_h^2 - a^2)}$ | $2\pi a \pm 4ai\,\mathrm{arsinh}\,\delta$ |
| Real bounce from well | no | no |
| Real bounce from barrier | yes | yes |
| Kink pair | no (nowhere to go) | yes |
| Complex bounce | bounded, smooth | through infinity, $\mathrm{Re}\,x$ discontinuous |
| Separation | $\sim \omega^{-1}\ln(a^2/D)$ | $2s_1 = \omega^{-1}\ln(16a^3/D) + \dots$ |

## 8. Still to write up

The quasi-zero-mode potential for the sine-Gordon kink–antikink interaction, the thimble through the complex saddle, and the resulting escape rate, with the comparison against the exact one-dimensional mean first-passage time. All of this is in the thesis; it will be transcribed here in the same style as the cubic.
