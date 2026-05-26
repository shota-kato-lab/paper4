# Paper 4 â A Relay-Depth Exponent Ladder Closing the Bettencourt 22-Indicator Urban-Scaling Panel

> A Zero-Fitted-Exponent Complementary Closure with Integer, Continuous, and Hybrid Assignments

This repository accompanies the working paper **"A Relay-Depth Exponent Ladder Closing the Bettencourt 22-Indicator Urban-Scaling Panel â A Zero-Fitted-Exponent Complementary Closure with Integer, Continuous, and Hybrid Assignments"** (Paper 4 of the Kato Relay-Depth Working Paper Series).

## Headline result (v1.4)

Tested against Bettencourt et al. (PNAS 2007) canonical 22-indicator urban panel via a three-tier decomposition with zero fitted exponents:

- **12/22** direct strict-integer matches (Tier A scoring rows)
- **5/22** indirect single-H closures (proxy / residual / reference rows)
- **5/22** continuous H_eff Tier B rows (mixture closures: Gasoline sales / stations, AIDS, Inventors, Patents-legacy)
- Three-tier MAE: direct-strict 12-row **0.008**, Tier-A-full 16-row **0.017**, all-22 disclosed **0.015**
- Random-H ladder selection achieves the 17-row Tier-A-full count with probability **< 10**⁻⁷ across three operational definitions (SI §S-poisson-op-def)
- Pre-registered falsifiers: (i) direct-strict count ≤ 11/22, (ii) Path-1 bootstrap CI excludes β = 1 for any of the five near-linear indicators
- USPTO 2010 assignee-level co-inventorship Phase B verification (Stage A graph-derived K detection + (π_low, π_up) mixture weights): K = 2, π_low = 0.943, π_up = 0.057, β_pred = 1.298 against row-17 β_obs = 1.298 [1.198, 1.398] (|Δβ| < 0.001)

## Companion tools (live URLs)

- `tools/paper4/4/` ← <https://aiandfuture.co.jp/tool/4/> — universal β predictor (single-mode legacy, audit reproducibility reference)
- `tools/paper4/5/` ← <https://aiandfuture.co.jp/tool/5/> — universal β predictor (two-mode primary: Network input + (N, value) panel input)
- `tools/paper4/8/` ← <https://aiandfuture.co.jp/tool/8/> — interactive browser-based simulator presenting the 22-indicator Bettencourt panel as a clickable reference catalogue with live in-browser cluster analysis on real coordination-network data (USPTO 2010 assignee-level co-inventorship for the patents rows). The simulator implements the registered consistency rule and uses zero fitted exponents; it is offered as a reproducibility-and-demonstration instrument rather than as an external validator.



## Reproducibility quickstart (post-`git clone`)

After `git clone https://github.com/shota-kato-lab/kato-equation-paper4 && cd kato-equation-paper4`:

### (a) Numerical reproducibility (Python, fully offline)

```bash
pip install -r scripts/requirements.txt

# 22-row Kato ladder closure + alternative-formula transparency block + Panel-A blind scan
python scripts/sim_paper4_22_22_full_impl_v4.py

# Random-H Poisson-binomial DP under 3 operational definitions (P < 10^-7 threshold)
python scripts/poisson_binomial_random_H.py

# Three-tier MAE/RMSE consolidation (0.008 / 0.017 / 0.015)
python scripts/paper4_mae_rmse_canonical.py

# Independent third-party verification of integer-rung values
python scripts/paper4_numerical_verify.py
```

All numerical claims in the paper main text and SI are reproducible from these four scripts. No external data download is required (panel β_obs values are hardcoded per SI §S-PanelOrigins; future processed-data deposit is scheduled per SI §S-data-availability-disclosure).

### (b) Interactive simulator (browser, /tool/8/ equivalent)

The repository ships a byte-identical mirror of the production live webapps under `tools/`:

