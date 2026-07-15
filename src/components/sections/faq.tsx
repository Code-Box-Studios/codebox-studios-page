import { Container, Eyebrow } from '@/components/section'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { LandingContent } from '@/payload-types'

type Faq = NonNullable<LandingContent['faq']>

export function FAQ({ data }: { data: Faq }) {
  const items = data.items ?? []

  return (
    <section id="faq" className="bg-surface py-16 sm:py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
          <div>
            <Eyebrow>{data.eyebrow}</Eyebrow>
            <h2 className="mt-3.5 font-display text-[clamp(1.9rem,3.4vw,2.375rem)] font-medium tracking-[-0.02em] text-ink">
              {data.heading}
            </h2>
          </div>
          <Accordion type="single" collapsible defaultValue="item-0" className="border-b border-line">
            {items.map((item, i) => (
              <AccordionItem key={item.id ?? i} value={`item-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  )
}
