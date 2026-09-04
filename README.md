# Mission Planner

A **WebMCP-powered campus concierge** for SJSU students. Enter trip constraints (start, destination, available minutes, errands). An AI agent inspects context, searches sample campus places, drafts an optimized walking route, and returns map links — while **you** keep approval control.

> Sample campus data only. Not affiliated with San José State University live systems.

**Elevator pitch:** WebMCP campus concierge that turns “coffee + printer + study before class” into an approve-before-final walking plan.

## Why WebMCP

Instead of guessing through form fields, agents call explicit JSON-schema tools that execute visibly in the page and update shared UI state:

| Tool | Purpose |
|------|---------|
| `get_trip_context` | Read current constraints + approval status |
| `search_campus_places` | Query the static campus registry |
| `draft_campus_route` | Deterministic route draft (**proposed only**) |
| `get_walking_directions` | Google Maps / Apple Maps walking links |

Routes stay **proposed** until the human clicks **Approve plan**.

## Quick start

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

```bash
npm run build
npm run preview
```

- Deploy: [`docs/DEPLOY.md`](./docs/DEPLOY.md)  
- Devpost paste pack: [`docs/SUBMISSION.md`](./docs/SUBMISSION.md)  
- Final checklist: [`docs/FINAL_CHECKLIST.md`](./docs/FINAL_CHECKLIST.md)  
- Pitch script + narrated MP4: [`docs/VIDEO_PITCH.md`](./docs/VIDEO_PITCH.md) · `docs/gallery/demo-pitch-with-audio.mp4`

## Judge testing (2 minutes)

1. Open the **live HTTPS URL** (or local dev server).
2. Defaults should be Student Union → Engineering, **45 minutes**, needs: Coffee + Printing + Quiet study.
3. Prefer Chrome with WebMCP enabled (`chrome://flags/#enable-webmcp-testing`) or ChatGPT’s in-app browser.
4. **With WebMCP:** paste the demo prompt below and let the agent call the four tools.
5. **Without WebMCP:** click **Simulate agent tools** (same tool functions; UI still updates).
6. Confirm the route card shows ordered stops, walking / task / total times, and map links.
7. Click **Approve plan** — status becomes Approved. Agents cannot finalize without this step.
8. No login or API keys required.

### Demo prompt

> I’m starting at the Student Union and need to reach Engineering in 45 minutes. I need coffee, a printer, and a quiet place to study. Use the campus tools to draft the fastest feasible walking plan. Show me the total time and wait for my approval before finalizing it.

## WebMCP in Chrome

1. Enable `chrome://flags/#enable-webmcp-testing` (or join the origin trial).
2. Relaunch Chrome and open this app over **HTTPS** (or localhost).
3. Use a WebMCP-capable agent / Model Context Tool Inspector.
4. The header shows whether `document.modelContext` (or deprecated `navigator.modelContext`) is available.

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
docs/
  SUBMISSION.md           # Devpost answers ready to paste
  VIDEO_PITCH.md          # 75–90s pitch script + shot list
  DEPLOY.md               # Vercel / public repo steps
  gallery/                # Devpost images + pitch draft video
```

## License

MIT — see [LICENSE](./LICENSE).
