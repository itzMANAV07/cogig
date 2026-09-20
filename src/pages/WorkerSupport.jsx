import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { MorphIcon } from 'morphicons/react';
import {
  Building06Icon,
  Home01Icon,
  Briefcase01Icon,
  AlertCircleIcon,
  UserCheck01Icon,
  Shield01Icon,
  Invoice01Icon,
  Tick02Icon,
  Clock01Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '../lib/cn';
import { useAppState } from '../lib/appState';
import { useTranslation } from '../lib/i18n/LanguageContext';

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
  red: 'bg-red-50 text-red-700 ring-red-200',
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

function UiIcon({ icon, size = 20, strokeWidth = 1.8, className }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={strokeWidth} className={className} />;
}

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
    navAria: 'Worker navigation',
    supportTitle: 'Help & Support',
    createTicket: 'Create New Ticket',
    ticketIssueLabel: 'Describe your issue',
    ticketCategoryLabel: 'Category',
    catPayment: 'Payment Issue',
    catSafety: 'Safety Concern',
    catHarassment: 'Harassment',
    catOther: 'Other',
    micListening: 'Listening...',
    micFallback: 'Speech recognition is not available in your browser.',
    submitTicket: 'Submit Ticket',
    waInfo: 'Tickets created via WhatsApp will appear here automatically with your Ticket ID',
    statusOPEN: 'OPEN',
    statusIN_REVIEW: 'IN REVIEW',
    statusRESOLVED: 'RESOLVED',
    resolvedBy: 'Resolved by: ',
    timeAgo: (time) => {
      const ms = Date.now() - new Date(time).getTime();
      const h = Math.floor(ms / 36e5);
      if (h < 1) return 'Just now';
      if (h < 24) return `${h}h ago`;
      return `${Math.floor(h / 24)}d ago`;
    }
  },
  hi: {
    coopLabel: 'आपकी सहकारी संस्था',
    openAccount: 'अपना खाता खोलें',
    navAria: 'श्रमिक नेविगेशन',
    supportTitle: 'सहायता और समर्थन',
    createTicket: 'नई टिकट बनाएँ',
    ticketIssueLabel: 'अपनी समस्या का वर्णन करें',
    ticketCategoryLabel: 'श्रेणी',
    catPayment: 'भुगतान समस्या',
    catSafety: 'सुरक्षा चिंता',
    catHarassment: 'उत्पीड़न',
    catOther: 'अन्य',
    micListening: 'सुन रहा है...',
    micFallback: 'आपके ब्राउज़र में स्पीच रिकग्निशन उपलब्ध नहीं है।',
    submitTicket: 'टिकट जमा करें',
    waInfo: 'WhatsApp के माध्यम से बनाई गई टिकटें आपके टिकट आईडी के साथ यहां स्वतः दिखाई देंगी',
    statusOPEN: 'खुला',
    statusIN_REVIEW: 'समीक्षा में',
    statusRESOLVED: 'हल किया गया',
    resolvedBy: 'द्वारा हल किया गया: ',
    timeAgo: (time) => {
      const ms = Date.now() - new Date(time).getTime();
      const h = Math.floor(ms / 36e5);
      if (h < 1) return 'अभी-अभी';
      if (h < 24) return `${h} घंटे पहले`;
      return `${Math.floor(h / 24)} दिन पहले`;
    }
  },
  kn: {
    coopLabel: 'ನಿಮ್ಮ ಸಹಕಾರಿ ಸಂಸ್ಥೆ',
    openAccount: 'ನಿಮ್ಮ ಖಾತೆ ತೆರೆಯಿರಿ',
    navAria: 'ಕಾರ್ಮಿಕ ನ್ಯಾವಿಗೇಷನ್',
    supportTitle: 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ',
    createTicket: 'ಹೊಸ ಟಿಕೆಟ್ ರಚಿಸಿ',
    ticketIssueLabel: 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ',
    ticketCategoryLabel: 'ವರ್ಗ',
    catPayment: 'ಪಾವತಿ ಸಮಸ್ಯೆ',
    catSafety: 'ಸುರಕ್ಷತಾ ಕಾಳಜಿ',
    catHarassment: 'ಕಿರುಕುಳ',
    catOther: 'ಇತರೆ',
    micListening: 'ಆಲಿಸಲಾಗುತ್ತಿದೆ...',
    micFallback: 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಭಾಷಣ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ.',
    submitTicket: 'ಟಿಕೆಟ್ ಸಲ್ಲಿಸಿ',
    waInfo: 'WhatsApp ಮೂಲಕ ರಚಿಸಲಾದ ಟಿಕೆಟ್‌ಗಳು ನಿಮ್ಮ ಟಿಕೆಟ್ ID ಯೊಂದಿಗೆ ಇಲ್ಲಿ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಗೋಚರಿಸುತ್ತವೆ',
    statusOPEN: 'ಮುಕ್ತವಾಗಿದೆ',
    statusIN_REVIEW: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    statusRESOLVED: 'ಪರಿಹರಿಸಲಾಗಿದೆ',
    resolvedBy: 'ಪರಿಹರಿಸಿದವರು: ',
    timeAgo: (time) => {
      const ms = Date.now() - new Date(time).getTime();
      const h = Math.floor(ms / 36e5);
      if (h < 1) return 'ಈಗ ತಾನೇ';
      if (h < 24) return `${h} ಗಂಟೆಗಳ ಹಿಂದೆ`;
      return `${Math.floor(h / 24)} ದಿನಗಳ ಹಿಂದೆ`;
    }
  },
};

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
};

