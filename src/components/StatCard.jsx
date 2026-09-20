export function StatCard({ label, value, accent = 'ink' }) {
  const accentClass = { ink: 'text-ink', marigold: 'text-marigold-dark', indigo: 'text-indigo' }[
    accent
  ];
  return (
    <div className="flex-1 rounded-lg border border-line bg-surface px-6 py-5">
      <div className="text-sm text-muted">{label}</div>
      <div className={`mt-2 text-3xl font-bold tabular ${accentClass}`}>{value}</div>
    </div>
  );
}
