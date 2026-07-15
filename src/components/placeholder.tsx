import { cn } from '@/lib/utils'

export type Tone = 'light' | 'cool' | 'warm' | 'dark'

const stripes: Record<Tone, [string, string]> = {
  light: ['#ececef', '#f4f4f6'],
  cool: ['#e7e6ea', '#efeef2'],
  warm: ['#e6e3da', '#efece5'],
  dark: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)'],
}

// Diagonal-striped placeholder panel used where real imagery hasn't been added
// yet (hero mockups, portfolio thumbnails). Optional bottom-left mono label.
export function Placeholder({
  tone = 'light',
  label,
  className,
  bordered = true,
}: {
  tone?: Tone
  label?: string
  className?: string
  bordered?: boolean
}) {
  const [a, b] = stripes[tone]
  return (
    <div
      className={cn(
        'flex items-end overflow-hidden rounded-[22px] p-5',
        bordered && (tone === 'dark' ? 'border border-white/12' : 'border border-line'),
        className,
      )}
      style={{
        backgroundImage: `repeating-linear-gradient(135deg, ${a} 0 11px, ${b} 11px 22px)`,
      }}
    >
      {label && (
        <span
          className={cn(
            'font-mono text-[11px] tracking-[0.06em]',
            tone === 'dark' ? 'text-white/40' : 'text-faint/70',
          )}
        >
          {label}
        </span>
      )}
    </div>
  )
}
