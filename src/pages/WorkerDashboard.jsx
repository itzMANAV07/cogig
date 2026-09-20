/**
 * Gig Worker Dashboard (Provider View)  ->  src/pages/WorkerDashboard.jsx
 *
 * Built from DESIGN.md: Tailwind tokens (blue-600 / emerald-500 / slate), 48px tap
 * targets, Hugeicons for UI icons, Morphicons for animated states, thesvg.org for brands.
 *
 * Install once:  npm i morphicons
 * (@hugeicons/react, @hugeicons/core-free-icons, react-router-dom, clsx,
 *  tailwind-merge and @supabase/supabase-js are already in your package.json.)
 *
 * What this file wires into your app
 *   - Language:  English, Hindi and Kannada. Nav labels and the demo banner reuse your
 *                existing translation keys; everything else lives in COPY below, so you
 *                do not need to edit translations.js. Have a native speaker review the
 *                Hindi and Kannada strings.
 *   - Data:      Reads today's contracts from Supabase when VITE_SUPABASE_URL and
 *                VITE_SUPABASE_ANON_KEY are set. If they are missing, the query fails, the
 *                app shows demo data plus a banner (same pattern as RwaDashboard).
 *                Marking a job complete updates contracts.status.
 *   - State:     Availability reads/writes useAppState().workerOnline.
 *
 * Two names in DESIGN.md that I could not find as public libraries:
 *   - "Sansians components": Button, Card, Badge and Avatar are defined below as small
 *     Tailwind components with the usual variant structure. Replace that block with real
 *     imports once you have the package name.
 *   - "trnsition.dev": every hover / active / expand class lives in the `trn` object.
 *     Swap its values and every interaction updates.
 *
 * Known gap: the contracts query is NOT filtered to the signed-in worker, because the
 * contract_workers columns are not in the code you shared. Add a filter where marked
 * "WORKER FILTER" once you know them. Weekly totals are still demo values for the same
 * reason (no amount column visible on escrow_ledger).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { MorphIcon } from 'morphicons/react';
import {
  Building06Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  DropletIcon,
  Globe02Icon,
  GpsSignal01Icon,
  Home01Icon,
  Invoice01Icon,
  PaintBoardIcon,
  Shield01Icon,
  Tick02Icon,
  UserCheck01Icon,
  UserGroup02Icon,
  Wrench01Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '../lib/cn';
import { useAppState } from '../lib/appState';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { LANGUAGES } from '../lib/i18n/translations';

/* -------------------------------------------------------------------------- */
/* trnsition.dev layer: every interaction class lives here                    */
/* -------------------------------------------------------------------------- */
const SPRING = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]'; // small overshoot, for presses and slides
const SMOOTH = 'ease-[cubic-bezier(0.32,0.72,0,1)]'; // no overshoot, for height changes

const trn = {
  press: `transition-[transform,box-shadow,background-color,border-color,color] duration-200 ${SPRING} motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.97] hover:shadow-md motion-reduce:transition-none`,
  tap: `transition-colors duration-200 active:bg-slate-50 motion-reduce:transition-none`,
  tab: `transition-[transform,color,background-color] duration-200 ${SPRING} motion-safe:active:scale-90 motion-reduce:transition-none`,
  expand: `grid transition-[grid-template-rows,opacity] duration-300 ${SMOOTH} motion-reduce:transition-none`,
  enter: `transition-[opacity,transform] duration-500 ${SMOOTH} motion-reduce:transition-none`,
  pop: `transition-[opacity,transform] duration-200 ${SPRING} motion-reduce:transition-none`,
};

/* -------------------------------------------------------------------------- */
/* Sansians-style components (Tailwind only)                                  */
/* -------------------------------------------------------------------------- */
const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50';

const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
  outline: 'border border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50',
};

function Button({ as: Comp = 'button', variant = 'primary', className, ...props }) {
  return (
    <Comp
      className={cn(
        'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-semibold',
        buttonVariants[variant],
        focusRing,
        trn.press,
        className
      )}
      {...props}
    />
  );
}

function Card({ className, ...props }) {
  return <div className={cn('rounded-2xl border border-slate-200 bg-white shadow-sm', className)} {...props} />;
}

