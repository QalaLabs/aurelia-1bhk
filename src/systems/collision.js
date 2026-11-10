import { RAIL_COLLIDERS, WALLS, WALK_ZONES } from '../data/layout.ts';
const COLLIDERS = [...WALLS, ...RAIL_COLLIDERS];
const BODY = 0.42;
function hitsSolid(x, z) {
    for (const wall of COLLIDERS) {
        const dx = wall.b[0] - wall.a[0];
        const dz = wall.b[1] - wall.a[1];
        const len2 = dx * dx + dz * dz;
        if (len2 < 1e-6)
            continue;
        const len = Math.sqrt(len2);
        const raw = ((x - wall.a[0]) * dx + (z - wall.a[1]) * dz) / len2;
        const t = Math.min(1, Math.max(0, raw));
        const cx = wall.a[0] + dx * t;
        const cz = wall.a[1] + dz * t;
        const dist = Math.hypot(x - cx, z - cz);
        if (dist > BODY + wall.thickness / 2)
            continue;
        const along = t * len;
        const door = wall.openings.some((op) => op.sill < 0.25 &&
            op.height > 6 &&
            Math.abs(along - op.at) < op.width / 2 - 0.2);
        if (door)
            continue;
        return true;
    }
    return false;
}
export function canOccupy(x, z) {
    const inside = WALK_ZONES.some((zone) => x >= zone.x0 && x <= zone.x1 && z >= zone.z0 && z <= zone.z1);
    if (!inside)
        return false;
    return !hitsSolid(x, z);
}
