export type PathId =
  | 'full'
  | 'entrance'
  | 'living'
  | 'kitchen'
  | 'bedroom'
  | 'bathroom'
  | 'balcony'
  | 'hero'

export type Pose = {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
}

type Keyframe = Pose & { t: number }

export const PATH_LABELS: Record<PathId, string> = {
  full: 'Full apartment tour',
  entrance: 'Entrance reveal',
  living: 'Living room',
  kitchen: 'Kitchen',
  bedroom: 'Bedroom',
  bathroom: 'Bathroom',
  balcony: 'Balcony',
  hero: 'Hero orbit',
}

const FULL: Keyframe[] = [
  { t: 0, position: [42, 28, 40], target: [13, 3, 10], fov: 32 },
  { t: 0.07, position: [30, 18, 30], target: [14, 4, 14], fov: 34 },
  { t: 0.13, position: [14.6, 8.5, 27], target: [14.4, 4.5, 18], fov: 36 },
  { t: 0.18, position: [14.5, 5.5, 23.4], target: [14.3, 4.2, 16], fov: 40 },
  { t: 0.24, position: [14.3, 5.35, 18.6], target: [13.2, 3.4, 14.5], fov: 42 },
  { t: 0.3, position: [10.8, 5.25, 12.6], target: [6.5, 3.2, 7], fov: 44 },
  { t: 0.36, position: [3.4, 5.2, 2.7], target: [7.2, 3, 9], fov: 42 },
  { t: 0.43, position: [8.8, 5.15, 2.5], target: [5.2, 2.8, 9.5], fov: 40 },
  { t: 0.48, position: [10.6, 5.3, 11.6], target: [8, 3.4, 15.5], fov: 42 },
  { t: 0.53, position: [12.2, 5.35, 16.6], target: [6, 3.4, 17.4], fov: 42 },
  { t: 0.58, position: [6.4, 5.45, 17.7], target: [2.2, 3.3, 17], fov: 40 },
  { t: 0.64, position: [5.5, 5.4, 19.1], target: [2.6, 3.2, 18], fov: 38 },
  { t: 0.69, position: [14.8, 5.35, 16.2], target: [17.6, 3.6, 13.4], fov: 42 },
  { t: 0.73, position: [17.7, 5.3, 14.5], target: [18.6, 3.4, 8.5], fov: 40 },
  { t: 0.78, position: [18.6, 5.28, 9.6], target: [20.8, 3.1, 7.2], fov: 38 },
  { t: 0.83, position: [23.4, 5.22, 8.4], target: [18.6, 3, 7.2], fov: 36 },
  { t: 0.875, position: [23.4, 5.4, 15], target: [24.4, 3.5, 19.2], fov: 40 },
  { t: 0.91, position: [17.4, 5.28, 3.8], target: [10, 3.2, 3.2], fov: 42 },
  { t: 0.945, position: [7.6, 5.1, 1.4], target: [7.5, 3.2, -2], fov: 44 },
  { t: 0.968, position: [7.5, 5.05, -2.2], target: [7.4, 3.4, 6], fov: 42 },
  { t: 0.982, position: [7.5, 16, -8], target: [13, 2, 9], fov: 36 },
  { t: 0.993, position: [32, 22, 30], target: [13, 2, 10], fov: 34 },
  { t: 1, position: [42, 27, 40], target: [12.5, 1.6, 10], fov: 32 },
]

function retimed(keys: Keyframe[]): Keyframe[] {
  if (keys.length === 1) return [{ ...keys[0], t: 0 }, { ...keys[0], t: 1 }]
  const start = keys[0].t
  const span = keys[keys.length - 1].t - start || 1
  return keys.map((key) => ({ ...key, t: (key.t - start) / span }))
}

function slice(from: number, to: number): Keyframe[] {
  const inside = FULL.filter((key) => key.t >= from && key.t <= to)
  const ends = [sampleRaw(FULL, from), sampleRaw(FULL, to)]
  const merged: Keyframe[] = [
    { ...ends[0], t: from },
    ...inside.filter((key) => key.t > from + 1e-4 && key.t < to - 1e-4),
    { ...ends[1], t: to },
  ]
  return retimed(merged)
}

export const PATHS: Record<PathId, Keyframe[]> = {
  full: FULL,
  entrance: slice(0, 0.3),
  living: slice(0.3, 0.48),
  kitchen: slice(0.48, 0.66),
  bedroom: slice(0.69, 0.84),
  bathroom: slice(0.84, 0.9),
  balcony: slice(0.9, 0.972),
  hero: slice(0.968, 1),
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function lerp3(a: Keyframe['position'], b: Keyframe['position'], t: number): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
}

function smooth(t: number) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function sampleRaw(keys: Keyframe[], amount: number): Pose {
  const u = Math.min(1, Math.max(0, amount))
  let index = 0
  while (index < keys.length - 2 && u > keys[index + 1].t) index += 1
  const a = keys[index]
  const b = keys[Math.min(keys.length - 1, index + 1)]
  const span = Math.max(1e-6, b.t - a.t)
  const eased = smooth((u - a.t) / span)
  return {
    position: lerp3(a.position, b.position, eased),
    target: lerp3(a.target, b.target, eased),
    fov: lerp(a.fov, b.fov, eased),
  }
}

export function samplePath(id: PathId, amount: number): Pose {
  return sampleRaw(PATHS[id], amount)
}

export function fadeOpacity(seconds: number, duration: number) {
  const intro = Math.min(0.8, duration * 0.12)
  const outro = Math.min(1.2, duration * 0.16)
  if (seconds < intro) return 1 - seconds / intro
  if (seconds > duration - outro) return (seconds - (duration - outro)) / outro
  return 0
}
