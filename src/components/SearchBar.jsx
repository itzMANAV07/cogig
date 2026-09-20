import { Icon } from './Icon';
import { useTranslation } from '../lib/i18n/LanguageContext';

export function SearchBar({ value, onChange, placeholder }) {
  const { t } = useTranslation();

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted">
        <Icon name="Search01Icon" size={18} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder || t('searchPlaceholder') || "Search for 'painter', 'plumber', 'cook'..."}
        className="w-full rounded-2xl border border-line bg-surface py-3 pl-10 pr-4 text-sm font-medium text-ink shadow-sm outline-none transition-all focus:border-marigold focus:bg-white focus:ring-2 focus:ring-marigold/20"
      />
    </div>
  );
}
