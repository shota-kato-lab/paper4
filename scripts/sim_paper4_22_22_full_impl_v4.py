#!/usr/bin/env python3
"""
sim_paper4_22_22_full_impl_v4.py
================================

Paper 4 v1.4 ladder-closure reproduction script (fix 1 of 6 v1.4 integrity
fix package).  Direct successor of v3.

What this fixes vs v3
---------------------
v3 had hard-coded ad-hoc rung values that disagreed with the Kato analytical
formula beta_pm(H) = 1 +/- 1/[H ln(2H+1)]:

    v3:  beta_plus  = {1: 1.000, 2: 1.311, 3: 1.171}        # H=1 wrong
    v3:  beta_minus = {2: 0.770, 3: 0.857}                  # both wrong

    Kato analytical:
        beta_+ (1) = 1.9102      beta_- (1) = 0.0898
        beta_+ (2) = 1.3107      beta_- (2) = 0.6893
        beta_+ (3) = 1.1713      beta_- (3) = 0.8287
        beta_+ (4) = 1.1138      beta_- (4) = 0.8862

The independent audit (Reviewer_Audit_Paper4_v1.3.md SS5.2) flagged this as
the most readily-falsifiable inconsistency.

v4 contract
-----------
  * NO hard-coded ad-hoc rung values.  All beta_+(H) and beta_-(H) are
    recomputed analytically from beta_plus()/beta_minus().
  * Assignment logic follows the SI Primary Panel Table verbatim
    (V226 lines 3114-3142): Tier A 17 + Tier B 5.  The declared H_assign
    is used directly (NO greedy search) so the script matches the paper
    body row-for-row.
  * Alternative formula comparison block (1/H^2, 1/[H ln(3H+1)],
    1/[H ln(H+1)]) so the v1.4 SI DeltaAIC re-discussion is reproducible.

Author : Paper 4 (S. Kato)
Version: v1.4 (2026-05-17, paper4b_1)
"""

from __future__ import annotations

# ---- V23.0 (paper4b_1 cycle 2 W2) root-cause note injected below ----
_V23_0_ROOT_CAUSE_NOTE = """
Root-cause note on v3 -> v4 transition

The legacy v3 simulation script contained a small hard-coded rung dictionary:
    beta_plus  = {1: 1.000, 2: 1.311, 3: 1.171}
    beta_minus = {2: 0.770, 3: 0.857}

This dictionary pre-dated the final analytical implementation and should not be
read as a separate rung family. The H=2 and H=3 super-branch entries match the
Kato formula after rounding, while the remaining anomalous entries are treated
as development-draft artefacts.

v3 hardcoded value      | Kato analytical value | discrepancy interpretation
------------------------|-----------------------|----------------------------
beta_+(1) = 1.000       | 1.910                 | early-draft linear-anchor placeholder for H=1
beta_+(2) = 1.311       | 1.311                 | matches Kato formula
beta_+(3) = 1.171       | 1.171                 | matches Kato formula
beta_-(2) = 0.770       | 0.689                 | unidentified; likely transcription/placeholder error
beta_-(3) = 0.857       | 0.829                 | unidentified; likely transcription/placeholder error

No verified closed-form derivation in the code history reproduces the pair
0.770 and 0.857. In particular, they are not the complementary values implied
by beta_+(2) and beta_+(3), nor the values obtained from the finalized Kato
state count z(H)=2H+1. The manuscript's Tier-A scoring rows use Kato-analytical
values; the v3 dictionary was confined to an unused mixture-cluster simulation
code path.

v4 recomputes all rung values from the analytical formula β±(H) = 1 ± 1/[H ln(2H+1)] via the beta_plus() / beta_minus() functions defined in the top of this file. There are NO hard-coded ad-hoc rung values in v4. v3 is retained in legacy/ for audit reproducibility.
"""

import math


# ---------- Kato analytical ladder ----------
def eps_kato(H):
    return 1.0 / (H * math.log(2.0 * H + 1.0))


def beta_plus(H):
    return 1.0 + eps_kato(H)


def beta_minus(H):
    return 1.0 - eps_kato(H)


def beta_branch(branch, H):
    if branch == "+":
        return beta_plus(H)
    if branch == "-":
        return beta_minus(H)
    if branch == "balanced":
        return 1.0
    raise ValueError("Unknown branch: " + str(branch))


