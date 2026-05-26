/*
 * Bettencourt 22-Indicator Reference Catalogue
 * with Paper 4 Zero-Fitted-Exponent Ladder Predictions
 *
 * ★Paper4_β_predictor_3 v0.3.1  (tool/6/  2026-05-21)
 *
 * v0.3.0 → v0.3.1 diff (= 著者 chat feedback 6 件 反映):
 *   ① /tool/5/ "What is the scaling exponent β..." disclosure content embedded
 *      under the formula in the "What is this?" disclosure (no extra nesting).
 *   ② Short labels reworked: estbl→estab, hous→homes, hhld→hshld, scrt→creat,
 *      crim→crime, invt→invtr, pat#→patB (German-sounding/cryptic abbreviations removed).
 *   ③ Per-row `physical_meaning` field added; displayed in the detail panel under
 *      the structural assignment block. For mixture rows we show BOTH the H_low and
 *      H_up meanings (= author's "2 つの意味" option per chat clarification request).
 *   ④ Mixture row "ex post mixing-coordinate diagnostic" disclosure strengthened
 *      and surfaced at the H_eff line itself (not only buried in the method note).
 *   ⑤ Scroll target on button click changed: now scrolls the clicked button to
 *      the top of the viewport (= author's "ボタンの真上が一番上に出るくらい").
 *   ⑥ Zenodo concept DOI button (gold #c8a04a, same design as /ja/publications/)
 *      added in index.html between Paper 4 intro paragraph and the ladder formula
 *      paragraph in the About section.
 *
 * 反省 27-31 strict per (= same as v0.3.0).
 */

'use strict';

