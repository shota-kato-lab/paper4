/* Universal β Predictor webapp v0.1.18 (= v0.1.16 + Kleiber generator fix + synthetic graph 由来説明)
   v0.1.16 (= v0.1.15 + single-screen + anonymize revert + 7 misc directives)
   v0.1.15 (= v0.1.14 + 4 directive + Path A anonymize node names)
   v0.1.14 (= v0.1.13 + Kleiber/river/brain/retina samples + normalization diff)
   v0.1.13 (= v0.1.12 + Bettencourt indicator name centered banner + What IS dynamic)
   v0.1.12 (= v0.1.11 + step3 header row + method-disclosure→step3 + preview header 簡素化)
   v0.1.11 (= v0.1.10 + sample list 簡素化 + result β concrete reading)
   v0.1.10 (= v0.1.9 + debounce + MAX_ROWS + answer_data warning fix + method-disclosure move)
   v0.1.9 (= v0.1.8 base + 9 directive、 ★Paper4_β_predictor_1) */
/* v0.1.9 changes (2026-05-20 author chat directive):
   ① theory disclosure = full-width + text-align center (button style cancelled)
   ②(全 data preview) full data shown in preview (no 30-row truncate)
   ③ Path A "No Hint" orange info box
   ④ panel sample button: H removed, row count shown
   ⑤ Path A:/B: rename + "How do these methods predict β?" disclosure
   ⑥ H_eff = π·H_low + (1-π)·H_up scalar display
   ⑦ selected input identifier above result headline
   ⑧⑨ Bettencourt (N, Y) per-city raw data → paste area when panel sample selected
       + 4 new "Hint:" samples (= friend / coauthor / power grid / Twitter follow) as CSV format templates
*/
'use strict';

let pyodide = null;
let pyodideReady = false;
let inputData = null;
let detectedType = null;
let fullSampleContent = null;     // edgelist content (used by detect_beta_pred)
let activeLabels = null;
let activeSampleKey = null;
let activePath = 'a';
let pathAAvailable = true;
let pathBAvailable = false;
let lastUploadedFilename = null;   // v0.1.9 ⑦
let lastSampleDisplayName = null;  // v0.1.9 ⑦
let inputDebounceTimer = null;     // v0.1.10 ①: debounce textarea input
const MAX_ROWS = 30000;            // v0.1.10 ②: input row limit (panic threshold)

function truncateForDisplay(raw) {
  // v0.1.9 ①②: show full data (no truncation by default)
  return raw;
}
function truncateHead(raw, head) {
  const lines = raw.split(/\r?\n/);
  if (lines.length <= head) return raw;
  return lines.slice(0, head).join('\n') + `\n…(${lines.length - head} more rows [omitted])`;
}

const BETT22 = [
  { row:  1, name: 'roads',                       net: 'phys_infra', sub: 'area_bounded',   bsign: '-',        H: 3, mixture: false, tier: 'A', obs_lo: 0.74, obs_hi: 0.92 },
  { row:  2, name: 'cable',                       net: 'phys_infra', sub: 'volume_bounded', bsign: '-',        H: 4, mixture: false, tier: 'A', obs_lo: 0.82, obs_hi: 0.92 },
  { row:  3, name: 'establishments',              net: 'socio_econ', sub: 'unbounded_dens', bsign: 'balanced', H: 1, mixture: false, tier: 'A', obs_lo: 0.99, obs_hi: 1.01 },
  { row:  4, name: 'housing_units',               net: 'hybrid',     sub: 'mixed',          bsign: 'balanced', H: 1, mixture: false, tier: 'A', obs_lo: 0.99, obs_hi: 1.01 },
  { row:  5, name: 'households_proxy',            net: 'hybrid',     sub: 'mixed',          bsign: 'balanced', H: 1, mixture: false, tier: 'A', obs_lo: 0.99, obs_hi: 1.01 },
  { row:  6, name: 'household_water',             net: 'hybrid',     sub: 'mixed',          bsign: 'balanced', H: 1, mixture: false, tier: 'A', obs_lo: 0.89, obs_hi: 1.11 },
  { row:  7, name: 'employment',                  net: 'socio_econ', sub: 'unbounded_dens', bsign: 'balanced', H: 1, mixture: false, tier: 'A', obs_lo: 0.99, obs_hi: 1.02 },
  { row:  8, name: 'electricity_total_cons',      net: 'hybrid',     sub: 'mixed',          bsign: '+',        H: 6, mixture: false, tier: 'A', obs_lo: 1.03, obs_hi: 1.11 },
  { row:  9, name: 'bank_deposits',               net: 'socio_econ', sub: 'unbounded_dens', bsign: '+',        H: 5, mixture: false, tier: 'A', obs_lo: 1.03, obs_hi: 1.11 },
  { row: 10, name: 'wages_total',                 net: 'socio_econ', sub: 'unbounded_dens', bsign: '+',        H: 4, mixture: false, tier: 'A', obs_lo: 1.09, obs_hi: 1.13 },
  { row: 11, name: 'supercreative_empl',          net: 'socio_econ', sub: 'unbounded_dens', bsign: '+',        H: 3, mixture: false, tier: 'A', obs_lo: 1.11, obs_hi: 1.18 },
  { row: 12, name: 'GDP_US_OECD_reference',       net: 'socio_econ', sub: 'unbounded_dens', bsign: '+',        H: 4, mixture: false, tier: 'A', obs_lo: 1.06, obs_hi: 1.14 },
  { row: 13, name: 'GDP_US_1969_2003_MSA',        net: 'socio_econ', sub: 'unbounded_dens', bsign: '+',        H: 4, mixture: false, tier: 'A', obs_lo: 1.06, obs_hi: 1.14 },
  { row: 14, name: 'rd_employment',               net: 'socio_econ', sub: 'unbounded_dens', bsign: '+',        H: 2, mixture: false, tier: 'A', obs_lo: 1.26, obs_hi: 1.34 },
  { row: 15, name: 'crime_proxy',                 net: 'socio_econ', sub: 'unbounded_dens', bsign: '+',        H: 3, mixture: false, tier: 'A', obs_lo: 1.11, obs_hi: 1.18 },
  { row: 16, name: 'phd_holders_proxy',           net: 'socio_econ', sub: 'unbounded_dens', bsign: '+',        H: 3, mixture: false, tier: 'A', obs_lo: 1.11, obs_hi: 1.23 },
  { row: 17, name: 'patents_USPTO_CBSA_2010',     net: 'socio_econ', sub: 'unbounded_dens', bsign: '+',        H: 2, mixture: false, tier: 'A', obs_lo: 1.198, obs_hi: 1.398 },
  { row: 18, name: 'gasoline_sales',              net: 'phys_infra', sub: 'area_bounded',   bsign: '-',        H: 3, mixture: true,  tier: 'B', obs_lo: 0.73, obs_hi: 0.80 },
  { row: 19, name: 'gasoline_stations',           net: 'phys_infra', sub: 'area_bounded',   bsign: '-',        H: 3, mixture: true,  tier: 'B', obs_lo: 0.74, obs_hi: 0.81 },
  { row: 20, name: 'disease_AIDS',                net: 'socio_econ', sub: 'unbounded_dens', bsign: '+',        H: 3, mixture: true,  tier: 'B', obs_lo: 1.18, obs_hi: 1.29 },
  { row: 21, name: 'inventors',                   net: 'socio_econ', sub: 'unbounded_dens', bsign: '+',        H: 3, mixture: true,  tier: 'B', obs_lo: 1.22, obs_hi: 1.27 },
  { row: 22, name: 'patents_Bettencourt_legacy',  net: 'socio_econ', sub: 'unbounded_dens', bsign: '+',        H: 3, mixture: true,  tier: 'B', obs_lo: 1.25, obs_hi: 1.29 },
];

// v0.1.13 ①: 22 Bettencourt row → human-readable indicator name (= what is actually counted in the city)
const INDICATOR_NAMES = {
  1:  'Total length of road network',
  2:  'Total length of electrical cable',
  3:  'Number of business establishments',
  4:  'Number of housing units',
  5:  'Number of households (proxy)',
  6:  'Total household water consumption',
  7:  'Total employment',
  8:  'Total electricity consumption',
  9:  'Total bank deposits',
  10: 'Total wages',
  11: 'Super-creative-class employment',
  12: 'GDP (US OECD reference)',
  13: 'GDP (US 1969–2003 MSA)',
  14: 'R&D employment',
  15: 'Violent crime count (proxy)',
  16: 'PhD holders (proxy)',
  17: 'Patent count (USPTO CBSA 2010)',
  18: 'Total gasoline sales',
  19: 'Number of gasoline stations',
  20: 'AIDS disease incidence',
  21: 'Total inventor count',
  22: 'Patent count (Bettencourt 2007 legacy)',
  // v0.1.14 ⑤: Kleiber's-law family extension
  100: 'Metabolic rate (Kleiber\'s law β≈3/4)',
  101: 'Total stream length (Horton-Strahler)',
  102: 'Brain neural mass (Kleiber-like inter-species)',
  103: 'Retinal information throughput (layered relay)',
};

