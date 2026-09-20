import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Icon } from '../components/Icon';
import { useAppState } from '../lib/appState';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export default function CustomerAccount() {
  const navigate = useNavigate();
  const { customer } = useAppState();

  return (
    <PageShell
      title="Customer Account"
      subtitle="Manage profile, delivery addresses, and platform settings"
      roleNav="customer"
    >
      <div className="space-y-4">
        {/* Profile Card */}
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo text-paper font-bold text-xl">
              AM
            </div>
            <div>
              <h3 className="text-base font-bold text-ink">{customer?.name || 'Anjali Mehta'}</h3>
              <p className="text-xs text-muted font-medium">+91 {customer?.phone || '98765 43210'}</p>
              <p className="text-xs font-semibold text-indigo mt-0.5">{customer?.place || 'Green Valley Society, Patna'}</p>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="rounded-2xl border border-line bg-surface p-4 space-y-2">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Default Service Address</h3>
          <div className="rounded-xl border border-line bg-paper p-3 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Location01Icon" size={18} className="text-indigo" />
              <span className="font-semibold text-ink">{customer?.place || 'Green Valley Society, Patna'}</span>
            </div>
          </div>
        </div>

        {/* Language & Preferences */}
        <div className="rounded-2xl border border-line bg-surface p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink">Language Preference</span>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Role Switcher Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full rounded-2xl border border-line bg-surface py-3 text-xs font-bold text-ink hover:bg-paper transition-colors"
        >
          Switch Role (Customer / Worker / Coop Admin)
        </button>
      </div>
    </PageShell>
  );
}
