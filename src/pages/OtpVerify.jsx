import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useAppState } from '../lib/appState';
import { useTranslation } from '../lib/i18n/LanguageContext';

export default function OtpVerify() {
  const navigate = useNavigate();
  const { customer } = useAppState();
  const { t } = useTranslation();
  const [digits, setDigits] = useState(Array(6).fill(''));
  const refs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const submit = (e) => {
    e.preventDefault();
    navigate('/customer/home');
  };

  return (
    <div className="min-h-dvh bg-paper flex items-center justify-center px-6">
      <div className="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md rounded-lg border border-line bg-surface p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-ink">{t('verifyTitle')}</h1>
        <p className="mt-1 text-[15px] text-muted">
          {t('verifySubtitle')} +91 {customer?.phone || '98765 43210'}
        </p>

        <form onSubmit={submit}>
          <div className="mt-6 flex justify-center gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (refs.current[i] = el)}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                maxLength={1}
                inputMode="numeric"
                className="input h-14 w-11 text-center text-xl font-semibold"
              />
            ))}
          </div>
          <Button type="submit" variant="marigold" className="mt-6 w-full">
            {t('verifyContinue')}
          </Button>
        </form>
        <button className="mt-4 text-sm text-muted hover:text-ink">{t('resendCode')}</button>
      </div>
    </div>
  );
}
