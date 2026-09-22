import { useState } from 'react';
import { CoopAdminLayout } from '../components/CoopAdminLayout';
import { DemandForecastCard } from '../components/DemandForecastCard';
import { Icon } from '../components/Icon';
import { useAppState } from '../lib/appState';

export default function CoopAdminForecast() {
  const { surgingJobs, setSurgingJobs, selectedCity } = useAppState();
  const [published, setPublished] = useState(false);

  const handlePublishSurge = () => {
    setPublished(true);
    setSurgingJobs([
      {
        id: 'plumber',
        title: 'Plumbing & Pipe Leakage Repair',
        surgeReason: `+128% Pre-Monsoon Surge Demand in ${selectedCity?.name || 'Bengaluru'} Hub`,
        discountPill: 'High Demand',
        rate: 550,
      },
      ...surgingJobs,
    ]);
  };

  return (
    <CoopAdminLayout
      activeNav="demand forecast"
      title="Regional Service Demand Forecasting"
      subtitle="AI-driven predictive demand spikes, weather-triggered surge modeling, and customer banner sync"
    >
      <div className="space-y-6">
        {/* Forecast Overview Card with Publish Tool */}
        <div className="rounded-3xl border border-line bg-paper p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-marigold text-ink">
                  <Icon name="TrendingUp01Icon" size={16} />
                </span>
                <h3 className="font-extrabold text-ink text-base">Trade Demand Trajectory</h3>
              </div>
              <p className="text-xs text-muted font-medium mt-0.5">
                Analyzes 90-day historical ticket velocity, local rainfall data, and festival maintenance cycles
              </p>
            </div>

            <button
              onClick={handlePublishSurge}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold shadow-sm transition-all active:scale-95 ${
                published
                  ? 'bg-success text-white'
                  : 'bg-marigold text-ink hover:bg-marigold-dark'
              }`}
            >
              <Icon name={published ? 'CheckmarkCircle02Icon' : 'FlashIcon'} size={15} />
              <span>{published ? 'Surge Alert Published to App' : 'Publish Surge Alert to Customer App'}</span>
            </button>
          </div>

          <DemandForecastCard />
        </div>

        {/* Predictive Demand Factors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl border border-line bg-paper p-4 space-y-1.5 shadow-xs">
            <span className="font-bold text-ink text-sm flex items-center gap-1.5">
              🌧️ Monsoon Factor (+35%)
            </span>
            <p className="text-muted leading-relaxed">
              Pre-monsoon season in {selectedCity?.name || 'Bengaluru'} historically causes pipe leakages and roof waterproofing requests to double.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-4 space-y-1.5 shadow-xs">
            <span className="font-bold text-ink text-sm flex items-center gap-1.5">
              ⚡ Electrical Grid Load (+22%)
            </span>
            <p className="text-muted leading-relaxed">
              Elevated peak air conditioner usage creates steady surge for circuit breaker and wiring repairs.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-4 space-y-1.5 shadow-xs">
            <span className="font-bold text-ink text-sm flex items-center gap-1.5">
              🛡️ Zero Price-Gouging Rule
            </span>
            <p className="text-muted leading-relaxed">
              Surge demand does NOT increase prices for consumers. Instead, it prioritizes worker mobilization and reserve standby shifts.
            </p>
          </div>
        </div>

        {/* Top Services by Demand (Requested at bottom of Demand Forecast) */}
        <div className="rounded-3xl border border-line bg-paper p-5 md:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-indigo text-white">
                  <Icon name="PieChart01Icon" size={16} />
                </span>
                <h3 className="font-extrabold text-ink text-base">Top Services by Demand Breakdown</h3>
              </div>
              <p className="text-xs text-muted font-medium mt-0.5">
                Distribution of citizen service requests and cooperative workforce allocation across trades
              </p>
            </div>
            <span className="self-start sm:self-auto rounded-xl bg-surface border border-line px-3 py-1 text-xs font-bold text-ink">
              1,248 Monthly Dispatches
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: SVG Donut Chart with Center Stat */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-surface rounded-2xl border border-line">
              <div className="relative size-44 md:size-48 flex items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#E2E8F0"
                    strokeWidth="11"
                  />
                  {/* Plumbing (38%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#3B82F6"
                    strokeWidth="11"
                    strokeDasharray="90.73 238.76"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* Electrical (26%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#F59E0B"
                    strokeWidth="11"
                    strokeDasharray="62.08 238.76"
                    strokeDashoffset="-90.73"
                    strokeLinecap="round"
                  />
                  {/* Painting (18%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="11"
                    strokeDasharray="42.98 238.76"
                    strokeDashoffset="-152.81"
                    strokeLinecap="round"
                  />
                  {/* Cleaning (12%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#8B5CF6"
                    strokeWidth="11"
                    strokeDasharray="28.65 238.76"
                    strokeDashoffset="-195.79"
                    strokeLinecap="round"
                  />
                  {/* Carpentry (6%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#EC4899"
                    strokeWidth="11"
                    strokeDasharray="14.33 238.76"
                    strokeDashoffset="-224.44"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Center Stat */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold text-ink font-mono">1,248</span>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Bookings</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4 text-[11px] font-semibold text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-blue-500" /> Plumbing
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber-500" /> Electrical
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500" /> Painting
                </span>
              </div>
            </div>

            {/* Right: Detailed Service Breakdown List */}
            <div className="lg:col-span-8 space-y-2.5">
              {[
                { name: 'Plumbing & Leakage Repair', pct: 38, jobs: 474, trend: '+24% surge', color: 'bg-blue-500', pill: 'text-blue-700 bg-blue-50 border-blue-200' },
                { name: 'Electrical & AC Maintenance', pct: 26, jobs: 324, trend: '+18% surge', color: 'bg-amber-500', pill: 'text-amber-700 bg-amber-50 border-amber-200' },
                { name: 'Painting & Waterproofing', pct: 18, jobs: 225, trend: '+31% surge', color: 'bg-emerald-500', pill: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                { name: 'Deep Cleaning & Sanitation', pct: 12, jobs: 150, trend: '+9% steady', color: 'bg-violet-500', pill: 'text-violet-700 bg-violet-50 border-violet-200' },
                { name: 'Carpentry & Woodwork', pct: 6, jobs: 75, trend: '+4% steady', color: 'bg-pink-500', pill: 'text-pink-700 bg-pink-50 border-pink-200' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-line bg-surface p-3 transition-all hover:bg-paper shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`size-2.5 rounded-full ${item.color}`} />
                      <span className="font-bold text-ink">{item.name}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${item.pill}`}>
                        {item.trend}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-medium text-muted">{item.jobs} jobs</span>
                      <span className="font-mono font-extrabold text-ink text-xs w-9 text-right">{item.pct}%</span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="h-1.5 w-full bg-line/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CoopAdminLayout>
  );
}
