---
layout: quant
title: "Break a stick in two places: do the pieces make a triangle?"
category: Probability
difficulty: 2
tags: [geometric probability, uniform order statistics]
classic: true
summary: "Two uniform cuts, three pieces, and the triangle inequality carves exactly a quarter of the unit square."
---

## Question

A stick of length 1 is broken at two points chosen independently and uniformly along its length. What is the probability that the three pieces can form a triangle?

<details class="solution">
<summary>Solution</summary>

**Answer.** $\tfrac14$.

**Why.** Call the cut points $x < y$ (by symmetry, condition on this ordering). The pieces are $x$, $y - x$ and $1 - y$, and they form a triangle exactly when no piece is at least $\tfrac12$, i.e.

$$
x < \tfrac12, \qquad y - x < \tfrac12, \qquad y > \tfrac12 .
$$

In the $(x,y)$ plane the region $x < y$ is a triangle of area $\tfrac12$; the three conditions cut out of it the smaller triangle with vertices $(0,\tfrac12)$, $(\tfrac12, \tfrac12)$, $(\tfrac12, 1)$, of area $\tfrac18$. So the conditional probability is $\tfrac{1/8}{1/2} = \tfrac14$, and by symmetry the same holds when $y < x$.

The one-line version: each of the three pieces is "too long" ($\ge \tfrac12$) with probability $\tfrac14$, these events are disjoint, so the probability some piece is too long is $\tfrac34$ and the triangle probability is $\tfrac14$.

**Follow-ups an interviewer might ask.** Break the stick once at random, then break the *longer* piece at random: now the probability is $2\ln 2 - 1 \approx 0.386$. Break it once, then pick one of the two pieces with probability one half and break that: breaking the shorter piece can never give a triangle, so the answer is $\tfrac12(2\ln 2 - 1) \approx 0.193$. Three cuts and four pieces forming a quadrilateral: probability $\tfrac12$. In general, $n$ pieces fail to form a polygon when one piece exceeds $\tfrac12$, with probability $n / 2^{n-1}$.

</details>

## Code

```python
import numpy as np

rng = np.random.default_rng(4)
N = 2_000_000
cuts = np.sort(rng.random((N, 2)), axis=1)
a = cuts[:, 0]; b = cuts[:, 1] - cuts[:, 0]; c = 1 - cuts[:, 1]
tri = (a < 0.5) & (b < 0.5) & (c < 0.5)
p = tri.mean()

# follow-up: break once, then break the longer piece
u = rng.random(N); long_piece = np.maximum(u, 1 - u); short = 1 - long_piece
v = rng.random(N) * long_piece
p_longer = ((v < 0.5) & (long_piece - v < 0.5) & (short < 0.5)).mean()

print(f"two uniform cuts:         exact 0.25     simulated {p:.4f}")
print(f"then break longer piece:  exact {2*np.log(2)-1:.4f}   simulated {p_longer:.4f}")
print("OK" if abs(p - 0.25) < 2e-3 and abs(p_longer - (2*np.log(2)-1)) < 2e-3 else "MISMATCH")
```
