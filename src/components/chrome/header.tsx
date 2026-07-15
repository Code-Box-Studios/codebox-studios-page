'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'

import { Logo } from '@/components/logo'
import { Container } from '@/components/section'
import { Button } from '@/components/ui/button'
import type { Theme } from '@/lib/theme'
import { cn } from '@/lib/utils'
import type { SiteSetting } from '@/payload-types'

type NavLink = NonNullable<SiteSetting['nav']>[number]

interface HeaderProps {
  theme: Theme
  brandName: string
  nav: NavLink[]
  signInLabel: string
  signInHref: string
  ctaLabel: string
  ctaHref: string
}

export function Header({
  theme,
  brandName,
  nav,
  signInLabel,
  signInHref,
  ctaLabel,
  ctaHref,
}: HeaderProps) {
  const [open, setOpen] = useState(false)

  const onDark = theme === 'command'
  const navHover = onDark ? 'hover:text-white' : 'hover:text-ink'
  const ctaVariant = onDark ? 'inverted' : 'primary'

  return (
    <header className="sticky top-0 z-40 border-b border-header-border bg-header-bg text-header-fg backdrop-blur-sm">
      <Container wide className="flex items-center justify-between gap-6 py-4">
        <a
          href="#top"
          className={cn('shrink-0', onDark ? 'text-white' : 'text-ink')}
          aria-label={brandName}
        >
          <Logo brandName={brandName} />
        </a>

        <nav className="hidden items-center gap-8 text-sm lg:flex">
          {nav.map((link) => (
            <a
              key={link.id ?? link.label}
              href={link.href}
              className={cn('transition-colors', navHover)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a href={signInHref} className={cn('text-sm transition-colors', navHover)}>
            {signInLabel}
          </a>
          <Button asChild variant={ctaVariant} size="md">
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>
        </div>

        <button
          type="button"
          className={cn('lg:hidden', onDark ? 'text-white' : 'text-ink')}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-header-border bg-header-bg px-6 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {nav.map((link) => (
              <a
                key={link.id ?? link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn('border-b border-header-border py-3 text-sm', navHover)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-3">
            <a href={signInHref} onClick={() => setOpen(false)} className="text-sm">
              {signInLabel}
            </a>
            <Button asChild variant={ctaVariant} size="block">
              <a href={ctaHref} onClick={() => setOpen(false)}>
                {ctaLabel}
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
