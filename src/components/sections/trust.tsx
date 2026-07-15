import Image from 'next/image'

import { Container, Eyebrow } from '@/components/section'
import { asMedia } from '@/lib/media'
import type { LandingContent } from '@/payload-types'

type Trust = NonNullable<LandingContent['trust']>

// "Trusted alongside" logo strip — consistent across themes.
export function Trust({ data }: { data: Trust }) {
  const logos = data.logos ?? []
  if (logos.length === 0 && !data.eyebrow) return null

  return (
    <section className="bg-surface py-14">
      <Container>
        {data.eyebrow && (
          <Eyebrow className="text-center text-faint">{data.eyebrow}</Eyebrow>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo, i) => {
            const img = asMedia(logo.image)
            return img?.url ? (
              <Image
                key={logo.id ?? i}
                src={img.url}
                alt={img.alt || logo.name}
                width={120}
                height={30}
                className="h-7 w-auto object-contain opacity-70 grayscale"
              />
            ) : (
              <span
                key={logo.id ?? i}
                className="text-[15px] font-medium tracking-tight text-faint"
              >
                {logo.name}
              </span>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
