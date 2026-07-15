import { Container, Eyebrow } from '@/components/section'
import type { LandingContent } from '@/payload-types'

import { CapabilityShape } from './shape'

type Capabilities = NonNullable<LandingContent['capabilities']>

// Editorial White: plain three-column grid with hairline top borders.
export function CapabilityEditorial({ data }: { data: Capabilities }) {
  const items = data.items ?? []
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <Eyebrow>{data.eyebrow}</Eyebrow>
        <h2 className="mb-11 mt-3.5 max-w-[560px] font-display text-[clamp(1.9rem,3.4vw,2.375rem)] font-medium tracking-[-0.02em] text-ink">
          {data.heading}
        </h2>
        <div className="grid gap-x-11 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div key={item.id ?? i} className="border-t border-line py-6">
              <CapabilityShape shape={item.shape} className="mb-5 border-ink" />
              <h3 className="mb-2 text-xl font-medium text-ink">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
