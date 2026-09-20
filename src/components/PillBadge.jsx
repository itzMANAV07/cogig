import { cn } from '../lib/cn';
import { useTranslation } from '../lib/i18n/LanguageContext';

const tones = {
  success: 'bg-success-light text-success',
  warn: 'bg-warn-light text-warn',
  danger: 'bg-danger-light text-danger',
  indigo: 'bg-indigo-light text-indigo-dark',
  marigold: 'bg-marigold-light text-marigold-dark',
  neutral: 'bg-line/60 text-muted',
};

const statusKeyMap = {
  PRESENT: 'statusPresent',
  ACCEPTED: 'statusAccepted',
  ACTIVE: 'statusActive',
  PENDING: 'statusPending',
  PENDING_APPROVAL: 'statusPending',
  OPEN: 'statusOpen',
  ABSENT: 'statusAbsent',
  REJECTED: 'statusRejected',
  COMPLETED: 'statusCompleted',
};

export function PillBadge({ tone = 'neutral', children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

// Renders a raw status code (e.g. "PENDING_APPROVAL") as a translated pill.
export function StatusBadge({ status }) {
  const { t } = useTranslation();
  const key = statusKeyMap[status];
  return <PillBadge tone={statusTone(status)}>{key ? t(key) : status}</PillBadge>;
}

export const statusTone = (status) => {
  const map = {
    PRESENT: 'success',
    ACCEPTED: 'success',
    ACTIVE: 'success',
    PENDING: 'warn',
    PENDING_APPROVAL: 'warn',
    OPEN: 'warn',
    ABSENT: 'danger',
    REJECTED: 'danger',
    COMPLETED: 'neutral',
  };
  return map[status] || 'neutral';
};
