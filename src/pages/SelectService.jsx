import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { SelectableCard } from '../components/SelectableCard';
import { CATEGORIES, SERVICES } from '../lib/catalog';
import { useAppState } from '../lib/appState';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { cn } from '../lib/cn';

export default function SelectService() {
  const navigate = useNavigate();
  const { selectedCategory, setSelectedCategory, setSelectedService } = useAppState();
  const { t } = useTranslation();
  const category = selectedCategory || 'household';
  const services = SERVICES[category];

  const choose = (service) => {
    setSelectedService(service);
    navigate('/customer/post-requirement');
  };

  return (
    <PageShell
      title={t('selectServiceTitle')}
      breadcrumb={t(CATEGORIES.find((c) => c.id === category)?.titleKey)}
      back="/customer/category"
    >
      <div className="mb-6 flex gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              category === c.id
                ? 'border-ink bg-ink text-paper'
                : 'border-line text-muted hover:border-ink hover:text-ink'
            )}
          >
            {t(c.titleKey)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {services.map((s) => (
          <SelectableCard
            key={s.id}
            icon={s.icon}
            title={t(s.titleKey)}
            sub={`₹${s.rate}/day`}
            accent={category === 'household' ? 'marigold' : 'indigo'}
            onClick={() => choose(s)}
          />
        ))}
      </div>
    </PageShell>
  );
}
