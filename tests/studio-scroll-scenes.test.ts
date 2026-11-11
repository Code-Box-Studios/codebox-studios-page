import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  sceneProgress,
  readingSceneStops,
  nextSceneStop,
} from '../src/components/studio/scroll-scenes'

test('each chapter aligns its own complete cube view even when chapter heights differ', () => {
  const anchors = [100, 400, 1100]
  assert.equal(sceneProgress(0, anchors), 0)
  assert.equal(sceneProgress(100, anchors), 0)
  assert.equal(sceneProgress(250, anchors), 0.25)
  assert.equal(sceneProgress(400, anchors), 0.5)
  assert.equal(sceneProgress(750, anchors), 0.75)
  assert.equal(sceneProgress(1400, anchors), 1)
  assert.equal(sceneProgress(400, []), 0)
  assert.equal(sceneProgress(400, [100]), 0)
})

test('tall chapters get reading stops so snapping does not skip their lower content', () => {
  assert.deepEqual(
    readingSceneStops(
      [
        { top: 300, height: 180 },
        { top: 480, height: 600 },
        { top: 1080, height: 200 },
      ],
      260,
      400,
    ),
    [40, 220, 420, 820],
  )
  const stops = readingSceneStops([{ top: 300, height: 1200 }], 260, 400)
  assert.deepEqual(stops, [40, 380, 720, 840])
})

test('extra reading stops keep the current cube view complete until its copy has been read', () => {
  assert.equal(sceneProgress(220, [40, 220, 820], [40, 420, 820]), 0.5)
  assert.equal(sceneProgress(420, [40, 220, 820], [40, 420, 820]), 0.5)
  assert.equal(sceneProgress(620, [40, 220, 820], [40, 420, 820]), 0.75)
  assert.equal(sceneProgress(820, [40, 220, 820], [40, 420, 820]), 1)
})

test('a deliberate scroll settles in its direction instead of snapping backward', () => {
  const stops = [100, 400, 1100]
  assert.equal(nextSceneStop(150, 100, stops, 800), 400)
  assert.equal(nextSceneStop(350, 400, stops, 800), 100)
  assert.equal(nextSceneStop(470, 400, stops, 800), 1100)
  assert.equal(nextSceneStop(1050, 1100, stops, 800), 400)
})

test('settling leaves ordinary content, completed views, and tiny movements alone', () => {
  const stops = [100, 400, 1100]
  assert.equal(nextSceneStop(108, 100, stops, 800), null)
  assert.equal(nextSceneStop(394, 100, stops, 800), null)
  assert.equal(nextSceneStop(80, 100, stops, 800), null)
  assert.equal(nextSceneStop(1150, 1100, stops, 800), null)
  assert.equal(nextSceneStop(5000, 4800, stops, 800), null)
  assert.equal(nextSceneStop(-200, -300, stops, 800), null)
  assert.equal(nextSceneStop(200, 100, [], 800), null)
  assert.equal(nextSceneStop(80, 0, stops, 800), 100)
  assert.equal(nextSceneStop(1150, 1400, stops, 800), 1100)
})
