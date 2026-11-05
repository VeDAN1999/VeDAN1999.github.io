---
layout: problem
title: "Bounding a sum you cannot compute"
level: TMUA / MAT
difficulty: 2
topics: inequalities, sequences
summary: "No formula is needed to pin a sum down to within 10 percent, just the right thing to compare it with."
---

Let $S_n = \displaystyle\sum_{k=1}^{n} \frac{1}{k^2}$.

1. Show that for $k \ge 2$,
$$
\frac{1}{k} - \frac{1}{k+1} \;<\; \frac{1}{k^2} \;<\; \frac{1}{k-1} - \frac{1}{k}.
$$
2. Deduce that $S_n < 2$ for every $n$.
3. Show that $S_n > \tfrac{3}{2} - \tfrac{1}{n+1}$ and hence that $1.5 \le \lim S_n \le 2$.
4. (Harder.) By splitting off the first two terms instead of the first one, improve the upper bound to $\tfrac{7}{4}$.

<details class="solution">
<summary>Solution</summary>

**1.** $\frac{1}{k} - \frac{1}{k+1} = \frac{1}{k(k+1)} < \frac{1}{k^2}$ since $k(k+1) > k^2$; and $\frac{1}{k-1} - \frac{1}{k} = \frac{1}{k(k-1)} > \frac{1}{k^2}$ since $k(k-1) < k^2$.

**2.** Sum the right-hand inequality from $k = 2$ to $n$; it telescopes: $S_n - 1 < 1 - \tfrac1n < 1$, so $S_n < 2$.

**3.** Sum the left-hand inequality from $k = 2$ to $n$: $S_n - 1 > \tfrac12 - \tfrac{1}{n+1}$. The sequence is increasing and bounded, so the limit exists and lies in $[\tfrac32, 2]$.

**4.** Keep $1 + \tfrac14$ exact and apply the upper bound from $k = 3$: $S_n < \tfrac54 + \big(\tfrac12 - \tfrac1n\big) < \tfrac74$. Each extra exact term tightens the bound; the true limit is $\pi^2/6 \approx 1.645$, which you are not expected to know here, but the method shows you could squeeze it to any accuracy by hand.

</details>
