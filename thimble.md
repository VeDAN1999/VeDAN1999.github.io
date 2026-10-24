---
layout: default
title: The peculiar error factor
permalink: /thimble/
math: true
---

<p class="eyebrow">Interactive · scroll to advance</p>

# The peculiar error factor

<p class="lede">Itô calculus and complex paths looked like the answer straight away. Then a stubborn factor of √(2π)/e appeared and refused to leave.</p>

It took months to see where it came from. When it finally fell, Steve and I had to laugh: Stirling's formula had been painted across his office window the whole time, in full view at every meeting, as if some intergalactic entity were watching us struggle with the answer standing right in front of us. The factor was Stirling's approximation sneaking in through a contour that was never the right one. Scroll through how a steepest-descent curve becomes a Lefschetz thimble in function space, and how one cut and one shift make the integral exact.

{% include thimble-journey.html %}

<hr>

## The problem, and the person who set it

The history is in two parts, and the error factor is the newer one. Caroli, Caroli and Roulet came close in 1981 with a functional-integral treatment of diffusion in a bistable potential ([*J. Stat. Phys.* **26**, 83](https://doi.org/10.1007/BF01106788)). In 1990 Luckock and McKane computed the escape-rate prefactor from the stochastic path integral in the weak-noise limit, in [*Path integrals and non-Markov processes. III*](https://journals.aps.org/pra/abstract/10.1103/PhysRevA.42.1982), Phys. Rev. A **42**, 1982. The step that troubled Alan then, and that he acknowledged openly at the time, was not a factor: it was that the integral over the separation of the instanton and anti-instanton diverges on the real line, and to force it to converge the sign of the noise had to be flipped, $D \to -D$, with no justification for doing so. Everyone knew the right answer, and nobody could get the path integral to give it honestly. The "peculiar error factor" of $\sqrt{2\pi}/e$ came later, in our own work, once the continuation was in place and the remaining discrepancy could finally be pinned to a single contour.

The key observation turned out to be an analogy. Choosing Itô calculus adds a term $2D\,V''$ to the effective potential, so that it reads $-V'^2 + 2D\,V''$. That is exactly the shape of a quantum-mechanical superpotential, $V = W'^2 + \hbar g\,W''$, and in that setting the complex saddles, their thimbles and the $\pm i\pi$ ambiguity were already understood through resurgence and Picard-Lefschetz theory ([Behtash, Dunne, Schäfer, Sulejmanpasic and Ünsal, *Toward Picard-Lefschetz theory of path integrals, complex saddles and resurgence*](https://arxiv.org/abs/1510.03435)). The stochastic problem is that theory with $\hbar$ replaced by the noise strength, and $D \to -D$ is the analytic continuation it had been missing.

The resolution above (the complex bounce, the thimble $\mathbb{R} \pm i\pi/\omega$, the exact $\Gamma(1)$ in place of Stirling's $\sqrt{2\pi}/e$) came out of my PhD, and the first person I had to convince was Alan McKane himself. Steve Fitzgerald and I presented it to him over a video call; he pushed on it hard, then got interested, and the three of us wrote it up together as [*Complex paths for real stochastic processes*](https://iopscience.iop.org/article/10.1088/1751-8121/ae8a00). Thirty-five years after he first flagged that $D \to -D$ step, he was still active enough to help close it, which remains one of my favourite things about the whole story.

The $\theta$-plane acts use the actual quasi-zero-mode potential from the thesis, $\mathcal{V}_-(\theta)/4D = \omega\theta - (8a^3/D)e^{-\omega\theta}$, with the thimbles and dual thimbles computed by integrating the holomorphic gradient flow from the critical points, including the regulator that selects the contributing contour. The function-space sheet in acts 2 and 3 is a stylised picture of an infinite-dimensional object, drawn to match the local splitting into exact zero mode, quasi-zero mode and Gaussian modes. The full account is in [the thesis](https://etheses.whiterose.ac.uk/id/eprint/38065/) (§1.2 and §3.6) and [the paper](https://iopscience.iop.org/article/10.1088/1751-8121/ae8a00).

See also: [the stochastic complex bounce](/complex-bounce/), the saddle that all of this is built around.
