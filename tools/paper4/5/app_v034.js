/*
 * Bettencourt 22-Indicator Reference Catalogue
 * with Paper 4 Zero-Fitted-Exponent Ladder Predictions
 *
 * ★Paper4_β_predictor_3 v0.3.4  (tool/6/  2026-05-22)
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
    source: "FHWA Highway Statistics + US Census TIGER/Line (paper4 author derivation per V261)",
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
    source: "US Census ACS (proxy via Housing units count, V261 author note)",
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
    source: "USPTO PatentsView bulk data tables (n = 378 MSAs, paper4 V264 line 3088)",
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
      'formal H = ' + row.H + ' marker in V261 §S-PanelOrigins is structural ' +
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

  lines.push('  <p class="dsection-head">Paper 4 structural assignment (V261 §S-PanelOrigins):</p>');
  lines.push('  <ul class="dlist">');
  lines.push('    <li>Industry classification: ' + escapeHtml(classificationLine(row)) + '</li>');
  lines.push('    <li>Branch sign: ' + escapeHtml(branchLabel(row.branch)) + '</li>');
  if (!row.mixture) {
    lines.push('    <li>Mixture flag: NO (Tier A integer rung)</li>');
    lines.push('    <li>Relay depth H: <strong>' + row.H + '</strong> ' +
               '<span class="dhint">(= the number of 【】 boxes in the relay chain below)</span></li>');
  } else {
    lines.push('    <li>Mixture flag: YES (Tier B mixing-coordinate diagnostic per V262 §S-Heff §3)</li>');
    lines.push('    <li>Adjacent rung pair: H ∈ {' + row.H_pair[0] + ', ' + row.H_pair[1] + '} ' +
               '<span class="dhint">(= 2-box chain vs 3-box chain, see below)</span></li>');
    lines.push('    <li class="dmix-expost">');
    lines.push('      <span class="dmix-badge">⚠ Ex post diagnostic</span>');
    lines.push('      Mixing weights solved <em>backwards from</em> β<sub>obs</sub>: ' +
               'π<sub>' + row.H_pair[0] + '</sub> ≈ ' + fmt(row.pi_low, 2) +
               ', π<sub>' + row.H_pair[1] + '</sub> ≈ ' + fmt(row.pi_up, 2) +
               ', H<sub>eff</sub> = ' + fmt(row.pi_low, 2) + ' × ' + row.H_pair[0] +
               ' + ' + fmt(row.pi_up, 2) + ' × ' + row.H_pair[1] +
               ' = <strong>' + fmt(row.H_eff, 2) + '</strong>.');
    lines.push('      The integer pair {' + row.H_pair[0] + ', ' + row.H_pair[1] + '} is ' +
               'pre-specified by the author\'s structural assignment; the π weights are ' +
               'the barycentric weights that recover β<sub>obs</sub> on that pair. They ' +
               'are <strong>not</strong> an independent derivation of <em>H</em>.');
    lines.push('    </li>');
  }
  lines.push('  </ul>');

  lines.push('  <p class="dsection-head">Relay-depth identification ' +
             '(per V261 §S-PanelOrigins — count the 【】 boxes):</p>');
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
               ? 'Mixture-coordinate reading from the author-assigned adjacent rung pair ' +
                 'per V261 §S-PanelOrigins + V262 §S-Heff §3 Tier B coordinate table. ' +
                 '<strong>The mixing weights π are barycentric weights solved backwards ' +
                 'from β<sub>obs</sub></strong> (= the unique solution that recovers ' +
                 'β<sub>obs</sub> on the pre-specified {H<sub>low</sub>, H<sub>up</sub>} ' +
                 'pair); this is an <em>ex post</em> mixing-coordinate diagnostic, ' +
                 '<strong>not</strong> an independent derivation of <em>H</em>. The ' +
                 'integer pair itself is fixed by the structural assignment, not by ' +
                 'fitting. 0 fitted exponents.'
               : 'Direct integer-rung reading from Industry classification + Branch ' +
                 'sign per V261 §S-PanelOrigins (= author\'s domain reasoning ' +
                 'assignment, <strong>not</strong> derived from graph property). ' +
                 '0 fitted exponents.') +
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
      '<span class="btn-short">' + escapeHtml(row.short) + '</span>' +
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
    btn.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
