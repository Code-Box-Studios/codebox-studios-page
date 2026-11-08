import { clamp, type CubeBlock } from './motion'

export const compactMotionQuery = '(max-width: 760px), (max-width: 1024px) and (pointer: coarse)'

const smooth = (value: number) => {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}

// Leave a reading pause at each chapter, with short transitions between them.
export function mobileStoryFrame(progress: number) {
  const p = clamp(progress)
  const pose = p < 0.5 ? smooth((p - 0.12) / 0.26) * 0.5 : 0.5 + smooth((p - 0.62) / 0.26) * 0.5
  return { pose, chapter: Math.round(p * 2) }
}

export function mobileCubeBlockPose(block: CubeBlock, progress: number) {
  const open = 1 - Math.abs(clamp(progress) * 2 - 1)
  const distance = 50 + open * 24
  return { x: block.x * distance, y: block.y * distance, z: block.z * distance }
}
