# Final submission checklist (hackathon reminder)

Use this before you click **Submit**. Do not leave the Devpost entry as a **draft**.

## Required reminders

| # | Requirement | Status in this repo | What you must do |
|---|-------------|---------------------|------------------|
| 1 | **Live HTTPS URL** works in ChatGPT in-app browser or Chrome + WebMCP | App is Vercel-ready (`docs/DEPLOY.md`) | Deploy production URL, click through it yourself, paste into Devpost |
| 2 | **WebMCP tools verified** in ChatGPT browser or Chrome with WebMCP | Tools registered + Simulate fallback | On live URL: enable WebMCP / open in ChatGPT browser; run demo prompt; confirm tool calls |
| 3 | **Demo video** shows project working + **has audio** covering build + WebMCP | `docs/gallery/demo-pitch-with-audio.mp4` (~52s, narrated) | Upload to YouTube (unlisted OK); paste URL; prefer re-recording with **your** voice |
| 4 | **Public code repo** (test in incognito) | MIT `LICENSE` at root | Click **Create repo** / push public GitHub; open repo in incognito; paste URL |
| 5 | **Open-source license** visible in About | `LICENSE` (MIT) present | Confirm GitHub shows license badge in About |
| 6 | **Description** explains why WebMCP fits + people+agents together | `docs/SUBMISSION.md` About section | Paste/edit so it sounds like you; keep WebMCP rationale |
| 7 | **Team members** invited/accepted | N/A if solo | Add teammates on Devpost if any |
| 8 | **Not saved as draft** | — | Click final Submit |

## Demo video tips (applied)

- Under 3 minutes (ours is ~52 seconds)
- Working UI by ~0:02 (after 2s title)
- No signup / login
- Audio required — included (TTS draft); **re-narrate with your voice before upload if you can**
- Script: `docs/VIDEO_PITCH.md`

## Judge smoke test (copy into Devpost testing field)

```
1. Open Live URL in Chrome (WebMCP enabled) or ChatGPT in-app browser.
2. No login. Defaults: Student Union → Engineering, 45 min, Coffee + Printing + Quiet study.
3. With WebMCP: paste README demo prompt and confirm the four tools run.
4. Without WebMCP: click “Simulate agent tools” (same functions).
5. Confirm route card times + map links, then click Approve plan.
6. Sample campus data only; MIT licensed.
```

## You still owe Devpost these URLs

1. Live demo HTTPS  
2. Public GitHub HTTPS  
3. YouTube demo video  

Until those three are pasted and verified, the submission is not complete—even if the code is ready.
