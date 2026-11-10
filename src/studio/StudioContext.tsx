import { flushSync } from 'react-dom'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import { useApartment } from '../context/ApartmentContext.tsx'
import type { PathId } from '../cinematics/CameraPaths.ts'
import { exportVideo } from '../video/exportVideo.ts'

export type StudioMode = 'cinematic' | 'spherical'

export type StudioSettings = {
  path: PathId
  mode: StudioMode
  duration: number
  width: number
  height: number
  fps: 24 | 30
  audio: boolean
  dof: boolean
}

type StudioValue = {
  open: boolean
  setOpen: (open: boolean) => void
  settings: StudioSettings
  setSettings: (patch: Partial<StudioSettings>) => void
  previewPlaying: boolean
  playPreview: () => void
  stopPreview: () => void
  time: number
  timeRef: MutableRefObject<number>
  seekSerial: number
  seek: (seconds: number) => void
  publishTime: (seconds: number) => void
  rendering: boolean
  progress: number
  message: string
  error: string
  note: string
  downloadUrl: string | null
  startRender: () => void
  cancelRender: () => void
  xrSupported: boolean | null
  xrPresenting: boolean
  setXrSupported: (supported: boolean) => void
  setXrPresenting: (presenting: boolean) => void
  restoreAfterVr: () => void
  maxTexture: number
  setMaxTexture: (size: number) => void
  driving: boolean
  hideGuides: boolean
}

const StudioContext = createContext<StudioValue | null>(null)

const INITIAL: StudioSettings = {
  path: 'full',
  mode: 'cinematic',
  duration: 30,
  width: 1920,
  height: 1080,
  fps: 30,
  audio: true,
  dof: false,
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const { setView, setFpv } = useApartment()
  const [open, setOpen] = useState(false)
  const [settings, setSettingsState] = useState<StudioSettings>(INITIAL)
  const [previewPlaying, setPreviewPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [seekSerial, setSeekSerial] = useState(0)
  const [rendering, setRendering] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [xrSupported, setXrSupported] = useState<boolean | null>(null)
  const [xrPresenting, setXrPresenting] = useState(false)
  const [maxTexture, setMaxTexture] = useState(8192)
  const timeRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  const setSettings = useCallback((patch: Partial<StudioSettings>) => {
    setSettingsState((current) => {
      const next = { ...current, ...patch }
      if (patch.mode === 'spherical') {
        next.width = 3840
        next.height = 1920
      }
      if (patch.mode === 'cinematic' && next.height * 2 === next.width) {
        next.width = 1920
        next.height = 1080
      }
      return next
    })
  }, [])

  const seek = useCallback((seconds: number) => {
    const next = Math.max(0, seconds)
    timeRef.current = next
    setTime(next)
    setSeekSerial((value) => value + 1)
  }, [])

  const publishTime = useCallback((seconds: number) => {
    timeRef.current = seconds
    setTime(seconds)
  }, [])

  const stopPreview = useCallback(() => setPreviewPlaying(false), [])

  const playPreview = useCallback(() => {
    setFpv(false)
    setError('')
    if (timeRef.current >= settings.duration - 0.05) {
      timeRef.current = 0
      setTime(0)
    }
    setPreviewPlaying(true)
  }, [setFpv, settings.duration])

  const restoreAfterVr = useCallback(() => {
    setFpv(false)
    setView('interior')
  }, [setFpv, setView])

  const cancelRender = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const startRender = useCallback(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setPreviewPlaying(false)
    setError('')
    setNote('')
    setDownloadUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return null
    })
    flushSync(() => {
      setRendering(true)
      setProgress(0)
      setMessage('Preparing frames')
    })
    void exportVideo({
      path: settings.path,
      spherical: settings.mode === 'spherical',
      duration: settings.duration,
      width: settings.width,
      height: settings.height,
      fps: settings.fps,
      audio: settings.audio,
      signal: controller.signal,
      onProgress: (value, text) => {
        setProgress(value)
        setMessage(text)
      },
    })
      .then((result) => {
        if (controller.signal.aborted) return
        setDownloadUrl(URL.createObjectURL(result.blob))
        setNote(result.note)
        setMessage('Export ready')
        setProgress(1)
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted) {
          setMessage('Render cancelled')
          return
        }
        setError(caught instanceof Error ? caught.message : 'Render failed')
        setMessage('Render failed')
      })
      .finally(() => {
        setRendering(false)
      })
  }, [settings])

  const driving = previewPlaying || rendering || xrPresenting

  const value = useMemo<StudioValue>(
    () => ({
      open,
      setOpen,
      settings,
      setSettings,
      previewPlaying,
      playPreview,
      stopPreview,
      time,
      timeRef,
      seekSerial,
      seek,
      publishTime,
      rendering,
      progress,
      message,
      error,
      note,
      downloadUrl,
      startRender,
      cancelRender,
      xrSupported,
      xrPresenting,
      setXrSupported,
      setXrPresenting,
      restoreAfterVr,
      maxTexture,
      setMaxTexture,
      driving,
      hideGuides: driving,
    }),
    [
      open,
      settings,
      setSettings,
      previewPlaying,
      playPreview,
      stopPreview,
      time,
      seekSerial,
      seek,
      publishTime,
      rendering,
      progress,
      message,
      error,
      note,
      downloadUrl,
      startRender,
      cancelRender,
      xrSupported,
      xrPresenting,
      restoreAfterVr,
      maxTexture,
      driving,
    ],
  )

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}

export function useStudio(): StudioValue
export function useStudio<T>(selector: (state: StudioValue) => T): T
export function useStudio<T>(selector?: (state: StudioValue) => T) {
  const value = useContext(StudioContext)
  if (!value) throw new Error('useStudio must be used inside StudioProvider')
  return selector ? selector(value) : (value as T)
}
