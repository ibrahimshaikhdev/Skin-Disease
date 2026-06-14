import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = [
  '#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#90e0ef',
  '#0f2a4a', '#1a3a5c', '#0d3b66', '#155e85', '#1e7ca6',
];

export default function ProbabilityChart({ probabilities }) {
  if (!probabilities) return null;

  // Accept either an array of { class, probability } (API form) or an
  // object map of { name: value }.
  const entries = Array.isArray(probabilities)
    ? probabilities.map((p) => [p.class ?? p.name, p.probability ?? p.value])
    : Object.entries(probabilities);

  const data = entries
    .map(([name, value]) => ({
      name: name.length > 25 ? name.slice(0, 22) + '...' : name,
      fullName: name,
      value: Math.round(value * 1000) / 10,
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-navy text-white px-3 py-2 rounded-lg shadow-lg text-sm">
          <p className="font-medium">{payload[0].payload.fullName}</p>
          <p className="text-cyan-pale">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h3 className="font-semibold text-text mb-4">Probability Distribution</h3>
      <div style={{ width: '100%', height: Math.max(200, data.length * 32 + 40) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
