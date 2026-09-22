import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAppState } from '../lib/appState';
import { DEMO_CITIES } from '../lib/demoData';

const NAV_ITEMS = [
  { name: 'Dashboard', icon: 'Home01Icon', path: '/coop-admin/dashboard' },
  { name: 'Workers', icon: 'UserGroup02Icon', path: '/coop-admin/workers' },
  { name: 'Bookings', icon: 'ShoppingBag01Icon', path: '/coop-admin/bookings' },
  { name: 'Fair Allocation', icon: 'ShieldEnergyIcon', path: '/coop-admin/fairness' },
  { name: 'Demand Forecast', icon: 'TrendingUp01Icon', path: '/coop-admin/forecast' },
  { name: 'Complaints', icon: 'AlertCircleIcon', path: '/coop-admin/tickets' },
];

export function CoopAdminLayout({ children, activeNav, title, subtitle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCity, changeCity } = useAppState();

  const currentPath = location.pathname;

  return (
    <div className="flex h-screen w-full bg-paper overflow-hidden text-ink font-sans">
      {/* Left Persistent Dark Sidebar */}
      <aside className="w-64 bg-slate-900 flex-shrink-0 flex flex-col h-full border-r border-slate-800 z-20">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3 text-white">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo text-white shadow-md shadow-indigo-900/30">
              <Icon name="Building06Icon" size={22} />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white leading-tight">
                CoGig Cooperative
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                Administration Panel
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items (Dashboard, Workers, Bookings, Demand Forecast, Complaints) */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.path || (activeNav && activeNav === item.name.toLowerCase());
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo/20 text-indigo border border-indigo/40 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  className={isActive ? 'text-indigo' : 'text-slate-400'}
                />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Cooperative Jurisdiction & Switch Role Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs space-y-3">
          <div className="rounded-xl bg-slate-800/60 p-2.5 border border-slate-700/50">
            <span className="text-[10px] text-slate-400 block font-semibold">Active Cooperative</span>
            <span className="font-bold text-slate-200 text-[11px] block truncate">
              {selectedCity?.coopName || 'Bengaluru Workers Cooperative'}
            </span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Icon name="ArrowLeft01Icon" size={14} />
            <span>Switch Portal / Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-line bg-paper px-6 flex items-center justify-between gap-4 flex-shrink-0 z-10 shadow-xs">
          {/* Search Bar */}
          <div className="relative w-72 md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Search01Icon" size={16} className="text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search workers, bookings, complaints..."
              className="w-full pl-9 pr-4 py-1.5 bg-surface border border-line rounded-xl text-xs font-medium text-ink placeholder:text-muted focus:outline-none focus:border-indigo transition-colors"
            />
          </div>

          {/* Right actions: City Switcher, LanguageSwitcher, Admin Badge */}
          <div className="flex items-center gap-3">
            {/* National MSCS & NCDC Cooperative Registration Badge */}
            <div className="hidden lg:flex items-center gap-1.5 bg-surface border border-line rounded-xl px-2.5 py-1 text-[11px] font-semibold text-muted">
              <span className="font-bold text-indigo font-mono">MSCS/CR/2026/KA-08</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">NCDC Recognized</span>
            </div>

            {/* Quick Regional Hub Switcher (Davangere only) */}
            <div className="hidden sm:flex items-center gap-1 bg-surface border border-line rounded-xl p-1">
              {DEMO_CITIES.filter((c) => c.id === 'davangere').map((c) => (
                <button
                  key={c.id}
                  onClick={() => changeCity(c)}
                  className="px-3 py-1 rounded-lg text-[11px] font-bold transition-all bg-indigo text-white shadow-xs flex items-center gap-1.5"
                >
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Davangere Hub</span>
                </button>
              ))}
            </div>

            <LanguageSwitcher />

            {/* Admin Avatar Chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-line">
              <div className="flex size-8 items-center justify-center rounded-xl bg-indigo text-white font-bold text-xs shadow-xs">
                CA
              </div>
              <div className="hidden md:block leading-tight text-left">
                <span className="text-xs font-bold text-ink block">Coop Admin</span>
                <span className="text-[10px] text-muted font-medium">LCS Society</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body (Uniform Scrollable Viewport) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {(title || subtitle) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-4">
              <div>
                {title && <h2 className="text-xl font-extrabold tracking-tight text-ink">{title}</h2>}
                {subtitle && <p className="text-xs text-muted font-medium mt-0.5">{subtitle}</p>}
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
