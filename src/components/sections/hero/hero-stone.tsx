import { LogoMark } from '@/components/logo'
import { Container, Eyebrow } from '@/components/section'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Button } from '@/components/ui/button'
import type { LandingContent } from '@/payload-types'

type Hero = NonNullable<LandingContent['hero']>

// Modular Stone: split hero inside the stone band, paired with a building-block bento.
export function HeroStone({ data }: { data: Hero }) {
  return (
    <section className="bg-header-bg">
      <Container className="max-w-[1280px]">
        <div className="grid items-center gap-12 py-16 lg:grid-cols-[1fr_1.02fr] lg:py-[68px]">
          <div>
            {data.eyebrow && (
              <Eyebrow size="lg" className="text-brand">
                {data.eyebrow}
              </Eyebrow>
            )}
            <h1 className="mt-6 font-display text-[clamp(2.5rem,5.4vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.02em] text-ink">
              {data.heading}
            </h1>
            {data.body && (
              <p className="mt-6 max-w-[460px] text-[19px] leading-relaxed text-body">
                {data.body}
              </p>
            )}
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button asChild variant="primary" size="lg">
                <a href="#contact">{data.primaryCtaLabel}</a>
              </Button>
              <ArrowLink href="#process" variant="muted">
                {data.secondaryCtaLabel}
              </ArrowLink>
            </div>
          </div>

          {/* Building-block bento */}
          <div className="grid grid-cols-3 grid-rows-[repeat(3,minmax(96px,1fr))] gap-3.5 sm:grid-rows-[repeat(3,116px)]">
            <div className="col-span-2 row-span-2 flex items-center justify-center rounded-xl border border-card-border bg-white text-[#071829]">
              <LogoMark className="h-24 w-24 sm:h-28 sm:w-28" />
            </div>
            <div className="flex items-end rounded-xl bg-[#071829] p-3.5">
              <span className="font-mono text-xs text-[#8fb0cf]">modular</span>
            </div>
            <div className="flex items-end rounded-xl bg-[#e2ded4] p-3.5">
              <span className="font-mono text-xs text-[#8a877d]">scalable</span>
            </div>
            <div className="flex items-center justify-center rounded-xl border border-card-border bg-white">
              <span className="font-mono text-[26px] text-ink">{'{ }'}</span>
            </div>
            <div
              className="rounded-xl border border-[#dcd8cf]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, #e0ddd4 0 10px, #e8e5dd 10px 20px)',
              }}
            />
            <div className="flex items-center justify-center rounded-xl bg-[#071829]">
              <span className="font-mono text-xl text-white">{'</>'}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
