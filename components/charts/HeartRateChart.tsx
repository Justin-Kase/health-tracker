'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HeartRateChartProps {
  data: Array<{ date: string; bpm: number }>;
}

export default function HeartRateChart({ data }: HeartRateChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
        <h2 className="text-xl font-bold text-white mb-4">❤️ Heart Rate</h2>
        <p className="text-gray-400 text-center py-8">No heart rate data available</p>
      </div>
    );
  }

  // Sample data if too many points (max 100 for performance)
  const sampledData = data.length > 100 
    ? data.filter((_, i) => i % Math.ceil(data.length / 100) === 0)
    : data;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">❤️ Heart Rate</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sampledData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} domain={[40, 180]} label={{ value: 'BPM', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ef4444', borderRadius: '8px' }}
            labelStyle={{ color: '#e5e7eb' }}
            itemStyle={{ color: '#f87171' }}
            labelFormatter={(label) => new Date(label).toLocaleString()}
          />
          <Line type="monotone" dataKey="bpm" stroke="#f87171" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
