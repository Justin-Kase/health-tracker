'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VO2MaxChartProps {
  data: Array<{ date: string; value: number }>;
}

export default function VO2MaxChart({ data }: VO2MaxChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">🫁 VO2 Max</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} label={{ value: 'mL/kg/min', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #10b981', borderRadius: '8px' }}
            labelStyle={{ color: '#e5e7eb' }}
            itemStyle={{ color: '#34d399' }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} dot={{ fill: '#34d399', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
