# Wildcat Mission Planner

A WebMCP-powered campus concierge demo for SJSU students. Enter trip constraints (start, destination, available minutes, errands). An AI agent can inspect context, search sample campus places, draft an optimized walking route, and return map links — while **you** keep approval control.

> Sample campus data only. Not affiliated with San José State University live systems.

## Why WebMCP

Instead of guessing through form fields, agents call explicit JSON-schema tools that execute visibly in the page and update shared UI state:

| Tool | Purpose |
|------|---------|
| `get_trip_context` | Read current constraints + approval status |
| `search_campus_places` | Query the static campus registry |
| `draft_campus_route` | Deterministic route draft (proposed only) |
| `get_walking_directions` | Google Maps / Apple Maps walking links |

Routes stay **proposed** until the human clicks **Approve plan**.

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL (default [http://127.0.0.1:43123](http://127.0.0.1:43123)).

```bash
npm run build    # production build
npm run preview  # preview the build
```

## Deploy to Vercel

This is a standard Vite app (`dist` output).

```bash
npm i -g vercel
vercel
```

Or connect the Git repo in the Vercel dashboard — build command `npm run build`, output directory `dist`.

## WebMCP in Chrome

1. Enable `chrome://flags/#enable-webmcp-testing` (or join the origin trial).
2. Relaunch Chrome and open this app over HTTPS (or localhost).
3. Use a WebMCP-capable agent / Model Context Tool Inspector to call the registered tools.
4. The header status indicator shows whether `document.modelContext` (or the deprecated `navigator.modelContext` fallback) is available.

If WebMCP is unavailable, use **Simulate agent tools** in the Agent activity panel to exercise the same logic.

## Demo prompt

Paste this into a WebMCP-capable agent while the app is open:

> I’m starting at the Student Union and need to reach Engineering in 45 minutes. I need coffee, a printer, and a quiet place to study. Use the campus tools to draft the fastest feasible walking plan. Show me the total time and wait for my approval before finalizing it.

## How routing works

Client-side, deterministic logic (no maps API):

1. Resolve start + destination from the form.
2. For each selected need, pick the unused place that minimizes detour + a light task-time penalty.
3. Order errands with nearest-neighbor toward the destination.
4. Estimate walking time via Haversine distance at ~80 m/min plus per-stop task minutes.

## Project layout

```
src/
  data/campus.ts          # 10 sample SJSU locations
  lib/routing.ts          # walking + draft logic
  lib/webmcp.ts           # feature detection + types
  lib/registerTools.ts    # four WebMCP tools
  store/tripStore.ts      # shared UI / agent state
  components/             # form, registry, route card, activity
```

## License

MIT — see [LICENSE](./LICENSE).
