import { Container } from '@/components/section'
import type { LandingContent } from '@/payload-types'

import { ContactForm } from './contact-form'

type Contact = NonNullable<LandingContent['contact']>

// Contact band (theme brand-deep background) with the inquiry form.
export function Contact({ data }: { data: Contact }) {
  const budgetOptions = (data.budgetOptions ?? []).map((b) => b.label)

  return (
    <section id="contact" className="bg-contact-bg py-16 sm:py-[72px]">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.09em] text-contact-eyebrow">
              {data.eyebrow}
            </p>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3rem)] font-medium leading-[1.03] tracking-[-0.02em] text-white">
              {data.heading}
            </h2>
            {data.body && (
              <p className="mt-5 max-w-[380px] text-[17px] leading-relaxed text-contact-fg">
                {data.body}
              </p>
            )}
            <div className="mt-7 flex flex-col gap-2 text-sm text-contact-fg">
              {data.email && (
                <a href={`mailto:${data.email}`} className="text-white hover:underline">
                  {data.email}
                </a>
              )}
              {data.locationNote && <span>{data.locationNote}</span>}
            </div>
          </div>
          <ContactForm
            submitLabel={data.submitLabel || 'Send inquiry'}
            budgetOptions={budgetOptions}
          />
        </div>
      </Container>
    </section>
  )
}
