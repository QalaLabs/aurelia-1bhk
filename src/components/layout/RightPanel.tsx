import { Eye, EyeOff } from 'lucide-react'
import { CARPET_SQFT, roomById } from '../../data/layout.ts'
import type { Visibility } from '../../types/apartment.ts'
import { useApartment } from '../../context/ApartmentContext.tsx'

const TOGGLES: { key: keyof Visibility; label: string }[] = [
  { key: 'walls', label: 'Walls' },
  { key: 'ceiling', label: 'Ceiling' },
  { key: 'furniture', label: 'Furniture' },
  { key: 'labels', label: 'Room labels' },
]

export function RightPanel({ open }: { open: boolean }) {
  const { selected, visibility, toggle } = useApartment()
  if (!open) return null
  const room = selected ? roomById(selected) : null

  return (
    <aside className="absolute top-3 right-3 bottom-3 z-20 flex w-[300px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#171b20] shadow-2xl shadow-black/40">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-[11px] tracking-[0.16em] text-[#9c958b] uppercase">
          {room ? 'Selected room' : 'Apartment'}
        </p>
        <h2 className="font-display mt-1 text-xl text-[#f6f1e8]">
          {room ? room.name : 'Aurelia 1BHK'}
        </h2>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
        {room ? (
          <>
            <p className="text-[13px] leading-relaxed text-[#c9c2b6]">{room.summary}</p>
            <dl className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-white/5 px-3 py-2">
                <dt className="text-[11px] text-[#9c958b]">Dimensions</dt>
                <dd className="mt-1 text-[14px] text-[#f6f1e8]">{room.dimensions}</dd>
              </div>
              <div className="rounded-xl bg-white/5 px-3 py-2">
                <dt className="text-[11px] text-[#9c958b]">Area</dt>
                <dd className="mt-1 text-[14px] text-[#f6f1e8]">{room.areaLabel}</dd>
              </div>
            </dl>
            <section>
              <h3 className="text-[11px] tracking-[0.14em] text-[#9c958b] uppercase">Finishes</h3>
              <ul className="mt-2 space-y-1.5 text-[13px] text-[#e7e1d6]">
                {room.finishes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c6a36a]" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-[11px] tracking-[0.14em] text-[#9c958b] uppercase">Furniture</h3>
              <ul className="mt-2 space-y-1.5 text-[13px] text-[#e7e1d6]">
                {room.furniture.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <p className="text-[13px] leading-relaxed text-[#c9c2b6]">
            {CARPET_SQFT} sq ft carpet across living, bedroom, closed kitchen, foyer, and attached
            bath, plus a south balcony. Select a room to read its dimensions and fit-out.
          </p>
        )}

        <section>
          <h3 className="text-[11px] tracking-[0.14em] text-[#9c958b] uppercase">Visibility</h3>
          <div className="mt-2 space-y-1">
            {TOGGLES.map((item) => {
              const on = visibility[item.key]
              return (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(item.key)}
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-white/10 px-3 text-[13px] text-[#f3efe6] hover:bg-white/5"
                >
                  <span>{item.label}</span>
                  <span className="flex items-center gap-1.5 text-[#c6a36a]">
                    {on ? <Eye size={15} /> : <EyeOff size={15} />}
                    {on ? 'Shown' : 'Hidden'}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </aside>
  )
}
