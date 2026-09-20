import { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { useTranslation } from '../lib/i18n/LanguageContext';
import { LANGUAGES } from '../lib/i18n/translations';
import { cn } from '../lib/cn';

export function LanguageSwitcher({ className }) {
  const { lang, setLang } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find((l) => l.code === lang);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        className={cn(
          'flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors',
          open
            ? 'border-indigo bg-indigo text-white'
            : 'border-indigo/30 bg-indigo-light text-indigo-dark hover:border-indigo hover:bg-indigo hover:text-white'
        )}
      >
        <Icon name="Globe02Icon" size={16} />
        <span>{current?.label}</span>
        <Icon
          name="ArrowDown01Icon"
          size={14}
          className={cn('transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-36 overflow-hidden rounded-lg border border-line bg-surface shadow-lg">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-ink/5',
                lang === l.code ? 'font-semibold text-marigold-dark' : 'text-ink'
              )}
            >
              {l.label}
              {lang === l.code && <Icon name="Tick02Icon" size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
