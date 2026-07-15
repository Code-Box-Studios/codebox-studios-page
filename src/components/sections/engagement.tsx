import { Check } from 'lucide-react'

import { Container, Eyebrow } from '@/components/section'
import { Button } from '@/components/ui/button'
import type { Theme } from '@/lib/theme'
import { cn } from '@/lib/utils'
import type { LandingContent } from '@/payload-types'

type Engagement = NonNullable<LandingContent['engagement']>

// Engagement model cards. The `popular` plan is filled with the theme brand color.
export function Engagement({ data, theme }: { data: Engagement; theme: Theme }) {
  const plans = data.plans ?? []
  const sectionBg = theme === 'command' ? 'bg-surface-2' : 'bg-surface-3'

  return (
    <section className={cn('py-16 sm:py-20', sectionBg)}>
      <Container>
        <Eyebrow className="text-muted">{data.eyebrow}</Eyebrow>
        <h2 className="mb-10 mt-3.5 font-display text-[clamp(1.9rem,3.4vw,2.375rem)] font-medium tracking-[-0.02em] text-ink">
          {data.heading}
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan, i) => {
            const popular = Boolean(plan.popular)
            return (
              <div
                key={plan.id ?? i}
                className={cn(
                  'relative flex flex-col rounded-lg p-8',
                  popular
                    ? 'bg-brand text-brand-ink'
                    : cn('bg-card', theme !== 'editorial' && 'border border-card-border'),
                )}
              >
                {popular && (
                  <span className="absolute right-6 top-6 rounded-md bg-accent px-2 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-accent-fg">
                    Popular
                  </span>
                )}
                <h3
                  className={cn(
                    'mb-1.5 text-2xl font-medium',
                    popular ? 'text-white' : 'text-ink',
                  )}
                >
                  {plan.name}
                </h3>
                <p
                  className={cn(
                    'mb-6 text-sm leading-normal',
                    popular ? 'text-white/70' : 'text-muted',
                  )}
                >
                  {plan.description}
                </p>
                <ul
                  className={cn(
                    'flex flex-col gap-3 border-t pt-5 text-sm',
                    popular ? 'border-white/16 text-white/90' : 'border-line-soft text-ink-soft',
                  )}
                >
                  {(plan.features ?? []).map((f, fi) => (
                    <li key={f.id ?? fi} className="flex items-center gap-2.5">
                      <Check
                        className={cn('h-4 w-4 shrink-0', popular ? 'text-white' : 'text-accent-text')}
                      />
                      {f.feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-1">
                  <Button asChild variant={popular ? 'inverted' : 'outline'} size="block">
                    <a href="#contact">{plan.ctaLabel}</a>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
