"""Expected rolls until two sixes in a row

From https://vedan1999.github.io/quant/two-sixes-in-a-row/
"""
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
