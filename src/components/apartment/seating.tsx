import { mats } from '../../materials/library.ts'
import type { Vec3 } from '../../types/apartment.ts'
import { Box, Cylinder } from './geometry.tsx'

export function Sofa({
  position,
  rotation = 0,
}: {
  position: Vec3
  rotation?: number
}) {
  const length = 7.2
  const depth = 3.05
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sz], index) => (
        <Cylinder
          key={index}
          radius={[0.06, 0.045]}
          height={0.32}
          position={[(sx ?? 0) * (length / 2 - 0.38), 0.16, (sz ?? 0) * (depth / 2 - 0.3)]}
          material={mats.metalDark}
        />
      ))}
      <Box size={[length - 0.2, 0.34, depth - 0.25]} position={[0, 0.5, 0]} material={mats.fabricDeep} />
      <Box size={[length - 1.05, 0.2, depth - 1.2]} position={[0, 0.74, 0.08]} material={mats.fabric} />
      {[-1, 0, 1].map((slot) => (
        <Box
          key={slot}
          size={[1.9, 0.32, 1.7]}
          position={[slot * 2.02, 1.02, 0.22]}
          material={mats.fabric}
        />
      ))}
      <Box size={[0.46, 1.45, depth - 0.12]} position={[-(length / 2 - 0.24), 1.15, 0.02]} material={mats.fabricDeep} />
      <Box size={[0.46, 1.45, depth - 0.12]} position={[length / 2 - 0.24, 1.15, 0.02]} material={mats.fabricDeep} />
      <Box
        size={[length - 1.05, 1.25, 0.42]}
        position={[0, 1.55, -(depth / 2 - 0.36)]}
        material={mats.fabricDeep}
      />
      {[-1, 0, 1].map((slot) => (
        <Box
          key={`back-${slot}`}
          size={[1.82, 0.95, 0.26]}
          position={[slot * 2.02, 1.78, -(depth / 2 - 0.66)]}
          material={mats.linen}
        />
      ))}
      <Box size={[0.7, 0.18, 0.7]} position={[2.05, 1.22, 0.35]} material={mats.accent} />
    </group>
  )
}

export function CoffeeTable({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      {[
        [-1.45, -0.65],
        [1.45, -0.65],
        [-1.45, 0.65],
        [1.45, 0.65],
      ].map(([x, z], index) => (
        <Box
          key={index}
          size={[0.12, 1.15, 0.12]}
          position={[x ?? 0, 0.58, z ?? 0]}
          material={mats.oakDark}
          tile={1}
        />
      ))}
      <Box size={[3.5, 0.1, 1.85]} position={[0, 1.18, 0]} material={mats.oak} tile={2} />
      <Box size={[3.2, 0.06, 1.55]} position={[0, 0.42, 0]} material={mats.oakLight} tile={2} />
      <Box size={[0.9, 0.04, 0.55]} position={[-0.4, 1.26, 0.1]} material={mats.linen} tile={1} shadow={false} />
      <Box size={[0.28, 0.08, 0.4]} position={[0.55, 1.28, -0.15]} material={mats.oakDark} tile={1} shadow={false} />
      <Cylinder radius={0.12} height={0.16} position={[0.7, 1.36, 0.25]} material={mats.ceramic} segments={16} />
    </group>
  )
}

export function Rug({
  position,
  size,
}: {
  position: Vec3
  size: [number, number]
}) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[position[0], 0.065, position[2]]}
      receiveShadow
      material={mats.rug}
    >
      <planeGeometry args={size} />
    </mesh>
  )
}

export function TvUnit({
  position,
  rotation = 0,
}: {
  position: Vec3
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box size={[6.4, 0.16, 1.55]} position={[0, 0.08, 0]} material={mats.oakDark} />
      <Box size={[6.2, 1.15, 1.4]} position={[0, 0.74, 0]} material={mats.oak} />
      {[-1.55, 0, 1.55].map((x) => (
        <Box
          key={x}
          size={[1.9, 0.95, 0.04]}
          position={[x, 0.72, 0.72]}
          material={mats.oakLight}
          tile={2}
        />
      ))}
      {[-0.7, 0.85].map((x) => (
        <Box key={x} size={[0.08, 0.28, 0.06]} position={[x, 0.72, 0.76]} material={mats.brass} tile={1} />
      ))}
      <Box size={[4.15, 0.12, 0.16]} position={[0, 2.05, 0]} material={mats.metalDark} tile={1} />
      <Box size={[4.05, 2.25, 0.08]} position={[0, 3.22, 0.02]} material={mats.metalDark} tile={1} />
      <Box
        size={[3.82, 2.02, 0.02]}
        position={[0, 3.22, 0.07]}
        material={mats.screen}
        tile={4}
        shadow={false}
      />
    </group>
  )
}

export function FloorLamp({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <Cylinder radius={0.28} height={0.06} position={[0, 0.03, 0]} material={mats.metalDark} segments={16} />
      <Cylinder radius={0.035} height={4.6} position={[0, 2.35, 0]} material={mats.brass} />
      <mesh position={[0.15, 4.7, 0]} material={mats.lampShade} castShadow>
        <sphereGeometry args={[0.38, 16, 12]} />
      </mesh>
      <pointLight position={[0.15, 4.6, 0]} intensity={18} distance={12} decay={2} color="#ffd7a8" />
    </group>
  )
}

export function OutdoorChair({
  position,
  rotation = 0,
}: {
  position: Vec3
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[
        [-0.55, -0.55],
        [0.55, -0.55],
        [-0.55, 0.5],
        [0.55, 0.5],
      ].map(([x, z], index) => (
        <Cylinder
          key={index}
          radius={0.04}
          height={1.35}
          position={[x ?? 0, 0.67, z ?? 0]}
          material={mats.metalDark}
        />
      ))}
      <Box size={[1.35, 0.08, 1.25]} position={[0, 1.15, 0]} material={mats.oak} />
      <Box size={[1.2, 0.1, 1.1]} position={[0, 1.28, 0.02]} material={mats.fabric} />
      <Box size={[1.25, 1.15, 0.08]} position={[0, 1.85, -0.58]} material={mats.metalDark} />
      <Box size={[1.05, 0.7, 0.08]} position={[0, 1.95, -0.5]} material={mats.linen} />
    </group>
  )
}
