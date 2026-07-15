import { Container, Eyebrow } from '@/components/section'
import type { Theme } from '@/lib/theme'
import { cn, formatIndex } from '@/lib/utils'
import type { LandingContent } from '@/payload-types'

type Process = NonNullable<LandingContent['process']>

// How-we-work steps. Editorial/Command use divided columns; Stone uses boxes.
export function Process({ data, theme }: { data: Process; theme: Theme }) {
  const steps = data.steps ?? []
  const boxed = theme === 'stone'
  const numberColor = theme === 'command' ? 'text-brand' : 'text-accent-text'
  const sectionBg = theme === 'editorial' ? 'bg-surface-2' : 'bg-surface'

  return (
    <section id="process" className={cn('py-16 sm:py-20', sectionBg)}>
      <Container>
        <Eyebrow>{data.eyebrow}</Eyebrow>
        <h2 className="mb-10 mt-3.5 font-display text-[clamp(1.9rem,3.4vw,2.375rem)] font-medium tracking-[-0.02em] text-ink">
          {data.heading}
        </h2>
        <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', !boxed && 'lg:gap-0')}>
          {steps.map((step, i) => (
            <div
              key={step.id ?? i}
              className={cn(
                boxed
                  ? 'rounded-lg border border-card-border bg-card-2 p-7'
                  : 'px-0 lg:border-r lg:border-line lg:px-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0',
              )}
            >
              {boxed ? (
                <div className="mb-5 flex h-[34px] w-[34px] items-center justify-center rounded-md bg-[#071829] font-mono text-sm text-white">
                  {formatIndex(i)}
                </div>
              ) : (
                <div className={cn('mb-4 font-mono text-sm', numberColor)}>{formatIndex(i)}</div>
              )}
              <h3 className="mb-2 text-xl font-medium text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
