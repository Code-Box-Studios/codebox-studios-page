import { AnnouncementBar } from '@/components/chrome/announcement-bar'
import { Footer } from '@/components/chrome/footer'
import { Header } from '@/components/chrome/header'
import { About } from '@/components/sections/about'
import { Capabilities } from '@/components/sections/capabilities'
import { Contact } from '@/components/sections/contact'
import { Engagement } from '@/components/sections/engagement'
import { FAQ } from '@/components/sections/faq'
import { Hero } from '@/components/sections/hero'
import { Portfolio } from '@/components/sections/portfolio'
import { Process } from '@/components/sections/process'
import { Services } from '@/components/sections/services'
import { Testimonials } from '@/components/sections/testimonials'
import { Trust } from '@/components/sections/trust'
import { getLandingContent, getSiteSettings } from '@/lib/data'
import { THEMES, type Theme } from '@/lib/theme'
import { StudioLanding } from '@/components/studio/studio-landing'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string }>
}) {
  const [settings, content, params] = await Promise.all([
    getSiteSettings(),
    getLandingContent(),
    searchParams,
  ])
  // The approved studio experience is the homepage. Explicit valid theme
  // queries retain access to the three original visual directions.
  const preview = params.theme
  if (!preview || !THEMES.includes(preview as Theme)) {
    return <StudioLanding settings={settings} content={content} />
  }
  const theme = preview as Theme

  return (
    <div id="top" data-theme={theme} className="min-h-screen bg-surface">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-surface"
      >
        Skip to content
      </a>
      <AnnouncementBar announcement={settings.announcement} />
      <Header
        theme={theme}
        brandName={settings.brandName}
        nav={settings.nav ?? []}
        signInLabel={settings.signInLabel || 'Sign in'}
        signInHref={settings.signInHref || '#'}
        ctaLabel={settings.ctaLabel || 'Start a project'}
        ctaHref="#contact"
      />

      <main id="main">
        {content.hero && <Hero data={content.hero} theme={theme} />}
        {content.trust && <Trust data={content.trust} />}
        {content.services && <Services data={content.services} theme={theme} />}
        {content.capabilities && <Capabilities data={content.capabilities} theme={theme} />}
        {content.process && <Process data={content.process} theme={theme} />}
        {content.portfolio && <Portfolio data={content.portfolio} theme={theme} />}
        {content.engagement && <Engagement data={content.engagement} theme={theme} />}
        {content.about && <About data={content.about} theme={theme} />}
        {content.testimonials && <Testimonials data={content.testimonials} theme={theme} />}
        {content.faq && <FAQ data={content.faq} />}
        {content.contact && <Contact data={content.contact} />}
      </main>

      {settings.footer && <Footer footer={settings.footer} brandName={settings.brandName} />}
    </div>
  )
}