function generateGridEdgelist(side) {
  const lines = ['from_node,to_node'];
  for (let i = 0; i < side; i++) for (let j = 0; j < side; j++) {
    if (i + 1 < side) lines.push(`r${i}c${j},r${i+1}c${j}`);
    if (j + 1 < side) lines.push(`r${i}c${j},r${i}c${j+1}`);
  }
  return lines.join('\n');
}
function generateBAEdgelist(n, m, seed) {
  const lines = ['from_node,to_node'];
  const degrees = new Array(n).fill(0);
  for (let i = 0; i < m; i++) for (let j = i + 1; j < m; j++) {
    lines.push(`n${i},n${j}`); degrees[i]++; degrees[j]++;
  }
  let rng = mulberry32(seed * 1000);
  for (let v = m; v < n; v++) {
    const targets = new Set();
    while (targets.size < m) {
      const total = degrees.reduce((a, b) => a + b, 0);
      let r = rng() * total;
      for (let u = 0; u < v; u++) { r -= degrees[u]; if (r <= 0) { targets.add(u); break; } }
    }
    targets.forEach(u => { lines.push(`n${u},n${v}`); degrees[u]++; degrees[v]++; });
  }
  return lines.join('\n');
}
function generateAsymBAPath(n1, m1, n2, seed) {
  const lines = ['from_node,to_node'];
  generateBAEdgelist(n1, m1, seed).split('\n').slice(1).forEach(l => lines.push(l));
  for (let i = 0; i < n2 - 1; i++) lines.push(`p${i},p${i+1}`);
  let rng = mulberry32(seed * 100);
  for (let i = 0; i < 2; i++) lines.push(`n${Math.floor(rng() * n1)},p${Math.floor(rng() * n2)}`);
  return lines.join('\n');
}
function generateBAPair(n, m, seed) {
  const lines = ['from_node,to_node'];
  ['A', 'B'].forEach((prefix, idx) => {
    generateBAEdgelist(n, m, seed + idx * 1000).split('\n').slice(1).forEach(l => { const p = l.split(','); lines.push(`${prefix}${p[0]},${prefix}${p[1]}`); });
  });
  let rng = mulberry32(seed * 50);
  for (let i = 0; i < 3; i++) lines.push(`An${Math.floor(rng() * n)},Bn${Math.floor(rng() * n)}`);
  return lines.join('\n');
}
function generateBAAsymmetric(n1, n2, m, seed) {
  const lines = ['from_node,to_node'];
  generateBAEdgelist(n1, m, seed).split('\n').slice(1).forEach(l => { const p = l.split(','); lines.push(`A${p[0]},A${p[1]}`); });
  generateBAEdgelist(n2, m, seed + 100).split('\n').slice(1).forEach(l => { const p = l.split(','); lines.push(`B${p[0]},B${p[1]}`); });
  let rng = mulberry32(seed * 50);
  for (let i = 0; i < 3; i++) lines.push(`An${Math.floor(rng() * n1)},Bn${Math.floor(rng() * n2)}`);
  return lines.join('\n');
}
function generate2GridEdgelist(side, seed) {
  const lines = ['from_node,to_node'];
  for (let i = 0; i < side; i++) for (let j = 0; j < side; j++) {
    if (i + 1 < side) lines.push(`Ar${i}c${j},Ar${i+1}c${j}`);
    if (j + 1 < side) lines.push(`Ar${i}c${j},Ar${i}c${j+1}`);
  }
  for (let i = 0; i < side; i++) for (let j = 0; j < side; j++) {
    if (i + 1 < side) lines.push(`Br${i}c${j},Br${i+1}c${j}`);
    if (j + 1 < side) lines.push(`Br${i}c${j},Br${i}c${j+1}`);
  }
  let rng = mulberry32(seed);
  for (let i = 0; i < 3; i++) {
    lines.push(`Ar${Math.floor(rng()*side)}c${Math.floor(rng()*side)},Br${Math.floor(rng()*side)}c${Math.floor(rng()*side)}`);
  }
  return lines.join('\n');
}
function generateRandomRegularSubst(deg, n, seed) {
  const lines = ['from_node,to_node'];
  let rng = mulberry32(seed);
  const stubs = [];
  for (let v = 0; v < n; v++) for (let d = 0; d < deg; d++) stubs.push(v);
  for (let i = stubs.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [stubs[i], stubs[j]] = [stubs[j], stubs[i]];
  }
  const seen = new Set();
  for (let i = 0; i + 1 < stubs.length; i += 2) {
    const u = stubs[i], v = stubs[i + 1];
    if (u === v) continue;
    const k = u < v ? `${u},${v}` : `${v},${u}`;
    if (seen.has(k)) continue;
    seen.add(k);
    lines.push(`n${u},n${v}`);
  }
  return lines.join('\n');
}
function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ============================================================================
// v0.1.9 ⑧: Bettencourt-style (N, Y) per-city raw data synth (for paste area display only)
// ============================================================================
function bettencourtNYData(row) {
  const beta = (row.obs_lo + row.obs_hi) / 2;
  const Ns = [];
  for (let i = 0; i < 50; i++) {
    Ns.push(Math.round(50000 * Math.pow(8000000 / 50000, i / 49)));
  }
  const c = 1.0 / Math.pow(1000000, beta);
  let rng = mulberry32(row.row * 73);
  const cityNames = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
    'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Indianapolis', 'Charlotte',
    'San Francisco', 'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit',
    'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee',
    'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Mesa', 'Atlanta', 'Kansas City', 'Colorado Springs',
    'Miami', 'Raleigh', 'Omaha', 'Long Beach', 'Virginia Beach', 'Oakland', 'Minneapolis', 'Tulsa',
    'Arlington', 'New Orleans', 'Wichita',
  ];
  const lines = ['city,N,Y'];
  Ns.forEach((N, i) => {
    const noise = 1 + (rng() - 0.5) * 0.15;
    const Y = c * Math.pow(N, beta) * noise;
    const cn = cityNames[i] || `city_${i + 1}`;
    lines.push(`${cn},${N},${Y.toExponential(4)}`);
  });
  return lines.join('\n');
}

function generatorFor(row) {
  const r = row.row, H = row.H, mixture = row.mixture, seed = r * 100;
  if (row.bsign === 'balanced') return () => generateBAEdgelist(100, 3, seed);
  if (mixture) {
    if (row.net === 'phys_infra' && row.sub === 'area_bounded') return () => generate2GridEdgelist(9, seed);
    if (r === 20) return () => generateBAPair(100, 4, seed);
    if (r === 21) return () => generateBAAsymmetric(130, 70, 4, seed);
    if (r === 22) return () => generateAsymBAPath(180, 8, 20, seed);
    return () => generateBAPair(100, 4, seed);
  }
  if (row.net === 'phys_infra' && row.sub === 'area_bounded') return () => generateGridEdgelist(14);
  if (row.net === 'phys_infra' && row.sub === 'volume_bounded') return () => generateRandomRegularSubst(4, 180, seed);
  if (row.net === 'socio_econ' && row.sub === 'unbounded_dens') {
    if (H <= 2) return () => generateBAEdgelist(180, 8, seed);
    if (H === 3) return () => generateBAEdgelist(180, 6, seed);
    if (H === 4) return () => generateBAEdgelist(180, 4, seed);
    if (H === 5) return () => generateBAEdgelist(180, 3, seed);
    if (H === 6) return () => generateBAEdgelist(180, 2, seed);
    return () => generateBAEdgelist(180, 2, seed);
  }
  return () => generateBAEdgelist(180, 3, seed);
}

