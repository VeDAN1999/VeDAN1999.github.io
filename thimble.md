---
layout: default
title: The peculiar error factor
permalink: /thimble/
math: true
---

<p class="eyebrow">Interactive · scroll to advance</p>

# The peculiar error factor

<p class="lede">For decades the path-integral escape rate came out wrong by a mysterious $\sqrt{2\pi}/e$. The reason is geometric: the contour was never on the real line. Scroll through how a steepest-descent curve becomes a Lefschetz thimble in function space, and how one cut and one shift make the integral exact.</p>

{% include thimble-journey.html %}

<hr>

## The problem, and the person who set it

The factor has a history. In 1990 Luckock and McKane computed the escape-rate prefactor from the stochastic path integral in the weak-noise limit, in [*Path integrals and non-Markov processes. III*](https://journals.aps.org/pra/abstract/10.1103/PhysRevA.42.1982), Phys. Rev. A **42**, 1982, and found that the instanton–anti-instanton calculation returned Kramers' rate times a "peculiar error factor" of $\sqrt{2\pi}/e$ that could not be removed within the formalism. Everyone knew the right answer; nobody could get the path integral to give it honestly, because the integral over the separation of the instanton and anti-instanton diverges on the real line, and the standard fix was a step that is hard to justify.

The resolution above (the complex bounce, the thimble $\mathbb{R} \pm i\pi/\omega$, the exact $\Gamma(1)$ in place of Stirling's $\sqrt{2\pi}/e$) came out of my PhD, and the first person I had to convince was Alan McKane himself. Steve Fitzgerald and I presented it to him over a video call; he pushed on it hard, then got interested, and the three of us wrote it up together as [*Complex paths for real stochastic processes*](https://iopscience.iop.org/article/10.1088/1751-8121/ae8a00). Thirty-five years after posing the problem, he was still active enough to help close it, which remains one of my favourite things about the whole story.

The $\theta$-plane acts use the actual quasi-zero-mode potential from the thesis, $\mathcal{V}_-(\theta)/4D = \omega\theta - (8a^3/D)e^{-\omega\theta}$, with the thimbles and dual thimbles computed by integrating the holomorphic gradient flow from the critical points, including the regulator that selects the contributing contour. The function-space sheet in acts 2 and 3 is a stylised picture of an infinite-dimensional object, drawn to match the local splitting into exact zero mode, quasi-zero mode and Gaussian modes. The full account is in [the thesis](https://etheses.whiterose.ac.uk/id/eprint/38065/) (§1.2 and §3.6) and [the paper](https://iopscience.iop.org/article/10.1088/1751-8121/ae8a00).

See also: [the stochastic complex bounce](/complex-bounce/), the saddle that all of this is built around.
