"""How many distinct values in n draws with replacement?

From https://vedan1999.github.io/quant/distinct-values-with-replacement/
"""
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
