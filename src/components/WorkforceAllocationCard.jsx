import { Icon } from './Icon';
import { PillBadge } from './PillBadge';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { MATCH_WEIGHTS, matchReasoning } from '../lib/matching';

const CANDIDATES = [
  { coop: 'Shanti Labour Cooperative', availability: 92, proximity: 88, rating: 94, compliance: 100, score: 93.2, distanceKm: 2.3, recommended: true },
  { coop: 'Ekta Cooperative', availability: 70, proximity: 95, rating: 82, compliance: 100, score: 84.1, distanceKm: 1.1 },
  { coop: 'Unity Workers Society', availability: 60, proximity: 65, rating: 88, compliance: 90, score: 72.4, distanceKm: 4.7 },
];

export function WorkforceAllocationCard({ onSelect }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-line bg-surface p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-marigold-light text-marigold-dark">
          <Icon name="Target01Icon" size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-ink">{t('workforceAllocTitle')}</h3>
          <p className="text-xs text-muted">{t('workforceAllocSubtitle')}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">
        Score = {MATCH_WEIGHTS.availability * 100}% {t('availability')} + {MATCH_WEIGHTS.proximity * 100}%{' '}
        {t('proximity')} + {MATCH_WEIGHTS.rating * 100}% {t('rating')} + {MATCH_WEIGHTS.compliance * 100}%{' '}
        {t('compliance')}
      </p>

      <div className="mt-4 space-y-3">
        {CANDIDATES.map((c) => (
          <div
            key={c.coop}
            className={`rounded-md border p-3.5 ${
              c.recommended ? 'border-marigold bg-marigold-light/30' : 'border-line'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink">{c.coop}</span>
                {c.recommended && <PillBadge tone="marigold">{t('recommended')}</PillBadge>}
              </div>
              <span className="text-lg font-bold tabular text-ink">{c.score}</span>
            </div>

            {/* Section 4: plain-language reasoning, not just a bar chart */}
            <p className="mt-1.5 text-xs text-muted">{matchReasoning(c, t)}</p>

            <div className="mt-2.5 grid grid-cols-4 gap-2 text-xs">
              {['availability', 'proximity', 'rating', 'compliance'].map((k) => (
                <div key={k}>
                  <div className="flex justify-between text-muted">
                    <span className="capitalize">{t(k)}</span>
                    <span className="tabular">{c[k]}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-line">
                    <div
                      className={`h-full rounded-full ${c.recommended ? 'bg-marigold' : 'bg-indigo'}`}
                      style={{ width: `${c[k]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {onSelect && (
              <button
                onClick={() => onSelect(c)}
                className="mt-3 w-full rounded-md bg-indigo py-2 text-sm font-semibold text-white hover:bg-indigo-dark"
              >
                {t('acceptAndEscrow')}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
