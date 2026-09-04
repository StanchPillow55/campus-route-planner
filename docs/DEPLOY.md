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

This workspace may start on a private Cursor remote. For Devpost you must publish a **public** repo with the MIT `LICENSE` visible:

1. Click **Create repo** in Cursor (or create an empty public GitHub repo).  
2. Push `main`.  
3. Confirm `LICENSE` shows on the repo homepage.  
4. Paste the public HTTPS GitHub URL into Devpost.

No API keys or auth are required for the demo.
