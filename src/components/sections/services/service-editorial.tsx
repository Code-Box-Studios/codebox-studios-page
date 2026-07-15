import { Container, Eyebrow } from '@/components/section'
import { ArrowLink } from '@/components/ui/arrow-link'
import { formatIndex } from '@/lib/utils'
import type { LandingContent } from '@/payload-types'

type Services = NonNullable<LandingContent['services']>

// Editorial White: unframed numbered rows.
export function ServiceEditorial({ data }: { data: Services }) {
  const items = data.items ?? []
  return (
    <section id="services" className="bg-surface py-16 sm:py-20">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow className="text-accent-text">{data.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(2rem,4vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em] text-ink">
              {data.heading}
            </h2>
          </div>
          {data.intro && (
            <p className="max-w-[340px] text-base leading-relaxed text-muted">{data.intro}</p>
          )}
        </div>
        <div>
          {items.map((item, i) => (
            <div
              key={item.id ?? i}
              className="grid grid-cols-1 items-start gap-4 border-t border-line py-7 last:border-b md:grid-cols-[56px_1fr_300px_120px] md:gap-7"
            >
              <span className="font-mono text-[15px] text-faint">{formatIndex(i)}</span>
              <h3 className="font-display text-[clamp(1.4rem,2.5vw,1.75rem)] font-medium tracking-[-0.01em] text-ink">
                {item.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-body">{item.description}</p>
              <ArrowLink href="#contact" className="md:justify-self-start md:self-center">
                Explore
              </ArrowLink>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
