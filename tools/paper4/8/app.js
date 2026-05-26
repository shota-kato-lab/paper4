/*
 * Bettencourt 22-Indicator Reference Catalogue
 * with Paper 4 Zero-Fitted-Exponent Ladder Predictions
 *
 * tool/8/ Bettencourt 22-Indicator Reference Catalogue (paper 4 companion, 2026-05)
 *
 * v1.5 (2026-05-27, ★Paper4_β_predictor_6): sourceKind hard-gate apply per
 * GPT P4polish_076 verdict + 立ち上げ書 §10.2 9 step:
 *   - SAMPLE_NETWORKS sourceKind taxonomy: 'real-graph' (USPTO linkedPanelRowId=17
 *     for linked-indicator cross-check / SNAP linkedPanelRowId=null standalone)
 *     and 'toy-graph' (row17/row22 synthetic renamed to toy_balanced_2block /
 *     toy_82_split, no panel β comparison).
 *   - renderLiveNetworkResults branched by sourceKind: real-graph + linkedPanelRowId
 *     produces 4 verdict layer split (Topology / β-CI compat / Strict-H corroboration /
 *     wording note avoiding 'verifies strict H=2'); real-graph standalone produces
 *     graph-side K detection only with no panel β comparison; toy-graph produces
 *     K-detection illustration with explicit 'not panel evidence' framing.
 *   - renderSampleGrid grouped into 'Real coordination networks' + 'Toy graphs'.
 *   - panel row click handlers: Live Network section now always hidden on any
 *     panel row click (= GPT verdict per panel-row synthetic K verdict is a
 *     category error; row 17/22 special trigger removed).
 *   - renderDetailPanel method note for Tier A: 'Path B not applicable to panel
 *     rows' explicit; Tier B: 'barycentric coordinate identity, not graph-derived
 *     K detection' strengthened.
 *   - row 17/22 detail-fold removed (no Live Network on panel row click).
 *
 * v0.3.3 → v0.3.4 diff (= 著者 chat feedback 2 件 反映):
 *   G. Match line notation reworked to be mathematically tight:
 *      "Match: ✓ β_pred = 1.311 ∈ [1.198, 1.398] = 95% CI of β_obs
 *                 (β_obs = 1.298)"
 *      i.e., ∈ takes a set (the CI interval) on its right, the β_obs point
 *      estimate is shown separately, β_pred numeric value is in line.
 *      Same notation for mismatch (∉) and for Tier B mixture rows.
 *   H. (HTML-side, separately) disclosure paragraph wording reverted to
 *      /tool/5/-style "assigned a priori per V261 §S-PanelOrigins" — the
 *      /tool/4/ "mathematically determined uniquely" wording is dropped
 *      because a 0-knowledge independent reviewer task (general-purpose
 *      subagent, 2026-05-22) found 18 of 22 indicator H assignments fall
 *      outside what a generic domain reviewer would converge on.
 */

'use strict';

const indicators = [
  // ------- Tier A integer-rung (17 rows) -------
  { id: 1,  short: "roads", name: "Length of road network",
    network_type: "physical infrastructure", substrate: "area-bounded",
    branch: "minus", mixture: false, H: 3,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 0.829, beta_obs: 0.830, ci: [0.74, 0.92],
    relay_chain:
      "【land parcel right-of-way】 → 【road segment】 → 【city-wide road network】",
    relay_rationale:
      "3 boxes = H=3.  Land use is the floor of the chain; segment-level " +
      "construction is the middle stage; the city-wide network is the top " +
      "stage.  Each successive stage is constrained by the bounded urban " +
      "land footprint, so total road mileage grows sub-linearly with " +
      "population (β_-(3) ≈ 0.829).",
    source: "FHWA Highway Statistics + US Census TIGER/Line (author derivation per SI Appendix)",
    cite_url: "https://www.fhwa.dot.gov/policyinformation/statistics.cfm" },
  { id: 2,  short: "cable", name: "Length of electrical cable",
    network_type: "physical infrastructure", substrate: "volume-bounded",
    branch: "minus", mixture: false, H: 4,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 0.886, beta_obs: 0.870, ci: [0.82, 0.92],
    relay_chain:
      "【building conductor】 → 【service drop / feeder line】 → " +
      "【distribution transformer】 → 【substation distribution feeder network】",
    relay_rationale:
      "4 boxes = H=4.  Volume-bounded conduit hierarchy: each building's " +
      "internal wiring connects up through a service drop, transformer, and " +
      "substation feeder network.  Bounded substrate → sublinear " +
      "(β_-(4) ≈ 0.886).",
    source: "US EIA Form EIA-861 (electric utility distribution)",
    cite_url: "https://www.eia.gov/electricity/data/eia861/" },
  { id: 3,  short: "estab", name: "Establishments",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "balanced", mixture: false, H: 1,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.000, beta_obs: 1.000, ci: [0.99, 1.01],
    relay_chain:
      "【business establishment ↔ resident (1-to-1 direct unit)】",
    relay_rationale:
      "1 box = H=1.  No intermediate coordination layer: each resident " +
      "corresponds to roughly one unit of economic-establishment " +
      "denominator.  Path 1 cross-branch cancellation σ_gc = 0, so β = 1.",
    source: "US Census Bureau County Business Patterns (CBP)",
    cite_url: "https://www.census.gov/programs-surveys/cbp.html" },
  { id: 4,  short: "homes", name: "Housing units",
    network_type: "hybrid", substrate: "mixed",
    branch: "balanced", mixture: false, H: 1,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.000, beta_obs: 1.000, ci: [0.99, 1.01],
    relay_chain:
      "【housing unit ↔ resident (1-to-1 direct stock)】",
    relay_rationale:
      "1 box = H=1.  Direct dwelling-stock denominator: one unit per " +
      "household-size group of residents.  Path 1 balanced σ_gc = 0, β = 1.",
    source: "US Census Bureau American Community Survey (ACS) 5-Year Estimates",
    cite_url: "https://data.census.gov/" },
  { id: 5,  short: "hshld", name: "Households (proxy via Housing units)",
    network_type: "hybrid", substrate: "mixed",
    branch: "balanced", mixture: false, H: 1,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.000, beta_obs: 1.000, ci: [0.99, 1.01],
    relay_chain:
      "【household ↔ resident (1-to-1, proxied via housing-unit count)】",
    relay_rationale:
      "1 box = H=1.  Households are the housing-unit denominator under a " +
      "proxy mapping.  Path 1 balanced σ_gc = 0, β = 1.",
    source: "US Census ACS (proxy via Housing units count, author note in SI Appendix)",
    cite_url: "https://data.census.gov/" },
  { id: 6,  short: "water", name: "Household water consumption",
    network_type: "hybrid", substrate: "mixed",
    branch: "balanced", mixture: false, H: 1,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.000, beta_obs: 1.010, ci: [0.89, 1.11],
    relay_chain:
      "【domestic water-use unit ↔ resident (per-capita direct)】",
    relay_rationale:
      "1 box = H=1.  Domestic water consumption is a per-capita direct " +
      "draw with no intermediate coordination layer.  Path 1 balanced " +
      "σ_gc = 0, β ≈ 1.",
    source: "USGS Water Use in the United States + EPA SDWIS",
    cite_url: "https://water.usgs.gov/watuse/" },
  { id: 7,  short: "empl", name: "Total employment",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "balanced", mixture: false, H: 1,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.000, beta_obs: 1.010, ci: [0.99, 1.02],
    relay_chain:
      "【job ↔ working-age resident (1-to-1 direct match)】",
    relay_rationale:
      "1 box = H=1.  Each working-age resident contributes roughly one job; " +
      "no intermediate coordination layer.  Path 1 balanced σ_gc = 0, β ≈ 1.",
    source: "BLS Quarterly Census of Employment and Wages (QCEW)",
    cite_url: "https://www.bls.gov/cew/" },
  { id: 8,  short: "elec", name: "Electricity (total consumption)",
    network_type: "hybrid", substrate: "mixed",
    branch: "plus", mixture: false, H: 6,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.065, beta_obs: 1.070, ci: [1.03, 1.11],
    relay_chain:
      "【generator (power plant)】 → 【high-voltage transmission grid】 → " +
      "【bulk substation】 → 【distribution substation】 → 【local feeder / " +
      "distribution transformer】 → 【end-use device (in-building meter)】",
    relay_rationale:
      "6 boxes = H=6.  The author's expert identification of the power-grid " +
      "coordination layers: a kWh flows through 6 sequential stages from " +
      "generation down to the end-use device.  Densifying socio-economic " +
      "activity at the bottom + bounded grid above → mildly superlinear " +
      "(β_+(6) ≈ 1.065).  H=6 is the deepest coordination chain in the " +
      "Tier-A integer rows.",
    source: "US EIA Form EIA-861 + State Energy Data System (SEDS)",
    cite_url: "https://www.eia.gov/electricity/data/eia861/" },
  { id: 9,  short: "bank", name: "Bank deposits",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 5,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.083, beta_obs: 1.080, ci: [1.03, 1.11],
    relay_chain:
      "【depositor】 → 【bank branch】 → 【bank holding company】 → " +
      "【inter-bank capital market】 → 【city-level financial coordination】",
    relay_rationale:
      "5 boxes = H=5.  Branches are an access layer on top of a deeper " +
      "inter-firm capital network: depositor → branch → bank → market → " +
      "city-level financial coordination.  Superlinear (β_+(5) ≈ 1.083).",
    source: "FDIC Summary of Deposits (SOD), yearly snapshot June 30",
    cite_url: "https://www.fdic.gov/resources/bankers/call-reports/" },
  { id: 10, short: "wage", name: "Total wages",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 4,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.114, beta_obs: 1.120, ci: [1.09, 1.13],
    relay_chain:
      "【worker】 → 【job role / position】 → 【employer firm】 → " +
      "【city labor-market matching pool】",
    relay_rationale:
      "4 boxes = H=4.  Intermediate-employer relays increase per-worker " +
      "productivity in larger cities; the chain runs worker → role → firm → " +
      "matching market.  Superlinear (β_+(4) ≈ 1.114).",
    source: "BLS Quarterly Census of Employment and Wages (QCEW), total wages",
    cite_url: "https://www.bls.gov/cew/" },
  { id: 11, short: "creat", name: "Supercreative employment",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 3,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.171, beta_obs: 1.150, ci: [1.11, 1.18],
    relay_chain:
      "【creative worker】 → 【creative firm / studio / lab】 → " +
      "【creative-class labor market】",
    relay_rationale:
      "3 boxes = H=3.  Florida-class occupational stock: worker → firm → " +
      "labor market.  3-stage coordination depth gives β_+(3) ≈ 1.171.",
    source: "BLS SOC + OEWS (Florida creative class SOC code filter)",
    cite_url: "https://www.bls.gov/oes/" },
  { id: 12, short: "gdpO", name: "GDP (US, OECD reference)",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 4,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.114, beta_obs: 1.099, ci: [1.06, 1.14],
    relay_chain:
      "【transaction】 → 【firm】 → 【industry sector】 → " +
      "【city GDP aggregate (OECD harmonised)】",
    relay_rationale:
      "4 boxes = H=4.  Economic transactions densify within the same urban " +
      "footprint through 4 coordination layers.  Superlinear (β_+(4) ≈ 1.114).",
    source: "OECD Metropolitan Areas database + US BEA Regional GDP",
    cite_url: "https://stats.oecd.org/Index.aspx?DataSetCode=CITIES" },
  { id: 13, short: "gdpM", name: "GDP (US 1969-2003 MSA)",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 4,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.114, beta_obs: 1.099, ci: [1.06, 1.14],
    relay_chain:
      "【transaction】 → 【firm】 → 【industry sector】 → " +
      "【MSA GDP aggregate (BEA historical 1969-2003)】",
    relay_rationale:
      "4 boxes = H=4.  Same chain as row 12 but on the BEA historical MSA " +
      "series.  Superlinear (β_+(4) ≈ 1.114).",
    source: "US BEA Regional GDP historical series (1969-2003 archival)",
    cite_url: "https://www.bea.gov/data/gdp/gdp-metropolitan-area" },
  { id: 14, short: "r&d", name: "R&D employment",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 2,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.311, beta_obs: 1.300, ci: [1.26, 1.34],
    relay_chain:
      "【researcher】 → 【R&D output (paper, prototype, IP)】",
    relay_rationale:
      "2 boxes = H=2.  Shallow knowledge-output coordination: " +
      "researcher directly produces an R&D output, no extra intermediate " +
      "layer.  Highly superlinear (β_+(2) ≈ 1.311).",
    source: "NSF SESTAT + BLS SOC/OEWS (R&D scientist occupation codes)",
    cite_url: "https://ncses.nsf.gov/explore-data" },
  { id: 15, short: "crime", name: "Crime indices (proxy)",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 3,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.171, beta_obs: 1.160, ci: [1.11, 1.18],
    relay_chain:
      "【potential offender】 → 【opportunity context (place + time + target)】 → " +
      "【reported incident】",
    relay_rationale:
      "3 boxes = H=3.  Interpersonal / opportunity event process: " +
      "potential actor → context → recorded outcome.  Superlinear " +
      "(β_+(3) ≈ 1.171).",
    source: "FBI Uniform Crime Reporting (UCR) - MSA-level annual",
    cite_url: "https://www.fbi.gov/services/cjis/ucr" },
  { id: 16, short: "phd", name: "Ph.D. holders (proxy via Supercreative)",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 3,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.171, beta_obs: 1.160, ci: [1.11, 1.18],
    relay_chain:
      "【graduate student】 → 【PhD program (advisor + lab + cohort)】 → " +
      "【doctoral conferral】",
    relay_rationale:
      "3 boxes = H=3.  Same 3-layer knowledge-class coordination as " +
      "supercreative (row 11), proxied via doctoral programs.  Superlinear " +
      "(β_+(3) ≈ 1.171).",
    source: "NSF Survey of Earned Doctorates (SED) + US Census ACS education attainment",
    cite_url: "https://ncses.nsf.gov/surveys/earned-doctorates/" },
  { id: 17, short: "pat", name: "Patents (USPTO-CBSA 2010)",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 2,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.311, beta_obs: 1.298, ci: [1.198, 1.398],
    relay_chain:
      "【inventor】 → 【patent grant / assignee】",
    relay_rationale:
      "2 boxes = H=2.  Same shallow knowledge-output network as R&D " +
      "employment (row 14): inventor → patent.  Highly superlinear " +
      "(β_+(2) ≈ 1.311).",
    source: "USPTO PatentsView bulk data tables (n = 378 MSAs, paper4 SI Appendix Table 3)",
    cite_url: "https://patentsview.org/" },
  // ------- Tier B Path 2 extended hybrid (5 rows) -------
  { id: 18, short: "gasS", name: "Gasoline sales",
    network_type: "physical infrastructure", substrate: "area-bounded",
    branch: "minus", mixture: true, H: null,
    H_pair: [2, 3], pi_low: 0.39, pi_up: 0.61, H_eff: 2.61,
    beta_pred: 0.790, beta_obs: 0.790, ci: [0.73, 0.80],
    relay_chain_low:  "【vehicle fuel demand】 → 【dispensed gallons】",
    relay_chain_up:
      "【vehicle】 → 【station】 → 【road throughput network】",
    relay_chain_mix_note:
      "Gasoline sales are a flow on a mixed area-bounded substrate (station " +
      "footprint + road throughput).  The chain has 2 or 3 boxes depending " +
      "on whether road throughput is treated as part of the dispensing " +
      "stage or as a separate stage; the {H=2, H=3} bracketing captures " +
      "both readings simultaneously.",
    source: "US DOE/EIA Petroleum Marketing Annual + OPIS retail data",
    cite_url: "https://www.eia.gov/petroleum/" },
  { id: 19, short: "gasN", name: "Gasoline stations",
    network_type: "physical infrastructure", substrate: "area-bounded",
    branch: "minus", mixture: true, H: null,
    H_pair: [2, 3], pi_low: 0.39, pi_up: 0.61, H_eff: 2.61,
    beta_pred: 0.790, beta_obs: 0.770, ci: [0.74, 0.81],
    relay_chain_low:  "【population demand】 → 【gas-station parcel】",
    relay_chain_up:
      "【population demand】 → 【station】 → 【road right-of-way access】",
    relay_chain_mix_note:
      "Gas stations are parcel-based facilities with bounded land / storage.  " +
      "Treating the station as a direct parcel gives H=2; treating it as " +
      "embedded in a road-access network gives H=3.  Same {H=2, H=3} " +
      "bracketing as gasoline sales (row 18).",
    source: "US Census CBP (NAICS 447 gasoline stations) + EIA Petroleum Marketing Annual",
    cite_url: "https://www.census.gov/programs-surveys/cbp.html" },
  { id: 20, short: "AIDS", name: "Disease (AIDS) deaths",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: true, H: null,
    H_pair: [2, 3], pi_low: 0.55, pi_up: 0.45, H_eff: 2.45,
    beta_pred: 1.230, beta_obs: 1.230, ci: [1.18, 1.29],
    relay_chain_low:
      "【carrier】 → 【new case (direct partner-to-partner contact)】",
    relay_chain_up:
      "【carrier】 → 【community contact context】 → 【reported / diagnosed case】",
    relay_chain_mix_note:
      "Reported AIDS cases reflect a contact / reporting network on an " +
      "unbounded socio-economic substrate.  The direct contact mode gives " +
      "H=2; the community-mediated reporting mode adds the reporting " +
      "infrastructure layer for H=3.  The {H=2, H=3} bracketing captures " +
      "both simultaneously.",
    source: "CDC NCHHSTP AtlasPlus (HIV/AIDS new cases per 100K population)",
    cite_url: "https://www.cdc.gov/nchhstp/atlas/" },
  { id: 21, short: "invtr", name: "Inventors",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: true, H: null,
    H_pair: [2, 3], pi_low: 0.68, pi_up: 0.32, H_eff: 2.32,
    beta_pred: 1.250, beta_obs: 1.250, ci: [1.22, 1.27],
    relay_chain_low:
      "【inventor】 → 【patent / assignee】 (identical to row 17 modern strict reading)",
    relay_chain_up:
      "【inventor】 → 【research team】 → 【patent / assignee】",
    relay_chain_mix_note:
      "Inventors are a labor / knowledge-network role, not area-bounded.  " +
      "The shallow chain (H=2) is identical to the modern USPTO-CBSA patents " +
      "row 17; adding a research-team coordination layer gives H=3.  The " +
      "dominant π_low ≈ 0.68 keeps the strict H=2 reading primary.",
    source: "USPTO PatentsView (Inventor table, distinct from Patents count)",
    cite_url: "https://patentsview.org/" },
  { id: 22, short: "patB", name: "Patents (Bettencourt 2007 legacy)",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: true, H: null,
    H_pair: [2, 3], pi_low: 0.90, pi_up: 0.10, H_eff: 2.10,
    beta_pred: 1.289, beta_obs: 1.270, ci: [1.25, 1.29],
    relay_chain_low:
      "【inventor】 → 【patent grant】 (modern strict, same as row 17)",
    relay_chain_up:
      "【inventor】 → 【multi-year / pooled methodology】 → " +
      "【aggregated patent estimate (Bettencourt 2007 legacy)】",
    relay_chain_mix_note:
      "Retained for cross-paper continuity.  The strict H=2 modern reading " +
      "(π_low ≈ 0.90) dominates; a small H=3 component captures the " +
      "pooling / multi-year aggregation methodology used in the original " +
      "2007 panel.",
    source: "Bettencourt et al. 2007 PNAS supplement Table 1 (n ≈ 378 MSAs)",
    cite_url: "https://www.pnas.org/doi/10.1073/pnas.0610172104" }
];

