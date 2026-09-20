import { useNavigate } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { SelectableCard } from '../components/SelectableCard';
import { CATEGORIES } from '../lib/catalog';
import { useAppState } from '../lib/appState';
import { useTranslation } from '../lib/i18n/LanguageContext';

export default function SelectCategory() {
  const navigate = useNavigate();
  const { setSelectedCategory } = useAppState();
  const { t } = useTranslation();

  const choose = (id) => {
    setSelectedCategory(id);
    navigate('/customer/services');
  };

  return (
    <PageShell title={t('categoryTitle')} subtitle={t('categorySubtitle')}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CATEGORIES.map((c) => (
          <SelectableCard
            key={c.id}
            icon={c.icon}
            title={t(c.titleKey)}
            description={t(c.descKey)}
            accent={c.accent}
            onClick={() => choose(c.id)}
          />
        ))}
      </div>
    </PageShell>
  );
}
