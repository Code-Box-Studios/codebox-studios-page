import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

// Pill-shaped CTA buttons matching the design system. `inverted` variants are
// for placement on dark theme bands (green / navy heroes).
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-brand-ink hover:bg-brand-hover',
        inverted: 'bg-white text-brand hover:bg-white/90',
        outline: 'border border-ink text-ink hover:bg-ink hover:text-surface',
        outlineInverted: 'border border-white/60 text-white hover:bg-white hover:text-brand',
      },
      size: {
        sm: 'px-5 py-2.5 text-sm',
        md: 'px-[22px] py-[11px] text-sm',
        lg: 'px-[30px] py-[15px] text-[15px]',
        block: 'w-full px-6 py-3.5 text-[15px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