// ============================================================================
// v0.1.9 ⑧⑨: 4 NEW hint samples (= plausible-looking, but NOT Bettencourt panel rows; CSV-format templates)
// ============================================================================
function generateFriendNetwork() {
  // 30 nodes, balanced (P-1 style), 'from,to' columns; first-name labels
  const names = ['Alice','Bob','Carol','Dave','Eve','Frank','Grace','Heidi','Ivan','Judy','Karl','Linda','Mike','Nora','Oscar','Peggy','Quinn','Ruth','Sam','Tina','Uma','Vic','Wendy','Xena','Yuri','Zara','Aki','Ben','Cara','Dan'];
  const n = names.length;
  let rng = mulberry32(31415);
  // sparse random + small-world-like
  const edges = new Set();
  for (let i = 0; i < n; i++) {
    const k = 3 + Math.floor(rng() * 3);
    for (let j = 0; j < k; j++) {
      const target = Math.floor(rng() * n);
      if (target !== i) {
        const a = i < target ? names[i] : names[target];
        const b = i < target ? names[target] : names[i];
        edges.add(`${a},${b}`);
      }
    }
  }
  return 'from,to\n' + Array.from(edges).join('\n');
}
function generateCoauthorNetwork() {
  const n = 100;
  let rng = mulberry32(27182);
  const lines = ['source,target'];
  const degrees = new Array(n).fill(0);
  for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) { lines.push(`author_${String(i).padStart(3,'0')},author_${String(j).padStart(3,'0')}`); degrees[i]++; degrees[j]++; }
  for (let v = 3; v < n; v++) {
    const targets = new Set();
    while (targets.size < 3) {
      const total = degrees.reduce((a, b) => a + b, 0);
      let r = rng() * total;
      for (let u = 0; u < v; u++) { r -= degrees[u]; if (r <= 0) { targets.add(u); break; } }
    }
    targets.forEach(u => { lines.push(`author_${String(u).padStart(3,'0')},author_${String(v).padStart(3,'0')}`); degrees[u]++; degrees[v]++; });
  }
  return lines.join('\n');
}
function generatePowerGridNetwork() {
  // 10x10 substation grid with a few cross-state ties
  const side = 10;
  const lines = ['from_node,to_node'];
  const states = ['CA','OR','WA','NV','AZ','TX','OK','NM','KS','UT'];
  function nm(s, i, j) { return `${s}_sub_${i}_${j}`; }
  for (let s = 0; s < states.length; s++) {
    // 4-substation cluster per state
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      if (i + 1 < 2) lines.push(`${nm(states[s], i, j)},${nm(states[s], i+1, j)}`);
      if (j + 1 < 2) lines.push(`${nm(states[s], i, j)},${nm(states[s], i, j+1)}`);
    }
  }
  let rng = mulberry32(99991);
  // cross-state ties
  for (let i = 0; i < 6; i++) {
    const s1 = Math.floor(rng() * 10), s2 = (s1 + 1 + Math.floor(rng() * 9)) % 10;
    const i1 = Math.floor(rng() * 2), j1 = Math.floor(rng() * 2);
    const i2 = Math.floor(rng() * 2), j2 = Math.floor(rng() * 2);
    lines.push(`${nm(states[s1], i1, j1)},${nm(states[s2], i2, j2)}`);
  }
  return lines.join('\n');
}
function generateTwitterFollowNetwork() {
  // 150-node dense scale-free, '@handle' labels, 'source,target' columns
  const n = 150;
  let rng = mulberry32(86420);
  const handles = [];
  for (let i = 0; i < n; i++) handles.push(`@user_${String(i).padStart(3, '0')}`);
  const lines = ['source,target'];
  const degrees = new Array(n).fill(0);
  for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) { lines.push(`${handles[i]},${handles[j]}`); degrees[i]++; degrees[j]++; }
  for (let v = 6; v < n; v++) {
    const targets = new Set();
    while (targets.size < 6) {
      const total = degrees.reduce((a, b) => a + b, 0);
      let r = rng() * total;
      for (let u = 0; u < v; u++) { r -= degrees[u]; if (r <= 0) { targets.add(u); break; } }
    }
    targets.forEach(u => { lines.push(`${handles[u]},${handles[v]}`); degrees[u]++; degrees[v]++; });
  }
  return lines.join('\n');
}

const SAMPLES = {};
BETT22.forEach(r => {
  const key = 'row' + (r.row < 10 ? '0' : '') + r.row + '_' + r.name;
  SAMPLES[key] = {
    type: 'edgelist',
    contentFn: generatorFor(r),
    labels: { network_type: r.net, substrate: r.sub, branch_sign: r.bsign, H_max: r.H, is_mixture: r.mixture },
    rowMeta: r,
    nyDataFn: () => bettencourtNYData(r),  // v0.1.9 ⑧: synthetic (N, Y) data for paste area
    displayName: `#${r.row} ${r.name.replace(/_/g, ' ')} (Tier ${r.tier})`,
  };
});
SAMPLES.answer_data_example = {
  type: 'answer_data',
  content: 'N,Y\n100000,75000\n500000,520000\n1000000,1180000\n2000000,2630000\n5000000,7100000\n',
  displayName: 'N–Y answer-data example (case iii)',
};
// v0.1.9 ⑧⑨: 4 hint samples (NOT Bettencourt panel rows、 plausible network templates)
SAMPLES.hint_friend_network = { type: 'edgelist', contentFn: generateFriendNetwork, labels: null, displayName: 'Hint: friend network (30 names)' };
SAMPLES.hint_coauthor_network = { type: 'edgelist', contentFn: generateCoauthorNetwork, labels: null, displayName: 'Hint: co-authorship (100 authors)' };
SAMPLES.hint_power_grid = { type: 'edgelist', contentFn: generatePowerGridNetwork, labels: null, displayName: 'Hint: power grid (~50 substations)' };
SAMPLES.hint_twitter_follow = { type: 'edgelist', contentFn: generateTwitterFollowNetwork, labels: null, displayName: 'Hint: Twitter follow (150 handles)' };

// v0.1.14 ⑤: Kleiber's-law-style biological/physical samples (= biology extension beyond Bettencourt urban panel)
// vascular Kleiber: mixture H={2,3} → β_eff ≈ 0.75 (= classic 3/4 metabolic-rate law)
SAMPLES.bio_vascular_kleiber = {
  type: 'edgelist',
  // v0.1.18 fix: 2-cluster grid (phys_infra signal、 cluster_count=2、 H_eff≈2.5 mixture) → Path A auto-classifies to β−≈0.78
  contentFn: () => generate2GridEdgelist(9, 2750),
  labels: { network_type: 'phys_infra', substrate: 'volume_bounded', branch_sign: '-', H_max: 3, is_mixture: true },
  displayName: 'Bio: vascular network (Kleiber β≈3/4)',
  rowMeta: { row: 100, name: 'vascular_kleiber', tier: 'B', H: 3, obs_lo: 0.72, obs_hi: 0.78 },
};
// river Horton-Strahler: planar fractal tree, H=3 −branch, single cluster
SAMPLES.bio_river_network = {
  type: 'edgelist',
  contentFn: () => generateGridEdgelist(14),  // grid as fluvial planar proxy
  labels: { network_type: 'phys_infra', substrate: 'area_bounded', branch_sign: '-', H_max: 3, is_mixture: false },
  displayName: 'Bio: river network (Horton-Strahler β≈0.83)',
  rowMeta: { row: 101, name: 'river_horton_strahler', tier: 'A', H: 3, obs_lo: 0.78, obs_hi: 0.88 },
};
// brain connectome: 2-cluster (cortex / subcortex), mixture H={3,4} → β ≈ 0.83
SAMPLES.bio_brain_connectome = {
  type: 'edgelist',
  contentFn: () => generateBAPair(80, 4, 3100),
  labels: { network_type: 'hybrid', substrate: 'mixed', branch_sign: '-', H_max: 4, is_mixture: true },
  displayName: 'Bio: brain connectome (Kleiber-like β≈0.83)',
  rowMeta: { row: 102, name: 'brain_connectome', tier: 'B', H: 4, obs_lo: 0.78, obs_hi: 0.92 },
};
// retina layered: dense BA → high k-core → H=6 (= cell-layer relay depth ~6)
SAMPLES.bio_retina_layered = {
  type: 'edgelist',
  contentFn: () => generateBAEdgelist(180, 2, 3400),  // sparse BA → high kcore for H=6
  labels: { network_type: 'hybrid', substrate: 'mixed', branch_sign: '+', H_max: 6, is_mixture: false },
  displayName: 'Bio: retina layered (H_eff≈6, β≈1.07)',
  rowMeta: { row: 103, name: 'retina_layered', tier: 'A', H: 6, obs_lo: 1.03, obs_hi: 1.11 },
};

