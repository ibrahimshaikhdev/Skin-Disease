import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import PredictionCard from '../components/PredictionCard';
import ProbabilityChart from '../components/ProbabilityChart';
import InsightPanel from '../components/InsightPanel';
import HeatmapViewer from '../components/HeatmapViewer';
import Disclaimer from '../components/Disclaimer';
import { getPrediction } from '../services/predictionService';

export default function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPrediction(id)
      .then(setData)
      .catch((err) => setError(err.response?.data?.error || 'Could not load this prediction.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-16">
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3 mb-6">
          <AlertCircle size={20} className="text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
        <button onClick={() => navigate('/history')} className="text-blue hover:underline">← Back to history</button>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate('/history')}
        className="inline-flex items-center gap-2 text-text-secondary hover:text-text mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to history
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {data.imageUrl && (
            <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
              <img src={data.imageUrl} alt={data.label} className="w-full max-h-80 object-contain rounded-xl" />
            </div>
          )}
          <PredictionCard prediction={data.label} confidence={data.confidence} modelName={data.modelName} />
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <ProbabilityChart probabilities={data.probabilities} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <HeatmapViewer predictionId={data.id} imageUrl={data.imageUrl} />
        <InsightPanel insight={data.insight} />
      </div>

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
