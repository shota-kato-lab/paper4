#!/usr/bin/env python3
"""
sim_paper4_22_22_full_impl_v3.py — adaptive K=2 mixture (urban H_obs domain)

Author directive (2026-05-10) verbatim:
  「3 混合はノイズに埋もれるから上位 2 の H_obs 混合仮定でかなり説明できて、
   むしろ H_obs ３つ混合 (3 次元を 2 次元切断) もうまくいったけどそれ以上が難しかった」

→ adaptive K=2 (each valley indicator's best 2 H_obs pair) + K=3 (H=1, 2, 3) fallback

Stages:
  1. Strict integer single label H ∈ {1, 2, 3}
  2. Adaptive K=2 mixture: try (H_a, H_b) ∈ {(1,2), (1,3), (2,3)} for each valley
  3. K=3 (H=1, H=2, H=3) fallback for residual unresolved
"""

import numpy as np
import pandas as pd
from itertools import combinations

bettencourt_data = [
    ("New patents (USPTO 2001)", 1.27, 1.20, 1.34, "super"),
    ("Inventors", 1.25, 1.18, 1.32, "super"),
    ("Private R&D employment", 1.34, 1.27, 1.41, "super"),
    ("R&D establishments", 1.19, 1.13, 1.25, "super"),
    ("R&D employment", 1.26, 1.18, 1.34, "super"),
    ("Creative professionals", 1.15, 1.10, 1.20, "super"),
    ("Total wages", 1.12, 1.08, 1.16, "super"),
    ("Total bank deposits", 1.08, 1.04, 1.12, "super"),
    ("GDP (MSA)", 1.13, 1.09, 1.17, "super"),
    ("Total electrical consumption", 1.07, 1.03, 1.11, "super"),
    ("Construction costs", 1.13, 1.09, 1.17, "super"),
    ("Walking speed", 1.09, 1.05, 1.13, "super"),
    ("Serious crimes", 1.16, 1.11, 1.21, "super"),
    ("Total housing", 1.00, 0.97, 1.03, "linear"),
    ("Total employment", 1.01, 0.99, 1.03, "linear"),
    ("Household electrical consumption", 1.00, 0.94, 1.06, "linear"),
    ("Household water consumption", 1.01, 0.89, 1.13, "linear"),
    ("Household gas consumption", 1.05, 0.96, 1.14, "linear"),
    ("Gas stations", 0.77, 0.74, 0.81, "sub"),
    ("Gasoline sales", 0.79, 0.73, 0.85, "sub"),
    ("Length of electrical cables", 0.87, 0.82, 0.92, "sub"),
    ("Road surface", 0.83, 0.74, 0.92, "sub"),
]

df = pd.DataFrame(bettencourt_data, columns=["indicator", "beta", "ci_low", "ci_high", "regime"])

beta_plus = {1: 1.000, 2: 1.311, 3: 1.171}
beta_minus = {2: 0.770, 3: 0.857}  # for sublinear

# Stage 1: strict integer single
def stage1_assign(beta, ci_low, ci_high, regime):
    if regime == "linear":
        cands = [(1, beta_plus[1])]
    elif regime == "super":
        cands = [(2, beta_plus[2]), (3, beta_plus[3])]
    else:  # sub
        cands = [(2, beta_minus[2]), (3, beta_minus[3])]
    matches = [(H, bp) for H, bp in cands if ci_low <= bp <= ci_high]
    return matches

# Stage 2: K=2 mixture H_a/H_b
def stage2_k2(beta, ci_low, ci_high, beta_dict):
    """Try all (H_a, H_b) pairs, return one with valid pi in [0,1] and pred in CI."""
    Hs = list(beta_dict.keys())
    for H_a, H_b in combinations(Hs, 2):
        bp_a, bp_b = beta_dict[H_a], beta_dict[H_b]
        if bp_a == bp_b:
            continue
        # Solve pi * bp_a + (1-pi) * bp_b = beta
        pi = (beta - bp_b) / (bp_a - bp_b)
        if 0 <= pi <= 1:
            pred = pi * bp_a + (1-pi) * bp_b
            if ci_low <= pred <= ci_high:
                return (H_a, H_b, pi, pred)
    return None

