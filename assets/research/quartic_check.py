"""Numerical checks for https://vedan1999.github.io/research/bounces/quartic/

Tilted quartic  V(x) = (x^2-1)^2/4 + 120 x/343,  stationary points -8/7, 3/7, 5/7.
Everything below is computed from the exact Ito effective potential, with no
small-D expansion used in the numerics:

  1. hilltop a_R(D), residual quartic Q_R and complex turning point rho_{B,+}
  2. exact action I_+(D) by contour quadrature; its constant C_act(D) -> C_R - 12 i pi/11
  3. tail coefficient C_+(D) two ways (contour integral and the real-time ODE);
     its scaled limit C_0 and the determinant constant K_det
  4. the Weierstrass closed form satisfies (dz/du)^2 = Q(z)
  5. the instanton-anti-instanton constants A_B, A_R, g, p, c_0 and the three
     identities tying them to C_0 and C_R
  6. the assembled rate against Kramers' sqrt(kappa_R kappa_B)/(2 pi)
  7. finite-difference spectrum along the real IA family: the two small
     eigenvalues scale as exp(-kappa_B tau) and the transverse determinant as
     exp((kappa_B - kappa_R) tau)   (the "transport" law)
  8. the exact mean first-passage time against Kramers

Run:  python quartic_check.py      (a few minutes; section 7 is the slow one)
"""
import numpy as np
from numpy.polynomial import polynomial as P
from scipy.optimize import brentq
from scipy.integrate import quad, solve_ivp
from scipy.linalg import eigh_tridiagonal

eps = 120/343; l, b, r, m = -8/7, 3/7, 5/7, 4/7
kR, kB, dV = 26/49, 22/49, 16/2401
p = (kR + kB)/(2*kB)                      # 12/11
f  = lambda z: z**3 - z + eps
fp = lambda z: 3*z*z - 1
fpp = lambda z: 6*z
U  = lambda z, D: -f(z)**2 + 2*D*fp(z)
V  = lambda x: (x*x - 1)**2/4 + eps*x
kramers = np.sqrt(kR*kB)/(2*np.pi)

# ---------------------------------------------------------------- 1. saddle geometry
def aR(D): return brentq(lambda a: f(a)*fp(a) - 6*D*a, 0.6, 0.9)
def QR(D):
    a = aR(D)
    fz = np.array([eps, -1, 0, 1.0]); Uz = P.polyadd(-P.polymul(fz, fz), 2*D*np.array([-1, 0, 3.0]))
    num = -Uz; num[0] += U(a, D)                       # U(a) - U(z)
    q, rem = P.polydiv(num, np.array([a*a, -2*a, 1.0]))  # / (a - z)^2
    assert abs(rem).max() < 1e-12
    return a, q
def rho_plus(q): return [z for z in P.polyroots(q) if abs(z - b) < 0.2 and z.imag > 0][0]

# ---------------------------------------------------------------- 2-3. action, tail, determinant
def saddle(D, n=400001):
    a, q = QR(D); rho = rho_plus(q); Om = np.sqrt(P.polyval(a, q).real)
    s = np.linspace(0, 1, n); z = rho + (a - rho)*s**2; dz = 2*(a - rho)*s
    sq = np.sqrt(P.polyval(z, q) + 0j)
    for i in range(n - 2, -1, -1):                     # continuous branch, sqrt(Q(a)) = +Omega
        if abs(sq[i] - sq[i+1]) > abs(-sq[i] - sq[i+1]): sq[i] = -sq[i]
    Ip = np.trapezoid((a - z)*sq*dz, s)
    g = (Om/sq - 1)/(a - z)*dz; g[-1] = 2*g[-2] - g[-3]
    Cp = np.exp(np.log(a - rho) + np.trapezoid(g, s))
    return a, rho, Om, Ip, Cp

CR = 24/11*(np.log(22/(49*np.sqrt(6))) + 0.5) + 9/11*np.log(13/11)
C0 = 2/7*(22/(49*np.sqrt(6)))**(13/11)*(11/13)**(2/11)
Kdet = dV/(kR**3*C0**2)