const badgeTones = {
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  blue: 'bg-blue-50 text-blue-700 ring-blue-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
};

function Badge({ tone = 'slate', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

function Avatar({ initials, className }) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-blue-600 font-semibold tracking-tight text-white',
        className
      )}
    >
      {initials}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */
function UiIcon({ icon, size = 20, strokeWidth = 1.8, className }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={strokeWidth} className={className} />;
}

// Morphicons takes raw path data too. These two chevrons share one structure, so the
// morph reads as a clean flip.
const CHEVRON_DOWN = 'M6 9.5L12 15.5L18 9.5';
const CHEVRON_UP = 'M6 14.5L12 8.5L18 14.5';

// Brand logos come from thesvg.org: https://thesvg.org/icons/{slug}/{variant}.svg
// Slugs used here (whatsapp, upi, phonepe) exist in the library. For production, self-host:
//   npx @thesvg/cli add whatsapp upi phonepe --format jsx
const THESVG = 'https://thesvg.org/icons';

function BrandLogo({ slug, label, className }) {
  return (
    <img
      src={`${THESVG}/${slug}/default.svg`}
      alt={label}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        e.currentTarget.style.visibility = 'hidden';
      }}
      className={cn('w-auto shrink-0', className)}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Copy: English, Hindi, Kannada                                              */
