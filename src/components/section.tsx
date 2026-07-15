import * as React from 'react'

import { cn } from '@/lib/utils'

// Centered content column shared by every section. `wide` is the chrome width
// (header/footer) which runs a touch wider than section content.
export function Container({
  className,
  wide = false,
  children,
}: {
  className?: string
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-6',
        wide ? 'max-w-[1280px] sm:px-10 lg:px-14' : 'max-w-[1200px] sm:px-10 lg:px-16',
        className,
      )}
    >
      {children}
    </div>
  )
}

// Mono, uppercase kicker above headings. Color is passed via className
// (defaults to the accessible muted-faint token). `size="lg"` matches the
// slightly larger hero kickers.
export function Eyebrow({
  className,
  size = 'sm',
  children,
}: {
  className?: string
  size?: 'sm' | 'lg'
  children: React.ReactNode
}) {
  return (
    <p
      className={cn(
        'font-mono uppercase text-faint',
        size === 'lg' ? 'text-[13px] tracking-[0.11em]' : 'text-xs tracking-[0.09em]',
        className,
      )}
    >
      {children}
    </p>
  )
}
