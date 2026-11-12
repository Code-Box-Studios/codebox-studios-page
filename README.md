# Code Box Studios — Landing Site

Marketing site for Code Box Studios, built with **Next.js 15 (App Router)** and **Payload CMS 3**.
The homepage uses the approved charcoal-and-coral studio design: a 27-block 3D cube explains
the software layers behind the business, followed by a scroll-driven project showcase.

Business content, projects, uploaded images, navigation, forms, and SEO remain CMS-driven.
The fixed software-layer narrative and illustrative interface artwork live in the studio components.
Missing project images are labeled as interface concepts; uploaded images use their CMS captions.
Reduced motion and the pause controls present projects as a readable list. Content and native mobile
navigation also work without JavaScript.

The original visual directions remain available as explicit previews:

- **Editorial White** — austere light canvas, monumental type, unframed rows
- **Command** — deep-green / navy bands, a code console hero, high contrast
- **Modular Stone** — warm stone surfaces, navy accents, a building-block bento grid

The original previews share the same CMS content.

## Stack

| Concern       | Choice                                                   |
| ------------- | -------------------------------------------------------- |
| Framework     | Next.js 15.4 (App Router, React Server Components)       |
| CMS / backend | Payload CMS 3.86 (embedded in Next.js)                   |
| Database      | Postgres (`@payloadcms/db-postgres`) — every environment |
| Styling       | Tailwind CSS v4 with design-token CSS variables          |
| UI primitives | Radix UI (shadcn-style components), lucide icons         |
| Language      | TypeScript                                               |

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

## Studio design and original theme previews

The homepage always uses the approved studio design. The theme field in **Site Settings → Brand &
Theme** now describes the original preview directions; it does not replace the studio homepage.

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

New inquiries send a plain-text notification through Payload's official
[Nodemailer adapter](https://payloadcms.com/docs/email/overview) when SMTP is configured. The
default recipient is `codeboxstudios.official@gmail.com`; the visitor's email is the Reply-To address.
Editing an inquiry does not send another email. Newsletter signups remain stored in the CMS only.

### Configure inquiry email

Set these server-only environment variables locally or in Vercel's project environment settings:

| Variable | Value |
| --- | --- |
| `SMTP_HOST` | Your provider's SMTP hostname |
| `SMTP_PORT` | `587` for STARTTLS (default), or `465` for TLS from connection start |
| `SMTP_SECURE` | `false` for port 587, `true` for port 465; defaults according to the port |
| `SMTP_USER` | Your SMTP login |
| `SMTP_PASS` | Your SMTP password or app password |
| `EMAIL_FROM_ADDRESS` | A sender address allowed by your provider; defaults to `SMTP_USER` |
| `EMAIL_FROM_NAME` | `Code Box Studios` by default |
| `CONTACT_NOTIFICATION_EMAIL` | `codeboxstudios.official@gmail.com` by default; one inbox only |

Both port modes require encryption. SMTP settings must be complete and valid before sending is
enabled. Missing settings never create a test email account or treat Payload's logging adapter as
delivery. Transport initialization does not contact SMTP during builds. The first send checks the
connection and credentials, with bounded connection, greeting, DNS, and socket timeouts.

For Gmail, use `smtp.gmail.com`, port `465`, `SMTP_SECURE=true`, and the full Gmail address as
`SMTP_USER` and `EMAIL_FROM_ADDRESS`. Gmail requires an app password for this password-based
integration. [Google's app-password guide](https://support.google.com/accounts/answer/185833)
requires 2-Step Verification; app passwords may be unavailable under some account policies.
Use a dedicated app password, not the normal Google account password. Keep it in server environment
settings, never in source control, screenshots, or chat. Redeploy Vercel after changing environment
variables.

Delivery is best effort. Unconfigured or failed email leaves the inquiry available in
**Admin → Inbox → Inquiries** and logs only its ID with a generic warning. There is no automatic retry
or delivery-status field; failed notifications must be followed up from the CMS. A successful form
submission confirms storage, not inbox receipt. After configuration, submit one test inquiry through
the live form, confirm both the CMS entry and notification inbox receipt, and check that Reply-To
targets the test visitor. SMTP acceptance alone does not prove inbox delivery.

## How styling works

Studio styles are scoped to `.studio-site`. The 3D scene math is separate from the React lifecycle
so cube geometry, camera angles, project counts, and viewport fitting can be tested directly.
Client components clean up animation frames, resize observers, and event listeners on navigation.

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
    studio/              CMS-driven studio layout, React scroll scenes, motion math, scoped styles
    chrome/              announcement, header, footer, newsletter form
    sections/            one folder/file per section (hero/services/capabilities have variants)
    ui/                  button, select, accordion, input, textarea, label, arrow-link
    logo.tsx             brand mark (themeable SVG)
  lib/                   data access, theme constants, fonts, media + cn helpers
  seed/                  idempotent seed (content + admin user)
```

## Verification

```bash
npm test
npx tsc --noEmit
npx eslint src/components/studio tests
npm run build
npm start
```

Stop the development server before building: `next dev` and `next build` use the same `.next`
directory. Keep the existing `.env` and Docker volumes when restarting an existing checkout.
Do not rerun the content seed against edited globals: it replaces their content.

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
- Contact-form and newsletter submissions are stored in the CMS. Configure SMTP as described above
  to enable contact inquiry email notifications.
