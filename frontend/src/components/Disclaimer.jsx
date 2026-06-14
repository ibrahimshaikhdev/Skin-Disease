import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="bg-disclaimer-bg border border-disclaimer-border rounded-xl p-4 flex items-start gap-3">
      <AlertTriangle size={20} className="text-warning shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-text">Educational Purpose Only</p>
        <p className="text-xs text-text-secondary mt-1">
          This system is an educational clinical support prototype and is not intended for
          professional medical diagnosis. Always consult a qualified healthcare provider for
          medical concerns.
        </p>
      </div>
    </div>
  );
}
