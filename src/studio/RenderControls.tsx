import { PATH_LABELS, type PathId } from '../cinematics/CameraPaths.ts'
import { useStudio, type StudioMode } from './StudioContext.tsx'

const PATHS = Object.keys(PATH_LABELS) as PathId[]

const DURATIONS = [
  { label: '30s teaser', value: 30 },
  { label: '60s walk', value: 60 },
  { label: '90s tour', value: 90 },
]

function choice(active: boolean) {
  return `h-8 rounded-md px-2.5 text-[12px] ${
    active ? 'bg-[#2a241c] text-[#f0d7ae]' : 'text-[#c9c2b6] hover:text-white'
  }`
}

export function RenderControls() {
  const { settings, setSettings, maxTexture, rendering } = useStudio()
  const spherical = settings.mode === 'spherical'
  const resolutions = spherical
    ? [
        { label: '3840 × 1920', width: 3840, height: 1920 },
        { label: '7680 × 3840', width: 7680, height: 3840 },
      ]
    : [
        { label: '1920 × 1080', width: 1920, height: 1080 },
        { label: '3840 × 2160', width: 3840, height: 2160 },
      ]

  const setMode = (mode: StudioMode) => setSettings({ mode })

  return (
    <div className="space-y-4">
      <fieldset className="space-y-2" disabled={rendering}>
        <legend className="text-[11px] uppercase tracking-[0.14em] text-[#a39c92]">Format</legend>
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-[#101216] p-1">
          <button type="button" className={choice(!spherical)} onClick={() => setMode('cinematic')}>
            Cinematic
          </button>
          <button type="button" className={choice(spherical)} onClick={() => setMode('spherical')}>
            360°
          </button>
        </div>
      </fieldset>

      <label className="block space-y-2">
        <span className="text-[11px] uppercase tracking-[0.14em] text-[#a39c92]">Camera path</span>
        <select
          value={settings.path}
          disabled={rendering}
          onChange={(event) => setSettings({ path: event.target.value as PathId })}
          className="h-10 w-full rounded-lg border border-white/10 bg-[#101216] px-3 text-[13px] text-[#f3efe6]"
        >
          {PATHS.map((id) => (
            <option key={id} value={id}>
              {PATH_LABELS[id]}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.14em] text-[#a39c92]">Duration</span>
        <div className="grid grid-cols-3 gap-1">
          {DURATIONS.map((item) => (
            <button
              key={item.value}
              type="button"
              disabled={rendering}
              onClick={() => setSettings({ duration: item.value })}
              className={`h-8 rounded-md border border-white/10 text-[12px] ${
                settings.duration === item.value ? 'bg-[#2a241c] text-[#f0d7ae]' : 'text-[#c9c2b6]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="flex items-center justify-between gap-3 text-[12px] text-[#c9c2b6]">
          Custom seconds
          <input
            type="number"
            min={1}
            max={180}
            disabled={rendering}
            value={settings.duration}
            onChange={(event) => {
              const next = Number(event.target.value)
              if (Number.isFinite(next)) setSettings({ duration: Math.min(180, Math.max(1, next)) })
            }}
            className="h-8 w-20 rounded-md border border-white/10 bg-[#101216] px-2 text-[#f3efe6]"
          />
        </label>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.14em] text-[#a39c92]">Resolution</span>
        <div className="grid grid-cols-2 gap-1">
          {resolutions.map((item) => {
            const active = settings.width === item.width && settings.height === item.height
            const blocked = item.width > maxTexture || item.height > maxTexture
            return (
              <button
                key={item.label}
                type="button"
                disabled={rendering || blocked}
                onClick={() => setSettings({ width: item.width, height: item.height })}
                className={`h-8 rounded-md border border-white/10 text-[12px] ${
                  active ? 'bg-[#2a241c] text-[#f0d7ae]' : 'text-[#c9c2b6]'
                } disabled:opacity-40`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 space-y-2">
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#a39c92]">FPS</span>
          <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-[#101216] p-1">
            {([24, 30] as const).map((fps) => (
              <button
                key={fps}
                type="button"
                disabled={rendering}
                onClick={() => setSettings({ fps })}
                className={choice(settings.fps === fps)}
              >
                {fps}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 text-[13px] text-[#f3efe6]">
        <label className="flex items-center justify-between gap-3">
          Ambient score
          <input
            type="checkbox"
            checked={settings.audio}
            disabled={rendering}
            onChange={(event) => setSettings({ audio: event.target.checked })}
          />
        </label>
        <label className="flex items-center justify-between gap-3">
          Depth of field
          <input
            type="checkbox"
            checked={settings.dof}
            disabled={rendering}
            onChange={(event) => setSettings({ dof: event.target.checked })}
          />
        </label>
      </div>
    </div>
  )
}
