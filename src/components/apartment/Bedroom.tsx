import { useApartment } from '../../context/ApartmentContext.tsx'
import { Bed, Nightstand, Wardrobe } from './bedroomSet.tsx'
import { CeilingFan, Curtain, Mirror } from './decor.tsx'

export function Bedroom() {
  const { visibility } = useApartment()
  return (
    <group>
      <CeilingFan position={[21.2, 9.15, 7.4]} />
      {visibility.furniture && (
        <>
          <Bed position={[19.2, 0, 8.5]} rotation={Math.PI / 2} />
          <Nightstand position={[16.85, 0, 5.15]} />
          <Nightstand position={[16.85, 0, 11.7]} />
          <Wardrobe position={[18.45, 0, 1.1]} />
          <Mirror position={[20.6, 4.7, 12.78]} width={2.15} height={4.3} />
          <Curtain position={[26.15, 4.7, 7.2]} rotation={-Math.PI / 2} width={5.8} height={7.2} />
          <Curtain position={[23.7, 4.9, 0.22]} width={3.8} height={6.6} />
        </>
      )}
    </group>
  )
}
