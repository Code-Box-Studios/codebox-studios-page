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
  const entranceAnimations = useRef(new Set<Animation>())
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

  useEffect(() => {
    entranceAnimations.current.forEach((animation) => {
      if (enabled) animation.play()
      else animation.pause()
    })
  }, [enabled])

  useEffect(() => {
    const animations = entranceAnimations.current
    return () => {
      animations.forEach((animation) => animation.cancel())
      animations.clear()
    }
  }, [])

  useEffect(() => {
    const element = root.current
    if (!element || !enabled) return
    const artwork = [
      ...element.querySelectorAll<HTMLElement>(
        '.kinetic-banner, [data-depth="service"], .process-card, .spatial-about, .spatial-contact',
      ),
    ]
    const titles = [
      ...element.querySelectorAll<HTMLElement>(
        '.section-title, .about h2, .hero-copy h1, .mobile-intro h1',
      ),
    ]
    const active = new Set<HTMLElement>()
    const animations = entranceAnimations.current
    let positions = new Map<HTMLElement, { top: number; height: number }>()
    let frame = 0

    function update() {
      frame = 0
      if (document.hidden) return
      const height = innerHeight
      const y = scrollY
      active.forEach((node) => {
        const box = positions.get(node)
        if (!box) return
        const progress = clamp((y + height - box.top) / Math.max(1, height + box.height))
        node.style.setProperty('--art-progress', String(progress))
        if (node.classList.contains('kinetic-banner'))
          node.style.setProperty('--marquee-x', `${-60 - progress * (compact ? 150 : 300)}px`)
      })
    }
    const schedule = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(update)
    }
    const measure = () => {
      positions = new Map(
        artwork.map((node) => [
          node,
          {
            top: node.getBoundingClientRect().top + scrollY,
            height: node.offsetHeight,
          },
        ]),
      )
      schedule()
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const node = entry.target as HTMLElement
          if (entry.isIntersecting) {
            if (positions.has(node)) active.add(node)
            if (!node.dataset.motionSeen) {
              node.dataset.motionSeen = 'true'
              node.classList.add('motion-entered')
              if (titles.includes(node)) {
                const animation = node.animate(
                  [
                    { opacity: 0.76, translate: `0 ${compact ? 12 : 20}px` },
                    { opacity: 1, translate: '0 0' },
                  ],
                  { duration: compact ? 420 : 600, easing: 'cubic-bezier(.16,1,.3,1)' },
                )
                animations.add(animation)
                animation.onfinish = () => animations.delete(animation)
              }
            }
          } else active.delete(node)
        })
        schedule()
      },
      { rootMargin: '0px 0px -32px', threshold: 0.05 },
    )
    measure()
    new Set([...artwork, ...titles]).forEach((node) => observer.observe(node))
    const resize = new ResizeObserver(measure)
    resize.observe(element)
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else schedule()
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    return () => {
      observer.disconnect()
      resize.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [enabled, compact])

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
