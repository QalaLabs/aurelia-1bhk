import { injectSpherical } from './sphericalMetadata.ts'

function bytesToBlob(bytes: Uint8Array, type: string) {
  const copy = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(copy).set(bytes)
  return new Blob([copy], { type })
}

export type EncoderCaps = {
  ffmpeg: boolean
  source: 'system' | 'bundled' | 'none'
  hint: string
}

const FFMPEG_HINT = [
  'System FFmpeg was not found.',
  'Install it with: winget install Gyan.FFmpeg',
  'Windows builds: https://www.gyan.dev/ffmpeg/builds/',
].join(' ')

export async function encoderCapabilities(): Promise<EncoderCaps> {
  try {
    const response = await fetch('/api/render/capabilities')
    if (!response.ok) throw new Error('missing')
    const body = (await response.json()) as EncoderCaps
    return body
  } catch {
    return {
      ffmpeg: false,
      source: 'none',
      hint: `${FFMPEG_HINT} This session will use the browser H.264 encoder.`,
    }
  }
}

export class FFmpegJob {
  private readonly id: string

  constructor(id: string) {
    this.id = id
  }

  async frame(index: number, blob: Blob) {
    const response = await fetch(`/api/render/frame?id=${this.id}&index=${index}`, {
      method: 'POST',
      headers: { 'content-type': 'image/jpeg' },
      body: blob,
    })
    if (!response.ok) throw new Error(await response.text())
  }

  async audio(wav: ArrayBuffer) {
    const response = await fetch(`/api/render/audio?id=${this.id}`, {
      method: 'POST',
      headers: { 'content-type': 'audio/wav' },
      body: wav,
    })
    if (!response.ok) throw new Error(await response.text())
  }

  async finish(spherical: boolean) {
    const response = await fetch(`/api/render/finish?id=${this.id}`, { method: 'POST' })
    if (!response.ok) throw new Error(await response.text())
    const file = await fetch(`/api/render/file?id=${this.id}`)
    if (!file.ok) throw new Error(await file.text())
    const bytes = new Uint8Array(await file.arrayBuffer())
    const tagged = spherical ? injectSpherical(bytes) : bytes
    return bytesToBlob(tagged, 'video/mp4')
  }

  async cancel() {
    await fetch(`/api/render/cancel?id=${this.id}`, { method: 'POST' })
  }
}

export async function startFfmpegJob(options: {
  fps: number
  width: number
  height: number
  spherical: boolean
  audio: boolean
}) {
  const response = await fetch('/api/render/start', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(options),
  })
  if (!response.ok) throw new Error(await response.text())
  const body = (await response.json()) as { id: string }
  return new FFmpegJob(body.id)
}

export { FFMPEG_HINT }
