import { useState } from 'react';
import { PageShell } from '../components/PageShell';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { DisputeStepper } from '../components/DisputeStepper';
import { useAppState } from '../lib/appState';
import { deriveDisputeTier } from '../lib/disputeTiers';

export default function CustomerSupport() {
  const { addTicket } = useAppState();
  const [modalOpen, setModalOpen] = useState(false);
  const [issueCategory, setIssueCategory] = useState('cash_demand');
  const [details, setDetails] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ticket = {
      message: issueCategory === 'cash_demand' ? `Cash payment demanded: ${details}` : `Service issue: ${details}`,
      status: 'OPEN',
      category: issueCategory,
      created_at: new Date().toISOString(),
    };
    setSubmittedTicket(ticket);
    addTicket(ticket);
  };

  return (
    <PageShell
      title="Help & Dispute Support"
      subtitle="Report cash demand violations, service quality issues, or access FAQs"
      roleNav="customer"
    >
      <div className="space-y-4">
        {/* Quick Report Cash Demand Card */}
        <div className="rounded-2xl border border-danger/40 bg-danger-light/30 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger text-white">
              <Icon name="Alert02Icon" size={20} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-ink">Did a Worker Demand Cash?</h3>
              <p className="mt-0.5 text-xs text-muted font-medium">
                Demanding cash outside escrow violates platform & cooperative rules. Report it immediately to lock Tier-3 escalation.
              </p>
              <button
                onClick={() => {
                  setIssueCategory('cash_demand');
                  setSubmittedTicket(null);
                  setModalOpen(true);
                }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-danger px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-danger/90 transition-transform active:scale-95"
              >
                <span>Report Cash Demand</span>
                <Icon name="ArrowLeft01Icon" size={14} className="rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* FAQs and Support Categories */}
        <div className="rounded-2xl border border-line bg-surface p-4 space-y-3">
          <h3 className="text-sm font-bold text-ink">Frequently Asked Questions</h3>

          <div className="space-y-2 text-xs">
            <details className="rounded-xl bg-paper p-3 font-medium text-ink cursor-pointer">
              <summary className="font-bold text-indigo">How does the 100% Escrow system work?</summary>
              <p className="mt-2 text-muted leading-relaxed">
                When you book a service, your payment is safely locked in escrow. Money is only transferred to the worker and cooperative welfare fund after you inspect the work and click "Approve".
              </p>
            </details>

            <details className="rounded-xl bg-paper p-3 font-medium text-ink cursor-pointer">
              <summary className="font-bold text-indigo">What is the 5% Democratic Welfare Fund?</summary>
              <p className="mt-2 text-muted leading-relaxed">
                5% of every labor fare automatically goes into the worker cooperative's democratically managed welfare fund, providing health insurance, emergency loans, and pension benefits for workers.
              </p>
            </details>

            <details className="rounded-xl bg-paper p-3 font-medium text-ink cursor-pointer">
              <summary className="font-bold text-indigo">What if the worker asks for extra money for spare parts?</summary>
              <p className="mt-2 text-muted leading-relaxed">
                Workers can add spare parts directly inside the active job app screen. Spare parts are 100% pass-through reimbursement with 0% platform fee. Never pay raw cash.
              </p>
            </details>
          </div>
        </div>

        {/* General Support Button */}
        <button
          onClick={() => {
            setIssueCategory('quality_issue');
            setSubmittedTicket(null);
            setModalOpen(true);
          }}
          className="w-full rounded-2xl border border-line bg-surface py-3 text-xs font-bold text-ink hover:bg-paper transition-colors"
        >
          Need Help With Another Issue? Contact Support
        </button>
      </div>

      {/* File Dispute Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="max-w-md">
        {!submittedTicket ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-danger-light text-danger">
                <Icon name="Alert02Icon" size={20} />
              </span>
              <h3 className="text-base font-bold text-ink">File Customer Support Ticket</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Issue Category</label>
              <select
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value)}
                className="input text-xs font-semibold"
              >
                <option value="cash_demand">Worker Demanded Cash Payment Outside Escrow</option>
                <option value="quality_issue">Poor Workmanship / Quality Issue</option>
                <option value="delay">Worker Arrived Late / Absent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Describe What Happened</label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="input text-xs"
                placeholder="Provide details about the incident or booking ID..."
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1 !bg-danger hover:!bg-danger/90">
                Submit Dispute Ticket
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl border border-danger/40 bg-danger-light/50 p-3 text-xs">
              <p className="font-bold text-danger">Dispute Ticket Logged & Escalated!</p>
              <p className="mt-1 text-muted">
                Your ticket has been logged with the Cooperative Admin. Escrow funds will remain safely held until resolution.
              </p>
            </div>

            <DisputeStepper currentTier={deriveDisputeTier(submittedTicket)} />

            <Button variant="primary" className="w-full mt-2" onClick={() => setModalOpen(false)}>
              Done
            </Button>
          </div>
        )}
      </Modal>
    </PageShell>
  );
}
