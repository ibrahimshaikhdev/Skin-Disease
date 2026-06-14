export default function StatCard({ icon: Icon, label, value, accent = 'blue' }) {
  const accents = {
    blue: 'bg-blue/10 text-blue',
    cyan: 'bg-cyan/10 text-cyan',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  };
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accents[accent]}`}>
          {Icon && <Icon size={22} />}
        </div>
        <div>
          <p className="text-2xl font-bold text-text leading-tight">{value}</p>
          <p className="text-xs text-text-secondary">{label}</p>
        </div>
      </div>
    </div>
  );
}
