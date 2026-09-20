import { Icon } from './Icon';
import { useTranslation } from '../lib/i18n/LanguageContext';

export function ServiceGrid({ services = [], onSelectService, accent = 'indigo' }) {
  const { t } = useTranslation();

  const isMarigold = accent === 'marigold';
  const iconBg = isMarigold ? 'bg-marigold-light' : 'bg-indigo-light';
  const iconText = isMarigold ? 'text-marigold-dark' : 'text-indigo';

  return (
    <div className="grid grid-cols-3 gap-3">
      {services.map((service) => {
        const title = service.titleKey ? t(service.titleKey) : service.title;
        const rateLabel = `₹${service.rate}/day`;

        return (
          <button
            key={service.id}
            onClick={() => onSelectService && onSelectService(service)}
            className="group flex flex-col items-center text-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:shadow-md active:scale-95"
          >
            {/* Colored Circle Icon Area */}
            <div className={`mb-2 flex size-11 items-center justify-center rounded-full ${iconBg} ${iconText} transition-colors group-hover:brightness-95`}>
              <Icon name={service.icon || 'HouseIcon'} size={24} />
            </div>

            {/* Title Label */}
            <span className="line-clamp-2 text-xs font-semibold text-ink">
              {title}
            </span>

            {/* Daily Rate Pill */}
            <div className="mt-2 rounded-full bg-success-light px-2 py-0.5 text-[10px] font-bold text-success">
              {rateLabel}
            </div>
          </button>
        );
      })}
    </div>
  );
}
