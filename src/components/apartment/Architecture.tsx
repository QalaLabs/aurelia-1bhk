import { Balcony } from './Balcony.tsx'
import { Bathroom } from './Bathroom.tsx'
import { Bedroom } from './Bedroom.tsx'
import { Ceilings, Floors } from './Floors.tsx'
import { Foyer } from './Foyer.tsx'
import { Kitchen } from './Kitchen.tsx'
import { LivingRoom } from './LivingRoom.tsx'
import { Ground, Slab, Walls } from './Walls.tsx'

export function Architecture() {
  return (
    <group>
      <Ground />
      <Slab />
      <Floors />
      <Walls />
      <Ceilings />
      <LivingRoom />
      <Bedroom />
      <Kitchen />
      <Bathroom />
      <Foyer />
      <Balcony />
    </group>
  )
}
