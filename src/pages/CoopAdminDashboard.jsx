import { CoopAdminLayout } from '../components/CoopAdminLayout';
import { StatCard } from '../components/StatCard';
import { LiveWorkerMap } from '../components/LiveWorkerMap';
import { Icon } from '../components/Icon';
import { useAppState } from '../lib/appState';

export default function CoopAdminDashboard() {
  const { workersList = [] } = useAppState();

  // Exactly 3 AI Insights (compact, required size only, not elongated)
  const aiInsights = [
    {
      title: 'Plumbing Surge (+20% Next Week)',
      desc: 'Prophet AI forecasts 128% pre-monsoon pipe burst surge across East Zone. Mobilize 6 reserve plumbers.',
      tag: 'Demand Spike',
      color: 'border-amber-300 bg-amber-50/70 text-amber-900',
      icon: 'FlashIcon',
      iconBg: 'bg-amber-500 text-white',
    },
    {
      title: 'Workforce Gap in KHB Colony',
      desc: '3 additional certified electricians needed to maintain sub-30m SLA during evening peak hours.',
      tag: 'Crew Deficit',
      color: 'border-blue-300 bg-blue-50/70 text-blue-900',
      icon: 'UserGroup02Icon',
      iconBg: 'bg-blue-600 text-white',
    },
    {
      title: 'Fair Work Allocation Active',
      desc: 'Gini coefficient balanced at 0.12 across active members. No worker idle over 45 minutes.',
      tag: 'Fairness High',
      color: 'border-emerald-300 bg-emerald-50/70 text-emerald-900',
      icon: 'Shield01Icon',
      iconBg: 'bg-emerald-600 text-white',
    },
  ];

  // Recent bookings demo list
  const recentBookings = [
    { id: 'BK-4587', service: 'Plumbing Leakage', client: 'Priya Sharma', worker: 'Manjunath Gowda', status: 'ON_THE_WAY', time: '10:12 AM', amount: '₹550' },
    { id: 'BK-4586', service: 'AC Gas Refill', client: 'Ankit Mehta', worker: 'Ramesh Kumar', status: 'ACTIVE', time: '09:45 AM', amount: '₹1,100' },
    { id: 'BK-4585', service: 'Wiring Repair', client: 'Sunita Rao', worker: 'Suresh Yadav', status: 'COMPLETED', time: '08:30 AM', amount: '₹600' },
    { id: 'BK-4584', service: 'Waterproofing', client: 'Prakruthi RWA', worker: 'Anita Devi', status: 'COMPLETED', time: 'Yesterday', amount: '₹7,590' },
  ];

  // Recent cooperative activity feed
  const recentActivity = [
    { title: 'New Worker Onboarded', time: '12 mins ago', desc: 'Ramesh Kumar passed Aadhaar verification for Painting trade.', icon: 'CheckmarkCircle02Icon', color: 'text-success' },
    { title: 'Surge Alert Triggered', time: '45 mins ago', desc: 'Automatic demand spike alert published for Horamavu Hub.', icon: 'FlashIcon', color: 'text-marigold' },
    { title: 'Escrow Milestone Settled', time: '2 hours ago', desc: '₹1,430 released instantly to Manjunath Gowda after client sign-off.', icon: 'Shield01Icon', color: 'text-indigo' },
  ];

  return (
    <CoopAdminLayout
      activeNav="dashboard"
      title="Cooperative Administration Dashboard"
      subtitle="Cooperative rating, welfare fund balance, live workforce map, and regional demand forecasting"
    >
      {/* 4 Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-line bg-paper p-4 shadow-xs">
          <StatCard label={<span>⭐ Cooperative Rating</span>} value="4.8 ★" accent="indigo" />
        </div>
        <div className="rounded-2xl border border-line bg-paper p-4 shadow-xs">
          <StatCard label={<span>🏦 Welfare Fund (5%)</span>} value="₹5,800" accent="marigold" />
        </div>
        <div className="rounded-2xl border border-line bg-paper p-4 shadow-xs">
          <StatCard label={<span>👷 Active Members</span>} value={workersList.length} />
        </div>
        <div className="rounded-2xl border border-line bg-paper p-4 shadow-xs">
          <StatCard label={<span>📋 Total Bookings</span>} value="1,248" accent="success" />
        </div>
      </div>

      {/* Main Grid: Live Worker Map & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Worker Map with Real Leaflet (2 columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-ink">Live Worker GPS Map</h3>
              <p className="text-xs text-muted font-medium">Real-time worker pins, live availability & hub coverage radius</p>
            </div>
          </div>
          <LiveWorkerMap />
        </div>

        {/* AI Insights Panel (1 column, compact, exactly 3 cards, NOT elongated) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-ink">AI Insights</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo bg-indigo-light px-2 py-0.5 rounded-full">
              3 Signals
            </span>
          </div>

          <div className="space-y-2.5">
            {aiInsights.map((insight, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-3 text-xs space-y-1.5 transition-all shadow-xs ${insight.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-ink">
                    <span className={`flex size-6 items-center justify-center rounded-lg text-xs ${insight.iconBg}`}>
                      <Icon name={insight.icon} size={13} />
                    </span>
                    <span className="text-xs font-bold leading-tight">{insight.title}</span>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-white/80 border border-current">
                    {insight.tag}
                  </span>
                </div>
                <p className="text-[11px] leading-snug font-medium text-slate-700">
                  {insight.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Recent Bookings & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table (2 columns) */}
        <div className="lg:col-span-2 rounded-3xl border border-line bg-paper p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-ink text-sm">Recent Bookings</h3>
            <span className="text-[11px] font-bold text-muted">Latest dispatch queue</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-muted font-semibold text-[11px]">
                  <th className="pb-2.5 font-bold">Booking ID</th>
                  <th className="pb-2.5 font-bold">Service</th>
                  <th className="pb-2.5 font-bold">Client</th>
                  <th className="pb-2.5 font-bold">Worker</th>
                  <th className="pb-2.5 font-bold">Status</th>
                  <th className="pb-2.5 font-bold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 font-medium">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-2.5 font-mono font-bold text-indigo">{b.id}</td>
                    <td className="py-2.5 font-bold text-ink">{b.service}</td>
                    <td className="py-2.5 text-muted">{b.client}</td>
                    <td className="py-2.5 text-ink font-medium">{b.worker}</td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        b.status === 'COMPLETED'
                          ? 'bg-success-light text-success'
                          : b.status === 'ACTIVE'
                          ? 'bg-indigo-light text-indigo'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-2.5 font-bold text-ink">{b.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Timeline (1 column) */}
        <div className="rounded-3xl border border-line bg-paper p-5 shadow-xs space-y-3">
          <h3 className="font-extrabold text-ink text-sm">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs">
                <span className={`mt-0.5 size-2 rounded-full shrink-0 ${act.color === 'text-success' ? 'bg-success' : act.color === 'text-marigold' ? 'bg-marigold' : 'bg-indigo'}`} />
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-ink text-[11px]">{act.title}</span>
                    <span className="text-[10px] text-muted">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-muted leading-tight font-medium">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CoopAdminLayout>
  );
}
