import { Container, Eyebrow } from '@/components/section'
import type { Theme } from '@/lib/theme'
import { cn } from '@/lib/utils'
import type { LandingContent } from '@/payload-types'

type About = NonNullable<LandingContent['about']>

// About block: oversized statement + a small facts grid (boxed in Stone).
export function About({ data, theme }: { data: About; theme: Theme }) {
  const stats = data.stats ?? []
  const boxed = theme === 'stone'

  return (
    <section id="about" className="bg-surface py-16 sm:py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <Eyebrow>{data.eyebrow}</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4vw,2.875rem)] font-medium leading-[1.08] tracking-[-0.02em] text-ink">
              {data.heading}
            </h2>
          </div>
          <div>
            {data.body && (
              <p className="mb-6 text-[17px] leading-relaxed text-body">{data.body}</p>
            )}
            <div
              className={cn(
                'grid grid-cols-1 gap-3 sm:grid-cols-2',
                !boxed && 'gap-5 border-t border-line pt-6',
              )}
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.id ?? i}
                  className={cn(boxed && 'rounded-lg border border-card-border bg-card-2 p-4')}
                >
                  <div className="font-mono text-[13px] text-ink">{stat.label}</div>
                  <div className="text-[13px] text-faint">{stat.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
