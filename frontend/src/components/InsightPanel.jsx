import { Info, Stethoscope, AlertOctagon, ShieldCheck, Eye } from 'lucide-react';

const SEVERITY = {
  high: { label: 'High Concern', cls: 'bg-danger/10 text-danger border-danger/20' },
  moderate: { label: 'Moderate', cls: 'bg-warning/10 text-warning border-warning/20' },
  low: { label: 'Low Concern', cls: 'bg-success/10 text-success border-success/20' },
  none: { label: 'No Concern', cls: 'bg-success/10 text-success border-success/20' },
};

function Section({ icon: Icon, title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className="text-blue" />
        <h4 className="text-sm font-semibold text-text">{title}</h4>
      </div>
      <ul className="space-y-1.5 pl-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-text-secondary flex gap-2">
            <span className="text-cyan mt-1 shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function InsightPanel({ insight }) {
  if (!insight) return null;
  const sev = SEVERITY[insight.severity] || SEVERITY.moderate;

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-navy to-navy-light px-6 py-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-white text-lg font-semibold">{insight.name}</h3>
          <span className={`text-xs font-medium px-3 py-1 rounded-full border ${sev.cls} bg-white`}>
            {sev.label}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Info size={16} className="text-blue" />
            <h4 className="text-sm font-semibold text-text">Overview</h4>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{insight.overview}</p>
        </div>

        <Section icon={Stethoscope} title="Common Symptoms" items={insight.symptoms} />
        <Section icon={AlertOctagon} title="Risk Indicators" items={insight.risk_indicators} />
        <Section icon={ShieldCheck} title="Precautions" items={insight.precautions} />

        {insight.awareness && (
          <div className="flex items-start gap-2 bg-surface rounded-xl p-4">
            <Eye size={16} className="text-cyan shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary italic">{insight.awareness}</p>
          </div>
        )}
      </div>
    </div>
  );
}
