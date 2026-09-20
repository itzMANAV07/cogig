import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { Icon } from '../components/Icon';
import { AddressServiceabilityMap } from '../components/AddressServiceabilityMap';
import { BottomActionBar } from '../components/BottomActionBar';
import { useAppState } from '../lib/appState';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { calculateFare, computeDays, detectAreaTier } from '../lib/fareEngine';

const FORM_ID = 'post-requirement-form';

export default function PostRequirement() {
  const navigate = useNavigate();
  const { selectedService, selectedCategory, customer, setRequirement } = useAppState();
  const { t } = useTranslation();

  const [workers, setWorkers] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [address, setAddress] = useState(customer?.place || 'Green Valley Society, Patna');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fallback service if opened directly without prior selection
  const service = selectedService || { id: 'painter', titleKey: 'svc_painter', rate: 500 };
  const baseRate = service.rate || 500;

  // Auto-detect area tier from geocoded address string (Metro / Tier-2 / Tier-3)
  const areaTier = useMemo(() => detectAreaTier(address), [address]);

  // Compute total days from dates
  const days = useMemo(() => computeDays(startDate, endDate), [startDate, endDate]);

  // AI-calculated fare breakdown
  const fare = useMemo(() => {
    return calculateFare({
      baseRate,
      workers,
      days,
      areaTier,
    });
  }, [baseRate, workers, days, areaTier]);

  const handleWorkersChange = (delta) => {
    setWorkers((prev) => Math.max(1, prev + delta));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const draft = {
      workers,
      startDate,
      endDate,
      address,
      notes,
      service,
      category: selectedCategory || 'household',
      fare,
    };
    setRequirement(draft);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('contracts').insert({
          client_name: customer?.name || customer?.place || 'Demo Customer',
          role_needed: service?.titleKey ? t(service.titleKey) : service.id,
          status: 'PENDING',
          total_budget: fare.totalLaborCost,
          start_date: startDate || null,
          end_date: endDate || null,
          site_address: address,
        });
      } catch (err) {
        console.warn('Supabase insert skipped:', err.message);
      }
    }

    setSubmitting(false);
    navigate('/customer/bookings');
  };

  return (
    <PageShell
      title={t('postRequirementTitle') || 'Request Service & Lock Escrow'}
      breadcrumb={`${service ? (service.titleKey ? t(service.titleKey) : service.id) : ''} — ${
        selectedCategory === 'household'
          ? (t('householdService') || 'Household')
          : (t('communityService') || 'Community')
      }`}
      back="/customer/home"
      hasBottomBar
      roleNav="customer"
    >
      <form id={FORM_ID} onSubmit={submit} className="space-y-5 pb-6">
        {/* Workers Stepper & Service Info */}
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-muted">{t('serviceSelected') || 'Selected Service'}</span>
              <h3 className="text-base font-bold text-ink">
                {service.titleKey ? t(service.titleKey) : service.id}
              </h3>
              <p className="text-xs font-medium text-indigo">
                {t('standardBaseRate') || 'Gov Fixed Rate'}: ₹{baseRate}/day
              </p>
            </div>

            {/* Workers Stepper (+/-) */}
            <div className="flex flex-col items-end">
              <span className="mb-1 text-xs font-semibold text-muted">{t('workersNeeded') || 'Workers Count'}</span>
              <div className="flex items-center gap-2 rounded-xl border border-line bg-paper p-1">
                <button
                  type="button"
                  onClick={() => handleWorkersChange(-1)}
                  className="flex size-8 items-center justify-center rounded-lg bg-surface text-ink hover:bg-line active:scale-95 disabled:opacity-30"
                  disabled={workers <= 1}
                >
                  <Icon name="Minus01Icon" size={16} />
                </button>
                <span className="w-6 text-center text-sm font-bold text-ink tabular">{workers}</span>
                <button
                  type="button"
                  onClick={() => handleWorkersChange(1)}
                  className="flex size-8 items-center justify-center rounded-lg bg-ink text-paper hover:bg-ink/90 active:scale-95"
                >
                  <Icon name="Add01Icon" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selectors */}
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('startDate') || 'Start Date'}>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input text-xs font-semibold"
            />
          </Field>
          <Field label={t('endDate') || 'End Date'}>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input text-xs font-semibold"
            />
          </Field>
        </div>

        {/* Location & Address */}
        <Field label={t('address') || 'Service Location / Address'}>
          <textarea
            required
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input text-xs"
            placeholder="Flat no, building, society name..."
          />
        </Field>

        {/* Serviceability Map */}
        {address.trim().length > 3 && <AddressServiceabilityMap address={address} />}

        {/* Additional Notes */}
        <Field label={t('additionalNotes') || 'Additional Work Instructions'}>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input text-xs"
            placeholder={t('notesPlaceholder') || 'e.g. Specific tools needed, parking info...'}
          />
        </Field>

        {/* AI Auto-Calculated Fare Preview Card */}
        <div className="rounded-2xl border border-marigold/60 bg-gradient-to-br from-marigold-light/30 via-surface to-surface p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-line/60 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-marigold text-ink font-bold text-xs">
                AI
              </span>
              <div>
                <h4 className="text-xs font-bold text-ink">{t('aiFareTitle') || 'AI Standardized Fare'}</h4>
                <p className="text-[10px] text-muted font-medium">
                  {fare.areaLabel} ({fare.areaMultiplier}x) · Inflation (1.05x)
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-muted block">{t('totalPayable') || 'Total Escrow'}</span>
              <span className="text-xl font-extrabold text-ink tabular">
                ₹{fare.totalLaborCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted">
              <span>
                ₹{fare.adjustedRate}/day × {workers} Worker(s) × {days} Day(s)
              </span>
              <span className="font-semibold text-ink">₹{fare.totalLaborCost}</span>
            </div>

            {/* Split (93 / 5 / 2) */}
            <div className="mt-2.5 grid grid-cols-3 gap-2 rounded-xl bg-paper/80 p-2.5 text-[11px]">
              <div>
                <span className="block font-bold text-success">₹{fare.workerEarnings}</span>
                <span className="text-muted text-[10px]">Worker (93%)</span>
              </div>
              <div>
                <span className="block font-bold text-marigold-dark">₹{fare.welfareFund}</span>
                <span className="text-muted text-[10px]">Welfare (5%)</span>
              </div>
              <div>
                <span className="block font-bold text-indigo">₹{fare.platformFee}</span>
                <span className="text-muted text-[10px]">Platform (2%)</span>
              </div>
            </div>
          </div>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted">
          <Icon name="Shield01Icon" size={14} />
          {t('escrowNote') || 'Funds held safely in escrow until you approve completed work'}
        </p>
      </form>

      <BottomActionBar
        primary={{
          type: 'submit',
          form: FORM_ID,
          label: submitting ? (t('posting') || 'Locking Escrow...') : (t('postRequirementBtn') || `Lock ₹${fare.totalLaborCost.toLocaleString('en-IN')} in Escrow`),
        }}
        disabled={submitting}
      />
    </PageShell>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}
