---
layout: quant
title: "OLS from scratch in 28 minutes: estimator, mean and variance, and the b × b′ classic"
category: Statistics
daily: 2026-11-11
minutes: 28
difficulty: 2
tags: [linear regression, linear algebra, matrix calculus, correlation]
classic: true
summary: "Derive the least-squares estimator, prove it is unbiased with variance σ²(XᵀX)⁻¹, reduce it to Cov(x, y)/Var(x) for one regressor, and answer what the two regression slopes multiply to."
---

## Question

**Setup.** $y = X\beta + \varepsilon$, where $X$ is an $n \times p$ matrix with full column rank.

1. **Minutes 0 to 10: derive the estimator.** Minimise $\lVert y - X\beta \rVert^2$ over $\beta$ and show that $\hat\beta = (X^\top X)^{-1} X^\top y$. Mark the line where you needed full column rank.
2. **Minutes 10 to 20: its mean and variance.** Assume $E[\varepsilon] = 0$ and $\mathrm{Var}(\varepsilon) = \sigma^2 I$. Prove $E[\hat\beta] = \beta$ and $\mathrm{Var}(\hat\beta) = \sigma^2 (X^\top X)^{-1}$.
3. **Minutes 20 to 28: one regressor.** With an intercept and a single $x$, show the slope is $\mathrm{Cov}(x, y) / \mathrm{Var}(x)$. Then answer this interview classic: regressing $y$ on $x$ gives slope $b$, and regressing $x$ on $y$ gives slope $b'$. What is $b \times b'$?

<details class="solution">
<summary>Solution</summary>

**Answers.** (1) $\hat\beta = (X^\top X)^{-1} X^\top y$. (2) $E[\hat\beta] = \beta$ and $\mathrm{Var}(\hat\beta) = \sigma^2 (X^\top X)^{-1}$. (3) $b = \mathrm{Cov}(x,y)/\mathrm{Var}(x)$ and $b \times b' = r^2$, the squared correlation, which is the $R^2$ of either regression. It is not $1$ unless the points lie exactly on a line.

### Step 0. A dimension ledger

Before any algebra I write down the shape of everything. It takes thirty seconds and means I never have to remember which side a transpose goes on: if the shapes do not chain, the expression is wrong.

| object | shape | note |
|---|---|---|
| $y$, $\varepsilon$ | $n \times 1$ | data and noise |
| $X$ | $n \times p$ | $n \ge p$, columns linearly independent |
| $\beta$, $\hat\beta$ | $p \times 1$ | |
| $X\beta$ | $(n \times p)(p \times 1) = n \times 1$ | same shape as $y$, so $y - X\beta$ makes sense |
| $X^\top$ | $p \times n$ | |
| $X^\top X$ | $(p \times n)(n \times p) = p \times p$ | square, symmetric |
| $X^\top y$ | $(p \times n)(n \times 1) = p \times 1$ | same shape as $\beta$ |
| $(X^\top X)^{-1} X^\top$ | $(p \times p)(p \times n) = p \times n$ | maps data to coefficients |

Note that $X X^\top$ would be $n \times n$ and $X^{-1}$ does not exist at all unless $n = p$. The ledger rules both out immediately.

**Linear algebra facts used below**, each stated once:

- (T1) $(AB)^\top = B^\top A^\top$ and $(A + B)^\top = A^\top + B^\top$.
- (T2) A $1 \times 1$ matrix equals its own transpose.
- (T3) $X^\top X$ is symmetric: $(X^\top X)^\top = X^\top (X^\top)^\top = X^\top X$ by (T1).
- (T4) For invertible $M$, $(M^{-1})^\top = (M^\top)^{-1}$. So the inverse of a symmetric matrix is symmetric.
- (T5) $v^\top v = \lVert v \rVert^2 \ge 0$, with equality only for $v = 0$.

### Part 1. The estimator

**Expand the objective.** $S(\beta) = \lVert y - X\beta \rVert^2 = (y - X\beta)^\top (y - X\beta)$, which is $(1 \times n)(n \times 1) = 1 \times 1$, a scalar. Using (T1),

$$S(\beta) = y^\top y - y^\top X \beta - \beta^\top X^\top y + \beta^\top X^\top X \beta .$$

The two middle terms are each $1 \times 1$, and one is the transpose of the other, $(y^\top X \beta)^\top = \beta^\top X^\top y$ by (T1). By (T2) they are equal, so

$$S(\beta) = y^\top y - 2\, \beta^\top X^\top y + \beta^\top X^\top X \beta .$$

**Differentiate.** The gradient $\partial S / \partial \beta$ is the $p \times 1$ vector of partial derivatives $\partial S / \partial \beta_j$. Two rules are needed, for a fixed $p \times 1$ vector $a$ and a fixed $p \times p$ matrix $A$:

