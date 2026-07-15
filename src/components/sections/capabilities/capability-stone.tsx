import { Container, Eyebrow } from '@/components/section'
import { cn } from '@/lib/utils'
import type { LandingContent } from '@/payload-types'

import { CapabilityShape } from './shape'

type Capabilities = NonNullable<LandingContent['capabilities']>

// Modular Stone: bento grid — the first and last items become wide feature tiles
// (navy and stone), the rest are compact white cards.
export function CapabilityStone({ data }: { data: Capabilities }) {
  const items = data.items ?? []
  const last = items.length - 1

  return (
    <section className="bg-surface-2 py-16 sm:py-20">
      <Container>
        <Eyebrow>{data.eyebrow}</Eyebrow>
        <h2 className="mb-10 mt-3.5 max-w-[560px] font-display text-[clamp(1.9rem,3.4vw,2.375rem)] font-medium tracking-[-0.02em] text-ink">
          {data.heading}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const feature = items.length > 2 && (i === 0 || i === last)
            const navy = i === 0

            if (feature) {
              return (
                <div
                  key={item.id ?? i}
                  className={cn(
                    'flex min-h-[170px] flex-col justify-between rounded-xl p-8 sm:col-span-2',
                    navy ? 'bg-[#071829]' : 'bg-[#eeece7]',
                  )}
                >
                  <CapabilityShape
                    shape={item.shape}
                    size="lg"
                    className={navy ? 'border-[#8fb0cf]' : 'border-[#071829]'}
                  />
                  <div>
                    <h3
                      className={cn(
                        'mb-2 text-2xl font-medium',
                        navy ? 'text-white' : 'text-ink',
                      )}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={cn(
                        'max-w-[400px] text-[15px] leading-relaxed',
                        navy ? 'text-[#9fb0c0]' : 'text-[#55554e]',
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            }

            return (
              <div
                key={item.id ?? i}
                className="rounded-xl border border-card-border bg-card p-[26px]"
              >
                <CapabilityShape shape={item.shape} className="mb-[18px] border-[#071829]" />
                <h3 className="mb-1.5 text-lg font-medium text-ink">{item.title}</h3>
                <p className="text-[13.5px] leading-relaxed text-muted">{item.description}</p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
