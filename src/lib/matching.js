// Shared "AI allocation" scoring — one weighted score used to rank
// cooperatives/workers by fit (availability, proximity, rating, compliance).
// This score decides WHO gets assigned a job — it never sets or negotiates
// price. Pay is a standardized daily rate set by the cooperative, the same
// for every member doing that role — no bidding, no race to the bottom.
// See matchReasoning() below for the plain-language "why this match"
// explanation shown alongside the score wherever it's displayed.

export const MATCH_WEIGHTS = { availability: 0.4, proximity: 0.3, rating: 0.2, compliance: 0.1 };

export function computeScore(candidate) {
  return (
    candidate.availability * MATCH_WEIGHTS.availability +
    candidate.proximity * MATCH_WEIGHTS.proximity +
    candidate.rating * MATCH_WEIGHTS.rating +
    candidate.compliance * MATCH_WEIGHTS.compliance
  );
}

// One-line plain-language explanation, ordered by which factor contributed
// most to the score — this is the "show the reasoning, don't hide it"
// requirement (Section 4). Every fragment is derived from data already
// computed elsewhere, no new scoring logic.
export function matchReasoning(candidate, t) {
  const weighted = [
    { key: 'proximity', value: candidate.proximity, text: `${candidate.distanceKm ?? (10 - candidate.proximity / 12).toFixed(1)}km ${t('reasonAway')}` },
    { key: 'rating', value: candidate.rating, text: `${(candidate.rating / 20).toFixed(1)}★` },
    { key: 'availability', value: candidate.availability, text: candidate.availability >= 85 ? t('reasonAvailableNow') : t('reasonAvailableSoon') },
    { key: 'compliance', value: candidate.compliance, text: candidate.compliance >= 95 ? t('reasonCompliant') : null },
  ]
    .filter((f) => f.text)
    .sort((a, b) => b.value * MATCH_WEIGHTS[b.key] - a.value * MATCH_WEIGHTS[a.key]);

  return weighted.map((f) => f.text).join(' · ');
}
