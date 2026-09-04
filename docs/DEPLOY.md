# Deploy the live demo (required for judges)

Judges need a **durable HTTPS** URL that works in ChatGPT’s in-app browser or Chrome with WebMCP.

> Ephemeral tunnels (localhost.run / Cloudflare) are fine for your own smoke test while developing. **Do not rely on them for Devpost** — deploy to Vercel (or Netlify) before the deadline.

## Option A — Vercel (recommended)

```bash
npm install
npm run build
npx vercel --prod
```

Dashboard settings if linking Git:

- **Framework:** Vite  
- **Build command:** `npm run build`  
- **Output directory:** `dist`  
- **Install command:** `npm install`

Copy the production URL into Devpost **Live URL**.

## Option B — Netlify

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

## After deploy

1. Open the HTTPS URL in Chrome.  
2. Click **Simulate agent tools** and confirm a route appears.  
3. Click **Approve plan**.  
4. Paste the URL into `docs/SUBMISSION.md` / Devpost.  
5. Optionally re-test with WebMCP enabled (`chrome://flags/#enable-webmcp-testing`).

## Public GitHub repo

Canonical GitHub remote for Devpost:

```
https://github.com/StanchPillow55/campus-route-planner
```

If this Cloud Agent workspace could not push (no GitHub credentials), run on your machine after Origin clone:

```bash
origin repo clone bradley-haraguchi/campus-route-planner
cd campus-route-planner
git remote add github https://github.com/StanchPillow55/campus-route-planner.git
# or: git remote set-url --add --push origin https://github.com/StanchPillow55/campus-route-planner.git
git push -u github main
```

Then set the GitHub repo to **Public**, confirm MIT `LICENSE` in About, and open the URL in an incognito window.

This workspace may also track Origin separately (`origin` remote). Keep both if you want Cloud Agent + GitHub.
