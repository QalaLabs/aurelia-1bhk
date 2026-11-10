import { useMemo } from 'react'
import * as THREE from 'three'
import type { Vec3 } from '../../types/apartment.ts'

const cache = new Map<string, THREE.BoxGeometry>()

export function getBox(width: number, height: number, depth: number, tile = 2) {
  const key = `${width.toFixed(3)}|${height.toFixed(3)}|${depth.toFixed(3)}|${tile}`
  const cached = cache.get(key)
  if (cached) return cached

  const geometry = new THREE.BoxGeometry(width, height, depth)
  const uv = geometry.getAttribute('uv')
  const faces: [number, number][] = [
    [depth, height],
    [depth, height],
    [width, depth],
    [width, depth],
    [width, height],
    [width, height],
  ]
  for (let face = 0; face < 6; face += 1) {
    const faceSize = faces[face]
    if (!faceSize) continue
    const uScale = faceSize[0] / tile
    const vScale = faceSize[1] / tile
    for (let corner = 0; corner < 4; corner += 1) {
      const index = face * 4 + corner
      uv.setXY(index, uv.getX(index) * uScale, uv.getY(index) * vScale)
    }
  }
  uv.needsUpdate = true
  cache.set(key, geometry)
  return geometry
}

export function Box({
  size,
  position,
  rotation,
  material,
  tile = 2,
  shadow = true,
  pick = false,
}: {
  size: Vec3
  position?: Vec3
  rotation?: Vec3
  material: THREE.Material
  tile?: number
  shadow?: boolean
  pick?: boolean
}) {
  const geometry = useMemo(
    () => getBox(size[0], size[1], size[2], tile),
    [size[0], size[1], size[2], tile],
  )
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      castShadow={shadow}
      receiveShadow={shadow}
      dispose={null}
      raycast={pick ? undefined : () => null}
    />
  )
}

export function Cylinder({
  radius,
  height,
  position,
  material,
  segments = 12,
  shadow = true,
}: {
  radius: number | [number, number]
  height: number
  position?: Vec3
  material: THREE.Material
  segments?: number
  shadow?: boolean
}) {
  const top = Array.isArray(radius) ? radius[0] : radius
  const bottom = Array.isArray(radius) ? radius[1] : radius
  return (
    <mesh
      position={position}
      material={material}
      castShadow={shadow}
      receiveShadow={shadow}
      raycast={() => null}
    >
      <cylinderGeometry args={[top, bottom, height, segments]} />
    </mesh>
  )
}
