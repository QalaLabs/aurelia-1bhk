import { Html } from '@react-three/drei'
import { ROOMS } from '../../data/layout.ts'
import { useApartment } from '../../context/ApartmentContext.tsx'
import { useStudio } from '../../studio/StudioContext.tsx'

export function RoomLabels() {
  const { visibility, selected } = useApartment()
  const hideGuides = useStudio((state) => state.hideGuides)
  if (!visibility.labels || hideGuides) return null

  return (
    <group>
      {ROOMS.map((room) => {
        const active = selected === room.id
        return (
          <Html
            key={room.id}
            position={[(room.x0 + room.x1) / 2, 0.45, (room.z0 + room.z1) / 2]}
            center
            distanceFactor={34}
            zIndexRange={[4, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <div
              className={`rounded-full px-3 py-1 text-[11px] tracking-wide whitespace-nowrap ${
                active
                  ? 'bg-[#c6a36a] text-[#1a140c]'
                  : 'bg-[#14171c]/80 text-[#f3efe6] border border-white/15'
              }`}
            >
              {room.name}
              <span className={active ? 'text-[#3a2c18]' : 'text-[#b7b1a6]'}> · {room.dimensions}</span>
            </div>
          </Html>
        )
      })}
    </group>
  )
}
