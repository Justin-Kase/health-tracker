# Health Widget

A beautiful, always-on-top desktop widget that displays your Apple Health data in real-time.

## Features

- 🪟 **Always on Top** - Floats above all windows
- 🎨 **Beautiful Gradient Design** - Purple gradient with frosted glass effect
- 📊 **Today's Metrics:**
  - 😴 Sleep hours
  - 👟 Steps
  - ⚡ Active energy
  - 🏋️ Exercise minutes
  - 🧍 Stand hours
- 📈 **7-Day Averages:**
  - Avg sleep
  - Avg steps
- 💓 **Vitals:**
  - Weight
  - Resting heart rate
  - VO2 Max
- 🔄 **Auto-Refresh** - Updates every 5 minutes
- 🖱️ **Draggable** - Move it anywhere on your screen

## Screenshot

```
╔═══════════════════════════╗
║  🍎 Health  Updated Feb 27║
║                           ║
║  😴 Sleep         7.5h    ║
║  👟 Steps        12,543   ║
║  ⚡ Active Energy  450 cal║
║  🏋️ Exercise      30 min  ║
║  🧍 Stand Hours    8h     ║
║                           ║
║  7-DAY AVERAGES           ║
║  ┌───────────┬───────────┐║
║  │ 😴 7.2h   │ 👟 11,234 │║
║  │ Avg Sleep │ Avg Steps │║
║  └───────────┴───────────┘║
║                           ║
║  VITALS                   ║
║  ┌───────────┬───────────┐║
║  │ ⚖️ 75 kg  │ ❤️ 62     │║
║  │ Weight    │ Resting HR│║
║  └───────────┴───────────┘║
╚═══════════════════════════╝
```

## Installation

### 1. Ensure Data Exists

The widget reads from the same SQLite database as the web dashboard. Make sure you have:

1. Uploaded at least one Apple Health export to http://localhost:3002
2. Database file exists at: `~/Documents/web_projects/health-tracker/data/health.db`

### 2. Launch Widget

```bash
cd ~/Documents/web_projects/health-tracker
npm run widget
```

The widget will appear in the **top-right corner** of your screen.

## Usage

### Move the Widget
- **Click and drag** anywhere on the widget to reposition it

### Refresh Data
- Data auto-refreshes every **5 minutes**
- Or relaunch the widget: `npm run widget`

### Close Widget
- **Cmd+Q** (macOS) or **Alt+F4** (Windows/Linux)

## Configuration

### Change Widget Position

Edit `electron/main.js`:

```javascript
// Top-right corner (default)
x: width - 340,
y: 40,

// Top-left corner
x: 20,
y: 40,

// Bottom-right corner
x: width - 340,
y: height - 520,
```

### Change Widget Size

Edit `electron/main.js`:

```javascript
width: 320,  // Make wider
height: 480, // Make taller
```

Then update `widget.html` CSS:

```css
.widget {
  width: 320px;
  height: 480px;
}
```

### Customize Colors

Edit `electron/widget.html` CSS:

```css
/* Change gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Try other gradients: */
/* Sunset */
background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);

/* Ocean */
background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);

/* Forest */
background: linear-gradient(135deg, #134e5e 0%, #71b280 100%);
```

## Build Standalone App

Create a standalone app that doesn't require terminal:

### macOS
```bash
npm run package:mac
```
Output: `dist/Health Widget.app`

### Windows
```bash
npm run package:win
```
Output: `dist/Health Widget Setup.exe`

### Linux
```bash
npm run package:linux
```
Output: `dist/Health Widget.AppImage`

The packaged app will include the database reader and can be launched like any other application.

## Troubleshooting

### "No health data found"
- Upload data to http://localhost:3002 first
- Verify database exists: `ls ~/Documents/web_projects/health-tracker/data/health.db`

### Widget doesn't show
- Check terminal for errors
- Try: `npm run widget` from project directory

### Data not updating
- Relaunch widget after uploading new health data
- Or wait up to 5 minutes for auto-refresh

### Widget won't move
- Ensure you're dragging the header area (not buttons)
- Try clicking and holding for 1 second before dragging

## Technical Details

- **Framework:** Electron
- **Database:** better-sqlite3 (reads `data/health.db`)
- **Refresh:** 5-minute interval
- **Window:** 320x480px, frameless, always-on-top
- **Memory:** ~80-120 MB

## Auto-Launch on Startup (Optional)

### macOS
1. Build standalone app: `npm run package:mac`
2. Move `Health Widget.app` to `/Applications`
3. System Settings → General → Login Items → Add `Health Widget.app`

### Windows
1. Build standalone app: `npm run package:win`
2. Create shortcut in: `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup`

### Linux
Add to autostart:
```bash
cp health-widget.desktop ~/.config/autostart/
```

## Customization Ideas

- **Add more metrics** (workouts, water intake)
- **Mini-charts** (sparklines for trends)
- **Theme switcher** (dark/light/auto)
- **Multiple sizes** (small/medium/large)
- **Transparency slider**
- **Click to open full dashboard**

---

**Your health data, always visible.** 🍎
