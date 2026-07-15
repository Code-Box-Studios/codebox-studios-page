import type { Theme } from '@/lib/theme'
import type { LandingContent } from '@/payload-types'

import { ServiceCommand } from './service-command'
import { ServiceEditorial } from './service-editorial'
import { ServiceStone } from './service-stone'

type Services = NonNullable<LandingContent['services']>

export function Services({ data, theme }: { data: Services; theme: Theme }) {
  if (theme === 'command') return <ServiceCommand data={data} />
  if (theme === 'stone') return <ServiceStone data={data} />
  return <ServiceEditorial data={data} />
}
