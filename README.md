# FarmTrack 🌱

**Farm records & money for Nigerian farmers** — track crops, inventory, sales
and profit in plain language, with naira-first formatting.

Part of the SaaS-builder project (financial inventory).

## Run it

No build step, no dependencies — plain HTML/CSS/JS:

```
open index.html        # landing page — or just double-click it
```

## App map

| Page | What it does |
|---|---|
| `index.html` | Marketing landing with live demo dashboard |
| `login.html` | Phone-number + OTP sign-in (demo: any code works) |
| `app/index.html` | **Dashboard** — stat tiles, cashflow chart, sales by crop, activity feed, quick record-sale |
| `app/inventory.html` | **Inventory** — category filters, search, stock adjust (±), add items |
| `app/sales.html` | **Sales & expenses** — money in / money out tabs, month filter, record forms |
| `app/reports.html` | **Season report** — profit by month, expense breakdown, loan-ready printable statement |
| `app/settings.html` | **Settings** — farm profile, language (EN/Pidgin/Hausa/Yorùbá/Igbo), theme, data export/reset |

Shared design system lives in `assets/farmtrack.css`; the runtime
(`assets/farmtrack.js`) provides theming, the sidebar shell, SVG chart
builders (line / bars / columns with hover tooltips), and a localStorage
data layer — sales and expenses you record flow across every page and
survive reloads, offline.

## Design notes

- Deep-green / harvest-gold brand with an adire-inspired pattern band
- Light & dark mode: follows the system theme, manual override persisted
- Chart palette validated for colorblind safety and surface contrast in both modes
- Fully responsive — sidebar collapses to a top nav strip on mobile
