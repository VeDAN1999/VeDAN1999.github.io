---
layout: quant
title: "Gambler's ruin: probability and duration"
category: Martingales and stopping
difficulty: 3
tags: [martingales, optional stopping, random walks]
classic: true
summary: "Start with k pounds, bet one pound on a fair coin until you have N or nothing. Two martingales give the win probability and the expected number of bets in four lines."
---

## Question

You have $k$ pounds and bet one pound on a fair coin flip each round, stopping when you reach $N$ pounds or go broke. What is the probability you reach $N$, and how many rounds do you expect to play?

Follow-up: what changes if the coin is biased, with probability $p \ne \tfrac12$ of winning each round?

<details class="solution">
<summary>Solution</summary>

**Answer.** Fair coin: $P(\text{reach } N) = k/N$ and $\mathbb{E}[\text{rounds}] = k(N-k)$.

**Why.** Let $S_t$ be your wealth after $t$ rounds and $\tau$ the stopping time. For a fair coin $S_t$ is a martingale and $\tau$ has finite expectation, so the optional stopping theorem gives $\mathbb{E}[S_\tau] = S_0 = k$. But $S_\tau$ is $N$ with probability $q$ and $0$ otherwise, so $Nq = k$ and $q = k/N$.

For the duration, $S_t^2 - t$ is also a martingale (each step changes $S^2$ by $\pm 2S + 1$, mean $+1$, which the $-t$ cancels). Stopping it: $\mathbb{E}[S_\tau^2] - \mathbb{E}[\tau] = k^2$, and $\mathbb{E}[S_\tau^2] = N^2 \cdot k/N = Nk$, so $\mathbb{E}[\tau] = Nk - k^2 = k(N-k)$.

Sanity check: from the midpoint of a 100-pound game you expect $50 \times 50 = 2500$ rounds, which is why casinos are happy for you to play fair games for a long time and take the rake.

**Biased coin.** With $r = (1-p)/p$, the process $r^{S_t}$ is a martingale, which gives

$$
P(\text{reach } N) = \frac{1 - r^{k}}{1 - r^{N}},
\qquad
\mathbb{E}[\tau] = \frac{k}{1-2p} - \frac{N}{1-2p}\cdot\frac{1 - r^{k}}{1 - r^{N}} .
$$

The second comes from the martingale $S_t - (2p-1)t$. For a casino edge as small as $p = 0.49$ and $N = 100$, starting at $k = 50$ gives a win probability of about $12\%$ rather than $50\%$: the exponential in $r^N$ is brutal.

**Follow-ups an interviewer might ask.** Why does the optional stopping theorem apply (bounded stopping time in expectation, bounded increments)? With no lower barrier (you can borrow without limit), what is the probability of ever getting $N-k$ pounds ahead? Send the lower barrier to $-\infty$ in the formula: $\min\!\big(1, (p/(1-p))^{N-k}\big)$, so certain for a fair or favourable coin and exponentially unlikely for an unfavourable one.

</details>

## Code

```python
import numpy as np

def exact(k, N, p):
    """Win probability and expected duration via the linear system."""
    # states 1..N-1 interior; solve for h (win prob) and T (duration)
    n = N - 1
    A = np.zeros((n, n)); bh = np.zeros(n); bT = np.ones(n)
    for i in range(n):
        s = i + 1
        A[i, i] = 1.0
        if s + 1 < N: A[i, i + 1] = -p
        else:         bh[i] += p          # win absorbs at N
        if s - 1 > 0: A[i, i - 1] = -(1 - p)
    h = np.linalg.solve(A, bh)
    T = np.linalg.solve(A, bT)
    return h[k - 1], T[k - 1]

def simulate(k, N, p, trials, rng):
    wins = 0; rounds = 0
    for _ in range(trials):
        s = k; t = 0
        while 0 < s < N:
            s += 1 if rng.random() < p else -1
            t += 1
        wins += (s == N); rounds += t
    return wins / trials, rounds / trials

rng = np.random.default_rng(2)
k, N = 30, 100
for p in (0.5, 0.49):
    h, T = exact(k, N, p)
    hs, Ts = simulate(k, N, p, 4000, rng)
    if p == 0.5:
        print(f"fair:   closed form P={k/N:.4f}  E[tau]={k*(N-k)}   | linear solve P={h:.4f} E={T:.1f} | sim P={hs:.4f} E={Ts:.1f}")
        ok = abs(h - k/N) < 1e-9 and abs(T - k*(N-k)) < 1e-6 and abs(hs - k/N) < 0.03
    else:
        r = (1-p)/p
        Pc = (1 - r**k)/(1 - r**N)
        Tc = k/(1-2*p) - N/(1-2*p)*Pc
        print(f"p=0.49: closed form P={Pc:.4f}  E[tau]={Tc:.1f} | linear solve P={h:.4f} E={T:.1f} | sim P={hs:.4f} E={Ts:.1f}")
        ok = ok and abs(h - Pc) < 1e-9 and abs(T - Tc) < 1e-6 and abs(hs - Pc) < 0.03
print("OK" if ok else "MISMATCH")
```
