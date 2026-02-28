'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface WorkoutChartProps {
  data: Array<{ date: string; type: string; duration: number; calories: number }>;
}

export default function WorkoutChart({ data }: WorkoutChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
        <h2 className="text-xl font-bold text-white mb-4">💪 Workouts</h2>
        <p className="text-gray-400 text-center py-8">No workout data available</p>
      </div>
    );
  }

  // Aggregate by date
  const dailyWorkouts = data.reduce((acc: any, workout) => {
    const existing = acc.find((w: any) => w.date === workout.date);
    if (existing) {
      existing.duration += workout.duration;
      existing.calories += workout.calories;
      existing.count += 1;
    } else {
      acc.push({
        date: workout.date,
        duration: workout.duration,
        calories: workout.calories,
        count: 1,
      });
    }
    return acc;
  }, []);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">💪 Workouts</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dailyWorkouts}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis yAxisId="left" stroke="#9ca3af" tick={{ fontSize: 12 }} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
          <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" tick={{ fontSize: 12 }} label={{ value: 'Calories', angle: 90, position: 'insideRight', fill: '#9ca3af' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #f59e0b', borderRadius: '8px' }}
            labelStyle={{ color: '#e5e7eb' }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="duration" fill="#fbbf24" name="Duration (min)" radius={[8, 8, 0, 0]} />
          <Bar yAxisId="right" dataKey="calories" fill="#fb923c" name="Calories" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
