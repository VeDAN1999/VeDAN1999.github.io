"""Break a stick in two places: do the pieces make a triangle?

From https://vedan1999.github.io/quant/broken-stick-triangle/
"""
import numpy as np

rng = np.random.default_rng(4)
N = 2_000_000
cuts = np.sort(rng.random((N, 2)), axis=1)
a = cuts[:, 0]; b = cuts[:, 1] - cuts[:, 0]; c = 1 - cuts[:, 1]
tri = (a < 0.5) & (b < 0.5) & (c < 0.5)
p = tri.mean()

# follow-up: break once, then break the longer piece
u = rng.random(N); long_piece = np.maximum(u, 1 - u); short = 1 - long_piece
v = rng.random(N) * long_piece
p_longer = ((v < 0.5) & (long_piece - v < 0.5) & (short < 0.5)).mean()

print(f"two uniform cuts:         exact 0.25     simulated {p:.4f}")
print(f"then break longer piece:  exact {2*np.log(2)-1:.4f}   simulated {p_longer:.4f}")
print("OK" if abs(p - 0.25) < 2e-3 and abs(p_longer - (2*np.log(2)-1)) < 2e-3 else "MISMATCH")