/* -------------------------------------------------------------------------- */
const COPY = {
  en: {
    coopLabel: 'Your cooperative',
    openAccount: 'Open your account',
    changeLanguage: 'Change language',
    greetMorning: 'Good morning',
    greetAfternoon: 'Good afternoon',
    greetEvening: 'Good evening',
    verifiedMember: 'Verified co-op member',
    youAreAvailable: "You're available",
    youAreOffline: "You're offline",
    offersOnWhatsApp: 'New offers reach you on WhatsApp',
    goOnline: 'Go online to receive new job offers',
    availability: 'Availability',
    optOffline: 'Offline',
    optAvailable: 'Available',
    earnedWeek: 'Earned this week',
    daysWorked: 'Days worked',
    jobsDone: 'Jobs done',
    clientRating: 'Client rating',
    paidWeeklyTo: 'Paid every week to',
    todaysJobs: "Today's jobs",
    needApproval: (n) => `${n} ${n === 1 ? 'job needs' : 'jobs need'} approval`,
    youllEarn: "You'll earn",
    emptyTitle: 'No visits scheduled today',
    emptyBody: 'Go online and new offers will appear here.',
    allDay: 'All day',
    statusInProgress: 'In progress',
    statusConfirmed: 'Confirmed',
    statusPending: 'Awaiting approval',
    statusCompleted: 'Completed',
    address: 'Address',
    client: 'Client',
    verified: 'Verified',
    workingWith: 'Working with',
    moneyTitle: 'Where the money goes',
    clientPays: 'Client pays',
    welfare: 'Co-op welfare fund (5%)',
    fee: 'Platform fee (2%)',
    youEarn: 'You earn',
    pendingNote: "The society must approve this job before you can start. You'll get a WhatsApp message when it does.",
    startNav: 'Start navigation',
    markComplete: 'Mark job complete',
    messageOn: (name) => `Message ${name} on WhatsApp`,
    waGreeting: (client, worker, title) => `Hi ${client}, this is ${worker} from the cooperative about ${title}.`,
    navAria: 'Worker navigation',
  },
  hi: {
    coopLabel: 'आपकी सहकारी संस्था',
    openAccount: 'अपना खाता खोलें',
    changeLanguage: 'भाषा बदलें',
    greetMorning: 'सुप्रभात',
    greetAfternoon: 'नमस्कार',
    greetEvening: 'शुभ संध्या',
    verifiedMember: 'सत्यापित सहकारी सदस्य',
    youAreAvailable: 'आप उपलब्ध हैं',
    youAreOffline: 'आप ऑफ़लाइन हैं',
    offersOnWhatsApp: 'नए ऑफ़र आपको WhatsApp पर मिलेंगे',
    goOnline: 'नए काम के ऑफ़र पाने के लिए ऑनलाइन हों',
    availability: 'उपलब्धता',
    optOffline: 'ऑफ़लाइन',
    optAvailable: 'उपलब्ध',
    earnedWeek: 'इस सप्ताह की कमाई',
    daysWorked: 'काम के दिन',
    jobsDone: 'पूरे किए काम',
    clientRating: 'ग्राहक रेटिंग',
    paidWeeklyTo: 'हर सप्ताह भुगतान यहाँ:',
    todaysJobs: 'आज के काम',
    needApproval: (n) => `${n} काम को मंज़ूरी चाहिए`,
    youllEarn: 'आप कमाएँगे',
    emptyTitle: 'आज कोई विज़िट तय नहीं है',
    emptyBody: 'ऑनलाइन हों, नए ऑफ़र यहाँ दिखेंगे।',
    allDay: 'पूरा दिन',
    statusInProgress: 'जारी है',
    statusConfirmed: 'पक्का',
    statusPending: 'मंज़ूरी का इंतज़ार',
    statusCompleted: 'पूर्ण',
    address: 'पता',
    client: 'ग्राहक',
    verified: 'सत्यापित',
    workingWith: 'साथ में काम',
    moneyTitle: 'पैसा कहाँ जाता है',
    clientPays: 'ग्राहक देता है',
    welfare: 'सहकारी कल्याण कोष (5%)',
    fee: 'प्लेटफ़ॉर्म शुल्क (2%)',
    youEarn: 'आपकी कमाई',
    pendingNote: 'शुरू करने से पहले सोसाइटी को यह काम मंज़ूर करना होगा। मंज़ूरी मिलते ही आपको WhatsApp संदेश आएगा।',
    startNav: 'नेविगेशन शुरू करें',
    markComplete: 'काम पूरा हुआ चिह्नित करें',
    messageOn: (name) => `WhatsApp पर ${name} को संदेश भेजें`,
    waGreeting: (client, worker, title) =>
      `नमस्ते ${client}, मैं ${worker} सहकारी संस्था से, "${title}" के बारे में बात कर रहा हूँ।`,
    navAria: 'श्रमिक नेविगेशन',
  },
  kn: {
    coopLabel: 'ನಿಮ್ಮ ಸಹಕಾರಿ ಸಂಸ್ಥೆ',
    openAccount: 'ನಿಮ್ಮ ಖಾತೆ ತೆರೆಯಿರಿ',
    changeLanguage: 'ಭಾಷೆ ಬದಲಿಸಿ',
    greetMorning: 'ಶುಭೋದಯ',
    greetAfternoon: 'ಶುಭ ಮಧ್ಯಾಹ್ನ',
    greetEvening: 'ಶುಭ ಸಂಜೆ',
    verifiedMember: 'ಪರಿಶೀಲಿತ ಸಹಕಾರಿ ಸದಸ್ಯ',
    youAreAvailable: 'ನೀವು ಲಭ್ಯವಿದ್ದೀರಿ',
    youAreOffline: 'ನೀವು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ',
    offersOnWhatsApp: 'ಹೊಸ ಕೆಲಸದ ಆಫರ್‌ಗಳು WhatsApp ನಲ್ಲಿ ಬರುತ್ತವೆ',
    goOnline: 'ಹೊಸ ಕೆಲಸದ ಆಫರ್ ಪಡೆಯಲು ಆನ್‌ಲೈನ್‌ಗೆ ಬನ್ನಿ',
    availability: 'ಲಭ್ಯತೆ',
    optOffline: 'ಆಫ್‌ಲೈನ್',
    optAvailable: 'ಲಭ್ಯ',
    earnedWeek: 'ಈ ವಾರದ ಗಳಿಕೆ',
    daysWorked: 'ಕೆಲಸ ಮಾಡಿದ ದಿನಗಳು',
    jobsDone: 'ಪೂರ್ಣಗೊಂಡ ಕೆಲಸಗಳು',
    clientRating: 'ಗ್ರಾಹಕ ರೇಟಿಂಗ್',
    paidWeeklyTo: 'ಪ್ರತಿ ವಾರ ಪಾವತಿ:',
    todaysJobs: 'ಇಂದಿನ ಕೆಲಸಗಳು',
    needApproval: (n) => `${n} ಕೆಲಸಕ್ಕೆ ಅನುಮೋದನೆ ಬೇಕು`,
    youllEarn: 'ನೀವು ಗಳಿಸುವಿರಿ',
    emptyTitle: 'ಇಂದು ಯಾವುದೇ ಭೇಟಿ ನಿಗದಿಯಾಗಿಲ್ಲ',
    emptyBody: 'ಆನ್‌ಲೈನ್‌ಗೆ ಬನ್ನಿ, ಹೊಸ ಆಫರ್‌ಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.',
    allDay: 'ದಿನವಿಡೀ',
    statusInProgress: 'ನಡೆಯುತ್ತಿದೆ',
    statusConfirmed: 'ದೃಢಪಟ್ಟಿದೆ',
    statusPending: 'ಅನುಮೋದನೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ',
    statusCompleted: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    address: 'ವಿಳಾಸ',
    client: 'ಗ್ರಾಹಕ',
    verified: 'ಪರಿಶೀಲಿತ',
    workingWith: 'ಜೊತೆಗೆ ಕೆಲಸ',
    moneyTitle: 'ಹಣ ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತದೆ',
    clientPays: 'ಗ್ರಾಹಕ ಪಾವತಿಸುತ್ತಾರೆ',
    welfare: 'ಸಹಕಾರಿ ಕಲ್ಯಾಣ ನಿಧಿ (5%)',
    fee: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಶುಲ್ಕ (2%)',
    youEarn: 'ನಿಮ್ಮ ಗಳಿಕೆ',
    pendingNote:
      'ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು ಸೊಸೈಟಿ ಈ ಕೆಲಸಕ್ಕೆ ಅನುಮೋದನೆ ನೀಡಬೇಕು. ಅನುಮೋದನೆ ಸಿಕ್ಕ ತಕ್ಷಣ WhatsApp ಸಂದೇಶ ಬರುತ್ತದೆ.',
    startNav: 'ನ್ಯಾವಿಗೇಷನ್ ಆರಂಭಿಸಿ',
    markComplete: 'ಕೆಲಸ ಪೂರ್ಣ ಎಂದು ಗುರುತಿಸಿ',
    messageOn: (name) => `WhatsApp ನಲ್ಲಿ ${name} ಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ`,
    waGreeting: (client, worker, title) =>
      `ನಮಸ್ಕಾರ ${client}, ನಾನು ${worker}, ಸಹಕಾರಿ ಸಂಸ್ಥೆಯಿಂದ, "${title}" ಬಗ್ಗೆ.`,
    navAria: 'ಕಾರ್ಮಿಕ ನ್ಯಾವಿಗೇಷನ್',
  },
};

