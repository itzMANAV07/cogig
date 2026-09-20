import { useState } from 'react';
import { PageShell } from '../components/PageShell';
import { Block } from '../components/Block';
import { DataTable } from '../components/DataTable';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { useAppState } from '../lib/appState';

export default function CoopAdminWorkers() {
  const { workersList, addWorker } = useAppState();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    adhaar: '',
    skill: '',
    yearsExperience: '3',
    rate: '500',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.adhaar) return;
    addWorker({
      ...form,
      yearsExperience: Number(form.yearsExperience) || 3,
      rate: Number(form.rate) || 500,
    });
    setModalOpen(false);
    setForm({ name: '', phone: '', adhaar: '', skill: '', yearsExperience: '3', rate: '500' });
  };

  return (
    <PageShell
      title="Worker Roster & Verification"
      subtitle="Registered cooperative members, Aadhaar identity verification, and onboarding"
      wide
      roleNav="coop"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-ink">Active Workforce ({workersList.length})</h3>
            <p className="text-xs text-muted font-medium">All members are 100% Aadhaar verified with skill tags</p>
          </div>

          <Button variant="marigold" onClick={() => setModalOpen(true)} className="text-xs font-bold px-3 py-2">
            <Icon name="Add01Icon" size={16} />
            Onboard New Worker
          </Button>
        </div>

        {/* Workers Roster Table */}
        <Block title="Registered Workers">
          <DataTable
            columns={[
              {
                key: 'name',
                label: 'Worker Name',
                render: (r) => (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink">{r.name}</span>
                    {r.verified && (
                      <span className="rounded-full bg-success-light px-2 py-0.5 text-[10px] font-bold text-success flex items-center gap-0.5">
                        <Icon name="CheckmarkCircle02Icon" size={12} />
                        Aadhaar Verified
                      </span>
                    )}
                  </div>
                ),
              },
              {
                key: 'preferredLanguage',
                label: 'Language',
                render: (r) => {
                  const langMap = { en: '🌐 English', hi: '🇮🇳 Hindi', kn: 'ಕ Kannada' };
                  const bgMap = { en: 'bg-slate-100 text-slate-700', hi: 'bg-amber-50 text-amber-800', kn: 'bg-indigo-light text-indigo' };
                  return (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${bgMap[r.preferredLanguage] || bgMap.en}`}>
                      {langMap[r.preferredLanguage] || langMap.en}
                    </span>
                  );
                },
              },
              { key: 'phone', label: 'Phone Number' },
              { key: 'adhaar', label: 'Aadhaar ID' },
              { key: 'skill', label: 'Skills & Trade' },
              {
                key: 'yearsExperience',
                label: 'Experience',
                render: (r) => `${r.yearsExperience || 3} Years`,
              },
              { key: 'rate', label: 'Daily Rate', render: (r) => `₹${r.rate}/day` },
            ]}
            rows={workersList}
          />
        </Block>
      </div>

      {/* Add Worker Modal Form */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-indigo text-white">
              <Icon name="UserGroup02Icon" size={20} />
            </span>
            <div>
              <h3 className="text-base font-bold text-ink">Onboard New Worker</h3>
              <p className="text-xs text-muted">Register member to cooperative roster</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-ink mb-1">Full Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Vikram Singh"
                className="input text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-ink mb-1">Phone Number</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="98765 43210"
                  className="input text-xs"
                  inputMode="numeric"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink mb-1">Aadhaar Card No.</label>
                <input
                  required
                  value={form.adhaar}
                  onChange={(e) => setForm({ ...form, adhaar: e.target.value })}
                  placeholder="XXXX-XXXX-1234"
                  className="input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-ink mb-1">Trade Skills (Comma-separated)</label>
              <input
                required
                value={form.skill}
                onChange={(e) => setForm({ ...form, skill: e.target.value })}
                placeholder="e.g. Plumber, Electrician, Technician"
                className="input text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-ink mb-1">Years of Experience</label>
                <input
                  type="number"
                  required
                  value={form.yearsExperience}
                  onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
                  placeholder="5"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink mb-1">Coop Fixed Daily Rate (₹)</label>
                <input
                  type="number"
                  required
                  value={form.rate}
                  onChange={(e) => setForm({ ...form, rate: e.target.value })}
                  placeholder="550"
                  className="input text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="marigold" className="flex-1 font-bold">
              Save & Verify Worker
            </Button>
          </div>
        </form>
      </Modal>
    </PageShell>
  );
}
