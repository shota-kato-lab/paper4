# Paper 4 v1.4 (V290) Reproducibility Bundle Manifest

Build date: 2026-05-26
Manuscript: V290 (91 pages, 2.22 MB PDF)
Zenodo concept: 10.5281/zenodo.20234326 (v1.3 -> v1.4)
GitHub: shota-kato-lab/kato-equation-paper4 (tag v1.4)

## Bundle contents

### Core deliverables

- `main.tex` -- V290 LaTeX source (446 KB, ~4000 lines)
- `main.pdf` -- V290 compiled PDF (91 pages, 2.22 MB)
- `paper4_V30_refs.bib` / `refs.bib` -- BibTeX references (V30: V29 + Bettencourt 2013 / 2020 / 2021)
- `significance.tex` -- 150-word significance statement
- `submission/cover_letter.tex` -- Cover letter

### Figures (`figures/` + root)

- `paper4_fig_main.png` -- Figure 1: Bettencourt 22-indicator closure forest plot
- `fig_2_epsilon_curve.pdf` -- Figure 2: The Relay-Depth Correction Function epsilon(H)

### Reproducibility scripts (`scripts/`)

- `sim_paper4_22_22_full_impl_v4.py` -- Kato analytical beta_pm(H) ladder closure + Panel-A 22-row blind scan + alternative-formula transparency
- `poisson_binomial_random_H.py` -- Poisson-binomial DP under 3 op-defs (= P < 10^-7 structural threshold for 17-row Tier-A-full count)
- `paper4_mae_rmse_canonical.py` -- Three-tier MAE/RMSE consolidation (direct-strict 12-row 0.008 / Tier-A-full 16-row 0.017 / all-22 disclosed 0.015)
- `paper4_numerical_verify.py` -- Independent verification of integer-rung values and MAE/RMSE (third-party audit replication)
- `paper4_22_22_full_impl_results.csv` -- Pre-computed numerical output for offline review
- `requirements.txt` -- Python dependencies

### Companion webapps (`tools/`)

- `tools/paper4/4/` -- universal beta predictor single-mode legacy (live URL: https://aiandfuture.co.jp/tool/4/)
- `tools/paper4/5/` -- universal beta predictor two-mode primary (Network input + (N, value) panel input; live URL: https://aiandfuture.co.jp/tool/5/)
- `tools/paper4/8/` -- interactive simulator with live in-browser cluster analysis (USPTO 2010, real coordination-network data; live URL: https://aiandfuture.co.jp/tool/8/)

### Historical reproducibility audit trail (`legacy/`)

- `sim_paper4_22_22_full_impl_v3.py` -- v1.3 release script (ad-hoc rung values); retained for v1.3 -> v1.4 audit traceability per KNOWN_ISSUES.md

### Self-disclosure + documentation

- `README.md` -- repository contents + headline result + v1.3 -> v1.4 release narrative
- `MANIFEST.md` -- this file
- `KNOWN_ISSUES.md` -- v1.3 errata disclosure + v1.4 integration note

## Reproducibility status

- All five SI integrity-fix sections present in main.tex (S-PanelOrigins, S-CrossTimeBeta, S-poisson-op-def, S-epsilon-alternative-rejection, S-axiom-minimality, S-Heff-sensitivity-coordinate, S-data-availability-disclosure, S-path1-microfoundation, S-implementation-notes)
- 3 reproducibility scripts (sim_v4 + poisson_binomial_random_H + paper4_mae_rmse_canonical) cover all numerical claims in main + SI
- meta-disclosure 11 banned pattern body-only: paper4_16 audit V8+ verified per V231 -> V241 -> V276 -> V290 cleanup chain
- page 1 single-page convergence: V290 maintains the V264 baseline structure

## Verification target

- (a) All numerical claims in main + SI tables reproducible from scripts/
- (b) Three-tier 22/22 closure: 12 direct strict + 5 indirect (proxy/residual/reference) + 5 continuous-H_eff Tier B mixing-coordinate (= explicit DOF accounting)
- (c) Three-tier MAE: direct-strict 12-row 0.008 / Tier-A-full 16-row 0.017 / all-22 disclosed 0.015
- (d) Random-H Poisson P < 10^-7 for 17-row Tier-A-full count under 3 explicit op-defs
- (e) Axiom A1-A4 -> z(H) = 2H+1 derivation (5 Lemma chain in SI S-axiom-minimality)
- (f) SI S-path1-microfoundation: 5 indicator microfoundation + sigma_gc = 0 <=> beta = 1 falsifier + Paper 3 H_obs bridge
- (g) Phase B USPTO 2010 graph-derived: K = 2 detection (Q_{K=2} >= 0.20), pi_low = 0.943, pi_up = 0.057, beta_pred = 1.298 ≈ beta_obs 1.298 (|Delta| < 0.001)

## v1.3 -> v1.4 transition note

v1.3 (V22.6, 2026-05-16) was the first manuscript sent to Prof. Luis M. A. Bettencourt; the same PDF (md5 133702eca4f567635567a19312a1c538) is preserved at Zenodo record 10.5281/zenodo.20234326. After publication, a third-party reviewer-anticipation audit surfaced five integrity items that were disclosed in the GitHub-repo-level KNOWN_ISSUES.md file. v1.4 (V290, 2026-05-26) integrates those items into the paper main text and SI as a full revision; KNOWN_ISSUES.md is retained as a v1.4 integration note.