// Falls back to English for any key a language is missing.
function useCopy() {
  const { lang } = useTranslation();
  return useMemo(() => ({ ...COPY.en, ...(COPY[lang] ?? {}) }), [lang]);
}

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */
const WORKER = {
  firstName: 'Manjunath',
  initials: 'MG',
  coop: 'Bengaluru Workers Labour Cooperative Society',
  upiId: 'manjunath.gowda@ybl',
};

const WEEK = { earned: 8800, days: 6, jobs: 9, rating: 4.8 };

// Demo jobs. Shown when Supabase is not configured or the query fails.
const DEMO_JOBS = [
  {
    id: 'BK-1092',
    title: 'AC repair and servicing',
    icon: Wrench01Icon,
    time: '10:30 AM',
    status: 'IN_PROGRESS',
    clientPays: 1100,
    client: 'Ankit Mehta',
    clientPhone: '919876500001',
    address: 'Flat 402, Green Valley Apartments, Hennur Main Road, Bengaluru',
    crew: ['Suresh Yadav (Helper)'],
    notes: 'Gate code is in the WhatsApp chat. Bring the gas gauge kit.',
  },
  {
    id: 'BK-1095',
    title: 'Pipe leakage repair',
    icon: DropletIcon,
    time: '2:00 PM',
    status: 'CONFIRMED',
    clientPays: 1300,
    client: 'Meera Nair',
    clientPhone: '919876500002',
    address: 'B-12, Prakruthi Township, Horamavu Agara, Bengaluru',
    crew: [],
    notes: 'Kitchen sink line. The client attached photos to the booking.',
  },
  {
    id: 'BK-1097',
    title: 'Stairwell touch-up painting',
    icon: PaintBoardIcon,
    time: '5:30 PM',
    status: 'PENDING',
    clientPays: 2000,
    client: 'Vidya Enclave RWA',
    clientPhone: '919876500003',
    address: 'Vidya Enclave, Kalyan Nagar, Bengaluru',
    crew: ['Ramesh Kumar (Painter)', 'Anita Devi (Supervisor)'],
    notes: '',
  },
];

