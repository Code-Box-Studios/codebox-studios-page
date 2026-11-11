'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import type { LandingContent } from '@/payload-types'
import { clamp, cubeBlocks, cubeBlockPose, cubeCamera, layers } from './motion'
import { useStudioMotion } from './motion-provider'
import { MobileHero } from './mobile-hero'
import { compactMotionQuery } from './mobile-motion'
import { useSceneScroll } from './use-scene-scroll'

export function StudioHero({ data }: { data: NonNullable<LandingContent['hero']> }) {
  const { compact } = useStudioMotion()
  return (
    <>
      {!compact && (
        <div className="desktop-hero">
          <DesktopHero data={data} />
        </div>
      )}
      <MobileHero data={data} />
    </>
  )
}

function DesktopHero({ data }: { data: NonNullable<LandingContent['hero']> }) {
  const { enabled } = useStudioMotion()
  const track = useRef<HTMLElement>(null)
  const cube = useRef<HTMLDivElement>(null)
  const orbit = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const dial = useRef<HTMLSpanElement>(null)
  const [story, setStory] = useState({ index: 0, layer: 0, visible: false })
  const getStops = useCallback(() => {
    const element = track.current
    if (!element || matchMedia(compactMotionQuery).matches) return []
    const distance = element.offsetHeight - innerHeight
    if (distance <= 0) return []
    const top = element.getBoundingClientRect().top + scrollY
    // The four middle stops keep each software-layer explanation in view.
    return [0, ...[0.395, 0.505, 0.615, 0.725, 1].map((progress) => top + progress * distance)]
  }, [])
  useSceneScroll(enabled, track, getStops)

  useEffect(() => {
    if (matchMedia(compactMotionQuery).matches) return
    const section = track.current
    const model = cube.current
    const surface = canvas.current
    if (!section || !model || !surface) return
    const blocks = [...model.children] as HTMLElement[]
    const rings = [...(orbit.current?.children ?? [])] as HTMLElement[]
    let frame = 0
    let visible = true
    let lastPaint = 0
    let previous = ''
    let pointerX = 0,
      pointerY = 0,
      smoothX = 0,
      smoothY = 0
    const finePointer = matchMedia('(pointer: fine)')
    const context = surface.getContext('2d')
    const stars = Array.from({ length: 55 }, (_, i) => ({
      x: ((i * 313.71 + 89) % 997) / 997,
      y: ((i * 127.13 + 27) % 991) / 991,
      radius: 0.4 + (i % 4) * 0.32,
      speed: 0.25 + (i % 5) * 0.18,
    }))
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.5)
      surface.width = surface.clientWidth * dpr
      surface.height = surface.clientHeight * dpr
      context?.setTransform(dpr, 0, 0, dpr, 0, 0)
      start()
    }
    const move = (event: PointerEvent) => {
      if (enabled && finePointer.matches) {
        pointerX = (event.clientX / innerWidth) * 2 - 1
        pointerY = (event.clientY / innerHeight) * 2 - 1
      }
    }
    function render(time: number) {
      frame = 0
      if (!section || !model || !surface || document.hidden) return
      const p = enabled
        ? clamp(
            -section.getBoundingClientRect().top / Math.max(1, section.offsetHeight - innerHeight),
          )
        : 0
      const t = enabled ? time * 0.001 : 0
      smoothX += (pointerX - smoothX) * 0.045
      smoothY += (pointerY - smoothY) * 0.045
      section.style.setProperty('--p', String(p))
      const camera = cubeCamera(p, t, smoothX, smoothY)
      model.style.transform = `translateY(${camera.float}px) rotateX(${camera.pitch}deg) rotateY(${camera.yaw}deg) rotateZ(${camera.roll}deg)`
      blocks.forEach((element, i) => {
        const pose = cubeBlockPose(cubeBlocks[i], p, t)
        element.style.transform = `translate3d(${pose.x}px,${pose.y}px,${pose.z}px) rotateX(${pose.turn}deg) rotateY(${pose.turn * 0.6}deg)`
      })
      if (orbit.current)
        orbit.current.style.transform = `rotateX(${63 - p * 28 + smoothY * 4}deg) rotateZ(${-27 + t * 5}deg)`
      rings.forEach((ring, i) => {
        ring.style.transform = `rotateX(${i * 22 + p * i * 22}deg) rotateY(${i * 35}deg) rotateZ(${t * (i % 2 ? -14 : 17)}deg)`
      })
      if (dial.current)
        dial.current.textContent = `${String(Math.round(p * 360)).padStart(3, '0')}°`
      const index = p < 0.3 ? 0 : p < 0.78 ? 1 : 2
      const layer = clamp(Math.floor(((p - 0.34) / 0.44) * layers.length), 0, layers.length - 1)
      const key = `${index}:${layer}:${p >= 0.34}`
      if (key !== previous) {
        previous = key
        setStory({ index, layer, visible: p >= 0.34 && enabled })
      }
      if (context && (time - lastPaint > 40 || !enabled)) {
        lastPaint = time
        const w = surface.clientWidth,
          h = surface.clientHeight
        context.clearRect(0, 0, w, h)
        const points = stars.map((star) => ({
          ...star,
          px: (star.x * w + t * star.speed * 3 + smoothX * 10 + w) % w,
          py: (star.y * h + Math.sin(t * 0.2 + star.x * 10) * 10 + h) % h,
        }))
        points.forEach((point, i) => {
          context.beginPath()
          context.fillStyle = `rgba(255,119,89,${0.12 + 0.2 * (0.5 + 0.5 * Math.sin(t * 0.5 + i))})`
          context.arc(point.px, point.py, point.radius, 0, Math.PI * 2)
          context.fill()
          for (let j = i + 1; j < points.length; j++) {
            const other = points[j],
              distance = Math.hypot(point.px - other.px, point.py - other.py)
            if (distance < 120) {
              context.beginPath()
              context.strokeStyle = `rgba(255,119,89,${0.04 * (1 - distance / 120)})`
              context.moveTo(point.px, point.py)
              context.lineTo(other.px, other.py)
              context.stroke()
            }
          }
        })
      }
      if (enabled && visible) frame = requestAnimationFrame(render)
    }
    function start() {
      if (!frame && !document.hidden && (visible || !enabled)) frame = requestAnimationFrame(render)
    }
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else start()
    }
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting
        if (visible) start()
        else {
          cancelAnimationFrame(frame)
          frame = 0
        }
      },
      { rootMargin: '100px' },
    )
    observer.observe(section)
    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(surface)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    resize()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      sizeObserver.disconnect()
      window.removeEventListener('pointermove', move)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [enabled])

  const layer = layers[story.layer]
  const heading = data.heading || 'Software, built like architecture.'
  return (
    <section className="hero-track" ref={track} aria-label="Introduction">
      <div className="hero">
        <canvas className="particle-canvas" ref={canvas} aria-hidden />
        <div className="hero-grid" aria-hidden />
        <div className="wrap">
          <div className="hero-copy" aria-hidden={story.index !== 0} inert={story.index !== 0}>
            <p className="small-label mono hero-eyebrow">
              <span className="dot" />
              {data.eyebrow}
            </p>
            <h1>
              {heading === 'Software, built like architecture.' ? (
                <>
                  Software,
                  <br />
                  built like
                  <br />
                  <em>architecture.</em>
                </>
              ) : (
                heading
              )}
            </h1>
            <p className="hero-body">{data.body}</p>
            <div className="hero-actions">
              <a className="pill" href="#contact">
                {data.primaryCtaLabel || 'Start a project'}
              </a>
              <a className="text-link" href="#process">
                {data.secondaryCtaLabel || 'See how we work'}
              </a>
            </div>
          </div>
          <div className="hero-echo" aria-hidden={!story.visible} inert={!story.visible}>
            <p className="small-label mono">
              <span className="dot" />
              <span>{story.index === 2 ? 'The Code Box approach' : layer.title}</span>
            </p>
            <h2>
              {story.index === 2 ? (
                <>
                  One connected
                  <br />
                  <span>product.</span>
                </>
              ) : (
                <>
                  Every layer.
                  <br />
                  <span>A business purpose.</span>
                </>
              )}
            </h2>
            <p className="business-explanation">
              {story.index === 2
                ? 'The layers come together as a web app, storefront, or internal tool your team can use and build on.'
                : layer.body}
            </p>
            <div className="layer-key" role="list" aria-label="Software product layers">
              {layers.map((item) => (
                <span
                  role="listitem"
                  data-layer={item.id}
                  key={item.id}
                  className={story.index === 2 || item.id === layer.id ? 'active' : ''}
                >
                  {item.label}
                </span>
              ))}
            </div>
            <a className="business-cta" href="#work">
              See what these layers become
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden>
          <div className="orbital-system" ref={orbit}>
            {[0, 1, 2].map((i) => (
              <i className="orbital-ring" key={i}>
                <i className="orbit-dot" />
              </i>
            ))}
          </div>
          <div className="scene-grid" />
          <div className="cube-shadow" />
          <div className="wire-box" />
          <div className="cube-orbit" ref={cube}>
            {cubeBlocks.map((block) => {
              const pose = cubeBlockPose(block, 0)
              return (
                <div
                  className={`cubelet ${story.index === 2 || (story.index === 1 && block.layer === layer.id) ? 'layer-active' : ''}`}
                  data-layer={block.layer}
                  key={block.index}
                  style={
                    {
                      '--x': block.x,
                      '--y': block.y,
                      '--z': block.z,
                      transform: `translate3d(${pose.x}px,${pose.y}px,${pose.z}px)`,
                    } as CSSProperties
                  }
                >
                  {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face) => (
                    <span className={`face ${face}`} key={face}>
                      {face === 'front' ? '‹' : face === 'right' ? '›' : face === 'top' ? '/' : ''}
                    </span>
                  ))}
                </div>
              )
            })}
          </div>
          <span className="visual-label label-top">
            FIG. 01 — YOUR SOFTWARE PRODUCT
            <br />
            MODULAR BY DESIGN
          </span>
          <span className="visual-label label-bottom">
            INTERFACE / LOGIC / CONTENT / INFRASTRUCTURE
            <br />
            <span className="accent">THE PARTS BEHIND A WORKING BUSINESS.</span>
          </span>
          <div className="scene-stage">
            <strong>0{story.index + 1}</strong>
            <span>
              {
                [
                  'YOUR IDEA / ONE SYSTEM',
                  `${layer.id.toUpperCase()} / BUSINESS PURPOSE`,
                  'CONNECTED / YOUR PRODUCT',
                ][story.index]
              }
            </span>
          </div>
          <span className="scene-dial" ref={dial}>
            000°
          </span>
          <span className="visual-caption">Your product. Every layer connected.</span>
        </div>
        <p className="sr-only">
          The cube represents a software product. Its parts are the interface, application logic,
          content, and infrastructure. These layers reconnect as one system.
        </p>
        <div className="wrap hero-bottom mono">
          <span className="scroll">
            <i className="scroll-line" aria-hidden />
            Scroll to explore
          </span>
          <span>From first principle to final pixel.</span>
        </div>
      </div>
    </section>
  )
}