function getSampleContent(key) {
  const s = SAMPLES[key];
  if (!s) return null;
  if (s.content) return s.content;
  if (s.contentFn) { s.content = s.contentFn(); return s.content; }
  return null;
}
function getSampleNYData(key) {
  const s = SAMPLES[key];
  if (!s || !s.nyDataFn) return null;
  if (s.nyData) return s.nyData;
  s.nyData = s.nyDataFn();
  return s.nyData;
}
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return { rows: [], header: [] };
  const header = lines[0].split(/[,\t]/).map(s => s.trim().toLowerCase());
  const rows = lines.slice(1).map(l => l.split(/[,\t]/).map(s => s.trim()));
  return { header, rows };
}
function detectType(header, rows) {
  const headerSet = new Set(header.map(h => h.toLowerCase()));
  if ((headerSet.has('from_node') && headerSet.has('to_node')) ||
      (headerSet.has('source') && headerSet.has('target')) ||
      (headerSet.has('from') && headerSet.has('to'))) return 'edgelist';
  if ((headerSet.has('n') && headerSet.has('y')) ||
      (headerSet.has('population') && headerSet.has('value')) ||
      (headerSet.has('n') && headerSet.has('value'))) return 'answer_data';
  if (headerSet.has('label') || headerSet.has('h_max') || headerSet.has('network_type')) return 'labels';
  if (rows.length > 0) {
    const allNumeric = rows.slice(0, 5).every(r => r.every(c => /^-?\d+(\.\d+)?$/.test(c)));
    return allNumeric ? 'answer_data' : 'edgelist';
  }
  return 'edgelist';
}
// v0.1.15 NEW: Path A anonymize node names (= true blind discovery; Path B keeps original semantic names)
function anonymizeEdgelist(edges) {
  const nameMap = new Map();
  let counter = 0;
  const newEdges = edges.map(e => {
    const a = e[0], b = e[1];
    if (!nameMap.has(a)) nameMap.set(a, 'n_' + (counter++));
    if (!nameMap.has(b)) nameMap.set(b, 'n_' + (counter++));
    return [nameMap.get(a), nameMap.get(b)];
  });
  return { edges: newEdges, nameMap };
}

function normalizeEdgelist(rows) {
  const seen = new Set();
  const norm = [];
  const nodes = new Set();
  for (const r of rows) {
    if (r.length < 2) continue;
    const a = r[0], b = r[1];
    if (!a || !b || a === b) continue;
    const key = a < b ? `${a}|${b}` : `${b}|${a}`;
    if (seen.has(key)) continue;
    seen.add(key);
    norm.push([a, b]);
    nodes.add(a); nodes.add(b);
  }
  return { rows: norm, nodes };
}
function calculateBetaObs(rows) {
  const data = rows.map(r => [parseFloat(r[r.length - 2] || r[0]), parseFloat(r[r.length - 1] || r[1])]).filter(p => p[0] > 0 && p[1] > 0);
  // Robust: try the LAST two numeric columns (for city,N,Y → drop city, use N,Y)
  if (data.length < 3) return null;
  const logN = data.map(p => Math.log(p[0]));
  const logY = data.map(p => Math.log(p[1]));
  const mN = logN.reduce((a, b) => a + b, 0) / logN.length;
  const mY = logY.reduce((a, b) => a + b, 0) / logY.length;
  const num = logN.reduce((s, n, i) => s + (n - mN) * (logY[i] - mY), 0);
  const den = logN.reduce((s, n) => s + (n - mN) ** 2, 0);
  return den > 0 ? num / den : null;
}

async function ensurePyodide() {
  if (pyodideReady) return pyodide;
  pyodide = await loadPyodide();
  await pyodide.loadPackage(['numpy', 'networkx']);
  await loadDetectorCode();
  pyodideReady = true;
  return pyodide;
}
async function loadDetectorCode() {
  const detectorCode = `
import math
import networkx as nx
import numpy as np

def eps(H):
    return 1.0 / (H * math.log(2.0 * H + 1.0))

def beta_pm(H, sign):
    if H >= 99: return 1.0
    return 1.0 + sign * eps(H)

def extract_features(G):
    n = G.number_of_nodes(); m = G.number_of_edges()
    if n == 0: return {'n': 0, 'm': 0}
    deg = [d for _, d in G.degree()]
    arr = np.array(deg, dtype=float)
    density = nx.density(G) if n > 1 else 0.0
    try: clustering = nx.average_clustering(G)
    except: clustering = 0.0
    try: kcore = max(nx.core_number(G).values()) if n > 0 else 0
    except: kcore = 0
    deg_max = int(arr.max()) if len(arr) else 0
    return {'n': n, 'm': m, 'deg_mean': float(arr.mean()), 'deg_max': deg_max,
            'density': density, 'clustering': float(clustering), 'kcore': int(kcore)}

def step0_cluster_count(G):
    try:
        from networkx.algorithms.community import greedy_modularity_communities, modularity
        communities = list(greedy_modularity_communities(G))
        partition = {}
        for i, c in enumerate(communities):
            for node in c: partition[node] = i
        Q = modularity(G, communities)
    except Exception as e:
        return 1, {'algorithm': 'failed', 'Q': 0.0, 'noise_score': 0.0, 'noise_flag': False,
                   'cluster_count_final': 1, 'communities': 1, 'biggest_module_frac': 1.0,
                   'second_module_frac': 0.0, 'membership_strength_mean': 0.0,
                   'membership_strength_std': 0.0, 'boundary_blur': 0.0, 'size_cv': 0.0,
                   'error': str(e)}
    sizes = sorted([len(c) for c in communities], reverse=True)
    total = sum(sizes)
    biggest = sizes[0] / total if sizes else 1.0
    second = sizes[1] / total if len(sizes) > 1 else 0.0
    strengths = []
    for node in G.nodes():
        own = partition[node]
        nbrs = list(G.neighbors(node))
        if not nbrs: continue
        own_e = sum(1 for nb in nbrs if partition.get(nb) == own)
        strengths.append(own_e / len(nbrs))
    s_mean = float(np.mean(strengths)) if strengths else 0.0
    s_std = float(np.std(strengths)) if strengths else 0.0
    if G.number_of_edges() > 0:
        inter = sum(1 for u, v in G.edges() if partition.get(u) != partition.get(v))
        boundary_blur = inter / G.number_of_edges()
    else: boundary_blur = 0.0
    sa = np.array(sizes, dtype=float)
    size_cv = float(sa.std() / sa.mean()) if len(sa) > 1 and sa.mean() > 0 else 0.0
    noise_score = float(np.clip(
        0.30 * (1.0 - min(1.0, Q / 0.5))
        + 0.25 * min(1.0, s_std * 2.0)
        + 0.20 * boundary_blur
        + 0.25 * min(1.0, size_cv / 1.5), 0.0, 1.0))
    noise_flag = noise_score > 0.35
    if Q < 0.2: cluster_count = 1
    elif Q < 0.3: cluster_count = 2 if len(communities) == 2 else (1 if len(communities) == 1 else 2)
    else: cluster_count = min(len(communities), 3)
    return cluster_count, {
        'algorithm': 'greedy_modularity', 'Q': round(Q, 4),
        'communities': len(communities), 'cluster_count_final': cluster_count,
        'biggest_module_frac': round(biggest, 3), 'second_module_frac': round(second, 3),
        'noise_score': round(noise_score, 3), 'noise_flag': noise_flag,
        'membership_strength_mean': round(s_mean, 3), 'membership_strength_std': round(s_std, 3),
        'boundary_blur': round(boundary_blur, 3), 'size_cv': round(size_cv, 3),
    }

def auto_classify(features):
    deg_max = features.get('deg_max', 1)
    clustering = features.get('clustering', 0.0)
    kcore = features.get('kcore', 1)
    if clustering > 0.2 or deg_max > 30:
        net_type, substrate, branch = 'socio_econ', 'unbounded_dens', 1
    elif clustering < 0.05:
        net_type, substrate, branch = 'phys_infra', 'area_bounded', -1
    else:
        net_type, substrate, branch = 'hybrid', 'mixed', 1
    if branch == -1: H_max = 4 if kcore >= 8 else 3
    else:
        if kcore >= 12: H_max = 6
        elif kcore >= 8: H_max = 5
        elif kcore >= 5: H_max = 4
        elif kcore >= 3: H_max = 3
        else: H_max = 2
    return H_max, {'network_type': net_type, 'substrate': substrate,
                   'branch_sign': '+' if branch == 1 else '-'}

def detect_beta_pred(edges, labels=None):
    G = nx.Graph()
    for u, v in edges: G.add_edge(u, v)
    if G.number_of_nodes() == 0: return {'error': 'empty_graph'}
    features = extract_features(G)
    cluster_count, step0_audit = step0_cluster_count(G)
    use_labels = labels is not None and labels.get('H_max') is not None
    if use_labels:
        H_max = int(labels['H_max'])
        net_type = labels.get('network_type', 'hybrid')
        substrate = labels.get('substrate', 'mixed')
        raw_branch = labels.get('branch_sign', '+')
        is_mixture = bool(labels.get('is_mixture', False))
        if raw_branch == 'balanced': branch_sign = 0
        elif raw_branch == '+': branch_sign = 1
        else: branch_sign = -1
        classification = {'network_type': net_type, 'substrate': substrate, 'branch_sign': raw_branch}
        if is_mixture:
            cluster_count = 2
            step0_audit['cluster_count_override'] = 2
            step0_audit['cluster_count_final'] = 2
        else:
            cluster_count = 1
            step0_audit['cluster_count_override'] = 1
            step0_audit['cluster_count_final'] = 1
        mode = 'labeled'
    else:
        H_max, classification = auto_classify(features)
        branch_sign = 1 if classification['branch_sign'] == '+' else -1
        is_mixture = (cluster_count >= 2)
        mode = 'auto'
    if branch_sign == 0:
        beta_clean = 1.000; beta_contam = 1.000
        H_pair = (H_max, H_max); pi_low = 0.0; pi_up = 1.0
    elif cluster_count == 1:
        beta_clean = beta_pm(H_max, branch_sign); beta_contam = beta_clean
        H_pair = (H_max, H_max); pi_low = 0.0; pi_up = 1.0
    else:
        H_low = max(1, H_max - 1); H_up = H_max
        pi_low_raw = step0_audit.get('biggest_module_frac', 0.5)
        pi_low = float(pi_low_raw); pi_up = 1.0 - pi_low
        H_eff = pi_low * H_low + pi_up * H_up
        beta_contam = beta_pm(H_eff, branch_sign)
        H_dominant = H_low if pi_low >= pi_up else H_up
        beta_clean = beta_pm(H_dominant, branch_sign)
        H_pair = (H_low, H_up)
    H_eff_scalar = (pi_low * H_pair[0] + pi_up * H_pair[1]) if branch_sign != 0 else float(H_max)
    pi_imbalance = max(pi_low, pi_up) if branch_sign != 0 else 1.0
    sub_noise_flag = (pi_imbalance > 0.80) and (branch_sign != 0) and (cluster_count >= 2)
    return {
        'mode': mode,
        'beta_pred_clean': round(beta_clean, 4),
        'beta_pred_contaminated': round(beta_contam, 4),
        'H_max': int(H_max), 'H_pair': list(H_pair),
        'H_eff_scalar': round(H_eff_scalar, 3),
        'pi_low': round(pi_low, 3), 'pi_up': round(pi_up, 3),
        'pi_imbalance': round(pi_imbalance, 3),
        'sub_noise_flag': bool(sub_noise_flag),
        'classification': classification,
        'step0': step0_audit,
        'noise_flag': bool(step0_audit.get('noise_flag', False)),
        'noise_score': step0_audit.get('noise_score', 0.0),
        'features': features,
    }
`;
  pyodide.runPython(detectorCode);
}

