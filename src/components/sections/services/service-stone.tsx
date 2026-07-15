import { Container, Eyebrow } from '@/components/section'
import { formatIndex } from '@/lib/utils'
import type { LandingContent } from '@/payload-types'

type Services = NonNullable<LandingContent['services']>

// Modular Stone: 2×2 cards with a "window chrome" header strip.
export function ServiceStone({ data }: { data: Services }) {
  const items = data.items ?? []
  return (
    <section id="services" className="bg-surface py-16 sm:py-[72px]">
      <Container>
        <Eyebrow className="text-accent-text">{data.eyebrow}</Eyebrow>
        <h2 className="mb-10 mt-3.5 font-display text-[clamp(2rem,4vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em] text-ink">
          {data.heading}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <div
              key={item.id ?? i}
              className="overflow-hidden rounded-lg border border-card-border bg-card-2"
            >
              <div className="flex items-center gap-2 border-b border-card-border px-5 py-3">
                <span className="font-mono text-xs text-[#071829]">{formatIndex(i)}</span>
                <span className="h-[7px] w-[7px] rounded-full bg-[#d8d3c7]" />
                <span className="h-[7px] w-[7px] rounded-full bg-[#d8d3c7]" />
              </div>
              <div className="px-7 pb-8 pt-6">
                <h3 className="mb-2.5 font-display text-[23px] font-medium tracking-[-0.01em] text-ink">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-body">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
