import { CheckCircle, Zap, Layers } from 'lucide-react';

const modelIcons = [Zap, CheckCircle, Layers];

export default function ModelSelector({ models, selected, onSelect }) {
  if (!models || models.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {models.map((model, idx) => {
        const Icon = modelIcons[idx] || Zap;
        const isSelected = selected === model.id;

        return (
          <button
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={`relative p-5 rounded-xl border-2 text-left transition-all cursor-pointer ${
              isSelected
                ? 'border-cyan bg-cyan/5 shadow-lg shadow-cyan/10'
                : 'border-border bg-card hover:border-blue/30 hover:shadow-md'
            }`}
          >
            {isSelected && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-cyan rounded-full flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              isSelected ? 'bg-cyan text-white' : 'bg-blue/10 text-blue'
            }`}>
              <Icon size={20} />
            </div>

            <h3 className="font-semibold text-text text-base mb-1">{model.name}</h3>
            <p className="text-text-secondary text-sm mb-3">{model.description}</p>

            <div className="flex items-center gap-3">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue/10 text-blue">
                {model.num_classes} conditions
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success">
                {model.accuracy} accuracy
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
