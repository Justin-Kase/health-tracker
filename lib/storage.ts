import { db } from './db';
import { HealthData } from './parseHealthData';

export function saveHealthData(data: HealthData): number {
  const syncId = db.prepare(`
    INSERT INTO sync_history (sync_date, records_imported)
    VALUES (date('now'), ?)
  `).run(
    data.sleep.length + 
    data.steps.length + 
    data.workouts.length + 
    data.heartRate.length
  ).lastInsertRowid as number;

  // Upsert sleep data
  const sleepStmt = db.prepare(`
    INSERT INTO sleep (date, hours, sync_id)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET hours = excluded.hours, sync_id = excluded.sync_id
  `);

  const stepsStmt = db.prepare(`
    INSERT INTO steps (date, count, sync_id)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET count = excluded.count, sync_id = excluded.sync_id
  `);

  const distanceStmt = db.prepare(`
    INSERT INTO distance (date, km, sync_id)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET km = excluded.km, sync_id = excluded.sync_id
  `);

  const flightsStmt = db.prepare(`
    INSERT INTO flights_climbed (date, count, sync_id)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET count = excluded.count, sync_id = excluded.sync_id
  `);

  const activeEnergyStmt = db.prepare(`
    INSERT INTO active_energy (date, calories, sync_id)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET calories = excluded.calories, sync_id = excluded.sync_id
  `);

  const restingEnergyStmt = db.prepare(`
    INSERT INTO resting_energy (date, calories, sync_id)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET calories = excluded.calories, sync_id = excluded.sync_id
  `);

  const exerciseStmt = db.prepare(`
    INSERT INTO exercise_minutes (date, minutes, sync_id)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET minutes = excluded.minutes, sync_id = excluded.sync_id
  `);

  const standStmt = db.prepare(`
    INSERT INTO stand_hours (date, hours, sync_id)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET hours = excluded.hours, sync_id = excluded.sync_id
  `);

  const waterStmt = db.prepare(`
    INSERT INTO water (date, ml, sync_id)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET ml = excluded.ml, sync_id = excluded.sync_id
  `);

  const caffeineStmt = db.prepare(`
    INSERT INTO caffeine (date, mg, sync_id)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET mg = excluded.mg, sync_id = excluded.sync_id
  `);

  const mindfulStmt = db.prepare(`
    INSERT INTO mindful_minutes (date, minutes, sync_id)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET minutes = excluded.minutes, sync_id = excluded.sync_id
  `);

  const workoutStmt = db.prepare(`
    INSERT INTO workouts (date, type, duration, calories, sync_id)
    VALUES (?, ?, ?, ?, ?)
  `);

  const heartRateStmt = db.prepare(`
    INSERT INTO heart_rate (timestamp, bpm, sync_id)
    VALUES (?, ?, ?)
  `);

  const vo2MaxStmt = db.prepare(`
    INSERT INTO vo2_max (date, value, sync_id)
    VALUES (?, ?, ?)
  `);

  const restingHRStmt = db.prepare(`
    INSERT INTO resting_heart_rate (date, bpm, sync_id)
    VALUES (?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET bpm = excluded.bpm, sync_id = excluded.sync_id
  `);

  const weightStmt = db.prepare(`
    INSERT INTO weight (date, kg, sync_id)
    VALUES (?, ?, ?)
  `);

  const bpStmt = db.prepare(`
    INSERT INTO blood_pressure (date, systolic, diastolic, sync_id)
    VALUES (?, ?, ?, ?)
  `);

  // Batch inserts in transaction
  const insertAll = db.transaction(() => {
    data.sleep?.forEach(d => sleepStmt.run(d.date, d.hours, syncId));
    data.steps?.forEach(d => stepsStmt.run(d.date, d.count, syncId));
    data.distance?.forEach(d => distanceStmt.run(d.date, d.km, syncId));
    data.flightsClimbed?.forEach(d => flightsStmt.run(d.date, d.count, syncId));
    data.activeEnergy?.forEach(d => activeEnergyStmt.run(d.date, d.calories, syncId));
    data.restingEnergy?.forEach(d => restingEnergyStmt.run(d.date, d.calories, syncId));
    data.exerciseMinutes?.forEach(d => exerciseStmt.run(d.date, d.minutes, syncId));
    data.standHours?.forEach(d => standStmt.run(d.date, d.hours, syncId));
    data.water?.forEach(d => waterStmt.run(d.date, d.ml, syncId));
    data.caffeine?.forEach(d => caffeineStmt.run(d.date, d.mg, syncId));
    data.mindfulMinutes?.forEach(d => mindfulStmt.run(d.date, d.minutes, syncId));
    data.workouts?.forEach(d => workoutStmt.run(d.date, d.type, d.duration, d.calories, syncId));
    data.heartRate?.forEach(d => heartRateStmt.run(d.date, d.bpm, syncId));
    data.vo2Max?.forEach(d => vo2MaxStmt.run(d.date, d.value, syncId));
    data.restingHeartRate?.forEach(d => restingHRStmt.run(d.date, d.bpm, syncId));
    data.weight?.forEach(d => weightStmt.run(d.date, d.kg, syncId));

    // Merge blood pressure data
    const bpMap = new Map();
    data.bloodPressureSystolic?.forEach(d => {
      bpMap.set(d.date, { date: d.date, systolic: d.value });
    });
    data.bloodPressureDiastolic?.forEach(d => {
      const existing = bpMap.get(d.date);
      if (existing) {
        existing.diastolic = d.value;
      } else {
        bpMap.set(d.date, { date: d.date, diastolic: d.value });
      }
    });
    bpMap.forEach(bp => {
      bpStmt.run(bp.date, bp.systolic || null, bp.diastolic || null, syncId);
    });
  });

  insertAll();
  return syncId;
}

