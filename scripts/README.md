# scripts/ — Paper 4 V204 reproducibility bundle (v1.0)

Two Python scripts that reproduce the **central numerical claims** of Paper 4:

| Script | Reproduces |
|---|---|
| `sim_paper4_22_22_full_impl_v3.py` | Stages 1–3 of the K=2 cluster-mixture closure protocol (Results §3.5–3.6). Outputs the 22-panel per-indicator assignment table and the running closure count (Stage 1 strict integer + Stage 2 adaptive K=2 mixture + Stage 3 K=3 max-entropy fallback) for the panel-canonical observation pipeline. |
| `paper4_numerical_verify.py` | Independent re-computation of every β±(H) integer-rung value reported in main text + SI (H = 1..8), the continuous β±(H_eff) values for the six mixture rows, and the MAE / RMSE on the audited 22-row slice. |

## How to run

```bash
# Python 3.10+
python3 -m venv venv
source venv/bin/activate          # Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python3 sim_paper4_22_22_full_impl_v3.py
python3 paper4_numerical_verify.py
```

The `sim_paper4_22_22_full_impl_v3.py` script writes a results CSV (`paper4_22_22_full_impl_results.csv`) next to itself.

## Data dependency

The 22-panel β_obs + 95% CI values are **hardcoded inline** in `sim_paper4_22_22_full_impl_v3.py` (transcribed from the Supporting Information of Bettencourt, Lobo, Helbing, Kühnert, West, *PNAS* 2007 — see DOI 10.1073/pnas.0610172104). No external data fetch is required.

The Bettencourt 2007 panel is freely available from the PNAS website and is provided here only for the purpose of integer-ladder testing in the present manuscript.

## Scope of this v1.0 bundle

This bundle reproduces the **central claims** of Paper 4:

- 22-panel integer-ladder mapping (17 / 22 single-integer)
- K = 2 cluster-mixture closure protocol (22 / 22 hybrid)
- MAE / RMSE on the audited slice (≈ 0.031 / 0.045 to rounding precision)
- β±(H) integer-rung values for H = 1 .. 8

The following peripheral pipelines are **deferred to a subsequent versioned release** (v1.1) of this Zenodo deposit:

- USPTO–CBSA 2010 cross-section standalone reconstruction (Paper 4 main-text primary anchor at β_obs = 1.298, [1.198, 1.398]).
- EOC (Era of Crystallisation) audit bootstrap (n = 10 000) for the SI Appendix S-PanelOrigins window count [18, 22].

For these pipelines, the manuscript text + SI documents the methodology prose-and-equation; full simulation/audit code is available from the corresponding author upon request.

## License

MIT (see `LICENSE` in this directory).

## Citation

If you re-use this code, please cite the parent Zenodo deposit:

> Kato, S. (2026). *The Kato Equation: A Zero-Parameter Exponent Selection Rule for Urban Scaling*. Zenodo. https://doi.org/10.5281/zenodo.20145298
