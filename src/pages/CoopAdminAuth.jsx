import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useTranslation } from '../lib/i18n/LanguageContext';

export default function CoopAdminAuth() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');

  const submit = (e) => {
    e.preventDefault();
    navigate('/coop-admin/dashboard');
  };

  return (
    <div className="min-h-dvh bg-paper flex items-center justify-center px-6">
      <div className="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md rounded-lg border border-line bg-surface p-8">
        <h1 className="text-2xl font-bold text-ink">{t('coopAdminLoginTitle')}</h1>
        <p className="mt-1 text-[15px] text-muted">{t('coopAdminLoginSubtitle')}</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label={t('coopRegNumber')}>
            <input required className="input" placeholder="LCS-2026-045" />
          </Field>
          <Field label={t('phoneNumber')}>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="input"
              placeholder="98765 43210"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
            />
          </Field>
          <Field label={t('password')}>
            <input required type="password" className="input" placeholder="••••••••" />
          </Field>
          <Button type="submit" variant="indigo" className="w-full">
            {t('logIn')}
          </Button>
        </form>
        <button className="mt-4 text-sm text-muted hover:text-ink">{t('newCoopRegister')}</button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
