# CoGig — Web App Demo (SIH PS26089)

A real, working web app for the customer and cooperative-admin flows. WhatsApp
is intentionally left out for now (per your instruction) — the worker side is
represented here as a dashboard you view via a picker, no login, matching the
"worker's phone number is their identity" design from the WhatsApp plan.

## What's built

- **Role Selector** -> Customer or Cooperative Admin
- **Customer flow:** Sign Up/Login -> OTP -> Select Category (Household /
  Community -- matches the PS title directly) -> Select Service (icon grid) ->
  Post Requirement form -> lands on the RWA Dashboard
- **Cooperative Admin flow:** Login -> Cooperative Admin Dashboard
- **Worker Dashboard:** reachable directly at `/#/worker/dashboard`, with a
  picker to switch between workers (stands in for "no login needed" until
  WhatsApp is wired back in)
- All three dashboards **read live data from Supabase** if configured, and
  fall back to realistic demo data if not -- so the app never looks broken,
  with or without a backend connected.

## Design notes

- Font: **Plus Jakarta Sans** (loaded via Google Fonts -- works in any
  deployed browser; substituted in for the unspecified "Sansians" reference)
- Icons: **Hugeicons** (`@hugeicons/react`) for UI icons, **Morphicons**
  (`morphicons/react`) for animated icon states on the Worker Dashboard, and
  **thesvg.org** for brand logos (WhatsApp, UPI, PhonePe). Keyline Icons are
  not published on npm, so Hugeicons covers that role
- Motion: **Motion** (`motion/react`, the current name for Framer Motion) --
  used for page transitions and tap feedback only, kept subtle per good UI
  practice (no animation for its own sake)
- Palette: deep ink + warm paper base, with **marigold** as the Household
  Services accent and **indigo** as the Community Services accent -- the two
  colors are a deliberate device tying the visual system to the PS title's
  two service categories, not decoration

## Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Works immediately with demo data -- no
Supabase setup required to look at and click through the app.

## Connect it to real data (optional)

1. Copy `.env.example` to `.env`
2. Fill in your Supabase project's `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` (Project Settings -> API)
3. Run the `database/schema.sql` from your earlier CoGig project (same
   schema -- this app queries the same tables: `contracts`,
   `cooperative_society`, `users`, `escrow_ledger`, `disputes`,
   `contract_workers`)
4. Restart `npm run dev` -- the demo-data banners disappear once live data
   loads successfully

## Deploy for your pitch (free)

**Vercel (recommended, easiest):**
```bash
npm run build
```
Then drag the generated `dist/` folder onto vercel.com's deploy page, or
connect your GitHub repo and let Vercel build it automatically. If you set
the Supabase env vars, add them in Vercel's Project Settings -> Environment
Variables before deploying.

**Netlify:** same idea -- drag `dist/` onto netlify.com, or connect the repo.

The app uses a hash-based router (`/#/...`), so it works correctly on any
static host with zero server configuration -- no redirect rules needed.

## What's intentionally not here yet

- WhatsApp integration (you asked to defer this) -- the backend webhook code
  and Twilio setup from the earlier phase of this project still apply
  unchanged when you're ready to wire it back in
- Real OTP verification (the OTP screen accepts any 6 digits -- swap in a
  real SMS/OTP provider when ready)
- Real authentication/session persistence for Customer and Cooperative Admin
  logins (currently these just navigate forward on submit -- add Supabase
  Auth or similar when ready for production)

## New: Smart Automation, Emergency Dispatch, Interactive Map (v2 — repositioned per UX review)

Feature placement was revised after review — here's where everything actually lives now:

- **Demand Forecasting card** — moved to the **Cooperative Admin Dashboard**
  (`/coop-admin/dashboard`). Reasoning: forecasting future demand is a supply-planning
  decision the cooperative acts on (which workers to keep on standby), not something an
  individual RWA client needs to see. Mock seasonal chart, same as before
  (`src/components/DemandForecastCard.jsx`).
- **Workforce Allocation card** — no longer shown by default on any dashboard. It now opens
  in a **modal** on the RWA Dashboard when the client clicks **"Hire a Worker"** — i.e. it
  appears exactly at the moment it's decision-relevant (choosing a cooperative for a new
  job), not as permanent dashboard clutter (`src/components/WorkforceAllocationCard.jsx`,
  wired into `src/pages/RwaDashboard.jsx` via the shared `Modal` component).
