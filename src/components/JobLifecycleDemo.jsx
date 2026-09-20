import { useState } from 'react';
import { Icon } from './Icon';
import { Button } from './Button';
import { PillBadge } from './PillBadge';
import { BottomActionBar } from './BottomActionBar';
import { matchReasoning } from '../lib/matching';
import { useTranslation } from '../lib/i18n/LanguageContext';

const DEMO_JOB = {
  title: 'AC Repair & Servicing',
  standardizedRate: 500,
  distanceKm: 1.2,
  proximity: 92,
  rating: 94,
  availability: 96,
  compliance: 100,
  customer: 'Ankit Mehta (Flat 402, Green Valley)',
};

export function JobLifecycleDemo() {
  const { t } = useTranslation();
  const [step, setStep] = useState('assigned'); // assigned -> active -> receipt
  const [spareParts, setSpareParts] = useState([]);
  const [partName, setPartName] = useState('');
  const [partCost, setPartCost] = useState('');
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  const laborTotal = DEMO_JOB.standardizedRate;
  const partsTotal = spareParts.reduce((s, p) => s + Number(p.cost || 0), 0);

  // Exact 93% Worker / 5% Welfare Fund / 2% Platform split
  const workerShare = Math.round(laborTotal * 0.93) + partsTotal;
  const welfareShare = Math.round(laborTotal * 0.05);
  const platformFee = laborTotal - Math.round(laborTotal * 0.93) - welfareShare;
  const totalPaid = laborTotal + partsTotal;

  const openFromWhatsApp = () => {
    setShowWhatsApp(false);
    setStep('assigned');
  };

  const acceptJob = () => setStep('active');

  const addPart = () => {
    if (!partName.trim() || !partCost) return;
    setSpareParts((p) => [...p, { name: partName, cost: Number(partCost) }]);
    setPartName('');
    setPartCost('');
  };

  const markComplete = () => setStep('receipt');

  const resetDemo = () => {
    setStep('assigned');
    setSpareParts([]);
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-ink text-base">{t('jobLifecycleTitle') || 'Active Job Lifecycle Simulator'}</h3>
        {step === 'assigned' && !showWhatsApp && (
          <button
            onClick={() => setShowWhatsApp(true)}
            className="flex items-center gap-1.5 rounded-xl border border-success/40 bg-success-light px-2.5 py-1.5 text-xs font-bold text-success hover:border-success"
          >
            <Icon name="WhatsappIcon" size={14} />
            {t('viewAsWhatsApp') || 'WhatsApp Dispatch'}
          </button>
        )}
      </div>

      {showWhatsApp && (
        <div className="mb-4 overflow-hidden rounded-2xl border border-line">
          <div className="flex items-center gap-2 bg-[#075E54] px-3 py-2 text-white">
            <Icon name="WhatsappIcon" size={16} />
            <span className="text-xs font-bold">CoGig Labour Dispatch Bot</span>
          </div>
          <div className="bg-[#ECE5DD] p-4">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs text-ink leading-relaxed">
                🔔 <strong>New Crew Assignment!</strong>
                <br />
                {DEMO_JOB.title} · {DEMO_JOB.distanceKm}km away
                <br />
                Rate: ₹{DEMO_JOB.standardizedRate}/day (93% direct worker payout)
              </p>
              <button
                onClick={openFromWhatsApp}
                className="mt-2.5 w-full rounded-lg bg-[#25D366] py-2 text-xs font-bold text-white shadow-sm"
              >
                {t('viewJobWhatsapp') || 'Accept via WhatsApp Link'}
              </button>
            </div>
          </div>
          <p className="bg-surface px-3 py-2 text-[11px] text-muted font-medium">{t('whatsappHandoffNote') || 'No complex app installation required — workers interact via WhatsApp links'}</p>
        </div>
      )}

      {/* Step 1: Job Assigned */}
      {step === 'assigned' && !showWhatsApp && (
        <div className="pb-16">
          <h4 className="mb-2 text-xs font-semibold text-muted">{t('jobAssignedTitle') || 'Job Offer Details'}</h4>
          <div className="rounded-xl border border-line bg-paper p-4">
            <div className="flex items-center justify-between">
              <PillBadge tone="indigo">{t('aiAllocated') || 'AI Matched Crew'}</PillBadge>
              <div className="text-right">
                <div className="text-[10px] text-muted font-medium">{t('standardizedRate') || 'Standard Day Rate'}</div>
                <div className="text-base font-extrabold text-ink tabular">₹{DEMO_JOB.standardizedRate}</div>
              </div>
            </div>
            <div className="mt-2 text-base font-bold text-ink">{DEMO_JOB.title}</div>
            <div className="text-xs text-muted font-medium">
              {t('customerLabel') || 'Client'}: {DEMO_JOB.customer}
            </div>
            <p className="mt-2 text-xs text-muted">{matchReasoning(DEMO_JOB, t)}</p>

            <div className="mt-3 flex items-start gap-2 rounded-lg bg-indigo-light px-3 py-2 text-xs text-indigo-dark font-medium">
              <Icon name="ShieldEnergyIcon" size={14} className="mt-0.5 shrink-0" />
              {t('standardizedRateNote') || '93% of fare paid directly to your bank account upon customer approval.'}
            </div>
          </div>

          <BottomActionBar primary={{ label: t('acceptJob') || 'Accept Job & Start Work', onClick: acceptJob }} />
        </div>
      )}

      {/* Step 2: Active Job — Reassurance Signal for Worker */}
      {step === 'active' && (
        <div className="pb-16 space-y-4">
          <div className="flex items-center gap-2 rounded-xl bg-success-light px-3.5 py-2.5 text-xs font-bold text-success">
            <Icon name="CheckmarkCircle02Icon" size={16} />
            {t('jobAcceptedEscrowLocked') || 'Job Active · Escrow Funds Secured'}
          </div>

          <div className="rounded-xl border border-line bg-paper p-4">
            <h4 className="text-sm font-bold text-ink">{t('activeJob') || 'In Progress'}</h4>
            <div className="mt-2 flex items-start gap-2 rounded-xl bg-ink p-3 text-xs text-paper">
              <Icon name="ShieldEnergyIcon" size={16} className="mt-0.5 shrink-0 text-marigold" />
              <span>
                <strong>₹{laborTotal} Locked in Escrow</strong>
                <br />
                <span className="text-paper/80">Funds are guaranteed and automatically released when customer taps "Approve"</span>
              </span>
            </div>
          </div>

          {/* Add Spare Parts */}
          <div className="rounded-xl border border-line bg-white p-4 space-y-2">
            <div className="text-xs font-bold text-ink">{t('addSpareParts') || 'Add Spare Parts / Materials'}</div>
            <p className="text-[11px] text-muted">{t('noCommissionOnMaterials') || '100% pass-through reimbursement (0% platform cut on materials)'}</p>
            <div className="flex gap-2 pt-1">
              <input
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder={t('partNamePlaceholder') || 'Part name (e.g. Copper Pipe)'}
                className="input flex-1 text-xs"
              />
              <input
                type="number"
                value={partCost}
                onChange={(e) => setPartCost(e.target.value)}
                placeholder="₹"
                className="input w-20 text-xs"
              />
              <button
                onClick={addPart}
                className="flex size-9 items-center justify-center rounded-lg bg-indigo text-white hover:bg-indigo-dark"
              >
                <Icon name="Add02Icon" size={16} />
              </button>
            </div>
            {spareParts.length > 0 && (
              <div className="mt-2 space-y-1 border-t border-line pt-2 text-xs">
                {spareParts.map((p, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-ink font-medium">{p.name}</span>
                    <span className="tabular font-bold text-indigo">₹{p.cost}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Worker Trust Reassurance Banner (Moved Cash Demand report to Customer side) */}
          <div className="rounded-xl border border-indigo/30 bg-indigo-light/40 p-3.5 text-xs text-indigo-dark">
            <div className="flex items-center gap-2 font-bold">
              <Icon name="Shield01Icon" size={16} className="text-indigo" />
              <span>All Payments Go Through Escrow</span>
            </div>
            <p className="mt-1 text-[11px] text-muted leading-tight font-medium">
              You do not need to ask for cash. Customers pay securely through the app escrow, protecting both you and the customer.
            </p>
          </div>

          <BottomActionBar primary={{ label: t('markJobComplete') || 'Mark Job Finished', onClick: markComplete }} />
        </div>
      )}

      {/* Step 3: Payout Receipt */}
      {step === 'receipt' && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-success-light text-success">
              <Icon name="Invoice01Icon" size={22} />
            </div>
            <h4 className="mt-2 text-base font-bold text-ink">{t('paymentReleased') || 'Escrow Milestone Settled'}</h4>
            <div className="mt-1 text-2xl font-extrabold tabular text-ink">₹{totalPaid}</div>
            <p className="text-xs text-muted font-medium">{t('totalAmountPaid') || 'Total Payout Received'}</p>
          </div>

          <div className="space-y-2 rounded-xl border border-line bg-white p-4 text-xs">
            <div className="flex justify-between text-muted">
              <span>{t('laborCostEscrowed') || 'Labor Cost'}</span>
              <span className="tabular text-ink font-bold">₹{laborTotal}</span>
            </div>
            {partsTotal > 0 && (
              <div className="flex justify-between text-muted">
                <span>{t('sparePartsPassThrough') || 'Parts Reimbursement'}</span>
                <span className="tabular text-indigo font-bold">₹{partsTotal}</span>
              </div>
            )}
            <div className="border-t border-line/60 pt-2 text-[10px] font-bold uppercase tracking-wider text-muted">
              Democratic Cooperative Split
            </div>
            <div className="flex justify-between font-medium">
              <span className="flex items-center gap-1.5 text-ink">
                <span className="size-2 rounded-full bg-success" /> {t('workerEarnings') || 'Your Amount Earned'} (93%)
              </span>
              <span className="tabular font-extrabold text-success">₹{workerShare}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="flex items-center gap-1.5 text-ink">
                <span className="size-2 rounded-full bg-marigold" /> {t('welfareFund') || 'Welfare Fund'} (5%)
              </span>
              <span className="tabular text-ink font-bold">₹{welfareShare}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="flex items-center gap-1.5 text-ink">
                <span className="size-2 rounded-full bg-indigo" /> {t('platformFee') || 'Platform Fee'} (2%)
              </span>
              <span className="tabular text-ink font-bold">₹{platformFee}</span>
            </div>
          </div>

          <Button variant="primary" className="mt-4 w-full text-xs font-bold" onClick={resetDemo}>
            {t('backToJobs') || 'Back to Assignments'}
          </Button>
        </div>
      )}
    </div>
  );
}
