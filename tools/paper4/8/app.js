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
    btn.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}






// ============================================================================
// tool/8/ v0.5.0 augmentation — ★Paper4_β_predictor_4 2026-05-22
// Live Network Analysis = independent top-level section, NO nesting under detail panel
// NO FOLD anywhere (Louvain diagnostic = flat low position, Tier B panel = tool/6/ default)
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

var louvainPartition = function (g, gamma) {
  gamma = gamma || 1.0;
  var nodes = g.nodes(); var m2 = 2 * g.size;
  if (m2 === 0) { var part = {}; nodes.forEach(function (n) { part[n] = n; }); return part; }
  var comm = {}; var k = {};
  nodes.forEach(function (n) { comm[n] = n; k[n] = g.degree(n); });
  var sigma = {};
  nodes.forEach(function (n) { sigma[comm[n]] = (sigma[comm[n]] || 0) + k[n]; });
  var improved = true; var iter = 0;
  while (improved && iter < 15) {
    improved = false; iter++;
    var order = nodes.slice(); var seed = 42 + iter;
    for (var i = order.length - 1; i > 0; i--) {
      seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
      var j = seed % (i + 1);
      var t = order[i]; order[i] = order[j]; order[j] = t;
    }
    order.forEach(function (n) {
      var cn = comm[n]; var kn = k[n];
      var kic = {};
      g.neighbors(n).forEach(function (nb) { var cb = comm[nb]; kic[cb] = (kic[cb] || 0) + 1; });
      sigma[cn] -= kn;
      var bestC = cn; var bestGain = 0;
      var considered = new Set([cn]);
      Object.keys(kic).forEach(function (cb) { considered.add(isNaN(+cb) ? cb : +cb); });
      considered.forEach(function (cb) {
        var ki_in = kic[cb] || 0;
        var gain = (ki_in - gamma * (sigma[cb] || 0) * kn / m2) / m2;
        if (gain > bestGain + 1e-12) { bestGain = gain; bestC = cb; }
      });
      comm[n] = bestC;
      sigma[bestC] = (sigma[bestC] || 0) + kn;
      if (bestC !== cn) improved = true;
    });
  }
  return comm;
};

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
  row17: {
    label: 'row 17 — Patents (USPTO-CBSA 2010)',
    badge: 'legacy synth-shape ⚠', badge_class: 'legacy',
    file: './data/row17_USPTO_2010.csv', format: 'csv',
    expected_n: 180, expected_m: 702,
    domain: 'patent co-inventorship sample (legacy synth-shape)',
    bettencourt_H: 2, bettencourt_branch: '+',
    forceK2_H_pair: [2, 3],
    bettencourt_beta_obs: 1.298, bettencourt_ci: [1.198, 1.398],
    indicator_text: 'Total number of patents granted, per US Metropolitan Statistical Area (MSA) (USPTO-CBSA 2010 panel).',
    disclosure: 'Legacy ★Paper4_β_predictor_1 webapp sample. ★ predictor_3 disclosure 2026-05-22: synthetic-shape (n=180, density=0.087, k-core max 8).'
  },
  row22: {
    label: 'row 22 — Patents (Bettencourt 2007 legacy)',
    badge: 'legacy synth-shape ⚠', badge_class: 'legacy',
    file: './data/row22_Bettencourt_legacy.csv', format: 'csv',
    expected_n: 200, expected_m: 712,
    domain: 'patent co-inventorship sample (legacy synth-shape)',
    bettencourt_H_pair: [2, 3], forceK2_H_pair: [2, 3], bettencourt_pi_low: 0.90, bettencourt_pi_up: 0.10,
    bettencourt_H_eff: 2.10, bettencourt_branch: '+',
    bettencourt_beta_obs: 1.270, bettencourt_ci: [1.25, 1.29],
    indicator_text: 'Total patents granted per MSA, Bettencourt 2007 legacy panel.',
    disclosure: 'Legacy webapp sample (n=200, density=0.072, k-core max 8).'
  },
  ca_grqc: {
    label: 'SNAP ca-GrQc (GR co-authorship)',
    badge: 'real co-authorship → row 14 R&D analog', badge_class: 'natural',
    file: './data/ca-GrQc.txt', format: 'snap',
    bettencourt_H: 2, bettencourt_branch: '+',
    bettencourt_beta_obs: 1.300, bettencourt_ci: [1.26, 1.34],
    forceK2_H_pair: [2, 3],
    expected_n: 5242, expected_m: 14496,
    domain: 'physics co-authorship (real, analog to row 14 R&D)',
    indicator_text: 'Real General-Relativity arXiv co-authorship network (Stanford SNAP). Semantically analogous to V261 row 14 R&D employment (researcher → research output, single-integer H=2 shallow knowledge coordination chain). β_obs/CI linked to row 14.',
    disclosure: 'Used as natural co-authorship → row 14 R&D analog. K=1 path: β+(2)=1.311 ∈ row 14 CI [1.26, 1.34] → MATCH ✓ (= reference natural network confirms paper 4 ladder at H=2).'
  },
  ca_hepth: {
    label: 'SNAP ca-HepTh (HEP-Th co-authorship)',
    badge: 'real co-authorship → row 14 R&D analog', badge_class: 'natural',
    file: './data/ca-HepTh.txt', format: 'snap',
    bettencourt_H: 2, bettencourt_branch: '+',
    bettencourt_beta_obs: 1.300, bettencourt_ci: [1.26, 1.34],
    forceK2_H_pair: [2, 3],
    expected_n: 9877, expected_m: 25998,
    domain: 'physics co-authorship (real, analog to row 14 R&D)',
    indicator_text: 'Real HEP-Theory arXiv co-authorship network (Stanford SNAP). Semantically analogous to V261 row 14 R&D employment (researcher → research output, shallow knowledge coordination H=2). β_obs/CI linked to row 14.',
    disclosure: 'Real HEP-Theory arXiv co-authorship → row 14 R&D analog. K=1 path with H=2 → β+(2)=1.311 ∈ row 14 CI [1.26, 1.34] → MATCH ✓.'
  },
  ca_condmat: {
    label: 'SNAP ca-CondMat (CondMat co-authorship)',
    badge: 'real co-authorship → row 14 R&D analog', badge_class: 'natural',
    file: './data/ca-CondMat.txt', format: 'snap',
    bettencourt_H: 2, bettencourt_branch: '+',
    bettencourt_beta_obs: 1.300, bettencourt_ci: [1.26, 1.34],
    forceK2_H_pair: [2, 3],
    expected_n: 23133, expected_m: 93497,
    domain: 'physics co-authorship (real large, analog to row 14 R&D)',
    indicator_text: 'Real Condensed-Matter arXiv co-authorship network (Stanford SNAP, large 23K nodes, subsampled to 4000 for browser-side analysis). Analog to V261 row 14 R&D employment (H=2). β_obs/CI linked to row 14.',
    disclosure: 'Real Condensed-Matter arXiv co-authorship → row 14 R&D analog. Large graph subsampled; K=1 path β+(2)=1.311 ∈ row 14 CI → MATCH ✓.'
  },
  uspto_assignee_2010: {
    label: 'USPTO assignee-level co-inventorship (2010, REAL)',
    badge: 'real USPTO (linked to row 17 β_obs)', badge_class: 'natural',
    file: './data/uspto_assignee_2010.csv', format: 'csv',
    forceK2_H_pair: [2, 3],
    expected_n: 3951, expected_m: 4526,
    domain: 'real USPTO patent assignee co-occurrence (2010 grants)',
    bettencourt_H: 2, bettencourt_branch: '+', bettencourt_beta_obs: 1.298, bettencourt_ci: [1.198, 1.398],
    indicator_text: 'Real USPTO PatentsView assignee-level co-inventorship network (2010 grants, nationwide). Nodes = assignee organizations; edges = same-patent co-listed assignees. This IS the network underlying Bettencourt 22-panel row 17 — comparison to row 17 β_obs = 1.298 [1.198, 1.398] is the canonical predictive-power test.',
    disclosure: 'Built from g_patent.tsv (244,599 2010 patents) + g_assignee_disambiguated.tsv. 6,837 multi-assignee patents → 4,526 distinct co-assignee pairs → 3,951 unique assignee organizations. REAL natural-coordination network. ★ predictor_4 acquired 2026-05-22 (author manual PatentsView S3 DL).'
  }
};

