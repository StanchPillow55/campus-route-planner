# Video Pitch — Script + Shot List (≈75–90 seconds)

Use this as a teleprompter. Record voiceover over `docs/gallery/pitch-draft.mp4`, or screen-record the live site while reading.

**Upload target:** YouTube (unlisted is fine) → paste URL into Devpost **Video demo link**.

---

## One-line hook (say this first)

> Wildcat Mission Planner turns “I have 45 minutes before class” into an inspectable campus walking plan—drafted by an agent, finalized only when you approve.

---

## Timed script

### 0:00–0:08 · Title / problem
**On screen:** Title card — *Wildcat Mission Planner*  
**Say:**
> Between classes, students don’t need another chatbot. They need coffee, a printer, a quiet spot—and a plan that still gets them to Engineering on time.

### 0:08–0:22 · Product setup
**On screen:** App loaded — trip constraints (Student Union → Engineering, 45 min, Coffee / Printing / Study)  
**Say:**
> Wildcat Mission Planner is a WebMCP-powered campus concierge. You set the constraints in the UI. The agent doesn’t guess through buttons—it calls structured tools on the page.

### 0:22–0:45 · Agent tools in action
**On screen:** Click **Simulate agent tools** (or real WebMCP agent) — activity log fills; route card appears  
**Say:**
> It reads the trip context, searches sample campus places, drafts the fastest feasible walking route, and returns map links. Every call is visible in the Agent activity panel—so you can see exactly what happened.

### 0:45–0:65 · Human control + result
**On screen:** Route card with stops + 7 / 23 / 30 minute breakdown; click **Approve plan**  
**Say:**
> Here’s the difference that matters: the plan stays proposed until I approve it. Walking time, task time, total duration—inspect it, then finalize. No silent commits. No black box.

### 0:65–0:80 · Why WebMCP / close
**On screen:** WebMCP status + tools list / outro card  
**Say:**
> That’s real human–agent collaboration: shared state, JSON-schema tools, and student control. Wildcat Mission Planner—constraint-aware campus missions, built for WebMCP.

---

## Shot list (if you re-record yourself)

| Shot | Action | Duration |
|------|--------|----------|
| A | Title card or browser opening live URL | 5–8s |
| B | Pan trip form; show needs selected | 8–10s |
| C | Simulate agent tools / live agent run | 15–20s |
| D | Zoom route stops + time totals | 10–12s |
| E | Click Approve plan | 5–8s |
| F | Show Google/Apple Maps links + WebMCP badge | 5–8s |
| G | Outro: name + live URL + “MIT / sample data” | 5s |

---

## Recording tips

1. **1080p**, browser zoom 100–110%, hide bookmarks bar.  
2. Use the exact demo prompt from the README if you have WebMCP; otherwise Simulate is fine—say “same tool functions the agent would call.”  
3. Speak slightly slower than normal; leave 0.5s gaps between sections for cuts.  
4. End card text idea: `Wildcat Mission Planner · WebMCP · Approve before final`  
5. Description for YouTube:
   ```
   Wildcat Mission Planner — WebMCP campus concierge demo.
   Demo prompt: Student Union → Engineering in 45 minutes; need coffee, printer, quiet study; draft fastest plan; wait for approval.
   Sample campus data. MIT License.
   ```

---

## Files

| File | Use |
|------|-----|
| `docs/gallery/pitch-draft.mp4` | Assembly cut (title + demo + outro) — voiceover this |
| `docs/gallery/demo-simulate-and-approve.mp4` | Raw UI demo without titles |
| `docs/gallery/*.png` | Devpost image gallery |

After voiceover, export final MP4 → upload to YouTube → paste link on Devpost.
