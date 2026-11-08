import assert from 'node:assert/strict'
import { test } from 'node:test'
import { cubeBlocks } from '../src/components/studio/motion'
import { mobileStoryFrame, mobileCubeBlockPose } from '../src/components/studio/mobile-motion'

test('mobile chapters hold the cube still while their copy is read', () => {
  assert.equal(mobileStoryFrame(-1).pose, 0)
  assert.equal(mobileStoryFrame(0.1).pose, 0)
  assert.equal(mobileStoryFrame(0.4).pose, 0.5)
  assert.equal(mobileStoryFrame(0.6).pose, 0.5)
  assert.equal(mobileStoryFrame(0.9).pose, 1)
  assert.equal(mobileStoryFrame(2).pose, 1)
  assert.deepEqual(
    [0, 0.5, 1].map((p) => mobileStoryFrame(p).chapter),
    [0, 1, 2],
  )
  let previous = -1
  for (let p = 0; p <= 1; p += 0.01) {
    const frame = mobileStoryFrame(p)
    assert.ok(Number.isFinite(frame.pose) && frame.pose >= previous && frame.pose <= 1)
    previous = frame.pose
  }
})

test('mobile cube opens in three dimensions and reconnects without overlapping blocks', () => {
  for (const block of cubeBlocks) {
    assert.deepEqual(mobileCubeBlockPose(block, 0), {
      x: block.x * 50,
      y: block.y * 50,
      z: block.z * 50,
    })
    assert.deepEqual(mobileCubeBlockPose(block, 1), mobileCubeBlockPose(block, 0))
  }
  const open = cubeBlocks.map((block) => mobileCubeBlockPose(block, 0.5))
  assert.equal(new Set(open.map((p) => `${p.x}:${p.y}:${p.z}`)).size, 27)
  for (const axis of ['x', 'y', 'z'] as const) {
    assert.ok(Math.max(...open.map((p) => p[axis])) > 50)
    assert.ok(Math.min(...open.map((p) => p[axis])) < -50)
  }
})