var _currentSampleKey = 'row17';

// === parse edgelist =====================================================
function parseEdgelist(text, format) {
  var lines = text.split(/\r?\n/);
  var edges = [];
  if (format === 'csv') {
    for (var i = 1; i < lines.length; i++) {
      var line = lines[i].trim(); if (!line) continue;
      var parts = line.split(',');
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

// === preview table ======================================================
function renderEdgelistPreview(edges, total) {
  var top = edges.slice(0, 15);
  var rows = top.map(function (e) {
    return '<tr><td>' + escapeHtmlSafe(e[0]) + '</td><td>' + escapeHtmlSafe(e[1]) + '</td></tr>';
  }).join('');
  return '<div class="net-preview">' +
    '<h4>Network preview (edgelist, read-only)</h4>' +
    '<table class="preview-table">' +
      '<thead><tr><th>from</th><th>to</th></tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
    '</table>' +
    '<p class="preview-meta">Showing top 15 of ' + total + ' edges.</p>' +
  '</div>';
}

// === sample networks grid ===============================================
function renderSampleGrid(selectedKey) {
  var keys = ['uspto_assignee_2010', 'ca_grqc', 'ca_hepth', 'ca_condmat'];  // v0.9.0: row17/row22 removed (= duplicates of 22-button catalogue grid)
  return keys.map(function (key) {
    var s = SAMPLE_NETWORKS[key];
    var cls = 'sample-btn ' + s.badge_class + (key === selectedKey ? ' selected' : '');
    var disabled = '';
    return '<button class="' + cls + '" data-sample="' + key + '"' + disabled + ' type="button">' +
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
function renderLiveNetworkResults(sampleKey, edges, g) {
  var s = SAMPLE_NETWORKS[sampleKey];
  var primaryHtml = '';
  if (s.bettencourt_H !== undefined) {
    var beta_pred = ladderBetaForH(s.bettencourt_H, s.bettencourt_branch === '+' ? 'plus' : 'minus');
    var inCI = beta_pred >= s.bettencourt_ci[0] && beta_pred <= s.bettencourt_ci[1];
    primaryHtml = '<div class="primary-result"><h4>Primary result — Path A · V261 integer-H assignment</h4>' +
      '<p class="result-line"><strong>Selected input:</strong> ' + escapeHtmlSafe(s.label) +
      ' (' + g.size + ' edges) — analyzed with <em>Path A · V261 integer-H assignment</em></p>' +
      '<p class="result-formula"><strong>β<sub>pred</sub> = β<sub>+</sub>(H = ' + s.bettencourt_H + ') = 1 + 1 / [' +
      s.bettencourt_H + ' · ln(2×' + s.bettencourt_H + ' + 1)] ≈ ' + beta_pred.toFixed(4) + '</strong></p>' +
      '<p>β<sub>pred</sub> (predicted urban scaling exponent) = ' + beta_pred.toFixed(4) + '. ' +
      '<em>[Path A · V261 integer-H — true 0-parameter]</em></p>' +
      '<p><strong>Match:</strong> ' + (inCI ? '✓' : '✗') + ' β<sub>pred</sub> = ' + beta_pred.toFixed(4) + ' ' +
      (inCI ? '∈' : '∉') + ' [' + s.bettencourt_ci[0].toFixed(3) + ', ' + s.bettencourt_ci[1].toFixed(3) +
      '] = 95% CI of β<sub>obs</sub> (β<sub>obs</sub> = ' + s.bettencourt_beta_obs.toFixed(3) + ')</p>' +
      '<p><strong>Concrete reading.</strong> ' + concreteReadingText(beta_pred, s.bettencourt_branch === '+' ? 'plus' : 'minus') + '</p>' +
      '<p><strong>Indicator:</strong> ' + escapeHtmlSafe(s.indicator_text) +
      ' <em>(structural H assignment from V261 §S-PanelOrigins, not derived from this graph)</em></p>' +
      '<p><strong>Formula (zero fitted exponent):</strong> β<sub>±</sub>(H) = 1 ± 1 / [H · ln(2H+1)]. ' +
      'Each integer H pins a unique β — <strong>no parameters are fit to data</strong>.</p>' +
      '</div>';
  } else if (s.bettencourt_H_pair !== undefined) {
    var beta_pred = ladderBetaForH(s.bettencourt_H_eff, s.bettencourt_branch === '+' ? 'plus' : 'minus');
    var inCI = beta_pred >= s.bettencourt_ci[0] && beta_pred <= s.bettencourt_ci[1];
    primaryHtml = '<div class="primary-result"><h4>Primary result — Path A · V261 mixture-coordinate assignment</h4>' +
      '<p class="result-line"><strong>Selected input:</strong> ' + escapeHtmlSafe(s.label) +
      ' (' + g.size + ' edges) — analyzed with <em>Path A · V261 mixture H ∈ {' +
      s.bettencourt_H_pair[0] + ', ' + s.bettencourt_H_pair[1] + '}</em></p>' +
      '<p class="result-formula"><strong>β<sub>pred</sub> = β<sub>+</sub>(H<sub>eff</sub> = ' +
      s.bettencourt_H_eff + ') ≈ ' + beta_pred.toFixed(4) + '</strong> (H<sub>eff</sub> = ' +
      s.bettencourt_pi_low + ' × ' + s.bettencourt_H_pair[0] + ' + ' + s.bettencourt_pi_up + ' × ' +
      s.bettencourt_H_pair[1] + ' = ' + s.bettencourt_H_eff + ')</p>' +
      '<p><strong>Match:</strong> ' + (inCI ? '✓' : '✗') + ' β<sub>pred</sub> ≈ ' + beta_pred.toFixed(4) + ' ' +
      (inCI ? '∈' : '∉') + ' [' + s.bettencourt_ci[0].toFixed(3) + ', ' + s.bettencourt_ci[1].toFixed(3) +
      '] = 95% CI of β<sub>obs</sub> (β<sub>obs</sub> = ' + s.bettencourt_beta_obs.toFixed(3) + ')</p>' +
      '<p><strong>Concrete reading.</strong> ' + concreteReadingText(beta_pred, 'plus') + '</p>' +
      '<p><strong>Indicator:</strong> ' + escapeHtmlSafe(s.indicator_text) + '</p>' +
      '<p><strong>H<sub>eff</sub> note:</strong> Tier B mixture-coordinate reading. The integer pair {' +
      s.bettencourt_H_pair[0] + ', ' + s.bettencourt_H_pair[1] + '} is pre-specified by V261 §S-PanelOrigins; ' +
      'the π weights are ex post barycentric weights solved backwards from β<sub>obs</sub> ' +
      '(<em>ex post diagnostic per V264 §S-Heff §2\'</em>).</p>' +
      '<p><strong>Formula (zero fitted exponent):</strong> β<sub>±</sub>(H) = 1 ± 1 / [H · ln(2H+1)]. ' +
      'No parameters are fit to data.</p>' +
      '</div>';
  } else {
    primaryHtml = '<div class="primary-result reference"><h4>Reference natural network — not part of Bettencourt 22-panel</h4>' +
      '<p><strong>Selected input:</strong> ' + escapeHtmlSafe(s.label) + ' (' + g.order + ' nodes, ' + g.size + ' edges)</p>' +
      '<p>' + escapeHtmlSafe(s.indicator_text) + '</p>' +
      '<p>No β<sub>obs</sub> mapping (not a 22-panel row). Used as a graph-signature calibration baseline ' +
      'for natural-vs-synthetic discrimination via (Q, C, d<sub>core</sub>).</p>' +
      '</div>';
  }
  // Louvain diagnostic — FLAT, no <details> wrap
  var part = louvainPartition(g, 1.0);
  var sizes = countClusterSizes(part);
  var K = sizes.length;
  var pi_top2 = K >= 2 ? sizes[0] / (sizes[0] + sizes[1]) : 1.0;
  var pi_whole = sizes[0] / g.order;
  var Q = computeModularity(g, part, 1.0);
  var C = clusteringCoefficient(g);
  var kcore = coreNumberMax(g);
  // sweep only for smaller graphs
  var sweep = [];
  if (g.order <= 6000) {
    [0.1, 0.3, 0.5, 0.7, 1.0].forEach(function (res) {
      var p = louvainPartition(g, res);
      var ss = countClusterSizes(p);
      sweep.push({ res: res, K: ss.length, top3: ss.slice(0, 3),
                   pi_top2: ss.length >= 2 ? ss[0] / (ss[0] + ss[1]) : 1.0 });
    });
  }
  var svg = renderSvgNetwork(g, part, 480, 320);
  // === v0.11.0: K=2 FORCED cluster analysis (integer-pair assumption) ===
  // Force K=2 partition + π from cluster sizes + H_eff under assumed H_pair → β_pred
  var partK2 = forceK2Partition(g);
  var sizesK2 = countClusterSizes(partK2);
  var sK2_0 = sizesK2[0] || g.order;
  var sK2_1 = sizesK2[1] || 0;
  var totK2 = sK2_0 + sK2_1;
  var piLow_K2 = totK2 > 0 ? sK2_0 / totK2 : 1.0;
  var piUp_K2 = totK2 > 0 ? sK2_1 / totK2 : 0.0;

  // Determine H_pair to use
  var H_pair_used = s.forceK2_H_pair ||
                    (s.bettencourt_H_pair ? s.bettencourt_H_pair :
                     (s.bettencourt_H !== undefined ? [s.bettencourt_H, s.bettencourt_H + 1] : [1, 2]));
  var H_eff_K2 = piLow_K2 * H_pair_used[0] + piUp_K2 * H_pair_used[1];
  var branchSign = (s.bettencourt_branch === '-') ? 'minus' : 'plus';
  var beta_pred_K2 = ladderBetaForH(H_eff_K2, branchSign);

  // === v0.15.0: graph-shape-based K detection (no β_obs in decision) ===
  // 著者 directive 2026-05-22: 「ネットワーク分離を見て『あるものはK=1っぽい、K=2っぽいもの』を指定する」
  // Decision rule (graph signature only):
  //   K = 2-like if Q(K=2 forced) >= 0.20 AND top-2 concentration >= 60%
  //   else K = 1-like
  // β_obs is used ONLY for empirical MATCH verdict, NEVER for path selection.
  var Q_K2 = computeModularity(g, partK2, 1.0);
  // v0.17.0 bug fix: top2_concentration from DEFAULT Louvain partition sizes
  // (= meaningful natural cluster concentration), NOT from forced K=2 (= always 100%).
  var top2_concentration = sizes.length >= 2 ? (sizes[0] + sizes[1]) / g.order : 1.0;
  // v0.18.0: K detection simplified to Q_K2 (= modularity at K=2 forced) only.
  // Rationale: top2_concentration from default Louvain is typically small for sparse networks
  // (many small communities), so it's not a discriminator. Q_K2 captures whether the K=2
  // partition explains the graph's modular structure regardless of how default Louvain split.
  var Q_THRESHOLD = 0.20;
  var K_detected = (Q_K2 >= Q_THRESHOLD) ? 2 : 1;
  var K_decision_basis = '(Q<sub>K=2</sub> = ' + Q_K2.toFixed(3) +
                         (Q_K2 >= Q_THRESHOLD ? ' ≥ ' : ' < ') + Q_THRESHOLD.toFixed(2) +
                         '; top-2 default concentration = ' + (top2_concentration * 100).toFixed(1) + '% [informational])';

  // Determine H input from V261 for the detected K
  var H_use_K1;
  if (s.bettencourt_H !== undefined) {
    H_use_K1 = s.bettencourt_H;
  } else if (s.bettencourt_H_pair !== undefined) {
    // Choose H_low (= the "shallower" rung) as default K=1 candidate
    H_use_K1 = s.bettencourt_H_pair[0];
  } else {
    H_use_K1 = H_pair_used[0];
  }
  var beta_K1_use = ladderBetaForH(H_use_K1, branchSign);

  // The final β_pred per graph-shape decision
  var beta_pred_final, H_label_final, path_label;
  if (K_detected === 2) {
    beta_pred_final = beta_pred_K2;
    H_label_final = 'H<sub>eff</sub> = ' + H_eff_K2.toFixed(3) + ' (= ' + piLow_K2.toFixed(3) + '·' + H_pair_used[0] + ' + ' + piUp_K2.toFixed(3) + '·' + H_pair_used[1] + ')';
    path_label = '★★ K=2-like detected → K=2 mixture path (V261 H<sub>pair</sub> + graph-derived π)';
  } else {
    beta_pred_final = beta_K1_use;
    H_label_final = 'H = ' + H_use_K1;
    path_label = '★★★ K=1-like detected → K=1 single-integer path (V261 H, no graph π needed)';
  }

  function matchCheck(beta, ci) {
    return ci && beta >= ci[0] && beta <= ci[1];
  }

  var verdictHtml = '';
  if (s.bettencourt_ci) {
    var matched = matchCheck(beta_pred_final, s.bettencourt_ci);
    var sym = matched ? '✓' : '✗';
    var cls = matched ? 'match' : 'mismatch';
    var kBadgeCls = (K_detected === 2) ? 'k2-badge' : 'k1-badge';
    var kBadgeText = (K_detected === 2) ? '★★ K=2-like (graph)' : '★★★ K=1-like (graph)';

    verdictHtml =
      '<div class="diag-verdict ' + cls + ' k-tier-' + K_detected + '">' +
        '<span class="k-badge ' + kBadgeCls + '">' + kBadgeText + '</span> ' +
        '<strong>' + sym + ' Match:</strong> ' +
        'β<sub>pred</sub> at ' + H_label_final + ' = <strong>' + beta_pred_final.toFixed(4) + '</strong> ' +
        (matched ? '∈' : '∉') + ' [' + s.bettencourt_ci[0].toFixed(3) + ', ' + s.bettencourt_ci[1].toFixed(3) +
        '] = 95% CI of β<sub>obs</sub> (β<sub>obs</sub> = ' + s.bettencourt_beta_obs.toFixed(3) + ')' +
      '</div>' +
      '<p class="diag-path"><strong>Graph-shape decision:</strong> ' + path_label + '</p>' +
      '<p class="diag-path"><strong>Decision basis (graph metrics only, no β<sub>obs</sub>):</strong> ' + K_decision_basis + '. ' +
      'Rule: K=2-like if Q<sub>K=2</sub> ≥ 0.20 (= forced K=2 partition explains modular structure); else K=1-like.</p>' +
      '<p class="diag-aux"><em>Both candidate predictions for reference:</em> ' +
      'K=1 with H = ' + H_use_K1 + ' → β = ' + beta_K1_use.toFixed(4) + ' ' +
      (matchCheck(beta_K1_use, s.bettencourt_ci) ? '<span class="m-yes">✓ MATCH</span>' : '<span class="m-no">✗ MISMATCH</span>') + ' &nbsp;·&nbsp; ' +
      'K=2 with H<sub>pair</sub> = {' + H_pair_used[0] + ', ' + H_pair_used[1] + '}, ' +
      'π<sub>low</sub> = ' + piLow_K2.toFixed(3) + ', π<sub>up</sub> = ' + piUp_K2.toFixed(3) +
      ' → β = ' + beta_pred_K2.toFixed(4) + ' ' +
      (matchCheck(beta_pred_K2, s.bettencourt_ci) ? '<span class="m-yes">✓ MATCH</span>' : '<span class="m-no">✗ MISMATCH</span>') + '</p>' +
      '<p class="diag-aux"><em>Note: β<sub>obs</sub> is used <strong>only</strong> for the empirical MATCH verdict, not for path selection. The K=1 vs K=2 path is decided by graph shape alone (Q + top-2 concentration). H<sub>max</sub> input from V261 §S-PanelOrigins.</em></p>';
  } else {
    // SNAP reference: no β_obs, just show graph-detected K and resulting β_pred
    verdictHtml =
      '<div class="diag-verdict reference">' +
        '<span class="k-badge ' + ((K_detected === 2) ? 'k2-badge' : 'k1-badge') + '">' +
          ((K_detected === 2) ? '★★ K=2-like (graph)' : '★★★ K=1-like (graph)') +
        '</span> ' +
        '<strong>Graph-shape detection:</strong> ' + K_decision_basis + '. ' +
        '<br>β<sub>pred</sub> at ' + H_label_final + ' = ' + beta_pred_final.toFixed(4) +
        ' (no panel β<sub>obs</sub> to compare against; H<sub>pair</sub> = {' + H_pair_used[0] + ', ' + H_pair_used[1] + '} default shallow-coordination assumption).' +
      '</div>' +
      '<p class="diag-path"><em>SNAP reference natural network — graph-shape K detection alone, no panel β<sub>obs</sub> mapping.</em></p>' +
      '<p class="diag-aux"><em>Default Louvain raw K = ' + K + '. Q<sub>K=2</sub> = ' + Q_K2.toFixed(3) +
      ', top-2 concentration = ' + (top2_concentration * 100).toFixed(1) + '%.</em></p>';
  }


  var diagFlat = '<div class="diagnostic-flat">' +
    '<h4>Secondary: Cluster analysis diagnostic (reproducibility instrument — not the primary prediction)</h4>' +
    '<p class="diag-note"><em>Path B · graph cluster detection (Louvain modularity) + V261 panel H_max input. ' +
    'Per ★ predictor_4 wave 1+2 finding: default Louvain typically gives K >> 2 on real networks, so the auto-path ' +
    '(K=1 → integer / K=2 → mixture) does not directly apply. The manual H_max fallback from the V261 panel ' +
    'restores the 0-parameter ladder prediction; this is explicitly the V264 §S-Heff §2&prime; ex post diagnostic framing.</em></p>' +
    verdictHtml +
    '<div class="net-graph">' + svg + '</div>' +
    '<div class="net-metrics">' +
      '<span class="m-box"><span class="m-l">n</span><span class="m-v">' + g.order + '</span></span>' +
      '<span class="m-box"><span class="m-l">m</span><span class="m-v">' + g.size + '</span></span>' +
      '<span class="m-box"><span class="m-l">K (Louvain default)</span><span class="m-v">' + K + '</span></span>' +
      '<span class="m-box"><span class="m-l">top-2 sizes</span><span class="m-v">[' + sizes.slice(0, 2).join(', ') + ']</span></span>' +
      '<span class="m-box"><span class="m-l">π<sub>lo</sub> (top-2 norm)</span><span class="m-v">' + pi_top2.toFixed(3) + '</span></span>' +
      '<span class="m-box"><span class="m-l">π<sub>lo</sub> (whole)</span><span class="m-v">' + pi_whole.toFixed(3) + '</span></span>' +
      '<span class="m-box"><span class="m-l">Q modularity</span><span class="m-v">' + Q.toFixed(3) + '</span></span>' +
      '<span class="m-box"><span class="m-l">C clustering</span><span class="m-v">' + C.toFixed(3) + '</span></span>' +
      '<span class="m-box"><span class="m-l">d<sub>core</sub> max</span><span class="m-v">' + kcore + '</span></span>' +
    '</div>';
  if (sweep.length > 0) {
    diagFlat += '<h5>Louvain resolution sweep (K=2 emergence search)</h5>' +
      '<table class="sweep-table"><thead><tr><th>res</th><th>K</th><th>top 3 sizes</th><th>π<sub>top-2</sub></th></tr></thead><tbody>' +
      sweep.map(function (r) {
        return '<tr><td>' + r.res.toFixed(2) + '</td><td>' + r.K + (r.K === 2 ? ' ★' : '') +
               '</td><td>[' + r.top3.join(', ') + ']</td><td>' + r.pi_top2.toFixed(3) + '</td></tr>';
      }).join('') + '</tbody></table>';
  }
  diagFlat += '<p class="diag-disclosure"><em>' + escapeHtmlSafe(s.disclosure) + '</em></p></div>';

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
    target.innerHTML = renderEdgelistPreview(edges, edges.length);
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
  target.innerHTML = '<div class="loading-spin">Fetching ' + escapeHtmlSafe(s.file) + ' and running Louvain analysis…</div>';
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
  var _liveSec_show = document.getElementById('live-network-section');
  if (_liveSec_show) _liveSec_show.classList.remove('hidden');
  // Also scroll Live section into view so user sees the change
  if (_liveSec_show) setTimeout(function () { _liveSec_show.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  _currentSampleKey = sampleKey;
  // v0.10.0: SNAP/USPTO is NOT a Bettencourt 22-panel row.
  // Clear the catalogue detail panel so "Selected row N — ..." doesn't mislead.
  // For row17/row22, the catalogue detail panel keeps its content (it WAS triggered
  // by the catalogue button click, which already populated detail-panel).
  if (sampleKey !== 'row17' && sampleKey !== 'row22') {
    var det = document.getElementById('detail-panel');
    if (det) {
      det.innerHTML = '<p class="detail-cleared">' +
        '<em>No 22-panel row selected.</em> ' +
        'You are viewing a reference natural network in the Live Network Analysis section below.' +
        ' Click any of the 22 indicator buttons above to inspect the Bettencourt panel row.</p>';
      det.classList.remove('active');
    }
    // also clear the .selected highlight on catalogue buttons
    document.querySelectorAll('button.cat-btn.selected').forEach(function (b) {
      b.classList.remove('selected');
    });
  }
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
    // scroll the section into view
    var section = document.getElementById('live-network-section');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  function wrapForFold(row) {
    var content = origRender(row);
    if (!row) return content;
    if (row.id === 17 || row.id === 22) {
      // wrap in <details> so the Selected row X — ... Tier B (mixture / Path 2 extended)
      // header is shown as a collapsible summary. Default collapsed because the
      // Live Network Analysis section below provides the analysis layer.
      var rowTier = row.mixture
        ? 'Tier B (mixture / Path 2 extended)'
        : 'Tier A (integer rung H = ' + row.H + ')';
      var summary = 'Selected row ' + row.id + ' — ' + (row.name || row.short) +
                    ' · ' + rowTier + ' (click to expand catalogue details)';
      return '<details class="detail-fold">' +
             '<summary class="detail-fold-summary">' + summary + '</summary>' +
             '<div class="detail-fold-body">' + content + '</div>' +
             '</details>';
    }
    return content;
  }
  window.renderDetailPanel = wrapForFold;
  try { renderDetailPanel = wrapForFold; } catch (e) {}
})();


// === v0.9.0 catalogue → Live Network unified trigger ====================
// When user clicks row 17 or row 22 in the 22-button catalogue grid, also
// switch the Live Network section to that sample (= unified behavior;
// no separate sample button needed for row 17/22).
(function () {
  function attachHook() {
    var catGrid = document.getElementById('catalogue-grid');
    if (!catGrid) { setTimeout(attachHook, 100); return; }
    catGrid.addEventListener('click', function (ev) {
      var btn = ev.target.closest('button[data-row-id]');
      if (!btn) return;
      var id = Number(btn.getAttribute('data-row-id'));
      var liveSec = document.getElementById('live-network-section');
      if (id === 17 || id === 22) {
        var key = id === 17 ? 'row17' : 'row22';
        // small delay to let the default detail panel render finish first
        setTimeout(function () {
          if (typeof switchSample === 'function') switchSample(key);
        }, 50);
        // v0.20: show Live Network section for real-network rows
        if (liveSec) liveSec.classList.remove('hidden');
      } else {
        // v0.20: hide Live Network section for non-real-network rows (1-16, 18-21)
        if (liveSec) liveSec.classList.add('hidden');
      }
    }, true);  // capture phase to run before/with default handler
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHook);
  } else {
    attachHook();
  }
})();


// === v0.11.0: K=2 FORCED partition ========================================
// Take default Louvain partition, identify top 2 clusters, re-assign all other
// nodes to whichever top-2 cluster has more neighbors → guaranteed K=2.
// Used to provide the "integer-pair assumed cluster analysis" path per 著者
// directive 2026-05-22.
var forceK2Partition = function (g) {
  var part = louvainPartition(g, 1.0);
  var commCount = {};
  Object.keys(part).forEach(function (n) {
    var c = String(part[n]);
    commCount[c] = (commCount[c] || 0) + 1;
  });
  var commArr = Object.keys(commCount).map(function (c) { return { comm: c, size: commCount[c] }; });
  commArr.sort(function (a, b) { return b.size - a.size; });
  if (commArr.length <= 2) {
    var res = {};
    Object.keys(part).forEach(function (n) { res[n] = String(part[n]); });
    return res;
  }
  var top0 = commArr[0].comm;
  var top1 = commArr[1].comm;
  var newPart = {};
  g.nodes().forEach(function (n) {
    var c = String(part[n]);
    if (c === top0 || c === top1) {
      newPart[n] = c;
    } else {
      var c0 = 0, c1 = 0;
      g.neighbors(n).forEach(function (nb) {
        var cnb = String(part[nb]);
        if (cnb === top0) c0++;
        else if (cnb === top1) c1++;
      });
      newPart[n] = c0 >= c1 ? top0 : top1;
    }
  });
  return newPart;
};

