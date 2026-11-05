---
layout: quant
title: "How much to bet on a 60/40 coin"
category: Betting and sizing
difficulty: 2
tags: [Kelly criterion, log growth, risk]
classic: true
summary: "A coin lands heads 60 percent of the time and pays even money. Bet 20 percent of your bankroll, every time, and nothing else grows faster in the long run."
---

## Question

A coin comes up heads with probability $0.6$ and pays even money. You can bet any fraction of your bankroll on each flip and will play many times. What fraction should you bet to maximise long-run growth, and what growth rate do you get? What happens if you bet twice that?

<details class="solution">
<summary>Solution</summary>

**Answer.** Bet $f^* = 2p - 1 = 0.2$ of your bankroll each time. The expected log-growth per flip is $g(0.2) = 0.6\ln 1.2 + 0.4\ln 0.8 \approx 0.0201$, about $2\%$ per flip. Betting $0.4$ gives $g(0.4) = 0.6\ln 1.4 + 0.4\ln 0.6 \approx -0.0024$: a positive-expectation bet that loses money with certainty in the long run.

**Why.** After $n$ flips with $k$ heads, betting a fixed fraction $f$, your wealth is $W_n = W_0 (1+f)^k (1-f)^{n-k}$. By the law of large numbers $\tfrac1n \ln(W_n/W_0) \to p\ln(1+f) + (1-p)\ln(1-f) =: g(f)$. Maximise: $g'(f) = \tfrac{p}{1+f} - \tfrac{1-p}{1-f} = 0$ gives $f^* = 2p-1$. For general odds $b$ to 1 the same calculation gives the Kelly formula $f^* = p - (1-p)/b$.

The point interviewers want you to make: maximising expected *wealth* says bet everything every time (expected wealth $(1.2)^n W_0$), and that strategy goes bankrupt with probability $1$. Maximising expected *log* wealth is the only fixed-fraction rule under which your wealth almost surely beats every other fixed fraction in the long run. The growth curve $g(f)$ is a hump: zero at $f=0$, maximal at $f^*$, and back to zero at $f = 2f^* = 0.4$ (not exactly, but close: $g(0.4) \approx -0.002$). Over-betting is punished much more harshly than under-betting.

**Follow-ups an interviewer might ask.** Why do practitioners bet "half Kelly"? Because $g$ is flat near the top (half Kelly gives about $75\%$ of the growth rate) while the variance of log wealth scales roughly like $f^2$, so the drawdowns shrink a lot for a small cost in growth. What if you only get $n = 10$ flips? Then the long-run argument does not apply and the answer depends on your utility. What is the probability of being below your starting wealth after $n$ flips at full Kelly? Roughly $\Phi(-\sqrt{n}\, g/\sigma)$ with $\sigma^2 = p(1-p)\big(\ln\tfrac{1+f}{1-f}\big)^2$, about $16\%$ at $n = 100$ and $31\%$ at $n = 25$: growth-optimal is not the same as comfortable.

</details>

## Code

```python
import numpy as np

p = 0.6
def g(f):
    return p*np.log(1+f) + (1-p)*np.log(1-f)

fs = np.linspace(0, 0.99, 991)
f_star = fs[np.argmax(g(fs))]
print(f"Kelly fraction: analytic {2*p-1:.3f}  grid search {f_star:.3f}")
print(f"growth rate at 0.2: {g(0.2):+.5f} per flip, at 0.4: {g(0.4):+.5f}, at 0.1: {g(0.1):+.5f}")

# Simulate many bankrolls to see the median outcome under three fractions
rng = np.random.default_rng(3)
n_flips, n_paths = 1000, 20_000
heads = rng.random((n_paths, n_flips)) < p
k = heads.sum(axis=1)
for f in (0.1, 0.2, 0.4, 1.0):
    logW = k*np.log(1+f) + (n_flips - k)*np.log(1-f) if f < 1 else np.where(k == n_flips, n_flips*np.log(2), -np.inf)
    med = np.median(logW)/n_flips
    print(f"f={f:.1f}: median log-growth per flip {med:+.5f}, P(ahead after {n_flips} flips) = {np.mean(logW > 0):.3f}")

ok = abs(f_star - 0.2) < 2e-3 and abs(g(0.2) - 0.020136) < 1e-5
print("OK" if ok else "MISMATCH")
```
