import type { Theme } from '@/lib/theme'
import type { LandingContent } from '@/payload-types'

import { CapabilityCommand } from './capability-command'
import { CapabilityEditorial } from './capability-editorial'
import { CapabilityStone } from './capability-stone'

type Capabilities = NonNullable<LandingContent['capabilities']>

export function Capabilities({ data, theme }: { data: Capabilities; theme: Theme }) {
  if (theme === 'command') return <CapabilityCommand data={data} />
  if (theme === 'stone') return <CapabilityStone data={data} />
  return <CapabilityEditorial data={data} />
}