const CATEGORIES = [
  { id: 'payment', key: 'catPayment', icon: Invoice01Icon, tone: 'blue' },
  { id: 'safety', key: 'catSafety', icon: Shield01Icon, tone: 'emerald' },
  { id: 'harassment', key: 'catHarassment', icon: AlertCircleIcon, tone: 'amber' },
  { id: 'other', key: 'catOther', icon: UserCheck01Icon, tone: 'slate' },
];

const STATUS_TONES = {
  OPEN: 'amber',
  IN_REVIEW: 'blue',
  RESOLVED: 'emerald',
};

/* -------------------------------------------------------------------------- */
/* Bottom Nav                                                                 */
/* -------------------------------------------------------------------------- */
const TABS = [
  { id: 'home', labelKey: 'navHome', path: '/worker/dashboard', icon: Home01Icon },
  { id: 'jobs', labelKey: 'navJobs', path: '/worker/jobs', icon: Briefcase01Icon },
  { id: 'support', labelKey: 'navSupport', path: '/worker/support', icon: AlertCircleIcon },
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
          const active = pathname === tab.path || (tab.id === 'support' && pathname === '/worker/support');
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
                {t(tab.labelKey) || (tab.id === 'jobs' ? 'Jobs' : tab.id === 'support' ? 'Support' : tab.id === 'account' ? 'Account' : 'Home')}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Screen Components                                                          */
/* -------------------------------------------------------------------------- */

function MicIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="1" width="6" height="12" rx="3" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function CreateTicketForm({ onCancel }) {
  const c = useCopy();
  const { lang } = useTranslation();
  const { addWorkerTicket } = useAppState();
  
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('payment');
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setDescription((prev) => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListen = () => {
    if (!recognitionRef.current) {
      setErrorMsg(c.micFallback);
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Set language based on app lang
      const langMap = { en: 'en-IN', hi: 'hi-IN', kn: 'kn-IN' };
      recognitionRef.current.lang = langMap[lang] || 'en-IN';
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setErrorMsg('');
      } catch (e) {
        console.error(e);
        setIsListening(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    addWorkerTicket({
      ticketId: `TKT-W-${Date.now().toString().slice(-6)}`,
      category,
      issue: description.slice(0, 50) + (description.length > 50 ? '...' : ''),
      description,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      resolvedBy: null,
    });
    
    setDescription('');
    setCategory('payment');
    onCancel();
  };

  return (
    <Card className="mb-6 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">{c.ticketCategoryLabel}</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <label
                key={cat.id}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 text-sm font-medium transition-colors',
                  category === cat.id
                    ? `border-${cat.tone}-200 bg-${cat.tone}-50 text-${cat.tone}-700`
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                )}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={category === cat.id}
                  onChange={(e) => setCategory(e.target.value)}
                  className="sr-only"
                />
                <UiIcon icon={cat.icon} size={18} />
                {c[cat.key]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="issue-desc" className="mb-2 block text-sm font-medium text-slate-700">
            {c.ticketIssueLabel}
          </label>
          <div className="relative">
            <textarea
              id="issue-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(
                'w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 pr-14 text-sm text-slate-900',
                focusRing
              )}
              placeholder="Describe what happened..."
            />
            <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1">
              <button
                type="button"
                onClick={toggleListen}
                className={cn(
                  'grid size-10 shrink-0 place-items-center rounded-full text-white shadow-sm transition-all duration-300',
                  isListening ? 'animate-pulse bg-red-500' : 'bg-blue-600 hover:bg-blue-700',
                  focusRing
                )}
              >
                <MicIcon className="size-5" />
              </button>
            </div>
          </div>
          {isListening && <p className="mt-1 text-xs font-medium text-red-500 animate-pulse">{c.micListening}</p>}
          {errorMsg && <p className="mt-1 text-xs font-medium text-red-500">{errorMsg}</p>}
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={!description.trim()} className="flex-1">
            {c.submitTicket}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function TicketCard({ ticket }) {
  const c = useCopy();
  const cat = CATEGORIES.find((c) => c.id === ticket.category) || CATEGORIES[3];
  const statusTone = STATUS_TONES[ticket.status] || 'slate';

  return (
    <Card className="overflow-hidden p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <Badge tone="slate" className="font-mono text-[10px]">
          {ticket.ticketId}
        </Badge>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <UiIcon icon={Clock01Icon} size={14} />
          {c.timeAgo(ticket.createdAt || ticket.created_at)}
        </span>
      </div>
      
      <p className="mb-3 text-sm font-medium text-slate-900">{ticket.issue}</p>
      {ticket.description && ticket.description !== ticket.issue && (
         <p className="mb-3 text-xs text-slate-600 line-clamp-2">{ticket.description}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <Badge tone={cat.tone}>
          <UiIcon icon={cat.icon} size={14} />
          {c[cat.key]}
        </Badge>
        
        <Badge tone={statusTone}>
          {c[`status${ticket.status}`] || ticket.status}
        </Badge>
      </div>
      
      {ticket.status === 'RESOLVED' && ticket.resolvedBy && (
        <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
          {c.resolvedBy} {ticket.resolvedBy}
        </div>
      )}
    </Card>
  );
}

export default function WorkerSupport() {
  const navigate = useNavigate();
  const c = useCopy();
  const { workerTicketsList } = useAppState();
  const [ready, setReady] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="min-h-dvh bg-slate-50 pb-28 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-slate-50/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2 px-4 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <UiIcon icon={Building06Icon} size={22} />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">{c.coopLabel}</p>
              <p className="truncate text-sm font-semibold tracking-tight">{WORKER.coop}</p>
            </div>
          </div>
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
        <div className="flex items-center justify-between px-1">
          <h1 className="text-2xl font-bold tracking-tight">{c.supportTitle}</h1>
        </div>

        {!showForm ? (
          <Button onClick={() => setShowForm(true)} className="w-full">
            <UiIcon icon={AlertCircleIcon} size={20} strokeWidth={2.2} />
            {c.createTicket}
          </Button>
        ) : (
          <CreateTicketForm onCancel={() => setShowForm(false)} />
        )}

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 shadow-sm">
          <div className="flex items-start gap-3">
            <BrandLogo slug="whatsapp" label="WhatsApp" className="mt-0.5 size-5" />
            <p className="text-sm font-medium text-blue-900">{c.waInfo}</p>
          </div>
        </div>

        <section aria-label="Tickets" className="space-y-4">
          {workerTicketsList.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </section>
      </main>

      <WorkerBottomNav />
    </div>
  );
}
