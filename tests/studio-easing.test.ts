import assert from 'node:assert/strict'
import { test } from 'node:test'
import { sampleSceneMotion } from '../src/components/studio/scene-motion'

test('scene movement has a gentle start, a smooth middle, and a gentle finish', () => {
  assert.deepEqual(sampleSceneMotion(0, 400, 0, 1000), { position: 0, velocity: 0, done: false })
  assert.equal(sampleSceneMotion(0, 400, 250, 1000).position, 41.40625)
  assert.equal(sampleSceneMotion(0, 400, 500, 1000).position, 200)
  assert.equal(sampleSceneMotion(0, 400, 750, 1000).position, 358.59375)
  assert.deepEqual(sampleSceneMotion(0, 400, 1000, 1000), {
    position: 400,
    velocity: 0,
    done: true,
  })
  assert.ok(sampleSceneMotion(0, 400, 10, 1000).position < 0.01)
  assert.ok(sampleSceneMotion(0, 400, 990, 1000).position > 399.99)
})

test('the trajectory remains continuous when its destination changes', () => {
  const before = sampleSceneMotion(0, 400, 500, 1000)
  const after = sampleSceneMotion(before.position, 1200, 0, 1000, before.velocity)
  assert.equal(after.position, before.position)
  assert.equal(after.velocity, before.velocity)
  assert.deepEqual(sampleSceneMotion(before.position, 1200, 1000, 1000, before.velocity), {
    position: 1200,
    velocity: 0,
    done: true,
  })
})

test('reversing direction preserves velocity while braking into the previous view', () => {
  const before = sampleSceneMotion(0, 276, 516.56, 1033.12)
  assert.ok(before.velocity > 0.5)
  const after = sampleSceneMotion(before.position, 0, 0, 1016.56, before.velocity)
  assert.equal(after.position, before.position)
  assert.equal(after.velocity, before.velocity)
  assert.equal(sampleSceneMotion(before.position, 0, 1016.56, 1016.56, before.velocity).position, 0)
})

test('both directions finish exactly without overshooting or leaving an idle animation', () => {
  for (const [from, to] of [
    [0, 700],
    [700, 0],
  ]) {
    let previous = from
    for (let time = 0; time <= 1000; time += 10) {
      const current = sampleSceneMotion(from, to, time, 1000)
      assert.ok(current.position >= 0 && current.position <= 700)
      assert.ok(to > from ? current.position >= previous : current.position <= previous)
      previous = current.position
    }
    assert.equal(sampleSceneMotion(from, to, 2000, 1000).done, true)
  }
  assert.deepEqual(sampleSceneMotion(100, 100, 0, 1000), { position: 100, velocity: 0, done: true })
})