function ladderBetaPlus(H)  { return 1 + 1 / (H * Math.log(2 * H + 1)); }
function ladderBetaMinus(H) { return 1 - 1 / (H * Math.log(2 * H + 1)); }

function fmt(x, decimals) {
  if (x === null || x === undefined || Number.isNaN(x)) return "—";
  return Number(x).toFixed(decimals);
}

function fmtCi(ci, decimals) {
  if (!ci) return "—";
  return "[" + fmt(ci[0], decimals) + ", " + fmt(ci[1], decimals) + "]";
}

function tierAMatch(row) {
  return row.beta_pred >= row.ci[0] && row.beta_pred <= row.ci[1];
}

function tierBBracket(row) {
  const [Hlow, Hup] = row.H_pair;
  const f = (row.branch === "minus") ? ladderBetaMinus : ladderBetaPlus;
  const bLow = f(Hlow);
  const bUp  = f(Hup);
  const lo = Math.min(bLow, bUp);
  const hi = Math.max(bLow, bUp);
  const intersect = !(hi < row.ci[0] || lo > row.ci[1]);
  return { hullLo: lo, hullHi: hi, intersect: intersect,
           directMatch: row.beta_pred >= row.ci[0] && row.beta_pred <= row.ci[1],
           bLowVal: bLow, bUpVal: bUp };
}

function branchLabel(branch) {
  if (branch === "plus")     return "+ (superlinear)";
  if (branch === "minus")    return "− (sublinear)";
  if (branch === "balanced") return "balanced (Path 1 cross-branch cancellation, σ_gc = 0)";
  return branch;
}

