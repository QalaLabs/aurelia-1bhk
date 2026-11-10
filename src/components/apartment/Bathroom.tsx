import { mats } from '../../materials/library.ts'
import { useApartment } from '../../context/ApartmentContext.tsx'
import { Box, Cylinder } from './geometry.tsx'
import { Downlight, Mirror } from './decor.tsx'

export function Bathroom() {
  const { visibility } = useApartment()
  const show = visibility.furniture

  return (
    <group>
      <Downlight position={[23.6, 9.55, 17.2]} intensity={36} />
      {show && (
        <>
          <Box size={[5.35, 7.1, 0.04]} position={[20.86, 3.6, 17.4]} material={mats.bathTile} tile={1.4} shadow={false} />
          <Box size={[0.04, 7.1, 7.7]} position={[23.6, 3.6, 21.32]} material={mats.bathTile} tile={1.4} shadow={false} />
          <Box size={[2.5, 7.2, 0.04]} position={[25.05, 3.7, 17.55]} material={mats.bathTile} tile={1.4} shadow={false} />
          <group position={[21.55, 0, 19.7]}>
            <Box size={[1.15, 0.7, 1.7]} position={[0, 0.7, 0]} material={mats.ceramic} />
            <mesh position={[0.05, 1.15, 0.15]} material={mats.ceramic} castShadow>
              <sphereGeometry args={[0.48, 18, 14]} />
            </mesh>
            <Box size={[1.05, 0.1, 1.45]} position={[0.05, 1.42, 0.15]} material={mats.ceramic} />
            <Box size={[1.05, 1.15, 0.45]} position={[-0.05, 1.85, -0.55]} material={mats.ceramic} />
            <Box size={[1.05, 0.08, 0.5]} position={[0.05, 2.15, -0.15]} rotation={[0.9, 0, 0]} material={mats.ceramic} />
          </group>
          <group position={[21.65, 0, 15.2]}>
            <Box size={[1.45, 2.55, 3.1]} position={[0, 1.28, 0]} material={mats.oakLight} />
            <Box size={[1.55, 0.1, 3.2]} position={[0.05, 2.6, 0]} material={mats.marble} tile={1.5} />
            <mesh position={[0.35, 2.72, 0]} material={mats.ceramic} castShadow>
              <cylinderGeometry args={[0.42, 0.36, 0.22, 20]} />
            </mesh>
            <Cylinder radius={0.025} height={0.45} position={[0.15, 3.05, 0]} material={mats.brass} />
            <mesh position={[0.32, 3.25, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.brass}>
              <torusGeometry args={[0.16, 0.025, 8, 14, Math.PI]} />
            </mesh>
          </group>
          <Mirror position={[21.05, 4.55, 15.2]} rotation={Math.PI / 2} width={2.4} height={2.2} />
          <Box size={[0.04, 0.08, 2.2]} position={[21.02, 5.85, 15.2]} material={mats.bulb} tile={1} shadow={false} />
          <pointLight position={[21.4, 5.7, 15.2]} intensity={8} distance={6} decay={2} color="#fff6e8" />
          <Box size={[2.35, 0.12, 3.35]} position={[25.05, 0.1, 19.35]} material={mats.bathFloor} tile={1.2} />
          <Box size={[0.04, 6.4, 3.2]} position={[23.9, 3.3, 19.4]} material={mats.showerGlass} tile={2} shadow={false} />
          <Box size={[0.08, 6.4, 0.08]} position={[23.9, 3.3, 17.8]} material={mats.aluminum} tile={1} />
          <Cylinder radius={0.035} height={0.7} position={[26.05, 6.4, 19.6]} material={mats.brass} />
          <mesh position={[25.7, 6.4, 19.6]} rotation={[0, 0, Math.PI / 2]} material={mats.brass}>
            <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
          </mesh>
          <Box size={[0.08, 0.35, 1.4]} position={[25.55, 3.4, 13.75]} material={mats.brass} tile={1} />
          <Cylinder radius={0.08} height={0.08} position={[21.15, 2.1, 18.5]} material={mats.brass} segments={10} />
        </>
      )}
    </group>
  )
}
