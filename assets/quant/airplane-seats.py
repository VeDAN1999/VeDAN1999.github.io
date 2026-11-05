"""The lost boarding pass

From https://vedan1999.github.io/quant/airplane-seats/
"""
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
