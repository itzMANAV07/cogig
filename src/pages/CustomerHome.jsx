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

        {/* Dynamic Surging Jobs Banner (Derived from Cooperative Admin Demand Forecast & City Hub) */}
        {surgingJobs && surgingJobs.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-marigold-dark via-marigold to-marigold p-4 text-ink shadow-sm">
            {/* Background Illustration */}
            <div className="absolute -right-2 -top-4 bottom-0 w-1/3 flex items-center justify-end pr-2 opacity-90 pointer-events-none">
               <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent mix-blend-overlay blur-md"></div>
               <div className="text-5xl drop-shadow-md">🌧️⚡</div>
            </div>

            <div className="relative z-10 pr-12">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-extrabold text-paper uppercase tracking-wider">
                  <Icon name="FlashIcon" size={12} className="text-marigold" />
                  Coop Demand Surge
                </span>
                <span className="text-[11px] font-bold text-ink/80 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">{selectedCity?.name || 'Bengaluru Region'}</span>
              </div>

              <div className="mt-2.5 space-y-1">
                <h3 className="text-base font-extrabold leading-tight text-ink">
                  🔥 {surgingJobs[0].title}
                </h3>
                <p className="text-xs text-ink/90 font-semibold">
                  {surgingJobs[0].surgeReason}
                </p>
              </div>

              <button
                onClick={() => {
                  const foundSvc = SERVICES.community.find((s) => s.id === surgingJobs[0].id) || SERVICES.community[1];
                  handleSelectService(foundSvc, 'community');
                }}
                className="mt-3 flex items-center gap-1.5 rounded-xl bg-ink px-3.5 py-2 text-xs font-bold text-paper shadow-sm hover:bg-ink/90 transition-transform active:scale-95"
              >
                <span>Book Surging Crew Now</span>
                <Icon name="ArrowLeft01Icon" size={14} className="rotate-180" />
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
