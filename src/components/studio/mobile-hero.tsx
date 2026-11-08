'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { LandingContent } from '@/payload-types'
import { cubeBlocks, layers } from './motion'
import { mobileCubeBlockPose, mobileStoryFrame } from './mobile-motion'
import { MotionControl, useStudioMotion } from './motion-provider'

const chapters = [
  {
    title: 'Start with your idea.',
    body: 'A customer portal, a storefront, or a tool for your team. We start with what your business needs to do.',
  },
  {
    title: 'Give every part a purpose.',
    body: 'The cube opens to show the parts behind your software. Each layer solves a different business need.',
  },
  {
    title: 'Bring it together.',
    body: 'One connected product. Easy for people to use, built around your workflow, and ready for your team to grow.',
  },
]

export function MobileHero({ data }: { data: NonNullable<LandingContent['hero']> }) {
  const { enabled, compact } = useStudioMotion()
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const model = useRef<HTMLDivElement>(null)
  const [chapter, setChapter] = useState(0)

  useEffect(() => {
    const element = track.current
    const cube = model.current
    if (!compact || !element || !cube) return
    const blocks = [...cube.children] as HTMLElement[]
    const copy = [...element.querySelectorAll<HTMLElement>('.mobile-chapter')]
    let frame = 0
    let visible = false
    let start = 0
    let distance = 1
    let lastPose = -1
    let lastChapter = -1

    const paint = () => {
      frame = 0
      if (document.hidden) return
      const story = mobileStoryFrame(enabled ? (scrollY - start) / distance : 0)
      if (lastChapter !== story.chapter) {
        lastChapter = story.chapter
        setChapter(story.chapter)
      }
      if (story.pose === lastPose) return
      lastPose = story.pose
      // All geometry was read on resize. This frame only writes transforms.
      blocks.forEach((block, index) => {
        const pose = mobileCubeBlockPose(cubeBlocks[index], story.pose)
        block.style.transform = `translate3d(${pose.x}px,${pose.y}px,${pose.z}px)`
      })
    }
    const schedule = () => {
      if (visible && !frame && !document.hidden) frame = requestAnimationFrame(paint)
    }
    const measure = () => {
      const readingLine = (stage.current?.offsetHeight ?? 240) + 64
      start = copy[0].getBoundingClientRect().top + scrollY - readingLine
      distance = Math.max(1, copy[2].getBoundingClientRect().top + scrollY - readingLine - start)
      schedule()
    }
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else schedule()
    }
    if (!enabled) {
      paint()
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) schedule()
      else {
        cancelAnimationFrame(frame)
        frame = 0
      }
    })
    const resize = new ResizeObserver(measure)
    observer.observe(element)
    resize.observe(element)
    if (stage.current) resize.observe(stage.current)
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resize.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [compact, enabled])

  return (
    <section className="mobile-hero" aria-label="Introduction">
      <div className="mobile-intro wrap">
        <p className="small-label mono">
          <span className="dot" />
          {data.eyebrow}
        </p>
        <h1>{data.heading || 'Software, built like architecture.'}</h1>
        <p>{data.body}</p>
        <div className="mobile-actions">
          <a className="pill" href="#contact">
            {data.primaryCtaLabel || 'Start a project'} <span aria-hidden>↗</span>
          </a>
          <a className="text-link" href="#process">
            {data.secondaryCtaLabel || 'See how we work'} <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
      <div className="mobile-story" ref={track}>
        <div className="mobile-cube-stage" ref={stage}>
          <div className="mobile-stage-top mono">
            <span>YOUR IDEA. BUILT IN LAYERS.</span>
            <MotionControl compact />
          </div>
          <div className="mobile-cube-view" aria-hidden="true">
            <div className="mobile-cube-model" ref={model}>
              {cubeBlocks.map((block) => {
                const pose = mobileCubeBlockPose(block, 0)
                return (
                  <div
                    className="mobile-cubelet"
                    data-layer={block.layer}
                    key={block.index}
                    style={
                      {
                        transform: `translate3d(${pose.x}px,${pose.y}px,${pose.z}px)`,
                      } as CSSProperties
                    }
                  >
                    {['front', 'right', 'top'].map((face) => (
                      <span className={`mobile-face mobile-${face}`} key={face} />
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mobile-story-progress mono" aria-hidden="true">
            {['Idea', 'Layers', 'Product'].map((label, index) => (
              <span key={label} data-active={chapter === index}>
                <i />0{index + 1} / {label}
              </span>
            ))}
          </div>
        </div>
        <div className="mobile-chapters wrap">
          {chapters.map((item, index) => (
            <div className="mobile-chapter" key={item.title}>
              <span className="mobile-chapter-number mono">
                0{index + 1} / {['THE IDEA', 'THE LAYERS', 'THE PRODUCT'][index]}
              </span>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
              {index === 0 && (
                <p className="mobile-scroll-cue">
                  {enabled ? 'Scroll to open the cube' : 'Three steps from idea to product'}{' '}
                  <span aria-hidden>↓</span>
                </p>
              )}
              {index === 1 && (
                <dl className="mobile-layer-list">
                  {layers.map((layer) => (
                    <div key={layer.id} data-layer={layer.id}>
                      <dt>{layer.label}</dt>
                      <dd>{layer.body}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {index === 2 && (
                <a className="text-link" href="#work">
                  See what we build <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
