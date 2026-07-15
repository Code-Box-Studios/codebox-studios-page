import { Container } from '@/components/section'
import type { LandingContent } from '@/payload-types'

import { CapabilityShape } from './shape'

type Capabilities = NonNullable<LandingContent['capabilities']>

// Command: dark navy band with translucent cards.
export function CapabilityCommand({ data }: { data: Capabilities }) {
  const items = data.items ?? []
  return (
    <section className="bg-[#071829] py-16 sm:py-[72px]">
      <Container>
        <p className="font-mono text-xs uppercase tracking-[0.09em] text-[#6f9fd6]">
          {data.eyebrow}
        </p>
        <h2 className="mb-11 mt-3.5 max-w-[560px] font-display text-[clamp(1.9rem,3.4vw,2.375rem)] font-medium tracking-[-0.02em] text-white">
          {data.heading}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.id ?? i}
              className="rounded-2xl border border-white/[0.12] bg-white/[0.04] p-7"
            >
              <CapabilityShape shape={item.shape} className="mb-5 border-[#7fbfab]" />
              <h3 className="mb-2 text-[19px] font-medium text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[#9fb0c0]">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
