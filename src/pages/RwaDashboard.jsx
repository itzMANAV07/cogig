import { useEffect, useState } from 'react';
import { PageShell } from '../components/PageShell';
import { StatCard } from '../components/StatCard';
import { Block } from '../components/Block';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/PillBadge';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { EmergencyDispatch } from '../components/EmergencyDispatch';
import { WorkforceAllocationCard } from '../components/WorkforceAllocationCard';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_RWA } from '../lib/demoData';
import { useTranslation } from '../lib/i18n/LanguageContext';

export default function RwaDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState(DEMO_RWA);
  const [live, setLive] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);
  const [hiredCoop, setHiredCoop] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      const { data: contracts } = await supabase
        .from('contracts')
        .select('*, cooperative_society(name)');
      const { data: approvals } = await supabase
        .from('escrow_ledger')
        .select('*, users(name)')
        .eq('attendance_status', 'PENDING_APPROVAL');

      if (contracts && contracts.length) {
        setLive(true);
        setData({
          stats: {
            activeContracts: contracts.filter((c) => c.status === 'ACTIVE').length,
            totalBudget: contracts.reduce((s, c) => s + Number(c.total_budget || 0), 0),
            pendingApproval: (approvals || []).length,
          },
          contracts: contracts.map((c) => ({
            id: c.contract_id,
            client: c.client_name,
            role: c.role_needed,
            coop: c.cooperative_society?.name || '—',
            status: c.status,
            budget: c.total_budget,
          })),
          approvals: (approvals || []).map((a) => ({
            id: a.transaction_id,
            worker: a.users?.name || '—',
            date: a.attendance_date,
            status: a.attendance_status,
          })),
        });
      }
    })();
  }, []);

  return (
    <PageShell title={t('rwaDashboardTitle')} subtitle={t('rwaDashboardSubtitle')} wide>
      {!live && (
        <div className="mb-6 rounded-lg border border-marigold bg-marigold-light/40 px-4 py-2.5 text-sm text-ink">
          {t('demoDataRwa')}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label={t('activeContracts')} value={data.stats.activeContracts} />
        <StatCard
          label={t('totalBudgetEscrowed')}
          value={`₹${data.stats.totalBudget.toLocaleString('en-IN')}`}
          accent="marigold"
        />
        <StatCard label={t('daysPendingApproval')} value={data.stats.pendingApproval} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="marigold" onClick={() => setHireOpen(true)}>
          <Icon name="Add01Icon" size={16} />
          {t('hireWorker')}
        </Button>
        <EmergencyDispatch />
      </div>

      <Modal
        open={hireOpen}
        onClose={() => {
          setHireOpen(false);
          setHiredCoop(null);
        }}
        maxWidth="max-w-xl"
      >
        {!hiredCoop ? (
          <WorkforceAllocationCard onSelect={(c) => setHiredCoop(c)} />
        ) : (
          <div className="text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success-light text-success">
              <Icon name="CheckmarkCircle02Icon" size={24} />
            </div>
            <h3 className="mt-3 text-lg font-bold text-ink">{t('customerAcceptedEscrowLocked')}</h3>
            <p className="mt-2 text-sm text-muted">
              {hiredCoop.coop} — {t('escrowLockedAmount').replace('{amount}', '₹25,000')}
            </p>
            <Button
              variant="primary"
              className="mt-5 w-full"
              onClick={() => {
                setHireOpen(false);
                setHiredCoop(null);
              }}
            >
              {t('done')}
            </Button>
          </div>
        )}
      </Modal>

      <div className="mt-6 space-y-6">
        <Block title={t('contracts')}>
          <DataTable
            columns={[
              { key: 'client', label: t('client') },
              { key: 'role', label: t('roleNeeded') },
              { key: 'coop', label: t('cooperative') },
              { key: 'status', label: t('status'), render: (r) => <StatusBadge status={r.status} /> },
              {
                key: 'budget',
                label: t('budget'),
                render: (r) => `₹${Number(r.budget).toLocaleString('en-IN')}`,
              },
            ]}
            rows={data.contracts}
          />
        </Block>

        <Block title={t('approvalNeededTitle')}>
          <DataTable
            columns={[
              { key: 'worker', label: t('worker') },
              { key: 'date', label: t('date') },
              { key: 'status', label: t('status'), render: () => <StatusBadge status="PENDING" /> },
              {
                key: 'action',
                label: '',
                render: () => (
                  <Button variant="indigo" className="px-3 py-1.5 text-xs">
                    {t('approve')}
                  </Button>
                ),
              },
            ]}
            rows={data.approvals}
            emptyText={t('nothingAwaitingApproval')}
          />
        </Block>
      </div>
    </PageShell>
  );
}
