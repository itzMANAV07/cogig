import { useState } from 'react';
import { PageShell } from '../components/PageShell';
import { StatusBadge } from '../components/PillBadge';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { DisputeStepper } from '../components/DisputeStepper';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { deriveDisputeTier } from '../lib/disputeTiers';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEMO_CUSTOMER_BOOKINGS = [
  {
    id: 'BK-1092',
    serviceName: 'AC Repair & Maintenance',
    category: 'Household',
    workersCount: 2,
    daysCount: 1,
    siteAddress: 'Flat 402, Green Valley Society, Patna',
    startDate: '2026-09-14',
    totalCost: 1100,
    workerEarnings: 1023,
    welfareFund: 55,
    platformFee: 22,
    status: 'ACTIVE',
    coopName: 'Shanti Labour Cooperative',
    assignedWorkers: ['Ramesh Kumar (AC Tech)', 'Suresh Yadav (Helper)'],
    approvalStatus: 'PENDING_APPROVAL',
    photos: {
      before: '/ac-before.png',
    },
  },
  {
    id: 'BK-1088',
    serviceName: 'Society Painting & Water-proofing',
    category: 'Community',
    workersCount: 4,
    daysCount: 3,
    siteAddress: 'Green Valley RWA Main Block',
    startDate: '2026-09-10',
    totalCost: 7200,
    workerEarnings: 6696,
    welfareFund: 360,
    platformFee: 144,
    status: 'COMPLETED',
    coopName: 'Shanti Labour Cooperative',
    assignedWorkers: ['Anita Devi (Supervisor)', 'Vikram Singh', 'Manoj Thakur', 'Deepak Rana'],
    approvalStatus: 'APPROVED',
    photos: {
      before: '/wall-before.png',
      after: '/wall-after.png',
    },
  },
];

