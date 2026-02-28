'use client';

interface StatsOverviewProps {
  data: any;
}

export default function StatsOverview({ data }: StatsOverviewProps) {
  const avgSleep = data.sleep?.length
    ? (data.sleep.reduce((sum: number, d: any) => sum + d.hours, 0) / data.sleep.length).toFixed(1)
    : '0';

  const totalSteps = data.steps?.reduce((sum: number, d: any) => sum + d.count, 0) || 0;
  const avgSteps = data.steps?.length
    ? Math.round(totalSteps / data.steps.length)
    : 0;

  const totalDistance = data.distance?.reduce((sum: number, d: any) => sum + d.km, 0) || 0;

  const totalFlights = data.flightsClimbed?.reduce((sum: number, d: any) => sum + d.count, 0) || 0;

  const totalWorkouts = data.workouts?.length || 0;
  const totalCalories = data.workouts?.reduce((sum: number, d: any) => sum + d.calories, 0) || 0;

  const totalActiveEnergy = data.activeEnergy?.reduce((sum: number, d: any) => sum + d.calories, 0) || 0;

  const avgExerciseMinutes = data.exerciseMinutes?.length
    ? Math.round(data.exerciseMinutes.reduce((sum: number, d: any) => sum + d.minutes, 0) / data.exerciseMinutes.length)
    : 0;

  const avgStandHours = data.standHours?.length
    ? Math.round(data.standHours.reduce((sum: number, d: any) => sum + d.hours, 0) / data.standHours.length)
    : 0;

  const latestWeight = data.weight?.length ? data.weight[data.weight.length - 1].kg : null;

  const avgRestingHR = data.restingHeartRate?.length
    ? Math.round(data.restingHeartRate.reduce((sum: number, d: any) => sum + d.bpm, 0) / data.restingHeartRate.length)
    : null;

  const latestVO2Max = data.vo2Max?.length ? data.vo2Max[data.vo2Max.length - 1].value : null;

  const totalWater = data.water?.reduce((sum: number, d: any) => sum + d.ml, 0) || 0;
  const avgWater = data.water?.length ? Math.round(totalWater / data.water.length) : 0;

  const stats = [
    { label: 'Avg Sleep', value: `${avgSleep}h`, icon: '😴', color: 'from-blue-500 to-purple-500' },
    { label: 'Avg Steps', value: avgSteps.toLocaleString(), icon: '👟', color: 'from-green-500 to-teal-500' },
    { label: 'Total Distance', value: `${totalDistance.toFixed(1)} km`, icon: '🏃', color: 'from-cyan-500 to-blue-500' },
    { label: 'Flights Climbed', value: totalFlights.toString(), icon: '🪜', color: 'from-purple-500 to-pink-500' },
    { label: 'Total Workouts', value: totalWorkouts.toString(), icon: '💪', color: 'from-orange-500 to-red-500' },
    { label: 'Workout Calories', value: Math.round(totalCalories).toLocaleString(), icon: '🔥', color: 'from-yellow-500 to-orange-500' },
    { label: 'Active Energy', value: Math.round(totalActiveEnergy).toLocaleString(), icon: '⚡', color: 'from-amber-500 to-yellow-500' },
    { label: 'Avg Exercise', value: `${avgExerciseMinutes} min`, icon: '🏋️', color: 'from-red-500 to-pink-500' },
    { label: 'Avg Stand Hours', value: `${avgStandHours}h`, icon: '🧍', color: 'from-teal-500 to-cyan-500' },
    ...(latestWeight ? [{ label: 'Current Weight', value: `${latestWeight} kg`, icon: '⚖️', color: 'from-sky-500 to-blue-500' }] : []),
    ...(avgRestingHR ? [{ label: 'Avg Resting HR', value: `${avgRestingHR} bpm`, icon: '❤️', color: 'from-red-500 to-rose-500' }] : []),
    ...(latestVO2Max ? [{ label: 'VO2 Max', value: latestVO2Max.toString(), icon: '🫁', color: 'from-green-500 to-emerald-500' }] : []),
    ...(avgWater ? [{ label: 'Avg Water', value: `${avgWater} ml`, icon: '💧', color: 'from-blue-400 to-cyan-400' }] : []),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">{stat.icon}</span>
            <div className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white`}>
              STAT
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
