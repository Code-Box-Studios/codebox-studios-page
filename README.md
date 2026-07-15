# Code Box Studios — Landing Site

Marketing site for Code Box Studios, built with **Next.js 15 (App Router)** and **Payload CMS 3**,
so the whole page is editable without touching code. Ships with **three switchable visual
directions** — you pick the active one in the CMS.

- **Editorial White** — austere light canvas, monumental type, unframed rows
- **Command** — deep-green / navy bands, a code console hero, high contrast
- **Modular Stone** — warm stone surfaces, navy accents, a building-block bento grid

The content is identical across all three; only the visual treatment changes.

## Stack

| Concern       | Choice                                             |
| ------------- | -------------------------------------------------- |
| Framework     | Next.js 15.4 (App Router, React Server Components)  |
| CMS / backend | Payload CMS 3.86 (embedded in Next.js)             |
| Database      | SQLite (`@payloadcms/db-sqlite`) — zero-config dev |
| Styling       | Tailwind CSS v4 with design-token CSS variables    |
| UI primitives | Radix UI (shadcn-style components), lucide icons   |
| Language      | TypeScript                                         |

## Getting started

```bash
pnpm install
cp .env.example .env        # then set a real PAYLOAD_SECRET
pnpm seed                   # creates the admin user + loads all content
pnpm dev                    # http://localhost:3000
```

- **Site:** http://localhost:3000
- **Admin:** http://localhost:3000/admin

The seed creates an admin user (override with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`):

```
admin@codeboxstudios.com / changeme-123   ← change this after first login
```

## Switching the theme

In the admin, open **Site Settings → Brand & Theme → Theme** and choose a direction. The whole
site re-renders in that style on next load.

To preview a direction without changing the saved setting, append `?theme=` to any URL:

```
/?theme=editorial   /?theme=command   /?theme=stone
```

## Editing content

Everything on the page is CMS-driven. Two globals hold it all:

- **Landing Page** — every section, organised into tabs: Hero, Trust, Services, Capabilities,
  Process, Portfolio, Engagement, About, Testimonials, FAQ, Contact. Add/remove/reorder items
  within each section.
- **Site Settings** — theme, brand name, announcement bar, header nav & CTAs, footer, SEO.

Two inboxes capture form submissions:

- **Inquiries** — the contact form ("Start a project").
- **Subscribers** — the footer newsletter signups.

> Email delivery is not configured — submissions are stored in the CMS. To also send emails, add a
> Payload [email adapter](https://payloadcms.com/docs/email/overview).

## How theming works

Semantic design tokens are declared once in [`globals.css`](<src/app/(frontend)/globals.css>) and
remapped per direction under `[data-theme="…"]`. Tailwind utilities (`bg-surface`, `text-ink`,
`border-line`, …) read the live CSS variables, so a single `data-theme` on the page root restyles
everything.

Sections whose **layout** differs between directions (Hero, Services, Capabilities) dispatch to a
per-theme variant component; sections that differ only in **color** are a single token-driven
component.

## Project structure

```
src/
  app/(frontend)/        landing page, layout, globals.css, server actions, favicon
  app/(payload)/         Payload admin + REST/GraphQL routes (generated)
  collections/           Users, Media, ContactSubmissions, Subscribers
  globals/               SiteSettings, LandingContent
  components/
    chrome/              announcement, header, footer, newsletter form
    sections/            one folder/file per section (hero/services/capabilities have variants)
    ui/                  button, select, accordion, input, textarea, label, arrow-link
    logo.tsx             brand mark (themeable SVG)
  lib/                   data access, theme constants, fonts, media + cn helpers
  seed/                  idempotent seed (content + admin user)
```

## Production notes

- Build: `pnpm build` then `pnpm start`.
- **Database:** SQLite is great for local dev. For production, switch to Postgres
  (`@payloadcms/db-postgres`) or keep SQLite on a persistent volume, and set `DATABASE_URI`.
- Set a strong `PAYLOAD_SECRET` and a real admin password.
- Uploaded media is stored on the local filesystem by default; use a storage adapter (S3, etc.)
  for a serverless deploy.
