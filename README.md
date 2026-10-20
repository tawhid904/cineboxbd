# CineboxBD

![CineboxBD preview](public/preview.png)

A **SEO-optimized** movie & TV discovery website built with **Next.js 16.4** (App Router + Cache Components), **Tailwind CSS v4**, and the **TMDB API** — no dummy data anywhere: every title, poster, rating, certification and trailer is fetched live.

**Live domains:**
- Primary: <https://www.cineboxbd.bond>
- Mirror: <https://www.cineboxbd.cyou>

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16.4.0 (App Router) |
| UI | React 19.3.0 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/turbopack`) |
| Data | TMDB API (v3 key or v4 read-access token) |
| Sitemap | next-sitemap 4.x |

---

## Getting Started

### 1. Get a TMDB API key

Free at <https://www.themoviedb.org/settings/api> — a v3 API key or a v4 read access token both work.

### 2. Clone the repo

```bash
git clone https://github.com/tawhid904/cineboxbd
cd cineboxbd
```

### 3. Install dependencies

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required because Next.js 16 ships with React 19.3.0, which is newer than what some packages formally declare peer-dep support for.

### 4. Configure environment

Copy `.env.example` to `.env.local` and fill in your credentials:

```env
# Option 1: v4 read access token (preferred)
TMDB_READ_ACCESS_TOKEN=your_v4_token

# Option 2: v3 API key
TMDB_API_KEY=your_v3_key
```

### 5. Run the dev server

```bash
npm run dev
```

Opens on **http://localhost:4080**. Without credentials the site renders a setup notice instead of content.

---

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `TMDB_READ_ACCESS_TOKEN` | One of these two | TMDB v4 read-access token (Bearer auth). Preferred option. |
| `TMDB_API_KEY` | One of these two | TMDB v3 API key (query-param auth). Fallback option. |

Only one of the two variables is needed. Copy `.env.example` to `.env.local` to get started.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server on port 4080 (Turbopack) |
| `npm run build` | Production build (also runs `next-sitemap` via postbuild) |
| `npm run start` | Serve production build on port 4080 |
| `npm run lint` | ESLint |

---

## Project Structure

```
src/
├── app/                    # App Router routes
│   ├── page.js             # / — Home (hero, genre rows, trending carousels)
│   ├── movies/page.js      # /movies — Browse & filter movies
│   ├── tv/page.js          # /tv — Browse & filter TV shows
│   ├── movie/[id]/page.js  # /movie/[id] — Movie detail (cast, trailer, providers, schema)
│   ├── tv/[id]/page.js     # /tv/[id] — TV show detail (cast, trailer, providers, schema)
│   ├── trending/page.js    # /trending — Trending content + full-text search
│   ├── server-sitemap.xml/ # /server-sitemap.xml — Dynamic sitemap (API route)
│   ├── loading.js error.js not-found.js
├── components/
│   ├── layout/             # SiteHeader, PillNav, HeaderSearch, MobileNav (drawer), SiteFooter
│   ├── home/               # NowWatchingHero, ContinueWatchingRow, ExploreBar, collages, CTA
│   ├── media/              # MediaCard, PosterCard, ListCard, Carousel, ScrollShell
│   ├── browse/             # BrowseCollection, FilterToolbar, Pagination
│   ├── detail/             # DetailHero, CastRow, FactsGrid, TrailerModal, HistoryTracker
│   └── ui/                 # SectionHeading, Skeleton, EmptyState, ApiKeyNotice
├── lib/
│   ├── tmdb/               # client (cached fetch + auth), endpoints, normalizers
│   ├── images.js format.js watchlist.js cn.js
└── config/site.js          # nav, genre rows, sort maps
```

**Redirect:** `/search` → `/trending` (permanent, defined in `next.config.mjs`).

---

## SEO

CineboxBD ships with a full SEO implementation across all routes.

### Metadata

- **`metadataBase`** is set to `https://www.cineboxbd.bond` in the root layout so Next.js resolves all relative URLs in metadata to absolute ones automatically.
- **Title template** — `%s | CineboxBD` — applied to every page via the root layout.
- Every page exports a `metadata` object (or `generateMetadata` for dynamic routes) with:
  - `title`, `description`, `keywords`, `alternates.canonical`
  - `openGraph` (type, url, image, siteName)
  - `twitter` (card: `summary_large_image`, title, description, image)
- Dynamic pages (`/movie/[id]`, `/tv/[id]`) use the TMDB backdrop as the OG/Twitter image.

### JSON-LD Schema

| Page | Schema type(s) |
| --- | --- |
| Root layout (`layout.js`) | `Organization` |
| Home (`/`) | `WebSite` + `SearchAction` |
| Movie detail (`/movie/[id]`) | `Movie` + `BreadcrumbList` |
| TV show detail (`/tv/[id]`) | `TVSeries` + `BreadcrumbList` |

All schema is injected as inline `<script type="application/ld+json">` tags using `dangerouslySetInnerHTML` for full SSR compatibility. Data is sourced exclusively from TMDB API responses — nothing is fabricated.

### Sitemap

Run `npm run build` — the `postbuild` hook automatically runs `next-sitemap`, generating:

- `public/sitemap.xml` — static routes (`/`, `/movies`, `/tv`, `/trending`)
- `public/robots.txt` — crawl policies

A **dynamic sitemap** at `/server-sitemap.xml` fetches popular movies and TV shows from TMDB at request time and returns live URLs for `/movie/[id]` and `/tv/[id]` pages.

After deploying, submit both sitemaps to **Google Search Console**:

```
https://www.cineboxbd.bond/sitemap.xml
https://www.cineboxbd.bond/server-sitemap.xml
```

### Accessibility / Core Web Vitals

- Viewport allows user scaling (`width=device-width, initialScale=1`) — no `userScalable=false`.
- `robots` meta: `index: true, follow: true` for all content pages.

---

## Build & Deploy

```bash
# Production build (also generates sitemap.xml + robots.txt via postbuild)
npm run build

# Serve the production build
npm start
```

After deploying, submit the two sitemap URLs above to Google Search Console.

---

## Key Decisions

- **Data fetching:** all reads happen in Server Components through `'use cache'` functions (`cacheLife`/`cacheTag` — the Next 16 Cache Components model), deduplicated with `Promise.all`.
- **Auth:** works with either a v3 `api_key` or a v4 `Authorization: Bearer` token.
- **Images:** `next/image` with `remotePatterns` for the image CDN, responsive `sizes`, `preload` on hero/detail backdrops.
- **State:** only interactive islands are client components (carousels, filters, search overlay, trailer modal, mobile drawer). "Continue Watching" uses real `localStorage` history — no fabricated entries.
- **Design:** dark cinema palette (near-black + single red accent + gold ratings), Archivo / Archivo Black / Geist Mono typography; gradients used **only** as legibility scrims over photos.
- **Branding:** the public UI is provider-neutral — no data-source branding is rendered anywhere in the frontend.

---

## Branding & Attribution (owner note)

The rendered frontend intentionally contains no provider branding. Per TMDB's API terms, the required attribution is kept here (in docs, not in the UI) so you can decide where it belongs:

> This product uses the TMDB API but is not endorsed or certified by TMDB.
