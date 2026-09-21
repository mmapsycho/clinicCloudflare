# RaVida Clinic — Website

A professional, mobile-first website for a rehabilitation and physiotherapy
clinic, with a fully client-side online appointment-request flow (no backend
or accounts required). Built with TanStack Start (React 19), Tailwind CSS v4,
and shadcn/ui.

## Features

- **Online booking flow** (`/book`): multi-step form — patient details,
  service & provider preference, date/time picker (Sundays closed, past times
  disabled), notes, review step, and an on-screen confirmation with a
  reference code. Requests are stored in the browser's `localStorage` only.
- **Content pages**: Home, Services, About, FAQ, Contact (with an embedded
  OpenStreetMap map — no API key needed).
- **Responsive & accessible**: mobile navigation sheet, semantic HTML,
  per-route SEO metadata.
- **Self-contained**: all images are committed under `src/assets/`, no
  environment variables, API keys, or secrets are required.

## Prerequisites

- **Node.js 20+** (or [Bun](https://bun.sh) 1.x)
- npm (bundled with Node) — bun/pnpm/yarn also work

## Install

```sh
npm install
```

## Development

```sh
npm run dev
```

The dev server starts on <http://localhost:8080> with hot-module reload.

Other useful scripts:

| Command            | Purpose                                  |
| ------------------ | ---------------------------------------- |
| `npm run build`    | Production build (outputs to `.output/`) |
| `npm run preview`  | Serve the production build locally       |
| `npm run lint`     | ESLint                                   |
| `npm run format`   | Prettier (write)                         |

## Build & deployment

```sh
npm run build
```

This produces a self-contained server bundle in `.output/` (built with Nitro,
targeting an edge/worker-style runtime by default):

- **Cloudflare Workers / Pages** — deploy the `.output/` directory directly
  (the default build target).
- **Any Node.js host** — run `node .output/server/index.mjs` behind your
  reverse proxy.
- **Static-only hosting** — not applicable out of the box; the app uses SSR.
  A static prerender preset would need to be configured first.

No environment variables are needed to build or run the app, which is why
there is intentionally **no `.env.example`**. If you later add integrations
(analytics, a real booking backend, email), introduce a `.env` file (it is
git-ignored) and document the variables in a new `.env.example`.

> Note: the build uses the public npm package `@lovable.dev/vite-tanstack-config`
> (see `vite.config.ts`), which bundles the TanStack Start + Tailwind setup.
> It installs from the public npm registry like any other dependency — no
> Lovable account is required to clone, install, build, or run this project.

## Customizing the brand (start here)

**`src/lib/clinic.ts` is the single source of truth for business content.**
Everything displayed about the practice is defined there:

- `CLINIC.name` / `legalName` / `tagline` — the displayed brand name used by
  the header, footer, and page copy.
- `CLINIC.address`, `phoneDisplay`/`phoneHref`, `email`, `hours` — contact
  details. Several are marked `PLACEHOLDER` in comments and **must be
  replaced with verified details before going live**.
- `CLINIC.map` — OpenStreetMap embed/marker coordinates for the Contact page.
- `SERVICES` — the services shown on the site and offered in the booking form.
- `PROVIDERS`, `slotsForDate()` — booking provider options and time slots.
- `FAQS`, `WHY_CHOOSE_US` — FAQ and homepage selling points.

After renaming the business in `clinic.ts`, also update the browser tab
titles/descriptions, which live in each route's `head()` function
(`src/routes/__root.tsx`, `index.tsx`, `services.tsx`, `about.tsx`,
`contact.tsx`, `faq.tsx`, `book.tsx`). A quick global find-and-replace of the
old name covers these.

Other branding touch points:

- **Colors & fonts** — design tokens in `src/styles.css` (Tailwind v4 theme);
  font `<link>` tags in `src/routes/__root.tsx` (currently Fraunces +
  Public Sans from Google Fonts).
- **Logo icon** — the `HeartPulse` icon in `src/components/site-header.tsx`
  (and `site-footer.tsx`).
- **Favicon** — replace `public/favicon.ico`.
- **Imagery** — replace `src/assets/hero-clinic.jpg` and
  `src/assets/about-therapy.jpg` (imported by the Home and About pages).

## Project structure

```text
src/
  lib/clinic.ts            # ← all business/branding content (edit me first)
  styles.css               # design tokens (colors, fonts), Tailwind v4 theme
  routes/                  # file-based routes: /, /services, /about, /faq, /contact, /book
  components/
    booking/booking-flow.tsx  # multi-step booking form (client-side state)
    site-header.tsx, site-footer.tsx
    ui/                    # shadcn/ui components
  assets/                  # images committed with the repo
public/                    # favicon, robots.txt
```

## Data & privacy notes

- Booking requests never leave the visitor's browser; they are kept in
  `localStorage` so the confirmation survives a reload. There is no server
  persistence — wire the submit step in `src/components/booking/booking-flow.tsx`
  to a real endpoint when the clinic is ready to receive requests.
- The map is an OpenStreetMap embed; no keys or tracking scripts are included.

## License

Private — all rights reserved by the project owner.
