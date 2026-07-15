import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
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

// Serverless hosts (Vercel) have a read-only filesystem, so production uses a
// hosted Postgres. Local dev falls back to a zero-config SQLite file. The
// adapter is chosen from the connection string — set DATABASE_URI (or use the
// DATABASE_URL / POSTGRES_URL that Vercel's Neon integration injects).
const databaseUri =
  process.env.DATABASE_URI ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  'file:./codebox.db'

const isPostgres = /^postgres(ql)?:\/\//.test(databaseUri)

const db = isPostgres
  ? postgresAdapter({ pool: { connectionString: databaseUri } })
  : sqliteAdapter({ client: { url: databaseUri } })

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
  db,
  sharp,
})
