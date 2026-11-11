import { clamp } from './motion'

// One easing curve owns the transition. Both velocity and acceleration reach zero at its ends.
export function sampleSceneMotion(
  from: number,
  to: number,
  elapsed: number,
  duration: number,
  initialVelocity = 0,
) {
  if (duration <= 0 || from === to || elapsed >= duration) {
    return { position: to, velocity: 0, done: true }
  }
  const t = clamp(elapsed / duration)
  const distance = to - from
  const velocity = initialVelocity * duration
  const a = 10 * distance - 6 * velocity
  const b = -15 * distance + 8 * velocity
  const c = 6 * distance - 3 * velocity
  return {
    position: from + velocity * t + a * t ** 3 + b * t ** 4 + c * t ** 5,
    velocity: (velocity + 3 * a * t ** 2 + 4 * b * t ** 3 + 5 * c * t ** 4) / duration,
    done: false,
  }
}
