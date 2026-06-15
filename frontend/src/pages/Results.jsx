import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import PredictionCard from '../components/PredictionCard';
import ProbabilityChart from '../components/ProbabilityChart';
import InsightPanel from '../components/InsightPanel';
import Disclaimer from '../components/Disclaimer';

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.result) {
    return <Navigate to="/analyze" replace />;
  }

  const { result, imagePreview } = state;
  const prediction = result.prediction || {};

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-text mb-2">Analysis Results</h1>
        <p className="text-text-secondary">{result.model_name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Image + Prediction */}
        <div className="space-y-6">
          {imagePreview && (
            <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
              <img
                src={imagePreview}
                alt="Analyzed skin lesion"
                className="w-full max-h-80 object-contain rounded-xl"
              />
            </div>
          )}

          <PredictionCard
            prediction={prediction.label}
            confidence={prediction.confidence}
            modelName={result.model_name}
          />
        </div>

        {/* Right: Probability Chart */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <ProbabilityChart probabilities={prediction.probabilities} />
        </div>
      </div>

      {/* Disease insights */}
      <div className="mt-8">
        <InsightPanel insight={result.insight} />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          onClick={() => navigate('/analyze')}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue text-white font-medium hover:bg-blue-light transition-colors cursor-pointer"
        >
          <RotateCcw size={16} />
          Analyze Another Image
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface border border-border text-text font-medium hover:bg-border/30 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
