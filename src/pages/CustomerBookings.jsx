import { useState } from 'react';
import { PageShell } from '../components/PageShell';
import { StatusBadge } from '../components/PillBadge';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { DisputeStepper } from '../components/DisputeStepper';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { useAppState } from '../lib/appState';
import { deriveDisputeTier } from '../lib/disputeTiers';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function CustomerBookings() {
  const { t } = useTranslation();
  const { bookings, setBookings } = useAppState();
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [disputeLogged, setDisputeLogged] = useState(null);
  const [issueType, setIssueType] = useState('cash_demand');
  const [approvedId, setApprovedId] = useState(null);
  const [photosBooking, setPhotosBooking] = useState(null);

  // Review Worker State & Handlers (Requested: option to review worker's work after releasing escrow)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [selectedReviewTags, setSelectedReviewTags] = useState(['⏱️ Punctual & On Time', '⭐ High Quality Finish']);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleOpenReview = (booking) => {
    setReviewBooking(booking);
    if (booking.review) {
      setReviewRating(booking.review.rating || 5);
      setReviewComment(booking.review.comment || '');
      setSelectedReviewTags(booking.review.tags || ['⏱️ Punctual & On Time', '⭐ High Quality Finish']);
    } else {
      setReviewRating(5);
      setReviewComment('');
      setSelectedReviewTags(['⏱️ Punctual & On Time', '⭐ High Quality Finish']);
    }
    setReviewSubmitted(false);
    setReviewModalOpen(true);
  };

  const handleToggleReviewTag = (tag) => {
    setSelectedReviewTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = () => {
    if (!reviewBooking) return;
    const reviewData = {
      rating: reviewRating,
      tags: selectedReviewTags,
      comment: reviewComment,
      reviewedAt: new Date().toISOString(),
    };

    setBookings((prev) =>
      prev.map((b) =>
        b.id === reviewBooking.id ? { ...b, review: reviewData } : b
      )
    );

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewModalOpen(false);
      setReviewSubmitted(false);
    }, 1400);
  };

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

    // Immediately prompt review modal for the approved worker
    const target = bookings.find((b) => b.id === bookingId);
    if (target) {
      handleOpenReview({ ...target, approvalStatus: 'APPROVED', status: 'COMPLETED' });
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

              {/* Workers Assigned with National DPI Badges */}
              <div className="mb-3 text-xs space-y-1.5">
                <div className="text-muted">
                  <span className="font-semibold text-ink">{t('assignedWorkers') || 'Workers On Site'}: </span>
                  <span className="font-medium text-ink">{b.assignedWorkers.join(', ')}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    <Icon name="CheckmarkCircle02Icon" size={11} className="text-emerald-600" />
                    e-Shram UAN Verified
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-indigo-light border border-indigo/20 px-2 py-0.5 text-[10px] font-bold text-indigo">
                    Skill India NSQF-4
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-paper border border-line px-2 py-0.5 text-[10px] font-medium text-slate-700">
                    PMSBY ₹2L Insurance Active
                  </span>
                </div>
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

              {/* Customer Review Summary (if reviewed) */}
              {b.review && (
                <div className="mt-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= b.review.rating ? 'text-amber-500 font-bold' : 'text-slate-300'}
                        >
                          ★
                        </span>
                      ))}
                      <span className="font-extrabold text-amber-900 text-xs ml-1">
                        {b.review.rating}.0 / 5.0 Rating Given
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenReview(b)}
                      className="text-[10px] font-bold text-indigo hover:underline"
                    >
                      Edit Review
                    </button>
                  </div>
                  {b.review.tags && b.review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {b.review.tags.map((tg, i) => (
                        <span key={i} className="text-[10px] bg-white border border-amber-200 text-amber-900 rounded-md px-1.5 py-0.5 font-medium">
                          {tg}
                        </span>
                      ))}
                    </div>
                  )}
                  {b.review.comment && (
                    <p className="text-[11px] text-slate-700 italic pt-0.5 font-medium">
                      "{b.review.comment}"
                    </p>
                  )}
                </div>
              )}

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

                {/* JUDGE DEMO: Live Escrow Milestone Approval Button & Review Option */}
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
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs font-bold text-success bg-success-light px-2.5 py-1 rounded-lg">
                      <Icon name="CheckmarkCircle02Icon" size={14} />
                      {t('escrowReleasedSuccess') || 'Escrow Released'}
                    </div>

                    {/* Review Worker Button */}
                    {b.review ? (
                      <button
                        onClick={() => handleOpenReview(b)}
                        className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100/90 border border-amber-300 px-2.5 py-1 rounded-lg hover:bg-amber-200 transition-colors shadow-2xs"
                      >
                        <span className="text-amber-600 font-bold">★</span>
                        <span>{b.review.rating}.0 Reviewed</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenReview(b)}
                        className="flex items-center gap-1 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1 rounded-lg shadow-xs active:scale-95 transition-all"
                      >
                        <span>★</span>
                        <span>Review Worker</span>
                      </button>
                    )}
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

      {/* Review Worker's Work Modal */}
      <Modal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} maxWidth="max-w-md">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 font-bold text-lg shadow-2xs">
              ★
            </span>
            <div>
              <h3 className="text-base font-extrabold text-ink">
                {t('reviewWorkerTitle') || "Review Worker's Work"}
              </h3>
              <p className="text-xs text-muted font-medium">
                {reviewBooking?.serviceName} · {reviewBooking?.assignedWorkers?.[0] || 'Cooperative Crew'}
              </p>
            </div>
          </div>

          {/* Escrow Released Confirmation Note */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs flex items-start gap-2.5 text-emerald-900">
            <Icon name="CheckmarkCircle02Icon" size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Escrow Milestone Released</span>
              <span className="text-[11px] text-emerald-800">
                Milestone payout of ₹{reviewBooking?.workerEarnings || reviewBooking?.totalCost || 550} has been released directly to the worker's cooperative bank account.
              </span>
            </div>
          </div>

          {!reviewSubmitted ? (
            <>
              {/* Star Rating Selector */}
              <div className="space-y-2 text-center py-2 bg-surface rounded-2xl border border-line p-3">
                <span className="text-xs font-bold text-muted uppercase tracking-wider block">
                  Tap to Rate Workmanship
                </span>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || reviewRating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(star)}
                        className="p-1 transition-transform hover:scale-115 active:scale-90 focus:outline-none"
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill={active ? '#F59E0B' : 'none'}
                          stroke={active ? '#F59E0B' : '#CBD5E1'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-amber-600">
                  {reviewRating === 5 && '★★★★★ Exceptional (5/5)'}
                  {reviewRating === 4 && '★★★★☆ Very Good (4/5)'}
                  {reviewRating === 3 && '★★★☆☆ Good / Satisfactory (3/5)'}
                  {reviewRating === 2 && '★★☆☆☆ Needs Improvement (2/5)'}
                  {reviewRating === 1 && '★☆☆☆☆ Unsatisfactory (1/5)'}
                </span>
              </div>

              {/* Quality Badges / Compliment Tags */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-ink block">Quick Feedback Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '⏱️ Punctual & On Time',
                    '🧹 Clean & Tidy',
                    '🤝 Courteous & Polite',
                    '👔 Professional Tools',
                    '⭐ High Quality Finish',
                    '🛡️ Zero Cash Demanded',
                  ].map((tag) => {
                    const selected = selectedReviewTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleToggleReviewTag(tag)}
                        className={`text-xs px-2.5 py-1 rounded-xl border font-medium transition-all ${
                          selected
                            ? 'bg-indigo text-white border-indigo shadow-2xs font-semibold'
                            : 'bg-paper text-muted border-line hover:bg-surface hover:text-ink'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-ink block">Comments / Testimonial</span>
                <textarea
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about the work done, punctuality, or tools..."
                  className="input text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setReviewModalOpen(false)}
                >
                  {t('skip') || 'Later'}
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 !bg-indigo hover:!bg-indigo-dark font-bold text-xs"
                  onClick={handleSubmitReview}
                >
                  Submit Review
                </Button>
              </div>
            </>
          ) : (
            /* Thank You Success Animation / State */
            <div className="py-6 text-center space-y-3">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold">
                ✓
              </div>
              <h4 className="text-base font-extrabold text-ink">Review Submitted!</h4>
              <p className="text-xs text-muted max-w-xs mx-auto">
                Thank you! Your rating will help the cooperative reward top-performing workers with incentive points and fair allocation priority.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </PageShell>
  );
}
