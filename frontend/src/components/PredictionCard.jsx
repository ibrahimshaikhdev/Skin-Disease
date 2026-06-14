import { CheckCircle, ExternalLink } from 'lucide-react';
import ConfidenceBar from './ConfidenceBar';

export default function PredictionCard({ prediction, confidence, modelName }) {
  const percent = Math.round(confidence * 100);
  const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(prediction)}`;

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
      {/* Success banner */}
      <div className="bg-gradient-to-r from-navy to-navy-light p-6 text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-success/20 flex items-center justify-center">
          <CheckCircle size={28} className="text-success" />
        </div>
        <h2 className="text-white text-xl font-semibold">Analysis Complete</h2>
        <p className="text-cyan-pale text-sm mt-1">{modelName}</p>
      </div>

      {/* Prediction result */}
      <div className="p-6">
        <div className="text-center mb-6">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
            Predicted Condition
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-blue">{prediction}</p>
        </div>

        <ConfidenceBar confidence={confidence} />

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={wikiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue/10 text-blue font-medium text-sm hover:bg-blue/20 transition-colors no-underline"
          >
            <ExternalLink size={16} />
            Learn more about {prediction}
          </a>
        </div>
      </div>
    </div>
  );
}