```bash
# Serve repo over local HTTP (= avoids browser file:// CORS restrictions for Pyodide)
python -m http.server 8000
# Then open in browser:
#   http://localhost:8000/tools/paper4/8/   ← interactive simulator + USPTO 2010 cluster analysis
#   http://localhost:8000/tools/paper4/5/   ← two-mode β predictor (primary)
#   http://localhost:8000/tools/paper4/4/   ← single-mode β predictor (legacy)
```

Each webapp uses Pyodide (Python in WebAssembly); an internet connection is required on first load to fetch Pyodide wheels (numpy / scipy / networkx / python-louvain) from the Pyodide CDN. Subsequent loads use the browser cache.

`tools/paper4/8/data/` contains the full USPTO 2010 assignee-level co-inventorship network (`uspto_assignee_2010.csv`, 3,951 assignees / 4,526 edges) plus three SNAP collaboration network reference files (`ca-CondMat.txt`, `ca-GrQc.txt`, `ca-HepTh.txt`) for additional cross-network validation. Loading the USPTO 2010 data in `tools/paper4/8/` reproduces, byte-identically with the production live deployment at <https://aiandfuture.co.jp/tool/8/>, the K = 2 detection (Q_{K=2} ≥ 0.20, independent of β_obs), graph-derived mixture weights π_low = 0.943, π_up = 0.057, yielding β_pred = 1.298 against row-17 β_obs = 1.298 [1.198, 1.398] (|Δβ| < 0.001).

### Live demos (no clone required)

For quick reference without cloning, the same webapps are publicly available at:

- <https://aiandfuture.co.jp/tool/4/> — single-mode β predictor (legacy reference)
- <https://aiandfuture.co.jp/tool/5/> — two-mode β predictor (primary)
- <https://aiandfuture.co.jp/tool/8/> — interactive simulator with USPTO 2010 cluster analysis

A GitHub Pages mirror (`https://shota-kato-lab.github.io/kato-equation-paper4/tools/paper4/8/` and analogous URLs for tool4 / tool5) may be enabled by the maintainer for stable independent hosting; see the maintainer note at the end of this README.

## Repository contents

| File / folder | Content |
|---|---|
| `main.tex` | Paper 4 manuscript V290 (single-file architecture; SI Appendices S-PanelOrigins, S-CrossTimeBeta, S-poisson-op-def, S-epsilon-alternative-rejection, S-axiom-minimality, S-Heff-sensitivity-coordinate, S-data-availability-disclosure, S-path1-microfoundation, S-implementation-notes included inline) |
| `main.pdf` | Compiled PDF (V290, 91 pages) |
| `paper4_V30_refs.bib` / `refs.bib` | BibTeX references (V30: V29 + Bettencourt 2013 / 2020 / 2021 entries; full citation chain) |
| `paper4_fig_main.png` | Figure 1: Bettencourt 22-indicator closure forest plot |
| `fig_2_epsilon_curve.pdf` | Figure 2: The Relay-Depth Correction Function ε(H) |
| `significance.tex` | 150-word significance statement |
| `submission/cover_letter.tex` | Cover letter |
| `figures/` | Source figures (PNG/PDF) |
| `scripts/` | Python reproducibility bundle (sim_v4 + Poisson-binomial DP + canonical MAE/RMSE + verify) |
| `tools/` | Browser-based companion webapps (tool4 / tool5 / tool8 live URLs above) |
| `data/` | Placeholder (panel β_obs values are reproducible from public sources per SI §S-data-availability-disclosure; a frozen CSV companion deposit is scheduled within 30 days of acceptance or arXiv release) |
| `legacy/` | Historical reproducibility audit trail (e.g., `sim_paper4_22_22_full_impl_v3.py` retained for v1.3 → v1.4 transparency per `KNOWN_ISSUES.md`) |
| `LICENSE` | CC-BY-4.0 (text and figures) |
| `LICENSE-CODE` | MIT (analysis / simulation code; mirrored as `scripts/LICENSE`) |
| `KNOWN_ISSUES.md` | v1.3 errata disclosure + v1.4 full-revision integration note |
| `MANIFEST.md` | v1.4 bundle manifest (contents + reproducibility status + verification target) |

