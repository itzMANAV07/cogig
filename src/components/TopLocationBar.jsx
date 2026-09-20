import { useState } from 'react';
import { Icon } from './Icon';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { Modal } from './Modal';
import { AddressServiceabilityMap } from './AddressServiceabilityMap';
import { EmergencyDispatch } from './EmergencyDispatch';
import { useAppState } from '../lib/appState';
import { DEMO_CITIES } from '../lib/demoData';

export function TopLocationBar({ address, onAddressChange }) {
  const { t } = useTranslation();
  const { selectedCity, changeCity } = useAppState();
  const [modalOpen, setModalOpen] = useState(false);
  const [tempAddress, setTempAddress] = useState(address || selectedCity?.defaultAddress || 'Bengaluru');
  const [sosModalOpen, setSosModalOpen] = useState(false);

  const handleCitySelect = (city) => {
    changeCity(city);
    setTempAddress(city.defaultAddress);
    if (onAddressChange) onAddressChange(city.defaultAddress);
  };

  const handleSave = () => {
    if (onAddressChange) onAddressChange(tempAddress);
    setModalOpen(false);
  };

  const displayAddress = address || selectedCity?.defaultAddress || 'Bengaluru, Karnataka';

  return (
    <>
      <div className="bg-gradient-to-r from-indigo via-indigo-dark to-indigo px-4 pt-4 pb-3.5 text-white shadow-md">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2.5">
          {/* Location button */}
          <button
            onClick={() => {
              setTempAddress(displayAddress);
              setModalOpen(true);
            }}
            className="flex flex-1 items-center gap-2.5 text-left transition-opacity hover:opacity-90 min-w-0"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm text-marigold-light shadow-inner">
              <Icon name="Location01Icon" size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-bold tracking-tight text-white">
                <span>{selectedCity?.name || 'Bengaluru, KA'}</span>
                <Icon name="ArrowDown01Icon" size={14} className="text-white/70" />
              </div>
              <p className="truncate text-[11px] text-white/80 font-medium">
                {displayAddress}
              </p>
            </div>
          </button>

          {/* SOS Emergency Dispatch Button */}
          <button
            type="button"
            onClick={() => setSosModalOpen(true)}
            className="group relative flex shrink-0 items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-1.5 text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/15 hover:border-white/30 active:scale-95"
            title="1-Hour SOS Emergency Dispatch"
          >
            <div className="relative flex size-6 items-center justify-center rounded-lg bg-danger text-white shadow transition-transform group-hover:scale-105">
              <Icon name="FlashIcon" size={13} className="text-white" />
              <span className="absolute -top-0.5 -right-0.5 flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-red-400"></span>
              </span>
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <span className="block text-[10px] font-extrabold tracking-wider text-white">SOS DISPATCH</span>
              <span className="block text-[9px] font-medium text-white/75">1-Hr Crew</span>
            </div>
            <span className="sm:hidden text-[11px] font-extrabold tracking-wider text-white">SOS</span>
          </button>
        </div>
      </div>

      {/* Address & Demo City Picker Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="max-w-md">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Icon name="Location01Icon" size={20} className="text-indigo" />
            <h3 className="text-base font-bold text-ink">{t('changeAddress') || 'Select Location Hub'}</h3>
          </div>

          {/* Quick Demo City Preset Selector */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-ink">
              Demo City Hub Presets (Click to Switch):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_CITIES.map((c) => {
                const isSel = selectedCity?.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCitySelect(c)}
                    className={`rounded-xl border p-2 text-center transition-all ${
                      isSel
                        ? 'border-indigo bg-indigo text-white font-bold shadow-sm'
                        : 'border-line bg-paper text-ink font-semibold hover:border-indigo'
                    }`}
                  >
                    <span className="block text-xs truncate">{c.name.split(',')[0]}</span>
                    <span className="block text-[9px] opacity-80 uppercase tracking-tight">{c.tier}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">
              {t('enterAddress') || 'Or type custom address / society name:'}
            </label>
            <textarea
              rows={2}
              value={tempAddress}
              onChange={(e) => setTempAddress(e.target.value)}
              className="input text-xs font-medium"
              placeholder="e.g. Prakruthi Twp - Horamavu Agara - Hennur, Bengaluru"
            />
          </div>

          {tempAddress.length > 3 && (
            <div className="mt-2">
              <AddressServiceabilityMap address={tempAddress} />
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 rounded-xl border border-line py-2.5 text-xs font-semibold text-muted hover:text-ink"
            >
              {t('cancel') || 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              className="flex-1 rounded-xl bg-marigold py-2.5 text-xs font-bold text-ink hover:bg-marigold-dark transition-colors shadow-sm"
            >
              {t('confirmAddress') || 'Confirm Location'}
            </button>
          </div>
        </div>
      </Modal>

      {/* SOS Emergency Dispatch Modal */}
      <EmergencyModal open={sosModalOpen} onClose={() => setSosModalOpen(false)} />
    </>
  );
}

function EmergencyModal({ open, onClose }) {
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-danger text-white shadow-md">
            <Icon name="FlashIcon" size={20} />
          </span>
          <div>
            <h3 className="text-base font-bold text-ink">SOS Emergency Dispatch</h3>
            <p className="text-xs text-muted">1-Hour Response for Electrical & Pipe Leakage Breakdowns</p>
          </div>
        </div>

        <EmergencyDispatch />

        <button
          onClick={onClose}
          className="w-full rounded-xl border border-line py-2 text-xs font-semibold text-muted hover:text-ink mt-2"
        >
          Close SOS Dispatch
        </button>
      </div>
    </Modal>
  );
}