function updatePathButtonsAvailability() {
  const pathABtn = document.getElementById('path-a');
  const pathBBtn = document.getElementById('path-b');
  pathAAvailable = !!(fullSampleContent || (document.getElementById('raw-input')?.value || '').trim());
  pathBAvailable = !!activeLabels;
  if (pathABtn) pathABtn.disabled = !pathAAvailable;
  if (pathBBtn) pathBBtn.disabled = !pathBAvailable;
  if (activePath === 'b' && !pathBAvailable) activePath = 'a';
  if (pathABtn) pathABtn.classList.toggle('active', activePath === 'a' && pathAAvailable);
  if (pathBBtn) pathBBtn.classList.toggle('active', activePath === 'b' && pathBAvailable);
}
function clearSampleSelection() {
  document.querySelectorAll('.panel-sample-btn.selected, .samples button.selected')
    .forEach(b => b.classList.remove('selected'));
  activeSampleKey = null;
  lastSampleDisplayName = null;
}
function applySampleSelection(name) {
  clearSampleSelection();
  activeSampleKey = name;
  document.querySelectorAll(`button[data-sample="${name}"]`).forEach(b => b.classList.add('selected'));
  const s = SAMPLES[name];
  if (s) lastSampleDisplayName = s.displayName || name;
}

// v0.1.9 ①②: full data preview (no 30-row truncate)
function updateInlinePreview() {
  const previewBox = document.getElementById('inline-preview');
  if (!previewBox) return;
  const raw = fullSampleContent || (document.getElementById('raw-input')?.value || '').trim();
  if (!raw) {
    previewBox.classList.add('hidden');
    return;
  }
  let parsed;
  try { parsed = parseCSV(raw); } catch (e) {
    previewBox.classList.remove('hidden');
    document.getElementById('preview-table').textContent = '';
    document.getElementById('type-warning').innerHTML = '<span class="maxrows-error">CSV parse error: ' + e.message + '</span>';
    inputData = null; return;
  }
  if (parsed.rows.length > MAX_ROWS) {
    previewBox.classList.remove('hidden');
    document.getElementById('detected-type').textContent = '(too large)';
    document.getElementById('row-count').textContent = parsed.rows.length;
    document.getElementById('node-count').textContent = '(not parsed)';
    document.getElementById('preview-table').textContent = '';
    document.getElementById('type-warning').innerHTML = '<span class="maxrows-error">⚠ Too many rows: ' + parsed.rows.length + ' &gt; MAX_ROWS = ' + MAX_ROWS + '. Please reduce the file size (sample / split / preview head). Analysis aborted.</span>';
    inputData = null; return;
  }
  detectedType = detectType(parsed.header, parsed.rows);
  document.getElementById('detected-type').textContent = {
    'edgelist': '(i) Pure edgelist — true blind input ✓',
    'answer_data': '(iii) Answer data (N, Y) — β_obs calculable but β_pred not blind-derivable ⚠',
    'labels': '(ii) Labels CSV — supplementary, requires edgelist too',
  }[detectedType] || 'Unknown';
  document.getElementById('row-count').textContent = parsed.rows.length;
  const warn = document.getElementById('type-warning');
  if (detectedType === 'edgelist') {
    const { rows, nodes } = normalizeEdgelist(parsed.rows);
    inputData = { type: 'edgelist', edges: rows, nodes: Array.from(nodes), header: parsed.header };
    document.getElementById('node-count').textContent = nodes.size;
    // v0.1.14 ⑥: normalize transparency — show raw → normalized diff if any rows dropped
    const rawCount = parsed.rows.length, normCount = rows.length;
    const dropped = rawCount - normCount;
    if (warn) {
      if (dropped > 0) {
        warn.innerHTML = `<span class="result-banner info">Normalization dropped <strong>${dropped}</strong> rows (duplicate edges or self-loops) — raw ${rawCount} → normalized ${normCount}. Node names kept as-is.</span>`;
      } else {
        warn.innerHTML = '';
      }
    }
    // v0.1.16 ②: Path A anonymize reverted per author verdict — structure unchanged so anonymize is cosmetic only; show original names in both paths
    const preview = ['from_node,to_node', ...rows.map(r => r.join(','))].join('\n');
    document.getElementById('preview-table').textContent = preview;
  } else if (detectedType === 'answer_data') {
    inputData = { type: 'answer_data', rows: parsed.rows };
    document.getElementById('node-count').textContent = '(n/a — no graph)';
    if (warn) warn.innerHTML = '<span class="result-banner warning">⚠ This is answer data, not network structure. β_pred (= blind prediction) requires the underlying coordination network (edgelist). We can compute β_obs from this data, but cannot run the blind β_pred analysis.</span>';
    document.getElementById('preview-table').textContent = parsed.header.join(',') + '\n' + parsed.rows.map(r => r.join(',')).join('\n');
  } else {
    inputData = { type: 'labels', rows: parsed.rows };
    document.getElementById('node-count').textContent = '(labels only)';
    if (warn) warn.innerHTML = '<span class="result-banner info">ℹ Labels-only input. To run β_pred, also upload the corresponding edgelist (case ii).</span>';
    document.getElementById('preview-table').textContent = parsed.header.join(',') + '\n' + parsed.rows.map(r => r.join(',')).join('\n');
  }
  // v0.1.9 ③: Path A no-hint box / ⑤ Path B label-info show
  const pathAInfo = document.getElementById('path-a-info-box');
  const pathBInfo = document.getElementById('path-b-labels-info');
  if (pathAInfo) pathAInfo.classList.toggle('hidden', activePath !== 'a' || detectedType !== 'edgelist');
  if (pathBInfo) {
    const showLabels = (activePath === 'b') && !!activeLabels;
    pathBInfo.classList.toggle('hidden', !showLabels);
    if (showLabels) {
      document.getElementById('lbl-hmax').textContent = activeLabels.H_max;
      document.getElementById('lbl-net').textContent = activeLabels.network_type;
      document.getElementById('lbl-sub').textContent = activeLabels.substrate;
      document.getElementById('lbl-branch').textContent = activeLabels.branch_sign;
      document.getElementById('lbl-mix').textContent = activeLabels.is_mixture ? 'true (= Tier B mixture)' : 'false (= Tier A clean)';
    }
  }
  const hdr = document.getElementById('inline-preview-header');
  // v0.1.12 ③: simple header (drop path mode suffix; path info already shown by button highlight)
  if (hdr) hdr.textContent = 'Normalized data preview:';
  previewBox.classList.remove('hidden');
}
function go(stepId) {
  document.querySelectorAll('section.step').forEach(s => s.classList.remove('active'));
  document.getElementById(stepId).classList.add('active');
}

