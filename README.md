# Zenith — Productivity Workspace
```
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # static export → serves ./out (service worker only registers in production)
npm run typecheck
```
Data: IndexedDB (`zenith` / `kv` / `state`) with a localStorage backup (`zenith-backup`). Settings: `zenith-settings`.
