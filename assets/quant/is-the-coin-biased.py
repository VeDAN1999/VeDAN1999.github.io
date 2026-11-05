"""60 heads in 100 flips: is the coin biased?

From https://vedan1999.github.io/quant/is-the-coin-biased/
"""
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
