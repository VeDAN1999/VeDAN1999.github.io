"""Gambler's ruin: probability and duration

From https://vedan1999.github.io/quant/gamblers-ruin/
"""
import numpy as np

def exact(k, N, p):
    """Win probability and expected duration via the linear system."""
    # states 1..N-1 interior; solve for h (win prob) and T (duration)
    n = N - 1
    A = np.zeros((n, n)); bh = np.zeros(n); bT = np.ones(n)
    for i in range(n):
        s = i + 1
        A[i, i] = 1.0
        if s + 1 < N: A[i, i + 1] = -p
        else:         bh[i] += p          # win absorbs at N
        if s - 1 > 0: A[i, i - 1] = -(1 - p)
    h = np.linalg.solve(A, bh)
    T = np.linalg.solve(A, bT)
    return h[k - 1], T[k - 1]

def simulate(k, N, p, trials, rng):
    wins = 0; rounds = 0
    for _ in range(trials):
        s = k; t = 0
        while 0 < s < N:
            s += 1 if rng.random() < p else -1
            t += 1
        wins += (s == N); rounds += t
    return wins / trials, rounds / trials

rng = np.random.default_rng(2)
k, N = 30, 100
for p in (0.5, 0.49):
    h, T = exact(k, N, p)
    hs, Ts = simulate(k, N, p, 4000, rng)
    if p == 0.5:
        print(f"fair:   closed form P={k/N:.4f}  E[tau]={k*(N-k)}   | linear solve P={h:.4f} E={T:.1f} | sim P={hs:.4f} E={Ts:.1f}")
        ok = abs(h - k/N) < 1e-9 and abs(T - k*(N-k)) < 1e-6 and abs(hs - k/N) < 0.03
    else:
        r = (1-p)/p
        Pc = (1 - r**k)/(1 - r**N)
        Tc = k/(1-2*p) - N/(1-2*p)*Pc
        print(f"p=0.49: closed form P={Pc:.4f}  E[tau]={Tc:.1f} | linear solve P={h:.4f} E={T:.1f} | sim P={hs:.4f} E={Ts:.1f}")
        ok = ok and abs(h - Pc) < 1e-9 and abs(T - Tc) < 1e-6 and abs(hs - Pc) < 0.03
print("OK" if ok else "MISMATCH")
