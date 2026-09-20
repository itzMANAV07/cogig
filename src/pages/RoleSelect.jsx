import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { SelectableCard } from '../components/SelectableCard';
import { Icon } from '../components/Icon';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useTranslation } from '../lib/i18n/LanguageContext';

export default function RoleSelect() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh bg-paper flex items-center justify-center px-6">
      <div className="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-2xl text-center"
      >
        <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-lg bg-ink text-paper">
          <Icon name="UserGroup02Icon" size={26} />
        </div>
        <h1 className="text-4xl font-bold text-ink">{t('brand')}</h1>
        <p className="mt-3 text-lg text-muted">{t('tagline')}</p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectableCard
            icon="Home01Icon"
            title={t('imCustomer')}
            description={t('imCustomerDesc')}
            accent="marigold"
            onClick={() => navigate('/customer/login')}
          />
          <SelectableCard
            icon="Building06Icon"
            title={t('imCoopAdmin')}
            description={t('imCoopAdminDesc')}
            accent="indigo"
            onClick={() => navigate('/coop-admin/login')}
          />
        </div>

        <p className="mt-10 text-sm text-muted">{t('workerNote')}</p>
      </motion.div>
    </div>
  );
}
