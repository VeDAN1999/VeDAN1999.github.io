---
layout: quant
title: "Expected rolls until two sixes in a row"
category: Probability
difficulty: 2
tags: [expectation, Markov chains, first-step analysis]
classic: true
summary: "Condition on the first roll, keep track of one bit of state, and 42 drops out. Then see why 'six then five' is cheaper."
---

## Question

You roll a fair die repeatedly. What is the expected number of rolls until you see two sixes in a row?

Follow-up: what about a six immediately followed by a five?

<details class="solution">
<summary>Solution</summary>

**Answer.** 42 rolls for two sixes in a row; 36 for a six then a five.

**Why.** The only thing that matters about the past is whether the last roll was a six. Let $E_0$ be the expected rolls to finish from "last roll was not a six" (which is also the starting state) and $E_1$ from "last roll was a six". One roll from each state:

$$
E_0 = 1 + \tfrac56 E_0 + \tfrac16 E_1, \qquad E_1 = 1 + \tfrac56 E_0 + \tfrac16\cdot 0 .
$$

Substituting the second into the first, $E_0 = 1 + \tfrac56 E_0 + \tfrac16 + \tfrac{5}{36}E_0$, so $\tfrac{1}{36}E_0 = \tfrac76$ and $E_0 = 42$.

A cleaner way to remember it: for a pattern of length $k$ on a fair $m$-sided die, the expected waiting time is $\sum m^{j}$ over every prefix length $j$ at which the pattern overlaps itself. "66" overlaps itself at length 1 and length 2, giving $6 + 36 = 42$. "65" has no self-overlap except the whole thing, giving $36$. This is the Conway / Penney's-game result and it is worth knowing cold, because the follow-ups ("HTH versus HHH", "which pattern comes first") all come from it.

**Follow-ups an interviewer might ask.** Three sixes in a row: $6 + 36 + 216 = 258$. Two sixes not necessarily consecutive: $12$ (two independent geometric waits). Why is 66 slower than 65 even though both are probability $1/36$ per position? Because successes at 66 cluster: after a failure at the second six you are already half way to the next attempt only if you rolled a six, so attempts overlap and the mean waiting time is longer.

</details>

## Code

```python
import numpy as np

# Exact: solve the two-state first-step equations
A = np.array([[1 - 5/6, -1/6],
              [-5/6,     1.0]])
b = np.array([1.0, 1.0])
E0, E1 = np.linalg.solve(A, b)

# Simulation
rng = np.random.default_rng(0)
def wait_for(pattern, n_trials=200_000):
    k = len(pattern)
    total = 0
    for _ in range(n_trials):
        rolls = 0
        window = []
        while True:
            window.append(int(rng.integers(1, 7)))
            rolls += 1
            if window[-k:] == pattern:
                break
        total += rolls
    return total / n_trials

sim66 = wait_for([6, 6])
sim65 = wait_for([6, 5])
print(f"two sixes:      exact {E0:.3f}   simulated {sim66:.3f}")
print(f"six then five:  exact 36.000   simulated {sim65:.3f}")
print("OK" if abs(E0 - 42) < 1e-9 and abs(sim66 - 42) < 0.5 and abs(sim65 - 36) < 0.5 else "MISMATCH")
```
