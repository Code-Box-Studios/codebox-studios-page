import type { Theme } from '@/lib/theme'
import type { LandingContent } from '@/payload-types'

import { HeroCommand } from './hero-command'
import { HeroEditorial } from './hero-editorial'
import { HeroStone } from './hero-stone'

type Hero = NonNullable<LandingContent['hero']>

// Dispatches to the per-theme hero layout (they differ structurally, not just in color).
export function Hero({ data, theme }: { data: Hero; theme: Theme }) {
  if (theme === 'command') return <HeroCommand data={data} />
  if (theme === 'stone') return <HeroStone data={data} />
  return <HeroEditorial data={data} />
}