def main():
    print("== 1-3. exact saddle quantities")
    print(f"predicted: C_R = {CR:.6f}, -12pi/11 = {-12*np.pi/11:.6f}, C_0 = {C0:.6f}, K_det = {Kdet:.4f}")
    print("    D      Re C_act    Im C_act    |C~|/C_0   arg C~/pi   Re Delta~   K/Kramers")
    for D in [1e-3, 1e-4, 1e-5, 1e-6, 1e-7]:
        a, rho, Om, Ip, Cp = saddle(D)
        Cact = (Ip - dV)/D + (12/11)*np.log(D)
        Ct = D**(13/22)*np.exp(13j*np.pi/22)*Cp
        det = -Ip/(Om**3*Cp**2); Dt = -D**(-13/11)*np.exp(-13j*np.pi/11)*det
        inv = 1/np.sqrt(det + 0j)                      # branch: phase -> -12 pi/11
        if not (abs(np.angle(inv) + 12*np.pi/11) < 1 or abs(np.angle(inv) - (2*np.pi - 12*np.pi/11)) < 1): inv = -inv
        K = (np.exp(-Ip/D + dV/D)*np.sqrt(2*Ip/(4*np.pi*D))*inv*np.exp(p)/np.sqrt(2*np.pi*p)).real
        print(f"  {D:7.0e}  {Cact.real:9.6f}  {Cact.imag:9.6f}   {abs(Ct)/C0:8.5f}   {np.angle(Ct)/np.pi:8.5f}   {Dt.real:8.4f}    {K/kramers:.5f}")

    print("\n== 3b. tail coefficient from the real-time ODE (D = 1e-4)")
    D = 1e-4; a, rho, Om, Ip, Cp = saddle(D); _, q = QR(D); qp = P.polyder(q)
    rhs = lambda t, y: (lambda z, w: [((a - z)*w).real, ((a - z)*w).imag, (0.5*(a - z)*P.polyval(z, qp)).real, (0.5*(a - z)*P.polyval(z, qp)).imag])(y[0] + 1j*y[1], y[2] + 1j*y[3])
    sol = solve_ivp(rhs, [0, 50], [rho.real, rho.imag, 0, 0], rtol=1e-12, atol=1e-14)
    z = sol.y[0, -1] + 1j*sol.y[1, -1]
    print(f"  (a - z(50)) e^(Omega 50) = {(a - z)*np.exp(Om*50):.6f}    contour integral: {Cp:.6f}")

    print("\n== 4. Weierstrass form")
    D = 1e-3; a, q = QR(D); rho = rho_plus(q)
    q1, q2, q3 = [P.polyval(rho, P.polyder(q, k)) for k in (1, 2, 3)]
    g2 = q2**2/48 - q1*q3/24; g3 = -q2**3/1728 + q1*q2*q3/576 - q1**2/16
    u0 = 0.05 + 0.02j; d = np.exp(0.3j)
    P0 = 1/u0**2 + g2*u0**2/20 + g3*u0**4/28 + g2**2*u0**6/1200
    dP0 = -2/u0**3 + g2*u0/10 + g3*u0**3/7 + g2**2*u0**5/200
    wp = lambda s, y: (lambda W, dW: [(dW*d).real, (dW*d).imag, ((6*W**2 - g2/2)*d).real, ((6*W**2 - g2/2)*d).imag])(y[0] + 1j*y[1], y[2] + 1j*y[3])
    sol = solve_ivp(wp, [0, 1.2], [P0.real, P0.imag, dP0.real, dP0.imag], rtol=1e-12, atol=1e-14, dense_output=True)
    worst = 0
    for s in np.linspace(0.1, 1.2, 12):
        y = sol.sol(s); W = y[0] + 1j*y[1]; dW = y[2] + 1j*y[3]
        z = rho + q1/(4*(W - q2/24)); dz = -q1*dW/(4*(W - q2/24)**2)
        worst = max(worst, abs(dz**2 - P.polyval(z, q)))
    print(f"  max |(dz/du)^2 - Q(z)| = {worst:.1e}  (limited by the Laurent start of the Weierstrass ODE)")

    print("\n== 5. instanton-anti-instanton constants")
    AB = (1/7)*2**(11/13)*(11/12)**(2/13); AR = (1/7)*2**(13/11)*(13/12)**(-2/11); g = kB*AB**2
    core = quad(lambda x: (fp(x) - kR)/(-f(x)), m, r, limit=200)[0] + quad(lambda x: (fp(x) - kR + kR + kB)/(-f(x)), b, m, limit=200)[0]
    c0 = -core
    print(f"  A_B = {AB:.10f}  A_R = {AR:.10f}  g = {g:.10f}  p = {p:.6f}  c_0 = {c0:.10f} = log(kR A_R/(kB A_B)) = {np.log(kR*AR/(kB*AB)):.10f}")
    print(f"  C_0 = {C0:.10f}  vs  A_R (g/p)^(13/22) = {AR*(g/p)**(13/22):.10f}")
    print(f"  C_R = {CR:.10f}  vs  c_0 + p(1 + log(g/p)) = {c0 + p*(1 + np.log(g/p)):.10f}")
    print(f"  e^-C_R kR C_0 = {np.exp(-CR)*kR*C0:.10f}  vs  sqrt(kB p) e^-p = {np.sqrt(kB*p)*np.exp(-p):.10f}")
    print(f"  K_hard = {np.exp(-CR)*kR**1.5*C0/np.sqrt(2*np.pi):.8f} = sqrt(kR kB)/(2pi) sqrt(2 pi p) e^-p = {kramers*np.sqrt(2*np.pi*p)*np.exp(-p):.8f}")
    from scipy.special import gamma
    print(f"  flat measure: K/Kramers = Gamma(p) p^(1-p) = {gamma(p)*p**(1-p):.8f};  with transport: 1")

    print("\n== 7. spectrum along the real IA family (D = 0)")
    s_of_q = lambda x: np.log((x - b)/(m - b))/kB - np.log((r - x)/(r - m))/kR - 49/143*np.log((x - l)/(m - l))
    def q_of_s(s):
        if s > 60: return r - (r - q_of_s(60))*np.exp(-kR*(s - 60))
        if s < -60: return b + (q_of_s(-60) - b)*np.exp(kB*(s + 60))
        return brentq(lambda x: s_of_q(x) - s, b + 1e-300, r - 1e-16)
    def spectrum(tau, T=80.0, N=16000):
        t = np.linspace(-T/2, T/2, N + 2)[1:-1]; h = t[1] - t[0]
        z = np.array([q_of_s(-tt - tau/2) + q_of_s(tt - tau/2) - b for tt in t])
        Upp = -2*fp(z)**2 - 2*f(z)*fpp(z)
        return eigh_tridiagonal(2/h**2 - 0.5*Upp, -np.ones(N - 1)/h**2, eigvals_only=True)
    taus = [8, 10, 12, 14, 16]; out = []
    for tau in taus:
        w = spectrum(tau); out.append((w[0], w[1], np.sum(np.log(np.abs(w[2:])))))
    for i in range(len(taus) - 1):
        dt = taus[i+1] - taus[i]
        print(f"  tau {taus[i]:2d}->{taus[i+1]:2d}: d log|lam_1| = {np.log(abs(out[i+1][0]/out[i][0]))/dt:+.4f}, d log lam_2 = {np.log(out[i+1][1]/out[i][1])/dt:+.4f}, d log det_perp = {(out[i+1][2] - out[i][2])/dt:+.5f}")
    print(f"  expected: -kB = {-kB:.4f}, -kB, kB - kR = {kB - kR:+.5f}")

    print("\n== 8. exact mean first-passage time R -> L vs Kramers")
    for D in [4e-3, 2e-3, 1e-3]:
        inner = lambda y: quad(lambda z: np.exp(-(V(z) - V(r))/D), y, 3.0, limit=200)[0]
        T = quad(lambda y: np.exp((V(y) - V(b))/D)*inner(y), l, r, limit=200)[0]/D   # T e^{-dV/D}
        print(f"  D = {D:.0e}: (1/T) e^(dV/D) / Kramers = {1/T/kramers:.5f}")

if __name__ == "__main__":
    main()