const STATUS = {
  IN_PROGRESS: { key: 'statusInProgress', tone: 'blue' },
  CONFIRMED: { key: 'statusConfirmed', tone: 'emerald' },
  PENDING: { key: 'statusPending', tone: 'amber' },
  COMPLETED: { key: 'statusCompleted', tone: 'slate' },
};

// contracts.status (database) -> job status (screen)
const STATUS_FROM_DB = {
  ACTIVE: 'IN_PROGRESS',
  PENDING: 'PENDING',
  PENDING_APPROVAL: 'PENDING',
  COMPLETED: 'COMPLETED',
};

const ROLE_ICONS = [
  [/plumb|pipe/i, DropletIcon],
  [/paint/i, PaintBoardIcon],
];
const iconForRole = (role = '') => ROLE_ICONS.find(([re]) => re.test(role))?.[1] ?? Wrench01Icon;

// Columns match the ones RwaDashboard and PostRequirement already use on `contracts`.
function fromContract(row) {
  return {
    id: String(row.contract_id),
    title: row.role_needed || 'Service visit',
    icon: iconForRole(row.role_needed),
    time: null, // contracts store dates, not a time of day
    status: STATUS_FROM_DB[row.status] ?? 'CONFIRMED',
    clientPays: Number(row.total_budget || 0),
    client: row.client_name || 'Client',
    clientPhone: null,
    address: row.site_address || '',
    crew: [],
    notes: '',
  };
}

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

// Transparent split: 93% to the worker, 5% welfare fund, 2% platform fee.
function payout(total) {
  const worker = Math.round(total * 0.93);
  const welfare = Math.round(total * 0.05);
  return { total, worker, welfare, fee: total - worker - welfare };
}

