import { useState } from 'react';
import { PageShell } from '../components/PageShell';
import { Icon } from '../components/Icon';
import { PillBadge } from '../components/PillBadge';
import { deriveDisputeTier, tierTone, tierKey } from '../lib/disputeTiers';
import { useAppState } from '../lib/appState';
import { useTranslation } from '../lib/i18n/LanguageContext';

export default function CoopAdminTickets() {
  const { t } = useTranslation();
  const { ticketsList, updateTicketStatus } = useAppState();
  const [activeTab, setActiveTab] = useState('worker');
  const [notes, setNotes] = useState({});
  const [actionNotice, setActionNotice] = useState(null);

  const filteredTickets = (ticketsList || []).filter((ticket) => {
    if (activeTab === 'worker') {
      return ticket.reporterType === 'worker';
    }
    return ticket.reporterType === 'customer' || !ticket.reporterType;
  });

  const getLangBadge = (lang) => {
    switch (lang) {
      case 'hi':
        return <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">🇮🇳 Hindi</span>;
      case 'kn':
        return <span className="rounded-full bg-indigo-light text-indigo-dark px-2 py-0.5 text-[10px] font-bold">ಕ Kannada</span>;
      default:
        return <span className="rounded-full bg-slate-200 text-slate-800 px-2 py-0.5 text-[10px] font-bold">🌐 English</span>;
    }
  };

  const getViolationBadge = (type) => {
    switch (type) {
      case 'cash_demand':
        return <span className="rounded-md bg-danger-light text-danger border border-danger/20 px-2 py-1 text-xs font-bold">⚠️ Cash Demand Violation</span>;
      case 'payment_dispute':
        return <span className="rounded-md bg-amber-100 text-amber-800 border border-amber-200 px-2 py-1 text-xs font-bold">💰 Payment Dispute</span>;
      case 'quality_complaint':
        return <span className="rounded-md bg-blue-100 text-blue-800 border border-blue-200 px-2 py-1 text-xs font-bold">🔧 Quality Complaint</span>;
      case 'safety_hazard':
        return <span className="rounded-md bg-orange-100 text-orange-800 border border-orange-200 px-2 py-1 text-xs font-bold">🦺 Safety Hazard</span>;
      case 'attendance_issue':
        return <span className="rounded-md bg-slate-100 text-slate-800 border border-slate-200 px-2 py-1 text-xs font-bold">⏰ Attendance Issue</span>;
      case 'harassment':
        return <span className="rounded-md bg-danger-light text-danger border border-danger/20 px-2 py-1 text-xs font-bold">🚨 Harassment Report</span>;
      default:
        return null;
    }
  };

  const handleStatusChange = (ticketKey, newStatus) => {
    const note = notes[ticketKey] || '';
    if (updateTicketStatus) {
      updateTicketStatus(ticketKey, newStatus, note);
    }
    setActionNotice({
      ticketKey,
      status: newStatus,
      message: newStatus === 'RESOLVED' ? 'Ticket marked as Resolved!' : 'Ticket updated to In Review.',
    });
    setTimeout(() => {
      setActionNotice(null);
    }, 3500);
  };

  return (
    <PageShell
      title="Dispute & Safety Tickets"
      subtitle="Review member complaints, voice messages, AI summaries, and issue resolution actions"
      wide
      roleNav="coop"
    >
      {/* Tab Switcher */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex w-full max-w-sm rounded-2xl bg-surface p-1 border border-line shadow-sm">
          <button
            onClick={() => setActiveTab('worker')}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
              activeTab === 'worker' ? 'bg-indigo text-white shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            Worker Tickets ({ticketsList.filter((t) => t.reporterType === 'worker').length})
          </button>
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
              activeTab === 'customer' ? 'bg-indigo text-white shadow-sm' : 'text-muted hover:text-ink'
            }`}
          >
            Customer Tickets ({ticketsList.filter((t) => t.reporterType !== 'worker').length})
          </button>
        </div>

        {actionNotice && (
          <div className="flex items-center gap-2 rounded-xl bg-success-light px-3.5 py-1.5 text-xs font-bold text-success animate-fade-in border border-success/30">
            <Icon name="CheckmarkCircle02Icon" size={16} />
            <span>{actionNotice.message}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface p-8 text-center text-muted shadow-sm">
            <Icon name="CheckmarkCircle02Icon" size={32} className="mx-auto mb-2 text-success opacity-80" />
            <p className="font-bold text-ink text-sm">All clear!</p>
            <p className="text-xs text-muted">No {activeTab} tickets recorded or awaiting action.</p>
          </div>
        ) : (
          filteredTickets.map((ticket, idx) => {
            const tier = deriveDisputeTier(ticket);
            const ticketKey = ticket.ticketId || ticket.id || `TKT-${activeTab === 'worker' ? 'W' : 'C'}-${idx}`;
            const currentStatus = ticket.status || 'OPEN';
            const isResolved = currentStatus === 'RESOLVED';
            const isInReview = currentStatus === 'IN_REVIEW';

            return (
              <div
                key={ticketKey}
                className="rounded-2xl border border-line bg-surface p-5 shadow-sm space-y-4 transition-all hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-paper border border-line px-2 py-0.5 text-[11px] font-extrabold text-muted tracking-wide font-mono">
                        {ticketKey}
                      </span>
                      {getViolationBadge(ticket.aiViolationType || ticket.category)}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-ink text-sm">
                        {ticket.reporterName || ticket.worker || 'Member Party'}
                      </span>
                      {getLangBadge(ticket.preferredLanguage || 'hi')}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <PillBadge tone={isResolved ? 'success' : isInReview ? 'indigo' : 'warn'}>
                      {currentStatus.replace('_', ' ')}
                    </PillBadge>
                    <PillBadge tone={tierTone[tier]}>{t(tierKey[tier]) || tier}</PillBadge>
                  </div>
                </div>

                {/* Original Message / Voice Indicator */}
                <div className="rounded-xl border border-line bg-paper p-4 space-y-3">
                  <div className="flex gap-3">
                    {ticket.hasVoiceMessage && (
                      <div className="flex shrink-0 items-center justify-center size-8 rounded-full bg-indigo-light text-indigo">
                        <Icon name="Microphone01Icon" size={16} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {ticket.hasVoiceMessage && (
                        <div className="mb-2 flex items-center gap-1.5 h-3">
                          <span className="text-[10px] font-bold text-indigo uppercase tracking-wider mr-1">Voice Audio:</span>
                          <div className="w-1 h-2 bg-indigo/40 rounded-full animate-pulse" />
                          <div className="w-1 h-3.5 bg-indigo/70 rounded-full animate-pulse delay-75" />
                          <div className="w-1 h-4 bg-indigo rounded-full animate-pulse delay-150" />
                          <div className="w-1 h-2.5 bg-indigo/70 rounded-full animate-pulse delay-200" />
                          <div className="w-1 h-3 bg-indigo/50 rounded-full animate-pulse delay-100" />
                          <div className="w-1 h-1.5 bg-indigo/30 rounded-full" />
                        </div>
                      )}
                      <p className="text-sm italic text-muted font-serif">
                        "{ticket.originalMessage || ticket.issue || ticket.description}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Translated Summary */}
                {(ticket.aiSummary || ticket.issue) && (
                  <div className="rounded-xl bg-indigo-light/30 border border-indigo-light/60 p-4 flex gap-3">
                    <div className="text-indigo shrink-0 mt-0.5">
                      <Icon name="SparklesIcon" size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-indigo-dark mb-1 flex items-center gap-1.5">
                        <span>AI Translated & Clarified Summary</span>
                        <span className="text-[9px] font-semibold text-indigo/80 bg-white/70 px-1.5 py-0.5 rounded">
                          Simplified Language
                        </span>
                      </h4>
                      <p className="text-sm text-ink font-medium leading-relaxed">
                        {ticket.aiSummary || ticket.issue}
                      </p>
                    </div>
                  </div>
                )}

                {/* Administrative Action Section */}
                <div className="pt-2 border-t border-line space-y-3">
                  {ticket.adminNote && (
                    <div className="rounded-xl bg-paper border border-line p-3 text-xs">
                      <span className="font-bold text-muted text-[10px] uppercase block mb-1">
                        Recorded Administrative Note:
                      </span>
                      <p className="font-semibold text-ink">{ticket.adminNote}</p>
                    </div>
                  )}

                  {!isResolved ? (
                    <>
                      <textarea
                        className="w-full rounded-xl border border-line bg-paper p-3 text-xs font-medium text-ink focus:border-indigo focus:ring-1 focus:ring-indigo resize-none outline-none"
                        placeholder="Type an administrative response, cooperative review notes, or resolution decision..."
                        rows={2}
                        value={notes[ticketKey] !== undefined ? notes[ticketKey] : (ticket.adminNote || '')}
                        onChange={(e) => setNotes({ ...notes, [ticketKey]: e.target.value })}
                      />
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <span className="text-[11px] font-medium text-muted">
                          {isInReview ? '⚡ Under active review by Cooperative Society' : 'Awaiting cooperative society action'}
                        </span>
                        <div className="flex items-center gap-2">
                          {!isInReview && (
                            <button
                              type="button"
                              onClick={() => handleStatusChange(ticketKey, 'IN_REVIEW')}
                              className="rounded-xl border border-line bg-surface px-4 py-2 text-xs font-bold text-ink hover:bg-paper hover:border-indigo transition-all active:scale-95 shadow-sm"
                            >
                              Mark In Review
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(ticketKey, 'RESOLVED')}
                            className="rounded-xl bg-success px-4 py-2 text-xs font-bold text-white hover:bg-success/90 transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                          >
                            <Icon name="CheckmarkCircle02Icon" size={14} />
                            <span>Resolve Ticket</span>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-success-light/40 border border-success/30 p-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-success">
                        <Icon name="CheckmarkCircle02Icon" size={16} />
                        <span>Ticket Resolved by Cooperative Administration</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(ticketKey, 'OPEN')}
                        className="text-xs text-muted font-semibold hover:text-ink hover:underline"
                      >
                        Re-open Ticket
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </PageShell>
  );
}
