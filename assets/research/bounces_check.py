"""Numerical check of the closed-form saddles on
https://vedan1999.github.io/research/bounces/

For each closed form x(t) we substitute into the equation of motion
    x'' = -Phi'(x)/2,   Phi = -V'^2 + 2 D V''
and the first integral x'^2 + Phi(x) = E, by finite differences on a
fine real-t grid (away from any singularities), and report the maximum
residual. For the sine-Gordon complex bounce we also compute the Laurent
coefficients of the action density at the pole by a contour integral.

Run:  python bounces_check.py
"""
import numpy as np
from scipy.optimize import brentq


def residuals(x, t, rhs, Phi, E, mask=None):
    dt = t[1] - t[0]
    xd = np.gradient(x, dt)
    xdd = np.gradient(xd, dt)
    r = np.abs(xdd - rhs(x))
    e = np.abs(xd**2 + Phi(x) - E)
    if mask is None:
        mask = np.ones_like(t, dtype=bool)
    mask = mask.copy(); mask[:200] = False; mask[-200:] = False
    return r[mask].max(), e[mask].max()


# ---------------------------------------------------------------- cubic
def cubic(a=1.0, D=0.05):
    print(f"\n== cubic  V = -x^3/3 + a^2 x   (a={a}, D={D})")
    Phi = lambda x: -(a*a - x*x)**2 - 4*D*x
    rhs = lambda x: -2*x*(a*a - x*x) + 2*D
    xh = brentq(lambda x: x*(a*a - x*x) - D, -1.5*a, -0.5*a)   # hilltop near the well
    om = np.sqrt(6*xh**2 - 2*a*a)
    E = Phi(xh)
    xt = -xh + 1j*np.sqrt(2*(xh*xh - a*a))                      # turning point
    beta, gamma = 4*xh, om*om
    w0 = beta + 2*gamma/(xt - xh)
    x_of_t = lambda t: xh + 4*gamma*(w0*np.exp(-om*t))/((w0*np.exp(-om*t) - beta)**2 - 4*gamma)

    print(f"  x_h = {xh:.6f}   omega = {om:.6f}   E = {E:.6f}   x_t = {xt:.6f}")
    print(f"  check: Phi(x_t) - E = {abs(Phi(xt) - E):.1e}   x(0) - x_t = {abs(x_of_t(0.0) - xt):.1e}")
    t = np.linspace(-6, 6, 40001)
    r, e = residuals(x_of_t(t), t, rhs, Phi, E)
    print(f"  complex bounce: max |x'' - rhs| = {r:.1e}, max |energy - E| = {e:.1e}")
    return r < 1e-4 and e < 1e-5


# ----------------------------------------------------------- sine-Gordon
def sine_gordon(a=1.0, D=0.05):
    print(f"\n== sine-Gordon  V = -4a^3 cos(x/2a)   (a={a}, D={D})")
    delta = np.sqrt(D/(4*a**3)); kappa = np.sqrt(1 + delta**2); om = kappa*a
    Phi = lambda x: -4*a**4*np.sin(x/(2*a))**2 + 2*D*a*np.cos(x/(2*a))
    rhs = lambda x: a**3*np.sin(x/a) + 0.5*D*np.sin(x/(2*a))
    E_well, E_bar = Phi(0.0), Phi(2*np.pi*a)
    print(f"  delta = {delta:.5f}  omega = {om:.6f}  E_well = {E_well:.4f}  E_barrier = {E_bar:.4f}")
    ok = True

    # kink pair
    t = np.linspace(-8, 8, 80001)
    c = delta*np.sinh(om*t)/np.sqrt(1 + delta**2*np.cosh(om*t)**2)
    x = 4*a*np.arccos(c.astype(complex))
    r, e = residuals(x, t, rhs, Phi, E_well)
    print(f"  kink pair:      x(-8)={x[0].real:.3f} -> x(8)={x[-1].real:.3f};  residual {r:.1e}, energy {e:.1e}")
    ok &= r < 1e-4 and e < 1e-5

    # real bounce from the barrier
    kp = np.sqrt(1 - delta**2); omp = kp*a
    s = delta/np.sqrt(1 - kp**2*np.tanh(omp*t)**2)
    x = 4*a*np.arcsin(s)
    r, e = residuals(x, t, rhs, Phi, E_bar)
    print(f"  real bounce:    turns at x(0)={x[len(t)//2]:.4f} (4a arcsin delta = {4*a*np.arcsin(delta):.4f}); residual {r:.1e}, energy {e:.1e}")
    ok &= r < 1e-4 and e < 1e-5

    # complex bounce, with poles at +-s1
    s1 = np.arcsinh(1/delta)/om
    c = delta*np.cosh(om*t)/np.sqrt(delta**2*np.sinh(om*t)**2 - 1 + 0j)
    x = 4*a*np.arccos(c)
    mask = np.abs(np.abs(t) - s1) > 0.35
    r, e = residuals(x, t, rhs, Phi, E_well, mask)
    i0 = len(t)//2
    print(f"  complex bounce: poles at t = +-{s1:.4f}; x(0) = {x[i0]:.4f} (barrier 2 pi a = {2*np.pi*a:.4f}, Im 2 sqrt(D/a) = {2*np.sqrt(D/a):.4f})")
    print(f"                  Re x between poles = {x[np.abs(t) < s1 - 0.1].real.mean():.4f}, outside = {x[np.abs(t) > s1 + 0.1].real.mean():.4f}")
    print(f"                  residual {r:.1e}, energy {e:.1e}  (grid excludes +-0.35 around each pole)")
    ok &= r < 1e-3 and e < 1e-4

    # Laurent coefficients of the action density L = (2 x'^2 - E)/4D at the pole t = s1
    Phi_c2 = lambda c2: -16*a**4*(1 - c2)*c2 + 2*D*a*(2*c2 - 1)       # Phi as a function of cos^2(x/4a)
    xdot2 = lambda z: E_well - Phi_c2(delta**2*np.cosh(om*z)**2/(delta**2*np.sinh(om*z)**2 - 1))
    rad = 1e-3; th = np.linspace(0, 2*np.pi, 40001); z = s1 + rad*np.exp(1j*th); dz = 1j*rad*np.exp(1j*th)
    L = (2*xdot2(z) - E_well)/(4*D)
    res = np.trapezoid(L*dz, th)/(2j*np.pi)
    c2 = np.trapezoid(L*(z - s1)*dz, th)/(2j*np.pi)
    print(f"  action density at the pole: coefficient of 1/(t-s1)^2 = {c2.real:.4f} (predicted {-2*a*a/D:.4f}), residue = {res.real:.4f} (predicted -0.5)")
    ok &= abs(res.real + 0.5) < 1e-6 and abs(c2.real + 2*a*a/D) < 1e-6
    return ok


if __name__ == "__main__":
    ok = cubic() & sine_gordon()
    print("\nOK" if ok else "\nMISMATCH")