$$\frac{\partial}{\partial \beta}\big(a^\top \beta\big) = a, \qquad \frac{\partial}{\partial \beta}\big(\beta^\top A \beta\big) = (A + A^\top)\beta, \ \text{which is } 2A\beta \text{ when } A \text{ is symmetric.}$$

These look like the scalar rules $(a\beta)' = a$ and $(A\beta^2)' = 2A\beta$, and that is the right way to remember them, but the transposes are subtle enough that I do not trust memory. Writing out the smallest non-trivial case confirms them. With $p = 2$:

$$a^\top \beta = a_1 \beta_1 + a_2 \beta_2 \ \Rightarrow\ \Big(\tfrac{\partial}{\partial \beta_1}, \tfrac{\partial}{\partial \beta_2}\Big) = (a_1, a_2) = a ,$$

$$\beta^\top A \beta = A_{11}\beta_1^2 + (A_{12} + A_{21})\beta_1\beta_2 + A_{22}\beta_2^2 \ \Rightarrow\ \frac{\partial}{\partial \beta_1} = 2A_{11}\beta_1 + (A_{12} + A_{21})\beta_2 ,$$

and the right-hand side is the first entry of $(A + A^\top)\beta$. The second entry works the same way. The shape check agrees too: the gradient must be $p \times 1$, and $a$ and $A\beta$ both are, whereas $a^\top$ or $\beta^\top A$ would be $1 \times p$.

Apply them with $a = X^\top y$ and $A = X^\top X$, symmetric by (T3):

$$\frac{\partial S}{\partial \beta} = -2 X^\top y + 2 X^\top X \beta .$$

**Set to zero.** This gives the normal equations, $p$ equations in $p$ unknowns:

$$X^\top X \,\hat\beta = X^\top y .$$

**Solve. This is the line that needs full column rank.** To write $\hat\beta = (X^\top X)^{-1} X^\top y$ the $p \times p$ matrix $X^\top X$ must be invertible, and it is invertible exactly when $X$ has full column rank. Proof: suppose $X^\top X v = 0$ for some $p \times 1$ vector $v$. Multiply on the left by $v^\top$: $v^\top X^\top X v = (Xv)^\top (Xv) = \lVert Xv \rVert^2 = 0$, so $Xv = 0$ by (T5). $Xv$ is a linear combination of the columns of $X$ with weights $v$; the columns are linearly independent, so $v = 0$. A square matrix whose only null vector is $0$ is invertible. Hence

$$\boxed{\hat\beta = (X^\top X)^{-1} X^\top y}$$

Without full column rank (collinear regressors, or $p > n$) the normal equations still have solutions, but infinitely many of them.

**It is a minimum, not just a stationary point.** For any $\beta$, write $y - X\beta = (y - X\hat\beta) - X(\beta - \hat\beta)$. The cross term vanishes because the normal equations say $X^\top (y - X\hat\beta) = 0$, so

$$S(\beta) = S(\hat\beta) + \lVert X(\beta - \hat\beta) \rVert^2 \ \ge\ S(\hat\beta),$$

with equality only if $X(\beta - \hat\beta) = 0$, that is $\beta = \hat\beta$ by full column rank again. Equivalently the Hessian $2X^\top X$ is positive definite. The identity $X^\top (y - X\hat\beta) = 0$ is the geometric content of least squares: the residual is orthogonal to every column of $X$.

### Part 2. Mean and variance

$X$ is treated as fixed; only $\varepsilon$ is random.

**One lemma, derived from the definition, does all the work.** For a random vector $Y$ ($n \times 1$) with mean $\mu$, the variance is the $n \times n$ matrix

$$\mathrm{Var}(Y) = E\big[(Y - \mu)(Y - \mu)^\top\big],$$

shape $(n \times 1)(1 \times n) = n \times n$. For a fixed $m \times n$ matrix $A$, linearity of expectation gives $E[AY] = A\mu$, and then

$$\mathrm{Var}(AY) = E\big[(AY - A\mu)(AY - A\mu)^\top\big] = E\big[A (Y - \mu)(Y - \mu)^\top A^\top\big] = A\, \mathrm{Var}(Y)\, A^\top ,$$

using (T1) for the transpose and linearity to pull the constant matrices out. Shape check: $(m \times n)(n \times n)(n \times m) = m \times m$. Adding a constant vector changes neither side. This is the matrix version of $\mathrm{Var}(aY) = a^2\,\mathrm{Var}(Y)$, with the $a^2$ split into one factor on each side.

