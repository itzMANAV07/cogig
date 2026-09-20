// AI-driven fare calculation engine.
//
// The price a customer pays is NEVER manually entered — it's derived from:
//   1. Government-fixed base rate (from catalog.js, per service role)
//   2. Area multiplier (Metro 1.3 / Tier-2 1.15 / Tier-3 1.0)
//   3. Annual inflation factor (currently 5%)
//   4. Number of workers × number of days
//
// The cooperative's democratic split is enforced here too:
//   Worker:        93%
//   Welfare Fund:   5%
//   Platform Fee:   2%
//
// This module is the single source of truth for pricing — no other file
// should hard-code rates or split percentages.

export const SPLIT = { worker: 0.93, welfare: 0.05, platform: 0.02 };

export const INFLATION_FACTOR = 1.05; // 5% annual — adjust each fiscal year

export const AREA_TIERS = {
  metro:  { label: 'Metro',  multiplier: 1.30 },
  tier2:  { label: 'Tier-2', multiplier: 1.15 },
  tier3:  { label: 'Tier-3', multiplier: 1.00 },
};

// Simple heuristic: if the geocoded display name contains a known metro
// city name, it's metro; known tier-2 → tier-2; else tier-3.
const METRO_CITIES = [
  'delhi', 'mumbai', 'bangalore', 'bengaluru', 'chennai', 'hyderabad',
  'kolkata', 'pune', 'ahmedabad', 'new delhi', 'noida', 'gurugram', 'gurgaon',
];
const TIER2_CITIES = [
  'patna', 'lucknow', 'jaipur', 'bhopal', 'indore', 'chandigarh', 'nagpur',
  'coimbatore', 'kochi', 'visakhapatnam', 'agra', 'varanasi', 'ranchi',
  'dehradun', 'mysore', 'thiruvananthapuram', 'guwahati', 'raipur',
  'bhubaneswar', 'mangalore', 'surat', 'vadodara', 'rajkot',
];

/**
 * Detect area tier from a geocoded display name string.
 * @param {string} displayName — e.g. "Green Valley, Patna, Bihar, India"
 * @returns {'metro'|'tier2'|'tier3'}
 */
export function detectAreaTier(displayName = '') {
  const lower = displayName.toLowerCase();
  if (METRO_CITIES.some((c) => lower.includes(c))) return 'metro';
  if (TIER2_CITIES.some((c) => lower.includes(c))) return 'tier2';
  return 'tier3';
}

/**
 * Calculate the full fare breakdown.
 *
 * @param {object} params
 * @param {number} params.baseRate      — per-day rate from catalog (e.g. 500)
 * @param {number} params.workers       — number of workers requested
 * @param {number} params.days          — number of working days
 * @param {string} [params.areaTier]    — 'metro' | 'tier2' | 'tier3'
 * @returns {object} breakdown
 */
export function calculateFare({ baseRate, workers = 1, days = 1, areaTier = 'tier3' }) {
  const area = AREA_TIERS[areaTier] || AREA_TIERS.tier3;
  const adjustedRate = Math.round(baseRate * area.multiplier * INFLATION_FACTOR);
  const totalLaborCost = adjustedRate * workers * days;

  const workerEarnings   = Math.round(totalLaborCost * SPLIT.worker);
  const welfareFund      = Math.round(totalLaborCost * SPLIT.welfare);
  const platformFee      = totalLaborCost - workerEarnings - welfareFund; // remainder ≈ 2%

  return {
    baseRate,
    adjustedRate,
    areaTier,
    areaLabel: area.label,
    areaMultiplier: area.multiplier,
    inflationFactor: INFLATION_FACTOR,
    workers,
    days,
    perWorkerPerDay: adjustedRate,
    totalLaborCost,
    workerEarnings,
    welfareFund,
    platformFee,
  };
}

/**
 * Compute working days between two date strings (inclusive).
 * Returns at least 1 even if dates are the same day.
 */
export function computeDays(startDate, endDate) {
  if (!startDate || !endDate) return 1;
  const s = new Date(startDate);
  const e = new Date(endDate);
  const diff = Math.ceil((e - s) / 86400000) + 1; // inclusive
  return Math.max(1, diff);
}
