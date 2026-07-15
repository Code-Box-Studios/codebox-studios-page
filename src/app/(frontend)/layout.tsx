import type { Metadata } from 'next'
import React from 'react'

import { jetbrainsMono, spaceGrotesk } from '@/lib/fonts'
import { getSiteSettings } from '@/lib/data'
import { resolveTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null)
  const seo = settings?.seo
  return {
    title: seo?.title || 'Code Box Studios — Software, built like architecture',
    description:
      seo?.description ||
      'Code Box Studios designs and engineers robust, modular, and scalable web platforms — the interface layer and the systems beneath it.',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings().catch(() => null)
  // <html> always reflects the persisted theme (layouts can't read searchParams).
  // The `?theme=` preview override is applied on the page's themed wrapper; both
  // resolve through resolveTheme, and all themes share a white base surface so
  // body-level styling never visibly diverges from a previewed subtree.
  const theme = resolveTheme(settings?.theme)

  return (
    <html
      lang="en"
      data-theme={theme}
      className={cn(spaceGrotesk.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  )
}
