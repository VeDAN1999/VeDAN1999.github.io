---
layout: quant
title: "Tiling a 2 by n board with dominoes"
category: Combinatorics
difficulty: 2
tags: [recursion, dynamic programming, Fibonacci]
classic: true
summary: "Look at the leftmost column, write down the recurrence, and the Fibonacci numbers appear. Then do it with code that would also handle 3 by n."
---

## Question

How many ways are there to tile a $2 \times n$ board with $1 \times 2$ dominoes (which may be placed horizontally or vertically)? Give a closed form and a program.

<details class="solution">
<summary>Solution</summary>

**Answer.** $T_n = F_{n+1}$, the Fibonacci numbers with $F_1 = F_2 = 1$: $T_1 = 1$, $T_2 = 2$, $T_3 = 3$, $T_4 = 5$, $T_{10} = 89$, $T_{20} = 10946$.

**Why.** Look at the leftmost column. Either it is covered by one vertical domino, leaving a $2 \times (n-1)$ board, or by two horizontal dominoes stacked, which also cover the second column and leave a $2 \times (n-2)$ board. There is no other way to cover the top-left square. So $T_n = T_{n-1} + T_{n-2}$ with $T_1 = 1$, $T_2 = 2$. Closed form by Binet: $T_n = \big(\varphi^{n+1} - \psi^{n+1}\big)/\sqrt5$ with $\varphi = (1+\sqrt5)/2$, $\psi = (1-\sqrt5)/2$, so the count grows like $\varphi^{n}$.

**The coding half.** The interviewer usually wants to see the recurrence turned into an $O(n)$ loop with two variables, and then whether you can generalise. For a $3 \times n$ board the leftmost column can be covered in more ways and the state has to record which cells of the next column are already filled, which is the classic bitmask DP: state = occupancy of the current column (a bitmask with $m$ bits), transitions = all ways to complete the column. For $3 \times n$, $T_n = 0$ for odd $n$ and $1, 3, 11, 41, 153, \dots$ for $n = 0, 2, 4, 6, 8$, satisfying $T_n = 4T_{n-2} - T_{n-4}$.

**Follow-ups an interviewer might ask.** Count tilings of $2 \times n$ using dominoes and $2 \times 2$ squares: $T_n = T_{n-1} + 2T_{n-2}$, which gives $(2^{n+1} + (-1)^n)/3$. Count tilings of a $1 \times n$ strip with tiles of length 1 and 2 (same recurrence, $F_{n+1}$). What is $T_n$ modulo $10^9 + 7$ for $n = 10^{18}$? Matrix exponentiation of $\big(\begin{smallmatrix}1 & 1\\ 1 & 0\end{smallmatrix}\big)$ in $O(\log n)$.

</details>

## Code

```python
import numpy as np

def tilings_2xn(n):
    a, b = 1, 1          # T_0, T_1
    for _ in range(n):
        a, b = b, a + b
    return a

def tilings_mxn(m, n):
    """Bitmask DP for an m x n board. State = which cells of the current
    column are already occupied by horizontal dominoes from the previous column."""
    from functools import lru_cache
    full = (1 << m) - 1

    @lru_cache(maxsize=None)
    def fill(col, mask):
        if col == n:
            return 1 if mask == 0 else 0
        return place(col, mask, 0, 0)

    @lru_cache(maxsize=None)
    def place(col, mask, row, next_mask):
        if row == m:
            return fill(col + 1, next_mask)
        if mask >> row & 1:                       # already covered
            return place(col, mask, row + 1, next_mask)
        total = 0
        # horizontal domino: covers (row, col) and (row, col+1)
        if col + 1 < n:
            total += place(col, mask, row + 1, next_mask | (1 << row))
        # vertical domino: covers (row, col) and (row+1, col)
        if row + 1 < m and not (mask >> (row + 1) & 1):
            total += place(col, mask, row + 2, next_mask)
        return total

    return fill(0, 0)

def fib_closed(n):
    phi, psi = (1 + 5**0.5) / 2, (1 - 5**0.5) / 2
    return round((phi**(n + 1) - psi**(n + 1)) / 5**0.5)

ok = True
for n in range(1, 13):
    a, b, c = tilings_2xn(n), tilings_mxn(2, n), fib_closed(n)
    ok &= (a == b == c)
print("2xn:", [tilings_2xn(n) for n in range(1, 11)])
print("3xn:", [tilings_mxn(3, n) for n in range(0, 9)])
ok &= [tilings_mxn(3, n) for n in range(0, 9)] == [1, 0, 3, 0, 11, 0, 41, 0, 153]
print(f"T_20 = {tilings_2xn(20)}")
print("OK" if ok and tilings_2xn(20) == 10946 else "MISMATCH")
```
