'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BloodPressureChartProps {
  systolicData: Array<{ date: string; value: number }>;
  diastolicData: Array<{ date: string; value: number }>;
}

export default function BloodPressureChart({ systolicData, diastolicData }: BloodPressureChartProps) {
  if ((!systolicData || systolicData.length === 0) && (!diastolicData || diastolicData.length === 0)) return null;

  // Merge data
  const merged = new Map();
  systolicData?.forEach(d => merged.set(d.date, { date: d.date, systolic: d.value }));
  diastolicData?.forEach(d => {
    const existing = merged.get(d.date);
    if (existing) {
      existing.diastolic = d.value;
    } else {
      merged.set(d.date, { date: d.date, diastolic: d.value });
    }
  });

  const data = Array.from(merged.values()).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">🩺 Blood Pressure</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} label={{ value: 'mmHg', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ef4444', borderRadius: '8px' }}
            labelStyle={{ color: '#e5e7eb' }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          <Line type="monotone" dataKey="systolic" stroke="#f87171" strokeWidth={2} dot={{ fill: '#f87171', r: 4 }} name="Systolic" />
          <Line type="monotone" dataKey="diastolic" stroke="#fb923c" strokeWidth={2} dot={{ fill: '#fb923c', r: 4 }} name="Diastolic" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
