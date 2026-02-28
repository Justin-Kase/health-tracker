'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeightChartProps {
  data: Array<{ date: string; kg: number }>;
}

export default function WeightChart({ data }: WeightChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">⚖️ Weight Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} label={{ value: 'kg', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #06b6d4', borderRadius: '8px' }}
            labelStyle={{ color: '#e5e7eb' }}
            itemStyle={{ color: '#67e8f9' }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Line type="monotone" dataKey="kg" stroke="#67e8f9" strokeWidth={2} dot={{ fill: '#67e8f9', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
