'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WaterChartProps {
  data: Array<{ date: string; ml: number }>;
}

export default function WaterChart({ data }: WaterChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">💧 Water Intake</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} label={{ value: 'ml', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #3b82f6', borderRadius: '8px' }}
            labelStyle={{ color: '#e5e7eb' }}
            itemStyle={{ color: '#60a5fa' }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Bar dataKey="ml" fill="#60a5fa" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
