import { PageShell } from '../components/PageShell';
import { Icon } from '../components/Icon';
import { useTranslation } from '../lib/i18n/LanguageContext';

export default function WorkerAccount() {
  const { t } = useTranslation();

  return (
    <PageShell
      title="Worker Profile & Account"
      subtitle="Cooperative membership details, Aadhaar verification, and UPI payout settings"
      roleNav="worker"
    >
      <div className="space-y-4">
        {/* Profile Card */}
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-ink text-paper font-bold text-xl">
              RK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">Ramesh Kumar</h3>
                <span className="rounded-full bg-success-light px-2 py-0.5 text-[10px] font-bold text-success flex items-center gap-1">
                  <Icon name="CheckmarkCircle02Icon" size={12} />
                  Aadhaar Verified
                </span>
              </div>
              <p className="text-xs text-muted font-medium">+91 98765 43210 · AC Tech & Painter</p>
              <p className="text-xs font-bold text-indigo mt-0.5">Shanti Labour Cooperative Society</p>
            </div>
          </div>
        </div>

        {/* Bank & UPI Settlement Settings */}
        <div className="rounded-2xl border border-line bg-surface p-4 space-y-3">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Instant UPI Payout Account</h3>
          <div className="rounded-xl border border-line bg-paper p-3 text-xs space-y-1">
            <div className="flex justify-between font-medium">
              <span className="text-muted">Linked UPI ID:</span>
              <span className="font-bold text-ink">ramesh.kumar@upi</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-muted">Settlement Mode:</span>
              <span className="font-bold text-success">Instant Escrow Release (0s)</span>
            </div>
          </div>
        </div>

        {/* Cooperative Membership Benefits */}
        <div className="rounded-2xl border border-line bg-surface p-4 space-y-2">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Cooperative Welfare Rights</h3>
          <div className="space-y-2 text-xs">
            <div className="rounded-xl bg-paper p-3 font-medium text-ink flex items-center gap-2">
              <Icon name="Shield01Icon" size={16} className="text-marigold-dark" />
              <span>5% Democratic Welfare Fund Protection Covered</span>
            </div>
            <div className="rounded-xl bg-paper p-3 font-medium text-ink flex items-center gap-2">
              <Icon name="UserGroup02Icon" size={16} className="text-indigo" />
              <span>Voting Member of Shanti Labour Cooperative (Registration #LCS-2026-045)</span>
            </div>
          </div>
        </div>

        {/* Health & Life Insurance Coverage */}
        <div className="rounded-2xl border border-line bg-surface p-4 space-y-3">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Health & Life Insurance Coverage (funded by 5% Welfare Fund)</h3>
          
          <div className="rounded-xl border border-line bg-paper p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-ink">
                <Icon name="HeartCheckIcon" size={16} className="text-error" />
                Health Insurance: ₹1,00,000 Medical Coverage
              </div>
              <span className="rounded-full bg-success-light px-2 py-0.5 text-[10px] font-bold text-success flex items-center gap-1">
                <Icon name="CheckmarkCircle02Icon" size={12} />
                Active
              </span>
            </div>
            <div className="pl-6 space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-muted">Provider:</span>
                <span className="font-bold text-ink">Cooperative Welfare Fund</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-muted">Coverage:</span>
                <span className="font-bold text-ink">Hospitalization, OPD, Medicines</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-muted">Valid till:</span>
                <span className="font-bold text-ink">March 2027</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-paper p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-ink">
                <Icon name="Shield01Icon" size={16} className="text-indigo" />
                Life Insurance: ₹2,00,000 Accidental Death & Disability
              </div>
              <span className="rounded-full bg-success-light px-2 py-0.5 text-[10px] font-bold text-success flex items-center gap-1">
                <Icon name="CheckmarkCircle02Icon" size={12} />
                Active
              </span>
            </div>
            <div className="pl-6 space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-muted">Provider:</span>
                <span className="font-bold text-ink">LIC Group Policy via Cooperative</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-muted">Coverage:</span>
                <span className="font-bold text-ink">On-duty and off-duty accidents</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-muted">Nominee:</span>
                <span className="font-bold text-ink">As per Aadhaar records</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-paper p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-ink">
                <Icon name="MedicalKitIcon" size={16} className="text-marigold-dark" />
                Emergency Medical Fund: ₹10,000 Instant Disbursement
              </div>
              <span className="rounded-full bg-indigo-light px-2 py-0.5 text-[10px] font-bold text-indigo flex items-center gap-1">
                <Icon name="CheckmarkCircle02Icon" size={12} />
                Available
              </span>
            </div>
            <div className="pl-6 space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-muted">Disbursement:</span>
                <span className="font-bold text-ink">Within 24 hours on claim</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-muted">Contact:</span>
                <span className="font-bold text-ink">Cooperative helpline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