**Write the estimator as a matrix times the noise.** Let $A = (X^\top X)^{-1} X^\top$, which is $p \times n$. Then $\hat\beta = Ay$ and

$$A X = (X^\top X)^{-1} X^\top X = I_p , \qquad\text{so}\qquad \hat\beta = A(X\beta + \varepsilon) = \beta + A\varepsilon .$$

**Mean.** $E[\hat\beta] = \beta + A\, E[\varepsilon] = \beta$. Only $E[\varepsilon] = 0$ was used.

**Variance.** $\beta$ is a constant, so by the lemma with $\mathrm{Var}(\varepsilon) = \sigma^2 I_n$,

$$\mathrm{Var}(\hat\beta) = A\,(\sigma^2 I_n)\, A^\top = \sigma^2 A A^\top = \sigma^2 (X^\top X)^{-1} X^\top \cdot X \big((X^\top X)^{-1}\big)^\top .$$

Here $A^\top = X \big((X^\top X)^{-1}\big)^\top$ by (T1), and $\big((X^\top X)^{-1}\big)^\top = (X^\top X)^{-1}$ by (T3) and (T4). So

$$\mathrm{Var}(\hat\beta) = \sigma^2 (X^\top X)^{-1} (X^\top X) (X^\top X)^{-1} = \boxed{\sigma^2 (X^\top X)^{-1}}$$

which is $p \times p$ as it must be. No normality was needed anywhere: unbiasedness uses the mean of the noise, and the variance uses only that the noise is uncorrelated with common variance.

### Part 3. One regressor

**Set up.** With an intercept, $p = 2$, $\beta = (\alpha, b)^\top$ and $X$ has a column of ones and a column $x$:

$$X^\top X = \begin{pmatrix} n & \sum x_i \\ \sum x_i & \sum x_i^2 \end{pmatrix}, \qquad X^\top y = \begin{pmatrix} \sum y_i \\ \sum x_i y_i \end{pmatrix}.$$

The inverse of a $2 \times 2$ matrix is $\frac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$, so the second entry of $(X^\top X)^{-1} X^\top y$ is

$$b = \frac{n \sum x_i y_i - \sum x_i \sum y_i}{n \sum x_i^2 - \big(\sum x_i\big)^2} .$$

Divide top and bottom by $n^2$: the numerator becomes $\overline{xy} - \bar x\, \bar y$ and the denominator $\overline{x^2} - \bar x^2$, which are the sample covariance and variance:

$$\boxed{b = \frac{\mathrm{Cov}(x, y)}{\mathrm{Var}(x)}}$$

The first normal equation gives the intercept, $\alpha = \bar y - b\, \bar x$, so the fitted line passes through $(\bar x, \bar y)$. Full column rank here means $x$ is not constant, which is exactly $\mathrm{Var}(x) \ne 0$.

**The classic.** Swapping the roles of $x$ and $y$ gives $b' = \mathrm{Cov}(x, y)/\mathrm{Var}(y)$. Therefore

$$b \times b' = \frac{\mathrm{Cov}(x, y)^2}{\mathrm{Var}(x)\,\mathrm{Var}(y)} = r^2 ,$$

the squared correlation, equal to the $R^2$ of either regression. By Cauchy-Schwarz $0 \le r^2 \le 1$. The tempting answer is $1$, on the grounds that the second line is the first one inverted, so $b' = 1/b$. That is true only when $r^2 = 1$ and the points lie exactly on a line. Otherwise the two regressions minimise different things (vertical distances in one, horizontal in the other), both slopes are shrunk towards zero by the noise, and $b' = r^2 / b$ is flatter than $1/b$. Useful corollaries: $b$ and $b'$ always have the same sign, and in standardised units both slopes equal $r$.

**Follow-ups an interviewer might ask.** What is an unbiased estimator of $\sigma^2$? $\lVert y - X\hat\beta \rVert^2 / (n - p)$. Is $\hat\beta$ the best you can do? Among linear unbiased estimators yes (Gauss-Markov), under exactly the two assumptions of Part 2. What changes if $\mathrm{Var}(\varepsilon) = \Sigma$? The lemma gives the sandwich $(X^\top X)^{-1} X^\top \Sigma X (X^\top X)^{-1}$ immediately. What happens to $\mathrm{Var}(\hat\beta)$ when two regressors are nearly collinear? $X^\top X$ is nearly singular and the variance blows up.

**What I would keep from this session.** Three habits made it quick: the dimension ledger, checking the two gradient rules on a $2 \times 2$ example instead of trusting memory, and deriving $\mathrm{Var}(AY) = A\,\mathrm{Var}(Y)A^\top$ once from the definition so that Part 2 becomes three lines.

</details>

## Code

```python
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
```
