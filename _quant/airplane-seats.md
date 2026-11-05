---
layout: quant
title: "The lost boarding pass"
category: Brainteasers
difficulty: 2
tags: [symmetry, probability]
classic: true
summary: "100 passengers, one of them lost their boarding pass and sits at random. The last passenger gets their own seat with probability exactly one half, and the reason is a symmetry, not a sum."
---

## Question

100 passengers board a plane with 100 seats in order. The first passenger has lost their boarding pass and sits in a uniformly random seat. Every later passenger sits in their own seat if it is free, and otherwise in a uniformly random free seat. What is the probability that the last passenger ends up in their own seat?

<details class="solution">
<summary>Solution</summary>

**Answer.** $\tfrac12$, for any number of passengers $n \ge 2$.

**Why.** Follow the chain of displaced passengers. Each displaced passenger picks a random free seat; the process ends the moment someone picks either seat 1 (the first passenger's own seat, after which everyone sits correctly) or seat 100 (the last passenger's seat, after which the last passenger is displaced). Every other choice just passes the problem on. At every random choice in the chain, seat 1 and seat 100 are both still free and are equally likely to be picked, so whichever of the two gets taken first is a fair coin. The last passenger therefore gets seat 100 with probability $\tfrac12$.

Put differently: the last passenger always ends up in either seat 1 or seat 100, and by symmetry between those two seats the probability is $\tfrac12$.

**Follow-ups an interviewer might ask.** What is the probability the second-to-last passenger gets their own seat? Now there are three special seats (1, 99, 100) and the chain ends on any of them; passenger 99 is displaced only if seat 99 is picked before seat 1, so the answer is $\tfrac23$. In general passenger $k$ ($k \ge 2$) gets their own seat with probability $1 - \tfrac{1}{n-k+2}$. Expected number of passengers *after the first* who end up in the wrong seat: $\sum_{k=2}^{n}\tfrac{1}{n-k+2} = H_n - 1 \approx \ln n$, where $H_n$ is the harmonic number.

</details>

## Code

```python
import numpy as np

rng = np.random.default_rng(1)

def last_gets_own_seat(n):
    free = np.ones(n, dtype=bool)
    # passenger 0 sits at random
    s = rng.integers(n); free[s] = False
    for p in range(1, n - 1):
        if free[p]:
            free[p] = False
        else:
            choices = np.flatnonzero(free)
            free[rng.choice(choices)] = False
    return free[n - 1]  # last passenger's seat still free?

n_trials = 20_000
hits = sum(last_gets_own_seat(100) for _ in range(n_trials))
p = hits / n_trials
print(f"n=100: exact 0.5   simulated {p:.4f}")
print("OK" if abs(p - 0.5) < 0.02 else "MISMATCH")
```
