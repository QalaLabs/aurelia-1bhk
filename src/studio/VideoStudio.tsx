import { useEffect, useState } from 'react'
import { encoderCapabilities, type EncoderCaps } from '../video/FFmpegEncoder.ts'
import { PreviewPanel } from './PreviewPanel.tsx'
import { RenderControls } from './RenderControls.tsx'
import { useStudio } from './StudioContext.tsx'

export function VideoStudio() {
  const { open, setOpen, xrSupported } = useStudio()
  const [caps, setCaps] = useState<EncoderCaps | null>(null)

  useEffect(() => {
    if (!open) return
    let stop = false
    void encoderCapabilities().then((value) => {
      if (!stop) setCaps(value)
    })
    return () => {
      stop = true
    }
  }, [open])

  if (!open) return null

  return (
    <aside className="absolute top-3 right-3 bottom-3 z-40 flex w-[min(100%-1.5rem,380px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#171b20] shadow-2xl">
      <header className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <p className="font-display text-[15px] font-semibold text-[#f6f1e8]">Presentation studio</p>
          <p className="text-[12px] text-[#a39c92]">Cinematic and equirectangular export</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="h-8 rounded-md px-2 text-[12px] text-[#d9d3c8] hover:bg-white/5"
        >
          Close
        </button>
      </header>
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
        <RenderControls />
        <PreviewPanel />
        <div className="space-y-2 border-t border-white/10 pt-3 text-[12px] leading-relaxed text-[#a39c92]">
          <p>
            {xrSupported
              ? 'WebXR immersive VR is available. Enter VR from the top bar. Quest browsers need the HTTPS dev server.'
              : 'WebXR immersive VR was not detected. Walk mode remains the desktop and mobile fallback. Quest: npm run dev:vr, then open the https address.'}
          </p>
          <p>{caps?.hint ?? 'Checking the encoder...'}</p>
          <p>360 export renders a cubemap and projects it to a 2:1 equirectangular frame. It is not a screen recording.</p>
        </div>
      </div>
    </aside>
  )
}
