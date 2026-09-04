# Devpost Submission — Ready to Paste

Fill these fields on Devpost. Items marked **YOU** need a choice or URL only you can finalize.

---

## General info

### Project name
```
Wildcat Mission Planner
```

### Elevator pitch
```
WebMCP campus concierge that turns “coffee + printer + study before class” into an approve-before-final walking plan.
```

---

## Project details (public page)

### About the project

Paste the Markdown below into **About the project**:

```markdown
## Inspiration

Between classes, SJSU students constantly juggle the same scramble: grab coffee, print something, find a quiet spot, and still make it to Engineering on time. Existing maps and chatbots answer one ask at a time. They don’t hold trip constraints, show their work, or wait for a human to approve the plan.

Wildcat Mission Planner grew out of that gap—and from the idea that **WebMCP** should feel like a real product surface, not a decorative API. If an agent can call structured tools on the page, it should draft an inspectable campus mission while the student stays in control.

## Why WebMCP fits this use case

Campus missions are multi-constraint: places, minutes, and errands change together. Scraping buttons is fragile. WebMCP lets the page expose **product verbs** with JSON Schema—`get_trip_context`, `search_campus_places`, `draft_campus_route`, `get_walking_directions`—so agents act on the same state the student sees.

**People + agents together:** the student owns preferences and final approval; the agent owns search + sequencing. Tool runs are visible in the Agent activity panel. A draft never becomes final without **Approve plan**.

## What it does

A student sets:

- starting location
- destination
- available minutes
- needs (coffee, printing, food, quiet study)

An agent (or the built-in simulator) can then:

1. `get_trip_context` — read live form constraints and approval state  
2. `search_campus_places` — query a sample SJSU campus registry  
3. `draft_campus_route` — deterministically choose and order stops  
4. `get_walking_directions` — return Google Maps / Apple Maps walking links  

The UI renders an ordered route card with walking time, task time, and total duration. **Nothing is finalized until the student clicks Approve plan.**

## How we built it

- **Vite + React + TypeScript + Tailwind** for a fast, deployable front end  
- **Zustand** for shared page state agents and humans both see  
- **Static sample campus data** (10 locations) so the demo never depends on paid maps APIs or live university systems  
- **Deterministic client-side routing** using Haversine walking estimates + lowest-detour / nearest-neighbor sequencing  
- **WebMCP imperative tools** via feature detection on `document.modelContext` (with `navigator.modelContext` fallback), registered with JSON Schema inputs and structured outputs  
- An **Agent activity** panel so every tool call is visible  

## Challenges we ran into

- WebMCP support is uneven across browsers, so we needed clear capability detection, a status indicator, and a **Simulate agent tools** path that exercises the same tool functions judges can still demo without a WebMCP client.  
- Keeping agent power without losing human control: drafts must update the UI, but approval is intentionally human-only.  
- Making the routing logic believable without a maps SDK—sample coordinates and labeled “sample campus data” keep the story honest while still showing optimization.

## What we learned

WebMCP is strongest when tools map to real product verbs (`draft_campus_route`, not generic chat). Shared page state + visible execution builds trust faster than a black-box assistant. Human-in-the-loop approval is not a checkbox—it’s the product.

## What’s next

- Richer campus datasets and accessibility preferences  
- Stronger multi-stop map deep links  
- Broader WebMCP client testing (ChatGPT in-app browser, Chrome origin trial, inspector extensions)  
- Optional calendar-aware “time until class” inputs  

> Sample campus data only. Not an official SJSU product and not sourced from live university APIs.
```

### Built with (tags — pick up to 25)
```
React
TypeScript
Vite
Tailwind CSS
WebMCP
Zustand
Vercel
JavaScript
JSON Schema
Chrome
Cursor
Haversine
```

### “Try it out” links
1. **Live demo** — paste your deployed HTTPS URL (see `docs/DEPLOY.md`)  
2. **Public code repo** — paste your public GitHub URL after you click **Create repo** / push public  

---

## Project Media

### Image gallery
Upload from `docs/gallery/` (3:2 PNGs, under 5 MB):

1. `01-approved-route.png` — approved mission with times  
2. `02-full-app.png` — full app layout  
3. `03-proposed-route.png` — proposed / agent activity state  

Also copy the screen recording `docs/gallery/demo-simulate-and-approve.mp4` into your YouTube upload workflow (see video pitch).

