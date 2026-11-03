import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  cubeBlocks,
  cubeBlockPose,
  cubeCamera,
  projectFrame,
  fitScene,
} from '../src/components/studio/motion'

test('the product starts and finishes as the same volumetric 27-block cube', () => {
  assert.equal(cubeBlocks.length, 27)
  assert.equal(new Set(cubeBlocks.map((b) => `${b.x}:${b.y}:${b.z}`)).size, 27)
  for (const block of cubeBlocks) {
    const start = cubeBlockPose(block, 0)
    const finish = cubeBlockPose(block, 1)
    assert.deepEqual(finish, start)
    assert.deepEqual([start.x, start.y, start.z], [block.x * 50, block.y * 50, block.z * 50])
  }
})

test('separated blocks retain a genuinely three-dimensional arrangement', () => {
  const points = [0, 1, 3, 10].map((i) => cubeBlockPose(cubeBlocks[i], 0.56))
  const vectors = points
    .slice(1)
    .map((p) => [p.x - points[0].x, p.y - points[0].y, p.z - points[0].z])
  const [a, b, c] = vectors
  const volume =
    a[0] * (b[1] * c[2] - b[2] * c[1]) -
    a[1] * (b[0] * c[2] - b[2] * c[0]) +
    a[2] * (b[0] * c[1] - b[1] * c[0])
  assert.ok(Math.abs(volume) > 1, 'the blocks must not collapse into a plane')
})

test('camera always exposes top and side faces, including pointer extremes', () => {
  for (let time = 0; time < 100; time += 5)
    for (const progress of [0, 0.5, 1])
      for (const pointer of [-1, 1]) {
        const camera = cubeCamera(progress, time, pointer, pointer)
        assert.ok(camera.yaw < -10 && camera.yaw > -60)
        assert.ok(camera.pitch < -18 && camera.pitch > -42)
      }
})

test('project navigation handles empty, single, and arbitrary CMS portfolios', () => {
  assert.equal(projectFrame(0.5, 0).active, -1)
  assert.equal(projectFrame(0.8, 1).active, 0)
  for (const count of [2, 4, 7])
    for (let i = 0; i < count; i++) {
      const frame = projectFrame(i / (count - 1), count)
      assert.equal(frame.active, i)
      assert.equal(frame.poses[i].opacity, 1)
      assert.ok(frame.poses[i].x === 0)
      assert.ok(frame.poses[i].z === 0)
    }
  assert.equal(projectFrame(-10, 4).active, 0)
  assert.equal(projectFrame(10, 4).active, 3)
})

test('a focused project fits a short viewport without scaling beyond its natural size', () => {
  for (const available of [75, 150, 300, 800]) {
    const scale = fitScene(available, 420)
    assert.ok(scale >= 0 && scale <= 1)
    assert.ok(420 * scale <= Math.max(0, available - 24) + 0.001)
  }
  assert.equal(fitScene(0, 420), 0)
  assert.equal(fitScene(800, 0), 1)
})