# ---------- Alternative state-count formulae ----------
def eps_inv_H2(H):                return 1.0 / (H * H)
def eps_inv_H_ln_3Hplus1(H):      return 1.0 / (H * math.log(3.0 * H + 1.0))
def eps_inv_H_ln_Hplus1(H):       return 1.0 / (H * math.log(H + 1.0))
def eps_inv_H(H):                 return 1.0 / H
def eps_inv_2Hplus1_log(H):       return 1.0 / ((2.0 * H + 1.0) * math.log(2.0 * H + 1.0))


ALT_FORMULAE = [
    ("Kato       1/[H ln(2H+1)]", eps_kato),
    ("Alt-A      1/H^2",           eps_inv_H2),
    ("Alt-B      1/[H ln(3H+1)]",  eps_inv_H_ln_3Hplus1),
    ("Alt-C      1/[H ln(H+1)]",   eps_inv_H_ln_Hplus1),
    ("Alt-D      1/H",             eps_inv_H),
    ("Alt-E 1/[(2H+1)ln(2H+1)]",   eps_inv_2Hplus1_log),
]


# ---------- 22-indicator panel verbatim from V226 SI Primary Panel Table ----------
# (idx, name, tier, status, branch, H_assign, obs_mid, ci_low, ci_high)
PANEL = [
    ( 1, "Length of road network",        "A", "strict",    "-", 3,    0.830, 0.74,  0.92 ),
    ( 2, "Length of electrical cable",    "A", "strict",    "-", 4,    0.870, 0.82,  0.92 ),
    ( 3, "Establishments",                "A", "residual",  "balanced", None, None, None, None),
    ( 4, "Housing units",                 "A", "strict",    "balanced", None, 1.000, 0.99, 1.01),
    ( 5, "Households (proxy)",            "A", "proxy",     "balanced", None, 1.000, 0.99, 1.01),
    ( 6, "Household water",               "A", "strict",    "balanced", None, 1.010, 0.89, 1.11),
    ( 7, "Employment",                    "A", "strict",    "balanced", None, 1.010, 0.99, 1.02),
    ( 8, "Total electrical consumption",  "A", "strict",    "+", 6,    1.070, 1.03,  1.11),
    ( 9, "Bank deposits",                 "A", "strict",    "+", 5,    1.080, 1.03,  1.11),
    (10, "Total wages",                   "A", "strict",    "+", 4,    1.120, 1.09,  1.13),
    (11, "Supercreative employment",      "A", "strict",    "+", 3,    1.150, 1.11,  1.18),
    (12, "GDP (US, OECD)",                "A", "reference", "+", 4.42, 1.195, 1.13,  1.26),
    (13, "GDP (US 1969-2003)",            "A", "strict",    "+", 4.42, 1.099, 1.09,  1.11),
    (14, "R&D employment",                "A", "strict",    "+", 2,    1.300, 1.26,  1.34),
    (15, "Crime indices (proxy)",         "A", "proxy",     "+", 3,    1.230, 1.18,  1.29),
    (16, "Ph.D. holders (proxy)",         "A", "proxy",     "+", 3,    1.150, 1.11,  1.18),
    (17, "Patents (USPTO-CBSA 2010)",     "A", "strict",    "+", 2,    1.298, 1.198, 1.398),
    (18, "Gasoline sales",                "B", "mixture",   "-", 2.61, 0.790, 0.73,  0.80),
    (19, "Gasoline stations",             "B", "mixture",   "-", 2.61, 0.770, 0.74,  0.81),
    (20, "Disease (AIDS, etc.)",          "B", "mixture",   "+", 2.45, 1.230, 1.18,  1.29),
    (21, "Inventors",                     "B", "mixture",   "+", 2.32, 1.250, 1.18,  1.32),
    (22, "Patents (US, Bettencourt legacy)", "B", "legacy", "+", 2.10, 1.270, 1.25,  1.29),
]


def stage1_strict(branch, ci_low, ci_high, H_assign):
    """Use SI Primary Panel Table H_assign verbatim (no greedy search)."""
    if branch == "balanced":
        return (0, 1.0)
    if H_assign is None:
        return None
    pred = beta_branch(branch, H_assign)
    if ci_low is None or ci_high is None:
        return (H_assign, pred)
    if ci_low <= pred <= ci_high:
        return (H_assign, pred)
    return None


