import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, AlertCircle, Cpu, ShieldCheck } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import Disclaimer from '../components/Disclaimer';
import { getModels, predict } from '../services/predictionService';

export default function Analyze() {
  const navigate = useNavigate();

  const [model, setModel] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getModels()
      .then((data) => setModel(data[0]))
      .catch(() => setError('Failed to load the model. Is the backend running?'));
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const result = await predict(model?.id || 1, file);
      navigate('/results', { state: { result, imagePreview: URL.createObjectURL(file) } });
    } catch (err) {
      const msg = err.response?.data?.error || 'Prediction failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-text mb-2">Skin Lesion Analysis</h1>
        <p className="text-text-secondary">
          Upload a dermatological image for AI-powered classification
        </p>
      </div>

      {/* Model info banner */}
      {model && (
        <div className="mb-8 bg-card rounded-2xl border border-border shadow-sm p-5 flex items-center gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue to-cyan flex items-center justify-center text-white shrink-0">
            <Cpu size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-text">{model.name}</h2>
            <p className="text-sm text-text-secondary">{model.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue/10 text-blue">
              {model.num_classes} conditions
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success flex items-center gap-1">
              <ShieldCheck size={12} /> {model.accuracy}
            </span>
          </div>
        </div>
      )}

      {/* Upload */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-blue text-white text-sm font-bold flex items-center justify-center">1</span>
          <h2 className="text-lg font-semibold text-text">Upload Image</h2>
        </div>
        <ImageUploader onFileSelect={setFile} disabled={loading} />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3">
          <AlertCircle size={20} className="text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="w-full py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-blue to-cyan text-white hover:shadow-lg hover:shadow-cyan/25 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            Analyze Image
            <ArrowRight size={18} />
          </>
        )}
      </button>

      <div className="mt-8">
        <Disclaimer />
      </div>
    </div>
  );
}
