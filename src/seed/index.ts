import config from '@payload-config'
import { getPayload } from 'payload'

import { landingContentSeed, siteSettingsSeed } from './content'

// Idempotent seed: ensures an admin user exists and loads the approved copy
// into the SiteSettings + LandingContent globals. Safe to re-run.
// Run with `pnpm seed` (executed via `payload run`, which supports top-level await).

const payload = await getPayload({ config })

const email = process.env.SEED_ADMIN_EMAIL || 'admin@codeboxstudios.com'
const password = process.env.SEED_ADMIN_PASSWORD || 'changeme-123'

const existing = await payload.find({
  collection: 'users',
  limit: 1,
  where: { email: { equals: email } },
})

if (existing.totalDocs === 0) {
  await payload.create({ collection: 'users', data: { email, password } })
  payload.logger.info(`Created admin user: ${email} / ${password}`)
  payload.logger.warn('Change this password after first login.')
} else {
  payload.logger.info(`Admin user already exists: ${email}`)
}

await payload.updateGlobal({ slug: 'site-settings', data: siteSettingsSeed })
await payload.updateGlobal({ slug: 'landing-content', data: landingContentSeed })

payload.logger.info('Seeded SiteSettings and LandingContent.')

process.exit(0)
