'use client';

import { useState, useMemo } from 'react';
import SleepChart from './charts/SleepChart';
import StepsChart from './charts/StepsChart';
import WorkoutChart from './charts/WorkoutChart';
import HeartRateChart from './charts/HeartRateChart';
import DistanceChart from './charts/DistanceChart';
import FlightsChart from './charts/FlightsChart';
import EnergyChart from './charts/EnergyChart';
import WeightChart from './charts/WeightChart';
import BloodPressureChart from './charts/BloodPressureChart';
import StandHoursChart from './charts/StandHoursChart';
import WaterChart from './charts/WaterChart';
import VO2MaxChart from './charts/VO2MaxChart';
import StatsOverview from './StatsOverview';

interface DashboardProps {
  data: any;
  onReset: () => void;
}

export default function Dashboard({ data, onReset }: DashboardProps) {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const filteredData = useMemo(() => {
    if (dateRange === 'all') return data;

    const now = new Date();
    const cutoffDays = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const cutoff = new Date(now.getTime() - cutoffDays * 24 * 60 * 60 * 1000);

    const filterByDate = (arr: any[]) => arr?.filter((d: any) => new Date(d.date) >= cutoff) || [];

    return {
      sleep: filterByDate(data.sleep),
      steps: filterByDate(data.steps),
      distance: filterByDate(data.distance),
      flightsClimbed: filterByDate(data.flightsClimbed),
      activeEnergy: filterByDate(data.activeEnergy),
      restingEnergy: filterByDate(data.restingEnergy),
      exerciseMinutes: filterByDate(data.exerciseMinutes),
      standHours: filterByDate(data.standHours),
      workouts: filterByDate(data.workouts),
      heartRate: filterByDate(data.heartRate),
      vo2Max: filterByDate(data.vo2Max),
      restingHeartRate: filterByDate(data.restingHeartRate),
      heartRateVariability: filterByDate(data.heartRateVariability),
      bloodPressureSystolic: filterByDate(data.bloodPressureSystolic),
      bloodPressureDiastolic: filterByDate(data.bloodPressureDiastolic),
      bloodGlucose: filterByDate(data.bloodGlucose),
      weight: filterByDate(data.weight),
      bodyFat: filterByDate(data.bodyFat),
      bmi: filterByDate(data.bmi),
      respiratoryRate: filterByDate(data.respiratoryRate),
      oxygenSaturation: filterByDate(data.oxygenSaturation),
      bodyTemperature: filterByDate(data.bodyTemperature),
      mindfulMinutes: filterByDate(data.mindfulMinutes),
      water: filterByDate(data.water),
      caffeine: filterByDate(data.caffeine),
    };
  }, [data, dateRange]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                dateRange === range
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg font-medium bg-slate-800 text-gray-400 hover:bg-slate-700 transition-all"
        >
          🔄 Upload New Data
        </button>
      </div>

      <StatsOverview data={filteredData} />

      <div className="grid gap-6">
        <SleepChart data={filteredData.sleep} />
        <StepsChart data={filteredData.steps} />
        <DistanceChart data={filteredData.distance} />
        <FlightsChart data={filteredData.flightsClimbed} />
        <EnergyChart activeData={filteredData.activeEnergy} restingData={filteredData.restingEnergy} />
        <StandHoursChart data={filteredData.standHours} />
        <WorkoutChart data={filteredData.workouts} />
        <HeartRateChart data={filteredData.heartRate} />
        <VO2MaxChart data={filteredData.vo2Max} />
        <BloodPressureChart systolicData={filteredData.bloodPressureSystolic} diastolicData={filteredData.bloodPressureDiastolic} />
        <WeightChart data={filteredData.weight} />
        <WaterChart data={filteredData.water} />
      </div>
    </div>
  );
}
