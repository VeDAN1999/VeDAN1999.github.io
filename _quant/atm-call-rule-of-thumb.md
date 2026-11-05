---
layout: quant
title: "Price an at-the-money call in your head"
category: Options and pricing
difficulty: 3
tags: [Black-Scholes, approximation, Monte Carlo]
classic: true
summary: "Spot 100, strike 100, one year, 20 percent vol, zero rates. The answer is about 8, the exact answer is 7.97, and the reason is a Gaussian integral you can do on a napkin."
---

## Question

A stock trades at 100 with volatility $20\%$. Interest rates and dividends are zero. What is a one-year at-the-money European call worth? Do it without a calculator first, then exactly.

<details class="solution">
<summary>Solution</summary>

**Answer.** About $8$ by the rule of thumb $C_{\text{ATM}} \approx 0.4\,\sigma\sqrt{T}\,S$; exactly $7.97$ from Black-Scholes.

**Why.** With $r = 0$ and $K = S$, Black-Scholes reduces to $C = S\,[\Phi(d_1) - \Phi(d_2)]$ with $d_{1,2} = \pm\tfrac12\sigma\sqrt{T}$. For small $\sigma\sqrt T$ the difference of the two normal CDFs is the density at zero times the width: $\Phi(d_1) - \Phi(d_2) \approx \phi(0)\,\sigma\sqrt T = \sigma\sqrt T / \sqrt{2\pi} \approx 0.399\,\sigma\sqrt{T}$. Hence $C \approx 0.4\,\sigma\sqrt T\, S = 0.4 \times 0.2 \times 100 = 8$.

Exactly: $d_1 = 0.1$, $d_2 = -0.1$, $\Phi(0.1) = 0.5398$, $\Phi(-0.1) = 0.4602$, so $C = 100 \times 0.0796 = 7.97$. The rule of thumb is $0.4\%$ high because the next term in the expansion is $-\tfrac{1}{24}(\sigma\sqrt T)^3/\sqrt{2\pi}$, negligible here.

A second route worth knowing: the ATM straddle is worth $2C \approx 0.8\,\sigma\sqrt T\,S$, which is also the expected absolute move $\mathbb{E}|S_T - S_0|$ to leading order. So "a 20-vol stock moves about 16 percent in a year, in absolute expected terms" is the same statement.

**Follow-ups an interviewer might ask.** What is the delta of the ATM call? $\Phi(d_1) = 0.54$, slightly above one half because the lognormal drift at zero rates is $-\tfrac12\sigma^2 T$ and the forward ATM strike sits a little below spot. What is the vega? $S\phi(d_1)\sqrt T \approx 100 \times 0.397 \times 1 \approx 39.7$ per unit of vol, i.e. about $0.40$ per vol point, which is the same $0.4\,S\sqrt T$ as the price rule of thumb. If the same option had three months to expiry: $\sqrt{0.25} = 0.5$, so about $4$. With $r = 5\%$: use the forward, $F = 100 e^{0.05} \approx 105.1$, and the ATM-forward price is $0.4 \times 0.2 \times 105.1 \times e^{-0.05} \approx 8.0$ again, but a strike of 100 is now $5\%$ in the money and the call is worth more, about $10.45$.

</details>

## Code

```python
import numpy as np
from scipy.stats import norm

S, K, sigma, T, r = 100.0, 100.0, 0.20, 1.0, 0.0

def bs_call(S, K, sigma, T, r):
    d1 = (np.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*np.sqrt(T))
    d2 = d1 - sigma*np.sqrt(T)
    return S*norm.cdf(d1) - K*np.exp(-r*T)*norm.cdf(d2)

exact = bs_call(S, K, sigma, T, r)
rule = 0.4 * sigma * np.sqrt(T) * S

rng = np.random.default_rng(5)
N = 4_000_000
Z = rng.standard_normal(N)
ST = S * np.exp((r - 0.5*sigma**2)*T + sigma*np.sqrt(T)*Z)
payoff = np.maximum(ST - K, 0.0) * np.exp(-r*T)
mc, se = payoff.mean(), payoff.std(ddof=1)/np.sqrt(N)

print(f"rule of thumb 0.4*sigma*sqrt(T)*S = {rule:.3f}")
print(f"Black-Scholes exact               = {exact:.4f}")
print(f"Monte Carlo                       = {mc:.4f}  (s.e. {se:.4f})")
print(f"with r = 5%: {bs_call(S, K, sigma, T, 0.05):.4f};  three months: {bs_call(S, K, sigma, 0.25, 0.0):.4f}")
ok = abs(exact - 7.9656) < 1e-3 and abs(mc - exact) < 4*se
print("OK" if ok else "MISMATCH")
```
