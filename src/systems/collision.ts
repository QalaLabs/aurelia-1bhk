import { RAIL_COLLIDERS, WALLS, WALK_ZONES } from '../data/layout.ts'

const COLLIDERS = [...WALLS, ...RAIL_COLLIDERS]
const BODY = 0.42

function hitsSolid(x: number, z: number) {
  for (const wall of COLLIDERS) {
    const dx = wall.b[0] - wall.a[0]
    const dz = wall.b[1] - wall.a[1]
    const len2 = dx * dx + dz * dz
    if (len2 < 1e-6) continue
    const len = Math.sqrt(len2)
    const raw = ((x - wall.a[0]) * dx + (z - wall.a[1]) * dz) / len2
    const t = Math.min(1, Math.max(0, raw))
    const cx = wall.a[0] + dx * t
    const cz = wall.a[1] + dz * t
    const dist = Math.hypot(x - cx, z - cz)
    if (dist > BODY + wall.thickness / 2) continue
    const along = t * len
    const door = wall.openings.some(
      (op) =>
        op.sill < 0.25 &&
        op.height > 6 &&
        Math.abs(along - op.at) < op.width / 2 - 0.2,
    )
    if (door) continue
    return true
  }
  return false
}

const FURNITURE = [
  { x0: 1.7, z0: 3.35, x1: 8.9, z1: 6.35 },
  { x0: 3.65, z0: 6.9, x1: 7.15, z1: 8.8 },
  { x0: 0.5, z0: 11.25, x1: 6.9, z1: 13 },
  { x0: 15.9, z0: 5.95, x1: 22.5, z1: 11.05 },
  { x0: 16.15, z0: 4.5, x1: 17.55, z1: 5.8 },
  { x0: 16.15, z0: 11.05, x1: 17.55, z1: 12.35 },
  { x0: 15.7, z0: 0.05, x1: 21.2, z1: 2.15 },
  { x0: 0.05, z0: 13.7, x1: 2.15, z1: 19.2 },
  { x0: 2.15, z0: 19.35, x1: 7.65, z1: 21.3 },
  { x0: 5.35, z0: 13.45, x1: 7.75, z1: 15.65 },
  { x0: 9.2, z0: 20.15, x1: 12, z1: 21.25 },
  { x0: 18.6, z0: 16.95, x1: 21.1, z1: 17.85 },
  { x0: 20.9, z0: 13.65, x1: 22.45, z1: 16.75 },
  { x0: 20.95, z0: 18.85, x1: 22.15, z1: 20.55 },
  { x0: 6.6, z0: -3.15, x1: 7.9, z1: -1.85 },
]

function hitsFurniture(x: number, z: number) {
  const pad = 0.12
  return FURNITURE.some(
    (box) => x >= box.x0 - pad && x <= box.x1 + pad && z >= box.z0 - pad && z <= box.z1 + pad,
  )
}

export function canOccupy(x: number, z: number) {
  const inside = WALK_ZONES.some(
    (zone) => x >= zone.x0 && x <= zone.x1 && z >= zone.z0 && z <= zone.z1,
  )
  if (!inside) return false
  return !hitsSolid(x, z) && !hitsFurniture(x, z)
}
