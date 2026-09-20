import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Icon } from '../components/Icon';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export default function CoopAdminAccount() {
  const navigate = useNavigate();

  return (
    <PageShell
      title="Cooperative Admin Profile"
      subtitle="Cooperative entity credentials, multi-state registration, and system settings"
      wide
      roleNav="coop"
    >
      <div className="space-y-5 max-w-xl mx-auto mt-4">
        {/* Entity Card */}
        <div className="rounded-3xl border border-line bg-surface p-6 shadow-md space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-indigo text-paper font-bold text-2xl shadow-inner">
              <Icon name="Building06Icon" size={28} />
            </div>
            <div className="pt-1">
              <h3 className="text-lg font-bold text-ink">Shanti Labour Cooperative Society</h3>
              <p className="text-sm text-muted font-medium mt-0.5">Multi-State Cooperative Registration #LCS-2026-045</p>
              <div className="inline-flex items-center gap-1.5 mt-3 rounded-lg bg-indigo-light/40 px-2.5 py-1 text-xs font-bold text-indigo-dark">
                <Icon name="Location01Icon" size={14} />
                Primary Jurisdiction: Patna Region (6.0 km Radius)
              </div>
            </div>
          </div>
        </div>

        {/* Welfare Fund Account Details */}
        <div className="rounded-3xl border border-line bg-surface p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <Icon name="PiggyBankIcon" size={20} className="text-marigold-dark" />
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Democratic Welfare Fund Escrow</h3>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-4 text-sm space-y-3 shadow-sm">
            <div className="flex justify-between items-center font-medium">
              <span className="text-muted">Current Fund Balance:</span>
              <span className="font-extrabold text-marigold-dark text-lg">₹4,200</span>
            </div>
            <div className="h-px w-full bg-line/50"></div>
            <div className="flex justify-between items-center font-medium">
              <span className="text-muted">Automatic Fare Contribution:</span>
              <span className="font-bold text-success bg-success-light/30 px-2 py-0.5 rounded-md">5% per completed job</span>
            </div>
          </div>
        </div>

        {/* System Settings & Role Switcher */}
        <div className="rounded-3xl border border-line bg-surface p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Settings02Icon" size={20} className="text-slate-500" />
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">System Settings</h3>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-paper border border-line p-4 shadow-sm">
            <span className="text-sm font-bold text-ink">Language Preference</span>
            <LanguageSwitcher />
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full rounded-2xl border-2 border-line bg-surface py-4 text-sm font-bold text-ink hover:bg-paper hover:border-indigo/30 transition-all active:scale-[0.98] mt-2 shadow-sm"
        >
          Switch Role (Customer / Worker / Coop Admin)
        </button>
      </div>
    </PageShell>
  );
}
