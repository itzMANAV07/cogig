import { useState } from 'react';
import { CoopAdminLayout } from '../components/CoopAdminLayout';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { useAppState } from '../lib/appState';

export default function CoopAdminBookings() {
  const { bookings, updateTicketStatus } = useAppState();
  const [filter, setFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return b.status === 'ACTIVE';
    if (filter === 'PENDING') return b.approvalStatus === 'PENDING_APPROVAL';
    if (filter === 'COMPLETED') return b.status === 'COMPLETED';
    return true;
  });

  const totalEscrowValue = bookings.reduce((sum, b) => sum + (b.totalCost || 0), 0);
  const activeCount = bookings.filter((b) => b.status === 'ACTIVE').length;
  const pendingCount = bookings.filter((b) => b.approvalStatus === 'PENDING_APPROVAL').length;

  return (
    <CoopAdminLayout
      activeNav="bookings"
      title="Cooperative Bookings & Escrow Dispatch"
      subtitle="Monitor live client requests, worker assignments, and escrow settlements"
    >
      {/* KPI Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-line bg-paper p-4 shadow-xs">
          <span className="text-xs text-muted font-semibold block">Total Bookings</span>
          <span className="text-xl font-extrabold text-ink tabular">{bookings.length}</span>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-4 shadow-xs">
          <span className="text-xs text-muted font-semibold block">Active Dispatch Crews</span>
          <span className="text-xl font-extrabold text-indigo tabular">{activeCount}</span>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-4 shadow-xs">
          <span className="text-xs text-muted font-semibold block">Pending Client Approval</span>
          <span className="text-xl font-extrabold text-marigold tabular">{pendingCount}</span>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-4 shadow-xs">
          <span className="text-xs text-muted font-semibold block">Total Escrow Volume</span>
          <span className="text-xl font-extrabold text-success tabular">₹{totalEscrowValue.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Bookings Card & Filter Tabs */}
      <div className="rounded-3xl border border-line bg-paper p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-ink">Bookings Ledger</h3>
            <p className="text-xs text-muted font-medium">Real-time requests received across households & societies</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 bg-surface border border-line p-1 rounded-xl">
            {['ALL', 'ACTIVE', 'PENDING', 'COMPLETED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filter === f
                    ? 'bg-indigo text-white shadow-xs'
                    : 'text-muted hover:text-ink hover:bg-paper'
                }`}
              >
                {f === 'ALL' ? 'All Bookings' : f === 'ACTIVE' ? 'Active' : f === 'PENDING' ? 'Pending Approval' : 'Completed'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-muted font-semibold text-[11px]">
                <th className="pb-3 font-bold">Booking ID</th>
                <th className="pb-3 font-bold">Service & Category</th>
                <th className="pb-3 font-bold">Assigned Worker</th>
                <th className="pb-3 font-bold">Site Address</th>
                <th className="pb-3 font-bold">Total Escrow</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 font-medium">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted font-semibold">
                    No bookings found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 font-mono font-bold text-indigo">{b.id}</td>
                    <td className="py-3">
                      <span className="font-bold text-ink block">{b.serviceName}</span>
                      <span className="text-[10px] text-muted">{b.category || 'Household'}</span>
                    </td>
                    <td className="py-3">
                      <span className="font-bold text-ink block">
                        {Array.isArray(b.assignedWorkers) ? b.assignedWorkers[0] : (b.assignedWorkers || 'Unassigned')}
                      </span>
                      {b.workersCount > 1 && (
                        <span className="text-[10px] text-muted">+{b.workersCount - 1} more worker</span>
                      )}
                    </td>
                    <td className="py-3 max-w-[180px] truncate text-muted" title={b.siteAddress}>
                      {b.siteAddress}
                    </td>
                    <td className="py-3">
                      <span className="font-mono font-bold text-ink">₹{b.totalCost}</span>
                      <span className="text-[10px] text-muted block">93% Worker Split</span>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        b.status === 'COMPLETED'
                          ? 'bg-success-light text-success'
                          : b.status === 'ACTIVE'
                          ? 'bg-indigo-light text-indigo'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="rounded-lg border border-line bg-paper px-2.5 py-1 text-xs font-bold text-indigo hover:bg-surface transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Inspection Modal */}
      {selectedBooking && (
        <Modal open={true} onClose={() => setSelectedBooking(null)} maxWidth="max-w-lg">
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <span className="font-mono text-indigo font-bold">{selectedBooking.id}</span>
                <h3 className="text-base font-extrabold text-ink">{selectedBooking.serviceName}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                selectedBooking.status === 'COMPLETED' ? 'bg-success-light text-success' : 'bg-indigo-light text-indigo'
              }`}>
                {selectedBooking.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-surface p-3 rounded-2xl border border-line">
              <div>
                <span className="text-muted text-[10px] block font-semibold">Assigned Crew</span>
                <span className="font-bold text-ink text-xs">
                  {Array.isArray(selectedBooking.assignedWorkers)
                    ? selectedBooking.assignedWorkers.join(', ')
                    : selectedBooking.assignedWorkers}
                </span>
              </div>
              <div>
                <span className="text-muted text-[10px] block font-semibold">Location / Society</span>
                <span className="font-bold text-ink text-xs truncate block">{selectedBooking.siteAddress}</span>
              </div>
            </div>

            {/* Escrow Financial Split */}
            <div className="rounded-2xl border border-line bg-paper p-3.5 space-y-2">
              <span className="text-[11px] font-bold text-ink block">Cooperative Escrow Distribution</span>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-success-light/40 p-2 rounded-xl">
                  <span className="text-[10px] text-muted block">Worker (93%)</span>
                  <span className="font-bold text-success text-sm">₹{selectedBooking.workerEarnings}</span>
                </div>
                <div className="bg-amber-50 p-2 rounded-xl">
                  <span className="text-[10px] text-muted block">Welfare (5%)</span>
                  <span className="font-bold text-amber-800 text-sm">₹{selectedBooking.welfareFund}</span>
                </div>
                <div className="bg-indigo-light/40 p-2 rounded-xl">
                  <span className="text-[10px] text-muted block">Platform (2%)</span>
                  <span className="font-bold text-indigo text-sm">₹{selectedBooking.platformFee}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl bg-ink px-4 py-2 text-paper text-xs font-bold hover:bg-ink/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </CoopAdminLayout>
  );
}
