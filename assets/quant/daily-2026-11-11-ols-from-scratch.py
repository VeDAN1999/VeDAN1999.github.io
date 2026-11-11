"""OLS from scratch in 28 minutes: estimator, mean and variance, and the b × b′ classic

From https://vedan1999.github.io/quant/daily-2026-11-11-ols-from-scratch/
"""
import numpy as np

rng = np.random.default_rng(11112026)
n, p, sigma = 200, 4, 0.7
X = np.column_stack([np.ones(n), rng.normal(size=(n, p - 1))])
beta = np.array([1.0, -2.0, 0.5, 3.0])
XtX_inv = np.linalg.inv(X.T @ X)

# Part 1: closed form against a library least-squares solve
y = X @ beta + sigma * rng.normal(size=n)
bhat = XtX_inv @ X.T @ y
assert np.allclose(bhat, np.linalg.lstsq(X, y, rcond=None)[0])
# the two gradient rules, by central finite differences on small test matrices
a, A, b0, h = rng.normal(size=3), rng.normal(size=(3, 3)), rng.normal(size=3), 1e-6
grad = lambda f: np.array([(f(b0 + h * e) - f(b0 - h * e)) / (2 * h) for e in np.eye(3)])
assert np.allclose(grad(lambda b: a @ b), a, atol=1e-6)
assert np.allclose(grad(lambda b: b @ A @ b), (A + A.T) @ b0, atol=1e-6)
# residual is orthogonal to the columns of X
assert np.allclose(X.T @ (y - X @ bhat), 0, atol=1e-8)

# Part 2: Monte Carlo mean and covariance of beta-hat with X held fixed
M = 200_000
eps = sigma * rng.normal(size=(M, n))
B = beta + eps @ (XtX_inv @ X.T).T
print("mean of beta-hat      ", B.mean(axis=0).round(4), " true", beta)
print("max |cov - s2 (X'X)^-1|", np.abs(np.cov(B.T) - sigma**2 * XtX_inv).max().round(6))
assert np.allclose(B.mean(axis=0), beta, atol=2e-3)
assert np.allclose(np.cov(B.T), sigma**2 * XtX_inv, atol=2e-4)

# Part 3: slope = Cov/Var, and b * b' = r^2
x = rng.normal(size=500); z = 0.6 * x + rng.normal(size=500)
slope = lambda u, v: np.linalg.lstsq(np.column_stack([np.ones_like(u), u]), v, rcond=None)[0][1]
b, b_rev = slope(x, z), slope(z, x)
r = np.corrcoef(x, z)[0, 1]
print(f"b = {b:.6f}  Cov/Var = {np.cov(x, z, bias=True)[0, 1] / x.var():.6f}")
print(f"b * b' = {b * b_rev:.6f}  r^2 = {r**2:.6f}  (1/b = {1 / b:.4f}, b' = {b_rev:.4f})")
assert np.isclose(b, np.cov(x, z, bias=True)[0, 1] / x.var())
assert np.isclose(b * b_rev, r**2)
print("OK")
