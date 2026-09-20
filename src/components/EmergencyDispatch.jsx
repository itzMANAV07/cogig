import { useState } from 'react';
import { Icon } from './Icon';
import { Button } from './Button';
import { PillBadge } from './PillBadge';
import { Modal } from './Modal';
import { LiveTrackingMap } from './LiveTrackingMap';
import { useTranslation } from '../lib/i18n/LanguageContext';

const ROSTER = [
  { name: 'Vikram Singh', skill: 'Electrician', skillType: 'electrical', eta: 18, coop: 'Shanti Labour Cooperative' },
  { name: 'Deepak Rana', skill: 'Electrician', skillType: 'electrical', eta: 26, coop: 'Shanti Labour Cooperative' },
  { name: 'Manoj Thakur', skill: 'Plumber', skillType: 'plumbing', eta: 22, coop: 'Shanti Labour Cooperative' },
];

export function EmergencyDispatch() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null);
  const [dispatched, setDispatched] = useState(false);

  const EMERGENCY_TYPES = [
    { id: 'electrical', label: t('electrical'), icon: 'ElectricPlugsIcon' },
    { id: 'plumbing', label: t('plumbing'), icon: 'DropletIcon' },
  ];

  const roster = type ? ROSTER.filter((r) => r.skillType === type) : [];

  const close = () => {
    setOpen(false);
    setType(null);
    setDispatched(false);
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setOpen(true)}
        className="!bg-danger hover:!bg-danger/90"
      >
        <Icon name="FlashIcon" size={16} />
        {t('emergencyDispatch')}
      </Button>

      <Modal open={open} onClose={close}>
        {!dispatched ? (
          <>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-danger text-white">
                <Icon name="FlashIcon" size={18} />
              </span>
              <h3 className="text-lg font-bold text-ink">{t('emergencyDispatch')}</h3>
            </div>
            <p className="mt-2 text-sm text-muted">{t('emergencyWhat')}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {EMERGENCY_TYPES.map((et) => (
                <button
                  key={et.id}
                  onClick={() => setType(et.id)}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
                    type === et.id ? 'border-danger bg-danger-light/50' : 'border-line hover:border-danger/50'
                  }`}
                >
                  <Icon name={et.icon} size={22} />
                  <span className="text-sm font-medium">{et.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="ghost" onClick={close} className="flex-1">
                {t('cancel')}
              </Button>
              <Button
                variant="primary"
                disabled={!type}
                onClick={() => setDispatched(true)}
                className="flex-1 !bg-danger hover:!bg-danger/90 disabled:opacity-40"
              >
                {t('alertRoster')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-success text-white">
                <Icon name="UserCheck01Icon" size={18} />
              </span>
              <h3 className="text-lg font-bold text-ink">{t('rosterAlerted')}</h3>
            </div>
            <p className="mt-2 text-sm text-muted">
              Shanti Labour Cooperative's {type ? EMERGENCY_TYPES.find((e) => e.id === type)?.label : ''}{' '}
              {t('rosterAlertedDesc')}
            </p>

            <div className="mt-4 space-y-2">
              {roster.slice(0, 1).map((r) => (
                <div key={r.name} className="flex items-center justify-between rounded-md border border-line bg-surface px-3.5 py-3">
                  <div>
                    <div className="font-medium text-ink">{r.name}</div>
                    <div className="text-xs text-muted">{r.skill} · {r.coop}</div>
                  </div>
                  <PillBadge tone="success">{t('onCall')}</PillBadge>
                </div>
              ))}
            </div>

            {roster[0] && (
              <div className="mt-3">
                <LiveTrackingMap etaMinutes={roster[0].eta} />
              </div>
            )}

            <Button variant="primary" onClick={close} className="mt-6 w-full">
              {t('done')}
            </Button>
          </>
        )}
      </Modal>
    </>
  );
}
