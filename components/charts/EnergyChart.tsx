'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EnergyChartProps {
  activeData: Array<{ date: string; calories: number }>;
  restingData: Array<{ date: string; calories: number }>;
}

export default function EnergyChart({ activeData, restingData }: EnergyChartProps) {
  if ((!activeData || activeData.length === 0) && (!restingData || restingData.length === 0)) return null;

  // Merge data by date
  const merged = new Map();
  activeData?.forEach(d => merged.set(d.date, { date: d.date, active: d.calories }));
  restingData?.forEach(d => {
    const existing = merged.get(d.date);
    if (existing) {
      existing.resting = d.calories;
    } else {
      merged.set(d.date, { date: d.date, resting: d.calories });
    }
  });

  const data = Array.from(merged.values()).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">⚡ Energy Burned</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} label={{ value: 'Calories', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #f59e0b', borderRadius: '8px' }}
            labelStyle={{ color: '#e5e7eb' }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          <Bar dataKey="active" fill="#fbbf24" name="Active Energy" radius={[8, 8, 0, 0]} />
          <Bar dataKey="resting" fill="#fb923c" name="Resting Energy" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
