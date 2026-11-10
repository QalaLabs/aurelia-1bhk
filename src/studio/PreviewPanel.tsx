import { useEffect, useRef } from 'react'
import { fadeOpacity } from '../cinematics/CameraPaths.ts'
import { renderAmbience } from '../video/ambience.ts'
import { useStudio } from './StudioContext.tsx'

export function PreviewPanel() {
  const {
    settings,
    previewPlaying,
    playPreview,
    stopPreview,
    time,
    seek,
    rendering,
    progress,
    message,
    error,
    note,
    downloadUrl,
    startRender,
    cancelRender,
  } = useStudio()
  const audio = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (!previewPlaying || !settings.audio) return
    const context = new AudioContext()
    audio.current = context
    let source: AudioBufferSourceNode | null = null
    let stop = false
    void renderAmbience(settings.duration).then((buffer) => {
      if (stop) return
      source = context.createBufferSource()
      source.buffer = buffer
      source.connect(context.destination)
      source.start(0, Math.min(buffer.duration - 0.05, time))
    })
    return () => {
      stop = true
      try {
        source?.stop()
      } catch {
        /* already stopped */
      }
      void context.close()
    }
    // Restart only when playback begins. Scrubbing restarts from the button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewPlaying, settings.audio, settings.duration])

  const fade = fadeOpacity(time, settings.duration)
  const filename = settings.mode === 'spherical' ? 'aurelia-360.mp4' : 'aurelia-cinematic.mp4'

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={rendering}
          onClick={() => (previewPlaying ? stopPreview() : playPreview())}
          className="h-9 flex-1 rounded-lg bg-[#c6a36a] text-[13px] font-medium text-[#1b140c] disabled:opacity-40"
        >
          {previewPlaying ? 'Stop preview' : 'Preview path'}
        </button>
        <button
          type="button"
          disabled={rendering}
          onClick={startRender}
          className="h-9 flex-1 rounded-lg border border-[#c6a36a]/50 text-[13px] text-[#f0d7ae] disabled:opacity-40"
        >
          Render
        </button>
      </div>

      <label className="block space-y-1">
        <span className="flex justify-between text-[11px] text-[#a39c92]">
          <span>Timeline</span>
          <span>
            {time.toFixed(1)}s / {settings.duration.toFixed(0)}s
          </span>
        </span>
        <input
          type="range"
          min={0}
          max={settings.duration}
          step={0.1}
          value={Math.min(settings.duration, time)}
          disabled={rendering}
          onChange={(event) => {
            if (previewPlaying) stopPreview()
            seek(Number(event.target.value))
          }}
          className="w-full accent-[#c6a36a]"
        />
      </label>

      {fade > 0.02 && (previewPlaying || time < 0.2 || time > settings.duration - 1.3) ? (
        <p className="text-[11px] text-[#a39c92]">Opening and closing fade is in the preview and the file.</p>
      ) : null}

      {(rendering || message) && (
        <div className="space-y-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-[#c6a36a]" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <div className="flex items-center justify-between gap-2 text-[12px] text-[#d9d3c8]">
            <span>{message}</span>
            {rendering ? (
              <button type="button" onClick={cancelRender} className="text-[#f0d7ae]">
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      )}

      {error ? <p className="text-[12px] text-[#e7b4a4]">{error}</p> : null}
      {note ? <p className="text-[12px] leading-relaxed text-[#a39c92]">{note}</p> : null}

      {downloadUrl ? (
        <a
          href={downloadUrl}
          download={filename}
          className="flex h-10 items-center justify-center rounded-lg bg-[#f3efe6] text-[13px] font-medium text-[#1b140c]"
        >
          Export video
        </a>
      ) : null}
    </div>
  )
}
