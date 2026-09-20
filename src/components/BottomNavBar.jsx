import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import { cn } from '../lib/cn';
import { useTranslation } from '../lib/i18n/LanguageContext';

const ROLE_TABS = {
  customer: [
    { id: 'home', path: '/customer/home', icon: 'Home01Icon', labelKey: 'navHome', defaultLabel: 'Home' },
    { id: 'bookings', path: '/customer/bookings', icon: 'ShoppingBag01Icon', labelKey: 'navBookings', defaultLabel: 'Bookings', hasDot: true },
    { id: 'support', path: '/customer/support', icon: 'AlertCircleIcon', labelKey: 'navSupport', defaultLabel: 'Help & Support' },
    { id: 'account', path: '/customer/account', icon: 'User01Icon', labelKey: 'navAccount', defaultLabel: 'Account' },
  ],
  worker: [
    { id: 'home', path: '/worker/dashboard', icon: 'Home01Icon', labelKey: 'navHome', defaultLabel: 'Home' },
    { id: 'jobs', path: '/worker/jobs', icon: 'Briefcase01Icon', labelKey: 'navJobsPay', defaultLabel: 'Jobs & Pay' },
    { id: 'support', path: '/worker/support', icon: 'AlertCircleIcon', labelKey: 'navSupport', defaultLabel: 'Support', hasDot: true },
    { id: 'account', path: '/worker/account', icon: 'User01Icon', labelKey: 'navAccount', defaultLabel: 'Account' },
  ],
  coop: [
    { id: 'home', path: '/coop-admin/dashboard', icon: 'Home01Icon', labelKey: 'navHome', defaultLabel: 'Home' },
    { id: 'workers', path: '/coop-admin/workers', icon: 'UserGroup02Icon', labelKey: 'navWorkers', defaultLabel: 'Workers' },
    { id: 'tickets', path: '/coop-admin/tickets', icon: 'AlertCircleIcon', labelKey: 'navTickets', defaultLabel: 'Tickets', hasDot: true },
    { id: 'account', path: '/coop-admin/account', icon: 'User01Icon', labelKey: 'navAccount', defaultLabel: 'Account' },
  ],
};

export function BottomNavBar({ role = 'customer' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const tabs = ROLE_TABS[role] || ROLE_TABS.customer;

  return createPortal(
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-surface/95 px-2 py-2 backdrop-blur-md pb-safe shadow-lg">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="flex flex-1 flex-col items-center justify-center py-0.5 transition-all active:scale-95"
            >
              <div className="relative">
                {/* Active UC-style dark square badge behind icon */}
                <div
                  className={cn(
                    'flex size-9 items-center justify-center rounded-xl transition-all',
                    isActive ? 'bg-ink text-paper shadow-md scale-105' : 'text-muted hover:text-ink'
                  )}
                >
                  <Icon name={tab.icon} size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>

                {/* Optional notification dot */}
                {tab.hasDot && !isActive && (
                  <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-surface bg-danger animate-pulse" />
                )}
              </div>

              <span
                className={cn(
                  'mt-1 text-[10px] font-semibold tracking-tight transition-colors text-center truncate max-w-[80px]',
                  isActive ? 'text-ink font-extrabold' : 'text-muted'
                )}
              >
                {t(tab.labelKey) || tab.defaultLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  );
}