# Stage 3: K=3 mixture (H=1, 2, 3) for super regime - max-entropy fit
def stage3_k3(beta, ci_low, ci_high, beta_dict):
    """K=3 mixture: pi_1 * b_1 + pi_2 * b_2 + pi_3 * b_3 = beta, pi_i >= 0, Sum pi_i = 1.
    For this problem any beta in convex hull [min(b), max(b)] is achievable
    with non-negative weights; we use max-entropy regularization for a deterministic pick."""
    if 1 not in beta_dict or 2 not in beta_dict or 3 not in beta_dict:
        return None
    b1, b2, b3 = beta_dict[1], beta_dict[2], beta_dict[3]
    if min(b1, b2, b3) <= beta <= max(b1, b2, b3):
        from scipy.optimize import minimize
        def obj(p):
            return -np.sum(p * np.log(p + 1e-12))  # max entropy
        def constr_sum(p):
            return p[0] + p[1] + p[2] - 1
        def constr_beta(p):
            return p[0] * b1 + p[1] * b2 + p[2] * b3 - beta
        cons = [
            {"type": "eq", "fun": constr_sum},
            {"type": "eq", "fun": constr_beta},
        ]
        bounds = [(0, 1)] * 3
        x0 = np.array([1/3, 1/3, 1/3])
        res = minimize(obj, x0, method='SLSQP', bounds=bounds, constraints=cons)
        if res.success:
            pi_1, pi_2, pi_3 = res.x
            pred = pi_1 * b1 + pi_2 * b2 + pi_3 * b3
            if ci_low <= pred <= ci_high:
                return (pi_1, pi_2, pi_3, pred)
    return None

# Run all stages
combined = []
n_s1, n_s2, n_s3, n_unres = 0, 0, 0, 0
for _, row in df.iterrows():
    s1 = stage1_assign(row["beta"], row["ci_low"], row["ci_high"], row["regime"])
    if s1:
        best = min(s1, key=lambda x: abs(x[1] - row["beta"]))
        n_s1 += 1
        combined.append({
            "indicator": row["indicator"], "beta_obs": row["beta"],
            "regime": row["regime"], "stage": 1,
            "assignment": f"strict integer H={best[0]}",
            "predicted": best[1],
        })
        continue
    # Stage 2: K=2 mixture
    if row["regime"] == "super":
        bd = {1: beta_plus[1], 2: beta_plus[2], 3: beta_plus[3]}
    elif row["regime"] == "sub":
        bd = {2: beta_minus[2], 3: beta_minus[3]}
    else:  # linear
        bd = {1: beta_plus[1]}
    s2 = stage2_k2(row["beta"], row["ci_low"], row["ci_high"], bd)
    if s2:
        H_a, H_b, pi, pred = s2
        n_s2 += 1
        combined.append({
            "indicator": row["indicator"], "beta_obs": row["beta"],
            "regime": row["regime"], "stage": 2,
            "assignment": f"K=2 mixture H_a={H_a},H_b={H_b}, pi_a={pi:.3f}",
            "predicted": pred,
        })
        continue
    # Stage 3: K=3 (H=1, 2, 3) for super regime
    if row["regime"] == "super":
        s3 = stage3_k3(row["beta"], row["ci_low"], row["ci_high"], beta_plus)
        if s3:
            pi_1, pi_2, pi_3, pred = s3
            n_s3 += 1
            combined.append({
                "indicator": row["indicator"], "beta_obs": row["beta"],
                "regime": row["regime"], "stage": 3,
                "assignment": f"K=3 mixture pi_1={pi_1:.3f},pi_2={pi_2:.3f},pi_3={pi_3:.3f}",
                "predicted": pred,
            })
            continue
    n_unres += 1
    combined.append({
        "indicator": row["indicator"], "beta_obs": row["beta"],
        "regime": row["regime"], "stage": 0,
        "assignment": "UNRESOLVED",
        "predicted": np.nan,
    })

cdf = pd.DataFrame(combined)
print(f"=== Paper 4 V204 22/22 Closure Protocol Full Implementation (urban H_obs in {{1,2,3}}) ===")
print(f"\nStage 1 (strict integer single label): {n_s1}/22 = {100*n_s1/22:.1f}%")
print(f"  Manuscript anchor: 17/22 (Super 10/13, Linear 5/5, Sub 2/4)")
print(f"Stage 2 (adaptive K=2 mixture, best H_a/H_b pair):  {n_s2}/22")
print(f"Stage 3 (K=3 mixture, max-entropy fit, super only): {n_s3}/22")
print(f"Unresolved: {n_unres}/22")
print(f"\nTOTAL CLOSURE: {n_s1+n_s2+n_s3}/22 = {100*(n_s1+n_s2+n_s3)/22:.1f}%")

print(f"\n=== FULL ASSIGNMENT TABLE ===")
print(cdf[["indicator", "beta_obs", "regime", "stage", "assignment", "predicted"]].to_string(index=False))

# Save next to script
import os
out_csv = os.path.join(os.path.dirname(os.path.abspath(__file__)), "paper4_22_22_full_impl_results.csv")
cdf.to_csv(out_csv, index=False)
print(f"\nResults saved: {out_csv}")
