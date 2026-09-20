import { PageShell } from '../components/PageShell';
import { Block } from '../components/Block';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/PillBadge';
import { JobLifecycleDemo } from '../components/JobLifecycleDemo';
import { StatCard } from '../components/StatCard';
import { useTranslation } from '../lib/i18n/LanguageContext';

const WORKER_JOBS = [
  { id: 1, client: 'Green Valley RWA', role: 'Painter', status: 'ACTIVE', offer: 'ACCEPTED' },
  { id: 2, client: 'Sunrise Apartments', role: 'Plumber', status: 'COMPLETED', offer: 'ACCEPTED' },
];

const WORKER_HISTORY = [
  { id: 1, date: 'Sep 5, 2026', status: 'PRESENT', share: 465 },
  { id: 2, date: 'Sep 4, 2026', status: 'PRESENT', share: 465 },
  { id: 3, date: 'Sep 3, 2026', status: 'ABSENT', share: 0 },
  { id: 4, date: 'Sep 2, 2026', status: 'PRESENT', share: 465 },
];

export default function WorkerJobs() {
  const { t } = useTranslation();

  return (
    <PageShell
      title="Jobs & Earnings"
      subtitle="Accept new AI crew dispatch offers and view your earnings and payouts"
      roleNav="worker"
    >
      <div className="space-y-6">
        {/* Interactive Job Simulator */}
        <JobLifecycleDemo />

        {/* Jobs History Table */}
        <Block title="Assigned Jobs History">
          <DataTable
            columns={[
              { key: 'client', label: 'Client / Location' },
              { key: 'role', label: 'Trade Role' },
              { key: 'status', label: 'Job Status', render: (r) => <StatusBadge status={r.status} /> },
              { key: 'offer', label: 'Offer Status', render: (r) => <StatusBadge status={r.offer} /> },
            ]}
            rows={WORKER_JOBS}
            emptyText="No assigned jobs found"
          />
        </Block>

        {/* Earnings Section */}
        <Block title="Earnings & Welfare Summary">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatCard label="💰 Total Earned" value="₹8,800" trend="+₹465 today" />
            <StatCard label="Welfare Fund" value="₹4,200" trend="co-op reserves" />
          </div>

          <div className="rounded-2xl border border-line bg-surface p-4 text-xs space-y-2 mb-4">
            <h4 className="font-bold text-ink mb-1">Democratic Payout Split (Standard Day Rate ₹500)</h4>
            <div className="flex justify-between border-b border-line pb-1">
              <span className="text-muted">Direct to Worker (93%)</span>
              <span className="font-bold text-ink">₹465.00</span>
            </div>
            <div className="flex justify-between border-b border-line pb-1">
              <span className="text-muted">Co-op Welfare Fund (5%)</span>
              <span className="font-bold text-ink">₹25.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Platform Fee (2%)</span>
              <span className="font-bold text-ink">₹10.00</span>
            </div>
          </div>
        </Block>

        <Block title="Attendance & Payout Ledger">
          <DataTable
            columns={[
              { key: 'date', label: 'Date' },
              {
                key: 'status',
                label: 'Attendance',
                render: (r) => (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.status === 'PRESENT' ? 'bg-success-light text-success' : 'bg-error-light text-error'}`}>
                    {r.status}
                  </span>
                )
              },
              { key: 'share', label: 'My Share', render: (r) => <span className="font-bold">₹{r.share}</span> },
            ]}
            rows={WORKER_HISTORY}
            emptyText="No records found"
          />
        </Block>
      </div>
    </PageShell>
  );
}
