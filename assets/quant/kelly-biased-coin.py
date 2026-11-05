"""How much to bet on a 60/40 coin

From https://vedan1999.github.io/quant/kelly-biased-coin/
"""
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
