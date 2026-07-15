import { Container, Eyebrow } from '@/components/section'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Button } from '@/components/ui/button'
import type { LandingContent } from '@/payload-types'

import { CodeConsole } from './code-console'

type Hero = NonNullable<LandingContent['hero']>

// Command: split hero inside the deep-green band, paired with the code console.
export function HeroCommand({ data }: { data: Hero }) {
  return (
    <section className="bg-header-bg">
      <Container className="max-w-[1280px]">
        <div className="grid items-center gap-12 py-16 lg:grid-cols-[1fr_1.05fr] lg:py-20">
          <div>
            {data.eyebrow && (
              <Eyebrow size="lg" className="text-[#7fbfab]">
                {data.eyebrow}
              </Eyebrow>
            )}
            <h1 className="mt-6 font-display text-[clamp(2.5rem,5.2vw,4.125rem)] font-medium leading-[1.02] tracking-[-0.02em] text-white">
              {data.heading}
            </h1>
            {data.body && (
              <p className="mt-6 max-w-[460px] text-[19px] leading-relaxed text-[#b8d6cc]">
                {data.body}
              </p>
            )}
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button asChild variant="inverted" size="lg">
                <a href="#contact">{data.primaryCtaLabel}</a>
              </Button>
              <ArrowLink href="#process" variant="inverted">
                {data.secondaryCtaLabel}
              </ArrowLink>
            </div>
          </div>
          <CodeConsole />
        </div>
      </Container>
    </section>
  )
}
