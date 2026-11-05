---
layout: quant
title: "How many distinct values in n draws with replacement?"
category: Expected value
difficulty: 1
tags: [linearity of expectation, indicator variables, bootstrap]
classic: true
summary: "Draw n times from n items with replacement. About 63 percent of the items show up, which is why a bootstrap sample 'sees' only two thirds of the data."
---

## Question

You draw $n$ times, with replacement, from a set of $n$ items. What is the expected number of distinct items you see? What does it tend to as $n \to \infty$?

<details class="solution">
<summary>Solution</summary>

**Answer.** $n\big(1 - (1 - \tfrac1n)^n\big)$, which tends to $n(1 - e^{-1}) \approx 0.632\,n$. For $n = 100$: $63.4$.

**Why.** Let $I_j$ be the indicator that item $j$ is drawn at least once. $P(I_j = 0) = (1 - \tfrac1n)^n$, so $\mathbb{E}[I_j] = 1 - (1-\tfrac1n)^n$, and by linearity of expectation the expected number of distinct items is $n$ times that. No independence is needed, which is the whole point of the indicator trick: the $I_j$ are correlated (if item 1 appears a lot, others appear less), and it does not matter.

**Follow-ups an interviewer might ask.** Variance? Use $\text{Var} = \sum \text{Var}(I_j) + \sum_{i \ne j}\text{Cov}(I_i, I_j)$ with $P(I_i = I_j = 0) = (1 - \tfrac2n)^n$. Draw $m$ times instead of $n$: $n(1 - (1-\tfrac1n)^m)$, which is the "coupon collector in reverse". How many draws until all $n$ items appear at least once? That is the coupon collector: $n H_n \approx n\ln n$. Why does this matter for a bootstrap? Each bootstrap resample contains about $63\%$ of the original observations, so the $37\%$ left out are a free validation set, which is the idea behind out-of-bag error in random forests.

</details>

## Code

```python
import numpy as np

rng = np.random.default_rng(6)
for n in (10, 100, 1000):
    exact = n * (1 - (1 - 1/n)**n)
    draws = rng.integers(0, n, size=(20_000, n))
    sim = np.mean([len(np.unique(row)) for row in draws])
    print(f"n={n:5d}: exact {exact:.3f}   limit n(1-1/e) {n*(1-np.exp(-1)):.3f}   simulated {sim:.3f}")
    if n == 100:
        ok = abs(sim - exact) < 0.1
print("OK" if ok else "MISMATCH")
```