### Video demo link
**YOU:** Upload to YouTube (unlisted or public), then paste the URL. Audio is **required**.

Ready file: `docs/gallery/demo-pitch-with-audio.mp4` (~52s, shows working UI by 0:02, narrates WebMCP + approve-before-final).  
Prefer re-recording the voiceover with your own voice using `docs/VIDEO_PITCH.md`, then upload.

---

## Additional info (judges / organizers)

### Submitter Type
**YOU:** usually `Individual` (or `Team` if applicable).

### Country of residence
**YOU:** select your country (for Bradley / SJSU: **United States**).

### Organization name
Leave blank unless submitting for an org. Optional: `San José State University` only if rules allow / you intend that.

### App Status
```
Newly created for this hackathon
```
(If the form only offers Existing / New: choose **New**.)

### If Existing…
Leave blank if New. If you must explain:
```
Built from scratch during the submission period as a focused WebMCP campus planner demo (no prior production codebase).
```

### Live URL judges can access
**Prefer a durable Vercel URL** (`docs/DEPLOY.md`). Ephemeral tunnel for smoke tests while this Cloud Agent is running:

```
https://f86e0d4d315702.lhr.life
```

Do **not** submit only the tunnel if the agent VM may sleep — deploy to Vercel and paste that production HTTPS URL. Must work in ChatGPT’s in-app browser or Chrome with WebMCP enabled.

### Testing instructions (judges only)
```
1. Open the Live URL in Google Chrome (WebMCP flag/origin trial enabled) or ChatGPT’s in-app browser.
2. Confirm the header WebMCP status: “ready” if modelContext exists, otherwise “unavailable”.
3. Defaults: Student Union → Engineering, 45 minutes, Coffee + Printing + Quiet study.
4. If WebMCP is available: paste the demo prompt from the README and let the agent call the four tools.
5. If WebMCP is unavailable: click “Simulate agent tools” — same tool functions run and update the UI.
6. Review the proposed route card (stops, walking/task/total times, map links).
7. Click “Approve plan” — status must change to Approved. Agents cannot finalize without this.
8. No login, API keys, or credentials required. Data is labeled sample campus data.
```

### URL to PUBLIC code repo
```
https://github.com/StanchPillow55/campus-route-planner
```
Confirm the repo is **public**, MIT `LICENSE` shows in About, and it opens in an incognito window. If `main` is not on GitHub yet, push from a machine with GitHub auth (see `docs/DEPLOY.md`).

### Which agent(s) or client(s) did you test your WebMCP tools with?
```
Chrome with WebMCP testing / Model Context Tool Inspector (feature detection for document.modelContext); in-app Simulate agent tools path for environments without WebMCP; Cursor Cloud Agent for build/QA.
```
Add ChatGPT in-app browser once you verify against the live URL.

### Which AI tools have you leveraged while working on this project?
```
Cursor (Cloud Agent / Composer) for scaffolding, WebMCP integration, UI, and submission packaging; Chrome WebMCP docs / Model Context tooling for API patterns.
```

### Describe the level of learning you/your team derived from the project
**Recommended selection:** `High` or `Very High` (whichever the form offers closest to “learned a lot about WebMCP + human-agent UX”).

Suggested written rationale if a text field appears:
```
Learned how to design WebMCP tools as product verbs with strict schemas, shared UI state, and explicit human approval—plus progressive enhancement when modelContext is missing.
```

### Did you gain AI value that you can use in your career?
**YOU:** typically `Yes`.

Suggested elaboration if asked:
```
Yes — shipping a constraint-aware agent UX with inspectable tools and approval gates is directly reusable for campus, workplace, and booking products.
```

---

## Pre-submit checklist (matches Devpost final reminder)

- [ ] Live HTTPS URL click-through works in ChatGPT browser or Chrome+WebMCP (**Vercel**, not only ephemeral tunnel)
- [ ] WebMCP tools verified on that live URL (or Simulate path documented + WebMCP client tested)
- [ ] Demo video on YouTube shows project working **with audio** about the build + WebMCP
- [ ] Public GitHub repo verified in an **incognito** window
- [ ] MIT `LICENSE` visible in GitHub About
- [ ] Description explains why WebMCP fits + people/agents together
- [ ] Team invites accepted (if any)
- [ ] Submission is **not** left as a draft  