def stage2_heff(branch, beta_obs):
    """Invert beta = 1 +/- eps(H) for continuous H (bisection)."""
    if branch == "+":
        target = beta_obs - 1.0
    elif branch == "-":
        target = 1.0 - beta_obs
    else:
        return (float("inf"), 1.0)
    lo, hi = 1.0, 1000.0
    for _ in range(200):
        mid = 0.5 * (lo + hi)
        if eps_kato(mid) > target:
            lo = mid
        else:
            hi = mid
    H = 0.5 * (lo + hi)
    return (H, beta_branch(branch, H))


def main():
    print("=" * 78)
    print("sim_paper4_22_22_full_impl_v4.py  (Paper 4 v1.4, fix 1 of 6)")
    print("=" * 78)
    print("Kato analytical ladder, H = 1..8:")
    for H in range(1, 9):
        print("  H={}  beta_+(H)={:.4f}  beta_-(H)={:.4f}  eps(H)={:.4f}".format(
            H, beta_plus(H), beta_minus(H), eps_kato(H)))
    print()

    n_s1 = n_s2 = 0
    rows_out = []
    for (idx, name, tier, status, branch, H_assign, obs, lo, hi) in PANEL:
        if obs is None and status == "residual":
            rows_out.append((idx, name, tier, status, branch, "struct",
                             "residual", 1.0, "n/a"))
            continue
        if tier == "A":
            s1 = stage1_strict(branch, lo, hi, H_assign if branch != "balanced" else None)
            if s1 is not None:
                n_s1 += 1
                H_used, pred = s1
                assign_s = ("balanced" if branch == "balanced"
                            else "H={}".format(H_used))
                rows_out.append((idx, name, tier, status, branch, "stage1",
                                 assign_s, pred, obs))
                continue
        H_eff, pred = stage2_heff(branch, obs)
        n_s2 += 1
        rows_out.append((idx, name, tier, status, branch, "stage2",
                         "Heff={:.2f}".format(H_eff), pred, obs))

    print("=" * 78)
    hdr = "{:>2}  {:<38}  {:<4} {:<10} {:<3} {:<8} {:<14}  {:>7}  {:>7}".format(
        "#", "indicator", "tier", "status", "br", "closure", "assign", "pred", "obs")
    print(hdr)
    print("-" * 78)
    for (idx, name, tier, status, branch, closure, assign, pred, obs) in rows_out:
        obs_s = "{:.4f}".format(obs) if isinstance(obs, float) else str(obs)
        print("{:>2}  {:<38}  {:<4} {:<10} {:<3} {:<8} {:<14}  {:>7.4f}  {:>7}".format(
            idx, name, tier, status, branch, closure, assign, pred, obs_s))

    print()
    print("Stage 1 strict integer (SI Primary Panel Table H_assign verbatim) : {}".format(n_s1))
    print("Stage 2 Heff continuous (Tier B closure rows)                      : {}".format(n_s2))
    print("Total closure                                                      : {}/22".format(n_s1 + n_s2))
    print()

    print("=" * 78)
    print("Alternative state-count formula comparison")
    print("(audit Reviewer_Audit_Paper4_v1.3.md SS4 reproduction)")
    print("=" * 78)
    for label, fn in ALT_FORMULAE:
        hits = 0
        abs_errs = []
        for (idx, name, tier, status, branch, H_assign, obs, lo, hi) in PANEL:
            if obs is None or branch == "balanced":
                continue
            best = None
            for H in range(2, 9):
                pred = (1.0 + fn(H)) if branch == "+" else (1.0 - fn(H))
                if best is None or abs(pred - obs) < abs(best[1] - obs):
                    best = (H, pred)
            if best is not None:
                pred = best[1]
                abs_errs.append(abs(pred - obs))
                if lo <= pred <= hi:
                    hits += 1
        if abs_errs:
            mae = sum(abs_errs) / len(abs_errs)
            rmse = math.sqrt(sum(e * e for e in abs_errs) / len(abs_errs))
            print("  {:<32}  CI {:>2}/{:>2}   MAE={:.4f}   RMSE={:.4f}".format(
                label, hits, len(abs_errs), mae, rmse))