const indicators = [
  { id: 1,  short: "roads", name: "Length of road network",
    network_type: "physical infrastructure", substrate: "area-bounded",
    branch: "minus", mixture: false, H: 3,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 0.829, beta_obs: 0.830, ci: [0.74, 0.92],
    physical_meaning:
      "Right-of-way is a land-occupying physical network. With each city's land " +
      "footprint bounded by surrounding geography, doubling the population does " +
      "not double the road mileage; the network coordinates over fewer (~3) " +
      "intermediate hubs and the total length grows sub-linearly (sublinear, H=3).",
    source: "FHWA Highway Statistics + US Census TIGER/Line (paper4 author derivation per V261)",
    cite_url: "https://www.fhwa.dot.gov/policyinformation/statistics.cfm" },
  { id: 2,  short: "cable", name: "Length of electrical cable",
    network_type: "physical infrastructure", substrate: "volume-bounded",
    branch: "minus", mixture: false, H: 4,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 0.886, beta_obs: 0.870, ci: [0.82, 0.92],
    physical_meaning:
      "Electrical distribution is a bounded conduit / right-of-way utility " +
      "network. Slightly deeper substation hierarchy than roads (H=4); total " +
      "cable mileage scales sublinearly with city population.",
    source: "US EIA Form EIA-861 (electric utility distribution)",
    cite_url: "https://www.eia.gov/electricity/data/eia861/" },
  { id: 3,  short: "estab", name: "Establishments",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "balanced", mixture: false, H: 1,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.000, beta_obs: 1.000, ci: [0.99, 1.01],
    physical_meaning:
      "Number of business establishments per city. Population-proportional " +
      "by construction (each person's economic activity is one denominator " +
      "unit). Balanced row — Path 1 cross-branch cancellation, σ_gc = 0, β = 1.",
    source: "US Census Bureau County Business Patterns (CBP)",
    cite_url: "https://www.census.gov/programs-surveys/cbp.html" },
  { id: 4,  short: "homes", name: "Housing units",
    network_type: "hybrid", substrate: "mixed",
    branch: "balanced", mixture: false, H: 1,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.000, beta_obs: 1.000, ci: [0.99, 1.01],
    physical_meaning:
      "Total dwelling-unit stock. The physical dwelling stock and the " +
      "service/value layer cancel in opposite directions on the ladder, " +
      "yielding a balanced σ_gc = 0 outcome at β = 1.",
    source: "US Census Bureau American Community Survey (ACS) 5-Year Estimates",
    cite_url: "https://data.census.gov/" },
  { id: 5,  short: "hshld", name: "Households (proxy via Housing units)",
    network_type: "hybrid", substrate: "mixed",
    branch: "balanced", mixture: false, H: 1,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.000, beta_obs: 1.000, ci: [0.99, 1.01],
    physical_meaning:
      "Number of households per city. Proxied via housing-unit stock; the " +
      "same near-balanced cancellation operates, giving β = 1.",
    source: "US Census ACS (proxy via Housing units count, V261 author note)",
    cite_url: "https://data.census.gov/" },
  { id: 6,  short: "water", name: "Household water consumption",
    network_type: "hybrid", substrate: "mixed",
    branch: "balanced", mixture: false, H: 1,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.000, beta_obs: 1.010, ci: [0.89, 1.11],
    physical_meaning:
      "Domestic per-capita water consumption. Population-proportional with " +
      "small substrate-induced fluctuation; near-balanced linear under Path 1.",
    source: "USGS Water Use in the United States + EPA SDWIS",
    cite_url: "https://water.usgs.gov/watuse/" },
  { id: 7,  short: "empl", name: "Total employment",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "balanced", mixture: false, H: 1,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.000, beta_obs: 1.010, ci: [0.99, 1.02],
    physical_meaning:
      "Population-coupled labor-market stock. Each working-age person contributes " +
      "roughly one job; near Path-1 balanced (β = 1).",
    source: "BLS Quarterly Census of Employment and Wages (QCEW)",
    cite_url: "https://www.bls.gov/cew/" },
  { id: 8,  short: "elec", name: "Electricity (total consumption)",
    network_type: "hybrid", substrate: "mixed",
    branch: "plus", mixture: false, H: 6,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.065, beta_obs: 1.070, ci: [1.03, 1.11],
    physical_meaning:
      "Total kWh consumption per city. Aggregates a bounded grid (the cable/" +
      "transformer infrastructure) with the densifying socio-economic activity " +
      "on top; the deeper hybrid coordination depth (H=6) yields a slightly " +
      "superlinear scaling.",
    source: "US EIA Form EIA-861 + State Energy Data System (SEDS)",
    cite_url: "https://www.eia.gov/electricity/data/eia861/" },
  { id: 9,  short: "bank", name: "Bank deposits",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 5,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.083, beta_obs: 1.080, ci: [1.03, 1.11],
    physical_meaning:
      "Total deposits held in city banks. Financial coordination, with " +
      "physical bank branches forming only an access layer on top of a " +
      "deeper inter-firm capital network (H=5); superlinear.",
    source: "FDIC Summary of Deposits (SOD), yearly snapshot June 30",
    cite_url: "https://www.fdic.gov/resources/bankers/call-reports/" },
  { id: 10, short: "wage", name: "Total wages",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 4,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.114, beta_obs: 1.120, ci: [1.09, 1.13],
    physical_meaning:
      "Aggregate wage bill. Outcome of a labor-market matching network whose " +
      "intermediate-employer relays make the per-worker productivity in larger " +
      "cities higher (H=4); superlinear.",
    source: "BLS Quarterly Census of Employment and Wages (QCEW), total wages",
    cite_url: "https://www.bls.gov/cew/" },
  { id: 11, short: "creat", name: "Supercreative employment",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 3,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.171, beta_obs: 1.150, ci: [1.11, 1.18],
    physical_meaning:
      "Occupational stock in creative labor markets (Florida-class SOC " +
      "occupations). A 3-hop coordination network (researcher → firm → market) " +
      "produces a superlinear-of-H=3 scaling.",
    source: "BLS SOC + OEWS (Florida creative class SOC code filter)",
    cite_url: "https://www.bls.gov/oes/" },
  { id: 12, short: "gdpO", name: "GDP (US, OECD reference)",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 4,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.114, beta_obs: 1.099, ci: [1.06, 1.14],
    physical_meaning:
      "City-level GDP, OECD harmonised. Firm-labor-market transaction depth " +
      "H=4 — economic transactions densify in the same urban footprint.",
    source: "OECD Metropolitan Areas database + US BEA Regional GDP",
    cite_url: "https://stats.oecd.org/Index.aspx?DataSetCode=CITIES" },
  { id: 13, short: "gdpM", name: "GDP (US 1969-2003 MSA)",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 4,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.114, beta_obs: 1.099, ci: [1.06, 1.14],
    physical_meaning:
      "Same as row 12 but on the BEA historical MSA series — same H=4 " +
      "coordination depth and the same β_pred = 1.114.",
    source: "US BEA Regional GDP historical series (1969-2003 archival)",
    cite_url: "https://www.bea.gov/data/gdp/gdp-metropolitan-area" },
  { id: 14, short: "r&d", name: "R&D employment",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 2,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.311, beta_obs: 1.300, ci: [1.26, 1.34],
    physical_meaning:
      "Lab / firm / university / skilled-labor knowledge network. Only two " +
      "intermediate links (researcher → R&D team → result), so the network is " +
      "shallow and highly superlinear (H=2).",
    source: "NSF SESTAT + BLS SOC/OEWS (R&D scientist occupation codes)",
    cite_url: "https://ncses.nsf.gov/explore-data" },
  { id: 15, short: "crime", name: "Crime indices (proxy)",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 3,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.171, beta_obs: 1.160, ci: [1.11, 1.18],
    physical_meaning:
      "Interpersonal / opportunity-driven event process. Three-hop social " +
      "contact depth (offender → opportunity-context → victim) gives the " +
      "superlinear-at-H=3 rate.",
    source: "FBI Uniform Crime Reporting (UCR) - MSA-level annual",
    cite_url: "https://www.fbi.gov/services/cjis/ucr" },
  { id: 16, short: "phd", name: "Ph.D. holders (proxy via Supercreative)",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 3,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.171, beta_obs: 1.160, ci: [1.11, 1.18],
    physical_meaning:
      "Doctoral-holder stock per city. Proxied via the supercreative " +
      "creative-occupation network (H=3); same 3-hop knowledge-class " +
      "coordination depth, same β_pred = 1.171.",
    source: "NSF Survey of Earned Doctorates (SED) + US Census ACS education attainment",
    cite_url: "https://ncses.nsf.gov/surveys/earned-doctorates/" },
  { id: 17, short: "pat", name: "Patents (USPTO-CBSA 2010)",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: false, H: 2,
    H_pair: null, pi_low: null, pi_up: null, H_eff: null,
    beta_pred: 1.311, beta_obs: 1.298, ci: [1.198, 1.398],
    physical_meaning:
      "Patent count per MSA per year. Knowledge-output coordination at H=2 — " +
      "inventor → assignee with no fixed physical corridor per patent. Same " +
      "shallow knowledge network as R&D employment (highly superlinear).",
    source: "USPTO PatentsView bulk data tables (n = 378 MSAs, paper4 V264 line 3088)",
    cite_url: "https://patentsview.org/" },
  { id: 18, short: "gasS", name: "Gasoline sales",
    network_type: "physical infrastructure", substrate: "area-bounded",
    branch: "minus", mixture: true, H: null,
    H_pair: [2, 3], pi_low: 0.39, pi_up: 0.61, H_eff: 2.61,
    beta_pred: 0.790, beta_obs: 0.790, ci: [0.73, 0.80],
    physical_meaning_low:
      "At H=2 (shallower): flow on the vehicle-km substrate — direct dispensing " +
      "→ vehicle in two hops. A small fraction of sales (π_low ≈ 0.39) tracks " +
      "this shallower flow component.",
    physical_meaning_up:
      "At H=3 (deeper): flow on the station + road vehicle-km substrate — " +
      "dispensing → station network → roads. The dominant fraction of sales " +
      "(π_up ≈ 0.61) tracks this deeper coordination.",
    physical_meaning_mix:
      "Gasoline sales are a flow on a mixed area-bounded substrate (station " +
      "footprint + road throughput). The integer-pair {H=2, H=3} bracketing " +
      "captures both shallow and deeper coordination simultaneously.",
    source: "US DOE/EIA Petroleum Marketing Annual + OPIS retail data",
    cite_url: "https://www.eia.gov/petroleum/" },
  { id: 19, short: "gasN", name: "Gasoline stations",
    network_type: "physical infrastructure", substrate: "area-bounded",
    branch: "minus", mixture: true, H: null,
    H_pair: [2, 3], pi_low: 0.39, pi_up: 0.61, H_eff: 2.61,
    beta_pred: 0.790, beta_obs: 0.770, ci: [0.74, 0.81],
    physical_meaning_low:
      "At H=2 (shallower): parcel-based dispensing facility — direct land " +
      "footprint per station.",
    physical_meaning_up:
      "At H=3 (deeper): station network embedded in road right-of-way + " +
      "storage / supply network. The dominant fraction (π_up ≈ 0.61) " +
      "captures this deeper bundling.",
    physical_meaning_mix:
      "Gasoline stations are parcel-based facilities with bounded land / " +
      "storage. Same integer-pair {H=2, H=3} bracketing as gasoline sales " +
      "(row 18) — same substrate, different observed quantity.",
    source: "US Census CBP (NAICS 447 gasoline stations) + EIA Petroleum Marketing Annual",
    cite_url: "https://www.census.gov/programs-surveys/cbp.html" },
  { id: 20, short: "AIDS", name: "Disease (AIDS) deaths",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: true, H: null,
    H_pair: [2, 3], pi_low: 0.55, pi_up: 0.45, H_eff: 2.45,
    beta_pred: 1.230, beta_obs: 1.230, ci: [1.18, 1.29],
    physical_meaning_low:
      "At H=2 (shallower): direct contact-network transmission — partner → " +
      "partner in 2 hops. The π_low ≈ 0.55 share reflects this direct " +
      "contact mode.",
    physical_meaning_up:
      "At H=3 (deeper): community-level contact + reporting layer — partner " +
      "→ community context → reporting infrastructure. The π_up ≈ 0.45 " +
      "share captures this deeper reporting-network coordination.",
    physical_meaning_mix:
      "Reported AIDS cases reflect a contact / reporting network on an " +
      "unbounded socio-economic substrate. The integer-pair {H=2, H=3} " +
      "bracketing simultaneously captures the direct contact and the " +
      "reporting-layer coordination.",
    source: "CDC NCHHSTP AtlasPlus (HIV/AIDS new cases per 100K population)",
    cite_url: "https://www.cdc.gov/nchhstp/atlas/" },
  { id: 21, short: "invtr", name: "Inventors",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: true, H: null,
    H_pair: [2, 3], pi_low: 0.68, pi_up: 0.32, H_eff: 2.32,
    beta_pred: 1.250, beta_obs: 1.250, ci: [1.22, 1.27],
    physical_meaning_low:
      "At H=2 (shallower): direct knowledge-output role — inventor → " +
      "assignee in 2 hops. The dominant π_low ≈ 0.68 share matches the " +
      "patents (row 17) H=2 strict reading.",
    physical_meaning_up:
      "At H=3 (deeper): inventor → research team → assignee — adds the " +
      "team-coordination layer. The π_up ≈ 0.32 share captures this " +
      "deeper coordination component.",
    physical_meaning_mix:
      "Inventors are a labor / knowledge-network role, not area-bounded. " +
      "The {H=2, H=3} integer-pair bracketing keeps the strict knowledge-" +
      "output reading (H=2) primary and adds the team-coordination layer.",
    source: "USPTO PatentsView (Inventor table, distinct from Patents count)",
    cite_url: "https://patentsview.org/" },
  { id: 22, short: "patB", name: "Patents (Bettencourt 2007 legacy)",
    network_type: "socio-economic coordination", substrate: "unbounded densification",
    branch: "plus", mixture: true, H: null,
    H_pair: [2, 3], pi_low: 0.90, pi_up: 0.10, H_eff: 2.10,
    beta_pred: 1.289, beta_obs: 1.270, ci: [1.25, 1.29],
    physical_meaning_low:
      "At H=2 (strict knowledge-output): same as the modern USPTO-CBSA " +
      "row 17 (β±(2) = 1.311) — direct inventor → assignee. The dominant " +
      "π_low ≈ 0.90 share matches the strict reading.",
    physical_meaning_up:
      "At H=3 (looser community-coordination): the small π_up ≈ 0.10 " +
      "share reflects pooling, multi-year aggregation, or covariance-" +
      "adjusted methodology in the original 2007 panel.",
    physical_meaning_mix:
      "The Bettencourt 2007 legacy patents panel is retained for cross-" +
      "paper continuity. The {H=2, H=3} bracketing with strong π_low " +
      "weighting reproduces the original interval [1.25, 1.29] while " +
      "keeping the modern strict reading H=2 primary.",
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
    lines.push('    <li>Relay depth H: <strong>' + row.H + '</strong></li>');
  } else {
    lines.push('    <li>Mixture flag: YES (Tier B mixing-coordinate diagnostic per V262 §S-Heff §3)</li>');
    lines.push('    <li>Adjacent rung pair: H ∈ {' + row.H_pair[0] + ', ' + row.H_pair[1] + '}</li>');
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

  lines.push('  <p class="dsection-head">Physical meaning of the relay depth H ' +
             '(per V264 §S-PanelOrigins assignment-provenance table):</p>');
  if (!row.mixture) {
    lines.push('  <p class="dphys">' + escapeHtml(row.physical_meaning) + '</p>');
  } else {
    lines.push('  <div class="dphys-mix">');
    lines.push('    <p class="dphys-line"><span class="dphys-head">At H=' + row.H_pair[0] +
               ' (shallower coordination, weight π<sub>' + row.H_pair[0] + '</sub> ≈ ' +
               fmt(row.pi_low, 2) + '):</span> ' + escapeHtml(row.physical_meaning_low) + '</p>');
    lines.push('    <p class="dphys-line"><span class="dphys-head">At H=' + row.H_pair[1] +
               ' (deeper coordination, weight π<sub>' + row.H_pair[1] + '</sub> ≈ ' +
               fmt(row.pi_up, 2) + '):</span> ' + escapeHtml(row.physical_meaning_up) + '</p>');
    lines.push('    <p class="dphys-line"><span class="dphys-head">Why mixture:</span> ' +
               escapeHtml(row.physical_meaning_mix) + '</p>');
    lines.push('  </div>');
  }

  if (!row.mixture) {
    const sgn = (row.branch === "minus") ? "−" : (row.branch === "plus" ? "+" : "±");
    if (row.branch === "balanced") {
      lines.push('  <p class="dformula">Paper 4 ladder: balanced indicator → β = 1.000 ' +
                 '(Path 1 cross-branch cancellation, σ<sub>gc</sub> = 0)</p>');
    } else {
      lines.push('  <p class="dformula">Paper 4 ladder β<sub>pred</sub> = β' + sgn +
                 '(H=' + row.H + ') = 1 ' + sgn + ' 1 / [' + row.H + ' · ln(' + (2 * row.H + 1) + ')] ' +
                 '≈ <strong>' + fmt(row.beta_pred, 3) + '</strong></p>');
    }
  } else {
    const sgn = (row.branch === "minus") ? "−" : "+";
    lines.push('  <p class="dformula">Paper 4 ladder β<sub>pred</sub> = β' + sgn +
               '(H<sub>eff</sub> = ' + fmt(row.H_eff, 2) +
               ') ≈ <strong>' + fmt(row.beta_pred, 3) + '</strong> ' +
               '(by construction recovers β<sub>obs</sub> within the pre-specified ' +
               '{H=' + row.H_pair[0] + ', H=' + row.H_pair[1] + '} pair)</p>');
  }

  if (!row.mixture) {
    const ok = tierAMatch(row);
    lines.push('  <p class="dmatch ' + (ok ? 'ok' : 'miss') + '">Match: ' +
               (ok ? '✓ β<sub>pred</sub> ∈ β<sub>obs</sub> CI ' + fmtCi(row.ci, 3) :
                     '✗ β<sub>pred</sub> ∉ β<sub>obs</sub> CI ' + fmtCi(row.ci, 3)) +
               '</p>');
  } else {
    const b = tierBBracket(row);
    const hullStr = '[' + fmt(b.hullLo, 3) + ', ' + fmt(b.hullHi, 3) + ']';
    lines.push('  <p class="dmatch ' + (b.directMatch ? 'ok' : (b.intersect ? 'bracket' : 'miss')) + '">');
    lines.push('    Match: ' +
      (b.directMatch
        ? '✓ β<sub>pred</sub> ∈ β<sub>obs</sub> CI ' + fmtCi(row.ci, 3)
        : (b.intersect
            ? '✓ bracketing: convex hull [β±(H<sub>up</sub>), β±(H<sub>low</sub>)] = ' + hullStr +
              ' intersects β<sub>obs</sub> CI ' + fmtCi(row.ci, 3)
            : '✗ no bracketing intersection')));
    lines.push('  </p>');
  }

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
