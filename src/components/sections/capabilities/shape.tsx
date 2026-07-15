import { cn } from '@/lib/utils'
import type { LandingContent } from '@/payload-types'

type CapabilityItem = NonNullable<
  NonNullable<LandingContent['capabilities']>['items']
>[number]

// Kept in sync with the Payload-generated shape enum.
export type ShapeName = NonNullable<CapabilityItem['shape']>

const shapeMap: Record<ShapeName, string> = {
  square: 'h-[18px] w-[18px] rounded-[4px]',
  circle: 'h-[18px] w-[18px] rounded-full',
  diamond: 'h-4 w-4 rotate-45',
  notched: 'h-[18px] w-[18px] rounded-[4px_4px_4px_0]',
  teardrop: 'h-[18px] w-[18px] rounded-[50%_50%_50%_0]',
  block: 'h-[18px] w-[18px]',
}

// Small geometric glyph that marks each capability. Border color comes from
// the caller (varies per theme). `size` scales the big bento tiles up slightly.
export function CapabilityShape({
  shape,
  className,
  size = 'md',
}: {
  shape?: ShapeName | null
  className?: string
  size?: 'md' | 'lg'
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'block border-2',
        shapeMap[shape ?? 'square'],
        size === 'lg' && 'h-5 w-5',
        className,
      )}
    />
  )
}