- **Emergency Dispatch** — redesigned from a full-width banner into a **normal-sized red
  action button** sitting next to "Hire a Worker" on the RWA Dashboard. Clicking it opens the
  same emergency-type-selection flow as before, in a modal (`src/components/
  EmergencyDispatch.jsx`).
- **Coverage Map** — moved to the **Cooperative Admin Dashboard**. There's no separate
  Federation Admin view built yet (per the current scope), so per the requested fallback it
  lives on the Cooperative Admin Dashboard instead — this is where "which cooperatives cover
  which area" is actually someone's job to monitor, not the individual client's.

### The geo-spatial element was repurposed on the RWA/client side into two focused tools instead of one big map:

- **Address Serviceability Map** (`src/components/AddressServiceabilityMap.jsx`) — appears
  inline in the **Post Requirement** booking form the moment the client types an address. It
  shows a small map with the typed location and the nearest cooperative's service-radius
  circle, plus a green/red confirmation strip ("✓ Serviceable by Shanti Labour Cooperative
  (2.3km)" or a not-serviceable warning). **Note:** address-to-coordinates is mocked to a
  fixed demo point near Patna — a real version needs an actual geocoding API call on the
  typed address.
- **Live Tracking Map** (`src/components/LiveTrackingMap.jsx`) — appears inside the Emergency
  Dispatch modal once a worker is "alerted," showing a pulsing worker marker animating along
  a dashed route toward the job site, with a live-updating ETA countdown. **Note:** the
  worker's movement is simulated locally (advances every 1.5s) — a real version would poll
  the worker's actual GPS position (e.g. shared from the WhatsApp bot or a driver app) on an
  interval instead.

Shared Leaflet marker/icon setup was extracted into `src/lib/leafletSetup.js` so all three
map components (Coverage, Serviceability, Live Tracking) stay visually consistent and avoid
duplicating the Vite/Leaflet marker-icon workaround three times.

## Multilingual support (English, Hindi, Kannada)

A globe icon in the top-right of every screen opens a language switcher. The choice persists
across visits (saved in the browser's localStorage) and instantly re-renders the entire app —
labels, form fields, table headers, status badges, dashboard content, all of it.

- **Translation dictionaries:** `src/lib/i18n/translations.js` — one flat key-value object per
  language. Add a new language by adding a new top-level key here and adding it to the
  `LANGUAGES` array in the same file.
- **How pages use it:** `const { t } = useTranslation()` then `t('someKey')` anywhere text is
  rendered. See any file in `src/pages/` for the pattern.
- **What's translated:** every static UI string across all 10 pages, table headers, status
  pill labels (e.g. `PENDING_APPROVAL` → "Pending" / "लंबित" / "ಬಾಕಿ"), the service/category
  catalog, and the Smart Automation / Emergency Dispatch / Coverage Map features.
- **What's intentionally NOT translated:** user-entered data (names, addresses, notes the
  person types in) and the brand name "CoGig" — these are content, not UI chrome.
- **Honesty note:** the Hindi and Kannada translations were written directly for this app
  (not machine-translated from a placeholder) but have not been reviewed by a native speaker
  yet — worth a quick proofread pass by a fluent speaker before a real pitch if precision
  matters for your audience.

## Worker Dashboard (`src/pages/WorkerDashboard.jsx`)

Built from `DESIGN.md` (blue-600 / emerald-500 / slate tokens, 48px tap
targets). It is intentionally a different look from the other pages, which
still use the ink / marigold / indigo palette.

- English, Hindi and Kannada. Nav labels reuse existing keys; the rest live in
  a `COPY` object in the file. Have native speakers review Hindi and Kannada.
- Reads today's `contracts` from Supabase when configured, otherwise shows
  demo data with a banner. Not yet filtered to the signed-in worker: add that
  where the file says `WORKER FILTER` once the `contract_workers` columns are
  known. Weekly totals are still demo values.
- "Sansians" and "trnsition.dev" could not be found as public libraries, so
  the components and transition classes are local (`Button`, `Card`, `Badge`,
  `Avatar` and the `trn` object at the top of the file).
- After pulling this change run `npm install` (not `npm ci`) so
  `package-lock.json` picks up `morphicons`.
