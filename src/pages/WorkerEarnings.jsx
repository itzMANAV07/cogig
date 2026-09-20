import { PageShell } from '../components/PageShell';
import { StatCard } from '../components/StatCard';
import { Block } from '../components/Block';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/PillBadge';
import { useTranslation } from '../lib/i18n/LanguageContext';

const WORKER_HISTORY = [
  { id: 1, date: 'Sep 5, 2026', status: 'PRESENT', share: 465 },
  { id: 2, date: 'Sep 4, 2026', status: 'PRESENT', share: 465 },
  { id: 3, date: 'Sep 3, 2026', status: 'ABSENT', share: 0 },
  { id: 4, date: 'Sep 2, 2026', status: 'PRESENT', share: 465 },
];

export default function WorkerEarnings() {
  const { t } = useTranslation();
  return (
    <PageShell
      title="Payouts & Earnings"
      subtitle="Escrow-backed daily payouts and 93% direct share tracking"
      roleNav="worker"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="💰 Total Amount Earned" value="₹8,800" accent="marigold" />
          <StatCard label="Welfare Fund (Co-op)" value="₹4,200" accent="indigo" />
        </div>

        {/* 93/5/2 Transparent Split Info */}
        <div className="rounded-2xl border border-line bg-surface p-4 text-xs space-y-2">
          <h3 className="font-bold text-ink text-sm">Transparent Cooperative Fare Split</h3>
          <p className="text-muted font-medium">
            Smart Escrow automatically splits every labor fare upon customer approval:
          </p>

          <div className="grid grid-cols-3 gap-2 rounded-xl bg-paper p-3 text-[11px] font-bold">
            <div>
              <span className="block text-success font-extrabold text-sm">93%</span>
              <span className="text-muted text-[10px]">Your Payout</span>
            </div>
            <div>
              <span className="block text-marigold-dark font-extrabold text-sm">5%</span>
              <span className="text-muted text-[10px]">Welfare Fund</span>
            </div>
            <div>
              <span className="block text-indigo font-extrabold text-sm">2%</span>
              <span className="text-muted text-[10px]">Platform Fee</span>
            </div>
          </div>
          <p className="border-t border-line pt-2 text-[10px] leading-relaxed text-muted">
            {t('welfareFundExplainer')}
          </p>
        </div>

        {/* Attendance & Payout History Table */}
        <Block title="Attendance & Payout Ledger">
          <DataTable
            columns={[
              { key: 'date', label: 'Attendance Date' },
              { key: 'status', label: 'Attendance', render: (r) => <StatusBadge status={r.status} /> },
              { key: 'share', label: 'Your 93% Share', render: (r) => `₹${r.share}` },
            ]}
            rows={WORKER_HISTORY}
            emptyText="No attendance ledger records"
          />
        </Block>
      </div>
    </PageShell>
  );
}
