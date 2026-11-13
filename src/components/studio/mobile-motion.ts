import { clamp, type CubeBlock } from './motion'

export const compactMotionQuery = '(max-width: 760px), (max-width: 1024px) and (pointer: coarse)'

// Reading holds come from sceneProgress; the view eases only the cube illustration.
export function mobileStoryFrame(progress: number) {
  const p = clamp(progress)
  return { pose: p, chapter: Math.round(p * 2) }
}

export function mobileCubeBlockPose(block: CubeBlock, progress: number) {
  const open = 1 - Math.abs(clamp(progress) * 2 - 1)
  const distance = 50 + open * 24
  return { x: block.x * distance, y: block.y * distance, z: block.z * distance }
}
