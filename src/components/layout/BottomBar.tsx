import { Hand, Move3d, PersonStanding, Square, ZoomIn } from 'lucide-react'
import type { NavTool, ViewPreset } from '../../types/apartment.ts'
import { useApartment } from '../../context/ApartmentContext.tsx'

const TOOLS: { id: NavTool; label: string; icon: typeof Move3d }[] = [
  { id: 'orbit', label: 'Orbit', icon: Move3d },
  { id: 'zoom', label: 'Zoom', icon: ZoomIn },
  { id: 'pan', label: 'Pan', icon: Hand },
]

const PRESETS: { id: ViewPreset; label: string }[] = [
  { id: 'iso', label: 'Isometric' },
  { id: 'top', label: 'Top' },
  { id: 'interior', label: 'Interior' },
]

export function BottomBar() {
  const { tool, setTool, view, setView, fpv, setFpv, framedRoom } = useApartment()

  return (
    <footer className="flex h-16 shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-[#14171c] px-3 sm:px-4">
      <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#101216] p-1">
        {TOOLS.map((item) => {
          const Icon = item.icon
          const active = tool === item.id && !fpv
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setFpv(false)
                setTool(item.id)
              }}
              className={`flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] ${
                active ? 'bg-[#2a241c] text-[#f0d7ae]' : 'text-[#c9c2b6] hover:text-white'
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-1 overflow-x-auto">
        {PRESETS.map((item) => {
          const active = !fpv && !framedRoom && view === item.id
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setView(item.id)}
              className={`flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-[13px] ${
                active
                  ? 'border-[#c6a36a]/60 bg-[#2a241c] text-[#f0d7ae]'
                  : 'border-white/10 text-[#c9c2b6] hover:text-white'
              }`}
            >
              {item.id === 'top' ? <Square size={14} /> : null}
              {item.label}
            </button>
          )
        })}
        <button
          type="button"
          aria-pressed={fpv}
          onClick={() => setFpv(!fpv)}
          className={`flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-[13px] ${
            fpv
              ? 'border-[#c6a36a]/60 bg-[#c6a36a] text-[#1b140c]'
              : 'border-white/10 text-[#c9c2b6] hover:text-white'
          }`}
        >
          <PersonStanding size={15} />
          Walk
        </button>
      </div>
    </footer>
  )
}
