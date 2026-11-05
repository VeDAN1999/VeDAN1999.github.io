"""Tiling a 2 by n board with dominoes

From https://vedan1999.github.io/quant/domino-tilings/
"""
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
