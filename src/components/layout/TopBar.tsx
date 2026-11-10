import { Headset, House, Maximize2, PanelLeft, PanelRight, RotateCcw, Clapperboard } from 'lucide-react'
import { CARPET_SQFT } from '../../data/layout.ts'
import { useApartment } from '../../context/ApartmentContext.tsx'
import { useStudio } from '../../studio/StudioContext.tsx'
import { vrActions } from '../../vr/WebXRManager.tsx'

export function TopBar({
  showNav,
  showInfo,
  onToggleNav,
  onToggleInfo,
}: {
  showNav: boolean
  showInfo: boolean
  onToggleNav: () => void
  onToggleInfo: () => void
}) {
  const { view, setView, resetView, setFpv } = useApartment()
  const { open, setOpen, xrSupported, xrPresenting } = useStudio()

  const fullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
      return
    }
    void document.documentElement.requestFullscreen()
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/10 bg-[#14171c] px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#c6a36a] text-[#1b140c]">
          <House size={18} strokeWidth={2.2} />
        </span>
        <div className="min-w-0">
          <p className="font-display truncate text-[15px] font-semibold tracking-tight text-[#f6f1e8]">
            Aurelia 1BHK
          </p>
          <p className="truncate text-[11px] text-[#a39c92]">
            Contemporary apartment · {CARPET_SQFT} sq ft carpet
          </p>
        </div>
      </div>

      <div className="mx-auto hidden items-center rounded-lg border border-white/10 bg-[#101216] p-1 md:flex">
        <button
          type="button"
          aria-pressed={view === 'iso' || view === 'interior'}
          onClick={() => setView('iso')}
          className={`h-8 rounded-md px-3 text-[13px] ${
            view !== 'top' ? 'bg-[#2a241c] text-[#f0d7ae]' : 'text-[#c9c2b6] hover:text-white'
          }`}
        >
          3D View
        </button>
        <button
          type="button"
          aria-pressed={view === 'top'}
          onClick={() => setView('top')}
          className={`h-8 rounded-md px-3 text-[13px] ${
            view === 'top' ? 'bg-[#2a241c] text-[#f0d7ae]' : 'text-[#c9c2b6] hover:text-white'
          }`}
        >
          Floor Plan
        </button>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={onToggleNav}
          aria-pressed={showNav}
          aria-label="Toggle room list"
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-[#d9d3c8] hover:bg-white/5"
        >
          <PanelLeft size={16} />
        </button>
        <button
          type="button"
          onClick={onToggleInfo}
          aria-pressed={showInfo}
          aria-label="Toggle room details"
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-[#d9d3c8] hover:bg-white/5"
        >
          <PanelRight size={16} />
        </button>
        <button
          type="button"
          aria-pressed={open}
          onClick={() => setOpen(!open)}
          className={`hidden h-9 items-center gap-2 rounded-lg border px-3 text-[13px] sm:flex ${
            open ? 'border-[#c6a36a]/60 bg-[#2a241c] text-[#f0d7ae]' : 'border-white/10 text-[#f3efe6] hover:bg-white/5'
          }`}
        >
          <Clapperboard size={14} />
          Studio
        </button>
        <button
          type="button"
          aria-pressed={xrPresenting}
          disabled={xrSupported === false}
          title={
            xrSupported
              ? 'Enter room-scale VR. Teleport with the trigger. Move with the stick.'
              : 'No immersive VR headset detected. Use Walk. Quest needs npm run dev:vr over HTTPS.'
          }
          onClick={() => {
            setFpv(false)
            if (xrPresenting) void vrActions.exit?.()
            else void vrActions.enter?.()
          }}
          className="hidden h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-[13px] text-[#f3efe6] hover:bg-white/5 disabled:opacity-40 sm:flex"
        >
          <Headset size={14} />
          {xrPresenting ? 'Exit VR' : 'Enter VR'}
        </button>
        <button
          type="button"
          onClick={resetView}
          className="hidden h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-[13px] text-[#f3efe6] hover:bg-white/5 sm:flex"
        >
          <RotateCcw size={14} />
          Reset View
        </button>
        <button
          type="button"
          onClick={fullscreen}
          className="hidden h-9 items-center gap-2 rounded-lg bg-[#c6a36a] px-3 text-[13px] font-medium text-[#1b140c] hover:bg-[#d4b57e] sm:flex"
        >
          <Maximize2 size={14} />
          Fullscreen
        </button>
      </div>
    </header>
  )
}
