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
    const services = [...element.querySelectorAll<HTMLElement>('[data-depth="service"]')]
    const sections = [...element.querySelectorAll<HTMLElement>('[data-depth="section"]')]
    const steps = [...element.querySelectorAll<HTMLElement>('.process-card')]
    const chapters = [...element.querySelectorAll<HTMLAnchorElement>('.chapter-rail a')]
    const marquee = element.querySelector<HTMLElement>('.kinetic-banner')
    const words = [...element.querySelectorAll<HTMLElement>('.about .word')]
    if (compact || matchMedia(compactMotionQuery).matches) {
      reveals.forEach((node) => node.classList.add('in'))
      words.forEach((node) => node.classList.add('read'))
      services.forEach((shell) => {
        const target = shell.firstElementChild as HTMLElement | null
        if (target) target.style.transform = 'none'
      })
      const bar = element.querySelector<HTMLElement>('.studio-announcement')
      const measureBar = () =>
        element.style.setProperty('--announcement-offset', `${bar?.offsetHeight ?? 0}px`)
      const barResize = new ResizeObserver(measureBar)
      if (bar) barResize.observe(bar)
      measureBar()
      // Mobile uses normal document flow; no page-wide scroll/parallax loop.
      return () => barResize.disconnect()
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        }),
      { threshold: 0.08 },
    )
    reveals.forEach((node) => observer.observe(node))

    function update() {
      frame = 0
      if (!element) return
      const height = innerHeight
      const announcementHeight =
        element.querySelector<HTMLElement>('.studio-announcement')?.offsetHeight ?? 0
      element.style.setProperty('--announcement-offset', `${announcementHeight}px`)
      element.style.setProperty(
        '--page-progress',
        String(clamp(scrollY / Math.max(1, document.documentElement.scrollHeight - height))),
      )
      const bannerTop = marquee?.getBoundingClientRect().top ?? height
      element.style.setProperty(
        '--marquee-x',
        enabled ? `${-180 - (height - bannerTop) * 0.22}px` : '0px',
      )
      element.style.setProperty('--spark-spin', enabled ? `${scrollY * 0.065}deg` : '0deg')
      services.forEach((shell) => {
        const target = shell.firstElementChild as HTMLElement | null
        const enter = clamp((height * 0.95 - shell.getBoundingClientRect().top) / (height * 0.6))
        if (target)
          target.style.transform = enabled
            ? `translate3d(${(1 - enter) * 85}px,${(1 - enter) * 35}px,${(1 - enter) * -140}px) rotateY(${(1 - enter) * -32}deg) rotateX(${(1 - enter) * 9}deg)`
            : 'none'
      })
      steps.forEach((step, i) => {
        const progress = enabled
          ? clamp((height * 0.95 - step.getBoundingClientRect().top - i * 55) / (height * 0.4))
          : 1
        step.style.setProperty('--phase-tilt', `${(1 - progress) * 24}deg`)
        step.style.setProperty('--phase-lift', `${(1 - progress) * 50}px`)
        step.style.setProperty('--phase-progress', `${progress * 100}%`)
        step.classList.toggle('phase-active', progress > 0.5)
      })
      sections.forEach((section) => {
        const progress = enabled
          ? clamp((height - section.getBoundingClientRect().top) / (height * 0.8))
          : 1
        section.style.setProperty('--section-tilt', `${(1 - progress) * 14}deg`)
        section.style.setProperty('--section-depth', `${(1 - progress) * -160}px`)
        section.style.setProperty('--section-rise', `${(1 - progress) * 70}px`)
      })
      const aboutHeading = element.querySelector('.about h2')
      const read =
        enabled && aboutHeading
          ? clamp((height * 0.8 - aboutHeading.getBoundingClientRect().top) / (height * 0.5))
          : 1
      words.forEach((word, i) =>
        word.classList.toggle('read', read > i / Math.max(1, words.length)),
      )
      let active: HTMLAnchorElement | undefined
      chapters.forEach((link) => {
        const target = element?.querySelector(link.hash)
        if (target && target.getBoundingClientRect().top < height * 0.5) active = link
      })
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
      observer.disconnect()
      resize.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
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
