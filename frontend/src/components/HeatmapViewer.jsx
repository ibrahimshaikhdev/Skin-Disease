import { useState } from 'react';
import { Loader2, ScanSearch, AlertCircle } from 'lucide-react';
import { getHeatmap } from '../services/predictionService';

/**
 * Explainable-AI Grad-CAM viewer. Given a stored prediction id, it requests a
 * heatmap overlay from the gateway and displays it alongside the original.
 */
export default function HeatmapViewer({ predictionId, imageUrl }) {
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getHeatmap(predictionId);
      setHeatmap(`data:image/png;base64,${data.heatmap}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not generate heatmap.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
      <div className="flex items-center gap-2 mb-1">
        <ScanSearch size={18} className="text-blue" />
        <h3 className="font-semibold text-text">Explainable AI — Grad-CAM</h3>
      </div>
      <p className="text-sm text-text-secondary mb-4">
        Highlights the image regions that most influenced the model's prediction.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-2">
          <AlertCircle size={16} className="text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {heatmap ? (
        <div className="grid grid-cols-2 gap-4">
          {imageUrl && (
            <div>
              <p className="text-xs text-text-secondary text-center mb-2">Original</p>
              <img src={imageUrl} alt="Original lesion" className="w-full rounded-xl border border-border" />
            </div>
          )}
          <div>
            <p className="text-xs text-text-secondary text-center mb-2">Activation Heatmap</p>
            <img src={heatmap} alt="Grad-CAM heatmap" className="w-full rounded-xl border border-border" />
          </div>
        </div>
      ) : (
        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-3 rounded-xl font-medium text-sm bg-blue/10 text-blue hover:bg-blue/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating heatmap...
            </>
          ) : (
            <>
              <ScanSearch size={16} />
              Generate Heatmap
            </>
          )}
        </button>
      )}
    </div>
  );
}
