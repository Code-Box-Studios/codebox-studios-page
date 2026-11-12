'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { LandingContent } from '@/payload-types'
import { clamp, fitScene, projectFrame } from './motion'
import { useStudioMotion, MotionControl } from './motion-provider'
import { ProjectArt } from './project-art'
import { resolveProject } from './projects-data'
import { useSceneScroll } from './use-scene-scroll'

export function ProjectJourney({ data }: { data: NonNullable<LandingContent['portfolio']> }) {
  const projects = useMemo(() => (data.items ?? []).map(resolveProject), [data.items])
  const { enabled, compact } = useStudioMotion()
  const [short, setShort] = useState(false)
  const [active, setActive] = useState(0)
  const [touring, setTouring] = useState(false)
  const section = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const scenes = useRef<(HTMLElement | null)[]>([])
  const tour = useRef(0)
  const animated = enabled && !compact && !short && projects.length > 1
  const getStops = useCallback(() => {
    const element = section.current
    if (!element || projects.length < 2) return []
    const distance = element.offsetHeight - innerHeight
    const top = element.getBoundingClientRect().top + scrollY
    return Array.from(
      { length: projects.length },
      (_, index) => top + (distance * index) / (projects.length - 1),
    )
  }, [projects.length])
  useSceneScroll(animated && !touring, section, getStops)
  const stopTour = useCallback(() => {
    cancelAnimationFrame(tour.current)
    tour.current = 0
    setTouring(false)
  }, [])

  useEffect(() => {
    const query = matchMedia('(max-height: 320px)')
    const change = () => setShort(query.matches)
    change()
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])

  useEffect(() => {
    stopTour()
    const element = section.current,
      stage = viewport.current
    if (!element || !stage || !projects.length) return
    if (!animated) {
      scenes.current.forEach((scene) => {
        if (!scene) return
        scene.style.transform = 'none'
        scene.style.opacity = '1'
        scene.style.removeProperty('z-index')
        scene.style.setProperty('--screen-drift', '0px')
        scene.style.setProperty('--component-gap', '0px')
        scene.style.setProperty('--screen-reveal', '1')
      })
      return
    }
    let frame = 0
    let last = -1
    let disposed = false
    function update() {
      frame = 0
      if (!element || !stage || disposed) return
      const progress = clamp(
        -element.getBoundingClientRect().top / Math.max(1, element.offsetHeight - innerHeight),
      )
      const result = projectFrame(progress, projects.length)
      element.style.setProperty('--journey-turn', animated ? `${progress * 130}deg` : '0deg')
      if (last !== result.active) {
        last = result.active
        setActive(result.active)
      }
      scenes.current.forEach((scene, index) => {
        if (!scene || !result.poses[index]) return
        const pose = result.poses[index]
        const mobile = innerWidth < 760 ? 0.58 : 1
        const fit = fitScene(stage.clientHeight, scene.offsetHeight)
        scene.style.transform = animated
          ? `translate3d(calc(-50% + ${pose.x * mobile}px),calc(-50% + ${pose.y * mobile}px),${pose.z}px) rotateX(${pose.rx}deg) rotateY(${pose.ry}deg) rotateZ(${pose.rz}deg) scale(${fit})`
          : 'none'
        scene.style.opacity = animated ? String(pose.opacity) : '1'
        scene.style.zIndex = String(10 - Math.round(Math.abs(pose.local) * 3))
        scene.style.setProperty(
          '--screen-drift',
          animated ? `${clamp(pose.local, -1, 1) * 22}px` : '0px',
        )
        scene.style.setProperty('--component-gap', animated ? `${pose.gap}px` : '0px')
        scene.style.setProperty('--screen-reveal', animated ? String(pose.reveal) : '1')
      })
    }
    const schedule = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(stage)
    scenes.current.forEach((scene) => {
      if (scene) observer.observe(scene)
    })
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    update()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [animated, projects.length, stopTour])

  useEffect(() => {
    if (!animated) return
    const key = (event: KeyboardEvent) => {
      if (
        event.key === ' ' &&
        event.target instanceof Element &&
        event.target.closest('.journey-tour')
      )
        return
      if (
        ['Escape', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(
          event.key,
        )
      )
        stopTour()
    }
    const visibility = () => {
      if (document.hidden) stopTour()
    }
    const touch = (event: TouchEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('.journey-tour')) stopTour()
    }
    const click = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href]')) stopTour()
    }
    const leaving = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) stopTour()
    })
    if (section.current) leaving.observe(section.current)
    window.addEventListener('wheel', stopTour, { passive: true })
    window.addEventListener('touchstart', touch, { passive: true })
    window.addEventListener('keydown', key)
    document.addEventListener('click', click, true)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      cancelAnimationFrame(tour.current)
      leaving.disconnect()
      window.removeEventListener('wheel', stopTour)
      window.removeEventListener('touchstart', touch)
      window.removeEventListener('keydown', key)
      document.removeEventListener('click', click, true)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [animated, stopTour])

  function goTo(index: number) {
    stopTour()
    const target = clamp(index, 0, projects.length - 1)
    if (!animated) {
      scenes.current[target]?.scrollIntoView({ behavior: 'instant', block: 'center' })
      return
    }
    const element = section.current
    if (element)
      window.scrollTo({
        top:
          scrollY +
          element.getBoundingClientRect().top +
          (target / Math.max(1, projects.length - 1)) * (element.offsetHeight - innerHeight),
        behavior: 'smooth',
      })
  }

  function toggleTour() {
    if (tour.current) {
      stopTour()
      return
    }
    if (!animated) {
      goTo(0)
      return
    }
    const element = section.current
    if (!element) return
    const top = scrollY + element.getBoundingClientRect().top,
      distance = element.offsetHeight - innerHeight,
      began = performance.now()
    setTouring(true)
    const advance = (time: number) => {
      const progress = clamp((time - began) / (projects.length * 4000))
      window.scrollTo({ top: top + progress * distance, behavior: 'instant' })
      if (progress < 1) tour.current = requestAnimationFrame(advance)
      else stopTour()
    }
    tour.current = requestAnimationFrame(advance)
  }

  if (!projects.length) return null
  const current = projects[clamp(active, 0, projects.length - 1)]
  return (
    <section
      id="work"
      ref={section}
      className="project-journey"
      data-animated={animated ? 'on' : 'off'}
      style={
        {
          '--journey-height': `${(projects.length + 1.6) * 100}svh`,
          '--project-accent': current.accent,
        } as CSSProperties
      }
      aria-label={data.eyebrow || 'Selected projects'}
    >
      <div className="journey-sticky">
        <div className="journey-heading wrap">
          <div>
            <span className="mono">02 / {data.eyebrow || 'Selected projects'}</span>
            <h2>
              What we build.
              <br />
              <span>Why it matters.</span>
            </h2>
          </div>
          <div className="journey-intro">
            <p>
              {data.heading}
              <span>
                {projects.some((project) => project.concept)
                  ? 'Interface concepts are marked below.'
                  : 'Software built around your business.'}
              </span>
            </p>
            <div className="journey-actions">
              <button
                type="button"
                className="journey-tour"
                aria-pressed={touring}
                onClick={toggleTour}
              >
                {touring ? 'Pause tour' : 'Explore projects'}
              </button>
              <MotionControl compact />
            </div>
          </div>
        </div>
        <div className="project-viewport" ref={viewport}>
          <div className="journey-floor" aria-hidden />
          <div className="journey-ring" aria-hidden />
          <span className="journey-ghost" aria-hidden>
            {String(active + 1).padStart(2, '0')}
          </span>
          {projects.map((project, index) => (
            <article
              key={project.id ?? index}
              ref={(node) => {
                scenes.current[index] = node
              }}
              className={`project-scene ${!animated || active === index ? 'scene-focused' : ''}`}
              data-scene={index % 4}
              aria-label={`${project.title}${project.concept ? ' — illustrative concept' : ''}`}
              aria-hidden={animated && active !== index}
              inert={animated && active !== index}
              style={{ '--project-accent': project.accent } as CSSProperties}
            >
              <div className="scene-topline mono">
                <span>PROJECT / {String(index + 1).padStart(2, '0')}</span>
                <span>{project.tag}</span>
              </div>
              <div className="project">
                <div className={`project-art ${project.kind === 'system' ? 'design-art' : ''}`}>
                  {project.image?.url ? (
                    <Image
                      src={project.image.url}
                      alt={project.image.alt || project.title}
                      fill
                      sizes="(max-width:760px) 90vw, 930px"
                      className="project-upload"
                    />
                  ) : (
                    <>
                      <span className="concept-tag">
                        {project.concept ? 'Interface concept' : 'Product illustration'} /{' '}
                        {project.tag}
                      </span>
                      <ProjectArt kind={project.kind} />
                    </>
                  )}
                </div>
                <div className="project-caption">
                  <div>
                    <span className="mono">{project.service}</span>
                    <h3>{project.line}</h3>
                    {project.layers && <p className="project-connection">{project.layers}</p>}
                    <p className="project-body">{project.body}</p>
                  </div>
                  <a
                    className="project-link"
                    href={project.href || '#contact'}
                    target={project.href ? '_blank' : undefined}
                    rel={project.href ? 'noopener noreferrer' : undefined}
                    aria-label={project.href ? `Visit ${project.title} website` : `Discuss ${project.title}`}
                  >
                    {project.href ? 'Visit website' : 'Discuss project'}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="journey-footer wrap">
          <div className="project-story">
            <span className="mono project-category">{current.category}</span>
            <h3 className="project-name">{current.title}</h3>
            <p className="project-description">{current.body}</p>
          </div>
          <div className="journey-navigation">
            <div className="journey-mode mono">
              {String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} —{' '}
              {current.tag}
            </div>
            <div className="journey-controls">
              <button
                type="button"
                className="journey-prev"
                aria-label="Previous project"
                disabled={active === 0}
                onClick={() => goTo(active - 1)}
              >
                <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
              </button>
              <div className="journey-dots" role="group" aria-label="Choose a project">
                {projects.map((project, index) => (
                  <button
                    key={project.id ?? index}
                    className={`journey-dot ${index === active ? 'selected' : ''}`}
                    type="button"
                    aria-label={`Show ${project.title}`}
                    aria-pressed={index === active}
                    onClick={() => goTo(index)}
                    style={{ '--fill': index === active ? '100%' : '0%' } as CSSProperties}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <i />
                  </button>
                ))}
              </div>
              <button
                className="journey-next"
                type="button"
                aria-label="Next project"
                disabled={active === projects.length - 1}
                onClick={() => goTo(active + 1)}
              >
                <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
              </button>
            </div>
            <span className="journey-hint mono">Scroll to continue</span>
          </div>
        </div>
      </div>
    </section>
  )
}
