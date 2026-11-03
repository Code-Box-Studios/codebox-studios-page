export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value))
const ease = (value: number) => {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}
const mix = (a: number, b: number, t: number) => a + (b - a) * t

export type Layer = 'interface' | 'logic' | 'content' | 'infrastructure'
export type CubeBlock = { x: number; y: number; z: number; index: number; layer: Layer }
export const cubeBlocks: CubeBlock[] = [-1, 0, 1]
  .flatMap((x) =>
    [-1, 0, 1].flatMap((y) =>
      [-1, 0, 1].map((z) => ({
        x,
        y,
        z,
        index: 0,
        layer: (y === -1
          ? 'interface'
          : y === 1
            ? 'infrastructure'
            : x === -1
              ? 'content'
              : 'logic') as Layer,
      })),
    ),
  )
  .map((block, index) => ({ ...block, index }))

export function cubeBlockPose(block: CubeBlock, progress: number, time = 0) {
  const p = clamp(progress)
  const explode = ease(p / 0.33)
  const helix = ease((p - 0.3) / 0.35)
  const assemble = ease((p - 0.78) / 0.22)
  const distance = 50 + explode * 31
  const angle = block.index * 0.76 + time * 0.16
  return {
    x: mix(mix(block.x * distance, Math.cos(angle) * 104, helix), block.x * 50, assemble),
    y: mix(mix(block.y * distance, (block.index - 13) * 11, helix), block.y * 50, assemble),
    z: mix(mix(block.z * distance, Math.sin(angle) * 104, helix), block.z * 50, assemble),
    turn: helix * (1 - assemble) * (block.index % 2 ? 9 : -9),
  }
}

export function cubeCamera(progress: number, time = 0, pointerX = 0, pointerY = 0) {
  const p = clamp(progress)
  return {
    yaw: -38 + Math.sin(time * 0.23) * 8 + p * 10 + clamp(pointerX, -1, 1) * 5,
    pitch: -27 + Math.sin(time * 0.19) * 2 - p * 7 + clamp(pointerY, -1, 1) * 3,
    roll: -6 + p * 8,
    float: Math.sin(time * 0.85) * 9,
  }
}

export const layers: { id: Layer; label: string; title: string; body: string }[] = [
  {
    id: 'interface',
    label: 'Interface',
    title: 'Interfaces people can use.',
    body: 'Frontend and UI/UX turn your product into a clear experience for customers and staff.',
  },
  {
    id: 'logic',
    label: 'Application logic',
    title: 'Workflows that fit your business.',
    body: 'Application logic connects schedules, roles, approvals, and the way your team works.',
  },
  {
    id: 'content',
    label: 'Content',
    title: 'Content your team controls.',
    body: 'Headless CMS and commerce let your team manage content and products without rebuilding the interface.',
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    title: 'Foundations your team can own.',
    body: 'APIs, data, integrations, and documentation keep every part connected and maintainable.',
  },
]

export function projectFrame(progress: number, count: number) {
  const raw = clamp(progress) * Math.max(0, count - 1)
  return {
    active: count ? Math.round(raw) : -1,
    poses: Array.from({ length: count }, (_, i) => {
      const local = raw - i
      const d = Math.sign(local) * ease((Math.abs(local) - 0.12) / 0.88)
      const distance = Math.abs(d)
      const pose =
        i % 4 === 0
          ? { x: d * -390, y: d * -165, z: distance * -1050, rx: d * 17, ry: d * -48, rz: d * -5 }
          : i % 4 === 1
            ? {
                x: d * -650,
                y: distance * 45,
                z: distance * -650,
                rx: d * -6,
                ry: d * -72,
                rz: d * 5,
              }
            : i % 4 === 2
              ? {
                  x: d * -170,
                  y: d * -490,
                  z: distance * -1050,
                  rx: d * 44,
                  ry: d * -22,
                  rz: d * -3,
                }
              : {
                  x: d * -520,
                  y: d * 110,
                  z: distance * -1100,
                  rx: d * -13,
                  ry: d * -78,
                  rz: d * 8,
                }
      return {
        ...pose,
        opacity: 1 - ease((Math.abs(local) - 0.82) / 0.18),
        local,
        gap: distance * 65,
        reveal: 1 - distance * 0.65,
      }
    }),
  }
}

export function fitScene(available: number, height: number) {
  return height <= 0 ? 1 : clamp((available - 24) / height)
}
