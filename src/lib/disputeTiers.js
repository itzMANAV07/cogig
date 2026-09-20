// Tiered dispute escalation (Section 1 of the v2 spec). Rather than adding a
// new DB column right now, the tier is *derived* from data already on a
// dispute row — age since creation, plus category (a cash-demand report is
// treated as pre-escalated since it's a rules violation, not a service
// quality complaint). This can be swapped for a real `tier` column later
// without changing any UI that consumes `deriveDisputeTier`.

export const DISPUTE_TIERS = ['auto_flagged', 'cooperative_review', 'escalated'];

export function deriveDisputeTier(dispute) {
  if (dispute.category === 'cash_demand') return 'escalated';
  const ageHours = dispute.created_at
    ? (Date.now() - new Date(dispute.created_at).getTime()) / 36e5
    : 0;
  if (dispute.status === 'OPEN' && ageHours > 48) return 'escalated';
  if (dispute.status === 'OPEN' && ageHours > 4) return 'cooperative_review';
  return 'auto_flagged';
}

export const tierTone = { auto_flagged: 'neutral', cooperative_review: 'warn', escalated: 'danger' };
export const tierKey = {
  auto_flagged: 'disputeTierAuto',
  cooperative_review: 'disputeTierCoopReview',
  escalated: 'disputeTierEscalated',
};
