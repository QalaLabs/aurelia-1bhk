import { useLayoutEffect, useMemo, useRef } from 'react'
import type { InstancedMesh } from 'three'
import { Object3D } from 'three'
import { mats } from '../../materials/library.ts'
import { useApartment } from '../../context/ApartmentContext.tsx'
import { Box } from './geometry.tsx'
import { Plant } from './decor.tsx'
import { OutdoorChair } from './seating.tsx'

function Posts() {
  const ref = useRef<InstancedMesh>(null)
  const points = useMemo(() => {
    const list: [number, number, number][] = []
    for (let x = 3.75; x <= 11.25; x += 0.55) list.push([x, 1.7, -4.05])
    for (let z = -3.6; z <= -0.9; z += 0.55) {
      list.push([3.62, 1.7, z])
      list.push([11.38, 1.7, z])
    }
    return list
  }, [])

  useLayoutEffect(() => {
    const dummy = new Object3D()
    const mesh = ref.current
    if (!mesh) return
    points.forEach((point, index) => {
      dummy.position.set(point[0], point[1], point[2])
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [points])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, points.length]} castShadow material={mats.metalDark}>
      <cylinderGeometry args={[0.035, 0.035, 3.4, 8]} />
    </instancedMesh>
  )
}

export function Balcony() {
  const { visibility } = useApartment()

  return (
    <group>
      <Posts />
      <Box size={[8.1, 0.08, 0.08]} position={[7.5, 3.42, -4.08]} material={mats.metalDark} tile={2} />
      <Box size={[0.08, 0.08, 3.4]} position={[3.58, 3.42, -2.4]} material={mats.metalDark} tile={2} />
      <Box size={[0.08, 0.08, 3.4]} position={[11.42, 3.42, -2.4]} material={mats.metalDark} tile={2} />
      <Box size={[7.6, 3.05, 0.04]} position={[7.5, 1.7, -4.02]} material={mats.glass} tile={3} shadow={false} />
      <Box size={[0.04, 3.05, 3.1]} position={[3.58, 1.7, -2.35]} material={mats.glass} tile={3} shadow={false} />
      <Box size={[0.04, 3.05, 3.1]} position={[11.42, 1.7, -2.35]} material={mats.glass} tile={3} shadow={false} />
      <Box size={[0.2, 0.35, 0.25]} position={[11.1, 5.4, -0.85]} material={mats.metalDark} tile={1} />
      <mesh position={[11.05, 5.25, -1.05]} material={mats.bulb}>
        <sphereGeometry args={[0.1, 12, 10]} />
      </mesh>
      <pointLight position={[10.2, 5.1, -1.4]} intensity={14} distance={10} decay={2} color="#ffe0b8" />
      {visibility.furniture && (
        <>
          <OutdoorChair position={[5.3, 0, -2.55]} rotation={Math.PI} />
          <OutdoorChair position={[9.2, 0, -2.55]} rotation={Math.PI} />
          <Box size={[1.3, 0.08, 1.3]} position={[7.25, 1.15, -2.5]} material={mats.oak} />
          <CylinderLite />
          <Plant position={[4.15, 0, -3.45]} scale={0.72} />
          <Plant position={[10.7, 0, -3.45]} scale={0.85} />
        </>
      )}
    </group>
  )
}

function CylinderLite() {
  return (
    <mesh position={[7.25, 0.58, -2.5]} material={mats.metalDark} castShadow>
      <cylinderGeometry args={[0.08, 0.1, 1.15, 10]} />
    </mesh>
  )
}
