import { asMedia } from '@/lib/media'
import type { LandingContent } from '@/payload-types'
import type { ProjectKind } from './project-art'

export type PortfolioItem = NonNullable<NonNullable<LandingContent['portfolio']>['items']>[number]

const productPreviews: Record<string, { url: string; alt: string; href: string }> = {
  tally: {
    url: '/projects/tally.png',
    alt: 'Tally landing page with an illustrative repayment preview',
    href: 'https://tally-rho-sand.vercel.app/',
  },
  'motorpool management system': {
    url: '/projects/motorpool-management-system-2026-11.webp',
    alt: 'Updated Motorpool Management System website',
    href: 'https://um-mms-web.vercel.app/',
  },
  sentrypos: {
    url: '/projects/sentry-pos.webp',
    alt: 'SentryPOS website showing its point-of-sale and branch monitoring platform',
    href: 'https://sentry-pos-landing.vercel.app/',
  },
  pikol: {
    url: '/projects/pikol.webp',
    alt: 'Pikol website for discovering and booking pickleball courts',
    href: 'https://pikol-ph.vercel.app/',
  },
  'monochrome studio': {
    url: '/projects/monochrome-studio.webp',
    alt: 'Monochrome Studio website with photo-session packages and online booking',
    href: 'https://monochrome-studio-site.vercel.app/',
  },
}

const concepts: Record<
  string,
  {
    line: string
    body: string
    need: string
    service: string
    layers: string
    kind: ProjectKind
    accent: string
  }
> = {
  'scheduling platform': {
    line: 'Your operations, in one place.',
    body: 'Shared schedules, team roles, and workflow logic in one application.',
    need: 'Coordinate daily operations',
    service: 'Complex web applications',
    layers: 'Logic + interface + integrations',
    kind: 'operations',
    accent: '#ff9578',
  },
  'headless storefront': {
    line: 'Let your team run the storefront.',
    body: 'Manage products and content through a CMS, with an independently built customer experience.',
    need: 'Manage content and commerce',
    service: 'Headless commerce & CMS',
    layers: 'Content + interface + commerce APIs',
    kind: 'commerce',
    accent: '#ddbf94',
  },
  'internal dashboard': {
    line: 'A clearer view of your business.',
    body: 'Bring operational data into one interface so your team can see what needs attention.',
    need: 'Make information usable',
    service: 'Web applications & integration',
    layers: 'Data + integrations + interface',
    kind: 'dashboard',
    accent: '#9db9df',
  },
  'design system': {
    line: 'Keep every interface consistent.',
    body: 'Reusable components, shared patterns, and documentation your team can extend.',
    need: 'Grow a consistent product',
    service: 'Frontend development & UI/UX',
    layers: 'Components + patterns + documentation',
    kind: 'system',
    accent: '#ff7759',
  },
}

export function resolveProject(item: PortfolioItem) {
  const preview = productPreviews[item.title.trim().toLowerCase()]
  const uploadedImage = asMedia(item.image)
  const image = uploadedImage?.url
    ? uploadedImage
    : preview || null
  const concept = !image?.url ? concepts[item.title.trim().toLowerCase()] : undefined
  return {
    ...item,
    image: image?.url ? image : null,
    href: preview?.href || null,
    concept: Boolean(concept),
    line: concept?.line || item.title,
    body: [concept?.body, item.note].filter(Boolean).join(' '),
    category: concept ? `Business need / ${concept.need}` : item.tag,
    service: concept?.service || item.tag,
    layers: concept?.layers || '',
    kind: concept?.kind || ('system' as ProjectKind),
    accent: concept?.accent || '#ff7759',
  }
}