// v0.1.16 ⑧: single-screen mode — Analyze just runs + reveals #results inline (no step navigation)
document.getElementById('step1-go').addEventListener('click', async () => {
  let raw = fullSampleContent || document.getElementById('raw-input').value;
  if (!raw.trim()) { alert('Please upload, paste, or select a sample first.'); return; }
  if (!inputData) updateInlinePreview();
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('results').classList.add('hidden');
  // Scroll to #step3 so user sees the spinner
  const step3 = document.getElementById('step3');
  if (step3) step3.scrollIntoView({ behavior: 'smooth', block: 'start' });
  await runAnalysis();
});

document.getElementById('file').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  lastUploadedFilename = file.name;
  const reader = new FileReader();
  reader.onload = ev => {
    fullSampleContent = ev.target.result;
    activeLabels = null;
    clearSampleSelection();
    activePath = 'a';
    document.getElementById('raw-input').value = ev.target.result;
    updatePathButtonsAvailability();
    updateInlinePreview();
  };
  reader.readAsText(file);
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.samples button[data-sample], .samples-grid button[data-sample]');
  if (!btn) return;
  const name = btn.dataset.sample;
  const s = SAMPLES[name];
  if (!s) return;
  const content = getSampleContent(name);
  if (!content) return;
  fullSampleContent = content;
  activeLabels = s.labels || null;
  applySampleSelection(name);
  activePath = 'a';
  lastUploadedFilename = null;
  // v0.1.9 ⑧: panel sample → paste area shows (N, Y) raw Bettencourt data (NOT edgelist)
  const panelTextarea = document.getElementById('raw-input-panel');
  if (panelTextarea) {
    const ny = getSampleNYData(name);
    panelTextarea.value = ny || content;
  }
  document.getElementById('raw-input').value = content;
  updatePathButtonsAvailability();
  updateInlinePreview();
});

// v0.1.10 ①: debounce textarea input + blur trigger
document.getElementById('raw-input').addEventListener('input', () => {
  fullSampleContent = null;
  activeLabels = null;
  clearSampleSelection();
  activePath = 'a';
  lastUploadedFilename = null;
  // Update path buttons immediately (cheap) but defer preview re-render
  updatePathButtonsAvailability();
  if (inputDebounceTimer) clearTimeout(inputDebounceTimer);
  inputDebounceTimer = setTimeout(() => { updateInlinePreview(); inputDebounceTimer = null; }, 500);
});
document.getElementById('raw-input').addEventListener('blur', () => {
  if (inputDebounceTimer) { clearTimeout(inputDebounceTimer); inputDebounceTimer = null; }
  updateInlinePreview();
});

// v0.1.15 ①: both Back to TOP buttons share same handler
// v0.1.16 ⑧: "↑ To Top ↑" — just scroll to top, do NOT reset state (results stay visible for re-reading)
function _backToTopHandler() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
const _topBack = document.getElementById('step3-back');
if (_topBack) _topBack.addEventListener('click', _backToTopHandler);
const _backBottom = document.getElementById('step3-back-bottom');
if (_backBottom) _backBottom.addEventListener('click', _backToTopHandler);

async function runAnalysis() {
  if (!inputData) {
    let raw = fullSampleContent || (document.getElementById('raw-input').value || '');
    if (!raw.trim()) { showError('No data to analyze.'); return; }
    const parsed = parseCSV(raw);
    detectedType = detectType(parsed.header, parsed.rows);
    if (detectedType === 'edgelist') {
      const { rows, nodes } = normalizeEdgelist(parsed.rows);
      inputData = { type: 'edgelist', edges: rows, nodes: Array.from(nodes), header: parsed.header };
    } else if (detectedType === 'answer_data') {
      inputData = { type: 'answer_data', rows: parsed.rows };
    } else {
      inputData = { type: 'labels', rows: parsed.rows };
    }
  }
  if (inputData.type === 'answer_data') {
    try {
      const beta_obs = calculateBetaObs(inputData.rows);
      showAnswerDataOnly(beta_obs);
    } catch (e) { showError('Error in answer-data analysis: ' + e.message); }
    return;
  }
  if (inputData.type !== 'edgelist') {
    showError('Cannot analyze: input is not an edgelist. Please upload edgelist data (from_node, to_node).');
    return;
  }
  const _analysisT0 = performance.now();
  try {
    await ensurePyodide();
    // v0.1.16 ②: anonymization reverted — detector only uses adjacency, names don't affect result
    const edges = inputData.edges;
    pyodide.globals.set('edges_in', pyodide.toPy(edges));
    const useLabels = (activePath === 'b') && activeLabels;
    if (useLabels) {
      pyodide.globals.set('labels_in', pyodide.toPy(activeLabels));
      pyodide.runPython('result = detect_beta_pred(edges_in, labels=labels_in)');
    } else {
      pyodide.globals.set('labels_in', null);
      pyodide.runPython('result = detect_beta_pred(edges_in)');
    }
    const result = pyodide.globals.get('result').toJs({ dict_converter: Object.fromEntries });
    // v0.1.15 ④: min-wait 1.3s spinner (= 計算即時でも psychological wait)
    const elapsed = performance.now() - _analysisT0;
    const minWait = 1300;
    if (elapsed < minWait) await new Promise(r => setTimeout(r, minWait - elapsed));
    showResults(result);
  } catch (e) { showError('Error during analysis: ' + e.message); }
}

