#!/usr/bin/env python3
"""
poisson_binomial_random_H.py
============================

Paper 4 v1.4 reproducible Poisson-binomial null-distribution script
(fix 3 of 6 v1.4 integrity fix package).

Purpose
-------
The independent audit (Reviewer_Audit_Paper4_v1.3.md §5.3) reproduced
P(X >= 17) = 2.29 x 10^-8 under "H uniform on {2..8}, branch matched to
indicator regime", whereas paper V226 main.tex line 2005-2007 quotes
3.6 x 10^-15.  This script provides a single deterministic Dynamic
Programming computation under an explicit "random H" operational
definition, with several alternative op-defs reported side-by-side so
that the seven-orders-of-magnitude gap between paper and audit is fully
disclosed and reproducible.

Conclusion (paper v1.4 wording):
  The Poisson-binomial false-positive probability under H ~ Uniform{2..8}
  with regime-matched branch is P(X >= 17) approx 2.3 x 10^-8.  Substantive
  non-randomness survives (5-7 sigma deviation, well below 10^-7); the
  prior quotation 3.6 x 10^-15 is downgraded to the present, op-def-
  explicit value.

Op-defs explored
----------------
  (A) H ~ Uniform{2..8}, branch = regime-matched (+ for super, - for sub,
      balanced pred=1 for linear).
  (B) H ~ Uniform{2..8}, branch ~ Uniform{+, -} independently of regime
      (more permissive random ladder).
  (C) H ~ Uniform{1..8}, branch matched (extends down to H=1 -> beta=1.910).

(A) is the headline op-def adopted for paper v1.4 main text.

Author : Paper 4 (S. Kato)
Version: v1.4 (2026-05-17, paper4b_1)
"""

from __future__ import annotations

import math


# ---------- Kato analytical ladder ----------
def eps(H: float) -> float:
    return 1.0 / (H * math.log(2.0 * H + 1.0))


def beta_plus(H: float) -> float:
    return 1.0 + eps(H)


def beta_minus(H: float) -> float:
    return 1.0 - eps(H)


# ---------- 22-indicator panel : (name, regime, ci_low, ci_high) ----------
# Regime in {"super", "linear", "sub"}.  CI bounds from V226 SI Primary
# Panel Table (or SI Stage 4 row-supplements for Tier B rows).
PANEL = [
    # name, regime, ci_low, ci_high
    ("Length of road network",          "sub",    0.74, 0.92),
    ("Length of electrical cable",      "sub",    0.82, 0.92),
    ("Establishments",                  "linear", 0.99, 1.01),    # residual: assume narrow CI
    ("Housing units",                   "linear", 0.99, 1.01),
    ("Households (proxy)",              "linear", 0.99, 1.01),
    ("Household water",                 "linear", 0.89, 1.11),
    ("Employment",                      "linear", 0.99, 1.02),
    ("Total electrical consumption",    "super",  1.03, 1.11),
    ("Bank deposits",                   "super",  1.03, 1.11),
    ("Total wages",                     "super",  1.09, 1.13),
    ("Supercreative employment",        "super",  1.11, 1.18),
    ("GDP (US, OECD)",                  "super",  1.13, 1.26),
    ("GDP (US 1969-2003)",              "super",  1.09, 1.11),    # narrow MSA CI
    ("R&D employment",                  "super",  1.26, 1.34),
    ("Crime indices (proxy)",           "super",  1.18, 1.29),    # proxy target = AIDS
    ("Ph.D. holders (proxy)",           "super",  1.11, 1.18),    # proxy target = Supercreative
    ("Patents (USPTO-CBSA 2010)",       "super",  1.198, 1.398),
    ("Gasoline sales",                  "sub",    0.73, 0.80),
    ("Gasoline stations",               "sub",    0.74, 0.81),
    ("Disease (AIDS, etc.)",            "super",  1.18, 1.29),
    ("Inventors",                       "super",  1.18, 1.32),
    ("Patents (US, Bettencourt legacy)","super",  1.25, 1.29),
]


def candidate_betas(regime: str, H_range, op: str) -> list[float]:
    """Return the candidate beta values a random ladder pick can take for one row."""
    out = []
    if op == "A":
        # branch matched to regime
        if regime == "super":
            out = [beta_plus(H) for H in H_range]
        elif regime == "sub":
            out = [beta_minus(H) for H in H_range]
        else:  # linear -> Path 1 balanced pred = 1 always
            out = [1.0 for _ in H_range]
    elif op == "B":
        # branch uniform {+, -} regardless of regime
        out = [beta_plus(H) for H in H_range] + [beta_minus(H) for H in H_range]
    elif op == "C":
        # H uniform {1..8}, branch matched (alias for A but wider H range)
        if regime == "super":
            out = [beta_plus(H) for H in H_range]
        elif regime == "sub":
            out = [beta_minus(H) for H in H_range]
        else:
            out = [1.0 for _ in H_range]
    else:
        raise ValueError(f"unknown op-def: {op}")
    return out


def p_hit(regime: str, ci_low: float, ci_high: float, H_range, op: str) -> float:
    """Probability that a random ladder pick lands within the published CI."""
    cands = candidate_betas(regime, H_range, op)
    if not cands:
        return 0.0
    n_hit = sum(1 for b in cands if ci_low <= b <= ci_high)
    return n_hit / len(cands)


def poisson_binomial_cdf(ps: list[float]) -> list[float]:
    """Return prob[k] = P(X = k) via DP, where X = sum of independent Bernoulli(p_i)."""
    n = len(ps)
    prob = [0.0] * (n + 1)
    prob[0] = 1.0
    for p in ps:
        new = [0.0] * (n + 1)
        for k in range(n + 1):
            if prob[k] == 0.0:
                continue
            new[k] += prob[k] * (1.0 - p)
            if k + 1 <= n:
                new[k + 1] += prob[k] * p
        prob = new
    return prob


def report(op: str, H_range) -> None:
    print()
    print("=" * 78)
    print(f"  Op-def {op}   H_range = {list(H_range)}")
    print("=" * 78)
    ps = []
    for name, regime, lo, hi in PANEL:
        p = p_hit(regime, lo, hi, H_range, op)
        ps.append(p)
        print(f"  {name:<38}  regime={regime:<6}  CI=[{lo:.3f},{hi:.3f}]  p_i={p:.4f}")
    expected = sum(ps)
    var = sum(p * (1 - p) for p in ps)
    sd = math.sqrt(var)
    prob = poisson_binomial_cdf(ps)
    cum = [0.0] * (len(prob) + 1)
    for k in range(len(prob) - 1, -1, -1):
        cum[k] = cum[k + 1] + prob[k]
    print()
    print(f"  E[X]  = {expected:.3f}    SD = {sd:.3f}    (n = {len(ps)})")
    for k in (12, 14, 17, 19, 22):
        if k <= len(prob) - 1:
            sigma = (k - expected) / sd if sd > 0 else float("inf")
            print(f"  P(X >= {k:>2}) = {cum[k]:.3e}    (z = {sigma:+.2f})")


def main() -> None:
    print("Paper 4 v1.4 reproducible Poisson-binomial null calculation")
    print("(fix 3 of 6 v1.4 integrity package)")
    print()
    print(f"Panel size n = {len(PANEL)}")
    print(f"Headline op-def : (A) H ~ Uniform{{2..8}}, branch matched to regime.")

    report("A", range(2, 9))   # headline
    report("B", range(2, 9))   # alternative : both branches
    report("C", range(1, 9))   # alternative : H from 1


if __name__ == "__main__":
    main()
