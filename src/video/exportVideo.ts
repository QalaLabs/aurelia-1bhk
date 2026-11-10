import { fadeOpacity, samplePath, type PathId } from '../cinematics/CameraPaths.ts'
import { renderAmbience, audioBufferToWav } from './ambience.ts'
import { encoderCapabilities, startFfmpegJob } from './FFmpegEncoder.ts'
import { studioBridge } from './bridge.ts'
import { WebCodecsEncoder } from './webCodecsEncoder.ts'

export type ExportRequest = {
  path: PathId
  spherical: boolean
  duration: number
  width: number
  height: number
  fps: number
  audio: boolean
  signal: AbortSignal
  onProgress: (progress: number, message: string) => void
}

export async function exportVideo(request: ExportRequest) {
  const bridge = studioBridge.current
  if (!bridge) throw new Error('The viewer is not ready to render yet.')
  const frames = Math.max(1, Math.round(request.duration * request.fps))
  const caps = await encoderCapabilities()
  const ambience = request.audio ? await renderAmbience(request.duration) : null
  const notes = [caps.hint]
  let job: Awaited<ReturnType<typeof startFfmpegJob>> | null = null
  let browser: WebCodecsEncoder | null = null

  if (caps.ffmpeg) {
    try {
      job = await startFfmpegJob({
        fps: request.fps,
        width: request.width,
        height: request.height,
        spherical: request.spherical,
        audio: Boolean(ambience),
      })
      if (ambience) await job.audio(audioBufferToWav(ambience))
      notes.push(caps.source === 'system' ? 'Encoding with system FFmpeg.' : 'Encoding with bundled FFmpeg.')
    } catch (error) {
      job = null
      notes.push(error instanceof Error ? error.message : 'FFmpeg job failed.')
    }
  }

  if (!job) {
    browser = new WebCodecsEncoder(request.width, request.height, request.fps, Boolean(ambience))
    await browser.open()
    if (ambience) await browser.addAudio(ambience)
    notes.push('Encoding with the browser H.264 encoder.')
  }

  try {
    bridge.prepare()
    for (let index = 0; index < frames; index += 1) {
      if (request.signal.aborted) throw new Error('Render cancelled')
      const seconds = index / request.fps
      const pose = samplePath(request.path, request.duration <= 0 ? 0 : seconds / request.duration)
      const fade = fadeOpacity(seconds, request.duration)
      request.onProgress(index / frames, `Rendering frame ${index + 1} of ${frames}`)
      const blob = request.spherical
        ? await bridge.captureEquirect(pose.position, request.width, request.height, fade)
        : await bridge.captureFrame(pose, request.width, request.height, fade, index / request.fps)
      if (job) await job.frame(index, blob)
      else await browser?.addFrame(blob, index)
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
    request.onProgress(0.96, request.spherical ? 'Encoding equirectangular H.264' : 'Encoding H.264')
    const blob = job ? await job.finish(request.spherical) : await browser!.finish(request.spherical)
    if (request.spherical) notes.push('Spherical metadata was written into the MP4.')
    return { blob, note: notes.filter(Boolean).join(' ') }
  } catch (error) {
    if (job) await job.cancel().catch(() => undefined)
    throw error
  } finally {
    bridge.restore()
    browser?.close()
  }
}
