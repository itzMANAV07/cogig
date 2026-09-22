import { useNavigate } from 'react-router-dom';
import { CoopAdminLayout } from '../components/CoopAdminLayout';
import { Icon } from '../components/Icon';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useAppState } from '../lib/appState';

export default function CoopAdminAccount() {
  const navigate = useNavigate();
  const { selectedCity } = useAppState();

  return (
    <CoopAdminLayout
      title="Cooperative Admin Profile"
      subtitle="Cooperative entity credentials, multi-state registration, and system settings"
    >
      <div className="space-y-5 max-w-xl mx-auto">
        {/* Entity Card */}
        <div className="rounded-3xl border border-line bg-paper p-6 shadow-xs space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-indigo text-paper font-bold text-xl shadow-xs">
              <Icon name="Building06Icon" size={26} />
            </div>
            <div className="pt-0.5">
              <h3 className="text-base font-extrabold text-ink">{selectedCity?.coopName || 'Sri Basaveshwara Labour Cooperative Society'}</h3>
              <p className="text-xs text-muted font-medium mt-0.5">Multi-State Cooperative Registration #MSCS/CR/2026/KA-08 · NCDC Recognized</p>
              <div className="inline-flex items-center gap-1.5 mt-2.5 rounded-lg bg-indigo-light px-2.5 py-1 text-xs font-bold text-indigo">
                <Icon name="Location01Icon" size={13} />
                <span>Primary Jurisdiction: {selectedCity?.name || 'Davangere, Karnataka'} (15.0 km Hub Radius)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Welfare Fund Account Details */}
        <div className="rounded-3xl border border-line bg-paper p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Icon name="PiggyBankIcon" size={20} className="text-marigold-dark" />
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Democratic Welfare Fund Escrow</h3>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4 text-xs space-y-3">
            <div className="flex justify-between items-center font-medium">
              <span className="text-muted">Current Fund Balance:</span>
              <span className="font-extrabold text-marigold-dark text-base font-mono">₹5,800</span>
            </div>
            <div className="h-px w-full bg-line/60"></div>
            <div className="flex justify-between items-center font-medium">
              <span className="text-muted">Automatic Fare Contribution:</span>
              <span className="font-bold text-success bg-success-light px-2 py-0.5 rounded-md">5% per completed gig</span>
            </div>
          </div>
        </div>

        {/* System Settings & Role Switcher */}
        <div className="rounded-3xl border border-line bg-paper p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Settings02Icon" size={18} className="text-slate-500" />
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">System Settings</h3>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-surface border border-line p-3.5">
            <span className="text-xs font-bold text-ink">Language Preference</span>
            <LanguageSwitcher />
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full rounded-2xl border border-line bg-paper py-3 text-xs font-bold text-ink hover:bg-surface transition-all active:scale-[0.98] shadow-xs flex items-center justify-center gap-2"
        >
          <Icon name="ArrowLeft01Icon" size={14} />
          <span>Switch Role (Customer / Worker / Coop Admin)</span>
        </button>
      </div>
    </CoopAdminLayout>
  );
}
