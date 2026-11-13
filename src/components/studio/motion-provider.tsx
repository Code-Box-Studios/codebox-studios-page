'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Pause, Play } from 'lucide-react'

import { clamp } from './motion'
import { compactMotionQuery } from './mobile-motion'

const MotionContext = createContext({ enabled: false, compact: false, toggle: () => {} })
export const useStudioMotion = () => useContext(MotionContext)

export function MotionControl({ compact = false }: { compact?: boolean }) {
  const { enabled, toggle } = useStudioMotion()
  return (
    <button
      type="button"
      className={compact ? 'motion-control compact' : 'motion-control'}
      onClick={toggle}
      aria-label={enabled ? 'Pause animations' : 'Enable animations'}
      aria-pressed={!enabled}
    >
      {enabled ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
      {!compact && <span>{enabled ? 'Pause motion' : 'Enable motion'}</span>}
    </button>
  )
}

export function StudioMotion({
  children,
  announcement,
}: {
  children: ReactNode
  announcement: boolean
}) {
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(true)
  const [override, setOverride] = useState<boolean | null>(null)
  const [compact, setCompact] = useState(false)
  const enabled = ready && (override ?? !reduced)
  const root = useRef<HTMLDivElement>(null)
  const value = useMemo(
    () => ({ enabled, compact, toggle: () => setOverride(!enabled) }),
    [enabled, compact],
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const phone = window.matchMedia(compactMotionQuery)
    const resize = () => setCompact(phone.matches)
    const change = () => {
      setReduced(query.matches)
      setOverride(null)
    }
    change()
    resize()
    setReady(true)
    query.addEventListener('change', change)
    phone.addEventListener('change', resize)
    return () => {
      query.removeEventListener('change', change)
      phone.removeEventListener('change', resize)
    }
  }, [])

  useEffect(() => {
    const element = root.current
    if (!element) return
    let frame = 0
    const reveals = [...element.querySelectorAll<HTMLElement>('[data-reveal]')]
    const chapters = compact
      ? []
      : [...element.querySelectorAll<HTMLAnchorElement>('.chapter-rail a')]
    const words = [...element.querySelectorAll<HTMLElement>('.about .word')]
    // Content is readable on arrival; optional motion belongs to decorative artwork.
    reveals.forEach((node) => node.classList.add('in'))
    words.forEach((node) => node.classList.add('read'))
    function update() {
      frame = 0
      if (!element) return
      const height = innerHeight
      let active: HTMLAnchorElement | undefined
      chapters.forEach((link) => {
        const target = element?.querySelector(link.hash)
        if (target && target.getBoundingClientRect().top < height * 0.5) active = link
      })
      const announcementHeight =
        element.querySelector<HTMLElement>('.studio-announcement')?.offsetHeight ?? 0
      element.style.setProperty('--announcement-offset', `${announcementHeight}px`)
      element.style.setProperty(
        '--page-progress',
        String(clamp(scrollY / Math.max(1, document.documentElement.scrollHeight - height))),
      )
      chapters.forEach((link) => {
        link.classList.toggle('active', link === active)
        if (link === active) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const resize = new ResizeObserver(schedule)
    resize.observe(element)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    update()
    return () => {
      resize.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [compact])

  return (
    <MotionContext.Provider value={value}>
      <div
        id="top"
        ref={root}
        className="studio-site"
        data-motion={enabled ? 'on' : 'off'}
        data-ready={ready ? 'yes' : 'no'}
        style={{ '--announcement-offset': announcement ? '33px' : '0px' } as CSSProperties}
      >
        <div className="progress-top" aria-hidden />
        {children}
      </div>
    </MotionContext.Provider>
  )
}
