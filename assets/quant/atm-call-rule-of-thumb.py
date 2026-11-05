"""Price an at-the-money call in your head

From https://vedan1999.github.io/quant/atm-call-rule-of-thumb/
"""
import numpy as np
from scipy.stats import norm

S, K, sigma, T, r = 100.0, 100.0, 0.20, 1.0, 0.0

def bs_call(S, K, sigma, T, r):
    d1 = (np.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*np.sqrt(T))
    d2 = d1 - sigma*np.sqrt(T)
    return S*norm.cdf(d1) - K*np.exp(-r*T)*norm.cdf(d2)

exact = bs_call(S, K, sigma, T, r)
rule = 0.4 * sigma * np.sqrt(T) * S

rng = np.random.default_rng(5)
N = 4_000_000
Z = rng.standard_normal(N)
ST = S * np.exp((r - 0.5*sigma**2)*T + sigma*np.sqrt(T)*Z)
payoff = np.maximum(ST - K, 0.0) * np.exp(-r*T)
mc, se = payoff.mean(), payoff.std(ddof=1)/np.sqrt(N)

print(f"rule of thumb 0.4*sigma*sqrt(T)*S = {rule:.3f}")
print(f"Black-Scholes exact               = {exact:.4f}")
print(f"Monte Carlo                       = {mc:.4f}  (s.e. {se:.4f})")
print(f"with r = 5%: {bs_call(S, K, sigma, T, 0.05):.4f};  three months: {bs_call(S, K, sigma, 0.25, 0.0):.4f}")
ok = abs(exact - 7.9656) < 1e-3 and abs(mc - exact) < 4*se
print("OK" if ok else "MISMATCH")
