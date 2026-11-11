---
layout: default
title: The stochastic path integral calculator
permalink: /calculator/
math: true
---

<p class="eyebrow">Interactive · project</p>

# The stochastic path integral calculator

<p class="lede">Type a potential, press $=$, and watch a particle escape its well along a path that leaves the real line.</p>

A particle sits in a well of $V(x)$ and is kicked by weak noise, $dx = -V'(x)\,dt + \sqrt{2D}\,dW$. Sooner or later it gets over the barrier. Kramers' formula gives the rate, $\Gamma \approx \frac{\sqrt{\kappa_R \kappa_B}}{2\pi} e^{-\Delta V/D}$, and the SPI-1 rebuilds that formula from a single complex path.

{% include spi-calculator.html %}

## How to use it

1. **Enter $V(x)$** and press $=$, or tap a preset. Powers, `sin`, `cos`, `exp`, `tanh`, `log` and implicit multiplication like `2x` or `sin(4x)` all work.
2. **Pick the escape** you want from the ESCAPE keys: which well, and over which barrier.
3. **Turn the NOISE dial.** It sets $D$ as a fraction of the barrier height $\Delta V$.
4. **Switch the display.** LANDSCAPE shows $V$ and the effective potential $U$; BOUNCE shows the escape path in the complex plane; RATE plots the result against the exact answer.

## What the three screens show

**Landscape.** In the Itô path integral a path of the noisy particle moves like a classical particle in $U(x) = -V'(x)^2 + 2D\,V''(x)$. Every stationary point of $V$ is a hilltop of $U$, but the $2DV''$ term lifts the wells and lowers the barriers. A path that starts on the well hilltop has energy $E_R$, which is above the barrier hilltop, so there is no real point at the barrier where it can stop and turn back. Each hilltop is tagged *real* (a real turning point exists at this energy) or *complex* (it does not).

**Bounce.** The turning point has moved off the real line, to $\rho \approx x_B + i\sqrt{2D(\kappa_R+\kappa_B)}/\kappa_B$. The escape path is the complex bounce: out of the well, round through the complex plane to $\rho$, and back. When the well is much stiffer than the barrier the bounce cannot be drawn in real time at all, and the calculator switches to a bent time contour and tells you so.

**Rate.** One loop of fluctuations around the bounce gives the orange curve, in units of Kramers' rate. It meets Kramers as $D \to 0$ for every potential, with no fitting. The pale curve is the exact rate from the mean first-passage-time integral. Their gap at larger $D$ is the first correction in $D$, which a one-loop calculation does not capture; the dashed line shows the known classical correction for comparison. The two optional curves show what goes wrong if the quasi-zero mode is treated as Gaussian or with a flat measure.

## Reading the tape

The paper tape prints the working. The four factors are the bounce action, the time-translation zero mode, the fluctuation determinant and the quasi-zero mode. The action carries a phase $e^{i\pi p}$ with $p = (\kappa_R+\kappa_B)/2\kappa_B$, the determinant cancels all of it except a single $e^{i\pi}$, and that minus sign is exactly the one in $e^{-\Gamma t} = 1 - \Gamma t + \dots$

The maths is from my paper on complex paths for stochastic escape (J. Phys. A, [doi:10.1088/1751-8121/ae8a00](https://doi.org/10.1088/1751-8121/ae8a00)). Multi-bounce contributions and two-loop corrections are not included yet. The engine is plain JavaScript with no dependencies: [source](https://github.com/VeDAN1999/VeDAN1999.github.io/tree/main/assets/spi).
