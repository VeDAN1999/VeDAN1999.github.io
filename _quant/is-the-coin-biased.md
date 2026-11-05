---
layout: quant
title: "60 heads in 100 flips: is the coin biased?"
category: Statistics
difficulty: 3
tags: [hypothesis testing, binomial, Bayesian, p-values]
classic: true
summary: "Three honest answers to the same question: a frequentist p-value of about 0.057, a Bayesian posterior of about 0.98, and the sentence that explains why they are not in conflict."
---

## Question

You flip a coin 100 times and get 60 heads. Is the coin biased? Give a number, and say what it means.

<details class="solution">
<summary>Solution</summary>

**Answer.** Under the fair-coin hypothesis, a result at least this extreme in either direction has probability about $0.057$ (exact binomial), so this is suggestive but not conclusive at the usual $5\%$ level. With a flat prior on the heads probability, the posterior probability that the coin favours heads is about $0.98$. Both are correct; they answer different questions.

**Why.** *Frequentist.* Under $H_0$: $p = \tfrac12$, the number of heads $X \sim \text{Bin}(100, \tfrac12)$ with mean $50$ and standard deviation $5$. Sixty heads is $z = 2$ standard deviations out. The normal approximation gives a two-sided p-value $2\Phi(-2) \approx 0.046$; with the continuity correction ($59.5$, $z = 1.9$) it is $0.057$; the exact two-sided binomial tail $2P(X \ge 60) = 0.0569$. The continuity-corrected and exact answers agree, and a good interviewer will want you to know that the plain normal approximation is slightly aggressive here.

*Bayesian.* With a $\text{Beta}(1,1)$ prior, the posterior is $\text{Beta}(61, 41)$, mean $61/102 \approx 0.598$, and $P(p > \tfrac12 \mid \text{data}) \approx 0.977$. A sceptical prior concentrated near $\tfrac12$ pulls this down a lot; that is the whole content of "it depends on your prior".

*What it means.* The p-value is the probability of data this extreme if the coin is fair; it is not the probability that the coin is fair. The posterior is a probability about the coin, but only once you have said what you believed beforehand. In a trading context the useful question is usually the second one, with a prior that reflects how often coins (strategies, signals) really are biased, which is why "it is 2 sigma" on its own impresses nobody.

**Follow-ups an interviewer might ask.** How many flips to detect $p = 0.55$ with $80\%$ power at $5\%$? Roughly $n \approx \big((z_{0.975} + z_{0.8})\, \sigma / \delta\big)^2 = (2.8 \times 0.5 / 0.05)^2 \approx 784$. If I let you stop flipping whenever you liked and report the result, what goes wrong with the p-value? Optional stopping inflates it; the Bayesian posterior is unaffected by the stopping rule.

</details>

## Code

```python
import numpy as np
from scipy import stats

n, x = 100, 60
# exact two-sided binomial p-value (both tails, symmetric null)
p_exact = 2 * stats.binom.sf(x - 1, n, 0.5)
# normal approximation with and without continuity correction
z = (x - 50) / 5
p_norm = 2 * stats.norm.sf(z)
p_cc = 2 * stats.norm.sf((x - 0.5 - 50) / 5)
# Bayesian with flat prior
post = stats.beta(x + 1, n - x + 1)
p_biased = post.sf(0.5)
# power calculation: flips needed to detect p=0.55 at 5% two-sided, 80% power
delta, sigma = 0.05, 0.5
n_needed = ((stats.norm.ppf(0.975) + stats.norm.ppf(0.8)) * sigma / delta) ** 2

print(f"exact binomial two-sided p   {p_exact:.4f}")
print(f"normal approx (no cc / cc)    {p_norm:.4f} / {p_cc:.4f}")
print(f"posterior P(p > 1/2), flat    {p_biased:.4f}   posterior mean {post.mean():.4f}")
print(f"flips to detect p=0.55 (80% power) ~ {n_needed:.0f}")
ok = abs(p_exact - 0.0569) < 5e-4 and abs(p_biased - 0.977) < 2e-3
print("OK" if ok else "MISMATCH")
```
