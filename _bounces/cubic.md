---
layout: bounce
title: "The cubic potential"
short: Cubic
potential: "V(x) = −x³/3 + a²x"
status: complete
order: 2
script: /assets/research/bounces_check.py
summary: "The potential from the paper, chosen so that everything is elementary: the hilltop is the root of a cubic, the turning points are the roots of a quartic, and the complex bounce is a rational function of an exponential."
---

The potential is

$$
V(x) = -\frac{x^3}{3} + a^2 x , \qquad V'(x) = a^2 - x^2, \qquad V''(x) = -2x, \qquad V'''(x) = -2,
$$

with a well at $x = -a$ and a barrier at $x = +a$ of height $\Delta V = \tfrac43 a^3$. It is [the one drawn on the home page](/complex-bounce/). Everything below uses the conventions of [the framework page](/research/bounces/framework/).

## 1. Effective potential and equation of motion

$$
\Phi(x) = -(a^2 - x^2)^2 - 4D\,x .
$$

A symmetric double hump tilted by $-4Dx$. The equation of motion and the first integral are

$$
\ddot x = -2x\,(a^2 - x^2) + 2D, \qquad \dot x^2 = (a^2 - x^2)^2 + 4Dx + E .
$$

## 2. The hilltop near the well

$\Phi'(x) = 4x(a^2 - x^2) - 4D = 0$, i.e. the hilltop $x_h$ is the root of the cubic

$$
x\,(a^2 - x^2) = D
$$

near $x = -a$. Perturbatively $x_h = -a - \dfrac{D}{2a^2} + O(D^2)$: the Itô term pushes the hilltop slightly past the well. The bounce energy is

$$
E = \Phi(x_h) = -(a^2 - x_h^2)^2 - 4D\,x_h = 4Da + O(D^2),
$$

positive: the well hilltop has been lifted above the barrier hilltop, which sits at $-4Da + O(D^2)$. The curvature at the hilltop gives the instanton rate:

$$
\omega^2 = -\tfrac12\Phi''(x_h) = 6x_h^2 - 2a^2 = 4a^2 + \frac{6D}{a} + O(D^2), \qquad \omega \approx 2a + \frac{3D}{2a^2} .
$$

(With no Itô term, $\omega = 2a = V''(-a)$, the relaxation rate in the well, as it should be.)

## 3. Turning points

$\dot x^2 = 0$ is the quartic $x^4 - 2a^2x^2 + 4Dx + a^4 + E = 0$. Since $x_h$ is a stationary point of $\Phi$ at energy $E$, it is a double root, so

$$
\dot x^2 = (x - x_h)^2\,(x - x_t)(x - \bar x_t) .
$$

The quartic has no $x^3$ term, so the roots sum to zero, and comparing the $x^2$ coefficients gives the other two roots exactly:

$$
x_t + \bar x_t = -2x_h, \qquad x_t \bar x_t = 3x_h^2 - 2a^2, \qquad\text{so}\qquad x_t = -x_h + i\sqrt{2(x_h^2 - a^2)} .
$$

Since $x_h^2 > a^2$ the square root is real and the turning points are a genuine complex-conjugate pair, with

$$
x_t = a + \frac{D}{2a^2} \pm i\sqrt{\frac{2D}{a}} + O(D^{3/2}) .
$$

They sit just off the barrier, a distance $\sqrt{2D/a}$ into the complex plane. This is the one place the calculation differs qualitatively from the untilted case: at $D = 0$ the four roots are $-a, -a, a, a$ and the bounce turns on the real line at the barrier itself.

## 4. The complex bounce in closed form

Write $u = x - x_h$ and $q(u) = (x - x_t)(x - \bar x_t) = u^2 + \beta u + \gamma$ with

$$
\beta = 2x_h - (x_t + \bar x_t) = 4x_h, \qquad \gamma = (x_h - x_t)(x_h - \bar x_t) = 6x_h^2 - 2a^2 = \omega^2 .
$$

That $\gamma = \omega^2$ exactly is not a coincidence: both are the second derivative of $-\Phi/2$ at the hilltop. The first integral separates:

$$
t - t_0 = \int \frac{du}{u\sqrt{q(u)}} = -\frac{1}{\omega}\,\ln\!\left(\frac{2\omega^2 + \beta u + 2\omega\sqrt{q(u)}}{u}\right) .
$$

Set $w = w_0\,e^{-\omega(t - t_0)}$, so that the bracket equals $w$, and solve for $u$: squaring $2\omega\sqrt{q} = uw - 2\omega^2 - \beta u$ and simplifying gives

$$
\boxed{\;x(t) = x_h + \frac{4\omega^2\,w}{(w - 4x_h)^2 - 4\omega^2}, \qquad w = w_0\,e^{-\omega t}\;}
$$

This is the general zero-mode solution at energy $E$; $w_0$ is the integration constant. As $w \to 0$ or $w \to \infty$, $x \to x_h$: every member of this family starts and ends at the hilltop in infinite time, as a bounce must. What distinguishes the members is where the denominator vanishes, at $w = 4x_h \pm 2\omega$:

