import Image from 'next/image'

import { Placeholder, type Tone } from '@/components/placeholder'
import { Container } from '@/components/section'
import { ArrowLink } from '@/components/ui/arrow-link'
import type { Theme } from '@/lib/theme'
import { asMedia } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { LandingContent } from '@/payload-types'

type Portfolio = NonNullable<LandingContent['portfolio']>

type Style = {
  section: string
  head: string
  link: 'default' | 'inverted' | 'muted'
  boxed: boolean
  tone: Tone
  tag: string
  title: string
  note: string
}

const styles: Record<Theme, Style> = {
  editorial: {
    section: 'bg-surface',
    head: 'text-ink',
    link: 'default',
    boxed: false,
    tone: 'cool',
    tag: 'bg-accent text-white',
    title: 'text-ink',
    note: 'text-muted',
  },
  command: {
    section: 'bg-[#17171c]',
    head: 'text-white',
    link: 'inverted',
    boxed: false,
    tone: 'dark',
    tag: 'bg-accent text-[#17171c]',
    title: 'text-white',
    note: 'text-[#93939f]',
  },
  stone: {
    section: 'bg-surface-2',
    head: 'text-ink',
    link: 'default',
    boxed: true,
    tone: 'warm',
    tag: 'bg-[#071829] text-white',
    title: 'text-ink',
    note: 'text-muted',
  },
}

// Selected-work grid. Renders uploaded imagery or a striped placeholder.
export function Portfolio({ data, theme }: { data: Portfolio; theme: Theme }) {
  const items = data.items ?? []
  const s = styles[theme]

  return (
    <section id="work" className={cn('py-16 sm:py-20', s.section)}>
      <Container>
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p
              className={cn(
                'font-mono text-xs uppercase tracking-[0.09em]',
                theme === 'command' ? 'text-white/60' : 'text-faint',
              )}
            >
              {data.eyebrow}
            </p>
            <h2
              className={cn(
                'mt-3.5 font-display text-[clamp(1.9rem,3.4vw,2.375rem)] font-medium tracking-[-0.02em]',
                s.head,
              )}
            >
              {data.heading}
            </h2>
          </div>
          {data.allLabel && (
            <ArrowLink href="#contact" variant={s.link}>
              {data.allLabel}
            </ArrowLink>
          )}
        </div>

        <div className={cn('grid sm:grid-cols-2', s.boxed ? 'gap-4' : 'gap-6')}>
          {items.map((item, i) => {
            const img = asMedia(item.image)
            const media = img?.url ? (
              <Image
                src={img.url}
                alt={img.alt || item.title}
                width={640}
                height={420}
                className={cn('aspect-[2/1] w-full object-cover', s.boxed ? '' : 'rounded-[22px]')}
              />
            ) : (
              <Placeholder
                tone={s.tone}
                bordered={!s.boxed}
                className={cn('aspect-[2/1]', s.boxed && 'rounded-none')}
              />
            )

            const caption = (
              <div className={cn(s.boxed && 'px-6 py-5')}>
                <span
                  className={cn(
                    'inline-block rounded-md px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em]',
                    s.tag,
                  )}
                >
                  {item.tag}
                </span>
                <h3 className={cn('mb-1 mt-3 text-[22px] font-medium', s.title)}>{item.title}</h3>
                {item.note && <p className={cn('text-sm', s.note)}>{item.note}</p>}
              </div>
            )

            return s.boxed ? (
              <div
                key={item.id ?? i}
                className="overflow-hidden rounded-lg border border-card-border bg-card"
              >
                {media}
                {caption}
              </div>
            ) : (
              <div key={item.id ?? i}>
                {media}
                <div className="mt-4">{caption}</div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
