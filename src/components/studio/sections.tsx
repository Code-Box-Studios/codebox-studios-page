import { Check, Plus } from 'lucide-react'
import Image from 'next/image'
import { Logo } from '@/components/logo'
import { NewsletterForm } from '@/components/chrome/newsletter-form'
import { ContactForm } from '@/components/sections/contact-form'
import { CapabilityShape } from '@/components/sections/capabilities/shape'
import { asMedia } from '@/lib/media'
import type { LandingContent, SiteSetting } from '@/payload-types'
import { MotionControl } from './motion-provider'

export function SectionKicker({
  label,
  number,
  note,
}: {
  label?: string | null
  number: string
  note?: string
}) {
  return (
    <div className="section-kicker">
      <span className="mono">
        {number} / {label}
      </span>
      {note && <span className="mono">{note}</span>}
    </div>
  )
}

export function Trust({ data }: { data: NonNullable<LandingContent['trust']> }) {
  return (
    <section className="trust" aria-label="Technology stack">
      <div className="wrap trust-inner">
        <p className="mono">{data.eyebrow}</p>
        <div className="logos">
          {(data.logos ?? []).map((logo, index) => {
            const image = asMedia(logo.image)
            return image?.url ? (
              <Image
                key={logo.id ?? index}
                src={image.url}
                alt={image.alt || logo.name}
                width={130}
                height={36}
                className="trust-logo"
              />
            ) : (
              <span key={logo.id ?? index}>{logo.name}</span>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function KineticBanner() {
  return (
    <section
      className="kinetic-banner"
      aria-label="Web applications, headless commerce, and internal tools"
    >
      <div className="kinetic-row" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span className="kinetic-group" key={i}>
            <span>Web applications.</span>
            <span className="banner-separator" />
            <span className="outlined">Headless commerce.</span>
            <span className="banner-separator" />
            <span>Internal tools.</span>
            <span className="banner-separator" />
          </span>
        ))}
      </div>
      <p className="kinetic-sub">From your business workflow to the software that supports it.</p>
    </section>
  )
}

const serviceOutcomes: Record<string, string> = {
  'frontend development & ui/ux': 'An interface your customers and staff can use.',
  'complex web applications': 'Your workflows, connected in one application.',
  'headless e-commerce & cms': 'Content and products your team can manage.',
  'technical consulting & documentation': 'A system your team understands and owns.',
}

export function Services({ data }: { data: NonNullable<LandingContent['services']> }) {
  return (
    <section id="services" className="section">
      <div className="wrap">
        <SectionKicker number="01" label={data.eyebrow} note="From the surface to the system" />
        <div className="services-layout">
          <div className="services-intro reveal" data-reveal>
            <h2 className="section-title">{data.heading}</h2>
            {data.intro && <p>{data.intro}</p>}
            <a className="text-link" href="#contact">
              Find your starting point
            </a>
          </div>
          <div className="services-list spatial-services">
            {(data.items ?? []).map((item, index) => (
              <div data-depth="service" key={item.id ?? index}>
                <details className="service" open={index === 0}>
                  <summary className="service-summary">
                    <span className="service-num">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{item.title}</h3>
                    <span className="service-plus" aria-hidden>
                      <Plus size={16} strokeWidth={1.5} />
                    </span>
                  </summary>
                  {serviceOutcomes[item.title.trim().toLowerCase()] && (
                    <p className="service-outcome">
                      {serviceOutcomes[item.title.trim().toLowerCase()]}
                    </p>
                  )}
                  <p>{item.description}</p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProcessGeometry({ index }: { index: number }) {
  return (
    <div className="geometry" aria-hidden>
      <svg viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth=".8">
        {index % 4 === 0 ? (
          <>
            <circle cx="50" cy="40" r="28" />
            <circle cx="50" cy="40" r="18" opacity=".5" />
            <path d="M50 2v76M12 40h76" opacity=".4" />
            <circle cx="50" cy="40" r="3" fill="currentColor" />
          </>
        ) : index % 4 === 1 ? (
          <>
            <path d="m50 7 30 17v33L50 74 20 57V24L50 7Zm0 34 30-17M50 41 20 24m30 17v33" />
            <path d="m35 16 30 17v33M20 40l30 17 30-17M35 66V33L65 16" opacity=".4" />
          </>
        ) : index % 4 === 2 ? (
          <>
            <path d="m50 5 35 18-35 18-35-18L50 5Zm-35 32 35 18 35-18M15 51l35 18 35-18" />
            <path d="M15 23v28m70-28v28M50 41v28" opacity=".4" />
          </>
        ) : (
          <>
            <rect x="23" y="10" width="48" height="57" rx="2" />
            <path d="M33 24h28M33 33h28M33 42h17" opacity=".5" />
            <circle cx="68" cy="58" r="14" fill="var(--bg)" />
            <path d="m61 58 5 5 10-11" />
          </>
        )}
      </svg>
    </div>
  )
}

export function Process({ data }: { data: NonNullable<LandingContent['process']> }) {
  return (
    <section id="process" className="section spatial-process">
      <div className="wrap">
        <SectionKicker number="03" label={data.eyebrow} note="No black boxes" />
        <div className="heading-row reveal" data-reveal>
          <h2 className="section-title">{data.heading}</h2>
          <p>Structure from day one. A process you can see, understand, and be part of.</p>
        </div>
        <div className="process-grid">
          {(data.steps ?? []).map((step, index) => (
            <article className="process-card reveal" data-reveal key={step.id ?? index}>
              <span className="mono">Phase / {String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}.</h3>
              <p>{step.description}</p>
              <ProcessGeometry index={index} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Capabilities({ data }: { data: NonNullable<LandingContent['capabilities']> }) {
  return (
    <section className="section studio-capabilities">
      <div className="wrap">
        <SectionKicker number="04" label={data.eyebrow} />
        <h2 className="section-title reveal" data-reveal>
          {data.heading}
        </h2>
        <div className="capability-grid">
          {(data.items ?? []).map((item, index) => (
            <article className="reveal" data-reveal key={item.id ?? index}>
              <CapabilityShape shape={item.shape} className="border-current" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function About({ data }: { data: NonNullable<LandingContent['about']> }) {
  return (
    <section id="about" className="about spatial-about" data-depth="section">
      <div className="wrap">
        <SectionKicker number="05" label={data.eyebrow} note="Small by choice. Built for impact." />
        <div className="about-grid">
          <h2>
            {(data.heading || '').split(/(\s+)/).map((word, index) =>
              /\S/.test(word) ? (
                <span className="word read" key={index}>
                  {word}
                </span>
              ) : (
                word
              ),
            )}
          </h2>
          <div>
            <p>{data.body}</p>
            <a className="pill" href="#contact">
              Meet your next build partner
            </a>
          </div>
        </div>
        <div className="about-stats">
          {(data.stats ?? []).map((stat, index) => (
            <div className="mono" key={stat.id ?? index}>
              {stat.label}
              <span>{stat.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Engagement({ data }: { data: NonNullable<LandingContent['engagement']> }) {
  return (
    <section className="section studio-engagement">
      <div className="wrap">
        <SectionKicker number="06" label={data.eyebrow} />
        <h2 className="section-title reveal" data-reveal>
          {data.heading}
        </h2>
        <div className="engagement-grid">
          {(data.plans ?? []).map((plan, index) => (
            <article
              className={`engagement-card reveal ${plan.popular ? 'featured' : ''}`}
              data-reveal
              key={plan.id ?? index}
            >
              {plan.popular && <span className="mono plan-badge">Popular</span>}
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <ul>
                {(plan.features ?? []).map((feature, i) => (
                  <li key={feature.id ?? i}>
                    <Check size={15} strokeWidth={1.5} aria-hidden />
                    {feature.feature}
                  </li>
                ))}
              </ul>
              <a className={`pill ${plan.popular ? '' : 'outline'}`} href="#contact">
                {plan.ctaLabel || 'Let’s talk'}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Testimonials({ data }: { data: NonNullable<LandingContent['testimonials']> }) {
  if (!data.items?.length) return null
  return (
    <section className="section studio-testimonials">
      <div className="wrap">
        <SectionKicker number="07" label={data.eyebrow} />
        <div className="testimonial-grid">
          {data.items.map((item, index) => {
            const avatar = asMedia(item.avatar)
            return (
              <figure className="reveal" data-reveal key={item.id ?? index}>
                <blockquote>“{item.quote}”</blockquote>
                <figcaption>
                  {avatar?.url && (
                    <Image src={avatar.url} alt={avatar.alt || item.name} width={40} height={40} />
                  )}
                  <div>
                    <span>{item.name}</span>
                    <span className="muted">{item.role}</span>
                  </div>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function FAQ({ data }: { data: NonNullable<LandingContent['faq']> }) {
  return (
    <section id="faq" className="section studio-faq">
      <div className="wrap">
        <SectionKicker number="08" label={data.eyebrow} />
        <div className="faq-grid">
          <h2 className="section-title">{data.heading}</h2>
          <div>
            {(data.items ?? []).map((item, index) => (
              <details key={item.id ?? index} open={index === 0}>
                <summary>
                  {item.question}
                  <span aria-hidden>
                    <Plus size={16} strokeWidth={1.5} />
                  </span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Contact({ data }: { data: NonNullable<LandingContent['contact']> }) {
  return (
    <section id="contact" className="section contact spatial-contact" data-depth="section">
      <div className="wrap">
        <SectionKicker number="09" label={data.eyebrow} note="Let’s build something that lasts" />
        <h2 className="section-title reveal" data-reveal>
          {data.heading}
        </h2>
        <div className="studio-contact-grid">
          <div className="contact-information">
            <p>{data.body}</p>
            {data.email && (
              <a className="email" href={`mailto:${data.email}`}>
                {data.email}
              </a>
            )}
            {data.locationNote && <p className="mono">{data.locationNote}</p>}
          </div>
          <div className="contact-form">
            <ContactForm
              submitLabel={data.submitLabel || 'Send inquiry'}
              budgetOptions={(data.budgetOptions ?? []).map((option) => option.label)}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer({ settings }: { settings: SiteSetting }) {
  const data = settings.footer
  if (!data) return null
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="studio-footer-top">
          <div className="studio-newsletter">
            <p className="mono accent">{data.eyebrow}</p>
            <h2>{data.heading}</h2>
            <NewsletterForm placeholder={data.newsletterPlaceholder || 'you@company.com'} />
          </div>
          <div className="footer-columns">
            {(data.columns ?? []).map((column, index) => (
              <div key={column.id ?? index}>
                <h3>{column.title}</h3>
                {(column.links ?? []).map((link, i) =>
                  link.href && link.href !== '#' ? (
                    <a key={link.id ?? i} href={link.href}>
                      {link.label}
                    </a>
                  ) : (
                    <span key={link.id ?? i}>{link.label}</span>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="footer-inner">
          <a className="brand" href="#top" aria-label={`${settings.brandName} home`}>
            <Logo brandName={settings.brandName} />
          </a>
          <div className="footer-right mono">
            <span>{data.copyright}</span>
            <span>{data.location}</span>
            <a href="#top">Back to top</a>
          </div>
          <MotionControl />
        </div>
      </div>
    </footer>
  )
}
