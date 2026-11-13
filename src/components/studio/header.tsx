'use client'

import { Menu, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { SiteSetting } from '@/payload-types'
import { Logo } from '@/components/logo'
import { MotionControl } from './motion-provider'
import './sticky-header.css'

export function StudioHeader({ settings }: { settings: SiteSetting }) {
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDetailsElement>(null)
  const closeMenu = useCallback(() => {
    if (menu.current) menu.current.open = false
    setOpen(false)
  }, [])
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menu.current?.open) {
        closeMenu()
        button.current?.focus()
      }
    }
    const outside = (event: PointerEvent) => {
      if (menu.current?.open && !menu.current.contains(event.target as Node)) closeMenu()
    }
    const desktop = matchMedia('(min-width: 761px)')
    const resize = () => {
      if (desktop.matches) closeMenu()
    }
    document.addEventListener('keydown', key)
    document.addEventListener('pointerdown', outside)
    desktop.addEventListener('change', resize)
    return () => {
      document.removeEventListener('keydown', key)
      document.removeEventListener('pointerdown', outside)
      desktop.removeEventListener('change', resize)
    }
  }, [closeMenu])

  const links = (
    <>
      {(settings.nav ?? []).map((link, index) => (
        <a key={link.id ?? index} href={link.href} onClick={closeMenu}>
          {link.label}
        </a>
      ))}
      {settings.signInHref && settings.signInHref !== '#' && (
        <a href={settings.signInHref} onClick={closeMenu}>
          {settings.signInLabel || 'Sign in'}
        </a>
      )}
    </>
  )
  return (
    <header className="header studio-header">
      <div className="wrap header-inner">
        <a
          className="brand"
          href="#top"
          aria-label={`${settings.brandName} home`}
          onClick={closeMenu}
        >
          <Logo brandName={settings.brandName} />
        </a>
        <nav className="desktop-navigation" aria-label="Main navigation">
          {links}
        </nav>
        <div className="header-cta">
          <a href="#contact" onClick={closeMenu}>
            {settings.ctaLabel || 'Let’s talk'}
          </a>
          <MotionControl compact />
          <details
            className="mobile-menu"
            ref={menu}
            onToggle={(event) => setOpen(event.currentTarget.open)}
          >
            <summary
              ref={button}
              className="menu-button"
              aria-controls="studio-navigation"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? (
                <X size={18} strokeWidth={1.5} aria-hidden />
              ) : (
                <Menu size={18} strokeWidth={1.5} aria-hidden />
              )}
            </summary>
            <nav
              id="studio-navigation"
              className="mobile-navigation"
              aria-label="Mobile navigation"
            >
              {links}
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
