import { Bath, BedDouble, ChefHat, DoorOpen, Sofa, TreePalm } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ROOMS } from '../../data/layout.ts'
import type { RoomId } from '../../types/apartment.ts'
import { useApartment } from '../../context/ApartmentContext.tsx'

const ICONS: Record<RoomId, LucideIcon> = {
  foyer: DoorOpen,
  living: Sofa,
  bedroom: BedDouble,
  kitchen: ChefHat,
  bathroom: Bath,
  balcony: TreePalm,
}

const ORDER: RoomId[] = ['foyer', 'living', 'bedroom', 'kitchen', 'bathroom', 'balcony']

export function LeftSidebar({ open }: { open: boolean }) {
  const { selected, selectRoom } = useApartment()
  if (!open) return null

  return (
    <aside className="absolute top-3 bottom-3 left-3 z-20 flex w-[272px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#171b20] shadow-2xl shadow-black/40">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-[11px] tracking-[0.16em] text-[#9c958b] uppercase">Rooms</p>
        <p className="font-display mt-1 text-lg text-[#f6f1e8]">Navigate the plan</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2" aria-label="Rooms">
        {ORDER.map((id) => {
          const room = ROOMS.find((item) => item.id === id)
          if (!room) return null
          const Icon = ICONS[id]
          const active = selected === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => selectRoom(id, true)}
              aria-current={active ? 'true' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                active
                  ? 'border-[#c6a36a]/50 bg-[#2a241c] text-[#f6f1e8]'
                  : 'border-transparent text-[#d7d1c7] hover:bg-white/5'
              }`}
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                  active ? 'bg-[#c6a36a] text-[#1b140c]' : 'bg-white/5 text-[#c6a36a]'
                }`}
              >
                <Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-medium">{room.name}</span>
                <span className="block text-[12px] text-[#a39c92]">
                  {room.dimensions} · {room.areaLabel}
                </span>
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
