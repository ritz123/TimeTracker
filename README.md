# Weekly Work Tracker

A desktop app for tracking weekly work items and achievements, built with Electron + React + Tailwind CSS.

## Quick Start (fresh clone)

```bash
./setup.sh     # install all dependencies
./start.sh     # install (if needed) + launch the Electron app
```

Or manually:

```bash
npm install
npm start        # build + launch (no server, fully offline)
```

## Development (with hot-reload)

```bash
npm run dev      # Vite dev server + Electron with live reload
```

The dev server is only used here for hot-reload during development. The app itself
never uses a server -- all data is read/written directly via Node.js `fs` and
Electron IPC.

## Other Commands

```bash
npm run build    # build the frontend to dist/
npm run launch   # launch Electron from an existing dist/ build
```

## How It Works

- **Weekly calendar** shows Mon-Sun with day columns
- Click **+ Add** on any day to create a work item
- Click a card to **edit** it; hover and click X to **delete**
- Navigate weeks with the arrow buttons or jump to **Today**
- Click **Export Markdown** to generate a `.md` weekly report

## Data Storage

- **Electron**: `~/.weekly-tracker/data.json`
- **Browser**: `localStorage`

## Tech Stack

- Electron (desktop shell)
- React 19 + Vite
- Tailwind CSS 3
- date-fns (date calculations)