function classificationLine(row) {
  return row.network_type + ", " + row.substrate;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderFormulaBlock(row) {
  const generalFormula =
    '<span class="dformula-label">General formula:</span>&nbsp;' +
    'β = 1 ± 1 / [<em>H</em> · ln(2<em>H</em> + 1)]';

  if (row.mixture) {
    const sgn = (row.branch === "minus") ? "−" : "+";
    const Heff = fmt(row.H_eff, 2);
    const twoHeff1 = fmt(2 * row.H_eff + 1, 2);
    return (
      '<p class="dformula">' +
      generalFormula + '<br>' +
      '<span class="dformula-label">This time:</span>&nbsp;' +
      'β<sub>pred</sub> = β' + sgn + '(H<sub>eff</sub> = ' + Heff + ') ' +
      '= 1 ' + sgn + ' 1 / [' + Heff + ' · ln(2×' + Heff + ' + 1)] ' +
      '= 1 ' + sgn + ' 1 / [' + Heff + ' · ln(' + twoHeff1 + ')] ' +
      '≈ <strong>' + fmt(row.beta_pred, 3) + '</strong>' +
      '<br><span class="dformula-aside">(by construction recovers β<sub>obs</sub> ' +
      'within the pre-specified {H=' + row.H_pair[0] + ', H=' + row.H_pair[1] +
      '} pair — see the ⚠ Ex post diagnostic note above.)</span>' +
      '</p>'
    );
  }

  if (row.branch === "balanced") {
    return (
      '<p class="dformula">' +
      generalFormula + '<br>' +
      '<span class="dformula-label">For balanced indicators:</span>&nbsp;' +
      'the + and − branches cancel under Path 1 ' +
      '(σ<sub>gc</sub> = π<sub>+</sub> − π<sub>−</sub> = 0), giving ' +
      'β<sub>pred</sub> = <strong>1.000</strong> by construction.  The ' +
      'formal H = ' + row.H + ' marker in the SI Appendix §S-PanelOrigins is structural ' +
      'metadata for the panel row; the β = 1 result here comes from Path 1 ' +
      'cross-branch cancellation, <em>not</em> from evaluating the ladder ' +
      'formula at H = ' + row.H + '.' +
      '</p>'
    );
  }

  const sgn = (row.branch === "minus") ? "−" : "+";
  const twoH1 = 2 * row.H + 1;
  return (
    '<p class="dformula">' +
    generalFormula + '<br>' +
    '<span class="dformula-label">This time:</span>&nbsp;' +
    'β<sub>pred</sub> = β' + sgn + '(H=' + row.H + ') ' +
    '= 1 ' + sgn + ' 1 / [' + row.H + ' · ln(2×' + row.H + ' + 1)] ' +
    '= 1 ' + sgn + ' 1 / [' + row.H + ' · ln(' + twoH1 + ')] ' +
    '≈ <strong>' + fmt(row.beta_pred, 3) + '</strong>' +
    '</p>'
  );
}

// G. Render the Match line with mathematically tight notation:
//   "β_pred = 1.311 ∈ [1.198, 1.398] = 95% CI of β_obs (β_obs = 1.298)"
// The set on the right of ∈ is the CI interval (explicit); β_obs point
// estimate is shown separately in parentheses; β_pred numeric value is in
// line for direct visual comparison.
function renderMatchLine(row) {
  const bpredStr = fmt(row.beta_pred, 3);
  const bobsStr  = fmt(row.beta_obs, 3);
  const ciStr    = fmtCi(row.ci, 3);

  if (!row.mixture) {
    const ok = tierAMatch(row);
    const symbol = ok ? '∈' : '∉';
    const cls = ok ? 'ok' : 'miss';
    const check = ok ? '✓' : '✗';
    return (
      '<p class="dmatch ' + cls + '">' +
      'Match: ' + check + '&nbsp;' +
      'β<sub>pred</sub> = ' + bpredStr + '&nbsp;' + symbol + '&nbsp;' +
      ciStr + ' = 95% CI of β<sub>obs</sub>&nbsp;' +
      '<span class="dmatch-aside">(β<sub>obs</sub> = ' + bobsStr + ')</span>' +
      '</p>'
    );
  }

  // Mixture row: direct match check first; if direct fails, fall back to
  // bracketing-hull intersection.
  const b = tierBBracket(row);
  const hullStr = '[' + fmt(b.hullLo, 3) + ', ' + fmt(b.hullHi, 3) + ']';

  if (b.directMatch) {
    return (
      '<p class="dmatch ok">' +
      'Match: ✓&nbsp;' +
      'β<sub>pred</sub> = ' + bpredStr + ' ∈ ' + ciStr +
      ' = 95% CI of β<sub>obs</sub>&nbsp;' +
      '<span class="dmatch-aside">(β<sub>obs</sub> = ' + bobsStr + ')</span>' +
      '</p>'
    );
  }
  if (b.intersect) {
    return (
      '<p class="dmatch bracket">' +
      'Match: ✓&nbsp;' +
      'bracketing: convex hull [β±(H<sub>up</sub>), β±(H<sub>low</sub>)] = ' + hullStr +
      ' intersects β<sub>obs</sub> 95% CI ' + ciStr + '&nbsp;' +
      '<span class="dmatch-aside">(β<sub>obs</sub> = ' + bobsStr +
      '; β<sub>pred</sub> = ' + bpredStr + ')</span>' +
      '</p>'
    );
  }
  return (
    '<p class="dmatch miss">' +
    'Match: ✗&nbsp;' +
    'β<sub>pred</sub> = ' + bpredStr + ' ∉ ' + ciStr +
    ' = 95% CI of β<sub>obs</sub>; and no bracketing intersection.&nbsp;' +
    '<span class="dmatch-aside">(β<sub>obs</sub> = ' + bobsStr + ')</span>' +
    '</p>'
  );
}

function renderDetailPanel(row) {
  const lines = [];
  lines.push('<div class="detail-header">');
  lines.push('  <span class="detail-tag">Selected</span>');
  lines.push('  <span class="detail-rowid">row ' + row.id + '</span>');
  lines.push('  <span class="detail-rowname">— ' + escapeHtml(row.name) + '</span>');
  lines.push('  <span class="detail-tier ' + (row.mixture ? 'tier-b' : 'tier-a') + '">' +
             (row.mixture ? 'Tier B (mixture / Path 2 extended)' : 'Tier A (integer-rung)') + '</span>');
  lines.push('</div>');

  lines.push('<div class="detail-body">');

  lines.push('  <p class="dline">');
  lines.push('    <span class="dkey">Bettencourt 2007 observed β<sub>obs</sub> (95% CI):</span> ');
  lines.push('    <span class="dval">' + fmt(row.beta_obs, 3) + ' ' + fmtCi(row.ci, 3) + '</span>');
  lines.push('  </p>');
  lines.push('  <p class="dline dsource">');
  lines.push('    <span class="dsource-prefix">source:</span> ' + escapeHtml(row.source));
  lines.push('    <br><a href="' + row.cite_url + '" target="_blank" rel="noopener noreferrer">' +
             escapeHtml(row.cite_url) + '</a>');
  lines.push('  </p>');

  lines.push('  <p class="dsection-head">Paper 4 structural assignment (SI Appendix §S-PanelOrigins):</p>');
  lines.push('  <ul class="dlist">');
  lines.push('    <li>Industry classification: ' + escapeHtml(classificationLine(row)) + '</li>');
  lines.push('    <li>Branch sign: ' + escapeHtml(branchLabel(row.branch)) + '</li>');
  if (!row.mixture) {
    lines.push('    <li>Mixture flag: NO (Tier A integer rung)</li>');
    lines.push('    <li>Relay depth H: <strong>' + row.H + '</strong> ' +
               '<span class="dhint">(= the number of 【】 boxes in the relay chain below)</span></li>');
  } else {
    lines.push('    <li>Mixture flag: YES (Tier B mixing-coordinate diagnostic per SI Appendix §S-Heff §3)</li>');
    lines.push('    <li>Adjacent rung pair: H ∈ {' + row.H_pair[0] + ', ' + row.H_pair[1] + '} ' +
               '<span class="dhint">(= 2-box chain vs 3-box chain, see below)</span></li>');
    lines.push('    <li class="dmix-expost">');
    lines.push('      <span class="dmix-badge">⚠ Ex-post Coordinate Shift</span>');
    lines.push('      Mixing weights (π<sub>' + row.H_pair[0] + '</sub>, π<sub>' + row.H_pair[1] + '</sub>) ' +
               'operate strictly as unique barycentric coordinates decomposing β<sub>obs</sub> within the ' +
               'pre-registered {H=' + row.H_pair[0] + ', ' + row.H_pair[1] + '} boundary envelope (convex mixture identity, not parameter-fitting): ' +
               'π<sub>' + row.H_pair[0] + '</sub> ≈ ' + fmt(row.pi_low, 2) +
               ', π<sub>' + row.H_pair[1] + '</sub> ≈ ' + fmt(row.pi_up, 2) +
               ', H<sub>eff</sub> = ' + fmt(row.pi_low, 2) + ' × ' + row.H_pair[0] +
               ' + ' + fmt(row.pi_up, 2) + ' × ' + row.H_pair[1] +
               ' = <strong>' + fmt(row.H_eff, 2) + '</strong>.');
    lines.push('      The integer pair {' + row.H_pair[0] + ', ' + row.H_pair[1] + '} ' +
               'is the pre-registered boundary constraint from the SI Appendix §S-PanelOrigins; ' +
               'the π weights are the unique barycentric decomposition on that boundary, ' +
               '<strong>not</strong> an independent derivation of <em>H</em>.');
    lines.push('    </li>');
  }
  lines.push('  </ul>');

  lines.push('  <p class="dsection-head">Relay-depth identification ' +
             '(per the SI Appendix §S-PanelOrigins — count the 【】 boxes):</p>');
  if (!row.mixture) {
    lines.push('  <p class="drelay">' + escapeHtml(row.relay_chain) + '</p>');
    lines.push('  <p class="drelay-rationale">' + escapeHtml(row.relay_rationale) + '</p>');
  } else {
    lines.push('  <div class="drelay-mix">');
    lines.push('    <p class="drelay-line"><span class="drelay-head">At H=' + row.H_pair[0] +
               ' (shallower, weight π<sub>' + row.H_pair[0] + '</sub> ≈ ' +
               fmt(row.pi_low, 2) + '):</span></p>');
    lines.push('    <p class="drelay">' + escapeHtml(row.relay_chain_low) + '</p>');
    lines.push('    <p class="drelay-line"><span class="drelay-head">At H=' + row.H_pair[1] +
               ' (deeper, weight π<sub>' + row.H_pair[1] + '</sub> ≈ ' +
               fmt(row.pi_up, 2) + '):</span></p>');
    lines.push('    <p class="drelay">' + escapeHtml(row.relay_chain_up) + '</p>');
    lines.push('    <p class="drelay-rationale">' + escapeHtml(row.relay_chain_mix_note) + '</p>');
    lines.push('  </div>');
  }

  lines.push('  ' + renderFormulaBlock(row));

  // G. NEW Match line rendering (math-tight notation)
  lines.push('  ' + renderMatchLine(row));

  lines.push('  <p class="dmethod"><span class="dmethod-head">Method note:</span> ' +
             (row.mixture
               ? 'Tier B convex-mixture diagnostic per the SI Appendix §S-PanelOrigins + §S-Heff §3 coordinate table. ' +
                 '<strong>The displayed π weights are <em>unique barycentric coordinates</em> ' +
                 'of β<sub>obs</sub> between adjacent ladder values</strong> ' +
                 '{β<sub>±</sub>(H<sub>low</sub>), β<sub>±</sub>(H<sub>up</sub>)} on the pre-registered integer pair — ' +
                 '<strong>NOT a graph-derived K detection</strong>, and <strong>NOT a prediction of <em>H</em></strong>. ' +
                 'The integer pair itself is fixed by the structural assignment, not by fitting. 0 fitted exponents. ' +
                 '<em>(Per GPT P4polish_076 sourceKind hard-gate: panel-row graph-side K detection is a category error — the 22-panel row contains no observed edge list, so any synthetic-graph K verdict here would reflect the generator, not the row. See the USPTO 2010 sample in Live Network Analysis below for linked-indicator cross-check.)</em>'
               : 'Fixed ex-ante from structural network type and substrate constraint ' +
                 'per the SI Appendix §S-PanelOrigins ' +
                 '(ex-ante structural mapping based on coordination substrate, ' +
                 'independent of topological invariants; 0 fitted exponents). ' +
                 '<em>Path B (graph-side K detection) is <strong>NOT</strong> applicable to panel rows — the 22-panel data does not contain observed edge lists. ' +
                 'For graph-side K detection demonstrations, see the USPTO 2010 (linked to row 17 cross-check) and SNAP samples (standalone) in the Live Network Analysis section below.</em>') +
             '</p>');

  lines.push('</div>');
  return lines.join('\n');
}

function renderButtonGrid() {
  const lines = [];
  for (const row of indicators) {
    const cls = row.mixture ? 'cat-btn mixture' : 'cat-btn integer';
    const branchSym = (row.branch === "plus") ? "+" : (row.branch === "minus") ? "−" : "=";
    const hStr = row.mixture ? '{' + row.H_pair[0] + ',' + row.H_pair[1] + '}' : String(row.H);
    const netAbbr = (row.network_type === "physical infrastructure")    ? "phys"
                  : (row.network_type === "socio-economic coordination") ? "socio"
                  : "hyb";
    lines.push(
      '<button type="button" class="' + cls + '" data-row-id="' + row.id + '" ' +
      'aria-label="Indicator ' + row.id + ': ' + escapeHtml(row.name) + '">' +
      '<span class="btn-id">' + row.id + '</span>' +
      '<span class="btn-short">' + escapeHtml(row.name) + '</span>' +
      '<span class="btn-meta">' + netAbbr + ' / ' + branchSym + ' / H=' + hStr + '</span>' +
      '<span class="btn-beta">β<sub>obs</sub> = ' + fmt(row.beta_obs, 3) + '</span>' +
      '</button>');
  }
  return lines.join('');
}

function init() {
  const grid = document.getElementById('catalogue-grid');
  if (!grid) return;
  grid.innerHTML = renderButtonGrid();

  const detail = document.getElementById('detail-panel');
  if (!detail) return;

  let currentId = null;
  grid.addEventListener('click', function (ev) {
    const btn = ev.target.closest('button[data-row-id]');
    if (!btn) return;
    const id = Number(btn.getAttribute('data-row-id'));
    if (currentId === id) {
      for (const b of grid.querySelectorAll('button.cat-btn')) b.classList.remove('selected');
      detail.innerHTML = '';
      detail.classList.remove('active');
      currentId = null;
      return;
    }
    currentId = id;
    for (const b of grid.querySelectorAll('button.cat-btn')) b.classList.remove('selected');
    btn.classList.add('selected');
    const row = indicators.find(r => r.id === id);
    detail.innerHTML = renderDetailPanel(row);
    detail.classList.add('active');
    // v1.4 (2026-05-27 著者 split directive):
    //   rows 1-4 (= top of grid) → scroll to #catalogue-section-anchor (above result-notice)
    //   rows 5-22 → scroll to button top (= v0.22 original directive)
    var rowIdScroll = Number(btn.getAttribute('data-row-id'));
    if (rowIdScroll >= 1 && rowIdScroll <= 4) {
      var anchorAbv = document.getElementById('catalogue-section-anchor');
      if (anchorAbv) anchorAbv.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else btn.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      btn.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}






// ============================================================================
// tool/8/ v0.5.0 augmentation — Live Network Analysis section (paper 4 companion, 2026-05)
// Live Network Analysis = independent top-level section, NO nesting under detail panel
// NO FOLD anywhere (K=2 forced partition diagnostic = flat low position, Tier B panel = tool/6/ default)
// Robust Analyze with large-graph subsample
// ============================================================================

var UGraph = function () { this.adj = new Map(); this._order = 0; this._size = 0; };
UGraph.prototype.addNode = function (id) {
  if (!this.adj.has(id)) { this.adj.set(id, new Set()); this._order++; }
};
UGraph.prototype.hasEdge = function (a, b) { return this.adj.has(a) && this.adj.get(a).has(b); };
UGraph.prototype.addEdge = function (a, b) {
  if (a === b) return;
  this.addNode(a); this.addNode(b);
  if (this.adj.get(a).has(b)) return;
  this.adj.get(a).add(b); this.adj.get(b).add(a);
  this._size++;
};
UGraph.prototype.degree = function (n) { return this.adj.has(n) ? this.adj.get(n).size : 0; };
UGraph.prototype.nodes = function () { return Array.from(this.adj.keys()); };
UGraph.prototype.neighbors = function (n) { return this.adj.has(n) ? Array.from(this.adj.get(n)) : []; };
Object.defineProperty(UGraph.prototype, 'order', { get: function () { return this._order; } });
Object.defineProperty(UGraph.prototype, 'size',  { get: function () { return this._size; } });

// K-free modularity maximization (community-detection at free K) is NOT used
// in this catalogue. The paper 4 §S-Heff §2'' procedure is K=2 forced
// partition + Q_{K=2} ≥ 0.20 threshold + top-2 cluster size ratio. The
// inheritance audit (kensan_2 P0 finding) rejects free-K community detection
// for the integer-H ladder framework. The K=2 forced partition is computed
// directly via BFS-from-2-seeds + greedy K=2 refinement (see forceK2Partition
// below); no free-K partition is computed.

var countClusterSizes = function (partition) {
  var counts = {};


  Object.keys(partition).forEach(function (k) { counts[partition[k]] = (counts[partition[k]] || 0) + 1; });
  return Object.values(counts).sort(function (a, b) { return b - a; });
};

var computeModularity = function (g, partition, gamma) {
  gamma = gamma || 1.0;
  var m = g.size; if (m === 0) return 0;
  var Q = 0; var k = {};
  g.nodes().forEach(function (n) { k[n] = g.degree(n); });
  var seen = new Set();
  g.nodes().forEach(function (u) {
    g.neighbors(u).forEach(function (v) {
      var key = u < v ? u + ',' + v : v + ',' + u;
      if (seen.has(key)) return; seen.add(key);
      var same = partition[u] === partition[v] ? 1 : 0;
      Q += same - gamma * k[u] * k[v] / (2 * m);
    });
  });
  return Q / m;
};

var clusteringCoefficient = function (g) {
  var total = 0; var nValid = 0;
  // for large graphs sample 1000 nodes for speed
  var nodes = g.nodes();
  if (nodes.length > 2000) {
    nodes = nodes.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 1000);
  }
  nodes.forEach(function (v) {
    var nbrs = g.neighbors(v); var d = nbrs.length;
    if (d < 2) return;
    var tri = 0;
    for (var i = 0; i < nbrs.length; i++) {
      var u = nbrs[i]; var uSet = g.adj.get(u);
      for (var j = i + 1; j < nbrs.length; j++) {
        if (uSet.has(nbrs[j])) tri++;
      }
    }
    total += (2 * tri) / (d * (d - 1));
    nValid++;
  });
  return nValid > 0 ? total / nValid : 0;
};

var coreNumberMax = function (g) {
  var deg = {}; var nodes = g.nodes();
  nodes.forEach(function (n) { deg[n] = g.degree(n); });
  var removed = new Set(); var k = 0;
  while (removed.size < g.order) {
    var minDeg = Infinity;
    nodes.forEach(function (n) { if (!removed.has(n) && deg[n] < minDeg) minDeg = deg[n]; });
    if (minDeg === Infinity) break;
    k = Math.max(k, minDeg);
    var peel = [];
    nodes.forEach(function (n) { if (!removed.has(n) && deg[n] <= k) peel.push(n); });
    if (peel.length === 0) break;
    peel.forEach(function (p) {
      removed.add(p);
      g.neighbors(p).forEach(function (nb) { if (!removed.has(nb)) deg[nb]--; });
    });
  }
  return k;
};

// === 6 sample networks ====================================================
var SAMPLE_NETWORKS = {
  // v1.5 (2026-05-27, ★Paper4_β_predictor_6): sourceKind hard-gate apply per
  // GPT P4polish_076 verdict. Each entry now carries:
  //   sourceKind: 'real-graph' | 'toy-graph'   (no 'panel-tier-a/b' here —
  //     panel rows are in indicators[] and handled by renderDetailPanel only;
  //     they never enter this catalogue)
  //   linkedPanelRowId: 17 (USPTO linked-indicator cross-check) or null (standalone)
  uspto_assignee_2010: {
    label: 'USPTO assignee-level co-inventorship (2010, REAL)',
    sourceKind: 'real-graph',
    linkedPanelRowId: 17,
    badge: 'real graph · linked to row 17 cross-check', badge_class: 'natural',
    file: './data/uspto_assignee_2010.csv', format: 'csv',
    forceK2_H_pair: [2, 3],
    expected_n: 3951, expected_m: 4526,
    domain: 'real USPTO patent assignee co-occurrence (2010 grants)',
    bettencourt_H: 2, bettencourt_branch: '+', bettencourt_beta_obs: 1.298, bettencourt_ci: [1.198, 1.398],
    indicator_text: 'Real USPTO PatentsView assignee-level co-inventorship network (2010 grants, nationwide). Nodes = assignee organizations; edges = same-patent co-listed assignees. Linked to Bettencourt 22-panel row 17 patents indicator as a cross-check only (linked-indicator). Graph-side K detection does NOT independently verify the strict H=2 ladder assignment; the integer H_pair {2, 3} is a structural input from SI Appendix §S-PanelOrigins.',
    disclosure: 'Built from g_patent.tsv (244,599 2010 patents) + g_assignee_disambiguated.tsv. 6,837 multi-assignee patents → 4,526 distinct co-assignee pairs → 3,951 unique assignee organizations. REAL natural-coordination network. Acquired via manual PatentsView S3 download 2026-05-22.'
  },
  ca_grqc: {
    label: 'SNAP ca-GrQc (GR co-authorship)',
    sourceKind: 'real-graph',
    linkedPanelRowId: null,
    badge: 'real graph · standalone (no panel β comparison)', badge_class: 'natural',
    file: './data/ca-GrQc.txt', format: 'snap',
    forceK2_H_pair: [2, 3],
    expected_n: 5242, expected_m: 14496,
    domain: 'physics co-authorship (real, standalone)',
    indicator_text: 'Real General-Relativity arXiv co-authorship network (Stanford SNAP). Graph-side K detection demonstration only — no Bettencourt 22-panel row corresponds to this specific network, so β_obs comparison is not performed (per GPT P4polish_076 verdict: SNAP samples = standalone, no linked-indicator framing).',
    disclosure: 'Standalone graph-side K detection (K=2 forced + Q_{K=2} >= 0.20 threshold per SI Appendix §S-Heff §2′). No panel β_obs comparison.'
  },
  ca_hepth: {
    label: 'SNAP ca-HepTh (HEP-Th co-authorship)',
    sourceKind: 'real-graph',
    linkedPanelRowId: null,
    badge: 'real graph · standalone (no panel β comparison)', badge_class: 'natural',
    file: './data/ca-HepTh.txt', format: 'snap',
    forceK2_H_pair: [2, 3],
    expected_n: 9877, expected_m: 25998,
    domain: 'physics co-authorship (real, standalone)',
    indicator_text: 'Real HEP-Theory arXiv co-authorship network (Stanford SNAP). Standalone graph-side K detection demonstration; no Bettencourt 22-panel row mapping.',
    disclosure: 'Standalone graph-side K detection (K=2 forced + Q_{K=2} >= 0.20 threshold per SI Appendix §S-Heff §2′). No panel β_obs comparison.'
  },
  ca_condmat: {
    label: 'SNAP ca-CondMat (CondMat co-authorship)',
    sourceKind: 'real-graph',
    linkedPanelRowId: null,
    badge: 'real graph · standalone (no panel β comparison)', badge_class: 'natural',
    file: './data/ca-CondMat.txt', format: 'snap',
    forceK2_H_pair: [2, 3],
    expected_n: 23133, expected_m: 93497,
    domain: 'physics co-authorship (real large, standalone)',
    indicator_text: 'Real Condensed-Matter arXiv co-authorship network (Stanford SNAP, large 23K nodes, subsampled to 4000 for browser-side analysis). Standalone graph-side K detection demonstration; no Bettencourt 22-panel row mapping.',
    disclosure: 'Standalone graph-side K detection on subsampled network (large graph). No panel β_obs comparison.'
  }};

var _currentSampleKey = 'uspto_assignee_2010';

// === parse edgelist =====================================================
function parseCsvLine(line) {
  // v0.26 (2026-05-25): RFC4180-style CSV parser — handles "field, with, commas"
  // and embedded "" escapes. Fixes Chotaro Engineering, Co. / RICOH COMPANY, LTD.
  // and 2315 similarly-named USPTO assignees that have commas inside their names.
  var fields = [];
  var cur = '';
  var inQ = false;
  for (var i = 0; i < line.length; i++) {
    var c = line.charAt(i);
    if (inQ) {
      if (c === '"') {
        if (line.charAt(i + 1) === '"') { cur += '"'; i++; continue; }
        inQ = false; continue;
      }
      cur += c;
    } else {
      if (c === ',') { fields.push(cur); cur = ''; continue; }
      if (c === '"' && cur === '') { inQ = true; continue; }
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

function parseEdgelist(text, format) {
  var lines = text.split(/\r?\n/);
  var edges = [];
  if (format === 'csv') {
    for (var i = 1; i < lines.length; i++) {
      var line = lines[i]; if (!line || !line.trim()) continue;
      var parts = parseCsvLine(line);
      if (parts.length >= 2) edges.push([parts[0].trim(), parts[1].trim()]);
    }
  } else {
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line || line.charAt(0) === '#') continue;
      var parts = line.split(/\s+/);
      if (parts.length >= 2) edges.push([parts[0], parts[1]]);
    }
  }
  return edges;
}

function buildGraphFromEdges(edges, maxNodes) {
  var g = new UGraph();
  if (maxNodes && maxNodes > 0) {
    // subsample: keep first maxNodes unique nodes encountered, drop edges to dropped nodes
    var keep = new Set(); var kept_edges = [];
    for (var i = 0; i < edges.length; i++) {
      var e = edges[i];
      if (!keep.has(e[0]) && keep.size < maxNodes) keep.add(e[0]);
      if (!keep.has(e[1]) && keep.size < maxNodes) keep.add(e[1]);
      if (keep.has(e[0]) && keep.has(e[1]) && e[0] !== e[1]) kept_edges.push(e);
    }
    kept_edges.forEach(function (e) { g.addEdge(e[0], e[1]); });
    return g;
  }
  for (var i = 0; i < edges.length; i++) {
    var e = edges[i];
    if (e[0] !== e[1]) g.addEdge(e[0], e[1]);
  }
  return g;
}

// === helpers ============================================================
function ladderBetaForH(H, branch) {
  var x = 1 / (H * Math.log(2 * H + 1));
  return branch === 'minus' ? 1 - x : 1 + x;
}

function concreteReadingText(beta, branch) {
  var factor = Math.pow(10, beta);
  var s = beta > 1.0 ? 'superlinear (grows faster than population, e.g. patents, wages, GDP)'
        : beta < 1.0 ? 'sublinear (grows slower than population, e.g. road length, gasoline)'
        : 'linear (proportional to population)';
  return 'If City B has 10× the population of City A, the indicator counted on this network is approximately 10<sup>' +
         beta.toFixed(4) + '</sup> ≈ ' + factor.toFixed(2) + '× in City B vs City A. This is <em>' + s + '</em>.';
}

function escapeHtmlSafe(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// === SVG mini network visualization =====================================
function renderSvgNetwork(g, partition, w, h) {
  w = w || 480; h = h || 320;
  var nodes = g.nodes();
  if (nodes.length > 400) {
    var sample = nodes.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 400);
    var sset = new Set(sample); nodes = sample;
    var subg = new UGraph();
    sample.forEach(function (u) { subg.addNode(u); });
    sample.forEach(function (u) {
      g.neighbors(u).forEach(function (v) { if (sset.has(v)) subg.addEdge(u, v); });
    });
    g = subg;
  }
  var localPart = {};
  nodes.forEach(function (n) { localPart[n] = partition[n] || 0; });
  var uniqueClusters = Array.from(new Set(nodes.map(function (n) { return localPart[n]; })));
  uniqueClusters.sort(function (a, b) {
    var sa = nodes.filter(function (n) { return localPart[n] === a; }).length;
    var sb = nodes.filter(function (n) { return localPart[n] === b; }).length;
    return sb - sa;
  });
  var palette = ['#2c4a6b', '#1f6f5c', '#c8a04a', '#875a3c', '#6a4a8b',
                 '#a0444a', '#5a7080', '#8d9b3d', '#c47a4c', '#48798f'];
  var colorMap = {};
  uniqueClusters.forEach(function (c, i) { colorMap[c] = palette[i % palette.length]; });
  var cx = w / 2; var cy = h / 2; var pos = {};
  uniqueClusters.forEach(function (c, ci) {
    var members = nodes.filter(function (n) { return localPart[n] === c; });
    var ringAngle = ci * 2 * Math.PI / Math.max(1, uniqueClusters.length);
    var rx = cx + Math.cos(ringAngle) * (Math.min(w, h) / 4);
    var ry = cy + Math.sin(ringAngle) * (Math.min(w, h) / 4);
    members.forEach(function (m, mi) {
      var angle = (mi / Math.max(1, members.length)) * 2 * Math.PI;
      var r = 10 + Math.sqrt(members.length) * 2.5;
      pos[m] = { x: rx + Math.cos(angle) * r, y: ry + Math.sin(angle) * r };
    });
  });
  var lines = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="100%" style="max-width:520px; background:#fafaf5; border:1px solid #d8d2c0; border-radius:6px;">'];
  var seen = new Set();
  nodes.forEach(function (u) {
    g.neighbors(u).forEach(function (v) {
      var key = u < v ? u + ',' + v : v + ',' + u;
      if (seen.has(key)) return; seen.add(key);
      var pu = pos[u]; var pv = pos[v]; if (!pu || !pv) return;
      lines.push('<line x1="' + pu.x.toFixed(1) + '" y1="' + pu.y.toFixed(1) + '" x2="' + pv.x.toFixed(1) + '" y2="' + pv.y.toFixed(1) + '" stroke="#ccc" stroke-width="0.3" opacity="0.4"/>');
    });
  });
  nodes.forEach(function (n) {
    var p = pos[n]; if (!p) return;
    var c = colorMap[localPart[n]] || '#888';
    lines.push('<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="2" fill="' + c + '"/>');
  });
  lines.push('</svg>');
  return lines.join('');
}

// === preview textarea (ALL edges + click→selectAll + tab-aligned TSV) ===
function renderEdgelistPreview(edges, total, sampleKey) {
  // Show ALL edges (= up to ~200K rows、 textarea handles fine、 perf ~1-2s render for 100K+)
  // v0.29 (2026-05-25): emit data-sample-key so CSS can per-sample-size the textarea
  // (USPTO default 100%, others default 50%) per 著者 directive.
  var tsvHeader = 'from\tto\n';
  var tsvRows = edges.map(function (e) {
    return e[0] + '\t' + e[1];
  }).join('\n');
  var content = tsvHeader + tsvRows;
  var keyAttr = sampleKey ? ' data-sample-key="' + sampleKey + '"' : '';
  return '<div class="net-preview"' + keyAttr + '>' +
    '<h4>Network preview (edgelist, read-only)</h4>' +
    '<textarea class="preview-textarea" readonly rows="20" wrap="off"' + keyAttr + ' ' +
    'onclick="this.select();" ' +
    'title="Click to select all (paste into Excel → A/B columns auto)">' +
    escapeHtmlSafe(content) +
    '</textarea>' +
    '<p class="preview-meta">Showing all ' + edges.length + ' edges (tab-separated, paste-ready). Click to select all.</p>' +
  '</div>';
}

// === sample networks grid ===============================================
function renderSampleGrid(selectedKey) {
  // v1.6 (2026-05-27 wave2, ★Paper4_β_predictor_6): toy_balanced_2block /
  // toy_82_split removed per 著者 directive 「Toy graphs は必要？ ダミー
  // グラフだよね、 削除」 → flat 4-button horizontal layout, sample-group
  // structure removed.
  var keys = ['uspto_assignee_2010', 'ca_grqc', 'ca_hepth', 'ca_condmat'];
  return keys.map(function (key) {
    var s = SAMPLE_NETWORKS[key];
    var cls = 'sample-btn ' + s.badge_class + (key === selectedKey ? ' selected' : '');
    return '<button class="' + cls + '" data-sample="' + key + '" type="button">' +
      '<span class="s-label">' + escapeHtmlSafe(s.label) + '</span>' +
      '<span class="s-badge">' + escapeHtmlSafe(s.badge) + '</span>' +
    '</button>';
  }).join('');
}

// === selected display ===================================================
function renderSelectedDisplay(sampleKey) {
  var s = SAMPLE_NETWORKS[sampleKey];
  return '<div class="net-selected">' +
    '<span class="sel-tag">Selected input:</span> ' +
    '<strong>' + escapeHtmlSafe(s.label) + '</strong> ' +
    '<span class="sel-badge ' + s.badge_class + '">' + escapeHtmlSafe(s.badge) + '</span>' +
    '<span class="sel-meta"> · ' + s.expected_n + ' nodes · ' + s.expected_m + ' edges · ' + escapeHtmlSafe(s.domain) + '</span>' +
  '</div>';
}

// === run results render =================================================
var renderK2Schematic = function (sizes, kDetected, qK2, qThreshold, hPairUsed, hUseK1, w, h) {
  // SVG: only the circles + a big red "K=N" label at the bottom center.
  // The explanatory caption is rendered as a separate HTML block below the SVG
  // (= via renderK2SchematicCaption), so this SVG is purely visual.
  // 2026-05-27: shortened vertical (h 320 → 200) so K=N label sits closer to circles.
  w = w || 480; h = h || 200;
  var s0 = (sizes && sizes[0]) || 0;
  var s1 = (sizes && sizes[1]) || 0;
  var total = s0 + s1;
  var cy = h * 0.40;
  // K=2 branch radius scale (×2/3 per author directive — circles smaller, centers same)
  var maxR = Math.min(w * 0.20, h * 0.34) * (2/3);
  var minR = 30 * (2/3);
  var svg = '<svg width="100%" viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg">';
  svg += '<rect x="0" y="0" width="' + w + '" height="' + h + '" fill="#fafbfc" stroke="#ddd" stroke-width="1"/>';
  if (kDetected === 1) {
    // K=1: one consolidated grey circle
    // diameter ×2/3 per author directive
    var rTotal = Math.min(w * 0.24, h * 0.36) * (2/3);
    var cxC = w / 2;
    svg += '<circle cx="' + cxC + '" cy="' + cy + '" r="' + rTotal + '" ' +
           'fill="#7a8a99" fill-opacity="0.78" stroke="#3a4a59" stroke-width="2"/>';
    svg += '<text x="' + cxC + '" y="' + (cy - 4) + '" text-anchor="middle" dominant-baseline="middle" ' +
           'fill="#fff" font-size="' + Math.min(rTotal * 0.38, 26) + '" font-weight="700">' + total + '</text>';
    svg += '<text x="' + cxC + '" y="' + (cy + rTotal * 0.32) + '" text-anchor="middle" dominant-baseline="middle" ' +
           'fill="#fff" font-size="' + Math.min(rTotal * 0.20, 13) + '" font-style="italic">nodes</text>';
  } else {
    // K=2: two circles sized proportional to top-2 cluster sizes
    var ratio0 = total > 0 ? s0 / total : 0.5;
    var ratio1 = total > 0 ? s1 / total : 0.5;
    var sq0 = Math.sqrt(ratio0);
    var sq1 = Math.sqrt(ratio1);
    var maxSq = Math.max(sq0, sq1);
    var r0 = Math.max(minR, (sq0 / maxSq) * maxR);
    var r1 = Math.max(minR, (sq1 / maxSq) * maxR);
    var cx0 = w * 0.32;
    var cx1 = w * 0.68;
    for (var i = -2; i <= 2; i++) {
      var yOff = i * 7;
      svg += '<path d="M ' + (cx0 + r0) + ' ' + (cy + yOff) +
             ' Q ' + (w / 2) + ' ' + (cy + yOff * 1.3) + ' ' +
             (cx1 - r1) + ' ' + (cy + yOff) + '" ' +
             'stroke="#bbb" stroke-width="0.7" fill="none" opacity="0.55"/>';
    }
    svg += '<circle cx="' + cx0 + '" cy="' + cy + '" r="' + r0 + '" ' +
           'fill="#1f6f5c" fill-opacity="0.78" stroke="#155745" stroke-width="2"/>';
    svg += '<text x="' + cx0 + '" y="' + (cy - 4) + '" text-anchor="middle" dominant-baseline="middle" ' +
           'fill="#fff" font-size="' + Math.min(r0 * 0.42, 22) + '" font-weight="700">' + s0 + '</text>';
    svg += '<text x="' + cx0 + '" y="' + (cy + Math.max(r0 * 0.35, 13)) + '" text-anchor="middle" dominant-baseline="middle" ' +
           'fill="#fff" font-size="' + Math.min(r0 * 0.22, 11) + '" font-style="italic">nodes</text>';
    svg += '<circle cx="' + cx1 + '" cy="' + cy + '" r="' + r1 + '" ' +
           'fill="#2c4a6b" fill-opacity="0.78" stroke="#1a3045" stroke-width="2"/>';
    svg += '<text x="' + cx1 + '" y="' + (cy - 4) + '" text-anchor="middle" dominant-baseline="middle" ' +
           'fill="#fff" font-size="' + Math.min(r1 * 0.42, 22) + '" font-weight="700">' + s1 + '</text>';
    svg += '<text x="' + cx1 + '" y="' + (cy + Math.max(r1 * 0.35, 13)) + '" text-anchor="middle" dominant-baseline="middle" ' +
           'fill="#fff" font-size="' + Math.min(r1 * 0.22, 11) + '" font-style="italic">nodes</text>';
    svg += '<text x="' + cx0 + '" y="' + (cy - r0 - 8) + '" text-anchor="middle" font-size="11" fill="#155745" font-weight="600">cluster A (π<tspan baseline-shift="sub">low</tspan>)</text>';
    svg += '<text x="' + cx1 + '" y="' + (cy - r1 - 8) + '" text-anchor="middle" font-size="11" fill="#1a3045" font-weight="600">cluster B (π<tspan baseline-shift="sub">up</tspan>)</text>';
  }
  // Centered "K=N" big red label at bottom (closer to circles after height shorten)
  var labelY = h - 18;
  var label = 'K=' + kDetected;
  svg += '<text x="' + (w / 2) + '" y="' + labelY + '" text-anchor="middle" font-size="34" font-weight="800" fill="#c0392b" letter-spacing="0.04em">' + label + '</text>';
  svg += '</svg>';
  return svg;
};

// HTML caption block rendered below the SVG (= clear explanation, separate from the figure).
var renderK2SchematicCaption = function (sizes, kDetected, qK2, qThreshold, hPairUsed, hUseK1, branchSign, nNodes, mEdges) {
  var s0 = (sizes && sizes[0]) || 0;
  var s1 = (sizes && sizes[1]) || 0;
  var total = s0 + s1;
  var passOrFail = (qK2 >= qThreshold) ? 'passes' : 'fails';
  var checkSym = (qK2 >= qThreshold) ? '✓' : '✗';
  var thr = qThreshold.toFixed(2);
  var qStr = qK2.toFixed(3);
  // π values from cluster size ratios
  var piLow = total > 0 ? s0 / total : 0;
  var piUp  = total > 0 ? s1 / total : 0;
  // Step 0 primer: edge ≠ node, with actual counts + average degree (= 2m/n for undirected simple graph)
  var step0Html = '';
  if (nNodes !== undefined && mEdges !== undefined && nNodes > 0) {
    var avgDeg = (2 * mEdges / nNodes);
    step0Html = '<p class="k2-schem-line"><span class="k2-step">0.</span> <strong>Edges are not nodes.</strong> ' +
                'This network has <strong>' + nNodes + ' nodes</strong> and <strong>' + mEdges + ' edges</strong> ' +
                '(= each node is connected on average to ' + avgDeg.toFixed(1) + ' edges; ' +
                'avg degree = 2m/n for an undirected simple graph). ' +
                '<em>The circles below count <strong>nodes</strong>, not edges — they show how the ' + nNodes + ' nodes split across clusters.</em></p>';
  }
  var c = '<div class="k2-schem-caption">';
  if (kDetected === 1) {
    c += '<p class="k2-schem-line1"><strong>【K=1 (structural support only)】</strong></p>';
    c += step0Html;
    c += '<p class="k2-schem-line"><span class="k2-step">1.</span> We hypothesised K=2 and forced a 2-cluster partition. ' +
         'Modularity at that K=2 partition is <strong>Q<sub>K=2</sub> = ' + qStr + '</strong> ' +
         '<em>(Q<sub>K=2</sub> measures how cleanly the graph splits into 2 clusters by edge density; ~0 = no structure, ~1 = perfectly modular).</em></p>';
    c += '<p class="k2-schem-line"><span class="k2-step">2.</span> Threshold is <strong>≥ ' + thr + '</strong> (pre-registered in SI Appendix §S-Heff §2&prime;). ' +
         '<strong>' + qStr + ' ' + checkSym + ' ' + passOrFail + '</strong> the threshold, so the K=2 hypothesis is rejected.</p>';
    c += '<p class="k2-schem-line"><span class="k2-step">3.</span> We <strong>redraw as 1 circle</strong> (= K=1 single ladder support). Apply ladder formula at single integer H = ' + (hUseK1 !== undefined ? hUseK1 : 'H<sub>use</sub>') + ' to obtain β<sub>df</sub>.</p>';
  } else {
    var H_low = (hPairUsed && hPairUsed.length >= 2) ? hPairUsed[0] : 2;
    var H_up  = (hPairUsed && hPairUsed.length >= 2) ? hPairUsed[1] : 3;
    var H_eff = piLow * H_low + piUp * H_up;
    // β_df = 1 ± 1 / [H_eff × ln(2 × H_eff + 1)]
    var epsH = 1.0 / (H_eff * Math.log(2 * H_eff + 1));
    var sgnNum = (branchSign === 'minus' || branchSign === '-') ? -1 : 1;
    var beta_df = 1 + sgnNum * epsH;
    var sgnTxt = (sgnNum === 1) ? '+' : '−';
    c += '<p class="k2-schem-line1"><strong>【K=2 (active support, structurally validated)】</strong></p>';
    c += step0Html;
    c += '<p class="k2-schem-line"><span class="k2-step">1.</span> Count the circles: <strong>2 circles</strong> drawn from the K=2 forced partition. ' +
         'Cluster sizes [' + s0 + ', ' + s1 + '] give the mixing weights <strong>π<sub>low</sub> = ' + s0 + '/' + total + ' = ' + piLow.toFixed(3) + '</strong>, <strong>π<sub>up</sub> = ' + s1 + '/' + total + ' = ' + piUp.toFixed(3) + '</strong> ' +
         '<em>(circle area ratio directly maps to π ratio).</em></p>';
    c += '<p class="k2-schem-line"><span class="k2-step">2.</span> Modularity at this K=2 partition is <strong>Q<sub>K=2</sub> = ' + qStr + '</strong> ' +
         '<em>(Q<sub>K=2</sub> measures how cleanly the graph splits into 2 clusters by edge density; ~0 = no structure, ~1 = perfectly modular).</em></p>';
    c += '<p class="k2-schem-line"><span class="k2-step">3.</span> Threshold is <strong>≥ ' + thr + '</strong> (pre-registered in SI Appendix §S-Heff §2&prime;). ' +
         '<strong>' + qStr + ' ' + checkSym + ' ' + passOrFail + '</strong> the threshold, so K=2 is structurally supported.</p>';
    c += '<p class="k2-schem-line"><span class="k2-step">4.</span> Mix on H<sub>pair</sub> = {' + H_low + ', ' + H_up + '} to get the effective ladder coordinate: <br>' +
         '<span class="k2-formula">H<sub>eff</sub> = π<sub>low</sub> × ' + H_low + ' + π<sub>up</sub> × ' + H_up + ' = ' + piLow.toFixed(3) + ' × ' + H_low + ' + ' + piUp.toFixed(3) + ' × ' + H_up + ' = <strong>' + H_eff.toFixed(3) + '</strong></span></p>';
    c += '<p class="k2-schem-line"><span class="k2-step">5.</span> Apply the ladder formula at H<sub>eff</sub>: <br>' +
         '<span class="k2-formula">β<sub>df</sub> = 1 ' + sgnTxt + ' 1 / [H<sub>eff</sub> × ln(2·H<sub>eff</sub> + 1)] = 1 ' + sgnTxt + ' 1 / [' + H_eff.toFixed(3) + ' × ln(' + (2 * H_eff + 1).toFixed(3) + ')] = <strong>' + beta_df.toFixed(4) + '</strong></span></p>';
  }
  c += '</div>';
  return c;
};

function renderLiveNetworkResults(sampleKey, edges, g) {
  // v1.5 (2026-05-27, ★Paper4_β_predictor_6): sourceKind hard-gate apply per
  // GPT P4polish_076 verdict.
  //   real-graph + linkedPanelRowId !== null (= USPTO 2010 → linked to row 17):
  //     4 verdict layer split (Topology K=1/K=2 / β compatibility with linked
  //     panel row CI / Strict-H corroboration / wording note avoiding
  //     "verifies strict H=2").
  //   real-graph + linkedPanelRowId === null (= SNAP samples): standalone
  //     graph-side K detection only, no panel β comparison.
  //   toy-graph: Path B demo only, no panel β comparison, explicit "not
  //     panel evidence" framing.
  //   (panel-tier-a / panel-tier-b are in indicators[] and handled by
  //    renderDetailPanel; renderLiveNetworkResults is never called for them.)
  var s = SAMPLE_NETWORKS[sampleKey];
  var sourceKind = s.sourceKind || 'unknown';

  // Shared graph metrics (used by all branches)
  var partK2 = forceK2Partition(g);
  var sizesK2 = countClusterSizes(partK2);
  var sK2_0 = sizesK2[0] || g.order;
  var sK2_1 = sizesK2[1] || 0;
  var totK2 = sK2_0 + sK2_1;
  var piLow_K2 = totK2 > 0 ? sK2_0 / totK2 : 1.0;
  var piUp_K2  = totK2 > 0 ? sK2_1 / totK2 : 0.0;
  var H_pair_used = s.forceK2_H_pair || [2, 3];
  var H_eff_K2 = piLow_K2 * H_pair_used[0] + piUp_K2 * H_pair_used[1];
  var branchSign = (s.bettencourt_branch === '-') ? 'minus' : 'plus';
  var beta_pred_K2 = ladderBetaForH(H_eff_K2, branchSign);
  var Q_K2 = computeModularity(g, partK2, 1.0);
  var Q_THRESHOLD = 0.20;
  var K_detected = (Q_K2 >= Q_THRESHOLD) ? 2 : 1;
  var H_use_K1 = (s.bettencourt_H !== undefined) ? s.bettencourt_H : H_pair_used[0];
  var beta_K1_use = ladderBetaForH(H_use_K1, branchSign);
  var beta_df = (K_detected === 2) ? beta_pred_K2 : beta_K1_use;
  var H_label_final = (K_detected === 2)
    ? ('H<sub>eff</sub> = ' + H_eff_K2.toFixed(3) + ' (= ' +
       piLow_K2.toFixed(3) + '·' + H_pair_used[0] + ' + ' +
       piUp_K2.toFixed(3) + '·' + H_pair_used[1] + ')')
    : ('H = ' + H_use_K1);
  var C = clusteringCoefficient(g);
  var kcore = coreNumberMax(g);
  var svg = renderK2Schematic(sizesK2, K_detected, Q_K2, Q_THRESHOLD, H_pair_used, H_use_K1, 480, 200);
  var schemCaption = renderK2SchematicCaption(sizesK2, K_detected, Q_K2, Q_THRESHOLD, H_pair_used, H_use_K1, branchSign, g.order, g.size);

  var primaryHtml = '';
  var verdictHtml = '';

  if (sourceKind === 'real-graph' && s.linkedPanelRowId === 17) {
    // === USPTO 2010 — linked-indicator cross-check vs row 17 ===
    var topologyVerdict = (K_detected === 2)
      ? 'K=2 active support (graph-shape, Q<sub>K=2</sub> = ' + Q_K2.toFixed(3) + ' ≥ 0.20)'
      : 'K=1 space (graph-shape, Q<sub>K=2</sub> = ' + Q_K2.toFixed(3) + ' < 0.20)';
    var ci = s.bettencourt_ci;
    var betaCompat = (ci && beta_df >= ci[0] && beta_df <= ci[1])
      ? '✓ β<sub>df</sub> = ' + beta_df.toFixed(4) + ' ∈ row 17 CI [' + ci[0].toFixed(3) + ', ' + ci[1].toFixed(3) + ']'
      : '✗ β<sub>df</sub> = ' + beta_df.toFixed(4) + ' ∉ row 17 CI [' + ci[0].toFixed(3) + ', ' + ci[1].toFixed(3) + ']';
    var strictHVerdict;
    if (K_detected === 1) {
      strictHVerdict = '✓ Graph topology corroborates the Tier A single-ladder H=' + H_use_K1 +
                       ' assignment (K=1 single-rung structural support).';
    } else {
      strictHVerdict = '⚠ <strong>NOT</strong> a strict-H verification. Graph-side K=2 detection yields a mixed-support result (H<sub>eff</sub> = ' +
                       H_eff_K2.toFixed(3) + ' ≠ ' + H_use_K1 + '). β<sub>df</sub> may be β-level compatible with the row 17 CI, but this is NOT an independent verification of the strict H=' + H_use_K1 + ' integer ladder.';
    }
    primaryHtml =
      '<div class="primary-result real-linked"><h4>Primary result — Real-graph cross-check (linked to panel row 17)</h4>' +
      '<p class="result-line"><strong>Selected input:</strong> ' + escapeHtmlSafe(s.label) +
      ' (' + g.order + ' nodes, ' + g.size + ' edges)</p>' +
      '<p><strong>Indicator:</strong> ' + escapeHtmlSafe(s.indicator_text) + '</p>' +
      '<p class="diff-row17-note"><strong>Difference from panel row 17 (β<sub>obs</sub> source):</strong> Shared USPTO root corpus, two different projections. Row 17 (β<sub>obs</sub> = 1.298) = Bettencourt 2007 city-level scaling (patent counts vs MSA population). This panel (graph-side) = USPTO 2010 assignee co-applicant graph topology → K detection. The K detection procedure does not consult β<sub>obs</sub> (procedural Stage A non-circularity).</p>' +
      '</div>';
    verdictHtml =
      '<div class="verdict-layer-split">' +
        '<h5 class="verdict-layer-title">4 verdict layer split (honest framing per GPT P4polish_076)</h5>' +
        '<table class="verdict-layer-table">' +
          '<tr><td class="vl-key">Topology verdict</td><td class="vl-val">' + topologyVerdict + '</td></tr>' +
          '<tr><td class="vl-key">β-level CI compatibility (vs row 17)</td><td class="vl-val">' + betaCompat + '</td></tr>' +
          '<tr><td class="vl-key">Strict-H corroboration</td><td class="vl-val">' + strictHVerdict + '</td></tr>' +
          '<tr><td class="vl-key">Wording note</td><td class="vl-val"><em>This panel does <strong>NOT</strong> claim "independently verifies strict H=' + H_use_K1 + '". β<sub>df</sub> compatibility ≠ strict-H topology verification. H<sub>pair</sub> = {' + H_pair_used[0] + ', ' + H_pair_used[1] + '} is a structural input from SI Appendix §S-PanelOrigins, not derived from the graph.</em></td></tr>' +
        '</table>' +
      '</div>';

  } else if (sourceKind === 'real-graph') {
    // === SNAP — standalone graph-side K detection (no panel β comparison) ===
    primaryHtml =
      '<div class="primary-result real-standalone"><h4>Primary result — Standalone graph-side K detection (no panel β comparison)</h4>' +
      '<p class="result-line"><strong>Selected input:</strong> ' + escapeHtmlSafe(s.label) +
      ' (' + g.order + ' nodes, ' + g.size + ' edges)</p>' +
      '<p><strong>Indicator:</strong> ' + escapeHtmlSafe(s.indicator_text) + '</p>' +
      '<p class="standalone-note"><em>This network does NOT map to any Bettencourt 22-panel row. Graph topology measurement only; no β<sub>obs</sub> comparison is performed (per GPT P4polish_076 verdict: SNAP samples = standalone, no linked-indicator cross-check).</em></p>' +
      '</div>';
    verdictHtml =
      '<div class="verdict-layer-split standalone">' +
        '<h5 class="verdict-layer-title">Graph topology measurement</h5>' +
        '<table class="verdict-layer-table">' +
          '<tr><td class="vl-key">Topology verdict</td><td class="vl-val">' +
            ((K_detected === 2)
              ? 'K=2 active support (Q<sub>K=2</sub> = ' + Q_K2.toFixed(3) + ' ≥ 0.20)'
              : 'K=1 space (Q<sub>K=2</sub> = ' + Q_K2.toFixed(3) + ' < 0.20)') +
            '</td></tr>' +
          '<tr><td class="vl-key">Diagnostic β<sub>df</sub> reference</td><td class="vl-val">β<sub>df</sub> at ' + H_label_final + ' = ' + beta_df.toFixed(4) + ' <em>(reference value computed under the default H<sub>pair</sub> = {' + H_pair_used[0] + ', ' + H_pair_used[1] + '} shallow-coordination assumption; not compared to any panel β<sub>obs</sub>)</em></td></tr>' +
        '</table>' +
      '</div>';

  } else if (sourceKind === 'toy-graph') {
    // === Toy graph — Path B demo, no panel evidence ===
    primaryHtml =
      '<div class="primary-result toy-graph"><h4>Primary result — Toy-graph K-detection demo (illustration only)</h4>' +
      '<p class="result-line"><strong>Selected input:</strong> ' + escapeHtmlSafe(s.label) +
      ' (' + g.order + ' nodes, ' + g.size + ' edges)</p>' +
      '<p><strong>Indicator:</strong> ' + escapeHtmlSafe(s.indicator_text) + '</p>' +
      '<p class="toy-graph-note"><strong>⚠ Pedagogical demo only.</strong> This is a synthetic toy graph constructed for K-detection illustration purposes. It is <strong>NOT</strong> panel evidence; the K verdict here reflects the generator construction, not any Bettencourt 22-panel row. No β<sub>obs</sub> comparison is performed (per GPT P4polish_076 verdict: synthetic graphs are not paper-side evidence).</p>' +
      '</div>';
    verdictHtml =
      '<div class="verdict-layer-split toy">' +
        '<h5 class="verdict-layer-title">Toy-graph K-detection (illustration only)</h5>' +
        '<table class="verdict-layer-table">' +
          '<tr><td class="vl-key">Topology verdict</td><td class="vl-val">' +
            ((K_detected === 2)
              ? 'K=2 forced partition, Q<sub>K=2</sub> = ' + Q_K2.toFixed(3) + ' ≥ 0.20 (mechanically passes by generator construction)'
              : 'K=1 (Q<sub>K=2</sub> = ' + Q_K2.toFixed(3) + ' < 0.20)') +
            '</td></tr>' +
          '<tr><td class="vl-key">Diagnostic β<sub>df</sub> (illustration only)</td><td class="vl-val">β<sub>df</sub> at ' + H_label_final + ' = ' + beta_df.toFixed(4) + ' <em>(NOT compared to any panel β<sub>obs</sub>; this is a generator artifact, not paper-side evidence)</em></td></tr>' +
        '</table>' +
      '</div>';

  } else {
    primaryHtml =
      '<div class="primary-result"><h4>Live Network result</h4>' +
      '<p>Unsupported sourceKind: ' + escapeHtmlSafe(sourceKind) + '</p>' +
      '</div>';
  }

  // === Shared diagnostic block (schematic + verdict + metrics) ===
  var diagFlat = '<div class="diagnostic-flat">' +
    '<h4>K-detection diagnostic (graph-side, K=2 forced partition + Q<sub>K=2</sub> ≥ 0.20 threshold per SI Appendix §S-Heff §2′)</h4>' +
    verdictHtml +
    '<div class="net-graph">' + svg + '</div>' +
    schemCaption +
    '<div class="net-metrics">' +
      '<span class="m-box"><span class="m-l">n</span><span class="m-v">' + g.order + '</span></span>' +
      '<span class="m-box"><span class="m-l">m</span><span class="m-v">' + g.size + '</span></span>' +
      '<span class="m-box"><span class="m-l">top-2 sizes (K=2 forced)</span><span class="m-v">[' + sizesK2.slice(0, 2).join(', ') + ']</span></span>' +
      '<span class="m-box"><span class="m-l">π<sub>lo</sub></span><span class="m-v">' + piLow_K2.toFixed(3) + '</span></span>' +
      '<span class="m-box"><span class="m-l">Q<sub>K=2</sub></span><span class="m-v">' + Q_K2.toFixed(3) + '</span></span>' +
      '<span class="m-box"><span class="m-l">C clustering</span><span class="m-v">' + C.toFixed(3) + '</span></span>' +
      '<span class="m-box"><span class="m-l">d<sub>core</sub> max</span><span class="m-v">' + kcore + '</span></span>' +
    '</div>' +
    '<p class="diag-disclosure"><em>' + escapeHtmlSafe(s.disclosure) + '</em></p></div>';

  return primaryHtml + diagFlat;
}

// === fetch + analyze ====================================================
function loadPreview(sampleKey) {
  var s = SAMPLE_NETWORKS[sampleKey];
  var target = document.getElementById('net-preview-target');
  if (!target) return;
  if (!s || !s.file) {
    target.innerHTML = '<div class="warning-box">Network not yet acquired. Multi-session bulk DL pending.</div>';
    return;
  }
  target.innerHTML = '<div class="loading-spin">Loading preview…</div>';
  fetch(s.file).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.text();
  }).then(function (text) {
    var edges = parseEdgelist(text, s.format);
    target.innerHTML = renderEdgelistPreview(edges, edges.length, sampleKey);
  }).catch(function (e) {
    target.innerHTML = '<div class="warning-box">Preview load error: ' + escapeHtmlSafe(e.message || String(e)) + '</div>';
  });
}

function loadAndAnalyze(sampleKey) {
  var s = SAMPLE_NETWORKS[sampleKey];
  var target = document.getElementById('net-results-target');
  if (!target) return;
  if (!s || !s.file) {
    target.innerHTML = '<div class="warning-box">USPTO assignee-level co-inventorship bulk download pending (~1.3 GB, multi-session). Not available in this version.</div>';
    return;
  }
  target.innerHTML = '<div class="loading-spin">Fetching ' + escapeHtmlSafe(s.file) + ' and running graph-shape cluster analysis…</div>';
  fetch(s.file).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.text();
  }).then(function (text) {
    setTimeout(function () {
      try {
        var edges = parseEdgelist(text, s.format);
        // For very large graphs (>15K nodes by edge count proxy), subsample
        var maxNodes = null;
        if (edges.length > 30000) maxNodes = 4000;
        var g = buildGraphFromEdges(edges, maxNodes);
        target.innerHTML = renderLiveNetworkResults(sampleKey, edges, g);
      } catch (e) {
        target.innerHTML = '<div class="warning-box">Analysis error: ' + escapeHtmlSafe(e.message || String(e)) + '</div>';
        console.error('Analyze error:', e);
      }
    }, 30);
  }).catch(function (e) {
    target.innerHTML = '<div class="warning-box">Fetch error: ' + escapeHtmlSafe(e.message || String(e)) + '</div>';
  });
}