/* -------------------------------------------------------------------------- */
/* Header pieces                                                              */
/* -------------------------------------------------------------------------- */
function LanguageMenu() {
  const { lang, setLang } = useTranslation();
  const c = useCopy();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={c.changeLanguage}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'grid size-12 place-items-center rounded-full text-slate-700',
          focusRing,
          trn.press,
          open && 'bg-slate-100'
        )}
      >
        <UiIcon icon={Globe02Icon} size={22} />
      </button>

      <div
        role="listbox"
        aria-label={c.changeLanguage}
        inert={!open}
        className={cn(
          'absolute right-0 top-full z-30 mt-1 w-44 origin-top-right rounded-2xl border border-slate-200 bg-white p-1 shadow-lg',
          trn.pop,
          open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        )}
      >
        {LANGUAGES.map((l) => {
          const selected = lang === l.code;
          return (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={cn(
                'flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-left text-[15px]',
                focusRing,
                trn.tap,
                selected ? 'font-semibold text-blue-600' : 'text-slate-900'
              )}
            >
              {l.label}
              {selected && <UiIcon icon={Tick02Icon} size={18} strokeWidth={2.2} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sections                                                                   */
/* -------------------------------------------------------------------------- */
function AvailabilityCard({ online, onChange }) {
  const c = useCopy();
  const options = [
    { value: false, label: c.optOffline },
    { value: true, label: c.optAvailable },
  ];

  return (
    <Card className={cn('rounded-3xl p-5 transition-colors duration-300', online && 'border-emerald-200')}>
      <div className="flex items-center gap-4">
        <span
          className={cn(
            'grid size-16 shrink-0 place-items-center rounded-full transition-colors duration-300',
            online ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
          )}
        >
          <MorphIcon
            icon={online ? CheckmarkCircle02Icon : Clock01Icon}
            size={32}
            strokeWidth={1.6}
            spring="snappy"
          />
        </span>
        <div className="min-w-0" aria-live="polite">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {online ? c.youAreAvailable : c.youAreOffline}
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
            {online ? (
              <>
                <BrandLogo slug="whatsapp" label="WhatsApp" className="size-4" />
                {c.offersOnWhatsApp}
              </>
            ) : (
              c.goOnline
            )}
          </p>
        </div>
      </div>

      <div
        role="group"
        aria-label={c.availability}
        className="relative mt-5 grid grid-cols-2 rounded-2xl bg-slate-100 p-1"
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-xl shadow-sm transition-[transform,background-color] duration-300 motion-reduce:transition-none',
            SPRING,
            online ? 'translate-x-full bg-emerald-500' : 'translate-x-0 bg-white'
          )}
        />
        {options.map((opt) => {
          const selected = online === opt.value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(opt.value)}
              className={cn(
                'relative z-10 min-h-12 rounded-xl text-[15px] font-semibold transition-colors duration-200',
                focusRing,
                selected ? (opt.value ? 'text-emerald-950' : 'text-slate-900') : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function EarningsSummary() {
  const c = useCopy();
  const stats = [
    { label: c.daysWorked, value: WEEK.days },
    { label: c.jobsDone, value: WEEK.jobs },
    { label: c.clientRating, value: `${WEEK.rating} / 5` },
  ];

  return (
    <section aria-labelledby="earnings-heading" className="px-1">
      <h2 id="earnings-heading" className="text-sm font-medium text-slate-500">
        {c.earnedWeek}
      </h2>
      <p className="mt-1 text-4xl font-bold tracking-tight text-slate-900 tabular-nums">{inr(WEEK.earned)}</p>

      <dl className="mt-4 grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-slate-100 py-3 text-center">
        {stats.map((s) => (
          <div key={s.label} className="px-2">
            <dd className="text-lg font-semibold tracking-tight text-slate-900 tabular-nums">{s.value}</dd>
            <dt className="text-xs text-slate-500">{s.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex min-h-12 items-center gap-3 border-t border-slate-200 pt-4">
        <BrandLogo slug="upi" label="UPI" className="h-7" />
        <p className="min-w-0 flex-1 text-sm text-slate-500">
          {c.paidWeeklyTo} <span className="font-medium text-slate-900">{WORKER.upiId}</span>
        </p>
        <BrandLogo slug="phonepe" label="PhonePe" className="size-7" />
      </div>
    </section>
  );
}

function Detail({ icon, label, children }) {
  return (
    <div className="grid grid-cols-[1.25rem_1fr] gap-3">
      <UiIcon icon={icon} size={20} className="mt-0.5 text-slate-400" />
      <div className="min-w-0">
        <dt className="text-xs text-slate-500">{label}</dt>
        <dd className="text-sm text-slate-900">{children}</dd>
      </div>
    </div>
  );
}

function PayoutRow({ label, value, muted }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className={muted ? 'text-slate-500' : 'font-medium text-slate-900'}>{value}</dd>
    </div>
  );
}

function JobCard({ job, open, onToggle, onComplete }) {
  const c = useCopy();
  const p = payout(job.clientPays);
  const status = STATUS[job.status];
  const panelId = `job-panel-${job.id}`;
  const clientFirstName = job.client.split(' ')[0];
  const mapsUrl = job.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`
    : null;
  const waUrl = job.clientPhone
    ? `https://wa.me/${job.clientPhone}?text=${encodeURIComponent(
        c.waGreeting(clientFirstName, WORKER.firstName, job.title.toLowerCase())
      )}`
    : null;

  return (
    <Card className={cn('overflow-hidden transition-shadow duration-300', open && 'shadow-md ring-1 ring-blue-600/15')}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn('flex min-h-[76px] w-full items-center gap-3 p-4 text-left', focusRing, trn.tap)}
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
          <UiIcon icon={job.icon} size={24} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-semibold tracking-tight text-slate-900">{job.title}</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
            <UiIcon icon={Clock01Icon} size={16} />
            {job.time ?? c.allDay}
          </span>
          <Badge tone={status.tone} className="mt-2">
            {c[status.key]}
          </Badge>
        </span>
        <MorphIcon
          icon={open ? CHEVRON_UP : CHEVRON_DOWN}
          size={24}
          strokeWidth={2}
          spring="snappy"
          className="shrink-0 text-slate-400"
        />
      </button>

      <div
        id={panelId}
        inert={!open}
        className={cn(trn.expand, open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-4 border-t border-slate-100 p-4">
            <dl className="space-y-3">
              {job.address && (
                <Detail icon={Home01Icon} label={c.address}>
                  {job.address}
                </Detail>
              )}
              <Detail icon={UserCheck01Icon} label={c.client}>
                <span className="mr-2 font-medium">{job.client}</span>
                <Badge tone="emerald">
                  <UiIcon icon={Shield01Icon} size={14} strokeWidth={2} />
                  {c.verified}
                </Badge>
              </Detail>
              {job.crew.length > 0 && (
                <Detail icon={UserGroup02Icon} label={c.workingWith}>
                  {job.crew.join(', ')}
                </Detail>
              )}
            </dl>

            {job.notes && <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{job.notes}</p>}

            <div className="rounded-xl bg-slate-50 p-3 text-sm">
              <h3 className="font-semibold tracking-tight text-slate-900">{c.moneyTitle}</h3>
              <dl className="mt-2 space-y-1.5 tabular-nums">
                <PayoutRow label={c.clientPays} value={inr(p.total)} />
                <PayoutRow label={c.welfare} value={`−${inr(p.welfare)}`} muted />
                <PayoutRow label={c.fee} value={`−${inr(p.fee)}`} muted />
                <div className="flex items-center justify-between border-t border-slate-200 pt-2 font-semibold">
                  <dt className="text-slate-900">{c.youEarn}</dt>
                  <dd className="text-emerald-700">{inr(p.worker)}</dd>
                </div>
              </dl>
            </div>

            {job.status === 'PENDING' && (
              <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{c.pendingNote}</p>
            )}

            <div className="space-y-2.5">
              {job.status === 'CONFIRMED' && mapsUrl && (
                <Button as="a" href={mapsUrl} target="_blank" rel="noreferrer">
                  <UiIcon icon={GpsSignal01Icon} size={20} strokeWidth={2} />
                  {c.startNav}
                </Button>
              )}
              {job.status === 'IN_PROGRESS' && (
                <Button type="button" onClick={() => onComplete(job.id)}>
                  <UiIcon icon={Tick02Icon} size={20} strokeWidth={2.2} />
                  {c.markComplete}
                </Button>
              )}
              {waUrl && (
                <Button as="a" href={waUrl} target="_blank" rel="noreferrer" variant="outline">
                  <BrandLogo slug="whatsapp" label="" className="size-5" />
                  {c.messageOn(clientFirstName)}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function JobsSection({ jobs, openId, setOpenId, onComplete }) {
  const c = useCopy();
  const expected = jobs.filter((j) => j.status !== 'PENDING').reduce((sum, j) => sum + payout(j.clientPays).worker, 0);
  const pendingCount = jobs.filter((j) => j.status === 'PENDING').length;

  return (
    <section aria-labelledby="jobs-heading" className="space-y-3">
      <div className="flex items-end justify-between gap-3 px-1">
        <div>
          <h2 id="jobs-heading" className="text-lg font-semibold tracking-tight text-slate-900">
            {c.todaysJobs}
          </h2>
          {pendingCount > 0 && <p className="text-sm text-slate-500">{c.needApproval(pendingCount)}</p>}
        </div>
        <p className="text-right text-sm text-slate-500">
          {c.youllEarn} <span className="font-semibold text-slate-900 tabular-nums">{inr(expected)}</span>
        </p>
      </div>

      {jobs.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="font-semibold tracking-tight text-slate-900">{c.emptyTitle}</p>
          <p className="mt-1 text-sm text-slate-500">{c.emptyBody}</p>
        </Card>
      ) : (
        jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            open={openId === job.id}
            onToggle={() => setOpenId(openId === job.id ? null : job.id)}
            onComplete={onComplete}
          />
        ))
      )}
    </section>
  );
}

const TABS = [
  { id: 'home', labelKey: 'navHome', path: '/worker/dashboard', icon: Home01Icon },
  { id: 'jobs', labelKey: 'navJobsPay', path: '/worker/jobs', icon: Wrench01Icon },
  { id: 'support', labelKey: 'navSupport', path: '/worker/support', icon: Shield01Icon },
  { id: 'account', labelKey: 'navAccount', path: '/worker/account', icon: UserCheck01Icon },
];

function WorkerBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const c = useCopy();

  return (
    <nav
      aria-label={c.navAria}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2">
        {TABS.map((tab) => {
          const active = pathname === tab.path || (tab.id === 'home' && pathname === '/');
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.path)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-14 min-w-16 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl',
                focusRing,
                trn.tab,
                active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <span
                className={cn(
                  'grid h-8 w-14 place-items-center rounded-full transition-colors duration-200',
                  active ? 'bg-blue-50' : 'bg-transparent'
                )}
              >
                <UiIcon icon={tab.icon} size={22} strokeWidth={active ? 2.2 : 1.8} />
              </span>
              <span className={cn('text-xs tracking-tight', active ? 'font-semibold' : 'font-medium')}>
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */
export default function WorkerDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const c = useCopy();
  const { workerOnline, setWorkerOnline } = useAppState();

  const [jobs, setJobs] = useState(DEMO_JOBS);
  const [live, setLive] = useState(false);
  const [openId, setOpenId] = useState(DEMO_JOBS[0].id);
  const [ready, setReady] = useState(false);

  // One entrance for the whole screen. Everything after this responds to a tap.
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Load today's contracts. On any failure, stay on demo data.
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
        const { data, error } = await supabase
          .from('contracts')
          .select('contract_id, client_name, role_needed, status, total_budget, start_date, end_date, site_address')
          .lte('start_date', today);
        // WORKER FILTER: narrow this to the signed-in worker through contract_workers.
        if (error || !data || cancelled) return;

        const todays = data.filter((row) => !row.end_date || row.end_date >= today).map(fromContract);
        setJobs(todays);
        setOpenId(todays[0]?.id ?? null);
        setLive(true);
      } catch (err) {
        console.warn('Supabase jobs query skipped:', err.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? c.greetMorning : h < 17 ? c.greetAfternoon : c.greetEvening;
  }, [c]);

  const completeJob = async (id) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'COMPLETED' } : j)));
    if (!(isSupabaseConfigured && live)) return;
    try {
      const { error } = await supabase.from('contracts').update({ status: 'COMPLETED' }).eq('contract_id', id);
      if (error) console.warn('Job completion not saved:', error.message);
    } catch (err) {
      console.warn('Job completion not saved:', err.message);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50 pb-28 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-slate-50/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center gap-2 px-4 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <UiIcon icon={Building06Icon} size={22} />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">{c.coopLabel}</p>
              <p className="truncate text-sm font-semibold tracking-tight">{WORKER.coop}</p>
            </div>
          </div>
          <LanguageMenu />
          <button
            type="button"
            aria-label={c.openAccount}
            onClick={() => navigate('/worker/account')}
            className={cn('grid size-12 shrink-0 place-items-center rounded-full', focusRing, trn.press)}
          >
            <Avatar initials={WORKER.initials} className="size-10 text-sm" />
          </button>
        </div>
      </header>

      <main
        className={cn(
          'mx-auto max-w-md space-y-6 px-4 pt-5',
          trn.enter,
          ready ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        )}
      >
        <div className="space-y-2 px-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, {WORKER.firstName}
          </h1>
          <Badge tone="emerald">
            <UiIcon icon={Shield01Icon} size={14} strokeWidth={2} />
            {c.verifiedMember}
          </Badge>
        </div>


        <AvailabilityCard online={workerOnline} onChange={setWorkerOnline} />
        <EarningsSummary />
        <JobsSection jobs={jobs} openId={openId} setOpenId={setOpenId} onComplete={completeJob} />
      </main>

      <WorkerBottomNav />
    </div>
  );
}
