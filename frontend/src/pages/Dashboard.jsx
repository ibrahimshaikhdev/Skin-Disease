import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  Activity, Target, TrendingUp, Layers, Loader2, AlertCircle, ArrowRight, Clock,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { getDashboardStats } from '../services/predictionService';

const PIE_COLORS = ['#0077b6', '#00b4d8', '#48cae4', '#90e0ef', '#0f2a4a'];

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.response?.data?.error || 'Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

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
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3">
          <AlertCircle size={20} className="text-danger shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      </div>
    );
  }

  const trendData = (stats.trend || []).map((t) => ({
    date: t.date.slice(5),
    count: t.count,
  }));
  const modelData = (stats.byModel || []).map((m) => ({
    name: m.name.replace(/Model (\d+).*/, 'Model $1'),
    count: m.count,
  }));
  const empty = stats.totalPredictions === 0;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Clinical Dashboard</h1>
          <p className="text-text-secondary">Analytics for {stats.username}'s analyses</p>
        </div>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue to-cyan text-white font-medium hover:shadow-lg hover:shadow-cyan/25 transition-all no-underline"
        >
          New Analysis <ArrowRight size={16} />
        </Link>
      </div>

      {empty && (
        <div className="mb-8 p-6 bg-card border border-border rounded-2xl text-center">
          <p className="text-text-secondary">No analyses yet. Run your first analysis to populate your dashboard.</p>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Activity} label="Total Analyses" value={stats.totalPredictions} accent="blue" />
        <StatCard icon={Target} label="Avg Confidence" value={`${Math.round((stats.averageConfidence || 0) * 100)}%`} accent="cyan" />
        <StatCard icon={TrendingUp} label="High Confidence" value={stats.highConfidenceCount} accent="success" />
        <StatCard icon={Layers} label="Conditions Seen" value={stats.distinctConditions} accent="warning" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Trend */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-text mb-4">Activity — Last 7 Days</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#0077b6" strokeWidth={3} dot={{ r: 4, fill: '#00b4d8' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model usage pie */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-text mb-4">Model Usage</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={modelData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {modelData.map((entry, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top conditions + recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-text mb-4">Top Detected Conditions</h3>
          {stats.topConditions?.length ? (
            <div style={{ width: '100%', height: Math.max(160, stats.topConditions.length * 34) }}>
              <ResponsiveContainer>
                <BarChart data={stats.topConditions.map((c) => ({ name: c.name.length > 22 ? c.name.slice(0, 20) + '…' : c.name, count: c.count }))}
                  layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#00b4d8" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-text-secondary">No data yet.</p>
          )}
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text">Recent Activity</h3>
            <Link to="/history" className="text-sm text-blue hover:underline">View all</Link>
          </div>
          {stats.recent?.length ? (
            <ul className="divide-y divide-border">
              {stats.recent.map((r) => (
                <li key={r.id} className="py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue/10 flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-blue" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text truncate">{r.label}</p>
                    <p className="text-xs text-text-secondary">{r.modelName.replace(/ - .*/, '')} · {formatDate(r.createdAt)}</p>
                  </div>
                  <span className="text-sm font-semibold text-blue shrink-0">{Math.round(r.confidence * 100)}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-secondary">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}