export function loadHealthData(daysBack?: number): HealthData {
  const dateFilter = daysBack 
    ? `WHERE date >= date('now', '-${daysBack} days')`
    : '';

  const sleep = db.prepare(`SELECT date, hours FROM sleep ${dateFilter} ORDER BY date`).all() as any[];
  const steps = db.prepare(`SELECT date, count FROM steps ${dateFilter} ORDER BY date`).all() as any[];
  const distance = db.prepare(`SELECT date, km FROM distance ${dateFilter} ORDER BY date`).all() as any[];
  const flightsClimbed = db.prepare(`SELECT date, count FROM flights_climbed ${dateFilter} ORDER BY date`).all() as any[];
  const activeEnergy = db.prepare(`SELECT date, calories FROM active_energy ${dateFilter} ORDER BY date`).all() as any[];
  const restingEnergy = db.prepare(`SELECT date, calories FROM resting_energy ${dateFilter} ORDER BY date`).all() as any[];
  const exerciseMinutes = db.prepare(`SELECT date, minutes FROM exercise_minutes ${dateFilter} ORDER BY date`).all() as any[];
  const standHours = db.prepare(`SELECT date, hours FROM stand_hours ${dateFilter} ORDER BY date`).all() as any[];
  const water = db.prepare(`SELECT date, ml FROM water ${dateFilter} ORDER BY date`).all() as any[];
  const caffeine = db.prepare(`SELECT date, mg FROM caffeine ${dateFilter} ORDER BY date`).all() as any[];
  const mindfulMinutes = db.prepare(`SELECT date, minutes FROM mindful_minutes ${dateFilter} ORDER BY date`).all() as any[];
  const workouts = db.prepare(`SELECT date, type, duration, calories FROM workouts ${dateFilter} ORDER BY date`).all() as any[];
  const heartRate = db.prepare(`SELECT timestamp as date, bpm FROM heart_rate ${dateFilter.replace('date', 'timestamp')} ORDER BY timestamp`).all() as any[];
  const vo2Max = db.prepare(`SELECT date, value FROM vo2_max ${dateFilter} ORDER BY date`).all() as any[];
  const restingHeartRate = db.prepare(`SELECT date, bpm FROM resting_heart_rate ${dateFilter} ORDER BY date`).all() as any[];
  const weight = db.prepare(`SELECT date, kg FROM weight ${dateFilter} ORDER BY date`).all() as any[];

  const bloodPressure = db.prepare(`SELECT date, systolic, diastolic FROM blood_pressure ${dateFilter} ORDER BY date`).all() as any[];
  const bloodPressureSystolic = bloodPressure.map(bp => ({ date: bp.date, value: bp.systolic }));
  const bloodPressureDiastolic = bloodPressure.map(bp => ({ date: bp.date, value: bp.diastolic }));

  return {
    sleep,
    steps,
    distance,
    flightsClimbed,
    activeEnergy,
    restingEnergy,
    exerciseMinutes,
    standHours,
    water,
    caffeine,
    mindfulMinutes,
    workouts,
    heartRate,
    vo2Max,
    restingHeartRate,
    heartRateVariability: [], // TODO
    bloodPressureSystolic,
    bloodPressureDiastolic,
    bloodGlucose: [], // TODO
    weight,
    bodyFat: [], // TODO
    bmi: [], // TODO
    respiratoryRate: [], // TODO
    oxygenSaturation: [], // TODO
    bodyTemperature: [], // TODO
  };
}

export function getLastSyncDate(): string | null {
  const result = db.prepare(`
    SELECT sync_date FROM sync_history ORDER BY created_at DESC LIMIT 1
  `).get() as { sync_date: string } | undefined;

  return result?.sync_date || null;
}
