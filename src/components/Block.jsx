export function Block({ title, action, children }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}
