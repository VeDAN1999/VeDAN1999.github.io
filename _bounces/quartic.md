---
layout: bounce
title: "The quartic potential"
short: Quartic
potential: "symmetric double well"
status: in progress
order: 4
summary: "The bistable double well, the case Caroli, Caroli and Roulet and Luckock and McKane actually studied. The turning-point algebra is one degree higher than the cubic and the closed form is elliptic rather than elementary. Working on it now."
---

<p style="color:var(--muted)">This page is a placeholder for a calculation in progress. The structure below is fixed; the content will be filled in as it is finished.</p>

## Why the quartic is the one that matters

The cubic was chosen in [the paper](https://iopscience.iop.org/article/10.1088/1751-8121/ae8a00) because it makes every step elementary. The symmetric double well

$$
V(x) = \frac{\lambda}{4}\big(x^2 - a^2\big)^2
$$

is the potential the classic calculations were done for, with escape from one well to the other rather than to infinity. It also has the sine-Gordon feature that there is a second well to go to, so it supports a kink pair as well as a complex bounce, while keeping the cubic's non-periodicity.

## What changes

1. **Hilltop.** $\Phi = -\lambda^2 x^2(x^2 - a^2)^2 + 2D\lambda(3x^2 - a^2)$; the hilltop condition $\Phi'(x) = 0$ is a quintic in $x$ and has to be treated perturbatively in $D$. To leading order $x_h = -a - \dfrac{3D}{2\lambda a^3}$, with $\omega \approx 2\lambda a^2$ and $E \approx 4D\lambda a^2$.
2. **Turning points.** $\dot x^2 = E - \Phi$ is a sextic with a double root at $x_h$, leaving a quartic for the four remaining turning points: a conjugate pair near the barrier at $x = 0$ and a pair beyond the far well.
3. **Closed form.** The quadrature $\int du\,/\,(u\sqrt{\text{quartic}})$ is an elliptic integral, so $x(t)$ is expressible through Jacobi elliptic functions with a complex modulus, or, more usefully, as a small-$D$ expansion about the classical $\tanh$ kinks.
4. **Which saddles exist.** Real bounce from the barrier at $x = 0$: yes. Kink pair from $-a$ to $+a$: yes. Complex bounce from $-a$ back to $-a$: expected, through the turning point near the barrier, bounded as in the cubic (no poles at real $t$, since the potential is not periodic).
5. **The quasi-zero-mode potential and the thimble**, and the comparison with the exact mean first-passage time.

Target: the same table as at the bottom of [the sine-Gordon page](/research/bounces/sine-gordon/), with a third column.
