# Health Tracker

Comprehensive Apple Health data tracker with **24+ metrics**, **automated daily syncing**, and beautiful visualizations.

## 🎯 Features

### 📊 Core Metrics
- **😴 Sleep Analysis** - Hours slept per night with trend lines
- **👟 Daily Steps** - Step counts with daily bars
- **🏃 Distance** - Walking/running distance (km)
- **🪜 Flights Climbed** - Stairs and elevation gain
- **💪 Workouts** - Duration, calories, and activity types

### ❤️ Heart & Fitness
- **❤️ Heart Rate** - Continuous heart rate measurements
- **🫁 VO2 Max** - Cardiorespiratory fitness indicator
- **💓 Resting Heart Rate** - Daily resting HR trends
- **📊 HRV** - Heart rate variability (stress indicator)
- **⚡ Active Energy** - Calories burned from activity
- **🔥 Resting Energy** - Basal metabolic rate

### 🏋️ Activity Tracking
- **🏋️ Exercise Minutes** - Daily active minutes
- **🧍 Stand Hours** - Hourly stand goals met
- **🧘 Mindful Minutes** - Meditation and mindfulness sessions

### 🩺 Health Vitals
- **🩺 Blood Pressure** - Systolic and diastolic trends
- **⚖️ Weight** - Body weight tracking (kg)
- **📊 Body Fat %** - Body composition
- **📏 BMI** - Body mass index
- **🫀 Blood Glucose** - Blood sugar levels
- **🌡️ Body Temperature** - Temperature readings
- **🫁 Respiratory Rate** - Breaths per minute
- **💨 Oxygen Saturation** - SpO2 levels

### 🥤 Nutrition & Lifestyle
- **💧 Water Intake** - Daily hydration (ml)
- **☕ Caffeine** - Caffeine consumption (mg)

### 🔄 Automation Features
- **📱 iOS Shortcut Integration** - Auto-export from iPhone
- **💾 SQLite Database** - Persistent historical data storage
- **🔁 Auto-Sync** - Import updates without losing history
- **📅 Last Sync Tracking** - Shows when data was last updated
- **🔄 Incremental Updates** - New uploads merge with existing data

### 🎨 UI Features
- **📅 Date Filters** - View 7d / 30d / 90d / all time
- **📊 Smart Stats Cards** - Dynamic overview with key metrics
- **🎨 Beautiful Dark Theme** - Purple gradient design
- **📱 Responsive** - Works on all screen sizes
- **🔒 Privacy-First** - All processing happens locally

## 🚀 Quick Start

### 1. Install & Run

```bash
cd ~/Documents/web_projects/health-tracker
npm install
npm run dev
```

Open [http://localhost:3002](http://localhost:3002)

### 2. First Import

1. **Export from iPhone:**
   - Open Health app → Profile → "Export All Health Data"
   - Save and unzip `export.zip` to get `export.xml`

2. **Upload to Tracker:**
   - Drag `export.xml` into the upload area
   - Data is parsed and saved to local SQLite database
   - Dashboard loads automatically

### 3. Set Up Daily Automation (Optional)

See [AUTOMATION.md](./AUTOMATION.md) for detailed setup guides:

- **Option 1:** Manual daily export + upload (easiest)
- **Option 2:** iOS Shortcut + folder sync (recommended)
- **Option 3:** Fully automated server upload (advanced)

## 📂 How Data is Stored

### SQLite Database
- **Location:** `data/health.db`
- **Tables:** 18+ tables (sleep, steps, workouts, heart_rate, etc.)
- **Backups:** Not auto-backed up (manual recommended)
- **Size:** ~10-50 MB for years of data

### Data Updates
- **Upsert logic:** Daily metrics update by date
- **Additive data:** Heart rate, workouts append new records
- **No duplicates:** Smart merge prevents duplicate entries
- **History preserved:** Old data never deleted on re-import

## 🔌 API Endpoints

### POST `/api/import`
Upload Apple Health XML export file.

```bash
curl -X POST -F "file=@export.xml" http://localhost:3002/api/import
```

### GET `/api/data`
Load all health data from database.

```bash
curl http://localhost:3002/api/data
```

## 🛠 Tech Stack

- **Next.js 15** - React framework with App Router & Turbopack
- **React 19** - Latest React features
- **TypeScript 5.7** - Type safety
- **Tailwind CSS 3.4** - Utility-first styling
- **Recharts 2.15** - Beautiful, responsive charts
- **better-sqlite3** - Fast embedded database
- **xml2js** - Fast XML parsing for Apple Health exports

## 📖 Documentation

- [AUTOMATION.md](./AUTOMATION.md) - Detailed automation setup guides
- [README.md](./README.md) - This file (overview & quick start)

## 🔐 Privacy & Security

**Your data stays on your machine:**
- ✅ All processing happens locally (browser + Node.js)
- ✅ Database stored on your computer (`data/health.db`)
- ✅ No external API calls (unless you deploy)
- ✅ No telemetry or tracking
- ✅ Export files can be deleted after import

**If you deploy to production:**
- 🔒 Add authentication to `/api/import` and `/api/data`
- 🔒 Use HTTPS for all connections
- 🔒 Store database securely (Vercel Blob, Turso, etc.)

## 📊 Supported Apple Health Types

### Categories
- `HKCategoryTypeIdentifierSleepAnalysis`
- `HKCategoryTypeIdentifierAppleStandHour`
- `HKCategoryTypeIdentifierMindfulSession`

### Quantities (24+ types)
- Steps, distance, flights climbed
- Active/resting energy, exercise minutes
- Heart rate, resting HR, HRV, VO2 Max
- Blood pressure, glucose, weight, BMI, body fat %
- Respiratory rate, oxygen saturation, body temp
- Water, caffeine intake

### Workouts
- All `HKWorkout` entries with activity type, duration, energy

## 🚀 Future Enhancements

- 📊 Export filtered data to CSV
- 🎯 Goal setting and progress tracking
- 📈 Correlation analysis (sleep vs. activity)
- 🔔 Anomaly detection and alerts
- 📧 Weekly health summary reports
- 📱 PWA support for mobile
- 🌙 Light mode theme
- 📅 Custom date range picker
- 🔗 Integration with other health apps

## 🐛 Troubleshooting

### "Database is locked"
- Close any SQLite browser windows
- Restart the dev server

### "Cannot connect to /api/import"
- Ensure server is running on port 3002
- Check no firewall is blocking localhost

### "Data not showing after upload"
- Check browser console for errors
- Verify database file exists: `ls data/health.db`
- Try uploading a fresh export

## 📝 Development

```bash
# Install dependencies
npm install

# Run dev server (auto-reload on changes)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npx tsc --noEmit
```

## 🤝 Contributing

This is a personal project, but feel free to fork and customize!

Suggestions for improvements:
- Additional health metrics
- Better charts/visualizations
- Mobile app version
- Integration with wearables

---

Built with ❤️ for comprehensive health tracking

**Start tracking:** http://localhost:3002
