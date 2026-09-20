import { cn } from '../lib/cn';
import { DISPUTE_TIERS, tierKey } from '../lib/disputeTiers';
import { useTranslation } from '../lib/i18n/LanguageContext';

export function DisputeStepper({ currentTier }) {
  const { t } = useTranslation();
  const currentIndex = DISPUTE_TIERS.indexOf(currentTier);

  return (
    <div className="flex items-center gap-2">
      {DISPUTE_TIERS.map((tier, i) => (
        <div key={tier} className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-7 items-center rounded-full px-3 text-xs font-medium',
              i <= currentIndex ? 'bg-danger text-white' : 'bg-line/60 text-muted'
            )}
          >
            {t(tierKey[tier])}
          </div>
          {i < DISPUTE_TIERS.length - 1 && (
            <div className={cn('h-0.5 w-4', i < currentIndex ? 'bg-danger' : 'bg-line')} />
          )}
        </div>
      ))}
    </div>
  );
}
