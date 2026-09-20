import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Icon } from './Icon';
import { LanguageSwitcher } from './LanguageSwitcher';
import { BottomNavBar } from './BottomNavBar';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { cn } from '../lib/cn';

const DASHBOARD_LINKS = [
  { path: '/rwa/dashboard', key: 'navRwa' },
  { path: '/coop-admin/dashboard', key: 'navCoopAdmin' },
  { path: '/worker/dashboard', key: 'navWorker' },
];

export function PageShell({
  title,
  subtitle,
  breadcrumb,
  back,
  children,
  wide = false,
  hasBottomBar = false,
  hideHeader = false,
  roleNav = null, // 'customer' | 'worker' | 'coop'
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh bg-paper pb-20">
      {!hideHeader && (
        <header className="border-b border-line px-4 py-4 sm:px-10">
          <div className={wide ? 'mx-auto max-w-6xl' : 'mx-auto max-w-xl'}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {back && (
                  <button
                    onClick={() => navigate(back)}
                    aria-label="Go back"
                    className="flex size-9 items-center justify-center rounded-lg border border-line text-ink hover:bg-ink/5"
                  >
                    <Icon name="ArrowLeft01Icon" size={18} />
                  </button>
                )}
                <div>
                  {breadcrumb && (
                    <div className="text-xs font-semibold text-marigold-dark">{breadcrumb}</div>
                  )}
                  {title && <h1 className="text-xl font-bold text-ink sm:text-2xl">{title}</h1>}
                  {subtitle && <p className="mt-0.5 text-xs text-muted sm:text-sm">{subtitle}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {wide && (
                  <div className="hidden sm:flex gap-1 rounded-lg border border-line p-1 text-sm">
                    {DASHBOARD_LINKS.map((d) => (
                      <button
                        key={d.path}
                        onClick={() => navigate(d.path)}
                        className={
                          location.pathname === d.path
                            ? 'rounded-md bg-ink px-3 py-1.5 font-semibold text-paper'
                            : 'rounded-md px-3 py-1.5 text-muted hover:text-ink'
                        }
                      >
                        {t(d.key)}
                      </button>
                    ))}
                  </div>
                )}
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </header>
      )}

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={cn(
          wide ? 'mx-auto max-w-6xl px-4 py-6 sm:px-10' : 'mx-auto max-w-xl px-4 py-6 sm:px-10',
          hasBottomBar && 'pb-28'
        )}
      >
        {children}
      </motion.main>

      {roleNav && <BottomNavBar role={roleNav} />}
    </div>
  );
}
