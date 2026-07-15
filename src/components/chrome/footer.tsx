import { Logo } from '@/components/logo'
import { NewsletterForm } from '@/components/chrome/newsletter-form'
import { Container, Eyebrow } from '@/components/section'
import type { SiteSetting } from '@/payload-types'

// Dark footer, consistent across all themes.
export function Footer({
  footer,
  brandName,
}: {
  footer: NonNullable<SiteSetting['footer']>
  brandName: string
}) {
  const columns = footer.columns ?? []

  return (
    <footer className="bg-footer-bg text-white">
      <Container wide className="pb-10 pt-16">
        <div className="flex flex-col justify-between gap-12 border-b border-white/12 pb-11 lg:flex-row">
          <div className="max-w-[420px]">
            <Eyebrow className="text-accent">{footer.eyebrow}</Eyebrow>
            {footer.heading && (
              <h2 className="mb-6 mt-4 font-display text-[30px] font-medium leading-tight tracking-[-0.02em] text-white">
                {footer.heading}
              </h2>
            )}
            <NewsletterForm placeholder={footer.newsletterPlaceholder || 'you@company.com'} />
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
            {columns.map((col) => (
              <div key={col.id ?? col.title} className="flex flex-col gap-3">
                <span className="mb-1 text-[13px] text-white">{col.title}</span>
                {(col.links ?? []).map((link) => (
                  <a
                    key={link.id ?? link.label}
                    href={link.href || '#'}
                    className="text-[13px] text-white/50 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-6 pt-7 sm:flex-row sm:items-center">
          <span className="text-white">
            <Logo brandName={brandName} />
          </span>
          <div className="flex gap-6 text-xs text-white/45">
            {footer.copyright && <span>{footer.copyright}</span>}
            {footer.location && <span>{footer.location}</span>}
          </div>
        </div>
      </Container>
    </footer>
  )
}
