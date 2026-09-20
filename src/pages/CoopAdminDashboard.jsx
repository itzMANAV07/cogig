import { PageShell } from '../components/PageShell';
import { StatCard } from '../components/StatCard';
import { DemandForecastCard } from '../components/DemandForecastCard';
import { Icon } from '../components/Icon';
import { useAppState } from '../lib/appState';
import { DEMO_CITIES } from '../lib/demoData';
import { useState } from 'react';

export default function CoopAdminDashboard() {
  const { surgingJobs, setSurgingJobs, workersList, selectedCity, changeCity } = useAppState();
  const [published, setPublished] = useState(false);

  const currentCoopName = selectedCity?.coopName || 'Bengaluru Workers Labour Cooperative Society';
  const currentJurisdiction = selectedCity?.jurisdiction || 'Bengaluru East & Hennur-Horamavu Hub';

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
    <PageShell
      title="Cooperative Administration"
      subtitle="Cooperative rating, welfare fund balance, and regional demand forecasting"
      wide
      roleNav="coop"
    >
      {/* City Jurisdiction Switcher Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 shadow-md">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Active Cooperative Hub Jurisdiction</span>
          <h3 className="text-base font-extrabold text-ink">{currentCoopName}</h3>
        </div>

        {/* Quick City Hub Switcher */}
        <div className="flex gap-2">
          {DEMO_CITIES.map((c) => (
            <button
              key={c.id}
              onClick={() => changeCity(c)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                selectedCity?.id === c.id
                  ? 'border-indigo bg-indigo text-white shadow-md'
                  : 'border-line bg-paper text-muted hover:text-ink hover:bg-surface hover:shadow-sm'
              }`}
            >
              {c.name.split(',')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="shadow-md rounded-2xl">
          <StatCard label={<span>⭐ Cooperative Rating</span>} value="4.8 ★" accent="indigo" />
        </div>
        <div className="shadow-md rounded-2xl">
          <StatCard label={<span>🏦 Welfare Fund (5%)</span>} value="₹5,800" accent="marigold" />
        </div>
        <div className="shadow-md rounded-2xl">
          <StatCard label={<span>👷 Active Registered Workers</span>} value={workersList.length} />
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {/* Demand Forecasting & Publish Surge Alert Tool */}
        <div className="rounded-3xl border border-line bg-surface p-6 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-ink text-lg">Demand Forecasting & Customer Banner Sync</h3>
              <p className="text-sm text-muted font-medium">Predictive regional demand spikes for {selectedCity?.name || 'Bengaluru'}</p>
            </div>

            <button
              onClick={handlePublishSurge}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-md transition-all active:scale-95 ${
                published ? 'bg-success text-white' : 'bg-marigold text-ink hover:bg-marigold-dark'
              }`}
            >
              <Icon name={published ? 'CheckmarkCircle02Icon' : 'FlashIcon'} size={18} />
              <span>{published ? 'Surge Alert Published' : 'Publish Surge Alert to Customer App'}</span>
            </button>
          </div>

          <DemandForecastCard />
        </div>

        {/* Cooperative Jurisdiction Card */}
        <div className="rounded-3xl border border-line bg-surface p-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo text-paper shadow-inner">
              <Icon name="Building06Icon" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">{currentCoopName}</h3>
              <p className="text-sm text-muted font-medium">
                Multi-State Cooperative Society · Registered Jurisdiction (#LCS-2026-045)
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
            <div className="rounded-2xl border border-line bg-paper p-4 shadow-sm transition-colors hover:bg-surface">
              <span className="text-muted block text-xs uppercase tracking-wider font-semibold mb-1">Coverage Radius</span>
              <span className="font-bold text-ink text-base">8.0 km Service Hub</span>
            </div>
            <div className="rounded-2xl border border-line bg-paper p-4 shadow-sm transition-colors hover:bg-surface">
              <span className="text-muted block text-xs uppercase tracking-wider font-semibold mb-1">Active Jurisdiction</span>
              <span className="font-bold text-ink text-base">{currentJurisdiction}</span>
            </div>
            <div className="rounded-2xl border border-line bg-paper p-4 shadow-sm transition-colors hover:bg-surface">
              <span className="text-muted block text-xs uppercase tracking-wider font-semibold mb-1">Democratic Split</span>
              <span className="font-bold text-success text-base">93% Worker / 5% Welfare / 2% Platform</span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
