import { Placeholder } from '@/components/placeholder'
import { Container, Eyebrow } from '@/components/section'
import { ArrowLink } from '@/components/ui/arrow-link'
import { Button } from '@/components/ui/button'
import type { LandingContent } from '@/payload-types'

type Hero = NonNullable<LandingContent['hero']>

// Editorial White: centered monumental hero with a two-panel visual below.
export function HeroEditorial({ data }: { data: Hero }) {
  return (
    <section className="bg-surface pb-16 pt-16 text-center sm:pt-20">
      <Container>
        {data.eyebrow && <Eyebrow className="text-faint">{data.eyebrow}</Eyebrow>}
        <h1 className="mx-auto mt-6 max-w-[900px] font-display text-[clamp(2.75rem,7vw,5.25rem)] font-medium leading-[1.02] tracking-[-0.03em] text-ink">
          {data.heading}
        </h1>
        {data.body && (
          <p className="mx-auto mt-7 max-w-[600px] text-[19px] leading-relaxed text-body">
            {data.body}
          </p>
        )}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <Button asChild variant="primary" size="lg">
            <a href="#contact">{data.primaryCtaLabel}</a>
          </Button>
          <ArrowLink href="#process">{data.secondaryCtaLabel}</ArrowLink>
        </div>
        <div className="mt-14 grid gap-5 text-left md:grid-cols-[1.7fr_1fr]">
          <Placeholder tone="light" label="[ PRODUCT / DASHBOARD MOCKUP · 16:10 ]" className="h-[320px] md:h-[400px]" />
          <Placeholder tone="cool" label="[ STUDIO / TEAM PHOTO ]" className="h-[320px] md:h-[400px]" />
        </div>
      </Container>
    </section>
  )
}
