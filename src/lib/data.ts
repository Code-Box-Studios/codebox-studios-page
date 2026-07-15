import 'server-only'

import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'
import type { LandingContent, SiteSetting } from '@/payload-types'

// A single Payload local-API client, reused across a request.
export const getPayloadClient = cache(async () => getPayload({ config: await config }))

// Site chrome + active theme. Cached per request so layout and page share one read.
export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

// Full landing-page content.
export const getLandingContent = cache(async (): Promise<LandingContent> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'landing-content', depth: 1 })
})
