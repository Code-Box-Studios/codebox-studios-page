import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Subscribers } from './collections/Subscribers'
import { SiteSettings } from './globals/SiteSettings'
import { LandingContent } from './globals/LandingContent'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Postgres everywhere. SQLite's native driver (libsql) can't be bundled onto
// serverless hosts like Vercel, so the app uses Postgres in every environment.
// Set DATABASE_URI (or rely on the DATABASE_URL / POSTGRES_URL that Vercel's
// Neon integration injects).
const databaseUri =
  process.env.DATABASE_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!databaseUri) {
  throw new Error(
    'DATABASE_URI is not set. Provide a Postgres connection string (see .env.example).',
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Code Box Studios',
    },
  },
  collections: [Users, Media, ContactSubmissions, Subscribers],
  globals: [SiteSettings, LandingContent],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({ pool: { connectionString: databaseUri } }),
  sharp,
})
