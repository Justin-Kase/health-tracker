# Automated Daily Health Sync

## Overview

This system enables **automated daily health data syncing** from your iPhone to the Health Tracker dashboard.

## Architecture

1. **iOS Shortcut** - Exports health data daily via automation
2. **SQLite Database** - Stores all historical health metrics
3. **API Endpoints** - Import new data and load existing data
4. **Auto-Load UI** - Dashboard automatically loads from database on page load

## Setup: iOS Shortcut for Daily Export

### Option 1: Manual Daily Sync (Recommended to Start)

1. **Create a Shortcut:**
   - Open **Shortcuts** app on iPhone
   - Tap **+** to create new shortcut
   - Name it "Export Health Data"

2. **Add Actions:**
   ```
   1. Export Health Data
      → Save to: iCloud Drive/HealthExports/
      → File name: health-export-[Current Date].zip
   
   2. Get File from iCloud Drive
      → Path: iCloud Drive/HealthExports/health-export-[Current Date].zip
   
   3. Extract Archive
      → Show Document Picker: Off
   
   4. Share
      → Via: Airdrop / Messages / Email
      → To: Your Mac
   ```

3. **Run Daily:**
   - Tap the shortcut each morning
   - Airdrop the `export.xml` to your Mac
   - Upload it to http://localhost:3002

### Option 2: Automated Sync with Server Upload (Advanced)

**Requirements:**
- Your Mac must be accessible from your iPhone (same network)
- Health Tracker server must be running on Mac

1. **Expose Your Mac Server:**
   ```bash
   # Run on your Mac
   cd ~/Documents/web_projects/health-tracker
   npm run dev -- --hostname 0.0.0.0
   ```

2. **Get Your Mac's Local IP:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   # Example: 192.168.1.100
   ```

3. **Create Automated Shortcut:**
   ```
   1. Export Health Data
   2. Extract Archive → Get export.xml
   3. Get Contents of File (export.xml)
   4. Get Text from Input
   5. URL: http://192.168.1.100:3002/api/import
   6. Get Contents of URL
      → Method: POST
      → Headers: Content-Type: multipart/form-data
      → Request Body: Form
      → Add field: file=[Shortcut Input]
   7. Show Notification: "Health data synced!"
   ```

4. **Automate:**
   - Go to **Automation** tab in Shortcuts
   - Tap **+** → Create Personal Automation
   - Choose **Time of Day** → 8:00 AM daily
   - Add your "Export Health Data" shortcut
   - Turn off "Ask Before Running"

### Option 3: iOS Shortcut + Dropbox/iCloud Sync (Easiest for Testing)

1. **iPhone:** Export health data to iCloud Drive daily (via Shortcut)
2. **Mac:** Watch folder for new exports:
   ```bash
   # Create watcher script
   cat > ~/Documents/web_projects/health-tracker/watch-imports.sh << 'EOF'
   #!/bin/bash
   WATCH_DIR="$HOME/Library/Mobile Documents/com~apple~CloudDocs/HealthExports"
   UPLOAD_URL="http://localhost:3002/api/import"
   
   fswatch -o "$WATCH_DIR" | while read; do
     LATEST=$(ls -t "$WATCH_DIR"/*.xml 2>/dev/null | head -1)
     if [ -n "$LATEST" ]; then
       echo "Uploading: $LATEST"
       curl -X POST -F "file=@$LATEST" "$UPLOAD_URL"
     fi
   done
   EOF
   
   chmod +x ~/Documents/web_projects/health-tracker/watch-imports.sh
   ```

3. **Run the watcher:**
   ```bash
   brew install fswatch  # if not installed
   ~/Documents/web_projects/health-tracker/watch-imports.sh
   ```

## Usage

### First Import

1. Export your health data from iPhone (Health app → Profile → Export)
2. Upload `export.xml` to http://localhost:3002
3. Data is parsed and saved to SQLite database (`data/health.db`)

### Subsequent Imports

- Upload new exports anytime
- Existing records are updated (upserted by date)
- Heart rate and workouts are additive
- Dashboard automatically shows latest data on page load

### View Dashboard

- Visit http://localhost:3002
- Data loads automatically from database
- No re-upload needed unless adding new data
- Last sync date shown in header

## Database Location

```
~/Documents/web_projects/health-tracker/data/health.db
```

**Backup:**
```bash
cp ~/Documents/web_projects/health-tracker/data/health.db \
   ~/Documents/web_projects/health-tracker/data/health-backup-$(date +%Y%m%d).db
```

## API Endpoints

### POST /api/import
Upload and import health export XML file.

**Request:**
```bash
curl -X POST -F "file=@export.xml" http://localhost:3002/api/import
```

**Response:**
```json
{
  "success": true,
  "syncId": 5,
  "message": "Health data imported successfully"
}
```

### GET /api/data
Load all health data from database.

**Request:**
```bash
curl http://localhost:3002/api/data
```

**Response:**
```json
{
  "data": {
    "sleep": [...],
    "steps": [...],
    "heartRate": [...]
  },
  "lastSync": "2026-02-27"
}
```

## Troubleshooting

### "Cannot connect to server"
- Ensure dev server is running: `npm run dev`
- Check firewall allows local connections
- Verify Mac IP address hasn't changed

### "Database locked"
- Close any SQLite browser/editor windows
- Restart the dev server

### "Shortcut not running automatically"
- Check iPhone Settings → Shortcuts → Allow Running Scripts
- Ensure automation is enabled and "Ask Before Running" is OFF
- Check Low Power Mode isn't blocking automations

## Production Deployment

For always-on syncing:

1. **Deploy to Vercel/Fly.io** (with persistent database)
2. **Use Vercel Blob Storage** for SQLite persistence
3. **Secure API** with authentication token
4. **Update Shortcut** with production URL

## Data Privacy

- All data stored locally in SQLite (no cloud by default)
- API endpoints are localhost-only unless deployed
- Export files can be deleted after import
- Database is NOT included in git (see `.gitignore`)

## Next Steps

1. Test manual upload first
2. Set up daily iPhone Shortcut
3. Optionally automate with folder watcher
4. Consider deploying for remote access

---

**Your data stays on your devices.** Only you have access unless you choose to deploy publicly.
