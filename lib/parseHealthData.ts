import xml2js from 'xml2js';

export interface HealthData {
  sleep: Array<{ date: string; hours: number }>;
  steps: Array<{ date: string; count: number }>;
  workouts: Array<{ date: string; type: string; duration: number; calories: number }>;
  heartRate: Array<{ date: string; bpm: number }>;
  distance: Array<{ date: string; km: number }>;
  flightsClimbed: Array<{ date: string; count: number }>;
  activeEnergy: Array<{ date: string; calories: number }>;
  restingEnergy: Array<{ date: string; calories: number }>;
  exerciseMinutes: Array<{ date: string; minutes: number }>;
  standHours: Array<{ date: string; hours: number }>;
  vo2Max: Array<{ date: string; value: number }>;
  restingHeartRate: Array<{ date: string; bpm: number }>;
  heartRateVariability: Array<{ date: string; ms: number }>;
  bloodPressureSystolic: Array<{ date: string; value: number }>;
  bloodPressureDiastolic: Array<{ date: string; value: number }>;
  bloodGlucose: Array<{ date: string; value: number }>;
  weight: Array<{ date: string; kg: number }>;
  bodyFat: Array<{ date: string; percentage: number }>;
  bmi: Array<{ date: string; value: number }>;
  respiratoryRate: Array<{ date: string; bpm: number }>;
  oxygenSaturation: Array<{ date: string; percentage: number }>;
  bodyTemperature: Array<{ date: string; celsius: number }>;
  mindfulMinutes: Array<{ date: string; minutes: number }>;
  water: Array<{ date: string; ml: number }>;
  caffeine: Array<{ date: string; mg: number }>;
}

