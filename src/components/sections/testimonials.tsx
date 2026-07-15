import Image from 'next/image'

import { Container, Eyebrow } from '@/components/section'
import type { Theme } from '@/lib/theme'
import { asMedia } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { LandingContent } from '@/payload-types'

type Testimonials = NonNullable<LandingContent['testimonials']>

export function Testimonials({ data, theme }: { data: Testimonials; theme: Theme }) {
  const items = data.items ?? []
  if (items.length === 0) return null

  const sectionBg = theme === 'editorial' ? 'bg-surface border-t border-line-soft' : 'bg-surface-2'
  const avatarShape = theme === 'stone' ? 'rounded-lg' : 'rounded-full'

  return (
    <section className={cn('py-16 sm:py-20', sectionBg)}>
      <Container>
        <Eyebrow className="mb-9">{data.eyebrow}</Eyebrow>
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((item, i) => {
            const avatar = asMedia(item.avatar)
            return (
              <figure
                key={item.id ?? i}
                className="rounded-2xl border border-card-border bg-card p-8"
              >
                <blockquote className="text-[22px] leading-snug tracking-[-0.01em] text-ink">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {avatar?.url ? (
                    <Image
                      src={avatar.url}
                      alt={avatar.alt || item.name}
                      width={40}
                      height={40}
                      className={cn('h-10 w-10 object-cover', avatarShape)}
                    />
                  ) : (
                    <div className={cn('h-10 w-10 bg-surface-3', avatarShape)} />
                  )}
                  <div>
                    <div className="text-sm text-ink">{item.name}</div>
                    <div className="text-[13px] text-faint">{item.role}</div>
                  </div>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
