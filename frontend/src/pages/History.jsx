import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, ImageOff, ArrowRight, History as HistoryIcon } from 'lucide-react';
import { getHistory } from '../services/predictionService';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function confColor(c) {
  const p = c * 100;
  return p >= 80 ? 'text-success' : p >= 50 ? 'text-warning' : 'text-danger';
}

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getHistory()
      .then(setItems)
      .catch((err) => setError(err.response?.data?.error || 'Failed to load history.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue" />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Prediction History</h1>
          <p className="text-text-secondary">{items.length} saved {items.length === 1 ? 'analysis' : 'analyses'}</p>
        </div>
        <Link to="/analyze" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue to-cyan text-white font-medium hover:shadow-lg hover:shadow-cyan/25 transition-all no-underline">
          New Analysis <ArrowRight size={16} />
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3">
          <AlertCircle size={20} className="text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {items.length === 0 && !error ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <HistoryIcon size={40} className="mx-auto text-text-secondary mb-3" />
          <p className="text-text-secondary mb-4">You haven't run any analyses yet.</p>
          <Link to="/analyze" className="text-blue font-medium hover:underline">Start your first analysis →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <Link
              key={p.id}
              to={`/history/${p.id}`}
              className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow no-underline"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface flex items-center justify-center shrink-0">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.label} className="w-full h-full object-cover" />
                ) : (
                  <ImageOff size={22} className="text-text-secondary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-text truncate">{p.label}</p>
                <p className="text-xs text-text-secondary">
                  {p.modelName.replace(/ - .*/, '')} · {formatDate(p.createdAt)}
                </p>
                <span className="inline-block mt-1 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-surface text-text-secondary">
                  {p.mode}
                </span>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-lg font-bold ${confColor(p.confidence)}`}>{Math.round(p.confidence * 100)}%</p>
                <p className="text-xs text-text-secondary">confidence</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