function switchSample(sampleKey) {
  // v0.12.0: uspto_assignee_2010 now real-data enabled
  // v0.20.1: ensure Live Network section visible whenever a sample is switched
  // v0.21: removed unconditional scrollIntoView (= callers handle scroll: catalogue click → btn top, sample btn → live section)
  var _liveSec_show = document.getElementById('live-network-section');
  if (_liveSec_show) _liveSec_show.classList.remove('hidden');
  _currentSampleKey = sampleKey;
  // v0.10.0: SNAP/USPTO is NOT a Bettencourt 22-panel row.
  // Clear the catalogue detail panel so "Selected row N — ..." doesn't mislead.
  // For row17/row22, the catalogue detail panel keeps its content (it WAS triggered
  // by the catalogue button click, which already populated detail-panel).
  // v1.5 (2026-05-27, ★Paper4_β_predictor_6): sourceKind-aware sample-mode
  // message. Any sample click (real-graph or toy-graph) clears the catalogue
  // detail panel and writes a sourceKind-specific message; row17/row22
  // special-case removed (those keys no longer exist — renamed to
  // toy_balanced_2block / toy_82_split).
  var s_for_msg = SAMPLE_NETWORKS[sampleKey];
  var det = document.getElementById('detail-panel');
  if (det && s_for_msg) {
    det.dataset.sampleMode = 'true';
    var msgHtml;
    if (s_for_msg.sourceKind === 'real-graph' && s_for_msg.linkedPanelRowId === 17) {
      msgHtml = '<p class="sample-mode-msg">' +
        '<strong>Real network selected (linked to panel row 17 cross-check).</strong> ' +
        'Graph topology is measured via K=2 forced partition + Q<sub>K=2</sub> ≥ 0.20 threshold. ' +
        '<em>β<sub>df</sub></em> is computed under the SI Appendix §S-PanelOrigins H<sub>pair</sub> input and reported in the 4-layer verdict ' +
        '(Topology / β-level CI compat vs row 17 / Strict-H corroboration / wording note) ' +
        'in the Live Network Analysis section below &darr;.' +
        '</p>';
    } else if (s_for_msg.sourceKind === 'real-graph') {
      msgHtml = '<p class="sample-mode-msg">' +
        '<strong>Real network selected (standalone).</strong> ' +
        'No mapping to any Bettencourt 22-panel row. Graph topology K detection is reported in the Live Network Analysis section below &darr;; no panel β<sub>obs</sub> comparison is performed.' +
        '</p>';
    } else if (s_for_msg.sourceKind === 'toy-graph') {
      msgHtml = '<p class="sample-mode-msg">' +
        '<strong>Toy graph selected (illustration only).</strong> ' +
        'This synthetic network is for K-detection demonstration purposes only; it is <strong>NOT</strong> panel evidence. The K verdict shown in the Live Network Analysis section below &darr; reflects the generator construction, not any Bettencourt 22-panel row.' +
        '</p>';
    } else {
      msgHtml = '<p class="sample-mode-msg"><strong>Sample selected.</strong></p>';
    }
    det.innerHTML = msgHtml;
    det.classList.add('active');
  }
  document.querySelectorAll('button.cat-btn.selected').forEach(function (b) {
    b.classList.remove('selected');
  });
  document.querySelectorAll('.sample-btn').forEach(function (b) {
    b.classList.remove('selected');
    if (b.dataset.sample === sampleKey) b.classList.add('selected');
  });
  document.getElementById('net-selected-display').innerHTML = renderSelectedDisplay(sampleKey);
  document.getElementById('net-results-target').innerHTML = '';
  loadPreview(sampleKey);
}

