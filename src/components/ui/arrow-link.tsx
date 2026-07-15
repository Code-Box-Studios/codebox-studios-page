import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

// The "See how we work →" underlined text CTA. `inverted` for dark bands.
const arrowLinkVariants = cva(
  'group inline-flex items-center gap-1.5 border-b pb-0.5 text-[15px] font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-ink text-ink hover:border-accent-text hover:text-accent-text',
        inverted: 'border-white/60 text-white hover:border-white',
        muted: 'border-ink/70 text-ink hover:border-accent-text hover:text-accent-text',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface ArrowLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof arrowLinkVariants> {
  asChild?: boolean
}

export const ArrowLink = React.forwardRef<HTMLAnchorElement, ArrowLinkProps>(
  ({ className, variant, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a'
    return (
      <Comp className={cn(arrowLinkVariants({ variant, className }))} ref={ref} {...props}>
        <span>{children}</span>
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          &rarr;
        </span>
      </Comp>
    )
  },
)
ArrowLink.displayName = 'ArrowLink'
