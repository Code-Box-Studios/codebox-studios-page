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
| Database      | Postgres (`@payloadcms/db-postgres`) — every environment |
| Styling       | Tailwind CSS v4 with design-token CSS variables    |
| UI primitives | Radix UI (shadcn-style components), lucide icons   |
| Language      | TypeScript                                         |

## Getting started

The app uses Postgres in every environment. For local dev, the quickest DB is Docker:

```bash
docker run -d --name codebox-pg -e POSTGRES_PASSWORD=codebox -e POSTGRES_DB=codebox -p 5432:5432 postgres:16

pnpm install
cp .env.example .env        # DATABASE_URI is already set for the Docker DB above; set a real PAYLOAD_SECRET
pnpm seed                   # creates the schema, admin user, and all content
pnpm dev                    # http://localhost:3000
```

(No Docker? Point `DATABASE_URI` at any Postgres — e.g. a free Neon database — instead.)

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

## Database

The app is **Postgres-only** (`@payloadcms/db-postgres`), configured via `DATABASE_URI`. SQLite was
dropped because its native driver (`libsql`) can't be bundled onto serverless hosts like Vercel — so
the same database engine is used locally and in production. Any Postgres works: local Docker, Neon,
Supabase, RDS, etc.

## Deploying to Vercel

Vercel's filesystem is read-only, so the app needs a hosted Postgres. [Neon](https://neon.tech)
has a free tier and integrates with Vercel:

1. **Create the database.** In Vercel → your project → **Storage → Create Database → Postgres
   (Neon)**. It provisions the DB and adds connection env vars to the project. (Or create a Neon
   project directly and copy its connection string.)
2. **Set env vars** on the Vercel project (Settings → Environment Variables):
   - `DATABASE_URI` = the Neon **pooled** connection string
     (`postgresql://…-pooler.…neon.tech/…?sslmode=require`) — pooling is important on serverless.
   - `PAYLOAD_SECRET` = a long random string.
3. **Load the schema + content once** from your machine, pointed at the Neon **direct**
   (non-pooled) URL — DDL should use the direct endpoint:
   ```bash
   DATABASE_URI="postgresql://…@…neon.tech/…?sslmode=require" pnpm seed
   ```
   This creates the tables, an admin user, and all the landing content in Neon.
4. **Redeploy.** The site now reads/writes Neon and renders.

Other notes:

- Set a strong `PAYLOAD_SECRET` and change the seeded admin password after first login.
- Uploaded media is stored on the local filesystem by default; for a serverless deploy add a
  storage adapter (S3, Vercel Blob, etc.) so uploads persist.
- Contact-form and newsletter submissions are stored in the CMS; add a Payload email adapter if you
  also want email delivery.
