export default function ConfidenceBar({ confidence }) {
  const percent = Math.round(confidence * 100);
  const color =
    percent >= 80 ? 'bg-success' :
    percent >= 50 ? 'bg-warning' :
    'bg-danger';

  const textColor =
    percent >= 80 ? 'text-success' :
    percent >= 50 ? 'text-warning' :
    'text-danger';

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-text-secondary">Confidence</span>
        <span className={`text-lg font-bold ${textColor}`}>{percent}%</span>
      </div>
      <div className="w-full h-3 bg-border/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
