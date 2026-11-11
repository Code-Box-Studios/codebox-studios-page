'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import type { LandingContent } from '@/payload-types'
import { cubeBlocks, layers } from './motion'
import { mobileCubeBlockPose, mobileStoryFrame } from './mobile-motion'
import { MotionControl, useStudioMotion } from './motion-provider'
import { readingSceneStops, sceneProgress } from './scroll-scenes'
import { useSceneScroll } from './use-scene-scroll'

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
    title: 'One connected product.',
    body: 'A web app, storefront, or internal tool that fits your workflow and grows with your team.',
  },
]

const layerSummaries = {
  interface: 'Clear screens for your customers and staff.',
  logic: 'Workflows shaped around the way your team works.',
  content: 'Content and products your team can manage.',
  infrastructure: 'Reliable data, APIs, and connections behind it all.',
}

export function MobileHero({ data }: { data: NonNullable<LandingContent['hero']> }) {
  const { enabled, compact } = useStudioMotion()
  const gestureRoot = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const model = useRef<HTMLDivElement>(null)
  const [chapter, setChapter] = useState(0)
  const getStops = useCallback(() => {
    const element = track.current
    const view = stage.current
    if (!element || !view || getComputedStyle(view).position !== 'sticky') return []
    const readingLine = view.offsetHeight + 64
    const copy = [...element.querySelectorAll<HTMLElement>('.mobile-chapter')].map((node) => ({
      top: node.getBoundingClientRect().top + scrollY,
      height: node.offsetHeight,
    }))
    return [0, ...readingSceneStops(copy, readingLine, innerHeight - readingLine - 24)]
  }, [])
  useSceneScroll(enabled && compact, gestureRoot, getStops)

  useEffect(() => {
    const element = track.current
    const cube = model.current
    if (!compact || !element || !cube) return
    const blocks = [...cube.children] as HTMLElement[]
    const copy = [...element.querySelectorAll<HTMLElement>('.mobile-chapter')]
    let frame = 0
    let visible = false
    let anchors: number[] = []
    let readingEnds: number[] = []
    let lastPose = -1
    let lastChapter = -1

    const paint = () => {
      frame = 0
      if (document.hidden) return
      const story = mobileStoryFrame(enabled ? sceneProgress(scrollY, anchors, readingEnds) : 0)
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
      anchors = copy.map((node) => node.getBoundingClientRect().top + scrollY - readingLine)
      const available = Math.max(1, innerHeight - readingLine - 24)
      readingEnds = copy.map(
        (node, index) => anchors[index] + Math.max(0, node.offsetHeight - available),
      )
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
    <section className="mobile-hero" ref={gestureRoot} aria-label="Introduction">
      <div className="mobile-intro wrap">
        <p className="small-label mono">
          <span className="dot" />
          {data.eyebrow}
        </p>
        <h1>
          {!data.heading || data.heading === 'Software, built like architecture.' ? (
            <>
              Software,
              <br />
              built like
              <br />
              <em>architecture.</em>
            </>
          ) : (
            data.heading
          )}
        </h1>
      </div>
      <div className="mobile-story" ref={track}>
        <div className="mobile-cube-stage" ref={stage}>
          <div className="mobile-stage-top mono">
            <span>THE CODE BOX APPROACH</span>
            <MotionControl compact />
          </div>
          <div className="mobile-cube-view" aria-hidden="true">
            <div className="mobile-orbit mobile-orbit-one" />
            <div className="mobile-orbit mobile-orbit-two" />
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
                      <span className={`mobile-face mobile-${face}`} key={face}>
                        {face === 'front' ? '‹' : face === 'right' ? '›' : '/'}
                      </span>
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
              {index !== 0 && (
                <span className="mobile-chapter-number mono">
                  0{index + 1} / {['THE IDEA', 'THE LAYERS', 'THE PRODUCT'][index]}
                </span>
              )}
              <h2 className={index === 0 ? 'sr-only' : undefined}>{item.title}</h2>
              <p>{index === 0 ? data.body || item.body : item.body}</p>
              {index === 0 && (
                <div className="mobile-actions">
                  <a className="pill" href="#contact">
                    {data.primaryCtaLabel || 'Start a project'}
                  </a>
                  <a className="text-link" href="#process">
                    {data.secondaryCtaLabel || 'See how we work'}
                  </a>
                </div>
              )}
              {index === 0 && (
                <p className="mobile-scroll-cue">
                  {enabled ? 'Scroll to explore each view' : 'Three steps from idea to product'}
                </p>
              )}
              {index === 1 && (
                <dl className="mobile-layer-list">
                  {layers.map((layer) => (
                    <div key={layer.id} data-layer={layer.id}>
                      <dt>{layer.label}</dt>
                      <dd>{layerSummaries[layer.id]}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {index === 2 && (
                <a className="text-link" href="#work">
                  See what we build
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
