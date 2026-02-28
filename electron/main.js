const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let Database;
let db;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: 320,
    height: 480,
    x: width - 340,
    y: 40,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'widget.html'));
  
  // Enable dragging
  mainWindow.setIgnoreMouseEvents(false);
}

function initDatabase() {
  const dbPath = path.join(__dirname, '../data/health.db');
  
  // Check if database file exists
  if (!fs.existsSync(dbPath)) {
    console.log('Database not found at:', dbPath);
    db = null;
    return;
  }

  try {
    Database = require('better-sqlite3');
    db = new Database(dbPath, { readonly: true });
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Failed to initialize database:', err);
    db = null;
  }
}

ipcMain.handle('get-health-data', async () => {
  if (!db) {
    console.log('Database not available');
    return null;
  }

  try {
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Get last 7 days of key metrics
    const sleep = db.prepare(`
      SELECT date, hours FROM sleep 
      WHERE date >= date('now', '-7 days') 
      ORDER BY date DESC LIMIT 7
    `).all();

    const steps = db.prepare(`
      SELECT date, count FROM steps 
      WHERE date >= date('now', '-7 days') 
      ORDER BY date DESC LIMIT 7
    `).all();

    const activeEnergy = db.prepare(`
      SELECT date, calories FROM active_energy 
      WHERE date >= date('now', '-7 days') 
      ORDER BY date DESC LIMIT 7
    `).all();

    const exerciseMinutes = db.prepare(`
      SELECT date, minutes FROM exercise_minutes 
      WHERE date >= date('now', '-7 days') 
      ORDER BY date DESC LIMIT 7
    `).all();

    const standHours = db.prepare(`
      SELECT date, hours FROM stand_hours 
      WHERE date >= date('now', '-7 days') 
      ORDER BY date DESC LIMIT 7
    `).all();

    const weight = db.prepare(`
      SELECT date, kg FROM weight 
      ORDER BY date DESC LIMIT 1
    `).get();

    const restingHR = db.prepare(`
      SELECT date, bpm FROM resting_heart_rate 
      WHERE date >= date('now', '-7 days') 
      ORDER BY date DESC LIMIT 1
    `).get();

    const vo2Max = db.prepare(`
      SELECT date, value FROM vo2_max 
      ORDER BY date DESC LIMIT 1
    `).get();

    // Today's totals
    const todaySleep = sleep.find(s => s.date === today) || sleep[0];
    const todaySteps = steps.find(s => s.date === today) || steps[0];
    const todayEnergy = activeEnergy.find(s => s.date === today) || activeEnergy[0];
    const todayExercise = exerciseMinutes.find(s => s.date === today) || exerciseMinutes[0];
    const todayStand = standHours.find(s => s.date === today) || standHours[0];

    // 7-day averages
    const avgSleep = sleep.length ? (sleep.reduce((sum, s) => sum + s.hours, 0) / sleep.length).toFixed(1) : 0;
    const avgSteps = steps.length ? Math.round(steps.reduce((sum, s) => sum + s.count, 0) / steps.length) : 0;

    return {
      today: {
        sleep: todaySleep?.hours || 0,
        steps: todaySteps?.count || 0,
        energy: todayEnergy?.calories || 0,
        exercise: todayExercise?.minutes || 0,
        stand: todayStand?.hours || 0,
      },
      averages: {
        sleep: avgSleep,
        steps: avgSteps,
      },
      vitals: {
        weight: weight?.kg || null,
        restingHR: restingHR?.bpm || null,
        vo2Max: vo2Max?.value || null,
      },
      lastUpdated: sleep[0]?.date || yesterday,
    };
  } catch (err) {
    console.error('Query error:', err);
    return null;
  }
});

app.whenReady().then(() => {
  initDatabase();
  createWindow();
});

app.on('window-all-closed', () => {
  if (db) db.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
