import type { LandingContent, SiteSetting } from '@/payload-types'
import { StudioHeader } from './header'
import { StudioHero } from './hero'
import { StudioMotion } from './motion-provider'
import { ProjectJourney } from './projects'
import {
  About,
  Capabilities,
  Contact,
  Engagement,
  FAQ,
  Footer,
  KineticBanner,
  Process,
  Services,
  Testimonials,
  Trust,
} from './sections'
import './production.css'
import './mobile.css'

export function StudioLanding({
  settings,
  content,
}: {
  settings: SiteSetting
  content: LandingContent
}) {
  const announcement = settings.announcement
  const announced = Boolean(announcement?.enabled && announcement.text)
  const chapters = [
    ['top', 'Introduction'],
    ['services', 'Services'],
    ['work', 'Projects'],
    ['process', 'Process'],
    ['about', 'About'],
    ['contact', 'Contact'],
  ].filter(
    ([id]) =>
      id === 'top' ||
      (id === 'work' ? content.portfolio?.items?.length : content[id as keyof LandingContent]),
  )
  return (
    <StudioMotion announcement={announced}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      {announced && (
        <aside className="studio-announcement">
          <span>{announcement?.text}</span>
          {announcement?.linkHref && (
            <a href={announcement.linkHref}>{announcement.linkLabel || 'Get in touch'} ↗</a>
          )}
        </aside>
      )}
      <StudioHeader settings={settings} />
      <nav className="chapter-rail" aria-label="Page chapters">
        {chapters.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-label={label}>
            <span />
          </a>
        ))}
      </nav>
      <main id="main">
        {content.hero && <StudioHero data={content.hero} />}
        {content.trust && <Trust data={content.trust} />}
        <KineticBanner />
        {content.services && <Services data={content.services} />}
        {content.portfolio && <ProjectJourney data={content.portfolio} />}
        {content.process && <Process data={content.process} />}
        {content.capabilities && <Capabilities data={content.capabilities} />}
        {content.about && <About data={content.about} />}
        {content.engagement && <Engagement data={content.engagement} />}
        {content.testimonials && <Testimonials data={content.testimonials} />}
        {content.faq && <FAQ data={content.faq} />}
        {content.contact && <Contact data={content.contact} />}
      </main>
      <Footer settings={settings} />
    </StudioMotion>
  )
}
