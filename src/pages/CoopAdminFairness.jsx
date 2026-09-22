import { useState } from 'react';
import { CoopAdminLayout } from '../components/CoopAdminLayout';
import { Icon } from '../components/Icon';
import { useAppState } from '../lib/appState';

export default function CoopAdminFairness() {
  const { workersList, selectedCity } = useAppState();
  const [filterTrade, setFilterTrade] = useState('ALL');

  // Filtered workers list
  const filteredWorkers = (workersList || []).filter((w) => {
    if (filterTrade === 'ALL') return true;
    return w.skill?.toLowerCase().includes(filterTrade.toLowerCase());
  });

  return (
    <CoopAdminLayout
      activeNav="fair allocation"
      title="Ethical AI: Fair Work Allocation & Social Equity"
      subtitle="Multi-objective dispatch algorithm, Gini income equality monitor, and democratic anti-deplatforming safeguards"
    >
      <div className="space-y-6">
        {/* Top Metric Cards: Gini Coefficient & Fairness KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-line bg-paper p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-muted font-semibold">
              <span>Gini Equality Coefficient</span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                Low Disparity
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-ink font-mono">0.12</span>
              <span className="text-xs text-emerald-600 font-bold">✓ Highly Fair</span>
            </div>
            <p className="mt-1 text-[11px] text-muted leading-tight">
              Gini &lt; 0.20 confirms balanced income distribution across all active members.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-muted font-semibold">
              <span>Max Idle Waiting Time</span>
              <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold">
                Sub-30m SLA
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-indigo font-mono">22 mins</span>
              <span className="text-xs text-muted font-medium">max wait</span>
            </div>
            <p className="mt-1 text-[11px] text-muted leading-tight">
              Watchdog automatically elevates priority for workers idle &gt; 30 minutes.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-muted font-semibold">
              <span>Income Parity Index</span>
              <span className="rounded-full bg-indigo-light text-indigo px-2 py-0.5 text-[10px] font-bold">
                Target: &gt;90%
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-ink font-mono">94.8%</span>
              <span className="text-xs text-indigo font-bold">↑ 4.2% MoM</span>
            </div>
            <p className="mt-1 text-[11px] text-muted leading-tight">
              Ratio of lowest 20% to highest 20% member monthly gig earnings.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs text-muted font-semibold">
              <span>Patronage Dividend Pool</span>
              <span className="rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold">
                ICA Principle 3
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-marigold-dark font-mono">₹18,400</span>
              <span className="text-xs text-muted font-medium">audited surplus</span>
            </div>
            <p className="mt-1 text-[11px] text-muted leading-tight">
              2% platform surplus refundable to workers at Annual General Meeting (AGM).
            </p>
          </div>
        </div>

        {/* Core Algorithm & Mathematical Optimization Card */}
        <div className="rounded-3xl border border-line bg-paper p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-indigo text-white">
                  <Icon name="ShieldEnergyIcon" size={16} />
                </span>
                <h3 className="font-extrabold text-ink text-base">
                  CoGig Fair Work Allocation Engine (FWA-AI)
                </h3>
              </div>
              <p className="text-xs text-muted font-medium mt-0.5">
                Multi-objective rule engine & reinforcement learning alternative to black-box platform exploitation
              </p>
            </div>
            <span className="self-start sm:self-auto rounded-full bg-indigo-light text-indigo border border-indigo/30 px-3 py-1 text-xs font-bold font-mono">
              Algorithm: Rule-Engine + Gini Optimizer
            </span>
          </div>

          {/* Mathematical Formula Display */}
          <div className="rounded-2xl bg-surface border border-line p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink uppercase tracking-wider">
                Dynamic Fairness Objective Function
              </span>
              <span className="text-[11px] text-muted font-medium">Calibrated for {selectedCity?.name?.split(',')[0] || 'Davangere'} Hub</span>
            </div>

            <div className="rounded-xl bg-slate-900 text-white p-3 font-mono text-xs overflow-x-auto">
              <code>
                Fairness_Score = (0.30 × Wait_Time) + (0.25 × Income_Parity_Delta) + (0.20 × Skill_Match) + (0.15 × Distance_Inv) + (0.10 × Job_Count_Inv)
              </code>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs pt-1">
              <div className="rounded-xl bg-paper border border-line p-2.5">
                <span className="text-[10px] font-bold text-muted uppercase block">Wait Time (30%)</span>
                <span className="text-xs font-bold text-ink">Max Waiting Bonus</span>
                <p className="text-[10px] text-muted mt-0.5">Prevents idle workers from being starved of income</p>
              </div>
              <div className="rounded-xl bg-paper border border-line p-2.5">
                <span className="text-[10px] font-bold text-muted uppercase block">Income Parity (25%)</span>
                <span className="text-xs font-bold text-ink">Gini Balancer</span>
                <p className="text-[10px] text-muted mt-0.5">Prioritizes members below monthly target earnings</p>
              </div>
              <div className="rounded-xl bg-paper border border-line p-2.5">
                <span className="text-[10px] font-bold text-muted uppercase block">Skill Match (20%)</span>
                <span className="text-xs font-bold text-ink">NSQF-4 Validation</span>
                <p className="text-[10px] text-muted mt-0.5">Ensures verified skill compliance for customer safety</p>
              </div>
              <div className="rounded-xl bg-paper border border-line p-2.5">
                <span className="text-[10px] font-bold text-muted uppercase block">Proximity (15%)</span>
                <span className="text-xs font-bold text-ink">Sub-30m SLA</span>
                <p className="text-[10px] text-muted mt-0.5">Minimizes worker commute and fuel costs</p>
              </div>
              <div className="rounded-xl bg-paper border border-line p-2.5">
                <span className="text-[10px] font-bold text-muted uppercase block">Job Count (10%)</span>
                <span className="text-xs font-bold text-ink">Equal Opportunity</span>
                <p className="text-[10px] text-muted mt-0.5">Counters algorithmic favoritism and star-rating bias</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Dispatch Fairness Queue & Member Parity Table */}
        <div className="rounded-3xl border border-line bg-paper p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-3">
            <div>
              <h3 className="font-extrabold text-ink text-base">Live Member Dispatch Fairness Queue</h3>
              <p className="text-xs text-muted font-medium">Real-time fair work queue balancing member earnings and waiting times</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-surface border border-line rounded-xl p-1 text-xs">
              {['ALL', 'Painter', 'Plumber', 'Supervisor'].map((trade) => (
                <button
                  key={trade}
                  onClick={() => setFilterTrade(trade)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    filterTrade === trade ? 'bg-indigo text-white shadow-xs' : 'text-muted hover:text-ink'
                  }`}
                >
                  {trade}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-muted font-semibold text-[11px]">
                  <th className="pb-2.5 font-bold">Member & Trade</th>
                  <th className="pb-2.5 font-bold">DPI Verification</th>
                  <th className="pb-2.5 font-bold">Monthly Jobs</th>
                  <th className="pb-2.5 font-bold">Monthly Earnings</th>
                  <th className="pb-2.5 font-bold">Current Idle Time</th>
                  <th className="pb-2.5 font-bold">Fairness Priority</th>
                  <th className="pb-2.5 font-bold">Patronage Dividend</th>
                  <th className="pb-2.5 font-bold">Queue Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 font-medium">
                {filteredWorkers.map((w, idx) => (
                  <tr key={w.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-indigo text-white font-bold text-[11px]">
                          {w.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-bold text-ink block">{w.name}</span>
                          <span className="text-[10px] text-muted">{w.skill}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                          e-Shram: {w.eShramUan || '2847-XXXX-4821'}
                        </span>
                        <span className="block text-[10px] text-indigo font-semibold">
                          {w.nsqfLevel || 'NSQF-4 (PMKVY)'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 font-mono font-bold text-ink">{w.jobsMonth || 42 + idx * 2} jobs</td>
                    <td className="py-3 font-mono font-bold text-ink">₹{(w.monthlyIncome || 22000 + idx * 1500).toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        (w.idleTimeMin || 15) > 20
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        ⏱️ {w.idleTimeMin || 12} mins
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-line rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo rounded-full"
                            style={{ width: `${w.fairnessScore || 92}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-xs text-indigo">{w.fairnessScore || 94.2}</span>
                      </div>
                    </td>
                    <td className="py-3 font-mono font-bold text-emerald-700">
                      ₹{(w.patronageDividend || 4000).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        idx === 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : idx === 1
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {idx === 0 ? '⚡ Next in Queue' : idx === 1 ? '🔨 On Job' : 'Standby'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cooperative Safeguards Grid: Anti-Deplatforming & Patronage Refund Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Anti-Deplatforming Safeguard */}
          <div className="rounded-3xl border border-line bg-paper p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-ink">
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <Icon name="Shield01Icon" size={15} />
              </span>
              <h4 className="text-sm font-bold">Democratic Anti-Deplatforming Guarantee</h4>
            </div>
            <p className="text-muted leading-relaxed font-medium">
              Unlike venture-backed gig apps where algorithms arbitrarily ban workers without human recourse, CoGig strictly forbids automated de-platforming. Under Cooperative By-laws, account suspensions require review by a 3-member elected Cooperative Disciplinary Committee.
            </p>
            <div className="pt-2 flex items-center gap-3 text-[11px] font-semibold text-emerald-700">
              <span>✓ Right to Fair Hearing</span>
              <span>✓ Peer Worker Representation</span>
              <span>✓ Appeal to General Body</span>
            </div>
          </div>

          {/* Patronage Dividend / Surplus Refund Guarantee */}
          <div className="rounded-3xl border border-line bg-paper p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-ink">
              <span className="flex size-7 items-center justify-center rounded-lg bg-marigold text-ink">
                <Icon name="Target01Icon" size={15} />
              </span>
              <h4 className="text-sm font-bold">Cooperative Patronage Dividend (सहकारी लाभांश)</h4>
            </div>
            <p className="text-muted leading-relaxed font-medium">
              CoGig adheres to International Cooperative Alliance (ICA) Principle 3: Member Economic Participation. The 2% platform fee covers only direct server costs. Annual audited operating surplus is refunded to worker-owners as a year-end bonus proportional to completed jobs.
            </p>
            <div className="pt-2 flex items-center gap-3 text-[11px] font-semibold text-amber-800">
              <span>✓ 0% Private VC Extraction</span>
              <span>✓ 100% Surplus to Members</span>
              <span>✓ Transparent AGM Audit</span>
            </div>
          </div>
        </div>
      </div>
    </CoopAdminLayout>
  );
}
