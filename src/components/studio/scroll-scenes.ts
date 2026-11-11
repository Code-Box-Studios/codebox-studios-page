import { clamp } from './motion'

export function sceneProgress(
  position: number,
  anchors: readonly number[],
  readingEnds: readonly number[] = anchors,
) {
  if (anchors.length < 2) return 0
  for (let index = 1; index < anchors.length; index++) {
    if (position <= anchors[index]) {
      const start = Math.min(
        anchors[index],
        Math.max(anchors[index - 1], readingEnds[index - 1] ?? anchors[index - 1]),
      )
      const local = clamp((position - start) / Math.max(1, anchors[index] - start))
      return (index - 1 + local) / (anchors.length - 1)
    }
  }
  return 1
}

export function readingSceneStops(
  chapters: readonly { top: number; height: number }[],
  readingLine: number,
  availableHeight: number,
) {
  const stops: number[] = []
  for (const chapter of chapters) {
    const start = chapter.top - readingLine
    stops.push(start)
    if (availableHeight <= 0) continue
    const remaining = Math.max(0, chapter.height - availableHeight)
    for (
      let offset = availableHeight * 0.85;
      offset < remaining;
      offset += availableHeight * 0.85
    ) {
      stops.push(start + offset)
    }
    if (remaining > 0) stops.push(start + remaining)
  }
  return stops
}

export function nextSceneStop(
  position: number,
  from: number,
  stops: readonly number[],
  viewportHeight: number,
) {
  if (stops.length < 2 || Math.abs(position - from) < 12) return null
  const direction = Math.sign(position - from)
  const first = stops[0],
    last = stops[stops.length - 1]
  const approach = Math.min(180, viewportHeight * 0.35)
  if (position < first - approach || position > last + approach) return null
  if ((position < first && direction < 0) || (position > last && direction > 0)) return null
  if (stops.some((stop) => Math.abs(stop - position) <= 12)) return null
  return direction > 0
    ? (stops.find((stop) => stop > position) ?? null)
    : ([...stops].reverse().find((stop) => stop < position) ?? null)
}
