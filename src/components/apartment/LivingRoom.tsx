import { useApartment } from '../../context/ApartmentContext.tsx'
import { CeilingFan, Curtain, Plant, WallArt } from './decor.tsx'
import { CoffeeTable, FloorLamp, Rug, Sofa, TvUnit } from './seating.tsx'

export function LivingRoom() {
  const { visibility } = useApartment()
  return (
    <group>
      <CeilingFan position={[7.2, 9.15, 6.4]} />
      {visibility.furniture && (
        <>
          <Rug position={[5.4, 0, 6.3]} size={[8.6, 6.8]} />
          <Sofa position={[5.3, 0, 4.85]} />
          <CoffeeTable position={[5.4, 0, 7.85]} />
          <TvUnit position={[3.7, 0, 12.15]} rotation={Math.PI} />
          <Plant position={[13.4, 0, 1.35]} />
          <Plant position={[1.25, 0, 11.15]} scale={0.8} />
          <WallArt position={[14.82, 5.3, 8.6]} rotation={-Math.PI / 2} width={2.8} height={1.9} />
          <Curtain position={[0.22, 4.55, 6.2]} rotation={Math.PI / 2} width={5.6} height={6.4} />
          <FloorLamp position={[12.4, 0, 4.4]} />
        </>
      )}
    </group>
  )
}
