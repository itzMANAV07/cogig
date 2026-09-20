import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { cn } from '../lib/cn';
import { useAppState } from '../lib/appState';
import { useTranslation } from '../lib/i18n/LanguageContext';

export default function CustomerAuth() {
  const navigate = useNavigate();
  const { setCustomer } = useAppState();
  const { t } = useTranslation();
  const [mode, setMode] = useState('signup');
  const [form, setForm] = useState({ name: '', phone: '', place: '', type: 'Household' });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setCustomer(form);
    navigate('/customer/otp');
  };

  return (
    <div className="min-h-dvh bg-paper flex items-center justify-center px-6">
      <div className="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md rounded-lg border border-line bg-surface p-8">
        <h1 className="text-2xl font-bold text-ink">{t('welcomeTitle')}</h1>
        <p className="mt-1 text-[15px] text-muted">{t('welcomeSubtitle')}</p>

        <div className="mt-6 flex rounded-lg border border-line p-1">
          {['signup', 'login'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                'flex-1 rounded-md py-2 text-sm font-semibold transition-colors',
                mode === m ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
              )}
            >
              {m === 'signup' ? t('signUp') : t('logIn')}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'signup' && (
            <Field label={t('fullName')}>
              <input
                required
                value={form.name}
                onChange={update('name')}
                className="input"
                placeholder="Anjali Mehta"
              />
            </Field>
          )}
          <Field label={t('phoneNumber')}>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
              className="input"
              placeholder="98765 43210"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
            />
          </Field>
          {mode === 'signup' && (
            <>
              <Field label={t('addressSociety')}>
                <input
                  required
                  value={form.place}
                  onChange={update('place')}
                  className="input"
                  placeholder="Green Valley Society, Patna"
                />
              </Field>
              <Field label={t('youAreA')}>
                <select value={form.type} onChange={update('type')} className="input">
                  <option value="Household">{t('household')}</option>
                  <option value="RWA">{t('rwa')}</option>
                </select>
              </Field>
            </>
          )}
          <Button type="submit" variant="marigold" className="w-full">
            {t('continue')}
          </Button>
        </form>
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