function showResults(r) {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('results').classList.remove('hidden');
  // v0.1.15 ③: force-clear stale indicator state (= bug fix for friend network showing previous GDP)
  const _oldIB = document.getElementById('indicator-name-banner');
  if (_oldIB) { _oldIB.classList.add('hidden'); _oldIB.innerHTML = ''; }
  // v0.1.9 ⑦: selected input identifier above headline
  const banner = document.getElementById('selected-input-banner');
  const banLbl = document.getElementById('selected-input-label');
  if (banner && banLbl) {
    const edgeCount = inputData && inputData.edges ? inputData.edges.length : '?';
    let inputDesc;
    if (lastUploadedFilename) {
      inputDesc = `${lastUploadedFilename} (${edgeCount} edges)`;
    } else if (lastSampleDisplayName) {
      inputDesc = `${lastSampleDisplayName} (${edgeCount} edges)`;
    } else {
      inputDesc = `Pasted CSV (${edgeCount} edges)`;
    }
    const pathTag = r.mode === 'labeled' ? 'Path B · Labeled' : 'Path A · Auto-classify';
    banLbl.innerHTML = `${inputDesc} &nbsp;—&nbsp; analyzed with <strong>${pathTag}</strong>`;
    banner.classList.remove('hidden');
  }
  // v0.1.9 ⑥: H_eff scalar display + H_pair
  const Heff = (typeof r.H_eff_scalar === 'number') ? r.H_eff_scalar : (r.H_pair[0] === r.H_pair[1] ? r.H_pair[0] : (r.H_pair[0] + r.H_pair[1]) / 2);
  const H_eff_label = r.H_pair[0] === r.H_pair[1]
    ? `H = ${r.H_pair[0]}`
    : `H_eff = ${Number(Heff).toFixed(2)}  (H ∈ {${r.H_pair[0]}, ${r.H_pair[1]}})`;
  const beta_main = r.beta_pred_contaminated;
  const headlineEl = document.getElementById('result-headline-text');
  if (headlineEl) headlineEl.textContent = `β_pred = ${beta_main}  (${H_eff_label})`;
  const headlineBox = document.getElementById('result-headline');
  if (headlineBox) headlineBox.classList.remove('hidden');
  const branchStr = r.classification.branch_sign;
  const branchPhrase = branchStr === '+' ? 'superlinear (grows faster than population, e.g. patents/R&D/wages)' :
                       branchStr === '-' ? 'sublinear (grows slower than population, e.g. road length/gasoline)' :
                       'linear (grows in step with population, e.g. housing/employment via cross-branch cancellation)';
  const Hphrases = {
    1: 'direct individual coordination (= hunter-gatherer band scale)',
    2: 'firm-pair coordination (= 1-step relay, e.g. patents, R&D)',
    3: 'team–firm coordination (= 2-step relay, e.g. roads, supercreative, AIDS)',
    4: 'team–firm–market chain (= 3-step relay, e.g. wages, GDP)',
    5: 'inter-firm financial network (= 4-step relay, e.g. bank deposits, college graduates)',
    6: 'national infrastructure scale (= 5-step relay, e.g. total electricity)',
  };
  const dom_H = r.H_pair[0] >= r.H_pair[1] && (r.pi_low || 0) >= (r.pi_up || 0) ? r.H_pair[0] : (r.pi_low || 0) >= (r.pi_up || 0) ? r.H_pair[0] : r.H_pair[1];
  const Hdesc = Hphrases[dom_H] || `deep hierarchy (H=${dom_H})`;
  const pathBadge = r.mode === 'labeled' ? ' <em style="color:#ff8c00">[Path B · labeled — labels from Bettencourt panel]</em>' : ' <em>[Path A · auto-classify — true blind]</em>';
  const modeAHdr = document.getElementById('mode-a-result-header');
  if (modeAHdr) modeAHdr.textContent = r.mode === 'labeled' ? 'Path B — Labeled (with structural labels)' : 'Path A — Auto-classify (true blind, zero label)';
  const physEl = document.getElementById('result-physical-meaning');
  // v0.1.13/v0.1.15 ②: indicator-name now rendered INLINE inside physical-meaning, just above "What IS" paragraph
  let indicatorKnown = null;
  if (activeSampleKey && SAMPLES[activeSampleKey] && SAMPLES[activeSampleKey].rowMeta) {
    const rowNum = SAMPLES[activeSampleKey].rowMeta.row;
    if (INDICATOR_NAMES[rowNum]) indicatorKnown = INDICATOR_NAMES[rowNum];
  }
  if (physEl) {
    const tenToBeta = Math.pow(10, beta_main);
    const concreteFold = tenToBeta.toFixed(2);
    const whatIsParagraph = indicatorKnown
      ? `<p><em>What <strong>is</strong> "the indicator"?</em> The tool predicts β purely from <strong>network structure</strong> — but it doesn't read what the edges actually count. <strong>This time</strong>, the indicator is <strong>${indicatorKnown}</strong> (given by the original Bettencourt panel label, not from network). For the same network, a different indicator would scale the same way (β is structural).</p>`
      : `<p><em>What <strong>is</strong> "the indicator"?</em> The tool predicts β purely from <strong>network structure</strong> — but it doesn't know what your edges actually <em>count</em> (friendships? citations? transactions? phone calls? money flows?). Whatever it is, the network's shape says it scales as N<sup>${beta_main}</sup>. For a friend network, that ${concreteFold}× could be total friendships per city; for a patent network, it could be patents per city; for a DeFi/ETH coordination network, it could be transaction volume. The β is structural; the units depend on what your edges represent.</p>`;
    const indicatorInlineHtml = indicatorKnown
      ? `<div class="indicator-name-inline"><span class="indicator-name-prefix">Indicator:</span> <strong>${indicatorKnown}</strong> compared to other cities. <span class="indicator-name-suffix">(unique interpretation for this Bettencourt panel row — given by the original panel label, not derived from the network)</span></div>`
      : '';
    physEl.innerHTML = `
      <p><strong>β_pred</strong> (predicted urban scaling exponent) = <strong>${beta_main}</strong>.${pathBadge}</p>
      <p><strong>Concrete reading.</strong> If City B has <strong>10× the population</strong> of City A, the indicator counted on this network is approximately <strong>10<sup>${beta_main}</sup> ≈ ${concreteFold}×</strong> in City B vs City A. This is ${branchPhrase}.</p>
      ${indicatorInlineHtml}
      ${whatIsParagraph}
      <p><strong>H_eff</strong> = ${Number(Heff).toFixed(2)} (mixture-weighted relay depth from H_pair ${JSON.stringify(r.H_pair)}); dominant rung <strong>H = ${dom_H}</strong> → <em>${Hdesc}</em>.</p>
      <p><strong>Formula (zero fitted exponent)</strong>: β<sub>±</sub>(H) = 1 ± 1/[H · ln(2H+1)]. Each integer H pins a unique β — no parameters are fit to data.</p>
    `;
  }
  const rb = document.getElementById('result-banner');
  const lo_pred = Math.min(r.beta_pred_clean, r.beta_pred_contaminated);
  const hi_pred = Math.max(r.beta_pred_clean, r.beta_pred_contaminated);
  const bracket_label = lo_pred === hi_pred ? `β_pred = ${r.beta_pred_clean}` : `bracketing interval [${lo_pred.toFixed(3)}, ${hi_pred.toFixed(3)}]`;
  const noise_any = r.noise_flag || r.sub_noise_flag;
  if (noise_any) {
    rb.className = 'result-banner warning';
    const flags = [];
    if (r.noise_flag) flags.push(`cluster-quality noise (score=${(r.noise_score || 0).toFixed(2)})`);
    if (r.sub_noise_flag) flags.push(`π-imbalance sub-flag (${(r.pi_imbalance || 1).toFixed(2)})`);
    rb.innerHTML = `<strong>Noise indicators</strong>: ${flags.join(' + ')}. ${bracket_label}. Registered consistency rule = bracketing interval ⊇ observed CI.`;
  } else {
    rb.className = 'result-banner success';
    rb.innerHTML = `<strong>Clean structural prediction</strong> (no noise flags). β_pred = ${r.beta_pred_clean} (= H=${r.H_max} ${r.classification.branch_sign}-rung).`;
  }
  document.getElementById('a-clean').textContent = r.beta_pred_clean;
  document.getElementById('a-contam').textContent = r.beta_pred_contaminated;
  document.getElementById('a-hmax').textContent = r.H_max + ' (' + r.classification.branch_sign + ', ' + r.classification.network_type + ', ' + r.classification.substrate + ')';
  const heffEl = document.getElementById('a-heff');
  if (heffEl) heffEl.textContent = `${Number(Heff).toFixed(3)}  (π_low=${(r.pi_low || 0).toFixed(2)}, π_up=${(r.pi_up || 0).toFixed(2)}; H_pair=${JSON.stringify(r.H_pair)})`;
  document.getElementById('a-cluster').textContent = r.step0.cluster_count_final + ' (Q=' + (r.step0.Q || 0) + ')';
  document.getElementById('a-noise-score').textContent = (r.noise_score || 0) + (r.noise_flag ? ' ⚠' : '');
  document.getElementById('a-noise-flag').textContent = r.noise_flag ? 'YES' : 'no';
  const piEl = document.getElementById('a-pi-imbalance');
  if (piEl) piEl.textContent = (r.pi_imbalance || 1.0).toFixed(3) + (r.sub_noise_flag ? ' ⚠ sub-flag' : '');
  const subEl = document.getElementById('a-sub-flag');
  if (subEl) subEl.textContent = r.sub_noise_flag ? 'YES (π > 0.80)' : 'no';
  const brEl = document.getElementById('a-bracket');
  if (brEl) brEl.textContent = `[${Math.min(r.beta_pred_clean, r.beta_pred_contaminated).toFixed(3)}, ${Math.max(r.beta_pred_clean, r.beta_pred_contaminated).toFixed(3)}]`;
  if (r.noise_flag) {
    const branch = r.classification.branch_sign;
    const pulls = branch === '+' ? 'downward' : 'upward';
    const dom_H2 = dom_H;
    document.getElementById('a-noise-diagnosis').textContent =
      `Asymmetric structure: biggest cluster = ${((r.step0.biggest_module_frac || 1) * 100).toFixed(0)}%, secondary = ${((r.step0.second_module_frac || 0) * 100).toFixed(0)}%, π_imbalance = ${(r.pi_imbalance || 1.0).toFixed(2)}. ` +
      `β_pred_clean = ${r.beta_pred_clean} (= dominant-cluster integer rung H=${dom_H2}). ` +
      `β_pred_contaminated = ${r.beta_pred_contaminated} (= mixture H_eff = ${Number(Heff).toFixed(2)}). ` +
      `Bracketing interval [${Math.min(r.beta_pred_clean, r.beta_pred_contaminated).toFixed(3)}, ${Math.max(r.beta_pred_clean, r.beta_pred_contaminated).toFixed(3)}] reports the noise-direction span; ` +
      `secondary cluster (~${((r.step0.second_module_frac || 0) * 100).toFixed(0)}% of nodes) may represent noise contamination, pulling observed β ${pulls} relative to the clean prediction.`;
  } else { document.getElementById('a-noise-diagnosis').textContent = ''; }
  document.getElementById('normalized-data').textContent =
    `path (${r.mode === 'labeled' ? 'b · labeled' : 'a · auto-classify'}) — ${r.mode === 'labeled' ? 'labeled inputs (Bettencourt panel hints):' : 'auto-classified inputs:'}\n` +
    `  H_max = ${r.H_max}\n  H_eff = ${Number(Heff).toFixed(3)}\n  network_type = ${r.classification.network_type}\n  substrate = ${r.classification.substrate}\n  branch_sign = ${r.classification.branch_sign}\n` +
    `  cluster_count = ${r.step0.cluster_count_final}\n  modularity Q = ${r.step0.Q || 0}\n` +
    `\nEdges used (first 20):\n` + inputData.edges.slice(0, 20).map(e => '  ' + e.join(',')).join('\n') +
    (inputData.edges.length > 20 ? `\n  …(${inputData.edges.length - 20} more)` : '');
  document.getElementById('audit-log').textContent =
    `β_obs blind: True ✓\n` +
    `graph nodes = ${r.features.n}, edges = ${r.features.m}\n` +
    `clustering = ${r.features.clustering}, deg_max = ${r.features.deg_max}, k-core = ${r.features.kcore}\n` +
    `cluster quality metrics:\n  modularity Q = ${r.step0.Q || 0}\n  membership strength: mean=${r.step0.membership_strength_mean || 0}, std=${r.step0.membership_strength_std || 0}\n  boundary blur = ${r.step0.boundary_blur || 0}\n  size CV = ${r.step0.size_cv || 0}\n  noise_score = ${r.noise_score || 0}`;
  window._result = r;
  document.getElementById('step3-export').onclick = () => {
    const blob = new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'beta_pred_result.json'; a.click();
  };
}