// === init Live Network section =========================================
function initLiveNetworkSection() {
  var grid = document.getElementById('sample-grid');
  if (!grid) return;
  grid.innerHTML = renderSampleGrid(_currentSampleKey);
  document.getElementById('net-selected-display').innerHTML = renderSelectedDisplay(_currentSampleKey);
  loadPreview(_currentSampleKey);
  // click delegation
  grid.addEventListener('click', function (ev) {
    var b = ev.target.closest('.sample-btn');
    if (!b || b.disabled) return;
    switchSample(b.dataset.sample);
    // v1.4 (2026-05-27 著者 split directive, supersedes v0.22 unified-button-top):
    //   rows 1-4 (= top of grid, scrolling to button top leaves awkward whitespace) → scroll to
    //   #catalogue-section-anchor (above result-notice)
    //   rows 5-22 → scroll to button top (= v0.22 original behavior preserved)
    var rid_v14 = Number(b.getAttribute('data-row-id'));
    if (rid_v14 >= 1 && rid_v14 <= 4) {
      var anchorAbv2 = document.getElementById('catalogue-section-anchor');
      if (anchorAbv2) anchorAbv2.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else b.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      b.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  var ab = document.getElementById('analyze-btn');
  if (ab) {
    ab.addEventListener('click', function () {
      loadAndAnalyze(_currentSampleKey);
      // scroll to analyze button
      ab.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLiveNetworkSection);
} else {
  initLiveNetworkSection();
}


// ============================================================================
// tool/8/ v0.6.0 increment — row 17/22 detail-panel fold per 著者 directive
// "Live Network Analysis がある場合は (= row 17/22) detail-panel content 折りたたみ、
//  その他の場合は展開された状態で出す"
// ============================================================================
(function () {
  if (typeof renderDetailPanel !== 'function') return;
  var origRender = renderDetailPanel;
  // v0.23 (2026-05-25 著者 directive): prepend "▼ Result(row N— rowname) ▼"
  // heading at the top of detail-panel, same font/style as the catalogue h2.
  function buildResultHeading(row) {
    if (!row) return '';
    var rname = (row.name || row.short || '');
    var safe = (typeof escapeHtml === 'function') ? escapeHtml(rname) : rname;
    return '<h2 class="catalogue-h2-large result-heading">' +
           '▼ Result (' + safe + ') ▼' +
           '</h2>';
  }
  function wrapForFold(row) {
    var content = origRender(row);
    if (!row) return content;
    var heading = buildResultHeading(row);
    // v1.5 (2026-05-27): sourceKind hard-gate per GPT P4polish_076.
    // Previous behavior (v0.6.0): rows 17 / 22 wrapped in <details> fold
    // because the Live Network section provided the analysis layer for them.
    // Now Live Network never shows on panel row click, so all panel rows
    // render with the same fully-expanded detail layout.
    return heading + content;
  }
  window.renderDetailPanel = wrapForFold;
  try { renderDetailPanel = wrapForFold; } catch (e) {}
})();


// === v1.5 (2026-05-27): panel row click → Live Network section ALWAYS HIDE ===
// Per GPT P4polish_076 sourceKind hard-gate verdict (rank B > A >> C):
//   panel rows (= rows 1-22 in the catalogue grid) are paper-side classification
//   (Path A integer assignment / Tier B convex-mixture diagnostic). Path B
//   (graph-side K detection) is not applicable to panel rows because the
//   22-panel data does not contain observed edge lists. The K verdict on any
//   synthetic graph constructed from a panel row reflects the generator, not
//   the row.
//
// All panel row click handlers now hide the Live Network section. The Live
// Network section is shown only when a sample button (= USPTO/SNAP real graph
// or toy graph) is clicked in the sample-grid.
//
// Previous behavior (v0.9.0-v1.4): row 17 / row 22 click → switchSample('row17'/'row22')
//                                  + Live Network section show. REMOVED.
(function () {
  function attachPanelRowHook() {
    var catGrid = document.getElementById('catalogue-grid');
    if (!catGrid) { setTimeout(attachPanelRowHook, 100); return; }
    catGrid.addEventListener('click', function (ev) {
      var btn = ev.target.closest('button[data-row-id]');
      if (!btn) return;
      var liveSec = document.getElementById('live-network-section');
      if (liveSec) liveSec.classList.add('hidden');
    }, true);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachPanelRowHook);
  } else {
    attachPanelRowHook();
  }
})();


// === v0.11.0: K=2 FORCED partition ========================================
// (Obsolete) Pre-v1.4: take default Louvain partition + re-assign top-2.
// v1.4: replaced with direct K=2 BFS-bisection + greedy refinement (no Louvain dependency).
// Used to provide the "integer-pair K=2 cluster analysis" path per paper 4 §S-Heff §2'.
// 2026-05-22 origin; algorithm replaced 2026-05-27.
var naturalLPPartition = function (g) {
  // Pure Label Propagation, returning natural K-many community labels (NO
  // top-2 takeover). Used for SVG visualisation to expose the underlying
  // graph topology (= many-coloured natural community view), distinct from
  // the K=2 forced partition used for the diagnostic metrics.
  // Deterministic via seeded PRNG (Fisher-Yates shuffle, seed=12345).
  var nodes = g.nodes();
  if (nodes.length < 2 || g.size === 0) {
    var p0 = {};
    nodes.forEach(function (node, i) { p0[node] = String(i); });
    return p0;
  }
  var labels = {};
  nodes.forEach(function (node) { labels[node] = node; });
  var rngSeed = 12345;
  function nextRand(maxExcl) {
    rngSeed = (rngSeed * 1664525 + 1013904223) & 0x7fffffff;
    return rngSeed % maxExcl;
  }
  var changed = true; var iter = 0;
  while (changed && iter < 25) {
    changed = false; iter++;
    var order = nodes.slice();
    for (var i = order.length - 1; i > 0; i--) {
      var j = nextRand(i + 1);
      var t = order[i]; order[i] = order[j]; order[j] = t;
    }
    order.forEach(function (node) {
      var counts = {};
      g.neighbors(node).forEach(function (nb) {
        var lab = labels[nb];
        counts[lab] = (counts[lab] || 0) + 1;
      });
      var maxCount = 0; var bestLabel = labels[node];
      var keys = Object.keys(counts);
      for (var ki = 0; ki < keys.length; ki++) {
        var l = keys[ki];
        if (counts[l] > maxCount) { maxCount = counts[l]; bestLabel = l; }
      }
      if (labels[node] !== bestLabel) {
        labels[node] = bestLabel;
        changed = true;
      }
    });
  }
  return labels;
};

var forceK2Partition = function (g) {
  // K=2 forced partition via Label Propagation (free-K) + top-2 cluster takeover.
  //
  // Step 1: Run synchronous label propagation: each node starts with own label;
  //         iterate "adopt majority-neighbour label" until convergence.
  //         This is a non-Louvain free-K community detection method (= no modularity
  //         maximisation; pure local consensus).
  // Step 2: Rank clusters by size; take top-2.
  // Step 3: Re-assign nodes from smaller clusters to whichever of top-2 has more
  //         neighbour edges, yielding a guaranteed K=2 partition that respects
  //         the natural local-consensus community structure.
  //
  // NOT Louvain (= modularity-maximisation greedy at free K, rejected per
  // kensan_2 P0 finding). Paper 4 §S-Heff §2'' compatible: K=2 forced output
  // + downstream Q_{K=2} ≥ 0.20 threshold + top-2 cluster size ratio.
  var nodes = g.nodes();
  var n = nodes.length;
  if (n < 2 || g.size === 0) {
    var p0 = {};
    nodes.forEach(function (node, i) { p0[node] = (i === 0) ? '0' : '1'; });
    return p0;
  }
  // Step 1: Label Propagation (deterministic order shuffle via seeded PRNG)
  var labels = {};
  nodes.forEach(function (node) { labels[node] = node; });
  var rngSeed = 12345;
  function nextRand(maxExcl) {
    rngSeed = (rngSeed * 1664525 + 1013904223) & 0x7fffffff;
    return rngSeed % maxExcl;
  }
  var changed = true; var iter = 0;
  while (changed && iter < 25) {
    changed = false; iter++;
    var order = nodes.slice();
    // Deterministic Fisher-Yates shuffle
    for (var i = order.length - 1; i > 0; i--) {
      var j = nextRand(i + 1);
      var t = order[i]; order[i] = order[j]; order[j] = t;
    }
    order.forEach(function (node) {
      var counts = {};
      g.neighbors(node).forEach(function (nb) {
        var lab = labels[nb];
        counts[lab] = (counts[lab] || 0) + 1;
      });
      var maxCount = 0; var bestLabel = labels[node];
      var keys = Object.keys(counts);
      for (var ki = 0; ki < keys.length; ki++) {
        var l = keys[ki];
        if (counts[l] > maxCount) { maxCount = counts[l]; bestLabel = l; }
      }
      if (labels[node] !== bestLabel) {
        labels[node] = bestLabel;
        changed = true;
      }
    });
  }
  // Step 2: Rank cluster sizes
  var sizeMap = {};
  nodes.forEach(function (node) {
    var l = labels[node];
    sizeMap[l] = (sizeMap[l] || 0) + 1;
  });
  var sizeArr = Object.keys(sizeMap).map(function (l) { return { lab: l, size: sizeMap[l] }; });
  sizeArr.sort(function (a, b) { return b.size - a.size; });
  if (sizeArr.length === 1) {
    // Degenerate: LP converged to one cluster — fall back to even split by node order
    var p1 = {};
    nodes.forEach(function (node, i) {
      p1[node] = (i < Math.floor(n / 2)) ? '0' : '1';
    });
    return p1;
  }
  var top0 = sizeArr[0].lab;
  var top1 = sizeArr[1].lab;
  // Step 3: Re-assign smaller-cluster nodes to whichever of top-2 has more neighbour edges
  var part = {};
  nodes.forEach(function (node) {
    var l = labels[node];
    if (l === top0 || l === top1) {
      part[node] = (l === top0) ? '0' : '1';
    } else {
      var c0 = 0, c1 = 0;
      g.neighbors(node).forEach(function (nb) {
        var nbLab = labels[nb];
        if (nbLab === top0) c0++;
        else if (nbLab === top1) c1++;
      });
      // Tie-break: assign to top0 (= larger cluster)
      part[node] = (c0 >= c1) ? '0' : '1';
    }
  });
  return part;
};


// ============================================================================
// tool/8/ v0.24 (2026-05-25): move .result-heading OUT of .detail-panel
// 著者 directive: "▼ Result(row N— ...) ▼ →箱というか枠の上に出して"
// MutationObserver-based: whenever detail-panel content changes, extract any
// .result-heading and place it into #result-heading-out (sibling above the box).
// marker: v0.24-heading-out-observer
// ============================================================================
(function () {
  // v0.31 (2026-05-25) update: restore "▼ Result ▼" placeholder + empty-state
  // message when detail-panel becomes empty (= row toggled off).
  var PLACEHOLDER_HEADING_HTML = '<h2 class="catalogue-h2-large result-heading result-heading-placeholder">\u25BC Result \u25BC</h2>';
  var EMPTY_STATE_HTML = '<p class="empty-state">Nothing selected yet \u2014 click any indicator above to see its scaling-exponent \u03B2 prediction.</p>';
  function installObserver() {
    var detail = document.getElementById('detail-panel');
    var out = document.getElementById('result-heading-out');
    if (!detail || !out) { return; }
    var restoring = false;
    function syncHeading() {
      if (restoring) return;
      var h = detail.querySelector('.result-heading');
      if (h) {
        if (h.parentNode !== out) {
          out.innerHTML = '';
          out.appendChild(h);
        }
      } else {
        var detailEmpty = detail.innerHTML.trim() === '';
        if (detailEmpty) {
          // v0.37: if we are in sample-mode (= USPTO/SNAP click cleared the
          // detail-panel), skip the placeholder restore — heading is being
          // set by switchSample override + detail-panel stays empty/hidden.
          if (detail.dataset && detail.dataset.sampleMode === 'true') return;
          restoring = true;
          out.innerHTML = PLACEHOLDER_HEADING_HTML;
          detail.innerHTML = EMPTY_STATE_HTML;
          detail.classList.add('active');
          setTimeout(function () { restoring = false; }, 30);
        }
      }
    }
    syncHeading();
    var mo = new MutationObserver(function () { syncHeading(); });
    mo.observe(detail, { childList: true, subtree: true, characterData: false });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installObserver);
  } else {
    installObserver();
  }
})();


// ============================================================================
// tool/8/ v0.25 (2026-05-25): 0.75s spinner delay between catalogue button
// click and result display per 著者 directive
// "ボタン押してからresults出るまで0.75秒は待機のこと。その間、ぐるぐるしていること。"
// marker: v0.25-click-spinner-delay
// ============================================================================
(function () {
  function injectSpinnerStyle() {
    if (document.getElementById('spinner-style-v25')) return;
    var s = document.createElement('style');
    s.id = 'spinner-style-v25';
    s.textContent = ''
      + '.result-spinner-overlay{position:relative;text-align:center;padding:2em 1em;}'
      + '.result-spinner-overlay .spinner-ring{display:inline-block;width:48px;height:48px;'
      +   'border:5px solid #ddd;border-top-color:#2c4a6b;border-radius:50%;'
      +   'animation:rspin .8s linear infinite;}'
      + '.result-spinner-overlay .spinner-label{display:block;margin-top:0.8em;'
      +   'color:#2c4a6b;font-weight:600;letter-spacing:0.03em;}'
      + '@keyframes rspin{to{transform:rotate(360deg);}}';
    document.head.appendChild(s);
  }
  function installSpinnerHook() {
    injectSpinnerStyle();
    var detail = document.getElementById('detail-panel');
    var grid = document.getElementById('catalogue-grid');
    if (!detail || !grid) return;
    var SPIN_MS = 750;
    grid.addEventListener('click', function (ev) {
      var btn = ev.target.closest('button[data-row-id]');
      if (!btn) return;
      // capture detail content RIGHT AFTER native click handler runs
      // (the native handler at line ~631 sets detail.innerHTML = renderDetailPanel(row))
      // we substitute it with the spinner, then restore after SPIN_MS.
      setTimeout(function () {
        if (detail.innerHTML.trim() === '') return; // toggled off, no spinner
        var realContent = detail.innerHTML;
        detail.innerHTML = '<div class="result-spinner-overlay">'
                         + '<span class="spinner-ring" aria-hidden="true"></span>'
                         + '<span class="spinner-label">Computing β prediction…</span>'
                         + '</div>';
        setTimeout(function () {
          detail.innerHTML = realContent;
        }, SPIN_MS);
      }, 0);
    }, true); // capture phase so we run BEFORE the native bubble handler too? No, we want AFTER → use bubble (false). But we need the native to have set innerHTML first → bubble (false) runs after capture but at same target order... Actually native handler is at bubble phase. We need to run AFTER it. Use a microtask via setTimeout 0 above which is queued after current event loop iteration. That's fine even from capture phase. Keep capture=true since setTimeout 0 defers anyway.
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installSpinnerHook);
  } else {
    installSpinnerHook();
  }
})();


// ============================================================================
// tool/8/ v0.30 (2026-05-25): smooth-scroll the "▼ Result ▼" link in the
// red notice down to the Result panel area.
// marker: v0.30-result-link-smooth-scroll
// ============================================================================
(function () {
  function installResultLinkHandler() {
    var link = document.querySelector('.result-notice .result-link');
    if (!link) return;
    link.addEventListener('click', function (ev) {
      ev.preventDefault();
      // Prefer the heading-out element if populated; else the anchor;
      // else the detail-panel section itself.
      var out = document.getElementById('result-heading-out');
      var anchor = document.getElementById('result-anchor');
      var det = document.getElementById('detail-panel');
      var target = (out && out.childNodes.length > 0) ? out
                 : (anchor || det || out);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installResultLinkHandler);
  } else {
    installResultLinkHandler();
  }
})();


// ============================================================================
// tool/8/ v0.32 (2026-05-25): ↓ Analyze ↓ button → 1.5 s minimum spinner
// 著者 directive "↓ Analyze ↓ボタンを押したら1.5秒はぐるぐるして"
// (companion to v0.25 catalogue button 0.75 s spinner)
// marker: v0.32-analyze-spinner-1500ms
// ============================================================================
(function () {
  var SPIN_MS = 1500;
  // Save original loadAndAnalyze so the override can fall back if something
  // goes wrong (eg. function not yet defined at execution time).
  var origLoadAndAnalyze = (typeof loadAndAnalyze === 'function') ? loadAndAnalyze : null;
  if (!origLoadAndAnalyze) return;
  function spinnerHtml(label) {
    return '<div class="result-spinner-overlay">'
         + '<span class="spinner-ring" aria-hidden="true"></span>'
         + '<span class="spinner-label">' + label + '</span>'
         + '</div>';
  }
  function newLoadAndAnalyze(sampleKey) {
    var target = document.getElementById('net-results-target');
    if (!target) return origLoadAndAnalyze(sampleKey);
    var s = (typeof SAMPLE_NETWORKS === 'object') ? SAMPLE_NETWORKS[sampleKey] : null;
    if (!s || !s.file) {
      // unchanged: no file means show the warning immediately
      target.innerHTML = '<div class="warning-box">USPTO assignee-level co-inventorship bulk download pending (~1.3 GB, multi-session). Not available in this version.</div>';
      return;
    }
    target.innerHTML = spinnerHtml('Fetching ' + escapeHtmlSafe(s.file) + ' and running graph-shape cluster analysis\u2026');
    var t0 = Date.now();
    function showAfterMinSpin(html) {
      var elapsed = Date.now() - t0;
      var wait = Math.max(0, SPIN_MS - elapsed);
      setTimeout(function () { target.innerHTML = html; }, wait);
    }
    fetch(s.file).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    }).then(function (text) {
      setTimeout(function () {
        try {
          var edges = parseEdgelist(text, s.format);
          var maxNodes = null;
          if (edges.length > 30000) maxNodes = 4000;
          var g = buildGraphFromEdges(edges, maxNodes);
          showAfterMinSpin(renderLiveNetworkResults(sampleKey, edges, g));
        } catch (e) {
          showAfterMinSpin('<div class="warning-box">Analysis error: ' + escapeHtmlSafe(e.message || String(e)) + '</div>');
          console.error('Analyze error (v0.32 override):', e);
        }
      }, 30);
    }).catch(function (e) {
      showAfterMinSpin('<div class="warning-box">Fetch error: ' + escapeHtmlSafe(e.message || String(e)) + '</div>');
    });
  }
  // Override the global function so existing click handler picks it up.
  loadAndAnalyze = newLoadAndAnalyze;
  window.loadAndAnalyze = newLoadAndAnalyze;
})();


// ============================================================================
// tool/8/ v0.35 (2026-05-25): sample button click → update Result heading
// with sample label inside the (...). Hooks switchSample.
// 著者 directive "4 つの real-network sample click 時、heading の (...) に sample 名"
// marker: v0.35-sample-heading-sync
// ============================================================================
(function () {
  if (typeof switchSample !== 'function') return;
  var origSwitchSample = switchSample;
  function setSampleHeading(sampleKey) {
    var out = document.getElementById('result-heading-out');
    if (!out) return;
    var s = (typeof SAMPLE_NETWORKS === 'object') ? SAMPLE_NETWORKS[sampleKey] : null;
    if (!s) return;
    var label = s.label || sampleKey;
    var safe = (typeof escapeHtmlSafe === 'function') ? escapeHtmlSafe(label) : label;
    out.innerHTML = '<h2 class="catalogue-h2-large result-heading result-heading-sample">'
                  + '\u25BC Result \u3010' + safe + '\u3011 \u25BC'
                  + '</h2>';
  }
  function newSwitchSample(sampleKey) {
    origSwitchSample(sampleKey);
    // After the original runs (clears detail-panel, sets _currentSampleKey,
    // loads preview), wait one tick for the MutationObserver to settle then
    // set our sample-specific heading. The 'restoring' flag guard inside the
    // observer skips re-restoring the placeholder during this microtask, but
    // setting the heading after observer has run is robust.
    setTimeout(function () { setSampleHeading(sampleKey); }, 60);
  }
  switchSample = newSwitchSample;
  window.switchSample = newSwitchSample;
})();


// v1.4 (2026-05-27 著者 directive): diff-nav-cue is USPTO-only (= explicit
// difference between Bettencourt 22-panel row 17 and the USPTO real network
// makes sense only when USPTO sample is the current selection). Toggle
// visibility based on _currentSampleKey.
(function () {
  function syncDiffNavCueVisibility() {
    var cue = document.querySelector('.diff-nav-cue');
    if (!cue) return;
    var isUspto = (typeof _currentSampleKey !== 'undefined') && (_currentSampleKey === 'uspto_assignee_2010');
    cue.style.display = isUspto ? '' : 'none';
  }
  function installSampleSwitchHook() {
    syncDiffNavCueVisibility();
    var grid = document.getElementById('sample-grid');
    if (!grid) { setTimeout(installSampleSwitchHook, 200); return; }
    grid.addEventListener('click', function () {
      setTimeout(syncDiffNavCueVisibility, 100);
    }, true);
    // Also re-sync on row 17/22 click (which auto-routes sample)
    var catGrid = document.getElementById('catalogue-grid');
    if (catGrid) {
      catGrid.addEventListener('click', function () {
        setTimeout(syncDiffNavCueVisibility, 150);
      }, true);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installSampleSwitchHook);
  } else {
    installSampleSwitchHook();
  }
})();
