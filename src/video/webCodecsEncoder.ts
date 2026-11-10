import { Muxer, ArrayBufferTarget } from 'mp4-muxer'
import { audioBufferToWav } from './ambience.ts'
import { injectSpherical } from './sphericalMetadata.ts'

function bytesToBlob(bytes: Uint8Array, type: string) {
  const copy = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(copy).set(bytes)
  return new Blob([copy], { type })
}

function avcCodec(width: number, height: number) {
  const pixels = width * height
  if (pixels > 3840 * 2160) return 'avc1.640033'
  if (pixels > 1920 * 1080) return 'avc1.640033'
  return 'avc1.640028'
}

function bitrateFor(width: number, height: number) {
  const pixels = width * height
  if (pixels >= 7680 * 3840) return 45_000_000
  if (pixels >= 3840 * 1920) return 22_000_000
  return 8_000_000
}

export class WebCodecsEncoder {
  private muxer: Muxer<ArrayBufferTarget> | null = null
  private video: VideoEncoder | null = null
  private audio: AudioEncoder | null = null
  private target: ArrayBufferTarget | null = null
  private readonly width: number
  private readonly height: number
  private readonly fps: number
  private readonly withAudio: boolean

  constructor(width: number, height: number, fps: number, withAudio: boolean) {
    this.width = width
    this.height = height
    this.fps = fps
    this.withAudio = withAudio
  }

  async open() {
    if (typeof VideoEncoder === 'undefined') {
      throw new Error('This browser cannot encode H.264. Install FFmpeg and render again.')
    }
    const codec = avcCodec(this.width, this.height)
    const support = await VideoEncoder.isConfigSupported({
      codec,
      width: this.width,
      height: this.height,
      bitrate: bitrateFor(this.width, this.height),
      framerate: this.fps,
      avc: { format: 'avc' },
      hardwareAcceleration: 'prefer-hardware',
    })
    if (!support.supported) {
      throw new Error(`H.264 ${this.width}×${this.height} is not supported by this GPU.`)
    }
    this.target = new ArrayBufferTarget()
    this.muxer = new Muxer({
      target: this.target,
      fastStart: 'in-memory',
      video: { codec: 'avc', width: this.width, height: this.height, frameRate: this.fps },
      audio: this.withAudio ? { codec: 'aac', numberOfChannels: 2, sampleRate: 48000 } : undefined,
      firstTimestampBehavior: 'offset',
    })
    this.video = new VideoEncoder({
      output: (chunk, meta) => this.muxer?.addVideoChunk(chunk, meta),
      error: (error) => {
        throw error
      },
    })
    this.video.configure({
      codec,
      width: this.width,
      height: this.height,
      bitrate: bitrateFor(this.width, this.height),
      framerate: this.fps,
      latencyMode: 'quality',
      avc: { format: 'avc' },
      hardwareAcceleration: 'prefer-hardware',
    })
    if (this.withAudio) {
      this.audio = new AudioEncoder({
        output: (chunk, meta) => this.muxer?.addAudioChunk(chunk, meta),
        error: (error) => {
          throw error
        },
      })
      this.audio.configure({
        codec: 'mp4a.40.2',
        sampleRate: 48000,
        numberOfChannels: 2,
        bitrate: 128000,
      })
    }
  }

  async addFrame(blob: Blob, index: number) {
    if (!this.video) throw new Error('Encoder is not open')
    const bitmap = await createImageBitmap(blob)
    const frame = new VideoFrame(bitmap, {
      timestamp: Math.round((index * 1_000_000) / this.fps),
      duration: Math.round(1_000_000 / this.fps),
    })
    this.video.encode(frame, { keyFrame: index % (this.fps * 2) === 0 })
    frame.close()
    bitmap.close()
  }

  async addAudio(buffer: AudioBuffer) {
    if (!this.audio) return
    const frameCount = 1024
    const left = buffer.getChannelData(0)
    const right = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : left
    for (let offset = 0; offset < buffer.length; offset += frameCount) {
      const frames = Math.min(frameCount, buffer.length - offset)
      const data = new Float32Array(frames * 2)
      data.set(left.subarray(offset, offset + frames), 0)
      data.set(right.subarray(offset, offset + frames), frames)
      const audio = new AudioData({
        format: 'f32-planar',
        sampleRate: buffer.sampleRate,
        numberOfFrames: frames,
        numberOfChannels: 2,
        timestamp: Math.round((offset / buffer.sampleRate) * 1_000_000),
        data,
      })
      this.audio.encode(audio)
      audio.close()
    }
  }

  async finish(spherical: boolean) {
    if (!this.video || !this.muxer || !this.target) throw new Error('Encoder is not open')
    await this.video.flush()
    if (this.audio) await this.audio.flush()
    this.muxer.finalize()
    const bytes = new Uint8Array(this.target.buffer)
    const tagged = spherical ? injectSpherical(bytes) : bytes
    return bytesToBlob(tagged, 'video/mp4')
  }

  close() {
    try {
      this.video?.close()
      this.audio?.close()
    } catch {
      /* encoder may already be closed */
    }
  }
}

export { audioBufferToWav }
