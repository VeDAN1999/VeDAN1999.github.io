---
title: "Robot Road Trip: a speed limit, a parallelogram, and two cars that interact like instantons"
series: "Jane Street puzzles"
summary: "Jane Street's July 2025 puzzle asks for the lane-boundary speed that minimises distance lost to overtaking. The whole problem is the interaction between pairs of cars, and it reduces to one transcendental equation."
---

## The problem

[Jane Street, July 2025.](https://www.janestreet.com/puzzles/robot-road-trip-index/) Robot cars drive an infinite two-lane highway. Each has a top speed drawn uniformly from $[1, 2]$ miles per minute and sticks to it. The fast lane has a minimum speed $a$, the slow lane a maximum speed $a$. When a faster car catches a slower one in the same lane, the slower car must get out of the way: in the fast lane it brakes down to $a$ (enough to change lanes), in the slow lane it brakes to a stop on the shoulder. Then it accelerates back to its cruising speed. Acceleration and deceleration are both $1$ mile per minute per minute, and the overtaking car never slows. Trips are $N$ miles long, cars enter at a rate $z$ per mile per minute, and traffic is so sparse that no car meets more than one other car. Choose $a$ to minimise the expected distance lost per trip, in the limit $z \to 0^+$ and then $N \to \infty$. Ten decimal places.

I solved this about a year ago and my name is on the solvers list. Reconstructing it now, what I remember most is that the moment it clicked was the moment it stopped looking like a traffic problem and started looking like my thesis.

## The idea

Everything that costs anything is an *interaction* between exactly two cars. A lone car loses nothing. So the question is really: for each pair of speeds $(u, v)$ with $u < v$, how often does a $v$-car overtake a $u$-car, and what does one such overtake cost? Then integrate over the speed distribution. The lane boundary $a$ enters in exactly two ways: it decides which pairs interact at all (two cars in different lanes never meet), and it decides how far the slower car has to brake.

That is the same structure as an instanton–anti-instanton calculation. The single objects are trivial; the physics lives entirely in the pairwise interaction, and the interaction depends on a separation. Here the "separation" is the speed gap, and the two-body term is what has to be weighted correctly in the integral.

![Left: the space-time diagram of one overtake. Right: the parallelogram of slow-car entry points that get overtaken by a given fast car.](/assets/img/robot-road-trip.png)

## Cost of one interaction

A car at speed $u$ that must brake to speed $w$ and then recover decelerates for a time $u - w$ and accelerates for the same time. During each phase it falls behind its unperturbed self by $\tfrac12 (u-w)^2$ miles, so the total distance lost is

$$
c(u, w) = (u - w)^2 .
$$

In the fast lane $w = a$, in the slow lane $w = 0$. Both of Jane Street's worked examples check out: $(1.7 - 1.2)^2 = 0.25$ and $1.0^2 = 1$.

## How often two cars interact

Fix a fast car of speed $v$ and put its entry at the origin of the $(x, t)$ plane, so it travels along $x = vt$ and leaves at $(N, N/v)$. A slow car of speed $u$ entering at $(x_0, t_0)$ follows $x = x_0 + u(t - t_0)$. The two meet at $t_c = (x_0 - u t_0)/(v - u)$, and the overtake happens inside both trips when $0 \le t_c \le N/v$ and $0 \le v t_c - x_0 \le N$. In the $(x_0, t_0)$ plane these are two strips, and their intersection is a parallelogram. Changing variables to $s = x_0 - u t_0$ and $y = v t_c - x_0$ has Jacobian $u$, so

$$
\text{area} = \frac{N (v-u)/v \cdot N}{u} = N^2\Big(\frac1u - \frac1v\Big).
$$

Entries are uniform in position and time at rate $z$, so the expected number of $u$-cars a given $v$-car overtakes is $z\,N^2 (1/u - 1/v)$ per unit of speed density. The factor $z N^2$ is common to every term and drops out of the minimisation; the rare-encounter assumption ($z \to 0$) is exactly what lets us add the pairwise costs without worrying about triple interactions.

## The integral

Two cars interact only if they share a lane. With speeds uniform on $[1, 2]$, the expected loss per trip, up to the constant $z N^2$, is

$$
L(a) = \underbrace{\int_a^2 \!\! du \int_u^2 \!\! dv\, \Big(\frac1u - \frac1v\Big)(u - a)^2}_{\text{both in the fast lane}}
\;+\;
\underbrace{\int_1^a \!\! du \int_u^a \!\! dv\, \Big(\frac1u - \frac1v\Big) u^2}_{\text{both in the slow lane}} .
$$

The inner integrals are elementary: $\int_u^2 (1/u - 1/v)\,dv = (2-u)/u - \ln(2/u)$ and $\int_u^a (1/u - 1/v)\,dv = (a-u)/u - \ln(a/u)$. Differentiating under the integral sign (the boundary terms vanish because the integrands are zero at $u = a$) gives the stationarity condition

$$
\int_1^a \Big(u - \frac{u^2}{a}\Big) du \;=\; 2 \int_a^2 \Big[\frac{2-u}{u} - \ln\frac{2}{u}\Big](u - a)\, du ,
$$

and after doing both sides by hand,

$$
(a^2 + 4a)\,\ln\frac{2}{a} \;=\; \frac52 + 4a - \frac{8a^2}{3} - \frac{1}{3a} .
$$

## Answer

A few Newton steps from $a = 1.2$ give

$$
a^* = 1.1771414168\ldots
$$

which matches the official answer. The optimum sits well below the midpoint $1.5$: slow-lane interactions are expensive because the overtaken car has to stop completely, so it pays to keep the slow lane small and let most cars share the fast lane, where an overtake only costs $(u-a)^2$.

## Code

```python
import numpy as np
from scipy.optimize import brentq

h = lambda a: (a*a + 4*a)*np.log(2/a) - (2.5 + 4*a - 8*a*a/3 - 1/(3*a))
print(f"{brentq(h, 1.01, 1.99, xtol=1e-15):.10f}")   # 1.1771414168
```

As a cross-check, minimising the double integral $L(a)$ numerically with `scipy.integrate.quad` lands on the same value to nine places, the last digit limited by the quadrature tolerance.
