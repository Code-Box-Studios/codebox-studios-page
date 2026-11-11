'use client'

import { useEffect, type RefObject } from 'react'
import { sceneTarget } from './scroll-scenes'
import { sampleSceneMotion } from './scene-motion'

const controls = 'a, button, summary, input, textarea, select, [contenteditable], [role="combobox"]'
const editable = 'input, textarea, select, [contenteditable], [role="combobox"]'
type Motion = {
  from: number
  to: number
  started: number
  duration: number
  velocity: number
  direction: number
}
type TouchGesture = { x: number; y: number; stops: number[]; started: boolean }

// Capture a scene gesture before native scrolling, then run one uninterrupted eased transition.
export function useSceneScroll(
  enabled: boolean,
  root: RefObject<HTMLElement | null>,
  getStops: () => number[],
) {
  useEffect(() => {
    const element = root.current
    if (!enabled || !element) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let frame = 0
    let motion: Motion | null = null
    let touch: TouchGesture | null = null
    let wheelStops: number[] | null = null
    let wheelDistance = 0
    let wheelLocked = false
    let lastWheel = -Infinity

    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
      motion = null
      touch = null
      wheelStops = null
      wheelDistance = 0
      wheelLocked = false
      lastWheel = -Infinity
    }
    const eligible = () => visible && !reduced.matches && !document.hidden
    const stops = () => {
      const maximum = Math.max(0, document.documentElement.scrollHeight - innerHeight)
      return [...new Set(getStops().map((value) => Math.max(0, Math.min(maximum, value))))]
    }
    const tick = (time: number) => {
      frame = 0
      if (!motion || !eligible()) return stop()
      const current = sampleSceneMotion(
        motion.from,
        motion.to,
        time - motion.started,
        motion.duration,
        motion.velocity,
      )
      window.scrollTo({ top: current.position, behavior: 'instant' })
      if (current.done) motion = null
      else frame = requestAnimationFrame(tick)
    }
    const start = (target: number, direction: number) => {
      const now = performance.now()
      const velocity = motion
        ? sampleSceneMotion(
            motion.from,
            motion.to,
            now - motion.started,
            motion.duration,
            motion.velocity,
          ).velocity
        : 0
      motion = {
        from: scrollY,
        to: target,
        started: now,
        duration: Math.min(1350, 1000 + Math.abs(target - scrollY) * 0.12),
        velocity,
        direction,
      }
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const wheel = (event: WheelEvent) => {
      if (
        !eligible() ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.defaultPrevented ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      )
        return
      const now = performance.now()
      if (now - lastWheel > 180) {
        wheelStops = null
        wheelDistance = 0
        wheelLocked = false
      }
      lastWheel = now
      const distance =
        event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1)
      const direction = Math.sign(distance)
      if (!direction) return
      const targets = wheelStops ?? (wheelStops = stops())
      const target = sceneTarget(scrollY, direction, targets, innerHeight)
      if (target === null) {
        if (!motion) return
        if (direction !== motion.direction) {
          stop()
          return
        }
        if (event.cancelable) event.preventDefault()
        return
      }
      if (!event.cancelable) return
      event.preventDefault()
      if (motion && direction === motion.direction) {
        wheelLocked = true
        return
      }
      if (!motion && wheelLocked) return
      if (Math.sign(wheelDistance) !== direction) wheelDistance = 0
      wheelDistance += distance
      if (Math.abs(wheelDistance) < (motion ? 40 : 1)) return
      start(target, direction)
      wheelDistance = 0
      wheelLocked = true
    }
    const touchStart = (event: TouchEvent) => {
      stop()
      if (!eligible() || event.touches.length !== 1) return
      if (event.target instanceof Element && event.target.closest(editable)) return
      const targets = stops()
      if (targets.length < 2) return
      const point = event.touches[0]
      touch = { x: point.clientX, y: point.clientY, stops: targets, started: false }
    }
    const touchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return stop()
      if (!touch || !eligible()) return
      if (document.getSelection()?.isCollapsed === false) {
        touch = null
        return
      }
      const point = event.touches[0]
      const distance = touch.y - point.clientY
      if (Math.abs(distance) < 4) return
      if (Math.abs(point.clientX - touch.x) > Math.abs(distance)) {
        touch = null
        return
      }
      const direction = Math.sign(distance)
      const target = sceneTarget(scrollY, direction, touch.stops, innerHeight)
      if (target === null && !motion) {
        touch = null
        return
      }
      if (!event.cancelable) {
        touch = null
        return
      }
      event.preventDefault()
      if (!touch.started && Math.abs(distance) >= 14 && target !== null) {
        touch.started = true
        start(target, direction)
      }
    }
    const touchEnd = () => {
      touch = null
    }
    const pointer = (event: PointerEvent) => {
      if (
        event.pointerType !== 'touch' ||
        !(event.target instanceof Node) ||
        !element.contains(event.target) ||
        (event.target instanceof Element && event.target.closest(controls))
      )
        stop()
    }
    const outsideWheel = (event: WheelEvent) => {
      if (motion && (!(event.target instanceof Node) || !element.contains(event.target))) stop()
    }
    const key = (event: KeyboardEvent) => {
      if (['Escape', 'Home', 'End'].includes(event.key)) return stop()
      if (!eligible() || event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented)
        return
      if (event.target instanceof Element && event.target.closest(controls)) return
      const direction =
        ['ArrowDown', 'PageDown'].includes(event.key) || (event.key === ' ' && !event.shiftKey)
          ? 1
          : ['ArrowUp', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey)
            ? -1
            : 0
      if (!direction) return
      const target = sceneTarget(scrollY, direction, stops(), innerHeight)
      if (target === null) {
        if (!motion) return
        if (direction !== motion.direction) {
          stop()
          return
        }
      }
      if (!event.cancelable) return
      event.preventDefault()
      if (motion && (direction === motion.direction || event.repeat)) return
      if (target !== null) start(target, direction)
    }
    const click = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest(controls)) stop()
    }
    const visibility = () => {
      if (document.hidden) stop()
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (!visible) stop()
      },
      { rootMargin: '180px 0px' },
    )
    observer.observe(element)
    // Only the 3D region has blocking gesture handlers; the rest of the page stays native.
    element.addEventListener('wheel', wheel, { passive: false })
    element.addEventListener('touchstart', touchStart, { passive: true })
    element.addEventListener('touchmove', touchMove, { passive: false })
    element.addEventListener('touchend', touchEnd, { passive: true })
    element.addEventListener('touchcancel', stop, { passive: true })
    document.addEventListener('pointerdown', pointer, true)
    document.addEventListener('wheel', outsideWheel, { passive: true, capture: true })
    document.addEventListener('keydown', key)
    document.addEventListener('click', click, true)
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('resize', stop, { passive: true })
    reduced.addEventListener('change', stop)
    return () => {
      stop()
      observer.disconnect()
      element.removeEventListener('wheel', wheel)
      element.removeEventListener('touchstart', touchStart)
      element.removeEventListener('touchmove', touchMove)
      element.removeEventListener('touchend', touchEnd)
      element.removeEventListener('touchcancel', stop)
      document.removeEventListener('pointerdown', pointer, true)
      document.removeEventListener('wheel', outsideWheel, true)
      document.removeEventListener('keydown', key)
      document.removeEventListener('click', click, true)
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('resize', stop)
      reduced.removeEventListener('change', stop)
    }
  }, [enabled, root, getStops])
}
