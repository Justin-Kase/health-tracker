import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'health.db');

export const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS sync_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sync_date TEXT NOT NULL,
    file_path TEXT,
    records_imported INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sleep (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    hours REAL,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    count INTEGER,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS distance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    km REAL,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS flights_climbed (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    count INTEGER,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS active_energy (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    calories INTEGER,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS resting_energy (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    calories INTEGER,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS exercise_minutes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    minutes INTEGER,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS stand_hours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    hours INTEGER,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    type TEXT,
    duration INTEGER,
    calories INTEGER,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS heart_rate (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    bpm INTEGER,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS vo2_max (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    value REAL,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS resting_heart_rate (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    bpm INTEGER,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS heart_rate_variability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    ms INTEGER,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS blood_pressure (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    systolic INTEGER,
    diastolic INTEGER,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS weight (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    kg REAL,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS body_fat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    percentage REAL,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS bmi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    value REAL,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS water (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    ml INTEGER,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS caffeine (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    mg INTEGER,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE TABLE IF NOT EXISTS mindful_minutes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    minutes INTEGER,
    sync_id INTEGER,
    FOREIGN KEY (sync_id) REFERENCES sync_history(id)
  );

  CREATE INDEX IF NOT EXISTS idx_sleep_date ON sleep(date);
  CREATE INDEX IF NOT EXISTS idx_steps_date ON steps(date);
  CREATE INDEX IF NOT EXISTS idx_heart_rate_timestamp ON heart_rate(timestamp);
  CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(date);
`);

export default db;