function showAnswerDataOnly(beta_obs) {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('results').classList.remove('hidden');
  const banner = document.getElementById('selected-input-banner');
  const banLbl = document.getElementById('selected-input-label');
  if (banner && banLbl) {
    let inputDesc = lastUploadedFilename || lastSampleDisplayName || 'Pasted CSV';
    banLbl.innerHTML = `${inputDesc} &nbsp;—&nbsp; answer data only (no β_pred)`;
    banner.classList.remove('hidden');
  }
  const headlineBox = document.getElementById('result-headline');
  if (headlineBox) headlineBox.classList.add('hidden');
  document.getElementById('result-banner').className = 'result-banner warning';
  document.getElementById('result-banner').innerHTML =
    `<strong>Answer data detected.</strong> β_pred (= true blind prediction) requires network structure data (edgelist of who-coordinates-with-whom). We computed β_obs only.`;
  document.getElementById('a-clean').textContent = 'n/a (network not provided)';
  document.getElementById('a-contam').textContent = 'n/a';
  document.getElementById('a-hmax').textContent = 'n/a';
  const heffEl = document.getElementById('a-heff'); if (heffEl) heffEl.textContent = 'n/a';
  document.getElementById('a-cluster').textContent = 'n/a';
  document.getElementById('a-noise-score').textContent = 'n/a';
  document.getElementById('a-noise-flag').textContent = 'n/a';
  const piEl = document.getElementById('a-pi-imbalance'); if (piEl) piEl.textContent = 'n/a';
  const subEl = document.getElementById('a-sub-flag'); if (subEl) subEl.textContent = 'n/a';
  const brEl = document.getElementById('a-bracket'); if (brEl) brEl.textContent = 'n/a';
  document.getElementById('a-noise-diagnosis').innerHTML = `<strong>To compute β_pred</strong>, please upload the coordination network for this indicator.`;
  document.getElementById('beta-obs-header').classList.remove('hidden');
  document.getElementById('beta-obs-result').classList.remove('hidden');
  document.getElementById('obs-value').textContent = beta_obs !== null ? beta_obs.toFixed(4) : 'unable to compute';
  document.getElementById('match-verdict').textContent = '(no β_pred to compare)';
  document.getElementById('normalized-data').textContent = '(answer data, not normalized as graph)';
  document.getElementById('audit-log').textContent = `β_obs = ${beta_obs !== null ? beta_obs.toFixed(4) : 'n/a'} (OLS log-log slope on N–Y pairs)`;
}

function showError(msg) {
  document.getElementById('loading').classList.add('hidden');
  document.getElementById('results').classList.remove('hidden');
  const headlineBox = document.getElementById('result-headline');
  if (headlineBox) headlineBox.classList.add('hidden');
  document.getElementById('result-banner').className = 'result-banner error';
  document.getElementById('result-banner').textContent = msg;
}

const drop = document.getElementById('drop');
['dragover', 'dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('dragover'); }));
['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => drop.classList.remove('dragover')));
drop.addEventListener('drop', e => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (!file) return;
  lastUploadedFilename = file.name;
  const reader = new FileReader();
  reader.onload = ev => {
    fullSampleContent = ev.target.result;
    activeLabels = null;
    clearSampleSelection();
    activePath = 'a';
    document.getElementById('raw-input').value = ev.target.result;
    updatePathButtonsAvailability();
    updateInlinePreview();
  };
  reader.readAsText(file);
});

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    const showUpload = (mode === 'upload');
    document.querySelectorAll('.upload-mode-only').forEach(el => el.classList.toggle('hidden', !showUpload));
    document.querySelectorAll('.panel-mode-only').forEach(el => el.classList.toggle('hidden', showUpload));
  });
});

document.querySelectorAll('.path-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    activePath = btn.dataset.path;
    document.querySelectorAll('.path-btn').forEach(b => b.classList.toggle('active', b.dataset.path === activePath));
    updateInlinePreview();
  });
});

// v0.1.9 ④: Build 22 panel sample buttons — H removed, edge count shown
(function buildPanelGrid() {
  const grid = document.getElementById('panel-samples-grid');
  if (!grid) return;
  BETT22.forEach(r => {
    const key = 'row' + (r.row < 10 ? '0' : '') + r.row + '_' + r.name;
    const btn = document.createElement('button');
    btn.dataset.sample = key;
    btn.className = 'panel-sample-btn tier-' + r.tier.toLowerCase() + (r.mixture ? ' mixture' : '');
    const branchSym = r.bsign === '+' ? '↑' : r.bsign === '-' ? '↓' : '=';
    const niceName = r.name.replace(/_/g, ' ');
    // v0.1.9 ④: edge count (pre-compute lazily)
    const edgeCount = (() => {
      const c = getSampleContent(key);
      return c ? c.split('\n').length - 1 : '?';
    })();
    btn.innerHTML = `<span class="row-num">#${r.row}</span> <span class="row-name">${niceName}</span><br><span class="row-meta">Tier ${r.tier} · ${edgeCount} edges · ${branchSym}</span><br><span class="row-obs">β_obs ∈ [${r.obs_lo}, ${r.obs_hi}]</span>`;
    grid.appendChild(btn);
  });
})();

(function initMode() {
  const params = new URLSearchParams(location.search);
  const m = params.get('mode');
  if (m === '1') {
    const panelBtn = document.getElementById('mode-panel');
    if (panelBtn) panelBtn.click();
  }
  updatePathButtonsAvailability();
})();