- $w_0 > 0$ real: $w$ passes through $4x_h + 2\omega \approx D/a^2 > 0$ at a finite time and $x$ blows up. This is the real trajectory from the hilltop that overshoots the barrier and runs off to $+\infty$.
- $w_0 < 0$ real: $w$ passes through $4x_h - 2\omega \approx -8a$ and $x$ blows up towards $-\infty$. The real trajectory leaving the hilltop in the other direction.
- $w_0$ complex, chosen so that the path passes through a turning point: $x(0) = x_t$ requires $q(u) = 0$, where the quadratic for $w$ has a double root, giving

$$
w_0 = 4x_h + \frac{2\omega^2}{x_t - x_h} .
$$

With this $w_0$, $w$ never hits either real pole, $x(t)$ is bounded for all real $t$, and the path is the **complex bounce**: it leaves $x_h$ along the real axis, lifts off near the barrier, turns at $x_t$, and returns, with $\bar w_0$ giving the conjugate path through $\bar x_t$.

For $a = 1$, $D = 0.05$: $x_h = -1.02412$, $\omega = 2.07194$, $x_t = 1.02412 + 0.31248\,i$, and the closed form satisfies the equation of motion to $10^{-5}$ (finite differences) with energy conserved to $10^{-6}$ along the whole real-$t$ line.

## 5. Small-$D$ structure

Expand for small $D$. With $x_t - x_h \approx 2a + i\sqrt{2D/a}$ and $\omega^2 \approx 4a^2$,

$$
w_0 = 4x_h + \frac{2\omega^2}{x_t - x_h} = -2i\sqrt{\frac{2D}{a}} + O(D) .
$$

So $w_0$ is small and, to leading order, purely imaginary. Two things follow.

*The separation grows like $\log(1/D)$.* The path leaves the hilltop when $|w|$ becomes order one, at $\omega t_1 \approx \ln(1/|w_0|)$, and returns when $|w|$ approaches the far pole at $-8a$, at $\omega t_2 \approx -\ln(8a/|w_0|)$. The instanton–anti-instanton separation is therefore

$$
t_1 - t_2 \approx \frac{1}{\omega}\ln\frac{8a}{|w_0|^2} = \frac{1}{\omega}\ln\frac{a^2}{D} ,
$$

and the real part of the complex bounce looks more and more like the classical pair, the instanton $x = a\tanh(a(t - t_1))$ followed by the anti-instanton $x = -a\tanh(a(t - t_2))$, as $D \to 0$. (The precise location of the saddle in the separation, $e^{\omega\theta^*} = 8a^3/D$, comes from the quasi-zero-mode potential in §6; the estimate above only fixes the $\log(1/D)$ scaling.)

*The imaginary part is a time shift of $\pi/2\omega$.* Since $w_0 = |w_0|\,e^{-i\pi/2}$, the complex bounce is, to leading order, the real overshooting trajectory ($w_0 > 0$) evaluated at the complex time $t + i\pi/2\omega$ (or $t - i\pi/2\omega$ for the conjugate path). A purely imaginary time shift of $\pi/2\omega$ is the signature of a complex saddle in this class of problems: it is the same $\pm i\pi$ that appears, in the separation variable, as the saddle of the quasi-zero-mode integral at $\theta^* \in \mathbb{R} \pm i\pi/\omega$ on [the error factor page](/thimble/). In the $x$-plane the loop traced by $x(t)$ tends to the arc $\lvert x\rvert = a$ as $D \to 0$.

## 6. The quasi-zero-mode potential

Writing the complex bounce as an instanton and anti-instanton at separation $\theta$ and expanding the action in $\theta$ gives the effective potential for the separation,

$$
\frac{\mathcal{V}_-(\theta)}{4D} = \omega\theta - \frac{8a^3}{D}\,e^{-\omega\theta} ,
$$

a linear term from the Itô tilt (it is $2DV''$ integrated across the gap, hence proportional to $D\,\omega\,\theta$ and surviving the division by $4D$) plus the exponentially decaying attraction between the instanton and anti-instanton. Integrated along the real $\theta$ line the quasi-zero-mode integral does not converge, which is the divergence Luckock and McKane met in 1990; integrated along the thimble through the complex saddle it converges and evaluates to exactly $\Gamma(1)$, as set out on the error factor page. The thesis carries this through to the escape rate and the comparison with the exact mean first-passage time.

## 7. Other saddles of this potential

The cubic also supports a real bounce from the *barrier* hilltop, at energy $\Phi(a_h)$ where $a_h \approx a - D/2a^2$ is the hilltop near the barrier: a path that starts at the barrier, falls into the valley of $\Phi$, turns before reaching the well hilltop (whose energy is higher), and returns. It contributes to the density near the barrier rather than to escape, and plays the role that the "false" bounce plays in the quantum-mechanical analogues. There is no instanton–instanton solution, because there is no second well to go to; that is where [the sine-Gordon potential](/research/bounces/sine-gordon/) differs.
