'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { LandingContent } from '@/payload-types'
import { clamp } from './motion'
import { compactMotionQuery } from './mobile-motion'
import { useStudioMotion } from './motion-provider'
import { ProjectArt } from './project-art'
import { resolveProject } from './projects-data'
import './projects-ux.css'

type Project = ReturnType<typeof resolveProject>

function ProjectArtwork({ project }: { project: Project }) {
  return (
    <div className={`project-art ${project.kind === 'system' ? 'design-art' : ''}`}>
      <div className="project-art-motion">
        {project.image?.url ? (
          <Image
            src={project.image.url}
            alt={project.image.alt || project.title}
            fill
            sizes="(max-width:760px) 90vw, 55vw"
            className="project-upload"
          />
        ) : (
          <>
            <span className="concept-tag">
              {project.concept ? 'Interface concept' : 'Product illustration'} / {project.tag}
            </span>
            <ProjectArt kind={project.kind} />
          </>
        )}
      </div>
    </div>
  )
}

export function ProjectJourney({ data }: { data: NonNullable<LandingContent['portfolio']> }) {
  const projects = useMemo(() => (data.items ?? []).map(resolveProject), [data.items])
  const { enabled } = useStudioMotion()
  const [active, setActive] = useState(0)
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const stories = useRef<(HTMLElement | null)[]>([])
  const artwork = useRef<(HTMLDivElement | null)[]>([])
  const mobileFrames = useRef<(HTMLDivElement | null)[]>([])
  const displayed = useRef({ position: 0, selected: -1, ready: false })

  useEffect(() => {
    const element = section.current
    const view = stage.current
    if (!element || !view || !projects.length) return
    const compact = matchMedia(compactMotionQuery)
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let visible = true
    let viewportHeight = innerHeight
    let anchors: number[] = []
    let mobileGeometry: { top: number; height: number; artwork: HTMLElement | null }[] = []
    let lastActive = -1
    let lastPaint = 0
    let lastTarget = scrollY
    let pausedStory: number | null = null
    if (!displayed.current.ready) displayed.current.position = scrollY

    function sceneAt(position: number) {
      let index = 0
      let blend = 0
      for (let next = 1; next < anchors.length; next++) {
        if (position >= anchors[next]) {
          index = next
          continue
        }
        const window = Math.min(180, (anchors[next] - anchors[next - 1]) * 0.3)
        const progress = clamp((position - (anchors[next] - window)) / Math.max(1, window))
        blend = progress * progress * (3 - 2 * progress)
        break
      }
      return {
        index,
        blend,
        selected: clamp(index + (blend >= 0.5 ? 1 : 0), 0, projects.length - 1),
      }
    }

    function paint(time: number) {
      frame = 0
      if (!element || document.hidden || !visible) return
      const target = scrollY
      const targetScene = sceneAt(target)
      const animate = enabled && !reduced.matches
      if (lastActive !== targetScene.selected) {
        lastActive = targetScene.selected
        setActive(targetScene.selected)
      }
      // Only artwork lags behind input; text and the browser's scroll position remain native.
      if (animate) {
        pausedStory = null
        if (Math.abs(target - lastTarget) > viewportHeight) displayed.current.position = target
        const elapsed = lastPaint ? Math.min(32, Math.max(0, time - lastPaint)) : 16.67
        displayed.current.position +=
          (target - displayed.current.position) * (1 - Math.exp(-elapsed / 72))
        if (Math.abs(target - displayed.current.position) < 0.12)
          displayed.current.position = target
      }
      lastTarget = target
      lastPaint = time
      // Keep the current pose on pause. A different story still receives its own static screenshot.
      if (!animate) {
        if (pausedStory === null) pausedStory = targetScene.selected
        if (displayed.current.ready && pausedStory === targetScene.selected) return
        pausedStory = targetScene.selected
      }
      const position = animate ? displayed.current.position : target
      const { index, blend, selected } = animate ? sceneAt(position) : targetScene
      if (compact.matches) {
        mobileGeometry.forEach((item) => {
          if (!item.artwork) return
          const progress = clamp(
            (viewportHeight * 0.9 - (item.top - position)) / Math.max(1, item.height * 0.65),
          )
          const enter = 1 - progress
          item.artwork.style.transform = animate
            ? `perspective(900px) translate3d(0,${enter * 18}px,${enter * -70}px) rotateX(${enter * 5}deg) rotateY(${enter * -4}deg) scale(${1 - enter * 0.025})`
            : 'none'
        })
      } else {
        element.style.setProperty(
          '--journey-turn',
          `${(animate ? index + blend : selected) * 24}deg`,
        )
        artwork.current.slice(0, projects.length).forEach((node, itemIndex) => {
          if (!node) return
          const outgoing = itemIndex === index
          const incoming = itemIndex === index + 1 && blend > 0
          const shown = animate ? outgoing || incoming : itemIndex === selected
          node.style.visibility = shown ? 'visible' : 'hidden'
          node.style.opacity = String(
            animate ? (outgoing ? 1 - blend : incoming ? blend : 0) : shown ? 1 : 0,
          )
          if (!animate || !shown) {
            node.style.transform = 'none'
            return
          }
          const travel = outgoing ? -blend : 1 - blend
          const depth = Math.abs(travel)
          node.style.transform = `translate3d(${travel * 64}px,${depth * 20}px,${depth * -200}px) rotateX(${depth * 5}deg) rotateY(${travel * -16}deg) scale(${1 - depth * 0.055})`
        })
      }
      displayed.current.selected = selected
      displayed.current.ready = true
      if (!animate) displayed.current.position = target
      if (animate && displayed.current.position !== target) schedule()
    }
    const schedule = () => {
      if (visible && !frame && !document.hidden) frame = requestAnimationFrame(paint)
    }
    const measure = () => {
      viewportHeight = innerHeight
      const stickyTop = parseFloat(getComputedStyle(view).top) || 112
      const readingLine = compact.matches
        ? viewportHeight * 0.45
        : Math.min(viewportHeight * 0.56, stickyTop + view.offsetHeight * 0.45)
      anchors = stories.current
        .slice(0, projects.length)
        .map((node) =>
          node
            ? node.getBoundingClientRect().top + scrollY + node.offsetHeight * 0.5 - readingLine
            : 0,
        )
      mobileGeometry = mobileFrames.current.slice(0, projects.length).map((node) => ({
        top: node ? node.getBoundingClientRect().top + scrollY : 0,
        height: node?.offsetHeight ?? 0,
        artwork: node?.querySelector<HTMLElement>('.project-art-motion') ?? null,
      }))
      schedule()
    }
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) schedule()
        else {
          cancelAnimationFrame(frame)
          frame = 0
        }
      },
      { rootMargin: '120px' },
    )
    const resize = new ResizeObserver(measure)
    intersection.observe(element)
    resize.observe(element)
    resize.observe(view)
    stories.current.forEach((node) => {
      if (node) resize.observe(node)
    })
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    document.addEventListener('visibilitychange', schedule)
    reduced.addEventListener('change', schedule)
    compact.addEventListener('change', measure)
    return () => {
      cancelAnimationFrame(frame)
      intersection.disconnect()
      resize.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      document.removeEventListener('visibilitychange', schedule)
      reduced.removeEventListener('change', schedule)
      compact.removeEventListener('change', measure)
    }
  }, [enabled, projects.length])

  if (!projects.length) return null
  const currentIndex = clamp(active, 0, projects.length - 1)
  const current = projects[currentIndex]

  return (
    <section
      id="work"
      ref={section}
      className="project-journey"
      data-mode="scroll-story"
      data-effects={enabled ? 'on' : 'off'}
      style={{ '--project-accent': current.accent } as CSSProperties}
      aria-label={data.eyebrow || 'Selected projects'}
    >
      <div className="project-story-heading wrap">
        <div>
          <span className="mono">02 / {data.eyebrow || 'Selected projects'}</span>
          <h2>
            What we build.
            <br />
            <span>Why it matters.</span>
          </h2>
        </div>
        <p>
          {data.heading}
          <span>
            {projects.some((project) => project.concept)
              ? 'Interface concepts are marked below.'
              : 'Software built around your business.'}
          </span>
        </p>
      </div>
      <nav className="project-story-navigation wrap" aria-label="Project stories">
        {projects.map((project, index) => (
          <a
            key={project.id ?? index}
            href={`#project-${index + 1}`}
            aria-current={currentIndex === index ? 'location' : undefined}
          >
            <span className="mono" aria-hidden>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{project.title}</span>
          </a>
        ))}
      </nav>
      <div className="project-story-layout wrap">
        <div className="project-reading-list">
          {projects.map((project, index) => (
            <article
              key={project.id ?? index}
              ref={(node) => {
                stories.current[index] = node
              }}
              className="project-reading-panel"
              style={{ '--project-accent': project.accent } as CSSProperties}
            >
              <div
                className="project-mobile-art"
                ref={(node) => {
                  mobileFrames.current[index] = node
                }}
              >
                <ProjectArtwork project={project} />
              </div>
              <div className="project-reading-copy" id={`project-${index + 1}`}>
                <span className="mono project-reading-number">
                  PROJECT / {String(index + 1).padStart(2, '0')}
                </span>
                <span className="mono project-reading-tag">{project.service}</span>
                <h3>{project.title}</h3>
                {project.line !== project.title && (
                  <p className="project-reading-line">{project.line}</p>
                )}
                {project.concept && (
                  <span className="project-concept-label">Illustrative interface concept</span>
                )}
                {project.layers && <p className="project-reading-layers">{project.layers}</p>}
                <p className="project-reading-body">{project.body}</p>
                <a
                  className="project-link"
                  href={project.href || '#contact'}
                  target={project.href ? '_blank' : undefined}
                  rel={project.href ? 'noopener noreferrer' : undefined}
                  aria-label={
                    project.href ? `Visit ${project.title} website` : `Discuss ${project.title}`
                  }
                >
                  {project.href ? 'Visit website' : 'Discuss project'}
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="project-scroll-stage" ref={stage} aria-hidden="true">
          <div className="project-stage-atmosphere">
            <div className="project-stage-grid" />
            <div className="project-stage-ring" />
          </div>
          <span className="project-stage-number">{String(currentIndex + 1).padStart(2, '0')}</span>
          <div className="project-stage-artwork">
            {projects.map((project, index) => (
              <div
                key={project.id ?? index}
                className="project-stage-item"
                ref={(node) => {
                  artwork.current[index] = node
                }}
                style={{ '--project-accent': project.accent } as CSSProperties}
              >
                <ProjectArtwork project={project} />
              </div>
            ))}
          </div>
          <div className="project-stage-caption">
            <span className="mono">
              {String(currentIndex + 1).padStart(2, '0')} /{' '}
              {String(projects.length).padStart(2, '0')}
            </span>
            <span>{current.title}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
