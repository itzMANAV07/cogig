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
import { SERVICES } from '../lib/catalog';
import { cn } from '../lib/cn';

const FORM_ID = 'post-requirement-form';

export default function PostRequirement() {
  const navigate = useNavigate();
  const {
    selectedService,
    setSelectedService,
    selectedCategory,
    customer,
    setRequirement,
    workersList,
    addBooking,
    selectedCity,
  } = useAppState();
  const { t } = useTranslation();

  // Active service with fallback
  const currentService = selectedService || { id: 'plumber', titleKey: 'svc_plumber', rate: 550 };
  const baseRate = currentService.rate || 550;

  // Form State — Simplified per user request: Date, Time Slot, Info, Map, Hire CTA (No worker pick, No urgency)
  const [timeSlot, setTimeSlot] = useState('morning');
  const [workers, setWorkers] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [address, setAddress] = useState(customer?.place || selectedCity?.defaultAddress || 'Vidyanagar Main Road, Davangere');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // RWA / Community fields
  const [communityUnits, setCommunityUnits] = useState('');
  const [societyName, setSocietyName] = useState('');
  const [commonArea, setCommonArea] = useState('all');

  // Available services list for quick switching
  const availableServices = selectedCategory === 'community' ? SERVICES.community : SERVICES.household;

  // Auto-detect area tier from geocoded address string
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

  const handleServiceChange = (e) => {
    const found = availableServices.find((s) => s.id === e.target.value);
    if (found && setSelectedService) {
      setSelectedService(found);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Auto-assigned top certified cooperative worker
    const primaryWorkerName = workersList?.[0]?.name
      ? `${workersList[0].name} (${workersList[0].skill || 'Certified Member'})`
      : 'Manjunath Gowda (Certified Plumber)';

    const newBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceName: currentService.titleKey ? (t(currentService.titleKey) || currentService.id) : currentService.id,
      category: selectedCategory === 'community' ? 'Community' : 'Household',
      workersCount: workers,
      daysCount: days,
      siteAddress: address,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || startDate || new Date().toISOString().split('T')[0],
      totalCost: fare.totalLaborCost,
      workerEarnings: fare.workerEarnings,
      welfareFund: fare.welfareFund,
      platformFee: fare.platformFee,
      status: 'ACTIVE',
      coopName: selectedCity?.coopName || 'Sri Basaveshwara Labour Cooperative Society',
      assignedWorkers: [
        primaryWorkerName,
        ...(workers > 1 ? ['Ramesh Kumar (Assistant)'] : []),
      ],
      approvalStatus: 'PENDING_APPROVAL',
      bookingType: 'booking',
      timeSlot,
      societyName: selectedCategory === 'community' ? societyName : null,
      communityUnits: selectedCategory === 'community' ? communityUnits : null,
      commonArea: selectedCategory === 'community' ? commonArea : null,
      notes,
      createdAt: new Date().toISOString(),
      photos: {
        before: '/ac-before.png',
      },
    };

    // Save to global reactive state
    if (addBooking) {
      addBooking(newBooking);
    }

    // Save requirement draft
    setRequirement(newBooking);

    // Save to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        await supabase.from('contracts').insert({
          client_name: customer?.name || customer?.place || 'Demo Customer',
          role_needed: currentService?.titleKey ? t(currentService.titleKey) : currentService.id,
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
      title={t('postRequirementTitle') || 'Book Worker & Lock Escrow'}
      breadcrumb={`${currentService ? (currentService.titleKey ? t(currentService.titleKey) : currentService.id) : ''} — ${
        selectedCategory === 'household'
          ? (t('householdService') || 'Household')
          : (t('communityService') || 'Community')
      }`}
      back="/customer/home"
      hasBottomBar
      roleNav="customer"
    >
      <form id={FORM_ID} onSubmit={submit} className="space-y-5 pb-8">
        {/* Step 1: Work / Trade Selection & Worker Stepper */}
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                {t('serviceSelected') || '1. Work Trade'}
              </span>
              <div className="mt-1 flex items-center gap-2">
                <select
                  value={currentService.id}
                  onChange={handleServiceChange}
                  className="font-bold text-ink bg-transparent text-base border-b border-dashed border-line focus:outline-none focus:border-indigo cursor-pointer"
                >
                  {availableServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.titleKey ? (t(s.titleKey) || s.id) : s.id} (₹{s.rate || 550}/day)
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs font-medium text-indigo mt-0.5">
                {t('standardBaseRate') || 'Cooperative Fair Wage'}: ₹{baseRate}/day
              </p>
            </div>

            {/* Workers Count Stepper */}
            <div className="flex flex-col items-end">
              <span className="mb-1 text-[11px] font-semibold text-muted">{t('workersNeeded') || 'Workers'}</span>
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

        {/* Step 2: Date & Preferred Time Slot (Urgency Removed per requirement) */}
        <div className="space-y-3 rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
            2. Schedule & Timing
          </span>

          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('startDate') || 'Job Date / Start Date'}>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input text-xs font-semibold"
              />
            </Field>
            <Field label={t('endDate') || 'End Date (Optional)'}>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input text-xs font-semibold"
              />
            </Field>
          </div>

          {/* Time Slot Picker */}
          <Field label={t('timeSlot') || 'Preferred Time Slot'}>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="input text-xs font-semibold"
            >
              <option value="morning">{t('morningSlot') || 'Morning (8:00 AM – 12:00 PM)'}</option>
              <option value="afternoon">{t('afternoonSlot') || 'Afternoon (12:00 PM – 4:00 PM)'}</option>
              <option value="evening">{t('eveningSlot') || 'Evening (4:00 PM – 8:00 PM)'}</option>
              <option value="flexible">{t('flexibleSlot') || 'Flexible / Any Time'}</option>
            </select>
          </Field>

          {/* RWA & Community Fields (shown only when category is community) */}
          {selectedCategory === 'community' && (
            <div className="space-y-3 border-t border-line/60 pt-3">
              <h4 className="text-xs font-bold text-ink">{t('communityDetails') || 'Community / RWA Details'}</h4>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t('societyName') || 'Society Name'}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vidyanagar Enclave"
                    value={societyName}
                    onChange={(e) => setSocietyName(e.target.value)}
                    className="input text-xs"
                  />
                </Field>
                <Field label={t('units') || 'Number of Units'}>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 120"
                    value={communityUnits}
                    onChange={(e) => setCommunityUnits(e.target.value)}
                    className="input text-xs"
                  />
                </Field>
              </div>

              <Field label={t('commonAreas') || 'Common Area Coverage'}>
                <select
                  value={commonArea}
                  onChange={(e) => setCommonArea(e.target.value)}
                  className="input text-xs"
                >
                  <option value="lobby">{t('lobby') || 'Lobby & Reception'}</option>
                  <option value="stairwell">{t('stairwell') || 'Stairwell & Passages'}</option>
                  <option value="parking">{t('parking') || 'Basement & Parking Area'}</option>
                  <option value="garden">{t('garden') || 'Clubhouse & Garden'}</option>
                  <option value="all">{t('allCommonAreas') || 'All Society Common Areas'}</option>
                </select>
              </Field>
            </div>
          )}
        </div>

        {/* Step 3: Job Location & Serviceability Map */}
        <div className="space-y-3 rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
            3. Job Location & Notes
          </span>

          <Field label={t('address') || 'Site Address'}>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input text-xs font-medium"
              placeholder="Flat / House no, street, landmark, city..."
            />
          </Field>

          {/* Interactive OpenStreetMap for Serviceability */}
          {address.trim().length > 3 && <AddressServiceabilityMap address={address} />}

          <Field label={t('additionalNotes') || 'Specific Instructions / Tools Needed'}>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input text-xs"
              placeholder={t('notesPlaceholder') || 'e.g. Bring safety ladder, water pipe leaking under kitchen sink...'}
            />
          </Field>
        </div>

        {/* Certified Cooperative Guarantee Card (Replaces worker selection) */}
        <div className="rounded-2xl border border-indigo/20 bg-indigo-light/30 p-4 flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo text-white shadow-xs">
            <Icon name="Shield01Icon" size={18} />
          </span>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-ink">Cooperative Guaranteed Dispatch</span>
              <span className="rounded-full bg-success text-white px-2 py-0.5 text-[9px] font-bold">
                100% Aadhaar Verified
              </span>
            </div>
            <p className="text-muted leading-relaxed">
              The regional cooperative society will dispatch certified, background-verified professionals for your scheduled slot with zero price-gouging and escrow protection.
            </p>
          </div>
        </div>

        {/* Step 4: AI Standardized Escrow Fare Preview */}
        <div className="rounded-2xl border border-marigold/60 bg-gradient-to-br from-marigold-light/30 via-surface to-surface p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-line/60 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-marigold text-ink font-bold text-xs">
                AI
              </span>
              <div>
                <h4 className="text-xs font-bold text-ink">{t('aiFareTitle') || 'AI Standardized Escrow Fare'}</h4>
                <p className="text-[10px] text-muted font-medium">
                  {fare.areaLabel} ({fare.areaMultiplier}x) · Guaranteed 0% surge price-gouging
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-muted block">{t('totalPayable') || 'Total Escrow'}</span>
              <span className="text-xl font-extrabold text-ink tabular font-mono">
                ₹{fare.totalLaborCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Fare Calculation Math */}
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted">
              <span>
                ₹{fare.adjustedRate}/day × {workers} Worker(s) × {days} Day(s)
              </span>
              <span className="font-semibold text-ink">₹{fare.totalLaborCost}</span>
            </div>

            {/* Split (93% Worker / 5% Welfare / 2% Platform) */}
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

        {/* Step 5: Direct Action Option to Book / Hire Worker */}
        <div className="rounded-2xl border-2 border-indigo bg-paper p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-extrabold text-ink">Book Worker & Send Request</h4>
              <p className="text-xs text-muted">Dispatches cooperative crew for your slot</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-muted block">Escrow Amount</span>
              <span className="text-lg font-extrabold text-indigo font-mono">₹{fare.totalLaborCost}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo hover:bg-indigo-dark active:scale-98 py-3 text-sm font-bold text-white shadow-sm transition-all"
          >
            <Icon name="Calendar03Icon" size={18} />
            <span>{submitting ? 'Sending Request...' : `Hire Worker & Send Booking Request (₹${fare.totalLaborCost})`}</span>
          </button>

          <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted pt-1">
            <Icon name="Shield01Icon" size={13} className="text-success" />
            <span>Funds safely held in RBI-compliant escrow until you inspect and approve work</span>
          </p>
        </div>
      </form>

      {/* Sticky Bottom Action Bar */}
      <BottomActionBar
        primary={{
          type: 'submit',
          form: FORM_ID,
          label: submitting
            ? 'Sending Booking Request...'
            : `Hire Worker & Send Request (₹${fare.totalLaborCost})`,
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
