---
layout: problem
title: "Triangles from tangents to a parabola"
level: STEP I
difficulty: 3
topics: coordinate geometry, calculus
summary: "Three tangents to a parabola always form a triangle whose area is a fixed fraction of something else. Find the fraction."
---

Let $P$, $Q$, $R$ be three points on the parabola $y = x^2$ with $x$-coordinates $p < q < r$.

1. Show that the tangents at $P$ and $Q$ meet at the point $\big(\tfrac{p+q}{2},\, pq\big)$.
2. Find the area of the triangle formed by the three tangents at $P$, $Q$ and $R$.
3. Find the area of the triangle $PQR$, and hence show that the ratio of the two areas is independent of $p$, $q$ and $r$.
4. Does the same ratio hold for the parabola $y = ax^2 + bx + c$? Justify your answer without repeating the whole calculation.

<details class="solution">
<summary>Solution</summary>

**1.** The tangent at $(p, p^2)$ is $y = 2px - p^2$. Solving with $y = 2qx - q^2$ gives $2(p-q)x = p^2 - q^2$, so $x = \tfrac{p+q}{2}$ and $y = p(p+q) - p^2 = pq$.

**2.** The three vertices are $A = \big(\tfrac{p+q}{2}, pq\big)$, $B = \big(\tfrac{q+r}{2}, qr\big)$, $C = \big(\tfrac{p+r}{2}, pr\big)$. Using the shoelace formula and factorising,

$$
\text{area}_{\text{tangents}} = \tfrac12\,\big|\,(q-p)(r-q)(r-p)\,\big| \cdot \tfrac12 = \tfrac14 (q-p)(r-q)(r-p).
$$

**3.** For $P = (p, p^2)$ and so on, the shoelace formula gives the standard result $\text{area}_{PQR} = \tfrac12 (q-p)(r-q)(r-p)$. The ratio is therefore exactly $\tfrac12$: the tangent triangle always has half the area of the chord triangle.

**4.** Yes. The map $(x, y) \mapsto (x, y + bx + c)$ is a shear followed by a translation, and $y = ax^2$ is $y = x^2$ scaled vertically by $a$. Shears and translations preserve area; vertical scaling multiplies *both* areas by $|a|$. Tangency is preserved by all of these maps, so the ratio is unchanged.

</details>
