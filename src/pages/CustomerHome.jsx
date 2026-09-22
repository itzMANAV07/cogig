import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopLocationBar } from '../components/TopLocationBar';
import { SearchBar } from '../components/SearchBar';
import { ServiceGrid } from '../components/ServiceGrid';
import { Icon } from '../components/Icon';
import { BottomNavBar } from '../components/BottomNavBar';
import { SERVICES } from '../lib/catalog';
import { useAppState } from '../lib/appState';
import { useTranslation } from '../lib/i18n/LanguageContext';

export default function CustomerHome() {
  const navigate = useNavigate();
  const { customer, setCustomer, setSelectedCategory, setSelectedService, surgingJobs, selectedCity } = useAppState();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [surgeDismissed, setSurgeDismissed] = useState(false);
  const address = customer?.place || selectedCity?.defaultAddress || 'Bengaluru, Karnataka';

  const handleAddressChange = (newAddr) => {
    if (setCustomer) {
      setCustomer((prev) => ({ ...prev, place: newAddr }));
    }
  };

  const handleSelectService = (service, category) => {
    setSelectedCategory(category);
    setSelectedService(service);
    // Direct workflow: Home -> Post Requirement (No category selector intermediate page)
    navigate('/customer/post-requirement');
  };

  // Filter services by search query
  const filterServices = (list) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((s) => {
      const title = (s.titleKey ? t(s.titleKey) : s.id).toLowerCase();
      return title.includes(q) || s.id.includes(q);
    });
  };

  const householdServices = filterServices(SERVICES.household);
  const communityServices = filterServices(SERVICES.community);

  return (
    <div className="min-h-dvh bg-paper pb-24">
      {/* Top Location Header with SOS Button & City Hub Switcher */}
      <TopLocationBar address={address} onAddressChange={handleAddressChange} />

      {/* Main Mobile App Screen */}
      <div className="mx-auto max-w-md space-y-4 px-4 pt-4">
        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Modern, Streamlined High-Demand Surge Alert (Urban Company / Swiggy inspired) */}
        {surgingJobs && surgingJobs.length > 0 && !surgeDismissed && (
          <div className="relative overflow-hidden rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50/20 p-3.5 shadow-2xs transition-all animate-fadeIn">
            {/* Top Micro-Header: Live Status, City, and Close Button */}
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-amber-200/50">
              <div className="flex items-center gap-1.5">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-amber-600" />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                  High Demand Spike
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                  0% Surge Markup
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-muted flex items-center gap-1">
                  <Icon name="Location01Icon" size={11} className="text-amber-600" />
                  <span>{selectedCity?.name?.split(',')[0] || 'Davangere'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSurgeDismissed(true)}
                  className="size-5 rounded-full hover:bg-amber-200/60 flex items-center justify-center text-muted hover:text-ink transition-colors text-xs font-bold leading-none"
                  aria-label="Dismiss banner"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Main Content Row: Trade Icon, Details & Quick Book CTA */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-800 shadow-2xs">
                  <Icon
                    name={
                      surgingJobs[0].id === 'plumber'
                        ? 'DropletIcon'
                        : surgingJobs[0].id === 'electrician'
                        ? 'FlashIcon'
                        : surgingJobs[0].id === 'painter'
                        ? 'PaintBoardIcon'
                        : 'Wrench01Icon'
                    }
                    size={20}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-ink leading-tight truncate">
                    {surgingJobs[0].title}
                  </h3>
                  <p className="text-[11px] text-muted font-medium mt-0.5 truncate max-w-[200px] sm:max-w-xs">
                    {surgingJobs[0].surgeReason}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[11px]">
                    <span className="font-mono font-extrabold text-ink">
                      ₹{surgingJobs[0].rate || 550}/day
                    </span>
                    <span className="text-[10px] font-semibold text-indigo">
                      · Govt Wage Protected
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  const foundSvc = SERVICES.community.find((s) => s.id === surgingJobs[0].id) || SERVICES.community[1];
                  handleSelectService(foundSvc, 'community');
                }}
                className="shrink-0 flex items-center gap-1 rounded-xl bg-ink hover:bg-slate-800 active:scale-95 text-paper px-3 py-2 text-xs font-bold shadow-xs transition-all"
              >
                <span>Book</span>
                <Icon name="ArrowLeft01Icon" size={12} className="rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Household Services Section */}
        {householdServices.length > 0 && (
          <div className="space-y-2 pt-1">
            <h2 className="text-sm font-bold text-ink">
              {t('householdServices') || 'Household Services'}
            </h2>
            <ServiceGrid
              services={householdServices}
              onSelectService={(s) => handleSelectService(s, 'household')}
              accent="marigold"
            />
          </div>
        )}

        {/* Community / RWA Maintenance Section */}
        {communityServices.length > 0 && (
          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-ink">
              {t('communityServices') || 'Community & Society Maintenance'}
            </h2>
            <ServiceGrid
              services={communityServices}
              onSelectService={(s) => handleSelectService(s, 'community')}
              accent="indigo"
            />
          </div>
        )}

        {householdServices.length === 0 && communityServices.length === 0 && (
          <div className="py-8 text-center text-muted">
            <Icon name="Search01Icon" size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold">{t('noServicesFound') || 'No matching services found'}</p>
          </div>
        )}
      </div>

      {/* Urban Company-style Bottom Navigation */}
      <BottomNavBar role="customer" />
    </div>
  );
}
