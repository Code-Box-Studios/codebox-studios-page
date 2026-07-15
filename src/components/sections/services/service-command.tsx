import { ArrowRight } from 'lucide-react'

import { Container, Eyebrow } from '@/components/section'
import { formatIndex } from '@/lib/utils'
import type { LandingContent } from '@/payload-types'

type Services = NonNullable<LandingContent['services']>

// Command: 2×2 bordered cards.
export function ServiceCommand({ data }: { data: Services }) {
  const items = data.items ?? []
  return (
    <section id="services" className="bg-surface py-16 sm:py-[72px]">
      <Container>
        <Eyebrow className="text-accent-text">{data.eyebrow}</Eyebrow>
        <h2 className="mb-10 mt-3.5 font-display text-[clamp(2rem,4vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em] text-ink">
          {data.heading}
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((item, i) => (
            <div
              key={item.id ?? i}
              className="group rounded-2xl border border-card-border bg-card p-8 transition-colors hover:border-ink"
            >
              <div className="mb-5 flex items-start justify-between">
                <span className="font-mono text-sm text-accent-text">{formatIndex(i)}</span>
                <ArrowRight className="h-4 w-4 text-faint transition-transform group-hover:translate-x-0.5" />
              </div>
              <h3 className="mb-2.5 font-display text-2xl font-medium tracking-[-0.01em] text-ink">
                {item.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-body">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
