'use client'

import { useEffect, type RefObject } from 'react'
import { nextSceneStop } from './scroll-scenes'

const controls = 'a, button, summary, input, textarea, select, [contenteditable], [role="combobox"]'

// Let the browser handle each gesture, then settle once on a complete scene.
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
    let intent = false
    let touching = false
    let settling = false
    let from = scrollY
    let idle = 0
    let release = 0
    const nativeScrollEnd = 'onscrollend' in document

    const cancel = () => {
      intent = false
      clearTimeout(idle)
      clearTimeout(release)
      if (settling) window.scrollTo({ top: scrollY, behavior: 'instant' })
      settling = false
    }
    const finish = () => {
      clearTimeout(idle)
      if (settling) {
        settling = false
        clearTimeout(release)
        return
      }
      if (!intent || !visible || touching || document.hidden || reduced.matches) return
      intent = false
      const maximum = Math.max(0, document.documentElement.scrollHeight - innerHeight)
      const stops = [...new Set(getStops().map((stop) => Math.max(0, Math.min(maximum, stop))))]
      const target = nextSceneStop(scrollY, from, stops, innerHeight)
      if (target === null) return
      settling = true
      window.scrollTo({ top: target, behavior: 'smooth' })
      release = window.setTimeout(() => {
        settling = false
      }, 1500)
    }
    const arm = () => {
      if (settling) cancel()
      if (!visible || reduced.matches) return
      if (!intent) from = scrollY
      intent = true
    }
    const wheel = (event: WheelEvent) => {
      if (
        !event.ctrlKey &&
        !event.defaultPrevented &&
        Math.abs(event.deltaY) >= Math.abs(event.deltaX)
      )
        arm()
    }
    const touchStart = (event: TouchEvent) => {
      cancel()
      touching = false
      if (event.target instanceof Element && event.target.closest(controls)) return
      touching = true
      arm()
    }
    const touchEnd = () => {
      touching = false
      if (!nativeScrollEnd && intent) idle = window.setTimeout(finish, 200)
    }
    const touchCancel = () => {
      touching = false
      cancel()
    }
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') return cancel()
      if (event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented) return
      if (event.target instanceof Element && event.target.closest(controls)) return
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key))
        arm()
    }
    const scroll = () => {
      if (!nativeScrollEnd && intent && !settling) {
        clearTimeout(idle)
        idle = window.setTimeout(finish, 200)
      }
    }
    const click = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest(controls)) cancel()
    }
    const visibility = () => {
      if (document.hidden) cancel()
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (!visible) cancel()
      },
      { rootMargin: '180px 0px' },
    )
    observer.observe(element)
    window.addEventListener('wheel', wheel, { passive: true })
    window.addEventListener('touchstart', touchStart, { passive: true })
    window.addEventListener('touchend', touchEnd, { passive: true })
    window.addEventListener('touchcancel', touchCancel, { passive: true })
    window.addEventListener('pointerdown', cancel, { passive: true })
    window.addEventListener('keydown', key)
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', cancel, { passive: true })
    document.addEventListener('scrollend', finish)
    document.addEventListener('click', click, true)
    document.addEventListener('visibilitychange', visibility)
    reduced.addEventListener('change', cancel)
    return () => {
      cancel()
      observer.disconnect()
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('touchstart', touchStart)
      window.removeEventListener('touchend', touchEnd)
      window.removeEventListener('touchcancel', touchCancel)
      window.removeEventListener('pointerdown', cancel)
      window.removeEventListener('keydown', key)
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', cancel)
      document.removeEventListener('scrollend', finish)
      document.removeEventListener('click', click, true)
      document.removeEventListener('visibilitychange', visibility)
      reduced.removeEventListener('change', cancel)
    }
  }, [enabled, root, getStops])
}
