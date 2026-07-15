import { cn } from '@/lib/utils'

/**
 * Code Box Studios brand mark: an isometric cube whose three faces read as
 * `</>` — a slash on top, a left chevron and a right chevron on the sides.
 * Drawn with `currentColor` so it inherits the surrounding text color and
 * works in every theme (dark on light surfaces, white on dark bands).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 264"
      className={cn('h-auto w-auto', className)}
      role="img"
      aria-hidden="true"
      fill="none"
    >
      {/* Faces — subtle fills give the cube its 3D read */}
      <polygon points="120,24 216,78 120,132 24,78" fill="currentColor" opacity="0.16" />
      <polygon points="24,78 120,132 120,240 24,186" fill="currentColor" opacity="0.1" />
      <polygon points="216,78 120,132 120,240 216,186" fill="currentColor" opacity="0.05" />

      {/* Edges */}
      <g
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.9"
      >
        <polygon points="120,24 216,78 120,132 24,78" />
        <path d="M24,78 V186 L120,240 L216,186 V78" />
        <path d="M120,132 V240" />
      </g>

      {/* Face glyphs — `/`, `<`, `>` sheared onto each iso plane */}
      <g
        fill="currentColor"
        fontFamily="ui-monospace, 'JetBrains Mono', monospace"
        fontWeight={700}
        fontSize={64}
        textAnchor="middle"
        dominantBaseline="central"
      >
        <text transform="matrix(0.871,0.490,-0.871,0.490,120,74)">/</text>
        <text transform="matrix(0.871,0.490,0,1,74,158)">&lt;</text>
        <text transform="matrix(0.871,-0.490,0,1,166,158)">&gt;</text>
      </g>
    </svg>
  )
}

/**
 * Full lockup: the mark plus the "Code Box Studios" wordmark, styled with the
 * display typeface. Used in the header. Colors inherit from the theme.
 */
export function Logo({
  className,
  markClassName,
  brandName = 'Code Box Studios',
}: {
  className?: string
  markClassName?: string
  brandName?: string
}) {
  // Split "<lead> Studios" so the trailing word can be muted.
  const parts = brandName.trim().split(' ')
  const suffix = parts.length > 1 ? parts.pop() : undefined
  const lead = parts.join(' ')

  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark className={cn('h-8 w-8 shrink-0', markClassName)} />
      <span className="font-display text-lg font-semibold tracking-[-0.02em]">
        {lead} {suffix && <span className="font-normal opacity-55">{suffix}</span>}
      </span>
    </span>
  )
}
