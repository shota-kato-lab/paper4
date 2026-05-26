# KNOWN_ISSUES.md (v1.3 errata disclosure + v1.4 integration note)

## v1.3 (release 2026-05-16, manuscript V22.6)

After v1.3 publication, a third-party reviewer-anticipation audit (independent Claude session, ~17.5 KB / 8 sections / 5 critical items + 2 minor items + 6 action items) surfaced the following integrity items. They were first disclosed at the GitHub-repository level (this file, tag v1.3, 2026-05-17) as a transparency commitment.

### Issue 1 -- Simulation script ladder-value inconsistency

The v1.3 script `scripts/sim_paper4_22_22_full_impl_v3.py` hard-coded `beta_plus[1]=1.000`, `beta_minus[2]=0.770`, `beta_minus[3]=0.857`, which disagree with the Kato analytical values `beta_plus[1]=1.910`, `beta_minus[2]=0.689`, `beta_minus[3]=0.829`. The hard-coded values were originally placeholder / transcription artefacts in an unused mixture-cluster code path; the central numerical claims of the paper were computed analytically from the closed-form formula `beta_pm(H) = 1 +/- 1/[H ln(2H+1)]` and were not affected.

### Issue 2 -- Kato uniqueness DeltaAIC SI claim non-reproducible

The v1.3 SI claim "Kato attains the lowest DeltaAIC and all alternatives fail by at least DeltaAIC >= 5" was not reproduced by independent recomputation. Specifically, `eps = 1/H^2` matched CI 21/22 and `eps = 1/[H ln(3H+1)]` matched AIC above Kato; Kato sits within a cluster of empirically near-equivalent state-count formulae.

### Issue 3 -- Poisson-binomial seven-orders-of-magnitude overstatement

The v1.3 claim `P = 3.6 x 10^-15` was not reproduced. Under the natural operational definition `H ~ Uniform{2,...,8}` with branch matched to indicator regime, the independent computation gives `P < 10^-7` (substantive non-randomness is preserved; only the specific decimal was overstated).

### Issue 4 -- 22/22 headline-vs-substance gap

The v1.3 "22/22 with zero fitted exponents" headline did not transparently break down as: 12/22 direct strict-integer matches + 5/22 audit-qualified single-H closures (proxy / residual / reference rows) + 5/22 continuous-H_eff Tier B rows (mixture closures, constructive).

### Issue 5 -- MAE/RMSE consolidation gap

The v1.3 headline `MAE = 0.031` differed from `paper4_numerical_verify.py` output (`MAE = 0.0120`). The discrepancy was due to whether Tier B continuous-H_eff fit rows were included in the average.

## v1.4 Integration Note (2026-05-26, manuscript V278)

All five integrity items above are now integrated into the v1.4 manuscript (paper main text + SI) as a full revision rather than as a self-disclosure footnote. The integration points:

- **Issue 1** -- `scripts/sim_paper4_22_22_full_impl_v4.py` replaces v3 (analytical values throughout). The v3 script is retained at `legacy/sim_paper4_22_22_full_impl_v3.py` for v1.3 -> v1.4 audit traceability.
- **Issue 2** -- SI Appendix S-epsilon-alternative-rejection now reports dual-panel transparency (Panel A reviewer naive replication + Panel B paper framework). The empirical-uniqueness claim has been withdrawn; selection of Kato now rests on the axiomatic minimality argument in SI S-axiom-minimality.
- **Issue 3** -- SI Appendix S-poisson-op-def specifies three explicit operational definitions for the Random-H null; `scripts/poisson_binomial_random_H.py` is the reproducible DP implementation. Headline value: `P < 10^-7` for the 17-row Tier-A-full count.
- **Issue 4** -- Abstract, Significance Statement, and Figure 1 caption now report the three-tier decomposition 12 + 5 + 5 explicitly. The 22/22 closure is preserved as the sum of the three tiers under the registered consistency rule.
- **Issue 5** -- `scripts/paper4_mae_rmse_canonical.py` is the single deterministic source. Three-tier MAE: direct-strict 12-row 0.008 / Tier-A-full 16-row 0.017 / all-22 disclosed 0.015.

The v1.3 release tag is kept as the historical first-disclosure state (Bettencourt first-send PDF, md5 `133702eca4f567635567a19312a1c538`). v1.4 is the canonical full-revision release.