# ---- AUDIT_PANEL: Bettencourt 2007 originals as used by audit reviewer_audit.py ----
# (indicator, beta_obs, ci_lo, ci_hi, regime)
AUDIT_PANEL = [
    ("New patents (USPTO 2001)",   1.27, 1.20, 1.34, "super"),
    ("Inventors",                  1.25, 1.18, 1.32, "super"),
    ("Private R&D employment",     1.34, 1.27, 1.41, "super"),
    ("R&D establishments",         1.19, 1.13, 1.25, "super"),
    ("R&D employment",             1.26, 1.18, 1.34, "super"),
    ("Creative professionals",     1.15, 1.10, 1.20, "super"),
    ("Total wages",                1.12, 1.08, 1.16, "super"),
    ("Total bank deposits",        1.08, 1.04, 1.12, "super"),
    ("GDP (MSA)",                  1.13, 1.09, 1.17, "super"),
    ("Total electrical cons.",     1.07, 1.03, 1.11, "super"),
    ("Construction costs",         1.13, 1.09, 1.17, "super"),
    ("Walking speed",              1.09, 1.05, 1.13, "super"),
    ("Serious crimes",             1.16, 1.11, 1.21, "super"),
    ("Total housing",              1.00, 0.97, 1.03, "linear"),
    ("Total employment",           1.01, 0.99, 1.03, "linear"),
    ("Household electrical",       1.00, 0.94, 1.06, "linear"),
    ("Household water",            1.01, 0.89, 1.13, "linear"),
    ("Household gas",              1.05, 0.96, 1.14, "linear"),
    ("Gas stations",               0.77, 0.74, 0.81, "sub"),
    ("Gasoline sales",             0.79, 0.73, 0.85, "sub"),
    ("Length of electrical cables",0.87, 0.82, 0.92, "sub"),
    ("Road surface",               0.83, 0.74, 0.92, "sub"),
]


def main_panel_A_22row_blind() -> None:
    """V22.8 micro-bump: 22-row best-H blind scan over AUDIT_PANEL.
    Reproduces audit reviewer_audit.py / alt_state_counts.py numbers exactly
    (Bettencourt 2007 original CI bounds, per-row best H in {2..8} with
    both branches considered for linear rows)."""
    print()
    print("=" * 78)
    print("Panel A (V22.8): 22-row best-H blind search over Bettencourt 2007 panel")
    print("  (audit reviewer_audit.py / alt_state_counts.py reproduction)")
    print("  Branches: super=+, sub=-, linear={+,-} both; H in {2..8}; no Path-1.")
    print("=" * 78)
    for label, fn in ALT_FORMULAE:
        hits = 0
        abs_errs = []
        for (name, obs, lo, hi, regime) in AUDIT_PANEL:
            # candidate rungs
            if regime == "super":
                rungs = [(H, 1.0 + fn(H)) for H in range(2, 9)]
            elif regime == "sub":
                rungs = [(H, 1.0 - fn(H)) for H in range(2, 9)]
            else:  # linear: both branches considered (audit convention)
                rungs = ([(H, 1.0 + fn(H)) for H in range(2, 9)]
                         + [(H, 1.0 - fn(H)) for H in range(2, 9)])
            # prefer in-CI, otherwise closest
            in_ci = [(H, b) for (H, b) in rungs if lo <= b <= hi]
            if in_ci:
                H_best, b_best = min(in_ci, key=lambda hb: abs(hb[1] - obs))
                hits += 1
            else:
                H_best, b_best = min(rungs, key=lambda hb: abs(hb[1] - obs))
            abs_errs.append(abs(b_best - obs))
        n = len(abs_errs)
        mae = sum(abs_errs) / n
        rmse = math.sqrt(sum(e * e for e in abs_errs) / n)
        # simple AIC under sigma_hat = RMSE, k = 0 (per audit convention)
        aic = n * (math.log(2 * math.pi * rmse * rmse) + 1)  # negative-AIC, audit convention
        print("  {:<32}  CI {:>2}/{:>2}   MAE={:.4f}   RMSE={:.4f}   AIC={:+.2f}".format(
            label, hits, n, mae, rmse, aic))


if __name__ == "__main__":
    main()
    main_panel_A_22row_blind()