export async function parseHealthData(xmlText: string): Promise<HealthData> {
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xmlText);

  const records = result.HealthData?.Record || [];

  // Initialize maps for daily aggregation
  const sleepMap = new Map<string, number>();
  const stepsMap = new Map<string, number>();
  const distanceMap = new Map<string, number>();
  const flightsMap = new Map<string, number>();
  const activeEnergyMap = new Map<string, number>();
  const restingEnergyMap = new Map<string, number>();
  const exerciseMinutesMap = new Map<string, number>();
  const standHoursMap = new Map<string, number>();
  const mindfulMinutesMap = new Map<string, number>();
  const waterMap = new Map<string, number>();
  const caffeineMap = new Map<string, number>();

  // Initialize arrays for point-in-time measurements
  const heartRateData: Array<{ date: string; bpm: number }> = [];
  const vo2MaxData: Array<{ date: string; value: number }> = [];
  const restingHRData: Array<{ date: string; bpm: number }> = [];
  const hrvData: Array<{ date: string; ms: number }> = [];
  const bpSystolicData: Array<{ date: string; value: number }> = [];
  const bpDiastolicData: Array<{ date: string; value: number }> = [];
  const bloodGlucoseData: Array<{ date: string; value: number }> = [];
  const weightData: Array<{ date: string; kg: number }> = [];
  const bodyFatData: Array<{ date: string; percentage: number }> = [];
  const bmiData: Array<{ date: string; value: number }> = [];
  const respiratoryRateData: Array<{ date: string; bpm: number }> = [];
  const oxygenSaturationData: Array<{ date: string; percentage: number }> = [];
  const bodyTemperatureData: Array<{ date: string; celsius: number }> = [];
  const workouts: Array<{ date: string; type: string; duration: number; calories: number }> = [];

  // Process records
  records.forEach((record: any) => {
    const type = record.$?.type || '';
    const startDate = record.$?.startDate;
    const value = parseFloat(record.$?.value);
    const unit = record.$?.unit;

    if (!startDate) return;

    const date = startDate.split(' ')[0]; // Extract YYYY-MM-DD

    // Sleep analysis
    if (type === 'HKCategoryTypeIdentifierSleepAnalysis') {
      const start = new Date(record.$?.startDate);
      const end = new Date(record.$?.endDate);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      if (record.$?.value === 'HKCategoryValueSleepAnalysisAsleep') {
        sleepMap.set(date, (sleepMap.get(date) || 0) + hours);
      }
    }

    if (isNaN(value)) return;

    // Steps
    if (type === 'HKQuantityTypeIdentifierStepCount') {
      stepsMap.set(date, (stepsMap.get(date) || 0) + value);
    }

    // Distance (convert to km)
    if (type === 'HKQuantityTypeIdentifierDistanceWalkingRunning') {
      const km = unit === 'mi' ? value * 1.60934 : value;
      distanceMap.set(date, (distanceMap.get(date) || 0) + km);
    }

    // Flights climbed
    if (type === 'HKQuantityTypeIdentifierFlightsClimbed') {
      flightsMap.set(date, (flightsMap.get(date) || 0) + value);
    }

    // Active Energy
    if (type === 'HKQuantityTypeIdentifierActiveEnergyBurned') {
      activeEnergyMap.set(date, (activeEnergyMap.get(date) || 0) + value);
    }

    // Resting Energy
    if (type === 'HKQuantityTypeIdentifierBasalEnergyBurned') {
      restingEnergyMap.set(date, (restingEnergyMap.get(date) || 0) + value);
    }

    // Exercise Minutes
    if (type === 'HKQuantityTypeIdentifierAppleExerciseTime') {
      exerciseMinutesMap.set(date, (exerciseMinutesMap.get(date) || 0) + value);
    }

    // Stand Hours
    if (type === 'HKCategoryTypeIdentifierAppleStandHour') {
      standHoursMap.set(date, (standHoursMap.get(date) || 0) + 1);
    }

    // Mindful Minutes
    if (type === 'HKCategoryTypeIdentifierMindfulSession') {
      const start = new Date(record.$?.startDate);
      const end = new Date(record.$?.endDate);
      const minutes = (end.getTime() - start.getTime()) / (1000 * 60);
      mindfulMinutesMap.set(date, (mindfulMinutesMap.get(date) || 0) + minutes);
    }

    // Water (convert to ml)
    if (type === 'HKQuantityTypeIdentifierDietaryWater') {
      const ml = unit === 'L' ? value * 1000 : unit === 'fl_oz_us' ? value * 29.5735 : value;
      waterMap.set(date, (waterMap.get(date) || 0) + ml);
    }

    // Caffeine
    if (type === 'HKQuantityTypeIdentifierDietaryCaffeine') {
      caffeineMap.set(date, (caffeineMap.get(date) || 0) + value);
    }

    // Heart Rate
    if (type === 'HKQuantityTypeIdentifierHeartRate') {
      heartRateData.push({ date: startDate, bpm: Math.round(value) });
    }

    // VO2 Max
    if (type === 'HKQuantityTypeIdentifierVO2Max') {
      vo2MaxData.push({ date, value: Math.round(value * 10) / 10 });
    }

    // Resting Heart Rate
    if (type === 'HKQuantityTypeIdentifierRestingHeartRate') {
      restingHRData.push({ date, bpm: Math.round(value) });
    }

    // Heart Rate Variability
    if (type === 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN') {
      hrvData.push({ date, ms: Math.round(value) });
    }

    // Blood Pressure
    if (type === 'HKQuantityTypeIdentifierBloodPressureSystolic') {
      bpSystolicData.push({ date, value: Math.round(value) });
    }
    if (type === 'HKQuantityTypeIdentifierBloodPressureDiastolic') {
      bpDiastolicData.push({ date, value: Math.round(value) });
    }

    // Blood Glucose
    if (type === 'HKQuantityTypeIdentifierBloodGlucose') {
      bloodGlucoseData.push({ date, value: Math.round(value) });
    }

    // Weight (convert to kg)
    if (type === 'HKQuantityTypeIdentifierBodyMass') {
      const kg = unit === 'lb' ? value * 0.453592 : value;
      weightData.push({ date, kg: Math.round(kg * 10) / 10 });
    }

    // Body Fat Percentage
    if (type === 'HKQuantityTypeIdentifierBodyFatPercentage') {
      bodyFatData.push({ date, percentage: Math.round(value * 1000) / 10 });
    }

    // BMI
    if (type === 'HKQuantityTypeIdentifierBodyMassIndex') {
      bmiData.push({ date, value: Math.round(value * 10) / 10 });
    }

    // Respiratory Rate
    if (type === 'HKQuantityTypeIdentifierRespiratoryRate') {
      respiratoryRateData.push({ date, bpm: Math.round(value) });
    }

    // Oxygen Saturation
    if (type === 'HKQuantityTypeIdentifierOxygenSaturation') {
      oxygenSaturationData.push({ date, percentage: Math.round(value * 100) });
    }

    // Body Temperature
    if (type === 'HKQuantityTypeIdentifierBodyTemperature') {
      const celsius = unit === 'degF' ? (value - 32) * 5/9 : value;
      bodyTemperatureData.push({ date, celsius: Math.round(celsius * 10) / 10 });
    }
  });

  // Process workouts
  const workoutRecords = result.HealthData?.Workout || [];
  workoutRecords.forEach((workout: any) => {
    const startDate = workout.$?.startDate;
    if (!startDate) return;

    const date = startDate.split(' ')[0];
    const type = workout.$?.workoutActivityType?.replace('HKWorkoutActivityType', '') || 'Unknown';
    const duration = parseFloat(workout.$?.duration) || 0;
    const calories = parseFloat(workout.$?.totalEnergyBurned) || 0;

    workouts.push({
      date,
      type,
      duration: Math.round(duration),
      calories: Math.round(calories),
    });
  });

  return {
    sleep: Array.from(sleepMap.entries())
      .map(([date, hours]) => ({ date, hours: Math.round(hours * 10) / 10 }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    steps: Array.from(stepsMap.entries())
      .map(([date, count]) => ({ date, count: Math.round(count) }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    distance: Array.from(distanceMap.entries())
      .map(([date, km]) => ({ date, km: Math.round(km * 100) / 100 }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    flightsClimbed: Array.from(flightsMap.entries())
      .map(([date, count]) => ({ date, count: Math.round(count) }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    activeEnergy: Array.from(activeEnergyMap.entries())
      .map(([date, calories]) => ({ date, calories: Math.round(calories) }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    restingEnergy: Array.from(restingEnergyMap.entries())
      .map(([date, calories]) => ({ date, calories: Math.round(calories) }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    exerciseMinutes: Array.from(exerciseMinutesMap.entries())
      .map(([date, minutes]) => ({ date, minutes: Math.round(minutes) }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    standHours: Array.from(standHoursMap.entries())
      .map(([date, hours]) => ({ date, hours }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    mindfulMinutes: Array.from(mindfulMinutesMap.entries())
      .map(([date, minutes]) => ({ date, minutes: Math.round(minutes) }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    water: Array.from(waterMap.entries())
      .map(([date, ml]) => ({ date, ml: Math.round(ml) }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    caffeine: Array.from(caffeineMap.entries())
      .map(([date, mg]) => ({ date, mg: Math.round(mg) }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    workouts: workouts.sort((a, b) => a.date.localeCompare(b.date)),
    heartRate: heartRateData.sort((a, b) => a.date.localeCompare(b.date)),
    vo2Max: vo2MaxData.sort((a, b) => a.date.localeCompare(b.date)),
    restingHeartRate: restingHRData.sort((a, b) => a.date.localeCompare(b.date)),
    heartRateVariability: hrvData.sort((a, b) => a.date.localeCompare(b.date)),
    bloodPressureSystolic: bpSystolicData.sort((a, b) => a.date.localeCompare(b.date)),
    bloodPressureDiastolic: bpDiastolicData.sort((a, b) => a.date.localeCompare(b.date)),
    bloodGlucose: bloodGlucoseData.sort((a, b) => a.date.localeCompare(b.date)),
    weight: weightData.sort((a, b) => a.date.localeCompare(b.date)),
    bodyFat: bodyFatData.sort((a, b) => a.date.localeCompare(b.date)),
    bmi: bmiData.sort((a, b) => a.date.localeCompare(b.date)),
    respiratoryRate: respiratoryRateData.sort((a, b) => a.date.localeCompare(b.date)),
    oxygenSaturation: oxygenSaturationData.sort((a, b) => a.date.localeCompare(b.date)),
    bodyTemperature: bodyTemperatureData.sort((a, b) => a.date.localeCompare(b.date)),
  };
}