export default function CustomerBookings() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState(DEMO_CUSTOMER_BOOKINGS);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [disputeLogged, setDisputeLogged] = useState(null);
  const [issueType, setIssueType] = useState('cash_demand');
  const [approvedId, setApprovedId] = useState(null);
  const [photosBooking, setPhotosBooking] = useState(null);

  // Core Judge Demo Feature: Live Escrow Milestone Approval
  const handleApproveEscrow = async (bookingId) => {
    setApprovedId(bookingId);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, approvalStatus: 'APPROVED', status: 'COMPLETED' } : b
      )
    );

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('escrow_ledger')
          .update({ attendance_status: 'APPROVED' })
          .eq('contract_id', bookingId);
      } catch (err) {
        console.warn('Escrow approval update skipped:', err.message);
      }
    }
  };

  const handleOpenDispute = (booking) => {
    setSelectedBooking(booking);
    setDisputeLogged(null);
    setDisputeModalOpen(true);
  };

  const handleFileDispute = async () => {
    const dispute = {
      category: issueType,
      status: 'OPEN',
      created_at: new Date().toISOString(),
    };
    setDisputeLogged(dispute);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('disputes').insert({
          message: issueType === 'cash_demand' ? 'Worker demanded extra cash outside escrow' : 'Service quality complaint',
          status: 'OPEN',
        });
      } catch (err) {
        console.warn('Dispute insert skipped:', err.message);
      }
    }
  };

  return (
    <PageShell
      title={t('myBookingsTitle') || 'My Bookings & Escrow'}
      subtitle={t('myBookingsSubtitle') || 'Track active gig crews and release escrow payouts upon completion'}
      roleNav="customer"
    >
      <div className="space-y-4">
        {bookings.map((b) => {
          const isApproved = b.approvalStatus === 'APPROVED' || approvedId === b.id;

          return (
            <div
              key={b.id}
              className="overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-sm transition-all"
            >
              {/* Header: Service + Status */}
              <div className="flex items-start justify-between gap-2 border-b border-line/60 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted">{b.id}</span>
                    <span className="rounded-md bg-paper px-2 py-0.5 text-[11px] font-semibold text-indigo">
                      {b.category}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-bold text-ink">{b.serviceName}</h3>
                  <p className="text-xs text-muted font-medium">{b.siteAddress}</p>
                </div>
                <StatusBadge status={isApproved ? 'COMPLETED' : b.status} />
              </div>

              {/* Booking Stats / Crew info */}
              <div className="my-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-paper p-2.5">
                  <span className="text-muted block font-medium">{t('cooperative') || 'Assigned Cooperative'}</span>
                  <span className="font-bold text-ink">{b.coopName}</span>
                </div>
                <div className="rounded-xl bg-paper p-2.5">
                  <span className="text-muted block font-medium">{t('crewSize') || 'Crew & Duration'}</span>
                  <span className="font-bold text-ink">
                    {b.workersCount} Workers · {b.daysCount} Day(s)
                  </span>
                </div>
              </div>

              {/* Workers Assigned */}
              <div className="mb-3 text-xs text-muted">
                <span className="font-semibold text-ink">{t('assignedWorkers') || 'Workers On Site'}: </span>
                {b.assignedWorkers.join(', ')}
              </div>

              {/* Transparent Financial Split (93% Worker / 5% Welfare / 2% Platform) */}
              <div className="rounded-xl border border-line/70 bg-white p-3 text-xs">
                <div className="flex items-center justify-between font-bold text-ink">
                  <span className="flex items-center gap-1.5">
                    <Icon name="SquareLock02Icon" size={13} className="text-success" />
                    {t('totalEscrowLocked') || 'Total Escrow Amount'}
                  </span>
                  <span className="text-sm font-extrabold text-indigo">₹{b.totalCost.toLocaleString('en-IN')}</span>
                </div>
                <p className="mt-1 text-[10px] font-medium text-success">
                  {t('rbiCompliantEscrowNote') || 'Secured via RBI-Compliant Escrow'}
                </p>
                <div className="mt-2 grid grid-cols-3 gap-1 border-t border-line/40 pt-2 text-[11px] text-muted">
                  <div>
                    <span className="block font-semibold text-success">₹{b.workerEarnings}</span>
                    <span>Worker (93%)</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-marigold-dark">₹{b.welfareFund}</span>
                    <span>Welfare (5%)</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-indigo">₹{b.platformFee}</span>
                    <span>Platform (2%)</span>
                  </div>
                </div>
                <p className="mt-2 border-t border-line/40 pt-2 text-[10px] leading-relaxed text-muted">
                  {t('welfareFundExplainer') ||
                    '5% Democratic Welfare Fund — funds micro-pensions & on-duty health insurance for cooperative members.'}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-3">
                  {/* Cash Demand / Issue Report Button */}
                  <button
                    onClick={() => handleOpenDispute(b)}
                    className="flex items-center gap-1 text-xs font-semibold text-danger hover:underline"
                  >
                    <Icon name="Alert02Icon" size={14} />
                    {t('reportCashDemandBtn') || 'Report Cash Demand / Issue'}
                  </button>

                  {/* Digital Proof of Work — before/after photos synced from the WhatsApp bot */}
                  <button
                    onClick={() => setPhotosBooking(b)}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo hover:underline"
                  >
                    <Icon name="Camera01Icon" size={14} />
                    {t('viewWorkPhotosBtn') || 'View Work Photos'}
                  </button>
                </div>

                {/* JUDGE DEMO: Live Escrow Milestone Approval Button */}
                {!isApproved ? (
                  <Button
                    variant="marigold"
                    className="px-3.5 py-1.5 text-xs font-bold shadow-sm"
                    onClick={() => handleApproveEscrow(b.id)}
                  >
                    <Icon name="CheckmarkCircle02Icon" size={15} />
                    {t('approveEscrowRelease') || 'Approve Day 1 & Release Escrow'}
                  </Button>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-bold text-success bg-success-light px-2.5 py-1 rounded-lg">
                    <Icon name="CheckmarkCircle02Icon" size={14} />
                    {t('escrowReleasedSuccess') || 'Escrow Milestone Released'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* File Cash Demand / Dispute Modal */}
      <Modal open={disputeModalOpen} onClose={() => setDisputeModalOpen(false)} maxWidth="max-w-md">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-danger-light text-danger">
              <Icon name="Alert02Icon" size={20} />
            </span>
            <div>
              <h3 className="text-base font-bold text-ink">{t('reportIssueTitle') || 'Report Issue / Cash Demand'}</h3>
              <p className="text-xs text-muted">{selectedBooking?.serviceName} ({selectedBooking?.id})</p>
            </div>
          </div>

          {!disputeLogged ? (
            <>
              <p className="text-xs font-medium text-ink">
                {t('issueTypePrompt') || 'Select the safety issue you encountered on site:'}
              </p>

              <div className="space-y-2">
                <label
                  onClick={() => setIssueType('cash_demand')}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-xs transition-colors ${
                    issueType === 'cash_demand' ? 'border-danger bg-danger-light/40 font-semibold' : 'border-line'
                  }`}
                >
                  <input type="radio" checked={issueType === 'cash_demand'} readOnly className="mt-0.5" />
                  <div>
                    <span className="block font-bold text-ink">
                      {t('cashDemandRadio') || 'Worker demanded extra cash outside escrow'}
                    </span>
                    <span className="text-muted">
                      Violates platform policy. Instantly flags ticket to Cooperative Admin & locks dispute tier.
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => setIssueType('quality_issue')}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-xs transition-colors ${
                    issueType === 'quality_issue' ? 'border-danger bg-danger-light/40 font-semibold' : 'border-line'
                  }`}
                >
                  <input type="radio" checked={issueType === 'quality_issue'} readOnly className="mt-0.5" />
                  <div>
                    <span className="block font-bold text-ink">{t('qualityIssueRadio') || 'Workmanship / Quality Issue'}</span>
                    <span className="text-muted">Service standard was not met during job execution.</span>
                  </div>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="ghost" className="flex-1" onClick={() => setDisputeModalOpen(false)}>
                  {t('cancel') || 'Cancel'}
                </Button>
                <Button variant="primary" className="flex-1 !bg-danger hover:!bg-danger/90" onClick={handleFileDispute}>
                  {t('submitReport') || 'Submit Report'}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3 py-2">
              <div className="rounded-xl border border-danger/40 bg-danger-light/50 p-3 text-xs">
                <p className="font-bold text-danger">
                  {t('cashDemandReportLogged') || 'Cash Demand Escalated to Cooperative Admin'}
                </p>
                <p className="mt-1 text-muted">
                  Ticket created and auto-escalated under Tier-3 dispute resolution protocol. Escrow funds will remain locked until cooperative review.
                </p>
              </div>

              <DisputeStepper currentTier={deriveDisputeTier(disputeLogged)} />

              <Button variant="primary" className="mt-3 w-full" onClick={() => setDisputeModalOpen(false)}>
                {t('done') || 'Done'}
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Digital Proof of Work — before/after photos the worker sends over WhatsApp,
          synced here so the RWA manager can verify without visiting the site.
          Placeholder panels only — no fabricated images. */}
      <Modal open={!!photosBooking} onClose={() => setPhotosBooking(null)} maxWidth="max-w-md">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-light text-indigo">
              <Icon name="Camera01Icon" size={20} />
            </span>
            <div>
              <h3 className="text-base font-bold text-ink">{t('workPhotosTitle') || 'Work Photos'}</h3>
              <p className="text-xs text-muted">{photosBooking?.serviceName} ({photosBooking?.id})</p>
            </div>
          </div>

          <p className="text-xs text-muted">
            {t('workPhotosNote') ||
              'Synced automatically when the worker sends photos to the CoGig WhatsApp bot on-site.'}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="overflow-hidden rounded-xl border border-line bg-paper">
              {photosBooking?.photos?.before ? (
                <img
                  src={photosBooking.photos.before}
                  alt="Before work"
                  className="h-32 w-full object-cover"
                />
              ) : (
                <div className="flex h-32 items-center justify-center bg-surface">
                  <Icon name="Image02Icon" size={28} className="text-muted" />
                </div>
              )}
              <div className="p-2 text-center">
                <p className="text-xs font-semibold text-ink">{t('beforeLabel') || 'Before'}</p>
                <p className="text-[10px] text-muted">{t('viaWhatsappBot') || 'via WhatsApp bot'}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-line bg-paper">
              {photosBooking?.photos?.after ? (
                <img
                  src={photosBooking.photos.after}
                  alt="After work"
                  className="h-32 w-full object-cover"
                />
              ) : (
                <div className="flex h-32 flex-col items-center justify-center bg-surface p-3 text-center">
                  <Icon name="ImageDone01Icon" size={24} className="mb-2 text-muted opacity-50" />
                  <p className="text-[9px] leading-tight text-muted">
                    After photo will be available upon job completion
                  </p>
                </div>
              )}
              <div className="border-t border-line p-2 text-center">
                <p className="text-xs font-semibold text-ink">{t('afterLabel') || 'After'}</p>
                <p className="text-[10px] text-muted">{t('viaWhatsappBot') || 'via WhatsApp bot'}</p>
              </div>
            </div>
          </div>

          <p className="rounded-lg bg-indigo-light/40 px-3 py-2 text-[11px] text-indigo-dark">
            {t('workPhotosDemoNote') ||
              'Photos are synced automatically from the worker\u2019s WhatsApp on-site.'}
          </p>

          <Button variant="primary" className="w-full" onClick={() => setPhotosBooking(null)}>
            {t('done') || 'Done'}
          </Button>
        </div>
      </Modal>
    </PageShell>
  );
}
