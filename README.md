# Kinder Hospitals — Public Frontend

The public marketing site for the Kinder Medical Group (Kindorama Healthcare Pvt Ltd) — a women's & children's healthcare network with centres in Cherthala, Kochi, Bengaluru, Alappuzha, and Singapore.

Built with **Next.js 14 (App Router, plain JavaScript)**. The page is a faithful port of the approved static design (kept for reference in `design/original.html`), with all content sections driven by data from a backend API and a complete static fallback so the site renders fully even with no backend.

## How it works

- `lib/api.js` — `getContent()` fetches `${NEXT_PUBLIC_API_URL}/api/content` with ISR (`revalidate: 60`). On any error (missing env var, network failure, bad response) it returns the static fallback.
- `lib/fallback.js` — the full site content extracted from the original design: settings, stats, specialities, locations, doctors, testimonials, news, and procedures.
- `app/page.js` — server component that assembles all sections; revalidates every 60 seconds.
- `components/` — one component per section. `Header` (mobile menu + dropdowns), `Hero` (slider), `Doctors` (card slider), and `ScrollEffects` (reveal-on-scroll) are client components; the rest render on the server.

### Expected API response — `GET /api/content`

```json
{
  "settings": { "siteName": "", "tagline": "", "helplinePhone": "", "emergencyPhone": "", "email": "", "heroTitle": "", "heroSubtitle": "", "heroImageUrl": "", "logoUrl": "", "stats": [{ "label": "", "value": "" }], "announcement": "" },
  "specialities": [{ "id": 1, "name": "", "description": "", "icon": "", "imageUrl": "", "sortOrder": 0 }],
  "locations": [{ "id": 1, "name": "", "city": "", "country": "", "address": "", "phone": "", "email": "", "mapUrl": "", "imageUrl": "", "sortOrder": 0 }],
  "doctors": [{ "id": 1, "name": "", "designation": "", "speciality": "", "location": "", "bio": "", "imageUrl": "", "sortOrder": 0 }],
  "testimonials": [{ "id": 1, "patientName": "", "relation": "", "quote": "", "rating": 5, "imageUrl": "" }],
  "news": [{ "id": 1, "title": "", "slug": "", "category": "", "excerpt": "", "body": "", "imageUrl": "", "publishedAt": "" }],
  "procedures": [{ "id": 1, "name": "", "description": "", "imageUrl": "", "sortOrder": 0 }]
}
```

Any missing or empty section falls back to the bundled static content, so a partially-filled CMS never breaks the layout.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional — leave NEXT_PUBLIC_API_URL empty to use static content
npm run dev
```

Open http://localhost:3000.

Production build:

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel (framework preset: **Next.js** — auto-detected).
2. In *Project Settings → Environment Variables*, set `NEXT_PUBLIC_API_URL` to the backend base URL (e.g. `https://api.example.com`, no trailing slash). Leave it unset to serve the static fallback content.
3. Deploy. The home page uses ISR with a 60-second revalidation window, so CMS updates appear within a minute without a redeploy.

### Cloudflare in front

If Cloudflare proxies the production domain:

- Point the DNS record (proxied/orange-cloud) at the Vercel deployment per Vercel's custom-domain instructions, and set SSL/TLS mode to **Full (Strict)**.
- Avoid aggressively caching HTML at the Cloudflare edge ("Cache Everything" page rules) — Vercel's ISR already handles caching, and edge-cached HTML would delay content updates beyond the 60-second revalidation window. Caching static assets (`/_next/static/*`, images) is safe.
