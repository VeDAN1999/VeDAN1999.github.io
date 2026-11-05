"""Make me a market on the sum of two dice

From https://vedan1999.github.io/quant/make-a-market-on-a-die/
"""
import numpy as np

faces = np.arange(1, 7)
sums = faces[:, None] + faces[None, :]
fv, sd = sums.mean(), sums.std()
print(f"sum of two dice: mean {fv:.2f}, sd {sd:.3f}")

def expected_pnl(s):
    """You quote 7-s at 7+s; counterparty knows one die d, trades only when profitable for them."""
    pnl = 0.0
    for d in faces:
        v = d + 3.5
        if v > 7 + s: pnl += (7 + s - v) / 6
        if v < 7 - s: pnl += (v - (7 - s)) / 6
    return pnl

for s in (0.5, 1.0, 1.5, 2.0, 2.5):
    print(f"half-spread {s}: expected P&L vs informed counterparty {expected_pnl(s):+.3f}")

# Monte Carlo check of the s = 0.5 case
rng = np.random.default_rng(7)
d = rng.integers(1, 7, size=2_000_000); e = rng.integers(1, 7, size=2_000_000)
v = d + 3.5
pnl = np.where(v > 7.5, 7.5 - (d + e), np.where(v < 6.5, (d + e) - 6.5, 0.0))
print(f"simulated P&L at half-spread 0.5: {pnl.mean():+.4f}")
ok = abs(expected_pnl(0.5) + 1.0) < 1e-12 and abs(pnl.mean() + 1.0) < 0.01 and abs(sd - np.sqrt(35/6)) < 1e-12
print("OK" if ok else "MISMATCH")