## Reproducibility scripts (`scripts/`)

- `sim_paper4_22_22_full_impl_v4.py` — Kato analytical β±(H) ladder closure + alternative formula transparency block + Panel-A 22-row blind scan
- `poisson_binomial_random_H.py` — Poisson-binomial DP under three operational definitions (= P < 10⁻⁷ structural threshold for the 17-row Tier-A-full count)
- `paper4_mae_rmse_canonical.py` — Three-tier MAE/RMSE consolidation (direct-strict 12-row 0.008 / Tier-A-full 16-row 0.017 / all-22 disclosed 0.015)
- `paper4_numerical_verify.py` — Independent verification of β±(H) integer-rung values and MAE/RMSE (third-party audit replication)
- `paper4_22_22_full_impl_results.csv` — Pre-computed numerical output for offline review
- `requirements.txt` — Python dependencies (numpy, scipy, pandas, networkx, python-louvain)

## v1.3 → v1.4 release narrative

**v1.3** (manuscript V22.6, 2026-05-16, Bettencourt first-reply driven polish wave) was sent to Prof. Luis M. A. Bettencourt as the first revised manuscript. After publication, an independent reviewer-anticipation audit (third-party Claude session, 17.5 KB / 8 sections / 5 critical + 2 minor items) surfaced integrity concerns in five locations. The v1.3 release tag is kept as the historical first-disclosure state (PDF md5 `133702eca4f567635567a19312a1c538`); a separate `KNOWN_ISSUES.md` file documents the original five items for full audit traceability.

**v1.4** (manuscript V290, 2026-05-26) integrates the five integrity items into the paper and SI as a full revision rather than as a self-disclosure footnote:

- (1) Numerical conventions specified analytically in SI §S-implementation-notes (formerly §S-KNOWN-ISSUES-integrated; rewording per V241 neutral-framing pass)
- (2) Three-tier MAE/RMSE: 0.008 / 0.017 / 0.015 (canonical per `scripts/paper4_mae_rmse_canonical.py`)
- (3) Random-H Poisson-binomial: P < 10⁻⁷ for the 17-row Tier-A-full count under three explicit operational definitions
- (4) 22/22 headline replaced by the three-tier decomposition 12 + 5 + 5 in Abstract, Significance Statement, and Figure 1 caption
- (5) `scripts/sim_paper4_22_22_full_impl_v4.py` replaces v3 (which is retained under `legacy/` for v1.3 → v1.4 reproducibility transparency)

Additional v1.4 substantive additions: SI §S-axiom-minimality (formal 5-Lemma derivation A1-A4 → z(H) = 2H+1), SI §S-Heff-sensitivity-coordinate (Tier B mixing-coordinate framing as ex post diagnostic), SI §S-path1-microfoundation (cross-branch cancellation σ_gc = 0 ⇔ β = 1 for the five near-linear indicators; Path-1 falsifier added), SI §S-data-availability-disclosure (five data assets + 30-day frozen CSV companion deposit schedule), and SI §S-implementation-notes (the v1.3 → v1.4 implementation notes referenced above).

The central claim (three-tier 22/22 closure on the Bettencourt 2007 22-indicator panel under the registered consistency rule) and the analytical formula β±(H) = 1 ± 1/[H ln(2H+1)] are unchanged from v1.3. The framework is offered as a complementary refinement of the foundational Bettencourt 2013 / 2020 / 2021 urban-scaling framework, not as a replacement.


## Maintainer note: GitHub Pages mirror (optional)

The repository can be exposed as a stable browser-accessible mirror by enabling GitHub Pages (Settings → Pages → Source: `main` branch / `/ (root)`). Once enabled, the `tools/paper4/{4,5,8}/` subdirectories become directly accessible at `https://shota-kato-lab.github.io/kato-equation-paper4/tools/paper4/{4,5,8}/`. This is independent of the primary live deployment at `aiandfuture.co.jp/tool/{4,5,8}/` and provides a citation-stable mirror for reviewer access.
